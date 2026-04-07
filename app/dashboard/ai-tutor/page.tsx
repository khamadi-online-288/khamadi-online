'use client'

import { useEffect, useRef, useState } from 'react'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUBJECTS = [
  'Қазақстан тарихы',
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'География',
  'Дүниежүзі тарихы',
  'Шет тілі',
  'Қазақ тілі',
  'Қазақ әдебиеті',
  'Информатика',
  'Құқық негіздері',
]

const MODES = [
  { key: 'simple', label: 'Қарапайым түсіндір' },
  { key: 'example', label: 'Мысалмен көрсет' },
  { key: 'quiz', label: 'Mini test' },
  { key: 'mistake', label: 'Қате талдау' },
]

export default function AITutorPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content:
        'Сәлем! Мен KHAMADI ONLINE AI Tutor-мын.\n\nПәнді таңда да, сұрағыңды жаз. Мен саған тақырыпты толық, нақты, ҰБТ форматына сай түсіндіріп берем.',
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
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject,
          mode,
          messages: nextMessages,
        }),
      })

      const data = await res.json()

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data?.reply || 'Қате орын алды.',
        },
      ])
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Қате орын алды. Қайталап көр.',
        },
      ])
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
    <div style={s.page}>
      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <div style={s.container}>
        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badge}>AI TUTOR</div>
            <h1 style={s.title}>KHAMADI AI Tutor</h1>
            <p style={s.subtitle}>
              ҰБТ пәндері бойынша тақырыпты түсіндіреді, мысал келтіреді, mini test құрастырады
              және қателерді талдап береді.
            </p>

            <div style={s.heroStats}>
              <div style={s.statCard}>
                <div style={s.statValue}>12</div>
                <div style={s.statLabel}>Пән</div>
              </div>
              <div style={s.statCard}>
                <div style={s.statValue}>AI</div>
                <div style={s.statLabel}>Түсіндіру</div>
              </div>
              <div style={s.statCard}>
                <div style={s.statValue}>120+</div>
                <div style={s.statLabel}>ҰБТ бағыты</div>
              </div>
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={s.previewCard}>
              <div style={s.previewTop}>Нәтиже қандай болады?</div>
              <div style={s.previewBubble}>
                <div style={s.previewBubbleTitle}>Құрылымды жауап</div>
                <div style={s.previewBubbleText}>
                  Анықтама, түсіндіру, формула, мысал, ҰБТ-де қалай келетіні — бәрі ретімен.
                </div>
              </div>
              <div style={s.previewBubble}>
                <div style={s.previewBubbleTitle}>Математикада қадамдап</div>
                <div style={s.previewBubbleText}>
                  Берілгені, шешуі, жауабы форматымен түсіндіреді.
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={s.panel}>
          <div style={s.filters}>
            <div style={s.filtersTitle}>Пәнді таңда</div>

            <div style={s.subjectRow}>
              {SUBJECTS.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSubject(sub)}
                  style={{
                    ...s.subjectBtn,
                    ...(subject === sub ? s.subjectActive : {}),
                  }}
                >
                  {sub}
                </button>
              ))}
            </div>

            <div style={s.filtersTitle}>Жауап режимі</div>

            <div style={s.modeRow}>
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  style={{
                    ...s.modeBtn,
                    ...(mode === m.key ? s.modeActive : {}),
                  }}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div style={s.chat}>
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  ...s.messageRow,
                  justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                {m.role === 'assistant' ? (
                  <div style={s.aiMessageWrap}>
                    <div style={s.aiMessageHead}>
                      <div style={s.aiAvatar}>AI</div>
                      <div>
                        <div style={s.aiName}>KHAMADI Tutor</div>
                        <div style={s.aiMeta}>
                          {subject} · {MODES.find((x) => x.key === mode)?.label}
                        </div>
                      </div>
                    </div>

                    <div style={s.aiBubble}>
                      <div style={s.aiContent}>{m.content}</div>
                    </div>
                  </div>
                ) : (
                  <div style={s.userBubble}>{m.content}</div>
                )}
              </div>
            ))}

            {loading && (
              <div style={s.messageRow}>
                <div style={s.aiMessageWrap}>
                  <div style={s.aiMessageHead}>
                    <div style={s.aiAvatar}>AI</div>
                    <div>
                      <div style={s.aiName}>KHAMADI Tutor</div>
                      <div style={s.aiMeta}>Жауап дайындалып жатыр...</div>
                    </div>
                  </div>

                  <div style={s.aiBubble}>
                    <div style={s.typingWrap}>
                      <div style={s.typingDot} />
                      <div style={s.typingDot} />
                      <div style={s.typingDot} />
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={s.inputWrap}>
            <div style={s.inputCard}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Сұрағыңды толық жаз... Мысалы: Квадрат теңдеуді қарапайым түсіндіріп бер"
                style={s.textarea}
              />

              <div style={s.inputBottom}>
                <div style={s.inputHint}>
                  Enter — жіберу · Shift + Enter — жаңа жол
                </div>

                <button
                  onClick={() => sendMessage()}
                  style={{
                    ...s.sendBtn,
                    opacity: !input.trim() || loading ? 0.6 : 1,
                    cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
                  }}
                  disabled={!input.trim() || loading}
                >
                  Жіберу
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 24%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 24%), linear-gradient(180deg,#F8FCFF,#EEF7FF)',
    padding: 28,
    position: 'relative',
    overflow: 'hidden',
  },

  bgGlowTop: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 320,
    height: 320,
    borderRadius: '999px',
    background: 'rgba(56,189,248,0.16)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  bgGlowBottom: {
    position: 'absolute',
    left: -100,
    bottom: -100,
    width: 280,
    height: 280,
    borderRadius: '999px',
    background: 'rgba(14,165,233,0.12)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  container: {
    maxWidth: 1280,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 20,
    padding: 30,
    borderRadius: 34,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 24%), linear-gradient(135deg, #081120 0%, #0F172A 42%, #0B3B63 72%, #0EA5E9 100%)',
    color: '#FFFFFF',
    boxShadow: '0 28px 60px rgba(2,8,23,0.20)',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  heroLeft: {},

  heroRight: {
    display: 'flex',
    alignItems: 'stretch',
  },

  badge: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.14)',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.06em',
    marginBottom: 16,
  },

  title: {
    fontSize: 48,
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.04em',
    margin: 0,
    marginBottom: 14,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 1.85,
    color: 'rgba(255,255,255,0.76)',
    maxWidth: 720,
    margin: 0,
  },

  heroStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginTop: 24,
  },

  statCard: {
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: 22,
    padding: 18,
  },

  statValue: {
    fontSize: 28,
    fontWeight: 900,
    marginBottom: 6,
  },

  statLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.70)',
    fontWeight: 700,
  },

  previewCard: {
    width: '100%',
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 28,
    padding: 22,
    backdropFilter: 'blur(14px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },

  previewTop: {
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 6,
  },

  previewBubble: {
    padding: 16,
    borderRadius: 18,
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  previewBubbleTitle: {
    fontSize: 15,
    fontWeight: 800,
    marginBottom: 6,
  },

  previewBubbleText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.72)',
  },

  panel: {
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
  },

  filters: {
    background: 'rgba(255,255,255,0.84)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 28,
    padding: 22,
    boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
    backdropFilter: 'blur(12px)',
  },

  filtersTitle: {
    fontSize: 13,
    fontWeight: 900,
    color: '#64748B',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 12,
    marginTop: 4,
  },

  subjectRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
  },

  subjectBtn: {
    padding: '10px 16px',
    borderRadius: 999,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
    color: '#0F172A',
    fontSize: 14,
  },

  subjectActive: {
    background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
    color: '#FFFFFF',
    border: 'none',
    boxShadow: '0 10px 20px rgba(14,165,233,0.25)',
  },

  modeRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },

  modeBtn: {
    padding: '9px 16px',
    borderRadius: 999,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#0F172A',
    fontSize: 14,
  },

  modeActive: {
    background: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
  },

  chat: {
    background: 'rgba(255,255,255,0.90)',
    border: '1px solid #E2E8F0',
    borderRadius: 28,
    padding: 24,
    height: '62vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 16,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.05)',
  },

  messageRow: {
    display: 'flex',
  },

  aiMessageWrap: {
    maxWidth: '88%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  aiMessageHead: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    paddingLeft: 4,
  },

  aiAvatar: {
    width: 38,
    height: 38,
    borderRadius: '999px',
    background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 12,
    boxShadow: '0 10px 20px rgba(14,165,233,0.20)',
  },

  aiName: {
    fontSize: 14,
    fontWeight: 900,
    color: '#0F172A',
  },

  aiMeta: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  aiBubble: {
    background: '#F8FAFC',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: '18px 20px',
    boxShadow: '0 8px 18px rgba(15,23,42,0.03)',
  },

  aiContent: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.9,
    fontSize: 15,
    color: '#0F172A',
  },

  userBubble: {
    maxWidth: '78%',
    padding: '16px 20px',
    borderRadius: 22,
    lineHeight: 1.8,
    fontSize: 15,
    background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
    color: '#FFFFFF',
    boxShadow: '0 10px 20px rgba(14,165,233,0.20)',
    whiteSpace: 'pre-wrap',
  },

  typingWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    minHeight: 24,
  },

  typingDot: {
    width: 10,
    height: 10,
    borderRadius: '999px',
    background: '#94A3B8',
  },

  inputWrap: {
    display: 'flex',
  },

  inputCard: {
    width: '100%',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 24,
    padding: 14,
    boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
  },

  textarea: {
    width: '100%',
    borderRadius: 18,
    border: '1px solid #CBD5E1',
    padding: 16,
    minHeight: 90,
    maxHeight: 220,
    fontSize: 15,
    outline: 'none',
    resize: 'none',
    lineHeight: 1.7,
    color: '#0F172A',
    background: '#FFFFFF',
  },

  inputBottom: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },

  inputHint: {
    fontSize: 13,
    color: '#64748B',
  },

  sendBtn: {
    minWidth: 120,
    height: 48,
    borderRadius: 16,
    border: 'none',
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 10px 20px rgba(15,23,42,0.16)',
  },
}