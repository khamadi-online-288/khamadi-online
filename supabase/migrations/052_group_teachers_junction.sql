-- Many-to-many: one group can have multiple teachers/mentors
CREATE TABLE IF NOT EXISTS english_group_teachers (
  group_id   uuid REFERENCES english_groups(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES auth.users         ON DELETE CASCADE,
  PRIMARY KEY (group_id, teacher_id)
);

ALTER TABLE english_group_teachers ENABLE ROW LEVEL SECURITY;

-- Teachers can see their own assignments
CREATE POLICY "egt_teacher_read" ON english_group_teachers
  FOR SELECT USING (auth.uid() = teacher_id);

-- Admins can do everything
CREATE POLICY "egt_admin_all" ON english_group_teachers
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM english_user_profiles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );

-- Migrate existing teacher_id from english_groups into the junction table
INSERT INTO english_group_teachers (group_id, teacher_id)
SELECT id, teacher_id FROM english_groups
WHERE teacher_id IS NOT NULL
ON CONFLICT DO NOTHING;

-- Assign all 4 mentors to group 201
INSERT INTO english_group_teachers (group_id, teacher_id) VALUES
  ('98a1a227-f7f3-4f66-8ae5-cf1f75e8bc28', 'c9a918d3-b661-4b0d-ad13-b6b1686bb893'),
  ('98a1a227-f7f3-4f66-8ae5-cf1f75e8bc28', '5422610d-801c-4da3-8197-f0ce1b37d292'),
  ('98a1a227-f7f3-4f66-8ae5-cf1f75e8bc28', '96d85108-2ee6-494d-b0e1-6b94229f6433'),
  ('98a1a227-f7f3-4f66-8ae5-cf1f75e8bc28', 'e16bf8d8-dab5-4048-9232-2a502ecf95b8')
ON CONFLICT DO NOTHING;
