import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 })
    }

    const { email, full_name, role, course_id } = (await req.json()) as {
      email: string
      full_name: string
      role: string
      course_id?: string
    }

    if (!email || !full_name) {
      return NextResponse.json({ error: 'Email и имя обязательны' }, { status: 400 })
    }

    const adminClient = createClient(supabaseUrl, serviceRoleKey, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Create user with invite (sends email)
    const { data: userData, error: createError } = await adminClient.auth.admin.inviteUserByEmail(email, {
      data: { full_name },
    })

    if (createError) {
      // User may already exist
      const { data: existing } = await adminClient.auth.admin.listUsers()
      const existingUser = existing?.users?.find(u => u.email === email)
      if (!existingUser) {
        return NextResponse.json({ error: createError.message }, { status: 400 })
      }

      // Update role for existing user
      await adminClient.from('english_user_roles').upsert({
        user_id: existingUser.id,
        full_name,
        role: role || 'student',
        ...(course_id ? { purpose: course_id } : {}),
      }, { onConflict: 'user_id' })

      return NextResponse.json({ success: true, user_id: existingUser.id, existing: true })
    }

    const userId = userData.user?.id
    if (!userId) {
      return NextResponse.json({ error: 'Не удалось создать пользователя' }, { status: 500 })
    }

    // Create role record
    const { error: roleError } = await adminClient.from('english_user_roles').insert({
      user_id: userId,
      full_name,
      role: role || 'student',
      ...(course_id ? { purpose: course_id } : {}),
    })

    if (roleError) {
      console.error('Role insert error:', roleError)
    }

    return NextResponse.json({ success: true, user_id: userId, existing: false })
  } catch (e) {
    console.error('create-users route error:', e)
    return NextResponse.json({ error: 'Внутренняя ошибка сервера' }, { status: 500 })
  }
}
