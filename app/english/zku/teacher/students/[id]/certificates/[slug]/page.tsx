'use client'

import { use, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import LevelCertificateView from '@/components/english/zku/LevelCertificateView'
import { certBySlug, levelCertNumber, type EarnedLevelCert } from '@/lib/english/zku-level-certs'

const N = '#003876'

export default function TeacherStudentCertificatePage({
  params,
}: {
  params: Promise<{ id: string; slug: string }>
}) {
  const { id, slug } = use(params)
  const router = useRouter()
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

      const res = await fetch(`/api/english/teacher/students/${id}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
      const data = await res.json() as {
        student?: { full_name: string | null }
        certificates?: EarnedLevelCert[]
      }

      if (!res.ok || !data.student) {
        router.replace('/english/zku/teacher/students')
        return
      }

      const earned = (data.certificates ?? []).find(c => c.slug === slug)
      if (!earned) {
        setMissing(true)
        setLoading(false)
        return
      }

      setStudentName(data.student.full_name || 'Студент')
      setIssuedAt(earned.issuedAt)
      setLoading(false)
    }
    load()
  }, [cert, id, slug, router])

  const backHref = `/english/zku/teacher/students/${id}`

  if (loading) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (missing || !cert) {
    return (
      <div style={{ padding: '48px 28px', maxWidth: 640, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>Сертификат не найден</div>
        <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>У этого студента нет сертификата такого уровня.</div>
        <Link href={backHref} style={{ color: '#1B8FC4', textDecoration: 'none', fontWeight: 700, fontSize: 13 }}>← К студенту</Link>
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
      backLabel="← К студенту"
      embedded
    />
  )
}
