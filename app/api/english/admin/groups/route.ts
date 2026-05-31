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

  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { data: groups } = await admin
    .from('english_groups')
    .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
    .order('created_at', { ascending: false })

  const teacherIds = [...new Set((groups ?? []).map((g: { teacher_id: string | null }) => g.teacher_id).filter(Boolean))] as string[]
  const tm: Record<string, string> = {}
  if (teacherIds.length > 0) {
    const { data: profiles } = await admin
      .from('english_user_profiles').select('user_id, full_name').in('user_id', teacherIds)
    ;(profiles ?? []).forEach((p: { user_id: string; full_name: string | null }) => { tm[p.user_id] = p.full_name ?? '—' })
  }

  const enriched = (groups ?? []).map((g: { teacher_id: string | null } & Record<string, unknown>) => ({
    ...g, teacher_name: g.teacher_id ? (tm[g.teacher_id] ?? '—') : '—'
  }))

  return NextResponse.json({ groups: enriched })
}

export async function DELETE(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error } = await admin.auth.getUser(token)
  if (error || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await req.json()
  await admin.from('english_groups').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
