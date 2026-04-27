'use client'

import { motion } from 'framer-motion'
import { CalendarCheck, BookOpen, Lightbulb, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Recommendation = {
  id:      string
  title:   string
  sub:     string
  href:    string
  icon:    'grammar' | 'vocab' | 'esp'
}

type Props = {
  completed:       number
  goal:            number
  daysLeft:        number
  recommendations: Recommendation[]
}

const REC_ICON = {
  grammar: '📝',
  vocab:   '📖',
  esp:     '💼',
}

export default function WeeklyGoal({ completed, goal, daysLeft, recommendations }: Props) {
  const pct  = Math.min((completed / goal) * 100, 100)
  const left = Math.max(goal - completed, 0)
  const done = completed >= goal

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Goal card */}
      <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-sky/10 flex items-center justify-center text-sky">
            <CalendarCheck size={16} strokeWidth={1.8} />
          </div>
          <h2 className="font-serif font-bold text-navy text-lg">Цель недели</h2>
        </div>

        <div className="text-center mb-5">
          <div className={`text-5xl font-serif font-bold tabular-nums mb-1 ${done ? 'text-emerald-600' : 'text-navy'}`}>
            {completed}<span className="text-2xl text-gray-300 font-medium">/{goal}</span>
          </div>
          <p className="text-sm text-gray-500 font-medium">уроков выполнено</p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-medium">
            <span className={done ? 'text-emerald-600 font-bold' : 'text-gray-400'}>
              {done ? '🎉 Цель достигнута!' : `Осталось: ${left} уроков`}
            </span>
            <span className="text-gray-400">{daysLeft} дн.</span>
          </div>
          <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${done ? 'bg-emerald-500' : 'bg-sky'}`}
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
            />
          </div>
          <p className="text-xs text-gray-300 text-right tabular-nums">{Math.round(pct)}%</p>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="w-8 h-8 rounded-xl bg-gold/10 flex items-center justify-center text-gold">
            <Lightbulb size={16} strokeWidth={1.8} />
          </div>
          <h2 className="font-serif font-bold text-navy text-lg">Рекомендуем вам</h2>
        </div>

        {recommendations.length === 0 ? (
          <div className="text-center py-6 text-gray-300">
            <BookOpen size={32} className="mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-sm">Пройдите больше уроков для персональных рекомендаций</p>
          </div>
        ) : (
          <div className="space-y-2">
            {recommendations.map((rec, i) => (
              <motion.div
                key={rec.id}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i, type: 'spring', stiffness: 160, damping: 20 }}
              >
                <Link href={rec.href}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-soft transition-colors group"
                >
                  <span className="text-xl shrink-0">{REC_ICON[rec.icon]}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-navy truncate group-hover:text-sky transition-colors">{rec.title}</p>
                    <p className="text-xs text-gray-400 font-medium truncate">{rec.sub}</p>
                  </div>
                  <ArrowRight size={14} className="text-gray-300 group-hover:text-sky transition-colors shrink-0" />
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
