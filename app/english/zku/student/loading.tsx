export default function ZKULoading() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#F0F4FA',
      fontFamily: "'Montserrat', sans-serif",
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Header skeleton */}
      <div style={{
        background: '#003876',
        height: 56,
        display: 'flex',
        alignItems: 'center',
        padding: '0 28px',
        gap: 12,
      }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ width: 160, height: 14, borderRadius: 7, background: 'rgba(255,255,255,0.15)' }} />
        <div style={{ flex: 1 }} />
        <div style={{ width: 80, height: 24, borderRadius: 12, background: 'rgba(255,255,255,0.1)' }} />
      </div>
      {/* Nav skeleton */}
      <div style={{ background: '#003876', borderTop: '1px solid rgba(255,255,255,0.07)', height: 40, display: 'flex', alignItems: 'center', padding: '0 28px', gap: 24 }}>
        {[80, 70, 64, 72, 90].map((w, i) => (
          <div key={i} style={{ width: w, height: 10, borderRadius: 5, background: 'rgba(255,255,255,0.12)' }} />
        ))}
      </div>

      {/* Content skeleton */}
      <div style={{ maxWidth: 1000, margin: '32px auto', padding: '0 32px', width: '100%' }}>
        {/* Title */}
        <div style={{ width: 200, height: 22, borderRadius: 8, background: '#E2E8F0', marginBottom: 8 }} />
        <div style={{ width: 140, height: 12, borderRadius: 6, background: '#EEF2F7', marginBottom: 28 }} />

        {/* Cards */}
        {[1, 2, 3].map(i => (
          <div key={i} style={{
            background: '#fff',
            borderRadius: 16,
            padding: '20px 24px',
            marginBottom: 14,
            border: '1px solid rgba(0,56,118,0.07)',
          }}>
            <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: '#EEF2F7', flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ width: '60%', height: 14, borderRadius: 7, background: '#EEF2F7', marginBottom: 8 }} />
                <div style={{ width: '40%', height: 10, borderRadius: 5, background: '#F1F5F9' }} />
              </div>
              <div style={{ width: 80, height: 32, borderRadius: 10, background: '#EEF2F7' }} />
            </div>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes shimmer {
          0% { opacity: 0.7 }
          50% { opacity: 1 }
          100% { opacity: 0.7 }
        }
        div[style*="background: #E2E8F0"],
        div[style*="background: #EEF2F7"],
        div[style*="background: #F1F5F9"],
        div[style*="background: rgba(255,255,255,0.15)"],
        div[style*="background: rgba(255,255,255,0.12)"],
        div[style*="background: rgba(255,255,255,0.1)"] {
          animation: shimmer 1.4s ease-in-out infinite;
        }
      `}</style>
    </div>
  )
}
