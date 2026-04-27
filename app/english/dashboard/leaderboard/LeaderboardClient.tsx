'use client'
import { useState } from 'react'
import { motion } from 'framer-motion'

interface XPRow { user_id: string; total_xp?: number; weekly_xp?: number; monthly_xp?: number; streak_days?: number; profiles?: { full_name?: string; avatar_url?: string; language_level?: string } }

interface Props {
  allTime: Record<string, unknown>[]
  weekly: Record<string, unknown>[]
  monthly: Record<string, unknown>[]
  currentUserId: string
}

const MEDALS = ['🥇', '🥈', '🥉']
const PERIOD_LABELS = ['За неделю', 'За месяц', 'Всё время']
const XP_KEY: Record<number, keyof XPRow> = { 0: 'weekly_xp', 1: 'monthly_xp', 2: 'total_xp' }

function Avatar({ name, url, size }: { name?: string; url?: string; size: number }) {
  const initial = name?.trim()?.[0]?.toUpperCase() ?? '?'
  return url ? (
    <img src={url} alt="" style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }} />
  ) : (
    <div style={{ width: size, height: size, borderRadius: '50%', background: 'linear-gradient(135deg,#1B3A6B,#1B8FC4)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: size * 0.38, flexShrink: 0 }}>
      {initial}
    </div>
  )
}

export default function LeaderboardClient({ allTime, weekly, monthly, currentUserId }: Props) {
  const [period, setPeriod] = useState(0)
  const datasets = [weekly, monthly, allTime]
  const data = (datasets[period] as unknown as XPRow[])
  const xpKey = XP_KEY[period]
  const top3 = data.slice(0, 3)
  const rest = data.slice(3)
  const myRank = data.findIndex(r => r.user_id === currentUserId)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '0 4px' }}>
      <h1 style={{ fontSize: 26, fontWeight: 900, color: '#1B3A6B', marginBottom: 6 }}>Лидерборд</h1>
      <p style={{ fontSize: 13, color: '#64748b', marginBottom: 24 }}>Рейтинг студентов по набранным очкам опыта (XP)</p>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
        {PERIOD_LABELS.map((l, i) => (
          <button key={l} onClick={() => setPeriod(i)} style={{ padding: '8px 18px', borderRadius: 9, fontWeight: period === i ? 800 : 600, fontSize: 13, border: 'none', background: period === i ? '#fff' : 'transparent', color: period === i ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: period === i ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>{l}</button>
        ))}
      </div>

      {data.length === 0 && (
        <div style={{ textAlign: 'center', padding: 60, color: '#94a3b8', fontSize: 15, fontWeight: 700 }}>
          Нет данных. Начните учиться, чтобы попасть в рейтинг!
        </div>
      )}

      {/* Podium top-3 */}
      {top3.length > 0 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: 12, marginBottom: 32 }}>
          {[top3[1], top3[0], top3[2]].map((row, podiumIdx) => {
            if (!row) return <div key={podiumIdx} style={{ width: 140 }} />
            const rank = podiumIdx === 1 ? 0 : podiumIdx === 0 ? 1 : 2
            const heights = [160, 190, 140]
            const isCurrent = row.user_id === currentUserId
            return (
              <motion.div key={row.user_id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: rank * 0.1 }}
                style={{ width: 140, textAlign: 'center', background: isCurrent ? 'rgba(201,147,59,0.06)' : '#fff', borderRadius: 20, border: isCurrent ? '2px solid #C9933B' : '1px solid rgba(27,143,196,0.1)', padding: '20px 12px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, minHeight: heights[rank], justifyContent: 'flex-end' }}>
                <div style={{ fontSize: 28 }}>{MEDALS[rank]}</div>
                <Avatar name={row.profiles?.full_name} url={row.profiles?.avatar_url} size={56} />
                <div style={{ fontSize: 12, fontWeight: 800, color: '#1B3A6B', lineHeight: 1.2 }}>{row.profiles?.full_name ?? 'Студент'}</div>
                {row.profiles?.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '1px 7px', fontSize: 10, fontWeight: 700 }}>{row.profiles.language_level}</span>}
                <div style={{ fontSize: 16, fontWeight: 900, color: rank === 0 ? '#C9933B' : '#1B3A6B' }}>{(row[xpKey] as number ?? 0).toLocaleString()} XP</div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Rest of table */}
      {rest.length > 0 && (
        <div style={{ background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
          {rest.map((row, i) => {
            const rank = i + 4
            const isCurrent = row.user_id === currentUserId
            return (
              <motion.div key={row.user_id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.03 }}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', borderBottom: '1px solid #f1f5f9', background: isCurrent ? 'rgba(201,147,59,0.06)' : 'transparent', border: isCurrent ? '2px solid #C9933B' : undefined }}>
                <div style={{ width: 28, fontSize: 13, fontWeight: 800, color: '#94a3b8', textAlign: 'center' as const, flexShrink: 0 }}>#{rank}</div>
                <Avatar name={row.profiles?.full_name} url={row.profiles?.avatar_url} size={36} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{row.profiles?.full_name ?? 'Студент'}</div>
                  {row.profiles?.language_level && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 5, padding: '1px 6px', fontSize: 10, fontWeight: 700 }}>{row.profiles.language_level}</span>}
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: '#1B3A6B', flexShrink: 0 }}>{(row[xpKey] as number ?? 0).toLocaleString()} XP</div>
              </motion.div>
            )
          })}
        </div>
      )}

      {/* Current user outside top 50 */}
      {myRank === -1 && data.length >= 50 && (
        <div style={{ marginTop: 16, padding: '14px 20px', borderRadius: 14, background: 'rgba(201,147,59,0.06)', border: '2px solid #C9933B', display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ fontSize: 13, color: '#92400e', fontWeight: 700 }}>Вы не в топ-50. Продолжайте учиться, чтобы попасть в рейтинг!</div>
        </div>
      )}
    </div>
  )
}
