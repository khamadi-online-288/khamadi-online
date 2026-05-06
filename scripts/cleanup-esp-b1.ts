/**
 * Cleanup: remove old B1-only ESP courses, keep only B1-C1 full versions.
 *
 * Run:
 *   npx ts-node --project tsconfig.scripts.json scripts/cleanup-esp-b1.ts
 */

import * as fs from 'fs'
import * as path from 'path'
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// ── load .env.local ───────────────────────────────────────────────────────────
function loadEnv() {
  const envFile = path.join(process.cwd(), '.env.local')
  if (!fs.existsSync(envFile)) return
  fs.readFileSync(envFile, 'utf-8').split('\n').forEach(line => {
    const t = line.trim()
    if (!t || t.startsWith('#')) return
    const idx = t.indexOf('=')
    if (idx < 0) return
    const key = t.slice(0, idx).trim()
    const val = t.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '')
    if (key && !(key in process.env)) process.env[key] = val
  })
}
loadEnv()

const db: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { persistSession: false } }
)

// ── IDs to DELETE (old B1-only versions) ─────────────────────────────────────
const TO_DELETE = [
  { id: 'c52350cf-0c6e-4e0d-83da-6e2668b2ba91', name: 'Accounting B1'       },
  { id: '9d3d5a99-ba18-4136-807c-d1a347d438fa', name: 'Computer Science B1' },
  { id: '13f80caf-c0ea-4cae-bb68-225c418d6b7b', name: 'Finance Industry B1' },
  { id: '41f65a3f-2d1e-4201-a249-7d7b5f255352', name: 'Management B1'       },
  { id: '2c78884e-4b41-4dcd-b153-4b696bf89621', name: 'Law B1'              },
  { id: '45800af0-cc5a-4787-bf49-a58bcfda9f1a', name: 'Social Sciences B1'  },
  { id: 'ee93b087-d1fe-4b85-838f-1cf7269877f1', name: 'Hospitality A2'      },
]

// ── IDs to KEEP (full B1-C1 versions) ────────────────────────────────────────
const TO_KEEP = [
  { id: 'a1000000-0000-0000-0000-000000000007', name: 'Computer Science B1-C1' },
  { id: 'a1000000-0000-0000-0000-000000000006', name: 'Accounting B1-C1'       },
  { id: 'a1000000-0000-0000-0000-000000000010', name: 'Finance Industry B1-C1' },
  { id: 'a1000000-0000-0000-0000-000000000008', name: 'Hospitality A2-B1'      },
  { id: 'a1000000-0000-0000-0000-000000000012', name: 'Law B1-C1'              },
  { id: 'a1000000-0000-0000-0000-000000000009', name: 'Management B1-C1'       },
  { id: 'a1000000-0000-0000-0000-000000000011', name: 'Social Sciences B1-C1'  },
]

const DELETE_IDS = TO_DELETE.map(c => c.id)

// ── helpers ───────────────────────────────────────────────────────────────────
async function count(table: string, courseId: string): Promise<number> {
  const { count } = await db.from(table).select('id', { count: 'exact', head: true }).eq('course_id', courseId)
  return count ?? 0
}

