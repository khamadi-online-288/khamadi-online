'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Certificate = {
  id: string
  certificate_number: string
  issued_at: string
  course: { title: string; level: string; category: string }
  user: { full_name: string }
}

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [cert, setCert]       = useState<Certificate | null>(null)
  const [loading, setLoading] = useState(true)
  const certRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }

      const { data: certRow } = await supabase
        .from('english_certificates')
        .select('id, certificate_number, issued_at, course_id')
        .eq('id', id)
        .eq('user_id', user.id)
        .single()

      if (!certRow) { setLoading(false); return }

      const [courseRes, roleRes] = await Promise.all([
        supabase.from('english_courses').select('title, level, category').eq('id', certRow.course_id).single(),
        supabase.from('english_user_roles').select('full_name').eq('user_id', user.id).maybeSingle(),
      ])

      setCert({
        id: certRow.id,
        certificate_number: certRow.certificate_number,
        issued_at: certRow.issued_at,
        course: courseRes.data as { title: string; level: string; category: string },
        user: { full_name: (roleRes.data as { full_name: string } | null)?.full_name || user.email?.split('@')[0] || 'Student' },
      })
      setLoading(false)
    }
    load()
  }, [id, router])

  const handlePrint = () => window.print()

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка сертификата...</p>
        </div>
      </div>
    )
  }

  if (!cert) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 16 }}>Сертификат не найден</div>
          <button className="btn-primary" onClick={() => router.push('/english/dashboard')}>← Назад</button>
        </div>
      </div>
    )
  }

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('ru-RU', { year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh', padding: '40px 20px' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <style>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          .cert-card { box-shadow: none !important; }
        }
      `}</style>

      {/* Controls */}
      <div className="no-print fade-up" style={{ display: 'flex', justifyContent: 'center', gap: 14, marginBottom: 36, position: 'relative', zIndex: 1 }}>
        <button className="btn-secondary" onClick={() => router.push('/english/dashboard')}>
          ← Назад
        </button>
        <button className="btn-primary" onClick={handlePrint}>
          🖨️ Скачать / Печать
        </button>
      </div>

      {/* Certificate */}
      <motion.div
        ref={certRef}
        className="cert-card"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{
          maxWidth: 820,
          margin: '0 auto',
          background: 'linear-gradient(160deg, #0c4a6e 0%, #0369a1 50%, #0c4a6e 100%)',
          borderRadius: 32,
          padding: '56px 64px',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 40px 100px rgba(14,165,233,0.2), 0 0 60px rgba(14,165,233,0.1)',
          zIndex: 1,
        }}
      >
        {/* Decorative rings */}
        <div style={{ position: 'absolute', top: -60, left: -60, width: 220, height: 220, borderRadius: 999, background: 'rgba(255,255,255,0.04)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, right: -80, width: 280, height: 280, borderRadius: 999, background: 'rgba(56,189,248,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 24, left: 24, width: 80, height: 80, borderRadius: 999, border: '1px solid rgba(255,255,255,0.12)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: 34, right: 34, width: 60, height: 60, borderRadius: 999, border: '1px solid rgba(255,255,255,0.1)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 24, left: 24, width: 50, height: 50, borderRadius: 999, border: '1px solid rgba(255,255,255,0.08)', pointerEvents: 'none' }} />

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: 52, marginBottom: 10 }}>🏆</div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#38bdf8', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 6 }}>KHAMADI ENGLISH</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 36 }}>Certificate of Completion</div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 32 }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)' }} />
            <div style={{ fontSize: 16, color: '#38bdf8' }}>✦</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(56,189,248,0.4), transparent)' }} />
          </div>

          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginBottom: 12, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Настоящий сертификат подтверждает, что
          </div>
          <div style={{ fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', marginBottom: 16 }}>
            {cert.user.full_name}
          </div>

          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', fontWeight: 700, marginBottom: 12 }}>
            успешно завершил(а) курс
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#38bdf8', letterSpacing: '-0.02em', marginBottom: 12 }}>
            {cert.course.title}
          </div>
          <div style={{ display: 'inline-block', padding: '8px 20px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', fontSize: 13, fontWeight: 800, marginBottom: 12 }}>
            {cert.course.level} · {cert.course.category}
          </div>

          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0' }}>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)' }}>✦</div>
            <div style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent)' }} />
          </div>

          {/* Footer info */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Дата выдачи</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>{issuedDate}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Номер сертификата</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#38bdf8' }}>{cert.certificate_number}</div>
            </div>
            <div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Платформа</div>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#fff' }}>khamadi.online</div>
            </div>
          </div>

          <div style={{ marginTop: 32, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 700, letterSpacing: '0.06em' }}>
            © 2026 KHAMADI ONLINE · khamadi.online
          </div>
        </div>
      </motion.div>
    </div>
  )
}
