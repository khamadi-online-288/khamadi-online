-- ============================================================
-- 021: KHAMADI English — New Module
-- Creates new tables with english_ prefix to coexist with existing
-- existing tables (english_courses, english_modules, english_lessons, etc.)
-- Uses CREATE TABLE IF NOT EXISTS for safety
-- ============================================================

-- ── TENANTS ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_tenants (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  logo_url      TEXT,
  primary_color TEXT DEFAULT '#1B3A6B',
  email_domain  TEXT,
  custom_url    TEXT,
  created_at    TIMESTAMPTZ DEFAULT now()
);

INSERT INTO english_tenants (code, name, primary_color, email_domain)
VALUES
  ('khamadi', 'KHAMADI English',               '#1B3A6B', NULL),
  ('zku',     'ЗКУ by KHAMADI English',         '#003876', '@zku.kz')
ON CONFLICT (code) DO NOTHING;

-- ── CEFR LEVELS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_levels (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  order_num     INT NOT NULL,
  total_lessons INT,
  total_hours   INT,
  total_words   INT,
  description   TEXT
);

INSERT INTO english_levels (code, name, order_num, total_lessons, total_hours, total_words)
VALUES
  ('A1', 'Beginner',           1, 80,  120, 800),
  ('A2', 'Pre-Intermediate',   2, 100, 150, 1000),
  ('B1', 'Intermediate',       3, 130, 200, 1200),
  ('B2', 'Upper-Intermediate', 4, 130, 200, 1500),
  ('C1', 'Advanced',           5, 160, 230, 1500)
ON CONFLICT (code) DO NOTHING;

-- ── Add level_id to english_modules if missing ──────────────
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS level_id UUID REFERENCES english_levels(id);
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS grammar_focus TEXT;
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS vocab_count INT DEFAULT 30;

-- ── Seed A1 module titles (update existing by order_num) ─────
DO $$
DECLARE lvl_id UUID;
BEGIN
  SELECT id INTO lvl_id FROM english_levels WHERE code = 'A1';
  IF lvl_id IS NULL THEN RETURN; END IF;

  -- Link existing A1 modules to level if not already linked
  -- (matches modules that belong to A1 course by order)
  UPDATE english_modules
  SET level_id = lvl_id
  WHERE level_id IS NULL
    AND order_num BETWEEN 1 AND 16
    AND NOT EXISTS (SELECT 1 FROM english_modules m2 WHERE m2.level_id IS NOT NULL AND m2.id = english_modules.id);

  -- Set A1 titles
  WITH titles(ord, t, g) AS (VALUES
    (1,  'Hello, world!',        'Articles, am/is/are'),
    (2,  'My family',            'have/has, possessive'),
    (3,  'My things',            'this/that/these/those'),
    (4,  'My day',               'Present Simple'),
    (5,  'I can / I can''t',     'can/can''t'),
    (6,  'My hobbies',           'Present Simple he/she'),
    (7,  'Food and drinks',      'some/any'),
    (8,  'My home',              'there is/are'),
    (9,  'Right now',            'Present Continuous'),
    (10, 'Yesterday',            'Past Simple was/were'),
    (11, 'Last weekend',         'Past Simple regular'),
    (12, 'Travel and places',    'prepositions'),
    (13, 'Numbers and money',    'numbers up to 1000'),
    (14, 'Weather and clothes',  'adjectives'),
    (15, 'Future plans',         'going to'),
    (16, 'Final review',         'all A1 topics')
  )
  UPDATE english_modules m
  SET title = titles.t, grammar_focus = titles.g, level_id = lvl_id
  FROM titles
  WHERE m.order_num = titles.ord AND m.level_id = lvl_id;
END $$;

-- ── VOCABULARY ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_vocabulary (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  word_en          TEXT NOT NULL,
  phonetic         TEXT,
  translation_ru   TEXT,
  translation_kz   TEXT,
  level_code       TEXT,
  module_id        UUID,
  audio_url        TEXT,
  example_sentence TEXT,
  part_of_speech   TEXT
);

-- ── USER VOCAB (SM-2) ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_user_vocab (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  word_id        UUID REFERENCES english_vocabulary(id) ON DELETE CASCADE,
  added_at       TIMESTAMPTZ DEFAULT now(),
  mastery_level  INT DEFAULT 0 CHECK (mastery_level BETWEEN 0 AND 5),
  ease_factor    NUMERIC(4,2) DEFAULT 2.5,
  interval_days  INT DEFAULT 1,
  next_review_at TIMESTAMPTZ,
  review_count   INT DEFAULT 0,
  UNIQUE(user_id, word_id)
);

