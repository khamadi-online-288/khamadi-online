'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Headphones, AlignLeft, CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'

type Course  = { id: string; title: string; level: string; category: string; description: string | null }
type Module  = { id: string; title: string; order_index: number }
type Lesson  = { id: string; title: string; order_index: number; lesson_type: string; module_id: string | null }
type ProgRow = { lesson_id: string; completed: boolean }

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  grammar:    { label: 'Grammar',    icon: <AlignLeft  size={14} />, color: '#1B8FC4' },
  vocabulary: { label: 'Vocabulary', icon: <BookOpen   size={14} />, color: '#10b981' },
  listening:  { label: 'Listening',  icon: <Headphones size={14} />, color: '#8b5cf6' },
}

export default function CoursePage() {
  const { courseId } = useParams<{ courseId: string }>()
  const router = useRouter()

  const [course,   setCourse]   = useState<Course | null>(null)
  const [modules,  setModules]  = useState<Module[]>([])
  const [lessons,  setLessons]  = useState<Lesson[]>([])
  const [progress, setProgress] = useState<Map<string, boolean>>(new Map())
  const [loading,  setLoading]  = useState(true)
  const [open,     setOpen]     = useState<Set<string>>(new Set())

  useEffect(() => {
    load()
  }, [courseId])

  async function load() {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
    if (!user) { router.push('/english/login'); return }

    const [courseRes, modulesRes, lessonsRes, progRes] = await Promise.all([
      supabase.from('english_courses').select('id,title,level,category,description').eq('id', courseId).single(),
      supabase.from('english_modules').select('id,title,order_index').eq('course_id', courseId).order('order_index'),
      supabase.from('english_lessons').select('id,title,order_index,lesson_type,module_id').eq('course_id', courseId).order('order_index'),
      supabase.from('english_progress').select('lesson_id,completed').eq('user_id', user.id),
    ])

    setCourse(courseRes.data as Course | null)
    setModules((modulesRes.data ?? []) as Module[])
    setLessons((lessonsRes.data ?? []) as Lesson[])

    const map = new Map<string, boolean>()
    for (const p of (progRes.data ?? []) as ProgRow[]) {
      map.set(p.lesson_id, p.completed)
    }
    setProgress(map)

    // Open first incomplete module by default
    if (modulesRes.data?.length) {
      const firstMod = modulesRes.data[0] as Module
      setOpen(new Set([firstMod.id]))
    }

    setLoading(false)
  }

  function toggle(id: string) {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', border: '3px solid #e2e8f0', borderTopColor: '#1B8FC4', animation: 'spin 0.8s linear infinite', margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка курса...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  if (!course) return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
      <div style={{ fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>Курс не найден</div>
      <button onClick={() => router.push('/english/dashboard/courses')} style={{ padding: '10px 20px', borderRadius: 12, background: '#1B8FC4', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>← Курсы</button>
    </div>
  )

  const allLessons     = lessons
  const completedCount = allLessons.filter(l => progress.get(l.id)).length
  const totalCount     = allLessons.length
  const pct            = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, maxWidth: 800 }}>

      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{ borderRadius: 26, padding: '32px 36px', background: 'linear-gradient(135deg, #1B3A6B 0%, #2E5FA3 55%, #1B8FC4 100%)', color: '#fff', boxShadow: '0 20px 48px rgba(27,59,107,0.22)', position: 'relative', overflow: 'hidden' }}
      >
        <div style={{ position: 'absolute', top: -40, right: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.05)', pointerEvents: 'none' }} />

        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
          <span style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.15)', fontSize: 12, fontWeight: 800 }}>{course.level}</span>
          <span style={{ padding: '4px 12px', borderRadius: 99, background: 'rgba(255,255,255,0.10)', fontSize: 12, fontWeight: 700 }}>{course.category}</span>
        </div>

        <h1 style={{ fontSize: 28, fontWeight: 900, letterSpacing: '-0.03em', margin: '0 0 8px' }}>{course.title}</h1>
        {course.description && (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.70)', margin: '0 0 24px', lineHeight: 1.65 }}>{course.description}</p>
        )}

        {/* Progress */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.60)' }}>Прогресс курса</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>{completedCount} / {totalCount} уроков · {pct}%</span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #38bdf8, #fff)' }} />
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: 'Модулей',  value: modules.length },
            { label: 'Уроков',   value: totalCount },
            { label: 'Пройдено', value: completedCount },
          ].map((s, i) => (
            <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
              {i > 0 && <div style={{ width: 1, height: 28, background: 'rgba(255,255,255,0.15)', marginRight: 20 }} />}
              <div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.50)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 2 }}>{s.label}</div>
                <div style={{ fontSize: 20, fontWeight: 900, letterSpacing: '-0.04em' }}>{s.value}</div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Modules */}
      <div>
        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 14 }}>
          Программа курса
        </div>

        {modules.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 6 }}>Модули скоро появятся</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Контент курса готовится</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modules.map((mod, mi) => {
              const modLessons    = lessons.filter(l => l.module_id === mod.id)
              const modCompleted  = modLessons.filter(l => progress.get(l.id)).length
              const modPct        = modLessons.length ? Math.round((modCompleted / modLessons.length) * 100) : 0
              const isOpen        = open.has(mod.id)
              const allDone       = modLessons.length > 0 && modCompleted === modLessons.length

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: mi * 0.05 }}
                  style={{ background: '#fff', borderRadius: 20, border: `1px solid ${allDone ? 'rgba(16,185,129,0.25)' : 'rgba(27,143,196,0.10)'}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(27,59,107,0.05)' }}
                >
                  {/* Module header */}
                  <button
                    onClick={() => toggle(mod.id)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}
                  >
                    {/* Number */}
                    <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, background: allDone ? 'rgba(16,185,129,0.12)' : 'rgba(27,143,196,0.08)', color: allDone ? '#10b981' : '#1B8FC4' }}>
                      {allDone ? <CheckCircle size={18} /> : mi + 1}
                    </div>

                    {/* Title + progress */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: modLessons.length > 0 ? 5 : 0 }}>{mod.title}</div>
                      {modLessons.length > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, background: allDone ? '#10b981' : '#1B8FC4', width: `${modPct}%`, transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', flexShrink: 0 }}>{modCompleted}/{modLessons.length}</span>
                        </div>
                      )}
                      {modLessons.length === 0 && (
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>3 урока · Grammar, Vocabulary, Listening</span>
                      )}
                    </div>

                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} color='#94a3b8' />
                    </motion.div>
                  </button>

                  {/* Lessons accordion */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                        style={{ overflow: 'hidden' }}
                      >
                        <div style={{ borderTop: '1px solid rgba(27,143,196,0.07)', padding: '8px 12px 12px' }}>
                          {modLessons.length === 0 ? (
                            /* Planned lessons placeholder */
                            ['grammar', 'vocabulary', 'listening'].map((type, ti) => {
                              const meta = TYPE_META[type]
                              return (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 12, opacity: 0.5, marginBottom: ti < 2 ? 4 : 0 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                                    {meta.icon}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>{meta.label}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>Скоро</div>
                                  </div>
                                  <Lock size={13} color='#cbd5e1' />
                                </div>
                              )
                            })
                          ) : (
                            modLessons.map((lesson, li) => {
                              const done = progress.get(lesson.id) ?? false
                              const meta = TYPE_META[lesson.lesson_type] ?? TYPE_META.grammar
                              const locked   = false

                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => !locked && router.push(`/english/dashboard/courses/${courseId}/lessons/${lesson.id}`)}
                                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 12, cursor: locked ? 'default' : 'pointer', opacity: locked ? 0.5 : 1, marginBottom: li < modLessons.length - 1 ? 4 : 0, background: done ? 'rgba(16,185,129,0.05)' : 'transparent', transition: 'background 0.15s' }}
                                >
                                  <div style={{ width: 32, height: 32, borderRadius: 10, background: done ? 'rgba(16,185,129,0.12)' : `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: done ? '#10b981' : meta.color, flexShrink: 0 }}>
                                    {done ? <CheckCircle size={16} /> : meta.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>{lesson.title}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{meta.label}</div>
                                  </div>
                                  {locked  && <Lock       size={13} color='#cbd5e1' />}
                                  {!locked && !done && <PlayCircle  size={15} color={meta.color} />}
                                  {done    && <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>✓</span>}
                                </div>
                              )
                            })
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )
            })}
          </div>
        )}
      </div>

    </div>
  )
}
