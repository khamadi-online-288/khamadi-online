'use client'
import { useState, useEffect, useRef } from 'react'
import { Bell, X } from 'lucide-react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { LMSNotification } from '@/lib/english/lms/types'

export default function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState<LMSNotification[]>([])
  const supabase = createEnglishClient()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    load()
    const ch = supabase.channel('notif_bell')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lms_notifications' }, load)
      .subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [])

  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false) }
    document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [])

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data } = await supabase.from('lms_notifications').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false }).limit(25)
    setNotes((data as LMSNotification[]) ?? [])
  }

  async function markAllRead() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    await supabase.from('lms_notifications').update({ is_read: true }).eq('user_id', session.user.id)
    setNotes(n => n.map(x => ({ ...x, is_read: true })))
  }

  const unread = notes.filter(n => !n.is_read).length

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button onClick={() => setOpen(o => !o)} style={{ position: 'relative', width: 38, height: 38, borderRadius: 12, background: open ? 'rgba(27,143,196,0.12)' : 'rgba(27,58,107,0.06)', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B3A6B' }}>
        <Bell size={19} />
        {unread > 0 && <span style={{ position: 'absolute', top: 5, right: 5, width: 15, height: 15, borderRadius: 999, background: '#ef4444', color: '#fff', fontSize: 9, fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{unread > 9 ? '9+' : unread}</span>}
      </button>
      {open && (
        <div style={{ position: 'absolute', right: 0, top: 50, width: 340, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', border: '1px solid rgba(27,58,107,0.1)', zIndex: 999, overflow: 'hidden' }}>
          <div style={{ padding: '14px 18px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 900, fontSize: 14, color: '#1B3A6B' }}>Уведомления {unread > 0 && `(${unread})`}</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {unread > 0 && <button onClick={markAllRead} style={{ fontSize: 12, color: '#1B8FC4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, fontFamily: 'Montserrat' }}>Прочитать все</button>}
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
            </div>
          </div>
          <div style={{ maxHeight: 380, overflowY: 'auto' }}>
            {notes.length === 0 ? <div style={{ padding: '32px 18px', textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Нет уведомлений</div>
              : notes.map(n => (
                <div key={n.id} onClick={async () => { await supabase.from('lms_notifications').update({ is_read: true }).eq('id', n.id); setNotes(p => p.map(x => x.id === n.id ? { ...x, is_read: true } : x)); if (n.link) window.location.href = n.link }}
                  style={{ padding: '12px 18px', cursor: 'pointer', borderBottom: '1px solid #f8fafc', background: n.is_read ? '#fff' : 'rgba(27,143,196,0.04)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = n.is_read ? '#fff' : 'rgba(27,143,196,0.04)')}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', marginBottom: 2 }}>{n.title}</div>
                  <div style={{ fontSize: 12, color: '#64748b' }}>{n.body}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 3 }}>{new Date(n.created_at).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
