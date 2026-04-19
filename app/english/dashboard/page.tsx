'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

type Course = {
  id: string
  title: string
  level: string
  category: string
  description: string | null
}

type Certificate = {
  id: string
  course_id: string
  certificate_number: string
  issued_at: string
  course_title?: string
}

type UserRole = {
  full_name: string | null
  role: string
  purpose?: string | null
}

type ProgressRow = {
  lesson_id: string
  completed: boolean
}

type Section =
  | 'home'
  | 'courses'
  | 'roadmap'
  | 'practice'
  | 'tests'
  | 'ai'
  | 'weak_topics'
  | 'progress'
  | 'planner'
  | 'achievements'
  | 'ranking'
  | 'certificates'
  | 'profile'

const COURSE_ICONS: Record<string, string> = {
  'A1 Beginner': '🌱',
  'A2 Elementary': '📗',
  'B1 Intermediate': '📘',
  'B2 Upper-Intermediate': '📙',
  'C1 Advanced': '🏆',
  Accounting: '🧾',
  'Computer Science': '💻',
  Hospitality: '🏨',
  Management: '📊',
  'Finance Industry': '💰',
  'Social Sciences': '🧠',
  Law: '⚖️',
}

const PURPOSE_TO_TITLE: Record<string, string> = {
  accounting: 'Accounting',
  computer_science: 'Computer Science',
  hospitality: 'Hospitality',
  management: 'Management',
  finance_industry: 'Finance Industry',
  social_sciences: 'Social Sciences',
  law: 'Law',
}

const SIDEBAR_ITEMS: { key: Section; icon: string; label: string }[] = [
  { key: 'home', icon: '🏠', label: 'Главная' },
  { key: 'courses', icon: '📚', label: 'Мои курсы' },
  { key: 'roadmap', icon: '🎯', label: 'Learning Roadmap' },
  { key: 'practice', icon: '💡', label: 'Practice Center' },
  { key: 'tests', icon: '📝', label: 'Тесты' },
  { key: 'ai', icon: '🤖', label: 'AI Tutor' },
  { key: 'weak_topics', icon: '⚠️', label: 'Weak Topics' },
  { key: 'progress', icon: '📈', label: 'Progress' },
  { key: 'planner', icon: '📅', label: 'Study Planner' },
  { key: 'achievements', icon: '🏆', label: 'Achievements' },
  { key: 'ranking', icon: '🥇', label: 'Ranking' },
  { key: 'certificates', icon: '📜', label: 'Certificates' },
  { key: 'profile', icon: '⚙️', label: 'Profile' },
]

function getSelectedTrackTitle(purpose?: string | null) {
  if (!purpose) return null
  return PURPOSE_TO_TITLE[purpose] || null
}

