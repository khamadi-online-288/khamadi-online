'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const G = '#C9933B'
const T = '#1D9E75'

export default function A1CertificatePage() {
  const [studentName, setStudentName] = useState<string>('English Student')
  const [completionDate, setCompletionDate] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const now = new Date()
    setCompletionDate(now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }))

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
  }, [])

  function handlePrint() {
    window.print()
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ width: 40, height: 40, border: `3px solid ${N}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const certId = `WKU-A1-${Date.now().toString(36).toUpperCase().slice(-8)}`

  return (
    <>
      {/* Print styles */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; }
          .cert-page { box-shadow: none !important; }
        }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      {/* Top bar — no print */}
      <div className="no-print" style={{
        background: '#fff', borderBottom: '1px solid rgba(0,56,118,0.08)',
        padding: '0 24px', position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 60 }}>
          <Link href="/english/zku/student/certificates" style={{ color: '#64748B', textDecoration: 'none', fontSize: 12, fontWeight: 600 }}>
            ← Certificates
          </Link>
          <div style={{ flex: 1 }} />
          <button onClick={handlePrint} style={{
            background: `linear-gradient(135deg, ${G}, #b8842e)`,
            color: '#fff', border: 'none', borderRadius: 10, padding: '10px 24px',
            fontSize: 14, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8,
          }}>
            🖨️ Print / Save as PDF
          </button>
        </div>
      </div>

      {/* Page background */}
      <div style={{ minHeight: '100vh', background: '#F0F4F8', padding: '40px 24px 60px', display: 'flex', alignItems: 'flex-start', justifyContent: 'center' }}>
        {/* Certificate */}
        <div className="cert-page" style={{
          width: '100%', maxWidth: 820,
          background: '#fff',
          borderRadius: 4,
          boxShadow: '0 20px 80px rgba(0,56,118,0.18)',
          animation: 'fadeIn 0.5s ease',
          position: 'relative',
          overflow: 'hidden',
        }}>

          {/* Outer gold border */}
          <div style={{ position: 'absolute', inset: 14, border: `2px solid ${G}`, borderRadius: 2, pointerEvents: 'none', zIndex: 1 }} />
          <div style={{ position: 'absolute', inset: 18, border: `1px solid rgba(201,147,59,0.3)`, borderRadius: 2, pointerEvents: 'none', zIndex: 1 }} />

          {/* Corner ornaments */}
          {[{t:8,l:8},{t:8,r:8},{b:8,l:8},{b:8,r:8}].map((pos, i) => (
            <div key={i} style={{
              position: 'absolute', width: 40, height: 40, zIndex: 2,
              ...(pos.t !== undefined ? { top: pos.t } : { bottom: pos.b }),
              ...(pos.l !== undefined ? { left: pos.l } : { right: pos.r }),
              borderTop: pos.t !== undefined ? `3px solid ${G}` : 'none',
              borderBottom: pos.b !== undefined ? `3px solid ${G}` : 'none',
              borderLeft: pos.l !== undefined ? `3px solid ${G}` : 'none',
              borderRight: pos.r !== undefined ? `3px solid ${G}` : 'none',
            }} />
          ))}

          {/* Header band */}
          <div style={{
            background: `linear-gradient(135deg, ${N} 0%, #012f5c 100%)`,
            padding: '32px 60px 28px',
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Decorative circles */}
            <div style={{ position: 'absolute', right: -40, top: -40, width: 160, height: 160, borderRadius: '50%', background: 'rgba(201,147,59,0.08)' }} />
            <div style={{ position: 'absolute', left: -20, bottom: -20, width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.03)' }} />

            {/* WKU logo area */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%',
                background: `linear-gradient(135deg, ${G}, #b8842e)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 20px rgba(201,147,59,0.4)`,
                fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-1px',
              }}>WKU</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ color: 'rgba(255,255,255,0.55)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 3 }}>West Kazakhstan University named after Makhambет Utemisov</div>
                <div style={{ color: '#fff', fontSize: 16, fontWeight: 800 }}>KHAMADI English Programme</div>
              </div>
            </div>

            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: 8 }}>
              Certificate of Achievement
            </div>
            <div style={{ color: G, fontSize: 28, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
              A1 English — Beginner Level
            </div>
          </div>

          {/* Main content */}
          <div style={{ padding: '44px 60px' }}>

            {/* Certifies that */}
            <div style={{ textAlign: 'center', marginBottom: 36 }}>
              <div style={{ fontSize: 13, color: '#94A3B8', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                This is to certify that
              </div>
              <div style={{ fontSize: 34, fontWeight: 900, color: N, borderBottom: `2px solid ${G}`, paddingBottom: 10, display: 'inline-block', minWidth: 300, letterSpacing: '-0.5px' }}>
                {studentName}
              </div>
              <div style={{ fontSize: 14, color: '#64748B', marginTop: 12, lineHeight: 1.7 }}>
                has successfully completed the full <strong>A1 English Beginner Level</strong> programme<br />
                at the KHAMADI English Programme, West Kazakhstan University named after Makhambет Utemisov (WKU), Uralsk.
              </div>
            </div>

            {/* Skills confirmed */}
            <div style={{ marginBottom: 36 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', textAlign: 'center', marginBottom: 16 }}>
                Competencies Confirmed
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[
                  { icon: '📖', label: 'Reading', desc: 'A1 texts & comprehension' },
                  { icon: '🎧', label: 'Listening', desc: 'Dialogues & conversations' },
                  { icon: '✍️', label: 'Writing', desc: 'Emails, descriptions, essays' },
                  { icon: '📐', label: 'Grammar', desc: 'All A1 structures (M1–M15)' },
                  { icon: '📚', label: 'Vocabulary', desc: '350+ words across 15 modules' },
                  { icon: '🧩', label: 'Use of English', desc: 'Grammar in context' },
                ].map(s => (
                  <div key={s.label} style={{
                    padding: '12px 14px', borderRadius: 10,
                    background: '#F8FAFC', border: '1px solid #E2E8F0',
                    display: 'flex', alignItems: 'flex-start', gap: 10,
                  }}>
                    <span style={{ fontSize: 18 }}>{s.icon}</span>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 800, color: N }}>{s.label}</div>
                      <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 1 }}>{s.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* CEFR level band */}
            <div style={{
              background: `linear-gradient(135deg, rgba(0,56,118,0.04), rgba(201,147,59,0.06))`,
              border: `1px solid rgba(201,147,59,0.3)`,
              borderRadius: 12, padding: '16px 24px',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 36,
            }}>
              <div>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>CEFR Level</div>
                <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(lv => (
                    <div key={lv} style={{
                      padding: '4px 12px', borderRadius: 99, fontSize: 11, fontWeight: 800,
                      background: lv === 'A1' ? N : '#F1F5F9',
                      color: lv === 'A1' ? '#fff' : '#CBD5E1',
                    }}>{lv}</div>
                  ))}
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 4 }}>Exam Components Passed</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: N }}>Reading & Use of English · Listening · Writing</div>
              </div>
            </div>

            {/* Signatures row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24, marginBottom: 32 }}>
              {[
                { label: 'Director of Studies', name: 'English Department', org: 'WKU, Uralsk' },
                { label: 'Programme Coordinator', name: 'KHAMADI English', org: 'West Kazakhstan' },
                { label: 'Date of Issue', name: completionDate, org: 'Certificate ID: ' + certId },
              ].map(sig => (
                <div key={sig.label} style={{ textAlign: 'center' }}>
                  <div style={{ height: 40, borderBottom: `1px solid #CBD5E1`, marginBottom: 8 }} />
                  <div style={{ fontSize: 11, fontWeight: 700, color: N }}>{sig.name}</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>{sig.label}</div>
                  <div style={{ fontSize: 9, color: '#CBD5E1', marginTop: 2 }}>{sig.org}</div>
                </div>
              ))}
            </div>

            {/* Seal + footer */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 20, borderTop: `1px solid #F1F5F9` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{
                  width: 56, height: 56, borderRadius: '50%',
                  border: `2px solid ${G}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
                  background: `rgba(201,147,59,0.04)`,
                }}>
                  <div style={{ fontSize: 7, fontWeight: 900, color: G, textAlign: 'center', lineHeight: 1.2, letterSpacing: '0.05em' }}>KHAMADI{'\n'}ENGLISH</div>
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: N }}>Officially issued by WKU</div>
                  <div style={{ fontSize: 10, color: '#94A3B8' }}>khamadi.online · English Programme</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 9, color: '#CBD5E1' }}>Verify at khamadi.online</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#CBD5E1', fontFamily: 'monospace' }}>{certId}</div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Bottom actions — no print */}
      <div className="no-print" style={{ position: 'fixed', bottom: 0, left: 0, right: 0, background: '#fff', borderTop: '1px solid #E2E8F0', padding: '16px 24px' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', display: 'flex', gap: 12, justifyContent: 'center' }}>
          <Link href="/english/zku/student/certificates" style={{
            padding: '12px 28px', borderRadius: 10, border: `1px solid #E2E8F0`,
            fontSize: 14, fontWeight: 700, color: '#64748B', textDecoration: 'none',
            background: '#fff',
          }}>
            ← All Certificates
          </Link>
          <button onClick={handlePrint} style={{
            padding: '12px 32px', borderRadius: 10,
            background: `linear-gradient(135deg, ${N}, #012f5c)`,
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            🖨️ Print Certificate
          </button>
          <button onClick={handlePrint} style={{
            padding: '12px 32px', borderRadius: 10,
            background: `linear-gradient(135deg, ${G}, #b8842e)`,
            color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer',
          }}>
            💾 Save as PDF
          </button>
        </div>
      </div>
    </>
  )
}
