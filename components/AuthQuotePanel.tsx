'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'

const features = ['UBT 2026', 'AI Tutor', 'Analytics', 'Study Plan', 'Progress']

export default function AuthQuotePanel() {
  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        overflow: 'hidden',
        background:
          'radial-gradient(circle at 18% 22%, rgba(56,189,248,0.32) 0%, transparent 24%), radial-gradient(circle at 82% 78%, rgba(14,165,233,0.26) 0%, transparent 26%), linear-gradient(145deg, #020617 0%, #0f172a 40%, #0369a1 78%, #0ea5e9 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '36px',
      }}
    >
      {/* Background portrait */}
      <Image
        src="/gabit-musirepov.jpg"
        alt="Ғабит Мүсірепов"
        fill
        priority
        style={{
          objectFit: 'cover',
          objectPosition: 'center top',
          opacity: 0.13,
          mixBlendMode: 'screen',
        }}
      />

      {/* Dark overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, rgba(2,6,23,0.15), rgba(2,6,23,0.30))',
        }}
      />

      {/* Grid pattern */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          opacity: 0.055,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '42px 42px',
          pointerEvents: 'none',
        }}
      />

      {/* Orbs */}
      <div style={{ position: 'absolute', top: '8%', left: '8%', width: 220, height: 220, borderRadius: 999, background: 'rgba(125,211,252,0.18)', filter: 'blur(44px)' }} />
      <div style={{ position: 'absolute', bottom: '12%', right: '8%', width: 260, height: 260, borderRadius: 999, background: 'rgba(56,189,248,0.14)', filter: 'blur(52px)' }} />

      {/* Top badge */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 18px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.10)',
            border: '1px solid rgba(255,255,255,0.16)',
            backdropFilter: 'blur(14px)',
            color: '#ffffff',
            fontSize: 12,
            fontWeight: 800,
            letterSpacing: '0.5px',
            boxShadow: '0 10px 30px rgba(14,165,233,0.12)',
          }}
        >
          <span style={{ width: 8, height: 8, borderRadius: 999, background: '#34d399', display: 'inline-block' }} />
          KHAMADI ONLINE
        </div>
      </motion.div>

      {/* Center quote */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{ position: 'relative', zIndex: 2, color: '#ffffff' }}
      >
        <div
          style={{
            maxWidth: 560,
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.14)',
            borderRadius: 28,
            padding: 28,
            backdropFilter: 'blur(18px)',
            boxShadow: '0 30px 70px rgba(2,6,23,0.24), inset 0 1px 0 rgba(255,255,255,0.08)',
          }}
        >
          <div
            style={{
              fontSize: 11,
              fontWeight: 800,
              opacity: 0.85,
              letterSpacing: '0.55px',
              marginBottom: 14,
              textTransform: 'uppercase',
            }}
          >
            БІЛІМ • ҰЛТ • БОЛАШАҚ
          </div>

          <h2
            style={{
              fontSize: 26,
              lineHeight: 1.55,
              fontWeight: 800,
              marginBottom: 16,
              letterSpacing: '-0.4px',
            }}
          >
            Қазақтың оқуда кеткен есесі көп.
            <br />
            Атаң үшін де оқы, әкең үшін де оқы,
            <br />
            өзің үшін де оқы.
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 999,
                background: 'rgba(255,255,255,0.16)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                border: '1px solid rgba(255,255,255,0.2)',
              }}
            >
              Ғ
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800 }}>Ғабит Мүсірепов</div>
              <div style={{ fontSize: 12, opacity: 0.7, marginTop: 2 }}>Қазақ жазушысы</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Bottom feature pills */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {features.map((item, i) => (
          <motion.div
            key={item}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.5 + i * 0.07 }}
            style={{
              padding: '9px 16px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.10)',
              border: '1px solid rgba(255,255,255,0.16)',
              backdropFilter: 'blur(10px)',
              color: '#ffffff',
              fontSize: 12,
              fontWeight: 700,
              boxShadow: '0 6px 20px rgba(2,6,23,0.10)',
            }}
          >
            {item}
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
