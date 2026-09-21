import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const admin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: profile } = await admin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (!profile || profile.role !== 'admin')
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { targetUserId, groupId } = await req.json() as {
    targetUserId?: string
    groupId?: string | null
  }
  if (!targetUserId)
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })

  const nextGroupId = groupId || null

  if (nextGroupId) {
    const { data: group } = await admin
      .from('english_groups').select('id').eq('id', nextGroupId).maybeSingle()
    if (!group)
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
  }

  const { error } = await admin
    .from('english_user_profiles')
    .update({ group_id: nextGroupId })
    .eq('user_id', targetUserId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true })
}
