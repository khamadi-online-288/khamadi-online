import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

function readMetaString(meta: Record<string, unknown> | undefined, key: string): string {
  const value = meta?.[key]
  return typeof value === 'string' ? value.trim() : ''
}

function readMetaName(meta: Record<string, unknown> | undefined): string {
  const full = readMetaString(meta, 'full_name')
  if (full) return full
  return readMetaString(meta, 'name')
}

/** Same rule as the student cabinet: Auth metadata wins over the profile row. */
function resolveDisplayedName(dbName: string | null, metaName: string, email: string): string | null {
  const emailSlug = email.split('@')[0] ?? ''
  if (metaName && metaName !== emailSlug) return metaName
  if (dbName && dbName !== emailSlug) return dbName
  return dbName || metaName || null
}

interface ProfileRow {
  user_id: string
  full_name: string | null
  role: string
  current_level: string | null
  total_xp: number | null
  current_streak: number | null
  longest_streak: number | null
  last_active_at: string | null
  group_id: string | null
  created_at: string | null
}

interface LessonRow {
  lesson_id: string
  lesson_type: string | null
  lesson_title: string | null
  score: number | null
  xp_earned: number | null
  completed: boolean
  completed_at: string | null
  time_spent_min: number | null
}

interface GroupRow {
  id: string
  name: string
  teacher_id: string | null
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ userId: string }> },
) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!caller || caller.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId } = await params
  if (!userId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { data: profile } = await admin
    .from('english_user_profiles')
    .select('user_id, full_name, role, current_level, total_xp, current_streak, longest_streak, last_active_at, group_id, created_at')
    .eq('user_id', userId)
    .maybeSingle()

  const row = profile as ProfileRow | null
  if (!row || row.role !== 'student')
    return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })

  const lessonSelect = 'lesson_id, lesson_type, lesson_title, score, xp_earned, completed, completed_at, time_spent_min'
  const lessonQuery = () => admin
    .from('english_lesson_progress')
    .select(lessonSelect)
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(80)

  const [{ data: authData, error: userErr }, lessonsFirst, countRes, groupsRes] = await Promise.all([
    admin.auth.admin.getUserById(userId),
    lessonQuery(),
    admin
      .from('english_lesson_progress')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)
      .eq('completed', true),
    admin.from('english_groups').select('id, name, teacher_id').order('name'),
  ])

  if (userErr) return NextResponse.json({ error: userErr.message }, { status: 500 })

  const authUser = authData.user
  const meta = authUser?.user_metadata as Record<string, unknown> | undefined
  const email = authUser?.email ?? ''
  const groups = (groupsRes.data ?? []) as GroupRow[]
  const group = groups.find(g => g.id === row.group_id) ?? null

  let teacherName: string | null = null
  if (group?.teacher_id) {
    const { data: teacher } = await admin
      .from('english_user_profiles')
      .select('full_name')
      .eq('user_id', group.teacher_id)
      .maybeSingle()
    teacherName = (teacher as { full_name: string | null } | null)?.full_name ?? null
  }

  const lessonsRes = lessonsFirst.error?.message.includes('time_spent_min')
    ? await admin
      .from('english_lesson_progress')
      .select('lesson_id, lesson_type, lesson_title, score, xp_earned, completed, completed_at')
      .eq('user_id', userId)
      .eq('completed', true)
      .order('completed_at', { ascending: false })
      .limit(80)
    : lessonsFirst

  const lessons = ((lessonsRes.data ?? []) as Array<Omit<LessonRow, 'time_spent_min'> & { time_spent_min?: number | null }>).map(lesson => ({
    ...lesson,
    time_spent_min: typeof lesson.time_spent_min === 'number' ? lesson.time_spent_min : null,
  }))

  return NextResponse.json({
    student: {
      user_id: row.user_id,
      full_name: resolveDisplayedName(row.full_name, readMetaName(meta), email),
      email,
      phone: readMetaString(meta, 'phone') || null,
      faculty: readMetaString(meta, 'faculty') || null,
      role: row.role,
      current_level: row.current_level,
      total_xp: row.total_xp ?? 0,
      current_streak: row.current_streak ?? 0,
      longest_streak: row.longest_streak ?? 0,
      last_active_at: row.last_active_at,
      group_id: row.group_id,
      group_name: group?.name ?? null,
      teacher_name: teacherName,
      created_at: authUser?.created_at ?? row.created_at,
      last_sign_in_at: authUser?.last_sign_in_at ?? null,
      email_confirmed: Boolean(authUser?.email_confirmed_at),
      lessons_done: countRes.count ?? lessons.length,
    },
    lessons,
    groups: groups.map(g => ({ id: g.id, name: g.name })),
  })
}
