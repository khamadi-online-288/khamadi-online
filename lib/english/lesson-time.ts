import type { SupabaseClient } from '@supabase/supabase-js'

/** Whole minutes from lesson open until save. At least 1 so a short lesson is not stored as zero. */
export function minutesSince(startedAtMs: number): number {
  const elapsed = Date.now() - startedAtMs
  if (!Number.isFinite(elapsed) || elapsed <= 0) return 1
  return Math.max(1, Math.round(elapsed / 60000))
}

export interface LessonProgressWrite {
  user_id: string
  lesson_id: string
  lesson_type: string
  lesson_title: string
  completed: boolean
  score: number
  xp_earned: number
  completed_at: string
  time_spent_min: number
}

/**
 * Writes lesson progress including time spent.
 * If the live table has no time_spent_min column yet, the row is still saved without it.
 */
export async function writeLessonProgress(
  supabase: SupabaseClient,
  row: LessonProgressWrite,
  mode: 'upsert' | 'insert',
): Promise<void> {
  const first = mode === 'insert'
    ? await supabase.from('english_lesson_progress').insert(row)
    : await supabase.from('english_lesson_progress').upsert(row, { onConflict: 'user_id,lesson_id' })

  if (!first.error) return
  if (!first.error.message.includes('time_spent_min')) return

  const { time_spent_min: _minutes, ...withoutTime } = row
  if (mode === 'insert') {
    await supabase.from('english_lesson_progress').insert(withoutTime)
  } else {
    await supabase.from('english_lesson_progress').upsert(withoutTime, { onConflict: 'user_id,lesson_id' })
  }
}
