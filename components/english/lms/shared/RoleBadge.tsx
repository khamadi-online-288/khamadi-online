'use client'
import type { EnglishLMSRole } from '@/lib/english/lms/types'

const cfg: Record<EnglishLMSRole, { label: string; bg: string; color: string }> = {
  student:  { label: 'Студент',       bg: '#e0f2fe', color: '#0369a1' },
  teacher:  { label: 'Преподаватель', bg: '#fef3c7', color: '#92400e' },
  admin:    { label: 'Администратор', bg: '#ede9fe', color: '#4c1d95' },
  curator:  { label: 'Куратор',       bg: '#dcfce7', color: '#166534' },
}

export default function RoleBadge({ role }: { role: EnglishLMSRole | string }) {
  const c = cfg[role as EnglishLMSRole] ?? { label: role, bg: '#f1f5f9', color: '#64748b' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}
