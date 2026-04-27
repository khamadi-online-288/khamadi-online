'use client'

export default function DashboardError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div style={{ padding: 60, textAlign: 'center', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.3 }}>⚠</div>
      <div style={{ fontSize: 18, fontWeight: 800, color: '#1B3A6B', marginBottom: 8 }}>Что-то пошло не так</div>
      <div style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>{error.message || 'Произошла непредвиденная ошибка'}</div>
      <button onClick={reset} style={{ padding: '10px 28px', background: '#1B8FC4', color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat' }}>
        Попробовать снова
      </button>
    </div>
  )
}
