import { NextRequest, NextResponse } from 'next/server'
import {
  createEnglishServiceClient,
  createZkuAuthAndProfile,
  upsertZkuProfileForUser,
  type ZkuCreateRole,
} from '@/lib/english/zku-create-user'

const CLOSED_MSG = 'Регистрация закрыта. Обратитесь к администратору для создания аккаунта.'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) {
    return NextResponse.json({ error: CLOSED_MSG }, { status: 403 })
  }

  const admin = createEnglishServiceClient()
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) {
    return NextResponse.json({ error: CLOSED_MSG }, { status: 403 })
  }

  const { data: caller } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!caller || caller.role !== 'admin') {
    return NextResponse.json({ error: CLOSED_MSG }, { status: 403 })
  }

  let body: {
    email?: string
    password?: string
    fullName?: string
    role?: string
  }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const fullName = body.fullName?.trim()
  const role: ZkuCreateRole = body.role === 'teacher' ? 'teacher' : 'student'

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: 'Заполните все поля' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Пароль минимум 8 символов' }, { status: 400 })
  }

  try {
    const { userId } = await createZkuAuthAndProfile({
      email,
      password,
      fullName,
      role,
      emailConfirm: true,
    })
    return NextResponse.json({ ok: true, userId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка регистрации'

    // Auth user already exists from a previous broken signup — attach profile if password matches
    if (/already|registered|exists/i.test(message)) {
      try {
        const { data: signIn, error: signInErr } = await admin.auth.signInWithPassword({
          email,
          password,
        })
        if (signInErr || !signIn.user) {
          return NextResponse.json(
            { error: 'Этот email уже зарегистрирован. Войдите или восстановите пароль.' },
            { status: 400 },
          )
        }
        await upsertZkuProfileForUser({
          userId: signIn.user.id,
          fullName,
          role,
        })
        return NextResponse.json({ ok: true, userId: signIn.user.id, repaired: true })
      } catch (repairErr) {
        const repairMsg = repairErr instanceof Error ? repairErr.message : message
        return NextResponse.json({ error: repairMsg }, { status: 400 })
      }
    }

    return NextResponse.json({ error: message }, { status: 400 })
  }
}
