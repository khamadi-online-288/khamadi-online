'use client'

import Sidebar from '@/components/dashboard/Sidebar'
import Topbar from '@/components/dashboard/Topbar'
import { motion } from 'framer-motion'

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
        gridTemplateColumns: '272px minmax(0, 1fr)',
        background: 'linear-gradient(160deg, #f8fcff 0%, #ffffff 55%, #f0f9ff 100%)',
      }}
    >
      {/* Sidebar column */}
      <div
        style={{
          minWidth: 0,
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowX: 'hidden',
          overflowY: 'auto',
          borderRight: '1px solid rgba(14,165,233,0.10)',
        }}
      >
        <Sidebar />
      </div>

      {/* Main content column */}
      <div
        style={{
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Topbar />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{
            padding: '28px 32px 48px',
            minWidth: 0,
            flex: 1,
          }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