-- ── TENANTS ──────────────────────────────────────────────────
-- Add tenant_id to existing user_roles if missing
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS tenant_id UUID REFERENCES english_tenants(id);

-- ── ENGLISH USER PROFILES (new, english-module specific) ──────
CREATE TABLE IF NOT EXISTS english_user_profiles (
  user_id        UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  tenant_id      UUID REFERENCES english_tenants(id),
  role           TEXT NOT NULL DEFAULT 'student',
  full_name      TEXT,
  current_level  TEXT DEFAULT 'A1',
  total_xp       INT DEFAULT 0,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_active_at TIMESTAMPTZ DEFAULT now(),
  created_at     TIMESTAMPTZ DEFAULT now()
);

-- ── ASSIGNMENTS ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  group_id    UUID REFERENCES english_groups(id) ON DELETE CASCADE,
  lesson_id   UUID REFERENCES english_lessons(id),
  module_id   UUID REFERENCES english_modules(id),
  title       TEXT NOT NULL,
  deadline_at TIMESTAMPTZ,
  min_score   INT DEFAULT 75,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ── MESSAGES ─────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_messages (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  from_user_id UUID REFERENCES auth.users(id),
  to_user_id   UUID REFERENCES auth.users(id),
  text         TEXT,
  audio_url    TEXT,
  read_at      TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- ── ACHIEVEMENTS ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_achievements_new (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code            TEXT UNIQUE NOT NULL,
  title           TEXT,
  description     TEXT,
  icon            TEXT,
  xp_reward       INT DEFAULT 0,
  condition_type  TEXT,
  condition_value INT
);

INSERT INTO english_achievements_new (code, title, description, icon, xp_reward, condition_type, condition_value)
VALUES
  ('first_lesson',    'Первый шаг',          'Завершил первый урок',       '🎯', 50,  'lessons', 1),
  ('streak_7',        'Неделя подряд',        '7 дней занятий подряд',     '🔥', 100, 'streak',  7),
  ('streak_30',       'Месяц подряд',         '30 дней без пауз',          '💎', 500, 'streak',  30),
  ('perfect_score',   'Отличник',             '100% на любом уроке',       '⭐', 75,  'score',   100),
  ('module_complete', 'Модуль пройден',       'Завершил первый модуль',    '🏆', 200, 'modules', 1),
  ('vocab_50',        'Начинающий словарник', 'Выучил 50 слов',            '📖', 100, 'vocab',   50),
  ('vocab_100',       'Словарник',            'Выучил 100 слов',           '📚', 200, 'vocab',   100),
  ('xp_1000',         'XP × 1000',            'Набрал 1000 XP',            '⚡', 100, 'xp',      1000),
  ('level_a1',        'A1 Complete!',         'Завершил уровень A1',       '🎓', 500, 'levels',  1)
ON CONFLICT (code) DO NOTHING;

CREATE TABLE IF NOT EXISTS english_user_achievements (
  user_id        UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_id UUID REFERENCES english_achievements_new(id) ON DELETE CASCADE,
  earned_at      TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, achievement_id)
);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE english_vocabulary     ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_user_vocab     ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_assignments    ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_messages       ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_user_profiles  ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_levels         ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies safely
DO $$ BEGIN
  DROP POLICY IF EXISTS "en_public_vocab"         ON english_vocabulary;
  DROP POLICY IF EXISTS "en_own_vocab"            ON english_user_vocab;
  DROP POLICY IF EXISTS "en_teacher_assignments"  ON english_assignments;
  DROP POLICY IF EXISTS "en_own_messages"         ON english_messages;
  DROP POLICY IF EXISTS "en_public_levels"        ON english_levels;
  DROP POLICY IF EXISTS "en_own_profile"          ON english_user_profiles;
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

CREATE POLICY "en_public_vocab"   ON english_vocabulary  FOR SELECT USING (true);
CREATE POLICY "en_public_levels"  ON english_levels       FOR SELECT USING (true);
CREATE POLICY "en_own_vocab"      ON english_user_vocab   FOR ALL    USING (auth.uid() = user_id);
CREATE POLICY "en_own_messages"   ON english_messages     FOR ALL    USING (auth.uid() = from_user_id OR auth.uid() = to_user_id);
CREATE POLICY "en_own_profile"    ON english_user_profiles FOR ALL   USING (auth.uid() = user_id);
CREATE POLICY "en_teacher_assignments" ON english_assignments FOR ALL USING (auth.uid() = teacher_id);
