'use client'

import { useState, useEffect, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Student {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; last_active_at: string | null
  group_id: string | null; group_name?: string
}

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
type SortKey = 'name' | 'xp' | 'streak' | 'active'

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterActivity, setFilterActivity] = useState('all')
  const [sortKey, setSortKey]   = useState<SortKey>('active')
  const [sortDir, setSortDir]   = useState<'asc'|'desc'>('desc')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
        .eq('role', 'student')
        .order('total_xp', { ascending: false })

      const { data: grps } = await supabase.from('english_groups').select('id, name')
      const gm: Record<string,string> = {}
      ;(grps ?? []).forEach((g: { id: string; name: string }) => { gm[g.id] = g.name })

      setStudents(((data ?? []) as Student[]).map(s => ({ ...s, group_name: s.group_id ? gm[s.group_id] : undefined })))
      setLoading(false)
    }
    load()
  }, [])

  function toggleSort(k: SortKey) {
    if (sortKey === k) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(k); setSortDir('desc') }
  }

  const now = new Date()
  function daysSince(date: string | null) {
    if (!date) return 999
    return Math.floor((now.getTime() - new Date(date).getTime()) / 86400000)
  }

  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const ms = !search || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      const ml = filterLevel === 'all' || s.current_level === filterLevel
      const days = daysSince(s.last_active_at)
      const ma = filterActivity === 'all' ? true
        : filterActivity === 'today' ? days === 0
        : filterActivity === 'week' ? days <= 7
        : filterActivity === 'inactive' ? days > 30 : true
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

  function activeLabel(date: string | null) {
    const d = daysSince(date)
    if (d === 0) return { label: 'Сегодня', color: T }
    if (d === 1) return { label: 'Вчера', color: '#22c55e' }
    if (d <= 7) return { label: `${d} дн. назад`, color: G }
    if (d <= 30) return { label: `${d} дн. назад`, color: '#f59e0b' }
    return { label: `${d} дн. назад`, color: '#CBD5E1' }
  }

  const levels = ['all', ...Array.from(new Set(students.map(s => s.current_level ?? 'A1')))]
  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: sortKey === k ? N : MUT, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0, display: 'flex', alignItems: 'center', gap: 2 }}>
      {label}{sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'}
    </button>
  )

  const stats = {
    today: students.filter(s => daysSince(s.last_active_at) === 0).length,
    inactive: students.filter(s => daysSince(s.last_active_at) > 30).length,
    avgXp: students.length > 0 ? Math.round(students.reduce((a, s) => a + (s.total_xp ?? 0), 0) / students.length) : 0,
  }

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1100, margin: '0 auto' }}>
      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Все студенты</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT, flexWrap: 'wrap' }}>
          <span>🎓 Всего: <strong style={{ color: N }}>{students.length}</strong></span>
          <span>⚡ Сегодня: <strong style={{ color: T }}>{stats.today}</strong></span>
          <span>😴 Неактивны 30+ дн.: <strong style={{ color: '#f59e0b' }}>{stats.inactive}</strong></span>
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
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 130px 80px 110px 120px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            <SortBtn k="name"   label="Студент" />
            <div style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Уровень</div>
            <SortBtn k="xp"    label="XP" />
            <SortBtn k="streak" label="Стрик" />
            <SortBtn k="active" label="Активность" />
            <div style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Группа</div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: MUT }}>
              <div style={{ fontSize: 36, marginBottom: 8 }}>🎓</div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>Никого не найдено</div>
            </div>
          ) : (
            filtered.map((s, i) => {
              const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
              const lc = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
              const ag = activeLabel(s.last_active_at)
              const days = daysSince(s.last_active_at)
              const isInactive = days > 30
              return (
                <div key={s.user_id} style={{
                  display: 'grid', gridTemplateColumns: '2fr 80px 130px 80px 110px 120px',
                  padding: '13px 20px', gap: 8, alignItems: 'center',
                  borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                  background: isInactive ? '#FFFBEB' : i % 2 === 0 ? '#fff' : '#FAFCFF',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ position: 'relative' }}>
                      <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${lc}, ${lc}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13 }}>{initial}</div>
                      {days === 0 && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: T, border: '2px solid #fff' }} />}
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: N }}>
                      {s.full_name ?? 'Студент'}
                      {isInactive && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '1px 6px', borderRadius: 99 }}>😴 Неактивен</span>}
                    </div>
                  </div>
                  <div><span style={{ fontSize: 11, fontWeight: 800, background: `${lc}18`, color: lc, padding: '3px 9px', borderRadius: 99 }}>{s.current_level ?? 'A1'}</span></div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: G }}>{(s.total_xp ?? 0).toLocaleString()} XP</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: (s.current_streak ?? 0) > 0 ? '#EF4444' : '#CBD5E1' }}>
                    {(s.current_streak ?? 0) > 0 ? `🔥 ${s.current_streak}` : '—'}
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: ag.color }}>{ag.label}</div>
                  <div style={{ fontSize: 11, color: MUT, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.group_name ?? '—'}</div>
                </div>
              )
            })
          )}

          <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, background: '#F8FBFF', fontSize: 12, color: MUT }}>
            Показано {filtered.length} из {students.length} студентов
            {stats.inactive > 0 && <span style={{ marginLeft: 12, color: '#D97706', fontWeight: 700 }}>😴 {stats.inactive} студентов неактивны более 30 дней</span>}
          </div>
        </div>
      )}
    </div>
  )
}
