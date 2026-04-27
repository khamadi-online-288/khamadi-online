-- ============================================================
-- 007: Modules for A1 Beginner + fix lesson_type values
-- ============================================================

-- 1. Add missing columns to english_modules
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS is_active   boolean NOT NULL DEFAULT true;

-- 2. Update lesson_type CHECK to support grammar / vocabulary / listening
ALTER TABLE english_lessons DROP CONSTRAINT IF EXISTS english_lessons_lesson_type_check;
ALTER TABLE english_lessons ADD CONSTRAINT english_lessons_lesson_type_check
  CHECK (lesson_type IN ('grammar','vocabulary','listening'));

-- 3. Insert 10 modules for A1 Beginner
INSERT INTO english_modules (course_id, title, module_order)
SELECT c.id, m.title, m.ord
FROM english_courses c
CROSS JOIN (VALUES
  (1,  'Знакомство и алфавит'),
  (2,  'Семья и друзья'),
  (3,  'Числа, цвета, дата и время'),
  (4,  'Еда и напитки'),
  (5,  'Работа и профессии'),
  (6,  'Хобби и распорядок дня'),
  (7,  'Погода и путешествия'),
  (8,  'Магазины, рестораны, деньги'),
  (9,  'Одежда'),
  (10, 'В гостинице, офисе, на заправке')
) AS m(ord, title)
WHERE c.title = 'A1 Beginner' AND c.category = 'General English'
  AND NOT EXISTS (
    SELECT 1 FROM english_modules em
    WHERE em.course_id = c.id AND em.title = m.title
  );
