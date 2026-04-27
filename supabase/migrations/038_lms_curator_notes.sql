-- Curator notes on students
CREATE TABLE IF NOT EXISTS lms_curator_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  curator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  note text NOT NULL,
  is_problem_flagged boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lms_curator_notes_curator ON lms_curator_notes(curator_id);
CREATE INDEX IF NOT EXISTS idx_lms_curator_notes_student ON lms_curator_notes(student_id);

ALTER TABLE lms_curator_notes ENABLE ROW LEVEL SECURITY;

-- Curators see only their own notes; admins see all
CREATE POLICY "curator_own_notes" ON lms_curator_notes
  FOR ALL USING (
    curator_id = auth.uid()
    OR EXISTS (SELECT 1 FROM english_user_roles WHERE user_id = auth.uid() AND role = 'admin')
  );

-- Add curator role to english_user_roles if not already present
-- (table already has role column, this is just documentation)
-- Valid roles: student, teacher, admin, curator
