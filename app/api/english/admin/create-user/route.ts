import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

async function getCallerRole(): Promise<string | null> {
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
  if (!session) return null
  const { data } = await supabase.from('english_user_roles').select('role').eq('user_id', session.user.id).maybeSingle()
  return (data as { role: string } | null)?.role ?? null
}

export async function POST(req: NextRequest) {
  const role = await getCallerRole()
  if (role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { email, password, fullName, role: newRole, department, studentId, languageLevel } = await req.json()
  if (!email || !password) return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  const { data: authData, error: authError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  })
  if (authError) return NextResponse.json({ error: authError.message }, { status: 400 })

  const userId = authData.user.id

  await admin.from('profiles').upsert({
    id: userId,
    email,
    full_name: fullName ?? '',
    department: department ?? null,
    student_id_number: studentId ?? null,
    language_level: languageLevel ?? null,
    is_active: true,
  })

  if (newRole) {
    await admin.from('english_user_roles').upsert({ user_id: userId, role: newRole }, { onConflict: 'user_id' })
  }

  return NextResponse.json({ userId })
}
