'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type StudyPlanRow = { id: number; status: string; subject: string }
type SimulatorResultRow = { id: number; total_score?: number | null; created_at?: string | null }
type UserStats = {
  xp: number; level: number; streak: number; longest_streak: number
  total_simulators: number; total_study_done: number; total_ai_analysis: number
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [studyPlans, setStudyPlans] = useState<StudyPlanRow[]>([])
  const [simulatorResults, setSimulatorResults] = useState<SimulatorResultRow[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const [plansRes, simRes, statsRes] = await Promise.all([
          supabase.from('study_plans').select('id, status, subject').eq('user_id', user.id).order('id', { ascending: true }),
          supabase.from('simulator_results').select('id, total_score, created_at').eq('user_id', user.id).order('created_at', { ascending: false }).limit(20),
          supabase.from('user_stats').select('xp, level, streak, longest_streak, total_simulators, total_study_done, total_ai_analysis').eq('user_id', user.id).maybeSingle(),
        ])

        setStudyPlans((plansRes.data || []) as StudyPlanRow[])
        setSimulatorResults((simRes.data || []) as SimulatorResultRow[])
        setStats((statsRes.data || null) as UserStats | null)
      } catch (error) { console.error(error) }
      finally { setLoading(false) }
    }
    loadProgress()
  }, [])

  const totalPlans = studyPlans.length
  const completedPlans = studyPlans.filter((p) => p.status === 'done').length
  const completionRate = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0

  const totalSimulators = simulatorResults.length
  const bestScore = simulatorResults.length ? Math.max(...simulatorResults.map((r) => Number(r.total_score || 0))) : 0
  const avgScore = simulatorResults.length ? Math.round(simulatorResults.reduce((sum, r) => sum + Number(r.total_score || 0), 0) / simulatorResults.length) : 0
  const latestScore = simulatorResults.length ? Number(simulatorResults[0].total_score || 0) : 0

  const subjectProgress = useMemo(() => {
    const grouped: Record<string, { total: number; done: number }> = {}
    studyPlans.forEach((item) => {
      if (!grouped[item.subject]) grouped[item.subject] = { total: 0, done: 0 }
      grouped[item.subject].total += 1
      if (item.status === 'done') grouped[item.subject].done += 1
    })
    return Object.entries(grouped).map(([subject, value]) => ({
      subject, total: value.total, done: value.done,
      percent: value.total > 0 ? Math.round((value.done / value.total) * 100) : 0
    }))
  }, [studyPlans])

  const xp = Number(stats?.xp || 0)
  const level = Number(stats?.level || 1)
  const streak = Number(stats?.streak || 0)
  const longestStreak = Number(stats?.longest_streak || 0)
  const xpIntoLevel = xp % 100
  const xpProgress = Math.round((xpIntoLevel / 100) * 100)

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Прогресс жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Progress
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Оқу прогресі
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          XP, деңгей, streak, study plan және симулятор нәтижелері осы жерде көрсетіледі.
        </p>
      </motion.div>

      {/* Hero card */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          borderRadius: 30, padding: 28, marginBottom: 20,
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
          boxShadow: '0 24px 56px rgba(12,74,110,0.22)',
          display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24,
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '0.06em' }}>
            PROGRESS
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', margin: '0 0 12px', lineHeight: 1.05 }}>
            Оқу прогресі
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            XP, деңгей, streak, study plan және симулятор нәтижелері осы жерде көрсетіледі.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
          {[{ num: `Lv. ${level}`, label: 'Деңгей' }, { num: `${streak}🔥`, label: 'Streak' }].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.08 }}
              style={{ background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 20, padding: 18, textAlign: 'center' }}
            >
              <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', lineHeight: 1.1 }}>{s.num}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', marginTop: 5, fontWeight: 700 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '⭐', num: String(xp), label: 'XP' },
          { icon: '✅', num: String(completedPlans), label: 'Done tasks' },
          { icon: '📝', num: String(totalSimulators), label: 'Симулятор саны' },
          { icon: '🏆', num: String(bestScore), label: 'Ең жоғары балл' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, boxShadow: '0 16px 32px rgba(14,165,233,0.14)' }}
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 22, padding: 20, textAlign: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.07)', transition: 'box-shadow 0.2s' }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 24, fontWeight: 900, color: '#0c4a6e', marginBottom: 4, letterSpacing: '-0.03em' }}>{s.num}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Progress cards grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 18, marginBottom: 18 }}>
        {/* Level progress */}
        <motion.div
          {...fadeUp(0.2)}
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 20px', letterSpacing: '-0.03em' }}>Level progress</h2>

          {[
            { label: `Level ${level} — XP прогресі`, value: xpProgress, note: `${xpIntoLevel} / 100 XP келесі деңгейге` },
            { label: 'Study Plan аяқтау', value: completionRate },
            { label: `Орташа симулятор балы (${avgScore})`, value: Math.round((Math.min(avgScore, 140) / 140) * 100) },
          ].map((item, i) => (
            <div key={i} style={{ marginBottom: 18 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#334155' }}>{item.label}</div>
                <div style={{ fontSize: 13, fontWeight: 900, color: '#0ea5e9' }}>{item.value}%</div>
              </div>
              <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.value}%` }}
                  transition={{ duration: 0.8, delay: 0.3 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }}
                />
              </div>
              {item.note && <div style={{ marginTop: 6, color: '#94a3b8', fontSize: 12, fontWeight: 600 }}>{item.note}</div>}
            </div>
          ))}
        </motion.div>

        {/* Streak card */}
        <motion.div
          {...fadeUp(0.24)}
          style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
        >
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 20px', letterSpacing: '-0.03em' }}>Streak & consistency</h2>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ background: 'linear-gradient(135deg, #fff7ed, #fef3c7)', border: '1px solid #fed7aa', borderRadius: 20, padding: '22px', textAlign: 'center', marginBottom: 18 }}
          >
            <div style={{ fontSize: 36, fontWeight: 900, color: '#c2410c', lineHeight: 1.1 }}>{streak} 🔥</div>
            <div style={{ fontSize: 13, color: '#9a3412', marginTop: 6, fontWeight: 700 }}>Қазіргі streak</div>
          </motion.div>

          {[
            { label: 'Ең ұзақ streak', value: `${longestStreak} күн` },
            { label: 'Соңғы симулятор балл', value: String(latestScore) },
            { label: 'AI analysis саны', value: String(stats?.total_ai_analysis || 0) },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{item.label}</div>
              <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e' }}>{item.value}</div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Subject progress */}
      <motion.div
        {...fadeUp(0.28)}
        style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
      >
        <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 20px', letterSpacing: '-0.03em' }}>Пәндер бойынша прогресс</h2>

        {subjectProgress.length === 0 ? (
          <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>Әзірше progress дерегі жоқ</p>
        ) : (
          subjectProgress.map((item, index) => {
            const barColor = item.percent >= 70 ? '#22c55e' : item.percent >= 40 ? '#0ea5e9' : '#f59e0b'
            return (
              <div key={item.subject} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: index === subjectProgress.length - 1 ? 'none' : '1px solid rgba(14,165,233,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 2 }}>{item.subject}</div>
                    <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.done} / {item.total} орындалды</div>
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>{item.percent}%</div>
                </div>
                <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.percent}%` }}
                    transition={{ duration: 0.8, delay: 0.3 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    style={{ height: '100%', borderRadius: 999, background: barColor }}
                  />
                </div>
              </div>
            )
          })
        )}
      </motion.div>
    </div>
  )
}
