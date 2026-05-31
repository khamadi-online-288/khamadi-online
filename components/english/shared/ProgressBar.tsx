interface ProgressBarProps {
  value: number
  color?: string
  height?: number
  showLabel?: boolean
  className?: string
}

export default function ProgressBar({ value, color = '#1B3A6B', height = 6, showLabel = false, className = '' }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full ${className}`}>
      <div className="w-full rounded-full overflow-hidden" style={{ height, background: 'rgba(27,58,107,0.08)' }}>
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: color }} />
      </div>
      {showLabel && <span className="text-xs font-semibold mt-1 block" style={{ color }}>{pct}%</span>}
    </div>
  )
}
