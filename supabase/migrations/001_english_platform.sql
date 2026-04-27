-- ============================================================
-- KHAMADI ENGLISH PLATFORM — Full Schema Migration (idempotent)
-- Safe to re-run: drops policies before re-creating them
-- ============================================================

-- ── Helper: drop all known policies safely ──────────────────
DO $$ BEGIN

  -- english_user_roles
  DROP POLICY IF EXISTS "users_read_own"   ON english_user_roles;
  DROP POLICY IF EXISTS "users_insert_own" ON english_user_roles;
  DROP POLICY IF EXISTS "users_update_own" ON english_user_roles;
  DROP POLICY IF EXISTS "admin_all"        ON english_user_roles;
  DROP POLICY IF EXISTS "teacher_read_all" ON english_user_roles;

  -- english_courses
  DROP POLICY IF EXISTS "anyone_read_active_courses" ON english_courses;
  DROP POLICY IF EXISTS "admin_manage_courses"       ON english_courses;

  -- english_modules
  DROP POLICY IF EXISTS "auth_read_modules"   ON english_modules;
  DROP POLICY IF EXISTS "admin_manage_modules" ON english_modules;

  -- english_lessons
  DROP POLICY IF EXISTS "auth_read_published_lessons" ON english_lessons;
  DROP POLICY IF EXISTS "admin_manage_lessons"        ON english_lessons;

  -- english_quizzes
  DROP POLICY IF EXISTS "auth_read_quizzes"   ON english_quizzes;
  DROP POLICY IF EXISTS "admin_manage_quizzes" ON english_quizzes;

  -- english_progress
  DROP POLICY IF EXISTS "users_own_progress"    ON english_progress;
  DROP POLICY IF EXISTS "teacher_read_progress" ON english_progress;

  -- english_enrollments
  DROP POLICY IF EXISTS "users_own_enrollments"    ON english_enrollments;
  DROP POLICY IF EXISTS "teacher_read_enrollments" ON english_enrollments;

  -- english_certificates
  DROP POLICY IF EXISTS "users_own_certs"      ON english_certificates;
  DROP POLICY IF EXISTS "teacher_read_certs"   ON english_certificates;
  DROP POLICY IF EXISTS "service_insert_certs" ON english_certificates;

  -- english_groups
  DROP POLICY IF EXISTS "teacher_own_groups"  ON english_groups;
  DROP POLICY IF EXISTS "students_read_groups" ON english_groups;

  -- english_group_members
  DROP POLICY IF EXISTS "teacher_manage_members"   ON english_group_members;
  DROP POLICY IF EXISTS "students_read_own_groups" ON english_group_members;

  -- english_materials
  DROP POLICY IF EXISTS "auth_read_materials"   ON english_materials;
  DROP POLICY IF EXISTS "admin_manage_materials" ON english_materials;

  -- english_study_sessions
  DROP POLICY IF EXISTS "users_own_sessions"    ON english_study_sessions;
  DROP POLICY IF EXISTS "teacher_read_sessions" ON english_study_sessions;

  -- english_notifications
  DROP POLICY IF EXISTS "users_own_notifs" ON english_notifications;

  -- english_support_tickets
  DROP POLICY IF EXISTS "users_own_tickets"      ON english_support_tickets;
  DROP POLICY IF EXISTS "teacher_read_tickets"   ON english_support_tickets;
  DROP POLICY IF EXISTS "teacher_update_tickets" ON english_support_tickets;

EXCEPTION WHEN undefined_table THEN NULL;
END $$;

