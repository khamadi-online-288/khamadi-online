'use client'

import { useEffect, useState } from 'react'
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

export default function StudyPlanPage() {
  const [loading, setLoading] = useState(true)
  const [plans, setPlans] = useState<PlanItem[]>([])

  useEffect(() => {
    loadPlans()
  }, [])

  async function loadPlans() {
    try {
      setLoading(true)

      const {
        data: { user }
      } = await supabase.auth.getUser()

      if (!user) {
        setLoading(false)
        return
      }

      const { data, error } = await supabase
        .from('study_plans')
        .select('*')
        .eq('user_id', user.id)
        .order('id', { ascending: true })

      if (error) {
        console.error(error)
        setLoading(false)
        return
      }

      setPlans((data || []) as PlanItem[])
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  async function toggleStatus(id: number, current: string) {
    const next = current === 'done' ? 'todo' : 'done'

    const {
      data: { user }
    } = await supabase.auth.getUser()

    const { error } = await supabase
      .from('study_plans')
      .update({ status: next })
      .eq('id', id)

    if (error) {
      console.error(error)
      return
    }

    setPlans((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: next } : item
      )
    )

    if (next === 'done' && user) {
      await fetch('/api/update-gamification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          action: 'study_plan_done'
        })
      })
    }
  }

  function getQuizLink(item: PlanItem) {
    if (!item.subject_id || !item.section_id) return '#'
    return `/dashboard/subjects/${item.subject_id}/sections/${item.section_id}?topic=${item.topic_id || ''}`
  }

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <p style={s.loadingText}>Study plan жүктелуде...</p>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.label}>STUDY PLAN</div>
          <h1 style={s.title}>Жеке оқу жоспары</h1>
          <p style={s.subtitle}>
            Нақты сабақтар, PDF және quiz-дармен құрылған жоспар.
          </p>
        </div>

        {plans.length === 0 ? (
          <div style={s.emptyCard}>
            <div style={s.emptyIcon}>📅</div>
            <h2 style={s.emptyTitle}>Study Plan жоқ</h2>
            <p style={s.emptyText}>
              Алдымен AI Analysis бетінде жоспарды генерациялау керек.
            </p>
            <a href="/dashboard/ai-analysis" style={s.primaryLink}>
              AI Analysis-қа өту
            </a>
          </div>
        ) : (
          <div style={s.grid}>
            {plans.map((item) => (
              <div
                key={item.id}
                style={{
                  ...s.card,
                  opacity: item.status === 'done' ? 0.78 : 1
                }}
              >
                <div style={s.cardTop}>
                  <div>
                    <div style={s.day}>{item.day_label}</div>
                    <div style={s.subject}>{item.subject}</div>
                  </div>

                  <div
                    style={{
                      ...s.statusBadge,
                      background: item.status === 'done' ? '#F0FDF4' : '#EFF6FF',
                      border: item.status === 'done' ? '1px solid #BBF7D0' : '1px solid #BFDBFE',
                      color: item.status === 'done' ? '#166534' : '#1D4ED8'
                    }}
                  >
                    {item.status === 'done' ? 'Done' : 'Todo'}
                  </div>
                </div>

                <div style={s.topic}>{item.topic_name || item.topic}</div>

                <div style={s.metaRow}>
                  <div style={s.metaPill}>{item.duration_minutes} мин</div>
                  <div style={s.metaTime}>{item.quiz_count || 0} quiz</div>
                </div>

                <div style={s.actions}>
                  {item.pdf_url ? (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      style={s.linkBtn}
                    >
                      PDF ашу
                    </a>
                  ) : (
                    <div style={s.disabledBtn}>PDF жоқ</div>
                  )}

                  {(item.quiz_count || 0) > 0 ? (
                    <a href={getQuizLink(item)} style={s.quizBtn}>
                      Quiz бастау
                    </a>
                  ) : (
                    <div style={s.disabledBtn}>Quiz жоқ</div>
                  )}
                </div>

                <button
                  onClick={() => toggleStatus(item.id, item.status)}
                  style={item.status === 'done' ? s.secondaryBtn : s.primaryBtn}
                >
                  {item.status === 'done' ? 'Қайта ашу' : 'Орындалды деп белгілеу'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F8FAFC', padding: '24px 20px 40px' },
  wrap: { maxWidth: 1100, margin: '0 auto' },
  loadingPage: { minHeight: '100vh', background: '#F8FAFC', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#64748B', fontSize: 15 },
  topBlock: { marginBottom: 22 },
  label: { fontSize: 13, fontWeight: 700, color: '#0EA5E9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' },
  title: { fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 8 },
  subtitle: { fontSize: 15, lineHeight: 1.7, color: '#64748B', margin: 0 },
  emptyCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 48, textAlign: 'center', boxShadow: '0 10px 30px rgba(15,23,42,0.05)' },
  emptyIcon: { fontSize: 54, marginBottom: 14 },
  emptyTitle: { fontSize: 22, fontWeight: 800, color: '#0F172A', margin: '0 0 8px 0' },
  emptyText: { color: '#64748B', fontSize: 15, lineHeight: 1.7, margin: '0 0 22px 0' },
  primaryLink: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', padding: '14px 24px', borderRadius: 14, background: '#0EA5E9', color: '#FFFFFF', fontWeight: 800, textDecoration: 'none', fontSize: 15 },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: 16 },
  card: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 22, padding: 20, boxShadow: '0 8px 24px rgba(15,23,42,0.04)' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 14 },
  day: { fontSize: 13, fontWeight: 700, color: '#0EA5E9', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' },
  subject: { fontSize: 18, fontWeight: 800, color: '#0F172A' },
  statusBadge: { padding: '8px 12px', borderRadius: 999, fontSize: 12, fontWeight: 800 },
  topic: { fontSize: 15, lineHeight: 1.75, color: '#475569', marginBottom: 16 },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10, marginBottom: 16 },
  metaPill: { padding: '8px 12px', borderRadius: 999, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#334155', fontSize: 12, fontWeight: 700 },
  metaTime: { color: '#64748B', fontSize: 13, fontWeight: 700 },
  actions: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 },
  linkBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 14px', borderRadius: 14, background: '#FFFFFF', border: '1px solid #CBD5E1', color: '#0F172A', textDecoration: 'none', fontWeight: 700, fontSize: 14 },
  quizBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 14px', borderRadius: 14, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', textDecoration: 'none', fontWeight: 800, fontSize: 14 },
  disabledBtn: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '12px 14px', borderRadius: 14, background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 700, fontSize: 14 },
  primaryBtn: { width: '100%', padding: '13px 14px', borderRadius: 14, border: 'none', background: '#0EA5E9', color: '#FFFFFF', fontWeight: 800, fontSize: 14, cursor: 'pointer' },
  secondaryBtn: { width: '100%', padding: '13px 14px', borderRadius: 14, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontWeight: 700, fontSize: 14, cursor: 'pointer' }
}