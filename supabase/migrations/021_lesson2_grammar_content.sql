-- ============================================================
-- 021: Grammar content for A1 Beginner / Module 1 / Lesson 2
--      "The Alphabet & Sounds"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "The Alphabet & Sounds",
  "explanation": "В английском алфавите 26 букв. Каждая буква имеет своё название и один или несколько звуков. Знание алфавита — основа грамотного чтения и письма.",
  "alphabet": [
    {"letter": "A a", "name": "eɪ",       "examples": ["apple", "ant"]},
    {"letter": "B b", "name": "biː",      "examples": ["book", "ball"]},
    {"letter": "C c", "name": "siː",      "examples": ["cat", "city"]},
    {"letter": "D d", "name": "diː",      "examples": ["dog", "day"]},
    {"letter": "E e", "name": "iː",       "examples": ["egg", "end"]},
    {"letter": "F f", "name": "ef",       "examples": ["fish", "fan"]},
    {"letter": "G g", "name": "dʒiː",    "examples": ["good", "girl"]},
    {"letter": "H h", "name": "eɪtʃ",   "examples": ["house", "hat"]},
    {"letter": "I i", "name": "aɪ",      "examples": ["in", "ice"]},
    {"letter": "J j", "name": "dʒeɪ",   "examples": ["job", "jump"]},
    {"letter": "K k", "name": "keɪ",     "examples": ["key", "kick"]},
    {"letter": "L l", "name": "el",      "examples": ["long", "late"]},
    {"letter": "M m", "name": "em",      "examples": ["man", "map"]},
    {"letter": "N n", "name": "en",      "examples": ["name", "now"]},
    {"letter": "O o", "name": "oʊ",      "examples": ["old", "open"]},
    {"letter": "P p", "name": "piː",     "examples": ["park", "pen"]},
    {"letter": "Q q", "name": "kjuː",   "examples": ["queen", "quiz"]},
    {"letter": "R r", "name": "ɑːr",    "examples": ["read", "run"]},
    {"letter": "S s", "name": "es",      "examples": ["sun", "sit"]},
    {"letter": "T t", "name": "tiː",     "examples": ["ten", "time"]},
    {"letter": "U u", "name": "juː",     "examples": ["up", "under"]},
    {"letter": "V v", "name": "viː",     "examples": ["very", "van"]},
    {"letter": "W w", "name": "ˈdʌbljuː","examples": ["work", "was"]},
    {"letter": "X x", "name": "eks",     "examples": ["box", "fox"]},
    {"letter": "Y y", "name": "waɪ",     "examples": ["yes", "year"]},
    {"letter": "Z z", "name": "zed",     "examples": ["zoo", "zero"]}
  ],
  "vowels": ["A", "E", "I", "O", "U"],
  "rules": [
    {"combo": "C",  "sound": "s или k",  "note": "Перед E I Y читается [s]: city. В остальных — [k]: cat"},
    {"combo": "G",  "sound": "dʒ или g", "note": "Перед E I Y читается [dʒ]: gym. В остальных — [g]: good"},
    {"combo": "TH", "sound": "θ или ð",  "note": "Глухой [θ]: think. Звонкий [ð]: this"},
    {"combo": "SH", "sound": "ʃ",        "note": "Всегда [ʃ]: she, fish, shop"},
    {"combo": "CH", "sound": "tʃ",       "note": "Всегда [tʃ]: chair, church"},
    {"combo": "QU", "sound": "kw",       "note": "Всегда [kw]: queen, quick"}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Сколько букв в английском алфавите?",    "options": ["24","26","28","30"],             "answer": "26"},
    {"type": "multiple_choice", "question": "Какие из этих букв являются гласными?",   "options": ["A E I O U","A B C D E","A E O U Y"], "answer": "A E I O U"},
    {"type": "multiple_choice", "question": "Как читается буква C в слове city?",      "options": ["[k]","[s]","[ch]"],             "answer": "[s]"},
    {"type": "multiple_choice", "question": "Как читается буквосочетание SH?",          "options": ["[s]","[h]","[ʃ]","[sk]"],      "answer": "[ʃ]"},
    {"type": "multiple_choice", "question": "В каком слове буква G читается как [dʒ]?","options": ["good","gym","get","go"],        "answer": "gym"},
    {"type": "multiple_choice", "question": "Как называется буква W?",                 "options": ["vee","double-u","wee"],         "answer": "double-u"},
    {"type": "multiple_choice", "question": "Как читается QU в слове queen?",          "options": ["[kj]","[kw]","[qu]"],          "answer": "[kw]"},
    {"type": "free_input",      "question": "Напишите 3 буквы алфавита после K по порядку", "answer": "L M N"},
    {"type": "true_false",      "question": "Буква Y всегда является согласной.",      "answer": "wrong", "explanation": "Y может быть и гласной: gym"},
    {"type": "multiple_choice", "question": "Какое буквосочетание читается как [tʃ]?", "options": ["TH","SH","CH","QU"],           "answer": "CH"}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 2
  LIMIT 1
)
AND type = 'grammar';
