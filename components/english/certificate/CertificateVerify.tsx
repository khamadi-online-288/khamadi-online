import { CheckCircle, Award } from 'lucide-react'
import Badge from '@/components/english/ui/Badge'
import type { EnglishCertificate, EnglishCourse } from '@/types/english/database'

type Props = {
  cert: EnglishCertificate
  course: Pick<EnglishCourse, 'title' | 'level' | 'category'> | null
  ownerName: string
}

export default function CertificateVerify({ cert, course, ownerName }: Props) {
  return (
    <div className="w-full max-w-lg">
      {/* Verified banner */}
      <div className="flex items-center justify-center gap-2 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-2.5 mb-6 text-sm font-bold">
        <CheckCircle size={16} />
        Сертификат подлинный — верифицирован системой KHAMADI
      </div>

      {/* Certificate */}
      <div className="bg-white rounded-3xl border-2 border-gold/30 shadow-xl shadow-gold/10 p-8 text-center">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-navy mx-auto mb-4 flex items-center justify-center">
          <Award className="text-gold" size={32} />
        </div>

        <p className="text-xs font-black text-gray-400 tracking-widest uppercase mb-1">KHAMADI ENGLISH</p>
        <h1 className="text-lg font-black text-navy mb-6">Сертификат об окончании курса</h1>

        <p className="text-gray-500 text-sm mb-1">Настоящим подтверждается, что</p>
        <h2 className="text-2xl font-black text-navy mb-1">{ownerName}</h2>
        <p className="text-gray-500 text-sm mb-6">успешно завершил(а) курс</p>

        {course && (
          <div className="bg-light rounded-xl px-5 py-3 mb-6 inline-block">
            <div className="font-black text-navy">{course.title}</div>
            <div className="flex items-center justify-center gap-2 mt-1.5">
              <Badge color="gold" size="sm">{course.level}</Badge>
              <span className="text-xs text-gray-400">{course.category}</span>
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-4 mt-2">
          <p className="text-xs text-gold font-black tracking-wider">№ {cert.certificate_number}</p>
          <p className="text-xs text-gray-400 mt-0.5">
            Дата выдачи: {new Date(cert.issued_at).toLocaleDateString('ru-RU', {
              day: 'numeric', month: 'long', year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
