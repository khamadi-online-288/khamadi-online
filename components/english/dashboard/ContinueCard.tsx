'use client'

import { motion } from 'framer-motion'
import { Zap, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'

type Props = {
  courseTitle:   string
  lessonTitle:   string
  unitLabel:     string
  progressPct:   number
  minutesLeft:   number
  href:          string
}

export default function ContinueCard({ courseTitle, lessonTitle, unitLabel, progressPct, minutesLeft, href }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.15 }}
      whileHover={{ y: -2, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-sky via-[#1877A8] to-mid shadow-xl shadow-sky/20 p-7"
    >
      {/* Decorative blobs */}
      <div className="pointer-events-none absolute -top-10 -right-10 w-48 h-48 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -bottom-8 -left-8 w-36 h-36 rounded-full bg-white/10 blur-xl" />

      <div className="relative flex flex-col md:flex-row md:items-center gap-6">
        {/* Text */}
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 border border-white/20 mb-4">
            <Zap size={12} className="text-yellow-300" strokeWidth={2.5} />
            <span className="text-white/90 text-xs font-black tracking-widest uppercase">Продолжить</span>
          </div>

          <h3 className="font-serif font-bold text-white text-2xl leading-tight mb-1 truncate">{courseTitle}</h3>
          <p className="text-white/70 text-sm font-medium mb-1">{unitLabel}</p>
          <p className="text-white/90 text-base font-semibold truncate">{lessonTitle}</p>

          {/* Progress */}
          <div className="mt-4 space-y-1.5">
            <div className="flex items-center justify-between text-xs text-white/70 font-medium">
              <span>Прогресс курса</span>
              <span className="font-bold text-white tabular-nums">{progressPct}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/20 overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.4 }}
              />
            </div>
          </div>

          <div className="flex items-center gap-1.5 mt-3 text-white/60 text-xs font-medium">
            <Clock size={12} strokeWidth={1.8} />
            <span>~{minutesLeft} минут до завершения урока</span>
          </div>
        </div>

        {/* CTA */}
        <div className="shrink-0">
          <Link href={href}>
            <motion.button
              whileHover={{ x: 4 }}
              transition={{ type: 'spring', stiffness: 400, damping: 20 }}
              className="flex items-center gap-2 bg-white text-sky font-black text-sm px-6 py-3.5 rounded-xl shadow-lg hover:shadow-xl transition-shadow"
            >
              Продолжить урок
              <ArrowRight size={16} strokeWidth={2.5} />
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
