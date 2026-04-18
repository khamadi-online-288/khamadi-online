'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'

function useReveal(threshold = 0.14) {
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

function useCounter(target: number, active: boolean, duration = 1400) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!active) return

    let current = 0
    const step = target / (duration / 16)

    const timer = setInterval(() => {
      current += step
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [active, target, duration])

  return count
}

const GENERAL = [
  {
    title: 'A1 Beginner',
    icon: '🌱',
    level: 'A1',
    lessons: 12,
    desc: 'Старт с нуля: базовые фразы, простая грамматика, словарь и уверенный вход в язык.',
  },
  {
    title: 'A2 Elementary',
    icon: '📗',
    level: 'A2',
    lessons: 14,
    desc: 'Повседневный английский для общения, поездок, покупок и бытовых диалогов.',
  },
  {
    title: 'B1 Intermediate',
    icon: '📘',
    level: 'B1',
    lessons: 16,
    desc: 'Уровень для учёбы, работы и более свободной устной и письменной коммуникации.',
  },
  {
    title: 'B2 Upper-Intermediate',
    icon: '📙',
    level: 'B2',
    lessons: 18,
    desc: 'Сильная грамматика, структурированное письмо, аргументация и уверенная речь.',
  },
  {
    title: 'C1 Advanced',
    icon: '🏆',
    level: 'C1',
    lessons: 20,
    desc: 'Продвинутый английский для переговоров, презентаций, карьеры и профессиональной среды.',
  },
]

const SPECIAL = [
  {
    title: 'Accounting',
    icon: '🧾',
    lessons: 10,
    desc: 'Бухгалтерия, отчётность, налоги и деловая переписка на английском.',
  },
  {
    title: 'Computer Science',
    icon: '💻',
    lessons: 10,
    desc: 'Техническая лексика, документация, коммуникация в IT и рабочие сценарии.',
  },
  {
    title: 'Hospitality',
    icon: '🏨',
    lessons: 8,
    desc: 'Английский для гостиничного сервиса, туризма и работы с клиентами.',
  },
  {
    title: 'Management',
    icon: '📊',
    lessons: 10,
    desc: 'Коммуникация руководителя, управление командой, деловая речь и встречи.',
  },
  {
    title: 'Finance Industry',
    icon: '💰',
    lessons: 10,
    desc: 'Финансовая терминология, рынки, отчёты, банковская и корпоративная лексика.',
  },
  {
    title: 'Social Sciences',
    icon: '🧠',
    lessons: 10,
    desc: 'Английский для исследований, гуманитарных дисциплин и академической среды.',
  },
  {
    title: 'Law',
    icon: '⚖️',
    lessons: 10,
    desc: 'Юридическая лексика, документы, договоры и formal English.',
  },
]

const STEPS = [
  {
    n: '01',
    icon: '🎯',
    title: 'Определи свой уровень',
    text: 'Начни с удобной точки: от A1 до C1. Платформа помогает выбрать правильный маршрут обучения.',
  },
  {
    n: '02',
    icon: '🧠',
    title: 'Получи умный план',
    text: 'Система подскажет, на что сделать упор: грамматика, словарь, чтение, аудирование или письмо.',
  },
  {
    n: '03',
    icon: '📚',
    title: 'Учись в современном формате',
    text: 'Красивые интерактивные уроки, практика, тесты и понятная логика прохождения без перегруза.',
  },
  {
    n: '04',
    icon: '🏅',
    title: 'Заверши курс с результатом',
    text: 'После прохождения программы и итоговой проверки открывается сертификат о завершении курса.',
  },
]

const LESSON_TYPES = [
  {
    icon: '📖',
    title: 'Reading',
    desc: 'Современные тексты для понимания, словарного запаса и уверенного чтения.',
    color: 'rgba(14,165,233,0.10)',
  },
  {
    icon: '✍️',
    title: 'Writing',
    desc: 'Письменные задания, которые развивают структуру, точность и ясность речи.',
    color: 'rgba(34,197,94,0.10)',
  },
  {
    icon: '🎧',
    title: 'Listening',
    desc: 'Аудио с естественной речью, чтобы лучше понимать живой английский на слух.',
    color: 'rgba(168,85,247,0.10)',
  },
  {
    icon: '📝',
    title: 'Quiz',
    desc: 'Короткие тесты после уроков для закрепления материала и контроля прогресса.',
    color: 'rgba(245,158,11,0.10)',
  },
]

const FAQ_DATA = [
  {
    q: 'Можно ли начать с нуля?',
    a: 'Да. В линейке есть уровень A1 Beginner, который создан для тех, кто только начинает изучать английский.',
  },
  {
    q: 'Сколько длится один урок?',
    a: 'В среднем 30–45 минут. Урок разбит на части, поэтому его можно проходить поэтапно в удобном темпе.',
  },
  {
    q: 'Как выстроена программа?',
    a: 'Каждый курс объединяет чтение, письмо, аудирование, лексику и проверку знаний, чтобы развивать язык комплексно.',
  },
  {
    q: 'Подходит ли платформа для телефона?',
    a: 'Да. Лендинг и учебная платформа адаптированы под мобильные устройства, планшеты и ноутбуки.',
  },
  {
    q: 'Есть ли сертификат?',
    a: 'Да. После завершения курса и прохождения итоговой проверки открывается сертификат о завершении обучения.',
  },
  {
    q: 'Как начать обучение?',
    a: 'Достаточно зарегистрироваться и выбрать курс. После входа ты сразу попадаешь в личный кабинет.',
  },
]

