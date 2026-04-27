-- ============================================================
-- 017: Add missing grammar/phonetics lessons to existing modules
-- Dynamic ordering: inserts after current max non-review lesson
-- ============================================================

DO $$
DECLARE
  -- module ids
  a1b_m1  uuid; a1b_m2  uuid; a1b_m3  uuid; a1b_m4  uuid;
  a1e_m1  uuid; a1e_m2  uuid; a1e_m3  uuid;
  a2p_m1  uuid; a2p_m2  uuid;
  b1_m9   uuid; b1_m10  uuid;
  b2_m10  uuid;
  c1_m15  uuid;

  next_idx integer;

  -- new lesson ids (up to 2 per module for M1 which gets 2)
  nl uuid;
  nl_a uuid; nl_b uuid;

  -- collector for all new ids → sections
  new_ids uuid[];
BEGIN

  -- ── Resolve module IDs ──────────────────────────────────────

  SELECT m.id INTO a1b_m1  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Starting Out'                     LIMIT 1;
  SELECT m.id INTO a1b_m2  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Close to Home'                    LIMIT 1;
  SELECT m.id INTO a1b_m3  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Capable & Confident'              LIMIT 1;
  SELECT m.id INTO a1b_m4  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Day by Day'                       LIMIT 1;
  SELECT m.id INTO a1e_m1  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Elementary'        AND m.title = 'All About Me'                     LIMIT 1;
  SELECT m.id INTO a1e_m2  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Elementary'        AND m.title = 'Daily Life'                       LIMIT 1;
  SELECT m.id INTO a1e_m3  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Elementary'        AND m.title = 'People & Places'                  LIMIT 1;
  SELECT m.id INTO a2p_m1  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A2 Pre-Intermediate'  AND m.title = 'Building Confidence'              LIMIT 1;
  SELECT m.id INTO a2p_m2  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A2 Pre-Intermediate'  AND m.title = 'Understanding the World'          LIMIT 1;
  SELECT m.id INTO b1_m9   FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B1 Intermediate'      AND m.title = 'Relative Clauses & Articles'      LIMIT 1;
  SELECT m.id INTO b1_m10  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B1 Intermediate'      AND m.title = 'Entertainment & Culture'          LIMIT 1;
  SELECT m.id INTO b2_m10  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B2 Upper-Intermediate' AND m.title = 'Advanced Grammar I'             LIMIT 1;
  SELECT m.id INTO c1_m15  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'C1 Advanced'          AND m.title = 'Advanced Grammar Consolidation'   LIMIT 1;

  new_ids := '{}';

  -- ── Helper: insert 1 lesson after current max, shift review ─
  -- Pattern repeated per module below

  -- ─────────────────────────────────────────────────────────────
  -- A1 BEGINNER / Module 1 "Starting Out" — 2 new lessons
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1b_m1 AND title <> 'Module Review & Test';

  -- shift review to next_idx + 3
  UPDATE english_lessons SET order_index = next_idx + 3
  WHERE module_id = a1b_m1 AND title = 'Module Review & Test';

  -- lesson A
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m1, c.id, 'Pronunciation & Sounds — Alphabet, Reading Rules, Phonetics', next_idx + 1, 'vocabulary'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND order_index = next_idx + 1)
  RETURNING id INTO nl_a;
  IF nl_a IS NOT NULL THEN new_ids := array_append(new_ids, nl_a); END IF;

  -- lesson B
  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m1, c.id, 'Word Order — Subject + Verb + Object Basic Patterns', next_idx + 2, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND order_index = next_idx + 2)
  RETURNING id INTO nl_b;
  IF nl_b IS NOT NULL THEN new_ids := array_append(new_ids, nl_b); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 BEGINNER / Module 2 "Close to Home" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1b_m2 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1b_m2 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m2, c.id, 'Irregular Plurals — Men/Women/Children/Feet/Teeth', next_idx + 1, 'vocabulary'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m2 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 BEGINNER / Module 3 "Capable & Confident" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1b_m3 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1b_m3 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m3, c.id, 'Quantifiers — Some/Any/Much/Many/A lot of/A few', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m3 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 BEGINNER / Module 4 "Day by Day" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1b_m4 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1b_m4 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1b_m4, c.id, 'Transitive vs Intransitive Verbs — I sleep / I read a book', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Beginner'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m4 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 ELEMENTARY / Module 1 "All About Me" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1e_m1 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1e_m1 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m1, c.id, 'Pronunciation Advanced — Stress, Intonation, Connected Speech', next_idx + 1, 'vocabulary'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m1 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 ELEMENTARY / Module 2 "Daily Life" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1e_m2 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1e_m2 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m2, c.id, 'Quantifiers Advanced — Both/Either/Neither/Enough/Too many', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m2 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A1 ELEMENTARY / Module 3 "People & Places" — 1 new lesson
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a1e_m3 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a1e_m3 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a1e_m3, c.id, 'Irregular Plurals Advanced — Sheep/Fish/Deer + Latin forms', next_idx + 1, 'vocabulary'
  FROM english_courses c WHERE c.title = 'A1 Elementary'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1e_m3 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A2 PRE-INTERMEDIATE / Module 1 "Building Confidence" — 1 new
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a2p_m1 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a2p_m1 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a2p_m1, c.id, 'Clause Patterns — Subject/Verb/Object/Complement/Adverbial', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m1 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- A2 PRE-INTERMEDIATE / Module 2 "Understanding the World" — 1
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = a2p_m2 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = a2p_m2 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT a2p_m2, c.id, 'Word Order Advanced — Inversion basics, Fronting', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m2 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- B1 INTERMEDIATE / Module 9 "Relative Clauses & Articles"
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = b1_m9 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = b1_m9 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT b1_m9, c.id, 'Quantifiers Mastery — All/Most/Both/Neither/None/Every', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'B1 Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b1_m9 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- B1 INTERMEDIATE / Module 10 "Entertainment & Culture"
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = b1_m10 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = b1_m10 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT b1_m10, c.id, 'Performative Verbs — I promise/I agree/I suggest/I apologize', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'B1 Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b1_m10 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- B2 UPPER-INTERMEDIATE / Module 10 "Advanced Grammar I"
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = b2_m10 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = b2_m10 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT b2_m10, c.id, 'Clause Patterns Advanced — Complex sentences & Subordination', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'B2 Upper-Intermediate'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b2_m10 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ─────────────────────────────────────────────────────────────
  -- C1 ADVANCED / Module 15 "Advanced Grammar Consolidation"
  -- ─────────────────────────────────────────────────────────────

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx
  FROM english_lessons WHERE module_id = c1_m15 AND title <> 'Module Review & Test';

  UPDATE english_lessons SET order_index = next_idx + 2
  WHERE module_id = c1_m15 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
  SELECT c1_m15, c.id, 'Word Order & Emphasis — Fronting, Inversion, Cleft Advanced', next_idx + 1, 'grammar'
  FROM english_courses c WHERE c.title = 'C1 Advanced'
  AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = c1_m15 AND order_index = next_idx + 1)
  RETURNING id INTO nl;
  IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ── Create 4 sections for all new lessons ───────────────────

  INSERT INTO english_lesson_sections (lesson_id, type, order_index)
  SELECT u.id, s.type, s.ord
  FROM UNNEST(new_ids) AS u(id)
  CROSS JOIN (VALUES
    ('grammar',    1),
    ('vocabulary', 2),
    ('reading',    3),
    ('listening',  4)
  ) AS s(type, ord)
  WHERE NOT EXISTS (
    SELECT 1 FROM english_lesson_sections els
    WHERE els.lesson_id = u.id AND els.type = s.type
  );

  RAISE NOTICE 'Done. % new lessons inserted.', array_length(new_ids, 1);

END $$;
