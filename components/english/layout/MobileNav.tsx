'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, BookOpen, Award, User, Bell, Menu, X } from 'lucide-react'

const NAV = [
  { label: 'Дашборд',     href: '/english/dashboard',     icon: LayoutDashboard },
  { label: 'Курсы',       href: '/english/courses',        icon: BookOpen },
  { label: 'Уведомления', href: '/english/notifications',  icon: Bell },
  { label: 'Сертификаты', href: '/english/certificates',   icon: Award },
  { label: 'Профиль',     href: '/english/profile',        icon: User },
]

export default function MobileNav() {
  const pathname  = usePathname()
  const [open, setOpen] = useState(false)

  return (
    <>
      {/* Bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-navy/10 flex items-center justify-around px-2 py-1 z-50 md:hidden">
        {NAV.slice(0, 4).map(item => {
          const Icon   = item.icon
          const active = pathname === item.href || (item.href !== '/english/dashboard' && pathname.startsWith(item.href))
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition ${
                active ? 'text-navy' : 'text-gray-400 hover:text-navy'
              }`}
            >
              <Icon size={20} />
              <span className="text-[10px] font-bold">{item.label}</span>
            </Link>
          )
        })}
        <button
          onClick={() => setOpen(true)}
          className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl text-gray-400 hover:text-navy transition"
        >
          <Menu size={20} />
          <span className="text-[10px] font-bold">Ещё</span>
        </button>
      </div>

      {/* Drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="font-black text-navy">Меню</span>
              <button onClick={() => setOpen(false)}><X size={20} className="text-gray-400" /></button>
            </div>
            <div className="space-y-1">
              {NAV.map(item => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-light font-semibold text-navy transition"
                  >
                    <Icon size={18} className="text-gold" />
                    {item.label}
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
