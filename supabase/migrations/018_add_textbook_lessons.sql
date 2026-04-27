-- ============================================================
-- 018: Add missing textbook topics as lessons across all courses
-- 23 new lessons total, 4 sections each = 92 new sections
-- ============================================================

DO $$
DECLARE
  -- module ids
  a1b_m1  uuid; a1b_m2  uuid; a1b_m4  uuid; a1b_m5  uuid;
  a2p_m2  uuid; a2p_m3  uuid; a2p_m4  uuid;
  b1_m9   uuid; b1_m20  uuid;
  b2_m3   uuid; b2_m10  uuid;
  c1_m15  uuid; c1_m17  uuid;

  next_idx integer;
  nl       uuid;
  new_ids  uuid[] := '{}';
BEGIN

  -- ── Resolve module IDs ──────────────────────────────────────

  SELECT m.id INTO a1b_m1  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Starting Out'               LIMIT 1;
  SELECT m.id INTO a1b_m2  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Close to Home'              LIMIT 1;
  SELECT m.id INTO a1b_m4  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Day by Day'                 LIMIT 1;
  SELECT m.id INTO a1b_m5  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A1 Beginner'          AND m.title = 'Here & Now'                 LIMIT 1;
  SELECT m.id INTO a2p_m2  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A2 Pre-Intermediate'  AND m.title = 'Understanding the World'    LIMIT 1;
  SELECT m.id INTO a2p_m3  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A2 Pre-Intermediate'  AND m.title = 'Language Structure I'       LIMIT 1;
  SELECT m.id INTO a2p_m4  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'A2 Pre-Intermediate'  AND m.title = 'Everyday Communication'     LIMIT 1;
  SELECT m.id INTO b1_m9   FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B1 Intermediate'      AND m.title = 'Relative Clauses & Articles' LIMIT 1;
  SELECT m.id INTO b1_m20  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B1 Intermediate'      AND m.title = 'The Final Mile'             LIMIT 1;
  SELECT m.id INTO b2_m3   FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B2 Upper-Intermediate' AND m.title = 'Tenses Mastery I'          LIMIT 1;
  SELECT m.id INTO b2_m10  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'B2 Upper-Intermediate' AND m.title = 'Advanced Grammar I'        LIMIT 1;
  SELECT m.id INTO c1_m15  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'C1 Advanced'          AND m.title = 'Advanced Grammar Consolidation' LIMIT 1;
  SELECT m.id INTO c1_m17  FROM english_modules m JOIN english_courses c ON c.id = m.course_id WHERE c.title = 'C1 Advanced'          AND m.title = 'Writing Skills — CAE Level' LIMIT 1;

  -- ── Reusable insert helper via inline pattern ────────────────
  -- For each module: get next_idx, shift review, insert lesson(s)

  -- ══════════════════════════════════════════════════════════════
  -- A1 BEGINNER — Module 1 "Starting Out" (4 new lessons)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a1b_m1 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 5 WHERE module_id = a1b_m1 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m1, c.id, 'Vowels & Digraphs — Reading Rules for Vowels', next_idx + 1, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND title = 'Vowels & Digraphs — Reading Rules for Vowels')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m1, c.id, 'Verb To Have — Have/Has/Had', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND title = 'Verb To Have — Have/Has/Had')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m1, c.id, 'Capitalization — Rules for Capital Letters', next_idx + 3, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND title = 'Capitalization — Rules for Capital Letters')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m1, c.id, 'Punctuation — Periods, Commas, Apostrophes', next_idx + 4, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m1 AND title = 'Punctuation — Periods, Commas, Apostrophes')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A1 BEGINNER — Module 2 "Close to Home" (3 new lessons)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a1b_m2 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 4 WHERE module_id = a1b_m2 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m2, c.id, 'Ordinal Numbers — First/Second/Third', next_idx + 1, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m2 AND title = 'Ordinal Numbers — First/Second/Third')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m2, c.id, 'Indirect Object — I gave him a book', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m2 AND title = 'Indirect Object — I gave him a book')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m2, c.id, 'Numbers & Measurements — km/kg/°C', next_idx + 3, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m2 AND title = 'Numbers & Measurements — km/kg/°C')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A1 BEGINNER — Module 4 "Day by Day" (1 new lesson)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a1b_m4 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = a1b_m4 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m4, c.id, 'Subject-Verb Agreement — The team is/are', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m4 AND title = 'Subject-Verb Agreement — The team is/are')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A1 BEGINNER — Module 5 "Here & Now" (2 new lessons)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a1b_m5 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 3 WHERE module_id = a1b_m5 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m5, c.id, 'Exclamations — What a day! How nice!', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m5 AND title = 'Exclamations — What a day! How nice!')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a1b_m5, c.id, 'Predicate Noun — She became a doctor', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'A1 Beginner'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a1b_m5 AND title = 'Predicate Noun — She became a doctor')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A2 PRE-INTERMEDIATE — Module 2 "Understanding the World" (1)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a2p_m2 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = a2p_m2 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a2p_m2, c.id, 'American English — color/colour differences', next_idx + 1, 'vocabulary'
    FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m2 AND title = 'American English — color/colour differences')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A2 PRE-INTERMEDIATE — Module 3 "Language Structure I" (2)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a2p_m3 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 3 WHERE module_id = a2p_m3 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a2p_m3, c.id, 'Noun Clauses — I know that he left', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m3 AND title = 'Noun Clauses — I know that he left')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a2p_m3, c.id, 'Adverbial Clauses — When/Because/Although', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m3 AND title = 'Adverbial Clauses — When/Because/Although')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- A2 PRE-INTERMEDIATE — Module 4 "Everyday Communication" (2)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = a2p_m4 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 3 WHERE module_id = a2p_m4 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a2p_m4, c.id, 'Linking Verbs — Seem/Appear/Become/Look', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m4 AND title = 'Linking Verbs — Seem/Appear/Become/Look')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT a2p_m4, c.id, 'Substitution — I think so / I hope not', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'A2 Pre-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = a2p_m4 AND title = 'Substitution — I think so / I hope not')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- B1 INTERMEDIATE — Module 9 "Relative Clauses & Articles" (2)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = b1_m9 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 3 WHERE module_id = b1_m9 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b1_m9, c.id, 'Participles — Present/Past Participle detailed', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'B1 Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b1_m9 AND title = 'Participles — Present/Past Participle detailed')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b1_m9, c.id, 'Adverbial Clauses Advanced', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'B1 Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b1_m9 AND title = 'Adverbial Clauses Advanced')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- B1 INTERMEDIATE — Module 20 "The Final Mile" (1)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = b1_m20 AND title <> 'Final Test & Certificate';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = b1_m20 AND title = 'Final Test & Certificate';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b1_m20, c.id, 'Common Mistakes & Important Contrasts', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'B1 Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b1_m20 AND title = 'Common Mistakes & Important Contrasts')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- B2 UPPER-INTERMEDIATE — Module 3 "Tenses Mastery I" (1)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = b2_m3 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = b2_m3 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b2_m3, c.id, 'Verb Aspects System — Simple vs Continuous vs Perfect', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'B2 Upper-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b2_m3 AND title = 'Verb Aspects System — Simple vs Continuous vs Perfect')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- B2 UPPER-INTERMEDIATE — Module 10 "Advanced Grammar I" (2)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = b2_m10 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 3 WHERE module_id = b2_m10 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b2_m10, c.id, 'Ellipsis & Substitution Advanced', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'B2 Upper-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b2_m10 AND title = 'Ellipsis & Substitution Advanced')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT b2_m10, c.id, 'Noun Clauses Advanced', next_idx + 2, 'grammar'
    FROM english_courses c WHERE c.title = 'B2 Upper-Intermediate'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = b2_m10 AND title = 'Noun Clauses Advanced')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- C1 ADVANCED — Module 15 "Advanced Grammar Consolidation" (1)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = c1_m15 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = c1_m15 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT c1_m15, c.id, 'Verb Aspects Mastery', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'C1 Advanced'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = c1_m15 AND title = 'Verb Aspects Mastery')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

  -- ══════════════════════════════════════════════════════════════
  -- C1 ADVANCED — Module 17 "Writing Skills — CAE Level" (1)
  -- ══════════════════════════════════════════════════════════════

  SELECT COALESCE(MAX(order_index), 0) INTO next_idx FROM english_lessons WHERE module_id = c1_m17 AND title <> 'Module Review & Test';
  UPDATE english_lessons SET order_index = next_idx + 2 WHERE module_id = c1_m17 AND title = 'Module Review & Test';

  INSERT INTO english_lessons (module_id, course_id, title, order_index, lesson_type)
    SELECT c1_m17, c.id, 'Ellipsis in Academic Writing', next_idx + 1, 'grammar'
    FROM english_courses c WHERE c.title = 'C1 Advanced'
    AND NOT EXISTS (SELECT 1 FROM english_lessons WHERE module_id = c1_m17 AND title = 'Ellipsis in Academic Writing')
  RETURNING id INTO nl; IF nl IS NOT NULL THEN new_ids := array_append(new_ids, nl); END IF;

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

  RAISE NOTICE 'Done. % new lessons inserted, % sections created.',
    array_length(new_ids, 1),
    array_length(new_ids, 1) * 4;

END $$;
