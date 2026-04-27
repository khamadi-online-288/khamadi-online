'use client'

const MAP: Record<string, { label: string; bg: string; color: string }> = {
  not_started: { label: 'Не начато',    bg: '#f1f5f9', color: '#64748b' },
  in_progress: { label: 'В процессе',   bg: '#fef3c7', color: '#92400e' },
  completed:   { label: 'Завершено',    bg: '#dcfce7', color: '#166534' },
  submitted:   { label: 'Сдано',        bg: '#dbeafe', color: '#1e40af' },
  reviewed:    { label: 'Проверено',    bg: '#fef3c7', color: '#92400e' },
  graded:      { label: 'Оценено',      bg: '#dcfce7', color: '#166534' },
  returned:    { label: 'Возвращено',   bg: '#fee2e2', color: '#991b1b' },
  present:     { label: 'Присутствует', bg: '#dcfce7', color: '#166534' },
  absent:      { label: 'Отсутствует',  bg: '#fee2e2', color: '#991b1b' },
  late:        { label: 'Опоздал',      bg: '#fef3c7', color: '#92400e' },
  excused:     { label: 'Уваж.',        bg: '#ede9fe', color: '#4c1d95' },
}

export default function StatusBadge({ status }: { status: string }) {
  const c = MAP[status] ?? { label: status, bg: '#f1f5f9', color: '#64748b' }
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', padding: '3px 10px', borderRadius: 999, fontSize: 12, fontWeight: 700, background: c.bg, color: c.color }}>
      {c.label}
    </span>
  )
}
