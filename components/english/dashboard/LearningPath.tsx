'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, Lock } from 'lucide-react'
import Link from 'next/link'

type LevelInfo = {
  level: string
  courseId: string | null
  pct:    number
  status: 'done' | 'active' | 'locked'
}

type Props = { levels: LevelInfo[] }

const LEVELS = ['A1', 'A2', 'B1', 'B2', 'C1']

export default function LearningPath({ levels }: Props) {
  return (
    <div className="bg-white rounded-2xl border border-sky/10 p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-serif font-bold text-navy text-lg">Путь обучения</h2>
        <span className="text-xs text-gray-400 font-medium">A1 → C1</span>
      </div>

      <div className="relative flex items-center justify-between">
        {/* Connecting line */}
        <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-100" />
        <motion.div
          className="absolute top-5 left-5 h-0.5 bg-gradient-to-r from-gold via-sky to-sky/30"
          initial={{ width: 0 }}
          animate={{ width: `${getFilledWidth(levels)}%` }}
          transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
        />

        {LEVELS.map((lvl, i) => {
          const info = levels.find(l => l.level === lvl) ?? { level: lvl, courseId: null, pct: 0, status: 'locked' as const }
          return (
            <motion.div
              key={lvl}
              className="relative z-10 flex flex-col items-center gap-2"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 18, delay: 0.1 + i * 0.1 }}
            >
              {info.courseId ? (
                <Link href={`/english/courses/${info.courseId}`} aria-label={`Перейти к курсу ${lvl}`}>
                  <NodeDot info={info} />
                </Link>
              ) : (
                <NodeDot info={info} />
              )}
              <span className="text-xs font-black text-navy">{lvl}</span>
              <span className={`text-xs font-bold tabular-nums ${info.status === 'locked' ? 'text-gray-300' : 'text-sky'}`}>
                {info.status === 'locked' ? '—' : `${info.pct}%`}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function NodeDot({ info }: { info: LevelInfo }) {
  if (info.status === 'done') {
    return (
      <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center shadow-md shadow-gold/30">
        <CheckCircle2 size={18} className="text-white" strokeWidth={2.5} />
      </div>
    )
  }
  if (info.status === 'active') {
    return (
      <motion.div
        className="w-10 h-10 rounded-full bg-sky flex items-center justify-center shadow-lg shadow-sky/40"
        animate={{ scale: [1, 1.12, 1], boxShadow: ['0 0 0 0 rgba(27,143,196,0.4)', '0 0 0 8px rgba(27,143,196,0)', '0 0 0 0 rgba(27,143,196,0)'] }}
        transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
      >
        <span className="text-white font-black text-xs">{info.level}</span>
      </motion.div>
    )
  }
  return (
    <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center">
      <Lock size={14} className="text-gray-300" strokeWidth={1.8} />
    </div>
  )
}

function getFilledWidth(levels: LevelInfo[]): number {
  const total = LEVELS.length - 1
  const activeIdx = LEVELS.findIndex(l => {
    const info = levels.find(x => x.level === l)
    return info?.status === 'active'
  })
  if (activeIdx <= 0) {
    const doneCount = levels.filter(l => l.status === 'done').length
    return doneCount === 0 ? 0 : (doneCount / total) * 100
  }
  const doneCount = levels.filter(l => l.status === 'done').length
  const activeInfo = levels.find(l => l.status === 'active')
  const partial = (activeInfo?.pct ?? 0) / 100
  return ((doneCount + partial) / total) * 100
}
