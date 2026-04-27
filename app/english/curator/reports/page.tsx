'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Download, Send, AlertTriangle, Users, TrendingUp, Flag } from 'lucide-react'

interface StudentStat { id: string; full_name?: string; email?: string; language_level?: string; completed: number; avgScore: number; lastSeen?: string; atRisk: boolean; hasProblemFlag: boolean; groupName?: string }

export default function CuratorReportsPage() {
  const supabase = createEnglishClient()
  const [students, setStudents] = useState<StudentStat[]>([])
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [deanEmail, setDeanEmail] = useState('')
  const [comment, setComment] = useState('')
  const [curatorId, setCuratorId] = useState('')

  useEffect(() => { load() }, [])

  async function load() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) { setLoading(false); return }
    setCuratorId(session.user.id)
    const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

    const { data: roles } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
    const ids = ((roles ?? []) as { user_id: string }[]).map(r => r.user_id)
    if (!ids.length) { setLoading(false); return }

    const [profilesRes, progRes, gradesRes, notesRes, grpStudRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,language_level,last_seen_at').in('id', ids),
      supabase.from('lms_progress').select('student_id,status').in('student_id', ids).eq('status', 'completed'),
      supabase.from('lms_grades').select('student_id,score,max_score').in('student_id', ids),
      supabase.from('lms_curator_notes').select('student_id,is_problem_flagged').eq('curator_id', session.user.id).eq('is_problem_flagged', true),
      supabase.from('lms_group_students').select('student_id,group:lms_groups(name)').in('student_id', ids),
    ])

    const completedMap: Record<string, number> = {}
    ;(progRes.data ?? []).forEach((p: unknown) => { const r = p as { student_id: string }; completedMap[r.student_id] = (completedMap[r.student_id] ?? 0) + 1 })
    const scoreMap: Record<string, number[]> = {}
    ;(gradesRes.data ?? []).forEach((g: unknown) => {
      const r = g as { student_id: string; score: number; max_score: number }
      if (r.max_score > 0) { if (!scoreMap[r.student_id]) scoreMap[r.student_id] = []; scoreMap[r.student_id].push((r.score / r.max_score) * 100) }
    })
    const problemSet = new Set(((notesRes.data ?? []) as { student_id: string }[]).map(n => n.student_id))
    const grpMap: Record<string, string> = {}
    ;(grpStudRes.data ?? []).forEach((x: unknown) => {
      const r = x as { student_id: string; group?: { name: string } }
      if (r.group?.name) grpMap[r.student_id] = r.group.name
    })

    setStudents(((profilesRes.data ?? []) as unknown[]).map((p: unknown) => {
      const prof = p as { id: string; full_name?: string; email?: string; language_level?: string; last_seen_at?: string }
      const scores = scoreMap[prof.id] ?? []
      return {
        id: prof.id, full_name: prof.full_name, email: prof.email, language_level: prof.language_level,
        completed: completedMap[prof.id] ?? 0,
        avgScore: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0,
        lastSeen: prof.last_seen_at,
        atRisk: !prof.last_seen_at || new Date(prof.last_seen_at) < new Date(twoWeeksAgo),
        hasProblemFlag: problemSet.has(prof.id),
        groupName: grpMap[prof.id],
      }
    }))
    setLoading(false)
  }

  function buildReportText() {
    const date = new Date().toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })
    const atRisk = students.filter(s => s.atRisk)
    const problematic = students.filter(s => s.hasProblemFlag)
    const avgScore = students.length ? Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length) : 0
    let text = `ОТЧЁТ КУРАТОРА — ${date}\n\n`
    text += `Всего студентов: ${students.length}\n`
    text += `Средний балл: ${avgScore}%\n`
    text += `Студентов без активности (14+ дней): ${atRisk.length}\n`
    text += `Студентов с проблемными заметками: ${problematic.length}\n\n`
    if (problematic.length) {
      text += `ПРОБЛЕМНЫЕ СТУДЕНТЫ:\n`
      problematic.forEach(s => { text += `- ${s.full_name ?? s.email} (${s.groupName ?? '—'}) — Последний вход: ${s.lastSeen ? new Date(s.lastSeen).toLocaleDateString('ru-RU') : 'Никогда'}\n` })
      text += '\n'
    }
    if (atRisk.length) {
      text += `ГРУППА РИСКА:\n`
      atRisk.forEach(s => { text += `- ${s.full_name ?? s.email} — ${s.lastSeen ? new Date(s.lastSeen).toLocaleDateString('ru-RU') : 'Никогда'}\n` })
    }
    if (comment) text += `\nКОММЕНТАРИЙ КУРАТОРА:\n${comment}`
    return text
  }

  function exportCSV() {
    const rows = [['Студент', 'Email', 'Группа', 'Уровень', 'Завершено уроков', 'Средний балл', 'Последний вход', 'Риск', 'Проблемный']]
    students.forEach(s => rows.push([s.full_name ?? '', s.email ?? '', s.groupName ?? '', s.language_level ?? '', String(s.completed), s.avgScore > 0 ? `${s.avgScore}%` : '—', s.lastSeen ? new Date(s.lastSeen).toLocaleDateString('ru-RU') : 'Никогда', s.atRisk ? 'Да' : 'Нет', s.hasProblemFlag ? 'Да' : 'Нет']))
    const bom = '﻿'
    const csv = bom + rows.map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `curator-report-${new Date().toISOString().split('T')[0]}.csv`; a.click()
  }

  async function sendReport(e: React.FormEvent) {
    e.preventDefault(); setSending(true)
    // Log this action
    await supabase.from('lms_activity_log').insert({ user_id: curatorId, action: `Отчёт отправлен на ${deanEmail}`, entity_type: 'curator_report', metadata: { recipient: deanEmail } })
    // In production: call email API. Here we just simulate.
    await new Promise(r => setTimeout(r, 800))
    setSending(false); setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  if (loading) return <div style={{ flex: 1, padding: 40, color: '#94a3b8', textAlign: 'center' as const }}>Загрузка...</div>

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(27,143,196,0.1)', padding: '18px 28px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>Отчёт в деканат</div>
      </div>
      <div style={{ padding: '24px 28px', maxWidth: 800 }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginBottom: 24 }}>
          {[
            { icon: <Users size={16} />, label: 'Студентов', value: students.length, color: '#1B8FC4' },
            { icon: <AlertTriangle size={16} />, label: 'Группа риска', value: students.filter(s => s.atRisk).length, color: '#ef4444' },
            { icon: <Flag size={16} />, label: 'Проблемных', value: students.filter(s => s.hasProblemFlag).length, color: '#C9933B' },
            { icon: <TrendingUp size={16} />, label: 'Средний балл', value: students.length ? `${Math.round(students.reduce((a, s) => a + s.avgScore, 0) / students.length)}%` : '—', color: '#10b981' },
          ].map(c => (
            <div key={c.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8, color: c.color }}>{c.icon}<span style={{ fontSize: 11, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' as const }}>{c.label}</span></div>
              <div style={{ fontSize: 24, fontWeight: 900, color: c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Report preview */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20 }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 14 }}>Предпросмотр отчёта</div>
          <pre style={{ fontSize: 12, color: '#334155', background: '#f8fafc', borderRadius: 10, padding: 16, whiteSpace: 'pre-wrap' as const, fontFamily: 'Montserrat, monospace', lineHeight: 1.7, maxHeight: 300, overflowY: 'auto' }}>{buildReportText()}</pre>
        </div>

        {/* Comment */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Дополнительный комментарий (необязательно)</label>
          <textarea value={comment} onChange={e => setComment(e.target.value)} rows={3} placeholder="Дополнительные наблюдения для деканата..." style={{ width: '100%', padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', resize: 'vertical' as const, boxSizing: 'border-box' as const }} />
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' as const }}>
          <button onClick={exportCSV} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 18px', borderRadius: 11, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}><Download size={14} /> Скачать CSV</button>
          <form onSubmit={sendReport} style={{ display: 'flex', gap: 8, flex: 1 }}>
            <input required type="email" value={deanEmail} onChange={e => setDeanEmail(e.target.value)} placeholder="Email деканата..." style={{ flex: 1, padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', minWidth: 200 }} />
            <button type="submit" disabled={sending} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 20px', borderRadius: 11, background: sent ? '#10b981' : '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 13, border: 'none', cursor: sending ? 'default' : 'pointer', opacity: sending ? 0.7 : 1, fontFamily: 'Montserrat' }}>
              <Send size={14} />{sent ? 'Отправлено!' : sending ? 'Отправка...' : 'Отправить в деканат'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
