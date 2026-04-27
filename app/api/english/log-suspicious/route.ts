import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(c) { c.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) },
      },
    }
  )

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return NextResponse.json({ ok: false }, { status: 401 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ ok: false }, { status: 500 })

  const { action, metadata } = await req.json()
  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Insert suspicious activity
  await admin.from('lms_suspicious_activity').insert({
    user_id: session.user.id,
    action,
    metadata,
    url: req.headers.get('referer') ?? '',
    user_agent: req.headers.get('user-agent') ?? '',
  })

  // Get student name for notification
  const { data: profile } = await admin.from('profiles').select('full_name').eq('id', session.user.id).maybeSingle()
  const studentName = (profile as { full_name?: string } | null)?.full_name ?? 'Студент'

  // Notify all admins
  const { data: adminRoles } = await admin.from('english_user_roles').select('user_id').eq('role', 'admin')
  const adminIds = ((adminRoles ?? []) as { user_id: string }[]).map(r => r.user_id)
  if (adminIds.length) {
    await admin.from('lms_notifications').insert(
      adminIds.map(uid => ({
        user_id: uid,
        type: 'suspicious_activity',
        title: 'Подозрительная активность',
        body: `${studentName} — ${action}`,
        link: `/english/admin/reports`,
      }))
    )
  }

  return NextResponse.json({ ok: true })
}
