'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'

const supabase = createEnglishClient()

type Course = {
  id: string
  title: string
  title_kz: string | null
  level: string | null
  category: string | null
  is_active: boolean
  created_at: string
  student_count?: number
}

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981',
  A2: '#3b82f6',
  B1: '#8b5cf6',
  B2: '#f59e0b',
  C1: '#ef4444',
}

const PAGE_SIZE = 20

export default function AdminCoursesPage() {
  const router = useRouter()
  const [courses, setCourses]         = useState<Course[]>([])
  const [loading, setLoading]         = useState(true)
  const [search, setSearch]           = useState('')
  const [levelFilter, setLevelFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [page, setPage]               = useState(0)
  const [toggling, setToggling]       = useState<string | null>(null)
  const [error, setError]             = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { router.push('/english/login'); return }

      const { data: roleData } = await supabase
        .from('english_user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      if ((roleData as { role: string } | null)?.role !== 'admin') {
        router.push('/english/dashboard')
        return
      }

      const { data: coursesData, error: coursesErr } = await supabase
        .from('english_courses')
        .select('id, title, title_kz, level, category, is_active, created_at')
        .order('created_at', { ascending: false })

      if (coursesErr) { setError('Не удалось загрузить курсы'); setLoading(false); return }

      const loadedCourses = (coursesData || []) as Course[]

      // Fetch enrollment counts
      const { data: enrollData } = await supabase
        .from('english_enrollments')
        .select('course_id')

      if (enrollData) {
        const countMap = new Map<string, number>()
        for (const row of enrollData as { course_id: string }[]) {
          countMap.set(row.course_id, (countMap.get(row.course_id) || 0) + 1)
        }
        for (const c of loadedCourses) {
          c.student_count = countMap.get(c.id) || 0
        }
      }

      setCourses(loadedCourses)
      setLoading(false)
    }
    load()
  }, [router])

  async function toggleActive(courseId: string, current: boolean) {
    setToggling(courseId)
    const { error: updateErr } = await supabase
      .from('english_courses')
      .update({ is_active: !current })
      .eq('id', courseId)

    if (!updateErr) {
      setCourses(prev => prev.map(c => c.id === courseId ? { ...c, is_active: !current } : c))
    }
    setToggling(null)
  }

  const levels = Array.from(new Set(courses.map(c => c.level).filter(Boolean))) as string[]
  const categories = Array.from(new Set(courses.map(c => c.category).filter(Boolean))) as string[]

  const filtered = courses.filter(c => {
    const matchLevel = levelFilter === 'all' || c.level === levelFilter
    const matchStatus = statusFilter === 'all' || (statusFilter === 'active' ? c.is_active : !c.is_active)
    const q = search.toLowerCase()
    const matchSearch = !q ||
      c.title.toLowerCase().includes(q) ||
      (c.title_kz || '').toLowerCase().includes(q) ||
      (c.category || '').toLowerCase().includes(q)
    return matchLevel && matchStatus && matchSearch
  })

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE)
  const paginated  = filtered.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)

  const counts = {
    all: courses.length,
    active: courses.filter(c => c.is_active).length,
    inactive: courses.filter(c => !c.is_active).length,
  }

  if (loading) return <div style={{ flex: 1 }}><AdminHeader title="Курсы" /><div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div></div>

  if (error) return <div style={{ flex: 1 }}><AdminHeader title="Курсы" /><div style={{ padding: 40, textAlign: 'center', color: '#dc2626', fontSize: 14 }}>{error}</div></div>

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Курсы" />
      <div style={{ padding: '24px 28px' }}>
        {/* Summary cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px,1fr))', gap: 14, marginBottom: 24 }}>
          {([
            { label: 'Всего курсов',   value: counts.all,      color: '#0ea5e9' },
            { label: 'Активных',       value: counts.active,   color: '#10b981' },
            { label: 'Неактивных',     value: counts.inactive, color: '#94a3b8' },
            { label: 'Уровней',        value: levels.length,   color: '#8b5cf6' },
            { label: 'Категорий',      value: categories.length, color: '#f59e0b' },
          ] as { label: string; value: number; color: string }[]).map(s => (
            <div key={s.label} style={{ background: '#fff', borderRadius: 18, padding: '18px 20px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderTop: `3px solid ${s.color}` }}>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 6 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: '#fff', borderRadius: 16, padding: '14px 20px', marginBottom: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0) }}
            placeholder="Поиск по названию, категории..."
            style={{ flex: 1, minWidth: 200, padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 999, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0f172a' }}
          />

          {/* Status filter */}
          <div style={{ display: 'flex', gap: 6 }}>
            {(['all', 'active', 'inactive'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatusFilter(s); setPage(0) }}
                style={{
                  padding: '7px 14px', borderRadius: 999, border: 'none', cursor: 'pointer',
                  fontFamily: 'inherit', fontWeight: 700, fontSize: 12,
                  background: statusFilter === s ? '#0ea5e9' : '#f1f5f9',
                  color: statusFilter === s ? '#fff' : '#64748b',
                }}
              >
                {s === 'all' ? `Все (${counts.all})` : s === 'active' ? `Активные (${counts.active})` : `Неактивные (${counts.inactive})`}
              </button>
            ))}
          </div>

          {/* Level filter */}
          {levels.length > 0 && (
            <select
              value={levelFilter}
              onChange={e => { setLevelFilter(e.target.value); setPage(0) }}
              style={{ padding: '9px 14px', border: '1.5px solid #e2e8f0', borderRadius: 999, fontSize: 13, fontFamily: 'inherit', color: '#0f172a', background: '#fff', outline: 'none', cursor: 'pointer' }}
            >
              <option value="all">Все уровни</option>
              {levels.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          )}

          <span style={{ color: '#94a3b8', fontSize: 13, fontWeight: 600, marginLeft: 'auto', flexShrink: 0 }}>
            {filtered.length} найдено
          </span>
        </div>

        {/* Table */}
        <div style={{ background: '#fff', borderRadius: 20, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 80px 160px 90px 100px',
            padding: '12px 20px',
            background: '#f8fafc',
            borderBottom: '1px solid #e2e8f0',
            fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em',
          }}>
            <span>Курс</span>
            <span>Уровень</span>
            <span>Категория</span>
            <span>Студентов</span>
            <span>Статус</span>
          </div>

          {paginated.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>
              Курсы не найдены
            </div>
          ) : paginated.map((c, i) => (
            <div
              key={c.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 80px 160px 90px 100px',
                padding: '14px 20px',
                borderBottom: i < paginated.length - 1 ? '1px solid #f1f5f9' : 'none',
                alignItems: 'center',
                transition: 'background 0.12s',
                opacity: c.is_active ? 1 : 0.6,
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#fafcff')}
              onMouseLeave={e => (e.currentTarget.style.background = '')}
            >
              {/* Title */}
              <div>
                <div style={{ fontWeight: 800, fontSize: 14, color: '#0f172a', marginBottom: 2 }}>
                  {c.title}
                </div>
                {c.title_kz && (
                  <div style={{ fontSize: 12, color: '#64748b' }}>{c.title_kz}</div>
                )}
                <div style={{ fontSize: 11, color: '#94a3b8', fontFamily: 'monospace', marginTop: 2 }}>
                  {c.id.slice(0, 8)}...
                </div>
              </div>

              {/* Level */}
              <div>
                {c.level ? (
                  <span style={{
                    background: LEVEL_COLORS[c.level] || '#94a3b8',
                    color: '#fff',
                    borderRadius: 999,
                    padding: '3px 10px',
                    fontSize: 11,
                    fontWeight: 800,
                  }}>
                    {c.level}
                  </span>
                ) : (
                  <span style={{ color: '#cbd5e1' }}>—</span>
                )}
              </div>

              {/* Category */}
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                {c.category || <span style={{ color: '#cbd5e1' }}>—</span>}
              </div>

              {/* Student count */}
              <div style={{ fontSize: 14, fontWeight: 800, color: '#0f172a' }}>
                {c.student_count ?? '—'}
              </div>

              {/* Toggle */}
              <div>
                <button
                  onClick={() => toggleActive(c.id, c.is_active)}
                  disabled={toggling === c.id}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 999,
                    border: 'none',
                    cursor: toggling === c.id ? 'not-allowed' : 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 12,
                    background: c.is_active ? 'rgba(16,185,129,0.1)' : 'rgba(148,163,184,0.1)',
                    color: c.is_active ? '#059669' : '#64748b',
                    opacity: toggling === c.id ? 0.5 : 1,
                    transition: 'all 0.15s',
                    minWidth: 80,
                  }}
                >
                  {toggling === c.id ? '...' : c.is_active ? 'Активен' : 'Выкл.'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 6, marginTop: 20 }}>
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: page === 0 ? 'not-allowed' : 'pointer', background: '#f1f5f9', color: '#64748b', opacity: page === 0 ? 0.4 : 1 }}
            >
              ← Назад
            </button>

            {Array.from({ length: Math.min(totalPages, 7) }, (_, idx) => {
              const pageNum = totalPages <= 7 ? idx : Math.max(0, Math.min(page - 3, totalPages - 7)) + idx
              return (
                <button
                  key={pageNum}
                  onClick={() => setPage(pageNum)}
                  style={{
                    padding: '8px 13px', borderRadius: 10, border: 'none', cursor: 'pointer',
                    fontFamily: 'inherit', fontWeight: 800, fontSize: 13,
                    background: page === pageNum ? '#0ea5e9' : '#f1f5f9',
                    color: page === pageNum ? '#fff' : '#64748b',
                  }}
                >
                  {pageNum + 1}
                </button>
              )
            })}

            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              style={{ padding: '8px 16px', borderRadius: 10, border: 'none', fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: page === totalPages - 1 ? 'not-allowed' : 'pointer', background: '#f1f5f9', color: '#64748b', opacity: page === totalPages - 1 ? 0.4 : 1 }}
            >
              Вперёд →
            </button>

            <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600, marginLeft: 8 }}>
              стр. {page + 1} / {totalPages}
            </span>
          </div>
        )}
      </div>
    </div>
  )
}