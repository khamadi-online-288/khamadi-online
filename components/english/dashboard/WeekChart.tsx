'use client'

import { motion } from 'framer-motion'
import { Target } from 'lucide-react'
import { useState } from 'react'

type DayData = {
  day:     string
  short:   string
  lessons: number
  hours:   number
  isToday: boolean
}

type Props = {
  days:      DayData[]
  weekTotal: { lessons: number; hours: number }
  goal:      number
}

export default function WeekChart({ days, weekTotal, goal }: Props) {
  const [tooltip, setTooltip] = useState<number | null>(null)
  const maxLessons = Math.max(...days.map(d => d.lessons), 1)
  const goalPct    = Math.min((weekTotal.lessons / goal) * 100, 100)

  return (
    <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6 h-full flex flex-col">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif font-bold text-navy text-lg">Активность недели</h2>
        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
          <Target size={13} strokeWidth={1.8} />
          <span>Цель: {goal} уроков</span>
        </div>
      </div>

      {/* Bars */}
      <div className="flex-1 flex items-end gap-2">
        {days.map((d, i) => {
          const heightPct = maxLessons > 0 ? (d.lessons / maxLessons) * 100 : 0
          return (
            <div
              key={d.day}
              className="flex-1 flex flex-col items-center gap-1.5 relative"
              onMouseEnter={() => setTooltip(i)}
              onMouseLeave={() => setTooltip(null)}
            >
              {/* Tooltip */}
              {tooltip === i && d.lessons > 0 && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-navy text-white text-xs rounded-lg px-2.5 py-1.5 whitespace-nowrap z-10 shadow-lg">
                  <div className="font-bold">{d.lessons} {plural(d.lessons, 'урок', 'урока', 'уроков')}</div>
                  <div className="text-white/60">{d.hours.toFixed(1)} ч</div>
                </div>
              )}

              {/* Bar */}
              <div className="w-full rounded-t-lg overflow-hidden flex flex-col justify-end" style={{ height: 80 }}>
                <motion.div
                  className={`w-full rounded-t-lg ${d.isToday ? 'bg-sky' : d.lessons > 0 ? 'bg-sky/30' : 'bg-gray-100'}`}
                  initial={{ height: 0 }}
                  animate={{ height: heightPct > 0 ? `${heightPct}%` : '4px' }}
                  transition={{ duration: 0.6, ease: 'easeOut', delay: 0.05 * i }}
                />
              </div>

              <span className={`text-xs font-bold ${d.isToday ? 'text-sky' : 'text-gray-400'}`}>{d.short}</span>
            </div>
          )
        })}
      </div>

      {/* Footer */}
      <div className="mt-5 pt-4 border-t border-gray-50 space-y-2.5">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Всего за неделю</span>
          <span className="font-bold text-navy tabular-nums">{weekTotal.lessons} уроков · {weekTotal.hours.toFixed(1)} ч</span>
        </div>
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-gray-500 font-medium">Цель недели</span>
            <span className={`font-black tabular-nums ${goalPct >= 100 ? 'text-emerald-600' : 'text-sky'}`}>
              {weekTotal.lessons}/{goal}
            </span>
          </div>
          <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${goalPct >= 100 ? 'bg-emerald-500' : 'bg-sky'}`}
              initial={{ width: 0 }}
              animate={{ width: `${goalPct}%` }}
              transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function plural(n: number, one: string, few: string, many: string) {
  const mod10 = n % 10, mod100 = n % 100
  if (mod10 === 1 && mod100 !== 11) return one
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return few
  return many
}
