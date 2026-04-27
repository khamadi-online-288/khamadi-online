import { Pin, Calendar } from 'lucide-react'

interface Props {
  title: string
  body: string
  authorName?: string
  createdAt: string
  isPinned?: boolean
  targetRole?: string
}

export default function AnnouncementCard({ title, body, authorName, createdAt, isPinned, targetRole }: Props) {
  return (
    <div style={{ background: '#fff', borderRadius: 16, padding: '18px 22px', border: isPinned ? '1.5px solid rgba(201,147,59,0.4)' : '1px solid rgba(27,143,196,0.1)', position: 'relative' as const }}>
      {isPinned && (
        <div style={{ position: 'absolute' as const, top: 14, right: 14, display: 'flex', alignItems: 'center', gap: 4, background: '#fef3c7', color: '#92400e', borderRadius: 6, padding: '2px 8px', fontSize: 10, fontWeight: 800 }}>
          <Pin size={9} /> Закреплено
        </div>
      )}
      <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 8, paddingRight: isPinned ? 90 : 0 }}>{title}</div>
      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.65, whiteSpace: 'pre-wrap' as const, marginBottom: 12 }}>{body}</div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' as const, gap: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: '#94a3b8' }}>
          <Calendar size={11} />
          {authorName && <span>{authorName} ·</span>}
          {new Date(createdAt).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </div>
        {targetRole && targetRole !== 'all' && (
          <span style={{ fontSize: 10, background: '#e0f2fe', color: '#0369a1', borderRadius: 5, padding: '2px 8px', fontWeight: 700 }}>
            {targetRole === 'students' ? 'Студентам' : targetRole === 'teachers' ? 'Преподавателям' : targetRole}
          </span>
        )}
      </div>
    </div>
  )
}
