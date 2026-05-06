/**
 * Fill empty writing sections for General English courses — NO API calls.
 * Content is generated locally based on lesson title + level.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/fill-writing-sections.ts
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

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── types ─────────────────────────────────────────────────────────────────────
type Lesson  = { id: string; title: string; order_index: number; module_id: string }
type Section = { id: string; lesson_id: string; type: string; content: unknown }
type Module  = { id: string; course_id: string; title: string; order_index: number }
type Course  = { id: string; title: string; level: string }

// ── helpers ───────────────────────────────────────────────────────────────────
function isEmpty(content: unknown): boolean {
  if (content == null) return true
  if (typeof content === 'object') return Object.keys(content as object).length === 0
  if (typeof content === 'string') {
    const s = (content as string).trim()
    return s === '' || s === '{}' || s === 'null'
  }
  return false
}

async function fetchAll<T>(builder: (from: number, to: number) => any): Promise<T[]> {
  const PAGE = 1000
  let offset = 0
  const all: T[] = []
  for (;;) {
    const { data, error } = await builder(offset, offset + PAGE - 1)
    if (error) throw new Error(error.message)
    if (!data || (data as T[]).length === 0) break
    all.push(...(data as T[]))
    if ((data as T[]).length < PAGE) break
    offset += PAGE
  }
  return all
}

function chunks<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

// ── topic detection & translation ─────────────────────────────────────────────
function isGrammarLesson(title: string): boolean {
  const kws = [
    'present simple', 'present continuous', 'present perfect',
    'past simple', 'past continuous', 'past perfect',
    'future', 'will', 'would', 'going to',
    'conditional', 'passive', 'reported speech',
    'relative clause', 'modal', 'gerund', 'infinitive',
    'article', 'preposition', 'pronoun', 'adjective', 'adverb',
    'comparative', 'superlative', 'question', 'negative', 'imperative',
    'tense', 'verb', 'noun', 'clause', 'phrase', 'grammar',
    'punctuation', 'subject', 'object', 'sentence structure',
  ]
  const lower = title.toLowerCase()
  return kws.some(kw => lower.includes(kw))
}

function getTopicRu(title: string): string {
  const t = title.toLowerCase()

  const pairs: [string, string][] = [
    // Grammar tenses
    ['present perfect continuous', 'настоящем совершённо-продолженном времени (Present Perfect Continuous)'],
    ['past perfect continuous',    'прошедшем совершённо-продолженном времени (Past Perfect Continuous)'],
    ['future perfect continuous',  'будущем совершённо-продолженном времени (Future Perfect Continuous)'],
    ['present perfect',            'настоящем совершённом времени (Present Perfect)'],
    ['past perfect',               'прошедшем совершённом времени (Past Perfect)'],
    ['future perfect',             'будущем совершённом времени (Future Perfect)'],
    ['present continuous',         'настоящем продолженном времени (Present Continuous)'],
    ['past continuous',            'прошедшем продолженном времени (Past Continuous)'],
    ['future continuous',          'будущем продолженном времени (Future Continuous)'],
    ['present simple',             'настоящем простом времени (Present Simple)'],
    ['past simple',                'прошедшем простом времени (Past Simple)'],
    ['future simple',              'будущем простом времени (Future Simple)'],
    // Grammar structures
    ['going to',           'конструкции going to'],
    ['used to',            'конструкции used to'],
    ['would rather',       'конструкции would rather'],
    ['third conditional',  'третьем условном (Third Conditional)'],
    ['second conditional', 'втором условном (Second Conditional)'],
    ['first conditional',  'первом условном (First Conditional)'],
    ['zero conditional',   'нулевом условном (Zero Conditional)'],
    ['mixed conditional',  'смешанном условном предложении'],
    ['passive voice',      'пассивном залоге (Passive Voice)'],
    ['reported speech',    'косвенной речи (Reported Speech)'],
    ['relative clause',    'относительных придаточных предложениях'],
    ['modal verb',         'модальных глаголах'],
    ['modal',              'модальных глаголах'],
    ['gerund',             'герундии'],
    ['infinitive',         'инфинитивах'],
    ['article',            'артиклях'],
    ['comparative',        'сравнительных степенях прилагательных'],
    ['superlative',        'превосходных степенях прилагательных'],
    ['adjective',          'прилагательных'],
    ['adverb',             'наречиях'],
    ['pronoun',            'местоимениях'],
    ['preposition',        'предлогах'],
    ['conjunction',        'союзах'],
    ['question tag',       'разделительных вопросах'],
    ['question',           'вопросительных предложениях'],
    ['negative',           'отрицательных предложениях'],
    ['imperative',         'повелительном наклонении'],
    ['subjunctive',        'сослагательном наклонении'],
    ['inversion',          'инверсии в английском языке'],
    ['emphatic',           'эмфатических конструкциях'],
    ['cleft sentence',     'расщеплённых предложениях'],
    ['future',             'будущем времени'],
    ['tense',              'временных формах глагола'],
    ['verb pattern',       'глагольных конструкциях'],
    ['verb form',          'формах глагола'],
    ['noun phrase',        'именных словосочетаниях'],
    ['sentence structure', 'структуре предложения'],
    // Everyday topics
    ['daily routine',      'распорядке дня'],
    ['morning routine',    'утреннем распорядке дня'],
    ['my routine',         'своём распорядке дня'],
    ['free time',          'свободном времени'],
    ['hobbies',            'хобби и увлечениях'],
    ['hobby',              'своём хобби'],
    ['interests',          'интересах и увлечениях'],
    ['family',             'своей семье'],
    ['home',               'доме и семье'],
    ['house',              'доме'],
    ['neighbourhood',      'своём районе'],
    ['food and drink',     'еде и напитках'],
    ['food',               'еде'],
    ['drink',              'напитках'],
    ['restaurant',         'ресторане'],
    ['cooking',            'кулинарии'],
    ['shopping',           'покупках'],
    ['money',              'деньгах и финансах'],
    ['fashion',            'моде'],
    ['clothes',            'одежде'],
    ['travel',             'путешествиях'],
    ['holiday',            'отпуске и путешествиях'],
    ['transport',          'транспорте'],
    ['city',               'городе'],
    ['town',               'городе'],
    ['country',            'стране и сельской местности'],
    ['weather',            'погоде'],
    ['season',             'временах года'],
    ['nature',             'природе'],
    ['environment',        'окружающей среде и экологии'],
    ['sports',             'спорте'],
    ['sport',              'спорте'],
    ['exercise',           'физических упражнениях'],
    ['health',             'здоровье'],
    ['illness',            'болезнях и здоровье'],
    ['medicine',           'медицине'],
    ['body',               'строении тела'],
    ['work',               'работе'],
    ['job',                'профессии'],
    ['career',             'карьере'],
    ['business',           'бизнесе'],
    ['school',             'школе'],
    ['university',         'университете'],
    ['education',          'образовании'],
    ['study',              'учёбе'],
    ['technology',         'технологиях'],
    ['internet',           'интернете'],
    ['social media',       'социальных сетях'],
    ['media',              'средствах массовой информации'],
    ['television',         'телевидении'],
    ['film',               'кино'],
    ['movie',              'кино'],
    ['music',              'музыке'],
    ['art',                'искусстве'],
    ['literature',         'литературе'],
    ['books',              'книгах и чтении'],
    ['reading',            'чтении'],
    ['science',            'науке'],
    ['history',            'истории'],
    ['culture',            'культуре'],
    ['society',            'обществе'],
    ['global issue',       'глобальных проблемах'],
    ['politics',           'политике'],
    ['economics',          'экономике'],
    ['psychology',         'психологии'],
    ['philosophy',         'философии'],
    ['communication',      'коммуникации и общении'],
    ['relationships',      'отношениях между людьми'],
    ['friendship',         'дружбе'],
    ['emotions',           'эмоциях'],
    ['personality',        'характере и личности'],
    ['animals',            'животных'],
    ['animal',             'животных'],
    ['color',              'цветах'],
    ['colour',             'цветах'],
    ['number',             'числах'],
    ['time',               'времени'],
    ['greeting',           'приветствиях и знакомстве'],
    ['introduction',       'знакомстве'],
    ['describing people',  'описании людей'],
    ['describing places',  'описании мест'],
    ['describing things',  'описании предметов'],
    ['giving opinion',     'выражении мнения'],
    ['discussion',         'обсуждении различных тем'],
    ['debate',             'дискуссии'],
    ['writing',            'написании текстов'],
    ['speaking',           'устной речи'],
    ['listening',          'аудировании'],
  ]

  for (const [en, ru] of pairs) {
    if (t.includes(en)) return ru
  }

  return `теме «${title}»`
}

// ── content generators by level ───────────────────────────────────────────────

function generateA1(title: string): object {
  const isGrammar = isGrammarLesson(title)
  const topicRu   = getTopicRu(title)

  const task = isGrammar
    ? `Write 3-5 sentences using ${title}`
    : `Write 3-5 sentences about ${title}`

  const examples = isGrammar
    ? [
        `I wake up at 7 o'clock every morning.`,
        `She goes to school by bus. He likes English.`,
        `We eat breakfast together. They play football on Sundays.`,
      ]
    : [
        `I have a big family. My mother is a teacher. My father is kind.`,
        `My favourite food is pizza. I also like juice. It is very tasty.`,
        `I have a dog. His name is Max. He is very friendly and funny.`,
      ]

  return {
    task,
    instructions_ru: `Напиши 3–5 простых предложений о ${topicRu}. Используй слова и выражения из урока.`,
    examples,
    min_words: 15,
    tips_ru: [
      'Начни каждое предложение с заглавной буквы',
      'Используй слова и фразы из урока',
    ],
  }
}

function generateA2(title: string): object {
  const isGrammar = isGrammarLesson(title)
  const topicRu   = getTopicRu(title)

  const task = isGrammar
    ? `Write a short paragraph (5-7 sentences) using ${title}`
    : `Write a short paragraph (5-7 sentences) about ${title}`

  const example = isGrammar
    ? `Last weekend I visited my grandparents. We had a delicious dinner together and talked about our week. After dinner, we watched an old film on TV. I really enjoyed spending time with them. Next time, I want to help my grandmother in the garden.`
    : `My hobby is playing basketball. I play it every evening with my friends from school. We usually go to the sports centre near my house. Basketball is a team sport, so it is very important to work together. I think it is the best sport in the world because it is exciting and keeps you healthy.`

  return {
    task,
    instructions_ru: `Напиши короткий абзац (5–7 предложений) о ${topicRu}. Используй связывающие слова: and, but, because, so, also, however.`,
    examples: [example],
    min_words: 30,
    tips_ru: [
      'Начни с вводного предложения, которое представляет тему',
      'Используй связывающие слова: and, but, because, so, also',
      'Проверь правильность временных форм глаголов',
    ],
  }
}

function generateB1(title: string): object {
  const isGrammar = isGrammarLesson(title)
  const topicRu   = getTopicRu(title)

  const task = isGrammar
    ? `Write a paragraph of 60-80 words demonstrating your understanding of ${title}`
    : `Write a paragraph of 60-80 words about ${title}`

  return {
    task,
    instructions_ru: `Напиши абзац 60–80 слов о ${topicRu}. Следуй структуре: вступление → основная мысль → пример → вывод.`,
    min_words: 60,
    structure: 'Introduction → Main idea → Example → Conclusion',
    tips_ru: [
      'Начни с вводного предложения, которое чётко представляет тему',
      'Приведи конкретный пример или личный опыт в поддержку основной мысли',
      'Используй разнообразную лексику и избегай повторений одних и тех же слов',
    ],
  }
}

function generateB2(title: string): object {
  const isGrammar = isGrammarLesson(title)
  const topicRu   = getTopicRu(title)

  const task = isGrammar
    ? `Write an essay of 120-150 words analysing the importance of ${title} in effective communication`
    : `Write an essay of 120-150 words discussing ${title}`

  return {
    task,
    instructions_ru: `Напиши эссе 120–150 слов о ${topicRu}. Структура: вступление с тезисом → аргументы → контраргумент → вывод.`,
    min_words: 120,
    structure: 'Introduction → Arguments → Counter-argument → Conclusion',
    useful_phrases: [
      'Furthermore,',
      'In contrast,',
      'As a result,',
      'To conclude,',
      'On the other hand,',
    ],
    tips_ru: [
      'Начни с чёткого тезиса во вступлении, который обозначает твою позицию',
      'Подкрепи каждый аргумент конкретным примером или фактом',
      'Включи контраргумент для демонстрации критического мышления',
      'В заключении подведи итог, не повторяя вступление дословно',
    ],
  }
}

function generateC1(title: string): object {
  const isGrammar = isGrammarLesson(title)
  const topicRu   = getTopicRu(title)

  const task = isGrammar
    ? `Write an advanced analytical essay of 200+ words critically examining the role of ${title} in academic and professional discourse`
    : `Write an advanced essay or analytical report of 200+ words about ${title}`

  return {
    task,
    instructions_ru: `Напиши развёрнутое эссе или аналитический отчёт 200+ слов о ${topicRu}. Продемонстрируй академический стиль, критическое мышление и богатый словарный запас.`,
    min_words: 200,
    structure: 'Executive summary → Analysis → Evidence → Critical evaluation → Conclusion',
    useful_phrases: [
      'It can be argued that',
      'Evidence suggests that',
      'A critical analysis reveals',
      'Notwithstanding',
      'The implications of this are',
    ],
    assessment_criteria: [
      'Coherence and cohesion',
      'Lexical range and accuracy',
      'Grammatical range and accuracy',
      'Task achievement and argument strength',
    ],
    tips_ru: [
      'Используй академический стиль: избегай разговорных выражений и сокращений',
      'Подкрепляй каждое утверждение доказательствами, примерами или ссылками',
      'Продемонстрируй богатый словарный запас через синонимы и коллокации',
      'Убедись, что каждый абзац логически связан с предыдущим через дискурсивные маркеры',
    ],
  }
}

function generateWritingContent(title: string, level: string): object {
  switch (level) {
    case 'A1': return generateA1(title)
    case 'A2': return generateA2(title)
    case 'B1': return generateB1(title)
    case 'B2': return generateB2(title)
    case 'C1': return generateC1(title)
    default:   return generateB1(title)
  }
}

// ── process one course level ──────────────────────────────────────────────────
async function processLevel(
  course: Course
): Promise<{ filled: number; errors: number; total: number }> {
  let filled = 0
  let errors = 0

  // Fetch modules
  const modules = await fetchAll<Module>((from, to) =>
    db.from('english_modules')
      .select('id, course_id, title, order_index')
      .eq('course_id', course.id)
      .order('order_index')
      .range(from, to)
  )
  const moduleIds = modules.map(m => m.id)

  // Fetch lessons
  const allLessons: Lesson[] = []
  for (const chunk of chunks(moduleIds, 20)) {
    const rows = await fetchAll<Lesson>((from, to) =>
      db.from('english_lessons')
        .select('id, title, order_index, module_id')
        .in('module_id', chunk)
        .order('order_index')
        .range(from, to)
    )
    allLessons.push(...rows)
  }

  const total      = allLessons.length
  const lessonIds  = allLessons.map(l => l.id)
  const lessonMap  = Object.fromEntries(allLessons.map(l => [l.id, l]))

  // Fetch writing sections and filter to empty ones
  const emptySections: Section[] = []
  for (const chunk of chunks(lessonIds, 50)) {
    const rows = await fetchAll<Section>((from, to) =>
      db.from('english_lesson_sections')
        .select('id, lesson_id, type, content')
        .in('lesson_id', chunk)
        .eq('type', 'writing')
        .eq('is_active', true)
        .range(from, to)
    )
    emptySections.push(...rows.filter(s => isEmpty(s.content)))
  }

  if (emptySections.length === 0) {
    process.stdout.write(`  (все writing секции уже заполнены)\n`)
    return { filled: 0, errors: 0, total }
  }

  // Fill each empty section
  for (const sec of emptySections) {
    const lesson = lessonMap[sec.lesson_id]
    if (!lesson) {
      errors++
      continue
    }

    try {
      const content = generateWritingContent(lesson.title, course.level)
      const { error: ue } = await db
        .from('english_lesson_sections')
        .update({ content })
        .eq('id', sec.id)
      if (ue) throw new Error(ue.message)
      filled++
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err)
      console.error(`  ❌ "${lesson.title}": ${msg}`)
      errors++
    }
  }

  return { filled, errors, total }
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════════════╗')
  console.log('║  Fill Writing Sections — General English (No API)            ║')
  console.log('╚══════════════════════════════════════════════════════════════╝\n')

  const { data: allCourses, error: ce } = await db
    .from('english_courses')
    .select('id, title, level')
    .eq('category', 'General English')
    .order('level')

  if (ce || !allCourses) throw new Error('Failed to fetch courses: ' + ce?.message)

  const LEVELS: string[] = ['A1', 'A2', 'B1', 'B2', 'C1']
  const LEVEL_LABELS: Record<string, string> = {
    A1: 'A1 Beginner',
    A2: 'A2',
    B1: 'B1',
    B2: 'B2',
    C1: 'C1',
  }

  let totalFilled = 0
  let totalErrors = 0

  for (const level of LEVELS) {
    const course = allCourses.find(c => c.level === level)
    if (!course) {
      console.log(`⚠️  ${level}: курс не найден, пропуск`)
      continue
    }

    console.log(`\n📚 ${LEVEL_LABELS[level]}: "${course.title}"`)

    const { filled, errors, total } = await processLevel(course)
    totalFilled += filled
    totalErrors += errors

    const errNote = errors > 0 ? `, ${errors} ошибок` : ''
    console.log(`✅ ${LEVEL_LABELS[level]}: ${filled}/${total} уроков заполнено${errNote}`)
  }

  console.log('\n' + '═'.repeat(60))
  console.log(`✅ ВСЕГО: ${totalFilled} уроков заполнено, ${totalErrors} ошибок`)
  console.log('═'.repeat(60))
}

main().catch(err => {
  console.error('\n💥', err instanceof Error ? err.message : String(err))
  process.exit(1)
})
