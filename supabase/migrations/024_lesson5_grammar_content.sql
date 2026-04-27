-- ============================================================
-- 024: Grammar content for A1 Beginner / Module 1 / Lesson 5
--      "Articles — A, An, The"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Articles — A, An, The — Артикли",
  "academic_intro": "Артикли (articles) — это служебные слова, которые используются перед существительными. В английском языке три артикля: неопределённый a/an и определённый the. В русском языке артиклей нет, поэтому это одна из самых сложных тем для русскоязычных студентов. Правильное использование артиклей — обязательный элемент академического письма и устной речи на уровне университета.",
  "rules": [
    {
      "rule": "Правило 1 — Артикль A",
      "explanation": "Используется перед существительными в единственном числе, начинающимися на согласный звук. Означает один из многих — любой представитель группы.",
      "usage": [
        "Первое упоминание предмета: I saw a dog in the park.",
        "Профессия или роль: She is a doctor. He is a student.",
        "После слов: such a, quite a, rather a, what a",
        "Со значением один: a hundred, a thousand, a dozen"
      ],
      "examples": [
        {"sentence": "I need a pen.",             "translation": "Мне нужна ручка (любая)."},
        {"sentence": "He is a professor.",        "translation": "Он профессор."},
        {"sentence": "What a beautiful city!",    "translation": "Какой красивый город!"},
        {"sentence": "She has a laptop.",         "translation": "У неё есть ноутбук."}
      ],
      "note": "A используется только с существительными в ЕДИНСТВЕННОМ числе."
    },
    {
      "rule": "Правило 2 — Артикль AN",
      "explanation": "Используется перед существительными в единственном числе, начинающимися на ГЛАСНЫЙ ЗВУК (не букву!). Ключевой критерий — произношение, а не написание.",
      "usage": [
        "Перед гласным звуком: an apple, an egg, an idea, an umbrella",
        "Перед немым h: an hour, an honest man, an honour",
        "Перед аббревиатурами с гласным звуком: an MBA, an NGO, an X-ray"
      ],
      "examples": [
        {"sentence": "She is an engineer.",       "translation": "Она инженер.",             "note": "e — гласный звук"},
        {"sentence": "It takes an hour.",         "translation": "Это занимает час.",         "note": "h — немое"},
        {"sentence": "He has an MBA degree.",     "translation": "У него степень MBA.",       "note": "M произносится em"},
        {"sentence": "An apple a day keeps the doctor away.", "translation": "Яблоко в день — и врач не нужен."}
      ],
      "tricky": [
        {"word": "university", "article": "a",  "reason": "Произносится [juːnɪˈvɜːsɪtɪ] — начинается с согласного звука [j]"},
        {"word": "hour",       "article": "an", "reason": "Произносится [aʊər] — h немое, начинается с гласного [a]"},
        {"word": "European",   "article": "a",  "reason": "Произносится [ˌjʊərəˈpiːən] — начинается с [j]"},
        {"word": "umbrella",   "article": "an", "reason": "Начинается с гласного звука [ʌ]"}
      ]
    },
    {
      "rule": "Правило 3 — Артикль THE",
      "explanation": "Определённый артикль the используется когда говорящий и слушающий оба знают о каком предмете идёт речь.",
      "usage": [
        "Повторное упоминание: I saw a dog. The dog was black.",
        "Единственный в своём роде: the sun, the moon, the Earth, the Internet",
        "С превосходной степенью: the best, the most important, the highest",
        "С порядковыми числительными: the first, the second, the last",
        "Географические названия (реки, моря, горные цепи): the Nile, the Pacific, the Alps",
        "Названия стран-союзов: the USA, the UK, the UAE",
        "Музыкальные инструменты: She plays the piano.",
        "Национальности как группа: the British, the Kazakhs"
      ],
      "examples": [
        {"sentence": "I bought a book. The book is very interesting.", "translation": "Я купил книгу. Книга очень интересная."},
        {"sentence": "The sun rises in the east.",                     "translation": "Солнце встаёт на востоке."},
        {"sentence": "She is the best student in the class.",          "translation": "Она лучшая студентка в классе."},
        {"sentence": "The first chapter is the most important.",       "translation": "Первая глава самая важная."}
      ]
    },
    {
      "rule": "Правило 4 — Нулевой артикль (Zero Article)",
      "explanation": "Случаи когда артикль не используется вообще. Правильное понимание нулевого артикля так же важно как использование a/an/the.",
      "usage": [
        "Имена собственные: Adilet, Kazakhstan, Almaty",
        "Языки и национальности: English, Russian, Kazakh",
        "Учебные предметы: I study mathematics, physics, history",
        "Приёмы пищи: have breakfast, eat lunch, after dinner",
        "Транспорт с by: by car, by train, by plane",
        "Множественное число с общим значением: Students need books.",
        "Неисчисляемые с общим значением: Water is essential. Knowledge is power."
      ],
      "examples": [
        {"sentence": "She speaks English and Kazakh.",   "translation": "Она говорит по-английски и по-казахски."},
        {"sentence": "I go to university by bus.",       "translation": "Я езжу в университет на автобусе."},
        {"sentence": "We had breakfast at 8 am.",        "translation": "Мы позавтракали в 8 утра."},
        {"sentence": "Knowledge is the key to success.","translation": "Знание — ключ к успеху."}
      ]
    },
    {
      "rule": "Правило 5 — A/AN vs THE: ключевое различие",
      "explanation": "Главное различие между неопределённым и определённым артиклем — степень известности предмета для собеседника.",
      "comparison": [
        {"indefinite": "I want to read a book.",        "definite": "I want to read the book you recommended.", "note": "Любая книга vs конкретная книга"},
        {"indefinite": "She is a teacher.",             "definite": "She is the teacher of our group.",         "note": "Профессия vs конкретная роль"},
        {"indefinite": "There is a university in the city.", "definite": "The university was founded in 1934.", "note": "Первое упоминание vs известный объект"}
      ]
    },
    {
      "rule": "Правило 6 — Артикли с географическими названиями",
      "explanation": "Использование артиклей с географическими названиями подчиняется особым правилам.",
      "with_the": [
        "the Nile, the Amazon (реки)",
        "the Pacific, the Atlantic (океаны и моря)",
        "the Alps, the Himalayas (горные цепи)",
        "the USA, the UK, the UAE (страны-союзы)",
        "the Netherlands, the Philippines (множественное число)"
      ],
      "without_article": [
        "Kazakhstan, France, Japan (страны)",
        "Almaty, London, Paris (города)",
        "Asia, Europe, Africa (континенты)",
        "Mount Everest, Lake Baikal (отдельные горы и озёра)"
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She is the doctor.",                           "correct": "She is a doctor.",                     "explanation": "Профессия без контекста — неопределённый артикль"},
    {"wrong": "I go to the university by the bus.",           "correct": "I go to university by bus.",           "explanation": "University (учёба) и by bus — нулевой артикль"},
    {"wrong": "The life is beautiful.",                       "correct": "Life is beautiful.",                   "explanation": "Абстрактное понятие в общем значении — нулевой артикль"},
    {"wrong": "She plays a piano.",                           "correct": "She plays the piano.",                 "explanation": "Музыкальные инструменты — the"},
    {"wrong": "I have an university degree.",                 "correct": "I have a university degree.",          "explanation": "University начинается со звука [j] — согласный"}
  ],
  "academic_examples": [
    "The study examined the relationship between education and income.",
    "A significant number of students reported difficulties in the first semester.",
    "Water is a fundamental resource for life on Earth.",
    "The University of Cambridge was founded in 1209.",
    "An interdisciplinary approach is required to solve this problem."
  ],
  "exercises": [
    {"type": "multiple_choice",   "question": "I need ___ pen. (любая ручка)",                             "options": ["a","an","the","—"],                              "answer": "a"},
    {"type": "multiple_choice",   "question": "She is ___ engineer.",                                      "options": ["a","an","the","—"],                              "answer": "an"},
    {"type": "multiple_choice",   "question": "I saw ___ dog. ___ dog was black.",                         "options": ["a / The","the / A","a / A","the / The"],         "answer": "a / The"},
    {"type": "multiple_choice",   "question": "___ sun rises in the east.",                                "options": ["A","An","The","—"],                              "answer": "The"},
    {"type": "multiple_choice",   "question": "She is ___ best student in the class.",                     "options": ["a","an","the","—"],                              "answer": "the"},
    {"type": "multiple_choice",   "question": "I go to ___ university by ___ bus.",                        "options": ["a / a","the / the","— / —","the / a"],           "answer": "— / —"},
    {"type": "multiple_choice",   "question": "He has ___ MBA degree.",                                    "options": ["a","an","the","—"],                              "answer": "an"},
    {"type": "multiple_choice",   "question": "She plays ___ piano.",                                      "options": ["a","an","the","—"],                              "answer": "the"},
    {"type": "multiple_choice",   "question": "___ life is beautiful. (жизнь вообще)",                     "options": ["A","An","The","—"],                              "answer": "—"},
    {"type": "multiple_choice",   "question": "He is ___ university professor.",                           "options": ["a","an","the","—"],                              "answer": "a"},
    {"type": "true_false",        "question": "She is the doctor. (просто профессия)",                     "answer": "wrong",   "explanation": "Профессия без контекста — She is a doctor."},
    {"type": "true_false",        "question": "The Nile is the longest river in Africa.",                   "answer": "correct", "explanation": "Реки используются с the. Верно!"},
    {"type": "error_correction",  "question": "I have an university degree and speak the English.",        "answer": "I have a university degree and speak English."},
    {"type": "fill_blank",        "question": "Kazakhstan is ___ beautiful country. ___ country is located in Central Asia.", "answer": "a / The"},
    {"type": "fill_blank",        "question": "___ knowledge is ___ power. (общее значение)",              "answer": "— / —"},
    {"type": "multiple_choice",   "question": "It takes ___ hour to get there.",                           "options": ["a","an","the","—"],                              "answer": "an"},
    {"type": "error_correction",  "question": "The students need the books for the mathematics.",          "answer": "Students need books for mathematics."},
    {"type": "multiple_choice",   "question": "She lives in ___ USA.",                                     "options": ["a","an","the","—"],                              "answer": "the"},
    {"type": "fill_blank",        "question": "I had ___ breakfast at 8 am. ___ breakfast was delicious.", "answer": "— / The"},
    {"type": "academic_writing",  "question": "Напишите 3 предложения о своём университете используя все три артикля: a, an, the и нулевой артикль.", "tip": "Например: I study at a university in Almaty. The university was founded in... An important aspect of university life is..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 5
  LIMIT 1
)
AND type = 'grammar';
