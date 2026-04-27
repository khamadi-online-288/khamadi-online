'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { Plus, CheckCircle } from 'lucide-react'

type Incident = { id: string; title: string; description: string | null; status: string; severity: string; created_at: string; resolved_at: string | null }

const SEV_COLORS: Record<string,string> = { minor:'#C9933B', major:'#ef4444', critical:'#7f1d1d' }
const SEV_BG:    Record<string,string> = { minor:'rgba(201,147,59,0.15)', major:'rgba(239,68,68,0.15)', critical:'rgba(127,29,29,0.25)' }
const STATUS_LABELS: Record<string,string> = { investigating:'Расследуется', identified:'Определено', monitoring:'Мониторинг', resolved:'Решено' }

export default function AgentStatusPage() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [form, setForm] = useState({ title: '', description: '', status: 'investigating', severity: 'minor' })
  const [showForm, setShowForm] = useState(false)
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [])
  async function load() {
    const { data } = await supabase.from('english_platform_status').select('*').order('created_at', { ascending: false })
    setIncidents((data ?? []) as Incident[])
  }

  async function createIncident(e: React.FormEvent) {
    e.preventDefault()
    await supabase.from('english_platform_status').insert(form)
    setShowForm(false)
    setForm({ title: '', description: '', status: 'investigating', severity: 'minor' })
    load()
  }

  async function resolveIncident(id: string) {
    await supabase.from('english_platform_status').update({ status: 'resolved', resolved_at: new Date().toISOString() }).eq('id', id)
    setIncidents(i => i.map(x => x.id === id ? { ...x, status: 'resolved', resolved_at: new Date().toISOString() } : x))
  }

  const active = incidents.filter(i => i.status !== 'resolved')
  const overallOk = active.length === 0

  const inputStyle: React.CSSProperties = { width: '100%', padding: '10px 12px', border: '1.5px solid rgba(255,255,255,0.08)', borderRadius: 10, fontSize: 13, fontFamily: 'Montserrat', background: '#1E2D40', color: '#fff', outline: 'none', boxSizing: 'border-box' }

  return (
    <div style={{ padding: '32px 36px', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: '#fff' }}>Статус платформы</div>
        <button onClick={() => setShowForm(s => !s)} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
          <Plus size={14} /> Создать инцидент
        </button>
      </div>

      {/* Overall status */}
      <div style={{ background: overallOk ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)', borderRadius: 18, padding: '24px 28px', border: `1px solid ${overallOk ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.25)'}`, marginBottom: 24, display: 'flex', alignItems: 'center', gap: 16 }}>
        <div style={{ fontSize: 40 }}>{overallOk ? '🟢' : '🔴'}</div>
        <div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#fff' }}>{overallOk ? 'Все системы работают' : `Активных инцидентов: ${active.length}`}</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{overallOk ? 'Нет активных инцидентов' : active.map(i => i.title).join(', ')}</div>
        </div>
      </div>

      {/* Create form */}
      {showForm && (
        <form onSubmit={createIncident} style={{ background: '#1A2535', borderRadius: 18, padding: 24, border: '1px solid rgba(255,255,255,0.06)', marginBottom: 24, display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Название *</label>
            <input required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Название инцидента" style={inputStyle} />
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Статус</label>
            <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={inputStyle}>
              {Object.entries(STATUS_LABELS).map(([v,l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block', marginBottom: 6, textTransform: 'uppercase' as const }}>Критичность</label>
            <select value={form.severity} onChange={e => setForm(f => ({ ...f, severity: e.target.value }))} style={inputStyle}>
              <option value="minor">Незначительный</option><option value="major">Серьёзный</option><option value="critical">Критический</option>
            </select>
          </div>
          <button type="submit" style={{ padding: '10px 16px', borderRadius: 10, background: '#ef4444', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap' as const }}>Создать</button>
        </form>
      )}

      {/* Incidents list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {incidents.map(inc => (
          <div key={inc.id} style={{ background: inc.status === 'resolved' ? 'rgba(255,255,255,0.02)' : SEV_BG[inc.severity] ?? '#1A2535', borderRadius: 14, padding: '18px 20px', border: `1px solid ${inc.status === 'resolved' ? 'rgba(255,255,255,0.05)' : SEV_COLORS[inc.severity] + '40' ?? '#1A2535'}`, opacity: inc.status === 'resolved' ? 0.6 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
                <span style={{ background: SEV_BG[inc.severity], color: SEV_COLORS[inc.severity], borderRadius: 6, padding: '2px 9px', fontSize: 12, fontWeight: 700 }}>{inc.severity}</span>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{STATUS_LABELS[inc.status] ?? inc.status}</span>
              </div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#fff' }}>{inc.title}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', marginTop: 4 }}>{new Date(inc.created_at).toLocaleString('ru-RU')}</div>
            </div>
            {inc.status !== 'resolved' && (
              <button onClick={() => resolveIncident(inc.id)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 10, background: 'rgba(16,185,129,0.15)', color: '#10b981', fontWeight: 700, fontSize: 12, border: '1px solid rgba(16,185,129,0.25)', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                <CheckCircle size={14} /> Решено
              </button>
            )}
          </div>
        ))}
        {incidents.length === 0 && <div style={{ color: 'rgba(255,255,255,0.3)', padding: 40, textAlign: 'center' }}>Инцидентов нет</div>}
      </div>
    </div>
  )
}
