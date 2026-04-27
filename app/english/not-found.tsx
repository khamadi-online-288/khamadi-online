import Link from 'next/link'

export default function NotFound() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F5F9FD', fontFamily: 'Montserrat, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: 40 }}>
        <div style={{ fontSize: 80, fontWeight: 900, color: '#1B3A6B', opacity: 0.1, lineHeight: 1 }}>404</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: '#1B3A6B', marginBottom: 8 }}>Страница не найдена</div>
        <div style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Запрошенная страница не существует или была перемещена</div>
        <Link href="/english/dashboard" style={{ display: 'inline-block', padding: '12px 28px', borderRadius: 12, background: '#1B8FC4', color: '#fff', fontWeight: 800, fontSize: 14, textDecoration: 'none' }}>
          Вернуться на главную
        </Link>
      </div>
    </div>
  )
}
