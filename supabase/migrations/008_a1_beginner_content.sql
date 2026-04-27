-- ============================================================
-- 008: A1 Beginner — 9 modules × 6 lessons
-- ============================================================

-- 1. Add order_index + is_active to both tables (idempotent)
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS is_active   boolean NOT NULL DEFAULT true;

ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS order_index integer NOT NULL DEFAULT 0;
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS is_active   boolean NOT NULL DEFAULT true;
ALTER TABLE english_lessons ALTER COLUMN lesson_order SET DEFAULT 0;

-- 2. Expand lesson_type to include 'review'
ALTER TABLE english_lessons DROP CONSTRAINT IF EXISTS english_lessons_lesson_type_check;
ALTER TABLE english_lessons ADD CONSTRAINT english_lessons_lesson_type_check
  CHECK (lesson_type IN ('grammar','vocabulary','listening','review'));

-- 3. RLS policies (IF NOT EXISTS via DO block)
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='english_modules' AND policyname='modules_select_all'
  ) THEN
    CREATE POLICY modules_select_all ON english_modules FOR SELECT USING (true);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename='english_lessons' AND policyname='lessons_select_all'
  ) THEN
    CREATE POLICY lessons_select_all ON english_lessons FOR SELECT USING (true);
  END IF;
END $$;

-- 4. Insert modules + lessons for A1 Beginner
DO $$
DECLARE
  cid uuid;
  m1 uuid; m2 uuid; m3 uuid; m4 uuid; m5 uuid;
  m6 uuid; m7 uuid; m8 uuid; m9 uuid;
