'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'
import {
  Flame, BookOpen, Award, TrendingUp,
  ChevronRight, Star, BarChart2, Bell, ArrowRight,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

type Profile = {
  full_name:     string | null
  current_level: string | null
  role:          string
  purpose?:      string | null
}

type CourseRow = {
  id:          string
  title:       string
  level:       string
  category:    string
  description: string | null
}

type ProgressRow = {
  lesson_id:   string
  completed:   boolean
  updated_at:  string
}

type CertRow = {
  id:                 string
  course_id:          string
  certificate_number: string
  issued_at:          string
}

type ScheduleEvent = {
  id:          string
  title:       string
  type:        string
  start_time:  string
  end_time:    string
  location:    string | null
  meeting_url: string | null
  group:       { name: string } | null
}

type LessonRow = {
  id:        string
  course_id: string
  title:     string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const LEVEL_LABEL: Record<string, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
}

const CEFR = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2']

const PURPOSE_TITLE: Record<string, string> = {
  accounting:       'Accounting',
  computer_science: 'Computer Science',
  hospitality:      'Hospitality',
  management:       'Management',
  finance_industry: 'Finance Industry',
  social_sciences:  'Social Sciences',
  law:              'Law',
}

const COURSE_ICONS: Record<string, string> = {
  'A1 Beginner':          '🌱',
  'A1 Elementary':        '🌿',
  'A2 Pre-Intermediate':  '📗',
  'B1 Intermediate':      '📘',
  'B2 Upper-Intermediate':'📙',
  'C1 Advanced':          '🏆',
  'C2 Proficient':        '💎',
  Accounting: '🧾', 'Computer Science': '💻', Hospitality: '🏨',
  Management: '📊', 'Finance Industry': '💰', 'Social Sciences': '🧠', Law: '⚖️',
}

const DAYS_RU = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const SCHED_TYPE_COLORS: Record<string, string> = { lesson: '#1B8FC4', exam: '#ef4444', consultation: '#10b981', event: '#C9933B' }
const SCHED_TYPE_LABELS: Record<string, string> = { lesson: 'Урок', exam: 'Экзамен', consultation: 'Консультация', event: 'Событие' }

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcStreak(progressRows: ProgressRow[]): number {
  const completed = progressRows.filter(p => p.completed && p.updated_at)
  if (!completed.length) return 0

  const days = new Set(
    completed.map(p => new Date(p.updated_at).toISOString().split('T')[0])
  )
  const sorted = Array.from(days).sort((a, b) => b.localeCompare(a))

  const today     = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(sorted[i - 1])
    const curr = new Date(sorted[i])
    const diff = (prev.getTime() - curr.getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

function calcWeekActivity(progressRows: ProgressRow[]): number[] {
  const result = [0, 0, 0, 0, 0, 0, 0]
  const now    = new Date()
  const monday = new Date(now)
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7))
  monday.setHours(0, 0, 0, 0)

  for (const row of progressRows) {
    if (!row.completed || !row.updated_at) continue
    const d = new Date(row.updated_at)
    if (d < monday) continue
    const dayIdx = (d.getDay() + 6) % 7
    result[dayIdx]++
  }
  return result
}

// ─── Animation variants ───────────────────────────────────────────────────────

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
})

// ─── Sub-components ───────────────────────────────────────────────────────────

