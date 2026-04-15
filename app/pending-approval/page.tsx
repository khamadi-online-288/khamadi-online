'use client'

import { motion } from 'framer-motion'

export default function PendingApprovalPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(160deg, #f0f9ff 0%, #ffffff 55%, #e0f2fe 100%)',
        padding: 24,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Orbs */}
      <div style={{ position: 'absolute', top: '10%', right: '8%', width: 320, height: 320, borderRadius: 999, background: 'rgba(56,189,248,0.12)', filter: 'blur(80px)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: '8%', left: '8%', width: 280, height: 280, borderRadius: 999, background: 'rgba(14,165,233,0.10)', filter: 'blur(70px)', pointerEvents: 'none' }} />
      <div className="grid-bg" />

      <motion.div
        initial={{ opacity: 0, y: 32, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 520,
          background: 'rgba(255,255,255,0.90)',
          border: '1px solid rgba(14,165,233,0.15)',
          borderRadius: 32,
          padding: '48px 40px',
          textAlign: 'center',
          boxShadow: '0 32px 80px rgba(14,165,233,0.10), inset 0 1px 0 rgba(255,255,255,0.6)',
          backdropFilter: 'blur(20px)',
        }}
      >
        {/* Icon */}
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: 0.2, type: 'spring', stiffness: 200 }}
          style={{ fontSize: 58, marginBottom: 24, display: 'block' }}
        >
          ⏳
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          style={{
            display: 'inline-flex',
            padding: '8px 16px',
            borderRadius: 999,
            background: 'rgba(254,249,195,0.9)',
            border: '1px solid rgba(251,191,36,0.30)',
            color: '#b45309',
            fontSize: 12,
            fontWeight: 800,
            marginBottom: 20,
            letterSpacing: '0.4px',
          }}
        >
          МОДЕРАЦИЯ КЕЗІНДЕ
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.4 }}
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: '#0c4a6e',
            marginBottom: 14,
            letterSpacing: '-0.8px',
            lineHeight: 1.2,
          }}
        >
          Аккаунт расталуын күту
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.48 }}
          style={{ fontSize: 15, lineHeight: 1.85, color: '#64748b', marginBottom: 32 }}
        >
          Тіркелуің сәтті аяқталды. Платформаға толық кіру үшін
          администратордың растауы қажет. Бұл 24 сағат ішінде орын алады.
        </motion.p>

        {/* Info cards */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          style={{ display: 'grid', gap: 12, marginBottom: 32 }}
        >
          {[
            { icon: '✅', title: 'Тіркелу аяқталды', desc: 'Аккаунт сәтті жасалды' },
            { icon: '🔍', title: 'Тексеру', desc: 'Администратор аккаунтты тексереді' },
            { icon: '📬', title: 'Хабарлама', desc: 'Расталған соң кіруге болады' },
          ].map((item) => (
            <div key={item.title} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 18px', borderRadius: 18, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)', textAlign: 'left' }}>
              <span style={{ fontSize: 22 }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 2 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}
        >
          <motion.a
            href="/login"
            whileHover={{ scale: 1.04, boxShadow: '0 16px 36px rgba(14,165,233,0.28)' }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '13px 26px',
              borderRadius: 999,
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 10px 28px rgba(14,165,233,0.24)',
              letterSpacing: '-0.01em',
            }}
          >
            Кіру бетіне оралу
          </motion.a>

          <motion.a
            href="https://wa.me/77066405577"
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '13px 26px',
              borderRadius: 999,
              border: '1.5px solid rgba(14,165,233,0.22)',
              background: '#ffffff',
              color: '#0284c7',
              fontSize: 14,
              fontWeight: 800,
              textDecoration: 'none',
              letterSpacing: '-0.01em',
            }}
          >
            WhatsApp байланыс
          </motion.a>
        </motion.div>
      </motion.div>
    </div>
  )
}
