'use client'
import { useEffect, useState } from 'react'
import NotificationBell from '@/components/english/lms/shared/NotificationBell'
import { createEnglishClient } from '@/lib/english/supabase-client'

export default function AdminHeader({ title }: { title?: string }) {
  const [name, setName] = useState('')
  const supabase = createEnglishClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('profiles').select('full_name').eq('id', session.user.id).single()
      setName((data as { full_name?: string } | null)?.full_name ?? session.user.email ?? '')
    }
    load()
  }, [])

  return (
    <header style={{ height: 62, background: '#fff', borderBottom: '1px solid rgba(27,58,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ fontSize: 17, fontWeight: 900, color: '#0f172a' }}>{title || 'Панель администратора'}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NotificationBell />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#C9933B', fontWeight: 900, fontSize: 13 }}>{name[0]?.toUpperCase() ?? 'А'}</span>
          </div>
          <div style={{ fontSize: 12 }}>
            <div style={{ fontWeight: 800, color: '#0f172a' }}>{name || 'Администратор'}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Администратор</div>
          </div>
        </div>
      </div>
    </header>
  )
}
