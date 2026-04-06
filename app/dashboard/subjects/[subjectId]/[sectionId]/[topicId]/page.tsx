'use client'

import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useMemo, useState } from 'react'
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
          supabase
            .from('topic_content')
            .select('*')
            .eq('topic_id', topicId)
            .order('order_index', { ascending: true }),
          supabase
            .from('questions')
            .select('*')
            .eq('topic_id', topicId)
            .order('id', { ascending: true }),
        ])

      if (topicData) setTopic(topicData as Topic)

      const pdfItem = (contentData || []).find(
        (item: TopicContent) => item.content_type === 'pdf'
      )

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
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: letter,
    }))

    const correct = currentQuestion.correct_answer === letter

    if (correct) {
      setXp((prev) => prev + 10)
    } else {
      setLives((prev) => Math.max(0, prev - 1))
    }

    setShowFeedback(true)
  }

  const handleNext = () => {
    if (lives <= 0) {
      setFinished(true)
      return
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setSelectedAnswer(null)
      setShowFeedback(false)
    } else {
      setFinished(true)
    }
  }

  if (loading) {
    return <div style={pageStyle}>Жүктелуде...</div>
  }

  if (!topic) {
    return <div style={pageStyle}>Тақырып табылмады</div>
  }

  const showPdfBlock = hasPdf
  const showQuizBlock = hasQuiz

  return (
    <div style={pageStyle}>
      <div style={containerStyle}>
        <div style={topBarStyle}>
          <Link href={`/dashboard/subjects/${subjectId}/${sectionId}`} style={backLinkStyle}>
            ← Модульге қайту
          </Link>
        </div>

        <div style={heroStyle}>
          <div style={badgeStyle}>САБАҚ</div>
          <h1 style={titleStyle}>{topic.name}</h1>

          <p style={subtitleStyle}>
            {hasPdf && hasQuiz && 'Алдымен сабақты оқы, содан кейін төмендегі квизді баста.'}
            {hasPdf && !hasQuiz && 'Бұл тақырыпта PDF сабақ бар.'}
            {!hasPdf && hasQuiz && 'Бұл тақырыпта квиз бар. Дайын болсаң, баста.'}
            {!hasPdf && !hasQuiz && 'Бұл тақырыпқа контент әлі толық қосылмаған.'}
          </p>
        </div>

        {showPdfBlock && (
          <div style={cardStyle}>
            <div style={sectionTitleStyle}>PDF сабақ</div>

            {pdfUrl ? (
              <iframe
                src={pdfUrl}
                width="100%"
                height="720"
                style={{
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  marginTop: '12px',
                }}
              />
            ) : (
              <div style={emptyStyle}>PDF табылмады</div>
            )}
          </div>
        )}

        {showQuizBlock && (
          <div style={cardStyle}>
            <div style={quizHeaderStyle}>
              <div>
                <div style={sectionTitleStyle}>Геймификациялы квиз</div>
                <div style={sectionSubtleStyle}>
                  {questions.length ? `${questions.length} сұрақ` : 'Сұрақтар жоқ'}
                </div>
              </div>

              <div style={hudStyle}>
                <div style={hudItemStyle}>❤️ {lives}</div>
                <div style={hudItemStyle}>⭐ {xp}</div>
              </div>
            </div>

            {!quizStarted ? (
              <div style={quizIntroWrapStyle}>
                <div style={quizIntroStyle}>
                  {hasPdf && hasQuiz && 'Сабақты қарап болған соң, квизді баста.'}
                  {!hasPdf && hasQuiz && 'Дайын болсаң, бірден квизді баста.'}
                </div>

                {questions.length > 0 ? (
                  <button onClick={() => setQuizStarted(true)} style={startButtonStyle}>
                    Квизді бастау
                  </button>
                ) : null}
              </div>
            ) : finished ? (
              <div>
                <div style={resultGridStyle}>
                  <div style={resultBoxStyle}>
                    <div style={resultLabelStyle}>Жалпы балл</div>
                    <div style={resultValueStyle}>
                      {score} / {maxScore}
                    </div>
                  </div>

                  <div style={resultBoxStyle}>
                    <div style={resultLabelStyle}>Пайыз</div>
                    <div style={resultValueStyle}>
                      {maxScore ? Math.round((score / maxScore) * 100) : 0}%
                    </div>
                  </div>

                  <div style={resultBoxStyle}>
                    <div style={resultLabelStyle}>XP</div>
                    <div style={resultValueStyle}>{xp}</div>
                  </div>
                </div>

                <div style={{ marginTop: 24 }}>
                  {questions.map((q, index) => {
                    const picked = answers[q.id] || 'Жауап жоқ'
                    const correct = picked === q.correct_answer

                    return (
                      <div key={q.id} style={reviewCardStyle}>
                        <div style={reviewQuestionStyle}>
                          {index + 1}. {q.question_text}
                        </div>
                        <div style={reviewMetaStyle}>
                          Сенің жауабың: <b>{picked}</b> | Дұрыс жауап: <b>{q.correct_answer}</b>
                        </div>
                        {q.explanation ? (
                          <div style={reviewExplanationStyle}>{q.explanation}</div>
                        ) : null}
                        <div
                          style={{
                            ...reviewStatusStyle,
                            color: correct ? '#166534' : '#991B1B',
                          }}
                        >
                          {correct ? 'Дұрыс' : 'Қате'}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : currentQuestion ? (
              <div>
                <div style={progressStyle}>
                  {currentIndex + 1} / {questions.length}
                </div>

                <div style={questionStyle}>{currentQuestion.question_text}</div>

                <div style={optionsWrapStyle}>
                  {(['A', 'B', 'C', 'D'] as const).map((letter) => {
                    const text =
                      currentQuestion[`option_${letter.toLowerCase()}` as keyof Question] as string
                    const isCorrect = currentQuestion.correct_answer === letter
                    const isSelected = selectedAnswer === letter

                    let background = '#FFFFFF'
                    let border = '1px solid #E2E8F0'

                    if (showFeedback) {
                      if (isCorrect) {
                        background = '#DCFCE7'
                        border = '1px solid #86EFAC'
                      } else if (isSelected) {
                        background = '#FEE2E2'
                        border = '1px solid #FCA5A5'
                      }
                    }

                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => handleSelect(letter)}
                        style={{
                          ...optionStyle,
                          background,
                          border,
                          cursor: showFeedback ? 'default' : 'pointer',
                        }}
                      >
                        <div style={optionLetterStyle}>{letter}</div>
                        <div style={optionTextStyle}>{text}</div>
                      </button>
                    )
                  })}
                </div>

                {showFeedback ? (
                  <div style={feedbackBoxStyle}>
                    <div
                      style={{
                        fontSize: '18px',
                        fontWeight: 800,
                        color:
                          selectedAnswer === currentQuestion.correct_answer
                            ? '#166534'
                            : '#991B1B',
                      }}
                    >
                      {selectedAnswer === currentQuestion.correct_answer ? 'Дұрыс!' : 'Қате'}
                    </div>

                    {currentQuestion.explanation ? (
                      <div style={feedbackTextStyle}>{currentQuestion.explanation}</div>
                    ) : null}

                    {lives <= 0 ? (
                      <div style={{ marginTop: 10, color: '#991B1B', fontWeight: 700 }}>
                        Өмір қалмады
                      </div>
                    ) : null}

                    <button onClick={handleNext} style={nextButtonStyle}>
                      {currentIndex === questions.length - 1 || lives <= 0 ? 'Аяқтау' : 'Келесі'}
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div style={emptyStyle}>Сұрақтар табылмады</div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const pageStyle: React.CSSProperties = {
  minHeight: '100vh',
  background: '#F8FAFC',
  padding: '24px',
}

const containerStyle: React.CSSProperties = {
  maxWidth: '1100px',
  margin: '0 auto',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
}

const topBarStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
}

const backLinkStyle: React.CSSProperties = {
  color: '#0EA5E9',
  fontWeight: 700,
  textDecoration: 'none',
}

const heroStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '24px',
  padding: '28px',
}

const badgeStyle: React.CSSProperties = {
  display: 'inline-block',
  background: '#E0F2FE',
  color: '#0369A1',
  borderRadius: '999px',
  padding: '8px 12px',
  fontSize: '12px',
  fontWeight: 800,
}

const titleStyle: React.CSSProperties = {
  marginTop: '14px',
  fontSize: '34px',
  fontWeight: 800,
  color: '#0F172A',
}

const subtitleStyle: React.CSSProperties = {
  marginTop: '10px',
  fontSize: '15px',
  color: '#64748B',
  lineHeight: 1.7,
}

const cardStyle: React.CSSProperties = {
  background: '#FFFFFF',
  border: '1px solid #E2E8F0',
  borderRadius: '24px',
  padding: '24px',
}

const sectionTitleStyle: React.CSSProperties = {
  fontSize: '22px',
  fontWeight: 800,
  color: '#0F172A',
}

const emptyStyle: React.CSSProperties = {
  marginTop: '16px',
  color: '#64748B',
}

const quizHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}

const sectionSubtleStyle: React.CSSProperties = {
  marginTop: '6px',
  color: '#64748B',
  fontSize: '14px',
}

const hudStyle: React.CSSProperties = {
  display: 'flex',
  gap: '10px',
}

const hudItemStyle: React.CSSProperties = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '12px',
  padding: '10px 14px',
  fontWeight: 800,
  color: '#0F172A',
}

const quizIntroWrapStyle: React.CSSProperties = {
  marginTop: '18px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '16px',
}

const quizIntroStyle: React.CSSProperties = {
  color: '#475569',
  fontSize: '15px',
}

const startButtonStyle: React.CSSProperties = {
  border: 'none',
  background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
  color: '#FFFFFF',
  borderRadius: '14px',
  padding: '14px 18px',
  fontWeight: 800,
  cursor: 'pointer',
}

const progressStyle: React.CSSProperties = {
  color: '#64748B',
  fontSize: '14px',
  marginBottom: '16px',
  marginTop: '18px',
}

const questionStyle: React.CSSProperties = {
  fontSize: '24px',
  fontWeight: 700,
  color: '#0F172A',
  lineHeight: 1.55,
  marginBottom: '20px',
}

const optionsWrapStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
}

const optionStyle: React.CSSProperties = {
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  width: '100%',
  borderRadius: '16px',
  padding: '16px',
  textAlign: 'left',
}

const optionLetterStyle: React.CSSProperties = {
  minWidth: '34px',
  height: '34px',
  borderRadius: '999px',
  background: '#EFF6FF',
  color: '#0EA5E9',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 800,
}

const optionTextStyle: React.CSSProperties = {
  flex: 1,
  fontSize: '16px',
  color: '#0F172A',
  lineHeight: 1.6,
}

const feedbackBoxStyle: React.CSSProperties = {
  marginTop: '20px',
  padding: '18px',
  borderRadius: '16px',
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
}

const feedbackTextStyle: React.CSSProperties = {
  marginTop: '10px',
  color: '#334155',
  lineHeight: 1.7,
}

const nextButtonStyle: React.CSSProperties = {
  marginTop: '14px',
  border: 'none',
  background: '#0EA5E9',
  color: '#FFFFFF',
  borderRadius: '12px',
  padding: '12px 18px',
  fontWeight: 800,
  cursor: 'pointer',
}

const resultGridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '16px',
  marginTop: '18px',
}

const resultBoxStyle: React.CSSProperties = {
  background: '#F8FAFC',
  border: '1px solid #E2E8F0',
  borderRadius: '18px',
  padding: '20px',
}

const resultLabelStyle: React.CSSProperties = {
  fontSize: '14px',
  color: '#64748B',
  marginBottom: '8px',
}

const resultValueStyle: React.CSSProperties = {
  fontSize: '28px',
  fontWeight: 800,
  color: '#0F172A',
}

const reviewCardStyle: React.CSSProperties = {
  border: '1px solid #E2E8F0',
  borderRadius: '16px',
  padding: '16px',
  marginBottom: '12px',
}

const reviewQuestionStyle: React.CSSProperties = {
  fontSize: '16px',
  fontWeight: 700,
  color: '#0F172A',
  lineHeight: 1.6,
}

const reviewMetaStyle: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#475569',
}

const reviewExplanationStyle: React.CSSProperties = {
  marginTop: '8px',
  fontSize: '14px',
  color: '#0F172A',
  lineHeight: 1.6,
}

const reviewStatusStyle: React.CSSProperties = {
  marginTop: '10px',
  fontSize: '14px',
  fontWeight: 800,
}