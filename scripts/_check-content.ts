import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

function loadEnv() {
  const f = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(f)) return
  fs.readFileSync(f, 'utf-8').split('\n').forEach(line => {
    const t = line.trim(); if (!t || t.startsWith('#')) return
    const i = t.indexOf('='); if (i < 0) return
    const key = t.slice(0, i).trim()
    const val = t.slice(i+1).trim().replace(/^['"]|['"]$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  })
}
loadEnv()

const db = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

async function fetchAll<T>(builder: (from: number, to: number) => any): Promise<T[]> {
  const PAGE = 1000; let offset = 0; const all: T[] = []
  for (;;) {
    const { data, error } = await builder(offset, offset + PAGE - 1)
    if (error) throw new Error(error.message)
    if (!data || data.length === 0) break
    all.push(...data)
    if (data.length < PAGE) break
    offset += PAGE
  }
  return all
}

async function main() {
  // ── B1 grammar check ──────────────────────────────────────────────────────
  const { data: b1courses } = await db.from('english_courses').select('id').eq('level', 'B1').eq('category', 'General English')
  const b1cIds = (b1courses ?? []).map((c: any) => c.id)
  console.log(`B1 courses: ${b1cIds.length}`)

  const b1mods = await fetchAll<any>((f, t) => db.from('english_modules').select('id').in('course_id', b1cIds).range(f, t))
  const b1modIds = b1mods.map((m: any) => m.id)
  const b1less = await fetchAll<any>((f, t) => db.from('english_lessons').select('id').in('module_id', b1modIds).range(f, t))
  const b1lesIds = b1less.map((l: any) => l.id)
  console.log(`B1 lessons: ${b1lesIds.length}`)

  // Check grammar sections in batches of 50
  let b1grammarTotal = 0, b1grammarFilled = 0
  for (let i = 0; i < b1lesIds.length; i += 50) {
    const chunk = b1lesIds.slice(i, i + 50)
    const { data } = await db.from('english_lesson_sections').select('content').in('lesson_id', chunk).eq('type', 'grammar')
    b1grammarTotal += data?.length ?? 0
    b1grammarFilled += (data ?? []).filter((s: any) => s.content && JSON.stringify(s.content) !== '{}').length
  }
  console.log(`\nB1 grammar sections — total: ${b1grammarTotal}, filled: ${b1grammarFilled}, EMPTY: ${b1grammarTotal - b1grammarFilled}`)

  // ── B2 reading sample ──────────────────────────────────────────────────────
  const { data: b2courses } = await db.from('english_courses').select('id').eq('level', 'B2').eq('category', 'General English')
  const b2cIds = (b2courses ?? []).map((c: any) => c.id)
  const b2mods = await fetchAll<any>((f, t) => db.from('english_modules').select('id').in('course_id', b2cIds).range(f, t))
  const b2modIds = b2mods.map((m: any) => m.id)
  const b2less = await fetchAll<any>((f, t) => db.from('english_lessons').select('id').in('module_id', b2modIds).range(f, t))
  const b2lesIds = b2less.map((l: any) => l.id)
  console.log(`\nB2 lessons: ${b2lesIds.length}`)

  // Find first filled reading section
  let sample: any = null
  for (let i = 0; i < b2lesIds.length; i += 50) {
    const chunk = b2lesIds.slice(i, i + 50)
    const { data } = await db.from('english_lesson_sections').select('content').in('lesson_id', chunk).eq('type', 'reading').neq('content', '{}').limit(1)
    if (data?.length) { sample = data[0].content; break }
  }

  if (!sample) { console.log('No B2 reading content found'); return }
  console.log('\n=== B2 READING SAMPLE ===')
  console.log('Keys:', Object.keys(sample))
  if (sample.text) {
    const wc = sample.text.trim().split(/\s+/).length
    console.log(`Word count: ${wc}`)
    console.log('Preview:', sample.text.slice(0, 400))
  }
  if (sample.comprehension_questions) console.log(`\nComprehension Q count: ${sample.comprehension_questions.length}`)
  if (sample.vocabulary_in_context) console.log(`VIC count: ${sample.vocabulary_in_context.length}, sample:`, JSON.stringify(sample.vocabulary_in_context[0]))

  // ── B2 vocab sample ────────────────────────────────────────────────────────
  let vocSample: any = null
  for (let i = 0; i < b2lesIds.length; i += 50) {
    const chunk = b2lesIds.slice(i, i + 50)
    const { data } = await db.from('english_lesson_sections').select('content').in('lesson_id', chunk).eq('type', 'vocabulary').neq('content', '{}').limit(1)
    if (data?.length) { vocSample = data[0].content; break }
  }
  if (vocSample?.words) {
    console.log(`\nB2 vocab word count: ${vocSample.words.length}, sample:`, JSON.stringify(vocSample.words[0]))
  }
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1) })
