'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Group {
  id: string
  name: string
  join_code: string
  students_count: number
  avg_progress: number
  level_code: string
  teacher_name?: string
  created_at: string
}

export default function AdminGroupsPage() {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch]   = useState('')
  const [copied, setCopied]   = useState<string | null>(null)

  useEffect(() => { load() }, [])

  async function load() {
    const supabase = createEnglishClient()
    const { data } = await supabase
      .from('english_groups')
      .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
      .order('created_at', { ascending: false })

    // Get teacher names
    const teacherIds = [...new Set((data ?? []).map((g: Group & { teacher_id?: string }) => g.teacher_id).filter(Boolean))]
    let teacherMap: Record<string, string> = {}
    if (teacherIds.length > 0) {
      const { data: profiles } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name')
        .in('user_id', teacherIds as string[])
      ;(profiles ?? []).forEach((p: { user_id: string; full_name: string | null }) => {
        teacherMap[p.user_id] = p.full_name ?? '—'
      })
    }

    const mapped = (data ?? []).map((g: Group & { teacher_id?: string }) => ({
      ...g,
      teacher_name: g.teacher_id ? teacherMap[g.teacher_id] : '—',
    }))
    setGroups(mapped as Group[])
    setLoading(false)
  }

  async function deleteGroup(id: string) {
    if (!confirm('Удалить группу? Все студенты потеряют привязку.')) return
    const supabase = createEnglishClient()
    await supabase.from('english_groups').delete().eq('id', id)
    await load()
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const filtered = groups.filter(g =>
    !search || g.name.toLowerCase().includes(search.toLowerCase()) ||
    (g.teacher_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  const LEVEL_COLOR: Record<string, string> = {
    A1: '#003876', 'A1.1': '#16A34A', A2: '#1B8FC4',
    B1: '#7C3AED', B2: '#DB2777', C1: '#D97706',
  }

  return (
    <div style={{ padding: '28px 32px', maxWidth: 1000, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Все группы</h1>
        <p style={{ fontSize: 13, color: MUT }}>{groups.length} групп на платформе</p>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по названию или преподавателю..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', marginBottom: 20, boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.currentTarget.style.borderColor = N}
        onBlur={e => e.currentTarget.style.borderColor = BDR} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👥</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N }}>Групп нет</div>
          <p style={{ fontSize: 13, color: MUT, marginTop: 8 }}>Преподаватели создают группы в своём кабинете</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(g => {
            const levelColor = LEVEL_COLOR[g.level_code] ?? N
            return (
              <div key={g.id} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 16 }}>
                <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, flexShrink: 0 }}>👥</div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3 }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{g.name}</span>
                    <span style={{ fontSize: 11, fontWeight: 700, background: `${levelColor}20`, color: levelColor, padding: '2px 8px', borderRadius: 99 }}>{g.level_code}</span>
                  </div>
                  <div style={{ fontSize: 12, color: MUT }}>
                    👨‍🏫 {g.teacher_name} · 🎓 {g.students_count ?? 0} студентов
                  </div>
                </div>

                {/* Progress */}
                <div style={{ width: 70, flexShrink: 0, textAlign: 'center' }}>
                  <div style={{ fontSize: 16, fontWeight: 900, color: T }}>{g.avg_progress ?? 0}%</div>
                  <div style={{ height: 4, background: '#EEF2F7', borderRadius: 99, marginTop: 4, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${g.avg_progress ?? 0}%`, background: T, borderRadius: 99 }} />
                  </div>
                </div>

                {/* Copy code */}
                <button onClick={() => copyCode(g.join_code)} style={{
                  padding: '7px 14px', borderRadius: 10, border: `1.5px solid ${N}33`,
                  background: copied === g.join_code ? '#DCFCE7' : '#EEF2F7',
                  color: copied === g.join_code ? T : N,
                  fontWeight: 800, fontSize: 13, cursor: 'pointer', fontFamily: 'monospace',
                  letterSpacing: '0.1em', flexShrink: 0, transition: 'all 0.2s',
                }}>
                  {copied === g.join_code ? '✓' : g.join_code}
                </button>

                <button onClick={() => deleteGroup(g.id)} style={{ flexShrink: 0, width: 32, height: 32, borderRadius: 8, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16 }}>✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
