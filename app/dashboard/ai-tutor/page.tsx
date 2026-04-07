'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

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
        '## Сәлем!\nМен **KHAMADI ONLINE AI Tutor**-мын.\n\nПәнді таңда да, сұрағыңды жаз. Мен саған тақырыпты **толық, нақты, ҰБТ форматына сай** түсіндіріп берем.',
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
      <style>{`
        @media (max-width: 1100px) {
          .aiTutorHero {
            grid-template-columns: 1fr !important;
          }
          .aiTutorPanel {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 820px) {
          .aiTutorPage {
            padding: 18px !important;
          }
          .aiTutorHeroCard {
            padding: 22px !important;
          }
          .aiTutorTitle {
            font-size: 34px !important;
          }
          .aiTutorChat {
            height: 58vh !important;
          }
          .aiTutorInputBottom {
            flex-direction: column !important;
            align-items: stretch !important;
          }
          .aiTutorSendBtn {
            width: 100% !important;
          }
        }
      `}</style>

      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <div style={s.container} className="aiTutorPage">
        <div style={s.hero} className="aiTutorHero">
          <div style={s.heroCard} className="aiTutorHeroCard">
            <div style={s.badge}>AI TUTOR</div>
            <h1 style={s.title} className="aiTutorTitle">
              AI Tutor — жеке көмекші сияқты
            </h1>
            <p style={s.subtitle}>
              KHAMADI ONLINE ішіндегі AI Tutor оқушыға күрделі тақырыптарды қарапайым тілмен,
              нақты мысалмен және ҰБТ форматына сай түсіндіріп береді.
            </p>

            <div style={s.featureList}>
              <div style={s.featureCard}>
                <div style={s.featureIcon}>✓</div>
                <div>
                  <div style={s.featureTitle}>Қарапайым түсіндіру</div>
                  <div style={s.featureText}>
                    Күрделі тақырыпты жеңіл тілмен, бөлім-бөлім етіп түсіндіреді
                  </div>
                </div>
              </div>

              <div style={s.featureCard}>
                <div style={s.featureIcon}>✓</div>
                <div>
                  <div style={s.featureTitle}>Мысалмен көрсету</div>
                  <div style={s.featureText}>
                    Формула, ереже, есеп, термин — бәрін нақты мысалмен ашады
                  </div>
                </div>
              </div>

              <div style={s.featureCard}>
                <div style={s.featureIcon}>✓</div>
                <div>
                  <div style={s.featureTitle}>Mini test және талдау</div>
                  <div style={s.featureText}>
                    Тақырып соңында test беріп, қате логикасын да түсіндіріп береді
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div style={s.previewCard}>
            <div style={s.previewPill}>LIVE AI PREVIEW</div>
            <div style={s.previewTitle}>AI Tutor диалогы</div>

            <div style={s.previewUser}>Фотоэффект деген не?</div>

            <div style={s.previewAi}>
              <div style={s.previewAiHead}>Қысқа түсіндіру</div>
              Фотоэффект — жарықтың әсерінен металл бетінен электрондардың бөлініп шығу
              құбылысы.
            </div>

            <div style={s.previewParagraph}>
              Қарапайым айтсақ, жарық металл бетіне түскенде оның бетінен электрондар ұшып
              шығады.
            </div>

            <div style={s.previewParagraph}>
              Қаласаң, мен саған осыны ҰБТ форматына сай формуламен және mini test-пен де
              түсіндіріп беремін.
            </div>

            <div style={s.previewStats}>
              <div style={s.previewStatBox}>
                <div style={s.previewStatLabel}>ФОРМАТ</div>
                <div style={s.previewStatValue}>Q&A</div>
              </div>
              <div style={s.previewStatBox}>
                <div style={s.previewStatLabel}>ЖЫЛДАМДЫҚ</div>
                <div style={s.previewStatValue}>Instant</div>
              </div>
              <div style={s.previewStatBox}>
                <div style={s.previewStatLabel}>МАҚСАТ</div>
                <div style={s.previewStatValue}>120+</div>
              </div>
            </div>
          </div>
        </div>

        <div style={s.panel} className="aiTutorPanel">
          <div style={s.leftPanel}>
            <div style={s.sectionCard}>
              <div style={s.sectionLabel}>Пән</div>
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
            </div>

            <div style={s.sectionCard}>
              <div style={s.sectionLabel}>Жауап режимі</div>
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

            <div style={s.sideInfoCard}>
              <div style={s.sideInfoTop}>Таңдалған режим</div>
              <div style={s.sideInfoSubject}>{subject}</div>
              <div style={s.sideInfoMode}>{modeLabel}</div>
              <div style={s.sideInfoText}>
                Сұрағыңды толық жазсаң, AI әлдеқайда нақты және әдемі жауап береді.
              </div>
            </div>
          </div>

          <div style={s.chatCard}>
            <div style={s.chatHead}>
              <div>
                <div style={s.chatHeadTitle}>KHAMADI AI Tutor</div>
                <div style={s.chatHeadMeta}>
                  {subject} · {modeLabel}
                </div>
              </div>
            </div>

            <div style={s.chat} className="aiTutorChat">
              {messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    ...s.messageRow,
                    justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start',
                  }}
                >
                  {m.role === 'assistant' ? (
                    <div style={s.aiWrap}>
                      <div style={s.aiHead}>
                        <div style={s.aiAvatar}>AI</div>
                        <div>
                          <div style={s.aiName}>KHAMADI Tutor</div>
                          <div style={s.aiMeta}>
                            {subject} · {modeLabel}
                          </div>
                        </div>
                      </div>

                      <div style={s.aiBubble}>
                        <div style={s.markdownWrap}>
                          <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ children }) => <h1 style={s.mdH1}>{children}</h1>,
                              h2: ({ children }) => <h2 style={s.mdH2}>{children}</h2>,
                              h3: ({ children }) => <h3 style={s.mdH3}>{children}</h3>,
                              p: ({ children }) => <p style={s.mdP}>{children}</p>,
                              ul: ({ children }) => <ul style={s.mdUl}>{children}</ul>,
                              ol: ({ children }) => <ol style={s.mdOl}>{children}</ol>,
                              li: ({ children }) => <li style={s.mdLi}>{children}</li>,
                              strong: ({ children }) => (
                                <strong style={s.mdStrong}>{children}</strong>
                              ),
                              code: ({ children }) => <code style={s.mdCode}>{children}</code>,
                              pre: ({ children }) => <pre style={s.mdPre}>{children}</pre>,
                              hr: () => <hr style={s.mdHr} />,
                              blockquote: ({ children }) => (
                                <blockquote style={s.mdBlockquote}>{children}</blockquote>
                              ),
                            }}
                          >
                            {m.content}
                          </ReactMarkdown>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div style={s.userBubble}>{m.content}</div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={s.messageRow}>
                  <div style={s.aiWrap}>
                    <div style={s.aiHead}>
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

            <div style={s.inputCard}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleEnter}
                placeholder="Сұрағыңды толық жаз... Мысалы: Логарифм қасиеттерін формуламен және 10 mini test-пен түсіндір"
                style={s.textarea}
              />

              <div style={s.inputBottom} className="aiTutorInputBottom">
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
                  className="aiTutorSendBtn"
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
    padding: '36px 24px 24px',
    boxSizing: 'border-box',
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
    maxWidth: 1320,
    margin: '0 auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    position: 'relative',
    zIndex: 1,
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1.08fr 0.92fr',
    gap: 20,
    marginTop: 8,
  },

  heroCard: {
    padding: 30,
    borderRadius: 34,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 24%), linear-gradient(135deg, #081120 0%, #0F172A 42%, #0B3B63 72%, #0EA5E9 100%)',
    color: '#FFFFFF',
    boxShadow: '0 28px 60px rgba(2,8,23,0.20)',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  previewCard: {
    padding: 28,
    borderRadius: 34,
    background: 'rgba(255,255,255,0.85)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.05)',
    backdropFilter: 'blur(12px)',
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
    fontSize: 52,
    fontWeight: 900,
    lineHeight: 1.03,
    letterSpacing: '-0.05em',
    margin: 0,
    marginBottom: 16,
    color: '#FFFFFF',
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 1.85,
    color: 'rgba(255,255,255,0.78)',
    margin: 0,
  },

  featureList: {
    display: 'grid',
    gap: 14,
    marginTop: 24,
  },

  featureCard: {
    display: 'flex',
    gap: 14,
    padding: 16,
    borderRadius: 20,
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.10)',
  },

  featureIcon: {
    width: 36,
    height: 36,
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.16)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    flexShrink: 0,
  },

  featureTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: '#FFFFFF',
    marginBottom: 4,
  },

  featureText: {
    fontSize: 14,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.72)',
  },

  previewPill: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 900,
    marginBottom: 14,
  },

  previewTitle: {
    fontSize: 34,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
    color: '#0F172A',
    marginBottom: 20,
  },

  previewUser: {
    alignSelf: 'flex-end',
    maxWidth: '72%',
    marginLeft: 'auto',
    padding: '14px 18px',
    borderRadius: 18,
    background: '#ECFEFF',
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 700,
    marginBottom: 16,
  },

  previewAi: {
    padding: 18,
    borderRadius: 20,
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 15,
    lineHeight: 1.8,
    marginBottom: 18,
  },

  previewAiHead: {
    fontSize: 12,
    fontWeight: 900,
    color: 'rgba(255,255,255,0.60)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },

  previewParagraph: {
    fontSize: 15,
    lineHeight: 1.9,
    color: '#475569',
    marginBottom: 16,
  },

  previewStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 12,
    marginTop: 22,
  },

  previewStatBox: {
    padding: 16,
    borderRadius: 18,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
  },

  previewStatLabel: {
    fontSize: 11,
    fontWeight: 900,
    color: '#94A3B8',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  previewStatValue: {
    fontSize: 18,
    fontWeight: 900,
    color: '#0F172A',
  },

  panel: {
    display: 'grid',
    gridTemplateColumns: '320px 1fr',
    gap: 16,
    alignItems: 'start',
  },

  leftPanel: {
    display: 'grid',
    gap: 16,
    position: 'sticky',
    top: 18,
  },

  sectionCard: {
    background: 'rgba(255,255,255,0.88)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 26,
    padding: 20,
    boxShadow: '0 14px 30px rgba(15,23,42,0.05)',
    backdropFilter: 'blur(12px)',
  },

  sectionLabel: {
    fontSize: 12,
    fontWeight: 900,
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 12,
  },

  subjectRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 10,
  },

  subjectBtn: {
    padding: '10px 14px',
    borderRadius: 999,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 4px 10px rgba(0,0,0,0.03)',
    color: '#0F172A',
    fontSize: 13,
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
    padding: '9px 14px',
    borderRadius: 999,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    cursor: 'pointer',
    fontWeight: 700,
    color: '#0F172A',
    fontSize: 13,
  },

  modeActive: {
    background: '#0F172A',
    color: '#FFFFFF',
    border: 'none',
  },

  sideInfoCard: {
    background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
    borderRadius: 26,
    padding: 22,
    color: '#FFFFFF',
    boxShadow: '0 18px 34px rgba(15,23,42,0.14)',
  },

  sideInfoTop: {
    fontSize: 12,
    fontWeight: 900,
    color: 'rgba(255,255,255,0.54)',
    marginBottom: 10,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  sideInfoSubject: {
    fontSize: 24,
    fontWeight: 900,
    lineHeight: 1.08,
    marginBottom: 8,
  },

  sideInfoMode: {
    fontSize: 15,
    fontWeight: 800,
    color: '#7DD3FC',
    marginBottom: 14,
  },

  sideInfoText: {
    fontSize: 14,
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.72)',
  },

  chatCard: {
    background: 'rgba(255,255,255,0.90)',
    border: '1px solid #E2E8F0',
    borderRadius: 28,
    padding: 18,
    backdropFilter: 'blur(12px)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.05)',
  },

  chatHead: {
    padding: '8px 8px 16px',
    borderBottom: '1px solid #E2E8F0',
    marginBottom: 16,
  },

  chatHeadTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: '#0F172A',
  },

  chatHeadMeta: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 4,
  },

  chat: {
    height: '64vh',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: 18,
    paddingRight: 4,
  },

  messageRow: {
    display: 'flex',
  },

  aiWrap: {
    width: '100%',
    maxWidth: '92%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },

  aiHead: {
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
    flexShrink: 0,
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

  markdownWrap: {
    color: '#0F172A',
    fontSize: 15,
    lineHeight: 1.9,
    wordBreak: 'break-word',
  },

  mdH1: {
    fontSize: 28,
    lineHeight: 1.2,
    fontWeight: 900,
    color: '#0F172A',
    margin: '0 0 14px 0',
    letterSpacing: '-0.03em',
  },

  mdH2: {
    fontSize: 22,
    lineHeight: 1.25,
    fontWeight: 900,
    color: '#0F172A',
    margin: '22px 0 12px 0',
    letterSpacing: '-0.03em',
  },

  mdH3: {
    fontSize: 18,
    lineHeight: 1.3,
    fontWeight: 900,
    color: '#0369A1',
    margin: '20px 0 10px 0',
  },

  mdP: {
    margin: '0 0 12px 0',
    color: '#334155',
    lineHeight: 1.9,
    fontSize: 15,
  },

  mdUl: {
    margin: '0 0 14px 0',
    paddingLeft: 22,
    color: '#334155',
  },

  mdOl: {
    margin: '0 0 14px 0',
    paddingLeft: 22,
    color: '#334155',
  },

  mdLi: {
    marginBottom: 8,
    lineHeight: 1.8,
  },

  mdStrong: {
    color: '#0F172A',
    fontWeight: 900,
  },

  mdCode: {
    background: '#E2E8F0',
    color: '#0F172A',
    padding: '2px 6px',
    borderRadius: 8,
    fontSize: 14,
    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },

  mdPre: {
    background: '#0F172A',
    color: '#FFFFFF',
    padding: 16,
    borderRadius: 16,
    overflowX: 'auto',
    margin: '14px 0',
    fontSize: 14,
    lineHeight: 1.7,
  },

  mdHr: {
    border: 'none',
    borderTop: '1px solid #E2E8F0',
    margin: '18px 0',
  },

  mdBlockquote: {
    margin: '14px 0',
    padding: '12px 16px',
    borderLeft: '4px solid #38BDF8',
    background: '#EFF6FF',
    borderRadius: 12,
    color: '#1E3A8A',
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

  inputCard: {
    marginTop: 16,
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
    minHeight: 96,
    maxHeight: 220,
    fontSize: 15,
    outline: 'none',
    resize: 'none',
    lineHeight: 1.7,
    color: '#0F172A',
    background: '#FFFFFF',
    boxSizing: 'border-box',
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
    minWidth: 132,
    height: 48,
    borderRadius: 16,
    border: 'none',
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 800,
    boxShadow: '0 10px 20px rgba(15,23,42,0.16)',
  },
}