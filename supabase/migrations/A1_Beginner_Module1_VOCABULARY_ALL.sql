-- ================================================================
-- A1 Beginner / Module 1 — VOCABULARY sections
-- ================================================================

-- Lesson 1: Meet & Greet — Verb To Be
UPDATE english_lesson_sections
SET content = '{
  "title": "Meet & Greet: Key Vocabulary",
  "words": [
    {"word": "student", "translation": "студент", "part_of_speech": "noun", "example": "I am a student at the university.", "example_translation": "Я студент в университете."},
    {"word": "professor", "translation": "профессор", "part_of_speech": "noun", "example": "He is a professor of mathematics.", "example_translation": "Он профессор математики."},
    {"word": "teacher", "translation": "преподаватель", "part_of_speech": "noun", "example": "She is my English teacher.", "example_translation": "Она мой преподаватель английского."},
    {"word": "university", "translation": "университет", "part_of_speech": "noun", "example": "This university is very modern.", "example_translation": "Этот университет очень современный."},
    {"word": "name", "translation": "имя, фамилия", "part_of_speech": "noun", "example": "My name is Asel.", "example_translation": "Меня зовут Асель."},
    {"word": "city", "translation": "город", "part_of_speech": "noun", "example": "Almaty is a large city.", "example_translation": "Алматы — большой город."},
    {"word": "country", "translation": "страна", "part_of_speech": "noun", "example": "Kazakhstan is a beautiful country.", "example_translation": "Казахстан — красивая страна."},
    {"word": "class", "translation": "занятие, урок", "part_of_speech": "noun", "example": "We are in English class now.", "example_translation": "Мы сейчас на занятии по английскому."},
    {"word": "group", "translation": "группа", "part_of_speech": "noun", "example": "Our group has fifteen students.", "example_translation": "В нашей группе пятнадцать студентов."},
    {"word": "classroom", "translation": "аудитория", "part_of_speech": "noun", "example": "The classroom is large and bright.", "example_translation": "Аудитория большая и светлая."},
    {"word": "am", "translation": "есть, являюсь (для I)", "part_of_speech": "verb", "example": "I am a first-year student.", "example_translation": "Я студент первого курса."},
    {"word": "is", "translation": "есть, является (для he/she/it)", "part_of_speech": "verb", "example": "She is from Almaty.", "example_translation": "Она из Алматы."},
    {"word": "are", "translation": "есть, являются (для we/you/they)", "part_of_speech": "verb", "example": "They are my classmates.", "example_translation": "Они мои одногруппники."},
    {"word": "from", "translation": "из, откуда", "part_of_speech": "preposition", "example": "I am from Kazakhstan.", "example_translation": "Я из Казахстана."},
    {"word": "classmate", "translation": "одногруппник", "part_of_speech": "noun", "example": "She is my classmate.", "example_translation": "Она моя одногруппница."},
    {"word": "colleague", "translation": "коллега", "part_of_speech": "noun", "example": "He is a colleague in our department.", "example_translation": "Он коллега на нашей кафедре."},
    {"word": "hello", "translation": "привет, здравствуйте", "part_of_speech": "interjection", "example": "Hello! My name is Asel.", "example_translation": "Здравствуйте! Меня зовут Асель."},
    {"word": "nice", "translation": "приятный, хороший", "part_of_speech": "adjective", "example": "Nice to meet you.", "example_translation": "Приятно познакомиться."},
    {"word": "meet", "translation": "встречать, знакомиться", "part_of_speech": "verb", "example": "I am pleased to meet you.", "example_translation": "Рад(а) познакомиться с вами."},
    {"word": "introduce", "translation": "представлять", "part_of_speech": "verb", "example": "Please introduce yourself to the group.", "example_translation": "Пожалуйста, представьтесь группе."},
    {"word": "morning", "translation": "утро", "part_of_speech": "noun", "example": "Good morning, Professor Smith.", "example_translation": "Доброе утро, профессор Смит."},
    {"word": "welcome", "translation": "добро пожаловать", "part_of_speech": "interjection", "example": "Welcome to the English programme.", "example_translation": "Добро пожаловать на программу по английскому."},
    {"word": "year", "translation": "год, курс", "part_of_speech": "noun", "example": "This is my first year at university.", "example_translation": "Это мой первый год в университете."},
    {"word": "first", "translation": "первый", "part_of_speech": "adjective", "example": "I am a first-year student.", "example_translation": "Я студент первого курса."},
    {"word": "pleased", "translation": "рад(а), доволен", "part_of_speech": "adjective", "example": "She is pleased to be at this university.", "example_translation": "Она рада быть в этом университете."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "student", "translation": "студент"},
        {"word": "professor", "translation": "профессор"},
        {"word": "university", "translation": "университет"},
        {"word": "classmate", "translation": "одногруппник"},
        {"word": "welcome", "translation": "добро пожаловать"},
        {"word": "introduce", "translation": "представлять"},
        {"word": "colleague", "translation": "коллега"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "I ___ a student at Nazarbayev University.", "answer": "am", "options": ["am", "is", "are", "be"]},
        {"id": 2, "text": "She ___ from Almaty.", "answer": "is", "options": ["am", "is", "are", "be"]},
        {"id": 3, "text": "We ___ in English class now.", "answer": "are", "options": ["am", "is", "are", "be"]},
        {"id": 4, "text": "My ___ is Asel Nurova.", "answer": "name", "options": ["name", "city", "group", "class"]},
        {"id": 5, "text": "Kazakhstan is a beautiful ___.", "answer": "country", "options": ["country", "city", "university", "group"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "student", "options": ["профессор", "студент", "коллега", "преподаватель"], "answer": "студент"},
        {"id": 2, "word": "classroom", "options": ["библиотека", "кампус", "аудитория", "лаборатория"], "answer": "аудитория"},
        {"id": 3, "word": "meet", "options": ["приходить", "знакомиться", "представлять", "приветствовать"], "answer": "знакомиться"},
        {"id": 4, "word": "first", "options": ["последний", "второй", "первый", "новый"], "answer": "первый"},
        {"id": 5, "word": "pleased", "options": ["расстроенный", "усталый", "рад", "занятой"], "answer": "рад"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 1
)
AND type = 'vocabulary';

-- Lesson 2: The Alphabet & Sounds — Articles a/an/the
UPDATE english_lesson_sections
SET content = '{
  "title": "The Alphabet & Articles: Key Vocabulary",
  "words": [
    {"word": "letter", "translation": "буква", "part_of_speech": "noun", "example": "The English alphabet has twenty-six letters.", "example_translation": "В английском алфавите двадцать шесть букв."},
    {"word": "sound", "translation": "звук", "part_of_speech": "noun", "example": "Each letter has a sound.", "example_translation": "Каждая буква имеет звук."},
    {"word": "vowel", "translation": "гласная", "part_of_speech": "noun", "example": "A, E, I, O, U are vowels.", "example_translation": "A, E, I, O, U — гласные."},
    {"word": "consonant", "translation": "согласная", "part_of_speech": "noun", "example": "B, C, D are consonants.", "example_translation": "B, C, D — согласные."},
    {"word": "alphabet", "translation": "алфавит", "part_of_speech": "noun", "example": "The English alphabet has twenty-six letters.", "example_translation": "В английском алфавите двадцать шесть букв."},
    {"word": "article", "translation": "артикль", "part_of_speech": "noun", "example": "The article a is used before consonant sounds.", "example_translation": "Артикль a используется перед согласными звуками."},
    {"word": "word", "translation": "слово", "part_of_speech": "noun", "example": "Write the new words in your notebook.", "example_translation": "Запишите новые слова в тетрадь."},
    {"word": "book", "translation": "книга, учебник", "part_of_speech": "noun", "example": "I have an English textbook.", "example_translation": "У меня есть учебник английского."},
    {"word": "pen", "translation": "ручка", "part_of_speech": "noun", "example": "I need a pen for the exam.", "example_translation": "Мне нужна ручка для экзамена."},
    {"word": "notebook", "translation": "тетрадь", "part_of_speech": "noun", "example": "Please write in your notebook.", "example_translation": "Пожалуйста, пишите в тетради."},
    {"word": "desk", "translation": "стол, парта", "part_of_speech": "noun", "example": "The pen is on the desk.", "example_translation": "Ручка на столе."},
    {"word": "board", "translation": "доска", "part_of_speech": "noun", "example": "The teacher writes on the board.", "example_translation": "Преподаватель пишет на доске."},
    {"word": "chair", "translation": "стул", "part_of_speech": "noun", "example": "The chair is comfortable.", "example_translation": "Стул удобный."},
    {"word": "dictionary", "translation": "словарь", "part_of_speech": "noun", "example": "I use a dictionary in class.", "example_translation": "Я использую словарь на занятии."},
    {"word": "page", "translation": "страница", "part_of_speech": "noun", "example": "Open the book to page ten.", "example_translation": "Откройте книгу на странице десять."},
    {"word": "sentence", "translation": "предложение", "part_of_speech": "noun", "example": "Write a sentence with the new word.", "example_translation": "Напишите предложение с новым словом."},
    {"word": "question", "translation": "вопрос", "part_of_speech": "noun", "example": "The professor asks a question.", "example_translation": "Профессор задаёт вопрос."},
    {"word": "answer", "translation": "ответ", "part_of_speech": "noun", "example": "I know the answer.", "example_translation": "Я знаю ответ."},
    {"word": "example", "translation": "пример", "part_of_speech": "noun", "example": "Give an example of an article.", "example_translation": "Приведите пример артикля."},
    {"word": "exercise", "translation": "упражнение", "part_of_speech": "noun", "example": "Complete the exercise on page five.", "example_translation": "Выполните упражнение на странице пять."},
    {"word": "read", "translation": "читать", "part_of_speech": "verb", "example": "We read an article in class.", "example_translation": "Мы читаем статью на занятии."},
    {"word": "write", "translation": "писать", "part_of_speech": "verb", "example": "Please write the answer.", "example_translation": "Пожалуйста, запишите ответ."},
    {"word": "listen", "translation": "слушать", "part_of_speech": "verb", "example": "Listen to the recording carefully.", "example_translation": "Внимательно слушайте запись."},
    {"word": "repeat", "translation": "повторять", "part_of_speech": "verb", "example": "Please repeat the word after me.", "example_translation": "Пожалуйста, повторите слово за мной."},
    {"word": "study", "translation": "учиться, изучать", "part_of_speech": "verb", "example": "I study English at university.", "example_translation": "Я изучаю английский в университете."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "letter", "translation": "буква"},
        {"word": "vowel", "translation": "гласная"},
        {"word": "consonant", "translation": "согласная"},
        {"word": "dictionary", "translation": "словарь"},
        {"word": "sentence", "translation": "предложение"},
        {"word": "exercise", "translation": "упражнение"},
        {"word": "alphabet", "translation": "алфавит"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "I need ___ pen for the exam.", "answer": "a", "options": ["a", "an", "the", "—"]},
        {"id": 2, "text": "She is ___ engineer at the research centre.", "answer": "an", "options": ["a", "an", "the", "—"]},
        {"id": 3, "text": "Please open ___ textbook to page ten.", "answer": "the", "options": ["a", "an", "the", "—"]},
        {"id": 4, "text": "A, E, I, O, U are ___ in English.", "answer": "vowels", "options": ["vowels", "consonants", "letters", "articles"]},
        {"id": 5, "text": "Please ___ the new words in your notebook.", "answer": "write", "options": ["write", "read", "listen", "repeat"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "alphabet", "options": ["словарь", "алфавит", "артикль", "учебник"], "answer": "алфавит"},
        {"id": 2, "word": "sentence", "options": ["слово", "буква", "предложение", "страница"], "answer": "предложение"},
        {"id": 3, "word": "answer", "options": ["вопрос", "пример", "упражнение", "ответ"], "answer": "ответ"},
        {"id": 4, "word": "read", "options": ["писать", "слушать", "читать", "повторять"], "answer": "читать"},
        {"id": 5, "word": "study", "options": ["работать", "учиться", "отдыхать", "говорить"], "answer": "учиться"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 2
)
AND type = 'vocabulary';

-- Lesson 3: This or That? — This/That/These/Those
UPDATE english_lesson_sections
SET content = '{
  "title": "Demonstratives & Campus Vocabulary",
  "words": [
    {"word": "this", "translation": "этот/эта/это (рядом)", "part_of_speech": "pronoun", "example": "This classroom is modern.", "example_translation": "Эта аудитория современная."},
    {"word": "that", "translation": "тот/та/то (вдали)", "part_of_speech": "pronoun", "example": "That building is the main library.", "example_translation": "То здание — главная библиотека."},
    {"word": "these", "translation": "эти (рядом)", "part_of_speech": "pronoun", "example": "These books are for beginners.", "example_translation": "Эти книги для начинающих."},
    {"word": "those", "translation": "те (вдали)", "part_of_speech": "pronoun", "example": "Those students are from Astana.", "example_translation": "Те студенты из Астаны."},
    {"word": "here", "translation": "здесь, тут", "part_of_speech": "adverb", "example": "The professor is here.", "example_translation": "Профессор здесь."},
    {"word": "there", "translation": "там", "part_of_speech": "adverb", "example": "The library is there.", "example_translation": "Библиотека там."},
    {"word": "near", "translation": "близко, рядом", "part_of_speech": "adjective", "example": "The cafeteria is near the library.", "example_translation": "Кафетерий находится рядом с библиотекой."},
    {"word": "far", "translation": "далеко", "part_of_speech": "adjective", "example": "The sports complex is far from here.", "example_translation": "Спортивный комплекс далеко отсюда."},
    {"word": "library", "translation": "библиотека", "part_of_speech": "noun", "example": "I study in the library every day.", "example_translation": "Я занимаюсь в библиотеке каждый день."},
    {"word": "building", "translation": "здание", "part_of_speech": "noun", "example": "The main building is very tall.", "example_translation": "Главное здание очень высокое."},
    {"word": "campus", "translation": "кампус", "part_of_speech": "noun", "example": "Our campus has modern buildings.", "example_translation": "Наш кампус имеет современные здания."},
    {"word": "hall", "translation": "зал, коридор", "part_of_speech": "noun", "example": "The lecture hall is on the second floor.", "example_translation": "Лекционный зал на втором этаже."},
    {"word": "room", "translation": "комната, аудитория", "part_of_speech": "noun", "example": "The seminar room is small.", "example_translation": "Семинарская аудитория маленькая."},
    {"word": "office", "translation": "кабинет, офис", "part_of_speech": "noun", "example": "The professor is in the office.", "example_translation": "Профессор в кабинете."},
    {"word": "laboratory", "translation": "лаборатория", "part_of_speech": "noun", "example": "This laboratory is very modern.", "example_translation": "Эта лаборатория очень современная."},
    {"word": "cafeteria", "translation": "кафетерий, столовая", "part_of_speech": "noun", "example": "The cafeteria is near the library.", "example_translation": "Кафетерий рядом с библиотекой."},
    {"word": "window", "translation": "окно", "part_of_speech": "noun", "example": "The window is large and clean.", "example_translation": "Окно большое и чистое."},
    {"word": "door", "translation": "дверь", "part_of_speech": "noun", "example": "Please close the door.", "example_translation": "Пожалуйста, закройте дверь."},
    {"word": "floor", "translation": "этаж, пол", "part_of_speech": "noun", "example": "The office is on the third floor.", "example_translation": "Кабинет на третьем этаже."},
    {"word": "map", "translation": "карта, план", "part_of_speech": "noun", "example": "This is a map of the campus.", "example_translation": "Это план кампуса."},
    {"word": "close", "translation": "закрывать", "part_of_speech": "verb", "example": "Close the door, please.", "example_translation": "Закройте дверь, пожалуйста."},
    {"word": "open", "translation": "открывать", "part_of_speech": "verb", "example": "Open your textbooks to page five.", "example_translation": "Откройте учебники на странице пять."},
    {"word": "show", "translation": "показывать", "part_of_speech": "verb", "example": "Can you show me the library?", "example_translation": "Вы можете показать мне библиотеку?"},
    {"word": "look", "translation": "смотреть", "part_of_speech": "verb", "example": "Look at the board.", "example_translation": "Посмотрите на доску."},
    {"word": "next to", "translation": "рядом с", "part_of_speech": "preposition", "example": "The office is next to the laboratory.", "example_translation": "Кабинет рядом с лабораторией."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "library", "translation": "библиотека"},
        {"word": "campus", "translation": "кампус"},
        {"word": "laboratory", "translation": "лаборатория"},
        {"word": "cafeteria", "translation": "кафетерий"},
        {"word": "near", "translation": "рядом"},
        {"word": "far", "translation": "далеко"},
        {"word": "floor", "translation": "этаж"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "___ classroom is large and modern. (nearby)", "answer": "This", "options": ["This", "That", "These", "Those"]},
        {"id": 2, "text": "___ building across the street is the library. (far)", "answer": "That", "options": ["This", "That", "These", "Those"]},
        {"id": 3, "text": "___ books here are for our course. (nearby, plural)", "answer": "These", "options": ["This", "That", "These", "Those"]},
        {"id": 4, "text": "The office is on the second ___.", "answer": "floor", "options": ["floor", "room", "door", "hall"]},
        {"id": 5, "text": "I study in the ___ every day.", "answer": "library", "options": ["library", "cafeteria", "campus", "office"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "building", "options": ["кабинет", "здание", "коридор", "кампус"], "answer": "здание"},
        {"id": 2, "word": "here", "options": ["там", "рядом", "здесь", "далеко"], "answer": "здесь"},
        {"id": 3, "word": "office", "options": ["лаборатория", "аудитория", "кабинет", "зал"], "answer": "кабинет"},
        {"id": 4, "word": "open", "options": ["закрывать", "открывать", "показывать", "смотреть"], "answer": "открывать"},
        {"id": 5, "word": "those", "options": ["эти", "этот", "тот", "те"], "answer": "те"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 3
)
AND type = 'vocabulary';

-- Lesson 4: One or Many? — Singular & Plural Nouns
UPDATE english_lesson_sections
SET content = '{
  "title": "Singular & Plural: Key Vocabulary",
  "words": [
    {"word": "noun", "translation": "существительное", "part_of_speech": "noun", "example": "Student is a noun.", "example_translation": "Student — существительное."},
    {"word": "singular", "translation": "единственное число", "part_of_speech": "noun", "example": "Book is in the singular form.", "example_translation": "Book — форма единственного числа."},
    {"word": "plural", "translation": "множественное число", "part_of_speech": "noun", "example": "Books is the plural of book.", "example_translation": "Books — множественное число от book."},
    {"word": "regular", "translation": "правильный, регулярный", "part_of_speech": "adjective", "example": "Most nouns have a regular plural form.", "example_translation": "Большинство существительных имеет правильную форму множественного числа."},
    {"word": "irregular", "translation": "неправильный, нерегулярный", "part_of_speech": "adjective", "example": "Child has an irregular plural form.", "example_translation": "Child имеет неправильную форму множественного числа."},
    {"word": "rule", "translation": "правило", "part_of_speech": "noun", "example": "There is a rule for plural nouns.", "example_translation": "Есть правило для множественных существительных."},
    {"word": "exception", "translation": "исключение", "part_of_speech": "noun", "example": "Sheep is an exception to the rule.", "example_translation": "Sheep — исключение из правила."},
    {"word": "form", "translation": "форма", "part_of_speech": "noun", "example": "The plural form of man is men.", "example_translation": "Форма множественного числа от man — men."},
    {"word": "child", "translation": "ребёнок", "part_of_speech": "noun", "example": "One child is in the library.", "example_translation": "Один ребёнок в библиотеке."},
    {"word": "children", "translation": "дети", "part_of_speech": "noun", "example": "Many children study English.", "example_translation": "Многие дети изучают английский."},
    {"word": "man", "translation": "мужчина", "part_of_speech": "noun", "example": "One man is a professor.", "example_translation": "Один мужчина — профессор."},
    {"word": "men", "translation": "мужчины", "part_of_speech": "noun", "example": "Two men work in the department.", "example_translation": "Двое мужчин работают на кафедре."},
    {"word": "woman", "translation": "женщина", "part_of_speech": "noun", "example": "One woman is a researcher.", "example_translation": "Одна женщина — исследователь."},
    {"word": "women", "translation": "женщины", "part_of_speech": "noun", "example": "Three women are in the group.", "example_translation": "Три женщины в группе."},
    {"word": "person", "translation": "человек, личность", "part_of_speech": "noun", "example": "One person in the group.", "example_translation": "Один человек в группе."},
    {"word": "people", "translation": "люди", "part_of_speech": "noun", "example": "Many people study at this university.", "example_translation": "Много людей учатся в этом университете."},
    {"word": "tooth", "translation": "зуб", "part_of_speech": "noun", "example": "Tooth has the irregular plural teeth.", "example_translation": "Tooth имеет неправильное множественное число teeth."},
    {"word": "teeth", "translation": "зубы", "part_of_speech": "noun", "example": "Teeth is the plural of tooth.", "example_translation": "Teeth — множественное число от tooth."},
    {"word": "country", "translation": "страна", "part_of_speech": "noun", "example": "Two countries are in Central Asia.", "example_translation": "Две страны находятся в Центральной Азии."},
    {"word": "cities", "translation": "города (мн.ч.)", "part_of_speech": "noun", "example": "Two cities in Kazakhstan are Almaty and Astana.", "example_translation": "Два города Казахстана — Алматы и Астана."},
    {"word": "universities", "translation": "университеты (мн.ч.)", "part_of_speech": "noun", "example": "Two universities are in the capital.", "example_translation": "Два университета находятся в столице."},
    {"word": "libraries", "translation": "библиотеки (мн.ч.)", "part_of_speech": "noun", "example": "These libraries have many books.", "example_translation": "Эти библиотеки имеют много книг."},
    {"word": "classes", "translation": "занятия (мн.ч.)", "part_of_speech": "noun", "example": "My classes start at eight.", "example_translation": "Мои занятия начинаются в восемь."},
    {"word": "sheep", "translation": "овца/овцы (не изменяется)", "part_of_speech": "noun", "example": "One sheep and two sheep — the form is the same.", "example_translation": "Одна овца и две овцы — форма одинакова."},
    {"word": "add", "translation": "добавлять", "part_of_speech": "verb", "example": "Add -s to most nouns to make the plural.", "example_translation": "Добавьте -s к большинству существительных для образования множественного числа."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the singular to its plural form",
      "pairs": [
        {"word": "child", "translation": "children"},
        {"word": "man", "translation": "men"},
        {"word": "woman", "translation": "women"},
        {"word": "person", "translation": "people"},
        {"word": "tooth", "translation": "teeth"},
        {"word": "country", "translation": "countries"},
        {"word": "class", "translation": "classes"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "Most nouns follow a ___ rule for the plural.", "answer": "regular", "options": ["regular", "irregular", "singular", "plural"]},
        {"id": 2, "text": "The plural of man is ___.", "answer": "men", "options": ["mans", "men", "manes", "peoples"]},
        {"id": 3, "text": "Many ___ study at this university.", "answer": "people", "options": ["person", "people", "peoples", "mans"]},
        {"id": 4, "text": "Sheep is an ___ to the plural rule.", "answer": "exception", "options": ["rule", "form", "exception", "plural"]},
        {"id": 5, "text": "One child, many ___.", "answer": "children", "options": ["childs", "childrens", "children", "peoples"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "singular", "options": ["множественное число", "единственное число", "правило", "форма"], "answer": "единственное число"},
        {"id": 2, "word": "exception", "options": ["правило", "форма", "исключение", "число"], "answer": "исключение"},
        {"id": 3, "word": "women", "options": ["мужчины", "люди", "дети", "женщины"], "answer": "женщины"},
        {"id": 4, "word": "irregular", "options": ["правильный", "регулярный", "неправильный", "простой"], "answer": "неправильный"},
        {"id": 5, "word": "add", "options": ["убирать", "менять", "добавлять", "повторять"], "answer": "добавлять"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 4
)
AND type = 'vocabulary';

-- Lesson 5: Describing Things — Adjectives
UPDATE english_lesson_sections
SET content = '{
  "title": "Adjectives: Describing University Life",
  "words": [
    {"word": "adjective", "translation": "прилагательное", "part_of_speech": "noun", "example": "Beautiful is an adjective.", "example_translation": "Beautiful — это прилагательное."},
    {"word": "large", "translation": "большой, крупный", "part_of_speech": "adjective", "example": "The library is large.", "example_translation": "Библиотека большая."},
    {"word": "small", "translation": "маленький", "part_of_speech": "adjective", "example": "The seminar room is small.", "example_translation": "Семинарская аудитория маленькая."},
    {"word": "modern", "translation": "современный", "part_of_speech": "adjective", "example": "Our university is modern.", "example_translation": "Наш университет современный."},
    {"word": "old", "translation": "старый", "part_of_speech": "adjective", "example": "Those books are old.", "example_translation": "Те книги старые."},
    {"word": "new", "translation": "новый", "part_of_speech": "adjective", "example": "I have a new notebook.", "example_translation": "У меня новая тетрадь."},
    {"word": "beautiful", "translation": "красивый", "part_of_speech": "adjective", "example": "Almaty is a beautiful city.", "example_translation": "Алматы — красивый город."},
    {"word": "interesting", "translation": "интересный", "part_of_speech": "adjective", "example": "This lecture is very interesting.", "example_translation": "Эта лекция очень интересная."},
    {"word": "important", "translation": "важный", "part_of_speech": "adjective", "example": "English is an important language.", "example_translation": "Английский — важный язык."},
    {"word": "difficult", "translation": "сложный, трудный", "part_of_speech": "adjective", "example": "The exam is difficult.", "example_translation": "Экзамен сложный."},
    {"word": "easy", "translation": "лёгкий, простой", "part_of_speech": "adjective", "example": "The exercise is easy.", "example_translation": "Упражнение лёгкое."},
    {"word": "good", "translation": "хороший", "part_of_speech": "adjective", "example": "She is a good student.", "example_translation": "Она хорошая студентка."},
    {"word": "bright", "translation": "светлый; умный", "part_of_speech": "adjective", "example": "The classroom is bright.", "example_translation": "Аудитория светлая."},
    {"word": "quiet", "translation": "тихий", "part_of_speech": "adjective", "example": "The library is quiet.", "example_translation": "Библиотека тихая."},
    {"word": "comfortable", "translation": "удобный", "part_of_speech": "adjective", "example": "The chairs are comfortable.", "example_translation": "Стулья удобные."},
    {"word": "friendly", "translation": "дружелюбный", "part_of_speech": "adjective", "example": "My classmates are friendly.", "example_translation": "Мои одногруппники дружелюбные."},
    {"word": "hardworking", "translation": "трудолюбивый", "part_of_speech": "adjective", "example": "The students are hardworking.", "example_translation": "Студенты трудолюбивые."},
    {"word": "academic", "translation": "академический", "part_of_speech": "adjective", "example": "This is an academic programme.", "example_translation": "Это академическая программа."},
    {"word": "significant", "translation": "значительный, важный", "part_of_speech": "adjective", "example": "The results are significant.", "example_translation": "Результаты значительные."},
    {"word": "clear", "translation": "ясный, понятный", "part_of_speech": "adjective", "example": "The explanation is clear.", "example_translation": "Объяснение понятное."},
    {"word": "well-equipped", "translation": "хорошо оснащённый", "part_of_speech": "adjective", "example": "The laboratory is well-equipped.", "example_translation": "Лаборатория хорошо оснащена."},
    {"word": "tall", "translation": "высокий", "part_of_speech": "adjective", "example": "The main building is tall.", "example_translation": "Главное здание высокое."},
    {"word": "busy", "translation": "занятой, оживлённый", "part_of_speech": "adjective", "example": "The campus is busy today.", "example_translation": "Кампус сегодня оживлённый."},
    {"word": "precise", "translation": "точный", "part_of_speech": "adjective", "example": "Use precise adjectives in academic writing.", "example_translation": "Используйте точные прилагательные в академическом письме."},
    {"word": "describe", "translation": "описывать", "part_of_speech": "verb", "example": "Describe the university in three adjectives.", "example_translation": "Опишите университет тремя прилагательными."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the adjective to its translation",
      "pairs": [
        {"word": "modern", "translation": "современный"},
        {"word": "comfortable", "translation": "удобный"},
        {"word": "difficult", "translation": "сложный"},
        {"word": "friendly", "translation": "дружелюбный"},
        {"word": "significant", "translation": "значительный"},
        {"word": "quiet", "translation": "тихий"},
        {"word": "hardworking", "translation": "трудолюбивый"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct adjective",
      "sentences": [
        {"id": 1, "text": "The library is ___ — there is no noise.", "answer": "quiet", "options": ["quiet", "busy", "tall", "bright"]},
        {"id": 2, "text": "Our university is very ___.", "answer": "modern", "options": ["old", "small", "modern", "difficult"]},
        {"id": 3, "text": "The exam is ___ but I am ready.", "answer": "difficult", "options": ["easy", "difficult", "quiet", "clear"]},
        {"id": 4, "text": "My classmates are very ___.", "answer": "friendly", "options": ["busy", "tall", "friendly", "significant"]},
        {"id": 5, "text": "In academic writing, use ___ adjectives.", "answer": "precise", "options": ["old", "good", "precise", "easy"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "important", "options": ["сложный", "лёгкий", "важный", "новый"], "answer": "важный"},
        {"id": 2, "word": "comfortable", "options": ["удобный", "тихий", "светлый", "высокий"], "answer": "удобный"},
        {"id": 3, "word": "describe", "options": ["добавлять", "описывать", "изучать", "повторять"], "answer": "описывать"},
        {"id": 4, "word": "bright", "options": ["тёмный", "тихий", "светлый", "занятой"], "answer": "светлый"},
        {"id": 5, "word": "academic", "options": ["личный", "городской", "академический", "новый"], "answer": "академический"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 5
)
AND type = 'vocabulary';


-- Lesson 7: Contractions
UPDATE english_lesson_sections
SET content = '{
  "title": "Contractions: Short Forms in English",
  "words": [
    {"word": "contraction", "translation": "сокращение", "part_of_speech": "noun", "example": "I''m is a contraction of I am.", "example_translation": "I''m — это сокращение от I am."},
    {"word": "apostrophe", "translation": "апостроф", "part_of_speech": "noun", "example": "We use an apostrophe in contractions.", "example_translation": "Мы используем апостроф в сокращениях."},
    {"word": "informal", "translation": "неформальный", "part_of_speech": "adjective", "example": "Contractions are used in informal speech.", "example_translation": "Сокращения используются в неформальной речи."},
    {"word": "formal", "translation": "формальный", "part_of_speech": "adjective", "example": "Academic writing is formal.", "example_translation": "Академическое письмо — формальное."},
    {"word": "full form", "translation": "полная форма", "part_of_speech": "noun", "example": "The full form of don''t is do not.", "example_translation": "Полная форма don''t — do not."},
    {"word": "short form", "translation": "краткая форма", "part_of_speech": "noun", "example": "I''m is the short form of I am.", "example_translation": "I''m — краткая форма от I am."},
    {"word": "missing", "translation": "отсутствующий, пропущенный", "part_of_speech": "adjective", "example": "The apostrophe shows missing letters.", "example_translation": "Апостроф показывает пропущенные буквы."},
    {"word": "spoken", "translation": "устный, разговорный", "part_of_speech": "adjective", "example": "Contractions are common in spoken English.", "example_translation": "Сокращения распространены в устном английском."},
    {"word": "written", "translation": "письменный", "part_of_speech": "adjective", "example": "In written academic work, use full forms.", "example_translation": "В письменных академических работах используйте полные формы."},
    {"word": "I''m", "translation": "я (сокр. от I am)", "part_of_speech": "pronoun + verb", "example": "I''m a first-year student.", "example_translation": "Я студент первого курса."},
    {"word": "you''re", "translation": "ты/вы есть (сокр. от you are)", "part_of_speech": "pronoun + verb", "example": "You''re in the right classroom.", "example_translation": "Вы в правильной аудитории."},
    {"word": "he''s", "translation": "он есть (сокр. от he is)", "part_of_speech": "pronoun + verb", "example": "He''s a professor of linguistics.", "example_translation": "Он профессор лингвистики."},
    {"word": "she''s", "translation": "она есть (сокр. от she is)", "part_of_speech": "pronoun + verb", "example": "She''s from Almaty.", "example_translation": "Она из Алматы."},
    {"word": "it''s", "translation": "это есть (сокр. от it is)", "part_of_speech": "pronoun + verb", "example": "It''s an important lecture.", "example_translation": "Это важная лекция."},
    {"word": "we''re", "translation": "мы есть (сокр. от we are)", "part_of_speech": "pronoun + verb", "example": "We''re in English class.", "example_translation": "Мы на занятии по английскому."},
    {"word": "they''re", "translation": "они есть (сокр. от they are)", "part_of_speech": "pronoun + verb", "example": "They''re my classmates.", "example_translation": "Они мои одногруппники."},
    {"word": "don''t", "translation": "не делать (сокр. от do not)", "part_of_speech": "verb", "example": "I don''t understand this word.", "example_translation": "Я не понимаю это слово."},
    {"word": "can''t", "translation": "не могу (сокр. от cannot)", "part_of_speech": "verb", "example": "She can''t attend the lecture today.", "example_translation": "Она не может посетить лекцию сегодня."},
    {"word": "isn''t", "translation": "не есть (сокр. от is not)", "part_of_speech": "verb", "example": "This isn''t the right classroom.", "example_translation": "Это не та аудитория."},
    {"word": "won''t", "translation": "не буду (сокр. от will not)", "part_of_speech": "verb", "example": "She won''t miss the seminar.", "example_translation": "Она не пропустит семинар."},
    {"word": "haven''t", "translation": "не имею (сокр. от have not)", "part_of_speech": "verb", "example": "I haven''t read this book yet.", "example_translation": "Я ещё не читал(а) эту книгу."},
    {"word": "didn''t", "translation": "не делал (сокр. от did not)", "part_of_speech": "verb", "example": "He didn''t submit the assignment.", "example_translation": "Он не сдал задание."},
    {"word": "doesn''t", "translation": "не делает (сокр. от does not)", "part_of_speech": "verb", "example": "She doesn''t study on Sundays.", "example_translation": "Она не занимается по воскресеньям."},
    {"word": "its", "translation": "его, её (притяжательное)", "part_of_speech": "pronoun", "example": "The university has its own library.", "example_translation": "Университет имеет собственную библиотеку."},
    {"word": "prefer", "translation": "предпочитать", "part_of_speech": "verb", "example": "We prefer full forms in academic writing.", "example_translation": "Мы предпочитаем полные формы в академическом письме."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the contraction to its full form",
      "pairs": [
        {"word": "I''m", "translation": "I am"},
        {"word": "you''re", "translation": "you are"},
        {"word": "don''t", "translation": "do not"},
        {"word": "can''t", "translation": "cannot"},
        {"word": "isn''t", "translation": "is not"},
        {"word": "haven''t", "translation": "have not"},
        {"word": "didn''t", "translation": "did not"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct contraction or full form",
      "sentences": [
        {"id": 1, "text": "___ a first-year student at this university.", "answer": "I''m", "options": ["I''m", "I is", "I are", "I be"]},
        {"id": 2, "text": "She ___ attend the lecture today. (formal)", "answer": "cannot", "options": ["cannot", "can''t", "not can", "no can"]},
        {"id": 3, "text": "They ___ my classmates.", "answer": "are", "options": ["are", "they''re", "is", "am"]},
        {"id": 4, "text": "An apostrophe shows ___ letters.", "answer": "missing", "options": ["missing", "extra", "capital", "plural"]},
        {"id": 5, "text": "Contractions are common in ___ English.", "answer": "spoken", "options": ["spoken", "written", "formal", "academic"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct full form",
      "questions": [
        {"id": 1, "word": "don''t", "options": ["do not", "does not", "did not", "will not"], "answer": "do not"},
        {"id": 2, "word": "can''t", "options": ["could not", "will not", "cannot", "do not"], "answer": "cannot"},
        {"id": 3, "word": "won''t", "options": ["would not", "was not", "were not", "will not"], "answer": "will not"},
        {"id": 4, "word": "haven''t", "options": ["has not", "had not", "have not", "did not"], "answer": "have not"},
        {"id": 5, "word": "isn''t", "options": ["are not", "am not", "is not", "was not"], "answer": "is not"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 7
)
AND type = 'vocabulary';

-- Lesson 8: Pronunciation & Sounds — Phonetics
UPDATE english_lesson_sections
SET content = '{
  "title": "Phonetics: Sounds of English",
  "words": [
    {"word": "phoneme", "translation": "фонема", "part_of_speech": "noun", "example": "English has forty-four phonemes.", "example_translation": "В английском языке сорок четыре фонемы."},
    {"word": "phonetics", "translation": "фонетика", "part_of_speech": "noun", "example": "We study phonetics in this course.", "example_translation": "Мы изучаем фонетику на этом курсе."},
    {"word": "stress", "translation": "ударение", "part_of_speech": "noun", "example": "The stress in university is on the third syllable.", "example_translation": "Ударение в слове university падает на третий слог."},
    {"word": "syllable", "translation": "слог", "part_of_speech": "noun", "example": "The word student has two syllables.", "example_translation": "В слове student два слога."},
    {"word": "silent", "translation": "немой, не произносимый", "part_of_speech": "adjective", "example": "The K in knife is silent.", "example_translation": "K в слове knife не произносится."},
    {"word": "pronounce", "translation": "произносить", "part_of_speech": "verb", "example": "How do you pronounce this word?", "example_translation": "Как произносится это слово?"},
    {"word": "pronunciation", "translation": "произношение", "part_of_speech": "noun", "example": "Good pronunciation is important.", "example_translation": "Хорошее произношение важно."},
    {"word": "symbol", "translation": "символ", "part_of_speech": "noun", "example": "Phonetic symbols are in the dictionary.", "example_translation": "Фонетические символы есть в словаре."},
    {"word": "accent", "translation": "акцент, ударение", "part_of_speech": "noun", "example": "She has a British accent.", "example_translation": "У неё британский акцент."},
    {"word": "intonation", "translation": "интонация", "part_of_speech": "noun", "example": "Questions have rising intonation.", "example_translation": "Вопросы имеют восходящую интонацию."},
    {"word": "voice", "translation": "голос; звонкий", "part_of_speech": "noun", "example": "Speak in a clear voice.", "example_translation": "Говорите ясным голосом."},
    {"word": "rhythm", "translation": "ритм", "part_of_speech": "noun", "example": "English has a stress-timed rhythm.", "example_translation": "Английский язык имеет ритм, основанный на ударении."},
    {"word": "short", "translation": "короткий; краткий", "part_of_speech": "adjective", "example": "The vowel in cat is short.", "example_translation": "Гласная в слове cat краткая."},
    {"word": "long", "translation": "длинный; долгий", "part_of_speech": "adjective", "example": "The vowel in cake is long.", "example_translation": "Гласная в слове cake долгая."},
    {"word": "voiced", "translation": "звонкий", "part_of_speech": "adjective", "example": "The sound /v/ is voiced.", "example_translation": "Звук /v/ звонкий."},
    {"word": "voiceless", "translation": "глухой (о звуке)", "part_of_speech": "adjective", "example": "The sound /f/ is voiceless.", "example_translation": "Звук /f/ глухой."},
    {"word": "mouth", "translation": "рот", "part_of_speech": "noun", "example": "Open your mouth to practise sounds.", "example_translation": "Откройте рот для отработки звуков."},
    {"word": "tongue", "translation": "язык (орган)", "part_of_speech": "noun", "example": "Put your tongue between your teeth for /th/.", "example_translation": "Поместите язык между зубами для /th/."},
    {"word": "lips", "translation": "губы", "part_of_speech": "noun", "example": "Use your lips for the /p/ sound.", "example_translation": "Используйте губы для звука /p/."},
    {"word": "practice", "translation": "практика, отработка", "part_of_speech": "noun", "example": "Regular practice improves pronunciation.", "example_translation": "Регулярная практика улучшает произношение."},
    {"word": "record", "translation": "записывать; запись", "part_of_speech": "verb/noun", "example": "Record yourself to check your pronunciation.", "example_translation": "Запишите себя, чтобы проверить произношение."},
    {"word": "listen", "translation": "слушать", "part_of_speech": "verb", "example": "Listen to native speakers.", "example_translation": "Слушайте носителей языка."},
    {"word": "imitate", "translation": "подражать, имитировать", "part_of_speech": "verb", "example": "Imitate the sounds you hear.", "example_translation": "Подражайте звукам, которые вы слышите."},
    {"word": "native speaker", "translation": "носитель языка", "part_of_speech": "noun", "example": "Our professor is a native speaker.", "example_translation": "Наш профессор — носитель языка."},
    {"word": "improve", "translation": "улучшать", "part_of_speech": "verb", "example": "You can improve your pronunciation with practice.", "example_translation": "Вы можете улучшить произношение с помощью практики."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "phoneme", "translation": "фонема"},
        {"word": "syllable", "translation": "слог"},
        {"word": "stress", "translation": "ударение"},
        {"word": "silent", "translation": "не произносимый"},
        {"word": "intonation", "translation": "интонация"},
        {"word": "voiced", "translation": "звонкий"},
        {"word": "improve", "translation": "улучшать"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "English has forty-four ___.", "answer": "phonemes", "options": ["phonemes", "letters", "syllables", "symbols"]},
        {"id": 2, "text": "The K in knife is ___.", "answer": "silent", "options": ["silent", "voiced", "long", "stressed"]},
        {"id": 3, "text": "Phonetic ___ are shown in the dictionary.", "answer": "symbols", "options": ["symbols", "letters", "words", "sounds"]},
        {"id": 4, "text": "Regular ___ improves your pronunciation.", "answer": "practice", "options": ["practice", "grammar", "reading", "writing"]},
        {"id": 5, "text": "The word student has two ___.", "answer": "syllables", "options": ["syllables", "phonemes", "vowels", "accents"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "pronunciation", "options": ["фонетика", "ударение", "произношение", "слог"], "answer": "произношение"},
        {"id": 2, "word": "voiceless", "options": ["звонкий", "тихий", "немой", "глухой"], "answer": "глухой"},
        {"id": 3, "word": "native speaker", "options": ["иностранный студент", "носитель языка", "переводчик", "преподаватель"], "answer": "носитель языка"},
        {"id": 4, "word": "imitate", "options": ["описывать", "слушать", "подражать", "записывать"], "answer": "подражать"},
        {"id": 5, "word": "rhythm", "options": ["ударение", "ритм", "слог", "интонация"], "answer": "ритм"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 8
)
AND type = 'vocabulary';

-- Lesson 9: Word Order — Subject + Verb + Object
UPDATE english_lesson_sections
SET content = '{
  "title": "Word Order: Grammar Vocabulary",
  "words": [
    {"word": "subject", "translation": "подлежащее", "part_of_speech": "noun", "example": "In She reads the book, She is the subject.", "example_translation": "В She reads the book, She — подлежащее."},
    {"word": "verb", "translation": "глагол", "part_of_speech": "noun", "example": "Reads is the verb in the sentence.", "example_translation": "Reads — глагол в предложении."},
    {"word": "object", "translation": "дополнение", "part_of_speech": "noun", "example": "The book is the object of the sentence.", "example_translation": "The book — дополнение в предложении."},
    {"word": "sentence", "translation": "предложение", "part_of_speech": "noun", "example": "Write a sentence with the new word.", "example_translation": "Напишите предложение с новым словом."},
    {"word": "order", "translation": "порядок", "part_of_speech": "noun", "example": "Word order is important in English.", "example_translation": "Порядок слов важен в английском."},
    {"word": "structure", "translation": "структура", "part_of_speech": "noun", "example": "The structure of an English sentence is S + V + O.", "example_translation": "Структура английского предложения — П + Г + Д."},
    {"word": "position", "translation": "позиция, место", "part_of_speech": "noun", "example": "The subject is in the first position.", "example_translation": "Подлежащее находится на первой позиции."},
    {"word": "adverb", "translation": "наречие", "part_of_speech": "noun", "example": "Always is an adverb of frequency.", "example_translation": "Always — наречие частотности."},
    {"word": "frequency", "translation": "частота, частотность", "part_of_speech": "noun", "example": "Always and never are adverbs of frequency.", "example_translation": "Always и never — наречия частотности."},
    {"word": "auxiliary", "translation": "вспомогательный", "part_of_speech": "adjective", "example": "Do is an auxiliary verb in questions.", "example_translation": "Do — вспомогательный глагол в вопросах."},
    {"word": "always", "translation": "всегда", "part_of_speech": "adverb", "example": "She always studies in the library.", "example_translation": "Она всегда занимается в библиотеке."},
    {"word": "usually", "translation": "обычно", "part_of_speech": "adverb", "example": "I usually arrive at university at eight.", "example_translation": "Я обычно прихожу в университет в восемь."},
    {"word": "often", "translation": "часто", "part_of_speech": "adverb", "example": "We often have seminars on Fridays.", "example_translation": "У нас часто бывают семинары по пятницам."},
    {"word": "sometimes", "translation": "иногда", "part_of_speech": "adverb", "example": "I sometimes study in the cafeteria.", "example_translation": "Иногда я занимаюсь в кафетерии."},
    {"word": "rarely", "translation": "редко", "part_of_speech": "adverb", "example": "She rarely misses a lecture.", "example_translation": "Она редко пропускает лекции."},
    {"word": "never", "translation": "никогда", "part_of_speech": "adverb", "example": "He never arrives late to class.", "example_translation": "Он никогда не опаздывает на занятия."},
    {"word": "statement", "translation": "утверждение", "part_of_speech": "noun", "example": "A statement ends with a period.", "example_translation": "Утверждение заканчивается точкой."},
    {"word": "question", "translation": "вопрос", "part_of_speech": "noun", "example": "A question ends with a question mark.", "example_translation": "Вопрос заканчивается вопросительным знаком."},
    {"word": "negative", "translation": "отрицательный", "part_of_speech": "adjective", "example": "She does not attend is a negative sentence.", "example_translation": "She does not attend — отрицательное предложение."},
    {"word": "correct", "translation": "правильный; исправлять", "part_of_speech": "adjective/verb", "example": "The word order is correct.", "example_translation": "Порядок слов правильный."},
    {"word": "change", "translation": "менять, изменять", "part_of_speech": "verb", "example": "Do not change the word order in English.", "example_translation": "Не меняйте порядок слов в английском."},
    {"word": "place", "translation": "ставить, помещать", "part_of_speech": "verb", "example": "Place the adverb before the main verb.", "example_translation": "Ставьте наречие перед основным глаголом."},
    {"word": "time", "translation": "время; момент", "part_of_speech": "noun", "example": "Expressions of time go at the end.", "example_translation": "Выражения времени стоят в конце предложения."},
    {"word": "manner", "translation": "образ действия", "part_of_speech": "noun", "example": "Adverbs of manner answer the question how.", "example_translation": "Наречия образа действия отвечают на вопрос как."},
    {"word": "place", "translation": "место", "part_of_speech": "noun", "example": "Adverbs of place answer the question where.", "example_translation": "Наречия места отвечают на вопрос где."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the grammar term to its translation",
      "pairs": [
        {"word": "subject", "translation": "подлежащее"},
        {"word": "verb", "translation": "глагол"},
        {"word": "object", "translation": "дополнение"},
        {"word": "adverb", "translation": "наречие"},
        {"word": "auxiliary", "translation": "вспомогательный"},
        {"word": "negative", "translation": "отрицательный"},
        {"word": "frequency", "translation": "частотность"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "She ___ studies in the library. (каждый день)", "answer": "always", "options": ["always", "never", "sometimes", "rarely"]},
        {"id": 2, "text": "He ___ misses a lecture. (ни разу)", "answer": "never", "options": ["never", "often", "usually", "sometimes"]},
        {"id": 3, "text": "In English, the ___ comes first in a sentence.", "answer": "subject", "options": ["subject", "verb", "object", "adverb"]},
        {"id": 4, "text": "Do not ___ the word order in English.", "answer": "change", "options": ["change", "read", "write", "place"]},
        {"id": 5, "text": "Reads is the ___ in the sentence.", "answer": "verb", "options": ["verb", "subject", "object", "adverb"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "always", "options": ["иногда", "редко", "никогда", "всегда"], "answer": "всегда"},
        {"id": 2, "word": "structure", "options": ["позиция", "структура", "порядок", "место"], "answer": "структура"},
        {"id": 3, "word": "statement", "options": ["вопрос", "предложение", "утверждение", "наречие"], "answer": "утверждение"},
        {"id": 4, "word": "rarely", "options": ["часто", "обычно", "иногда", "редко"], "answer": "редко"},
        {"id": 5, "word": "negative", "options": ["положительный", "вопросительный", "отрицательный", "утвердительный"], "answer": "отрицательный"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 9
)
AND type = 'vocabulary';

-- Lesson 10: Vowels & Digraphs
UPDATE english_lesson_sections
SET content = '{
  "title": "Vowels & Digraphs: Reading Rules",
  "words": [
    {"word": "digraph", "translation": "диграф", "part_of_speech": "noun", "example": "CH is a digraph.", "example_translation": "CH — это диграф."},
    {"word": "combination", "translation": "сочетание", "part_of_speech": "noun", "example": "SH is a combination of two letters.", "example_translation": "SH — сочетание двух букв."},
    {"word": "short vowel", "translation": "краткая гласная", "part_of_speech": "noun", "example": "The vowel in cat is a short vowel.", "example_translation": "Гласная в слове cat — краткая гласная."},
    {"word": "long vowel", "translation": "долгая гласная", "part_of_speech": "noun", "example": "The vowel in cake is a long vowel.", "example_translation": "Гласная в слове cake — долгая гласная."},
    {"word": "spell", "translation": "произносить по буквам; писать", "part_of_speech": "verb", "example": "How do you spell university?", "example_translation": "Как пишется слово university?"},
    {"word": "rule", "translation": "правило", "part_of_speech": "noun", "example": "There is a rule for reading digraphs.", "example_translation": "Существует правило для чтения диграфов."},
    {"word": "pattern", "translation": "паттерн, закономерность", "part_of_speech": "noun", "example": "The OO pattern has two sounds.", "example_translation": "Паттерн OO имеет два звука."},
    {"word": "chair", "translation": "стул; пример CH-диграфа", "part_of_speech": "noun", "example": "Chair begins with the CH digraph.", "example_translation": "Chair начинается с диграфа CH."},
    {"word": "ship", "translation": "корабль; пример SH-диграфа", "part_of_speech": "noun", "example": "Ship begins with the SH digraph.", "example_translation": "Ship начинается с диграфа SH."},
    {"word": "think", "translation": "думать; пример TH-диграфа", "part_of_speech": "verb", "example": "Think begins with the TH digraph.", "example_translation": "Think начинается с диграфа TH."},
    {"word": "phone", "translation": "телефон; пример PH-диграфа", "part_of_speech": "noun", "example": "Phone begins with the PH digraph.", "example_translation": "Phone начинается с диграфа PH."},
    {"word": "photograph", "translation": "фотография", "part_of_speech": "noun", "example": "Photograph has the PH digraph twice.", "example_translation": "В слове photograph диграф PH встречается дважды."},
    {"word": "school", "translation": "школа; пример OO-гласной", "part_of_speech": "noun", "example": "School has the long OO sound.", "example_translation": "В слове school долгий звук OO."},
    {"word": "book", "translation": "книга; пример краткого OO", "part_of_speech": "noun", "example": "Book has the short OO sound.", "example_translation": "В слове book краткий звук OO."},
    {"word": "food", "translation": "еда; пример долгого OO", "part_of_speech": "noun", "example": "Food has the long OO sound.", "example_translation": "В слове food долгий звук OO."},
    {"word": "chain", "translation": "цепочка; пример CH+AI", "part_of_speech": "noun", "example": "Chain has the CH digraph and the AI vowel.", "example_translation": "Chain содержит диграф CH и гласный AI."},
    {"word": "sheep", "translation": "овца; пример SH+EE", "part_of_speech": "noun", "example": "Sheep has the SH digraph and long EE sound.", "example_translation": "Sheep содержит диграф SH и долгий звук EE."},
    {"word": "three", "translation": "три; пример TH-диграфа", "part_of_speech": "number", "example": "Three has the TH digraph.", "example_translation": "Three содержит диграф TH."},
    {"word": "language", "translation": "язык", "part_of_speech": "noun", "example": "English is a global language.", "example_translation": "Английский — глобальный язык."},
    {"word": "reading", "translation": "чтение", "part_of_speech": "noun", "example": "Reading rules help you pronounce words.", "example_translation": "Правила чтения помогают произносить слова."},
    {"word": "writing", "translation": "написание, письмо", "part_of_speech": "noun", "example": "Good spelling helps your writing.", "example_translation": "Хорошее написание помогает вашему письму."},
    {"word": "different", "translation": "разный, различный", "part_of_speech": "adjective", "example": "A can make different sounds.", "example_translation": "A может производить разные звуки."},
    {"word": "same", "translation": "одинаковый, тот же", "part_of_speech": "adjective", "example": "OO can sound the same in food and school.", "example_translation": "OO может звучать одинаково в food и school."},
    {"word": "together", "translation": "вместе", "part_of_speech": "adverb", "example": "Two letters together make one sound.", "example_translation": "Два звука вместе образуют один звук."},
    {"word": "example", "translation": "пример", "part_of_speech": "noun", "example": "Give an example of a digraph.", "example_translation": "Приведите пример диграфа."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the digraph to an example word",
      "pairs": [
        {"word": "CH", "translation": "chair"},
        {"word": "SH", "translation": "ship"},
        {"word": "TH", "translation": "think"},
        {"word": "PH", "translation": "phone"},
        {"word": "OO (long)", "translation": "food"},
        {"word": "OO (short)", "translation": "book"},
        {"word": "EE", "translation": "sheep"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "A ___ is two letters that make one sound.", "answer": "digraph", "options": ["digraph", "vowel", "consonant", "syllable"]},
        {"id": 2, "text": "The vowel in cat is a ___ vowel.", "answer": "short", "options": ["short", "long", "silent", "voiced"]},
        {"id": 3, "text": "How do you ___ the word university?", "answer": "spell", "options": ["spell", "read", "write", "pronounce"]},
        {"id": 4, "text": "Phone begins with the ___ digraph.", "answer": "PH", "options": ["PH", "SH", "CH", "TH"]},
        {"id": 5, "text": "Two letters ___ make one sound in a digraph.", "answer": "together", "options": ["together", "separately", "always", "never"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "digraph", "options": ["фонема", "диграф", "слог", "ударение"], "answer": "диграф"},
        {"id": 2, "word": "spell", "options": ["произносить", "читать", "писать по буквам", "слушать"], "answer": "писать по буквам"},
        {"id": 3, "word": "pattern", "options": ["правило", "символ", "паттерн", "звук"], "answer": "паттерн"},
        {"id": 4, "word": "different", "options": ["одинаковый", "тихий", "разный", "долгий"], "answer": "разный"},
        {"id": 5, "word": "combination", "options": ["слог", "ударение", "сочетание", "правило"], "answer": "сочетание"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 10
)
AND type = 'vocabulary';


-- Lesson 11: Verb To Have — Have/Has/Had
UPDATE english_lesson_sections
SET content = '{
  "title": "Verb To Have: Have, Has, Had",
  "words": [
    {"word": "have", "translation": "иметь (I/you/we/they)", "part_of_speech": "verb", "example": "I have two brothers.", "example_translation": "У меня два брата."},
    {"word": "has", "translation": "иметь (he/she/it)", "part_of_speech": "verb", "example": "She has a laptop.", "example_translation": "У неё есть ноутбук."},
    {"word": "had", "translation": "имел (прошедшее время)", "part_of_speech": "verb", "example": "I had a meeting yesterday.", "example_translation": "Вчера у меня была встреча."},
    {"word": "own", "translation": "владеть, иметь", "part_of_speech": "verb", "example": "The university owns a large library.", "example_translation": "Университет владеет большой библиотекой."},
    {"word": "get", "translation": "получать", "part_of_speech": "verb", "example": "I get good marks at university.", "example_translation": "Я получаю хорошие оценки в университете."},
    {"word": "keep", "translation": "хранить, держать", "part_of_speech": "verb", "example": "Keep your notes in a notebook.", "example_translation": "Храните свои записи в тетради."},
    {"word": "brother", "translation": "брат", "part_of_speech": "noun", "example": "I have one brother.", "example_translation": "У меня один брат."},
    {"word": "sister", "translation": "сестра", "part_of_speech": "noun", "example": "She has two sisters.", "example_translation": "У неё две сестры."},
    {"word": "family", "translation": "семья", "part_of_speech": "noun", "example": "My family is from Almaty.", "example_translation": "Моя семья из Алматы."},
    {"word": "friend", "translation": "друг, подруга", "part_of_speech": "noun", "example": "I have many friends at university.", "example_translation": "У меня много друзей в университете."},
    {"word": "classmate", "translation": "одногруппник", "part_of_speech": "noun", "example": "She has twenty classmates.", "example_translation": "У неё двадцать одногруппников."},
    {"word": "supervisor", "translation": "научный руководитель", "part_of_speech": "noun", "example": "I have a meeting with my supervisor.", "example_translation": "У меня встреча с научным руководителем."},
    {"word": "laptop", "translation": "ноутбук", "part_of_speech": "noun", "example": "Every student has a laptop.", "example_translation": "У каждого студента есть ноутбук."},
    {"word": "bag", "translation": "сумка", "part_of_speech": "noun", "example": "I have a heavy bag today.", "example_translation": "У меня сегодня тяжёлая сумка."},
    {"word": "time", "translation": "время", "part_of_speech": "noun", "example": "We have time before the lecture.", "example_translation": "У нас есть время до лекции."},
    {"word": "cold", "translation": "простуда", "part_of_speech": "noun", "example": "I have a cold this week.", "example_translation": "На этой неделе у меня простуда."},
    {"word": "headache", "translation": "головная боль", "part_of_speech": "noun", "example": "She has a headache after the exam.", "example_translation": "После экзамена у неё головная боль."},
    {"word": "experience", "translation": "опыт", "part_of_speech": "noun", "example": "He has research experience.", "example_translation": "У него есть опыт исследовательской работы."},
    {"word": "opportunity", "translation": "возможность", "part_of_speech": "noun", "example": "We have an opportunity to study abroad.", "example_translation": "У нас есть возможность учиться за рубежом."},
    {"word": "problem", "translation": "проблема", "part_of_speech": "noun", "example": "Do you have a problem with the assignment?", "example_translation": "У вас есть проблема с заданием?"},
    {"word": "question", "translation": "вопрос", "part_of_speech": "noun", "example": "I have a question for the professor.", "example_translation": "У меня есть вопрос к профессору."},
    {"word": "idea", "translation": "идея", "part_of_speech": "noun", "example": "She has a good idea for the project.", "example_translation": "У неё есть хорошая идея для проекта."},
    {"word": "irregular", "translation": "нерегулярный, неправильный", "part_of_speech": "adjective", "example": "Have is an irregular verb.", "example_translation": "Have — неправильный глагол."},
    {"word": "possession", "translation": "владение, обладание", "part_of_speech": "noun", "example": "Have expresses possession.", "example_translation": "Have выражает обладание."},
    {"word": "expression", "translation": "выражение, фраза", "part_of_speech": "noun", "example": "I have a cold is a fixed expression.", "example_translation": "I have a cold — устойчивое выражение."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "have", "translation": "иметь"},
        {"word": "supervisor", "translation": "научный руководитель"},
        {"word": "experience", "translation": "опыт"},
        {"word": "opportunity", "translation": "возможность"},
        {"word": "possession", "translation": "владение"},
        {"word": "irregular", "translation": "неправильный"},
        {"word": "expression", "translation": "выражение"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with have, has, or had",
      "sentences": [
        {"id": 1, "text": "I ___ two brothers and one sister.", "answer": "have", "options": ["have", "has", "had", "is"]},
        {"id": 2, "text": "She ___ a meeting with her supervisor yesterday.", "answer": "had", "options": ["have", "has", "had", "is"]},
        {"id": 3, "text": "Our university ___ excellent laboratories.", "answer": "has", "options": ["have", "has", "had", "are"]},
        {"id": 4, "text": "I ___ a question for the professor.", "answer": "have", "options": ["have", "has", "had", "am"]},
        {"id": 5, "text": "The verb have is ___.", "answer": "irregular", "options": ["irregular", "regular", "auxiliary", "modal"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "supervisor", "options": ["одногруппник", "научный руководитель", "профессор", "коллега"], "answer": "научный руководитель"},
        {"id": 2, "word": "experience", "options": ["возможность", "время", "опыт", "проблема"], "answer": "опыт"},
        {"id": 3, "word": "keep", "options": ["получать", "давать", "хранить", "терять"], "answer": "хранить"},
        {"id": 4, "word": "opportunity", "options": ["проблема", "идея", "опыт", "возможность"], "answer": "возможность"},
        {"id": 5, "word": "possession", "options": ["вопрос", "выражение", "владение", "идея"], "answer": "владение"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 11
)
AND type = 'vocabulary';

-- Lesson 12: Capitalization
UPDATE english_lesson_sections
SET content = '{
  "title": "Capitalization: Rules & Vocabulary",
  "words": [
    {"word": "capital letter", "translation": "заглавная буква", "part_of_speech": "noun", "example": "I is always written with a capital letter.", "example_translation": "I всегда пишется с заглавной буквы."},
    {"word": "lowercase", "translation": "строчная буква", "part_of_speech": "noun", "example": "Seasons use lowercase letters.", "example_translation": "Времена года пишутся строчными буквами."},
    {"word": "proper noun", "translation": "имя собственное", "part_of_speech": "noun", "example": "Kazakhstan is a proper noun.", "example_translation": "Kazakhstan — имя собственное."},
    {"word": "common noun", "translation": "нарицательное существительное", "part_of_speech": "noun", "example": "Country is a common noun.", "example_translation": "Country — нарицательное существительное."},
    {"word": "nationality", "translation": "национальность", "part_of_speech": "noun", "example": "Kazakh is a nationality.", "example_translation": "Kazakh — национальность."},
    {"word": "language", "translation": "язык", "part_of_speech": "noun", "example": "English is a language.", "example_translation": "English — язык."},
    {"word": "month", "translation": "месяц", "part_of_speech": "noun", "example": "January is a month.", "example_translation": "January — это месяц."},
    {"word": "day", "translation": "день", "part_of_speech": "noun", "example": "Monday is a day of the week.", "example_translation": "Monday — день недели."},
    {"word": "season", "translation": "время года", "part_of_speech": "noun", "example": "Spring is a season.", "example_translation": "Spring — время года."},
    {"word": "title", "translation": "звание, титул", "part_of_speech": "noun", "example": "Professor and Doctor are titles.", "example_translation": "Professor и Doctor — звания."},
    {"word": "organisation", "translation": "организация", "part_of_speech": "noun", "example": "Nazarbayev University is an organisation.", "example_translation": "Nazarbayev University — организация."},
    {"word": "beginning", "translation": "начало", "part_of_speech": "noun", "example": "Use a capital letter at the beginning of a sentence.", "example_translation": "Используйте заглавную букву в начале предложения."},
    {"word": "pronoun", "translation": "местоимение", "part_of_speech": "noun", "example": "I is the only pronoun always capitalised.", "example_translation": "I — единственное местоимение, всегда пишущееся с заглавной."},
    {"word": "always", "translation": "всегда", "part_of_speech": "adverb", "example": "Proper nouns are always capitalised.", "example_translation": "Имена собственные всегда пишутся с заглавной."},
    {"word": "never", "translation": "никогда", "part_of_speech": "adverb", "example": "Seasons are never capitalised.", "example_translation": "Времена года никогда не пишутся с заглавной."},
    {"word": "check", "translation": "проверять", "part_of_speech": "verb", "example": "Always check capitalisation in your writing.", "example_translation": "Всегда проверяйте заглавные буквы в своих работах."},
    {"word": "correct", "translation": "правильный; исправлять", "part_of_speech": "adjective/verb", "example": "Correct the capitalisation errors.", "example_translation": "Исправьте ошибки в заглавных буквах."},
    {"word": "incorrect", "translation": "неправильный", "part_of_speech": "adjective", "example": "almaty is incorrect — use Almaty.", "example_translation": "almaty неправильно — используйте Almaty."},
    {"word": "professional", "translation": "профессиональный", "part_of_speech": "adjective", "example": "Use correct capitalisation in professional writing.", "example_translation": "Используйте правильные заглавные буквы в профессиональных текстах."},
    {"word": "academic", "translation": "академический", "part_of_speech": "adjective", "example": "Academic writing has strict rules.", "example_translation": "Академическое письмо имеет строгие правила."},
    {"word": "continent", "translation": "континент", "part_of_speech": "noun", "example": "Asia and Europe are continents.", "example_translation": "Азия и Европа — континенты."},
    {"word": "institution", "translation": "учреждение", "part_of_speech": "noun", "example": "A university is an academic institution.", "example_translation": "Университет — академическое учреждение."},
    {"word": "abbreviation", "translation": "аббревиатура", "part_of_speech": "noun", "example": "UN is an abbreviation for United Nations.", "example_translation": "UN — аббревиатура для United Nations."},
    {"word": "important", "translation": "важный", "part_of_speech": "adjective", "example": "Capitalisation is important in academic writing.", "example_translation": "Заглавные буквы важны в академическом письме."},
    {"word": "follow", "translation": "следовать, соблюдать", "part_of_speech": "verb", "example": "Follow the rules of capitalisation.", "example_translation": "Соблюдайте правила написания заглавных букв."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the word to its translation",
      "pairs": [
        {"word": "capital letter", "translation": "заглавная буква"},
        {"word": "proper noun", "translation": "имя собственное"},
        {"word": "lowercase", "translation": "строчная буква"},
        {"word": "nationality", "translation": "национальность"},
        {"word": "season", "translation": "время года"},
        {"word": "abbreviation", "translation": "аббревиатура"},
        {"word": "institution", "translation": "учреждение"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "The pronoun I is ___ written with a capital letter.", "answer": "always", "options": ["always", "never", "sometimes", "rarely"]},
        {"id": 2, "text": "Spring and summer are ___ — they do not use capital letters.", "answer": "seasons", "options": ["seasons", "months", "days", "languages"]},
        {"id": 3, "text": "Kazakhstan is a ___ noun.", "answer": "proper", "options": ["proper", "common", "singular", "plural"]},
        {"id": 4, "text": "Always ___ capitalisation in your academic writing.", "answer": "check", "options": ["check", "ignore", "change", "remove"]},
        {"id": 5, "text": "Professor and Doctor are ___ before names.", "answer": "titles", "options": ["titles", "nouns", "pronouns", "months"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "proper noun", "options": ["нарицательное существительное", "имя собственное", "местоимение", "заглавная буква"], "answer": "имя собственное"},
        {"id": 2, "word": "season", "options": ["месяц", "день", "время года", "год"], "answer": "время года"},
        {"id": 3, "word": "institution", "options": ["язык", "учреждение", "аббревиатура", "организация"], "answer": "учреждение"},
        {"id": 4, "word": "follow", "options": ["нарушать", "проверять", "соблюдать", "исправлять"], "answer": "соблюдать"},
        {"id": 5, "word": "incorrect", "options": ["правильный", "академический", "неправильный", "профессиональный"], "answer": "неправильный"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 12
)
AND type = 'vocabulary';

-- Lesson 13: Punctuation — Periods, Commas, Apostrophes
UPDATE english_lesson_sections
SET content = '{
  "title": "Punctuation: Marks & Symbols",
  "words": [
    {"word": "punctuation", "translation": "пунктуация", "part_of_speech": "noun", "example": "Correct punctuation makes writing clear.", "example_translation": "Правильная пунктуация делает текст понятным."},
    {"word": "period", "translation": "точка (знак препинания)", "part_of_speech": "noun", "example": "A period ends a declarative sentence.", "example_translation": "Точка завершает повествовательное предложение."},
    {"word": "comma", "translation": "запятая", "part_of_speech": "noun", "example": "A comma separates items in a list.", "example_translation": "Запятая разделяет элементы списка."},
    {"word": "apostrophe", "translation": "апостроф", "part_of_speech": "noun", "example": "An apostrophe shows possession or a contraction.", "example_translation": "Апостроф показывает принадлежность или сокращение."},
    {"word": "question mark", "translation": "вопросительный знак", "part_of_speech": "noun", "example": "A question mark ends a question.", "example_translation": "Вопросительный знак завершает вопрос."},
    {"word": "exclamation mark", "translation": "восклицательный знак", "part_of_speech": "noun", "example": "An exclamation mark shows strong emotion.", "example_translation": "Восклицательный знак показывает сильные эмоции."},
    {"word": "mark", "translation": "знак", "part_of_speech": "noun", "example": "Use the correct mark at the end of each sentence.", "example_translation": "Используйте правильный знак в конце каждого предложения."},
    {"word": "symbol", "translation": "символ", "part_of_speech": "noun", "example": "A comma is a punctuation symbol.", "example_translation": "Запятая — это знак пунктуации."},
    {"word": "list", "translation": "список", "part_of_speech": "noun", "example": "Use commas to separate items in a list.", "example_translation": "Используйте запятые для разделения элементов списка."},
    {"word": "possession", "translation": "принадлежность, владение", "part_of_speech": "noun", "example": "An apostrophe shows possession.", "example_translation": "Апостроф показывает принадлежность."},
    {"word": "contraction", "translation": "сокращение", "part_of_speech": "noun", "example": "An apostrophe is used in contractions.", "example_translation": "Апостроф используется в сокращениях."},
    {"word": "semicolon", "translation": "точка с запятой", "part_of_speech": "noun", "example": "A semicolon connects two related sentences.", "example_translation": "Точка с запятой соединяет два связанных предложения."},
    {"word": "colon", "translation": "двоеточие", "part_of_speech": "noun", "example": "Use a colon before a list.", "example_translation": "Используйте двоеточие перед списком."},
    {"word": "hyphen", "translation": "дефис", "part_of_speech": "noun", "example": "A hyphen joins two words: well-equipped.", "example_translation": "Дефис соединяет два слова: well-equipped."},
    {"word": "bracket", "translation": "скобка", "part_of_speech": "noun", "example": "Brackets add extra information.", "example_translation": "Скобки добавляют дополнительную информацию."},
    {"word": "separate", "translation": "разделять", "part_of_speech": "verb", "example": "A comma can separate items.", "example_translation": "Запятая может разделять элементы."},
    {"word": "end", "translation": "завершать; конец", "part_of_speech": "verb/noun", "example": "A period ends a sentence.", "example_translation": "Точка завершает предложение."},
    {"word": "show", "translation": "показывать", "part_of_speech": "verb", "example": "An apostrophe shows missing letters.", "example_translation": "Апостроф показывает пропущенные буквы."},
    {"word": "clear", "translation": "ясный, понятный", "part_of_speech": "adjective", "example": "Correct punctuation makes writing clear.", "example_translation": "Правильная пунктуация делает текст ясным."},
    {"word": "professional", "translation": "профессиональный", "part_of_speech": "adjective", "example": "Professional writing uses correct punctuation.", "example_translation": "Профессиональное письмо использует правильную пунктуацию."},
    {"word": "essential", "translation": "необходимый, обязательный", "part_of_speech": "adjective", "example": "Punctuation is essential in academic writing.", "example_translation": "Пунктуация обязательна в академическом письме."},
    {"word": "submit", "translation": "сдавать, подавать", "part_of_speech": "verb", "example": "Check punctuation before you submit.", "example_translation": "Проверьте пунктуацию перед сдачей."},
    {"word": "check", "translation": "проверять", "part_of_speech": "verb", "example": "Always check punctuation before submitting.", "example_translation": "Всегда проверяйте пунктуацию перед сдачей."},
    {"word": "conjunction", "translation": "союз", "part_of_speech": "noun", "example": "Use a comma before conjunctions like but.", "example_translation": "Ставьте запятую перед союзами, например but."},
    {"word": "declarative", "translation": "повествовательный", "part_of_speech": "adjective", "example": "A declarative sentence ends with a period.", "example_translation": "Повествовательное предложение заканчивается точкой."}
  ],
  "exercises": [
    {
      "type": "match",
      "instruction": "Match the punctuation mark to its name",
      "pairs": [
        {"word": "period", "translation": "точка"},
        {"word": "comma", "translation": "запятая"},
        {"word": "apostrophe", "translation": "апостроф"},
        {"word": "semicolon", "translation": "точка с запятой"},
        {"word": "colon", "translation": "двоеточие"},
        {"word": "hyphen", "translation": "дефис"},
        {"word": "exclamation mark", "translation": "восклицательный знак"}
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Fill in the blanks with the correct word",
      "sentences": [
        {"id": 1, "text": "A ___ ends every declarative sentence.", "answer": "period", "options": ["period", "comma", "hyphen", "colon"]},
        {"id": 2, "text": "A ___ separates items in a list.", "answer": "comma", "options": ["comma", "period", "semicolon", "colon"]},
        {"id": 3, "text": "An ___ shows possession or a contraction.", "answer": "apostrophe", "options": ["apostrophe", "comma", "hyphen", "bracket"]},
        {"id": 4, "text": "Punctuation is ___ in academic writing.", "answer": "essential", "options": ["essential", "optional", "incorrect", "informal"]},
        {"id": 5, "text": "Always ___ punctuation before you submit work.", "answer": "check", "options": ["check", "ignore", "remove", "change"]}
      ]
    },
    {
      "type": "multiple_choice",
      "instruction": "Choose the correct translation",
      "questions": [
        {"id": 1, "word": "punctuation", "options": ["грамматика", "пунктуация", "произношение", "заглавная буква"], "answer": "пунктуация"},
        {"id": 2, "word": "possession", "options": ["сокращение", "принадлежность", "список", "знак"], "answer": "принадлежность"},
        {"id": 3, "word": "essential", "options": ["дополнительный", "необязательный", "необходимый", "неправильный"], "answer": "необходимый"},
        {"id": 4, "word": "declarative", "options": ["вопросительный", "восклицательный", "отрицательный", "повествовательный"], "answer": "повествовательный"},
        {"id": 5, "word": "conjunction", "options": ["существительное", "прилагательное", "союз", "наречие"], "answer": "союз"}
      ]
    }
  ]
}'::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner' AND m.order_index = 1 AND l.order_index = 13
)
AND type = 'vocabulary';
