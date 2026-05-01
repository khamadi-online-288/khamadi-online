import * as fs from 'fs'
import * as path from 'path'

function loadEnv() {
  const envFile = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envFile)) return
  const lines = fs.readFileSync(envFile, 'utf-8').split('\n')
  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const idx = trimmed.indexOf('=')
    if (idx < 0) continue
    const key = trimmed.slice(0, idx).trim()
    const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  }
}
loadEnv()

/**
 * Upload generated textbooks to Supabase Storage and insert records.
 *
 * Run AFTER generate-textbooks.ts and generate-teacher-guides.ts:
 *   npx ts-node --project tsconfig.scripts.json scripts/upload-textbooks.ts
 *
 * Requires in .env.local:
 *   NEXT_PUBLIC_SUPABASE_URL=...
 *   SUPABASE_SERVICE_ROLE_KEY=...
 */

import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!
const SERVICE_KEY  = process.env.SUPABASE_SERVICE_ROLE_KEY!
const BUCKET       = 'textbooks'

if (!SUPABASE_URL || !SERVICE_KEY) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY')
}

const db = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { persistSession: false },
})

// ── Textbook metadata ─────────────────────────────────────────────────────────

interface TextbookMeta {
  file: string
  title: string
  type: 'student' | 'teacher'
  level: string
  field: string
  storageFolder: string
}

const STUDENT_TEXTBOOKS: TextbookMeta[] = [
  { file: 'a1-beginner.pdf',           title: 'A1 Beginner English',                     type: 'student', level: 'A1',     field: 'General English',        storageFolder: 'student' },
  { file: 'a1-elementary.pdf',          title: 'A1 Elementary English',                   type: 'student', level: 'A1+',    field: 'General English',        storageFolder: 'student' },
  { file: 'a2-pre-intermediate.pdf',    title: 'A2 Pre-Intermediate English',             type: 'student', level: 'A2',     field: 'General English',        storageFolder: 'student' },
  { file: 'b1-intermediate.pdf',        title: 'B1 Intermediate English',                 type: 'student', level: 'B1',     field: 'General English',        storageFolder: 'student' },
  { file: 'b2-upper-intermediate.pdf',  title: 'B2 Upper-Intermediate English',           type: 'student', level: 'B2',     field: 'General English',        storageFolder: 'student' },
  { file: 'c1-advanced.pdf',            title: 'C1 Advanced English',                     type: 'student', level: 'C1',     field: 'General English',        storageFolder: 'student' },
  { file: 'esp-accounting.pdf',         title: 'Accounting Vocabulary Textbook',          type: 'student', level: 'B1–C1', field: 'Accounting & Finance',   storageFolder: 'student' },
  { file: 'esp-cs.pdf',                 title: 'Computer Science Vocabulary Textbook',    type: 'student', level: 'B1–C1', field: 'Computer Science & IT',  storageFolder: 'student' },
  { file: 'esp-hospitality.pdf',        title: 'Hospitality Vocabulary Textbook',         type: 'student', level: 'A2–B1', field: 'Hospitality & Tourism',  storageFolder: 'student' },
  { file: 'esp-management.pdf',         title: 'Management Vocabulary Textbook',          type: 'student', level: 'B1–C1', field: 'Business & Management',  storageFolder: 'student' },
  { file: 'esp-finance.pdf',            title: 'Finance Industry Vocabulary Textbook',    type: 'student', level: 'B1–C1', field: 'Finance & Banking',      storageFolder: 'student' },
  { file: 'esp-social.pdf',             title: 'Social Sciences Vocabulary Textbook',     type: 'student', level: 'B1–C1', field: 'Social Sciences',        storageFolder: 'student' },
  { file: 'esp-law.pdf',                title: 'Law Vocabulary Textbook',                 type: 'student', level: 'B1–C1', field: 'Law & Legal Studies',    storageFolder: 'student' },
]

const TEACHER_GUIDES: TextbookMeta[] = [
  { file: 'teacher-guide-general.pdf',          title: 'KHAMADI ENGLISH General Teacher Guide',       type: 'teacher', level: 'All',    field: 'General',               storageFolder: 'teacher' },
  { file: 'teacher-guide-a1-beginner.pdf',      title: 'Teacher Guide: A1 Beginner English',          type: 'teacher', level: 'A1',     field: 'General English',       storageFolder: 'teacher' },
  { file: 'teacher-guide-accounting.pdf',        title: 'Teacher Guide: Accounting Vocabulary',        type: 'teacher', level: 'B1–C1', field: 'Accounting & Finance',  storageFolder: 'teacher' },
  { file: 'teacher-guide-finance.pdf',           title: 'Teacher Guide: Finance Industry Vocabulary',  type: 'teacher', level: 'B1–C1', field: 'Finance & Banking',     storageFolder: 'teacher' },
  { file: 'teacher-guide-cs.pdf',                title: 'Teacher Guide: Computer Science Vocabulary',  type: 'teacher', level: 'B1–C1', field: 'Computer Science & IT', storageFolder: 'teacher' },
  { file: 'teacher-guide-hospitality.pdf',       title: 'Teacher Guide: Hospitality Vocabulary',      type: 'teacher', level: 'A2–B1', field: 'Hospitality & Tourism', storageFolder: 'teacher' },
  { file: 'teacher-guide-management.pdf',        title: 'Teacher Guide: Management Vocabulary',       type: 'teacher', level: 'B1–C1', field: 'Business & Management', storageFolder: 'teacher' },
  { file: 'teacher-guide-law.pdf',               title: 'Teacher Guide: Law Vocabulary',              type: 'teacher', level: 'B1–C1', field: 'Law & Legal Studies',   storageFolder: 'teacher' },
  { file: 'teacher-guide-social.pdf',            title: 'Teacher Guide: Social Sciences Vocabulary',  type: 'teacher', level: 'B1–C1', field: 'Social Sciences',       storageFolder: 'teacher' },
]

