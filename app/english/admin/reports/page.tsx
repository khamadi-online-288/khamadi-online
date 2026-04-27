'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { Download, Brain, RefreshCw } from 'lucide-react'

interface ReportStudent { id: string; full_name?: string; email?: string; language_level?: string; completed: number; avgScore: number; lastSeen?: string; atRisk: boolean }

export default function AdminReportsPage() {
  const supabase = createEnglishClient()
  const [students, setStudents] = useState<ReportStudent[]>([])
  const [loading, setLoading] = useState(true)
  const [aiInsight, setAiInsight] = useState('')
  const [loadingAI, setLoadingAI] = useState(false)
  const [filter, setFilter] = useState<'all' | 'at_risk' | 'top'>('all')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const { data: roles } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
    const ids = ((roles ?? []) as { user_id: string }[]).map(r => r.user_id)
    if (!ids.length) { setLoading(false); return }

    const [profilesRes, progressRes, gradesRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,language_level,last_seen_at').in('id', ids),
      supabase.from('lms_progress').select('student_id,status').in('student_id', ids).eq('status', 'completed'),
      supabase.from('lms_grades').select('student_id,score,max_score').in('student_id', ids),
    ])

    const completedMap: Record<string, number> = {}
    ;(progressRes.data ?? []).forEach((p: unknown) => {
      const row = p as { student_id: string }
      completedMap[row.student_id] = (completedMap[row.student_id] ?? 0) + 1
    })
    const scoreMap: Record<string, number[]> = {}
    ;(gradesRes.data ?? []).forEach((g: unknown) => {
      const row = g as { student_id: string; score: number; max_score: number }
      if (!scoreMap[row.student_id]) scoreMap[row.student_id] = []
      if (row.max_score > 0) scoreMap[row.student_id].push((row.score / row.max_score) * 100)
    })

    setStudents(((profilesRes.data ?? []) as unknown[]).map((p: unknown) => {
      const prof = p as { id: string; full_name?: string; email?: string; language_level?: string; last_seen_at?: string }
      const scores = scoreMap[prof.id] ?? []
      const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
      const atRisk = !prof.last_seen_at || new Date(prof.last_seen_at) < new Date(twoWeeksAgo)
      return { id: prof.id, full_name: prof.full_name, email: prof.email, language_level: prof.language_level, completed: completedMap[prof.id] ?? 0, avgScore: avg, lastSeen: prof.last_seen_at, atRisk }
    }))
    setLoading(false)
  }

  function exportCSV() {
    const rows = [['ID', 'Имя', 'Email', 'Уровень', 'Завершено уроков', 'Средний балл', 'Последний вход', 'Группа риска']]
    filtered.forEach(s => rows.push([s.id, s.full_name ?? '', s.email ?? '', s.language_level ?? '', String(s.completed), String(s.avgScore), s.lastSeen ?? '', s.atRisk ? 'Да' : 'Нет']))
    const bom = '﻿'
    const csv = bom + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `lms-report-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  }

  async function getAIInsight() {
    setLoadingAI(true); setAiInsight('')
    const total = students.length
    const atRisk = students.filter(s => s.atRisk).length
    const avgCompletion = total ? Math.round(students.reduce((a, s) => a + s.completed, 0) / total) : 0
    const avgScore = total ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / total) : 0
    const prompt = `You are an LMS analytics expert. Analyze this English language learning platform data and provide actionable insights in Russian:\n\nTotal students: ${total}\nAt-risk students (inactive 14+ days): ${atRisk} (${total ? Math.round(atRisk/total*100) : 0}%)\nAverage lessons completed per student: ${avgCompletion}\nAverage score: ${avgScore}%\n\nProvide 3-4 specific recommendations to improve student engagement and outcomes. Be concise and practical.`
    try {
      const resp = await fetch('/api/english/ai-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, maxTokens: 600 }) })
      const data = await resp.json()
      setAiInsight(data.text ?? 'Нет ответа')
    } catch { setAiInsight('Ошибка запроса к AI') }
    setLoadingAI(false)
  }

  const filtered = filter === 'at_risk' ? students.filter(s => s.atRisk) : filter === 'top' ? students.filter(s => s.avgScore >= 80).sort((a, b) => b.avgScore - a.avgScore) : students

  if (loading) return <div style={{ flex: 1 }}><AdminHeader title="Отчёты" /><div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div></div>

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Отчёты" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 24 }}>
          {[
            { label: 'Всего студентов', value: students.length, color: '#1B8FC4' },
            { label: 'В группе риска', value: students.filter(s => s.atRisk).length, color: '#ef4444' },
            { label: 'Средний балл', value: students.length ? `${Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length)}%` : '—', color: '#10b981' },
            { label: 'Топ студентов (80%+)', value: students.filter(s => s.avgScore >= 80).length, color: '#C9933B' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' as const, gap: 10 }}>
          <div style={{ display: 'flex', gap: 4, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
            {[{ id: 'all', label: 'Все' }, { id: 'at_risk', label: 'Группа риска' }, { id: 'top', label: 'Топ' }].map(f => (
              <button key={f.id} onClick={() => setFilter(f.id as typeof filter)} style={{ padding: '7px 14px', borderRadius: 8, fontWeight: filter === f.id ? 800 : 600, fontSize: 12, border: 'none', background: filter === f.id ? '#fff' : 'transparent', color: filter === f.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat' }}>{f.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={load} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><RefreshCw size={13} /> Обновить</button>
            <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}><Download size={13} /> CSV</button>
            <button onClick={getAIInsight} disabled={loadingAI} style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '9px 14px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: loadingAI ? 'default' : 'pointer', opacity: loadingAI ? 0.7 : 1, fontFamily: 'Montserrat' }}><Brain size={13} /> AI Анализ</button>
          </div>
        </div>

        {aiInsight && (
          <div style={{ background: '#f0f9ff', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.2)', marginBottom: 20, fontSize: 13, color: '#0c4a6e', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const }}>{aiInsight}</div>
        )}

        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' as const, fontSize: 13, fontFamily: 'Montserrat' }}>
            <thead><tr style={{ background: '#f8fafc' }}>
              {['Студент', 'Уровень', 'Завершено', 'Балл', 'Последний вход', 'Статус'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left' as const, fontSize: 11, fontWeight: 700, color: '#475569', textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} style={{ background: i % 2 === 0 ? '#fff' : '#fafbfc', borderTop: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 700, color: '#1e293b' }}>{s.full_name ?? '—'}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.email}</div>
                  </td>
                  <td style={{ padding: '12px 16px' }}>{s.language_level ? <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.language_level}</span> : '—'}</td>
                  <td style={{ padding: '12px 16px', fontWeight: 700, color: '#1B3A6B' }}>{s.completed}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ fontWeight: 800, color: s.avgScore >= 80 ? '#10b981' : s.avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{s.avgScore > 0 ? `${s.avgScore}%` : '—'}</span></td>
                  <td style={{ padding: '12px 16px', color: '#64748b' }}>{s.lastSeen ? new Date(s.lastSeen).toLocaleDateString('ru-RU') : 'Никогда'}</td>
                  <td style={{ padding: '12px 16px' }}><span style={{ background: s.atRisk ? '#fee2e2' : '#dcfce7', color: s.atRisk ? '#dc2626' : '#166534', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{s.atRisk ? 'Риск' : 'Активен'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center' as const, color: '#94a3b8', fontSize: 13 }}>Нет данных</div>}
        </div>
      </div>
    </div>
  )
}
