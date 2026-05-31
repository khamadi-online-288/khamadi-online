interface XPBadgeProps { xp: number; size?: 'sm' | 'md' | 'lg' }

export default function XPBadge({ xp, size = 'md' }: XPBadgeProps) {
  const cls = size === 'sm' ? 'text-xs px-2 py-0.5' : size === 'lg' ? 'text-base px-4 py-1.5' : 'text-sm px-3 py-1'
  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-bold ${cls}`} style={{ background: '#FAEEDA', color: '#C9933B' }}>
      ⚡ +{xp} XP
    </span>
  )
}
