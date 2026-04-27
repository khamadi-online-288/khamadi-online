'use client'
import { useEffect, useState } from 'react'
import NotificationBell from '@/components/english/lms/shared/NotificationBell'
import { createEnglishClient } from '@/lib/english/supabase-client'

export default function TeacherHeader({ title }: { title?: string }) {
  const [name, setName] = useState('')
  const [avatar, setAvatar] = useState<string | null>(null)
  const supabase = createEnglishClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const { data } = await supabase.from('profiles').select('full_name,avatar_url').eq('id', session.user.id).single()
      setName((data as { full_name?: string; avatar_url?: string | null } | null)?.full_name ?? session.user.email ?? '')
      setAvatar((data as { full_name?: string; avatar_url?: string | null } | null)?.avatar_url ?? null)
    }
    load()
  }, [])

  return (
    <header style={{ height: 62, background: '#fff', borderBottom: '1px solid rgba(27,58,107,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 28px', position: 'sticky', top: 0, zIndex: 50, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ fontSize: 17, fontWeight: 900, color: '#1B3A6B' }}>{title || 'Кабинет преподавателя'}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <NotificationBell />
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 34, height: 34, borderRadius: 11, overflow: 'hidden', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {avatar ? <img src={avatar} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ color: '#fff', fontWeight: 800, fontSize: 13 }}>{name[0]?.toUpperCase() ?? 'П'}</span>}
          </div>
          <div style={{ fontSize: 12 }}>
            <div style={{ fontWeight: 800, color: '#1B3A6B' }}>{name || 'Преподаватель'}</div>
            <div style={{ fontSize: 10, color: '#94a3b8' }}>Преподаватель</div>
          </div>
        </div>
      </div>
    </header>
  )
}
