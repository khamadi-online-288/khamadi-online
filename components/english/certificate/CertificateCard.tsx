import Link from 'next/link'
import { Award } from 'lucide-react'
import Badge from '@/components/english/ui/Badge'

type Props = {
  cert: {
    id: string
    certificate_number: string
    issued_at: string
    course_title: string
    course_level: string
  }
}

export default function CertificateCard({ cert }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-navy/8 shadow-sm p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between">
        <div className="w-12 h-12 rounded-xl bg-gold/10 flex items-center justify-center">
          <Award className="text-gold" size={24} />
        </div>
        <Badge color="navy" size="sm">{cert.course_level}</Badge>
      </div>

      <div>
        <h3 className="font-black text-navy text-sm leading-tight mb-1">{cert.course_title}</h3>
        <p className="text-xs text-gold font-bold">№ {cert.certificate_number}</p>
        <p className="text-xs text-gray-400 mt-0.5">
          Выдан {new Date(cert.issued_at).toLocaleDateString('ru-RU', {
            day: 'numeric', month: 'long', year: 'numeric',
          })}
        </p>
      </div>

      <Link
        href={`/english/cert/${cert.certificate_number}`}
        className="w-full text-center bg-navy text-white text-xs font-bold py-2 rounded-xl hover:bg-mid transition"
        target="_blank"
        rel="noopener noreferrer"
      >
        Просмотреть →
      </Link>
    </div>
  )
}
