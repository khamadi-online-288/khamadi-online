import type { CefrLevel } from '@/types/english/database'
import Badge from '@/components/english/ui/Badge'

const LEVEL_LABEL: Record<CefrLevel, string> = {
  A1: 'Beginner',
  A2: 'Elementary',
  B1: 'Intermediate',
  B2: 'Upper-Intermediate',
  C1: 'Advanced',
  C2: 'Proficient',
}

type Props = { userName: string; level: string }

export default function Navbar({ userName, level }: Props) {
  const label = LEVEL_LABEL[level as CefrLevel] ?? level

  return (
    <header className="h-14 bg-white border-b border-navy/8 px-6 flex items-center justify-between shrink-0">
      <div className="text-sm text-gray-400 font-medium">
        Добро пожаловать, <span className="text-navy font-bold">{userName}</span>
      </div>
      {level && (
        <Badge color="navy" size="sm">
          {level} — {label}
        </Badge>
      )}
    </header>
  )
}
