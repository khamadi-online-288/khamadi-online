'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { Users } from 'lucide-react'

export default function CreateGroupPage() {
  const router = useRouter()
  const supabase = createEnglishClient()
  const [form, setForm] = useState({ name: '', description: '', teacherId: '', courseId: '' })
  const [teachers, setTeachers] = useState<{ id: string; full_name?: string }[]>([])
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadOptions() {
      const [teacherRoles, coursesRes] = await Promise.all([
        supabase.from('english_user_roles').select('user_id').eq('role', 'teacher'),
        supabase.from('english_courses').select('id,title').eq('is_published', true).order('title'),
      ])
      const tIds = ((teacherRoles.data ?? []) as { user_id: string }[]).map(r => r.user_id)
      if (tIds.length) {
        const { data: profiles } = await supabase.from('profiles').select('id,full_name').in('id', tIds).order('full_name')
        setTeachers((profiles ?? []) as { id: string; full_name?: string }[])
      }
      setCourses((coursesRes.data ?? []) as { id: string; title: string }[])
    }
    loadOptions()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setError('')
    try {
      const { error: err } = await supabase.from('lms_groups').insert({ name: form.name, description: form.description || null, teacher_id: form.teacherId || null, course_id: form.courseId || null })
      if (err) throw new Error(err.message)
      router.push('/english/admin/groups')
    } catch (e: unknown) { setError((e as Error).message) }
    finally { setSaving(false) }
  }

  const inputStyle = { width: '100%', padding: '11px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 12, fontSize: 14, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Создать группу" />
      <div style={{ padding: '24px 28px', maxWidth: 600 }}>
        <form onSubmit={handleSubmit} style={{ background: '#fff', borderRadius: 20, padding: 32, border: '1px solid rgba(27,143,196,0.1)', display: 'flex', flexDirection: 'column', gap: 18 }}>
          {error && <div style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 10, padding: '10px 14px', fontSize: 13 }}>{error}</div>}
          <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Название группы *</label><input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} style={inputStyle} placeholder="Например: B1-2024-Group1" /></div>
          <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Описание</label><textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical' }} /></div>
          <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Курс</label>
            <select value={form.courseId} onChange={e => setForm(f => ({ ...f, courseId: e.target.value }))} style={inputStyle}>
              <option value="">— не выбран —</option>
              {courses.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Преподаватель</label>
            <select value={form.teacherId} onChange={e => setForm(f => ({ ...f, teacherId: e.target.value }))} style={inputStyle}>
              <option value="">— не выбран —</option>
              {teachers.map(t => <option key={t.id} value={t.id}>{t.full_name ?? t.id}</option>)}
            </select>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <Users size={16} />{saving ? 'Создание...' : 'Создать группу'}
            </button>
            <button type="button" onClick={() => router.back()} style={{ padding: '12px 20px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
          </div>
        </form>
      </div>
    </div>
  )
}
