'use client'
import { useMemo } from 'react'
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subDays } from 'date-fns'
import { AlertTriangle, TrendingUp } from 'lucide-react'

const LEVEL_COLORS = ['#1B3A6B','#1B8FC4','#10b981','#C9933B','#8b5cf6','#ef4444']

interface Props {
  atRiskCount: number
  avgScore: number
  activityLog: Record<string, unknown>[]
  recentUsers: Record<string, unknown>[]
  recentCerts: Record<string, unknown>[]
  levelDistribution: Record<string, number>
}

export default function AdminDashboardClient({ atRiskCount, avgScore, activityLog, recentUsers, recentCerts, levelDistribution }: Props) {
  const actChart = useMemo(() => {
    const m = new Map<string, number>()
    for (let i = 29; i >= 0; i--) m.set(format(subDays(new Date(), i), 'dd.MM'), 0)
    activityLog.forEach(a => {
      const k = format(new Date(a.created_at as string), 'dd.MM')
      m.set(k, (m.get(k) ?? 0) + 1)
    })
    return Array.from(m.entries()).map(([date, count]) => ({ date, count }))
  }, [activityLog])

  const pieData = Object.entries(levelDistribution).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        {/* Activity chart */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 18 }}>Активность студентов (30 дней)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={actChart}>
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
              <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Montserrat' }} />
              <Line type="monotone" dataKey="count" stroke="#1B8FC4" strokeWidth={2.5} dot={false} name="Действий" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Level pie */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.06)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 18 }}>Распределение уровней</div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} label={(entry: Record<string, unknown>) => `${String(entry.name ?? '')} ${((Number(entry.percent) || 0) * 100).toFixed(0)}%`} labelLine={false} style={{ fontSize: 11 }}>
                  {pieData.map((_, i) => <Cell key={i} fill={LEVEL_COLORS[i % LEVEL_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 10, fontFamily: 'Montserrat', fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <div style={{ height: 160, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>Нет данных</div>}
        </div>
      </div>

      {/* Avg score banner */}
      {avgScore > 0 && (
        <div style={{ background: 'linear-gradient(135deg, #1B3A6B 0%, #1B8FC4 100%)', borderRadius: 16, padding: '18px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <TrendingUp size={22} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>Средний балл по платформе</div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#fff' }}>{avgScore}%</div>
          </div>
          <div style={{ marginLeft: 'auto', fontSize: 13, color: 'rgba(255,255,255,0.55)', maxWidth: 220, textAlign: 'right' as const }}>
            На основе всех оценок в системе
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Recent users */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 16 }}>Новые пользователи</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentUsers.map(u => (
              <div key={u.id as string} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 10, background: '#f8fafc' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{u.full_name as string ?? '—'}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{u.created_at ? new Date(u.created_at as string).toLocaleDateString('ru-RU') : ''}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent certs */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 16 }}>Последние сертификаты</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {recentCerts.map(c => {
              const cert = c as { id: string; issued_at: string; final_score?: number; student?: { full_name?: string }; course?: { title?: string } }
              return (
                <div key={cert.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: 10, background: '#f8fafc' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{cert.student?.full_name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#64748b' }}>{cert.course?.title ?? '—'}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    {cert.final_score != null && <div style={{ fontSize: 14, fontWeight: 900, color: '#10b981' }}>{cert.final_score}%</div>}
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(cert.issued_at).toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
              )
            })}
            {recentCerts.length === 0 && <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет сертификатов</div>}
          </div>
        </div>
      </div>

      {/* At-risk alert */}
      {atRiskCount > 0 && (
        <div style={{ background: '#fff7ed', borderRadius: 16, padding: '16px 20px', border: '1.5px solid rgba(239,68,68,0.25)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <AlertTriangle size={22} color="#ef4444" />
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626' }}>{atRiskCount} студентов без активности более 14 дней</div>
            <div style={{ fontSize: 12, color: '#64748b' }}>Рекомендуется проверить их прогресс и связаться с ними</div>
          </div>
        </div>
      )}
    </div>
  )
}
