'use client'

import {
  motion,
  useScroll,
  useSpring,
  useReducedMotion,
  useMotionValue,
  useTransform,
  animate as fmAnimate,
} from 'framer-motion'
import { useRef, useState, useEffect, useCallback } from 'react'

/* ─────────────────────────────────────────────
   EASING & SHARED CONSTANTS
───────────────────────────────────────────── */
const EASE = [0.16, 1, 0.3, 1] as [number, number, number, number]
const EASE_OUT = [0.22, 1, 0.36, 1] as [number, number, number, number]

/* ─────────────────────────────────────────────
   HERO — stagger variants (delay 0.15 between children)
───────────────────────────────────────────── */
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.15, delayChildren: 0.08 } },
}
const heroItem = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.72, ease: EASE } },
}

/* ─────────────────────────────────────────────
   SECTION SCROLL REVEAL
───────────────────────────────────────────── */
const revealUp = {
  initial:     { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, amount: 0.2 },
  transition:  { duration: 0.6, ease: EASE },
}
const revealUpDelay = (d: number) => ({
  ...revealUp,
  transition: { duration: 0.6, ease: EASE, delay: d },
})

/* ─────────────────────────────────────────────
   CARD STAGGER — for grids (opacity 0→1, y 30→0)
───────────────────────────────────────────── */
const gridContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}
const gridItem = {
  hidden: { opacity: 0, y: 30 },
  show:   { opacity: 1, y: 0,  transition: { duration: 0.6, ease: EASE } },
}

/* ─────────────────────────────────────────────
   CARD HOVER — scale 1.03 + shadow
───────────────────────────────────────────── */
const cardHover = {
  rest:  { scale: 1,    y: 0,  boxShadow: '0 8px 32px rgba(14,165,233,0.08)' },
  hover: {
    scale: 1.03, y: -5,
    boxShadow: '0 28px 60px rgba(14,165,233,0.20)',
    transition: { duration: 0.26, ease: EASE_OUT },
  },
}

/* ─────────────────────────────────────────────
   SCROLL PROGRESS BAR
───────────────────────────────────────────── */
function ScrollProgress() {
  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30, restDelta: 0.001 })
  return (
    <motion.div
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, height: 2.5,
        background: 'linear-gradient(90deg, #38bdf8, #0ea5e9, #0284c7)',
        transformOrigin: '0%', scaleX, zIndex: 9999,
        boxShadow: '0 0 10px rgba(14,165,233,0.55)',
      }}
    />
  )
}

/* ─────────────────────────────────────────────
   CURSOR GLOW — global radial that follows cursor
───────────────────────────────────────────── */
function CursorGlow() {
  const [pos, setPos] = useState({ x: -999, y: -999 })
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) return
    const fn = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY })
    window.addEventListener('mousemove', fn)
    return () => window.removeEventListener('mousemove', fn)
  }, [shouldReduce])

  if (shouldReduce) return null
  return (
    <div
      style={{
        position: 'fixed',
        left: pos.x - 220, top: pos.y - 220,
        width: 440, height: 440, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(56,189,248,0.055) 0%, transparent 68%)',
        pointerEvents: 'none', zIndex: 1,
        transition: 'left 0.09s linear, top 0.09s linear',
      }}
    />
  )
}

/* ─────────────────────────────────────────────
   GLOW CARD — cursor glow on individual cards
───────────────────────────────────────────── */
function GlowCard({
  children, className, style,
}: {
  children: React.ReactNode
  className?: string
  style?: React.CSSProperties
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [glow, setGlow] = useState({ x: 0, y: 0, visible: false })
  const shouldReduce = useReducedMotion()

  const onMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (shouldReduce) return
    const rect = ref.current?.getBoundingClientRect()
    if (!rect) return
    setGlow({ x: e.clientX - rect.left, y: e.clientY - rect.top, visible: true })
  }, [shouldReduce])

  const onLeave = useCallback(() => setGlow(p => ({ ...p, visible: false })), [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className={className}
      style={{ position: 'relative', overflow: 'hidden', ...style }}
    >
      {/* local glow spot */}
      <div
        style={{
          position: 'absolute',
          width: 320, height: 320, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(56,189,248,0.13) 0%, transparent 70%)',
          left: glow.x - 160, top: glow.y - 160,
          opacity: glow.visible ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.35s ease',
          zIndex: 0,
        }}
      />
      <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
    </div>
  )
}

