import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Get all student profiles
  const { data: students } = await admin
    .from('english_user_profiles')
    .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
    .eq('role', 'student')
    .order('last_active_at', { ascending: false, nullsFirst: false })

  // Get auth users to fetch emails
  const { data: { users: authUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 })
  const emailMap: Record<string, string> = {}
  authUsers.forEach(u => { emailMap[u.id] = u.email ?? '' })

  // Get lesson progress counts
  const { data: progress } = await admin
    .from('english_lesson_progress')
    .select('user_id')
    .eq('completed', true)

  const lessonCounts: Record<string, number> = {}
  ;(progress ?? []).forEach((r: { user_id: string }) => {
    lessonCounts[r.user_id] = (lessonCounts[r.user_id] ?? 0) + 1
  })

  // Get all groups (service role bypasses RLS)
  const { data: groups } = await admin
    .from('english_groups')
    .select('id, name')
    .order('name')

  const enriched = (students ?? []).map(s => ({
    ...s,
    email: emailMap[s.user_id] ?? '',
    lessons_done: lessonCounts[s.user_id] ?? 0,
  }))

  return NextResponse.json({ students: enriched, groups: groups ?? [] })
}
