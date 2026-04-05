'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const items = [
  { href: '/dashboard', label: 'Басты бет' },
  { href: '/dashboard/simulator', label: 'ҰБТ симуляторы' },
  { href: '/dashboard/subjects', label: 'Пәндер' },
  { href: '/dashboard/ai-tutor', label: 'AI тьютор' },
  { href: '/dashboard/ai-analysis', label: 'AI анализ' },
  { href: '/dashboard/study-plan', label: 'Оқу жоспары' },
  { href: '/dashboard/progress', label: 'Прогресс' },
  { href: '/dashboard/leaderboard', label: 'Рейтинг' },
  { href: '/dashboard/achievements', label: 'Жетістіктер' },
  { href: '/dashboard/universities', label: 'Университеттер' },
  { href: '/dashboard/ubt-info', label: 'ҰБТ туралы' },
  { href: '/dashboard/profile', label: 'Профиль' },
]

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside
      style={{
        width: '100%',
        boxSizing: 'border-box',
        height: '100vh',
        position: 'sticky',
        top: 0,
        overflowY: 'auto',
        padding: '24px 18px',
        background:
          'linear-gradient(180deg, #050816 0%, #0B1120 48%, #0F172A 100%)',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Link
        href="/dashboard"
        style={{
          textDecoration: 'none',
          display: 'block',
          marginBottom: 28,
        }}
      >
        <div
          style={{
            padding: '6px 6px 18px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff',
                fontSize: 18,
                fontWeight: 900,
                boxShadow: '0 16px 28px rgba(14,165,233,0.22)',
                flexShrink: 0,
              }}
            >
              K
            </div>

            <div style={{ minWidth: 0 }}>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 900,
                  color: '#FFFFFF',
                  letterSpacing: '-0.02em',
                  marginBottom: 3,
                  lineHeight: 1.1,
                }}
              >
                KHAMADI ONLINE
              </div>

              <div
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: 'rgba(255,255,255,0.52)',
                  letterSpacing: '0.04em',
                  lineHeight: 1.3,
                }}
              >
                PREMIUM UBT PLATFORM
              </div>
            </div>
          </div>
        </div>
      </Link>

      <div
        style={{
          display: 'grid',
          gap: 6,
        }}
      >
        {items.map((item) => {
          const active =
            pathname === item.href ||
            (item.href !== '/dashboard' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  position: 'relative',
                  minHeight: 50,
                  display: 'flex',
                  alignItems: 'center',
                  padding: '0 14px',
                  borderRadius: 16,
                  color: active ? '#FFFFFF' : 'rgba(255,255,255,0.68)',
                  background: active
                    ? 'linear-gradient(90deg, rgba(56,189,248,0.16), rgba(56,189,248,0.04))'
                    : 'transparent',
                  border: active
                    ? '1px solid rgba(56,189,248,0.18)'
                    : '1px solid transparent',
                  fontSize: 14,
                  fontWeight: active ? 800 : 700,
                  letterSpacing: '-0.01em',
                  transition: 'all 0.18s ease',
                }}
              >
                {active && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 22,
                      borderRadius: 999,
                      background: 'linear-gradient(180deg, #38BDF8, #0EA5E9)',
                    }}
                  />
                )}

                <span
                  style={{
                    paddingLeft: active ? 10 : 0,
                    lineHeight: 1.35,
                  }}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          )
        })}
      </div>

      <div style={{ marginTop: 'auto' }}>
        <div
          style={{
            marginTop: 18,
            borderRadius: 22,
            padding: 18,
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.03) 100%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.18)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: 'rgba(255,255,255,0.55)',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: 10,
            }}
          >
            Focus
          </div>

          <div
            style={{
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1.1,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              marginBottom: 8,
            }}
          >
            ҰБТ 120+
          </div>

          <div
            style={{
              fontSize: 13,
              lineHeight: 1.7,
              color: 'rgba(255,255,255,0.62)',
              marginBottom: 14,
            }}
          >
            Күн сайын аз, бірақ өте сапалы дайындық.
          </div>

          <a
            href="/dashboard/simulator"
            style={{
              textDecoration: 'none',
              minHeight: 40,
              padding: '0 14px',
              borderRadius: 14,
              background: '#FFFFFF',
              color: '#0F172A',
              fontSize: 13,
              fontWeight: 800,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            Симулятор ашу
          </a>
        </div>
      </div>
    </aside>
  )
}