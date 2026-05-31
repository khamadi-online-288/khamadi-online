'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const G = '#C9933B'
const T = '#1D9E75'
const ADMIN = '#7C3AED'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface RecentUser {
  user_id: string
  full_name: string | null
  role: string
  current_level: string | null
  total_xp: number | null
  last_active_at: string | null
}

export default function AdminDashboard() {
  const [stats, setStats]   = useState({ students: 0, teachers: 0, groups: 0, active_today: 0 })
  const [recent, setRecent] = useState<RecentUser[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()

      // Count by role for ZKU (tenant_id filter)
      const [{ count: students }, { count: teachers }, { count: groups }] = await Promise.all([
        supabase.from('english_user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'student'),
        supabase.from('english_user_profiles').select('*', { count: 'exact', head: true }).eq('role', 'teacher'),
        supabase.from('english_groups').select('*', { count: 'exact', head: true }),
      ])

      // Active today
      const today = new Date().toISOString().split('T')[0]
      const { count: active } = await supabase
        .from('english_user_profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'student')
        .gte('last_active_at', today)

      setStats({
        students: students ?? 0,
        teachers: teachers ?? 0,
        groups:   groups ?? 0,
        active_today: active ?? 0,
      })

      // Recent users
      const { data } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name, role, current_level, total_xp, last_active_at')
        .order('last_active_at', { ascending: false })
        .limit(8)

      setRecent((data ?? []) as RecentUser[])
      setLoading(false)
    }
    load()
  }, [])

  const STATS = [
    { label: 'Студентов', value: stats.students,    color: N,     bg: '#EEF2F7', icon: '🎓', href: '/english/zku/admin/students' },
    { label: 'Преподавателей', value: stats.teachers, color: ADMIN, bg: '#EDE9FE', icon: '👨‍🏫', href: '/english/zku/admin/teachers' },
    { label: 'Групп',     value: stats.groups,     color: T,     bg: '#DCFCE7', icon: '👥', href: '/english/zku/admin/groups' },
    { label: 'Активны сегодня', value: stats.active_today, color: G, bg: '#FEF3C7', icon: '⚡', href: '/english/zku/admin/students' },
  ]

  const ROLE_COLOR: Record<string, string> = { student: N, teacher: ADMIN, admin: '#DC2626' }
  const ROLE_LABEL: Record<string, string> = { student: 'Студент', teacher: 'Преподаватель', admin: 'Администратор' }

  if (loading) return (
    <div style={{ padding: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', border: `3px solid ${ADMIN}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 12, color: MUT, fontWeight: 600, marginBottom: 4 }}>Панель администратора</div>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 4 }}>Обзор платформы ЗКУ English</h1>
        <p style={{ fontSize: 13, color: MUT }}>Управление студентами, преподавателями и группами</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 28 }}>
        {STATS.map(s => (
          <Link key={s.label} href={s.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: 16, padding: '18px 20px',
              border: `1px solid ${BDR}`, boxShadow: '0 1px 8px rgba(0,56,118,0.05)',
              transition: 'transform 0.15s, box-shadow 0.15s', cursor: 'pointer',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 6px 20px ${s.color}18` }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none'; (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 8px rgba(0,56,118,0.05)' }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, marginBottom: 12 }}>{s.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: MUT, marginTop: 4 }}>{s.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {/* Recent activity */}
      <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
        <div style={{ padding: '18px 24px', borderBottom: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: 15, fontWeight: 800, color: N }}>Последние активные пользователи</h2>
          <Link href="/english/zku/admin/students" style={{ fontSize: 12, color: N, textDecoration: 'none', fontWeight: 600 }}>Все →</Link>
        </div>

        {recent.map((u, i) => {
          const initial = (u.full_name ?? '?').charAt(0).toUpperCase()
          const roleColor = ROLE_COLOR[u.role] ?? N
          const lastActive = u.last_active_at
            ? new Date(u.last_active_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : '—'
          return (
            <div key={u.user_id} style={{
              display: 'flex', alignItems: 'center', gap: 14, padding: '14px 24px',
              borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
              background: i % 2 === 0 ? '#fff' : '#FAFCFF',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg, ${roleColor}, ${roleColor}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 14, flexShrink: 0 }}>{initial}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{u.full_name ?? 'Пользователь'}</div>
                <div style={{ fontSize: 11, color: MUT }}>
                  <span style={{ color: roleColor, fontWeight: 700 }}>{ROLE_LABEL[u.role] ?? u.role}</span>
                  {u.role === 'student' && ` · ${u.current_level ?? 'A1'} · ${u.total_xp ?? 0} XP`}
                </div>
              </div>
              <div style={{ fontSize: 11, color: MUT, flexShrink: 0 }}>{lastActive}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
