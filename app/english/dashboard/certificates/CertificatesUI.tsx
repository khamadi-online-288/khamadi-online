'use client'

import { Award } from 'lucide-react'
import { useLanguage } from '@/app/english/context/LanguageContext'
import CertificateCard from '@/components/english/certificate/CertificateCard'
import type { EnglishCertificate } from '@/types/english/database'

type CertWithCourse = EnglishCertificate & { course_title: string; course_level: string }

export default function CertificatesUI({ certs }: { certs: CertWithCourse[] }) {
  const { t, lang } = useLanguage()

  function certCountText(n: number): string {
    if (lang === 'kk') return `${t.certificates_page.you_have} ${n} ${t.certificates_page.cert_1}`
    // Russian plural
    const mod10 = n % 10, mod100 = n % 100
    const form = (mod100 >= 11 && mod100 <= 14) ? t.certificates_page.cert_many
      : mod10 === 1 ? t.certificates_page.cert_1
      : (mod10 >= 2 && mod10 <= 4) ? t.certificates_page.cert_few
      : t.certificates_page.cert_many
    return `${t.certificates_page.you_have} ${n} ${form}`
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-black text-navy">{t.certificates_page.title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          {certs.length > 0 ? certCountText(certs.length) : t.certificates_page.complete_for}
        </p>
      </div>

      {certs.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/8 p-12 text-center">
          <Award className="mx-auto mb-4 text-gray-200" size={56} />
          <h2 className="text-lg font-black text-navy mb-2">{t.certificates_page.none_yet}</h2>
          <p className="text-gray-400 text-sm mb-6 max-w-sm mx-auto">{t.certificates_page.none_desc}</p>
          <a
            href="/english/courses"
            className="inline-flex items-center gap-2 bg-navy text-white font-bold px-5 py-2.5 rounded-xl hover:bg-mid transition text-sm"
          >
            {t.courses.go_to_courses}
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
