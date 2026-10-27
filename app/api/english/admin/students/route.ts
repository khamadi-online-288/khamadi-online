import { NextRequest, NextResponse } from 'next/server'
import { createClient, type User } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const PAGE = 1000
const PARALLEL_PAGES = 10

interface StudentRow {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; last_active_at: string | null
  group_id: string | null
}

// Migration 055 resolves the name in SQL and strips null fields, so meta_name is absent there
interface AdminStudentRow extends Partial<Omit<StudentRow, 'user_id'>> {
  user_id: string; email: string; meta_name?: string; lessons_done: number
}

type PageResult<T> = PromiseLike<{ data: T[] | null; error: { message: string } | null }>

/** Fetches every row of a query in PAGE-sized chunks, PARALLEL_PAGES at a time. */
async function fetchAllRows<T>(query: (from: number, to: number) => PageResult<T>): Promise<T[]> {
  const rows: T[] = []
  for (let start = 0; ; start += PAGE * PARALLEL_PAGES) {
    const pages = await Promise.all(
      Array.from({ length: PARALLEL_PAGES }, (_, i) => {
        const from = start + i * PAGE
        return query(from, from + PAGE - 1)
      })
    )
    for (const { data, error } of pages) {
      if (error) throw new Error(error.message)
      rows.push(...(data ?? []))
    }
    if ((pages[pages.length - 1].data?.length ?? 0) < PAGE) return rows
  }
}

async function listAllAuthUsers(): Promise<User[]> {
  const users: User[] = []
  for (let page = 1; page <= 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: PAGE })
    if (error) throw new Error(error.message)
    users.push(...data.users)
    if (data.users.length < PAGE) break
  }
  return users
}

function readMetaName(meta: Record<string, unknown> | undefined): string {
  const full = meta?.full_name
  if (typeof full === 'string' && full.trim()) return full.trim()
  const name = meta?.name
  return typeof name === 'string' ? name.trim() : ''
}

/** Same rule as the student cabinet: Auth metadata wins over the profile row. */
function resolveDisplayedName(dbName: string | null, metaName: string, email: string): string | null {
  const emailSlug = email.split('@')[0] ?? ''
  if (metaName && metaName !== emailSlug) return metaName
  if (dbName && dbName !== emailSlug) return dbName
  return dbName || metaName || null
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Role check runs alongside the data queries to save a round trip; data is discarded if not admin
  const [profileRes, studentsRes, groupsRes] = await Promise.all([
    admin.from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle(),
    loadStudents().then(
      rows => ({ rows, error: null }),
      (e: unknown) => ({ rows: [] as AdminStudentRow[], error: e instanceof Error ? e.message : 'Failed to load students' }),
    ),
    // Service role bypasses RLS
    admin.from('english_groups').select('id, name').order('name'),
  ])
  if (!profileRes.data || profileRes.data.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const loadError = studentsRes.error ?? groupsRes.error?.message
  if (loadError) return NextResponse.json({ error: loadError }, { status: 500 })
  const groups = groupsRes.data ?? []

  const enriched = studentsRes.rows.map(({ meta_name, ...s }) => ({
    ...s,
    full_name: resolveDisplayedName(s.full_name ?? null, meta_name ?? '', s.email),
  }))

  return NextResponse.json({ students: enriched, groups })
}

/** Single aggregated query (migration 054); falls back to pagination if the function is missing. */
async function loadStudents(): Promise<AdminStudentRow[]> {
  const { data, error } = await admin.rpc('english_admin_students')
  if (!error) return (data ?? []) as AdminStudentRow[]
  // PGRST202 = function not found in schema cache (migration 054 not applied yet)
  if (error.code !== 'PGRST202') throw new Error(error.message)
  return loadStudentsPaginated()
}

async function loadStudentsPaginated(): Promise<AdminStudentRow[]> {
  // PostgREST and Auth both cap responses at 1000 rows, so every list is paginated
  const [students, authUsers, progress] = await Promise.all([
    fetchAllRows<StudentRow>((from, to) => admin
      .from('english_user_profiles')
      .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
      .eq('role', 'student')
      .order('last_active_at', { ascending: false, nullsFirst: false })
      .order('user_id')
      .range(from, to)),
    listAllAuthUsers(),
    fetchAllRows<{ user_id: string }>((from, to) => admin
      .from('english_lesson_progress')
      .select('user_id')
      .eq('completed', true)
      .order('user_id')
      .order('lesson_id')
      .range(from, to)),
  ])

  const authById = new Map(authUsers.map(u => [u.id, u]))
  const lessonCounts: Record<string, number> = {}
  progress.forEach(r => {
    lessonCounts[r.user_id] = (lessonCounts[r.user_id] ?? 0) + 1
  })

  return students.map(s => {
    const u = authById.get(s.user_id)
    return {
      ...s,
      email: u?.email ?? '',
      meta_name: readMetaName(u?.user_metadata as Record<string, unknown> | undefined),
      lessons_done: lessonCounts[s.user_id] ?? 0,
    }
  })
}