/* ─────────────────────────────────────────────
   COUNT-UP
───────────────────────────────────────────── */
function CountUp({ end, suffix = '' }: { end: number; suffix?: string }) {
  const [count, setCount] = useState(0)
  const nodeRef = useRef<HTMLSpanElement>(null)
  const hasRun = useRef(false)
  const shouldReduce = useReducedMotion()

  useEffect(() => {
    if (shouldReduce) { setCount(end); return }
    const el = nodeRef.current
    if (!el) return
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true
        let startTime: number | null = null
        const duration = 1400
        const step = (now: number) => {
          if (!startTime) startTime = now
          const progress = Math.min((now - startTime) / duration, 1)
          const eased = 1 - Math.pow(1 - progress, 3)
          setCount(Math.round(eased * end))
          if (progress < 1) requestAnimationFrame(step)
        }
        requestAnimationFrame(step)
      }
    }, { threshold: 0.5 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [end, shouldReduce])

  return <span ref={nodeRef}>{count}{suffix}</span>
}

/* ─────────────────────────────────────────────
   PAGE ROOT
───────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <main style={{ background: '#ffffff', overflow: 'hidden' }}>
      <ScrollProgress />
      <CursorGlow />
      {/* slow-drifting ambient blobs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      <Header />
      <Hero />
      <Features />
      <Subjects />
      <AiTutor />
      <Simulator />
      <Parents />
      <HowItWorks />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
    </main>
  )
}

/* ─────────────────────────────────────────────
   HEADER
───────────────────────────────────────────── */
function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: EASE }}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 5%', height: 70,
        background: scrolled ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.72)',
        backdropFilter: 'blur(22px)', WebkitBackdropFilter: 'blur(22px)',
        borderBottom: scrolled ? '1px solid rgba(14,165,233,0.13)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 28px rgba(14,165,233,0.07)' : 'none',
        transition: 'all 0.32s ease',
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <motion.div
          whileHover={{ scale: 1.09, rotate: 4 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{
            width: 40, height: 40, borderRadius: 13,
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 18, fontWeight: 900,
            boxShadow: '0 10px 24px rgba(14,165,233,0.30)',
          }}
        >
          K
        </motion.div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.02em', lineHeight: 1.15 }}>
            KHAMADI ONLINE
          </div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#64748b', letterSpacing: '0.04em' }}>
            ҰБТ preparation platform
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {['#features', '#subjects', '#ai', '#simulator', '#parents'].map((href, i) => {
          const labels = ['Мүмкіндіктер', 'Пәндер', 'AI Tutor', 'Симулятор', 'Ата-ана']
          return (
            <a key={href} href={href} className="nav-link">{labels[i]}</a>
          )
        })}
      </nav>

      {/* Auth buttons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <motion.a
          href="https://www.instagram.com/khamadi.online?igsh=MWV2c2hmOTJpNXJkZw%3D%3D&utm_source=qr"
          target="_blank" rel="noopener noreferrer"
          whileHover={{ scale: 1.08, boxShadow: '0 6px 18px rgba(14,165,233,0.18)' }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2, ease: EASE }}
          style={{
            width: 38, height: 38, borderRadius: 12,
            border: '1px solid rgba(14,165,233,0.15)', background: '#fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#0ea5e9', boxShadow: '0 4px 12px rgba(14,165,233,0.08)',
          }}
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm10 1.5A3.5 3.5 0 0 1 20.5 7v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5h10zM12 7.8A4.2 4.2 0 1 0 16.2 12 4.205 4.205 0 0 0 12 7.8zm0 6.9A2.7 2.7 0 1 1 14.7 12 2.703 2.703 0 0 1 12 14.7zm5.1-7.65a1.05 1.05 0 1 0 1.05 1.05 1.052 1.052 0 0 0-1.05-1.05z" />
          </svg>
        </motion.a>

        <motion.a
          href="/login"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, ease: EASE }}
          style={{
            padding: '9px 18px', borderRadius: 999,
            border: '1px solid rgba(14,165,233,0.20)', background: '#fff',
            color: '#0284c7', fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
            display: 'inline-flex', alignItems: 'center',
          }}
        >
          Кіру
        </motion.a>

        <motion.a
          href="/register"
          whileHover={{ scale: 1.05, boxShadow: '0 18px 40px rgba(14,165,233,0.42)' }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.22, ease: EASE }}
          style={{
            padding: '9px 20px', borderRadius: 999,
            background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
            color: '#fff', fontSize: 14, fontWeight: 800, letterSpacing: '-0.01em',
            display: 'inline-flex', alignItems: 'center',
            boxShadow: '0 10px 28px rgba(14,165,233,0.28)',
          }}
        >
          Бастау
        </motion.a>
      </div>
    </motion.header>
  )
}

/* ─────────────────────────────────────────────
   HERO
───────────────────────────────────────────── */
function Hero() {
  /* mouse parallax for the mockup card */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const rotX  = useTransform(my, [-0.5, 0.5], [ 4, -4])
  const rotY  = useTransform(mx, [-0.5, 0.5], [-6,  6])
  const txMock = useTransform(mx, [-0.5, 0.5], [-10, 10])
  const tyMock = useTransform(my, [-0.5, 0.5], [-6,  6])

  const onMove = useCallback((e: React.MouseEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }, [mx, my])

  const onLeave = useCallback(() => {
    fmAnimate(mx, 0, { duration: 0.6, ease: 'easeOut' })
    fmAnimate(my, 0, { duration: 0.6, ease: 'easeOut' })
  }, [mx, my])

  return (
    <section
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        minHeight: '100vh',
        display: 'flex', alignItems: 'center',
        padding: '100px 5% 80px',
        position: 'relative', overflow: 'hidden',
        background: 'linear-gradient(160deg, #ffffff 0%, #f0f9ff 55%, #e0f2fe 100%)',
      }}
    >
      <div className="grid-bg" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <div
        style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56,
          alignItems: 'center', maxWidth: 1240, margin: '0 auto',
          width: '100%', position: 'relative', zIndex: 2,
        }}
      >
        {/* ── Left: stagger children ── */}
        <motion.div
          variants={heroContainer}
          initial="hidden"
          animate="show"
        >
          {/* Badge */}
          <motion.div variants={heroItem} className="badge-pill" style={{ marginBottom: 28, display: 'inline-flex' }}>
            <motion.span
              animate={{ scale: [1, 1.35, 1] }}
              transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 8, height: 8, borderRadius: 999, background: '#34d399', display: 'inline-block' }}
            />
            PREMIUM UBT ECOSYSTEM · 2026
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={heroItem}
            style={{
              fontSize: 'clamp(42px, 5vw, 72px)', fontWeight: 800,
              lineHeight: 1.04, letterSpacing: '-2.5px',
              color: '#0c4a6e', marginBottom: 26,
            }}
          >
            ҰБТ-ге ДАЙЫНДЫҚТЫҢ{' '}
            <span className="text-gradient">ЗАМАНАУИ</span>
            <br />ДЕҢГЕЙІ
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            variants={heroItem}
            style={{ fontSize: 18, lineHeight: 1.85, color: '#475569', marginBottom: 38, maxWidth: 560 }}
          >
            AI талдау, нақты ҰБТ симуляторы және жеке оқу жоспары арқылы
            жүйелі дайындалып, жоғары нәтижеге жетіңіз.
          </motion.p>

          {/* CTA buttons */}
          <motion.div variants={heroItem} style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 44 }}>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05, boxShadow: '0 28px 56px rgba(14,165,233,0.46)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="hero-primary"
              style={{ textDecoration: 'none' }}
            >
              Тегін бастау
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>

            <motion.a
              href="#features"
              whileHover={{ scale: 1.05, boxShadow: '0 14px 32px rgba(14,165,233,0.14)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="hero-secondary"
              style={{ textDecoration: 'none' }}
            >
              Толық таныс
            </motion.a>
          </motion.div>

        </motion.div>

        {/* ── Right: floating + parallax mockup ── */}
        <motion.div
          variants={heroItem}
          initial="hidden"
          animate="show"
          style={{ x: txMock, y: tyMock, rotateX: rotX, rotateY: rotY, transformPerspective: 1200 }}
        >
          {/* Floating wrapper */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 6, ease: 'easeInOut', repeat: Infinity }}
          >
            <GlowCard style={{ borderRadius: 36 }}>
              <div className="hero-card">
                {/* Terminal bar */}
                <div className="hero-top-panel">
                  <div style={{ display: 'flex', gap: 8 }}>
                    <span className="dot red" />
                    <span className="dot yellow" />
                    <span className="dot green" />
                  </div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.04em' }}>AI TUTOR · LIVE</div>
                  <motion.div
                    animate={{ opacity: [1, 0.3, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{ width: 8, height: 8, borderRadius: 999, background: '#34d399' }}
                  />
                </div>

                {/* AI user card */}
                <div className="ai-ask-card shine-wrap" style={{ marginBottom: 14 }}>
                  <div className="shine-line" />
                  <div style={{ fontSize: 11, fontWeight: 800, opacity: 0.8, marginBottom: 10, letterSpacing: '0.05em' }}>СЕН:</div>
                  <div style={{ fontSize: 15, fontWeight: 700, lineHeight: 1.75 }}>
                    Физикадан Ньютон заңдарын қалай жылдам үйренемін?
                  </div>
                </div>

                {/* AI answer */}
                <div className="ai-answer-card">
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', marginBottom: 10, letterSpacing: '0.05em' }}>AI TUTOR:</div>
                  <div style={{ fontSize: 14, lineHeight: 1.85 }}>
                    Ньютонның 3 заңын мнемоникамен үйрен:{' '}
                    <strong style={{ color: '#38bdf8' }}>Инерция → Күш = масса × үдеу → Іс-қимыл</strong>.
                    Күн сайын 15 минут бекіту керек.
                  </div>
                </div>

                {/* Mini stats */}
                <div className="mini-stats">
                  <div className="mini-stat glass-card">
                    <div className="stat-label">Ағым дайындығы</div>
                    <div className="stat-value">91%</div>
                    <div className="progress-line">
                      <motion.div
                        className="progress-fill"
                        initial={{ width: 0 }}
                        animate={{ width: '91%' }}
                        transition={{ duration: 1.2, delay: 0.8, ease: EASE }}
                      />
                    </div>
                  </div>
                  <div className="mini-stat glass-card">
                    <div className="stat-label">ҰБТ-ға дейін</div>
                    <div className="stat-value" style={{ fontSize: 26 }}>67 күн</div>
                    <div className="stat-desc">Барлық сабақтар жоспарлы</div>
                  </div>
                </div>
              </div>
            </GlowCard>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}


/* ─────────────────────────────────────────────
   FEATURES
───────────────────────────────────────────── */
const featuresList = [
  { icon: '🤖', title: 'AI тьютор', text: 'Кез-келген сұраққа жауап береді. Тақырыптарды кезең-кезеңімен түсіндіреді, нақты мысалдар мен стратегиялар ұсынады.' },
  { icon: '📊', title: 'Нақты симулятор', text: '120 сұрақ, 240 минут, 5 пән. ҰБТ форматына толық сай нақты балл мен анализ береді.' },
  { icon: '📅', title: 'Жеке жоспар', text: 'AI сенің деңгейіңе, мақсатқа және ҰБТ-ға дейінгі күндер санына қарап жеке оқу жоспары жасайды.' },
  { icon: '📈', title: 'Прогресс анализі', text: 'Динамика, тенденция, əлсіз тақырыптар. AI орындалған жұмысты талдап, нақты кеңес береді.' },
  { icon: '🏆', title: 'Геймификация', text: 'XP ұпайлар, деңгейлер, стрик, жетістік жолақтары. Оқу бәсекелі және ынталандырушы болады.' },
  { icon: '👨‍👩‍👧', title: 'Ата-ана кабинеті', text: 'Ата-аналар баланың прогресін, активностін, балын нақты уақытта қашықтан бақылайды.' },
]

function Features() {
  return (
    <section id="features" style={{ padding: '80px 5%', background: '#f0f9ff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <motion.div {...revealUp} style={{ textAlign: 'center', marginBottom: 56 }}>
          <div className="section-kicker">Мүмкіндіктер</div>
          <h2 className="section-title">Барлығы бір платформада</h2>
          <p className="section-text">
            Жетекші EdTech үлгісімен жасалған инструменттер — ҰБТ-ге тиімді
            дайындау үшін ең жақсы жолмен жасалды.
          </p>
        </motion.div>

        {/* stagger grid */}
        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.12 }}
          className="features-grid"
        >
          {featuresList.map((f) => (
            <motion.div key={f.title} variants={gridItem} initial="rest" whileHover="hover">
              <motion.div variants={cardHover}>
                <GlowCard className="feature-card">
                  <motion.div
                    className="feature-icon"
                    whileHover={{ scale: 1.18, rotate: 6, transition: { duration: 0.22, ease: EASE } }}
                  >
                    {f.icon}
                  </motion.div>
                  <div className="feature-title">{f.title}</div>
                  <div className="feature-text">{f.text}</div>
                </GlowCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SUBJECTS
───────────────────────────────────────────── */
const subjectsList = [
  { icon: '🇰🇿', name: 'Қазақстан тарихы',          desc: 'Міндетті пән' },
  { icon: '📖', name: 'Оқу сауаттылығы',              desc: 'Міндетті пән' },
  { icon: '🔢', name: 'Математикалық сауаттылық',     desc: 'Міндетті пән' },
  { icon: '⚛️', name: 'Физика',                       desc: 'Бейіндік' },
  { icon: '🧮', name: 'Математика',                   desc: 'Бейіндік' },
  { icon: '🧬', name: 'Биология',                     desc: 'Бейіндік' },
  { icon: '⚗️', name: 'Химия',                        desc: 'Бейіндік' },
  { icon: '💻', name: 'Информатика',                  desc: 'Бейіндік' },
  { icon: '🌍', name: 'География',                    desc: 'Бейіндік' },
  { icon: '🌐', name: 'Шет тілі',                     desc: 'Бейіндік' },
  { icon: '⚖️', name: 'Құқық',                       desc: 'Бейіндік' },
  { icon: '🏛️', name: 'Дүниежүзі тарихы',            desc: 'Бейіндік' },
]

function Subjects() {
  return (
    <section id="subjects" style={{ padding: '80px 5%', background: '#ffffff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <motion.div {...revealUp} style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-kicker">Пәндер</div>
          <h2 className="section-title">Барлық ҰБТ пәндері</h2>
          <p className="section-text">
         Міндетті пәндерден бастап барлық бейіндік комбинацияларға дейін —
         <span style={{ whiteSpace: "nowrap" }}>AI-мұғаліммен</span> бірге авторлы контент.
         </p>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.1 }}
          style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}
        >
          {subjectsList.map((s) => (
            <motion.div key={s.name} variants={gridItem} initial="rest" whileHover="hover">
              <motion.div variants={cardHover}>
                <GlowCard
                  className="subject-card"
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, cursor: 'default' }}
                >
                  <motion.div
                    style={{ fontSize: 32, display: 'inline-block' }}
                    whileHover={{ scale: 1.22, rotate: -8, transition: { duration: 0.22, ease: EASE } }}
                  >
                    {s.icon}
                  </motion.div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', letterSpacing: '-0.2px', lineHeight: 1.4 }}>{s.name}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: '#0ea5e9', letterSpacing: '0.3px' }}>{s.desc}</div>
                </GlowCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   AI TUTOR SECTION
───────────────────────────────────────────── */
function AiTutor() {
  return (
    <section id="ai" style={{ padding: '80px 5%', background: '#f0f9ff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <motion.div {...revealUp} className="ai-section">
          {/* Left text */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="section-kicker light">AI Технология</div>
            <h2 className="ai-title">
              Нақты уақытта сұраққа жауап беретін AI мұғалім
            </h2>
            <p className="ai-text">
              KHAMADI AI негізінде жұмыс істейді — кез-келген пәннен, кез-келген
              деңгейде. Түсіндіреді, мысал береді, стратегия ұсынады. 24/7 қол жетімді.
            </p>

            <motion.a
              href="/register"
              whileHover={{ scale: 1.06, boxShadow: '0 22px 48px rgba(255,255,255,0.32)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              style={{
                marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '14px 26px', borderRadius: 999, background: '#ffffff',
                color: '#0284c7', fontSize: 15, fontWeight: 800, textDecoration: 'none',
                boxShadow: '0 12px 32px rgba(255,255,255,0.20)', letterSpacing: '-0.01em',
              }}
            >
              AI тьюторды сынап көр
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>
          </div>

          {/* Right chat preview */}
          <motion.div {...revealUpDelay(0.18)} className="ai-chat-card">
            {[
              { role: 'user', text: 'Электрмагниттік индукция формуласын түсіндір?' },
              { role: 'ai',   text: 'ЭМИ — өзгеретін магнит ағыны ЭҚК тудырады. Формула: ε = −ΔΦ/Δt. Белгі минус — Ленц ережесі бойынша. Мысал: трансформатор, генератор — осы принципке негізделген.' },
              { role: 'user', text: 'Ленц ережесінің мысалы?' },
              { role: 'ai',   text: 'Магнит катушкаға жақындаса — индукцияланған ток оны итереді. Алыстаса — тартады. Бұл энергия сақталу заңының магнит нұсқасы.' },
            ].map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12, ease: EASE }}
                className={m.role === 'user' ? 'chat-user' : 'chat-ai'}
              >
                {m.role === 'ai' && (
                  <div style={{ fontSize: 11, fontWeight: 800, color: '#38bdf8', marginBottom: 8, letterSpacing: '0.04em' }}>AI TUTOR</div>
                )}
                {m.text}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   SIMULATOR
───────────────────────────────────────────── */
function Simulator() {
  const stats = [
    { val: '120', label: 'Сұрақ',  sub: 'ҰБТ форматы',  accent: true },
    { val: '140', label: 'Балл',   sub: 'Максимум',      accent: false },
    { val: '240', label: 'Минут',  sub: 'Тест уақыты',   accent: false },
    { val: '5',   label: 'Пән',    sub: 'Бір сессияда',  accent: false },
  ]

  return (
    <section id="simulator" style={{ padding: '80px 5%', background: '#ffffff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* Left — stat cards */}
          <motion.div {...revealUp}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 28 }}>
              {stats.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, scale: 0.88 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: i * 0.08, ease: EASE }}
                  whileHover={{ scale: 1.05, y: -4, boxShadow: '0 24px 48px rgba(14,165,233,0.20)', transition: { duration: 0.24, ease: EASE } }}
                  style={{
                    background: s.accent ? 'linear-gradient(135deg, #0c4a6e, #0ea5e9)' : '#ffffff',
                    border: '1px solid rgba(14,165,233,0.15)',
                    borderRadius: 24, padding: '24px', textAlign: 'center',
                    boxShadow: '0 10px 30px rgba(14,165,233,0.08)',
                  }}
                >
                  <div style={{ fontSize: 48, fontWeight: 900, letterSpacing: '-0.05em', lineHeight: 1, marginBottom: 8, color: s.accent ? '#fff' : '#0c4a6e' }}>
                    {s.val}
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4, color: s.accent ? 'rgba(255,255,255,0.9)' : '#0c4a6e' }}>{s.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: s.accent ? 'rgba(255,255,255,0.65)' : '#64748b' }}>{s.sub}</div>
                </motion.div>
              ))}
            </div>

            <motion.a
              href="/register"
              whileHover={{ scale: 1.04, boxShadow: '0 24px 52px rgba(14,165,233,0.40)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="btn-primary"
              style={{ textDecoration: 'none', fontSize: 16, padding: '16px 32px' }}
            >
              Симуляторды сынап көр →
            </motion.a>
          </motion.div>

          {/* Right — text */}
          <motion.div {...revealUpDelay(0.15)}>
            <div className="section-kicker">ҰБТ Симулятор</div>
            <h2 className="section-title">Нақты форматтағы тест тәжірибесі</h2>
            <p className="section-text" style={{ margin: 0, textAlign: 'left' }}>
              Уақыт қысымы, пән навигациясы, автоматты балл есебі. ҰБТ сессиясын
              шынайы жағдайда өту — психологиялық дайындық пен нақты деңгейіңді
              анықтауда маңызды.
            </p>

            <div style={{ marginTop: 28, display: 'grid', gap: 14 }}>
              {[
                'AI арқылы генерацияланған 120 сұрақ',
                'Нақты таймер мен навигация',
                'Аяқталған соң AI анализі',
                'Аптасына 1 рет — ең нақты дайындық',
              ].map((item, i) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12 }}
                >
                  <motion.div
                    whileHover={{ scale: 1.2, transition: { duration: 0.2 } }}
                    style={{
                      width: 22, height: 22, borderRadius: 999,
                      background: 'rgba(14,165,233,0.12)',
                      border: '1px solid rgba(14,165,233,0.20)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3">
                      <path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </motion.div>
                  <span style={{ fontSize: 15, color: '#475569', fontWeight: 700 }}>{item}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   PARENTS
───────────────────────────────────────────── */
function Parents() {
  return (
    <section id="parents" style={{ padding: '80px 5%', background: '#f0f9ff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>
          {/* Left text */}
          <motion.div {...revealUp}>
            <div className="section-kicker">Ата-ана кабинеті</div>
            <h2 className="section-title">Баланың прогресін қашықтан бақылаңыз</h2>
            <p className="section-text" style={{ margin: '0 0 32px', textAlign: 'left' }}>
              Ата-аналар арнайы кабинет арқылы баланың оқу динамикасын,
              соңғы балдарын және активностін нақты уақытта бақылай алады.
            </p>

            {[
              { icon: '📊', title: 'Нақты уақытта прогресс', text: 'Соңғы симулятор балдары мен динамика' },
              { icon: '🔔', title: 'Белсенділік картасы',    text: 'Күнделікті оқу уақыты мен қарқыны' },
              { icon: '🔗', title: 'Баланың коды арқылы',   text: 'Тіркелу үшін тек студент коды керек' },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.52, delay: i * 0.1, ease: EASE }}
                style={{ display: 'flex', gap: 16, marginBottom: 18 }}
              >
                <motion.div
                  whileHover={{ scale: 1.12, rotate: 4, transition: { duration: 0.22, ease: EASE } }}
                  style={{
                    width: 48, height: 48, borderRadius: 16,
                    background: '#ffffff', border: '1px solid rgba(14,165,233,0.15)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 22, flexShrink: 0, boxShadow: '0 6px 18px rgba(14,165,233,0.08)',
                  }}
                >
                  {item.icon}
                </motion.div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: '#0c4a6e', marginBottom: 4 }}>{item.title}</div>
                  <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7 }}>{item.text}</div>
                </div>
              </motion.div>
            ))}

            <motion.a
              href="/register"
              whileHover={{ scale: 1.04, boxShadow: '0 22px 48px rgba(14,165,233,0.36)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="btn-primary"
              style={{ marginTop: 10, textDecoration: 'none' }}
            >
              Ата-ана аккаунты →
            </motion.a>
          </motion.div>

          {/* Right — dashboard preview */}
          <motion.div {...revealUpDelay(0.18)}>
            <GlowCard
              style={{
                background: '#ffffff', border: '1px solid rgba(14,165,233,0.15)',
                borderRadius: 32, padding: 28, boxShadow: '0 24px 60px rgba(14,165,233,0.10)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 4 }}>АТА-АНА КАБИНЕТІ</div>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>Баланың прогресі</div>
                </div>
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  style={{
                    width: 40, height: 40, borderRadius: 13,
                    background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18,
                  }}
                >
                  📊
                </motion.div>
              </div>

              {[
                { subject: 'Физика',              score: 38, max: 40, color: '#0ea5e9' },
                { subject: 'Математика',           score: 34, max: 40, color: '#38bdf8' },
                { subject: 'Қазақстан тарихы',    score: 22, max: 20, color: '#34d399' },
              ].map((r) => (
                <div key={r.subject} style={{ marginBottom: 14 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 800, color: '#0c4a6e' }}>{r.subject}</span>
                    <span style={{ fontSize: 13, fontWeight: 900, color: r.color }}>{r.score}/{r.max}</span>
                  </div>
                  <div style={{ height: 6, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(r.score / r.max) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.1, ease: EASE }}
                      style={{ height: '100%', borderRadius: 999, background: r.color }}
                    />
                  </div>
                </div>
              ))}

              <div style={{ marginTop: 18, padding: '14px 18px', borderRadius: 18, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)' }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#64748b', marginBottom: 6 }}>ЖАЛПЫ БАЛЛ</div>
                <div style={{ fontSize: 36, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em' }}>94 / 140</div>
              </div>
            </GlowCard>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   HOW IT WORKS
───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { num: '01', title: 'Тіркел',     text: 'Оқушы немесе ата-ана ретінде тіркеліп, пәндер комбинациясын таңда.' },
    { num: '02', title: 'Жоспар ал',  text: 'AI сенің деңгейіңе қарап жеке дайындық жоспарын автоматты жасайды.' },
    { num: '03', title: 'Дайындал',   text: 'AI тьютор, симулятор, анализ арқылы күн сайын тиімді оқы.' },
  ]

  return (
    <section style={{ padding: '80px 5%', background: '#ffffff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <motion.div {...revealUp} style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="section-kicker">Қалай жұмыс істейді</div>
          <h2 className="section-title">3 қадамда бастау</h2>
        </motion.div>

        <motion.div
          variants={gridContainer}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          className="steps-grid"
        >
          {steps.map((s) => (
            <motion.div key={s.num} variants={gridItem} initial="rest" whileHover="hover">
              <motion.div variants={cardHover}>
                <GlowCard className="step-card">
                  <div className="step-number">{s.num}</div>
                  <div className="step-title">{s.title}</div>
                  <div className="step-text">{s.text}</div>
                </GlowCard>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FINAL CTA
───────────────────────────────────────────── */
function FinalCTA() {
  return (
    <section style={{ padding: '80px 5%', background: '#f0f9ff' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <motion.div {...revealUp} className="cta-card">
          <div>
            <div className="section-kicker">Бастау</div>
            <h2 className="cta-title">ҰБТ-ға бірге<br />дайындалайық</h2>
            <p className="cta-text">
              Ең жақсы нәтиже үшін ең жақсы платформамен.
              <br />
              KHAMADI ONLINE — 120+ балл алу жолыңда серіктесің.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', alignItems: 'center' }}>
            <motion.a
              href="/register"
              whileHover={{ scale: 1.05, boxShadow: '0 24px 56px rgba(14,165,233,0.44)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="hero-primary"
              style={{ textDecoration: 'none' }}
            >
              Тегін тіркел
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.a>

            <motion.a
              href="https://wa.me/77066405577"
              target="_blank" rel="noopener noreferrer"
              whileHover={{ scale: 1.05, boxShadow: '0 14px 32px rgba(14,165,233,0.16)' }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.22, ease: EASE }}
              className="hero-secondary"
              style={{ textDecoration: 'none' }}
            >
              WhatsApp-та сұра
            </motion.a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────
   FOOTER
───────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ background: '#0c4a6e', color: 'rgba(255,255,255,0.75)', padding: '48px 5% 36px' }}>
      <div style={{ maxWidth: 1240, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 28, marginBottom: 36 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#fff', fontSize: 17, fontWeight: 900,
              }}>K</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em' }}>KHAMADI ONLINE</div>
            </div>
            <div style={{ fontSize: 14, lineHeight: 1.85, maxWidth: 280 }}>
              Қазақстанның алдыңғы қатарлы ҰБТ дайындық платформасы.
            </div>
          </div>

          <div style={{ display: 'flex', gap: 52, flexWrap: 'wrap' }}>
            {[
              { title: 'Платформа', links: ['Мүмкіндіктер', 'Симулятор', 'AI Tutor', 'Прогресс'] },
              { title: 'Байланыс',  links: ['Instagram', 'WhatsApp', 'Email', 'Telegram'] },
            ].map((col) => (
              <div key={col.title}>
                <div style={{ fontSize: 12, fontWeight: 800, color: '#ffffff', letterSpacing: '0.06em', marginBottom: 16, textTransform: 'uppercase' }}>
                  {col.title}
                </div>
                <div style={{ display: 'grid', gap: 10 }}>
                  {col.links.map((l) => (
                    <motion.a
                      key={l} href="#"
                      whileHover={{ x: 3, color: '#38bdf8' }}
                      transition={{ duration: 0.18, ease: EASE }}
                      className="footer-link"
                      style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, display: 'inline-block' }}
                    >
                      {l}
                    </motion.a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 24, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ fontSize: 13 }}>© 2026 KHAMADI ONLINE. Барлық құқықтар қорғалған.</div>
          <div style={{ fontSize: 13 }}>Almaty, Kazakhstan 🇰🇿</div>
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────
   WHATSAPP FLOAT
───────────────────────────────────────────── */
function WhatsAppFloat() {
  return (
    <motion.a
      href="https://wa.me/77066405577"
      target="_blank" rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, delay: 1.4, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.13, boxShadow: '0 18px 44px rgba(37,211,102,0.55)' }}
      whileTap={{ scale: 0.95 }}
      style={{
        position: 'fixed', bottom: 28, right: 28, zIndex: 999,
        width: 58, height: 58, borderRadius: 999,
        background: '#25d366',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: '0 12px 32px rgba(37,211,102,0.40)',
        color: '#ffffff', textDecoration: 'none',
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.52 0 .18 5.34.18 11.88c0 2.1.54 4.14 1.56 5.94L0 24l6.36-1.68a11.86 11.86 0 0 0 5.7 1.44h.06c6.54 0 11.88-5.34 11.88-11.88 0-3.18-1.26-6.18-3.48-8.4zM12.12 21.78h-.06a9.9 9.9 0 0 1-5.04-1.38l-.36-.18-3.78.96 1.02-3.66-.24-.36a9.87 9.87 0 0 1-1.56-5.28c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 7.02c0 5.46-4.44 9.9-9.72 9.9zm5.4-7.38c-.3-.18-1.8-.9-2.1-1.02-.24-.06-.48-.12-.66.18-.18.3-.72 1.02-.9 1.2-.12.18-.3.24-.6.06-.3-.18-1.2-.42-2.28-1.38-.84-.72-1.44-1.62-1.62-1.92-.18-.3 0-.42.12-.6.12-.12.3-.3.42-.48.18-.18.24-.3.36-.54.12-.18.06-.42 0-.54-.06-.18-.66-1.62-.9-2.16-.24-.6-.48-.48-.66-.48h-.54c-.18 0-.48.06-.72.3-.24.3-.96.9-.96 2.16 0 1.32.96 2.58 1.08 2.76.18.18 1.92 3 4.68 4.08.66.3 1.2.42 1.62.54.66.18 1.26.18 1.74.12.54-.06 1.8-.72 2.04-1.44.3-.72.3-1.32.18-1.44-.06-.12-.24-.18-.54-.36z" />
      </svg>
    </motion.a>
  )
}
