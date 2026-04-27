-- ============================================================
-- 016: Add Register/Style lessons to B2 and C1 modules
-- ============================================================

DO $$
DECLARE
  b2_m16 uuid;
  c1_m14 uuid;
  nl1    uuid;
  nl2    uuid;
BEGIN

  -- ── Resolve module IDs ──────────────────────────────────────

  SELECT m.id INTO b2_m16
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'B2 Upper-Intermediate' AND m.title = 'Word Formation Mastery' LIMIT 1;

  SELECT m.id INTO c1_m14
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'C1 Advanced' AND m.title = 'Word Formation & Collocation Mastery' LIMIT 1;

  -- ── Shift Module Review & Test → order_index 9 ──────────────

  UPDATE english_lessons SET order_index = 9
  WHERE module_id = b2_m16 AND title = 'Module Review & Test';

  UPDATE english_lessons SET order_index = 9
  WHERE module_id = c1_m14 AND title = 'Module Review & Test';

  -- ── Insert new lessons ───────────────────────────────────────

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT b2_m16, c.id,
    'Spoken vs Written English — Register, Style & Formality', 8, 'vocabulary'
  FROM english_courses c WHERE c.title = 'B2 Upper-Intermediate'
  AND NOT EXISTS (
    SELECT 1 FROM english_lessons WHERE module_id = b2_m16 AND order_index = 8
  )
  RETURNING id INTO nl1;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT c1_m14, c.id,
    'Spoken vs Written English — Advanced Register Switching', 8, 'vocabulary'
  FROM english_courses c WHERE c.title = 'C1 Advanced'
  AND NOT EXISTS (
    SELECT 1 FROM english_lessons WHERE module_id = c1_m14 AND order_index = 8
  )
  RETURNING id INTO nl2;

  -- ── Create 4 sections for each new lesson ───────────────────

  INSERT INTO english_lesson_sections (lesson_id, type, order_index)
  SELECT l.id, s.type, s.ord
  FROM (SELECT nl1 AS id UNION ALL SELECT nl2) l
  CROSS JOIN (VALUES
    ('grammar',    1),
    ('vocabulary', 2),
    ('reading',    3),
    ('listening',  4)
  ) AS s(type, ord)
  WHERE l.id IS NOT NULL
    AND NOT EXISTS (
      SELECT 1 FROM english_lesson_sections els
      WHERE els.lesson_id = l.id AND els.type = s.type
    );

END $$;
