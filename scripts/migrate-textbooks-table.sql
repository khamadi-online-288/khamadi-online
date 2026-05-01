-- Migration: Create english_textbooks table
-- Run this in the Supabase SQL Editor

-- ── Drop & recreate (safe — no data yet) ─────────────────────────────────────
DROP TABLE IF EXISTS english_textbooks CASCADE;

CREATE TABLE english_textbooks (
  id         uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text        NOT NULL,
  course_id  uuid,
  book_type  text        NOT NULL DEFAULT 'student',
  language   text        NOT NULL DEFAULT 'bilingual',
  level      text,
  field      text,
  file_url   text,
  file_name  text,
  pages      integer,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT english_textbooks_book_type_check
    CHECK (book_type IN ('student', 'teacher'))
);

CREATE UNIQUE INDEX idx_textbooks_title     ON english_textbooks(title);
CREATE        INDEX idx_textbooks_course_id ON english_textbooks(course_id);
CREATE        INDEX idx_textbooks_book_type  ON english_textbooks(book_type);

ALTER TABLE english_textbooks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running
DROP POLICY IF EXISTS "Students read textbooks"      ON english_textbooks;
DROP POLICY IF EXISTS "Service role manages textbooks" ON english_textbooks;

CREATE POLICY "Students read textbooks"
  ON english_textbooks FOR SELECT
  USING (true);

CREATE POLICY "Service role manages textbooks"
  ON english_textbooks FOR ALL
  USING (auth.role() = 'service_role');

-- ── Verify ───────────────────────────────────────────────────────────────────
SELECT 'english_textbooks table created successfully' AS status;
