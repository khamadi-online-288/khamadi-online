import { redirect } from 'next/navigation'
import { Award, ExternalLink } from 'lucide-react'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import CertificateCard from '@/components/english/certificate/CertificateCard'
import type { EnglishCertificate, EnglishCourse } from '@/types/english/database'

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

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy">Мои сертификаты</h1>
        <p className="text-gray-500 text-sm mt-1">
          {certs.length > 0
            ? `У вас ${certs.length} сертификат${certs.length === 1 ? '' : certs.length < 5 ? 'а' : 'ов'}`
            : 'Завершите курс, чтобы получить сертификат'}
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/8 p-12 text-center">
          <Award className="mx-auto mb-4 text-gray-200" size={56} />
          <h2 className="text-lg font-black text-navy mb-2">Сертификатов пока нет</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">
            Завершите курс со средним баллом не ниже 70% — и сертификат будет выдан автоматически.
          </p>
          <a
            href="/english/courses"
            className="inline-flex items-center gap-2 bg-navy text-white font-bold px-5 py-2.5 rounded-xl hover:bg-mid transition text-sm"
          >
            Перейти к курсам
          </a>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {certs.map(cert => (
            <CertificateCard key={cert.id} cert={cert} />
          ))}
        </div>
      )}
    </div>
  )
}
