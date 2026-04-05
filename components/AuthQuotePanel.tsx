import Image from 'next/image'

export default function AuthQuotePanel() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'stretch',
        justifyContent: 'stretch',
        background:
          'linear-gradient(135deg, #0369A1 0%, #0EA5E9 45%, #38BDF8 100%)',
      }}
    >
      <Image
        src="/gabit-musirepov.jpg"
        alt="Ғабит Мүсірепов"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 0.22,
          mixBlendMode: 'multiply',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.22), transparent 28%), radial-gradient(circle at bottom right, rgba(255,255,255,0.14), transparent 26%)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.08,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '44px 44px',
        }}
      />

      <div
        style={{
          position: 'absolute',
          top: '70px',
          left: '70px',
          width: '180px',
          height: '180px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.14)',
          filter: 'blur(20px)',
        }}
      />

      <div
        style={{
          position: 'absolute',
          right: '80px',
          bottom: '90px',
          width: '220px',
          height: '220px',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.12)',
          filter: 'blur(24px)',
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
          padding: '48px',
          color: '#FFFFFF',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 18px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.14)',
              border: '1px solid rgba(255,255,255,0.18)',
              backdropFilter: 'blur(12px)',
              fontSize: '13px',
              fontWeight: 800,
              letterSpacing: '0.4px',
            }}
          >
            KHAMADI ONLINE
          </div>
        </div>

        <div
          style={{
            maxWidth: '720px',
          }}
        >
          <div
            style={{
              fontSize: '56px',
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: '-1.8px',
              marginBottom: '26px',
              textShadow: '0 14px 40px rgba(0,0,0,0.18)',
            }}
          >
            Қазақтың оқуда кеткен
            <br />
            есесі көп.
            <br />
            Атаң үшін де оқы,
            <br />
            әкең үшін де оқы,
            <br />
            өзің үшін де оқы.
          </div>

          <div
            style={{
              fontSize: '20px',
              fontWeight: 700,
              opacity: 0.96,
            }}
          >
            Ғабит Мүсірепов
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            gap: '12px',
            flexWrap: 'wrap',
          }}
        >
          {['UBT', 'AI Tutor', 'Analytics', 'Progress'].map((item) => (
            <div
              key={item}
              style={{
                padding: '10px 16px',
                borderRadius: '999px',
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.16)',
                backdropFilter: 'blur(10px)',
                fontSize: '13px',
                fontWeight: 700,
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}