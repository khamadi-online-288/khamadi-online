-- ============================================================
-- 031: Grammar content for A1 Beginner / Module 2 / Lesson 3
--      "Numbers & Colors — Cardinal Numbers and Color Vocabulary"
-- ============================================================

UPDATE english_lesson_sections
SET content = $json${
  "title": "Numbers & Colors — Cardinal Numbers and Color Vocabulary",
  "academic_intro": "Числительные и цвета являются базовыми категориями лексики необходимыми для описания количественных характеристик и визуальных свойств объектов. В академическом контексте количественные числительные используются при представлении статистических данных, описании выборки исследования и анализе результатов. Цветовая лексика применяется при описании графиков, диаграмм, экспериментальных условий и результатов наблюдений. Правильное использование числительных в академическом тексте подчиняется строгим стилистическим нормам которые отличаются от разговорного употребления.",
  "rules": [
    {
      "rule": "Правило 1 — Количественные числительные 1-100",
      "explanation": "Количественные числительные (cardinal numbers) обозначают количество предметов или абстрактное число. Основу системы составляют числа 1-19 и десятки 20-90. Все остальные числа образуются из этих элементов по строгим правилам.",
      "number_groups": [
        {
          "group": "1-10 (базовые)",
          "numbers": [
            {"n": 1, "w": "one"}, {"n": 2, "w": "two"}, {"n": 3, "w": "three"},
            {"n": 4, "w": "four"}, {"n": 5, "w": "five"}, {"n": 6, "w": "six"},
            {"n": 7, "w": "seven"}, {"n": 8, "w": "eight"}, {"n": 9, "w": "nine"},
            {"n": 10, "w": "ten"}
          ]
        },
        {
          "group": "11-20 (нестандартные)",
          "numbers": [
            {"n": 11, "w": "eleven"}, {"n": 12, "w": "twelve"}, {"n": 13, "w": "thirteen"},
            {"n": 14, "w": "fourteen"}, {"n": 15, "w": "fifteen"}, {"n": 16, "w": "sixteen"},
            {"n": 17, "w": "seventeen"}, {"n": 18, "w": "eighteen"}, {"n": 19, "w": "nineteen"},
            {"n": 20, "w": "twenty"}
          ],
          "note": "13-19: суффикс -teen. Ударение на последний слог: thirTEEN, fourTEEN"
        },
        {
          "group": "Десятки 20-100",
          "numbers": [
            {"n": 20, "w": "twenty"}, {"n": 30, "w": "thirty"}, {"n": 40, "w": "forty"},
            {"n": 50, "w": "fifty"}, {"n": 60, "w": "sixty"}, {"n": 70, "w": "seventy"},
            {"n": 80, "w": "eighty"}, {"n": 90, "w": "ninety"}, {"n": 100, "w": "one hundred"}
          ],
          "note": "ВАЖНО: forty — без u! (не fourty). Ударение на первый слог: THIRty, FORty"
        },
        {
          "group": "Составные числа 21-99",
          "rule": "Десятки + дефис + единицы",
          "examples": [
            {"n": 21, "w": "twenty-one"}, {"n": 35, "w": "thirty-five"},
            {"n": 47, "w": "forty-seven"}, {"n": 68, "w": "sixty-eight"},
            {"n": 99, "w": "ninety-nine"}
          ]
        }
      ],
      "large_numbers": [
        {"n": 100, "w": "one hundred / a hundred"},
        {"n": 101, "w": "one hundred and one"},
        {"n": 256, "w": "two hundred and fifty-six"},
        {"n": 1000, "w": "one thousand / a thousand"},
        {"n": 1500, "w": "one thousand five hundred / fifteen hundred"},
        {"n": 1000000, "w": "one million"},
        {"n": 1000000000, "w": "one billion"}
      ]
    },
    {
      "rule": "Правило 2 — Числительные в академическом письме",
      "explanation": "Академический стиль предписывает строгие правила записи чисел. Эти правила отличаются от разговорного употребления и необходимы для соответствия требованиям научных изданий.",
      "academic_rules": [
        {"rule": "Числа 1-10 — словами", "correct": "nine participants, three hypotheses", "wrong": "9 participants, 3 hypotheses"},
        {"rule": "Числа 11 и выше — цифрами", "correct": "45 students, 120 universities", "wrong": "forty-five students"},
        {"rule": "Никогда не начинать предложение с цифры", "correct": "Forty-five researchers attended.", "wrong": "45 researchers attended."},
        {"rule": "Проценты — цифрами", "correct": "78% of participants", "wrong": "seventy-eight percent of participants"},
        {"rule": "Десятичные дроби — цифрами", "correct": "a mean score of 3.7", "wrong": "a mean score of three point seven"}
      ]
    },
    {
      "rule": "Правило 3 — Цвета: базовая и расширенная лексика",
      "explanation": "Цветовая лексика в английском языке значительно богаче чем в русском. Помимо основных цветов существует система градаций и оттенков. В академическом письме цвета используются при описании графиков, диаграмм, экспериментальных стимулов и наблюдений.",
      "basic_colors": [
        {"color": "red", "russian": "красный", "shade": "crimson, scarlet, maroon"},
        {"color": "blue", "russian": "синий/голубой", "shade": "navy, sky blue, royal blue, turquoise"},
        {"color": "green", "russian": "зелёный", "shade": "lime, olive, emerald, forest green"},
        {"color": "yellow", "russian": "жёлтый", "shade": "gold, lemon, amber"},
        {"color": "orange", "russian": "оранжевый", "shade": "peach, coral, amber"},
        {"color": "purple", "russian": "фиолетовый", "shade": "violet, lavender, lilac, mauve"},
        {"color": "pink", "russian": "розовый", "shade": "rose, magenta, hot pink"},
        {"color": "brown", "russian": "коричневый", "shade": "beige, tan, chocolate, mahogany"},
        {"color": "black", "russian": "чёрный", "shade": "charcoal, ebony, jet black"},
        {"color": "white", "russian": "белый", "shade": "ivory, cream, off-white"},
        {"color": "grey / gray", "russian": "серый", "shade": "silver, charcoal, slate"},
        {"color": "dark", "russian": "тёмный", "usage": "dark blue, dark green, dark red"}
      ],
      "color_grammar": [
        {
          "use": "Как прилагательное перед существительным",
          "examples": ["a red line on the graph", "the blue bars in Figure 2", "a green indicator light"]
        },
        {
          "use": "Как предикатив после глагола-связки",
          "examples": ["The line is red.", "The bar turns blue.", "The result appears green."]
        },
        {
          "use": "Как существительное",
          "examples": ["Red indicates danger.", "Blue represents the control group.", "Green shows improvement."]
        }
      ],
      "academic_color_usage": [
        "The blue line in Figure 3 represents the experimental group.",
        "Red bars indicate statistically significant results.",
        "The grey shaded area shows the confidence interval.",
        "Data points in green represent the control condition."
      ]
    },
    {
      "rule": "Правило 4 — Числа и цвета в описании графиков и таблиц",
      "explanation": "Описание визуальных данных — графиков, таблиц, диаграмм — является важным навыком академического письма. Правильное сочетание числительных и цветовой лексики позволяет точно и ясно описывать результаты исследований.",
      "chart_language": [
        {
          "function": "Ссылка на визуальный элемент",
          "phrases": [
            "As shown in Figure 1...",
            "As illustrated in the graph above...",
            "Table 2 presents...",
            "The data in Figure 3 indicates..."
          ]
        },
        {
          "function": "Описание линий и столбцов",
          "phrases": [
            "The blue line represents Group A.",
            "The red bars show the experimental results.",
            "The green curve indicates the trend over time.",
            "The grey shaded region corresponds to..."
          ]
        },
        {
          "function": "Описание числовых значений",
          "phrases": [
            "The value increased from 45 to 78.",
            "Approximately 67% of participants...",
            "The mean score was 4.3 out of 5.",
            "Three out of five researchers agreed."
          ]
        }
      ]
    },
    {
      "rule": "Правило 5 — Сочетаемость числительных с существительными",
      "explanation": "Числительные в английском языке сочетаются с существительными по строгим правилам которые определяют форму существительного (единственное или множественное число) и выбор вспомогательных слов.",
      "collocations": [
        {"rule": "С числительными 2 и выше — множественное число", "examples": ["two books", "five universities", "100 participants"]},
        {"rule": "Дробные числительные — множественное число при значении > 1", "examples": ["1.5 hours", "2.3 kilometres", "0.5 points"]},
        {"rule": "Ноль — единственное или множественное в зависимости от контекста", "examples": ["zero degrees", "zero tolerance", "nought point five"]},
        {"rule": "A/one hundred, a/one thousand — равнозначны", "examples": ["a hundred students = one hundred students"]},
        {"rule": "Числительное + of + the + существительное", "examples": ["three of the participants", "45 of the 120 universities", "two of the five factors"]}
      ],
      "common_expressions": [
        {"expression": "dozens of", "meaning": "десятки", "example": "dozens of studies have examined..."},
        {"expression": "hundreds of", "meaning": "сотни", "example": "hundreds of participants were recruited"},
        {"expression": "thousands of", "meaning": "тысячи", "example": "thousands of students graduate annually"},
        {"expression": "a number of", "meaning": "ряд, несколько", "example": "a number of factors influence..."},
        {"expression": "the majority of", "meaning": "большинство", "example": "the majority of researchers agree"},
        {"expression": "approximately / roughly / around", "meaning": "приблизительно", "example": "approximately 150 participants"}
      ]
    },
    {
      "rule": "Правило 6 — Математические операции и выражения",
      "explanation": "В академических и научных текстах часто встречаются математические выражения. Знание того как читать и произносить математические операции — необходимый элемент академической компетенции.",
      "math_expressions": [
        {"written": "2 + 3 = 5", "spoken": "two plus three equals/is five"},
        {"written": "10 - 4 = 6", "spoken": "ten minus four equals six"},
        {"written": "6 x 7 = 42", "spoken": "six times/multiplied by seven equals forty-two"},
        {"written": "20 / 4 = 5", "spoken": "twenty divided by four equals five"},
        {"written": "x^2", "spoken": "x squared"},
        {"written": "x^3", "spoken": "x cubed"},
        {"written": "sqrt(9) = 3", "spoken": "the square root of nine is three"},
        {"written": "50%", "spoken": "fifty percent"},
        {"written": "3/4", "spoken": "three quarters / three fourths"},
        {"written": "approx", "spoken": "approximately equals"},
        {"written": ">", "spoken": "is greater than"},
        {"written": "<", "spoken": "is less than"}
      ]
    }
  ],
  "common_mistakes": [
    {"wrong": "There are fourty students.", "correct": "There are forty students.", "explanation": "forty — без u! fourty не существует."},
    {"wrong": "The color of the graph is the blue.", "correct": "The colour of the graph is blue.", "explanation": "Цвет как предикатив — без артикля the."},
    {"wrong": "35 researchers attended the conference.", "correct": "Thirty-five researchers attended the conference.", "explanation": "Нельзя начинать предложение с цифры в академическом тексте."},
    {"wrong": "She has twenty years old.", "correct": "She is twenty years old.", "explanation": "Возраст выражается через to be: She is 20 years old."},
    {"wrong": "The results show 78 percents improvement.", "correct": "The results show 78% improvement.", "explanation": "percent не имеет множественного числа — не percents."},
    {"wrong": "A red and a blue lines appear on the graph.", "correct": "A red and a blue line appear on the graph. / Red and blue lines appear.", "explanation": "Одно существительное с двумя прилагательными — без повторения."},
    {"wrong": "The score was nought point nought five.", "correct": "The score was 0.05.", "explanation": "В академическом тексте десятичные числа пишутся цифрами."}
  ],
  "academic_examples": [
    "The study recruited 45 participants from three universities located in two different countries.",
    "As shown in Figure 2, the blue line represents the experimental group while the red bars indicate the control condition.",
    "Approximately 78% of respondents reported significant improvement after twelve weeks of intervention.",
    "The mean score increased from 3.2 to 4.7 on a five-point scale.",
    "Dozens of studies have examined the relationship between colour perception and cognitive performance.",
    "The grey shaded area in Figure 3 represents the 95% confidence interval."
  ],
  "dialogues": [
    {"title": "Представление результатов", "lines": [
      {"speaker": "Student", "text": "In Figure one, the blue line shows the results for Group A and the red bars represent Group B."},
      {"speaker": "Professor", "text": "Good. And what do the numbers show?"},
      {"speaker": "Student", "text": "The blue group improved from forty-five to seventy-eight percent. That is a thirty-three percent increase."},
      {"speaker": "Professor", "text": "Excellent. How many participants were in each group?"},
      {"speaker": "Student", "text": "There were fifty participants in the blue group and forty-seven in the red group."}
    ]},
    {"title": "Описание диаграммы", "lines": [
      {"speaker": "A", "text": "Can you explain the graph on page twelve?"},
      {"speaker": "B", "text": "Of course. The horizontal axis shows the months from one to twelve."},
      {"speaker": "A", "text": "And what do the different colours mean?"},
      {"speaker": "B", "text": "Green represents growth, red shows decline, and grey indicates no significant change."},
      {"speaker": "A", "text": "I see. And what does the peak at month seven indicate?"},
      {"speaker": "B", "text": "That is when the intervention began. The score jumped from thirty-two to sixty-eight points."}
    ]}
  ],
  "exercises": [
    {"type": "multiple_choice", "question": "Как правильно написать число 40?", "options": ["fourty", "forty", "fourtie", "fortie"], "answer": "forty"},
    {"type": "multiple_choice", "question": "Академический стиль. Выберите правильный вариант:", "options": ["9 students participated.", "Nine students participated.", "Nine (9) students participated.", "The 9 students participated."], "answer": "Nine students participated."},
    {"type": "multiple_choice", "question": "Как правильно начать предложение с числа 35?", "options": ["35 researchers attended.", "Thirty five researchers attended.", "Thirty-five researchers attended.", "The 35 researchers attended."], "answer": "Thirty-five researchers attended."},
    {"type": "multiple_choice", "question": "The ___ line in Figure 2 represents the control group.", "options": ["the blue", "blue", "a blue", "blues"], "answer": "blue"},
    {"type": "true_false", "question": "The results show 78 percents improvement over twelve weeks.", "answer": "wrong", "explanation": "percent без s: 78% improvement. Проценты пишутся цифрами."},
    {"type": "true_false", "question": "The study recruited approximately 150 participants from three universities.", "answer": "correct", "explanation": "150 (больше 10) — цифрами; three (меньше 10) — словами. Верно!"},
    {"type": "multiple_choice", "question": "Как читается 6 x 7 = 42?", "options": ["six by seven is forty-two", "six times seven equals forty-two", "six and seven makes forty-two", "six of seven equals forty-two"], "answer": "six times seven equals forty-two"},
    {"type": "error_correction", "question": "45 students completed the survey. The results show improvement from fourty to seventy percents.", "answer": "Forty-five students completed the survey. The results show improvement from 40% to 70%."},
    {"type": "fill_blank", "question": "As shown in Figure ___ (3), the ___ (blue) line represents Group A. The mean score increased from ___ (3.2) to ___ (4.7).", "answer": "3 / blue / 3.2 / 4.7"},
    {"type": "multiple_choice", "question": "Dozens of / Hundreds of / A number of — выберите наиболее академический вариант для: ___ studies have examined this topic.", "options": ["Lots of", "A number of", "Many many", "Plenty of"], "answer": "A number of"},
    {"type": "error_correction", "question": "The blue and the red lines shows the results. Green color is used for the third group.", "answer": "The blue and red lines show the results. Green is used for the third group."},
    {"type": "fill_blank", "question": "The study involved ___ (45) participants. ___ (Three) of the ___ (five) hypotheses were confirmed. ___ (Approximately) 67% showed improvement.", "answer": "45 / Three / five / Approximately"},
    {"type": "multiple_choice", "question": "She has ___ years old.", "options": ["twenty", "is twenty", "—", "got twenty"], "answer": "twenty"},
    {"type": "true_false", "question": "The grey shaded area in Figure 3 represents the 95% confidence interval.", "answer": "correct", "explanation": "grey — прилагательное перед noun; 95% — проценты цифрами. Верно!"},
    {"type": "error_correction", "question": "Hundred of researchers attended the conference. The score was nought point five percent higher.", "answer": "Hundreds of researchers attended the conference. The score was 0.5% higher."},
    {"type": "multiple_choice", "question": "Как правильно прочитать sqrt(16) = 4?", "options": ["square of sixteen is four", "the square root of sixteen is four", "sixteen root equals four", "root sixteen is four"], "answer": "the square root of sixteen is four"},
    {"type": "fill_blank", "question": "In the graph, ___ (red) indicates danger, ___ (green) shows improvement, and ___ (grey) represents no change. The value increased from ___ (45) to ___ (78).", "answer": "red / green / grey / 45 / 78"},
    {"type": "true_false", "question": "A number of factors influence academic performance, and dozens of studies have confirmed this.", "answer": "correct", "explanation": "a number of и dozens of — правильные академические выражения количества. Верно!"},
    {"type": "error_correction", "question": "Fourty five (45) students participated. The results show improvement of seventy eight percents. Three of the five hypothesis were confirmed.", "answer": "Forty-five students participated. The results show improvement of 78%. Three of the five hypotheses were confirmed."},
    {"type": "academic_writing", "question": "Напишите академический абзац из 5-6 предложений описывающий результаты исследования с использованием графика. Включите: 3 числительных (правильно оформленных), 2 цвета для описания графика, 1 процент, 1 академическое выражение количества.", "tip": "Например: As shown in Figure 1, the blue line represents... Three of the five groups... Approximately 78% of participants... A number of factors..."}
  ]
}$json$::jsonb
WHERE lesson_id = (
  SELECT l.id FROM english_lessons l
  JOIN english_modules m ON m.id = l.module_id
  JOIN english_courses c ON c.id = m.course_id
  WHERE c.title = 'A1 Beginner'
  AND m.order_index = 2
  AND l.order_index = 3
)
AND type = 'grammar';
