-- ═══════════════════════════════════════════════
-- KHAMADI ENGLISH — Supabase Tables + Demo Data
-- Run this in Supabase SQL Editor
-- ═══════════════════════════════════════════════

-- 1. TABLES

CREATE TABLE IF NOT EXISTS english_courses (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  level text NOT NULL,
  category text NOT NULL,
  description text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS english_lessons (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id uuid REFERENCES english_courses(id) ON DELETE CASCADE,
  title text NOT NULL,
  lesson_order integer NOT NULL,
  reading_text text,
  writing_task text,
  listening_url text,
  listening_transcript text,
  vocabulary jsonb,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS english_progress (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid REFERENCES english_lessons(id) ON DELETE CASCADE,
  completed boolean DEFAULT false,
  score integer,
  attempts integer DEFAULT 0,
  completed_at timestamptz,
  UNIQUE(user_id, lesson_id)
);

CREATE TABLE IF NOT EXISTS english_certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id uuid REFERENCES english_courses(id),
  certificate_number text UNIQUE,
  issued_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS english_quiz_questions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lesson_id uuid REFERENCES english_lessons(id) ON DELETE CASCADE,
  question text NOT NULL,
  option_a text,
  option_b text,
  option_c text,
  option_d text,
  correct_answer text NOT NULL,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS english_user_roles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  role text DEFAULT 'student',
  full_name text,
  created_at timestamptz DEFAULT now()
);

-- 2. RLS

ALTER TABLE english_courses        ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_lessons        ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_progress       ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_certificates   ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE english_user_roles     ENABLE ROW LEVEL SECURITY;

-- Public read for courses and lessons
CREATE POLICY "Public read courses" ON english_courses FOR SELECT USING (true);
CREATE POLICY "Public read lessons" ON english_lessons FOR SELECT USING (true);
CREATE POLICY "Public read quiz_questions" ON english_quiz_questions FOR SELECT USING (true);

-- Users manage own progress
CREATE POLICY "Users own progress" ON english_progress FOR ALL USING (auth.uid() = user_id);

-- Users read own certs
CREATE POLICY "Users read own certs" ON english_certificates FOR SELECT USING (auth.uid() = user_id);

-- Users manage own role
CREATE POLICY "Users own role" ON english_user_roles FOR ALL USING (auth.uid() = user_id);

-- 3. INDEXES
CREATE INDEX IF NOT EXISTS idx_english_lessons_course ON english_lessons(course_id);
CREATE INDEX IF NOT EXISTS idx_english_progress_user  ON english_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_english_quiz_lesson    ON english_quiz_questions(lesson_id);

-- ═══════════════════════════════════════════════
-- 4. DEMO DATA
-- ═══════════════════════════════════════════════

-- Courses
INSERT INTO english_courses (id, title, level, category, description) VALUES
  ('a1000000-0000-0000-0000-000000000001', 'A1 Beginner',           'A1', 'General English',                'Основы языка с нуля — алфавит, приветствия, числа, цвета'),
  ('a1000000-0000-0000-0000-000000000002', 'A2 Elementary',         'A2', 'General English',                'Базовое общение: семья, работа, покупки'),
  ('a1000000-0000-0000-0000-000000000003', 'B1 Intermediate',       'B1', 'General English',                'Уверенное владение: путешествия, планы, мнения'),
  ('a1000000-0000-0000-0000-000000000004', 'B2 Upper-Intermediate', 'B2', 'General English',                'Продвинутый уровень: дебаты, сложная грамматика'),
  ('a1000000-0000-0000-0000-000000000005', 'C1 Advanced',           'C1', 'General English',                'Профессиональный английский: академический стиль, переговоры'),
  ('a1000000-0000-0000-0000-000000000006', 'Accounting',            'B1-C1', 'English for Special Purposes', 'Бухгалтерия, отчётность, финансовые термины'),
  ('a1000000-0000-0000-0000-000000000007', 'Computer Science',      'B1-C1', 'English for Special Purposes', 'IT, программирование, технические тексты'),
  ('a1000000-0000-0000-0000-000000000008', 'Hospitality',           'A2-B1', 'English for Special Purposes', 'Туризм, гостеприимство, обслуживание клиентов'),
  ('a1000000-0000-0000-0000-000000000009', 'Management',            'B1-C1', 'English for Special Purposes', 'Менеджмент, лидерство, бизнес-коммуникация'),
  ('a1000000-0000-0000-0000-000000000010', 'Finance Industry',      'B1-C1', 'English for Special Purposes', 'Банки, инвестиции, финансовые рынки'),
  ('a1000000-0000-0000-0000-000000000011', 'Social Sciences',       'B1-C1', 'English for Special Purposes', 'Социология, психология, политология'),
  ('a1000000-0000-0000-0000-000000000012', 'Law',                   'B1-C1', 'English for Special Purposes', 'Юриспруденция, право, юридические документы')
ON CONFLICT (id) DO NOTHING;

-- ── Lessons for A1 Beginner ──

INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary)
VALUES (
  'b1000000-0000-0000-0000-000000000001',
  'a1000000-0000-0000-0000-000000000001',
  'Greetings and Introductions',
  1,
  E'Meeting New People\n\nMy name is Sarah. I am from London, England. I am 25 years old. I am a teacher. I like reading books and listening to music.\n\nThis is my friend, David. He is from New York, USA. He is 28 years old. He is a doctor. He likes playing football and cooking.\n\nSarah and David met at an English class. Their teacher is Mrs. Johnson. She is very kind and helpful. The class has ten students from different countries.\n\nEvery morning, they say "Good morning!" to each other. In the afternoon, they say "Good afternoon!" When they go home, they say "Goodbye!" or "See you tomorrow!"\n\nLearning English is fun. Sarah and David practice every day. They are good friends now.',
  'Write 5 sentences about yourself in English. Use these questions as a guide: What is your name? Where are you from? How old are you? What do you do? What do you like?',
  E'A: Hello! My name is Anna. What is your name?\nB: Hi, Anna! My name is Tom. Nice to meet you!\nA: Nice to meet you too, Tom. Where are you from?\nB: I am from Kazakhstan. And you?\nA: I am from Russia. How are you today?\nB: I am fine, thank you. And you?\nA: I am great, thanks! Do you speak English?\nB: Yes, a little. I am learning now.\nA: Me too! Let''s practice together.\nB: Great idea! See you in class!',
  '[
    {"en": "Hello", "ru": "Привет"},
    {"en": "Goodbye", "ru": "До свидания"},
    {"en": "My name is...", "ru": "Меня зовут..."},
    {"en": "Nice to meet you", "ru": "Приятно познакомиться"},
    {"en": "How are you?", "ru": "Как дела?"},
    {"en": "I am from...", "ru": "Я из..."},
    {"en": "I work as...", "ru": "Я работаю..."},
    {"en": "I like", "ru": "Мне нравится"},
    {"en": "Thank you", "ru": "Спасибо"},
    {"en": "Please", "ru": "Пожалуйста"}
  ]'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary)
VALUES (
  'b1000000-0000-0000-0000-000000000002',
  'a1000000-0000-0000-0000-000000000001',
  'Numbers and Colors',
  2,
  E'Numbers and Colors Around Us\n\nNumbers and colors are everywhere in our life. Look around you right now!\n\nIn the classroom, there are twenty students. There are fifteen desks and one whiteboard. The whiteboard is white. The desks are brown. The chairs are blue.\n\nOutside the window, I can see three red cars, two yellow buses, and one green bicycle. The sky is blue today. There are five white clouds.\n\nIn the market, apples are red or green. Bananas are yellow. Oranges are orange. Grapes can be purple or green.\n\nNumbers in English:\nOne, two, three, four, five, six, seven, eight, nine, ten.\nEleven, twelve, thirteen, fourteen, fifteen.\nTwenty, thirty, forty, fifty, one hundred.\n\nColors in English:\nRed, blue, green, yellow, orange, purple, pink, white, black, brown, grey.',
  'Look around your room and write 5 sentences. Example: "My chair is black. I have two windows. My bag is blue." Use numbers and colors.',
  E'A: How many students are in your class?\nB: There are twenty-five students. How about yours?\nA: We have thirty. What is your favourite colour?\nB: I like blue. The sky is blue! And you?\nA: I love red. My bag is red. Look!\nB: Oh, nice! How old are you?\nA: I am seventeen. And you?\nB: I am eighteen. My birthday is on the fifth of March.\nA: Happy birthday! Is that soon?\nB: Yes, in two weeks!',
  '[
    {"en": "One", "ru": "Один"},
    {"en": "Two", "ru": "Два"},
    {"en": "Three", "ru": "Три"},
    {"en": "Ten", "ru": "Десять"},
    {"en": "Twenty", "ru": "Двадцать"},
    {"en": "Red", "ru": "Красный"},
    {"en": "Blue", "ru": "Синий"},
    {"en": "Green", "ru": "Зелёный"},
    {"en": "Yellow", "ru": "Жёлтый"},
    {"en": "White", "ru": "Белый"}
  ]'
) ON CONFLICT (id) DO NOTHING;

-- ── Lesson for Law B1 ──

INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary)
VALUES (
  'b1000000-0000-0000-0000-000000000010',
  'a1000000-0000-0000-0000-000000000012',
  'Introduction to the Legal System',
  1,
  E'The Legal System: An Overview\n\nA legal system is a set of rules and institutions that a society uses to regulate behaviour and resolve disputes. Every country has its own legal system, though many share common principles.\n\nThere are two main legal traditions in the world. The first is the Common Law system, which originated in England. In this system, judges play a crucial role — their decisions create precedents that future courts must follow. Countries like the United States, Canada, and Australia use Common Law.\n\nThe second tradition is Civil Law, which is based on written codes. Judges in Civil Law countries apply the code to specific cases. Most countries in Europe, Latin America, and Central Asia follow Civil Law traditions.\n\nKazakhstan uses a Civil Law system, influenced by both Soviet law and continental European tradition.\n\nThe main sources of law include: constitutions, statutes (laws passed by parliament), regulations, and in Common Law countries, judicial decisions (case law).\n\nThe legal system has several branches: criminal law deals with offences against society; civil law handles disputes between individuals; administrative law governs the actions of government bodies; constitutional law defines the structure and powers of government.',
  'In your own words, explain the difference between Common Law and Civil Law systems. Write 3-4 sentences. Which system does Kazakhstan use?',
  E'Lawyer: Good morning. I''m Alexander Brown, your attorney.\nClient: Good morning. Thank you for seeing me.\nLawyer: Of course. Please tell me about your situation.\nClient: I signed a contract last month, but the other party has not fulfilled their obligations.\nLawyer: I see. Do you have the contract with you?\nClient: Yes, here it is. Is this a breach of contract?\nLawyer: It appears so. Under civil law, you have the right to seek compensation.\nClient: What is the next step?\nLawyer: First, we send a formal notice. If they don''t respond in 30 days, we file a claim in court.\nClient: How long will the process take?\nLawyer: Typically 3 to 6 months for a straightforward case.',
  '[
    {"en": "Law", "ru": "Закон / право"},
    {"en": "Court", "ru": "Суд"},
    {"en": "Judge", "ru": "Судья"},
    {"en": "Contract", "ru": "Договор / контракт"},
    {"en": "Rights", "ru": "Права"},
    {"en": "Defendant", "ru": "Ответчик / обвиняемый"},
    {"en": "Plaintiff", "ru": "Истец"},
    {"en": "Evidence", "ru": "Доказательства"},
    {"en": "Verdict", "ru": "Приговор / решение суда"},
    {"en": "Attorney / Lawyer", "ru": "Адвокат / юрист"}
  ]'
) ON CONFLICT (id) DO NOTHING;

-- ── Quiz Questions for Lesson 1 (A1 Greetings) ──

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b1000000-0000-0000-0000-000000000001', 'How do you greet someone in the morning?', 'Good night', 'Good morning', 'Goodbye', 'See you', 'B'),
('b1000000-0000-0000-0000-000000000001', 'What does "Nice to meet you" mean in Russian?', 'До свидания', 'Спасибо', 'Приятно познакомиться', 'Пожалуйста', 'C'),
('b1000000-0000-0000-0000-000000000001', 'Sarah is from _____.', 'New York', 'London', 'Moscow', 'Paris', 'B'),
('b1000000-0000-0000-0000-000000000001', 'How old is David?', '25', '28', '30', '22', 'B'),
('b1000000-0000-0000-0000-000000000001', 'What is David''s job?', 'Teacher', 'Engineer', 'Doctor', 'Student', 'C'),
('b1000000-0000-0000-0000-000000000001', 'What does "Goodbye" mean?', 'Привет', 'Спасибо', 'Пожалуйста', 'До свидания', 'D'),
('b1000000-0000-0000-0000-000000000001', 'How do you ask "How are you?" in English?', 'Where are you from?', 'How are you?', 'What is your name?', 'How old are you?', 'B'),
('b1000000-0000-0000-0000-000000000001', 'The teacher''s name is _____.', 'Mrs. Johnson', 'Mrs. Smith', 'Mr. Brown', 'Ms. Davis', 'A'),
('b1000000-0000-0000-0000-000000000001', 'How many students are in the class?', 'Five', 'Eight', 'Ten', 'Fifteen', 'C'),
('b1000000-0000-0000-0000-000000000001', 'What does "Please" mean?', 'Спасибо', 'Пожалуйста', 'Привет', 'Прости', 'B')
ON CONFLICT DO NOTHING;

-- ── Quiz Questions for Lesson 2 (A1 Numbers & Colors) ──

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b1000000-0000-0000-0000-000000000002', 'What color is the sky on a clear day?', 'Green', 'Red', 'Blue', 'Yellow', 'C'),
('b1000000-0000-0000-0000-000000000002', 'What color are bananas?', 'Orange', 'Yellow', 'Red', 'Green', 'B'),
('b1000000-0000-0000-0000-000000000002', 'How do you say "двадцать" in English?', 'Twelve', 'Fifteen', 'Twenty', 'Two', 'C'),
('b1000000-0000-0000-0000-000000000002', 'How many students are in the classroom in the text?', 'Ten', 'Fifteen', 'Twenty', 'Thirty', 'C'),
('b1000000-0000-0000-0000-000000000002', 'What color is the whiteboard?', 'Black', 'White', 'Blue', 'Brown', 'B'),
('b1000000-0000-0000-0000-000000000002', 'What color are the chairs?', 'Red', 'Green', 'Blue', 'Brown', 'C'),
('b1000000-0000-0000-0000-000000000002', 'How do you say "красный" in English?', 'Blue', 'Green', 'Red', 'Yellow', 'C'),
('b1000000-0000-0000-0000-000000000002', 'What comes after "nine"?', 'Eight', 'Eleven', 'Ten', 'Seven', 'C'),
('b1000000-0000-0000-0000-000000000002', 'How many yellow buses did the person see?', 'One', 'Two', 'Three', 'Four', 'B'),
('b1000000-0000-0000-0000-000000000002', 'What color can grapes be?', 'Only red', 'Only green', 'Purple or green', 'Orange', 'C')
ON CONFLICT DO NOTHING;

