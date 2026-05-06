/**
 * Seed missing quizzes for A1 Beginner — Module 3 "Capable & Confident".
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/seed-quizzes-a1-mod3.ts
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

type MC = { id: number; type: 'multiple_choice'; question: string; option_a: string; option_b: string; option_c: string; option_d: string; correct_answer: 'A' | 'B' | 'C' | 'D' }
type TF = { id: number; type: 'true_false'; question: string; correct_answer: 'true' | 'false' }
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

  // Lesson 1 — Jobs & Professions — Modal Verb Can
  '83fa0688-a370-44ab-bfa5-8eac1ed99f01': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Choose the correct sentence:', 'She can sings.', 'She can sing.', 'She cans sing.', 'She can to sing.', 'B'),
      mc(2,  'What is the question form of "He can drive"?', 'Can he drives?', 'Does he can drive?', 'Can he drive?', 'He can drives?', 'C'),
      mc(3,  'Which job works in a hospital?', 'engineer', 'pilot', 'doctor', 'chef', 'C'),
      mc(4,  'Complete: "___ you speak English?" (question)', 'Do', 'Are', 'Can', 'Is', 'C'),
      mc(5,  'After "can" the verb is always:', 'infinitive with to', 'base form (infinitive)', 'gerund (-ing)', 'past tense', 'B'),
      mc(6,  'A person who cooks food in a restaurant is a:', 'pilot', 'chef', 'nurse', 'lawyer', 'B'),
      mc(7,  'Choose the correct sentence:', 'I can to play guitar.', 'I can plays guitar.', 'I can play guitar.', 'I cans play guitar.', 'C'),
      mc(8,  'What is the short answer to "Can she swim?" (affirmative)?', 'Yes, she cans.', 'Yes, she can.', 'Yes, she does.', 'Yes, she is.', 'B'),
      mc(9,  'A person who flies a plane is a:', 'captain', 'driver', 'pilot', 'sailor', 'C'),
      mc(10, '"Can" is used to express:', 'obligation', 'ability or possibility', 'past action', 'future plan', 'B'),
      tf(11, '"She can sings" is grammatically correct.', 'false'),
      tf(12, '"Can" does not change form for he/she/it (e.g. She can, not She cans).', 'true'),
      tf(13, 'A lawyer works in a court or law firm.', 'true'),
      fb(14, 'I ___ (can) speak three languages. She ___ (can, negative) drive a car.', "can, can't"),
      fb(15, '___ (can) he play the piano? Yes, he ___.', "Can, can"),
    ],
  },

  // Lesson 2 — Hobbies — Like/Love/Hate + Doing
  '08988fff-28de-4537-bfc4-9a429374317c': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Choose the correct form: "She likes ___." (swim)', 'swim', 'to swim / swimming', 'swims', 'swam', 'B'),
      mc(2,  'Which sentence is correct?', 'He loves to play football.', 'He loves play football.', 'He loves played football.', 'He love playing football.', 'A'),
      mc(3,  'What is the gerund of "read"?', 'reads', 'readed', 'reading', 'to read', 'C'),
      mc(4,  'Complete: "I hate ___ early." (wake up)', 'wake up', 'waking up', 'waked up', 'to waking up', 'B'),
      mc(5,  'Which is a hobby?', 'homework', 'painting', 'sleeping at work', 'driving to school', 'B'),
      mc(6,  'Choose the correct sentence:', 'They enjoy to dance.', 'They enjoy dancing.', 'They enjoy dances.', 'They enjoy dance.', 'B'),
      mc(7,  '"Don\'t mind" means:', 'hate something a lot', 'have no strong feeling about something', 'love something very much', 'refuse to do something', 'B'),
      mc(8,  'Complete: "He doesn\'t like ___ (cook)."', 'cook', 'cooked', 'cooks', 'cooking', 'D'),
      mc(9,  'Which verb is followed by -ing or to-infinitive?', 'must', 'should', 'like', 'will', 'C'),
      mc(10, 'Complete: "We love ___ (travel) to new countries."', 'travel', 'travels', 'traveled', 'travelling', 'D'),
      tf(11, 'After "enjoy" we always use the gerund (-ing form).', 'true'),
      tf(12, '"She likes to dance" and "She likes dancing" are both correct.', 'true'),
      tf(13, '"I hate to wake up early" is grammatically incorrect.', 'false'),
      fb(14, 'He loves ___ (play) chess. She hates ___ (do) the dishes.', 'playing, doing'),
      fb(15, 'Do you like ___ (read) books? What are your ___? (hobby)', 'reading, hobbies'),
    ],
  },

  // Lesson 3 — My Skills — Can vs Can't
  'a2c93dbd-3089-4d28-930d-990c5749e18b': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the negative of "can"?', "cann't", "can't / cannot", "can not to", "cans't", 'B'),
      mc(2,  'Choose the correct sentence:', "I can't to swim.", "I cannot swimming.", "I can't swim.", "I cants swim.", 'C'),
      mc(3,  '"Can" and "cannot" — which is the full form?', 'can', 'cannot', "can't", 'canned', 'B'),
      mc(4,  'What does "I can\'t drive" mean?', 'I am able to drive.', 'I am not able to drive.', 'I will drive.', 'I drove before.', 'B'),
      mc(5,  'Choose the correct question and short answer:', 'Can you cook? — Yes, I do.', 'Can you cook? — Yes, I can.', 'Do you can cook? — Yes, I can.', 'Are you can cook? — Yes, I am.', 'B'),
      mc(6,  '"She can speak French but she ___ speak Arabic." (negative)', "can", "cans't", "can't", "cannot to", 'C'),
      mc(7,  'Which sentence describes a skill?', 'I go to school.', 'I can play the violin.', 'I have a sister.', 'I like coffee.', 'B'),
      mc(8,  'Complete: "___ they understand the instructions? No, they ___ (negative)."', "Can / can't", "Are / aren't", "Do / don't", "Have / haven't", 'A'),
      mc(9,  'What is another way to write "can\'t"?', 'can not be', 'cannot', 'cann not', 'can be not', 'B'),
      mc(10, 'Choose the correct sentence:', 'He can swims very fast.', 'He can swim very fast.', 'He can to swim very fast.', 'He cans swim very fast.', 'B'),
      tf(11, '"Cannot" and "can\'t" have the same meaning.', 'true'),
      tf(12, '"Can" changes to "cans" for he/she/it.', 'false'),
      tf(13, 'We use "can" to talk about present ability (skills we have now).', 'true'),
      fb(14, 'I ___ (can) ride a bike but I ___ (negative) ride a horse.', "can, can't"),
      fb(15, '___ she play the guitar? No, she ___ (negative), but she ___ (positive) sing.', "Can, can't, can"),
    ],
  },

  // Lesson 4 — Sports & Activities — Irregular Verbs intro
  '673c3e8f-6207-4d7f-9213-77c73963c0d1': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the past tense of "go"?', 'goed', 'gone', 'went', 'goes', 'C'),
      mc(2,  'What is the past tense of "run"?', 'runned', 'ran', 'raned', 'runs', 'B'),
      mc(3,  'What is the past tense of "do"?', 'doed', 'did', 'done', 'does', 'B'),
      mc(4,  'Which is an irregular verb?', 'play', 'walk', 'have', 'jump', 'C'),
      mc(5,  'What is the past tense of "see"?', 'seed', 'seen', 'saw', 'sees', 'C'),
      mc(6,  'Which sport uses a racket?', 'football', 'swimming', 'tennis', 'cycling', 'C'),
      mc(7,  'What is the past tense of "come"?', 'comed', 'came', 'come', 'cames', 'B'),
      mc(8,  'Which sentence is correct?', 'She goed to the gym.', 'She went to the gym.', 'She go to the gym.', 'She gone to the gym.', 'B'),
      mc(9,  'What is the past tense of "make"?', 'maked', 'makes', 'made', 'maden', 'C'),
      mc(10, 'Which is a water sport?', 'golf', 'boxing', 'swimming', 'cycling', 'C'),
      tf(11, 'Irregular verbs do not follow the regular -ed pattern in the past tense.', 'true'),
      tf(12, 'The past tense of "play" is "played" — this is a regular verb.', 'true'),
      tf(13, 'The past tense of "go" is "goed".', 'false'),
      fb(14, 'go → ___, run → ___, see → ___.', 'went, ran, saw'),
      fb(15, 'Yesterday she ___ (go) for a run and ___ (do) yoga in the park.', 'went, did'),
    ],
  },

  // Lesson 5 — Free Time — Object Pronouns
  '579ec0f3-f636-4857-87fc-807cfb2f18ee': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Replace "the book" with an object pronoun: "I read the book."', 'I read he.', 'I read it.', 'I read its.', 'I read they.', 'B'),
      mc(2,  'What is the object pronoun for "I"?', 'my', 'me', 'mine', 'myself', 'B'),
      mc(3,  'What is the object pronoun for "they"?', 'their', 'theirs', 'them', 'themselves', 'C'),
      mc(4,  'Choose the correct sentence:', 'She called he.', 'She called him.', 'She called his.', 'She called himself.', 'B'),
      mc(5,  'What is the object pronoun for "she"?', 'hers', 'her', 'herself', 'she', 'B'),
      mc(6,  'Complete: "Can you help ___?" (we)', 'we', 'our', 'us', 'ours', 'C'),
      mc(7,  'Replace "my sister" with an object pronoun: "I see my sister."', 'I see she.', 'I see her.', 'I see hers.', 'I see herself.', 'B'),
      mc(8,  'What is the object pronoun for "you" (singular)?', 'your', 'yourself', 'you', 'yours', 'C'),
      mc(9,  'Complete: "The teacher gave ___ a book." (he)', 'his', 'he', 'him', 'himself', 'C'),
      mc(10, 'Which sentence uses an object pronoun correctly?', 'He saw she at the park.', 'He saw her at the park.', 'He saw hers at the park.', 'He saw herself at the park.', 'B'),
      tf(11, 'Object pronouns replace the object of a sentence, not the subject.', 'true'),
      tf(12, '"She" and "her" are both subject pronouns.', 'false'),
      tf(13, '"Give me the pen" uses "me" correctly as an object pronoun.', 'true'),
      fb(14, 'I → ___ (object). He → ___ (object). She → ___ (object). They → ___ (object).', 'me, him, her, them'),
      fb(15, 'She likes ___. (he) I called ___ yesterday. (she)', 'him, her'),
    ],
  },

  // Lesson 7 — Reflexive Pronouns — Myself/Yourself/Himself
  '58e670a3-d5e5-4a24-90c5-88d211528440': {
    pass_threshold: 70,
    questions: [
      mc(1,  'What is the reflexive pronoun for "I"?', 'meself', 'myself', 'Iself', 'myselves', 'B'),
      mc(2,  'What is the reflexive pronoun for "she"?', 'herselves', 'sheself', 'herself', 'hisself', 'C'),
      mc(3,  'What is the reflexive pronoun for "they"?', 'theirselves', 'themself', 'theirself', 'themselves', 'D'),
      mc(4,  'Choose the correct sentence:', 'He hurt him.', 'He hurt hisself.', 'He hurt himself.', 'He hurt he.', 'C'),
      mc(5,  'What is the reflexive pronoun for "we"?', 'weselves', 'ourself', 'ourselves', 'usselves', 'C'),
      mc(6,  'When do we use reflexive pronouns?', 'When subject and object are different people', 'When the subject and object are the same person', 'Only in questions', 'Only in past tense', 'B'),
      mc(7,  'Complete: "She made the cake ___." (she cooked it alone)', 'herself', 'her', 'sheself', 'hers', 'A'),
      mc(8,  'What is the reflexive pronoun for "you" (singular)?', 'youself', 'yourself', 'yourselves', 'you', 'B'),
      mc(9,  'Choose the correct sentence:', 'They enjoyed themselves at the party.', 'They enjoyed theirselves at the party.', 'They enjoyed them at the party.', 'They enjoyed theirself at the party.', 'A'),
      mc(10, 'What is the reflexive pronoun for "it"?', 'itelf', 'itsself', 'itself', 'its', 'C'),
      tf(11, '"Himself" is the reflexive pronoun for "he".', 'true'),
      tf(12, '"Theirselves" is the correct reflexive pronoun for "they".', 'false'),
      tf(13, 'Reflexive pronouns can be used for emphasis: "I myself cooked dinner."', 'true'),
      fb(14, 'I → ___, you → ___, he → ___, she → ___.', 'myself, yourself, himself, herself'),
      fb(15, 'She introduced ___ (she) to the class. They built the house ___ (they).', 'herself, themselves'),
    ],
  },

  // Lesson 8 — Quantifiers — Some/Any/Much/Many/A lot of/A few
  'e71e859a-9f0a-4d77-9bd5-d4fa468cbfd1': {
    pass_threshold: 70,
    questions: [
      mc(1,  'Which is correct in a positive sentence?', 'I have any milk.', 'I have some milk.', 'I have much milk.', 'I have many milk.', 'B'),
      mc(2,  'Which is correct in a question or negative?', 'Do you have some money?', 'Do you have any money?', 'I have not some money.', 'She has not some time.', 'B'),
      mc(3,  '"Many" is used with:', 'uncountable nouns', 'countable nouns (plural)', 'singular nouns', 'adjectives', 'B'),
      mc(4,  '"Much" is used with:', 'countable plural nouns', 'uncountable nouns', 'singular countable nouns', 'proper nouns', 'B'),
      mc(5,  'Choose the correct sentence:', 'There are many water.', 'There is many milk.', 'There are many students.', 'There is many chairs.', 'C'),
      mc(6,  'Choose the correct sentence:', 'I don\'t have much friends.', 'I don\'t have much time.', 'I don\'t have many money.', 'I don\'t have many sugar.', 'B'),
      mc(7,  '"A few" is used with:', 'uncountable nouns', 'plural countable nouns', 'singular nouns', 'verbs', 'B'),
      mc(8,  '"A little" is used with:', 'plural countable nouns', 'uncountable nouns', 'proper nouns', 'adjectives', 'B'),
      mc(9,  'Complete: "There is ___ sugar in the coffee." (a small amount)', 'many', 'a few', 'a little', 'some books', 'C'),
      mc(10, '"A lot of" can be used with:', 'countable nouns only', 'uncountable nouns only', 'both countable and uncountable', 'neither', 'C'),
      tf(11, '"Some" is used in affirmative sentences, "any" in negatives and questions.', 'true'),
      tf(12, '"How much books do you have?" is a correct question.', 'false'),
      tf(13, '"A few friends" and "a little water" are both grammatically correct.', 'true'),
      fb(14, 'I have ___ (a small number of) friends. There is ___ (a small amount of) butter left.', 'a few, a little'),
      fb(15, 'Is there ___ milk in the fridge? Yes, there is ___ milk.', 'any, some'),
    ],
  },

  // Lesson 9 — Module Review & Test (20 questions, threshold 80)
  'f24e5a14-23e8-4aad-af16-6494d3fdd428': {
    pass_threshold: 80,
    questions: [
      // Can
      mc(1,  'Choose the correct sentence:', 'She can sings.', 'She can sing.', 'She cans sing.', 'She can to sing.', 'B'),
      mc(2,  '"Can" is used to express:', 'past action', 'obligation', 'ability', 'future plan only', 'C'),
      // Like/Love/Hate + -ing
      mc(3,  'Choose the correct form:', 'He loves play tennis.', 'He loves to playing tennis.', 'He loves playing tennis.', 'He love playing tennis.', 'C'),
      mc(4,  'Which verb is followed by -ing?', 'must', 'will', 'enjoy', 'should', 'C'),
      // Can vs Can't
      mc(5,  'Complete: "I ___ swim, but I ___ dive." (ability / no ability)', "can / can't", "can / cans't", "cans / can't", "can / cannot to", 'A'),
      mc(6,  '"Cannot" is the same as:', "can't", "cann't", "can not be", "can't be", 'A'),
      // Irregular Verbs
      mc(7,  'What is the past tense of "go"?', 'goed', 'gone', 'went', 'goes', 'C'),
      mc(8,  'What is the past tense of "run"?', 'runned', 'ranned', 'run', 'ran', 'D'),
      // Object Pronouns
      mc(9,  'Replace "my brother" with an object pronoun: "I saw my brother."', 'I saw he.', 'I saw his.', 'I saw him.', 'I saw himself.', 'C'),
      mc(10, 'What is the object pronoun for "we"?', 'our', 'ours', 'us', 'ourselves', 'C'),
      // Reflexive Pronouns
      mc(11, 'What is the reflexive pronoun for "she"?', 'sheself', 'herselves', 'hisself', 'herself', 'D'),
      mc(12, 'Complete: "He fixed the car ___." (alone, no help)', 'him', 'his', 'himself', 'he', 'C'),
      // Quantifiers
      mc(13, 'Choose the correct sentence:', 'There are many water.', 'I don\'t have many money.', 'She has some friends.', 'How much books are there?', 'C'),
      mc(14, '"Much" is used with ___ nouns.', 'plural countable', 'uncountable', 'singular countable', 'proper', 'B'),
      // Jobs
      mc(15, 'A person who flies a plane is a:', 'driver', 'chef', 'pilot', 'nurse', 'C'),
      // True / False
      tf(16, '"Can" does not add -s for he/she/it.', 'true'),
      tf(17, 'The past tense of "do" is "doed".', 'false'),
      tf(18, '"A few" is used with uncountable nouns.', 'false'),
      // Fill blank
      fb(19, 'She ___ (can, negative) drive but she ___ (can) ride a bike.', "can't, can"),
      fb(20, 'I → ___ (object pronoun). They → ___ (reflexive pronoun).', 'me, themselves'),
    ],
  },
}

// ── main ──────────────────────────────────────────────────────────────────────

async function main() {
  const MODULE_ID = 'fbba716e-140c-4f76-8f7c-3573feccadfc'

  console.log('🔍 Checking A1 Beginner — Module 3 "Capable & Confident" quiz status...\n')

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

  console.log(`\n✅ Готово: ${created} квизов создано для модуля 3 A1 Beginner`)
}

main().catch(err => { console.error('Fatal:', err); process.exit(1) })