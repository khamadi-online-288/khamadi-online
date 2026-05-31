'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { ZkuLangProvider, ZkuLangSwitcher, useZkuLang } from './zku-lang'

function Icon({ name, size = 15 }: { name: string; size?: number }) {
  const s = { width: size, height: size, display: 'block', flexShrink: 0 }
  const icons: Record<string, React.ReactElement> = {
    home: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9.5L12 3l9 6.5V20a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z"/><path d="M9 21V12h6v9"/>
      </svg>
    ),
    course: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 016.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z"/>
      </svg>
    ),
    vocab: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2"/><path d="M8 21h8M12 17v4"/><path d="M7 7h10M7 11h6"/>
      </svg>
    ),
    progress: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/>
      </svg>
    ),
    placement: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>
      </svg>
    ),
    writing: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
      </svg>
    ),
    certs: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
      </svg>
    ),
    leaderboard: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/>
      </svg>
    ),
    achievements: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
      </svg>
    ),
    user: (
      <svg style={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  }
  return icons[name] ?? null
}

const NAV_KEYS = [
  { href: '/english/zku/student',               key: 'home',         icon: 'home',         exact: true },
  { href: '/english/zku/student/course',         key: 'course',       icon: 'course'        },
  { href: '/english/zku/student/vocab',          key: 'vocab',        icon: 'vocab'         },
  { href: '/english/zku/student/progress',       key: 'progress',     icon: 'progress'      },
  { href: '/english/zku/student/placement',      key: 'placement',    icon: 'placement'     },
  { href: '/english/zku/student/writing-coach',  key: 'writing',      icon: 'writing'       },
  { href: '/english/zku/student/certificates',   key: 'certs',        icon: 'certs'         },
  { href: '/english/zku/student/leaderboard',    key: 'leaderboard',  icon: 'leaderboard'   },
  { href: '/english/zku/student/achievements',   key: 'achievements', icon: 'achievements'  },
] as const

