'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Group {
  id: string
  name: string
  join_code: string
  students_count: number
  avg_progress: number
  level_code: string
  created_at: string
}

function genCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

export default function TeacherGroupsPage() {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [userId,  setUserId]  = useState('')

  // Create form
  const [showForm, setShowForm] = useState(false)
  const [formName, setFormName] = useState('')
  const [formLevel, setFormLevel] = useState('A1')
  const [creating, setCreating] = useState(false)
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)

    const { data } = await supabase
      .from('english_groups')
      .select('id, name, join_code, students_count, avg_progress, level_code, created_at')
      .eq('teacher_id', session.user.id)
      .order('created_at', { ascending: false })

    setGroups((data ?? []) as Group[])
    setLoading(false)
  }

  async function createGroup() {
    if (!formName.trim()) return
    setCreating(true)
    const supabase = createEnglishClient()
    const code = genCode()
    const { error } = await supabase.from('english_groups').insert({
      teacher_id: userId,
      name: formName.trim(),
      join_code: code,
      level_code: formLevel,
      students_count: 0,
      avg_progress: 0,
    })
    if (!error) {
      setFormName(''); setShowForm(false)
      await load()
    }
    setCreating(false)
  }

  async function deleteGroup(id: string) {
    if (!confirm('Удалить группу? Студенты потеряют привязку.')) return
    const supabase = createEnglishClient()
    await supabase.from('english_groups').delete().eq('id', id)
    await load()
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const LEVELS = ['A1', 'A1.1', 'A2', 'B1', 'B2', 'C1']

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Мои группы</h1>
          <p style={{ fontSize: 13, color: MUT }}>Создавайте группы и делитесь кодом со студентами</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '11px 22px', borderRadius: 12, border: 'none',
          background: showForm ? '#F1F5F9' : N, color: showForm ? MUT : '#fff',
          fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: showForm ? 'none' : `0 4px 14px ${N}44`,
        }}>
          {showForm ? 'Отмена' : '+ Создать группу'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', marginBottom: 20, border: `1.5px solid ${N}30`, boxShadow: `0 4px 20px ${N}12` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>Новая группа</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Название</label>
              <input value={formName} onChange={e => setFormName(e.target.value)} placeholder="напр. 4-А Информатика 2026"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = N}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Уровень</label>
              <select value={formLevel} onChange={e => setFormLevel(e.target.value)}
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <button onClick={createGroup} disabled={!formName.trim() || creating} style={{
            padding: '11px 24px', borderRadius: 10, border: 'none',
            background: !formName.trim() ? '#94A3B8' : N, color: '#fff',
            fontWeight: 700, fontSize: 13, cursor: !formName.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {creating ? 'Создаём...' : 'Создать'}
          </button>
        </div>
      )}

      {/* Groups list */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT }}>Загрузка...</div>
      ) : groups.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>Групп нет</div>
          <div style={{ fontSize: 13, color: MUT }}>Создайте первую группу и поделитесь кодом со студентами</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groups.map(g => (
            <div key={g.id} style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 18 }}>
              {/* Icon */}
              <div style={{ width: 48, height: 48, borderRadius: 14, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👥</div>

              {/* Info */}
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 15, fontWeight: 800, color: N }}>{g.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 700, background: '#EEF2F7', color: N, padding: '2px 8px', borderRadius: 99 }}>{g.level_code}</span>
                </div>
                <div style={{ fontSize: 12, color: MUT }}>{g.students_count ?? 0} студентов · прогресс {g.avg_progress ?? 0}%</div>
              </div>

              {/* Join code */}
              <div style={{ textAlign: 'center', flexShrink: 0 }}>
                <div style={{ fontSize: 10, color: MUT, marginBottom: 4, fontWeight: 600 }}>КОД ГРУППЫ</div>
                <button onClick={() => copyCode(g.join_code)} style={{
                  padding: '8px 16px', borderRadius: 10, border: `1.5px solid ${N}33`,
                  background: copied === g.join_code ? '#DCFCE7' : '#EEF2F7',
                  color: copied === g.join_code ? T : N,
                  fontWeight: 800, fontSize: 15, cursor: 'pointer', fontFamily: 'monospace',
                  letterSpacing: '0.1em', transition: 'all 0.2s',
                }}>
                  {copied === g.join_code ? '✓ Скопировано' : g.join_code}
                </button>
              </div>

              {/* Progress bar */}
              <div style={{ width: 80, flexShrink: 0 }}>
                <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${g.avg_progress ?? 0}%`, background: T, borderRadius: 99 }} />
                </div>
                <div style={{ fontSize: 11, color: T, fontWeight: 700, marginTop: 3, textAlign: 'right' }}>{g.avg_progress ?? 0}%</div>
              </div>

              {/* Delete */}
              <button onClick={() => deleteGroup(g.id)} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
