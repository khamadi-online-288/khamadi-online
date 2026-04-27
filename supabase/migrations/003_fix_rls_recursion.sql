-- ============================================================
-- 003: Fix infinite recursion in english_user_roles RLS policies
--
-- Problem: admin_all and teacher_read_all policies query
-- english_user_roles inside english_user_roles policies → recursion.
--
-- Fix: SECURITY DEFINER function bypasses RLS when reading role.
-- ============================================================

-- 1. Drop the recursive policies
DROP POLICY IF EXISTS "admin_all"        ON english_user_roles;
DROP POLICY IF EXISTS "teacher_read_all" ON english_user_roles;

-- 2. Helper: reads current user's English role without triggering RLS
CREATE OR REPLACE FUNCTION public.english_current_user_role()
RETURNS text
LANGUAGE sql
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM english_user_roles WHERE user_id = auth.uid() LIMIT 1;
$$;

-- 3. Recreate policies using the function (no self-referencing subqueries)
CREATE POLICY "admin_all" ON english_user_roles
  FOR ALL
  USING (english_current_user_role() = 'admin');

CREATE POLICY "teacher_read_all" ON english_user_roles
  FOR SELECT
  USING (english_current_user_role() IN ('teacher', 'admin'));
