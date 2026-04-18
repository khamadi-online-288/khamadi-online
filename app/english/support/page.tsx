'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type TicketSubject =
  | 'Проблема с входом'
  | 'Проблема с курсом'
  | 'Технический сбой'
  | 'Вопрос по сертификату'
  | 'Другое'

const SUBJECTS: TicketSubject[] = [
  'Проблема с входом',
  'Проблема с курсом',
  'Технический сбой',
  'Вопрос по сертификату',
  'Другое',
]

const FAQ = [
  {
    q: 'Не могу войти в аккаунт',
    a: 'Убедитесь, что вы используете правильный email и пароль. Если забыли пароль — нажмите "Забыли пароль?" на странице входа. Также проверьте папку "Спам" в email.',
  },
  {
    q: 'Урок не засчитывается',
    a: 'Убедитесь, что вы прошли все задания урока до конца. Прогресс сохраняется автоматически при нажатии "Завершить урок". Проверьте стабильность интернет-соединения.',
  },
  {
    q: 'Сертификат не выдаётся',
    a: 'Сертификат выдаётся после прохождения всех уроков курса со средним баллом не менее 60%. Проверьте прогресс на странице курса и убедитесь, что все уроки отмечены как завершённые.',
  },
  {
    q: 'Проблема с аудио в Listening',
    a: 'Проверьте, что звук на устройстве не отключён. Попробуйте обновить страницу или использовать другой браузер (рекомендуем Chrome или Firefox). Убедитесь, что браузер имеет разрешение на воспроизведение звука.',
  },
  {
    q: 'Как сменить пароль',
    a: 'Перейдите в раздел "Профиль" → "Настройки" → "Сменить пароль". Введите текущий пароль и задайте новый. Или воспользуйтесь функцией "Забыли пароль?" на странице входа.',
  },
]

export default function SupportPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState<TicketSubject>('Проблема с входом')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [sendError, setSendError] = useState<string | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  useEffect(() => {
    async function prefill() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/english/login'); return }

      setEmail(session.user.email || '')
      setUserId(session.user.id)

      const { data: roleData } = await supabase
        .from('english_user_roles')
        .select('full_name')
        .eq('user_id', session.user.id)
        .maybeSingle()

      if ((roleData as { full_name: string | null } | null)?.full_name) {
        setName((roleData as { full_name: string }).full_name)
      }
    }
    prefill()
  }, [router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!message.trim()) return

    setSending(true)
    setSendError(null)

    try {
      const { error } = await supabase.from('english_support_tickets').insert({
        user_id: userId,
        subject,
        message: `От: ${name} <${email}>\n\n${message}`,
        status: 'open',
      })
      if (error) throw error

      setSent(true)
      setMessage('')
    } catch (e) {
      setSendError('Не удалось отправить. Попробуйте снова или напишите на email.')
      console.error(e)
    } finally {
      setSending(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main, Montserrat, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22, padding: 4 }}
          >
            ←
          </button>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>🛟 Техническая поддержка</span>
          <span style={{ marginLeft: 'auto', background: '#10b981', color: '#fff', borderRadius: 999, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            ● Онлайн 24/7
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
        {/* LEFT: Form */}
        <div>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <h2 style={{ margin: '0 0 24px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              Отправить обращение
            </h2>

            {sent ? (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(14,165,233,0.08))',
                borderRadius: 16,
              }}>
                <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: '#0f172a', marginBottom: 8 }}>
                  Обращение отправлено!
                </div>
                <div style={{ color: '#64748b', fontSize: 14, marginBottom: 20 }}>
                  Мы свяжемся с вами в течение 24 часов.
                </div>
                <button
                  onClick={() => setSent(false)}
                  style={{
                    background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '10px 24px',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 14,
                    cursor: 'pointer',
                  }}
                >
                  Новое обращение
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Имя
                  </label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="Ваше имя"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="your@email.com"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Тема обращения
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value as TicketSubject)}
                    style={{ ...inputStyle, cursor: 'pointer' }}
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>
                    Описание проблемы
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                    rows={5}
                    placeholder="Опишите вашу проблему подробно..."
                    style={{ ...inputStyle, resize: 'vertical', borderRadius: 14 }}
                  />
                </div>

                {sendError && (
                  <div style={{ color: '#ef4444', fontSize: 13, fontWeight: 600 }}>{sendError}</div>
                )}

                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    background: sending ? '#94a3b8' : 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '14px 0',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: sending ? 'not-allowed' : 'pointer',
                    transition: 'opacity 0.18s',
                  }}
                >
                  {sending ? 'Отправляем...' : 'Отправить обращение'}
                </button>
              </form>
            )}
          </div>

          {/* Contact info */}
          <div style={{ background: '#fff', borderRadius: 24, padding: 28, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginTop: 20 }}>
            <h3 style={{ margin: '0 0 16px', fontSize: 16, fontWeight: 800, color: '#0f172a' }}>
              Контакты поддержки
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <ContactItem icon="✉️" label="Email" value="support@khamadi-english.kz" />
              <ContactItem icon="📞" label="Телефон" value="+7 (700) 000-0000" />
              <ContactItem icon="🕐" label="Режим работы" value="24/7, без выходных" />
            </div>
          </div>
        </div>

        {/* RIGHT: FAQ */}
        <div>
          <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
            <h2 style={{ margin: '0 0 20px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
              Частые вопросы
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ.map((item, i) => (
                <div
                  key={i}
                  style={{
                    border: '1.5px solid',
                    borderColor: openFaq === i ? '#0ea5e9' : '#e2e8f0',
                    borderRadius: 14,
                    overflow: 'hidden',
                    transition: 'border-color 0.18s',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%',
                      background: openFaq === i ? 'rgba(14,165,233,0.06)' : '#fff',
                      border: 'none',
                      padding: '14px 18px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      fontSize: 14,
                      color: '#0f172a',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{
                      transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                      transition: 'transform 0.2s',
                      color: '#0ea5e9',
                      flexShrink: 0,
                    }}>▼</span>
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 18px 14px',
                      color: '#475569',
                      fontSize: 14,
                      lineHeight: 1.65,
                      background: 'rgba(14,165,233,0.03)',
                    }}>
                      {item.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Status banner */}
          <div style={{
            background: 'linear-gradient(135deg,#0f172a,#1e293b)',
            borderRadius: 20,
            padding: '20px 24px',
            marginTop: 20,
            color: '#fff',
          }}>
            <div style={{ fontWeight: 800, fontSize: 15, marginBottom: 8 }}>🟢 Все системы работают</div>
            <div style={{ color: '#94a3b8', fontSize: 13, lineHeight: 1.6 }}>
              Платформа работает в штатном режиме.<br />
              Среднее время ответа поддержки: <strong style={{ color: '#38bdf8' }}>2 часа</strong>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 700px) {
          div[style*="gridTemplateColumns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function ContactItem({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <span style={{ fontSize: 20, width: 28, flexShrink: 0 }}>{icon}</span>
      <div>
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>{label}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: '#0f172a' }}>{value}</div>
      </div>
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 999,
  fontSize: 14,
  fontFamily: 'var(--font-main, Montserrat, sans-serif)',
  color: '#0f172a',
  background: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
  transition: 'border-color 0.18s',
}
