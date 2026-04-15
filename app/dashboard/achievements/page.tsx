'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

type UserAchievement = {
  achievement_key: string
  unlocked: boolean
  progress: number
  unlocked_at?: string | null
}

type AchievementDef = {
  key: string; title: string; description: string
  icon: string; goal: number; color: string
}

const ACHIEVEMENTS: AchievementDef[] = [
  { key: 'first_simulator', title: 'Алғашқы қадам', description: 'Алғашқы симуляторды тапсыру', icon: '🚀', goal: 1, color: '#0ea5e9' },
  { key: 'three_simulators', title: 'Тұрақты бастау', description: '3 симулятор тапсыру', icon: '📘', goal: 3, color: '#38bdf8' },
  { key: 'ten_simulators', title: 'Нағыз дайындық', description: '10 симулятор тапсыру', icon: '🏆', goal: 10, color: '#2563eb' },
  { key: 'score_100', title: '100+ клубы', description: 'Симулятордан 100+ балл жинау', icon: '💯', goal: 100, color: '#16a34a' },
  { key: 'score_120', title: '120+ elite', description: 'Симулятордан 120+ балл жинау', icon: '👑', goal: 120, color: '#7c3aed' },
  { key: 'study_plan_7', title: '7 күн тәртіп', description: '7 study plan тапсырмасын орындау', icon: '📅', goal: 7, color: '#f59e0b' },
  { key: 'study_plan_30', title: '30 күн дисциплина', description: '30 study plan тапсырмасын орындау', icon: '🔥', goal: 30, color: '#ea580c' },
  { key: 'ai_analysis', title: 'AI Insight', description: 'Бірінші AI анализ жасау', icon: '🤖', goal: 1, color: '#0891b2' },
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<UserAchievement[]>([])

  useEffect(() => { loadAchievements() }, [])

  async function loadAchievements() {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_key, unlocked, progress, unlocked_at')
        .eq('user_id', user.id)

      if (error) { console.error(error); setRows([]); return }
      setRows((data || []) as UserAchievement[])
    } catch (error) { console.error(error) }
    finally { setLoading(false) }
  }

  const merged = useMemo(() => {
    return ACHIEVEMENTS.map((item) => {
      const db = rows.find((r) => r.achievement_key === item.key)
      return { ...item, unlocked: db?.unlocked || false, progress: db?.progress || 0, unlockedAt: db?.unlocked_at || null }
    })
  }, [rows])

  const unlockedCount = merged.filter((a) => a.unlocked).length
  const percent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Achievements жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Achievements
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Жетістіктер
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Симулятор, study plan, AI анализ және прогресс арқылы ашылатын марапаттар.
        </p>
      </motion.div>

      {/* Hero + progress */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          borderRadius: 28, padding: '24px 28px', marginBottom: 20,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid rgba(14,165,233,0.18)',
          boxShadow: '0 18px 40px rgba(14,165,233,0.1)',
          display: 'grid', gridTemplateColumns: '1fr auto', gap: 24, alignItems: 'center',
        }}
      >
        <div>
          <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e', marginBottom: 12 }}>Жалпы прогресс</div>
          <div style={{ width: '100%', height: 10, borderRadius: 999, background: 'rgba(14,165,233,0.15)', overflow: 'hidden', marginBottom: 10 }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }}
            />
          </div>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>
            {unlockedCount} / {ACHIEVEMENTS.length} жетістік ашылды
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          {[{ num: String(unlockedCount), label: 'Ашылған' }, { num: `${percent}%`, label: 'Completion' }].map((s) => (
            <div key={s.label} style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 18, padding: '16px 20px', textAlign: 'center', minWidth: 90, boxShadow: '0 8px 18px rgba(14,165,233,0.08)' }}>
              <div style={{ fontSize: 24, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 4, fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Achievement grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {merged.map((item, i) => {
          const progressPercent = Math.min(100, Math.round((item.progress / item.goal) * 100))
          return (
            <motion.div
              key={item.key}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              whileHover={item.unlocked ? { y: -3, boxShadow: `0 20px 40px ${item.color}22` } : {}}
              style={{
                background: item.unlocked ? '#fff' : 'rgba(255,255,255,0.7)',
                border: item.unlocked ? `1.5px solid ${item.color}30` : '1px solid rgba(14,165,233,0.1)',
                borderRadius: 24, padding: 22,
                boxShadow: item.unlocked ? `0 10px 28px ${item.color}12` : '0 6px 16px rgba(14,165,233,0.05)',
                opacity: item.unlocked ? 1 : 0.72,
                transition: 'box-shadow 0.2s, opacity 0.2s',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 60, height: 60, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: item.unlocked ? `${item.color}18` : '#f8fafc',
                  border: item.unlocked ? `1px solid ${item.color}30` : '1px solid rgba(14,165,233,0.1)',
                }}>
                  <span style={{ fontSize: 28 }}>{item.icon}</span>
                </div>
                <div style={{
                  padding: '7px 12px', borderRadius: 999, fontSize: 11, fontWeight: 800,
                  background: item.unlocked ? '#f0fdf4' : '#f8fafc',
                  border: item.unlocked ? '1px solid #bbf7d0' : '1px solid rgba(14,165,233,0.1)',
                  color: item.unlocked ? '#166534' : '#94a3b8',
                }}>
                  {item.unlocked ? '✓ Unlocked' : 'Locked'}
                </div>
              </div>

              <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.02em' }}>{item.title}</div>
              <div style={{ fontSize: 13, lineHeight: 1.7, color: '#64748b', marginBottom: 16, fontWeight: 600 }}>{item.description}</div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8' }}>Прогресс</div>
                <div style={{ fontSize: 12, fontWeight: 900, color: '#0c4a6e' }}>{Math.min(item.progress, item.goal)} / {item.goal}</div>
              </div>

              <div style={{ width: '100%', height: 7, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden', marginBottom: 12 }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.8, delay: 0.15 + i * 0.04 }}
                  style={{ height: '100%', borderRadius: 999, background: item.unlocked ? item.color : '#cbd5e1' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: 12, fontWeight: 900, color: item.unlocked ? item.color : '#94a3b8' }}>{progressPercent}%</div>
                <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>
                  {item.unlockedAt ? `${new Date(item.unlockedAt).toLocaleDateString()}` : 'Әлі ашылмаған'}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
