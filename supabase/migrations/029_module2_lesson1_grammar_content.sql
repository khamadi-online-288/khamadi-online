-- ============================================================
-- 029: Grammar content for A1 Beginner / Module 2 / Lesson 1
--      "Possessive Case"
-- ============================================================
UPDATE english_lesson_sections
SET content = $json${
  "title": "Possessive Case — Притяжательный падеж",
  "academic_intro": "Притяжательный падеж (possessive case) в английском языке выражает принадлежность одного предмета или существа другому. В отличие от русского языка где принадлежность выражается падежными окончаниями (книга студента, работа профессора), в английском используются два основных способа: притяжательная конструкция с апострофом (apostrophe s) и предложная конструкция с of. Правильный выбор между этими конструкциями — важный элемент академического письма. Ошибки в использовании апострофа являются одними из наиболее распространённых в письменном английском языке.",
  "rules": [
    {
      "rule": "Правило 1 — Притяжательная конструкция с апострофом (Apostrophe S)",
      "explanation": "Апостроф + s (\u0027s) добавляется к существительному обозначающему владельца. Эта конструкция называется Saxon Genitive или Genitive Case. В академическом письме она используется преимущественно с одушевлёнными существительными — людьми, животными, организациями.",
      "pattern": "Owner + \u0027s + Thing owned",
      "examples": [
        {"sentence": "the student\u0027s notebook", "translation": "тетрадь студента", "breakdown": "student + \u0027s + notebook"},
        {"sentence": "the professor\u0027s research", "translation": "исследование профессора", "breakdown": "professor + \u0027s + research"},
        {"sentence": "Kazakhstan\u0027s economy", "translation": "экономика Казахстана", "breakdown": "Kazakhstan + \u0027s + economy"},
        {"sentence": "the university\u0027s library", "translation": "библиотека университета", "breakdown": "university + \u0027s + library"},
        {"sentence": "the author\u0027s argument", "translation": "аргумент автора", "breakdown": "author + \u0027s + argument"},
        {"sentence": "Einstein\u0027s theory", "translation": "теория Эйнштейна", "breakdown": "Einstein + \u0027s + theory"}
      ],
      "usage_contexts": [
        "Люди: the teacher\u0027s explanation, the researcher\u0027s findings",
        "Животные: the cat\u0027s behaviour, the eagle\u0027s wingspan",
        "Страны и города: Russia\u0027s population, Almaty\u0027s infrastructure",
        "Организации: the university\u0027s policy, the government\u0027s decision",
        "Время: yesterday\u0027s news, last year\u0027s results, today\u0027s lecture"
      ]
    },
    {
      "rule": "Правило 2 — Множественное число и апостроф",
      "explanation": "Правила использования апострофа кардинально меняются во множественном числе. Это одна из самых распространённых ошибок в письменном английском — даже у носителей языка. Необходимо чётко различать три случая.",
      "cases": [
        {
          "case": "Единственное число → добавить \u0027s",
          "rule": "Singular noun + \u0027s",
          "examples": [
            {"example": "the student\u0027s book", "note": "один студент"},
            {"example": "the professor\u0027s office", "note": "один профессор"},
            {"example": "the child\u0027s toy", "note": "один ребёнок"}
          ]
        },
        {
          "case": "Множественное число на -s → добавить только апостроф",
          "rule": "Plural noun (ending in -s) + \u0027 (apostrophe only)",
          "examples": [
            {"example": "the students\u0027 books", "note": "книги нескольких студентов"},
            {"example": "the professors\u0027 offices", "note": "кабинеты нескольких профессоров"},
            {"example": "the researchers\u0027 findings", "note": "находки нескольких исследователей"}
          ]
        },
        {
          "case": "Неправильное множественное число → добавить \u0027s",
          "rule": "Irregular plural + \u0027s",
          "examples": [
            {"example": "the children\u0027s education", "note": "children — неправильное мн.ч."},
            {"example": "the men\u0027s department", "note": "men — неправильное мн.ч."},
            {"example": "the women\u0027s achievements", "note": "women — неправильное мн.ч."},
            {"example": "the people\u0027s choice", "note": "people — неправильное мн.ч."}
          ]
        }
      ],
      "comparison_table": [
        {"singular": "the student\u0027s report (один студент)", "plural": "the students\u0027 report (несколько студентов)"},
        {"singular": "the professor\u0027s lecture", "plural": "the professors\u0027 lectures"},
        {"singular": "the child\u0027s rights", "plural": "the children\u0027s rights"}
      ]
    },
    {
      "rule": "Правило 3 — Имена собственные на -s",
      "explanation": "Имена и фамилии оканчивающиеся на -s создают особую сложность. Существуют два допустимых варианта, однако академический стиль предпочитает один из них.",
      "options": [
        {
          "option": "Вариант 1: Name + \u0027s (предпочтительный)",
          "examples": [
            {"example": "James\u0027s research", "note": "Джеймс — один человек"},
            {"example": "Dickens\u0027s novels", "note": "произведения Диккенса"},
            {"example": "Marx\u0027s theories", "note": "теории Маркса"}
          ]
        },
        {
          "option": "Вариант 2: Name + \u0027 (допустимый)",
          "examples": [
            {"example": "James\u0027 research", "note": "также правильно"},
            {"example": "Dickens\u0027 novels", "note": "также правильно"},
            {"example": "Marx\u0027 theories", "note": "также правильно"}
          ]
        }
      ],
      "note": "В академическом письме выберите один вариант и придерживайтесь его последовательно во всём тексте. Смешивание стилей недопустимо.",
      "special_cases": [
        {"example": "for goodness\u0027 sake", "note": "устойчивое выражение — только апостроф"},
        {"example": "for conscience\u0027 sake", "note": "устойчивое выражение — только апостроф"}
      ]
    },
    {
      "rule": "Правило 4 — Конструкция с OF",
      "explanation": "Предложная конструкция с of используется для выражения принадлежности преимущественно с неодушевлёнными предметами, абстрактными понятиями и в официальном академическом стиле. В научных текстах конструкция с of встречается значительно чаще чем апостроф.",
      "pattern": "Thing owned + of + Owner",
      "examples": [
        {"apostrophe": "the book\u0027s cover", "of_construction": "the cover of the book", "note": "оба варианта возможны"},
        {"apostrophe": "—", "of_construction": "the results of the experiment", "note": "только of — неодушевлённое"},
        {"apostrophe": "—", "of_construction": "the beginning of the chapter", "note": "только of — абстрактное"},
        {"apostrophe": "—", "of_construction": "the end of the semester", "note": "только of"},
        {"apostrophe": "—", "of_construction": "the importance of education", "note": "только of — абстрактное понятие"},
        {"apostrophe": "—", "of_construction": "the analysis of the data", "note": "академический стиль"}
      ],
      "when_to_use_of": [
        "Неодушевлённые предметы: the door of the building, the roof of the house",
        "Абстрактные понятия: the purpose of the study, the significance of the findings",
        "Длинные noun phrases: the results of the first stage of the experiment",
        "Официальный академический стиль: the Faculty of Economics, the University of Cambridge",
        "Части целого: the majority of students, the first chapter of the book"
      ]
    },
    {
      "rule": "Правило 5 — Апостроф vs OF: правила выбора",
      "explanation": "Выбор между апострофом и of определяется несколькими факторами: одушевлённость владельца, стиль текста, длина конструкции и академические конвенции. Знание этих правил отличает грамотного академического писателя.",
      "decision_guide": [
        {
          "criterion": "Одушевлённый владелец (человек, животное, страна)",
          "preference": "Апостроф \u0027s",
          "examples": ["the professor\u0027s methodology", "the government\u0027s policy", "Darwin\u0027s theory"]
        },
        {
          "criterion": "Неодушевлённый владелец (предмет, явление)",
          "preference": "OF",
          "examples": ["the results of the study", "the purpose of the research", "the door of the classroom"]
        },
        {
          "criterion": "Время",
          "preference": "Апостроф \u0027s",
          "examples": ["today\u0027s agenda", "last year\u0027s data", "yesterday\u0027s findings", "this month\u0027s report"]
        },
        {
          "criterion": "Академический официальный стиль",
          "preference": "OF для длинных конструкций",
          "examples": ["the methodology of the first stage of the longitudinal study"]
        },
        {
          "criterion": "Устойчивые выражения",
          "preference": "Запомнить как исключения",
          "examples": ["at arm\u0027s length", "a stone\u0027s throw", "for heaven\u0027s sake", "a day\u0027s work"]
        }
      ]
    },
    {
      "rule": "Правило 6 — Цепочки притяжательных конструкций и независимый притяжательный падеж",
      "explanation": "В английском языке возможны цепочки притяжательных конструкций. Кроме того существует независимый притяжательный падеж когда существительное опускается потому что оно понятно из контекста.",
      "chains": [
        {"example": "my professor\u0027s colleague\u0027s research", "translation": "исследование коллеги моего профессора", "note": "допустимо но громоздко"},
        {"example": "the Dean of the Faculty\u0027s decision", "translation": "решение декана факультета", "note": "апостроф к последнему слову"},
        {"better": "the decision of the Dean of the Faculty", "note": "of предпочтительнее для длинных цепочек"}
      ],
      "independent_possessive": {
        "explanation": "Когда существительное понятно из контекста оно опускается — остаётся только притяжательная форма.",
        "examples": [
          {"sentence": "This is not my book — it is Sarah\u0027s.", "note": "Sarah\u0027s book — book опущено"},
          {"sentence": "Whose research is this? — It is the professor\u0027s.", "note": "professor\u0027s research"},
          {"sentence": "I prefer the university\u0027s policy to the government\u0027s.", "note": "government\u0027s policy"},
          {"sentence": "We visited the Faculty of Sciences and the Faculty of Arts. The Sciences\u0027 facilities are better.", "note": "Sciences\u0027 facilities"}
        ]
      },
      "place_names": [
        {"example": "at the dentist\u0027s", "note": "at the dentist\u0027s office — office опущено"},
        {"example": "at McDonald\u0027s", "note": "at McDonald\u0027s restaurant"},
        {"example": "at St. James\u0027s", "note": "название места"}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "The students book is on the table.", "correct": "The student\u0027s book is on the table.", "explanation": "Апостроф обязателен для выражения принадлежности."},
    {"wrong": "The students\u0027s books are on the table.", "correct": "The students\u0027 books are on the table.", "explanation": "Множественное число на -s: только апостроф после s, без дополнительного s."},
    {"wrong": "The cover of book is damaged.", "correct": "The cover of the book is damaged.", "explanation": "Артикль the обязателен перед существительным в конструкции с of."},
    {"wrong": "it\u0027s a good university. Its buildings are modern.", "correct": "Оба верны, но в разных значениях.", "explanation": "it\u0027s = it is (сокращение). its = принадлежит ему (притяжательное). Это РАЗНЫЕ слова!"},
    {"wrong": "The childrens\u0027 education is important.", "correct": "The children\u0027s education is important.", "explanation": "children — неправильное мн.ч., не оканчивается на -s, поэтому \u0027s."},
    {"wrong": "The results of experiment show...", "correct": "The results of the experiment show...", "explanation": "После of нужен артикль the с конкретным существительным."},
    {"wrong": "Marx\u0027 theories influenced...", "correct": "Marx\u0027s theories influenced... (предпочтительно)", "explanation": "Оба варианта допустимы, но Marx\u0027s более распространён в современном академическом письме."},
    {"wrong": "This is my colleague book.", "correct": "This is my colleague\u0027s book.", "explanation": "Без апострофа предложение неграмматично — нужно \u0027s."}
  ],
  "academic_examples": [
    "The study\u0027s methodology follows the approach outlined in Smith\u0027s (2019) seminal work.",
    "The results of the experiment support the hypothesis presented in the first chapter.",
    "Kazakhstan\u0027s educational reforms have significantly improved the quality of higher education.",
    "The children\u0027s cognitive development was assessed using standardised tests.",
    "The university\u0027s commitment to research excellence is reflected in its faculty\u0027s publications.",
    "Today\u0027s findings contribute to our understanding of the relationship between language and cognition."
  ],
  "dialogues": [
    {"title": "Обсуждение дипломной работы", "lines": [
      {"speaker": "Student", "text": "I am writing about Kazakhstan\u0027s economic development."},
      {"speaker": "Supervisor", "text": "Good. Have you read Smith\u0027s analysis of Central Asia\u0027s growth patterns?"},
      {"speaker": "Student", "text": "Yes, and I also found the results of the World Bank\u0027s 2022 report very useful."},
      {"speaker": "Supervisor", "text": "Excellent. Make sure you cite the report\u0027s methodology correctly."},
      {"speaker": "Student", "text": "Of course. I will follow the university\u0027s citation guidelines."}
    ]},
    {"title": "В библиотеке", "lines": [
      {"speaker": "A", "text": "Whose textbook is this on the table?"},
      {"speaker": "B", "text": "It is the professor\u0027s. She left it after yesterday\u0027s lecture."},
      {"speaker": "A", "text": "And these notes — are they yours or the other students\u0027?"},
      {"speaker": "B", "text": "They are mine. I borrowed the department\u0027s printer to copy them."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Выберите правильную форму: ___ research was published in Nature.", "options": ["The professor research", "The professors research", "The professor\u0027s research", "The professors\u0027 research"], "answer": "The professor\u0027s research"},
    {"type": "multiple_choice", "question": "Несколько студентов сдали работы. Выберите правильный вариант:", "options": ["the student\u0027s assignments", "the students\u0027s assignments", "the students\u0027 assignments", "the students assignments"], "answer": "the students\u0027 assignments"},
    {"type": "multiple_choice", "question": "Выберите правильную конструкцию для неодушевлённого предмета:", "options": ["the experiment\u0027s results", "the results of the experiment", "the results of experiment", "оба a и b правильны"], "answer": "оба a и b правильны"},
    {"type": "multiple_choice", "question": "children → притяжательная форма:", "options": ["childrens\u0027", "children\u0027s", "childrens\u0027s", "the children of"], "answer": "children\u0027s"},
    {"type": "true_false", "question": "The dog wagged it\u0027s tail happily.", "answer": "wrong", "explanation": "it\u0027s = it is. Притяжательное местоимение пишется its (без апострофа): The dog wagged its tail."},
    {"type": "true_false", "question": "The results of the first stage of the experiment were inconclusive.", "answer": "correct", "explanation": "Для длинных неодушевлённых конструкций of предпочтительнее. Верно!"},
    {"type": "error_correction", "question": "The students book and the professor research are both about Kazakhstans history.", "answer": "The student\u0027s book and the professor\u0027s research are both about Kazakhstan\u0027s history."},
    {"type": "multiple_choice", "question": "Чья это ручка? — Профессора. (без повторения слова pen)", "options": ["It is the professor.", "It is the professor\u0027s.", "It is of the professor.", "It is professors."], "answer": "It is the professor\u0027s."},
    {"type": "fill_blank", "question": "The ___ (Marx) theories and ___ (Engels) writings formed the basis of ___ (the movement) ideology.", "answer": "Marx\u0027s / Engels\u0027s / the movement\u0027s"},
    {"type": "multiple_choice", "question": "Академический стиль. Выберите лучший вариант для длинной конструкции:", "options": ["the first stage of the longitudinal study\u0027s results", "the results of the first stage of the longitudinal study", "the longitudinal study first stage\u0027s results", "the first stage\u0027s results of the longitudinal study"], "answer": "the results of the first stage of the longitudinal study"},
    {"type": "error_correction", "question": "The womens achievements in science have been remarkable. The childrens right to education is fundamental.", "answer": "The women\u0027s achievements in science have been remarkable. The children\u0027s right to education is fundamental."},
    {"type": "multiple_choice", "question": "Выберите правильный вариант: ___ policy has changed significantly.", "options": ["The government of policy", "The governments policy", "The government\u0027s policy", "The policy of government"], "answer": "The government\u0027s policy"},
    {"type": "fill_blank", "question": "This is not my research — it is ___. (Sarah) I prefer ___ methodology to ___. (professor / government)", "answer": "Sarah\u0027s / the professor\u0027s / the government\u0027s"},
    {"type": "multiple_choice", "question": "it\u0027s vs its. Выберите верный вариант: The university expanded ___ research programme. ___ now one of the top institutions.", "options": ["it\u0027s / Its", "its / It\u0027s", "its / Its", "it\u0027s / It\u0027s"], "answer": "its / It\u0027s"},
    {"type": "error_correction", "question": "The cover of book is damaged. The books cover need replacing. Please go to the librarys office.", "answer": "The cover of the book is damaged. The book\u0027s cover needs replacing. Please go to the library\u0027s office."},
    {"type": "true_false", "question": "Today\u0027s agenda includes a discussion of last semester\u0027s results and next year\u0027s plans.", "answer": "correct", "explanation": "Временные выражения используют апостроф: today\u0027s, last semester\u0027s, next year\u0027s. Верно!"},
    {"type": "multiple_choice", "question": "James ___ contribution to linguistics is widely recognised.", "options": ["James", "James\u0027", "James\u0027s", "оба b и c правильны"], "answer": "оба b и c правильны"},
    {"type": "fill_blank", "question": "The ___ (Faculty of Economics) dean presented the ___ (university) annual report discussing the ___ (students) academic achievements.", "answer": "Faculty of Economics\u0027 / university\u0027s / students\u0027"},
    {"type": "error_correction", "question": "The experiment results were surprising. The childrens performance exceeded the researchers expectations significantly.", "answer": "The experiment\u0027s results were surprising. The children\u0027s performance exceeded the researchers\u0027 expectations significantly."},
    {"type": "academic_writing", "question": "Напишите абзац из 5-6 предложений о научном исследовании используя минимум: 4 конструкции с апострофом, 3 конструкции с of, 1 независимый притяжательный падеж. Тема: описание чьего-либо исследования и его результатов.", "tip": "Например: Professor Smith\u0027s research examines... The results of the study... Kazakhstan\u0027s universities... The significance of the findings... Compared to Jones\u0027s work, Smith\u0027s is more..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 2
  AND l.order_index = 1
)
AND type = 'grammar';
