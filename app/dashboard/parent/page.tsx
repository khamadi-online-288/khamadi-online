'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function ParentDashboardPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [student, setStudent] = useState<StudentProfile | null>(null)
  const [stats, setStats] = useState<UserStats | null>(null)
  const [simResults, setSimResults] = useState<SimulatorResult[]>([])
  const [studyPlans, setStudyPlans] = useState<StudyPlan[]>([])

  useEffect(() => { loadParentCabinet() }, [])

  async function loadParentCabinet() {
    try {
      setLoading(true)
      setError('')

      const { data: { user }, error: authError } = await supabase.auth.getUser()
      if (authError || !user) { setError('Қолданушы табылмады'); return }

      const { data: linkRows, error: linksError } = await supabase
        .from('parent_links')
        .select('student_id, student_code')
        .eq('parent_id', user.id)
        .limit(1)

      if (linksError) { setError('Parent link жүктелмеді'); return }
      if (!linkRows || linkRows.length === 0) { setError('Балаға байланыс табылмады'); return }

      const studentId = linkRows[0].student_id

      const { data: studentRows, error: studentError } = await supabase
        .from('profiles')
        .select('id, full_name, student_code, profile_subject_1, profile_subject_2')
        .eq('id', studentId)
        .limit(1)

      if (studentError) { setError('Оқушы профилі жүктелмеді'); return }
      if (!studentRows || studentRows.length === 0) { setError('Оқушы профилі табылмады'); return }

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
  const avgScore = simResults.length > 0
    ? Math.round(simResults.reduce((sum, x) => sum + Number(x.total_score || 0), 0) / simResults.length)
    : 0
  const predictedScore = Math.min(140, Math.round((latestScore * 1.15 + bestScore * 0.85) / 2))
  const studyDone = studyPlans.filter((x) => x.status === 'done').length
  const studyPercent = studyPlans.length > 0 ? Math.round((studyDone / studyPlans.length) * 100) : 0

  const weakSubjects = useMemo(() => {
    const list: string[] = []
    if (latestScore < 90 && student?.profile_subject_1) list.push(student.profile_subject_1)
    if (latestScore < 80 && student?.profile_subject_2) list.push(student.profile_subject_2)
    return [...new Set(list)]
  }, [latestScore, student])

  const recommendation = useMemo(() => {
    if (latestScore >= 100) return 'Балаңыздың нәтижесі жақсы. Енді тұрақты қайталау мен study plan орындауды жалғастыру керек.'
    if (latestScore >= 70) return 'Нәтиже орташа деңгейде. Әлсіз пәндерді күшейтіп, күн сайын жоспармен жұмыс істеген дұрыс.'
    return 'Қазір дайындықты күшейту қажет. Күнделікті жоспар, жиі симулятор және әлсіз тақырыптарды қайталау маңызды.'
  }, [latestScore])

  const chartData = [...simResults].reverse().map((item) => Number(item.total_score || 0))
  const maxChart = Math.max(140, ...chartData, 1)

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Parent cabinet жүктелуде...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', padding: 24, background: '#fef2f2', borderRadius: 24, border: '1px solid #fecaca' }}>
          <p style={{ color: '#dc2626', fontSize: 15, fontWeight: 700, margin: 0 }}>{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Parent Cabinet
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Ата-ана кабинеті
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Балаңыздың нәтижесі, оқу қарқыны және дайындық сапасы осында көрсетіледі.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          borderRadius: 30, padding: 28, marginBottom: 20,
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
          boxShadow: '0 24px 56px rgba(12,74,110,0.22)',
          display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 24,
        }}
      >
        <div>
          <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.14)', fontSize: 12, fontWeight: 900, color: '#fff', marginBottom: 14, letterSpacing: '0.06em' }}>
            PARENT CABINET
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, color: '#fff', letterSpacing: '-0.05em', margin: '0 0 12px', lineHeight: 1.1 }}>
            Ата-ана кабинеті
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
            Балаңыздың нәтижесі, оқу қарқыны және дайындық сапасы осында көрсетіледі.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
          {[{ num: String(latestScore), label: 'Соңғы балл' }, { num: String(bestScore), label: 'Ең жоғары балл' }].map((s, i) => (
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

      {/* UBT prediction */}
      <motion.div
        {...fadeUp(0.1)}
        style={{
          borderRadius: 24,
          padding: '22px 28px',
          marginBottom: 20,
          background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
          color: '#fff',
          textAlign: 'center',
          boxShadow: '0 18px 40px rgba(14,165,233,0.22)',
        }}
      >
        <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 6, fontWeight: 700 }}>ҰБТ болжамы</div>
        <div style={{ fontSize: 52, fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.05em' }}>{predictedScore}</div>
        <div style={{ fontSize: 13, opacity: 0.85, fontWeight: 700 }}>мүмкін балл</div>
      </motion.div>

      {/* Student card */}
      <motion.div
        {...fadeUp(0.14)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 22,
          boxShadow: '0 10px 28px rgba(14,165,233,0.07)',
          marginBottom: 20,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>
              {student?.full_name || 'Оқушы'}
            </div>
            <div style={{ fontSize: 13, color: '#64748b', marginTop: 4, fontWeight: 600 }}>
              Код: {student?.student_code || '-'}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[student?.profile_subject_1, student?.profile_subject_2].filter(Boolean).map((subj) => (
              <div key={subj} style={{ padding: '9px 14px', borderRadius: 999, background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', fontSize: 13, fontWeight: 800 }}>
                {subj}
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* 4 stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
        {[
          { icon: '⭐', num: String(Number(stats?.xp || 0)), label: 'XP' },
          { icon: '📈', num: `Lv. ${Number(stats?.level || 1)}`, label: 'Деңгей' },
          { icon: '🔥', num: String(Number(stats?.streak || 0)), label: 'Streak' },
          { icon: '✅', num: `${studyPercent}%`, label: 'Study Plan' },
        ].map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -3, boxShadow: '0 16px 32px rgba(14,165,233,0.14)' }}
            style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 22, padding: 20, textAlign: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.07)', transition: 'box-shadow 0.2s' }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{s.icon}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', marginBottom: 4, letterSpacing: '-0.03em' }}>{s.num}</div>
            <div style={{ fontSize: 12, color: '#64748b', fontWeight: 700 }}>{s.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Simulator results + Study plan */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <motion.div {...fadeUp(0.24)} style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 18px', letterSpacing: '-0.03em' }}>Соңғы симуляторлар</h2>
          {simResults.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: 0 }}>Әзірше симулятор нәтижесі жоқ</p>
          ) : (
            simResults.map((item, index) => (
              <div
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: index === simResults.length - 1 ? 'none' : '1px solid rgba(14,165,233,0.08)' }}
              >
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e', marginBottom: 3 }}>Симулятор #{item.id}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>
                    {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Күні жоқ'}
                  </div>
                </div>
                <div style={{ minWidth: 52, padding: '7px 12px', borderRadius: 999, background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1', fontSize: 14, fontWeight: 900, textAlign: 'center' }}>
                  {Number(item.total_score || 0)}
                </div>
              </div>
            ))
          )}
        </motion.div>

        <motion.div {...fadeUp(0.28)} style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 18px', letterSpacing: '-0.03em' }}>Оқу жоспары</h2>
          {studyPlans.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: 0 }}>Study plan әлі құрылмаған</p>
          ) : (
            studyPlans.map((item, index) => (
              <div
                key={item.id}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '13px 0', borderBottom: index === studyPlans.length - 1 ? 'none' : '1px solid rgba(14,165,233,0.08)' }}
              >
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#0c4a6e', marginBottom: 2 }}>{item.day_label} — {item.subject}</div>
                  <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.topic}</div>
                </div>
                <div style={{
                  padding: '6px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800,
                  background: item.status === 'done' ? '#f0fdf4' : '#eff6ff',
                  border: item.status === 'done' ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                  color: item.status === 'done' ? '#166534' : '#1d4ed8',
                }}>
                  {item.status === 'done' ? 'Done' : 'Todo'}
                </div>
              </div>
            ))
          )}
        </motion.div>
      </div>

      {/* Chart + Weak subjects */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <motion.div {...fadeUp(0.3)} style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 18px', letterSpacing: '-0.03em' }}>Апталық прогресс</h2>
          {chartData.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, margin: 0 }}>График үшін дерек жоқ</p>
          ) : (
            <>
              <div style={{ height: 200, display: 'flex', alignItems: 'flex-end', gap: 10, paddingTop: 10 }}>
                {chartData.map((value, index) => (
                  <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', gap: 6, height: '100%' }}>
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: Math.max(14, (value / maxChart) * 180) }}
                      transition={{ duration: 0.6, delay: 0.35 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                      style={{ width: '100%', maxWidth: 48, borderRadius: 12, background: 'linear-gradient(180deg, #38bdf8, #0ea5e9)', boxShadow: '0 8px 18px rgba(14,165,233,0.18)' }}
                    />
                    <div style={{ fontSize: 12, fontWeight: 800, color: '#0c4a6e' }}>{value}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>#{index + 1}</div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 14, fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                Соңғы {chartData.length} нәтижеге негізделген прогресс
              </p>
            </>
          )}
        </motion.div>

        <motion.div {...fadeUp(0.34)} style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}>
          <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 18px', letterSpacing: '-0.03em' }}>Әлсіз пәндер</h2>
          {weakSubjects.length === 0 ? (
            <p style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>Әзірше әлсіз пән байқалмады</p>
          ) : (
            weakSubjects.map((subject, i) => (
              <div key={i} style={{ padding: '10px 0', fontSize: 14, fontWeight: 700, color: '#b45309', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
                ⚠️ {subject}
              </div>
            ))
          )}

          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e', marginBottom: 12, letterSpacing: '-0.02em' }}>Қысқаша қорытынды</div>
            {[
              { label: 'Орташа балл', value: String(avgScore) },
              { label: 'Соңғы балл', value: String(latestScore) },
              { label: 'Ең жоғары балл', value: String(bestScore) },
            ].map((item) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid rgba(14,165,233,0.08)' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e' }}>{item.value}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Recommendation */}
      <motion.div
        {...fadeUp(0.36)}
        style={{
          background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
          border: '1px solid rgba(14,165,233,0.18)',
          borderRadius: 24,
          padding: 22,
          boxShadow: '0 10px 24px rgba(14,165,233,0.08)',
        }}
      >
        <div style={{ fontSize: 16, fontWeight: 900, color: '#0c4a6e', margin: '0 0 10px', letterSpacing: '-0.02em' }}>
          Ата-анаға ұсыныс
        </div>
        <p style={{ fontSize: 14, lineHeight: 1.8, color: '#475569', margin: 0, fontWeight: 600 }}>
          {recommendation}
        </p>
      </motion.div>
    </div>
  )
}
