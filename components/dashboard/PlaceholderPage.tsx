'use client'

import { motion } from 'framer-motion'

export default function PlaceholderPage({
  title,
  subtitle,
}: {
  title: string
  subtitle: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          style={{
            display: 'inline-flex',
            padding: '8px 16px',
            borderRadius: 999,
            background: 'rgba(224,242,254,0.9)',
            border: '1px solid rgba(14,165,233,0.18)',
            color: '#0369a1',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 16,
            letterSpacing: '0.4px',
          }}
        >
          DASHBOARD MODULE
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          style={{
            fontSize: 36,
            fontWeight: 800,
            color: '#0c4a6e',
            marginBottom: 10,
            letterSpacing: '-1px',
            lineHeight: 1.1,
          }}
        >
          {title}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          style={{
            fontSize: 16,
            color: '#64748b',
            lineHeight: 1.8,
            maxWidth: 680,
          }}
        >
          {subtitle}
        </motion.p>
      </div>

      {/* Under construction card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25 }}
        style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          border: '1px solid rgba(14,165,233,0.20)',
          borderRadius: 28,
          padding: 40,
          textAlign: 'center',
          boxShadow: '0 12px 36px rgba(14,165,233,0.08)',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 18 }}>🚧</div>
        <div
          style={{
            fontSize: 22,
            fontWeight: 800,
            color: '#0c4a6e',
            marginBottom: 10,
            letterSpacing: '-0.5px',
          }}
        >
          Жақын арада іске қосылады
        </div>
        <div
          style={{
            fontSize: 15,
            color: '#64748b',
            lineHeight: 1.8,
            maxWidth: 480,
            margin: '0 auto',
          }}
        >
          Бұл бөлім белсенді дайындық кезінде. Жуырда толық функционал жұмыс
          істейді.
        </div>
      </motion.div>
    </motion.div>
  )
}
