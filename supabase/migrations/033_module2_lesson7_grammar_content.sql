-- ============================================================
-- 033: Grammar content for A1 Beginner / Module 2 / Lesson 7
--      "Negation"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Negation — Negative Sentences & Not",
  "academic_intro": "Отрицание (negation) — фундаментальная грамматическая категория позволяющая выражать отсутствие, противоположность или несогласие с утверждением. В английском языке система отрицания устроена принципиально иначе чем в русском: запрещено двойное отрицание, частица not всегда присоединяется к вспомогательному глаголу а не к основному.",
  "rules": [
    {
      "rule": "Правило 1 — NOT после вспомогательного глагола",
      "pattern": "Subject + Auxiliary + NOT + Main Verb + Object",
      "tense_forms": [
        {"tense": "Present Simple", "auxiliary": "do not / does not", "examples": [{"positive": "She attends lectures.", "negative": "She does not attend lectures."}, {"positive": "The results show improvement.", "negative": "The results do not show improvement."}]},
        {"tense": "Past Simple", "auxiliary": "did not", "examples": [{"positive": "They conducted the experiment.", "negative": "They did not conduct the experiment."}, {"positive": "The study confirmed the hypothesis.", "negative": "The study did not confirm the hypothesis."}]},
        {"tense": "To Be", "auxiliary": "am/is/are + not", "examples": [{"positive": "The results are significant.", "negative": "The results are not significant."}, {"positive": "The methodology is reliable.", "negative": "The methodology is not reliable."}]},
        {"tense": "Present Perfect", "auxiliary": "have not / has not", "examples": [{"positive": "She has completed the analysis.", "negative": "She has not completed the analysis."}]},
        {"tense": "Modal Verbs", "auxiliary": "cannot / will not / should not", "examples": [{"positive": "Students can access the database.", "negative": "Students cannot access the database."}, {"positive": "Researchers should ignore the data.", "negative": "Researchers should not ignore the data."}]}
      ]
    },
    {
      "rule": "Правило 2 — Полные формы и сокращения",
      "explanation": "В академическом письме строго предпочтительны полные формы. Сокращения характерны для разговорной речи.",
      "contraction_table": [
        {"full": "do not", "contracted": "don\u0027t", "academic": "do not"},
        {"full": "does not", "contracted": "doesn\u0027t", "academic": "does not"},
        {"full": "did not", "contracted": "didn\u0027t", "academic": "did not"},
        {"full": "is not", "contracted": "isn\u0027t", "academic": "is not"},
        {"full": "are not", "contracted": "aren\u0027t", "academic": "are not"},
        {"full": "have not", "contracted": "haven\u0027t", "academic": "have not"},
        {"full": "will not", "contracted": "won\u0027t", "academic": "will not"},
        {"full": "cannot", "contracted": "can\u0027t", "academic": "cannot"},
        {"full": "should not", "contracted": "shouldn\u0027t", "academic": "should not"}
      ],
      "note": "cannot пишется как ОДНО слово"
    },
    {
      "rule": "Правило 3 — Запрет двойного отрицания",
      "explanation": "В русском языке двойное отрицание является нормой. В английском языке двойное отрицание ГРАММАТИЧЕСКИ НЕВЕРНО и недопустимо в академическом тексте.",
      "double_negative_examples": [
        {"russian": "Я никогда не говорил этого.", "wrong_english": "I never didn\u0027t say that.", "correct_english": "I never said that."},
        {"russian": "Никто ничего не знает.", "wrong_english": "Nobody doesn\u0027t know nothing.", "correct_english": "Nobody knows anything."},
        {"russian": "Мы нигде не нашли доказательств.", "wrong_english": "We didn\u0027t find no evidence.", "correct_english": "We did not find any evidence."}
      ],
      "negative_words": [
        {"negative_word": "no", "use_with": "any", "example": "There is no evidence. / There is not any evidence."},
        {"negative_word": "nobody", "use_with": "anybody", "example": "Nobody knows. / No one knows."},
        {"negative_word": "nothing", "use_with": "anything", "example": "Nothing happened. / We did not find anything."},
        {"negative_word": "never", "use_with": "ever", "example": "She never agrees."},
        {"negative_word": "nowhere", "use_with": "anywhere", "example": "The data cannot be found anywhere."}
      ]
    },
    {
      "rule": "Правило 4 — Отрицательные слова и их позиция",
      "negative_words_detailed": [
        {"word": "no", "use": "перед существительным", "examples": ["There is no evidence.", "No significant difference was found."]},
        {"word": "never", "use": "перед основным глаголом или после to be", "examples": ["The study never confirmed these results.", "Such findings are never straightforward."]},
        {"word": "neither...nor", "use": "отрицание двух элементов", "examples": ["Neither the first nor the second hypothesis was confirmed.", "Neither time nor resources were sufficient."]},
        {"word": "hardly / scarcely / barely", "use": "почти не — частичное отрицание", "examples": ["There is hardly any evidence.", "The results barely reached significance."]},
        {"word": "lack of", "use": "недостаток, отсутствие", "examples": ["The lack of evidence prevents firm conclusions.", "A lack of funding limited the study."]},
        {"word": "fail to", "use": "академическое отрицание", "examples": ["The study fails to address this limitation.", "The methodology fails to account for confounding variables."]}
      ]
    },
    {
      "rule": "Правило 5 — Отрицание в академическом письме",
      "academic_negation_patterns": [
        {"pattern": "The study does not/did not + verb", "examples": ["The study does not claim to establish causality.", "The research did not address the long-term effects."]},
        {"pattern": "There is no + noun", "examples": ["There is no consensus in the literature.", "There is no significant difference between the groups."]},
        {"pattern": "The results fail to + verb", "examples": ["The results fail to support the initial hypothesis.", "The methodology fails to account for individual differences."]},
        {"pattern": "Neither X nor Y", "examples": ["Neither the quantitative nor the qualitative data confirmed the hypothesis.", "Neither time nor resources were sufficient."]}
      ]
    },
    {
      "rule": "Правило 6 — Эмфатическое отрицание",
      "emphatic_negation": [
        {"construction": "By no means", "meaning": "ни в коем случае не", "example": "The results are by no means conclusive."},
        {"construction": "In no way", "meaning": "никоим образом", "example": "The findings in no way support the original claim."},
        {"construction": "Far from", "meaning": "далеко не", "example": "The results are far from satisfactory."},
        {"construction": "Not only...but also", "example": "Not only did the study fail to confirm the hypothesis, but it also revealed contradictory evidence."}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She don\u0027t study English.", "correct": "She does not study English.", "explanation": "3-е лицо ед.ч.: does not."},
    {"wrong": "The study didn\u0027t confirmed the hypothesis.", "correct": "The study did not confirm the hypothesis.", "explanation": "После did not — базовая форма глагола."},
    {"wrong": "Nobody doesn\u0027t know the answer.", "correct": "Nobody knows the answer.", "explanation": "Двойное отрицание недопустимо."},
    {"wrong": "We didn\u0027t find no evidence.", "correct": "We did not find any evidence.", "explanation": "Двойное отрицание: выберите один способ отрицания."},
    {"wrong": "She never doesn\u0027t miss a lecture.", "correct": "She never misses a lecture.", "explanation": "never — уже отрицание."},
    {"wrong": "Can not be determined from this data.", "correct": "This cannot be determined from this data.", "explanation": "Предложение должно иметь подлежащее; cannot — одно слово."}
  ],
  "academic_examples": [
    "The study does not claim to establish a causal relationship between the variables.",
    "There is no consensus in the existing literature regarding the most effective approach.",
    "Neither the quantitative nor the qualitative analysis confirmed the initial hypothesis.",
    "The findings fail to support the theoretical framework proposed by earlier researchers.",
    "The results are by no means conclusive and require further investigation.",
    "There is hardly any evidence to suggest that the intervention had long-term effects."
  ],
  "dialogues": [
    {"title": "Академическая дискуссия", "lines": [
      {"speaker": "Professor", "text": "Does your research support the hypothesis?"},
      {"speaker": "Student", "text": "No, it does not. The results do not show a significant correlation."},
      {"speaker": "Professor", "text": "Did you find any contradicting evidence?"},
      {"speaker": "Student", "text": "There is no conclusive evidence either way. Neither the first nor the second hypothesis was confirmed."},
      {"speaker": "Professor", "text": "Negative results are by no means worthless in academic research."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Образуйте отрицание: She attends all lectures.", "options": ["She don\u0027t attend all lectures.", "She doesn\u0027t attends all lectures.", "She does not attend all lectures.", "She not attend all lectures."], "answer": "She does not attend all lectures."},
    {"type": "multiple_choice", "question": "Прошедшее время: The study confirmed the hypothesis.", "options": ["The study didn\u0027t confirmed the hypothesis.", "The study did not confirm the hypothesis.", "The study not confirmed the hypothesis.", "The study hasn\u0027t confirmed the hypothesis."], "answer": "The study did not confirm the hypothesis."},
    {"type": "true_false", "question": "Nobody doesn\u0027t understand the methodology.", "answer": "wrong", "explanation": "Двойное отрицание недопустимо: Nobody understands the methodology."},
    {"type": "multiple_choice", "question": "Академический стиль:", "options": ["The study doesn\u0027t show improvement.", "The study does not demonstrate improvement.", "The study don\u0027t show improvement.", "The study isn\u0027t showing improvement."], "answer": "The study does not demonstrate improvement."},
    {"type": "error_correction", "question": "We didn\u0027t found no evidence nowhere in the data.", "answer": "We did not find any evidence anywhere in the data."},
    {"type": "multiple_choice", "question": "Neither...nor:", "options": ["Neither time or resources were sufficient.", "Neither time nor resources were sufficient.", "Neither time and resources were sufficient.", "Not time nor resources were sufficient."], "answer": "Neither time nor resources were sufficient."},
    {"type": "true_false", "question": "The results are by no means conclusive.", "answer": "correct", "explanation": "by no means = ни в коем случае не. Верно!"},
    {"type": "error_correction", "question": "She never doesn\u0027t miss a class. The data don\u0027t supports the claim. Can not be determined.", "answer": "She never misses a class. The data do not support the claim. This cannot be determined."},
    {"type": "multiple_choice", "question": "Выберите правильный вариант с hardly:", "options": ["There is hardly no evidence.", "There is hardly any evidence.", "There is hardly not evidence.", "There is hardly some evidence."], "answer": "There is hardly any evidence."},
    {"type": "fill_blank", "question": "The study ___ (does not) support the hypothesis. There ___ (is no) consensus. ___ (Neither) the first ___ (nor) the second approach was effective.", "answer": "does not / is no / Neither / nor"},
    {"type": "multiple_choice", "question": "cannot vs can not:", "options": ["can not — правильнее", "cannot — предпочтительнее", "оба равнозначны", "нужно cant"], "answer": "cannot — предпочтительнее"},
    {"type": "error_correction", "question": "The results didn\u0027t showed no improvement. Nobody didn\u0027t attend the lecture. The study not address the limitations.", "answer": "The results did not show any improvement. Nobody attended the lecture. The study does not address the limitations."},
    {"type": "multiple_choice", "question": "Fail to в академическом письме:", "options": ["The methodology fails to account for individual differences.", "The methodology failing to account.", "The methodology is fail to account.", "The methodology doesn\u0027t failing to account."], "answer": "The methodology fails to account for individual differences."},
    {"type": "fill_blank", "question": "___ (Not only) did the study fail to confirm the hypothesis, ___ (but) it also revealed contradictory evidence. The findings are ___ (far from) conclusive.", "answer": "Not only / but / far from"},
    {"type": "true_false", "question": "The findings do not support the theoretical framework proposed by Smith (2019).", "answer": "correct", "explanation": "do not support — правильная форма. Верно!"},
    {"type": "multiple_choice", "question": "Переведите: Мы нигде не нашли доказательств.", "options": ["We didn\u0027t find no evidence nowhere.", "We didn\u0027t find nothing anywhere.", "We did not find any evidence anywhere.", "We found no evidence anywhere."], "answer": "We did not find any evidence anywhere."},
    {"type": "error_correction", "question": "She don\u0027t agrees with the theory. The data doesn\u0027t confirmed previous findings. Neither the method or the sample was appropriate.", "answer": "She does not agree with the theory. The data did not confirm previous findings. Neither the method nor the sample was appropriate."},
    {"type": "fill_blank", "question": "___ (There is no) clear evidence of causality. The results ___ (fail to) support the hypothesis. The findings are ___ (by no means) final.", "answer": "There is no / fail to / by no means"},
    {"type": "true_false", "question": "In no way does the evidence support the claim made by previous researchers.", "answer": "correct", "explanation": "In no way + инверсия: does the evidence. Верно!"},
    {"type": "academic_writing", "question": "Напишите абзац из 5-6 предложений описывающий ограничения исследования. Используйте: 2 конструкции с does/did not, 1 конструкцию there is no, 1 neither...nor, 1 fail to или by no means.", "tip": "The study does not establish causality... There is no consensus... Neither the sample size nor... The methodology fails to... The findings are by no means..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 2
  AND l.order_index = 7
)
AND type = 'grammar';
