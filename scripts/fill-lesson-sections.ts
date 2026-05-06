/**
 * Fill empty english_lesson_sections with AI-generated content.
 * Targets B2 Upper-Intermediate (0% filled) by default.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/fill-lesson-sections.ts
 *
 * Optional env overrides:
 *   LEVEL=B1          — target a different level
 *   TYPES=grammar,vocabulary   — comma-separated section types
 *   LIMIT=10          — max lessons to process (useful for testing)
 *   DRY_RUN=1         — build prompts without calling API or writing to DB
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

// ── config ────────────────────────────────────────────────────────────────────
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY!
const TARGET_LEVEL      = process.env.LEVEL     ?? 'B2'
const LIMIT             = process.env.LIMIT     ? parseInt(process.env.LIMIT) : Infinity
const DRY_RUN           = process.env.DRY_RUN   === '1'
const OVERWRITE         = process.env.OVERWRITE === '1'   // overwrite already-filled sections
const TARGET_TYPES      = (process.env.TYPES ?? 'grammar,vocabulary,reading').split(',').map(s => s.trim())
const MODEL             = 'claude-opus-4-7'
const DELAY_MS          = 1200                // 1.2 s between API calls (respect rate limits)
const BATCH_LESSONS     = 3                   // lessons per "wave"

if (!ANTHROPIC_API_KEY) { console.error('❌  ANTHROPIC_API_KEY missing'); process.exit(1) }

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── types ─────────────────────────────────────────────────────────────────────
type Lesson  = { id: string; title: string; order_index: number; module_id: string }
type Section = { id: string; lesson_id: string; type: string; content: unknown; order_index: number }
type Module  = { id: string; course_id: string; title: string; order_index: number }

// ── helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

function isEmpty(content: unknown): boolean {
  if (content == null) return true
  if (typeof content === 'object') return Object.keys(content as object).length === 0
  if (typeof content === 'string') {
    const s = (content as string).trim()
    return s === '' || s === '{}' || s === 'null'
  }
  return false
}

function chunks<T>(arr: T[], n: number): T[][] {
  const out: T[][] = []
  for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n))
  return out
}

async function fetchAll<T>(builder: (from: number, to: number) => any): Promise<T[]> {
  const PAGE = 1000; let offset = 0; const all: T[] = []
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

// ── prompt builders ───────────────────────────────────────────────────────────
const GRAMMAR_SCHEMA = `{
  "topic": "grammar topic name",
  "explanation_ru": "detailed explanation in Russian (minimum 80 words)",
  "structure": "formula e.g. Subject + have/has + V3",
  "examples": [
    {"en": "...", "ru": "..."},
    {"en": "...", "ru": "..."},
    {"en": "...", "ru": "..."},
    {"en": "...", "ru": "..."},
    {"en": "...", "ru": "..."}
  ],
  "common_mistakes": [
    {"wrong": "incorrect usage", "correct": "correct usage", "note": "why"},
    {"wrong": "...", "correct": "...", "note": "..."},
    {"wrong": "...", "correct": "...", "note": "..."}
  ],
  "rules": [
    {"rule": "rule description", "example": "example usage"},
    {"rule": "...", "example": "..."}
  ]
}`

const VOCAB_SCHEMA = `{
  "words": [
    {"en": "word", "ru": "перевод", "example": "example sentence in English"},
    ... 20 words total
  ]
}`

const READING_SCHEMA = `{
  "title": "passage title",
  "text": "250-300 word English reading text on the topic",
  "level": "${TARGET_LEVEL}",
  "word_count": 275,
  "comprehension_questions": [
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."},
    {"question": "...", "answer": "..."}
  ],
  "vocabulary_in_context": [
    {"word": "...", "ru": "..."},
    {"word": "...", "ru": "..."},
    {"word": "...", "ru": "..."},
    {"word": "...", "ru": "..."},
    {"word": "...", "ru": "..."}
  ]
}`

const LISTENING_SCHEMA = `{
  "title": "listening topic title",
  "transcript": "120-150 word audio transcript",
  "level": "B2",
  "source_type": "conversation|lecture|news|podcast",
  "questions": [
    {"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "A"},
    {"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "B"},
    {"question": "...", "options": ["A) ...", "B) ...", "C) ...", "D) ..."], "answer": "C"}
  ],
  "vocabulary": [
    {"en": "...", "ru": "..."}
  ]
}`

const WRITING_SCHEMA = `{
  "task_type": "essay|letter|report|review",
  "title": "writing task title",
  "prompt": "writing task description (2-3 sentences)",
  "word_limit": 200,
  "structure": [
    {"section": "Introduction", "tips": "Start with a hook..."},
    {"section": "Main Body", "tips": "Include 2-3 main points..."},
    {"section": "Conclusion", "tips": "Summarise and give opinion..."}
  ],
  "useful_phrases": [
    {"phrase": "In addition to this,", "use": "adding a point"},
    {"phrase": "Despite the fact that,", "use": "contrast"},
    {"phrase": "It is widely believed that,", "use": "general statement"}
  ],
  "model_answer_hint": "brief 1-sentence description of ideal answer"
}`

const QUIZ_SCHEMA = `{
  "title": "quiz title",
  "questions": [
    {
      "id": 1,
      "type": "multiple_choice",
      "question": "...",
      "options": ["A) ...", "B) ...", "C) ...", "D) ..."],
      "answer": "A",
      "explanation": "why this is correct"
    },
    ... 5 questions total
  ]
}`

function buildPrompt(
  type: string, lessonTitle: string, moduleTitle: string, level: string
): string {
  const schemaMap: Record<string, string> = {
    grammar: GRAMMAR_SCHEMA, vocabulary: VOCAB_SCHEMA,
    reading: READING_SCHEMA, listening: LISTENING_SCHEMA,
    writing: WRITING_SCHEMA, quiz: QUIZ_SCHEMA,
  }
  const schema = schemaMap[type] ?? '{}'

  const typeInstructions: Record<string, string> = {
    grammar:
      `Explain the grammar rule from the lesson title in Russian (explanation_ru field, minimum 80 words). ` +
      `Provide the structure formula, EXACTLY 5 EN+RU examples at ${level} level, ` +
      `EXACTLY 3 common mistakes with wrong/correct/note format, and 2 key rules with examples.`,
    vocabulary:
      `Generate EXACTLY 20 vocabulary words relevant to the lesson topic. ` +
      `Each word must be appropriate for ${level} level, include Russian translation ` +
      `and a natural example sentence in English.`,
    reading:
      `Write a 250-300 word English reading passage on the lesson topic at ${level} level. ` +
      `Use rich vocabulary, clear paragraphs, and varied sentence structures. ` +
      `Add EXACTLY 4 comprehension questions with short answers, ` +
      `and EXACTLY 5 key words from the text with Russian translation.`,
    listening:
      `Write a natural 120-150 word spoken-English transcript (conversation, lecture or podcast) ` +
      `on the lesson topic at ${level} level. Add 3 multiple-choice comprehension questions ` +
      `(A/B/C/D) and mark the correct answer. Include 3 vocabulary items from the transcript.`,
    writing:
      `Create a ${level} writing task related to the lesson topic. ` +
      `Specify the task type (essay/letter/report/review), a clear prompt, word limit (~200), ` +
      `structural guidance for each section, 3 useful phrases, and a brief model-answer hint.`,
    quiz:
      `Generate 5 multiple-choice questions (A/B/C/D) testing knowledge of the lesson topic ` +
      `at ${level} level. Each question must have exactly one correct answer. ` +
      `Include a brief explanation of why the answer is correct.`,
  }

  const instructions = typeInstructions[type] ?? 'Generate appropriate lesson content.'

  return `You are an expert EFL content writer. Generate ${type} content for an English lesson.

Lesson: "${lessonTitle}"
Module: "${moduleTitle}"
Level: ${level}
Section type: ${type}

Instructions: ${instructions}

Return ONLY a single valid JSON object matching this schema exactly (no markdown, no extra text):
${schema}`
}

// ── Anthropic API call ────────────────────────────────────────────────────────
async function callAnthropic(prompt: string): Promise<unknown> {
  const resp = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type':      'application/json',
      'x-api-key':         ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model:      MODEL,
      max_tokens: 3000,
      messages:   [{ role: 'user', content: prompt }],
    }),
  })

  if (!resp.ok) {
    const body = await resp.text()
    throw new Error(`Anthropic API ${resp.status}: ${body.slice(0, 200)}`)
  }

  const json = await resp.json() as any
  const raw  = json?.content?.[0]?.text ?? ''

  // strip markdown code fences if model added them
  const cleaned = raw.replace(/^```(?:json)?\s*/i, '').replace(/\s*```\s*$/, '').trim()

  try {
    return JSON.parse(cleaned)
  } catch {
    throw new Error(`Invalid JSON from API: ${cleaned.slice(0, 120)}`)
  }
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔═══════════════════════════════════════════════════════════╗')
  console.log(`║  Fill Lesson Sections — Level: ${TARGET_LEVEL}${DRY_RUN ? ' [DRY RUN]' : ''}`.padEnd(62) + '║')
  console.log('╚═══════════════════════════════════════════════════════════╝')
  console.log(`  Model:   ${MODEL}`)
  console.log(`  Types:   ${TARGET_TYPES.join(', ')}`)
  console.log(`  Limit:   ${Number.isFinite(LIMIT) ? LIMIT + ' lessons' : 'all'}`)
  console.log('')

  // ── 1. Find target course ─────────────────────────────────────────────────
  const { data: course, error: ce } = await db
    .from('english_courses')
    .select('id, title, level')
    .eq('level', TARGET_LEVEL)
    .eq('category', 'General English')
    .single()
  if (ce || !course) throw new Error(`No GE course found for level ${TARGET_LEVEL}`)
  console.log(`📚  Course: ${course.title} (${course.level})  id=${course.id.slice(0,8)}`)

  // ── 2. Fetch modules ──────────────────────────────────────────────────────
  const modules = await fetchAll<Module>((from, to) =>
    db.from('english_modules').select('id, course_id, title, order_index')
      .eq('course_id', course.id).order('order_index').range(from, to)
  )
  const moduleMap = Object.fromEntries(modules.map(m => [m.id, m]))
  const moduleIds = modules.map(m => m.id)
  console.log(`📦  Modules: ${modules.length}`)

  // ── 3. Fetch lessons ──────────────────────────────────────────────────────
  const allLessons: Lesson[] = []
  for (const chunk of chunks(moduleIds, 20)) {
    const rows = await fetchAll<Lesson>((from, to) =>
      db.from('english_lessons').select('id, title, order_index, module_id')
        .in('module_id', chunk).order('order_index').range(from, to)
    )
    allLessons.push(...rows)
  }
  const lessonIds = allLessons.map(l => l.id)
  console.log(`📖  Lessons: ${allLessons.length}`)

  // ── 4. Fetch ALL sections for these lessons (in chunks to avoid URL limit) ─
  const allSections: Section[] = []
  for (const chunk of chunks(lessonIds, 50)) {
    const rows = await fetchAll<Section>((from, to) =>
      db.from('english_lesson_sections')
        .select('id, lesson_id, type, content, order_index')
        .in('lesson_id', chunk)
        .eq('is_active', true)
        .range(from, to)
    )
    allSections.push(...rows)
  }

  // keep only target types; OVERWRITE=1 includes already-filled sections
  const emptySections = allSections.filter(s =>
    TARGET_TYPES.includes(s.type) && (OVERWRITE || isEmpty(s.content))
  )

  console.log(`🗂️   Total sections: ${allSections.length}`)
  console.log(`⚠️   ${OVERWRITE ? 'To overwrite (target types)' : 'Empty (target types)'}: ${emptySections.length}`)
  if (OVERWRITE) console.log('♻️   OVERWRITE mode — all existing content will be replaced')
  console.log('')

  if (emptySections.length === 0) {
    console.log('✅  Nothing to fill — all sections already have content.')
    return
  }

  // ── 5. Group empty sections by lesson ─────────────────────────────────────
  const sectionsByLesson: Record<string, Section[]> = {}
  for (const sec of emptySections) {
    if (!sectionsByLesson[sec.lesson_id]) sectionsByLesson[sec.lesson_id] = []
    sectionsByLesson[sec.lesson_id].push(sec)
  }

  // Sort lessons by module order then lesson order
  const lessonOrder = Object.fromEntries(allLessons.map(l => [l.id, l.order_index]))
  const moduleOrder = Object.fromEntries(modules.map(m => [m.id, m.order_index]))

  const lessonsToProcess = allLessons
    .filter(l => sectionsByLesson[l.id]?.length > 0)
    .sort((a, b) => {
      const moa = moduleOrder[a.module_id] ?? 0, mob = moduleOrder[b.module_id] ?? 0
      if (moa !== mob) return moa - mob
      return (lessonOrder[a.id] ?? 0) - (lessonOrder[b.id] ?? 0)
    })
    .slice(0, LIMIT)

  const totalSectionsToFill = lessonsToProcess.reduce(
    (sum, l) => sum + (sectionsByLesson[l.id]?.length ?? 0), 0
  )

  console.log(`🎯  Lessons to process: ${lessonsToProcess.length} (${totalSectionsToFill} sections)`)
  if (DRY_RUN) console.log('🔍  DRY RUN — no API calls, no DB writes\n')
  console.log('')

  // ── 6. Process in batches ─────────────────────────────────────────────────
  let filled = 0; let errors = 0; let skipped = 0

  const lessonBatches = chunks(lessonsToProcess, BATCH_LESSONS)

  for (let bi = 0; bi < lessonBatches.length; bi++) {
    const batch = lessonBatches[bi]
    console.log(`\n─── Batch ${bi + 1}/${lessonBatches.length} (${batch.length} lessons) ───────────────────`)

    for (const lesson of batch) {
      const mod      = moduleMap[lesson.module_id]
      const modLabel = mod ? `mod-${mod.order_index} "${mod.title}"` : lesson.module_id.slice(0, 8)
      const sections = sectionsByLesson[lesson.id] ?? []

      for (const sec of sections) {
        const tag = `[${TARGET_LEVEL}] ${modLabel} → "${lesson.title}" [${sec.type}]`

        if (!OVERWRITE && !isEmpty(sec.content)) {
          console.log(`  ⏭   ${tag} — already filled, skip`)
          skipped++
          continue
        }

        if (DRY_RUN) {
          const prompt = buildPrompt(sec.type, lesson.title, mod?.title ?? '', course.level)
          console.log(`  🔍  ${tag}`)
          console.log(`       Prompt length: ${prompt.length} chars`)
          filled++
          continue
        }

        // ── API call ────────────────────────────────────────────────────────
        try {
          const prompt  = buildPrompt(sec.type, lesson.title, mod?.title ?? '', course.level)
          const content = await callAnthropic(prompt)

          // ── DB update ───────────────────────────────────────────────────────
          const { error: ue } = await db
            .from('english_lesson_sections')
            .update({ content })
            .eq('id', sec.id)

          if (ue) throw new Error('DB update: ' + ue.message)

          console.log(`  ✅  ${tag}`)
          filled++
        } catch (err: any) {
          console.error(`  ❌  ${tag}`)
          console.error(`       ${err.message}`)
          errors++
        }

        // ── rate limit delay ────────────────────────────────────────────────
        await sleep(DELAY_MS)
      }
    }

    // short pause between batches
    if (bi < lessonBatches.length - 1) {
      process.stdout.write(`  ⏳  Batch pause (${DELAY_MS}ms)...`)
      await sleep(DELAY_MS)
      console.log(' done')
    }
  }

  // ── 7. Summary ────────────────────────────────────────────────────────────
  console.log('\n' + '═'.repeat(60))
  console.log(`  ${DRY_RUN ? '[DRY RUN] ' : ''}DONE`)
  console.log('═'.repeat(60))
  console.log(`  ✅  Filled:  ${filled}`)
  console.log(`  ❌  Errors:  ${errors}`)
  console.log(`  ⏭   Skipped: ${skipped}`)
  console.log(`  📊  Total:   ${filled + errors + skipped}`)
  console.log('═'.repeat(60))

  if (errors > 0) {
    console.log('\n⚠️   Some sections failed. Re-run the script to retry only empties.')
  }
}

main().catch(err => {
  console.error('\n💥', err.message)
  process.exit(1)
})
