import { NextRequest, NextResponse } from 'next/server'
import { createEnglishServiceClient, createZkuAuthAndProfile, type ZkuCreateRole } from '@/lib/english/zku-create-user'

export async function POST(req: NextRequest) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const admin = createEnglishServiceClient()
  const { data: { user }, error: authErr } = await admin.auth.getUser(token)
  if (authErr || !user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data: caller } = await admin
    .from('english_user_profiles')
    .select('role')
    .eq('user_id', user.id)
    .maybeSingle()
  if (!caller || caller.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json() as {
    email?: string
    password?: string
    fullName?: string
    role?: ZkuCreateRole
  }
  const email = body.email?.trim().toLowerCase()
  const password = body.password
  const fullName = body.fullName?.trim()
  const role: ZkuCreateRole = body.role === 'student' ? 'student' : 'teacher'

  if (!email || !password || !fullName) {
    return NextResponse.json({ error: 'email, password and fullName are required' }, { status: 400 })
  }
  if (password.length < 8) {
    return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
  }

  try {
    const { userId } = await createZkuAuthAndProfile({
      email,
      password,
      fullName,
      role,
      emailConfirm: true,
    })
    return NextResponse.json({ userId, ok: true })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Create failed'
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
