'use client'
import { useEffect, useState, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import { Search, Save, Plus, StickyNote, Clock } from 'lucide-react'

interface StudentOption { id: string; full_name: string; group_name: string }
interface Note { id: string; student_id: string; note: string; updated_at: string }

const card: React.CSSProperties = { background: '#fff', borderRadius: 18, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 10px rgba(27,58,107,0.06)' }

export default function TeacherNotesPage() {
  const supabase = createEnglishClient()
  const [uid, setUid]           = useState('')
  const [students, setStudents] = useState<StudentOption[]>([])
  const [notes, setNotes]       = useState<Note[]>([])
  const [selected, setSelected] = useState<StudentOption | null>(null)
  const [draft, setDraft]       = useState('')
  const [search, setSearch]     = useState('')
  const [saving, setSaving]     = useState(false)
  const [loading, setLoading]   = useState(true)
  const [saveOk, setSaveOk]     = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      const id = session.user.id
      setUid(id)

      const { data: gs } = await supabase.from('lms_groups').select('id,name').eq('teacher_id', id)
      const groupIds = ((gs ?? []) as { id: string; name: string }[]).map(g => g.id)
      if (!groupIds.length) { setLoading(false); return }

      const { data: gsRows } = await supabase
        .from('lms_group_students')
        .select('student_id, group:lms_groups(name)')
        .in('group_id', groupIds)

      const idList = [...new Set(((gsRows ?? []) as { student_id: string; group: { name: string } | null }[]).map(r => r.student_id))]
      const groupMap: Record<string, string> = {}
      ;((gsRows ?? []) as { student_id: string; group: { name: string } | null }[]).forEach(r => {
        if (r.group) groupMap[r.student_id] = r.group.name
      })

      if (idList.length) {
        const { data: profiles } = await supabase.from('profiles').select('id,full_name').in('id', idList).order('full_name')
        setStudents(((profiles ?? []) as { id: string; full_name?: string }[]).map(p => ({
          id: p.id, full_name: p.full_name ?? '—', group_name: groupMap[p.id] ?? '—'
        })))
      }

      // Load all notes for this teacher
      const { data: notesData } = await supabase
        .from('lms_teacher_notes')
        .select('id, student_id, note, updated_at')
        .eq('teacher_id', id)
        .order('updated_at', { ascending: false })
      setNotes((notesData ?? []) as Note[])
      setLoading(false)
    })
  }, [])

  const filtered = useMemo(() => {
    if (!search.trim()) return students
    const q = search.toLowerCase()
    return students.filter(s => s.full_name.toLowerCase().includes(q) || s.group_name.toLowerCase().includes(q))
  }, [students, search])

  function selectStudent(s: StudentOption) {
    setSelected(s)
    const existing = notes.find(n => n.student_id === s.id)
    setDraft(existing?.note ?? '')
    setSaveOk(false)
  }

  async function saveNote() {
    if (!selected || !uid) return
    setSaving(true)
    const existing = notes.find(n => n.student_id === selected.id)
    const now = new Date().toISOString()

    if (existing) {
      const { error } = await supabase.from('lms_teacher_notes').update({ note: draft, updated_at: now }).eq('id', existing.id)
      if (!error) setNotes(ns => ns.map(n => n.id === existing.id ? { ...n, note: draft, updated_at: now } : n))
    } else {
      const { data, error } = await supabase.from('lms_teacher_notes').insert({ teacher_id: uid, student_id: selected.id, note: draft }).select().single()
      if (!error && data) setNotes(ns => [data as Note, ...ns])
    }
    setSaving(false)
    setSaveOk(true)
    setTimeout(() => setSaveOk(false), 2000)
  }

  const noteFor = (studentId: string) => notes.find(n => n.student_id === studentId)

  if (loading) return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Заметки" />
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
    </div>
  )

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Заметки по студентам" />
      <div style={{ padding: '24px 28px', display: 'grid', gridTemplateColumns: '320px 1fr', gap: 20, alignItems: 'start' }}>

        {/* Left: student list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск студента..."
              style={{ width: '100%', padding: '10px 12px 10px 34px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 11, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#fff', boxSizing: 'border-box' }} />
          </div>

          <div style={{ ...card, overflow: 'hidden', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
            {filtered.length === 0 && (
              <div style={{ padding: 30, textAlign: 'center', color: '#94a3b8', fontSize: 13 }}>Студентов не найдено</div>
            )}
            {filtered.map(s => {
              const hasNote = !!noteFor(s.id)
              const isSelected = selected?.id === s.id
              return (
                <div key={s.id} onClick={() => selectStudent(s)}
                  style={{ padding: '13px 16px', borderBottom: '1px solid #f1f5f9', cursor: 'pointer', background: isSelected ? '#f0f9ff' : 'transparent', borderLeft: isSelected ? '3px solid #1B8FC4' : '3px solid transparent', transition: 'all 0.1s', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: isSelected ? '#1B3A6B' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: isSelected ? '#fff' : '#64748b', fontSize: 13, fontWeight: 800 }}>{s.full_name[0]?.toUpperCase()}</span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#1B3A6B' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.full_name}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{s.group_name}</div>
                  </div>
                  {hasNote && <StickyNote size={13} color="#C9933B" />}
                </div>
              )
            })}
          </div>
        </div>

        {/* Right: note editor */}
        {selected ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div style={{ ...card, padding: 28 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 18 }}>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B' }}>{selected.full_name}</div>
                  <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 2 }}>{selected.group_name}</div>
                </div>
                {noteFor(selected.id) && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#94a3b8' }}>
                    <Clock size={11} />
                    Изменено {new Date(noteFor(selected.id)!.updated_at).toLocaleDateString('ru-RU')}
                  </div>
                )}
              </div>

              <textarea
                value={draft}
                onChange={e => setDraft(e.target.value)}
                placeholder="Запишите наблюдения о студенте: сильные стороны, над чем работать, поведение на уроке, рекомендации родителям..."
                rows={14}
                style={{ width: '100%', padding: '14px 16px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 14, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', resize: 'vertical', lineHeight: 1.7, color: '#1e293b', boxSizing: 'border-box' as const, background: '#fafcff' }}
              />

              <div style={{ display: 'flex', gap: 10, marginTop: 16, alignItems: 'center' }}>
                <button onClick={saveNote} disabled={saving}
                  style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '11px 24px', borderRadius: 12, background: saveOk ? '#10b981' : '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: saving ? 'default' : 'pointer', fontFamily: 'Montserrat', transition: 'background 0.2s', opacity: saving ? 0.7 : 1 }}>
                  <Save size={15} /> {saving ? 'Сохранение...' : saveOk ? '✓ Сохранено' : 'Сохранить'}
                </button>
                {draft && (
                  <div style={{ fontSize: 12, color: '#94a3b8' }}>{draft.length} символов</div>
                )}
              </div>
            </div>

            {/* All notes list for quick navigation */}
            {notes.length > 0 && (
              <div style={{ ...card, padding: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 12 }}>
                  Все заметки ({notes.length})
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {notes.slice(0, 5).map(n => {
                    const st = students.find(s => s.id === n.student_id)
                    return (
                      <div key={n.id} onClick={() => st && selectStudent(st)}
                        style={{ padding: '10px 14px', borderRadius: 10, background: '#f8fafc', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', gap: 10, border: '1px solid #f1f5f9' }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B' }}>{st?.full_name ?? '—'}</div>
                          <div style={{ fontSize: 11, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{n.note.slice(0, 80)}{n.note.length > 80 ? '...' : ''}</div>
                        </div>
                        <div style={{ fontSize: 10, color: '#94a3b8', whiteSpace: 'nowrap' as const }}>{new Date(n.updated_at).toLocaleDateString('ru-RU')}</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div style={{ ...card, padding: '80px 0', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗒️</div>
            <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>Выберите студента</div>
            <div style={{ fontSize: 13 }}>Заметки видны только вам</div>
          </div>
        )}
      </div>
    </div>
  )
}
