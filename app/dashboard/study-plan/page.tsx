'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

type PlanItem = {
  id: number
  day_label: string
  subject: string
  topic: string
  task_type: string
  duration_minutes: number
  status: string
  subject_id?: number | null
  section_id?: number | null
  topic_id?: number | null
  topic_name?: string | null
  pdf_url?: string | null
  quiz_count?: number | null
}

type Profile = {
  id: string
  name?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
}

type SimResult = {
  score?: number
  created_at?: string
}

const TASK_TYPE_COLORS: Record<string, { bg: string; border: string; color: string }> = {
  'Теория':    { bg: '#eff6ff', border: '#bfdbfe', color: '#1d4ed8' },
  'Жаттығу':  { bg: '#f0fdf4', border: '#bbf7d0', color: '#166534' },
  'Тест':     { bg: '#fff7ed', border: '#fed7aa', color: '#9a3412' },
  'Қайталау': { bg: '#faf5ff', border: '#ddd6fe', color: '#6d28d9' },
}

function taskTypeStyle(type: string) {
  return TASK_TYPE_COLORS[type] || { bg: '#f8fafc', border: '#e2e8f0', color: '#64748b' }
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

export default function StudyPlanPage() {
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [plans, setPlans] = useState<PlanItem[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [simResults, setSimResults] = useState<SimResult[]>([])
  const [error, setError] = useState('')

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    setLoading(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { setLoading(false); return }

      const [profileRes, plansRes, simRes] = await Promise.all([
        supabase.from('profiles').select('id, name, profile_subject_1, profile_subject_2').eq('id', user.id).single(),
        supabase.from('study_plans').select('*').eq('user_id', user.id).order('id', { ascending: true }),
        supabase.from('simulator_sessions').select('score, completed_at').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(3),
      ])

      setProfile(profileRes.data as Profile | null)
      setPlans((plansRes.data || []) as PlanItem[])
      setSimResults((simRes.data || []) as SimResult[])
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  async function generatePlan() {
    setGenerating(true)
    setError('')
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const res = await fetch('/api/generate-study-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: profile?.name || '',
          profileSubject1: profile?.profile_subject_1 || 'Математика',
          profileSubject2: profile?.profile_subject_2 || 'Физика',
          simulatorResults: simResults,
        }),
      })

      const data = await res.json()
      if (data.error) { setError(data.error); return }

      await supabase.from('study_plans').delete().eq('user_id', user.id)

      const toInsert = (data.items as Omit<PlanItem, 'id'>[]).map((item) => ({ ...item, user_id: user.id }))
      const { data: inserted, error: insertErr } = await supabase.from('study_plans').insert(toInsert).select()
      if (insertErr) { setError(insertErr.message); return }
      setPlans((inserted || []) as PlanItem[])
    } catch (e) {
      console.error(e)
      setError('Жоспар жасау кезінде қате шықты.')
    } finally {
      setGenerating(false)
    }
  }

  async function toggleStatus(id: number, current: string) {
    const next = current === 'done' ? 'todo' : 'done'
    const { error } = await supabase.from('study_plans').update({ status: next }).eq('id', id)
    if (error) { console.error(error); return }
    setPlans((prev) => prev.map((item) => (item.id === id ? { ...item, status: next } : item)))

    if (next === 'done') {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        await fetch('/api/update-gamification', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, action: 'study_plan_done' }),
        })
      }
    }
  }

  const days = useMemo(() => {
    const map = new Map<string, PlanItem[]>()
    for (const item of plans) {
      const arr = map.get(item.day_label) || []
      arr.push(item)
      map.set(item.day_label, arr)
    }
    return Array.from(map.entries())
  }, [plans])

  const doneCount = useMemo(() => plans.filter((p) => p.status === 'done').length, [plans])
  const totalCount = plans.length
  const donePercent = totalCount ? Math.round((doneCount / totalCount) * 100) : 0

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Жоспар жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
            Study Plan
          </div>
          <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
            Жеке оқу жоспары
          </h1>
          <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
            AI сенің пәндеріңе, нәтижелеріңе қарай 14 күндік жоспар жасайды.
          </p>
        </div>

        {plans.length > 0 && (
          <motion.button
            onClick={generatePlan}
            disabled={generating}
            whileHover={!generating ? { scale: 1.03 } : {}}
            whileTap={!generating ? { scale: 0.97 } : {}}
            style={{
              padding: '12px 20px', borderRadius: 14, border: '1px solid rgba(14,165,233,0.2)',
              background: '#fff', color: '#0369a1', fontWeight: 700, fontSize: 14,
              cursor: generating ? 'not-allowed' : 'pointer',
              opacity: generating ? 0.65 : 1,
              boxShadow: '0 6px 16px rgba(14,165,233,0.08)',
            }}
          >
            {generating ? '⏳ Жасалуда...' : '↺ Қайта жасау'}
          </motion.button>
        )}
      </motion.div>

      {/* Progress card */}
      <AnimatePresence>
        {plans.length > 0 && (
          <motion.div
            {...fadeUp(0.06)}
            style={{ background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 24, padding: '20px 24px', boxShadow: '0 12px 28px rgba(14,165,233,0.07)', marginBottom: 24 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#0c4a6e' }}>Жалпы прогресс</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 700 }}>
                <span style={{ color: '#16a34a' }}>{doneCount} орындалды</span>
                <span style={{ color: '#cbd5e1' }}>·</span>
                <span style={{ color: '#64748b' }}>{totalCount - doneCount} қалды</span>
                <span style={{ color: '#cbd5e1' }}>·</span>
                <span style={{ color: '#0ea5e9', fontWeight: 900 }}>{donePercent}%</span>
              </div>
            </div>

            <div style={{ width: '100%', height: 10, borderRadius: 999, background: '#e2e8f0', overflow: 'hidden', marginBottom: 14 }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${donePercent}%` }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {days.map(([dayLabel, items]) => {
                const dayDone = items.every((i) => i.status === 'done')
                return (
                  <div key={dayLabel} title={dayLabel} style={{ width: 14, height: 14, borderRadius: 4, background: dayDone ? '#0ea5e9' : '#e2e8f0', transition: 'background 0.3s' }} />
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 14, padding: '14px 18px', color: '#dc2626', fontSize: 14, fontWeight: 700, marginBottom: 20 }}
          >
            {error}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Generating state */}
      <AnimatePresence>
        {generating && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
            style={{ background: 'rgba(255,255,255,0.95)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: 28, padding: '52px 32px', textAlign: 'center', boxShadow: '0 20px 44px rgba(14,165,233,0.1)', marginBottom: 24 }}
          >
            <div className="spinner" style={{ margin: '0 auto 20px', width: 52, height: 52, borderWidth: 4 }} />
            <div style={{ fontSize: 22, fontWeight: 900, color: '#0c4a6e', marginBottom: 10 }}>AI жоспар жасауда...</div>
            <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.7, maxWidth: 480, margin: '0 auto' }}>
              {profile?.profile_subject_1 && profile?.profile_subject_2
                ? `${profile.profile_subject_1} · ${profile.profile_subject_2} · және міндетті пәндер бойынша 14 күндік жоспар дайындалуда`
                : '14 күндік оқу жоспары дайындалуда'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty state */}
      {!generating && plans.length === 0 && (
        <motion.div
          {...fadeUp(0.1)}
          style={{ background: 'rgba(255,255,255,0.92)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 30, padding: '56px 32px', textAlign: 'center', boxShadow: '0 20px 44px rgba(14,165,233,0.08)' }}
        >
          <div style={{ fontSize: 60, marginBottom: 18 }}>📅</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', margin: '0 0 12px', letterSpacing: '-0.03em' }}>Оқу жоспары жоқ</h2>
          <p style={{ color: '#64748b', fontSize: 15, lineHeight: 1.8, margin: '0 auto 28px', maxWidth: 460 }}>
            AI сенің пәндеріңе және нәтижелеріңе қарай жеке 14 күндік жоспар жасайды.
            {profile?.profile_subject_1
              ? ` Бейінді пәндер: ${profile.profile_subject_1}, ${profile.profile_subject_2 || '—'}.`
              : ' Алдымен профильде бейінді пәндерді белгіле.'}
          </p>
          <motion.button
            onClick={generatePlan}
            disabled={generating}
            whileHover={!generating ? { scale: 1.04, boxShadow: '0 20px 40px rgba(14,165,233,0.34)' } : {}}
            whileTap={!generating ? { scale: 0.97 } : {}}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '16px 32px', borderRadius: 16, border: 'none',
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#fff', fontWeight: 800, fontSize: 16,
              cursor: generating ? 'not-allowed' : 'pointer',
              boxShadow: '0 14px 30px rgba(14,165,233,0.28)',
              opacity: generating ? 0.65 : 1,
            }}
          >
            ✨ AI жоспар жасау
          </motion.button>
        </motion.div>
      )}

      {/* Day-by-day plan */}
      {!generating && days.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {days.map(([dayLabel, items], di) => {
            const allDone = items.every((i) => i.status === 'done')
            const totalMin = items.reduce((sum, i) => sum + i.duration_minutes, 0)
            return (
              <motion.div
                key={dayLabel}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: di * 0.04, ease: [0.22, 1, 0.36, 1] }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    padding: '8px 18px', borderRadius: 999, fontSize: 13, fontWeight: 800,
                    background: allDone ? '#f0fdf4' : '#eff6ff',
                    border: allDone ? '1px solid #bbf7d0' : '1px solid #bfdbfe',
                    color: allDone ? '#166534' : '#0369a1',
                  }}>
                    {allDone ? '✓ ' : ''}{dayLabel}
                  </div>
                  <div style={{ fontSize: 13, color: '#94a3b8', fontWeight: 600 }}>
                    {items.length} тапсырма · {totalMin} мин
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))', gap: 14 }}>
                  {items.map((item) => {
                    const ts = taskTypeStyle(item.task_type)
                    const done = item.status === 'done'
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ y: -2, boxShadow: '0 16px 32px rgba(14,165,233,0.12)' }}
                        style={{
                          background: '#fff', border: '1px solid rgba(14,165,233,0.1)',
                          borderLeft: `4px solid ${ts.border}`,
                          borderRadius: 18, padding: '16px 18px',
                          boxShadow: '0 6px 16px rgba(14,165,233,0.05)',
                          display: 'flex', flexDirection: 'column', gap: 10,
                          opacity: done ? 0.7 : 1, transition: 'opacity 0.2s',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
                          <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9' }}>{item.subject}</div>
                          <div style={{ padding: '5px 10px', borderRadius: 999, fontSize: 11, fontWeight: 800, background: ts.bg, border: `1px solid ${ts.border}`, color: ts.color, flexShrink: 0 }}>
                            {item.task_type}
                          </div>
                        </div>

                        <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.55, textDecoration: done ? 'line-through' : 'none', color: done ? '#94a3b8' : '#0c4a6e' }}>
                          {item.topic_name || item.topic}
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginTop: 4 }}>
                          <div style={{ fontSize: 12, color: '#94a3b8', fontWeight: 600 }}>⏱ {item.duration_minutes} мин</div>
                          <motion.button
                            onClick={() => toggleStatus(item.id, item.status)}
                            whileTap={{ scale: 0.95 }}
                            style={done ? {
                              padding: '7px 14px', borderRadius: 10, border: '1px solid #cbd5e1',
                              background: '#fff', color: '#64748b', fontWeight: 600, fontSize: 12, cursor: 'pointer',
                            } : {
                              padding: '7px 14px', borderRadius: 10, border: 'none',
                              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                              color: '#fff', fontWeight: 700, fontSize: 12, cursor: 'pointer',
                              boxShadow: '0 6px 14px rgba(14,165,233,0.28)',
                            }}
                          >
                            {done ? 'Қайта ашу' : '✓ Орындалды'}
                          </motion.button>
                        </div>
                      </motion.div>
                    )
                  })}
                </div>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
