'use client'

import { useEffect, useMemo, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'

type SubjectResult = {
  name: string
  answered: number
  total: number
}

type ResultData = {
  totalAnswered: number
  totalQuestions: number
  timeSpent: number
  sessionId: string
  subjectResults: SubjectResult[]
}

function formatTime(sec: number) {
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export default function SimulatorResultPage() {
  const params = useParams()
  const router = useRouter()
  const sessionId = String(params.sessionId || '1')

  const [result, setResult] = useState<ResultData | null>(null)

  useEffect(() => {
    const raw = localStorage.getItem('simulator_result')
    if (raw) {
      try {
        setResult(JSON.parse(raw))
      } catch (e) {
        console.error(e)
      }
    }
  }, [])

  const totalAnswered = result?.totalAnswered ?? 0
  const totalQuestions = result?.totalQuestions ?? 120
  const timeSpent = result?.timeSpent ?? 0
  const subjectResults = result?.subjectResults ?? []

  const percent = useMemo(() => {
    if (!totalQuestions) return 0
    return Math.round((totalAnswered / totalQuestions) * 100)
  }, [totalAnswered, totalQuestions])

  const bestSubject = useMemo(() => {
    if (!subjectResults.length) return null
    return [...subjectResults].sort((a, b) => (b.answered / b.total) - (a.answered / a.total))[0]
  }, [subjectResults])

  const weakSubject = useMemo(() => {
    if (!subjectResults.length) return null
    return [...subjectResults].sort((a, b) => (a.answered / a.total) - (b.answered / b.total))[0]
  }, [subjectResults])

  const passed = percent >= 50

  const recommendation = useMemo(() => {
    if (percent >= 85) return 'Нәтиже өте жақсы. Енді жоғары баллды тұрақтандыру үшін тағы 1–2 толық симулятор тапсыр.'
    if (percent >= 70) return 'Жақсы нәтиже. Әлсіз бөлімдерді қайта қарап, тағы бір вариантпен бекіту керек.'
    if (percent >= 50) return 'Негізгі база бар. Бірақ әлсіз пәндерге көбірек уақыт бөліп, қателерді талдау қажет.'
    return 'Нәтижені көтеру керек. Міндетті пәндер мен әлсіз профиль бөлімдерін қайта оқып, жаңа симулятор тапсыру керек.'
  }, [percent])

  if (!result) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#64748B', fontSize: 16, marginBottom: 16 }}>Нәтиже табылмады</p>
          <button onClick={() => router.push('/dashboard/simulator')} style={{ padding: '12px 24px', borderRadius: 12, border: 'none', background: '#0EA5E9', color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
            Симуляторға оралу
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.topLabel}>НӘТИЖЕ</div>
          <h1 style={s.topTitle}>Симулятор нәтижесі</h1>
          <p style={s.topText}>Жалпы нәтижең, пәндер бойынша бөлініс және келесі қадамдар осында көрсетіледі.</p>
        </div>

        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badgeRow}>
              <div style={s.badge}>Session #{sessionId.slice(0, 8)}</div>
              <div style={{ ...s.badge, color: passed ? '#16A34A' : '#DC2626', border: passed ? '1px solid #BBF7D0' : '1px solid #FECACA', background: passed ? '#F0FDF4' : '#FEF2F2' }}>
                {passed ? '✅ Өту балы жиналды' : '❌ Нәтижені көтеру керек'}
              </div>
            </div>

            <div style={s.scoreRow}>
              <div style={s.scoreMain}>{totalAnswered}</div>
              <div style={s.scoreMax}>/ {totalQuestions}</div>
            </div>

            <div style={s.heroText}>
              Жалпы нәтиже: <strong>{percent}%</strong><br />
              {bestSubject && <>Ең мықты пән: <strong>{bestSubject.name}</strong><br /></>}
              {weakSubject && <>Ең әлсіз пән: <strong>{weakSubject.name}</strong></>}
            </div>
          </div>

          <div style={s.heroRight}>
            <div style={s.statCard}>
              <div style={s.statNumber}>{percent}%</div>
              <div style={s.statLabel}>Жалпы пайыз</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>{totalAnswered}</div>
              <div style={s.statLabel}>Жауап берілді</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>{totalQuestions - totalAnswered}</div>
              <div style={s.statLabel}>Жауапсыз</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>{formatTime(timeSpent)}</div>
              <div style={s.statLabel}>Уақыт</div>
            </div>
          </div>
        </div>

        <div style={s.grid}>
          <div style={s.card}>
            <h2 style={s.cardTitle}>Пәндер бойынша нәтиже</h2>
            {subjectResults.map((item, index) => {
              const p = item.total ? Math.round((item.answered / item.total) * 100) : 0
              return (
                <div key={item.name} style={{ ...s.resultRow, borderBottom: index === subjectResults.length - 1 ? 'none' : '1px solid #EEF2F7' }}>
                  <div style={s.resultTop}>
                    <div>
                      <div style={s.resultName}>{item.name}</div>
                      <div style={s.resultSmall}>{p}% жауап берілді</div>
                    </div>
                    <div style={s.resultScore}>{item.answered} / {item.total}</div>
                  </div>
                  <div style={s.track}>
                    <div style={{ ...s.fill, width: `${p}%`, background: p >= 70 ? '#22C55E' : p >= 50 ? '#0EA5E9' : '#F59E0B' }} />
                  </div>
                </div>
              )
            })}
          </div>

          <div>
            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>Қысқа талдау</h3>
              <div style={s.sideText}>
                {bestSubject && <>Ең мықты жағың — <strong>{bestSubject.name}</strong>.<br /></>}
                {weakSubject && <>Ең көп жұмыс қажет — <strong>{weakSubject.name}</strong>.<br /></>}
                Әлсіз бөлімдерден бастап, тағы бір толық симулятор тапсырған дұрыс.
              </div>
            </div>

            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>Ұсыныс</h3>
              <div style={s.sideText}>{recommendation}</div>
            </div>

            <div style={s.sideCard}>
              <h3 style={s.sideTitle}>Әрі қарай не істейміз?</h3>
              <button style={s.primaryBtn} onClick={() => router.push('/dashboard/simulator')}>
                🔄 Қайта тапсыру
              </button>
              <button style={s.secondaryBtn} onClick={() => router.push('/dashboard')}>
                Dashboard-қа қайту
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: { minHeight: '100vh', background: '#F8FAFC', padding: '24px 20px 40px' },
  wrap: { maxWidth: 1180, margin: '0 auto' },
  topBlock: { marginBottom: 18 },
  topLabel: { fontSize: 13, fontWeight: 700, color: '#0EA5E9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' },
  topTitle: { fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 8 },
  topText: { fontSize: 15, lineHeight: 1.7, color: '#64748B', margin: 0 },
  hero: { display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 20, background: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)', border: '1px solid #E2E8F0', borderRadius: 28, padding: 28, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', marginBottom: 20 },
  heroLeft: {},
  heroRight: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' },
  badgeRow: { display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 18 },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '9px 13px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0EA5E9', fontSize: 12, fontWeight: 800 },
  scoreRow: { display: 'flex', alignItems: 'flex-end', gap: 10, marginBottom: 14 },
  scoreMain: { fontSize: 72, lineHeight: 1, fontWeight: 900, color: '#0F172A' },
  scoreMax: { fontSize: 30, fontWeight: 700, color: '#64748B', paddingBottom: 8 },
  heroText: { fontSize: 16, lineHeight: 1.8, color: '#475569' },
  statCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, textAlign: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' },
  statNumber: { fontSize: 28, fontWeight: 800, lineHeight: 1.1, color: '#0F172A' },
  statLabel: { fontSize: 13, color: '#64748B', marginTop: 4 },
  grid: { display: 'grid', gridTemplateColumns: '1fr 360px', gap: 20 },
  card: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 24, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)' },
  cardTitle: { fontSize: 24, fontWeight: 800, lineHeight: 1.2, color: '#0F172A', margin: 0, marginBottom: 18 },
  resultRow: { padding: '16px 0' },
  resultTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 10 },
  resultName: { fontSize: 15, fontWeight: 700, color: '#0F172A', marginBottom: 3 },
  resultSmall: { fontSize: 13, color: '#64748B' },
  resultScore: { fontSize: 15, fontWeight: 800, color: '#0EA5E9' },
  track: { width: '100%', height: 10, borderRadius: 999, background: '#E2E8F0', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999 },
  sideCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 24, padding: 22, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', marginBottom: 16 },
  sideTitle: { fontSize: 20, fontWeight: 800, color: '#0F172A', margin: '0 0 12px 0' },
  sideText: { fontSize: 15, lineHeight: 1.75, color: '#475569', marginBottom: 0 },
  primaryBtn: { width: '100%', padding: '14px 16px', borderRadius: 16, border: 'none', background: '#0EA5E9', color: '#FFFFFF', fontWeight: 800, fontSize: 15, cursor: 'pointer', marginBottom: 10, boxShadow: '0 10px 24px rgba(14, 165, 233, 0.20)' },
  secondaryBtn: { width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid #CBD5E1', background: '#FFFFFF', color: '#0F172A', fontWeight: 700, fontSize: 15, cursor: 'pointer' },
}