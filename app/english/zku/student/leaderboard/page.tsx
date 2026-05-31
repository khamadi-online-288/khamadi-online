'use client'

import { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'

const N   = '#003876'
const G   = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface LeaderRow {
  user_id: string
  full_name: string
  total_xp: number
  current_streak: number
  current_level: string
  last_active_at: string | null
  isMe: boolean
}

const MEDAL_COLOR = ['#C9933B', '#94A3B8', '#CD7F32']

export default function LeaderboardPage() {
  const { t } = useZkuLang()
  const [rows,    setRows]    = useState<LeaderRow[]>([])
  const [allRows, setAllRows] = useState<LeaderRow[]>([])
  const [loading, setLoading] = useState(true)
  const [period,  setPeriod]  = useState<'week' | 'month' | 'all'>('all')

  type ProfileRow = { user_id: string; full_name: string | null; total_xp: number | null; current_streak: number | null; current_level: string | null; last_active_at: string | null }

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoading(false); return }

      // Use service-role API to bypass RLS
      const res = await fetch('/api/english/leaderboard', {
        headers: { Authorization: `Bearer ${session.access_token}` }
      })
      const { rows } = await res.json()

      if (rows) {
        const mapped: LeaderRow[] = (rows as ProfileRow[]).map(r => ({
          user_id:        r.user_id,
          full_name:      r.full_name ?? r.user_id.slice(0, 8),
          total_xp:       r.total_xp ?? 0,
          current_streak: r.current_streak ?? 0,
          current_level:  r.current_level ?? 'A1',
          last_active_at: r.last_active_at,
          isMe:           r.user_id === user.id,
        }))
        setAllRows(mapped)
        setRows(mapped)
      }
      setLoading(false)
    }
    load()
  }, [])

  function applyPeriod(p: 'week' | 'month' | 'all') {
    setPeriod(p)
    if (p === 'all') { setRows(allRows); return }
    const cutoff = new Date()
    if (p === 'week')  cutoff.setDate(cutoff.getDate() - 7)
    if (p === 'month') cutoff.setMonth(cutoff.getMonth() - 1)
    const filtered = allRows.filter(r => {
      const raw = (r as LeaderRow & { last_active_at?: string }).last_active_at
      if (!raw) return false
      return new Date(raw) >= cutoff
    })
    setRows(filtered.length > 0 ? filtered : allRows)
  }

  const myRank = rows.findIndex(r => r.isMe) + 1

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
    <div style={{ padding: '28px 32px 56px', maxWidth: 900, margin: '0 auto' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 5 }}>{t.leaderboard.title}</h1>
        <p style={{ fontSize: 13, color: MUT }}>{t.leaderboard.subtitle}</p>
      </div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 3, background: '#fff', borderRadius: 10, padding: 3, marginBottom: 16, width: 'fit-content', border: `1px solid ${BDR}` }}>
        {(['all', 'month', 'week'] as const).map(p => (
          <button key={p} onClick={() => applyPeriod(p)} style={{
            padding: '7px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
            background: period === p ? N : 'transparent',
            color: period === p ? '#fff' : MUT,
            fontSize: 12, fontWeight: 700, fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            {p === 'all' ? t.leaderboard.all_time : p === 'month' ? t.leaderboard.month : t.leaderboard.week}
          </button>
        ))}
      </div>

      {/* My rank banner */}
      {myRank > 0 && (
        <div style={{
          background: N, borderRadius: 14, padding: '16px 24px', marginBottom: 14,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: '#fff',
          boxShadow: '0 4px 16px rgba(0,56,118,0.18)',
        }}>
          <div>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{t.leaderboard.your_rank}</div>
            <div style={{ fontSize: 26, fontWeight: 900, color: G, lineHeight: 1 }}>#{myRank}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.4)', marginBottom: 4 }}>{t.leaderboard.xp}</div>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{rows.find(r => r.isMe)?.total_xp.toLocaleString() ?? 0}</div>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 48, color: MUT, fontWeight: 600 }}>{t.common.loading}</div>
      ) : rows.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>{t.leaderboard.empty_title}</div>
          <div style={{ fontSize: 13, color: MUT }}>{t.leaderboard.empty_sub}</div>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden', border: `1px solid ${BDR}` }}>
          <div style={{
            display: 'grid', gridTemplateColumns: '52px 1fr 90px 80px 70px',
            padding: '11px 20px', background: '#F8FAFC',
            fontSize: 10, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.07em',
            borderBottom: `1px solid ${BDR}`,
          }}>
            <span>{t.leaderboard.rank}</span>
            <span>{t.leaderboard.student}</span>
            <span style={{ textAlign: 'center' }}>{t.leaderboard.level}</span>
            <span style={{ textAlign: 'center' }}>{t.leaderboard.streak}</span>
            <span style={{ textAlign: 'right' }}>{t.leaderboard.xp}</span>
          </div>

          {rows.map((row, i) => (
            <div key={row.user_id} style={{
              display: 'grid', gridTemplateColumns: '52px 1fr 90px 80px 70px',
              padding: '13px 20px', alignItems: 'center',
              borderBottom: i < rows.length - 1 ? `1px solid ${BDR}` : 'none',
              background: row.isMe ? 'rgba(0,56,118,0.03)' : 'transparent',
            }}>
              <div style={{
                fontSize: 13, fontWeight: 900,
                color: i < 3 ? MEDAL_COLOR[i] : '#94A3B8',
                width: 28, height: 28, borderRadius: 8,
                background: i < 3 ? `${MEDAL_COLOR[i]}18` : 'transparent',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                {`#${i + 1}`}
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                  background: row.isMe ? N : '#EEF2F7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: row.isMe ? '#fff' : N, fontWeight: 800, fontSize: 13,
                }}>
                  {(row.full_name || '?').charAt(0).toUpperCase()}
                </div>
                <div style={{ fontSize: 13, fontWeight: 700, color: N }}>
                  {row.full_name}
                  {row.isMe && <span style={{ marginLeft: 6, fontSize: 10, color: G, background: '#FEF6E8', padding: '2px 7px', borderRadius: 99, fontWeight: 700 }}>{t.leaderboard.you}</span>}
                </div>
              </div>

              <div style={{ textAlign: 'center' }}>
                <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: '#EEF2F7', color: N }}>
                  {row.current_level}
                </span>
              </div>

              <div style={{ textAlign: 'center', fontSize: 12, fontWeight: 700, color: MUT }}>
                {row.current_streak} {t.common.days}
              </div>

              {/* XP */}
              <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 900, color: G }}>
                {row.total_xp.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </div>
  )
}