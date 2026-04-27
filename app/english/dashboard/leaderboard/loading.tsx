export default function LeaderboardLoading() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 4px', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ height: 32, width: 180, background: '#e2e8f0', borderRadius: 8, marginBottom: 8 }} />
      <div style={{ height: 16, width: 300, background: '#f1f5f9', borderRadius: 6, marginBottom: 24 }} />
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 28 }}>
        {[140, 180, 120].map((h, i) => <div key={i} style={{ width: 140, height: h, background: '#f1f5f9', borderRadius: 16 }} />)}
      </div>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} style={{ height: 52, background: '#f8fafc', borderRadius: 12, marginBottom: 8 }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}div{animation:pulse 1.4s ease-in-out infinite}`}</style>
    </div>
  )
}
