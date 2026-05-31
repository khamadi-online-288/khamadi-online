import type { CEFRLevel } from '@/lib/english/types'
import { CEFR_LEVELS } from '@/lib/english/constants'

interface LevelBadgeProps {
  level: string
  size?: 'sm' | 'md' | 'lg'
  showName?: boolean
}

export default function LevelBadge({ level, size = 'md', showName = false }: LevelBadgeProps) {
  const info = CEFR_LEVELS.find((c) => c.code === level)
  const { color = '#1B3A6B', bg = '#EBF0F8', name = level } = info ?? {}
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-sm px-4 py-1.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full font-bold ${sizeClass}`} style={{ background: bg, color }}>
      <span>{level}</span>
      {showName && <span className="font-normal opacity-80">{name}</span>}
    </span>
  )
}
