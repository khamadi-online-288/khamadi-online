'use client'

import { useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'

type SaveState = { saving: boolean; saved: boolean; error: string | null }

export function useProgress() {
  const [state, setState] = useState<SaveState>({ saving: false, saved: false, error: null })

  async function saveProgress(lessonId: string, completed: boolean, score: number, timeSpent: number) {
    setState({ saving: true, saved: false, error: null })

    const supabase = createEnglishClient()
    const { error } = await supabase.rpc('save_lesson_progress', {
      lesson_id:  lessonId,
      completed,
      score,
      time_spent: timeSpent,
    })

    if (error) {
      setState({ saving: false, saved: false, error: error.message })
      return false
    }

    setState({ saving: false, saved: true, error: null })
    return true
  }

  return { ...state, saveProgress }
}
