import { cn } from '@/lib/utils'

type Color = 'navy' | 'gold' | 'mid' | 'green'

const COLORS: Record<Color, string> = {
  navy:  'bg-navy',
  gold:  'bg-gold',
  mid:   'bg-mid',
  green: 'bg-green-500',
}

type Props = {
  value: number
  color?: Color
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const HEIGHTS: Record<string, string> = {
  sm: 'h-1.5',
  md: 'h-2',
  lg: 'h-3',
}

export default function Progress({ value, color = 'navy', size = 'md', showLabel, className }: Props) {
  const pct = Math.min(100, Math.max(0, value))
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <div className={cn('flex-1 bg-light rounded-full overflow-hidden', HEIGHTS[size])}>
        <div
          className={cn('h-full rounded-full transition-all duration-500', COLORS[color])}
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-bold text-navy w-8 text-right">{pct}%</span>
      )}
    </div>
  )
}
