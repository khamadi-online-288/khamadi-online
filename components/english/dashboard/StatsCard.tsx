import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Color = 'navy' | 'gold' | 'mid' | 'green'

const ICON_BG: Record<Color, string> = {
  navy:  'bg-navy text-white',
  gold:  'bg-gold text-white',
  mid:   'bg-mid text-white',
  green: 'bg-green-500 text-white',
}

type Props = {
  icon: ReactNode
  label: string
  value: string | number
  color?: Color
  sub?: string
}

export default function StatsCard({ icon, label, value, color = 'navy', sub }: Props) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-navy/8 shadow-sm">
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center mb-3', ICON_BG[color])}>
        {icon}
      </div>
      <div className="text-2xl font-black text-navy leading-none">{value}</div>
      <div className="text-xs text-gray-500 font-medium mt-1">{label}</div>
      {sub && <div className="text-xs text-gold font-semibold mt-0.5">{sub}</div>}
    </div>
  )
}
