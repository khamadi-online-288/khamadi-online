'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import { IcLock, IcTrophy, IcGraduation, IcCheck, IcClipboard, IcBook } from '../_icons'

const N = '#003876'
const S = '#1B8FC4'
const G = '#C9933B'
const T = '#1D9E75'

const LEVEL_ORDER = ['A1', 'A1.1', 'A2', 'B1', 'B2', 'C1']
const LEVEL_SLUG: Record<string, string> = { 'A1': 'a1', 'A1.1': 'a11', 'A2': 'a2', 'B1': 'b1', 'B2': 'b2', 'C1': 'c1' }

interface LevelMeta {
  name: string; desc: string; color: string; light: string; border: string; skills: string[]
}

const LEVEL_META: Record<string, LevelMeta> = {
  A1:  { name: 'Beginner',          desc: 'Базовые фразы, приветствия, Present Simple, числа', color: T,         light: '#DCFCE7', border: '#86EFAC', skills: ['Basic vocabulary', 'Present Simple', 'Numbers & Colors', 'Self-introduction'] },
  'A1.1': { name: 'Elementary',     desc: 'Повседневные ситуации, покупки, описания', color: '#16A34A', light: '#DCFCE7', border: '#86EFAC', skills: ['Everyday English', 'Shopping', 'Descriptions', 'Past Simple intro'] },
  A2:  { name: 'Pre-Intermediate',  desc: 'Повседневные ситуации, прошедшее время, диалоги',  color: S,         light: '#DBEAFE', border: '#93C5FD', skills: ['Past Simple', 'Comparatives', 'Daily routines', 'Shopping & Travel'] },
  B1:  { name: 'Intermediate',      desc: 'Свободное общение, условные предложения',           color: '#7C3AED', light: '#EDE9FE', border: '#C4B5FD', skills: ['Conditionals', 'Passive Voice', 'Reported Speech', 'IELTS 5.0+'] },
  B2:  { name: 'Upper-Intermediate',desc: 'Сложные тексты, дискуссии, профессиональная речь',  color: '#DB2777', light: '#FCE7F3', border: '#F9A8D4', skills: ['Advanced Grammar', 'Academic Writing', 'Debates', 'IELTS 6.0+'] },
  C1:  { name: 'Advanced',          desc: 'Беглая речь, академические тексты, бизнес',         color: '#D97706', light: '#FEF3C7', border: '#FCD34D', skills: ['Idiomatic English', 'Academic Research', 'Business English', 'IELTS 7.0+'] },
}

