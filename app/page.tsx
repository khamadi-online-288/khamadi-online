'use client'

import { useEffect, useRef, useState } from 'react'

function useFadeUp() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('fade-visible')
          observer.unobserve(el)
        }
      },
      { threshold: 0.12 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return ref
}

function NavButton({
  children,
  onClick,
}: {
  children: React.ReactNode
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontSize: 14,
        fontWeight: 800,
        color: '#334155',
        padding: '8px 14px',
        borderRadius: 12,
        fontFamily: 'Montserrat, sans-serif',
        transition: 'all .22s ease',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(14,165,233,0.08)'
        e.currentTarget.style.color = '#0284c7'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'transparent'
        e.currentTarget.style.color = '#334155'
      }}
    >
      {children}
    </button>
  )
}

function MainButton({
  children,
  href,
  primary = true,
}: {
  children: React.ReactNode
  href: string
  primary?: boolean
}) {
  const [hover, setHover] = useState(false)

  return (
    <button
      onClick={() => {
        window.location.href = href
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        border: primary ? 'none' : '1.5px solid rgba(14,165,233,0.16)',
        background: primary
          ? hover
            ? 'linear-gradient(135deg,#0284c7,#0ea5e9)'
            : 'linear-gradient(135deg,#0ea5e9,#38bdf8)'
          : hover
            ? 'rgba(14,165,233,0.06)'
            : '#fff',
        color: primary ? '#fff' : '#0f172a',
        borderRadius: 18,
        padding: '16px 24px',
        fontSize: 15,
        fontWeight: 800,
        cursor: 'pointer',
        fontFamily: 'Montserrat, sans-serif',
        boxShadow: primary
          ? hover
            ? '0 18px 40px rgba(14,165,233,0.28)'
            : '0 12px 30px rgba(14,165,233,0.20)'
          : 'none',
        transform: hover ? 'translateY(-2px)' : 'translateY(0)',
        transition: 'all .26s ease',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        justifyContent: 'center',
        minWidth: 220,
      }}
    >
      {children}
    </button>
  )
}

function InfoCard({
  icon,
  title,
  text,
}: {
  icon: string
  title: string
  text: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        borderRadius: 28,
        padding: '28px 24px',
        background: hover ? 'linear-gradient(180deg,#ffffff,#f8fcff)' : '#ffffff',
        border: '1px solid rgba(226,232,240,0.95)',
        boxShadow: hover
          ? '0 22px 50px rgba(15,23,42,0.08)'
          : '0 10px 30px rgba(15,23,42,0.05)',
        transform: hover ? 'translateY(-6px)' : 'translateY(0)',
        transition: 'all .3s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,
          borderRadius: 18,
          background: 'linear-gradient(135deg,#e0f2fe,#f0f9ff)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 28,
          marginBottom: 16,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 19,
          fontWeight: 900,
          color: '#0f172a',
          marginBottom: 10,
          letterSpacing: '-0.03em',
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 14,
          lineHeight: 1.85,
          color: '#64748b',
          fontWeight: 600,
        }}
      >
        {text}
      </div>
    </div>
  )
}

