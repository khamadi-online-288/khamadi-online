-- Allow all authenticated users to read profiles for leaderboard display.
-- The "en_own_profile" FOR ALL policy already handles writes (user can only update own row).
-- We add a separate SELECT so leaderboard queries return all students.

DROP POLICY IF EXISTS "en_read_profiles_leaderboard" ON english_user_profiles;

CREATE POLICY "en_read_profiles_leaderboard"
  ON english_user_profiles
  FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow teachers/admins to read all students' lesson progress (for student profiles in teacher panel)
DROP POLICY IF EXISTS "en_teacher_read_progress" ON english_lesson_progress;

CREATE POLICY "en_teacher_read_progress"
  ON english_lesson_progress
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM english_user_profiles p
      WHERE p.user_id = auth.uid()
        AND p.role IN ('teacher', 'admin')
    )
  );
