'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type CourseProgress = {
  id: string
  title: string
  level: string
  total: number
  completed: number
  avg_score: number
}

type LessonHistory = {
  lesson_id: string
  lesson_title: string
  course_title: string
  completed: boolean
  score: number | null
  completed_at: string | null
}

type WeekActivity = {
  day: string
  short: string
  minutes: number
}

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

function getLast7Days(): WeekActivity[] {
  const days: WeekActivity[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    days.push({
      day: d.toISOString().slice(0, 10),
      short: DAY_LABELS[d.getDay() === 0 ? 6 : d.getDay() - 1],
      minutes: 0,
    })
  }
  return days
}

export default function ProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [userName, setUserName] = useState('')
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [courseProgress, setCourseProgress] = useState<CourseProgress[]>([])
  const [history, setHistory] = useState<LessonHistory[]>([])
  const [weekActivity, setWeekActivity] = useState<WeekActivity[]>(getLast7Days())
  const [rankPercentile, setRankPercentile] = useState(0)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/english/login'); return }

      const userId = session.user.id

      const [roleRes, coursesRes, progressRes, sessionsRes, lessonsRes] = await Promise.all([
        supabase.from('english_user_roles').select('full_name').eq('user_id', userId).maybeSingle(),
        supabase.from('english_courses').select('id, title, level').eq('is_active', true),
        supabase.from('english_progress').select('lesson_id, completed, score, completed_at').eq('user_id', userId),
        supabase.from('english_study_sessions').select('started_at, duration_minutes').eq('user_id', userId),
        supabase.from('english_lessons').select('id, title, course_id'),
      ])

      const roleData = roleRes.data as { full_name: string | null } | null
      setUserName(roleData?.full_name || 'Студент')

      const allCourses = (coursesRes.data || []) as { id: string; title: string; level: string }[]
      const allProgress = (progressRes.data || []) as { lesson_id: string; completed: boolean; score: number | null; completed_at: string | null }[]
      const allSessions = (sessionsRes.data || []) as { started_at: string; duration_minutes: number | null }[]
      const allLessons = (lessonsRes.data || []) as { id: string; title: string; course_id: string }[]

      // Total minutes
      const totalMins = allSessions.reduce((a, s) => a + (s.duration_minutes || 0), 0)
      setTotalMinutes(totalMins)

      // Week activity
      const weekDays = getLast7Days()
      allSessions.forEach(s => {
        const day = s.started_at?.slice(0, 10)
        const found = weekDays.find(w => w.day === day)
        if (found) found.minutes += s.duration_minutes || 0
      })
      setWeekActivity([...weekDays])

      // Course progress
      const courseMap = new Map(allCourses.map(c => [c.id, c]))
      const lessonMap = new Map(allLessons.map(l => [l.id, l]))

      const progressByCourse: Record<string, { total: number; completed: number; scores: number[] }> = {}

      allLessons.forEach(l => {
        if (!progressByCourse[l.course_id]) progressByCourse[l.course_id] = { total: 0, completed: 0, scores: [] }
        progressByCourse[l.course_id].total++
      })

      allProgress.forEach(p => {
        const lesson = lessonMap.get(p.lesson_id)
        if (!lesson) return
        const cid = lesson.course_id
        if (!progressByCourse[cid]) progressByCourse[cid] = { total: 0, completed: 0, scores: [] }
        if (p.completed) progressByCourse[cid].completed++
        if (p.score !== null) progressByCourse[cid].scores.push(p.score)
      })

      const cpRows: CourseProgress[] = allCourses.map(c => {
        const cp = progressByCourse[c.id] || { total: 0, completed: 0, scores: [] }
        return {
          id: c.id,
          title: c.title,
          level: c.level,
          total: cp.total,
          completed: cp.completed,
          avg_score: cp.scores.length ? Math.round(cp.scores.reduce((a, b) => a + b, 0) / cp.scores.length) : 0,
        }
      }).filter(c => c.total > 0)

      setCourseProgress(cpRows)

      // Lesson history
      const historyRows: LessonHistory[] = allProgress
        .filter(p => p.completed)
        .sort((a, b) => (b.completed_at || '').localeCompare(a.completed_at || ''))
        .slice(0, 20)
        .map(p => {
          const lesson = lessonMap.get(p.lesson_id)
          const course = lesson ? courseMap.get(lesson.course_id) : null
          return {
            lesson_id: p.lesson_id,
            lesson_title: lesson?.title || 'Урок',
            course_title: course?.title || '',
            completed: p.completed,
            score: p.score,
            completed_at: p.completed_at,
          }
        })

      setHistory(historyRows)

      // Anonymous rank (simulate)
      const myCompleted = allProgress.filter(p => p.completed).length
      setRankPercentile(Math.min(99, Math.round((myCompleted / 20) * 100)))
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const maxWeekMin = Math.max(...weekActivity.map(d => d.minutes), 1)
  const totalHours = Math.floor(totalMinutes / 60)
  const totalMinsRem = totalMinutes % 60
  const overallProgress = courseProgress.length
    ? Math.round(courseProgress.reduce((a, c) => a + (c.total > 0 ? (c.completed / c.total) * 100 : 0), 0) / courseProgress.length)
    : 0

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-main, Montserrat, sans-serif)', color: '#64748b' }}>
        Загружаем прогресс...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main, Montserrat, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22 }}
          >←</button>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>📊 Мой прогресс</span>
          <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 14, fontWeight: 600 }}>{userName}</span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
          <SummaryCard icon="⏱️" label="Часов обучения" value={`${totalHours}ч ${totalMinsRem}м`} color="#0ea5e9" />
          <SummaryCard icon="📈" label="Общий прогресс" value={`${overallProgress}%`} color="#10b981" />
          <SummaryCard icon="✅" label="Уроков завершено" value={history.length} color="#8b5cf6" />
          <SummaryCard icon="🥇" label="Вы лучше чем" value={`${rankPercentile}%`} color="#f59e0b" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
          {/* Weekly chart */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 20 }}>
              📅 Активность за неделю
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 120 }}>
              {weekActivity.map((day) => {
                const heightPct = (day.minutes / maxWeekMin) * 100
                return (
                  <div key={day.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                    <div
                      title={`${day.minutes} мин`}
                      style={{
                        width: '100%',
                        height: `${Math.max(heightPct, 4)}%`,
                        background: day.minutes > 0
                          ? 'linear-gradient(180deg,#38bdf8,#0ea5e9)'
                          : '#f1f5f9',
                        borderRadius: '6px 6px 0 0',
                        transition: 'height 0.4s',
                        minHeight: 4,
                      }}
                    />
                    <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{day.short}</span>
                  </div>
                )
              })}
            </div>
            <div style={{ marginTop: 12, fontSize: 12, color: '#94a3b8', textAlign: 'center' }}>
              Последние 7 дней · минут обучения
            </div>
          </div>

          {/* Anonymous comparison */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
            <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 16 }}>
              👥 Сравнение со студентами
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Ваш прогресс среди всех студентов</div>
              <div style={{ position: 'relative', height: 12, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#38bdf8,#0ea5e9)', width: `${rankPercentile}%`, transition: 'width 0.6s' }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                <span>0%</span>
                <span style={{ color: '#0ea5e9', fontWeight: 700 }}>Вы: {rankPercentile}%</span>
                <span>100%</span>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Среднее по платформе', value: 42, color: '#94a3b8' },
                { label: 'Вы', value: overallProgress, color: '#0ea5e9' },
                { label: 'Топ 10%', value: 85, color: '#10b981' },
              ].map(row => (
                <div key={row.label}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 600, color: row.color, marginBottom: 4 }}>
                    <span>{row.label}</span>
                    <span>{row.value}%</span>
                  </div>
                  <div style={{ height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                    <div style={{ height: '100%', background: row.color, width: `${row.value}%`, opacity: row.color === '#94a3b8' ? 0.4 : 1 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Course progress */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', marginBottom: 20 }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 16 }}>
            📚 Прогресс по курсам
          </div>
          {courseProgress.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: 24 }}>Начните проходить уроки!</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {courseProgress.map((c) => {
                const pct = c.total > 0 ? Math.round((c.completed / c.total) * 100) : 0
                return (
                  <div key={c.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div>
                        <span style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{c.title}</span>
                        <span style={{ marginLeft: 8, fontSize: 12, color: '#94a3b8' }}>{c.level}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 12, color: '#64748b' }}>{c.completed}/{c.total} уроков</span>
                        {c.avg_score > 0 && (
                          <span style={{ fontSize: 12, fontWeight: 700, color: c.avg_score >= 70 ? '#10b981' : '#f59e0b' }}>
                            Ср. балл: {c.avg_score}%
                          </span>
                        )}
                        <span style={{ fontWeight: 800, fontSize: 14, color: '#0ea5e9', minWidth: 36, textAlign: 'right' }}>{pct}%</span>
                      </div>
                    </div>
                    <div style={{ height: 8, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden' }}>
                      <div style={{
                        height: '100%',
                        background: pct === 100 ? '#10b981' : 'linear-gradient(90deg,#38bdf8,#0ea5e9)',
                        width: `${pct}%`,
                        transition: 'width 0.5s',
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Lesson history */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 16 }}>
            📋 История уроков
          </div>
          {history.length === 0 ? (
            <div style={{ color: '#94a3b8', textAlign: 'center', padding: 24 }}>Вы ещё не завершили ни одного урока</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {history.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: '#f8fafc', borderRadius: 12 }}>
                  <span style={{ fontSize: 18 }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{h.lesson_title}</div>
                    <div style={{ fontSize: 12, color: '#64748b' }}>{h.course_title}</div>
                  </div>
                  {h.score !== null && (
                    <span style={{ fontWeight: 700, fontSize: 14, color: h.score >= 70 ? '#10b981' : '#f59e0b' }}>
                      {h.score}%
                    </span>
                  )}
                  {h.completed_at && (
                    <span style={{ fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                      {new Date(h.completed_at).toLocaleDateString('ru-RU', { day: '2-digit', month: '2-digit' })}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function SummaryCard({ icon, label, value, color }: { icon: string; label: string; value: string | number; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `3px solid ${color}` }}>
      <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 22, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 12, color: '#64748b', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  )
}
