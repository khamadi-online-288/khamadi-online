import type { SupabaseClient } from '@supabase/supabase-js'
import { levelFromCompletedExams, levelIndex } from './zku-level-certs'

/**
 * Upgrades `current_level` when the completed final exams unlock a higher
 * level than the stored one. Use it when the profile and completed lesson ids
 * are already loaded (e.g. on page load) to avoid extra reads.
 *
 * Never downgrades: a higher level set by the placement test or by an admin
 * is preserved.
 *
 * @returns the new level when it changed, otherwise `null`.
 */
export async function upgradeLevelIfEarned(
  supabase: SupabaseClient,
  userId: string,
  currentLevel: string | null | undefined,
  completed: ReadonlySet<string>,
): Promise<string | null> {
  const target = levelFromCompletedExams(completed)
  if (!target) return null
  if (levelIndex(target) <= levelIndex(currentLevel ?? 'A1')) return null

  const { error } = await supabase
    .from('english_user_profiles')
    .update({ current_level: target })
    .eq('user_id', userId)
  if (error) return null

  return target
}

/**
 * Recomputes a student's `current_level` from the final exams they have
 * completed and upgrades it when a higher level is unlocked.
 *
 * - Authoritative source is {@link levelFromCompletedExams} (the level certs),
 *   so it no longer depends on visiting a specific module page.
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

  const { data: profile } = await supabase
    .from('english_user_profiles')
    .select('current_level')
    .eq('user_id', userId)
    .maybeSingle()

  const current = (profile as { current_level: string | null } | null)?.current_level
  return upgradeLevelIfEarned(supabase, userId, current, done)
}