// ── main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log('╔══════════════════════════════════════════════════════╗')
  console.log('║        ESP B1-only Cleanup — KHAMADI ONLINE          ║')
  console.log('╚══════════════════════════════════════════════════════╝\n')

  // ── Step 1: Verify courses exist in DB ────────────────────────────────────
  console.log('🔍 Verifying courses to delete...\n')
  const { data: existingCourses } = await db
    .from('english_courses')
    .select('id, title, level')
    .in('id', DELETE_IDS)

  const existingMap = new Map((existingCourses ?? []).map(c => [c.id, c]))

  let totalLessons = 0
  let totalModules = 0

  for (const c of TO_DELETE) {
    const found = existingMap.get(c.id)
    if (!found) {
      console.log(`  ⚠️  NOT FOUND: ${c.name} (${c.id.slice(0, 8)})`)
      continue
    }
    const mods = await count('english_modules', c.id)
    const less = await count('english_lessons', c.id)
    totalModules += mods
    totalLessons += less
    console.log(`  ✓  ${found.title} ${found.level} — ${mods} modules, ${less} lessons`)
  }

  console.log(`\n  TOTAL: ${existingMap.size}/${TO_DELETE.length} courses found`)
  console.log(`         ${totalModules} modules  +  ${totalLessons} lessons will be deleted\n`)

  // ── Step 2: Verify courses to keep still exist ────────────────────────────
  console.log('✅ Verifying courses to KEEP...\n')
  const keepIds = TO_KEEP.map(c => c.id)
  const { data: keepCourses } = await db
    .from('english_courses')
    .select('id, title, level')
    .in('id', keepIds)

  const keepMap = new Map((keepCourses ?? []).map(c => [c.id, c]))
  for (const c of TO_KEEP) {
    const found = keepMap.get(c.id)
    if (!found) {
      console.error(`  ❌  MISSING keep-course: ${c.name} (${c.id})`)
      console.error('\nAborting — one or more keep-courses are missing!')
      process.exit(1)
    }
    const mods = await count('english_modules', c.id)
    const less = await count('english_lessons', c.id)
    console.log(`  ✓  ${found.title} ${found.level} — ${mods} modules, ${less} lessons`)
  }

  // ── Safety check: none of the DELETE IDs appear in keep list ─────────────
  const keepSet = new Set(keepIds)
  for (const id of DELETE_IDS) {
    if (keepSet.has(id)) {
      console.error(`\n❌ SAFETY CHECK FAILED: ${id} is in both delete and keep lists!`)
      process.exit(1)
    }
  }

  // ── Step 3: Delete lessons ────────────────────────────────────────────────
  console.log('\n🗑️  Step 1/3 — Deleting lessons...')
  const { error: e1, count: deletedLessons } = await db
    .from('english_lessons')
    .delete({ count: 'exact' })
    .in('course_id', DELETE_IDS)

  if (e1) {
    console.error('❌ Error deleting lessons:', e1.message)
    process.exit(1)
  }
  console.log(`   ✅ Deleted ${deletedLessons ?? '?'} lessons`)

  // ── Step 4: Delete modules ────────────────────────────────────────────────
  console.log('🗑️  Step 2/3 — Deleting modules...')
  const { error: e2, count: deletedModules } = await db
    .from('english_modules')
    .delete({ count: 'exact' })
    .in('course_id', DELETE_IDS)

  if (e2) {
    console.error('❌ Error deleting modules:', e2.message)
    process.exit(1)
  }
  console.log(`   ✅ Deleted ${deletedModules ?? '?'} modules`)

  // ── Step 5: Delete courses ────────────────────────────────────────────────
  console.log('🗑️  Step 3/3 — Deleting courses...')
  const { error: e3, count: deletedCourses } = await db
    .from('english_courses')
    .delete({ count: 'exact' })
    .in('id', DELETE_IDS)

  if (e3) {
    console.error('❌ Error deleting courses:', e3.message)
    process.exit(1)
  }
  console.log(`   ✅ Deleted ${deletedCourses ?? '?'} courses`)

  // ── Step 6: Final state verification ─────────────────────────────────────
  console.log('\n📊 Final state verification...\n')
  const { data: remaining } = await db
    .from('english_courses')
    .select('id, title, level, category')
    .eq('category', 'English for Special Purposes')
    .order('level')

  console.log(`  ESP courses remaining: ${remaining?.length ?? 0}`)
  for (const c of remaining ?? []) {
    const mods = await count('english_modules', c.id)
    const less = await count('english_lessons', c.id)
    console.log(`    ✓  ${c.title} (${c.level}) — ${mods} modules, ${less} lessons`)
  }

  const { count: totalLessonsLeft } = await db
    .from('english_lessons')
    .select('id', { count: 'exact', head: true })

  console.log(`\n  Total lessons in DB: ${totalLessonsLeft}`)
  console.log('\n🎉 Cleanup complete!')
}

main().catch(err => {
  console.error('\n💥 Fatal error:', err.message)
  process.exit(1)
})
