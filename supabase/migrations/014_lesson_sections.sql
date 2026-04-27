-- ============================================================
-- 014: Create english_lesson_sections and populate all lessons
-- ============================================================

-- 1. Create table
CREATE TABLE IF NOT EXISTS english_lesson_sections (
  id          uuid        DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id   uuid        REFERENCES english_lessons(id) ON DELETE CASCADE NOT NULL,
  type        text        NOT NULL CHECK (type IN ('grammar','vocabulary','reading','listening')),
  order_index integer     NOT NULL DEFAULT 0,
  content     jsonb       NOT NULL DEFAULT '{}',
  is_active   boolean     NOT NULL DEFAULT true,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS lesson_sections_lesson_idx ON english_lesson_sections(lesson_id);

-- 2. RLS
ALTER TABLE english_lesson_sections ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'english_lesson_sections' AND policyname = 'sections_read'
  ) THEN
    CREATE POLICY sections_read ON english_lesson_sections FOR SELECT USING (true);
  END IF;
END $$;

-- 3. Populate 4 sections for every existing lesson (idempotent via NOT EXISTS)
INSERT INTO english_lesson_sections (lesson_id, type, order_index)
SELECT l.id, s.type, s.ord
FROM english_lessons l
CROSS JOIN (VALUES
  ('grammar',    1),
  ('vocabulary', 2),
  ('reading',    3),
  ('listening',  4)
) AS s(type, ord)
WHERE NOT EXISTS (
  SELECT 1 FROM english_lesson_sections els
  WHERE els.lesson_id = l.id AND els.type = s.type
);
