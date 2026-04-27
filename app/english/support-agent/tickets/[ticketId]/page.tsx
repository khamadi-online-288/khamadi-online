'use client'
import { useEffect, useRef, useState } from 'react'
import { useParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Send, Lock } from 'lucide-react'
import Link from 'next/link'

type Msg = { id: string; sender_id: string; body: string; is_internal: boolean; created_at: string; sender?: { full_name: string | null } | null }
type Agent = { id: string; full_name: string | null }

const STATUS_OPTS = [['open','Открыт'],['in_progress','В работе'],['resolved','Решён'],['closed','Закрыт']]
const PRIO_OPTS   = [['urgent','🔴 Срочный'],['normal','🔵 Обычный'],['low','⚪ Низкий']]

export default function AgentTicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>()
  const [ticket,    setTicket]    = useState<Record<string, unknown> | null>(null)
  const [messages,  setMessages]  = useState<Msg[]>([])
  const [templates, setTemplates] = useState<{ id: string; title: string; body: string }[]>([])
  const [agents,    setAgents]    = useState<Agent[]>([])
  const [body,      setBody]      = useState('')
  const [msgTab,    setMsgTab]    = useState<'reply'|'internal'>('reply')
  const [saving,    setSaving]    = useState(false)
  const [agentId,   setAgentId]   = useState('')
  const [status,    setStatus]    = useState('')
  const [priority,  setPriority]  = useState('')
  const [assignTo,  setAssignTo]  = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase  = createEnglishClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) setAgentId(session.user.id)

      const [tRes, mRes, tmpRes, agRes] = await Promise.all([
        supabase.from('english_support_tickets').select('*,user:user_id(id,full_name,email,language_level),assignee:assigned_to(id,full_name)').eq('id', ticketId).single(),
        supabase.from('english_support_messages').select('id,sender_id,body,is_internal,created_at,sender:sender_id(full_name)').eq('ticket_id', ticketId).order('created_at'),
        supabase.from('english_support_templates').select('id,title,body').order('created_at'),
        supabase.from('english_user_roles').select('user_id,full_name').in('role', ['admin','support']),
      ])

      setTicket(tRes.data as Record<string, unknown> | null)
      setMessages((mRes.data ?? []) as unknown as Msg[])
      setTemplates((tmpRes.data ?? []) as { id: string; title: string; body: string }[])
      const agData = ((agRes.data ?? []) as { user_id: string; full_name: string | null }[]).map(a => ({ id: a.user_id, full_name: a.full_name }))
      setAgents(agData)

      const t = tRes.data as Record<string, string> | null
      if (t) { setStatus(t.status ?? 'open'); setPriority(t.priority ?? 'normal'); setAssignTo(t.assigned_to ?? '') }
    }
    load()
  }, [ticketId])

  // Realtime
  useEffect(() => {
    const ch = supabase.channel(`support-ticket-${ticketId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'english_support_messages', filter: `ticket_id=eq.${ticketId}` }, payload => {
        setMessages(m => [...m, payload.new as Msg])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)
      }).subscribe()
    return () => { supabase.removeChannel(ch) }
  }, [ticketId])

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'auto' }) }, [messages.length])

  async function sendMessage() {
    if (!body.trim()) return
    setSaving(true)
    await supabase.from('english_support_messages').insert({
      ticket_id: ticketId, sender_id: agentId, body: body.trim(),
      is_internal: msgTab === 'internal',
    })
    // Notify student if not internal
    if (msgTab === 'reply' && ticket) {
      const tn = ticket as { user_id: string; ticket_number: number }
      await supabase.from('english_notifications').insert({
        user_id: tn.user_id,
        title:   `Ответ по тикету #${tn.ticket_number}`,
        body:    'Агент поддержки ответил на ваше обращение.',
        type:    'system',
      })
    }
    setBody('')
    setSaving(false)
  }

  async function saveManagement() {
    setSaving(true)
    const updates: Record<string, unknown> = { status, priority, assigned_to: assignTo || null }
    if (status === 'resolved') updates.resolved_at = new Date().toISOString()
    await supabase.from('english_support_tickets').update(updates).eq('id', ticketId)
    setTicket(t => t ? { ...t, ...updates } : t)
    setSaving(false)
  }

  const t = ticket as { ticket_number?: number; subject?: string; status?: string; priority?: string; category?: string; created_at?: string; user?: { id?: string; full_name?: string | null; email?: string | null; language_level?: string | null }; assignee?: { full_name?: string | null } | null } | null

  const inputStyle: React.CSSProperties = { width: '100%', padding: '9px 12px', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#1E2D40', color: '#fff', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Left: messages */}
      <div style={{ flex: '0 0 70%', display: 'flex', flexDirection: 'column', borderRight: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Header */}
        <div style={{ padding: '20px 28px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
          <Link href="/english/support-agent/tickets" style={{ color: 'rgba(255,255,255,0.4)', textDecoration: 'none', fontSize: 13 }}>← Тикеты</Link>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>#{t?.ticket_number} — {t?.subject ?? '…'}</div>
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 14 }}>
          {messages.map(m => {
            const isAgent    = m.sender_id !== (t?.user?.id ?? '')
            const isInternal = m.is_internal
            return (
              <div key={m.id} style={{ display: 'flex', flexDirection: isAgent ? 'row-reverse' : 'row', gap: 10, alignItems: 'flex-start' }}>
                <div style={{ width: 32, height: 32, borderRadius: 10, background: isAgent ? '#1B8FC4' : 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff', flexShrink: 0 }}>
                  {isInternal ? '🔒' : ((m.sender as { full_name?: string | null } | null)?.full_name?.[0]?.toUpperCase() ?? '?')}
                </div>
                <div style={{ maxWidth: '75%' }}>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginBottom: 4, textAlign: isAgent ? 'right' : 'left' }}>
                    {(m.sender as { full_name?: string | null } | null)?.full_name ?? '—'} · {new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    {isInternal && <span style={{ marginLeft: 6, color: '#f59e0b', fontWeight: 700 }}>Заметка</span>}
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: isAgent ? '16px 4px 16px 16px' : '4px 16px 16px 16px', background: isInternal ? 'rgba(245,158,11,0.12)' : isAgent ? '#1B8FC4' : '#1E2D40', border: isInternal ? '1px solid rgba(245,158,11,0.25)' : 'none', fontSize: 14, color: '#fff', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const }}>
                    {m.body}
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Reply input */}
        <div style={{ padding: '16px 28px', borderTop: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 4, marginBottom: 10, background: 'rgba(255,255,255,0.04)', borderRadius: 10, padding: 3, width: 'fit-content' }}>
            {([['reply','Ответить'],['internal','Заметка']] as ['reply'|'internal',string][]).map(([id, l]) => (
              <button key={id} onClick={() => setMsgTab(id)} style={{ padding: '6px 14px', borderRadius: 8, fontWeight: msgTab === id ? 700 : 500, fontSize: 12, border: 'none', background: msgTab === id ? (id === 'internal' ? '#f59e0b' : '#1B8FC4') : 'transparent', color: msgTab === id ? '#fff' : 'rgba(255,255,255,0.4)', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 5 }}>
                {id === 'internal' && <Lock size={11} />}{l}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <textarea value={body} onChange={e => setBody(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) sendMessage() }} rows={3} placeholder={msgTab === 'internal' ? 'Внутренняя заметка (студент не увидит)...' : 'Ответ студенту...'}
              style={{ flex: 1, padding: '12px 14px', border: `1.5px solid ${msgTab === 'internal' ? 'rgba(245,158,11,0.3)' : 'rgba(27,143,196,0.2)'}`, borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', background: '#1E2D40', color: '#fff', outline: 'none', resize: 'none' as const, lineHeight: 1.6 }} />
            <button onClick={sendMessage} disabled={saving || !body.trim()} style={{ padding: '12px 18px', borderRadius: 12, background: msgTab === 'internal' ? '#f59e0b' : '#1B8FC4', color: '#fff', fontWeight: 700, border: 'none', cursor: body.trim() ? 'pointer' : 'default', opacity: body.trim() ? 1 : 0.5, alignSelf: 'flex-end', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Send size={15} /> Отправить
            </button>
          </div>
        </div>
      </div>

      {/* Right: management */}
      <div style={{ flex: '0 0 30%', overflowY: 'auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
        {/* Manage */}
        <div style={{ background: '#1A2535', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Управление</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Статус</label>
              <select value={status} onChange={e => setStatus(e.target.value)} style={inputStyle}>
                {STATUS_OPTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Приоритет</label>
              <select value={priority} onChange={e => setPriority(e.target.value)} style={inputStyle}>
                {PRIO_OPTS.map(([v,l]) => <option key={v} value={v}>{l}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Назначить агенту</label>
              <select value={assignTo} onChange={e => setAssignTo(e.target.value)} style={inputStyle}>
                <option value="">— Не назначен —</option>
                {agents.map(a => <option key={a.id} value={a.id}>{a.full_name ?? a.id}</option>)}
              </select>
            </div>
            <button onClick={saveManagement} disabled={saving} style={{ padding: '10px', borderRadius: 10, background: '#1B8FC4', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 13 }}>
              {saving ? 'Сохранение...' : '💾 Сохранить'}
            </button>
          </div>
        </div>

        {/* Student info */}
        {t?.user && (
          <div style={{ background: '#1A2535', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14 }}>Студент</div>
            {([['Имя', t.user.full_name ?? '—'],['Email', t.user.email ?? '—'],['Уровень', t.user.language_level ?? '—']] as [string,string][]).map(([l,v]) => (
              <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{l}</span>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#fff' }}>{v}</span>
              </div>
            ))}
          </div>
        )}

        {/* Templates */}
        <div style={{ background: '#1A2535', borderRadius: 16, padding: 20, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 14 }}>📋 Шаблоны</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {templates.map(tmpl => (
              <button key={tmpl.id} onClick={() => setBody(b => b ? b + '\n\n' + tmpl.body : tmpl.body)}
                style={{ padding: '9px 12px', borderRadius: 9, background: 'rgba(27,143,196,0.08)', border: '1px solid rgba(27,143,196,0.15)', color: 'rgba(255,255,255,0.7)', fontWeight: 600, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const }}>
                {tmpl.title}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
