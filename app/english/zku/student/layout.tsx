'use client'

import React, { useState, useEffect } from 'react'
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

const BOTTOM_TABS = [
  { href: '/english/zku/student',         key: 'home',     icon: 'home',     exact: true },
  { href: '/english/zku/student/course',   key: 'course',   icon: 'course' },
  { href: '/english/zku/student/vocab',    key: 'vocab',    icon: 'vocab' },
  { href: '/english/zku/student/progress', key: 'progress', icon: 'progress' },
] as const

const MORE_LINKS = [
  { href: '/english/zku/student/placement',     key: 'placement',    icon: 'placement' },
  { href: '/english/zku/student/writing-coach', key: 'writing',      icon: 'writing' },
  { href: '/english/zku/student/certificates',  key: 'certs',        icon: 'certs' },
  { href: '/english/zku/student/leaderboard',   key: 'leaderboard',  icon: 'leaderboard' },
  { href: '/english/zku/student/achievements',  key: 'achievements', icon: 'achievements' },
  { href: '/english/zku/student/profile',       key: 'profile',      icon: 'user' },
] as const

function isNavActive(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href
  return pathname.startsWith(href)
}

function UserMenu() {
  const [open, setOpen]         = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail]       = useState('')
  const [xp, setXp]             = useState(0)
  const [streak, setStreak]     = useState(0)
  const [level, setLevel]       = useState('A1')
  const router                  = useRouter()
  const { t }                   = useZkuLang()
  const pathname                = usePathname()

  const initial   = fullName ? fullName.charAt(0).toUpperCase() : '?'
  // Kazakh/Russian format: "Фамилия Имя" — second word is the given name
  const firstName = fullName ? (fullName.trim().split(' ')[1] ?? fullName.trim().split(' ')[0]) : '...'

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
    function onProfileUpdated(e: Event) {
      const { fullName: name } = (e as CustomEvent<{ fullName: string }>).detail
      setFullName(name)
      if (name) sessionStorage.setItem('zku-display-name', name)
    }
    window.addEventListener('zku-profile-updated', onProfileUpdated)
    return () => window.removeEventListener('zku-profile-updated', onProfileUpdated)
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prev
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  async function handleLogout() {
    setOpen(false)
    const supabase = createEnglishClient()
    await supabase.auth.signOut()
    router.push('/english/zku/login')
  }

  const menuItems = [
    { href: '/english/zku/student/profile',      icon: 'user',         label: t.user.profile },
    { href: '/english/zku/student/certificates',  icon: 'certs',        label: t.user.certs },
    { href: '/english/zku/student/achievements',  icon: 'achievements', label: t.user.achievements },
  ] as const

  return (
    <>
      {/* Desktop: avatar chip. Mobile: burger (CSS). */}
      <button
        type="button"
        className="zku-user-btn"
        onClick={() => setOpen(o => !o)}
        aria-label={t.user.profile}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer',
          background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 12, padding: '6px 12px 6px 6px', fontFamily: 'inherit', transition: 'all 0.15s',
          minHeight: 44,
        }}
      >
        <span className="zku-burger" aria-hidden>
          <span /><span /><span />
        </span>
        <div className="zku-user-avatar" style={{
          width: 32, height: 32, borderRadius: '50%',
          background: 'linear-gradient(135deg, #1B8FC4, #003876)',
          border: '2px solid rgba(255,255,255,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0,
        }}>{initial}</div>
        <div className="zku-user-meta">
          <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', lineHeight: 1.2 }}>{firstName}</div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.45)' }}>{level} · {streak} · {xp.toLocaleString()} XP</div>
        </div>
      </button>

      {open && (
        <>
          <div className="zku-drawer-backdrop" onClick={() => setOpen(false)} aria-hidden />
          <aside className="zku-drawer-right" role="dialog" aria-label={t.user.profile}>
            <div className="zku-drawer-head">
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0, flex: 1 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: '50%', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1B8FC4, #003876)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontWeight: 800, fontSize: 18,
                }}>{initial}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0f172a', lineHeight: 1.25, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {fullName || '—'}
                  </div>
                  <div style={{ fontSize: 12, color: '#94A3B8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{email}</div>
                </div>
              </div>
              <button
                type="button"
                className="zku-drawer-close"
                onClick={() => setOpen(false)}
                aria-label={t.common.back}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden>
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div style={{ display: 'flex', gap: 6, padding: '0 20px 16px', flexWrap: 'wrap' }}>
              {[
                { label: level, color: '#1D9E75', bg: '#DCFCE7' },
                { label: `${streak} streak`, color: '#EF4444', bg: '#FEE2E2' },
                { label: `${xp.toLocaleString()} XP`, color: '#C9933B', bg: '#FEF3C7' },
              ].map(b => (
                <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 99, background: b.bg, color: b.color }}>{b.label}</span>
              ))}
            </div>

            <div className="zku-drawer-lang">
              <div className="zku-drawer-lang-label">{t.user.language}</div>
              <ZkuLangSwitcher variant="light" />
            </div>

            <div style={{ padding: '8px 12px', borderTop: '1px solid #F1F5F9', flex: 1 }}>
              {menuItems.map(item => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 12px', borderRadius: 12, textDecoration: 'none',
                    color: '#334155', fontSize: 14, fontWeight: 600, minHeight: 48,
                  }}
                >
                  <span style={{ color: '#64748B' }}><Icon name={item.icon} size={18} /></span>
                  {item.label}
                </Link>
              ))}
            </div>

            <div style={{ padding: '8px 12px max(12px, var(--zku-safe-bottom, 12px))', borderTop: '1px solid #F1F5F9' }}>
              <button
                type="button"
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 12px', borderRadius: 12, border: 'none', cursor: 'pointer',
                  background: 'transparent', color: '#EF4444',
                  fontSize: 14, fontWeight: 600, fontFamily: 'inherit', minHeight: 48,
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {t.user.logout}
              </button>
            </div>
          </aside>
        </>
      )}
    </>
  )
}

function HeaderInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { t }    = useZkuLang()
  const router   = useRouter()
  const [authChecked, setAuthChecked] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const isLesson = pathname.includes('/lesson/')

  const moreActive = MORE_LINKS.some(link =>
    link.key === 'profile'
      ? pathname.startsWith(link.href)
      : isNavActive(pathname, link.href)
  )

  useEffect(() => {
    async function checkAuth() {
      try {
        const supabase = createEnglishClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) {
          sessionStorage.removeItem('zku-auth-ok')
          router.replace('/english/zku/login')
          return
        }
        const { error: refreshError } = await supabase.auth.refreshSession()
        if (refreshError) {
          sessionStorage.removeItem('zku-auth-ok')
          await supabase.auth.signOut()
          router.replace('/english/zku/login')
          return
        }
        sessionStorage.setItem('zku-auth-ok', '1')
        setAuthChecked(true)
      } catch {
        sessionStorage.removeItem('zku-auth-ok')
        router.replace('/english/zku/login')
      }
    }
    checkAuth()
  }, [router])

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

  useEffect(() => {
    setMoreOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!moreOpen) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [moreOpen])

  if (!authChecked) return null

  async function handleLogoutFromMore() {
    setMoreOpen(false)
    const supabase = createEnglishClient()
    await supabase.auth.signOut()
    router.push('/english/zku/login')
  }

  const shellClass = [
    'zku-student-shell',
    'zku-full-h',
    isLesson ? 'zku-student-shell--lesson' : '',
  ].filter(Boolean).join(' ')

  return (
    <div className={shellClass} style={{ minHeight: '100dvh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
      <header className="zku-student-header">
        <div className="zku-student-header-row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 28px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/english/zku/student" className="zku-student-brand" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', minHeight: 44 }}>
            <div className="zku-student-brand-mark" style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', border: '1.5px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 10, flexShrink: 0 }}>{t.layout.logo}</div>
            <div className="zku-student-brand-text" style={{ minWidth: 0 }}>
              <div className="zku-student-brand-title" style={{ color: '#fff', fontWeight: 800, fontSize: 14, lineHeight: 1.15 }}>{t.layout.title}</div>
              <div className="zku-student-subtitle" style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10 }}>{t.layout.subtitle}</div>
            </div>
          </Link>
          <div className="zku-student-header-actions" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <UserMenu />
          </div>
        </div>

        <nav className="zku-student-desktop-nav" style={{ display: 'flex', padding: '0 20px', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {NAV_KEYS.map(link => {
            const active = isNavActive(pathname, link.href, 'exact' in link && link.exact)
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

      <main className={isLesson ? undefined : 'zku-main-with-tabs'}>{children}</main>

      <nav className="zku-bottom-tabs" aria-label="Student navigation">
        {BOTTOM_TABS.map(tab => {
          const active = isNavActive(pathname, tab.href, 'exact' in tab && tab.exact)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`zku-bottom-tab${active ? ' zku-bottom-tab--active' : ''}`}
            >
              <Icon name={tab.icon} size={20} />
              <span>{t.nav[tab.key]}</span>
            </Link>
          )
        })}
        <button
          type="button"
          className={`zku-bottom-tab${moreActive || moreOpen ? ' zku-bottom-tab--active' : ''}`}
          onClick={() => setMoreOpen(true)}
          aria-expanded={moreOpen}
        >
          <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <circle cx="5" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
            <circle cx="19" cy="12" r="1.5" fill="currentColor" stroke="none" />
          </svg>
          <span>{t.nav.more}</span>
        </button>
      </nav>

      {moreOpen && (
        <>
          <div className="zku-more-sheet-backdrop" onClick={() => setMoreOpen(false)} aria-hidden />
          <div className="zku-more-sheet" role="dialog" aria-label={t.nav.more}>
            <div className="zku-more-sheet-handle" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {MORE_LINKS.map(link => {
                const label = link.key === 'profile'
                  ? t.user.profile
                  : t.nav[link.key as keyof typeof t.nav]
                const active = link.key === 'profile'
                  ? pathname.startsWith(link.href)
                  : isNavActive(pathname, link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMoreOpen(false)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12,
                      padding: '14px 12px', borderRadius: 12, textDecoration: 'none',
                      minHeight: 48,
                      background: active ? 'rgba(0,56,118,0.06)' : 'transparent',
                      color: active ? '#003876' : '#334155',
                      fontSize: 14, fontWeight: active ? 700 : 600,
                    }}
                  >
                    <span style={{ color: active ? '#003876' : '#64748B' }}>
                      <Icon name={link.icon} size={18} />
                    </span>
                    {label}
                  </Link>
                )
              })}
              <button
                type="button"
                onClick={handleLogoutFromMore}
                style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '14px 12px', borderRadius: 12, border: 'none',
                  background: 'transparent', cursor: 'pointer',
                  color: '#EF4444', fontSize: 14, fontWeight: 600,
                  fontFamily: 'inherit', minHeight: 48, textAlign: 'left',
                }}
              >
                <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                  <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                </svg>
                {t.user.logout}
              </button>
            </div>
          </div>
        </>
      )}
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