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

  const today = new Date().toISOString().split('T')[0]

  const [
    { count: students },
    { count: teachers },
    { count: groups },
    { count: active_today },
    { data: xpData },
    { data: recent },
  ] = await Promise.all([
    admin.from('english_user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
    admin.from('english_user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
    admin.from('english_groups').select('*', { count: 'exact', head: true }),
    admin.from('english_user_profiles').select('*', { count: 'exact', head: true })
      .eq('role', 'student').gte('last_active_at', today),
    admin.from('english_user_profiles').select('total_xp').eq('role', 'student'),
    admin.from('english_user_profiles')
      .select('user_id, full_name, role, current_level, total_xp, last_active_at')
      .order('last_active_at', { ascending: false, nullsFirst: false }).limit(10),
  ])

  const total_xp = (xpData ?? []).reduce((s: number, u: { total_xp: number | null }) => s + (u.total_xp ?? 0), 0)

  return NextResponse.json({
    students: students ?? 0,
    teachers: teachers ?? 0,
    groups: groups ?? 0,
    active_today: active_today ?? 0,
    total_xp,
    recent: recent ?? [],
  })
}
