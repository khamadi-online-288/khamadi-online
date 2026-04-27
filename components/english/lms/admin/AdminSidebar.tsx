'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, BookOpen, BarChart3, Award, Megaphone, Settings, Users2, LogOut, Headphones } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const NAV = [
  { href: '/english/admin',              icon: LayoutDashboard, label: 'Главная',        badge: false },
  { href: '/english/admin/users',        icon: Users,           label: 'Пользователи',   badge: true  },
  { href: '/english/admin/groups',       icon: Users2,          label: 'Группы',         badge: false },
  { href: '/english/admin/courses',      icon: BookOpen,        label: 'Курсы',          badge: false },
  { href: '/english/admin/reports',      icon: BarChart3,       label: 'Отчёты',         badge: false },
  { href: '/english/admin/certificates', icon: Award,           label: 'Сертификаты',    badge: false },
  { href: '/english/admin/announcements',icon: Megaphone,       label: 'Объявления',     badge: false },
  { href: '/english/admin/settings',     icon: Settings,        label: 'Настройки',      badge: false },
  { href: '/english/support-agent',      icon: Headphones,      label: 'Support Center', badge: false },
]

export default function AdminSidebar() {
  const path = usePathname()
  const router = useRouter()
  const supabase = createEnglishClient()
  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending')
      .eq('is_english_user', true)
      .then(({ count }) => setPendingCount(count ?? 0))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/english/login')
  }

  return (
    <aside style={{ width: 260, minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <Link href="/english/admin" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>KHAMADI</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>Панель администратора</div>
        </Link>
      </div>
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(item => {
          const active = path === item.href || (item.href !== '/english/admin' && path.startsWith(item.href))
          const badge  = item.badge && pendingCount > 0 ? pendingCount : 0
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 11, background: active ? 'rgba(201,147,59,0.2)' : 'transparent', color: active ? '#C9933B' : 'rgba(255,255,255,0.55)', fontWeight: active ? 800 : 500, fontSize: 13, transition: 'all 0.15s', justifyContent: 'space-between' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                  <item.icon size={17} />
                  {item.label}
                </div>
                {badge > 0 && (
                  <span style={{ minWidth: 20, height: 20, borderRadius: 99, background: '#ef4444', color: '#fff', fontSize: 11, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 5px' }}>
                    {badge > 99 ? '99+' : badge}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 11, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.4)')}>
          <LogOut size={17} /> Выйти
        </button>
      </div>
    </aside>
  )
}
