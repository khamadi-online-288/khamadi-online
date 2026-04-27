-- ============================================================
-- 034: Grammar content for A1 Beginner / Module 3 / Lesson 1
--      "Jobs & Professions — Modal Verb Can"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Jobs & Professions — Modal Verb Can",
  "academic_intro": "Модальный глагол can является одним из наиболее употребительных глаголов английского языка. Он выражает способность, возможность или разрешение совершить действие. В профессиональном и академическом контексте can используется для описания компетенций, квалификаций и институциональных возможностей. В отличие от русского языка где способность выражается глаголом мочь с личными окончаниями, английский can является неизменяемым модальным глаголом — он не изменяется по лицам и числам.",
  "rules": [
    {
      "rule": "Правило 1 — Структура предложений с CAN",
      "explanation": "Can — модальный глагол. После него основной глагол стоит в базовой форме (инфинитив без to). Can не изменяется для разных лиц — одна форма для всех.",
      "structure": {
        "affirmative": "Subject + can + base verb",
        "negative": "Subject + cannot/can\u0027t + base verb",
        "question": "Can + subject + base verb?"
      },
      "examples": [
        {"type": "Утверждение", "examples": ["I can speak English.", "She can work as a doctor.", "They can use the laboratory."]},
        {"type": "Отрицание", "examples": ["He cannot drive a car.", "We cannot access the database.", "She cannot attend the lecture."]},
        {"type": "Вопрос", "examples": ["Can you speak Kazakh?", "Can she work independently?", "Can they solve this problem?"]}
      ],
      "key_rule": "После CAN всегда базовая форма глагола — НЕ инфинитив с to, НЕ -ing форма, НЕ прошедшее время."
    },
    {
      "rule": "Правило 2 — Значения CAN",
      "meanings": [
        {"meaning": "Способность (Ability)", "explanation": "Умение делать что-то — врождённое или приобретённое", "examples": ["She can speak five languages.", "He can analyse complex data.", "The software can process millions of records."]},
        {"meaning": "Возможность (Possibility)", "explanation": "Что-то является возможным в данных обстоятельствах", "examples": ["You can find the data in Appendix B.", "Students can access the library 24 hours a day.", "The results can be interpreted in two ways."]},
        {"meaning": "Разрешение (Permission)", "explanation": "Кому-то позволено делать что-то", "examples": ["You can use a dictionary during the test.", "Students can submit assignments online.", "Researchers can apply for additional funding."]},
        {"meaning": "Предложение (Offer)", "explanation": "Предложение помощи или услуги", "examples": ["Can I help you with the research?", "I can explain the methodology.", "We can provide additional resources."]}
      ]
    },
    {
      "rule": "Правило 3 — Профессии и должности",
      "explanation": "Названия профессий в английском языке используются с неопределённым артиклем a/an. Современный академический английский использует гендерно-нейтральные термины. Профессия указывается через глагол to be.",
      "pattern": "She/He is + a/an + profession",
      "professions_table": [
        {"profession": "doctor", "russian": "врач", "example": "She is a doctor who can diagnose rare conditions."},
        {"profession": "engineer", "russian": "инженер", "example": "He is an engineer who can design complex systems."},
        {"profession": "teacher", "russian": "учитель", "example": "She is a teacher who can motivate students effectively."},
        {"profession": "researcher", "russian": "исследователь", "example": "He is a researcher who can analyse large datasets."},
        {"profession": "lawyer", "russian": "юрист", "example": "She is a lawyer who can advise on international law."},
        {"profession": "accountant", "russian": "бухгалтер", "example": "He is an accountant who can manage complex budgets."},
        {"profession": "architect", "russian": "архитектор", "example": "She is an architect who can design sustainable buildings."},
        {"profession": "journalist", "russian": "журналист", "example": "He is a journalist who can investigate complex stories."},
        {"profession": "programmer", "russian": "программист", "example": "She is a programmer who can develop AI systems."},
        {"profession": "economist", "russian": "экономист", "example": "He is an economist who can forecast market trends."}
      ],
      "gender_neutral": [
        {"old": "policeman/policewoman", "neutral": "police officer"},
        {"old": "fireman", "neutral": "firefighter"},
        {"old": "stewardess", "neutral": "flight attendant"},
        {"old": "chairman", "neutral": "chairperson / chair"},
        {"old": "businessman", "neutral": "businessperson / professional"}
      ]
    },
    {
      "rule": "Правило 4 — CAN в академическом и профессиональном контексте",
      "explanation": "В академических и профессиональных текстах can используется для описания возможностей систем, методологий и институтов. Это один из наиболее употребительных модальных глаголов в научном дискурсе.",
      "academic_patterns": [
        {"pattern": "This approach can + verb", "examples": ["This approach can significantly improve academic outcomes.", "This methodology can be applied across multiple disciplines."]},
        {"pattern": "Researchers can + verb", "examples": ["Researchers can access the full dataset online.", "Researchers can apply these findings to similar contexts."]},
        {"pattern": "The results can + verb", "examples": ["The results can be interpreted in several ways.", "These findings can inform future policy decisions."]}
      ]
    },
    {
      "rule": "Правило 5 — CAN vs COULD: отличие",
      "explanation": "Could является прошедшей формой can и также используется для вежливых просьб и предположений. В академическом письме could часто предпочтительнее как более осторожное утверждение.",
      "comparison": [
        {"can": "She can speak English. (факт — сейчас)", "could": "She could speak English at age five. (прошлое)"},
        {"can": "Can you help me? (прямая просьба)", "could": "Could you help me? (вежливая просьба)"},
        {"can": "This approach can work. (уверенно)", "could": "This approach could work. (осторожно, предположение)"}
      ],
      "academic_note": "В академическом письме could часто используется для смягчения утверждений: The results could suggest... / This could indicate..."
    },
    {
      "rule": "Правило 6 — Вопросы о профессиях и навыках",
      "question_patterns": [
        {"question": "What do you do?", "answer": "I am a/an + profession.", "note": "Стандартный вопрос о профессии"},
        {"question": "What can you do?", "answer": "I can + skill/ability.", "note": "Вопрос о навыках и умениях"},
        {"question": "Can you + verb?", "answer": "Yes, I can. / No, I cannot.", "note": "Вопрос о конкретном умении"},
        {"question": "What is your profession?", "answer": "My profession is + noun.", "note": "Более формальный вопрос"}
      ],
      "cv_language": [
        "I can communicate effectively in English and Kazakh.",
        "I can analyse complex datasets using statistical software.",
        "I can work independently and as part of a team.",
        "I can manage multiple projects simultaneously.",
        "I can present research findings to diverse audiences."
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She can to speak English.", "correct": "She can speak English.", "explanation": "После can — базовая форма без to."},
    {"wrong": "She cans speak English.", "correct": "She can speak English.", "explanation": "Can не изменяется по лицам — нет формы cans."},
    {"wrong": "Can she speaks English?", "correct": "Can she speak English?", "explanation": "После can в вопросе — базовая форма без -s."},
    {"wrong": "She is doctor.", "correct": "She is a doctor.", "explanation": "Профессия — с неопределённым артиклем a/an."},
    {"wrong": "I can not go.", "correct": "I cannot go. / I can not go.", "explanation": "Cannot пишется как одно слово (предпочтительно). Can not — два слова допустимо."},
    {"wrong": "She can working here.", "correct": "She can work here.", "explanation": "После can — базовая форма, не -ing форма."}
  ],
  "academic_examples": [
    "Researchers can access the complete dataset through the university portal.",
    "This methodology can be applied to a wide range of educational contexts.",
    "The system can process up to one million records per second.",
    "Students who complete this programme can work as certified data analysts.",
    "The findings can inform future curriculum development in Kazakhstani universities.",
    "This approach cannot be applied without first establishing a theoretical framework."
  ],
  "dialogues": [
    {"title": "Собеседование на работу", "lines": [
      {"speaker": "Interviewer", "text": "Good morning. Can you tell me about your professional background?"},
      {"speaker": "Applicant", "text": "Of course. I am a data analyst. I can work with large datasets and I can programme in Python and R."},
      {"speaker": "Interviewer", "text": "Can you work under pressure and meet tight deadlines?"},
      {"speaker": "Applicant", "text": "Yes, I can. I can also work independently or as part of a research team."},
      {"speaker": "Interviewer", "text": "Excellent. Can you start next Monday?"},
      {"speaker": "Applicant", "text": "Yes, I can. I am available immediately."}
    ]},
    {"title": "Описание профессий", "lines": [
      {"speaker": "A", "text": "What does a data scientist do?"},
      {"speaker": "B", "text": "A data scientist is a professional who can analyse complex data and identify patterns."},
      {"speaker": "A", "text": "Can they work in universities?"},
      {"speaker": "B", "text": "Yes, they can. They can also work in government, business, or research institutions."},
      {"speaker": "A", "text": "What skills do they need?"},
      {"speaker": "B", "text": "They need to be able to programme, think critically, and communicate findings clearly."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Выберите правильный вариант: She ___ speak five languages.", "options": ["can to", "cans", "can", "is can"], "answer": "can"},
    {"type": "multiple_choice", "question": "Профессия. Выберите правильный вариант: He is ___ engineer.", "options": ["a", "an", "the", "—"], "answer": "an"},
    {"type": "multiple_choice", "question": "Отрицание: Students ___ access the restricted database.", "options": ["can not to", "cannot", "cants", "not can"], "answer": "cannot"},
    {"type": "multiple_choice", "question": "Вопрос: ___ she work independently?", "options": ["Does can", "Can", "Is can", "Cans"], "answer": "Can"},
    {"type": "true_false", "question": "She cans speak English and Kazakh fluently.", "answer": "wrong", "explanation": "can не изменяется по лицам: She can speak English and Kazakh fluently."},
    {"type": "true_false", "question": "Researchers can access the full dataset online.", "answer": "correct", "explanation": "can + базовая форма access. Верно!"},
    {"type": "error_correction", "question": "He is doctor who can to analyse complex data. She cans work as an engineer.", "answer": "He is a doctor who can analyse complex data. She can work as an engineer."},
    {"type": "multiple_choice", "question": "Гендерно-нейтральный термин для policeman:", "options": ["policewoman", "police officer", "policeperson", "officer man"], "answer": "police officer"},
    {"type": "fill_blank", "question": "I ___ (can) speak English. She ___ (cannot) drive. ___ (Can) you help me with the research?", "answer": "can / cannot / Can"},
    {"type": "multiple_choice", "question": "Can vs Could. Академический стиль: ___ suggest further investigation.", "options": ["This can", "This could", "This cans", "оба a и b правильны"], "answer": "оба a и b правильны"},
    {"type": "error_correction", "question": "Can she speaks Kazakh? I am researcher. They can working remotely.", "answer": "Can she speak Kazakh? I am a researcher. They can work remotely."},
    {"type": "fill_blank", "question": "The methodology ___ (can) be applied to different contexts. Researchers ___ (can) access the data. The results ___ (cannot) be generalised without further study.", "answer": "can / can / cannot"},
    {"type": "multiple_choice", "question": "CV язык. Выберите лучший вариант:", "options": ["I can to communicate in English.", "I can communicate effectively in English.", "I cans communicate in English.", "I am can communicate in English."], "answer": "I can communicate effectively in English."},
    {"type": "true_false", "question": "This approach could suggest a correlation between the variables.", "answer": "correct", "explanation": "could — осторожное предположение в академическом тексте. Верно!"},
    {"type": "multiple_choice", "question": "What do you do? Выберите правильный ответ:", "options": ["I am doing research.", "I am a researcher.", "I can researcher.", "My job is researcher."], "answer": "I am a researcher."},
    {"type": "error_correction", "question": "She is an doctor. He can works as architect. Can they accessed the database?", "answer": "She is a doctor. He can work as an architect. Can they access the database?"},
    {"type": "fill_blank", "question": "A ___ (doctor) can diagnose diseases. An ___ (engineer) can design systems. A ___ (researcher) can conduct experiments.", "answer": "doctor / engineer / researcher"},
    {"type": "true_false", "question": "Students can submitting their assignments online by Friday.", "answer": "wrong", "explanation": "После can — базовая форма: Students can submit their assignments online."},
    {"type": "multiple_choice", "question": "Академический контекст. Выберите наиболее точный вариант:", "options": ["The findings can show results.", "The findings can inform future policy decisions.", "The findings cans be used.", "The finding can used."], "answer": "The findings can inform future policy decisions."},
    {"type": "academic_writing", "question": "Напишите абзац из 5-6 предложений описывающий профессиональные навыки исследователя или специалиста в вашей области. Используйте: 3 конструкции с can, 1 конструкцию с cannot, 1 конструкцию с could, правильные артикли с профессиями.", "tip": "Например: A data scientist is a professional who can... She can also... Researchers in this field can... However, they cannot... The findings could..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 3
  AND l.order_index = 1
)
AND type = 'grammar';
