import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import ContentProtection from '@/components/english/ContentProtection'
import CoursesUI from './CoursesUI'

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

  // Step 1: fetch courses (General English + ESP track)
  const [coursesRes, espRes] = await Promise.all([
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
          .order('level', { ascending: false })
          .limit(1)
      : Promise.resolve({ data: null }),
  ])

  const allCourses  = (coursesRes.data ?? []) as CourseRow[]
  const trackCourse = ((espRes.data as CourseRow[] | null)?.[0] ?? null) as CourseRow | null

  // Step 2: fetch lessons and progress only for displayed courses
  const visibleIds = [
    ...allCourses.map(c => c.id),
    ...(trackCourse ? [trackCourse.id] : []),
  ]

  const [lessonsRes, progressRes] = await Promise.all([
    visibleIds.length > 0
      ? supabase
          .from('english_lessons')
          .select('id, course_id')
          .in('course_id', visibleIds)
      : Promise.resolve({ data: [] }),

    supabase
      .from('english_progress')
      .select('lesson_id, completed')
      .eq('user_id', user.id),
  ])

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
      <CoursesUI generalCourses={generalCourses} trackEnriched={trackEnriched} />
    </ContentProtection>
  )
}
