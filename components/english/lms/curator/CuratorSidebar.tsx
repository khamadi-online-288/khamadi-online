'use client'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, UsersRound, FileText, LogOut } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const NAV = [
  { href: '/english/curator', label: 'Главная', icon: <LayoutDashboard size={16} /> },
  { href: '/english/curator/students', label: 'Студенты', icon: <Users size={16} /> },
  { href: '/english/curator/groups', label: 'Группы', icon: <UsersRound size={16} /> },
  { href: '/english/curator/reports', label: 'Отчёт в деканат', icon: <FileText size={16} /> },
]

export default function CuratorSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createEnglishClient()

  async function logout() {
    await supabase.auth.signOut()
    router.push('/english/login')
  }

  return (
    <div style={{ width: 240, minHeight: '100vh', background: '#1B3A6B', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ padding: '28px 24px 20px' }}>
        <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '0.5px' }}>ENGLISH LMS</div>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', marginTop: 3, fontWeight: 600 }}>Куратор</div>
      </div>
      <nav style={{ flex: 1, padding: '0 12px' }}>
        {NAV.map(n => {
          const active = pathname === n.href || (n.href !== '/english/curator' && pathname.startsWith(n.href))
          return (
            <a key={n.href} href={n.href} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, marginBottom: 2, fontWeight: active ? 800 : 600, fontSize: 13, color: active ? '#fff' : 'rgba(255,255,255,0.65)', background: active ? 'rgba(255,255,255,0.12)' : 'transparent', textDecoration: 'none', transition: 'all 0.15s' }}>
              {n.icon}{n.label}
            </a>
          )
        })}
      </nav>
      <button onClick={logout} style={{ margin: '0 12px 20px', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 12px', borderRadius: 10, background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.6)', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat' }}>
        <LogOut size={15} /> Выйти
      </button>
    </div>
  )
}