-- ── 1. User roles & profiles ────────────────────────────────
CREATE TABLE IF NOT EXISTS english_user_roles (
  id              bigserial PRIMARY KEY,
  user_id         uuid REFERENCES auth.users NOT NULL UNIQUE,
  full_name       text,
  role            text NOT NULL DEFAULT 'student' CHECK (role IN ('student','teacher','admin')),
  purpose         text,
  language_pref   text NOT NULL DEFAULT 'ru' CHECK (language_pref IN ('ru','kz')),
  created_at      timestamptz NOT NULL DEFAULT now(),
  updated_at      timestamptz NOT NULL DEFAULT now()
);
-- Add new columns if they don't exist yet
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS language_pref   text NOT NULL DEFAULT 'ru';
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS current_level   text CHECK (current_level IN ('A1','A2','B1','B2','C1'));
ALTER TABLE english_user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_read_own"   ON english_user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "users_insert_own" ON english_user_roles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "users_update_own" ON english_user_roles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "admin_all"        ON english_user_roles FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);
CREATE POLICY "teacher_read_all" ON english_user_roles FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);

-- ── 2. Courses ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_courses (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title           text NOT NULL,
  title_kz        text,
  level           text,
  category        text NOT NULL DEFAULT 'General English',
  description     text,
  description_kz  text,
  is_active       boolean NOT NULL DEFAULT true,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_courses ADD COLUMN IF NOT EXISTS title_kz       text;
ALTER TABLE english_courses ADD COLUMN IF NOT EXISTS description_kz text;
ALTER TABLE english_courses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone_read_active_courses" ON english_courses FOR SELECT USING (
  is_active = true OR
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE POLICY "admin_manage_courses" ON english_courses FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

-- ── 3. Modules ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_modules (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id       uuid REFERENCES english_courses NOT NULL,
  title           text NOT NULL,
  title_kz        text,
  module_order    integer NOT NULL DEFAULT 0,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_modules ADD COLUMN IF NOT EXISTS title_kz text;
ALTER TABLE english_modules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_modules"    ON english_modules FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_manage_modules" ON english_modules FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

-- ── 4. Lessons ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_lessons (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id        uuid REFERENCES english_courses NOT NULL,
  module_id        uuid REFERENCES english_modules,
  title            text NOT NULL,
  lesson_type      text NOT NULL DEFAULT 'reading' CHECK (lesson_type IN ('reading','writing','listening','quiz')),
  content_url      text,
  content_body     text,
  audio_url        text,
  duration_minutes integer NOT NULL DEFAULT 30,
  lesson_order     integer NOT NULL DEFAULT 0,
  is_published     boolean NOT NULL DEFAULT false,
  created_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS module_id    uuid REFERENCES english_modules;
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS lesson_type  text NOT NULL DEFAULT 'reading';
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS content_body text;
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS audio_url    text;
ALTER TABLE english_lessons ADD COLUMN IF NOT EXISTS is_published boolean NOT NULL DEFAULT false;
ALTER TABLE english_lessons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_published_lessons" ON english_lessons FOR SELECT TO authenticated USING (
  is_published = true OR
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE POLICY "admin_manage_lessons" ON english_lessons FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

-- ── 5. Quizzes ───────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_quizzes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id       uuid REFERENCES english_lessons NOT NULL,
  questions       jsonb NOT NULL DEFAULT '[]',
  pass_threshold  integer NOT NULL DEFAULT 70,
  created_at      timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_quizzes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_quizzes"    ON english_quizzes FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_manage_quizzes" ON english_quizzes FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);

-- ── 6. Progress ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_progress (
  id             bigserial PRIMARY KEY,
  user_id        uuid REFERENCES auth.users NOT NULL,
  lesson_id      uuid NOT NULL,
  completed      boolean NOT NULL DEFAULT false,
  score          integer,
  time_spent_min integer NOT NULL DEFAULT 0,
  completed_at   timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);
ALTER TABLE english_progress ADD COLUMN IF NOT EXISTS time_spent_min integer NOT NULL DEFAULT 0;
ALTER TABLE english_progress ADD COLUMN IF NOT EXISTS completed_at   timestamptz;
ALTER TABLE english_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_progress"    ON english_progress FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "teacher_read_progress" ON english_progress FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE INDEX IF NOT EXISTS english_progress_user_idx   ON english_progress(user_id);
CREATE INDEX IF NOT EXISTS english_progress_lesson_idx ON english_progress(lesson_id);

-- ── 7. Enrollments ───────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_enrollments (
  id           bigserial PRIMARY KEY,
  user_id      uuid REFERENCES auth.users NOT NULL,
  course_id    uuid REFERENCES english_courses NOT NULL,
  enrolled_at  timestamptz NOT NULL DEFAULT now(),
  completed_at timestamptz,
  UNIQUE(user_id, course_id)
);
ALTER TABLE english_enrollments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_enrollments"    ON english_enrollments FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "teacher_read_enrollments" ON english_enrollments FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);

-- ── 8. Certificates ──────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_certificates (
  id                 uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid REFERENCES auth.users NOT NULL,
  course_id          uuid REFERENCES english_courses NOT NULL,
  certificate_number text NOT NULL UNIQUE,
  issued_at          timestamptz NOT NULL DEFAULT now(),
  final_score        integer NOT NULL DEFAULT 0,
  UNIQUE(user_id, course_id)
);
ALTER TABLE english_certificates ADD COLUMN IF NOT EXISTS final_score integer NOT NULL DEFAULT 0;
ALTER TABLE english_certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_certs"      ON english_certificates FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "teacher_read_certs"   ON english_certificates FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE POLICY "service_insert_certs" ON english_certificates FOR INSERT WITH CHECK (true);

-- ── 9. Groups ────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_groups (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  teacher_id  uuid REFERENCES auth.users NOT NULL,
  course_id   uuid REFERENCES english_courses,
  name        text NOT NULL,
  description text,
  created_at  timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_groups ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher_own_groups"   ON english_groups FOR ALL USING (
  auth.uid() = teacher_id OR
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);
CREATE POLICY "students_read_groups" ON english_groups FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_group_members m WHERE m.group_id = id AND m.student_id = auth.uid())
);

