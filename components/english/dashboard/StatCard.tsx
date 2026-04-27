'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import type { ReactNode } from 'react'

type Trend = { value: number; label?: string }

type Props = {
  icon:    ReactNode
  label:   string
  value:   number | string
  color:   'sky' | 'emerald' | 'violet' | 'amber' | 'gold'
  trend?:  Trend
  suffix?: string
  format?: 'number' | 'percent' | 'fraction'
  total?:  number
}

const COLOR: Record<Props['color'], { ring: string; icon: string; glow: string }> = {
  sky:     { ring: 'bg-sky/10',     icon: 'text-sky',         glow: 'group-hover:shadow-sky/20'     },
  emerald: { ring: 'bg-emerald-50', icon: 'text-emerald-600', glow: 'group-hover:shadow-emerald-200' },
  violet:  { ring: 'bg-violet-50',  icon: 'text-violet-600',  glow: 'group-hover:shadow-violet-200'  },
  amber:   { ring: 'bg-amber-50',   icon: 'text-amber-600',   glow: 'group-hover:shadow-amber-200'   },
  gold:    { ring: 'bg-gold/10',    icon: 'text-gold',        glow: 'group-hover:shadow-gold/20'     },
}

function useCounter(end: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active || end === 0) { setCount(end); return }
    let frame = 0
    const steps = Math.ceil(duration / 16)
    const timer = setInterval(() => {
      frame++
      setCount(Math.round((frame / steps) * end))
      if (frame >= steps) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [end, active, duration])
  return count
}

export default function StatCard({ icon, label, value, color, trend, suffix = '', format = 'number', total }: Props) {
  const ref     = useRef<HTMLDivElement>(null)
  const inView  = useInView(ref, { once: true, margin: '-40px' })
  const numVal  = typeof value === 'number' ? value : 0
  const counted = useCounter(numVal, inView)
  const c       = COLOR[color]

  const display =
    typeof value === 'string' ? value
    : format === 'fraction' && total != null ? `${counted}/${total}`
    : format === 'percent'  ? `${counted}%`
    : `${counted}${suffix}`

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      whileHover={{ y: -4, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
      className={`group relative bg-white rounded-2xl border border-sky/10 p-4 flex flex-col gap-2.5 cursor-default shadow-sm hover:shadow-md ${c.glow} transition-shadow min-w-0`}
    >
      <div className={`w-8 h-8 rounded-lg ${c.ring} flex items-center justify-center ${c.icon} shrink-0`}>
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-2xl font-serif font-bold text-navy tabular-nums leading-none mb-1 truncate">
          {display}
        </div>
        <div className="text-xs text-gray-500 font-medium leading-tight truncate">{label}</div>
      </div>

      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold ${trend.value >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
          <span>{trend.value >= 0 ? '↑' : '↓'}</span>
          <span>{Math.abs(trend.value)}%</span>
          {trend.label && <span className="font-normal text-gray-400 ml-0.5">{trend.label}</span>}
        </div>
      )}
    </motion.div>
  )
}
