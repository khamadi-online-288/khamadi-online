'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7 },
}

const staggerWrap = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.12,
    },
  },
  viewport: { once: true, amount: 0.2 },
}

export default function LandingPage() {
  return (
    <main style={s.page}>
      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <Header />
      <Hero />
      <SocialProof />
      <WhySection />
      <SubjectsSection />
      <AiTutorSection />
      <SimulatorSection />
      <AnalyticsSection />
      <ParentsSection />
      <TestimonialsSection />
      <FinalCta />
      <Footer />
    </main>
  )
}

function Header() {
  return (
    <header style={s.header}>
      <div style={s.logoWrap}>
        <div style={s.logo}>K</div>
        <div>
          <div style={s.brand}>KHAMADI ONLINE</div>
          <div style={s.subBrand}>ҰБТ preparation platform</div>
        </div>
      </div>

      <nav style={s.nav}>
        <a href="#features" style={s.navLink}>Мүмкіндіктер</a>
        <a href="#subjects" style={s.navLink}>Пәндер</a>
        <a href="#ai" style={s.navLink}>AI Tutor</a>
        <a href="#parents" style={s.navLink}>Ата-ана</a>
      </nav>

      <div style={s.headerButtons}>
        <a href="/login" style={s.headerGhost}>Кіру</a>
        <a href="/register" style={s.headerPrimary}>Бастау</a>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section style={s.heroSection}>
      <div style={s.heroGrid}>
        <motion.div {...fadeUp} style={s.heroLeft}>
          <div style={s.heroBadge}>PREMIUM UBT PLATFORM</div>

          <h1 style={s.heroTitle}>
            ҰБТ-ға дайындықтың
            <br />
            <span style={s.heroGradient}>жаңа деңгейі</span>
          </h1>

          <p style={s.heroText}>
            KHAMADI ONLINE — бұл жай ғана оқу платформасы емес. Бұл —
            AI тьютор, толық ҰБТ симуляторы, пәндер базасы, прогресс анализ,
            жеке оқу жоспары және ата-ана кабинеті біріктірілген
            жаңа буындағы EdTech жүйе.
          </p>

          <div style={s.heroButtons}>
            <a href="/register" style={s.primaryBtn}>Дайындықты бастау</a>
            <a href="/login" style={s.secondaryBtn}>Аккаунтқа кіру</a>
          </div>

          <div style={s.heroMiniStats}>
            <div style={s.heroMiniStat}>
              <div style={s.heroMiniValue}>1000+</div>
              <div style={s.heroMiniLabel}>сабақ пен тест</div>
            </div>

            <div style={s.heroMiniDivider} />

            <div style={s.heroMiniStat}>
              <div style={s.heroMiniValue}>AI</div>
              <div style={s.heroMiniLabel}>жылдам түсіндіру</div>
            </div>

            <div style={s.heroMiniDivider} />

            <div style={s.heroMiniStat}>
              <div style={s.heroMiniValue}>120+</div>
              <div style={s.heroMiniLabel}>мақсатты нәтиже</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={s.heroRight}
        >
          <div style={s.mockupOuter}>
            <div style={s.mockupTopbar}>
              <div style={s.mockDots}>
                <span style={s.mockDot} />
                <span style={s.mockDot} />
                <span style={s.mockDot} />
              </div>
              <div style={s.mockupTitle}>KHAMADI ONLINE Dashboard</div>
            </div>

            <div style={s.mockupBody}>
              <div style={s.mockupHero}>
                <div style={s.mockupHeroLeft}>
                  <div style={s.mockPill}>ҰБТ 2026</div>
                  <div style={s.mockupBigTitle}>120+ нәтиже бағыты</div>
                  <div style={s.mockupText}>
                    AI анализ, симулятор, пәндер және күнделікті жоспар
                  </div>

                  <div style={s.mockupButtons}>
                    <div style={s.mockPrimaryBtn}>Симулятор</div>
                    <div style={s.mockSecondaryBtn}>AI анализ</div>
                  </div>
                </div>

                <div style={s.mockupHeroCard}>
                  <div style={s.mockupHeroCardTitle}>Бүгінгі оқу жоспары</div>
                  <div style={s.mockListItem}>Математика — 20 сұрақ</div>
                  <div style={s.mockListItem}>Қазақстан тарихы — mini test</div>
                  <div style={s.mockListItem}>Физика — 1 тақырып қайталау</div>
                </div>
              </div>

              <div style={s.mockupStats}>
                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>XP</div>
                  <div style={s.mockStatValue}>2450</div>
                </div>

                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>Level</div>
                  <div style={s.mockStatValue}>24</div>
                </div>

                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>Streak</div>
                  <div style={s.mockStatValue}>17 күн</div>
                </div>

                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>Үздік балл</div>
                  <div style={s.mockStatValue}>121</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SocialProof() {
  const items = [
    ['10000+', 'оқушы дайындалуда'],
    ['1000+', 'сабақ пен тест'],
    ['120+', 'мақсатты нәтиже'],
    ['AI', 'интеллектуалды анализ'],
  ]

  return (
    <section style={s.sectionWrapSm}>
      <motion.div
        variants={staggerWrap}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        style={s.statsGrid}
      >
        {items.map(([value, label]) => (
          <motion.div key={value} variants={fadeUp} style={s.statCard}>
            <div style={s.statValue}>{value}</div>
            <div style={s.statLabel}>{label}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function WhySection() {
  const cards = [
    {
      title: 'ҰБТ симулятор',
      text: 'Нағыз форматтағы тесттер, уақыт лимиті және нақты нәтиже анализі.',
    },
    {
      title: 'AI Tutor',
      text: 'Түсінбеген тақырыптарды бірден сұрап, қысқа әрі нақты түсіндіру алу.',
    },
    {
      title: 'Пәндер базасы',
      text: 'PDF сабақтар, тақырыптар, тесттер және жүйелі қайталау мүмкіндігі.',
    },
    {
      title: 'Прогресс анализ',
      text: 'Нәтиже динамикасы, әлсіз бөлімдер және өсу нүктелерін көру.',
    },
  ]

  return (
    <section id="features" style={s.sectionWrap}>
      <motion.div {...fadeUp} style={s.sectionHead}>
        <div style={s.sectionBadge}>WHY KHAMADI ONLINE</div>
        <h2 style={s.sectionTitle}>Платформа мүмкіндіктері</h2>
        <p style={s.sectionText}>
          Дайындықты тек контентпен емес, жүйемен, анализбен және тұрақты
          мотивациямен күшейтетін толық экожүйе.
        </p>
      </motion.div>

      <motion.div
        variants={staggerWrap}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        style={s.featureGrid}
      >
        {cards.map((card) => (
          <motion.div key={card.title} variants={fadeUp} style={s.featureCard}>
            <div style={s.featureIconCircle}>•</div>
            <div style={s.featureTitle}>{card.title}</div>
            <div style={s.featureText}>{card.text}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function SubjectsSection() {
  const subjects = [
    'Қазақстан тарихы',
    'Математика',
    'Физика',
    'Химия',
    'Биология',
    'География',
    'Информатика',
    'Ағылшын тілі',
  ]

  return (
    <section id="subjects" style={s.darkBlockWrap}>
      <div style={s.darkBlock}>
        <motion.div {...fadeUp} style={s.sectionHeadDark}>
          <div style={s.sectionBadgeDark}>SUBJECTS</div>
          <h2 style={s.sectionTitleDark}>ҰБТ пәндері</h2>
          <p style={s.sectionTextDark}>
            Пәндер бойынша құрылымдалған материалдар, тақырыптық сабақтар және
            тұрақты тесттік дайындық.
          </p>
        </motion.div>

        <motion.div
          variants={staggerWrap}
          initial="initial"
          whileInView="whileInView"
          viewport={{ once: true, amount: 0.2 }}
          style={s.subjectGrid}
        >
          {subjects.map((subject) => (
            <motion.div key={subject} variants={fadeUp} style={s.subjectCard}>
              <div style={s.subjectIcon}>◦</div>
              <div style={s.subjectName}>{subject}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}

function AiTutorSection() {
  return (
    <section id="ai" style={s.sectionWrap}>
      <div style={s.splitGrid}>
        <motion.div {...fadeUp}>
          <div style={s.sectionBadge}>AI TUTOR</div>
          <h2 style={s.sectionTitle}>Түсінбеген тақырыпты бірден сұра</h2>
          <p style={s.sectionTextLeft}>
            AI Tutor оқушыға түсінбеген бөлімді қарапайым, қысқа және нақты тілмен
            түсіндіріп береді. Бұл уақыт үнемдейді және жеке репетитор эффектісін
            береді.
          </p>

          <ul style={s.bulletList}>
            <li style={s.bulletItem}>Тақырыптарды қайта түсіндіру</li>
            <li style={s.bulletItem}>Мысалмен көрсету</li>
            <li style={s.bulletItem}>Қате кеткен жерді талдау</li>
            <li style={s.bulletItem}>Жылдам жауап форматы</li>
          </ul>

          <a href="/dashboard/ai-tutor" style={s.primaryBtn}>AI тьюторды ашу</a>
        </motion.div>

        <motion.div
          {...fadeUp}
          transition={{ duration: 0.8, delay: 0.1 }}
          style={s.glassPreview}
        >
          <div style={s.chatHeader}>AI Tutor Preview</div>
          <div style={s.chatBubbleUser}>Фотоэффект деген не?</div>
          <div style={s.chatBubbleBot}>
            Фотоэффект — жарықтың әсерінен металдан электрондардың бөлініп шығу құбылысы.
          </div>
          <div style={s.chatBubbleBotSoft}>
            Қажет болса, формуласы мен мысалын да түсіндіремін.
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function SimulatorSection() {
  return (
    <section style={s.sectionWrap}>
      <div style={s.splitGridReverse}>
        <motion.div {...fadeUp} style={s.simulatorVisual}>
          <div style={s.simBigCard}>140</div>
          <div style={s.simSmallCardRow}>
            <div style={s.simSmallCard}>4 сағат</div>
            <div style={s.simSmallCard}>AI анализ</div>
          </div>
        </motion.div>

        <motion.div {...fadeUp}>
          <div style={s.sectionBadge}>SIMULATOR</div>
          <h2 style={s.sectionTitle}>Нағыз ҰБТ форматы</h2>
          <p style={s.sectionTextLeft}>
            Симулятор арқылы оқушы өз деңгейін көреді, уақытпен жұмыс істеуді
            үйренеді және нақты нәтиже динамикасын бақылайды.
          </p>

          <ul style={s.bulletList}>
            <li style={s.bulletItem}>ҰБТ-ға ұқсас тест құрылымы</li>
            <li style={s.bulletItem}>Уақытпен жұмыс</li>
            <li style={s.bulletItem}>Нәтиже мен қателер анализі</li>
            <li style={s.bulletItem}>Үздік балл tracking</li>
          </ul>

          <a href="/dashboard/simulator" style={s.primaryBtn}>Симуляторды ашу</a>
        </motion.div>
      </div>
    </section>
  )
}

function AnalyticsSection() {
  return (
    <section style={s.analyticsWrap}>
      <motion.div {...fadeUp} style={s.analyticsCard}>
        <div style={s.sectionBadge}>ANALYTICS</div>
        <h2 style={s.sectionTitle}>Прогресс анализ</h2>
        <p style={s.sectionTextCenter}>
          Оқушы қай бөлімде әлсіз екенін, қай пәнде өсу бар екенін және қандай
          бағытта жұмыс істеу керегін көре алады.
        </p>

        <div style={s.analyticsBars}>
          <div style={s.barCol}>
            <div style={{ ...s.bar, height: 80 }} />
            <span style={s.barLabel}>1</span>
          </div>
          <div style={s.barCol}>
            <div style={{ ...s.bar, height: 130 }} />
            <span style={s.barLabel}>2</span>
          </div>
          <div style={s.barCol}>
            <div style={{ ...s.bar, height: 105 }} />
            <span style={s.barLabel}>3</span>
          </div>
          <div style={s.barCol}>
            <div style={{ ...s.bar, height: 180 }} />
            <span style={s.barLabel}>4</span>
          </div>
          <div style={s.barCol}>
            <div style={{ ...s.bar, height: 220 }} />
            <span style={s.barLabel}>5</span>
          </div>
        </div>
      </motion.div>
    </section>
  )
}

function ParentsSection() {
  return (
    <section id="parents" style={s.darkBlockWrap}>
      <div style={s.darkBlock}>
        <div style={s.splitGridDark}>
          <motion.div {...fadeUp}>
            <div style={s.sectionBadgeDark}>PARENT CABINET</div>
            <h2 style={s.sectionTitleDark}>Ата-ана кабинеті</h2>
            <p style={s.sectionTextDarkLeft}>
              Ата-аналар баланың прогресін, оқу жоспарын және соңғы нәтижелерін
              көре алады. Бұл бақылауды күшейтіп, жүйелі дайындыққа көмектеседі.
            </p>

            <ul style={s.bulletListDark}>
              <li style={s.bulletItemDark}>Балл нәтижелерін көру</li>
              <li style={s.bulletItemDark}>Оқу жоспарын бақылау</li>
              <li style={s.bulletItemDark}>Прогресс динамикасы</li>
              <li style={s.bulletItemDark}>Тұрақты дайындықты бақылау</li>
            </ul>

            <a href="/parent/login" style={s.primaryBtn}>Ата-ана кіруі</a>
          </motion.div>

          <motion.div {...fadeUp} style={s.parentPreview}>
            <div style={s.parentCardTop}>Parent Dashboard</div>
            <div style={s.parentLine}>
              <span>Соңғы балл</span>
              <strong>104</strong>
            </div>
            <div style={s.parentLine}>
              <span>Үздік балл</span>
              <strong>118</strong>
            </div>
            <div style={s.parentLine}>
              <span>Study plan</span>
              <strong>78%</strong>
            </div>
            <div style={s.parentLine}>
              <span>Streak</span>
              <strong>12 күн</strong>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const items = [
    {
      name: 'Аружан',
      text: 'Платформа өте ыңғайлы. Симулятор мен AI Tutor нақты көмектесті.',
    },
    {
      name: 'Нұрсұлтан',
      text: 'ҰБТ-ға дайындық жүйелі болды. Нәтиже динамикасын көру өте пайдалы.',
    },
    {
      name: 'Айару',
      text: 'Пәндер реттелген, интерфейс әдемі, оқу процесі жеңіл болды.',
    },
  ]

  return (
    <section style={s.sectionWrap}>
      <motion.div {...fadeUp} style={s.sectionHead}>
        <div style={s.sectionBadge}>REVIEWS</div>
        <h2 style={s.sectionTitle}>Оқушылар пікірі</h2>
        <p style={s.sectionText}>
          Платформаны қолданған оқушылардың алғашқы әсері мен нәтижелері.
        </p>
      </motion.div>

      <motion.div
        variants={staggerWrap}
        initial="initial"
        whileInView="whileInView"
        viewport={{ once: true, amount: 0.2 }}
        style={s.testimonialGrid}
      >
        {items.map((item) => (
          <motion.div key={item.name} variants={fadeUp} style={s.testimonialCard}>
            <div style={s.testimonialText}>{item.text}</div>
            <div style={s.testimonialName}>{item.name}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function FinalCta() {
  return (
    <section style={s.finalWrap}>
      <motion.div {...fadeUp} style={s.finalCard}>
        <div style={s.sectionBadgeDark}>START NOW</div>
        <h2 style={s.finalTitle}>
          ҰБТ-ға жүйелі дайындал
          <br />
          KHAMADI ONLINE-мен
        </h2>

        <p style={s.finalText}>
          Жеке дайындық жүйесі, AI қолдауы және толық оқу экожүйесі —
          жоғары нәтижеге апаратын дұрыс жол.
        </p>

        <div style={s.finalButtons}>
          <a href="/register" style={s.primaryBtnBig}>Дайындықты бастау</a>
          <a href="/login" style={s.secondaryBtnBig}>Аккаунтқа кіру</a>
        </div>
      </motion.div>
    </section>
  )
}

function Footer() {
  return (
    <footer style={s.footer}>
      <div style={s.footerTop}>
        <div>
          <div style={s.footerBrand}>KHAMADI ONLINE</div>
          <div style={s.footerSub}>ҰБТ preparation platform</div>
        </div>

        <div style={s.footerNav}>
          <a href="#features" style={s.footerLink}>Мүмкіндіктер</a>
          <a href="#subjects" style={s.footerLink}>Пәндер</a>
          <a href="#ai" style={s.footerLink}>AI Tutor</a>
          <a href="/login" style={s.footerLink}>Кіру</a>
        </div>
      </div>

      <div style={s.footerBottom}>© 2026 KHAMADI ONLINE</div>
    </footer>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    position: 'relative',
    minHeight: '100vh',
    overflow: 'hidden',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 22%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 24%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
    color: '#0F172A',
    fontFamily: 'Montserrat, sans-serif',
  },

  bgGlowTop: {
    position: 'absolute',
    right: -140,
    top: -140,
    width: 380,
    height: 380,
    borderRadius: '999px',
    background: 'rgba(56,189,248,0.12)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },

  bgGlowBottom: {
    position: 'absolute',
    left: -140,
    bottom: -140,
    width: 360,
    height: 360,
    borderRadius: '999px',
    background: 'rgba(14,165,233,0.10)',
    filter: 'blur(70px)',
    pointerEvents: 'none',
  },

  header: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    maxWidth: 1280,
    margin: '0 auto',
    padding: '22px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 18,
    backdropFilter: 'blur(14px)',
  },

  logoWrap: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },

  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 900,
    fontSize: 18,
    boxShadow: '0 14px 28px rgba(14,165,233,0.22)',
  },

  brand: {
    fontSize: 15,
    fontWeight: 900,
    letterSpacing: '-0.02em',
  },

  subBrand: {
    fontSize: 12,
    color: '#64748B',
  },

  nav: {
    display: 'flex',
    alignItems: 'center',
    gap: 24,
  },

  navLink: {
    color: '#334155',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 700,
  },

  headerButtons: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  headerGhost: {
    minHeight: 44,
    padding: '0 16px',
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    color: '#0F172A',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    background: 'rgba(255,255,255,0.84)',
  },

  headerPrimary: {
    minHeight: 44,
    padding: '0 16px',
    borderRadius: 14,
    background: '#0F172A',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    boxShadow: '0 14px 30px rgba(15,23,42,0.10)',
  },

  heroSection: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '40px 24px 48px',
  },

  heroGrid: {
    display: 'grid',
    gridTemplateColumns: '1.08fr 0.92fr',
    gap: 28,
    alignItems: 'center',
  },

  heroLeft: {},

  heroRight: {
    display: 'flex',
    justifyContent: 'center',
  },

  heroBadge: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 20,
  },

  heroTitle: {
    fontSize: 72,
    lineHeight: 0.98,
    fontWeight: 900,
    color: '#0F172A',
    letterSpacing: '-0.06em',
    margin: 0,
    marginBottom: 18,
  },

  heroGradient: {
    background: 'linear-gradient(135deg, #0F172A 0%, #0EA5E9 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },

  heroText: {
    fontSize: 18,
    lineHeight: 1.9,
    color: '#64748B',
    maxWidth: 720,
    margin: 0,
    marginBottom: 28,
  },

  heroButtons: {
    display: 'flex',
    gap: 12,
    flexWrap: 'wrap',
    marginBottom: 30,
  },

  primaryBtn: {
    minHeight: 52,
    padding: '0 22px',
    borderRadius: 18,
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 800,
    boxShadow: '0 18px 30px rgba(14,165,233,0.20)',
  },

  secondaryBtn: {
    minHeight: 52,
    padding: '0 22px',
    borderRadius: 18,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#0F172A',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 800,
  },

  heroMiniStats: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
    flexWrap: 'wrap',
  },

  heroMiniStat: {
    minWidth: 110,
  },

  heroMiniValue: {
    fontSize: 28,
    fontWeight: 900,
    color: '#0F172A',
    lineHeight: 1,
    marginBottom: 6,
  },

  heroMiniLabel: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 1.5,
  },

  heroMiniDivider: {
    width: 1,
    height: 42,
    background: '#E2E8F0',
  },

  mockupOuter: {
    width: '100%',
    maxWidth: 560,
    borderRadius: 32,
    overflow: 'hidden',
    background: '#0B1120',
    boxShadow: '0 40px 80px rgba(2,8,23,0.20)',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  mockupTopbar: {
    minHeight: 58,
    padding: '0 18px',
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    background: 'rgba(255,255,255,0.04)',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
  },

  mockDots: {
    display: 'flex',
    gap: 7,
  },

  mockDot: {
    width: 9,
    height: 9,
    borderRadius: '999px',
    background: 'rgba(255,255,255,0.24)',
    display: 'inline-block',
  },

  mockupTitle: {
    color: 'rgba(255,255,255,0.74)',
    fontSize: 13,
    fontWeight: 700,
  },

  mockupBody: {
    padding: 20,
  },

  mockupHero: {
    display: 'grid',
    gridTemplateColumns: '1fr 0.95fr',
    gap: 14,
    marginBottom: 14,
  },

  mockupHeroLeft: {
    borderRadius: 24,
    padding: 22,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 26%), linear-gradient(135deg, #050816 0%, #102A43 70%, #0EA5E9 100%)',
    color: '#FFFFFF',
  },

  mockPill: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.10)',
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 14,
  },

  mockupBigTitle: {
    fontSize: 30,
    lineHeight: 1.05,
    fontWeight: 900,
    marginBottom: 10,
  },

  mockupText: {
    fontSize: 13,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.74)',
    marginBottom: 16,
  },

  mockupButtons: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },

  mockPrimaryBtn: {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 12,
    background: '#FFFFFF',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: 800,
    display: 'inline-flex',
    alignItems: 'center',
  },

  mockSecondaryBtn: {
    minHeight: 36,
    padding: '0 12px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 700,
    display: 'inline-flex',
    alignItems: 'center',
  },

  mockupHeroCard: {
    borderRadius: 24,
    padding: 20,
    background: 'rgba(255,255,255,0.06)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.06)',
    backdropFilter: 'blur(10px)',
  },

  mockupHeroCardTitle: {
    fontSize: 15,
    fontWeight: 900,
    marginBottom: 14,
  },

  mockListItem: {
    minHeight: 38,
    padding: '0 12px',
    borderRadius: 12,
    background: 'rgba(255,255,255,0.08)',
    fontSize: 12,
    display: 'flex',
    alignItems: 'center',
    marginBottom: 8,
    color: 'rgba(255,255,255,0.82)',
  },

  mockupStats: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
  },

  mockStatCard: {
    borderRadius: 18,
    padding: 16,
    background: '#111827',
    border: '1px solid rgba(255,255,255,0.04)',
  },

  mockStatLabel: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.54)',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },

  mockStatValue: {
    fontSize: 24,
    fontWeight: 900,
    color: '#FFFFFF',
    lineHeight: 1,
  },

  sectionWrapSm: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px 20px',
  },

  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },

  statCard: {
    background: 'rgba(255,255,255,0.84)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 28,
    padding: 28,
    textAlign: 'center',
    boxShadow: '0 14px 26px rgba(15,23,42,0.04)',
    backdropFilter: 'blur(12px)',
  },

  statValue: {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1,
    color: '#0F172A',
    letterSpacing: '-0.05em',
    marginBottom: 10,
  },

  statLabel: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.7,
  },

  sectionWrap: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '80px 24px',
  },

  sectionHead: {
    maxWidth: 760,
    margin: '0 auto 34px',
    textAlign: 'center',
  },

  sectionBadge: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 48,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 14,
  },

  sectionText: {
    fontSize: 16,
    lineHeight: 1.9,
    color: '#64748B',
    margin: 0,
  },

  featureGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },

  featureCard: {
    background: 'rgba(255,255,255,0.84)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 28,
    padding: 26,
    boxShadow: '0 14px 26px rgba(15,23,42,0.04)',
    minHeight: 220,
  },

  featureIconCircle: {
    width: 46,
    height: 46,
    borderRadius: 14,
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 900,
    marginBottom: 16,
  },

  featureTitle: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.2,
    color: '#0F172A',
    marginBottom: 10,
  },

  featureText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: '#64748B',
  },

  darkBlockWrap: {
    padding: '0 24px',
  },

  darkBlock: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '80px 32px',
    borderRadius: 40,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 26%), linear-gradient(135deg, #050816 0%, #0B1120 42%, #102A43 70%, #0EA5E9 100%)',
    boxShadow: '0 30px 60px rgba(2,8,23,0.18)',
  },

  sectionHeadDark: {
    maxWidth: 760,
    margin: '0 auto 34px',
    textAlign: 'center',
  },

  sectionBadgeDark: {
    display: 'inline-flex',
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 16,
    border: '1px solid rgba(255,255,255,0.10)',
  },

  sectionTitleDark: {
    fontSize: 46,
    lineHeight: 1.05,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#FFFFFF',
    margin: 0,
    marginBottom: 14,
  },

  sectionTextDark: {
    fontSize: 16,
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.74)',
    margin: 0,
  },

  subjectGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },

  subjectCard: {
    minHeight: 150,
    borderRadius: 26,
    padding: 24,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-end',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },

  subjectIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.10)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 900,
  },

  subjectName: {
    fontSize: 18,
    fontWeight: 800,
    lineHeight: 1.3,
  },

  splitGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 28,
    alignItems: 'center',
  },

  splitGridReverse: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 28,
    alignItems: 'center',
  },

  sectionTextLeft: {
    fontSize: 16,
    lineHeight: 1.9,
    color: '#64748B',
    margin: '0 0 18px 0',
    maxWidth: 620,
  },

  bulletList: {
    paddingLeft: 18,
    marginTop: 0,
    marginBottom: 24,
    color: '#475569',
  },

  bulletItem: {
    marginBottom: 10,
    lineHeight: 1.8,
  },

  glassPreview: {
    borderRadius: 30,
    padding: 24,
    background: 'rgba(255,255,255,0.70)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
    backdropFilter: 'blur(14px)',
    minHeight: 360,
  },

  chatHeader: {
    fontSize: 18,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 18,
  },

  chatBubbleUser: {
    marginLeft: 'auto',
    maxWidth: '82%',
    padding: '14px 16px',
    borderRadius: '18px 18px 6px 18px',
    background: '#E0F2FE',
    color: '#0F172A',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 12,
  },

  chatBubbleBot: {
    maxWidth: '88%',
    padding: '14px 16px',
    borderRadius: '18px 18px 18px 6px',
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 12,
  },

  chatBubbleBotSoft: {
    maxWidth: '88%',
    padding: '14px 16px',
    borderRadius: '18px 18px 18px 6px',
    background: '#F8FAFC',
    color: '#334155',
    fontSize: 14,
    lineHeight: 1.7,
  },

  simulatorVisual: {},

  simBigCard: {
    height: 240,
    borderRadius: 30,
    background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 84,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    marginBottom: 14,
    boxShadow: '0 24px 44px rgba(15,23,42,0.14)',
  },

  simSmallCardRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },

  simSmallCard: {
    minHeight: 90,
    borderRadius: 22,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 18,
    fontWeight: 800,
    color: '#0F172A',
    boxShadow: '0 12px 24px rgba(15,23,42,0.05)',
  },

  analyticsWrap: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px 80px',
  },

  analyticsCard: {
    borderRadius: 40,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: 34,
    boxShadow: '0 18px 34px rgba(15,23,42,0.05)',
    textAlign: 'center',
  },

  sectionTextCenter: {
    fontSize: 16,
    lineHeight: 1.9,
    color: '#64748B',
    maxWidth: 760,
    margin: '0 auto 28px',
  },

  analyticsBars: {
    height: 280,
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 16,
    paddingTop: 20,
  },

  barCol: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 10,
  },

  bar: {
    width: 64,
    borderRadius: 18,
    background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)',
    boxShadow: '0 12px 24px rgba(14,165,233,0.18)',
  },

  barLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: 700,
  },

  splitGridDark: {
    display: 'grid',
    gridTemplateColumns: '1fr 0.9fr',
    gap: 28,
    alignItems: 'center',
  },

  sectionTextDarkLeft: {
    fontSize: 16,
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.74)',
    margin: '0 0 18px 0',
    maxWidth: 620,
  },

  bulletListDark: {
    paddingLeft: 18,
    marginTop: 0,
    marginBottom: 24,
    color: 'rgba(255,255,255,0.82)',
  },

  bulletItemDark: {
    marginBottom: 10,
    lineHeight: 1.8,
  },

  parentPreview: {
    borderRadius: 28,
    padding: 24,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
  },

  parentCardTop: {
    fontSize: 18,
    fontWeight: 900,
    color: '#FFFFFF',
    marginBottom: 18,
  },

  parentLine: {
    minHeight: 52,
    padding: '0 16px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.08)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    fontSize: 14,
  },

  testimonialGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 16,
  },

  testimonialCard: {
    borderRadius: 28,
    padding: 24,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 14px 26px rgba(15,23,42,0.04)',
  },

  testimonialText: {
    fontSize: 15,
    lineHeight: 1.9,
    color: '#475569',
    marginBottom: 18,
  },

  testimonialName: {
    fontSize: 15,
    fontWeight: 900,
    color: '#0F172A',
  },

  finalWrap: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px 90px',
  },

  finalCard: {
    borderRadius: 40,
    padding: 40,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 26%), linear-gradient(135deg, #050816 0%, #0B1120 42%, #102A43 70%, #0EA5E9 100%)',
    color: '#FFFFFF',
    textAlign: 'center',
    boxShadow: '0 30px 60px rgba(2,8,23,0.18)',
  },

  finalTitle: {
    fontSize: 56,
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    margin: '0 0 16px 0',
  },

  finalText: {
    fontSize: 16,
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.76)',
    maxWidth: 760,
    margin: '0 auto 26px',
  },

  finalButtons: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    flexWrap: 'wrap',
  },

  primaryBtnBig: {
    minHeight: 56,
    padding: '0 24px',
    borderRadius: 18,
    background: '#FFFFFF',
    color: '#0F172A',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 900,
  },

  secondaryBtnBig: {
    minHeight: 56,
    padding: '0 24px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 15,
    fontWeight: 800,
  },

  footer: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '0 24px 40px',
  },

  footerTop: {
    paddingTop: 28,
    borderTop: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 20,
  },

  footerBrand: {
    fontSize: 16,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 6,
  },

  footerSub: {
    fontSize: 13,
    color: '#64748B',
  },

  footerNav: {
    display: 'flex',
    gap: 18,
    flexWrap: 'wrap',
  },

  footerLink: {
    color: '#475569',
    textDecoration: 'none',
    fontSize: 14,
    fontWeight: 700,
  },

  footerBottom: {
    marginTop: 18,
    fontSize: 12,
    color: '#94A3B8',
  },
}