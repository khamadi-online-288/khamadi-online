'use client'
import type { Session } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { motion, AnimatePresence } from 'framer-motion'
import { awardXP } from '@/lib/english/xp'
import Link from 'next/link'

interface VocabWord { id: string; word: string; translation?: string; definition?: string; etymology?: string; root_words?: string[]; example_sentence?: string; difficulty: number; next_review_at: string; correct_count: number; incorrect_count: number }

type Mode = 'flashcard' | 'choice' | 'write'

function getNextReview(difficulty: number, knew: boolean): string {
  const intervals: Record<number, [number, number]> = { 0: [1, 0], 1: [3, 1], 2: [7, 2], 3: [21, 5] }
  const [knowDays, dontKnowDays] = intervals[Math.min(3, difficulty)] ?? [1, 0]
  const days = knew ? knowDays : dontKnowDays
  const next = new Date()
  next.setDate(next.getDate() + days)
  return next.toISOString()
}

export default function PracticePage() {
  const supabase = createEnglishClient()
  const [queue, setQueue] = useState<VocabWord[]>([])
  const [allWords, setAllWords] = useState<VocabWord[]>([])
  const [idx, setIdx] = useState(0)
  const [mode, setMode] = useState<Mode>('flashcard')
  const [revealed, setRevealed] = useState(false)
  const [choices, setChoices] = useState<string[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [writeInput, setWriteInput] = useState('')
  const [writeChecked, setWriteChecked] = useState(false)
  const [uid, setUid] = useState('')
  const [stats, setStats] = useState({ correct: 0, incorrect: 0 })
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(async (res: { data: { session: Session | null } }) => {
      const session = res.data.session
      if (!session) return
      setUid(session.user.id)
      const now = new Date().toISOString()
      const { data } = await supabase.from('english_vocabulary').select('*').eq('user_id', session.user.id).lte('next_review_at', now).order('next_review_at').limit(20)
      const { data: all } = await supabase.from('english_vocabulary').select('id,word,translation').eq('user_id', session.user.id).limit(100)
      setQueue((data ?? []) as VocabWord[])
      setAllWords((all ?? []) as VocabWord[])
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (queue.length === 0) return
    const w = queue[idx]
    if (!w) return
    setRevealed(false); setSelected(null); setWriteInput(''); setWriteChecked(false)
    if (mode === 'choice') {
      const others = allWords.filter(a => a.id !== w.id && a.translation).map(a => a.translation!)
      const shuffled = [w.translation!, ...others.sort(() => Math.random() - 0.5).slice(0, 3)].sort(() => Math.random() - 0.5)
      setChoices(shuffled)
    }
  }, [idx, mode, queue])

  async function handleResult(knew: boolean) {
    const w = queue[idx]
    if (!w) return
    const newDifficulty = knew ? Math.min(3, w.difficulty + 1) : Math.max(0, w.difficulty - 1)
    const nextReviewAt = getNextReview(w.difficulty, knew)
    await supabase.from('english_vocabulary').update({ difficulty: newDifficulty, next_review_at: nextReviewAt, correct_count: w.correct_count + (knew ? 1 : 0), incorrect_count: w.incorrect_count + (knew ? 0 : 1) }).eq('id', w.id)
    if (knew && newDifficulty >= 3 && uid) awardXP(supabase, uid, 'vocabulary_mastered').catch(() => {})
    setStats(s => ({ ...s, correct: s.correct + (knew ? 1 : 0), incorrect: s.incorrect + (knew ? 0 : 1) }))
    if (idx + 1 >= queue.length) setDone(true)
    else setIdx(i => i + 1)
  }

  if (loading) return <div style={{ textAlign: 'center' as const, padding: 80, color: '#94a3b8', fontSize: 15 }}>Загрузка слов...</div>

  if (queue.length === 0) return (
    <div style={{ maxWidth: 500, margin: '80px auto', textAlign: 'center' as const }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
      <h2 style={{ fontSize: 20, fontWeight: 900, color: '#10b981', marginBottom: 8 }}>Нет слов для повторения!</h2>
      <p style={{ fontSize: 14, color: '#64748b', marginBottom: 24 }}>Все слова в расписании. Возвращайтесь позже.</p>
      <Link href="/english/dashboard/vocabulary"><button style={{ padding: '12px 24px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>В словарь</button></Link>
    </div>
  )

  if (done) return (
    <div style={{ maxWidth: 480, margin: '80px auto', textAlign: 'center' as const }}>
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🎉</div>
        <h2 style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', marginBottom: 8 }}>Сессия завершена!</h2>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginBottom: 24 }}>
          <div style={{ background: '#dcfce7', borderRadius: 12, padding: '12px 20px', fontSize: 20, fontWeight: 900, color: '#16a34a' }}>{stats.correct} ✓</div>
          <div style={{ background: '#fee2e2', borderRadius: 12, padding: '12px 20px', fontSize: 20, fontWeight: 900, color: '#dc2626' }}>{stats.incorrect} ✗</div>
        </div>
        <Link href="/english/dashboard/vocabulary"><button style={{ padding: '12px 28px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>В словарь</button></Link>
      </motion.div>
    </div>
  )

  const w = queue[idx]
  const progressPct = Math.round((idx / queue.length) * 100)

  return (
    <div style={{ maxWidth: 600, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <Link href="/english/dashboard/vocabulary" style={{ fontSize: 13, color: '#64748b', textDecoration: 'none', fontWeight: 600 }}>← Словарь</Link>
        <div style={{ flex: 1, margin: '0 16px', height: 6, background: '#e2e8f0', borderRadius: 999 }}>
          <div style={{ height: '100%', background: '#1B8FC4', borderRadius: 999, width: `${progressPct}%`, transition: 'width 0.3s' }} />
        </div>
        <span style={{ fontSize: 12, color: '#94a3b8', fontWeight: 700 }}>{idx + 1}/{queue.length}</span>
      </div>

      {/* Mode switcher */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f1f5f9', borderRadius: 10, padding: 3 }}>
        {([['flashcard', 'Карточка'], ['choice', 'Выбор'], ['write', 'Написать']] as [Mode, string][]).map(([m, l]) => (
          <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontWeight: mode === m ? 800 : 600, fontSize: 12, border: 'none', background: mode === m ? '#fff' : 'transparent', color: mode === m ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat' }}>{l}</button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={`${idx}-${mode}`} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}>
          {/* Etymology card */}
          <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', padding: '24px 28px' }}>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#fff', letterSpacing: '-0.02em', textTransform: 'uppercase' as const }}>{w.word}</div>
              {mode !== 'flashcard' || revealed ? (
                <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.8)', marginTop: 6 }}>{w.translation}</div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 6 }}>— — —</div>
              )}
            </div>
            {(mode === 'flashcard' ? revealed : true) && (
              <div style={{ padding: '20px 24px' }}>
                {w.definition && <div style={{ fontSize: 13, color: '#334155', marginBottom: 12, lineHeight: 1.6 }}>{w.definition}</div>}
                {w.etymology && (
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
                    <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                      <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Происхождение</div>
                      <div style={{ fontSize: 12, color: '#334155', lineHeight: 1.5 }}>{w.etymology}</div>
                    </div>
                    {w.root_words && w.root_words.length > 0 && (
                      <div style={{ background: '#f8fafc', borderRadius: 10, padding: '12px 14px' }}>
                        <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', marginBottom: 6, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>Однокоренные</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap' as const, gap: 4 }}>
                          {w.root_words.map(r => <span key={r} style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 5, padding: '2px 7px', fontSize: 11, fontWeight: 700 }}>{r}</span>)}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {w.example_sentence && <div style={{ background: '#fffbeb', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#78350f', fontStyle: 'italic', borderLeft: '3px solid #C9933B' }}>&ldquo;{w.example_sentence}&rdquo;</div>}
              </div>
            )}
          </div>

          {/* Controls */}
          {mode === 'flashcard' && !revealed && (
            <button onClick={() => setRevealed(true)} style={{ width: '100%', padding: '14px', borderRadius: 14, background: '#f1f5f9', color: '#475569', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Показать перевод</button>
          )}
          {mode === 'flashcard' && revealed && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <button onClick={() => handleResult(false)} style={{ padding: '14px', borderRadius: 14, background: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>✗ Не знаю</button>
              <button onClick={() => handleResult(true)} style={{ padding: '14px', borderRadius: 14, background: '#dcfce7', color: '#16a34a', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>✓ Знаю</button>
            </div>
          )}
          {mode === 'choice' && (
            <div style={{ display: 'flex', flexDirection: 'column' as const, gap: 8 }}>
              {choices.map(c => {
                const isCorrect = c === w.translation
                const isSelected = selected === c
                let bg = '#f8fafc', border = '1.5px solid rgba(27,143,196,0.15)', color = '#334155'
                if (selected) { if (isCorrect) { bg = '#dcfce7'; border = '2px solid #10b981'; color = '#166534' } else if (isSelected) { bg = '#fee2e2'; border = '2px solid #ef4444'; color = '#dc2626' } }
                return (
                  <button key={c} onClick={() => { if (!selected) { setSelected(c); setTimeout(() => handleResult(isCorrect), 800) } }}
                    style={{ padding: '12px 16px', borderRadius: 11, border, background: bg, color, fontWeight: 700, fontSize: 14, cursor: selected ? 'default' : 'pointer', fontFamily: 'Montserrat', textAlign: 'left' as const }}>
                    {c}
                  </button>
                )
              })}
            </div>
          )}
          {mode === 'write' && (
            <div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 8 }}>Напишите слово по-английски:</div>
              <input value={writeInput} onChange={e => setWriteInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && !writeChecked && setWriteChecked(true)} disabled={writeChecked} autoFocus placeholder="Введите слово..."
                style={{ width: '100%', padding: '12px 16px', border: writeChecked ? (writeInput.trim().toLowerCase() === w.word.toLowerCase() ? '2px solid #10b981' : '2px solid #ef4444') : '1.5px solid rgba(27,143,196,0.2)', borderRadius: 11, fontSize: 15, fontFamily: 'Montserrat', outline: 'none', marginBottom: 10, boxSizing: 'border-box' as const }} />
              {!writeChecked ? (
                <button onClick={() => setWriteChecked(true)} disabled={!writeInput.trim()} style={{ width: '100%', padding: '12px', borderRadius: 11, background: writeInput.trim() ? '#1B3A6B' : '#e2e8f0', color: writeInput.trim() ? '#fff' : '#94a3b8', fontWeight: 800, border: 'none', cursor: writeInput.trim() ? 'pointer' : 'default', fontFamily: 'Montserrat', fontSize: 14 }}>Проверить</button>
              ) : (
                <div>
                  {writeInput.trim().toLowerCase() === w.word.toLowerCase() ? (
                    <div style={{ fontSize: 14, color: '#16a34a', fontWeight: 700, marginBottom: 10 }}>✓ Правильно!</div>
                  ) : (
                    <div style={{ fontSize: 14, color: '#dc2626', fontWeight: 700, marginBottom: 10 }}>✗ Неверно. Правильно: <strong>{w.word}</strong></div>
                  )}
                  <button onClick={() => handleResult(writeInput.trim().toLowerCase() === w.word.toLowerCase())} style={{ width: '100%', padding: '12px', borderRadius: 11, background: '#1B3A6B', color: '#fff', fontWeight: 800, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', fontSize: 14 }}>Далее →</button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
