'use client'

import { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../student/zku-lang'

const N = '#003876'
const ADMIN = '#7C3AED'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Group {
  id: string; name: string; join_code: string
  students_count: number; avg_progress: number; level_code: string
  teacher_id: string | null; teacher_name?: string; created_at: string
}

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
type Toast = { msg: string; type: 'success'|'error' }

export default function AdminGroupsPage() {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [copied,  setCopied]  = useState<string | null>(null)
  const [toast,   setToast]   = useState<Toast | null>(null)
  const [filterLevel, setFilterLevel] = useState('all')
  const [tok, setTok] = useState('')
  const { t } = useZkuLang()

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setTok(session.access_token)

    // Use service role API to bypass RLS
    const res = await fetch('/api/english/admin/groups', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    const { groups: data } = await res.json()
    setGroups((data ?? []) as Group[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function deleteGroup(id: string, name: string) {
    if (!confirm(`Удалить группу «${name}»? Студенты потеряют привязку.`)) return
    const supabase = createEnglishClient()
    const res = await fetch('/api/english/admin/groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) showToast('Ошибка при удалении', 'error')
    else { showToast(`Группа «${name}» удалена`); await load() }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code); setTimeout(() => setCopied(null), 2000)
    showToast(`Код ${code} скопирован`)
  }

  const filtered = groups.filter(g => {
    const ms = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.teacher_name ?? '').toLowerCase().includes(search.toLowerCase())
    const ml = filterLevel === 'all' || g.level_code === filterLevel
    return ms && ml
  })

  const totalStudents = groups.reduce((s, g) => s + (g.students_count ?? 0), 0)
  const avgProgress = groups.length > 0 ? Math.round(groups.reduce((s, g) => s + (g.avg_progress ?? 0), 0) / groups.length) : 0
  const levels = ['all', ...Array.from(new Set(groups.map(g => g.level_code)))]

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1020, margin: '0 auto' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      <div style={{ marginBottom: 22 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Все группы</h1>
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT }}>
          <span>👥 Всего: <strong style={{ color: N }}>{groups.length}</strong></span>
          <span>🎓 Студентов: <strong style={{ color: '#16A34A' }}>{totalStudents}</strong></span>
          <span>📈 Ср. прогресс: <strong style={{ color: T }}>{avgProgress}%</strong></span>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 18 }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по названию или преподавателю..."
          style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = N}
          onBlur={e => e.currentTarget.style.borderColor = BDR} />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          {levels.map(l => <option key={l} value={l}>{l === 'all' ? t.panel.all_levels : l}</option>)}
        </select>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1a0050', marginBottom: 8 }}>Групп нет</div>
          <div style={{ fontSize: 13, color: MUT }}>Преподаватели создают группы в своём кабинете</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {filtered.map(g => {
            const lc = LEVEL_COLOR[g.level_code] ?? N
            const created = new Date(g.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', year: 'numeric' })
            return (
              <div key={g.id} style={{ background: '#fff', borderRadius: 14, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,56,118,0.04)' }}>
                {/* Progress bar */}
                <div style={{ height: 3, background: '#EEF2F7' }}>
                  <div style={{ height: '100%', width: `${g.avg_progress ?? 0}%`, background: T, borderRadius: 99 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                  {/* Icon */}
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: `${lc}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👥</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{g.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: `${lc}15`, color: lc, padding: '2px 8px', borderRadius: 99 }}>{g.level_code}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: MUT }}>
                      <span>👨‍🏫 {g.teacher_name}</span>
                      <span>🎓 {g.students_count ?? 0} студентов</span>
                      <span>📅 {created}</span>
                    </div>
                  </div>

                  {/* Progress */}
                  <div style={{ textAlign: 'center', width: 64, flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: T }}>{g.avg_progress ?? 0}%</div>
                    <div style={{ fontSize: 10, color: MUT }}>прогресс</div>
                  </div>

                  {/* Code */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Код</div>
                    <button onClick={() => copyCode(g.join_code)} style={{
                      padding: '7px 12px', borderRadius: 10,
                      border: `1.5px solid ${copied === g.join_code ? T : `${N}33`}`,
                      background: copied === g.join_code ? '#DCFCE7' : '#EEF2F7',
                      color: copied === g.join_code ? T : N,
                      fontWeight: 800, fontSize: 14, cursor: 'pointer',
                      fontFamily: 'monospace', letterSpacing: '0.1em', transition: 'all 0.2s',
                    }}>
                      {copied === g.join_code ? '✓' : g.join_code}
                    </button>
                  </div>

                  {/* Delete */}
                  <button onClick={() => deleteGroup(g.id, g.name)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
