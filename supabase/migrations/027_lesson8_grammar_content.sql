-- ============================================================
-- 027: Grammar content for A1 Beginner / Module 1 / Lesson 8
--      "Numbers & Ordinals"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Numbers & Ordinals — Числительные",
  "academic_intro": "Числительные (numerals) — это слова обозначающие количество или порядок предметов. В английском языке различают два основных типа: количественные (cardinal numbers) и порядковые (ordinal numbers). Грамотное использование числительных критически важно в академическом письме, научных статьях и официальных документах.",
  "rules": [
    {
      "rule": "Правило 1 — Количественные числительные (Cardinal Numbers)",
      "explanation": "Количественные числительные обозначают количество предметов. Важно знать правила произношения и написания.",
      "groups": [
        {
          "group": "1–19 (простые)",
          "numbers": [
            {"num": 1,  "word": "one"},   {"num": 2,  "word": "two"},      {"num": 3,  "word": "three"},
            {"num": 4,  "word": "four"},  {"num": 5,  "word": "five"},     {"num": 6,  "word": "six"},
            {"num": 7,  "word": "seven"}, {"num": 8,  "word": "eight"},    {"num": 9,  "word": "nine"},
            {"num": 10, "word": "ten"},   {"num": 11, "word": "eleven"},   {"num": 12, "word": "twelve"},
            {"num": 13, "word": "thirteen"}, {"num": 14, "word": "fourteen"}, {"num": 15, "word": "fifteen"},
            {"num": 16, "word": "sixteen"}, {"num": 17, "word": "seventeen"}, {"num": 18, "word": "eighteen"},
            {"num": 19, "word": "nineteen"}
          ]
        },
        {
          "group": "Десятки (20–90)",
          "numbers": [
            {"num": 20, "word": "twenty"}, {"num": 30, "word": "thirty"}, {"num": 40, "word": "forty"},
            {"num": 50, "word": "fifty"},  {"num": 60, "word": "sixty"},  {"num": 70, "word": "seventy"},
            {"num": 80, "word": "eighty"}, {"num": 90, "word": "ninety"}
          ],
          "note": "forty — без буквы u! (не fourty)"
        },
        {
          "group": "Составные числа",
          "examples": [
            {"num": 21,          "word": "twenty-one",                           "note": "через дефис"},
            {"num": 35,          "word": "thirty-five",                          "note": "через дефис"},
            {"num": 100,         "word": "one hundred / a hundred"},
            {"num": 101,         "word": "one hundred and one",                  "note": "and перед двузначным"},
            {"num": 256,         "word": "two hundred and fifty-six"},
            {"num": 1000,        "word": "one thousand / a thousand"},
            {"num": 1500,        "word": "one thousand five hundred / fifteen hundred"},
            {"num": 1000000,     "word": "one million"},
            {"num": 1000000000,  "word": "one billion"}
          ]
        }
      ],
      "pronunciation_rules": [
        "13–19: ударение на последний слог — thirTEEN, fourTEEN, fifTEEN",
        "30–90: ударение на первый слог — THIRty, FORty, FIFty",
        "В числах от 100: and перед двузначным (British English) — two hundred AND five",
        "Дефис обязателен между десятками и единицами: twenty-one, forty-five"
      ]
    },
    {
      "rule": "Правило 2 — Порядковые числительные (Ordinal Numbers)",
      "explanation": "Порядковые числительные обозначают порядок в ряду. Большинство образуются добавлением -th, но первые три имеют особые формы.",
      "table": [
        {"cardinal": "one",        "ordinal": "first",         "abbr": "1st",  "note": "исключение"},
        {"cardinal": "two",        "ordinal": "second",        "abbr": "2nd",  "note": "исключение"},
        {"cardinal": "three",      "ordinal": "third",         "abbr": "3rd",  "note": "исключение"},
        {"cardinal": "four",       "ordinal": "fourth",        "abbr": "4th",  "note": "правило"},
        {"cardinal": "five",       "ordinal": "fifth",         "abbr": "5th",  "note": "five → fifth"},
        {"cardinal": "six",        "ordinal": "sixth",         "abbr": "6th",  "note": "правило"},
        {"cardinal": "eight",      "ordinal": "eighth",        "abbr": "8th",  "note": "одна t"},
        {"cardinal": "nine",       "ordinal": "ninth",         "abbr": "9th",  "note": "nine → ninth"},
        {"cardinal": "twelve",     "ordinal": "twelfth",       "abbr": "12th", "note": "twelve → twelfth"},
        {"cardinal": "twenty",     "ordinal": "twentieth",     "abbr": "20th", "note": "y → ie + th"},
        {"cardinal": "thirty",     "ordinal": "thirtieth",     "abbr": "30th", "note": "y → ie + th"},
        {"cardinal": "twenty-one", "ordinal": "twenty-first",  "abbr": "21st", "note": "только последнее"},
        {"cardinal": "forty-two",  "ordinal": "forty-second",  "abbr": "42nd", "note": "только последнее"},
        {"cardinal": "sixty-three","ordinal": "sixty-third",   "abbr": "63rd", "note": "только последнее"}
      ],
      "spelling_rules": [
        "Большинство: + th → four → fourth, six → sixth, ten → tenth",
        "На -y: y → ieth → twenty → twentieth, thirty → thirtieth",
        "Исключения: first, second, third, fifth, eighth, ninth, twelfth",
        "Составные: только последнее слово меняется → twenty-first, forty-second"
      ]
    },
    {
      "rule": "Правило 3 — Числа в академическом письме",
      "explanation": "Академический стиль имеет строгие правила записи чисел. Нарушение этих правил считается стилистической ошибкой в научных работах.",
      "academic_rules": [
        {
          "rule": "Числа от 1 до 10 — словами",
          "examples": [
            {"correct": "The study involved nine participants.",   "wrong": "The study involved 9 participants."},
            {"correct": "Three main factors were identified.",     "wrong": "3 main factors were identified."}
          ]
        },
        {
          "rule": "Числа от 11 и выше — цифрами",
          "examples": [
            {"correct": "The survey included 150 respondents.",           "wrong": "The survey included one hundred fifty respondents."},
            {"correct": "The university was founded 85 years ago.",       "wrong": "The university was founded eighty-five years ago."}
          ]
        },
        {
          "rule": "Никогда не начинать предложение с цифры",
          "examples": [
            {"correct": "Forty-five students participated.",     "wrong": "45 students participated."},
            {"correct": "Two hundred researchers attended.",     "wrong": "200 researchers attended."}
          ]
        },
        {
          "rule": "Проценты и статистика — цифрами",
          "examples": [
            {"correct": "The success rate was 78%.",             "note": "Всегда цифрами"},
            {"correct": "Results showed a 3.5% increase.",       "note": "Десятичные — цифрами"}
          ]
        }
      ]
    },
    {
      "rule": "Правило 4 — Единицы измерения",
      "explanation": "В академических и научных текстах числа часто сопровождаются единицами измерения.",
      "measurement_categories": [
        {
          "type": "Длина (Length)",
          "units": [
            {"unit": "mm",  "full": "millimetre/millimeter", "example": "5 mm"},
            {"unit": "cm",  "full": "centimetre/centimeter", "example": "30 cm"},
            {"unit": "m",   "full": "metre/meter",           "example": "1.8 m"},
            {"unit": "km",  "full": "kilometre/kilometer",   "example": "15 km"}
          ]
        },
        {
          "type": "Вес (Weight)",
          "units": [
            {"unit": "g",  "full": "gram",      "example": "500 g"},
            {"unit": "kg", "full": "kilogram",  "example": "70 kg"},
            {"unit": "t",  "full": "tonne/ton", "example": "2.5 t"}
          ]
        },
        {
          "type": "Температура",
          "units": [
            {"unit": "°C", "full": "degrees Celsius",    "example": "37°C — thirty-seven degrees Celsius"},
            {"unit": "°F", "full": "degrees Fahrenheit", "example": "98.6°F — ninety-eight point six degrees Fahrenheit"}
          ]
        }
      ],
      "reading_decimals": [
        {"written": "3.14",        "spoken": "three point one four"},
        {"written": "0.5",         "spoken": "zero point five / nought point five"},
        {"written": "1,000,000",   "spoken": "one million (запятая разделяет тысячи)"},
        {"written": "1.5 km",      "spoken": "one point five kilometres"}
      ]
    },
    {
      "rule": "Правило 5 — Время, годы, дроби",
      "explanation": "Числа используются в особых контекстах со своими правилами произношения.",
      "contexts": [
        {
          "context": "Время (Time)",
          "examples": [
            {"written": "9:00",  "spoken": "nine o'clock / nine am"},
            {"written": "9:15",  "spoken": "nine fifteen / a quarter past nine"},
            {"written": "9:30",  "spoken": "nine thirty / half past nine"},
            {"written": "9:45",  "spoken": "nine forty-five / a quarter to ten"},
            {"written": "14:00", "spoken": "two pm / fourteen hundred (military)"}
          ]
        },
        {
          "context": "Годы (Years)",
          "examples": [
            {"written": "1934", "spoken": "nineteen thirty-four"},
            {"written": "2000", "spoken": "two thousand"},
            {"written": "2024", "spoken": "twenty twenty-four"},
            {"written": "1900", "spoken": "nineteen hundred"}
          ]
        },
        {
          "context": "Дроби (Fractions)",
          "examples": [
            {"written": "1/2", "spoken": "one half / a half"},
            {"written": "1/3", "spoken": "one third"},
            {"written": "1/4", "spoken": "one quarter / a quarter"},
            {"written": "3/4", "spoken": "three quarters"},
            {"written": "2/5", "spoken": "two fifths"}
          ]
        }
      ]
    },
    {
      "rule": "Правило 6 — Порядковые числительные в академическом контексте",
      "explanation": "Порядковые числительные широко используются в академическом письме для структурирования текста.",
      "academic_uses": [
        {
          "use": "Структура работы",
          "examples": [
            "The first chapter provides a theoretical framework.",
            "In the second section, we examine the methodology.",
            "The third finding is particularly significant."
          ]
        },
        {
          "use": "Ранжирование и рейтинги",
          "examples": [
            "The university ranked 1st in Central Asia.",
            "She graduated second in her class.",
            "This is the 10th edition of the textbook."
          ]
        }
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She is in the 3rd floor.",                 "correct": "She is on the 3rd floor.",               "explanation": "Этажи — предлог on, не in."},
    {"wrong": "The university was founded in nineteen thirty four.", "correct": "The university was founded in 1934.", "explanation": "Годы в академическом тексте пишутся цифрами."},
    {"wrong": "forty → fourtieth",                       "correct": "forty → fortieth",                       "explanation": "forty не fourty; fortieth не fourtieth."},
    {"wrong": "12 students participated (начало предложения)", "correct": "Twelve students participated.",     "explanation": "Никогда не начинать предложение с цифры."},
    {"wrong": "two hundred fifty-six",                   "correct": "two hundred and fifty-six",              "explanation": "В British English обязательно and перед двузначным."},
    {"wrong": "He was born in the 1990.",                "correct": "He was born in 1990.",                   "explanation": "Без артикля перед годом."},
    {"wrong": "the twenty-oneth chapter",               "correct": "the twenty-first chapter",               "explanation": "В составных порядковых меняется только последнее слово."}
  ],
  "academic_examples": [
    "The study recruited 45 undergraduate students from three universities.",
    "Approximately 67% of respondents reported a significant improvement.",
    "The first hypothesis was confirmed, while the second required further investigation.",
    "Kazakhstan covers an area of 2.7 million km², making it the ninth largest country.",
    "The 21st century has brought unprecedented changes to higher education."
  ],
  "dialogues": [
    {"title": "Статистика в научном докладе", "lines": [
      {"speaker": "Student",   "text": "Our study involved 120 participants from five different universities."},
      {"speaker": "Professor", "text": "And what percentage showed improvement?"},
      {"speaker": "Student",   "text": "Approximately 78% showed significant progress after the first semester."},
      {"speaker": "Professor", "text": "And the average age of participants?"},
      {"speaker": "Student",   "text": "The mean age was 19.4 years, ranging from 17 to 23."}
    ]},
    {"title": "Описание страны", "lines": [
      {"speaker": "A", "text": "Can you tell me some facts about Kazakhstan?"},
      {"speaker": "B", "text": "Kazakhstan has a population of about 19 million people."},
      {"speaker": "A", "text": "When did it gain independence?"},
      {"speaker": "B", "text": "On the 16th of December 1991 — the ninth largest country in the world."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice",  "question": "Как пишется число 40 словами?",                                         "options": ["fourty","forty","fourtie","fortie"],                                      "answer": "forty"},
    {"type": "multiple_choice",  "question": "Порядковое числительное от eight:",                                     "options": ["eighteenth","eighth","eightth","eightieth"],                             "answer": "eighth"},
    {"type": "multiple_choice",  "question": "Академический стиль. Как правильно написать начало предложения?",       "options": ["15 students attended.", "Fifteen students attended.", "Fifteen (15) students attended.", "The 15 students attended."], "answer": "Fifteen students attended."},
    {"type": "multiple_choice",  "question": "Как читается 3.5 km?",                                                  "options": ["three comma five","three point five kilometres","three and five","three dot five"], "answer": "three point five kilometres"},
    {"type": "multiple_choice",  "question": "Порядковое числительное от twenty-one:",                               "options": ["twenty-oneth","twenty-first","twentiest-one","twenty-onest"],             "answer": "twenty-first"},
    {"type": "multiple_choice",  "question": "Как правильно написать год 1934 в академическом тексте?",               "options": ["nineteen thirty-four","1934","nineteen-thirty-four","the year 1934"],      "answer": "1934"},
    {"type": "multiple_choice",  "question": "Как читается 9:45?",                                                    "options": ["nine and forty-five","a quarter to ten","nine forty-five past","quarter past nine"], "answer": "a quarter to ten"},
    {"type": "true_false",       "question": "The university was founded in the 1934.",                               "answer": "wrong",   "explanation": "Без артикля the перед годом: founded in 1934."},
    {"type": "true_false",       "question": "Kazakhstan covers 2.7 million km² — two point seven million square kilometres.", "answer": "correct", "explanation": "Верно! Десятичные читаются с point."},
    {"type": "free_input",       "question": "Напишите словами: 256",                                                 "answer": "two hundred and fifty-six"},
    {"type": "error_correction", "question": "The study involved 8 universities and two hundred twelve participants.", "answer": "The study involved eight universities and 212 participants."},
    {"type": "multiple_choice",  "question": "Как читается дробь 3/4?",                                               "options": ["three fourth","three quarter","three quarters","third quarters"],          "answer": "three quarters"},
    {"type": "fill_blank",       "question": "She graduated ___ (2nd) in her class. The ___ (75th) anniversary.",     "answer": "second / seventy-fifth"},
    {"type": "multiple_choice",  "question": "Температура минус 40 по Цельсию:",                                     "options": ["minus 40 degrees centigrade","40 below Celsius","minus 40 degrees Celsius","negative 40 Celsius degrees"], "answer": "minus 40 degrees Celsius"},
    {"type": "error_correction", "question": "He is in the 5th floor. The building has twenty 5 rooms.",              "answer": "He is on the 5th floor. The building has twenty-five rooms."},
    {"type": "free_input",       "question": "Напишите словами порядковое числительное: 12th",                        "answer": "twelfth"},
    {"type": "true_false",       "question": "Forty-five researchers attended the third annual conference.",           "answer": "correct", "explanation": "Верно! 45 в начале предложения словами; third — правильная форма."},
    {"type": "fill_blank",       "question": "The ___ (1st) chapter examines ___ (3) main theories. Data from ___ (45) participants.", "answer": "first / three / 45"},
    {"type": "error_correction", "question": "She is in the 3rd floor and was born in the 1990.", "answer": "She is on the 3rd floor and was born in 1990."},
    {"type": "academic_writing", "question": "Напишите абзац (5-6 предложений) о вашем университете: 3 количественных числительных, 2 порядковых, 1 процент, 1 дата основания.", "tip": "My university was founded in... It has approximately... students. The first faculty... In the third year... About 80% of graduates..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 8
  LIMIT 1
)
AND type = 'grammar';
