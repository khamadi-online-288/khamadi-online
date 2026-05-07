import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import type { EnglishNotification } from '@/types/english/database'
import NotificationsUI from './NotificationsUI'

export default async function NotificationsPage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  const { data: rows } = await supabase
    .from('english_notifications')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Mark all as read (fire-and-forget, non-blocking)
  supabase
    .from('english_notifications')
    .update({ is_read: true })
    .eq('user_id', user.id)
    .eq('is_read', false)

  const notifications = (rows ?? []) as EnglishNotification[]

  return <NotificationsUI notifications={notifications} />
}
