'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'

const N   = '#003876'
const G   = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

const LEVELS = ['A1', 'A1.1', 'A2', 'B1', 'B2', 'C1']
const XP_PER_LEVEL = 3000

export default function ProgressPage() {
  const { t } = useZkuLang()
  const [xp,         setXp]        = useState(0)
  const [streak,     setStreak]    = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [level,      setLevel]     = useState('A1')
  const [lessons,    setLessons]   = useState(0)
  const [skillPcts, setSkillPcts]  = useState({ reading: 0, listening: 0, writing: 0, speaking: 0, grammar: 0 })

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('total_xp, current_streak, longest_streak, current_level')
        .eq('user_id', user.id).maybeSingle()
      if (profile) {
        setXp(profile.total_xp ?? 0)
        setStreak(profile.current_streak ?? 0)
        setBestStreak(profile.longest_streak ?? 0)
        setLevel(profile.current_level ?? 'A1')
      }
      const { data: progress } = await supabase
        .from('english_lesson_progress').select('lesson_id, lesson_type, score')
        .eq('user_id', user.id).eq('completed', true)
      setLessons(progress?.length ?? 0)
      if (progress && progress.length > 0) {
        const counts: Record<string, { sum: number; n: number }> = {}
        for (const row of progress as { lesson_type: string; score: number | null }[]) {
          const type = row.lesson_type ?? 'reading'
          if (!counts[type]) counts[type] = { sum: 0, n: 0 }
          counts[type].sum += row.score ?? 80
          counts[type].n++
        }
        const avg = (type: string) => counts[type] ? Math.round(counts[type].sum / counts[type].n) : 0
        setSkillPcts({ reading: avg('reading'), listening: avg('listening'), writing: avg('writing'), speaking: avg('speaking'), grammar: avg('grammar') })
      }
    }
    load()
  }, [])

  const levelIdx  = Math.max(0, LEVELS.indexOf(level))
  const xpInLevel = xp % XP_PER_LEVEL
  const xpPct     = Math.min(100, (xpInLevel / XP_PER_LEVEL) * 100)
  const nextLevel = LEVELS[Math.min(levelIdx + 1, LEVELS.length - 1)]
  const noData    = xp === 0 && streak === 0 && lessons === 0

  const STATS = [
    { label: t.progress.xp_total,    value: xp.toLocaleString(), color: G },
    { label: t.progress.streak_days, value: streak,               color: N },
    { label: t.progress.best_streak, value: bestStreak,           color: N },
    { label: t.progress.lessons_done,value: lessons,              color: N },
  ]

  const SKILLS = [
    [t.common.skill_reading,   skillPcts.reading],
    [t.common.skill_listening, skillPcts.listening],
    [t.common.skill_writing,   skillPcts.writing],
    [t.common.skill_speaking,  skillPcts.speaking],
    [t.common.skill_grammar,   skillPcts.grammar],
  ] as [string, number][]

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
    <div style={{ padding: '28px 32px 56px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 5 }}>{t.progress.title}</h1>
        <p style={{ fontSize: 13, color: MUT }}>{t.progress.subtitle}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
        {STATS.map(s => (
          <div key={s.label} style={{
            background: '#fff', borderRadius: 14, padding: '18px 16px', textAlign: 'center',
            border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.05)',
          }}>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 11, color: MUT, marginTop: 6, fontWeight: 600 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {noData ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>{t.progress.no_data}</div>
          <div style={{ fontSize: 13, color: MUT, marginBottom: 24 }}>{t.progress.no_data_sub}</div>
          <Link href="/english/zku/student/course" style={{
            display: 'inline-block', background: N, color: '#fff',
            padding: '12px 28px', borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(0,56,118,0.22)',
          }}>{t.course.start_btn}</Link>
        </div>
      ) : (
        <>
          {/* Level path */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: `1px solid ${BDR}`, marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{t.progress.overall}</span>
              <span style={{ fontSize: 12, fontWeight: 700, color: G }}>{level}</span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
              {LEVELS.map((lv, i) => {
                const done = i < levelIdx
                const curr = i === levelIdx
                return (
                  <div key={lv} style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                      <div style={{
                        width: curr ? 34 : 26, height: curr ? 34 : 26, borderRadius: '50%',
                        background: done ? N : curr ? G : '#E2E8F0',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: '#fff', fontSize: curr ? 11 : 9, fontWeight: 800,
                        boxShadow: curr ? `0 3px 10px ${G}55` : 'none',
                        transition: 'all 0.3s',
                      }}>
                        {done ? '✓' : lv}
                      </div>
                      <div style={{ fontSize: 9, color: curr ? N : '#94A3B8', fontWeight: curr ? 700 : 400, marginTop: 4, whiteSpace: 'nowrap' }}>{lv}</div>
                    </div>
                    {i < LEVELS.length - 1 && (
                      <div style={{ flex: 1, height: 2, background: done ? N : '#E2E8F0', margin: '0 4px', marginBottom: 18 }} />
                    )}
                  </div>
                )
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUT, marginBottom: 6 }}>
              <span>{t.progress.current_level}: {level}</span>
              <span style={{ fontWeight: 700, color: N }}>{xpPct.toFixed(0)}%</span>
            </div>
            <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: `${xpPct}%`, background: N, borderRadius: 99, transition: 'width 0.6s ease' }} />
            </div>
            <div style={{ fontSize: 11, color: MUT }}>
              {xpInLevel.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP · {t.progress.next_level}: {nextLevel}
            </div>
          </div>

          {/* Skills */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '22px 28px', border: `1px solid ${BDR}` }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 18 }}>{t.progress.skills_title}</div>
            {SKILLS.map(([name, pct]) => (
              <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: MUT, width: 72 }}>{name}</span>
                <div style={{ flex: 1, height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: N, borderRadius: 99 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: pct > 0 ? N : '#CBD5E1', width: 36, textAlign: 'right' }}>{pct}%</span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
    </div>
  )
}