import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import type { EnglishCertificate, EnglishCourse } from '@/types/english/database'
import CertificatesUI from './CertificatesUI'

type CertWithCourse = EnglishCertificate & { course_title: string; course_level: string }

export default async function CertificatesPage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  const { data: rows } = await supabase
    .from('english_certificates')
    .select('id, certificate_number, issued_at, course_id')
    .eq('user_id', user.id)
    .order('issued_at', { ascending: false })

  let certs: CertWithCourse[] = []

  if (rows && rows.length > 0) {
    const courseIds = [...new Set(rows.map((r: { course_id: string }) => r.course_id))]
    const { data: courses } = await supabase
      .from('english_courses')
      .select('id, title, level')
      .in('id', courseIds)

    const courseMap = new Map(
      (courses ?? []).map((c: Pick<EnglishCourse, 'id' | 'title' | 'level'>) => [c.id, c])
    )

    certs = rows.map((r: Omit<CertWithCourse, 'user_id' | 'course_title' | 'course_level'>) => ({
      ...r,
      user_id:      user.id,
      course_title: (courseMap.get(r.course_id) as Pick<EnglishCourse, 'title'> | undefined)?.title ?? 'Курс',
      course_level: (courseMap.get(r.course_id) as Pick<EnglishCourse, 'level'> | undefined)?.level ?? '',
    }))
  }

  return <CertificatesUI certs={certs} />
}
