export default function LessonLoading() {
  return (
    <div style={{ minHeight: '100vh', background: '#F0F4FA', fontFamily: "'Montserrat', sans-serif" }}>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '32px 24px' }}>
        {/* Header bar */}
        <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, marginBottom: 28 }}>
          <div style={{ height: '100%', width: '35%', background: '#003876', borderRadius: 99, opacity: 0.3 }} />
        </div>
        {/* Title */}
        <div style={{ width: '60%', height: 28, borderRadius: 10, background: '#E2E8F0', marginBottom: 12 }} />
        <div style={{ width: '40%', height: 14, borderRadius: 7, background: '#EEF2F7', marginBottom: 32 }} />
        {/* Content block */}
        {[100, 85, 90, 70, 95].map((w, i) => (
          <div key={i} style={{ width: `${w}%`, height: 14, borderRadius: 7, background: '#EEF2F7', marginBottom: 12 }} />
        ))}
        <div style={{ height: 48, borderRadius: 14, background: '#003876', marginTop: 32, opacity: 0.15 }} />
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:.6} 50%{opacity:1} } div{animation:pulse 1.5s ease-in-out infinite}`}</style>
    </div>
  )
}
