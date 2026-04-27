'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import type { LMSAnnouncement } from '@/lib/english/lms/types'
import { Plus, X, Pin } from 'lucide-react'

const TARGET_LABELS: Record<string, string> = { all: 'Все', students: 'Студенты', teachers: 'Преподаватели', group: 'Группа' }

export default function TeacherAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<LMSAnnouncement[]>([])
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', body: '', target: 'students', groupId: '', isPinned: false })
  const [uid, setUid] = useState('')
  const [saving, setSaving] = useState(false)
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUid(session.user.id)
    const [aRes, gRes] = await Promise.all([
      supabase.from('lms_announcements').select('*,author:profiles(full_name)').or(`author_id.eq.${session.user.id},target.eq.all,target.eq.teachers`).order('is_pinned', { ascending: false }).order('created_at', { ascending: false }),
      supabase.from('lms_groups').select('id,name').eq('teacher_id', session.user.id),
    ])
    setAnnouncements((aRes.data ?? []) as LMSAnnouncement[])
    setGroups((gRes.data ?? []) as { id: string; name: string }[])
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('lms_announcements').insert({ author_id: uid, title: form.title, body: form.body, target: form.target, group_id: form.target === 'group' ? form.groupId : null, is_pinned: form.isPinned })
    setSaving(false)
    setShowForm(false)
    setForm({ title: '', body: '', target: 'students', groupId: '', isPinned: false })
    load()
  }

  async function del(id: string) {
    await supabase.from('lms_announcements').delete().eq('id', id)
    setAnnouncements(a => a.filter(x => x.id !== id))
  }

  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Объявления" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => setShowForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
            <Plus size={15} /> Создать объявление
          </button>
        </div>
        {showForm && (
          <form onSubmit={submit} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: '#1B3A6B' }}>Новое объявление</div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Заголовок *</label><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Текст *</label><textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Получатели</label>
                <select value={form.target} onChange={e => setForm(f => ({ ...f, target: e.target.value }))} style={inputStyle}>
                  <option value="all">Все</option><option value="students">Студенты</option><option value="teachers">Преподаватели</option><option value="group">Группа</option>
                </select></div>
              {form.target === 'group' && (
                <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Группа</label>
                  <select value={form.groupId} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))} style={inputStyle}><option value="">—</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
              )}
            </div>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600, color: '#475569' }}>
              <input type="checkbox" checked={form.isPinned} onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))} style={{ width: 16, height: 16 }} />
              Закрепить объявление
            </label>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>{saving ? 'Публикация...' : 'Опубликовать'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '11px 18px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
            </div>
          </form>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {announcements.map(a => (
            <div key={a.id} style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', border: `1px solid ${a.is_pinned ? 'rgba(201,147,59,0.3)' : 'rgba(27,143,196,0.1)'}`, boxShadow: '0 2px 10px rgba(27,58,107,0.06)', position: 'relative' }}>
              {a.is_pinned && <div style={{ position: 'absolute', top: 16, right: 46, color: '#C9933B' }}><Pin size={16} /></div>}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1, paddingRight: 32 }}>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, fontWeight: 700, background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '2px 8px' }}>{TARGET_LABELS[a.target ?? 'all']}</span>
                    {a.is_pinned && <span style={{ fontSize: 11, fontWeight: 700, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px' }}>Закреплено</span>}
                  </div>
                  <div style={{ fontSize: 16, fontWeight: 900, color: '#1B3A6B', marginBottom: 8 }}>{a.title}</div>
                  <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{a.body}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 10 }}>{new Date(a.created_at).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                </div>
                {a.author_id === uid && (
                  <button onClick={() => del(a.id)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}><X size={16} /></button>
                )}
              </div>
            </div>
          ))}
          {announcements.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 16 }}><div style={{ fontSize: 48, marginBottom: 12 }}>📢</div>Объявлений нет</div>}
        </div>
      </div>
    </div>
  )
}
