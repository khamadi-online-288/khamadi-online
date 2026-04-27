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
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceKey) return NextResponse.json({ error: 'Misconfigured' }, { status: 500 })

  const certPath = req.headers.get('X-Cert-Path')
  const certId = req.headers.get('X-Cert-Id')
  const studentId = req.headers.get('X-Student-Id')
  const studentName = req.headers.get('X-Student-Name') ?? 'Студент'
  const courseName = req.headers.get('X-Course-Name') ?? 'Курс'

  if (!certPath) return NextResponse.json({ error: 'cert path required' }, { status: 400 })

  const admin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  })

  // Upload PDF to storage
  const pdfBuffer = await req.arrayBuffer()
  const { error: uploadErr } = await admin.storage
    .from('lms-certificates')
    .upload(certPath, pdfBuffer, { contentType: 'application/pdf', upsert: true })

  if (uploadErr) return NextResponse.json({ error: uploadErr.message }, { status: 400 })

  // Get signed URL (1 year)
  const { data: signedData } = await admin.storage
    .from('lms-certificates')
    .createSignedUrl(certPath, 365 * 24 * 3600)

  const url = signedData?.signedUrl ?? ''

  // Update lms_certificates record
  if (certId) {
    await admin.from('lms_certificates').update({ pdf_url: url }).eq('id', certId)
  }

  // Notify student
  if (studentId) {
    await admin.from('lms_notifications').insert({
      user_id: studentId,
      type: 'certificate_issued',
      title: 'Сертификат готов!',
      body: `Ваш сертификат за курс "${courseName}" выдан. Нажмите, чтобы скачать.`,
      link: url,
    })
  }

  // Activity log
  await admin.from('lms_activity_log').insert({
    user_id: session.user.id,
    action: 'certificate_generated',
    entity_type: 'certificate',
    entity_id: certId ? certId as unknown as string : undefined,
    metadata: { studentName, courseName, certPath },
  })

  return NextResponse.json({ url })
}
