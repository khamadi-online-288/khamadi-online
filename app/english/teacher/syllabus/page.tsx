import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { FileText, Download, BookOpen, Briefcase } from 'lucide-react'

export const dynamic = 'force-dynamic'

type Course = { id: string; title: string; level: string | null; category: string; description: string | null }
type ModuleRow = { id: string; course_id: string }
type LessonRow = { id: string; module_id: string }

const LEVEL_COLORS: Record<string, { bg: string; text: string }> = {
  A1: { bg: '#dcfce7', text: '#166534' },
  A2: { bg: '#dbeafe', text: '#1e40af' },
  B1: { bg: '#ede9fe', text: '#5b21b6' },
  B2: { bg: '#fef9c3', text: '#854d0e' },
  C1: { bg: '#fee2e2', text: '#991b1b' },
  C2: { bg: '#f1f5f9', text: '#1e293b' },
}

export default async function SyllabusListPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const [coursesRes, modulesRes, lessonsRes] = await Promise.all([
    supabase.from('english_courses').select('id,title,level,category,description').eq('is_active', true).order('level'),
    supabase.from('english_modules').select('id,course_id'),
    supabase.from('english_lessons').select('id,module_id'),
  ])

  const courses  = (coursesRes.data  ?? []) as Course[]
  const modules  = (modulesRes.data  ?? []) as ModuleRow[]
  const lessons  = (lessonsRes.data  ?? []) as LessonRow[]

  const modulesByCourse = new Map<string, string[]>()
  for (const m of modules) {
    const arr = modulesByCourse.get(m.course_id) ?? []
    arr.push(m.id)
    modulesByCourse.set(m.course_id, arr)
  }
  const lessonsByModule = new Map<string, number>()
  for (const l of lessons) {
    lessonsByModule.set(l.module_id, (lessonsByModule.get(l.module_id) ?? 0) + 1)
  }

  function countLessons(courseId: string): number {
    const mods = modulesByCourse.get(courseId) ?? []
    return mods.reduce((acc, mid) => acc + (lessonsByModule.get(mid) ?? 0), 0)
  }

  const general = courses.filter(c => c.category === 'General English')
  const esp     = courses.filter(c => c.category === 'English for Special Purposes')

  return (
    <div style={{ padding: '36px 40px', fontFamily: 'Montserrat, sans-serif', maxWidth: 1100 }}>

      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 13, background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={22} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: 26, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em' }}>Силлабусы</h1>
            <p style={{ margin: 0, fontSize: 13, color: '#64748b', fontWeight: 600 }}>Учебные программы курсов KHAMADI ENGLISH</p>
          </div>
        </div>
        <div style={{ height: 3, width: 60, borderRadius: 99, background: '#C9933B', marginTop: 4 }} />
      </div>

      {/* General English */}
      <Section title="General English" subtitle="A1 → C1" icon={<BookOpen size={16} color="#1B8FC4" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {general.map(c => (
            <CourseCard key={c.id} course={c} lessonCount={countLessons(c.id)} moduleCount={(modulesByCourse.get(c.id) ?? []).length} />
          ))}
        </div>
      </Section>

      {/* ESP */}
      <Section title="English for Specific Purposes" subtitle="Профессиональные треки" icon={<Briefcase size={16} color="#C9933B" />}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 18 }}>
          {esp.map(c => (
            <CourseCard key={c.id} course={c} lessonCount={countLessons(c.id)} moduleCount={(modulesByCourse.get(c.id) ?? []).length} isESP />
          ))}
        </div>
      </Section>

    </div>
  )
}

function Section({ title, subtitle, icon, children }: { title: string; subtitle: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: 44 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <div style={{ width: 3, height: 22, borderRadius: 99, background: 'linear-gradient(180deg,#1B8FC4,#1B3A6B)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {icon}
          <span style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>{title}</span>
          <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{subtitle}</span>
        </div>
      </div>
      {children}
    </section>
  )
}

function CourseCard({ course, lessonCount, moduleCount, isESP = false }: {
  course: Course; lessonCount: number; moduleCount: number; isESP?: boolean
}) {
  const levelKey = course.level?.match(/^[ABC][12]/)?.[0] ?? ''
  const lc       = LEVEL_COLORS[levelKey] ?? { bg: '#f1f5f9', text: '#475569' }
  const hours    = lessonCount * 2

  return (
    <div style={{
      background: '#fff', borderRadius: 20, border: '1.5px solid rgba(27,58,107,0.09)',
      boxShadow: '0 4px 16px rgba(27,58,107,0.06)', overflow: 'hidden',
      display: 'flex', flexDirection: 'column',
    }}>
      {/* Top colour strip */}
      <div style={{
        height: 6,
        background: isESP
          ? 'linear-gradient(90deg,#C9933B,#e8b14f)'
          : 'linear-gradient(90deg,#1B3A6B,#1B8FC4)',
      }} />

      <div style={{ padding: '20px 22px 22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        {/* Level badge */}
        {course.level && (
          <span style={{
            display: 'inline-block', marginBottom: 10,
            padding: '3px 12px', borderRadius: 99,
            background: isESP ? '#fff7ed' : lc.bg,
            color: isESP ? '#92400e' : lc.text,
            fontSize: 11, fontWeight: 800,
          }}>
            {course.level}
          </span>
        )}

        <h3 style={{ margin: '0 0 6px', fontSize: 15, fontWeight: 900, color: '#1B3A6B', lineHeight: 1.3 }}>
          {course.title}
        </h3>

        {/* Stats */}
        <div style={{ display: 'flex', gap: 16, margin: '10px 0 18px', fontSize: 12, color: '#64748b', fontWeight: 600 }}>
          <span>📦 {moduleCount} модулей</span>
          <span>📝 {lessonCount} уроков</span>
          <span>⏱ {hours} ч.</span>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
          <Link
            href={`/english/teacher/syllabus/${course.id}`}
            style={{
              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', color: '#fff',
              textDecoration: 'none', padding: '9px 14px', borderRadius: 10,
              fontSize: 12, fontWeight: 700,
            }}
          >
            <FileText size={13} /> Открыть
          </Link>
          <a
            href={`/api/english/syllabus/${course.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              background: '#fff7ed', color: '#92400e', border: '1.5px solid #C9933B',
              textDecoration: 'none', padding: '9px 14px', borderRadius: 10,
              fontSize: 12, fontWeight: 700,
            }}
          >
            <Download size={13} /> PDF
          </a>
        </div>
      </div>
    </div>
  )
}