function DirectionCard({
  icon,
  title,
  desc,
  points,
  href,
  accent,
  accentBg,
  accentBorder,
}: {
  icon: string
  title: string
  desc: string
  points: string[]
  href: string
  accent: string
  accentBg: string
  accentBorder: string
}) {
  const [hover, setHover] = useState(false)

  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => {
        window.location.href = href
      }}
      style={{
        borderRadius: 32,
        padding: '34px 28px',
        background: hover ? `linear-gradient(135deg,${accentBg},#fff)` : '#fff',
        border: `1.5px solid ${hover ? accentBorder : 'rgba(226,232,240,0.9)'}`,
        boxShadow: hover
          ? `0 28px 64px ${accent}20`
          : '0 10px 30px rgba(15,23,42,0.05)',
        transform: hover ? 'translateY(-8px)' : 'translateY(0)',
        transition: 'all .32s cubic-bezier(0.22,1,0.36,1)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        minHeight: 420,
      }}
    >
      <div
        style={{
          width: 68,
          height: 68,
          borderRadius: 22,
          background: accentBg,
          border: `1px solid ${accentBorder}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 30,
          marginBottom: 20,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: '#0f172a',
          letterSpacing: '-0.04em',
          marginBottom: 12,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 15,
          color: '#64748b',
          fontWeight: 600,
          lineHeight: 1.85,
          marginBottom: 20,
        }}
      >
        {desc}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, flex: 1, marginBottom: 22 }}>
        {points.map((point) => (
          <div
            key={point}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: 10,
              fontSize: 14,
              fontWeight: 700,
              color: '#334155',
              lineHeight: 1.75,
            }}
          >
            <span style={{ color: accent }}>●</span>
            <span>{point}</span>
          </div>
        ))}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation()
          window.location.href = href
        }}
        style={{
          width: '100%',
          padding: '14px 0',
          borderRadius: 16,
          border: 'none',
          cursor: 'pointer',
          fontSize: 15,
          fontWeight: 800,
          background: hover ? accent : `${accent}16`,
          color: hover ? '#fff' : accent,
          transition: 'all .26s ease',
          fontFamily: 'Montserrat, sans-serif',
        }}
      >
        Бағытқа өту →
      </button>
    </div>
  )
}

export default function HomePage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  const heroRef = useFadeUp()
  const aboutRef = useFadeUp()
  const philosophyRef = useFadeUp()
  const directionRef = useFadeUp()
  const valueRef = useFadeUp()
  const ctaRef = useFadeUp()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navItems = [
    ['about', 'Біз туралы'],
    ['philosophy', 'Философия'],
    ['directions', 'Бағыттар'],
    ['values', 'Артықшылықтар'],
    ['contact', 'Байланыс'],
  ] as const

  return (
    <div
      style={{
        fontFamily: 'Montserrat, sans-serif',
        background: '#fff',
        color: '#0f172a',
        overflowX: 'hidden',
      }}
    >
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: '0 5%',
          background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.72)',
          backdropFilter: 'blur(22px)',
          borderBottom: scrolled ? '1px solid rgba(14,165,233,0.10)' : '1px solid transparent',
          boxShadow: scrolled ? '0 6px 24px rgba(15,23,42,0.05)' : 'none',
          transition: 'all .3s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            height: 74,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 11, cursor: 'pointer' }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <img src="/icon.png" alt="KHAMADI ONLINE" style={{ width: 42, height: 42, borderRadius: 12, objectFit: 'contain' }} />

            <div style={{ lineHeight: 1.05 }}>
              <div style={{ fontSize: 16, fontWeight: 900, letterSpacing: '-0.04em' }}>
                KHAMADI <span style={{ color: '#0ea5e9' }}>ONLINE</span>
              </div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginTop: 4 }}>
                Білім. Еңбек. Сенім.
              </div>
            </div>
          </div>

          <div className="hm-nav" style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {navItems.map(([id, label]) => (
              <NavButton
                key={id}
                onClick={() => {
                  setMenuOpen(false)
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
              >
                {label}
              </NavButton>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="hm-social" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <a href="https://www.instagram.com/khamadi.online" target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: 'linear-gradient(135deg,#f09433,#dc2743,#bc1888)', color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                📸 Instagram
              </a>
              <a href="https://wa.me/77066405577" target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 800, textDecoration: 'none' }}>
                💬 WhatsApp
              </a>
            </div>

            <button
              className="hm-burger"
              onClick={() => setMenuOpen((v) => !v)}
              style={{
                display: 'none',
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                fontSize: 24,
                color: '#0f172a',
                padding: 4,
              }}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div
            style={{
              borderTop: '1px solid rgba(14,165,233,0.10)',
              padding: '10px 0 16px',
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
            }}
          >
            {navItems.map(([id, label]) => (
              <button
                key={id}
                onClick={() => {
                  setMenuOpen(false)
                  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#0f172a',
                  padding: '12px 20px',
                  textAlign: 'left',
                  borderRadius: 12,
                  fontFamily: 'Montserrat, sans-serif',
                }}
              >
                {label}
              </button>
            ))}

          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '100px 5% 0',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(160deg,#f0f9ff 0%,#ffffff 55%)',
        }}
      >
        {/* ambient blobs */}
        <div style={{ position:'absolute', top:80, left:'-80px', width:480, height:480, borderRadius:'50%', background:'rgba(56,189,248,0.10)', filter:'blur(90px)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:0, right:'38%', width:340, height:340, borderRadius:'50%', background:'rgba(14,165,233,0.07)', filter:'blur(80px)', pointerEvents:'none' }} />

        <div
          ref={heroRef}
          className="fade-start hero-grid"
          style={{
            maxWidth: 1280,
            width: '100%',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 0,
            alignItems: 'stretch',
            position: 'relative',
            zIndex: 2,
          }}
        >
          {/* LEFT */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              paddingRight: 56,
              paddingBottom: 80,
              paddingTop: 20,
            }}
          >
            {/* badge */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 18px',
                borderRadius: 999,
                background: 'rgba(14,165,233,0.08)',
                border: '1px solid rgba(14,165,233,0.16)',
                color: '#0284c7',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                marginBottom: 28,
                width: 'fit-content',
              }}
            >
              🇰🇿 Қазақстанның заманауи білім платформасы
            </div>

            {/* headline */}
            <h1
              style={{
                fontSize: 'clamp(32px,4.5vw,62px)',
                lineHeight: 1.0,
                fontWeight: 900,
                letterSpacing: '-0.055em',
                margin: '0 0 24px',
              }}
            >
              Білім арқылы
              <br />
              <span
                style={{
                  background: 'linear-gradient(130deg,#0284c7 0%,#38bdf8 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                болашақты құрамыз
              </span>
            </h1>

            {/* description */}
            <p
              style={{
                fontSize: 'clamp(15px,1.5vw,18px)',
                color: '#475569',
                fontWeight: 600,
                lineHeight: 1.9,
                maxWidth: 560,
                margin: '0 0 32px',
              }}
            >
              KHAMADI ONLINE — білімді, еңбекті және ұлттық
              құндылықты біріктіретін заманауи платформа.
              Қазақстандық оқушыға сенімді бағыт, сапалы орта
              және жүйелі даму жолын ұсынамыз.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 36 }}>
              <MainButton href="/ent" primary>
                📚 ҰБТ бағытына өту →
              </MainButton>
              <MainButton href="/english" primary={false}>
                🌍 English бағытына өту →
              </MainButton>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
              <a href="https://www.instagram.com/khamadi.online" target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, background: 'linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)', color: '#fff', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                📸 Instagram
              </a>
              <a href="https://wa.me/77066405577" target="_blank"
                style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 18px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 14, fontWeight: 800, textDecoration: 'none' }}>
                💬 WhatsApp
              </a>
            </div>

            {/* Abai quote */}
            <div
              style={{
                borderRadius: 24,
                padding: '24px 28px',
                background: 'linear-gradient(135deg,rgba(14,165,233,0.05),rgba(56,189,248,0.04))',
                border: '1px solid rgba(14,165,233,0.14)',
                maxWidth: 540,
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 14,
                  left: 20,
                  fontSize: 52,
                  lineHeight: 1,
                  color: 'rgba(14,165,233,0.18)',
                  fontFamily: 'Georgia, serif',
                  fontWeight: 900,
                  userSelect: 'none',
                }}
              >
                "
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: '#0f172a',
                  lineHeight: 1.75,
                  letterSpacing: '-0.02em',
                  paddingTop: 8,
                }}
              >
                Өзіңе сен, өзіңді алып шығар,
                <br />
                Еңбегің мен ақылың екі жақтап
              </div>
              <div
                style={{
                  marginTop: 12,
                  fontSize: 13,
                  fontWeight: 800,
                  color: '#0ea5e9',
                  letterSpacing: '0.02em',
                }}
              >
                — Абай Құнанбайұлы
              </div>
            </div>
          </div>

          {/* RIGHT — Abai image */}
          <div
            style={{
              position: 'relative',
              minHeight: 700,
              display: 'flex',
              alignItems: 'stretch',
            }}
          >
            {/* fade-left overlay so image blends into white */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(to right, #f8fbff 0%, transparent 30%)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />
            {/* bottom fade */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 160,
                background: 'linear-gradient(to top,#ffffff,transparent)',
                zIndex: 2,
                pointerEvents: 'none',
              }}
            />

            <img
              src="/abai.jpg"
              alt="Абай Құнанбайұлы"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'left center',
                display: 'block',
                borderRadius: '0 0 0 0',
              }}
            />

            {/* floating feature cards */}
            <div
              style={{
                position: 'absolute',
                right: 24,
                bottom: 80,
                display: 'flex',
                flexDirection: 'column',
                gap: 12,
                zIndex: 4,
                width: 260,
              }}
            >
              {[
                ['🎓', 'Сапалы білім', 'Жүйелі және түсінікті контент'],
                ['🎯', 'Нәтижеге бағыт', 'Мақсатқа негізделген оқу жүйесі'],
                ['⚡', 'Заманауи формат', 'Интерактивті және AI технологиялар'],
              ].map(([icon, title, text]) => (
                <div
                  key={title}
                  style={{
                    borderRadius: 20,
                    padding: '14px 16px',
                    background: 'rgba(15,23,42,0.78)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    color: '#fff',
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    boxShadow: '0 16px 40px rgba(0,0,0,0.18)',
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      background: 'rgba(14,165,233,0.22)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      flexShrink: 0,
                    }}
                  >
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 2 }}>{title}</div>
                    <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.68)', fontWeight: 600, lineHeight: 1.5 }}>{text}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <section style={{ padding: '0 5% 90px', marginTop: -10, position: 'relative', zIndex: 3 }}>
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            background: '#fff',
            borderRadius: 28,
            border: '1px solid rgba(226,232,240,0.95)',
            boxShadow: '0 24px 56px rgba(15,23,42,0.07)',
            padding: '6px 12px',
            display: 'grid',
            gridTemplateColumns: 'repeat(4,1fr)',
            gap: 0,
          }}
        >
          {[
            ['👥', '1000+', 'Оқушы бізбен бірге'],
            ['⭐', '95%', 'ҰБТ-да жоғары нәтиже'],
            ['📚', '12', 'English курстары'],
            ['🏆', '2', 'Негізгі білім бағыты'],
          ].map(([icon, value, label], i) => (
            <div
              key={label}
              style={{
                padding: '22px 20px',
                textAlign: 'center',
                borderRight: i < 3 ? '1px solid rgba(226,232,240,0.7)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <div style={{ fontSize: 26, lineHeight: 1 }}>{icon}</div>
              <div
                style={{
                  fontSize: 34,
                  fontWeight: 900,
                  color: '#0ea5e9',
                  lineHeight: 1,
                  letterSpacing: '-0.05em',
                }}
              >
                {value}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', fontWeight: 800, lineHeight: 1.5, maxWidth: 120 }}>
                {label}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="about" style={{ padding: '70px 5% 100px', background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div ref={aboutRef} className="fade-start" style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">БІЗ ТУРАЛЫ</div>
            <h2 className="section-title">KHAMADI ONLINE — жаңа буынға арналған білім кеңістігі</h2>
            <p
              style={{
                fontSize: 17,
                color: '#475569',
                fontWeight: 600,
                lineHeight: 1.9,
                maxWidth: 820,
                margin: '20px auto 0',
              }}
            >
              Біз білім беруді тек контент ұсыну деп қарамаймыз. Біздің көзқарас —
              оқушыға сенімділік беру, оқу процесін жүйелеу, сапалы цифрлық орта құру
              және әр адамның өз әлеуетін ашуына көмектесу.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))',
              gap: 22,
            }}
          >
            <InfoCard
              icon="🎯"
              title="Біздің миссия"
              text="Қазақстандағы оқушылар мен жастарға заманауи, түсінікті және нәтижеге бағытталған білім платформасын ұсыну."
            />
            <InfoCard
              icon="💡"
              title="Біздің көзқарас"
              text="Білім алуды ыңғайлы, эстетикалық және заманауи ету арқылы жаңа буынға сапалы өсу ортасын қалыптастыру."
            />
            <InfoCard
              icon="🏛️"
              title="Біздің негіз"
              text="Ұлттық құндылық, еңбек, тәртіп, сапа және болашаққа сенім — KHAMADI ONLINE философиясының өзегі."
            />
          </div>
        </div>
      </section>

      <section
        id="philosophy"
        style={{
          padding: '100px 5%',
          background: 'linear-gradient(180deg,#f8fcff,#ffffff)',
        }}
      >
        <div
          ref={philosophyRef}
          className="fade-start"
          style={{
            maxWidth: 1180,
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: '0.92fr 1.08fr',
            gap: 28,
            alignItems: 'center',
          }}
        >
          <div
            style={{
              borderRadius: 34,
              overflow: 'hidden',
              background: '#0f172a',
              boxShadow: '0 28px 64px rgba(15,23,42,0.22)',
              minHeight: 560,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '44px 36px 36px',
              position: 'relative',
            }}
          >
            {/* decorative quote marks */}
            <div
              style={{
                position: 'absolute',
                top: 20,
                left: 28,
                fontSize: 160,
                lineHeight: 1,
                color: 'rgba(56,189,248,0.08)',
                fontFamily: 'Georgia, serif',
                fontWeight: 900,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              "
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: 120,
                right: 24,
                fontSize: 140,
                lineHeight: 1,
                color: 'rgba(56,189,248,0.06)',
                fontFamily: 'Georgia, serif',
                fontWeight: 900,
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            >
              "
            </div>

            {/* quote block */}
            <div style={{ position: 'relative', zIndex: 1, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <div
                style={{
                  fontSize: 'clamp(20px,2.4vw,28px)',
                  fontWeight: 800,
                  color: '#ffffff',
                  lineHeight: 1.65,
                  letterSpacing: '-0.03em',
                  marginBottom: 22,
                }}
              >
                «Өзіңе сен, өзіңді алып шығар,
                <br />
                Еңбегің мен ақылың екі жақтап»
              </div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 800,
                  color: '#38bdf8',
                  letterSpacing: '0.02em',
                }}
              >
                — Абай Құнанбайұлы
              </div>
            </div>

            {/* value chips */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                position: 'relative',
                zIndex: 1,
                marginTop: 36,
                flexWrap: 'wrap',
              }}
            >
              {[['📚', 'Білім'], ['💪', 'Еңбек'], ['🌟', 'Сенім']].map(([icon, label]) => (
                <div
                  key={label}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    padding: '10px 18px',
                    borderRadius: 999,
                    background: 'rgba(56,189,248,0.10)',
                    border: '1px solid rgba(56,189,248,0.20)',
                    color: '#e0f2fe',
                    fontSize: 13,
                    fontWeight: 800,
                  }}
                >
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          <div
            style={{
              borderRadius: 34,
              padding: '36px 32px',
              background: '#fff',
              border: '1px solid rgba(226,232,240,0.95)',
              boxShadow: '0 18px 46px rgba(15,23,42,0.05)',
            }}
          >
            <div className="section-kicker">ФИЛОСОФИЯМЫЗ</div>

            <h2
              style={{
                fontSize: 'clamp(30px,4.6vw,52px)',
                lineHeight: 1.08,
                fontWeight: 900,
                letterSpacing: '-0.045em',
                margin: '0 0 18px',
              }}
            >
              Абай идеясы —
              <br />
              біздің бағыт
            </h2>

            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                lineHeight: 1.7,
                color: '#0f172a',
                letterSpacing: '-0.03em',
                marginBottom: 18,
              }}
            >
              «Өзіңе сен, өзіңді алып шығар,
              <br />
              Еңбегің мен ақылың екі жақтап»
            </div>

            <p
              style={{
                fontSize: 15,
                color: '#475569',
                lineHeight: 1.95,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Бұл сөздер KHAMADI ONLINE-ның ішкі мәнін дәл береді. Біз сыртқы мотивациядан
              бұрын адамның өз күшіне сенуін маңызды деп санаймыз. Нәтиже — тек мүмкіндікпен емес,
              жүйелі еңбек пен дұрыс ойлау арқылы келеді.
            </p>

            <p
              style={{
                fontSize: 15,
                color: '#475569',
                lineHeight: 1.95,
                fontWeight: 600,
                marginBottom: 0,
              }}
            >
              Сондықтан біздің платформа тек тест шешу немесе материал оқу орны емес.
              Бұл — өзін дамытуға дайын, болашағын саналы түрде құруға ұмтылатын жасқа арналған орта.
            </p>
          </div>
        </div>
      </section>

      <section id="directions" style={{ padding: '100px 5%', background: '#fff' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div ref={directionRef} className="fade-start" style={{ textAlign: 'center', marginBottom: 54 }}>
            <div className="section-kicker">БАҒЫТТАР</div>
            <h2 className="section-title">Біздің негізгі екі даму бағытымыз</h2>
            <p
              style={{
                fontSize: 17,
                color: '#475569',
                fontWeight: 600,
                lineHeight: 1.85,
                maxWidth: 760,
                margin: '18px auto 0',
              }}
            >
              Бүгінгі таңда KHAMADI ONLINE екі маңызды бағытты біріктіреді:
              ҰБТ-ға дайындық және English Courses.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))',
              gap: 22,
            }}
          >
            <DirectionCard
              icon="📚"
              title="ҰБТ Дайындық"
              desc="ҰБТ бағыты талапкерлерге арналған жүйелі цифрлық кеңістік. Мұнда дайындық құрылымы, пәндік даму және нәтижеге бағытталған оқу логикасы біріктірілген."
              points={[
                'ҰБТ форматына жақын оқу тәжірибесі',
                'Пәндер бойынша жүйелі дайындық',
                'Практикаға бағытталған оқу тәсілі',
                'Жеке мақсатқа сай даму мүмкіндігі',
              ]}
              href="/ent"
              accent="#0ea5e9"
              accentBg="rgba(14,165,233,0.07)"
              accentBorder="rgba(14,165,233,0.20)"
            />

            <DirectionCard
              icon="🇬🇧"
              title="English Courses"
              desc="English бағыты — тілдік базаны қалыптастырудан бастап кәсіби бағыттарға дейін дамуға арналған заманауи оқу ортасы."
              points={[
                'A1–C1 аралығындағы даму жолы',
                'Түсінікті және заманауи құрылым',
                'Практикалық бағыттағы тіл үйрену',
                'Жеке әрі кәсіби өсуге бейімделген орта',
              ]}
              href="/english"
              accent="#10b981"
              accentBg="rgba(16,185,129,0.07)"
              accentBorder="rgba(16,185,129,0.20)"
            />
          </div>
        </div>
      </section>

      <section id="values" style={{ padding: '100px 5%', background: 'linear-gradient(180deg,#f8fcff,#ffffff)' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div ref={valueRef} className="fade-start" style={{ textAlign: 'center', marginBottom: 54 }}>
            <div className="section-kicker">АРТЫҚШЫЛЫҚТАР</div>
            <h2 className="section-title">Неге KHAMADI ONLINE</h2>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))',
              gap: 20,
            }}
          >
            <InfoCard
              icon="🧠"
              title="Ақылды құрылым"
              text="Оқу процесі реттелген, түсінікті және нәтижеге бағытталған логикамен құрылған."
            />
            <InfoCard
              icon="📖"
              title="Сапалы мазмұн"
              text="Контент тек көп болу үшін емес, түсінікті және пайдалы болу үшін жасалады."
            />
            <InfoCard
              icon="🚀"
              title="Заманауи формат"
              text="Эстетика, интерактив және цифрлық тәжірибе жаңа буынның оқу стиліне сай келеді."
            />
            <InfoCard
              icon="🇰🇿"
              title="Ұлттық негіз"
              text="Платформа қазақстандық аудиторияның тіліне, контексіне және болашақ мақсатына сай ойластырылған."
            />
          </div>
        </div>
      </section>

      <section
        style={{
          padding: '110px 5%',
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg,#0ea5e9 0%,#38bdf8 50%,#0284c7 100%)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.10)',
            top: -80,
            right: -80,
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            width: 240,
            height: 240,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.08)',
            bottom: -60,
            left: -60,
            filter: 'blur(60px)',
            pointerEvents: 'none',
          }}
        />

        <div
          ref={ctaRef}
          className="fade-start"
          style={{
            maxWidth: 780,
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
            zIndex: 1,
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.12)',
              color: '#fff',
              fontSize: 12,
              fontWeight: 900,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom: 20,
            }}
          >
            KHAMADI ONLINE
          </div>

          <h2
            style={{
              fontSize: 'clamp(34px,5vw,58px)',
              fontWeight: 900,
              color: '#fff',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              margin: '0 0 18px',
            }}
          >
            Білімді жаңа деңгейде
            <br />
            бірге құрамыз
          </h2>

          <p
            style={{
              fontSize: 17,
              color: 'rgba(255,255,255,0.88)',
              fontWeight: 600,
              lineHeight: 1.8,
              maxWidth: 620,
              margin: '0 auto 34px',
            }}
          >
            KHAMADI ONLINE — сенімге, еңбекке және сапалы болашаққа бағытталған
            жаңа буынның білім платформасы.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={() => {
                window.location.href = '/ent'
              }}
              style={{
                fontSize: 15,
                padding: '14px 34px',
                borderRadius: 16,
                border: 'none',
                background: '#fff',
                color: '#0284c7',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              ҰБТ бағыты →
            </button>

            <button
              onClick={() => {
                window.location.href = '/english'
              }}
              style={{
                fontSize: 15,
                padding: '14px 34px',
                borderRadius: 16,
                border: '2px solid rgba(255,255,255,0.38)',
                background: 'transparent',
                color: '#fff',
                fontWeight: 800,
                cursor: 'pointer',
                fontFamily: 'Montserrat, sans-serif',
              }}
            >
              English бағыты →
            </button>
          </div>
        </div>
      </section>

      <footer id="contact" style={{ background: '#0f172a', padding: '70px 5% 40px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))',
              gap: 40,
              marginBottom: 46,
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <img src="/icon.png" alt="KHAMADI ONLINE"
                  style={{ width: 38, height: 38, borderRadius: 12, objectFit: 'contain' }} />

                <span style={{ fontSize: 15, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em' }}>
                  KHAMADI <span style={{ color: '#38bdf8' }}>ONLINE</span>
                </span>
              </div>

              <p
                style={{
                  fontSize: 14,
                  color: 'rgba(255,255,255,0.52)',
                  fontWeight: 600,
                  lineHeight: 1.85,
                  maxWidth: 320,
                }}
              >
                Қазақстандық оқушылар мен жастарға арналған заманауи білім платформасы.
              </p>
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Навигация
              </div>

              {navItems.map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => {
                    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  style={{
                    display: 'block',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.58)',
                    marginBottom: 10,
                    padding: 0,
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Бағыттар
              </div>

              {[
                ['ҰБТ Дайындық', '/ent'],
                ['English Courses', '/english'],
                ['ҰБТ Тіркелу', '/register'],
                ['English Тіркелу', '/english/register'],
              ].map(([label, href]) => (
                <button
                  key={label}
                  onClick={() => {
                    window.location.href = href
                  }}
                  style={{
                    display: 'block',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.58)',
                    marginBottom: 10,
                    padding: 0,
                    textAlign: 'left',
                    fontFamily: 'Montserrat, sans-serif',
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div>
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 900,
                  color: 'rgba(255,255,255,0.38)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  marginBottom: 16,
                }}
              >
                Байланыс
              </div>

              <a
                href="mailto:info@khamadi-online.kz"
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: '#38bdf8',
                  textDecoration: 'none',
                }}
              >
                info@khamadi-online.kz
              </a>

              <div style={{ marginTop: 12 }}>
                <a
                  href="https://www.instagram.com/khamadi.online"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'rgba(255,255,255,0.58)',
                    textDecoration: 'none',
                  }}
                >
                  Instagram →
                </a>
              </div>
              <div style={{ marginTop: 10 }}>
                <a href="https://www.instagram.com/khamadi.online" target="_blank"
                  style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.58)', textDecoration: 'none', display: 'block', marginBottom: 8 }}>
                  📸 Instagram →
                </a>
                <a href="https://wa.me/77066405577" target="_blank"
                  style={{ fontSize: 14, fontWeight: 700, color: 'rgba(255,255,255,0.58)', textDecoration: 'none', display: 'block' }}>
                  💬 WhatsApp →
                </a>
              </div>
            </div>
          </div>

          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.08)',
              paddingTop: 24,
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.34)', fontWeight: 600 }}>
              © 2026 KHAMADI ONLINE. Барлық құқықтар қорғалған.
            </span>
            <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.26)', fontWeight: 600 }}>
              🇰🇿 Қазақстан
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        .fade-start {
          opacity: 0;
          transform: translateY(28px);
          transition: opacity .8s ease, transform .8s cubic-bezier(.22,1,.36,1);
        }

        .fade-visible {
          opacity: 1 !important;
          transform: translateY(0) !important;
        }

        .section-kicker {
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #0ea5e9;
          margin-bottom: 12px;
        }

        .section-title {
          font-size: clamp(30px,4.8vw,56px);
          line-height: 1.08;
          letter-spacing: -0.045em;
          font-weight: 900;
          margin: 0;
          color: #0f172a;
        }

        @media (max-width: 992px) {
          .hm-nav {
            display: none !important;
          }

          .hm-burger {
            display: flex !important;
          }

          .hm-social {
            display: none !important;
          }
        }

        @media (max-width: 960px) {
          .hero-grid {
            grid-template-columns: 1fr !important;
          }
          .hero-grid > div:first-child {
            padding-right: 0 !important;
            padding-bottom: 40px !important;
          }
          .hero-grid > div:last-child {
            min-height: 420px !important;
          }

          section div[style*="grid-template-columns: 0.92fr 1.08fr"] {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 640px) {
          section div[style*="grid-template-columns: repeat(4,1fr)"] {
            grid-template-columns: repeat(2,1fr) !important;
          }
          section div[style*="border-right:"] {
            border-right: none !important;
            border-bottom: 1px solid rgba(226,232,240,0.7) !important;
          }
        }

        @media (max-width: 768px) {
          nav {
            padding-left: 4% !important;
            padding-right: 4% !important;
          }
        }
      `}</style>
    </div>
  )
}