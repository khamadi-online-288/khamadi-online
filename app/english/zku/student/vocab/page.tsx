'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import { IcBook, IcAward } from '../_icons'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'

interface VocabLesson {
  lesson_id: string
  lesson_title: string | null
  score: number | null
  xp_earned: number | null
  completed_at: string | null
}

function lessonIdToLevel(id: string): string {
  const n = parseInt(id.replace(/^l/, '').split('-')[0])
  if (n <= 16)  return 'A1'
  if (n <= 34)  return 'A1.1'
  if (n <= 58)  return 'A2'
  if (n <= 84)  return 'B1'
  return 'B2+'
}

const LEVEL_COLOR: Record<string, string> = {
  'A1': N, 'A1.1': '#16A34A', 'A2': '#1B8FC4', 'B1': '#7C3AED', 'B2+': '#DB2777',
}

export default function VocabPage() {
  const { t } = useZkuLang()
  const [lessons,  setLessons]  = useState<VocabLesson[]>([])
  const [loading,  setLoading]  = useState(true)
  const [totalXp,  setTotalXp]  = useState(0)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoading(false); return }

      const { data } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, lesson_title, score, xp_earned, completed_at')
        .eq('user_id', user.id)
        .eq('lesson_type', 'vocabulary')
        .eq('completed', true)
        .order('completed_at', { ascending: false })

      const rows = (data ?? []) as VocabLesson[]
      setLessons(rows)
      setTotalXp(rows.reduce((s, r) => s + (r.xp_earned ?? 0), 0))
      setLoading(false)
    }
    load()
  }, [])

  const totalLessons = lessons.length
  const avgScore     = totalLessons > 0
    ? Math.round(lessons.reduce((s, l) => s + (l.score ?? 0), 0) / totalLessons)
    : 0

  return (
    <div style={{ padding: '28px 32px', maxWidth: 960, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 4 }}>{t.vocab.title}</h1>
        <p style={{ fontSize: 14, color: MUT }}>{t.vocab.subtitle}</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {[
          { v: totalLessons,        l: t.vocab_page.title_lessons,    color: N,    bg: '#EEF2F7' },
          { v: totalLessons * 30,   l: t.vocab.total,     color: '#1B8FC4', bg: '#DBEAFE' },
          { v: totalXp,             l: t.common.xp,       color: G,    bg: '#FEF3C7' },
          { v: avgScore ? `${avgScore}%` : '—', l: t.vocab_page.avg_score, color: T, bg: '#DCFCE7' },
        ].map(s => (
          <div key={s.l} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: '1px solid rgba(0,0,0,0.06)', boxShadow: '0 1px 6px rgba(0,56,118,0.05)' }}>
            <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
            <div style={{ fontSize: 12, color: MUT, marginTop: 4 }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: '#94A3B8', fontWeight: 600 }}>{t.common.loading}</div>
      ) : lessons.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: '1px solid rgba(0,56,118,0.08)' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><IcBook size={44} color={N} /></div>
          <div style={{ fontSize: 18, fontWeight: 800, color: N, marginBottom: 8 }}>{t.vocab_page.empty_title}</div>
          <div style={{ fontSize: 14, color: MUT, marginBottom: 28 }}>{t.vocab_page.empty_sub}</div>
          <Link href="/english/zku/student/course" style={{
            display: 'inline-block', padding: '12px 28px', borderRadius: 12,
            background: N, color: '#fff', fontWeight: 700, fontSize: 14,
            textDecoration: 'none', boxShadow: '0 4px 14px rgba(0,56,118,0.28)',
          }}>
            {t.vocab_page.go_courses}
          </Link>
        </div>
      ) : (
        <div>
          <h2 style={{ fontSize: 14, fontWeight: 800, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
            {t.vocab_page.completed_lessons}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {lessons.map(lesson => {
              const level = lessonIdToLevel(lesson.lesson_id)
              const color = LEVEL_COLOR[level] ?? N
              const date  = lesson.completed_at
                ? new Date(lesson.completed_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                : ''
              return (
                <Link
                  key={lesson.lesson_id}
                  href={`/english/zku/student/vocab/lesson/${lesson.lesson_id}`}
                  style={{ textDecoration: 'none' }}
                >
                  <div style={{
                    background: '#fff', borderRadius: 16, padding: '18px 20px',
                    border: `1.5px solid ${color}33`,
                    boxShadow: `0 2px 8px ${color}11`,
                    transition: 'transform 0.15s, box-shadow 0.15s',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 20px ${color}22` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = `0 2px 8px ${color}11` }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                      <span style={{ fontSize: 11, fontWeight: 800, color: '#fff', background: color, padding: '3px 10px', borderRadius: 99 }}>{level}</span>
                      <span style={{ fontSize: 11, color: MUT }}>{date}</span>
                    </div>
                    <div style={{ fontSize: 15, fontWeight: 800, color: N, marginBottom: 6 }}>
                      {lesson.lesson_title ?? lesson.lesson_id}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <span style={{ fontSize: 12, color: T, fontWeight: 700 }}>
                        ✓ {lesson.score ?? 0}%
                      </span>
                      <span style={{ fontSize: 12, color: G, fontWeight: 700 }}>
                        +{lesson.xp_earned ?? 30} XP
                      </span>
                      <span style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, marginLeft: 'auto' }}>
                        {t.vocab_page.repeat_btn}
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
