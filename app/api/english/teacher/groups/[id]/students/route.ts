import { NextRequest, NextResponse } from 'next/server'
import { authorizeGroupAccess, teacherAdmin as admin } from '@/lib/english/zku-teacher-auth'

type StudentRow = { user_id: string; full_name: string | null; group_id: string | null; role: string }

async function findUserIdByEmail(email: string): Promise<string | null> {
  for (let page = 1; page <= 20; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 1000 })
    if (error) throw new Error(error.message)
    const match = data.users.find(u => u.email?.toLowerCase() === email)
    if (match) return match.id
    if (data.users.length < 1000) break
  }
  return null
}

/** Recomputes english_groups.students_count from the actual group membership. */
async function syncStudentsCount(groupId: string): Promise<string | null> {
  const { count, error } = await admin
    .from('english_user_profiles')
    .select('user_id', { count: 'exact', head: true })
    .eq('group_id', groupId)
    .eq('role', 'student')
  if (error) return error.message
  const { error: updErr } = await admin
    .from('english_groups').update({ students_count: count ?? 0 }).eq('id', groupId)
  return updErr?.message ?? null
}

/** Adds a student to the group. Body: { query } — exact email or part of the full name. */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const access = await authorizeGroupAccess(req, id)
  if (!access.ok) return access.response

  const body = await req.json().catch(() => null) as { query?: unknown } | null
  const query = typeof body?.query === 'string' ? body.query.trim().toLowerCase() : ''
  if (!query) return NextResponse.json({ error: 'Введите email или имя студента' }, { status: 400 })

  let student: StudentRow | null = null

  if (query.includes('@')) {
    let userId: string | null
    try { userId = await findUserIdByEmail(query) }
    catch (e) { return NextResponse.json({ error: (e as Error).message }, { status: 500 }) }
    if (userId) {
      const { data, error } = await admin
        .from('english_user_profiles')
        .select('user_id, full_name, group_id, role')
        .eq('user_id', userId)
        .maybeSingle()
      if (error) return NextResponse.json({ error: error.message }, { status: 500 })
      student = data as StudentRow | null
    }
  } else {
    const { data, error } = await admin
      .from('english_user_profiles')
      .select('user_id, full_name, group_id, role')
      .eq('role', 'student')
      .ilike('full_name', `%${query.replace(/[%_]/g, '\\$&')}%`)
      .limit(2)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    const rows = (data ?? []) as StudentRow[]
    if (rows.length > 1)
      return NextResponse.json({ error: 'Найдено несколько студентов — уточните имя или введите email' }, { status: 409 })
    student = rows[0] ?? null
  }

  if (!student || student.role !== 'student')
    return NextResponse.json({ error: 'Студент не найден' }, { status: 404 })
  if (student.group_id === id)
    return NextResponse.json({ error: 'Студент уже в этой группе' }, { status: 409 })

  const { error: updErr } = await admin
    .from('english_user_profiles').update({ group_id: id }).eq('user_id', student.user_id)
  if (updErr) return NextResponse.json({ error: updErr.message }, { status: 500 })

  // The student may have moved from another group — keep both counters accurate
  const countErr = await syncStudentsCount(id)
    ?? (student.group_id ? await syncStudentsCount(student.group_id) : null)
  if (countErr) return NextResponse.json({ error: countErr }, { status: 500 })

  return NextResponse.json({ student: { user_id: student.user_id, full_name: student.full_name } })
}

/** Removes a student from the group. Body: { userId }. */
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params
  const access = await authorizeGroupAccess(req, id)
  if (!access.ok) return access.response

  const body = await req.json().catch(() => null) as { userId?: unknown } | null
  const userId = typeof body?.userId === 'string' ? body.userId : ''
  if (!userId) return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  // Only detach students that actually belong to this group
  const { data, error } = await admin
    .from('english_user_profiles')
    .update({ group_id: null })
    .eq('user_id', userId)
    .eq('group_id', id)
    .select('user_id')
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.length) return NextResponse.json({ error: 'Студент не найден в группе' }, { status: 404 })

  const countErr = await syncStudentsCount(id)
  if (countErr) return NextResponse.json({ error: countErr }, { status: 500 })

  return NextResponse.json({ ok: true })
}
