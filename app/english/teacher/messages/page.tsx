'use client'
import { useEffect, useState, useRef } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import type { LMSConversation, LMSMessage, EnglishProfile } from '@/lib/english/lms/types'
import { createNotification, NOTIF } from '@/lib/english/lms/notifications'
import { Send, Plus, MessageSquare } from 'lucide-react'

export default function TeacherMessagesPage() {
  const [conversations, setConversations] = useState<LMSConversation[]>([])
  const [selected, setSelected] = useState<LMSConversation | null>(null)
  const [messages, setMessages] = useState<LMSMessage[]>([])
  const [text, setText] = useState('')
  const [uid, setUid] = useState('')
  const [students, setStudents] = useState<EnglishProfile[]>([])
  const [showNew, setShowNew] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const supabase = createEnglishClient()

  useEffect(() => { init() }, [])

  async function init() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUid(session.user.id)
    loadConversations(session.user.id)

    // Студенты для нового разговора
    const { data: groups } = await supabase.from('lms_groups').select('id').eq('teacher_id', session.user.id)
    const gids = (groups ?? []).map((g: { id: string }) => g.id)
    if (gids.length) {
      const { data: gs } = await supabase.from('lms_group_students').select('student_id').in('group_id', gids)
      const sids = [...new Set((gs ?? []).map((x: { student_id: string }) => x.student_id))]
      if (sids.length) {
        const { data: profs } = await supabase.from('profiles').select('id,full_name,avatar_url').in('id', sids)
        setStudents((profs ?? []) as EnglishProfile[])
      }
    }
  }

  async function loadConversations(userId: string) {
    const { data } = await supabase.from('lms_conversation_members').select('conversation:lms_conversations(id,title,type,created_at)').eq('user_id', userId)
    const convs = (data ?? []).map((x: { conversation: LMSConversation }) => x.conversation).filter(Boolean)
    setConversations(convs)
  }

  async function selectConversation(conv: LMSConversation) {
    setSelected(conv)
    const { data } = await supabase.from('lms_messages').select('*,sender:profiles(id,full_name,avatar_url)').eq('conversation_id', conv.id).order('created_at')
    setMessages((data ?? []) as LMSMessage[])
    setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 100)

    // Subscribe realtime
    supabase.channel(`msgs_${conv.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'lms_messages', filter: `conversation_id=eq.${conv.id}` }, (payload: { new: LMSMessage }) => {
        setMessages(m => [...m, payload.new])
        setTimeout(() => bottomRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
      })
      .subscribe()
  }

  async function startConversation(student: EnglishProfile) {
    // Check existing
    const { data: existing } = await supabase.from('lms_conversations').select('id,lms_conversation_members!inner(user_id)').eq('type', 'direct')
    // For simplicity — create new
    const { data: conv } = await supabase.from('lms_conversations').insert({ type: 'direct', title: student.full_name ?? 'Разговор' }).select().single()
    if (!conv) return
    const cid = (conv as { id: string }).id
    await supabase.from('lms_conversation_members').insert([{ conversation_id: cid, user_id: uid }, { conversation_id: cid, user_id: student.id }])
    setShowNew(false)
    loadConversations(uid)
    selectConversation({ id: cid, type: 'direct', title: student.full_name ?? 'Разговор', created_at: new Date().toISOString() })
  }

  async function sendMessage(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim() || !selected) return
    const msg = text; setText('')
    await supabase.from('lms_messages').insert({ conversation_id: selected.id, sender_id: uid, content: msg })
  }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Сообщения" />
      <div style={{ display: 'flex', height: 'calc(100vh - 62px)' }}>
        {/* Sidebar */}
        <div style={{ width: 300, borderRight: '1px solid rgba(27,58,107,0.08)', background: '#fff', display: 'flex', flexDirection: 'column' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontWeight: 800, fontSize: 14, color: '#1B3A6B' }}>Разговоры</div>
            <button onClick={() => setShowNew(s => !s)} style={{ background: '#1B3A6B', border: 'none', borderRadius: 8, color: '#fff', cursor: 'pointer', padding: '6px 8px', display: 'flex' }}><Plus size={14} /></button>
          </div>
          {showNew && (
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', maxHeight: 200, overflowY: 'auto' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 8 }}>ВЫБЕРИТЕ СТУДЕНТА</div>
              {students.map(s => (
                <div key={s.id} onClick={() => startConversation(s)} style={{ padding: '8px 10px', borderRadius: 10, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#1e293b' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#e0f2fe')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  {s.full_name ?? s.id}
                </div>
              ))}
            </div>
          )}
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {conversations.map(c => (
              <div key={c.id} onClick={() => selectConversation(c)}
                style={{ padding: '14px 20px', cursor: 'pointer', background: selected?.id === c.id ? 'rgba(27,143,196,0.07)' : 'transparent', borderBottom: '1px solid #f8fafc', transition: 'background 0.1s' }}
                onMouseEnter={e => { if (selected?.id !== c.id) e.currentTarget.style.background = '#f8fafc' }}
                onMouseLeave={e => { if (selected?.id !== c.id) e.currentTarget.style.background = 'transparent' }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: '#1e293b' }}>{c.title ?? 'Разговор'}</div>
                <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{c.type === 'direct' ? 'Личный' : 'Групповой'}</div>
              </div>
            ))}
            {conversations.length === 0 && <div style={{ padding: 24, color: '#94a3b8', fontSize: 13, textAlign: 'center' }}>Нет разговоров</div>}
          </div>
        </div>

        {/* Chat */}
        {selected ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F9FD' }}>
            <div style={{ padding: '14px 24px', background: '#fff', borderBottom: '1px solid rgba(27,58,107,0.08)', fontWeight: 800, fontSize: 15, color: '#1B3A6B' }}>{selected.title}</div>
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {messages.map(m => {
                const isMe = m.sender_id === uid
                return (
                  <div key={m.id} style={{ display: 'flex', justifyContent: isMe ? 'flex-end' : 'flex-start' }}>
                    <div style={{ maxWidth: '70%', background: isMe ? '#1B3A6B' : '#fff', color: isMe ? '#fff' : '#1e293b', padding: '10px 14px', borderRadius: isMe ? '16px 16px 4px 16px' : '16px 16px 16px 4px', fontSize: 14, fontWeight: 500, boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }}>
                      <div>{m.content}</div>
                      <div style={{ fontSize: 10, opacity: 0.6, marginTop: 4, textAlign: 'right' }}>{new Date(m.created_at).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                )
              })}
              <div ref={bottomRef} />
            </div>
            <form onSubmit={sendMessage} style={{ padding: '14px 20px', background: '#fff', borderTop: '1px solid rgba(27,58,107,0.08)', display: 'flex', gap: 10 }}>
              <input value={text} onChange={e => setText(e.target.value)} placeholder="Написать сообщение..." style={{ flex: 1, padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 14, fontSize: 14, fontFamily: 'Montserrat', outline: 'none' }} />
              <button type="submit" disabled={!text.trim()} style={{ padding: '11px 16px', borderRadius: 14, background: '#1B3A6B', color: '#fff', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', opacity: !text.trim() ? 0.5 : 1 }}><Send size={16} /></button>
            </form>
          </div>
        ) : (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, color: '#94a3b8' }}>
            <MessageSquare size={48} />
            <div style={{ fontSize: 16, fontWeight: 600 }}>Выберите разговор</div>
          </div>
        )}
      </div>
    </div>
  )
}
