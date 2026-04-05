'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'

export default function DashboardShell({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '320px minmax(0, 1fr)',
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.05), transparent 22%), radial-gradient(circle at bottom left, rgba(14,165,233,0.05), transparent 24%), linear-gradient(180deg, #F8FAFC 0%, #FFFFFF 58%, #F8FBFF 100%)',
      }}
    >
      <div
        style={{
          minWidth: 0,
          borderRight: '1px solid #EAEFF5',
        }}
      >
        <Sidebar />
      </div>

      <div
        style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar />

        <main
          style={{
            padding: '24px 28px 32px',
            minWidth: 0,
          }}
        >
          {children}
        </main>
      </div>
    </div>
  )
}