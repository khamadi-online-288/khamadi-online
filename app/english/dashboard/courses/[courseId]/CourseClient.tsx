'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, BookOpen, Headphones, AlignLeft, CheckCircle, Lock, PlayCircle } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import ContentProtection from '@/components/english/ContentProtection'
import { useLanguage } from '@/app/english/context/LanguageContext'

type Course  = { id: string; title: string; level: string; category: string; description: string | null }
type Module  = { id: string; title: string; order_index: number; section: string | null }
type Lesson  = { id: string; title: string; order_index: number; lesson_type: string; module_id: string | null }
type ProgRow = { lesson_id: string; completed: boolean }

const SECTION_CONFIG_COLORS: Record<string, { color: string; emoji: string }> = {
  'A2': { color: '#22c55e', emoji: '🟢' },
  'B1': { color: '#3b82f6', emoji: '🔵' },
  'B2': { color: '#8b5cf6', emoji: '🟣' },
  'C1': { color: '#f97316', emoji: '🟠' },
}

const TYPE_META: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  grammar:    { label: 'Grammar',    icon: <AlignLeft  size={14} />, color: '#1B8FC4' },
  vocabulary: { label: 'Vocabulary', icon: <BookOpen   size={14} />, color: '#10b981' },
  listening:  { label: 'Listening',  icon: <Headphones size={14} />, color: '#8b5cf6' },
}

interface Props {
  courseId:        string
  userId:          string
  initialCourse:   Course | null
  initialModules:  Module[]
  initialLessons:  Lesson[]
  initialProgress: { lesson_id: string; completed: boolean }[]
}

