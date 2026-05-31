'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const G = '#C9933B'

const NAV = [
  { href: '/english/zku/teacher',          label: 'Дашборд',   icon: '📊', exact: true },
  { href: '/english/zku/teacher/groups',   label: 'Группы',    icon: '👥' },
  { href: '/english/zku/teacher/students', label: 'Студенты',  icon: '🎓' },
]

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    async function check() {
      try {
        const supabase = createEnglishClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) { router.replace('/english/zku/login'); return }
        const { error: re } = await supabase.auth.refreshSession()
        if (re) { sessionStorage.removeItem('zku-teacher-name'); await supabase.auth.signOut(); router.replace('/english/zku/login'); return }
        const { data: profile } = await supabase
          .from('english_user_profiles').select('role, full_name')
          .eq('user_id', session.user.id).maybeSingle()
        if (!profile || (profile.role !== 'teacher' && profile.role !== 'admin')) {
          router.replace('/english/zku/login'); return
        }
        const n = profile.full_name ?? session.user.email ?? ''
        setName(n); setEmail(session.user.email ?? '')
        sessionStorage.setItem('zku-teacher-name', n)
        setReady(true)
      } catch { sessionStorage.removeItem('zku-teacher-name'); router.replace('/english/zku/login') }
    }
    check()
  }, [router])

  if (!ready) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Montserrat', sans-serif", background: '#F0F4FA' }}>

      {/* Sidebar */}
      <aside style={{
        width: 240, flexShrink: 0, background: N,
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        {/* Logo */}
        <div style={{ padding: '24px 20px 20px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 12 }}>ЗКУ</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 13, lineHeight: 1.2 }}>ЗКУ English</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Кабинет преподавателя</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px' }}>
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, marginBottom: 4,
                textDecoration: 'none', transition: 'all 0.15s',
                background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.6)',
                fontWeight: active ? 700 : 500, fontSize: 13,
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <span style={{ fontSize: 16 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* User */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: G, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>
              {name.charAt(0).toUpperCase()}
            </div>
            <div>
              <div style={{ color: '#fff', fontWeight: 700, fontSize: 12, lineHeight: 1.2 }}>{name.trim().split(' ')[1] ?? name.trim().split(' ')[0]}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 10 }}>Преподаватель</div>
            </div>
          </div>
          <button
            onClick={async () => {
              const supabase = createEnglishClient()
              await supabase.auth.signOut()
              router.push('/english/zku/login')
            }}
            style={{ width: '100%', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: 'rgba(255,255,255,0.6)', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>
            Выйти
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
