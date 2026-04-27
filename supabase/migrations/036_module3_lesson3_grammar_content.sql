-- ============================================================
-- 036: Grammar content for A1 Beginner / Module 3 / Lesson 3
--      "My Skills — Can vs Cannot"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "My Skills — Can vs Cannot",
  "academic_intro": "Противопоставление can и cannot является фундаментальным грамматическим явлением английского языка. В профессиональном и академическом контексте умение чётко описывать свои навыки и компетенции — а также их ограничения — критически важно для резюме, исследовательских заявок, академических автобиографий и профессиональной коммуникации. В академическом письме can и cannot также используются для описания возможностей и ограничений методологии, теоретических рамок и результатов исследований.",
  "rules": [
    {
      "rule": "Правило 1 — Can vs Cannot: основное противопоставление",
      "explanation": "Can выражает наличие способности или возможности. Cannot выражает отсутствие способности или возможности. Это противопоставление используется во всех регистрах языка от разговорного до академического.",
      "comparison_table": [
        {"can": "I can speak English fluently.", "cannot": "I cannot speak Chinese."},
        {"can": "She can analyse complex datasets.", "cannot": "She cannot programme in Java."},
        {"can": "The methodology can be applied universally.", "cannot": "The results cannot be generalised to all populations."},
        {"can": "Researchers can access the database online.", "cannot": "Students cannot access restricted archives without permission."},
        {"can": "This software can process real-time data.", "cannot": "This approach cannot account for individual differences."}
      ]
    },
    {
      "rule": "Правило 2 — Краткие ответы с Can",
      "explanation": "В английском языке краткие ответы на вопросы с can обязательны в формальном общении. Они не повторяют основной глагол — только вспомогательный.",
      "short_answers": [
        {"question": "Can you speak Kazakh?", "yes": "Yes, I can.", "no": "No, I cannot. / No, I can\u0027t."},
        {"question": "Can she conduct interviews?", "yes": "Yes, she can.", "no": "No, she cannot."},
        {"question": "Can they access the data?", "yes": "Yes, they can.", "no": "No, they cannot."},
        {"question": "Can the system process this?", "yes": "Yes, it can.", "no": "No, it cannot."}
      ],
      "note": "В академическом и формальном контексте предпочтительны полные формы: cannot (не can\u0027t), I can (не yeah I can)."
    },
    {
      "rule": "Правило 3 — Описание навыков и компетенций",
      "explanation": "Описание профессиональных навыков с использованием can является ключевым элементом резюме, сопроводительных писем и академических профилей. Существуют устойчивые паттерны для разных уровней компетенции.",
      "skill_levels": [
        {
          "level": "Высокий уровень (Advanced)",
          "expressions": ["I can fluently...", "I can proficiently...", "I can independently...", "I am fully capable of..."],
          "examples": [
            "I can fluently communicate research findings in English.",
            "I can independently design and conduct research studies.",
            "I can proficiently use statistical analysis software."
          ]
        },
        {
          "level": "Средний уровень (Intermediate)",
          "expressions": ["I can adequately...", "I can work with... to some extent", "I have basic ability to..."],
          "examples": [
            "I can adequately present findings to academic audiences.",
            "I can work with qualitative data to some extent.",
            "I have basic ability to programme in Python."
          ]
        },
        {
          "level": "Ограниченный уровень",
          "expressions": ["I cannot yet...", "I am currently unable to...", "I am developing my ability to..."],
          "examples": [
            "I cannot yet conduct advanced statistical analysis independently.",
            "I am currently unable to work with large unstructured datasets.",
            "I am developing my ability to write for international publication."
          ]
        }
      ],
      "cv_skills": [
        "I can communicate effectively in English, Kazakh and Russian.",
        "I can manage complex research projects from inception to publication.",
        "I can collaborate with international research teams.",
        "I cannot yet lead a research group independently but am developing this skill.",
        "I can analyse both qualitative and quantitative data."
      ]
    },
    {
      "rule": "Правило 4 — Can/Cannot с различными временами",
      "explanation": "Can используется только в настоящем времени. Для других времён используются эквивалентные конструкции.",
      "tense_equivalents": [
        {"tense": "Present", "form": "can / cannot", "example": "She can analyse data now."},
        {"tense": "Past", "form": "could / could not", "example": "She could not analyse data last year."},
        {"tense": "Future", "form": "will be able to / will not be able to", "example": "She will be able to analyse data after the training."},
        {"tense": "Present Perfect", "form": "has been able to / has not been able to", "example": "She has been able to analyse data since completing the course."},
        {"tense": "Infinitive", "form": "to be able to", "example": "It is important to be able to analyse data critically."}
      ],
      "academic_examples": [
        "The researchers could not access the restricted archives during the study period.",
        "Future studies will be able to build on these preliminary findings.",
        "The team has not been able to replicate the original results.",
        "It is essential to be able to critically evaluate sources."
      ]
    },
    {
      "rule": "Правило 5 — Cannot в академических ограничениях (Limitations)",
      "explanation": "Раздел ограничений исследования (limitations) является обязательной частью академических работ. Cannot и related expressions используются для честного описания того что исследование не может утверждать или доказать.",
      "limitation_patterns": [
        {"pattern": "The study cannot claim...", "example": "The study cannot claim to represent the views of all university students in Kazakhstan."},
        {"pattern": "The results cannot be generalised to...", "example": "The results cannot be generalised to populations outside the urban context."},
        {"pattern": "The methodology cannot account for...", "example": "The methodology cannot account for individual variation in learning styles."},
        {"pattern": "We cannot conclude that...", "example": "We cannot conclude that there is a causal relationship based on correlational data."},
        {"pattern": "This research cannot address...", "example": "This research cannot address long-term effects as it is a cross-sectional study."}
      ]
    },
    {
      "rule": "Правило 6 — Вопросы о способностях в академическом контексте",
      "explanation": "Вопросы с can в академическом контексте используются для изучения возможностей методологии, теории и практического применения результатов.",
      "question_types": [
        {
          "type": "Вопросы о применимости",
          "examples": [
            "Can this methodology be applied to other cultural contexts?",
            "Can the findings be replicated in a laboratory setting?",
            "Can this framework account for individual differences?"
          ]
        },
        {
          "type": "Вопросы о возможностях",
          "examples": [
            "Can artificial intelligence replace human researchers?",
            "Can online education achieve the same outcomes as face-to-face instruction?",
            "Can big data analysis reveal patterns invisible to traditional methods?"
          ]
        },
        {
          "type": "Риторические вопросы в академических текстах",
          "examples": [
            "Can we truly measure creativity using standardised tests?",
            "Can a single study establish causality?",
            "Can qualitative and quantitative methods be meaningfully integrated?"
          ]
        }
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She can not speaks English.", "correct": "She cannot speak English.", "explanation": "cannot — одно слово (предпочтительно); после can — базовая форма без -s."},
    {"wrong": "Can she speaks Kazakh? Yes, she cans.", "correct": "Can she speak Kazakh? Yes, she can.", "explanation": "В вопросе после can — базовая форма. Can не изменяется."},
    {"wrong": "I will can attend the conference.", "correct": "I will be able to attend the conference.", "explanation": "can не используется с will — нужно will be able to."},
    {"wrong": "She cannot to access the database.", "correct": "She cannot access the database.", "explanation": "После cannot — базовая форма без to."},
    {"wrong": "The results can generalised to all groups.", "correct": "The results can be generalised to all groups.", "explanation": "Пассивный залог: can be + past participle."},
    {"wrong": "We canned conduct the experiment last year.", "correct": "We could conduct the experiment last year.", "explanation": "Прошедшее время от can — could, не canned."}
  ],
  "academic_examples": [
    "The study cannot claim to establish a causal relationship between the variables.",
    "Future research will be able to build on these preliminary findings with larger samples.",
    "Researchers can now access vast amounts of data that were previously unavailable.",
    "The methodology cannot account for cultural variations in how participants interpret the questions.",
    "This framework can be applied to educational contexts across Central Asia.",
    "The team could not replicate the original findings under controlled laboratory conditions."
  ],
  "dialogues": [
    {"title": "Описание навыков на собеседовании", "lines": [
      {"speaker": "Interviewer", "text": "Can you describe your research skills?"},
      {"speaker": "Candidate", "text": "Yes, I can conduct both qualitative and quantitative research. I can also analyse data using SPSS and R."},
      {"speaker": "Interviewer", "text": "Can you work with large datasets independently?"},
      {"speaker": "Candidate", "text": "I can work with datasets of moderate size independently. I cannot yet manage very large unstructured datasets without support, but I am developing this skill."},
      {"speaker": "Interviewer", "text": "Can you present findings to non-specialist audiences?"},
      {"speaker": "Candidate", "text": "Yes, I can. I have presented at three public events and can adapt my communication style to different audiences."}
    ]},
    {"title": "Обсуждение ограничений исследования", "lines": [
      {"speaker": "Supervisor", "text": "What are the main limitations of your study?"},
      {"speaker": "Student", "text": "The study cannot be generalised beyond the university context. We also cannot claim causality from correlational data."},
      {"speaker": "Supervisor", "text": "Can the methodology account for individual differences?"},
      {"speaker": "Student", "text": "Unfortunately, it cannot. The sample size is also too small to make broad claims."},
      {"speaker": "Supervisor", "text": "Can future research address these limitations?"},
      {"speaker": "Student", "text": "Yes, it can. A longitudinal study with a larger sample will be able to establish more robust conclusions."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Can vs Cannot: The results ___ be generalised to all populations.", "options": ["can", "cannot", "оба возможны в зависимости от контекста", "cans"], "answer": "оба возможны в зависимости от контекста"},
    {"type": "multiple_choice", "question": "Краткий ответ: Can she conduct interviews? ___", "options": ["Yes, she cans.", "Yes, she is.", "Yes, she can.", "Yes, she does."], "answer": "Yes, she can."},
    {"type": "multiple_choice", "question": "Будущее время: She ___ attend the conference next year.", "options": ["can", "will can", "will be able to", "cans"], "answer": "will be able to"},
    {"type": "multiple_choice", "question": "Прошедшее время: They ___ access the archives last year.", "options": ["can not", "could not", "cannot", "will not be able to"], "answer": "could not"},
    {"type": "true_false", "question": "The study cannot to establish causality from correlational data.", "answer": "wrong", "explanation": "После cannot — базовая форма без to: The study cannot establish causality."},
    {"type": "true_false", "question": "Researchers can now access data that was previously unavailable.", "answer": "correct", "explanation": "can + базовая форма access. Верно!"},
    {"type": "error_correction", "question": "She can not speaks English. I will can attend. They canned conduct the experiment.", "answer": "She cannot speak English. I will be able to attend. They could conduct the experiment."},
    {"type": "fill_blank", "question": "The study ___ (cannot) claim causality. Future research ___ (will be able to) address this. Last year we ___ (could not) access the data.", "answer": "cannot / will be able to / could not"},
    {"type": "multiple_choice", "question": "Ограничения исследования. Выберите академически правильный вариант:", "options": ["We cannot conclude that X causes Y.", "We can not to conclude that X causes Y.", "We cans not conclude that X causes Y.", "We not can conclude that X causes Y."], "answer": "We cannot conclude that X causes Y."},
    {"type": "fill_blank", "question": "CV: I ___ (can) communicate in three languages. I ___ (cannot) yet lead a team independently. I ___ (will be able to) develop this skill with experience.", "answer": "can / cannot / will be able to"},
    {"type": "error_correction", "question": "Can she speaks Kazakh? The results can generalised. She cannot to access the database.", "answer": "Can she speak Kazakh? The results can be generalised. She cannot access the database."},
    {"type": "multiple_choice", "question": "Пассивный залог с can: This methodology ___ to other contexts.", "options": ["can apply", "can applied", "can be apply", "can be applied"], "answer": "can be applied"},
    {"type": "fill_blank", "question": "Напишите три ограничения исследования используя cannot: 1. The study ___ 2. The results ___ 3. The methodology ___", "answer": "The study cannot claim... / The results cannot be generalised... / The methodology cannot account for..."},
    {"type": "true_false", "question": "The team has not been able to replicate the original results.", "answer": "correct", "explanation": "has not been able to — правильный Present Perfect эквивалент cannot. Верно!"},
    {"type": "multiple_choice", "question": "Уровень навыка. Какое выражение указывает на высокий уровень?", "options": ["I cannot yet...", "I am developing my ability to...", "I can fluently...", "I have basic ability to..."], "answer": "I can fluently..."},
    {"type": "error_correction", "question": "I will can speak English better next year. She canned attend the conference. Can they accessed the data?", "answer": "I will be able to speak English better next year. She could attend the conference. Can they access the data?"},
    {"type": "fill_blank", "question": "Вопросы о методологии: ___ (Can) this methodology be applied universally? ___ (Can) the findings be replicated? ___ (Cannot) we claim causality without experimental data?", "answer": "Can / Can / Cannot"},
    {"type": "true_false", "question": "This approach can be applied to educational contexts across Central Asia.", "answer": "correct", "explanation": "can be applied — правильный пассив. Верно!"},
    {"type": "error_correction", "question": "The study can not to claim representativeness. Future research will can address this limitation. We canned not replicate the findings.", "answer": "The study cannot claim representativeness. Future research will be able to address this limitation. We could not replicate the findings."},
    {"type": "academic_writing", "question": "Напишите раздел Limitations (ограничения) для воображаемого исследования из 5-6 предложений. Используйте: 3 конструкции с cannot, 1 с could not, 1 с will be able to для будущих рекомендаций.", "tip": "Например: The study cannot claim... The results cannot be generalised... The methodology cannot account for... We could not access... Future research will be able to..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 3
  AND l.order_index = 3
)
AND type = 'grammar';
