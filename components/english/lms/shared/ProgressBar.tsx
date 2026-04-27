'use client'
import { progressColor } from '@/lib/english/lms/progress'

export default function ProgressBar({ value, max = 100, height = 8, showLabel = false, forceColor }: {
  value: number; max?: number; height?: number; showLabel?: boolean; forceColor?: string
}) {
  const pct = Math.min(100, Math.max(0, Math.round((value / max) * 100)))
  const color = forceColor ?? progressColor(pct)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      <div style={{ flex: 1, background: '#e2e8f0', borderRadius: 999, height, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: color, borderRadius: 999, transition: 'width 0.3s' }} />
      </div>
      {showLabel && <span style={{ fontSize: 12, fontWeight: 700, color: '#475569', minWidth: 34, textAlign: 'right' }}>{pct}%</span>}
    </div>
  )
}
