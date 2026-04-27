import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'

export async function GET(req: NextRequest) {
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
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const bucket = searchParams.get('bucket')
  const path = searchParams.get('path')
  if (!bucket || !path) return NextResponse.json({ error: 'bucket and path required' }, { status: 400 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Misconfigured' }, { status: 500 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Log access attempt
  await admin.from('lms_activity_log').insert({
    user_id: session.user.id,
    action: 'file_access',
    entity_type: 'storage',
    metadata: { bucket, path },
  })

  const { data, error } = await admin.storage.from(bucket).createSignedUrl(path, 60)
  if (error) return NextResponse.json({ error: error.message }, { status: 400 })

  return NextResponse.json({ url: data.signedUrl })
}
