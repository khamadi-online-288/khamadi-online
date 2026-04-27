-- ============================================================
-- 037: Grammar content — B1 Intermediate / Module 1 / Lesson 1
--      "Gerunds & Infinitives — Герундий и Инфинитив"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Gerunds & Infinitives — Герундий и Инфинитив",
  "explanation": "Герундий (Gerund) — это форма глагола с окончанием -ing, которая функционирует как существительное (studying, writing, researching). Инфинитив (Infinitive) — это базовая форма глагола с частицей to (to study, to write, to research). Выбор между герундием и инфинитивом — одна из самых частых трудностей B1-уровня. Некоторые глаголы требуют только герундия, другие — только инфинитива. Есть глаголы, после которых оба варианта возможны с одинаковым значением, но существуют и глаголы, где выбор формы кардинально меняет смысл предложения. Последняя группа требует особого внимания.",

  "sections": [
    {
      "heading": "1. Глаголы, после которых используется ТОЛЬКО герундий",
      "rule": "Эти глаголы всегда требуют герундия (-ing форму). Использование инфинитива с ними является грамматической ошибкой.",
      "categories": [
        {
          "group": "Глаголы предпочтений и отношения к деятельности",
          "verbs": ["enjoy", "mind", "dislike", "can't stand", "can't help", "miss"],
          "examples": [
            "She enjoys conducting research in the laboratory.",
            "He doesn't mind working late to finish the analysis.",
            "Many students can't stand writing long literature reviews.",
            "She misses attending the weekly research seminars."
          ]
        },
        {
          "group": "Глаголы избегания, завершения и откладывания",
          "verbs": ["avoid", "finish", "give up", "quit", "postpone", "delay", "put off"],
          "examples": [
            "Researchers should avoid overgeneralising from limited data.",
            "She finally finished writing her doctoral dissertation.",
            "He gave up trying to replicate the original experiment.",
            "The committee postponed making a decision until next month."
          ]
        },
        {
          "group": "Глаголы признания, предложения и рассмотрения",
          "verbs": ["admit", "deny", "suggest", "recommend", "consider", "imagine", "justify", "involve"],
          "examples": [
            "The author admits making several methodological errors.",
            "The professor suggested conducting a follow-up study.",
            "We considered using a mixed-methods approach.",
            "The methodology involves collecting data from multiple sources."
          ]
        },
        {
          "group": "Глаголы продолжения и практики",
          "verbs": ["keep", "keep on", "practise", "risk"],
          "examples": [
            "Students should keep revising their drafts until the deadline.",
            "She kept on analysing the data even after the initial findings.",
            "Practising academic writing improves your research output.",
            "Without proper citations, you risk committing plagiarism."
          ]
        }
      ]
    },
    {
      "heading": "2. Глаголы, после которых используется ТОЛЬКО инфинитив",
      "rule": "Эти глаголы всегда требуют инфинитива (to + базовая форма). Использование герундия с ними является грамматической ошибкой.",
      "categories": [
        {
          "group": "Глаголы решения и намерения",
          "verbs": ["decide", "choose", "plan", "intend", "aim", "determine", "arrange"],
          "examples": [
            "The research team decided to expand the sample size.",
            "She chose to focus on qualitative methods for her thesis.",
            "We plan to submit the paper to an international journal.",
            "The study aims to identify key factors affecting student performance."
          ]
        },
        {
          "group": "Глаголы желания и надежды",
          "verbs": ["want", "wish", "hope", "expect", "would like", "desire"],
          "examples": [
            "Most graduate students want to publish in indexed journals.",
            "The researcher hopes to receive funding for the next phase.",
            "We expect to complete data collection by the end of term."
          ]
        },
        {
          "group": "Глаголы согласия и отказа",
          "verbs": ["agree", "refuse", "offer", "promise", "threaten", "decline"],
          "examples": [
            "All participants agreed to sign the informed consent form.",
            "The committee refused to approve the research proposal.",
            "She offered to assist with the statistical analysis."
          ]
        },
        {
          "group": "Глаголы способности и вида",
          "verbs": ["manage", "fail", "tend", "seem", "appear", "pretend", "learn", "prepare"],
          "examples": [
            "The student managed to defend her thesis despite the challenges.",
            "The initial experiment failed to produce significant results.",
            "Academic papers tend to follow a standard IMRAD structure.",
            "The results appear to support the original hypothesis."
          ]
        }
      ]
    },
    {
      "heading": "3. Глаголы, после которых возможны оба варианта (значение не меняется)",
      "rule": "После этих глаголов можно использовать как герундий, так и инфинитив без изменения смысла. В академическом письме обычно предпочтителен инфинитив.",
      "pairs": [
        {
          "verb": "like / love / hate / prefer",
          "gerund": "She likes conducting fieldwork.",
          "infinitive": "She likes to conduct fieldwork.",
          "note": "Оба варианта выражают общее отношение к деятельности"
        },
        {
          "verb": "begin / start / continue",
          "gerund": "The researchers began collecting data in January.",
          "infinitive": "The researchers began to collect data in January.",
          "note": "В прогрессивном времени предпочтителен инфинитив: She was beginning to understand..."
        },
        {
          "verb": "can't bear",
          "gerund": "He can't bear making mistakes in citations.",
          "infinitive": "He can't bear to make mistakes in citations.",
          "note": "Оба равнозначны; выражают нетерпимость к чему-либо"
        },
        {
          "verb": "intend / attempt",
          "gerund": "We intend submitting the paper next month.",
          "infinitive": "We intend to submit the paper next month.",
          "note": "Инфинитив более формален и предпочтителен в академическом письме"
        }
      ]
    },
    {
      "heading": "4. Глаголы, где выбор формы МЕНЯЕТ смысл",
      "rule": "Это наиболее важная группа для изучения. Неправильный выбор формы приводит к изменению значения предложения.",
      "table": [
        {
          "verb": "remember",
          "gerund_meaning": "Вспоминать (о прошлом действии)",
          "gerund_example": "I remember reading this article before — it was very insightful.",
          "infinitive_meaning": "Не забыть сделать (будущее/настоящее действие)",
          "infinitive_example": "Remember to cite all sources in your bibliography."
        },
        {
          "verb": "forget",
          "gerund_meaning": "Не помнить (о прошлом действии)",
          "gerund_example": "She forgot submitting the form — she thought she hadn't done it.",
          "infinitive_meaning": "Забыть сделать (не выполнить действие)",
          "infinitive_example": "He forgot to submit the assignment and received a penalty."
        },
        {
          "verb": "stop",
          "gerund_meaning": "Прекратить заниматься чем-либо",
          "gerund_example": "The professor stopped lecturing when the fire alarm went off.",
          "infinitive_meaning": "Остановиться чтобы сделать что-то (цель остановки)",
          "infinitive_example": "She stopped to read a fascinating passage in the methodology chapter."
        },
        {
          "verb": "try",
          "gerund_meaning": "Попробовать, поэкспериментировать (посмотреть что получится)",
          "gerund_example": "Try using a different statistical model to see if results improve.",
          "infinitive_meaning": "Попытаться, приложить усилия",
          "infinitive_example": "The student tried to understand the complex theoretical framework."
        },
        {
          "verb": "regret",
          "gerund_meaning": "Сожалеть о совершённом в прошлом",
          "gerund_example": "She regretted not attending the international conference last year.",
          "infinitive_meaning": "Сожалеть о том, что приходится сообщить (формула вежливости)",
          "infinitive_example": "We regret to inform you that your application was unsuccessful."
        },
        {
          "verb": "go on",
          "gerund_meaning": "Продолжать делать то же самое",
          "gerund_example": "She went on analysing the data for another three hours.",
          "infinitive_meaning": "Перейти к следующему действию",
          "infinitive_example": "After reviewing the literature, she went on to formulate her hypothesis."
        },
        {
          "verb": "mean",
          "gerund_meaning": "Означать, подразумевать",
          "gerund_example": "Conducting qualitative research means spending months in the field.",
          "infinitive_meaning": "Намереваться, иметь в виду сделать",
          "infinitive_example": "I meant to send you the revised draft last week — I apologise."
        }
      ]
    },
    {
      "heading": "5. Герундий после предлогов",
      "rule": "После предлогов в английском языке ВСЕГДА используется герундий, никогда инфинитив. Это правило не имеет исключений.",
      "uses": [
        {
          "pattern": "to be + adjective + preposition + gerund",
          "examples": [
            "She is interested in exploring corpus linguistics.",
            "He is good at presenting complex data clearly.",
            "We are responsible for collecting the survey responses.",
            "They are capable of conducting independent research."
          ]
        },
        {
          "pattern": "Устойчивые выражения с предлогом + герундий",
          "examples": [
            "She is looking forward to attending the doctoral symposium.",
            "Instead of copying, students should paraphrase sources.",
            "He succeeded in publishing his first article in a Q1 journal.",
            "Think about joining a research group before choosing a topic.",
            "In addition to writing the introduction, revise the methodology."
          ]
        },
        {
          "pattern": "Предлоги before / after / without / by",
          "examples": [
            "Before submitting the paper, always check the formatting guidelines.",
            "After completing the data collection, analyse the results.",
            "You cannot pass the course without attending at least 80% of lectures.",
            "By reviewing previous studies, the researcher identified a gap."
          ]
        },
        {
          "pattern": "ВНИМАНИЕ: 'to' как предлог (не частица инфинитива)",
          "examples": [
            "She is used to working under tight deadlines. (not: to work)",
            "We look forward to receiving your feedback. (not: to receive)",
            "He is committed to improving the research methodology. (not: to improve)",
            "In addition to conducting experiments, she teaches graduate students."
          ]
        }
      ]
    }
  ],

  "common_errors": [
    {
      "wrong": "She enjoys to conduct research in the evenings.",
      "correct": "She enjoys conducting research in the evenings.",
      "note": "enjoy всегда требует герундия. Инфинитив после enjoy недопустим."
    },
    {
      "wrong": "I look forward to meet you at the conference.",
      "correct": "I look forward to meeting you at the conference.",
      "note": "'to' здесь — предлог, а не частица инфинитива. После предлога всегда герундий."
    },
    {
      "wrong": "He stopped to smoke during his PhD — a healthy decision.",
      "correct": "He stopped smoking during his PhD — a healthy decision.",
      "note": "stop + gerund = прекратить делать. stop + infinitive = остановиться чтобы сделать."
    },
    {
      "wrong": "Remember submitting the application by Friday.",
      "correct": "Remember to submit the application by Friday.",
      "note": "remember + infinitive = не забыть сделать (будущее). remember + gerund = вспоминать о прошлом."
    },
    {
      "wrong": "She is used to work independently.",
      "correct": "She is used to working independently.",
      "note": "'be used to' — устойчивое выражение, 'to' здесь предлог, поэтому герундий."
    },
    {
      "wrong": "We regret to miss the deadline for submission.",
      "correct": "We regret missing the deadline for submission. / We regret that we missed the deadline.",
      "note": "regret + gerund = сожалеть о прошлом. regret + infinitive = сожалею сообщить (формула вежливости в официальных письмах)."
    },
    {
      "wrong": "The study failed proving the hypothesis.",
      "correct": "The study failed to prove the hypothesis.",
      "note": "fail требует инфинитива: fail to do = не суметь сделать."
    }
  ],

  "exercises": [
    {
      "type": "multiple_choice",
      "instruction": "Выберите правильную форму глагола — герундий или инфинитив. Обратите внимание на значение в контексте.",
      "questions": [
        {
          "id": 1,
          "sentence": "The professor suggested ___ the research design before data collection.",
          "options": ["to revise", "revising", "revise", "revised"],
          "answer": "revising",
          "explanation": "suggest + герундий (suggest doing). Инфинитив после suggest недопустим."
        },
        {
          "id": 2,
          "sentence": "After ___ the literature review, she formulated her research questions.",
          "options": ["to complete", "completed", "completing", "complete"],
          "answer": "completing",
          "explanation": "После предлога after всегда используется герундий."
        },
        {
          "id": 3,
          "sentence": "I remember ___ this methodology article — it was published in 2019.",
          "options": ["to read", "read", "reading", "having read"],
          "answer": "reading",
          "explanation": "remember + герундий = вспоминать о прошлом действии. Чтение уже произошло."
        },
        {
          "id": 4,
          "sentence": "Please remember ___ your signed consent forms to the next session.",
          "options": ["bringing", "brought", "to bring", "to bringing"],
          "answer": "to bring",
          "explanation": "remember + инфинитив = не забыть сделать в будущем. Формы ещё не принесены."
        },
        {
          "id": 5,
          "sentence": "The research team managed ___ significant results despite limited funding.",
          "options": ["obtaining", "to obtain", "obtain", "to obtaining"],
          "answer": "to obtain",
          "explanation": "manage требует инфинитива: manage to do = суметь, удастся сделать."
        },
        {
          "id": 6,
          "sentence": "She is looking forward to ___ her thesis defence next month.",
          "options": ["complete", "to complete", "completing", "completed"],
          "answer": "completing",
          "explanation": "look forward to — устойчивое выражение, 'to' предлог, поэтому герундий."
        },
        {
          "id": 7,
          "sentence": "He stopped ___ and re-read the complex paragraph three times.",
          "options": ["reading", "to read", "read", "to reading"],
          "answer": "to read",
          "explanation": "stop + инфинитив = остановиться чтобы сделать что-то. Он остановился с целью перечитать."
        },
        {
          "id": 8,
          "sentence": "Without ___ ethical approval, you cannot begin data collection.",
          "options": ["obtaining", "to obtain", "obtain", "obtained"],
          "answer": "obtaining",
          "explanation": "После предлога without всегда используется герундий."
        }
      ]
    },
    {
      "type": "fill_in_blank",
      "instruction": "Вставьте глагол в скобках в правильной форме (герундий или инфинитив).",
      "sentences": [
        {
          "id": 1,
          "text": "The study aims ___ (identify) the key factors influencing student academic performance.",
          "answer": "to identify"
        },
        {
          "id": 2,
          "text": "Many researchers avoid ___ (use) passive voice excessively in their writing.",
          "answer": "using"
        },
        {
          "id": 3,
          "text": "She is considering ___ (apply) for a postdoctoral fellowship in Germany.",
          "answer": "applying"
        },
        {
          "id": 4,
          "text": "The committee decided ___ (postpone) the conference until next semester.",
          "answer": "to postpone"
        },
        {
          "id": 5,
          "text": "By ___ (analyse) the qualitative data carefully, she identified three core themes.",
          "answer": "analysing"
        },
        {
          "id": 6,
          "text": "He tends ___ (focus) on quantitative methods rather than qualitative approaches.",
          "answer": "to focus"
        },
        {
          "id": 7,
          "text": "She regrets ___ (not attend) the methodology workshop last semester.",
          "answer": "not attending"
        },
        {
          "id": 8,
          "text": "The paper goes on ___ (discuss) the theoretical implications in section three.",
          "answer": "to discuss"
        },
        {
          "id": 9,
          "text": "Try ___ (read) the abstract first to decide if the full article is relevant.",
          "answer": "reading"
        },
        {
          "id": 10,
          "text": "All participants are required ___ (complete) the pre-study questionnaire.",
          "answer": "to complete"
        }
      ]
    },
    {
      "type": "error_correction",
      "instruction": "Найдите и исправьте ошибки в употреблении герундия или инфинитива. Объясните правило.",
      "sentences": [
        {
          "id": 1,
          "wrong": "She finished to write her literature review at midnight.",
          "correct": "She finished writing her literature review at midnight.",
          "explanation": "finish + герундий. Инфинитив после finish недопустим."
        },
        {
          "id": 2,
          "wrong": "The researcher is committed to improve the validity of her study.",
          "correct": "The researcher is committed to improving the validity of her study.",
          "explanation": "'be committed to' — 'to' является предлогом, поэтому после него герундий."
        },
        {
          "id": 3,
          "wrong": "We regret to not inform you earlier about the schedule change.",
          "correct": "We regret not informing you earlier about the schedule change.",
          "explanation": "regret + герундий = сожалеть о прошлом. Отрицательный герундий: not + -ing."
        },
        {
          "id": 4,
          "wrong": "The student failed submitting the assignment before the deadline.",
          "correct": "The student failed to submit the assignment before the deadline.",
          "explanation": "fail требует инфинитива: fail to do = не суметь, не выполнить."
        },
        {
          "id": 5,
          "wrong": "Instead of to use primary data, they relied on secondary sources.",
          "correct": "Instead of using primary data, they relied on secondary sources.",
          "explanation": "После предлога instead of всегда герундий, не инфинитив."
        },
        {
          "id": 6,
          "wrong": "He stopped to procrastinate and submitted the draft on time.",
          "correct": "He stopped procrastinating and submitted the draft on time.",
          "explanation": "stop + герундий = прекратить делать что-то. stop + инфинитив = остановиться чтобы сделать."
        },
        {
          "id": 7,
          "wrong": "She is used to work with large datasets in her research.",
          "correct": "She is used to working with large datasets in her research.",
          "explanation": "'be used to' — устойчивое выражение, 'to' предлог, поэтому герундий."
        }
      ]
    },
    {
      "type": "meaning_difference",
      "instruction": "Выберите вариант, который точно соответствует русскому переводу в скобках.",
      "questions": [
        {
          "id": 1,
          "context": "(Она вспомнила, что уже читала эту статью раньше.)",
          "options": [
            "She remembered to read this article.",
            "She remembered reading this article."
          ],
          "answer": "She remembered reading this article.",
          "explanation": "remember + герундий = вспоминать о прошлом. Действие (чтение) произошло раньше, чем воспоминание."
        },
        {
          "id": 2,
          "context": "(Он забыл отправить отредактированный вариант научному руководителю.)",
          "options": [
            "He forgot sending the revised draft to his supervisor.",
            "He forgot to send the revised draft to his supervisor."
          ],
          "answer": "He forgot to send the revised draft to his supervisor.",
          "explanation": "forget + инфинитив = забыть сделать (действие не было выполнено)."
        },
        {
          "id": 3,
          "context": "(Профессор перестал говорить, когда зазвенел звонок.)",
          "options": [
            "The professor stopped to speak when the bell rang.",
            "The professor stopped speaking when the bell rang."
          ],
          "answer": "The professor stopped speaking when the bell rang.",
          "explanation": "stop + герундий = прекратить действие. stop + инфинитив = остановиться чтобы начать другое действие."
        },
        {
          "id": 4,
          "context": "(Попробуй применить другой метод анализа — возможно, результаты улучшатся.)",
          "options": [
            "Try to apply a different analytical method.",
            "Try applying a different analytical method."
          ],
          "answer": "Try applying a different analytical method.",
          "explanation": "try + герундий = экспериментировать, попробовать вариант. try + инфинитив = прилагать усилия для достижения цели."
        },
        {
          "id": 5,
          "context": "(После анализа данных она перешла к формулировке выводов.)",
          "options": [
            "After analysing the data, she went on formulating the conclusions.",
            "After analysing the data, she went on to formulate the conclusions."
          ],
          "answer": "After analysing the data, she went on to formulate the conclusions.",
          "explanation": "go on + инфинитив = перейти к следующему действию. go on + герундий = продолжать то же самое действие."
        },
        {
          "id": 6,
          "context": "(Сожалеем, что вынуждены сообщить: ваша заявка не была одобрена.)",
          "options": [
            "We regret informing you that your application was not approved.",
            "We regret to inform you that your application was not approved."
          ],
          "answer": "We regret to inform you that your application was not approved.",
          "explanation": "regret + инфинитив = официальная формула 'сожалеем сообщить'. regret + герундий = сожалеть о прошлом поступке."
        },
        {
          "id": 7,
          "context": "(Изучение английского языка означает годы регулярной практики.)",
          "options": [
            "Learning English means to practise regularly for years.",
            "Learning English means practising regularly for years."
          ],
          "answer": "Learning English means practising regularly for years.",
          "explanation": "mean + герундий = означать, подразумевать. mean + инфинитив = намереваться что-то сделать."
        }
      ]
    }
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'B1 Intermediate'
    AND m.order_index = 1
    AND l.order_index = 1
  LIMIT 1
)
AND type = 'grammar';