function ProgressBar({ value, color = '#1B8FC4' }: { value: number; color?: string }) {
  return (
    <div style={{ height: 6, borderRadius: 99, background: 'rgba(27,143,196,0.1)', overflow: 'hidden' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${Math.min(100, value)}%` }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        style={{ height: '100%', borderRadius: 99, background: color }}
      />
    </div>
  )
}

function WeekChart({ data }: { data: number[] }) {
  const max      = Math.max(...data, 1)
  const todayIdx = (new Date().getDay() + 6) % 7

  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 72 }}>
      {data.map((val, i) => {
        const pct      = val / max
        const isToday  = i === todayIdx
        const barColor = isToday ? '#1B8FC4' : val > 0 ? '#93c5fd' : '#e2e8f0'

        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            <div style={{ width: '100%', height: 56, display: 'flex', alignItems: 'flex-end' }}>
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: `${Math.max(pct * 100, val > 0 ? 8 : 0)}%` }}
                transition={{ duration: 0.7, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  width: '100%', borderRadius: '4px 4px 2px 2px',
                  background: barColor,
                  boxShadow: isToday ? '0 2px 8px rgba(27,143,196,0.35)' : 'none',
                }}
              />
            </div>
            <span style={{ fontSize: 10, fontWeight: isToday ? 900 : 600, color: isToday ? '#1B8FC4' : '#94a3b8' }}>
              {DAYS_RU[i]}
            </span>
          </div>
        )
      })}
    </div>
  )
}

function ScheduleList({ events }: { events: ScheduleEvent[] }) {
  const today    = new Date(); today.setHours(0,0,0,0)
  const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1)

  function dayLabel(dt: Date): string {
    const d = new Date(dt); d.setHours(0,0,0,0)
    if (d.getTime() === today.getTime())    return 'Сегодня'
    if (d.getTime() === tomorrow.getTime()) return 'Завтра'
    return dt.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
  }

  // Group by day string
  const groups = new Map<string, ScheduleEvent[]>()
  for (const ev of events) {
    const key = new Date(ev.start_time).toISOString().split('T')[0]
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(ev)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {Array.from(groups.entries()).map(([dateKey, dayEvents]) => {
        const dt = new Date(dateKey + 'T00:00:00')
        const isToday = dt.getTime() === today.getTime()
        return (
          <div key={dateKey}>
            <div style={{ fontSize: 12, fontWeight: 800, color: isToday ? '#1B8FC4' : '#64748b', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>
              {dayLabel(dt)}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dayEvents.map(ev => {
                const color = SCHED_TYPE_COLORS[ev.type ?? 'lesson'] ?? '#1B8FC4'
                const start = new Date(ev.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
                const end   = ev.end_time ? new Date(ev.end_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' }) : null
                const grp   = ev.group as { name?: string } | null
                return (
                  <div key={ev.id} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 16px', borderRadius: 14, border: `1px solid ${color}28`, borderLeft: `4px solid ${color}`, background: isToday ? `${color}06` : '#f8fafc' }}>
                    <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 48 }}>
                      <div style={{ fontSize: 14, fontWeight: 900, color }}>{start}</div>
                      {end && <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 600 }}>→ {end}</div>}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 2 }}>{ev.title}</div>
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const }}>
                        <span style={{ fontSize: 11, background: `${color}18`, color, borderRadius: 5, padding: '1px 7px', fontWeight: 700 }}>{SCHED_TYPE_LABELS[ev.type ?? 'lesson'] ?? ev.type}</span>
                        {grp?.name && <span style={{ fontSize: 11, color: '#64748b', fontWeight: 600 }}>{grp.name}</span>}
                        {ev.location && <span style={{ fontSize: 11, color: '#94a3b8' }}>📍 {ev.location}</span>}
                      </div>
                    </div>
                    {ev.meeting_url && (
                      <a href={ev.meeting_url} target="_blank" rel="noreferrer" style={{ flexShrink: 0, padding: '7px 14px', borderRadius: 9, background: '#1B8FC4', color: '#fff', fontSize: 12, fontWeight: 800, textDecoration: 'none' }}>
                        Войти
                      </a>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardClient() {
  const [loading,   setLoading]   = useState(true)
  const [profile,   setProfile]   = useState<Profile | null>(null)
  const [courses,   setCourses]   = useState<CourseRow[]>([])
  const [progress,  setProgress]  = useState<ProgressRow[]>([])
  const [lessons,   setLessons]   = useState<LessonRow[]>([])
  const [certs,     setCerts]     = useState<CertRow[]>([])
  const [unread,    setUnread]    = useState(0)
  const [schedule,  setSchedule]  = useState<ScheduleEvent[]>([])

  useEffect(() => { loadData() }, [])

  async function loadData() {
    try {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { window.location.href = '/english/login'; return }

      const [profileRes, coursesRes, progressRes, lessonsRes, certsRes, notifRes, myGroupsRes] = await Promise.all([
        supabase.from('english_user_roles')
          .select('full_name, role, current_level, purpose')
          .eq('user_id', user.id).maybeSingle(),

        supabase.from('english_courses')
          .select('id, title, level, category, description')
          .eq('is_active', true).order('category').order('level'),

        supabase.from('english_progress')
          .select('lesson_id, completed, updated_at')
          .eq('user_id', user.id)
          .limit(500),

        supabase.from('english_lessons')
          .select('id, course_id, title')
          .eq('is_published', true)
          .limit(300),

        supabase.from('english_certificates')
          .select('id, course_id, certificate_number, issued_at')
          .eq('user_id', user.id),

        supabase.from('english_notifications')
          .select('id', { count: 'exact', head: true })
          .eq('user_id', user.id).eq('is_read', false),

        supabase.from('lms_group_students')
          .select('group_id')
          .eq('student_id', user.id),
      ])

      const p = profileRes.data as Profile | null
      if (!p) { window.location.href = '/english/register'; return }
      if (p.role === 'admin')   { window.location.href = '/english/admin';          return }
      if (p.role === 'teacher') { window.location.href = '/english/teacher';         return }
      if (p.role === 'support') { window.location.href = '/english/support-agent';  return }

      setProfile(p)
      setCourses((coursesRes.data ?? []) as CourseRow[])
      setProgress((progressRes.data ?? []) as ProgressRow[])
      setLessons((lessonsRes.data ?? []) as LessonRow[])
      setCerts((certsRes.data ?? []) as CertRow[])
      setUnread(notifRes.count ?? 0)

      const groupIds = ((myGroupsRes.data ?? []) as { group_id: string }[]).map(g => g.group_id)
      if (groupIds.length > 0) {
        const now = new Date().toISOString()
        const in7 = new Date(Date.now() + 7 * 86400000).toISOString()
        const { data: schedData } = await supabase
          .from('lms_schedule')
          .select('id,title,type,start_time,end_time,location,meeting_url,group:lms_groups(name)')
          .in('group_id', groupIds)
          .gte('start_time', now)
          .lte('start_time', in7)
          .order('start_time')
          .limit(20)
        setSchedule((schedData ?? []) as ScheduleEvent[])
      }
    } finally {
      setLoading(false)
    }
  }

  // ── Derived values ────────────────────────────────────────────────────────────

  const firstName    = profile?.full_name?.trim().split(' ')[0] ?? 'Студент'
  const currentLevel = profile?.current_level ?? null
  const nextLevel    = currentLevel ? CEFR[Math.min(CEFR.indexOf(currentLevel) + 1, 4)] : null

  const completedIds     = useMemo(() => new Set(progress.filter(p => p.completed).map(p => p.lesson_id)), [progress])
  const completedLessons = completedIds.size

  const streak   = useMemo(() => calcStreak(progress), [progress])
  const weekData = useMemo(() => calcWeekActivity(progress), [progress])

  const generalCourses = useMemo(() => courses.filter(c => c.category === 'General English'), [courses])
  const trackCourse = useMemo(() => {
    const p = profile?.purpose
    if (!p || p === 'general') return null
    const espTitle = PURPOSE_TITLE[p]
    if (!espTitle) return null
    return courses.find(c =>
      c.category === 'English for Special Purposes' &&
      c.title.toLowerCase().includes(espTitle.toLowerCase())
    ) ?? null
  }, [profile?.purpose, courses])

  const overallProgress = useMemo(() => {
    const total = lessons.length
    if (!total) return 0
    return Math.round((completedLessons / total) * 100)
  }, [completedLessons, lessons.length])

  function calcProgress<T extends CourseRow>(list: T[]) {
    return list.map(course => {
      const cl   = lessons.filter(l => l.course_id === course.id)
      const done = cl.filter(l => completedIds.has(l.id)).length
      const pct  = cl.length ? Math.round((done / cl.length) * 100) : 0
      return { ...course, done, total: cl.length, pct }
    })
  }

  const generalProgress = useMemo(() => calcProgress(generalCourses), [generalCourses, lessons, completedIds])
  const trackProgress   = useMemo(() => trackCourse ? calcProgress([trackCourse])[0] : null, [trackCourse, lessons, completedIds])

  // "Продолжить": ESP если есть прогресс, иначе первый незавершённый GE курс
  const continueHref = useMemo(() => {
    if (trackCourse && trackProgress && trackProgress.pct > 0) {
      return `/english/dashboard/courses/${trackCourse.id}`
    }
    const inProgress = generalProgress.find(c => c.pct > 0 && c.pct < 100)
    if (inProgress) return `/english/dashboard/courses/${inProgress.id}`
    const first = generalProgress.find(c => c.pct === 0 && c.total > 0)
    if (first) return `/english/dashboard/courses/${first.id}`
    return '/english/dashboard/courses'
  }, [trackCourse, trackProgress, generalProgress])

  const recentActivity = useMemo(() => {
    return progress
      .filter(p => p.completed)
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
      .map(p => {
        const lesson = lessons.find(l => l.id === p.lesson_id)
        const course = lesson ? courses.find(c => c.id === lesson.course_id) : null
        return {
          lessonTitle: lesson?.title  ?? 'Урок',
          courseTitle: course?.title  ?? '',
          courseIcon:  course ? (COURSE_ICONS[course.title] ?? '📘') : '📘',
          date:        new Date(p.updated_at),
        }
      })
  }, [progress, lessons, courses])

  const metrics = [
    { label: 'Активных курсов',  value: courses.length,         color: '#1B8FC4', icon: <BookOpen   size={18} /> },
    { label: 'Уроков пройдено',  value: completedLessons,       color: '#10b981', icon: <TrendingUp  size={18} /> },
    { label: 'Средний балл',     value: `${overallProgress}%`,  color: '#C9933B', icon: <BarChart2   size={18} /> },
    { label: 'Сертификатов',     value: certs.length,           color: '#8b5cf6', icon: <Award       size={18} /> },
  ]

  // ── Loading ───────────────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 40, height: 40, borderRadius: '50%', margin: '0 auto 16px', border: '3px solid #e2e8f0', borderTopColor: '#1B8FC4', animation: 'spin 0.8s linear infinite' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка дашборда...</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── 1. Hero Banner ── */}
      <motion.div {...fadeUp(0)} style={{
        borderRadius: 28, padding: '36px 40px', overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(135deg, #1B3A6B 0%, #2E5FA3 55%, #1B8FC4 100%)',
        boxShadow: '0 20px 52px rgba(27,59,107,0.22)',
        border: '1px solid rgba(255,255,255,0.06)',
      }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(56,189,248,0.15)', filter: 'blur(56px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '30%', width: 180, height: 180, borderRadius: '50%', background: 'rgba(201,147,59,0.10)', filter: 'blur(48px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: '1fr auto', gap: 32, alignItems: 'center' }}>
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 16 }}>
              {currentLevel && (
                <span style={{ padding: '6px 14px', borderRadius: 99, background: 'rgba(201,147,59,0.22)', border: '1px solid rgba(201,147,59,0.35)', color: '#F5C46A', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Star size={11} fill="currentColor" /> {currentLevel} · {LEVEL_LABEL[currentLevel] ?? ''}
                </span>
              )}
              {streak > 0 && (
                <span style={{ padding: '6px 14px', borderRadius: 99, background: 'rgba(255,100,50,0.18)', border: '1px solid rgba(255,100,50,0.28)', color: '#FF8C6B', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}>
                  <Flame size={12} /> {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
                </span>
              )}
              {unread > 0 && (
                <Link href="/english/dashboard/notifications" style={{ padding: '6px 14px', borderRadius: 99, background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.28)', color: '#fca5a5', fontSize: 12, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5, textDecoration: 'none' }}>
                  <Bell size={11} /> {unread} новых
                </Link>
              )}
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 46px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1.08, margin: '0 0 10px' }}>
              Привет, {firstName}! 👋
            </h1>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.65)', marginBottom: 24, lineHeight: 1.7, maxWidth: 500 }}>
              {currentLevel && nextLevel
                ? `Текущий уровень ${currentLevel}. Цель — ${nextLevel} ${LEVEL_LABEL[nextLevel] ?? ''}.`
                : 'Начните с General English и стройте язык шаг за шагом.'}
            </p>

            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 28 }}>
              <Link href={continueHref}
                style={{ padding: '12px 22px', borderRadius: 14, background: '#C9933B', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, boxShadow: '0 6px 20px rgba(201,147,59,0.38)' }}>
                Продолжить урок <ChevronRight size={15} />
              </Link>
              <Link href="/english/dashboard/courses"
                style={{ padding: '12px 22px', borderRadius: 14, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.16)', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: 6, backdropFilter: 'blur(8px)' }}>
                <BookOpen size={14} /> Все курсы
              </Link>
            </div>

            <div style={{ display: 'flex', gap: 0 }}>
              {[
                { label: 'Последний балл',  value: overallProgress > 0 ? `${overallProgress}%` : '—' },
                { label: 'Уроков пройдено', value: completedLessons },
                { label: 'Сертификатов',    value: certs.length },
              ].map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center' }}>
                  {i > 0 && <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.15)', margin: '0 20px' }} />}
                  <div>
                    <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.50)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 3 }}>{s.label}</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: CEFR path card */}
          <div style={{ width: 240, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 22, padding: 20, backdropFilter: 'blur(14px)', flexShrink: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', marginBottom: 12 }}>General English</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {generalProgress.slice(0, 5).map(cp => (
                  <Link key={cp.id} href={`/english/dashboard/courses/${cp.id}`}
                    style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.06)', textDecoration: 'none', color: '#fff' }}>
                    <span style={{ fontSize: 16 }}>{COURSE_ICONS[cp.title] ?? '📘'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 800, lineHeight: 1.2, marginBottom: 3 }}>{cp.title}</div>
                      <div style={{ height: 3, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                        <motion.div initial={{ width: 0 }} animate={{ width: `${cp.pct}%` }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          style={{ height: '100%', borderRadius: 99, background: '#1B8FC4' }} />
                      </div>
                    </div>
                    <span style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.55)', flexShrink: 0 }}>{cp.pct}%</span>
                  </Link>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. Metric Cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {metrics.map((m, i) => (
          <motion.div key={m.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 20px 44px rgba(27,143,196,0.13)' }}
            style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 22, padding: '20px 22px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)', transition: 'box-shadow 0.2s', cursor: 'default' }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase' }}>{m.label}</div>
              <div style={{ color: m.color, opacity: 0.7 }}>{m.icon}</div>
            </div>
            <div style={{ fontSize: 38, fontWeight: 900, color: m.color, letterSpacing: '-0.05em', lineHeight: 1 }}>{m.value}</div>
          </motion.div>
        ))}
      </div>

      {/* ── 3. Content grid ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 16 }}>

        {/* Left: Course Progress */}
        <motion.div {...fadeUp(0.3)} style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 26, padding: '24px 26px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 5 }}>Прогресс по курсам</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em' }}>General English</div>
            </div>
            <Link href="/english/dashboard/courses" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(27,143,196,0.14)', background: '#f8fafc', color: '#1B3A6B', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
              Все курсы <ArrowRight size={13} />
            </Link>
          </div>

          {/* General English A1–C1 */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: trackCourse ? 20 : 0 }}>
            {generalProgress.map((c, i) => (
              <motion.div key={c.id} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.35 + i * 0.06 }}>
                <Link href={`/english/dashboard/courses/${c.id}`}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 16, border: '1px solid rgba(27,143,196,0.09)', background: '#f8fafc', textDecoration: 'none' }}>
                  <span style={{ fontSize: 20, flexShrink: 0 }}>{COURSE_ICONS[c.title] ?? '📘'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B' }}>{c.title}</div>
                      <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', flexShrink: 0, marginLeft: 8 }}>{c.done}/{c.total}</div>
                    </div>
                    <ProgressBar value={c.pct} color={c.pct === 100 ? '#10b981' : '#1B8FC4'} />
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* ESP Track — отдельным блоком */}
          {trackCourse && trackProgress && (
            <>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>
                Профессиональный трек
              </div>
              <Link href={`/english/dashboard/courses/${trackCourse.id}`}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 18px', borderRadius: 18, background: 'linear-gradient(135deg, rgba(201,147,59,0.08), rgba(255,255,255,0.9))', border: '1px solid rgba(201,147,59,0.20)', textDecoration: 'none' }}>
                <span style={{ fontSize: 32 }}>{COURSE_ICONS[trackCourse.title] ?? '📘'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>{trackCourse.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8 }}>English for Special Purposes</div>
                  <ProgressBar value={trackProgress.pct} color='#C9933B' />
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#C9933B' }}>{trackProgress.pct}%</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{trackProgress.done}/{trackProgress.total}</div>
                </div>
              </Link>
            </>
          )}
        </motion.div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

          <motion.div {...fadeUp(0.35)} style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 26, padding: '22px 24px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Активность</div>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.02em' }}>За эту неделю</div>
              </div>
              {streak > 0 && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '6px 12px', borderRadius: 99, background: 'rgba(255,100,50,0.08)', border: '1px solid rgba(255,100,50,0.18)' }}>
                  <Flame size={13} color="#ef4444" />
                  <span style={{ fontSize: 13, fontWeight: 900, color: '#ef4444' }}>{streak}</span>
                </div>
              )}
            </div>
            <WeekChart data={weekData} />
            <div style={{ marginTop: 10, fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
              Уроков за неделю: <strong style={{ color: '#1B3A6B' }}>{weekData.reduce((a, b) => a + b, 0)}</strong>
            </div>
          </motion.div>

          <motion.div {...fadeUp(0.4)} style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 26, padding: '20px 22px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 12 }}>Быстрый переход</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { href: '/english/dashboard/courses',      label: 'Курсы',     icon: '📚' },
                { href: '/english/dashboard/certificates', label: 'Дипломы',   icon: '🏆' },
                { href: '/english/dashboard/profile',      label: 'Профиль',   icon: '⚙️' },
                { href: '/english/dashboard/support',      label: 'Поддержка', icon: '🛟' },
              ].map(l => (
                <Link key={l.href} href={l.href}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 14, border: '1px solid rgba(27,143,196,0.09)', background: '#f8fafc', color: '#1B3A6B', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                  <span style={{ fontSize: 15 }}>{l.icon}</span>{l.label}
                </Link>
              ))}
            </div>
          </motion.div>

          {nextLevel && (
            <motion.div {...fadeUp(0.45)} style={{ borderRadius: 24, padding: '20px 22px', background: 'linear-gradient(135deg, #1B3A6B, #2E5FA3)', color: '#fff', boxShadow: '0 12px 32px rgba(27,59,107,0.18)' }}>
              <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Следующая цель</div>
              <div style={{ fontSize: 36, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, color: '#7dd3fc', marginBottom: 4 }}>{nextLevel}</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>{LEVEL_LABEL[nextLevel]} — продолжайте учиться</div>
            </motion.div>
          )}
        </div>
      </div>

      {/* ── 4. Schedule ── */}
      {schedule.length > 0 && (
        <motion.div {...fadeUp(0.48)} style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 26, padding: '24px 26px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Ближайшие события</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.02em' }}>Расписание на неделю</div>
            </div>
          </div>
          <ScheduleList events={schedule} />
        </motion.div>
      )}

      {/* ── 5. Activity Feed ── */}
      {recentActivity.length > 0 && (
        <motion.div {...fadeUp(0.5)} style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.11)', borderRadius: 26, padding: '24px 26px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 16 }}>Последняя активность</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {recentActivity.map((a, i) => {
              const isToday     = new Date().toDateString() === a.date.toDateString()
              const isYesterday = new Date(Date.now() - 86400000).toDateString() === a.date.toDateString()
              const dateLabel   = isToday ? 'Сегодня' : isYesterday ? 'Вчера' : a.date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
              return (
                <motion.div key={i}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.5 + i * 0.06 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < recentActivity.length - 1 ? '1px solid rgba(27,143,196,0.07)' : 'none' }}
                >
                  <div style={{ width: 38, height: 38, borderRadius: 12, background: 'rgba(27,143,196,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>
                    {a.courseIcon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 2 }}>{a.lessonTitle}</div>
                    <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{a.courseTitle}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>{dateLabel}</span>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', flexShrink: 0 }} />
                  </div>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      )}

    </div>
  )
}
