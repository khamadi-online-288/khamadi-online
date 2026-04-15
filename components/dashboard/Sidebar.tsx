'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

type NavItem = {
  href: string
  label: string
  icon: string
}

const items: NavItem[] = [
  { href: '/dashboard',                  label: 'Басты бет',       icon: '⌂' },
  { href: '/dashboard/simulator',        label: 'ҰБТ симуляторы', icon: '◎' },
  { href: '/dashboard/subjects',         label: 'Пәндер',          icon: '▤' },
  { href: '/dashboard/ai-tutor',         label: 'AI тьютор',       icon: '✦' },
  { href: '/dashboard/ai-analysis',      label: 'AI анализ',       icon: '◈' },
  { href: '/dashboard/study-plan',       label: 'Оқу жоспары',     icon: '◻' },
  { href: '/dashboard/progress',         label: 'Прогресс',        icon: '▲' },
  { href: '/dashboard/leaderboard',      label: 'Рейтинг',         icon: '◆' },
  { href: '/dashboard/achievements',     label: 'Жетістіктер',     icon: '★' },
  { href: '/dashboard/universities',     label: 'Университеттер',  icon: '◑' },
  { href: '/dashboard/ubt-info',         label: 'ҰБТ туралы',      icon: 'ℹ' },
  { href: '/dashboard/profile',          label: 'Профиль',         icon: '○' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        minHeight: '100%',
        padding: '24px 16px',
        background:
          'linear-gradient(180deg, #060c1e 0%, #0a1628 50%, #0f1e35 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Link href="/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{
            padding: '12px 10px 16px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                fontWeight: 900,
                boxShadow: '0 12px 28px rgba(14,165,233,0.30)',
                flexShrink: 0,
                letterSpacing: '-0.02em',
              }}
            >
              K
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 3 }}>
                KHAMADI ONLINE
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
                PREMIUM UBT PLATFORM
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* Nav section label */}
      <div
        style={{
          fontSize: 10,
          fontWeight: 800,
          color: 'rgba(255,255,255,0.30)',
          letterSpacing: '0.10em',
          textTransform: 'uppercase',
          paddingLeft: 14,
          marginBottom: 10,
        }}
      >
        Навигация
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, idx) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: idx * 0.03 }}
            >
              <Link href={item.href} style={{ textDecoration: 'none' }}>
                <motion.div
                  whileHover={{ x: 2, backgroundColor: 'rgba(255,255,255,0.08)' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    minHeight: 48,
                    padding: '0 14px',
                    borderRadius: 14,
                    color: active ? '#ffffff' : 'rgba(255,255,255,0.60)',
                    background: active
                      ? 'linear-gradient(90deg, rgba(56,189,248,0.18), rgba(56,189,248,0.06))'
                      : 'transparent',
                    border: active
                      ? '1px solid rgba(56,189,248,0.22)'
                      : '1px solid transparent',
                    fontSize: 14,
                    fontWeight: active ? 800 : 700,
                    letterSpacing: '-0.01em',
                    transition: 'color 0.15s',
                    cursor: 'pointer',
                  }}
                >
                  {/* Active indicator bar */}
                  {active && (
                    <motion.div
                      layoutId="sidebar-active"
                      style={{
                        position: 'absolute',
                        left: 7,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: 3,
                        height: 24,
                        borderRadius: 999,
                        background: 'linear-gradient(180deg, #38bdf8, #0ea5e9)',
                        boxShadow: '0 0 10px rgba(56,189,248,0.6)',
                      }}
                    />
                  )}

                  {/* Icon */}
                  <span
                    style={{
                      fontSize: 16,
                      lineHeight: 1,
                      opacity: active ? 1 : 0.8,
                      flexShrink: 0,
                      paddingLeft: active ? 8 : 0,
                    }}
                  >
                    {item.icon}
                  </span>

                  <span style={{ paddingLeft: active ? 0 : 0, lineHeight: 1.3 }}>
                    {item.label}
                  </span>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom focus card */}
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            borderRadius: 22,
            padding: 20,
            background:
              'linear-gradient(135deg, rgba(56,189,248,0.12) 0%, rgba(14,165,233,0.06) 100%)',
            border: '1px solid rgba(56,189,248,0.18)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.16)',
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: 800,
              color: 'rgba(255,255,255,0.45)',
              textTransform: 'uppercase',
              letterSpacing: '0.10em',
              marginBottom: 10,
            }}
          >
            Focus
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#ffffff',
              letterSpacing: '-0.04em',
              marginBottom: 8,
            }}
          >
            ҰБТ 120+
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.75,
              color: 'rgba(255,255,255,0.58)',
              marginBottom: 16,
            }}
          >
            Күн сайын аз, бірақ өте сапалы дайындық.
          </div>

          <motion.a
            href="/dashboard/simulator"
            whileHover={{ scale: 1.04, boxShadow: '0 12px 28px rgba(14,165,233,0.32)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 42,
              borderRadius: 14,
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#ffffff',
              fontSize: 13,
              fontWeight: 800,
              boxShadow: '0 8px 22px rgba(14,165,233,0.28)',
              letterSpacing: '-0.01em',
            }}
          >
            Симулятор ашу
          </motion.a>
        </motion.div>
      </div>
    </motion.aside>
  )
}
