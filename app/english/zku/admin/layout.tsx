'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

const ADMIN = '#7C3AED'
const G = '#C9933B'

const NAV = [
  { href: '/english/zku/admin',           label: 'Дашборд',      icon: '📊', exact: true },
  { href: '/english/zku/admin/teachers',  label: 'Преподаватели', icon: '👨‍🏫' },
  { href: '/english/zku/admin/students',  label: 'Студенты',     icon: '🎓' },
  { href: '/english/zku/admin/groups',    label: 'Группы',       icon: '👥' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const [name,  setName]  = useState('')
  const [email, setEmail] = useState('')
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const cached = sessionStorage.getItem('zku-admin-name')
    if (cached) setName(cached)
    async function check() {
      try {
        const supabase = createEnglishClient()
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error || !session) { router.replace('/english/zku/login'); return }
        const { error: re } = await supabase.auth.refreshSession()
        if (re) { sessionStorage.removeItem('zku-admin-name'); await supabase.auth.signOut(); router.replace('/english/zku/login'); return }
        const { data: profile } = await supabase
        .from('english_user_profiles').select('role, full_name')
        .eq('user_id', session.user.id).maybeSingle()
      if (!profile || profile.role !== 'admin') {
        router.replace('/english/zku/login'); return
      }
      const n = profile.full_name ?? session.user.email ?? ''
        setName(n); setEmail(session.user.email ?? '')
        sessionStorage.setItem('zku-admin-name', n)
        setReady(true)
      } catch { sessionStorage.removeItem('zku-admin-name'); router.replace('/english/zku/login') }
    }
    check()
  }, [router])

  if (!ready) return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#F0F4FA', fontFamily:"'Montserrat',sans-serif" }}>
      <div style={{ textAlign:'center' }}>
        <div style={{ width:40, height:40, borderRadius:'50%', border:`3px solid ${ADMIN}`, borderTopColor:'transparent', animation:'spin 0.7s linear infinite', margin:'0 auto 12px' }} />
        <div style={{ fontSize:13, color:'#64748B', fontWeight:600 }}>Загрузка...</div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  const initial = name.charAt(0).toUpperCase() || '?'
  const firstName = name.split(' ')[0]
  const currentPage = NAV.find(n => n.exact ? pathname === n.href : pathname.startsWith(n.href))

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Montserrat',sans-serif", background:'#F0F4FA' }}>

      {/* Sidebar */}
      <aside style={{
        width:250, flexShrink:0,
        background:`linear-gradient(180deg, #1a0050 0%, ${ADMIN} 100%)`,
        display:'flex', flexDirection:'column',
        position:'sticky', top:0, height:'100vh',
        boxShadow:'4px 0 20px rgba(124,58,237,0.22)',
      }}>
        {/* Logo */}
        <div style={{ padding:'22px 18px 16px', borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:38, height:38, borderRadius:12, background:`linear-gradient(135deg, ${G}, #e8a020)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13 }}>ЗКУ</div>
            <div>
              <div style={{ color:'#fff', fontWeight:800, fontSize:14, lineHeight:1.2 }}>ЗКУ English</div>
              <div style={{ color:'rgba(255,255,255,0.4)', fontSize:10, fontWeight:600 }}>Администратор</div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', overflowY:'auto' }}>
          <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.14em', padding:'10px 12px 5px' }}>Управление</div>
          {NAV.map(item => {
            const active = item.exact ? pathname === item.href : pathname.startsWith(item.href)
            return (
              <Link key={item.href} href={item.href} style={{
                display:'flex', alignItems:'center', gap:10,
                padding:'11px 12px', borderRadius:12, marginBottom:2,
                textDecoration:'none', transition:'all 0.15s',
                background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                color: active ? '#fff' : 'rgba(255,255,255,0.52)',
                fontWeight: active ? 700 : 500, fontSize:13,
                boxShadow: active ? 'inset 0 0 0 1px rgba(255,255,255,0.1)' : 'none',
              }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.09)' }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
                <span style={{ fontSize:18, width:24, textAlign:'center', flexShrink:0 }}>{item.icon}</span>
                {item.label}
                {active && <div style={{ marginLeft:'auto', width:6, height:6, borderRadius:'50%', background:G, flexShrink:0 }} />}
              </Link>
            )
          })}

          {/* Divider + Teacher view */}
          <div style={{ margin:'12px 0', borderTop:'1px solid rgba(255,255,255,0.08)' }} />
          <div style={{ fontSize:9, fontWeight:700, color:'rgba(255,255,255,0.28)', textTransform:'uppercase', letterSpacing:'0.14em', padding:'4px 12px 5px' }}>Другие кабинеты</div>
          <Link href="/english/zku/teacher" style={{ display:'flex', alignItems:'center', gap:10, padding:'10px 12px', borderRadius:12, textDecoration:'none', color:'rgba(255,255,255,0.45)', fontSize:12, fontWeight:600 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#fff'; (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.07)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)'; (e.currentTarget as HTMLElement).style.background = 'transparent' }}>
            <span style={{ fontSize:16 }}>👨‍🏫</span> Кабинет преподавателя
          </Link>
        </nav>

        {/* User */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ padding:'12px', borderRadius:14, background:'rgba(255,255,255,0.07)', marginBottom:8 }}>
            <div style={{ display:'flex', alignItems:'center', gap:10 }}>
              <div style={{ width:36, height:36, borderRadius:'50%', background:`linear-gradient(135deg, ${G}, #e8a020)`, display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:15, flexShrink:0 }}>{initial}</div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ color:'#fff', fontWeight:700, fontSize:12, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{firstName}</div>
                <div style={{ color:'rgba(255,255,255,0.38)', fontSize:10, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{email}</div>
              </div>
              <div style={{ fontSize:9, fontWeight:800, color:'rgba(255,255,255,0.6)', background:'rgba(255,255,255,0.12)', padding:'3px 7px', borderRadius:99, flexShrink:0 }}>ADMIN</div>
            </div>
          </div>
          <button onClick={async () => { const s = createEnglishClient(); sessionStorage.removeItem('zku-admin-name'); await s.auth.signOut(); router.push('/english/zku/login') }}
            style={{ width:'100%', padding:'9px', borderRadius:10, border:'1px solid rgba(255,255,255,0.12)', background:'transparent', color:'rgba(255,255,255,0.45)', fontSize:12, cursor:'pointer', fontFamily:'inherit', fontWeight:600 }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.08)'; (e.currentTarget as HTMLElement).style.color = '#fff' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.45)' }}>
            Выйти из аккаунта
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>
        <header style={{ background:'#fff', borderBottom:'1px solid rgba(0,56,118,0.07)', padding:'0 28px', height:58, display:'flex', alignItems:'center', justifyContent:'space-between', position:'sticky', top:0, zIndex:40, boxShadow:'0 1px 6px rgba(0,56,118,0.05)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <span style={{ fontSize:20 }}>{currentPage?.icon}</span>
            <span style={{ fontSize:15, fontWeight:800, color:'#1a0050' }}>{currentPage?.label ?? 'Панель'}</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ fontSize:11, fontWeight:800, color:ADMIN, background:'#EDE9FE', padding:'4px 10px', borderRadius:99 }}>Администратор</div>
            <div style={{ fontSize:13, color:'#64748B', fontWeight:600 }}>{firstName}</div>
          </div>
        </header>
        <main style={{ flex:1, overflow:'auto' }}>{children}</main>
      </div>
    </div>
  )
}
