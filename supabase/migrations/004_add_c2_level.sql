-- ============================================================
-- 004: Add C2 (Proficient) CEFR level
-- ============================================================

-- Drop old CHECK constraint and recreate with C2
ALTER TABLE english_user_roles DROP CONSTRAINT IF EXISTS english_user_roles_current_level_check;
ALTER TABLE english_user_roles
  ADD CONSTRAINT english_user_roles_current_level_check
  CHECK (current_level IN ('A1','A2','B1','B2','C1','C2'));

-- Add C2 Proficient course
INSERT INTO english_courses (title, title_kz, level, category, description, description_kz)
VALUES (
  'C2 Proficient',
  'C2 Шебер деңгей',
  'C2',
  'General English',
  'Мастерство языка: академическое письмо, переговоры, нюансы речи.',
  'Тіл шеберлігі: академиялық жазу, келіссөздер, сөйлеу нюанстары.'
)
ON CONFLICT DO NOTHING;
