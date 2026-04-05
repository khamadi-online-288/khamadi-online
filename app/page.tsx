'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  full_name?: string | null
  student_code?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
}

type UserStats = {
  xp?: number | null
  level?: number | null
  streak?: number | null
}

type SimulatorResult = {
  id: number
  total_score?: number | null
}

type StudyPlan = {
  id: number
  day_label?: string | null
  subject?: string | null
  topic?: string | null
  status?: string | null
}

function getDaysToUBT() {
  const target = new Date('2026-06-20T00:00:00')
  const now = new Date()
  const diff = target.getTime() - now.getTime()
  return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)))
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [simResults, setSimResults] = useState<SimulatorResult[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    try {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, student_code, profile_subject_1, profile_subject_2')
        .eq('id', user.id)
        .limit(1)

      setProfile((profileRows?.[0] as Profile) || null)

      const { data: statsRows } = await supabase
        .from('user_stats')
        .select('xp, level, streak')
        .eq('user_id', user.id)
        .limit(1)

      setStats((statsRows?.[0] as UserStats) || null)

      const { data: simRows } = await supabase
        .from('simulator_results')
        .select('id, total_score')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(6)

      setSimResults((simRows || []) as SimulatorResult[])

      const { data: studyRows } = await supabase
        .from('study_plans')
        .select('id, day_label, subject, topic, status')
        .eq('user_id', user.id)
        .order('id', { ascending: true })
        .limit(4)

      setStudyPlans((studyRows || []) as StudyPlan[])
    } finally {
      setLoading(false)
    }
  }

  const daysLeft = getDaysToUBT()
  const latestScore = simResults.length ? Number(simResults[0].total_score || 0) : 0
  const bestScore = simResults.length
    ? Math.max(...simResults.map((x) => Number(x.total_score || 0)))
    : 0
  const avgScore = simResults.length
    ? Math.round(simResults.reduce((sum, x) => sum + Number(x.total_score || 0), 0) / simResults.length)
    : 0

  const studyDone = studyPlans.filter((x) => x.status === 'done').length
  const studyPercent = studyPlans.length ? Math.round((studyDone / studyPlans.length) * 100) : 0

  const firstName = profile?.full_name?.split(' ')[0] || 'Оқушы'

  const summaryText = useMemo(() => {
    if (latestScore >= 100) return 'Нәтиже жақсы. Енді 120+ деңгейіне тұрақты дайындықпен көтерілуге болады.'
    if (latestScore >= 70) return 'Қарқын бар. Енді әлсіз бөлімдерді жауып, күнделікті темпті сақта.'
    return 'Қазір ең маңыздысы — жүйелілік. ҰБТ симуляторы мен оқу жоспарын қатар ұста.'
  }, [latestScore])

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loader} />
          <p style={s.loadingText}>Dashboard жүктелуде...</p>
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
      <div style={s.hero}>
        <div>
          <div style={s.heroTopRow}>
            <span style={s.heroTag}>Басты бет</span>
            <span style={s.heroTagSoft}>ҰБТ 2026</span>
          </div>

          <h1 style={s.heroTitle}>ҰБТ-ға дейін {daysLeft} күн қалды.</h1>

          <p style={s.heroText}>
            Бүгінгі ең маңызды мақсат — оқу қарқынын жоғалтпай, әлсіз тұстарды жабу және нәтижені тұрақты өсіру.
          </p>

          <div style={s.heroButtons}>
            <a href="/dashboard/simulator" style={s.primaryBtn}>
              ҰБТ симуляторын бастау
            </a>
            <a href="/dashboard/ai-analysis" style={s.secondaryBtn}>
              AI анализді ашу
            </a>
          </div>
        </div>

        <div style={s.planGlass}>
          <div style={s.planTitle}>Бүгінгі оқу жоспары</div>

          {studyPlans.length === 0 ? (
            <div style={s.planEmpty}>Оқу жоспары әлі жасалмаған</div>
          ) : (
            studyPlans.map((item) => (
              <div key={item.id} style={s.planGlassItem}>
                {item.subject} — {item.topic}
              </div>
            ))
          )}
        </div>
      </div>

      <div style={s.statsGrid}>
        <StatCard label="Жалпы прогресс" value={`${studyPercent}%`} sub="Күнделікті жоспар орындалуы" />
        <StatCard label="Соңғы тест" value={latestScore ? `${latestScore} / 140` : '-'} sub="Соңғы симулятор нәтижесі" />
        <StatCard label="Streak" value={`${Number(stats?.streak || 0)} күн`} sub="Тұрақты оқу қарқыны" />
        <StatCard label="Үздік балл" value={bestScore || '-'} sub="Ең жоғары нәтиже" />
      </div>

      <div style={s.bottomGrid}>
        <div style={s.card}>
          <div style={s.cardLabel}>Қысқаша бағыт</div>
          <div style={s.cardBigText}>{summaryText}</div>
          <div style={s.subjectRow}>
            <span style={s.subjectPill}>{profile?.profile_subject_1 || '-'}</span>
            <span style={s.subjectPill}>{profile?.profile_subject_2 || '-'}</span>
          </div>
        </div>

        <div style={s.card}>
          <div style={s.cardLabel}>Жылдам өту</div>
          <div style={s.linkList}>
            <a href="/dashboard/subjects" style={s.linkItem}>Пәндер</a>
            <a href="/dashboard/ai-tutor" style={s.linkItem}>AI тьютор</a>
            <a href="/dashboard/universities" style={s.linkItem}>Университеттер</a>
            <a href="/dashboard/progress" style={s.linkItem}>Прогресс</a>
          </div>
        </div>
      </div>

      <div style={s.footerInfo}>
        <div style={s.footerName}>{firstName}</div>
        <div style={s.footerMeta}>
          XP: {Number(stats?.xp || 0)} · Level: {Number(stats?.level || 1)} · Орташа балл: {avgScore || '-'}
        </div>
      </div>
    </div>
  )
}

function StatCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub: string
}) {
  return (
    <div style={s.statCard}>
      <div style={s.statTop}>{label}</div>
      <div style={s.statValue}>{value}</div>
      <div style={s.statSub}>{sub}</div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {},
  loadingPage: {
    minHeight: '70vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    width: 52,
    height: 52,
    border: '4px solid #0EA5E9',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    margin: '0 auto 16px',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    color: '#64748B',
    fontSize: 15,
    margin: 0,
  },
  hero: {
    display: 'grid',
    gridTemplateColumns: '1.15fr 0.85fr',
    gap: 24,
    padding: 40,
    borderRadius: 34,
    background:
      'linear-gradient(135deg, #0B1120 0%, #111827 42%, #0EA5E9 100%)',
    color: '#FFFFFF',
    boxShadow: '0 30px 60px rgba(2, 8, 23, 0.24)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  heroTopRow: {
    display: 'flex',
    gap: 10,
    marginBottom: 18,
    flexWrap: 'wrap',
  },
  heroTag: {
    padding: '10px 14px',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.02em',
  },
  heroTagSoft: {
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
    border: '1px solid rgba(255,255,255,0.10)',
  },
  heroTitle: {
    fontSize: 58,
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    margin: 0,
    maxWidth: 620,
  },
  heroText: {
    fontSize: 17,
    lineHeight: 1.85,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 18,
    maxWidth: 650,
  },
  heroButtons: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  primaryBtn: {
    minHeight: 52,
    padding: '0 22px',
    borderRadius: 18,
    background: '#FFFFFF',
    color: '#0F172A',
    fontWeight: 900,
    fontSize: 14,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 14px 30px rgba(255,255,255,0.08)',
  },
  secondaryBtn: {
    minHeight: 52,
    padding: '0 22px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontWeight: 800,
    fontSize: 14,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(10px)',
  },
  planGlass: {
    padding: 24,
    borderRadius: 28,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },
  planTitle: {
    fontSize: 18,
    fontWeight: 900,
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
    marginBottom: 4,
  },
  planGlassItem: {
    minHeight: 48,
    padding: '0 16px',
    borderRadius: 16,
    background: 'rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: 700,
    display: 'flex',
    alignItems: 'center',
    lineHeight: 1.5,
  },
  planEmpty: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 14,
    lineHeight: 1.7,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 20,
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 26,
    padding: 24,
    boxShadow: '0 12px 26px rgba(15,23,42,0.04)',
  },
  statTop: {
    fontSize: 12,
    fontWeight: 800,
    color: '#64748B',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 44,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#0F172A',
    marginBottom: 10,
  },
  statSub: {
    fontSize: 13,
    lineHeight: 1.7,
    color: '#64748B',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 16,
    marginBottom: 16,
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 12,
  },
  cardBigText: {
    fontSize: 22,
    lineHeight: 1.45,
    fontWeight: 800,
    letterSpacing: '-0.03em',
    color: '#0F172A',
    marginBottom: 18,
  },
  subjectRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  subjectPill: {
    padding: '10px 14px',
    borderRadius: 999,
    background: '#F8FBFF',
    border: '1px solid #DDEEF8',
    color: '#0369A1',
    fontSize: 13,
    fontWeight: 800,
  },
  linkList: {
    display: 'grid',
    gap: 10,
  },
  linkItem: {
    minHeight: 52,
    padding: '0 16px',
    borderRadius: 18,
    border: '1px solid #EEF2F7',
    background: '#FAFCFE',
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 800,
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
  },
  footerInfo: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 24,
    padding: 20,
    boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
  },
  footerName: {
    fontSize: 18,
    fontWeight: 900,
    color: '#0F172A',
    letterSpacing: '-0.02em',
    marginBottom: 6,
  },
  footerMeta: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.8,
  },
}