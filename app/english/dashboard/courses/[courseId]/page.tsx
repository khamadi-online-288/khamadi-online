import { createEnglishServerClient } from '@/lib/english/supabase-server'
import CourseClient from './CourseClient'

export default async function CoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  const userId = session?.user?.id ?? ''

  const [courseRes, modulesRes, lessonsRes] = await Promise.all([
    supabase
      .from('english_courses')
      .select('id,title,level,category,description')
      .eq('id', courseId)
      .single(),
    supabase
      .from('english_modules')
      .select('id,title,order_index,section')
      .eq('course_id', courseId)
      .order('order_index'),
    supabase
      .from('english_lessons')
      .select('id,title,order_index,lesson_type,module_id')
      .eq('course_id', courseId)
      .order('order_index'),
  ])

  return (
    <CourseClient
      courseId={courseId}
      userId={userId}
      initialCourse={courseRes.data}
      initialModules={modulesRes.data ?? []}
      initialLessons={lessonsRes.data ?? []}
    />
  )
}