// ── Ensure storage bucket exists ──────────────────────────────────────────────

async function ensureBucket() {
  const { data: buckets } = await db.storage.listBuckets()
  const exists = buckets?.some(b => b.name === BUCKET)
  if (!exists) {
    const { error } = await db.storage.createBucket(BUCKET, {
      public: true,
      fileSizeLimit: 52428800, // 50MB
      allowedMimeTypes: ['application/pdf'],
    })
    if (error) throw new Error(`Failed to create bucket: ${error.message}`)
    console.log(`✅ Created storage bucket: ${BUCKET}`)
  } else {
    console.log(`ℹ️  Bucket "${BUCKET}" already exists`)
  }
}

// ── Upload a single PDF ───────────────────────────────────────────────────────

async function uploadFile(localPath: string, storagePath: string): Promise<string> {
  if (!fs.existsSync(localPath)) {
    console.warn(`  ⚠️  File not found, skipping: ${localPath}`)
    return ''
  }
  const fileBuffer = fs.readFileSync(localPath)
  const { error } = await db.storage
    .from(BUCKET)
    .upload(storagePath, fileBuffer, {
      contentType: 'application/pdf',
      upsert: true,
    })
  if (error) throw new Error(`Upload failed for ${storagePath}: ${error.message}`)
  const { data } = db.storage.from(BUCKET).getPublicUrl(storagePath)
  return data.publicUrl
}

// ── Insert record into english_textbooks ─────────────────────────────────────

async function insertTextbookRecord(
  meta: TextbookMeta,
  fileUrl: string,
  pages: number,
) {
  // Skip if file wasn't uploaded
  if (!fileUrl) return

  // Try to find matching course_id
  const { data: course } = await db
    .from('english_courses')
    .select('id')
    .ilike('title', `%${meta.field.split(' ')[0]}%`)
    .maybeSingle()

  const { error } = await db.from('english_textbooks').upsert({
    title:     meta.title,
    course_id: course?.id ?? null,
    book_type: meta.type,
    language:  'bilingual',
    level:     meta.level,
    field:     meta.field,
    file_url:  fileUrl,
    file_name: meta.file,
    pages,
  }, { onConflict: 'title' })

  if (error) console.warn(`  ⚠️  DB insert failed for "${meta.title}": ${error.message}`)
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  console.log('📤 KHAMADI ENGLISH — Textbook Upload')
  console.log('=====================================')

  await ensureBucket()
  console.log('')

  const studentDir = path.join(__dirname, '..', 'public', 'textbooks')
  const teacherDir = path.join(__dirname, '..', 'public', 'textbooks', 'teacher')

  // Upload student textbooks
  console.log('📖 Uploading student textbooks...')
  for (const meta of STUDENT_TEXTBOOKS) {
    const localPath = path.join(studentDir, meta.file)
    const storagePath = `student/${meta.file}`
    try {
      const url = await uploadFile(localPath, storagePath)
      if (url) {
        const stats = fs.existsSync(localPath) ? fs.statSync(localPath) : null
        await insertTextbookRecord(meta, url, 0)
        console.log(`  ✅ ${meta.title}`)
      }
    } catch (e: any) {
      console.error(`  ❌ ${meta.title}: ${e.message}`)
    }
  }

  // Upload teacher guides
  console.log('')
  console.log('📋 Uploading teacher guides...')
  for (const meta of TEACHER_GUIDES) {
    const localPath = path.join(teacherDir, meta.file)
    const storagePath = `teacher/${meta.file}`
    try {
      const url = await uploadFile(localPath, storagePath)
      if (url) {
        await insertTextbookRecord(meta, url, 0)
        console.log(`  ✅ ${meta.title}`)
      }
    } catch (e: any) {
      console.error(`  ❌ ${meta.title}: ${e.message}`)
    }
  }

  console.log('')
  console.log('=====================================')
  console.log('✅ Upload complete!')
  console.log('📊 Check the english_textbooks table in Supabase.')
}

main().catch(err => {
  console.error('❌ Fatal error:', err)
  process.exit(1)
})
