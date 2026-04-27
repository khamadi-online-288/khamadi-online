'use client'
import type { Session } from '@supabase/supabase-js'
import { useState, useEffect, useRef } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { PLACEMENT_QUESTIONS, calculateLevel, LEVEL_DESCRIPTIONS } from '@/lib/english/placement-questions'
import { awardXP } from '@/lib/english/xp'
import { motion, AnimatePresence } from 'framer-motion'

type Screen = 'intro' | 'test' | 'result'
type Section = 'grammar' | 'vocabulary' | 'reading'

const SECTION_ORDER: Section[] = ['grammar', 'vocabulary', 'reading']
const SECTION_LABELS: Record<Section, string> = { grammar: 'Грамматика', vocabulary: 'Словарный запас', reading: 'Чтение' }

interface SectionResult { score: number; total: number; pct: number }

export default function PlacementPage() {
  const supabase = createEnglishClient()
  const [screen, setScreen] = useState<Screen>('intro')
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const [current, setCurrent] = useState(0)
  const [result, setResult] = useState<{ level: string; grammar: SectionResult; vocabulary: SectionResult; reading: SectionResult } | null>(null)
  const [prevResult, setPrevResult] = useState<{ level: string; date: string } | null>(null)
  const [uid, setUid] = useState('')
  const [elapsed, setElapsed] = useState(0)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  useEffect(() => {
    supabase.auth.getSession().then((res: { data: { session: Session | null } }) => {
      const session = res.data.session
      if (!session) return
      setUid(session.user.id)
      supabase.from('english_placement_results').select('recommended_level,completed_at').eq('user_id', session.user.id).order('completed_at', { ascending: false }).limit(1).maybeSingle().then((r: { data: { recommended_level: string; completed_at: string } | null }) => {
        if (r.data) setPrevResult({ level: r.data.recommended_level, date: new Date(r.data.completed_at).toLocaleDateString('ru-RU') })
      })
    })
  }, [])

  useEffect(() => {
    if (screen === 'test') {
      timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000)
    } else {
      if (timerRef.current) clearInterval(timerRef.current)
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [screen])

  function formatTime(s: number) {
    return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`
  }

  function sectionScore(section: Section): SectionResult {
    const qs = PLACEMENT_QUESTIONS.filter(q => q.section === section)
    const correct = qs.filter(q => answers[q.id] === q.answer).length
    return { score: correct, total: qs.length, pct: Math.round((correct / qs.length) * 100) }
  }

  async function finish() {
    const g = sectionScore('grammar')
    const v = sectionScore('vocabulary')
    const r = sectionScore('reading')
    const level = calculateLevel(g.pct, r.pct, v.pct)
    setResult({ level, grammar: g, vocabulary: v, reading: r })

    if (uid) {
      await supabase.from('english_placement_results').insert({ user_id: uid, score: g.score + v.score + r.score, grammar_score: g.pct, reading_score: r.pct, vocabulary_score: v.pct, recommended_level: level, answers })
      const earned = await awardXP(supabase, uid, 'placement_done')
      setXpEarned(earned)
    }
    setScreen('result')
  }

  const allQ = PLACEMENT_QUESTIONS
  const q = allQ[current]
  const sectionProgress = SECTION_ORDER.reduce<Record<Section, { done: number; total: number }>>((acc, s) => {
    const qs = allQ.filter(x => x.section === s)
    acc[s] = { done: qs.filter(x => answers[x.id] !== undefined).length, total: qs.length }
    return acc
  }, {} as Record<Section, { done: number; total: number }>)

  if (screen === 'intro') return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <div style={{ background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', borderRadius: 24, padding: 40, color: '#fff', marginBottom: 24, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>◑</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, margin: '0 0 8px' }}>Placement Test</h1>
        <p style={{ fontSize: 14, opacity: 0.8, margin: 0 }}>Определите свой уровень английского языка</p>
      </div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20 }}>
        {[{ label: 'Грамматика', count: '20 вопросов', icon: '◑' }, { label: 'Словарный запас', count: '20 вопросов', icon: '≡' }, { label: 'Чтение', count: '20 вопросов', icon: '▤' }].map(s => (
          <div key={s.label} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
            <span style={{ fontSize: 20, width: 28 }}>{s.icon}</span>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#1B3A6B' }}>{s.label}</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>{s.count}</div>
            </div>
          </div>
        ))}
        {prevResult && <div style={{ marginTop: 16, padding: '10px 14px', borderRadius: 10, background: '#f0f9ff', border: '1px solid rgba(27,143,196,0.15)', fontSize: 13, color: '#0369a1' }}>Предыдущий результат: <strong>{prevResult.level}</strong> ({prevResult.date})</div>}
      </div>
      <div style={{ textAlign: 'center', fontSize: 12, color: '#94a3b8', marginBottom: 20 }}>60 вопросов · без ограничения времени · +50 XP</div>
      <button onClick={() => setScreen('test')} style={{ width: '100%', padding: '16px', borderRadius: 16, background: '#1B8FC4', color: '#fff', fontWeight: 900, fontSize: 16, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Начать тест</button>
    </div>
  )

  if (screen === 'result' && result) return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', borderRadius: 24, padding: 40, textAlign: 'center', marginBottom: 24 }}>
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', border: '3px solid rgba(255,255,255,0.3)' }}>
          <span style={{ fontFamily: 'Georgia,serif', fontSize: 44, fontWeight: 700, color: '#fff' }}>{result.level}</span>
        </div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#fff', margin: '0 0 8px' }}>Ваш уровень</h2>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>{LEVEL_DESCRIPTIONS[result.level]}</p>
        {xpEarned > 0 && <div style={{ marginTop: 16, display: 'inline-block', background: 'rgba(201,147,59,0.25)', border: '1px solid rgba(201,147,59,0.5)', borderRadius: 99, padding: '6px 18px', color: '#fcd34d', fontWeight: 800, fontSize: 14 }}>+{xpEarned} XP</div>}
      </motion.div>
      <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', marginBottom: 20 }}>
        <div style={{ fontSize: 15, fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>Результаты по разделам</div>
        {[{ label: 'Грамматика', data: result.grammar }, { label: 'Словарный запас', data: result.vocabulary }, { label: 'Чтение', data: result.reading }].map(({ label, data }) => (
          <div key={label} style={{ marginBottom: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13, fontWeight: 700, color: '#334155' }}>
              <span>{label}</span><span style={{ color: data.pct >= 70 ? '#10b981' : data.pct >= 40 ? '#f59e0b' : '#ef4444' }}>{data.score}/{data.total} ({data.pct}%)</span>
            </div>
            <div style={{ height: 8, background: '#e2e8f0', borderRadius: 999 }}>
              <div style={{ height: '100%', borderRadius: 999, background: data.pct >= 70 ? '#10b981' : data.pct >= 40 ? '#C9933B' : '#ef4444', width: `${data.pct}%`, transition: 'width 0.6s' }} />
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => setScreen('intro')} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#f1f5f9', color: '#1B3A6B', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Пройти снова</button>
    </div>
  )

  // Test screen
  const isReading = q.section === 'reading'
  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>
      {/* Progress header */}
      <div style={{ background: '#fff', borderRadius: 16, padding: '14px 20px', marginBottom: 20, border: '1px solid rgba(27,143,196,0.1)', display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' as const }}>
        {SECTION_ORDER.map(s => (
          <div key={s} style={{ flex: 1, minWidth: 100 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#64748b', marginBottom: 4 }}>{SECTION_LABELS[s]} {sectionProgress[s].done}/{sectionProgress[s].total}</div>
            <div style={{ height: 4, background: '#e2e8f0', borderRadius: 999 }}>
              <div style={{ height: '100%', borderRadius: 999, background: '#1B8FC4', width: `${(sectionProgress[s].done / sectionProgress[s].total) * 100}%`, transition: 'width 0.2s' }} />
            </div>
          </div>
        ))}
        <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700, flexShrink: 0 }}>{formatTime(elapsed)}</div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={current} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
          <div style={{ padding: '18px 24px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 700, color: '#64748b' }}>
            <span>{SECTION_LABELS[q.section as Section]} · Уровень {q.level}</span>
            <span>{current + 1} / {allQ.length}</span>
          </div>
          {isReading && q.passage && (
            <div style={{ padding: '16px 24px', background: '#f0f9ff', borderBottom: '1px solid rgba(27,143,196,0.1)', fontSize: 13, color: '#334155', lineHeight: 1.7, maxHeight: 200, overflowY: 'auto' as const }}>{q.passage}</div>
          )}
          <div style={{ padding: '20px 24px' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#1B3A6B', marginBottom: 20 }}>{q.question}</div>
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 10 }}>
              {q.options.map(opt => {
                const selected = answers[q.id] === opt
                return (
                  <button key={opt} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))}
                    style={{ padding: '12px 16px', borderRadius: 12, border: selected ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.2)', background: selected ? '#1B8FC4' : '#f8fafc', color: selected ? '#fff' : '#334155', fontWeight: selected ? 700 : 600, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const, transition: 'all 0.15s' }}>
                    {opt}
                  </button>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              {current > 0 && <button onClick={() => setCurrent(c => c - 1)} style={{ flex: 1, padding: '12px', borderRadius: 12, background: '#f1f5f9', color: '#64748b', fontWeight: 700, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>← Назад</button>}
              {current < allQ.length - 1 ? (
                <button onClick={() => answers[q.id] && setCurrent(c => c + 1)} disabled={!answers[q.id]}
                  style={{ flex: 2, padding: '12px', borderRadius: 12, background: answers[q.id] ? '#1B3A6B' : '#e2e8f0', color: answers[q.id] ? '#fff' : '#94a3b8', fontWeight: 800, border: 'none', cursor: answers[q.id] ? 'pointer' : 'default', fontFamily: 'Montserrat' }}>
                  Далее →
                </button>
              ) : (
                <button onClick={finish} style={{ flex: 2, padding: '12px', borderRadius: 12, background: '#10b981', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
                  Завершить тест
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
