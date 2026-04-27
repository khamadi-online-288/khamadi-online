-- ============================================================
-- 035: Grammar content for A1 Beginner / Module 3 / Lesson 2
--      "Hobbies — Like/Love/Hate + Doing"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Hobbies — Like/Love/Hate + Doing",
  "academic_intro": "Глаголы выражающие отношение к деятельности (like, love, enjoy, hate, dislike, prefer) занимают особое место в английской грамматике. Ключевая особенность этих глаголов — они требуют после себя герундий (глагол с окончанием -ing) когда за ними следует другой глагол. Это одно из принципиальных отличий от русского языка где после таких слов используется инфинитив. В академическом контексте понимание герундия критически важно так как он широко используется в научных текстах для описания процессов, методов и видов деятельности.",
  "rules": [
    {
      "rule": "Правило 1 — Like/Love/Hate + Gerund (-ing)",
      "explanation": "После глаголов выражающих отношение к деятельности используется герундий — глагол с окончанием -ing. Это правило применяется когда мы говорим о деятельности в целом как о привычке или общем отношении.",
      "pattern": "Subject + like/love/hate/enjoy/prefer + verb-ing",
      "verb_list": [
        {"verb": "love", "russian": "обожать", "intensity": "5/5"},
        {"verb": "enjoy", "russian": "получать удовольствие", "intensity": "4/5"},
        {"verb": "like", "russian": "нравиться", "intensity": "3/5"},
        {"verb": "do not mind", "russian": "не возражать", "intensity": "2/5"},
        {"verb": "dislike", "russian": "не нравиться", "intensity": "1/5"},
        {"verb": "hate", "russian": "ненавидеть", "intensity": "0/5"},
        {"verb": "cannot stand", "russian": "не переносить", "intensity": "0/5"}
      ],
      "examples": [
        {"sentence": "She loves reading academic journals.", "translation": "Она обожает читать академические журналы."},
        {"sentence": "He enjoys conducting experiments.", "translation": "Ему нравится проводить эксперименты."},
        {"sentence": "They like attending international conferences.", "translation": "Им нравится посещать международные конференции."},
        {"sentence": "She dislikes writing reports.", "translation": "Ей не нравится писать отчёты."},
        {"sentence": "He hates presenting in public.", "translation": "Он ненавидит выступать на публике."},
        {"sentence": "I cannot stand working without clear data.", "translation": "Я не переношу работу без чётких данных."}
      ]
    },
    {
      "rule": "Правило 2 — Образование герундия",
      "explanation": "Герундий образуется добавлением -ing к базовой форме глагола. Существуют орфографические правила для разных типов глаголов.",
      "formation_rules": [
        {"rule": "Большинство глаголов: + ing", "examples": ["read → reading", "write → writing", "study → studying", "attend → attending", "research → researching"]},
        {"rule": "Глаголы на немое -e: убрать e + ing", "examples": ["make → making", "take → taking", "come → coming", "use → using", "analyse → analysing"]},
        {"rule": "Короткие глаголы на согласная+гласная+согласная: удвоить последнюю согласную + ing", "examples": ["run → running", "swim → swimming", "sit → sitting", "get → getting", "put → putting"]},
        {"rule": "Глаголы на -ie: ie → y + ing", "examples": ["lie → lying", "die → dying", "tie → tying"]}
      ]
    },
    {
      "rule": "Правило 3 — Like + Gerund vs Like + Infinitive",
      "explanation": "В British English like + gerund выражает общее отношение к деятельности. Like + to-infinitive выражает скорее привычку или выбор. В American English оба варианта часто взаимозаменяемы. В академическом тексте предпочтительно последовательное использование одного варианта.",
      "comparison": [
        {"gerund": "I like reading research papers. (мне нравится читать — общее отношение)", "infinitive": "I like to read research papers before bed. (я предпочитаю читать — привычка)"},
        {"gerund": "She loves attending conferences. (она обожает конференции в целом)", "infinitive": "She loves to attend the annual linguistics conference. (конкретная конференция)"}
      ],
      "verbs_only_gerund": {
        "explanation": "Некоторые глаголы используются ТОЛЬКО с герундием",
        "verbs": ["enjoy", "mind", "dislike", "cannot stand", "finish", "avoid", "suggest", "consider", "keep"],
        "examples": [
          "I enjoy reading. (NOT: I enjoy to read.)",
          "She finished writing the report. (NOT: She finished to write.)",
          "He suggested conducting another experiment. (NOT: He suggested to conduct.)"
        ]
      }
    },
    {
      "rule": "Правило 4 — Хобби и свободное время",
      "explanation": "Словарь хобби и свободного времени необходим для академических контекстов связанных с исследованиями досуга, социологическими опросами и описанием участников исследований.",
      "hobbies_categories": [
        {
          "category": "Активный отдых (Active Leisure)",
          "hobbies": ["playing football", "swimming", "running", "hiking", "cycling", "doing yoga", "going to the gym"]
        },
        {
          "category": "Творчество (Creative Activities)",
          "hobbies": ["painting", "drawing", "writing", "playing the piano", "singing", "taking photographs", "designing"]
        },
        {
          "category": "Интеллектуальные занятия (Intellectual Activities)",
          "hobbies": ["reading", "studying languages", "solving puzzles", "researching", "coding", "playing chess"]
        },
        {
          "category": "Социальные занятия (Social Activities)",
          "hobbies": ["socialising", "volunteering", "travelling", "attending events", "watching films", "cooking"]
        }
      ],
      "frequency_expressions": [
        "I often enjoy reading in the evenings.",
        "She sometimes likes going to concerts at weekends.",
        "He rarely enjoys attending social events.",
        "They always love spending time with family."
      ]
    },
    {
      "rule": "Правило 5 — Герундий в академическом письме",
      "explanation": "Герундий широко используется в академических текстах как подлежащее, дополнение и в устойчивых выражениях. Понимание герундия необходимо для грамотного академического письма.",
      "academic_uses": [
        {
          "use": "Герундий как подлежащее",
          "examples": [
            "Conducting longitudinal research requires significant resources.",
            "Analysing qualitative data is time-consuming but valuable.",
            "Understanding the theoretical framework is essential before data collection."
          ]
        },
        {
          "use": "Герундий после предлогов",
          "examples": [
            "The study focuses on improving academic performance.",
            "Researchers are interested in understanding cognitive development.",
            "The methodology consists of collecting and analysing data.",
            "Before conducting the experiment, participants gave informed consent."
          ]
        },
        {
          "use": "Устойчивые академические выражения с герундием",
          "examples": [
            "worth examining — стоит изучить",
            "capable of achieving — способный достичь",
            "responsible for conducting — ответственный за проведение",
            "interested in exploring — заинтересованный в изучении",
            "aimed at improving — направленный на улучшение"
          ]
        }
      ]
    },
    {
      "rule": "Правило 6 — Предпочтения и сравнение: Prefer и Would Rather",
      "explanation": "Для выражения предпочтения между двумя действиями используются prefer и would rather. Оба имеют особенности управления.",
      "prefer": {
        "pattern_1": "prefer + gerund + to + gerund",
        "examples": [
          "She prefers reading to watching television.",
          "Researchers prefer collecting primary data to relying on secondary sources.",
          "He prefers working independently to collaborating in groups."
        ],
        "pattern_2": "prefer + infinitive (general preference)",
        "examples": [
          "I prefer to work in the mornings.",
          "She prefers to conduct interviews rather than surveys."
        ]
      },
      "would_rather": {
        "pattern": "would rather + base verb (than + base verb)",
        "examples": [
          "I would rather study in the library than at home.",
          "She would rather analyse the data herself than delegate the task.",
          "They would rather use qualitative methods than quantitative ones."
        ]
      }
    }
  ],
  "common_mistakes": [
    {"wrong": "She enjoys to read academic journals.", "correct": "She enjoys reading academic journals.", "explanation": "enjoy всегда + gerund, никогда + infinitive."},
    {"wrong": "He likes swim every morning.", "correct": "He likes swimming every morning. / He likes to swim every morning.", "explanation": "После like нужен герундий или инфинитив с to — не базовая форма."},
    {"wrong": "She is prefer reading to writing.", "correct": "She prefers reading to writing.", "explanation": "prefer — обычный глагол, не используется с to be."},
    {"wrong": "I hate to attending long meetings.", "correct": "I hate attending long meetings. / I hate to attend long meetings.", "explanation": "После hate — герундий или инфинитив с to, но не ing с to."},
    {"wrong": "Studing is important for success.", "correct": "Studying is important for success.", "explanation": "study → studying (не studing)."},
    {"wrong": "She prefer reading to writing.", "correct": "She prefers reading to writing.", "explanation": "3-е лицо ед.ч.: prefers (не prefer)."}
  ],
  "academic_examples": [
    "Many researchers enjoy exploring interdisciplinary connections between their field and related disciplines.",
    "Conducting fieldwork involves collecting data, analysing results, and writing comprehensive reports.",
    "Students who enjoy reading academic literature tend to perform better in research-based assessments.",
    "The methodology focuses on understanding how students approach learning rather than measuring outcomes alone.",
    "Researchers prefer using mixed methods to relying solely on quantitative or qualitative approaches.",
    "Analysing large datasets requires both technical skills and critical thinking."
  ],
  "dialogues": [
    {"title": "Обсуждение исследовательских интересов", "lines": [
      {"speaker": "Professor", "text": "What aspects of linguistics do you enjoy studying most?"},
      {"speaker": "Student", "text": "I love analysing how language changes over time. I also enjoy reading historical texts."},
      {"speaker": "Professor", "text": "Do you prefer working with quantitative or qualitative data?"},
      {"speaker": "Student", "text": "I prefer analysing qualitative data to working with numbers, but I do not mind using both."},
      {"speaker": "Professor", "text": "Excellent. Have you considered conducting fieldwork?"},
      {"speaker": "Student", "text": "Yes, I enjoy collecting primary data. I find it more rewarding than working with existing datasets."}
    ]},
    {"title": "Анкета для исследования досуга", "lines": [
      {"speaker": "Researcher", "text": "Thank you for participating. What do you enjoy doing in your free time?"},
      {"speaker": "Participant", "text": "I love reading and cooking. I also enjoy hiking at weekends."},
      {"speaker": "Researcher", "text": "Do you prefer indoor or outdoor activities?"},
      {"speaker": "Participant", "text": "I prefer doing outdoor activities, but I do not mind staying indoors when the weather is bad."},
      {"speaker": "Researcher", "text": "How many hours per week do you spend on hobbies?"},
      {"speaker": "Participant", "text": "I enjoy spending about ten hours per week on activities I love."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "She enjoys ___ academic journals.", "options": ["to read", "reading", "read", "reads"], "answer": "reading"},
    {"type": "multiple_choice", "question": "Образование герундия от write:", "options": ["writeing", "writting", "writing", "writen"], "answer": "writing"},
    {"type": "multiple_choice", "question": "Образование герундия от run:", "options": ["runing", "running", "runeing", "runneing"], "answer": "running"},
    {"type": "multiple_choice", "question": "She prefers ___ to writing reports.", "options": ["to read", "reading", "read", "b и a оба верны"], "answer": "b и a оба верны"},
    {"type": "true_false", "question": "He enjoys to conduct experiments in the laboratory.", "answer": "wrong", "explanation": "enjoy + gerund only: He enjoys conducting experiments."},
    {"type": "true_false", "question": "Analysing qualitative data requires patience and attention to detail.", "answer": "correct", "explanation": "Герундий как подлежащее. Верно!"},
    {"type": "error_correction", "question": "She enjoys to read. He likes swim. They prefer to reading.", "answer": "She enjoys reading. He likes swimming / to swim. They prefer reading / to read."},
    {"type": "multiple_choice", "question": "Какой глагол используется ТОЛЬКО с герундием?", "options": ["like", "love", "enjoy", "want"], "answer": "enjoy"},
    {"type": "fill_blank", "question": "I love ___ (read) research papers. She hates ___ (write) long reports. He enjoys ___ (conduct) fieldwork.", "answer": "reading / writing / conducting"},
    {"type": "multiple_choice", "question": "Would rather. I would rather ___ in the library than at home.", "options": ["studying", "to study", "study", "studies"], "answer": "study"},
    {"type": "error_correction", "question": "Studing languages is important. She prefer reading to writing. I enjoy to attend conferences.", "answer": "Studying languages is important. She prefers reading to writing. I enjoy attending conferences."},
    {"type": "fill_blank", "question": "The study focuses on ___ (improve) academic outcomes. Researchers are interested in ___ (understand) motivation. Before ___ (collect) data, consent was obtained.", "answer": "improving / understanding / collecting"},
    {"type": "multiple_choice", "question": "Академический стиль: ___ is time-consuming but essential.", "options": ["Analyse data", "Analysing data", "To analysing data", "Analysis data"], "answer": "Analysing data"},
    {"type": "true_false", "question": "She prefers reading to to write.", "answer": "wrong", "explanation": "prefer + gerund + to + gerund: She prefers reading to writing."},
    {"type": "multiple_choice", "question": "Герундий после предлога: The study consists ___ three phases.", "options": ["to conduct", "of conducting", "of conduct", "conducting"], "answer": "of conducting"},
    {"type": "error_correction", "question": "Runnning is good for health. She likes swiming. He cannot stand to waiting.", "answer": "Running is good for health. She likes swimming. He cannot stand waiting."},
    {"type": "fill_blank", "question": "Расставь по шкале интенсивности (от + до -): love, hate, like, dislike, enjoy, cannot stand", "answer": "love → enjoy → like → dislike → hate → cannot stand"},
    {"type": "true_false", "question": "The methodology aims at understanding how students learn rather than what they learn.", "answer": "correct", "explanation": "aimed at + gerund — правильная академическая конструкция. Верно!"},
    {"type": "error_correction", "question": "Many researchers enjoy to explore new fields. The study is worth to examine. She suggested to conduct another trial.", "answer": "Many researchers enjoy exploring new fields. The study is worth examining. She suggested conducting another trial."},
    {"type": "academic_writing", "question": "Напишите абзац из 5-6 предложений описывающий исследовательские интересы и предпочтения учёного. Используйте: enjoy, prefer, love или like + gerund (3 раза), герундий как подлежащее (1 раз), герундий после предлога (1 раз).", "tip": "Например: Professor Smith enjoys exploring... She prefers analysing qualitative data to... Conducting fieldwork involves... The research focuses on understanding... She loves discovering..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 3
  AND l.order_index = 2
)
AND type = 'grammar';
