import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function requireAdmin(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }

  const { data: profile } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin')
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }) }

  return { user }
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.error) return auth.error

  const [{ data: groups }, { data: teachers }] = await Promise.all([
    admin
      .from('english_groups')
      .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
      .order('created_at', { ascending: false }),
    admin
      .from('english_user_profiles')
      .select('user_id, full_name')
      .eq('role', 'teacher')
      .order('full_name'),
  ])

  const teacherIds = [...new Set((groups ?? []).map((g: { teacher_id: string | null }) => g.teacher_id).filter(Boolean))] as string[]
  const tm: Record<string, string> = {}
  ;(teachers ?? []).forEach((p: { user_id: string; full_name: string | null }) => {
    tm[p.user_id] = p.full_name ?? '—'
  })
  if (teacherIds.length > 0) {
    const missing = teacherIds.filter((id) => !tm[id])
    if (missing.length > 0) {
      const { data: profiles } = await admin
        .from('english_user_profiles').select('user_id, full_name').in('user_id', missing)
      ;(profiles ?? []).forEach((p: { user_id: string; full_name: string | null }) => { tm[p.user_id] = p.full_name ?? '—' })
    }
  }

  const enriched = (groups ?? []).map((g: { teacher_id: string | null } & Record<string, unknown>) => ({
    ...g, teacher_name: g.teacher_id ? (tm[g.teacher_id] ?? '—') : '—'
  }))

  return NextResponse.json({
    groups: enriched,
    teachers: (teachers ?? []).map((p: { user_id: string; full_name: string | null }) => ({
      user_id: p.user_id,
      full_name: p.full_name ?? 'Преподаватель',
    })),
  })
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.error) return auth.error

  const { id, teacherId } = await req.json() as { id?: string; teacherId?: string | null }
  if (!id || !UUID_RE.test(id))
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const nextTeacherId = teacherId || null
  if (nextTeacherId && !UUID_RE.test(nextTeacherId))
    return NextResponse.json({ error: 'Invalid teacher' }, { status: 400 })

  const { data: group } = await admin
    .from('english_groups').select('id, teacher_id').eq('id', id).maybeSingle()
  if (!group)
    return NextResponse.json({ error: 'Group not found' }, { status: 404 })

  let teacherName: string | null = null
  if (nextTeacherId) {
    const { data: teacher } = await admin
      .from('english_user_profiles')
      .select('user_id, full_name, role')
      .eq('user_id', nextTeacherId)
      .maybeSingle()
    if (!teacher || (teacher.role !== 'teacher' && teacher.role !== 'admin'))
      return NextResponse.json({ error: 'Teacher not found' }, { status: 404 })
    teacherName = teacher.full_name ?? 'Преподаватель'
  }

  const prevTeacherId = (group as { teacher_id: string | null }).teacher_id
  const { error: updateError } = await admin
    .from('english_groups')
    .update({ teacher_id: nextTeacherId })
    .eq('id', id)
  if (updateError) return NextResponse.json({ error: updateError.message }, { status: 500 })

  if (nextTeacherId) {
    const { error: juncError } = await admin
      .from('english_group_teachers')
      .upsert({ group_id: id, teacher_id: nextTeacherId }, { onConflict: 'group_id,teacher_id' })
    if (juncError) return NextResponse.json({ error: juncError.message }, { status: 500 })
  }

  if (prevTeacherId && prevTeacherId !== nextTeacherId) {
    const { error: delError } = await admin
      .from('english_group_teachers')
      .delete()
      .eq('group_id', id)
      .eq('teacher_id', prevTeacherId)
    if (delError) return NextResponse.json({ error: delError.message }, { status: 500 })
  }

  return NextResponse.json({
    ok: true,
    teacher_id: nextTeacherId,
    teacher_name: teacherName ?? '—',
  })
}

export async function DELETE(req: NextRequest) {
  const auth = await requireAdmin(req)
  if (auth.error) return auth.error

  const { id } = await req.json()
  await admin.from('english_groups').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
