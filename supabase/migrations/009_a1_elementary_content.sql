-- ============================================================
-- 009: A1 Elementary — 9 modules × 6 lessons
-- ============================================================

DO $$
DECLARE
  cid uuid;
  m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid;
  m6 uuid; m7 uuid; m8 uuid; m9 uuid;
BEGIN
  SELECT id INTO cid FROM english_courses
  WHERE title = 'A1 Elementary' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "A1 Elementary" not found';
  END IF;

  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Modules ─────────────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'All About Me',           1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Daily Life',             2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'People & Places',        3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Food & Health',          4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Work & Study',           5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Looking Back',           6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Entertainment & Culture',7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Planning & Travel',      8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',         9) RETURNING id INTO m9;

  -- ── MODULE 1: All About Me ───────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Talking About Yourself — To Be (all tenses)',  1, 'grammar'),
    (cid, m1, 'My Preferences — Like/Love/Hate + V-ing',      2, 'grammar'),
    (cid, m1, 'My Family & Home — Possessive Case & Adjectives', 3, 'vocabulary'),
    (cid, m1, 'Describing People — Object Pronouns',          4, 'grammar'),
    (cid, m1, 'Dates & Numbers — Ordinal Numbers',            5, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 2: Daily Life ────────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'My Daily Routine — Present Simple',            1, 'grammar'),
    (cid, m2, 'How Often? — Adverbs of Frequency',            2, 'grammar'),
    (cid, m2, 'Right Now — Present Continuous',               3, 'grammar'),
    (cid, m2, 'Always or Now? — Present Simple vs Continuous',4, 'grammar'),
    (cid, m2, 'Asking Questions — Question Word Order',       5, 'grammar'),
    (cid, m2, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 3: People & Places ───────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Countries & Nationalities — Proper Nouns',     1, 'vocabulary'),
    (cid, m3, 'In the City — There is/are & Prepositions',    2, 'grammar'),
    (cid, m3, 'Getting Around — Transport Vocabulary',        3, 'vocabulary'),
    (cid, m3, 'Home & Furniture — Countable & Uncountable',   4, 'grammar'),
    (cid, m3, 'Describing Places — Comparative Adjectives',   5, 'grammar'),
    (cid, m3, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 4: Food & Health ─────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Food & Drinks — Countable & Uncountable',      1, 'vocabulary'),
    (cid, m4, 'At the Restaurant — How much/many',            2, 'listening'),
    (cid, m4, 'Sport & Fitness — Present Perfect intro',      3, 'grammar'),
    (cid, m4, 'Healthy Living — Should/Shouldn''t',           4, 'grammar'),
    (cid, m4, 'Shopping for Food — Articles',                 5, 'vocabulary'),
    (cid, m4, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 5: Work & Study ──────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'Jobs & Workplace — Modal Verb Can',            1, 'grammar'),
    (cid, m5, 'At the Office — Imperative',                   2, 'grammar'),
    (cid, m5, 'Skills & Abilities — Can vs Should',           3, 'grammar'),
    (cid, m5, 'School & Education — Plural Nouns',            4, 'vocabulary'),
    (cid, m5, 'Evaluating Work — Superlative Adjectives',     5, 'grammar'),
    (cid, m5, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 6: Looking Back ──────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'Last Weekend — Past Simple Regular',           1, 'grammar'),
    (cid, m6, 'What Happened? — Past Simple Irregular',       2, 'vocabulary'),
    (cid, m6, 'Did You? — Past Simple Questions & Negative',  3, 'grammar'),
    (cid, m6, 'Holidays & Celebrations — Past Time Expressions', 4, 'vocabulary'),
    (cid, m6, 'My Life Story — Past Simple in Context',       5, 'listening'),
    (cid, m6, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 7: Entertainment & Culture ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Movies & Music — Adverbs of Manner',           1, 'vocabulary'),
    (cid, m7, 'Books & Art — Present Perfect',                2, 'grammar'),
    (cid, m7, 'Sports Events — Past vs Present Perfect',      3, 'grammar'),
    (cid, m7, 'City Attractions — Superlative Adjectives',    4, 'vocabulary'),
    (cid, m7, 'Weekend Plans — Future Simple',                5, 'grammar'),
    (cid, m7, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 8: Planning & Travel ─────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'Holiday Plans — Be Going To',                  1, 'grammar'),
    (cid, m8, 'At the Hotel — Polite Requests',               2, 'listening'),
    (cid, m8, 'Weather & Seasons — Future Simple vs Going To',3, 'grammar'),
    (cid, m8, 'Travel & Transport — Prepositions of Movement',4, 'vocabulary'),
    (cid, m8, 'Business Travel — Formal Language',            5, 'vocabulary'),
    (cid, m8, 'Module Review & Test',                         6, 'review');

  -- ── MODULE 9: The Final Mile ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Grammar Review I — Tenses Overview',           1, 'grammar'),
    (cid, m9, 'Grammar Review II — Modals & Comparatives',    2, 'grammar'),
    (cid, m9, 'Vocabulary Review — All Topics',               3, 'vocabulary'),
    (cid, m9, 'Reading Practice — Mixed Texts',               4, 'vocabulary'),
    (cid, m9, 'Listening Practice — Mixed Audio',             5, 'listening'),
    (cid, m9, 'Final Test & Certificate',                     6, 'review');

END $$;
