export default function PendingPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(180deg,#f8fcff 0%,#eef8ff 60%,#fff 100%)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Montserrat, sans-serif', padding: 20,
    }}>
      <div style={{
        background: '#fff', borderRadius: 28, padding: '52px 44px',
        maxWidth: 480, width: '100%', textAlign: 'center',
        boxShadow: '0 8px 40px rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.10)',
      }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.03em' }}>
          Заявка на рассмотрении
        </div>
        <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, marginBottom: 36, fontWeight: 600 }}>
          Ваша заявка отправлена администратору платформы.<br />
          После одобрения вы получите доступ к курсам.<br />
          Обычно это занимает не более 24 часов.
        </div>
        <a href="/english/login" style={{
          display: 'inline-block', padding: '14px 32px', borderRadius: 14,
          background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 14,
          textDecoration: 'none',
        }}>
          Войти позже
        </a>
      </div>
    </div>
  )
}
