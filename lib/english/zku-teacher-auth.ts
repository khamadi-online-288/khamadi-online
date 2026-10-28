import { NextRequest, NextResponse } from 'next/server'
import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Service role bypasses RLS — callers must go through authorizeGroupAccess first
export const teacherAdmin: SupabaseClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
)

export type GroupAccess =
  | { ok: true; userId: string; role: 'teacher' | 'admin' }
  | { ok: false; response: NextResponse }

/** Verifies the Bearer token, teacher/admin role and (for teachers) assignment to the group. */
export async function authorizeGroupAccess(req: NextRequest, groupId: string): Promise<GroupAccess> {
  const deny = (error: string, status: number): GroupAccess =>
    ({ ok: false, response: NextResponse.json({ error }, { status }) })

  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return deny('Unauthorized', 401)

  const { data: { user }, error: authErr } = await teacherAdmin.auth.getUser(token)
  if (authErr || !user) return deny('Unauthorized', 401)

  const { data: caller, error: callerErr } = await teacherAdmin
    .from('english_user_profiles').select('role').eq('user_id', user.id).maybeSingle()
  if (callerErr) return deny(callerErr.message, 500)
  const role = (caller as { role: string } | null)?.role
  if (role !== 'teacher' && role !== 'admin') return deny('Forbidden', 403)

  if (!groupId) return deny('Invalid request', 400)

  if (role === 'teacher') {
    const { data: junc, error: juncErr } = await teacherAdmin
      .from('english_group_teachers')
      .select('group_id')
      .eq('teacher_id', user.id)
      .eq('group_id', groupId)
      .maybeSingle()
    if (juncErr) return deny(juncErr.message, 500)
    if (!junc) return deny('Forbidden', 403)
  }

  return { ok: true, userId: user.id, role }
}
