import type { SupabaseClient } from '@supabase/supabase-js'

export const XP_REWARDS = {
  lesson_complete:      10,
  quiz_perfect:         25,
  quiz_pass:            10,
  reading_complete:     15,
  vocabulary_mastered:   5,
  writing_submitted:    20,
  placement_done:       50,
  mock_exam_done:       40,
  streak_bonus:          5,
} as const

export async function awardXP(
  supabase: SupabaseClient,
  userId: string,
  action: keyof typeof XP_REWARDS,
  metadata?: Record<string, unknown>
): Promise<number> {
  const xp = XP_REWARDS[action]
  await supabase.rpc('add_english_xp', {
    p_user_id: userId,
    p_action: action,
    p_xp: xp,
    p_metadata: metadata ?? null,
  })
  return xp
}
