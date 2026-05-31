'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export interface SidebarLink { href: string; label: string; icon: string; badge?: string | number }

interface SidebarProps {
  links: SidebarLink[]
  logo?: React.ReactNode
  footer?: React.ReactNode
}

export default function Sidebar({ links, logo, footer }: SidebarProps) {
  const pathname = usePathname()
  return (
    <aside className="flex flex-col w-60 shrink-0 h-full" style={{ background: '#fff', borderRight: '1px solid rgba(27,58,107,0.1)' }}>
      {logo && (
        <div className="px-5 py-5 border-b" style={{ borderColor: 'rgba(27,58,107,0.08)' }}>
          {logo}
        </div>
      )}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {links.map((link) => {
          const active = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href + '/'))
          return (
            <Link key={link.href} href={link.href}
              className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${active ? 'font-semibold' : 'text-[#475569] hover:text-[#1B3A6B]'}`}
              style={{ background: active ? 'rgba(27,58,107,0.1)' : 'transparent', color: active ? '#1B3A6B' : undefined }}>
              <span className="text-base">{link.icon}</span>
              <span className="flex-1">{link.label}</span>
              {link.badge !== undefined && (
                <span className="text-xs font-bold px-1.5 py-0.5 rounded-full text-white min-w-[20px] text-center" style={{ background: '#1B3A6B' }}>
                  {link.badge}
                </span>
              )}
            </Link>
          )
        })}
      </nav>
      {footer && (
        <div className="px-3 py-4 border-t" style={{ borderColor: 'rgba(27,58,107,0.08)' }}>
          {footer}
        </div>
      )}
    </aside>
  )
}
