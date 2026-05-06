/**
 * Seed missing quizzes for A1 Beginner — Module 4 "Day by Day".
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod4.ts
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

type MC = { id: number; type: 'multiple_choice'; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: 'A'|'B'|'C'|'D' }
type TF = { id: number; type: 'true_false'; question: string; correct_answer: 'true'|'false' }
type FB = { id: number; type: 'fill_blank'; question: string; correct_answer: string }
type Question = MC | TF | FB

const mc = (id: number, q: string, a: string, b: string, c: string, d: string, ans: 'A'|'B'|'C'|'D'): MC =>
  ({ id, type: 'multiple_choice', question: q, option_a: a, option_b: b, option_c: c, option_d: d, correct_answer: ans })
const tf = (id: number, q: string, ans: 'true'|'false'): TF =>
  ({ id, type: 'true_false', question: q, correct_answer: ans })
const fb = (id: number, q: string, ans: string): FB =>
  ({ id, type: 'fill_blank', question: q, correct_answer: ans })

// ── quiz data ─────────────────────────────────────────────────────────────────

const QUIZZES: Record<string, { pass_threshold: number; questions: Question[] }> = {

  // Lesson 1 — Daily Routine — Present Simple
  '11b4d9a1-1738-48fb-9f02-3fc8aa132016': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Choose the correct form: "She ___ to school every day."', 'go', 'goes', 'going', 'goed', 'B'),
      mc(2,  'Choose the correct form: "They ___ breakfast at 7 am."', 'eats', 'eating', 'eat', 'ate', 'C'),
      mc(3,  'Which sentence is in the Present Simple?', 'She is eating now.', 'She ate pizza.', 'She eats pizza every day.', 'She will eat pizza.', 'C'),
      mc(4,  'Complete: "He ___ up at 6 am." (wake)', 'wake', 'wakes', 'waking', 'waked', 'B'),
      mc(5,  'Which subject takes a verb with -s in Present Simple?', 'I', 'We', 'They', 'She', 'D'),
      mc(6,  'Choose the correct form: "I ___ my teeth twice a day."', 'brushes', 'brush', 'brushing', 'brushed', 'B'),
      mc(7,  'Which is a daily routine activity?', 'went to the cinema', 'wake up', 'have gone', 'will sleep', 'B'),
      mc(8,  'Complete: "She ___ (have) lunch at school."', 'have', 'haves', 'has', 'having', 'C'),
      mc(9,  'When do we use Present Simple?', 'For actions happening right now', 'For habits and repeated actions', 'For actions in the past', 'For future plans only', 'B'),
      mc(10, 'Choose the correct form: "My father ___ (work) in a bank."', 'work', 'working', 'works', 'worked', 'C'),
      tf(11, 'In Present Simple, we add -s to the verb for I, you, we, they.', 'false'),
      tf(12, '"She goes to school" is correct Present Simple.', 'true'),
      tf(13, 'Present Simple is used for routines and facts.', 'true'),
      fb(14, 'I ___ (wake) up at 7. She ___ (have) breakfast at 8.', 'wake, has'),
      fb(15, 'He ___ (go) to the gym every Monday. We ___ (study) English together.', 'goes, study'),
    ],
  },

  // Lesson 2 — How Often? — Adverbs of Frequency
  'a85e4c90-0187-459e-9e91-92c1c724d907': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Where does an adverb of frequency usually go?', 'At the start of the sentence', 'After the subject, before the main verb', 'At the end of the sentence', 'Before the subject', 'B'),
      mc(2,  'Which means "every single time, 100%"?', 'sometimes', 'often', 'always', 'rarely', 'C'),
      mc(3,  'Choose the correct sentence:', 'She goes always to the gym.', 'Always she goes to the gym.', 'She always goes to the gym.', 'She goes to always the gym.', 'C'),
      mc(4,  'Which adverb means "almost never"?', 'usually', 'often', 'rarely', 'always', 'C'),
      mc(5,  '"Never" means:', '100% of the time', '50% of the time', '0% of the time', '75% of the time', 'C'),
      mc(6,  'Choose the correct sentence with "to be":', 'He is always late.', 'He always is late.', 'Always he is late.', 'He late is always.', 'A'),
      mc(7,  'Which adverb of frequency is between "often" and "sometimes"?', 'always', 'usually', 'rarely', 'never', 'B'),
      mc(8,  'Complete: "I ___ watch TV in the evening." (most of the time, 75%)', 'always', 'never', 'usually', 'rarely', 'C'),
      mc(9,  'Put the adverb in the correct position: "She / eats / never / meat."', 'Never she eats meat.', 'She eats never meat.', 'She never eats meat.', 'She eats meat never.', 'C'),
      mc(10, 'Which question asks about frequency?', 'Where do you go?', 'How often do you exercise?', 'What do you eat?', 'Who do you like?', 'B'),
      tf(11, 'Adverbs of frequency go after the main verb in most sentences.', 'false'),
      tf(12, '"He is never late" is the correct position for "never" with the verb "to be".', 'true'),
      tf(13, '"Always" represents 100% frequency.', 'true'),
      fb(14, 'I ___ (always) brush my teeth. She ___ (never) drinks coffee.', 'always, never'),
      fb(15, 'How ___ do you go to the gym? I go ___ a week. (twice)', 'often, twice'),
    ],
  },

  // Lesson 3 — Ask Me Anything — Question Word Order
  '9b9cdf23-cc12-467f-832a-a7f8c50c8e9a': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the correct question word order?', 'You where do live?', 'Where you do live?', 'Where do you live?', 'Where live you do?', 'C'),
      mc(2,  'Which question word asks about a place?', 'When', 'Who', 'Where', 'Why', 'C'),
      mc(3,  'Complete the question: "___ do you go to school?" (time)', 'Where', 'What', 'When', 'Who', 'C'),
      mc(4,  'Complete: "___ does she work?" — "She works in a hospital."', 'When', 'Where', 'Why', 'Who', 'B'),
      mc(5,  'Which is the correct question?', 'What you do in the morning?', 'What do you do in the morning?', 'What you are do in the morning?', 'Do what you in the morning?', 'B'),
      mc(6,  '"Why" asks about:', 'time', 'place', 'reason', 'person', 'C'),
      mc(7,  'Complete: "___ is your favourite colour?" — "Blue."', 'Who', 'Where', 'What', 'When', 'C'),
      mc(8,  'What is the correct word order for questions with "how"?', 'How you are?', 'How are you?', 'Are how you?', 'You are how?', 'B'),
      mc(9,  '"Who" asks about:', 'a thing', 'a place', 'a time', 'a person', 'D'),
      mc(10, 'Complete: "___ do you like pizza? Because it\'s delicious."', 'What', 'Where', 'Why', 'Who', 'C'),
      tf(11, 'In English questions, the auxiliary verb (do/does) comes before the subject.', 'true'),
      tf(12, '"Where you live?" is a correct English question.', 'false'),
      tf(13, '"What" can be used to ask about things and actions.', 'true'),
      fb(14, '___ do you wake up? (time) ___ do you live? (place)', 'When, Where'),
      fb(15, '___ does he work? (place) ___ does she study English? (reason)', 'Where, Why'),
    ],
  },

  // Lesson 4 — Do or Does? — Present Simple Negative & Questions
  'c6ab164c-2716-42a6-95bb-f8b2c6c4cab4': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which subject uses "does" in questions?', 'I', 'You', 'They', 'He', 'D'),
      mc(2,  'Choose the correct negative: "She ___ like coffee."', "don't", "doesn't", "not", "isn't", 'B'),
      mc(3,  'Choose the correct question: "___ they play football?"', 'Does', 'Is', 'Do', 'Are', 'C'),
      mc(4,  'Complete: "___ he speak Spanish? No, he ___."', "Does / doesn't", "Do / don't", "Is / isn't", "Does / don't", 'A'),
      mc(5,  'Which sentence is correct?', "She don't eat meat.", "She doesn't eats meat.", "She doesn't eat meat.", "She not eat meat.", 'C'),
      mc(6,  'After "doesn\'t", the verb is:', 'infinitive with -s', 'base form (infinitive)', 'gerund (-ing)', 'past form', 'B'),
      mc(7,  'Choose the correct question:', 'Does she likes pizza?', 'Do she like pizza?', 'Does she like pizza?', 'She does like pizza?', 'C'),
      mc(8,  'Complete: "I ___ (not watch) TV in the morning."', "doesn't watch", "don't watching", "don't watch", "not watch", 'C'),
      mc(9,  'Short answer: "Do you like sushi?" — "Yes, ___."', 'Yes, I do.', 'Yes, I does.', 'Yes, I am.', 'Yes, I like.', 'A'),
      mc(10, 'Which sentence uses "do" correctly?', 'Do she work here?', 'Do he speak English?', 'Do they study hard?', 'Does they eat lunch?', 'C'),
      tf(11, '"Do" is used with he, she, it in questions.', 'false'),
      tf(12, '"She doesn\'t like tea" is the correct negative form.', 'true'),
      tf(13, 'After "doesn\'t", we use the base form of the verb (not the -s form).', 'true'),
      fb(14, '___ (do/does) you like music? Yes, I ___.', 'Do, do'),
      fb(15, 'She ___ (not / go) to the gym. He ___ (not / eat) fast food.', "doesn't go, doesn't eat"),
    ],
  },

  // Lesson 5 — My Week — Time Expressions
  '3b8796e3-cbd9-4037-9612-dd3bdffe47a0': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which preposition is used with days of the week?', 'in', 'at', 'on', 'by', 'C'),
      mc(2,  'Which preposition is used with months and years?', 'on', 'at', 'in', 'by', 'C'),
      mc(3,  'Which preposition is used with clock times?', 'in', 'on', 'at', 'by', 'C'),
      mc(4,  'Complete: "I have English class ___ Monday."', 'in', 'at', 'by', 'on', 'D'),
      mc(5,  'Complete: "She was born ___ 2005."', 'on', 'at', 'in', 'by', 'C'),
      mc(6,  'Complete: "The meeting is ___ 3 o\'clock."', 'in', 'on', 'by', 'at', 'D'),
      mc(7,  'Which is correct?', 'in the morning', 'on the morning', 'at the morning', 'by the morning', 'A'),
      mc(8,  'Complete: "We go to the gym ___ the weekend."', 'in', 'on', 'at', 'by', 'C'),
      mc(9,  'Which time expression means "two times a week"?', 'once a week', 'twice a week', 'every other day', 'three times a week', 'B'),
      mc(10, 'Complete: "I go jogging ___ every morning." (position in sentence)', '"Every morning I go jogging." is correct', '"I every morning go jogging." is correct', '"I go every morning jogging." is correct', 'Both A and C are correct', 'A'),
      tf(11, 'We say "on Monday" not "in Monday".', 'true'),
      tf(12, '"At night" and "in the night" are always interchangeable.', 'false'),
      tf(13, 'We say "in the morning", "in the afternoon", "in the evening".', 'true'),
      fb(14, 'I wake up ___ 7 am ___ the morning ___ weekdays.', 'at, in, on'),
      fb(15, 'She goes to the gym ___ (on/in/at) Tuesdays ___ (on/in/at) 6 pm.', 'on, at'),
    ],
  },

  // Lesson 7 — Conjunctions — And/But/Because/Or/So
  'ba9b1ab8-73a3-4ef9-8f5a-d3118bc1e417': {
    pass_threshold: 70,
    questions: [
      mc(1,  '"And" is used to:', 'show contrast', 'add information', 'give reason', 'show result', 'B'),
      mc(2,  '"But" is used to:', 'add similar information', 'give a reason', 'show contrast or opposite', 'show a result', 'C'),
      mc(3,  '"Because" answers which question?', 'When?', 'Where?', 'Why?', 'How?', 'C'),
      mc(4,  'Choose the correct sentence:', 'I like tea but coffee.', 'I like tea or I like coffee.', 'I like tea, but I don\'t like coffee.', 'I like tea because coffee.', 'C'),
      mc(5,  '"Or" is used to:', 'show contrast', 'give a choice between options', 'give a reason', 'add information', 'B'),
      mc(6,  '"So" shows:', 'a reason', 'a result or consequence', 'a contrast', 'a choice', 'B'),
      mc(7,  'Complete: "It was raining, ___ I took an umbrella."', 'but', 'because', 'or', 'so', 'D'),
      mc(8,  'Complete: "I was tired ___ I went to bed early."', 'or', 'but', 'because', 'and', 'C'),
      mc(9,  'Complete: "Do you want tea ___ coffee?"', 'and', 'but', 'so', 'or', 'D'),
      mc(10, 'Choose the correct sentence:', 'She studies hard but she fails.', 'She studies hard, but she always passes.', 'She studies hard so she fails.', 'She studies hard because she fails.', 'B'),
      tf(11, '"Because" is used to connect a cause and an effect.', 'true'),
      tf(12, '"But" and "and" have the same meaning.', 'false'),
      tf(13, '"So" introduces a result: "It was hot, so I opened the window."', 'true'),
      fb(14, 'I like pizza ___ pasta. I like tea ___ not coffee.', 'and, but'),
      fb(15, 'She studied hard ___ she passed the exam. He was hungry ___ he ate a sandwich.', 'so, so'),
    ],
  },

  // Lesson 8 — Transitive vs Intransitive Verbs
  '27a2624a-c358-411a-b2d7-56fe81d70f10': {
    pass_threshold: 70,
    questions: [
      mc(1,  'A transitive verb:', 'does not need an object', 'requires a direct object', 'is always in the past', 'cannot have a subject', 'B'),
      mc(2,  'An intransitive verb:', 'always needs a direct object', 'never takes a direct object', 'is used only in questions', 'is the same as a linking verb', 'B'),
      mc(3,  'Which verb is intransitive?', 'eat', 'read', 'sleep', 'buy', 'C'),
      mc(4,  'Which verb is transitive in this sentence: "She reads a book."', 'She', 'reads', 'a', 'book', 'B'),
      mc(5,  'Which sentence uses a transitive verb correctly?', 'He sleeps a dream.', 'She arrived the station.', 'They eat pizza.', 'He fell the ball.', 'C'),
      mc(6,  'Which verb is always intransitive?', 'write', 'arrive', 'give', 'buy', 'B'),
      mc(7,  'Can "run" be both transitive and intransitive?', 'No, only intransitive', 'No, only transitive', 'Yes, in different contexts', 'No, it has no object', 'C'),
      mc(8,  '"I smiled." — The verb "smiled" is:', 'transitive', 'intransitive', 'auxiliary', 'modal', 'B'),
      mc(9,  'Which sentence is correct?', 'She arrived to the airport.', 'She arrived at the airport.', 'She arrived the airport.', 'She arrived on airport.', 'B'),
      mc(10, '"He wrote a letter." — The direct object is:', 'He', 'wrote', 'a letter', 'There is no object', 'C'),
      tf(11, 'Intransitive verbs cannot be followed by a direct object.', 'true'),
      tf(12, '"She slept the bed" is a correct sentence.', 'false'),
      tf(13, 'Some verbs can be both transitive and intransitive depending on context.', 'true'),
      fb(14, '"I read ___" (transitive — needs object). "She ___ early." (intransitive verb: sleep)', 'a book / the newspaper, slept'),
      fb(15, 'Transitive: "He ___ (buy) a car." Intransitive: "They ___ (arrive) late."', 'bought, arrived'),
    ],
  },

  // Lesson 9 — Subject-Verb Agreement — The team is/are
  '60c0198c-80d6-4ee1-b0c4-b712bbeb2fb7': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Choose the correct verb: "The team ___ winning."', 'are', 'is', 'were', 'be', 'B'),
      mc(2,  'Choose the correct verb: "My friends ___ coming tonight."', 'is', 'comes', 'are', 'was', 'C'),
      mc(3,  'Complete: "Everyone ___ ready for the exam."', 'are', 'is', 'were', 'have', 'B'),
      mc(4,  'Choose the correct verb: "The news ___ shocking."', 'are', 'were', 'is', 'have', 'C'),
      mc(5,  'Complete: "Each student ___ a textbook."', 'have', 'are', 'has', 'were', 'C'),
      mc(6,  'Choose the correct verb: "The United States ___ a large country."', 'are', 'were', 'is', 'have', 'C'),
      mc(7,  'Complete: "My family ___ very supportive."', 'are / is (both possible)', 'were only', 'have', 'been', 'A'),
      mc(8,  'Complete: "Neither the students nor the teacher ___ ready."', 'are', 'were', 'is', 'have', 'C'),
      mc(9,  'Choose the correct verb: "The police ___ investigating."', 'is', 'was', 'are', 'has', 'C'),
      mc(10, 'Complete: "Every child ___ a right to education."', 'have', 'are', 'is', 'has', 'D'),
      tf(11, 'Collective nouns like "team" or "group" always take a plural verb in English.', 'false'),
      tf(12, '"Everyone" is treated as singular and takes a singular verb.', 'true'),
      tf(13, '"The news are good" is grammatically correct.', 'false'),
      fb(14, 'The committee ___ (meet) every Friday. Each person ___ (have) a role.', 'meets, has'),
      fb(15, 'My family ___ (be) very close. Everyone in the class ___ (know) the answer.', 'is / are, knows'),
    ],
  },

  // Lesson 10 — Module Review & Test (20 questions, threshold 80)
  'c0d67145-3ead-4b74-893f-a5f1da742ff0': {
    pass_threshold: 80,
    questions: [
      // Present Simple
      mc(1,  'Choose the correct form: "She ___ to work by bus."', 'go', 'goes', 'going', 'went', 'B'),
      mc(2,  'Present Simple is used for:', 'actions happening right now', 'habits and repeated actions', 'completed past actions', 'future plans only', 'B'),
      // Adverbs of Frequency
      mc(3,  'Choose the correct sentence:', 'She goes always to the gym.', 'Always she goes to the gym.', 'She always goes to the gym.', 'She goes to always the gym.', 'C'),
      mc(4,  '"Rarely" means:', '100%', '75%', '50%', 'almost never', 'D'),
      // Question Word Order
      mc(5,  'What is the correct question?', 'Where you do live?', 'Where do you live?', 'Do where you live?', 'You where live?', 'B'),
      mc(6,  '"Why" asks about:', 'time', 'place', 'reason', 'person', 'C'),
      // Do/Does Negatives & Questions
      mc(7,  'Choose the correct negative: "He ___ drink coffee."', "don't", "doesn't", "isn't", "not", 'B'),
      mc(8,  'Choose the correct question: "___ she speak French?"', 'Do', 'Is', 'Are', 'Does', 'D'),
      // Time Expressions
      mc(9,  'Complete: "I have class ___ Monday ___ 9 am."', 'in / at', 'on / at', 'at / in', 'on / in', 'B'),
      mc(10, 'Which is correct?', 'at the morning', 'on the morning', 'in the morning', 'by the morning', 'C'),
      // Conjunctions
      mc(11, 'Complete: "It was raining, ___ I stayed home."', 'but', 'because', 'or', 'so', 'D'),
      mc(12, 'Complete: "I like tea ___ not coffee."', 'and', 'so', 'but', 'because', 'C'),
      // Transitive vs Intransitive
      mc(13, 'Which verb is intransitive?', 'eat', 'buy', 'sleep', 'read', 'C'),
      mc(14, '"She reads a book." — The verb "reads" is:', 'intransitive', 'transitive', 'auxiliary', 'modal', 'B'),
      // Subject-Verb Agreement
      mc(15, 'Choose the correct verb: "Everyone ___ ready."', 'are', 'were', 'is', 'have', 'C'),
      mc(16, 'Choose the correct verb: "The news ___ good today."', 'are', 'were', 'is', 'have', 'C'),
      // True / False
      tf(17, '"She don\'t like coffee" is grammatically correct.', 'false'),
      tf(18, '"On Monday", "in the morning", "at 5 pm" — all prepositions are correct.', 'true'),
      // Fill blank
      fb(19, 'She ___ (always) wake up early. He ___ (never) eat breakfast.', 'always, never'),
      fb(20, '___ (do/does) they play tennis? No, they ___ (not).', "Do, don't"),
    ],
  },
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const MODULE_ID = '9cb2c934-cc2f-469a-b07e-debe8b65e709'

  console.log('🔍 Checking A1 Beginner — Module 4 "Day by Day" quiz status...\n')

  const { data: lessons, error: lessonsErr } = await supabase
    .from('english_lessons')
    .select('id, title, order_index')
    .eq('module_id', MODULE_ID)
    .order('order_index')

  if (lessonsErr) throw new Error('Failed to load lessons: ' + lessonsErr.message)

  const lessonIds = lessons!.map(l => l.id)

  const { data: existing, error: quizErr } = await supabase
    .from('english_quizzes')
    .select('lesson_id')
    .in('lesson_id', lessonIds)

  if (quizErr) throw new Error('Failed to load quizzes: ' + quizErr.message)

  const existingSet = new Set((existing ?? []).map(q => q.lesson_id))
  const missing = lessons!.filter(l => !existingSet.has(l.id))

  console.log(`📋 Total lessons: ${lessons!.length}`)
  console.log(`✅ Already have quiz: ${existingSet.size}`)
  console.log(`❌ Missing quiz: ${missing.length}\n`)

  if (missing.length === 0) {
    console.log('✅ All lessons already have quizzes. Nothing to do.')
    return
  }

  let created = 0

  for (const lesson of missing) {
    const quizData = QUIZZES[lesson.id]

    if (!quizData) {
      console.log(`⚠️  Skipped [${lesson.order_index}] ${lesson.title} — no quiz data defined`)
      continue
    }

    const { error: insertErr } = await supabase
      .from('english_quizzes')
      .insert({
        lesson_id:      lesson.id,
        questions:      quizData.questions,
        pass_threshold: quizData.pass_threshold,
      })

    if (insertErr) {
      console.error(`❌ Failed: "${lesson.title}": ${insertErr.message}`)
      continue
    }

    console.log(`✅ Вставлен квиз: ${lesson.title} — ${quizData.questions.length} вопросов`)
    created++
  }

  console.log(`\n✅ Готово: ${created} квизов создано для модуля 4 A1 Beginner`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })