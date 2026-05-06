/**
 * Seed missing quizzes for A1 Beginner — Module 5 "Here & Now".
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod5.ts
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

const QUIZZES: Record<string, { pass_threshold: number; questions: Question[] }> = {

  // Lesson 1 — What Are You Doing? — Present Continuous
  '79a240ad-86f0-4aad-8140-432f8d4f95f0': {
    pass_threshold: 70,
    questions: [
      mc(1,  'How do we form Present Continuous?', 'subject + verb-ed', 'subject + am/is/are + verb-ing', 'subject + will + verb', 'subject + has/have + verb-ing', 'B'),
      mc(2,  'Choose the correct sentence:', 'She is eat lunch.', 'She eating lunch.', 'She is eating lunch.', 'She are eating lunch.', 'C'),
      mc(3,  'Complete: "They ___ (play) football right now."', 'play', 'plays', 'are playing', 'is playing', 'C'),
      mc(4,  'What is the -ing form of "run"?', 'runing', 'running', 'runned', 'runs', 'B'),
      mc(5,  'Complete: "I ___ (not/watch) TV at the moment."', "don't watching", "am not watching", "isn't watching", "not watching", 'B'),
      mc(6,  'Which sentence is in Present Continuous?', 'She eats every day.', 'She ate pizza.', 'She is eating now.', 'She will eat later.', 'C'),
      mc(7,  'What is the -ing form of "sit"?', 'siting', 'sitting', 'sitted', 'sits', 'B'),
      mc(8,  'Complete the question: "___ he ___ (sleep)?"', 'Does / sleeps', 'Is / sleeping', 'Are / sleeping', 'Do / sleeping', 'B'),
      mc(9,  'Present Continuous is used for:', 'habits', 'actions happening right now', 'completed past actions', 'general facts', 'B'),
      mc(10, 'Choose the correct negative:', "She isn't sleep.", "She don't sleeping.", "She isn't sleeping.", "She not sleeping.", 'C'),
      tf(11, '"He is running" is correct Present Continuous.', 'true'),
      tf(12, 'We form Present Continuous with subject + verb + -ed.', 'false'),
      tf(13, '"Listen" becomes "listening" in the -ing form.', 'true'),
      fb(14, 'She ___ (write) an email right now. They ___ (not/talk) at the moment.', "is writing, aren't talking"),
      fb(15, '___ you ___ (work) from home today? Yes, I ___.', 'Are, working, am'),
    ],
  },

  // Lesson 2 — Now vs Always — Present Simple vs Continuous
  'bd0729a7-2489-4016-b1f9-e3c6311e12b1': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which sentence describes a habit?', 'She is cooking now.', 'She cooks every day.', 'She was cooking.', 'She will cook.', 'B'),
      mc(2,  'Which sentence describes an action happening now?', 'He plays guitar.', 'He played guitar.', 'He is playing guitar.', 'He will play guitar.', 'C'),
      mc(3,  'Choose the correct tense: "I ___ (read) a book right now."', 'read', 'reads', 'am reading', 'is reading', 'C'),
      mc(4,  'Choose the correct tense: "She ___ (go) to school every day."', 'is going', 'are going', 'goes', 'went', 'C'),
      mc(5,  'Which word signals Present Continuous?', 'always', 'usually', 'at the moment', 'every day', 'C'),
      mc(6,  'Which word signals Present Simple?', 'now', 'right now', 'at the moment', 'often', 'D'),
      mc(7,  'Choose the correct sentence:', 'I am usually going to work by bus.', 'I usually go to work by bus.', 'I am usually go to work by bus.', 'I usually am going to work by bus.', 'B'),
      mc(8,  '"Look! The baby ___." Choose the correct tense.', 'smiles', 'smiled', 'is smiling', 'was smiling', 'C'),
      mc(9,  'Which verb is NOT normally used in Present Continuous?', 'run', 'eat', 'know', 'write', 'C'),
      mc(10, 'Choose the correct sentence:', 'He is knowing the answer.', 'He knows the answer.', 'He knowing the answer.', 'He know the answer now.', 'B'),
      tf(11, '"Always", "usually", and "every day" are signals for Present Simple.', 'true'),
      tf(12, '"Now" and "at the moment" are signals for Present Continuous.', 'true'),
      tf(13, '"I am understanding" is correct English.', 'false'),
      fb(14, 'I ___ (read) every night. (habit) Right now I ___ (read) a novel. (now)', 'read, am reading'),
      fb(15, 'She ___ (work) at a hospital. (fact) Today she ___ (not/work) — it\'s a holiday.', "works, isn't working"),
    ],
  },

  // Lesson 3 — Commands & Instructions — Imperative
  '29795951-4cc4-413b-b0ce-88ad1772e239': {
    pass_threshold: 70,
    questions: [
      mc(1,  'How do we form a positive imperative?', 'You + verb', 'Base form of the verb (no subject)', 'Subject + verb-ing', 'Do + subject + verb', 'B'),
      mc(2,  'Which sentence is an imperative?', 'She opens the door.', 'Open the door!', 'She is opening the door.', 'Does she open the door?', 'B'),
      mc(3,  'How do we form a negative imperative?', "No + verb", "Don't + base verb", "Not + verb", "Doesn't + verb", 'B'),
      mc(4,  'Choose the correct imperative:', 'You sit down please.', 'Sits down please.', 'Sit down, please.', 'Sitting down please.', 'C'),
      mc(5,  'Choose the correct negative imperative:', "Don't run in the corridor!", "Not run in the corridor!", "No running the corridor!", "Doesn't run in the corridor!", 'A'),
      mc(6,  'Imperatives are used for:', 'describing past events', 'giving instructions, orders, or advice', 'talking about future plans', 'expressing habits', 'B'),
      mc(7,  'Which is a polite imperative?', 'Give me that!', 'Don\'t speak!', 'Please close the window.', 'Stop now!', 'C'),
      mc(8,  'Complete: "___ quiet in the library." (be)', 'Being', 'Are', 'Be', 'Is', 'C'),
      mc(9,  'Complete: "___ (not/touch) the hot plate!"', "Don't touch", "Not touch", "No touch", "Doesn't touch", 'A'),
      mc(10, 'Which sentence gives a recipe instruction?', 'She added the eggs.', 'Add two eggs and mix well.', 'She is adding the eggs.', 'Will you add the eggs?', 'B'),
      tf(11, 'The subject "you" is always stated in an imperative sentence.', 'false'),
      tf(12, '"Don\'t be late!" is a correct negative imperative.', 'true'),
      tf(13, 'Imperatives can be used to give directions (e.g. "Turn left at the traffic lights.").', 'true'),
      fb(14, '___ (open) your books. ___ (not/talk) during the exam.', "Open, Don't talk"),
      fb(15, '___ (turn) right at the corner. ___ (not/forget) your homework.', "Turn, Don't forget"),
    ],
  },

  // Lesson 4 — General & Special Questions — Question Types
  '84082d6a-a9a4-4a15-aff6-3ed1f4c53043': {
    pass_threshold: 70,
    questions: [
      mc(1,  'A "general question" (Yes/No question) begins with:', 'What', 'Where', 'An auxiliary verb', 'A noun', 'C'),
      mc(2,  'A "special question" (Wh- question) begins with:', 'A noun', 'A question word (What, Where, When…)', 'An auxiliary verb only', 'A subject', 'B'),
      mc(3,  'Which is a Yes/No question?', 'What do you do?', 'Where does she live?', 'Do you speak English?', 'Why are they late?', 'C'),
      mc(4,  'Which is a Wh- question?', 'Is she a teacher?', 'Do they play tennis?', 'Are you happy?', 'What time does the lesson start?', 'D'),
      mc(5,  'Answer to "Do you like pizza?" is:', 'Yes, I do. / No, I don\'t.', 'Yes, I am. / No, I\'m not.', 'Yes, pizza. / No, pizza.', 'Yes, I like. / No, not like.', 'A'),
      mc(6,  'Complete the Wh- question: "___ does she live?" — "In Almaty."', 'When', 'What', 'Where', 'Who', 'C'),
      mc(7,  'Complete the Yes/No question: "___ they studying now?"', 'Do', 'Does', 'Are', 'Is', 'C'),
      mc(8,  'Which question asks about time?', 'Where do you work?', 'When does the film start?', 'What is your name?', 'Who is your teacher?', 'B'),
      mc(9,  'Complete: "___ does he do?" — "He\'s a doctor."', 'Where', 'When', 'What', 'Who', 'C'),
      mc(10, 'What is the correct answer to "Are you tired?"', 'Yes, I am.', 'Yes, I do.', 'Yes, I can.', 'Yes, I have.', 'A'),
      tf(11, 'Yes/No questions can be answered with "yes" or "no".', 'true'),
      tf(12, '"What do you live?" is a correct Wh- question.', 'false'),
      tf(13, 'Wh- questions need a question word at the beginning.', 'true'),
      fb(14, '___ (yes/no question) you speak Russian? ___ (wh-) do you come from?', 'Do, Where'),
      fb(15, '___ is your name? (what) ___ do you study? (where)', 'What, Where'),
    ],
  },

  // Lesson 5 — Around the House — Grammar Review
  '1c3471a4-b63e-4828-8eb6-302cd399c486': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which room do you sleep in?', 'kitchen', 'bathroom', 'bedroom', 'living room', 'C'),
      mc(2,  'Complete: "The sofa is ___ the living room."', 'on', 'at', 'in', 'by', 'C'),
      mc(3,  'Which item is found in a kitchen?', 'sofa', 'fridge', 'wardrobe', 'bathtub', 'B'),
      mc(4,  'Complete: "There ___ two chairs and a table in the kitchen."', 'is', 'am', 'are', 'be', 'C'),
      mc(5,  'Choose the correct sentence:', 'The books is on the shelf.', 'The books are on the shelf.', 'The books are at the shelf.', 'The books is at shelf.', 'B'),
      mc(6,  'Which preposition do we use for "on top of a surface"?', 'in', 'at', 'on', 'under', 'C'),
      mc(7,  'Complete: "My bedroom is ___ the bathroom." (next door)', 'in', 'on', 'between', 'next to', 'D'),
      mc(8,  'Which item is used for sleeping?', 'desk', 'bed', 'sink', 'oven', 'B'),
      mc(9,  'Complete: "___ a lamp on the table." (there is / there are)', 'There are', 'There is', 'There am', 'There be', 'B'),
      mc(10, 'Choose the correct question: "___ there a garden?"', 'Are', 'Have', 'Is', 'Do', 'C'),
      tf(11, '"The television is in the living room" is a correct sentence.', 'true'),
      tf(12, '"There is many chairs" is grammatically correct.', 'false'),
      tf(13, 'A "wardrobe" is used for storing clothes.', 'true'),
      fb(14, 'The lamp is ___ (on/in) the table. The cat is ___ (under/on) the sofa.', 'on, under'),
      fb(15, '___ (there is/there are) a fridge in the kitchen. ___ (there is/there are) four rooms in the flat.', 'There is, There are'),
    ],
  },

  // Lesson 6 — Exclamations — What a day! How nice!
  '0c10ac5d-64c9-4a00-9641-1fa3ed62baa6': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Complete the exclamation: "___ a beautiful day!"', 'How', 'What', 'So', 'Very', 'B'),
      mc(2,  'Complete the exclamation: "___ cold it is!"', 'What', 'Such', 'How', 'So', 'C'),
      mc(3,  'Which is correct?', 'What beautiful house!', 'What a beautiful house!', 'How a beautiful house!', 'What beautiful a house!', 'B'),
      mc(4,  '"How" in exclamations is followed by:', 'a noun', 'an adjective (or adverb)', 'a verb', 'an article', 'B'),
      mc(5,  'Complete: "___ tall he is!"', 'What', 'What a', 'How', 'Such', 'C'),
      mc(6,  'Choose the correct exclamation:', 'What a lovely weather!', 'What lovely weather!', 'How a lovely weather!', 'Such lovely a weather!', 'B'),
      mc(7,  '"What" in exclamations with singular countable nouns is followed by:', 'adjective + noun', 'a/an + adjective + noun', 'adjective only', 'noun only', 'B'),
      mc(8,  'Complete: "___ delicious food!"', 'How', 'How a', 'What a', 'What', 'D'),
      mc(9,  'Choose the correct exclamation for "The film is very interesting."', 'How interesting film!', 'What an interesting film!', 'What interesting a film!', 'How a interesting film!', 'B'),
      mc(10, 'Complete: "___ kind she is!"', 'What', 'What a', 'How', 'Such a', 'C'),
      tf(11, '"What a" is used before singular countable nouns in exclamations.', 'true'),
      tf(12, '"How" in exclamations is always followed by "a/an".', 'false'),
      tf(13, '"What beautiful music!" is correct because "music" is uncountable.', 'true'),
      fb(14, '___ (what/how) a great idea! ___ (what/how) clever you are!', 'What, How'),
      fb(15, '___ exciting news! ___ a long journey it was!', 'What, What'),
    ],
  },

  // Lesson 7 — Predicate Noun — She became a doctor
  'b740cbf4-ea1b-44ce-befe-6474ef131d64': {
    pass_threshold: 70,
    questions: [
      mc(1,  'A predicate noun (subject complement) follows:', 'an action verb', 'a linking verb', 'an adverb', 'a preposition', 'B'),
      mc(2,  'Which verb is a linking verb?', 'run', 'eat', 'become', 'write', 'C'),
      mc(3,  'Identify the predicate noun: "She is a teacher."', 'She', 'is', 'a', 'teacher', 'D'),
      mc(4,  'Choose the correct sentence:', 'He became successfully.', 'He became a success.', 'He became success.', 'He became to a success.', 'B'),
      mc(5,  'Which is NOT a linking verb?', 'seem', 'feel', 'look', 'run', 'D'),
      mc(6,  'Complete: "The soup ___ delicious." (taste)', 'tastes', 'taste', 'is taste', 'tasting', 'A'),
      mc(7,  'Identify the predicate noun: "My father is an engineer."', 'My', 'father', 'is', 'engineer', 'D'),
      mc(8,  'Complete: "She ___ a famous singer." (become, past)', 'become', 'becomes', 'became', 'is become', 'C'),
      mc(9,  'Which sentence has a predicate noun?', 'She runs fast.', 'She is a doctor.', 'She runs to school.', 'She eats quickly.', 'B'),
      mc(10, '"The sky looks ___." Choose the correct word to follow a linking verb.', 'beautifully', 'a blue', 'blue', 'bluely', 'C'),
      tf(11, 'A predicate noun renames or identifies the subject.', 'true'),
      tf(12, '"She became tired" contains a predicate noun.', 'false'),
      tf(13, 'Linking verbs connect the subject to a noun or adjective that describes it.', 'true'),
      fb(14, 'He ___ (become, past) a doctor. She ___ (be, present) a great teacher.', 'became, is'),
      fb(15, 'The food ___ (smell) amazing. He ___ (seem) a kind person.', 'smells, seems'),
    ],
  },

  // Lesson 8 — Module Review & Test (20 questions, threshold 80)
  '543c4b35-d016-4311-9a00-864208340611': {
    pass_threshold: 80,
    questions: [
      // Present Continuous
      mc(1,  'Choose the correct Present Continuous: "She ___ (read) right now."', 'read', 'reads', 'is reading', 'are reading', 'C'),
      mc(2,  'How do we form Present Continuous?', 'subject + verb-ed', 'subject + am/is/are + verb-ing', 'subject + will + verb', 'subject + verb-s', 'B'),
      // Simple vs Continuous
      mc(3,  'Choose the correct tense: "He ___ (study) every evening." (habit)', 'is studying', 'are studying', 'studies', 'studied', 'C'),
      mc(4,  'Which word signals Present Continuous?', 'always', 'usually', 'right now', 'every day', 'C'),
      // Imperative
      mc(5,  'Which is a correct negative imperative?', "Don't run!", "Not run!", "No run!", "Doesn't run!", 'A'),
      mc(6,  'The imperative "Open the window!" — what is the subject?', 'Open', 'window', 'You (implied)', 'There is no subject', 'C'),
      // Question Types
      mc(7,  'Which is a Yes/No question?', 'Where do you live?', 'Are you a student?', 'What do you do?', 'Why are you here?', 'B'),
      mc(8,  'Complete: "___ does she work?" — "In a hospital."', 'When', 'What', 'Where', 'Who', 'C'),
      // Around the House
      mc(9,  'Complete: "There ___ a sofa in the living room."', 'are', 'am', 'is', 'be', 'C'),
      mc(10, 'Which preposition fits: "The lamp is ___ the table."?', 'in', 'at', 'on', 'by', 'C'),
      // Exclamations
      mc(11, 'Complete: "___ a wonderful idea!"', 'How', 'So', 'What', 'Very', 'C'),
      mc(12, 'Complete: "___ clever she is!"', 'What', 'What a', 'How', 'Such', 'C'),
      // Predicate Noun
      mc(13, 'Identify the predicate noun: "He is a pilot."', 'He', 'is', 'a', 'pilot', 'D'),
      mc(14, 'Which verb is a linking verb?', 'jump', 'seem', 'write', 'drive', 'B'),
      // Mixed
      mc(15, 'Choose the correct sentence:', 'She is knowing the answer.', 'She knows the answer.', 'She knowing the answer.', 'She know the answer now.', 'B'),
      // True / False
      tf(16, '"Don\'t be late!" is a correct negative imperative.', 'true'),
      tf(17, '"Now" and "at the moment" are signals for Present Simple.', 'false'),
      tf(18, '"What a" is used before singular countable nouns in exclamations.', 'true'),
      // Fill blank
      fb(19, 'Look! She ___ (dance). She ___ (dance) every Saturday. (habit)', 'is dancing, dances'),
      fb(20, '___ (what/how) a great film! ___ (what/how) exciting it was!', 'What, How'),
    ],
  },
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const MODULE_ID = '14d391ae-3ca5-44ea-9b6f-9a2a9087b611'

  console.log('🔍 Checking A1 Beginner — Module 5 "Here & Now" quiz status...\n')

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

  console.log(`\n✅ Готово: ${created} квизов создано для модуля 5 A1 Beginner`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })
