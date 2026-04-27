'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Send } from 'lucide-react'
import Link from 'next/link'

type Msg = { id: string; sender_id: string; body: string; is_internal: boolean; created_at: string; sender?: { full_name: string | null } | null }

const STATUS_COLORS: Record<string,string> = { open:'#1B8FC4', in_progress:'#C9933B', resolved:'#10b981', closed:'#64748b' }
const STATUS_LABELS: Record<string,string> = { open:'Открыт', in_progress:'В работе', resolved:'Решён', closed:'Закрыт' }

export default function StudentTicketPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [ticket,   setTicket]   = useState<Record<string, unknown> | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [userId,   setUserId]   = useState('')
  const [body,     setBody]     = useState('')
  const [sending,  setSending]  = useState(false)
  const [rating,   setRating]   = useState(0)
  const [ratingComment, setRatingComment] = useState('')
  const [ratingDone, setRatingDone] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase  = createEnglishClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setUserId(session.user.id)

      const [tRes, mRes] = await Promise.all([
        supabase.from('english_support_tickets').select('*').eq('id', ticketId).single(),
        supabase.from('english_support_messages').select('id,sender_id,body,is_internal,created_at,sender:sender_id(full_name)').eq('ticket_id', ticketId).eq('is_internal', false).order('created_at'),
      ])
      setTicket(tRes.data as Record<string, unknown> | null)
      setMessages((mRes.data ?? []) as unknown as Msg[])
    }
    load()
  }, [ticketId])

  // Realtime
  useEffect(() => {
    const ch = supabase.channel(`student-ticket-${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'english_support_messages', filter: `ticket_id=eq.${ticketId}` }, payload => {
        const msg = payload.new as Msg
        if (!msg.is_internal) {
          setMessages(m => [...m, msg])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
        }
      }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [ticketId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'auto' }) }, [messages.length])

  async function sendMessage() {
    if (!body.trim() || !userId) return
    setSending(true)
    await supabase.from('english_support_messages').insert({ ticket_id: ticketId, sender_id: userId, body: body.trim(), is_internal: false })
    setBody('')
    setSending(false)
  }

  async function submitRating() {
    if (!rating) return
    await supabase.from('english_support_tickets').update({ rating, rating_comment: ratingComment || null, status: 'closed' }).eq('id', ticketId)
    setRatingDone(true)
    setTicket(t => t ? { ...t, rating, status: 'closed' } : t)
  }

  const t = ticket as { ticket_number?: number; subject?: string; status?: string; created_at?: string } | null
  const status = t?.status ?? 'open'
  const isClosed = status === 'closed' || status === 'resolved'
  const alreadyRated = !!(ticket as { rating?: number } | null)?.rating

  return (
    <div style={{ maxWidth: 720 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <Link href="/english/dashboard/support" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 700 }}>← Поддержка</Link>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B' }}>#{t?.ticket_number} — {t?.subject ?? '…'}</div>
          <div style={{ display: 'flex', gap: 10, marginTop: 4 }}>
            <span style={{ background: `${STATUS_COLORS[status] ?? '#64748b'}18`, color: STATUS_COLORS[status] ?? '#64748b', borderRadius: 6, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>
              {STATUS_LABELS[status] ?? status}
            </span>
            {t?.created_at && <span style={{ fontSize: 12, color: '#94a3b8' }}>Создан: {new Date(t.created_at).toLocaleDateString('ru-RU')}</span>}
          </div>
        </div>
      </div>

      {/* Messages */}
      <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden', marginBottom: 16 }}>
        <div style={{ maxHeight: 480, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16 }}>
          {messages.map(m => {
            const isAgent = m.sender_id !== userId
            const name = (m.sender as { full_name?: string | null } | null)?.full_name ?? '—'
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: isAgent ? 'row' : 'row-reverse', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 34, height: 34, borderRadius: 10, background: isAgent ? '#1B3A6B' : 'rgba(27,143,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: isAgent ? '#fff' : '#1B8FC4', flexShrink: 0 }}>
                  {name[0]?.toUpperCase() ?? '?'}
                </div>
                <div style={{ maxWidth: '80%' }}>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 4, textAlign: isAgent ? 'left' : 'right' }}>
                    {name} · {new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: isAgent ? '4px 16px 16px 16px' : '16px 4px 16px 16px', background: isAgent ? '#f8fafc' : '#1B8FC4', color: isAgent ? '#334155' : '#fff', fontSize: 14, lineHeight: 1.6, whiteSpace: 'pre-wrap' as const }}>
                    {m.body}
                  </div>
                </div>
              </div>
            )
          })}
          {messages.length === 0 && <div style={{ textAlign: 'center', color: '#94a3b8', padding: '24px 0', fontSize: 13 }}>Сообщений пока нет</div>}
          <div ref={bottomRef} />
        </div>

        {/* Reply */}
        {!isClosed && (
          <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(27,143,196,0.07)', display: 'flex', gap: 10 }}>
            <textarea value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendMessage() }} rows={2} placeholder="Написать сообщение... (Ctrl+Enter для отправки)"
              style={{ flex: 1, padding: '10px 14px', border: '1.5px solid rgba(27,143,196,0.15)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', resize: 'none' as const, lineHeight: 1.6 }} />
            <button onClick={sendMessage} disabled={sending || !body.trim()}
              style={{ padding: '10px 16px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, border: 'none', cursor: body.trim() ? 'pointer' : 'default', opacity: body.trim() ? 1 : 0.5, alignSelf: 'flex-end', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={14} /> Отправить
            </button>
          </div>
        )}
      </div>

      {/* Rating */}
      {isClosed && !alreadyRated && !ratingDone && (
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1.5px solid rgba(201,147,59,0.25)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#1B3A6B', marginBottom: 12 }}>Оцените качество поддержки</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
            {[1,2,3,4,5].map(n => (
              <button key={n} onClick={() => setRating(n)}
                style={{ fontSize: 28, background: 'none', border: 'none', cursor: 'pointer', opacity: n <= rating ? 1 : 0.3, transform: n <= rating ? 'scale(1.15)' : 'scale(1)', transition: 'all 0.15s' }}>⭐</button>
            ))}
          </div>
          <textarea value={ratingComment} onChange={e => setRatingComment(e.target.value)} rows={2} placeholder="Комментарий (необязательно)"
            style={{ width: '100%', padding: '10px 14px', border: '1.5px solid rgba(27,143,196,0.15)', borderRadius: 12, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', resize: 'none' as const, marginBottom: 12, boxSizing: 'border-box' as const }} />
          <button onClick={submitRating} disabled={!rating}
            style={{ padding: '10px 24px', borderRadius: 12, background: rating ? '#C9933B' : '#e2e8f0', color: rating ? '#fff' : '#94a3b8', fontWeight: 700, border: 'none', cursor: rating ? 'pointer' : 'default', fontFamily: 'Montserrat' }}>
            Отправить оценку
          </button>
        </div>
      )}
      {(ratingDone || alreadyRated) && isClosed && (
        <div style={{ background: '#dcfce7', borderRadius: 16, padding: '16px 20px', border: '1px solid #86efac', fontSize: 14, fontWeight: 700, color: '#166534' }}>
          ✓ Спасибо за вашу оценку! Тикет закрыт.
        </div>
      )}
    </div>
  )
}
