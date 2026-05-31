export default function CourseLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif", padding: '28px 32px' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ width: 180, height: 24, borderRadius: 8, background: '#E2E8F0', marginBottom: 8 }} />
        <div style={{ width: 120, height: 12, borderRadius: 6, background: '#EEF2F7', marginBottom: 28 }} />
        <div style={{ height: 72, borderRadius: 16, background: '#fff', border: '1px solid rgba(0,56,118,0.07)', marginBottom: 20 }} />
        {[1, 2, 3, 4].map(i => (
          <div key={i} style={{ height: 80, borderRadius: 14, background: '#fff', border: '1px solid rgba(0,56,118,0.06)', marginBottom: 10 }} />
        ))}
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.65} 50%{opacity:1} } div{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  )
}
