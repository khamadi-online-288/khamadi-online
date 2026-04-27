-- =============================================
-- LMS FULL SCHEMA — KHAMADI ONLINE
-- =============================================

-- =============================================
-- РОЛИ И ПРОФИЛИ
-- =============================================

ALTER TABLE profiles ADD COLUMN IF NOT EXISTS role text DEFAULT 'student'
  CHECK (role IN ('student', 'teacher', 'admin'));
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS full_name text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS phone text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS avatar_url text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS department text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS student_id_number text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS last_seen_at timestamptz;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS language_level text;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS created_at timestamptz DEFAULT now();

-- =============================================
-- ГРУППЫ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_groups (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  description text,
  teacher_id uuid REFERENCES profiles(id),
  academic_year text,
  department text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lms_group_students (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES lms_groups(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  enrolled_at timestamptz DEFAULT now(),
  UNIQUE(group_id, student_id)
);

-- =============================================
-- НАЗНАЧЕНИЕ КУРСОВ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_course_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES english_courses(id) ON DELETE CASCADE,
  group_id uuid REFERENCES lms_groups(id) ON DELETE CASCADE,
  teacher_id uuid REFERENCES profiles(id),
  assigned_at timestamptz DEFAULT now(),
  deadline timestamptz,
  is_mandatory boolean DEFAULT true,
  UNIQUE(course_id, group_id)
);

-- =============================================
-- ПРОГРЕСС СТУДЕНТОВ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  course_id uuid REFERENCES english_courses(id),
  module_id uuid REFERENCES english_modules(id),
  lesson_id uuid REFERENCES english_lessons(id),
  section_type text,
  status text DEFAULT 'not_started'
    CHECK (status IN ('not_started', 'in_progress', 'completed')),
  score integer,
  attempts integer DEFAULT 0,
  time_spent_seconds integer DEFAULT 0,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, lesson_id, section_type)
);

-- =============================================
-- ДОМАШНИЕ ЗАДАНИЯ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_assignments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  teacher_id uuid REFERENCES profiles(id),
  group_id uuid REFERENCES lms_groups(id),
  course_id uuid REFERENCES english_courses(id),
  type text CHECK (type IN ('essay', 'quiz', 'speaking', 'reading', 'project')),
  due_date timestamptz,
  max_score integer DEFAULT 100,
  instructions text,
  attachment_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lms_assignment_submissions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  assignment_id uuid REFERENCES lms_assignments(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id),
  content text,
  attachment_url text,
  score integer,
  feedback text,
  status text DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'reviewed', 'graded', 'returned')),
  submitted_at timestamptz DEFAULT now(),
  graded_at timestamptz,
  graded_by uuid REFERENCES profiles(id)
);

-- =============================================
-- ЖУРНАЛ ОЦЕНОК
-- =============================================

CREATE TABLE IF NOT EXISTS lms_grades (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id),
  teacher_id uuid REFERENCES profiles(id),
  group_id uuid REFERENCES lms_groups(id),
  course_id uuid REFERENCES english_courses(id),
  grade_type text CHECK (grade_type IN ('quiz', 'assignment', 'midterm', 'final', 'attendance')),
  score integer,
  max_score integer DEFAULT 100,
  comment text,
  graded_at timestamptz DEFAULT now()
);

-- =============================================
-- ПОСЕЩАЕМОСТЬ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_attendance (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id),
  group_id uuid REFERENCES lms_groups(id),
  teacher_id uuid REFERENCES profiles(id),
  date date NOT NULL,
  status text CHECK (status IN ('present', 'absent', 'late', 'excused')),
  note text,
  created_at timestamptz DEFAULT now(),
  UNIQUE(student_id, group_id, date)
);

-- =============================================
-- РАСПИСАНИЕ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_schedule (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  group_id uuid REFERENCES lms_groups(id),
  teacher_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  description text,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  type text CHECK (type IN ('lesson', 'exam', 'consultation', 'event')),
  location text,
  meeting_url text,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- СООБЩЕНИЯ / ЧАТ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_conversations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  type text CHECK (type IN ('direct', 'group')),
  group_id uuid REFERENCES lms_groups(id),
  title text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS lms_conversation_members (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES lms_conversations(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id),
  joined_at timestamptz DEFAULT now(),
  UNIQUE(conversation_id, user_id)
);

CREATE TABLE IF NOT EXISTS lms_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  conversation_id uuid REFERENCES lms_conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id),
  content text NOT NULL,
  attachment_url text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- ОБЪЯВЛЕНИЯ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_announcements (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id uuid REFERENCES profiles(id),
  title text NOT NULL,
  body text NOT NULL,
  target text CHECK (target IN ('all', 'students', 'teachers', 'group')),
  group_id uuid REFERENCES lms_groups(id),
  is_pinned boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- СЕРТИФИКАТЫ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES profiles(id),
  course_id uuid REFERENCES english_courses(id),
  certificate_number text UNIQUE,
  issued_at timestamptz DEFAULT now(),
  final_score integer,
  pdf_url text
);