-- ── 10. Group members ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_group_members (
  group_id   uuid REFERENCES english_groups NOT NULL,
  student_id uuid REFERENCES auth.users NOT NULL,
  joined_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (group_id, student_id)
);
ALTER TABLE english_group_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "teacher_manage_members" ON english_group_members FOR ALL USING (
  EXISTS (SELECT 1 FROM english_groups g WHERE g.id = group_id AND g.teacher_id = auth.uid()) OR
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role = 'admin')
);
CREATE POLICY "students_read_own_groups" ON english_group_members FOR SELECT USING (auth.uid() = student_id);

-- ── 11. Materials ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_materials (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  uploaded_by  uuid REFERENCES auth.users NOT NULL,
  course_id    uuid REFERENCES english_courses,
  lesson_id    uuid,
  title        text NOT NULL,
  file_type    text NOT NULL CHECK (file_type IN ('pdf','audio','video','image','other')),
  file_url     text NOT NULL,
  file_size_kb integer,
  created_at   timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth_read_materials"    ON english_materials FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin_manage_materials" ON english_materials FOR ALL USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('admin','teacher'))
);

-- ── 12. Study sessions ───────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_study_sessions (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid REFERENCES auth.users NOT NULL,
  lesson_id        uuid,
  course_id        uuid REFERENCES english_courses,
  duration_minutes integer NOT NULL DEFAULT 0,
  session_date     date NOT NULL DEFAULT CURRENT_DATE,
  created_at       timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_study_sessions ADD COLUMN IF NOT EXISTS session_date date NOT NULL DEFAULT CURRENT_DATE;
ALTER TABLE english_study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_sessions"    ON english_study_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "teacher_read_sessions" ON english_study_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE INDEX IF NOT EXISTS english_sessions_user_idx ON english_study_sessions(user_id);

-- ── 13. Notifications ────────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_notifications (
  id         bigserial PRIMARY KEY,
  user_id    uuid REFERENCES auth.users NOT NULL,
  title      text NOT NULL,
  body       text,
  is_read    boolean NOT NULL DEFAULT false,
  link       text,
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_notifications ADD COLUMN IF NOT EXISTS title text;
ALTER TABLE english_notifications ADD COLUMN IF NOT EXISTS link  text;
ALTER TABLE english_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_notifs" ON english_notifications FOR ALL USING (auth.uid() = user_id);
CREATE INDEX IF NOT EXISTS english_notifs_user_idx ON english_notifications(user_id, is_read);

-- ── 14. Support tickets ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS english_support_tickets (
  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    uuid REFERENCES auth.users NOT NULL,
  subject    text NOT NULL,
  message    text NOT NULL,
  status     text NOT NULL DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved')),
  created_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE english_support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_tickets"      ON english_support_tickets FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "teacher_read_tickets"   ON english_support_tickets FOR SELECT USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);
CREATE POLICY "teacher_update_tickets" ON english_support_tickets FOR UPDATE USING (
  EXISTS (SELECT 1 FROM english_user_roles r WHERE r.user_id = auth.uid() AND r.role IN ('teacher','admin'))
);

-- ── SEED: 12 courses ─────────────────────────────────────────
INSERT INTO english_courses (title, title_kz, level, category, description, description_kz) VALUES
  ('A1 Beginner',          'A1 Бастауыш',          'A1', 'General English',              'Старт с нуля: базовые фразы, простая грамматика, словарь.',          'Нөлден бастау: базалық фразалар, қарапайым грамматика, сөздік.'),
  ('A2 Elementary',        'A2 Элементарлы',        'A2', 'General English',              'Повседневный английский для общения, поездок и покупок.',            'Күнделікті ағылшын тілі — сөйлесу, саяхат, сатып алу.'),
  ('B1 Intermediate',      'B1 Орта деңгей',        'B1', 'General English',              'Уровень для учёбы, работы и свободной коммуникации.',                'Оқу, жұмыс және еркін коммуникация деңгейі.'),
  ('B2 Upper-Intermediate','B2 Жоғары орта деңгей', 'B2', 'General English',              'Сильная грамматика, структурированное письмо, уверенная речь.',      'Мықты грамматика, жазу құрылымы, сенімді сөйлеу.'),
  ('C1 Advanced',          'C1 Жоғары деңгей',      'C1', 'General English',              'Продвинутый английский для карьеры и переговоров.',                  'Карьера және келіссөздер үшін жоғары деңгей.'),
  ('Accounting',           'Бухгалтерлік есеп',     'B1', 'English for Special Purposes', 'Бухгалтерия, отчётность, налоги и деловая переписка.',               'Бухгалтерлік есеп, есептілік, салықтар және іскерлік хат.'),
  ('Computer Science',     'Информатика',            'B1', 'English for Special Purposes', 'IT-лексика, документация и техническая коммуникация.',               'IT лексикасы, құжаттама және техникалық коммуникация.'),
  ('Hospitality',          'Қонақжайлылық',          'A2', 'English for Special Purposes', 'Английский для гостиничного сервиса, туризма и работы с клиентами.', 'Қонақүй сервисі, туризм және клиенттермен жұмыс.'),
  ('Management',           'Менеджмент',             'B1', 'English for Special Purposes', 'Управление командой, деловая речь, рабочие встречи.',                'Команданы басқару, іскерлік тіл, жұмыс жиналыстары.'),
  ('Finance Industry',     'Қаржы саласы',           'B1', 'English for Special Purposes', 'Финансовая терминология, рынки, отчёты, банковская лексика.',        'Қаржы терминологиясы, нарықтар, есептер, банктік лексика.'),
  ('Social Sciences',      'Әлеуметтік ғылымдар',   'B1', 'English for Special Purposes', 'Английский для исследований и гуманитарных дисциплин.',              'Зерттеу және гуманитарлық пәндер үшін ағылшын тілі.'),
  ('Law',                  'Заң',                    'B1', 'English for Special Purposes', 'Юридическая лексика, formal English и договоры.',                   'Заңдық лексика, ресми ағылшын тілі және шарттар.')
ON CONFLICT DO NOTHING;

-- ── Storage bucket (run once in Supabase Dashboard → Storage) ──
-- CREATE BUCKET "english-materials" (public: false)
