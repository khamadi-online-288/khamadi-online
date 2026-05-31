'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import Link from 'next/link'
import { useZkuLang } from '../zku-lang'
import { IcTarget, IcClock, IcEdit, IcGraduation, IcTrendUp, IcAward } from '../_icons'
import { PLACEMENT_QUESTIONS, QUESTIONS_BY_LEVEL, LEVEL_ORDER } from '@/lib/english/placementQuestions'
import { calculatePlacementLevel, checkAnswer, getNextLevel } from '@/lib/english/placementLogic'
import type { PlacementQuestion } from '@/lib/english/placementQuestions'
import type { PlacementResult } from '@/lib/english/placementLogic'

const N = '#003876'
const S = '#1B8FC4'
const T = '#1D9E75'
const O = '#EF9F27'
const C = '#D85A30'

const LEVEL_COLOR: Record<string, string> = {
  A1: T, A2: S, B1: '#7C3AED', B2: '#DB2777', C1: O,
}

type Screen = 'welcome' | 'test' | 'result'
type AnswerRecord = { questionId: number; userAnswer: number | string; isCorrect: boolean }

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

/* ── Word Order component ── */
function WordOrder({ words, onAnswer }: { words: string[]; onAnswer: (a: string) => void }) {
  const { t } = useZkuLang()
  const [remaining, setRemaining] = useState<string[]>(() => shuffle(words))
  const [built, setBuilt]         = useState<string[]>([])

  useEffect(() => { setRemaining(shuffle(words)); setBuilt([]) }, [words])

  const pick   = (w: string, i: number) => { setRemaining(r => r.filter((_, j) => j !== i)); setBuilt(b => [...b, w]) }
  const remove = (w: string, i: number) => { setBuilt(b => b.filter((_, j) => j !== i)); setRemaining(r => [...r, w]) }
  const clear  = () => { setRemaining(shuffle(words)); setBuilt([]) }
  const answer = built.join(' ')

  return (
    <div>
      <div style={{
        minHeight: 52, border: `2px dashed ${built.length ? N : '#CBD5E1'}`,
        borderRadius: 14, padding: '10px 14px', marginBottom: 14,
        display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center',
        background: built.length ? '#F8FBFF' : '#FAFAFA',
      }}>
        {built.length === 0 && <span style={{ color: '#CBD5E1', fontSize: 13 }}>{t.placement.word_hint}</span>}
        {built.map((w, i) => (
          <button key={`b-${i}`} onClick={() => remove(w, i)} style={{
            padding: '6px 14px', borderRadius: 8, border: `1.5px solid ${N}`,
            background: N, color: '#fff', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{w}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 20 }}>
        {remaining.map((w, i) => (
          <button key={`r-${i}`} onClick={() => pick(w, i)} style={{
            padding: '8px 16px', borderRadius: 10, border: '1.5px solid #E2E8F0',
            background: '#fff', color: '#334155', fontSize: 13, fontWeight: 600,
            cursor: 'pointer', fontFamily: 'inherit',
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = S; (e.currentTarget as HTMLElement).style.color = S }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#E2E8F0'; (e.currentTarget as HTMLElement).style.color = '#334155' }}>
            {w}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <button onClick={clear} style={{
          padding: '10px 18px', borderRadius: 10, border: '1.5px solid #E2E8F0',
          background: '#fff', color: '#64748B', fontSize: 13, fontWeight: 600,
          cursor: 'pointer', fontFamily: 'inherit',
        }}>{t.placement.reset}</button>
        <button onClick={() => onAnswer(answer)} disabled={!built.length} style={{
          flex: 1, padding: '12px', borderRadius: 10, border: 'none',
          background: built.length ? N : '#CBD5E1', color: '#fff',
          fontSize: 14, fontWeight: 700, cursor: built.length ? 'pointer' : 'not-allowed',
          fontFamily: 'inherit', boxShadow: built.length ? '0 4px 14px rgba(0,56,118,0.25)' : 'none',
        }}>{t.placement.answer}</button>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function PlacementTestPage() {
  const { t } = useZkuLang()
  const [screen,       setScreen]       = useState<Screen>('welcome')
  const [activeQ,      setActiveQ]      = useState<PlacementQuestion[]>([])
  const [qIdx,         setQIdx]         = useState(0)
  const [answers,      setAnswers]      = useState<AnswerRecord[]>([])
  const [selected,     setSelected]     = useState<number | null>(null)
  const [currentBlock, setCurrentBlock] = useState<'A1'|'A2'|'B1'|'B2'|'C1'>('A1')
  const [result,       setResult]       = useState<PlacementResult | null>(null)
  const [levelSaved,   setLevelSaved]   = useState(false)

  const saveLevel = useCallback(async (level: string) => {
    if (levelSaved) return
    try {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      await supabase
        .from('english_user_profiles')
        .upsert({ user_id: user.id, current_level: level, role: 'student' }, { onConflict: 'user_id' })
      setLevelSaved(true)
    } catch { /* silent */ }
  }, [levelSaved])

  function startTest() {
    setActiveQ(QUESTIONS_BY_LEVEL['A1'])
    setCurrentBlock('A1')
    setQIdx(0); setAnswers([]); setSelected(null)
    setScreen('test')
  }

  function submitAnswer(userAnswer: number | string) {
    const question = activeQ[qIdx]
    if (!question) return
    const isCorrect  = checkAnswer(question, userAnswer)
    const newAnswers = [...answers, { questionId: question.id, userAnswer, isCorrect }]
    setAnswers(newAnswers)
    setSelected(null)

    const nextIdx = qIdx + 1
    const blockAnswers = newAnswers.filter(a => {
      const q = PLACEMENT_QUESTIONS.find(q => q.id === a.questionId)
      return q?.level === currentBlock
    })

    if (blockAnswers.length === 6) {
      const blockCorrect = blockAnswers.filter(a => a.isCorrect).length
      if (blockCorrect >= 4) {
        const next = getNextLevel(currentBlock)
        if (next) {
          setActiveQ(prev => [...prev, ...QUESTIONS_BY_LEVEL[next]])
          setCurrentBlock(next)
          setQIdx(nextIdx)
          return
        }
      }
      const r = calculatePlacementLevel(newAnswers, PLACEMENT_QUESTIONS)
      setResult(r)
      saveLevel(r.level)
      setScreen('result')
      return
    }

    if (nextIdx < activeQ.length) {
      setQIdx(nextIdx)
    } else {
      const r = calculatePlacementLevel(newAnswers, PLACEMENT_QUESTIONS)
      setResult(r)
      saveLevel(r.level)
      setScreen('result')
    }
  }

  /* ══ WELCOME ══ */
  if (screen === 'welcome') {
    return (
      <div style={{ padding: '40px 32px', maxWidth: 640, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{
          background: '#fff', borderRadius: 24, padding: '48px 44px',
          boxShadow: '0 4px 32px rgba(0,56,118,0.08)', border: '1px solid rgba(0,56,118,0.07)', textAlign: 'center',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}><IcTarget size={56} color={N} /></div>
          <div style={{ fontSize: 11, fontWeight: 700, color: S, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
            {t.course.platform}
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: N, marginBottom: 12, letterSpacing: '-0.02em' }}>
            {t.placement.title}
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', lineHeight: 1.6, marginBottom: 36 }}>
            {t.placement.subtitle}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 36, textAlign: 'left' }}>
            {[
              { icon: <IcClock      size={20} color={S} />, label: t.placement.duration },
              { icon: <IcEdit       size={20} color={S} />, label: t.placement.questions },
              { icon: <IcGraduation size={20} color={S} />, label: t.placement.result },
              { icon: <IcTrendUp    size={20} color={S} />, label: t.placement.adaptive },
            ].map(i => (
              <div key={i.label} style={{ background: '#F8FBFF', borderRadius: 14, padding: '14px 16px', border: '1px solid rgba(27,143,196,0.1)' }}>
                <div style={{ marginBottom: 6 }}>{i.icon}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{i.label}</div>
              </div>
            ))}
          </div>

          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: 12, padding: '12px 16px', marginBottom: 28, textAlign: 'left' }}>
            <div style={{ fontSize: 12, color: '#92400E', fontWeight: 600 }}>{t.placement.tip}</div>
          </div>

          <button onClick={startTest} style={{
            width: '100%', padding: '16px', borderRadius: 14, border: 'none',
            background: `linear-gradient(135deg, ${N}, #0a4fa8)`,
            color: '#fff', fontSize: 16, fontWeight: 800, cursor: 'pointer', fontFamily: 'inherit',
            boxShadow: '0 6px 24px rgba(0,56,118,0.3)',
          }}>{t.placement.start}</button>
        </div>
      </div>
    )
  }

  /* ══ RESULT ══ */
  if (screen === 'result' && result) {
    const levelColor  = result.level === 'Beginner' ? C : (LEVEL_COLOR[result.level] ?? N)
    const wrongAnswers = answers
      .filter(a => !a.isCorrect)
      .map(a => ({ answer: a, question: PLACEMENT_QUESTIONS.find(q => q.id === a.questionId)! }))
      .filter(x => x.question)

    return (
      <div style={{ padding: '32px', maxWidth: 760, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>
        {/* Hero */}
        <div style={{
          background: `linear-gradient(135deg, ${N}, #0a4fa8)`,
          borderRadius: 24, padding: '40px 44px', marginBottom: 20,
          color: '#fff', textAlign: 'center', boxShadow: '0 8px 32px rgba(0,56,118,0.3)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><IcAward size={52} color="rgba(255,255,255,0.9)" /></div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>{t.placement.your_level}</div>
          <div style={{
            display: 'inline-block', padding: '12px 36px', borderRadius: 16,
            background: levelColor, fontSize: 36, fontWeight: 900, marginBottom: 14,
            boxShadow: `0 6px 20px ${levelColor}66`,
          }}>{result.level}</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>{result.levelName}</div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, maxWidth: 420, margin: '0 auto' }}>{result.description}</div>
          <div style={{ marginTop: 20, fontSize: 13, color: 'rgba(255,255,255,0.45)' }}>
            {t.placement.correct}: {result.totalCorrect} / {result.totalAnswered}
          </div>
        </div>

        {/* Scores by level */}
        <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>{t.placement.by_level}</div>
          {LEVEL_ORDER.map(lv => {
            const sc = result.scores[lv]
            if (sc.total === 0) return null
            const color = LEVEL_COLOR[lv] ?? N
            return (
              <div key={lv} style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
                <div style={{
                  width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                  background: sc.passed ? `${color}18` : '#FEE2E2',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 13, fontWeight: 900, color: sc.passed ? color : C,
                }}>{lv}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ fontWeight: 600, color: N }}>{sc.correct} / {sc.total}</span>
                    <span style={{ fontWeight: 700, color: sc.passed ? T : C }}>
                      {sc.passed ? t.placement.passed_lv : t.placement.failed_lv}
                    </span>
                  </div>
                  <div style={{ height: 7, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${(sc.correct / sc.total) * 100}%`, background: sc.passed ? color : C, borderRadius: 99 }} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Wrong answers breakdown */}
        {wrongAnswers.length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', marginBottom: 16, boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>
              {t.placement.mistakes} ({wrongAnswers.length})
            </div>
            {wrongAnswers.map(({ answer, question: q }) => (
              <div key={q.id} style={{ padding: '14px 16px', borderRadius: 14, background: '#FFF8F8', border: '1px solid #FECACA', marginBottom: 10 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#fff', background: C, padding: '2px 8px', borderRadius: 99, flexShrink: 0 }}>{q.level}</span>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1E293B', lineHeight: 1.4 }}>
                    {q.question}
                    {q.text && <div style={{ fontSize: 12, color: '#64748B', fontStyle: 'italic', marginTop: 4, fontWeight: 400 }}>"{q.text.slice(0, 80)}..."</div>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12 }}>
                  <div>
                    <span style={{ color: '#94A3B8' }}>{t.placement.your_ans}: </span>
                    <span style={{ fontWeight: 700, color: C }}>
                      {q.type === 'word_order' ? String(answer.userAnswer) : q.options?.[answer.userAnswer as number] ?? String(answer.userAnswer)}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: '#94A3B8' }}>{t.placement.correct_ans}: </span>
                    <span style={{ fontWeight: 700, color: T }}>
                      {q.type === 'word_order' ? String(q.correct) : q.options?.[q.correct as number]}
                    </span>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: '#64748B', marginTop: 6, padding: '8px 10px', background: '#F1F5F9', borderRadius: 8 }}>
                  {q.explanation}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href={result.recommendedCourseUrl} style={{
            flex: 2, display: 'block', textAlign: 'center',
            background: N, color: '#fff', padding: '15px',
            borderRadius: 14, fontSize: 15, fontWeight: 700, textDecoration: 'none',
            boxShadow: '0 4px 18px rgba(0,56,118,0.28)',
          }}>
            {t.placement.go_course} {result.level} →
          </Link>
          <button onClick={startTest} style={{
            flex: 1, padding: '15px', borderRadius: 14,
            border: '1.5px solid #E2E8F0', background: '#fff',
            color: '#64748B', fontSize: 14, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
          }}>{t.placement.retry}</button>
        </div>
      </div>
    )
  }

  /* ══ TEST ══ */
  const question = activeQ[qIdx]
  if (!question) return null

  const lv = question.level
  const lvColor = LEVEL_COLOR[lv] ?? N
  const blockAnswers = answers.filter(a => PLACEMENT_QUESTIONS.find(q => q.id === a.questionId)?.level === lv)
  const qNumInBlock  = blockAnswers.length + 1
  const totalSoFar   = answers.length + 1
  const maxExpected  = 30
  const pct = Math.round(((totalSoFar - 1) / maxExpected) * 100)

  return (
    <div style={{ padding: '28px 32px', maxWidth: 720, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Progress bar */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#94A3B8', marginBottom: 6 }}>
          <span>{t.placement.q_of_6} {totalSoFar} {t.placement.question_of} ~{maxExpected}</span>
          <span style={{ fontWeight: 700, color: N }}>{pct}%</span>
        </div>
        <div style={{ height: 8, background: '#E2E8F0', borderRadius: 99, overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${pct}%`, background: `linear-gradient(90deg, ${S}, ${N})`, borderRadius: 99, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      {/* Question card */}
      <div style={{ background: '#fff', borderRadius: 22, padding: '32px 36px', boxShadow: '0 2px 16px rgba(0,0,0,0.06)', border: '1px solid rgba(0,56,118,0.06)' }}>

        {/* Level badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}>
          <span style={{ padding: '4px 14px', borderRadius: 99, background: `${lvColor}18`, color: lvColor, fontSize: 12, fontWeight: 800, letterSpacing: '0.06em' }}>
            {t.placement.level_badge} {lv}
          </span>
          <span style={{ fontSize: 12, color: '#CBD5E1' }}>{t.placement.q_of_6} {qNumInBlock} {t.placement.question_of} 6</span>
        </div>

        {/* Reading text */}
        {question.type === 'reading' && question.text && (
          <div style={{ background: '#F8FBFF', borderRadius: 14, padding: '18px 20px', marginBottom: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: S, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 10 }}>{t.lesson.step_text}</div>
            <p style={{ fontSize: 14, color: '#334155', lineHeight: 1.75, margin: 0 }}>{question.text}</p>
          </div>
        )}

        {/* Question */}
        <div style={{ fontSize: 20, fontWeight: 700, color: N, lineHeight: 1.4, marginBottom: 24 }}>
          {question.type === 'fill_blank' ? question.question.replace('___', '______') : question.question}
        </div>

        {/* MC / fill blank / reading */}
        {(question.type === 'multiple_choice' || question.type === 'fill_blank' || question.type === 'reading') && question.options && (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
              {question.options.map((opt, i) => {
                const isSelected = selected === i
                return (
                  <button key={opt} onClick={() => setSelected(i)} style={{
                    display: 'flex', alignItems: 'center', gap: 14,
                    padding: '14px 18px', borderRadius: 12, cursor: 'pointer',
                    border: `2px solid ${isSelected ? N : '#E2E8F0'}`,
                    background: isSelected ? '#EBF4FB' : '#fff',
                    fontFamily: 'inherit', transition: 'all 0.15s', textAlign: 'left',
                  }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${isSelected ? N : '#CBD5E1'}`,
                      background: isSelected ? N : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 12, fontWeight: 800, color: isSelected ? '#fff' : '#94A3B8',
                    }}>{String.fromCharCode(65 + i)}</div>
                    <span style={{ fontSize: 15, fontWeight: isSelected ? 600 : 400, color: isSelected ? N : '#334155' }}>{opt}</span>
                  </button>
                )
              })}
            </div>
            <button onClick={() => { if (selected !== null) submitAnswer(selected) }} disabled={selected === null} style={{
              width: '100%', padding: '14px', borderRadius: 12, border: 'none',
              background: selected !== null ? N : '#CBD5E1',
              color: '#fff', fontSize: 15, fontWeight: 700,
              cursor: selected !== null ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', boxShadow: selected !== null ? '0 4px 16px rgba(0,56,118,0.25)' : 'none',
            }}>{t.placement.answer}</button>
          </>
        )}

        {/* Word order */}
        {question.type === 'word_order' && question.words && (
          <WordOrder words={question.words} onAnswer={submitAnswer} />
        )}
      </div>

      {/* Block progress dots */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
        {Array.from({ length: 6 }, (_, i) => {
          const blockA = answers.filter(a => PLACEMENT_QUESTIONS.find(q => q.id === a.questionId)?.level === lv)
          const isCorrect = blockA[i]?.isCorrect
          return (
            <div key={i} style={{
              width: i < blockAnswers.length ? 28 : 8, height: 8, borderRadius: 99, transition: 'all 0.3s',
              background: i < blockAnswers.length ? (isCorrect ? T : C) : i === blockAnswers.length ? N : '#E2E8F0',
            }} />
          )
        })}
      </div>
    </div>
  )
}