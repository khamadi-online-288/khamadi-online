'use client'

import { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../student/zku-lang'

const N = '#003876'
const ADMIN = '#7C3AED'
const T = '#1D9E75'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Teacher {
  user_id: string; full_name: string | null; email?: string; last_active_at: string | null
  groups_count?: number; students_count?: number; is_active?: boolean
}
type Toast = { msg: string; type: 'success'|'error' }

export default function AdminTeachersPage() {
  const [teachers,  setTeachers]  = useState<Teacher[]>([])
  const [loading,   setLoading]   = useState(true)
  const [passId,    setPassId]    = useState<string | null>(null)
  const [newPass,   setNewPass]   = useState('')
  const [passLoad,  setPassLoad]  = useState(false)
  const [tok,       setTok]       = useState('')
  const [search,    setSearch]    = useState('')
  const [toast,     setToast]     = useState<Toast | null>(null)
  const [showForm,  setShowForm]  = useState(false)

  // Create teacher form
  const [formName,  setFormName]  = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formPass,  setFormPass]  = useState('')
  const [creating,  setCreating]  = useState(false)
  const { t } = useZkuLang()

  const showToast = (msg: string, type: 'success'|'error' = 'success') => {
    setToast({ msg, type }); setTimeout(() => setToast(null), 4000)
  }

  const load = useCallback(async () => {
    const supabase = createEnglishClient()
    const { data: { session } } = await supabase.auth.getSession()
    if (session) setTok(session.access_token)

    const { data } = await supabase
      .from('english_user_profiles')
      .select('user_id, full_name, last_active_at')
      .eq('role', 'teacher')
      .order('last_active_at', { ascending: false })

    const list = await Promise.all((data ?? []).map(async (t: Teacher) => {
      const { data: junc } = await supabase
        .from('english_group_teachers').select('group_id').eq('teacher_id', t.user_id)
      const gids = (junc ?? []).map((r: { group_id: string }) => r.group_id)
      const gc = gids.length
      const { data: grps } = gc > 0 ? await supabase
        .from('english_groups').select('students_count').in('id', gids) : { data: [] }
      const sc = (grps ?? []).reduce((s: number, g: { students_count: number | null }) => s + (g.students_count ?? 0), 0)
      const now = new Date()
      const lastD = t.last_active_at ? (now.getTime() - new Date(t.last_active_at).getTime()) / 86400000 : 999
      return { ...t, groups_count: gc, students_count: sc, is_active: lastD <= 7 }
    }))

    setTeachers(list as Teacher[])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function createTeacher() {
    if (!formName.trim() || !formEmail.trim() || formPass.length < 8) return
    setCreating(true)
    const supabase = createEnglishClient()

    // Sign up via Supabase Auth
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: formEmail.trim(),
      password: formPass,
      options: { data: { full_name: formName.trim(), role: 'teacher' } },
    })

    if (signUpError) {
      showToast(signUpError.message, 'error')
      setCreating(false); return
    }

    if (data.user) {
      await supabase.from('english_user_profiles').upsert({
        user_id: data.user.id,
        full_name: formName.trim(),
        role: 'teacher',
        tenant_id: 'zku',
      }, { onConflict: 'user_id' })
    }

    showToast(`✓ Преподаватель ${formName.trim()} создан! Отправьте ему данные для входа.`)
    setFormName(''); setFormEmail(''); setFormPass(''); setShowForm(false)
    await load()
    setCreating(false)
  }

  async function changePassword(userId: string) {
    if (newPass.length < 6) { showToast('Минимум 6 символов', 'error'); return }
    setPassLoad(true)
    const res = await fetch('/api/english/admin/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tok}` },
      body: JSON.stringify({ targetUserId: userId, newPassword: newPass }),
    })
    const d = await res.json()
    setPassLoad(false)
    if (d.ok) { showToast('✓ Пароль изменён'); setPassId(null); setNewPass('') }
    else showToast(d.error ?? 'Ошибка', 'error')
  }

  async function promoteToAdmin(userId: string, name: string) {
    if (!confirm(`Сделать ${name} администратором?`)) return
    const supabase = createEnglishClient()
    await supabase.from('english_user_profiles').update({ role: 'admin' }).eq('user_id', userId)
    showToast(`${name} теперь администратор`)
    setTeachers(prev => prev.filter(t => t.user_id !== userId))
  }

  async function removeTeacher(userId: string, name: string) {
    if (!confirm(`Удалить аккаунт преподавателя ${name}? Все его группы останутся.`)) return
    const supabase = createEnglishClient()
    await supabase.from('english_user_profiles').update({ role: 'student' }).eq('user_id', userId)
    showToast(`${name} переведён в роль студента`)
    await load()
  }

  const now = new Date()
  function timeAgo(date: string | null) {
    if (!date) return { label: 'Никогда', color: '#CBD5E1' }
    const diff = Math.floor((now.getTime() - new Date(date).getTime()) / 86400000)
    if (diff === 0) return { label: 'Сегодня', color: T }
    if (diff <= 7) return { label: `${diff} дн. назад`, color: '#22c55e' }
    if (diff <= 30) return { label: `${diff} дн. назад`, color: '#f59e0b' }
    return { label: `${diff} дн. назад`, color: '#CBD5E1' }
  }

  const filtered = teachers.filter(t =>
    !search || (t.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )
  const activeCount  = teachers.filter(t => t.is_active).length
  const totalStudents = teachers.reduce((s, t) => s + (t.students_count ?? 0), 0)
  const totalGroups   = teachers.reduce((s, t) => s + (t.groups_count ?? 0), 0)

  return (
    <div style={{ padding: '24px 28px', maxWidth: 960, margin: '0 auto' }}>

      {/* Password modal */}
      {passId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 500, background: 'rgba(0,0,0,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={e => { if (e.target === e.currentTarget) { setPassId(null); setNewPass('') } }}>
          <div style={{ background: '#fff', borderRadius: 20, padding: '28px 32px', width: 400, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>
            <div style={{ fontSize: 16, fontWeight: 900, color: N, marginBottom: 6 }}>🔑 Сменить пароль преподавателя</div>
            <div style={{ fontSize: 12, color: MUT, marginBottom: 20 }}>
              <strong>{teachers.find(t => t.user_id === passId)?.full_name}</strong>
            </div>
            <input autoFocus type="text" value={newPass} onChange={e => setNewPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && changePassword(passId)}
              placeholder="Новый пароль (мин. 6 символов)"
              style={{ width: '100%', padding: '12px 14px', borderRadius: 10, border: `2px solid ${N}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', marginBottom: 14 }}/>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => { setPassId(null); setNewPass('') }}
                style={{ flex: 1, padding: '11px', borderRadius: 10, border: `1px solid ${BDR}`, background: '#F1F5F9', color: MUT, fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>Отмена</button>
              <button onClick={() => changePassword(passId)} disabled={passLoad || newPass.length < 6}
                style={{ flex: 2, padding: '11px', borderRadius: 10, border: 'none', background: newPass.length >= 6 ? N : '#CBD5E1', color: '#fff', fontWeight: 700, fontSize: 13, cursor: newPass.length >= 6 ? 'pointer' : 'not-allowed', fontFamily: 'inherit' }}>
                {passLoad ? 'Сохраняем...' : '✓ Сохранить пароль'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', top: 20, right: 20, zIndex: 999, padding: '14px 22px', borderRadius: 12, background: toast.type === 'success' ? T : '#DC2626', color: '#fff', fontWeight: 700, fontSize: 13, boxShadow: '0 8px 24px rgba(0,0,0,0.18)', maxWidth: 360 }}>
          {toast.msg}
        </div>
      )}

      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 22 }}>
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 900, color: '#1a0050', marginBottom: 4 }}>Преподаватели</h1>
          <div style={{ display: 'flex', gap: 16, fontSize: 13, color: MUT }}>
            <span>👨‍🏫 Всего: <strong style={{ color: N }}>{teachers.length}</strong></span>
            <span>⚡ Активны (7 дн.): <strong style={{ color: T }}>{activeCount}</strong></span>
            <span>👥 Групп: <strong style={{ color: ADMIN }}>{totalGroups}</strong></span>
            <span>🎓 Студентов: <strong style={{ color: '#16A34A' }}>{totalStudents}</strong></span>
          </div>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '11px 20px', borderRadius: 12, border: 'none',
          background: showForm ? '#F1F5F9' : ADMIN, color: showForm ? MUT : '#fff',
          fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'inherit',
          boxShadow: showForm ? 'none' : `0 4px 14px ${ADMIN}44`,
        }}>
          {showForm ? '✕ Отмена' : t.panel.create_teacher}
        </button>
      </div>

      {/* Create teacher form */}
      {showForm && (
        <div style={{ background: '#fff', borderRadius: 16, padding: '22px 24px', marginBottom: 20, border: `2px solid ${ADMIN}33`, boxShadow: `0 4px 20px ${ADMIN}10` }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#1a0050', marginBottom: 16 }}>👨‍🏫 Создать аккаунт преподавателя</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Полное имя *</label>
              <input value={formName} onChange={e => setFormName(e.target.value)}
                placeholder="Иван Иванов"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = ADMIN}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Email *</label>
              <input type="email" value={formEmail} onChange={e => setFormEmail(e.target.value)}
                placeholder="teacher@zku.kz"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = ADMIN}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 11, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Пароль * (мин. 8 символов)</label>
              <input type="password" value={formPass} onChange={e => setFormPass(e.target.value)}
                placeholder="Надёжный пароль"
                style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 14, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
                onFocus={e => e.currentTarget.style.borderColor = ADMIN}
                onBlur={e => e.currentTarget.style.borderColor = BDR} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button
              onClick={createTeacher}
              disabled={!formName.trim() || !formEmail.trim() || formPass.length < 8 || creating}
              style={{
                padding: '11px 22px', borderRadius: 10, border: 'none',
                background: (!formName.trim() || !formEmail.trim() || formPass.length < 8) ? '#94A3B8' : ADMIN,
                color: '#fff', fontWeight: 700, fontSize: 13,
                cursor: (!formName.trim() || !formEmail.trim() || formPass.length < 8) ? 'not-allowed' : 'pointer',
                fontFamily: 'inherit', boxShadow: `0 4px 14px ${ADMIN}44`,
              }}>
              {creating ? t.panel.saving : t.panel.create_teacher}
            </button>
            <div style={{ fontSize: 12, color: '#94A3B8' }}>
              После создания отправьте преподавателю email и пароль вручную
            </div>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Поиск по имени..."
        style={{ width: '100%', padding: '11px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', marginBottom: 18, boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.currentTarget.style.borderColor = N}
        onBlur={e => e.currentTarget.style.borderColor = BDR} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 56, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 56, marginBottom: 14 }}>👨‍🏫</div>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#1a0050', marginBottom: 8 }}>Преподавателей нет</div>
          <div style={{ fontSize: 13, color: MUT, marginBottom: 20 }}>Создайте первый аккаунт преподавателя</div>
          <button onClick={() => setShowForm(true)} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: ADMIN, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>
            + Создать преподавателя
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden', boxShadow: '0 1px 6px rgba(0,56,118,0.04)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 80px 100px 110px auto', padding: '12px 22px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
            {['Преподаватель', 'Групп', 'Студентов', 'Активность', 'Действия'].map(h => (
              <div key={h} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
            ))}
          </div>

          {filtered.map((t, i) => {
            const initial = (t.full_name ?? '?').charAt(0).toUpperCase()
            const ag = timeAgo(t.last_active_at)
            return (
              <div key={t.user_id} style={{
                display: 'grid', gridTemplateColumns: '2fr 80px 100px 110px auto',
                padding: '14px 22px', gap: 8, alignItems: 'center',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFCFF',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative' }}>
                    <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${ADMIN}, #9333ea)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15 }}>{initial}</div>
                    {t.is_active && <div style={{ position: 'absolute', bottom: 0, right: 0, width: 11, height: 11, borderRadius: '50%', background: T, border: '2px solid #fff' }} />}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: N }}>{t.full_name ?? 'Преподаватель'}</div>
                    <div style={{ fontSize: 11, color: ADMIN, fontWeight: 600 }}>👨‍🏫 Преподаватель</div>
                  </div>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: ADMIN }}>{t.groups_count ?? 0}</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#16A34A' }}>{t.students_count ?? 0}</div>
                <div style={{ fontSize: 12, fontWeight: 600, color: ag.color }}>{ag.label}</div>
                <div style={{ display: 'flex', gap: 5 }}>
                  <button onClick={() => { setPassId(t.user_id); setNewPass('') }}
                    title="Сменить пароль"
                    style={{ padding: '7px 10px', borderRadius: 8, border: '1px solid #FEF3C7', background: '#FFFBEB', color: '#D97706', fontSize: 13, cursor: 'pointer', fontFamily: 'inherit' }}>
                    🔑
                  </button>
                  <button onClick={() => promoteToAdmin(t.user_id, t.full_name ?? 'Преподаватель')} style={{
                    padding: '7px 10px', borderRadius: 8, border: `1px solid ${ADMIN}33`,
                    background: '#EDE9FE', color: ADMIN, fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit', whiteSpace: 'nowrap',
                  }}>→ Admin</button>
                  <button onClick={() => removeTeacher(t.user_id, t.full_name ?? 'Преподаватель')} style={{
                    padding: '7px 10px', borderRadius: 8, border: '1px solid #FEE2E2',
                    background: '#FEE2E2', color: '#DC2626', fontSize: 11, fontWeight: 700,
                    cursor: 'pointer', fontFamily: 'inherit',
                  }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
