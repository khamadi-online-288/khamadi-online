'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/* ─────────────────────────────────────────────
   TYPES
───────────────────────────────────────────── */
type Question = {
  id: number
  topic_id: number
  question_text: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
  explanation: string | null
  points: number
}

type Section  = { id: number; subject_id: number; name: string }
type Subject  = { id: number; name: string; icon: string | null }

type Difficulty = 'easy' | 'medium' | 'hard'
type Phase      = 'loading' | 'intro' | 'playing' | 'results'

/* selected stores 'A' | 'B' | 'C' | 'D' — same format as correct_answer */
type AnswerRecord = { selected: string; correct: boolean }

type QuizResult = {
  score:          number   // correct count
  accuracy:       number   // 0-100 %
  xp:             number   // correct * 5
  correct_answers: number
  total_questions: number
  max_streak:     number
  time_seconds:   number
}

type BestResult = {
  score: number
  xp: number
  accuracy: number
  maxStreak: number
  difficulty: string
}

/* ─────────────────────────────────────────────
   CONFIG
───────────────────────────────────────────── */
const DIFFICULTY: Record<Difficulty, { label: string; emoji: string; timePerQ: number; baseXP: number; color: string; bg: string }> = {
  easy:   { label: 'Жеңіл',  emoji: '🟢', timePerQ: 30, baseXP: 10, color: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
  medium: { label: 'Орташа', emoji: '🟡', timePerQ: 20, baseXP: 15, color: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  hard:   { label: 'Қиын',   emoji: '🔴', timePerQ: 10, baseXP: 25, color: '#ef4444', bg: 'rgba(239,68,68,0.12)'  },
}

/* streak → multiplier */
function getMultiplier(streak: number): number {
  if (streak >= 7) return 3
  if (streak >= 5) return 2
  if (streak >= 3) return 1.5
  return 1
}

function multiplierLabel(streak: number): string {
  const m = getMultiplier(streak)
  return m > 1 ? `×${m}` : ''
}

/* ─────────────────────────────────────────────
   SOUND  (Web Audio API — graceful fallback)
───────────────────────────────────────────── */
function playSound(type: 'correct' | 'wrong' | 'complete' | 'streak') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioCtx = window.AudioContext ?? (window as any).webkitAudioContext
    if (!AudioCtx) return
    const ctx  = new AudioCtx()
    const gain = ctx.createGain()
    gain.connect(ctx.destination)

    const play = (freq: number, duration: number, type_: OscillatorType = 'sine', vol = 0.18) => {
      const osc = ctx.createOscillator()
      osc.type = type_
      osc.frequency.value = freq
      osc.connect(gain)
      gain.gain.setValueAtTime(vol, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    }

    if (type === 'correct') {
      play(523, 0.12)
      setTimeout(() => play(659, 0.18), 80)
    } else if (type === 'wrong') {
      play(196, 0.45, 'sawtooth', 0.12)
    } else if (type === 'streak') {
      play(523, 0.1); setTimeout(() => play(659, 0.1), 80); setTimeout(() => play(784, 0.22), 160)
    } else if (type === 'complete') {
      play(523, 0.1); setTimeout(() => play(659, 0.1), 100);
      setTimeout(() => play(784, 0.1), 200); setTimeout(() => play(1047, 0.35), 300)
    }
  } catch { /* ignore AudioContext errors */ }
}

/* ─────────────────────────────────────────────
   FORMAT HELPERS
───────────────────────────────────────────── */
function fmtTime(s: number) {
  const m = Math.floor(s / 60).toString().padStart(2, '0')
  const ss = (s % 60).toString().padStart(2, '0')
  return `${m}:${ss}`
}

/* ─────────────────────────────────────────────
   EVALUATE QUIZ
   Pure function — no side effects, fully testable
   userAnswers: { [questionId]: 'A' | 'B' | 'C' | 'D' }
───────────────────────────────────────────── */
function evaluateQuiz(
  questions: Question[],
  userAnswers: Record<number, string>,
  timeSeconds: number
): QuizResult {
  let correct   = 0
  let streak    = 0
  let maxStreak = 0

  for (const q of questions) {
    const answer = userAnswers[q.id] ?? null
    if (answer !== null && answer === q.correct_answer) {
      correct++
      streak++
      if (streak > maxStreak) maxStreak = streak
    } else {
      streak = 0
    }
  }

  const total = questions.length
  return {
    score:           correct,
    accuracy:        total > 0 ? Math.round((correct / total) * 100) : 0,
    xp:              correct * 5,
    correct_answers: correct,
    total_questions: total,
    max_streak:      maxStreak,
    time_seconds:    timeSeconds,
  }
}

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]
const OPTIONS: Array<{ key: 'option_a' | 'option_b' | 'option_c' | 'option_d'; label: string }> = [
  { key: 'option_a', label: 'A' },
  { key: 'option_b', label: 'B' },
  { key: 'option_c', label: 'C' },
  { key: 'option_d', label: 'D' },
]

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function ModuleQuizPage() {
  const { subjectId, sectionId } = useParams<{ subjectId: string; sectionId: string }>()
  const router = useRouter()

  /* ── data ── */
  const [subject,   setSubject]   = useState<Subject | null>(null)
  const [section,   setSection]   = useState<Section | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [userId,    setUserId]    = useState<string | null>(null)

  /* ── quiz state ── */
  const [phase,          setPhase]          = useState<Phase>('loading')
  const [difficulty,     setDifficulty]     = useState<Difficulty>('medium')
  const [currentIndex,   setCurrentIndex]   = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback,   setShowFeedback]   = useState(false)
  const [isCorrect,      setIsCorrect]      = useState<boolean | null>(null)
  const [score,          setScore]          = useState(0)          // correct count
  const [xp,             setXP]             = useState(0)
  const [lastXPEarned,   setLastXPEarned]   = useState(0)
  const [streak,         setStreak]         = useState(0)
  const [maxStreak,      setMaxStreak]      = useState(0)
  const [timeLeft,       setTimeLeft]       = useState(0)
  const [elapsedSecs,    setElapsedSecs]    = useState(0)
  const [answers,        setAnswers]        = useState<Record<number, AnswerRecord>>({})
  const [showXPPop,      setShowXPPop]      = useState(false)
  const [soundEnabled,   setSoundEnabled]   = useState(true)
  const [bestResult,     setBestResult]     = useState<BestResult | null>(null)

  /* ── refs for timer ── */
  const timerRef   = useRef<ReturnType<typeof setTimeout> | null>(null)
  const elapsedRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startTime  = useRef(0)

  /* ────────────────────────────────
     LOAD DATA
  ──────────────────────────────── */
  useEffect(() => {
    async function load() {
      const [{ data: subjectData }, { data: sectionData }, { data: { user } }] = await Promise.all([
        supabase.from('subjects').select('id, name, icon').eq('id', subjectId).single(),
        supabase.from('sections').select('id, subject_id, name').eq('id', sectionId).single(),
        supabase.auth.getUser(),
      ])
      if (subjectData) setSubject(subjectData)
      if (sectionData) setSection(sectionData)
      if (user) setUserId(user.id)

      /* load questions directly by section_id — no topics needed */
      const { data: qs } = await supabase
        .from('questions')
        .select('*')
        .eq('section_id', sectionId)
        .order('id', { ascending: true })
      if (qs) setQuestions(qs)

      /* best result from localStorage */
      const stored = localStorage.getItem(`quiz_best_${sectionId}`)
      if (stored) { try { setBestResult(JSON.parse(stored)) } catch {} }

      setPhase('intro')
    }
    load()
  }, [subjectId, sectionId, router])

  /* ────────────────────────────────
     TIMER — per question countdown
  ──────────────────────────────── */
  useEffect(() => {
    if (phase !== 'playing' || showFeedback) return
    if (timeLeft <= 0) {
      processAnswer(null)   // time's up → wrong
      return
    }
    timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000)
    return () => { if (timerRef.current) clearTimeout(timerRef.current) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, phase, showFeedback])

  /* ────────────────────────────────
     ELAPSED TIME (total quiz time)
  ──────────────────────────────── */
  useEffect(() => {
    if (phase !== 'playing') {
      if (elapsedRef.current) clearInterval(elapsedRef.current)
      return
    }
    elapsedRef.current = setInterval(() => setElapsedSecs(Math.floor((Date.now() - startTime.current) / 1000)), 1000)
    return () => { if (elapsedRef.current) clearInterval(elapsedRef.current) }
  }, [phase])

  /* ────────────────────────────────
     START QUIZ
  ──────────────────────────────── */
  const startQuiz = useCallback((diff: Difficulty) => {
    const cfg = DIFFICULTY[diff]
    setDifficulty(diff)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setShowFeedback(false)
    setIsCorrect(null)
    setScore(0)
    setXP(0)
    setStreak(0)
    setMaxStreak(0)
    setTimeLeft(cfg.timePerQ)
    setElapsedSecs(0)
    setAnswers({})
    startTime.current = Date.now()
    setPhase('playing')
  }, [])

  /* ────────────────────────────────
     PROCESS ANSWER
  ──────────────────────────────── */
  // answer is 'A' | 'B' | 'C' | 'D' | null (null = time ran out)
  const processAnswer = useCallback((answer: string | null) => {
    if (showFeedback) return
    if (timerRef.current) clearTimeout(timerRef.current)

    const q       = questions[currentIndex]
    // Direct comparison: both correct_answer and answer use 'A'|'B'|'C'|'D'
    const correct = answer !== null && answer === q.correct_answer

    const newStreak    = correct ? streak + 1 : 0
    const newMaxStreak = Math.max(maxStreak, newStreak)

    setSelectedAnswer(answer ?? '')
    setIsCorrect(correct)
    setShowFeedback(true)
    setStreak(newStreak)
    setMaxStreak(newMaxStreak)
    setAnswers(prev => ({ ...prev, [q.id]: { selected: answer ?? '', correct } }))

    if (correct) {
      setScore(prev => prev + 1)
      setLastXPEarned(5)
      setShowXPPop(true)
      setTimeout(() => setShowXPPop(false), 1000)
      if (soundEnabled) {
        if (newStreak === 5 || newStreak === 7) playSound('streak')
        else playSound('correct')
      }
    } else {
      if (soundEnabled) playSound('wrong')
    }

    /* advance after 1.6 s */
    setTimeout(async () => {
      const nextIndex = currentIndex + 1
      if (nextIndex >= questions.length) {
        /* ── Quiz complete ── */
        const timeSeconds = Math.floor((Date.now() - startTime.current) / 1000)

        // Build final answers map including this last answer
        const finalAnswers = { ...answers, [q.id]: { selected: answer ?? '', correct } }
        const userAnswerMap: Record<number, string> = {}
        for (const [id, rec] of Object.entries(finalAnswers)) {
          userAnswerMap[Number(id)] = rec.selected
        }

        // Pure evaluation via evaluateQuiz
        const result = evaluateQuiz(questions, userAnswerMap, timeSeconds)

        // Update localStorage best
        const stored = localStorage.getItem(`quiz_best_${sectionId}`)
        const best: BestResult = {
          score:     result.accuracy,
          xp:        result.xp,
          accuracy:  result.accuracy,
          maxStreak: result.max_streak,
          difficulty,
        }
        if (!stored || JSON.parse(stored).score <= result.accuracy) {
          localStorage.setItem(`quiz_best_${sectionId}`, JSON.stringify(best))
          setBestResult(best)
        }

        if (soundEnabled) playSound('complete')
        setPhase('results')

        // Save to Supabase quiz_results + sync user_stats
        const uid = userId
        if (uid) {
          // 1. Direct insert into quiz_results
          await supabase.from('quiz_results').insert({
            user_id:         uid,
            subject_id:      Number(subjectId),
            section_id:      Number(sectionId),
            score:           result.correct_answers,
            correct_answers: result.correct_answers,
            total_questions: result.total_questions,
            xp_earned:       result.xp,
            max_streak:      result.max_streak,
            time_seconds:    result.time_seconds,
          })

          // 2. Update XP / streak in user_stats via gamification API
          fetch('/ent/api/update-gamification', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              userId:          uid,
              action:          'quiz_finished',
              section_id:      Number(sectionId),
              subject_id:      Number(subjectId),
              xp_earned:       result.xp,
              correct_answers: result.correct_answers,
              total_questions: result.total_questions,
              max_streak:      result.max_streak,
              difficulty,
              time_seconds:    result.time_seconds,
            }),
          }).catch(() => {})
        }
      } else {
        setCurrentIndex(nextIndex)
        setSelectedAnswer(null)
        setIsCorrect(null)
        setShowFeedback(false)
        setTimeLeft(DIFFICULTY[difficulty].timePerQ)
      }
    }, 1600)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, questions, difficulty, streak, maxStreak, answers, showFeedback, soundEnabled, sectionId, subjectId, userId])

  /* ─────────────────────────────────────────────
     RENDER: LOADING
  ───────────────────────────────────────────── */
  if (phase === 'loading') {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <div className="spinner" />
        </div>
      </>
    )
  }

  /* ─────────────────────────────────────────────
     RENDER: INTRO
  ───────────────────────────────────────────── */
  if (phase === 'intro') {
    return (
      <>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>
          {/* Breadcrumb */}
          <motion.button
            initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: EASE }}
            onClick={() => router.push(`/ent/dashboard/subjects/${subjectId}`)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 14, fontWeight: 700, padding: '4px 0', marginBottom: 24,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {subject?.name ?? 'Пән'}
          </motion.button>

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
            style={{
              background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
              borderRadius: 28, padding: '32px', marginBottom: 24,
              boxShadow: '0 20px 48px rgba(14,165,233,0.25)', position: 'relative', overflow: 'hidden',
            }}
          >
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
              backgroundSize: '40px 40px', pointerEvents: 'none',
            }} />
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: 'rgba(255,255,255,0.65)', letterSpacing: '0.08em', marginBottom: 10, textTransform: 'uppercase' }}>
                Модуль квизі
              </div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px', margin: '0 0 10px' }}>
                {section?.name ?? ''}
              </h1>
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>
                  📝 {questions.length} сұрақ
                </span>
                {bestResult && (
                  <span style={{ fontSize: 14, color: '#fbbf24', fontWeight: 800 }}>
                    ⭐ Үздік: {bestResult.score}% · {bestResult.xp} XP
                  </span>
                )}
              </div>
            </div>
          </motion.div>

          {questions.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.15 }}
              style={{
                textAlign: 'center', padding: '60px 24px',
                background: '#ffffff', borderRadius: 24,
                border: '1px solid rgba(226,232,240,0.9)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 8 }}>Сұрақтар жоқ</div>
              <div style={{ fontSize: 14, color: '#64748b' }}>Бұл модуль үшін сұрақтар әлі қосылмаған.</div>
            </motion.div>
          ) : (
            <>
              {/* Difficulty picker */}
              <motion.div
                initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.12 }}
                style={{
                  background: '#ffffff', borderRadius: 24, padding: '24px',
                  border: '1px solid rgba(226,232,240,0.9)',
                  boxShadow: '0 4px 20px rgba(14,165,233,0.06)', marginBottom: 16,
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b', marginBottom: 14, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                  Қиындық деңгейі
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
                  {(Object.keys(DIFFICULTY) as Difficulty[]).map(d => {
                    const cfg = DIFFICULTY[d]
                    const active = difficulty === d
                    return (
                      <motion.button
                        key={d}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setDifficulty(d)}
                        style={{
                          padding: '14px 12px', borderRadius: 16, cursor: 'pointer',
                          background: active ? cfg.bg : '#f8fafc',
                          border: `2px solid ${active ? cfg.color : 'rgba(226,232,240,0.8)'}`,
                          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
                        }}
                      >
                        <span style={{ fontSize: 24 }}>{cfg.emoji}</span>
                        <span style={{ fontSize: 14, fontWeight: 900, color: active ? cfg.color : '#64748b' }}>{cfg.label}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8' }}>{cfg.timePerQ}с / сұрақ</span>
                        <span style={{ fontSize: 11, fontWeight: 800, color: active ? cfg.color : '#94a3b8' }}>+{cfg.baseXP} XP</span>
                      </motion.button>
                    )
                  })}
                </div>
              </motion.div>

              {/* Sound toggle */}
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.18 }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  background: '#ffffff', borderRadius: 18, padding: '14px 20px',
                  border: '1px solid rgba(226,232,240,0.9)',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.04)', marginBottom: 20,
                }}
              >
                <span style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e' }}>
                  {soundEnabled ? '🔊' : '🔇'} Дыбыс
                </span>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSoundEnabled(p => !p)}
                  style={{
                    width: 48, height: 26, borderRadius: 999, cursor: 'pointer', border: 'none',
                    background: soundEnabled ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : '#e2e8f0',
                    position: 'relative', transition: 'background 0.25s ease',
                  }}
                >
                  <motion.div
                    animate={{ x: soundEnabled ? 22 : 2 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    style={{
                      position: 'absolute', top: 3, width: 20, height: 20,
                      borderRadius: '50%', background: '#fff',
                      boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                    }}
                  />
                </motion.button>
              </motion.div>

              {/* Start button */}
              <motion.button
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, ease: EASE, delay: 0.22 }}
                whileHover={{ scale: 1.03, boxShadow: '0 22px 50px rgba(14,165,233,0.40)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => startQuiz(difficulty)}
                style={{
                  width: '100%', padding: '18px', borderRadius: 18, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                  color: '#fff', fontSize: 17, fontWeight: 900, letterSpacing: '-0.2px',
                  boxShadow: '0 16px 36px rgba(14,165,233,0.30)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}
              >
                Квизді бастау
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </motion.button>
            </>
          )}
        </div>
      </>
    )
  }

  /* ─────────────────────────────────────────────
     RENDER: RESULTS
  ───────────────────────────────────────────── */
  if (phase === 'results') {
    const totalQ    = questions.length
    const accuracy  = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0
    const xpEarned  = score * 5          // xp = correct_answers * 5
    const cfg       = DIFFICULTY[difficulty]
    const isPerfect = accuracy === 100
    const isGood    = accuracy >= 70

    return (
      <>
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '32px 24px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            {/* Score hero */}
            <div style={{
              background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
              borderRadius: 28, padding: '36px 32px', marginBottom: 20, textAlign: 'center',
              boxShadow: '0 24px 56px rgba(14,165,233,0.28)', position: 'relative', overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
                backgroundSize: '40px 40px', pointerEvents: 'none',
              }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 56, marginBottom: 8 }}>
                  {isPerfect ? '🏆' : isGood ? '🌟' : '💪'}
                </div>
                <div style={{ fontSize: 72, fontWeight: 900, color: '#fff', letterSpacing: '-3px', lineHeight: 1 }}>
                  {accuracy}%
                </div>
                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.8)', fontWeight: 700, marginTop: 8 }}>
                  {score} / {totalQ} дұрыс жауап
                </div>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, marginTop: 16,
                  padding: '8px 18px', borderRadius: 999,
                  background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.25)',
                }}>
                  <span style={{ fontSize: 14, color: '#fff', fontWeight: 800 }}>
                    {cfg.emoji} {cfg.label}
                  </span>
                </div>
              </div>
            </div>

            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 12, marginBottom: 16 }}>
              {[
                { icon: '⚡', label: 'XP жинады',    value: `+${xpEarned} XP`,    color: '#0ea5e9' },
                { icon: '⏱',  label: 'Уақыт',        value: fmtTime(elapsedSecs), color: '#8b5cf6' },
                { icon: '🔥', label: 'Үздік стрик',   value: `${maxStreak} қатар`, color: '#f97316' },
                { icon: '🎯', label: 'Дәлдік',        value: `${accuracy}%`,       color: '#22c55e' },
              ].map(s => (
                <div key={s.label} style={{
                  background: '#ffffff', borderRadius: 20, padding: '20px',
                  border: '1px solid rgba(226,232,240,0.9)',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.04)', textAlign: 'center',
                }}>
                  <div style={{ fontSize: 28, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, letterSpacing: '-0.05em' }}>{s.value}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#94a3b8', marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Best result comparison */}
            {bestResult && (
              <div style={{
                background: 'rgba(251,191,36,0.08)', borderRadius: 18, padding: '16px 20px', marginBottom: 16,
                border: '1px solid rgba(251,191,36,0.2)',
                display: 'flex', alignItems: 'center', gap: 14,
              }}>
                <span style={{ fontSize: 28 }}>⭐</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 800, color: '#92400e' }}>Үздік нәтиже</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: '#b45309' }}>
                    {bestResult.score}% · +{bestResult.xp} XP · 🔥 {bestResult.maxStreak}
                  </div>
                </div>
              </div>
            )}

            {/* Review list */}
            <div style={{ background: '#ffffff', borderRadius: 22, overflow: 'hidden', border: '1px solid rgba(226,232,240,0.9)', marginBottom: 20, boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(226,232,240,0.7)', fontSize: 13, fontWeight: 800, color: '#64748b', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Жауаптар шолуы
              </div>
              {questions.map((q, i) => {
                const rec = answers[q.id]
                const ok  = rec?.correct ?? false
                return (
                  <div key={q.id} style={{
                    padding: '16px 20px',
                    borderBottom: i < questions.length - 1 ? '1px solid rgba(226,232,240,0.5)' : 'none',
                    display: 'flex', gap: 14, alignItems: 'flex-start',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 999, flexShrink: 0, marginTop: 2,
                      background: ok ? 'rgba(34,197,94,0.12)' : 'rgba(239,68,68,0.10)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900,
                      color: ok ? '#16a34a' : '#dc2626',
                    }}>
                      {ok ? '✓' : '✗'}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#0c4a6e', marginBottom: 4, lineHeight: 1.5 }}>
                        {i + 1}. {q.question_text}
                      </div>
                      {!ok && rec && rec.selected && (
                        <div style={{ fontSize: 13, color: '#dc2626', fontWeight: 700, marginBottom: 3 }}>
                          Сенің жауабың: {rec.selected} — {q[`option_${rec.selected.toLowerCase()}` as keyof Question] as string}
                        </div>
                      )}
                      <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 700, marginBottom: q.explanation ? 3 : 0 }}>
                        Дұрыс: {q.correct_answer} — {q[`option_${q.correct_answer.toLowerCase()}` as keyof Question] as string}
                      </div>
                      {q.explanation && (
                        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6, marginTop: 4 }}>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Action buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => startQuiz(difficulty)}
                style={{
                  padding: '16px', borderRadius: 16, border: 'none', cursor: 'pointer',
                  background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                  color: '#fff', fontSize: 15, fontWeight: 900,
                  boxShadow: '0 12px 28px rgba(14,165,233,0.28)',
                }}
              >
                🔄 Қайта өту
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                onClick={() => router.push(`/ent/dashboard/subjects/${subjectId}`)}
                style={{
                  padding: '16px', borderRadius: 16, cursor: 'pointer',
                  background: '#ffffff', border: '1.5px solid rgba(14,165,233,0.22)',
                  color: '#0284c7', fontSize: 15, fontWeight: 900,
                  boxShadow: '0 4px 16px rgba(14,165,233,0.08)',
                }}
              >
                ← Модульдер
              </motion.button>
            </div>
          </motion.div>
        </div>
      </>
    )
  }

  /* ─────────────────────────────────────────────
     RENDER: PLAYING
  ───────────────────────────────────────────── */
  const q   = questions[currentIndex]
  const cfg = DIFFICULTY[difficulty]
  const timerPct    = (timeLeft / cfg.timePerQ) * 100
  const timerColor  = timeLeft <= 5 ? '#ef4444' : timeLeft <= 10 ? '#f59e0b' : '#0ea5e9'
  const mult        = getMultiplier(streak)
  const multLabel   = multiplierLabel(streak)

  return (
    <>
      <div style={{ maxWidth: 700, margin: '0 auto', padding: '24px 24px 40px' }}>

        {/* ── Top bar ── */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <motion.button
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.97 }}
            onClick={() => { if (confirm('Квизден шығасыз ба?')) setPhase('intro') }}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', cursor: 'pointer',
              color: '#64748b', fontSize: 14, fontWeight: 700, padding: '6px 0',
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Шығу
          </motion.button>

          {/* XP counter */}
          <div style={{ position: 'relative' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(14,165,233,0.1)', borderRadius: 999,
              padding: '7px 16px',
            }}>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#0ea5e9' }}>⚡ {xp} XP</span>
              {multLabel && (
                <span style={{
                  fontSize: 11, fontWeight: 900, color: '#f97316',
                  background: 'rgba(249,115,22,0.12)', borderRadius: 999, padding: '2px 8px',
                }}>
                  {multLabel}
                </span>
              )}
            </div>
            {/* XP pop */}
            <AnimatePresence>
              {showXPPop && (
                <motion.div
                  initial={{ opacity: 0, y: 0, scale: 0.8 }}
                  animate={{ opacity: 1, y: -32, scale: 1 }}
                  exit={{ opacity: 0, y: -56 }}
                  transition={{ duration: 0.6, ease: EASE }}
                  style={{
                    position: 'absolute', top: 0, right: 0,
                    fontSize: 14, fontWeight: 900, color: '#22c55e',
                    pointerEvents: 'none', whiteSpace: 'nowrap',
                  }}
                >
                  +{lastXPEarned} XP {mult > 1 ? `×${mult}` : ''}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ── Progress & streak ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
          {/* Q counter */}
          <div style={{ fontSize: 14, fontWeight: 800, color: '#64748b', whiteSpace: 'nowrap' }}>
            {currentIndex + 1} / {questions.length}
          </div>
          {/* Question progress bar */}
          <div style={{ flex: 1, height: 5, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
            <motion.div
              animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              transition={{ duration: 0.4, ease: EASE }}
              style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }}
            />
          </div>
          {/* Streak */}
          {streak >= 2 && (
            <motion.div
              key={streak}
              initial={{ scale: 1.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.35, ease: EASE }}
              style={{
                display: 'flex', alignItems: 'center', gap: 4,
                background: 'rgba(249,115,22,0.12)', borderRadius: 999,
                padding: '5px 12px', whiteSpace: 'nowrap',
              }}
            >
              <span style={{ fontSize: 16 }}>🔥</span>
              <span style={{ fontSize: 14, fontWeight: 900, color: '#f97316' }}>{streak}</span>
              {mult > 1 && (
                <span style={{ fontSize: 11, fontWeight: 900, color: '#f97316' }}>×{mult}</span>
              )}
            </motion.div>
          )}
        </div>

        {/* ── Timer bar ── */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ height: 7, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 999,
              width: `${timerPct}%`,
              background: timerColor,
              transition: 'width 1s linear, background-color 0.4s ease',
            }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 5 }}>
            <span style={{
              fontSize: 13, fontWeight: 800,
              color: timeLeft <= 5 ? '#ef4444' : '#94a3b8',
            }}>
              {timeLeft}с
            </span>
          </div>
        </div>

        {/* ── Question card ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.38, ease: EASE }}
          >
            {/* Question text */}
            <div style={{
              background: '#ffffff', borderRadius: 24, padding: '28px',
              border: '1px solid rgba(226,232,240,0.9)',
              boxShadow: '0 8px 28px rgba(14,165,233,0.07)', marginBottom: 16,
            }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.06em', marginBottom: 12, textTransform: 'uppercase' }}>
                Сұрақ {currentIndex + 1}
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, color: '#0c4a6e', lineHeight: 1.65 }}>
                {q.question_text}
              </div>
            </div>

            {/* Options */}
            <div style={{ display: 'grid', gap: 10 }}>
              {OPTIONS.map(({ key, label }) => {
                const value = q[key] as string
                if (!value) return null

                const isSelected  = selectedAnswer === label           // 'A' === 'A'
                const isCorrOpt   = q.correct_answer === label         // 'A' === 'A'
                let bg = '#ffffff', border = 'rgba(226,232,240,0.9)', textColor = '#0c4a6e', shadowColor = 'rgba(0,0,0,0.04)'

                if (showFeedback) {
                  if (isCorrOpt) { bg = 'rgba(34,197,94,0.10)'; border = '#22c55e'; textColor = '#166534' }
                  else if (isSelected && !isCorrOpt) { bg = 'rgba(239,68,68,0.09)'; border = '#ef4444'; textColor = '#991b1b' }
                }

                return (
                  <motion.button
                    key={key}
                    whileHover={!showFeedback ? { scale: 1.015, boxShadow: '0 8px 28px rgba(14,165,233,0.14)' } : {}}
                    whileTap={!showFeedback ? { scale: 0.985 } : {}}
                    animate={
                      showFeedback && isCorrOpt
                        ? { scale: [1, 1.025, 1], transition: { duration: 0.4, ease: EASE } }
                        : showFeedback && isSelected && !isCorrOpt
                        ? { x: [0, -8, 8, -5, 5, 0], transition: { duration: 0.4 } }
                        : {}
                    }
                    onClick={() => !showFeedback && processAnswer(label)}
                    style={{
                      width: '100%', padding: '17px 20px', borderRadius: 18,
                      background: bg, border: `1.5px solid ${border}`,
                      cursor: showFeedback ? 'default' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 14,
                      boxShadow: `0 4px 16px ${shadowColor}`,
                      transition: 'background 0.2s ease, border-color 0.2s ease',
                    }}
                  >
                    {/* Letter badge */}
                    <div style={{
                      width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                      background: showFeedback && isCorrOpt
                        ? '#22c55e'
                        : showFeedback && isSelected && !isCorrOpt
                        ? '#ef4444'
                        : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                      border: `1px solid ${showFeedback && (isCorrOpt || (isSelected && !isCorrOpt)) ? 'transparent' : 'rgba(14,165,233,0.18)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 14, fontWeight: 900,
                      color: showFeedback && (isCorrOpt || (isSelected && !isCorrOpt)) ? '#fff' : '#0c4a6e',
                    }}>
                      {showFeedback && isCorrOpt ? '✓' : showFeedback && isSelected && !isCorrOpt ? '✗' : label}
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 700, color: textColor, textAlign: 'left', lineHeight: 1.5 }}>
                      {value}
                    </span>
                  </motion.button>
                )
              })}
            </div>

            {/* Explanation (during feedback) */}
            <AnimatePresence>
              {showFeedback && q.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.4, ease: EASE }}
                  style={{
                    marginTop: 14, padding: '16px 20px', borderRadius: 18,
                    background: isCorrect ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.07)',
                    border: `1px solid ${isCorrect ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.15)'}`,
                  }}
                >
                  <div style={{ fontSize: 12, fontWeight: 800, color: isCorrect ? '#16a34a' : '#dc2626', marginBottom: 6, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {isCorrect ? '✓ Дұрыс!' : '✗ Қате'}
                  </div>
                  <div style={{ fontSize: 14, color: '#475569', lineHeight: 1.65 }}>{q.explanation}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  )
}
