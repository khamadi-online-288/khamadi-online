'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, FileText, BookOpen, Award, PlayCircle } from 'lucide-react'
import Link from 'next/link'

export type FeedItem = {
  id:          number
  type:        'completed' | 'quiz' | 'started' | 'cert'
  lessonTitle: string
  courseTitle: string
  score:       number | null
  minutesAgo:  number
  href?:       string
}

type Props = { items: FeedItem[] }

const TYPE_CONFIG = {
  completed: { icon: CheckCircle2, color: 'bg-emerald-100 text-emerald-600', label: 'Завершили урок'   },
  quiz:      { icon: FileText,      color: 'bg-violet-100 text-violet-600',   label: 'Сдали квиз'      },
  started:   { icon: PlayCircle,    color: 'bg-sky/15 text-sky',              label: 'Начали урок'      },
  cert:      { icon: Award,         color: 'bg-gold/15 text-gold',            label: 'Сертификат!'      },
}

function timeLabel(minutesAgo: number): string {
  if (minutesAgo < 2)    return 'только что'
  if (minutesAgo < 60)   return `${minutesAgo} мин назад`
  const h = Math.floor(minutesAgo / 60)
  if (h < 24)            return h === 1 ? '1 час назад' : `${h} ч назад`
  const d = Math.floor(h / 24)
  if (d === 1)           return 'вчера'
  if (d < 7)             return `${d} дня назад`
  return `${Math.floor(d / 7)} нед назад`
}

export default function ActivityFeed({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6">
        <h2 className="font-serif font-bold text-navy text-lg mb-6">Последняя активность</h2>
        <div className="text-center py-8 text-gray-400">
          <BookOpen size={36} className="mx-auto mb-3 opacity-30" strokeWidth={1.5} />
          <p className="text-sm font-medium">Активность пока не отображается</p>
          <p className="text-xs mt-1">Начните первый урок, чтобы здесь появилась запись</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6">
      <h2 className="font-serif font-bold text-navy text-lg mb-6">Последняя активность</h2>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100" />

        <motion.div
          className="space-y-1"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
        >
          {items.map((item, i) => {
            const cfg  = TYPE_CONFIG[item.type]
            const Icon = cfg.icon
            const isLast = i === items.length - 1

            const inner = (
              <motion.div
                variants={{ hidden: { opacity: 0, x: -12 }, show: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 140, damping: 20 } } }}
                className="flex items-start gap-4 pl-9 pr-2 py-2.5 rounded-xl hover:bg-soft transition-colors cursor-default group"
              >
                {/* Dot */}
                <div className={`absolute left-2 w-4 h-4 rounded-full ${cfg.color} flex items-center justify-center mt-0.5 z-10`}>
                  <Icon size={9} strokeWidth={2.5} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">{cfg.label}</p>
                      <p className="text-sm font-semibold text-navy leading-snug truncate group-hover:text-sky transition-colors">
                        {item.lessonTitle}
                      </p>
                      <p className="text-xs text-gray-400 font-medium mt-0.5 truncate">{item.courseTitle}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs text-gray-400 font-medium whitespace-nowrap">{timeLabel(item.minutesAgo)}</p>
                      {item.score != null && (
                        <p className={`text-xs font-black tabular-nums mt-0.5 ${item.score >= 80 ? 'text-emerald-600' : item.score >= 60 ? 'text-amber-600' : 'text-red-500'}`}>
                          {item.score}%
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )

            return (
              <div key={item.id} className={`relative ${!isLast ? 'pb-1' : ''}`}>
                {item.href ? <Link href={item.href}>{inner}</Link> : inner}
              </div>
            )
          })}
        </motion.div>
      </div>
    </div>
  )
}
