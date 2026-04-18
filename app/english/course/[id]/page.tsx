'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Course      = { id: string; title: string; level: string; category: string; description: string | null }
type Lesson      = { id: string; title: string; lesson_order: number }
type ProgressRow = { lesson_id: string; completed: boolean; score: number | null }

export default function EnglishCoursePage() {
  const { id } = useParams<{ id: string }>()
  const router  = useRouter()
  const [course,   setCourse]   = useState<Course | null>(null)
  const [lessons,  setLessons]  = useState<Lesson[]>([])
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }

      const [courseRes, lessonsRes, progRes] = await Promise.all([
        supabase.from('english_courses').select('*').eq('id', id).single(),
        supabase.from('english_lessons').select('id, title, lesson_order').eq('course_id', id).order('lesson_order'),
        supabase.from('english_progress').select('lesson_id, completed, score').eq('user_id', user.id),
      ])

      setCourse(courseRes.data as Course | null)
      setLessons((lessonsRes.data || []) as Lesson[])
      setProgress((progRes.data || []) as ProgressRow[])
      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка курса...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 16 }}>Курс не найден</div>
          <button className="btn-primary" onClick={() => router.push('/english/dashboard')}>← Назад</button>
        </div>
      </div>
    )
  }

  const progMap = new Map(progress.map(p => [p.lesson_id, p]))
  const completedCount = lessons.filter(l => progMap.get(l.id)?.completed).length
  const progressPct    = lessons.length > 0 ? Math.round((completedCount / lessons.length) * 100) : 0
  const nextLesson     = lessons.find(l => !progMap.get(l.id)?.completed) || lessons[0]

  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(14,165,233,0.1)',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1000, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            ← Мои курсы
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.04em' }}>KHAMADI ENGLISH</span>
        </div>
      </nav>

      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '36px 5%', position: 'relative', zIndex: 1 }}>

        {/* HERO CARD */}
        <div className="glass-card fade-up" style={{
          padding: '32px 36px', marginBottom: 28,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid rgba(14,165,233,0.2)',
          boxShadow: '0 20px 48px rgba(14,165,233,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <span className="badge-pill" style={{ fontSize: 12 }}>{course.level}</span>
            <span className="badge-pill" style={{ fontSize: 12, background: 'rgba(255,255,255,0.7)' }}>{course.category}</span>
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', marginBottom: 8 }}>{course.title}</h1>
          <p style={{ fontSize: 15, color: '#64748b', fontWeight: 600, marginBottom: 24 }}>{course.description}</p>

          {/* Progress bar */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>Прогресс курса</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9' }}>{completedCount} / {lessons.length} уроков · {progressPct}%</span>
            </div>
            <div className="progress-line">
              <div className="progress-fill" style={{ width: `${progressPct}%` }} />
            </div>
          </div>

          {nextLesson && (
            <button
              className="hero-primary shine-wrap"
              onClick={() => router.push(`/english/course/${course.id}/lesson/${nextLesson.id}`)}
            >
              <span className="shine-line" />
              {completedCount === 0 ? '▶ Начать курс' : '▶ Продолжить'}
            </button>
          )}
        </div>

        {/* LESSONS LIST */}
        <div className="fade-up delay-1">
          <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', marginBottom: 18 }}>
            Список уроков
          </div>

          {lessons.length === 0 ? (
            <div className="dashboard-card" style={{ padding: 48, textAlign: 'center' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
              <div style={{ fontWeight: 700, color: '#64748b' }}>Уроки не добавлены</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {lessons.map((lesson, i) => {
                const prog        = progMap.get(lesson.id)
                const isCompleted = prog?.completed ?? false
                const score       = prog?.score ?? null
                const isNext      = lesson.id === nextLesson?.id && !isCompleted
                const prevLesson  = i > 0 ? lessons[i - 1] : null
                const isLocked    = prevLesson !== null && !(progMap.get(prevLesson.id)?.completed ?? false)

                return (
                  <div
                    key={lesson.id}
                    className={`feature-card fade-up delay-${Math.min(i+1,5)}`}
                    onClick={() => !isLocked && router.push(`/english/course/${course.id}/lesson/${lesson.id}`)}
                    style={{
                      cursor: isLocked ? 'not-allowed' : 'pointer',
                      padding: '18px 22px',
                      display: 'flex', alignItems: 'center', gap: 18,
                      opacity: isLocked ? 0.55 : 1,
                      borderColor: isCompleted ? 'rgba(34,197,94,0.3)' : isNext ? 'rgba(14,165,233,0.35)' : undefined,
                      background: isCompleted
                        ? 'linear-gradient(135deg,#f0fdf4,#fff)'
                        : isLocked ? '#f8fafc'
                        : isNext ? 'linear-gradient(135deg,#f0f9ff,#fff)' : '#fff',
                    }}
                  >
                    {/* Badge */}
                    <div style={{
                      width: 46, height: 46, borderRadius: 13, flexShrink: 0,
                      background: isCompleted
                        ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
                        : isLocked ? 'rgba(148,163,184,0.12)'
                        : isNext ? 'rgba(14,165,233,0.1)' : '#f0f9ff',
                      border: isLocked ? '1px solid rgba(148,163,184,0.2)' : isNext ? '2px solid rgba(14,165,233,0.4)' : '1px solid rgba(14,165,233,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: isCompleted ? 18 : 14, fontWeight: 900,
                      color: isCompleted ? '#fff' : isLocked ? '#94a3b8' : isNext ? '#0ea5e9' : '#94a3b8',
                    }}>
                      {isCompleted ? '✓' : isLocked ? '🔒' : lesson.lesson_order}
                    </div>

                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color: isLocked ? '#94a3b8' : '#0c4a6e', marginBottom: 4 }}>{lesson.title}</div>
                      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                        {isLocked ? (
                          <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>Завершите предыдущий урок для доступа</span>
                        ) : (
                          ['📖 Reading','✍️ Writing','🎧 Listening','📝 Quiz'].map(t => (
                            <span key={t} style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{t}</span>
                          ))
                        )}
                      </div>
                    </div>

                    {/* Right */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                      {score !== null && (
                        <span className="badge-pill" style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#16a34a' }}>
                          ✓ {score}%
                        </span>
                      )}
                      {isNext && !isLocked && (
                        <span className="badge-pill" style={{ fontSize: 11, padding: '4px 10px' }}>ДАЛЕЕ</span>
                      )}
                      {isCompleted && (
                        <span className="badge-pill" style={{ fontSize: 11, padding: '4px 10px', background: 'rgba(34,197,94,0.1)', borderColor: 'rgba(34,197,94,0.25)', color: '#16a34a' }}>ГОТОВО</span>
                      )}
                      {!isLocked && (
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5"><path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