export default function EnglishDashboardPage() {
  const router = useRouter()
  const hasLoaded = useRef(false)

  const [section, setSection] = useState<Section>('home')
  const [courses, setCourses] = useState<Course[]>([])
  const [userRole, setUserRole] = useState<UserRole | null>(null)
  const [progress, setProgress] = useState<ProgressRow[]>([])
  const [certs, setCerts] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)
  const [notifCount, setNotifCount] = useState(0)

  useEffect(() => {
    if (hasLoaded.current) return
    hasLoaded.current = true
    load()
  }, [])

  async function load() {
    try {
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError) {
        router.push('/english/login')
        return
      }

      const user = session?.user

      if (!user) {
        router.push('/english/login')
        return
      }

      const [roleRes, coursesRes, progressRes, certsRes] = await Promise.all([
        supabase
          .from('english_user_roles')
          .select('full_name, role, purpose')
          .eq('user_id', user.id)
          .maybeSingle(),

        supabase
          .from('english_courses')
          .select('id, title, level, category, description')
          .eq('is_active', true)
          .order('category')
          .order('level'),

        supabase
          .from('english_progress')
          .select('lesson_id, completed')
          .eq('user_id', user.id),

        supabase
          .from('english_certificates')
          .select('id, course_id, certificate_number, issued_at')
          .eq('user_id', user.id),
      ])

      let roleData = roleRes.data as UserRole | null

      if (!roleData?.role) {
        const { data: inserted } = await supabase
          .from('english_user_roles')
          .insert({ user_id: user.id, role: 'student', full_name: user.email ?? '' })
          .select('full_name, role, purpose')
          .single()
        roleData = inserted as UserRole | null
      }

      // If still no role (RLS blocked insert), default to student
      if (!roleData?.role) {
        roleData = { full_name: user.email ?? '', role: 'student', purpose: null }
      }

      if (roleData.role === 'teacher') {
        router.push('/english/teacher')
        return
      }

      const loadedCourses = (coursesRes.data || []) as Course[]
      const loadedProgress = (progressRes.data || []) as ProgressRow[]
      const rawCerts = (certsRes.data || []) as Certificate[]
      const courseMap = new Map(loadedCourses.map((c) => [c.id, c.title]))

      setUserRole(roleData)
      setCourses(loadedCourses)
      setProgress(loadedProgress)
      setCerts(
        rawCerts.map((c) => ({
          ...c,
          course_title: courseMap.get(c.course_id) || '',
        }))
      )

      // Load unread notification count
      const { count: unreadCount } = await supabase
        .from('english_notifications')
        .select('id', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('is_read', false)
      setNotifCount(unreadCount || 0)
    } catch (e) {
      console.error(e)
      router.push('/english/login')
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/english')
  }

  const firstName = userRole?.full_name?.trim().split(' ')[0] || 'Студент'
  const selectedTrackTitle = getSelectedTrackTitle(userRole?.purpose)

  const generalCourses = useMemo(
    () => courses.filter((c) => c.category === 'General English'),
    [courses]
  )

  const specialCourses = useMemo(
    () => courses.filter((c) => c.category === 'English for Special Purposes'),
    [courses]
  )

  const selectedTrackCourse = useMemo(() => {
    if (!selectedTrackTitle) return null
    return specialCourses.find((c) => c.title === selectedTrackTitle) || null
  }, [selectedTrackTitle, specialCourses])

  const otherSpecialCourses = useMemo(() => {
    if (!selectedTrackTitle) return specialCourses
    return specialCourses.filter((c) => c.title !== selectedTrackTitle)
  }, [selectedTrackTitle, specialCourses])

  const completedCount = progress.filter((p) => p.completed).length
  const progressPercent =
    courses.length > 0
      ? Math.min(100, Math.round((completedCount / Math.max(courses.length * 4, 1)) * 100))
      : 0

  const weeklyGoal = 3
  const weeklyCompleted = Math.min(completedCount % 5, weeklyGoal)
  const streak = Math.min(12, Math.max(3, completedCount || 3))
  const xp = completedCount * 120 + certs.length * 450 + 180

  if (loading) {
    return (
      <div className="loading-page">
        <div className="loading-spinner" />
        <div className="loading-text">Загрузка dashboard...</div>

        <style>{`
          .loading-page{
            min-height:100vh;
            display:flex;
            flex-direction:column;
            align-items:center;
            justify-content:center;
            background:linear-gradient(180deg,#f8fcff 0%,#eef8ff 48%,#ffffff 100%);
          }
          .loading-spinner{
            width:46px;
            height:46px;
            border-radius:50%;
            border:4px solid rgba(14,165,233,0.14);
            border-top-color:#0ea5e9;
            animation:spin .8s linear infinite;
            margin-bottom:16px;
          }
          .loading-text{
            color:#64748b;
            font-size:14px;
            font-weight:800;
          }
          @keyframes spin{to{transform:rotate(360deg)}}
        `}</style>
      </div>
    )
  }

  return (
    <div className="dashboard-page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      <div className="grid-overlay" />

      <aside className="sidebar">
        <div className="sidebar-inner">
          <div className="sidebar-brand">
            <div className="brand-mark">🇬🇧</div>
            <div>
              <div className="brand-title">KHAMADI</div>
              <div className="brand-subtitle">ENGLISH PLATFORM</div>
            </div>
          </div>

          <div className="sidebar-user">
            <div className="user-avatar">{firstName.charAt(0).toUpperCase()}</div>
            <div className="user-copy">
              <div className="user-greeting">Добро пожаловать,</div>
              <div className="user-name">{firstName}</div>
              <div className="user-role">🎓 Student account</div>
            </div>
          </div>

          <div className="sidebar-track">
            <div className="sidebar-track-label">Основной трек</div>
            <div className="sidebar-track-title">{selectedTrackTitle || 'Не выбран'}</div>
            <div className="sidebar-track-sub">База: General English</div>
          </div>

          <nav className="sidebar-nav">
            {SIDEBAR_ITEMS.map((item) => (
              <button
                key={item.key}
                onClick={() => item.key === 'certificates' ? router.push('/english/certificate') : setSection(item.key)}
                className={`sidebar-item ${section === item.key ? 'active' : ''}`}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-text">{item.label}</span>
              </button>
            ))}

            <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '8px 0' }} />

            <button
              onClick={() => router.push('/english/progress')}
              className="sidebar-item"
            >
              <span className="sidebar-icon">📊</span>
              <span className="sidebar-text">Мой прогресс</span>
            </button>

            <button
              onClick={() => router.push('/english/textbooks')}
              className="sidebar-item"
            >
              <span className="sidebar-icon">📖</span>
              <span className="sidebar-text">Учебники</span>
            </button>

            <button
              onClick={() => router.push('/english/support')}
              className="sidebar-item"
            >
              <span className="sidebar-icon">🛟</span>
              <span className="sidebar-text">Поддержка</span>
            </button>

            <button
              onClick={() => router.push('/english/notifications')}
              className="sidebar-item"
              style={{ position: 'relative' }}
            >
              <span className="sidebar-icon">🔔</span>
              <span className="sidebar-text">Уведомления</span>
              {notifCount > 0 && (
                <span style={{
                  marginLeft: 'auto',
                  background: '#ef4444',
                  color: '#fff',
                  borderRadius: 999,
                  fontSize: 11,
                  fontWeight: 700,
                  padding: '1px 7px',
                  minWidth: 20,
                  textAlign: 'center',
                }}>
                  {notifCount > 99 ? '99+' : notifCount}
                </span>
              )}
            </button>
          </nav>

          <div className="sidebar-footer">
            <button className="logout-btn" onClick={handleLogout}>
              🚪 Выйти
            </button>
          </div>
        </div>
      </aside>

      <main className="main-content">
        {section === 'home' && (
          <div className="content-stack">
            <section className="hero-card">
              <div className="hero-glow" />
              <div className="hero-copy">
                <div className="hero-kicker">Student Dashboard</div>
                <h1 className="hero-heading">
                  {firstName}, ваш английский
                  <br />
                  <span>движется в сильном темпе</span>
                </h1>
                <p className="hero-text">
                  Ваше основное направление — <strong>{selectedTrackTitle || 'не выбрано'}</strong>. 
                  General English остаётся базовой линией подготовки и усиливает основной трек.
                </p>

                <div className="hero-tags">
                  <span className="hero-tag">🎯 Основное направление: {selectedTrackTitle || '—'}</span>
                  <span className="hero-tag">📘 База: General English</span>
                </div>
              </div>

              <div className="hero-side">
                <div className="mini-glass-card">
                  <div className="mini-label">Weekly Goal</div>
                  <div className="mini-value">
                    {weeklyCompleted}/{weeklyGoal}
                  </div>
                  <div className="progress-track">
                    <div
                      className="progress-fill"
                      style={{ width: `${(weeklyCompleted / weeklyGoal) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="mini-glass-card">
                  <div className="mini-label">Streak</div>
                  <div className="mini-value">{streak} дней</div>
                  <div className="mini-note">Серия обучения растёт</div>
                </div>
              </div>
            </section>

            <section className="stats-grid">
              {[
                { label: 'Доступно курсов', value: courses.length, icon: '📚', href: undefined },
                { label: 'Завершено уроков', value: completedCount, icon: '✅', href: undefined },
                { label: 'Сертификаты', value: certs.length, icon: '📜', href: '/english/certificate' },
                { label: 'Общий прогресс', value: `${progressPercent}%`, icon: '📈', href: undefined },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="stat-card"
                  onClick={() => stat.href && router.push(stat.href)}
                  style={stat.href ? { cursor: 'pointer' } : undefined}
                >
                  <div className="stat-top">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </section>

            <section className="dashboard-grid">
              <div className="main-column">
                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <div className="panel-kicker">Основное направление</div>
                      <div className="panel-title">
                        {selectedTrackTitle || 'Направление не выбрано'}
                      </div>
                    </div>
                    <span className="pill">Main Track</span>
                  </div>

                  {selectedTrackCourse ? (
                    <div className="course-focus-card">
                      <div className="focus-icon">
                        {COURSE_ICONS[selectedTrackCourse.title] || '📘'}
                      </div>
                      <div className="focus-copy">
                        <div className="focus-title">{selectedTrackCourse.title}</div>
                        <div className="focus-text">
                          {selectedTrackCourse.description || 'Ваш главный фокус внутри платформы.'}
                        </div>
                        <button
                          className="primary-btn"
                          onClick={() => router.push(`/english/course/${selectedTrackCourse.id}`)}
                        >
                          Открыть направление →
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="empty-box">
                      Пока основное направление не найдено среди активных курсов.
                    </div>
                  )}
                </div>

                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <div className="panel-kicker">Базовая подготовка</div>
                      <div className="panel-title">General English</div>
                    </div>
                    <span className="pill light">Foundation</span>
                  </div>

                  <div className="course-grid">
                    {generalCourses.length > 0 ? (
                      generalCourses.map((c) => (
                        <button
                          key={c.id}
                          className="course-card"
                          onClick={() => router.push(`/english/course/${c.id}`)}
                        >
                          <div className="course-card-top">
                            <div className="course-card-icon">
                              {COURSE_ICONS[c.title] || '📘'}
                            </div>
                            <span className="course-badge">{c.level || 'CEFR'}</span>
                          </div>
                          <div className="course-card-title">{c.title}</div>
                          <div className="course-card-text">
                            {c.description || 'Базовая линия общего английского языка.'}
                          </div>
                          <div className="course-card-link">Открыть курс →</div>
                        </button>
                      ))
                    ) : (
                      <div className="empty-box">Курсы General English пока не добавлены.</div>
                    )}
                  </div>
                </div>

                <div className="panel-card">
                  <div className="panel-head">
                    <div>
                      <div className="panel-kicker">Learning Roadmap</div>
                      <div className="panel-title">Ваш путь обучения</div>
                    </div>
                  </div>

                  <div className="roadmap">
                    {[
                      { title: 'General English Foundation', status: 'active', text: 'База языка, грамматика, понимание и словарь.' },
                      { title: selectedTrackTitle || 'Special Purpose Track', status: 'active', text: 'Ваше выбранное направление для профессионального фокуса.' },
                      { title: 'Practice & Tests', status: 'next', text: 'Углублённая практика, quiz, контроль знаний.' },
                      { title: 'Certificate Milestone', status: 'next', text: 'Завершение курса и выход на сертификат.' },
                    ].map((item, i) => (
                      <div key={item.title} className="roadmap-item">
                        <div className={`roadmap-dot ${item.status}`} />
                        <div className="roadmap-line-wrap">
                          {i !== 3 && <div className="roadmap-line" />}
                        </div>
                        <div className="roadmap-copy">
                          <div className="roadmap-title">{item.title}</div>
                          <div className="roadmap-text">{item.text}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="side-column">
                <div className="widget-card">
                  <div className="widget-kicker">XP & Level</div>
                  <div className="widget-value">{xp} XP</div>
                  <div className="widget-note">Ваш текущий уровень прогресса</div>
                </div>

                <div className="widget-card">
                  <div className="widget-kicker">AI Tutor</div>
                  <div className="widget-title">Умная помощь</div>
                  <div className="widget-note">
                    AI может подсказать, что учить дальше, и объяснить ошибки.
                  </div>
                  <button className="secondary-btn" onClick={() => setSection('ai')}>
                    Открыть AI Tutor
                  </button>
                </div>

                <div className="widget-card">
                  <div className="widget-kicker">Study Planner</div>
                  <div className="widget-title">План недели</div>
                  <div className="planner-list">
                    <div>Пн — Reading practice</div>
                    <div>Ср — Quiz + vocabulary</div>
                    <div>Пт — Listening + review</div>
                  </div>
                </div>

                <div className="widget-card">
                  <div className="widget-kicker">Achievements</div>
                  <div className="badges">
                    <span className="badge-chip">🔥 7+ streak</span>
                    <span className="badge-chip">📘 10 lessons</span>
                    <span className="badge-chip">🏆 First milestone</span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {section === 'courses' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Мои курсы</div>
              <h1 className="page-title">Ваши направления обучения</h1>
            </div>

            {selectedTrackCourse && (
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <div className="panel-kicker">Основное направление</div>
                    <div className="panel-title">{selectedTrackCourse.title}</div>
                  </div>
                </div>

                <div className="course-focus-card">
                  <div className="focus-icon">
                    {COURSE_ICONS[selectedTrackCourse.title] || '📘'}
                  </div>
                  <div className="focus-copy">
                    <div className="focus-title">{selectedTrackCourse.title}</div>
                    <div className="focus-text">
                      {selectedTrackCourse.description || 'Ваш главный фокус в платформе.'}
                    </div>
                    <button
                      className="primary-btn"
                      onClick={() => router.push(`/english/course/${selectedTrackCourse.id}`)}
                    >
                      Открыть курс →
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div className="panel-card">
              <div className="panel-head">
                <div>
                  <div className="panel-kicker">Базовая подготовка</div>
                  <div className="panel-title">General English</div>
                </div>
              </div>

              <div className="course-grid">
                {generalCourses.map((c) => (
                  <button
                    key={c.id}
                    className="course-card"
                    onClick={() => router.push(`/english/course/${c.id}`)}
                  >
                    <div className="course-card-top">
                      <div className="course-card-icon">
                        {COURSE_ICONS[c.title] || '📘'}
                      </div>
                      <span className="course-badge">{c.level || 'CEFR'}</span>
                    </div>
                    <div className="course-card-title">{c.title}</div>
                    <div className="course-card-text">
                      {c.description || 'Общий английский для фундаментальной подготовки.'}
                    </div>
                    <div className="course-card-link">Открыть курс →</div>
                  </button>
                ))}
              </div>
            </div>

            {otherSpecialCourses.length > 0 && (
              <div className="panel-card">
                <div className="panel-head">
                  <div>
                    <div className="panel-kicker">Дополнительные направления</div>
                    <div className="panel-title">English for Special Purposes</div>
                  </div>
                </div>

                <div className="course-grid">
                  {otherSpecialCourses.map((c) => (
                    <button
                      key={c.id}
                      className="course-card"
                      onClick={() => router.push(`/english/course/${c.id}`)}
                    >
                      <div className="course-card-top">
                        <div className="course-card-icon">
                          {COURSE_ICONS[c.title] || '📚'}
                        </div>
                        <span className="course-badge">Special</span>
                      </div>
                      <div className="course-card-title">{c.title}</div>
                      <div className="course-card-text">
                        {c.description || 'Дополнительное профессиональное направление.'}
                      </div>
                      <div className="course-card-link">Открыть курс →</div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {section === 'roadmap' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Learning Roadmap</div>
              <h1 className="page-title">Путь обучения</h1>
            </div>

            <div className="panel-card">
              <div className="roadmap large">
                {[
                  ['General English', 'Базовое ядро языка', 'completed'],
                  [selectedTrackTitle || 'Special Purpose', 'Основное профессиональное направление', 'active'],
                  ['Practice Center', 'Ежедневная практика навыков', 'next'],
                  ['Tests & Review', 'Контроль знаний и закрепление', 'next'],
                  ['Certificate', 'Финальная веха обучения', 'next'],
                ].map(([title, text, status], i) => (
                  <div key={title} className="roadmap-item">
                    <div className={`roadmap-dot ${status}`} />
                    <div className="roadmap-line-wrap">
                      {i !== 4 && <div className="roadmap-line" />}
                    </div>
                    <div className="roadmap-copy">
                      <div className="roadmap-title">{title}</div>
                      <div className="roadmap-text">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'practice' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Practice Center</div>
              <h1 className="page-title">Центр практики</h1>
            </div>

            <div className="mini-grid">
              {[
                ['📖', 'Reading Practice', 'Работа с текстами и пониманием'],
                ['✍️', 'Writing Practice', 'Структура письменной речи'],
                ['🎧', 'Listening Practice', 'Понимание аудио и живой речи'],
                ['🗣️', 'Speaking Practice', 'Речевая уверенность'],
              ].map(([icon, title, text]) => (
                <div key={title} className="panel-card small-pad">
                  <div className="mini-card-icon">{icon}</div>
                  <div className="mini-card-title">{title}</div>
                  <div className="mini-card-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'tests' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Тесты</div>
              <h1 className="page-title">Quiz и проверка знаний</h1>
            </div>

            <div className="panel-card">
              <div className="tests-list">
                {[
                  ['General English Quiz 1', 'Последний результат: 86%'],
                  ['Accounting Vocabulary Test', 'Последний результат: 78%'],
                  ['Listening Check', 'Последний результат: 82%'],
                ].map(([title, result]) => (
                  <div key={title} className="test-item">
                    <div>
                      <div className="test-title">{title}</div>
                      <div className="test-text">{result}</div>
                    </div>
                    <button className="secondary-btn">Открыть</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'ai' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">AI Tutor</div>
              <h1 className="page-title">Умный помощник</h1>
            </div>

            <div className="panel-card ai-card">
              <div className="ai-box">
                <div className="ai-message user">
                  Объясни разницу между Present Perfect и Past Simple
                </div>
                <div className="ai-message bot">
                  Present Perfect связывает действие с настоящим, а Past Simple говорит о завершённом действии в прошлом.
                  Я могу ещё показать примеры именно для вашего направления: <strong>{selectedTrackTitle || 'General English'}</strong>.
                </div>
              </div>
            </div>
          </div>
        )}

        {section === 'weak_topics' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Weak Topics</div>
              <h1 className="page-title">Темы для повторения</h1>
            </div>

            <div className="panel-card">
              <div className="weak-list">
                {[
                  ['Grammar Precision', 'Есть ошибки в временах и структуре предложений'],
                  ['Vocabulary Range', 'Нужно расширить словарный запас по направлению'],
                  ['Listening Accuracy', 'Есть потери смысла в быстром аудио'],
                ].map(([title, text]) => (
                  <div key={title} className="weak-item">
                    <div className="weak-icon">⚠️</div>
                    <div>
                      <div className="weak-title">{title}</div>
                      <div className="weak-text">{text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'progress' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Progress</div>
              <h1 className="page-title">Ваш прогресс</h1>
            </div>

            <div className="stats-grid">
              {[
                { label: 'Завершено уроков', value: completedCount, icon: '✅' },
                { label: 'Общий прогресс', value: `${progressPercent}%`, icon: '📈' },
                { label: 'Серия дней', value: streak, icon: '🔥' },
                { label: 'XP', value: xp, icon: '⚡' },
              ].map((stat) => (
                <div key={stat.label} className="stat-card">
                  <div className="stat-top">
                    <span className="stat-icon">{stat.icon}</span>
                    <span className="stat-label">{stat.label}</span>
                  </div>
                  <div className="stat-value">{stat.value}</div>
                </div>
              ))}
            </div>

            <div className="panel-card">
              <div className="panel-title" style={{ marginBottom: 14 }}>Последняя активность</div>
              {progress.length === 0 ? (
                <div className="empty-box">Пока нет данных по прогрессу.</div>
              ) : (
                <div className="progress-list">
                  {progress.slice(0, 12).map((p, i) => (
                    <div key={`${p.lesson_id}-${i}`} className="progress-item">
                      <div>
                        <div className="test-title">Урок {i + 1}</div>
                        <div className="test-text">
                          {p.completed ? 'Урок завершён успешно' : 'Урок в процессе'}
                        </div>
                      </div>
                      <span className={`status-pill ${p.completed ? 'done' : 'pending'}`}>
                        {p.completed ? '✓ Завершён' : 'В процессе'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {section === 'planner' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Study Planner</div>
              <h1 className="page-title">План обучения</h1>
            </div>

            <div className="panel-card">
              <div className="planner-grid">
                {[
                  ['Понедельник', 'Reading + vocabulary'],
                  ['Среда', 'Grammar + quiz'],
                  ['Пятница', 'Listening + revision'],
                  ['Воскресенье', 'Progress review'],
                ].map(([day, plan]) => (
                  <div key={day} className="planner-card">
                    <div className="planner-day">{day}</div>
                    <div className="planner-plan">{plan}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'achievements' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Achievements</div>
              <h1 className="page-title">Ваши достижения</h1>
            </div>

            <div className="mini-grid">
              {[
                ['🔥', '7-Day Streak', 'Удерживайте серию обучения'],
                ['📘', '10 Lessons Completed', 'Первые серьёзные шаги'],
                ['🏆', 'Milestone Reached', 'Выход на новый уровень'],
                ['⚡', 'XP Booster', 'Активное продвижение в платформе'],
              ].map(([icon, title, text]) => (
                <div key={title} className="panel-card small-pad">
                  <div className="mini-card-icon">{icon}</div>
                  <div className="mini-card-title">{title}</div>
                  <div className="mini-card-text">{text}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {section === 'ranking' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Ranking</div>
              <h1 className="page-title">Рейтинг студентов</h1>
            </div>

            <div className="panel-card">
              <div className="ranking-list">
                {[
                  ['1', 'Aruzhan', '3 450 XP'],
                  ['2', 'Nursultan', '3 180 XP'],
                  ['3', firstName, `${xp} XP`],
                  ['4', 'Madina', '2 840 XP'],
                ].map(([place, name, score]) => (
                  <div key={`${place}-${name}`} className="ranking-item">
                    <div className="ranking-left">
                      <div className="ranking-place">{place}</div>
                      <div className="ranking-name">{name}</div>
                    </div>
                    <div className="ranking-score">{score}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {section === 'certificates' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Certificates</div>
              <h1 className="page-title">Ваши сертификаты</h1>
            </div>

            {certs.length === 0 ? (
              <div className="panel-card">
                <div className="empty-box large">
                  <div className="empty-icon">📜</div>
                  <div className="empty-title">Пока нет сертификатов</div>
                  <div className="empty-text">
                    Завершите курс, чтобы получить сертификат.
                  </div>
                </div>
              </div>
            ) : (
              <div className="course-grid">
                {certs.map((cert) => (
                  <div key={cert.id} className="course-card static">
                    <div className="course-card-top">
                      <div className="course-card-icon">🏆</div>
                      <span className="course-badge">Certificate</span>
                    </div>
                    <div className="course-card-title">{cert.course_title || 'Course'}</div>
                    <div className="course-card-text">
                      № {cert.certificate_number}
                      <br />
                      Выдан: {new Date(cert.issued_at).toLocaleDateString('ru-RU')}
                    </div>
                    <button
                      className="primary-btn block"
                      onClick={() => router.push(`/english/certificate/${cert.id}`)}
                    >
                      Просмотреть →
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {section === 'profile' && (
          <div className="content-stack">
            <div className="page-head">
              <div className="section-kicker">Profile</div>
              <h1 className="page-title">Профиль пользователя</h1>
            </div>

            <div className="panel-card">
              <div className="profile-grid">
                <div className="profile-row">
                  <span>Имя</span>
                  <strong>{userRole?.full_name || '—'}</strong>
                </div>
                <div className="profile-row">
                  <span>Роль</span>
                  <strong>Студент</strong>
                </div>
                <div className="profile-row">
                  <span>Основное направление</span>
                  <strong>{selectedTrackTitle || '—'}</strong>
                </div>
                <div className="profile-row">
                  <span>Базовая подготовка</span>
                  <strong>General English</strong>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .dashboard-page{
          min-height:100vh;
          background:linear-gradient(180deg,#f8fcff 0%,#eef8ff 48%,#ffffff 100%);
          display:grid;
          grid-template-columns:320px 1fr;
          position:relative;
        }

        .bg-orb{
          position:absolute;
          border-radius:999px;
          filter:blur(110px);
          pointer-events:none;
          z-index:0;
        }

        .orb-1{
          width:320px;
          height:320px;
          background:rgba(56,189,248,0.14);
          top:40px;
          left:-80px;
        }

        .orb-2{
          width:360px;
          height:360px;
          background:rgba(14,165,233,0.10);
          top:180px;
          right:-120px;
        }

        .orb-3{
          width:260px;
          height:260px;
          background:rgba(125,211,252,0.14);
          bottom:40px;
          left:24%;
        }

        .grid-overlay{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size:62px 62px;
          mask-image:linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 92%);
          pointer-events:none;
          z-index:0;
        }

        .sidebar{
          position:sticky;
          top:0;
          height:100vh;
          padding:18px 16px;
          z-index:2;
          align-self:start;
        }

        .sidebar-inner{
          height:100%;
          border-radius:34px;
          background:linear-gradient(180deg, rgba(255,255,255,0.9), rgba(240,249,255,0.97));
          border:1px solid rgba(14,165,233,0.12);
          box-shadow:
            0 24px 60px rgba(14,165,233,0.10),
            inset 0 1px 0 rgba(255,255,255,0.6);
          backdrop-filter:blur(20px);
          display:flex;
          flex-direction:column;
          padding:18px;
          overflow:hidden;
        }

        .sidebar-brand{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:18px;
          padding:4px 4px 0;
        }

        .brand-mark{
          width:52px;
          height:52px;
          border-radius:18px;
          background:linear-gradient(135deg,#38bdf8,#0ea5e9);
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 14px 34px rgba(14,165,233,0.22);
          color:#fff;
          font-size:20px;
        }

        .brand-title{
          font-size:18px;
          font-weight:900;
          color:#0f172a;
          line-height:1.05;
          letter-spacing:-0.05em;
        }

        .brand-subtitle{
          font-size:10px;
          font-weight:900;
          color:#0ea5e9;
          letter-spacing:0.14em;
          text-transform:uppercase;
          margin-top:4px;
        }

        .sidebar-user{
          padding:16px;
          border-radius:24px;
          background:rgba(255,255,255,0.82);
          border:1px solid rgba(14,165,233,0.10);
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:14px;
        }

        .user-avatar{
          width:52px;
          height:52px;
          border-radius:18px;
          background:linear-gradient(135deg,#38bdf8,#0ea5e9);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          font-weight:900;
          font-size:20px;
          box-shadow:0 12px 28px rgba(14,165,233,0.18);
          flex-shrink:0;
        }

        .user-copy{
          min-width:0;
        }

        .user-greeting{
          font-size:11px;
          color:#64748b;
          font-weight:700;
        }

        .user-name{
          font-size:16px;
          color:#0f172a;
          font-weight:900;
          margin:3px 0 4px;
          letter-spacing:-0.03em;
        }

        .user-role{
          font-size:11px;
          color:#0ea5e9;
          font-weight:800;
        }

        .sidebar-track{
          padding:14px 16px;
          border-radius:22px;
          background:linear-gradient(135deg, rgba(56,189,248,0.10), rgba(255,255,255,0.92));
          border:1px solid rgba(14,165,233,0.10);
          margin-bottom:14px;
        }

        .sidebar-track-label{
          font-size:10px;
          font-weight:900;
          color:#0ea5e9;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:6px;
        }

        .sidebar-track-title{
          font-size:16px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:4px;
          line-height:1.2;
        }

        .sidebar-track-sub{
          font-size:12px;
          color:#64748b;
          font-weight:700;
        }

        .sidebar-nav{
          flex:1;
          overflow:auto;
          display:flex;
          flex-direction:column;
          gap:7px;
          padding-right:4px;
        }

        .sidebar-item{
          border:none;
          background:transparent;
          border-radius:18px;
          min-height:50px;
          padding:0 14px;
          display:flex;
          align-items:center;
          gap:12px;
          cursor:pointer;
          font-size:14px;
          font-weight:800;
          color:#334155;
          transition:all .22s ease;
          text-align:left;
        }

        .sidebar-item:hover{
          background:rgba(56,189,248,0.08);
          transform:translateX(3px);
        }

        .sidebar-item.active{
          background:linear-gradient(135deg, rgba(56,189,248,0.12), rgba(255,255,255,0.94));
          border:1px solid rgba(14,165,233,0.12);
          color:#0369a1;
          box-shadow:0 12px 28px rgba(14,165,233,0.08);
        }

        .sidebar-icon{
          width:22px;
          text-align:center;
          flex-shrink:0;
        }

        .sidebar-text{
          white-space:nowrap;
        }

        .sidebar-footer{
          padding-top:12px;
        }

        .logout-btn{
          width:100%;
          min-height:50px;
          border:none;
          border-radius:18px;
          background:rgba(239,68,68,0.08);
          color:#dc2626;
          font-size:14px;
          font-weight:900;
          cursor:pointer;
          transition:all .22s ease;
        }

        .logout-btn:hover{
          transform:translateY(-1px);
          background:rgba(239,68,68,0.12);
        }

        .main-content{
          padding:28px 28px 36px 8px;
          position:relative;
          z-index:2;
          overflow-y:auto;
        }

        .content-stack{
          display:flex;
          flex-direction:column;
          gap:22px;
        }

        .hero-card{
          position:relative;
          overflow:hidden;
          border-radius:34px;
          padding:30px;
          background:linear-gradient(135deg,#0ea5e9 0%, #38bdf8 50%, #e0f2fe 100%);
          border:1px solid rgba(255,255,255,0.24);
          box-shadow:0 24px 60px rgba(14,165,233,0.16);
          display:grid;
          grid-template-columns:1.2fr .8fr;
          gap:18px;
        }

        .hero-glow{
          position:absolute;
          top:-70px;
          right:-50px;
          width:240px;
          height:240px;
          border-radius:50%;
          background:rgba(255,255,255,0.14);
          filter:blur(40px);
          pointer-events:none;
        }

        .hero-copy, .hero-side{
          position:relative;
          z-index:1;
        }

        .hero-kicker{
          font-size:12px;
          font-weight:900;
          color:rgba(255,255,255,0.88);
          letter-spacing:0.14em;
          text-transform:uppercase;
          margin-bottom:10px;
        }

        .hero-heading{
          font-size:clamp(30px,4vw,52px);
          line-height:1.02;
          letter-spacing:-0.06em;
          color:#fff;
          font-weight:900;
          margin:0 0 14px;
          max-width:700px;
        }

        .hero-heading span{
          color:#e0f7ff;
        }

        .hero-text{
          font-size:15px;
          line-height:1.8;
          color:rgba(255,255,255,0.92);
          margin:0 0 18px;
          max-width:720px;
          font-weight:600;
        }

        .hero-tags{
          display:flex;
          gap:10px;
          flex-wrap:wrap;
        }

        .hero-tag{
          display:inline-flex;
          align-items:center;
          padding:8px 14px;
          border-radius:999px;
          font-size:12px;
          font-weight:800;
          background:rgba(255,255,255,0.16);
          border:1px solid rgba(255,255,255,0.22);
          color:#fff;
          backdrop-filter:blur(10px);
        }

        .hero-side{
          display:flex;
          flex-direction:column;
          gap:12px;
          justify-content:center;
        }

        .mini-glass-card{
          padding:18px;
          border-radius:22px;
          background:rgba(255,255,255,0.14);
          border:1px solid rgba(255,255,255,0.18);
          backdrop-filter:blur(10px);
        }

        .mini-label{
          font-size:11px;
          font-weight:800;
          color:rgba(255,255,255,0.78);
          letter-spacing:.08em;
          text-transform:uppercase;
          margin-bottom:8px;
        }

        .mini-value{
          font-size:28px;
          font-weight:900;
          color:#fff;
          line-height:1;
          margin-bottom:10px;
        }

        .mini-note{
          font-size:12px;
          color:rgba(255,255,255,0.82);
          font-weight:600;
        }

        .progress-track{
          width:100%;
          height:8px;
          border-radius:999px;
          background:rgba(255,255,255,0.18);
          overflow:hidden;
        }

        .progress-fill{
          height:100%;
          border-radius:999px;
          background:linear-gradient(90deg,#ffffff,#dff7ff);
          box-shadow:0 0 16px rgba(255,255,255,0.4);
        }

        .stats-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:14px;
        }

        .stat-card{
          border-radius:24px;
          padding:18px;
          background:rgba(255,255,255,0.84);
          border:1px solid rgba(14,165,233,0.10);
          box-shadow:0 14px 34px rgba(14,165,233,0.07);
          transition:transform .22s ease, box-shadow .22s ease;
        }

        .stat-card:hover{
          transform:translateY(-4px);
          box-shadow:0 18px 40px rgba(14,165,233,0.11);
        }

        .stat-top{
          display:flex;
          align-items:center;
          gap:8px;
          margin-bottom:12px;
        }

        .stat-icon{
          font-size:18px;
        }

        .stat-label{
          font-size:12px;
          color:#64748b;
          font-weight:800;
          text-transform:uppercase;
          letter-spacing:.06em;
        }

        .stat-value{
          font-size:28px;
          font-weight:900;
          color:#0f172a;
          letter-spacing:-0.04em;
        }

        .dashboard-grid{
          display:grid;
          grid-template-columns:1.1fr .55fr;
          gap:18px;
        }

        .main-column, .side-column{
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .panel-card{
          border-radius:28px;
          padding:22px;
          background:rgba(255,255,255,0.84);
          border:1px solid rgba(14,165,233,0.10);
          box-shadow:0 16px 38px rgba(14,165,233,0.07);
          transition:transform .22s ease, box-shadow .22s ease;
        }

        .panel-card:hover{
          transform:translateY(-2px);
          box-shadow:0 20px 42px rgba(14,165,233,0.10);
        }

        .panel-card.small-pad{
          padding:18px;
        }

        .panel-head{
          display:flex;
          justify-content:space-between;
          align-items:flex-start;
          gap:16px;
          margin-bottom:18px;
        }

        .panel-kicker, .section-kicker{
          font-size:11px;
          font-weight:900;
          color:#0ea5e9;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:6px;
        }

        .panel-title, .page-title{
          font-size:26px;
          font-weight:900;
          color:#0f172a;
          letter-spacing:-0.04em;
          line-height:1.05;
          margin:0;
        }

        .page-head{
          margin-bottom:2px;
        }

        .pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:6px 12px;
          border-radius:999px;
          background:linear-gradient(135deg,#0ea5e9,#38bdf8);
          color:#fff;
          font-size:11px;
          font-weight:900;
          white-space:nowrap;
        }

        .pill.light{
          background:rgba(56,189,248,0.10);
          color:#0284c7;
          border:1px solid rgba(14,165,233,0.10);
        }

        .course-focus-card{
          display:flex;
          gap:18px;
          align-items:flex-start;
          padding:18px;
          border-radius:24px;
          background:linear-gradient(135deg, rgba(56,189,248,0.10), rgba(255,255,255,0.92));
          border:1px solid rgba(14,165,233,0.10);
        }

        .focus-icon{
          width:72px;
          height:72px;
          border-radius:22px;
          background:rgba(56,189,248,0.14);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:34px;
          flex-shrink:0;
        }

        .focus-copy{
          flex:1;
          min-width:0;
        }

        .focus-title{
          font-size:22px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:8px;
          letter-spacing:-0.03em;
        }

        .focus-text{
          font-size:14px;
          color:#64748b;
          line-height:1.8;
          font-weight:600;
          margin-bottom:14px;
        }

        .primary-btn, .secondary-btn{
          min-height:44px;
          padding:0 16px;
          border:none;
          border-radius:14px;
          cursor:pointer;
          font-size:14px;
          font-weight:800;
          transition:all .22s ease;
        }

        .primary-btn{
          background:linear-gradient(135deg,#0ea5e9,#38bdf8);
          color:#fff;
          box-shadow:0 12px 26px rgba(14,165,233,0.16);
        }

        .primary-btn:hover{
          transform:translateY(-2px);
        }

        .primary-btn.block{
          width:100%;
          margin-top:14px;
        }

        .secondary-btn{
          background:rgba(56,189,248,0.10);
          color:#0284c7;
          border:1px solid rgba(14,165,233,0.12);
        }

        .secondary-btn:hover{
          background:rgba(56,189,248,0.14);
          transform:translateY(-1px);
        }

        .course-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:14px;
        }

        .course-card{
          text-align:left;
          border:none;
          border-radius:24px;
          padding:18px;
          background:rgba(255,255,255,0.86);
          border:1px solid rgba(14,165,233,0.10);
          cursor:pointer;
          transition:all .22s ease;
          box-shadow:0 10px 24px rgba(14,165,233,0.05);
        }

        .course-card.static{
          cursor:default;
        }

        .course-card:hover{
          transform:translateY(-4px);
          box-shadow:0 18px 34px rgba(14,165,233,0.10);
        }

        .course-card-top{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:10px;
          margin-bottom:12px;
        }

        .course-card-icon{
          width:46px;
          height:46px;
          border-radius:16px;
          background:rgba(56,189,248,0.12);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:24px;
        }

        .course-badge{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:5px 10px;
          border-radius:999px;
          background:rgba(56,189,248,0.10);
          color:#0284c7;
          border:1px solid rgba(14,165,233,0.10);
          font-size:10px;
          font-weight:900;
          text-transform:uppercase;
          letter-spacing:.04em;
          white-space:nowrap;
        }

        .course-card-title{
          font-size:16px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:6px;
          line-height:1.3;
        }

        .course-card-text{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
          margin-bottom:14px;
        }

        .course-card-link{
          font-size:13px;
          font-weight:900;
          color:#0ea5e9;
        }

        .roadmap{
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        .roadmap.large{
          gap:22px;
        }

        .roadmap-item{
          display:grid;
          grid-template-columns:16px 28px 1fr;
          gap:12px;
          align-items:flex-start;
        }

        .roadmap-dot{
          width:16px;
          height:16px;
          border-radius:50%;
          margin-top:4px;
          box-shadow:0 0 0 6px rgba(56,189,248,0.08);
        }

        .roadmap-dot.completed{ background:#22c55e; }
        .roadmap-dot.active{ background:#0ea5e9; }
        .roadmap-dot.next{ background:#cbd5e1; }

        .roadmap-line-wrap{
          position:relative;
          height:100%;
        }

        .roadmap-line{
          position:absolute;
          top:0;
          left:13px;
          width:2px;
          height:100%;
          background:linear-gradient(180deg, rgba(14,165,233,0.20), rgba(14,165,233,0.04));
        }

        .roadmap-copy{
          padding-bottom:8px;
        }

        .roadmap-title{
          font-size:15px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:4px;
        }

        .roadmap-text{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        .mini-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
        }

        .mini-card-icon{
          font-size:26px;
          margin-bottom:10px;
        }

        .mini-card-title{
          font-size:15px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:6px;
        }

        .mini-card-text{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        .weak-list, .tests-list, .progress-list, .ranking-list{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .weak-item, .test-item, .progress-item, .ranking-item{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          padding:16px 18px;
          border-radius:18px;
          background:rgba(255,255,255,0.78);
          border:1px solid rgba(14,165,233,0.08);
        }

        .weak-icon{
          font-size:22px;
          margin-right:2px;
        }

        .weak-title, .test-title{
          font-size:15px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:4px;
        }

        .weak-text, .test-text{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        .widget-card{
          border-radius:24px;
          padding:20px;
          background:rgba(255,255,255,0.84);
          border:1px solid rgba(14,165,233,0.10);
          box-shadow:0 14px 30px rgba(14,165,233,0.06);
        }

        .widget-kicker{
          font-size:11px;
          font-weight:900;
          color:#0ea5e9;
          letter-spacing:.12em;
          text-transform:uppercase;
          margin-bottom:8px;
        }

        .widget-title{
          font-size:18px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:6px;
        }

        .widget-value{
          font-size:30px;
          font-weight:900;
          color:#0f172a;
          line-height:1;
          margin-bottom:6px;
          letter-spacing:-0.05em;
        }

        .widget-note{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        .planner-list{
          display:flex;
          flex-direction:column;
          gap:8px;
          font-size:13px;
          color:#64748b;
          font-weight:700;
          line-height:1.7;
        }

        .badges{
          display:flex;
          gap:8px;
          flex-wrap:wrap;
        }

        .badge-chip{
          display:inline-flex;
          align-items:center;
          padding:8px 12px;
          border-radius:999px;
          background:rgba(56,189,248,0.10);
          color:#0284c7;
          border:1px solid rgba(14,165,233,0.10);
          font-size:12px;
          font-weight:800;
        }

        .ai-card{
          background:linear-gradient(135deg,#0ea5e9 0%, #38bdf8 50%, #e0f2fe 100%);
          border-color:rgba(255,255,255,0.20);
        }

        .ai-box{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .ai-message{
          padding:16px 18px;
          border-radius:20px;
          line-height:1.8;
          font-size:14px;
          font-weight:600;
        }

        .ai-message.user{
          background:rgba(255,255,255,0.18);
          color:#ffffff;
        }

        .ai-message.bot{
          background:rgba(255,255,255,0.88);
          color:#0f172a;
        }

        .planner-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:14px;
        }

        .planner-card{
          padding:18px;
          border-radius:22px;
          background:rgba(255,255,255,0.78);
          border:1px solid rgba(14,165,233,0.08);
        }

        .planner-day{
          font-size:15px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:6px;
        }

        .planner-plan{
          font-size:13px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        .ranking-left{
          display:flex;
          align-items:center;
          gap:12px;
        }

        .ranking-place{
          width:34px;
          height:34px;
          border-radius:12px;
          background:rgba(56,189,248,0.12);
          color:#0284c7;
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:14px;
          font-weight:900;
        }

        .ranking-name{
          font-size:15px;
          font-weight:900;
          color:#0f172a;
        }

        .ranking-score{
          font-size:14px;
          font-weight:800;
          color:#0ea5e9;
        }

        .status-pill{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          padding:6px 12px;
          border-radius:999px;
          font-size:11px;
          font-weight:900;
          white-space:nowrap;
        }

        .status-pill.done{
          background:rgba(34,197,94,0.10);
          color:#16a34a;
          border:1px solid rgba(34,197,94,0.16);
        }

        .status-pill.pending{
          background:rgba(56,189,248,0.10);
          color:#0284c7;
          border:1px solid rgba(14,165,233,0.10);
        }

        .profile-grid{
          display:flex;
          flex-direction:column;
          gap:12px;
        }

        .profile-row{
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:16px;
          padding:16px 18px;
          border-radius:18px;
          background:rgba(255,255,255,0.78);
          border:1px solid rgba(14,165,233,0.08);
          font-size:14px;
          color:#64748b;
          font-weight:700;
        }

        .profile-row strong{
          color:#0f172a;
          font-weight:900;
          text-align:right;
        }

        .empty-box{
          border-radius:20px;
          padding:20px;
          background:rgba(255,255,255,0.68);
          border:1px dashed rgba(14,165,233,0.18);
          color:#64748b;
          font-size:14px;
          font-weight:700;
          line-height:1.7;
          text-align:center;
        }

        .empty-box.large{
          padding:42px 24px;
        }

        .empty-icon{
          font-size:54px;
          margin-bottom:12px;
        }

        .empty-title{
          font-size:18px;
          font-weight:900;
          color:#0f172a;
          margin-bottom:8px;
        }

        .empty-text{
          font-size:14px;
          color:#64748b;
          line-height:1.7;
          font-weight:600;
        }

        @media (max-width: 1280px){
          .dashboard-page{
            grid-template-columns:290px 1fr;
          }

          .dashboard-grid{
            grid-template-columns:1fr;
          }

          .course-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
        }

        @media (max-width: 980px){
          .dashboard-page{
            grid-template-columns:1fr;
          }

          .sidebar{
            display:none;
          }

          .main-content{
            padding:18px;
          }

          .hero-card{
            grid-template-columns:1fr;
          }

          .stats-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
          }
        }

        @media (max-width: 720px){
          .course-grid,
          .mini-grid,
          .planner-grid,
          .stats-grid{
            grid-template-columns:1fr !important;
          }

          .weak-item,
          .test-item,
          .progress-item,
          .ranking-item,
          .profile-row{
            flex-direction:column;
            align-items:flex-start;
          }

          .hero-card,
          .panel-card{
            border-radius:24px;
          }

          .hero-heading{
            font-size:34px;
          }

          .main-content{
            padding:14px;
          }
        }
      `}</style>
    </div>
  )
}