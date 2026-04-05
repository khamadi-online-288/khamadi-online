'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'

type Row = {
  user_id: string
  full_name: string | null
  student_code: string | null
  best_score: number | null
  attempts: number | null
}

type Mode = 'all' | 'week' | 'month'

export default function LeaderboardPage() {
  const [mode, setMode] = useState<Mode>('all')
  const [rows, setRows] = useState<Row[]>([])
  const [myId, setMyId] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    load()
  }, [mode])

  async function load() {
    try {
      setLoading(true)
      setError('')

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (user) setMyId(user.id)

      let table = 'leaderboard_view'
      if (mode === 'week') table = 'leaderboard_weekly'
      if (mode === 'month') table = 'leaderboard_monthly'

      const { data, error } = await supabase
        .from(table)
        .select('*')
        .order('best_score', { ascending: false })

      if (error) {
        setError(error.message)
        setRows([])
        return
      }

      setRows((data || []) as Row[])
    } catch (e) {
      setError('Leaderboard жүктелмеді')
      setRows([])
    } finally {
      setLoading(false)
    }
  }

  function medal(rank: number) {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return String(rank)
  }

  function initials(name: string | null) {
    if (!name) return '?'
    return name
      .split(' ')
      .map((x) => x[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.label}>LEADERBOARD</div>
          <h1 style={s.title}>Үздік оқушылар</h1>
          <p style={s.subtitle}>
            Симулятор нәтижелері бойынша рейтинг.
          </p>
        </div>

        <div style={s.tabs}>
          <button onClick={() => setMode('all')} style={{ ...s.tab, ...(mode === 'all' ? s.tabActive : {}) }}>
            All time
          </button>
          <button onClick={() => setMode('week')} style={{ ...s.tab, ...(mode === 'week' ? s.tabActive : {}) }}>
            Weekly
          </button>
          <button onClick={() => setMode('month')} style={{ ...s.tab, ...(mode === 'month' ? s.tabActive : {}) }}>
            Monthly
          </button>
        </div>

        {loading ? (
          <div style={s.empty}>Жүктелуде...</div>
        ) : error ? (
          <div style={s.empty}>Қате: {error}</div>
        ) : rows.length === 0 ? (
          <div style={s.empty}>Leaderboard бос</div>
        ) : (
          <div style={s.card}>
            {rows.map((r, i) => {
              const rank = i + 1
              const isMe = r.user_id === myId

              return (
                <div
                  key={r.user_id}
                  style={{
                    ...s.row,
                    background: isMe ? '#F0F9FF' : '#FFFFFF'
                  }}
                >
                  <div style={s.rank}>{medal(rank)}</div>

                  <div style={s.avatar}>{initials(r.full_name)}</div>

                  <div style={s.nameBlock}>
                    <div style={s.name}>
                      {r.full_name || 'Оқушы'}
                      {isMe ? <span style={s.me}>Сен</span> : null}
                    </div>
                    <div style={s.code}>{r.student_code || '-'}</div>
                  </div>

                  <div style={s.attempts}>{r.attempts || 0}</div>

                  <div style={s.score}>{r.best_score || 0}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: '#F8FAFC',
    padding: '24px 20px 40px'
  },
  wrap: {
    maxWidth: 980,
    margin: '0 auto'
  },
  topBlock: {
    marginBottom: 18
  },
  label: {
    fontSize: 13,
    fontWeight: 700,
    color: '#0EA5E9',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.08em'
  },
  title: {
    fontSize: 34,
    fontWeight: 800,
    lineHeight: 1.15,
    letterSpacing: '-0.03em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 1.7,
    color: '#64748B',
    margin: 0
  },
  tabs: {
    display: 'flex',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap'
  },
  tab: {
    padding: '10px 16px',
    borderRadius: 12,
    border: '1px solid #E2E8F0',
    background: '#fff',
    cursor: 'pointer',
    fontWeight: 700
  },
  tabActive: {
    background: '#0EA5E9',
    color: '#fff',
    border: '1px solid #0EA5E9'
  },
  card: {
    background: '#fff',
    borderRadius: 20,
    border: '1px solid #E2E8F0',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(15,23,42,0.04)'
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: 16,
    borderBottom: '1px solid #F1F5F9'
  },
  rank: {
    width: 60,
    fontWeight: 800,
    color: '#0F172A'
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: '50%',
    background: '#E0F2FE',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    marginRight: 12,
    color: '#0369A1'
  },
  nameBlock: {
    flex: 1
  },
  name: {
    fontWeight: 700,
    color: '#0F172A'
  },
  code: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2
  },
  attempts: {
    width: 100,
    textAlign: 'center',
    color: '#475569',
    fontWeight: 600
  },
  score: {
    width: 80,
    fontWeight: 800,
    color: '#0EA5E9',
    textAlign: 'right'
  },
  me: {
    marginLeft: 8,
    fontSize: 11,
    background: '#0EA5E9',
    color: '#fff',
    padding: '2px 6px',
    borderRadius: 6
  },
  empty: {
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 24,
    color: '#64748B'
  }
}