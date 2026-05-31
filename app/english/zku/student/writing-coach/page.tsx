'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import { IcMail, IcEdit, IcBookOpen, IcStar, IcPalette, IcBarChart } from '../_icons'

const NAVY = '#003876'
const MUTED = '#64748B'

function ProgressBar({ value, color }: { value: number; color: string }) {
  return (
    <div style={{ height: 7, background: 'rgba(0,56,118,0.08)', borderRadius: 999, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${Math.min(100, value)}%`, background: color, borderRadius: 999 }} />
    </div>
  )
}

interface WorkEntry {
  lesson_id: string
  lesson_title: string | null
  score: number | null
  xp_earned: number | null
  completed_at: string | null
}

export default function WritingCoachPage() {
  const { t } = useZkuLang()
  const [works,      setWorks]      = useState<WorkEntry[]>([])
  const [avgScore,   setAvgScore]   = useState(0)
  const [totalWorks, setTotalWorks] = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, lesson_title, score, xp_earned, completed_at')
        .eq('user_id', user.id)
        .eq('lesson_type', 'writing')
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(6)
      const rows = (data ?? []) as WorkEntry[]
      setWorks(rows)
      setTotalWorks(rows.length)
      if (rows.length > 0) {
        setAvgScore(Math.round(rows.reduce((s, r) => s + (r.score ?? 0), 0) / rows.length))
      }
    }
    load()
  }, [])

  const WRITING_TYPE_ICONS: Record<string, React.ReactElement> = {
    email:       <IcMail     size={26} color="#1B8FC4" />,
    essay:       <IcEdit     size={26} color="#534AB7" />,
    letter:      <IcMail     size={26} color="#1D9E75" />,
    story:       <IcBookOpen size={26} color="#EF9F27" />,
    review:      <IcStar     size={26} color="#D85A30" />,
    description: <IcPalette  size={26} color="#0F766E" />,
  }

  const WRITING_TYPES = [
    { id: 'email',       name: 'Email',       desc: t.writing.desc_email,       tasks_count: 24, color: '#1B8FC4', bg: '#E6F1FB' },
    { id: 'essay',       name: 'Essay',       desc: t.writing.desc_essay,       tasks_count: 18, color: '#534AB7', bg: '#EDEAFD' },
    { id: 'letter',      name: 'Letter',      desc: t.writing.desc_letter,      tasks_count: 16, color: '#1D9E75', bg: '#E8F8F3' },
    { id: 'story',       name: 'Story',       desc: t.writing.desc_story,       tasks_count: 12, color: '#EF9F27', bg: '#FEF3E0' },
    { id: 'review',      name: 'Review',      desc: t.writing.desc_review,      tasks_count: 10, color: '#D85A30', bg: '#FDEBE6' },
    { id: 'description', name: 'Description', desc: t.writing.desc_description, tasks_count: 14, color: '#0F766E', bg: '#CCFBF1' },
  ]

  const SKILLS = [
    { label: t.writing.skill_grammar,    pct: avgScore > 0 ? Math.min(100, avgScore + 5)  : 0, color: '#1B8FC4' },
    { label: t.writing.skill_vocabulary, pct: avgScore > 0 ? Math.min(100, avgScore)       : 0, color: '#534AB7' },
    { label: t.writing.skill_structure,  pct: avgScore > 0 ? Math.min(100, avgScore - 5)  : 0, color: '#1D9E75' },
    { label: t.writing.skill_coherence,  pct: avgScore > 0 ? Math.min(100, avgScore - 10) : 0, color: '#EF9F27' },
    { label: t.writing.skill_style,      pct: avgScore > 0 ? Math.min(100, avgScore - 15) : 0, color: '#D85A30' },
  ]

  const allZeroSkills = totalWorks === 0

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: NAVY, marginBottom: 6 }}>{t.writing.title}</h1>
        <p style={{ fontSize: 15, color: MUTED }}>{t.writing.subtitle}</p>
      </div>

      {/* ── Section 1: Types ── */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 16 }}>{t.writing.types_title}</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {WRITING_TYPES.map(type => (
            <div key={type.id} style={{
              background: '#fff', borderRadius: 18, padding: '22px 20px',
              border: '1px solid rgba(0,56,118,0.08)',
              display: 'flex', flexDirection: 'column', gap: 12,
              boxShadow: '0 2px 8px rgba(0,56,118,0.04)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14,
                  background: type.bg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>{WRITING_TYPE_ICONS[type.id]}</div>
                <div>
                  <h3 style={{ fontSize: 17, fontWeight: 800, color: NAVY, marginBottom: 2 }}>{type.name}</h3>
                  <p style={{ fontSize: 13, color: MUTED }}>{type.desc}</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 12, color: '#94A3B8' }}>{type.tasks_count} {t.writing.tasks}</span>
                <Link href={`/english/zku/student/writing-coach/${type.id}`} style={{
                  padding: '9px 20px', borderRadius: 10,
                  background: NAVY, color: '#fff',
                  fontWeight: 700, fontSize: 13, textDecoration: 'none',
                  boxShadow: '0 3px 10px rgba(0,56,118,0.25)',
                }}>{t.writing.start}</Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 2: My writings ── */}
      <section style={{ marginBottom: 36 }}>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 16 }}>{t.writing.my_works}</h2>
        {works.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 18, padding: '40px', textAlign: 'center', border: '1px solid rgba(0,56,118,0.08)' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><IcEdit size={32} color={NAVY} /></div>
            <p style={{ fontWeight: 700, color: NAVY, marginBottom: 6 }}>{t.writing.no_works}</p>
            <p style={{ fontSize: 13, color: MUTED }}>{t.writing.no_works_sub}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {works.map(w => {
              const typeKey = w.lesson_id.split('-')[1] ?? 'essay'
              const typeColor: Record<string, string> = { email:'#1B8FC4', essay:'#534AB7', letter:'#1D9E75', story:'#EF9F27', review:'#D85A30', description:'#0F766E' }
              const color = typeColor[typeKey] ?? NAVY
              const date  = w.completed_at ? new Date(w.completed_at).toLocaleDateString('ru-RU', { day:'numeric', month:'short' }) : ''
              return (
                <div key={w.lesson_id} style={{ background:'#fff', borderRadius:16, padding:'18px 20px', border:`1.5px solid ${color}33`, boxShadow:`0 2px 8px ${color}11` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:8 }}>
                    <span style={{ fontSize:11, fontWeight:800, color:'#fff', background:color, padding:'3px 10px', borderRadius:99, textTransform:'capitalize' }}>{typeKey}</span>
                    <span style={{ fontSize:11, color:MUTED }}>{date}</span>
                  </div>
                  <div style={{ fontSize:14, fontWeight:700, color:NAVY, marginBottom:8 }}>{w.lesson_title ?? typeKey}</div>
                  <div style={{ display:'flex', gap:12 }}>
                    <span style={{ fontSize:12, fontWeight:700, color:'#1D9E75' }}>✓ {w.score ?? 0}%</span>
                    <span style={{ fontSize:12, fontWeight:700, color:'#C9933B' }}>+{w.xp_earned ?? 0} XP</span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>

      {/* ── Section 3: Skills ── */}
      <section>
        <h2 style={{ fontSize: 16, fontWeight: 800, color: NAVY, marginBottom: 16 }}>{t.writing.skills_title}</h2>
        <div style={{ background: '#fff', borderRadius: 18, padding: '24px', border: '1px solid rgba(0,56,118,0.08)' }}>
          {allZeroSkills ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}><IcBarChart size={32} color={NAVY} /></div>
              <div style={{ fontWeight: 700, color: NAVY, marginBottom: 4 }}>{t.writing.no_skills_title}</div>
              <div style={{ fontSize: 13, color: MUTED }}>{t.writing.no_skills_sub}</div>
            </div>
          ) : (
            SKILLS.map(({ label, pct, color }) => (
              <div key={label} style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, marginBottom: 7 }}>
                  <span style={{ fontWeight: 600, color: NAVY }}>{label}</span>
                  <span style={{ fontWeight: 800, color }}>{pct}%</span>
                </div>
                <ProgressBar value={pct} color={color} />
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  )
}