/**
 * Seed missing quizzes for A1 Beginner — Module 1 "Starting Out".
 * Inserts into english_quizzes via Supabase service role client.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod1.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── load .env.local ───────────────────────────────────────────────────────────
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

// ── question types ────────────────────────────────────────────────────────────

type MultipleChoiceQ = {
  id: number
  type: 'multiple_choice'
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: 'A' | 'B' | 'C' | 'D'
}

type TrueFalseQ = {
  id: number
  type: 'true_false'
  question: string
  correct_answer: 'true' | 'false'
}

type FillBlankQ = {
  id: number
  type: 'fill_blank'
  question: string
  correct_answer: string
}

type Question = MultipleChoiceQ | TrueFalseQ | FillBlankQ

// ── quiz data ─────────────────────────────────────────────────────────────────

const QUIZZES: Record<string, { pass_threshold: number; questions: Question[] }> = {

  // Lesson 4 — One or Many? — Singular & Plural Nouns
  '09780d5c-7be1-4f3e-bb2a-f678c9d5292a': {
    pass_threshold: 70,
    questions: [
      { id: 1, type: 'multiple_choice', question: 'What is the plural of "book"?', option_a: 'book', option_b: 'books', option_c: 'bookes', option_d: 'booksies', correct_answer: 'B' },
      { id: 2, type: 'multiple_choice', question: 'What is the plural of "city"?', option_a: 'citys', option_b: 'cityes', option_c: 'cities', option_d: 'citeis', correct_answer: 'C' },
      { id: 3, type: 'multiple_choice', question: 'What is the plural of "child"?', option_a: 'childs', option_b: 'children', option_c: 'childes', option_d: 'childrens', correct_answer: 'B' },
      { id: 4, type: 'multiple_choice', question: 'Which word is already plural?', option_a: 'mouse', option_b: 'sheep', option_c: 'tooth', option_d: 'man', correct_answer: 'B' },
      { id: 5, type: 'multiple_choice', question: 'What is the plural of "box"?', option_a: 'boxs', option_b: 'box', option_c: 'boxes', option_d: 'boxies', correct_answer: 'C' },
      { id: 6, type: 'multiple_choice', question: 'What is the plural of "woman"?', option_a: 'womans', option_b: 'womens', option_c: 'women', option_d: 'womenss', correct_answer: 'C' },
      { id: 7, type: 'multiple_choice', question: 'Which rule is correct for words ending in -ch?', option_a: 'Add -s', option_b: 'Add -es', option_c: 'Add -ies', option_d: 'No change', correct_answer: 'B' },
      { id: 8, type: 'multiple_choice', question: 'What is the plural of "knife"?', option_a: 'knifes', option_b: 'knive', option_c: 'knives', option_d: 'knife', correct_answer: 'C' },
      { id: 9, type: 'multiple_choice', question: 'How many nouns are singular in this list: dog, cats, bus, trees?', option_a: 'One', option_b: 'Two', option_c: 'Three', option_d: 'Four', correct_answer: 'B' },
      { id: 10, type: 'multiple_choice', question: 'What is the plural of "foot"?', option_a: 'foots', option_b: 'feets', option_c: 'feet', option_d: 'foot', correct_answer: 'C' },
      { id: 11, type: 'true_false', question: '"Informations" is the correct plural of "information".', correct_answer: 'false' },
      { id: 12, type: 'true_false', question: 'The plural of "photo" is "photos".', correct_answer: 'true' },
      { id: 13, type: 'true_false', question: 'Words ending in -s, -x, -ch, -sh add -es to form the plural.', correct_answer: 'true' },
      { id: 14, type: 'fill_blank', question: 'There are three ___ (child) in the classroom.', correct_answer: 'children' },
      { id: 15, type: 'fill_blank', question: 'She bought two ___ (dress) for the party.', correct_answer: 'dresses' },
    ],
  },

  // Lesson 5 — Describing Things — Adjectives
  'cdb49a15-7ee4-45d0-8c81-467637ef0a26': {
    pass_threshold: 70,
    questions: [
      { id: 1, type: 'multiple_choice', question: 'Which word is an adjective?', option_a: 'run', option_b: 'quickly', option_c: 'beautiful', option_d: 'table', correct_answer: 'C' },
      { id: 2, type: 'multiple_choice', question: 'Where does an adjective go in English?', option_a: 'After the verb', option_b: 'Before the noun', option_c: 'After the noun', option_d: 'At the end of the sentence', correct_answer: 'B' },
      { id: 3, type: 'multiple_choice', question: 'Choose the correct sentence.', option_a: 'She has hair long.', option_b: 'She has a hair long.', option_c: 'She has long hair.', option_d: 'She has hair a long.', correct_answer: 'C' },
      { id: 4, type: 'multiple_choice', question: 'What is the opposite of "hot"?', option_a: 'warm', option_b: 'cold', option_c: 'cool', option_d: 'nice', correct_answer: 'B' },
      { id: 5, type: 'multiple_choice', question: 'Which sentence uses an adjective correctly?', option_a: 'The dog is bark loudly.', option_b: 'The dog is a big.', option_c: 'The big dog barks.', option_d: 'The dog bigs barks.', correct_answer: 'C' },
      { id: 6, type: 'multiple_choice', question: 'What is the opposite of "old"?', option_a: 'young', option_b: 'tall', option_c: 'thin', option_d: 'slow', correct_answer: 'A' },
      { id: 7, type: 'multiple_choice', question: 'Choose the adjective in: "It is a sunny day."', option_a: 'It', option_b: 'is', option_c: 'sunny', option_d: 'day', correct_answer: 'C' },
      { id: 8, type: 'multiple_choice', question: 'Which word describes colour?', option_a: 'fast', option_b: 'happy', option_c: 'blue', option_d: 'tired', correct_answer: 'C' },
      { id: 9, type: 'multiple_choice', question: 'Can adjectives describe feelings?', option_a: 'No, never', option_b: 'Yes, always', option_c: 'Only with verbs', option_d: 'Only in questions', correct_answer: 'B' },
      { id: 10, type: 'multiple_choice', question: 'Which is correct?', option_a: 'I have a car red.', option_b: 'I have a red car.', option_c: 'I have red a car.', option_d: 'I a have red car.', correct_answer: 'B' },
      { id: 11, type: 'true_false', question: 'Adjectives in English change form for singular and plural nouns (e.g. "a bigs dogs").', correct_answer: 'false' },
      { id: 12, type: 'true_false', question: '"Happy", "sad", and "tired" are all adjectives.', correct_answer: 'true' },
      { id: 13, type: 'true_false', question: 'In "She is a smart student", the word "smart" is an adjective.', correct_answer: 'true' },
      { id: 14, type: 'fill_blank', question: 'The ___ (big) elephant is in the river.', correct_answer: 'big' },
      { id: 15, type: 'fill_blank', question: 'It is a very ___ (cold) day today.', correct_answer: 'cold' },
    ],
  },

  // Lesson 14 — Module Review & Test (20 questions, threshold 80)
  '6c7fa8ac-9975-4a44-a286-b3181914d917': {
    pass_threshold: 80,
    questions: [
      // Verb To Be
      { id: 1, type: 'multiple_choice', question: 'Choose the correct form: "She ___ a teacher."', option_a: 'am', option_b: 'are', option_c: 'is', option_d: 'be', correct_answer: 'C' },
      { id: 2, type: 'multiple_choice', question: 'Which is the correct negative? "They ___ from Spain."', option_a: 'is not', option_b: 'are not', option_c: 'am not', option_d: 'not are', correct_answer: 'B' },
      // Articles
      { id: 3, type: 'multiple_choice', question: 'Choose the correct article: "___ apple a day keeps the doctor away."', option_a: 'A', option_b: 'An', option_c: 'The', option_d: 'No article', correct_answer: 'B' },
      { id: 4, type: 'multiple_choice', question: 'Which sentence uses "the" correctly?', option_a: 'I have the dog.', option_b: 'She is the teacher of our class.', option_c: 'He is a teacher of the class.', option_d: 'They eat the food every day.', correct_answer: 'B' },
      // Demonstratives
      { id: 5, type: 'multiple_choice', question: '"___ books over there are interesting." Choose the correct demonstrative.', option_a: 'This', option_b: 'That', option_c: 'Those', option_d: 'These', correct_answer: 'C' },
      { id: 6, type: 'multiple_choice', question: 'You are pointing at one object close to you. You say: "___ is my pen."', option_a: 'Those', option_b: 'That', option_c: 'These', option_d: 'This', correct_answer: 'D' },
      // Plurals
      { id: 7, type: 'multiple_choice', question: 'What is the plural of "tomato"?', option_a: 'tomatos', option_b: 'tomatoes', option_c: 'tomatos\'', option_d: 'tomatoies', correct_answer: 'B' },
      { id: 8, type: 'multiple_choice', question: 'What is the plural of "man"?', option_a: 'mans', option_b: 'mens', option_c: 'men', option_d: 'man', correct_answer: 'C' },
      // Adjectives
      { id: 9, type: 'multiple_choice', question: 'Choose the correct sentence.', option_a: 'He is a doctor good.', option_b: 'He is a good doctor.', option_c: 'He is good a doctor.', option_d: 'He a is good doctor.', correct_answer: 'B' },
      { id: 10, type: 'multiple_choice', question: 'Which word is NOT an adjective?', option_a: 'tall', option_b: 'quickly', option_c: 'happy', option_d: 'cold', correct_answer: 'B' },
      // Contractions
      { id: 11, type: 'multiple_choice', question: 'What is the contraction of "I am"?', option_a: "Iam", option_b: "I'm", option_c: "Im'", option_d: "I'am", correct_answer: 'B' },
      { id: 12, type: 'multiple_choice', question: 'What does "can\'t" stand for?', option_a: 'can it', option_b: 'cannot', option_c: 'can not be', option_d: 'could not', correct_answer: 'B' },
      // Word order
      { id: 13, type: 'multiple_choice', question: 'What is the correct SVO word order?', option_a: 'Loves she cats.', option_b: 'She cats loves.', option_c: 'She loves cats.', option_d: 'Cats loves she.', correct_answer: 'C' },
      { id: 14, type: 'multiple_choice', question: 'Identify the subject in: "The students study English."', option_a: 'study', option_b: 'English', option_c: 'The students', option_d: 'The', correct_answer: 'C' },
      // Verb To Have
      { id: 15, type: 'multiple_choice', question: 'Choose the correct form: "He ___ two sisters."', option_a: 'have', option_b: 'has', option_c: 'had', option_d: 'haves', correct_answer: 'B' },
      // True/False mix
      { id: 16, type: 'true_false', question: '"Childrens" is the correct plural of "child".', correct_answer: 'false' },
      { id: 17, type: 'true_false', question: '"I\'m" is the contraction of "I am".', correct_answer: 'true' },
      { id: 18, type: 'true_false', question: 'In English, adjectives change their form for plural nouns (e.g. "bigs dogs").', correct_answer: 'false' },
      // Fill blank
      { id: 19, type: 'fill_blank', question: '___ (This/These) is my book. ___ (That/Those) are their bags.', correct_answer: 'This, Those' },
      { id: 20, type: 'fill_blank', question: 'She ___ (have/has) a cat and two ___ (dog/dogs).', correct_answer: 'has, dogs' },
    ],
  },
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🔍 Checking A1 Beginner — Module 1 quiz status...\n')

  const COURSE_ID = 'a1000000-0000-0000-0000-000000000001'
  const MODULE_ID = '02ab47b9-f112-41e1-b033-b2ef2ad14ebd'

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
      console.log(`⚠️  Skipped [${lesson.order_index}] ${lesson.title} — no quiz data defined for ID ${lesson.id}`)
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
      console.error(`❌ Failed to insert quiz for "${lesson.title}": ${insertErr.message}`)
      continue
    }

    console.log(`✅ Вставлен квиз: ${lesson.title} — ${quizData.questions.length} вопросов`)
    created++
  }

  console.log(`\n✅ Готово: ${created} квизов создано для модуля 1 A1 Beginner`)
}

main().catch(err => {
  console.error('Fatal error:', err)
  process.exit(1)
})