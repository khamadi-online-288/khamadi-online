import type { CefrLevel } from '@/types/english/database'

const LEVEL_CONFIG: Record<CefrLevel, { label: string; bg: string; text: string; border: string }> = {
  A1: { label: 'Beginner',           bg: 'bg-emerald-50',  text: 'text-emerald-700',  border: 'border-emerald-200' },
  A2: { label: 'Elementary',         bg: 'bg-teal-50',     text: 'text-teal-700',     border: 'border-teal-200'    },
  B1: { label: 'Intermediate',       bg: 'bg-sky/10',      text: 'text-sky',          border: 'border-sky/30'      },
  B2: { label: 'Upper-Intermediate', bg: 'bg-mid/10',      text: 'text-mid',          border: 'border-mid/30'      },
  C1: { label: 'Advanced',           bg: 'bg-navy/10',     text: 'text-navy',         border: 'border-navy/30'     },
  C2: { label: 'Proficient',         bg: 'bg-purple-50',   text: 'text-purple-700',   border: 'border-purple-200'  },
}

type Props = {
  level: CefrLevel
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
}

export default function LevelBadge({ level, size = 'md', showLabel = true }: Props) {
  const cfg = LEVEL_CONFIG[level] ?? LEVEL_CONFIG.B1
  const sz  = size === 'sm'
    ? 'px-2 py-0.5 text-xs gap-1'
    : size === 'lg'
    ? 'px-4 py-2 text-base gap-2'
    : 'px-3 py-1 text-sm gap-1.5'

  return (
    <span className={`inline-flex items-center rounded-full border font-bold ${sz} ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span>{level}</span>
      {showLabel && (
        <>
          <span className="opacity-40">·</span>
          <span className="font-medium opacity-80">{cfg.label}</span>
        </>
      )}
    </span>
  )
}
