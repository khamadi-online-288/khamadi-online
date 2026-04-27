export default function DashboardLoading() {
  return (
    <div style={{ padding: 28, fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ height: 32, width: 220, background: '#e2e8f0', borderRadius: 8, marginBottom: 24, animation: 'pulse 1.4s ease-in-out infinite' }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} style={{ height: 56, background: '#f8fafc', borderRadius: 12, marginBottom: 8, animation: 'pulse 1.4s ease-in-out infinite', animationDelay: `${i * 0.08}s` }} />
      ))}
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.5}}`}</style>
    </div>
  )
}
