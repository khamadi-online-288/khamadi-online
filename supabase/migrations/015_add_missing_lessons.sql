-- ============================================================
-- 015: Add missing lessons to existing modules + create sections
-- ============================================================

DO $$
DECLARE
  -- A1 Beginner modules
  a1b_m1 uuid; a1b_m2 uuid; a1b_m3 uuid; a1b_m4 uuid;
  -- A1 Elementary modules
  a1e_m1 uuid; a1e_m2 uuid; a1e_m3 uuid;
  -- A2 Pre-Intermediate modules
  a2p_m1 uuid;

  -- new lesson ids
  nl1 uuid; nl2 uuid; nl3 uuid; nl4 uuid;
  nl5 uuid; nl6 uuid; nl7 uuid; nl8 uuid;
BEGIN

  -- ── Resolve module IDs ──────────────────────────────────────

  SELECT m.id INTO a1b_m1
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.title = 'Starting Out' LIMIT 1;

  SELECT m.id INTO a1b_m2
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.title = 'Close to Home' LIMIT 1;

  SELECT m.id INTO a1b_m3
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.title = 'Capable & Confident' LIMIT 1;

  SELECT m.id INTO a1b_m4
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.title = 'Day by Day' LIMIT 1;

  SELECT m.id INTO a1e_m1
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Elementary' AND m.title = 'All About Me' LIMIT 1;

  SELECT m.id INTO a1e_m2
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Elementary' AND m.title = 'Daily Life' LIMIT 1;

  SELECT m.id INTO a1e_m3
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Elementary' AND m.title = 'People & Places' LIMIT 1;

  SELECT m.id INTO a2p_m1
  FROM english_modules m JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A2 Pre-Intermediate' AND m.title = 'Building Confidence' LIMIT 1;

  -- ── Shift Module Review & Test to order_index 8 ─────────────

  UPDATE english_lessons SET order_index = 8
  WHERE module_id IN (a1b_m1, a1b_m2, a1b_m3, a1b_m4, a1e_m1, a1e_m2, a1e_m3, a2p_m1)
    AND title = 'Module Review & Test';

  -- ── Insert new lessons ───────────────────────────────────────

  -- A1 Beginner / Starting Out / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m1, c.id, 'Contractions — I''m, You''re, It''s, Don''t, Can''t', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND order_index = 7)
  RETURNING id INTO nl1;

  -- A1 Beginner / Close to Home / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m2, c.id, 'Negation — Negative Sentences & Not', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m2 AND order_index = 7)
  RETURNING id INTO nl2;

  -- A1 Beginner / Capable & Confident / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m3, c.id, 'Reflexive Pronouns — Myself/Yourself/Himself', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m3 AND order_index = 7)
  RETURNING id INTO nl3;

  -- A1 Beginner / Day by Day / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m4, c.id, 'Conjunctions — And/But/Because/Or/So', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m4 AND order_index = 7)
  RETURNING id INTO nl4;

  -- A1 Elementary / All About Me / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m1, c.id, 'Reflexive Pronouns — Myself/Yourself/Herself/Himself', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m1 AND order_index = 7)
  RETURNING id INTO nl5;

  -- A1 Elementary / Daily Life / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m2, c.id, 'Negation Advanced — Never/Neither/Nor', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m2 AND order_index = 7)
  RETURNING id INTO nl6;

  -- A1 Elementary / People & Places / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m3, c.id, 'Conjunctions — Although/However/Therefore', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m3 AND order_index = 7)
  RETURNING id INTO nl7;

  -- A2 Pre-Intermediate / Building Confidence / Lesson 7
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a2p_m1, c.id, 'Subjunctive Mood — Wish/If Only intro', 7, 'grammar'
  FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m1 AND order_index = 7)
  RETURNING id INTO nl8;

  -- ── Create 4 sections for each new lesson ───────────────────

  INSERT INTO english_lesson_sections (lesson_id, type, order_index)
  SELECT l.id, s.type, s.ord
  FROM (
    SELECT nl1 AS id UNION ALL SELECT nl2 UNION ALL SELECT nl3 UNION ALL SELECT nl4
    UNION ALL SELECT nl5 UNION ALL SELECT nl6 UNION ALL SELECT nl7 UNION ALL SELECT nl8
  ) l
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
