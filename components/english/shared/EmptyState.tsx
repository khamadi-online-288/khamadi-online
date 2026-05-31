import Link from 'next/link'

interface EmptyStateProps {
  icon?: string
  title: string
  description?: string
  action?: { label: string; href?: string; onClick?: () => void }
}

export default function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-bold mb-2" style={{ color: '#1B3A6B' }}>{title}</h3>
      {description && <p className="text-sm max-w-xs" style={{ color: '#64748B' }}>{description}</p>}
      {action && (
        <div className="mt-6">
          {action.href ? (
            <Link href={action.href} className="inline-block px-6 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: '#1B3A6B' }}>
              {action.label}
            </Link>
          ) : (
            <button className="px-6 py-2.5 rounded-full text-sm font-semibold text-white" style={{ background: '#1B3A6B' }} onClick={action.onClick}>
              {action.label}
            </button>
          )}
        </div>
      )}
    </div>
  )
}
