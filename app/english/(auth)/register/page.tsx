import Link from 'next/link'

// Self-registration is closed: accounts are created by an administrator.
// Kept as a page (not a redirect) because proxy.ts and the dashboard layout
// send users without a profile here, and a redirect to login would loop.
export default function EnglishRegisterClosedPage() {
  return (
    <div style={{ minHeight: '100vh', width: '100%', background: 'linear-gradient(180deg,#f8fcff 0%,#eef8ff 60%,#fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: '52px 44px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.10)' }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: '#0f172a', margin: '0 0 12px' }}>
          Регистрация закрыта
        </h1>
        <p style={{ fontSize: 15, fontWeight: 600, color: '#64748b', lineHeight: 1.6, margin: '0 0 28px' }}>
          Аккаунты создаёт администратор. Обратитесь к администратору, чтобы получить доступ.
        </p>
        <Link
          href="/english/login"
          style={{ display: 'inline-block', padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', color: '#fff', fontWeight: 800, fontSize: 15, textDecoration: 'none' }}
        >
          Войти
        </Link>
      </div>
    </div>
  )
}
