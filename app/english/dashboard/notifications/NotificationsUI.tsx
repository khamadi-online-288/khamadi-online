'use client'

import { Bell } from 'lucide-react'
import { useLanguage } from '@/app/english/context/LanguageContext'
import type { EnglishNotification } from '@/types/english/database'

export default function NotificationsUI({ notifications }: { notifications: EnglishNotification[] }) {
  const { t, lang } = useLanguage()
  const dtLocale = lang === 'kk' ? 'kk-KZ' : 'ru-RU'

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div>
        <h1 className="text-2xl font-black text-navy">{t.nav.notifications}</h1>
        {notifications.length > 0 && (
          <p className="text-gray-500 text-sm mt-1">{notifications.length} {t.notifications_page.count}</p>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-navy/8 p-12 text-center">
          <Bell className="mx-auto mb-4 text-gray-200" size={48} />
          <p className="text-navy font-bold">{t.notifications_page.empty}</p>
          <p className="text-gray-400 text-sm mt-1">{t.notifications_page.empty_desc}</p>
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
                  {new Date(n.created_at).toLocaleString(dtLocale, {
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
