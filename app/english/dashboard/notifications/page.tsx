import { redirect } from 'next/navigation'
import { Bell } from 'lucide-react'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import type { EnglishNotification } from '@/types/english/database'

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

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-black text-navy">Уведомления</h1>
        {notifications.length > 0 && (
          <p className="text-gray-500 text-sm mt-1">{notifications.length} уведомлений</p>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/8 p-12 text-center">
          <Bell className="mx-auto mb-4 text-gray-200" size={48} />
          <p className="text-navy font-bold">Нет уведомлений</p>
          <p className="text-gray-400 text-sm mt-1">Здесь будут появляться важные сообщения</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border px-5 py-4 flex items-start gap-3 ${
                n.is_read ? 'border-navy/8' : 'border-gold/30'
              }`}
            >
              <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.is_read ? 'bg-gray-200' : 'bg-gold'}`} />
              <div className="flex-1">
                <p className="font-bold text-navy text-sm">{n.title}</p>
                <p className="text-gray-500 text-sm mt-0.5 leading-relaxed">{n.message}</p>
                <p className="text-gray-300 text-xs mt-1.5">
                  {new Date(n.created_at).toLocaleString('ru-RU', {
                    day: '2-digit', month: '2-digit', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
