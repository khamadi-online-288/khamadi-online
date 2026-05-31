import Link from 'next/link'

export interface BreadcrumbItem { label: string; href?: string }

export default function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm mb-4" aria-label="Breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span style={{ color: '#CBD5E1' }}>/</span>}
            {item.href && !isLast
              ? <Link href={item.href} className="hover:underline font-medium" style={{ color: '#64748B' }}>{item.label}</Link>
              : <span className="font-semibold" style={{ color: '#1B3A6B' }}>{item.label}</span>
            }
          </span>
        )
      })}
    </nav>
  )
}