BEGIN
  SELECT id INTO cid FROM english_courses
  WHERE title = 'A1 Beginner' AND category = 'General English' LIMIT 1;

  IF cid IS NULL THEN
    RAISE EXCEPTION 'Course "A1 Beginner" not found';
  END IF;

  -- Remove old modules for this course (clean slate)
  DELETE FROM english_modules WHERE course_id = cid;

  -- ── Insert 9 modules ────────────────────────────────────────
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Starting Out',     1) RETURNING id INTO m1;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Close to Home',    2) RETURNING id INTO m2;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Capable & Confident', 3) RETURNING id INTO m3;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Day by Day',       4) RETURNING id INTO m4;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Here & Now',       5) RETURNING id INTO m5;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Looking Back',     6) RETURNING id INTO m6;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Planning Ahead',   7) RETURNING id INTO m7;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'Out & About',      8) RETURNING id INTO m8;
  INSERT INTO english_modules (course_id, title, order_index) VALUES (cid, 'The Final Mile',   9) RETURNING id INTO m9;

  -- ── MODULE 1: Starting Out ──────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m1, 'Meet & Greet — Verb To Be',            1, 'grammar'),
    (cid, m1, 'The Alphabet & Sounds — Articles a/an/the', 2, 'vocabulary'),
    (cid, m1, 'This or That? — This/That/These/Those', 3, 'grammar'),
    (cid, m1, 'One or Many? — Singular & Plural Nouns', 4, 'grammar'),
    (cid, m1, 'Describing Things — Adjectives',        5, 'vocabulary'),
    (cid, m1, 'Module Review & Test',                  6, 'review');

  -- ── MODULE 2: Close to Home ─────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m2, 'My Family — Possessive Case',           1, 'grammar'),
    (cid, m2, 'Countries & Nationalities — Nouns & Proper Nouns', 2, 'vocabulary'),
    (cid, m2, 'Numbers & Colors — Cardinal Numbers',   3, 'vocabulary'),
    (cid, m2, 'Food & Drinks — There is / There are',  4, 'grammar'),
    (cid, m2, 'Where is it? — Prepositions of Place',  5, 'grammar'),
    (cid, m2, 'Module Review & Test',                  6, 'review');

  -- ── MODULE 3: Capable & Confident ──────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m3, 'Jobs & Professions — Modal Verb Can',   1, 'grammar'),
    (cid, m3, 'Hobbies — Like/Love/Hate + Doing',      2, 'grammar'),
    (cid, m3, 'My Skills — Can vs Can''t',             3, 'grammar'),
    (cid, m3, 'Sports & Activities — Irregular Verbs intro', 4, 'vocabulary'),
    (cid, m3, 'Free Time — Object Pronouns',           5, 'grammar'),
    (cid, m3, 'Module Review & Test',                  6, 'review');

  -- ── MODULE 4: Day by Day ────────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m4, 'Daily Routine — Present Simple',        1, 'grammar'),
    (cid, m4, 'How Often? — Adverbs of Frequency',     2, 'grammar'),
    (cid, m4, 'Ask Me Anything — Question Word Order', 3, 'grammar'),
    (cid, m4, 'Do or Does? — Present Simple Negative & Questions', 4, 'grammar'),
    (cid, m4, 'My Week — Time Expressions',            5, 'vocabulary'),
    (cid, m4, 'Module Review & Test',                  6, 'review');

  -- ── MODULE 5: Here & Now ────────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m5, 'What Are You Doing? — Present Continuous', 1, 'grammar'),
    (cid, m5, 'Now vs Always — Present Simple vs Continuous', 2, 'grammar'),
    (cid, m5, 'Commands & Instructions — Imperative',   3, 'grammar'),
    (cid, m5, 'General & Special Questions — Question Types', 4, 'grammar'),
    (cid, m5, 'Around the House — Grammar Review',      5, 'vocabulary'),
    (cid, m5, 'Module Review & Test',                   6, 'review');

  -- ── MODULE 6: Looking Back ──────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m6, 'What Did You Do? — Past Simple Regular', 1, 'grammar'),
    (cid, m6, 'Irregular Past — Irregular Verbs',       2, 'vocabulary'),
    (cid, m6, 'Did You? — Past Simple Negative & Questions', 3, 'grammar'),
    (cid, m6, 'My Weekend — Past Time Expressions',     4, 'vocabulary'),
    (cid, m6, 'Storytelling — Past Simple in Context',  5, 'listening'),
    (cid, m6, 'Module Review & Test',                   6, 'review');

  -- ── MODULE 7: Planning Ahead ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m7, 'Future Plans — Be Going To',             1, 'grammar'),
    (cid, m7, 'Predictions — Future Simple Will',       2, 'grammar'),
    (cid, m7, 'Making Plans — Future Simple vs Going To', 3, 'grammar'),
    (cid, m7, 'Weather & Seasons — Future in Context',  4, 'vocabulary'),
    (cid, m7, 'Travel Plans — Future Review',           5, 'listening'),
    (cid, m7, 'Module Review & Test',                   6, 'review');

  -- ── MODULE 8: Out & About ───────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m8, 'Shopping & Money — How much/many',       1, 'vocabulary'),
    (cid, m8, 'Eating Out — Ordering & Requests',       2, 'listening'),
    (cid, m8, 'Getting Around — Directions & Transport', 3, 'vocabulary'),
    (cid, m8, 'At the Hotel — Polite Requests',          4, 'grammar'),
    (cid, m8, 'In the Office — Formal Language Basics',  5, 'vocabulary'),
    (cid, m8, 'Module Review & Test',                    6, 'review');

  -- ── MODULE 9: The Final Mile ────────────────────────────────
  INSERT INTO english_lessons (course_id, module_id, title, order_index, lesson_type) VALUES
    (cid, m9, 'Grammar Review I — To Be, Present Simple, Past Simple', 1, 'grammar'),
    (cid, m9, 'Grammar Review II — Can, Going To, Will',               2, 'grammar'),
    (cid, m9, 'Vocabulary Review — All Topics',                        3, 'vocabulary'),
    (cid, m9, 'Reading Practice — Mixed Texts',                        4, 'vocabulary'),
    (cid, m9, 'Listening Practice — Mixed Audio',                      5, 'listening'),
    (cid, m9, 'Final Test & Certificate',                              6, 'review');

END $$;
