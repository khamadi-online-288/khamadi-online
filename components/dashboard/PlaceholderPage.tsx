export default function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(226,232,240,0.95)',
        borderRadius: '32px',
        padding: '32px',
        boxShadow:
          '0 20px 40px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          display: 'inline-flex',
          padding: '10px 14px',
          borderRadius: '999px',
          background: '#E0F2FE',
          color: '#0369A1',
          fontSize: '12px',
          fontWeight: 800,
          marginBottom: '16px',
        }}
      >
        DASHBOARD MODULE
      </div>

      <h1
        style={{
          fontSize: '32px',
          fontWeight: 800,
          color: '#0F172A',
          marginBottom: '10px',
          letterSpacing: '-0.7px',
        }}
      >
        {title}
      </h1>

      <p
        style={{
          fontSize: '15px',
          color: '#64748B',
          lineHeight: 1.8,
          maxWidth: '760px',
        }}
      >
        {subtitle}
      </p>
    </div>
  )
}