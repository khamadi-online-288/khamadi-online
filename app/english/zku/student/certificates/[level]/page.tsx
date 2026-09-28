'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import LevelCertificateView from '@/components/english/zku/LevelCertificateView'
import { certBySlug } from '@/lib/english/zku-level-certs'

export default function LevelCertificatePage() {
  const params = useParams()
  const slug = String(params.level ?? '')
  const cert = certBySlug(slug)

  if (!cert) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: '#003876', marginBottom: 12 }}>Сертификат не найден</div>
        <Link href="/english/zku/student/certificates" style={{ color: '#1B8FC4', textDecoration: 'none' }}>← К сертификатам</Link>
      </div>
    )
  }

  return <LevelCertificateView cert={cert} />
}
