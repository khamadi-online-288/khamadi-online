'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, Users, ClipboardList, Calendar, MessageSquare, Megaphone, GraduationCap, LogOut, FileText } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const NAV = [
  { href: '/english/teacher',              icon: LayoutDashboard, label: 'Главная' },
  { href: '/english/teacher/groups',       icon: Users,           label: 'Мои группы' },
  { href: '/english/teacher/students',     icon: GraduationCap,   label: 'Студенты' },
  { href: '/english/teacher/assignments',  icon: ClipboardList,   label: 'Задания' },
  { href: '/english/teacher/schedule',     icon: Calendar,        label: 'Расписание' },
  { href: '/english/teacher/messages',     icon: MessageSquare,   label: 'Сообщения' },
  { href: '/english/teacher/announcements',icon: Megaphone,       label: 'Объявления' },
  { href: '/english/teacher/syllabus',     icon: FileText,        label: 'Силлабус' },
]

export default function TeacherSidebar() {
  const path = usePathname()
  const router = useRouter()
  const supabase = createEnglishClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/english/login')
  }

  return (
    <aside style={{ width: 260, minHeight: '100vh', background: '#1B3A6B', display: 'flex', flexDirection: 'column', padding: '24px 0', position: 'fixed', left: 0, top: 0, bottom: 0, zIndex: 100, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ padding: '0 24px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <Link href="/english/teacher" style={{ textDecoration: 'none' }}>
          <div style={{ fontSize: 17, fontWeight: 900, color: '#fff' }}>KHAMADI</div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.45)', marginTop: 2 }}>Кабинет преподавателя</div>
        </Link>
      </div>
      <nav style={{ flex: 1, padding: '20px 12px', display: 'flex', flexDirection: 'column', gap: 3 }}>
        {NAV.map(item => {
          const active = path === item.href || (item.href !== '/english/teacher' && path.startsWith(item.href))
          return (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 11, background: active ? 'rgba(255,255,255,0.15)' : 'transparent', color: active ? '#fff' : 'rgba(255,255,255,0.6)', fontWeight: active ? 700 : 500, fontSize: 13, transition: 'all 0.15s' }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'rgba(255,255,255,0.07)' }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent' }}>
                <item.icon size={17} />
                {item.label}
              </div>
            </Link>
          )
        })}
      </nav>
      <div style={{ padding: '14px 12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
        <button onClick={handleLogout} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 11, padding: '10px 14px', borderRadius: 11, border: 'none', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontWeight: 500, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}
          onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.5)')}>
          <LogOut size={17} /> Выйти
        </button>
      </div>
    </aside>
  )
}
