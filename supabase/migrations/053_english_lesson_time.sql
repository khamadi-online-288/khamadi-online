-- Minutes spent on a completed ZKU lesson.
-- The repo's original progress table declared this column, but the live table was created without it.

ALTER TABLE english_lesson_progress
  ADD COLUMN IF NOT EXISTS time_spent_min integer NOT NULL DEFAULT 0;
