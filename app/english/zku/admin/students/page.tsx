'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Student {
  user_id: string
  full_name: string | null
  current_level: string | null
  total_xp: number | null
  current_streak: number | null
  last_active_at: string | null
  group_name?: string
}

const LEVEL_COLOR: Record<string, string> = {
  A1: '#003876', 'A1.1': '#16A34A', A2: '#1B8FC4',
  B1: '#7C3AED', B2: '#DB2777', C1: '#D97706',
}

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const [filterLevel, setFilterLevel] = useState('all')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()

      const { data } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
        .eq('role', 'student')
        .order('total_xp', { ascending: false })

      // Get group names
      const { data: grps } = await supabase.from('english_groups').select('id, name')
      const groupMap: Record<string, string> = {}
      ;(grps ?? []).forEach((g: { id: string; name: string }) => { groupMap[g.id] = g.name })

      const mapped = (data ?? []).map((s: Student & { group_id?: string }) => ({
        ...s,
        group_name: s.group_id ? groupMap[s.group_id] : undefined,
      }))

      setStudents(mapped as Student[])
      setLoading(false)
    }
    load()
  }, [])

  const levels = ['all', ...Array.from(new Set(students.map(s => s.current_level ?? 'A1')))]
  const filtered = students.filter(s => {
    const matchSearch = !search || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase())
    const matchLevel = filterLevel === 'all' || s.current_level === filterLevel
    return matchSearch && matchLevel
  })

  const now = new Date()
  function daysSince(date: string | null) {
    if (!date) return '—'
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 86400000)
    if (diff === 0) return 'сегодня'
    if (diff === 1) return 'вчера'
    return `${diff} дн. назад`
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1100, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Все студенты</h1>
        <p style={{ fontSize: 13, color: MUT }}>{students.length} студентов на платформе</p>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = N}
          onBlur={e => e.currentTarget.style.borderColor = BDR} />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          {levels.map(l => <option key={l} value={l}>{l === 'all' ? 'Все уровни' : l}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT }}>Загрузка...</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 120px 80px 100px 110px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            {['Студент', 'Уровень', 'XP', 'Стрик', 'Активность', 'Группа'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>
          {filtered.map((s, i) => {
            const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
            const levelColor = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
            return (
              <div key={s.user_id} style={{
                display: 'grid', gridTemplateColumns: '2fr 80px 120px 80px 100px 110px',
                padding: '13px 20px', gap: 8, alignItems: 'center',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 32, height: 32, borderRadius: '50%', background: `linear-gradient(135deg, ${N}, #0055a4)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 12, flexShrink: 0 }}>{initial}</div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{s.full_name ?? 'Студент'}</div>
                </div>
                <div><span style={{ fontSize: 11, fontWeight: 800, background: `${levelColor}20`, color: levelColor, padding: '3px 8px', borderRadius: 99 }}>{s.current_level ?? 'A1'}</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G }}>{(s.total_xp ?? 0).toLocaleString()} XP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#EF4444' }}>🔥 {s.current_streak ?? 0}</div>
                <div style={{ fontSize: 12, color: daysSince(s.last_active_at) === 'сегодня' ? T : MUT, fontWeight: 600 }}>{daysSince(s.last_active_at)}</div>
                <div style={{ fontSize: 12, color: MUT }}>{s.group_name ?? '—'}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
