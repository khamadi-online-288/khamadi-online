'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import LevelCertificateView from '@/components/english/zku/LevelCertificateView'
import { certBySlug, levelCertNumber, type EarnedLevelCert } from '@/lib/english/zku-level-certs'

const ADMIN = '#7C3AED'

export default function AdminStudentCertificatePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>
}) {
  const { id, slug } = use(params)
  const router = useRouter()
  const searchParams = useSearchParams()
  const fromRegistry = searchParams.get('from') === 'registry'
  const cert = certBySlug(slug)
  const [studentName, setStudentName] = useState('')
  const [issuedAt, setIssuedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [missing, setMissing] = useState(false)

  useEffect(() => {
    async function load() {
      if (!cert) {
        setLoading(false)
        setMissing(true)
        return
      }
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.replace('/english/zku/login')
        return
      }

      const res = await fetch(`/api/english/admin/students/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json() as {
        student?: { full_name: string | null }
        certificates?: EarnedLevelCert[]
      }

      if (!res.ok || !data.student) {
        router.replace('/english/zku/admin/students')
        return
      }

      const earned = (data.certificates ?? []).find(item => item.slug === slug)
      if (!earned) {
        setMissing(true)
        setLoading(false)
        return
      }

      setStudentName(data.student.full_name || 'Студент')
      setIssuedAt(earned.issuedAt)
      setLoading(false)
    }
    void load()
  }, [cert, id, slug, router])

  const backHref = fromRegistry
    ? '/english/zku/admin/certificates'
    : `/english/zku/admin/students/${id}?tab=certificates`
  const backLabel = fromRegistry ? '← К реестру' : '← К студенту'

  if (loading) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${ADMIN}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (missing || !cert) {
    return (
      <div style={{ padding: '48px 28px', maxWidth: 640, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: '#1a0050', marginBottom: 8 }}>Сертификат не найден</div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>У этого студента нет сертификата такого уровня.</div>
        <Link href={backHref} style={{ color: ADMIN, textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>{backLabel}</Link>
      </div>
    )
  }

  return (
    <LevelCertificateView
      cert={cert}
      studentName={studentName}
      issuedAt={issuedAt}
      certId={levelCertNumber(id, cert.code)}
      backHref={backHref}
      backLabel={backLabel}
      embedded
    />
  )
}
