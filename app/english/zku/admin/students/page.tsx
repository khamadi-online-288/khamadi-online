'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const ADMIN = '#7C3AED'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Student {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; last_active_at: string | null
  group_id: string | null; group_name?: string
}
interface Group { id: string; name: string; teacher_name?: string }
type Toast = { msg: string; type: 'success'|'error' }
type SortKey = 'name' | 'xp' | 'streak' | 'active'

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }

export default function AdminStudentsPage() {
  const [students,   setStudents]   = useState<Student[]>([])
  const [groups,     setGroups]     = useState<Group[]>([])
  const [loading,    setLoading]    = useState(true)
  const [search,     setSearch]     = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterActivity, setFilterActivity] = useState('all')
  const [sortKey,    setSortKey]    = useState<SortKey>('active')
  const [sortDir,    setSortDir]    = useState<'asc'|'desc'>('desc')
  const [toast,      setToast]      = useState<Toast | null>(null)
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [assignGroup, setAssignGroup] = useState('')

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const [{ data }, { data: grps }] = await Promise.all([
      supabase.from('english_user_profiles')
        .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
        .eq('role', 'student').order('total_xp', { ascending: false }),
      supabase.from('english_groups').select('id, name, teacher_id'),
    ])

    // Get teacher names for groups
    const teacherIds = [...new Set((grps ?? []).map((g: Group & { teacher_id?: string }) => g.teacher_id).filter(Boolean))]
    let tm: Record<string,string> = {}
    if (teacherIds.length > 0) {
      const { data: profiles } = await supabase.from('english_user_profiles')
        .select('user_id, full_name').in('user_id', teacherIds as string[])
      ;(profiles ?? []).forEach((p: { user_id: string; full_name: string | null }) => { tm[p.user_id] = p.full_name ?? '—' })
    }

    const groupList = ((grps ?? []) as (Group & { teacher_id?: string })[]).map(g => ({
      ...g, teacher_name: g.teacher_id ? tm[g.teacher_id] : '—'
    })) as Group[]
    setGroups(groupList)

    const gm: Record<string,string> = {}
    groupList.forEach(g => { gm[g.id] = g.name })

    setStudents(((data ?? []) as Student[]).map(s => ({ ...s, group_name: s.group_id ? gm[s.group_id] : undefined })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function assignToGroup(userId: string, groupId: string, studentName: string) {
    const supabase = createEnglishClient()
    const { error } = await supabase.from('english_user_profiles').update({ group_id: groupId || null }).eq('user_id', userId)
    if (error) showToast('Ошибка при назначении', 'error')
    else {
      const gName = groups.find(g => g.id === groupId)?.name ?? ''
      showToast(groupId ? `${studentName} → ${gName}` : `${studentName} убран из группы`)
    }
    setAssigningId(null)
    await load()
  }

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }

  const now = new Date()
  function daysSince(date: string | null) { return date ? Math.floor((now.getTime() - new Date(date).getTime()) / 86400000) : 999 }
  function activeLabel(date: string | null) {
    const d = daysSince(date)
    if (d === 0) return { label: 'Сегодня', color: T }
    if (d === 1) return { label: 'Вчера', color: '#22c55e' }
    if (d <= 7) return { label: `${d} дн.`, color: G }
    if (d <= 30) return { label: `${d} дн.`, color: '#f59e0b' }
    return { label: `${d} дн.`, color: '#CBD5E1' }
  }

  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const ms = !search || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      const ml = filterLevel === 'all' || s.current_level === filterLevel
      const d = daysSince(s.last_active_at)
      const ma = filterActivity === 'all' ? true
        : filterActivity === 'today' ? d === 0
        : filterActivity === 'week' ? d <= 7
        : filterActivity === 'inactive' ? d > 30 : true
      return ms && ml && ma
    })
    list = [...list].sort((a, b) => {
      let va: number|string, vb: number|string
      if (sortKey === 'name') { va = a.full_name ?? ''; vb = b.full_name ?? '' }
      else if (sortKey === 'xp') { va = a.total_xp ?? 0; vb = b.total_xp ?? 0 }
      else if (sortKey === 'streak') { va = a.current_streak ?? 0; vb = b.current_streak ?? 0 }
      else { va = a.last_active_at ?? ''; vb = b.last_active_at ?? '' }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
    return list
  }, [students, search, filterLevel, filterActivity, sortKey, sortDir])

  const levels = ['all', ...Array.from(new Set(students.map(s => s.current_level ?? 'A1')))]
  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: sortKey === k ? N : MUT, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0 }}>
      {label}{sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'}
    </button>
  )

  const stats = {
    today: students.filter(s => daysSince(s.last_active_at) === 0).length,
    inactive: students.filter(s => daysSince(s.last_active_at) > 30).length,
    noGroup: students.filter(s => !s.group_id).length,
    avgXp: students.length > 0 ? Math.round(students.reduce((a, s) => a + (s.total_xp ?? 0), 0) / students.length) : 0,
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Все студенты</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT, flexWrap: 'wrap' }}>
          <span>🎓 Всего: <strong style={{ color: N }}>{students.length}</strong></span>
          <span>⚡ Сегодня: <strong style={{ color: T }}>{stats.today}</strong></span>
          <span>😴 Неактивны 30+ дн.: <strong style={{ color: '#f59e0b' }}>{stats.inactive}</strong></span>
          {stats.noGroup > 0 && <span>⚠ Без группы: <strong style={{ color: '#EF4444' }}>{stats.noGroup}</strong></span>}
          <span>✨ Ср. XP: <strong style={{ color: G }}>{stats.avgXp.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по имени..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = N}
          onBlur={e => e.currentTarget.style.borderColor = BDR} />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          {levels.map(l => <option key={l} value={l}>{l === 'all' ? 'Все уровни' : l}</option>)}
        </select>
        <select value={filterActivity} onChange={e => setFilterActivity(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">Любая активность</option>
          <option value="today">Сегодня</option>
          <option value="week">Последние 7 дней</option>
          <option value="inactive">Неактивны 30+ дней</option>
        </select>
        {(search || filterLevel !== 'all' || filterActivity !== 'all') && (
          <button onClick={() => { setSearch(''); setFilterLevel('all'); setFilterActivity('all') }}
            style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#FEE2E2', color: '#DC2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>✕ Сбросить</button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 80px 120px 80px 100px 160px 60px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            <SortBtn k="name"    label="Студент" />
            <div style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Уровень</div>
            <SortBtn k="xp"     label="XP" />
            <SortBtn k="streak" label="Стрик" />
            <SortBtn k="active" label="Активность" />
            <div style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Группа</div>
            <div />
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Никого не найдено</div>
            </div>
          ) : filtered.map((s, i) => {
            const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
            const lc = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
            const ag = activeLabel(s.last_active_at)
            const d = daysSince(s.last_active_at)
            const isInactive = d > 30
            const isAssigning = assigningId === s.user_id
            return (
              <div key={s.user_id} style={{
                display: 'grid', gridTemplateColumns: '1.8fr 80px 120px 80px 100px 160px 60px',
                padding: '12px 20px', gap: 8, alignItems: 'center',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: isInactive ? '#FFFBEB' : i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${lc}, ${lc}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{initial}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: N }}>
                    {s.full_name ?? 'Студент'}
                    {!s.group_id && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '1px 6px', borderRadius: 99 }}>Без группы</span>}
                    {isInactive && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '1px 6px', borderRadius: 99 }}>😴</span>}
                  </div>
                </div>
                <div><span style={{ fontSize: 11, fontWeight: 800, background: `${lc}18`, color: lc, padding: '3px 9px', borderRadius: 99 }}>{s.current_level ?? 'A1'}</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G }}>{(s.total_xp ?? 0).toLocaleString()} XP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: (s.current_streak ?? 0) > 0 ? '#EF4444' : '#CBD5E1' }}>
                  {(s.current_streak ?? 0) > 0 ? `🔥 ${s.current_streak}` : '—'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ag.color }}>{ag.label}</div>

                {/* Group assignment */}
                <div>
                  {isAssigning ? (
                    <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <select value={assignGroup} onChange={e => setAssignGroup(e.target.value)}
                        style={{ flex: 1, padding: '5px 8px', borderRadius: 8, border: `1.5px solid ${N}`, fontSize: 11, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                        <option value="">— Убрать из группы</option>
                        {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                      </select>
                      <button onClick={() => assignToGroup(s.user_id, assignGroup, s.full_name ?? 'Студент')}
                        style={{ padding: '5px 8px', borderRadius: 7, border: 'none', background: T, color: '#fff', fontWeight: 700, fontSize: 11, cursor: 'pointer' }}>✓</button>
                      <button onClick={() => setAssigningId(null)}
                        style={{ padding: '5px 7px', borderRadius: 7, border: 'none', background: '#F1F5F9', color: MUT, fontSize: 11, cursor: 'pointer' }}>✕</button>
                    </div>
                  ) : (
                    <div style={{ fontSize: 11, color: MUT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {s.group_name ?? '—'}
                    </div>
                  )}
                </div>

                <button onClick={() => { setAssigningId(isAssigning ? null : s.user_id); setAssignGroup(s.group_id ?? '') }}
                  title="Назначить группу" style={{ width: 28, height: 28, borderRadius: 7, border: 'none', background: isAssigning ? '#EDE9FE' : '#EEF2F7', color: isAssigning ? ADMIN : MUT, cursor: 'pointer', fontSize: 13 }}>
                  {isAssigning ? '✕' : '✏️'}
                </button>
              </div>
            )
          })}

          <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, background: '#F8FBFF', fontSize: 12, color: MUT }}>
            Показано {filtered.length} из {students.length} · Кликните ✏️ чтобы назначить/изменить группу студента
            {stats.noGroup > 0 && <span style={{ marginLeft: 12, color: '#EF4444', fontWeight: 700 }}>⚠ {stats.noGroup} студентов без группы</span>}
          </div>
        </div>
      )}
    </div>
  )
}
