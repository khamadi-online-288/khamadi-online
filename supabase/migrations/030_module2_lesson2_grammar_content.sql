-- ============================================================
-- 030: Grammar content for A1 Beginner / Module 2 / Lesson 2
--      "Countries & Nationalities — Nouns & Proper Nouns"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Countries & Nationalities — Nouns & Proper Nouns",
  "academic_intro": "Имена собственные (proper nouns) — это особая категория существительных обозначающих уникальные объекты: конкретных людей, географические названия, названия организаций, языки и национальности. В отличие от нарицательных существительных (common nouns) имена собственные всегда пишутся с заглавной буквы в английском языке. Знание правил написания и использования имён собственных — обязательный элемент академической грамотности. Названия стран, национальностей и языков подчиняются особым грамматическим правилам которые существенно отличаются от русского языка.",
  "rules": [
    {
      "rule": "Правило 1 — Имена собственные и заглавные буквы",
      "explanation": "В английском языке правила использования заглавных букв значительно строже чем в русском. Имена собственные всегда пишутся с заглавной буквы независимо от их позиции в предложении. Это правило распространяется на широкий круг слов которые в русском языке пишутся со строчной буквы.",
      "categories": [
        {
          "category": "Имена и фамилии людей",
          "examples": ["Adilet Khamadi", "Albert Einstein", "Marie Curie", "Nursultan Nazarbayev"],
          "note": "Включая псевдонимы, прозвища, титулы перед именем: Professor Smith, Dr Johnson"
        },
        {
          "category": "Географические названия",
          "examples": ["Kazakhstan", "Almaty", "the Caspian Sea", "the Silk Road", "Central Asia", "the Himalayas"],
          "note": "Страны, города, моря, горы, реки, регионы"
        },
        {
          "category": "Национальности и этнические группы",
          "examples": ["Kazakh", "Russian", "British", "American", "European", "Asian"],
          "note": "В русском пишутся со строчной: казахский, русский — в английском ВСЕГДА с заглавной"
        },
        {
          "category": "Языки",
          "examples": ["Kazakh", "English", "Russian", "Arabic", "Chinese", "French"],
          "note": "Названия языков всегда с заглавной буквы"
        },
        {
          "category": "Религии и их последователи",
          "examples": ["Islam", "Christianity", "Buddhism", "Muslim", "Christian", "Buddhist"]
        },
        {
          "category": "Названия организаций и учреждений",
          "examples": ["Nazarbayev University", "the United Nations", "Harvard University", "the World Health Organization"],
          "note": "Аббревиатуры: UN, WHO, UNESCO, NATO"
        },
        {
          "category": "Дни недели и месяцы",
          "examples": ["Monday", "Friday", "January", "September"],
          "note": "В русском пишутся со строчной — в английском ВСЕГДА с заглавной"
        },
        {
          "category": "Праздники и исторические события",
          "examples": ["Nauryz", "Independence Day", "the Second World War", "the Renaissance"]
        }
      ]
    },
    {
      "rule": "Правило 2 — Страны мира: артикли с названиями стран",
      "explanation": "Большинство названий стран используются без артикля, однако существует важная группа исключений. Знание этих исключений необходимо для грамотной академической речи и письма.",
      "without_article": {
        "rule": "Большинство стран — без артикля",
        "examples": [
          {"country": "Kazakhstan", "example": "Kazakhstan is located in Central Asia."},
          {"country": "France", "example": "France has a rich cultural heritage."},
          {"country": "Japan", "example": "Japan is known for its technological innovation."},
          {"country": "Brazil", "example": "Brazil has the largest rainforest in the world."},
          {"country": "Russia", "example": "Russia is the largest country by area."}
        ]
      },
      "with_the": {
        "rule": "С артиклем THE используются:",
        "groups": [
          {
            "group": "Страны во множественном числе",
            "examples": ["the United States (of America)", "the United Arab Emirates", "the Netherlands", "the Philippines", "the Maldives"]
          },
          {
            "group": "Страны содержащие слова Republic, Kingdom, Federation, Union",
            "examples": ["the United Kingdom", "the Czech Republic", "the Russian Federation", "the Soviet Union (historical)"]
          },
          {
            "group": "Географические регионы",
            "examples": ["the Middle East", "the Far East", "the Balkans", "the Arctic", "the Antarctic"]
          }
        ]
      },
      "country_table": [
        {"country": "Kazakhstan", "capital": "Astana", "nationality": "Kazakh", "language": "Kazakh, Russian"},
        {"country": "the United Kingdom", "capital": "London", "nationality": "British", "language": "English"},
        {"country": "the United States", "capital": "Washington D.C.", "nationality": "American", "language": "English"},
        {"country": "Germany", "capital": "Berlin", "nationality": "German", "language": "German"},
        {"country": "France", "capital": "Paris", "nationality": "French", "language": "French"},
        {"country": "China", "capital": "Beijing", "nationality": "Chinese", "language": "Chinese (Mandarin)"},
        {"country": "Japan", "capital": "Tokyo", "nationality": "Japanese", "language": "Japanese"},
        {"country": "Russia", "capital": "Moscow", "nationality": "Russian", "language": "Russian"},
        {"country": "Turkey", "capital": "Ankara", "nationality": "Turkish", "language": "Turkish"},
        {"country": "South Korea", "capital": "Seoul", "nationality": "Korean", "language": "Korean"}
      ]
    },
    {
      "rule": "Правило 3 — Образование прилагательных и существительных обозначающих национальность",
      "explanation": "Названия национальностей в английском языке могут выступать как прилагательные (describing a noun) и как существительные (referring to people). Образование форм для разных стран подчиняется нескольким моделям.",
      "patterns": [
        {
          "pattern": "Модель 1: одна форма для прилагательного и существительного",
          "suffix": "-i, -ese, -ish, -an, -ian",
          "examples": [
            {"country": "Kazakhstan", "adjective": "Kazakh", "singular": "a Kazakh", "plural": "Kazakhs"},
            {"country": "Japan", "adjective": "Japanese", "singular": "a Japanese person", "plural": "Japanese people / the Japanese"},
            {"country": "China", "adjective": "Chinese", "singular": "a Chinese person", "plural": "Chinese people / the Chinese"},
            {"country": "Spain", "adjective": "Spanish", "singular": "a Spaniard", "plural": "Spaniards / the Spanish"},
            {"country": "Russia", "adjective": "Russian", "singular": "a Russian", "plural": "Russians"},
            {"country": "Italy", "adjective": "Italian", "singular": "an Italian", "plural": "Italians"},
            {"country": "Brazil", "adjective": "Brazilian", "singular": "a Brazilian", "plural": "Brazilians"}
          ]
        },
        {
          "pattern": "Модель 2: особые формы",
          "examples": [
            {"country": "the United Kingdom", "adjective": "British", "person": "a Briton / a British person", "plural": "the British"},
            {"country": "France", "adjective": "French", "person": "a Frenchman/Frenchwoman", "plural": "the French"},
            {"country": "the Netherlands", "adjective": "Dutch", "person": "a Dutchman/Dutchwoman", "plural": "the Dutch"},
            {"country": "Finland", "adjective": "Finnish", "person": "a Finn", "plural": "the Finns"},
            {"country": "Sweden", "adjective": "Swedish", "person": "a Swede", "plural": "the Swedes"},
            {"country": "Poland", "adjective": "Polish", "person": "a Pole", "plural": "the Poles"},
            {"country": "Turkey", "adjective": "Turkish", "person": "a Turk", "plural": "the Turks"}
          ]
        }
      ],
      "grammar_usage": [
        {
          "use": "Как прилагательное — перед существительным",
          "examples": [
            "a Kazakh university — казахский университет",
            "the French methodology — французская методология",
            "Japanese technology — японская технология",
            "British academic traditions — британские академические традиции"
          ]
        },
        {
          "use": "Как существительное — обозначение нации с the",
          "examples": [
            "The Kazakhs are known for their hospitality.",
            "The British value academic excellence.",
            "The Japanese have developed unique educational approaches.",
            "The French prioritise cultural education."
          ]
        }
      ]
    },
    {
      "rule": "Правило 4 — Языки: использование без артикля",
      "explanation": "Названия языков в английском языке используются без артикля когда они обозначают язык как систему. Однако существуют важные нюансы использования артикля в зависимости от контекста.",
      "examples_without_article": [
        "She speaks English and Kazakh fluently.",
        "Russian is widely spoken in Central Asia.",
        "The study was conducted in English.",
        "Mandarin Chinese is the most widely spoken language.",
        "French is an official language of the United Nations."
      ],
      "with_article": [
        {
          "context": "С прилагательным describing a specific form",
          "examples": [
            "the English of academic writing (академический английский)",
            "the French spoken in Quebec (квебекский французский)",
            "the Kazakh of the 19th century (казахский XIX века)"
          ]
        }
      ],
      "language_skills": [
        {"expression": "speak + language", "example": "She speaks three languages."},
        {"expression": "study + language", "example": "He studies English at university."},
        {"expression": "be fluent in + language", "example": "She is fluent in Kazakh, Russian and English."},
        {"expression": "have a good command of + language", "example": "He has a good command of academic English."},
        {"expression": "conduct research in + language", "example": "The study was conducted in English."}
      ]
    },
    {
      "rule": "Правило 5 — Нарицательные существительные: общие правила",
      "explanation": "Нарицательные существительные (common nouns) обозначают классы предметов явлений и понятий. В отличие от имён собственных они пишутся со строчной буквы. Понимание разницы между нарицательными и собственными существительными критически важно для академической грамотности.",
      "common_vs_proper": [
        {"common": "country", "proper": "Kazakhstan, France, Japan"},
        {"common": "city", "proper": "Almaty, London, Tokyo"},
        {"common": "university", "proper": "Nazarbayev University, Oxford University"},
        {"common": "language", "proper": "English, Kazakh, Russian"},
        {"common": "professor", "proper": "Professor Smith, Professor Abenov"},
        {"common": "river", "proper": "the Nile, the Amazon, the Ural"},
        {"common": "mountain", "proper": "Mount Everest, the Alps, Khan Tengri"}
      ],
      "tricky_cases": [
        {"word": "internet", "note": "the Internet (с заглавной как имя собственное) или the internet (тенденция к строчной)"},
        {"word": "government", "note": "строчная когда нарицательное; заглавная в официальных названиях: the Government of Kazakhstan"},
        {"word": "north/south/east/west", "note": "строчная как направление; заглавная как регион: the North, the Middle East"},
        {"word": "spring/summer/autumn/winter", "note": "времена года пишутся со СТРОЧНОЙ буквы в отличие от месяцев и дней"}
      ]
    },
    {
      "rule": "Правило 6 — Национальность и идентичность в академическом письме",
      "explanation": "В современном академическом английском существуют определённые конвенции и предпочтения в использовании терминов национальности и этнической принадлежности. Грамотное использование этих терминов демонстрирует культурную чуткость и академическую зрелость.",
      "academic_conventions": [
        {
          "convention": "Person-first language при необходимости",
          "examples": [
            "researchers from Kazakhstan (не: Kazakh researchers — если национальность не важна)",
            "participants of Chinese origin",
            "students whose first language is Russian"
          ]
        },
        {
          "convention": "Точность в использовании терминов",
          "examples": [
            "Central Asian universities (не: Asian universities — слишком широко)",
            "Kazakhstani researchers (гражданство) vs Kazakh researchers (этническая принадлежность)",
            "English-speaking countries (не: British countries)"
          ]
        },
        {
          "convention": "Академические выражения с национальностью",
          "examples": [
            "cross-cultural research between Kazakh and British universities",
            "a comparative study of educational systems in five countries",
            "the influence of Russian academic traditions on Central Asian universities",
            "multilingual education in Kazakhstani schools"
          ]
        }
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "She speaks english and kazakh.", "correct": "She speaks English and Kazakh.", "explanation": "Названия языков всегда с заглавной буквы."},
    {"wrong": "I am from the Kazakhstan.", "correct": "I am from Kazakhstan.", "explanation": "Kazakhstan — без артикля the (не входит в группу исключений)."},
    {"wrong": "She is kazakh student.", "correct": "She is a Kazakh student.", "explanation": "Национальность как прилагательное — с заглавной буквы; нужен артикль a."},
    {"wrong": "The peoples of central asia speak many languages.", "correct": "The peoples of Central Asia speak many languages.", "explanation": "Central Asia — имя собственное, заглавные буквы."},
    {"wrong": "In summer and in monday i study.", "correct": "In summer and on Monday I study.", "explanation": "summer — строчная; Monday — заглавная; on Monday (не in)."},
    {"wrong": "She is fluent in the English.", "correct": "She is fluent in English.", "explanation": "Языки без артикля the."},
    {"wrong": "He works at united nations.", "correct": "He works at the United Nations.", "explanation": "the United Nations — с артиклем the и заглавными буквами."},
    {"wrong": "Kazakhstani and british researchers collaborated.", "correct": "Kazakhstani and British researchers collaborated.", "explanation": "Прилагательные национальности всегда с заглавной буквы."}
  ],
  "academic_examples": [
    "Researchers from Kazakhstan, Russia and China collaborated on this interdisciplinary study.",
    "The study examined the educational systems of five Central Asian countries.",
    "English has become the primary language of academic publication worldwide.",
    "Nazarbayev University in Astana follows British and American academic traditions.",
    "The findings are consistent with those reported by Kazakh and Russian researchers.",
    "A comparative analysis of Kazakhstani and British higher education systems revealed significant differences."
  ],
  "dialogues": [
    {"title": "Международная конференция", "lines": [
      {"speaker": "Researcher A", "text": "Good morning. I am Dr Abenov from Nazarbayev University in Kazakhstan."},
      {"speaker": "Researcher B", "text": "Pleased to meet you. I am Professor Chen from Beijing University in China."},
      {"speaker": "Researcher A", "text": "Is this your first time at a conference in Central Asia?"},
      {"speaker": "Researcher B", "text": "Yes, it is. I am very impressed by the academic traditions here. Do most Kazakhstani researchers publish in English?"},
      {"speaker": "Researcher A", "text": "Increasingly so. Many universities now require publications in international English-language journals."}
    ]},
    {"title": "Знакомство студентов", "lines": [
      {"speaker": "A", "text": "Hi! Where are you from?"},
      {"speaker": "B", "text": "I am from Kazakhstan — from Almaty specifically. And you?"},
      {"speaker": "A", "text": "I am from the United Kingdom. I am doing research on Central Asian educational systems."},
      {"speaker": "B", "text": "Interesting! Do you speak any Central Asian languages?"},
      {"speaker": "A", "text": "I speak a little Russian but I am learning Kazakh. It is a fascinating language."},
      {"speaker": "B", "text": "That is great! How many languages do British researchers typically speak?"}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Выберите правильный вариант: She speaks ___ and ___.", "options": ["english / kazakh", "English / Kazakh", "English / kazakh", "english / Kazakh"], "answer": "English / Kazakh"},
    {"type": "multiple_choice", "question": "Нужен ли артикль? ___ Kazakhstan is located in Central Asia.", "options": ["The", "A", "An", "—"], "answer": "—"},
    {"type": "multiple_choice", "question": "Нужен ли артикль? She works at ___ United Nations.", "options": ["a", "an", "the", "—"], "answer": "the"},
    {"type": "multiple_choice", "question": "Множественное число от a Kazakh:", "options": ["Kazakhes", "Kazakhs", "the Kazakh", "b и c оба верны"], "answer": "b и c оба верны"},
    {"type": "true_false", "question": "In summer, I study english every monday and friday.", "answer": "wrong", "explanation": "Правильно: In summer, I study English every Monday and Friday. (языки и дни — с заглавной, сезоны — строчная)"},
    {"type": "true_false", "question": "Kazakhstani and British universities have different academic traditions.", "answer": "correct", "explanation": "Прилагательные национальности с заглавной буквы. Верно!"},
    {"type": "error_correction", "question": "she is a kazakh student from almaty who speaks kazakh, russian and english fluently.", "answer": "She is a Kazakh student from Almaty who speaks Kazakh, Russian and English fluently."},
    {"type": "multiple_choice", "question": "Прилагательное от the United Kingdom:", "options": ["UKish", "United Kingdomian", "British", "Anglish"], "answer": "British"},
    {"type": "fill_blank", "question": "___ (Kazakhstan) researchers collaborated with ___ (France) and ___ (Japan) colleagues on the study published in ___ (English).", "answer": "Kazakh/Kazakhstani / French / Japanese / English"},
    {"type": "multiple_choice", "question": "Seasons and capital letters. Which is correct?", "options": ["in Summer", "in summer", "in Summer time", "In Summer"], "answer": "in summer"},
    {"type": "error_correction", "question": "The university is located in the almaty, the kazakhstan. It follows british and american academic traditions.", "answer": "The university is located in Almaty, Kazakhstan. It follows British and American academic traditions."},
    {"type": "fill_blank", "question": "She is fluent ___ (in) three languages: ___ (Kazakh), ___ (Russian) and ___ (English). She conducts research ___ (in) English.", "answer": "in / Kazakh / Russian / English / in"},
    {"type": "multiple_choice", "question": "Common noun vs Proper noun. Which word needs a capital letter?", "options": ["the city is large", "the university is old", "She studies at nazarbayev university", "the river flows south"], "answer": "She studies at nazarbayev university"},
    {"type": "true_false", "question": "The peoples of Central Asia have rich cultural traditions.", "answer": "correct", "explanation": "Central Asia — имя собственное, заглавные. peoples — нарицательное, строчная. Верно!"},
    {"type": "error_correction", "question": "cross-cultural research between kazakh and british universities in central asia shows interesting differences in academic traditions.", "answer": "Cross-cultural research between Kazakh and British universities in Central Asia shows interesting differences in academic traditions."},
    {"type": "multiple_choice", "question": "Выберите академически точный вариант:", "options": ["Asian students performed better", "Central Asian students from Kazakhstan performed better", "Kazakh students performed better", "b и c оба точны в зависимости от контекста"], "answer": "b и c оба точны в зависимости от контекста"},
    {"type": "fill_blank", "question": "___ (the United States) and ___ (the United Kingdom) have influenced academic traditions in ___ (Kazakhstan). Many ___ (Kazakh) universities now publish research in ___ (English).", "answer": "The United States / the United Kingdom / Kazakhstan / Kazakh / English"},
    {"type": "true_false", "question": "She is fluent in the English and the Kazakh.", "answer": "wrong", "explanation": "Языки без артикля the: She is fluent in English and Kazakh."},
    {"type": "error_correction", "question": "professor abenov from nazarbayev university in astana, kazakhstan presented research on central asian educational systems at the united nations in new york.", "answer": "Professor Abenov from Nazarbayev University in Astana, Kazakhstan presented research on Central Asian educational systems at the United Nations in New York."},
    {"type": "academic_writing", "question": "Напишите академический абзац из 5-6 предложений о международном исследовательском сотрудничестве. Используйте: минимум 4 названия стран (с правильными артиклями или без), 3 прилагательных национальности, 2 названия языков, 1 название университета или организации.", "tip": "Например: Researchers from Kazakhstan and the United Kingdom collaborated... The study was conducted in English... Kazakh and British academic traditions... Nazarbayev University..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 2
  AND l.order_index = 2
)
AND type = 'grammar';
