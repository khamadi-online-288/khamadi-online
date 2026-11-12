'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import LevelCertificateView from '@/components/english/zku/LevelCertificateView'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { zkuLoginHref } from '@/lib/english/useZkuAppShell'
import { certBySlug, earnedCertsFromProgress, levelCertNumber } from '@/lib/english/zku-level-certs'

const N = '#003876'

interface EarnedState {
  userId: string
  studentName: string
  issuedAt: string | null
}

export default function LevelCertificatePage() {
  const params = useParams()
  const router = useRouter()
  const slug = String(params.level ?? '')
  const cert = certBySlug(slug)
  const [earned, setEarned] = useState<EarnedState | null>(null)
  const [loading, setLoading] = useState(Boolean(cert))

  useEffect(() => {
    if (!cert) return
    const level = cert
    let cancelled = false

    async function load() {
      try {
        const supabase = createEnglishClient()
        const { data: { session } } = await supabase.auth.getSession()
        const user = session?.user
        if (!user) {
          router.replace(zkuLoginHref())
          return
        }

        const [progressRes, profileRes] = await Promise.all([
          supabase
            .from('english_lesson_progress')
            .select('lesson_id, completed_at')
            .eq('user_id', user.id)
            .eq('completed', true)
            .in('lesson_id', level.lessons),
          supabase
            .from('english_user_profiles')
            .select('full_name')
            .eq('user_id', user.id)
            .maybeSingle(),
        ])
        if (progressRes.error) throw progressRes.error
        if (cancelled) return

        const match = earnedCertsFromProgress(
          (progressRes.data ?? []) as { lesson_id: string; completed_at: string | null }[],
        ).find(c => c.code === level.code)
        if (match) {
          const fullName = (profileRes.data as { full_name: string | null } | null)?.full_name
          setEarned({
            userId: user.id,
            studentName: fullName || user.email?.split('@')[0] || 'English Student',
            issuedAt: match.issuedAt,
          })
        }
      } catch {
        // Fall through to the "not earned" state.
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [cert, router])

  if (loading) {
    return (
      <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!cert || !earned) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ fontSize: 16, fontWeight: 700, color: N, marginBottom: 12 }}>Сертификат не найден</div>
        {cert && (
          <div style={{ fontSize: 13, color: '#64748B', marginBottom: 16 }}>
            Сертификат выдаётся после сдачи итогового экзамена уровня.
          </div>
        )}
        <Link href="/english/zku/student/certificates" style={{ color: '#1B8FC4', textDecoration: 'none' }}>← К сертификатам</Link>
      </div>
    )
  }

  return (
    <LevelCertificateView
      cert={cert}
      studentName={earned.studentName}
      issuedAt={earned.issuedAt}
      certId={levelCertNumber(earned.userId, cert.code)}
    />
  )
}
