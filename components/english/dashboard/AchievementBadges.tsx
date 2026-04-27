'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Lock } from 'lucide-react'

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

  return (
    <div className="bg-white rounded-2xl border border-sky/10 shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-serif font-bold text-navy text-lg">Достижения</h2>
        <span className="text-xs text-gray-400 font-medium">
          {badges.filter(b => b.unlocked).length}/{badges.length}
        </span>
      </div>

      <motion.div
        className="flex gap-4 overflow-x-auto pb-1 scrollbar-hide"
        initial="hidden"
        animate="show"
        variants={{ show: { transition: { staggerChildren: 0.07 } } }}
      >
        {badges.map(badge => (
          <motion.button
            key={badge.id}
            variants={{ hidden: { opacity: 0, scale: 0.7 }, show: { opacity: 1, scale: 1, transition: { type: 'spring', stiffness: 200, damping: 18 } } }}
            whileHover={{ scale: 1.08, transition: { type: 'spring', stiffness: 400, damping: 20 } }}
            whileTap={{ scale: 0.96 }}
            onClick={() => setActive(badge)}
            className="shrink-0 flex flex-col items-center gap-2 w-16"
            aria-label={badge.label}
          >
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-sm
              ${badge.unlocked
                ? badge.gradient ?? 'bg-gradient-to-br from-sky to-mid shadow-sky/20'
                : 'bg-gray-100'
              }`}
            >
              {badge.unlocked ? badge.emoji : <Lock size={18} className="text-gray-300" strokeWidth={1.8} />}
            </div>
            <span className={`text-xs font-bold text-center leading-tight ${badge.unlocked ? 'text-navy' : 'text-gray-300'}`}>
              {badge.label}
            </span>
            {!badge.unlocked && badge.progress != null && badge.total != null && (
              <div className="w-10 h-1 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-sky/40 rounded-full"
                  style={{ width: `${Math.min((badge.progress / badge.total) * 100, 100)}%` }}
                />
              </div>
            )}
          </motion.button>
        ))}
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {active && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-navy/40 backdrop-blur-sm z-50"
              onClick={() => setActive(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.85, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.85, y: 20 }}
              transition={{ type: 'spring', stiffness: 300, damping: 24 }}
              className="fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl p-7 w-72 text-center"
            >
              <button onClick={() => setActive(null)} className="absolute top-3 right-3 text-gray-300 hover:text-gray-500 transition-colors">
                <X size={16} />
              </button>
              <div className={`w-20 h-20 rounded-2xl mx-auto flex items-center justify-center text-4xl mb-4 shadow-md
                ${active.unlocked ? (active.gradient ?? 'bg-gradient-to-br from-sky to-mid') : 'bg-gray-100'}`}
              >
                {active.unlocked ? active.emoji : <Lock size={28} className="text-gray-300" strokeWidth={1.5} />}
              </div>
              <h3 className="font-serif font-bold text-navy text-lg mb-1">{active.label}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{active.desc}</p>
              {!active.unlocked && active.progress != null && active.total != null && (
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-400 mb-1.5 font-medium">
                    <span>Прогресс</span>
                    <span className="tabular-nums">{active.progress}/{active.total}</span>
                  </div>
                  <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-sky/50"
                      style={{ width: `${Math.min((active.progress / active.total) * 100, 100)}%` }}
                    />
                  </div>
                </div>
              )}
              {active.unlocked && <p className="mt-3 text-xs text-emerald-600 font-bold">✓ Получено</p>}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
