'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Plus, Trash2 } from 'lucide-react'

type Template = { id: string; title: string; body: string; category: string | null }

export default function AgentTemplatesPage() {
  const [items,  setItems]  = useState<Template[]>([])
  const [form,   setForm]   = useState({ title: '', body: '', category: '' })
  const [expand, setExpand] = useState<string | null>(null)
  const supabase = createEnglishClient()

  useEffect(() => {
    supabase.from('english_support_templates').select('id,title,body,category').order('created_at').then(({ data }) => setItems((data ?? []) as Template[]))
  }, [])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    if (!form.title.trim() || !form.body.trim()) return
    const { data } = await supabase.from('english_support_templates').insert({ title: form.title, body: form.body, category: form.category || null }).select().single()
    if (data) { setItems(i => [...i, data as Template]); setForm({ title: '', body: '', category: '' }) }
  }

  async function del(id: string) {
    await supabase.from('english_support_templates').delete().eq('id', id)
    setItems(i => i.filter(x => x.id !== id))
  }

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#1E2D40', color: '#fff', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 24 }}>Шаблоны ответов</div>

      <form onSubmit={add} style={{ background: '#1A2535', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 28 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#fff', marginBottom: 16 }}>Новый шаблон</div>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 12, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Название *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Название шаблона" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Категория</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
              <option value="">Все категории</option>
              {['technical','course','account','certificate'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Текст *</label>
          <textarea required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} rows={4} placeholder="Текст шаблона..." style={{ ...inputStyle, resize: 'vertical' as const, lineHeight: 1.6 }} />
        </div>
        <button type="submit" style={{ padding: '10px 20px', borderRadius: 10, background: '#1B8FC4', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={14} /> Добавить шаблон</button>
      </form>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map(item => (
          <div key={item.id} style={{ background: '#1A2535', borderRadius: 14, border: '1px solid rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div onClick={() => setExpand(e => e === item.id ? null : item.id)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: '#fff' }}>{item.title}</span>
                {item.category && <span style={{ background: 'rgba(27,143,196,0.15)', color: '#1B8FC4', borderRadius: 5, padding: '2px 8px', fontSize: 11, fontWeight: 700 }}>{item.category}</span>}
              </div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>{expand === item.id ? '▲' : '▼'}</span>
                <button onClick={e => { e.stopPropagation(); del(item.id) }} style={{ padding: '5px', borderRadius: 7, background: 'rgba(239,68,68,0.12)', color: '#ef4444', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
            {expand === item.id && (
              <div style={{ padding: '0 20px 16px', fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, whiteSpace: 'pre-wrap' as const, borderTop: '1px solid rgba(255,255,255,0.04)' }}>
                {item.body}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