-- =============================================
-- УВЕДОМЛЕНИЯ
-- =============================================

CREATE TABLE IF NOT EXISTS lms_notifications (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text,
  title text,
  body text,
  link text,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- АКТИВНОСТЬ (лог для аналитики)
-- =============================================

CREATE TABLE IF NOT EXISTS lms_activity_log (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  entity_type text,
  entity_id uuid,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- =============================================
-- ИНДЕКСЫ
-- =============================================

CREATE INDEX IF NOT EXISTS idx_lms_progress_student ON lms_progress(student_id);
CREATE INDEX IF NOT EXISTS idx_lms_progress_course ON lms_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_lms_grades_student ON lms_grades(student_id);
CREATE INDEX IF NOT EXISTS idx_lms_attendance_student ON lms_attendance(student_id);
CREATE INDEX IF NOT EXISTS idx_lms_messages_conversation ON lms_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_lms_notifications_user ON lms_notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_activity_user ON lms_activity_log(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_activity_created ON lms_activity_log(created_at);

-- =============================================
-- RLS ПОЛИТИКИ
-- =============================================

ALTER TABLE lms_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_assignment_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_certificates ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_group_students ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_schedule ENABLE ROW LEVEL SECURITY;
ALTER TABLE lms_activity_log ENABLE ROW LEVEL SECURITY;

-- Хелпер для роли
CREATE OR REPLACE FUNCTION lms_get_role(uid uuid)
RETURNS text
LANGUAGE sql SECURITY DEFINER STABLE
AS $$
  SELECT role FROM english_user_roles WHERE user_id = uid LIMIT 1;
$$;

-- Прогресс
DROP POLICY IF EXISTS "student_own_progress" ON lms_progress;
CREATE POLICY "student_own_progress" ON lms_progress
  FOR ALL USING (student_id = auth.uid());

DROP POLICY IF EXISTS "teacher_group_progress" ON lms_progress;
CREATE POLICY "teacher_group_progress" ON lms_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lms_groups g
      JOIN lms_group_students gs ON gs.group_id = g.id
      WHERE g.teacher_id = auth.uid() AND gs.student_id = lms_progress.student_id
    ) OR lms_get_role(auth.uid()) = 'admin'
  );

-- Группы
DROP POLICY IF EXISTS "teacher_own_groups" ON lms_groups;
CREATE POLICY "teacher_own_groups" ON lms_groups
  FOR ALL USING (teacher_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "student_see_groups" ON lms_groups;
CREATE POLICY "student_see_groups" ON lms_groups
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lms_group_students WHERE group_id = lms_groups.id AND student_id = auth.uid())
    OR lms_get_role(auth.uid()) IN ('teacher','admin')
  );

DROP POLICY IF EXISTS "group_students_policy" ON lms_group_students;
CREATE POLICY "group_students_policy" ON lms_group_students
  FOR ALL USING (lms_get_role(auth.uid()) IN ('teacher','admin') OR student_id = auth.uid());

-- Задания
DROP POLICY IF EXISTS "teacher_own_assignments" ON lms_assignments;
CREATE POLICY "teacher_own_assignments" ON lms_assignments
  FOR ALL USING (teacher_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "student_see_assignments" ON lms_assignments;
CREATE POLICY "student_see_assignments" ON lms_assignments
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM lms_group_students WHERE group_id = lms_assignments.group_id AND student_id = auth.uid())
  );

DROP POLICY IF EXISTS "own_submissions" ON lms_assignment_submissions;
CREATE POLICY "own_submissions" ON lms_assignment_submissions
  FOR ALL USING (student_id = auth.uid() OR lms_get_role(auth.uid()) IN ('teacher','admin'));

