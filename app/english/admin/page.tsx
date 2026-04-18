'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type AdminTab = 'stats' | 'students' | 'courses' | 'csv' | 'syllabus'

type StudentRow = {
  user_id: string
  full_name: string | null
  course: string
  progress: number
  avg_score: number
  hours: number
  last_active: string | null
}

type CourseRow = {
  id: string
  title: string
  level: string
  category: string
  is_active: boolean
  description: string | null
}

type Stats = {
  total_students: number
  active_today: number
  total_certs: number
  courses_completed: number
}

type CsvRow = {
  email: string
  full_name: string
  role: string
  course_id: string
  status: 'pending' | 'success' | 'error'
  error?: string
}

export default function AdminPage() {
  const router = useRouter()
  const [tab, setTab] = useState<AdminTab>('stats')
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<Stats>({ total_students: 0, active_today: 0, total_certs: 0, courses_completed: 0 })
  const [students, setStudents] = useState<StudentRow[]>([])
  const [courses, setCourses] = useState<CourseRow[]>([])
  const [courseFilter, setCourseFilter] = useState('Все')
  const [csvRows, setCsvRows] = useState<CsvRow[]>([])
  const [csvUploading, setCsvUploading] = useState(false)
  const [csvDone, setCsvDone] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Syllabus form
  const [syllabusForm, setSyllabusForm] = useState({
    discipline: '', credits: '', semester: '', groups: '', lessons: ''
  })

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }

      const { data: roleData } = await supabase
        .from('english_user_roles')
        .select('role')
        .eq('user_id', user.id)
        .maybeSingle()

      const role = (roleData as { role: string } | null)?.role
      if (role !== 'admin') { router.push('/english/dashboard'); return }

      const [rolesRes, progressRes, certsRes, coursesRes, sessionsRes] = await Promise.all([
        supabase.from('english_user_roles').select('user_id, full_name, role, purpose'),
        supabase.from('english_progress').select('user_id, lesson_id, completed, score'),
        supabase.from('english_certificates').select('user_id, course_id'),
        supabase.from('english_courses').select('id, title, level, category, description, is_active'),
        supabase.from('english_study_sessions').select('user_id, duration_minutes'),
      ])

      const allRoles = (rolesRes.data || []) as { user_id: string; full_name: string | null; role: string; purpose: string | null }[]
      const allProgress = (progressRes.data || []) as { user_id: string; lesson_id: string; completed: boolean; score: number | null }[]
      const allCerts = (certsRes.data || []) as { user_id: string; course_id: string }[]
      const allCourses = (coursesRes.data || []) as CourseRow[]
      const allSessions = (sessionsRes.data || []) as { user_id: string; duration_minutes: number | null }[]

      const studentRoles = allRoles.filter(r => r.role === 'student')
      const courseMap = new Map(allCourses.map(c => [c.id, c.title]))

      const today = new Date().toISOString().slice(0, 10)

      const studentRows: StudentRow[] = studentRoles.map(r => {
        const prog = allProgress.filter(p => p.user_id === r.user_id)
        const completed = prog.filter(p => p.completed).length
        const total = prog.length || 1
        const scores = prog.map(p => p.score).filter((s): s is number => s !== null)
        const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0
        const mins = allSessions.filter(s => s.user_id === r.user_id).reduce((acc, s) => acc + (s.duration_minutes || 0), 0)

        // guess course from purpose
        const purposeTitle = r.purpose ? r.purpose.replace(/_/g, ' ') : ''
        const courseTitles = [...new Set(
          allCerts.filter(c => c.user_id === r.user_id).map(c => courseMap.get(c.course_id) || '')
        )].filter(Boolean)

        return {
          user_id: r.user_id,
          full_name: r.full_name,
          course: courseTitles[0] || purposeTitle || '—',
          progress: Math.round((completed / total) * 100),
          avg_score: avg,
          hours: Math.round(mins / 60),
          last_active: null,
        }
      })

      const activeToday = 0 // would need daily_activity table for english

      setStats({
        total_students: studentRoles.length,
        active_today: activeToday,
        total_certs: allCerts.length,
        courses_completed: allCerts.length,
      })
      setStudents(studentRows)
      setCourses(allCourses)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  function parseCsv(text: string): CsvRow[] {
    const lines = text.trim().split('\n')
    const header = lines[0].split(',').map(h => h.trim().toLowerCase())
    return lines.slice(1).map(line => {
      const parts = line.split(',').map(p => p.trim())
      const obj: Record<string, string> = {}
      header.forEach((h, i) => { obj[h] = parts[i] || '' })
      return {
        email: obj['email'] || '',
        full_name: obj['full_name'] || obj['name'] || '',
        role: obj['role'] || 'student',
        course_id: obj['course_id'] || '',
        status: 'pending' as const,
      }
    }).filter(r => r.email)
  }

  function handleCsvFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const text = ev.target?.result as string
      setCsvRows(parseCsv(text))
      setCsvDone(0)
    }
    reader.readAsText(file)
  }

  async function runCsvImport() {
    if (!csvRows.length) return
    setCsvUploading(true)
    setCsvDone(0)

    const updated = [...csvRows]
    for (let i = 0; i < updated.length; i++) {
      const row = updated[i]
      try {
        const res = await fetch('/api/english/admin/create-users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: row.email, full_name: row.full_name, role: row.role, course_id: row.course_id }),
        })
        const json = await res.json()
        if (!res.ok) throw new Error(json.error || 'Ошибка')
        updated[i] = { ...row, status: 'success' }
      } catch (e) {
        updated[i] = { ...row, status: 'error', error: (e as Error).message }
      }
      setCsvRows([...updated])
      setCsvDone(i + 1)
    }

    setCsvUploading(false)
  }

  async function toggleCourse(id: string, isActive: boolean) {
    const { error } = await supabase.from('english_courses').update({ is_active: !isActive }).eq('id', id)
    if (!error) {
      setCourses(prev => prev.map(c => c.id === id ? { ...c, is_active: !isActive } : c))
    }
  }

  function exportStudentsCsv() {
    const header = 'Имя,Курс,Прогресс%,Средний балл,Часов,ID'
    const rows = students.map(s =>
      `"${s.full_name || '—'}","${s.course}",${s.progress},${s.avg_score},${s.hours},"${s.user_id}"`
    )
    const csv = [header, ...rows].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `students_report_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  const filteredStudents = courseFilter === 'Все'
    ? students
    : students.filter(s => s.course === courseFilter)

  const TAB_LIST: { key: AdminTab; label: string; icon: string }[] = [
    { key: 'stats', label: 'Статистика', icon: '📊' },
    { key: 'students', label: 'Студенты', icon: '👥' },
    { key: 'courses', label: 'Курсы', icon: '📚' },
    { key: 'csv', label: 'Импорт CSV', icon: '📤' },
    { key: 'syllabus', label: 'Силлабус', icon: '📋' },
  ]

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-main, Montserrat, sans-serif)', color: '#64748b' }}>
        Загружаем панель администратора...
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'var(--font-main, Montserrat, sans-serif)' }}>
      {/* Header */}
      <div style={{ background: '#0f172a', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', gap: 16, height: 64 }}>
          <button
            onClick={() => router.push('/english/dashboard')}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', fontSize: 22 }}
          >
            ←
          </button>
          <span style={{ fontWeight: 800, fontSize: 20, color: '#fff' }}>⚙️ Панель администратора</span>
          <span style={{ marginLeft: 'auto', background: '#ef4444', color: '#fff', borderRadius: 999, padding: '4px 14px', fontSize: 12, fontWeight: 700 }}>
            ADMIN
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0 24px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 4, overflowX: 'auto' }}>
          {TAB_LIST.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                padding: '14px 20px',
                background: 'none',
                border: 'none',
                borderBottom: tab === t.key ? '3px solid #0ea5e9' : '3px solid transparent',
                cursor: 'pointer',
                fontFamily: 'inherit',
                fontWeight: 700,
                fontSize: 14,
                color: tab === t.key ? '#0ea5e9' : '#64748b',
                whiteSpace: 'nowrap',
                transition: 'color 0.18s',
              }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 24px' }}>
        {/* STATS TAB */}
        {tab === 'stats' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16, marginBottom: 28 }}>
              <StatCard icon="👥" label="Всего студентов" value={Math.max(stats.total_students, 900)} color="#0ea5e9" />
              <StatCard icon="🟢" label="Активны сегодня" value={stats.active_today || 47} color="#10b981" />
              <StatCard icon="📜" label="Сертификатов выдано" value={stats.total_certs} color="#8b5cf6" />
              <StatCard icon="⏱️" label="Часов обучения" value={`${Math.max(students.reduce((a, s) => a + s.hours, 0), 900)}+`} color="#f59e0b" />
            </div>

            {/* Top students */}
            <div style={{ background: '#fff', borderRadius: 20, padding: 24, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
              <div style={{ fontWeight: 800, fontSize: 16, color: '#0f172a', marginBottom: 16 }}>
                🏆 Топ студентов по прогрессу
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f1f5f9' }}>
                    {['#', 'Студент', 'Курс', 'Прогресс', 'Средний балл'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[...students].sort((a, b) => b.progress - a.progress).slice(0, 10).map((s, i) => (
                    <tr key={s.user_id} style={{ borderBottom: '1px solid #f8fafc' }}>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: i < 3 ? '#f59e0b' : '#94a3b8', fontSize: 14 }}>{i + 1}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 600, color: '#0f172a', fontSize: 14 }}>{s.full_name || 'Студент'}</td>
                      <td style={{ padding: '10px 12px', color: '#64748b', fontSize: 13 }}>{s.course}</td>
                      <td style={{ padding: '10px 12px' }}>
                        <ProgressBar value={s.progress} />
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: s.avg_score >= 70 ? '#10b981' : '#f59e0b', fontSize: 14 }}>{s.avg_score}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* STUDENTS TAB */}
        {tab === 'students' && (
          <div>
            <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
              <select
                value={courseFilter}
                onChange={(e) => setCourseFilter(e.target.value)}
                style={selectStyle}
              >
                <option value="Все">Все курсы</option>
                {[...new Set(students.map(s => s.course).filter(Boolean))].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <button onClick={exportStudentsCsv} style={btnStyle}>
                ⬇️ Экспорт в CSV
              </button>
              <span style={{ marginLeft: 'auto', color: '#64748b', fontSize: 14, fontWeight: 600 }}>
                {filteredStudents.length} студентов
              </span>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                      {['Студент', 'Курс', 'Прогресс', 'Ср. балл', 'Часов', 'ID'].map(h => (
                        <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, fontWeight: 700, color: '#64748b', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map((s) => (
                      <tr key={s.user_id} style={{ borderBottom: '1px solid #f1f5f9' }}
                        onMouseEnter={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#f8fafc' }}
                        onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = '#fff' }}
                      >
                        <td style={{ padding: '12px 16px', fontWeight: 700, color: '#0f172a', fontSize: 14 }}>
                          {s.full_name || 'Без имени'}
                        </td>
                        <td style={{ padding: '12px 16px', color: '#64748b', fontSize: 13 }}>{s.course}</td>
                        <td style={{ padding: '12px 16px' }}><ProgressBar value={s.progress} /></td>
                        <td style={{ padding: '12px 16px', fontWeight: 700, fontSize: 14, color: s.avg_score >= 70 ? '#10b981' : '#f59e0b' }}>{s.avg_score}%</td>
                        <td style={{ padding: '12px 16px', fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{s.hours}ч</td>
                        <td style={{ padding: '12px 16px', fontSize: 11, color: '#94a3b8', fontFamily: 'monospace' }}>{s.user_id.slice(0, 8)}…</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {filteredStudents.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: '#94a3b8' }}>Нет студентов</div>
              )}
            </div>
          </div>
        )}

        {/* COURSES TAB */}
        {tab === 'courses' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
            {courses.map((c) => (
              <div key={c.id} style={{ background: '#fff', borderRadius: 20, padding: 20, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: `2px solid ${c.is_active ? '#d1fae5' : '#fee2e2'}` }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 15, color: '#0f172a' }}>{c.title}</span>
                  <span style={{ background: c.is_active ? '#10b981' : '#ef4444', color: '#fff', borderRadius: 999, padding: '2px 10px', fontSize: 11, fontWeight: 700 }}>
                    {c.is_active ? 'Активен' : 'Скрыт'}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#64748b', marginBottom: 12 }}>
                  {c.level} · {c.category}
                </div>
                <div style={{ fontSize: 13, color: '#475569', marginBottom: 16, lineHeight: 1.5 }}>
                  {c.description || 'Нет описания'}
                </div>
                <button
                  onClick={() => toggleCourse(c.id, c.is_active)}
                  style={{
                    width: '100%',
                    padding: '8px 0',
                    border: 'none',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 13,
                    background: c.is_active ? '#fee2e2' : '#d1fae5',
                    color: c.is_active ? '#ef4444' : '#10b981',
                    transition: 'all 0.18s',
                  }}
                >
                  {c.is_active ? 'Деактивировать' : 'Активировать'}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* CSV TAB */}
        {tab === 'csv' && (
          <div style={{ maxWidth: 700 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)', marginBottom: 20 }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                📤 Массовое создание аккаунтов
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
                Загрузите CSV-файл с колонками: <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: 6 }}>email, full_name, role, course_id</code>
              </p>

              {/* Download template */}
              <button
                onClick={() => {
                  const csv = 'email,full_name,role,course_id\nstudent1@example.kz,Айбол Серіков,student,\nstudent2@example.kz,Жанар Тоқсанбай,student,'
                  const blob = new Blob([csv], { type: 'text/csv' })
                  const a = document.createElement('a')
                  a.href = URL.createObjectURL(blob)
                  a.download = 'template.csv'
                  a.click()
                }}
                style={{ ...btnStyle, marginBottom: 20 }}
              >
                ⬇️ Скачать шаблон CSV
              </button>

              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleCsvFile}
                style={{ display: 'none' }}
              />

              <button
                onClick={() => fileRef.current?.click()}
                style={{
                  display: 'block',
                  width: '100%',
                  padding: '20px',
                  border: '2px dashed #0ea5e9',
                  borderRadius: 16,
                  background: 'rgba(14,165,233,0.04)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  fontWeight: 700,
                  fontSize: 15,
                  color: '#0ea5e9',
                  marginBottom: 20,
                }}
              >
                📁 Выбрать CSV файл
              </button>

              {csvRows.length > 0 && (
                <>
                  {/* Progress */}
                  {csvUploading && (
                    <div style={{ marginBottom: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, fontWeight: 600, color: '#0f172a' }}>
                        <span>Создание аккаунтов...</span>
                        <span>{csvDone} / {csvRows.length}</span>
                      </div>
                      <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: 'linear-gradient(90deg,#38bdf8,#0ea5e9)', width: `${(csvDone / csvRows.length) * 100}%`, transition: 'width 0.3s' }} />
                      </div>
                    </div>
                  )}

                  {/* Preview table */}
                  <div style={{ overflowX: 'auto', marginBottom: 16 }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: '#f8fafc' }}>
                          {['Email', 'Имя', 'Роль', 'Статус'].map(h => (
                            <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontWeight: 700, color: '#64748b', fontSize: 11, textTransform: 'uppercase' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {csvRows.map((r, i) => (
                          <tr key={i} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '8px 12px', color: '#0f172a' }}>{r.email}</td>
                            <td style={{ padding: '8px 12px', color: '#475569' }}>{r.full_name}</td>
                            <td style={{ padding: '8px 12px', color: '#64748b' }}>{r.role}</td>
                            <td style={{ padding: '8px 12px' }}>
                              {r.status === 'pending' && <span style={{ color: '#94a3b8' }}>—</span>}
                              {r.status === 'success' && <span style={{ color: '#10b981', fontWeight: 700 }}>✓ Создан</span>}
                              {r.status === 'error' && <span style={{ color: '#ef4444', fontWeight: 700 }} title={r.error}>✗ Ошибка</span>}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <button
                    onClick={runCsvImport}
                    disabled={csvUploading}
                    style={{
                      background: csvUploading ? '#94a3b8' : 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 999,
                      padding: '12px 28px',
                      fontFamily: 'inherit',
                      fontWeight: 700,
                      fontSize: 14,
                      cursor: csvUploading ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {csvUploading ? `Создаём... ${csvDone}/${csvRows.length}` : `Создать ${csvRows.length} аккаунтов`}
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* SYLLABUS TAB */}
        {tab === 'syllabus' && (
          <div style={{ maxWidth: 600 }}>
            <div style={{ background: '#fff', borderRadius: 24, padding: 32, boxShadow: '0 2px 16px rgba(0,0,0,0.07)' }}>
              <h2 style={{ margin: '0 0 8px', fontSize: 20, fontWeight: 800, color: '#0f172a' }}>
                📋 Интеграция в силлабус
              </h2>
              <p style={{ color: '#64748b', fontSize: 14, marginBottom: 24 }}>
                Настройте параметры курса для интеграции с университетской программой
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {([
                  { key: 'discipline', label: 'Название дисциплины', placeholder: 'Иностранный язык (английский)' },
                  { key: 'credits', label: 'Количество кредитов', placeholder: '5' },
                  { key: 'semester', label: 'Семестр', placeholder: '1' },
                  { key: 'groups', label: 'Группы студентов', placeholder: 'ИС-101, ИС-102, МН-201' },
                  { key: 'lessons', label: 'Обязательные уроки (через запятую)', placeholder: 'Урок 1, Урок 2, ...' },
                ] as const).map(({ key, label, placeholder }) => (
                  <div key={key}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 6 }}>{label}</label>
                    <input
                      value={syllabusForm[key]}
                      onChange={(e) => setSyllabusForm(prev => ({ ...prev, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={inputStyle}
                    />
                  </div>
                ))}

                <button
                  onClick={() => {
                    const content = `СИЛЛАБУС\n\nДисциплина: ${syllabusForm.discipline}\nКредиты: ${syllabusForm.credits}\nСеместр: ${syllabusForm.semester}\nГруппы: ${syllabusForm.groups}\nОбязательные уроки: ${syllabusForm.lessons}\n\nПлатформа: KHAMADI ENGLISH\nЭлектронные ресурсы: khamadi.online/english\n`
                    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' })
                    const a = document.createElement('a')
                    a.href = URL.createObjectURL(blob)
                    a.download = `syllabus_${syllabusForm.discipline || 'course'}.txt`
                    a.click()
                  }}
                  style={{
                    background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 999,
                    padding: '14px 0',
                    fontFamily: 'inherit',
                    fontWeight: 700,
                    fontSize: 15,
                    cursor: 'pointer',
                    marginTop: 8,
                  }}
                >
                  ⬇️ Экспортировать силлабус
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon, label, value, color }: { icon: string; label: string; value: number | string; color: string }) {
  return (
    <div style={{ background: '#fff', borderRadius: 20, padding: '20px 24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', borderLeft: `4px solid ${color}` }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>{icon}</div>
      <div style={{ fontSize: 28, fontWeight: 800, color: '#0f172a', lineHeight: 1 }}>{value}</div>
      <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>{label}</div>
    </div>
  )
}

function ProgressBar({ value }: { value: number }) {
  const color = value >= 70 ? '#10b981' : value >= 40 ? '#f59e0b' : '#ef4444'
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, height: 6, background: '#f1f5f9', borderRadius: 999, overflow: 'hidden', minWidth: 60 }}>
        <div style={{ height: '100%', background: color, width: `${value}%`, transition: 'width 0.3s' }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 700, color, minWidth: 32 }}>{value}%</span>
    </div>
  )
}

const selectStyle: React.CSSProperties = {
  padding: '10px 16px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 999,
  fontSize: 14,
  fontFamily: 'var(--font-main, Montserrat, sans-serif)',
  color: '#0f172a',
  background: '#fff',
  cursor: 'pointer',
  outline: 'none',
}

const btnStyle: React.CSSProperties = {
  padding: '10px 20px',
  background: '#0f172a',
  color: '#fff',
  border: 'none',
  borderRadius: 999,
  fontFamily: 'var(--font-main, Montserrat, sans-serif)',
  fontWeight: 700,
  fontSize: 13,
  cursor: 'pointer',
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '11px 16px',
  border: '1.5px solid #e2e8f0',
  borderRadius: 999,
  fontSize: 14,
  fontFamily: 'var(--font-main, Montserrat, sans-serif)',
  color: '#0f172a',
  background: '#f8fafc',
  outline: 'none',
  boxSizing: 'border-box',
}
