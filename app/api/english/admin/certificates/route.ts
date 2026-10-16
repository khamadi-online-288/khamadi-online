import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { LEVEL_CERTS, earnedCertsFromProgress, levelCertNumber } from '@/lib/english/zku-level-certs'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } },
)

function readMetaName(meta: Record<string, unknown> | undefined): string {
  const full = meta?.full_name
  if (typeof full === 'string' && full.trim()) return full.trim()
  const name = meta?.name
  return typeof name === 'string' ? name.trim() : ''
}

function resolveDisplayedName(dbName: string | null, metaName: string, email: string): string | null {
  const emailSlug = email.split('@')[0] ?? ''
  if (metaName && metaName !== emailSlug) return metaName
  if (dbName && dbName !== emailSlug) return dbName
  return dbName || metaName || null
}

interface ProfileRow {
  user_id: string
  full_name: string | null
  group_id: string | null
}

interface ExamRow {
  user_id: string
  lesson_id: string
  completed_at: string | null
}

interface GroupRow {
  id: string
  name: string
}

async function listAuthUsers(): Promise<{ emailMap: Record<string, string>; metaNameMap: Record<string, string> }> {
  const emailMap: Record<string, string> = {}
  const metaNameMap: Record<string, string> = {}
  for (let page = 1; page <= 20; page += 1) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw error
    const users = data.users ?? []
    users.forEach(user => {
      emailMap[user.id] = user.email ?? ''
      metaNameMap[user.id] = readMetaName(user.user_metadata as Record<string, unknown> | undefined)
    })
    if (users.length < 1000) break
  }
  return { emailMap, metaNameMap }
}

async function listExamProgress(): Promise<ExamRow[]> {
  const examIds = LEVEL_CERTS.flatMap(cert => cert.lessons)
  const rows: ExamRow[] = []
  const pageSize = 1000
  for (let from = 0; from < 20000; from += pageSize) {
    const { data, error } = await admin
      .from('english_lesson_progress')
      .select('user_id, lesson_id, completed_at')
      .eq('completed', true)
      .in('lesson_id', examIds)
      .range(from, from + pageSize - 1)
    if (error) throw error
    const batch = (data ?? []) as ExamRow[]
    rows.push(...batch)
    if (batch.length < pageSize) break
  }
  return rows
}

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!caller || caller.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  try {
    const [{ data: profiles, error: profileErr }, { data: groups, error: groupErr }, examRows, authMaps] = await Promise.all([
      admin
        .from('english_user_profiles')
        .select('user_id, full_name, group_id')
        .eq('role', 'student'),
      admin.from('english_groups').select('id, name'),
      listExamProgress(),
      listAuthUsers(),
    ])
    if (profileErr) return NextResponse.json({ error: profileErr.message }, { status: 500 })
    if (groupErr) return NextResponse.json({ error: groupErr.message }, { status: 500 })

    const profileMap = new Map((profiles as ProfileRow[] | null ?? []).map(row => [row.user_id, row]))
    const groupMap = new Map((groups as GroupRow[] | null ?? []).map(row => [row.id, row.name]))
    const byUser = new Map<string, { lesson_id: string; completed_at: string | null }[]>()
    examRows.forEach(row => {
      const list = byUser.get(row.user_id) ?? []
      list.push({ lesson_id: row.lesson_id, completed_at: row.completed_at })
      byUser.set(row.user_id, list)
    })

    const certificates = [...byUser.entries()].flatMap(([userId, rows]) => {
      const profile = profileMap.get(userId)
      if (!profile) return []
      const email = authMaps.emailMap[userId] ?? ''
      const fullName = resolveDisplayedName(profile.full_name, authMaps.metaNameMap[userId] ?? '', email)
      return earnedCertsFromProgress(rows).map(cert => ({
        user_id: userId,
        full_name: fullName,
        email,
        group_id: profile.group_id,
        group_name: profile.group_id ? groupMap.get(profile.group_id) ?? null : null,
        code: cert.code,
        slug: cert.slug,
        name: cert.name,
        program: cert.program,
        issued_at: cert.issuedAt,
        certificate_number: levelCertNumber(userId, cert.code),
      }))
    })

    certificates.sort((a, b) => {
      const aTime = a.issued_at ? new Date(a.issued_at).getTime() : 0
      const bTime = b.issued_at ? new Date(b.issued_at).getTime() : 0
      return bTime - aTime
    })

    return NextResponse.json({ certificates })
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Не удалось загрузить сертификаты'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
