-- ============================================================
-- 023: Grammar content for A1 Beginner / Module 1 / Lesson 4
--      "Singular & Plural Nouns"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Singular & Plural Nouns — Единственное и множественное число",
  "explanation": "Существительное (noun) — слово, обозначающее предмет, человека, место или идею. В английском языке существительные изменяются по числу. Правильное образование множественного числа — основа академического письма.",
  "noun_types": [
    {"type": "Люди (People)",     "examples": ["student", "professor", "doctor"]},
    {"type": "Места (Places)",    "examples": ["university", "library", "city"]},
    {"type": "Предметы (Things)", "examples": ["book", "laptop", "pen"]},
    {"type": "Идеи (Ideas)",      "examples": ["knowledge", "freedom", "love"]}
  ],
  "rules": [
    {
      "rule": "Правило 1 — Основное: добавить -s",
      "explanation": "Большинство существительных образуют множественное число добавлением -s.",
      "examples": [
        {"singular": "book",    "plural": "books"},
        {"singular": "student", "plural": "students"},
        {"singular": "laptop",  "plural": "laptops"}
      ]
    },
    {
      "rule": "Правило 2 — Окончания -s/-ss/-sh/-ch/-x/-z → добавить -es",
      "explanation": "Если существительное оканчивается на -s, -ss, -sh, -ch, -x или -z, добавляем -es для удобства произношения.",
      "examples": [
        {"singular": "class", "plural": "classes"},
        {"singular": "dish",  "plural": "dishes"},
        {"singular": "watch", "plural": "watches"},
        {"singular": "box",   "plural": "boxes"},
        {"singular": "bus",   "plural": "buses"},
        {"singular": "quiz",  "plural": "quizzes"}
      ]
    },
    {
      "rule": "Правило 3 — Согласная + -y → убрать -y, добавить -ies",
      "explanation": "Если перед -y стоит согласная, убираем -y и добавляем -ies. Если гласная — просто -s.",
      "examples": [
        {"singular": "city",       "plural": "cities",       "note": "согласная + y"},
        {"singular": "university", "plural": "universities", "note": "согласная + y"},
        {"singular": "country",    "plural": "countries",    "note": "согласная + y"},
        {"singular": "day",        "plural": "days",         "note": "гласная + y"},
        {"singular": "key",        "plural": "keys",         "note": "гласная + y"}
      ]
    },
    {
      "rule": "Правило 4 — Окончания -f/-fe → заменить на -ves",
      "explanation": "Некоторые существительные на -f/-fe меняют окончание на -ves. Есть исключения.",
      "examples": [
        {"singular": "leaf",  "plural": "leaves"},
        {"singular": "wolf",  "plural": "wolves"},
        {"singular": "knife", "plural": "knives"},
        {"singular": "life",  "plural": "lives"},
        {"singular": "roof",  "plural": "roofs",  "note": "исключение — просто -s"},
        {"singular": "chief", "plural": "chiefs", "note": "исключение — просто -s"}
      ]
    },
    {
      "rule": "Правило 5 — Неправильные формы (Irregular Plurals)",
      "explanation": "Ряд существительных образуют множественное число нестандартно — их нужно запомнить.",
      "examples": [
        {"singular": "man",    "plural": "men",      "change": "a → e"},
        {"singular": "woman",  "plural": "women",    "change": "a → e"},
        {"singular": "child",  "plural": "children", "change": "+ ren"},
        {"singular": "tooth",  "plural": "teeth",    "change": "oo → ee"},
        {"singular": "foot",   "plural": "feet",     "change": "oo → ee"},
        {"singular": "mouse",  "plural": "mice",     "change": "ouse → ice"},
        {"singular": "person", "plural": "people",   "change": "другое слово"},
        {"singular": "ox",     "plural": "oxen",     "change": "+ en"}
      ]
    },
    {
      "rule": "Правило 6 — Неизменяемые существительные (Invariable Nouns)",
      "explanation": "Некоторые существительные имеют одинаковую форму в обоих числах.",
      "examples": [
        {"singular": "sheep",    "plural": "sheep"},
        {"singular": "fish",     "plural": "fish"},
        {"singular": "deer",     "plural": "deer"},
        {"singular": "aircraft", "plural": "aircraft"},
        {"singular": "series",   "plural": "series"},
        {"singular": "species",  "plural": "species"}
      ]
    }
  ],
  "academic_examples": [
    "Many students face difficulties in their first year at universities.",
    "The species of fish found in these rivers are endangered.",
    "The men and women in this study showed different responses."
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "book → ?",    "options": ["bookes","books","bookies"],     "answer": "books"},
    {"type": "multiple_choice", "question": "class → ?",   "options": ["classs","classes","classies"],  "answer": "classes"},
    {"type": "multiple_choice", "question": "city → ?",    "options": ["citys","cityes","cities"],      "answer": "cities"},
    {"type": "multiple_choice", "question": "day → ?",     "options": ["daies","days","dayes"],         "answer": "days"},
    {"type": "multiple_choice", "question": "knife → ?",   "options": ["knifes","knives","knifees"],    "answer": "knives"},
    {"type": "multiple_choice", "question": "child → ?",   "options": ["childs","childes","children"],  "answer": "children"},
    {"type": "multiple_choice", "question": "sheep → ?",   "options": ["sheeps","sheep","sheepen"],     "answer": "sheep"},
    {"type": "free_input",      "question": "woman → ?",   "answer": "women"},
    {"type": "true_false",      "question": "The deers in the forest are beautiful.", "answer": "wrong", "explanation": "deer — неизменяемое. Правильно: The deer in the forest are beautiful."},
    {"type": "multiple_choice", "question": "roof → ?",    "options": ["rooves","roofs","roofes"],      "answer": "roofs"},
    {"type": "error_correction","question": "Many womans and mans study at this university.", "answer": "Many women and men study at this university."},
    {"type": "free_input",      "question": "university → ?", "answer": "universities"},
    {"type": "true_false",      "question": "There are three fish in the aquarium.", "answer": "correct", "explanation": "Fish — неизменяемое существительное. Верно!"},
    {"type": "multiple_choice", "question": "The research involved 50 ___ from five ___.", "options": ["persons / countrys","people / countries","peoples / countryes"], "answer": "people / countries"},
    {"type": "free_input",      "question": "tooth → ?",   "answer": "teeth"}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 4
  LIMIT 1
)
AND type = 'grammar';
