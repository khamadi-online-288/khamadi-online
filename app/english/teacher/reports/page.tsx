'use client'
import { useEffect, useState, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import { Download, RefreshCw, TrendingDown, Award, Users, BarChart2 } from 'lucide-react'

const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }

interface StudentReport {
  id: string
  full_name: string
  email: string
  language_level: string | null
  group_name: string
  completed: number
  avgScore: number
  attendancePct: number
  atRisk: boolean
}

interface Group { id: string; name: string }

export default function TeacherReportsPage() {
  const supabase = createEnglishClient()
  const [loading, setLoading] = useState(true)
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState('all')
  const [students, setStudents] = useState<StudentReport[]>([])
  const [filter, setFilter] = useState<'all' | 'risk' | 'top'>('all')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const uid = session.user.id

      const { data: groupsData } = await supabase.from('lms_groups').select('id,name').eq('teacher_id', uid).order('name')
      const myGroups = (groupsData ?? []) as Group[]
      setGroups(myGroups)
      const groupIds = myGroups.map(g => g.id)
      if (!groupIds.length) { setLoading(false); return }

      await loadStudents(uid, groupIds, myGroups)
    })
  }, [])

  async function loadStudents(uid: string, groupIds: string[], myGroups: Group[]) {
    setLoading(true)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const { data: gsData } = await supabase
      .from('lms_group_students')
      .select('student_id, group_id')
      .in('group_id', groupIds)

    const gsRows = (gsData ?? []) as { student_id: string; group_id: string }[]
    const studentIds = [...new Set(gsRows.map(r => r.student_id))]
    const groupMap: Record<string, string> = {}
    gsRows.forEach(r => {
      const grp = myGroups.find(g => g.id === r.group_id)
      if (grp) groupMap[r.student_id] = grp.name
    })

    if (!studentIds.length) { setStudents([]); setLoading(false); return }

    const [profilesRes, progressRes, gradesRes, attRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,language_level,last_seen_at').in('id', studentIds),
      supabase.from('lms_progress').select('student_id,status').in('student_id', studentIds),
      supabase.from('lms_grades').select('student_id,score,max_score').in('student_id', studentIds),
      supabase.from('lms_attendance').select('student_id,status').in('student_id', studentIds).in('group_id', groupIds),
    ])

    const completedMap: Record<string, number> = {}
    ;((progressRes.data ?? []) as { student_id: string; status: string }[])
      .filter(p => p.status === 'completed')
      .forEach(p => { completedMap[p.student_id] = (completedMap[p.student_id] ?? 0) + 1 })

    const scoreMap: Record<string, number[]> = {}
    ;((gradesRes.data ?? []) as { student_id: string; score: number; max_score: number }[]).forEach(g => {
      if (g.max_score > 0) {
        if (!scoreMap[g.student_id]) scoreMap[g.student_id] = []
        scoreMap[g.student_id].push((g.score / g.max_score) * 100)
      }
    })

    const attMap: Record<string, { total: number; present: number }> = {}
    ;((attRes.data ?? []) as { student_id: string; status: string }[]).forEach(a => {
      if (!attMap[a.student_id]) attMap[a.student_id] = { total: 0, present: 0 }
      attMap[a.student_id].total++
      if (a.status === 'present' || a.status === 'late') attMap[a.student_id].present++
    })

    const reports: StudentReport[] = ((profilesRes.data ?? []) as {
      id: string; full_name?: string; email?: string; language_level?: string | null; last_seen_at?: string | null
    }[]).map(p => {
      const scores = scoreMap[p.id] ?? []
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const att = attMap[p.id]
      const attPct = att && att.total > 0 ? Math.round((att.present / att.total) * 100) : 0
      const atRisk = !p.last_seen_at || new Date(p.last_seen_at) < new Date(twoWeeksAgo)
      return {
        id:             p.id,
        full_name:      p.full_name ?? '—',
        email:          p.email ?? '',
        language_level: p.language_level ?? null,
        group_name:     groupMap[p.id] ?? '—',
        completed:      completedMap[p.id] ?? 0,
        avgScore:       avg,
        attendancePct:  attPct,
        atRisk,
      }
    }).sort((a, b) => b.avgScore - a.avgScore)

    setStudents(reports)
    setLoading(false)
  }

  const filtered = useMemo(() => {
    let list = students
    if (selectedGroup !== 'all') list = list.filter(s => s.group_name === groups.find(g => g.id === selectedGroup)?.name)
    if (filter === 'risk') list = list.filter(s => s.atRisk || s.avgScore < 30)
    if (filter === 'top')  list = list.filter(s => s.avgScore >= 80)
    return list
  }, [students, selectedGroup, filter, groups])

  function exportCSV() {
    const rows = [['Имя', 'Email', 'Группа', 'Уровень', 'Средний балл', 'Завершено уроков', 'Посещаемость %', 'Группа риска']]
    filtered.forEach(s => rows.push([
      s.full_name, s.email, s.group_name, s.language_level ?? '', String(s.avgScore),
      String(s.completed), String(s.attendancePct), s.atRisk || s.avgScore < 30 ? 'Да' : 'Нет',
    ]))
    const csv = '﻿' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = `report-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const stats = {
    total:   students.length,
    risk:    students.filter(s => s.atRisk || s.avgScore < 30).length,
    top:     students.filter(s => s.avgScore >= 80).length,
    avgScore: students.length ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length) : 0,
  }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Отчёты" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* KPI */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Студентов', value: stats.total, icon: <Users size={16} />, color: '#1B8FC4' },
            { label: 'Средний балл', value: `${stats.avgScore}%`, icon: <BarChart2 size={16} />, color: '#10b981' },
            { label: 'Группа риска', value: stats.risk, icon: <TrendingDown size={16} />, color: '#ef4444' },
            { label: 'Отличники (80%+)', value: stats.top, icon: <Award size={16} />, color: '#C9933B' },
          ].map(c => (
            <div key={c.label} style={{ ...cardStyle, padding: '18px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{loading ? '...' : c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}
            style={{ padding: '9px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 11, fontSize: 13, fontFamily: 'Montserrat', background: '#fff', cursor: 'pointer' }}>
            <option value="all">Все группы</option>
            {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
          </select>

          <div style={{ display: 'flex', gap: 3, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
            {([['all', 'Все'], ['risk', '⚠ Риск'], ['top', '⭐ Топ']] as [string, string][]).map(([id, label]) => (
              <button key={id} onClick={() => setFilter(id as 'all' | 'risk' | 'top')}
                style={{ padding: '7px 14px', borderRadius: 8, fontWeight: filter === id ? 800 : 600, fontSize: 13, border: 'none', background: filter === id ? '#fff' : 'transparent', color: filter === id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: filter === id ? '0 1px 4px rgba(0,0,0,0.09)' : 'none' }}>
                {label}
              </button>
            ))}
          </div>

          <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
            <button onClick={() => {
              supabase.auth.getSession().then(async ({ data: { session } }) => {
                if (!session) return
                const { data: gd } = await supabase.from('lms_groups').select('id,name').eq('teacher_id', session.user.id).order('name')
                const gs = (gd ?? []) as Group[]
                await loadStudents(session.user.id, gs.map(g => g.id), gs)
              })
            }} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <RefreshCw size={13} /> Обновить
            </button>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <Download size={13} /> CSV
            </button>
          </div>
        </div>

        {/* Table */}
        <div style={{ ...cardStyle, overflow: 'hidden' }}>
          {loading ? (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>Загрузка данных...</div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontFamily: 'Montserrat', fontSize: 13 }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #f1f5f9' }}>
                  {['Студент', 'Группа', 'Уровень', 'Ср. балл', 'Уроков', 'Посещ.', 'Статус'].map(h => (
                    <th key={h} style={{ padding: '11px 16px', textAlign: 'left', fontSize: 11, fontWeight: 800, color: '#64748b', textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const isRisk = s.atRisk || s.avgScore < 30
                  return (
                    <tr key={s.id} style={{ borderBottom: '1px solid #f1f5f9', background: i % 2 === 0 ? '#fff' : '#fafbfc' }}>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.full_name}</div>
                        <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email}</div>
                      </td>
                      <td style={{ padding: '12px 16px', fontSize: 12, color: '#64748b' }}>{s.group_name}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {s.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.language_level}</span>}
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                          <div style={{ flex: 1, height: 5, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden', minWidth: 50 }}>
                            <div style={{ height: '100%', borderRadius: 99, width: `${s.avgScore}%`, background: s.avgScore >= 80 ? '#10b981' : s.avgScore >= 50 ? '#f59e0b' : '#ef4444' }} />
                          </div>
                          <span style={{ fontSize: 13, fontWeight: 900, color: s.avgScore >= 80 ? '#10b981' : s.avgScore >= 50 ? '#f59e0b' : '#ef4444', minWidth: 36 }}>
                            {s.avgScore > 0 ? `${s.avgScore}%` : '—'}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1B3A6B', textAlign: 'center' }}>{s.completed}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ fontWeight: 800, fontSize: 13, color: s.attendancePct >= 70 ? '#10b981' : s.attendancePct >= 50 ? '#f59e0b' : '#ef4444' }}>
                          {s.attendancePct > 0 ? `${s.attendancePct}%` : '—'}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px' }}>
                        {isRisk
                          ? <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>Риск</span>
                          : s.avgScore >= 80
                          ? <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>Отличник</span>
                          : <span style={{ background: '#dcfce7', color: '#166534', borderRadius: 6, padding: '2px 9px', fontSize: 11, fontWeight: 700 }}>Норма</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          )}
          {!loading && filtered.length === 0 && (
            <div style={{ padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📊</div>
              <div style={{ fontSize: 14 }}>Данных нет</div>
            </div>
          )}
        </div>

        {/* Risk students highlight */}
        {!loading && students.filter(s => s.avgScore > 0 && s.avgScore < 30).length > 0 && (
          <div style={{ background: '#fff1f2', borderRadius: 16, padding: '16px 20px', border: '1.5px solid rgba(239,68,68,0.25)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626', marginBottom: 8 }}>
              ⚠ Студенты с прогрессом менее 30% — требуют внимания
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {students.filter(s => s.avgScore > 0 && s.avgScore < 30).map(s => (
                <span key={s.id} style={{ background: '#fff', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 12, fontWeight: 700, color: '#dc2626' }}>
                  {s.full_name} ({s.avgScore}%)
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
