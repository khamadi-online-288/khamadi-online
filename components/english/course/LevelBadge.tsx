import { cn } from '@/lib/utils'
import type { CourseLevel } from '@/types/english/database'

const COLOR: Record<string, string> = {
  A1:    'bg-gray-100 text-gray-600 border-gray-200',
  A2:    'bg-green-50 text-green-700 border-green-200',
  B1:    'bg-blue-50 text-blue-700 border-blue-200',
  B2:    'bg-mid/10 text-mid border-mid/20',
  C1:    'bg-navy/10 text-navy border-navy/20',
  'A2-B1': 'bg-green-50 text-green-700 border-green-200',
  'B1-C1': 'bg-mid/10 text-mid border-mid/20',
}

type Props = { level: string; size?: 'sm' | 'md'; className?: string }

export default function LevelBadge({ level, size = 'sm', className }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center font-black rounded-full border',
      COLOR[level] ?? 'bg-gold/10 text-gold border-gold/20',
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
      className
    )}>
      {level}
    </span>
  )
}
