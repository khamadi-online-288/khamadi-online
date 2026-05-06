/**
 * Curriculum Gap Analysis
 * Сопоставляет грамматические темы из тех спека с уроками в БД.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/curriculum-analysis.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// ── .env.local ────────────────────────────────────────────────────────────────
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

// ── Tech Spec ─────────────────────────────────────────────────────────────────
// keywords: если хотя бы одно слово встречается в названии урока (case-insensitive)
// — тема считается покрытой
type Topic = {
  level:    'A1' | 'A2' | 'B1' | 'B2'
  label:    string           // название темы
  keywords: string[]         // ключевые слова для поиска в lesson title
}

const TECH_SPEC: Topic[] = [
  // ── A1 ──────────────────────────────────────────────────────────────────────
  {
    level: 'A1', label: 'Articles (zero / definite / indefinite)',
    keywords: ['article', 'a/an', 'a/an/the', 'definite', 'indefinite', 'zero article'],
  },
  {
    level: 'A1', label: 'Pronouns (Relative, Possessive, Reflexive)',
    keywords: ['pronoun', 'possessive', 'reflexive', 'relative', 'myself', 'yourself'],
  },
  {
    level: 'A1', label: 'Present Simple',
    keywords: ['present simple', 'simple present'],
  },
  {
    level: 'A1', label: 'Present Continuous',
    keywords: ['present continuous', 'continuous present'],
  },
  {
    level: 'A1', label: 'Adverbs of Frequency',
    keywords: ['adverb', 'frequency', 'how often', 'always', 'never', 'usually', 'adverbs of frequency'],
  },
  {
    level: 'A1', label: 'Gerund or Infinitive',
    keywords: ['gerund', 'infinitive', 'like/love/hate', 'like, love', 'love/hate', '-ing'],
  },
  {
    level: 'A1', label: 'Present Continuous (future meaning)',
    keywords: ['future meaning', 'future plan', 'continuous for future', 'present continuous for future'],
  },
  {
    level: 'A1', label: 'Future: will',
    keywords: ['will', 'future simple', 'prediction'],
  },
  {
    level: 'A1', label: 'Future: going to',
    keywords: ['going to', 'be going to', 'future plan'],
  },
  {
    level: 'A1', label: 'Past Simple (regular & irregular)',
    keywords: ['past simple', 'irregular verb', 'regular verb', 'past regular', 'past irregular', 'did'],
  },
  {
    level: 'A1', label: 'Comparative Adjectives',
    keywords: ['comparative', 'comparison', 'more', '-er'],
  },
  {
    level: 'A1', label: 'Superlative Adjectives',
    keywords: ['superlative', 'most', '-est', 'the best'],
  },
  {
    level: 'A1', label: 'Phrasal Verbs',
    keywords: ['phrasal verb', 'phrasal verbs'],
  },
  {
    level: 'A1', label: 'Modal Verbs',
    keywords: ['modal', 'can', 'could', 'must', 'should', 'may', 'might', 'modal verb'],
  },

  // ── A2 ──────────────────────────────────────────────────────────────────────
  {
    level: 'A2', label: 'Look or look like?',
    keywords: ['look like', 'look or look', 'linking verb', 'seem', 'appear'],
  },
  {
    level: 'A2', label: 'Zero Conditional',
    keywords: ['zero conditional', 'conditional', 'conditionals', 'zero & first', 'if + present'],
  },
  {
    level: 'A2', label: 'First Conditional',
    keywords: ['first conditional', 'real situation', 'if + will', 'conditional'],
  },

  // ── B1 ──────────────────────────────────────────────────────────────────────
  {
    level: 'B1', label: 'Active & Passive Voice',
    keywords: ['passive', 'active', 'passive voice', 'active voice', 'is made', 'was made'],
  },
  {
    level: 'B1', label: 'Reported Speech',
    keywords: ['reported speech', 'reported statement', 'reported question', 'reporting verb', 'indirect speech'],
  },
  {
    level: 'B1', label: 'Second Conditional',
    keywords: ['second conditional', 'unreal', 'hypothetical', 'if + would'],
  },
  {
    level: 'B1', label: 'Third Conditional',
    keywords: ['third conditional', 'past regret', 'if + had'],
  },
  {
    level: 'B1', label: 'Quantitative & Ordinal Numerals, Fractions',
    keywords: ['ordinal', 'numeral', 'fraction', 'cardinal', 'first/second', 'ordinal number'],
  },
  {
    level: 'B1', label: 'Present Perfect + yet/already/just',
    keywords: ['present perfect', 'yet', 'already', 'just', 'perfect simple'],
  },
  {
    level: 'B1', label: 'Present Perfect vs Past Simple',
    keywords: ['present perfect', 'past simple', 'perfect or past', 'perfect vs past', 'perfect simple'],
  },
  {
    level: 'B1', label: 'Participle I (Present Participle)',
    keywords: ['participle i', 'participle 1', 'present participle', 'participle', '-ing clause'],
  },
  {
    level: 'B1', label: 'Participle II (Past Participle)',
    keywords: ['participle ii', 'participle 2', 'past participle', 'participle'],
  },

  // ── B2 ──────────────────────────────────────────────────────────────────────
  {
    level: 'B2', label: 'Comparatives / Superlatives as...as',
    keywords: ['as...as', 'as ... as', 'as..as', 'not as', 'comparison', 'comparative', 'superlative'],
  },
  {
    level: 'B2', label: 'Connectors: although, however, despite',
    keywords: ['although', 'however', 'despite', 'connector', 'linker', 'linking word', 'despite/although'],
  },
  {
    level: 'B2', label: 'Would you like to...? / Polite requests',
    keywords: ['would you like', 'would like', 'polite', 'request', 'formal request'],
  },
  {
    level: 'B2', label: 'Future: will / going to / Present Continuous / might / may',
    keywords: ['future', 'will', 'going to', 'might', 'may', 'future form', 'future tense'],
  },
  {
    level: 'B2', label: 'Phrasal Verbs (advanced)',
    keywords: ['phrasal verb', 'phrasal verbs', 'advanced phrasal'],
  },
  {
    level: 'B2', label: 'Passive Voice (all tenses)',
    keywords: ['passive', 'passive voice', 'all tenses', 'passive tense'],
  },
  {
    level: 'B2', label: 'Modals: might, could, must, can\'t, ought to, should',
    keywords: ['modal', 'might', 'ought to', 'modal perfect', 'must', "can't", 'should'],
  },
  {
    level: 'B2', label: 'Clauses (relative, participle, adverbial)',
    keywords: ['clause', 'relative clause', 'defining clause', 'non-defining', 'adverbial clause', 'participle clause'],
  },
  {
    level: 'B2', label: 'Reported Speech (statements, questions, imperatives)',
    keywords: ['reported speech', 'reported statement', 'reported question', 'reported command', 'reporting verb'],
  },
]

// ── types ─────────────────────────────────────────────────────────────────────
type LessonRow = {
  id: string
  title: string
  module_title: string
  course_title: string
  course_level: string
}

// ── fetch helpers ─────────────────────────────────────────────────────────────
async function fetchAll<T>(builder: (from: number, to: number) => any): Promise<T[]> {
  const PAGE = 1000
  let offset = 0
  const all: T[] = []
  for (;;) {
    const { data, error } = await builder(offset, offset + PAGE - 1)
    if (error) throw new Error((error as { message: string }).message)
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

// ── table renderer ────────────────────────────────────────────────────────────
function padR(s: unknown, n: number): string {
  const str = String(s ?? '')
  return str.length >= n ? str.slice(0, n) : str.padEnd(n)
}

function renderTable(title: string, columns: string[], rows: string[][]): string {
  const widths = columns.map((col, i) =>
    Math.max(col.length, rows.length ? Math.max(...rows.map(r => String(r[i] ?? '').length)) : 0, 3)
  )
  const sep = (l: string, m: string, r: string) =>
    l + widths.map(w => '─'.repeat(w + 2)).join(m) + r
  const dataRow = (cells: string[]) =>
    '│' + cells.map((v, i) => ' ' + padR(v, widths[i]) + ' ').join('│') + '│'
  const totalW = widths.reduce((a, b) => a + b + 3, 0) + 1
  return [
    '┌' + '─'.repeat(totalW - 2) + '┐',
    '│ ' + padR(' ' + title, totalW - 3) + ' │',
    sep('├', '┬', '┤'),
    dataRow(columns),
    sep('├', '┼', '┤'),
    ...rows.map(r => dataRow(r)),
    sep('└', '┴', '┘'),
  ].join('\n')
}

// ── topic matcher ─────────────────────────────────────────────────────────────
function findMatchingLesson(
  topic: Topic,
  lessons: LessonRow[]
): LessonRow | null {
  const levelPrefix = topic.level[0]   // 'A', 'B', 'C'
  const levelNum    = topic.level[1]   // '1', '2', etc.

  // Для каждого уровня берём уроки того же уровня + ниже (кумулятивная схема)
  const levelOrder: Record<string, number> = { A1: 1, A2: 2, B1: 3, B2: 4 }
  const maxLevel = levelOrder[topic.level] ?? 1

  const candidates = lessons.filter(l => {
    const lLevel = l.course_level?.trim()
    return (levelOrder[lLevel] ?? 0) <= maxLevel
  })

  for (const lesson of candidates) {
    const haystack = lesson.title.toLowerCase()
    for (const kw of topic.keywords) {
      if (haystack.includes(kw.toLowerCase())) {
        return lesson
      }
    }
  }
  return null
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const output: string[] = []
  const ts = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })

  output.push('════════════════════════════════════════════════════════════════════')
  output.push('  KHAMADI ONLINE — Curriculum Gap Analysis')
  output.push('  Generated: ' + ts)
  output.push('════════════════════════════════════════════════════════════════════')
  output.push('')

  // ── 1. Fetch GE courses at A1/A2/B1/B2 ───────────────────────────────────
  process.stdout.write('⏳  Fetching courses...')
  const { data: courses, error: ce } = await db
    .from('english_courses')
    .select('id, title, level')
    .eq('category', 'General English')
    .in('level', ['A1', 'A2', 'B1', 'B2'])
  if (ce) throw new Error('courses: ' + ce.message)

  const courseArr  = (courses ?? []) as { id: string; title: string; level: string }[]
  const courseIds  = courseArr.map(c => c.id)
  const courseMap  = Object.fromEntries(courseArr.map(c => [c.id, c]))
  console.log(` ${courseArr.length} found (${courseArr.map(c => `${c.title} ${c.level}`).join(', ')})`)

  // ── 2. Fetch modules ──────────────────────────────────────────────────────
  process.stdout.write('⏳  Fetching modules...')
  const allModules: { id: string; course_id: string; title: string; order_index: number }[] = []
  for (const chunk of chunks(courseIds, 10)) {
    const rows = await fetchAll<{ id: string; course_id: string; title: string; order_index: number }>(
      (from, to) => db.from('english_modules')
        .select('id, course_id, title, order_index')
        .in('course_id', chunk)
        .order('order_index')
        .range(from, to)
    )
    allModules.push(...rows)
  }
  const moduleMap = Object.fromEntries(allModules.map(m => [m.id, m]))
  const moduleIds = allModules.map(m => m.id)
  console.log(` ${allModules.length} found`)

  // ── 3. Fetch lessons ──────────────────────────────────────────────────────
  process.stdout.write('⏳  Fetching lessons...')
  const rawLessons: { id: string; module_id: string; course_id: string; title: string; order_index: number }[] = []
  for (const chunk of chunks(moduleIds, 20)) {
    const rows = await fetchAll<{ id: string; module_id: string; course_id: string; title: string; order_index: number }>(
      (from, to) => db.from('english_lessons')
        .select('id, module_id, course_id, title, order_index')
        .in('module_id', chunk)
        .order('order_index')
        .range(from, to)
    )
    rawLessons.push(...rows)
  }
  console.log(` ${rawLessons.length} found`)

  // ── 4. Build flat lesson list with module/course names ───────────────────
  const lessons: LessonRow[] = rawLessons.map(l => ({
    id:           l.id,
    title:        l.title,
    module_title: moduleMap[l.module_id]?.title ?? '?',
    course_title: courseMap[l.course_id]?.title ?? '?',
    course_level: courseMap[l.course_id]?.level ?? '?',
  }))

  // ── 5. Match each topic against lessons ───────────────────────────────────
  console.log('⏳  Running curriculum analysis...\n')

  type Result = {
    topic:    Topic
    matched:  LessonRow | null
  }

  const results: Result[] = TECH_SPEC.map(topic => ({
    topic,
    matched: findMatchingLesson(topic, lessons),
  }))

  // ── 6. Render per-level tables ────────────────────────────────────────────
  const levels = ['A1', 'A2', 'B1', 'B2'] as const
  let totalCovered = 0
  let totalMissing = 0

  for (const level of levels) {
    const levelResults = results.filter(r => r.topic.level === level)
    const covered = levelResults.filter(r => r.matched !== null)
    const missing = levelResults.filter(r => r.matched === null)

    const rows = levelResults.map(r => {
      const status  = r.matched ? '✅ ПОКРЫТО' : '❌ НЕТ УРОКА'
      const lessonLabel = r.matched
        ? `${r.matched.module_title} — ${r.matched.title}`
        : '—'
      return [r.topic.label, lessonLabel, status]
    })

    const table = renderTable(
      `Уровень ${level}  (${covered.length}/${levelResults.length} покрыто)`,
      ['ТЕХ СПЕК ТЕМА', 'УРОК В БД', 'СТАТУС'],
      rows
    )

    output.push(table)
    output.push('')

    totalCovered += covered.length
    totalMissing += missing.length
  }

  // ── 7. Missing topics summary ─────────────────────────────────────────────
  const missingAll = results.filter(r => r.matched === null)

  output.push('═'.repeat(70))
  output.push('  ИТОГ')
  output.push('═'.repeat(70))
  output.push(`  Всего тем в тех спеке:   ${results.length}`)
  output.push(`  Покрыто уроками:          ${totalCovered} (${Math.round(totalCovered / results.length * 100)}%)`)
  output.push(`  Не покрыто:               ${totalMissing} (${Math.round(totalMissing / results.length * 100)}%)`)
  output.push('')

  if (missingAll.length > 0) {
    output.push('  ❌ ОТСУТСТВУЮЩИЕ ТЕМЫ:')
    output.push('  ' + '─'.repeat(60))
    for (const r of missingAll) {
      output.push(`  [${r.topic.level}]  ${r.topic.label}`)
      output.push(`         Искали по: ${r.topic.keywords.slice(0, 4).map(k => `"${k}"`).join(', ')}`)
    }
    output.push('')
  } else {
    output.push('  🎉 Все темы из тех спека покрыты!')
    output.push('')
  }

  // ── 8. Lesson index per level ─────────────────────────────────────────────
  output.push('═'.repeat(70))
  output.push('  СПИСОК ВСЕХ УРОКОВ В БД (по уровням)')
  output.push('═'.repeat(70))

  for (const level of levels) {
    const levelLessons = lessons
      .filter(l => l.course_level === level)
      .sort((a, b) => a.module_title.localeCompare(b.module_title) || a.title.localeCompare(b.title))

    output.push(`\n  ── ${level} (${levelLessons.length} уроков) ─────────────────────────────`)
    for (const l of levelLessons) {
      output.push(`    • [${l.module_title}] ${l.title}`)
    }
  }

  output.push('')

  // ── 9. Print & save ───────────────────────────────────────────────────────
  const text = output.join('\n')
  console.log(text)

  fs.mkdirSync('reports', { recursive: true })
  fs.writeFileSync('reports/curriculum-gap-analysis.txt', text, 'utf-8')
  console.log('\n✅  Saved → reports/curriculum-gap-analysis.txt')
}

main().catch(err => {
  console.error('\n💥', err.message)
  process.exit(1)
})
