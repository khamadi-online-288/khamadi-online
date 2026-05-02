'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { UserRole } from '@/types/english/database'

type NavItem = { href: string; label: string; icon: string; exact?: boolean }

const STUDENT_NAV: NavItem[] = [
  { href: '/english/dashboard',                        exact: true, label: 'Главная',       icon: '⌂' },
  { href: '/english/dashboard/courses',                             label: 'Курсы',          icon: '▤' },
  { href: '/english/dashboard/leaderboard',                         label: 'Лидерборд',      icon: '◈' },
  { href: '/english/dashboard/placement',                           label: 'Placement Test', icon: '◑' },
  { href: '/english/dashboard/mock-exam',                           label: 'Mock Exam',      icon: '◧' },
  { href: '/english/dashboard/vocabulary',                          label: 'Мой словарь',    icon: '≡' },
  { href: '/english/dashboard/writing',                             label: 'Writing Coach',  icon: '✎' },
  { href: '/english/dashboard/textbooks',                            label: 'Учебники',       icon: '📖' },
  { href: '/english/dashboard/certificates',                        label: 'Сертификаты',    icon: '★' },
  { href: '/english/dashboard/notifications',                       label: 'Уведомления',    icon: '◎' },
  { href: '/english/dashboard/profile',                             label: 'Профиль',        icon: '○' },
  { href: '/english/dashboard/support',                             label: 'Поддержка',      icon: '◻' },
]

const TEACHER_EXTRA: NavItem[] = [
  { href: '/english/teacher', label: 'Мои студенты', icon: '◈' },
]

const ADMIN_EXTRA: NavItem[] = [
  { href: '/english/admin/courses', label: 'Курсы (адм)',  icon: '▲' },
  { href: '/english/admin/users',   label: 'Пользователи', icon: '◆' },
]

const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  student: STUDENT_NAV,
  teacher: [...STUDENT_NAV, ...TEACHER_EXTRA],
  admin:   [...STUDENT_NAV, ...TEACHER_EXTRA, ...ADMIN_EXTRA],
}

type Props = { role: UserRole; userName: string }

function getInitial(name: string): string {
  const trimmed = name?.trim()
  if (!trimmed) return 'U'
  return trimmed.charAt(0).toUpperCase()
}

function getDisplayName(name: string): string {
  const trimmed = name?.trim()
  if (!trimmed) return 'Студент'
  return trimmed
}

