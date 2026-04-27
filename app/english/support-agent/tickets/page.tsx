'use client'
import { useEffect, useState, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import Link from 'next/link'
import { Search, Filter } from 'lucide-react'

type Ticket = {
  id: string; ticket_number: number; subject: string; status: string
  priority: string; category: string | null; created_at: string; updated_at: string
  user: { full_name: string | null; email: string | null } | null
  assignee: { full_name: string | null } | null
}

type StatusTab = 'open' | 'in_progress' | 'resolved' | 'all'

const CAT_LABELS: Record<string, string> = { technical:'🔧 Техническая', course:'📚 Курс', account:'👤 Аккаунт', certificate:'🏆 Сертификат', other:'📝 Другое' }
const PRIO_COLORS: Record<string, string> = { urgent:'#ef4444', normal:'#64748b', low:'#94a3b8' }
const PRIO_LABELS: Record<string, string> = { urgent:'Срочный', normal:'Обычный', low:'Низкий' }
const STATUS_COLORS: Record<string, string> = { open:'#1B8FC4', in_progress:'#C9933B', resolved:'#10b981', closed:'#64748b' }
const STATUS_LABELS: Record<string, string> = { open:'Открыт', in_progress:'В работе', resolved:'Решён', closed:'Закрыт' }

export default function AgentTicketsPage() {
  const [tickets, setTickets]   = useState<Ticket[]>([])
  const [loading, setLoading]   = useState(true)
  const [tab, setTab]           = useState<StatusTab>('open')
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [prioFilter, setPrioFilter] = useState('')
  const supabase = createEnglishClient()

  useEffect(() => {
    supabase
      .from('english_support_tickets')
      .select('id,ticket_number,subject,status,priority,category,created_at,updated_at,user:user_id(full_name,email),assignee:assigned_to(full_name)')
      .order('updated_at', { ascending: false })
      .limit(300)
      .then(({ data }) => {
        setTickets((data ?? []) as unknown as Ticket[])
        setLoading(false)
      })
  }, [])

  const filtered = useMemo(() => {
    let list = tickets
    if (tab !== 'all') list = list.filter(t => t.status === tab)
    if (catFilter)  list = list.filter(t => t.category === catFilter)
    if (prioFilter) list = list.filter(t => t.priority === prioFilter)
    if (search.trim()) {
      const q = search.trim().toLowerCase()
      list = list.filter(t =>
        t.subject.toLowerCase().includes(q) ||
        (t.user?.full_name ?? '').toLowerCase().includes(q) ||
        (t.user?.email ?? '').toLowerCase().includes(q) ||
        String(t.ticket_number).includes(q)
      )
    }
    return list
  }, [tickets, tab, catFilter, prioFilter, search])

  const counts = useMemo(() => ({
    open:        tickets.filter(t => t.status === 'open').length,
    in_progress: tickets.filter(t => t.status === 'in_progress').length,
    resolved:    tickets.filter(t => t.status === 'resolved').length,
    all:         tickets.length,
  }), [tickets])

  const inputStyle: React.CSSProperties = { padding: '9px 12px', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#1A2535', color: '#fff', outline: 'none' }

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 24 }}>Тикеты</div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: 4, width: 'fit-content', border: '1px solid rgba(255,255,255,0.06)' }}>
        {([['open','Открытые'],['in_progress','В работе'],['resolved','Решённые'],['all','Все']] as [StatusTab,string][]).map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} style={{ padding: '8px 16px', borderRadius: 9, fontWeight: tab === id ? 800 : 600, fontSize: 13, border: 'none', background: tab === id ? '#1B8FC4' : 'transparent', color: tab === id ? '#fff' : 'rgba(255,255,255,0.45)', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.15s' }}>
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' as const }}>
        <div style={{ position: 'relative' as const, flex: 1, minWidth: 220 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)' }} />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по теме, студенту, #..." style={{ ...inputStyle, width: '100%', paddingLeft: 36, boxSizing: 'border-box' as const }} />
        </div>
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={inputStyle}>
          <option value="">Все категории</option>
          {Object.entries(CAT_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
        <select value={prioFilter} onChange={e => setPrioFilter(e.target.value)} style={inputStyle}>
          <option value="">Все приоритеты</option>
          {Object.entries(PRIO_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      </div>

      {/* Table */}
      <div style={{ background: '#1A2535', borderRadius: 18, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Загрузка...</div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 40, textAlign: 'center', color: 'rgba(255,255,255,0.3)' }}>Тикетов нет</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['#','Студент','Тема','Категория','Приоритет','Статус','Обновлён'].map(h => (
                  <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.06em', textTransform: 'uppercase' as const }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(t => {
                const user = t.user as { full_name?: string | null; email?: string | null } | null
                return (
                  <tr key={t.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget as HTMLTableRowElement).style.background = 'rgba(27,143,196,0.07)'}
                    onMouseLeave={e => (e.currentTarget as HTMLTableRowElement).style.background = 'transparent'}>
                    <td style={{ padding: '14px 16px' }}>
                      <Link href={`/english/support-agent/tickets/${t.id}`} style={{ textDecoration: 'none' }}>
                        <span style={{ fontSize: 13, fontWeight: 800, color: '#1B8FC4' }}>#{t.ticket_number}</span>
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user?.full_name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{user?.email ?? ''}</div>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 13, color: 'rgba(255,255,255,0.75)', maxWidth: 280 }}>
                      <Link href={`/english/support-agent/tickets/${t.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        {t.subject.length > 55 ? t.subject.slice(0,55)+'…' : t.subject}
                      </Link>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{t.category ? CAT_LABELS[t.category] ?? t.category : '—'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ fontSize: 12, fontWeight: 700, color: PRIO_COLORS[t.priority] ?? '#64748b' }}>
                        {t.priority === 'urgent' ? '🔴' : t.priority === 'low' ? '⚪' : '🔵'} {PRIO_LABELS[t.priority] ?? t.priority}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <span style={{ background: `${STATUS_COLORS[t.status] ?? '#64748b'}22`, color: STATUS_COLORS[t.status] ?? '#64748b', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 700 }}>
                        {STATUS_LABELS[t.status] ?? t.status}
                      </span>
                    </td>
                    <td style={{ padding: '14px 16px', fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>
                      {new Date(t.updated_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
