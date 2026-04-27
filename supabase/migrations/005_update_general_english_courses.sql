-- ============================================================
-- 005: Update General English courses to 7-course structure
--
-- Final structure:
--   A1 Beginner          (exists, keep)
--   A1 Elementary        (new)
--   A2 Pre-Intermediate  (rename from A2 Elementary)
--   B1 Intermediate      (exists, keep)
--   B2 Upper-Intermediate(exists, keep)
--   C1 Advanced          (exists, keep)
--   C2 Proficient        (added in 004, keep)
-- ============================================================

-- 1. Rename A2 Elementary → A2 Pre-Intermediate
UPDATE english_courses
SET title       = 'A2 Pre-Intermediate',
    title_kz    = 'A2 Орта алды деңгей',
    description = 'Расширение базы: повседневные ситуации, время, предлоги, диалоги.',
    description_kz = 'Базаны кеңейту: күнделікті жағдаяттар, уақыт, предлогтар, диалогтар.'
WHERE title = 'A2 Elementary' AND category = 'General English';

-- 2. Add A1 Elementary (if not exists)
INSERT INTO english_courses (title, title_kz, level, category, description, description_kz)
VALUES (
  'A1 Elementary',
  'A1 Элементарлы',
  'A1',
  'General English',
  'Первые шаги: алфавит, числа, приветствия и простые предложения.',
  'Алғашқы қадамдар: әліпби, сандар, сәлемдесу және қарапайым сөйлемдер.'
)
ON CONFLICT DO NOTHING;
