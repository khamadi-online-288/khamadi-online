-- ============================================================
-- 020: Grammar content for A1 Beginner / Module 1 / Lesson 1
--      "Meet & Greet — Verb To Be"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Verb To Be — am / is / are",
  "explanation": "Глагол to be означает быть или являться. Это самый важный глагол в английском языке. В настоящем времени он имеет три формы.",
  "table": [
    {"pronoun": "I",               "form": "am",  "short": "I'm",        "example": "I am a student."},
    {"pronoun": "He / She / It",   "form": "is",  "short": "He's / She's / It's", "example": "She is a teacher."},
    {"pronoun": "You / We / They", "form": "are", "short": "You're / We're / They're", "example": "They are friends."}
  ],
  "negation": [
    {"full": "I am not",     "short": "I'm not"},
    {"full": "He is not",    "short": "He isn't"},
    {"full": "They are not", "short": "They aren't"}
  ],
  "questions": [
    "Am I late?",
    "Is she a doctor?",
    "Are they students?"
  ],
  "notes": [
    "После I всегда пишем am — никогда is или are",
    "После he, she, it всегда пишем is",
    "После you, we, they всегда пишем are"
  ],
  "exercises": [
    {
      "type": "multiple_choice",
      "question": "I ___ a student.",
      "options": ["am", "is", "are"],
      "answer": "am"
    },
    {
      "type": "multiple_choice",
      "question": "She ___ a teacher.",
      "options": ["am", "is", "are"],
      "answer": "is"
    },
    {
      "type": "multiple_choice",
      "question": "We ___ friends.",
      "options": ["am", "is", "are"],
      "answer": "are"
    },
    {
      "type": "true_false",
      "question": "He am happy.",
      "answer": "wrong",
      "explanation": "Правильно: He IS happy"
    },
    {
      "type": "word_order",
      "question": "she / doctor / is / a / ?",
      "answer": "Is she a doctor?"
    }
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 1
  LIMIT 1
)
AND type = 'grammar';
