'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Assignment {
  id: string
  title: string
  deadline_at: string | null
  min_score: number
  group_id: string
  group_name?: string
  created_at: string
}

interface Group { id: string; name: string }

export default function TeacherHomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [groups, setGroups]           = useState<Group[]>([])
  const [loading, setLoading]         = useState(true)
  const [userId, setUserId]           = useState('')

  // Form
  const [showForm, setShowForm]     = useState(false)
  const [formTitle, setFormTitle]   = useState('')
  const [formGroup, setFormGroup]   = useState('')
  const [formDeadline, setFormDeadline] = useState('')
  const [formScore, setFormScore]   = useState('70')
  const [creating, setCreating]     = useState(false)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)

    const { data: grps } = await supabase
      .from('english_groups')
      .select('id, name')
      .eq('teacher_id', session.user.id)
    setGroups((grps ?? []) as Group[])
    if (grps && grps.length > 0 && !formGroup) setFormGroup(grps[0].id)

    const groupIds = (grps ?? []).map((g: Group) => g.id)
    if (groupIds.length === 0) { setLoading(false); return }

    const { data: asgns } = await supabase
      .from('english_assignments')
      .select('id, title, deadline_at, min_score, group_id, created_at')
      .in('group_id', groupIds)
      .order('created_at', { ascending: false })

    const groupMap: Record<string, string> = {}
    ;(grps ?? []).forEach((g: Group) => { groupMap[g.id] = g.name })

    const mapped = (asgns ?? []).map((a: Assignment) => ({
      ...a,
      group_name: groupMap[a.group_id] ?? '—',
    }))
    setAssignments(mapped as Assignment[])
    setLoading(false)
  }

  async function createAssignment() {
    if (!formTitle.trim() || !formGroup) return
    setCreating(true)
    const supabase = createEnglishClient()
    const { error } = await supabase.from('english_assignments').insert({
      teacher_id: userId,
      group_id:   formGroup,
      title:      formTitle.trim(),
      deadline_at: formDeadline ? new Date(formDeadline).toISOString() : null,
      min_score:  parseInt(formScore) || 70,
    })
    if (!error) {
      setFormTitle(''); setFormDeadline(''); setShowForm(false)
      await load()
    }
    setCreating(false)
  }

  async function deleteAssignment(id: string) {
    if (!confirm('Удалить задание?')) return
    const supabase = createEnglishClient()
    await supabase.from('english_assignments').delete().eq('id', id)
    await load()
  }

  function daysLeft(deadline: string | null) {
    if (!deadline) return null
    const diff = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    if (diff < 0) return { label: 'Просрочено', color: '#DC2626' }
    if (diff === 0) return { label: 'Сегодня', color: '#EF4444' }
    if (diff <= 2) return { label: `${diff} дн.`, color: G }
    return { label: `${diff} дн.`, color: MUT }
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Домашние задания</h1>
          <p style={{ fontSize: 13, color: MUT }}>Назначайте задания своим группам</p>
        </div>
        {groups.length > 0 && (
          <button onClick={() => setShowForm(s => !s)} style={{
            padding: '11px 22px', borderRadius: 12, border: 'none',
            background: showForm ? '#F1F5F9' : N, color: showForm ? MUT : '#fff',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: showForm ? 'none' : `0 4px 14px ${N}44`,
          }}>
            {showForm ? 'Отмена' : '+ Новое задание'}
          </button>
        )}
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', marginBottom: 20, border: `1.5px solid ${N}30`, boxShadow: `0 4px 20px ${N}12` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>Новое задание</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Название задания</label>
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)} placeholder="напр. Урок 5: Present Perfect — домашнее задание"
                style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = N}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Группа</label>
                <select value={formGroup} onChange={e => setFormGroup(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Дедлайн</label>
                <input type="datetime-local" value={formDeadline} onChange={e => setFormDeadline(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Мин. балл</label>
                <input type="number" value={formScore} onChange={e => setFormScore(e.target.value)} min="0" max="100"
                  style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>
          <button onClick={createAssignment} disabled={!formTitle.trim() || creating} style={{
            padding: '11px 24px', borderRadius: 10, border: 'none',
            background: !formTitle.trim() ? '#94A3B8' : N, color: '#fff',
            fontWeight: 700, fontSize: 13, cursor: !formTitle.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
          }}>
            {creating ? 'Создаём...' : 'Назначить задание'}
          </button>
        </div>
      )}

      {/* No groups warning */}
      {!loading && groups.length === 0 && (
        <div style={{ background: '#FFFBEB', borderRadius: 14, padding: '16px 20px', border: '1px solid #FDE68A', marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
            ⚠️ Сначала создайте группу в разделе «Группы», затем назначайте задания
          </div>
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT }}>Загрузка...</div>
      ) : assignments.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>Заданий нет</div>
          <div style={{ fontSize: 13, color: MUT }}>Создайте первое задание для своей группы</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {assignments.map(a => {
            const dl = daysLeft(a.deadline_at)
            const created = new Date(a.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
            return (
              <div key={a.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>📋</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: N, marginBottom: 3 }}>{a.title}</div>
                  <div style={{ fontSize: 12, color: MUT }}>
                    Группа: <strong>{a.group_name}</strong> · Мин. балл: {a.min_score}% · Создано: {created}
                  </div>
                </div>
                {dl && (
                  <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 700, color: dl.color, background: `${dl.color}15`, padding: '5px 12px', borderRadius: 99 }}>
                    ⏰ {dl.label}
                  </div>
                )}
                <button onClick={() => deleteAssignment(a.id)} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
