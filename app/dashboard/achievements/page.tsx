'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type UserAchievement = {
  achievement_key: string
  unlocked: boolean
  progress: number
  unlocked_at?: string | null
}

type AchievementDef = {
  key: string
  title: string
  description: string
  icon: string
  goal: number
  color: string
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: 'first_simulator',
    title: 'Алғашқы қадам',
    description: 'Алғашқы симуляторды тапсыру',
    icon: '🚀',
    goal: 1,
    color: '#0EA5E9'
  },
  {
    key: 'three_simulators',
    title: 'Тұрақты бастау',
    description: '3 симулятор тапсыру',
    icon: '📘',
    goal: 3,
    color: '#38BDF8'
  },
  {
    key: 'ten_simulators',
    title: 'Нағыз дайындық',
    description: '10 симулятор тапсыру',
    icon: '🏆',
    goal: 10,
    color: '#2563EB'
  },
  {
    key: 'score_100',
    title: '100+ клубы',
    description: 'Симулятордан 100+ балл жинау',
    icon: '💯',
    goal: 100,
    color: '#16A34A'
  },
  {
    key: 'score_120',
    title: '120+ elite',
    description: 'Симулятордан 120+ балл жинау',
    icon: '👑',
    goal: 120,
    color: '#7C3AED'
  },
  {
    key: 'study_plan_7',
    title: '7 күн тәртіп',
    description: '7 study plan тапсырмасын орындау',
    icon: '📅',
    goal: 7,
    color: '#F59E0B'
  },
  {
    key: 'study_plan_30',
    title: '30 күн дисциплина',
    description: '30 study plan тапсырмасын орындау',
    icon: '🔥',
    goal: 30,
    color: '#EA580C'
  },
  {
    key: 'ai_analysis',
    title: 'AI Insight',
    description: 'Бірінші AI анализ жасау',
    icon: '🤖',
    goal: 1,
    color: '#0891B2'
  }
]