-- Оценки
DROP POLICY IF EXISTS "student_own_grades" ON lms_grades;
CREATE POLICY "student_own_grades" ON lms_grades
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "teacher_manage_grades" ON lms_grades;
CREATE POLICY "teacher_manage_grades" ON lms_grades
  FOR ALL USING (teacher_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

-- Посещаемость
DROP POLICY IF EXISTS "student_own_attendance" ON lms_attendance;
CREATE POLICY "student_own_attendance" ON lms_attendance
  FOR SELECT USING (student_id = auth.uid());

DROP POLICY IF EXISTS "teacher_manage_attendance" ON lms_attendance;
CREATE POLICY "teacher_manage_attendance" ON lms_attendance
  FOR ALL USING (teacher_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

-- Расписание
DROP POLICY IF EXISTS "schedule_policy" ON lms_schedule;
CREATE POLICY "schedule_policy" ON lms_schedule
  FOR SELECT USING (
    teacher_id = auth.uid()
    OR EXISTS (SELECT 1 FROM lms_group_students WHERE group_id = lms_schedule.group_id AND student_id = auth.uid())
    OR lms_get_role(auth.uid()) = 'admin'
  );

DROP POLICY IF EXISTS "teacher_manage_schedule" ON lms_schedule;
CREATE POLICY "teacher_manage_schedule" ON lms_schedule
  FOR ALL USING (teacher_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

-- Уведомления
DROP POLICY IF EXISTS "own_notifications" ON lms_notifications;
CREATE POLICY "own_notifications" ON lms_notifications
  FOR ALL USING (user_id = auth.uid());

-- Сообщения
DROP POLICY IF EXISTS "conversation_members_messages" ON lms_messages;
CREATE POLICY "conversation_members_messages" ON lms_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM lms_conversation_members
      WHERE conversation_id = lms_messages.conversation_id AND user_id = auth.uid()
    )
  );

DROP POLICY IF EXISTS "send_message" ON lms_messages;
CREATE POLICY "send_message" ON lms_messages
  FOR INSERT WITH CHECK (
    sender_id = auth.uid() AND
    EXISTS (SELECT 1 FROM lms_conversation_members WHERE conversation_id = lms_messages.conversation_id AND user_id = auth.uid())
  );

-- Сертификаты
DROP POLICY IF EXISTS "own_certificates" ON lms_certificates;
CREATE POLICY "own_certificates" ON lms_certificates
  FOR SELECT USING (
    student_id = auth.uid()
    OR lms_get_role(auth.uid()) IN ('teacher', 'admin')
  );

DROP POLICY IF EXISTS "admin_manage_certificates" ON lms_certificates;
CREATE POLICY "admin_manage_certificates" ON lms_certificates
  FOR ALL USING (lms_get_role(auth.uid()) = 'admin');

-- Объявления
DROP POLICY IF EXISTS "read_announcements" ON lms_announcements;
CREATE POLICY "read_announcements" ON lms_announcements
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "teacher_manage_announcements" ON lms_announcements;
CREATE POLICY "teacher_manage_announcements" ON lms_announcements
  FOR ALL USING (author_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

-- Логи активности
DROP POLICY IF EXISTS "own_activity_log" ON lms_activity_log;
CREATE POLICY "own_activity_log" ON lms_activity_log
  FOR SELECT USING (user_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

DROP POLICY IF EXISTS "insert_activity_log" ON lms_activity_log;
CREATE POLICY "insert_activity_log" ON lms_activity_log
  FOR INSERT WITH CHECK (user_id = auth.uid());
-- =============================================
-- ДОПОЛНЕНИЯ (curator notes, suspicious activity)
-- =============================================

CREATE TABLE IF NOT EXISTS lms_curator_notes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  curator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  student_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  note text NOT NULL,
  is_problem_flagged boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lms_curator_notes_curator ON lms_curator_notes(curator_id);
CREATE INDEX IF NOT EXISTS idx_lms_curator_notes_student ON lms_curator_notes(student_id);
ALTER TABLE lms_curator_notes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "curator_own_notes" ON lms_curator_notes;
CREATE POLICY "curator_own_notes" ON lms_curator_notes
  FOR ALL USING (curator_id = auth.uid() OR lms_get_role(auth.uid()) = 'admin');

CREATE TABLE IF NOT EXISTS lms_suspicious_activity (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES profiles(id),
  action text NOT NULL,
  metadata jsonb,
  url text,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_lms_suspicious_user ON lms_suspicious_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_lms_suspicious_created ON lms_suspicious_activity(created_at);
ALTER TABLE lms_suspicious_activity ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "admins_read_suspicious" ON lms_suspicious_activity;
CREATE POLICY "admins_read_suspicious" ON lms_suspicious_activity
  FOR SELECT USING (lms_get_role(auth.uid()) = 'admin');
