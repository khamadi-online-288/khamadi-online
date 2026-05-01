'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

type VocabItem = { en: string; ru: string }

interface Props { items: VocabItem[] }

type ViewMode = 'cards' | 'list'

export default function VocabFlashcards({ items }: Props) {
  const [current, setCurrent] = useState(0)
  const [flipped,  setFlipped]  = useState(false)
  const [known,    setKnown]    = useState<Set<number>>(new Set())
  const [repeat,   setRepeat]   = useState<Set<number>>(new Set())
  const [mode,     setMode]     = useState<ViewMode>('cards')
  const [shuffle,  setShuffle]  = useState(false)
  const [order,    setOrder]    = useState<number[]>(() => items.map((_, i) => i))

  const total       = items.length
  const realIdx     = order[current] ?? current
  const item        = items[realIdx]
  const pct         = total ? Math.round((known.size / total) * 100) : 0
  const allReviewed = total > 0 && known.size + repeat.size === total

  function goTo(idx: number) {
    setCurrent(Math.max(0, Math.min(total - 1, idx)))
    setFlipped(false)
  }

  function markKnown() {
    setKnown(p  => new Set([...p, realIdx]))
    setRepeat(p => { const s = new Set(p); s.delete(realIdx); return s })
    if (current < total - 1) goTo(current + 1)
  }

  function markRepeat() {
    setRepeat(p => new Set([...p, realIdx]))
    setKnown(p  => { const s = new Set(p); s.delete(realIdx); return s })
    if (current < total - 1) goTo(current + 1)
  }

  function restart() {
    setKnown(new Set())
    setRepeat(new Set())
    goTo(0)
    setShuffle(false)
    setOrder(items.map((_, i) => i))
  }

  function toggleShuffle() {
    if (!shuffle) {
      const arr = [...items.map((_, i) => i)]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      setOrder(arr)
      setShuffle(true)
    } else {
      setOrder(items.map((_, i) => i))
      setShuffle(false)
    }
    goTo(0)
    setKnown(new Set())
    setRepeat(new Set())
  }

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (mode !== 'cards') return
    if (e.key === 'ArrowRight') goTo(current + 1)
    if (e.key === 'ArrowLeft')  goTo(current - 1)
    if (e.key === ' ') { e.preventDefault(); setFlipped(f => !f) }
    if (e.key === 'Enter' && flipped) markKnown()
    if (e.key === 'Backspace' && flipped) markRepeat()
  }, [current, flipped, mode, total])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  const cardStatus = known.has(realIdx) ? 'known' : repeat.has(realIdx) ? 'repeat' : 'none'
  const borderColor = cardStatus === 'known'
    ? 'rgba(16,185,129,0.45)'
    : cardStatus === 'repeat'
    ? 'rgba(249,115,22,0.45)'
    : 'rgba(27,143,196,0.20)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── Top bar: mode switcher + shuffle ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 6, padding: 4, background: '#f1f5f9', borderRadius: 14 }}>
          {(['cards', 'list'] as ViewMode[]).map(m => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '7px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
                background: mode === m ? '#fff' : 'transparent',
                boxShadow: mode === m ? '0 1px 6px rgba(27,59,107,0.10)' : 'none',
                color: mode === m ? '#1B3A6B' : '#94a3b8',
                fontWeight: 800, fontSize: 13,
                transition: 'all 0.2s',
              }}
            >
              {m === 'cards' ? '🃏 Карточки' : '📋 Список'}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          {mode === 'cards' && (
            <button
              onClick={toggleShuffle}
              style={{
                padding: '7px 16px', borderRadius: 12, border: `1.5px solid ${shuffle ? 'rgba(201,147,59,0.50)' : 'rgba(27,143,196,0.18)'}`,
                background: shuffle ? 'rgba(201,147,59,0.08)' : '#fff',
                color: shuffle ? '#C9933B' : '#64748b',
                fontWeight: 800, fontSize: 12, cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              🔀 {shuffle ? 'Shuffle ON' : 'Shuffle'}
            </button>
          )}
          <button
            onClick={restart}
            style={{
              padding: '7px 16px', borderRadius: 12,
              border: '1.5px solid rgba(27,143,196,0.18)',
              background: '#fff', color: '#64748b',
              fontWeight: 800, fontSize: 12, cursor: 'pointer',
            }}
          >
            ↺ Сброс
          </button>
        </div>
      </div>

      {/* ── Progress bar ── */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B' }}>Прогресс</span>
            {repeat.size > 0 && (
              <span style={{ fontSize: 11, fontWeight: 800, color: '#f97316', background: 'rgba(249,115,22,0.10)', padding: '2px 10px', borderRadius: 99 }}>
                {repeat.size} на повтор
              </span>
            )}
          </div>
          <span style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4' }}>
            {known.size} / {total} · {pct}%
          </span>
        </div>
        <div style={{ height: 8, borderRadius: 99, background: 'rgba(27,143,196,0.10)', overflow: 'hidden', position: 'relative' }}>
          <motion.div
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #1B8FC4, #10b981)' }}
          />
        </div>
      </div>

      {/* ── Completion banner ── */}
      <AnimatePresence>
        {allReviewed && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            style={{
              padding: '20px 24px', borderRadius: 20,
              background: known.size === total
                ? 'linear-gradient(135deg,rgba(16,185,129,0.10),rgba(16,185,129,0.04))'
                : 'linear-gradient(135deg,rgba(201,147,59,0.10),rgba(201,147,59,0.04))',
              border: `1.5px solid ${known.size === total ? 'rgba(16,185,129,0.30)' : 'rgba(201,147,59,0.30)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap',
            }}
          >
            <div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#1B3A6B', marginBottom: 6 }}>
                {known.size === total ? '🎉 Отлично! Все слова изучены' : '📋 Первый раунд завершён'}
              </div>
              <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
                Знаю: <b style={{ color: '#10b981' }}>{known.size}</b>
                {'  ·  '}
                Повторить: <b style={{ color: '#f97316' }}>{repeat.size}</b>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {repeat.size > 0 && (
                <button
                  onClick={() => {
                    const repeatArr = [...repeat]
                    setOrder(repeatArr)
                    setKnown(new Set())
                    setRepeat(new Set())
                    goTo(0)
                    setShuffle(false)
                    setMode('cards')
                  }}
                  style={{
                    padding: '10px 20px', borderRadius: 12, whiteSpace: 'nowrap',
                    background: '#fff', border: '2px solid rgba(249,115,22,0.40)',
                    color: '#f97316', fontWeight: 800, fontSize: 13, cursor: 'pointer',
                  }}
                >
                  ↺ Слова на повтор
                </button>
              )}
              <button
                onClick={restart}
                style={{
                  padding: '10px 20px', borderRadius: 12, whiteSpace: 'nowrap',
                  background: '#1B3A6B', color: '#fff',
                  fontWeight: 800, fontSize: 13, border: 'none', cursor: 'pointer',
                }}
              >
                Начать заново
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ─────────────────────────────── CARDS MODE ─────────────────────────────── */}
      {mode === 'cards' && (
        <>
          {/* Counter + keyboard hint */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 13, fontWeight: 900, color: '#94a3b8', letterSpacing: '0.05em' }}>
              {current + 1} / {total}
            </span>
            <span style={{ fontSize: 11, fontWeight: 600, color: '#cbd5e1' }}>
              ← → для навигации · Пробел — перевернуть
            </span>
          </div>

          {/* Flashcard */}
          <div style={{ width: '100%', maxWidth: 560, margin: '0 auto', perspective: '1400px' }}>
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                animate={{ rotateY: flipped ? 180 : 0 }}
                transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
                style={{
                  position: 'relative',
                  height: 280,
                  transformStyle: 'preserve-3d',
                  cursor: 'pointer',
                }}
                onClick={() => setFlipped(f => !f)}
              >
                {/* FRONT */}
                <div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 28,
                    backfaceVisibility: 'hidden',
                    background: '#ffffff',
                    border: `2px solid ${borderColor}`,
                    boxShadow: '0 8px 40px rgba(27,58,107,0.08), 0 2px 8px rgba(27,58,107,0.06)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 20,
                    padding: '32px 40px',
                    transition: 'border-color 0.3s',
                  }}
                >
                  {cardStatus !== 'none' && (
                    <div style={{
                      position: 'absolute', top: 16, right: 18,
                      fontSize: 11, fontWeight: 800, padding: '4px 12px', borderRadius: 99,
                      background: cardStatus === 'known' ? 'rgba(16,185,129,0.12)' : 'rgba(249,115,22,0.12)',
                      color: cardStatus === 'known' ? '#10b981' : '#f97316',
                    }}>
                      {cardStatus === 'known' ? '✓ Знаю' : '↺ Повторить'}
                    </div>
                  )}

                  <div style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    English
                  </div>

                  <div style={{
                    fontSize: 38, fontWeight: 900, color: '#1B3A6B',
                    textAlign: 'center', lineHeight: 1.2, letterSpacing: '-0.02em',
                  }}>
                    {item.en}
                  </div>

                  <div style={{
                    fontSize: 12, fontWeight: 700, color: '#94a3b8',
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '6px 16px', borderRadius: 99,
                    background: 'rgba(27,143,196,0.06)',
                    border: '1px solid rgba(27,143,196,0.12)',
                  }}>
                    <span>👆</span> нажмите чтобы увидеть перевод
                  </div>
                </div>

                {/* BACK */}
                <div
                  style={{
                    position: 'absolute', inset: 0, borderRadius: 28,
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: 'linear-gradient(145deg, #1B3A6B 0%, #2563EB 60%, #1B8FC4 100%)',
                    boxShadow: '0 12px 48px rgba(27,58,107,0.25)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center', gap: 14,
                    padding: '32px 40px',
                  }}
                >
                  <div style={{ fontSize: 11, fontWeight: 800, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {item.en}
                  </div>
                  <div style={{ width: 48, height: 2, borderRadius: 1, background: '#C9933B', opacity: 0.8 }} />
                  <div style={{
                    fontSize: 36, fontWeight: 900, color: '#ffffff',
                    textAlign: 'center', lineHeight: 1.25, letterSpacing: '-0.01em',
                  }}>
                    {item.ru}
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.40)' }}>
                    нажмите снова чтобы перевернуть
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Know / Repeat buttons */}
          <AnimatePresence>
            {flipped && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.22 }}
                style={{
                  display: 'flex', gap: 12,
                  width: '100%', maxWidth: 560, margin: '0 auto',
                }}
              >
                <button
                  onClick={e => { e.stopPropagation(); markRepeat() }}
                  style={{
                    flex: 1, padding: '15px 0', borderRadius: 18,
                    background: '#fff', border: '2px solid rgba(249,115,22,0.50)',
                    color: '#f97316', fontWeight: 900, fontSize: 15, cursor: 'pointer',
                    transition: 'box-shadow 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.boxShadow = '0 4px 16px rgba(249,115,22,0.20)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.boxShadow = 'none' }}
                >
                  ✗ Повторить
                </button>
                <button
                  onClick={e => { e.stopPropagation(); markKnown() }}
                  style={{
                    flex: 1, padding: '15px 0', borderRadius: 18,
                    background: 'linear-gradient(135deg, #10b981, #059669)',
                    border: 'none', color: '#fff',
                    fontWeight: 900, fontSize: 15, cursor: 'pointer',
                    boxShadow: '0 4px 20px rgba(16,185,129,0.30)',
                    transition: 'box-shadow 0.15s, transform 0.1s',
                  }}
                  onMouseEnter={e => { (e.target as HTMLElement).style.boxShadow = '0 6px 24px rgba(16,185,129,0.40)' }}
                  onMouseLeave={e => { (e.target as HTMLElement).style.boxShadow = '0 4px 20px rgba(16,185,129,0.30)' }}
                >
                  ✓ Знаю
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            width: '100%', maxWidth: 560, margin: '4px auto 0',
          }}>
            <button
              onClick={() => goTo(current - 1)}
              disabled={current === 0}
              style={{
                padding: '10px 24px', borderRadius: 14, background: '#fff',
                border: '1.5px solid rgba(27,143,196,0.20)',
                color: current === 0 ? '#cbd5e1' : '#1B3A6B',
                fontWeight: 800, fontSize: 14,
                cursor: current === 0 ? 'default' : 'pointer',
                opacity: current === 0 ? 0.45 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              ← Назад
            </button>

            {/* Dot indicators (max 10 visible) */}
            <div style={{ display: 'flex', gap: 4, alignItems: 'center', flex: 1, justifyContent: 'center', overflow: 'hidden' }}>
              {total <= 20 ? items.map((_, i) => {
                const ri = order[i]
                return (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    style={{
                      width: i === current ? 20 : 8,
                      height: 8, borderRadius: 99, border: 'none', cursor: 'pointer',
                      background: i === current
                        ? '#1B8FC4'
                        : known.has(ri) ? '#10b981'
                        : repeat.has(ri) ? '#f97316'
                        : 'rgba(27,143,196,0.18)',
                      padding: 0,
                      transition: 'width 0.25s, background 0.2s',
                      flexShrink: 0,
                    }}
                  />
                )
              }) : (
                <span style={{ fontSize: 13, fontWeight: 900, color: '#475569' }}>
                  {current + 1} / {total}
                </span>
              )}
            </div>

            <button
              onClick={() => goTo(current + 1)}
              disabled={current === total - 1}
              style={{
                padding: '10px 24px', borderRadius: 14, background: '#fff',
                border: '1.5px solid rgba(27,143,196,0.20)',
                color: current === total - 1 ? '#cbd5e1' : '#1B3A6B',
                fontWeight: 800, fontSize: 14,
                cursor: current === total - 1 ? 'default' : 'pointer',
                opacity: current === total - 1 ? 0.45 : 1,
                transition: 'opacity 0.15s',
              }}
            >
              Вперёд →
            </button>
          </div>
        </>
      )}

      {/* ─────────────────────────────── LIST MODE ─────────────────────────────── */}
      {mode === 'list' && (
        <div>
          <div style={{
            fontSize: 11, fontWeight: 800, color: '#94a3b8',
            letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 12,
          }}>
            Все слова — {total} шт.
          </div>

          {/* Header row */}
          <div style={{
            display: 'grid', gridTemplateColumns: '28px 1fr 1fr',
            gap: 10, padding: '8px 14px',
            marginBottom: 4,
          }}>
            <span />
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>English</span>
            <span style={{ fontSize: 11, fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Перевод</span>
          </div>

          <div style={{ display: 'grid', gap: 5 }}>
            {items.map((w, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.015, duration: 0.2 }}
                onClick={() => { setMode('cards'); goTo(i) }}
                style={{
                  display: 'grid', gridTemplateColumns: '28px 1fr 1fr',
                  gap: 10, padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
                  background: known.has(i)
                    ? 'rgba(16,185,129,0.06)'
                    : repeat.has(i)
                    ? 'rgba(249,115,22,0.05)'
                    : '#f8fafc',
                  border: `1px solid ${
                    known.has(i)
                      ? 'rgba(16,185,129,0.18)'
                      : repeat.has(i)
                      ? 'rgba(249,115,22,0.18)'
                      : 'rgba(14,165,233,0.08)'}`,
                  alignItems: 'center',
                  transition: 'background 0.12s, border-color 0.12s',
                }}
              >
                <span style={{ fontSize: 11, fontWeight: 800, color: '#cbd5e1' }}>{i + 1}</span>
                <span style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {w.en}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, minWidth: 0 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>
                    {w.ru}
                  </span>
                  {known.has(i) && <span style={{ fontSize: 13, color: '#10b981', flexShrink: 0 }}>✓</span>}
                  {repeat.has(i) && <span style={{ fontSize: 13, color: '#f97316', flexShrink: 0 }}>↺</span>}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}
