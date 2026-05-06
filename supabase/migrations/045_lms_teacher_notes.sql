-- Teacher private notes on students (visible only to the note's author and admins)
CREATE TABLE IF NOT EXISTS lms_teacher_notes (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  note       text NOT NULL DEFAULT '',
  updated_at timestamptz DEFAULT now() NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE (teacher_id, student_id)
);

CREATE INDEX IF NOT EXISTS idx_lms_teacher_notes_teacher ON lms_teacher_notes(teacher_id);
CREATE INDEX IF NOT EXISTS idx_lms_teacher_notes_student ON lms_teacher_notes(student_id);

ALTER TABLE lms_teacher_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "teacher_own_notes" ON lms_teacher_notes
  FOR ALL USING (
    teacher_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM english_user_roles
      WHERE user_id = auth.uid() AND role = 'admin'
    )
  );
