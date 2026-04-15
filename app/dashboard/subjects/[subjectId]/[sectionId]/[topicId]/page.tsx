'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Topic = {
  id: number
  name: string
}

type TopicContent = {
  id: number
  topic_id: number
  content_type: string
  content_text: string | null
  image_url: string | null
  order_index: number
}

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
  question_type: string
  points: number
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function TopicPage() {
  const params = useParams()
  const subjectId = Number(params.subjectId)
  const sectionId = Number(params.sectionId)
  const topicId = Number(params.topicId)

  const [loading, setLoading] = useState(true)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [pdfUrl, setPdfUrl] = useState('')
  const [questions, setQuestions] = useState<Question[]>([])
  const [hasPdf, setHasPdf] = useState(false)
  const [hasQuiz, setHasQuiz] = useState(false)

  const [quizStarted, setQuizStarted] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [showFeedback, setShowFeedback] = useState(false)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [finished, setFinished] = useState(false)

  const [lives, setLives] = useState(5)
  const [xp, setXp] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      const [{ data: topicData }, { data: contentData }, { data: questionsData }] =
        await Promise.all([
          supabase.from('topics').select('id, name').eq('id', topicId).single(),
          supabase.from('topic_content').select('*').eq('topic_id', topicId).order('order_index', { ascending: true }),
          supabase.from('questions').select('*').eq('topic_id', topicId).order('id', { ascending: true }),
        ])

      if (topicData) setTopic(topicData as Topic)

      const pdfItem = (contentData || []).find((item: TopicContent) => item.content_type === 'pdf')
      if (pdfItem?.image_url) {
        setPdfUrl(pdfItem.image_url)
        setHasPdf(true)
      } else {
        setPdfUrl('')
        setHasPdf(false)
      }

      const loadedQuestions = (questionsData || []) as Question[]
      setQuestions(loadedQuestions)
      setHasQuiz(loadedQuestions.length > 0)
      setLoading(false)
    }
    if (topicId) loadData()
  }, [topicId])

  const currentQuestion = questions[currentIndex] || null

  const score = useMemo(() => {
    return questions.reduce((sum, q) => {
      const picked = answers[q.id]
      return sum + (picked === q.correct_answer ? q.points || 1 : 0)
    }, 0)
  }, [questions, answers])

  const maxScore = useMemo(() => {
    return questions.reduce((sum, q) => sum + (q.points || 1), 0)
  }, [questions])

  const handleSelect = (letter: string) => {
    if (showFeedback || !currentQuestion) return
    setSelectedAnswer(letter)
    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: letter }))
    const correct = currentQuestion.correct_answer === letter
    if (correct) {
      setXp((prev) => prev + 10)
    } else {
      setLives((prev) => Math.max(0, prev - 1))
    }
    setShowFeedback(true)
  }

  const handleNext = () => {
    if (lives <= 0) { setFinished(true); return }
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setFinished(true)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Жүктелуде...</p>
        </div>
      </div>
    )
  }

  if (!topic) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: 15, fontWeight: 700 }}>Тақырып табылмады</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      {/* Back link */}
      <motion.div {...fadeUp(0)}>
        <Link href={`/dashboard/subjects/${subjectId}/${sectionId}`} style={{ color: '#0ea5e9', fontWeight: 800, textDecoration: 'none', fontSize: 14 }}>
          ← Модульге қайту
        </Link>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.04)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 28,
          boxShadow: '0 14px 32px rgba(14,165,233,0.07)',
        }}
      >
        <div style={{ display: 'inline-flex', padding: '7px 12px', borderRadius: 999, background: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 800, marginBottom: 14 }}>
          САБАҚ
        </div>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', margin: '0 0 10px' }}>
          {topic.name}
        </h1>
        <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, margin: 0, fontWeight: 600 }}>
          {hasPdf && hasQuiz && 'Алдымен сабақты оқы, содан кейін төмендегі квизді баста.'}
          {hasPdf && !hasQuiz && 'Бұл тақырыпта PDF сабақ бар.'}
          {!hasPdf && hasQuiz && 'Бұл тақырыпта квиз бар. Дайын болсаң, баста.'}
          {!hasPdf && !hasQuiz && 'Бұл тақырыпқа контент әлі толық қосылмаған.'}
        </p>
      </motion.div>

      {/* PDF block */}
      {hasPdf && (
        <motion.div
          {...fadeUp(0.08)}
          style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
        >
          <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', marginBottom: 16, letterSpacing: '-0.03em' }}>PDF сабақ</div>
          {pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="720"
              style={{ border: '1px solid rgba(14,165,233,0.14)', borderRadius: 16 }}
            />
          ) : (
            <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>PDF табылмады</div>
          )}
        </motion.div>
      )}

      {/* Quiz block */}
      {hasQuiz && (
        <motion.div
          {...fadeUp(0.12)}
          style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 26, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
        >
          {/* Quiz header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, marginBottom: 18 }}>
            <div>
              <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>Геймификациялы квиз</div>
              <div style={{ marginTop: 6, color: '#64748b', fontSize: 13, fontWeight: 600 }}>
                {questions.length ? `${questions.length} сұрақ` : 'Сұрақтар жоқ'}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[{ label: `❤️ ${lives}` }, { label: `⭐ ${xp}` }].map((h) => (
                <div key={h.label} style={{ background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 12, padding: '9px 14px', fontWeight: 900, color: '#0c4a6e', fontSize: 14 }}>
                  {h.label}
                </div>
              ))}
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!quizStarted ? (
              <motion.div
                key="intro"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16 }}
              >
                <div style={{ color: '#475569', fontSize: 14, fontWeight: 600 }}>
                  {hasPdf && hasQuiz && 'Сабақты қарап болған соң, квизді баста.'}
                  {!hasPdf && hasQuiz && 'Дайын болсаң, бірден квизді баста.'}
                </div>
                {questions.length > 0 && (
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setQuizStarted(true)}
                    style={{ border: 'none', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', borderRadius: 14, padding: '13px 20px', fontWeight: 900, cursor: 'pointer', boxShadow: '0 10px 22px rgba(14,165,233,0.2)', fontSize: 14 }}
                  >
                    Квизді бастау
                  </motion.button>
                )}
              </motion.div>
            ) : finished ? (
              <motion.div key="finished" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                {/* Results */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 24 }}>
                  {[
                    { label: 'Жалпы балл', value: `${score} / ${maxScore}` },
                    { label: 'Пайыз', value: `${maxScore ? Math.round((score / maxScore) * 100) : 0}%` },
                    { label: 'XP', value: String(xp) },
                  ].map((r) => (
                    <div key={r.label} style={{ background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 18, padding: 20, textAlign: 'center' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 8, fontWeight: 700 }}>{r.label}</div>
                      <div style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' }}>{r.value}</div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {questions.map((q, index) => {
                    const picked = answers[q.id] || 'Жауап жоқ'
                    const correct = picked === q.correct_answer
                    return (
                      <div key={q.id} style={{ border: `1px solid ${correct ? '#bbf7d0' : '#fecaca'}`, borderRadius: 16, padding: 16, background: correct ? '#f0fdf4' : '#fef2f2' }}>
                        <div style={{ fontSize: 15, fontWeight: 700, color: '#0c4a6e', lineHeight: 1.6, marginBottom: 8 }}>
                          {index + 1}. {q.question_text}
                        </div>
                        <div style={{ fontSize: 13, color: '#475569', fontWeight: 600 }}>
                          Сенің жауабың: <b>{picked}</b> | Дұрыс жауап: <b>{q.correct_answer}</b>
                        </div>
                        {q.explanation && (
                          <div style={{ marginTop: 8, fontSize: 13, color: '#334155', lineHeight: 1.7, fontWeight: 600 }}>{q.explanation}</div>
                        )}
                        <div style={{ marginTop: 8, fontSize: 13, fontWeight: 900, color: correct ? '#166534' : '#991b1b' }}>
                          {correct ? 'Дұрыс' : 'Қате'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </motion.div>
            ) : currentQuestion ? (
              <motion.div key={`q-${currentIndex}`} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.3 }}>
                <div style={{ color: '#64748b', fontSize: 13, fontWeight: 700, marginBottom: 14 }}>
                  {currentIndex + 1} / {questions.length}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', lineHeight: 1.5, marginBottom: 20, letterSpacing: '-0.02em' }}>
                  {currentQuestion.question_text}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const text = currentQuestion[`option_${letter.toLowerCase()}` as keyof Question] as string
                    const isCorrect = currentQuestion.correct_answer === letter
                    const isSelected = selectedAnswer === letter
                    let bg = '#fff'
                    let border = '1px solid rgba(14,165,233,0.14)'
                    if (showFeedback) {
                      if (isCorrect) { bg = '#dcfce7'; border = '1px solid #86efac' }
                      else if (isSelected) { bg = '#fee2e2'; border = '1px solid #fca5a5' }
                    }
                    return (
                      <motion.button
                        key={letter}
                        whileHover={!showFeedback ? { scale: 1.01 } : {}}
                        type="button"
                        onClick={() => handleSelect(letter)}
                        style={{
                          display: 'flex', gap: 14, alignItems: 'flex-start', width: '100%',
                          borderRadius: 16, padding: 16, textAlign: 'left',
                          background: bg, border, cursor: showFeedback ? 'default' : 'pointer',
                        }}
                      >
                        <div style={{ minWidth: 34, height: 34, borderRadius: 999, background: '#e0f2fe', color: '#0ea5e9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 14 }}>
                          {letter}
                        </div>
                        <div style={{ flex: 1, fontSize: 15, color: '#0c4a6e', lineHeight: 1.6, fontWeight: 600 }}>{text}</div>
                      </motion.button>
                    )
                  })}
                </div>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ marginTop: 20, padding: 18, borderRadius: 16, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)' }}
                  >
                    <div style={{ fontSize: 17, fontWeight: 900, color: selectedAnswer === currentQuestion.correct_answer ? '#166534' : '#991b1b' }}>
                      {selectedAnswer === currentQuestion.correct_answer ? 'Дұрыс!' : 'Қате'}
                    </div>
                    {currentQuestion.explanation && (
                      <div style={{ marginTop: 10, color: '#334155', lineHeight: 1.7, fontSize: 14, fontWeight: 600 }}>{currentQuestion.explanation}</div>
                    )}
                    {lives <= 0 && (
                      <div style={{ marginTop: 10, color: '#991b1b', fontWeight: 700, fontSize: 14 }}>Өмір қалмады</div>
                    )}
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={handleNext}
                      style={{ marginTop: 14, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', borderRadius: 12, padding: '11px 18px', fontWeight: 900, cursor: 'pointer', fontSize: 14, boxShadow: '0 8px 18px rgba(14,165,233,0.2)' }}
                    >
                      {currentIndex === questions.length - 1 || lives <= 0 ? 'Аяқтау' : 'Келесі'}
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <div style={{ color: '#94a3b8', fontSize: 14, fontWeight: 600 }}>Сұрақтар табылмады</div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  )
}
