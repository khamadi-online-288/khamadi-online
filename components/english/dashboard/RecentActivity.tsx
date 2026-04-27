import { Bell } from 'lucide-react'
import type { EnglishNotification } from '@/types/english/database'

type Props = { notifications: EnglishNotification[] }

export default function RecentActivity({ notifications }: Props) {
  if (notifications.length === 0) return null

  return (
    <div className="space-y-2">
      {notifications.map(n => (
        <div
          key={n.id}
          className={`bg-white rounded-xl border flex items-start gap-3 px-4 py-3 ${
            n.is_read ? 'border-navy/8' : 'border-gold/25'
          }`}
        >
          <Bell
            size={15}
            className={`mt-0.5 shrink-0 ${n.is_read ? 'text-gray-300' : 'text-gold'}`}
          />
          <div>
            <p className="font-bold text-navy text-sm">{n.title}</p>
            <p className="text-gray-400 text-xs mt-0.5 leading-relaxed">{n.message}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
