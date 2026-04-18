'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type StudentRow = {
  user_id: string
  full_name: string | null
  total_lessons: number
  completed_lessons: number
  avg_score: number
  certificates: number
  hours: number
}

type Ticket = {
  id: string
  subject: string
  message: string
  status: string
  created_at: string
}

export default function TeacherPage() {
  const router = useRouter()
  const [students,   setStudents]   = useState<StudentRow[]>([])
  const [loading,    setLoading]    = useState(true)
  const [totalCerts, setTotalCerts] = useState(0)
  const [tickets,    setTickets]    = useState<Ticket[]>([])
  const [courseFilter, setCourseFilter] = useState('Все')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }

      const { data: roleData } = await supabase
        .from('english_user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if ((roleData as { role: string } | null)?.role !== 'teacher') {
        router.push('/english/dashboard')
        return
      }

      const [rolesRes, progressRes, certsRes, sessionsRes, ticketsRes] = await Promise.all([
        supabase.from('english_user_roles').select('user_id, full_name, role'),
        supabase.from('english_progress').select('user_id, lesson_id, completed, score'),
        supabase.from('english_certificates').select('user_id, id'),
        supabase.from('english_study_sessions').select('user_id, duration_minutes'),
        supabase.from('english_support_tickets').select('id, subject, message, status, created_at').order('created_at', { ascending: false }).limit(20),
      ])

      const roles = ((rolesRes.data || []) as { user_id: string; full_name: string | null; role: string }[])
        .filter(r => r.role === 'student')

      const progressAll = (progressRes.data || []) as { user_id: string; lesson_id: string; completed: boolean; score: number | null }[]
      const certsAll    = (certsRes.data || []) as { user_id: string; id: string }[]
      const sessionsAll = (sessionsRes.data || []) as { user_id: string; duration_minutes: number | null }[]

      setTotalCerts(certsAll.length)
      setTickets((ticketsRes.data || []) as Ticket[])

      const rows: StudentRow[] = roles.map(r => {
        const userProgress = progressAll.filter(p => p.user_id === r.user_id)
        const completed    = userProgress.filter(p => p.completed)
        const scores       = userProgress.map(p => p.score).filter((s): s is number => s !== null)
        const avg          = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        const userCerts    = certsAll.filter(c => c.user_id === r.user_id).length
        const mins         = sessionsAll.filter(s => s.user_id === r.user_id).reduce((acc, s) => acc + (s.duration_minutes || 0), 0)
        return {
          user_id: r.user_id,
          full_name: r.full_name,
          total_lessons: userProgress.length,
          completed_lessons: completed.length,
          avg_score: avg,
          certificates: userCerts,
          hours: Math.round(mins / 60),
        }
      })

      setStudents(rows.sort((a, b) => b.completed_lessons - a.completed_lessons))
      setLoading(false)
    }
    load()
  }, [router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка данных...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(14,165,233,0.1)',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>KHAMADI ENGLISH</span>
            <span className="badge-pill" style={{ fontSize: 11 }}>👩‍💼 Преподаватель</span>
          </div>
          <button className="btn-secondary" onClick={() => router.push('/english/dashboard')} style={{ padding: '8px 16px', fontSize: 13 }}>
            ← Дашборд
          </button>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 5%', position: 'relative', zIndex: 1 }}>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <div className="section-kicker">Учитель</div>
          <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', margin: 0 }}>Панель преподавателя</h1>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Студентов',         value: students.length,                                          color: '#0ea5e9' },
            { label: 'Сертификатов',      value: totalCerts,                                               color: '#22c55e' },
            { label: 'Уроков завершено',  value: students.reduce((s, r) => s + r.completed_lessons, 0),   color: '#38bdf8' },
          ].map((s, i) => (
            <div key={s.label} className={`dashboard-card fade-up delay-${i + 1}`} style={{ padding: '24px 20px', textAlign: 'center' }}>
              <div className="card-label">{s.label}</div>
              <div className="metric-value" style={{ color: s.color }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Students Table */}
        <div className="dashboard-card fade-up delay-2" style={{ overflow: 'hidden', padding: 0 }}>
          <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(14,165,233,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e' }}>Все студенты ({students.length})</div>
            <button
              onClick={() => {
                const header = 'Имя,Уроков пройдено,Средний балл,Сертификаты,Часов'
                const rows = students.map(s =>
                  `"${s.full_name || '—'}",${s.completed_lessons},${s.avg_score},${s.certificates},${s.hours}`
                )
                const csv = [header, ...rows].join('\n')
                const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
                const a = document.createElement('a')
                a.href = URL.createObjectURL(blob)
                a.download = `students_${new Date().toISOString().slice(0,10)}.csv`
                a.click()
                URL.revokeObjectURL(a.href)
              }}
              className="btn-secondary"
              style={{ padding: '8px 18px', fontSize: 13 }}
            >
              ⬇️ Экспорт CSV
            </button>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(14,165,233,0.1)', background: '#f8fafc' }}>
                  {['Имя студента', 'Уроки пройдены', 'Средний балл', 'Сертификаты', 'Часов', 'Прогресс'].map(h => (
                    <th key={h} style={{ padding: '14px 20px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {students.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ padding: '48px', textAlign: 'center' }}>
                      <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                      <div style={{ color: '#94a3b8', fontWeight: 700 }}>Нет зарегистрированных студентов</div>
                    </td>
                  </tr>
                ) : students.map((s) => {
                  const pct = s.total_lessons > 0 ? Math.round((s.completed_lessons / s.total_lessons) * 100) : 0
                  return (
                    <tr
                      key={s.user_id}
                      style={{ borderBottom: '1px solid rgba(14,165,233,0.06)', transition: 'background 0.15s' }}
                      onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.background = '#f0f9ff' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.background = '' }}
                    >
                      <td style={{ padding: '14px 20px', fontWeight: 800, fontSize: 14, color: '#0c4a6e' }}>
                        {s.full_name || <span style={{ color: '#94a3b8' }}>Без имени</span>}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: '#0ea5e9' }}>{s.completed_lessons}</span>
                        <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}> / {s.total_lessons}</span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span className="badge-pill" style={{
                          fontSize: 12, padding: '4px 12px',
                          background: s.avg_score >= 70 ? 'rgba(34,197,94,0.1)' : s.avg_score > 0 ? 'rgba(14,165,233,0.08)' : 'rgba(148,163,184,0.1)',
                          borderColor: s.avg_score >= 70 ? 'rgba(34,197,94,0.25)' : s.avg_score > 0 ? 'rgba(14,165,233,0.2)' : 'rgba(148,163,184,0.2)',
                          color: s.avg_score >= 70 ? '#16a34a' : s.avg_score > 0 ? '#0369a1' : '#94a3b8',
                        }}>
                          {s.avg_score > 0 ? `${s.avg_score}%` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: s.certificates > 0 ? '#22c55e' : '#94a3b8' }}>
                          {s.certificates > 0 ? `🏆 ${s.certificates}` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '14px 20px', fontWeight: 700, fontSize: 14, color: '#0f172a' }}>
                        {s.hours > 0 ? `${s.hours}ч` : '—'}
                      </td>
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <div className="progress-line" style={{ flex: 1, minWidth: 80 }}>
                            <div className="progress-fill" style={{ width: `${pct}%` }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', minWidth: 35 }}>{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
        {/* Support Tickets */}
        <div className="dashboard-card fade-up delay-3" style={{ overflow: 'hidden', padding: 0, marginTop: 24 }}>
          <div style={{ padding: '22px 28px', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e' }}>
              🛟 Обращения в поддержку ({tickets.length})
            </div>
          </div>
          {tickets.length === 0 ? (
            <div style={{ padding: '40px', textAlign: 'center', color: '#94a3b8', fontWeight: 700 }}>
              Нет обращений в поддержку
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f8fafc', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
                    {['Тема', 'Сообщение', 'Статус', 'Дата'].map(h => (
                      <th key={h} style={{ padding: '12px 20px', textAlign: 'left', fontSize: 11, fontWeight: 900, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tickets.map(t => (
                    <tr key={t.id} style={{ borderBottom: '1px solid rgba(14,165,233,0.06)' }}>
                      <td style={{ padding: '12px 20px', fontWeight: 700, fontSize: 13, color: '#0c4a6e', whiteSpace: 'nowrap' }}>{t.subject}</td>
                      <td style={{ padding: '12px 20px', fontSize: 13, color: '#64748b', maxWidth: 300 }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.message}</div>
                      </td>
                      <td style={{ padding: '12px 20px' }}>
                        <span style={{
                          padding: '3px 10px',
                          borderRadius: 999,
                          fontSize: 11,
                          fontWeight: 700,
                          background: t.status === 'open' ? 'rgba(239,68,68,0.1)' : t.status === 'resolved' ? 'rgba(34,197,94,0.1)' : 'rgba(14,165,233,0.08)',
                          color: t.status === 'open' ? '#ef4444' : t.status === 'resolved' ? '#16a34a' : '#0369a1',
                        }}>
                          {t.status === 'open' ? 'Открыт' : t.status === 'resolved' ? 'Решён' : t.status}
                        </span>
                      </td>
                      <td style={{ padding: '12px 20px', fontSize: 12, color: '#94a3b8', whiteSpace: 'nowrap' }}>
                        {new Date(t.created_at).toLocaleDateString('ru-RU')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
