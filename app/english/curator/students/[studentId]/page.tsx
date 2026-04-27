'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { ArrowLeft, AlertTriangle, Save, Plus, Trash2, Flag } from 'lucide-react'
import Link from 'next/link'

interface Profile { id: string; full_name?: string; email?: string; language_level?: string; is_active?: boolean; last_seen_at?: string; created_at?: string; department?: string }
interface Note { id: string; note: string; is_problem_flagged: boolean; created_at: string }
interface ProgressStat { completed: number; inProgress: number; total: number; avgScore: number }

export default function CuratorStudentPage() {
  const { studentId } = useParams<{ studentId: string }>()
  const supabase = createEnglishClient()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [notes, setNotes] = useState<Note[]>([])
  const [newNote, setNewNote] = useState('')
  const [flagNew, setFlagNew] = useState(false)
  const [stats, setStats] = useState<ProgressStat>({ completed: 0, inProgress: 0, total: 0, avgScore: 0 })
  const [savingNote, setSavingNote] = useState(false)
  const [curatorId, setCuratorId] = useState('')

  useEffect(() => { load() }, [studentId])

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setCuratorId(session.user.id)

    const [profRes, notesRes, progRes, gradeRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,language_level,is_active,last_seen_at,created_at,department').eq('id', studentId).maybeSingle(),
      supabase.from('lms_curator_notes').select('*').eq('student_id', studentId).order('created_at', { ascending: false }),
      supabase.from('lms_progress').select('status').eq('student_id', studentId),
      supabase.from('lms_grades').select('score,max_score').eq('student_id', studentId),
    ])

    setProfile(profRes.data as Profile | null)
    setNotes((notesRes.data ?? []) as Note[])

    const prog = (progRes.data ?? []) as { status: string }[]
    const grades = (gradeRes.data ?? []) as { score: number; max_score: number }[]
    const scored = grades.filter(g => g.score != null && g.max_score > 0)
    setStats({
      completed: prog.filter(p => p.status === 'completed').length,
      inProgress: prog.filter(p => p.status === 'in_progress').length,
      total: prog.length,
      avgScore: scored.length ? Math.round(scored.reduce((a, g) => a + (g.score / g.max_score) * 100, 0) / scored.length) : 0,
    })
  }

  async function addNote() {
    if (!newNote.trim()) return
    setSavingNote(true)
    await supabase.from('lms_curator_notes').insert({ curator_id: curatorId, student_id: studentId, note: newNote, is_problem_flagged: flagNew })
    setNewNote(''); setFlagNew(false)
    setSavingNote(false)
    load()
  }

  async function deleteNote(id: string) {
    await supabase.from('lms_curator_notes').delete().eq('id', id)
    setNotes(n => n.filter(x => x.id !== id))
  }

  async function toggleFlag(note: Note) {
    await supabase.from('lms_curator_notes').update({ is_problem_flagged: !note.is_problem_flagged }).eq('id', note.id)
    setNotes(n => n.map(x => x.id === note.id ? { ...x, is_problem_flagged: !x.is_problem_flagged } : x))
  }

  const hasProblem = notes.some(n => n.is_problem_flagged)
  const daysAgo = profile?.last_seen_at ? Math.floor((Date.now() - new Date(profile.last_seen_at).getTime()) / 86400000) : null
  const atRisk = !profile?.last_seen_at || (daysAgo !== null && daysAgo > 14)

  if (!profile) return <div style={{ flex: 1, padding: 40, color: '#94a3b8' }}>Загрузка...</div>

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(27,143,196,0.1)', padding: '18px 28px' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>{profile.full_name ?? '—'}</div>
      </div>
      <div style={{ padding: '24px 28px', maxWidth: 800 }}>
        <Link href="/english/curator/students" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#64748b', fontSize: 13, fontWeight: 600, textDecoration: 'none', marginBottom: 20 }}><ArrowLeft size={14} /> Назад</Link>

        {/* Profile card */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: hasProblem ? '1.5px solid rgba(239,68,68,0.3)' : '1px solid rgba(27,143,196,0.1)', marginBottom: 20, display: 'flex', gap: 20, alignItems: 'flex-start' }}>
          <div style={{ width: 56, height: 56, borderRadius: 14, background: hasProblem ? '#ef4444' : '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <span style={{ color: '#fff', fontSize: 20, fontWeight: 800 }}>{profile.full_name?.[0]?.toUpperCase() ?? '?'}</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <div style={{ fontSize: 17, fontWeight: 900, color: '#1B3A6B' }}>{profile.full_name ?? '—'}</div>
              {hasProblem && <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}><AlertTriangle size={9} /> Проблемный</span>}
              {atRisk && !hasProblem && <span style={{ background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 11, fontWeight: 800 }}>Группа риска</span>}
            </div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{profile.email}</div>
            {profile.department && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{profile.department}</div>}
            <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' as const }}>
              {profile.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>{profile.language_level}</span>}
              <span style={{ background: atRisk ? '#fee2e2' : '#dcfce7', color: atRisk ? '#dc2626' : '#166534', borderRadius: 6, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                {daysAgo !== null ? `${daysAgo} дн. назад` : 'Не заходил'}
              </span>
            </div>
          </div>
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, flexShrink: 0 }}>
            {[
              { label: 'Завершено', value: stats.completed, color: '#10b981' },
              { label: 'В процессе', value: stats.inProgress, color: '#f59e0b' },
              { label: 'Средний балл', value: stats.avgScore > 0 ? `${stats.avgScore}%` : '—', color: '#1B8FC4' },
              { label: 'Всего разделов', value: stats.total, color: '#64748b' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' as const, background: '#f8fafc', borderRadius: 10, padding: '8px 12px' }}>
                <div style={{ fontSize: 16, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 10, color: '#94a3b8', fontWeight: 700 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Notes section */}
        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 16 }}>Заметки куратора</div>

          {/* Add note */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20, padding: 16, background: '#f8fafc', borderRadius: 12 }}>
            <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} placeholder="Добавить заметку о студенте..." style={{ width: '100%', padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#fff', resize: 'vertical' as const, boxSizing: 'border-box' as const }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 7, cursor: 'pointer', fontSize: 13, fontWeight: 700, color: flagNew ? '#dc2626' : '#475569' }}>
                <input type="checkbox" checked={flagNew} onChange={e => setFlagNew(e.target.checked)} style={{ width: 15, height: 15, accentColor: '#ef4444' }} />
                <Flag size={13} /> Отметить как проблемный
              </label>
              <button onClick={addNote} disabled={!newNote.trim() || savingNote} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: newNote.trim() ? 'pointer' : 'default', opacity: newNote.trim() ? 1 : 0.5, fontFamily: 'Montserrat' }}>
                <Plus size={13} /> Добавить заметку
              </button>
            </div>
          </div>

          {/* Notes list */}
          {notes.length === 0 ? (
            <div style={{ textAlign: 'center' as const, color: '#94a3b8', fontSize: 13, padding: 24 }}>Заметок нет</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {notes.map(n => (
                <div key={n.id} style={{ padding: '14px 16px', borderRadius: 12, background: n.is_problem_flagged ? '#fff1f2' : '#f8fafc', border: n.is_problem_flagged ? '1.5px solid rgba(239,68,68,0.25)' : '1px solid #f1f5f9' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 }}>
                    <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.6, flex: 1, whiteSpace: 'pre-wrap' as const }}>{n.note}</div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <button onClick={() => toggleFlag(n)} title={n.is_problem_flagged ? 'Снять флаг' : 'Пометить как проблемный'} style={{ padding: 5, borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: n.is_problem_flagged ? '#fee2e2' : '#fff', cursor: 'pointer' }}><Flag size={12} color={n.is_problem_flagged ? '#dc2626' : '#94a3b8'} /></button>
                      <button onClick={() => deleteNote(n.id)} style={{ padding: 5, borderRadius: 7, border: '1px solid rgba(239,68,68,0.2)', background: '#fff8f8', cursor: 'pointer' }}><Trash2 size={12} color="#dc2626" /></button>
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 8 }}>{new Date(n.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
