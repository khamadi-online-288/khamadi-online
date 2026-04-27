-- ============================================================
-- 032: Grammar content for A1 Beginner / Module 2 / Lesson 4
--      "Prepositions of Place"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Prepositions of Place — Предлоги места",
  "academic_intro": "Предлоги места (prepositions of place) — это служебные слова которые указывают на расположение предмета или человека в пространстве относительно другого объекта. В английском языке предлоги представляют особую сложность для русскоязычных студентов по нескольким причинам: во-первых, один английский предлог может соответствовать нескольким русским предлогам и наоборот; во-вторых, предлоги не подчиняются строгой логике и требуют запоминания в конкретных контекстах; в-третьих, неправильный выбор предлога кардинально меняет смысл высказывания. В академическом письме точное использование предлогов места необходимо при описании географического расположения, структуры текста, результатов исследований и экспериментальных условий.",
  "rules": [
    {
      "rule": "Правило 1 — Основные предлоги места: IN, ON, AT",
      "explanation": "Три наиболее употребительных предлога места в английском языке — in, on и at — охватывают большинство контекстов описания местоположения. Их выбор определяется типом пространства: объём/ограниченное пространство (in), поверхность (on) или конкретная точка/место (at). Это фундаментальное различие необходимо усвоить прежде всего.",
      "prepositions": [
        {
          "preposition": "IN",
          "core_meaning": "Внутри ограниченного трёхмерного пространства — в объёме",
          "uses": [
            {"context": "Закрытые помещения и здания", "examples": ["in the classroom", "in the laboratory", "in the library", "in the office", "in the auditorium"]},
            {"context": "Города, страны, регионы", "examples": ["in Almaty", "in Kazakhstan", "in Central Asia", "in Europe", "in the world"]},
            {"context": "Книги, журналы, газеты", "examples": ["in the textbook", "in the journal", "in the newspaper", "in this chapter", "in the appendix"]},
            {"context": "Жидкости и вещества", "examples": ["in water", "in solution", "in the mixture"]},
            {"context": "Очередь, группа, организация", "examples": ["in the queue", "in the group", "in the department", "in the faculty"]},
            {"context": "Временные периоды (месяцы, годы, сезоны)", "examples": ["in January", "in 2023", "in summer", "in the morning"]}
          ],
          "academic_examples": [
            "The data presented in this table suggests a significant correlation.",
            "The university is located in the capital city of Kazakhstan.",
            "In the following section, the methodology is described in detail.",
            "The researchers worked in a controlled laboratory environment."
          ]
        },
        {
          "preposition": "ON",
          "core_meaning": "На поверхности — контакт с горизонтальной или вертикальной плоскостью",
          "uses": [
            {"context": "Горизонтальные поверхности", "examples": ["on the desk", "on the table", "on the floor", "on the shelf", "on the ground"]},
            {"context": "Вертикальные поверхности", "examples": ["on the wall", "on the board", "on the screen", "on the door"]},
            {"context": "Этажи зданий", "examples": ["on the first floor", "on the third floor", "on the ground floor"]},
            {"context": "Транспортные средства (крупные)", "examples": ["on the bus", "on the train", "on the plane", "on the ship"]},
            {"context": "Улицы и дороги", "examples": ["on the street", "on the road", "on the highway", "on Al-Farabi Avenue"]},
            {"context": "Острова", "examples": ["on an island", "on the coast"]},
            {"context": "Цифровые платформы", "examples": ["on the website", "on the internet", "on page 45", "on the map"]}
          ],
          "academic_examples": [
            "The results are presented on the graph above.",
            "The university is situated on the left bank of the river.",
            "The information on page 23 contradicts the earlier findings.",
            "The data is displayed on the interactive dashboard."
          ]
        },
        {
          "preposition": "AT",
          "core_meaning": "В конкретной точке или месте — точное местоположение",
          "uses": [
            {"context": "Конкретные адреса и точки", "examples": ["at 15 University Street", "at the corner", "at the entrance", "at the exit"]},
            {"context": "Учебные и рабочие места (деятельность)", "examples": ["at university", "at school", "at work", "at the office"]},
            {"context": "Мероприятия и события", "examples": ["at the conference", "at the seminar", "at the lecture", "at the meeting"]},
            {"context": "Места назначения (общественные)", "examples": ["at the airport", "at the station", "at the hospital", "at the bank"]},
            {"context": "Точки на шкале или уровне", "examples": ["at a high level", "at the top", "at the bottom", "at 100 degrees"]},
            {"context": "Электронная почта", "examples": ["at gmail.com", "contact us at..."]}
          ],
          "academic_examples": [
            "The conference was held at the National University of Kazakhstan.",
            "The study was conducted at three research institutions.",
            "The temperature was maintained at 37 degrees Celsius.",
            "The results peaked at the maximum level observed in the experiment."
          ]
        }
      ],
      "comparison_table": [
        {"situation": "Я в библиотеке (внутри здания)", "correct": "I am in the library", "wrong": "I am at the library (=я у библиотеки)"},
        {"situation": "Встреча у библиотеки (снаружи)", "correct": "Meet me at the library", "wrong": "Meet me in the library (=внутри)"},
        {"situation": "Книга на столе (поверхность)", "correct": "The book is on the desk", "wrong": "The book is in the desk"},
        {"situation": "Ручка в столе (выдвижном ящике)", "correct": "The pen is in the desk", "wrong": "The pen is on the desk"}
      ]
    },
    {
      "rule": "Правило 2 — Предлоги относительного положения",
      "explanation": "Помимо основных предлогов in, on, at существует ряд предлогов указывающих на положение одного предмета относительно другого. Эти предлоги особенно важны при описании структуры текста, расположения данных в таблицах и графиках, а также при описании физического пространства в научных работах.",
      "prepositions": [
        {"prep": "above", "meaning": "выше, над (без контакта)", "example": "The title is above the table. / above average"},
        {"prep": "below", "meaning": "ниже, под (без контакта)", "example": "The footnote is below the text. / below the poverty line"},
        {"prep": "over", "meaning": "над, поверх (может быть с движением)", "example": "The bridge over the river. / over 100 participants"},
        {"prep": "under", "meaning": "под, ниже (непосредственно)", "example": "The data under analysis. / under 18 years old"},
        {"prep": "beside / next to", "meaning": "рядом, сбоку", "example": "The laboratory is beside the library."},
        {"prep": "between", "meaning": "между (двумя объектами)", "example": "The relationship between variables. / between 2010 and 2020"},
        {"prep": "among", "meaning": "среди (трёх и более)", "example": "Among the participants, 45% were female."},
        {"prep": "in front of", "meaning": "перед, впереди", "example": "The speaker stood in front of the audience."},
        {"prep": "behind", "meaning": "позади, за", "example": "The theory behind this approach is..."},
        {"prep": "opposite", "meaning": "напротив", "example": "The results are opposite to the initial hypothesis."},
        {"prep": "near / close to", "meaning": "вблизи, рядом", "example": "The university is near the city centre."},
        {"prep": "inside", "meaning": "внутри (с акцентом)", "example": "Inside the research framework, three stages were identified."},
        {"prep": "outside", "meaning": "снаружи, за пределами", "example": "This falls outside the scope of the present study."},
        {"prep": "along", "meaning": "вдоль", "example": "Along the continuum from basic to advanced levels."},
        {"prep": "across", "meaning": "через, по всему", "example": "Across all five universities, the results were consistent."},
        {"prep": "throughout", "meaning": "на всём протяжении, повсюду", "example": "Throughout the study, participants were monitored."}
      ]
    },
    {
      "rule": "Правило 3 — Предлоги места с транспортом",
      "explanation": "Выбор предлога при описании использования транспортных средств подчиняется особым правилам которые не следуют общей логике in/on. Эти правила необходимо запомнить так как они являются исключениями из общего принципа.",
      "transport_rules": [
        {
          "preposition": "IN",
          "vehicles": "Маленькие личные транспортные средства — машина, такси, лифт",
          "examples": [
            {"correct": "in a car / in the car", "note": "личный автомобиль"},
            {"correct": "in a taxi / in a cab", "note": "такси"},
            {"correct": "in a lift / in an elevator", "note": "лифт"},
            {"correct": "in a helicopter", "note": "вертолёт"}
          ],
          "logic": "В маленьком транспорте человек сидит внутри закрытого пространства"
        },
        {
          "preposition": "ON",
          "vehicles": "Крупный общественный транспорт и открытые средства передвижения",
          "examples": [
            {"correct": "on a bus / on the bus", "note": "автобус"},
            {"correct": "on a train / on the train", "note": "поезд"},
            {"correct": "on a plane / on an aircraft", "note": "самолёт"},
            {"correct": "on a ship / on a boat", "note": "корабль, лодка"},
            {"correct": "on a bicycle / on a bike", "note": "велосипед"},
            {"correct": "on a motorcycle", "note": "мотоцикл"},
            {"correct": "on a horse", "note": "лошадь"}
          ],
          "logic": "В крупном транспорте можно ходить, он воспринимается как платформа"
        },
        {
          "preposition": "BY",
          "use": "Способ передвижения (без артикля!)",
          "examples": [
            "by car", "by bus", "by train", "by plane", "by bike", "on foot"
          ],
          "note": "by foot — нестандартно, правильно: on foot"
        }
      ]
    },
    {
      "rule": "Правило 4 — IN, ON, AT с институциональными местами",
      "explanation": "С названиями учреждений, организаций и мест деятельности выбор предлога зависит от того рассматривается ли место как физическое пространство (in) или как институт/деятельность (at). Это различие особенно важно в академическом контексте.",
      "institutional_places": [
        {
          "place": "university / school / college",
          "at_university": {"meaning": "учусь там как студент — институциональная роль", "example": "I study at university. She teaches at the university."},
          "in_university": {"meaning": "физически внутри здания", "example": "There is a cafe in the university building."},
          "note": "at university (без артикля) = как студент; at the university = в конкретном университете"
        },
        {
          "place": "hospital",
          "at_hospital": {"meaning": "работаю там или посещаю", "example": "She works at the hospital. I was at the hospital yesterday."},
          "in_hospital": {"meaning": "госпитализирован как пациент", "example": "He is in hospital. (British) / He is in the hospital. (American)"}
        },
        {
          "place": "prison / jail",
          "at_prison": {"meaning": "посещаю, работаю", "example": "She works at the prison."},
          "in_prison": {"meaning": "отбываю наказание", "example": "He is in prison."}
        },
        {
          "place": "church / mosque / temple",
          "at_church": {"meaning": "посещаю службу", "example": "She is at church every Sunday."},
          "in_church": {"meaning": "физически внутри здания", "example": "The wedding took place in the church."}
        }
      ]
    },
    {
      "rule": "Правило 5 — Предлоги места в академическом тексте",
      "explanation": "В академическом письме предлоги места выполняют не только пространственную но и структурную и логическую функции. Знание академических клише с предлогами места является признаком высокого уровня владения языком.",
      "academic_uses": [
        {
          "category": "Ссылки на части текста",
          "examples": [
            "as discussed in the previous section",
            "in the following chapter",
            "in Table 3 above",
            "on page 45",
            "in Appendix B",
            "at the end of the chapter",
            "in the introduction",
            "throughout the paper"
          ]
        },
        {
          "category": "Описание места проведения исследования",
          "examples": [
            "The study was conducted at three universities in Kazakhstan.",
            "Data was collected in rural and urban settings.",
            "Participants were recruited from departments across the university.",
            "The experiment took place in a controlled laboratory environment."
          ]
        },
        {
          "category": "Описание положения на графиках и таблицах",
          "examples": [
            "As shown in Figure 2...",
            "The data presented in Table 1...",
            "The peak observed on the graph...",
            "At the bottom of the scale...",
            "Above the threshold level...",
            "Below the mean score..."
          ]
        },
        {
          "category": "Географический и институциональный контекст",
          "examples": [
            "Universities in Central Asia have undergone significant reforms.",
            "Researchers at the National Academy of Sciences...",
            "The study was funded by institutions across five countries.",
            "Among participants from different regions..."
          ]
        }
      ]
    },
    {
      "rule": "Правило 6 — Устойчивые выражения с предлогами места",
      "explanation": "В английском языке существует большое количество устойчивых выражений и идиом с предлогами места которые необходимо запомнить как единое целое. Многие из них часто встречаются в академических и профессиональных текстах.",
      "fixed_expressions": [
        {"expression": "in the middle of", "meaning": "в середине, посреди", "example": "in the middle of the experiment"},
        {"expression": "at the top of", "meaning": "в верхней части, наверху", "example": "at the top of the agenda"},
        {"expression": "at the bottom of", "meaning": "в нижней части", "example": "at the bottom of the page"},
        {"expression": "in the centre of", "meaning": "в центре", "example": "in the centre of the debate"},
        {"expression": "on the left / on the right", "meaning": "слева / справа", "example": "on the left side of the graph"},
        {"expression": "in the background", "meaning": "на заднем плане, в основе", "example": "in the background of this study"},
        {"expression": "at the forefront of", "meaning": "в авангарде", "example": "at the forefront of scientific research"},
        {"expression": "in the field of", "meaning": "в области", "example": "in the field of linguistics"},
        {"expression": "across the board", "meaning": "повсеместно", "example": "improvements across the board"},
        {"expression": "on the surface", "meaning": "на поверхности, внешне", "example": "on the surface, the results appear similar"},
        {"expression": "in depth", "meaning": "в глубину, подробно", "example": "analysed in depth"},
        {"expression": "at length", "meaning": "подробно, детально", "example": "discussed at length in chapter three"},
        {"expression": "within the scope of", "meaning": "в рамках", "example": "within the scope of this study"},
        {"expression": "beyond the scope of", "meaning": "за пределами", "example": "beyond the scope of the present research"},
        {"expression": "in line with", "meaning": "в соответствии с", "example": "in line with previous findings"},
        {"expression": "at odds with", "meaning": "в противоречии с", "example": "at odds with the established theory"}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She is in the university studying.", "correct": "She is at university studying. / She is in the university building.", "explanation": "at university = учится там; in the university = физически внутри здания."},
    {"wrong": "The results are showed in the table 3.", "correct": "The results are shown in Table 3.", "explanation": "Названия таблиц и рисунков пишутся с заглавной буквы и без артикля."},
    {"wrong": "I travel by the bus every day.", "correct": "I travel by bus every day.", "explanation": "by + транспорт — без артикля."},
    {"wrong": "The book is at the shelf.", "correct": "The book is on the shelf.", "explanation": "Полка — горизонтальная поверхность: on the shelf."},
    {"wrong": "He is in hospital visiting his friend.", "correct": "He is at the hospital visiting his friend.", "explanation": "in hospital (British) = пациент; at the hospital = посетитель или сотрудник."},
    {"wrong": "The university is on Almaty.", "correct": "The university is in Almaty.", "explanation": "Города и страны — предлог in."},
    {"wrong": "Between all participants, the results varied.", "correct": "Among all participants, the results varied.", "explanation": "between — между двумя; among — среди трёх и более."},
    {"wrong": "As discussed on the previous section...", "correct": "As discussed in the previous section...", "explanation": "Разделы и главы текста — предлог in."}
  ],
  "academic_examples": [
    "The study was conducted at three universities located in different regions of Kazakhstan.",
    "As shown in Figure 3, there is a significant difference between the two groups.",
    "The findings are discussed in detail in the following section.",
    "Among the participants recruited across five departments, 60% were female.",
    "The university, situated in the heart of Almaty, is at the forefront of scientific research in Central Asia.",
    "The data presented in Table 2 on page 47 reveals a consistent pattern throughout the study.",
    "This question falls beyond the scope of the present investigation but merits attention in future research."
  ],
  "dialogues": [
    {"title": "Описание кампуса иностранному студенту", "lines": [
      {"speaker": "Foreign student", "text": "Excuse me, where is the main library?"},
      {"speaker": "Local student", "text": "It is in the central building, on the second floor. You can see it on your campus map."},
      {"speaker": "Foreign student", "text": "And where is the Department of Linguistics?"},
      {"speaker": "Local student", "text": "It is in the humanities building, next to the cafeteria. The office is at the end of the corridor on the left."},
      {"speaker": "Foreign student", "text": "Thank you. Is Professor Abenov in his office now?"},
      {"speaker": "Local student", "text": "I think he is at a conference today. His office is on the third floor, opposite the seminar room."}
    ]},
    {"title": "Обсуждение научной статьи", "lines": [
      {"speaker": "Student A", "text": "Have you found the data we need? It should be in the appendix."},
      {"speaker": "Student B", "text": "Yes, it is in Appendix C, on page 89. The graph at the bottom of the page shows the trend clearly."},
      {"speaker": "Student A", "text": "And where was the study conducted? In a laboratory?"},
      {"speaker": "Student B", "text": "The experiment took place in a controlled environment at the National Research Institute."},
      {"speaker": "Student A", "text": "Among all the studies in this field, this one seems to be at the forefront of current research."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "The results are presented ___ Table 3.", "options": ["on", "at", "in", "by"], "answer": "in"},
    {"type": "multiple_choice", "question": "The university is located ___ the centre ___ Almaty.", "options": ["in / of", "at / in", "on / of", "in / in"], "answer": "in / of"},
    {"type": "multiple_choice", "question": "She works ___ the hospital as a researcher.", "options": ["in", "on", "at", "by"], "answer": "at"},
    {"type": "multiple_choice", "question": "The book is ___ the shelf ___ the third floor.", "options": ["on / in", "in / on", "at / in", "on / on"], "answer": "on / in"},
    {"type": "true_false", "question": "The students travelled to the conference on a car.", "answer": "wrong", "explanation": "Машина — маленький транспорт: in a car. Правильно: The students travelled in a car."},
    {"type": "true_false", "question": "Among the 150 participants, there were researchers from five countries.", "answer": "correct", "explanation": "Among — среди трёх и более. Верно!"},
    {"type": "multiple_choice", "question": "As discussed ___ the previous section, there are three main factors.", "options": ["on", "at", "in", "by"], "answer": "in"},
    {"type": "error_correction", "question": "She studies on the university. The laboratory is in the second floor. She travels by the train.", "answer": "She studies at university. The laboratory is on the second floor. She travels by train."},
    {"type": "multiple_choice", "question": "The temperature was maintained ___ 37 degrees Celsius.", "options": ["in", "on", "at", "by"], "answer": "at"},
    {"type": "fill_blank", "question": "The study was conducted ___ three universities ___ Kazakhstan. Participants were recruited ___ departments ___ the campus.", "answer": "at / in / from / across"},
    {"type": "multiple_choice", "question": "Between vs Among. The difference ___ the two groups was significant.", "options": ["among", "between", "within", "across"], "answer": "between"},
    {"type": "error_correction", "question": "The data showed in the figure 2 is on page 34 of the appendix. Among the two approaches, the second is more effective.", "answer": "The data shown in Figure 2 is on page 34 of the appendix. Between the two approaches, the second is more effective."},
    {"type": "fill_blank", "question": "The university is ___ (at/in) the forefront of research ___ (in/at) the field ___ (of/in) artificial intelligence.", "answer": "at / in / of"},
    {"type": "multiple_choice", "question": "Академический стиль. This topic falls ___ the scope of the present study.", "options": ["inside", "within", "beyond", "b и c оба возможны"], "answer": "b и c оба возможны"},
    {"type": "true_false", "question": "In line with previous findings, the results suggest a positive correlation.", "answer": "correct", "explanation": "in line with — устойчивое академическое выражение: в соответствии с. Верно!"},
    {"type": "fill_blank", "question": "He is ___ hospital recovering. (пациент) vs She is ___ the hospital visiting him. (посетитель)", "answer": "in / at"},
    {"type": "multiple_choice", "question": "The graph ___ the bottom of page 23 shows the overall trend.", "options": ["in", "on", "at", "above"], "answer": "at"},
    {"type": "error_correction", "question": "Between all participants across the five universities in the study, results were consistent throughout all the research.", "answer": "Among all participants across the five universities in the study, results were consistent throughout the research."},
    {"type": "fill_blank", "question": "Используйте академические выражения с предлогами: The issue is discussed ___ (at length/in depth) ___ Chapter 3. The findings are ___ (in line with) previous research. This question is ___ (beyond the scope of) this paper.", "answer": "at length / in / in line with / beyond the scope of"},
    {"type": "academic_writing", "question": "Напишите академический абзац из 6-7 предложений описывающий исследование и место его проведения. Используйте минимум: in (3 раза), on (2 раза), at (2 раза), 2 предлога относительного положения, 1 устойчивое академическое выражение с предлогом.", "tip": "Например: The study was conducted at... / located in... / The data presented in Table... / on page... / among participants... / at the forefront of... / in line with..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 2
  AND l.order_index = 4
)
AND type = 'grammar';
