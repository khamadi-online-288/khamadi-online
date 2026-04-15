'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] },
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
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const { data: profileRows } = await supabase
        .from('profiles')
        .select('id, full_name, student_code, profile_subject_1, profile_subject_2')
        .eq('id', user.id).limit(1)
      setProfile((profileRows?.[0] as Profile) || null)

      const { data: statsRows } = await supabase
        .from('user_stats').select('xp, level, streak').eq('user_id', user.id).limit(1)
      setStats((statsRows?.[0] as UserStats) || null)

      const { data: simRows } = await supabase
        .from('simulator_results').select('id, total_score, created_at')
        .eq('user_id', user.id).order('created_at', { ascending: false }).limit(8)
      setSimResults((simRows || []) as SimulatorResult[])

      const { data: studyRows } = await supabase
        .from('study_plans').select('id, day_label, subject, topic, status')
        .eq('user_id', user.id).order('id', { ascending: true }).limit(5)
      setStudyPlans((studyRows || []) as StudyPlan[])
    } finally {
      setLoading(false)
    }
  }

  const daysLeft = getDaysToUBT()
  const latestScore = simResults.length ? Number(simResults[0].total_score || 0) : 0
  const bestScore = simResults.length ? Math.max(...simResults.map((x) => Number(x.total_score || 0))) : 0
  const avgScore = simResults.length
    ? Math.round(simResults.reduce((sum, x) => sum + Number(x.total_score || 0), 0) / simResults.length)
    : 0

  const studyDone = studyPlans.filter((x) => x.status === 'done').length
  const studyPercent = studyPlans.length ? Math.round((studyDone / studyPlans.length) * 100) : 0

  const firstName = profile?.full_name?.trim()?.split(' ')[0] || 'Оқушы'
  const chartData = [...simResults].reverse().map((item) => Number(item.total_score || 0))

  const recommendation = useMemo(() => {
    if (latestScore >= 110) return 'Нәтиже өте жақсы. Қарқынды түсірмей, қателерді дәл талдап, 120+ деңгейіне бағыт ұста.'
    if (latestScore >= 90) return 'Деңгей жақсы. Енді әлсіз бөлімдерді жабу мен уақытқа жұмыс істеу маңызды.'
    if (latestScore >= 70) return 'Орташа нәтиже. Күнделікті жоспарды қатаң ұстап, ҰБТ симуляторын жиі тапсыру керек.'
    return 'Қазір негізгі мақсат — жүйелілік. Сабақ, mini test, AI анализ және симуляторды бірге қолдан.'
  }, [latestScore])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 15, fontWeight: 700 }}>Жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Hero banner */}
      <motion.div
        {...fadeUp}
        style={{
          borderRadius: 32,
          padding: '36px 40px',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 50%, #0ea5e9 100%)',
          color: '#ffffff',
          boxShadow: '0 24px 56px rgba(14,165,233,0.22)',
          border: '1px solid rgba(255,255,255,0.08)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: 22,
        }}
      >
        {/* Grid overlay */}
        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '44px 44px', pointerEvents: 'none' }} />
        {/* Glow */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 280, height: 280, borderRadius: 999, background: 'rgba(56,189,248,0.20)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 28, alignItems: 'center', position: 'relative', zIndex: 1 }}>
          <div>
            <div style={{ display: 'flex', gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
              <span style={{ padding: '8px 14px', borderRadius: 999, background: '#ffffff', color: '#0c4a6e', fontSize: 12, fontWeight: 900 }}>Басты бет</span>
              <span style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', color: '#ffffff', fontSize: 12, fontWeight: 800, border: '1px solid rgba(255,255,255,0.12)' }}>ҰБТ 2026</span>
            </div>

            <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1.05, marginBottom: 14, margin: '0 0 14px' }}>
              {firstName}, ҰБТ-ға дейін {daysLeft} күн қалды.
            </h1>

            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(255,255,255,0.78)', maxWidth: 620, marginBottom: 24 }}>
              Бүгінгі мақсат — дайындық темпін сақтап, әлсіз тұстарды жабу.
            </p>

            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <motion.a
                href="/dashboard/simulator"
                whileHover={{ scale: 1.04, boxShadow: '0 16px 36px rgba(255,255,255,0.16)' }}
                whileTap={{ scale: 0.97 }}
                style={{ minHeight: 50, padding: '0 22px', borderRadius: 16, background: '#ffffff', color: '#0c4a6e', fontWeight: 900, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', boxShadow: '0 8px 24px rgba(255,255,255,0.10)' }}
              >
                ҰБТ симуляторы →
              </motion.a>
              <motion.a
                href="/dashboard/ai-analysis"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                style={{ minHeight: 50, padding: '0 22px', borderRadius: 16, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.14)', color: '#ffffff', fontWeight: 800, fontSize: 14, textDecoration: 'none', display: 'inline-flex', alignItems: 'center', backdropFilter: 'blur(10px)' }}
              >
                AI анализ ашу
              </motion.a>
            </div>

            {/* Bottom mini stats */}
            <div style={{ display: 'flex', gap: 24, marginTop: 28, flexWrap: 'wrap' }}>
              {[
                { label: 'Соңғы балл', value: latestScore || '-' },
                { label: 'Үздік балл', value: bestScore || '-' },
                { label: 'Орташа', value: avgScore || '-' },
              ].map((s, i) => (
                <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: i > 0 ? 24 : 0 }}>
                  {i > 0 && <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)', marginRight: 24 }} />}
                  <div>
                    <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 5 }}>{s.label}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, letterSpacing: '-0.04em', lineHeight: 1 }}>{s.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Study plan side */}
          <div style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.10)', borderRadius: 24, padding: 22, backdropFilter: 'blur(14px)' }}>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', marginBottom: 16 }}>Бүгінгі оқу жоспары</div>
            {studyPlans.length === 0 ? (
              <div style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, lineHeight: 1.7 }}>
                Оқу жоспары әлі құрылмаған.{' '}
                <a href="/dashboard/study-plan" style={{ color: '#38bdf8', fontWeight: 800 }}>Жасау →</a>
              </div>
            ) : (
              <div style={{ display: 'grid', gap: 10 }}>
                {studyPlans.map((item) => (
                  <div key={item.id} style={{ padding: '12px 14px', borderRadius: 16, background: 'rgba(255,255,255,0.10)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#ffffff', lineHeight: 1.5, marginBottom: 4 }}>
                      {item.subject || 'Пән'} — {item.topic || 'Тақырып'}
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>
                      {item.day_label || 'Күн'} · {item.status === 'done' ? '✓ Done' : 'Todo'}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Metrics row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 20 }}>
        {[
          { label: 'XP', value: Number(stats?.xp || 0), sub: 'Тәжірибе ұпайы', color: '#0ea5e9' },
          { label: 'Level', value: Number(stats?.level || 1), sub: 'Ағымдағы деңгей', color: '#38bdf8' },
          { label: `${Number(stats?.streak || 0)} күн`, value: null, sub: 'Streak — үздіксіз', color: '#34d399' },
          { label: `${studyPercent}%`, value: null, sub: 'Жоспар орындалуы', color: '#f59e0b' },
        ].map((m, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 20px 44px rgba(14,165,233,0.14)' }}
            style={{
              background: '#ffffff',
              border: '1px solid rgba(14,165,233,0.12)',
              borderRadius: 24,
              padding: '22px 24px',
              boxShadow: '0 8px 28px rgba(14,165,233,0.06)',
              transition: 'box-shadow 0.25s ease',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>{m.sub}</div>
            <div style={{ fontSize: 40, fontWeight: 900, letterSpacing: '-0.05em', color: m.color, lineHeight: 1, marginBottom: 6 }}>{m.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Content grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.15fr 0.85fr', gap: 18, marginBottom: 18 }}>
        {/* Progress chart */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          style={{ background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 28, padding: 26, boxShadow: '0 8px 28px rgba(14,165,233,0.06)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 8 }}>Прогресс</div>
              <div style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', lineHeight: 1.15 }}>Соңғы нәтижелер</div>
            </div>
            <a href="/dashboard/progress" style={{ textDecoration: 'none', padding: '10px 16px', borderRadius: 14, border: '1px solid rgba(14,165,233,0.15)', background: '#f8fafc', color: '#0c4a6e', fontSize: 13, fontWeight: 800 }}>
              Толық →
            </a>
          </div>

          {chartData.length === 0 ? (
            <div style={{ minHeight: 240, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontSize: 15 }}>
              Симулятор тапсырылмаған
            </div>
          ) : (
            <div style={{ minHeight: 280, display: 'flex', alignItems: 'flex-end', gap: 12, paddingTop: 10 }}>
              {chartData.map((value, index) => (
                <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: '#0c4a6e' }}>{value}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: Math.max(18, (value / 140) * 240) }}
                    transition={{ duration: 0.8, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
                    style={{ width: '100%', maxWidth: 52, borderRadius: 16, background: 'linear-gradient(180deg, #38bdf8 0%, #0ea5e9 100%)', boxShadow: '0 8px 20px rgba(14,165,233,0.18)' }}
                  />
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 700 }}>#{index + 1}</div>
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Right stack */}
        <div style={{ display: 'grid', gap: 18 }}>
          {/* Quick links */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            style={{ background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 28, padding: '22px 24px', boxShadow: '0 8px 28px rgba(14,165,233,0.06)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>Жылдам өту</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {[
                { href: '/dashboard/subjects', label: 'Пәндер', icon: '▤' },
                { href: '/dashboard/ai-tutor', label: 'AI тьютор', icon: '✦' },
                { href: '/dashboard/universities', label: 'Университеттер', icon: '◑' },
                { href: '/dashboard/leaderboard', label: 'Рейтинг', icon: '◆' },
              ].map((l) => (
                <motion.a
                  key={l.href}
                  href={l.href}
                  whileHover={{ x: 3 }}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, minHeight: 48, padding: '0 14px', borderRadius: 16, border: '1px solid rgba(14,165,233,0.10)', background: '#f8fafc', color: '#0c4a6e', fontSize: 14, fontWeight: 800, textDecoration: 'none', transition: 'border-color 0.2s' }}
                >
                  <span style={{ fontSize: 16, opacity: 0.7 }}>{l.icon}</span>
                  {l.label}
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Recommendation */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.48 }}
            style={{ borderRadius: 28, padding: '22px 24px', background: 'linear-gradient(135deg, #0c4a6e, #0369a1)', color: '#ffffff', boxShadow: '0 16px 36px rgba(12,74,110,0.18)' }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 10 }}>Фокус</div>
            <div style={{ fontSize: 22, fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>Бүгінгі міндет — тұрақтылық.</div>
            <div style={{ fontSize: 14, lineHeight: 1.85, color: 'rgba(255,255,255,0.72)' }}>{recommendation}</div>
          </motion.div>
        </div>
      </div>

      {/* Bottom summary */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.9fr 0.9fr', gap: 18 }}>
        {[
          {
            label: 'Оқушы профилі',
            content: (
              <>
                <div style={{ fontSize: 24, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', marginBottom: 6 }}>{profile?.full_name || 'Оқушы'}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginBottom: 14 }}>Код: {profile?.student_code || '-'}</div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  {[profile?.profile_subject_1, profile?.profile_subject_2].filter(Boolean).map((s) => (
                    <span key={s} style={{ padding: '8px 14px', borderRadius: 999, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.18)', color: '#0369a1', fontSize: 13, fontWeight: 800 }}>{s}</span>
                  ))}
                </div>
              </>
            ),
          },
          {
            label: 'Ағымдағы нәтиже',
            content: (
              <>
                <div style={{ fontSize: 52, fontWeight: 900, color: '#0ea5e9', letterSpacing: '-0.06em', lineHeight: 1 }}>{latestScore || '-'}</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, lineHeight: 1.7 }}>Соңғы симулятор балы</div>
              </>
            ),
          },
          {
            label: 'Мақсат',
            content: (
              <>
                <div style={{ fontSize: 52, fontWeight: 900, color: '#34d399', letterSpacing: '-0.06em', lineHeight: 1 }}>120+</div>
                <div style={{ fontSize: 13, color: '#64748b', marginTop: 8, lineHeight: 1.7 }}>Жоғары гранттық нәтиже</div>
              </>
            ),
          },
        ].map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.55 + i * 0.08 }}
            whileHover={{ y: -4, boxShadow: '0 20px 44px rgba(14,165,233,0.12)' }}
            style={{ background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 26, padding: '22px 24px', boxShadow: '0 8px 28px rgba(14,165,233,0.06)', transition: 'box-shadow 0.25s ease' }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 14 }}>{card.label}</div>
            {card.content}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
