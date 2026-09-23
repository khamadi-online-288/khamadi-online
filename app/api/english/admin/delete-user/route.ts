import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

/** Tables that reference auth.users without ON DELETE CASCADE (or may exist). */
const USER_ID_TABLES = [
  'english_enrollments',
  'english_lesson_progress',
  'english_progress',
  'english_certificates',
  'english_study_sessions',
  'english_notifications',
  'english_support_tickets',
  'english_user_vocab',
  'english_user_achievements',
  'english_user_roles',
] as const

async function deleteByUserId(db: SupabaseClient, table: string, column: string, userId: string) {
  const { error } = await db.from(table).delete().eq(column, userId)
  // Ignore missing-table / missing-column errors so one schema drift doesn't block delete
  if (error && !/does not exist|schema cache/i.test(error.message)) {
    throw new Error(`${table}: ${error.message}`)
  }
}

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!caller || caller.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { targetUserId } = await req.json() as { targetUserId?: string }
  if (!targetUserId)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  if (targetUserId === user.id)
    return NextResponse.json({ error: 'Нельзя удалить свой аккаунт' }, { status: 400 })

  const { data: target } = await admin
    .from('english_user_profiles')
    .select('role, full_name')
    .eq('user_id', targetUserId)
    .maybeSingle()

  if (!target)
    return NextResponse.json({ error: 'Пользователь не найден' }, { status: 404 })
  if (target.role === 'admin')
    return NextResponse.json({ error: 'Нельзя удалить администратора' }, { status: 400 })
  if (target.role !== 'student')
    return NextResponse.json({ error: 'Удаление доступно только для студентов' }, { status: 400 })

  try {
    for (const table of USER_ID_TABLES) {
      await deleteByUserId(admin, table, 'user_id', targetUserId)
    }
    await deleteByUserId(admin, 'english_group_members', 'student_id', targetUserId)

    const { error: msgFromErr } = await admin.from('english_messages').delete().eq('from_user_id', targetUserId)
    if (msgFromErr && !/does not exist|schema cache/i.test(msgFromErr.message)) {
      throw new Error(`english_messages(from): ${msgFromErr.message}`)
    }
    const { error: msgToErr } = await admin.from('english_messages').delete().eq('to_user_id', targetUserId)
    if (msgToErr && !/does not exist|schema cache/i.test(msgToErr.message)) {
      throw new Error(`english_messages(to): ${msgToErr.message}`)
    }

    await deleteByUserId(admin, 'english_user_profiles', 'user_id', targetUserId)

    const { error: authDelErr } = await admin.auth.admin.deleteUser(targetUserId)
    if (authDelErr) throw new Error(authDelErr.message)

    return NextResponse.json({ ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Delete failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
