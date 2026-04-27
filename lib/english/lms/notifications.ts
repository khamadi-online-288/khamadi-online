import type { SupabaseClient } from '@supabase/supabase-js'

export async function createNotification(
  supabase: SupabaseClient,
  opts: { userId: string; type: string; title: string; body: string; link?: string }
) {
  return supabase.from('lms_notifications').insert({
    user_id: opts.userId,
    type: opts.type,
    title: opts.title,
    body: opts.body,
    link: opts.link ?? null,
    is_read: false,
  })
}

export const NOTIF = {
  NEW_ASSIGNMENT:    'new_assignment',
  ASSIGNMENT_GRADED: 'assignment_graded',
  NEW_MESSAGE:       'new_message',
  NEW_ANNOUNCEMENT:  'new_announcement',
  CERTIFICATE:       'certificate_issued',
  COURSE_ASSIGNED:   'course_assigned',
} as const
