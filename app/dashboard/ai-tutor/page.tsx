'use client'

import { useState, useRef, useEffect } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

export default function AiTutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Сәлем! Мен AI мұғалімінмін. ҰБТ пәндеріне қатысты кез-келген сұрағыңды қой — түсіндіріп беремін! 📚'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = { role: 'user', content: input.trim() }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: [...messages, userMsg] }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || 'Қате орын алды.' }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Қате орын алды.' }])
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.label}>AI МҰҒАЛІМ</div>
          <h1 style={s.title}>AI Tutor</h1>
          <p style={s.subtitle}>ҰБТ пәндеріне қатысты кез-келген сұрағыңды қой</p>
        </div>

        <div style={s.chatBox}>
          <div style={s.messages}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                {msg.role === 'assistant' && (
                  <div style={s.avatar}>🤖</div>
                )}
                <div style={{
                  ...s.bubble,
                  background: msg.role === 'user' ? '#0EA5E9' : '#FFFFFF',
                  color: msg.role === 'user' ? '#FFFFFF' : '#0F172A',
                  border: msg.role === 'user' ? 'none' : '1px solid #E2E8F0',
                  borderRadius: msg.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                  marginLeft: msg.role === 'user' ? 0 : 10,
                  marginRight: msg.role === 'user' ? 0 : 0,
                }}>
                  {msg.content.split('\n').map((line, j) => (
                    <p key={j} style={{ margin: j === 0 ? 0 : '6px 0 0' }}>{line}</p>
                  ))}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={s.avatar}>🤖</div>
                <div style={{ ...s.bubble, background: '#FFFFFF', border: '1px solid #E2E8F0', marginLeft: 10 }}>
                  <div style={s.dots}>
                    <span /><span /><span />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div style={s.inputRow}>
            <input
              style={s.input}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Сұрағыңды жаз..."
              disabled={loading}
            />
            <button style={{ ...s.sendBtn, opacity: loading || !input.trim() ? 0.6 : 1 }} onClick={sendMessage} disabled={loading || !input.trim()}>
              ➤
            </button>
          </div>
        </div>

        <div style={s.hintRow}>
          {['Фотосинтез дегеніміз не?', 'Логарифм қалай шешіледі?', 'Қазақстан тарихынан Абылай хан кім?', 'Newton заңдарын түсіндір'].map((hint, i) => (
            <button key={i} style={s.hint} onClick={() => setInput(hint)}>
              {hint}
            </button>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes blink {
          0%, 80%, 100% { opacity: 0; }
          40% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F8FAFC', padding: '24px 20px 40px' },
  wrap: { maxWidth: 800, margin: '0 auto' },
  topBlock: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: 700, color: '#0EA5E9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' },
  title: { fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 1.7, color: '#64748B', margin: 0 },
  chatBox: { background: '#FFFFFF', borderRadius: 24, border: '1px solid #E2E8F0', boxShadow: '0 10px 30px rgba(15,23,42,0.05)', overflow: 'hidden', marginBottom: 16 },
  messages: { padding: '24px 20px', minHeight: 400, maxHeight: 520, overflowY: 'auto', display: 'flex', flexDirection: 'column' },
  avatar: { width: 36, height: 36, borderRadius: '50%', background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 },
  bubble: { maxWidth: '75%', padding: '12px 16px', fontSize: 15, lineHeight: 1.6 },
  dots: { display: 'flex', gap: 4 },
  inputRow: { display: 'flex', gap: 10, padding: '16px 20px', borderTop: '1px solid #E2E8F0', background: '#F8FAFC' },
  input: { flex: 1, padding: '14px 18px', borderRadius: 14, border: '1px solid #E2E8F0', fontSize: 15, outline: 'none', background: '#FFFFFF' },
  sendBtn: { width: 50, height: 50, borderRadius: 14, border: 'none', background: '#0EA5E9', color: '#FFFFFF', fontSize: 20, cursor: 'pointer', flexShrink: 0 },
  hintRow: { display: 'flex', gap: 8, flexWrap: 'wrap' },
  hint: { padding: '10px 16px', borderRadius: 999, border: '1px solid #E2E8F0', background: '#FFFFFF', color: '#334155', fontSize: 13, fontWeight: 600, cursor: 'pointer' },
}