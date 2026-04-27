'use client'

import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { EnglishLesson, EnglishQuizQuestion, EnglishProgress } from '@/types/english/database'

type LessonState = {
  loading:   boolean
  lesson:    EnglishLesson | null
  questions: EnglishQuizQuestion[]
  progress:  EnglishProgress | null
  error:     string | null
}

export function useLesson(lessonId: string) {
  const [state, setState] = useState<LessonState>({
    loading: true, lesson: null, questions: [], progress: null, error: null,
  })

  useEffect(() => {
    if (!lessonId) return
    const supabase = createEnglishClient()

    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setState(s => ({ ...s, loading: false, error: 'Not authenticated' })); return }

      const [{ data: lesson }, { data: questions }, { data: progress }] = await Promise.all([
        supabase.from('english_lessons').select('*').eq('id', lessonId).maybeSingle(),
        supabase.from('english_quiz_questions').select('*').eq('lesson_id', lessonId),
        supabase.from('english_progress').select('*')
          .eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle(),
      ])

      setState({
        loading:   false,
        lesson:    lesson as EnglishLesson | null,
        questions: (questions ?? []) as EnglishQuizQuestion[],
        progress:  progress as EnglishProgress | null,
        error:     null,
      })
    }

    load()
  }, [lessonId])

  return state
}