export default function CourseClient({ courseId, userId, initialCourse, initialModules, initialLessons, initialProgress }: Props) {
  const router = useRouter()
  const { t } = useLanguage()
  const SECTION_CONFIG: Record<string, { label: string; color: string; emoji: string }> = {
    'A2': { label: `${t.course_page.level_label} A2`, ...SECTION_CONFIG_COLORS['A2'] },
    'B1': { label: `${t.course_page.level_label} B1`, ...SECTION_CONFIG_COLORS['B1'] },
    'B2': { label: `${t.course_page.level_label} B2`, ...SECTION_CONFIG_COLORS['B2'] },
    'C1': { label: `${t.course_page.level_label} C1`, ...SECTION_CONFIG_COLORS['C1'] },
  }

  const course  = initialCourse
  const modules = initialModules
  const lessons = initialLessons
  const isESP   = course?.category === 'English for Special Purposes'

  const [progress,    setProgress]    = useState<Map<string, boolean>>(() => {
    const map = new Map<string, boolean>()
    for (const p of initialProgress) map.set(p.lesson_id, p.completed)
    return map
  })
  const [progLoading, setProgLoading] = useState(false)
  const [open,        setOpen]        = useState<Set<string>>(
    () => modules.length ? new Set([modules[0].id]) : new Set()
  )
  const [toast, setToast] = useState<string | null>(null)

  // Re-fetch progress when navigating back (after completing a lesson)
  useEffect(() => { loadProgress() }, [courseId, userId])

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  async function loadProgress() {
    if (!userId) return
    const supabase = createEnglishClient()
    const { data } = await supabase
      .from('english_progress')
      .select('lesson_id,completed')
      .eq('user_id', userId)
    const map = new Map<string, boolean>()
    for (const p of (data ?? []) as ProgRow[]) map.set(p.lesson_id, p.completed)
    setProgress(map)
    setProgLoading(false)
  }

  function toggle(id: string) {
    setOpen(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // ── Locking helpers (General English only) ────────────────────────────────

  function isPreviousModuleCompleted(moduleIndex: number): boolean {
    if (moduleIndex === 0) return true
    const prevModule = modules[moduleIndex - 1]
    const prevLessons = lessons.filter(l => l.module_id === prevModule.id)
    if (prevLessons.length === 0) return true // no lessons yet = open
    const completedCount = prevLessons.filter(l => progress.get(l.id) === true).length
    return completedCount >= prevLessons.length * 0.8 // 80% threshold
  }

  function isLessonLocked(lessonIndex: number, modLessons: Lesson[], moduleIndex: number): boolean {
    if (moduleIndex === 0) return false  // Module 1: all lessons always open
    if (lessonIndex === 0) return false  // First lesson of any module: always open
    const prevLesson = modLessons[lessonIndex - 1]
    return progress.get(prevLesson.id) !== true
  }

  function showToast(msg: string) {
    setToast(msg)
  }

  // ─────────────────────────────────────────────────────────────────────────

  if (!course) return (
    <div style={{ textAlign: 'center', padding: 48 }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>😕</div>
      <div style={{ fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>{t.course_page.not_found}</div>
      <button onClick={() => router.push('/english/dashboard/courses')} style={{ padding: '10px 20px', borderRadius: 12, background: '#1B8FC4', color: '#fff', border: 'none', fontWeight: 800, cursor: 'pointer' }}>{t.course_page.back_courses}</button>
    </div>
  )

  const completedCount = lessons.filter(l => progress.get(l.id)).length
  const totalCount     = lessons.length
  const pct            = totalCount ? Math.round((completedCount / totalCount) * 100) : 0

  return (
    <ContentProtection>
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

        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.60)' }}>{t.course_page.course_progress}</span>
            <span style={{ fontSize: 12, fontWeight: 900, color: '#fff' }}>
              {progLoading ? '...' : `${completedCount} / ${totalCount} ${t.courses.lessons} · ${pct}%`}
            </span>
          </div>
          <div style={{ height: 6, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
            <motion.div initial={{ width: 0 }} animate={{ width: progLoading ? '0%' : `${pct}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #38bdf8, #fff)' }} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { label: t.course_page.modules_label,   value: modules.length },
            { label: t.course_page.lessons_label,   value: totalCount },
            { label: t.course_page.completed_label, value: progLoading ? '…' : completedCount },
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
          {t.course_page.program}
        </div>

        {modules.length === 0 ? (
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.10)', padding: '40px 24px', textAlign: 'center' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🚧</div>
            <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 6 }}>{t.course_page.modules_soon}</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{t.course_page.content_preparing}</div>
          </div>

        ) : isESP ? (
          /* ── ESP: group by section — NO locking ── */
          (() => {
            const sectionOrder = ['A2', 'B1', 'B2', 'C1']
            const presentSections = sectionOrder.filter(s => modules.some(m => (m.section ?? 'B1') === s))
            return (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                {presentSections.map(section => {
                  const cfg = SECTION_CONFIG[section] ?? { label: section, color: '#64748b', emoji: '◉' }
                  const sectionMods = modules.filter(m => (m.section ?? 'B1') === section)
                  return (
                    <div key={section}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                        <span style={{ fontSize: 16 }}>{cfg.emoji}</span>
                        <span style={{ fontSize: 13, fontWeight: 800, color: cfg.color, letterSpacing: '0.03em' }}>{cfg.label}</span>
                        <div style={{ flex: 1, height: 1, background: `${cfg.color}30`, marginLeft: 4 }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                        {sectionMods.map((mod, mi) => {
                          const modLessons   = lessons.filter(l => l.module_id === mod.id)
                          const modCompleted = modLessons.filter(l => progress.get(l.id)).length
                          const modPct       = modLessons.length ? Math.round((modCompleted / modLessons.length) * 100) : 0
                          const isOpen       = open.has(mod.id)
                          const allDone      = modLessons.length > 0 && modCompleted === modLessons.length
                          return (
                            <motion.div key={mod.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: mi * 0.05 }}
                              style={{ background: '#fff', borderRadius: 20, border: `1px solid ${allDone ? 'rgba(16,185,129,0.25)' : `${cfg.color}22`}`, overflow: 'hidden', boxShadow: '0 2px 12px rgba(27,59,107,0.05)' }}>
                              <button onClick={() => toggle(mod.id)}
                                style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' }}>
                                <div style={{ width: 36, height: 36, borderRadius: 11, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 900, background: allDone ? 'rgba(16,185,129,0.12)' : `${cfg.color}14`, color: allDone ? '#10b981' : cfg.color }}>
                                  {allDone ? <CheckCircle size={18} /> : mi + 1}
                                </div>
                                <div style={{ flex: 1, minWidth: 0 }}>
                                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: modLessons.length > 0 ? 5 : 0 }}>{mod.title}</div>
                                  {modLessons.length > 0 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                      <div style={{ flex: 1, height: 3, borderRadius: 99, background: `${cfg.color}18`, overflow: 'hidden' }}>
                                        <div style={{ height: '100%', borderRadius: 99, background: allDone ? '#10b981' : cfg.color, width: `${modPct}%`, transition: 'width 0.5s ease' }} />
                                      </div>
                                      <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', flexShrink: 0 }}>{modCompleted}/{modLessons.length}</span>
                                    </div>
                                  )}
                                  {modLessons.length === 0 && <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{t.course_page.lessons_preparing}</span>}
                                </div>
                                <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                                  <ChevronDown size={18} color='#94a3b8' />
                                </motion.div>
                              </button>
                              <AnimatePresence initial={false}>
                                {isOpen && (
                                  <motion.div key="content" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }} style={{ overflow: 'hidden' }}>
                                    <div style={{ borderTop: `1px solid ${cfg.color}18`, padding: '8px 12px 12px' }}>
                                      {modLessons.map((lesson, li) => {
                                        const done = progress.get(lesson.id) ?? false
                                        const meta = TYPE_META[lesson.lesson_type] ?? TYPE_META.grammar
                                        return (
                                          <div key={lesson.id}
                                            onClick={() => router.push(`/english/dashboard/courses/${courseId}/lessons/${lesson.id}`)}
                                            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 12, cursor: 'pointer', marginBottom: li < modLessons.length - 1 ? 4 : 0, background: done ? 'rgba(16,185,129,0.05)' : 'transparent', transition: 'background 0.15s' }}>
                                            <div style={{ width: 32, height: 32, borderRadius: 10, background: done ? 'rgba(16,185,129,0.12)' : `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: done ? '#10b981' : meta.color, flexShrink: 0 }}>
                                              {done ? <CheckCircle size={16} /> : meta.icon}
                                            </div>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                              <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>{lesson.title}</div>
                                              <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{meta.label}</div>
                                            </div>
                                            {!done && <PlayCircle size={15} color={cfg.color} />}
                                            {done  && <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>✓</span>}
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </motion.div>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })()

        ) : (
          /* ── General English: sequential locking ── */
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {modules.map((mod, mi) => {
              const modLessons   = lessons.filter(l => l.module_id === mod.id)
              const modCompleted = modLessons.filter(l => progress.get(l.id)).length
              const modPct       = modLessons.length ? Math.round((modCompleted / modLessons.length) * 100) : 0
              const isOpen       = open.has(mod.id)
              const allDone      = modLessons.length > 0 && modCompleted === modLessons.length
              const locked       = !isPreviousModuleCompleted(mi)

              return (
                <motion.div
                  key={mod.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: mi * 0.05 }}
                  style={{
                    background: locked ? '#f8fafc' : '#fff',
                    borderRadius: 20,
                    border: `1px solid ${allDone ? 'rgba(16,185,129,0.25)' : locked ? 'rgba(148,163,184,0.20)' : 'rgba(27,143,196,0.10)'}`,
                    overflow: 'hidden',
                    boxShadow: locked ? 'none' : '0 2px 12px rgba(27,59,107,0.05)',
                    opacity: locked ? 0.75 : 1,
                  }}
                >
                  <button
                    onClick={() => {
                      if (locked) {
                        showToast(`${t.course_page.toast_module} ${mi}`)
                      } else {
                        toggle(mod.id)
                      }
                    }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px', background: 'none', border: 'none', cursor: locked ? 'default' : 'pointer', textAlign: 'left' }}
                  >
                    {/* Module icon */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 11, flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900,
                      background: locked ? 'rgba(148,163,184,0.12)' : allDone ? 'rgba(16,185,129,0.12)' : 'rgba(27,143,196,0.08)',
                      color: locked ? '#94a3b8' : allDone ? '#10b981' : '#1B8FC4',
                    }}>
                      {locked ? <Lock size={16} /> : allDone ? <CheckCircle size={18} /> : mi + 1}
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: locked ? '#94a3b8' : '#1B3A6B', marginBottom: 4 }}>{mod.title}</div>
                      {locked ? (
                        <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                          🔒 {t.course_page.module_locked}
                        </div>
                      ) : modLessons.length > 0 ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 3, borderRadius: 99, background: 'rgba(27,143,196,0.10)', overflow: 'hidden' }}>
                            <div style={{ height: '100%', borderRadius: 99, background: allDone ? '#10b981' : '#1B8FC4', width: `${modPct}%`, transition: 'width 0.5s ease' }} />
                          </div>
                          <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', flexShrink: 0 }}>{modCompleted}/{modLessons.length}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>3 {t.courses.lessons} · Grammar, Vocabulary, Listening</span>
                      )}
                    </div>

                    {!locked && (
                      <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown size={18} color='#94a3b8' />
                      </motion.div>
                    )}
                  </button>

                  {/* Lesson list — only if unlocked */}
                  <AnimatePresence initial={false}>
                    {!locked && isOpen && (
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
                            ['grammar', 'vocabulary', 'listening'].map((type, ti) => {
                              const meta = TYPE_META[type]
                              return (
                                <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 10px', borderRadius: 12, opacity: 0.5, marginBottom: ti < 2 ? 4 : 0 }}>
                                  <div style={{ width: 32, height: 32, borderRadius: 10, background: `${meta.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: meta.color, flexShrink: 0 }}>
                                    {meta.icon}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>{meta.label}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{t.course_page.soon}</div>
                                  </div>
                                  <Lock size={13} color='#cbd5e1' />
                                </div>
                              )
                            })
                          ) : (
                            modLessons.map((lesson, li) => {
                              const done       = progress.get(lesson.id) ?? false
                              const lessonLock = isLessonLocked(li, modLessons, mi)
                              const meta       = TYPE_META[lesson.lesson_type] ?? TYPE_META.grammar
                              return (
                                <div
                                  key={lesson.id}
                                  onClick={() => {
                                    if (lessonLock) {
                                      showToast(t.course_page.toast_lesson)
                                    } else {
                                      router.push(`/english/dashboard/courses/${courseId}/lessons/${lesson.id}`)
                                    }
                                  }}
                                  style={{
                                    display: 'flex', alignItems: 'center', gap: 12,
                                    padding: '11px 10px', borderRadius: 12,
                                    cursor: lessonLock ? 'default' : 'pointer',
                                    marginBottom: li < modLessons.length - 1 ? 4 : 0,
                                    background: done ? 'rgba(16,185,129,0.05)' : lessonLock ? 'rgba(148,163,184,0.04)' : 'transparent',
                                    opacity: lessonLock ? 0.65 : 1,
                                    transition: 'background 0.15s',
                                  }}
                                >
                                  <div style={{
                                    width: 32, height: 32, borderRadius: 10, flexShrink: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    background: done ? 'rgba(16,185,129,0.12)' : lessonLock ? 'rgba(148,163,184,0.12)' : `${meta.color}18`,
                                    color: done ? '#10b981' : lessonLock ? '#94a3b8' : meta.color,
                                  }}>
                                    {done ? <CheckCircle size={16} /> : lessonLock ? <Lock size={14} /> : meta.icon}
                                  </div>
                                  <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontSize: 13, fontWeight: 800, color: lessonLock ? '#94a3b8' : '#1B3A6B' }}>{lesson.title}</div>
                                    <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{meta.label}</div>
                                  </div>
                                  {done       && <span style={{ fontSize: 11, fontWeight: 800, color: '#10b981' }}>✓</span>}
                                  {!done && !lessonLock && <PlayCircle size={15} color={meta.color} />}
                                  {lessonLock && <Lock size={13} color='#cbd5e1' />}
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

    {/* Toast notification */}
    <AnimatePresence>
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.96 }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          style={{
            position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)',
            background: '#1B3A6B', color: '#fff', borderRadius: 14,
            padding: '12px 20px', fontSize: 13, fontWeight: 700,
            boxShadow: '0 8px 28px rgba(27,58,107,0.28)',
            zIndex: 1000, display: 'flex', alignItems: 'center', gap: 8,
            whiteSpace: 'nowrap',
          }}
        >
          🔒 {toast}
        </motion.div>
      )}
    </AnimatePresence>

    </ContentProtection>
  )
}
