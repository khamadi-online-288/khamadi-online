'use client'

import { motion } from 'framer-motion'
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
        background: 'linear-gradient(160deg, #f8fcff 0%, #ffffff 55%, #f0f9ff 100%)',
      }}
    >
      <ParentTopbar />
      <motion.main
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
        style={{ padding: '28px 32px 48px', maxWidth: '1240px', margin: '0 auto' }}
      >
        {children}
      </motion.main>
    </div>
  )
}