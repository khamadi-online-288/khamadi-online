'use client'
import type { Session } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { MOCK_PASSAGES, MOCK_QUESTIONS, getBandScore } from '@/lib/english/mock-exam-questions'
import { awardXP } from '@/lib/english/xp'
import { motion } from 'framer-motion'

type Screen = 'intro' | 'exam' | 'result'

const TOTAL_SECONDS = 60 * 60

export default function MockExamPage() {
  const supabase = createEnglishClient()
  const [screen, setScreen] = useState<Screen>('intro')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [activePassage, setActivePassage] = useState<1 | 2 | 3>(1)
  const [timeLeft, setTimeLeft] = useState(TOTAL_SECONDS)
  const [result, setResult] = useState<{ score: number; band: number; feedback: string } | null>(null)
  const [uid, setUid] = useState('')
  const [loadingFeedback, setLoadingFeedback] = useState(false)
  const [xpEarned, setXpEarned] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef(Date.now())

  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: Session | null } }) => { const s = res.data.session; if (s) setUid(s.user.id) })
  }, [])

  useEffect(() => {
    if (screen !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current!); handleSubmit(); return 0 }
        return t - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [screen])

  async function handleSubmit() {
    if (timerRef.current) clearInterval(timerRef.current)
    const correct = MOCK_QUESTIONS.filter(q => answers[q.id] === q.answer).length
    const band = getBandScore(correct)
    const timeSpent = Math.round((Date.now() - startRef.current) / 1000)

    setLoadingFeedback(true)
    let feedback = ''
    try {
      const byPassage = [1, 2, 3].map(p => {
        const pqs = MOCK_QUESTIONS.filter(q => q.passage === p)
        const pc = pqs.filter(q => answers[q.id] === q.answer).length
        return `Текст ${p}: ${pc}/${pqs.length}`
      }).join(', ')
      const prompt = `Ты — эксперт IELTS. Студент прошёл Mock Reading Exam. Результат: ${correct}/40 вопросов, Band ${band}. По текстам: ${byPassage}. Дай краткий фидбек на русском (2-3 предложения): что хорошо, где проблемы, один конкретный совет.`
      const resp = await fetch('/api/english/ai-proxy', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ prompt, maxTokens: 300 }) })
      const data = await resp.json()
      feedback = data.text ?? ''
    } catch { feedback = '' }

    if (uid) {
      await supabase.from('english_mock_exams').insert({ user_id: uid, score: correct, max_score: 40, band_score: band, answers, ai_feedback: feedback, time_spent_seconds: timeSpent })
      const earned = await awardXP(supabase, uid, 'mock_exam_done')
      setXpEarned(earned)
    }

    setResult({ score: correct, band, feedback })
    setLoadingFeedback(false)
    setScreen('result')
  }

  function formatTime(s: number) {
    const m = Math.floor(s / 60), sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  const timerColor = timeLeft < 600 ? '#ef4444' : '#1B3A6B'

  if (screen === 'intro') return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#1B3A6B,#0D2447)', borderRadius: 24, padding: 40, color: '#fff', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>◧</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>IELTS Mock Exam</h1>
        <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>Academic Reading — 40 вопросов · 3 текста</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>Условия экзамена</div>
        {[
          { icon: '⏱', text: 'Время: 60 минут (обратный отсчёт)' },
          { icon: '📄', text: '3 академических текста (~400 слов каждый)' },
          { icon: '✏️', text: '40 вопросов: Multiple Choice, True/False/NG, Fill in the Blank' },
          { icon: '⚡', text: 'После начала нельзя поставить на паузу' },
          { icon: '🏆', text: '+40 XP за прохождение + AI фидбек' },
        ].map(({ icon, text }) => (
          <div key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 13, color: '#334155' }}>
            <span style={{ fontSize: 16 }}>{icon}</span><span>{text}</span>
          </div>
        ))}
      </div>
      <button onClick={() => { startRef.current = Date.now(); setScreen('exam') }}
        style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#1B3A6B', color: '#fff', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
        Начать экзамен
      </button>
    </div>
  )

  if (screen === 'result' && result) {
    const bandColor = result.band >= 7 ? '#10b981' : result.band >= 6 ? '#f59e0b' : '#ef4444'
    return (
      <div style={{ maxWidth: 720, margin: '0 auto' }}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'linear-gradient(135deg,#1B3A6B,#0D2447)', borderRadius: 24, padding: 40, textAlign: 'center', marginBottom: 24, color: '#fff' }}>
          <div style={{ fontSize: 12, fontWeight: 700, opacity: 0.6, letterSpacing: '2px', marginBottom: 12 }}>BAND SCORE</div>
          <div style={{ fontSize: 72, fontWeight: 900, color: bandColor, lineHeight: 1 }}>{result.band.toFixed(1)}</div>
          <div style={{ fontSize: 16, opacity: 0.8, marginTop: 8 }}>{result.score}/40 правильных ответов</div>
          {xpEarned > 0 && <div style={{ marginTop: 14, display: 'inline-block', background: 'rgba(201,147,59,0.25)', border: '1px solid rgba(201,147,59,0.5)', borderRadius: 99, padding: '5px 16px', color: '#fcd34d', fontWeight: 800, fontSize: 13 }}>+{xpEarned} XP</div>}
        </motion.div>

        {/* By passage */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 20 }}>
          {[1, 2, 3].map(p => {
            const pqs = MOCK_QUESTIONS.filter(q => q.passage === p)
            const pc = pqs.filter(q => answers[q.id] === q.answer).length
            return (
              <div key={p} style={{ background: '#fff', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(27,143,196,0.1)', textAlign: 'center' as const }}>
                <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>ТЕКСТ {p}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B' }}>{pc}/{pqs.length}</div>
              </div>
            )
          })}
        </div>

        {/* AI Feedback */}
        {result.feedback && (
          <div style={{ background: '#f0f9ff', borderRadius: 16, padding: '18px 22px', border: '1px solid rgba(27,143,196,0.2)', marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: '#1B3A6B', marginBottom: 8 }}>AI Фидбек</div>
            <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.7 }}>{result.feedback}</div>
          </div>
        )}

        {/* Answer review */}
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', background: '#f8fafc', fontSize: 13, fontWeight: 800, color: '#1B3A6B', borderBottom: '1px solid #f1f5f9' }}>Разбор ответов</div>
          {MOCK_QUESTIONS.slice(0, 20).map(q => {
            const given = answers[q.id]
            const correct = given === q.answer
            return (
              <div key={q.id} style={{ display: 'flex', gap: 10, padding: '10px 20px', borderBottom: '1px solid #f8fafc', alignItems: 'flex-start' }}>
                <span style={{ fontSize: 16, flexShrink: 0, marginTop: 1 }}>{correct ? '✓' : '✗'}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: '#334155' }}>Q{q.id}: {q.question.slice(0, 60)}...</div>
                  {!correct && <div style={{ fontSize: 11, color: '#10b981', marginTop: 2 }}>Правильно: {q.answer}</div>}
                </div>
              </div>
            )
          })}
          <div style={{ padding: '10px 20px', fontSize: 12, color: '#94a3b8', fontStyle: 'italic' }}>Показаны первые 20 вопросов</div>
        </div>

        <button onClick={() => { setScreen('intro'); setAnswers({}); setTimeLeft(TOTAL_SECONDS); setResult(null) }}
          style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#f1f5f9', color: '#1B3A6B', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', marginTop: 16 }}>
          Пройти снова
        </button>
      </div>
    )
  }

  // Exam screen
  const passageQuestions = MOCK_QUESTIONS.filter(q => q.passage === activePassage)
  const passage = MOCK_PASSAGES.find(p => p.id === activePassage)!

  return (
    <div style={{ maxWidth: '100%' }}>
      {/* Timer bar */}
      <div style={{ background: '#fff', borderRadius: 14, padding: '10px 20px', marginBottom: 16, border: `1.5px solid ${timeLeft < 600 ? '#ef4444' : 'rgba(27,143,196,0.1)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: '#64748b' }}>IELTS Academic Reading Mock</span>
        <span style={{ fontSize: 18, fontWeight: 900, color: timerColor, fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
        <button onClick={handleSubmit} style={{ padding: '8px 16px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Сдать</button>
      </div>

      {/* Passage tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16, background: '#f1f5f9', borderRadius: 10, padding: 3, width: 'fit-content' }}>
        {([1, 2, 3] as const).map(p => {
          const pqs = MOCK_QUESTIONS.filter(q => q.passage === p)
          const done = pqs.filter(q => answers[q.id] !== undefined).length
          return (
            <button key={p} onClick={() => setActivePassage(p)}
              style={{ padding: '7px 16px', borderRadius: 8, fontWeight: activePassage === p ? 800 : 600, fontSize: 12, border: 'none', background: activePassage === p ? '#fff' : 'transparent', color: activePassage === p ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              Текст {p} ({done}/{pqs.length})
            </button>
          )
        })}
      </div>

      {/* Split layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, alignItems: 'start' }}>
        {/* Passage */}
        <div style={{ background: '#fff', borderRadius: 16, padding: 24, border: '1px solid rgba(27,143,196,0.1)', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' as const }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>{passage.title}</div>
          <div style={{ fontSize: 13, color: '#334155', lineHeight: 1.8 }}>{passage.text}</div>
        </div>

        {/* Questions */}
        <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 12, maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' as const }}>
          {passageQuestions.map(q => (
            <div key={q.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginBottom: 6 }}>Q{q.id} · {q.type === 'mc' ? 'Multiple Choice' : q.type === 'tfng' ? 'True / False / Not Given' : 'Fill in the blank'}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', marginBottom: 10 }}>{q.question}</div>
              {q.type === 'fill' ? (
                <input value={answers[q.id] ?? ''} onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
                  placeholder="Введите ответ..." style={{ width: '100%', padding: '8px 12px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 8, fontSize: 13, fontFamily: 'Montserrat', outline: 'none', boxSizing: 'border-box' as const }} />
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 6 }}>
                  {q.options!.map(opt => {
                    const sel = answers[q.id] === opt
                    return (
                      <button key={opt} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                        style={{ padding: '8px 12px', borderRadius: 8, border: sel ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.15)', background: sel ? '#1B8FC4' : '#f8fafc', color: sel ? '#fff' : '#334155', fontWeight: sel ? 700 : 500, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const }}>
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
