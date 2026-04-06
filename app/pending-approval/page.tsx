export default function PendingApprovalPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 24%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
        padding: 24,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          background: '#FFFFFF',
          border: '1px solid #E2E8F0',
          borderRadius: 28,
          padding: 32,
          textAlign: 'center',
          boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
        }}
      >
        <div style={{ fontSize: 42, marginBottom: 16 }}>⏳</div>

        <h1
          style={{
            fontSize: 32,
            fontWeight: 900,
            color: '#0F172A',
            margin: 0,
            marginBottom: 12,
            letterSpacing: '-0.03em',
          }}
        >
          Аккаунт әлі расталмаған
        </h1>

        <p
          style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: '#64748B',
            margin: 0,
          }}
        >
          Сен тіркелдің, бірақ платформаға кіру үшін админнің подтверждениесі керек.
          Админ растағаннан кейін ғана толық кіре аласың.
        </p>
      </div>
    </div>
  )
}