import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

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
  if (!caller || (caller.role !== 'teacher' && caller.role !== 'admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { userId } = await params
  if (!userId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const { data: profile } = await admin
    .from('english_user_profiles')
    .select('user_id, full_name, role, current_level, total_xp, current_streak, longest_streak, last_active_at, group_id')
    .eq('user_id', userId)
    .maybeSingle()

  if (!profile || profile.role !== 'student')
    return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })

  if (caller.role === 'teacher') {
    const { data: junc } = await admin
      .from('english_group_teachers')
      .select('group_id')
      .eq('teacher_id', user.id)
    const groupIds = (junc ?? []).map((r: { group_id: string }) => r.group_id)
    if (!profile.group_id || !groupIds.includes(profile.group_id))
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  let groupName: string | null = null
  if (profile.group_id) {
    const { data: group } = await admin
      .from('english_groups').select('name').eq('id', profile.group_id).maybeSingle()
    groupName = (group as { name: string } | null)?.name ?? null
  }

  const { data: lessons } = await admin
    .from('english_lesson_progress')
    .select('lesson_id, lesson_type, lesson_title, score, xp_earned, completed_at')
    .eq('user_id', userId)
    .eq('completed', true)
    .order('completed_at', { ascending: false })
    .limit(80)

  return NextResponse.json({
    student: {
      user_id: profile.user_id,
      full_name: profile.full_name,
      current_level: profile.current_level,
      total_xp: profile.total_xp ?? 0,
      current_streak: profile.current_streak ?? 0,
      longest_streak: profile.longest_streak ?? 0,
      last_active_at: profile.last_active_at,
      group_id: profile.group_id,
      group_name: groupName,
    },
    lessons: lessons ?? [],
  })
}
