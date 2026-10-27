-- 054: fast admin student list
-- Replaces client-side pagination of profiles, auth users and ~100k progress rows
-- in /api/english/admin/students with a single aggregated query.
-- Returns one json array so the PostgREST 1000-row cap does not apply.

CREATE INDEX IF NOT EXISTS elp_user_completed_idx
  ON english_lesson_progress (user_id)
  WHERE completed;

CREATE OR REPLACE FUNCTION english_admin_students()
RETURNS json
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT COALESCE(json_agg(s ORDER BY s.last_active_at DESC NULLS LAST, s.user_id), '[]'::json)
  FROM (
    SELECT
      p.user_id,
      p.full_name,
      COALESCE(NULLIF(trim(u.raw_user_meta_data->>'full_name'), ''), trim(u.raw_user_meta_data->>'name'), '') AS meta_name,
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
  ) s;
$$;

-- Exposes auth emails: only the service role (API routes) may call it
REVOKE ALL ON FUNCTION english_admin_students() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION english_admin_students() TO service_role;
