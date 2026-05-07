'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock, Trophy } from 'lucide-react'
import { useLanguage } from '@/app/english/context/LanguageContext'

export type Badge = {
  id:       string
  emoji:    string
  label:    string
  desc:     string
  unlocked: boolean
  progress?: number
  total?:   number
  gradient?: string
}

type Props = { badges: Badge[] }

export default function AchievementBadges({ badges }: Props) {
  const [active, setActive] = useState<Badge | null>(null)
  const { t }               = useLanguage()

  const unlocked = badges.filter(b => b.unlocked).length

  return (
    <div style={{ background: '#fff', borderRadius: 26, border: '1px solid rgba(27,143,196,0.10)', boxShadow: '0 4px 20px rgba(27,143,196,0.06)', padding: '24px 22px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div>
          <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>
            {t.common.gamification}
          </div>
          <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B', letterSpacing: '-0.03em' }}>{t.dashboard.achievements}</div>
        </div>
        <div style={{
          padding: '5px 12px', borderRadius: 99,
          background: unlocked > 0 ? 'rgba(201,147,59,0.12)' : '#f1f5f9',
          color: unlocked > 0 ? '#C9933B' : '#94a3b8',
          fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5,
        }}>
          <Trophy size={12} />
          {unlocked}/{badges.length}
        </div>
      </div>

      {/* Empty state */}
      {badges.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '32px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🏅</div>
          <div style={{ fontSize: 13, fontWeight: 600 }}>{t.dashboard.achievements}</div>
          <div style={{ fontSize: 12, marginTop: 4 }}>{t.dashboard.continue_learning}</div>
        </div>
      ) : (
        <>
          {/* Badge grid */}
          <motion.div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          >
            {badges.map(badge => (
              <motion.button
                key={badge.id}
                variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } } }}
                whileHover={{ scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
                whileTap={{ scale: 0.96 }}
                onClick={() => setActive(badge)}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                  padding: '10px 4px', borderRadius: 14, border: 'none',
                  background: badge.unlocked ? 'rgba(201,147,59,0.06)' : '#f8fafc',
                  cursor: 'pointer',
                }}
                aria-label={badge.label}
              >
                {/* Badge icon */}
                <div
                  className={badge.unlocked ? (badge.gradient ?? 'bg-gradient-to-br from-sky-400 to-blue-600') : ''}
                  style={{
                    width: 52, height: 52, borderRadius: 16,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 24, flexShrink: 0,
                    background: badge.unlocked ? undefined : '#e2e8f0',
                    boxShadow: badge.unlocked ? '0 4px 14px rgba(0,0,0,0.1)' : 'none',
                  }}
                >
                  {badge.unlocked ? badge.emoji : <Lock size={18} color="#94a3b8" strokeWidth={1.8} />}
                </div>

                {/* Label */}
                <span style={{
                  fontSize: 10,
                  fontWeight: badge.unlocked ? 800 : 600,
                  color: badge.unlocked ? '#1B3A6B' : '#94a3b8',
                  textAlign: 'center', lineHeight: 1.3,
                  wordBreak: 'break-word', hyphens: 'auto',
                  width: '100%',
                }}>
                  {badge.label}
                </span>

                {/* Progress bar (locked only) */}
                {!badge.unlocked && badge.progress != null && badge.total != null && (
                  <div style={{ width: '80%', height: 3, borderRadius: 99, background: '#e2e8f0', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        background: 'linear-gradient(90deg, #1B8FC4, #38bdf8)',
                        borderRadius: 99,
                        width: `${Math.min((badge.progress / badge.total) * 100, 100)}%`,
                      }}
                    />
                  </div>
                )}
              </motion.button>
            ))}
          </motion.div>

          {/* Encouragement if none unlocked */}
          {unlocked === 0 && (
            <div style={{ marginTop: 16, padding: '12px 16px', borderRadius: 12, background: 'rgba(27,143,196,0.06)', border: '1px solid rgba(27,143,196,0.12)', fontSize: 12, color: '#1B8FC4', fontWeight: 600, textAlign: 'center' }}>
              {t.dashboard.continue_learning} → 🚀
            </div>
          )}
        </>
      )}

      {/* Detail modal */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(4px)', zIndex: 50 }}
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              style={{
                position: 'fixed', zIndex: 51,
                left: '50%', top: '50%',
                transform: 'translate(-50%, -50%)',
                background: '#fff', borderRadius: 24,
                boxShadow: '0 24px 60px rgba(15,23,42,0.18)',
                padding: 32, width: 300, textAlign: 'center',
              }}
            >
              <button
                onClick={() => setActive(null)}
                style={{ position: 'absolute', top: 14, right: 14, background: '#f1f5f9', border: 'none', borderRadius: 8, width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <X size={14} color="#64748b" />
              </button>

              <div
                className={active.unlocked ? (active.gradient ?? 'bg-gradient-to-br from-sky-400 to-blue-600') : ''}
                style={{
                  width: 80, height: 80, borderRadius: 24, margin: '0 auto 16px',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36,
                  background: active.unlocked ? undefined : '#e2e8f0',
                  boxShadow: active.unlocked ? '0 8px 28px rgba(0,0,0,0.12)' : 'none',
                }}
              >
                {active.unlocked ? active.emoji : <Lock size={28} color="#94a3b8" strokeWidth={1.5} />}
              </div>

              <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', marginBottom: 8 }}>{active.label}</div>
              <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>{active.desc}</div>

              {!active.unlocked && active.progress != null && active.total != null && (
                <div style={{ marginTop: 20 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94a3b8', marginBottom: 8, fontWeight: 700 }}>
                    <span>{t.common.progress}</span>
                    <span>{active.progress}/{active.total}</span>
                  </div>
                  <div style={{ height: 8, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%', borderRadius: 99,
                      background: 'linear-gradient(90deg, #1B8FC4, #38bdf8)',
                      width: `${Math.min((active.progress / active.total) * 100, 100)}%`,
                    }} />
                  </div>
                </div>
              )}

              {active.unlocked && (
                <div style={{ marginTop: 16, padding: '8px 16px', borderRadius: 10, background: '#dcfce7', color: '#166534', fontSize: 13, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  ✓ {t.common.earned}
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
