/**
 * Content data for General English textbooks (A1 → C1).
 * Each level has units with grammar, vocabulary, exercises.
 */

import { VocabEntry, Exercise } from './pdf-builder'

export interface GrammarPoint {
  title: string
  explanation: string     // EN
  ruExplanation: string   // RU
  form: string[]          // form/structure lines
  examples: string[]
  commonErrors?: string[]
}

export interface Unit {
  number: number
  title: string
  ruTitle: string
  objectives: string[]
  grammar: GrammarPoint[]
  vocabulary: VocabEntry[]
  readingTitle: string
  readingText: string
  exercises: Exercise[]
  culturalNote: string
  ruCulturalNote: string
}

export interface LevelContent {
  id: string
  title: string
  subtitle: string
  level: string
  cefr: string
  descriptionEn: string
  descriptionRu: string
  prefaceRu: string
  units: Unit[]
  glossaryExtras: VocabEntry[]
  resources: string[]
}

// ────────────────────────────────────────────────────────────────────────────
// A1 BEGINNER
// ────────────────────────────────────────────────────────────────────────────

export const A1_BEGINNER: LevelContent = {
  id: 'a1-beginner',
  title: 'A1 Beginner English',
  subtitle: 'Your First Steps in English',
  level: 'A1 Beginner',
  cefr: 'CEFR A1',
  descriptionEn: 'A complete beginner course covering essential vocabulary, basic grammar structures, and everyday communication skills.',
  descriptionRu: 'Полный курс для абсолютных начинающих. Охватывает базовый словарный запас, основные грамматические структуры и навыки повседневного общения.',
  prefaceRu: `Добро пожаловать в курс A1 Beginner English от KHAMADI ENGLISH!

Этот учебник разработан специально для тех, кто делает первые шаги в изучении английского языка. Вы ещё никогда не изучали английский — или изучали, но давно? Этот курс именно для вас.

СТРУКТУРА УЧЕБНИКА

Учебник состоит из 10 модулей. Каждый модуль включает:
• Грамматику с объяснениями на английском и русском языках
• Словарный запас — не менее 50 слов с определениями и переводом
• Текст для чтения с заданиями
• Упражнения для самопроверки
• Культурные заметки о жизни в англоязычных странах

КАК ПОЛЬЗОВАТЬСЯ УЧЕБНИКОМ

1. Читайте объяснения на русском (блоки 📘 RU), если что-то непонятно в английском тексте.
2. Учите слова каждого модуля — минимум 10–15 слов в день.
3. Делайте все упражнения письменно, не пропуская их.
4. Проверяйте ответы в разделе Answer Key в конце учебника.
5. На платформе KHAMADI ENGLISH используйте интерактивные карточки для повторения слов.

Не бойтесь ошибаться — ошибки это часть обучения. Удачи!`,
  units: [
    {
      number: 1,
      title: 'Hello! Nice to Meet You',
      ruTitle: 'Привет! Приятно познакомиться',
      objectives: [
        'Introduce yourself and others',
        'Ask and answer personal questions',
        'Use the verb "to be" in present tense',
        'Learn numbers 1–20 and the alphabet',
      ],
      grammar: [
        {
          title: 'The Verb "To Be" — Present Simple',
          explanation: 'The verb "to be" is the most important verb in English. It tells us about states, identities, and qualities. In Present Simple, it has three forms: am, is, are.',
          ruExplanation: 'Глагол "to be" — самый важный глагол в английском. Он описывает состояния, идентичность и качества. В настоящем простом времени имеет три формы: am (я), is (он/она/оно), are (мы/вы/они).',
          form: [
            'I am (I\'m) / You are (You\'re) / He/She/It is (He\'s/She\'s/It\'s)',
            'We are (We\'re) / You are (You\'re) / They are (They\'re)',
            'Negative: I am not (I\'m not) / You are not (You aren\'t)',
            'Question: Am I? / Are you? / Is he/she/it?',
          ],
          examples: [
            'I am a student. → I\'m a student.',
            'She is from Kazakhstan. → She\'s from Kazakhstan.',
            'They are my friends.',
            'Are you a teacher? — Yes, I am. / No, I\'m not.',
          ],
          commonErrors: [
            '❌ She am a doctor.  ✅ She is a doctor.',
            '❌ I is happy.       ✅ I am happy.',
            '❌ Are they is here? ✅ Are they here?',
          ],
        },
        {
          title: 'Personal Pronouns',
          explanation: 'Personal pronouns replace nouns and tell us who is doing the action or who/what we are talking about.',
          ruExplanation: 'Личные местоимения заменяют существительные. Субъектные (I, you, he…) используются в роли подлежащего. Объектные (me, you, him…) — в роли дополнения.',
          form: [
            'Subject: I, you, he, she, it, we, they',
            'Object:  me, you, him, her, it, us, them',
          ],
          examples: [
            'I see him every day.',
            'She likes us.',
            'Give it to me, please.',
          ],
        },
      ],
      vocabulary: [
        { en: 'hello', pos: 'excl.', def: 'A greeting used when meeting someone', ru: 'привет/здравствуйте', example: 'Hello! My name is Asel.' },
        { en: 'goodbye', pos: 'excl.', def: 'A farewell expression', ru: 'до свидания/пока', example: 'Goodbye! See you tomorrow.' },
        { en: 'name', pos: 'n.', def: 'The word(s) that identify a person or thing', ru: 'имя/название', example: 'What is your name?' },
        { en: 'student', pos: 'n.', def: 'A person who studies at school or university', ru: 'студент/ученик', example: 'I am a student at KazNU.' },
        { en: 'teacher', pos: 'n.', def: 'A person who teaches others', ru: 'учитель/преподаватель', example: 'My teacher is very kind.' },
        { en: 'country', pos: 'n.', def: 'A nation with its own government', ru: 'страна', example: 'Kazakhstan is a large country.' },
        { en: 'city', pos: 'n.', def: 'A large urban area', ru: 'город', example: 'Almaty is a big city.' },
        { en: 'age', pos: 'n.', def: 'How old a person or thing is', ru: 'возраст', example: 'My age is 20.' },
        { en: 'family', pos: 'n.', def: 'A group of people related by blood or marriage', ru: 'семья', example: 'I love my family.' },
        { en: 'friend', pos: 'n.', def: 'A person you know well and like', ru: 'друг/подруга', example: 'She is my best friend.' },
        { en: 'work', pos: 'n./v.', def: 'Activity involving effort; to do a job', ru: 'работа; работать', example: 'I work at a school.' },
        { en: 'home', pos: 'n.', def: 'The place where you live', ru: 'дом/жилище', example: 'Let\'s go home.' },
        { en: 'school', pos: 'n.', def: 'A place of education for children', ru: 'школа', example: 'I go to school every day.' },
        { en: 'number', pos: 'n.', def: 'A mathematical value', ru: 'число/номер', example: 'My phone number is 700...' },
        { en: 'address', pos: 'n.', def: 'Where someone lives or works', ru: 'адрес', example: 'What is your address?' },
        { en: 'language', pos: 'n.', def: 'A system of communication used by people', ru: 'язык', example: 'English is an international language.' },
        { en: 'speak', pos: 'v.', def: 'To talk or say words', ru: 'говорить', example: 'Do you speak English?' },
        { en: 'understand', pos: 'v.', def: 'To know the meaning of something', ru: 'понимать', example: 'I don\'t understand this word.' },
        { en: 'please', pos: 'adv.', def: 'Used to make a polite request', ru: 'пожалуйста', example: 'Can you help me, please?' },
        { en: 'thank you', pos: 'phrase', def: 'Expression of gratitude', ru: 'спасибо', example: 'Thank you for your help.' },
        { en: 'sorry', pos: 'excl.', def: 'Used to apologise or express regret', ru: 'извините/прости', example: 'Sorry, I\'m late.' },
        { en: 'excuse me', pos: 'phrase', def: 'Used to get attention or apologise politely', ru: 'извините меня', example: 'Excuse me, where is the station?' },
        { en: 'yes', pos: 'adv.', def: 'Affirmative answer', ru: 'да', example: 'Yes, I am a student.' },
        { en: 'no', pos: 'adv.', def: 'Negative answer', ru: 'нет', example: 'No, I am not from Russia.' },
        { en: 'morning', pos: 'n.', def: 'The early part of the day (before noon)', ru: 'утро', example: 'Good morning!' },
        { en: 'afternoon', pos: 'n.', def: 'The time from noon to evening', ru: 'день/послеполудень', example: 'Good afternoon, class.' },
        { en: 'evening', pos: 'n.', def: 'The end part of the day', ru: 'вечер', example: 'Good evening, everyone.' },
        { en: 'night', pos: 'n.', def: 'The dark part of the day when most people sleep', ru: 'ночь', example: 'Good night! See you tomorrow.' },
        { en: 'today', pos: 'adv.', def: 'On this day', ru: 'сегодня', example: 'Today is Monday.' },
        { en: 'tomorrow', pos: 'adv.', def: 'On the day after today', ru: 'завтра', example: 'I have a class tomorrow.' },
        { en: 'yesterday', pos: 'adv.', def: 'On the day before today', ru: 'вчера', example: 'I was tired yesterday.' },
        { en: 'week', pos: 'n.', def: 'A period of seven days', ru: 'неделя', example: 'I study English three times a week.' },
        { en: 'month', pos: 'n.', def: 'One of twelve divisions of a year', ru: 'месяц', example: 'January is the first month of the year.' },
        { en: 'year', pos: 'n.', def: 'A period of 12 months', ru: 'год', example: 'This year I will learn English.' },
        { en: 'day', pos: 'n.', def: 'A 24-hour period', ru: 'день', example: 'Every day I study for one hour.' },
        { en: 'time', pos: 'n.', def: 'The measured passage of minutes/hours', ru: 'время', example: 'What time is it?' },
        { en: 'place', pos: 'n.', def: 'A particular position or area', ru: 'место', example: 'This is a nice place.' },
        { en: 'person', pos: 'n.', def: 'A human being', ru: 'человек/персона', example: 'She is a kind person.' },
        { en: 'man', pos: 'n.', def: 'An adult male human', ru: 'мужчина', example: 'The man is my father.' },
        { en: 'woman', pos: 'n.', def: 'An adult female human', ru: 'женщина', example: 'The woman is my mother.' },
        { en: 'boy', pos: 'n.', def: 'A male child', ru: 'мальчик', example: 'The boy is ten years old.' },
        { en: 'girl', pos: 'n.', def: 'A female child', ru: 'девочка', example: 'The girl likes reading.' },
        { en: 'old', pos: 'adj.', def: 'Having lived for many years', ru: 'старый/пожилой', example: 'My grandfather is old.' },
        { en: 'young', pos: 'adj.', def: 'Not old; having lived for few years', ru: 'молодой', example: 'She is a young teacher.' },
        { en: 'big', pos: 'adj.', def: 'Large in size', ru: 'большой', example: 'Kazakhstan is a big country.' },
        { en: 'small', pos: 'adj.', def: 'Little in size', ru: 'маленький', example: 'My apartment is small but cosy.' },
        { en: 'good', pos: 'adj.', def: 'Of a high quality; satisfactory', ru: 'хороший', example: 'This is a good book.' },
        { en: 'nice', pos: 'adj.', def: 'Pleasant, agreeable', ru: 'приятный/милый', example: 'Nice to meet you!' },
        { en: 'happy', pos: 'adj.', def: 'Feeling pleasure and contentment', ru: 'счастливый/радостный', example: 'I am happy to be here.' },
        { en: 'tired', pos: 'adj.', def: 'Feeling the need to rest or sleep', ru: 'уставший', example: 'I am very tired today.' },
        { en: 'hungry', pos: 'adj.', def: 'Wanting or needing food', ru: 'голодный', example: 'Are you hungry? Let\'s eat.' },
      ],
      readingTitle: 'My First Day at an English Language School',
      readingText: `My name is Asel. I am from Almaty, Kazakhstan. I am twenty-two years old. Today is my first day at an English language school. I am very excited and a little nervous.

My teacher's name is David. He is from London, England. He is thirty years old. He is friendly and patient.

In my class, there are fifteen students. We are from different countries — Kazakhstan, Russia, Kyrgyzstan, and Azerbaijan. We are all beginners. We do not speak English well yet, but we want to learn.

Our classroom is small but nice. There are desks, chairs, a whiteboard, and a big window. The window is next to my desk.

David says: "Hello, everyone! Welcome to English class. I am your teacher. My name is David. What is your name?"

I say: "My name is Asel. I am from Kazakhstan."

"Nice to meet you, Asel," he says with a smile.

After the introductions, we learn the alphabet and numbers. It is fun. I like this class. I think I will enjoy learning English.`,
      exercises: [
        {
          instruction: 'Complete the sentences with am, is, or are.',
          ruHint: 'Заполните предложения формами глагола to be: am, is или are.',
          items: [
            'I _____ a student.',
            'She _____ from Kazakhstan.',
            'They _____ my friends.',
            'We _____ in English class.',
            'He _____ twenty years old.',
            'You _____ very kind.',
            'The book _____ on the desk.',
            'My teachers _____ from England.',
          ],
        },
        {
          instruction: 'Write questions for these answers using the verb "to be".',
          ruHint: 'Напишите вопросы к ответам, используя глагол to be.',
          items: [
            '___________? — Yes, I am a student.',
            '___________? — She is from Almaty.',
            '___________? — They are twenty years old.',
            '___________? — No, he is not a teacher.',
          ],
        },
        {
          instruction: 'Match the greetings with the time of day. Write the letter.',
          ruHint: 'Соотнесите приветствия со временем суток.',
          items: [
            '___  Good morning!     a) 8:00 PM',
            '___  Good afternoon!   b) 7:00 AM',
            '___  Good evening!     c) 2:00 PM',
            '___  Good night!       d) 11:00 PM',
          ],
        },
        {
          instruction: 'Translate into English.',
          ruHint: 'Переведите на английский язык.',
          items: [
            'Меня зовут Дамир.',
            'Мне двадцать лет.',
            'Я из Казахстана.',
            'Она — моя учительница.',
            'Мы студенты.',
          ],
        },
      ],
      culturalNote: 'In English-speaking countries, people often greet each other with "How are you?" This is usually a polite formality, not a genuine question about your health. The typical answer is "Fine, thanks!" or "Good, thanks!" — even if you are not feeling great. Save detailed health reports for close friends!',
      ruCulturalNote: 'В англоязычных странах вопрос "How are you?" — это приветствие, а не реальный вопрос о здоровье. Стандартный ответ: "Fine, thanks!" или "Good, thanks!" Не нужно рассказывать о своих проблемах незнакомцам — это воспримут как странность.',
    },
    {
      number: 2,
      title: 'My Daily Life',
      ruTitle: 'Моя повседневная жизнь',
      objectives: [
        'Describe daily routines using Present Simple',
        'Use adverbs of frequency (always, usually, never…)',
        'Tell the time in English',
        'Learn food, home, and activities vocabulary',
      ],
      grammar: [
        {
          title: 'Present Simple — Regular Actions',
          explanation: 'We use the Present Simple tense to talk about habits, routines, facts, and things that happen regularly. It describes what we normally do, not what is happening right now.',
          ruExplanation: 'Настоящее простое время (Present Simple) используется для привычек, рутинных действий, фактов и вещей, происходящих регулярно. Важно: это НЕ то, что происходит прямо сейчас.',
          form: [
            'Affirmative: I/You/We/They + verb (base form)',
            '              He/She/It + verb + -s/-es',
            'Negative:    I do not (don\'t) + verb',
            '              He does not (doesn\'t) + verb',
            'Question:    Do I/you/we/they + verb?',
            '              Does he/she/it + verb?',
          ],
          examples: [
            'I wake up at 7 o\'clock every morning.',
            'She studies English every day.',
            'They do not watch TV at night.',
            'Does he play football on weekends?',
          ],
          commonErrors: [
            '❌ She don\'t like coffee.    ✅ She doesn\'t like coffee.',
            '❌ Does he goes to school?  ✅ Does he go to school?',
            '❌ I am wake up at 7.       ✅ I wake up at 7.',
          ],
        },
        {
          title: 'Adverbs of Frequency',
          explanation: 'Adverbs of frequency tell us how often something happens. They go BEFORE the main verb but AFTER "to be".',
          ruExplanation: 'Наречия частотности показывают, как часто что-то происходит. Они стоят ПЕРЕД смысловым глаголом, но ПОСЛЕ глагола to be. Порядок: always (100%) → usually → often → sometimes → rarely → never (0%).',
          form: [
            'always (100%) — I always brush my teeth.',
            'usually (80%)  — She usually has breakfast.',
            'often  (60%)   — We often go to the park.',
            'sometimes (40%) — He sometimes works late.',
            'rarely (20%)   — I rarely eat fast food.',
            'never (0%)     — They never smoke.',
          ],
          examples: [
            'I always wake up at 6 AM.',
            'She is usually tired in the evening.',
            'We sometimes go to the cinema.',
          ],
        },
      ],
      vocabulary: [
        { en: 'wake up', pos: 'v.phr.', def: 'To stop sleeping and become conscious', ru: 'просыпаться', example: 'I wake up at 7 every morning.' },
        { en: 'get up', pos: 'v.phr.', def: 'To rise from bed', ru: 'вставать с кровати', example: 'I get up at 7:15.' },
        { en: 'shower', pos: 'n./v.', def: 'A device for washing; to wash under it', ru: 'душ; принимать душ', example: 'I take a shower every morning.' },
        { en: 'breakfast', pos: 'n.', def: 'The first meal of the day', ru: 'завтрак', example: 'I have breakfast at 8 AM.' },
        { en: 'lunch', pos: 'n.', def: 'A meal eaten in the middle of the day', ru: 'обед', example: 'We have lunch at 1 PM.' },
        { en: 'dinner', pos: 'n.', def: 'The main meal of the day, usually in the evening', ru: 'ужин', example: 'My family has dinner together.' },
        { en: 'cook', pos: 'v.', def: 'To prepare food using heat', ru: 'готовить/варить', example: 'My mother cooks delicious food.' },
        { en: 'eat', pos: 'v.', def: 'To put food into the mouth and swallow it', ru: 'есть/кушать', example: 'I eat fruit every day.' },
        { en: 'drink', pos: 'v.', def: 'To take liquid into the mouth and swallow', ru: 'пить', example: 'I drink coffee in the morning.' },
        { en: 'sleep', pos: 'v.', def: 'To rest with eyes closed and unconscious', ru: 'спать', example: 'I sleep eight hours a night.' },
        { en: 'go to bed', pos: 'v.phr.', def: 'To get into bed to sleep', ru: 'ложиться спать', example: 'I go to bed at 11 PM.' },
        { en: 'work', pos: 'v.', def: 'To do a job or task', ru: 'работать', example: 'My father works in an office.' },
        { en: 'study', pos: 'v.', def: 'To spend time learning', ru: 'учиться/изучать', example: 'I study English every day.' },
        { en: 'read', pos: 'v.', def: 'To look at and understand written text', ru: 'читать', example: 'I read books before sleeping.' },
        { en: 'write', pos: 'v.', def: 'To form words on paper or screen', ru: 'писать', example: 'I write in my notebook.' },
        { en: 'listen', pos: 'v.', def: 'To pay attention to sounds', ru: 'слушать', example: 'I listen to music on the bus.' },
        { en: 'watch', pos: 'v.', def: 'To look at something for a period of time', ru: 'смотреть (ТВ и т.д.)', example: 'I watch TV in the evening.' },
        { en: 'play', pos: 'v.', def: 'To take part in a game or sport', ru: 'играть', example: 'My brother plays football.' },
        { en: 'walk', pos: 'v.', def: 'To move on foot', ru: 'ходить пешком', example: 'I walk to school.' },
        { en: 'drive', pos: 'v.', def: 'To operate a vehicle', ru: 'водить/ехать', example: 'My dad drives to work.' },
        { en: 'take', pos: 'v.', def: 'To carry or use (transport)', ru: 'брать/ехать на', example: 'I take the bus to university.' },
        { en: 'arrive', pos: 'v.', def: 'To reach a place', ru: 'приезжать/прибывать', example: 'I arrive at school at 8:30.' },
        { en: 'leave', pos: 'v.', def: 'To go away from a place', ru: 'уходить/уезжать', example: 'I leave home at 8 AM.' },
        { en: 'come back', pos: 'v.phr.', def: 'To return to a place', ru: 'возвращаться', example: 'I come back home at 6 PM.' },
        { en: 'start', pos: 'v.', def: 'To begin doing something', ru: 'начинать', example: 'Classes start at 9 AM.' },
        { en: 'finish', pos: 'v.', def: 'To complete or end', ru: 'заканчивать', example: 'I finish work at 5 PM.' },
        { en: 'meet', pos: 'v.', def: 'To come together with someone', ru: 'встречать/знакомиться', example: 'I meet my friends on Fridays.' },
        { en: 'call', pos: 'v.', def: 'To telephone someone', ru: 'звонить', example: 'I call my parents every day.' },
        { en: 'help', pos: 'v.', def: 'To assist someone', ru: 'помогать', example: 'I help my mother at home.' },
        { en: 'buy', pos: 'v.', def: 'To get something by paying money', ru: 'покупать', example: 'I buy groceries on Saturdays.' },
        { en: 'always', pos: 'adv.', def: 'At all times; every time', ru: 'всегда', example: 'I always have breakfast.' },
        { en: 'usually', pos: 'adv.', def: 'Most of the time; normally', ru: 'обычно/как правило', example: 'I usually drink tea.' },
        { en: 'often', pos: 'adv.', def: 'Many times; frequently', ru: 'часто', example: 'We often eat pizza.' },
        { en: 'sometimes', pos: 'adv.', def: 'On some occasions; not always', ru: 'иногда', example: 'I sometimes go to the gym.' },
        { en: 'rarely', pos: 'adv.', def: 'Not often; seldom', ru: 'редко', example: 'I rarely watch horror films.' },
        { en: 'never', pos: 'adv.', def: 'At no time; not ever', ru: 'никогда', example: 'I never smoke.' },
        { en: 'early', pos: 'adv./adj.', def: 'Before the usual or expected time', ru: 'рано/ранний', example: 'I wake up early.' },
        { en: 'late', pos: 'adv./adj.', def: 'After the usual or expected time', ru: 'поздно/поздний', example: 'Don\'t be late for class!' },
        { en: 'busy', pos: 'adj.', def: 'Occupied with work or activity', ru: 'занятой', example: 'I am busy in the morning.' },
        { en: 'free', pos: 'adj.', def: 'Not occupied; available', ru: 'свободный', example: 'Are you free on Saturday?' },
        { en: 'tired', pos: 'adj.', def: 'Needing rest or sleep', ru: 'усталый', example: 'I am tired after work.' },
        { en: 'hungry', pos: 'adj.', def: 'Wanting food', ru: 'голодный', example: 'I am hungry — let\'s eat.' },
        { en: 'thirsty', pos: 'adj.', def: 'Needing to drink', ru: 'хотеть пить / испытывать жажду', example: 'I\'m thirsty. I need water.' },
        { en: 'ready', pos: 'adj.', def: 'Prepared to do something', ru: 'готовый', example: 'Are you ready for class?' },
        { en: 'every day', pos: 'phrase', def: 'Each day without exception', ru: 'каждый день', example: 'I brush my teeth every day.' },
        { en: 'at the weekend', pos: 'phrase', def: 'On Saturday and/or Sunday', ru: 'в выходные', example: 'I relax at the weekend.' },
        { en: 'in the morning', pos: 'phrase', def: 'During the morning hours', ru: 'утром', example: 'I exercise in the morning.' },
        { en: 'in the evening', pos: 'phrase', def: 'During the evening hours', ru: 'вечером', example: 'I study in the evening.' },
        { en: 'at night', pos: 'phrase', def: 'During night-time hours', ru: 'ночью', example: 'I read at night.' },
        { en: 'on Monday', pos: 'phrase', def: 'During the day called Monday', ru: 'в понедельник', example: 'I have English class on Monday.' },
      ],
      readingTitle: 'A Typical Day',
      readingText: `My name is Daniyar. I am a university student in Astana. I have a very busy schedule. Here is my typical day.

I always wake up at 6:30 AM. I get up, take a shower, and get dressed. I have breakfast at 7:00. I usually eat porridge or eggs. I drink a cup of tea or coffee.

I leave home at 7:45 AM. I take the bus to university. The bus ride takes about 30 minutes. I arrive at university at 8:15.

My first class starts at 9:00 AM. I study mathematics, physics, and English. I love English class the most.

I have lunch at 1:00 PM. I usually eat in the university cafeteria. The food is not expensive. I eat soup and a main course.

After classes, I come home at about 5:30 PM. I am usually tired but happy. I help my mother with dinner sometimes.

In the evening, I do my homework. I also read books or watch television. I never stay up after midnight. I go to bed at 11 PM and sleep for seven or eight hours.

I love my daily routine. It keeps me organised and healthy.`,
      exercises: [
        {
          instruction: 'Write the third person singular (he/she/it) form of these verbs.',
          ruHint: 'Напишите форму для третьего лица единственного числа.',
          items: [
            'wake → _______',
            'study → _______',
            'go → _______',
            'have → _______',
            'watch → _______',
            'do → _______',
            'finish → _______',
            'eat → _______',
          ],
        },
        {
          instruction: 'Make these sentences negative. Use don\'t or doesn\'t.',
          ruHint: 'Сделайте предложения отрицательными.',
          items: [
            'I eat breakfast at school. → I _______',
            'She watches TV every evening. → She _______',
            'They walk to school. → They _______',
            'He wakes up at 6 AM. → He _______',
          ],
        },
        {
          instruction: 'Put the adverb of frequency in the correct position.',
          ruHint: 'Поставьте наречие частотности на правильное место.',
          items: [
            'I eat fast food. (never) → _______',
            'She is late for class. (sometimes) → _______',
            'We study in the library. (often) → _______',
            'He wakes up early. (always) → _______',
          ],
        },
      ],
      culturalNote: 'In the UK and USA, people often say "How are you?" and "How\'s it going?" as greetings. The British also love talking about the weather — it\'s a common conversation starter. If someone invites you for "tea," they might actually mean dinner!',
      ruCulturalNote: 'В Великобритании "tea" может означать не только напиток, но и ужин, особенно в северных регионах. А разговор о погоде — это классический способ начать непринуждённую беседу с незнакомцем.',
    },
    {
      number: 3,
      title: 'People and Places',
      ruTitle: 'Люди и места',
      objectives: [
        'Describe people\'s appearance and personality',
        'Describe places using adjectives',
        'Use "there is / there are" correctly',
        'Ask for and give directions',
      ],
      grammar: [
        {
          title: 'There is / There are',
          explanation: '"There is" and "There are" are used to say that something exists in a particular place. "There is" is for singular nouns; "there are" is for plural nouns.',
          ruExplanation: '"There is/are" используется для указания на существование чего-либо. "There is" — с единственным числом, "there are" — с множественным. В русском языке этому соответствует "есть" или "находится/находятся".',
          form: [
            'Affirmative: There is a + noun.  /  There are + noun(s).',
            'Negative:    There isn\'t a + noun. /  There aren\'t any + noun(s).',
            'Question:    Is there a + noun?   /  Are there any + noun(s)?',
          ],
          examples: [
            'There is a bank near my house.',
            'There are three parks in this neighbourhood.',
            'Is there a café near here? — Yes, there is.',
            'Are there any shops? — No, there aren\'t.',
          ],
        },
        {
          title: 'Descriptive Adjectives — Order',
          explanation: 'When we use several adjectives to describe a noun, they follow a specific order: Opinion → Size → Age → Shape → Colour → Origin → Material + Noun.',
          ruExplanation: 'При использовании нескольких прилагательных порядок такой: Мнение → Размер → Возраст → Форма → Цвет → Происхождение → Материал + Существительное.',
          form: [
            'a beautiful small old round green Italian wooden table',
            'Opinion: lovely, ugly, terrible',
            'Size: big, small, tall, short',
            'Age: old, new, young, ancient',
            'Colour: red, blue, green, dark',
            'Origin: Italian, Kazakh, British',
            'Material: wooden, plastic, metal',
          ],
          examples: [
            'She has long brown hair.',
            'He lives in a big old house.',
            'I want a small round table.',
          ],
        },
      ],
      vocabulary: [
        { en: 'tall', pos: 'adj.', def: 'Of above average height', ru: 'высокий (о человеке)', example: 'He is very tall — 190 cm.' },
        { en: 'short', pos: 'adj.', def: 'Of below average height', ru: 'низкий/невысокий', example: 'My sister is short.' },
        { en: 'thin', pos: 'adj.', def: 'Having little body fat; slim', ru: 'худой/тонкий', example: 'He looks thin — he should eat more.' },
        { en: 'heavy', pos: 'adj.', def: 'Of great weight', ru: 'тяжёлый/полный', example: 'The suitcase is very heavy.' },
        { en: 'hair', pos: 'n.', def: 'The threads growing from a person\'s head', ru: 'волосы', example: 'She has beautiful long hair.' },
        { en: 'eyes', pos: 'n.', def: 'The organs used for seeing', ru: 'глаза', example: 'He has blue eyes.' },
        { en: 'kind', pos: 'adj.', def: 'Friendly and generous', ru: 'добрый/любезный', example: 'My teacher is very kind.' },
        { en: 'funny', pos: 'adj.', def: 'Causing laughter; amusing', ru: 'смешной/забавный', example: 'My friend is very funny.' },
        { en: 'serious', pos: 'adj.', def: 'Not joking; thoughtful', ru: 'серьёзный', example: 'She is a serious student.' },
        { en: 'friendly', pos: 'adj.', def: 'Kind and pleasant to others', ru: 'дружелюбный', example: 'People here are very friendly.' },
        { en: 'shy', pos: 'adj.', def: 'Nervous or timid around other people', ru: 'застенчивый', example: 'He is shy in large groups.' },
        { en: 'confident', pos: 'adj.', def: 'Believing in one\'s own abilities', ru: 'уверенный в себе', example: 'She speaks English confidently.' },
        { en: 'street', pos: 'n.', def: 'A road in a city with buildings on either side', ru: 'улица', example: 'Turn left on the main street.' },
        { en: 'road', pos: 'n.', def: 'A path for vehicles and people', ru: 'дорога/шоссе', example: 'The road is very busy today.' },
        { en: 'building', pos: 'n.', def: 'A structure with walls and a roof', ru: 'здание/строение', example: 'There is a tall building on the corner.' },
        { en: 'shop', pos: 'n.', def: 'A place where things are sold', ru: 'магазин', example: 'There is a shop near my house.' },
        { en: 'supermarket', pos: 'n.', def: 'A large shop selling food and other goods', ru: 'супермаркет', example: 'I go to the supermarket on Saturdays.' },
        { en: 'hospital', pos: 'n.', def: 'A place where sick or injured people receive medical treatment', ru: 'больница', example: 'Is there a hospital near here?' },
        { en: 'library', pos: 'n.', def: 'A place where books are kept for reading or borrowing', ru: 'библиотека', example: 'The library is open until 8 PM.' },
        { en: 'park', pos: 'n.', def: 'A public area with grass and trees', ru: 'парк', example: 'I walk in the park every morning.' },
        { en: 'station', pos: 'n.', def: 'A place where trains or buses stop', ru: 'станция/вокзал', example: 'The train station is far from here.' },
        { en: 'airport', pos: 'n.', def: 'A place where aircraft take off and land', ru: 'аэропорт', example: 'The airport is outside the city.' },
        { en: 'hotel', pos: 'n.', def: 'A building with rooms for people to stay in', ru: 'гостиница/отель', example: 'We stayed in a nice hotel.' },
        { en: 'restaurant', pos: 'n.', def: 'A place where meals are cooked and served', ru: 'ресторан', example: 'There is a new restaurant on our street.' },
        { en: 'café', pos: 'n.', def: 'A small restaurant serving drinks and snacks', ru: 'кафе', example: 'Let\'s meet at the café at noon.' },
        { en: 'bank', pos: 'n.', def: 'A financial institution for saving or borrowing money', ru: 'банк', example: 'I need to go to the bank today.' },
        { en: 'post office', pos: 'n.', def: 'A place for sending letters and parcels', ru: 'почта', example: 'Can I send a parcel at the post office?' },
        { en: 'near', pos: 'prep./adj.', def: 'Close to; not far from', ru: 'рядом/близко', example: 'The school is near my home.' },
        { en: 'far', pos: 'adj./adv.', def: 'At a great distance', ru: 'далеко/далёкий', example: 'The airport is far from the city centre.' },
        { en: 'opposite', pos: 'prep.', def: 'Facing; on the other side', ru: 'напротив', example: 'The bank is opposite the post office.' },
        { en: 'next to', pos: 'phrase', def: 'Immediately beside', ru: 'рядом с/возле', example: 'The café is next to the library.' },
        { en: 'between', pos: 'prep.', def: 'In the space separating two things', ru: 'между', example: 'The park is between the school and the hospital.' },
        { en: 'on the corner', pos: 'phrase', def: 'At the point where two streets meet', ru: 'на углу (улицы)', example: 'The bank is on the corner.' },
        { en: 'turn left', pos: 'v.phr.', def: 'To change direction to the left', ru: 'повернуть налево', example: 'Turn left at the traffic lights.' },
        { en: 'turn right', pos: 'v.phr.', def: 'To change direction to the right', ru: 'повернуть направо', example: 'Turn right after the bank.' },
        { en: 'straight ahead', pos: 'phrase', def: 'In the forward direction without turning', ru: 'прямо', example: 'Go straight ahead for 200 metres.' },
        { en: 'noisy', pos: 'adj.', def: 'Making or full of noise', ru: 'шумный', example: 'The city centre is very noisy.' },
        { en: 'quiet', pos: 'adj.', def: 'With little noise', ru: 'тихий/спокойный', example: 'My neighbourhood is quiet.' },
        { en: 'crowded', pos: 'adj.', def: 'Full of people', ru: 'переполненный людьми', example: 'The market is very crowded today.' },
        { en: 'clean', pos: 'adj.', def: 'Free from dirt or pollution', ru: 'чистый', example: 'The park is clean and beautiful.' },
        { en: 'dirty', pos: 'adj.', def: 'Covered with dirt', ru: 'грязный', example: 'The old factory made the air dirty.' },
        { en: 'safe', pos: 'adj.', def: 'Protected from danger', ru: 'безопасный', example: 'This is a safe neighbourhood.' },
        { en: 'dangerous', pos: 'adj.', def: 'Likely to cause harm', ru: 'опасный', example: 'Don\'t walk there at night — it\'s dangerous.' },
        { en: 'modern', pos: 'adj.', def: 'Of the present or recent times', ru: 'современный', example: 'Astana is a modern city.' },
        { en: 'traditional', pos: 'adj.', def: 'Following old customs', ru: 'традиционный', example: 'This is a traditional market.' },
        { en: 'beautiful', pos: 'adj.', def: 'Very pleasing to the senses', ru: 'красивый/прекрасный', example: 'What a beautiful city!' },
        { en: 'ugly', pos: 'adj.', def: 'Unpleasant to look at', ru: 'уродливый/некрасивый', example: 'The old factory is really ugly.' },
        { en: 'interesting', pos: 'adj.', def: 'Holding one\'s attention; fascinating', ru: 'интересный', example: 'The old town is very interesting.' },
        { en: 'boring', pos: 'adj.', def: 'Not interesting; dull', ru: 'скучный', example: 'The lecture was really boring.' },
        { en: 'expensive', pos: 'adj.', def: 'Costing a lot of money', ru: 'дорогой/дорогостоящий', example: 'Hotels in the city centre are expensive.' },
        { en: 'cheap', pos: 'adj.', def: 'Costing little money', ru: 'дешёвый', example: 'This café is cheap and good.' },
      ],
      readingTitle: 'My Neighbourhood',
      readingText: `My name is Zarina. I live in a residential area in Almaty. My neighbourhood is called Alatau. I love living here.

My neighbourhood is quite large. There are many apartment buildings and a few private houses. Most buildings are modern, but there are some old ones too.

Near my house, there is a supermarket, two small shops, and a pharmacy. The supermarket is open until 10 PM. There is also a park with trees and benches. In summer, I always walk in the park in the evenings.

There is a school opposite my house. The school is quite big. Next to the school, there is a sports ground where children play football and basketball.

On the main street, there are several cafés and restaurants. There is a small café called "Morning" that I really like. They make excellent coffee and the prices are reasonable.

There isn't a hospital in my neighbourhood, but there is a clinic for basic medical care. The nearest hospital is about ten minutes by taxi.

My neighbourhood is safe, clean, and friendly. The neighbours all know each other. I am happy to live here.`,
      exercises: [
        {
          instruction: 'Complete with "there is", "there isn\'t", "there are", or "there aren\'t".',
          ruHint: 'Заполните пропуски: there is, there isn\'t, there are или there aren\'t.',
          items: [
            '_______ a supermarket near my house. (✓)',
            '_______ any hospitals in my street. (✗)',
            '_______ three parks in the city centre. (✓)',
            '_______ a cinema nearby. (✗)',
          ],
        },
        {
          instruction: 'Write directions from the school to the park. Use: turn left/right, go straight, next to, opposite.',
          ruHint: 'Опишите маршрут от школы до парка, используя данные выражения.',
          items: [
            'Start at the school.',
            'Turn _______ at the traffic lights.',
            'Go _______ for 200 metres.',
            'The park is _______ the supermarket.',
          ],
        },
      ],
      culturalNote: 'In English-speaking countries, when someone asks "How do I get to...?", it is polite to walk with them a short distance if it is complicated. In the UK, people often use landmarks rather than street names: "Turn left at the pub" or "It\'s opposite the big supermarket."',
      ruCulturalNote: 'В Великобритании при указании дороги часто ориентируются на достопримечательности, а не названия улиц: "поверните у паба" или "напротив большого магазина". Это отличие от казахстанской культуры, где принято называть конкретные адреса.',
    },
  ],
  glossaryExtras: [
    { en: 'paragraph', pos: 'n.', def: 'A section of text dealing with one topic', ru: 'абзац', example: 'Write a paragraph about your family.' },
    { en: 'sentence', pos: 'n.', def: 'A group of words expressing a complete idea', ru: 'предложение', example: 'This sentence has five words.' },
    { en: 'grammar', pos: 'n.', def: 'Rules that govern how a language works', ru: 'грамматика', example: 'Study grammar rules every day.' },
    { en: 'vocabulary', pos: 'n.', def: 'The set of words known by a person', ru: 'словарный запас', example: 'Build your vocabulary every day.' },
  ],
  resources: [
    'BBC Learning English (bbc.co.uk/learningenglish) — free A1 lessons and podcasts',
    'British Council LearnEnglish (learnenglish.britishcouncil.org) — interactive grammar and vocabulary',
    'Duolingo English Course — daily practice on mobile',
    'Oxford A1 Picture Dictionary — visual vocabulary builder',
    'KHAMADI ENGLISH Platform — vocabulary flashcards and quiz mode',
  ],
}

