'use client'
import { ReactNode } from 'react'

export default function EmptyState({ icon, title, description, action }: {
  icon?: ReactNode; title: string; description?: string; action?: ReactNode
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 24px', gap: 16, textAlign: 'center' }}>
      {icon && <div style={{ width: 60, height: 60, borderRadius: 18, background: 'rgba(27,143,196,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B8FC4' }}>{icon}</div>}
      <div style={{ fontSize: 17, fontWeight: 800, color: '#1e293b' }}>{title}</div>
      {description && <div style={{ fontSize: 13, color: '#64748b', maxWidth: 300, lineHeight: 1.7 }}>{description}</div>}
      {action}
    </div>
  )
}
