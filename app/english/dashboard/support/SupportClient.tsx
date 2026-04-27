'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { ChevronDown, ChevronRight, Search } from 'lucide-react'

type Ticket = { id: string; ticket_number: number; subject: string; status: string; priority: string; category: string | null; created_at: string; updated_at: string }
type FAQ    = { id: string; category: string; question: string; answer: string }
type StatusInc = { id: string; title: string; status: string; severity: string; created_at: string; resolved_at: string | null }
type SupportTab = 'tickets' | 'create' | 'faq' | 'status'

const STATUS_COLORS: Record<string,string> = { open:'#1B8FC4', in_progress:'#C9933B', resolved:'#10b981', closed:'#64748b' }
const STATUS_LABELS: Record<string,string> = { open:'Открыт', in_progress:'В работе', resolved:'Решён', closed:'Закрыт' }
const CAT_ICONS:  Record<string,string> = { technical:'🔧', course:'📚', account:'👤', certificate:'🏆', other:'📝' }
const CAT_LABELS: Record<string,string> = { technical:'Техническая проблема', course:'Вопрос по курсу', account:'Аккаунт', certificate:'Сертификат', other:'Другое' }

type Props = { userId: string; userEmail: string; userName: string }

export default function SupportClient({ userId, userEmail, userName }: Props) {
  const router  = useRouter()
  const supabase = createEnglishClient()
  const [tab,       setTab]      = useState<SupportTab>('tickets')
  const [tickets,   setTickets]  = useState<Ticket[]>([])
  const [faq,       setFaq]      = useState<FAQ[]>([])
  const [statuses,  setStatuses] = useState<StatusInc[]>([])
  const [faqOpen,   setFaqOpen]  = useState<string | null>(null)
  const [faqQuery,  setFaqQuery] = useState('')
  const [form,      setForm]     = useState({ category: 'technical', subject: '', description: '' })
  const [creating,  setCreating] = useState(false)
  const [createErr, setCreateErr] = useState('')

  useEffect(() => {
    supabase.from('english_support_tickets').select('id,ticket_number,subject,status,priority,category,created_at,updated_at').eq('user_id', userId).order('created_at', { ascending: false })
      .then(({ data }) => setTickets((data ?? []) as Ticket[]))
    supabase.from('english_support_faq').select('id,category,question,answer').eq('is_published', true).order('category').order('order_index')
      .then(({ data }) => setFaq((data ?? []) as FAQ[]))
    supabase.from('english_platform_status').select('id,title,status,severity,created_at,resolved_at').order('created_at', { ascending: false }).limit(10)
      .then(({ data }) => setStatuses((data ?? []) as StatusInc[]))
  }, [userId])

  async function createTicket(e: React.FormEvent) {
    e.preventDefault()
    if (!form.subject.trim() || !form.description.trim()) { setCreateErr('Заполните все поля'); return }
    setCreating(true); setCreateErr('')
    const { data: ticket, error } = await supabase.from('english_support_tickets').insert({ user_id: userId, category: form.category, subject: form.subject, priority: 'normal', status: 'open' }).select('id,ticket_number').single()
    if (error || !ticket) { setCreateErr('Ошибка создания тикета'); setCreating(false); return }
    const ticketData = ticket as { id: string; ticket_number: number }
    await supabase.from('english_support_messages').insert({ ticket_id: ticketData.id, sender_id: userId, body: form.description, is_internal: false })
    const { data: staff } = await supabase.from('english_user_roles').select('user_id').in('role', ['admin','support'])
    if (staff?.length) {
      await supabase.from('english_notifications').insert(
        (staff as { user_id: string }[]).map(s => ({ user_id: s.user_id, title: `Новый тикет #${ticketData.ticket_number}`, body: `${userName}: ${form.subject}`, type: 'system' }))
      )
    }
    setCreating(false)
    router.push(`/english/dashboard/support/tickets/${ticketData.id}`)
  }

  const filteredFaq = faqQuery.trim()
    ? faq.filter(f => f.question.toLowerCase().includes(faqQuery.toLowerCase()) || f.answer.toLowerCase().includes(faqQuery.toLowerCase()))
    : faq
  const faqByCategory = Array.from(new Set(filteredFaq.map(f => f.category))).map(cat => ({ cat, items: filteredFaq.filter(f => f.category === cat) }))
  const activeIncidents = statuses.filter(s => s.status !== 'resolved')
  const overallOk = activeIncidents.length === 0

  const tabStyle = (id: SupportTab): React.CSSProperties => ({
    padding: '10px 20px', borderRadius: 10, fontWeight: tab === id ? 800 : 600, fontSize: 13,
    border: 'none', background: tab === id ? '#1B3A6B' : 'transparent',
    color: tab === id ? '#fff' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.15s',
  })

  return (
    <div style={{ maxWidth: 780 }}>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>Поддержка</div>
        <div style={{ fontSize: 14, color: '#64748b' }}>Задайте вопрос, найдите ответ в FAQ или проверьте статус платформы</div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        <button style={tabStyle('tickets')} onClick={() => setTab('tickets')}>Мои тикеты ({tickets.length})</button>
        <button style={tabStyle('create')}  onClick={() => setTab('create')}>Создать тикет</button>
        <button style={tabStyle('faq')}     onClick={() => setTab('faq')}>FAQ</button>
        <button style={tabStyle('status')}  onClick={() => setTab('status')}>
          {!overallOk && <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444', display: 'inline-block', marginRight: 6, verticalAlign: 'middle' }} />}
          Статус
        </button>
      </div>

      {/* My Tickets */}
      {tab === 'tickets' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {tickets.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🎫</div>
              <div style={{ fontWeight: 700 }}>Тикетов нет.{' '}
                <button onClick={() => setTab('create')} style={{ color: '#1B8FC4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 14, fontFamily: 'Montserrat' }}>Создать первый →</button>
              </div>
            </div>
          ) : tickets.map(t => (
            <div key={t.id} onClick={() => router.push(`/english/dashboard/support/tickets/${t.id}`)}
              style={{ background: '#fff', borderRadius: 16, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'box-shadow 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 4px 16px rgba(27,143,196,0.12)' }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: STATUS_COLORS[t.status] ?? '#64748b', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, marginBottom: 2 }}>#{t.ticket_number} · {t.category ? CAT_LABELS[t.category] ?? t.category : ''}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{t.subject}</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <span style={{ background: `${STATUS_COLORS[t.status] ?? '#64748b'}18`, color: STATUS_COLORS[t.status] ?? '#64748b', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 700 }}>
                  {STATUS_LABELS[t.status] ?? t.status}
                </span>
                <span style={{ fontSize: 12, color: '#94a3b8' }}>{new Date(t.updated_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}</span>
                <ChevronRight size={16} color="#94a3b8" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Ticket */}
      {tab === 'create' && (
        <form onSubmit={createTicket} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)' }}>
          <div style={{ fontSize: 16, fontWeight: 900, color: '#1B3A6B', marginBottom: 20 }}>Новый тикет</div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: '#475569', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Категория</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 8 }}>
              {Object.entries(CAT_LABELS).map(([val, lbl]) => (
                <button key={val} type="button" onClick={() => setForm(f => ({ ...f, category: val }))}
                  style={{ padding: '12px 8px', borderRadius: 12, border: form.category === val ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.15)', background: form.category === val ? '#f0f9ff' : '#f8fafc', cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'center' as const }}>
                  <div style={{ fontSize: 22, marginBottom: 5 }}>{CAT_ICONS[val]}</div>
                  <div style={{ fontSize: 11, fontWeight: form.category === val ? 800 : 600, color: form.category === val ? '#1B3A6B' : '#64748b', lineHeight: 1.3 }}>{lbl.split(' ')[0]}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Тема *</label>
            <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))} placeholder="Кратко опишите проблему"
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }} />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 12, fontWeight: 800, color: '#475569', display: 'block', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>Описание *</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={5} placeholder="Подробно опишите проблему."
              style={{ width: '100%', padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', resize: 'vertical' as const, lineHeight: 1.7, boxSizing: 'border-box' as const }} />
          </div>
          {createErr && <div style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 14 }}>{createErr}</div>}
          <button type="submit" disabled={creating} style={{ padding: '13px 28px', borderRadius: 14, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: creating ? 'default' : 'pointer', fontFamily: 'Montserrat', opacity: creating ? 0.7 : 1 }}>
            {creating ? 'Отправка...' : 'Отправить тикет →'}
          </button>
        </form>
      )}

      {/* FAQ */}
      {tab === 'faq' && (
        <div>
          <div style={{ position: 'relative', marginBottom: 20 }}>
            <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={faqQuery} onChange={e => setFaqQuery(e.target.value)} placeholder="Поиск по FAQ..."
              style={{ width: '100%', padding: '12px 14px 12px 42px', border: '1.5px solid rgba(27,143,196,0.15)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#fff', boxSizing: 'border-box' as const }} />
          </div>
          {faqByCategory.map(({ cat, items }) => (
            <div key={cat} style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#1B8FC4', marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.07em' }}>{CAT_LABELS[cat] ?? cat}</div>
              {items.map(f => (
                <div key={f.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden', marginBottom: 6 }}>
                  <div onClick={() => setFaqOpen(o => o === f.id ? null : f.id)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 18px', cursor: 'pointer' }}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{f.question}</span>
                    {faqOpen === f.id ? <ChevronDown size={16} color="#1B8FC4" /> : <ChevronRight size={16} color="#94a3b8" />}
                  </div>
                  {faqOpen === f.id && <div style={{ padding: '0 18px 16px', fontSize: 13, color: '#475569', lineHeight: 1.75, borderTop: '1px solid rgba(27,143,196,0.07)' }}>{f.answer}</div>}
                </div>
              ))}
            </div>
          ))}
          {filteredFaq.length === 0 && <div style={{ textAlign: 'center', padding: 40, color: '#94a3b8' }}>Ничего не найдено</div>}
        </div>
      )}

      {/* Platform Status */}
      {tab === 'status' && (
        <div>
          <div style={{ background: overallOk ? 'linear-gradient(135deg,rgba(16,185,129,0.08),rgba(255,255,255,0.9))' : 'linear-gradient(135deg,rgba(239,68,68,0.08),rgba(255,255,255,0.9))', borderRadius: 20, padding: '28px 32px', border: `1.5px solid ${overallOk ? 'rgba(16,185,129,0.2)' : 'rgba(239,68,68,0.2)'}`, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ fontSize: 52 }}>{overallOk ? '🟢' : '🟡'}</div>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>{overallOk ? 'Все системы работают нормально' : `Обнаружены проблемы (${activeIncidents.length})`}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginTop: 4 }}>Последнее обновление: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>
          {activeIncidents.length > 0 ? activeIncidents.map(inc => (
            <div key={inc.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1.5px solid rgba(239,68,68,0.18)', borderLeft: '4px solid #ef4444', marginBottom: 10 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 4 }}>{inc.title}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{new Date(inc.created_at).toLocaleString('ru-RU')}</div>
            </div>
          )) : <div style={{ textAlign: 'center', color: '#94a3b8', padding: 32, fontSize: 14 }}>Всё работает штатно.</div>}
        </div>
      )}
    </div>
  )
}
