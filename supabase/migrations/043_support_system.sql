-- 043_support_system.sql

-- Support role: just ensure the column exists, no constraint change needed.
-- The english_user_roles table is the source of truth for English platform roles.
-- We only need profiles.role to store English-specific roles when set via approval flow.
-- Skip constraint modification to avoid conflicts with main KHAMADI platform roles.

-- Drop tables created by previous failed runs (safe — no production data yet)
DROP TABLE IF EXISTS english_support_messages  CASCADE;
DROP TABLE IF EXISTS english_support_tickets   CASCADE;
DROP TABLE IF EXISTS english_support_templates CASCADE;
DROP TABLE IF EXISTS english_support_faq       CASCADE;
DROP TABLE IF EXISTS english_platform_status   CASCADE;

-- TICKETS
CREATE TABLE english_support_tickets (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_number  serial UNIQUE,
  user_id        uuid REFERENCES profiles(id) ON DELETE CASCADE,
  assigned_to    uuid REFERENCES profiles(id),
  category       text CHECK (category IN ('technical','course','account','certificate','other')),
  priority       text DEFAULT 'normal' CHECK (priority IN ('urgent','normal','low')),
  subject        text NOT NULL,
  status         text DEFAULT 'open' CHECK (status IN ('open','in_progress','resolved','closed')),
  rating         integer CHECK (rating BETWEEN 1 AND 5),
  rating_comment text,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now(),
  resolved_at    timestamptz
);

-- MESSAGES
CREATE TABLE english_support_messages (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id      uuid REFERENCES english_support_tickets(id) ON DELETE CASCADE,
  sender_id      uuid REFERENCES profiles(id),
  body           text NOT NULL,
  attachment_url text,
  is_internal    boolean DEFAULT false,
  created_at     timestamptz DEFAULT now()
);

-- FAQ
CREATE TABLE english_support_faq (
  id           uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category     text NOT NULL,
  question     text NOT NULL,
  answer       text NOT NULL,
  order_index  integer DEFAULT 0,
  is_published boolean DEFAULT true,
  created_at   timestamptz DEFAULT now()
);

-- RESPONSE TEMPLATES
CREATE TABLE english_support_templates (
  id         uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title      text NOT NULL,
  body       text NOT NULL,
  category   text,
  created_by uuid REFERENCES profiles(id),
  created_at timestamptz DEFAULT now()
);

-- PLATFORM STATUS
CREATE TABLE english_platform_status (
  id          uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title       text NOT NULL,
  description text,
  status      text DEFAULT 'investigating'
    CHECK (status IN ('investigating','identified','monitoring','resolved')),
  severity    text DEFAULT 'minor'
    CHECK (severity IN ('minor','major','critical')),
  created_at  timestamptz DEFAULT now(),
  resolved_at timestamptz
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_tickets_user     ON english_support_tickets(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_status   ON english_support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_assigned ON english_support_tickets(assigned_to);
CREATE INDEX IF NOT EXISTS idx_messages_ticket  ON english_support_messages(ticket_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION update_ticket_timestamp()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
  UPDATE english_support_tickets SET updated_at = now() WHERE id = NEW.ticket_id;
  RETURN NEW;
END;
$$;
DROP TRIGGER IF EXISTS trg_update_ticket ON english_support_messages;
CREATE TRIGGER trg_update_ticket
AFTER INSERT ON english_support_messages
FOR EACH ROW EXECUTE FUNCTION update_ticket_timestamp();

-- RLS
ALTER TABLE english_support_tickets  ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_support_faq      ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_support_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_platform_status  ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION is_support_staff(uid uuid)
RETURNS boolean LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT EXISTS (
    SELECT 1 FROM english_user_roles WHERE user_id = uid AND role IN ('admin','support')
  );
$$;

DROP POLICY IF EXISTS "student_own_tickets"    ON english_support_tickets;
CREATE POLICY "student_own_tickets" ON english_support_tickets
  FOR ALL USING (user_id = auth.uid() OR is_support_staff(auth.uid()));

DROP POLICY IF EXISTS "ticket_messages_read" ON english_support_messages;
CREATE POLICY "ticket_messages_read" ON english_support_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM english_support_tickets t
      WHERE t.id = ticket_id
        AND (t.user_id = auth.uid() OR is_support_staff(auth.uid()))
    )
    AND (is_internal = false OR is_support_staff(auth.uid()))
  );

DROP POLICY IF EXISTS "send_message" ON english_support_messages;
CREATE POLICY "send_message" ON english_support_messages
  FOR INSERT WITH CHECK (sender_id = auth.uid());

DROP POLICY IF EXISTS "read_faq"    ON english_support_faq;
DROP POLICY IF EXISTS "manage_faq"  ON english_support_faq;
CREATE POLICY "read_faq"   ON english_support_faq FOR SELECT USING (is_published = true);
CREATE POLICY "manage_faq" ON english_support_faq FOR ALL USING (is_support_staff(auth.uid()));

DROP POLICY IF EXISTS "support_templates" ON english_support_templates;
CREATE POLICY "support_templates" ON english_support_templates
  FOR ALL USING (is_support_staff(auth.uid()));

DROP POLICY IF EXISTS "read_status"   ON english_platform_status;
DROP POLICY IF EXISTS "manage_status" ON english_platform_status;
CREATE POLICY "read_status"   ON english_platform_status FOR SELECT USING (true);
CREATE POLICY "manage_status" ON english_platform_status FOR ALL USING (is_support_staff(auth.uid()));

-- SEED FAQ
INSERT INTO english_support_faq (category, question, answer, order_index) VALUES
('technical','Урок не загружается. Что делать?','Попробуйте обновить страницу (F5), очистить кеш браузера или использовать другой браузер. Если проблема сохраняется — создайте тикет.',1),
('technical','Видео не воспроизводится','Проверьте интернет-соединение. Поддерживаются браузеры Chrome, Firefox, Safari последних версий.',2),
('account','Как изменить пароль?','Перейдите в Профиль → Безопасность → Изменить пароль.',3),
('account','Как изменить email?','Смена email производится через администратора. Создайте тикет с категорией «Аккаунт».',4),
('certificate','Когда выдаётся сертификат?','Сертификат выдаётся при прохождении курса на 80%+ со средним баллом от 70%.',5),
('certificate','Как скачать сертификат?','Раздел «Сертификаты» в боковом меню → кнопка «Скачать PDF».',6),
('course','Могу ли я вернуться к пройденному уроку?','Да, все уроки доступны повторно в любое время.',7),
('course','Как узнать свой уровень?','Пройдите Placement Test в разделе «Placement Test» в боковом меню.',8)
ON CONFLICT DO NOTHING;

-- SEED TEMPLATES
INSERT INTO english_support_templates (title, body, category) VALUES
('Приветствие','Здравствуйте! Спасибо за обращение в поддержку KHAMADI ENGLISH. Мы рассмотрим вашу заявку в ближайшее время.',null),
('Запрос информации','Для решения вашего вопроса нам нужна дополнительная информация. Уточните пожалуйста: какой браузер используете? Когда возникла проблема?','technical'),
('Проблема решена','Ваша проблема была успешно решена. Если возникнут ещё вопросы — обращайтесь. Хорошего дня!',null),
('Передача специалисту','Ваш запрос передан профильному специалисту. Ответ поступит в течение 24 часов.',null),
('Требуется скриншот','Пожалуйста, прикрепите скриншот ошибки — это поможет нам решить проблему быстрее.','technical')
ON CONFLICT DO NOTHING;
