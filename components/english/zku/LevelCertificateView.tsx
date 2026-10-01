'use client'

import React, { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { downloadCertificatePdf } from '@/lib/english/download-certificate-pdf'
import type { LevelCert } from '@/lib/english/zku-level-certs'

const N = '#003876'
const G = '#C9933B'

const COMPETENCIES = [
  { icon: '📖', label: 'Reading', desc: 'Texts & comprehension' },
  { icon: '🎧', label: 'Listening', desc: 'Dialogues & conversations' },
  { icon: '✍️', label: 'Writing', desc: 'Emails, descriptions, essays' },
  { icon: '📐', label: 'Grammar', desc: 'Structures of this level' },
  { icon: '📚', label: 'Vocabulary', desc: 'Words across the modules' },
  { icon: '🧩', label: 'Use of English', desc: 'Grammar in context' },
]

export default function LevelCertificateView({
  cert,
  studentName: studentNameProp,
  issuedAt,
  certId: certIdProp,
  backHref = '/english/zku/student/certificates',
  backLabel = '← Certificates',
  embedded = false,
}: {
  cert: LevelCert
  studentName?: string
  issuedAt?: string | null
  certId?: string
  backHref?: string
  backLabel?: string
  embedded?: boolean
}) {
  const [studentName, setStudentName] = useState(studentNameProp ?? 'English Student')
  const [completionDate, setCompletionDate] = useState('')
  const [loading, setLoading] = useState(!studentNameProp)
  const [certId, setCertId] = useState(certIdProp ?? '')
  const [downloading, setDownloading] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  async function handleDownload() {
    if (!certRef.current || downloading) return
    setDownloading(true)
    try {
      await downloadCertificatePdf(certRef.current, `certificate-${cert.code}.pdf`)
    } finally {
      setDownloading(false)
    }
  }

  useEffect(() => {
    const issued = issuedAt ? new Date(issuedAt) : new Date()
    const date = Number.isNaN(issued.getTime()) ? new Date() : issued
    setCompletionDate(date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }))
    setCertId(certIdProp ?? `WKU-${cert.code.replace('.', '')}-${Date.now().toString(36).toUpperCase().slice(-8)}`)

    if (studentNameProp) {
      setStudentName(studentNameProp)
      setLoading(false)
      return
    }

    async function fetchStudent() {
      try {
        const supabase = createEnglishClient()
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data } = await supabase
            .from('english_user_profiles')
            .select('full_name')
            .eq('user_id', session.user.id)
            .maybeSingle()
          if (data?.full_name) setStudentName(data.full_name)
          else if (session.user.email) setStudentName(session.user.email.split('@')[0])
        }
      } catch {
        // keep default name
      } finally {
        setLoading(false)
      }
    }
    fetchStudent()
  }, [cert.code, studentNameProp, issuedAt, certIdProp])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${N}`, borderTopColor: 'transparent', borderRadius: '50%' }} />
      </div>
    )
  }

  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .cert-page { box-shadow: none !important; }
        }
      `}</style>

      <div className="no-print" style={{ background: '#fff', borderBottom: '1px solid rgba(0,56,118,0.08)', padding: '0 24px', position: 'sticky', top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
          <Link href={backHref} style={{ color: '#64748B', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            {backLabel}
          </Link>
          <div style={{ flex: 1 }} />
          <button onClick={handleDownload} disabled={downloading} style={{
            background: `linear-gradient(135deg, ${G}, #b8842e)`,
            color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px',
            fontSize: 14, fontWeight: 700, cursor: downloading ? 'wait' : 'pointer',
            opacity: downloading ? 0.7 : 1,
          }}>
            {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>

      <div style={{ minHeight: embedded ? undefined : '100vh', background: embedded ? 'transparent' : '#F0F4F8', padding: embedded ? '24px 24px 48px' : '40px 24px 120px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        <div ref={certRef} className="cert-page" style={{ width: '100%', maxWidth: 820, background: '#fff', borderRadius: 4, boxShadow: '0 20px 80px rgba(0,56,118,0.18)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', inset: 14, border: `2px solid ${G}`, borderRadius: 2, pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 18, border: '1px solid rgba(201,147,59,0.3)', borderRadius: 2, pointerEvents: 'none', zIndex: 1 }} />

          <div style={{ background: cert.header, padding: '32px 60px 28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: `linear-gradient(135deg, ${G}, #b8842e)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 900, color: '#fff' }}>WKU</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>West Kazakhstan University named after Makhambet Utemisov</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>KHAMADI English Programme</div>
              </div>
            </div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>Certificate of Achievement</div>
            <div style={{ color: G, fontSize: 26, fontWeight: 900, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{cert.program}</div>
          </div>

          <div style={{ padding: '44px 60px' }}>
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>This is to certify that</div>
              <div style={{ fontSize: 34, fontWeight: 900, color: N, borderBottom: `2px solid ${G}`, paddingBottom: 10, display: 'inline-block', minWidth: 280 }}>{studentName}</div>
              <div style={{ fontSize: 14, color: '#64748B', marginTop: 12, lineHeight: 1.7 }}>
                has successfully completed the full <strong>{cert.program}</strong> programme<br />
                at the KHAMADI English Programme, West Kazakhstan University named after Makhambet Utemisov (WKU), Uralsk.
              </div>
            </div>

            <div style={{ marginBottom: 28 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 16 }}>Competencies Confirmed</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {COMPETENCIES.map(s => (
                  <div key={s.label} style={{ padding: '12px 14px', borderRadius: 10, background: '#F8FAFC', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: N }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center', marginBottom: 28 }}>
              {cert.skills.map(s => (
                <span key={s} style={{ fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 99, background: `${cert.color}14`, color: cert.color, border: `1px solid ${cert.color}33` }}>{s}</span>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 28 }}>
              {[
                { label: 'Director of Studies', name: 'English Department', org: 'WKU, Uralsk' },
                { label: 'Programme Coordinator', name: 'KHAMADI English', org: 'West Kazakhstan' },
                { label: 'Date of Issue', name: completionDate, org: 'Certificate ID: ' + certId },
              ].map(sig => (
                <div key={sig.label} style={{ textAlign: 'center' }}>
                  <div style={{ height: 40, borderBottom: '1px solid #CBD5E1', marginBottom: 8 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: N }}>{sig.name}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{sig.label}</div>
                  <div style={{ fontSize: 9, color: '#CBD5E1', marginTop: 2 }}>{sig.org}</div>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 16, borderTop: '1px solid #F1F5F9' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: N }}>Officially issued by WKU · khamadi.online</div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#CBD5E1', fontFamily: 'monospace' }}>{certId}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="no-print" style={{ position: embedded ? 'static' : 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href={backHref} style={{ padding: '12px 28px', borderRadius: 10, border: '1px solid #E2E8F0', fontSize: 14, fontWeight: 700, color: '#64748B', textDecoration: 'none', background: '#fff' }}>
            {backLabel}
          </Link>
          <button onClick={handleDownload} disabled={downloading} style={{ padding: '12px 32px', borderRadius: 10, background: cert.button, color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: downloading ? 'wait' : 'pointer', opacity: downloading ? 0.7 : 1 }}>
            {downloading ? 'Preparing PDF…' : 'Download PDF'}
          </button>
        </div>
      </div>
    </>
  )
}
