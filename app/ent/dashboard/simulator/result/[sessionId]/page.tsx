'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type SubjectResult = {
  name: string
  score: number
  maxScore: number
  correct: number
  answered: number
  total: number
}

type WrongQuestion = {
  subject: string
  question: string
  userAnswer: string
  correctAnswer: string
}

type ResultData = {
  totalScore: number
  maxScore: number
  totalAnswered: number
  totalQuestions: number
  timeSpent: number
  sessionId: string
  subjectResults: SubjectResult[]
  wrongQuestions: WrongQuestion[]
  studentName: string
}

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function SimulatorResultPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = String(params.sessionId || '1')

  const [result, setResult] = useState<ResultData | null>(null)
  const [aiReview, setAiReview] = useState('')
  const [aiLoading, setAiLoading] = useState(false)

  useEffect(() => {
    async function loadResult() {
      // 1. Try localStorage first (instant, no network)
      const raw = localStorage.getItem('simulator_result')
      if (raw) {
        try {
          const parsed = JSON.parse(raw)
          // Only use if it matches this sessionId
          if (!parsed.sessionId || parsed.sessionId === sessionId) {
            setResult(parsed)
            return
          }
        } catch (e) { console.error(e) }
      }

      // 2. Fallback: fetch from Supabase (by session_id if column exists, else latest)
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        // Try by session_id first, fall back to most recent record
        let row: { total_score: number; max_score: number | null; subject_results: string | null; created_at: string } | null = null
        const { data: bySession } = await supabase
          .from('simulator_results')
          .select('total_score, max_score, subject_results, created_at')
          .eq('user_id', user.id)
          .eq('session_id', sessionId)
          .limit(1)
          .maybeSingle()
        if (bySession) {
          row = bySession
        } else {
          const { data: latest } = await supabase
            .from('simulator_results')
            .select('total_score, max_score, subject_results, created_at')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })
            .limit(1)
            .maybeSingle()
          row = latest
        }

        if (row) {
          const subjectResults: SubjectResult[] = (() => {
            try { return JSON.parse(row.subject_results || '[]') } catch { return [] }
          })()

          const { data: profile } = await supabase
            .from('profiles').select('name').eq('id', user.id).single()
          const studentName = (profile as { name?: string } | null)?.name
            || user.email?.split('@')[0] || 'Студент'

          const totalAnswered = subjectResults.reduce((s, r) => s + r.answered, 0)
          const totalQuestions = subjectResults.reduce((s, r) => s + r.total, 0)

          setResult({
            totalScore:    row.total_score,
            maxScore:      row.max_score ?? 140,
            totalAnswered,
            totalQuestions,
            timeSpent:     0,
            sessionId,
            subjectResults,
            wrongQuestions: [],
            studentName,
          })
        }
      } catch (e) { console.error('Failed to load result from Supabase:', e) }
    }
    loadResult()
  }, [sessionId])

  useEffect(() => {
    if (!result) return
    const callAI = async () => {
      setAiLoading(true)
      try {
        const resp = await fetch('/ent/api/ai-review', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentName: result.studentName,
            totalScore: result.totalScore,
            maxScore: result.maxScore,
            subjectScores: result.subjectResults.map(s => ({ name: s.name, score: s.score, max: s.maxScore })),
            wrongQuestions: result.wrongQuestions,
          }),
        })
        const data = await resp.json()
        setAiReview(data.review || '')
      } catch {
        setAiReview('AI талдауын алу мүмкін болмады.')
      } finally {
        setAiLoading(false)
      }
    }
    callAI()
  }, [result])

  const totalScore = result?.totalScore ?? 0
  const maxScore = result?.maxScore ?? 140
  const totalAnswered = result?.totalAnswered ?? 0
  const totalQuestions = result?.totalQuestions ?? 120
  const timeSpent = result?.timeSpent ?? 0
  const subjectResults = result?.subjectResults ?? []

  const percent = useMemo(() => {
    if (!maxScore) return 0
    return Math.round((totalScore / maxScore) * 100)
  }, [totalScore, maxScore])

  const bestSubject = useMemo(() => {
    if (!subjectResults.length) return null
    return [...subjectResults].sort((a, b) => (b.score / (b.maxScore || 1)) - (a.score / (a.maxScore || 1)))[0]
  }, [subjectResults])

  const weakSubject = useMemo(() => {
    if (!subjectResults.length) return null
    return [...subjectResults].sort((a, b) => (a.score / (a.maxScore || 1)) - (b.score / (b.maxScore || 1)))[0]
  }, [subjectResults])

  const passed = percent >= 50

  const recommendation = useMemo(() => {
    if (percent >= 85) return 'Нәтиже өте жақсы. Енді жоғары баллды тұрақтандыру үшін тағы 1–2 толық симулятор тапсыр.'
    if (percent >= 70) return 'Жақсы нәтиже. Әлсіз бөлімдерді қайта қарап, тағы бір вариантпен бекіту керек.'
    if (percent >= 50) return 'Негізгі база бар. Бірақ әлсіз пәндерге көбірек уақыт бөліп, қателерді талдау қажет.'
    return 'Нәтижені көтеру керек. Міндетті пәндер мен әлсіз профиль бөлімдерін қайта оқып, жаңа симулятор тапсыру керек.'
  }, [percent])

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #f0f9ff, #fff)' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748b', fontSize: 16, marginBottom: 16, fontWeight: 700 }}>Нәтиже табылмады</p>
          <button onClick={() => router.push('/ent/dashboard/simulator')} style={{ padding: '12px 24px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}>
            Симуляторға оралу
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Нәтиже
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Симулятор нәтижесі
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Пәндер бойынша нақты балл, қателер талдауы және AI кеңестер.
        </p>
      </motion.div>

      {/* Hero score */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          borderRadius: 30, padding: 28, marginBottom: 20,
          background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
          border: '1px solid rgba(14,165,233,0.18)',
          boxShadow: '0 20px 44px rgba(14,165,233,0.1)',
          display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 0.7fr)', gap: 24,
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 999, background: '#fff', border: '1px solid rgba(14,165,233,0.2)', color: '#0ea5e9', fontSize: 12, fontWeight: 800 }}>
              Session #{sessionId.slice(0, 8)}
            </div>
            <div style={{
              display: 'inline-flex', alignItems: 'center', padding: '8px 14px', borderRadius: 999, fontSize: 12, fontWeight: 800,
              color: passed ? '#166534' : '#dc2626',
              border: passed ? '1px solid #bbf7d0' : '1px solid #fecaca',
              background: passed ? '#f0fdf4' : '#fef2f2',
            }}>
              {passed ? '✓ Өту балы жиналды' : '✗ Нәтижені көтеру керек'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 16 }}>
            <div style={{ fontSize: 72, lineHeight: 1, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em' }}>{totalScore}</div>
            <div style={{ fontSize: 22, fontWeight: 700, color: '#64748b', paddingBottom: 10 }}>/ {maxScore} балл</div>
          </div>

          <div style={{ fontSize: 14, lineHeight: 1.9, color: '#475569', fontWeight: 600 }}>
            Жалпы нәтиже: <strong style={{ color: '#0c4a6e' }}>{percent}%</strong><br />
            Жауап берілді: <strong style={{ color: '#0c4a6e' }}>{totalAnswered} / {totalQuestions}</strong> сұрақ<br />
            {bestSubject && <>Ең мықты: <strong style={{ color: '#0c4a6e' }}>{bestSubject.name}</strong> ({bestSubject.score}/{bestSubject.maxScore})<br /></>}
            {weakSubject && <>Ең әлсіз: <strong style={{ color: '#0c4a6e' }}>{weakSubject.name}</strong> ({weakSubject.score}/{weakSubject.maxScore})</>}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignContent: 'start' }}>
          {[
            { num: String(totalScore), label: 'Жиналған балл' },
            { num: `${percent}%`, label: 'Жалпы пайыз' },
            { num: String(totalAnswered), label: 'Жауап берілді' },
            { num: formatTime(timeSpent), label: 'Уақыт' },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.12 + i * 0.06 }}
              style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 20, padding: '16px', textAlign: 'center', boxShadow: '0 8px 20px rgba(14,165,233,0.07)' }}
            >
              <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', lineHeight: 1.1, letterSpacing: '-0.03em' }}>{s.num}</div>
              <div style={{ fontSize: 11, color: '#64748b', marginTop: 5, fontWeight: 700 }}>{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Main grid */}
      <div className="sim-result-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 18 }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {/* Subject scores */}
          <motion.div
            {...fadeUp(0.12)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 26, boxShadow: '0 16px 36px rgba(14,165,233,0.08)' }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 20px', letterSpacing: '-0.03em' }}>
              Пәндер бойынша балл
            </h2>
            {subjectResults.map((item, index) => {
              const p = item.maxScore ? Math.round((item.score / item.maxScore) * 100) : 0
              const barColor = p >= 70 ? '#22c55e' : p >= 50 ? '#0ea5e9' : '#f59e0b'
              return (
                <div key={item.name} style={{ paddingBottom: 16, marginBottom: 16, borderBottom: index === subjectResults.length - 1 ? 'none' : '1px solid rgba(14,165,233,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 2 }}>{item.name}</div>
                      <div style={{ fontSize: 12, color: '#64748b', fontWeight: 600 }}>{item.correct} дұрыс / {item.total} сұрақ · {p}%</div>
                    </div>
                    <div style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9', whiteSpace: 'nowrap' }}>{item.score} / {item.maxScore}</div>
                  </div>
                  <div style={{ width: '100%', height: 8, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${p}%` }}
                      transition={{ duration: 0.8, delay: 0.2 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                      style={{ height: '100%', borderRadius: 999, background: barColor }}
                    />
                  </div>
                </div>
              )
            })}
          </motion.div>

          {/* AI Review */}
          <motion.div
            {...fadeUp(0.18)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 26, boxShadow: '0 16px 36px rgba(14,165,233,0.08)' }}
          >
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: '0 0 18px', letterSpacing: '-0.03em', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span>✦</span> AI Талдау
            </h2>
            {aiLoading ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '28px 0' }}>
                <div className="spinner" style={{ width: 40, height: 40 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>AI нәтижені талдауда, күте тұрыңыз...</div>
              </div>
            ) : aiReview ? (
              <div style={{ fontSize: 14, lineHeight: 1.9, color: '#334155', whiteSpace: 'pre-wrap', fontWeight: 600 }}>{aiReview}</div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>AI талдауы қолжетімді емес.</div>
            )}
          </motion.div>
        </div>

        {/* Right sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <motion.div
            {...fadeUp(0.14)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: 22, boxShadow: '0 14px 30px rgba(14,165,233,0.07)' }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Қысқа талдау</h3>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#475569', margin: 0, fontWeight: 600 }}>
              {bestSubject && <>Ең мықты жағың — <strong>{bestSubject.name}</strong> ({bestSubject.score}/{bestSubject.maxScore}).<br /></>}
              {weakSubject && <>Ең көп жұмыс қажет — <strong>{weakSubject.name}</strong> ({weakSubject.score}/{weakSubject.maxScore}).<br /></>}
              Әлсіз бөлімдерден бастап, тағы бір толық симулятор тапсырған дұрыс.
            </p>
          </motion.div>

          <motion.div
            {...fadeUp(0.18)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: 22, boxShadow: '0 14px 30px rgba(14,165,233,0.07)' }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Ұсыныс</h3>
            <p style={{ fontSize: 13, lineHeight: 1.8, color: '#475569', margin: 0, fontWeight: 600 }}>{recommendation}</p>
          </motion.div>

          <motion.div
            {...fadeUp(0.22)}
            style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: 22, boxShadow: '0 14px 30px rgba(14,165,233,0.07)' }}
          >
            <h3 style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', margin: '0 0 14px', letterSpacing: '-0.03em' }}>Әрі қарай не істейміз?</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <motion.button
                onClick={() => router.push('/ent/dashboard/simulator')}
                whileHover={{ scale: 1.02, boxShadow: '0 16px 32px rgba(14,165,233,0.3)' }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', fontWeight: 800, fontSize: 14, cursor: 'pointer', boxShadow: '0 10px 22px rgba(14,165,233,0.24)' }}
              >
                ↺ Қайта тапсыру
              </motion.button>
              <motion.button
                onClick={() => router.push('/ent/dashboard/ai-analysis')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1px solid rgba(14,165,233,0.2)', background: '#fff', color: '#0369a1', fontWeight: 800, fontSize: 14, cursor: 'pointer' }}
              >
                ◉ Толық AI талдау
              </motion.button>
              <motion.button
                onClick={() => router.push('/ent/dashboard')}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.97 }}
                style={{ width: '100%', padding: '13px 16px', borderRadius: 14, border: '1px solid rgba(14,165,233,0.2)', background: '#fff', color: '#64748b', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}
              >
                Dashboard-қа қайту
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
