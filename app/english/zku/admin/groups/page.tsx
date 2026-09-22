'use client'

import { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '@/app/english/zku/student/zku-lang'

const N = '#003876'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Group {
  id: string; name: string; join_code: string
  students_count: number; avg_progress: number; level_code: string
  teacher_id: string | null; teacher_name?: string; created_at: string
}
interface Teacher { user_id: string; full_name: string }

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
type Toast = { msg: string; type: 'success'|'error' }

export default function AdminGroupsPage() {
  const [groups,  setGroups]  = useState<Group[]>([])
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading] = useState(true)
  const [search,  setSearch]  = useState('')
  const [copied,  setCopied]  = useState<string | null>(null)
  const [toast,   setToast]   = useState<Toast | null>(null)
  const [filterLevel, setFilterLevel] = useState('all')
  const [filterTeacher, setFilterTeacher] = useState<'all' | 'none'>('all')
  const [assigningId, setAssigningId] = useState<string | null>(null)
  const [assignTeacher, setAssignTeacher] = useState('')
  const [assignLoading, setAssignLoading] = useState(false)
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

    const res = await fetch('/api/english/admin/groups', {
      headers: { Authorization: `Bearer ${session.access_token}` }
    })
    const { groups: data, teachers: teacherList } = await res.json() as {
      groups?: Group[]
      teachers?: Teacher[]
    }
    setGroups((data ?? []) as Group[])
    setTeachers((teacherList ?? []) as Teacher[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function deleteGroup(id: string, name: string) {
    if (!confirm(`Удалить группу «${name}»? Студенты потеряют привязку.`)) return
    const res = await fetch('/api/english/admin/groups', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify({ id }),
    })
    if (!res.ok) showToast('Ошибка при удалении', 'error')
    else { showToast(`Группа «${name}» удалена`); await load() }
  }

  async function assignTeacherToGroup(group: Group) {
    if (!tok) { showToast('Нет сессии', 'error'); return }
    if (assignLoading) return
    setAssignLoading(true)
    try {
      const res = await fetch('/api/english/admin/groups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
        body: JSON.stringify({ id: group.id, teacherId: assignTeacher || null }),
      })
      const d = await res.json() as { ok?: boolean; error?: string; teacher_id?: string | null; teacher_name?: string }
      if (!res.ok || !d.ok) {
        showToast(d.error ?? 'Ошибка при назначении', 'error')
        return
      }
      const nextId = d.teacher_id ?? null
      const nextName = d.teacher_name ?? '—'
      setGroups(prev => prev.map(g =>
        g.id === group.id ? { ...g, teacher_id: nextId, teacher_name: nextName } : g
      ))
      showToast(nextId ? `${group.name} → ${nextName}` : `${group.name}: преподаватель снят`)
      setAssigningId(null)
    } finally {
      setAssignLoading(false)
    }
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code); setTimeout(() => setCopied(null), 2000)
    showToast(`Код ${code} скопирован`)
  }

  const noTeacherCount = groups.filter(g => !g.teacher_id).length

  const filtered = groups.filter(g => {
    const ms = !search || g.name.toLowerCase().includes(search.toLowerCase()) || (g.teacher_name ?? '').toLowerCase().includes(search.toLowerCase())
    const ml = filterLevel === 'all' || g.level_code === filterLevel
    const mt = filterTeacher === 'all' || !g.teacher_id
    return ms && ml && mt
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
        <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT, flexWrap: 'wrap' }}>
          <span>👥 Всего: <strong style={{ color: N }}>{groups.length}</strong></span>
          <span>🎓 Студентов: <strong style={{ color: '#16A34A' }}>{totalStudents}</strong></span>
          <span>📈 Ср. прогресс: <strong style={{ color: T }}>{avgProgress}%</strong></span>
          {noTeacherCount > 0 && (
            <span style={{ color: '#EF4444', fontWeight: 700 }}>⚠ Без преподавателя: {noTeacherCount}</span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по названию или преподавателю..."
          style={{ flex: 1, minWidth: 220, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
          onFocus={e => e.currentTarget.style.borderColor = N}
          onBlur={e => e.currentTarget.style.borderColor = BDR} />
        <select value={filterLevel} onChange={e => setFilterLevel(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
          {levels.map(l => <option key={l} value={l}>{l === 'all' ? t.panel.all_levels : l}</option>)}
        </select>
        <select value={filterTeacher} onChange={e => setFilterTeacher(e.target.value as 'all' | 'none')}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${filterTeacher === 'none' ? '#F59E0B' : BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit', background: filterTeacher === 'none' ? '#FFFBEB' : '#fff' }}>
          <option value="all">Все преподаватели</option>
          <option value="none">Без преподавателя</option>
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
            const isAssigning = assigningId === g.id
            const noTeacher = !g.teacher_id
            return (
              <div key={g.id} style={{
                background: noTeacher ? '#FFFBEB' : '#fff',
                borderRadius: 14,
                border: `1px solid ${noTeacher ? '#FDE68A' : BDR}`,
                overflow: 'hidden',
                boxShadow: '0 1px 4px rgba(0,56,118,0.04)',
              }}>
                <div style={{ height: 3, background: '#EEF2F7' }}>
                  <div style={{ height: '100%', width: `${g.avg_progress ?? 0}%`, background: T, borderRadius: 99 }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px' }}>
                  <div style={{ width: 46, height: 46, borderRadius: 14, background: `${lc}12`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👥</div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 14, fontWeight: 800, color: N }}>{g.name}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, background: `${lc}15`, color: lc, padding: '2px 8px', borderRadius: 99 }}>{g.level_code}</span>
                      {noTeacher && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#EF4444', background: '#FEE2E2', padding: '2px 7px', borderRadius: 99 }}>Без преподавателя</span>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 12, fontSize: 12, color: MUT, flexWrap: 'wrap' }}>
                      <span>👨‍🏫 {g.teacher_name && g.teacher_name !== '—' ? g.teacher_name : 'не назначен'}</span>
                      <span>🎓 {g.students_count ?? 0} студентов</span>
                      <span>📅 {created}</span>
                    </div>
                  </div>

                  {isAssigning ? (
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', minWidth: 0, flex: '0 1 360px' }}>
                      <select value={assignTeacher} onChange={e => setAssignTeacher(e.target.value)} disabled={assignLoading}
                        style={{ flex: 1, minWidth: 0, padding: '8px 10px', borderRadius: 10, border: `1.5px solid ${N}`, fontSize: 12, outline: 'none', fontFamily: 'inherit', background: assignLoading ? '#F8FAFC' : '#fff', opacity: assignLoading ? 0.7 : 1, cursor: assignLoading ? 'wait' : 'pointer' }}>
                        <option value="">— Снять преподавателя</option>
                        {teachers.map(teacher => (
                          <option key={teacher.user_id} value={teacher.user_id}>{teacher.full_name}</option>
                        ))}
                      </select>
                      <button
                        onClick={() => assignTeacherToGroup(g)}
                        disabled={assignLoading}
                        title="Сохранить"
                        style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: 'none', background: assignLoading ? '#94A3B8' : T, color: '#fff', fontWeight: 700, fontSize: 14, cursor: assignLoading ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        {assignLoading ? (
                          <span style={{
                            width: 12, height: 12, borderRadius: '50%',
                            border: '2px solid rgba(255,255,255,0.35)', borderTopColor: '#fff',
                            animation: 'spin 0.7s linear infinite', display: 'block',
                          }} />
                        ) : '✓'}
                      </button>
                      <button onClick={() => { if (!assignLoading) setAssigningId(null) }}
                        disabled={assignLoading}
                        title="Отмена"
                        style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 10, border: 'none', background: '#F1F5F9', color: MUT, fontSize: 14, cursor: assignLoading ? 'not-allowed' : 'pointer', opacity: assignLoading ? 0.5 : 1 }}>✕</button>
                    </div>
                  ) : (
                    <>
                      <div style={{ textAlign: 'center', width: 64, flexShrink: 0 }}>
                        <div style={{ fontSize: 20, fontWeight: 900, color: T }}>{g.avg_progress ?? 0}%</div>
                        <div style={{ fontSize: 10, color: MUT }}>прогресс</div>
                      </div>

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

                      <button
                        onClick={() => { setAssigningId(g.id); setAssignTeacher(g.teacher_id ?? '') }}
                        title="Назначить преподавателя"
                        style={{
                          width: 34, height: 34, borderRadius: 10, border: 'none',
                          background: noTeacher ? '#FEF3C7' : '#EEF2F7',
                          color: noTeacher ? '#B45309' : MUT,
                          cursor: 'pointer', fontSize: 15, flexShrink: 0,
                        }}
                      >👨‍🏫</button>
                      <button onClick={() => deleteGroup(g.id, g.name)} style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>🗑</button>
                    </>
                  )}
                </div>
              </div>
            )
          })}
          <div style={{ fontSize: 12, color: MUT, padding: '4px 2px' }}>
            Показано {filtered.length} из {groups.length} · Кликните 👨‍🏫 чтобы назначить преподавателя
          </div>
        </div>
      )}
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )
}
