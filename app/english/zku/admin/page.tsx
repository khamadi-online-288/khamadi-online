'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const ADMIN = '#7C3AED'
const G = '#C9933B'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface RecentUser {
  user_id: string; full_name: string | null; role: string
  current_level: string | null; total_xp: number | null; last_active_at: string | null
}

const ROLE_COLOR: Record<string, string>  = { student: N, teacher: ADMIN, admin: '#DC2626' }
const ROLE_LABEL: Record<string, string>  = { student: 'Студент', teacher: 'Преподаватель', admin: 'Администратор' }
const ROLE_ICON:  Record<string, string>  = { student: '🎓', teacher: '👨‍🏫', admin: '🔴' }

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ students: 0, teachers: 0, groups: 0, active_today: 0, total_xp: 0 })
  const [recent, setRecent] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const res = await fetch('/api/english/admin/stats', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      const data = await res.json()
      setStats({
        students:    data.students    ?? 0,
        teachers:    data.teachers    ?? 0,
        groups:      data.groups      ?? 0,
        active_today: data.active_today ?? 0,
        total_xp:    data.total_xp    ?? 0,
      })
      setRecent((data.recent ?? []) as RecentUser[])
      setLoading(false)
    }
    load()
  }, [])

  const STATS = [
    { label: 'Студентов',    value: stats.students,    color: N,       bg: '#EEF2F7', icon: '🎓', href: '/english/zku/admin/students', sub: 'Всего на платформе' },
    { label: 'Преподавателей', value: stats.teachers, color: ADMIN,    bg: '#EDE9FE', icon: '👨‍🏫', href: '/english/zku/admin/teachers', sub: 'Зарегистрировано' },
    { label: 'Групп',        value: stats.groups,     color: T,        bg: '#DCFCE7', icon: '👥', href: '/english/zku/admin/groups',   sub: 'Учебных групп' },
    { label: 'Активны сегодня', value: stats.active_today, color: '#EF4444', bg: '#FEE2E2', icon: '⚡', href: '/english/zku/admin/students', sub: `из ${stats.students} студентов` },
  ]

  const now = new Date()
  function timeAgo(date: string | null) {
    if (!date) return '—'
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 60000)
    if (diff < 1) return 'только что'
    if (diff < 60) return `${diff} мин. назад`
    if (diff < 1440) return `${Math.floor(diff / 60)} ч. назад`
    return `${Math.floor(diff / 1440)} дн. назад`
  }

  if (loading) return (
    <div style={{ padding: '80px 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: '50%', border: `3px solid ${ADMIN}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <div style={{ fontSize: 13, color: MUT, fontWeight: 600 }}>Загружаем данные...</div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1140, margin: '0 auto' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Панель администратора</h1>
        <p style={{ fontSize: 13, color: MUT }}>
          Платформа ЗКУ English · {new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 }}>
        {STATS.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: `1px solid ${BDR}`, boxShadow: '0 1px 6px rgba(0,56,118,0.05)', transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 24px ${s.color}18` }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 6px rgba(0,56,118,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20 }}>{s.icon}</div>
                <span style={{ fontSize: 10, color: MUT }}>→</span>
              </div>
              <div style={{ fontSize: 30, fontWeight: 900, color: s.color, lineHeight: 1, marginBottom: 4 }}>{s.value}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: N }}>{s.label}</div>
              <div style={{ fontSize: 11, color: MUT }}>{s.sub}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 18 }}>

        {/* Recent activity */}
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ padding: '16px 22px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h2 style={{ fontSize: 14, fontWeight: 800, color: N }}>⚡ Последняя активность</h2>
            <Link href="/english/zku/admin/students" style={{ fontSize: 12, color: ADMIN, textDecoration: 'none', fontWeight: 700 }}>Все →</Link>
          </div>
          {recent.map((u, i) => {
            const initial = (u.full_name ?? '?').charAt(0).toUpperCase()
            const rc = ROLE_COLOR[u.role] ?? N
            const ago = timeAgo(u.last_active_at)
            return (
              <div key={u.user_id} style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 22px',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${rc}, ${rc}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14 }}>{initial}</div>
                  <div style={{ position: 'absolute', bottom: 0, right: 0, fontSize: 10 }}>{ROLE_ICON[u.role]}</div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.full_name ?? 'Пользователь'}</div>
                  <div style={{ fontSize: 11, color: MUT }}>
                    <span style={{ color: rc, fontWeight: 700 }}>{ROLE_LABEL[u.role] ?? u.role}</span>
                    {u.role === 'student' && u.current_level && ` · ${u.current_level} · ${(u.total_xp ?? 0).toLocaleString()} XP`}
                  </div>
                </div>
                <div style={{ fontSize: 11, color: ago === 'только что' ? T : MUT, flexShrink: 0, fontWeight: 600 }}>{ago}</div>
              </div>
            )
          })}
        </div>

        {/* Quick stats sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Total XP */}
          <div style={{ background: `linear-gradient(135deg, ${ADMIN}, #9333ea)`, borderRadius: 18, padding: '20px 22px', color: '#fff' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>Всего XP на платформе</div>
            <div style={{ fontSize: 32, fontWeight: 900, marginBottom: 4 }}>{stats.total_xp.toLocaleString()}</div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Заработано всеми студентами</div>
          </div>

          {/* Quick links */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '16px 20px', border: `1px solid ${BDR}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 12 }}>⚡ Быстрые действия</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {[
                { href: '/english/zku/admin/teachers', icon: '👨‍🏫', label: 'Управление преподавателями', color: ADMIN },
                { href: '/english/zku/admin/students', icon: '🎓', label: 'Все студенты', color: N },
                { href: '/english/zku/admin/groups',   icon: '👥', label: 'Управление группами', color: T },
                { href: '/english/zku/teacher',        icon: '📊', label: 'Кабинет преподавателя', color: MUT },
              ].map(item => (
                <Link key={item.href} href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, textDecoration: 'none', background: '#F8FBFF', border: `1px solid ${BDR}`, transition: 'background 0.12s' }}
                  onMouseEnter={e => (e.currentTarget as HTMLElement).style.background = '#EEF2F7'}
                  onMouseLeave={e => (e.currentTarget as HTMLElement).style.background = '#F8FBFF'}>
                  <span style={{ fontSize: 18 }}>{item.icon}</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: item.color }}>{item.label}</span>
                  <span style={{ marginLeft: 'auto', fontSize: 12, color: MUT }}>→</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Platform health */}
          <div style={{ background: '#fff', borderRadius: 18, padding: '16px 20px', border: `1px solid ${BDR}` }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 12 }}>📈 Состояние платформы</div>
            {[
              { label: 'Активны сегодня', value: stats.students > 0 ? Math.round((stats.active_today / stats.students) * 100) : 0, color: T, icon: '⚡', suffix: '%' },
              { label: 'Студентов на группу', value: stats.groups > 0 ? Math.round(stats.students / stats.groups) : 0, color: N, icon: '👥', suffix: ' ср.' },
              { label: 'Ср. XP на студента', value: stats.students > 0 ? Math.round(stats.total_xp / stats.students) : 0, color: G, icon: '✨' },
            ].map(m => (
              <div key={m.label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontSize: 14 }}>{m.icon}</span>
                  <span style={{ fontSize: 12, color: MUT, fontWeight: 600 }}>{m.label}</span>
                </div>
                <span style={{ fontSize: 14, fontWeight: 900, color: m.color }}>{m.value.toLocaleString()}{m.suffix ?? ''}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
