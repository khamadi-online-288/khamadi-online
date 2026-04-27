'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import { Megaphone, Pin, Trash2, Plus } from 'lucide-react'

interface Announcement { id: string; title: string; body: string; is_pinned: boolean; created_at: string; author?: string }

export default function AdminAnnouncementsPage() {
  const supabase = createEnglishClient()
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [form, setForm] = useState({ title: '', body: '', is_pinned: false })
  const [saving, setSaving] = useState(false)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const { data } = await supabase
      .from('lms_announcements')
      .select('id,title,body,is_pinned,created_at,author:profiles(full_name)')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(100)
    setAnnouncements(((data ?? []) as unknown[]).map((a: unknown) => {
      const row = a as { id: string; title: string; body: string; is_pinned: boolean; created_at: string; author?: { full_name?: string } }
      return { id: row.id, title: row.title, body: row.body, is_pinned: row.is_pinned, created_at: row.created_at, author: row.author?.full_name }
    }))
  }

  async function create(e: React.FormEvent) {
    e.preventDefault(); setSaving(true)
    const { data: { session } } = await supabase.auth.getSession()
    await supabase.from('lms_announcements').insert({ title: form.title, body: form.body, is_pinned: form.is_pinned, author_id: session?.user.id, target: 'all' })
    setForm({ title: '', body: '', is_pinned: false }); setShowForm(false); setSaving(false)
    load()
  }

  async function togglePin(id: string, current: boolean) {
    await supabase.from('lms_announcements').update({ is_pinned: !current }).eq('id', id)
    setAnnouncements(a => a.map(x => x.id === id ? { ...x, is_pinned: !current } : x).sort((a, b) => Number(b.is_pinned) - Number(a.is_pinned)))
  }

  async function remove(id: string) {
    await supabase.from('lms_announcements').delete().eq('id', id)
    setAnnouncements(a => a.filter(x => x.id !== id))
  }

  const inputStyle = { width: '100%', padding: '10px 13px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#f8fafc', boxSizing: 'border-box' as const }

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Объявления" />
      <div style={{ padding: '24px 28px', maxWidth: 800 }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <button onClick={() => setShowForm(v => !v)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '10px 18px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}><Plus size={14} /> Новое объявление</button>
        </div>

        {showForm && (
          <form onSubmit={create} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Заголовок *</label><input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} style={inputStyle} /></div>
            <div><label style={{ fontSize: 11, fontWeight: 700, color: '#475569', display: 'block', marginBottom: 5 }}>Текст *</label><textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} /></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input type="checkbox" id="pinned" checked={form.is_pinned} onChange={e => setForm(f => ({ ...f, is_pinned: e.target.checked }))} style={{ width: 16, height: 16 }} />
              <label htmlFor="pinned" style={{ fontSize: 13, fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Закрепить</label>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="submit" disabled={saving} style={{ flex: 1, padding: '11px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: saving ? 'default' : 'pointer', opacity: saving ? 0.7 : 1, fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Megaphone size={14} />{saving ? 'Публикация...' : 'Опубликовать'}</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '11px 18px', borderRadius: 10, background: '#f1f5f9', color: '#475569', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Отмена</button>
            </div>
          </form>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {announcements.map(a => (
            <div key={a.id} style={{ background: '#fff', borderRadius: 16, padding: '20px 24px', border: a.is_pinned ? '1.5px solid rgba(201,147,59,0.4)' : '1px solid rgba(27,143,196,0.1)', position: 'relative' as const }}>
              {a.is_pinned && <div style={{ position: 'absolute' as const, top: 14, right: 16, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}><Pin size={9} /> Закреплено</div>}
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 8, paddingRight: 80 }}>{a.title}</div>
              <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, whiteSpace: 'pre-wrap' as const, marginBottom: 12 }}>{a.body}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>{a.author && `${a.author} · `}{new Date(a.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => togglePin(a.id, a.is_pinned)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(201,147,59,0.3)', background: '#fffbeb', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#92400e', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 4 }}><Pin size={10} />{a.is_pinned ? 'Открепить' : 'Закрепить'}</button>
                  <button onClick={() => remove(a.id)} style={{ padding: '4px 10px', borderRadius: 7, border: '1.5px solid rgba(239,68,68,0.2)', background: '#fff8f8', fontSize: 11, fontWeight: 700, cursor: 'pointer', color: '#dc2626', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 4 }}><Trash2 size={10} /> Удалить</button>
                </div>
              </div>
            </div>
          ))}
          {announcements.length === 0 && <div style={{ textAlign: 'center' as const, color: '#94a3b8', padding: 40, fontSize: 13 }}>Нет объявлений</div>}
        </div>
      </div>
    </div>
  )
}
