'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

type Analysis = {
  overview: string
  subjectLevels: string
  weakTopics: string
  scorePrediction: string
  studyPlan: string
  parentReport: string
}

type Profile = {
  id: string
  full_name?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function AiAnalysisPage() {
  const [loading, setLoading] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [simulatorData, setSimulatorData] = useState<unknown[]>([])
  const [examData, setExamData] = useState<unknown[]>([])
  const [analysis, setAnalysis] = useState<Analysis | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setDataLoading(false); return }

        const [profileRes, simRes, examRes] = await Promise.all([
          supabase.from('profiles').select('id, full_name, profile_subject_1, profile_subject_2').eq('id', user.id).single(),
          supabase.from('simulator_results').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
          supabase.from('exam_attempts').select('*').eq('student_id', user.id).order('created_at', { ascending: false }).limit(20),
        ])

        setProfile(profileRes.data)
        setSimulatorData(simRes.data || [])
        setExamData(examRes.data || [])
      } catch (e) { console.error(e) }
      finally { setDataLoading(false) }
    }
    loadData()
  }, [])

  const runAnalysis = async () => {
    if (!profile) return
    setLoading(true)
    setError('')
    setAnalysis(null)
    try {
      const res = await fetch('/api/ai-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile.full_name,
          profileSubject1: profile.profile_subject_1,
          profileSubject2: profile.profile_subject_2,
          simulatorResults: simulatorData,
          examResults: examData,
        }),
      })
      const data = await res.json()
      setAnalysis(data)
    } catch { setError('Қате орын алды. Қайта көріңіз.') }
    setLoading(false)
  }

  if (dataLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Деректер жүктелуде...</p>
        </div>
      </div>
    )
  }

  const hasData = simulatorData.length > 0 || examData.length > 0
  const firstName = profile?.full_name?.trim()?.split(' ')[0] || 'Оқушы'

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          AI Анализ
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Білім анализі
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          AI сенің симулятор және тақырыптық тест нәтижелеріңді талдап, жеке ұсыныс дайындайды.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          borderRadius: 30, padding: 28, marginBottom: 22,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid rgba(14,165,233,0.18)',
          boxShadow: '0 20px 44px rgba(14,165,233,0.1)',
          display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 24,
        }}
      >
        <div>
          <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8, fontWeight: 600 }}>
            Сәлем, <strong style={{ color: '#0c4a6e' }}>{firstName}</strong>
          </div>
          <h2 style={{ fontSize: 28, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.04em' }}>Білім анализі</h2>
          <p style={{ fontSize: 14, lineHeight: 1.8, color: '#475569', margin: 0, fontWeight: 600 }}>
            AI сенің симулятор және тақырыптық тест нәтижелеріңді талдап, әлсіз тұстарды анықтап, жеке оқу жоспарын ұсынады.
          </p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, alignContent: 'start' }}>
          {[
            { icon: '📊', val: String(simulatorData.length), label: 'Симулятор' },
            { icon: '📝', val: String(examData.length), label: 'Тақырып тесті' },
            { icon: '📚', val: profile?.profile_subject_1 || '—', label: 'Бейінді пән 1', small: true },
            { icon: '📚', val: profile?.profile_subject_2 || '—', label: 'Бейінді пән 2', small: true },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.07 }}
              style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 18, padding: '14px', textAlign: 'center', boxShadow: '0 6px 14px rgba(14,165,233,0.07)' }}
            >
              <div style={{ fontSize: 20, marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: s.small ? 13 : 20, fontWeight: 900, color: '#0c4a6e', marginBottom: 3, lineHeight: 1.2 }}>{s.val}</div>
              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      {!hasData ? (
        <motion.div
          {...fadeUp(0.12)}
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 28, padding: '52px 32px', textAlign: 'center', boxShadow: '0 20px 44px rgba(14,165,233,0.08)' }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>📊</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: '#0c4a6e', margin: '0 0 10px', letterSpacing: '-0.03em' }}>Деректер жоқ</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, margin: '0 auto 24px', maxWidth: 440 }}>
            AI анализ жасау үшін алдымен симулятор немесе тақырыптық тест тапсыру қажет.
          </p>
          <motion.a
            href="/dashboard/simulator"
            whileHover={{ scale: 1.04, boxShadow: '0 18px 36px rgba(14,165,233,0.32)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '14px 28px', borderRadius: 16, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: 15, boxShadow: '0 12px 28px rgba(14,165,233,0.28)' }}
          >
            Симуляторға өту
          </motion.a>
        </motion.div>
      ) : !analysis ? (
        <motion.div
          {...fadeUp(0.12)}
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 28, padding: '52px 32px', textAlign: 'center', boxShadow: '0 20px 44px rgba(14,165,233,0.08)' }}
        >
          <div style={{ fontSize: 60, marginBottom: 16 }}>🤖</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.04em' }}>AI анализге дайынмын</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, margin: '0 auto 28px', maxWidth: 520 }}>
            {simulatorData.length} симулятор және {examData.length} тақырыптық тест нәтижесін талдап, саған нақты ұсыныс, болжам және оқу жоспарын дайындаймын.
          </p>
          <motion.button
            onClick={runAnalysis}
            disabled={loading}
            whileHover={!loading ? { scale: 1.04, boxShadow: '0 20px 44px rgba(14,165,233,0.36)' } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
            style={{
              padding: '16px 36px', borderRadius: 16, border: 'none',
              background: loading ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: loading ? 'none' : '0 14px 30px rgba(14,165,233,0.3)',
            }}
          >
            {loading ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="spin" style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: 999, display: 'inline-block' }} />
                Анализ жасалуда...
              </span>
            ) : '✦ AI Анализді бастау'}
          </motion.button>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ color: '#dc2626', marginTop: 14, marginBottom: 0, fontSize: 14, fontWeight: 700 }}
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {[
            { num: '1', title: 'Жалпы білім деңгейі', content: analysis.overview, tone: 'default' as const },
            { num: '2', title: 'Пәндер бойынша деңгей', content: analysis.subjectLevels, tone: 'default' as const, variant: 'levels' as const },
            { num: '3', title: 'Әлсіз тақырыптар', content: analysis.weakTopics, tone: 'default' as const },
            { num: '4', title: 'ҰБТ баллын болжау', content: analysis.scorePrediction, tone: 'blue' as const },
            { num: '5', title: 'Персоналды оқу жоспары', content: analysis.studyPlan, tone: 'default' as const },
            { num: '6', title: 'Ата-анаға есеп', content: analysis.parentReport, tone: 'green' as const },
          ].map((section, i) => (
            <motion.div
              key={section.num}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
            >
              <AnalysisSection {...section} />
            </motion.div>
          ))}

          <motion.div {...fadeUp(0.4)} style={{ textAlign: 'center', paddingTop: 4 }}>
            <motion.button
              onClick={runAnalysis}
              disabled={loading}
              whileHover={!loading ? { scale: 1.03, boxShadow: '0 18px 36px rgba(14,165,233,0.32)' } : {}}
              whileTap={!loading ? { scale: 0.97 } : {}}
              style={{
                padding: '14px 32px', borderRadius: 16, border: 'none',
                background: loading ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#fff', fontWeight: 800, fontSize: 15,
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: loading ? 'none' : '0 12px 28px rgba(14,165,233,0.28)',
              }}
            >
              {loading ? 'Жаңартылуда...' : '↺ Қайта анализ жасау'}
            </motion.button>
          </motion.div>
        </div>
      )}
    </div>
  )
}

