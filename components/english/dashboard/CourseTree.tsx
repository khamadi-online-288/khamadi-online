'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2, Circle, Loader2, Lock, Award, ChevronDown, ChevronRight, BookOpen, Briefcase } from 'lucide-react'
import Link from 'next/link'

type CourseRow = {
  id:          string
  title:       string
  level:       string
  category:    string
  pct:         number
  status:      'done' | 'active' | 'locked'
  hasCert:     boolean
}

type Props = { courses: CourseRow[]; totalPct: number }

export default function CourseTree({ courses, totalPct }: Props) {
  const general = courses.filter(c => c.category === 'General English')
  const esp     = courses.filter(c => c.category !== 'General English')

  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({ general: true, esp: true })
  const toggle = (key: string) => setOpenGroups(p => ({ ...p, [key]: !p[key] }))

  return (
    <div className="bg-white rounded-2xl border border-sky/10 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-50">
        <h2 className="font-serif font-bold text-navy text-lg">Мои курсы</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium">Общий прогресс</span>
          <span className="text-sm font-black text-sky tabular-nums">{totalPct}%</span>
        </div>
      </div>

      <div className="divide-y divide-gray-50">
        <Group
          icon={<BookOpen size={15} strokeWidth={1.8} />}
          label="General English"
          rows={general}
          open={openGroups.general}
          onToggle={() => toggle('general')}
        />
        {esp.length > 0 && (
          <Group
            icon={<Briefcase size={15} strokeWidth={1.8} />}
            label="English for Special Purposes"
            rows={esp}
            open={openGroups.esp}
            onToggle={() => toggle('esp')}
          />
        )}
      </div>
    </div>
  )
}

function Group({ icon, label, rows, open, onToggle }: {
  icon: React.ReactNode; label: string; rows: CourseRow[]
  open: boolean; onToggle: () => void
}) {
  const doneCount = rows.filter(r => r.status === 'done').length
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-3 px-6 py-3.5 hover:bg-soft transition-colors text-left"
      >
        <span className="text-sky">{icon}</span>
        <span className="flex-1 font-bold text-navy text-sm">{label}</span>
        <span className="text-xs text-gray-400 font-medium mr-2">{doneCount}/{rows.length}</span>
        {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            {rows.map((row, i) => (
              <CourseRow key={row.id} row={row} isLast={i === rows.length - 1} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function CourseRow({ row, isLast }: { row: CourseRow; isLast: boolean }) {
  const isLocked = row.status === 'locked'

  const StatusIcon = () => {
    if (row.status === 'done')   return <CheckCircle2 size={16} className="text-gold shrink-0" strokeWidth={2} />
    if (row.status === 'active') return <Loader2 size={16} className="text-sky shrink-0 animate-spin" strokeWidth={2} />
    return <Circle size={16} className="text-gray-200 shrink-0" strokeWidth={1.8} />
  }

  const inner = (
    <div className={`flex items-center gap-3 px-6 py-3 ${isLocked ? '' : 'hover:bg-soft'} transition-colors group`}>
      {/* Tree line */}
      <div className="flex flex-col items-center self-stretch mr-1">
        <div className="w-px flex-1 bg-gray-100" />
        {isLast && <div className="w-px flex-1 bg-transparent" />}
      </div>

      <StatusIcon />

      <div className="flex-1 min-w-0">
        <div className={`text-sm font-semibold truncate ${isLocked ? 'text-gray-300' : 'text-navy group-hover:text-sky transition-colors'}`}>
          {row.level} · {row.title}
        </div>
        {!isLocked && (
          <div className="mt-1 h-1 rounded-full bg-gray-100 overflow-hidden w-32">
            <motion.div
              className={`h-full rounded-full ${row.status === 'done' ? 'bg-gold' : 'bg-sky'}`}
              initial={{ width: 0 }}
              animate={{ width: `${row.pct}%` }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {row.hasCert && (
          <span className="flex items-center gap-1 text-xs text-gold font-bold">
            <Award size={12} strokeWidth={2} />
            Сертификат
          </span>
        )}
        {!isLocked && !row.hasCert && (
          <span className={`text-xs font-black tabular-nums ${row.status === 'done' ? 'text-gold' : 'text-sky'}`}>
            {row.pct}%
          </span>
        )}
        {isLocked && (
          <Lock size={13} className="text-gray-200" strokeWidth={1.8} />
        )}
        {row.status === 'active' && (
          <span className="text-xs text-sky font-bold">Продолжить →</span>
        )}
      </div>
    </div>
  )

  return isLocked ? inner : <Link href={`/english/courses/${row.id}`}>{inner}</Link>
}
