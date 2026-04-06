'use client'

import { useMemo, useRef, useState, useEffect } from 'react'

type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const SUBJECTS = [
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'Қазақстан тарихы',
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
  { key: 'quiz', label: 'Mini test жаса' },
  { key: 'mistake', label: 'Қатені талда' },
]

const QUICK_PROMPTS: Record<string, string[]> = {
  Математика: [
    'Туынды деген не? Қарапайым түсіндір.',
    'Квадрат теңдеуді қалай шығарамыз?',
    'Логарифмнің негізгі формулаларын түсіндір.',
  ],
  Физика: [
    'Фотоэффект деген не? Мысалмен түсіндір.',
    'Ньютон заңдарын қарапайым тілмен түсіндір.',
    'Жылдамдық, уақыт, қашықтық формуласын түсіндір.',
  ],
  'Қазақстан тарихы': [
    'Қазақ хандығының құрылуын түсіндір.',
    'Жеті жарғы деген не?',
    'Алаш Орда туралы қысқаша түсіндір.',
  ],
  default: [
    'Осы тақырыпты қарапайым тілмен түсіндір.',
    'Мысалмен көрсет.',
    'ҰБТ-де қалай келеді?',
  ],
}

export default function AITutorPage() {
  const [selectedSubject, setSelectedSubject] = useState('Математика')
  const [selectedMode, setSelectedMode] = useState('simple')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content:
        'Сәлем! Мен KHAMADI ONLINE AI Tutor-мын. Пәнді таңда да, сұрағыңды жаз. Мен тақырыпты түсіндіріп, мысал келтіріп, ҰБТ форматына бейімдеп жауап беремін.',
    },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorText, setErrorText] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const quickPrompts = useMemo(() => {
    return QUICK_PROMPTS[selectedSubject] || QUICK_PROMPTS.default
  }, [selectedSubject])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const handleSend = async (customText?: string) => {
    const text = (customText ?? input).trim()
    if (!text || loading) return

    setErrorText('')

    const userMessage: ChatMessage = {
      role: 'user',
      content: text,
    }

    const nextMessages = [...messages, userMessage]
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
          subject: selectedSubject,
          mode: selectedMode,
          messages: nextMessages,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data?.reply || 'AI Tutor жауап бере алмады.')
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Қате орын алды.',
        },
      ])
    } catch (error: any) {
      setErrorText(error?.message || 'Қате орын алды.')
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'AI Tutor уақытша жауап бере алмай тұр. Кейінірек қайталап көр.',
        },
      ])
    } finally {
      setLoading(false)
      textareaRef.current?.focus()
    }
  }

  const handleQuickPrompt = (text: string) => {
    handleSend(text)
  }

  const clearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          'Чат тазаланды. Жаңа сұрағыңды жаза бер. Мен пәнге сай түсіндіріп беремін.',
      },
    ])
    setErrorText('')
    setInput('')
  }

  const handleEnter = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div style={s.page}>
      <div style={s.topBar}>
        <div>
          <div style={s.pageBadge}>AI TUTOR</div>
          <h1 style={s.pageTitle}>AI Tutor</h1>
          <p style={s.pageSub}>
            Пәнді таңда, режимді қой, сұрақты жаз — AI саған түсіндіріп, мысал келтіріп,
            ҰБТ форматына бейімдеп жауап береді.
          </p>
        </div>

        <button onClick={clearChat} style={s.clearBtn}>
          Чатты тазалау
        </button>
      </div>

      <div style={s.layout}>
        <aside style={s.leftPanel}>
          <div style={s.panelCard}>
            <div style={s.panelTitle}>Пәндер</div>
            <div style={s.subjectList}>
              {SUBJECTS.map((subject) => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  style={{
                    ...s.subjectButton,
                    ...(selectedSubject === subject ? s.subjectButtonActive : {}),
                  }}
                >
                  {subject}
                </button>
              ))}
            </div>
          </div>

          <div style={s.panelCard}>
            <div style={s.panelTitle}>Режим</div>
            <div style={s.modeList}>
              {MODES.map((mode) => (
                <button
                  key={mode.key}
                  onClick={() => setSelectedMode(mode.key)}
                  style={{
                    ...s.modeButton,
                    ...(selectedMode === mode.key ? s.modeButtonActive : {}),
                  }}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <section style={s.chatSection}>
          <div style={s.chatHeader}>
            <div>
              <div style={s.chatSubject}>{selectedSubject}</div>
              <div style={s.chatMode}>
                Режим: {MODES.find((m) => m.key === selectedMode)?.label || 'Қарапайым'}
              </div>
            </div>
          </div>

          <div style={s.quickRow}>
            {quickPrompts.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleQuickPrompt(prompt)}
                style={s.quickPrompt}
              >
                {prompt}
              </button>
            ))}
          </div>

          <div style={s.messagesWrap}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                style={{
                  ...s.messageRow,
                  justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    ...s.messageBubble,
                    ...(message.role === 'user' ? s.userBubble : s.aiBubble),
                  }}
                >
                  <div style={s.messageRole}>
                    {message.role === 'user' ? 'Сен' : 'AI Tutor'}
                  </div>
                  <div style={s.messageText}>{message.content}</div>
                </div>
              </div>
            ))}

            {loading && (
              <div style={s.messageRow}>
                <div style={{ ...s.messageBubble, ...s.aiBubble }}>
                  <div style={s.messageRole}>AI Tutor</div>
                  <div style={s.loadingDots}>
                    <span style={s.dot} />
                    <span style={s.dot} />
                    <span style={s.dot} />
                  </div>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div style={s.inputWrap}>
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleEnter}
              placeholder="Сұрағыңды жаз... Мысалы: Туынды деген не?"
              style={s.textarea}
              rows={4}
            />

            <div style={s.inputBottom}>
              <div style={s.helperText}>
                Enter — жіберу, Shift + Enter — жаңа жол
              </div>

              <button
                onClick={() => handleSend()}
                disabled={loading || !input.trim()}
                style={{
                  ...s.sendBtn,
                  ...(loading || !input.trim() ? s.sendBtnDisabled : {}),
                }}
              >
                {loading ? 'Жіберілуде...' : 'Жіберу'}
              </button>
            </div>

            {errorText ? <div style={s.errorText}>{errorText}</div> : null}
          </div>
        </section>

        <aside style={s.rightPanel}>
          <div style={s.panelCard}>
            <div style={s.panelTitle}>AI не істейді?</div>
            <div style={s.infoList}>
              <div style={s.infoItem}>Тақырыпты түсіндіреді</div>
              <div style={s.infoItem}>Мысал келтіреді</div>
              <div style={s.infoItem}>ҰБТ форматына аударады</div>
              <div style={s.infoItem}>Mini test жасайды</div>
              <div style={s.infoItem}>Қатені талдайды</div>
            </div>
          </div>

          <div style={s.panelCard}>
            <div style={s.panelTitle}>Ұсыныс</div>
            <div style={s.tipCard}>
              Бір сұрақты әртүрлі режимде қойып көр:
              <br />
              <strong>simple</strong> → түсінік
              <br />
              <strong>example</strong> → мысал
              <br />
              <strong>quiz</strong> → mini test
              <br />
              <strong>mistake</strong> → қатені талдау
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 22%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
    padding: 24,
  },

  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 16,
    marginBottom: 20,
  },

  pageBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 12,
  },

  pageTitle: {
    fontSize: 40,
    lineHeight: 1.05,
    fontWeight: 900,
    color: '#0F172A',
    margin: 0,
    marginBottom: 10,
    letterSpacing: '-0.04em',
  },

  pageSub: {
    maxWidth: 760,
    fontSize: 15,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0,
  },

  clearBtn: {
    minHeight: 44,
    padding: '0 16px',
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    fontWeight: 800,
    cursor: 'pointer',
  },

  layout: {
    display: 'grid',
    gridTemplateColumns: '280px minmax(0, 1fr) 260px',
    gap: 18,
    alignItems: 'start',
  },

  leftPanel: {
    display: 'grid',
    gap: 16,
  },

  rightPanel: {
    display: 'grid',
    gap: 16,
  },

  panelCard: {
    background: 'rgba(255,255,255,0.84)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 24,
    padding: 18,
    boxShadow: '0 14px 26px rgba(15,23,42,0.04)',
  },

  panelTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 14,
  },

  subjectList: {
    display: 'grid',
    gap: 8,
  },

  subjectButton: {
    minHeight: 42,
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0 14px',
  },

  subjectButtonActive: {
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    border: '1px solid transparent',
    boxShadow: '0 12px 24px rgba(14,165,233,0.18)',
  },

  modeList: {
    display: 'grid',
    gap: 8,
  },

  modeButton: {
    minHeight: 42,
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    fontWeight: 700,
    cursor: 'pointer',
    textAlign: 'left',
    padding: '0 14px',
  },

  modeButtonActive: {
    background: '#0F172A',
    color: '#FFFFFF',
    border: '1px solid #0F172A',
  },

  chatSection: {
    background: 'rgba(255,255,255,0.84)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 28,
    boxShadow: '0 16px 30px rgba(15,23,42,0.05)',
    minHeight: '75vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  chatHeader: {
    padding: 20,
    borderBottom: '1px solid #E2E8F0',
    background: 'linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
  },

  chatSubject: {
    fontSize: 20,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 4,
  },

  chatMode: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: 700,
  },

  quickRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    padding: '14px 20px',
    borderBottom: '1px solid #E2E8F0',
  },

  quickPrompt: {
    minHeight: 38,
    padding: '0 14px',
    borderRadius: 999,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  },

  messagesWrap: {
    flex: 1,
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    gap: 14,
    overflowY: 'auto',
    background: '#FCFEFF',
  },

  messageRow: {
    display: 'flex',
  },

  messageBubble: {
    maxWidth: '82%',
    borderRadius: 22,
    padding: 16,
  },

  userBubble: {
    background: '#E0F2FE',
    color: '#0F172A',
    border: '1px solid #BAE6FD',
  },

  aiBubble: {
    background: '#0F172A',
    color: '#FFFFFF',
  },

  messageRole: {
    fontSize: 12,
    fontWeight: 800,
    opacity: 0.8,
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.04em',
  },

  messageText: {
    whiteSpace: 'pre-wrap',
    lineHeight: 1.8,
    fontSize: 14,
  },

  loadingDots: {
    display: 'flex',
    gap: 8,
    alignItems: 'center',
    minHeight: 22,
  },

  dot: {
    width: 8,
    height: 8,
    borderRadius: 999,
    background: '#FFFFFF',
    opacity: 0.7,
  },

  inputWrap: {
    borderTop: '1px solid #E2E8F0',
    padding: 16,
    background: '#FFFFFF',
  },

  textarea: {
    width: '100%',
    borderRadius: 18,
    border: '1px solid #CBD5E1',
    padding: 14,
    fontSize: 14,
    lineHeight: 1.6,
    outline: 'none',
    resize: 'vertical',
    minHeight: 110,
    fontFamily: 'inherit',
    color: '#0F172A',
    background: '#FFFFFF',
  },

  inputBottom: {
    marginTop: 12,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 16,
  },

  helperText: {
    fontSize: 12,
    color: '#94A3B8',
  },

  sendBtn: {
    minHeight: 46,
    padding: '0 18px',
    borderRadius: 14,
    border: 'none',
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    fontWeight: 800,
    cursor: 'pointer',
    boxShadow: '0 12px 24px rgba(14,165,233,0.18)',
  },

  sendBtnDisabled: {
    opacity: 0.6,
    cursor: 'default',
  },

  errorText: {
    marginTop: 10,
    fontSize: 13,
    color: '#DC2626',
    fontWeight: 700,
  },

  infoList: {
    display: 'grid',
    gap: 10,
  },

  infoItem: {
    minHeight: 40,
    padding: '0 12px',
    borderRadius: 12,
    background: '#F8FBFF',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    color: '#334155',
    fontWeight: 700,
  },

  tipCard: {
    borderRadius: 16,
    padding: 14,
    background: '#F8FBFF',
    border: '1px solid #E2E8F0',
    color: '#475569',
    lineHeight: 1.8,
    fontSize: 13,
  },
}