'use client'

import { motion } from 'framer-motion'

const fadeUp = {
  initial: { opacity: 0, y: 32 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7 },
}

const stagger = {
  initial: {},
  whileInView: {
    transition: {
      staggerChildren: 0.1,
    },
  },
  viewport: { once: true, amount: 0.15 },
}

export default function LandingPage() {
  return (
    <main style={s.page}>
      <div style={s.glowTop} />
      <div style={s.glowBottom} />

      <Header />
      <Hero />
      <Stats />
      <Features />
      <Subjects />
      <AiTutor />
      <Simulator />
      <Parents />
      <FinalCTA />
      <Footer />
      <WhatsAppFloat />
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
        <a href="#simulator" style={s.navLink}>Симулятор</a>
        <a href="#parents" style={s.navLink}>Ата-ана</a>
      </nav>

      <div style={s.headerButtons}>
        <a
          href="https://www.instagram.com/khamadi.online?igsh=MWV2c2hmOTJpNXJkZw%3D%3D&utm_source=qr"
          target="_blank"
          rel="noopener noreferrer"
          style={s.iconLink}
          aria-label="Instagram"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm10 1.5A3.5 3.5 0 0 1 20.5 7v10a3.5 3.5 0 0 1-3.5 3.5H7A3.5 3.5 0 0 1 3.5 17V7A3.5 3.5 0 0 1 7 3.5h10zM12 7.8A4.2 4.2 0 1 0 16.2 12 4.205 4.205 0 0 0 12 7.8zm0 6.9A2.7 2.7 0 1 1 14.7 12 2.703 2.703 0 0 1 12 14.7zm5.1-7.65a1.05 1.05 0 1 0 1.05 1.05 1.052 1.052 0 0 0-1.05-1.05z" />
          </svg>
        </a>

        <a
          href="https://wa.me/77066405577"
          target="_blank"
          rel="noopener noreferrer"
          style={s.whatsappIconLink}
          aria-label="WhatsApp"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.52 0 .18 5.34.18 11.88c0 2.1.54 4.14 1.56 5.94L0 24l6.36-1.68a11.86 11.86 0 0 0 5.7 1.44h.06c6.54 0 11.88-5.34 11.88-11.88 0-3.18-1.26-6.18-3.48-8.4zM12.12 21.78h-.06a9.9 9.9 0 0 1-5.04-1.38l-.36-.18-3.78.96 1.02-3.66-.24-.36a9.87 9.87 0 0 1-1.56-5.28c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 7.02c0 5.46-4.44 9.9-9.72 9.9zm5.4-7.38c-.3-.18-1.8-.9-2.1-1.02-.24-.06-.48-.12-.66.18-.18.3-.72 1.02-.9 1.2-.12.18-.3.24-.6.06-.3-.18-1.2-.42-2.28-1.38-.84-.72-1.44-1.62-1.62-1.92-.18-.3 0-.42.12-.6.12-.12.3-.3.42-.48.18-.18.24-.3.36-.54.12-.18.06-.42 0-.54-.06-.18-.66-1.62-.9-2.16-.24-.6-.48-.48-.66-.48h-.54c-.18 0-.48.06-.72.3-.24.3-.96.9-.96 2.16 0 1.32.96 2.58 1.08 2.76.18.18 1.92 3 4.68 4.08.66.3 1.2.42 1.62.54.66.18 1.26.18 1.74.12.54-.06 1.8-.72 2.04-1.44.3-.72.3-1.32.18-1.44-.06-.12-.24-.18-.54-.36z" />
          </svg>
        </a>

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
          <div style={s.heroBadge}>PREMIUM UBT ECOSYSTEM</div>

          <h1 style={s.heroTitle}>
            ҰБТ-ға дайындықтың
            <br />
            <span style={s.heroGradient}>жаңа деңгейі</span>
          </h1>

          <p style={s.heroText}>
            KHAMADI ONLINE — AI Tutor, толық ҰБТ симуляторы, пәндер базасы,
            нәтижені талдау, жеке оқу жоспары және ата-ана кабинеті бар
            біртұтас EdTech платформа.
          </p>

          <div style={s.heroButtons}>
            <a href="/register" style={s.primaryBtn}>Дайындықты бастау</a>
            <a href="/login" style={s.secondaryBtn}>Аккаунтқа кіру</a>
          </div>

          <div style={s.heroMiniStats}>
            <div style={s.heroMiniCard}>
              <div style={s.heroMiniValue}>1000+</div>
              <div style={s.heroMiniLabel}>сабақ пен тест</div>
            </div>
            <div style={s.heroMiniCard}>
              <div style={s.heroMiniValue}>AI</div>
              <div style={s.heroMiniLabel}>жылдам түсіндіру</div>
            </div>
            <div style={s.heroMiniCard}>
              <div style={s.heroMiniValue}>120+</div>
              <div style={s.heroMiniLabel}>мақсатты нәтиже</div>
            </div>
          </div>
        </motion.div>

        <motion.div {...fadeUp} transition={{ duration: 0.8, delay: 0.1 }} style={s.heroRight}>
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
              <div style={s.mockupBanner}>
                <div style={s.mockupBadge}>ҰБТ 2026</div>
                <div style={s.mockupBig}>120+ нәтиже бағыты</div>
                <div style={s.mockupSub}>
                  Симулятор, AI анализ, пәндер және күнделікті оқу жоспары
                </div>
              </div>

              <div style={s.mockupCards}>
                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>XP</div>
                  <div style={s.mockStatValue}>2450</div>
                </div>
                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>LEVEL</div>
                  <div style={s.mockStatValue}>24</div>
                </div>
                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>STREAK</div>
                  <div style={s.mockStatValue}>17</div>
                </div>
                <div style={s.mockStatCard}>
                  <div style={s.mockStatLabel}>BEST</div>
                  <div style={s.mockStatValue}>121</div>
                </div>
              </div>

              <div style={s.mockupPlan}>
                <div style={s.mockupPlanTitle}>Бүгінгі оқу жоспары</div>
                <div style={s.mockItem}>Математика — 20 сұрақ</div>
                <div style={s.mockItem}>Қазақстан тарихы — mini test</div>
                <div style={s.mockItem}>Физика — 1 тақырып қайталау</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

function Stats() {
  const items = [
    ['10000+', 'оқушы дайындалуда'],
    ['1000+', 'сабақ пен тест'],
    ['120+', 'мақсатты нәтиже'],
    ['AI', 'интеллектуалды анализ'],
  ]

  return (
    <section style={s.sectionWrapSm}>
      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="whileInView"
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

function Features() {
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
          Контент, жүйе, анализ және тұрақты мотивацияны біріктіретін толық дайындық ортасы.
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        whileInView="whileInView"
        style={s.featureGrid}
      >
        {cards.map((card) => (
          <motion.div key={card.title} variants={fadeUp} style={s.featureCard}>
            <div style={s.featureIcon}>•</div>
            <div style={s.featureTitle}>{card.title}</div>
            <div style={s.featureText}>{card.text}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

function Subjects() {
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
    <section id="subjects" style={s.darkSectionOuter}>
      <div style={s.darkSection}>
        <motion.div {...fadeUp} style={s.sectionHeadDark}>
          <div style={s.sectionBadgeDark}>SUBJECTS</div>
          <h2 style={s.sectionTitleDark}>ҰБТ пәндері</h2>
          <p style={s.sectionTextDark}>
            Пәндер бойынша құрылымдалған сабақтар, тесттер және тұрақты дайындық.
          </p>
        </motion.div>

        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="whileInView"
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

function AiTutor() {
  return (
    <section id="ai" style={s.sectionWrap}>
      <div style={s.aiSectionShell}>
        <div style={s.splitGrid}>
          <motion.div {...fadeUp}>
            <div style={s.sectionBadge}>AI TUTOR</div>

            <h2 style={s.sectionTitle}>
              AI Tutor —
              <br />
              жеке көмекші сияқты
            </h2>

            <p style={s.sectionTextLeft}>
              KHAMADI ONLINE ішіндегі AI Tutor оқушыға күрделі тақырыптарды
              қарапайым тілмен, нақты мысалмен және қысқа форматта түсіндіріп береді.
              Бұл жеке репетитор эффектісін береді және уақытты үнемдейді.
            </p>

            <div style={s.aiFeatureList}>
              <div style={s.aiFeatureItem}>
                <div style={s.aiFeatureDot}>✓</div>
                <div>
                  <div style={s.aiFeatureTitle}>Қарапайым түсіндіру</div>
                  <div style={s.aiFeatureText}>
                    Күрделі тақырыпты жеңіл тілмен ашады
                  </div>
                </div>
              </div>

              <div style={s.aiFeatureItem}>
                <div style={s.aiFeatureDot}>✓</div>
                <div>
                  <div style={s.aiFeatureTitle}>Мысалмен көрсету</div>
                  <div style={s.aiFeatureText}>
                    Формула, есеп, терминдерді нақтылайды
                  </div>
                </div>
              </div>

              <div style={s.aiFeatureItem}>
                <div style={s.aiFeatureDot}>✓</div>
                <div>
                  <div style={s.aiFeatureTitle}>Жылдам жауап</div>
                  <div style={s.aiFeatureText}>
                    Бірден көмек аласың, күтіп отырмайсың
                  </div>
                </div>
              </div>
            </div>

            <a href="/dashboard/ai-tutor" style={s.primaryBtn}>
              AI Tutor ашу
            </a>
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ duration: 0.8, delay: 0.1 }}
            style={s.aiPreviewWrap}
          >
            <div style={s.aiPreviewTop}>
              <div style={s.aiPreviewBadge}>LIVE AI PREVIEW</div>
              <div style={s.aiPreviewTitle}>AI Tutor диалогы</div>
            </div>

            <div style={s.aiConversation}>
              <div style={s.userBubble}>Фотоэффект деген не?</div>

              <div style={s.botBubble}>
                Фотоэффект — жарықтың әсерінен металдан электрондардың бөлініп шығу құбылысы.
              </div>

              <div style={s.botSoftBubble}>
                Қарапайым айтсақ: жарық металға түскенде, оның бетінен электрондар ұшып шығады.
              </div>

              <div style={s.botSoftBubble}>
                Қаласаң, мен саған осыны ҰБТ форматына сай қысқаша мысалмен түсіндіріп беремін.
              </div>
            </div>

            <div style={s.aiBottomCards}>
              <div style={s.aiMiniCard}>
                <div style={s.aiMiniLabel}>Формат</div>
                <div style={s.aiMiniValue}>Q&A</div>
              </div>

              <div style={s.aiMiniCard}>
                <div style={s.aiMiniLabel}>Жылдамдық</div>
                <div style={s.aiMiniValue}>Instant</div>
              </div>

              <div style={s.aiMiniCard}>
                <div style={s.aiMiniLabel}>Мақсат</div>
                <div style={s.aiMiniValue}>120+</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Simulator() {
  return (
    <section id="simulator" style={s.sectionWrap}>
      <div style={s.simSectionShell}>
        <div style={s.splitGrid}>
          <motion.div {...fadeUp} style={s.simulatorVisual}>
            <div style={s.simVisualTop}>
              <div style={s.simVisualBadge}>FULL UBT MODE</div>
              <div style={s.simVisualTitle}>ҰБТ симуляторы</div>
            </div>

            <div style={s.simScorePanel}>
              <div style={s.simScoreBig}>140</div>
              <div style={s.simScoreText}>толық тест форматы</div>
            </div>

            <div style={s.simInfoGrid}>
              <div style={s.simInfoCard}>
                <div style={s.simInfoLabel}>Уақыт</div>
                <div style={s.simInfoValue}>4 сағат</div>
              </div>
              <div style={s.simInfoCard}>
                <div style={s.simInfoLabel}>Анализ</div>
                <div style={s.simInfoValue}>AI</div>
              </div>
              <div style={s.simInfoCard}>
                <div style={s.simInfoLabel}>Формат</div>
                <div style={s.simInfoValue}>ҰБТ</div>
              </div>
              <div style={s.simInfoCard}>
                <div style={s.simInfoLabel}>Нәтиже</div>
                <div style={s.simInfoValue}>Балл</div>
              </div>
            </div>
          </motion.div>

          <motion.div {...fadeUp}>
            <div style={s.sectionBadge}>SIMULATOR</div>
            <h2 style={s.sectionTitle}>
              Нағыз ҰБТ сияқты
              <br />
              толық тәжірибе
            </h2>

            <p style={s.sectionTextLeft}>
              Бұл жай тест емес. Оқушы уақытпен жұмыс істейді, шынайы форматқа
              үйренеді, қателерді талдайды және өз нәтижесін жүйелі түрде көтереді.
            </p>

            <div style={s.simBulletCards}>
              <div style={s.simBulletCard}>
                <div style={s.simBulletTitle}>Нағыз құрылым</div>
                <div style={s.simBulletText}>
                  ҰБТ-ға ұқсас сұрақ форматы мен логикасы
                </div>
              </div>

              <div style={s.simBulletCard}>
                <div style={s.simBulletTitle}>Уақыт қысымы</div>
                <div style={s.simBulletText}>
                  Таймингпен жұмыс істеуді үйретеді
                </div>
              </div>

              <div style={s.simBulletCard}>
                <div style={s.simBulletTitle}>Нәтиже талдауы</div>
                <div style={s.simBulletText}>
                  Әлсіз және күшті бөлімдерді көруге болады
                </div>
              </div>
            </div>

            <a href="/dashboard/simulator" style={s.primaryBtn}>
              Симуляторды ашу
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function Parents() {
  return (
    <section id="parents" style={s.darkSectionOuter}>
      <div style={s.darkSection}>
        <div style={s.splitGridDark}>
          <motion.div {...fadeUp}>
            <div style={s.sectionBadgeDark}>PARENT CABINET</div>
            <h2 style={s.sectionTitleDark}>Ата-ана кабинеті</h2>
            <p style={s.sectionTextDarkLeft}>
              Ата-аналар баланың прогресін, оқу жоспарын және соңғы нәтижелерін көре алады.
            </p>

            <ul style={s.bulletListDark}>
              <li style={s.bulletItemDark}>Балл нәтижелерін көру</li>
              <li style={s.bulletItemDark}>Оқу жоспарын бақылау</li>
              <li style={s.bulletItemDark}>Прогресс динамикасы</li>
              <li style={s.bulletItemDark}>Тұрақты дайындықты бақылау</li>
            </ul>

            <a href="/parent/login" style={s.primaryBtn}>
              Ата-ана кіруі
            </a>
          </motion.div>

          <motion.div {...fadeUp} style={s.parentCard}>
            <div style={s.parentTitle}>Parent Dashboard</div>
            <div style={s.parentRow}><span>Соңғы балл</span><strong>104</strong></div>
            <div style={s.parentRow}><span>Үздік балл</span><strong>118</strong></div>
            <div style={s.parentRow}><span>Study plan</span><strong>78%</strong></div>
            <div style={s.parentRow}><span>Streak</span><strong>12 күн</strong></div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

function FinalCTA() {
  return (
    <section style={s.ctaWrap}>
      <motion.div {...fadeUp} style={s.ctaCard}>
        <div style={s.sectionBadgeDark}>START NOW</div>
        <h2 style={s.ctaTitle}>
          ҰБТ-ға KHAMADI ONLINE-мен
          <br />
          жүйелі дайындал
        </h2>
        <p style={s.ctaText}>
          AI Tutor, толық симулятор, пәндер базасы және прогресс бақылауы —
          жоғары нәтижеге апаратын нақты жүйе.
        </p>
        <div style={s.ctaButtons}>
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
          <a href="#simulator" style={s.footerLink}>Симулятор</a>
          <a
            href="https://www.instagram.com/khamadi.online?igsh=MWV2c2hmOTJpNXJkZw%3D%3D&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            style={s.footerLink}
          >
            Instagram
          </a>
          <a
            href="https://wa.me/77066405577"
            target="_blank"
            rel="noopener noreferrer"
            style={s.footerLink}
          >
            WhatsApp
          </a>
        </div>
      </div>

      <div style={s.footerBottom}>© 2026 KHAMADI ONLINE</div>
    </footer>
  )
}

function WhatsAppFloat() {
  return (
    <a
      href="https://wa.me/77066405577"
      target="_blank"
      rel="noopener noreferrer"
      style={s.whatsappFloat}
      aria-label="WhatsApp"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.52 0 .18 5.34.18 11.88c0 2.1.54 4.14 1.56 5.94L0 24l6.36-1.68a11.86 11.86 0 0 0 5.7 1.44h.06c6.54 0 11.88-5.34 11.88-11.88 0-3.18-1.26-6.18-3.48-8.4zM12.12 21.78h-.06a9.9 9.9 0 0 1-5.04-1.38l-.36-.18-3.78.96 1.02-3.66-.24-.36a9.87 9.87 0 0 1-1.56-5.28c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.1 1.02 6.96 2.88a9.78 9.78 0 0 1 2.88 7.02c0 5.46-4.44 9.9-9.72 9.9zm5.4-7.38c-.3-.18-1.8-.9-2.1-1.02-.24-.06-.48-.12-.66.18-.18.3-.72 1.02-.9 1.2-.12.18-.3.24-.6.06-.3-.18-1.2-.42-2.28-1.38-.84-.72-1.44-1.62-1.62-1.92-.18-.3 0-.42.12-.6.12-.12.3-.3.42-.48.18-.18.24-.3.36-.54.12-.18.06-.42 0-.54-.06-.18-.66-1.62-.9-2.16-.24-.6-.48-.48-.66-.48h-.54c-.18 0-.48.06-.72.3-.24.3-.96.9-.96 2.16 0 1.32.96 2.58 1.08 2.76.18.18 1.92 3 4.68 4.08.66.3 1.2.42 1.62.54.66.18 1.26.18 1.74.12.54-.06 1.8-.72 2.04-1.44.3-.72.3-1.32.18-1.44-.06-.12-.24-.18-.54-.36z" />
      </svg>
      <span style={{ marginLeft: 10 }}>WhatsApp</span>
    </a>
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

  glowTop: {
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

  glowBottom: {
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

  iconLink: {
    width: 44,
    height: 44,
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    background: 'rgba(255,255,255,0.84)',
    color: '#0F172A',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 10px 20px rgba(15,23,42,0.05)',
  },

  whatsappIconLink: {
    width: 44,
    height: 44,
    borderRadius: 14,
    background: '#25D366',
    color: '#FFFFFF',
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 14px 28px rgba(37,211,102,0.25)',
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
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
    maxWidth: 640,
  },

  heroMiniCard: {
    background: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(226,232,240,0.95)',
    borderRadius: 20,
    padding: 18,
    boxShadow: '0 10px 20px rgba(15,23,42,0.04)',
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

  mockupBanner: {
    borderRadius: 24,
    padding: 22,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 26%), linear-gradient(135deg, #050816 0%, #102A43 70%, #0EA5E9 100%)',
    color: '#FFFFFF',
    marginBottom: 14,
  },

  mockupBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.10)',
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 14,
  },

  mockupBig: {
    fontSize: 30,
    lineHeight: 1.05,
    fontWeight: 900,
    marginBottom: 10,
  },

  mockupSub: {
    fontSize: 13,
    lineHeight: 1.7,
    color: 'rgba(255,255,255,0.74)',
  },

  mockupCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 10,
    marginBottom: 14,
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

  mockupPlan: {
    borderRadius: 24,
    padding: 20,
    background: 'rgba(255,255,255,0.06)',
    color: '#FFFFFF',
    border: '1px solid rgba(255,255,255,0.06)',
  },

  mockupPlanTitle: {
    fontSize: 15,
    fontWeight: 900,
    marginBottom: 14,
  },

  mockItem: {
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

  featureIcon: {
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

  darkSectionOuter: {
    padding: '0 24px',
  },

  darkSection: {
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

  aiSectionShell: {
    borderRadius: 36,
    padding: 32,
    background: 'rgba(255,255,255,0.78)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
  },

  aiFeatureList: {
    display: 'grid',
    gap: 14,
    marginBottom: 26,
  },

  aiFeatureItem: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: 14,
    padding: '14px 16px',
    borderRadius: 18,
    background: '#F8FBFF',
    border: '1px solid #E2E8F0',
  },

  aiFeatureDot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 900,
    flexShrink: 0,
  },

  aiFeatureTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 4,
  },

  aiFeatureText: {
    fontSize: 13,
    lineHeight: 1.7,
    color: '#64748B',
  },

  aiPreviewWrap: {
    borderRadius: 30,
    padding: 24,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 22%), linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 18px 34px rgba(15,23,42,0.05)',
    minHeight: 420,
    display: 'flex',
    flexDirection: 'column',
  },

  aiPreviewTop: {
    marginBottom: 18,
  },

  aiPreviewBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 12,
  },

  aiPreviewTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: '#0F172A',
    letterSpacing: '-0.02em',
  },

  aiConversation: {
    display: 'grid',
    gap: 12,
    marginBottom: 18,
  },

  aiBottomCards: {
    marginTop: 'auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 10,
  },

  aiMiniCard: {
    borderRadius: 18,
    padding: 16,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 20px rgba(15,23,42,0.04)',
  },

  aiMiniLabel: {
    fontSize: 11,
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },

  aiMiniValue: {
    fontSize: 20,
    fontWeight: 900,
    color: '#0F172A',
  },

  userBubble: {
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

  botBubble: {
    maxWidth: '88%',
    padding: '14px 16px',
    borderRadius: '18px 18px 18px 6px',
    background: '#0F172A',
    color: '#FFFFFF',
    fontSize: 14,
    lineHeight: 1.7,
    marginBottom: 12,
  },

  botSoftBubble: {
    maxWidth: '88%',
    padding: '14px 16px',
    borderRadius: '18px 18px 18px 6px',
    background: '#F8FAFC',
    color: '#334155',
    fontSize: 14,
    lineHeight: 1.7,
  },

  simSectionShell: {
    borderRadius: 36,
    padding: 32,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.08), transparent 24%), linear-gradient(180deg, #FFFFFF 0%, #F8FBFF 100%)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
  },

  simulatorVisual: {},

  simVisualTop: {
    marginBottom: 16,
  },

  simVisualBadge: {
    display: 'inline-flex',
    padding: '8px 12px',
    borderRadius: 999,
    background: '#E0F2FE',
    color: '#0369A1',
    fontSize: 11,
    fontWeight: 800,
    marginBottom: 12,
  },

  simVisualTitle: {
    fontSize: 24,
    fontWeight: 900,
    color: '#0F172A',
    letterSpacing: '-0.02em',
  },

  simScorePanel: {
    height: 220,
    borderRadius: 30,
    background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
    color: '#FFFFFF',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    boxShadow: '0 24px 44px rgba(15,23,42,0.14)',
  },

  simScoreBig: {
    fontSize: 84,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    lineHeight: 1,
    marginBottom: 8,
  },

  simScoreText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.72)',
  },

  simInfoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 12,
  },

  simInfoCard: {
    minHeight: 86,
    borderRadius: 20,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    padding: 16,
    boxShadow: '0 10px 20px rgba(15,23,42,0.04)',
  },

  simInfoLabel: {
    fontSize: 11,
    fontWeight: 800,
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 8,
  },

  simInfoValue: {
    fontSize: 22,
    fontWeight: 900,
    color: '#0F172A',
  },

  simBulletCards: {
    display: 'grid',
    gap: 12,
    marginBottom: 26,
  },

  simBulletCard: {
    borderRadius: 18,
    padding: '16px 18px',
    background: '#F8FBFF',
    border: '1px solid #E2E8F0',
  },

  simBulletTitle: {
    fontSize: 15,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 6,
  },

  simBulletText: {
    fontSize: 13,
    lineHeight: 1.7,
    color: '#64748B',
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

  parentCard: {
    borderRadius: 28,
    padding: 24,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.08)',
  },

  parentTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: '#FFFFFF',
    marginBottom: 18,
  },

  parentRow: {
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

  ctaWrap: {
    maxWidth: 1280,
    margin: '0 auto',
    padding: '80px 24px 90px',
  },

  ctaCard: {
    borderRadius: 40,
    padding: 40,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 26%), linear-gradient(135deg, #050816 0%, #0B1120 42%, #102A43 70%, #0EA5E9 100%)',
    color: '#FFFFFF',
    textAlign: 'center',
    boxShadow: '0 30px 60px rgba(2,8,23,0.18)',
  },

  ctaTitle: {
    fontSize: 56,
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    margin: '0 0 16px 0',
  },

  ctaText: {
    fontSize: 16,
    lineHeight: 1.9,
    color: 'rgba(255,255,255,0.76)',
    maxWidth: 760,
    margin: '0 auto 26px',
  },

  ctaButtons: {
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

  whatsappFloat: {
    position: 'fixed',
    right: 26,
    bottom: 26,
    minHeight: 56,
    padding: '0 18px',
    borderRadius: 999,
    background: '#25D366',
    color: '#FFFFFF',
    fontWeight: 800,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 24px 40px rgba(37,211,102,0.30)',
    zIndex: 100,
  },
}