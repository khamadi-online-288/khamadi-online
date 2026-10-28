import { NextRequest, NextResponse } from 'next/server'
import { authorizeGroupAccess, teacherAdmin as admin } from '@/lib/english/zku-teacher-auth'

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const access = await authorizeGroupAccess(req, id)
  if (!access.ok) return access.response

  const { data: group, error: groupErr } = await admin
    .from('english_groups')
    .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
    .eq('id', id)
    .maybeSingle()
  if (groupErr) return NextResponse.json({ error: groupErr.message }, { status: 500 })
  if (!group) return NextResponse.json({ error: 'Группа не найдена' }, { status: 404 })

  const { data: students, error: studentsErr } = await admin
    .from('english_user_profiles')
    .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
    .eq('group_id', id)
    .order('total_xp', { ascending: false })
  if (studentsErr) return NextResponse.json({ error: studentsErr.message }, { status: 500 })

  return NextResponse.json({ group, students: students ?? [] })
}
