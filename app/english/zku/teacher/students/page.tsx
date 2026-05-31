'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Student {
  user_id: string; full_name: string | null
  current_level: string | null; total_xp: number | null
  current_streak: number | null; last_active_at: string | null
  group_id: string | null; group_name?: string
}
interface Group { id: string; name: string }

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
type SortKey = 'name' | 'xp' | 'level' | 'streak' | 'active'
type SortDir = 'asc' | 'desc'

export default function TeacherStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [groups,   setGroups]   = useState<Group[]>([])
  const [loading,  setLoading]  = useState(true)
  const [search,   setSearch]   = useState('')
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterGroup, setFilterGroup] = useState('all')
  const [sortKey,  setSortKey]  = useState<SortKey>('active')
  const [sortDir,  setSortDir]  = useState<SortDir>('desc')

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Junction table — teacher sees all groups they are assigned to
    const { data: junc } = await supabase
      .from('english_group_teachers')
      .select('group_id')
      .eq('teacher_id', session.user.id)
    const groupIds = (junc ?? []).map((r: { group_id: string }) => r.group_id)

    if (groupIds.length === 0) { setLoading(false); return }

    const { data: grps } = await supabase
      .from('english_groups').select('id, name').in('id', groupIds)
    const groupList = (grps ?? []) as Group[]
    setGroups(groupList)

    if (groupList.length === 0) { setLoading(false); return }

    const groupIds = groupList.map(g => g.id)
    const groupMap: Record<string,string> = {}
    groupList.forEach(g => { groupMap[g.id] = g.name })

    const { data } = await supabase
      .from('english_user_profiles')
      .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
      .in('group_id', groupIds)

    setStudents(((data ?? []) as Student[]).map(s => ({ ...s, group_name: s.group_id ? groupMap[s.group_id] : '—' })))
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('desc') }
  }

  const filtered = useMemo(() => {
    let list = students.filter(s => {
      const matchSearch = !search || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase())
      const matchLevel = filterLevel === 'all' || s.current_level === filterLevel
      const matchGroup = filterGroup === 'all' || s.group_id === filterGroup
      return matchSearch && matchLevel && matchGroup
    })
    list = [...list].sort((a, b) => {
      let va: number | string, vb: number | string
      if (sortKey === 'name') { va = a.full_name ?? ''; vb = b.full_name ?? '' }
      else if (sortKey === 'xp') { va = a.total_xp ?? 0; vb = b.total_xp ?? 0 }
      else if (sortKey === 'streak') { va = a.current_streak ?? 0; vb = b.current_streak ?? 0 }
      else if (sortKey === 'level') { va = a.current_level ?? ''; vb = b.current_level ?? '' }
      else { va = a.last_active_at ?? ''; vb = b.last_active_at ?? '' }
      if (typeof va === 'string') return sortDir === 'asc' ? va.localeCompare(vb as string) : (vb as string).localeCompare(va)
      return sortDir === 'asc' ? (va as number) - (vb as number) : (vb as number) - (va as number)
    })
    return list
  }, [students, search, filterLevel, filterGroup, sortKey, sortDir])

  const now = new Date()
  function daysSince(date: string | null) {
    if (!date) return { label: 'Никогда', color: '#CBD5E1' }
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 86400000)
    if (diff === 0) return { label: 'Сегодня', color: T }
    if (diff === 1) return { label: 'Вчера', color: '#22c55e' }
    if (diff <= 7) return { label: `${diff} дн. назад`, color: G }
    return { label: `${diff} дн. назад`, color: '#94A3B8' }
  }

  const levels = ['all', ...Array.from(new Set(students.map(s => s.current_level ?? 'A1')))]
  const SortBtn = ({ k, label }: { k: SortKey; label: string }) => (
    <button onClick={() => toggleSort(k)} style={{ display: 'flex', alignItems: 'center', gap: 3, background: 'none', border: 'none', cursor: 'pointer', fontSize: 10, fontWeight: 700, color: sortKey === k ? N : MUT, textTransform: 'uppercase', letterSpacing: '0.08em', fontFamily: 'inherit', padding: 0 }}>
      {label}
      <span style={{ fontSize: 9 }}>{sortKey === k ? (sortDir === 'desc' ? ' ↓' : ' ↑') : ' ↕'}</span>
    </button>
  )

  // Stats
  const activeToday = students.filter(s => s.last_active_at?.startsWith(now.toISOString().split('T')[0])).length
  const avgXp = students.length > 0 ? Math.round(students.reduce((a, s) => a + (s.total_xp ?? 0), 0) / students.length) : 0

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1060, margin: '0 auto' }}>

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Мои студенты</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT }}>
          <span>🎓 Всего: <strong style={{ color: N }}>{students.length}</strong></span>
          <span>⚡ Сегодня активны: <strong style={{ color: T }}>{activeToday}</strong></span>
          <span>✨ Ср. XP: <strong style={{ color: G }}>{avgXp.toLocaleString()}</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по имени..."
          style={{ flex: 1, minWidth: 200, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = N}
          onBlur={e => e.currentTarget.style.borderColor = BDR} />
        <select value={filterGroup} onChange={e => setFilterGroup(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          <option value="all">Все группы</option>
          {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
        </select>
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          {levels.map(l => <option key={l} value={l}>{l === 'all' ? 'Все уровни' : l}</option>)}
        </select>
        {(search || filterLevel !== 'all' || filterGroup !== 'all') && (
          <button onClick={() => { setSearch(''); setFilterLevel('all'); setFilterGroup('all') }}
            style={{ padding: '10px 14px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#FEE2E2', color: '#DC2626', fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
            ✕ Сбросить
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N }}>{search ? 'Никого не найдено' : 'Студентов нет'}</div>
          <div style={{ fontSize: 13, color: MUT, marginTop: 6 }}>
            {search ? 'Попробуйте другой запрос' : 'Создайте группу и поделитесь кодом со студентами'}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          {/* Table header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 130px 90px 110px 120px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            <SortBtn k="name" label="Студент" />
            <SortBtn k="level" label="Уровень" />
            <SortBtn k="xp" label="XP" />
            <SortBtn k="streak" label="Стрик" />
            <SortBtn k="active" label="Активность" />
            <div style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Группа</div>
          </div>

          {filtered.map((s, i) => {
            const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
            const lc = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
            const active = daysSince(s.last_active_at)
            const isRisk = (s.total_xp ?? 0) < 100 && s.last_active_at
              ? (now.getTime() - new Date(s.last_active_at).getTime()) / 86400000 > 7
              : false
            return (
              <div key={s.user_id} style={{
                display: 'grid', gridTemplateColumns: '2fr 90px 130px 90px 110px 120px',
                padding: '13px 20px', gap: 8, alignItems: 'center',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: isRisk ? '#FFFBEB' : i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${lc}, ${lc}99)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{initial}</div>
                    {active.color === T && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 9, height: 9, borderRadius: '50%', background: T, border: '2px solid #fff' }} />}
                  </div>
                  <div>
                    <a href={`/english/zku/teacher/students/${s.user_id}`} style={{ fontSize: 13, fontWeight: 700, color: N, textDecoration: 'none' }}
                      onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                      onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                      {s.full_name ?? 'Студент'}
                      {isRisk && <span style={{ marginLeft: 6, fontSize: 10, fontWeight: 700, color: '#D97706', background: '#FEF3C7', padding: '1px 6px', borderRadius: 99 }}>⚠ Риск</span>}
                    </a>
                  </div>
                </div>
                <div><span style={{ fontSize: 11, fontWeight: 800, background: `${lc}18`, color: lc, padding: '3px 9px', borderRadius: 99 }}>{s.current_level ?? 'A1'}</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G }}>{(s.total_xp ?? 0).toLocaleString()} XP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: (s.current_streak ?? 0) > 0 ? '#EF4444' : '#CBD5E1' }}>
                  {(s.current_streak ?? 0) > 0 ? `🔥 ${s.current_streak}` : '—'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: active.color }}>{active.label}</div>
                <div style={{ fontSize: 11, color: MUT, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{s.group_name ?? '—'}</div>
              </div>
            )
          })}

          {/* Footer */}
          <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, background: '#F8FBFF', fontSize: 12, color: MUT }}>
            Показано {filtered.length} из {students.length} студентов
            {filtered.some(s => {
              const isRisk = (s.total_xp ?? 0) < 100 && s.last_active_at
                ? (now.getTime() - new Date(s.last_active_at).getTime()) / 86400000 > 7 : false
              return isRisk
            }) && <span style={{ marginLeft: 12, color: '#D97706', fontWeight: 700 }}>⚠ Есть студенты в зоне риска (низкий XP + долго не заходили)</span>}
          </div>
        </div>
      )}
    </div>
  )
}