function AnalysisSection({
  num, title, content, tone = 'default', variant = 'default'
}: {
  num: string; title: string; content: string
  tone?: 'default' | 'blue' | 'green'
  variant?: 'default' | 'levels'
}) {
  const toneMap = {
    blue:    { bg: '#eff6ff', border: 'rgba(14,165,233,0.2)', circle: '#0ea5e9', text: '#1d4ed8' },
    green:   { bg: '#f0fdf4', border: '#bbf7d0', circle: '#16a34a', text: '#166534' },
    default: { bg: 'rgba(255,255,255,0.92)', border: 'rgba(14,165,233,0.14)', circle: '#0c4a6e', text: '#334155' },
  }
  const t = toneMap[tone]

  return (
    <div style={{ borderRadius: 24, padding: 24, background: t.bg, border: `1px solid ${t.border}`, boxShadow: '0 10px 24px rgba(14,165,233,0.06)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <div style={{ width: 34, height: 34, borderRadius: '50%', background: t.circle, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14, flexShrink: 0 }}>
          {num}
        </div>
        <h2 style={{ fontSize: 19, fontWeight: 900, color: '#0c4a6e', margin: 0, letterSpacing: '-0.03em' }}>{title}</h2>
      </div>
      <div>
        {content.split('\n').filter(Boolean).map((line, i) => {
          const isStrong = line.toLowerCase().includes('күшті')
          const isWeak = line.toLowerCase().includes('әлсіз')
          const isMedium = line.toLowerCase().includes('орташа')
          if (variant === 'levels') {
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 22, flexShrink: 0, fontSize: 15, lineHeight: '22px' }}>
                  {isStrong ? '✅' : isWeak ? '❌' : isMedium ? '⚠️' : '•'}
                </div>
                <p style={{ margin: 0, fontSize: 14, lineHeight: 1.8, color: t.text, fontWeight: 600 }}>{line}</p>
              </div>
            )
          }
          return <p key={i} style={{ margin: '0 0 8px', fontSize: 14, lineHeight: 1.85, color: t.text, fontWeight: 600 }}>{line}</p>
        })}
      </div>
    </div>
  )
}
