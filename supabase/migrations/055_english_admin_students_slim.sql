-- 055: slimmer english_admin_students() payload
-- Resolves the displayed name in SQL (same rule as resolveDisplayedName in
-- /api/english/admin/students) so meta_name is no longer sent, and omits null fields.

CREATE OR REPLACE FUNCTION english_admin_students()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(json_agg(json_strip_nulls(row_to_json(s)) ORDER BY s.last_active_at DESC NULLS LAST, s.user_id), '[]'::json)
  FROM (
    SELECT
      b.user_id,
      CASE
        WHEN b.meta_name <> '' AND b.meta_name <> b.email_slug THEN b.meta_name
        WHEN b.db_name   <> '' AND b.db_name   <> b.email_slug THEN b.db_name
        ELSE COALESCE(NULLIF(b.db_name, ''), NULLIF(b.meta_name, ''))
      END AS full_name,
      b.email,
      b.current_level,
      b.total_xp,
      b.current_streak,
      b.last_active_at,
      b.group_id,
      b.lessons_done
    FROM (
      SELECT
        p.user_id,
        COALESCE(trim(p.full_name), '') AS db_name,
        COALESCE(NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''), trim(u.raw_user_meta_data->>'name'), '') AS meta_name,
        split_part(COALESCE(u.email, ''), '@', 1) AS email_slug,
        COALESCE(u.email, '') AS email,
        p.current_level,
        p.total_xp,
        p.current_streak,
        p.last_active_at,
        p.group_id,
        COALESCE(lp.cnt, 0) AS lessons_done
      FROM english_user_profiles p
      LEFT JOIN auth.users u ON u.id = p.user_id
      LEFT JOIN (
        SELECT elp.user_id, count(*) AS cnt
        FROM english_lesson_progress elp
        WHERE elp.completed
        GROUP BY elp.user_id
      ) lp ON lp.user_id = p.user_id
      WHERE p.role = 'student'
    ) b
  ) s;
$$;

REVOKE ALL ON FUNCTION english_admin_students() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION english_admin_students() TO service_role;