export default function Sidebar({ role, userName }: Props) {
  const pathname = usePathname()
  const router   = useRouter()
  const items    = NAV_BY_ROLE[role] ?? STUDENT_NAV

  async function handleLogout() {
    const supabase = createEnglishClient()
    await supabase.auth.signOut()
    router.push('/english/login')
  }

  function isActive(item: NavItem) {
    return item.exact ? pathname === item.href : pathname.startsWith(item.href)
  }

  const initial     = getInitial(userName)
  const displayName = getDisplayName(userName)

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '100%',
        minHeight: '100%',
        padding: '24px 16px',
        background: 'linear-gradient(180deg, #060c1e 0%, #0a1628 50%, #0f1e35 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Logo */}
      <Link href="/english/dashboard" style={{ textDecoration: 'none', display: 'block', marginBottom: 28 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          style={{ padding: '12px 10px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: 'linear-gradient(135deg, #1B8FC4, #1B3A6B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontSize: 18, fontWeight: 900,
              boxShadow: '0 12px 28px rgba(27,143,196,0.35)',
              letterSpacing: '-0.02em',
            }}>
              E
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: 3 }}>
                KHAMADI ENGLISH
              </div>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.06em' }}>
                ENGLISH LEARNING PLATFORM
              </div>
            </div>
          </div>
        </motion.div>
      </Link>

      {/* User */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 14px', borderRadius: 14, marginBottom: 20,
        background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)',
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 10, flexShrink: 0,
          background: 'linear-gradient(135deg, #1B8FC4, #2E5FA3)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontSize: 14, fontWeight: 900,
        }}>
          {initial}
        </div>
        <span style={{
          fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.75)',
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
        }}>
          {displayName}
        </span>
      </div>

      {/* Nav label */}
      <div style={{
        fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.30)',
        letterSpacing: '0.10em', textTransform: 'uppercase',
        paddingLeft: 14, marginBottom: 10,
      }}>
        Навигация
      </div>

      {/* Nav items */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {items.map((item, idx) => {
          const active = isActive(item)
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
                    display: 'flex', alignItems: 'center', gap: 12,
                    minHeight: 48, padding: '0 14px', borderRadius: 14,
                    color: active ? '#fff' : 'rgba(255,255,255,0.55)',
                    background: active
                      ? 'linear-gradient(90deg, rgba(27,143,196,0.22), rgba(27,143,196,0.08))'
                      : 'transparent',
                    border: active
                      ? '1px solid rgba(27,143,196,0.28)'
                      : '1px solid transparent',
                    fontSize: 14, fontWeight: active ? 800 : 700,
                    letterSpacing: '-0.01em', cursor: 'pointer',
                    transition: 'color 0.15s',
                  }}
                >
                  {active && (
                    <motion.div
                      layoutId="english-sidebar-active"
                      style={{
                        position: 'absolute', left: 7,
                        top: '50%', transform: 'translateY(-50%)',
                        width: 3, height: 24, borderRadius: 999,
                        background: 'linear-gradient(180deg, #1B8FC4, #2E5FA3)',
                        boxShadow: '0 0 10px rgba(27,143,196,0.7)',
                      }}
                    />
                  )}
                  <span style={{ fontSize: 16, lineHeight: 1, opacity: active ? 1 : 0.75, flexShrink: 0, paddingLeft: active ? 8 : 0 }}>
                    {item.icon}
                  </span>
                  <span style={{ lineHeight: 1.3 }}>{item.label}</span>
                </motion.div>
              </Link>
            </motion.div>
          )
        })}
      </nav>

      {/* Bottom */}
      <div style={{ marginTop: 'auto', paddingTop: 20 }}>
        <motion.button
          whileHover={{ x: 2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 10,
            minHeight: 42, padding: '0 14px', borderRadius: 12, marginBottom: 12,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.07)',
            color: 'rgba(255,255,255,0.35)', fontSize: 13, fontWeight: 700, cursor: 'pointer',
            transition: 'color 0.15s',
          }}
        >
          <span style={{ fontSize: 14 }}>↩</span>
          Выйти
        </motion.button>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          style={{
            borderRadius: 22, padding: 20,
            background: 'linear-gradient(135deg, rgba(27,143,196,0.14) 0%, rgba(27,59,107,0.08) 100%)',
            border: '1px solid rgba(27,143,196,0.20)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 800, color: 'rgba(255,255,255,0.40)', textTransform: 'uppercase', letterSpacing: '0.10em', marginBottom: 10 }}>
            Focus
          </div>
          <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1.1, color: '#fff', letterSpacing: '-0.04em', marginBottom: 8 }}>
            Speak. Write. Grow.
          </div>
          <div style={{ fontSize: 13, lineHeight: 1.75, color: 'rgba(255,255,255,0.55)', marginBottom: 16 }}>
            Каждый урок приближает к следующему уровню.
          </div>
          <motion.a
            href="/english/dashboard/courses"
            whileHover={{ scale: 1.04, boxShadow: '0 12px 28px rgba(27,143,196,0.40)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              textDecoration: 'none', display: 'flex', alignItems: 'center',
              justifyContent: 'center', minHeight: 42, borderRadius: 14,
              background: 'linear-gradient(135deg, #1B8FC4, #2E5FA3)',
              color: '#fff', fontSize: 13, fontWeight: 800,
              boxShadow: '0 8px 22px rgba(27,143,196,0.30)',
              letterSpacing: '-0.01em',
            }}
          >
            Продолжить обучение
          </motion.a>
        </motion.div>
      </div>
    </motion.aside>
  )
}