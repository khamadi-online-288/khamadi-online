'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import { createNotification, NOTIF } from '@/lib/english/lms/notifications'
import { logActivity } from '@/lib/english/lms/activity'

const TYPES = ['essay','quiz','speaking','reading','project']
const TYPE_LABELS: Record<string, string> = { essay:'Эссе', quiz:'Тест', speaking:'Говорение', reading:'Чтение', project:'Проект' }

export default function CreateAssignmentPage() {
  const router = useRouter()
  const supabase = createEnglishClient()
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', type: 'essay', groupId: '', courseId: '', dueDate: '', maxScore: 100, instructions: '' })

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return
      const [gRes, cRes] = await Promise.all([
        supabase.from('lms_groups').select('id,name').eq('teacher_id', session.user.id),
        supabase.from('english_courses').select('id,title').order('title'),
      ])
      setGroups((gRes.data ?? []) as { id: string; name: string }[])
      setCourses((cRes.data ?? []) as { id: string; title: string }[])
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.groupId) { setError('Заполните обязательные поля'); return }
    setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    const { data, error: err } = await supabase.from('lms_assignments').insert({
      title: form.title, description: form.description || null, type: form.type,
      group_id: form.groupId, course_id: form.courseId || null, teacher_id: session.user.id,
      due_date: form.dueDate || null, max_score: form.maxScore, instructions: form.instructions || null,
    }).select().single()
    if (err) { setError(err.message); setSaving(false); return }

    // Уведомление студентам
    const { data: studentIds } = await supabase.from('lms_group_students').select('student_id').eq('group_id', form.groupId)
    await Promise.all((studentIds ?? []).map((x: { student_id: string }) =>
      createNotification(supabase, { userId: x.student_id, type: NOTIF.NEW_ASSIGNMENT, title: `Новое задание: ${form.title}`, body: `Дедлайн: ${form.dueDate || 'не указан'}`, link: `/english/dashboard` })
    ))
    await logActivity(supabase, { userId: session.user.id, action: 'create_assignment', entityType: 'lms_assignments', entityId: (data as { id: string }).id })
    router.push('/english/teacher/assignments')
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Создать задание" />
      <div style={{ padding: '24px 28px', maxWidth: 680 }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid rgba(27,143,196,0.1)', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13, fontWeight: 600 }}>{error}</div>}

          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Название *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Например: Эссе на тему Present Simple" style={inputStyle} /></div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Группа *</label>
              <select required value={form.groupId} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))} style={inputStyle}>
                <option value="">— Выберите группу —</option>
                {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
              </select></div>
            <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Тип</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>
                {TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}
              </select></div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Дедлайн</label>
              <input type="datetime-local" value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Макс. балл</label>
              <input type="number" min={1} max={1000} value={form.maxScore} onChange={e => setForm(f => ({ ...f, maxScore: parseInt(e.target.value) || 100 }))} style={inputStyle} /></div>
          </div>

          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Курс (необязательно)</label>
            <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} style={inputStyle}>
              <option value="">— Не привязывать к курсу —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select></div>

          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Описание</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={2} placeholder="Краткое описание задания" style={{ ...inputStyle, resize: 'vertical' }} /></div>

          <div><label style={{ fontSize: 13, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 6 }}>Инструкции</label>
            <textarea value={form.instructions} onChange={e => setForm(f => ({ ...f, instructions: e.target.value }))} rows={4} placeholder="Подробные инструкции для студентов..." style={{ ...inputStyle, resize: 'vertical' }} /></div>

          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '13px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat' }}>
              {saving ? 'Создание...' : 'Создать задание'}
            </button>
            <button type="button" onClick={() => router.back()} style={{ padding: '13px 20px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  )
}
