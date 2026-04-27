'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Plus, Trash2, Save } from 'lucide-react'

type FAQ = { id: string; category: string; question: string; answer: string; order_index: number; is_published: boolean }

const CATS = ['technical','course','account','certificate','other']
const CAT_RU: Record<string,string> = { technical:'Техническая', course:'Курс', account:'Аккаунт', certificate:'Сертификат', other:'Другое' }

export default function AgentFAQPage() {
  const [items, setItems]   = useState<FAQ[]>([])
  const [form,  setForm]    = useState({ category: 'technical', question: '', answer: '' })
  const [loading, setLoading] = useState(true)
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('english_support_faq').select('*').order('category').order('order_index')
    setItems((data ?? []) as FAQ[])
    setLoading(false)
  }

  async function addFAQ(e: React.FormEvent) {
    e.preventDefault()
    if (!form.question.trim() || !form.answer.trim()) return
    const idx = items.filter(i => i.category === form.category).length + 1
    const { data } = await supabase.from('english_support_faq').insert({ ...form, order_index: idx, is_published: true }).select().single()
    if (data) { setItems(i => [...i, data as FAQ]); setForm(f => ({ ...f, question: '', answer: '' })) }
  }

  async function togglePublish(id: string, current: boolean) {
    await supabase.from('english_support_faq').update({ is_published: !current }).eq('id', id)
    setItems(i => i.map(x => x.id === id ? { ...x, is_published: !current } : x))
  }

  async function deleteFAQ(id: string) {
    await supabase.from('english_support_faq').delete().eq('id', id)
    setItems(i => i.filter(x => x.id !== id))
  }

  const byCategory = CATS.map(cat => ({ cat, items: items.filter(i => i.category === cat) }))
  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#1E2D40', color: '#fff', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>
      <div style={{ fontSize: 22, fontWeight: 900, color: '#fff', marginBottom: 24 }}>FAQ</div>

      {/* Add form */}
      <form onSubmit={addFAQ} style={{ background: '#1A2535', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 28, display: 'grid', gridTemplateColumns: '1fr 2fr 2fr auto', gap: 12, alignItems: 'end' }}>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Категория</label>
          <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
            {CATS.map(c => <option key={c} value={c}>{CAT_RU[c]}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Вопрос</label>
          <input value={form.question} onChange={e => setForm(f => ({ ...f, question: e.target.value }))} placeholder="Вопрос..." style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Ответ</label>
          <input value={form.answer} onChange={e => setForm(f => ({ ...f, answer: e.target.value }))} placeholder="Ответ..." style={inputStyle} />
        </div>
        <button type="submit" style={{ padding: '10px 16px', borderRadius: 10, background: '#1B8FC4', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' as const }}><Plus size={15} /> Добавить</button>
      </form>

      {/* FAQ list */}
      {byCategory.filter(g => g.items.length > 0).map(({ cat, items: catItems }) => (
        <div key={cat} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: '#1B8FC4', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em' }}>{CAT_RU[cat] ?? cat}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {catItems.map(item => (
              <div key={item.id} style={{ background: '#1A2535', borderRadius: 14, padding: '16px 20px', border: `1px solid rgba(255,255,255,${item.is_published ? '0.06' : '0.02'})`, opacity: item.is_published ? 1 : 0.5 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 6 }}>{item.question}</div>
                    <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>{item.answer}</div>
                  </div>
                  <div style={{ display: 'flex', gap: 8, marginLeft: 16, flexShrink: 0 }}>
                    <button onClick={() => togglePublish(item.id, item.is_published)} style={{ padding: '6px 12px', borderRadius: 8, background: item.is_published ? 'rgba(16,185,129,0.15)' : 'rgba(100,116,139,0.15)', color: item.is_published ? '#10b981' : '#64748b', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                      {item.is_published ? 'Скрыть' : 'Показать'}
                    </button>
                    <button onClick={() => deleteFAQ(item.id)} style={{ padding: '6px 10px', borderRadius: 8, background: 'rgba(239,68,68,0.12)', color: '#ef4444', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {!loading && items.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', padding: 40, textAlign: 'center' }}>FAQ пуст. Добавьте первый вопрос выше.</div>}
    </div>
  )
}
