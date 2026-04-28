'use client'

import { useCallback, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { createEnglishClient } from '@/lib/english/supabase-client'

// ─── Types ──────────────────────────────────────────────────────────────────

export type GameQuizQuestion = {
  id: number
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  question: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  correct_answer: string
}

interface GameQuizProps {
  quizId: string
  questions: GameQuizQuestion[]
  lessonId: string
  courseId: string
  userId: string
  passThreshold?: number
  onNextLesson?: () => void
}

type QuizPhase = 'intro' | 'playing' | 'result'

// ─── Helpers ────────────────────────────────────────────────────────────────

const QUIZ_SECONDS = 20 * 60

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
}

function checkCorrect(q: GameQuizQuestion, answer: string): boolean {
  if (!answer) return false
  return answer.trim().toLowerCase() === q.correct_answer.trim().toLowerCase()
}

const TYPE_BADGE: Record<string, { label: string; color: string; bg: string }> = {
  multiple_choice: { label: 'Multiple Choice', color: '#1B8FC4', bg: 'rgba(27,143,196,0.15)' },
  true_false:      { label: 'True / False',    color: '#10b981', bg: 'rgba(16,185,129,0.12)' },
  fill_blank:      { label: 'Fill in blank',   color: '#C9933B', bg: 'rgba(201,147,59,0.15)' },
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function GameQuiz({
  quizId, questions, lessonId, courseId, userId,
  passThreshold = 90, onNextLesson,
}: GameQuizProps) {
  const [phase,        setPhase]       = useState<QuizPhase>('intro')
  const [idx,          setIdx]         = useState(0)
  const [answers,      setAnswers]     = useState<Record<number, string>>({})
  const [timeLeft,     setTimeLeft]    = useState(QUIZ_SECONDS)
  const [streak,       setStreak]      = useState(0)
  const [maxStreak,    setMaxStreak]   = useState(0)
  const [xpEarned,     setXpEarned]   = useState(0)
  const [showFeedback, setShowFeedback] = useState(false)
  const [lastCorrect,  setLastCorrect] = useState(false)
  const [certIssued,   setCertIssued]  = useState(false)
  const [finalScore,   setFinalScore]  = useState(0)
  const [finalAns,     setFinalAns]   = useState<Record<number, string>>({})
  const [timeUsed,     setTimeUsed]   = useState(0)

  const totalQ   = questions.length
  const currentQ = questions[idx]
  const timerColor = timeLeft < 60 ? '#ef4444' : timeLeft < 180 ? '#f59e0b' : '#C9933B'

  // ── Timer ──────────────────────────────────────────────────────────────────

  useEffect(() => {
    if (phase !== 'playing') return
    if (timeLeft <= 0) { doFinish(answers, maxStreak, xpEarned); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, timeLeft])

  // ── Finish ─────────────────────────────────────────────────────────────────

  const doFinish = useCallback(async (
    ans: Record<number, string>,
    ms: number,
    xp: number,
  ) => {
    const correctCount = questions.filter(q => checkCorrect(q, ans[q.id] ?? '')).length
    const score  = Math.round((correctCount / Math.max(totalQ, 1)) * 100)
    const passed = score >= passThreshold
    const spent  = QUIZ_SECONDS - timeLeft

    setFinalScore(score)
    setFinalAns(ans)
    setTimeUsed(spent)
    setPhase('result')

    const supabase = createEnglishClient()

    // Save quiz result (fire-and-forget — table may not exist yet)
    supabase.from('english_quiz_results').insert({
      quiz_id:           quizId,
      user_id:           userId,
      score,
      passed,
      correct_answers:   correctCount,
      total_questions:   totalQ,
      max_streak:        ms,
      xp_earned:         xp,
      time_spent_seconds: spent,
    }).then(() => {})

    // Update lesson progress (lesson completion tracking)
    await supabase.from('english_progress').upsert({
      user_id:      userId,
      lesson_id:    lessonId,
      completed:    passed,
      score,
      completed_at: passed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,lesson_id' })

    if (!passed) return

    // Certificate check — issue if all course lessons are completed
    const { data: allLessons } = await supabase
      .from('english_lessons').select('id').eq('course_id', courseId)
    if (!allLessons?.length) return

    const { data: done } = await supabase
      .from('english_progress').select('lesson_id')
      .eq('user_id', userId).eq('completed', true)
      .in('lesson_id', allLessons.map((l: { id: string }) => l.id))

    const doneSet = new Set((done ?? []).map((p: { lesson_id: string }) => p.lesson_id))
    doneSet.add(lessonId)
    if (!allLessons.every((l: { id: string }) => doneSet.has(l.id))) return

    const { data: existingCert } = await supabase
      .from('english_certificates').select('id')
      .eq('user_id', userId).eq('course_id', courseId).maybeSingle()
    if (existingCert) return

    const year = new Date().getFullYear()
    const rand = Math.floor(100000 + Math.random() * 900000)
    await supabase.from('english_certificates').insert({
      user_id:            userId,
      course_id:          courseId,
      certificate_number: `KE-${year}-${rand}`,
      issued_at:          new Date().toISOString(),
    })
    setCertIssued(true)
  }, [questions, totalQ, passThreshold, timeLeft, quizId, userId, lessonId, courseId])

  // ── Answer select ──────────────────────────────────────────────────────────

  const handleSelect = useCallback((answer: string) => {
    if (showFeedback || !currentQ) return

    const newAns = { ...answers, [currentQ.id]: answer }
    setAnswers(newAns)

    const correct    = checkCorrect(currentQ, answer)
    const newStreak  = correct ? streak + 1 : 0
    const newMax     = Math.max(maxStreak, newStreak)
    const xpGain     = correct ? Math.min(5 + newStreak * 2, 20) : 0
    const newXp      = xpEarned + xpGain

    setLastCorrect(correct)
    setShowFeedback(true)
    setStreak(newStreak)
    setMaxStreak(newMax)
    if (correct) setXpEarned(newXp)

    setTimeout(() => {
      setShowFeedback(false)
      if (idx + 1 >= totalQ) {
        doFinish(newAns, newMax, newXp)
      } else {
        setIdx(i => i + 1)
      }
    }, 1200)
  }, [showFeedback, currentQ, answers, streak, maxStreak, xpEarned, idx, totalQ, doFinish])

  const handleFillSubmit = useCallback(() => {
    if (!currentQ) return
    const val = (answers[currentQ.id] ?? '').trim()
    if (!val) return
    handleSelect(val)
  }, [currentQ, answers, handleSelect])

  const reset = () => {
    setPhase('intro'); setIdx(0); setAnswers({})
    setTimeLeft(QUIZ_SECONDS); setStreak(0); setMaxStreak(0)
    setXpEarned(0); setShowFeedback(false)
    setFinalScore(0); setFinalAns({}); setCertIssued(false)
  }

  // ─── INTRO ─────────────────────────────────────────────────────────────────

  if (phase === 'intro') {
    const mc = questions.filter(q => q.type === 'multiple_choice').length
    const tf = questions.filter(q => q.type === 'true_false').length
    const fb = questions.filter(q => q.type === 'fill_blank').length

    return (
      <div style={{ background: '#0D2447', borderRadius: 24, padding: '40px 32px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ width: 80, height: 80, borderRadius: 20, background: 'linear-gradient(135deg, #1B8FC4, #1B3A6B)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, margin: '0 auto 24px' }}>
          🎯
        </div>
        <div style={{ fontSize: 26, fontWeight: 900, color: '#fff', marginBottom: 8 }}>Quiz</div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>
          {totalQ} вопросов • 20 минут • Проходной балл {passThreshold}%
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 32 }}>
          {[
            { icon: '📝', label: 'Multiple Choice', count: mc },
            { icon: '✅', label: 'True / False',    count: tf },
            { icon: '✏️', label: 'Fill in blank',   count: fb },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: 12, padding: '12px 8px', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: '#fff' }}>{s.count}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <button
          onClick={() => setPhase('playing')}
          style={{ width: '100%', padding: 16, borderRadius: 14, background: '#1B8FC4', color: '#fff', border: 'none', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat' }}
        >
          Начать квиз →
        </button>
      </div>
    )
  }

  // ─── PLAYING ───────────────────────────────────────────────────────────────

  if (phase === 'playing' && currentQ) {
    const pct    = (idx / totalQ) * 100
    const badge  = TYPE_BADGE[currentQ.type]
    const fillVal = answers[currentQ.id] ?? ''

    return (
      <div style={{ maxWidth: 640, margin: '0 auto' }}>
        {/* Header bar */}
        <div style={{ background: '#0D2447', borderRadius: '20px 20px 0 0', padding: '16px 24px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.6)', whiteSpace: 'nowrap' }}>
            {idx + 1} / {totalQ}
          </span>

          <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.1)', borderRadius: 999, overflow: 'hidden' }}>
            <motion.div
              initial={false}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #1B8FC4, #C9933B)' }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(201,147,59,0.15)', border: '1px solid rgba(201,147,59,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 14, fontWeight: 800, color: timerColor, fontFamily: 'monospace' }}>
            ⏱ {fmt(timeLeft)}
          </div>

          <div style={{ background: 'rgba(27,143,196,0.15)', border: '1px solid rgba(27,143,196,0.3)', borderRadius: 8, padding: '4px 10px', fontSize: 13, fontWeight: 700, color: '#1B8FC4' }}>
            +{xpEarned} XP
          </div>
        </div>

        {/* Question body */}
        <div style={{ background: '#1B3A6B', borderRadius: '0 0 20px 20px', padding: '28px 28px 24px' }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.18 }}
            >
              {/* Type badge */}
              {badge && (
                <span style={{ display: 'inline-block', padding: '4px 10px', borderRadius: 6, background: badge.bg, color: badge.color, fontSize: 11, fontWeight: 800, letterSpacing: '0.05em', textTransform: 'uppercase' as const, marginBottom: 16 }}>
                  {badge.label}
                </span>
              )}

              <div style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 24, lineHeight: 1.5 }}>
                {currentQ.question}
              </div>

              {/* ── MULTIPLE CHOICE ── */}
              {currentQ.type === 'multiple_choice' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(['a', 'b', 'c', 'd'] as const).map(letter => {
                    const text = currentQ[`option_${letter}` as keyof GameQuizQuestion] as string | undefined
                    if (!text) return null
                    const sel     = answers[currentQ.id]?.toLowerCase() === letter
                    const correct = currentQ.correct_answer.toLowerCase() === letter
                    const isRight = showFeedback && correct
                    const isWrong = showFeedback && sel && !correct
                    return (
                      <button
                        key={letter}
                        disabled={showFeedback}
                        onClick={() => handleSelect(letter)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 14,
                          padding: '14px 18px', borderRadius: 14,
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontFamily: 'Montserrat', textAlign: 'left' as const, transition: 'all 0.15s',
                          border: `1.5px solid ${isRight ? '#10b981' : isWrong ? '#ef4444' : sel ? '#1B8FC4' : 'rgba(255,255,255,0.1)'}`,
                          background: isRight ? 'rgba(16,185,129,0.12)' : isWrong ? 'rgba(239,68,68,0.1)' : sel ? 'rgba(27,143,196,0.15)' : 'rgba(255,255,255,0.05)',
                        }}
                      >
                        <div style={{ width: 32, height: 32, borderRadius: 8, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, background: isRight ? '#10b981' : isWrong ? '#ef4444' : sel ? '#1B8FC4' : 'rgba(255,255,255,0.08)', color: (isRight || isWrong || sel) ? '#fff' : 'rgba(255,255,255,0.5)' }}>
                          {letter.toUpperCase()}
                        </div>
                        <span style={{ fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.85)', flex: 1 }}>
                          {text}
                        </span>
                        {isRight && <span>✅</span>}
                        {isWrong && <span>❌</span>}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* ── TRUE / FALSE ── */}
              {currentQ.type === 'true_false' && (
                <div style={{ display: 'flex', gap: 14 }}>
                  {(['true', 'false'] as const).map(opt => {
                    const sel     = answers[currentQ.id]?.toLowerCase() === opt
                    const correct = currentQ.correct_answer.toLowerCase() === opt
                    const isRight = showFeedback && correct
                    const isWrong = showFeedback && sel && !correct
                    return (
                      <button
                        key={opt}
                        disabled={showFeedback}
                        onClick={() => handleSelect(opt)}
                        style={{
                          flex: 1, padding: 18, borderRadius: 14,
                          cursor: showFeedback ? 'default' : 'pointer',
                          fontFamily: 'Montserrat', transition: 'all 0.15s',
                          fontSize: 16, fontWeight: 800,
                          border: `1.5px solid ${isRight ? '#10b981' : isWrong ? '#ef4444' : sel ? (opt === 'true' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.1)'}`,
                          background: isRight ? 'rgba(16,185,129,0.15)' : isWrong ? 'rgba(239,68,68,0.1)' : sel ? (opt === 'true' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)') : 'rgba(255,255,255,0.05)',
                          color: isRight ? '#10b981' : isWrong ? '#ef4444' : sel ? (opt === 'true' ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {opt === 'true' ? '✓ True' : '✗ False'}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* ── FILL IN THE BLANK ── */}
              {currentQ.type === 'fill_blank' && (
                <div>
                  <input
                    value={fillVal}
                    onChange={e => { if (!showFeedback) setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value })) }}
                    onKeyDown={e => { if (e.key === 'Enter' && !showFeedback) handleFillSubmit() }}
                    disabled={showFeedback}
                    placeholder="Введите ответ..."
                    style={{
                      width: '100%', padding: '16px 20px', borderRadius: 14, outline: 'none', boxSizing: 'border-box' as const,
                      border: `1.5px solid ${showFeedback ? (checkCorrect(currentQ, fillVal) ? '#10b981' : '#ef4444') : 'rgba(255,255,255,0.15)'}`,
                      background: showFeedback ? (checkCorrect(currentQ, fillVal) ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.08)') : 'rgba(255,255,255,0.05)',
                      fontSize: 16, fontWeight: 600, color: '#fff', fontFamily: 'Montserrat',
                    }}
                  />
                  {showFeedback && !checkCorrect(currentQ, fillVal) && (
                    <div style={{ marginTop: 10, fontSize: 14, color: '#10b981', fontWeight: 600 }}>
                      Правильный ответ: {currentQ.correct_answer}
                    </div>
                  )}
                  {!showFeedback && (
                    <button
                      onClick={handleFillSubmit}
                      disabled={!fillVal.trim()}
                      style={{
                        marginTop: 16, width: '100%', padding: 14, borderRadius: 12, border: 'none',
                        background: fillVal.trim() ? '#1B8FC4' : 'rgba(255,255,255,0.1)',
                        color: fillVal.trim() ? '#fff' : 'rgba(255,255,255,0.3)',
                        fontWeight: 700, fontSize: 15,
                        cursor: fillVal.trim() ? 'pointer' : 'default', fontFamily: 'Montserrat',
                      }}
                    >
                      Проверить →
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Streak bar */}
          <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 10 }}>
            <AnimatePresence>
              {showFeedback && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  style={{ fontSize: 22, flexShrink: 0 }}
                >
                  {lastCorrect ? '✅' : '❌'}
                </motion.span>
              )}
            </AnimatePresence>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#C9933B' }}>
              {streak > 0 ? `🔥 Streak: ${streak}` : '💪 Отвечайте правильно'}
            </span>
            <div style={{ display: 'flex', gap: 4, marginLeft: 'auto' }}>
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: i <= streak ? '#C9933B' : 'rgba(255,255,255,0.15)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── RESULT ────────────────────────────────────────────────────────────────

  if (phase === 'result') {
    const passed       = finalScore >= passThreshold
    const correctCount = questions.filter(q => checkCorrect(q, finalAns[q.id] ?? '')).length

    const mcQ  = questions.filter(q => q.type === 'multiple_choice')
    const tfQ  = questions.filter(q => q.type === 'true_false')
    const fbQ  = questions.filter(q => q.type === 'fill_blank')
    const mcSc = mcQ.length ? Math.round(mcQ.filter(q => checkCorrect(q, finalAns[q.id] ?? '')).length / mcQ.length * 100) : 0
    const tfSc = tfQ.length ? Math.round(tfQ.filter(q => checkCorrect(q, finalAns[q.id] ?? '')).length / tfQ.length * 100) : 0
    const fbSc = fbQ.length ? Math.round(fbQ.filter(q => checkCorrect(q, finalAns[q.id] ?? '')).length / fbQ.length * 100) : 0

    return (
      <div style={{ background: '#0D2447', borderRadius: 24, padding: '40px 32px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <div style={{ fontSize: 72, fontWeight: 900, color: passed ? '#C9933B' : '#ef4444', lineHeight: 1 }}>
          {finalScore}%
        </div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '8px 0 24px' }}>
          {correctCount} из {totalQ} правильно
        </div>

        {/* Stat badges */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginBottom: 28 }}>
          {[
            { icon: '⭐', val: `+${xpEarned}`, lbl: 'XP' },
            { icon: '🔥', val: String(maxStreak), lbl: 'Streak' },
            { icon: '⏱', val: fmt(timeUsed),  lbl: 'Время' },
          ].map(b => (
            <div key={b.lbl} style={{ flex: 1, padding: '12px 8px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12 }}>
              <div style={{ fontSize: 20 }}>{b.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#fff' }}>{b.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', fontWeight: 600, textTransform: 'uppercase' as const, letterSpacing: '0.05em' }}>{b.lbl}</div>
            </div>
          ))}
        </div>

        {/* Per-type breakdown */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24, textAlign: 'left' as const }}>
          {[
            { label: 'Multiple Choice', score: mcSc, color: '#1B8FC4', show: mcQ.length > 0 },
            { label: 'True / False',    score: tfSc, color: '#10b981', show: tfQ.length > 0 },
            { label: 'Fill in blank',   score: fbSc, color: '#C9933B', show: fbQ.length > 0 },
          ].filter(r => r.show).map(row => (
            <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 110, fontSize: 12, fontWeight: 700, color: 'rgba(255,255,255,0.5)', flexShrink: 0 }}>{row.label}</div>
              <div style={{ flex: 1, height: 8, background: 'rgba(255,255,255,0.08)', borderRadius: 999, overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${row.score}%` }}
                  transition={{ duration: 1, ease: 'easeOut' }}
                  style={{ height: '100%', background: row.color, borderRadius: 999 }}
                />
              </div>
              <div style={{ width: 36, fontSize: 12, fontWeight: 700, color: row.color, textAlign: 'right' as const }}>{row.score}%</div>
            </div>
          ))}
        </div>

        {/* Pass/fail banner */}
        <div style={{ padding: '14px 16px', borderRadius: 12, marginBottom: certIssued ? 12 : 24, background: passed ? 'rgba(201,147,59,0.1)' : 'rgba(239,68,68,0.08)', border: `1px solid ${passed ? 'rgba(201,147,59,0.25)' : 'rgba(239,68,68,0.2)'}` }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: passed ? '#C9933B' : '#ef4444', marginBottom: 4 }}>
            {passed ? '🎉 Проходной балл достигнут!' : '📚 Нужно больше практики'}
          </div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
            {passed
              ? `Минимум ${passThreshold}% — вы набрали ${finalScore}%`
              : `Минимум ${passThreshold}% — вы набрали ${finalScore}%. Попробуйте ещё раз!`}
          </div>
        </div>

        {certIssued && (
          <div style={{ padding: '14px 16px', borderRadius: 12, marginBottom: 24, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#10b981' }}>
              🏆 Курс завершён! Сертификат выдан в ваш профиль.
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={reset}
            style={{ flex: 1, padding: 14, borderRadius: 12, border: '1.5px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.7)', fontWeight: 700, cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}
          >
            Попробовать снова
          </button>
          {passed && onNextLesson && (
            <button
              onClick={onNextLesson}
              style={{ flex: 1, padding: 14, borderRadius: 12, border: 'none', background: '#1B8FC4', color: '#fff', fontWeight: 800, cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}
            >
              Следующий урок →
            </button>
          )}
        </div>
      </div>
    )
  }

  return null
}