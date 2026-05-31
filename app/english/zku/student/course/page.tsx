'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import { IcLock, IcBook, IcClock, IcEdit, IcTarget } from '../_icons'

const N   = '#003876'
const G   = '#C9933B'
const BG  = '#F4F6FA'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

// Map lesson number prefix to level
function lessonNumToLevel(lessonId: string): string {
  const n = parseInt(lessonId.replace(/^l/, '').split('-')[0])
  if (n <= 16) return 'A1'
  if (n <= 34) return 'A1.1'
  if (n <= 58) return 'A2'
  if (n <= 84) return 'B1'
  return 'B2'
}

const LEVEL_TOTALS: Record<string, number> = {
  'A1': 80, 'A1.1': 128, 'A2': 168, 'B1': 208, 'B2': 228, 'C1': 282,
}

interface Level {
  code: string; slug: string; badge: string
  title: string; topics: string[]
  color: string; colorLight: string; colorBorder: string
  totalModules: number; total_lessons: number; total_hours: number; total_words: number
  isLocked: boolean; progress: number; modulesCompleted: number
}

export default function CoursePage() {
  const { t } = useZkuLang()
  const [levelProgress, setLevelProgress] = useState<Record<string, number>>({})
  const [totalDone, setTotalDone]         = useState(0)
  const [currentLevel, setCurrentLevel]   = useState('A1')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return

      const [{ data: profile }, { data: progress }] = await Promise.all([
        supabase.from('english_user_profiles').select('current_level').eq('user_id', user.id).maybeSingle(),
        supabase.from('english_lesson_progress').select('lesson_id').eq('user_id', user.id).eq('completed', true),
      ])

      if (profile?.current_level) setCurrentLevel(profile.current_level)

      if (progress?.length) {
        setTotalDone(progress.length)
        const counts: Record<string, number> = {}
        for (const row of progress as { lesson_id: string }[]) {
          const lv = lessonNumToLevel(row.lesson_id)
          counts[lv] = (counts[lv] ?? 0) + 1
        }
        const pcts: Record<string, number> = {}
        for (const [lv, cnt] of Object.entries(counts)) {
          pcts[lv] = Math.min(100, Math.round((cnt / (LEVEL_TOTALS[lv] ?? 80)) * 100))
        }
        setLevelProgress(pcts)
      }
    }
    load()
  }, [])

  const LEVEL_ORDER = ['A1', 'A1.1', 'A2', 'B1', 'B2', 'C1']
  const currentIdx  = LEVEL_ORDER.indexOf(currentLevel)

  const LEVELS: Level[] = [
    {
      code: 'A1',  slug: 'a1',  badge: 'A1 BEGINNER',
      title: t.course.title_a1,
      topics: ['am / is / are', 'Present Simple', 'Basic questions', 'Numbers & greetings'],
      color: N, colorLight: '#EEF2F7', colorBorder: 'rgba(0,56,118,0.2)',
      totalModules: 16, total_lessons: 80,  total_hours: 120, total_words: 800,
      isLocked: currentLevel !== 'A1',
      progress: levelProgress['A1'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['A1'] ?? 0) / 100) * 16),
    },
    {
      code: 'A1.1', slug: 'a11', badge: 'A1.1 ELEMENTARY',
      title: t.course.title_a11,
      topics: ['can/could', 'used to', 'Present Perfect', 'Conditionals'],
      color: '#16A34A', colorLight: '#DCFCE7', colorBorder: '#86EFAC',
      totalModules: 18, total_lessons: 128, total_hours: 130, total_words: 900,
      isLocked: currentLevel !== 'A1.1',
      progress: levelProgress['A1.1'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['A1.1'] ?? 0) / 100) * 18),
    },
    {
      code: 'A2',  slug: 'a2',  badge: 'A2 PRE-INTER',
      title: t.course.title_a2,
      topics: ['Past Continuous', 'Future: will / going to', 'Conditionals', 'Comparatives'],
      color: '#1B8FC4', colorLight: '#DBEAFE', colorBorder: '#93C5FD',
      totalModules: 24, total_lessons: 168, total_hours: 220, total_words: 1500,
      isLocked: currentLevel !== 'A2',
      progress: levelProgress['A2'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['A2'] ?? 0) / 100) * 24),
    },
    {
      code: 'B1',  slug: 'b1',  badge: 'B1 INTERMEDIATE',
      title: t.course.title_b1,
      topics: ['Conditionals all types', 'Reported Speech', 'Passive Voice advanced', 'Modal verbs advanced'],
      color: '#7C3AED', colorLight: '#EDE9FE', colorBorder: '#C4B5FD',
      totalModules: 26, total_lessons: 208, total_hours: 260, total_words: 1820,
      isLocked: currentLevel !== 'B1',
      progress: levelProgress['B1'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['B1'] ?? 0) / 100) * 26),
    },
    {
      code: 'B2',  slug: 'b2',  badge: 'B2 UPPER-INTER',
      title: t.course.title_b2,
      topics: ['Mixed Conditionals', 'Advanced Modals', 'Inversion & Cleft', 'IELTS 6.0–7.0'],
      color: '#DB2777', colorLight: '#FCE7F3', colorBorder: '#F9A8D4',
      totalModules: 26, total_lessons: 228, total_hours: 260, total_words: 2000,
      isLocked: currentLevel !== 'B2',
      progress: levelProgress['B2'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['B2'] ?? 0) / 100) * 26),
    },
    {
      code: 'C1',  slug: 'c1',  badge: 'C1 ADVANCED',
      title: t.course.title_c1,
      topics: ['Subjunctive & Inversion', 'Academic Discourse', 'Ellipsis & Cohesion', 'IELTS 7.0+'],
      color: '#D97706', colorLight: '#FEF3C7', colorBorder: '#FCD34D',
      totalModules: 32, total_lessons: 282, total_hours: 370, total_words: 2800,
      isLocked: currentLevel !== 'C1',
      progress: levelProgress['C1'] ?? 0,
      modulesCompleted: Math.floor(((levelProgress['C1'] ?? 0) / 100) * 32),
    },
  ]

  return (
    <div style={{ minHeight: '100vh', background: BG, fontFamily: "'Montserrat', sans-serif" }}>
    <div style={{ padding: '28px 32px 56px', maxWidth: 1160, margin: '0 auto' }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: MUT, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
          {t.course.platform}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, letterSpacing: '-0.02em', marginBottom: 6 }}>
          {t.course.title}
        </h1>
        <p style={{ fontSize: 13, color: MUT }}>{t.course.subtitle}</p>
      </div>

      {/* Overall progress strip */}
      <div style={{
        background: '#fff', borderRadius: 16, padding: '18px 24px', marginBottom: 28,
        border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)',
        display: 'flex', alignItems: 'center', gap: 20,
      }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 8 }}>
            <span style={{ fontWeight: 700, color: N }}>{t.course.overall}</span>
            <span style={{ fontWeight: 600, color: MUT }}>A1 · 0%</span>
          </div>
          <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden', position: 'relative' }}>
            {LEVELS.map((lv, i) => (
              <div key={lv.code} style={{
                position: 'absolute', top: 0, left: `${(i / LEVELS.length) * 100}%`,
                width: `${100 / LEVELS.length}%`, height: '100%',
                background: lv.progress > 0 ? lv.color : 'transparent',
                opacity: lv.progress / 100,
                borderRadius: 99,
              }} />
            ))}
          </div>
          <div style={{ display: 'flex', marginTop: 5 }}>
            {LEVELS.map(lv => (
              <div key={lv.code} style={{ flex: 1, fontSize: 9, color: '#94A3B8', textAlign: 'center', fontWeight: 600 }}>
                {lv.code}
              </div>
            ))}
          </div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: G, lineHeight: 1 }}>{currentLevel}</div>
          <div style={{ fontSize: 10, color: MUT, marginTop: 3 }}>Текущий уровень</div>
        </div>
        <div style={{ textAlign: 'center', flexShrink: 0 }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: N, lineHeight: 1 }}>{totalDone}</div>
          <div style={{ fontSize: 10, color: MUT, marginTop: 3 }}>{t.course.lessons_done}</div>
        </div>
      </div>

      {/* Level cards grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
        gap: 16,
      }}>
        {LEVELS.map(lv => {
          const locked = lv.isLocked
          const active = !locked && lv.progress > 0
          const pct    = lv.progress

          return (
            <div key={lv.code} style={{
              background: '#fff',
              borderRadius: 20,
              border: `1.5px solid ${!locked ? lv.colorBorder : 'rgba(0,56,118,0.06)'}`,
              boxShadow: !locked
                ? `0 4px 20px ${lv.color}18`
                : '0 1px 4px rgba(0,56,118,0.04)',
              overflow: 'hidden',
              position: 'relative',
              transition: 'transform 0.15s, box-shadow 0.15s',
              opacity: locked ? 0.62 : 1,
            }}
            onMouseEnter={e => {
              if (!locked) {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'
                ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 28px ${lv.color}28`
              }
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLDivElement).style.boxShadow = !locked
                ? `0 4px 20px ${lv.color}18`
                : '0 1px 4px rgba(0,56,118,0.04)'
            }}>

              {/* Top color stripe */}
              <div style={{ height: 4, background: locked ? '#E2E8F0' : lv.color }} />

              {/* Card body */}
              <div style={{ padding: '20px 22px 18px' }}>

                {/* Badge + lock row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <span style={{
                    display: 'inline-block',
                    background: locked ? '#F1F5F9' : lv.color,
                    color: locked ? '#94A3B8' : '#fff',
                    fontSize: 10, fontWeight: 800,
                    letterSpacing: '0.06em',
                    padding: '5px 12px', borderRadius: 99,
                  }}>
                    {lv.badge}
                  </span>

                  {locked && (
                    <span style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      width: 28, height: 28, borderRadius: '50%',
                      background: '#F1F5F9',
                    }}>
                      <IcLock size={14} color="#94A3B8" />
                    </span>
                  )}

                  {pct === 100 && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: '#10B981', background: '#ECFDF5', padding: '4px 10px', borderRadius: 99 }}>
                      {t.course.passed}
                    </span>
                  )}
                  {pct > 0 && pct < 100 && (
                    <span style={{ fontSize: 10, fontWeight: 700, color: G, background: '#FEF6E8', padding: '4px 10px', borderRadius: 99 }}>
                      {t.course.in_progress}
                    </span>
                  )}
                </div>

                {/* Title */}
                <div style={{
                  fontSize: 18, fontWeight: 900,
                  color: locked ? '#94A3B8' : N,
                  marginBottom: 6, letterSpacing: '-0.01em', lineHeight: 1.2,
                }}>
                  {lv.title}
                </div>

                {/* Topics */}
                <div style={{ fontSize: 12, color: MUT, lineHeight: 1.5, marginBottom: 16 }}>
                  {lv.topics.join(' · ')}
                </div>

                {/* Stats row */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '6px 0', marginBottom: active ? 14 : 0,
                }}>
                  {[
                    { icon: <IcBook    size={12} color={locked ? '#CBD5E1' : lv.color} />, val: lv.total_lessons, label: t.course.lessons },
                    { icon: <IcEdit    size={12} color={locked ? '#CBD5E1' : lv.color} />, val: lv.total_words,   label: t.course.words },
                    { icon: <IcClock   size={12} color={locked ? '#CBD5E1' : lv.color} />, val: lv.total_hours,   label: t.course.hours },
                    { icon: <IcTarget  size={12} color={locked ? '#CBD5E1' : lv.color} />, val: lv.totalModules,  label: t.course.modules },
                  ].map(s => (
                    <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: locked ? '#CBD5E1' : '#64748B' }}>
                      {s.icon}
                      <span style={{ fontWeight: 700, color: locked ? '#CBD5E1' : N }}>{s.val}</span>
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>

                {/* Progress bar — only for active */}
                {active && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ height: 6, background: lv.colorLight, borderRadius: 99, overflow: 'hidden', marginBottom: 5 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: lv.color, borderRadius: 99, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: MUT }}>
                      <span>{lv.modulesCompleted} / {lv.total_lessons} {t.course.lessons}</span>
                      <span style={{ fontWeight: 700, color: lv.color }}>{pct}%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer CTA */}
              <div style={{ padding: '0 22px 18px' }}>
                {locked ? (
                  <div style={{
                    textAlign: 'center', fontSize: 11, fontWeight: 600, color: '#94A3B8',
                    background: '#F8FAFC', borderRadius: 10, padding: '8px',
                    border: '1px solid #F1F5F9',
                  }}>
                    {t.course.locked}
                  </div>
                ) : (
                  <Link href={`/english/zku/student/course/${lv.slug}`} style={{
                    display: 'block', textAlign: 'center',
                    background: lv.color,
                    color: '#fff',
                    padding: '11px', borderRadius: 12,
                    fontSize: 13, fontWeight: 700, textDecoration: 'none',
                    boxShadow: `0 4px 14px ${lv.color}44`,
                    letterSpacing: '0.01em',
                  }}>
                    {pct > 0 ? t.course.continue_btn : t.course.start_btn}
                  </Link>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
    </div>
  )
}