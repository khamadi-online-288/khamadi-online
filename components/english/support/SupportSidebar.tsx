'use client'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Ticket, MessageSquare, HelpCircle, Activity, LogOut, Headphones } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const NAV = [
  { href: '/english/support-agent',           icon: LayoutDashboard, label: 'Дашборд',          badge: false },
  { href: '/english/support-agent/tickets',   icon: Ticket,          label: 'Тикеты',            badge: true  },
  { href: '/english/support-agent/faq',       icon: HelpCircle,      label: 'FAQ',               badge: false },
  { href: '/english/support-agent/templates', icon: MessageSquare,   label: 'Шаблоны',           badge: false },
  { href: '/english/support-agent/status',    icon: Activity,        label: 'Статус платформы',  badge: false },
]

type Props = { role: string; fullName: string }

export default function SupportSidebar({ role, fullName }: Props) {
  const path    = usePathname()
  const router  = useRouter()
  const supabase = createEnglishClient()
  const [openCount, setOpenCount] = useState(0)

  useEffect(() => {
    supabase
      .from('english_support_tickets')
      .select('id', { count: 'exact', head: true })
      .in('status', ['open', 'in_progress'])
      .then(({ count }) => setOpenCount(count ?? 0))
  }, [])

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/english/login')
  }

  return (
    <aside style={{ width: 280, minHeight: '100vh', background: '#141E2A', display: 'flex', flexDirection: 'column', position: 'fixed', left: 0, top: 0, bottom: 0, borderRight: '1px solid rgba(255,255,255,0.06)', zIndex: 100 }}>
      {/* Logo */}
      <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'linear-gradient(135deg,#1B8FC4,#C9933B)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Headphones size={20} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>Support Center</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>KHAMADI ENGLISH</div>
          </div>
        </div>
      </div>

      {/* Agent info */}
      <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'rgba(27,143,196,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: '#1B8FC4', flexShrink: 0 }}>
            {fullName?.[0]?.toUpperCase() ?? 'S'}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{fullName || 'Support Agent'}</div>
            <div style={{ fontSize: 11, color: '#1B8FC4', fontWeight: 600 }}>{role === 'admin' ? 'Администратор' : 'Агент поддержки'}</div>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 6px #10b981', flexShrink: 0 }} />
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '14px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {NAV.map(item => {
          const active = path === item.href || (item.href !== '/english/support-agent' && path.startsWith(item.href))
          const badge  = item.badge && openCount > 0 ? openCount : 0
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, background: active ? 'rgba(27,143,196,0.15)' : 'transparent', color: active ? '#1B8FC4' : 'rgba(255,255,255,0.5)', fontWeight: active ? 700 : 500, fontSize: 14, borderLeft: `2px solid ${active ? '#1B8FC4' : 'transparent'}`, transition: 'all 0.15s', justifyContent: 'space-between' }}
                onMouseEnter={e => { if (!active)(e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.05)' }}
                onMouseLeave={e => { if (!active)(e.currentTarget as HTMLDivElement).style.background = 'transparent' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <item.icon size={18} />
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

      {/* Logout */}
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 10, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontWeight: 500, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat' }}>
          <LogOut size={18} />
          Выйти
        </button>
      </div>
    </aside>
  )
}
