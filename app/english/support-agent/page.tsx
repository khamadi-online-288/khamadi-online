'use client'
import { useEffect, useMemo, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { AlertTriangle, Clock } from 'lucide-react'
import Link from 'next/link'

type Ticket = { id: string; ticket_number: number; subject: string; status: string; priority: string; created_at: string; user_id: string; user?: { full_name: string | null } | null }

const WEEK_DAYS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс']

export default function SupportDashboardPage() {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [avgRating, setAvgRating] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [agentName, setAgentName] = useState('')
  const supabase = createEnglishClient()

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      const [roleRes, ticketsRes, ratingRes] = await Promise.all([
        supabase.from('english_user_roles').select('full_name').eq('user_id', session.user.id).maybeSingle(),
        supabase.from('english_support_tickets').select('id,ticket_number,subject,status,priority,created_at,user_id,user:user_id(full_name)').order('created_at', { ascending: false }).limit(100),
        supabase.from('english_support_tickets').select('rating').not('rating', 'is', null),
      ])

      setAgentName((roleRes.data as { full_name: string | null } | null)?.full_name ?? 'Агент')
      const rawTickets = (ticketsRes.data ?? []) as unknown as Ticket[]
      setTickets(rawTickets)

      const ratings = ((ratingRes.data ?? []) as { rating: number }[]).map(r => r.rating)
      setAvgRating(ratings.length ? +(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1) : null)
      setLoading(false)
    }
    load()
  }, [])

  const openCount      = useMemo(() => tickets.filter(t => t.status === 'open').length, [tickets])
  const inProgressCount= useMemo(() => tickets.filter(t => t.status === 'in_progress').length, [tickets])
  const resolvedToday  = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]
    return tickets.filter(t => t.status === 'resolved' && t.created_at.startsWith(today)).length
  }, [tickets])

  const urgentTickets = useMemo(() => tickets.filter(t => t.priority === 'urgent' && ['open','in_progress'].includes(t.status)).slice(0, 5), [tickets])

  const weekChart = useMemo(() => {
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (6 - i))
      return { date: d.toISOString().split('T')[0], label: WEEK_DAYS[(d.getDay() + 6) % 7], count: 0 }
    })
    tickets.forEach(t => {
      const day = t.created_at.split('T')[0]
      const entry = days.find(d => d.date === day)
      if (entry) entry.count++
    })
    return days
  }, [tickets])

  const now = new Date()
  const dateLabel = now.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })

  const card = (color: string, bg: string, label: string, value: number | string) => (
    <div style={{ background: '#1A2535', borderRadius: 18, padding: '22px 24px', border: `1px solid ${color}28` }}>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.4)', marginBottom: 8, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: 38, fontWeight: 900, color, letterSpacing: '-0.05em', lineHeight: 1 }}>{loading ? '—' : value}</div>
    </div>
  )

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.03em' }}>Добрый день, {agentName} 👋</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{dateLabel}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
        {card('#ef4444','#fee2e2','Открытых',    openCount)}
        {card('#1B8FC4','#e0f2fe','В работе',    inProgressCount)}
        {card('#10b981','#dcfce7','Решено сегодня',resolvedToday)}
        {card('#C9933B','#fef3c7','Средняя оценка', avgRating ? `${avgRating} ★` : '—')}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Urgent */}
        <div style={{ background: '#1A2535', borderRadius: 18, padding: 24, border: '1px solid rgba(239,68,68,0.18)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="#ef4444" />
            <span style={{ fontSize: 14, fontWeight: 800, color: '#ef4444' }}>Срочные тикеты</span>
          </div>
          {urgentTickets.length === 0 ? (
            <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13, padding: '16px 0' }}>Срочных тикетов нет</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {urgentTickets.map(t => {
                const user = t.user as { full_name?: string | null } | null
                const minsAgo = Math.round((Date.now() - new Date(t.created_at).getTime()) / 60000)
                const timeLabel = minsAgo < 60 ? `${minsAgo} мин назад` : `${Math.round(minsAgo/60)} ч назад`
                return (
                  <Link key={t.id} href={`/english/support-agent/tickets/${t.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.12)' }}>
                      <div>
                        <div style={{ fontSize: 12, color: '#ef4444', fontWeight: 700, marginBottom: 2 }}>#{t.ticket_number}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{user?.full_name ?? 'Студент'}</div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)' }}>{t.subject.length > 40 ? t.subject.slice(0,40)+'...' : t.subject}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>
                        <Clock size={11} />{timeLabel}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>

        {/* Weekly chart */}
        <div style={{ background: '#1A2535', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Тикеты за неделю</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={weekChart}>
              <XAxis dataKey="label" tick={{ fontSize: 11, fill: 'rgba(255,255,255,0.4)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: 'rgba(255,255,255,0.3)' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1E2D40', border: 'none', borderRadius: 10, color: '#fff', fontFamily: 'Montserrat', fontSize: 12 }} cursor={{ fill: 'rgba(27,143,196,0.1)' }} />
              <Bar dataKey="count" fill="#1B8FC4" radius={[4,4,0,0]} name="Тикетов" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
