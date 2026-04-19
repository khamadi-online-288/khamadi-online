'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

function useReveal(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          obs.disconnect()
        }
      },
      { threshold }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])

  return { ref, visible }
}

function Reveal({
  children,
  delay = 0,
  className = '',
  style = {},
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  style?: React.CSSProperties
}) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(32px)',
        transition: `opacity .8s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .8s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default function NishPage() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })
  const [cursorVisible, setCursorVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
      setCursorVisible(true)
    }

    const onLeave = () => setCursorVisible(false)

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseout', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseout', onLeave)
    }
  }, [])

  const heroStats = useMemo(
    () => [
      { value: '3', label: 'Бағыт' },
      { value: '8+', label: 'Пән' },
      { value: '1', label: 'Платформа' },
      { value: '100%', label: 'Фокус' },
    ],
    []
  )

  return (
    <div
      style={{
        fontFamily: 'Montserrat, sans-serif',
        background: '#080611',
        color: '#ffffff',
        overflowX: 'hidden',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      {/* Cursor glow */}
      <div
        style={{
          position: 'fixed',
          left: cursor.x - 180,
          top: cursor.y - 180,
          width: 360,
          height: 360,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(167,139,250,0.18) 0%, rgba(139,92,246,0.12) 24%, rgba(124,58,237,0.05) 48%, transparent 72%)',
          pointerEvents: 'none',
          zIndex: 3,
          opacity: cursorVisible ? 1 : 0,
          transition: 'opacity .25s ease',
          filter: 'blur(24px)',
        }}
      />

      {/* Background layers */}
      <div className="mesh-bg" />
      <div className="grid-bg" />
      <div className="line line-1" />
      <div className="line line-2" />
      <div className="line line-3" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      {/* Navbar */}
      <nav
        style={{
          position: 'fixed',
          inset: '0 0 auto 0',
          zIndex: 30,
          padding: '0 5%',
          background: scrolled
            ? 'rgba(8,6,17,0.82)'
            : 'rgba(8,6,17,0.46)',
          backdropFilter: 'blur(22px)',
          borderBottom: scrolled
            ? '1px solid rgba(167,139,250,0.14)'
            : '1px solid transparent',
          boxShadow: scrolled
            ? '0 10px 40px rgba(0,0,0,0.18)'
            : 'none',
          transition: 'all .28s ease',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            height: 76,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
          }}
        >
          <button
            onClick={() => {
              window.location.href = '/'
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            <div className="brand-mark">🏫</div>
            <div style={{ textAlign: 'left' }}>
              <div
                style={{
                  fontSize: 16,
                  fontWeight: 900,
                  letterSpacing: '-0.05em',
                  color: '#fff',
                }}
              >
                KHAMADI <span style={{ color: '#c4b5fd' }}>ONLINE</span>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'rgba(255,255,255,0.44)',
                  fontWeight: 800,
                  letterSpacing: '.14em',
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                НИШ • РФМШ • БИЛ
              </div>
            </div>
          </button>

          <div className="desktop-nav">
            {[['features', 'Артықшылықтар'], ['subjects', 'Пәндер'], ['steps', 'Қалай өтеді'], ['cta', 'Бастау']].map(
              ([id, label]) => (
                <button
                  key={id}
                  onClick={() =>
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                  className="nav-link"
                >
                  {label}
                </button>
              )
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <a
              href="https://instagram.com/khamadi.online"
              target="_blank"
              rel="noopener noreferrer"
              className="nav-ghost-link"
            >
              Instagram
            </a>

            <button
              className="nav-cta"
              onClick={() => {
                window.location.href = '/register'
              }}
            >
              Тіркелу →
            </button>

            <button
              className="burger-btn"
              onClick={() => setMenuOpen((v) => !v)}
            >
              {menuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="mobile-menu">
            {[['/', '← Басты бет'], ['features', 'Артықшылықтар'], ['subjects', 'Пәндер'], ['steps', 'Қалай өтеді'], ['cta', 'Бастау']].map(
              ([id, label]) => (
                <button
                  key={label}
                  onClick={() => {
                    setMenuOpen(false)
                    if (id === '/') {
                      window.location.href = '/'
                      return
                    }
                    document
                      .getElementById(id)
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="mobile-link"
                >
                  {label}
                </button>
              )
            )}

            <button
              className="mobile-cta"
              onClick={() => {
                window.location.href = '/register'
              }}
            >
              Тіркелу →
            </button>
          </div>
        )}
      </nav>

      {/* Hero */}
      <section className="hero-section">
        <div className="hero-noise" />
        <div className="container hero-layout">
          <div className="hero-copy">
            <Reveal>
              <div className="hero-pill">🏫 НИШ • РФМШ • БИЛ дайындығы</div>
            </Reveal>

            <Reveal delay={80}>
              <h1 className="hero-title">
                Зияткерлік
                <br />
                мектептерге
                <br />
                <span>жүйелі дайындық</span>
              </h1>
            </Reveal>

            <Reveal delay={160}>
              <p className="hero-text">
                НИШ, РФМШ және БИЛ-ге арналған тереңдетілген дайындық.
                Пәндік база, логика, тест форматы және сұхбатқа дайындық —
                барлығы бір жүйеде, бір маршрутпен.
              </p>
            </Reveal>

            <Reveal delay={240}>
              <div className="hero-actions">
                <button
                  className="hero-primary"
                  onClick={() => {
                    window.location.href = '/register'
                  }}
                >
                  Тіркелу →
                </button>

                <button
                  className="hero-secondary"
                  onClick={() =>
                    document
                      .getElementById('features')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }
                >
                  Толығырақ ↓
                </button>
              </div>
            </Reveal>

            <Reveal delay={320}>
              <div className="hero-stats">
                {heroStats.map((item) => (
                  <div key={item.label} className="hero-stat">
                    <div className="hero-stat-value">{item.value}</div>
                    <div className="hero-stat-label">{item.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={180} className="hero-visual-wrap">
            <div className="hero-visual">
              <div className="hero-card card-main floating">
                <div className="card-topline">Admissions Preparation</div>
                <div className="card-title">НИШ / РФМШ / БИЛ</div>
                <div className="card-text">
                  Интеллектуалдық мектептерге түсуге арналған терең бағдарлама
                </div>

                <div className="hero-mini-grid">
                  <div className="mini-tile">
                    <span>📚</span>
                    <strong>Пәндік база</strong>
                  </div>
                  <div className="mini-tile">
                    <span>🧠</span>
                    <strong>Логика</strong>
                  </div>
                  <div className="mini-tile">
                    <span>📝</span>
                    <strong>Тесттер</strong>
                  </div>
                  <div className="mini-tile">
                    <span>🎤</span>
                    <strong>Сұхбат</strong>
                  </div>
                </div>
              </div>

              <div className="hero-card card-glass card-1 floating-delayed">
                <div className="small-label">Track</div>
                <div className="small-value">РФМШ</div>
              </div>

              <div className="hero-card card-glass card-2 floating-slow">
                <div className="small-label">Focus</div>
                <div className="small-value">STEM + Logic</div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="section section-soft">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">АРТЫҚШЫЛЫҚТАР</div>
            <h2 className="section-title">Үш бағытқа арналған нақты фокус</h2>
            <p className="section-text">
              Әр мектептің өз форматы, өз талабы бар. Сол үшін дайындық та
              жалпы емес, мақсатқа бағытталған болуы керек.
            </p>
          </Reveal>

          <div className="feature-grid">
            {[
              {
                icon: '📚',
                title: 'НИШ дайындығы',
                text: 'Назарбаев Зияткерлік мектептеріне түсу форматына бейімделген жүйелі дайындық.',
              },
              {
                icon: '🔬',
                title: 'РФМШ бағыты',
                text: 'Математика, физика, логика және аналитикалық ойлау бағыты күшейтілген трек.',
              },
              {
                icon: '🏆',
                title: 'БИЛ дайындығы',
                text: 'Кешенді формат: тест, интеллектуалдық дайындық және іріктеу стратегиясы.',
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 90}>
                <div className="premium-card feature-card">
                  <div className="feature-icon">{item.icon}</div>
                  <div className="feature-title">{item.title}</div>
                  <div className="feature-text">{item.text}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Subjects */}
      <section id="subjects" className="section">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">ПӘНДЕР</div>
            <h2 className="section-title">Оқытылатын пәндер</h2>
            <p className="section-text">
              Қажетті академиялық база мен тесттік дайындықты жабатын негізгі пәндер.
            </p>
          </Reveal>

          <div className="subject-grid">
            {[
              ['🔢', 'Математика'],
              ['⚛️', 'Физика'],
              ['🧪', 'Химия'],
              ['🧬', 'Биология'],
              ['📖', 'Қазақ тілі'],
              ['📝', 'Орыс тілі'],
              ['🇬🇧', 'Ағылшын тілі'],
              ['🧠', 'Логика'],
            ].map(([icon, name], i) => (
              <Reveal key={name} delay={(i % 4) * 70}>
                <div className="premium-card subject-card">
                  <div className="subject-icon">{icon}</div>
                  <div className="subject-name">{name}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Steps */}
      <section id="steps" className="section section-soft">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">ҚАЛАЙ ӨТЕДІ</div>
            <h2 className="section-title">4 қадамдық маршрут</h2>
            <p className="section-text">
              Бала қай деңгейде тұр, қай бағытқа барады және соған қандай жолмен жетеді — бәрі жүйелі.
            </p>
          </Reveal>

          <div className="steps-grid">
            {[
              ['01', '📋', 'Диагностика', 'Алғашқы тест арқылы дайындық деңгейі анықталады.'],
              ['02', '🧭', 'Жеке маршрут', 'Нәтижеге қарай оқу бағыты мен екпіні белгіленеді.'],
              ['03', '📘', 'Негізгі дайындық', 'Пәндер, логика, тест форматы және практикалық тапсырмалар.'],
              ['04', '🎯', 'Нәтижеге шығу', 'Нақты емтихан форматына жақын дайындықпен іріктеуге шығу.'],
            ].map(([num, icon, title, text], i) => (
              <Reveal key={num} delay={i * 90}>
                <div className="premium-card step-card">
                  <div className="step-num">{num}</div>
                  <div className="step-icon">{icon}</div>
                  <div className="step-title">{title}</div>
                  <div className="step-text">{text}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why us */}
      <section className="section">
        <div className="container">
          <div className="why-layout">
            <Reveal>
              <div className="why-copy">
                <div className="section-kicker">НЕГЕ KHAMADI ONLINE</div>
                <h2 className="section-title left">Жай курс емес, нақты admission system</h2>
                <p className="section-text left">
                  Мұнда тек теория емес. Түсу логикасы, тест форматы, уақытпен жұмыс,
                  пәндік күшейту және дұрыс маршрут біріктірілген.
                </p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="why-list">
                {[
                  'Мақсатқа сай жеке дайындық траекториясы',
                  'НИШ / РФМШ / БИЛ форматына фокус',
                  'Пәндік база + логика + тест стратегиясы',
                  'Премиум визуалды әрі жүйелі оқу тәжірибесі',
                ].map((item) => (
                  <div key={item} className="why-item">
                    <span>✦</span>
                    <div>{item}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="cta" className="cta-section">
        <div className="cta-glow cta-glow-1" />
        <div className="cta-glow cta-glow-2" />
        <div className="container">
          <Reveal style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <div className="cta-kicker">БАСТАУҒА ДАЙЫН БА?</div>
            <h2 className="cta-title">Бүгін бастауға дайынсың ба?</h2>
            <p className="cta-text">
              Тіркел де, НИШ, РФМШ немесе БИЛ дайындығын жүйелі түрде баста.
              Бірінші қадамды қазір жаса.
            </p>

            <div className="cta-actions">
              <button
                className="cta-primary"
                onClick={() => {
                  window.location.href = '/register'
                }}
              >
                Тіркелу →
              </button>

              <a
                href="https://instagram.com/khamadi.online"
                target="_blank"
                rel="noopener noreferrer"
                className="cta-secondary"
              >
                Instagram →
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <div className="footer-brand">
                <div className="footer-brand-mark">🏫</div>
                <div>
                  <div className="footer-brand-title">
                    KHAMADI <span>ONLINE</span>
                  </div>
                  <div className="footer-brand-sub">NISH / RFMSh / BIL</div>
                </div>
              </div>

              <p className="footer-text">
                Интеллектуалдық мектептерге дайындайтын жүйелі платформа.
              </p>
            </div>

            <div>
              <div className="footer-head">Бағыттар</div>
              <button className="footer-link" onClick={() => (window.location.href = '/')}>Басты бет</button>
              <button className="footer-link" onClick={() => (window.location.href = '/ent')}>ҰБТ Дайындық</button>
              <button className="footer-link" onClick={() => (window.location.href = '/english')}>English Courses</button>
              <button className="footer-link" onClick={() => (window.location.href = '/nish')}>НИШ / РФМШ / БИЛ</button>
            </div>

            <div>
              <div className="footer-head">Байланыс</div>
              <a className="footer-anchor" href="mailto:info@khamadi-online.kz">
                info@khamadi-online.kz
              </a>
              <a
                className="footer-anchor"
                href="https://instagram.com/khamadi.online"
                target="_blank"
                rel="noopener noreferrer"
              >
                Instagram →
              </a>
              <a
                className="footer-anchor"
                href="https://wa.me/77000000000"
                target="_blank"
                rel="noopener noreferrer"
              >
                WhatsApp →
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© 2026 KHAMADI ONLINE. Барлық құқықтар қорғалған.</span>
            <span>🇰🇿 Қазақстан</span>
          </div>
        </div>
      </footer>

      <style>{`
        .container{
          width:100%;
          max-width:1240px;
          margin:0 auto;
        }

        .mesh-bg{
          position:absolute;
          inset:0;
          background:
            radial-gradient(circle at 20% 20%, rgba(139,92,246,0.14), transparent 28%),
            radial-gradient(circle at 82% 18%, rgba(167,139,250,0.10), transparent 26%),
            radial-gradient(circle at 50% 70%, rgba(124,58,237,0.08), transparent 30%);
          pointer-events:none;
          z-index:0;
        }

        .grid-bg{
          position:absolute;
          inset:0;
          background-image:
            linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px);
          background-size:54px 54px;
          mask-image:linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 88%);
          pointer-events:none;
          z-index:0;
        }

        .line{
          position:absolute;
          height:1px;
          width:48vw;
          background:linear-gradient(90deg, transparent, rgba(196,181,253,0.7), transparent);
          opacity:.55;
          pointer-events:none;
          z-index:1;
          filter:blur(.2px);
          animation:lineMove 8s ease-in-out infinite alternate;
        }

        .line-1{ top:16%; left:-8%; transform:rotate(-9deg); }
        .line-2{ top:42%; right:-12%; transform:rotate(8deg); animation-delay:1.4s; }
        .line-3{ bottom:22%; left:10%; transform:rotate(-6deg); animation-delay:2.2s; }

        @keyframes lineMove{
          from{ transform:translateX(0) rotate(-6deg); opacity:.28; }
          to{ transform:translateX(32px) rotate(-6deg); opacity:.74; }
        }

        .orb{
          position:absolute;
          border-radius:50%;
          pointer-events:none;
          z-index:0;
          filter:blur(70px);
        }

        .orb-1{
          width:340px;
          height:340px;
          background:rgba(139,92,246,0.16);
          top:90px;
          right:-60px;
        }

        .orb-2{
          width:260px;
          height:260px;
          background:rgba(167,139,250,0.12);
          bottom:120px;
          left:-40px;
        }

        .orb-3{
          width:220px;
          height:220px;
          background:rgba(124,58,237,0.14);
          top:52%;
          left:42%;
        }

        .brand-mark{
          width:42px;
          height:42px;
          border-radius:14px;
          background:linear-gradient(135deg,#a78bfa,#8b5cf6);
          display:flex;
          align-items:center;
          justify-content:center;
          box-shadow:0 12px 28px rgba(139,92,246,0.26);
          font-size:18px;
          flex-shrink:0;
        }

        .desktop-nav{
          display:flex;
          align-items:center;
          gap:4px;
        }

        .nav-link{
          background:none;
          border:none;
          color:rgba(255,255,255,0.72);
          cursor:pointer;
          padding:10px 14px;
          border-radius:12px;
          font-size:14px;
          font-weight:800;
          transition:all .22s ease;
        }

        .nav-link:hover{
          color:#fff;
          background:rgba(255,255,255,0.06);
        }

        .nav-ghost-link{
          text-decoration:none;
          color:#c4b5fd;
          font-size:13px;
          font-weight:800;
          padding:8px 10px;
        }

        .nav-cta{
          min-height:42px;
          padding:0 20px;
          border:none;
          border-radius:999px;
          background:linear-gradient(135deg,#a78bfa,#8b5cf6);
          color:#fff;
          font-size:14px;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 14px 34px rgba(139,92,246,0.32);
          transition:all .22s ease;
        }

        .nav-cta:hover{
          transform:translateY(-2px);
          box-shadow:0 20px 42px rgba(139,92,246,0.38);
        }

        .burger-btn{
          display:none;
          border:none;
          background:transparent;
          color:#fff;
          font-size:22px;
          cursor:pointer;
          padding:2px 4px;
        }

        .mobile-menu{
          border-top:1px solid rgba(167,139,250,0.12);
          padding:10px 0 18px;
          display:flex;
          flex-direction:column;
          gap:4px;
        }

        .mobile-link{
          background:none;
          border:none;
          color:#fff;
          cursor:pointer;
          text-align:left;
          padding:12px 8px;
          font-size:15px;
          font-weight:800;
          border-radius:12px;
        }

        .mobile-cta{
          margin-top:8px;
          min-height:46px;
          border:none;
          border-radius:999px;
          background:linear-gradient(135deg,#a78bfa,#8b5cf6);
          color:#fff;
          font-size:14px;
          font-weight:900;
          cursor:pointer;
        }

        .hero-section{
          position:relative;
          min-height:100vh;
          padding:126px 5% 86px;
          display:flex;
          align-items:center;
          overflow:hidden;
        }

        .hero-noise{
          position:absolute;
          inset:0;
          pointer-events:none;
          opacity:.18;
          background-image:
            radial-gradient(rgba(255,255,255,.18) .7px, transparent .7px);
          background-size:14px 14px;
          mask-image:linear-gradient(to bottom, rgba(0,0,0,.35), transparent 80%);
        }

        .hero-layout{
          display:grid;
          grid-template-columns:1.05fr .95fr;
          gap:36px;
          align-items:center;
          position:relative;
          z-index:2;
        }

        .hero-pill{
          display:inline-flex;
          align-items:center;
          padding:10px 16px;
          border-radius:999px;
          background:rgba(255,255,255,0.06);
          border:1px solid rgba(196,181,253,0.18);
          color:#c4b5fd;
          font-size:12px;
          font-weight:900;
          letter-spacing:.08em;
          backdrop-filter:blur(12px);
          box-shadow:0 10px 30px rgba(0,0,0,.12);
        }

        .hero-title{
          font-size:clamp(44px,7vw,88px);
          line-height:.96;
          letter-spacing:-.07em;
          margin:0 0 22px;
          font-weight:900;
          color:#fff;
        }

        .hero-title span{
          background:linear-gradient(135deg,#d8b4fe 0%, #c4b5fd 42%, #a78bfa 100%);
          -webkit-background-clip:text;
          -webkit-text-fill-color:transparent;
        }

        .hero-text{
          font-size:clamp(15px,2vw,19px);
          line-height:1.9;
          color:rgba(255,255,255,0.72);
          font-weight:600;
          max-width:640px;
          margin:0 0 34px;
        }

        .hero-actions{
          display:flex;
          gap:14px;
          flex-wrap:wrap;
          margin-bottom:34px;
        }

        .hero-primary{
          min-height:54px;
          padding:0 30px;
          border:none;
          border-radius:999px;
          background:linear-gradient(135deg,#8b5cf6,#a78bfa);
          color:#fff;
          font-size:15px;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 16px 40px rgba(139,92,246,0.34);
          transition:all .22s ease;
        }

        .hero-primary:hover{
          transform:translateY(-2px);
          box-shadow:0 22px 48px rgba(139,92,246,0.42);
        }

        .hero-secondary{
          min-height:54px;
          padding:0 28px;
          border-radius:999px;
          border:1.5px solid rgba(196,181,253,0.24);
          background:rgba(255,255,255,0.05);
          color:#ddd6fe;
          font-size:15px;
          font-weight:900;
          cursor:pointer;
          backdrop-filter:blur(10px);
          transition:all .22s ease;
        }

        .hero-secondary:hover{
          background:rgba(255,255,255,0.09);
          transform:translateY(-1px);
        }

        .hero-stats{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:12px;
          max-width:620px;
        }

        .hero-stat{
          padding:16px 14px;
          border-radius:20px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(10px);
        }

        .hero-stat-value{
          font-size:24px;
          font-weight:900;
          color:#fff;
          line-height:1;
          margin-bottom:6px;
          letter-spacing:-.05em;
        }

        .hero-stat-label{
          font-size:12px;
          font-weight:800;
          color:rgba(255,255,255,0.54);
          letter-spacing:.04em;
        }

        .hero-visual-wrap{
          display:flex;
          justify-content:flex-end;
        }

        .hero-visual{
          position:relative;
          width:min(100%, 520px);
          height:540px;
        }

        .hero-card{
          position:absolute;
          border-radius:28px;
          overflow:hidden;
        }

        .card-main{
          inset:36px 28px 54px 12px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.14), rgba(255,255,255,0.05)),
            linear-gradient(135deg, rgba(124,58,237,0.65), rgba(139,92,246,0.42));
          border:1px solid rgba(255,255,255,0.12);
          backdrop-filter:blur(18px);
          box-shadow:
            0 30px 80px rgba(0,0,0,0.24),
            inset 0 1px 0 rgba(255,255,255,0.18);
          padding:28px;
        }

        .card-glass{
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.12);
          backdrop-filter:blur(14px);
          box-shadow:0 18px 46px rgba(0,0,0,0.18);
          padding:18px 20px;
        }

        .card-1{
          top:0;
          right:0;
          width:180px;
        }

        .card-2{
          bottom:18px;
          right:18px;
          width:210px;
        }

        .card-topline{
          font-size:11px;
          color:rgba(255,255,255,0.56);
          font-weight:900;
          letter-spacing:.14em;
          text-transform:uppercase;
          margin-bottom:12px;
        }

        .card-title{
          font-size:30px;
          line-height:1;
          font-weight:900;
          color:#fff;
          letter-spacing:-.05em;
          margin-bottom:12px;
        }

        .card-text{
          font-size:14px;
          color:rgba(255,255,255,0.74);
          line-height:1.8;
          font-weight:600;
          margin-bottom:22px;
          max-width:330px;
        }

        .hero-mini-grid{
          display:grid;
          grid-template-columns:repeat(2,minmax(0,1fr));
          gap:12px;
        }

        .mini-tile{
          border-radius:18px;
          padding:14px;
          background:rgba(255,255,255,0.08);
          border:1px solid rgba(255,255,255,0.08);
          display:flex;
          flex-direction:column;
          gap:8px;
        }

        .mini-tile span{
          font-size:22px;
        }

        .mini-tile strong{
          font-size:13px;
          font-weight:800;
          color:#fff;
        }

        .small-label{
          font-size:10px;
          color:rgba(255,255,255,0.54);
          font-weight:900;
          letter-spacing:.14em;
          text-transform:uppercase;
          margin-bottom:8px;
        }

        .small-value{
          font-size:22px;
          color:#fff;
          font-weight:900;
          line-height:1.05;
          letter-spacing:-.04em;
        }

        .floating{
          animation:floatMain 8s ease-in-out infinite;
        }

        .floating-delayed{
          animation:floatAlt 7.5s ease-in-out infinite;
        }

        .floating-slow{
          animation:floatSlow 9s ease-in-out infinite;
        }

        @keyframes floatMain{
          0%,100%{ transform:translateY(0px); }
          50%{ transform:translateY(-10px); }
        }

        @keyframes floatAlt{
          0%,100%{ transform:translateY(0px); }
          50%{ transform:translateY(12px); }
        }

        @keyframes floatSlow{
          0%,100%{ transform:translateY(0px); }
          50%{ transform:translateY(-8px); }
        }

        .section{
          position:relative;
          padding:112px 5%;
        }

        .section-soft{
          background:linear-gradient(180deg, rgba(255,255,255,0.025), rgba(255,255,255,0.01));
        }

        .section-kicker{
          font-size:12px;
          font-weight:900;
          color:#c4b5fd;
          letter-spacing:.16em;
          text-transform:uppercase;
          margin-bottom:14px;
        }

        .section-title{
          font-size:clamp(32px,5vw,58px);
          font-weight:900;
          color:#fff;
          line-height:1.04;
          letter-spacing:-.05em;
          margin:0;
        }

        .section-title.left,
        .section-text.left{
          text-align:left;
        }

        .section-text{
          font-size:16px;
          color:rgba(255,255,255,0.64);
          line-height:1.9;
          font-weight:600;
          max-width:620px;
          margin:18px auto 0;
        }

        .feature-grid{
          display:grid;
          grid-template-columns:repeat(3,minmax(0,1fr));
          gap:18px;
        }

        .premium-card{
          position:relative;
          overflow:hidden;
          border-radius:28px;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03));
          border:1px solid rgba(255,255,255,0.08);
          backdrop-filter:blur(16px);
          box-shadow:
            0 18px 42px rgba(0,0,0,0.18),
            inset 0 1px 0 rgba(255,255,255,0.10);
          transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;
        }

        .premium-card:hover{
          transform:translateY(-6px);
          box-shadow:
            0 26px 56px rgba(0,0,0,0.22),
            0 0 0 1px rgba(167,139,250,0.10) inset;
          border-color:rgba(167,139,250,0.16);
        }

        .feature-card{
          padding:26px;
        }

        .feature-icon{
          width:58px;
          height:58px;
          border-radius:18px;
          background:linear-gradient(135deg, rgba(167,139,250,0.18), rgba(139,92,246,0.14));
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:28px;
          margin-bottom:18px;
          box-shadow:0 10px 28px rgba(139,92,246,0.12);
        }

        .feature-title{
          font-size:20px;
          font-weight:900;
          color:#fff;
          margin-bottom:12px;
          letter-spacing:-.03em;
        }

        .feature-text{
          font-size:14px;
          color:rgba(255,255,255,0.66);
          line-height:1.85;
          font-weight:600;
        }

        .subject-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:16px;
        }

        .subject-card{
          padding:28px 18px;
          text-align:center;
        }

        .subject-icon{
          font-size:34px;
          margin-bottom:12px;
        }

        .subject-name{
          font-size:15px;
          font-weight:900;
          color:#fff;
          letter-spacing:-.02em;
        }

        .steps-grid{
          display:grid;
          grid-template-columns:repeat(4,minmax(0,1fr));
          gap:18px;
        }

        .step-card{
          padding:24px;
        }

        .step-num{
          font-size:11px;
          color:#c4b5fd;
          font-weight:900;
          letter-spacing:.14em;
          margin-bottom:14px;
        }

        .step-icon{
          width:54px;
          height:54px;
          border-radius:18px;
          background:linear-gradient(135deg, rgba(167,139,250,0.18), rgba(139,92,246,0.10));
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:24px;
          margin-bottom:16px;
        }

        .step-title{
          font-size:18px;
          color:#fff;
          font-weight:900;
          margin-bottom:10px;
        }

        .step-text{
          font-size:14px;
          color:rgba(255,255,255,0.66);
          font-weight:600;
          line-height:1.82;
        }

        .why-layout{
          display:grid;
          grid-template-columns:.95fr 1.05fr;
          gap:26px;
          align-items:start;
        }

        .why-list{
          display:flex;
          flex-direction:column;
          gap:14px;
        }

        .why-item{
          display:flex;
          gap:12px;
          align-items:flex-start;
          padding:20px 22px;
          border-radius:22px;
          background:rgba(255,255,255,0.05);
          border:1px solid rgba(255,255,255,0.08);
          font-size:15px;
          color:rgba(255,255,255,0.72);
          font-weight:700;
          line-height:1.8;
        }

        .why-item span{
          color:#c4b5fd;
          font-size:18px;
          line-height:1.2;
          margin-top:1px;
        }

        .cta-section{
          position:relative;
          overflow:hidden;
          padding:118px 5%;
          background:linear-gradient(135deg,#7c3aed 0%, #8b5cf6 50%, #a78bfa 100%);
        }

        .cta-glow{
          position:absolute;
          border-radius:50%;
          filter:blur(70px);
          pointer-events:none;
        }

        .cta-glow-1{
          width:320px;
          height:320px;
          top:-80px;
          right:-60px;
          background:rgba(255,255,255,0.10);
        }

        .cta-glow-2{
          width:220px;
          height:220px;
          bottom:-60px;
          left:-40px;
          background:rgba(255,255,255,0.08);
        }

        .cta-kicker{
          font-size:11px;
          font-weight:900;
          color:rgba(255,255,255,0.68);
          letter-spacing:.16em;
          text-transform:uppercase;
          margin-bottom:18px;
        }

        .cta-title{
          font-size:clamp(34px,5vw,58px);
          line-height:1.05;
          letter-spacing:-.05em;
          color:#fff;
          font-weight:900;
          margin:0 0 18px;
        }

        .cta-text{
          max-width:560px;
          margin:0 auto 34px;
          font-size:17px;
          line-height:1.85;
          color:rgba(255,255,255,0.88);
          font-weight:600;
        }

        .cta-actions{
          display:flex;
          justify-content:center;
          gap:14px;
          flex-wrap:wrap;
        }

        .cta-primary{
          min-height:56px;
          padding:0 34px;
          border:none;
          border-radius:999px;
          background:#fff;
          color:#7c3aed;
          font-size:15px;
          font-weight:900;
          cursor:pointer;
          box-shadow:0 18px 44px rgba(0,0,0,0.20);
          transition:all .22s ease;
        }

        .cta-primary:hover{
          transform:translateY(-2px);
          box-shadow:0 24px 54px rgba(0,0,0,0.24);
        }

        .cta-secondary{
          min-height:56px;
          padding:0 30px;
          display:inline-flex;
          align-items:center;
          justify-content:center;
          border-radius:999px;
          border:1.5px solid rgba(255,255,255,0.26);
          color:#fff;
          text-decoration:none;
          font-size:15px;
          font-weight:900;
          background:rgba(255,255,255,0.08);
          backdrop-filter:blur(10px);
        }

        .footer{
          background:#090712;
          padding:64px 5% 36px;
          border-top:1px solid rgba(255,255,255,0.05);
        }

        .footer-grid{
          display:grid;
          grid-template-columns:1.1fr .8fr .8fr;
          gap:36px;
          margin-bottom:40px;
        }

        .footer-brand{
          display:flex;
          align-items:center;
          gap:12px;
          margin-bottom:14px;
        }

        .footer-brand-mark{
          width:40px;
          height:40px;
          border-radius:14px;
          background:linear-gradient(135deg,#a78bfa,#8b5cf6);
          display:flex;
          align-items:center;
          justify-content:center;
          font-size:17px;
        }

        .footer-brand-title{
          font-size:15px;
          font-weight:900;
          color:#fff;
          letter-spacing:-.04em;
        }

        .footer-brand-title span{
          color:#c4b5fd;
        }

        .footer-brand-sub{
          font-size:10px;
          color:rgba(255,255,255,0.34);
          font-weight:900;
          letter-spacing:.14em;
          text-transform:uppercase;
          margin-top:4px;
        }

        .footer-head{
          font-size:11px;
          font-weight:900;
          color:rgba(255,255,255,0.34);
          letter-spacing:.14em;
          text-transform:uppercase;
          margin-bottom:16px;
        }

        .footer-text{
          font-size:14px;
          color:rgba(255,255,255,0.54);
          line-height:1.8;
          font-weight:600;
          max-width:280px;
        }

        .footer-link{
          display:block;
          margin-bottom:10px;
          padding:0;
          background:none;
          border:none;
          color:rgba(255,255,255,0.58);
          font-size:14px;
          font-weight:700;
          cursor:pointer;
          text-align:left;
          font-family:Montserrat, sans-serif;
          transition:color .22s ease;
        }

        .footer-link:hover,
        .footer-anchor:hover{
          color:#c4b5fd;
        }

        .footer-anchor{
          display:block;
          margin-bottom:10px;
          color:rgba(255,255,255,0.58);
          font-size:14px;
          font-weight:700;
          text-decoration:none;
          transition:color .22s ease;
        }

        .footer-bottom{
          border-top:1px solid rgba(255,255,255,0.08);
          padding-top:22px;
          display:flex;
          justify-content:space-between;
          align-items:center;
          gap:12px;
          flex-wrap:wrap;
          font-size:13px;
          color:rgba(255,255,255,0.34);
          font-weight:600;
        }

        @media (max-width: 980px){
          .hero-layout,
          .why-layout{
            grid-template-columns:1fr;
          }

          .hero-visual-wrap{
            justify-content:center;
          }

          .feature-grid{
            grid-template-columns:1fr;
          }

          .subject-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .steps-grid{
            grid-template-columns:repeat(2,minmax(0,1fr));
          }

          .footer-grid{
            grid-template-columns:1fr 1fr;
          }

          .desktop-nav{
            display:none;
          }

          .nav-ghost-link{
            display:none;
          }

          .burger-btn{
            display:flex;
          }
        }

        @media (max-width: 720px){
          .hero-section,
          .section,
          .cta-section{
            padding-left:20px;
            padding-right:20px;
          }

          .hero-stats,
          .subject-grid,
          .steps-grid,
          .footer-grid{
            grid-template-columns:1fr !important;
          }

          .hero-visual{
            height:470px;
          }

          .card-main{
            inset:42px 10px 52px 10px;
            padding:22px;
          }

          .card-1{
            width:160px;
            right:0;
          }

          .card-2{
            width:170px;
            right:8px;
          }
        }
      `}</style>
    </div>
  )
}