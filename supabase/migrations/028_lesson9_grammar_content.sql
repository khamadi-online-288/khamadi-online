-- ============================================================
-- 028: Grammar content for A1 Beginner / Module 1 / Lesson 9
--      "Word Order"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Word Order — Порядок слов в английском предложении",
  "academic_intro": "Порядок слов (word order) — один из фундаментальных принципов английской грамматики. В отличие от русского языка где порядок слов относительно свободен, в английском он строго фиксирован и несёт грамматическую функцию. Изменение порядка слов меняет смысл или делает предложение неверным.",
  "rules": [
    {
      "rule": "Правило 1 — Базовая структура: Subject + Verb + Object (SVO)",
      "explanation": "Основной порядок слов в английском — S + V + O. В русском языке все шесть перестановок трёх элементов возможны, в английском — только одна основная.",
      "svo_comparison": [
        {"russian": "Студент читает книгу.",          "english": "The student reads the book.",          "structure": "S + V + O"},
        {"russian": "Книгу читает студент.",           "english": "The student reads the book.",          "note": "В английском тот же порядок"},
        {"russian": "Профессор объяснил теорию.",      "english": "The professor explained the theory.",  "structure": "S + V + O"},
        {"russian": "Исследователи анализируют данные.", "english": "The researchers analyse the data.",   "structure": "S + V + O"}
      ],
      "extended_examples": [
        {"sentence": "Students study English at university every day.",           "breakdown": "S + V + O + Place + Time"},
        {"sentence": "The professor published the research paper last month.",    "breakdown": "S + V + O + Time"},
        {"sentence": "She presented her findings clearly at the conference.",     "breakdown": "S + V + O + Manner + Place"}
      ]
    },
    {
      "rule": "Правило 2 — Полная структура: SVOMPT",
      "explanation": "Расширенная структура включает обстоятельства в строгом порядке: Manner → Place → Time. Запомнить легко по аббревиатуре MPT.",
      "svompt_order": [
        {"element": "S", "name": "Subject",  "russian": "Подлежащее",            "example": "The students"},
        {"element": "V", "name": "Verb",     "russian": "Сказуемое",             "example": "studied"},
        {"element": "O", "name": "Object",   "russian": "Дополнение",            "example": "the material"},
        {"element": "M", "name": "Manner",   "russian": "Образ действия (как?)", "example": "carefully"},
        {"element": "P", "name": "Place",    "russian": "Место (где?)",          "example": "in the library"},
        {"element": "T", "name": "Time",     "russian": "Время (когда?)",        "example": "yesterday"}
      ],
      "examples": [
        {"sentence": "The students studied the material carefully in the library yesterday.", "breakdown": "S + V + O + M + P + T", "wrong": "The students studied yesterday in the library carefully the material."},
        {"sentence": "She presented her thesis brilliantly at the conference last week.",     "breakdown": "S + V + O + M + P + T"},
        {"sentence": "The researchers analysed the data systematically in the lab this morning.", "breakdown": "S + V + O + M + P + T"}
      ],
      "memory_tip": "MPT — Manner, Place, Time. My Pet Tiger поможет запомнить порядок."
    },
    {
      "rule": "Правило 3 — Порядок слов в вопросах",
      "explanation": "В вопросах вспомогательный глагол выносится перед подлежащим. В русском языке вопрос часто выражается только интонацией.",
      "question_types": [
        {
          "type": "Yes/No Questions",
          "pattern": "Auxiliary + Subject + Main Verb + Object?",
          "pairs": [
            {"statement": "She studies English.",                 "question": "Does she study English?"},
            {"statement": "They are students.",                   "question": "Are they students?"},
            {"statement": "He has finished the report.",          "question": "Has he finished the report?"},
            {"statement": "The professor explained the theory.",  "question": "Did the professor explain the theory?"}
          ]
        },
        {
          "type": "Wh- Questions",
          "pattern": "Wh-word + Auxiliary + Subject + Main Verb?",
          "pairs": [
            {"statement": "Wh + aux + subj + verb",              "question": "What do you study at university?"},
            {"statement": "",                                     "question": "Where does the conference take place?"},
            {"statement": "",                                     "question": "When did she publish the research?"},
            {"statement": "",                                     "question": "Why is academic writing important?"}
          ]
        },
        {
          "type": "Subject Questions — БЕЗ вспомогательного!",
          "pattern": "Who/What + Verb + Object? (no auxiliary)",
          "pairs": [
            {"statement": "Who does study linguistics? ❌",       "question": "Who studies linguistics? ✓"},
            {"statement": "What did happen? ❌",                  "question": "What happened? ✓"},
            {"statement": "",                                     "question": "Who wrote this research paper?"},
            {"statement": "",                                     "question": "What caused the significant results?"}
          ]
        }
      ]
    },
    {
      "rule": "Правило 4 — Положение наречий (Adverb Placement)",
      "explanation": "Наречия занимают строго определённые позиции. Это одна из самых сложных тем для русскоязычных студентов.",
      "adverb_types": [
        {
          "type": "Наречия частоты: always, usually, often, sometimes, rarely, never",
          "rule": "ПЕРЕД основным глаголом; ПОСЛЕ глагола to be",
          "pairs": [
            {"wrong": "Students submit always assignments on time.", "correct": "Students always submit assignments on time."},
            {"wrong": "She always is punctual.",                     "correct": "She is always punctual."},
            {"wrong": "We discuss often research methods.",          "correct": "We often discuss research methods."}
          ]
        },
        {
          "type": "Наречия степени: very, quite, extremely, highly, rather",
          "rule": "ПЕРЕД прилагательным или наречием которое они изменяют",
          "pairs": [
            {"wrong": "The results are significant extremely.",      "correct": "The results are extremely significant."},
            {"wrong": "She works hard very.",                        "correct": "She works very hard."}
          ]
        },
        {
          "type": "Наречия образа действия: carefully, clearly, systematically",
          "rule": "ПОСЛЕ глагола и дополнения (не между ними)",
          "pairs": [
            {"wrong": "She explained clearly the theory.",           "correct": "She explained the theory clearly."},
            {"wrong": "They systematically analysed the data.",      "correct": "They analysed the data systematically."}
          ]
        }
      ]
    },
    {
      "rule": "Правило 5 — Отрицательные предложения",
      "explanation": "Отрицательная частица not всегда стоит ПОСЛЕ вспомогательного глагола. Никогда не перед основным глаголом.",
      "pattern": "Subject + Auxiliary + NOT + Main Verb + Object",
      "examples": [
        {"correct": "She does not understand the concept.",         "wrong": "She not understands the concept."},
        {"correct": "They are not attending the seminar.",          "wrong": "They not are attending the seminar."},
        {"correct": "The professor did not publish the results.",   "wrong": "The professor not published the results."},
        {"correct": "We cannot access the database.",               "wrong": "We not can access the database."}
      ],
      "contractions": [
        {"full": "do not",   "short": "don\u0027t"},
        {"full": "does not", "short": "doesn\u0027t"},
        {"full": "did not",  "short": "didn\u0027t"},
        {"full": "is not",   "short": "isn\u0027t"},
        {"full": "are not",  "short": "aren\u0027t"},
        {"full": "cannot",   "short": "can\u0027t"},
        {"full": "will not", "short": "won\u0027t"},
        {"full": "have not", "short": "haven\u0027t"}
      ],
      "note": "В академическом письме предпочтительны полные формы: do not, does not, cannot."
    },
    {
      "rule": "Правило 6 — Инверсия после отрицательных наречий",
      "explanation": "В академическом и литературном английском после отрицательных наречий в начале предложения используется инверсия: вспомогательный глагол выносится перед подлежащим.",
      "inversion_adverbs": ["Never", "Rarely", "Seldom", "Not only", "Hardly", "No sooner"],
      "pattern": "Negative Adverb + Auxiliary + Subject + Main Verb",
      "examples": [
        {"sentence": "Never have researchers encountered such significant results.",      "note": "Never + have + researchers"},
        {"sentence": "Not only did the study confirm the hypothesis, but it also revealed new patterns.", "note": "Not only + did + the study"},
        {"sentence": "Rarely does academic research achieve such widespread impact.",     "note": "Rarely + does + academic research"},
        {"sentence": "In the first chapter, the methodology is described in detail.",    "note": "Место в начале — нет инверсии"}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She studies always English in the morning.",                    "correct": "She always studies English in the morning.",            "explanation": "always стоит ПЕРЕД основным глаголом."},
    {"wrong": "What did happen at the conference?",                           "correct": "What happened at the conference?",                      "explanation": "Вопрос к подлежащему — вспомогательный не нужен."},
    {"wrong": "He explained clearly the complex theory.",                     "correct": "He explained the complex theory clearly.",              "explanation": "Наречие образа действия стоит после дополнения."},
    {"wrong": "Yesterday I at the library studied.",                          "correct": "I studied at the library yesterday.",                   "explanation": "Порядок: S + V + O + Place + Time."},
    {"wrong": "She not submitted the assignment on time.",                    "correct": "She did not submit the assignment on time.",            "explanation": "Subject + Auxiliary + not + Main Verb."},
    {"wrong": "Why she is late?",                                             "correct": "Why is she late?",                                     "explanation": "В вопросе вспомогательный глагол стоит перед подлежащим."},
    {"wrong": "I study English very good.",                                   "correct": "I study English very well.",                           "explanation": "good — прилагательное; наречие образа действия — well."},
    {"wrong": "The professor always is punctual.",                            "correct": "The professor is always punctual.",                     "explanation": "always после глагола to be."}
  ],
  "academic_examples": [
    "The researchers carefully analysed the data collected during the six-month experiment.",
    "Rarely have scientists observed such a significant correlation between the variables.",
    "Not only did the study confirm previous findings, but it also introduced a new theoretical framework.",
    "In the following section, the methodology is described in detail.",
    "The professor always emphasises the importance of critical thinking in academic discourse."
  ],
  "dialogues": [
    {"title": "Академическая дискуссия", "lines": [
      {"speaker": "Professor", "text": "Does your research clearly address the main hypothesis?"},
      {"speaker": "Student",   "text": "Yes, it does. We systematically analysed the data in the laboratory last semester."},
      {"speaker": "Professor", "text": "And did you carefully consider the limitations of your methodology?"},
      {"speaker": "Student",   "text": "Absolutely. We discussed the limitations thoroughly in the final chapter."},
      {"speaker": "Professor", "text": "Excellent. Never underestimate the importance of acknowledging limitations."}
    ]},
    {"title": "Вопросы на семинаре", "lines": [
      {"speaker": "Student A", "text": "What does the author argue in the second chapter?"},
      {"speaker": "Student B", "text": "She argues that traditional methods are not always effective."},
      {"speaker": "Student A", "text": "Who proposed this theoretical framework originally?"},
      {"speaker": "Student B", "text": "A Kazakh researcher proposed it at the international conference in 2019."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice",  "question": "Выберите правильный порядок слов:",                           "options": ["She studies every day English carefully.","She carefully studies English every day.","She studies English carefully every day.","Carefully she studies English every day."], "answer": "She studies English carefully every day."},
    {"type": "multiple_choice",  "question": "Где стоит always?",                                           "options": ["She studies always English.","Always she studies English.","She always studies English.","She studies English always."], "answer": "She always studies English."},
    {"type": "multiple_choice",  "question": "Правильный вопрос:",                                          "options": ["Why she is absent?","Why is she absent today?","Why she absent is?","Why today is she absent?"], "answer": "Why is she absent today?"},
    {"type": "multiple_choice",  "question": "Вопрос к подлежащему:",                                       "options": ["Who does study linguistics?","Who studying linguistics?","Who studies linguistics?","Who did studies linguistics?"], "answer": "Who studies linguistics?"},
    {"type": "multiple_choice",  "question": "Правильный порядок обстоятельств:",                           "options": ["She studied yesterday in the library carefully.","She studied carefully yesterday in the library.","She studied carefully in the library yesterday.","She studied in the library yesterday carefully."], "answer": "She studied carefully in the library yesterday."},
    {"type": "true_false",       "question": "The professor explained clearly the theory to students.",      "answer": "wrong",   "explanation": "Наречие не разрывает глагол и дополнение: explained the theory clearly."},
    {"type": "true_false",       "question": "Never have researchers encountered such significant results.", "answer": "correct", "explanation": "Инверсия после Never: Never + have + subject. Верно!"},
    {"type": "error_correction", "question": "She not submitted the assignment. The professor did not explained why.", "answer": "She did not submit the assignment. The professor did not explain why."},
    {"type": "word_order",       "question": "[the data / analysed / the researchers / systematically / in the lab / last year]", "answer": "The researchers analysed the data systematically in the lab last year."},
    {"type": "word_order",       "question": "Составьте вопрос: [did / publish / when / the professor / the results]", "answer": "When did the professor publish the results?"},
    {"type": "multiple_choice",  "question": "Положение very:",                                             "options": ["The results are significant very.","The very results are significant.","The results are very significant.","Very the results are significant."], "answer": "The results are very significant."},
    {"type": "error_correction", "question": "Rarely researchers do encounter such results. What happened did at the seminar?", "answer": "Rarely do researchers encounter such results. What happened at the seminar?"},
    {"type": "fill_blank",       "question": "She ___ (always) arrives on time ___ (at university). The lectures ___ (never) start late.", "answer": "always / at university / never"},
    {"type": "word_order",       "question": "[not / did / submit / the students / their reports / on time]", "answer": "The students did not submit their reports on time."},
    {"type": "true_false",       "question": "The professor always is punctual and never cancels lectures.", "answer": "wrong",   "explanation": "После to be: The professor is always punctual."},
    {"type": "error_correction", "question": "What did happen during the experiment? Who did write this paper?", "answer": "What happened during the experiment? Who wrote this paper?"},
    {"type": "fill_blank",       "question": "___ (Rarely) ___ (do) researchers ___ (find) such clear evidence in a single study.", "answer": "Rarely do researchers find"},
    {"type": "word_order",       "question": "[the students / discussed / the topic / thoroughly / in class / last week]", "answer": "The students discussed the topic thoroughly in class last week."},
    {"type": "error_correction", "question": "She is always very good student. She studies hard very.", "answer": "She is always a very good student. She studies very hard."},
    {"type": "academic_writing", "question": "Напишите 5-6 предложений описывающих ваш типичный учебный день. Используйте: 3 наречия частоты, 2 наречия образа действия, 1 вопрос, 1 отрицательное предложение.", "tip": "I usually wake up at... I always... After breakfast, I carefully... Do I enjoy...? I never..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 9
  LIMIT 1
)
AND type = 'grammar';
