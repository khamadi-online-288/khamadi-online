import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { getESPIcon } from '@/components/english/dashboard/ESPIcons'
import ContentProtection from '@/components/english/ContentProtection'

const ESP_TITLE_MAP: Record<string, string> = {
  computer_science: 'Computer Science',
  accounting:       'Accounting',
  hospitality:      'Hospitality',
  management:       'Management',
  finance:          'Finance Industry',
  finance_industry: 'Finance Industry',
  social_sciences:  'Social Sciences',
  law:              'Law',
}

const LEVEL_STYLES: Record<string, { bg: string; accent: string }> = {
  A1: { bg: '#1B3A6B',                                          accent: '#1B8FC4' },
  A2: { bg: 'linear-gradient(135deg, #1B3A6B 0%, #1e4a8a 100%)', accent: '#1B8FC4' },
  B1: { bg: 'linear-gradient(135deg, #1B3A6B 0%, #1B8FC4 100%)', accent: '#ffffff' },
  B2: { bg: 'linear-gradient(135deg, #1B3A6B 0%, #2D5A9E 100%)', accent: '#ffffff' },
  C1: { bg: '#0D2447',                                          accent: '#C9933B' },
  C2: { bg: 'linear-gradient(135deg, #0D2447 0%, #1B3A6B 100%)', accent: '#C9933B' },
}

const LEVEL_SUBLABEL: Record<string, string> = {
  'A1 Beginner':           'BEGINNER',
  'A1 Elementary':         'ELEMENTARY',
  'A2 Pre-Intermediate':   'PRE-INTERMEDIATE',
  'B1 Intermediate':       'INTERMEDIATE',
  'B2 Upper-Intermediate': 'UPPER-INTERMEDIATE',
  'C1 Advanced':           'ADVANCED',
  'C2 Proficient':         'PROFICIENT',
}


type CourseRow = {
  id: string; title: string; level: string | null
  category: string; description: string | null
}

type CourseWithProgress = CourseRow & {
  done: number; total: number; pct: number
}

