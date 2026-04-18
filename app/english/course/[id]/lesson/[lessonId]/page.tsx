'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Lesson = {
  id: string
  course_id: string
  title: string
  lesson_order: number
  reading_text: string | null
  writing_task: string | null
  listening_url: string | null
  listening_transcript: string | null
  vocabulary: VocabItem[] | null
}

type VocabItem = { en: string; ru: string }

type QuizQuestion = {
  id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: string
}

type Tab = 'reading' | 'writing' | 'listening' | 'vocabulary' | 'quiz'

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'reading',    label: 'Reading',    icon: '📖' },
  { key: 'writing',    label: 'Writing',    icon: '✍️' },
  { key: 'listening',  label: 'Listening',  icon: '🎧' },
  { key: 'vocabulary', label: 'Vocabulary', icon: '📝' },
  { key: 'quiz',       label: 'Quiz',       icon: '🎯' },
]

const QUIZ_TIME = 15 * 60

export default function LessonPage() {
  const { id: courseId, lessonId } = useParams<{ id: string; lessonId: string }>()
  const router = useRouter()

  const [lesson,    setLesson]    = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [loading,   setLoading]   = useState(true)
  const [userId,    setUserId]    = useState<string | null>(null)
  const [tab,       setTab]       = useState<Tab>('reading')
  const [sessionId, setSessionId] = useState<string | null>(null)
  const sessionStartRef = useRef<number>(Date.now())

  // Writing
  const [writingText,  setWritingText]  = useState('')
  const [writingSaved, setWritingSaved] = useState(false)

  // Quiz state
  const [quizPhase,         setQuizPhase]         = useState<'idle' | 'active' | 'done'>('idle')
  const [quizIndex,         setQuizIndex]         = useState(0)
  const [answers,           setAnswers]           = useState<Record<string, string>>({})
  const [selected,          setSelected]          = useState<string | null>(null)
  const [showAnswer,        setShowAnswer]        = useState(false)
  const [quizScore,         setQuizScore]         = useState(0)
  const [timeLeft,          setTimeLeft]          = useState(QUIZ_TIME)
  const [attempts,          setAttempts]          = useState(0)
  const [certificateIssued, setCertificateIssued] = useState(false)

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { router.push('/english/login'); return }
      setUserId(user.id)
      sessionStartRef.current = Date.now()

      // Start study session tracking
      supabase.from('english_study_sessions').insert({
        user_id: user.id,
        lesson_id: lessonId,
        started_at: new Date().toISOString(),
      }).select('id').single().then(({ data }) => {
        if (data) setSessionId((data as { id: string }).id)
      })

      const [lessonRes, questionsRes, progRes] = await Promise.all([
        supabase.from('english_lessons').select('*').eq('id', lessonId).single(),
        supabase.from('english_quiz_questions').select('*').eq('lesson_id', lessonId),
        supabase.from('english_progress').select('attempts').eq('user_id', user.id).eq('lesson_id', lessonId).maybeSingle(),
      ])

      if (lessonRes.data) {
        const raw = lessonRes.data as Lesson & { vocabulary: unknown }
        const vocab: VocabItem[] | null = (() => {
          if (!raw.vocabulary) return null
          if (Array.isArray(raw.vocabulary)) return raw.vocabulary as VocabItem[]
          try { return JSON.parse(raw.vocabulary as unknown as string) as VocabItem[] } catch { return null }
        })()
        setLesson({ ...raw, vocabulary: vocab })
      }

      setQuestions((questionsRes.data || []) as QuizQuestion[])
      setAttempts((progRes.data as { attempts: number } | null)?.attempts ?? 0)
      setLoading(false)
    }
    load()
  }, [lessonId, router])

  // Close study session on unmount
  useEffect(() => {
    return () => {
      const sid = sessionId
      const mins = Math.round((Date.now() - sessionStartRef.current) / 60000)
      if (sid && mins > 0) {
        supabase.from('english_study_sessions').update({
          ended_at: new Date().toISOString(),
          duration_minutes: mins,
        }).eq('id', sid).then(() => {})
      }
    }
  }, [sessionId])

  // Quiz timer
  useEffect(() => {
    if (quizPhase !== 'active') return
    if (timeLeft <= 0) { finishQuiz(); return }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000)
    return () => clearTimeout(t)
  }, [quizPhase, timeLeft])

  const startQuiz = () => {
    setQuizIndex(0)
    setAnswers({})
    setSelected(null)
    setShowAnswer(false)
    setTimeLeft(QUIZ_TIME)
    setQuizPhase('active')
  }

  const handleSelectOption = (opt: string) => {
    if (showAnswer) return
    setSelected(opt)
    setShowAnswer(true)
    const q = questions[quizIndex]
    setAnswers(prev => ({ ...prev, [q.id]: opt }))
  }

  const handleNext = () => {
    setSelected(null)
    setShowAnswer(false)
    if (quizIndex + 1 >= questions.length) { finishQuiz(); return }
    setQuizIndex(i => i + 1)
  }

  const finishQuiz = useCallback(async () => {
    const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0
    setQuizScore(score)
    setQuizPhase('done')
    setAttempts(prev => prev + 1)

    if (!userId) return

    const passed = score >= 70
    await supabase.from('english_progress').upsert({
      user_id: userId,
      lesson_id: lessonId,
      completed: passed,
      score,
      attempts: attempts + 1,
      completed_at: passed ? new Date().toISOString() : null,
    }, { onConflict: 'user_id,lesson_id' })

    if (!passed) return

    // Check if all lessons in the course are now completed
    const { data: allLessons } = await supabase
      .from('english_lessons')
      .select('id')
      .eq('course_id', courseId)

    if (!allLessons || allLessons.length === 0) return

    const { data: completedProgress } = await supabase
      .from('english_progress')
      .select('lesson_id')
      .eq('user_id', userId)
      .eq('completed', true)
      .in('lesson_id', allLessons.map((l: { id: string }) => l.id))

    const completedIds = new Set(completedProgress?.map((p: { lesson_id: string }) => p.lesson_id) || [])
    completedIds.add(lessonId)

    const allComplete = allLessons.every((l: { id: string }) => completedIds.has(l.id))
    if (!allComplete) return

    // Verify no certificate already exists
    const { data: existingCert } = await supabase
      .from('english_certificates')
      .select('id')
      .eq('user_id', userId)
      .eq('course_id', courseId)
      .maybeSingle()

    if (existingCert) return

    const year = new Date().getFullYear()
    const rand = Math.floor(100000 + Math.random() * 900000)
    await supabase.from('english_certificates').insert({
      user_id: userId,
      course_id: courseId,
      certificate_number: `KE-${year}-${rand}`,
      issued_at: new Date().toISOString(),
    })
    setCertificateIssued(true)
  }, [questions, answers, userId, lessonId, courseId, attempts])

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Загрузка урока...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#fff' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😕</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#0c4a6e', marginBottom: 16 }}>Урок не найден</div>
          <button className="btn-primary" onClick={() => router.push(`/english/course/${courseId}`)}>← Назад</button>
        </div>
      </div>
    )
  }

  const currentQ = questions[quizIndex]
  const OPTIONS: { key: 'option_a'|'option_b'|'option_c'|'option_d'; label: string }[] = [
    { key: 'option_a', label: 'A' }, { key: 'option_b', label: 'B' },
    { key: 'option_c', label: 'C' }, { key: 'option_d', label: 'D' },
  ]

  return (
    <div style={{ background: 'var(--bg-soft)', minHeight: '100vh' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />

      {/* NAV */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(18px)',
        borderBottom: '1px solid rgba(14,165,233,0.1)',
        padding: '0 5%',
      }}>
        <div style={{ maxWidth: 900, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <button
            onClick={() => router.push(`/english/course/${courseId}`)}
            className="btn-secondary"
            style={{ padding: '8px 16px', fontSize: 13 }}
          >
            ← Назад к курсу
          </button>
          <span style={{ fontSize: 13, fontWeight: 800, color: '#64748b' }}>
            Урок {lesson.lesson_order}: {lesson.title}
          </span>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '32px 5%', position: 'relative', zIndex: 1 }}>

        {/* LESSON TITLE */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', margin: 0 }}>
            {lesson.title}
          </h1>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: 12,
                border: tab === t.key ? '2px solid rgba(14,165,233,0.5)' : '1.5px solid rgba(14,165,233,0.15)',
                background: tab === t.key ? 'rgba(14,165,233,0.08)' : '#fff',
                color: tab === t.key ? '#0284c7' : '#94a3b8',
                fontWeight: tab === t.key ? 900 : 700,
                fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap',
                transition: 'all 0.2s',
              }}
            >
              <span>{t.icon}</span> {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >

            {/* READING */}
            {tab === 'reading' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>📖</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Reading</h2>
                </div>
                {lesson.reading_text ? (
                  <div style={{ fontSize: 15, lineHeight: 1.9, color: '#334155', whiteSpace: 'pre-wrap', fontWeight: 600 }}>
                    {lesson.reading_text}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontWeight: 700 }}>Текст для чтения не добавлен</div>
                )}
              </div>
            )}

            {/* WRITING */}
            {tab === 'writing' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>✍️</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Writing</h2>
                </div>
                {lesson.writing_task && (
                  <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 20, fontSize: 15, lineHeight: 1.7, color: '#0369a1', fontWeight: 700 }}>
                    📋 {lesson.writing_task}
                  </div>
                )}
                <textarea
                  value={writingText}
                  onChange={e => { setWritingText(e.target.value); setWritingSaved(false) }}
                  placeholder="Write your answer here..."
                  rows={8}
                  style={{ width: '100%', padding: '16px', borderRadius: 16, border: '1.5px solid rgba(14,165,233,0.2)', background: '#fff', color: '#0f172a', fontSize: 14, fontWeight: 600, lineHeight: 1.8, resize: 'vertical', outline: 'none', boxSizing: 'border-box', transition: 'border-color 0.2s' }}
                  onFocus={e => { e.target.style.borderColor = 'rgba(14,165,233,0.5)' }}
                  onBlur={e => { e.target.style.borderColor = 'rgba(14,165,233,0.2)' }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                  <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>{writingText.trim().split(/\s+/).filter(Boolean).length} слов</span>
                  <button
                    className="btn-primary"
                    onClick={() => { localStorage.setItem(`eng_writing_${lessonId}`, writingText); setWritingSaved(true) }}
                  >
                    {writingSaved ? '✓ Сохранено' : 'Сохранить'}
                  </button>
                </div>
              </div>
            )}

            {/* LISTENING */}
            {tab === 'listening' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>🎧</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Listening</h2>
                </div>
                {lesson.listening_url ? (
                  <div style={{ marginBottom: 28 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>Аудио файл:</div>
                    <audio controls src={lesson.listening_url} style={{ width: '100%', borderRadius: 12 }} />
                  </div>
                ) : (
                  <div style={{ background: '#f8fafc', border: '1.5px dashed rgba(14,165,233,0.2)', borderRadius: 16, padding: '24px', marginBottom: 24, textAlign: 'center', color: '#94a3b8', fontSize: 14, fontWeight: 700 }}>
                    🎙️ Аудиофайл не загружен
                  </div>
                )}
                {lesson.listening_transcript && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 800, color: '#0ea5e9', marginBottom: 12 }}>📄 Транскрипция диалога:</div>
                    <div style={{ background: 'rgba(14,165,233,0.04)', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 16, padding: '20px', fontSize: 14, lineHeight: 1.9, color: '#334155', whiteSpace: 'pre-wrap', fontWeight: 600 }}>
                      {lesson.listening_transcript}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* VOCABULARY */}
            {tab === 'vocabulary' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>📝</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Vocabulary</h2>
                </div>
                {lesson.vocabulary && lesson.vocabulary.length > 0 ? (
                  <div style={{ display: 'grid', gap: 10 }}>
                    {lesson.vocabulary.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        style={{
                          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16,
                          padding: '14px 18px', borderRadius: 14, alignItems: 'center',
                          background: i % 2 === 0 ? 'rgba(14,165,233,0.04)' : '#f8fafc',
                          border: '1px solid rgba(14,165,233,0.1)',
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 800, color: '#0284c7' }}>{item.en}</div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: '#64748b' }}>{item.ru}</div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: '#94a3b8', fontWeight: 700 }}>Словарь не добавлен</div>
                )}
              </div>
            )}

            {/* QUIZ */}
            {tab === 'quiz' && (
              <div className="glass-card" style={{ padding: 32 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
                  <span style={{ fontSize: 20 }}>🎯</span>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', margin: 0 }}>Quiz</h2>
                </div>

                {questions.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: 40, marginBottom: 12 }}>📭</div>
                    <div style={{ fontWeight: 700 }}>Вопросы не добавлены</div>
                  </div>
                ) : quizPhase === 'idle' ? (
                  <div style={{ textAlign: 'center', padding: '32px 0' }}>
                    <div style={{ fontSize: 56, marginBottom: 16 }}>🎯</div>
                    <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', marginBottom: 8 }}>Готов к тесту?</div>
                    <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.7, marginBottom: 8, fontWeight: 600 }}>
                      {questions.length} вопросов · Таймер 15 минут · Проходной балл 70%
                    </div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 28, fontWeight: 600 }}>
                      Попыток: {attempts} / 3 максимум
                    </div>
                    {attempts >= 3 ? (
                      <div style={{ fontSize: 14, color: '#ef4444', fontWeight: 800 }}>Исчерпан лимит попыток (3/3)</div>
                    ) : (
                      <button className="hero-primary shine-wrap" onClick={startQuiz}>
                        <span className="shine-line" />
                        ▶ Начать тест
                      </button>
                    )}
                  </div>
                ) : quizPhase === 'active' && currentQ ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 800, color: '#64748b' }}>
                        Вопрос {quizIndex + 1} из {questions.length}
                      </div>
                      <div className="badge-pill" style={{ fontSize: 13, fontWeight: 900, color: timeLeft < 60 ? '#ef4444' : '#0ea5e9', borderColor: timeLeft < 60 ? 'rgba(239,68,68,0.3)' : undefined, background: timeLeft < 60 ? 'rgba(239,68,68,0.08)' : undefined }}>
                        ⏱ {formatTime(timeLeft)}
                      </div>
                    </div>
                    <div className="progress-line" style={{ marginBottom: 24 }}>
                      <div className="progress-fill" style={{ width: `${((quizIndex + 1) / questions.length) * 100}%` }} />
                    </div>

                    <div style={{ fontSize: 17, fontWeight: 800, lineHeight: 1.7, color: '#0f172a', marginBottom: 24 }}>{currentQ.question}</div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {OPTIONS.map(opt => {
                        const text = currentQ[opt.key]
                        const isSelected = selected === opt.label
                        const isCorrect  = currentQ.correct_answer === opt.label
                        const bg = showAnswer
                          ? isCorrect ? 'rgba(34,197,94,0.08)' : isSelected ? 'rgba(239,68,68,0.06)' : '#f8fafc'
                          : isSelected ? 'rgba(14,165,233,0.08)' : '#f8fafc'
                        const border = showAnswer
                          ? isCorrect ? '1.5px solid rgba(34,197,94,0.5)' : isSelected ? '1.5px solid rgba(239,68,68,0.4)' : '1px solid rgba(14,165,233,0.1)'
                          : isSelected ? '1.5px solid rgba(14,165,233,0.5)' : '1px solid rgba(14,165,233,0.1)'
                        const color = showAnswer
                          ? isCorrect ? '#16a34a' : isSelected ? '#ef4444' : '#334155'
                          : isSelected ? '#0284c7' : '#334155'

                        return (
                          <button
                            key={opt.label}
                            onClick={() => handleSelectOption(opt.label)}
                            disabled={showAnswer}
                            style={{
                              display: 'flex', alignItems: 'center', gap: 14,
                              padding: '14px 18px', borderRadius: 14, border, background: bg,
                              color, fontWeight: 700, fontSize: 14,
                              cursor: showAnswer ? 'default' : 'pointer',
                              textAlign: 'left', transition: 'all 0.2s',
                            }}
                          >
                            <span style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(14,165,233,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 900, flexShrink: 0, color: '#0ea5e9' }}>{opt.label}</span>
                            <span style={{ flex: 1 }}>{text}</span>
                            {showAnswer && isCorrect && <span style={{ color: '#16a34a' }}>✓</span>}
                            {showAnswer && isSelected && !isCorrect && <span style={{ color: '#ef4444' }}>✗</span>}
                          </button>
                        )
                      })}
                    </div>

                    {showAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}
                      >
                        <button className="btn-primary" onClick={handleNext}>
                          {quizIndex + 1 >= questions.length ? 'Завершить' : 'Следующий →'}
                        </button>
                      </motion.div>
                    )}
                  </div>
                ) : quizPhase === 'done' ? (
                  <div style={{ textAlign: 'center', padding: '24px 0' }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>{quizScore >= 70 ? '🏆' : '😔'}</div>
                    <div style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', marginBottom: 8 }}>
                      {quizScore >= 70 ? 'Тест пройден!' : 'Тест не пройден'}
                    </div>
                    <div style={{ fontSize: 48, fontWeight: 900, color: quizScore >= 70 ? '#22c55e' : '#ef4444', letterSpacing: '-0.05em', marginBottom: 8 }}>{quizScore}%</div>
                    <div style={{ fontSize: 14, color: '#64748b', fontWeight: 700, marginBottom: certificateIssued ? 16 : 28 }}>
                      {quizScore >= 70 ? 'Урок засчитан. Можно перейти к следующему!' : `Проходной балл: 70%. Попыток: ${attempts}/3`}
                    </div>
                    {certificateIssued && (
                      <div style={{
                        marginBottom: 24, padding: '16px 20px', borderRadius: 16,
                        background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(255,255,255,0.9))',
                        border: '1.5px solid rgba(34,197,94,0.35)',
                        fontSize: 14, fontWeight: 800, color: '#16a34a',
                      }}>
                        🏆 Поздравляем! Вы прошли весь курс — сертификат выдан в ваш профиль!
                      </div>
                    )}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                      {quizScore < 70 && attempts < 3 && (
                        <button className="btn-primary" onClick={startQuiz}>Попробовать снова</button>
                      )}
                      <button className="btn-secondary" onClick={() => router.push(`/english/course/${courseId}`)}>← Назад к курсу</button>
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
