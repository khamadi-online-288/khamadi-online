/**
 * Seed writing sections for all General English lessons that don't have one yet.
 * Content is generated based on lesson title + course level — no AI API needed.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-writing-sections.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── load .env.local ────────────────────────────────────────────────────────────
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

// ── Types ──────────────────────────────────────────────────────────────────────

type WritingContent = {
  task:             string
  instructions_ru:  string
  min_words:        number
  tips_ru:          string[]
  examples?:        string[]
  structure?:       string
  useful_phrases?:  string[]
}

type LessonRow = {
  id:         string
  title:      string
  level_code: string   // A1 | A2 | B1 | B2 | C1
  course_title: string
}

// ── Level config ───────────────────────────────────────────────────────────────

const LEVEL_CFG: Record<string, { min_words: number; sentence_count: string }> = {
  'A1': { min_words: 20,  sentence_count: '3–5' },
  'A2': { min_words: 35,  sentence_count: '4–6' },
  'B1': { min_words: 60,  sentence_count: '6–8' },
  'B2': { min_words: 100, sentence_count: '8–12' },
  'C1': { min_words: 150, sentence_count: '10–15' },
}

// ── Topic patterns → content ───────────────────────────────────────────────────
// Each entry: keywords that appear in the lesson title → writing content generator

type TopicContent = (level: string) => WritingContent

const TOPIC_MAP: [RegExp, TopicContent][] = [

  // ── VERB TO BE ─────────────────────────────────────────────────────────────
  [/verb\s*to\s*be|meet.*greet|greet.*meet/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences introducing yourself and a friend using the verb "To Be".`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений, используя глагол To Be (am/is/are). Представь себя и своего друга — имя, возраст, профессию, страну.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'My name is Aisha. I am 20 years old.',
      'She is my friend. Her name is Dana. She is from Almaty.',
      'We are students. We are not teachers.',
    ],
    tips_ru: [
      'Используй am с I, is с he/she/it, are с we/you/they.',
      'Можно использовать сокращения: I\'m, She\'s, We\'re.',
    ],
  })],

  // ── PLURALS / NOUNS ─────────────────────────────────────────────────────────
  [/plural|singular|noun|one or many/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences describing what you see in your room. Use both singular and plural nouns.`,
    instructions_ru: `Опиши свою комнату или класс. Используй существительные в единственном и множественном числе. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'There is a desk and two chairs in my room.',
      'I have three books and one laptop on the table.',
      'There are many windows but only one door.',
    ],
    tips_ru: [
      'Прибавляй -s или -es к большинству существительных во множественном числе.',
      'Запомни неправильные: man→men, child→children, person→people.',
    ],
  })],

  // ── ADJECTIVES ──────────────────────────────────────────────────────────────
  [/adjective|describing things|describe/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences describing your favourite place or person using at least 5 different adjectives.`,
    instructions_ru: `Опиши любимое место или человека, используя прилагательные. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений с разными прилагательными.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'My room is small but very comfortable.',
      'She has long brown hair and bright blue eyes.',
      'The park is beautiful and quiet in the morning.',
    ],
    tips_ru: [
      'Ставь прилагательное перед существительным: a big house, not a house big.',
      'В английском прилагательные не изменяются по числу и роду.',
    ],
  })],

  // ── ARTICLES ────────────────────────────────────────────────────────────────
  [/article|a\/an|indefinite|definite/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences about things in your city. Use articles a, an, and the correctly.`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений о своём городе, правильно используя артикли a, an, the.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'I live in an apartment. The apartment is on the 5th floor.',
      'There is a park near my house. The park has a big fountain.',
      'I go to the shop every morning to buy an apple.',
    ],
    tips_ru: [
      'a/an — первое упоминание, the — когда уже известно о чём речь.',
      'Используй an перед гласными звуками: an apple, an hour.',
    ],
  })],

  // ── DEMONSTRATIVES / THIS THAT ──────────────────────────────────────────────
  [/demonstrative|this|that|these|those/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} sentences pointing to objects near and far using this, that, these, those.`,
    instructions_ru: `Опиши предметы рядом с тобой и вдалеке. Используй this, that, these, those. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'This is my phone. That is my friend\'s phone.',
      'These books are heavy. Those bags are light.',
      'This coffee is hot. Those seats over there are empty.',
    ],
    tips_ru: [
      'This/these — близко, that/those — далеко.',
      'This/that — единственное число, these/those — множественное.',
    ],
  })],

  // ── PRESENT SIMPLE ──────────────────────────────────────────────────────────
  [/present simple|daily routine|every day|habits|routine/i, (level) => ({
    task: `Write about your daily routine using Present Simple. Describe ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} activities you do every day.`,
    instructions_ru: `Опиши свой распорядок дня, используя Present Simple. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений о том, что ты делаешь каждый день.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'I wake up at 7 o\'clock every morning.',
      'She drinks coffee and reads the news before work.',
      'We have English class on Mondays and Wednesdays.',
    ],
    tips_ru: [
      'Добавляй -s/-es к глаголу для he/she/it: he works, she goes.',
      'Используй always, usually, often, sometimes для частоты действий.',
    ],
  })],

  // ── PRESENT CONTINUOUS ──────────────────────────────────────────────────────
  [/present continuous|present progressive|happening now|right now|ing form/i, (level) => ({
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} sentences describing what people are doing right now. Use Present Continuous.`,
    instructions_ru: `Опиши, что люди делают прямо сейчас — дома, в классе, на улице. Используй Present Continuous (am/is/are + ing). Напиши ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'I am studying English at the moment.',
      'My sister is listening to music and my brother is playing games.',
      'It is raining outside and the children are staying at home.',
    ],
    tips_ru: [
      'am/is/are + глагол-ing: I am eating, She is sleeping.',
      'Для слов на -e убирай e перед -ing: write → writing.',
    ],
  })],

  // ── PAST SIMPLE ─────────────────────────────────────────────────────────────
  [/past simple|yesterday|last week|simple past|irregular verb/i, (level) => ({
    task: `Write about what you did yesterday or last weekend using Past Simple.`,
    instructions_ru: `Расскажи о том, что ты делал вчера или на прошлых выходных. Используй Past Simple (правильные и неправильные глаголы). Напиши ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: [
      'Yesterday I woke up late and had breakfast at 10 o\'clock.',
      'I went to the library and studied for two hours.',
      'In the evening, we watched a film and ordered pizza.',
    ],
    tips_ru: [
      'Правильные глаголы: add -ed (walk→walked, study→studied).',
      'Неправильные: go→went, have→had, see→saw — учи наизусть.',
    ],
  })],

  // ── PRESENT PERFECT ─────────────────────────────────────────────────────────
  [/present perfect|experience|ever.*never|just.*already|have.*been/i, (level) => ({
    task: `Write about your life experiences using Present Perfect. Have you ever travelled abroad? Learned something new recently?`,
    instructions_ru: `Расскажи о своём опыте, используя Present Perfect (have/has + past participle). Используй ever, never, just, already, yet. Напиши ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 60,
    examples: [
      'I have never been to London, but I have visited Dubai.',
      'She has just finished her homework and is now watching TV.',
      'Have you ever tried sushi? I have eaten it twice.',
    ],
    tips_ru: [
      'have/has + past participle: I have eaten, she has gone.',
      'Ever/never — для опыта, just/already/yet — для недавних действий.',
    ],
  })],

  // ── FUTURE / GOING TO / WILL ─────────────────────────────────────────────────
  [/future|going to|will|plans|prediction/i, (level) => ({
    task: `Write about your plans for next week and your predictions for the future. Use "going to" and "will".`,
    instructions_ru: `Напиши о своих планах на следующую неделю и предсказаниях на будущее. Используй going to (планы) и will (спонтанные решения и предсказания). ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: [
      'I am going to visit my grandparents this weekend.',
      'Tomorrow I will wake up early and go jogging.',
      'I think technology will change our lives completely in 10 years.',
    ],
    tips_ru: [
      'Going to — для запланированных действий: I\'m going to study.',
      'Will — для спонтанных решений и предсказаний: I think it will rain.',
    ],
  })],

  // ── MODAL VERBS / CAN ───────────────────────────────────────────────────────
  [/can|modal|ability|permission|must|should|have to/i, (level) => ({
    task: `Write about your abilities and things you should or must do. Use modal verbs: can, should, must, have to.`,
    instructions_ru: `Напиши о своих умениях и обязанностях, используя модальные глаголы: can (умею), should (следует), must/have to (обязан). Напиши ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'I can speak three languages but I cannot play the guitar.',
      'You should exercise every day to stay healthy.',
      'Students must do their homework and must not use phones in class.',
    ],
    tips_ru: [
      'После модального глагола всегда идёт инфинитив без to: I can swim.',
      'Should — совет, must — обязательство, can — способность.',
    ],
  })],

  // ── COMPARATIVES / SUPERLATIVES ─────────────────────────────────────────────
  [/comparative|superlative|comparison|bigger|better|more|most/i, (level) => ({
    task: `Write a comparison of two cities, people, or objects you know. Use comparative and superlative adjectives.`,
    instructions_ru: `Сравни два города, двух людей или два предмета, используя сравнительные (-er, more) и превосходные (-est, most) прилагательные. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: [
      'Almaty is bigger than Shymkent but smaller than Moscow.',
      'English is easier than Chinese but harder than Spanish for me.',
      'The Eiffel Tower is one of the most famous structures in the world.',
    ],
    tips_ru: [
      'Короткие прилагательные: tall→taller→tallest.',
      'Длинные: more/less beautiful, the most/least interesting.',
      'Исключения: good→better→best, bad→worse→worst.',
    ],
  })],

  // ── CONDITIONALS ────────────────────────────────────────────────────────────
  [/conditional|if.*clause|zero.*condition|first.*condition|second.*condition/i, (level) => ({
    task: `Write sentences using conditional structures about real situations and hypothetical ones.`,
    instructions_ru: `Напиши предложения с условными конструкциями. Используй: Zero (If + Present, Present) и First (If + Present, will + V) для реальных ситуаций. ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 60,
    examples: [
      'If you heat water to 100°C, it boils. (Zero Conditional)',
      'If I study hard, I will pass the exam. (First Conditional)',
      'If I were rich, I would travel around the world. (Second Conditional)',
    ],
    tips_ru: [
      'Zero Conditional — всегда верные факты.',
      'First Conditional — реальные возможности в будущем.',
      'Второй Conditional — нереальные/гипотетические ситуации.',
    ],
  })],

  // ── PASSIVE VOICE ───────────────────────────────────────────────────────────
  [/passive|passive voice|be.*made|was.*built/i, (level) => ({
    task: `Write about famous inventions or places using the Passive Voice.`,
    instructions_ru: `Напиши о известных изобретениях, зданиях или блюдах, используя Passive Voice (be + past participle). ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 80,
    examples: [
      'The telephone was invented by Alexander Graham Bell in 1876.',
      'English is spoken by over 1.5 billion people worldwide.',
      'The Eiffel Tower was built between 1887 and 1889.',
    ],
    tips_ru: [
      'Passive: be (в нужном времени) + past participle.',
      'Используй by + агент, если важно кто это делал.',
    ],
    useful_phrases: ['was invented by', 'is made from', 'was built in', 'is known as', 'is used for'],
  })],

  // ── COUNTABLE / UNCOUNTABLE ─────────────────────────────────────────────────
  [/countable|uncountable|much|many|some|any|quantifier/i, (level) => ({
    task: `Write about food and drinks you have at home. Use countable and uncountable nouns with some, any, much, many.`,
    instructions_ru: `Опиши продукты у тебя дома или в магазине, используя исчисляемые и неисчисляемые существительные с some, any, much, many, a lot of. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: [
      'I have some apples and a lot of rice at home.',
      'There isn\'t much milk in the fridge, but there are many vegetables.',
      'Do you have any sugar? I need some for my tea.',
    ],
    tips_ru: [
      'Much — с неисчисляемыми, many — с исчисляемыми существительными.',
      'Some — утверждения, any — вопросы и отрицания.',
    ],
  })],

  // ── PREPOSITIONS ────────────────────────────────────────────────────────────
  [/preposition|in.*on.*at|time.*place|direction/i, (level) => ({
    task: `Write about where things are in your home or how to get to your school. Use prepositions of place and time.`,
    instructions_ru: `Опиши, где находятся предметы в твоей комнате или как добраться до школы/работы. Используй предлоги места и времени. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'My desk is next to the window, and my books are on the shelf.',
      'I go to school at 8 o\'clock in the morning.',
      'The café is between the bank and the pharmacy, on Baker Street.',
    ],
    tips_ru: [
      'In — внутри (in the room), on — на поверхности (on the table), at — у точки (at the door).',
      'At — точное время (at 3pm), in — периоды (in the morning/July), on — дни (on Monday).',
    ],
  })],

  // ── PRONOUNS ────────────────────────────────────────────────────────────────
  [/pronoun|subject.*object|possessive|reflexive/i, (level) => ({
    task: `Write about yourself and people you know. Use different types of pronouns: subject, object, and possessive.`,
    instructions_ru: `Напиши о себе и своих знакомых, используя разные местоимения: именительный падеж (I, she), дополнение (me, her) и притяжательные (my, her). ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'I live with my parents. They help me with my homework.',
      'She is my best friend. Her name is Madina. I call her every day.',
      'This is his book, not mine. Give it to him, please.',
    ],
    tips_ru: [
      'Subject pronouns выступают подлежащим: I, you, he, she, we, they.',
      'Не путай their (их) / there (там) / they\'re (они есть).',
    ],
  })],

  // ── NUMBERS / TIME / DATES ──────────────────────────────────────────────────
  [/number|time|date|telling time|clock|calendar/i, (level) => ({
    task: `Write about your weekly schedule using time expressions and numbers.`,
    instructions_ru: `Опиши свой недельный распорядок, используя числа, дни недели и временные выражения. ${LEVEL_CFG[level]?.sentence_count ?? '3–5'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 20,
    examples: [
      'I wake up at half past seven every morning from Monday to Friday.',
      'On Tuesdays and Thursdays I have English class from 9 to 11 a.m.',
      'I usually go to bed at eleven o\'clock at night.',
    ],
    tips_ru: [
      'Half past 7 = 7:30, quarter to 8 = 7:45, quarter past 8 = 8:15.',
      'Используй at для точного времени, on для дней, in для месяцев.',
    ],
  })],

  // ── FAMILY / PEOPLE ─────────────────────────────────────────────────────────
  [/family|relative|mother|father|sibling|parent/i, (level) => ({
    task: `Write about your family. Describe family members, their appearance, jobs, and personalities.`,
    instructions_ru: `Напиши о своей семье. Опиши членов семьи — их внешность, профессию и характер. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'I have a small family: my parents, my younger sister and me.',
      'My mother is a doctor. She is kind and very hard-working.',
      'My father likes football and plays it every Sunday with his friends.',
    ],
    tips_ru: [
      'Используй прилагательные для описания характера: kind, funny, hardworking.',
      'Расскажи о хобби и профессиях членов семьи.',
    ],
  })],

  // ── FOOD / EATING ───────────────────────────────────────────────────────────
  [/food|eating|meal|cook|restaurant|breakfast|lunch|dinner/i, (level) => ({
    task: `Write about your favourite meal or a restaurant you like. Describe what you eat and when.`,
    instructions_ru: `Напиши о своём любимом блюде или ресторане. Расскажи, что ты ешь в течение дня. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'My favourite food is beshbarmak. We cook it on special occasions.',
      'For breakfast I usually have toast with eggs and a cup of tea.',
      'On weekends we go to a café near our house and order pizza.',
    ],
    tips_ru: [
      'Используй like + -ing: I like eating pizza, She loves cooking.',
      'Сочетание have + meal: have breakfast, have lunch, have dinner.',
    ],
  })],

  // ── HOBBIES / FREE TIME ─────────────────────────────────────────────────────
  [/hobby|hobbies|free time|spare time|sport|leisure|interest/i, (level) => ({
    task: `Write about your hobbies and what you do in your free time.`,
    instructions_ru: `Напиши о своих хобби и о том, чем ты занимаешься в свободное время. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'In my free time I enjoy reading books and watching films.',
      'I play basketball twice a week with my friends after school.',
      'My sister likes drawing. She often makes portraits of our family.',
    ],
    tips_ru: [
      'enjoy / like / love + глагол-ing: I enjoy reading, I love playing.',
      'Расскажи как часто ты занимаешься своим хобби (daily, twice a week).',
    ],
  })],

  // ── TRAVEL / PLACES ─────────────────────────────────────────────────────────
  [/travel|trip|city|country|place|visit|journey|destination/i, (level) => ({
    task: `Write about a place you have visited or a place you would like to visit.`,
    instructions_ru: `Напиши о месте, которое ты посещал(а), или о месте, куда хотел(а) бы поехать. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: [
      'Last summer I visited Istanbul with my family. It is a beautiful city.',
      'I went to the Grand Bazaar and bought some souvenirs.',
      'One day I would like to visit Japan because the culture is fascinating.',
    ],
    tips_ru: [
      'Используй Past Simple для прошлых поездок, would like для желаний.',
      'Описывай: что видел, что делал, что понравилось или удивило.',
    ],
  })],

  // ── SHOPPING ────────────────────────────────────────────────────────────────
  [/shop|shopping|buy|price|cost|market|store/i, (level) => ({
    task: `Write about a recent shopping experience or describe your favourite shop.`,
    instructions_ru: `Напиши о недавнем походе в магазин или опиши свой любимый магазин. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: [
      'Yesterday I went to the supermarket and bought some fruit and vegetables.',
      'My favourite shop is a bookstore in the city centre.',
      'The prices were reasonable and the staff was very helpful.',
    ],
    tips_ru: [
      'Используй Past Simple для описания прошлых покупок.',
      'Ключевые фразы: How much is it? Can I pay by card? I\'d like to buy...',
    ],
  })],

  // ── HEALTH / BODY ───────────────────────────────────────────────────────────
  [/health|body|illness|sick|doctor|medicine|symptom/i, (level) => ({
    task: `Write about healthy habits or describe a time when you were sick and visited a doctor.`,
    instructions_ru: `Напиши о здоровом образе жизни или опиши случай, когда ты был(а) болен/больна. ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 35,
    examples: [
      'To stay healthy, I exercise three times a week and sleep eight hours.',
      'Last month I had a bad cold. I had a sore throat and a headache.',
      'The doctor told me to rest and drink plenty of water.',
    ],
    tips_ru: [
      'have + симптом: I have a headache, She has a fever.',
      'Используй should/shouldn\'t для советов по здоровью.',
    ],
  })],

  // ── WORK / JOB ──────────────────────────────────────────────────────────────
  [/work|job|career|profession|occupation|office/i, (level) => ({
    task: `Write about your job or dream job. Describe what you do and why you like or want it.`,
    instructions_ru: `Напиши о своей работе или о работе своей мечты. Опиши обязанности, рабочий день и почему тебе это нравится. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: [
      'I am a student, but I work part-time at a coffee shop on weekends.',
      'My dream job is to become an engineer because I love solving problems.',
      'I want to work for an international company and travel for business.',
    ],
    tips_ru: [
      'Используй want to / would like to для мечты о работе.',
      'Описывай конкретные задачи: write reports, manage teams, design websites.',
    ],
  })],

  // ── ENVIRONMENT ─────────────────────────────────────────────────────────────
  [/environment|nature|pollution|climate|recycle|planet/i, (level) => ({
    task: `Write about an environmental problem you care about and suggest solutions.`,
    instructions_ru: `Напиши об экологической проблеме, которая тебя беспокоит, и предложи решения. ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 80,
    examples: [
      'Climate change is one of the most serious problems of our time.',
      'People should use public transport instead of driving cars to reduce pollution.',
      'Recycling paper, plastic and glass can significantly reduce waste.',
    ],
    tips_ru: [
      'Используй should/must для рекомендаций и предложений.',
      'Структура: проблема → причины → решения.',
    ],
    structure: 'Paragraph 1: Describe the problem. Paragraph 2: Explain the causes. Paragraph 3: Suggest solutions.',
  })],

  // ── TECHNOLOGY / INTERNET ───────────────────────────────────────────────────
  [/technology|internet|social media|digital|computer|phone|device/i, (level) => ({
    task: `Write about how technology affects your daily life — positive and negative effects.`,
    instructions_ru: `Напиши о влиянии технологий на твою жизнь — плюсы и минусы. ${LEVEL_CFG[level]?.sentence_count ?? '6–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 70,
    examples: [
      'Technology has changed the way we communicate completely.',
      'I use my smartphone for studying, shopping, and keeping in touch with friends.',
      'However, spending too much time on social media can affect mental health.',
    ],
    tips_ru: [
      'Используй has/have + past participle для изменений: technology has changed.',
      'Выражай своё мнение: I think, In my opinion, I believe that...',
    ],
    useful_phrases: ['has changed', 'I use it for', 'on the one hand', 'on the other hand', 'I believe that'],
  })],

  // ── EDUCATION ───────────────────────────────────────────────────────────────
  [/education|school|university|study|exam|learn|class|student/i, (level) => ({
    task: `Write about your educational experience — your school, favourite subject, or a memorable lesson.`,
    instructions_ru: `Напиши о своём образовании: о школе или университете, любимом предмете или запоминающемся уроке. ${LEVEL_CFG[level]?.sentence_count ?? '5–7'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 50,
    examples: [
      'I study at Khamadi University in the Faculty of Computer Science.',
      'My favourite subject is Mathematics because I enjoy solving complex problems.',
      'Last year we had an amazing project on artificial intelligence.',
    ],
    tips_ru: [
      'study + предмет: I study English / She studies medicine.',
      'Используй Past Simple для прошлых событий и Present Simple для регулярного.',
    ],
  })],

  // ── REVIEW / MODULE TEST (generic) ─────────────────────────────────────────
  [/review|module test|final test|assessment/i, (level) => ({
    task: `Write a short text summarising what you have learned in this module. Use the vocabulary and grammar from the lessons.`,
    instructions_ru: `Напиши небольшой текст, используя материал этого модуля. Включи изученную лексику и грамматические структуры. ${LEVEL_CFG[level]?.sentence_count ?? '5–8'} предложений.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 40,
    examples: [
      'In this module I learned how to introduce myself and describe my daily life.',
      'I can now use different tenses and vocabulary to communicate more effectively.',
      'One of the most useful things I practised was writing structured sentences.',
    ],
    tips_ru: [
      'Покажи, что ты умеешь: используй разные времена и грамматику модуля.',
      'Проверь орфографию и пунктуацию перед сдачей.',
    ],
  })],
]

// ── Default template if no pattern matches ────────────────────────────────────

function defaultContent(lessonTitle: string, level: string): WritingContent {
  const topic = lessonTitle.split('—').pop()?.trim() ?? lessonTitle
  return {
    task: `Write ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} sentences about the topic: "${topic}". Use the vocabulary and grammar from this lesson.`,
    instructions_ru: `Напиши ${LEVEL_CFG[level]?.sentence_count ?? '4–6'} предложений по теме урока «${topic}». Используй новую лексику и грамматику из этого урока.`,
    min_words: LEVEL_CFG[level]?.min_words ?? 30,
    examples: [
      'Write a sentence with a new word from the lesson.',
      'Use the grammar structure you just practised.',
      'Try to connect your sentences to make a short paragraph.',
    ],
    tips_ru: [
      'Перечитай урок и выбери 3–5 новых слов для своего текста.',
      'Не переводи дословно — думай по-английски.',
    ],
  }
}

// ── Generate content for a lesson ─────────────────────────────────────────────

function generateWriting(lessonTitle: string, level: string): WritingContent {
  for (const [pattern, generator] of TOPIC_MAP) {
    if (pattern.test(lessonTitle)) {
      return generator(level)
    }
  }
  return defaultContent(lessonTitle, level)
}

// ── Extract level code (A1/A2/B1/B2/C1) from course title or level string ─────

function extractLevel(courseTitle: string, level: string | null): string {
  const src = `${level ?? ''} ${courseTitle}`
  const m = src.match(/\b(A1|A2|B1|B2|C1|C2)\b/)
  return m ? m[1] : 'A1'
}

// ── Main ───────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Fetching General English lessons without writing sections...\n')

  // All GE lessons
  const { data: lessons, error: lErr } = await supabase
    .from('english_lessons')
    .select(`
      id,
      title,
      course_id,
      english_courses!inner(title, level, category)
    `)
    .order('id')

  if (lErr) { console.error('❌ Lessons query failed:', lErr.message); process.exit(1) }

  // Filter: only General English, skip module reviews (no writing task needed for review lessons)
  const geLessons = (lessons ?? []).filter((l: any) => {
    const course = l.english_courses
    return course?.category === 'General English'
  }) as any[]

  console.log(`📚 Found ${geLessons.length} General English lessons`)

  // IDs that already have writing sections
  const { data: existingSections } = await supabase
    .from('english_lesson_sections')
    .select('lesson_id')
    .eq('type', 'writing')

  const existingIds = new Set((existingSections ?? []).map((s: any) => s.lesson_id))
  console.log(`✅ Already have writing sections: ${existingIds.size}`)

  const needsWriting = geLessons.filter((l: any) => !existingIds.has(l.id))
  console.log(`📝 Need writing sections: ${needsWriting.length}\n`)

  if (needsWriting.length === 0) {
    console.log('🎉 All lessons already have writing sections!')
    return
  }

  // Get max order_index for each lesson
  const { data: existingByLesson } = await supabase
    .from('english_lesson_sections')
    .select('lesson_id, order_index')
    .in('lesson_id', needsWriting.map((l: any) => l.id))

  const maxOrderMap = new Map<string, number>()
  for (const row of (existingByLesson ?? []) as any[]) {
    const cur = maxOrderMap.get(row.lesson_id) ?? 0
    if (row.order_index > cur) maxOrderMap.set(row.lesson_id, row.order_index)
  }

  let inserted = 0
  let errors   = 0

  for (const lesson of needsWriting) {
    const course     = lesson.english_courses as any
    const levelCode  = extractLevel(course.title ?? '', course.level ?? '')
    const content    = generateWriting(lesson.title, levelCode)
    const orderIndex = (maxOrderMap.get(lesson.id) ?? 2) + 1

    const { error } = await supabase
      .from('english_lesson_sections')
      .insert({
        lesson_id:   lesson.id,
        type:        'writing',
        order_index: orderIndex,
        content,
      })

    if (error) {
      console.error(`  ❌ ${lesson.title}: ${error.message}`)
      errors++
    } else {
      console.log(`  ✅ ${levelCode} | ${lesson.title}`)
      inserted++
    }
  }

  console.log(`\n📊 Done: ${inserted} inserted, ${errors} errors`)
}

main().catch(err => { console.error(err); process.exit(1) })
