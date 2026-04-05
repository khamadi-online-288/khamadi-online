'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type StudyPlanRow = {
  id: number
  status: string
  subject: string
}

type SimulatorResultRow = {
  id: number
  total_score?: number | null
  created_at?: string | null
}

type UserStats = {
  xp: number
  level: number
  streak: number
  longest_streak: number
  total_simulators: number
  total_study_done: number
  total_ai_analysis: number
}

export default function ProgressPage() {
  const [loading, setLoading] = useState(true)
  const [studyPlans, setStudyPlans] = useState<StudyPlanRow[]>([])
  const [simulatorResults, setSimulatorResults] = useState<SimulatorResultRow[]>([])
  const [stats, setStats] = useState<UserStats | null>(null)

  useEffect(() => {
    async function loadProgress() {
      try {
        setLoading(true)

        const {
          data: { user }
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data: plansData } = await supabase
          .from('study_plans')
          .select('id, status, subject')
          .eq('user_id', user.id)
          .order('id', { ascending: true })

        const { data: simData } = await supabase
          .from('simulator_results')
          .select('id, total_score, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(20)

        const { data: statsData } = await supabase
          .from('user_stats')
          .select('xp, level, streak, longest_streak, total_simulators, total_study_done, total_ai_analysis')
          .eq('user_id', user.id)
          .maybeSingle()

        setStudyPlans((plansData || []) as StudyPlanRow[])
        setSimulatorResults((simData || []) as SimulatorResultRow[])
        setStats((statsData || null) as UserStats | null)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadProgress()
  }, [])

  const totalPlans = studyPlans.length
  const completedPlans = studyPlans.filter((p) => p.status === 'done').length
  const completionRate = totalPlans > 0 ? Math.round((completedPlans / totalPlans) * 100) : 0

  const totalSimulators = simulatorResults.length
  const bestScore = simulatorResults.length
    ? Math.max(...simulatorResults.map((r) => Number(r.total_score || 0)))
    : 0
  const avgScore = simulatorResults.length
    ? Math.round(
        simulatorResults.reduce((sum, r) => sum + Number(r.total_score || 0), 0) /
          simulatorResults.length
      )
    : 0
  const latestScore = simulatorResults.length ? Number(simulatorResults[0].total_score || 0) : 0

  const subjectProgress = useMemo(() => {
    const grouped: Record<string, { total: number; done: number }> = {}

    studyPlans.forEach((item) => {
      if (!grouped[item.subject]) grouped[item.subject] = { total: 0, done: 0 }
      grouped[item.subject].total += 1
      if (item.status === 'done') grouped[item.subject].done += 1
    })

    return Object.entries(grouped).map(([subject, value]) => ({
      subject,
      total: value.total,
      done: value.done,
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
      <div style={s.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loader} />
          <p style={s.loadingText}>Прогресс жүктелуде...</p>
          <style>{`
            @keyframes spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badge}>PROGRESS</div>
            <h1 style={s.heroTitle}>Оқу прогресі</h1>
            <p style={s.heroText}>
              XP, деңгей, streak, study plan және симулятор нәтижелері осы жерде көрсетіледі.
            </p>
          </div>

          <div style={s.heroRight}>
            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>Lv. {level}</div>
              <div style={s.bigStatLabel}>Деңгей</div>
            </div>

            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>{streak}🔥</div>
              <div style={s.bigStatLabel}>Қазіргі streak</div>
            </div>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statIcon}>⭐</div>
            <div style={s.statNumber}>{xp}</div>
            <div style={s.statLabel}>XP</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>✅</div>
            <div style={s.statNumber}>{completedPlans}</div>
            <div style={s.statLabel}>Done tasks</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>📝</div>
            <div style={s.statNumber}>{totalSimulators}</div>
            <div style={s.statLabel}>Симулятор саны</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>🏆</div>
            <div style={s.statNumber}>{bestScore}</div>
            <div style={s.statLabel}>Ең жоғары балл</div>
          </div>
        </div>

        <div style={s.mainGrid}>
          <div style={s.card}>
            <h2 style={s.cardTitle}>Level progress</h2>

            <div style={s.metricRow}>
              <div style={s.metricLabel}>Қазіргі деңгей</div>
              <div style={s.metricValue}>Level {level}</div>
            </div>
            <div style={s.track}>
              <div style={{ ...s.fill, width: `${xpProgress}%` }} />
            </div>
            <div style={s.smallNote}>{xpIntoLevel} / 100 XP келесі деңгейге</div>

            <div style={{ height: 18 }} />

            <div style={s.metricRow}>
              <div style={s.metricLabel}>Study Plan completion</div>
              <div style={s.metricValue}>{completionRate}%</div>
            </div>
            <div style={s.track}>
              <div style={{ ...s.fill, width: `${completionRate}%` }} />
            </div>

            <div style={{ height: 18 }} />

            <div style={s.metricRow}>
              <div style={s.metricLabel}>Орташа симулятор балы</div>
              <div style={s.metricValue}>{avgScore}</div>
            </div>
            <div style={s.track}>
              <div style={{ ...s.fill, width: `${(Math.min(avgScore, 140) / 140) * 100}%` }} />
            </div>
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Streak & consistency</h2>

            <div style={s.streakBox}>
              <div style={s.streakMain}>{streak} 🔥</div>
              <div style={s.streakLabel}>Қазіргі streak</div>
            </div>

            <div style={{ height: 16 }} />

            <div style={s.metricRow}>
              <div style={s.metricLabel}>Ең ұзақ streak</div>
              <div style={s.metricValue}>{longestStreak} күн</div>
            </div>

            <div style={s.metricRow}>
              <div style={s.metricLabel}>Соңғы симулятор</div>
              <div style={s.metricValue}>{latestScore}</div>
            </div>

            <div style={s.metricRow}>
              <div style={s.metricLabel}>AI analysis саны</div>
              <div style={s.metricValue}>{Number(stats?.total_ai_analysis || 0)}</div>
            </div>
          </div>
        </div>

        <div style={s.card}>
          <h2 style={s.cardTitle}>Пәндер бойынша прогресс</h2>

          {subjectProgress.length === 0 ? (
            <p style={s.emptyText}>Әзірше progress дерегі жоқ</p>
          ) : (
            subjectProgress.map((item, index) => (
              <div
                key={item.subject}
                style={{
                  ...s.subjectRow,
                  borderBottom: index === subjectProgress.length - 1 ? 'none' : '1px solid #EEF2F7'
                }}
              >
                <div style={s.subjectTop}>
                  <div>
                    <div style={s.subjectName}>{item.subject}</div>
                    <div style={s.subjectMeta}>{item.done} / {item.total} орындалды</div>
                  </div>
                  <div style={s.subjectPercent}>{item.percent}%</div>
                </div>

                <div style={s.track}>
                  <div
                    style={{
                      ...s.fill,
                      width: `${item.percent}%`,
                      background:
                        item.percent >= 70
                          ? '#22C55E'
                          : item.percent >= 40
                          ? '#0EA5E9'
                          : '#F59E0B'
                    }}
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F8FAFC', padding: '24px 20px 40px' },
  wrap: { maxWidth: 1180, margin: '0 auto' },
  loadingPage: { minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loader: { width: 52, height: 52, border: '4px solid #0EA5E9', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 1s linear infinite' },
  loadingText: { color: '#64748B', fontSize: 15, margin: 0 },
  hero: { display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 20, background: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)', border: '1px solid #E2E8F0', borderRadius: 28, padding: 28, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', marginBottom: 22 },
  heroLeft: {},
  heroRight: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '9px 13px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0EA5E9', fontSize: 12, fontWeight: 800, marginBottom: 16 },
  heroTitle: { fontSize: 34, fontWeight: 800, lineHeight: 1.12, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 12 },
  heroText: { fontSize: 16, lineHeight: 1.8, color: '#64748B', margin: 0 },
  bigStatCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 22, textAlign: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' },
  bigStatNumber: { fontSize: 30, fontWeight: 800, lineHeight: 1.1, color: '#0F172A' },
  bigStatLabel: { fontSize: 13, color: '#64748B', marginTop: 6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 22 },
  statCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, textAlign: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' },
  statIcon: { fontSize: 24, marginBottom: 8 },
  statNumber: { fontSize: 24, fontWeight: 800, color: '#0F172A', marginBottom: 4 },
  statLabel: { fontSize: 12, color: '#64748B' },
  mainGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 },
  card: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', marginBottom: 20 },
  cardTitle: { fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: '#0F172A', margin: 0, marginBottom: 18 },
  metricRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 10 },
  metricLabel: { fontSize: 15, fontWeight: 600, color: '#334155' },
  metricValue: { fontSize: 15, fontWeight: 800, color: '#0EA5E9' },
  track: { width: '100%', height: 10, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, background: '#0EA5E9' },
  smallNote: { marginTop: 8, color: '#64748B', fontSize: 13 },
  streakBox: { background: '#FFF7ED', border: '1px solid #FED7AA', borderRadius: 20, padding: 24, textAlign: 'center' },
  streakMain: { fontSize: 36, fontWeight: 900, color: '#C2410C', lineHeight: 1.1 },
  streakLabel: { fontSize: 14, color: '#9A3412', marginTop: 6 },
  emptyText: { color: '#64748B', fontSize: 15, lineHeight: 1.7, margin: 0 },
  subjectRow: { padding: '16px 0' },
  subjectTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 },
  subjectName: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  subjectMeta: { fontSize: 13, color: '#64748B' },
  subjectPercent: { fontSize: 15, fontWeight: 800, color: '#0EA5E9' }
}