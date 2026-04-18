'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type CertRow = {
  id: string
  certificate_number: string
  issued_at: string
  course_id: string
  course_title: string
  course_level: string
}

export default function CertificateListPage() {
  const router = useRouter()
  const [certs, setCerts]   = useState<CertRow[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }

      const { data: rows } = await supabase
        .from('english_certificates')
        .select('id, certificate_number, issued_at, course_id')
        .eq('user_id', user.id)
        .order('issued_at', { ascending: false })

      if (!rows || rows.length === 0) { setLoading(false); return }

      const courseIds = [...new Set(rows.map((r: { course_id: string }) => r.course_id))]
      const { data: courses } = await supabase
        .from('english_courses')
        .select('id, title, level')
        .in('id', courseIds)

      const courseMap = new Map(
        (courses || []).map((c: { id: string; title: string; level: string }) => [c.id, c])
      )

      setCerts(
        rows.map((r: { id: string; certificate_number: string; issued_at: string; course_id: string }) => ({
          ...r,
          course_title: (courseMap.get(r.course_id) as { title: string } | undefined)?.title || 'Course',
          course_level: (courseMap.get(r.course_id) as { level: string } | undefined)?.level || '',
        }))
      )
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fcff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка сертификатов...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f8fcff 0%,#eef8ff 50%,#fff 100%)', padding: '0 0 60px' }}>

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(14,165,233,0.10)',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 960, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ border: '1px solid rgba(14,165,233,0.18)', borderRadius: 12, padding: '8px 16px', background: 'transparent', cursor: 'pointer', fontSize: 13, fontWeight: 800, color: '#0284c7' }}
          >
            ← Дашборд
          </button>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9', letterSpacing: '0.06em' }}>KHAMADI ENGLISH</span>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: '0 auto', padding: '40px 5% 0' }}>

        {/* HEADER */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ fontSize: 12, fontWeight: 900, color: '#0ea5e9', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 8 }}>
            Мои достижения
          </div>
          <h1 style={{ fontSize: 34, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.05em', margin: 0 }}>
            Сертификаты
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600, marginTop: 8 }}>
            {certs.length > 0
              ? `Вы получили ${certs.length} ${certs.length === 1 ? 'сертификат' : certs.length < 5 ? 'сертификата' : 'сертификатов'}`
              : 'Завершите курс, чтобы получить первый сертификат'}
          </p>
        </div>

        {/* EMPTY */}
        {certs.length === 0 && (
          <div style={{
            borderRadius: 28, padding: '60px 32px', textAlign: 'center',
            background: 'rgba(255,255,255,0.84)', border: '1px dashed rgba(14,165,233,0.20)',
            boxShadow: '0 16px 38px rgba(14,165,233,0.07)',
          }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>📜</div>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', marginBottom: 10 }}>Пока нет сертификатов</div>
            <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600, marginBottom: 24, maxWidth: 400, margin: '0 auto 24px' }}>
              Пройдите все уроки курса, чтобы автоматически получить сертификат.
            </p>
            <button
              onClick={() => router.push('/english/dashboard')}
              style={{
                padding: '12px 28px', borderRadius: 14, border: 'none', cursor: 'pointer',
                background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', color: '#fff',
                fontSize: 14, fontWeight: 800, boxShadow: '0 12px 26px rgba(14,165,233,0.18)',
              }}
            >
              Перейти к курсам →
            </button>
          </div>
        )}

        {/* GRID */}
        {certs.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 18 }}>
            {certs.map((cert) => (
              <div
                key={cert.id}
                style={{
                  borderRadius: 28, padding: 24,
                  background: 'linear-gradient(135deg, #f0f9ff 0%, #fff 100%)',
                  border: '1px solid rgba(14,165,233,0.14)',
                  boxShadow: '0 16px 38px rgba(14,165,233,0.08)',
                  transition: 'transform .22s ease, box-shadow .22s ease',
                  cursor: 'default',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 24px 48px rgba(14,165,233,0.13)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = ''; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 16px 38px rgba(14,165,233,0.08)' }}
              >
                {/* Icon + badge */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{
                    width: 54, height: 54, borderRadius: 18,
                    background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 26, boxShadow: '0 12px 28px rgba(14,165,233,0.22)',
                  }}>🏆</div>
                  <span style={{
                    padding: '5px 12px', borderRadius: 999,
                    background: 'rgba(56,189,248,0.10)', color: '#0284c7',
                    border: '1px solid rgba(14,165,233,0.12)',
                    fontSize: 11, fontWeight: 900, letterSpacing: '0.04em',
                  }}>
                    {cert.course_level || 'Certificate'}
                  </span>
                </div>

                {/* Course title */}
                <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a', marginBottom: 6, lineHeight: 1.3 }}>
                  {cert.course_title}
                </div>

                {/* Cert number */}
                <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', marginBottom: 4, letterSpacing: '0.04em' }}>
                  № {cert.certificate_number}
                </div>

                {/* Date */}
                <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 20 }}>
                  Выдан: {new Date(cert.issued_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })}
                </div>

                {/* Button */}
                <button
                  onClick={() => router.push(`/english/certificate/${cert.id}`)}
                  style={{
                    width: '100%', padding: '11px 0', borderRadius: 14, border: 'none',
                    cursor: 'pointer', fontSize: 14, fontWeight: 800,
                    background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)',
                    color: '#fff', boxShadow: '0 10px 22px rgba(14,165,233,0.16)',
                    transition: 'transform .18s ease',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = '')}
                >
                  Просмотреть →
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
