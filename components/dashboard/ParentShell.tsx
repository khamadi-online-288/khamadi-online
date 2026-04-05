'use client'

import ParentTopbar from '@/components/dashboard/ParentTopbar'

export default function ParentShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.08), transparent 22%), radial-gradient(circle at bottom left, rgba(14,165,233,0.06), transparent 24%), linear-gradient(180deg, #FAFDFF 0%, #FFFFFF 58%, #F6FBFF 100%)',
      }}
    >
      <ParentTopbar />
      <main style={{ padding: '24px', maxWidth: '1240px', margin: '0 auto' }}>
        {children}
      </main>
    </div>
  )
}