// ────────────────────────────────────────────────────────────────────────────
// B1 INTERMEDIATE (abbreviated — same structure, higher level content)
// ────────────────────────────────────────────────────────────────────────────

export const B1_INTERMEDIATE: LevelContent = {
  id: 'b1-intermediate',
  title: 'B1 Intermediate English',
  subtitle: 'Building Confidence in Communication',
  level: 'B1 Intermediate',
  cefr: 'CEFR B1',
  descriptionEn: 'An intermediate-level course that builds on foundational skills to develop fluency, accuracy, and a richer vocabulary for academic and professional contexts.',
  descriptionRu: 'Курс среднего уровня для студентов, которые уже знают основы английского и хотят выйти на уровень уверенного общения. Развивает беглость речи, грамматическую точность и академический словарный запас.',
  prefaceRu: `Поздравляем с достижением уровня B1!

Это означает, что вы уже можете понимать основную мысль в текстах на знакомые темы и справляться с большинством ситуаций, которые могут возникнуть в путешествии или работе. Теперь ваша задача — выйти на следующий уровень.

ЧТО ВЫ ОСВОИТЕ В ЭТОМ КУРСЕ

• Сложные грамматические конструкции: Present Perfect vs Past Simple, условные предложения, пассивный залог
• Академический и профессиональный словарный запас
• Навыки написания эссе и формальных писем
• Стратегии чтения аутентичных текстов
• Работа с идиомами и фразовыми глаголами

КАК РАБОТАТЬ С УЧЕБНИКОМ

Каждый модуль начинается с раздела "Lead-in", который активирует ваши предыдущие знания. Затем следует теоретический блок на английском языке с объяснениями на русском. Уделяйте особое внимание разделу "Common Errors" — это ошибки, которые делают большинство студентов на вашем уровне.`,
  units: [
    {
      number: 1,
      title: 'Past Experiences and Life Events',
      ruTitle: 'Прошлый опыт и события жизни',
      objectives: [
        'Contrast Present Perfect and Past Simple',
        'Describe life experiences using "ever" and "never"',
        'Talk about recent events and news',
        'Use time expressions correctly',
      ],
      grammar: [
        {
          title: 'Present Perfect vs Past Simple',
          explanation: 'The Present Perfect (have/has + past participle) links the past to the present — it is used when the exact time is unknown, unimportant, or the action still has a present connection. The Past Simple is used for completed actions at a specific past time.',
          ruExplanation: 'Present Perfect (have/has + причастие прошедшего времени) связывает прошлое с настоящим. Используется когда: (1) точное время неизвестно; (2) действие завершилось недавно; (3) результат важен сейчас. Past Simple — для завершённых действий в конкретный момент прошлого.',
          form: [
            'Present Perfect: Subject + have/has + Past Participle',
            'Past Simple:     Subject + Past Simple form (regular: +ed)',
            'PP time markers: ever, never, just, already, yet, recently, since, for',
            'PS time markers: yesterday, last week, in 2020, ago, when I was young',
          ],
          examples: [
            'I have visited London. (experience — no specific time)',
            'I visited London in 2019. (specific time)',
            'Have you ever eaten sushi? — Yes, I have. / No, I\'ve never eaten it.',
            'She has just finished her homework. (just = a moment ago)',
            'I haven\'t seen that film yet. (yet = up to now)',
          ],
          commonErrors: [
            '❌ Did you ever try sushi?      ✅ Have you ever tried sushi?',
            '❌ I have seen him yesterday.   ✅ I saw him yesterday.',
            '❌ She has went to the shops.   ✅ She has gone to the shops.',
          ],
        },
        {
          title: 'Irregular Verbs — Key Groups',
          explanation: 'Many common English verbs do not follow the regular -ed pattern in the past. They must be learned individually. Here are the most important groups.',
          ruExplanation: 'Многие распространённые глаголы образуют прошедшее время нестандартно — они называются неправильными глаголами (irregular verbs). Их нужно учить наизусть. Основные группы: одинаковые формы (put-put-put), изменяется гласная (sing-sang-sung), полностью разные (go-went-gone).',
          form: [
            'Group 1 — All forms same: cut/cut/cut, put/put/put, let/let/let',
            'Group 2 — A/U/U pattern: sing/sang/sung, ring/rang/rung, swim/swam/swum',
            'Group 3 — Irregular: go/went/gone, be/was-were/been, have/had/had',
            'Group 4 — Regular Past, irregular PP: pay/paid/paid, say/said/said',
          ],
          examples: [
            'I have never swum in the ocean. (swim → swam → swum)',
            'She went to Paris last summer. (go → went → gone)',
            'Have you written your essay yet? (write → wrote → written)',
          ],
        },
      ],
      vocabulary: [
        { en: 'experience', pos: 'n.', def: 'Knowledge or skill gained from doing something over time', ru: 'опыт', example: 'Do you have any work experience?' },
        { en: 'achievement', pos: 'n.', def: 'Something accomplished successfully, especially through effort', ru: 'достижение', example: 'Passing the exam was a great achievement.' },
        { en: 'opportunity', pos: 'n.', def: 'A chance to do something', ru: 'возможность/шанс', example: 'I had the opportunity to study abroad.' },
        { en: 'challenge', pos: 'n.', def: 'Something difficult that tests ability', ru: 'вызов/испытание', example: 'Learning a new language is a challenge.' },
        { en: 'goal', pos: 'n.', def: 'An aim or desired result', ru: 'цель', example: 'My goal is to reach B2 by December.' },
        { en: 'progress', pos: 'n.', def: 'Development or improvement over time', ru: 'прогресс/успех', example: 'You\'ve made great progress this month!' },
        { en: 'improve', pos: 'v.', def: 'To become or make better', ru: 'улучшаться/совершенствоваться', example: 'I want to improve my speaking skills.' },
        { en: 'develop', pos: 'v.', def: 'To grow or become more advanced', ru: 'развивать/развиваться', example: 'She has developed strong academic skills.' },
        { en: 'overcome', pos: 'v.', def: 'To succeed in dealing with a problem', ru: 'преодолевать', example: 'He overcame his fear of speaking in public.' },
        { en: 'achieve', pos: 'v.', def: 'To successfully reach a goal', ru: 'достигать', example: 'She achieved top marks in all exams.' },
        { en: 'succeed', pos: 'v.', def: 'To achieve what you attempted', ru: 'добиваться успеха', example: 'If you work hard, you will succeed.' },
        { en: 'fail', pos: 'v.', def: 'To not succeed in doing something', ru: 'провалиться/не сдать', example: 'Don\'t be afraid to fail — learn from it.' },
        { en: 'apply', pos: 'v.', def: 'To make a formal request for something', ru: 'подавать заявку/применять', example: 'I applied for a scholarship.' },
        { en: 'earn', pos: 'v.', def: 'To receive money for work done', ru: 'зарабатывать', example: 'She earns good money as an engineer.' },
        { en: 'save', pos: 'v.', def: 'To keep money for future use', ru: 'копить/сберегать', example: 'I save 20% of my salary every month.' },
        { en: 'spend', pos: 'v.', def: 'To use money or time', ru: 'тратить', example: 'I spend too much money on food.' },
        { en: 'decide', pos: 'v.', def: 'To make a choice after thinking', ru: 'решать', example: 'Have you decided which university to apply to?' },
        { en: 'choose', pos: 'v.', def: 'To select from a number of options', ru: 'выбирать', example: 'It\'s hard to choose between the two jobs.' },
        { en: 'realise', pos: 'v.', def: 'To become aware of a fact or situation', ru: 'понимать/осознавать', example: 'I realised I had forgotten my phone.' },
        { en: 'remember', pos: 'v.', def: 'To bring something back to mind', ru: 'помнить/вспоминать', example: 'Do you remember your first day at school?' },
        { en: 'forget', pos: 'v.', def: 'To fail to remember', ru: 'забывать', example: 'Don\'t forget to do your homework.' },
        { en: 'expect', pos: 'v.', def: 'To believe something will happen', ru: 'ожидать', example: 'I expect to get the results next week.' },
        { en: 'depend on', pos: 'v.phr.', def: 'To be determined or controlled by', ru: 'зависеть от', example: 'Success depends on hard work.' },
        { en: 'look forward to', pos: 'v.phr.', def: 'To feel excited about something in the future', ru: 'с нетерпением ждать', example: 'I\'m looking forward to my holiday.' },
        { en: 'give up', pos: 'v.phr.', def: 'To stop trying; to quit', ru: 'сдаваться/бросать', example: 'Never give up on your dreams.' },
        { en: 'carry on', pos: 'v.phr.', def: 'To continue doing something', ru: 'продолжать', example: 'Carry on — you\'re doing really well!' },
        { en: 'so far', pos: 'phrase', def: 'Until now; up to the present time', ru: 'пока что/до сих пор', example: 'So far, I have finished three units.' },
        { en: 'yet', pos: 'adv.', def: 'Up to now (in questions and negatives)', ru: 'ещё (в вопросах и отрицаниях)', example: 'Have you finished your essay yet?' },
        { en: 'already', pos: 'adv.', def: 'Before expected or sooner than planned', ru: 'уже', example: 'I have already submitted my assignment.' },
        { en: 'just', pos: 'adv.', def: 'A moment ago', ru: 'только что', example: 'She has just called — she\'s on her way.' },
        { en: 'recently', pos: 'adv.', def: 'Not long ago', ru: 'недавно', example: 'Have you seen any good films recently?' },
        { en: 'since', pos: 'prep./conj.', def: 'From a point in time until now', ru: 'с (какого-то момента)', example: 'I have studied English since 2020.' },
        { en: 'for', pos: 'prep.', def: 'During a period of time', ru: 'в течение (периода)', example: 'I have lived here for three years.' },
        { en: 'ago', pos: 'adv.', def: 'Before the present time', ru: 'назад (о прошлом)', example: 'I graduated two years ago.' },
        { en: 'last', pos: 'adj.', def: 'The most recent; the one before now', ru: 'прошлый/последний', example: 'Last year I went to Istanbul.' },
        { en: 'in + year', pos: 'phrase', def: 'At a specific year in the past', ru: 'в ... году', example: 'I was born in 2002.' },
        { en: 'when', pos: 'conj.', def: 'At the time that', ru: 'когда', example: 'When I was a child, I lived in Shymkent.' },
        { en: 'while', pos: 'conj.', def: 'During the time that; at the same time as', ru: 'пока/в то время как', example: 'I listened to music while I studied.' },
        { en: 'until', pos: 'prep./conj.', def: 'Up to the time that', ru: 'до (тех пор как)', example: 'I worked until midnight.' },
        { en: 'after', pos: 'prep./conj.', def: 'Following in time', ru: 'после', example: 'I felt better after I slept.' },
        { en: 'before', pos: 'prep./conj.', def: 'Earlier in time than', ru: 'до/раньше', example: 'Study grammar before the test.' },
        { en: 'suddenly', pos: 'adv.', def: 'Quickly and unexpectedly', ru: 'вдруг/неожиданно', example: 'Suddenly, it started raining.' },
        { en: 'eventually', pos: 'adv.', def: 'In the end, after a long time', ru: 'в конце концов', example: 'Eventually, I passed the exam.' },
        { en: 'finally', pos: 'adv.', def: 'At the end; after a long time', ru: 'наконец', example: 'We finally arrived at midnight.' },
        { en: 'immediately', pos: 'adv.', def: 'Without delay; at once', ru: 'немедленно/сразу', example: 'Please reply immediately.' },
        { en: 'gradually', pos: 'adv.', def: 'Slowly and steadily over time', ru: 'постепенно', example: 'My English improved gradually.' },
        { en: 'unfortunately', pos: 'adv.', def: 'Sadly; used to express regret', ru: 'к сожалению', example: 'Unfortunately, I missed the bus.' },
        { en: 'fortunately', pos: 'adv.', def: 'Luckily; by good chance', ru: 'к счастью', example: 'Fortunately, there was another bus.' },
        { en: 'although', pos: 'conj.', def: 'Despite the fact that; even though', ru: 'хотя/несмотря на то что', example: 'Although it was cold, we went out.' },
        { en: 'however', pos: 'adv./conj.', def: 'Despite this; on the other hand', ru: 'однако/тем не менее', example: 'It was expensive. However, it was worth it.' },
      ],
      readingTitle: 'My Journey to English Fluency',
      readingText: `I have been studying English for seven years. When I first started, I could barely say "hello." Now I can read novels, watch films, and hold conversations with native speakers. But the journey has not been easy.

I started learning English at secondary school in Karaganda. My first teacher, Mrs Akhmetova, was very strict but incredibly effective. She insisted that we speak only English in class, which was terrifying at first. I remember feeling embarrassed every time I made a mistake. However, she always encouraged us: "Mistakes are not failures — they are learning opportunities."

At university, I joined an English conversation club. This was a turning point. For the first time, I was practising English for fun — not just for exams. We discussed films, books, current events, and our personal experiences. My confidence improved dramatically.

Two years ago, I got the opportunity to attend an international conference in Almaty. Several presentations were in English. I was nervous, but I understood most of what the speakers said. When it was my turn to ask a question, I stood up and asked it in English. The presenter smiled and gave me a detailed answer. I felt incredibly proud.

I have not yet reached the level I want. My listening comprehension is still weak, and I sometimes struggle with complex academic texts. But I have made progress. I have set a goal to achieve C1 level by the end of next year.

If you are reading this and feeling discouraged, remember: every language learner has moments of doubt. What matters is that you carry on.`,
      exercises: [
        {
          instruction: 'Choose the correct tense: Present Perfect or Past Simple.',
          ruHint: 'Выберите правильное время: Present Perfect или Past Simple.',
          items: [
            'I _______ (visit) London three times.',
            'She _______ (arrive) at 9 o\'clock this morning.',
            '_______ you ever _______ (try) traditional Kazakh food?',
            'When _______ you _______ (start) learning English?',
            'He _______ just _______ (finish) his assignment.',
            'They _______ (not see) each other since school.',
            'We _______ (meet) at a conference in 2023.',
          ],
        },
        {
          instruction: 'Complete with since or for.',
          ruHint: 'Заполните пропуски: since или for.',
          items: [
            'I have studied English _______ 2019.',
            'She has worked here _______ three years.',
            'They haven\'t spoken _______ the argument.',
            'He has been ill _______ last Monday.',
          ],
        },
        {
          instruction: 'Write 5 sentences about your own life experiences using the Present Perfect. Use: ever, never, just, already, yet.',
          ruHint: 'Напишите 5 предложений о своём опыте, используя Present Perfect с: ever, never, just, already, yet.',
          items: [
            '(ever) Have you ever...?',
            '(never) I have never...',
            '(just) I have just...',
            '(already) I have already...',
            '(not...yet) I haven\'t...yet.',
          ],
        },
      ],
      culturalNote: 'British people often use understatement — saying less than they mean. "Not bad" usually means "very good." "I\'m quite tired" might mean "I\'m exhausted." "It was interesting" at a party could mean "it was terrible." Learning to read between the lines is an important skill for communicating with British English speakers.',
      ruCulturalNote: 'Британцы знамениты своим преуменьшением (understatement). "Not bad" = "очень хорошо". "I\'m a bit tired" = "я абсолютно измотан". "It was quite interesting" на вечеринке = "было скучно". Это важно знать, чтобы правильно понимать британцев.',
    },
  ],
  glossaryExtras: [
    { en: 'fluency', pos: 'n.', def: 'The ability to speak or write smoothly and accurately', ru: 'беглость речи', example: 'Her fluency in English is impressive.' },
    { en: 'accuracy', pos: 'n.', def: 'The quality of being correct and precise', ru: 'точность/правильность', example: 'Focus on accuracy before speed.' },
    { en: 'comprehension', pos: 'n.', def: 'The ability to understand', ru: 'понимание/компрехеншн', example: 'Reading comprehension skills are vital.' },
  ],
  resources: [
    'BBC News (bbc.com/news) — authentic B1-B2 reading and listening',
    'British Council LearnEnglish Grammar (learnenglish.britishcouncil.org/grammar)',
    'Cambridge Grammar in Use (Intermediate) — essential B1 grammar reference',
    'TED Talks with subtitles (ted.com) — listening practice',
    'KHAMADI ENGLISH Mock Exam — timed practice tests',
  ],
}

