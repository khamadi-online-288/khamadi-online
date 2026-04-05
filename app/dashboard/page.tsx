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
  created_at?: string | null
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
        .select('id, total_score, created_at')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(8)

      setSimResults((simRows || []) as SimulatorResult[])

      const { data: studyRows } = await supabase
        .from('study_plans')
        .select('id, day_label, subject, topic, status')
        .eq('user_id', user.id)
        .order('id', { ascending: true })
        .limit(5)

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
    ? Math.round(
        simResults.reduce((sum, x) => sum + Number(x.total_score || 0), 0) /
          simResults.length
      )
    : 0

  const studyDone = studyPlans.filter((x) => x.status === 'done').length
  const studyPercent = studyPlans.length
    ? Math.round((studyDone / studyPlans.length) * 100)
    : 0

  const firstName = profile?.full_name?.trim()?.split(' ')[0] || 'Оқушы'

  const chartData = [...simResults]
    .reverse()
    .map((item) => Number(item.total_score || 0))

  const recommendation = useMemo(() => {
    if (latestScore >= 110) {
      return 'Нәтиже өте жақсы. Қарқынды түсірмей, қателерді дәл талдап, 120+ деңгейіне бағыт ұста.'
    }
    if (latestScore >= 90) {
      return 'Деңгей жақсы. Енді әлсіз бөлімдерді жабу мен уақытқа жұмыс істеу маңызды.'
    }
    if (latestScore >= 70) {
      return 'Орташа нәтиже. Күнделікті жоспарды қатаң ұстап, ҰБТ симуляторын жиі тапсыру керек.'
    }
    return 'Қазір негізгі мақсат — жүйелілік. Сабақ, mini test, AI анализ және симуляторды бірге қолдан.'
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
        <div style={s.heroContent}>
          <div style={s.heroTags}>
            <span style={s.heroTagWhite}>Басты бет</span>
            <span style={s.heroTagGlass}>ҰБТ 2026</span>
          </div>

          <h1 style={s.heroTitle}>
            {firstName}, ҰБТ-ға дейін {daysLeft} күн қалды.
          </h1>

          <p style={s.heroText}>
            Бүгінгі басты мақсат — дайындық темпін жоғалтпау, әлсіз тұстарды жабу және
            нәтижені күн сайын аздап өсіру.
          </p>

          <div style={s.heroActions}>
            <a href="/dashboard/simulator" style={s.heroPrimaryButton}>
              ҰБТ симуляторын бастау
            </a>
            <a href="/dashboard/ai-analysis" style={s.heroSecondaryButton}>
              AI анализ ашу
            </a>
          </div>

          <div style={s.heroBottomStats}>
            <div style={s.heroMiniStat}>
              <div style={s.heroMiniLabel}>Соңғы балл</div>
              <div style={s.heroMiniValue}>{latestScore || '-'}</div>
            </div>

            <div style={s.heroMiniDivider} />

            <div style={s.heroMiniStat}>
              <div style={s.heroMiniLabel}>Үздік балл</div>
              <div style={s.heroMiniValue}>{bestScore || '-'}</div>
            </div>

            <div style={s.heroMiniDivider} />

            <div style={s.heroMiniStat}>
              <div style={s.heroMiniLabel}>Орташа</div>
              <div style={s.heroMiniValue}>{avgScore || '-'}</div>
            </div>
          </div>
        </div>

        <div style={s.heroSide}>
          <div style={s.heroSideTitle}>Бүгінгі оқу жоспары</div>

          {studyPlans.length === 0 ? (
            <div style={s.heroPlanEmpty}>Оқу жоспары әлі құрылмаған</div>
          ) : (
            studyPlans.map((item) => (
              <div key={item.id} style={s.heroPlanItem}>
                <div style={s.heroPlanMain}>
                  {item.subject || 'Пән'} — {item.topic || 'Тақырып'}
                </div>
                <div style={s.heroPlanMeta}>
                  {item.day_label || 'Күн'} · {item.status === 'done' ? 'Done' : 'Todo'}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div style={s.metricsGrid}>
        <MetricCard label="XP" value={Number(stats?.xp || 0)} sub="Жалпы тәжірибе ұпайы" />
        <MetricCard label="Level" value={Number(stats?.level || 1)} sub="Ағымдағы деңгей" />
        <MetricCard label="Streak" value={`${Number(stats?.streak || 0)} күн`} sub="Үздіксіз оқу қарқыны" />
        <MetricCard label="Орындалуы" value={`${studyPercent}%`} sub="Жеке оқу жоспары" />
      </div>

      <div style={s.contentGrid}>
        <div style={s.mainCard}>
          <div style={s.cardHead}>
            <div>
              <div style={s.cardLabel}>Прогресс</div>
              <div style={s.cardTitle}>Соңғы нәтижелер динамикасы</div>
            </div>

            <a href="/dashboard/progress" style={s.cardLink}>
              Толық прогресс
            </a>
          </div>

          {chartData.length === 0 ? (
            <div style={s.emptyState}>Әзірше симулятор тапсырылмаған</div>
          ) : (
            <div style={s.chartWrap}>
              {chartData.map((value, index) => (
                <div key={index} style={s.chartCol}>
                  <div style={s.chartValue}>{value}</div>
                  <div
                    style={{
                      ...s.chartBar,
                      height: `${Math.max(18, (value / 140) * 220)}px`,
                    }}
                  />
                  <div style={s.chartLabel}>#{index + 1}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={s.rightStack}>
          <div style={s.sideCard}>
            <div style={s.cardLabel}>Жылдам өту</div>
            <div style={s.sideLinks}>
              <a href="/dashboard/subjects" style={s.sideLink}>Пәндер</a>
              <a href="/dashboard/ai-tutor" style={s.sideLink}>AI тьютор</a>
              <a href="/dashboard/universities" style={s.sideLink}>Университеттер</a>
              <a href="/dashboard/leaderboard" style={s.sideLink}>Рейтинг</a>
            </div>
          </div>

          <div style={s.sideCardDark}>
            <div style={s.darkLabel}>Фокус</div>
            <div style={s.darkTitle}>Бүгінгі міндет — тұрақтылық.</div>
            <div style={s.darkText}>{recommendation}</div>
          </div>
        </div>
      </div>

      <div style={s.bottomGrid}>
        <div style={s.summaryCard}>
          <div style={s.cardLabel}>Оқушы профилі</div>
          <div style={s.profileName}>{profile?.full_name || 'Оқушы'}</div>
          <div style={s.profileMeta}>Код: {profile?.student_code || '-'}</div>

          <div style={s.subjectsRow}>
            <span style={s.subjectPill}>{profile?.profile_subject_1 || '-'}</span>
            <span style={s.subjectPill}>{profile?.profile_subject_2 || '-'}</span>
          </div>
        </div>

        <div style={s.summaryCard}>
          <div style={s.cardLabel}>Жылдам шолу</div>
          <div style={s.summaryBig}>{latestScore || '-'}</div>
          <div style={s.summaryMuted}>Қазіргі ең өзекті нәтиже</div>
        </div>

        <div style={s.summaryCard}>
          <div style={s.cardLabel}>Мақсат</div>
          <div style={s.summaryBig}>120+</div>
          <div style={s.summaryMuted}>Жоғары гранттық нәтиже бағыты</div>
        </div>
      </div>
    </div>
  )
}

function MetricCard({
  label,
  value,
  sub,
}: {
  label: string
  value: string | number
  sub: string
}) {
  return (
    <div style={s.metricCard}>
      <div style={s.metricLabel}>{label}</div>
      <div style={s.metricValue}>{value}</div>
      <div style={s.metricSub}>{sub}</div>
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
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 24,
    padding: 40,
    borderRadius: 36,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.22), transparent 26%), linear-gradient(135deg, #050816 0%, #0B1120 42%, #102A43 70%, #0EA5E9 100%)',
    color: '#FFFFFF',
    boxShadow: '0 30px 60px rgba(2,8,23,0.24)',
    border: '1px solid rgba(255,255,255,0.06)',
    marginBottom: 20,
  },
  heroContent: {},
  heroTags: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  heroTagWhite: {
    padding: '10px 14px',
    borderRadius: 999,
    background: '#FFFFFF',
    color: '#0F172A',
    fontSize: 12,
    fontWeight: 900,
    letterSpacing: '0.02em',
  },
  heroTagGlass: {
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(255,255,255,0.10)',
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 800,
    border: '1px solid rgba(255,255,255,0.10)',
  },
  heroTitle: {
    fontSize: 60,
    lineHeight: 1.02,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    margin: 0,
    maxWidth: 700,
  },
  heroText: {
    fontSize: 17,
    lineHeight: 1.85,
    color: 'rgba(255,255,255,0.78)',
    marginTop: 18,
    maxWidth: 680,
  },
  heroActions: {
    display: 'flex',
    gap: 12,
    marginTop: 24,
    flexWrap: 'wrap',
  },
  heroPrimaryButton: {
    minHeight: 54,
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
  heroSecondaryButton: {
    minHeight: 54,
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
  heroBottomStats: {
    display: 'flex',
    gap: 20,
    alignItems: 'center',
    marginTop: 28,
    flexWrap: 'wrap',
  },
  heroMiniStat: {
    minWidth: 110,
  },
  heroMiniLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.58)',
    fontWeight: 700,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  },
  heroMiniValue: {
    fontSize: 28,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    color: '#FFFFFF',
  },
  heroMiniDivider: {
    width: 1,
    height: 44,
    background: 'rgba(255,255,255,0.12)',
  },
  heroSide: {
    padding: 24,
    borderRadius: 30,
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.10)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
    backdropFilter: 'blur(14px)',
    display: 'flex',
    flexDirection: 'column',
    gap: 12,
    justifyContent: 'center',
  },
  heroSideTitle: {
    fontSize: 20,
    fontWeight: 900,
    color: '#FFFFFF',
    letterSpacing: '-0.02em',
    marginBottom: 4,
  },
  heroPlanItem: {
    padding: '14px 16px',
    borderRadius: 18,
    background: 'rgba(255,255,255,0.10)',
    border: '1px solid rgba(255,255,255,0.06)',
  },
  heroPlanMain: {
    fontSize: 15,
    fontWeight: 800,
    color: '#FFFFFF',
    lineHeight: 1.5,
    marginBottom: 4,
  },
  heroPlanMeta: {
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.58)',
  },
  heroPlanEmpty: {
    color: 'rgba(255,255,255,0.70)',
    fontSize: 14,
    lineHeight: 1.7,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 20,
  },
  metricCard: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 12px 26px rgba(15,23,42,0.04)',
  },
  metricLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#64748B',
    letterSpacing: '0.04em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  metricValue: {
    fontSize: 44,
    lineHeight: 1,
    fontWeight: 900,
    letterSpacing: '-0.05em',
    color: '#0F172A',
    marginBottom: 10,
  },
  metricSub: {
    fontSize: 13,
    lineHeight: 1.7,
    color: '#64748B',
  },
  contentGrid: {
    display: 'grid',
    gridTemplateColumns: '1.1fr 0.9fr',
    gap: 16,
    marginBottom: 16,
  },
  mainCard: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 30,
    padding: 26,
    boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
  },
  cardHead: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 16,
    alignItems: 'flex-start',
    marginBottom: 18,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#64748B',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  cardTitle: {
    fontSize: 28,
    lineHeight: 1.15,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    color: '#0F172A',
  },
  cardLink: {
    textDecoration: 'none',
    minHeight: 42,
    padding: '0 16px',
    borderRadius: 14,
    border: '1px solid #E2E8F0',
    background: '#FAFCFE',
    color: '#0F172A',
    fontSize: 14,
    fontWeight: 800,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    whiteSpace: 'nowrap',
  },
  emptyState: {
    minHeight: 260,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748B',
    fontSize: 15,
  },
  chartWrap: {
    minHeight: 320,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 14,
    paddingTop: 10,
  },
  chartCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    minWidth: 0,
  },
  chartValue: {
    fontSize: 12,
    fontWeight: 800,
    color: '#0F172A',
  },
  chartBar: {
    width: '100%',
    maxWidth: 56,
    borderRadius: 18,
    background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)',
    boxShadow: '0 12px 24px rgba(14,165,233,0.16)',
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  rightStack: {
    display: 'grid',
    gap: 16,
  },
  sideCard: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 30,
    padding: 24,
    boxShadow: '0 12px 30px rgba(15,23,42,0.04)',
  },
  sideLinks: {
    display: 'grid',
    gap: 10,
    marginTop: 8,
  },
  sideLink: {
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
  sideCardDark: {
    borderRadius: 30,
    padding: 24,
    background: 'linear-gradient(135deg, #0F172A 0%, #111827 100%)',
    color: '#FFFFFF',
    boxShadow: '0 18px 34px rgba(15,23,42,0.14)',
  },
  darkLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: 'rgba(255,255,255,0.56)',
    letterSpacing: '0.05em',
    textTransform: 'uppercase',
    marginBottom: 10,
  },
  darkTitle: {
    fontSize: 26,
    lineHeight: 1.15,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    marginBottom: 12,
  },
  darkText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: 'rgba(255,255,255,0.72)',
  },
  bottomGrid: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.9fr 0.9fr',
    gap: 16,
  },
  summaryCard: {
    background: '#FFFFFF',
    border: '1px solid #EEF2F7',
    borderRadius: 28,
    padding: 24,
    boxShadow: '0 12px 26px rgba(15,23,42,0.04)',
  },
  profileName: {
    fontSize: 26,
    fontWeight: 900,
    lineHeight: 1.15,
    color: '#0F172A',
    letterSpacing: '-0.03em',
    marginBottom: 6,
  },
  profileMeta: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.7,
    marginBottom: 16,
  },
  subjectsRow: {
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
  summaryBig: {
    fontSize: 48,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-0.05em',
    color: '#0F172A',
    marginBottom: 10,
  },
  summaryMuted: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.8,
  },
}