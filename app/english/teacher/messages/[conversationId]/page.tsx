'use client'
import { useEffect, useState, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import { Send, ArrowLeft } from 'lucide-react'
import type { LMSMessage } from '@/lib/english/lms/types'
import Link from 'next/link'

export default function ConversationPage() {
  const { conversationId } = useParams<{ conversationId: string }>()
  const supabase = createEnglishClient()
  const [messages, setMessages] = useState<LMSMessage[]>([])
  const [title, setTitle] = useState('Разговор')
  const [text, setText] = useState('')
  const [uid, setUid] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function init() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      setUid(session.user.id)

      const { data: conv } = await supabase.from('lms_conversations').select('title').eq('id', conversationId).maybeSingle()
      if (conv) setTitle((conv as { title?: string }).title ?? 'Разговор')

      const { data } = await supabase
        .from('lms_messages')
        .select('*,sender:profiles(id,full_name,avatar_url)')
        .eq('conversation_id', conversationId)
        .order('created_at')
      setMessages((data ?? []) as LMSMessage[])
      setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

      // Mark all as read
      await supabase.from('lms_messages').update({ is_read: true }).eq('conversation_id', conversationId).neq('sender_id', session.user.id)

      // Realtime
      supabase.channel(`conv_${conversationId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lms_messages', filter: `conversation_id=eq.${conversationId}` }, (payload: { new: LMSMessage }) => {
          setMessages(m => [...m, payload.new])
          setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
        })
        .subscribe()
    }
    init()
  }, [conversationId])

  async function send(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const msg = text; setText('')
    await supabase.from('lms_messages').insert({ conversation_id: conversationId, sender_id: uid, content: msg })
  }

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <TeacherHeader title={title} />
      <div style={{ padding: '12px 24px', background: '#fff', borderBottom: '1px solid #f1f5f9' }}>
        <Link href="/english/teacher/messages" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}><ArrowLeft size={14} /> Все разговоры</Link>
      </div>
      <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10, background: '#F5F9FD' }}>
        {messages.map(m => {
          const isMe = m.sender_id === uid
          const sender = (m as unknown as { sender?: { full_name?: string; avatar_url?: string } }).sender
          return (
            <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start', alignItems: 'flex-end', gap: 8 }}>
              {!isMe && (
                <div style={{ width: 32, height: 32, borderRadius: 10, background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 13, fontWeight: 800, color: '#fff' }}>
                  {sender?.full_name?.[0]?.toUpperCase() ?? '?'}
                </div>
              )}
              <div style={{ maxWidth: '65%' }}>
                {!isMe && sender?.full_name && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 3, fontWeight: 600 }}>{sender.full_name}</div>}
                <div style={{ background: isMe ? '#1B3A6B' : '#fff', color: isMe ? '#fff' : '#1e293b', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 14, boxShadow: '0 1px 4px rgba(0,0,0,0.07)', fontFamily: 'Montserrat' }}>
                  <div style={{ fontWeight: 500, lineHeight: 1.5 }}>{m.content}</div>
                  <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' as const }}>{new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              </div>
            </div>
          )
        })}
        {messages.length === 0 && <div style={{ textAlign: 'center' as const, color: '#94a3b8', fontSize: 13, paddingTop: 60 }}>Нет сообщений. Напишите первым!</div>}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={send} style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid rgba(27,58,107,0.08)', display: 'flex', gap: 10 }}>
        <input value={text} onChange={e => setText(e.target.value)} placeholder="Написать сообщение..." style={{ flex: 1, padding: '11px 16px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 14, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc' }} />
        <button type="submit" disabled={!text.trim()} style={{ padding: '11px 16px', borderRadius: 14, background: '#1B3A6B', color: '#fff', border: 'none', cursor: text.trim() ? 'pointer' : 'default', opacity: text.trim() ? 1 : 0.5, display: 'flex', alignItems: 'center' }}><Send size={16} /></button>
      </form>
    </div>
  )
}
