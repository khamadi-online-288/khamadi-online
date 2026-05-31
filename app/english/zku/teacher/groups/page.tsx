'use client'

import { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Group {
  id: string; name: string; join_code: string
  students_count: number; avg_progress: number; level_code: string
  teacher_id: string; created_at: string
}

const LEVELS = ['A1','A1.1','A2','B1','B2','C1']
const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  return Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join('')
}

type Toast = { msg: string; type: 'success' | 'error' }

export default function TeacherGroupsPage() {
  const [groups,   setGroups]   = useState<Group[]>([])
  const [loading,  setLoading]  = useState(true)
  const [userId,   setUserId]   = useState('')
  const [toast,    setToast]    = useState<Toast | null>(null)
  const [editId,   setEditId]   = useState<string | null>(null)
  const [editName, setEditName] = useState('')

  // Create form
  const [showForm,   setShowForm]   = useState(false)
  const [formName,   setFormName]   = useState('')
  const [formLevel,  setFormLevel]  = useState('A1')
  const [creating,   setCreating]   = useState(false)
  const [copied,     setCopied]     = useState<string | null>(null)

  const showToast = useCallback((msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setUserId(session.user.id)
    // Use junction table so multiple teachers can share a group
    const { data: junc } = await supabase
      .from('english_group_teachers')
      .select('group_id')
      .eq('teacher_id', session.user.id)
    const groupIds = (junc ?? []).map((r: { group_id: string }) => r.group_id)

    if (groupIds.length === 0) { setGroups([]); setLoading(false); return }

    const { data } = await supabase
      .from('english_groups')
      .select('id, name, join_code, students_count, avg_progress, level_code, teacher_id, created_at')
      .in('id', groupIds)
      .order('created_at', { ascending: false })
    setGroups((data ?? []) as Group[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function createGroup() {
    if (!formName.trim()) return
    setCreating(true)
    const supabase = createEnglishClient()
    const code = genCode()
    const { data: newGroup, error } = await supabase.from('english_groups').insert({
      teacher_id: userId, name: formName.trim(),
      join_code: code, level_code: formLevel, students_count: 0, avg_progress: 0,
    }).select('id').single()
    if (error) showToast('Ошибка при создании группы', 'error')
    else {
      // Register creator in junction table
      if (newGroup?.id) await supabase.from('english_group_teachers').insert({ group_id: newGroup.id, teacher_id: userId })
      showToast(`Группа «${formName.trim()}» создана! Код: ${code}`)
      setFormName(''); setShowForm(false); await load()
    }
    setCreating(false)
  }

  async function saveEdit(id: string) {
    if (!editName.trim()) return
    const supabase = createEnglishClient()
    const { error } = await supabase.from('english_groups').update({ name: editName.trim() }).eq('id', id)
    if (error) showToast('Ошибка при сохранении', 'error')
    else { showToast('Название обновлено'); setEditId(null); await load() }
  }

  async function regenCode(id: string) {
    const code = genCode()
    const supabase = createEnglishClient()
    await supabase.from('english_groups').update({ join_code: code }).eq('id', id)
    showToast(`Новый код: ${code}`)
    await load()
  }

  async function deleteGroup(id: string, name: string) {
    if (!confirm(`Удалить группу «${name}»? Студенты потеряют привязку к группе.`)) return
    const supabase = createEnglishClient()
    await supabase.from('english_groups').delete().eq('id', id)
    showToast('Группа удалена')
    await load()
  }

  function copyCode(code: string) {
    navigator.clipboard.writeText(code)
    setCopied(code)
    setTimeout(() => setCopied(null), 2000)
  }

  const totalStudents = groups.reduce((s, g) => s + (g.students_count ?? 0), 0)
  const avgProgress = groups.length > 0
    ? Math.round(groups.reduce((s, g) => s + (g.avg_progress ?? 0), 0) / groups.length)
    : 0

  return (
    <div style={{ padding: '24px 28px', maxWidth: 960, margin: '0 auto' }}>

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? '#1D9E75' : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.2)', animation: 'slideIn 0.3s ease' }}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
          <style>{`@keyframes slideIn { from{opacity:0;transform:translateY(-10px)} to{opacity:1;transform:translateY(0)} }`}</style>
        </div>
      )}

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Мои группы</h1>
          <p style={{ fontSize: 13, color: MUT }}>
            {groups.length} {groups.length === 1 ? 'группа' : 'групп'} · {totalStudents} студентов · ср. прогресс {avgProgress}%
          </p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '11px 20px', borderRadius: 12, border: 'none',
          background: showForm ? '#F1F5F9' : N, color: showForm ? MUT : '#fff',
          fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: showForm ? 'none' : `0 4px 14px ${N}44`, display: 'flex', alignItems: 'center', gap: 6,
        }}>
          {showForm ? '✕ Отмена' : '+ Создать группу'}
        </button>
      </div>

      {/* Create form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '20px 22px', marginBottom: 18, border: `2px solid ${N}33`, boxShadow: `0 4px 20px ${N}10` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>✨ Новая группа</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 140px', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Название группы</label>
              <input value={formName} onChange={e => setFormName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && createGroup()}
                placeholder="напр. 4-А Информатика 2026"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = N}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Уровень</label>
              <select value={formLevel} onChange={e => setFormLevel(e.target.value)}
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', fontFamily: 'inherit', background: '#fff' }}>
                {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={createGroup} disabled={!formName.trim() || creating} style={{
              padding: '11px 22px', borderRadius: 10, border: 'none',
              background: !formName.trim() ? '#94A3B8' : N, color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: !formName.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
              boxShadow: !formName.trim() ? 'none' : `0 4px 14px ${N}44`,
            }}>{creating ? 'Создаём...' : 'Создать группу'}</button>
            <div style={{ fontSize: 12, color: '#94A3B8', display: 'flex', alignItems: 'center' }}>
              Студенты вводят код при регистрации
            </div>
          </div>
        </div>
      )}

      {/* Groups */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>
          <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite', margin: '0 auto 12px' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
          Загрузка...
        </div>
      ) : groups.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 64, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>👥</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: N, marginBottom: 8 }}>Групп пока нет</div>
          <div style={{ fontSize: 13, color: MUT, marginBottom: 20 }}>Создайте первую группу и поделитесь кодом со студентами</div>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: N, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Создать группу
          </button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {groups.map(g => {
            const lc = LEVEL_COLOR[g.level_code] ?? N
            const isEditing = editId === g.id
            return (
              <div key={g.id} style={{ background: '#fff', borderRadius: 16, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
                {/* Progress bar */}
                <div style={{ height: 3, background: '#EEF2F7' }}>
                  <div style={{ height: '100%', width: `${g.avg_progress ?? 0}%`, background: T, borderRadius: 99, transition: 'width 0.6s' }} />
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px' }}>
                  {/* Icon + level */}
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `${lc}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, flexShrink: 0 }}>👥</div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 4 }}>
                        <input value={editName} onChange={e => setEditName(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(g.id); if (e.key === 'Escape') setEditId(null) }}
                          autoFocus
                          style={{ flex: 1, padding: '6px 10px', borderRadius: 8, border: `1.5px solid ${N}`, fontSize: 14, fontWeight: 700, outline: 'none', fontFamily: 'inherit' }} />
                        <button onClick={() => saveEdit(g.id)} style={{ padding: '6px 12px', borderRadius: 8, border: 'none', background: T, color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✓</button>
                        <button onClick={() => setEditId(null)} style={{ padding: '6px 10px', borderRadius: 8, border: 'none', background: '#F1F5F9', color: MUT, fontWeight: 700, fontSize: 12, cursor: 'pointer' }}>✕</button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                        <a href={`/english/zku/teacher/groups/${g.id}`} style={{ fontSize: 15, fontWeight: 800, color: N, textDecoration: 'none' }}
                          onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                          onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                          {g.name}
                        </a>
                        <span style={{ fontSize: 11, fontWeight: 700, background: `${lc}15`, color: lc, padding: '2px 8px', borderRadius: 99 }}>{g.level_code}</span>
                        <button onClick={() => { setEditId(g.id); setEditName(g.name) }} style={{ padding: '3px 8px', borderRadius: 6, border: 'none', background: '#F1F5F9', color: MUT, fontSize: 11, cursor: 'pointer' }}>✏️</button>
                        <a href={`/english/zku/teacher/groups/${g.id}`} style={{ padding: '3px 10px', borderRadius: 6, background: '#EEF2F7', color: N, fontSize: 11, fontWeight: 700, textDecoration: 'none' }}>Открыть →</a>
                      </div>
                    )}
                    <div style={{ fontSize: 12, color: MUT }}>
                      🎓 {g.students_count ?? 0} студентов
                      {(g.avg_progress ?? 0) > 0 && ` · прогресс ${g.avg_progress}%`}
                      · создана {new Date(g.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })}
                    </div>
                  </div>

                  {/* Code */}
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 9, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 5 }}>Код группы</div>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                      <button onClick={() => copyCode(g.join_code)} style={{
                        padding: '8px 14px', borderRadius: 10,
                        border: `1.5px solid ${copied === g.join_code ? T : `${N}33`}`,
                        background: copied === g.join_code ? '#DCFCE7' : '#EEF2F7',
                        color: copied === g.join_code ? T : N,
                        fontWeight: 800, fontSize: 15, cursor: 'pointer',
                        fontFamily: 'monospace', letterSpacing: '0.12em', transition: 'all 0.2s',
                      }}>
                        {copied === g.join_code ? '✓ Скопирован' : g.join_code}
                      </button>
                      <button onClick={() => regenCode(g.id)} title="Обновить код" style={{ width: 32, height: 32, borderRadius: 8, border: 'none', background: '#F1F5F9', color: MUT, cursor: 'pointer', fontSize: 14 }}>🔄</button>
                    </div>
                  </div>

                  {/* Progress % */}
                  <div style={{ textAlign: 'center', width: 60, flexShrink: 0 }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: T }}>{g.avg_progress ?? 0}%</div>
                    <div style={{ fontSize: 10, color: MUT }}>прогресс</div>
                  </div>

                  {/* Delete */}
                  <button onClick={() => deleteGroup(g.id, g.name)} title="Удалить группу" style={{ width: 34, height: 34, borderRadius: 10, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 16, flexShrink: 0 }}>🗑</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
