'use client'
import { ReactNode } from 'react'

interface Props {
  title: string
  value: string | number
  icon?: ReactNode
  color?: string
  subtitle?: string
  trend?: { value: number; label: string }
}

export default function StatCard({ title, value, icon, color = '#1B8FC4', subtitle, trend }: Props) {
  return (
    <div style={{
      background: '#fff', borderRadius: 20, padding: '22px 24px',
      boxShadow: '0 2px 12px rgba(27,58,107,0.07)',
      border: '1px solid rgba(27,143,196,0.1)',
    }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>{title}</div>
          <div style={{ fontSize: 30, fontWeight: 900, color: '#0f172a' }}>{value}</div>
          {subtitle && <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>{subtitle}</div>}
        </div>
        {icon && (
          <div style={{ width: 46, height: 46, borderRadius: 14, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {icon}
          </div>
        )}
      </div>
      {trend && (
        <div style={{ marginTop: 10, fontSize: 12, fontWeight: 700, color: trend.value >= 0 ? '#16a34a' : '#dc2626' }}>
          {trend.value >= 0 ? '↑' : '↓'} {Math.abs(trend.value)}% {trend.label}
        </div>
      )}
    </div>
  )
}