function Reveal({
  children,
  delay = 0,
  style = {},
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  style?: React.CSSProperties
  className?: string
}) {
  const { ref, visible } = useReveal()

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0px)' : 'translateY(34px)',
        transition: `opacity .85s cubic-bezier(.22,1,.36,1) ${delay}ms, transform .85s cubic-bezier(.22,1,.36,1) ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  )
}

function TrustStat({
  num,
  suffix,
  label,
  active,
}: {
  num: number
  suffix: string
  label: string
  active: boolean
}) {
  const count = useCounter(num, active)

  return (
    <div style={{ textAlign: 'center' }}>
      <div
        style={{
          fontSize: 34,
          fontWeight: 900,
          color: '#0ea5e9',
          letterSpacing: '-0.06em',
          lineHeight: 1,
        }}
      >
        {count}
        {suffix}
      </div>
      <div
        style={{
          marginTop: 6,
          fontSize: 13,
          color: '#64748b',
          fontWeight: 700,
        }}
      >
        {label}
      </div>
    </div>
  )
}

export default function EnglishLandingPage() {
  const router = useRouter()
  const [faqOpen, setFaqOpen] = useState<number | null>(null)
  const [navScrolled, setNavScrolled] = useState(false)
  const [cursor, setCursor] = useState({ x: -200, y: -200 })
  const trustReveal = useReveal()

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 12)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const move = (e: MouseEvent) => {
      setCursor({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', move, { passive: true })
    return () => window.removeEventListener('mousemove', move)
  }, [])

  const toggleFaq = useCallback((i: number) => {
    setFaqOpen(prev => (prev === i ? null : i))
  }, [])

  return (
    <div
      style={{
        background: 'linear-gradient(180deg, #f8fcff 0%, #eef8ff 42%, #ffffff 100%)',
        minHeight: '100vh',
        color: '#0f172a',
        overflowX: 'hidden',
        position: 'relative',
      }}
    >
      <div
        className="cursor-glow"
        style={{
          left: cursor.x,
          top: cursor.y,
        }}
      />
      <div className="ambient ambient-1" />
      <div className="ambient ambient-2" />
      <div className="ambient ambient-3" />
      <div className="grid-overlay" />
      <div className="noise-overlay" />
      <div className="light-lines" />
      <div className={`scroll-top-beam ${navScrolled ? 'show' : ''}`} />

      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          background: navScrolled ? 'rgba(255,255,255,0.86)' : 'rgba(255,255,255,0.68)',
          backdropFilter: 'blur(18px)',
          borderBottom: navScrolled
            ? '1px solid rgba(14,165,233,0.12)'
            : '1px solid transparent',
          boxShadow: navScrolled ? '0 10px 32px rgba(14,165,233,0.10)' : 'none',
          transition: 'all .35s cubic-bezier(.22,1,.36,1)',
          padding: '0 5%',
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
            gap: 20,
          }}
        >
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
            onClick={() => router.push('/english')}
          >
            <div className="brand-box">🇬🇧</div>
            <div>
              <div
                style={{
                  fontSize: 15,
                  fontWeight: 900,
                  color: '#0f172a',
                  letterSpacing: '-0.04em',
                  lineHeight: 1.1,
                }}
              >
                KHAMADI
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 800,
                  color: '#0ea5e9',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                }}
              >
                English
              </div>
            </div>
          </div>

          <div className="nav-links-desktop" style={{ display: 'flex', gap: 6 }}>
            {[
              ['#courses', 'Курсы'],
              ['#how-it-works', 'Как это работает'],
              ['#ai', 'AI'],
              ['#faq', 'FAQ'],
            ].map(([href, label]) => (
              <a key={href} href={href} className="nav-link">
                {label}
              </a>
            ))}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button className="btn-ghost" onClick={() => router.push('/english/login')}>
              Войти
            </button>
            <button className="btn-primary" onClick={() => router.push('/english/register')}>
              Регистрация
            </button>
          </div>
        </div>
      </nav>

      <section
        style={{
          position: 'relative',
          padding: '40px 5% 74px',
          minHeight: 'calc(100vh - 76px)',
          display: 'flex',
          alignItems: 'flex-start',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            maxWidth: 1240,
            margin: '0 auto',
            width: '100%',
            position: 'relative',
            zIndex: 2,
            display: 'grid',
            gridTemplateColumns: '1.08fr 0.92fr',
            gap: 60,
            alignItems: 'start',
            paddingTop: 6,
          }}
        >
          <div style={{ paddingTop: 16 }}>
            <Reveal>
              <div className="hero-badge">✦ Digital-платформа</div>
            </Reveal>

            <Reveal delay={80}>
              <h1
                style={{
                  margin: '20px 0 20px',
                  fontSize: 'clamp(46px, 5.4vw, 86px)',
                  lineHeight: 0.94,
                  letterSpacing: '-0.075em',
                  fontWeight: 900,
                  color: '#0f172a',
                  maxWidth: 820,
                }}
              >
                Английский язык
                <br />
                <span className="hero-gradient">
                  который выглядит ярко
                  <br />и учит эффективно
                </span>
              </h1>
            </Reveal>

            <Reveal delay={140}>
              <p
                style={{
                  margin: '0 0 34px',
                  fontSize: 18,
                  lineHeight: 1.9,
                  color: '#475569',
                  maxWidth: 640,
                  fontWeight: 500,
                }}
              >
                Современные курсы от A1 до C1 по стандарту CEFR. Чистый интерфейс,
                сильная структура, AI-помощник, интерактивные уроки и сертификат
                по завершении — всё в одной digital-платформе.
              </p>
            </Reveal>

            <Reveal delay={220}>
              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', marginBottom: 40 }}>
                <button className="btn-hero-primary" onClick={() => router.push('/english/register')}>
                  Начать обучение →
                </button>
                <button className="btn-hero-glass" onClick={() => router.push('/english/login')}>
                  Войти в аккаунт
                </button>
              </div>
            </Reveal>

            <Reveal delay={280}>
              <div ref={trustReveal.ref} className="trust-grid">
                {([
                  [12, '+', 'курсов'],
                  [140, '+', 'уроков'],
                  [5, '', 'уровней CEFR'],
                  [100, '%', 'онлайн'],
                ] as [number, string, string][]).map(([num, suffix, label]) => (
                  <div key={label} className="trust-card">
                    <TrustStat
                      num={num}
                      suffix={suffix}
                      label={label}
                      active={trustReveal.visible}
                    />
                  </div>
                ))}
              </div>
            </Reveal>
          </div>

          <Reveal delay={180}>
            <div className="hero-stage">
              <div className="hero-stage-glow" />

              <div className="floating-card card-a">
                <div className="mini-top">AI INSIGHT</div>
                <div className="floating-title">Разбор ошибок в 1 клик</div>
                <div className="floating-text">
                  Платформа показывает слабые места и подсказывает, что повторить дальше.
                </div>
              </div>

              <div className="floating-card card-b">
                <div className="mini-top">LIVE PROGRESS</div>
                <div className="floating-title">86% за последний тест</div>
                <div className="floating-bar">
                  <div className="floating-bar-fill" style={{ width: '86%' }} />
                </div>
              </div>

              <div className="dashboard-shell">
                <div className="dashboard-top">
                  <div style={{ display: 'flex', gap: 6 }}>
                    <div className="top-dot red" />
                    <div className="top-dot yellow" />
                    <div className="top-dot green" />
                  </div>
                  <span className="dashboard-label">Learning Experience</span>
                  <span className="dashboard-live">● Live</span>
                </div>

                <div className="dashboard-panel strong">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                    <div className="dashboard-icon">✦</div>
                    <div>
                      <div className="dashboard-title">Кабинет студента</div>
                      <div className="dashboard-subtitle">
                        B1 Intermediate · чистый интерфейс · понятная структура
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard-panel blue">
                  <div className="mini-label">Текущий модуль</div>
                  <div className="dashboard-title" style={{ marginBottom: 12 }}>
                    B1 · Present Perfect vs Past Simple
                  </div>
                  <div className="row-between" style={{ marginBottom: 8 }}>
                    <span className="muted-small">Прогресс программы</span>
                    <span className="accent-small">7 / 16 уроков · 44%</span>
                  </div>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: '44%' }} />
                  </div>
                </div>

                <div className="dashboard-stats">
                  <div className="dashboard-panel compact">
                    <div className="mini-label">Серия</div>
                    <div className="stat-big yellow">14</div>
                    <div className="muted-small" style={{ marginTop: 6 }}>дней подряд</div>
                  </div>

                  <div className="dashboard-panel compact">
                    <div className="mini-label">Последний тест</div>
                    <div className="stat-big green">86%</div>
                    <div className="muted-small" style={{ marginTop: 6 }}>отличный результат</div>
                  </div>
                </div>

                <div className="dashboard-panel">
                  <div className="row-between" style={{ marginBottom: 8 }}>
                    <span className="accent-small">⚡ 1 240 XP заработано</span>
                    <span className="muted-small">до 1 500 XP</span>
                  </div>
                  <div className="progress-track thin">
                    <div className="progress-fill second" style={{ width: '83%' }} />
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="courses" className="section-wrap">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">Направления</div>
            <h2 className="section-title">12 курсов для разных целей</h2>
            <p className="section-text">
              От первых шагов до профессионального владения языком — выбери программу под свой уровень и задачу.
            </p>
          </Reveal>

          <Reveal style={{ marginBottom: 54 }}>
            <div className="line-heading">
              <div className="line" />
              <span>General English</span>
            </div>

            <div className="cards-grid general-grid">
              {GENERAL.map((c, i) => (
                <Reveal key={c.title} delay={i * 70}>
                  <div className="ultra-card course-card" onClick={() => router.push('/english/register')}>
                    <div className="card-shine" />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 30, marginBottom: 16 }}>{c.icon}</div>
                      <div className="card-title">{c.title}</div>
                      <div style={{ marginBottom: 14 }}>
                        <span className="level-pill">{c.level}</span>
                      </div>
                      <div className="card-text">{c.desc}</div>
                      <div className="card-bottom">
                        <span className="muted-small">📚 {c.lessons} уроков</span>
                        <span className="accent-small">Открыть →</span>
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal>
            <div className="line-heading">
              <div className="line" />
              <span>English for Special Purposes</span>
            </div>

            <div className="cards-grid special-grid">
              {SPECIAL.map((c, i) => (
                <Reveal key={c.title} delay={i * 60}>
                  <div className="ultra-card course-card small" onClick={() => router.push('/english/register')}>
                    <div className="card-shine" />
                    <div style={{ position: 'relative', zIndex: 1 }}>
                      <div style={{ fontSize: 30, marginBottom: 12 }}>{c.icon}</div>
                      <div className="card-title small">{c.title}</div>
                      <div className="card-text small">{c.desc}</div>
                      <div style={{ fontSize: 12, color: '#0ea5e9', fontWeight: 800 }}>
                        📚 {c.lessons} уроков
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="how-it-works" className="section-soft">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">Как это работает</div>
            <h2 className="section-title">Четыре шага к сильному английскому</h2>
          </Reveal>

          <div className="cards-grid steps-grid">
            {STEPS.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="ultra-card step-card">
                  <div className="card-shine" />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="mini-label" style={{ marginBottom: 14 }}>
                      Шаг {s.n}
                    </div>
                    <div style={{ fontSize: 38, marginBottom: 16 }}>{s.icon}</div>
                    <div className="step-title">{s.title}</div>
                    <div className="card-text">{s.text}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">Структура урока</div>
            <h2 className="section-title">Каждый урок включает 4 ключевых блока</h2>
            <p className="section-text">
              Комплексный формат помогает развивать язык системно: понимать, писать, слышать и применять знания на практике.
            </p>
          </Reveal>

          <div className="cards-grid lesson-grid">
            {LESSON_TYPES.map((lt, i) => (
              <Reveal key={lt.title} delay={i * 80}>
                <div className="ultra-card lesson-card">
                  <div className="card-shine" />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div
                      style={{
                        width: 66,
                        height: 66,
                        borderRadius: 22,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 30,
                        background: lt.color,
                        border: '1px solid rgba(14,165,233,0.08)',
                        marginBottom: 18,
                      }}
                    >
                      {lt.icon}
                    </div>
                    <div className="card-title">{lt.title}</div>
                    <div className="card-text">{lt.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section id="ai" className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="ai-shell">
              <div className="ai-glow" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="section-kicker light">AI-технологии</div>
                <h2 className="section-title" style={{ color: '#ffffff', marginBottom: 18 }}>
                  Умный AI-помощник
                  <br />в каждом уроке
                </h2>
                <p
                  className="section-text"
                  style={{
                    maxWidth: 560,
                    margin: 0,
                    color: 'rgba(255,255,255,0.86)',
                  }}
                >
                  Платформа анализирует прогресс, помогает разобраться в ошибках, подсказывает слабые места и делает обучение заметно удобнее и эффективнее.
                </p>

                <div style={{ marginTop: 30 }}>
                  <button className="btn-ai" onClick={() => router.push('/english/register')}>
                    Попробовать бесплатно →
                  </button>
                </div>
              </div>

              <div className="ai-chat-shell">
                <div className="mini-label" style={{ marginBottom: 16, color: 'rgba(255,255,255,0.62)' }}>
                  Пример диалога
                </div>

                <div className="chat-user">
                  📖 Объясни разницу между Present Perfect и Past Simple
                </div>

                <div className="chat-ai">
                  <strong style={{ color: '#dff7ff' }}>Present Perfect</strong> связывает прошлое с настоящим:
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.76)' }}>
                    “I have lived here for 5 years”
                  </span>{' '}
                  — я всё ещё живу здесь.
                  <br />
                  <br />
                  <strong style={{ color: '#dff7ff' }}>Past Simple</strong> говорит о завершённом действии в прошлом:
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.76)' }}>
                    “I lived in London in 2019”
                  </span>{' '}
                  — это уже завершённый период.
                  <br />
                  <br />
                  <span style={{ color: 'rgba(255,255,255,0.70)', fontSize: 13 }}>
                    AI помогает не просто дать ответ, а показать логику правила.
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section-soft">
        <div className="container">
          <Reveal style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="section-kicker">Сертификат</div>
            <h2 className="section-title">Сертификат по окончании курса</h2>
            <p className="section-text">
              Красиво оформленный цифровой сертификат, который подчёркивает завершение программы и твой результат.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="certificate-shell">
              <div className="certificate-glow left" />
              <div className="certificate-glow right" />

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 44, marginBottom: 8 }}>🏆</div>
                <div className="certificate-brand">KHAMADI ENGLISH</div>
                <div className="certificate-sub">Certificate of Completion</div>

                <div className="certificate-divider">
                  <div className="certificate-line" />
                  <span style={{ color: '#0ea5e9', fontSize: 14 }}>✦</span>
                  <div className="certificate-line" />
                </div>

                <div className="certificate-caption">Настоящий сертификат подтверждает, что</div>
                <div className="certificate-name">Имя студента</div>
                <div className="certificate-text-line">успешно завершил(а) курс</div>
                <div className="certificate-course">B1 Intermediate English</div>
                <span className="certificate-pill">B1 · General English · 2026</span>

                <div className="certificate-divider muted">
                  <div className="certificate-line muted" />
                  <span style={{ color: 'rgba(15,23,42,0.26)', fontSize: 12 }}>✦</span>
                  <div className="certificate-line muted" />
                </div>

                <div className="certificate-meta">
                  {[['Дата выдачи', '2026'], ['Номер', 'KE-2026-0042'], ['Платформа', 'khamadi.online']].map(([l, v]) => (
                    <div key={l}>
                      <div className="certificate-meta-label">{l}</div>
                      <div className="certificate-meta-value">{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="faq" className="section-wrap">
        <div style={{ maxWidth: 860, margin: '0 auto' }}>
          <Reveal style={{ textAlign: 'center', marginBottom: 54 }}>
            <div className="section-kicker">FAQ</div>
            <h2 className="section-title">Часто задаваемые вопросы</h2>
          </Reveal>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {FAQ_DATA.map((item, i) => (
              <Reveal key={i} delay={i * 40}>
                <div className="faq-card" onClick={() => toggleFaq(i)}>
                  <div
                    style={{
                      padding: '20px 24px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: 16,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 15,
                        fontWeight: 800,
                        color: '#0f172a',
                        flex: 1,
                      }}
                    >
                      {item.q}
                    </span>
                    <div className={`faq-icon ${faqOpen === i ? 'open' : ''}`}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={faqOpen === i ? '#0ea5e9' : '#94a3b8'} strokeWidth="2.5">
                        <path d={faqOpen === i ? 'M18 15l-6-6-6 6' : 'M6 9l6 6 6-6'} strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>

                  <div
                    style={{
                      maxHeight: faqOpen === i ? 220 : 0,
                      overflow: 'hidden',
                      transition: 'max-height .35s cubic-bezier(.22,1,.36,1)',
                    }}
                  >
                    <div
                      style={{
                        padding: '0 24px 20px',
                        fontSize: 14,
                        lineHeight: 1.85,
                        color: '#64748b',
                        fontWeight: 600,
                      }}
                    >
                      {item.a}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section-wrap" style={{ paddingTop: 0 }}>
        <div className="container">
          <Reveal>
            <div className="cta-shell">
              <div className="cta-glow" />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div className="cta-title">
                  Начни учить английский
                  <br />уже сегодня
                </div>
                <p className="cta-text">
                  Зарегистрируйся и получи доступ к платформе, где обучение выглядит чисто, ярко, современно и работает на результат.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', position: 'relative', zIndex: 1 }}>
                <button className="cta-primary" onClick={() => router.push('/english/register')}>
                  Зарегистрироваться
                </button>
                <button className="cta-ghost" onClick={() => router.push('/')}>
                  ← На главную
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Compliance section */}
      <section style={{ background: '#f0f9ff', borderTop: '1px solid rgba(14,165,233,0.12)', padding: '56px 5%' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <Reveal>
            <div style={{ display: 'inline-block', background: 'rgba(14,165,233,0.08)', borderRadius: 999, padding: '6px 20px', fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 20 }}>
              Соответствие стандартам
            </div>
            <h2 style={{ fontSize: 'clamp(22px,3vw,38px)', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em', marginBottom: 14, lineHeight: 1.1 }}>
              Платформа соответствует требованиям<br />государственных образовательных стандартов РК
            </h2>
            <p style={{ color: '#64748b', fontSize: 15, maxWidth: 560, margin: '0 auto 36px', lineHeight: 1.7 }}>
              Готова к интеграции в учебные планы университетов и колледжей Казахстана.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 16 }}>
              {[
                { icon: '👥', value: '900+', label: 'Студентов' },
                { icon: '👩‍🏫', value: '100', label: 'Преподавателей' },
                { icon: '📚', value: '12', label: 'Курсов' },
                { icon: '📲', value: 'PWA', label: 'Приложение' },
                { icon: '📜', value: '✓', label: 'Сертификация' },
                { icon: '🏛️', value: 'ГОСО', label: 'Соответствие' },
              ].map((b) => (
                <div key={b.label} style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '20px 24px',
                  boxShadow: '0 2px 16px rgba(14,165,233,0.10)',
                  border: '1.5px solid rgba(14,165,233,0.12)',
                  minWidth: 110,
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: 26, marginBottom: 8 }}>{b.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{b.value}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 4 }}>{b.label}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <footer
        style={{
          borderTop: '1px solid rgba(14,165,233,0.10)',
          padding: '48px 5% 34px',
          background: '#f8fcff',
        }}
      >
        <div className="container">
          <div className="footer-grid">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div className="brand-box small">🇬🇧</div>
                <div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.04em' }}>
                    KHAMADI ENGLISH
                  </div>
                  <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>
                    khamadi.online
                  </div>
                </div>
              </div>

              <p
                style={{
                  fontSize: 13,
                  color: '#64748b',
                  lineHeight: 1.9,
                  fontWeight: 600,
                  maxWidth: 280,
                  marginBottom: 16,
                }}
              >
                Digital-платформа для изучения английского языка в современном и понятном формате.
              </p>
            </div>

            <div>
              <div className="footer-title">Курсы</div>
              {['General English', 'A1 Beginner', 'B1 Intermediate', 'C1 Advanced', 'Business English'].map(l => (
                <div key={l} className="footer-link" onClick={() => router.push('/english/register')}>
                  {l}
                </div>
              ))}
            </div>

            <div>
              <div className="footer-title">Платформа</div>
              {['О платформе', 'AI-помощник', 'Сертификат', 'Личный кабинет', 'Войти'].map(l => (
                <div key={l} className="footer-link">
                  {l}
                </div>
              ))}
            </div>

            <div>
              <div className="footer-title">Контакты</div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, lineHeight: 1.9 }}>
                <div>📧 info@khamadi.online</div>
                <div>🇰🇿 Казахстан</div>
                <div style={{ marginTop: 12 }}>
                  <button className="footer-btn" onClick={() => router.push('/english/register')}>
                    Начать →
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              © 2026 KHAMADI ONLINE · Все права защищены
            </div>
            <div style={{ display: 'flex', gap: 20, color: '#64748b', fontSize: 12, fontWeight: 600 }}>
              <span style={{ cursor: 'pointer' }}>Политика конфиденциальности</span>
              <span style={{ cursor: 'pointer' }}>Условия использования</span>
            </div>
          </div>
        </div>
      </footer>

      <style>{`
        .container {
          max-width: 1240px;
          margin: 0 auto;
        }

        .section-wrap {
          padding: 92px 5%;
        }

        .section-soft {
          padding: 92px 5%;
          background: linear-gradient(180deg, rgba(224,242,254,0.55), rgba(255,255,255,0.92));
        }

        .cursor-glow {
          position: fixed;
          width: 340px;
          height: 340px;
          border-radius: 999px;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(circle, rgba(56,189,248,0.16) 0%, rgba(56,189,248,0.10) 28%, rgba(56,189,248,0.04) 52%, transparent 72%);
          transform: translate(-50%, -50%);
          filter: blur(18px);
          transition: left 0.08s linear, top 0.08s linear;
        }

        .scroll-top-beam {
          position: fixed;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 4px;
          border-radius: 0 0 999px 999px;
          background: linear-gradient(90deg, transparent, #38bdf8, #0ea5e9, transparent);
          box-shadow: 0 0 26px rgba(14,165,233,0.35);
          z-index: 120;
          opacity: 0;
          transition: width .45s cubic-bezier(.22,1,.36,1), opacity .45s cubic-bezier(.22,1,.36,1);
        }

        .scroll-top-beam.show {
          width: min(720px, 88vw);
          opacity: 1;
        }

        .ambient {
          position: absolute;
          border-radius: 999px;
          filter: blur(110px);
          pointer-events: none;
          z-index: 0;
        }

        .ambient-1 {
          width: 360px;
          height: 360px;
          top: 40px;
          left: -90px;
          background: rgba(56,189,248,0.18);
          animation: floatOrb 10s ease-in-out infinite;
        }

        .ambient-2 {
          width: 380px;
          height: 380px;
          top: 160px;
          right: -100px;
          background: rgba(14,165,233,0.16);
          animation: floatOrb 12s ease-in-out infinite;
        }

        .ambient-3 {
          width: 280px;
          height: 280px;
          bottom: 280px;
          left: 18%;
          background: rgba(125,211,252,0.16);
          animation: floatOrb 9s ease-in-out infinite;
        }

        .grid-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background-image:
            linear-gradient(rgba(14,165,233,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(14,165,233,0.05) 1px, transparent 1px);
          background-size: 64px 64px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.75), transparent 92%);
        }

        .noise-overlay {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          opacity: 0.08;
          background-image:
            radial-gradient(circle at 20% 20%, rgba(14,165,233,0.14) 0 1px, transparent 1px),
            radial-gradient(circle at 80% 40%, rgba(56,189,248,0.10) 0 1px, transparent 1px);
          background-size: 28px 28px, 36px 36px;
        }

        .light-lines {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 0;
          background:
            linear-gradient(120deg, transparent 0%, rgba(56,189,248,0.05) 28%, transparent 46%),
            linear-gradient(300deg, transparent 0%, rgba(34,211,238,0.05) 24%, transparent 42%);
          animation: driftLines 14s linear infinite;
        }

        .brand-box {
          width: 44px;
          height: 44px;
          border-radius: 15px;
          background: linear-gradient(135deg, rgba(56,189,248,1), rgba(14,165,233,0.78));
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 12px 34px rgba(14,165,233,0.20);
          border: 1px solid rgba(255,255,255,0.75);
        }

        .brand-box.small {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          font-size: 17px;
        }

        .nav-link {
          color: #334155;
          text-decoration: none;
          font-size: 14px;
          font-weight: 700;
          padding: 10px 14px;
          border-radius: 12px;
          transition: all .25s ease;
        }

        .nav-link:hover {
          color: #0f172a;
          background: rgba(56,189,248,0.08);
        }

        .btn-ghost {
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 800;
          border-radius: 14px;
          border: 1px solid rgba(14,165,233,0.14);
          background: rgba(255,255,255,0.78);
          color: #0f172a;
          cursor: pointer;
          transition: all .25s ease;
        }

        .btn-ghost:hover {
          background: #ffffff;
          transform: translateY(-1px);
        }

        .btn-primary {
          padding: 11px 18px;
          font-size: 13px;
          font-weight: 800;
          border-radius: 14px;
          border: 1px solid rgba(14,165,233,0.18);
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: #fff;
          box-shadow: 0 12px 30px rgba(14,165,233,0.16);
          cursor: pointer;
          transition: all .25s ease;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 36px rgba(14,165,233,0.22);
        }

        .hero-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 10px 16px;
          border-radius: 999px;
          background: rgba(56,189,248,0.10);
          border: 1px solid rgba(14,165,233,0.14);
          color: #0369a1;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          box-shadow: 0 8px 24px rgba(14,165,233,0.08);
          backdrop-filter: blur(14px);
        }

        .hero-gradient {
          background: linear-gradient(135deg, #0f172a 0%, #0ea5e9 45%, #38bdf8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .btn-hero-primary {
          padding: 16px 28px;
          border-radius: 18px;
          border: 1px solid rgba(14,165,233,0.18);
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          cursor: pointer;
          box-shadow: 0 16px 36px rgba(14,165,233,0.18);
          transition: all .25s ease;
        }

        .btn-hero-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 20px 42px rgba(14,165,233,0.22);
        }

        .btn-hero-glass {
          padding: 16px 24px;
          border-radius: 18px;
          border: 1px solid rgba(14,165,233,0.12);
          background: rgba(255,255,255,0.78);
          color: #0f172a;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(8px);
          transition: all .25s ease;
        }

        .btn-hero-glass:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.96);
        }

        .trust-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 16px;
          max-width: 760px;
        }

        .trust-card {
          padding: 18px 16px;
          border-radius: 22px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(14,165,233,0.12);
          backdrop-filter: blur(16px);
          box-shadow: 0 10px 30px rgba(14,165,233,0.08);
        }

        .hero-stage {
          position: relative;
          min-height: 690px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .hero-stage-glow {
          position: absolute;
          inset: 50px 40px 90px 40px;
          border-radius: 36px;
          background: radial-gradient(circle at center, rgba(56,189,248,0.16), transparent 60%);
          filter: blur(10px);
          pointer-events: none;
        }

        .floating-card {
          position: absolute;
          z-index: 3;
          width: 220px;
          padding: 16px 16px 14px;
          border-radius: 22px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(14,165,233,0.14);
          backdrop-filter: blur(18px);
          box-shadow: 0 18px 44px rgba(14,165,233,0.12);
        }

        .card-a {
          top: 38px;
          left: 10px;
          animation: floatSoft 6.5s ease-in-out infinite;
        }

        .card-b {
          right: 10px;
          bottom: 50px;
          animation: floatSoft 7.2s ease-in-out infinite;
        }

        .mini-top {
          font-size: 10px;
          font-weight: 900;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #64748b;
          margin-bottom: 8px;
        }

        .floating-title {
          font-size: 14px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.35;
          margin-bottom: 8px;
        }

        .floating-text {
          font-size: 12px;
          line-height: 1.7;
          color: #64748b;
          font-weight: 600;
        }

        .floating-bar {
          margin-top: 10px;
          height: 7px;
          border-radius: 999px;
          background: rgba(14,165,233,0.08);
          overflow: hidden;
        }

        .floating-bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #67e8f9, #38bdf8);
          box-shadow: 0 0 18px rgba(56,189,248,0.35);
        }

        .dashboard-shell {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 470px;
          border-radius: 32px;
          padding: 22px;
          background: linear-gradient(180deg, rgba(255,255,255,0.92), rgba(240,249,255,0.96));
          border: 1px solid rgba(14,165,233,0.14);
          box-shadow: 0 28px 70px rgba(14,165,233,0.14);
          backdrop-filter: blur(22px);
          overflow: hidden;
          animation: floatMain 8s ease-in-out infinite;
        }

        .dashboard-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 18px;
        }

        .top-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }

        .top-dot.red { background: #fb7185; }
        .top-dot.yellow { background: #fbbf24; }
        .top-dot.green { background: #4ade80; }

        .dashboard-label {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }

        .dashboard-live {
          font-size: 11px;
          font-weight: 800;
          color: #0ea5e9;
        }

        .dashboard-panel {
          border-radius: 22px;
          padding: 18px;
          background: rgba(255,255,255,0.72);
          border: 1px solid rgba(14,165,233,0.10);
          margin-bottom: 14px;
          transition: transform .28s ease, border-color .28s ease, box-shadow .28s ease;
        }

        .dashboard-panel:hover {
          transform: translateY(-4px);
          border-color: rgba(14,165,233,0.18);
          box-shadow: 0 14px 28px rgba(14,165,233,0.10);
        }

        .dashboard-panel.blue {
          background: linear-gradient(135deg, rgba(56,189,248,0.14), rgba(255,255,255,0.78));
          border: 1px solid rgba(14,165,233,0.14);
        }

        .dashboard-panel.compact {
          margin-bottom: 0;
        }

        .dashboard-panel.strong {
          background: rgba(255,255,255,0.80);
        }

        .dashboard-icon {
          width: 54px;
          height: 54px;
          border-radius: 17px;
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          display: flex;
          align-items: center;
          justifyContent: center;
          font-size: 24px;
          box-shadow: 0 14px 32px rgba(14,165,233,0.20);
          flex-shrink: 0;
        }

        .dashboard-title {
          font-size: 15px;
          font-weight: 900;
          color: #0f172a;
          line-height: 1.35;
        }

        .dashboard-subtitle {
          margin-top: 4px;
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        .dashboard-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 14px;
        }

        .mini-label {
          font-size: 11px;
          font-weight: 800;
          color: #64748b;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .row-between {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .muted-small {
          font-size: 12px;
          color: #64748b;
          font-weight: 700;
        }

        .accent-small {
          font-size: 12px;
          color: #0ea5e9;
          font-weight: 900;
        }

        .stat-big {
          font-size: 34px;
          font-weight: 900;
          line-height: 1;
        }

        .stat-big.yellow { color: #f59e0b; }
        .stat-big.green { color: #22c55e; }

        .progress-track {
          height: 8px;
          border-radius: 999px;
          background: rgba(14,165,233,0.08);
          overflow: hidden;
        }

        .progress-track.thin {
          height: 7px;
        }

        .progress-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #38bdf8, #0ea5e9);
          box-shadow: 0 0 18px rgba(56,189,248,0.28);
        }

        .progress-fill.second {
          background: linear-gradient(90deg, #38bdf8, #22d3ee);
        }

        .section-kicker {
          font-size: 12px;
          font-weight: 900;
          color: #0ea5e9;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }

        .section-kicker.light {
          color: rgba(255,255,255,0.86);
        }

        .section-title {
          font-size: clamp(32px,4vw,56px);
          line-height: 1.02;
          letter-spacing: -0.055em;
          margin: 0 0 14px;
          color: #0f172a;
          font-weight: 900;
        }

        .section-text {
          font-size: 17px;
          line-height: 1.85;
          color: #64748b;
          max-width: 700px;
          margin: 0 auto;
        }

        .line-heading {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 26px;
        }

        .line-heading span {
          font-size: 13px;
          font-weight: 900;
          color: #0ea5e9;
          text-transform: uppercase;
          letter-spacing: 0.12em;
        }

        .line {
          height: 2px;
          width: 34px;
          background: linear-gradient(90deg,#38bdf8,#0ea5e9);
          border-radius: 999px;
        }

        .cards-grid {
          display: grid;
          gap: 18px;
          justify-content: center;
        }

        .general-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1100px;
          margin: 0 auto;
        }

        .special-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
          max-width: 1100px;
          margin: 0 auto;
        }

        .steps-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .lesson-grid {
          grid-template-columns: repeat(4, minmax(0, 1fr));
        }

        .ultra-card {
          position: relative;
          overflow: hidden;
          border-radius: 28px;
          background: rgba(255,255,255,0.82);
          border: 1px solid rgba(14,165,233,0.10);
          box-shadow: 0 14px 34px rgba(14,165,233,0.08);
          transition: transform .28s ease, border-color .28s ease, box-shadow .28s ease, background .28s ease;
        }

        .ultra-card:hover {
          transform: translateY(-6px);
          border-color: rgba(14,165,233,0.18);
          box-shadow: 0 18px 40px rgba(14,165,233,0.12);
          background: rgba(255,255,255,0.95);
        }

        .course-card,
        .step-card,
        .lesson-card {
          padding: 22px;
          min-height: 260px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          cursor: pointer;
        }

        .course-card.small {
          min-height: 235px;
          padding: 20px;
        }

        .card-shine {
          position: absolute;
          inset: 0;
          background: linear-gradient(120deg, transparent 0%, rgba(56,189,248,0.10) 22%, transparent 42%);
          transform: translateX(-120%);
          transition: transform .8s ease;
          pointer-events: none;
        }

        .ultra-card:hover .card-shine {
          transform: translateX(120%);
        }

        .card-title {
          font-size: 18px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 10px;
          line-height: 1.3;
        }

        .card-title.small {
          font-size: 15px;
          margin-bottom: 8px;
        }

        .card-text {
          font-size: 13px;
          line-height: 1.8;
          color: #64748b;
          font-weight: 600;
          margin-bottom: 18px;
        }

        .card-text.small {
          font-size: 12px;
          line-height: 1.75;
          margin-bottom: 12px;
        }

        .card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: auto;
        }

        .level-pill {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 800;
          background: rgba(56,189,248,0.10);
          color: #0ea5e9;
          border: 1px solid rgba(14,165,233,0.12);
        }

        .step-title {
          font-size: 20px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 12px;
          line-height: 1.2;
        }

        .ai-shell {
          border-radius: 36px;
          padding: 36px;
          background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 46%, #e0f2fe 100%);
          border: 1px solid rgba(255,255,255,0.22);
          box-shadow: 0 26px 70px rgba(14,165,233,0.18);
          display: grid;
          grid-template-columns: 1.02fr 0.98fr;
          gap: 28px;
          position: relative;
          overflow: hidden;
        }

        .ai-glow {
          position: absolute;
          top: -70px;
          left: -70px;
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: rgba(255,255,255,0.12);
          filter: blur(40px);
        }

        .btn-ai {
          padding: 15px 24px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.20);
          background: rgba(255,255,255,0.16);
          color: #ffffff;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all .25s ease;
        }

        .btn-ai:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.22);
        }

        .ai-chat-shell {
          position: relative;
          z-index: 1;
          border-radius: 28px;
          padding: 22px;
          background: rgba(255,255,255,0.12);
          border: 1px solid rgba(255,255,255,0.18);
          backdrop-filter: blur(14px);
        }

        .chat-user {
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.18);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          line-height: 1.7;
          margin-bottom: 12px;
        }

        .chat-ai {
          padding: 16px 18px;
          border-radius: 20px;
          background: rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.92);
          font-size: 14px;
          line-height: 1.8;
          font-weight: 600;
        }

        .certificate-shell {
          max-width: 780px;
          margin: 0 auto;
          padding: 54px 56px;
          border-radius: 36px;
          background: linear-gradient(180deg, rgba(255,255,255,0.94), rgba(240,249,255,0.98));
          border: 1px solid rgba(14,165,233,0.14);
          position: relative;
          overflow: hidden;
          text-align: center;
          box-shadow: 0 22px 54px rgba(14,165,233,0.10);
        }

        .certificate-glow {
          position: absolute;
          border-radius: 50%;
        }

        .certificate-glow.left {
          top: -40px;
          left: -40px;
          width: 180px;
          height: 180px;
          background: rgba(56,189,248,0.10);
          filter: blur(40px);
        }

        .certificate-glow.right {
          bottom: -40px;
          right: -40px;
          width: 220px;
          height: 220px;
          background: rgba(14,165,233,0.10);
          filter: blur(50px);
        }

        .certificate-brand {
          font-size: 11px;
          font-weight: 900;
          color: #0ea5e9;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .certificate-sub {
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 28px;
        }

        .certificate-divider {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
        }

        .certificate-divider.muted {
          margin: 24px 0;
        }

        .certificate-line {
          flex: 1;
          height: 1px;
          background: linear-gradient(90deg,transparent,rgba(14,165,233,0.28),transparent);
        }

        .certificate-line.muted {
          background: linear-gradient(90deg,transparent,rgba(14,165,233,0.10),transparent);
        }

        .certificate-caption {
          font-size: 13px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 10px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .certificate-name {
          font-size: 32px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 8px;
          letter-spacing: -0.03em;
        }

        .certificate-text-line {
          font-size: 14px;
          color: #64748b;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .certificate-course {
          font-size: 22px;
          font-weight: 900;
          color: #0ea5e9;
          margin-bottom: 16px;
          letter-spacing: -0.02em;
        }

        .certificate-pill {
          display: inline-block;
          padding: 6px 18px;
          border-radius: 999px;
          background: rgba(56,189,248,0.10);
          border: 1px solid rgba(14,165,233,0.14);
          color: #0369a1;
          font-size: 12px;
          font-weight: 800;
        }

        .certificate-meta {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 16px;
        }

        .certificate-meta-label {
          font-size: 10px;
          color: #64748b;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }

        .certificate-meta-value {
          font-size: 12px;
          font-weight: 800;
          color: #0f172a;
        }

        .faq-card {
          overflow: hidden;
          cursor: pointer;
          border-radius: 22px;
          background: rgba(255,255,255,0.84);
          border: 1px solid rgba(14,165,233,0.10);
          transition: all .25s ease;
          box-shadow: 0 10px 24px rgba(14,165,233,0.06);
        }

        .faq-card:hover {
          border-color: rgba(14,165,233,0.18);
          background: rgba(255,255,255,0.96);
        }

        .faq-icon {
          width: 34px;
          height: 34px;
          border-radius: 12px;
          background: rgba(255,255,255,0.70);
          border: 1px solid rgba(14,165,233,0.10);
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all .25s ease;
        }

        .faq-icon.open {
          background: rgba(56,189,248,0.10);
          border-color: rgba(14,165,233,0.18);
        }

        .cta-shell {
          position: relative;
          overflow: hidden;
          border-radius: 36px;
          padding: 40px 36px;
          background: linear-gradient(135deg, #0ea5e9 0%, #38bdf8 52%, #e0f2fe 100%);
          border: 1px solid rgba(255,255,255,0.24);
          box-shadow: 0 24px 60px rgba(14,165,233,0.16);
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 24px;
          flex-wrap: wrap;
        }

        .cta-glow {
          position: absolute;
          top: -60px;
          right: -60px;
          width: 260px;
          height: 260px;
          border-radius: 50%;
          background: rgba(255,255,255,0.10);
          filter: blur(40px);
          pointer-events: none;
        }

        .cta-title {
          font-size: clamp(28px,3vw,48px);
          line-height: 1.04;
          letter-spacing: -0.05em;
          font-weight: 900;
          color: #ffffff;
          margin-bottom: 12px;
        }

        .cta-text {
          font-size: 16px;
          line-height: 1.8;
          color: rgba(255,255,255,0.86);
          margin: 0;
          max-width: 680px;
        }

        .cta-primary {
          padding: 15px 24px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.16);
          background: #ffffff;
          color: #0369a1;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          transition: all .25s ease;
        }

        .cta-primary:hover {
          transform: translateY(-2px);
        }

        .cta-ghost {
          padding: 15px 22px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(255,255,255,0.14);
          color: #ffffff;
          font-size: 14px;
          font-weight: 800;
          cursor: pointer;
          backdrop-filter: blur(10px);
          transition: all .25s ease;
        }

        .cta-ghost:hover {
          transform: translateY(-2px);
          background: rgba(255,255,255,0.20);
        }

        .footer-grid {
          display: grid;
          grid-template-columns: 2fr 1fr 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
        }

        .footer-title {
          font-size: 12px;
          font-weight: 900;
          color: #0ea5e9;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-bottom: 16px;
        }

        .footer-link {
          display: block;
          margin-bottom: 10px;
          cursor: pointer;
          color: #64748b;
          font-size: 13px;
          font-weight: 600;
          transition: color .2s ease;
        }

        .footer-link:hover {
          color: #0f172a;
        }

        .footer-btn {
          padding: 10px 16px;
          font-size: 12px;
          font-weight: 800;
          border-radius: 14px;
          border: 1px solid rgba(14,165,233,0.18);
          background: linear-gradient(135deg, #38bdf8, #0ea5e9);
          color: #fff;
          cursor: pointer;
          transition: all .25s ease;
        }

        .footer-btn:hover {
          transform: translateY(-2px);
        }

        .footer-bottom {
          border-top: 1px solid rgba(14,165,233,0.08);
          padding-top: 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 12px;
        }

        @keyframes floatOrb {
          0% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-12px) scale(1.03); }
          100% { transform: translateY(0px) scale(1); }
        }

        @keyframes driftLines {
          0% { transform: translateX(0) translateY(0); }
          50% { transform: translateX(10px) translateY(-8px); }
          100% { transform: translateX(0) translateY(0); }
        }

        @keyframes floatSoft {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
          100% { transform: translateY(0px); }
        }

        @keyframes floatMain {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }

        @media (max-width: 1200px) {
          .general-grid,
          .special-grid,
          .steps-grid,
          .lesson-grid {
            grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
          }
        }

        @media (max-width: 1024px) {
          section > div[style*='grid-template-columns: 1.08fr 0.92fr'],
          .ai-shell {
            grid-template-columns: 1fr !important;
          }

          .hero-stage {
            min-height: 620px;
          }
        }

        @media (max-width: 900px) {
          .nav-links-desktop {
            display: none !important;
          }

          .general-grid,
          .special-grid,
          .steps-grid,
          .lesson-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }

          .trust-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .cursor-glow {
            display: none;
          }
        }

        @media (max-width: 700px) {
          .footer-grid {
            grid-template-columns: 1fr !important;
          }

          .certificate-meta {
            grid-template-columns: 1fr !important;
          }

          .dashboard-stats {
            grid-template-columns: 1fr !important;
          }

          .floating-card {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .general-grid,
          .special-grid,
          .steps-grid,
          .lesson-grid {
            grid-template-columns: 1fr !important;
            max-width: 100% !important;
          }

          .section-wrap,
          .section-soft {
            padding-left: 5%;
            padding-right: 5%;
          }

          .trust-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}