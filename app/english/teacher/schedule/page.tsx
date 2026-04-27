'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import type { LMSScheduleEvent } from '@/lib/english/lms/types'
import { Plus, X, Calendar, Clock, MapPin, Link2 } from 'lucide-react'

const EVENT_TYPES = ['lesson','exam','consultation','event']
const TYPE_LABELS: Record<string, string> = { lesson:'Урок', exam:'Экзамен', consultation:'Консультация', event:'Событие' }
const TYPE_COLORS: Record<string, string> = { lesson:'#1B8FC4', exam:'#ef4444', consultation:'#10b981', event:'#C9933B' }

export default function TeacherSchedulePage() {
  const [events, setEvents] = useState<LMSScheduleEvent[]>([])
  const [groups, setGroups] = useState<{ id: string; name: string }[]>([])
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ title: '', type: 'lesson', groupId: '', startTime: '', endTime: '', location: '', meetingUrl: '', description: '' })
  const [saving, setSaving] = useState(false)
  const [uid, setUid] = useState('')
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [])

  async function load() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUid(session.user.id)
    const [eRes, gRes] = await Promise.all([
      supabase.from('lms_schedule').select('*,group:lms_groups(id,name)').eq('teacher_id', session.user.id).order('start_time'),
      supabase.from('lms_groups').select('id,name').eq('teacher_id', session.user.id),
    ])
    setEvents((eRes.data ?? []) as LMSScheduleEvent[])
    setGroups((gRes.data ?? []) as { id: string; name: string }[])
  }

  async function createEvent(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    const { data: newEvent } = await supabase.from('lms_schedule').insert({
      title: form.title, type: form.type, group_id: form.groupId || null,
      teacher_id: uid, start_time: form.startTime, end_time: form.endTime || form.startTime,
      location: form.location || null, meeting_url: form.meetingUrl || null, description: form.description || null,
    }).select('id').single()

    // Notify group students
    if (form.groupId && newEvent) {
      const { data: groupStudents } = await supabase
        .from('lms_group_students')
        .select('student_id')
        .eq('group_id', form.groupId)
      const students = (groupStudents ?? []) as { student_id: string }[]
      if (students.length > 0) {
        const startLabel = new Date(form.startTime).toLocaleString('ru-RU', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' })
        const notifRows = students.map(s => ({
          user_id: s.student_id,
          title: `Новое событие: ${form.title}`,
          body: `${TYPE_LABELS[form.type] ?? form.type} · ${startLabel}${form.location ? ' · ' + form.location : ''}`,
          type: 'schedule',
        }))
        await supabase.from('english_notifications').insert(notifRows)
      }
    }

    setSaving(false)
    setShowForm(false)
    setForm({ title: '', type: 'lesson', groupId: '', startTime: '', endTime: '', location: '', meetingUrl: '', description: '' })
    load()
  }

  async function deleteEvent(id: string) {
    await supabase.from('lms_schedule').delete().eq('id', id)
    setEvents(e => e.filter(x => x.id !== id))
  }

  const upcoming = events.filter(e => new Date(e.start_time) >= new Date())
  const past = events.filter(e => new Date(e.start_time) < new Date())
  const inputStyle = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  function renderEvent(ev: LMSScheduleEvent) {
    const grp = ev.group as { id: string; name: string } | null
    const color = TYPE_COLORS[ev.type ?? 'lesson'] ?? '#1B8FC4'
    return (
      <div key={ev.id} style={{ background: '#fff', borderRadius: 16, padding: '18px 20px', border: `1px solid ${color}28`, borderLeft: `4px solid ${color}`, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span style={{ background: `${color}18`, color, borderRadius: 6, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>{TYPE_LABELS[ev.type ?? 'lesson']}</span>
            {grp && <span style={{ fontSize: 12, color: '#64748b' }}>{grp.name}</span>}
          </div>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 6 }}>{ev.title}</div>
          <div style={{ display: 'flex', gap: 14, fontSize: 12, color: '#94a3b8', flexWrap: 'wrap' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Calendar size={12} />{new Date(ev.start_time).toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} />{new Date(ev.start_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</span>
            {ev.location && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} />{ev.location}</span>}
            {ev.meeting_url && <a href={ev.meeting_url} target="_blank" rel="noreferrer" style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#1B8FC4', textDecoration: 'none', fontWeight: 700 }}><Link2 size={12} />Ссылка</a>}
          </div>
        </div>
        <button onClick={() => deleteEvent(ev.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: 4 }}><X size={16} /></button>
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Расписание" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => setShowForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 20px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
            <Plus size={15} /> Добавить событие
          </button>
        </div>

        {showForm && (
          <form onSubmit={createEvent} style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 24, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ gridColumn: '1/-1', fontSize: 16, fontWeight: 900, color: '#1B3A6B' }}>Новое событие</div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Название *</label><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Тип</label>
              <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} style={inputStyle}>{EVENT_TYPES.map(t => <option key={t} value={t}>{TYPE_LABELS[t]}</option>)}</select></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Начало *</label><input required type="datetime-local" value={form.startTime} onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Конец</label><input type="datetime-local" value={form.endTime} onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Группа</label>
              <select value={form.groupId} onChange={e => setForm(f => ({ ...f, groupId: e.target.value }))} style={inputStyle}><option value="">— Без группы —</option>{groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</select></div>
            <div><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Место</label><input value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} placeholder="Аудитория 201" style={inputStyle} /></div>
            <div style={{ gridColumn: '1/-1' }}><label style={{ fontSize: 12, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Ссылка на встречу</label><input value={form.meetingUrl} onChange={e => setForm(f => ({ ...f, meetingUrl: e.target.value }))} placeholder="https://zoom.us/..." style={inputStyle} /></div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>{saving ? 'Создание...' : 'Создать'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '11px 20px', borderRadius: 12, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
            </div>
          </form>
        )}

        {upcoming.length > 0 && (
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 12 }}>Предстоящие</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>{upcoming.map(renderEvent)}</div>
          </div>
        )}
        {past.length > 0 && (
          <div>
            <div style={{ fontSize: 14, fontWeight: 800, color: '#94a3b8', marginBottom: 12 }}>Прошедшие</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, opacity: 0.65 }}>{past.map(renderEvent)}</div>
          </div>
        )}
        {events.length === 0 && <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontSize: 16 }}><div style={{ fontSize: 48, marginBottom: 12 }}>📅</div>Событий ещё нет</div>}
      </div>
    </div>
  )
}