-- ── Quiz Questions for Law Lesson 1 ──

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b1000000-0000-0000-0000-000000000010', 'What is a legal system?', 'A type of computer program', 'Rules and institutions to regulate behaviour and resolve disputes', 'A government department', 'A type of contract', 'B'),
('b1000000-0000-0000-0000-000000000010', 'Which countries use the Common Law system?', 'France and Germany', 'USA and Australia', 'Kazakhstan and Russia', 'China and Japan', 'B'),
('b1000000-0000-0000-0000-000000000010', 'What does "precedent" mean in law?', 'A new law passed by parliament', 'A previous court decision that guides future cases', 'A type of contract', 'A government regulation', 'B'),
('b1000000-0000-0000-0000-000000000010', 'What legal system does Kazakhstan use?', 'Common Law', 'Sharia Law', 'Civil Law', 'Military Law', 'C'),
('b1000000-0000-0000-0000-000000000010', 'What does "attorney" mean?', 'Судья', 'Истец', 'Адвокат', 'Свидетель', 'C'),
('b1000000-0000-0000-0000-000000000010', 'Civil Law is based on _____.', 'Judge decisions only', 'Oral traditions', 'Written codes', 'Religious texts', 'C'),
('b1000000-0000-0000-0000-000000000010', 'Criminal law deals with _____.', 'Disputes between individuals', 'Offences against society', 'Government regulations', 'International trade', 'B'),
('b1000000-0000-0000-0000-000000000010', 'What is a "contract"?', 'Закон', 'Договор', 'Суд', 'Приговор', 'B'),
('b1000000-0000-0000-0000-000000000010', 'In the dialogue, how long will the case take?', '1 month', '1 year', '3 to 6 months', '2 weeks', 'C'),
('b1000000-0000-0000-0000-000000000010', 'What is the first step after a breach of contract?', 'Go directly to court', 'Send a formal notice', 'Call the police', 'Sign a new contract', 'B')
ON CONFLICT DO NOTHING;

-- ═══════════════════════════════════════════════
-- 5. SCHEMA ADDITIONS
-- ═══════════════════════════════════════════════

ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS purpose text;
ALTER TABLE english_user_roles ADD COLUMN IF NOT EXISTS current_level text DEFAULT 'A1';

CREATE POLICY IF NOT EXISTS "Users insert own certs" ON english_certificates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.is_english_teacher()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM english_user_roles WHERE user_id = auth.uid() AND role = 'teacher'
  );
$$;

DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='english_user_roles' AND policyname='Teachers read all roles') THEN
    CREATE POLICY "Teachers read all roles" ON english_user_roles FOR SELECT USING (auth.uid() = user_id OR public.is_english_teacher());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='english_progress' AND policyname='Teachers read all progress') THEN
    CREATE POLICY "Teachers read all progress" ON english_progress FOR SELECT USING (auth.uid() = user_id OR public.is_english_teacher());
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename='english_certificates' AND policyname='Teachers read all certs') THEN
    CREATE POLICY "Teachers read all certs" ON english_certificates FOR SELECT USING (auth.uid() = user_id OR public.is_english_teacher());
  END IF;
END $$;

-- ═══════════════════════════════════════════════
-- 6. A1 LESSON 3
-- ═══════════════════════════════════════════════

INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary)
VALUES (
  'b1000000-0000-0000-0000-000000000003',
  'a1000000-0000-0000-0000-000000000001',
  'Family and Friends',
  3,
  E'My Family\n\nI have a small family. There are four people in my family: my father, my mother, my sister, and me.\n\nMy father''s name is Michael. He is 48 years old. He is a doctor. He is tall and kind.\n\nMy mother''s name is Elena. She is 45 years old. She is a teacher. She likes cooking.\n\nMy sister''s name is Lisa. She is 16 years old. She is a student. She likes music and dancing.\n\nI also have two friends: Mark and Julia. Mark is my best friend. He is funny and helpful. Julia is my classmate. She is very intelligent.\n\nWe often meet on weekends. We go to the park or watch films together.',
  'Write about your family. How many people are in your family? What are their names? How old are they? What do they do? Write 5–6 sentences.',
  E'A: Tell me about your family.\nB: I have a big family. I have two brothers and one sister.\nA: How old are your brothers?\nB: My older brother is 22 and my younger brother is 14.\nA: And your sister?\nB: She is 19. She is a university student.\nA: Do you have a best friend?\nB: Yes! His name is Alex. We have been friends since school.\nA: What do you do together?\nB: We play football and watch films.',
  '[
    {"en": "Family", "ru": "Семья"},
    {"en": "Father / Dad", "ru": "Отец / Папа"},
    {"en": "Mother / Mum", "ru": "Мать / Мама"},
    {"en": "Brother", "ru": "Брат"},
    {"en": "Sister", "ru": "Сестра"},
    {"en": "Friend", "ru": "Друг / Подруга"},
    {"en": "Classmate", "ru": "Одноклассник"},
    {"en": "Tall", "ru": "Высокий"},
    {"en": "Kind", "ru": "Добрый"},
    {"en": "Together", "ru": "Вместе"}
  ]'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b1000000-0000-0000-0000-000000000003', 'How many people are in the narrator''s family?', 'Three', 'Four', 'Five', 'Six', 'B'),
('b1000000-0000-0000-0000-000000000003', 'What is the father''s job?', 'Teacher', 'Engineer', 'Doctor', 'Lawyer', 'C'),
('b1000000-0000-0000-0000-000000000003', 'How old is the mother?', '40', '43', '45', '48', 'C'),
('b1000000-0000-0000-0000-000000000003', 'What does the mother like?', 'Reading', 'Cooking', 'Dancing', 'Music', 'B'),
('b1000000-0000-0000-0000-000000000003', 'How old is sister Lisa?', '14', '15', '16', '17', 'C'),
('b1000000-0000-0000-0000-000000000003', 'What does "Brother" mean in Russian?', 'Сестра', 'Друг', 'Брат', 'Отец', 'C'),
('b1000000-0000-0000-0000-000000000003', 'Who is Mark?', 'The narrator''s brother', 'The narrator''s best friend', 'The narrator''s teacher', 'The narrator''s classmate', 'B'),
('b1000000-0000-0000-0000-000000000003', 'What does "Kind" mean?', 'Умный', 'Высокий', 'Добрый', 'Смешной', 'C'),
('b1000000-0000-0000-0000-000000000003', 'In the dialogue, how many brothers does person B have?', 'One', 'Two', 'Three', 'None', 'B'),
('b1000000-0000-0000-0000-000000000003', 'What do Alex and his friend do together?', 'Cook and read', 'Play football and watch films', 'Dance and sing', 'Study and travel', 'B')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 7. A2 LESSONS (3)
-- ===================================================

INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('b2000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000002','Daily Routines',1,
'My Daily Routine

I wake up at 7 o''clock every morning. First I wash my face and brush my teeth. Then I have breakfast.

I go to work at 8:30 by bus. At work I check emails and attend meetings. Lunch is at 1 pm.

In the evening I cook dinner, watch TV, or read. I go to bed at 11 pm.

On weekends I meet friends or visit my parents.',
'Write about your daily routine. What time do you wake up? What do you do in the morning, afternoon, and evening?',
'A: What time do you wake up?
B: At 6:30. I catch the early bus.
A: Do you have breakfast?
B: Yes, tea and bread. You?
A: Coffee then straight to work. How far is your office?
B: 10 minutes on foot. I am lucky.',
'[{"en":"Wake up","ru":"Просыпаться"},{"en":"Breakfast","ru":"Завтрак"},{"en":"Lunch","ru":"Обед"},{"en":"Dinner","ru":"Ужин"},{"en":"Work","ru":"Работа"},{"en":"Bus","ru":"Автобус"},{"en":"Usually","ru":"Обычно"},{"en":"Always","ru":"Всегда"},{"en":"Evening","ru":"Вечер"},{"en":"Weekend","ru":"Выходные"}]'
),
('b2000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000002','Shopping and Prices',2,
'At the Market

Shopping is part of everyday life. People buy food, clothes, and other things.

At the supermarket you find vegetables, fruits, bread, and milk. Prices are on labels. You pay at the checkout.

Clothes shopping is popular. Try clothes on before buying.

Online shopping is convenient — order from home and get delivery in 1–3 days.',
'You are at a shop. Write a short dialogue: you want to buy a T-shirt. Ask about price, size, and colour.',
'A: How much is this jacket?
B: 12,000 tenge.
A: Anything cheaper?
B: This one is 8,500. It is on sale.
A: Can I try it on?
B: The fitting room is over there.
A: It fits. I will take it. Card?
B: Yes.',
'[{"en":"Price","ru":"Цена"},{"en":"Cheap","ru":"Дешёвый"},{"en":"Expensive","ru":"Дорогой"},{"en":"Sale","ru":"Скидка"},{"en":"Pay","ru":"Платить"},{"en":"Receipt","ru":"Чек"},{"en":"Size","ru":"Размер"},{"en":"Colour","ru":"Цвет"},{"en":"Trolley","ru":"Тележка"},{"en":"Checkout","ru":"Касса"}]'
),
('b2000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000002','Food and Restaurants',3,
'Eating Out

Going to a restaurant is a special experience. A waiter gives you a menu.

The menu has starters, main courses, and desserts. At the end you ask for the bill. A tip of 10% is polite.

Fast food is quick but not always healthy. Home cooking is usually healthier.',
'Write about your favourite food. Do you prefer cooking at home or eating out? Why?',
'Waiter: Good evening! Table for two?
Customer: Yes please.
Waiter: Here is the menu. The grilled salmon is popular.
Customer: I will have that and a salad.
Waiter: Anything to drink?
Customer: Just water please.',
'[{"en":"Menu","ru":"Меню"},{"en":"Starter","ru":"Закуска"},{"en":"Main course","ru":"Основное блюдо"},{"en":"Dessert","ru":"Десерт"},{"en":"Waiter","ru":"Официант"},{"en":"Bill","ru":"Счёт"},{"en":"Tip","ru":"Чаевые"},{"en":"Reservation","ru":"Бронирование"},{"en":"Recommend","ru":"Рекомендовать"},{"en":"Delicious","ru":"Вкусный"}]'
)
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b2000000-0000-0000-0000-000000000001','What time does the narrator go to work?','8:00','8:30','9:00','7:30','B'),
('b2000000-0000-0000-0000-000000000001','How does the narrator get to work?','By car','On foot','By bus','By metro','C'),
('b2000000-0000-0000-0000-000000000001','What does Weekend mean?','Будний день','Вечер','Выходные','Утро','C'),
('b2000000-0000-0000-0000-000000000001','What time does the narrator go to bed?','10 pm','11 pm','Midnight','9 pm','B'),
('b2000000-0000-0000-0000-000000000001','What does Always mean?','Иногда','Никогда','Всегда','Редко','C'),
('b2000000-0000-0000-0000-000000000001','What does person B have for breakfast?','Eggs','Tea and bread','Coffee','Nothing','B'),
('b2000000-0000-0000-0000-000000000001','How does person B get to work?','By bus','By car','On foot','By metro','C'),
('b2000000-0000-0000-0000-000000000001','What does Evening mean?','Утро','День','Вечер','Ночь','C'),
('b2000000-0000-0000-0000-000000000001','What does Dinner mean?','Завтрак','Обед','Ужин','Перекус','C'),
('b2000000-0000-0000-0000-000000000001','What does Usually mean?','Никогда','Всегда','Обычно','Иногда','C'),
('b2000000-0000-0000-0000-000000000002','What does Expensive mean?','Дешёвый','Дорогой','Маленький','Большой','B'),
('b2000000-0000-0000-0000-000000000002','What does Sale mean?','Новый товар','Скидка','Полная цена','Возврат','B'),
('b2000000-0000-0000-0000-000000000002','Where do you pay in a supermarket?','At the entrance','At the checkout','At the info desk','Online','B'),
('b2000000-0000-0000-0000-000000000002','How much is the jacket on sale?','12000','10000','8500','6000','C'),
('b2000000-0000-0000-0000-000000000002','What does Trolley mean?','Тележка','Чек','Касса','Скидка','A'),
('b2000000-0000-0000-0000-000000000002','What is convenient about online shopping?','Cheaper prices','Try things on','Order from home','Better quality','C'),
('b2000000-0000-0000-0000-000000000002','What does Receipt mean?','Цена','Размер','Чек','Цвет','C'),
('b2000000-0000-0000-0000-000000000002','How does the customer pay in the dialogue?','By cash','By card','By cheque','By phone','B'),
('b2000000-0000-0000-0000-000000000002','What does Checkout mean?','Примерочная','Витрина','Касса','Склад','C'),
('b2000000-0000-0000-0000-000000000002','Disadvantage of online shopping?','It is slow','Cannot try before buying','It is expensive','No delivery','B'),
('b2000000-0000-0000-0000-000000000003','What does the waiter give you first?','The bill','A menu','Your food','A tip','B'),
('b2000000-0000-0000-0000-000000000003','What are starters?','Основное блюдо','Десерт','Закуска','Напиток','C'),
('b2000000-0000-0000-0000-000000000003','Typical tip percentage?','5%','10%','20%','25%','B'),
('b2000000-0000-0000-0000-000000000003','What does the waiter recommend?','Salad','Pasta','Grilled salmon','Soup','C'),
('b2000000-0000-0000-0000-000000000003','What does Reservation mean?','Бронирование','Рекомендация','Меню','Десерт','A'),
('b2000000-0000-0000-0000-000000000003','What does Delicious mean?','Дорогой','Быстрый','Вкусный','Свежий','C'),
('b2000000-0000-0000-0000-000000000003','What does the customer order to drink?','Juice','Wine','Coffee','Water','D'),
('b2000000-0000-0000-0000-000000000003','What does Bill mean?','Совет','Счёт','Чаевые','Заказ','B'),
('b2000000-0000-0000-0000-000000000003','What does Tip mean?','Чек','Счёт','Чаевые','Меню','C'),
('b2000000-0000-0000-0000-000000000003','Is fast food always healthy?','Yes','Usually','Not always','Never','C')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 8. B1 LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('b3000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000003','Travel and Tourism',1,'Travelling the World

Travelling lets you discover new cultures, try different foods, and meet people from around the world.

When planning a trip, book flights and accommodation in advance. Budget airlines offer cheap tickets but may charge extra for luggage.

Once you arrive, explore local attractions: museums, parks, and markets.

Always respect local customs when you travel.','Write about a trip you have taken or would like to take. Where? What did you do?','A: Have you been to Europe?
B: Yes, I visited France last summer.
A: What did you do?
B: Paris - the Eiffel Tower, the Louvre. Then a trip to Nice.
A: How was the food?
B: Incredible. Book early and learn some French phrases.','[{"en":"Travel","ru":"Путешествовать"},{"en":"Flight","ru":"Рейс"},{"en":"Accommodation","ru":"Проживание"},{"en":"Attraction","ru":"Достопримечательность"},{"en":"Luggage","ru":"Багаж"},{"en":"Currency","ru":"Валюта"},{"en":"Passport","ru":"Паспорт"},{"en":"Tour guide","ru":"Гид"},{"en":"Resort","ru":"Курорт"},{"en":"Culture","ru":"Культура"}]'),
('b3000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000003','Health and Lifestyle',2,'Staying Healthy

Good health involves regular exercise, a balanced diet, and sufficient sleep.

Doctors recommend 150 minutes of exercise per week. A balanced diet includes fruits, vegetables, and lean proteins. Drink 8 glasses of water daily.

Adults need 7-9 hours of sleep. Poor sleep leads to stress and health problems.','Write about your lifestyle. Do you exercise? What do you eat? How much do you sleep?','Doctor: What brings you in today?
Patient: I have been tired and getting headaches for two weeks.
Doctor: How much do you sleep?
Patient: About 5-6 hours.
Doctor: Adults need 7-9. Are you under stress?
Patient: Yes, a lot at work.
Doctor: Reduce screen time before bed and try relaxation exercises.','[{"en":"Exercise","ru":"Физкультура"},{"en":"Diet","ru":"Диета"},{"en":"Sleep","ru":"Сон"},{"en":"Healthy","ru":"Здоровый"},{"en":"Stress","ru":"Стресс"},{"en":"Weight","ru":"Вес"},{"en":"Heart","ru":"Сердце"},{"en":"Disease","ru":"Болезнь"},{"en":"Doctor","ru":"Врач"},{"en":"Symptom","ru":"Симптом"}]'),
('b3000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000003','Work and Career',3,'Career Choices

Choosing a career affects your income, lifestyle, and satisfaction.

Some people choose based on passion. Others focus on salary and job security. The best choice combines both.

Skills like critical thinking and digital literacy are valued by employers. Networking is essential - many opportunities come through personal connections.','Write about your career goals. What job do you want? What skills do you need?','Interviewer: Tell me about yourself.
Candidate: I have an Economics degree and three years in finance.
Interviewer: Why this position?
Candidate: I want new challenges and your company attracts me.
Interviewer: Your strengths?
Candidate: Analytical and detail-oriented.
Interviewer: Where in five years?
Candidate: In a senior management role.','[{"en":"Career","ru":"Карьера"},{"en":"Salary","ru":"Зарплата"},{"en":"Interview","ru":"Собеседование"},{"en":"Employer","ru":"Работодатель"},{"en":"Employee","ru":"Сотрудник"},{"en":"Skill","ru":"Навык"},{"en":"Experience","ru":"Опыт"},{"en":"Promotion","ru":"Повышение"},{"en":"Deadline","ru":"Дедлайн"},{"en":"Colleague","ru":"Коллега"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b3000000-0000-0000-0000-000000000001','What does Accommodation mean?','Транспорт','Проживание','Питание','Достопримечательность','B'),
('b3000000-0000-0000-0000-000000000001','What does Luggage mean?','Билет','Паспорт','Багаж','Валюта','C'),
('b3000000-0000-0000-0000-000000000001','What does Culture mean?','Погода','Культура','Язык','Валюта','B'),
('b3000000-0000-0000-0000-000000000001','What does Passport mean?','Виза','Паспорт','Билет','Разрешение','B'),
('b3000000-0000-0000-0000-000000000001','What does Resort mean?','Аэропорт','Гостиница','Курорт','Рынок','C'),
('b3000000-0000-0000-0000-000000000001','What can budget airlines charge extra for?','Meals','Luggage','Seats','Internet','B'),
('b3000000-0000-0000-0000-000000000001','What does Currency mean?','Паспорт','Валюта','Виза','Багаж','B'),
('b3000000-0000-0000-0000-000000000001','What does Tour guide mean?','Пилот','Турист','Гид','Менеджер','C'),
('b3000000-0000-0000-0000-000000000001','What does Flight mean?','Поезд','Рейс','Автобус','Паром','B'),
('b3000000-0000-0000-0000-000000000001','What does Attraction mean?','Отель','Транспорт','Достопримечательность','Ресторан','C'),
('b3000000-0000-0000-0000-000000000002','Recommended exercise minutes per week?','60','100','150','200','C'),
('b3000000-0000-0000-0000-000000000002','How many glasses of water daily?','4','6','8','10','C'),
('b3000000-0000-0000-0000-000000000002','Hours of sleep adults need?','5-6','6-7','7-9','9-10','C'),
('b3000000-0000-0000-0000-000000000002','Patient problem in dialogue?','Feeling cold','Tired and headaches','Back pain','Stomach issues','B'),
('b3000000-0000-0000-0000-000000000002','What does Stress mean?','Болезнь','Усталость','Стресс','Боль','C'),
('b3000000-0000-0000-0000-000000000002','What does Disease mean?','Лечение','Болезнь','Усталость','Симптом','B'),
('b3000000-0000-0000-0000-000000000002','Doctor recommendation in dialogue?','More coffee','Reduce screen time before bed','Take medicine','Eat more','B'),
('b3000000-0000-0000-0000-000000000002','What does Symptom mean?','Симптом','Врач','Диета','Вес','A'),
('b3000000-0000-0000-0000-000000000002','What does Weight mean?','Сердце','Вес','Рост','Возраст','B'),
('b3000000-0000-0000-0000-000000000002','What does Heart mean?','Лёгкие','Почки','Сердце','Мозг','C'),
('b3000000-0000-0000-0000-000000000003','What does Salary mean?','Должность','Зарплата','Навык','Опыт','B'),
('b3000000-0000-0000-0000-000000000003','What does Colleague mean?','Начальник','Клиент','Коллега','Партнёр','C'),
('b3000000-0000-0000-0000-000000000003','What does Interview mean?','Резюме','Собеседование','Контракт','Должность','B'),
('b3000000-0000-0000-0000-000000000003','What does Promotion mean?','Собеседование','Повышение','Срок','Навык','B'),
('b3000000-0000-0000-0000-000000000003','Candidate degree in?','Law','Marketing','Economics','Engineering','C'),
('b3000000-0000-0000-0000-000000000003','What does Deadline mean?','Дедлайн','Зарплата','Отпуск','Опыт','A'),
('b3000000-0000-0000-0000-000000000003','What does Employer mean?','Сотрудник','Работодатель','Коллега','Менеджер','B'),
('b3000000-0000-0000-0000-000000000003','What does Skill mean?','Карьера','Зарплата','Навык','Опыт','C'),
('b3000000-0000-0000-0000-000000000003','What does Experience mean?','Навык','Должность','Опыт','Стаж','C'),
('b3000000-0000-0000-0000-000000000003','What does Employee mean?','Работодатель','Сотрудник','Клиент','Партнёр','B')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 9. B2 LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('b4000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000004','Critical Thinking and Argumentation',1,'The Art of Argument

Critical thinking is the ability to analyse information objectively and make reasoned judgements.

A well-structured argument has three components: a clear claim, evidence, and a conclusion. Counterarguments should also be acknowledged.

Fallacies are errors in reasoning. Common examples include ad hominem attacks, straw man arguments, and false dichotomies.','Choose a topic and write a short argument (150 words) with a claim, evidence, and a counterargument.','Professor: Who can give an example of a logical fallacy?
Student A: The straw man - distorting the opponent''s argument to make it easier to attack.
Professor: Excellent. And the false dichotomy?
Student B: Saying you are either with us or against us - ignoring middle ground.
Professor: Perfect. Identify three fallacies in the article I gave you.','[{"en":"Argument","ru":"Аргумент"},{"en":"Evidence","ru":"Доказательство"},{"en":"Claim","ru":"Утверждение"},{"en":"Conclusion","ru":"Вывод"},{"en":"Fallacy","ru":"Ошибочное суждение"},{"en":"Counterargument","ru":"Контраргумент"},{"en":"Objective","ru":"Объективный"},{"en":"Analysis","ru":"Анализ"},{"en":"Debate","ru":"Дебаты"},{"en":"Reasoning","ru":"Рассуждение"}]'),
('b4000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000004','Global Issues and Society',2,'Challenges of the Modern World

The 21st century presents unprecedented challenges: climate change, inequality, digital transformation, and geopolitical tensions.

Climate change causes rising sea levels and extreme weather. The Paris Accord aims to limit global warming.

Economic inequality has widened in many countries. Globalisation has lifted millions from poverty but concentrated wealth among a small elite.','Choose one global issue. Write 150 words explaining the problem and proposing two solutions.','Journalist: Can we still stop climate change?
Professor: It depends on our collective action. We must reduce emissions by 45% by 2030.
Journalist: Is that achievable?
Professor: Technically yes. Politically it requires unprecedented cooperation.
Journalist: Are you optimistic?
Professor: Cautiously. Young people demand change and renewables are getting cheaper every year.','[{"en":"Climate change","ru":"Изменение климата"},{"en":"Inequality","ru":"Неравенство"},{"en":"Globalisation","ru":"Глобализация"},{"en":"Emissions","ru":"Выбросы"},{"en":"Renewable energy","ru":"Возобновляемая энергия"},{"en":"Policy","ru":"Политика мер"},{"en":"Poverty","ru":"Бедность"},{"en":"Cooperation","ru":"Сотрудничество"},{"en":"Technology","ru":"Технология"},{"en":"Sustainability","ru":"Устойчивое развитие"}]'),
('b4000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000004','Academic Writing Skills',3,'Writing at University Level

Academic writing is formal, structured, and evidence-based. It requires precision and logical organisation.

A typical essay has: introduction (thesis), body (arguments with evidence), and conclusion (summary and implications).

Paraphrasing is essential to avoid plagiarism. Hedging language like "it appears that" expresses uncertainty.

Proofreading and peer review improve quality.','Write an academic paragraph (100 words) on "Technology has changed education." Use hedging language and evidence.','Tutor: Your essay argument is good but structure needs work.
Student: What specifically?
Tutor: Your introduction does not state the thesis clearly.
Student: Should I add a thesis statement at the end?
Tutor: Exactly. One clear sentence. Also each body paragraph should have one main idea.
Student: What about my conclusion?
Tutor: It just repeats the introduction. A conclusion should reflect on implications.','[{"en":"Thesis","ru":"Тезис"},{"en":"Introduction","ru":"Введение"},{"en":"Conclusion","ru":"Заключение"},{"en":"Plagiarism","ru":"Плагиат"},{"en":"Citation","ru":"Цитирование"},{"en":"Paraphrase","ru":"Перефразирование"},{"en":"Argument","ru":"Аргумент"},{"en":"Evidence","ru":"Доказательство"},{"en":"Formal","ru":"Формальный"},{"en":"Peer review","ru":"Рецензирование"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b4000000-0000-0000-0000-000000000001','What is a fallacy?','Strong argument','Error in reasoning','Proven fact','Research method','B'),
('b4000000-0000-0000-0000-000000000001','What does Evidence mean?','Утверждение','Вывод','Доказательство','Мнение','C'),
('b4000000-0000-0000-0000-000000000001','What is a straw man argument?','Attacking the person','Distorting the opponent''s argument','Presenting false data','Too many examples','B'),
('b4000000-0000-0000-0000-000000000001','What is a Counterargument?','Supporting evidence','Opposing viewpoint','Main claim','Research question','B'),
('b4000000-0000-0000-0000-000000000001','Components of a well-structured argument?','Two','Three','Four','Five','B'),
('b4000000-0000-0000-0000-000000000001','What does Objective mean?','Предвзятый','Субъективный','Объективный','Ошибочный','C'),
('b4000000-0000-0000-0000-000000000001','What is a false dichotomy?','Only two options when more exist','Fake statistics','Attacking a person','Vague claim','A'),
('b4000000-0000-0000-0000-000000000001','What does Debate mean?','Анализ','Дебаты','Вывод','Аргумент','B'),
('b4000000-0000-0000-0000-000000000001','What does Reasoning mean?','Факт','Рассуждение','Ошибка','Обсуждение','B'),
('b4000000-0000-0000-0000-000000000001','What does Claim mean?','Доказательство','Вывод','Утверждение','Мнение','C'),
('b4000000-0000-0000-0000-000000000002','What causes climate change?','Natural cycles','Ocean currents','Greenhouse gas emissions','Deforestation only','C'),
('b4000000-0000-0000-0000-000000000002','Emissions reduction needed by 2030?','25%','35%','45%','55%','C'),
('b4000000-0000-0000-0000-000000000002','What does Poverty mean?','Богатство','Бедность','Неравенство','Кризис','B'),
('b4000000-0000-0000-0000-000000000002','What does Cooperation mean?','Соревнование','Сотрудничество','Конфликт','Торговля','B'),
('b4000000-0000-0000-0000-000000000002','What does Emissions mean?','Технология','Политика','Выбросы','Энергия','C'),
('b4000000-0000-0000-0000-000000000002','What does Sustainability mean?','Бедность','Глобализация','Устойчивое развитие','Сотрудничество','C'),
('b4000000-0000-0000-0000-000000000002','What does Renewable energy mean?','Ядерная','Возобновляемая','Нефть','Газ','B'),
('b4000000-0000-0000-0000-000000000002','What does Inequality mean?','Равенство','Неравенство','Справедливость','Бедность','B'),
('b4000000-0000-0000-0000-000000000002','What does Policy mean?','Закон','Налог','Политика мер','Договор','C'),
('b4000000-0000-0000-0000-000000000002','What does Technology mean?','Наука','Технология','Инновация','Прогресс','B'),
('b4000000-0000-0000-0000-000000000003','What does Plagiarism mean?','Цитирование','Плагиат','Введение','Анализ','B'),
('b4000000-0000-0000-0000-000000000003','What does an introduction do?','Summarises findings','Presents evidence','Presents topic and thesis','Gives counterarguments','C'),
('b4000000-0000-0000-0000-000000000003','What does Paraphrase mean?','Прямая цитата','Перефразирование','Плагиат','Ссылка','B'),
('b4000000-0000-0000-0000-000000000003','What does Peer review mean?','Самопроверка','Рецензирование','Компьютер','Оценка учителя','B'),
('b4000000-0000-0000-0000-000000000003','Problem with the student''s conclusion?','Too long','Just repeats introduction','Grammar errors','No evidence','B'),
('b4000000-0000-0000-0000-000000000003','What does Thesis mean?','Вывод','Параграф','Тезис','Введение','C'),
('b4000000-0000-0000-0000-000000000003','What does Formal mean?','Разговорный','Формальный','Неформальный','Технический','B'),
('b4000000-0000-0000-0000-000000000003','What does Citation mean?','Плагиат','Цитирование','Введение','Аргумент','B'),
('b4000000-0000-0000-0000-000000000003','What does Conclusion mean?','Введение','Аргумент','Заключение','Тезис','C'),
('b4000000-0000-0000-0000-000000000003','What does Argument mean?','Факт','Аргумент','Вывод','Пример','B')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 10. C1 LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('b5000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000005','Advanced Business Communication',1,'Communicating in Professional Contexts

Effective communication is the cornerstone of professional success. In business writing, conciseness is paramount.

Negotiations require linguistic competence and emotional intelligence. Active listening prevents miscommunication.

Presentation skills involve pacing, pausing for emphasis, and reading the room.

Cross-cultural communication demands awareness of different styles to avoid unintentional offence.','Write a professional email (150 words) explaining a project delay and proposing a revised timeline.','CEO: The board wants our Q3 report by Friday.
Manager: I will have the draft Thursday morning for your review.
CEO: Make sure the restructuring rationale is watertight. Analysts will scrutinise it.
Manager: Should I include the risk section?
CEO: Absolutely. Maximum twelve slides.
Manager: I will prepare a one-page executive summary too.
CEO: Set up a 30-minute briefing Wednesday afternoon.','[{"en":"Negotiation","ru":"Переговоры"},{"en":"Stakeholder","ru":"Заинтересованная сторона"},{"en":"Strategy","ru":"Стратегия"},{"en":"Agenda","ru":"Повестка дня"},{"en":"Briefing","ru":"Брифинг"},{"en":"Executive","ru":"Руководитель"},{"en":"Concise","ru":"Лаконичный"},{"en":"Deadline","ru":"Срок"},{"en":"Proposal","ru":"Предложение"},{"en":"Feedback","ru":"Обратная связь"}]'),
('b5000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000005','Academic Research and Discourse',2,'Engaging with Academic Literature

At an advanced level, engaging critically with academic literature means evaluating methodology, identifying limitations, and situating research within scholarly debates.

Peer-reviewed journals are the gold standard. Check publication date, journal ranking, and author credentials.

Synthesising multiple sources demonstrates sophisticated understanding.

Avoiding bias requires reflexivity - acknowledging your own assumptions.','Write an annotated bibliography entry (200 words) for an imaginary article on AI in Education.','Supervisor: How is your literature review progressing?
Researcher: I covered forty papers but struggle to find a clear gap.
Supervisor: What themes emerge?
Researcher: Most studies focus on outcomes but few examine the learning process.
Supervisor: That could be your gap. A qualitative approach might reveal something different.
Researcher: I will complete the review by month-end and start data collection in March.','[{"en":"Methodology","ru":"Методология"},{"en":"Hypothesis","ru":"Гипотеза"},{"en":"Peer-reviewed","ru":"Рецензируемый"},{"en":"Discourse","ru":"Дискурс"},{"en":"Synthesis","ru":"Синтез"},{"en":"Qualitative","ru":"Качественный"},{"en":"Quantitative","ru":"Количественный"},{"en":"Bias","ru":"Предвзятость"},{"en":"Implication","ru":"Следствие"},{"en":"Citation","ru":"Цитирование"}]'),
('b5000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000005','Rhetoric and Persuasion',3,'The Power of Persuasive Language

Rhetoric - the art of persuasive communication - has been studied since ancient Greece. Aristotle identified three modes: ethos (credibility), pathos (emotional appeal), and logos (logical argument).

Effective rhetoric uses all three. In modern contexts, rhetoric is found in political speeches, advertising, and social media.

Metaphor, repetition, and the rule of three are powerful stylistic devices.','Analyse a famous speech. Identify examples of ethos, pathos, and logos. Write 200 words.','Speechwriter: The opening is strong but we lose momentum in the middle.
Politician: Where exactly?
Speechwriter: After the unemployment statistics - no emotional pivot. We go straight into policy.
Politician: What do you suggest?
Speechwriter: A personal story. Then policy feels like a solution.
Politician: Good. And the closing?
Speechwriter: Use the rule of three. Not tomorrow. Not next year. Today.','[{"en":"Rhetoric","ru":"Риторика"},{"en":"Persuasion","ru":"Убеждение"},{"en":"Ethos","ru":"Этос"},{"en":"Pathos","ru":"Пафос"},{"en":"Logos","ru":"Логос"},{"en":"Metaphor","ru":"Метафора"},{"en":"Credibility","ru":"Авторитет"},{"en":"Audience","ru":"Аудитория"},{"en":"Tone","ru":"Тон"},{"en":"Emphasis","ru":"Акцент"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('b5000000-0000-0000-0000-000000000001','What does Negotiation mean?','Презентация','Переговоры','Повестка','Стратегия','B'),
('b5000000-0000-0000-0000-000000000001','What does Concise mean?','Подробный','Формальный','Лаконичный','Длинный','C'),
('b5000000-0000-0000-0000-000000000001','Max slides the CEO wants?','Eight','Ten','Twelve','Fifteen','C'),
('b5000000-0000-0000-0000-000000000001','What does manager prepare additionally?','A video','Executive summary','An appendix','Press release','B'),
('b5000000-0000-0000-0000-000000000001','What does Briefing mean?','Переговоры','Инструктаж','Отчёт','Презентация','B'),
('b5000000-0000-0000-0000-000000000001','What does Stakeholder mean?','Сотрудник','Клиент','Заинтересованная сторона','Инвестор','C'),
('b5000000-0000-0000-0000-000000000001','What does Strategy mean?','Тактика','Стратегия','Повестка','Проект','B'),
('b5000000-0000-0000-0000-000000000001','What does Feedback mean?','Повестка','Стратегия','Обратная связь','Брифинг','C'),
('b5000000-0000-0000-0000-000000000001','What does Proposal mean?','Стратегия','Предложение','Отчёт','Повестка','B'),
('b5000000-0000-0000-0000-000000000001','When is the briefing?','Monday','Tuesday','Wednesday','Thursday','C'),
('b5000000-0000-0000-0000-000000000002','What does Methodology mean?','Гипотеза','Методология','Синтез','Предвзятость','B'),
('b5000000-0000-0000-0000-000000000002','What does Bias mean?','Методология','Гипотеза','Предвзятость','Синтез','C'),
('b5000000-0000-0000-0000-000000000002','What is a peer-reviewed journal?','Published by students','Reviewed by field experts','Free online','Edited by one author','B'),
('b5000000-0000-0000-0000-000000000002','What does Hypothesis mean?','Вывод','Метод','Гипотеза','Данные','C'),
('b5000000-0000-0000-0000-000000000002','What does Qualitative mean?','Количественный','Качественный','Статистический','Экспериментальный','B'),
('b5000000-0000-0000-0000-000000000002','What does Synthesis mean?','Анализ','Цитирование','Синтез','Гипотеза','C'),
('b5000000-0000-0000-0000-000000000002','What does Implication mean?','Гипотеза','Методология','Следствие','Синтез','C'),
('b5000000-0000-0000-0000-000000000002','What does Discourse mean?','Цитата','Дискурс','Предвзятость','Вывод','B'),
('b5000000-0000-0000-0000-000000000002','What does Quantitative mean?','Качественный','Количественный','Описательный','Теоретический','B'),
('b5000000-0000-0000-0000-000000000002','What does Citation mean?','Плагиат','Цитирование','Введение','Аргумент','B'),
('b5000000-0000-0000-0000-000000000003','What is Rhetoric?','Риторика','Убеждение','Логика','Метафора','A'),
('b5000000-0000-0000-0000-000000000003','What does Pathos mean?','Логика','Авторитет','Эмоциональное воздействие','Факт','C'),
('b5000000-0000-0000-0000-000000000003','What does Ethos mean?','Логика','Эмоция','Доверие и авторитет','Аудитория','C'),
('b5000000-0000-0000-0000-000000000003','What does Logos mean?','Эмоция','Авторитет','Логика','Аудитория','C'),
('b5000000-0000-0000-0000-000000000003','What does Metaphor mean?','Повторение','Метафора','Тон','Акцент','B'),
('b5000000-0000-0000-0000-000000000003','What is the rule of three?','Three statistics','Three speakers','Three parallel elements','Three arguments','C'),
('b5000000-0000-0000-0000-000000000003','What does speechwriter suggest after statistics?','More detail','A personal story','Rhetorical question','A metaphor','B'),
('b5000000-0000-0000-0000-000000000003','What does Credibility mean?','Аудитория','Авторитет','Тон','Убеждение','B'),
('b5000000-0000-0000-0000-000000000003','What does Tone mean?','Метафора','Тон','Акцент','Риторика','B'),
('b5000000-0000-0000-0000-000000000003','What does Audience mean?','Аудитория','Докладчик','Тема','Слушатели','A')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 11. ACCOUNTING LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c1000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000006','Financial Statements',1,'Understanding Financial Statements

Financial statements are formal records of a company''s financial activities. There are three main types: the balance sheet, the income statement, and the cash flow statement.

The balance sheet shows assets, liabilities, and equity at a specific point in time. Assets are what a company owns. Liabilities are what it owes. Equity is the difference.

The income statement shows revenues, expenses, and profit over a period. Revenue minus expenses equals net profit.

The cash flow statement tracks actual cash movements: operating, investing, and financing activities.

Accountants use these documents to assess financial health and support decision-making.','Explain the difference between the balance sheet and the income statement in 100 words.','Client: I need to understand my company''s financial position.
Accountant: Let''s start with your balance sheet. As of December 31, total assets were 5 million tenge.
Client: And liabilities?
Accountant: 2.1 million. So your equity is 2.9 million.
Client: Is that good?
Accountant: Your debt-to-equity ratio is 0.72, which is healthy. However, your current ratio is 1.1 - a bit low.
Client: What does that mean?
Accountant: You have just enough current assets to cover short-term debts. I recommend increasing your cash reserve.','[{"en":"Balance sheet","ru":"Бухгалтерский баланс"},{"en":"Income statement","ru":"Отчёт о прибылях и убытках"},{"en":"Revenue","ru":"Выручка / Доход"},{"en":"Expense","ru":"Расход"},{"en":"Profit","ru":"Прибыль"},{"en":"Assets","ru":"Активы"},{"en":"Liabilities","ru":"Обязательства"},{"en":"Equity","ru":"Собственный капитал"},{"en":"Cash flow","ru":"Денежный поток"},{"en":"Audit","ru":"Аудит"}]'),
('c1000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000006','Taxation Basics',2,'Understanding Business Taxation

Taxation is a fundamental aspect of accounting. Businesses must comply with tax laws and file accurate returns.

Corporate income tax is levied on company profits. The tax rate varies by country and industry. In Kazakhstan, the standard corporate income tax rate is 20%.

Value Added Tax (VAT) is charged on goods and services. Businesses collect VAT from customers and remit it to the tax authority.

Tax deductions reduce taxable income. Common deductions include business expenses, depreciation, and staff costs.

Proper tax planning can legally minimise the tax burden. Tax evasion, however, is illegal and results in penalties.','Explain the difference between tax avoidance and tax evasion. Why is accurate record-keeping important for tax compliance?','Tax inspector: We are conducting a routine audit of your VAT records.
Accountant: Of course. Here are our VAT returns for the past three years.
Inspector: I see a discrepancy in Q2 of last year. Your input VAT claim seems high.
Accountant: Those relate to equipment purchases. Here are the invoices.
Inspector: Thank you. Can you also provide the depreciation schedule?
Accountant: Yes, I have it here. All assets are depreciated on a straight-line basis over five years.
Inspector: Everything looks in order. We will send the formal clearance within 10 working days.','[{"en":"Tax","ru":"Налог"},{"en":"VAT","ru":"НДС"},{"en":"Deduction","ru":"Вычет"},{"en":"Depreciation","ru":"Амортизация"},{"en":"Invoice","ru":"Накладная / Счёт-фактура"},{"en":"Taxable income","ru":"Налогооблагаемый доход"},{"en":"Tax return","ru":"Налоговая декларация"},{"en":"Compliance","ru":"Соответствие / Соблюдение"},{"en":"Penalty","ru":"Штраф"},{"en":"Audit","ru":"Проверка / Аудит"}]'),
('c1000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000006','Budgeting and Forecasting',3,'Planning Finances: Budgets and Forecasts

A budget is a financial plan that estimates expected income and expenditure over a specific period, usually one year. Budgets help organisations allocate resources efficiently and measure performance.

Variance analysis compares actual results to budgeted figures. A favourable variance means better-than-expected performance; an adverse variance indicates underperformance.

Financial forecasting uses historical data and market trends to predict future financial outcomes. Unlike budgets, forecasts are regularly updated as new information becomes available.

Zero-based budgeting starts from zero every year - every expense must be justified rather than carried forward from the previous year.

Rolling forecasts are updated continuously, typically covering a 12-month forward period.','Create a simple monthly budget template for a small business. Include at least 5 income and 5 expense categories.','CFO: Our Q3 variance report shows a 15% adverse variance in operating costs.
Controller: Most of it is from raw material prices, which increased unexpectedly.
CFO: How does that affect our full-year forecast?
Controller: We are revising the full-year EBITDA down by about 8%.
CFO: Have you updated the rolling forecast?
Controller: Yes, I adjusted assumptions for Q4. If material costs stabilise, we should recover some ground.
CFO: What about the capex budget?
Controller: We can defer two non-critical projects to Q1 next year to preserve cash.','[{"en":"Budget","ru":"Бюджет"},{"en":"Forecast","ru":"Прогноз"},{"en":"Variance","ru":"Отклонение"},{"en":"Revenue","ru":"Выручка"},{"en":"Expenditure","ru":"Расходы"},{"en":"Profit margin","ru":"Маржа прибыли"},{"en":"EBITDA","ru":"EBITDA (прибыль до вычетов)"},{"en":"Cash reserve","ru":"Резерв денежных средств"},{"en":"Capex","ru":"Капиталовложения"},{"en":"Allocation","ru":"Распределение"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c1000000-0000-0000-0000-000000000001','What does Balance sheet show?','Revenue and expenses','Assets, liabilities, and equity','Cash movements','Profit only','B'),
('c1000000-0000-0000-0000-000000000001','What does Revenue mean?','Расход','Выручка','Прибыль','Актив','B'),
('c1000000-0000-0000-0000-000000000001','What are Assets?','What a company owes','What a company owns','Company profit','Company revenue','B'),
('c1000000-0000-0000-0000-000000000001','What are Liabilities?','What a company owns','What a company owes','Company equity','Company profit','B'),
('c1000000-0000-0000-0000-000000000001','What does Equity mean?','Выручка','Расход','Собственный капитал','Актив','C'),
('c1000000-0000-0000-0000-000000000001','Total assets in the dialogue?','2.1 million','2.9 million','5 million','10 million','C'),
('c1000000-0000-0000-0000-000000000001','What does Audit mean?','Аудит','Бюджет','Актив','Расход','A'),
('c1000000-0000-0000-0000-000000000001','What does Cash flow mean?','Прибыль','Выручка','Денежный поток','Расход','C'),
('c1000000-0000-0000-0000-000000000001','What does Profit mean?','Выручка','Расход','Прибыль','Актив','C'),
('c1000000-0000-0000-0000-000000000001','What does Expense mean?','Прибыль','Выручка','Расход','Актив','C'),
('c1000000-0000-0000-0000-000000000002','Corporate income tax rate in Kazakhstan?','10%','15%','20%','25%','C'),
('c1000000-0000-0000-0000-000000000002','What does VAT stand for?','Value Added Tax','Variable Annual Tax','Verified Accounting Total','Volume and Trade','A'),
('c1000000-0000-0000-0000-000000000002','What does Depreciation mean?','НДС','Амортизация','Вычет','Штраф','B'),
('c1000000-0000-0000-0000-000000000002','What does Invoice mean?','Налог','Аудит','Счёт-фактура','Декларация','C'),
('c1000000-0000-0000-0000-000000000002','What does Penalty mean?','Вычет','Аудит','Прибыль','Штраф','D'),
('c1000000-0000-0000-0000-000000000002','What is tax evasion?','Legal tax reduction','Illegal non-payment of tax','Claiming deductions','Filing returns late','B'),
('c1000000-0000-0000-0000-000000000002','What does Compliance mean?','Нарушение','Соответствие','Штраф','Вычет','B'),
('c1000000-0000-0000-0000-000000000002','How are assets depreciated in the dialogue?','Declining balance','Straight-line over 5 years','Straight-line over 10 years','Accelerated','B'),
('c1000000-0000-0000-0000-000000000002','What does Tax return mean?','Возврат налога','Налоговая декларация','Налоговый штраф','НДС','B'),
('c1000000-0000-0000-0000-000000000002','What does Deduction mean?','Штраф','Налог','Вычет','Аудит','C'),
('c1000000-0000-0000-0000-000000000003','What is a budget?','A tax document','A financial plan for income and expenditure','A loan agreement','An audit report','B'),
('c1000000-0000-0000-0000-000000000003','What does Forecast mean?','Бюджет','Прогноз','Отклонение','Расходы','B'),
('c1000000-0000-0000-0000-000000000003','What is a favourable variance?','Better than expected performance','Worse than expected','Equal to budget','An error in accounts','A'),
('c1000000-0000-0000-0000-000000000003','What does EBITDA mean?','Прибыль до вычетов','Налог','Выручка','Бюджет','A'),
('c1000000-0000-0000-0000-000000000003','Q3 adverse variance in the dialogue?','5%','10%','15%','20%','C'),
('c1000000-0000-0000-0000-000000000003','What does Variance mean?','Бюджет','Прогноз','Отклонение','Расход','C'),
('c1000000-0000-0000-0000-000000000003','What does Capex mean?','Операционные расходы','Капиталовложения','Денежный резерв','Прибыль','B'),
('c1000000-0000-0000-0000-000000000003','What is zero-based budgeting?','Carry forward from previous year','Every expense must be justified each year','Based on revenue only','Uses historical averages','B'),
('c1000000-0000-0000-0000-000000000003','What does Allocation mean?','Прогноз','Распределение','Резерв','Отклонение','B'),
('c1000000-0000-0000-0000-000000000003','What does Profit margin mean?','Выручка','Расход','Маржа прибыли','Актив','C')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 12. COMPUTER SCIENCE LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c2000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000007','Programming Fundamentals',1,'Introduction to Programming

Programming is the process of writing instructions for a computer to execute. These instructions are written in a programming language such as Python, JavaScript, or Java.

Every program consists of basic building blocks: variables (which store data), control structures (like if/else and loops), and functions (reusable blocks of code).

Algorithms are step-by-step procedures for solving problems. A good algorithm is efficient and produces the correct output for all valid inputs.

Debugging is the process of finding and fixing errors (bugs) in code. Good programmers write clean, readable code and use version control systems like Git to track changes.','Explain in your own words what an algorithm is and give a real-life example. Write 100 words.','Developer: I found a critical bug in the payment module.
Lead: When did it appear?
Developer: After the last deployment. The checkout crashes when a user has items from multiple vendors.
Lead: Did you check the logs?
Developer: Yes. There''s a null pointer exception in the cart merger function.
Lead: Can you reproduce it locally?
Developer: Yes, consistently.
Lead: Write a unit test for it, then push the fix. We need this resolved before the morning release.','[{"en":"Algorithm","ru":"Алгоритм"},{"en":"Variable","ru":"Переменная"},{"en":"Function","ru":"Функция"},{"en":"Loop","ru":"Цикл"},{"en":"Debug","ru":"Отладка"},{"en":"Deployment","ru":"Развёртывание"},{"en":"Repository","ru":"Репозиторий"},{"en":"Bug","ru":"Ошибка / Баг"},{"en":"Syntax","ru":"Синтаксис"},{"en":"Compiler","ru":"Компилятор"}]'),
('c2000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000007','Databases and SQL',2,'Working with Databases

A database is an organised collection of data. Relational databases store data in tables with rows and columns, similar to spreadsheets. SQL (Structured Query Language) is used to interact with relational databases.

Key SQL commands include: SELECT (retrieve data), INSERT (add records), UPDATE (modify records), and DELETE (remove records).

Database design involves creating tables with appropriate fields and establishing relationships between them using primary and foreign keys.

Indexing speeds up queries but requires additional storage. Transactions ensure data integrity - if one part of an operation fails, all changes are rolled back.','Write a simple SQL query to find all customers who made a purchase in the last 30 days. Explain each part of the query.','Database admin: We have a performance issue with the reporting queries.
Developer: How slow are they?
Admin: The monthly sales report takes 4 minutes to run.
Developer: That''s terrible. Can I see the query?
Admin: Here. It''s doing a full table scan on the orders table - 50 million rows.
Developer: There''s no index on the date column. Let''s add one.
Admin: Will that cause downtime?
Developer: We can create it concurrently. Zero downtime. Should cut the query time to under 5 seconds.','[{"en":"Database","ru":"База данных"},{"en":"Query","ru":"Запрос"},{"en":"Table","ru":"Таблица"},{"en":"Index","ru":"Индекс"},{"en":"Primary key","ru":"Первичный ключ"},{"en":"Foreign key","ru":"Внешний ключ"},{"en":"Transaction","ru":"Транзакция"},{"en":"Schema","ru":"Схема"},{"en":"Record","ru":"Запись"},{"en":"SQL","ru":"SQL (язык запросов)"}]'),
('c2000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000007','Cybersecurity Essentials',3,'Protecting Digital Systems

Cybersecurity is the practice of protecting computer systems, networks, and data from digital attacks.

Common threats include malware (software designed to harm), phishing (deceptive emails that steal credentials), and ransomware (malware that encrypts files and demands payment).

Security best practices include: using strong unique passwords, enabling two-factor authentication (2FA), keeping software updated, and encrypting sensitive data.

Network security involves firewalls, VPNs, and intrusion detection systems. Data breaches can have serious legal, financial, and reputational consequences.

The principle of least privilege means users should only have access to what they need to perform their job.','Write a cybersecurity policy memo for a small company (150 words) outlining 5 key security rules all employees must follow.','Security analyst: We detected unusual login attempts on three executive accounts last night.
IT manager: Credential stuffing attack?
Analyst: Most likely. They used a list of leaked passwords from a third-party breach.
Manager: Are 2FA enrolled on those accounts?
Analyst: Two of three. The third account was compromised.
Manager: Reset the password, revoke all active sessions, and enrol 2FA immediately.
Analyst: Done. Should we notify the executive?
Manager: Yes. And send a company-wide reminder to enable 2FA and update passwords.','[{"en":"Cybersecurity","ru":"Кибербезопасность"},{"en":"Malware","ru":"Вредоносное ПО"},{"en":"Phishing","ru":"Фишинг"},{"en":"Encryption","ru":"Шифрование"},{"en":"Firewall","ru":"Межсетевой экран"},{"en":"Authentication","ru":"Аутентификация"},{"en":"Password","ru":"Пароль"},{"en":"Vulnerability","ru":"Уязвимость"},{"en":"Data breach","ru":"Утечка данных"},{"en":"Backup","ru":"Резервная копия"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c2000000-0000-0000-0000-000000000001','What does Algorithm mean?','Переменная','Алгоритм','Цикл','Синтаксис','B'),
('c2000000-0000-0000-0000-000000000001','What does Bug mean?','Компилятор','Репозиторий','Ошибка','Функция','C'),
('c2000000-0000-0000-0000-000000000001','What does Debug mean?','Развёртывание','Отладка','Компиляция','Синтаксис','B'),
('c2000000-0000-0000-0000-000000000001','What error appears in the dialogue?','Syntax error','Memory overflow','Null pointer exception','Type error','C'),
('c2000000-0000-0000-0000-000000000001','What does Variable mean?','Функция','Цикл','Переменная','Алгоритм','C'),
('c2000000-0000-0000-0000-000000000001','What does Function mean?','Алгоритм','Переменная','Компилятор','Функция','D'),
('c2000000-0000-0000-0000-000000000001','What does Deployment mean?','Отладка','Развёртывание','Синтаксис','Цикл','B'),
('c2000000-0000-0000-0000-000000000001','What does Loop mean?','Функция','Переменная','Цикл','Алгоритм','C'),
('c2000000-0000-0000-0000-000000000001','What does Syntax mean?','Алгоритм','Синтаксис','Ошибка','Компилятор','B'),
('c2000000-0000-0000-0000-000000000001','What does Repository mean?','Репозиторий','Переменная','Функция','Цикл','A'),
('c2000000-0000-0000-0000-000000000002','What does Query mean?','Таблица','Запрос','Индекс','Схема','B'),
('c2000000-0000-0000-0000-000000000002','What SQL command retrieves data?','INSERT','UPDATE','DELETE','SELECT','D'),
('c2000000-0000-0000-0000-000000000002','What does Index mean?','Запрос','Таблица','Индекс','Ключ','C'),
('c2000000-0000-0000-0000-000000000002','What does Transaction mean?','Индекс','Транзакция','Запрос','Схема','B'),
('c2000000-0000-0000-0000-000000000002','Orders table size in dialogue?','5 million','10 million','50 million','100 million','C'),
('c2000000-0000-0000-0000-000000000002','What does Schema mean?','Запрос','Индекс','Схема','Таблица','C'),
('c2000000-0000-0000-0000-000000000002','What does Primary key mean?','Внешний ключ','Первичный ключ','Индекс','Запрос','B'),
('c2000000-0000-0000-0000-000000000002','Expected query time after fix?','Under 1 second','Under 5 seconds','Under 30 seconds','Under 2 minutes','B'),
('c2000000-0000-0000-0000-000000000002','What does Record mean?','Таблица','Запись','Схема','Ключ','B'),
('c2000000-0000-0000-0000-000000000002','What does Foreign key mean?','Первичный ключ','Внешний ключ','Индекс','Таблица','B'),
('c2000000-0000-0000-0000-000000000003','What does Malware mean?','Фишинг','Шифрование','Вредоносное ПО','Пароль','C'),
('c2000000-0000-0000-0000-000000000003','What does Phishing mean?','Шифрование','Фишинг','Брандмауэр','Пароль','B'),
('c2000000-0000-0000-0000-000000000003','What does Encryption mean?','Шифрование','Пароль','Уязвимость','Резервная копия','A'),
('c2000000-0000-0000-0000-000000000003','What does Firewall mean?','Пароль','Шифрование','Межсетевой экран','Аутентификация','C'),
('c2000000-0000-0000-0000-000000000003','What is 2FA?','Two-factor authentication','Two-file access','Transfer file authentication','Third-party firewall','A'),
('c2000000-0000-0000-0000-000000000003','What attack is described in the dialogue?','Ransomware','DDoS','Credential stuffing','SQL injection','C'),
('c2000000-0000-0000-0000-000000000003','How many executive accounts were targeted?','One','Two','Three','Four','C'),
('c2000000-0000-0000-0000-000000000003','What does Vulnerability mean?','Уязвимость','Шифрование','Пароль','Резервная копия','A'),
('c2000000-0000-0000-0000-000000000003','What does Backup mean?','Пароль','Шифрование','Резервная копия','Уязвимость','C'),
('c2000000-0000-0000-0000-000000000003','What does Data breach mean?','Резервная копия','Утечка данных','Шифрование','Фишинг','B')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 13. HOSPITALITY LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c3000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000008','Hotel Operations',1,'Working in a Hotel

Hotels provide accommodation and services to guests. A well-run hotel requires coordination between departments: front desk, housekeeping, food and beverage, and maintenance.

The front desk is the first point of contact. Staff must greet guests warmly, check them in efficiently, and handle requests and complaints professionally.

Housekeeping ensures rooms are clean and well-stocked. A standard room turnover takes 30-45 minutes.

Food and beverage includes the restaurant, bar, and room service. Quality and presentation are essential to guest satisfaction.

Guest satisfaction scores (like TripAdvisor ratings) directly affect a hotel''s reputation and revenue. Excellent service turns first-time visitors into loyal repeat customers.','You work at a hotel front desk. Write a dialogue where you check in a guest who has a complaint about their room.','Guest: Good morning. I have a reservation under the name Johnson.
Receptionist: Good morning, Mr. Johnson. Welcome to the Grand Hotel. May I see your passport?
Guest: Of course. Here you are.
Receptionist: Thank you. You have a deluxe room on the 8th floor with a city view.
Guest: I actually requested a sea view. Is that possible?
Receptionist: I apologise for the confusion. Let me check availability. Yes, I can upgrade you to a sea-view suite at no extra charge.
Guest: That''s very kind. Thank you.
Receptionist: My pleasure. Your room is 812. Breakfast is served from 7 to 10:30 in the Garden Restaurant.','[{"en":"Check-in","ru":"Заезд"},{"en":"Check-out","ru":"Выезд"},{"en":"Reservation","ru":"Бронирование"},{"en":"Concierge","ru":"Консьерж"},{"en":"Housekeeping","ru":"Хозяйственная служба"},{"en":"Suite","ru":"Люкс"},{"en":"Receptionist","ru":"Администратор"},{"en":"Amenities","ru":"Удобства"},{"en":"Complaint","ru":"Жалоба"},{"en":"Upgrade","ru":"Улучшение / Апгрейд"}]'),
('c3000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000008','Restaurant Service',2,'Excellence in Food Service

A restaurant''s success depends on the quality of both food and service. Front-of-house staff - hosts, servers, and managers - must ensure a seamless dining experience.

A server''s responsibilities include: welcoming guests, presenting the menu, taking orders accurately, serving food and drinks promptly, and handling bills.

Up-selling - suggesting premium dishes, wine pairings, or desserts - increases revenue and enhances the guest experience when done tactfully.

Handling complaints professionally is crucial. Listen carefully, apologise sincerely, and offer a solution. A guest whose complaint is handled well is more likely to return than one who never complained.

Food safety and hygiene standards must be maintained at all times.','Write a restaurant server training guide covering: greeting guests, taking orders, handling complaints, and processing payments. Use formal language.','Manager: Table 14 is unhappy with their food. The steak is overcooked.
Server: I apologise to the table and offer to replace it?
Manager: Yes. And comp their desserts. We never want guests to feel they paid for a poor experience.
Server: Of course. Should I inform the kitchen?
Manager: Already done. The replacement should be out in 8 minutes.
Server: What if they refuse the replacement?
Manager: Then remove the steak from the bill. Guest satisfaction is our priority.','[{"en":"Menu","ru":"Меню"},{"en":"Order","ru":"Заказ"},{"en":"Serve","ru":"Обслуживать"},{"en":"Bill","ru":"Счёт"},{"en":"Up-sell","ru":"Допродажа"},{"en":"Complaint","ru":"Жалоба"},{"en":"Hygiene","ru":"Гигиена"},{"en":"Course","ru":"Блюдо (подача)"},{"en":"Tip","ru":"Чаевые"},{"en":"Reservation","ru":"Бронирование"}]'),
('c3000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000008','Tourism and Travel Services',3,'The Travel and Tourism Industry

Tourism is one of the world''s largest industries, contributing significantly to global GDP and employment. Travel agencies, tour operators, and destination management companies play key roles.

A travel agent advises clients on destinations, books flights, accommodation, and activities, and handles visas and insurance. With the rise of online booking platforms, agents now focus more on complex itineraries and personalised service.

Tour operators create packaged holidays combining transport, accommodation, and activities. All-inclusive resorts bundle everything into one price.

Sustainable tourism minimises environmental impact and benefits local communities. Ecotourism focuses on nature and conservation.

Customer service is paramount in tourism - a single negative review can reach thousands of potential customers.','Design a 5-day itinerary for a first-time visitor to Kazakhstan. Include accommodation, activities, and local food recommendations.','Travel agent: Good afternoon. How can I help you today?
Client: I want to plan a 2-week holiday in Southeast Asia but have no idea where to start.
Agent: Wonderful! Are you interested in beaches, culture, adventure, or a mix?
Client: Mostly beaches but with some culture as well.
Agent: I recommend starting with Thailand - Bangkok for culture, then Koh Samui for beaches. Then a few days in Vietnam.
Client: That sounds perfect. What''s the best time to go?
Agent: November to February - dry season, perfect weather.','[{"en":"Tourism","ru":"Туризм"},{"en":"Itinerary","ru":"Маршрут / Программа"},{"en":"Package tour","ru":"Турпакет"},{"en":"Visa","ru":"Виза"},{"en":"Resort","ru":"Курорт"},{"en":"All-inclusive","ru":"Всё включено"},{"en":"Sustainable","ru":"Устойчивый / Экологичный"},{"en":"Destination","ru":"Направление / Пункт назначения"},{"en":"Insurance","ru":"Страховка"},{"en":"Transfer","ru":"Трансфер"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c3000000-0000-0000-0000-000000000001','What does Check-in mean?','Выезд','Заезд','Бронирование','Жалоба','B'),
('c3000000-0000-0000-0000-000000000001','What does Reservation mean?','Заезд','Выезд','Бронирование','Апгрейд','C'),
('c3000000-0000-0000-0000-000000000001','What does the guest request in the dialogue?','Higher floor','Sea view room','Early check-in','Extra bed','B'),
('c3000000-0000-0000-0000-000000000001','What does Upgrade mean?','Жалоба','Улучшение','Бронирование','Выезд','B'),
('c3000000-0000-0000-0000-000000000001','What does Housekeeping mean?','Администратор','Консьерж','Хозяйственная служба','Жалоба','C'),
('c3000000-0000-0000-0000-000000000001','What does Suite mean?','Номер эконом','Люкс','Стандарт','Апартаменты','B'),
('c3000000-0000-0000-0000-000000000001','What does Receptionist mean?','Консьерж','Менеджер','Администратор','Горничная','C'),
('c3000000-0000-0000-0000-000000000001','What does Complaint mean?','Бронирование','Жалоба','Услуга','Чаевые','B'),
('c3000000-0000-0000-0000-000000000001','Breakfast is served until what time?','9:00','10:00','10:30','11:00','C'),
('c3000000-0000-0000-0000-000000000001','What does Concierge mean?','Горничная','Консьерж','Администратор','Менеджер','B'),
('c3000000-0000-0000-0000-000000000002','What does Up-sell mean?','Скидка','Жалоба','Допродажа','Возврат','C'),
('c3000000-0000-0000-0000-000000000002','What is the complaint in the manager dialogue?','Cold food','Wrong order','Overcooked steak','Slow service','C'),
('c3000000-0000-0000-0000-000000000002','What does Bill mean?','Меню','Счёт','Заказ','Чаевые','B'),
('c3000000-0000-0000-0000-000000000002','What does Hygiene mean?','Обслуживание','Гигиена','Заказ','Жалоба','B'),
('c3000000-0000-0000-0000-000000000002','How long for the replacement steak?','5 minutes','8 minutes','10 minutes','15 minutes','B'),
('c3000000-0000-0000-0000-000000000002','What does Tip mean?','Счёт','Заказ','Чаевые','Меню','C'),
('c3000000-0000-0000-0000-000000000002','What does Order mean?','Меню','Счёт','Заказ','Блюдо','C'),
('c3000000-0000-0000-0000-000000000002','What does Serve mean?','Заказывать','Обслуживать','Платить','Готовить','B'),
('c3000000-0000-0000-0000-000000000002','What does Course mean?','Кухня','Блюдо (подача)','Чаевые','Меню','B'),
('c3000000-0000-0000-0000-000000000002','What is comped for table 14?','Drinks','Starter','Desserts','The whole bill','C'),
('c3000000-0000-0000-0000-000000000003','What does Itinerary mean?','Виза','Страховка','Маршрут','Курорт','C'),
('c3000000-0000-0000-0000-000000000003','What does Visa mean?','Виза','Трансфер','Страховка','Маршрут','A'),
('c3000000-0000-0000-0000-000000000003','What does the client want in the dialogue?','Mountain holiday','City trips','Beaches with some culture','Adventure sports','C'),
('c3000000-0000-0000-0000-000000000003','Best travel time according to agent?','March to May','June to August','November to February','April to June','C'),
('c3000000-0000-0000-0000-000000000003','What does All-inclusive mean?','Только проживание','Всё включено','Без питания','Только трансфер','B'),
('c3000000-0000-0000-0000-000000000003','What does Insurance mean?','Виза','Трансфер','Страховка','Маршрут','C'),
('c3000000-0000-0000-0000-000000000003','What does Sustainable mean?','Дорогой','Устойчивый','Популярный','Новый','B'),
('c3000000-0000-0000-0000-000000000003','What does Destination mean?','Маршрут','Пункт назначения','Транспорт','Виза','B'),
('c3000000-0000-0000-0000-000000000003','What does Transfer mean?','Трансфер','Виза','Страховка','Маршрут','A'),
('c3000000-0000-0000-0000-000000000003','What does Tourism mean?','Виза','Трансфер','Туризм','Страховка','C')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 14. MANAGEMENT LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c4000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000009','Leadership and Management Styles',1,'Leadership in Organisations

Leadership is the ability to guide, inspire, and influence others toward achieving common goals. Management, while related, focuses more on planning, organising, and controlling resources.

There are several leadership styles. Autocratic leaders make decisions alone, which is fast but demotivates staff. Democratic leaders involve the team in decisions, which builds engagement but can be slow. Laissez-faire leaders give maximum autonomy, suitable for expert teams but risky with inexperienced staff.

Transformational leaders inspire change and innovation. They focus on long-term vision and developing people.

Effective leaders possess emotional intelligence - the ability to understand and manage their own emotions and empathise with others.','Describe a good leader you know or admire. What qualities make them effective? Write 150 words.','HR Director: We are redesigning our leadership development programme.
Consultant: What outcomes are you trying to achieve?
HR: We want to move from command-and-control to a more collaborative culture.
Consultant: That requires addressing behaviours at every level. What do your employee surveys show?
HR: Low scores on "my manager listens to me" and "I feel empowered."
Consultant: Classic symptoms of autocratic management. We should introduce 360-degree feedback and coaching.
HR: How long does cultural change take?
Consultant: Typically 18 to 36 months with consistent effort. Quick wins matter for momentum.','[{"en":"Leadership","ru":"Лидерство"},{"en":"Management","ru":"Управление"},{"en":"Autocratic","ru":"Авторитарный"},{"en":"Democratic","ru":"Демократический"},{"en":"Delegation","ru":"Делегирование"},{"en":"Motivation","ru":"Мотивация"},{"en":"Team","ru":"Команда"},{"en":"Strategy","ru":"Стратегия"},{"en":"Decision-making","ru":"Принятие решений"},{"en":"Empowerment","ru":"Делегирование полномочий"}]'),
('c4000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000009','Project Management',2,'Managing Projects Successfully

Project management is the process of planning, executing, and closing a project to achieve specific goals within defined constraints of time, budget, and scope.

The project lifecycle has five phases: initiation, planning, execution, monitoring, and closure. Each phase has specific deliverables and checkpoints.

The triple constraint - scope, time, and cost - means changing one element typically affects the others. A project manager must balance these constraints.

Risk management involves identifying potential problems early and creating mitigation plans. A risk register documents all identified risks, their probability, impact, and response strategies.

Agile methodology uses short sprints and continuous delivery, enabling teams to adapt quickly to changing requirements.','You are a project manager. Write a project status report (150 words) for a software development project that is 2 weeks behind schedule.','Client: I understand the project is behind schedule.
PM: Yes, I owe you an honest update. We are two weeks behind due to unexpected technical complexity in the integration phase.
Client: What is the impact on the delivery date?
PM: If we add two additional developers and work extended hours next month, we can recover one week and deliver only one week late.
Client: What does that cost?
PM: An additional 15% on the development budget, roughly $30,000.
Client: That is acceptable given the circumstances. Please send a revised project plan by Friday.
PM: Absolutely. I will also include a risk register for the remaining phases.','[{"en":"Project","ru":"Проект"},{"en":"Deadline","ru":"Срок / Дедлайн"},{"en":"Milestone","ru":"Веха / Контрольная точка"},{"en":"Stakeholder","ru":"Заинтересованная сторона"},{"en":"Risk","ru":"Риск"},{"en":"Budget","ru":"Бюджет"},{"en":"Scope","ru":"Объём работ"},{"en":"Agile","ru":"Гибкая методология"},{"en":"Deliverable","ru":"Результат / Поставляемый продукт"},{"en":"Sprint","ru":"Спринт"}]'),
('c4000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000009','Strategic Planning',3,'Developing Organisational Strategy

Strategy is a long-term plan that defines how an organisation will achieve its vision and goals. Strategic planning typically covers a 3-5 year horizon.

A SWOT analysis examines internal Strengths and Weaknesses, and external Opportunities and Threats. It provides a foundation for strategic choices.

Porter''s Five Forces model analyses competitive intensity: threat of new entrants, bargaining power of suppliers, bargaining power of buyers, threat of substitutes, and competitive rivalry.

Strategic goals must be SMART: Specific, Measurable, Achievable, Relevant, and Time-bound.

Strategy implementation requires aligning resources, processes, and people. The Balanced Scorecard tracks performance across four perspectives: financial, customer, internal processes, and learning.','Conduct a SWOT analysis for a company or organisation you know. Present four points for each quadrant.','CEO: Our five-year strategy needs refreshing. The market has shifted dramatically.
Strategy Director: I agree. Our core product is being commoditised. We need to move up the value chain.
CEO: What does our SWOT tell us?
Director: Our main strength is brand trust - 20 years in the market. Main weakness is slow product innovation cycle.
CEO: Opportunities?
Director: Expansion into Central Asian markets and digital service offerings.
CEO: Threats?
Director: New Chinese competitors entering with aggressive pricing.
CEO: So our strategic direction should be premium positioning combined with regional expansion.','[{"en":"Strategy","ru":"Стратегия"},{"en":"SWOT","ru":"SWOT-анализ"},{"en":"Vision","ru":"Видение"},{"en":"Mission","ru":"Миссия"},{"en":"Competitive advantage","ru":"Конкурентное преимущество"},{"en":"Market","ru":"Рынок"},{"en":"Stakeholder","ru":"Заинтересованная сторона"},{"en":"Implementation","ru":"Реализация"},{"en":"Performance","ru":"Результативность"},{"en":"Growth","ru":"Рост"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c4000000-0000-0000-0000-000000000001','What does Leadership mean?','Управление','Лидерство','Делегирование','Мотивация','B'),
('c4000000-0000-0000-0000-000000000001','What does Autocratic mean?','Демократический','Авторитарный','Делегирующий','Преобразующий','B'),
('c4000000-0000-0000-0000-000000000001','What does Delegation mean?','Мотивация','Стратегия','Делегирование','Лидерство','C'),
('c4000000-0000-0000-0000-000000000001','What does Motivation mean?','Делегирование','Мотивация','Стратегия','Команда','B'),
('c4000000-0000-0000-0000-000000000001','Low survey score is for?','Strategy quality','Manager listens and empowerment','Team size','Budget','B'),
('c4000000-0000-0000-0000-000000000001','What feedback tool is recommended?','Annual review','360-degree feedback','Monthly survey','Peer assessment','B'),
('c4000000-0000-0000-0000-000000000001','How long does cultural change take?','6 months','1 year','18 to 36 months','5 years','C'),
('c4000000-0000-0000-0000-000000000001','What does Democratic mean?','Авторитарный','Попустительский','Демократический','Преобразующий','C'),
('c4000000-0000-0000-0000-000000000001','What does Empowerment mean?','Мотивация','Делегирование полномочий','Стратегия','Команда','B'),
('c4000000-0000-0000-0000-000000000001','What does Team mean?','Лидер','Стратегия','Команда','Решение','C'),
('c4000000-0000-0000-0000-000000000002','What does Milestone mean?','Риск','Бюджет','Веха','Спринт','C'),
('c4000000-0000-0000-0000-000000000002','What does Risk mean?','Бюджет','Риск','Объём','Срок','B'),
('c4000000-0000-0000-0000-000000000002','How behind schedule is the project?','One week','Two weeks','Three weeks','One month','B'),
('c4000000-0000-0000-0000-000000000002','What does Sprint mean?','Спринт','Веха','Риск','Результат','A'),
('c4000000-0000-0000-0000-000000000002','What does Scope mean?','Срок','Объём работ','Бюджет','Риск','B'),
('c4000000-0000-0000-0000-000000000002','Additional cost to recover the project?','$10,000','$20,000','$30,000','$50,000','C'),
('c4000000-0000-0000-0000-000000000002','What does Deliverable mean?','Спринт','Риск','Результат','Бюджет','C'),
('c4000000-0000-0000-0000-000000000002','What does Agile mean?','Гибкая методология','Водопадная','Традиционная','Последовательная','A'),
('c4000000-0000-0000-0000-000000000002','What does Budget mean?','Срок','Риск','Бюджет','Объём','C'),
('c4000000-0000-0000-0000-000000000002','What does Stakeholder mean?','Сотрудник','Клиент','Заинтересованная сторона','Менеджер','C'),
('c4000000-0000-0000-0000-000000000003','What does SWOT mean?','Стратегия','SWOT-анализ','Видение','Миссия','B'),
('c4000000-0000-0000-0000-000000000003','What does Vision mean?','Миссия','Стратегия','Видение','Рынок','C'),
('c4000000-0000-0000-0000-000000000003','Company strength in the dialogue?','Low costs','Brand trust (20 years)','Fast innovation','Digital presence','B'),
('c4000000-0000-0000-0000-000000000003','What does Growth mean?','Рынок','Конкуренция','Рост','Стратегия','C'),
('c4000000-0000-0000-0000-000000000003','Main threat in the dialogue?','Regulation','Chinese competitors','Economic downturn','Talent shortage','B'),
('c4000000-0000-0000-0000-000000000003','What does Performance mean?','Рост','Результативность','Рынок','Миссия','B'),
('c4000000-0000-0000-0000-000000000003','What does Market mean?','Стратегия','Рынок','Видение','Конкуренция','B'),
('c4000000-0000-0000-0000-000000000003','What does Strategy mean?','Тактика','Бюджет','Стратегия','Планирование','C'),
('c4000000-0000-0000-0000-000000000003','What does Mission mean?','Видение','Миссия','Стратегия','Цель','B'),
('c4000000-0000-0000-0000-000000000003','SMART goals: what does M stand for?','Manageable','Measurable','Motivating','Modern','B')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 15. FINANCE INDUSTRY LESSONS (3 - FULL)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c5000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000010','Introduction to Finance',1,'Foundations of Finance

Finance is the study and management of money, investments, and other financial instruments. It encompasses three main areas: personal finance, corporate finance, and public finance.

Personal finance involves individual budgeting, saving, investing, and managing debt. Key concepts include compound interest - earning interest on previously earned interest - and the time value of money, which states that money today is worth more than the same amount in the future.

Corporate finance deals with how companies raise capital, manage assets, and make investment decisions. The primary goal is to maximise shareholder value.

Public finance addresses government revenue (taxes) and expenditure (public services, infrastructure).

Financial literacy - the ability to understand and use financial knowledge effectively - is an essential life skill in the modern economy.','Explain the concept of compound interest in your own words. Why is it important for personal savings? Give a numerical example.','Financial advisor: You mentioned you want to start saving for retirement.
Client: Yes, I am 30 and have not started yet.
Advisor: Good news - you still have time. The power of compound interest is remarkable.
Client: How does that work?
Advisor: If you invest 50,000 tenge per month at 8% annual return, in 30 years you will have approximately 68 million tenge.
Client: From 50,000 per month?
Advisor: Yes. You contribute 18 million total, but compound growth does the rest.
Client: That is incredible. Where should I invest?
Advisor: A diversified portfolio: index funds for growth and bonds for stability.','[{"en":"Finance","ru":"Финансы"},{"en":"Investment","ru":"Инвестиция"},{"en":"Interest rate","ru":"Процентная ставка"},{"en":"Compound interest","ru":"Сложный процент"},{"en":"Portfolio","ru":"Портфель"},{"en":"Risk","ru":"Риск"},{"en":"Return","ru":"Доходность / Прибыль"},{"en":"Asset","ru":"Актив"},{"en":"Liability","ru":"Обязательство"},{"en":"Capital","ru":"Капитал"}]'),
('c5000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000010','Banking and Credit',2,'The Banking System

Banks are financial intermediaries that accept deposits from customers and use those funds to make loans. This intermediation function is central to economic activity.

Retail banks serve individuals and small businesses. Services include current accounts, savings accounts, mortgages, and consumer loans.

Investment banks help corporations and governments raise capital through issuing stocks and bonds. They also provide advisory services for mergers and acquisitions.

Credit is the ability to borrow money based on trustworthiness. A credit score reflects creditworthiness - the higher the score, the lower the interest rate typically offered.

Central banks, like the National Bank of Kazakhstan, control monetary policy, set interest rates, and regulate the banking system to maintain financial stability.','Compare a mortgage and a personal loan. What are the key differences? When would you use each? Write 150 words.','Bank manager: Good afternoon. I understand you''re interested in a home loan.
Customer: Yes. I want to buy an apartment for 25 million tenge. I have 5 million saved.
Manager: So you need a mortgage of 20 million. Your monthly income?
Customer: 450,000 tenge.
Manager: That gives a debt-to-income ratio of around 28%, which is acceptable. Our 20-year mortgage rate is currently 12.5% per annum.
Customer: What would my monthly payment be?
Manager: Approximately 230,000 tenge per month.
Customer: That is manageable. What documents do I need?
Manager: Passport, income certificate from your employer, and property documents.','[{"en":"Bank","ru":"Банк"},{"en":"Deposit","ru":"Вклад / Депозит"},{"en":"Loan","ru":"Кредит"},{"en":"Mortgage","ru":"Ипотека"},{"en":"Interest rate","ru":"Процентная ставка"},{"en":"Credit score","ru":"Кредитный рейтинг"},{"en":"Collateral","ru":"Залог"},{"en":"Repayment","ru":"Погашение"},{"en":"Account","ru":"Счёт"},{"en":"Overdraft","ru":"Овердрафт"}]'),
('c5000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000010','Financial Markets',3,'How Financial Markets Work

Financial markets are platforms where buyers and sellers trade financial assets such as stocks, bonds, currencies, and commodities.

The stock market allows companies to raise capital by issuing shares. Investors buy shares hoping their value will increase (capital gain) or to receive dividends.

The bond market involves debt securities. When you buy a bond, you are lending money to the issuer in exchange for regular interest payments and return of principal at maturity.

Foreign exchange (Forex) is the world''s largest financial market, where currencies are traded. Exchange rates are influenced by interest rates, inflation, and political stability.

Market volatility measures price fluctuations. Bull markets are periods of rising prices; bear markets are periods of declining prices.

Derivatives - like futures and options - are financial contracts whose value depends on an underlying asset.','Explain the difference between stocks and bonds as investments. Which is riskier and why? Write 150 words.','Trader: The market is moving against us. We are down 3% since this morning.
Risk manager: What is our exposure on the energy positions?
Trader: About 12 million in futures contracts. If oil drops another 5%, we trigger our stop-loss.
Risk manager: Hedge it. Buy put options on Brent crude.
Trader: At current prices that costs about 200,000.
Risk manager: Do it. That is cheap insurance.
Trader: Equity positions?
Risk manager: Hold. This looks like a temporary correction, not a trend reversal.
Trader: Markets close in 2 hours. Do you want me to rebalance the portfolio?
Risk manager: Just the energy hedge for now. We review everything at end of day.','[{"en":"Stock","ru":"Акция"},{"en":"Bond","ru":"Облигация"},{"en":"Dividend","ru":"Дивиденд"},{"en":"Market","ru":"Рынок"},{"en":"Volatility","ru":"Волатильность"},{"en":"Bull market","ru":"Рынок быков (рост)"},{"en":"Bear market","ru":"Рынок медведей (падение)"},{"en":"Forex","ru":"Форекс / Валютный рынок"},{"en":"Derivative","ru":"Производный инструмент"},{"en":"Portfolio","ru":"Портфель"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c5000000-0000-0000-0000-000000000001','What does Investment mean?','Риск','Инвестиция','Актив','Капитал','B'),
('c5000000-0000-0000-0000-000000000001','What does Compound interest mean?','Простой процент','Сложный процент','Процентная ставка','Доходность','B'),
('c5000000-0000-0000-0000-000000000001','What does Portfolio mean?','Актив','Обязательство','Портфель','Капитал','C'),
('c5000000-0000-0000-0000-000000000001','Monthly savings in the dialogue?','25,000','50,000','100,000','200,000','B'),
('c5000000-0000-0000-0000-000000000001','Approximate value after 30 years?','18 million','30 million','68 million','100 million','C'),
('c5000000-0000-0000-0000-000000000001','What does Return mean?','Риск','Доходность','Актив','Капитал','B'),
('c5000000-0000-0000-0000-000000000001','What does Capital mean?','Инвестиция','Доходность','Капитал','Портфель','C'),
('c5000000-0000-0000-0000-000000000001','What does Risk mean?','Доходность','Риск','Актив','Обязательство','B'),
('c5000000-0000-0000-0000-000000000001','What does Asset mean?','Обязательство','Риск','Актив','Капитал','C'),
('c5000000-0000-0000-0000-000000000001','What does Liability mean?','Актив','Обязательство','Доходность','Капитал','B'),
('c5000000-0000-0000-0000-000000000002','What does Mortgage mean?','Кредит','Депозит','Ипотека','Счёт','C'),
('c5000000-0000-0000-0000-000000000002','What does Deposit mean?','Кредит','Вклад','Ипотека','Залог','B'),
('c5000000-0000-0000-0000-000000000002','Apartment price in the dialogue?','15 million','20 million','25 million','30 million','C'),
('c5000000-0000-0000-0000-000000000002','What does Collateral mean?','Кредит','Залог','Счёт','Погашение','B'),
('c5000000-0000-0000-0000-000000000002','Monthly payment amount?','150,000','200,000','230,000','280,000','C'),
('c5000000-0000-0000-0000-000000000002','What does Credit score mean?','Банк','Кредитный рейтинг','Залог','Погашение','B'),
('c5000000-0000-0000-0000-000000000002','What does Loan mean?','Вклад','Ипотека','Кредит','Счёт','C'),
('c5000000-0000-0000-0000-000000000002','What does Repayment mean?','Вклад','Залог','Погашение','Процент','C'),
('c5000000-0000-0000-0000-000000000002','What does Account mean?','Кредит','Счёт','Залог','Процент','B'),
('c5000000-0000-0000-0000-000000000002','Mortgage rate in the dialogue?','10%','11.5%','12.5%','15%','C'),
('c5000000-0000-0000-0000-000000000003','What does Stock mean?','Облигация','Акция','Дивиденд','Портфель','B'),
('c5000000-0000-0000-0000-000000000003','What does Bond mean?','Акция','Облигация','Дивиденд','Форекс','B'),
('c5000000-0000-0000-0000-000000000003','What does Dividend mean?','Облигация','Акция','Дивиденд','Рынок','C'),
('c5000000-0000-0000-0000-000000000003','What is a Bull market?','Рынок падения','Рынок роста','Стабильный рынок','Волатильный рынок','B'),
('c5000000-0000-0000-0000-000000000003','What is a Bear market?','Рынок роста','Рынок падения','Стабильный рынок','Валютный рынок','B'),
('c5000000-0000-0000-0000-000000000003','Energy exposure in the dialogue?','5 million','8 million','12 million','20 million','C'),
('c5000000-0000-0000-0000-000000000003','What does Volatility mean?','Доходность','Волатильность','Риск','Портфель','B'),
('c5000000-0000-0000-0000-000000000003','What does Forex mean?','Форекс','Акция','Облигация','Дивиденд','A'),
('c5000000-0000-0000-0000-000000000003','What does Derivative mean?','Акция','Облигация','Производный инструмент','Портфель','C'),
('c5000000-0000-0000-0000-000000000003','What does Portfolio mean?','Акция','Облигация','Рынок','Портфель','D')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 16. SOCIAL SCIENCES LESSONS (3)
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c6000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000011','Sociology and Society',1,'Understanding Social Structures

Sociology is the scientific study of human society, social behaviour, and the institutions that shape our lives. It examines how social forces influence individuals and groups.

Key sociological concepts include social class - the hierarchical division of society based on wealth, education, and occupation - and social mobility, the ability to move between classes.

Sociologists use both qualitative methods (interviews, ethnography) and quantitative methods (surveys, statistics) to study social phenomena.

Emile Durkheim, one of the founders of sociology, studied social cohesion and the concept of anomie - a condition of normlessness that occurs during periods of rapid social change.

Max Weber introduced the concept of bureaucracy and studied how religious beliefs (the Protestant Ethic) influenced economic behaviour.','Explain the concept of social mobility. Is it easy or difficult to change social class in modern society? Write 150 words.','Professor: Today we examine the concept of social stratification. Who can explain it?
Student A: It is the hierarchical arrangement of society into layers based on wealth, status, and power.
Professor: Exactly. What factors determine which layer you belong to?
Student B: Traditionally, birth - who your parents are. But education and achievement also matter.
Professor: That distinction is important. In a caste system, your position is fixed at birth. In a class system, mobility is theoretically possible.
Student A: But is it really possible? Studies show social class is highly inherited.
Professor: You are right. The correlation between parents'' and children''s class is strong in most societies.','[{"en":"Society","ru":"Общество"},{"en":"Class","ru":"Класс"},{"en":"Inequality","ru":"Неравенство"},{"en":"Mobility","ru":"Мобильность"},{"en":"Institution","ru":"Институт"},{"en":"Culture","ru":"Культура"},{"en":"Norms","ru":"Нормы"},{"en":"Values","ru":"Ценности"},{"en":"Socialisation","ru":"Социализация"},{"en":"Identity","ru":"Идентичность"}]'),
('c6000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000011','Psychology and Behaviour',2,'Human Psychology

Psychology is the scientific study of the human mind and behaviour. It seeks to understand how we think, feel, and act.

Cognitive psychology examines mental processes like memory, perception, problem-solving, and language. Behavioural psychology focuses on observable behaviour and how it is shaped by the environment.

Sigmund Freud, the founder of psychoanalysis, proposed that unconscious processes drive much of our behaviour. His model of the mind - id (instinct), ego (reason), and superego (moral conscience) - remains influential.

Abraham Maslow''s hierarchy of needs proposes that humans are motivated by five levels of needs, from basic physiological needs to self-actualisation.

Cognitive biases - systematic errors in thinking - affect our decisions. Common biases include confirmation bias (favouring information that confirms existing beliefs) and the availability heuristic.','Choose one cognitive bias. Explain what it is, give a real-world example, and suggest how to overcome it. Write 150 words.','Therapist: Tell me about what has been troubling you lately.
Patient: I feel like everyone at work dislikes me. When I enter a room, conversations stop.
Therapist: That sounds distressing. Have you spoken to your colleagues about it?
Patient: No. I know what they think.
Therapist: How do you know?
Patient: I just do.
Therapist: This could be a cognitive distortion called mind reading - assuming we know others'' thoughts without evidence.
Patient: Maybe. But the feeling is very real.
Therapist: Feelings are real, but they are not always accurate reflections of reality. What concrete evidence do you have?
Patient: None, I suppose.','[{"en":"Psychology","ru":"Психология"},{"en":"Behaviour","ru":"Поведение"},{"en":"Mind","ru":"Разум / Психика"},{"en":"Emotion","ru":"Эмоция"},{"en":"Motivation","ru":"Мотивация"},{"en":"Perception","ru":"Восприятие"},{"en":"Memory","ru":"Память"},{"en":"Unconscious","ru":"Бессознательное"},{"en":"Bias","ru":"Предвзятость"},{"en":"Cognitive","ru":"Когнитивный"}]'),
('c6000000-0000-0000-0000-000000000003','a1000000-0000-0000-0000-000000000011','Political Science and Governance',3,'Understanding Political Systems

Political science studies how power is organised, distributed, and exercised in society.

Democratic systems are based on the principle that political authority derives from the people. In direct democracy, citizens vote on every issue. In representative democracy, elected officials make decisions on their behalf.

Authoritarian systems concentrate power in a single leader or party, limiting individual freedoms and political competition.

The separation of powers - dividing government into legislative (laws), executive (implements laws), and judicial (interprets laws) branches - prevents the concentration of power.

International relations examines how states interact: through diplomacy, trade, international organisations like the UN, and in some cases, conflict.

Political participation - voting, activism, civil society - is essential for healthy democracy.','Compare democratic and authoritarian political systems. What are the advantages and disadvantages of each? Write 200 words.','Political analyst: The election results show a significant shift toward populist parties.
Journalist: What is driving that?
Analyst: Economic anxiety, distrust of institutions, and the perception that elites are out of touch with ordinary people.
Journalist: Is this unique to one country?
Analyst: No, it is a global trend. We see it across Europe, Latin America, and parts of Asia.
Journalist: What does it mean for democratic institutions?
Analyst: It is a stress test. Populism can weaken checks and balances when leaders claim a popular mandate overrides institutional constraints.
Journalist: Should we be concerned?
Analyst: Concerned but not pessimistic. Democratic institutions have proven resilient historically. The key is an informed and engaged citizenry.','[{"en":"Democracy","ru":"Демократия"},{"en":"Government","ru":"Правительство"},{"en":"Policy","ru":"Политика"},{"en":"Election","ru":"Выборы"},{"en":"Parliament","ru":"Парламент"},{"en":"Legislation","ru":"Законодательство"},{"en":"Rights","ru":"Права"},{"en":"Constitution","ru":"Конституция"},{"en":"Citizen","ru":"Гражданин"},{"en":"Diplomacy","ru":"Дипломатия"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c6000000-0000-0000-0000-000000000001','What does Society mean?','Класс','Общество','Институт','Культура','B'),
('c6000000-0000-0000-0000-000000000001','What does Mobility mean?','Неравенство','Класс','Мобильность','Норма','C'),
('c6000000-0000-0000-0000-000000000001','What is anomie?','Social progress','Normlessness during rapid change','High mobility','Social inequality','B'),
('c6000000-0000-0000-0000-000000000001','What does Inequality mean?','Класс','Мобильность','Неравенство','Норма','C'),
('c6000000-0000-0000-0000-000000000001','What does Norms mean?','Ценности','Нормы','Идентичность','Культура','B'),
('c6000000-0000-0000-0000-000000000001','What does Values mean?','Нормы','Ценности','Идентичность','Институт','B'),
('c6000000-0000-0000-0000-000000000001','What does Identity mean?','Культура','Класс','Идентичность','Норма','C'),
('c6000000-0000-0000-0000-000000000001','What does Class mean?','Общество','Класс','Институт','Норма','B'),
('c6000000-0000-0000-0000-000000000001','What does Culture mean?','Норма','Ценность','Культура','Институт','C'),
('c6000000-0000-0000-0000-000000000001','What does Socialisation mean?','Мобильность','Неравенство','Класс','Социализация','D'),
('c6000000-0000-0000-0000-000000000002','What does Psychology mean?','Социология','Психология','Экономика','Политология','B'),
('c6000000-0000-0000-0000-000000000002','What does Behaviour mean?','Эмоция','Мотивация','Поведение','Восприятие','C'),
('c6000000-0000-0000-0000-000000000002','What does Motivation mean?','Память','Мотивация','Эмоция','Восприятие','B'),
('c6000000-0000-0000-0000-000000000002','What does Perception mean?','Память','Эмоция','Восприятие','Поведение','C'),
('c6000000-0000-0000-0000-000000000002','Cognitive distortion in the therapy dialogue?','Selective memory','Mind reading','Catastrophising','Projection','B'),
('c6000000-0000-0000-0000-000000000002','What does Memory mean?','Восприятие','Память','Эмоция','Разум','B'),
('c6000000-0000-0000-0000-000000000002','What does Bias mean?','Восприятие','Поведение','Предвзятость','Память','C'),
('c6000000-0000-0000-0000-000000000002','What does Unconscious mean?','Сознание','Бессознательное','Разум','Эмоция','B'),
('c6000000-0000-0000-0000-000000000002','What does Cognitive mean?','Эмоциональный','Поведенческий','Когнитивный','Мотивационный','C'),
('c6000000-0000-0000-0000-000000000002','Freud''s model layers are id, ego, and?','Superego','Subconscious','Self','Psyche','A'),
('c6000000-0000-0000-0000-000000000003','What does Democracy mean?','Авторитаризм','Демократия','Правительство','Конституция','B'),
('c6000000-0000-0000-0000-000000000003','What does Election mean?','Парламент','Выборы','Законодательство','Гражданин','B'),
('c6000000-0000-0000-0000-000000000003','What does Parliament mean?','Выборы','Конституция','Парламент','Дипломатия','C'),
('c6000000-0000-0000-0000-000000000003','Populism driver in the dialogue?','Economic growth','Economic anxiety and distrust','Foreign policy','Social inequality only','B'),
('c6000000-0000-0000-0000-000000000003','What does Constitution mean?','Парламент','Закон','Конституция','Право','C'),
('c6000000-0000-0000-0000-000000000003','What does Rights mean?','Обязанности','Права','Законы','Гражданство','B'),
('c6000000-0000-0000-0000-000000000003','What does Citizen mean?','Правительство','Избиратель','Гражданин','Политик','C'),
('c6000000-0000-0000-0000-000000000003','What does Diplomacy mean?','Война','Дипломатия','Политика','Торговля','B'),
('c6000000-0000-0000-0000-000000000003','What does Government mean?','Выборы','Правительство','Парламент','Конституция','B'),
('c6000000-0000-0000-0000-000000000003','What does Legislation mean?','Выборы','Права','Законодательство','Конституция','C')
ON CONFLICT DO NOTHING;

-- ===================================================
-- 17. LAW LESSONS 2 AND 3
-- ===================================================
INSERT INTO english_lessons (id, course_id, title, lesson_order, reading_text, writing_task, listening_transcript, vocabulary) VALUES
('c7000000-0000-0000-0000-000000000001','a1000000-0000-0000-0000-000000000012','Criminal Law Fundamentals',2,'Understanding Criminal Law

Criminal law defines conduct that is prohibited by society and sets out punishments for those who violate these prohibitions. Unlike civil law, which resolves disputes between private parties, criminal law involves the state prosecuting individuals on behalf of society.

For a crime to be established, two elements must typically be present: actus reus (the guilty act) and mens rea (the guilty mind or criminal intent). Both must be proven beyond reasonable doubt for a conviction.

Categories of crime include: felonies (serious crimes like murder and robbery) and misdemeanours (minor offences like traffic violations).

The criminal justice system involves law enforcement (police), prosecution, courts, and corrections (prisons and probation).

Defendants have fundamental rights: the presumption of innocence, the right to a fair trial, and the right to legal representation.','Explain the difference between actus reus and mens rea using a specific example. Why are both elements necessary to establish criminal liability?','Prosecutor: The evidence clearly shows the defendant was present at the scene.
Defense: Presence alone does not establish guilt. Where is the evidence of intent?
Prosecutor: We have phone records showing the defendant planned the robbery two weeks in advance.
Defense: Those messages are ambiguous. My client was joking with a friend.
Judge: Counsel, let us focus on the admissible evidence. Prosecutor, does the state have any direct witnesses?
Prosecutor: Yes, Your Honour. We have two eyewitnesses who will testify to seeing the defendant enter the premises.
Defense: We will challenge their credibility.
Judge: Noted. We will proceed with witness examination tomorrow morning.','[{"en":"Crime","ru":"Преступление"},{"en":"Defendant","ru":"Обвиняемый"},{"en":"Prosecutor","ru":"Прокурор"},{"en":"Conviction","ru":"Обвинительный приговор"},{"en":"Acquittal","ru":"Оправдательный приговор"},{"en":"Evidence","ru":"Доказательства"},{"en":"Sentence","ru":"Приговор"},{"en":"Witness","ru":"Свидетель"},{"en":"Jury","ru":"Присяжные"},{"en":"Appeal","ru":"Апелляция"}]'),
('c7000000-0000-0000-0000-000000000002','a1000000-0000-0000-0000-000000000012','Intellectual Property and Business Law',3,'Protecting Ideas: Intellectual Property Law

Intellectual property (IP) law protects creations of the mind. There are four main types: patents, trademarks, copyright, and trade secrets.

A patent grants an inventor exclusive rights to an invention for a limited period (usually 20 years). In exchange, the inventor publicly discloses the invention. Patents encourage innovation by providing commercial reward.

A trademark protects brand identifiers such as names, logos, and slogans. Unlike patents, trademarks can be renewed indefinitely.

Copyright protects original creative works such as books, music, films, and software. It arises automatically and lasts for the author''s life plus 70 years in most jurisdictions.

Trade secrets protect confidential business information (like formulas or processes) without registration, provided reasonable steps are taken to keep them secret.

IP infringement can result in injunctions, damages, and criminal penalties.','Compare patents and copyrights. What do they protect? How long do they last? Write 150 words.','Lawyer: Our client''s logo has been copied by a competitor.
Client: What can we do?
Lawyer: We have two options. First, a cease and desist letter demanding they stop immediately.
Client: What if they ignore it?
Lawyer: We file for an injunction in court. Given the similarity of the logos, we have a strong case.
Client: How long will the court process take?
Lawyer: An injunction hearing can happen within weeks if the infringement is causing active harm.
Client: What about compensation for the damage already done?
Lawyer: We can claim damages in a separate civil action. We need to quantify the financial harm - lost sales, brand dilution.
Client: What evidence do we need?
Lawyer: Screenshots, market research showing consumer confusion, and financial records.','[{"en":"Intellectual property","ru":"Интеллектуальная собственность"},{"en":"Patent","ru":"Патент"},{"en":"Trademark","ru":"Торговый знак"},{"en":"Copyright","ru":"Авторское право"},{"en":"Infringement","ru":"Нарушение"},{"en":"License","ru":"Лицензия"},{"en":"Contract","ru":"Контракт / Договор"},{"en":"Liability","ru":"Ответственность"},{"en":"Injunction","ru":"Судебный запрет"},{"en":"Damages","ru":"Возмещение ущерба"}]')
ON CONFLICT (id) DO NOTHING;

INSERT INTO english_quiz_questions (lesson_id, question, option_a, option_b, option_c, option_d, correct_answer) VALUES
('c7000000-0000-0000-0000-000000000001','What does Defendant mean?','Прокурор','Свидетель','Обвиняемый','Судья','C'),
('c7000000-0000-0000-0000-000000000001','What does Prosecutor mean?','Адвокат','Прокурор','Свидетель','Судья','B'),
('c7000000-0000-0000-0000-000000000001','What does Evidence mean?','Приговор','Апелляция','Доказательства','Свидетель','C'),
('c7000000-0000-0000-0000-000000000001','What is actus reus?','Criminal intent','The guilty act','The verdict','The sentence','B'),
('c7000000-0000-0000-0000-000000000001','What is mens rea?','The guilty act','Criminal intent','The evidence','The appeal','B'),
('c7000000-0000-0000-0000-000000000001','What does Conviction mean?','Оправдательный приговор','Апелляция','Обвинительный приговор','Арест','C'),
('c7000000-0000-0000-0000-000000000001','What does Witness mean?','Прокурор','Свидетель','Присяжные','Судья','B'),
('c7000000-0000-0000-0000-000000000001','What does Appeal mean?','Приговор','Доказательство','Апелляция','Арест','C'),
('c7000000-0000-0000-0000-000000000001','What does Acquittal mean?','Обвинение','Оправдательный приговор','Арест','Апелляция','B'),
('c7000000-0000-0000-0000-000000000001','What does Jury mean?','Судья','Прокурор','Присяжные','Адвокат','C'),
('c7000000-0000-0000-0000-000000000002','What does Patent mean?','Авторское право','Патент','Торговый знак','Лицензия','B'),
('c7000000-0000-0000-0000-000000000002','What does Trademark mean?','Патент','Авторское право','Торговый знак','Лицензия','C'),
('c7000000-0000-0000-0000-000000000002','What does Copyright mean?','Патент','Торговый знак','Лицензия','Авторское право','D'),
('c7000000-0000-0000-0000-000000000002','How long does a patent last?','10 years','15 years','20 years','30 years','C'),
('c7000000-0000-0000-0000-000000000002','What does Infringement mean?','Лицензия','Контракт','Нарушение','Судебный запрет','C'),
('c7000000-0000-0000-0000-000000000002','What does Injunction mean?','Возмещение ущерба','Судебный запрет','Апелляция','Лицензия','B'),
('c7000000-0000-0000-0000-000000000002','What does Damages mean?','Судебный запрет','Нарушение','Возмещение ущерба','Лицензия','C'),
('c7000000-0000-0000-0000-000000000002','First option for copied logo?','File a lawsuit','Cease and desist letter','Contact police','Apply for trademark','B'),
('c7000000-0000-0000-0000-000000000002','What does License mean?','Нарушение','Лицензия','Контракт','Патент','B'),
('c7000000-0000-0000-0000-000000000002','What does Contract mean?','Патент','Авторское право','Контракт','Лицензия','C')
ON CONFLICT DO NOTHING;