export default function AchievementsPage() {
  const [loading, setLoading] = useState(true)
  const [rows, setRows] = useState<UserAchievement[]>([])

  useEffect(() => {
    loadAchievements()
  }, [])

  async function loadAchievements() {
    try {
      setLoading(true)

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('user_achievements')
        .select('achievement_key, unlocked, progress, unlocked_at')
        .eq('user_id', user.id)

      if (error) {
        console.error(error)
        setRows([])
        return
      }

      setRows((data || []) as UserAchievement[])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const merged = useMemo(() => {
    return ACHIEVEMENTS.map((item) => {
      const db = rows.find((r) => r.achievement_key === item.key)

      return {
        ...item,
        unlocked: db?.unlocked || false,
        progress: db?.progress || 0,
        unlockedAt: db?.unlocked_at || null
      }
    })
  }, [rows])

  const unlockedCount = merged.filter((a) => a.unlocked).length
  const percent = Math.round((unlockedCount / ACHIEVEMENTS.length) * 100)

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loader} />
          <p style={s.loadingText}>Achievements жүктелуде...</p>
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
            <div style={s.badge}>ACHIEVEMENTS</div>
            <h1 style={s.heroTitle}>Жетістіктер</h1>
            <p style={s.heroText}>
              Симулятор, study plan, AI анализ және прогресс арқылы ашылатын
              марапаттар осы жерде жиналады.
            </p>
          </div>

          <div style={s.heroRight}>
            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>{unlockedCount}</div>
              <div style={s.bigStatLabel}>Ашылған жетістік</div>
            </div>

            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>{percent}%</div>
              <div style={s.bigStatLabel}>Жалпы completion</div>
            </div>
          </div>
        </div>

        <div style={s.progressCard}>
          <div style={s.progressTop}>
            <div style={s.progressTitle}>Жалпы прогресс</div>
            <div style={s.progressValue}>
              {unlockedCount} / {ACHIEVEMENTS.length}
            </div>
          </div>

          <div style={s.track}>
            <div style={{ ...s.fill, width: `${percent}%` }} />
          </div>
        </div>

        <div style={s.grid}>
          {merged.map((item) => {
            const progressPercent = Math.min(
              100,
              Math.round((item.progress / item.goal) * 100)
            )

            return (
              <div
                key={item.key}
                style={{
                  ...s.card,
                  opacity: item.unlocked ? 1 : 0.78,
                  border: item.unlocked
                    ? `1px solid ${item.color}33`
                    : '1px solid #E2E8F0'
                }}
              >
                <div style={s.cardTop}>
                  <div
                    style={{
                      ...s.iconWrap,
                      background: item.unlocked ? `${item.color}18` : '#F8FAFC',
                      border: item.unlocked
                        ? `1px solid ${item.color}33`
                        : '1px solid #E2E8F0'
                    }}
                  >
                    <span style={{ fontSize: 28 }}>{item.icon}</span>
                  </div>

                  <div
                    style={{
                      ...s.statusBadge,
                      background: item.unlocked ? '#F0FDF4' : '#F8FAFC',
                      border: item.unlocked
                        ? '1px solid #BBF7D0'
                        : '1px solid #E2E8F0',
                      color: item.unlocked ? '#166534' : '#64748B'
                    }}
                  >
                    {item.unlocked ? 'Unlocked' : 'Locked'}
                  </div>
                </div>

                <div style={s.cardTitle}>{item.title}</div>
                <div style={s.cardText}>{item.description}</div>

                <div style={s.progressMiniTop}>
                  <div style={s.progressMiniLabel}>Прогресс</div>
                  <div style={s.progressMiniValue}>
                    {Math.min(item.progress, item.goal)} / {item.goal}
                  </div>
                </div>

                <div style={s.track}>
                  <div
                    style={{
                      ...s.fill,
                      width: `${progressPercent}%`,
                      background: item.unlocked ? item.color : '#CBD5E1'
                    }}
                  />
                </div>

                <div style={s.footerRow}>
                  <div style={{ ...s.footerPill, color: item.color }}>
                    {progressPercent}%
                  </div>

                  <div style={s.unlockDate}>
                    {item.unlockedAt
                      ? `Ашылды: ${new Date(item.unlockedAt).toLocaleDateString()}`
                      : 'Әлі ашылмаған'}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '24px 20px 40px'
  },

  wrap: {
    maxWidth: 1180,
    margin: '0 auto'
  },

  loadingPage: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  loader: {
    width: 52,
    height: 52,
    border: '4px solid #0EA5E9',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite'
  },

  loadingText: {
    color: '#64748B',
    fontSize: 15,
    margin: 0
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: 20,
    background: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)',
    border: '1px solid #E2E8F0',
    borderRadius: 28,
    padding: 28,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
    marginBottom: 20
  },

  heroLeft: {},

  heroRight: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    alignContent: 'start'
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '9px 13px',
    borderRadius: 999,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 800,
    marginBottom: 16
  },

  heroTitle: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: '-0.03em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 12
  },

  heroText: {
    fontSize: 16,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0
  },

  bigStatCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 22,
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)'
  },

  bigStatNumber: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: 1.1,
    color: '#0F172A'
  },

  bigStatLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6
  },

  progressCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: 20,
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
    marginBottom: 20
  },

  progressTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12
  },

  progressTitle: {
    fontSize: 18,
    fontWeight: 800,
    color: '#0F172A'
  },

  progressValue: {
    fontSize: 14,
    fontWeight: 800,
    color: '#0EA5E9'
  },

  track: {
    width: '100%',
    height: 10,
    borderRadius: 999,
    background: '#E2E8F0',
    overflow: 'hidden'
  },

  fill: {
    height: '100%',
    borderRadius: 999,
    background: '#0EA5E9'
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16
  },

  card: {
    background: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 10px 30px rgba(15,23,42,0.05)'
  },

  cardTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 14
  },

  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  statusBadge: {
    padding: '8px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800
  },

  cardTitle: {
    fontSize: 21,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 8
  },

  cardText: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#64748B',
    marginBottom: 16
  },

  progressMiniTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginBottom: 10
  },

  progressMiniLabel: {
    fontSize: 13,
    fontWeight: 700,
    color: '#64748B'
  },

  progressMiniValue: {
    fontSize: 13,
    fontWeight: 800,
    color: '#0F172A'
  },

  footerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 10,
    marginTop: 14
  },

  footerPill: {
    fontSize: 13,
    fontWeight: 800
  },

  unlockDate: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'right'
  }
}