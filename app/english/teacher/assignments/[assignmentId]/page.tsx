'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import StatusBadge from '@/components/english/lms/shared/StatusBadge'
import type { LMSSubmission } from '@/lib/english/lms/types'
import { Check, X } from 'lucide-react'

export default function AssignmentDetailPage() {
  const { assignmentId } = useParams<{ assignmentId: string }>()
  const [assignment, setAssignment] = useState<Record<string, unknown> | null>(null)
  const [submissions, setSubmissions] = useState<LMSSubmission[]>([])
  const [selected, setSelected] = useState<LMSSubmission | null>(null)
  const [scoreInput, setScoreInput] = useState('')
  const [feedback, setFeedback] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [assignmentId])

  async function load() {
    const [aRes, sRes] = await Promise.all([
      supabase.from('lms_assignments').select('*,group:lms_groups(name)').eq('id', assignmentId).single(),
      supabase.from('lms_assignment_submissions').select('*,student:profiles(id,full_name,avatar_url)').eq('assignment_id', assignmentId).order('submitted_at', { ascending: false }),
    ])
    setAssignment(aRes.data as Record<string, unknown>)
    setSubmissions((sRes.data ?? []) as LMSSubmission[])
  }

  async function saveGrade() {
    if (!selected) return
    const score = parseInt(scoreInput)
    if (isNaN(score)) return
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('lms_assignment_submissions').update({ score, feedback: feedback || null, status: 'graded', graded_at: new Date().toISOString(), graded_by: session?.user.id }).eq('id', selected.id)
    setSelected(null)
    setSaving(false)
    load()
  }

  const maxScore = (assignment?.max_score as number) ?? 100

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title={String(assignment?.title ?? 'Задание')} />
      <div style={{ padding: '24px 28px', display: 'flex', gap: 24 }}>
        {/* Submissions list */}
        <div style={{ flex: 1 }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 16 }}>Сдачи ({submissions.length})</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {submissions.map(s => {
                const st = s.student as { id: string; full_name?: string } | null
                return (
                  <div key={s.id} onClick={() => { setSelected(s); setScoreInput(s.score != null ? String(s.score) : ''); setFeedback(s.feedback ?? '') }}
                    style={{ padding: '14px 16px', borderRadius: 14, border: `1.5px solid ${selected?.id === s.id ? '#1B8FC4' : 'rgba(27,143,196,0.1)'}`, cursor: 'pointer', background: selected?.id === s.id ? 'rgba(27,143,196,0.04)' : '#f8fafc', transition: 'all 0.15s', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{st?.full_name ?? '—'}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 2 }}>{new Date(s.submitted_at).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <StatusBadge status={s.status} />
                      {s.score != null && <span style={{ fontSize: 15, fontWeight: 900, color: s.score >= maxScore * 0.7 ? '#16a34a' : '#dc2626' }}>{s.score}/{maxScore}</span>}
                    </div>
                  </div>
                )
              })}
              {submissions.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14, padding: 20, textAlign: 'center' }}>Сдач пока нет</div>}
            </div>
          </div>
        </div>

        {/* Review panel */}
        {selected && (
          <div style={{ width: 380, background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', height: 'fit-content', position: 'sticky', top: 86 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Проверка работы</div>
              <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={18} /></button>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b', marginBottom: 12 }}>{(selected.student as { full_name?: string } | null)?.full_name}</div>
            {selected.content && (
              <div style={{ background: '#f8fafc', borderRadius: 12, padding: '14px 16px', marginBottom: 16, fontSize: 13, color: '#475569', lineHeight: 1.7, maxHeight: 200, overflowY: 'auto' }}>
                {selected.content}
              </div>
            )}
            {selected.attachment_url && (
              <a href={selected.attachment_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, color: '#1B8FC4', fontWeight: 700 }}>📎 Скачать файл</a>
            )}
            <div style={{ marginTop: 16 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Балл (из {maxScore})</label>
              <input type="number" min={0} max={maxScore} value={scoreInput} onChange={e => setScoreInput(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.25)', borderRadius: 10, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', boxSizing: 'border-box' as const }} />
            </div>
            <div style={{ marginTop: 12 }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Комментарий</label>
              <textarea value={feedback} onChange={e => setFeedback(e.target.value)} rows={3} style={{ width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.25)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', resize: 'vertical', boxSizing: 'border-box' as const }} />
            </div>
            <button onClick={saveGrade} disabled={saving || !scoreInput} style={{ marginTop: 16, width: '100%', padding: '12px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Check size={16} /> {saving ? 'Сохранение...' : 'Выставить оценку'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
