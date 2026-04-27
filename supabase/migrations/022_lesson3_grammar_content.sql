-- ============================================================
-- 022: Grammar content for A1 Beginner / Module 1 / Lesson 3
--      "This, That, These, Those"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "This, That, These, Those — Указательные местоимения",
  "explanation": "Указательные местоимения помогают показать на предметы вокруг нас — те что рядом и те что далеко. В английском языке их четыре: this, that, these, those.",
  "table": [
    {"type": "Singular (ед.ч.)", "near": "this — этот/эта/это", "far": "that — тот/та/то"},
    {"type": "Plural (мн.ч.)",   "near": "these — эти",          "far": "those — те"}
  ],
  "usage": [
    {"pronoun": "this/these", "rule": "Рядом с говорящим",     "examples": ["This is my book.", "These are my books.", "This is my friend Anna."]},
    {"pronoun": "that/those", "rule": "Далеко от говорящего",  "examples": ["That is her house.", "Those are big trees.", "That is the Eiffel Tower!"]}
  ],
  "structures": [
    {"type": "Утверждение",      "pattern": "This/That + is + noun",    "example": "This is a cat."},
    {"type": "Утверждение мн.ч.","pattern": "These/Those + are + noun", "example": "These are cats."},
    {"type": "Отрицание",        "pattern": "This/That + is not + noun","example": "That is not my bag."},
    {"type": "Вопрос",           "pattern": "Is + this/that + noun?",   "example": "Is this your pen?"},
    {"type": "Вопрос мн.ч.",     "pattern": "Are + these/those + noun?","example": "Are those your friends?"}
  ],
  "notes": [
    "This/That используются с глаголом is (единственное число)",
    "These/Those используются с глаголом are (множественное число)",
    "По телефону говорят: This is Anna speaking — не I am Anna",
    "Можно использовать как прилагательное: This book is good.",
    "Можно использовать как местоимение: This is good."
  ],
  "dialogues": [
    {"title": "Знакомство", "lines": [
      {"speaker": "A", "text": "This is my friend, Tom."},
      {"speaker": "B", "text": "Nice to meet you, Tom!"},
      {"speaker": "A", "text": "And those are my sisters over there."}
    ]},
    {"title": "В магазине", "lines": [
      {"speaker": "A", "text": "Excuse me, how much is this?"},
      {"speaker": "B", "text": "This is $5. And those are $3 each."},
      {"speaker": "A", "text": "Are these on sale too?"},
      {"speaker": "B", "text": "Yes, these are 50% off today!"}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Предмет рядом, один. ___ is my pen.",            "options": ["This","That","These","Those"],                                    "answer": "This"},
    {"type": "multiple_choice", "question": "Предметы далеко, несколько. ___ are big trees.", "options": ["This","That","These","Those"],                                    "answer": "Those"},
    {"type": "multiple_choice", "question": "These ___ my friends.",                          "options": ["is","are","am"],                                                 "answer": "are"},
    {"type": "true_false",      "question": "Those is a beautiful flower.",                   "answer": "wrong",   "explanation": "Those → are. Правильно: Those are beautiful flowers."},
    {"type": "free_input",      "question": "Переведи: Это моя сестра (она рядом).",          "answer": "This is my sister."},
    {"type": "multiple_choice", "question": "___ are your keys? (рядом, несколько)",          "options": ["Is this","Are these","Is that","Are those"],                     "answer": "Are these"},
    {"type": "multiple_choice", "question": "По телефону. Как правильно представиться?",      "options": ["I am Anna speaking","This is Anna speaking","That is Anna speaking"], "answer": "This is Anna speaking"},
    {"type": "true_false",      "question": "This book is very interesting.",                  "answer": "correct", "explanation": "Верно! This может использоваться как прилагательное перед существительным."},
    {"type": "free_input",      "question": "your / cat / is / this / ? → составьте вопрос", "answer": "Is this your cat?"},
    {"type": "multiple_choice", "question": "Тот дом — не мой (далеко).",                     "options": ["This is not my house.","That is not my house.","Those are not my house."], "answer": "That is not my house."},
    {"type": "free_input",      "question": "Исправьте: These is a good idea.",               "answer": "This is a good idea."},
    {"type": "multiple_choice", "question": "___ students are very smart. (далеко, несколько)","options": ["This","That","These","Those"],                                  "answer": "Those"}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 3
  LIMIT 1
)
AND type = 'grammar';
