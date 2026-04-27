import type { SupabaseClient } from '@supabase/supabase-js'

export async function logActivity(
  supabase: SupabaseClient,
  opts: { userId: string; action: string; entityType?: string; entityId?: string; metadata?: Record<string, unknown> }
) {
  return supabase.from('lms_activity_log').insert({
    user_id: opts.userId,
    action: opts.action,
    entity_type: opts.entityType ?? null,
    entity_id: opts.entityId ?? null,
    metadata: opts.metadata ?? null,
  })
}
