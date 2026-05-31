import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role bypasses RLS — safe because we verify session first
const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function GET(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify the token and get user
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify teacher role
  const { data: profile } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin'))
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  // Get group IDs from junction table
  const { data: junc } = await admin
    .from('english_group_teachers')
    .select('group_id')
    .eq('teacher_id', user.id)
  const groupIds = (junc ?? []).map((r: { group_id: string }) => r.group_id)

  if (groupIds.length === 0) return NextResponse.json({ groups: [] })

  // Fetch groups (service role bypasses RLS)
  const { data: groups } = await admin
    .from('english_groups')
    .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
    .in('id', groupIds)
    .order('created_at', { ascending: false })

  return NextResponse.json({ groups: groups ?? [] })
}
