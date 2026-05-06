'use client'
import { useEffect, useState, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { format, subDays } from 'date-fns'
import { TrendingUp, Users, Award, BookOpen, RefreshCw } from 'lucide-react'

const LEVEL_COLORS: Record<string, string> = { A1: '#10b981', A2: '#3b82f6', B1: '#8b5cf6', B2: '#C9933B', C1: '#ef4444', C2: '#1B3A6B' }
const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }

interface TopStudent { id: string; full_name: string; language_level: string | null; avgScore: number; completed: number }

export default function AdminAnalyticsPage() {
  const supabase = createEnglishClient()
  const [loading, setLoading] = useState(true)
  const [actLog, setActLog] = useState<{ created_at: string }[]>([])
  const [levelDist, setLevelDist] = useState<Record<string, number>>({})
  const [scoreByLevel, setScoreByLevel] = useState<{ level: string; avg: number }[]>([])
  const [topStudents, setTopStudents] = useState<TopStudent[]>([])
  const [completionRate, setCompletionRate] = useState(0)
  const [totalStudents, setTotalStudents] = useState(0)
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [totalCerts, setTotalCerts] = useState(0)

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

    const [rolesRes, actRes, certsRes] = await Promise.all([
      supabase.from('english_user_roles').select('user_id, current_level').eq('role', 'student'),
      supabase.from('lms_activity_log').select('created_at').gte('created_at', monthAgo).limit(1000),
      supabase.from('lms_certificates').select('id', { count: 'exact', head: true }),
    ])

    const roles = (rolesRes.data ?? []) as { user_id: string; current_level: string | null }[]
    const studentIds = roles.map(r => r.user_id)
    setTotalStudents(studentIds.length)
    setTotalCerts(certsRes.count ?? 0)
    setActLog((actRes.data ?? []) as { created_at: string }[])

    const lm: Record<string, number> = {}
    roles.forEach(r => { if (r.current_level) lm[r.current_level] = (lm[r.current_level] ?? 0) + 1 })
    setLevelDist(lm)

    if (!studentIds.length) { setLoading(false); return }

    const [progressRes, gradesRes, profilesRes] = await Promise.all([
      supabase.from('lms_progress').select('student_id, status').in('student_id', studentIds),
      supabase.from('lms_grades').select('student_id, score, max_score').in('student_id', studentIds),
      supabase.from('profiles').select('id, full_name, language_level').in('id', studentIds),
    ])

    const progRows = (progressRes.data ?? []) as { student_id: string; status: string }[]
    const totalProg  = progRows.length
    const completedN = progRows.filter(p => p.status === 'completed').length
    setTotalCompleted(completedN)
    setCompletionRate(totalProg > 0 ? Math.round((completedN / totalProg) * 100) : 0)

    const gradeRows = (gradesRes.data ?? []) as { student_id: string; score: number; max_score: number }[]
    const scoreMapByLevel: Record<string, number[]> = {}
    const studentLevelMap: Record<string, string> = {}
    ;(profilesRes.data ?? []).forEach((p: unknown) => {
      const pr = p as { id: string; language_level?: string | null }
      if (pr.language_level) studentLevelMap[pr.id] = pr.language_level
    })
    gradeRows.forEach(g => {
      const lvl = studentLevelMap[g.student_id]
      if (lvl && g.max_score > 0) {
        if (!scoreMapByLevel[lvl]) scoreMapByLevel[lvl] = []
        scoreMapByLevel[lvl].push((g.score / g.max_score) * 100)
      }
    })
    setScoreByLevel(Object.entries(scoreMapByLevel).map(([level, scores]) => ({
      level,
      avg: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    })).sort((a, b) => ['A1','A2','B1','B2','C1','C2'].indexOf(a.level) - ['A1','A2','B1','B2','C1','C2'].indexOf(b.level)))

    // Top students
    const studentScoreMap: Record<string, number[]> = {}
    gradeRows.forEach(g => {
      if (g.max_score > 0) {
        if (!studentScoreMap[g.student_id]) studentScoreMap[g.student_id] = []
        studentScoreMap[g.student_id].push((g.score / g.max_score) * 100)
      }
    })
    const completedPerStudent: Record<string, number> = {}
    progRows.filter(p => p.status === 'completed').forEach(p => {
      completedPerStudent[p.student_id] = (completedPerStudent[p.student_id] ?? 0) + 1
    })

    const tops = (profilesRes.data ?? [])
      .map((p: unknown) => {
        const pr = p as { id: string; full_name?: string; language_level?: string | null }
        const scores = studentScoreMap[pr.id] ?? []
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        return { id: pr.id, full_name: pr.full_name ?? '—', language_level: pr.language_level ?? null, avgScore: avg, completed: completedPerStudent[pr.id] ?? 0 }
      })
      .filter((s: TopStudent) => s.avgScore > 0)
      .sort((a: TopStudent, b: TopStudent) => b.avgScore - a.avgScore)
      .slice(0, 10) as TopStudent[]

    setTopStudents(tops)
    setLoading(false)
  }

  const actChart = useMemo(() => {
    const m = new Map<string, number>()
    for (let i = 29; i >= 0; i--) m.set(format(subDays(new Date(), i), 'dd.MM'), 0)
    actLog.forEach(a => {
      const k = format(new Date(a.created_at), 'dd.MM')
      if (m.has(k)) m.set(k, (m.get(k) ?? 0) + 1)
    })
    return Array.from(m.entries()).map(([date, count]) => ({ date, count }))
  }, [actLog])

  const levelPie = Object.entries(levelDist).map(([name, value]) => ({ name, value }))

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Аналитика" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 22 }}>

        {/* KPI cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Студентов', value: totalStudents, icon: <Users size={18} />, color: '#1B8FC4' },
            { label: '% завершения', value: `${completionRate}%`, icon: <TrendingUp size={18} />, color: '#10b981' },
            { label: 'Завершено уроков', value: totalCompleted, icon: <BookOpen size={18} />, color: '#8b5cf6' },
            { label: 'Сертификатов', value: totalCerts, icon: <Award size={18} />, color: '#C9933B' },
          ].map(c => (
            <div key={c.label} style={{ ...cardStyle, padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 13, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: 26, fontWeight: 900, color: c.color }}>{loading ? '...' : c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 18 }}>
          {/* Activity */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Активность за 30 дней</div>
              <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '7px 12px', borderRadius: 9, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><RefreshCw size={12} /> Обновить</button>
            </div>
            {loading ? <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Загрузка...</div> : (
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={actChart}>
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} interval={6} />
                  <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Montserrat', fontSize: 12 }} />
                  <Line type="monotone" dataKey="count" stroke="#1B8FC4" strokeWidth={2.5} dot={false} name="Действий" />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Level distribution */}
          <div style={{ ...cardStyle, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 18 }}>Распределение уровней</div>
            {loading ? <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>Загрузка...</div> : levelPie.length > 0 ? (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={levelPie} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70}
                    label={(e: Record<string, unknown>) => `${String(e.name ?? '')} ${((Number(e.percent) || 0) * 100).toFixed(0)}%`}
                    labelLine={false} style={{ fontSize: 11 }}>
                    {levelPie.map(e => <Cell key={e.name} fill={LEVEL_COLORS[e.name] ?? '#94a3b8'} />)}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: 10, fontFamily: 'Montserrat', fontSize: 12 }} />
                </PieChart>
              </ResponsiveContainer>
            ) : <div style={{ height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', fontSize: 13 }}>Нет данных</div>}
          </div>
        </div>

        {/* Avg score by level */}
        {scoreByLevel.length > 0 && (
          <div style={{ ...cardStyle, padding: 24 }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 18 }}>Средний балл по уровням</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={scoreByLevel} barSize={40}>
                <XAxis dataKey="level" tick={{ fontSize: 12, fill: '#64748b', fontWeight: 700 }} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Средний балл']} contentStyle={{ borderRadius: 12, border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', fontFamily: 'Montserrat', fontSize: 12 }} />
                <Bar dataKey="avg" radius={[8, 8, 0, 0]}>
                  {scoreByLevel.map(e => <Cell key={e.level} fill={LEVEL_COLORS[e.level] ?? '#1B8FC4'} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Top students */}
        {topStudents.length > 0 && (
          <div style={{ ...cardStyle, overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px 14px', fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Топ студентов</div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'Montserrat', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['#', 'Студент', 'Уровень', 'Средний балл', 'Завершено уроков'].map(h => (
                    <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topStudents.map((s, i) => (
                  <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                    <td style={{ padding: '12px 16px', fontWeight: 900, color: i < 3 ? '#C9933B' : '#94a3b8', fontSize: i < 3 ? 15 : 13 }}>{i + 1}</td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1e293b' }}>{s.full_name}</td>
                    <td style={{ padding: '12px 16px' }}>
                      {s.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.language_level}</span>}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 900, fontSize: 15, color: s.avgScore >= 80 ? '#10b981' : s.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{s.avgScore}%</span>
                    </td>
                    <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1B3A6B' }}>{s.completed}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && topStudents.length === 0 && scoreByLevel.length === 0 && (
          <div style={{ ...cardStyle, padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📊</div>
            <div style={{ fontSize: 15 }}>Данных для аналитики пока нет</div>
            <div style={{ fontSize: 12, marginTop: 6 }}>Они появятся после активности студентов</div>
          </div>
        )}
      </div>
    </div>
  )
}
