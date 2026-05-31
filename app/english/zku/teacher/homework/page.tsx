'use client'

import { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Assignment {
  id: string; title: string; deadline_at: string | null
  min_score: number; group_id: string; created_at: string
  group_name?: string; completed_count?: number
}
interface Group { id: string; name: string; students_count: number }

type Toast = { msg: string; type: 'success' | 'error' }

export default function TeacherHomeworkPage() {
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [groups,      setGroups]      = useState<Group[]>([])
  const [loading,     setLoading]     = useState(true)
  const [userId,      setUserId]      = useState('')
  const [toast,       setToast]       = useState<Toast | null>(null)
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'overdue'>('all')

  // Form
  const [showForm, setShowForm]       = useState(false)
  const [formTitle, setFormTitle]     = useState('')
  const [formGroup, setFormGroup]     = useState('')
  const [formDeadline, setFormDeadline] = useState('')
  const [formScore, setFormScore]     = useState('70')
  const [formDesc, setFormDesc]       = useState('')
  const [creating, setCreating]       = useState(false)

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }, [])

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)

    const { data: grps } = await supabase
      .from('english_groups').select('id, name, students_count').eq('teacher_id', session.user.id)
    const groupList = (grps ?? []) as Group[]
    setGroups(groupList)
    if (groupList.length > 0 && !formGroup) setFormGroup(groupList[0].id)

    const groupIds = groupList.map(g => g.id)
    if (groupIds.length === 0) { setLoading(false); return }

    const groupMap: Record<string, Group> = {}
    groupList.forEach(g => { groupMap[g.id] = g })

    const { data: asgns } = await supabase
      .from('english_assignments').select('id, title, deadline_at, min_score, group_id, created_at')
      .in('group_id', groupIds).order('deadline_at', { ascending: true, nullsFirst: false })

    setAssignments(((asgns ?? []) as Assignment[]).map(a => ({
      ...a, group_name: groupMap[a.group_id]?.name ?? '—',
    })))
    setLoading(false)
  }, [formGroup])

  useEffect(() => { load() }, [load])

  async function create() {
    if (!formTitle.trim() || !formGroup) return
    setCreating(true)
    const supabase = createEnglishClient()
    const { error } = await supabase.from('english_assignments').insert({
      teacher_id: userId, group_id: formGroup,
      title: formTitle.trim(), deadline_at: formDeadline ? new Date(formDeadline).toISOString() : null,
      min_score: parseInt(formScore) || 70,
    })
    if (error) showToast('Ошибка при создании', 'error')
    else { showToast(`Задание «${formTitle.trim()}» назначено!`); setFormTitle(''); setFormDeadline(''); setFormDesc(''); setShowForm(false); await load() }
    setCreating(false)
  }

  async function del(id: string, title: string) {
    if (!confirm(`Удалить задание «${title}»?`)) return
    const supabase = createEnglishClient()
    await supabase.from('english_assignments').delete().eq('id', id)
    showToast('Задание удалено')
    await load()
  }

  function status(deadline: string | null) {
    if (!deadline) return { label: 'Без срока', color: MUT, bg: '#F1F5F9', icon: '📋' }
    const d = Math.ceil((new Date(deadline).getTime() - Date.now()) / 86400000)
    if (d < 0) return { label: 'Просрочено', color: '#DC2626', bg: '#FEE2E2', icon: '🚨' }
    if (d === 0) return { label: 'Сегодня', color: '#EF4444', bg: '#FEE2E2', icon: '⏰' }
    if (d <= 2) return { label: `${d} дн.`, color: G, bg: '#FEF3C7', icon: '⚡' }
    return { label: `${d} дн.`, color: T, bg: '#DCFCE7', icon: '✅' }
  }

  const filtered = assignments.filter(a => {
    if (filterStatus === 'all') return true
    const d = a.deadline_at ? Math.ceil((new Date(a.deadline_at).getTime() - Date.now()) / 86400000) : 999
    if (filterStatus === 'overdue') return d < 0
    return d >= 0
  })

  const stats = {
    total: assignments.length,
    active: assignments.filter(a => { const d = a.deadline_at ? Math.ceil((new Date(a.deadline_at).getTime() - Date.now()) / 86400000) : 999; return d >= 0 }).length,
    overdue: assignments.filter(a => { const d = a.deadline_at ? Math.ceil((new Date(a.deadline_at).getTime() - Date.now()) / 86400000) : 999; return d < 0 }).length,
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 940, margin: '0 auto' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease' }}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
          <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Домашние задания</h1>
          <div style={{ display: 'flex', gap: 14, fontSize: 13, color: MUT }}>
            <span>📋 Всего: <strong style={{ color: N }}>{stats.total}</strong></span>
            <span>✅ Активных: <strong style={{ color: T }}>{stats.active}</strong></span>
            {stats.overdue > 0 && <span>🚨 Просрочено: <strong style={{ color: '#DC2626' }}>{stats.overdue}</strong></span>}
          </div>
        </div>
        {groups.length > 0 && (
          <button onClick={() => setShowForm(s => !s)} style={{
            padding: '11px 20px', borderRadius: 12, border: 'none',
            background: showForm ? '#F1F5F9' : N, color: showForm ? MUT : '#fff',
            fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: showForm ? 'none' : `0 4px 14px ${N}44`,
          }}>{showForm ? '✕ Отмена' : '+ Новое задание'}</button>
        )}
      </div>

      {/* No groups warning */}
      {!loading && groups.length === 0 && (
        <div style={{ background: '#FFFBEB', borderRadius: 14, padding: '14px 18px', border: '1px solid #FDE68A', marginBottom: 18 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#92400E' }}>
            ⚠️ Сначала создайте группу в разделе «Группы», затем назначайте задания
          </span>
        </div>
      )}

      {/* Create form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', marginBottom: 18, border: `2px solid ${N}33`, boxShadow: `0 4px 20px ${N}10` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>📋 Новое задание</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Название задания *</label>
              <input value={formTitle} onChange={e => setFormTitle(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && create()}
                placeholder="напр. Урок 12: Present Perfect — домашнее задание"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = N}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 100px', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Группа *</label>
                <select value={formGroup} onChange={e => setFormGroup(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                  {groups.map(g => <option key={g.id} value={g.id}>{g.name} ({g.students_count ?? 0} студ.)</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Дедлайн</label>
                <input type="datetime-local" value={formDeadline} onChange={e => setFormDeadline(e.target.value)}
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Мин. балл</label>
                <input type="number" value={formScore} onChange={e => setFormScore(e.target.value)} min="0" max="100"
                  style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={create} disabled={!formTitle.trim() || creating} style={{
              padding: '11px 22px', borderRadius: 10, border: 'none',
              background: !formTitle.trim() ? '#94A3B8' : N, color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: !formTitle.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: !formTitle.trim() ? 'none' : `0 4px 14px ${N}44`,
            }}>{creating ? 'Назначаем...' : 'Назначить задание'}</button>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>Студенты увидят задание в своём кабинете</div>
          </div>
        </div>
      )}

      {/* Filter tabs */}
      {assignments.length > 0 && (
        <div style={{ display: 'flex', gap: 6, marginBottom: 16 }}>
          {([['all', 'Все', assignments.length], ['active', 'Активные', stats.active], ['overdue', 'Просрочено', stats.overdue]] as const).map(([val, lbl, cnt]) => (
            <button key={val} onClick={() => setFilterStatus(val)} style={{
              padding: '7px 16px', borderRadius: 99, border: 'none', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
              background: filterStatus === val ? N : '#fff',
              color: filterStatus === val ? '#fff' : MUT,
              boxShadow: filterStatus === val ? `0 3px 10px ${N}44` : '0 1px 3px rgba(0,0,0,0.06)',
            }}>{lbl} ({cnt})</button>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>📋</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: N, marginBottom: 8 }}>
            {filterStatus === 'overdue' ? 'Просроченных нет' : filterStatus === 'active' ? 'Активных заданий нет' : 'Заданий нет'}
          </div>
          <div style={{ fontSize: 13, color: MUT }}>
            {filterStatus === 'all' && 'Создайте первое задание для своей группы'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(a => {
            const s = status(a.deadline_at)
            const created = new Date(a.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
            const groupStudents = groups.find(g => g.id === a.group_id)?.students_count ?? 0
            return (
              <div key={a.id} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,56,118,0.04)' }}>
                {/* Status bar */}
                <div style={{ height: 3, background: s.bg }}>
                  <div style={{ height: '100%', background: s.color, width: '100%', opacity: 0.6 }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                  {/* Icon */}
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>{s.icon}</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 4 }}>{a.title}</div>
                    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', fontSize: 12, color: MUT }}>
                      <span>👥 {a.group_name}</span>
                      <span>🎓 {groupStudents} студентов</span>
                      <span>📊 Мин. балл: {a.min_score}%</span>
                      <span>📅 Создано: {created}</span>
                    </div>
                  </div>

                  {/* Deadline badge */}
                  {a.deadline_at && (
                    <div style={{ flexShrink: 0, fontSize: 12, fontWeight: 800, color: s.color, background: s.bg, padding: '6px 14px', borderRadius: 99 }}>
                      {s.icon} {s.label}
                      <div style={{ fontSize: 10, color: s.color, opacity: 0.8, fontWeight: 600 }}>
                        {new Date(a.deadline_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )}

                  {/* Delete */}
                  <button onClick={() => del(a.id, a.title)} style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16 }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
