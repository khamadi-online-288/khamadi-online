'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const G = '#C9933B'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Group {
  id: string
  name: string
  join_code: string
  students_count: number
  avg_progress: number
}

interface RecentStudent {
  user_id: string
  full_name: string | null
  current_level: string | null
  total_xp: number | null
  last_active_at: string | null
}

export default function TeacherDashboard() {
  const [teacherName, setTeacherName] = useState('')
  const [groups,  setGroups]  = useState<Group[]>([])
  const [students, setStudents] = useState<RecentStudent[]>([])
  const [totalStudents, setTotalStudents] = useState(0)
  const [activeToday, setActiveToday] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Teacher profile
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('full_name')
        .eq('user_id', session.user.id)
        .maybeSingle()
      setTeacherName(profile?.full_name ?? '')

      // Teacher's groups
      const { data: grps } = await supabase
        .from('english_groups')
        .select('id, name, join_code, students_count, avg_progress')
        .eq('teacher_id', session.user.id)
        .order('created_at', { ascending: false })
      setGroups((grps ?? []) as Group[])

      // Students in teacher's groups
      if (grps && grps.length > 0) {
        const groupIds = grps.map((g: Group) => g.id)
        const { data: studs, count } = await supabase
          .from('english_user_profiles')
          .select('user_id, full_name, current_level, total_xp, last_active_at', { count: 'exact' })
          .in('group_id', groupIds)
          .order('last_active_at', { ascending: false })
          .limit(5)

        setStudents((studs ?? []) as RecentStudent[])
        setTotalStudents(count ?? 0)

        // Active today
        const today = new Date().toISOString().split('T')[0]
        const active = (studs ?? []).filter((s: RecentStudent) =>
          s.last_active_at && s.last_active_at.startsWith(today)
        ).length
        setActiveToday(active)
      }

      setLoading(false)
    }
    load()
  }, [])

  const STATS = [
    { label: 'Моих групп',   value: groups.length,    color: N,   bg: '#EEF2F7', icon: '👥' },
    { label: 'Студентов',    value: totalStudents,    color: T,   bg: '#DCFCE7', icon: '🎓' },
    { label: 'Активны сегодня', value: activeToday,  color: G,   bg: '#FEF3C7', icon: '⚡' },
    { label: 'Ср. прогресс', value: groups.length > 0 ? Math.round(groups.reduce((s, g) => s + (g.avg_progress ?? 0), 0) / groups.length) + '%' : '—', color: '#7C3AED', bg: '#EDE9FE', icon: '📈' },
  ]

  if (loading) return (
    <div style={{ padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: MUT, fontWeight: 600, marginBottom: 4 }}>Кабинет преподавателя</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 4 }}>
          Добро пожаловать, {teacherName.split(' ')[0]}!
        </h1>
        <p style={{ fontSize: 13, color: MUT }}>Обзор ваших групп и студентов</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {STATS.map(s => (
          <div key={s.label} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>{s.icon}</div>
            </div>
            <div style={{ fontSize: 26, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: MUT, marginTop: 4 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* My groups */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', border: `1px solid ${BDR}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: N }}>Мои группы</h2>
            <Link href="/english/zku/teacher/groups" style={{ fontSize: 12, color: N, textDecoration: 'none', fontWeight: 600 }}>Все →</Link>
          </div>

          {groups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: MUT }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>👥</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Групп нет</div>
              <Link href="/english/zku/teacher/groups" style={{ display: 'inline-block', marginTop: 12, padding: '8px 16px', borderRadius: 8, background: N, color: '#fff', fontSize: 12, fontWeight: 700, textDecoration: 'none' }}>
                Создать группу
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {groups.slice(0, 4).map(g => (
                <Link key={g.id} href={`/english/zku/teacher/groups`} style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 12, background: '#F8FBFF', border: `1px solid ${BDR}`, transition: 'all 0.15s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#EEF2F7'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F8FBFF'}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${N}22`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>👥</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: MUT }}>{g.students_count ?? 0} студентов · код: {g.join_code}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: T }}>{g.avg_progress ?? 0}%</div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent students */}
        <div style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', border: `1px solid ${BDR}` }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: N }}>Последние активные</h2>
            <Link href="/english/zku/teacher/students" style={{ fontSize: 12, color: N, textDecoration: 'none', fontWeight: 600 }}>Все →</Link>
          </div>

          {students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '32px 0', color: MUT }}>
              <div style={{ fontSize: 32, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Студентов нет</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {students.map(s => {
                const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
                const lastActive = s.last_active_at
                  ? new Date(s.last_active_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
                  : '—'
                return (
                  <div key={s.user_id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 12, background: '#F8FBFF', border: `1px solid ${BDR}` }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${N}, #0055a4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{initial}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{s.full_name ?? 'Студент'}</div>
                      <div style={{ fontSize: 11, color: MUT }}>{s.current_level ?? 'A1'} · {s.total_xp ?? 0} XP</div>
                    </div>
                    <div style={{ fontSize: 11, color: MUT }}>{lastActive}</div>
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
