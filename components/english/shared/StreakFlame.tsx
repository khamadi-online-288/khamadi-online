interface StreakFlameProps { streak: number; size?: 'sm' | 'md' | 'lg' }

export default function StreakFlame({ streak, size = 'md' }: StreakFlameProps) {
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1'
  const active = streak > 0
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${cls}`}
      style={{ background: active ? '#FEF0E0' : '#F1F5F9', color: active ? '#EF9F27' : '#94A3B8' }}>
      {active ? '🔥' : '💤'} {streak} дн.
    </span>
  )
}
