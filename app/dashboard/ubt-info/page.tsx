'use client'

import { motion } from 'framer-motion'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function InfoCard({
  title,
  subtitle,
  children,
  glow,
  delay = 0,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
  glow?: string
  delay?: number
}) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        position: 'relative',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.9)',
        border: '1px solid rgba(14,165,233,0.14)',
        borderRadius: 26,
        padding: 22,
        boxShadow: '0 16px 36px rgba(14,165,233,0.07)',
      }}
    >
      {glow && (
        <div
          style={{
            position: 'absolute',
            top: -20,
            right: -10,
            width: 120,
            height: 120,
            borderRadius: 999,
            background: glow,
            filter: 'blur(28px)',
            opacity: 0.45,
          }}
        />
      )}
      <div style={{ position: 'relative', zIndex: 2 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.03em' }}>
          {title}
        </div>
        {subtitle && (
          <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 16, fontWeight: 600 }}>
            {subtitle}
          </div>
        )}
        {children}
      </div>
    </motion.div>
  )
}

function SmallStat({ label, value, delay = 0 }: { label: string; value: string; delay?: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      whileHover={{ y: -3, boxShadow: '0 20px 40px rgba(14,165,233,0.14)' }}
      style={{
        background: '#fff',
        border: '1px solid rgba(14,165,233,0.14)',
        borderRadius: 22,
        padding: 20,
        textAlign: 'center',
        boxShadow: '0 8px 20px rgba(14,165,233,0.07)',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', marginBottom: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
        {label}
      </div>
      <div style={{ fontSize: 30, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em' }}>
        {value}
      </div>
    </motion.div>
  )
}

function Bullet({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
      <div
        style={{
          width: 7,
          height: 7,
          borderRadius: 999,
          background: '#0ea5e9',
          marginTop: 8,
          flexShrink: 0,
        }}
      />
      <div style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, fontWeight: 600 }}>
        {children}
      </div>
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      whileHover={{ scale: 1.04 }}
      style={{
        padding: '9px 14px',
        borderRadius: 999,
        background: 'linear-gradient(135deg, #e0f2fe, #f8fafc)',
        border: '1px solid #bae6fd',
        color: '#0369a1',
        fontSize: 13,
        fontWeight: 800,
        cursor: 'default',
      }}
    >
      {children}
    </motion.div>
  )
}

function TableRow({ left, right, index = 0 }: { left: string; right: string; index?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: 0.3 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        gap: 16,
        padding: '14px 0',
        borderBottom: '1px solid rgba(14,165,233,0.1)',
      }}
    >
      <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e' }}>{left}</div>
      <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700 }}>{right}</div>
    </motion.div>
  )
}

