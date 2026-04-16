'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

/* ── Types ── */
type Subject    = { id: number; name: string; icon: string | null; type: string }
type Section    = { id: number; subject_id: number; name: string; grade: string | null; order_index: number }
type BestResult = { score: number; xp: number; difficulty: string; maxStreak: number }

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number]

export default function SubjectModulesPage() {
  const { subjectId } = useParams<{ subjectId: string }>()
  const router = useRouter()

  const [subject,        setSubject]        = useState<Subject | null>(null)
  const [sections,       setSections]       = useState<Section[]>([])
  const [questionCounts, setQuestionCounts] = useState<Record<number, number>>({})
  const [bestResults,    setBestResults]    = useState<Record<number, BestResult>>({})
  const [loading,        setLoading]        = useState(true)

  useEffect(() => {
    async function load() {
      const [{ data: subjectData }, { data: sectionsData }, { data: { user } }] = await Promise.all([
        supabase.from('subjects').select('*').eq('id', subjectId).single(),
        supabase.from('sections').select('*').eq('subject_id', subjectId).order('order_index', { ascending: true }),
        supabase.auth.getUser(),
      ])

      if (subjectData) setSubject(subjectData)

      if (sectionsData) {
        setSections(sectionsData)

        /* count questions directly by section_id — no topics needed */
        const counts: Record<number, number> = {}
        await Promise.all(
          sectionsData.map(async (section) => {
            const { count } = await supabase
              .from('questions')
              .select('*', { count: 'exact', head: true })
              .eq('section_id', section.id)
            counts[section.id] = count ?? 0
          })
        )
        setQuestionCounts(counts)

        /* load best results — prefer Supabase, fall back to localStorage */
        const results: Record<number, BestResult> = {}

        /* 1. localStorage baseline (instant, no network) */
        sectionsData.forEach(s => {
          const stored = localStorage.getItem(`quiz_best_${s.id}`)
          if (stored) { try { results[s.id] = JSON.parse(stored) } catch {} }
        })

        /* 2. Supabase override — fetch best quiz result per section */
        if (user) {
          const sectionIds = sectionsData.map(s => s.id)
          const { data: dbResults } = await supabase
            .from('quiz_results')
            .select('section_id, score, xp_earned, difficulty, max_streak')
            .eq('user_id', user.id)
            .in('section_id', sectionIds)
            .order('score', { ascending: false })

          if (dbResults) {
            /* keep only best row per section */
            const seen = new Set<number>()
            for (const row of dbResults) {
              if (!seen.has(row.section_id)) {
                seen.add(row.section_id)
                results[row.section_id] = {
                  score:     row.score,
                  xp:        row.xp_earned,
                  difficulty: row.difficulty,
                  maxStreak: row.max_streak,
                }
                /* keep localStorage in sync */
                localStorage.setItem(`quiz_best_${row.section_id}`, JSON.stringify(results[row.section_id]))
              }
            }
          }
        }

        setBestResults(results)
      }

      setLoading(false)
    }
    load()
  }, [subjectId, router])

  if (loading) {
    return (
      <>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 400 }}>
          <div className="spinner" />
        </div>
      </>
    )
  }

  if (!subject) {
    return (
      <>
        <div style={{ textAlign: 'center', padding: 80, color: '#64748b', fontSize: 16, fontWeight: 700 }}>
          Пән табылмады
        </div>
      </>
    )
  }

  const completedCount = sections.filter(s => bestResults[s.id]).length
  const progressPct    = sections.length > 0 ? Math.round((completedCount / sections.length) * 100) : 0

  return (
    <>
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '32px 24px' }}>

        {/* ── Breadcrumb ── */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: EASE }}
          onClick={() => router.push('/dashboard/subjects')}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'none', border: 'none', cursor: 'pointer',
            color: '#64748b', fontSize: 14, fontWeight: 700,
            padding: '4px 0', marginBottom: 20,
          }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M19 12H5M12 5l-7 7 7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Пәндер
        </motion.button>

        {/* ── Hero header ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: EASE, delay: 0.05 }}
          style={{
            background: 'linear-gradient(135deg, #0c4a6e 0%, #0ea5e9 100%)',
            borderRadius: 28, padding: '28px 32px', marginBottom: 28,
            boxShadow: '0 20px 48px rgba(14,165,233,0.22)', position: 'relative', overflow: 'hidden',
          }}
        >
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
            backgroundSize: '40px 40px', pointerEvents: 'none',
          }} />
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 18, marginBottom: 22 }}>
            <div style={{
              width: 60, height: 60, borderRadius: 20,
              background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 30, flexShrink: 0,
            }}>
              {subject.icon ?? '📚'}
            </div>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-0.4px', margin: 0 }}>
                {subject.name}
              </h1>
              <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', fontWeight: 700, marginTop: 4 }}>
                {sections.length} модуль · {completedCount} аяқталды
              </div>
            </div>
          </div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,0.8)' }}>Жалпы прогресс</span>
              <span style={{ fontSize: 13, fontWeight: 900, color: '#fff' }}>{progressPct}%</span>
            </div>
            <div style={{ height: 7, borderRadius: 999, background: 'rgba(255,255,255,0.18)', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progressPct}%` }}
                transition={{ duration: 1.1, ease: EASE, delay: 0.35 }}
                style={{ height: '100%', borderRadius: 999, background: 'rgba(255,255,255,0.9)' }}
              />
            </div>
          </div>
        </motion.div>

        {/* ── Modules list ── */}
        <div style={{ display: 'grid', gap: 12 }}>
          {sections.map((section, i) => {
            const best       = bestResults[section.id]
            const qCount     = questionCounts[section.id] ?? 0
            const isComplete = !!best

            return (
              <motion.div
                key={section.id}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.12 + i * 0.055, ease: EASE }}
                whileHover={{ y: -3, boxShadow: '0 16px 44px rgba(14,165,233,0.14)', transition: { duration: 0.2 } }}
                onClick={() => router.push(`/dashboard/subjects/${subjectId}/${section.id}`)}
                style={{
                  background: '#ffffff',
                  border: `1.5px solid ${isComplete ? 'rgba(14,165,233,0.28)' : 'rgba(226,232,240,0.9)'}`,
                  borderRadius: 20, padding: '18px 22px',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 18,
                  boxShadow: isComplete ? '0 4px 20px rgba(14,165,233,0.08)' : '0 2px 12px rgba(0,0,0,0.04)',
                }}
              >
                {/* Badge */}
                <div style={{
                  width: 48, height: 48, borderRadius: 14, flexShrink: 0,
                  background: isComplete ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                  border: `1px solid ${isComplete ? 'transparent' : 'rgba(14,165,233,0.18)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: isComplete ? 20 : 15, fontWeight: 900,
                  color: isComplete ? '#fff' : '#0c4a6e',
                }}>
                  {isComplete ? '✓' : String(i + 1).padStart(2, '0')}
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 16, fontWeight: 800, color: '#0c4a6e', marginBottom: 5,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  }}>
                    {section.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                    {qCount > 0 && (
                      <span style={{ fontSize: 13, color: '#64748b', fontWeight: 700 }}>📝 {qCount} сұрақ</span>
                    )}
                    {best && (
                      <>
                        <span style={{ fontSize: 13, color: '#22c55e', fontWeight: 800 }}>✓ {best.score}%</span>
                        <span style={{ fontSize: 13, color: '#0ea5e9', fontWeight: 800 }}>⚡ {best.xp} XP</span>
                        {best.maxStreak >= 3 && (
                          <span style={{ fontSize: 13, color: '#f97316', fontWeight: 800 }}>🔥 {best.maxStreak} стрик</span>
                        )}
                      </>
                    )}
                    {!best && qCount === 0 && (
                      <span style={{ fontSize: 13, color: '#94a3b8', fontWeight: 700 }}>Сұрақтар жоқ</span>
                    )}
                  </div>
                </div>

                {/* Right side */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                  {!isComplete && qCount > 0 && (
                    <div style={{
                      padding: '5px 12px', borderRadius: 999,
                      background: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(14,165,233,0.12))',
                      color: '#0ea5e9', fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
                    }}>
                      КВИЗ
                    </div>
                  )}
                  {isComplete && (
                    <div style={{
                      padding: '5px 12px', borderRadius: 999,
                      background: 'rgba(34,197,94,0.1)', color: '#16a34a',
                      fontSize: 11, fontWeight: 900, letterSpacing: '0.05em',
                    }}>
                      ӨТІЛДІ
                    </div>
                  )}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="2.5">
                    <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </motion.div>
            )
          })}
        </div>

        {sections.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📭</div>
            <div style={{ fontSize: 16, fontWeight: 700 }}>Модульдер жоқ</div>
          </div>
        )}
      </div>
    </>
  )
}
