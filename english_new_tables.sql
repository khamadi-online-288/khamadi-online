-- ═══════════════════════════════════════════════════════════════
-- KHAMADI ENGLISH — New Tables (Phase 2)
-- Run this in Supabase SQL Editor AFTER english_supabase_setup.sql
-- Safe to re-run multiple times (idempotent)
-- ═══════════════════════════════════════════════════════════════


-- ─── 1. ЭЛЕКТРОННЫЕ УЧЕБНИКИ ────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_textbooks (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id   uuid REFERENCES english_courses(id) ON DELETE SET NULL,
  title       text NOT NULL,
  description text,
  file_url    text,
  level       text,
  created_at  timestamptz DEFAULT now()
);

-- Demo data
INSERT INTO english_textbooks (title, description, level, file_url)
SELECT title, description, level, file_url FROM (VALUES
  ('English Grammar in Use', 'Базовый учебник грамматики от Raymond Murphy. Охватывает все ключевые темы уровня A1–B1.', 'B1', NULL::text),
  ('Headway Elementary', 'Учебник для начинающих с аудио-компонентом, диалогами и упражнениями.', 'A2', NULL),
  ('Oxford Business English', 'Профессиональный английский для деловой коммуникации, переговоров и презентаций.', 'B2', NULL),
  ('Cambridge IELTS 15', 'Официальные тренировочные тесты IELTS от Cambridge University Press.', 'C1', NULL),
  ('English Vocabulary in Use', 'Расширение словарного запаса — 60 тематических разделов, упражнения, ответы.', 'B1', NULL),
  ('Academic Writing for Graduate Students', 'Академическое письмо для студентов и аспирантов на английском языке.', 'C1', NULL)
) AS v(title, description, level, file_url)
WHERE NOT EXISTS (SELECT 1 FROM english_textbooks WHERE english_textbooks.title = v.title);


-- ─── 2. ТИКЕТЫ ТЕХНИЧЕСКОЙ ПОДДЕРЖКИ ───────────────────────────
CREATE TABLE IF NOT EXISTS english_support_tickets (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'open',  -- open | in_progress | resolved | closed
  created_at timestamptz DEFAULT now()
);

ALTER TABLE english_support_tickets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "users_insert_own_tickets" ON english_support_tickets;
CREATE POLICY "users_insert_own_tickets" ON english_support_tickets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "users_read_own_tickets" ON english_support_tickets;
CREATE POLICY "users_read_own_tickets" ON english_support_tickets
  FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_all_tickets" ON english_support_tickets;
CREATE POLICY "admin_all_tickets" ON english_support_tickets
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM english_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'teacher')
    )
  );


-- ─── 3. ТРЕКИНГ ЧАСОВ ОБУЧЕНИЯ ──────────────────────────────────
CREATE TABLE IF NOT EXISTS english_study_sessions (
  id               uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  lesson_id        uuid REFERENCES english_lessons(id) ON DELETE SET NULL,
  started_at       timestamptz DEFAULT now(),
  ended_at         timestamptz,
  duration_minutes integer
);

CREATE INDEX IF NOT EXISTS idx_study_sessions_user    ON english_study_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_study_sessions_started ON english_study_sessions(started_at);

ALTER TABLE english_study_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "student_own_sessions" ON english_study_sessions;
CREATE POLICY "student_own_sessions" ON english_study_sessions
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "teacher_read_sessions" ON english_study_sessions;
CREATE POLICY "teacher_read_sessions" ON english_study_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM english_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('teacher', 'admin')
    )
  );


-- ─── 4. УВЕДОМЛЕНИЯ ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_notifications (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title      text NOT NULL,
  message    text NOT NULL,
  is_read    boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user ON english_notifications(user_id, is_read);

ALTER TABLE english_notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "user_own_notifications" ON english_notifications;
CREATE POLICY "user_own_notifications" ON english_notifications
  FOR ALL USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "admin_insert_notifications" ON english_notifications;
CREATE POLICY "admin_insert_notifications" ON english_notifications
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM english_user_roles
      WHERE user_id = auth.uid()
      AND role IN ('admin', 'teacher')
    )
  );


-- ─── 5. RLS для существующих таблиц ────────────────────────────
DO $$
BEGIN
  ALTER TABLE english_progress ENABLE ROW LEVEL SECURITY;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'english_progress' AND policyname = 'student_own_progress'
  ) THEN
    CREATE POLICY "student_own_progress" ON english_progress
      FOR ALL USING (auth.uid() = user_id);
  END IF;
END$$;

DO $$
BEGIN
  ALTER TABLE english_user_roles ENABLE ROW LEVEL SECURITY;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'english_user_roles' AND policyname = 'user_own_role'
  ) THEN
    CREATE POLICY "user_own_role" ON english_user_roles
      FOR ALL USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'english_user_roles' AND policyname = 'teacher_read_all'
  ) THEN
    CREATE POLICY "teacher_read_all" ON english_user_roles
      FOR SELECT USING (
        auth.uid() = user_id OR
        EXISTS (
          SELECT 1 FROM english_user_roles ur
          WHERE ur.user_id = auth.uid()
          AND ur.role IN ('teacher', 'admin')
        )
      );
  END IF;
END$$;


-- ─── 6. Функция автоматических уведомлений ──────────────────────
CREATE OR REPLACE FUNCTION notify_user(
  p_user_id uuid,
  p_title   text,
  p_message text
) RETURNS void AS $$
BEGIN
  INSERT INTO english_notifications (user_id, title, message)
  VALUES (p_user_id, p_title, p_message);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
