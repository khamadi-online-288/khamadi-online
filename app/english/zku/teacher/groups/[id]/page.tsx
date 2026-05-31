'use client'

import { useState, useEffect, useCallback, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Group {
  id: string; name: string; join_code: string
  students_count: number; avg_progress: number; level_code: string
}
interface Student {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; last_active_at: string | null
  group_id: string | null
}

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
type Toast = { msg: string; type: 'success'|'error' }

export default function GroupDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router  = useRouter()
  const [group,    setGroup]    = useState<Group | null>(null)
  const [students, setStudents] = useState<Student[]>([])
  const [loading,  setLoading]  = useState(true)
  const [toast,    setToast]    = useState<Toast | null>(null)
  const [search,   setSearch]   = useState('')
  const [addEmail, setAddEmail] = useState('')
  const [adding,   setAdding]   = useState(false)
  const [showAdd,  setShowAdd]  = useState(false)

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 3000)
  }

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    // Verify teacher is assigned to this group (via junction table)
    const { data: junc } = await supabase
      .from('english_group_teachers')
      .select('group_id')
      .eq('teacher_id', session.user.id)
      .eq('group_id', id)
      .maybeSingle()
    if (!junc) { router.replace('/english/zku/teacher/groups'); return }

    const { data: grp } = await supabase
      .from('english_groups').select('*').eq('id', id).maybeSingle()
    if (!grp) { router.replace('/english/zku/teacher/groups'); return }
    setGroup(grp as Group)

    const { data: studs } = await supabase
      .from('english_user_profiles')
      .select('user_id, full_name, current_level, total_xp, current_streak, last_active_at, group_id')
      .eq('group_id', id)
      .order('total_xp', { ascending: false })
    setStudents((studs ?? []) as Student[])
    setLoading(false)
  }, [id, router])

  useEffect(() => { load() }, [load])

  async function removeStudent(userId: string, name: string) {
    if (!confirm(`Убрать ${name} из группы?`)) return
    const supabase = createEnglishClient()
    await supabase.from('english_user_profiles').update({ group_id: null }).eq('user_id', userId)
    showToast(`${name} убран из группы`)
    await load()
  }

  async function addStudent() {
    if (!addEmail.trim()) return
    setAdding(true)
    const supabase = createEnglishClient()

    // Find user by email via auth (we search profiles by email-slug)
    const { data: users } = await supabase
      .from('english_user_profiles')
      .select('user_id, full_name, group_id, role')
      .eq('role', 'student')
      .limit(100)

    // Match by checking auth users
    const { data: authData } = await supabase.auth.admin?.listUsers?.() ?? { data: null }

    // Simpler: find student profile where user email matches
    // Since we can't easily do cross-table join, we'll use group join code approach
    // Instead - find by name/email hint
    const email = addEmail.trim().toLowerCase()
    const found = (users ?? []).find((u: Student & { role: string }) =>
      u.user_id.includes(email.split('@')[0]) || (u.full_name ?? '').toLowerCase().includes(email)
    )

    if (!found) {
      showToast('Студент не найден. Попросите его ввести код группы при входе.', 'error')
      setAdding(false); return
    }

    if ((found as Student & { group_id?: string }).group_id === id) {
      showToast('Студент уже в этой группе', 'error')
      setAdding(false); return
    }

    await supabase.from('english_user_profiles').update({ group_id: id }).eq('user_id', found.user_id)
    showToast(`${found.full_name ?? 'Студент'} добавлен в группу`)
    setAddEmail(''); setShowAdd(false)
    await load()
    setAdding(false)
  }

  const now = new Date()
  function daysSince(date: string | null) {
    if (!date) return { label: 'Никогда', color: '#CBD5E1' }
    const d = Math.floor((now.getTime() - new Date(date).getTime()) / 86400000)
    if (d === 0) return { label: 'Сегодня', color: T }
    if (d === 1) return { label: 'Вчера', color: '#22c55e' }
    if (d <= 7) return { label: `${d} дн.`, color: G }
    return { label: `${d} дн.`, color: '#94A3B8' }
  }

  const filtered = students.filter(s =>
    !search || (s.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )
  const activeToday = students.filter(s => s.last_active_at?.startsWith(now.toISOString().split('T')[0])).length
  const avgXp = students.length > 0 ? Math.round(students.reduce((a, s) => a + (s.total_xp ?? 0), 0) / students.length) : 0

  if (loading) return (
    <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <div style={{ fontSize: 13, color: MUT }}>Загрузка...</div>
    </div>
  )

  if (!group) return null

  return (
    <div style={{ padding: '24px 28px', maxWidth: 960, margin: '0 auto' }}>

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '12px 20px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.18)' }}>
          {toast.type === 'success' ? '✓' : '⚠'} {toast.msg}
        </div>
      )}

      {/* Back + header */}
      <div style={{ marginBottom: 22 }}>
        <Link href="/english/zku/teacher/groups" style={{ fontSize: 12, color: MUT, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
          ← Все группы
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>{group.name}</h1>
            <div style={{ display: 'flex', gap: 12, fontSize: 13, color: MUT }}>
              <span style={{ fontWeight: 700, color: LEVEL_COLOR[group.level_code] ?? N }}>● {group.level_code}</span>
              <span>🎓 {students.length} студентов</span>
              <span>⚡ {activeToday} активны сегодня</span>
              <span>✨ Ср. XP: {avgXp.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {/* Join code */}
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 9, color: MUT, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Код входа</div>
              <div style={{ padding: '8px 16px', borderRadius: 10, background: '#EEF2F7', fontFamily: 'monospace', fontWeight: 800, fontSize: 18, color: N, letterSpacing: '0.14em' }}>
                {group.join_code}
              </div>
            </div>
            <button onClick={() => setShowAdd(s => !s)} style={{
              padding: '11px 18px', borderRadius: 12, border: 'none',
              background: showAdd ? '#F1F5F9' : N, color: showAdd ? MUT : '#fff',
              fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
            }}>
              {showAdd ? '✕ Отмена' : '+ Добавить студента'}
            </button>
          </div>
        </div>
      </div>

      {/* Add student form */}
      {showAdd && (
        <div style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', marginBottom: 18, border: `2px solid ${N}33` }}>
          <div style={{ fontSize: 13, fontWeight: 800, color: N, marginBottom: 12 }}>➕ Добавить студента в группу</div>
          <div style={{ display: 'flex', gap: 10 }}>
            <input value={addEmail} onChange={e => setAddEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && addStudent()}
              placeholder="Имя или часть email студента..."
              style={{ flex: 1, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', fontFamily: 'inherit' }}
              onFocus={e => e.currentTarget.style.borderColor = N}
              onBlur={e => e.currentTarget.style.borderColor = BDR} />
            <button onClick={addStudent} disabled={!addEmail.trim() || adding} style={{
              padding: '10px 20px', borderRadius: 10, border: 'none',
              background: !addEmail.trim() ? '#94A3B8' : N, color: '#fff',
              fontWeight: 700, fontSize: 13, cursor: !addEmail.trim() ? 'not-allowed' : 'pointer', fontFamily: 'inherit',
            }}>{adding ? 'Ищем...' : 'Добавить'}</button>
          </div>
          <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 8 }}>
            💡 Лучший способ: студент сам вводит код <strong style={{ fontFamily: 'monospace' }}>{group.join_code}</strong> при регистрации
          </div>
        </div>
      )}

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по имени..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', marginBottom: 16, boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.currentTarget.style.borderColor = N}
        onBlur={e => e.currentTarget.style.borderColor = BDR} />

      {/* Students table */}
      {filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>🎓</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: N, marginBottom: 8 }}>
            {search ? 'Не найдено' : 'Студентов нет'}
          </div>
          <div style={{ fontSize: 13, color: MUT }}>
            {!search && `Поделитесь кодом группы: `}
            {!search && <strong style={{ fontFamily: 'monospace', fontSize: 16 }}>{group.join_code}</strong>}
          </div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 120px 80px 110px 80px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            {['Студент', 'Уровень', 'XP', 'Стрик', 'Активность', ''].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>

          {filtered.map((s, i) => {
            const initial = (s.full_name ?? '?').charAt(0).toUpperCase()
            const lc = LEVEL_COLOR[s.current_level ?? 'A1'] ?? N
            const ag = daysSince(s.last_active_at)
            return (
              <div key={s.user_id} style={{
                display: 'grid', gridTemplateColumns: '2fr 80px 120px 80px 110px 80px',
                padding: '13px 20px', gap: 8, alignItems: 'center',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `linear-gradient(135deg, ${lc}, ${lc}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>{initial}</div>
                  <Link href={`/english/zku/teacher/students/${s.user_id}`} style={{ fontSize: 13, fontWeight: 700, color: N, textDecoration: 'none' }}
                    onMouseEnter={e => (e.currentTarget as HTMLElement).style.textDecoration = 'underline'}
                    onMouseLeave={e => (e.currentTarget as HTMLElement).style.textDecoration = 'none'}>
                    {s.full_name ?? 'Студент'}
                  </Link>
                </div>
                <div><span style={{ fontSize: 11, fontWeight: 800, background: `${lc}18`, color: lc, padding: '3px 9px', borderRadius: 99 }}>{s.current_level ?? 'A1'}</span></div>
                <div style={{ fontSize: 13, fontWeight: 700, color: G }}>{(s.total_xp ?? 0).toLocaleString()} XP</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: (s.current_streak ?? 0) > 0 ? '#EF4444' : '#CBD5E1' }}>
                  {(s.current_streak ?? 0) > 0 ? `🔥 ${s.current_streak}` : '—'}
                </div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ag.color }}>{ag.label}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <Link href={`/english/zku/teacher/students/${s.user_id}`} style={{ width: 30, height: 30, borderRadius: 8, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none', fontSize: 14 }} title="Профиль">👤</Link>
                  <button onClick={() => removeStudent(s.user_id, s.full_name ?? 'Студент')} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: '#FEE2E2', color: '#DC2626', cursor: 'pointer', fontSize: 14 }} title="Убрать из группы">✕</button>
                </div>
              </div>
            )
          })}

          <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, background: '#F8FBFF', fontSize: 12, color: MUT }}>
            {filtered.length} студентов · ср. XP {avgXp.toLocaleString()} · активны сегодня: {activeToday}
          </div>
        </div>
      )}
    </div>
  )
}
