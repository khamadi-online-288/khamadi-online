export default function CoursesLoading() {
  return (
    <div style={{ fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ height: 36, width: 120, background: '#e2e8f0', borderRadius: 8, marginBottom: 8 }} />
      <div style={{ height: 16, width: 360, background: '#f1f5f9', borderRadius: 6, marginBottom: 28 }} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 20 }}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ height: 140, background: '#e2e8f0' }} />
            <div style={{ background: '#f8fafc', padding: '16px 20px', height: 100 }}>
              <div style={{ height: 16, background: '#e2e8f0', borderRadius: 6, marginBottom: 8, width: '80%' }} />
              <div style={{ height: 12, background: '#f1f5f9', borderRadius: 6, marginBottom: 16, width: '60%' }} />
              <div style={{ height: 4, background: '#e2e8f0', borderRadius: 999 }} />
            </div>
          </div>
        ))}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}div{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  )
}
