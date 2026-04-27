-- XP СИСТЕМА
CREATE TABLE IF NOT EXISTS english_xp_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  action text NOT NULL,
  xp integer NOT NULL DEFAULT 0,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS english_user_xp (
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE PRIMARY KEY,
  total_xp integer DEFAULT 0,
  weekly_xp integer DEFAULT 0,
  monthly_xp integer DEFAULT 0,
  streak_days integer DEFAULT 0,
  last_active_date date,
  updated_at timestamptz DEFAULT now()
);

-- PLACEMENT TEST
CREATE TABLE IF NOT EXISTS english_placement_results (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer NOT NULL,
  total_questions integer DEFAULT 60,
  grammar_score integer,
  reading_score integer,
  vocabulary_score integer,
  recommended_level text,
  answers jsonb,
  completed_at timestamptz DEFAULT now()
);

-- MOCK EXAM
CREATE TABLE IF NOT EXISTS english_mock_exams (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  score integer,
  max_score integer DEFAULT 40,
  band_score numeric(3,1),
  answers jsonb,
  ai_feedback text,
  time_spent_seconds integer,
  completed_at timestamptz DEFAULT now()
);

-- СЛОВАРЬ + SRS
CREATE TABLE IF NOT EXISTS english_vocabulary (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  word text NOT NULL,
  translation text,
  definition text,
  etymology text,
  root_words text[],
  example_sentence text,
  lesson_id uuid REFERENCES english_lessons(id),
  difficulty integer DEFAULT 0,
  next_review_at timestamptz DEFAULT now(),
  correct_count integer DEFAULT 0,
  incorrect_count integer DEFAULT 0,
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, word)
);

-- WRITING COACH
CREATE TABLE IF NOT EXISTS english_writing_sessions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  prompt text,
  essay_text text,
  word_count integer,
  ai_feedback jsonb,
  overall_score integer,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_xp_user ON english_xp_log(user_id);
CREATE INDEX IF NOT EXISTS idx_xp_created ON english_xp_log(created_at);
CREATE INDEX IF NOT EXISTS idx_vocab_user ON english_vocabulary(user_id);
CREATE INDEX IF NOT EXISTS idx_vocab_review ON english_vocabulary(user_id, next_review_at);

ALTER TABLE english_xp_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_user_xp ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_placement_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_mock_exams ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_writing_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "own_xp_log" ON english_xp_log;
CREATE POLICY "own_xp_log" ON english_xp_log FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "read_all_xp" ON english_user_xp;
CREATE POLICY "read_all_xp" ON english_user_xp FOR SELECT USING (true);

DROP POLICY IF EXISTS "own_user_xp" ON english_user_xp;
CREATE POLICY "own_user_xp" ON english_user_xp FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "own_placement" ON english_placement_results;
CREATE POLICY "own_placement" ON english_placement_results FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "own_mock" ON english_mock_exams;
CREATE POLICY "own_mock" ON english_mock_exams FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "own_vocab" ON english_vocabulary;
CREATE POLICY "own_vocab" ON english_vocabulary FOR ALL USING (user_id = auth.uid());

DROP POLICY IF EXISTS "own_writing" ON english_writing_sessions;
CREATE POLICY "own_writing" ON english_writing_sessions FOR ALL USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION add_english_xp(
  p_user_id uuid, p_action text, p_xp integer, p_metadata jsonb DEFAULT NULL
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  INSERT INTO english_xp_log(user_id, action, xp, metadata)
  VALUES (p_user_id, p_action, p_xp, p_metadata);

  INSERT INTO english_user_xp(user_id, total_xp, weekly_xp, monthly_xp, last_active_date, updated_at)
  VALUES (p_user_id, p_xp, p_xp, p_xp, CURRENT_DATE, now())
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp = english_user_xp.total_xp + p_xp,
    weekly_xp = english_user_xp.weekly_xp + p_xp,
    monthly_xp = english_user_xp.monthly_xp + p_xp,
    streak_days = CASE
      WHEN english_user_xp.last_active_date = CURRENT_DATE - 1 THEN english_user_xp.streak_days + 1
      WHEN english_user_xp.last_active_date = CURRENT_DATE THEN english_user_xp.streak_days
      ELSE 1
    END,
    last_active_date = CURRENT_DATE,
    updated_at = now();
END;
$$;
