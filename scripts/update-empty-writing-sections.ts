/**
 * Update writing sections that have empty content.
 * Finds sections where task/instructions_ru are empty and regenerates content
 * based on lesson title and level — no AI API needed.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/update-empty-writing-sections.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const f = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(f)) return
  fs.readFileSync(f, 'utf-8').split('\n').forEach(line => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return
    const i = t.indexOf('=')
    if (i < 0) return
    const key = t.slice(0, i).trim()
    const val = t.slice(i + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  })
}
loadEnv()

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
)

type WritingContent = {
  task:             string
  instructions_ru:  string
  min_words:        number
  tips_ru:          string[]
  examples?:        string[]
  structure?:       string
  useful_phrases?:  string[]
}

const LEVEL_CFG: Record<string, { min_words: number; sentence_count: string }> = {
  'A1': { min_words: 20,  sentence_count: '3–5' },
  'A2': { min_words: 35,  sentence_count: '4–6' },
  'B1': { min_words: 60,  sentence_count: '6–8' },
  'B2': { min_words: 100, sentence_count: '8–12' },
  'C1': { min_words: 150, sentence_count: '10–15' },
}

type TopicContent = (level: string) => WritingContent

const TOPIC_MAP: [RegExp, TopicContent][] = [
  [/verb\s*to\s*be|meet.*greet|greet.*meet/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences introducing yourself and a friend using the verb "To Be".`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений, используя глагол To Be (am/is/are). Представь себя и своего друга — имя, возраст, профессию, страну.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['My name is Aisha. I am 20 years old.', 'She is my friend. Her name is Dana. She is from Almaty.', 'We are students. We are not teachers.'],
    tips_ru: ['Используй am с I, is с he/she/it, are с we/you/they.', 'Можно использовать сокращения: I\'m, She\'s, We\'re.'],
  })],

  [/plural|singular|noun|one or many/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences describing what you see in your room. Use both singular and plural nouns.`,
    instructions_ru: `Опиши свою комнату или класс. Используй существительные в единственном и множественном числе. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['There is a desk and two chairs in my room.', 'I have three books and one laptop on the table.', 'There are many windows but only one door.'],
    tips_ru: ['Прибавляй -s или -es к большинству существительных во множественном числе.', 'Запомни неправильные: man→men, child→children, person→people.'],
  })],

  [/adjective|describing things|describe/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences describing your favourite place or person using at least 5 different adjectives.`,
    instructions_ru: `Опиши любимое место или человека, используя прилагательные. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений с разными прилагательными.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['My room is small but very comfortable.', 'She has long brown hair and bright blue eyes.', 'The park is beautiful and quiet in the morning.'],
    tips_ru: ['Ставь прилагательное перед существительным: a big house, not a house big.', 'В английском прилагательные не изменяются по числу и роду.'],
  })],

  [/article|a\/an|indefinite|definite/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences about things in your city. Use articles a, an, and the correctly.`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений о своём городе, правильно используя артикли a, an, the.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['I live in an apartment. The apartment is on the 5th floor.', 'There is a park near my house. The park has a big fountain.', 'I go to the shop every morning to buy an apple.'],
    tips_ru: ['a/an — первое упоминание, the — когда уже известно о чём речь.', 'Используй an перед гласными звуками: an apple, an hour.'],
  })],

  [/demonstrative|this|that|these|those/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences pointing to objects near and far using this, that, these, those.`,
    instructions_ru: `Опиши предметы рядом с тобой и вдалеке. Используй this, that, these, those. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['This is my phone. That is my friend\'s phone.', 'These books are heavy. Those bags are light.', 'This coffee is hot. Those seats over there are empty.'],
    tips_ru: ['This/these — близко, that/those — далеко.', 'This/that — единственное число, these/those — множественное.'],
  })],

  [/present simple|daily routine|habits|every day|timetable/i, (level) => ({
    task: `Write about your typical weekday. What do you do in the morning, afternoon, and evening?`,
    instructions_ru: `Опиши свой обычный будний день, используя Present Simple. Что ты делаешь утром, днём и вечером? ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['I wake up at 7 o\'clock and take a shower.', 'At noon I usually have lunch in the university canteen.', 'In the evening I study for two hours and then relax.'],
    tips_ru: ['В 3-м лице добавляй -s/-es: she works, he watches.', 'Используй наречия частотности: always, usually, often, sometimes, never.'],
    useful_phrases: ['I always...', 'I usually...', 'Every day I...', 'After that, I...', 'In the evening I...'],
  })],

  [/past simple|last week|yesterday|ago|historical/i, (level) => ({
    task: `Write about something interesting that happened to you last week or last month.`,
    instructions_ru: `Напиши о чём-то интересном, что произошло с тобой на прошлой неделе или в прошлом месяце. Используй Past Simple. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['Last weekend I went to a concert with my friends.', 'We arrived at the venue at 7 p.m. and found our seats.', 'The music was amazing and we danced for hours.'],
    tips_ru: ['Правильные глаголы: работал → worked, гулял → walked.', 'Неправильные: go→went, see→saw, eat→ate, have→had.'],
    useful_phrases: ['Last week/month...', 'After that,...', 'Then we...', 'It was...', 'I felt...'],
  })],

  [/present continuous|right now|currently|happening/i, (level) => ({
    task: `Describe what is happening around you right now using Present Continuous.`,
    instructions_ru: `Опиши, что происходит вокруг тебя прямо сейчас, используя Present Continuous (am/is/are + Ving). ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['I am sitting at my desk and writing in English.', 'Outside, the sun is shining and birds are singing.', 'My roommate is cooking in the kitchen.'],
    tips_ru: ['Структура: am/is/are + verb-ing.', 'Слова-маркеры: now, right now, at the moment, currently.'],
  })],

  [/future|going to|will|plans|intentions/i, (level) => ({
    task: `Write about your plans for next weekend or for the summer. Use "going to" or "will".`,
    instructions_ru: `Напиши о своих планах на следующие выходные или на лето. Используй going to (планы) и will (спонтанные решения). ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['Next summer I am going to travel to Turkey with my family.', 'We will stay there for ten days.', 'I\'m going to learn how to swim if I have time.'],
    tips_ru: ['going to — запланированные намерения, will — спонтанные решения или прогнозы.', 'Используй time expressions: next week, this summer, tomorrow, soon.'],
  })],

  [/present perfect|experience|ever.*never|just|already|yet/i, (level) => ({
    task: `Write about experiences you have had in your life. Have you ever travelled abroad, won a competition, or learned a new skill?`,
    instructions_ru: `Напиши о своём жизненном опыте, используя Present Perfect (have/has + past participle). Использу ever, never, already, yet. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: ['I have visited three countries so far.', 'I have never eaten sushi, but I would like to try it.', 'She has already finished her homework, so she is free now.'],
    tips_ru: ['have/has + past participle (3-я форма): gone, seen, eaten, done.', 'Маркеры: ever, never, just, already, yet, so far, recently.'],
  })],

  [/comparative|superlative|more.*than|the most/i, (level) => ({
    task: `Compare two cities, two people, or two things you know well. Use comparatives and superlatives.`,
    instructions_ru: `Сравни два города, два предмета или двух людей. Используй сравнительную и превосходную степень прилагательных. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['Almaty is bigger than Taraz, but Astana is the biggest city in Kazakhstan.', 'The new library is more comfortable than the old one.', 'This is the most interesting book I have ever read.'],
    tips_ru: ['Короткие: big→bigger→biggest, fast→faster→fastest.', 'Длинные: more interesting, more comfortable, the most beautiful.'],
  })],

  [/modal|can|could|should|must|might|have to|obligation|ability|permission/i, (level) => ({
    task: `Write about rules at your university or workplace. What can/can't you do? What must you do?`,
    instructions_ru: `Напиши о правилах в твоём университете или на работе. Что можно/нельзя делать? Что обязательно нужно делать? Используй модальные глаголы. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['Students must attend at least 80% of classes.', 'You can use your laptop during lectures, but you shouldn\'t be on social media.', 'We have to submit assignments before the deadline.'],
    tips_ru: ['can — способность/разрешение, must — обязанность, should — совет.', 'После модальных глаголов — инфинитив без to (кроме have to, ought to).'],
  })],

  [/conditional|if.*clause|hypothetical|would|second conditional|third conditional/i, (level) => ({
    task: `Write about a hypothetical situation: "If I had more free time, I would..." or "If I could live anywhere, I would..."`,
    instructions_ru: `Напиши о гипотетической ситуации, используя условное наклонение (if + past, would + infinitive). ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: ['If I had more money, I would travel around the world.', 'If I could speak Chinese, I would work in Shanghai.', 'She would be happier if she exercised more.'],
    tips_ru: ['2nd conditional: If + Past Simple, would + infinitive (гипотетическое настоящее/будущее).', 'Не используй would в части с if.'],
  })],

  [/passive|passive voice|be.*made|was.*built/i, (level) => ({
    task: `Write about famous inventions or places using the Passive Voice.`,
    instructions_ru: `Напиши о известных изобретениях, зданиях или блюдах, используя Passive Voice (be + past participle). ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 80,
    examples: ['The telephone was invented by Alexander Graham Bell in 1876.', 'English is spoken by over 1.5 billion people worldwide.', 'The Eiffel Tower was built between 1887 and 1889.'],
    tips_ru: ['Passive: be (в нужном времени) + past participle.', 'Используй by + агент, если важно кто это делал.'],
    useful_phrases: ['was invented by', 'is made from', 'was built in', 'is known as', 'is used for'],
  })],

  [/countable|uncountable|much|many|some|any|quantifier/i, (level) => ({
    task: `Write about food and drinks you have at home. Use countable and uncountable nouns with some, any, much, many.`,
    instructions_ru: `Опиши продукты у тебя дома или в магазине, используя исчисляемые и неисчисляемые существительные с some, any, much, many, a lot of. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: ['I have some apples and a lot of rice at home.', 'There isn\'t much milk in the fridge, but there are many vegetables.', 'Do you have any sugar? I need some for my tea.'],
    tips_ru: ['Much — с неисчисляемыми, many — с исчисляемыми существительными.', 'Some — утверждения, any — вопросы и отрицания.'],
  })],

  [/preposition|in.*on.*at|time.*place|direction/i, (level) => ({
    task: `Write about where things are in your home or how to get to your school. Use prepositions of place and time.`,
    instructions_ru: `Опиши, где находятся предметы в твоей комнате или как добраться до школы/работы. Используй предлоги места и времени. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['My desk is next to the window, and my books are on the shelf.', 'I go to school at 8 o\'clock in the morning.', 'The café is between the bank and the pharmacy, on Baker Street.'],
    tips_ru: ['In — внутри (in the room), on — на поверхности (on the table), at — у точки (at the door).', 'At — точное время (at 3pm), in — периоды (in the morning/July), on — дни (on Monday).'],
  })],

  [/pronoun|subject.*object|possessive|reflexive/i, (level) => ({
    task: `Write about yourself and people you know. Use different types of pronouns: subject, object, and possessive.`,
    instructions_ru: `Напиши о себе и своих знакомых, используя разные местоимения: именительный падеж (I, she), дополнение (me, her) и притяжательные (my, her). ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['I live with my parents. They help me with my homework.', 'She is my best friend. Her name is Madina. I call her every day.', 'This is his book, not mine. Give it to him, please.'],
    tips_ru: ['Subject pronouns выступают подлежащим: I, you, he, she, we, they.', 'Не путай their (их) / there (там) / they\'re (они есть).'],
  })],

  [/number|time|date|telling time|clock|calendar/i, (level) => ({
    task: `Write about your weekly schedule using time expressions and numbers.`,
    instructions_ru: `Опиши свой недельный распорядок, используя числа, дни недели и временные выражения. ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: ['I wake up at half past seven every morning from Monday to Friday.', 'On Tuesdays and Thursdays I have English class from 9 to 11 a.m.', 'I usually go to bed at eleven o\'clock at night.'],
    tips_ru: ['Half past 7 = 7:30, quarter to 8 = 7:45, quarter past 8 = 8:15.', 'Используй at для точного времени, on для дней, in для месяцев.'],
  })],

  [/family|relatives|parents|siblings|household/i, (level) => ({
    task: `Write about your family. Describe each member — their name, age, job, and personality.`,
    instructions_ru: `Напиши о своей семье. Опиши каждого члена семьи: имя, возраст, работу и характер. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['My family has four members: my parents, my brother, and me.', 'My mother is a teacher. She is kind and patient.', 'My father works as an engineer. He is strict but fair.'],
    tips_ru: ['Используй прилагательные для характера: kind, funny, serious, hardworking.', 'Применяй притяжательные местоимения: my, his, her, their.'],
  })],

  [/hobby|free time|leisure|weekend|interest|sport|music|film|book/i, (level) => ({
    task: `Write about your hobbies and how you spend your free time. Why do you enjoy these activities?`,
    instructions_ru: `Напиши о своих увлечениях и как ты проводишь свободное время. Почему тебе это нравится? ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['In my free time I enjoy reading books and watching films.', 'I play basketball twice a week with my friends at the sports centre.', 'I love listening to music because it helps me relax after a long day.'],
    tips_ru: ['enjoy / love / like / hate + verb-ing: I enjoy reading, She loves cooking.', 'Объясняй причины: because it helps me, because I find it interesting.'],
  })],

  [/food|cooking|recipe|meal|restaurant|cuisine|eat/i, (level) => ({
    task: `Write about your favourite food or describe a meal you recently enjoyed.`,
    instructions_ru: `Напиши о своей любимой еде или опиши блюдо, которое ты недавно ел. Что в нём особенного? ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['My favourite food is beshbarmak, a traditional Kazakh dish.', 'It is made with boiled meat, noodles, and a rich onion sauce.', 'We usually eat it at family gatherings on special occasions.'],
    tips_ru: ['Используй прилагательные вкуса: delicious, spicy, sweet, sour, salty.', 'It is made with / It contains / The main ingredients are...'],
  })],

  [/travel|trip|journey|holiday|vacation|visit|country|city|tour/i, (level) => ({
    task: `Write about a trip you have taken or a place you would like to visit. Describe what you did or what you hope to do there.`,
    instructions_ru: `Напиши о поездке, в которой ты побывал, или о месте, куда ты хочешь поехать. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['Last summer I visited Istanbul with my family.', 'We stayed in a hotel near the city centre for five days.', 'I would love to visit Japan one day because of its unique culture.'],
    tips_ru: ['Используй Past Simple для прошлых поездок: visited, stayed, saw.', 'Для мечты: I would love to / I have always wanted to...'],
    useful_phrases: ['I visited...', 'We stayed in...', 'The most impressive thing was...', 'I would recommend...'],
  })],

  [/health|body|illness|sick|doctor|medicine|exercise|fit/i, (level) => ({
    task: `Write about how you stay healthy. What do you do to keep fit and avoid illness?`,
    instructions_ru: `Напиши о том, как ты заботишься о своём здоровье. Что ты делаешь, чтобы быть в форме? ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['To stay healthy, I try to exercise at least three times a week.', 'I usually go for a run in the morning before breakfast.', 'I also try to eat fresh vegetables and avoid fast food.'],
    tips_ru: ['Используй to + infinitive для цели: I exercise to stay fit.', 'Советы: should, try to, it is important to, it helps to...'],
  })],

  [/work|job|career|profession|occupation|office/i, (level) => ({
    task: `Write about your job or dream job. Describe what you do and why you like or want it.`,
    instructions_ru: `Напиши о своей работе или о работе своей мечты. Опиши обязанности, рабочий день и почему тебе это нравится. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: ['I am a student, but I work part-time at a coffee shop on weekends.', 'My dream job is to become an engineer because I love solving problems.', 'I want to work for an international company and travel for business.'],
    tips_ru: ['Используй want to / would like to для мечты о работе.', 'Описывай конкретные задачи: write reports, manage teams, design websites.'],
  })],

  [/environment|nature|pollution|climate|recycle|planet/i, (level) => ({
    task: `Write about an environmental problem you care about and suggest solutions.`,
    instructions_ru: `Напиши об экологической проблеме, которая тебя беспокоит, и предложи решения. ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 80,
    examples: ['Climate change is one of the most serious problems of our time.', 'People should use public transport instead of driving cars to reduce pollution.', 'Recycling paper, plastic and glass can significantly reduce waste.'],
    tips_ru: ['Используй should/must для рекомендаций и предложений.', 'Структура: проблема → причины → решения.'],
    structure: 'Paragraph 1: Describe the problem. Paragraph 2: Explain the causes. Paragraph 3: Suggest solutions.',
  })],

  [/technology|internet|social media|digital|computer|phone|device/i, (level) => ({
    task: `Write about how technology affects your daily life — positive and negative effects.`,
    instructions_ru: `Напиши о влиянии технологий на твою жизнь — плюсы и минусы. ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 70,
    examples: ['Technology has changed the way we communicate completely.', 'I use my smartphone for studying, shopping, and keeping in touch with friends.', 'However, spending too much time on social media can affect mental health.'],
    tips_ru: ['Используй has/have + past participle для изменений: technology has changed.', 'Выражай своё мнение: I think, In my opinion, I believe that...'],
    useful_phrases: ['has changed', 'I use it for', 'on the one hand', 'on the other hand', 'I believe that'],
  })],

  [/education|school|university|study|exam|learn|class|student/i, (level) => ({
    task: `Write about your educational experience — your school, favourite subject, or a memorable lesson.`,
    instructions_ru: `Напиши о своём образовании: о школе или университете, любимом предмете или запоминающемся уроке. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: ['I study at Khamadi University in the Faculty of Computer Science.', 'My favourite subject is Mathematics because I enjoy solving complex problems.', 'Last year we had an amazing project on artificial intelligence.'],
    tips_ru: ['study + предмет: I study English / She studies medicine.', 'Используй Past Simple для прошлых событий и Present Simple для регулярного.'],
  })],

  [/review|module test|final test|assessment/i, (level) => ({
    task: `Write a short text summarising what you have learned in this module. Use the vocabulary and grammar from the lessons.`,
    instructions_ru: `Напиши небольшой текст, используя материал этого модуля. Включи изученную лексику и грамматические структуры. ${LEVEL_CFG[level]?.sentence_count ?? '5–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: ['In this module I learned how to introduce myself and describe my daily life.', 'I can now use different tenses and vocabulary to communicate more effectively.', 'One of the most useful things I practised was writing structured sentences.'],
    tips_ru: ['Покажи, что ты умеешь: используй разные времена и грамматику модуля.', 'Проверь орфографию и пунктуацию перед сдачей.'],
  })],
]

function defaultContent(lessonTitle: string, level: string): WritingContent {
  const topic = lessonTitle.split('—').pop()?.trim() ?? lessonTitle
  return {
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} sentences about the topic: "${topic}". Use the vocabulary and grammar from this lesson.`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений по теме урока «${topic}». Используй новую лексику и грамматику из этого урока.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: ['Write a sentence with a new word from the lesson.', 'Use the grammar structure you just practised.', 'Try to connect your sentences to make a short paragraph.'],
    tips_ru: ['Перечитай урок и выбери 3–5 новых слов для своего текста.', 'Не переводи дословно — думай по-английски.'],
  }
}

function generateWriting(lessonTitle: string, level: string): WritingContent {
  for (const [pattern, generator] of TOPIC_MAP) {
    if (pattern.test(lessonTitle)) return generator(level)
  }
  return defaultContent(lessonTitle, level)
}

function extractLevel(courseTitle: string, level: string | null): string {
  const src = `${level ?? ''} ${courseTitle}`
  const m = src.match(/\b(A1|A2|B1|B2|C1|C2)\b/)
  return m ? m[1] : 'A1'
}

function isEmpty(content: any): boolean {
  if (!content) return true
  const c = typeof content === 'string' ? JSON.parse(content) : content
  const task = (c.task ?? '').trim()
  const instructions = (c.instructions_ru ?? '').trim()
  return !task && !instructions
}

async function main() {
  console.log('🔍 Fetching writing sections with empty content...\n')

  // Get all GE lessons with their writing sections
  const { data: sections, error: sErr } = await supabase
    .from('english_lesson_sections')
    .select(`
      id,
      lesson_id,
      content,
      english_lessons!inner(
        id,
        title,
        english_courses!inner(title, level, category)
      )
    `)
    .eq('type', 'writing')

  if (sErr) { console.error('❌ Query failed:', sErr.message); process.exit(1) }

  const allSections = (sections ?? []) as any[]

  // Filter to GE only and empty content
  const emptySections = allSections.filter((s: any) => {
    const course = s.english_lessons?.english_courses
    if (course?.category !== 'General English') return false
    return isEmpty(s.content)
  })

  console.log(`📊 Total writing sections: ${allSections.length}`)
  console.log(`📊 GE sections with empty content: ${emptySections.length}\n`)

  if (emptySections.length === 0) {
    console.log('🎉 All GE writing sections already have content!')
    return
  }

  let updated = 0
  let errors = 0

  for (const section of emptySections) {
    const lesson = section.english_lessons as any
    const course = lesson?.english_courses as any
    const levelCode = extractLevel(course?.title ?? '', course?.level ?? '')
    const content = generateWriting(lesson?.title ?? '', levelCode)

    const { error } = await supabase
      .from('english_lesson_sections')
      .update({ content })
      .eq('id', section.id)

    if (error) {
      console.error(`  ❌ ${lesson?.title}: ${error.message}`)
      errors++
    } else {
      console.log(`  ✅ ${levelCode} | ${lesson?.title}`)
      updated++
    }
  }

  console.log(`\n📊 Done: ${updated} updated, ${errors} errors`)
}

main().catch(err => { console.error(err); process.exit(1) })