export default async function CoursesPage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  // Get student's purpose first, then fetch their ESP course directly by title
  const profileRes = await supabase
    .from('english_user_roles')
    .select('purpose')
    .eq('user_id', user.id)
    .maybeSingle()

  const purpose = (profileRes.data as { purpose?: string | null } | null)?.purpose ?? null

  const [coursesRes, espRes, lessonsRes, progressRes] = await Promise.all([
    supabase
      .from('english_courses')
      .select('id, title, level, category, description')
      .eq('is_active', true)
      .eq('category', 'General English')
      .order('level'),

    purpose && purpose !== 'general' && ESP_TITLE_MAP[purpose]
      ? supabase
          .from('english_courses')
          .select('id, title, level, category, description')
          .eq('is_active', true)
          .eq('category', 'English for Special Purposes')
          .ilike('title', `%${ESP_TITLE_MAP[purpose]}%`)
          .limit(1)
      : Promise.resolve({ data: null }),

    supabase
      .from('english_lessons')
      .select('id, course_id'),

    supabase
      .from('english_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id),
  ])

  const allCourses   = (coursesRes.data ?? []) as CourseRow[]
  const trackCourse  = ((espRes.data as CourseRow[] | null)?.[0] ?? null) as CourseRow | null
  const allLessons   = (lessonsRes.data ?? []) as { id: string; course_id: string }[]
  const completedIds = new Set(
    ((progressRes.data ?? []) as { lesson_id: string; completed: boolean }[])
      .filter(p => p.completed)
      .map(p => p.lesson_id)
  )

  function enrich(course: CourseRow): CourseWithProgress {
    const cl   = allLessons.filter(l => l.course_id === course.id)
    const done = cl.filter(l => completedIds.has(l.id)).length
    const pct  = cl.length ? Math.round((done / cl.length) * 100) : 0
    return { ...course, done, total: cl.length, pct }
  }

  const generalCourses = allCourses.map(enrich)
  const trackEnriched  = trackCourse ? enrich(trackCourse) : null

  return (
    <ContentProtection>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em', margin: 0, marginBottom: 6 }}>
          Курсы
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', fontWeight: 600, margin: 0 }}>
          General English — базовая программа для всех. ESP — профессиональный трек.
        </p>
      </div>

      {/* ── General English ── */}
      <section>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <div style={{ width: 3, height: 20, borderRadius: 99, background: 'linear-gradient(180deg, #1B8FC4, #2E5FA3)' }} />
          <span style={{ fontSize: 13, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.01em' }}>
            General English
          </span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>A1 → C2</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
          {generalCourses.map(course => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </section>

      {/* ── ESP Track — only student's chosen course ── */}
      {trackEnriched && (
        <section>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 3, height: 20, borderRadius: 99, background: 'linear-gradient(180deg, #C9933B, #e8b14f)' }} />
            <span style={{ fontSize: 13, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.01em' }}>
              Профессиональный трек
            </span>
            <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>English for Special Purposes</span>
          </div>
          <div style={{ maxWidth: 340 }}>
            <CourseCard course={trackEnriched} isMyTrack />
          </div>
        </section>
      )}

    </div>
    </ContentProtection>
  )
}

function CourseCard({ course, isMyTrack = false }: { course: CourseWithProgress; isMyTrack?: boolean }) {
  const isESP    = course.category === 'English for Special Purposes'
  const levelKey = course.level?.match(/^[ABC][12]/)?.[0] ?? ''
  const cardStyle = isESP
    ? { bg: 'linear-gradient(135deg, #0D2447 0%, #1B3A6B 100%)', accent: '#C9933B' }
    : (LEVEL_STYLES[levelKey] ?? LEVEL_STYLES['B1'])
  const label    = LEVEL_SUBLABEL[course.title] ?? levelKey
  const barColor = course.pct >= 70 ? '#10b981' : course.pct >= 30 ? '#C9933B' : '#1B8FC4'

  return (
    <Link
      href={`/english/dashboard/courses/${course.id}`}
      className="course-card"
      style={{
        textDecoration: 'none',
        display: 'flex',
        outline: isMyTrack ? '2px solid #C9933B' : undefined,
        flexDirection: 'column',
        borderRadius: 16,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(27,58,107,0.08)',
      }}
    >
      {/* ── Top colour block ── */}
      <div style={{
        background: cardStyle.bg,
        height: 140,
        borderRadius: '16px 16px 0 0',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '20px 24px',
      }}>
        {/* Decorative circles */}
        <div style={{ position: 'absolute', right: -20, top: -20, width: 120, height: 120, borderRadius: '50%', background: cardStyle.accent, opacity: 0.08 }} />
        <div style={{ position: 'absolute', right: 10,  top: 10,  width: 80,  height: 80,  borderRadius: '50%', background: cardStyle.accent, opacity: 0.06 }} />

        {/* ESP SVG icon — top-right */}
        {isESP && (
          <div style={{ position: 'absolute', right: 8, top: 4, opacity: 0.9 }}>
            {getESPIcon(course.title)}
          </div>
        )}

        {/* Completion badge */}
        {course.pct === 100 && !isESP && (
          <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(16,185,129,0.25)', border: '1px solid rgba(16,185,129,0.4)', borderRadius: 99, padding: '3px 10px', fontSize: 10, fontWeight: 800, color: '#6ee7b7' }}>
            ЗАВЕРШЁН
          </div>
        )}

        {/* General English: big level typography */}
        {!isESP && levelKey && (
          <>
            <div style={{ fontFamily: 'Georgia, serif', fontSize: 48, fontWeight: 700, color: '#ffffff', lineHeight: 1 }}>
              {levelKey}
            </div>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.6)', letterSpacing: '2px', marginTop: 4 }}>
              {label}
            </div>
            <div style={{ width: 36, height: 2, background: '#C9933B', borderRadius: 1, marginTop: 8 }} />
          </>
        )}

        {/* ESP: level as small label at bottom-left */}
        {isESP && (
          <>
            <div style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: '2px', textTransform: 'uppercase' as const }}>
              {course.level ?? 'B1 – C1'}
            </div>
            <div style={{ width: 36, height: 2, background: '#C9933B', borderRadius: 1, marginTop: 8 }} />
          </>
        )}
      </div>

      {/* ── Bottom white block ── */}
      <div style={{
        background: '#fff',
        borderRadius: '0 0 16px 16px',
        border: '1px solid rgba(27,58,107,0.08)',
        borderTop: 'none',
        padding: '16px 24px 20px',
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
      }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 6, lineHeight: 1.3 }}>
          {course.title}
        </div>

        <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5, marginBottom: 16, minHeight: 36, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {course.description ?? 'Нажмите, чтобы начать курс'}
        </div>

        <div style={{ marginTop: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: '#94a3b8' }}>
              {course.done} / {course.total} уроков
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, color: '#1B3A6B' }}>
              {course.pct}%
            </span>
          </div>
          <div style={{ background: '#e2e8f0', borderRadius: 999, height: 4 }}>
            <div style={{ width: `${course.pct}%`, height: '100%', borderRadius: 999, background: barColor, transition: 'width 0.3s' }} />
          </div>
        </div>
      </div>
    </Link>
  )
}