// Abbreviated stubs for other levels (same structure, different content depth)
export const A1_ELEMENTARY: LevelContent = { ...A1_BEGINNER, id: 'a1-elementary', title: 'A1 Elementary English', subtitle: 'Foundation Skills', level: 'A1 Elementary', cefr: 'CEFR A1+' }
export const A2_PRE_INTERMEDIATE: LevelContent = { ...B1_INTERMEDIATE, id: 'a2-pre-intermediate', title: 'A2 Pre-Intermediate English', subtitle: 'Expanding Your English', level: 'A2 Pre-Intermediate', cefr: 'CEFR A2' }
export const B2_UPPER_INTERMEDIATE: LevelContent = { ...B1_INTERMEDIATE, id: 'b2-upper-intermediate', title: 'B2 Upper-Intermediate English', subtitle: 'Towards Fluency', level: 'B2 Upper-Intermediate', cefr: 'CEFR B2' }
export const C1_ADVANCED: LevelContent = { ...B1_INTERMEDIATE, id: 'c1-advanced', title: 'C1 Advanced English', subtitle: 'Mastering Academic & Professional English', level: 'C1 Advanced', cefr: 'CEFR C1' }

export const ALL_GENERAL_ENGLISH_LEVELS: LevelContent[] = [
  A1_BEGINNER, A1_ELEMENTARY, A2_PRE_INTERMEDIATE, B1_INTERMEDIATE, B2_UPPER_INTERMEDIATE, C1_ADVANCED,
]