function UserMenu() {
  const [open, setOpen]         = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [xp, setXp]             = useState(0)
  const [streak, setStreak]     = useState(0)
  const [level, setLevel]       = useState('A1')
  const ref                     = useRef<HTMLDivElement>(null)
  const router                  = useRouter()
  const { t }                   = useZkuLang()

  const initial   = fullName ? fullName.charAt(0).toUpperCase() : '?'
  const firstName = fullName ? fullName.split(' ')[0] : '...'

  useEffect(() => {
    // Show cached name immediately to avoid blank flash
    const cached = sessionStorage.getItem('zku-display-name')
    if (cached) setFullName(cached)

    async function load() {
      const supabase = createEnglishClient()
      // Reuse the session already validated by HeaderInner
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      setEmail(user.email ?? '')

      // Single query for all needed profile data
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('full_name, current_level, total_xp, current_streak')
        .eq('user_id', user.id)
        .maybeSingle()

      const meta = user.user_metadata
      const metaName: string = meta?.full_name ?? meta?.name ?? ''
      const emailSlug = user.email?.split('@')[0] ?? ''
      const resolveName = (dbName: string | null) => {
        if (metaName && metaName !== emailSlug) return metaName
        if (dbName && dbName !== emailSlug) return dbName
        return metaName || dbName || emailSlug
      }

      const resolved = profile ? resolveName(profile.full_name) : resolveName(null)
      setFullName(resolved)
      if (resolved) sessionStorage.setItem('zku-display-name', resolved)

      if (profile) {
        setLevel(profile.current_level ?? 'A1')
        setXp(profile.total_xp ?? 0)
        setStreak(profile.current_streak ?? 0)
      }
    }
    load()
  }, [])

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    function onProfileUpdated(e: Event) {
      const { fullName: name } = (e as CustomEvent<{ fullName: string }>).detail
      setFullName(name)
      if (name) sessionStorage.setItem('zku-display-name', name)
    }
    window.addEventListener('zku-profile-updated', onProfileUpdated)
    return () => window.removeEventListener('zku-profile-updated', onProfileUpdated)
  }, [])

  async function handleLogout() {
    setOpen(false)
    const supabase = createEnglishClient()
    await supabase.auth.signOut()
    router.push('/english/zku/login')
  }

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{
        display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
        background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 12, padding: '6px 12px 6px 6px', fontFamily: 'inherit', transition: 'all 0.15s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}>
        <div style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B8FC4, #003876)',
          border: '2px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0,
        }}>{initial}</div>
        <div style={{ textAlign: 'left' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{firstName}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{level} · {streak} · {xp.toLocaleString()} XP</div>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginLeft: 2, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
      </button>

      {open && (
        <div style={{
          position: 'absolute', right: 0, top: 'calc(100% + 8px)',
          background: '#fff', borderRadius: 16,
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)', border: '1px solid rgba(0,56,118,0.08)',
          minWidth: 230, zIndex: 200, overflow: 'hidden',
          animation: 'fadeSlideDown 0.15s ease',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 16px 12px', borderBottom: '1px solid #F1F5F9' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 40, height: 40, borderRadius: '50%',
                background: 'linear-gradient(135deg, #1B8FC4, #003876)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontWeight: 800, fontSize: 16,
              }}>{initial}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1E293B' }}>{fullName || '—'}</div>
                <div style={{ fontSize: 11, color: '#94A3B8' }}>{email}</div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
              {[
                { label: level, color: '#1D9E75', bg: '#DCFCE7' },
                { label: `${streak} streak`, color: '#EF4444', bg: '#FEE2E2' },
                { label: `${xp.toLocaleString()} XP`, color: '#C9933B', bg: '#FEF3C7' },
              ].map(b => (
                <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: b.bg, color: b.color }}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* Menu links */}
          <div style={{ padding: '6px' }}>
            {[
              { href: '/english/zku/student/profile',     icon: 'user',   label: t.user.profile },
              { href: '/english/zku/student/certificates', icon: 'certs',  label: t.user.certs },
              { href: '/english/zku/student/achievements', icon: 'achievements', label: t.user.achievements },
            ].map(item => (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10, textDecoration: 'none',
                color: '#334155', fontSize: 13, fontWeight: 600, transition: 'background 0.12s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#F8FBFF')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                <span style={{ color: '#64748B' }}><Icon name={item.icon} size={16} /></span>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Logout */}
          <div style={{ padding: '6px', borderTop: '1px solid #F1F5F9' }}>
            <button onClick={handleLogout} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 12px', borderRadius: 10, border: 'none', cursor: 'pointer',
              background: 'transparent', color: '#EF4444',
              fontSize: 13, fontWeight: 600, fontFamily: 'inherit', transition: 'background 0.12s',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = '#FEE2E2')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
              <span style={{ color: '#EF4444' }}>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
              </span>
              {t.user.logout}
            </button>
          </div>
        </div>
      )}

      <style>{`@keyframes fadeSlideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  )
}

function HeaderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { t }    = useZkuLang()
  const router   = useRouter()
  // Auth: check sessionStorage first to avoid Supabase round-trip on every navigation
  const [authChecked, setAuthChecked] = useState(() => {
    if (typeof window === 'undefined') return false
    return sessionStorage.getItem('zku-auth-ok') === '1'
  })

  useEffect(() => {
    if (authChecked) return // already verified this session
    async function checkAuth() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        sessionStorage.removeItem('zku-auth-ok')
        router.replace('/english/zku/login')
        return
      }
      sessionStorage.setItem('zku-auth-ok', '1')
      setAuthChecked(true)
    }
    checkAuth()
  }, [router, authChecked])

  // Also listen for sign-out to clear cache
  useEffect(() => {
    const supabase = createEnglishClient()
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: string) => {
      if (event === 'SIGNED_OUT') {
        sessionStorage.removeItem('zku-auth-ok')
        router.replace('/english/zku/login')
      }
    })
    return () => subscription.unsubscribe()
  }, [router])

  if (!authChecked) return null // loading.tsx shows skeleton

  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
      <header style={{ background: '#003876', position: 'sticky', top: 0, zIndex: 100, boxShadow: '0 2px 16px rgba(0,0,0,0.18)' }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/english/zku" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 10 }}>{t.layout.logo}</div>
            <div>
              <div style={{ color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.15 }}>{t.layout.title}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{t.layout.subtitle}</div>
            </div>
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ZkuLangSwitcher />
            <UserMenu />
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: 'flex', padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV_KEYS.map(link => {
            const active = ('exact' in link && link.exact) ? pathname === link.href : pathname.startsWith(link.href)
            const label  = t.nav[link.key as keyof typeof t.nav]
            return (
              <Link key={link.href} href={link.href} style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '10px 14px',
                fontSize: 12, fontWeight: active ? 700 : 400,
                color: active ? '#fff' : 'rgba(255,255,255,0.45)',
                textDecoration: 'none', whiteSpace: 'nowrap',
                borderBottom: `2px solid ${active ? '#C9933B' : 'transparent'}`,
                transition: 'all 0.15s',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.8)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}>
                <Icon name={link.icon} size={14} />
                {label}
              </Link>
            )
          })}
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}

export default function ZKUStudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <ZkuLangProvider>
      <HeaderInner>{children}</HeaderInner>
    </ZkuLangProvider>
  )
}