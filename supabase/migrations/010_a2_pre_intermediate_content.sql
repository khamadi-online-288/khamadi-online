-- ============================================================
-- 010: A2 Pre-Intermediate — 9 modules × 6 lessons
-- ============================================================

DO $$
DECLARE
  cid uuid;
  m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid;
  m6 uuid; m7 uuid; m8 uuid; m9 uuid;
BEGIN
  SELECT id INTO cid FROM english_courses
  WHERE title = 'A2 Pre-Intermediate' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "A2 Pre-Intermediate" not found';
  END IF;

  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Modules ─────────────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Building Confidence',    1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Understanding the World',2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Language Structure I',   3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Everyday Communication', 4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Academic Reading',       5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Academic Writing',       6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Listening & Speaking',   7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Complex Language',       8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',         9) RETURNING id INTO m9;

  -- ── MODULE 1: Building Confidence ───────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Talking About Experience — Present Perfect',      1, 'grammar'),
    (cid, m1, 'How Long? — Present Perfect + For/Since',         2, 'grammar'),
    (cid, m1, 'Past Stories — Past Simple vs Present Perfect',   3, 'grammar'),
    (cid, m1, 'Making Comparisons — Comparative & Superlative',  4, 'grammar'),
    (cid, m1, 'Describing Trends — Adverbs of Degree',           5, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 2: Understanding the World ───────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'News & Media — Passive Voice intro',              1, 'grammar'),
    (cid, m2, 'Facts & Figures — Passive Voice Present',         2, 'grammar'),
    (cid, m2, 'Around the World — Articles in Context',          3, 'grammar'),
    (cid, m2, 'Culture & Society — Gerunds & Infinitives',       4, 'grammar'),
    (cid, m2, 'American Culture — Idioms & Expressions',         5, 'vocabulary'),
    (cid, m2, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 3: Language Structure I ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Conditionals — Zero & First Conditional',         1, 'grammar'),
    (cid, m3, 'What If? — Second Conditional',                   2, 'grammar'),
    (cid, m3, 'Wishes & Regrets — I Wish / If Only',             3, 'grammar'),
    (cid, m3, 'Reported Speech — Reporting Statements',          4, 'grammar'),
    (cid, m3, 'Reported Questions — Reporting Questions',        5, 'grammar'),
    (cid, m3, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 4: Everyday Communication ────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Making Requests — Modal Verbs Review',            1, 'grammar'),
    (cid, m4, 'Giving Advice — Should/Must/Have to',             2, 'grammar'),
    (cid, m4, 'Possibilities — May/Might/Could',                 3, 'grammar'),
    (cid, m4, 'Agreeing & Disagreeing — Discussion Language',    4, 'listening'),
    (cid, m4, 'Everyday Conversations — Phrasal Verbs I',        5, 'vocabulary'),
    (cid, m4, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 5: Academic Reading ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'Reading Strategies — Skimming & Scanning',        1, 'vocabulary'),
    (cid, m5, 'Understanding Texts — Topic Sentences',           2, 'vocabulary'),
    (cid, m5, 'Vocabulary in Context — Word Formation',          3, 'vocabulary'),
    (cid, m5, 'Academic Vocabulary — Formal vs Informal',        4, 'vocabulary'),
    (cid, m5, 'Reading for Detail — Inference Skills',           5, 'vocabulary'),
    (cid, m5, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 6: Academic Writing ──────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'Paragraph Structure — Topic & Supporting Sentences', 1, 'grammar'),
    (cid, m6, 'Linking Ideas — Conjunctions & Connectors',       2, 'grammar'),
    (cid, m6, 'Describing Data — Charts & Graphs',               3, 'vocabulary'),
    (cid, m6, 'Essay Writing — Introduction & Conclusion',       4, 'grammar'),
    (cid, m6, 'Academic Style — Formal Writing Practice',        5, 'vocabulary'),
    (cid, m6, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 7: Listening & Speaking ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Fast Speech — Listening Strategies',              1, 'listening'),
    (cid, m7, 'Presentations — Public Speaking Basics',          2, 'vocabulary'),
    (cid, m7, 'Discussions — Expressing Opinions',               3, 'listening'),
    (cid, m7, 'Debates — Agreeing & Disagreeing Formally',       4, 'listening'),
    (cid, m7, 'University Skills — Note-Taking',                 5, 'vocabulary'),
    (cid, m7, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 8: Complex Language ───────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'Relative Clauses — Who/Which/That',               1, 'grammar'),
    (cid, m8, 'Defining & Non-defining — Relative Clauses',      2, 'grammar'),
    (cid, m8, 'Emphasis — Cleft Sentences',                      3, 'grammar'),
    (cid, m8, 'Phrasal Verbs II — Common Phrasal Verbs',         4, 'vocabulary'),
    (cid, m8, 'Collocations — Word Partnerships',                5, 'vocabulary'),
    (cid, m8, 'Module Review & Test',                            6, 'review');

  -- ── MODULE 9: The Final Mile ─────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Grammar Review I — Tenses & Conditionals',        1, 'grammar'),
    (cid, m9, 'Grammar Review II — Passives & Reported Speech',  2, 'grammar'),
    (cid, m9, 'Vocabulary Review — All Topics',                  3, 'vocabulary'),
    (cid, m9, 'Reading Practice — IELTS Style Texts',            4, 'vocabulary'),
    (cid, m9, 'Listening Practice — IELTS Style Audio',          5, 'listening'),
    (cid, m9, 'Final Test & Certificate',                        6, 'review');

END $$;
