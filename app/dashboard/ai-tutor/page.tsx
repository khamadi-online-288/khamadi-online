'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUBJECTS = [
  'Қазақстан тарихы', 'Математика', 'Физика', 'Химия',
  'Биология', 'География', 'Дүниежүзі тарихы', 'Шет тілі',
  'Қазақ тілі', 'Қазақ әдебиеті', 'Информатика', 'Құқық негіздері',
]

const MODES = [
  { key: 'simple', label: 'Қарапайым түсіндір' },
  { key: 'example', label: 'Мысалмен көрсет' },
  { key: 'quiz', label: 'Mini test' },
  { key: 'mistake', label: 'Қате талдау' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: '## Сәлем!\nМен **KHAMADI ONLINE AI Tutor**-мын.\n\nПәнді таңда да, сұрағыңды жаз. Мен саған тақырыпты **толық, нақты, ҰБТ форматына сай** түсіндіріп берем.',
    },
  ])

  const [input, setInput] = useState('')
  const [subject, setSubject] = useState('Математика')
  const [mode, setMode] = useState('simple')
  const [loading, setLoading] = useState(false)

  const bottomRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  useEffect(() => {
    if (!textareaRef.current) return
    textareaRef.current.style.height = 'auto'
    textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 220)}px`
  }, [input])

  const modeLabel = useMemo(
    () => MODES.find((x) => x.key === mode)?.label || 'Қарапайым түсіндір',
    [mode]
  )

  async function sendMessage(text?: string) {
    const message = (text ?? input).trim()
    if (!message || loading) return

    const nextMessages = [...messages, { role: 'user' as const, content: message }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    try {
      const res = await fetch('/api/ai-tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, mode, messages: nextMessages }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data?.reply || 'Қате орын алды.' }])
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: 'Қате орын алды. Қайталап көр.' }])
    } finally {
      setLoading(false)
    }
  }

  function handleEnter(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div>
      <style>{`
        @keyframes typingBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-6px); opacity: 1; }
        }
        .typing-dot { animation: typingBounce 1.2s infinite; }
        .typing-dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-dot:nth-child(3) { animation-delay: 0.4s; }
        .chat-scroll::-webkit-scrollbar { width: 4px; }
        .chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .chat-scroll::-webkit-scrollbar-thumb { background: rgba(14,165,233,0.2); border-radius: 4px; }
        @media (max-width: 1100px) {
          .ai-hero-grid { grid-template-columns: 1fr !important; }
          .ai-panel-grid { grid-template-columns: 1fr !important; }
          .ai-left-panel { position: static !important; }
        }
        @media (max-width: 768px) {
          .ai-title { font-size: 34px !important; }
          .ai-chat-area { height: 55vh !important; }
          .ai-input-bottom { flex-direction: column !important; }
          .ai-send-btn { width: 100% !important; }
        }
      `}</style>

      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          AI Tutor
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 8 }}>
          Жеке AI Көмекшің
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, maxWidth: 680 }}>
          ҰБТ форматына сай тақырыптарды нақты түсіндіреді, мысал береді, mini test жасайды.
        </p>
      </motion.div>

      {/* Hero grid */}
      <div
        className="ai-hero-grid"
        style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 20, marginBottom: 20 }}
      >
        {/* Left dark hero */}
        <motion.div
          {...fadeUp(0.08)}
          style={{
            borderRadius: 30, padding: 30,
            background: 'linear-gradient(135deg, #0c4a6e 0%, #075985 50%, #0369a1 100%)',
            color: '#fff',
            boxShadow: '0 24px 56px rgba(12,74,110,0.22)',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', fontSize: 12, fontWeight: 900, letterSpacing: '0.06em', marginBottom: 16 }}>
            AI TUTOR
          </div>
          <h2 className="ai-title" style={{ fontSize: 48, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.05em', margin: '0 0 14px' }}>
            AI Tutor — жеке көмекші сияқты
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.85, color: 'rgba(255,255,255,0.78)', marginBottom: 24 }}>
            KHAMADI ONLINE ішіндегі AI Tutor оқушыға күрделі тақырыптарды қарапайым тілмен, нақты мысалмен және ҰБТ форматына сай түсіндіріп береді.
          </p>

          <div style={{ display: 'grid', gap: 12 }}>
            {[
              { icon: '✓', title: 'Қарапайым түсіндіру', text: 'Күрделі тақырыпты жеңіл тілмен, бөлім-бөлім етіп түсіндіреді' },
              { icon: '✓', title: 'Мысалмен көрсету', text: 'Формула, ереже, есеп, термин — бәрін нақты мысалмен ашады' },
              { icon: '✓', title: 'Mini test және талдау', text: 'Тақырып соңында test беріп, қате логикасын да түсіндіреді' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.18 + i * 0.08 }}
                style={{ display: 'flex', gap: 14, padding: 16, borderRadius: 20, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.10)' }}
              >
                <div style={{ width: 34, height: 34, borderRadius: 999, background: 'rgba(255,255,255,0.16)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, flexShrink: 0, fontSize: 14 }}>{f.icon}</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>{f.title}</div>
                  <div style={{ fontSize: 13, lineHeight: 1.7, color: 'rgba(255,255,255,0.72)' }}>{f.text}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right preview card */}
        <motion.div
          {...fadeUp(0.14)}
          style={{
            borderRadius: 30, padding: 28,
            background: 'rgba(255,255,255,0.9)',
            border: '1px solid rgba(14,165,233,0.15)',
            boxShadow: '0 20px 44px rgba(14,165,233,0.08)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 900, marginBottom: 14 }}>
            LIVE AI PREVIEW
          </div>
          <div style={{ fontSize: 30, fontWeight: 900, letterSpacing: '-0.04em', color: '#0c4a6e', marginBottom: 20 }}>
            AI Tutor диалогы
          </div>

          <div style={{ maxWidth: '72%', marginLeft: 'auto', padding: '14px 18px', borderRadius: 18, background: '#ecfeff', color: '#0c4a6e', fontSize: 14, fontWeight: 700, marginBottom: 16, border: '1px solid rgba(14,165,233,0.12)' }}>
            Фотоэффект деген не?
          </div>

          <div style={{ padding: 18, borderRadius: 20, background: '#0c4a6e', color: '#fff', fontSize: 14, lineHeight: 1.8, marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.55)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Қысқа түсіндіру</div>
            Фотоэффект — жарықтың әсерінен металл бетінен электрондардың бөлініп шығу құбылысы.
          </div>

          <p style={{ fontSize: 14, lineHeight: 1.9, color: '#475569', marginBottom: 14 }}>
            Қарапайым айтсақ, жарық металл бетіне түскенде оның бетінен электрондар ұшып шығады.
          </p>
          <p style={{ fontSize: 14, lineHeight: 1.9, color: '#475569', marginBottom: 20 }}>
            Қаласаң, мен саған осыны ҰБТ форматына сай формуламен және mini test-пен де түсіндіріп беремін.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
            {[{ label: 'ФОРМАТ', value: 'Q&A' }, { label: 'ЖЫЛДАМДЫҚ', value: 'Instant' }, { label: 'МАҚСАТ', value: '120+' }].map((s) => (
              <div key={s.label} style={{ padding: '14px 12px', borderRadius: 16, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.12)', textAlign: 'center' }}>
                <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
                <div style={{ fontSize: 16, fontWeight: 900, color: '#0c4a6e' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Main panel */}
      <div className="ai-panel-grid" style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: 16, alignItems: 'start' }}>
        {/* Left controls */}
        <div className="ai-left-panel" style={{ display: 'grid', gap: 14, position: 'sticky', top: 18 }}>
          <motion.div
            {...fadeUp(0.2)}
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: 20, boxShadow: '0 12px 28px rgba(14,165,233,0.07)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>Пән</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SUBJECTS.map((sub) => (
                <motion.button
                  key={sub}
                  onClick={() => setSubject(sub)}
                  whileTap={{ scale: 0.96 }}
                  style={{
                    padding: '8px 12px', borderRadius: 999, border: 'none', cursor: 'pointer',
                    background: subject === sub ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#f0f9ff',
                    color: subject === sub ? '#fff' : '#334155',
                    fontWeight: 700, fontSize: 12,
                    boxShadow: subject === sub ? '0 8px 18px rgba(14,165,233,0.28)' : 'none',
                    transition: 'all 0.18s ease',
                  }}
                >
                  {sub}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.24)}
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: 20, boxShadow: '0 12px 28px rgba(14,165,233,0.07)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 12 }}>Жауап режимі</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {MODES.map((m) => (
                <motion.button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: '11px 14px', borderRadius: 14, border: 'none', cursor: 'pointer', textAlign: 'left',
                    background: mode === m.key ? '#0c4a6e' : '#f8fafc',
                    color: mode === m.key ? '#fff' : '#334155',
                    fontWeight: 700, fontSize: 13,
                    transition: 'all 0.18s ease',
                  }}
                >
                  {m.label}
                </motion.button>
              ))}
            </div>
          </motion.div>

          <motion.div
            {...fadeUp(0.28)}
            style={{ borderRadius: 24, padding: 22, background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', color: '#fff', boxShadow: '0 16px 32px rgba(12,74,110,0.18)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 900, color: 'rgba(255,255,255,0.54)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Таңдалған режим</div>
            <div style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>{subject}</div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#7dd3fc', marginBottom: 12 }}>{modeLabel}</div>
            <div style={{ fontSize: 13, lineHeight: 1.8, color: 'rgba(255,255,255,0.72)' }}>
              Сұрағыңды толық жазсаң, AI әлдеқайда нақты және әдемі жауап береді.
            </div>
          </motion.div>
        </div>

        {/* Chat area */}
        <motion.div
          {...fadeUp(0.22)}
          style={{
            background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)',
            borderRadius: 28, padding: 20,
            boxShadow: '0 20px 44px rgba(14,165,233,0.07)',
            backdropFilter: 'blur(12px)',
          }}
        >
          {/* Chat header */}
          <div style={{ paddingBottom: 16, borderBottom: '1px solid rgba(14,165,233,0.12)', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 40, height: 40, borderRadius: 999, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, color: '#fff', boxShadow: '0 8px 18px rgba(14,165,233,0.24)' }}>
              AI
            </div>
            <div>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e' }}>KHAMADI AI Tutor</div>
              <div style={{ fontSize: 12, color: '#64748b', marginTop: 2 }}>{subject} · {modeLabel}</div>
            </div>
          </div>

          {/* Messages */}
          <div
            className="ai-chat-area chat-scroll"
            style={{ height: '62vh', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 18, paddingRight: 4 }}
          >
            <AnimatePresence initial={false}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}
                >
                  {m.role === 'assistant' ? (
                    <div style={{ width: '100%', maxWidth: '92%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#fff', flexShrink: 0, boxShadow: '0 6px 14px rgba(14,165,233,0.22)' }}>AI</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e' }}>KHAMADI Tutor</div>
                          <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{subject} · {modeLabel}</div>
                        </div>
                      </div>
                      <div style={{ background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 20, padding: '16px 20px', boxShadow: '0 6px 16px rgba(14,165,233,0.06)' }}>
                        <div style={{ color: '#0f172a', fontSize: 15, lineHeight: 1.9, wordBreak: 'break-word' }}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.03em' }}>{children}</h1>,
                              h2: ({ children }) => <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '20px 0 10px', letterSpacing: '-0.03em' }}>{children}</h2>,
                              h3: ({ children }) => <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0369a1', margin: '18px 0 8px' }}>{children}</h3>,
                              p: ({ children }) => <p style={{ margin: '0 0 10px', color: '#334155', lineHeight: 1.9 }}>{children}</p>,
                              ul: ({ children }) => <ul style={{ margin: '0 0 12px', paddingLeft: 20, color: '#334155' }}>{children}</ul>,
                              ol: ({ children }) => <ol style={{ margin: '0 0 12px', paddingLeft: 20, color: '#334155' }}>{children}</ol>,
                              li: ({ children }) => <li style={{ marginBottom: 6, lineHeight: 1.8 }}>{children}</li>,
                              strong: ({ children }) => <strong style={{ color: '#0c4a6e', fontWeight: 900 }}>{children}</strong>,
                              code: ({ children }) => <code style={{ background: '#e0f2fe', color: '#0369a1', padding: '2px 6px', borderRadius: 6, fontSize: 13, fontFamily: 'ui-monospace, monospace' }}>{children}</code>,
                              pre: ({ children }) => <pre style={{ background: '#0c4a6e', color: '#fff', padding: 14, borderRadius: 14, overflowX: 'auto', margin: '12px 0', fontSize: 13, lineHeight: 1.7 }}>{children}</pre>,
                              hr: () => <hr style={{ border: 'none', borderTop: '1px solid rgba(14,165,233,0.15)', margin: '16px 0' }} />,
                              blockquote: ({ children }) => <blockquote style={{ margin: '12px 0', padding: '10px 14px', borderLeft: '3px solid #38bdf8', background: '#e0f2fe', borderRadius: 10, color: '#0369a1' }}>{children}</blockquote>,
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={{ maxWidth: '76%', padding: '14px 18px', borderRadius: 20, fontSize: 14, lineHeight: 1.8, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', boxShadow: '0 10px 22px rgba(14,165,233,0.26)', whiteSpace: 'pre-wrap', fontWeight: 700 }}>
                      {m.content}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                style={{ display: 'flex' }}
              >
                <div style={{ width: '100%', maxWidth: '92%', display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 34, height: 34, borderRadius: 999, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 11, color: '#fff', flexShrink: 0 }}>AI</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e' }}>KHAMADI Tutor</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>Жауап дайындалып жатыр...</div>
                    </div>
                  </div>
                  <div style={{ background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 20, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 8 }}>
                    {[0, 1, 2].map((i) => (
                      <div key={i} className="typing-dot" style={{ width: 9, height: 9, borderRadius: 999, background: '#94a3b8' }} />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div style={{ marginTop: 16, background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 22, padding: 14, boxShadow: '0 12px 28px rgba(14,165,233,0.06)' }}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="Сұрағыңды толық жаз... Мысалы: Логарифм қасиеттерін формуламен және 10 mini test-пен түсіндір"
              style={{
                width: '100%', borderRadius: 16, border: '1px solid rgba(14,165,233,0.18)',
                padding: 14, minHeight: 90, maxHeight: 220, fontSize: 14,
                outline: 'none', resize: 'none', lineHeight: 1.7,
                color: '#0f172a', background: '#f8fafc', boxSizing: 'border-box',
                fontFamily: 'inherit', fontWeight: 600,
              }}
            />

            <div className="ai-input-bottom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
              <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>
                Enter — жіберу · Shift + Enter — жаңа жол
              </div>

              <motion.button
                className="ai-send-btn"
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                whileHover={input.trim() && !loading ? { scale: 1.03, boxShadow: '0 16px 32px rgba(14,165,233,0.34)' } : {}}
                whileTap={input.trim() && !loading ? { scale: 0.97 } : {}}
                style={{
                  minWidth: 120, height: 46, borderRadius: 14, border: 'none',
                  background: !input.trim() || loading ? 'rgba(14,165,233,0.4)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                  color: '#fff', fontSize: 14, fontWeight: 800,
                  cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                  boxShadow: !input.trim() || loading ? 'none' : '0 10px 22px rgba(14,165,233,0.28)',
                  letterSpacing: '-0.01em',
                }}
              >
                {loading ? 'Жіберілді...' : 'Жіберу ▶'}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
