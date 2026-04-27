import { notFound } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import CertificateVerify from '@/components/english/certificate/CertificateVerify'
import type { EnglishCertificate, EnglishCourse, EnglishUserRole } from '@/types/english/database'

export default async function PublicCertPage({
  params,
}: {
  params: Promise<{ certNumber: string }>
}) {
  const { certNumber } = await params
  const supabase = await createEnglishServerClient()

  const { data: cert } = await supabase
    .from('english_certificates')
    .select('*')
    .eq('certificate_number', certNumber)
    .maybeSingle()

  if (!cert) notFound()

  const c = cert as EnglishCertificate

  const [{ data: course }, { data: owner }] = await Promise.all([
    supabase.from('english_courses').select('title, level, category').eq('id', c.course_id).maybeSingle(),
    supabase.from('english_user_roles').select('full_name').eq('user_id', c.user_id).maybeSingle(),
  ])

  return (
    <div className="min-h-screen bg-light flex items-center justify-center p-4">
      <CertificateVerify
        cert={c}
        course={course as Pick<EnglishCourse, 'title' | 'level' | 'category'> | null}
        ownerName={(owner as Pick<EnglishUserRole, 'full_name'> | null)?.full_name ?? 'Студент'}
      />
    </div>
  )
}
