-- ============================================================
-- 026: Grammar content for A1 Beginner / Module 1 / Lesson 7
--      "Adjectives"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Adjectives — Прилагательные",
  "academic_intro": "Прилагательные (adjectives) — это слова которые описывают или характеризуют существительные и местоимения. В английском языке прилагательные не изменяются по роду, числу и падежу, всегда стоят перед существительным в атрибутивной позиции, и подчиняются строгому порядку при использовании нескольких прилагательных подряд.",
  "rules": [
    {
      "rule": "Правило 1 — Прилагательные не изменяются",
      "explanation": "В отличие от русского языка где прилагательные согласуются с существительным по роду, числу и падежу, английские прилагательные всегда имеют одну форму.",
      "comparison": [
        {"russian": "красивый студент / красивая студентка / красивые студенты", "english": "a beautiful student / a beautiful female student / beautiful students", "note": "beautiful не изменяется"},
        {"russian": "интересная книга / интересный фильм / интересное задание",    "english": "an interesting book / an interesting film / an interesting task",  "note": "interesting не изменяется"},
        {"russian": "новый университет / новая библиотека / новые здания",         "english": "a new university / a new library / new buildings",                "note": "new не изменяется"}
      ]
    },
    {
      "rule": "Правило 2 — Позиция прилагательного в предложении",
      "explanation": "Английские прилагательные занимают две позиции: атрибутивную (перед существительным) и предикативную (после глагола-связки).",
      "positions": [
        {
          "type": "Атрибутивная (Attributive)",
          "pattern": "Adjective + Noun",
          "examples": [
            {"sentence": "a difficult exam",         "translation": "сложный экзамен"},
            {"sentence": "an important research",    "translation": "важное исследование"},
            {"sentence": "the modern university",    "translation": "современный университет"},
            {"sentence": "a comprehensive analysis", "translation": "всесторонний анализ"}
          ]
        },
        {
          "type": "Предикативная (Predicative)",
          "pattern": "Subject + Verb + Adjective",
          "examples": [
            {"sentence": "The exam is difficult.",          "translation": "Экзамен сложный."},
            {"sentence": "The research seems important.",   "translation": "Исследование кажется важным."},
            {"sentence": "The university looks modern.",    "translation": "Университет выглядит современным."},
            {"sentence": "The results appear significant.", "translation": "Результаты выглядят значимыми."}
          ]
        }
      ],
      "note": "Только предикативно: afraid, asleep, awake, alive, alone — They are afraid. НЕ: an afraid student."
    },
    {
      "rule": "Правило 3 — Порядок прилагательных (OSASCOMP)",
      "explanation": "Когда несколько прилагательных стоят перед существительным, они следуют строгому порядку. Нарушение порядка делает речь неестественной.",
      "order": [
        {"position": 1, "category": "Мнение/Оценка (Opinion)",  "examples": "beautiful, interesting, important, excellent, terrible"},
        {"position": 2, "category": "Размер (Size)",             "examples": "big, small, large, tiny, enormous"},
        {"position": 3, "category": "Возраст (Age)",             "examples": "old, young, new, ancient, modern"},
        {"position": 4, "category": "Форма (Shape)",             "examples": "round, square, long, short, narrow"},
        {"position": 5, "category": "Цвет (Colour)",             "examples": "red, blue, dark, light, golden"},
        {"position": 6, "category": "Происхождение (Origin)",    "examples": "Kazakh, European, Asian, local"},
        {"position": 7, "category": "Материал (Material)",       "examples": "wooden, metal, glass, leather, silk"},
        {"position": 8, "category": "Назначение (Purpose)",      "examples": "sleeping (bag), writing (desk), research (paper)"}
      ],
      "examples": [
        {"sentence": "an important new scientific discovery",      "note": "Opinion + Age + Origin"},
        {"sentence": "a small round wooden table",                 "note": "Size + Shape + Material"},
        {"sentence": "the excellent young Kazakh researcher",      "note": "Opinion + Age + Origin"}
      ],
      "memory_tip": "OSASCOMP: Opinion → Size → Age → Shape → Colour → Origin → Material → Purpose"
    },
    {
      "rule": "Правило 4 — Категории прилагательных",
      "explanation": "Знание категорий помогает выбирать точные слова в академических текстах.",
      "categories": [
        {"category": "Описательные (Descriptive)",    "examples": ["tall, short, heavy, light, fast, slow"],       "academic": ["significant, comprehensive, substantial, systematic"]},
        {"category": "Количественные (Quantitative)", "examples": ["many, few, several, sufficient, adequate"],    "academic": ["considerable, negligible, extensive, minimal"]},
        {"category": "Демонстративные (Demonstrative)","examples": ["this, that, these, those"],                   "academic": ["the aforementioned, the following, the latter"]},
        {"category": "Притяжательные (Possessive)",   "examples": ["my, your, his, her, its, our, their"],         "academic": ["the study's results, the author's findings"]},
        {"category": "Вопросительные (Interrogative)","examples": ["which, what, whose"],                          "academic": ["which methodology, what approach"]}
      ]
    },
    {
      "rule": "Правило 5 — Прилагательные в академическом письме",
      "explanation": "Академический стиль требует точных прилагательных. Расплывчатые слова заменяются более конкретными эквивалентами.",
      "upgrades": [
        {"basic": "good",        "academic": ["effective, beneficial, valuable, significant, substantial"]},
        {"basic": "bad",         "academic": ["ineffective, detrimental, inadequate, problematic, flawed"]},
        {"basic": "big",         "academic": ["substantial, considerable, extensive, significant, major"]},
        {"basic": "small",       "academic": ["minimal, negligible, minor, limited, marginal"]},
        {"basic": "important",   "academic": ["crucial, critical, fundamental, essential, pivotal"]},
        {"basic": "interesting", "academic": ["noteworthy, compelling, significant, relevant, pertinent"]},
        {"basic": "many",        "academic": ["numerous, a considerable number of, a substantial proportion of"]},
        {"basic": "different",   "academic": ["diverse, varied, distinct, disparate, heterogeneous"]}
      ]
    },
    {
      "rule": "Правило 6 — Прилагательные с суффиксами",
      "explanation": "Знание суффиксов помогает расширить словарный запас и распознавать прилагательные в текстах.",
      "suffixes": [
        {"suffix": "-ful",      "meaning": "полный чего-то",      "examples": ["useful, careful, successful, powerful, meaningful"]},
        {"suffix": "-less",     "meaning": "без чего-то",          "examples": ["useless, careless, homeless, endless, worthless"]},
        {"suffix": "-ous",      "meaning": "обладающий качеством", "examples": ["famous, dangerous, numerous, serious, obvious"]},
        {"suffix": "-al",       "meaning": "относящийся к",        "examples": ["national, cultural, educational, theoretical"]},
        {"suffix": "-ic",       "meaning": "относящийся к",        "examples": ["academic, scientific, economic, systematic"]},
        {"suffix": "-ive",      "meaning": "склонный к",           "examples": ["effective, creative, productive, comprehensive"]},
        {"suffix": "-able/-ible","meaning": "способный быть",      "examples": ["reliable, sustainable, flexible, responsible"]},
        {"suffix": "-ary/-ory", "meaning": "относящийся к",        "examples": ["primary, secondary, introductory, compulsory"]}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She is a beauty woman.",                          "correct": "She is a beautiful woman.",                   "explanation": "beauty — существительное, beautiful — прилагательное."},
    {"wrong": "He gave me an importance advice.",               "correct": "He gave me important advice.",               "explanation": "importance — существительное. Кроме того advice неисчисляемое — без an."},
    {"wrong": "a French young famous scientist",                "correct": "a famous young French scientist",            "explanation": "Порядок: Opinion (famous) → Age (young) → Origin (French)."},
    {"wrong": "The results were very significance.",            "correct": "The results were very significant.",         "explanation": "significance — существительное, significant — прилагательное."},
    {"wrong": "It is a bored lecture.",                         "correct": "It is a boring lecture.",                    "explanation": "boring описывает предмет (лекция скучная). bored — человек скучает."},
    {"wrong": "The childrens are very intelligents.",           "correct": "The children are very intelligent.",         "explanation": "Прилагательные не имеют множественного числа — никогда не добавляем -s."}
  ],
  "academic_examples": [
    "The study presents a comprehensive analysis of current educational practices.",
    "Researchers identified several significant correlations between the variables.",
    "The results indicate a substantial improvement in academic performance.",
    "This innovative approach offers considerable advantages over traditional methods.",
    "The data reveals numerous complex interdependencies among the factors studied."
  ],
  "dialogues": [
    {"title": "Обсуждение научной статьи", "lines": [
      {"speaker": "Student A", "text": "Have you read the new research paper on sustainable energy?"},
      {"speaker": "Student B", "text": "Yes! It is a comprehensive and well-structured study."},
      {"speaker": "Student A", "text": "The theoretical framework seems particularly interesting."},
      {"speaker": "Student B", "text": "Absolutely. The practical implications are significant too."}
    ]},
    {"title": "Описание университета", "lines": [
      {"speaker": "A", "text": "What is your university like?"},
      {"speaker": "B", "text": "It is a large modern institution with excellent facilities."},
      {"speaker": "A", "text": "Are the professors good?"},
      {"speaker": "B", "text": "They are highly qualified and very supportive. The academic environment is stimulating."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice",  "question": "Выберите правильную форму: The exam was very ___.",                      "options": ["difficulty","difficult","difficultly","difficulties"],         "answer": "difficult"},
    {"type": "multiple_choice",  "question": "Какое предложение верно?",                                               "options": ["She is a beauty student.","She is a beautiful student.","She is a beautifull student.","She is beautiful student."], "answer": "She is a beautiful student."},
    {"type": "multiple_choice",  "question": "Правильный порядок прилагательных:",                                    "options": ["a French young famous scientist","a famous French young scientist","a famous young French scientist","a young famous French scientist"], "answer": "a famous young French scientist"},
    {"type": "multiple_choice",  "question": "Академический эквивалент слова big:",                                   "options": ["very big","substantial","much big","bigly"],                   "answer": "substantial"},
    {"type": "multiple_choice",  "question": "Какое прилагательное используется только предикативно?",                "options": ["beautiful","important","afraid","large"],                      "answer": "afraid"},
    {"type": "multiple_choice",  "question": "The lecture was ___. (студенты скучали)",                               "options": ["bored","boring","boringly","boredom"],                         "answer": "boring"},
    {"type": "multiple_choice",  "question": "Выберите правильный суффикс: meaning + ___",                            "options": ["meaningfull","meaningfully","meaningful","meaningfulness"],    "answer": "meaningful"},
    {"type": "true_false",       "question": "The childrens are very intelligents.",                                   "answer": "wrong",   "explanation": "Прилагательные не изменяются: The children are very intelligent."},
    {"type": "true_false",       "question": "a small round wooden table",                                             "answer": "correct", "explanation": "Верный порядок: Size (small) → Shape (round) → Material (wooden)."},
    {"type": "error_correction", "question": "She gave an importance and comprehensive presentation about the educationals system.", "answer": "She gave an important and comprehensive presentation about the educational system."},
    {"type": "fill_blank",       "question": "___ (large) ___ (old) ___ (Kazakh) building houses the main library.",  "answer": "large old Kazakh"},
    {"type": "multiple_choice",  "question": "Академический стиль. Замените good: The methodology was ___ for this research.", "options": ["very good","nice","appropriate","goodly"],            "answer": "appropriate"},
    {"type": "multiple_choice",  "question": "Какой суффикс означает без чего-то?",                                   "options": ["-ful","-less","-ous","-ive"],                                  "answer": "-less"},
    {"type": "error_correction", "question": "a French young famous tall scientist",                                   "answer": "a famous tall young French scientist"},
    {"type": "fill_blank",       "question": "The study provides ___ evidence of the ___ impact of technology on ___ performance.", "answer": "considerable / significant / academic"},
    {"type": "true_false",       "question": "It is a bored lecture with difficulty content.",                         "answer": "wrong",   "explanation": "Правильно: It is a boring lecture with difficult content."},
    {"type": "multiple_choice",  "question": "Слово systematic относится к суффиксу:",                                "options": ["-ful","-less","-ic","-ive"],                                   "answer": "-ic"},
    {"type": "error_correction", "question": "The researchers found a significance difference between the two importance groups.", "answer": "The researchers found a significant difference between the two important groups."},
    {"type": "fill_blank",       "question": "Замените в тексте: The study had a ___ (big) impact on ___ (many) researchers.", "answer": "substantial / numerous"},
    {"type": "academic_writing", "question": "Напишите 5 предложений описывая ваш университет используя минимум 10 прилагательных из разных категорий. Используйте атрибутивную и предикативную позицию.", "tip": "Используйте: comprehensive, significant, innovative, substantial, diverse, qualified, modern, extensive, theoretical, practical..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 7
  LIMIT 1
)
AND type = 'grammar';
