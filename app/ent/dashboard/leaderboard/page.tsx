'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Row = {
  user_id: string
  full_name: string | null
  student_code: string | null
  best_score: number
  attempts: number
}

type Session = {
  user_id: string
  score: number | null
  completed_at: string | null
}

type Profile = {
  id: string
  full_name: string | null
  student_code: string | null
}

type Mode = 'all' | 'week' | 'month'

const MAX_SCORE = 140

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function LeaderboardPage() {
  const [mode, setMode] = useState<Mode>('all')
  const [rows, setRows] = useState<Row[]>([])
  const [myId, setMyId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => { load() }, [mode])

  async function load() {
    setLoading(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      setMyId(user?.id || '')

      let since: string | null = null
      if (mode === 'week') since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
      else if (mode === 'month') since = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()

      let sessionQuery = supabase.from('simulator_results').select('user_id, total_score, created_at')
      if (since) sessionQuery = sessionQuery.gte('created_at', since)

      const [sessionsRes, profilesRes] = await Promise.all([
        sessionQuery,
        supabase.from('profiles').select('id, full_name, student_code'),
      ])

      if (sessionsRes.error) throw new Error(sessionsRes.error.message)

      const sessions = ((sessionsRes.data || []) as unknown as Array<{ user_id: string; total_score: number | null; created_at: string | null }>).map(r => ({
        user_id: r.user_id,
        score: r.total_score,
        completed_at: r.created_at,
      })) as Session[]
      const profiles = (profilesRes.data || []) as Profile[]
      const profileMap = new Map(profiles.map((p) => [p.id, p]))

      const userMap = new Map<string, { bestScore: number; attempts: number }>()
      for (const s of sessions) {
        const score = s.score ?? 0
        const existing = userMap.get(s.user_id)
        if (!existing) {
          userMap.set(s.user_id, { bestScore: score, attempts: 1 })
        } else {
          existing.attempts++
          if (score > existing.bestScore) existing.bestScore = score
        }
      }

      const aggregated: Row[] = Array.from(userMap.entries())
        .map(([userId, stats]) => {
          const p = profileMap.get(userId)
          return { user_id: userId, full_name: p?.full_name ?? null, student_code: p?.student_code ?? null, best_score: stats.bestScore, attempts: stats.attempts }
        })
        .sort((a, b) => b.best_score - a.best_score)

      setRows(aggregated)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Жүктелмеді')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  const myRank = useMemo(() => rows.findIndex((r) => r.user_id === myId) + 1, [rows, myId])
  const top3 = rows.slice(0, 3)
  const rest = rows.slice(3)

  function initials(name: string | null) {
    if (!name) return '?'
    return name.split(' ').map((x) => x[0]).join('').slice(0, 2).toUpperCase()
  }

  function scoreColor(score: number) {
    const pct = (score / MAX_SCORE) * 100
    if (pct >= 80) return '#16a34a'
    if (pct >= 60) return '#0ea5e9'
    if (pct >= 40) return '#f59e0b'
    return '#ef4444'
  }

  const podiumOrder = [top3[1], top3[0], top3[2]].filter(Boolean) as Row[]
  const podiumConfig: Record<number, { height: number; bg: string; border: string; badge: string }> = {
    0: { height: 90, bg: '#f0f9ff', border: '#bae6fd', badge: '🥈' },
    1: { height: 118, bg: '#fef9c3', border: '#fde047', badge: '🥇' },
    2: { height: 72, bg: '#fff7ed', border: '#fcd34d', badge: '🥉' },
  }

  function actualRank(row: Row) { return rows.findIndex((r) => r.user_id === row.user_id) + 1 }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Leaderboard
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Үздік оқушылар
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          ҰБТ симулятор нәтижелері бойынша рейтинг · Максимум {MAX_SCORE} балл
        </p>
      </motion.div>

      {/* Mode tabs */}
      <motion.div {...fadeUp(0.06)} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        {(['all', 'week', 'month'] as Mode[]).map((m) => (
          <motion.button
            key={m}
            onClick={() => setMode(m)}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '10px 18px', borderRadius: 12, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: 13,
              background: mode === m ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'rgba(255,255,255,0.9)',
              color: mode === m ? '#fff' : '#334155',
              boxShadow: mode === m ? '0 8px 18px rgba(14,165,233,0.26)' : '0 2px 8px rgba(14,165,233,0.07)',
              transition: 'all 0.16s ease',
            }}
          >
            {m === 'all' ? 'Барлық уақыт' : m === 'week' ? 'Осы апта' : 'Осы ай'}
          </motion.button>
        ))}
        {myRank > 0 && (
          <div style={{ marginLeft: 'auto', padding: '10px 16px', borderRadius: 12, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.2)', fontSize: 13, fontWeight: 700, color: '#0369a1' }}>
            Менің орным: <strong>#{myRank}</strong>
          </div>
        )}
      </motion.div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
          <div className="spinner" />
        </div>
      ) : error ? (
        <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 16, padding: '18px 22px', color: '#dc2626', fontSize: 14, fontWeight: 700 }}>
          ⚠️ {error}
        </div>
      ) : rows.length === 0 ? (
        <motion.div
          {...fadeUp(0.1)}
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 28, padding: '52px 32px', textAlign: 'center', boxShadow: '0 20px 44px rgba(14,165,233,0.08)' }}
        >
          <div style={{ fontSize: 56, marginBottom: 16 }}>🏆</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', margin: '0 0 10px', letterSpacing: '-0.03em' }}>
            {mode === 'week' ? 'Осы аптада нәтиже жоқ' : mode === 'month' ? 'Осы айда нәтиже жоқ' : 'Рейтинг бос'}
          </h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.75, margin: '0 auto 24px', maxWidth: 380 }}>Симулятор тапсырған оқушылар осында көрінеді.</p>
          <motion.a
            href="/ent/dashboard/simulator"
            whileHover={{ scale: 1.04, boxShadow: '0 16px 32px rgba(14,165,233,0.32)' }}
            whileTap={{ scale: 0.97 }}
            style={{ display: 'inline-flex', alignItems: 'center', padding: '13px 28px', borderRadius: 14, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', fontWeight: 800, textDecoration: 'none', fontSize: 14, boxShadow: '0 10px 24px rgba(14,165,233,0.26)' }}
          >
            Симуляторға өту
          </motion.a>
        </motion.div>
      ) : (
        <>
          {/* Podium top-3 */}
          {top3.length >= 1 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.08 }}
              style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 14, marginBottom: 26 }}
            >
              {podiumOrder.map((row, idx) => {
                const cfg = podiumConfig[idx]
                const rank = actualRank(row)
                const isMe = row.user_id === myId
                const pct = Math.round((row.best_score / MAX_SCORE) * 100)
                return (
                  <motion.div
                    key={row.user_id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                    style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 0', maxWidth: 260 }}
                  >
                    <div style={{
                      width: '100%', borderRadius: 22, padding: '18px 14px 14px', textAlign: 'center',
                      background: isMe ? '#f0f9ff' : '#fff',
                      border: isMe ? '2px solid #0ea5e9' : `1px solid ${cfg.border}`,
                      boxShadow: '0 10px 28px rgba(14,165,233,0.1)',
                      transform: idx === 1 ? 'scale(1.04)' : 'scale(1)',
                      marginBottom: 0,
                    }}>
                      <div style={{ fontSize: 30, marginBottom: 8 }}>{cfg.badge}</div>
                      <div style={{ width: idx === 1 ? 52 : 44, height: idx === 1 ? 52 : 44, borderRadius: '50%', margin: '0 auto 10px', background: cfg.bg, border: `2px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: idx === 1 ? 18 : 14, color: '#0c4a6e' }}>
                        {initials(row.full_name)}
                      </div>
                      <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e', marginBottom: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {row.full_name || 'Оқушы'}
                        {isMe && <span style={{ padding: '2px 6px', borderRadius: 6, background: '#0ea5e9', color: '#fff', fontSize: 10, fontWeight: 800 }}>Сен</span>}
                      </div>
                      {row.student_code && <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>{row.student_code}</div>}
                      <div style={{ fontSize: 28, fontWeight: 900, color: scoreColor(row.best_score), lineHeight: 1 }}>{row.best_score}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginBottom: 8 }}>/ {MAX_SCORE} · {pct}%</div>
                      <div style={{ width: '100%', height: 5, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden', marginBottom: 6 }}>
                        <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: scoreColor(row.best_score) }} />
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{row.attempts} тапсырым</div>
                    </div>
                    <div style={{ width: '100%', height: cfg.height, borderRadius: '0 0 14px 14px', background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <span style={{ fontSize: 16, fontWeight: 900, color: '#475569' }}>#{rank}</span>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}

          {/* Table rank 4+ */}
          {rest.length > 0 && (
            <motion.div
              {...fadeUp(0.2)}
              style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 22, overflow: 'hidden', boxShadow: '0 14px 32px rgba(14,165,233,0.08)' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', padding: '12px 20px', background: '#f0f9ff', borderBottom: '1px solid rgba(14,165,233,0.1)' }}>
                <div style={{ width: 56, flexShrink: 0, fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Орын</div>
                <div style={{ flex: 1, fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Оқушы</div>
                <div style={{ width: 100, flexShrink: 0, textAlign: 'center', fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Тапсырым</div>
                <div style={{ width: 150, flexShrink: 0, textAlign: 'right', fontSize: 11, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Үздік балл</div>
              </div>

              <AnimatePresence>
                {rest.map((r, i) => {
                  const rank = i + 4
                  const isMe = r.user_id === myId
                  const pct = Math.round((r.best_score / MAX_SCORE) * 100)
                  return (
                    <motion.div
                      key={r.user_id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.35, delay: i * 0.04 }}
                      style={{
                        display: 'flex', alignItems: 'center', padding: '13px 20px',
                        borderBottom: '1px solid rgba(14,165,233,0.06)',
                        background: isMe ? '#f0f9ff' : i % 2 === 0 ? '#fff' : '#fafcff',
                        borderLeft: isMe ? '3px solid #0ea5e9' : '3px solid transparent',
                      }}
                    >
                      <div style={{ width: 56, flexShrink: 0 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: 10, background: '#f0f9ff', fontSize: 13, fontWeight: 900, color: '#64748b' }}>{rank}</span>
                      </div>
                      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: 13, flexShrink: 0, background: isMe ? '#e0f2fe' : '#f1f5f9', color: isMe ? '#0369a1' : '#475569' }}>
                          {initials(r.full_name)}
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', display: 'flex', alignItems: 'center', gap: 6 }}>
                            {r.full_name || 'Оқушы'}
                            {isMe && <span style={{ padding: '2px 6px', borderRadius: 6, background: '#0ea5e9', color: '#fff', fontSize: 10, fontWeight: 800 }}>Сен</span>}
                          </div>
                          {r.student_code && <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 1 }}>{r.student_code}</div>}
                        </div>
                      </div>
                      <div style={{ width: 100, flexShrink: 0, textAlign: 'center', fontSize: 13, fontWeight: 700, color: '#475569' }}>{r.attempts}</div>
                      <div style={{ width: 150, flexShrink: 0, textAlign: 'right' }}>
                        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'flex-end', gap: 2, marginBottom: 4 }}>
                          <span style={{ fontSize: 17, fontWeight: 900, color: scoreColor(r.best_score) }}>{r.best_score}</span>
                          <span style={{ fontSize: 11, color: '#94a3b8' }}>/ {MAX_SCORE}</span>
                        </div>
                        <div style={{ width: '100%', height: 4, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden' }}>
                          <div style={{ height: '100%', borderRadius: 999, width: `${pct}%`, background: scoreColor(r.best_score) }} />
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}
    </div>
  )
}
