'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type StudentProfile = {
  id: string
  full_name: string | null
  student_code: string | null
  profile_subject_1: string | null
  profile_subject_2: string | null
}

type UserStats = {
  xp: number | null
  level: number | null
  streak: number | null
  longest_streak: number | null
  total_simulators: number | null
  total_study_done: number | null
  total_ai_analysis: number | null
}

type SimulatorResult = {
  id: number
  total_score: number | null
  created_at: string | null
}

type StudyPlan = {
  id: number
  day_label: string | null
  subject: string | null
  topic: string | null
  status: string | null
}

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [simResults, setSimResults] = useState<SimulatorResult[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])

  useEffect(() => {
    loadParentCabinet()
  }, [])

  async function loadParentCabinet() {
    try {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError || !user) {
        setError('Қолданушы табылмады')
        return
      }

      const { data: linkRows, error: linksError } = await supabase
        .from('parent_links')
        .select('student_id, student_code')
        .eq('parent_id', user.id)
        .limit(1)

      if (linksError) {
        setError('Parent link жүктелмеді')
        return
      }

      if (!linkRows || linkRows.length === 0) {
        setError('Балаға байланыс табылмады')
        return
      }

      const studentId = linkRows[0].student_id

      const { data: studentRows, error: studentError } = await supabase
        .from('profiles')
        .select('id, full_name, student_code, profile_subject_1, profile_subject_2')
        .eq('id', studentId)
        .limit(1)

      if (studentError) {
        setError('Оқушы профилі жүктелмеді')
        return
      }

      if (!studentRows || studentRows.length === 0) {
        setError('Оқушы профилі табылмады')
        return
      }

      setStudent(studentRows[0] as StudentProfile)

      const { data: statsData } = await supabase
        .from('user_stats')
        .select('xp, level, streak, longest_streak, total_simulators, total_study_done, total_ai_analysis')
        .eq('user_id', studentId)
        .limit(1)

      setStats(statsData && statsData.length > 0 ? (statsData[0] as UserStats) : null)

      const { data: simData } = await supabase
        .from('simulator_results')
        .select('id, total_score, created_at')
        .eq('user_id', studentId)
        .order('created_at', { ascending: false })
        .limit(7)

      setSimResults((simData || []) as SimulatorResult[])

      const { data: studyData } = await supabase
        .from('study_plans')
        .select('id, day_label, subject, topic, status')
        .eq('user_id', studentId)
        .order('id', { ascending: true })
        .limit(7)

      setStudyPlans((studyData || []) as StudyPlan[])
    } catch (e) {
      console.error(e)
      setError('Қате орын алды')
    } finally {
      setLoading(false)
    }
  }

  const latestScore = simResults.length > 0 ? Number(simResults[0].total_score || 0) : 0
  const bestScore = simResults.length > 0 ? Math.max(...simResults.map((x) => Number(x.total_score || 0))) : 0
  const avgScore =
    simResults.length > 0
      ? Math.round(
          simResults.reduce((sum, x) => sum + Number(x.total_score || 0), 0) / simResults.length
        )
      : 0

  const predictedScore = Math.min(
    140,
    Math.round((latestScore * 1.15 + bestScore * 0.85) / 2)
  )

  const studyDone = studyPlans.filter((x) => x.status === 'done').length
  const studyPercent = studyPlans.length > 0 ? Math.round((studyDone / studyPlans.length) * 100) : 0

  const weakSubjects = useMemo(() => {
    const list: string[] = []
    if (latestScore < 90 && student?.profile_subject_1) list.push(student.profile_subject_1)
    if (latestScore < 80 && student?.profile_subject_2) list.push(student.profile_subject_2)
    return [...new Set(list)]
  }, [latestScore, student])

  const recommendation = useMemo(() => {
    if (latestScore >= 100) {
      return 'Балаңыздың нәтижесі жақсы. Енді тұрақты қайталау мен study plan орындауды жалғастыру керек.'
    }
    if (latestScore >= 70) {
      return 'Нәтиже орташа деңгейде. Әлсіз пәндерді күшейтіп, күн сайын жоспармен жұмыс істеген дұрыс.'
    }
    return 'Қазір дайындықты күшейту қажет. Күнделікті жоспар, жиі симулятор және әлсіз тақырыптарды қайталау маңызды.'
  }, [latestScore])

  const chartData = [...simResults]
    .reverse()
    .map((item) => Number(item.total_score || 0))

  const maxChart = Math.max(140, ...chartData, 1)

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={{ textAlign: 'center' }}>
          <div style={s.loader} />
          <p style={s.loadingText}>Parent cabinet жүктелуде...</p>
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

  if (error) {
    return (
      <div style={s.loadingPage}>
        <p style={{ ...s.loadingText, color: '#DC2626' }}>{error}</p>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badge}>PARENT CABINET</div>
            <h1 style={s.heroTitle}>Ата-ана кабинеті</h1>
            <p style={s.heroText}>
              Балаңыздың нәтижесі, оқу қарқыны және дайындық сапасы осында көрсетіледі.
            </p>
          </div>

          <div style={s.heroRight}>
            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>{latestScore}</div>
              <div style={s.bigStatLabel}>Соңғы балл</div>
            </div>

            <div style={s.bigStatCard}>
              <div style={s.bigStatNumber}>{bestScore}</div>
              <div style={s.bigStatLabel}>Ең жоғары балл</div>
            </div>
          </div>
        </div>

        <div style={s.prediction}>
          <div style={s.predictionTitle}>ҰБТ болжамы</div>
          <div style={s.predictionScore}>{predictedScore}</div>
          <div style={s.predictionLabel}>мүмкін балл</div>
        </div>

        <div style={s.studentCard}>
          <div style={s.studentTop}>
            <div>
              <div style={s.studentName}>{student?.full_name || 'Оқушы'}</div>
              <div style={s.studentMeta}>Код: {student?.student_code || '-'}</div>
            </div>

            <div style={s.subjectsBox}>
              <div style={s.subjectPill}>{student?.profile_subject_1 || '-'}</div>
              <div style={s.subjectPill}>{student?.profile_subject_2 || '-'}</div>
            </div>
          </div>
        </div>

        <div style={s.statsGrid}>
          <div style={s.statCard}>
            <div style={s.statIcon}>⭐</div>
            <div style={s.statNumber}>{Number(stats?.xp || 0)}</div>
            <div style={s.statLabel}>XP</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>📈</div>
            <div style={s.statNumber}>Lv. {Number(stats?.level || 1)}</div>
            <div style={s.statLabel}>Деңгей</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>🔥</div>
            <div style={s.statNumber}>{Number(stats?.streak || 0)}</div>
            <div style={s.statLabel}>Streak</div>
          </div>

          <div style={s.statCard}>
            <div style={s.statIcon}>✅</div>
            <div style={s.statNumber}>{studyPercent}%</div>
            <div style={s.statLabel}>Study Plan</div>
          </div>
        </div>

        <div style={s.mainGrid}>
          <div style={s.card}>
            <h2 style={s.cardTitle}>Соңғы симуляторлар</h2>

            {simResults.length === 0 ? (
              <p style={s.emptyText}>Әзірше симулятор нәтижесі жоқ</p>
            ) : (
              simResults.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    ...s.row,
                    borderBottom: index === simResults.length - 1 ? 'none' : '1px solid #EEF2F7',
                  }}
                >
                  <div>
                    <div style={s.rowTitle}>Симулятор #{item.id}</div>
                    <div style={s.rowMeta}>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString()
                        : 'Күні жоқ'}
                    </div>
                  </div>

                  <div style={s.scorePill}>{Number(item.total_score || 0)}</div>
                </div>
              ))
            )}
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Оқу жоспары</h2>

            {studyPlans.length === 0 ? (
              <p style={s.emptyText}>Study plan әлі құрылмаған</p>
            ) : (
              studyPlans.map((item, index) => (
                <div
                  key={item.id}
                  style={{
                    ...s.row,
                    borderBottom: index === studyPlans.length - 1 ? 'none' : '1px solid #EEF2F7',
                  }}
                >
                  <div>
                    <div style={s.rowTitle}>
                      {item.day_label} — {item.subject}
                    </div>
                    <div style={s.rowMeta}>{item.topic}</div>
                  </div>

                  <div
                    style={{
                      ...s.statusBadge,
                      background: item.status === 'done' ? '#F0FDF4' : '#EFF6FF',
                      border: item.status === 'done' ? '1px solid #BBF7D0' : '1px solid #BFDBFE',
                      color: item.status === 'done' ? '#166534' : '#1D4ED8',
                    }}
                  >
                    {item.status === 'done' ? 'Done' : 'Todo'}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div style={s.mainGrid}>
          <div style={s.card}>
            <h2 style={s.cardTitle}>Апталық прогресс</h2>

            {chartData.length === 0 ? (
              <p style={s.emptyText}>График үшін дерек жоқ</p>
            ) : (
              <>
                <div style={s.chartWrap}>
                  {chartData.map((value, index) => (
                    <div key={index} style={s.chartCol}>
                      <div
                        style={{
                          ...s.chartBar,
                          height: `${Math.max(14, (value / maxChart) * 220)}px`,
                        }}
                      />
                      <div style={s.chartScore}>{value}</div>
                      <div style={s.chartLabel}>#{index + 1}</div>
                    </div>
                  ))}
                </div>

                <p style={s.chartHint}>Соңғы {chartData.length} нәтижеге негізделген прогресс</p>
              </>
            )}
          </div>

          <div style={s.card}>
            <h2 style={s.cardTitle}>Әлсіз пәндер</h2>

            {weakSubjects.length === 0 ? (
              <p style={s.emptyText}>Әзірге әлсіз пән байқалмады</p>
            ) : (
              weakSubjects.map((subject, index) => (
                <div key={index} style={s.weakRow}>
                  ⚠️ {subject}
                </div>
              ))
            )}

            <div style={{ height: 20 }} />

            <h2 style={{ ...s.cardTitle, fontSize: 20, marginBottom: 12 }}>Қысқаша қорытынды</h2>
            <p style={s.infoText}>
              Орташа балл: <strong>{avgScore}</strong>
              <br />
              Соңғы балл: <strong>{latestScore}</strong>
              <br />
              Ең жоғары балл: <strong>{bestScore}</strong>
            </p>
          </div>
        </div>

        <div style={s.infoCard}>
          <h3 style={s.infoTitle}>Ата-анаға ұсыныс</h3>
          <p style={s.infoText}>{recommendation}</p>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '24px 20px 40px',
  },
  wrap: {
    maxWidth: 1180,
    margin: '0 auto',
  },
  loadingPage: {
    minHeight: '100vh',
    background: '#F8FAFC',
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
    marginBottom: 20,
  },
  heroLeft: {},
  heroRight: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
    alignContent: 'start',
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
    marginBottom: 16,
  },
  heroTitle: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.12,
    letterSpacing: '-0.03em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 12,
  },
  heroText: {
    fontSize: 16,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0,
  },
  bigStatCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 22,
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)',
  },
  bigStatNumber: {
    fontSize: 30,
    fontWeight: 800,
    lineHeight: 1.1,
    color: '#0F172A',
  },
  bigStatLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
  },
  prediction: {
    background: 'linear-gradient(135deg,#38BDF8,#0EA5E9)',
    borderRadius: 22,
    padding: 24,
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
    boxShadow: '0 14px 30px rgba(14,165,233,0.22)',
  },
  predictionTitle: {
    fontSize: 14,
    opacity: 0.9,
    marginBottom: 6,
  },
  predictionScore: {
    fontSize: 48,
    fontWeight: 900,
    lineHeight: 1.1,
  },
  predictionLabel: {
    fontSize: 13,
    opacity: 0.85,
  },
  studentCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 24,
    padding: 22,
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
    marginBottom: 20,
  },
  studentTop: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 14,
    flexWrap: 'wrap',
  },
  studentName: {
    fontSize: 22,
    fontWeight: 800,
    color: '#0F172A',
  },
  studentMeta: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 4,
  },
  subjectsBox: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
  },
  subjectPill: {
    padding: '9px 12px',
    borderRadius: 999,
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    color: '#1D4ED8',
    fontSize: 13,
    fontWeight: 800,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 14,
    marginBottom: 20,
  },
  statCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 20,
    textAlign: 'center',
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 800,
    color: '#0F172A',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  mainGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 20,
  },
  card: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 24,
    padding: 24,
    boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)',
  },
  cardTitle: {
    fontSize: 24,
    fontWeight: 800,
    lineHeight: 1.2,
    color: '#0F172A',
    margin: 0,
    marginBottom: 18,
  },
  row: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    padding: '14px 0',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: 700,
    color: '#0F172A',
    marginBottom: 3,
  },
  rowMeta: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 1.6,
  },
  scorePill: {
    minWidth: 56,
    padding: '8px 12px',
    borderRadius: 999,
    background: '#EFF6FF',
    border: '1px solid #BFDBFE',
    color: '#1D4ED8',
    fontSize: 14,
    fontWeight: 800,
    textAlign: 'center',
  },
  statusBadge: {
    padding: '8px 12px',
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
  },
  infoCard: {
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: 22,
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)',
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: '#0F172A',
    margin: '0 0 10px 0',
  },
  infoText: {
    fontSize: 15,
    lineHeight: 1.75,
    color: '#475569',
    margin: 0,
  },
  emptyText: {
    color: '#64748B',
    fontSize: 15,
    margin: 0,
  },
  weakRow: {
    padding: '10px 0',
    fontSize: 15,
    fontWeight: 700,
    color: '#B45309',
  },
  chartWrap: {
    height: 280,
    display: 'flex',
    alignItems: 'flex-end',
    gap: 12,
    paddingTop: 10,
  },
  chartCol: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    height: '100%',
  },
  chartBar: {
    width: '100%',
    maxWidth: 56,
    borderRadius: 16,
    background: 'linear-gradient(180deg, #38BDF8 0%, #0EA5E9 100%)',
    boxShadow: '0 10px 24px rgba(14,165,233,0.18)',
  },
  chartScore: {
    fontSize: 13,
    fontWeight: 800,
    color: '#0F172A',
  },
  chartLabel: {
    fontSize: 12,
    color: '#64748B',
  },
  chartHint: {
    marginTop: 14,
    fontSize: 13,
    color: '#64748B',
  },
}