-- ============================================================
-- 019: Update lesson sections — 6 sections per lesson
-- grammar(1) reading(2) listening(3) vocabulary(4) writing(5) quiz(6)
-- ============================================================

-- 1. Update CHECK constraint first (so inserts below don't fail)
ALTER TABLE english_lesson_sections
  DROP CONSTRAINT IF EXISTS english_lesson_sections_type_check;

ALTER TABLE english_lesson_sections
  ADD CONSTRAINT english_lesson_sections_type_check
  CHECK (type IN ('grammar','reading','listening','vocabulary','writing','quiz'));

-- 2. Reorder existing sections
UPDATE english_lesson_sections SET order_index = 1 WHERE type = 'grammar';
UPDATE english_lesson_sections SET order_index = 2 WHERE type = 'reading';
UPDATE english_lesson_sections SET order_index = 3 WHERE type = 'listening';
UPDATE english_lesson_sections SET order_index = 4 WHERE type = 'vocabulary';

-- 3. Add writing (order_index = 5) for all lessons missing it
INSERT INTO english_lesson_sections (lesson_id, type, order_index)
SELECT l.id, 'writing', 5
FROM english_lessons l
WHERE NOT EXISTS (
  SELECT 1 FROM english_lesson_sections els
  WHERE els.lesson_id = l.id AND els.type = 'writing'
);

-- 4. Add quiz (order_index = 6) for all lessons missing it
INSERT INTO english_lesson_sections (lesson_id, type, order_index)
SELECT l.id, 'quiz', 6
FROM english_lessons l
WHERE NOT EXISTS (
  SELECT 1 FROM english_lesson_sections els
  WHERE els.lesson_id = l.id AND els.type = 'quiz'
);
