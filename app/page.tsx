'use client'

export default function HomePage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 22%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 24%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
        color: '#0F172A',
      }}
    >
      <header
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '20px 24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 16,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 900,
              fontSize: 18,
            }}
          >
            K
          </div>

          <div>
            <div style={{ fontSize: 15, fontWeight: 900 }}>KHAMADI ONLINE</div>
            <div style={{ fontSize: 12, color: '#64748B' }}>
              ҰБТ preparation platform
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <a href="/login" style={ghostBtn}>Оқушы кіруі</a>
          <a href="/parent/login" style={ghostBtn}>Ата-ана кіруі</a>
          <a href="/register" style={darkBtn}>Бастау</a>
        </div>
      </header>

      <section
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          padding: '40px 24px 24px',
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: 24,
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              padding: '10px 14px',
              borderRadius: 999,
              background: '#E0F2FE',
              color: '#0369A1',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 18,
            }}
          >
            KHAMADI ONLINE · UBT 2026
          </div>

          <h1
            style={{
              fontSize: 64,
              lineHeight: 0.98,
              fontWeight: 900,
              letterSpacing: '-0.05em',
              color: '#0F172A',
              margin: 0,
              marginBottom: 18,
              maxWidth: 760,
            }}
          >
            ҰБТ-ға дайындықтың жаңа деңгейі.
          </h1>

          <p
            style={{
              fontSize: 18,
              lineHeight: 1.9,
              color: '#64748B',
              maxWidth: 700,
              margin: 0,
              marginBottom: 26,
            }}
          >
            Симулятор, AI тьютор, пәндер, жеке оқу жоспары, анализ және ата-ана кабинеті —
            барлығы бір платформада.
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <a href="/register" style={darkBtnLarge}>Тіркелуді бастау</a>
            <a href="/login" style={ghostBtnLarge}>Аккаунтқа кіру</a>
          </div>
        </div>

        <div
          style={{
            borderRadius: 32,
            padding: 28,
            background:
              'radial-gradient(circle at top right, rgba(56,189,248,0.22), transparent 24%), linear-gradient(135deg, #050816 0%, #0B1120 42%, #102A43 70%, #0EA5E9 100%)',
            color: '#FFFFFF',
            boxShadow: '0 30px 60px rgba(2,8,23,0.24)',
            minHeight: 420,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                padding: '10px 14px',
                borderRadius: 999,
                background: 'rgba(255,255,255,0.10)',
                border: '1px solid rgba(255,255,255,0.10)',
                fontSize: 12,
                fontWeight: 800,
                marginBottom: 18,
              }}
            >
              Premium UBT Dashboard
            </div>

            <div
              style={{
                fontSize: 44,
                lineHeight: 1.02,
                fontWeight: 900,
                letterSpacing: '-0.04em',
                marginBottom: 14,
              }}
            >
              120+ баллға
              <br />
              бірге жетеміз.
            </div>

            <div
              style={{
                fontSize: 15,
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.76)',
              }}
            >
              Оқу жоспары, күнделікті мақсат, AI анализ және нақты прогресс —
              барлығы бір жерде.
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 12,
              marginTop: 24,
            }}
          >
            <InfoCard title="ҰБТ симулятор" text="Толық форматтағы тест" />
            <InfoCard title="AI тьютор" text="Жылдам түсіндіру" />
            <InfoCard title="Пәндер" text="PDF + quiz + сабақ" />
            <InfoCard title="Ата-ана кабинеті" text="Прогресті бақылау" />
          </div>
        </div>
      </section>
    </main>
  )
}

function InfoCard({
  title,
  text,
}: {
  title: string
  text: string
}) {
  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div
        style={{
          fontSize: 14,
          fontWeight: 800,
          marginBottom: 6,
        }}
      >
        {title}
      </div>
      <div
        style={{
          fontSize: 13,
          lineHeight: 1.6,
          color: 'rgba(255,255,255,0.72)',
        }}
      >
        {text}
      </div>
    </div>
  )
}

const darkBtn: React.CSSProperties = {
  minHeight: 42,
  padding: '0 16px',
  borderRadius: 14,
  background: '#0F172A',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const ghostBtn: React.CSSProperties = {
  minHeight: 42,
  padding: '0 16px',
  borderRadius: 14,
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#0F172A',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: 14,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const darkBtnLarge: React.CSSProperties = {
  minHeight: 52,
  padding: '0 22px',
  borderRadius: 18,
  background: '#0F172A',
  color: '#FFFFFF',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: 15,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const ghostBtnLarge: React.CSSProperties = {
  minHeight: 52,
  padding: '0 22px',
  borderRadius: 18,
  border: '1px solid #E2E8F0',
  background: '#FFFFFF',
  color: '#0F172A',
  textDecoration: 'none',
  fontWeight: 800,
  fontSize: 15,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
}