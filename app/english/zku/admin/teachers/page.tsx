'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N = '#003876'
const ADMIN = '#7C3AED'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Teacher {
  user_id: string
  full_name: string | null
  last_active_at: string | null
  groups_count?: number
}

export default function AdminTeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name, last_active_at')
        .eq('role', 'teacher')
        .order('last_active_at', { ascending: false })

      // Count groups per teacher
      const teachers = await Promise.all((data ?? []).map(async (t: Teacher) => {
        const { count } = await supabase
          .from('english_groups')
          .select('*', { count: 'exact', head: true })
          .eq('teacher_id', t.user_id)
        return { ...t, groups_count: count ?? 0 }
      }))

      setTeachers(teachers as Teacher[])
      setLoading(false)
    }
    load()
  }, [])

  async function promoteToAdmin(userId: string) {
    if (!confirm('Сделать этого преподавателя администратором?')) return
    const supabase = createEnglishClient()
    await supabase.from('english_user_profiles').update({ role: 'admin' }).eq('user_id', userId)
    setTeachers(prev => prev.filter(t => t.user_id !== userId))
  }

  const filtered = teachers.filter(t =>
    !search || (t.full_name ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div style={{ padding: '28px 32px', maxWidth: 900, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 900, color: N, marginBottom: 4 }}>Преподаватели</h1>
        <p style={{ fontSize: 13, color: MUT }}>{teachers.length} преподавателей на платформе</p>
      </div>

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Поиск по имени..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${BDR}`, fontSize: 13, outline: 'none', marginBottom: 20, boxSizing: 'border-box', fontFamily: 'inherit' }}
        onFocus={e => e.currentTarget.style.borderColor = N}
        onBlur={e => e.currentTarget.style.borderColor = BDR} />

      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT }}>Загрузка...</div>
      ) : filtered.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 18, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>👨‍🏫</div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N }}>Преподавателей нет</div>
          <p style={{ fontSize: 13, color: MUT, marginTop: 8 }}>Зарегистрируйтесь как преподаватель через страницу регистрации</p>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
          {filtered.map((t, i) => {
            const initial = (t.full_name ?? '?').charAt(0).toUpperCase()
            const lastActive = t.last_active_at
              ? new Date(t.last_active_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
              : 'Не был'
            return (
              <div key={t.user_id} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '16px 22px',
                borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
              }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: `linear-gradient(135deg, ${ADMIN}, #9333ea)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{initial}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: N }}>{t.full_name ?? 'Преподаватель'}</div>
                  <div style={{ fontSize: 12, color: MUT }}>{t.groups_count} групп · последний вход: {lastActive}</div>
                </div>
                <button onClick={() => promoteToAdmin(t.user_id)} style={{
                  padding: '7px 14px', borderRadius: 8, border: `1px solid ${ADMIN}33`,
                  background: '#EDE9FE', color: ADMIN, fontSize: 12, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
                }}>
                  → Админ
                </button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