export default function UbtInfoPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          ҰБТ ақпараты
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          ҰБТ туралы толық ақпарат
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Бұл бөлімде ҰБТ форматы, пәндер құрылымы, уақыт, тапсыру кезеңдері, рұқсат етілетін заттар, сертификат және шекті баллдар туралы мәлімет берілген.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 30,
          padding: '28px 30px',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)',
          color: '#fff',
          boxShadow: '0 28px 56px rgba(14,165,233,0.2)',
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(255,255,255,0.10)', filter: 'blur(26px)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(125,211,252,0.12)', filter: 'blur(28px)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 900, marginBottom: 14, letterSpacing: '0.06em' }}>
            ҰБТ АҚПАРАТЫ
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, lineHeight: 1.15, marginBottom: 10, letterSpacing: '-0.05em', margin: '0 0 10px' }}>
            ҰБТ туралы маңызды ақпараттың бәрі бір жерде
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)', maxWidth: 820, margin: 0 }}>
            Бұл бөлімде ҰБТ форматы, пәндер құрылымы, уақыт, тапсыру кезеңдері, рұқсат етілетін және тыйым салынатын заттар, сертификат және шекті баллдар туралы қысқаша әрі түсінікті мәлімет берілген.
          </p>
        </div>
      </motion.div>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        <SmallStat label="Сұрақ саны" value="120" delay={0.1} />
        <SmallStat label="Ең жоғары балл" value="140" delay={0.15} />
        <SmallStat label="Тест уақыты" value="240 мин" delay={0.2} />
        <SmallStat label="Пән саны" value="5" delay={0.25} />
      </div>

      {/* Format + Creative */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 18 }}>
        <InfoCard title="ҰБТ форматы" subtitle="Толық оқу формасына түсетін талапкерлер үшін негізгі құрылым." glow="rgba(56,189,248,0.55)" delay={0.14}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>ҰБТ 5 пәннен тұрады: 3 міндетті және 2 бейіндік пән.</Bullet>
            <Bullet>Міндетті пәндер: Қазақстан тарихы, Оқу сауаттылығы, Математикалық сауаттылық.</Bullet>
            <Bullet>Бейіндік пәндер талапкер таңдаған мамандық бағытына байланысты.</Bullet>
            <Bullet>Жалпы тапсырма саны — 120, ең жоғары балл — 140.</Bullet>
            <Bullet>Тест уақыты — 4 сағат немесе 240 минут.</Bullet>
          </div>
        </InfoCard>

        <InfoCard title="Шығармашылық бағыттар" subtitle="Шығармашылық мамандықтарға түсетін талапкерлер үшін." glow="rgba(14,165,233,0.45)" delay={0.18}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Шығармашылық бағыт таңдағандар 3 міндетті пәнді тапсырады.</Bullet>
            <Bullet>2 бейіндік пәннің орнына ЖОО-да 2 шығармашылық емтихан өтеді.</Bullet>
            <Bullet>Бұл ерекшелікті университет таңдағанда міндетті түрде ескеру керек.</Bullet>
          </div>
        </InfoCard>
      </div>

      {/* Subject structure table */}
      <InfoCard title="Пәндер және сұрақтар құрылымы" subtitle="Әр блок бойынша тапсырма саны мен шекті балл." delay={0.2}>
        <div>
          <TableRow left="Қазақстан тарихы" right="20 сұрақ • шекті 5 балл" index={0} />
          <TableRow left="Оқу сауаттылығы" right="10 сұрақ • шекті 3 балл" index={1} />
          <TableRow left="Математикалық сауаттылық" right="10 сұрақ • шекті 3 балл" index={2} />
          <TableRow left="1-бейіндік пән" right="40 сұрақ • 50 балл • шекті 5" index={3} />
          <TableRow left="2-бейіндік пән" right="40 сұрақ • 50 балл • шекті 5" index={4} />
        </div>
      </InfoCard>

      {/* Time + When */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <InfoCard title="ҰБТ уақыты" subtitle="Тапсыру кезінде уақыт менеджменті өте маңызды." delay={0.22}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Негізгі уақыт — 240 минут.</Bullet>
            <Bullet>Ерекше білім беру қажеттілігі бар талапкерлерге қосымша 40 минут беріледі.</Bullet>
            <Bullet>Таймерді дұрыс басқару үшін KHAMADI ішіндегі симуляторды тұрақты түрде тапсырып тұрған дұрыс.</Bullet>
          </div>
        </InfoCard>

        <InfoCard title="Қашан тапсырады" subtitle="ҰБТ жыл ішінде бірнеше кезеңмен өткізіледі." delay={0.26}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Нақты күн, уақыт және орын талапкердің НЦТ-дағы жеке кабинетінде көрсетіледі.</Bullet>
            <Bullet>Тіркелу `app.testcenter.kz` жүйесі арқылы жасалады.</Bullet>
            <Bullet>Негізгі, ақылы және басқа кезеңдер бойынша өтініш беру мерзімдері жыл сайын ресми түрде жарияланады.</Bullet>
          </div>
        </InfoCard>
      </div>

      {/* Allowed + Not allowed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <InfoCard title="Не алып кіруге болады" subtitle="Қысқаша ереже." delay={0.28}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Жеке басын куәландыратын құжат.</Bullet>
            <Bullet>Тестілеуге қатысу үшін қажет ресми мәліметтер.</Bullet>
            <Bullet>Қалған нақты ережелерді тіркелген кезде ресми нұсқаулықтан тексеру қажет.</Bullet>
          </div>
        </InfoCard>

        <InfoCard title="Не алып кіруге болмайды" subtitle="Тәртіп бұзса, нәтижеге әсер етуі мүмкін." delay={0.32}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Телефон және басқа электронды құрылғылар.</Bullet>
            <Bullet>Шпаргалка, қағаз жазбалар, смарт-гаджеттер.</Bullet>
            <Bullet>Емтихан ережелеріне қайшы кез келген көмекші заттар.</Bullet>
          </div>
        </InfoCard>
      </div>

      {/* Certificate */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18 }}>
        <InfoCard title="ҰБТ сертификаты" subtitle="Ресми сертификатты қайдан көруге және алуға болады." glow="rgba(56,189,248,0.42)" delay={0.3}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Сертификатты `app.testcenter.kz` жеке кабинетінен көруге болады.</Bullet>
            <Bullet>Сондай-ақ `certificate.testcenter.kz` арқылы тест түрі, жыл, ЖСН және ИКТ арқылы тексеруге болады.</Bullet>
            <Bullet>Бұл сертификат грант конкурсына және құжат тапсыру кезінде қажет.</Bullet>
          </div>
        </InfoCard>

        <InfoCard title="Сертификатты жүктеу" subtitle="Бұл — KHAMADI ішіндегі жеке функция." glow="rgba(14,165,233,0.35)" delay={0.34}>
          <div style={{ display: 'grid', gap: 12 }}>
            <Bullet>Оқушы кейін өз сертификатының PDF немесе скрин нұсқасын профильге жүктей алады.</Bullet>
            <Bullet>Бұл университеттер бөлімімен және жеке ұсыныстар жүйесімен байланыстырылады.</Bullet>
            <Bullet>Яғни ресми сертификат НЦТ-дан алынады, ал KHAMADI ішінде сақталады.</Bullet>
          </div>
        </InfoCard>
      </div>

      {/* Threshold scores */}
      <InfoCard title="Шекті баллдар" subtitle="Ресми шектерді есте сақтау маңызды." delay={0.36}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <Tag>Қазақстан тарихы — 5</Tag>
          <Tag>Оқу сауаттылығы — 3</Tag>
          <Tag>Математикалық сауаттылық — 3</Tag>
          <Tag>Әр бейіндік пән — 5</Tag>
        </div>
      </InfoCard>

      {/* FAQ */}
      <InfoCard title="Жиі қойылатын сұрақтар" subtitle="Қысқа FAQ." delay={0.38}>
        <div style={{ display: 'grid', gap: 12 }}>
          {[
            ['ҰБТ неше сұрақтан тұрады?', 'Жалпы саны — 120 сұрақ.'],
            ['Ең жоғары балл қанша?', 'Ең жоғары балл — 140.'],
            ['ҰБТ қанша уақытқа созылады?', 'Негізгі уақыт — 240 минут.'],
            ['Сертификатты қайдан алуға болады?', 'НЦТ-ның жеке кабинетінен немесе certificate.testcenter.kz арқылы.'],
          ].map(([q, a], i) => (
            <motion.div
              key={q}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.45 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
              style={{
                padding: 18,
                borderRadius: 18,
                background: '#f0f9ff',
                border: '1px solid rgba(14,165,233,0.14)',
              }}
            >
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e', marginBottom: 6 }}>{q}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, fontWeight: 600 }}>{a}</div>
            </motion.div>
          ))}
        </div>
      </InfoCard>
    </div>
  )
}
