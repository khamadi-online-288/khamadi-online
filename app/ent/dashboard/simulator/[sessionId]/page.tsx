'use client'

import { useEffect, useMemo, useState, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

// ─── Типтер ───────────────────────────────────────────
type QuestionType = 'single' | 'context' | 'map' | 'multiple' | 'matching'

type RawQuestion = {
  id: string
  global_num: number
  subject: string
  question_type: QuestionType
  question_num: number
  question_text: string
  context_text: string | null
  option_a: string | null
  option_b: string | null
  option_c: string | null
  option_d: string | null
  option_e: string | null
  option_f: string | null
  match_left: string | null
  match_right: string | null
  correct_answer: string | null
  points: number
  variant_id: number
}

type WrongQuestion = {
  subject: string
  question: string
  userAnswer: string
  correctAnswer: string
}

type Question = {
  id: string
  globalNum: number
  subjectId: number
  subjectName: string
  localNum: number
  type: QuestionType
  text: string
  contextText: string | null
  options: { key: string; text: string }[]
  matchLeft: string[]
  matchRight: string[]
  mapData: Record<string, string> | null
  points: number
  correctAnswer: string | null
}

type SubjectTab = {
  id: number
  dbName: string
  label: string
  count: number
}

const TOTAL_TIME = 240 * 60

// Пән аттары → tab id сәйкестігі
const SUBJECT_MAP: Record<string, number> = {
  'Қазақстан тарихы': 1,
  'Математикалық сауаттылық': 2,
  'Оқу сауаттылығы': 3,
}

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

function parseJsonSafe(val: string | null): string[] {
  if (!val) return []
  try { return JSON.parse(val) } catch { return [] }
}

function parseMatchAnswer(val: string | null): Record<string, string> {
  if (!val) return {}
  try { return JSON.parse(val) } catch { return {} }
}

// ─── Картаны SVG арқылы рендерлеу ────────────────────
const KZ_MAP_POINTS: Record<string, { x: number; y: number; label: string }> = {
  '1': { x: 310, y: 310, label: 'Шымкент' },
  '2': { x: 530, y: 180, label: 'Семей' },
  '3': { x: 270, y: 240, label: 'Қызылорда' },
  '4': { x: 390, y: 155, label: 'Астана' },
  '5': { x: 130, y: 170, label: 'Орал' },
  '6': { x: 570, y: 290, label: 'Өскемен' },
}

function KazakhstanMap({
  selected,
  onSelect,
}: {
  selected: string | null
  onSelect: (num: string) => void
}) {
  return (
    <div style={{ background: '#F0F9FF', borderRadius: 16, padding: 12, marginBottom: 16, border: '1px solid #BAE6FD' }}>
      <svg viewBox="0 0 700 420" style={{ width: '100%', maxHeight: 320 }}>
        {/* Қазақстан картасының жеңілдетілген пішіні */}
        <path
          d="M80,80 L200,60 L280,55 L380,50 L480,60 L580,80 L640,130 L650,200 L620,270 L580,320 L500,360 L400,370 L300,360 L200,340 L120,300 L70,240 L60,170 Z"
          fill="#E0F2FE"
          stroke="#7DD3FC"
          strokeWidth="2"
        />
        {/* Ішкі облыс шекаралары (жеңілдетілген) */}
        <path d="M280,55 L270,200 L200,340" fill="none" stroke="#BAE6FD" strokeWidth="1" />
        <path d="M380,50 L390,200 L400,370" fill="none" stroke="#BAE6FD" strokeWidth="1" />
        <path d="M480,60 L490,200 L500,360" fill="none" stroke="#BAE6FD" strokeWidth="1" />
        <path d="M80,170 L650,180" fill="none" stroke="#BAE6FD" strokeWidth="1" />

        {/* Нүктелер */}
        {Object.entries(KZ_MAP_POINTS).map(([num, point]) => {
          const isSelected = selected === num
          return (
            <g key={num} onClick={() => onSelect(num)} style={{ cursor: 'pointer' }}>
              <circle
                cx={point.x}
                cy={point.y}
                r={isSelected ? 18 : 14}
                fill={isSelected ? '#0EA5E9' : '#FFFFFF'}
                stroke={isSelected ? '#0369A1' : '#64748B'}
                strokeWidth={isSelected ? 3 : 2}
              />
              <text
                x={point.x}
                y={point.y + 5}
                textAnchor="middle"
                fontSize={isSelected ? 13 : 11}
                fontWeight="800"
                fill={isSelected ? '#FFFFFF' : '#0F172A'}
              >
                {num}
              </text>
            </g>
          )
        })}
      </svg>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 8 }}>
        {Object.entries(KZ_MAP_POINTS).map(([num, point]) => (
          <button
            key={num}
            onClick={() => onSelect(num)}
            style={{
              padding: '6px 12px',
              borderRadius: 999,
              border: selected === num ? '2px solid #0EA5E9' : '1px solid #CBD5E1',
              background: selected === num ? '#0EA5E9' : '#FFFFFF',
              color: selected === num ? '#FFFFFF' : '#334155',
              fontWeight: 700,
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            {num} — {point.label}
          </button>
        ))}
      </div>
    </div>
  )
}

// ─── Негізгі компонент ────────────────────────────────
export default function SimulatorSessionPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = String(params.sessionId || '')

  const [profile1, setProfile1] = useState('')
  const [profile2, setProfile2] = useState('')
  const [profileLoaded, setProfileLoaded] = useState(false)

  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingMsg, setLoadingMsg] = useState('Сұрақтар жүктелуде...')
  const [error, setError] = useState('')

  const [activeSubjectId, setActiveSubjectId] = useState(1)
  const [currentIndex, setCurrentIndex] = useState(0)

  // Жауаптар: questionId → таңдалған мәндер массиві
  const [answers, setAnswers] = useState<Record<string, string[]>>({})
  // Matching жауаптары: questionId → { leftItem: rightItem }
  const [matchAnswers, setMatchAnswers] = useState<Record<string, Record<string, string>>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})

  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME)
  const [timerStarted, setTimerStarted] = useState(false)

  const [showCalculator, setShowCalculator] = useState(false)
  const [showPeriodicTable, setShowPeriodicTable] = useState(false)
  const [calcValue, setCalcValue] = useState('0')
  const [submitting, setSubmitting] = useState(false)
  const submittingRef = useRef(false)

  // Профиль жүктеу
  useEffect(() => {
    async function load() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setProfile1('Математика'); setProfile2('Физика'); setProfileLoaded(true); return }
        const { data } = await supabase.from('profiles')
          .select('profile_subject_1, profile_subject_2')
          .eq('id', user.id).single()
        setProfile1(data?.profile_subject_1 || 'Математика')
        setProfile2(data?.profile_subject_2 || 'Физика')
      } catch { setProfile1('Математика'); setProfile2('Физика') }
      finally { setProfileLoaded(true) }
    }
    load()
  }, [])

  const tabs: SubjectTab[] = useMemo(() => [
    { id: 1, dbName: 'Қазақстан тарихы', label: 'Қазақстан тарихы', count: 20 },
    { id: 2, dbName: 'Математикалық сауаттылық', label: 'Мат. сауаттылық', count: 10 },
    { id: 3, dbName: 'Оқу сауаттылығы', label: 'Оқу сауаттылығы', count: 10 },
    { id: 4, dbName: profile1 || 'Математика', label: profile1 || 'Математика', count: 40 },
    { id: 5, dbName: profile2 || 'Физика', label: profile2 || 'Физика', count: 40 },
  ], [profile1, profile2])

  // Supabase-тен сұрақтар жүктеу
  useEffect(() => {
    if (!profileLoaded) return
    async function loadQuestions() {
      try {
        setLoading(true)
        setError('')

        const subjectNames = tabs.map(t => t.dbName)
        setLoadingMsg('Supabase-тен сұрақтар алынуда...')

        const { data, error: dbError } = await supabase
          .from('ent_questions')
          .select('*')
          .eq('variant_id', 1)
          .in('subject', subjectNames)
          .order('global_num', { ascending: true })

        if (dbError) throw new Error(dbError.message)
        if (!data || data.length === 0) throw new Error('Сұрақтар табылмады')

        setLoadingMsg('Сұрақтар өңделуде...')

        const mapped: Question[] = (data as RawQuestion[]).map(raw => {
          const tab = tabs.find(t => t.dbName === raw.subject)
          const subjectId = tab?.id ?? (SUBJECT_MAP[raw.subject] || 4)

          // Options
          const opts: { key: string; text: string }[] = []
          if (raw.option_a) opts.push({ key: 'А', text: raw.option_a })
          if (raw.option_b) opts.push({ key: 'В', text: raw.option_b })
          if (raw.option_c) opts.push({ key: 'С', text: raw.option_c })
          if (raw.option_d) opts.push({ key: 'Д', text: raw.option_d })
          if (raw.option_e) opts.push({ key: 'Е', text: raw.option_e })
          if (raw.option_f) opts.push({ key: 'Ж', text: raw.option_f })

          // Map data
          let mapData: Record<string, string> | null = null
          if (raw.question_type === 'map' && raw.context_text) {
            try { mapData = JSON.parse(raw.context_text) } catch {}
          }

          return {
            id: raw.id,
            globalNum: raw.global_num,
            subjectId,
            subjectName: raw.subject,
            localNum: raw.question_num,
            type: raw.question_type,
            text: raw.question_text,
            contextText: raw.question_type === 'map' ? null : (raw.context_text || null),
            options: opts,
            matchLeft: parseJsonSafe(raw.match_left),
            matchRight: parseJsonSafe(raw.match_right),
            mapData,
            points: raw.points || 1,
            correctAnswer: raw.correct_answer,
          }
        })

        setQuestions(mapped)
        setTimerStarted(true)
      } catch (e: any) {
        setError(e?.message || 'Қате шықты')
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [profileLoaded, profile1, profile2])

  // Таймер
  useEffect(() => {
    if (!timerStarted) return
    if (timeLeft <= 0) { handleFinish(); return }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(t)
  }, [timerStarted, timeLeft])

  const currentSubjectQuestions = useMemo(
    () => questions.filter(q => q.subjectId === activeSubjectId),
    [questions, activeSubjectId]
  )

  const currentQuestion = currentSubjectQuestions[currentIndex] || null
  const totalAnswered = useMemo(() => {
    return questions.filter(q => {
      if (q.type === 'matching') return Object.keys(matchAnswers[q.id] || {}).length > 0
      return (answers[q.id] || []).length > 0
    }).length
  }, [questions, answers, matchAnswers])

  const subjectAnswered = (subId: number) => {
    return questions.filter(q => {
      if (q.subjectId !== subId) return false
      if (q.type === 'matching') return Object.keys(matchAnswers[q.id] || {}).length > 0
      return (answers[q.id] || []).length > 0
    }).length
  }

  // Жауап беру
  const handleAnswer = useCallback((qId: string, val: string, isMultiple: boolean) => {
    if (isMultiple) {
      setAnswers(prev => {
        const cur = prev[qId] || []
        if (cur.includes(val)) return { ...prev, [qId]: cur.filter(v => v !== val) }
        if (cur.length < 3) return { ...prev, [qId]: [...cur, val] }
        return prev
      })
    } else {
      setAnswers(prev => ({ ...prev, [qId]: [val] }))
    }
  }, [])

  // Matching жауабы
  const handleMatchAnswer = useCallback((qId: string, leftItem: string, rightItem: string) => {
    setMatchAnswers(prev => ({
      ...prev,
      [qId]: { ...(prev[qId] || {}), [leftItem]: rightItem }
    }))
  }, [])

  // Карта жауабы
  const handleMapAnswer = useCallback((qId: string, pointNum: string) => {
    setAnswers(prev => ({ ...prev, [qId]: [pointNum] }))
  }, [])

  const handleFinish = useCallback(async () => {
    if (submittingRef.current) return
    submittingRef.current = true
    setSubmitting(true)

    // Helper: check if answer is correct for a question
    const checkIsCorrect = (q: Question): boolean => {
      if (!q.correctAnswer) return false
      if (q.type === 'matching') {
        const userMatch = matchAnswers[q.id] || {}
        const correctMatch = parseMatchAnswer(q.correctAnswer)
        const keys = q.matchLeft.map((_, i) => String(i + 1))
        return keys.every(k => userMatch[k] === correctMatch[k])
      }
      if (q.type === 'multiple') {
        const userSelected = [...(answers[q.id] || [])].sort()
        let correctArr: string[] = []
        try { correctArr = JSON.parse(q.correctAnswer) } catch {
          correctArr = q.correctAnswer.split(/[,\s]+/).filter(Boolean)
        }
        return JSON.stringify(userSelected) === JSON.stringify([...correctArr].sort())
      }
      // single, context, map
      return (answers[q.id]?.[0] ?? '') === q.correctAnswer
    }

    // Calculate total score and collect wrong answers
    let totalScore = 0
    const wrongQuestions: WrongQuestion[] = []

    for (const q of questions) {
      if (checkIsCorrect(q)) {
        totalScore += q.points
      } else {
        const userAnswerText = q.type === 'matching'
          ? JSON.stringify(matchAnswers[q.id] || {})
          : (answers[q.id] || []).join(', ') || 'Жауап жоқ'
        wrongQuestions.push({
          subject: q.subjectName,
          question: q.text.slice(0, 120),
          userAnswer: userAnswerText,
          correctAnswer: q.correctAnswer || '',
        })
      }
    }

    const maxScore = questions.reduce((sum, q) => sum + q.points, 0)

    // Per-subject breakdown
    const subjectResults = tabs.map(tab => {
      const subjectQs = questions.filter(q => q.subjectId === tab.id)
      let score = 0
      let correct = 0
      const maxS = subjectQs.reduce((sum, q) => sum + q.points, 0)
      const answered = subjectQs.filter(q => {
        if (q.type === 'matching') return Object.keys(matchAnswers[q.id] || {}).length > 0
        return (answers[q.id] || []).length > 0
      }).length
      for (const q of subjectQs) {
        if (checkIsCorrect(q)) { score += q.points; correct++ }
      }
      return { name: tab.label, score, maxScore: maxS, correct, answered, total: subjectQs.length }
    })

    // Save to Supabase
    let studentName = 'Студент'
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: profile } = await supabase
          .from('profiles').select('name').eq('id', user.id).single()
        studentName = (profile as { name?: string } | null)?.name
          || user.email?.split('@')[0]
          || 'Студент'

        const completedAt = new Date().toISOString()

        /* update the existing session (created on start) rather than inserting a duplicate */
        await supabase.from('simulator_sessions')
          .update({
            answers: JSON.stringify({ regular: answers, matching: matchAnswers }),
            score: totalScore,
            completed_at: completedAt,
          })
          .eq('id', sessionId)

        /* write to simulator_results — read by dashboard, progress, parent, ai-analysis */
        await supabase.from('simulator_results').insert({
          user_id:        user.id,
          session_id:     sessionId,
          total_score:    totalScore,
          max_score:      maxScore,
          subject_results: JSON.stringify(subjectResults),
          created_at:     completedAt,
        })
      }
    } catch (e) {
      console.error('Failed to save simulator session:', e)
    }

    // Store enriched result for the result page
    const resultData = {
      totalScore,
      maxScore,
      totalAnswered,
      totalQuestions: questions.length,
      timeSpent: TOTAL_TIME - timeLeft,
      sessionId,
      subjectResults,
      wrongQuestions: wrongQuestions.slice(0, 25),
      studentName,
    }
    localStorage.setItem('simulator_result', JSON.stringify(resultData))
    router.push(`/ent/dashboard/simulator/result/${sessionId}`)
  }, [answers, matchAnswers, questions, tabs, totalAnswered, timeLeft, sessionId])

  const toggleFlag = (qId: string) => setFlagged(prev => ({ ...prev, [qId]: !prev[qId] }))

  // Калькулятор
  const calcInput = (v: string) => setCalcValue(p => p === '0' ? v : p + v)
  const calcClear = () => setCalcValue('0')
  const calcBack = () => setCalcValue(p => p.length <= 1 ? '0' : p.slice(0, -1))
  const calcEquals = () => {
    try {
      const r = Function(`"use strict"; return (${calcValue.replace(/×/g, '*').replace(/÷/g, '/')})`)()
      setCalcValue(String(r))
    } catch { setCalcValue('Қате') }
  }

  // ─── Жүктеу экраны ───
  if (loading) return (
    <div style={s.center}>
      <div style={s.loadCard}>
        <div style={s.spinner} />
        <div style={s.loadTitle}>ҰБТ Симулятор</div>
        <div style={s.loadSub}>{loadingMsg}</div>
        <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      </div>
    </div>
  )

  if (error) return (
    <div style={s.center}>
      <div style={s.loadCard}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>⚠️</div>
        <div style={{ ...s.loadTitle, color: '#DC2626' }}>Қате шықты</div>
        <div style={s.loadSub}>{error}</div>
        <button style={s.primaryBtn} onClick={() => window.location.reload()}>Қайта жүктеу</button>
      </div>
    </div>
  )

  if (!currentQuestion) return (
    <div style={s.center}>
      <div style={s.loadCard}>
        <div style={s.loadSub}>Сұрақтар табылмады</div>
      </div>
    </div>
  )

  const isMultiple = currentQuestion.type === 'multiple'
  const isMatching = currentQuestion.type === 'matching'
  const isMap = currentQuestion.type === 'map'
  const curAnswers = answers[currentQuestion.id] || []
  const curMatchAns = matchAnswers[currentQuestion.id] || {}

  return (
    <div style={s.page}>

      {/* ── Жоғарғы панель ── */}
      <div style={s.topBar}>
        <div style={s.topWrap}>
          <div style={s.topLeft}>
            <button onClick={() => router.push('/ent/dashboard/simulator')} style={s.backBtn}>← Артқа</button>
            <div>
              <div style={s.topTitle}>ҰБТ Симулятор</div>
              <div style={s.topSub}>Жауап: {totalAnswered} / {questions.length}</div>
            </div>
          </div>

          <div style={s.topRight}>
            <div style={{
              ...s.timer,
              background: timeLeft < 300 ? '#FEF2F2' : '#EFF6FF',
              color: timeLeft < 300 ? '#DC2626' : '#0EA5E9',
              border: `1px solid ${timeLeft < 300 ? '#FCA5A5' : '#BAE6FD'}`,
            }}>
              {formatTime(timeLeft)}
            </div>
            <button style={s.outlineBtn} onClick={() => setShowCalculator(true)}>Калькулятор</button>
            <button style={s.outlineBtn} onClick={() => setShowPeriodicTable(true)}>Менделеев</button>
            <button style={{ ...s.primaryBtn, opacity: submitting ? 0.6 : 1 }} onClick={() => handleFinish()} disabled={submitting}>
              {submitting ? 'Сақталуда...' : 'Тапсыру'}
            </button>
          </div>
        </div>
      </div>

      {/* ── Пән табтары ── */}
      <div style={s.tabsBar}>
        <div style={s.tabsWrap}>
          {tabs.map(tab => {
            const active = activeSubjectId === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => { setActiveSubjectId(tab.id); setCurrentIndex(0) }}
                style={{
                  ...s.tabBtn,
                  background: active ? '#F0F9FF' : '#FFFFFF',
                  border: active ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                  color: active ? '#0369A1' : '#334155',
                }}
              >
                <span>{tab.label}</span>
                <span style={s.tabCount}>{subjectAnswered(tab.id)} / {tab.count}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* ── Негізгі мазмұн ── */}
      <div style={s.content}>
        <div style={s.layout}>

          {/* Сұрақ картасы */}
          <div style={s.mainCard}>
            {/* Мета жол */}
            <div style={s.metaRow}>
              <div style={s.subjectPill}>{currentQuestion.subjectName}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {isMultiple && <div style={s.multiplePill}>Бірнеше дұрыс жауап</div>}
                {isMatching && <div style={s.matchingPill}>Сәйкестендіру</div>}
                {isMap && <div style={s.mapPill}>Карта</div>}
                <div style={s.pointsPill}>{currentQuestion.points} балл</div>
              </div>
            </div>

            <div style={s.qCount}>
              {currentQuestion.subjectName} · {currentIndex + 1} / {currentSubjectQuestions.length}
            </div>

            {/* Контекст мәтін */}
            {currentQuestion.contextText && (
              <div style={s.contextBox}>{currentQuestion.contextText}</div>
            )}

            {/* Сұрақ мәтіні */}
            <div style={s.qText}>{currentQuestion.text}</div>

            {/* ── Карта ── */}
            {isMap && (
              <KazakhstanMap
                selected={curAnswers[0] || null}
                onSelect={(num) => handleMapAnswer(currentQuestion.id, num)}
              />
            )}

            {/* ── Single / Context / Map options ── */}
            {!isMatching && (
              <div style={s.optionsWrap}>
                {currentQuestion.options.map(opt => {
                  const sel = curAnswers.includes(opt.key)
                  return (
                    <button
                      key={opt.key}
                      onClick={() => handleAnswer(currentQuestion.id, opt.key, isMultiple)}
                      style={{
                        ...s.optionBtn,
                        border: sel ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                        background: sel ? '#F0F9FF' : '#FFFFFF',
                      }}
                    >
                      <div style={{
                        ...s.optionLetter,
                        background: sel ? '#0EA5E9' : '#F8FAFC',
                        color: sel ? '#FFFFFF' : '#334155',
                        border: sel ? 'none' : '1px solid #CBD5E1',
                      }}>{opt.key}</div>
                      <div style={s.optionText}>{opt.text}</div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* ── Matching ── */}
            {isMatching && (
              <div style={s.matchingWrap}>
                <div style={s.matchingGrid}>
                  <div style={s.matchCol}>
                    <div style={s.matchColTitle}>Сол жақ</div>
                    {currentQuestion.matchLeft.map((item, i) => {
                      const key = String(i + 1)
                      const selected = curMatchAns[key]
                      return (
                        <div key={key} style={{ marginBottom: 8 }}>
                          <div style={s.matchItem}>{item}</div>
                          <select
                            value={selected || ''}
                            onChange={e => handleMatchAnswer(currentQuestion.id, key, e.target.value)}
                            style={s.matchSelect}
                          >
                            <option value="">— таңдаңыз —</option>
                            {currentQuestion.matchRight.map((r, ri) => (
                              <option key={ri} value={r}>{r}</option>
                            ))}
                          </select>
                        </div>
                      )
                    })}
                  </div>
                  <div style={s.matchCol}>
                    <div style={s.matchColTitle}>Оң жақ (жауаптар)</div>
                    {currentQuestion.matchRight.map((item, i) => (
                      <div key={i} style={s.matchRightItem}>{item}</div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Навигация */}
            <div style={s.navRow}>
              <button
                onClick={() => toggleFlag(currentQuestion.id)}
                style={{ ...s.outlineBtn, background: flagged[currentQuestion.id] ? '#FEF3C7' : '#FFFFFF' }}
              >
                {flagged[currentQuestion.id] ? '🚩 Белгіленді' : '⚑ Белгілеу'}
              </button>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setCurrentIndex(p => Math.max(0, p - 1))}
                  disabled={currentIndex === 0}
                  style={{ ...s.outlineBtn, opacity: currentIndex === 0 ? 0.4 : 1 }}
                >← Алдыңғы</button>
                <button
                  onClick={() => setCurrentIndex(p => Math.min(currentSubjectQuestions.length - 1, p + 1))}
                  disabled={currentIndex === currentSubjectQuestions.length - 1}
                  style={{ ...s.primaryBtn, opacity: currentIndex === currentSubjectQuestions.length - 1 ? 0.4 : 1 }}
                >Келесі →</button>
              </div>
            </div>
          </div>

          {/* Оң жақ панель */}
          <div style={s.sidePanel}>
            <div style={s.sideCard}>
              <div style={s.sideTitle}>Прогресс</div>
              <div style={s.sideInfo}>
                Жалпы: <strong>{totalAnswered}</strong> / {questions.length}<br />
                Пән: <strong>{subjectAnswered(activeSubjectId)}</strong> / {currentSubjectQuestions.length}
              </div>
            </div>

            <div style={s.sideCard}>
              <div style={s.sideTitle}>Сұрақтар</div>
              <div style={s.qGrid}>
                {currentSubjectQuestions.map((q, idx) => {
                  const ans = q.type === 'matching'
                    ? Object.keys(matchAnswers[q.id] || {}).length > 0
                    : (answers[q.id] || []).length > 0
                  return (
                    <button
                      key={q.id}
                      onClick={() => setCurrentIndex(idx)}
                      style={{
                        ...s.qGridBtn,
                        border: idx === currentIndex ? '2px solid #0EA5E9' : '1px solid #E2E8F0',
                        background: flagged[q.id] ? '#FEF3C7' : ans ? '#E0F2FE' : '#FFFFFF',
                        fontWeight: idx === currentIndex ? 800 : 600,
                      }}
                    >{idx + 1}</button>
                  )
                })}
              </div>
              <div style={s.legend}>
                {[
                  { color: '#E0F2FE', border: '#BAE6FD', label: 'Жауап берілген' },
                  { color: '#FEF3C7', border: '#FCD34D', label: 'Белгіленген' },
                  { color: '#FFFFFF', border: '#0EA5E9', label: 'Ағымдағы' },
                ].map(l => (
                  <div key={l.label} style={s.legendRow}>
                    <div style={{ ...s.legendDot, background: l.color, border: `2px solid ${l.border}` }} />
                    <span>{l.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Калькулятор модалы ── */}
      {showCalculator && (
        <div style={s.overlay} onClick={() => setShowCalculator(false)}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            <div style={s.modalHead}>
              <div style={s.modalTitle}>Калькулятор</div>
              <button style={s.outlineBtn} onClick={() => setShowCalculator(false)}>✕ Жабу</button>
            </div>
            <div style={s.calcDisplay}>{calcValue}</div>
            <div style={s.calcGrid}>
              {['7','8','9','÷','4','5','6','×','1','2','3','-','0','.','%','+'].map(v => (
                <button key={v} style={s.calcBtn} onClick={() => calcInput(v)}>{v}</button>
              ))}
              <button style={s.calcBtn} onClick={calcClear}>C</button>
              <button style={s.calcBtn} onClick={calcBack}>⌫</button>
              <button style={s.calcBtn} onClick={() => calcInput('(')}>( </button>
              <button style={s.calcBtn} onClick={() => calcInput(')')}>)</button>
              <button style={{ ...s.calcBtn, gridColumn: 'span 4', background: '#0EA5E9', color: '#fff' }} onClick={calcEquals}>=</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Менделеев кестесі ── */}
      {showPeriodicTable && (
        <div style={s.overlay} onClick={() => setShowPeriodicTable(false)}>
          <div style={{ ...s.modal, maxWidth: 1100 }} onClick={e => e.stopPropagation()}>
            <div style={s.modalHead}>
              <div style={s.modalTitle}>Менделеев кестесі</div>
              <button style={s.outlineBtn} onClick={() => setShowPeriodicTable(false)}>✕ Жабу</button>
            </div>
            <img src="/periodic-table.png" alt="Менделеев" style={{ width: '100%', borderRadius: 12 }} />
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Стильдер ─────────────────────────────────────────
const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: 'linear-gradient(160deg, #f0f9ff 0%, #ffffff 60%, #e0f2fe 100%)', color: '#0f172a' },
  center: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(160deg, #f0f9ff, #fff)', padding: 24 },
  loadCard: { width: '100%', maxWidth: 420, background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 30, padding: 40, textAlign: 'center', boxShadow: '0 24px 56px rgba(14,165,233,0.1)', backdropFilter: 'blur(16px)' },
  spinner: { width: 52, height: 52, border: '4px solid rgba(14,165,233,0.2)', borderTop: '4px solid #0ea5e9', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 20px' },
  loadTitle: { fontSize: 22, fontWeight: 900, color: '#0c4a6e', marginBottom: 8, letterSpacing: '-0.03em' },
  loadSub: { fontSize: 14, color: '#64748b', marginBottom: 20, fontWeight: 600 },

  topBar: { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(14,165,233,0.12)', padding: '10px 20px', backdropFilter: 'blur(16px)' },
  topWrap: { maxWidth: 1400, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' },
  topLeft: { display: 'flex', alignItems: 'center', gap: 14 },
  topRight: { display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' },
  backBtn: { padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(14,165,233,0.2)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#0369a1' },
  topTitle: { fontSize: 17, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' },
  topSub: { fontSize: 12, color: '#64748b', fontWeight: 700, marginTop: 2 },
  timer: { padding: '9px 18px', borderRadius: 14, fontWeight: 900, fontSize: 20, minWidth: 120, textAlign: 'center' as const, letterSpacing: '-0.02em' },
  outlineBtn: { padding: '9px 14px', borderRadius: 12, border: '1px solid rgba(14,165,233,0.2)', background: '#fff', cursor: 'pointer', fontWeight: 700, fontSize: 13, color: '#0c4a6e' },
  primaryBtn: { padding: '9px 16px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', cursor: 'pointer', fontWeight: 800, fontSize: 13, boxShadow: '0 8px 18px rgba(14,165,233,0.28)' },

  tabsBar: { background: 'rgba(255,255,255,0.88)', borderBottom: '1px solid rgba(14,165,233,0.1)', padding: '0 20px', backdropFilter: 'blur(12px)' },
  tabsWrap: { maxWidth: 1400, margin: '0 auto', display: 'flex', gap: 8, overflowX: 'auto' as const, padding: '10px 0' },
  tabBtn: { padding: '9px 14px', borderRadius: 14, fontWeight: 700, cursor: 'pointer', whiteSpace: 'nowrap' as const, display: 'flex', flexDirection: 'column' as const, alignItems: 'center', gap: 2, fontSize: 13, transition: 'all 0.16s ease' },
  tabCount: { fontSize: 11, fontWeight: 700 },

  content: { maxWidth: 1400, margin: '0 auto', padding: '20px 20px 40px' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 296px', gap: 18, alignItems: 'start' },

  mainCard: { background: 'rgba(255,255,255,0.92)', borderRadius: 26, padding: 28, boxShadow: '0 16px 36px rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.12)', backdropFilter: 'blur(12px)' },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 14, flexWrap: 'wrap' as const },
  subjectPill: { padding: '6px 12px', borderRadius: 999, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.2)', color: '#0369a1', fontSize: 12, fontWeight: 800 },
  multiplePill: { padding: '6px 12px', borderRadius: 999, background: '#fef3c7', border: '1px solid #fcd34d', color: '#92400e', fontSize: 11, fontWeight: 800 },
  matchingPill: { padding: '6px 12px', borderRadius: 999, background: '#f0fdf4', border: '1px solid #86efac', color: '#166534', fontSize: 11, fontWeight: 800 },
  mapPill: { padding: '6px 12px', borderRadius: 999, background: '#fff7ed', border: '1px solid #fed7aa', color: '#9a3412', fontSize: 11, fontWeight: 800 },
  pointsPill: { padding: '6px 12px', borderRadius: 999, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)', color: '#64748b', fontSize: 12, fontWeight: 700 },
  qCount: { fontSize: 12, color: '#94a3b8', marginBottom: 14, fontWeight: 700 },
  contextBox: { background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 14, padding: 18, fontSize: 15, lineHeight: 1.85, color: '#334155', marginBottom: 18, whiteSpace: 'pre-wrap' as const },
  qText: { fontSize: 21, fontWeight: 700, lineHeight: 1.65, color: '#0c4a6e', marginBottom: 22 },

  optionsWrap: { display: 'flex', flexDirection: 'column' as const, gap: 10 },
  optionBtn: { width: '100%', textAlign: 'left' as const, padding: 15, borderRadius: 16, cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: 14, transition: 'all 0.15s ease' },
  optionLetter: { width: 32, height: 32, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13 },
  optionText: { paddingTop: 4, fontSize: 15, lineHeight: 1.7, fontWeight: 600, color: '#0f172a' },

  matchingWrap: { marginBottom: 8 },
  matchingGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 },
  matchCol: {},
  matchColTitle: { fontSize: 11, fontWeight: 900, color: '#94a3b8', marginBottom: 12, textTransform: 'uppercase' as const, letterSpacing: '0.06em' },
  matchItem: { background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#0f172a' },
  matchSelect: { width: '100%', padding: '8px 12px', borderRadius: 10, border: '1px solid rgba(14,165,233,0.2)', background: '#fff', fontSize: 14, fontWeight: 600, color: '#0f172a', cursor: 'pointer', marginBottom: 4 },
  matchRightItem: { background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10, padding: '10px 14px', fontSize: 14, fontWeight: 600, marginBottom: 6, color: '#1d4ed8' },

  navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' as const },

  sidePanel: { display: 'flex', flexDirection: 'column' as const, gap: 14, position: 'sticky' as const, top: 80 },
  sideCard: { background: 'rgba(255,255,255,0.92)', borderRadius: 20, padding: 18, boxShadow: '0 10px 24px rgba(14,165,233,0.07)', border: '1px solid rgba(14,165,233,0.12)' },
  sideTitle: { fontSize: 15, fontWeight: 900, color: '#0c4a6e', marginBottom: 10, letterSpacing: '-0.02em' },
  sideInfo: { fontSize: 14, color: '#64748b', lineHeight: 1.85, fontWeight: 600 },
  qGrid: { display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 6, marginTop: 10 },
  qGridBtn: { height: 36, borderRadius: 10, cursor: 'pointer', fontSize: 12, color: '#0f172a', fontWeight: 700 },
  legend: { marginTop: 14, display: 'flex', flexDirection: 'column' as const, gap: 6 },
  legendRow: { display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b', fontWeight: 600 },
  legendDot: { width: 13, height: 13, borderRadius: 5 },

  overlay: { position: 'fixed' as const, inset: 0, background: 'rgba(12,74,110,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20, zIndex: 100, backdropFilter: 'blur(4px)' },
  modal: { width: 'min(480px, 96vw)', maxHeight: '90vh', overflowY: 'auto' as const, background: '#fff', borderRadius: 26, padding: 24, boxShadow: '0 32px 80px rgba(12,74,110,0.2)', border: '1px solid rgba(14,165,233,0.15)' },
  modalHead: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 19, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em' },
  calcDisplay: { width: '100%', padding: '14px 16px', borderRadius: 14, border: '1px solid rgba(14,165,233,0.2)', background: '#f0f9ff', fontSize: 26, textAlign: 'right' as const, marginBottom: 12, fontWeight: 900, color: '#0c4a6e', overflowX: 'auto' as const },
  calcGrid: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 },
  calcBtn: { padding: '13px 10px', borderRadius: 12, border: '1px solid rgba(14,165,233,0.15)', background: '#f8fafc', fontSize: 16, fontWeight: 800, cursor: 'pointer', color: '#0c4a6e' },
}