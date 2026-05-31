'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from './zku-lang'

// ── Design tokens ──────────────────────────────────────────────
const N   = '#003876'
const G   = '#C9933B'
const BG  = '#F4F6FA'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface ActivityItem {
  id: string; title: string; type: string; date: string; score: number | null; xp: number
}
interface SkillScores {
  reading: number; listening: number; writing: number; speaking: number; grammar: number
}

// ── Tiny SVG icons ─────────────────────────────────────────────
function Ico({ d, size = 18 }: { d: string; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  )
}

const ICONS = {
  course:    'M4 19.5A2.5 2.5 0 016.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z',
  vocab:     'M2 3h20v14H2zM8 21h8M12 17v4M7 7h10M7 11h6',
  target:    'M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10zM12 18a6 6 0 100-12 6 6 0 000 12zM12 14a2 2 0 100-4 2 2 0 000 4z',
  writing:   'M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4z',
  arrow_r:   'M5 12h14M12 5l7 7-7 7',
  check:     'M20 6L9 17l-5-5',
  flame:     'M12 2c0 6-8 8-8 14a8 8 0 0016 0c0-3-1-6-3-8-1 3-3 4-5 2z',
  lightning: 'M13 2L3 14h9l-1 8 10-12h-9z',
  lessons:   'M12 20h9M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z',
}

