import type { SupabaseClient } from '@supabase/supabase-js'
import { levelFromCompletedExams, levelIndex } from './zku-level-certs'

/**
 * Recomputes a student's `current_level` from the final exams they have
 * completed and upgrades it when a higher level is unlocked.
 *
 * - Authoritative source is {@link levelFromCompletedExams} (the level certs),
 *   so it no longer depends on visiting a specific module page.
 * - Never downgrades: a higher level set by the placement test or by an admin
 *   is preserved.
 * - Idempotent, so it is safe to call on every completion.
 *
 * Call this right after a lesson-completion row is written. Pass the
 * just-completed lesson id so the freshly written row is counted even if the
 * read happens before it is visible.
 *
 * @returns the new level when it changed, otherwise `null`.
 */
export async function syncLevelFromProgress(
  supabase: SupabaseClient,
  userId: string,
  justCompletedLessonId?: string,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('english_lesson_progress')
    .select('lesson_id')
    .eq('user_id', userId)
    .eq('completed', true)
  if (error || !data) return null

  const done = new Set<string>(
    (data as { lesson_id: string | null }[])
      .map(r => r.lesson_id)
      .filter((v): v is string => Boolean(v)),
  )
  if (justCompletedLessonId) done.add(justCompletedLessonId)

  const target = levelFromCompletedExams(done)
  if (!target) return null

  const { data: profile } = await supabase
    .from('english_user_profiles')
    .select('current_level')
    .eq('user_id', userId)
    .maybeSingle()

  const current = (profile as { current_level: string | null } | null)?.current_level ?? 'A1'
  if (levelIndex(target) <= levelIndex(current)) return null

  const { error: upErr } = await supabase
    .from('english_user_profiles')
    .upsert({ user_id: userId, current_level: target }, { onConflict: 'user_id' })
  if (upErr) return null

  return target
}
