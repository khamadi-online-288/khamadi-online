/**
 * Content audit — General English courses
 * Реплицирует сложный SQL через Supabase JS client (батчи, JS-join).
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/audit-content.ts
 */

import * as fs   from 'fs'
import * as path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

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

const db: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── types ─────────────────────────────────────────────────────────────────────
type Course  = { id: string; title: string; level: string }
type Module  = { id: string; course_id: string; order_index: number }
type Lesson  = { id: string; module_id: string; course_id: string; order_index: number }
type Section = { lesson_id: string; type: string; content: unknown }

type SectionFlags = {
  grammar: boolean; vocabulary: boolean; reading: boolean
  listening: boolean; writing: boolean; quiz: boolean
}

// ── helpers ───────────────────────────────────────────────────────────────────
function isFilled(content: unknown): boolean {
  if (content == null) return false
  if (typeof content === 'string') {
    const s = content.trim()
    return s !== '' && s !== '{}' && s !== 'null'
  }
  if (typeof content === 'object') return Object.keys(content as object).length > 0
  return false
}

/** Fetch ALL rows from a paginated Supabase query (handles the 1000-row default limit). */
async function fetchAll<T>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  builder: (from: number, to: number) => any
): Promise<T[]> {
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

/** Split array into chunks of size n. */
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
  const widths = columns.map((col, i) => {
    const max = rows.length ? Math.max(...rows.map(r => String(r[i] ?? '').length)) : 0
    return Math.max(col.length, max, 3)
  })
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

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  const output: string[] = []
  const ts = new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Almaty' })
  output.push('KHAMADI ONLINE — Content Audit (General English)')
  output.push('Generated: ' + ts)
  output.push('')

  // ── 1. General English courses ────────────────────────────────────────────
  process.stdout.write('⏳  Fetching courses...')
  const { data: courses, error: ce } = await db
    .from('english_courses')
    .select('id, title, level')
    .eq('category', 'General English')
    .order('level')
  if (ce) throw new Error('courses: ' + ce.message)
  const geCoursesArr = (courses ?? []) as Course[]
  const geCourseIds  = geCoursesArr.map(c => c.id)
  const courseMap    = Object.fromEntries(geCoursesArr.map(c => [c.id, c]))
  console.log(` ${geCoursesArr.length} found`)

  // ── 2. Modules for GE courses (chunks of 20 to keep URL short) ────────────
  process.stdout.write('⏳  Fetching modules...')
  const allModules: Module[] = []
  for (const chunk of chunks(geCourseIds, 20)) {
    const rows = await fetchAll<Module>((from, to) =>
      db.from('english_modules')
        .select('id, course_id, order_index')
        .in('course_id', chunk)
        .order('order_index')
        .range(from, to)
    )
    allModules.push(...rows)
  }
  const moduleIds = allModules.map(m => m.id)
  const moduleMap = Object.fromEntries(allModules.map(m => [m.id, m]))
  console.log(` ${allModules.length} found`)

  // ── 3. Lessons (chunks of 20 module IDs) ──────────────────────────────────
  process.stdout.write('⏳  Fetching lessons...')
  const allLessons: Lesson[] = []
  for (const chunk of chunks(moduleIds, 20)) {
    const rows = await fetchAll<Lesson>((from, to) =>
      db.from('english_lessons')
        .select('id, module_id, course_id, order_index')
        .in('module_id', chunk)
        .order('order_index')
        .range(from, to)
    )
    allLessons.push(...rows)
  }
  const lessonIds = new Set(allLessons.map(l => l.id))
  console.log(` ${allLessons.length} found`)

  // ── 4. ALL active sections (no large .in() — just paginate everything) ────
  process.stdout.write('⏳  Fetching lesson sections...')
  const allSections = await fetchAll<Section>((from, to) =>
    db.from('english_lesson_sections')
      .select('lesson_id, type, content')
      .eq('is_active', true)
      .range(from, to)
  )
  console.log(` ${allSections.length} found`)

  // ── 5. Build section-filled map (only for GE lessons) ────────────────────
  const TYPES = ['grammar', 'vocabulary', 'reading', 'listening', 'writing', 'quiz'] as const
  const secMap: Record<string, SectionFlags> = {}

  for (const s of allSections) {
    if (!lessonIds.has(s.lesson_id)) continue          // skip non-GE lessons
    if (!(TYPES as readonly string[]).includes(s.type)) continue
    if (!secMap[s.lesson_id]) {
      secMap[s.lesson_id] = { grammar: false, vocabulary: false, reading: false, listening: false, writing: false, quiz: false }
    }
    if (isFilled(s.content)) {
      secMap[s.lesson_id][s.type as keyof SectionFlags] = true
    }
  }

  // ── 6. Aggregate per course (mirrors the SQL GROUP BY) ────────────────────
  type Stats = { total: number; grammar: number; vocabulary: number; reading: number; listening: number; writing: number; quiz: number }
  const statsPerCourse: Record<string, Stats> = {}
  for (const c of geCoursesArr) {
    statsPerCourse[c.id] = { total: 0, grammar: 0, vocabulary: 0, reading: 0, listening: 0, writing: 0, quiz: 0 }
  }

  for (const l of allLessons) {
    const stat = statsPerCourse[l.course_id]
    if (!stat) continue
    stat.total++
    const sec = secMap[l.id]
    if (sec) {
      for (const t of TYPES) if (sec[t]) stat[t]++
    }
  }

  // ── 7. Render summary table ───────────────────────────────────────────────
  function pct(n: number, total: number) {
    return total ? `${n} (${Math.round(n / total * 100)}%)` : '0 (0%)'
  }

  const summaryRows = geCoursesArr.map(c => {
    const s = statsPerCourse[c.id]
    return [
      c.title, c.level,
      String(s.total),
      pct(s.grammar,    s.total),
      pct(s.vocabulary, s.total),
      pct(s.reading,    s.total),
      pct(s.listening,  s.total),
      pct(s.writing,    s.total),
      pct(s.quiz,       s.total),
    ]
  })

  const summaryTable = renderTable(
    'CONTENT AUDIT — General English (sections per lesson)',
    ['Course', 'Level', 'Lessons', 'Grammar', 'Vocab', 'Reading', 'Listening', 'Writing', 'Quiz'],
    summaryRows
  )
  output.push(summaryTable)
  output.push('')

  // ── 8. Global totals ──────────────────────────────────────────────────────
  const T = allLessons.length
  let gG = 0, gV = 0, gR = 0, gL = 0, gW = 0, gQ = 0
  for (const s of Object.values(statsPerCourse)) {
    gG += s.grammar; gV += s.vocabulary; gR += s.reading
    gL += s.listening; gW += s.writing; gQ += s.quiz
  }
  const p = (n: number) => T ? `${n} / ${T} (${Math.round(n / T * 100)}%)` : '0'

  const sep = '─'.repeat(60)
  output.push(sep)
  output.push('GLOBAL TOTALS — General English')
  output.push(sep)
  output.push(`  Lessons total:              ${T}`)
  output.push(`  Grammar sections filled:    ${p(gG)}`)
  output.push(`  Vocabulary sections filled: ${p(gV)}`)
  output.push(`  Reading sections filled:    ${p(gR)}`)
  output.push(`  Listening sections filled:  ${p(gL)}`)
  output.push(`  Writing sections filled:    ${p(gW)}`)
  output.push(`  Quiz sections filled:       ${p(gQ)}`)
  output.push(sep)

  const activeGESections = allSections.filter(s => lessonIds.has(s.lesson_id)).length
  output.push(`  Active sections for GE: ${activeGESections} total in english_lesson_sections`)
  output.push(sep)

  // ── 9. Per-lesson detail table ────────────────────────────────────────────
  output.push('')
  const detailRows = allLessons
    .slice()
    .sort((a, b) => {
      const ca = courseMap[a.course_id], cb = courseMap[b.course_id]
      if ((ca?.level ?? '') !== (cb?.level ?? '')) return (ca?.level ?? '').localeCompare(cb?.level ?? '')
      if (a.course_id !== b.course_id) return (ca?.title ?? '').localeCompare(cb?.title ?? '')
      const ma = moduleMap[a.module_id], mb = moduleMap[b.module_id]
      if ((ma?.order_index ?? 0) !== (mb?.order_index ?? 0)) return (ma?.order_index ?? 0) - (mb?.order_index ?? 0)
      return (a.order_index ?? 0) - (b.order_index ?? 0)
    })
    .map(l => {
      const c = courseMap[l.course_id]
      const m = moduleMap[l.module_id]
      const s: SectionFlags = secMap[l.id] ?? { grammar: false, vocabulary: false, reading: false, listening: false, writing: false, quiz: false }
      return [
        c?.title ?? '?', c?.level ?? '—',
        m ? `mod-${m.order_index}` : '?',
        l.id.slice(0, 8),
        s.grammar    ? '✓' : '·',
        s.vocabulary ? '✓' : '·',
        s.reading    ? '✓' : '·',
        s.listening  ? '✓' : '·',
        s.writing    ? '✓' : '·',
        s.quiz       ? '✓' : '·',
      ]
    })

  const detailTable = renderTable(
    `DETAIL — all ${allLessons.length} GE lessons`,
    ['Course', 'Level', 'Mod', 'Lesson(id)', 'Gram', 'Vocab', 'Read', 'List', 'Writ', 'Quiz'],
    detailRows
  )
  output.push(detailTable)

  // ── 10. Output ────────────────────────────────────────────────────────────
  const text = output.join('\n')

  // terminal: summary + totals only
  const termLines = [
    '',
    summaryTable,
    '',
    output.slice(output.indexOf(sep)).join('\n'),
  ]
  console.log('\n' + termLines.join('\n'))

  fs.mkdirSync('reports', { recursive: true })
  fs.writeFileSync('reports/content-audit-full.txt', text, 'utf-8')
  console.log('\n✅  Saved → reports/content-audit-full.txt')
}

main().catch(err => {
  console.error('\n💥', err.message)
  process.exit(1)
})
