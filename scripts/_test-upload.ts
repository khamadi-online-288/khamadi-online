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

async function main() {
  console.log('URL:', process.env.NEXT_PUBLIC_SUPABASE_URL?.slice(0, 50))

  // Test 1: list buckets
  const { data: buckets, error: be } = await db.storage.listBuckets()
  console.log('Buckets:', buckets?.map((b: any) => b.name), be?.message ?? 'OK')

  // Test 2: small upload
  const small = Buffer.from('test')
  const { error: se } = await db.storage.from('textbooks').upload('_test_small.txt', small, { upsert: true, contentType: 'text/plain' })
  console.log('Small upload (4 bytes):', se ? 'FAILED: ' + se.message : 'OK')

  // Test 3: upload one real PDF
  const pdfPath = path.join(__dirname, '..', 'public', 'textbooks', 'c1-advanced.pdf')
  console.log('PDF size:', Math.round(fs.statSync(pdfPath).size / 1024), 'KB')
  const buf = fs.readFileSync(pdfPath)
  const { error: pe } = await db.storage.from('textbooks').upload('student/c1-advanced.pdf', buf, { upsert: true, contentType: 'application/pdf' })
  console.log('PDF upload:', pe ? 'FAILED: ' + pe.message : 'OK')
}

main().catch(e => { console.error('FATAL:', e.message); process.exit(1) })
