'use client'

import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { EnglishCourse, EnglishLesson, EnglishProgress } from '@/types/english/database'

type CourseState = {
  loading:  boolean
  course:   EnglishCourse | null
  lessons:  EnglishLesson[]
  progress: Map<string, EnglishProgress>
  error:    string | null
}

export function useCourse(courseId: string) {
  const [state, setState] = useState<CourseState>({
    loading: true, course: null, lessons: [], progress: new Map(), error: null,
  })

  useEffect(() => {
    if (!courseId) return
    const supabase = createEnglishClient()

    async function load() {
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setState(s => ({ ...s, loading: false, error: 'Not authenticated' })); return }

      const [{ data: course, error: cErr }, { data: lessons }, { data: prog }] = await Promise.all([
        supabase.from('english_courses').select('*').eq('id', courseId).maybeSingle(),
        supabase.from('english_lessons').select('*').eq('course_id', courseId)
          .eq('is_published', true).order('lesson_order'),
        supabase.from('english_progress').select('*').eq('user_id', user.id),
      ])

      if (cErr) { setState(s => ({ ...s, loading: false, error: cErr.message })); return }

      const entries: [string, EnglishProgress][] = (prog ?? [])
        .filter((p: EnglishProgress) => typeof p.lesson_id === 'string')
        .map((p: EnglishProgress) => [p.lesson_id as string, p])
      const progressMap = new Map<string, EnglishProgress>(entries)

      setState({
        loading:  false,
        course:   course as EnglishCourse | null,
        lessons:  (lessons ?? []) as EnglishLesson[],
        progress: progressMap,
        error:    null,
      })
    }

    load()
  }, [courseId])

  return state
}
