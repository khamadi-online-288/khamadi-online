'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const G = '#C9933B'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Group {
  id: string; name: string; join_code: string
  students_count: number; avg_progress: number; level_code: string
}
interface Student {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; last_active_at: string | null
}
interface Assignment {
  id: string; title: string; deadline_at: string | null; group_name?: string
}

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState(sessionStorage.getItem('zku-teacher-name') ?? '')
  const [groups,   setGroups]   = useState<Group[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [homework, setHomework] = useState<Assignment[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [activeToday,   setActiveToday]   = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const { data: profile } = await supabase
        .from('english_user_profiles').select('full_name')
        .eq('user_id', session.user.id).maybeSingle()
      if (profile?.full_name) setTeacherName(profile.full_name)

      const { data: grps } = await supabase
        .from('english_groups')
        .select('id, name, join_code, students_count, avg_progress, level_code')
        .eq('teacher_id', session.user.id)
        .order('created_at', { ascending: false })
      const groupList = (grps ?? []) as Group[]
      setGroups(groupList)

      if (groupList.length > 0) {
        const groupIds = groupList.map(g => g.id)

        // Students
        const { data: studs, count } = await supabase
          .from('english_user_profiles')
          .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at', { count: 'exact' })
          .in('group_id', groupIds)
          .order('last_active_at', { ascending: false })
          .limit(6)
        setStudents((studs ?? []) as Student[])
        setTotalStudents(count ?? 0)

        const today = new Date().toISOString().split('T')[0]
        setActiveToday((studs ?? []).filter((s: Student) => s.last_active_at?.startsWith(today)).length)

        // Upcoming homework
        const { data: hw } = await supabase
          .from('english_assignments')
          .select('id, title, deadline_at, group_id')
          .in('group_id', groupIds)
          .gte('deadline_at', new Date().toISOString())
          .order('deadline_at', { ascending: true })
          .limit(4)
        const groupMap: Record<string,string> = {}
        groupList.forEach(g => { groupMap[g.id] = g.name })
        setHomework(((hw ?? []) as (Assignment & { group_id?: string })[]).map(a => ({
          ...a, group_name: a.group_id ? groupMap[a.group_id] : ''
        })))
      }
      setLoading(false)
    }
    load()
  }, [])

  const avgProgress = groups.length > 0
    ? Math.round(groups.reduce((s, g) => s + (g.avg_progress ?? 0), 0) / groups.length)
    : 0

  const STATS = [
    { label: 'Моих групп',       value: groups.length,  color: N,       bg: '#EEF2F7', icon: '👥', href: '/english/zku/teacher/groups' },
    { label: 'Студентов',        value: totalStudents,  color: T,       bg: '#DCFCE7', icon: '🎓', href: '/english/zku/teacher/students' },
    { label: 'Активны сегодня',  value: activeToday,    color: '#EF4444', bg: '#FEE2E2', icon: '⚡', href: '/english/zku/teacher/students' },
    { label: 'Ср. прогресс',     value: avgProgress + '%', color: '#7C3AED', bg: '#EDE9FE', icon: '📈', href: '/english/zku/teacher/students' },
  ]

  function daysLeft(deadline: string | null) {
    if (!deadline) return null
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    if (d < 0) return { label: 'Просрочено', color: '#DC2626' }
    if (d === 0) return { label: 'Сегодня', color: '#EF4444' }
    return { label: `через ${d} дн.`, color: d <= 2 ? G : MUT }
  }

  if (loading) return (
    <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ fontSize: 13, color: MUT, fontWeight: 600 }}>Загружаем данные...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1140, margin: '0 auto' }}>

      {/* Welcome */}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 3 }}>
          Добро пожаловать, {teacherName.split(' ')[0] || 'Преподаватель'}! 👋
        </h1>
        <p style={{ fontSize: 13, color: MUT }}>Вот что происходит в ваших группах сегодня</p>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '16px 18px', border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.05)', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 18px rgba(0,56,118,0.10)` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,56,118,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ width: 38, height: 38, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 19 }}>{s.icon}</div>
                <span style={{ fontSize: 9, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>→</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: MUT, fontWeight: 600 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr 0.8fr', gap: 16 }}>

        {/* Groups */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: N }}>👥 Мои группы</h2>
            <Link href="/english/zku/teacher/groups" style={{ fontSize: 12, color: N, textDecoration: 'none', fontWeight: 700, background: '#EEF2F7', padding: '4px 10px', borderRadius: 8 }}>+ Создать</Link>
          </div>
          {groups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Групп нет</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Создайте первую группу</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {groups.slice(0, 5).map(g => {
                const lc = LEVEL_COLOR[g.level_code] ?? N
                return (
                  <Link key={g.id} href="/english/zku/teacher/groups" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 12, background: '#F8FBFF', border: `1px solid ${BDR}`, transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#EEF2F7'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F8FBFF'}>
                    <div style={{ width: 34, height: 34, borderRadius: 10, background: `${lc}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, flexShrink: 0 }}>👥</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{g.name}</div>
                      <div style={{ fontSize: 10, color: MUT }}>{g.students_count ?? 0} студ. · <span style={{ fontFamily: 'monospace', fontWeight: 700, color: lc }}>{g.join_code}</span></div>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 800, color: T, flexShrink: 0 }}>{g.avg_progress ?? 0}%</div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Recent students */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: N }}>🎓 Студенты</h2>
            <Link href="/english/zku/teacher/students" style={{ fontSize: 11, color: N, textDecoration: 'none', fontWeight: 600 }}>Все →</Link>
          </div>
          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Студентов нет</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
              {students.map(s => {
                const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
                const lc = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
                const today = new Date().toISOString().split('T')[0]
                const isActive = s.last_active_at?.startsWith(today)
                return (
                  <div key={s.user_id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 12, background: '#F8FBFF', border: `1px solid ${BDR}` }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${N}, #0055a4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{initial}</div>
                      {isActive && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: T, border: '2px solid #fff' }} />}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.full_name ?? 'Студент'}</div>
                      <div style={{ fontSize: 10, color: MUT }}>
                        <span style={{ color: lc, fontWeight: 700 }}>{s.current_level ?? 'A1'}</span>
                        {' · '}{s.total_xp ?? 0} XP
                        {(s.current_streak ?? 0) > 0 && ` · 🔥${s.current_streak}`}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Upcoming homework */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: N }}>📋 Задания</h2>
            <Link href="/english/zku/teacher/homework" style={{ fontSize: 12, color: N, textDecoration: 'none', fontWeight: 700, background: '#EEF2F7', padding: '4px 10px', borderRadius: 8 }}>+ Новое</Link>
          </div>
          {homework.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '28px 0', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>📋</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>Нет заданий</div>
              <div style={{ fontSize: 11, color: '#94A3B8' }}>Создайте первое задание</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {homework.map(hw => {
                const dl = daysLeft(hw.deadline_at)
                return (
                  <Link key={hw.id} href="/english/zku/teacher/homework" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 4, padding: '10px 12px', borderRadius: 12, background: '#F8FBFF', border: `1px solid ${BDR}`, transition: 'background 0.12s' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#EEF2F7'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F8FBFF'}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{hw.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ fontSize: 10, color: MUT }}>{hw.group_name}</div>
                      {dl && <div style={{ fontSize: 10, fontWeight: 700, color: dl.color }}>⏰ {dl.label}</div>}
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
