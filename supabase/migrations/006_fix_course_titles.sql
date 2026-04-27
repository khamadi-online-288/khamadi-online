-- ============================================================
-- 006: Fix General English course titles and levels
--
-- Final 7-course structure:
--   A1 Beginner           level A1
--   A1 Elementary         level A1  (was A2 Elementary)
--   A2 Pre-Intermediate   level A2  (new)
--   B1 Intermediate       level B1
--   B2 Upper-Intermediate level B2  (restore hyphen)
--   C1 Advanced           level C1
--   C2 Proficient         level C2
-- ============================================================

-- 1. A2 Elementary → A1 Elementary (title + level)
UPDATE english_courses
SET title = 'A1 Elementary', level = 'A1'
WHERE title = 'A2 Elementary' AND category = 'General English';

-- 2. Add A2 Pre-Intermediate (the new A2 course)
INSERT INTO english_courses (title, title_kz, level, category, description, description_kz)
VALUES (
  'A2 Pre-Intermediate',
  'A2 Орта алды деңгей',
  'A2',
  'General English',
  'Повседневные ситуации, время, предлоги, простые диалоги и расширение словаря.',
  'Күнделікті жағдаяттар, уақыт, предлогтар, қарапайым диалогтар және сөздікті кеңейту.'
)
ON CONFLICT DO NOTHING;

-- 3. Restore hyphen in B2 Upper Intermediate
UPDATE english_courses
SET title = 'B2 Upper-Intermediate'
WHERE title = 'B2 Upper Intermediate' AND category = 'General English';
