'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '../../../../lib/supabase'

type SubjectTab = {
  id: number
  name: string
  count: number
}

type Question = {
  id: string
  subjectId: number
  subjectName: string
  number: number
  question: string
  optionA: string
  optionB: string
  optionC: string
  optionD: string
  contextText?: string
  points: number
  isMultiple?: boolean
  correctAnswers?: string[]
}

const TOTAL_TIME = 240 * 60

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SimulatorSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = String(params.sessionId || '1')

  const [profile1, setProfile1] = useState('')
  const [profile2, setProfile2] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)

  const tabs: SubjectTab[] = useMemo(() => [
    { id: 1, name: 'Қазақстан тарихы', count: 20 },
    { id: 2, name: 'Математикалық сауаттылық', count: 10 },
    { id: 3, name: 'Оқу сауаттылығы', count: 10 },
    { id: 4, name: profile1 || 'Профиль пән 1', count: 40 },
    { id: 5, name: profile2 || 'Профиль пән 2', count: 40 },
  ], [profile1, profile2])

  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingSubject, setLoadingSubject] = useState('')

  const [activeSubjectId, setActiveSubjectId] = useState<number>(1)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [showCalculator, setShowCalculator] = useState(false)
  const [showPeriodicTable, setShowPeriodicTable] = useState(false)
  const [calcValue, setCalcValue] = useState('0')
  const [timerStarted, setTimerStarted] = useState(false)

  // Профильді жүкте
  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setProfileLoaded(true); return }
      const { data } = await supabase
        .from('profiles')
        .select('profile_subject_1, profile_subject_2')
        .eq('id', user.id)
        .single()
      if (data) {
        setProfile1(data.profile_subject_1 || 'Шет тілі')
        setProfile2(data.profile_subject_2 || 'Дүниежүзі тарихы')
      }
      setProfileLoaded(true)
    }
    loadProfile()
  }, [])

  // Сұрақтарды жүкте
  useEffect(() => {
    if (!profileLoaded || !profile1 || !profile2) return

    async function generateQuestions() {
      const subjects = [
        { name: 'Қазақстан тарихы', id: 1, count: 20 },
        { name: 'Математикалық сауаттылық', id: 2, count: 10 },
        { name: 'Оқу сауаттылығы', id: 3, count: 10 },
        { name: profile1, id: 4, count: 40 },
        { name: profile2, id: 5, count: 40 },
      ]

      const allQuestions: Question[] = []
      let globalNumber = 1

      for (let i = 0; i < subjects.length; i++) {
        const subject = subjects[i]
        setLoadingSubject(subject.name)
        setLoadingProgress(Math.round((i / subjects.length) * 100))

        try {
          const res = await fetch('/api/generate-questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              subject: subject.name,
              count: subject.count,
              subjectId: subject.id,
            }),
          })
          const data = await res.json()
          if (data.questions) {
            data.questions.forEach((q: any) => {
              allQuestions.push({
                id: q.id,
                subjectId: subject.id,
                subjectName: subject.name,
                number: globalNumber++,
                question: q.question_text,
                optionA: q.option_a,
                optionB: q.option_b,
                optionC: q.option_c,
                optionD: q.option_d,
                contextText: q.context_text || '',
                points: q.points || 1,
                isMultiple: q.is_multiple || false,
                correctAnswers: q.correct_answers || null,
              })
            })
          }
        } catch (e) {
          console.error('Error generating', subject.name, e)
        }
      }

      setLoadingProgress(100)
      setQuestions(allQuestions)
      setLoadingQuestions(false)
      setTimerStarted(true)
    }

    generateQuestions()
  }, [profileLoaded, profile1, profile2])

  // Таймер
  useEffect(() => {
    if (!timerStarted) return
    if (timeLeft <= 0) {
      handleFinish()
      return
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000)
    return () => clearInterval(timer)
  }, [timerStarted, timeLeft])

  const currentSubjectQuestions = useMemo(() =>
    questions.filter((q) => q.subjectId === activeSubjectId),
    [questions, activeSubjectId]
  )

  const currentQuestion = currentSubjectQuestions[currentIndex] || null
  const totalAnswered = Object.keys(answers).filter(k => answers[k]?.length > 0).length

  const subjectAnsweredCount = (subjectId: number) =>
    questions.filter((q) => q.subjectId === subjectId && answers[q.id]?.length > 0).length

  const handleAnswer = (questionId: string, value: string, isMultiple: boolean) => {
    if (isMultiple) {
      setAnswers((prev) => {
        const current = prev[questionId] || []
        if (current.includes(value)) {
          return { ...prev, [questionId]: current.filter((v) => v !== value) }
        } else if (current.length < 2) {
          return { ...prev, [questionId]: [...current, value] }
        }
        return prev
      })
    } else {
      setAnswers((prev) => ({ ...prev, [questionId]: [value] }))
    }
  }

  const handleFinish = () => {
    const results = {
      totalAnswered: Object.keys(answers).filter(k => answers[k]?.length > 0).length,
      totalQuestions: questions.length,
      timeSpent: TOTAL_TIME - timeLeft,
      sessionId,
      subjectResults: tabs.map(tab => {
        const tabQs = questions.filter(q => q.subjectId === tab.id)
        const answered = tabQs.filter(q => answers[q.id]?.length > 0).length
        return { name: tab.name, answered, total: tab.count }
      }),
    }
    localStorage.setItem('simulator_result', JSON.stringify(results))
    router.push(`/dashboard/simulator/result/${sessionId}`)
  }

  const handlePrev = () => setCurrentIndex((prev) => Math.max(0, prev - 1))
  const handleNext = () => setCurrentIndex((prev) => Math.min(currentSubjectQuestions.length - 1, prev + 1))
  const handleSubjectChange = (subjectId: number) => { setActiveSubjectId(subjectId); setCurrentIndex(0) }
  const toggleFlag = (questionId: string) => setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }))

  const calcInput = (val: string) => setCalcValue((prev) => (prev === '0' ? val : prev + val))
  const calcClear = () => setCalcValue('0')
  const calcBackspace = () => setCalcValue((prev) => (prev.length <= 1 ? '0' : prev.slice(0, -1)))
  const calcEquals = () => {
    try {
      const safe = calcValue.replace(/×/g, '*').replace(/÷/g, '/')
      const result = Function(`"use strict"; return (${safe})`)()
      setCalcValue(String(result))
    } catch { setCalcValue('Қате') }
  }

  if (loadingQuestions) {
    return (
      <div style={{ minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', maxWidth: 400, width: '90%' }}>
          <div style={{ width: 60, height: 60, border: '4px solid #E2E8F0', borderTop: '4px solid #0EA5E9', borderRadius: '50%', margin: '0 auto 24px', animation: 'spin 1s linear infinite' }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: '#0F172A', marginBottom: 8 }}>AI сұрақтар жасауда...</h2>
          <p style={{ color: '#0EA5E9', marginBottom: 20, fontSize: 14, fontWeight: 700 }}>{loadingSubject}</p>
          <div style={{ background: '#E2E8F0', borderRadius: 999, height: 8, overflow: 'hidden', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 999, background: '#0EA5E9', width: loadingProgress + '%', transition: 'width 0.5s ease' }} />
          </div>
          <p style={{ color: '#64748B', fontSize: 13 }}>{loadingProgress}% дайын</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
        </div>
      </div>
    )
  }

  if (!currentQuestion) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#64748B' }}>
        Сұрақтар табылмады
      </div>
    )
  }

  return (
    <div style={styles.page}>
      <div style={styles.topBar}>
        <div style={styles.topWrap}>
          <div style={styles.leftHeader}>
            <button onClick={() => router.push('/dashboard/simulator')} style={styles.backBtn}>← Артқа</button>
            <div>
              <div style={styles.headerTitle}>ҰБТ тесті</div>
              <div style={styles.headerSub}>Жауап: {totalAnswered} / {questions.length}</div>
            </div>
          </div>
          <div style={styles.rightHeader}>
            <div style={{ ...styles.timer, background: timeLeft < 300 ? '#FEF2F2' : '#EFF6FF', color: timeLeft < 300 ? '#DC2626' : '#0EA5E9', border: timeLeft < 300 ? '1px solid #FCA5A5' : '1px solid #BAE6FD' }}>
              {formatTime(timeLeft)}
            </div>
            <button style={styles.secondaryBtn} onClick={() => setShowCalculator(true)}>Калькулятор</button>
            <button style={styles.secondaryBtn} onClick={() => setShowPeriodicTable(true)}>Менделеев</button>
            <button style={styles.primaryBtn} onClick={handleFinish}>Тапсыру</button>
          </div>
        </div>
      </div>

      <div style={styles.tabsBar}>
        <div style={styles.tabsWrap}>
          {tabs.map((tab) => {
            const active = activeSubjectId === tab.id
            return (
              <button key={tab.id} onClick={() => handleSubjectChange(tab.id)} style={{ ...styles.tabBtn, background: active ? '#F0F9FF' : '#FFFFFF', border: active ? '1px solid #7DD3FC' : '1px solid #E2E8F0', color: active ? '#0369A1' : '#334155' }}>
                {tab.name}
                <span style={styles.tabMeta}>{subjectAnsweredCount(tab.id)} / {tab.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      <div style={styles.contentWrap}>
        <div style={styles.layout}>
          <div style={styles.mainCard}>
            <div style={styles.metaRow}>
              <div style={styles.subjectBadge}>{currentQuestion.subjectName}</div>
              <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                {currentQuestion.isMultiple && (
                  <div style={{ padding: '6px 12px', borderRadius: 999, background: '#FEF3C7', border: '1px solid #FCD34D', color: '#92400E', fontSize: 12, fontWeight: 700 }}>
                    2 дұрыс жауап таңда
                  </div>
                )}
                <div style={styles.pointsBadge}>{currentQuestion.points} балл</div>
              </div>
            </div>

            <div style={styles.questionCount}>Сұрақ {currentQuestion.number} / {questions.length}</div>

            {currentQuestion.contextText ? (
              <div style={styles.contextBox}>{currentQuestion.contextText}</div>
            ) : null}

            <div style={styles.questionText}>{currentQuestion.question}</div>

            <div style={styles.answersWrap}>
              {[
                { key: 'A', text: currentQuestion.optionA },
                { key: 'B', text: currentQuestion.optionB },
                { key: 'C', text: currentQuestion.optionC },
                { key: 'D', text: currentQuestion.optionD },
              ].map((option) => {
                const selectedAnswers = answers[currentQuestion.id] || []
                const selected = selectedAnswers.includes(option.key)
                return (
                  <button
                    key={option.key}
                    onClick={() => handleAnswer(currentQuestion.id, option.key, currentQuestion.isMultiple || false)}
                    style={{ ...styles.answerCard, border: selected ? '2px solid #0EA5E9' : '1px solid #E2E8F0', background: selected ? '#F0F9FF' : '#FFFFFF' }}
                  >
                    <div style={styles.answerRow}>
                      <div style={{ ...styles.answerLetter, background: selected ? '#0EA5E9' : '#F8FAFC', color: selected ? '#FFFFFF' : '#334155', border: selected ? 'none' : '1px solid #CBD5E1' }}>
                        {option.key}
                      </div>
                      <div style={styles.answerText}>{option.text}</div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div style={styles.bottomActions}>
              <div style={styles.bottomLeft}>
                <button onClick={() => toggleFlag(currentQuestion.id)} style={{ ...styles.navBtn, background: flagged[currentQuestion.id] ? '#FEF3C7' : '#FFFFFF' }}>
                  {flagged[currentQuestion.id] ? '🚩 Белгіленді' : 'Белгілеу'}
                </button>
                <button onClick={handlePrev} disabled={currentIndex === 0} style={{ ...styles.navBtn, opacity: currentIndex === 0 ? 0.45 : 1 }}>← Артқа</button>
                <button onClick={handleNext} disabled={currentIndex === currentSubjectQuestions.length - 1} style={{ ...styles.primarySmallBtn, opacity: currentIndex === currentSubjectQuestions.length - 1 ? 0.45 : 1 }}>Келесі →</button>
              </div>
            </div>
          </div>

          <div style={styles.sidePanel}>
            <div style={styles.sideCard}>
              <div style={styles.sideTitle}>Прогресс</div>
              <div style={styles.sideText}>
                Жалпы жауап: <strong>{totalAnswered}</strong> / {questions.length}<br />
                Ағымдағы пән: <strong>{currentQuestion.subjectName}</strong><br />
                Осы бөлім: <strong>{currentIndex + 1}</strong> / {currentSubjectQuestions.length}
              </div>
            </div>

            <div style={styles.sideCard}>
              <div style={styles.sideTitle}>Сұрақтар</div>
              <div style={styles.questionGrid}>
                {currentSubjectQuestions.map((q, idx) => (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    style={{ ...styles.gridBtn, border: idx === currentIndex ? '2px solid #0EA5E9' : '1px solid #E2E8F0', background: flagged[q.id] ? '#FEF3C7' : (answers[q.id]?.length > 0) ? '#E0F2FE' : '#FFFFFF' }}
                  >
                    {idx + 1}
                  </button>
                ))}
              </div>
              <div style={styles.legend}>
                <div style={styles.legendRow}><div style={{ ...styles.legendDot, background: '#E0F2FE', border: '1px solid #BAE6FD' }} />Жауап берілген</div>
                <div style={styles.legendRow}><div style={{ ...styles.legendDot, background: '#FEF3C7', border: '1px solid #FCD34D' }} />Белгіленген</div>
                <div style={styles.legendRow}><div style={{ ...styles.legendDot, background: '#FFFFFF', border: '2px solid #0EA5E9' }} />Ағымдағы</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCalculator && (
        <div style={styles.overlay} onClick={() => setShowCalculator(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Калькулятор</div>
              <button style={styles.secondaryBtn} onClick={() => setShowCalculator(false)}>Жабу</button>
            </div>
            <div style={styles.calcDisplay}>{calcValue}</div>
            <div style={styles.calcGrid}>
              {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','%','+'].map((item) => (
                <button key={item} style={styles.calcBtn} onClick={() => calcInput(item)}>{item}</button>
              ))}
              <button style={styles.calcBtn} onClick={calcClear}>C</button>
              <button style={styles.calcBtn} onClick={calcBackspace}>⌫</button>
              <button style={styles.calcBtn} onClick={() => calcInput('(')}>(</button>
              <button style={styles.calcBtn} onClick={() => calcInput(')')}>)</button>
              <button style={styles.calcEqualBtn} onClick={calcEquals}>=</button>
            </div>
          </div>
        </div>
      )}

      {showPeriodicTable && (
        <div style={styles.overlay} onClick={() => setShowPeriodicTable(false)}>
          <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <div style={styles.modalTitle}>Менделеев кестесі</div>
              <button style={styles.secondaryBtn} onClick={() => setShowPeriodicTable(false)}>Жабу</button>
            </div>
            <img src="/periodic-table.png" alt="Менделеев кестесі" style={{ width: '100%', height: 'auto', display: 'block', borderRadius: 16 }} />
          </div>
        </div>
      )}
    </div>
  )
}

const styles: any = {
  page: { minHeight: '100vh', background: '#F8FAFC', color: '#0F172A' },
  topBar: { position: 'sticky', top: 0, zIndex: 50, background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '14px 20px' },
  topWrap: { maxWidth: 1380, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16 },
  leftHeader: { display: 'flex', alignItems: 'center', gap: 16 },
  rightHeader: { display: 'flex', alignItems: 'center', gap: 10 },
  backBtn: { padding: '10px 14px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer', fontWeight: 700 },
  headerTitle: { fontSize: 20, fontWeight: 800 },
  headerSub: { fontSize: 13, color: '#64748B' },
  timer: { padding: '12px 18px', borderRadius: 14, fontWeight: 800, fontSize: 22, minWidth: 126, textAlign: 'center' },
  secondaryBtn: { padding: '12px 14px', borderRadius: 12, border: '1px solid #CBD5E1', background: '#FFFFFF', cursor: 'pointer', fontWeight: 700, color: '#0F172A' },
  primaryBtn: { padding: '12px 16px', borderRadius: 12, border: 'none', background: '#0EA5E9', color: '#FFFFFF', cursor: 'pointer', fontWeight: 800 },
  tabsBar: { background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', padding: '0 20px' },
  tabsWrap: { maxWidth: 1380, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto', padding: '14px 0' },
  tabBtn: { padding: '12px 16px', borderRadius: 14, fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap' },
  tabMeta: { display: 'block', fontSize: 12, marginTop: 4, color: '#64748B', fontWeight: 700 },
  contentWrap: { maxWidth: 1380, margin: '0 auto', padding: '22px 20px 32px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20, alignItems: 'start' },
  mainCard: { background: '#FFFFFF', borderRadius: 28, padding: 28, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)', border: '1px solid #EEF2F7' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 16 },
  subjectBadge: { display: 'inline-flex', alignItems: 'center', gap: 8, padding: '8px 12px', borderRadius: 999, background: '#F0F9FF', border: '1px solid #BAE6FD', color: '#0EA5E9', fontSize: 13, fontWeight: 700 },
  pointsBadge: { padding: '8px 12px', borderRadius: 999, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#64748B', fontSize: 13, fontWeight: 700 },
  questionCount: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  contextBox: { padding: 18, borderRadius: 18, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', lineHeight: 1.8, marginBottom: 18, whiteSpace: 'pre-wrap', fontSize: 15 },
  questionText: { fontSize: 26, fontWeight: 700, lineHeight: 1.6, letterSpacing: '-0.02em', color: '#0F172A', marginBottom: 24 },
  answersWrap: { display: 'flex', flexDirection: 'column', gap: 12 },
  answerCard: { width: '100%', textAlign: 'left', padding: 18, borderRadius: 18, cursor: 'pointer' },
  answerRow: { display: 'flex', alignItems: 'flex-start', gap: 14 },
  answerLetter: { width: 34, height: 34, borderRadius: 999, flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 14 },
  answerText: { paddingTop: 5, fontSize: 17, lineHeight: 1.7, fontWeight: 500, color: '#0F172A' },
  bottomActions: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginTop: 24, flexWrap: 'wrap' },
  bottomLeft: { display: 'flex', gap: 10, flexWrap: 'wrap' },
  navBtn: { padding: '13px 16px', borderRadius: 14, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', cursor: 'pointer', fontWeight: 700 },
  primarySmallBtn: { padding: '13px 16px', borderRadius: 14, border: 'none', background: '#0EA5E9', color: '#FFFFFF', cursor: 'pointer', fontWeight: 800 },
  sidePanel: { display: 'flex', flexDirection: 'column', gap: 16, position: 'sticky', top: 128 },
  sideCard: { background: '#FFFFFF', borderRadius: 24, padding: 18, boxShadow: '0 12px 30px rgba(15, 23, 42, 0.06)', border: '1px solid #EEF2F7' },
  sideTitle: { fontSize: 18, fontWeight: 800, marginBottom: 12 },
  sideText: { fontSize: 14, color: '#64748B', lineHeight: 1.7 },
  questionGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginTop: 14 },
  gridBtn: { height: 42, borderRadius: 12, color: '#0F172A', fontWeight: 800, cursor: 'pointer' },
  legend: { marginTop: 14, display: 'flex', flexDirection: 'column', gap: 8 },
  legendRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#64748B' },
  legendDot: { width: 14, height: 14, borderRadius: 6 },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.58)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100 },
  modal: { width: 'min(1100px, 96vw)', maxHeight: '90vh', overflow: 'auto', background: '#FFFFFF', borderRadius: 26, padding: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.20)' },
  modalHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 24, fontWeight: 800, color: '#0F172A' },
  calcDisplay: { width: '100%', padding: '18px 16px', borderRadius: 16, border: '1px solid #CBD5E1', background: '#F8FAFC', fontSize: 28, textAlign: 'right', marginBottom: 14, color: '#0F172A', fontWeight: 800, overflowX: 'auto' },
  calcGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 },
  calcBtn: { padding: '16px 12px', borderRadius: 14, border: '1px solid #E2E8F0', background: '#FFFFFF', fontSize: 18, fontWeight: 800, cursor: 'pointer' },
  calcEqualBtn: { gridColumn: 'span 4', padding: '16px 12px', borderRadius: 14, border: 'none', background: '#0EA5E9', color: '#FFFFFF', fontSize: 18, fontWeight: 800, cursor: 'pointer' },
}