function CertificateCard({
  levelCode, status, studentName, issuedAt,
}: {
  levelCode: string; status: 'earned' | 'in_progress' | 'locked'
  studentName: string; issuedAt?: string
}) {
  const { t } = useZkuLang()
  const [flipped, setFlipped] = useState(false)
  const meta  = LEVEL_META[levelCode]
  if (!meta) return null
  const color = meta.color

  if (status === 'locked') {
    return (
      <div style={{ borderRadius: 20, border: '2px dashed #E2E8F0', background: '#FAFAFA', opacity: 0.55 }}>
        <div style={{ padding: '32px 24px', textAlign: 'center' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><IcLock size={36} color="#CBD5E1" /></div>
          <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 99, background: '#F1F5F9', color: '#CBD5E1', fontSize: 16, fontWeight: 900, marginBottom: 6 }}>{levelCode}</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#CBD5E1', marginBottom: 2 }}>{meta.name}</div>
          <div style={{ fontSize: 11, color: '#CBD5E1' }}>{t.certs.locked_msg}</div>
        </div>
      </div>
    )
  }

  if (status === 'in_progress') {
    return (
      <div style={{ borderRadius: 20, border: `2px solid ${meta.border}`, background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
        <div style={{ height: 6, background: `linear-gradient(90deg, ${color}, ${color}88)`, borderRadius: '18px 18px 0 0' }} />
        <div style={{ padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, flexShrink: 0, background: meta.light, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, color }}>{levelCode}</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: N }}>{meta.name}</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>{t.certs.in_progress}</div>
            </div>
            <div style={{ marginLeft: 'auto', fontSize: 22, fontWeight: 900, color }}>0%</div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <div style={{ height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
              <div style={{ height: '100%', width: '0%', background: color, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 5 }}>100{t.certs.left_to}</div>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
            {meta.skills.map(s => <span key={s} style={{ fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: meta.light, color }}>{s}</span>)}
          </div>
          <Link href={`/english/zku/student/course/${LEVEL_SLUG[levelCode] ?? 'a1'}`} style={{
            display: 'block', textAlign: 'center', background: color, color: '#fff',
            padding: '11px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none',
          }}>{t.certs.continue}</Link>
        </div>
      </div>
    )
  }

  // EARNED
  return (
    <div onClick={() => setFlipped(f => !f)} style={{ cursor: 'pointer', perspective: 1000 }}>
      <div style={{
        position: 'relative', transformStyle: 'preserve-3d',
        transition: 'transform 0.6s', transform: flipped ? 'rotateY(180deg)' : 'rotateY(0)',
        borderRadius: 20, boxShadow: `0 8px 32px ${color}33`,
      }}>
        {/* FRONT */}
        <div style={{ backfaceVisibility: 'hidden', borderRadius: 20, overflow: 'hidden', border: `2px solid ${meta.border}`, background: `linear-gradient(145deg, ${meta.light} 0%, #fff 60%)` }}>
          <div style={{ background: `linear-gradient(135deg, ${color}, ${N})`, padding: '20px 24px', color: '#fff', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', right: -30, top: -30, width: 120, height: 120, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{t.certs.completion_cert}</div>
                <div style={{ fontSize: 22, fontWeight: 900 }}>{levelCode} · {meta.name}</div>
              </div>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '2px solid rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><IcTrophy size={24} color="rgba(255,255,255,0.9)" /></div>
            </div>
          </div>
          <div style={{ padding: '18px 22px' }}>
            <div style={{ textAlign: 'center', marginBottom: 14, padding: '12px', background: meta.light, borderRadius: 10 }}>
              <div style={{ fontSize: 11, color: '#94A3B8', marginBottom: 3 }}>{t.certs.issued_to}</div>
              <div style={{ fontSize: 17, fontWeight: 900, color: N }}>{studentName || '—'}</div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{t.certs.skills_conf}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
                {meta.skills.map(s => <span key={s} style={{ fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 99, background: meta.light, color, border: `1px solid ${meta.border}` }}>{s}</span>)}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 12, borderTop: '1px solid #F1F5F9' }}>
              <div>
                <div style={{ fontSize: 10, color: '#CBD5E1' }}>{t.certs.issued_at}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: N }}>{issuedAt ? new Date(issuedAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) : '—'}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 10, color: '#CBD5E1' }}>{t.certs.org}</div>
                <div style={{ fontSize: 11, fontWeight: 700, color: N }}>ЗКУ им. М. Утемісова · KHAMADI English</div>
              </div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: '#CBD5E1', textAlign: 'center' }}>{t.certs.flip_hint}</div>
          </div>
        </div>

        {/* BACK */}
        <div style={{
          position: 'absolute', inset: 0, backfaceVisibility: 'hidden',
          transform: 'rotateY(180deg)', borderRadius: 20, overflow: 'hidden',
          background: `linear-gradient(145deg, ${N} 0%, #0a4fa8 100%)`,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
          color: '#fff', padding: 28, textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><IcGraduation size={44} color="rgba(255,255,255,0.9)" /></div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>ЗАПАДНО-КАЗАХСТАНСКИЙ УНИВЕРСИТЕТ</div>
          <div style={{ fontSize: 20, fontWeight: 900, color: G, marginBottom: 4 }}>{levelCode} — {meta.name}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', marginBottom: 20, lineHeight: 1.6 }}>{meta.desc}</div>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, boxShadow: '0 4px 20px rgba(201,147,59,0.4)' }}><IcCheck size={24} color="#fff" /></div>
          <button onClick={e => {
            e.stopPropagation()
            const map: Record<string,string> = { 'A1': '/english/zku/student/certificates/a1', 'A1.1': '/english/zku/student/certificates/a11' }
            if (map[levelCode]) window.open(map[levelCode], '_blank')
          }} style={{
            padding: '11px 26px', borderRadius: 12, border: 'none', background: G, color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.certs.download}</button>
        </div>
      </div>
    </div>
  )
}

export default function CertificatesPage() {
  const { t } = useZkuLang()
  const [currentLevel,  setCurrentLevel]  = useState('A1')
  const [studentName,   setStudentName]   = useState('')
  const [levelChangedAt, setLevelChangedAt] = useState<string | null>(null)
  const [loading,       setLoading]       = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoading(false); return }

      const emailSlug = user.email?.split('@')[0] ?? ''
      const meta      = user.user_metadata
      const metaName: string = meta?.full_name ?? meta?.name ?? ''

      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('full_name, current_level, last_active_at, created_at')
        .eq('user_id', user.id)
        .maybeSingle()

      const dbName = profile?.full_name ?? ''
      const name   = (metaName && metaName !== emailSlug) ? metaName
                   : (dbName   && dbName   !== emailSlug) ? dbName
                   : metaName || dbName || emailSlug
      setStudentName(name)
      setCurrentLevel(profile?.current_level ?? 'A1')
      // Use last_active_at as a proxy for when level was last updated
      setLevelChangedAt(profile?.last_active_at ?? profile?.created_at ?? null)
      setLoading(false)
    }
    load()
  }, [])

  function getStatus(levelCode: string): 'earned' | 'in_progress' | 'locked' {
    const myIdx  = LEVEL_ORDER.indexOf(currentLevel)
    const lvIdx  = LEVEL_ORDER.indexOf(levelCode)
    if (lvIdx < myIdx)  return 'earned'
    if (lvIdx === myIdx) return 'in_progress'
    return 'locked'
  }

  const earnedCount     = LEVEL_ORDER.filter(lv => getStatus(lv) === 'earned').length
  const inProgressCount = LEVEL_ORDER.filter(lv => getStatus(lv) === 'in_progress').length
  const lockedCount     = LEVEL_ORDER.filter(lv => getStatus(lv) === 'locked').length

  if (loading) return <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Montserrat', sans-serif", color: N, fontWeight: 700 }}>{t.common.loading}</div>

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>{t.course.platform}</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: N, letterSpacing: '-0.02em', marginBottom: 8 }}>{t.certs.title}</h1>
        <p style={{ fontSize: 14, color: '#64748B' }}>{t.certs.subtitle}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { icon: <IcTrophy size={22} color={G} />,         v: earnedCount,     l: t.certs.earned,      color: G,         bg: '#FEF3C7' },
          { icon: <IcBook size={22} color={S} />,           v: inProgressCount, l: t.certs.in_progress, color: S,         bg: '#DBEAFE' },
          { icon: <IcLock size={22} color="#94A3B8" />,     v: lockedCount,     l: t.certs.locked,      color: '#94A3B8', bg: '#F1F5F9' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{s.icon}</div>
            <div>
              <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
              <div style={{ fontSize: 12, color: '#94A3B8', marginTop: 3 }}>{s.l}</div>
            </div>
          </div>
        ))}
      </div>

      {/* How it works */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #0a4fa8 100%)`, borderRadius: 18, padding: '18px 24px', marginBottom: 28, display: 'flex', alignItems: 'center', gap: 20, color: '#fff' }}>
        <div style={{ flexShrink: 0 }}><IcClipboard size={32} color="rgba(255,255,255,0.85)" /></div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 800, marginBottom: 4 }}>{t.certs.how_title}</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6 }}>{t.certs.how_body}</div>
        </div>
        <Link href="/english/zku/student/course" style={{ flexShrink: 0, padding: '10px 20px', borderRadius: 12, background: G, color: '#fff', fontSize: 13, fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(201,147,59,0.35)' }}>
          {t.certs.to_courses}
        </Link>
      </div>

      {/* Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20 }}>
        {LEVEL_ORDER.map(lv => (
          <CertificateCard
            key={lv}
            levelCode={lv}
            status={getStatus(lv)}
            studentName={studentName}
            issuedAt={getStatus(lv) === 'earned' ? levelChangedAt ?? undefined : undefined}
          />
        ))}
      </div>

      <div style={{ marginTop: 28, padding: '16px 20px', borderRadius: 14, background: '#F8FBFF', border: '1px solid rgba(27,143,196,0.12)', fontSize: 13, color: '#64748B', textAlign: 'center' }}>
        {t.certs.footer_note}
      </div>
    </div>
  )
}