export default function ZKUStudentDashboard() {
  const { t } = useZkuLang()
  const [firstName, setFirstName] = useState('')
  const [level,        setLevel]        = useState('A1')
  const [xp,           setXp]           = useState(0)
  const [streak,       setStreak]       = useState(0)
  const [lessonsDone,  setLessonsDone]  = useState(0)
  const [lessonsTotal, setLessonsTotal] = useState(0)
  const [skills,       setSkills]       = useState<SkillScores>({ reading: 0, listening: 0, writing: 0, speaking: 0, grammar: 0 })
  const [activity,     setActivity]     = useState<ActivityItem[]>([])

  useEffect(() => {
    const cached = sessionStorage.getItem('zku-display-name')
    if (cached) setFirstName(cached.split(' ')[0])

    function onUpdate(e: Event) {
      const { fullName } = (e as CustomEvent<{ fullName: string }>).detail
      if (fullName) setFirstName(fullName.split(' ')[0])
    }
    window.addEventListener('zku-profile-updated', onUpdate)
    return () => window.removeEventListener('zku-profile-updated', onUpdate)
  }, [])

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const emailSlug = user.email?.split('@')[0] ?? ''
      const meta = user.user_metadata
      const metaName: string = meta?.full_name ?? meta?.name ?? ''
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('full_name, total_xp, current_streak, current_level')
        .eq('user_id', user.id).maybeSingle()
      const dbName = profile?.full_name ?? ''
      const name = (metaName && metaName !== emailSlug) ? metaName : (dbName && dbName !== emailSlug) ? dbName : metaName || dbName || emailSlug
      setFirstName(name.split(' ')[0])
      sessionStorage.setItem('zku-display-name', name)
      setXp(profile?.total_xp ?? 0)
      setStreak(profile?.current_streak ?? 0)
      setLevel(profile?.current_level ?? 'A1')
      const { data: progress } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, completed, score, lesson_type, xp_earned, lesson_title, completed_at')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })
      type PR = { lesson_id: string; completed: boolean; score: number | null; lesson_type: string | null; xp_earned: number | null; lesson_title: string | null; completed_at: string | null }
      if (progress?.length) {
        const done = (progress as PR[]).filter(p => p.completed)
        setLessonsDone(done.length); setLessonsTotal(progress.length)
        const sm: Record<string, number[]> = { reading: [], listening: [], writing: [], speaking: [], grammar: [] }
        done.forEach((p: PR) => { const t = p.lesson_type ?? 'reading'; if (sm[t] && p.score !== null) sm[t].push(p.score) })
        const avg = (a: number[]) => a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0
        setSkills({ reading: avg(sm.reading), listening: avg(sm.listening), writing: avg(sm.writing), speaking: avg(sm.speaking), grammar: avg(sm.grammar) })
        // Recent activity from completed lessons
        const recent = done.slice(0, 4)
        if (recent.length) setActivity(recent.map((p: PR) => ({
          id: p.lesson_id,
          title: p.lesson_title ?? p.lesson_id,
          type: p.lesson_type ?? 'reading',
          date: p.completed_at ?? new Date().toISOString(),
          score: p.score,
          xp: p.xp_earned ?? 0,
        })))
      }
    }
    load()
  }, [])

  const xpPct      = Math.min(100, (xp % 3000) / 30)
  const lessonPct  = lessonsTotal > 0 ? Math.round((lessonsDone / lessonsTotal) * 100) : 0
  const allZero    = !skills.reading && !skills.listening && !skills.writing && !skills.speaking && !skills.grammar
  const noActivity = activity.length === 0

  const QUICK = [
    { href: '/english/zku/student/course',       icon: ICONS.course,    label: t.dash.reading,   sub: t.dash.all_courses },
    { href: '/english/zku/student/vocab',          icon: ICONS.vocab,     label: t.dash.vocab_btn, sub: t.dash.words_wait  },
    { href: '/english/zku/student/placement',      icon: ICONS.target,    label: t.dash.grammar,   sub: t.dash.test_level  },
    { href: '/english/zku/student/writing-coach',  icon: ICONS.writing,   label: t.dash.writing,   sub: t.dash.writing_sub },
  ]

  const SKILL_LIST: [string, number][] = [
    [t.common.skill_reading,   skills.reading],
    [t.common.skill_listening, skills.listening],
    [t.common.skill_writing,   skills.writing],
    [t.common.skill_speaking,  skills.speaking],
    [t.common.skill_grammar,   skills.grammar],
  ]

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ padding: '28px 32px 56px', maxWidth: 1100, margin: '0 auto' }}>

        {/* ── HERO ── */}
        <div style={{
          background: N, borderRadius: 20, padding: '32px 36px', marginBottom: 20,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          boxShadow: '0 4px 24px rgba(0,56,118,0.18)',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Subtle background pattern */}
          <div style={{ position: 'absolute', right: -60, top: -60, width: 280, height: 280, borderRadius: '50%', background: 'rgba(201,147,59,0.06)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', right: 200, bottom: -80, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.03)', pointerEvents: 'none' }} />

          <div>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 10 }}>
              {t.dash.cabinet} · {level}
            </div>
            <div style={{ fontSize: 30, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.1, marginBottom: 8 }}>
              {t.dash.greeting}, {firstName || '...'}
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>{t.dash.subtitle}</div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: 0, flexShrink: 0 }}>
            {[
              { v: xp.toLocaleString(), l: t.dash.xp,        icon: ICONS.lightning },
              { v: streak,              l: t.dash.streak,     icon: ICONS.flame     },
              { v: lessonsDone,         l: t.dash.lessons,    icon: ICONS.lessons   },
            ].map((s, i) => (
              <div key={s.l} style={{
                paddingLeft: i > 0 ? 32 : 0, borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.1)' : 'none',
                marginLeft: i > 0 ? 32 : 0, textAlign: 'center',
              }}>
                <div style={{ color: G, marginBottom: 6, display: 'flex', justifyContent: 'center' }}>
                  <Ico d={s.icon} size={16} />
                </div>
                <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ── ROW 2: Continue + XP Progress ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', gap: 16, marginBottom: 16 }}>

          {/* Continue learning */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '24px 28px', border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: G, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 16 }}>
              {t.dash.continue_tag}
            </div>
            <div style={{ display: 'flex', gap: 16, marginBottom: 20, alignItems: 'flex-start' }}>
              <div style={{
                width: 52, height: 52, borderRadius: 14, flexShrink: 0,
                background: N, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
              }}>
                <Ico d={ICONS.course} size={22} />
              </div>
              <div>
                <div style={{ fontSize: 17, fontWeight: 800, color: N, lineHeight: 1.2, marginBottom: 5 }}>
                  {lessonsDone > 0 ? t.dash.continue_tag : t.dash.start_first}
                </div>
                <div style={{ fontSize: 12, color: MUT }}>
                  {lessonsDone > 0 ? `${lessonsDone} / ${lessonsTotal} ${t.dash.lessons}` : t.dash.start_first_sub}
                </div>
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUT, marginBottom: 6 }}>
                <span>{t.dash.lessons}</span>
                <span style={{ fontWeight: 700, color: N }}>{lessonPct}%</span>
              </div>
              <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${lessonPct}%`, background: N, borderRadius: 99, transition: 'width 0.6s ease' }} />
              </div>
            </div>
            <Link href="/english/zku/student/course" style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
              background: N, color: '#fff', padding: '13px',
              borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: 'none',
              boxShadow: '0 4px 16px rgba(0,56,118,0.22)',
            }}>
              {lessonsDone > 0 ? t.dash.start_lesson : t.dash.go_to_courses}
              <Ico d={ICONS.arrow_r} size={14} />
            </Link>
          </div>

          {/* XP card */}
          <div style={{ background: N, borderRadius: 16, padding: '24px 22px', color: '#fff', boxShadow: '0 4px 16px rgba(0,56,118,0.18)' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 14 }}>
              {t.dash.to_level}
            </div>
            <div style={{ fontSize: 32, fontWeight: 900, color: G, lineHeight: 1 }}>{xp.toLocaleString()}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', marginBottom: 14 }}>/ 3 000 XP</div>
            <div style={{ height: 6, background: 'rgba(255,255,255,0.1)', borderRadius: 99, overflow: 'hidden', marginBottom: 6 }}>
              <div style={{ height: '100%', width: `${xpPct}%`, background: G, borderRadius: 99 }} />
            </div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{Math.max(0, 3000 - xp)} {t.dash.xp_left}</div>

            <div style={{ marginTop: 20, paddingTop: 18, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                {t.dash.streak_label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 900, color: G }}>{streak} {t.dash.days}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', marginTop: 2 }}>{t.dash.record}: {streak} {t.dash.days}</div>
            </div>
          </div>
        </div>

        {/* ── ROW 3: Quick Actions ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
          {QUICK.map(q => (
            <Link key={q.href} href={q.href} style={{
              background: '#fff', borderRadius: 16, padding: '20px 18px',
              border: `1px solid ${BDR}`, textDecoration: 'none',
              boxShadow: '0 1px 6px rgba(0,56,118,0.05)',
              display: 'flex', flexDirection: 'column', gap: 12,
              transition: 'all 0.18s',
            }}
            onMouseEnter={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = `rgba(0,56,118,0.25)`
              el.style.boxShadow = '0 6px 20px rgba(0,56,118,0.1)'
              el.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              const el = e.currentTarget as HTMLElement
              el.style.borderColor = BDR
              el.style.boxShadow = '0 1px 6px rgba(0,56,118,0.05)'
              el.style.transform = 'none'
            }}>
              <div style={{
                width: 40, height: 40, borderRadius: 11,
                background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: N,
              }}>
                <Ico d={q.icon} size={18} />
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 2 }}>{q.label}</div>
                <div style={{ fontSize: 11, color: MUT }}>{q.sub}</div>
              </div>
            </Link>
          ))}
        </div>

        {/* ── ROW 4: Skills + Activity ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Skills */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{t.dash.skills}</span>
              <Link href="/english/zku/student/progress" style={{ fontSize: 11, color: MUT, textDecoration: 'none', fontWeight: 600 }}>
                {t.dash.details}
              </Link>
            </div>

            {allZero ? (
              <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: N, marginBottom: 4 }}>{t.dash.no_skills_title}</div>
                <div style={{ fontSize: 11, color: MUT }}>{t.dash.no_skills_sub}</div>
              </div>
            ) : (
              SKILL_LIST.map(([name, pct]) => (
                <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <span style={{ fontSize: 12, fontWeight: 600, color: MUT, width: 68 }}>{name}</span>
                  <div style={{ flex: 1, height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: N, borderRadius: 99 }} />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: N, width: 34, textAlign: 'right' }}>{pct}%</span>
                </div>
              ))
            )}
          </div>

          {/* Activity */}
          <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{t.dash.activity}</span>
              <Link href="/english/zku/student/progress" style={{ fontSize: 11, color: MUT, textDecoration: 'none', fontWeight: 600 }}>
                {t.dash.see_all}
              </Link>
            </div>

            {noActivity ? (
              <div style={{ textAlign: 'center', padding: '20px 0 8px' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: N, marginBottom: 4 }}>{t.dash.no_activity_title}</div>
                <div style={{ fontSize: 11, color: MUT }}>{t.dash.no_activity_sub}</div>
              </div>
            ) : (
              activity.map((act, i) => (
                <div key={act.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0',
                  borderBottom: i < activity.length - 1 ? `1px solid ${BDR}` : 'none',
                }}>
                  <div style={{
                    width: 34, height: 34, borderRadius: 9, flexShrink: 0,
                    background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: N,
                  }}>
                    <Ico d={ICONS.course} size={14} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: '#1E293B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.title}</div>
                    <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>
                      {new Date(act.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 3 }}>
                    {act.score !== null && (
                      <span style={{ fontSize: 10, fontWeight: 700, color: N, background: '#EEF2F7', padding: '2px 7px', borderRadius: 99 }}>
                        {act.score}%
                      </span>
                    )}
                    <span style={{ fontSize: 10, fontWeight: 700, color: G, background: '#FEF6E8', padding: '2px 7px', borderRadius: 99 }}>
                      +{act.xp} XP
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  )
}