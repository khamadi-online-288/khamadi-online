'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Textbook = {
  id: string
  title: string
  description: string | null
  file_url: string | null
  level: string | null
  course_id: string | null
  course_title?: string
}

type Course = {
  id: string
  title: string
  level: string
}

const LEVELS = ['Все', 'A1', 'A2', 'B1', 'B2', 'C1']

const LEVEL_COLORS: Record<string, string> = {
  A1: '#10b981',
  A2: '#3b82f6',
  B1: '#8b5cf6',
  B2: '#f59e0b',
  C1: '#ef4444',
}

export default function TextbooksPage() {
  const router = useRouter()
  const [textbooks, setTextbooks] = useState<Textbook[]>([])
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [levelFilter, setLevelFilter] = useState('Все')
  const [courseFilter, setCourseFilter] = useState('Все')
  const [search, setSearch] = useState('')

  useEffect(() => {
    load()
  }, [])

  async function load() {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { router.push('/english/login'); return }

      const [tbRes, coursesRes] = await Promise.all([
        supabase.from('english_textbooks').select('*').order('created_at', { ascending: false }),
        supabase.from('english_courses').select('id, title, level').eq('is_active', true),
      ])

      if (tbRes.error) throw tbRes.error
      if (coursesRes.error) throw coursesRes.error

      const loadedCourses = (coursesRes.data || []) as Course[]
      const courseMap = new Map(loadedCourses.map((c) => [c.id, c.title]))

      const loadedBooks = ((tbRes.data || []) as Textbook[]).map((b) => ({
        ...b,
        course_title: b.course_id ? courseMap.get(b.course_id) || '' : '',
      }))

      setCourses(loadedCourses)
      setTextbooks(loadedBooks)
    } catch (e) {
      setError('Не удалось загрузить учебники')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const filtered = textbooks.filter((b) => {
    const matchLevel = levelFilter === 'Все' || b.level === levelFilter
    const matchCourse = courseFilter === 'Все' || b.course_id === courseFilter
    const matchSearch =
      !search ||
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      (b.description || '').toLowerCase().includes(search.toLowerCase())
    return matchLevel && matchCourse && matchSearch
  })

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main, Montserrat, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', fontSize: 22, padding: 4 }}
            title="Назад"
          >
            ←
          </button>
          <span style={{ fontSize: 22, fontWeight: 800, color: '#0f172a' }}>📖 Учебники</span>
          <span style={{ marginLeft: 'auto', background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)', color: '#fff', borderRadius: 999, padding: '4px 14px', fontSize: 13, fontWeight: 700 }}>
            {filtered.length} учебников
          </span>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
        {/* Filters */}
        <div style={{
          background: '#fff',
          borderRadius: 20,
          padding: '20px 24px',
          marginBottom: 28,
          boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 16,
          alignItems: 'center',
        }}>
          {/* Search */}
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по названию..."
            style={{
              flex: 1,
              minWidth: 200,
              padding: '10px 16px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 999,
              fontSize: 14,
              fontFamily: 'inherit',
              outline: 'none',
              color: '#0f172a',
            }}
          />

          {/* Level filter */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {LEVELS.map((l) => (
              <button
                key={l}
                onClick={() => setLevelFilter(l)}
                style={{
                  padding: '6px 16px',
                  borderRadius: 999,
                  border: 'none',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: 13,
                  background: levelFilter === l
                    ? (LEVEL_COLORS[l] || '#0ea5e9')
                    : '#f1f5f9',
                  color: levelFilter === l ? '#fff' : '#64748b',
                  transition: 'all 0.18s',
                }}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Course filter */}
          <select
            value={courseFilter}
            onChange={(e) => setCourseFilter(e.target.value)}
            style={{
              padding: '10px 16px',
              border: '1.5px solid #e2e8f0',
              borderRadius: 999,
              fontSize: 14,
              fontFamily: 'inherit',
              color: '#0f172a',
              background: '#fff',
              cursor: 'pointer',
              outline: 'none',
            }}
          >
            <option value="Все">Все курсы</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>{c.title}</option>
            ))}
          </select>
        </div>

        {/* Content */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#64748b', fontSize: 16 }}>
            Загружаем учебники...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#ef4444', fontSize: 16 }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📚</div>
            <div style={{ color: '#64748b', fontSize: 16 }}>Учебники не найдены</div>
            <div style={{ color: '#94a3b8', fontSize: 14, marginTop: 8 }}>
              Попробуйте изменить фильтры или добавьте учебники в Supabase
            </div>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
            gap: 20,
          }}>
            {filtered.map((book) => (
              <div
                key={book.id}
                style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: 24,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                  border: '1.5px solid #f1f5f9',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseEnter={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(-3px)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(14,165,233,0.12)'
                }}
                onMouseLeave={(e) => {
                  ;(e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.06)'
                }}
              >
                {/* Level badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span
                    style={{
                      background: book.level ? (LEVEL_COLORS[book.level] || '#0ea5e9') : '#94a3b8',
                      color: '#fff',
                      borderRadius: 999,
                      padding: '3px 12px',
                      fontSize: 12,
                      fontWeight: 700,
                    }}
                  >
                    {book.level || 'Все уровни'}
                  </span>
                  {book.course_title && (
                    <span style={{ color: '#64748b', fontSize: 12 }}>{book.course_title}</span>
                  )}
                </div>

                {/* Icon + Title */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                  <span style={{ fontSize: 36, lineHeight: 1 }}>📗</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', lineHeight: 1.3 }}>
                      {book.title}
                    </div>
                    {book.description && (
                      <div style={{ color: '#64748b', fontSize: 13, marginTop: 6, lineHeight: 1.5 }}>
                        {book.description}
                      </div>
                    )}
                  </div>
                </div>

                {/* Open button */}
                <div style={{ marginTop: 'auto' }}>
                  {book.file_url ? (
                    <a
                      href={book.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'block',
                        textAlign: 'center',
                        background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                        color: '#fff',
                        borderRadius: 999,
                        padding: '10px 0',
                        fontWeight: 700,
                        fontSize: 14,
                        textDecoration: 'none',
                        transition: 'opacity 0.18s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '0.85' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.opacity = '1' }}
                    >
                      Открыть учебник →
                    </a>
                  ) : (
                    <div
                      style={{
                        textAlign: 'center',
                        background: '#f1f5f9',
                        color: '#94a3b8',
                        borderRadius: 999,
                        padding: '10px 0',
                        fontWeight: 700,
                        fontSize: 14,
                      }}
                    >
                      Скоро доступно
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
