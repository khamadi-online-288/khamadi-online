'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Notification = {
  id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/english/login'); return }

      const { data, error } = await supabase
        .from('english_notifications')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false })

      if (!error) setNotifications((data || []) as Notification[])

      // Mark all as read
      await supabase
        .from('english_notifications')
        .update({ is_read: true })
        .eq('user_id', session.user.id)
        .eq('is_read', false)

      setLoading(false)
    }
    load()
  }, [router])

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main, Montserrat, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22 }}
          >←</button>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>🔔 Уведомления</span>
        </div>
      </div>

      <div style={{ maxWidth: 700, margin: '0 auto', padding: '28px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>Загружаем уведомления...</div>
        ) : notifications.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔕</div>
            <div style={{ color: '#64748b', fontSize: 16, fontWeight: 700 }}>Нет уведомлений</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>Здесь будут появляться важные обновления</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {notifications.map((n) => (
              <div
                key={n.id}
                style={{
                  background: '#fff',
                  borderRadius: 16,
                  padding: '18px 20px',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
                  border: `1.5px solid ${n.is_read ? '#f1f5f9' : 'rgba(14,165,233,0.25)'}`,
                  display: 'flex',
                  gap: 14,
                  alignItems: 'flex-start',
                }}
              >
                <div style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: n.is_read ? '#e2e8f0' : '#0ea5e9',
                  flexShrink: 0,
                  marginTop: 6,
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 4 }}>{n.title}</div>
                  <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.55 }}>{n.message}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8, fontWeight: 600 }}>
                    {new Date(n.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
