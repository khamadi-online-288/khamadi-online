-- ============================================================
-- 025: Grammar content for A1 Beginner / Module 1 / Lesson 6
--      "Personal Pronouns"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Personal Pronouns — Личные местоимения",
  "academic_intro": "Местоимения (pronouns) заменяют существительные в предложении, избегая повторений. Личные местоимения (personal pronouns) — одна из фундаментальных категорий английской грамматики. В отличие от русского языка, в английском местоимения обязательны — предложение не может существовать без подлежащего.",
  "rules": [
    {
      "rule": "Правило 1 — Субъектные местоимения (Subject Pronouns)",
      "explanation": "Субъектные местоимения выполняют роль подлежащего — того кто совершает действие. Они всегда стоят ПЕРЕД глаголом.",
      "table": [
        {"person": "1-е лицо ед.ч.",     "pronoun": "I",    "translation": "я",        "example": "I am a student."},
        {"person": "2-е лицо ед.ч.",     "pronoun": "you",  "translation": "ты / вы",  "example": "You are my friend."},
        {"person": "3-е лицо ед.ч. (м)", "pronoun": "he",   "translation": "он",       "example": "He is a professor."},
        {"person": "3-е лицо ед.ч. (ж)", "pronoun": "she",  "translation": "она",      "example": "She is a doctor."},
        {"person": "3-е лицо ед.ч. (ср)","pronoun": "it",   "translation": "оно / это","example": "It is a good idea."},
        {"person": "1-е лицо мн.ч.",     "pronoun": "we",   "translation": "мы",       "example": "We are students."},
        {"person": "2-е лицо мн.ч.",     "pronoun": "you",  "translation": "вы",       "example": "You are welcome."},
        {"person": "3-е лицо мн.ч.",     "pronoun": "they", "translation": "они",      "example": "They are professors."}
      ],
      "note": "I всегда пишется с заглавной буквы, даже в середине предложения."
    },
    {
      "rule": "Правило 2 — Объектные местоимения (Object Pronouns)",
      "explanation": "Объектные местоимения выполняют роль дополнения — того на кого направлено действие. Они стоят ПОСЛЕ глагола или предлога.",
      "table": [
        {"subject": "I",    "object": "me",   "example": "She helped me."},
        {"subject": "you",  "object": "you",  "example": "I called you."},
        {"subject": "he",   "object": "him",  "example": "We invited him."},
        {"subject": "she",  "object": "her",  "example": "He loves her."},
        {"subject": "it",   "object": "it",   "example": "I bought it."},
        {"subject": "we",   "object": "us",   "example": "They joined us."},
        {"subject": "you",  "object": "you",  "example": "We need you."},
        {"subject": "they", "object": "them", "example": "I know them."}
      ]
    },
    {
      "rule": "Правило 3 — IT: особые случаи использования",
      "explanation": "Местоимение IT используется значительно шире чем его русский эквивалент. Это один из ключевых элементов английского синтаксиса.",
      "it_usage": [
        {"context": "Предметы и животные",   "example": "The book is on the table. It is interesting.", "translation": "Книга на столе. Она интересная."},
        {"context": "Погода",                "example": "It is sunny today. It is raining.",             "translation": "Сегодня солнечно. Идёт дождь."},
        {"context": "Время",                 "example": "It is 9 o'clock. It is Monday.",               "translation": "Сейчас 9 часов. Сегодня понедельник."},
        {"context": "Расстояние",            "example": "It is 5 km from here.",                        "translation": "Отсюда 5 км."},
        {"context": "Формальное подлежащее", "example": "It is important to study English.",             "translation": "Важно изучать английский."},
        {"context": "Температура",           "example": "It is 30 degrees today.",                      "translation": "Сегодня 30 градусов."}
      ]
    },
    {
      "rule": "Правило 4 — YOU: единственное и множественное число",
      "explanation": "В английском языке you используется и для обращения к одному человеку и к нескольким. Глагол всегда используется во множественной форме.",
      "examples": [
        {"sentence": "You are my best friend.",                    "note": "Обращение к одному другу"},
        {"sentence": "You are all welcome to the lecture.",        "note": "Обращение к группе студентов"},
        {"sentence": "Are you ready for the exam?",                "note": "Может быть и к одному и к группе"}
      ],
      "note": "Контекст всегда помогает понять — к одному или многим обращаются."
    },
    {
      "rule": "Правило 5 — THEY как гендерно-нейтральное местоимение",
      "explanation": "В современном академическом английском they всё чаще используется как гендерно-нейтральное местоимение для одного человека когда пол неизвестен или не важен.",
      "examples": [
        {"sentence": "Every student must submit their assignment.",   "note": "Гендерно-нейтральное — не he or she"},
        {"sentence": "If a person wants to succeed, they must work hard.", "note": "Современная норма"},
        {"sentence": "The researcher published their findings.",      "note": "Академический стиль"}
      ],
      "note": "Это принятая норма в современном академическом письме и речи."
    },
    {
      "rule": "Правило 6 — Обязательность подлежащего в английском",
      "explanation": "В отличие от русского языка где подлежащее часто опускается, в английском оно обязательно.",
      "ru_en_comparison": [
        {"russian": "Иду домой.",       "wrong_english": "Go home.",      "correct_english": "I am going home.",   "note": "Подлежащее обязательно"},
        {"russian": "Холодно.",         "wrong_english": "Is cold.",       "correct_english": "It is cold.",        "note": "IT как формальное подлежащее"},
        {"russian": "Говорят что...",   "wrong_english": "Say that...",    "correct_english": "They say that...",   "note": "THEY для неопределённого субъекта"},
        {"russian": "Понятно.",         "wrong_english": "Is clear.",      "correct_english": "It is clear.",       "note": "IT обязательно"}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "Me and John went to the library.",              "correct": "John and I went to the library.",            "explanation": "Субъектная форма I, не me. Вежливо ставить себя на второе место."},
    {"wrong": "The professor called my friend and I.",         "correct": "The professor called my friend and me.",      "explanation": "После глагола — объектная форма me, не I."},
    {"wrong": "Is raining outside.",                           "correct": "It is raining outside.",                     "explanation": "IT обязательно как формальное подлежащее."},
    {"wrong": "He is more taller than she.",                   "correct": "He is taller than her.",                     "explanation": "После than в разговорной речи — объектная форма."},
    {"wrong": "Every student must submit his assignment.",     "correct": "Every student must submit their assignment.", "explanation": "Гендерно-нейтральное their в современном English."}
  ],
  "academic_examples": [
    "Researchers conducted the study. They published their findings in 2023.",
    "It is widely acknowledged that education plays a crucial role in development.",
    "The data suggests that they (students) perform better with regular feedback.",
    "She argued that the results were statistically significant.",
    "We conclude that further research is necessary."
  ],
  "dialogues": [
    {"title": "В университете", "lines": [
      {"speaker": "Professor", "text": "Good morning. Are you the new students?"},
      {"speaker": "Students",  "text": "Yes, we are. We are first-year students."},
      {"speaker": "Professor", "text": "Welcome. I am Professor Smith. She is Dr. Johnson, my colleague."},
      {"speaker": "Student",   "text": "It is a pleasure to meet you both."}
    ]},
    {"title": "Обсуждение проекта", "lines": [
      {"speaker": "A", "text": "Did you speak to the supervisor?"},
      {"speaker": "B", "text": "Yes, I met her yesterday. She gave me some useful advice."},
      {"speaker": "A", "text": "What did she say?"},
      {"speaker": "B", "text": "She told us to submit the report by Friday. It is very important."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice",   "question": "___ am a first-year student at this university.",                   "options": ["Me","I","My","Mine"],              "answer": "I"},
    {"type": "multiple_choice",   "question": "The professor explained the topic. ___ explained it very clearly.", "options": ["Him","His","He","Them"],           "answer": "He"},
    {"type": "multiple_choice",   "question": "My sister studies medicine. ___ wants to be a surgeon.",           "options": ["He","Her","She","It"],             "answer": "She"},
    {"type": "multiple_choice",   "question": "___ is raining heavily today.",                                    "options": ["He","She","It","They"],            "answer": "It"},
    {"type": "multiple_choice",   "question": "The results are excellent. ___ show a significant improvement.",   "options": ["It","He","They","We"],             "answer": "They"},
    {"type": "multiple_choice",   "question": "The professor invited my colleague and ___ to the conference.",    "options": ["I","me","my","mine"],              "answer": "me"},
    {"type": "multiple_choice",   "question": "___ and I worked on the project together.",                        "options": ["Me and John","John and me","John and I","I and John"], "answer": "John and I"},
    {"type": "multiple_choice",   "question": "___ is important to attend all lectures.",                         "options": ["He","She","This","It"],            "answer": "It"},
    {"type": "multiple_choice",   "question": "Every student must complete ___ assignment by Monday.",            "options": ["his","her","their","its"],         "answer": "their"},
    {"type": "true_false",        "question": "Me and Sarah presented the research findings.",                    "answer": "wrong",   "explanation": "Правильно: Sarah and I presented... (субъектная форма I, вежливо ставить себя вторым)"},
    {"type": "true_false",        "question": "It is widely known that Kazakhstan is rich in natural resources.", "answer": "correct", "explanation": "IT как формальное подлежащее — академический стиль. Верно!"},
    {"type": "error_correction",  "question": "Is very cold in Astana in winter. The temperature, it drops to minus 40.", "answer": "It is very cold in Astana in winter. The temperature drops to minus 40."},
    {"type": "fill_blank",        "question": "The researchers published ___ study in 2023. ___ concluded that climate change affects ___.", "answer": "their / They / us"},
    {"type": "multiple_choice",   "question": "The book is on the desk. Please give ___ to me.",                 "options": ["him","her","it","them"],           "answer": "it"},
    {"type": "multiple_choice",   "question": "We invited the professors. ___ accepted our invitation.",         "options": ["It","He","They","She"],            "answer": "They"},
    {"type": "error_correction",  "question": "The supervisor called my partner and I for a meeting.",           "answer": "The supervisor called my partner and me for a meeting."},
    {"type": "fill_blank",        "question": "___ is 3 km from the dormitory to the main campus. ___ takes about 30 minutes on foot.", "answer": "It / It"},
    {"type": "true_false",        "question": "Go to the library and study for the exam.",                       "answer": "wrong",   "explanation": "В английском подлежащее обязательно: You should go to the library..."},
    {"type": "multiple_choice",   "question": "В академическом тексте: A student should always cite ___ sources.", "options": ["his","her","his or her","their"], "answer": "their"},
    {"type": "academic_writing",  "question": "Напишите 4-5 предложений о вашем университете используя минимум 6 разных местоимений: I, we, it, they, he/she, you.", "tip": "I study at... We have... It is located in... They offer... Our professors, he/she..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id
  FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
    AND m.order_index = 1
    AND l.order_index = 6
  LIMIT 1
)
AND type = 'grammar';
