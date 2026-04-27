'use client'

import { motion } from 'framer-motion'
import Sidebar from '@/components/english/layout/Sidebar'
import Navbar  from '@/components/english/layout/Navbar'
import type { UserRole, CefrLevel } from '@/types/english/database'

type Props = {
  children:  React.ReactNode
  role:      UserRole
  userName:  string
  level:     CefrLevel | ''
}

export default function EnglishShell({ children, role, userName, level }: Props) {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '256px minmax(0, 1fr)',
        background: '#F5F9FD',
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          height: '100vh',
          position: 'sticky',
          top: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
        }}
      >
        <Sidebar role={role} userName={userName} />
      </div>

      {/* Main */}
      <div style={{ minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <Navbar userName={userName} level={level as CefrLevel} />

        <motion.main
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          style={{ padding: '28px 32px 48px', minWidth: 0, flex: 1 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  )
}
