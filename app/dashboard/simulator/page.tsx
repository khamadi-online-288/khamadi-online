'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabase'

type Profile = {
  id: string
  full_name?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
  student_code?: string | null
}

export default function SimulatorPage() {
  const router = useRouter()

  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [starting, setStarting] = useState(false)
  const [canTakeTest, setCanTakeTest] = useState(true)
  const [lastTestDate, setLastTestDate] = useState<string | null>(null)
  const [nextTestDate, setNextTestDate] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { setLoading(false); return }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, profile_subject_1, profile_subject_2, student_code')
          .eq('id', user.id)
          .single()

        if (error || !data) { setLoading(false); return }
        setProfile(data as Profile)

        const oneWeekAgo = new Date()
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

        const { data: recentSession } = await supabase
          .from('simulator_sessions')
          .select('id, created_at')
          .eq('student_id', data.id)
          .gte('created_at', oneWeekAgo.toISOString())
          .order('created_at', { ascending: false })
          .limit(1)
          .single()

        if (recentSession) {
          setLastTestDate(recentSession.created_at)
          const next = new Date(new Date(recentSession.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
          setNextTestDate(next.toLocaleDateString('ru-RU'))
          setCanTakeTest(false)
        } else {
          setCanTakeTest(true)
        }
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const firstName = useMemo(() => {
    const raw = profile?.full_name?.trim()
    if (!raw) return 'Оқушы'
    return raw.split(' ')[0]
  }, [profile])

  const handleStart = async () => {
    if (!profile?.id || starting || !canTakeTest) return
    try {
      setStarting(true)
      const { data, error } = await supabase
        .from('simulator_sessions')
        .insert({ student_id: profile.id, variant_id: 1 })
        .select('id')
        .single()

      if (error) { console.error(error); setStarting(false); return }
      router.push(`/dashboard/simulator/${data.id}`)
    } catch (e) {
      console.error(e)
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F8FAFC', color: '#64748B' }}>
        Жүктелуде...
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.pageLabel}>ҰБТ симулятор</div>
          <h1 style={s.pageTitle}>Нақты форматтағы тестке дайындал</h1>
          <p style={s.pageText}>Уақыт шектеуі, пән құрылымы және тест өту логикасы шынайы ҰБТ форматына жақын.</p>
        </div>

        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.badge}>KHAMADI ONLINE</div>
            <div style={s.hello}>Сәлем, <span style={s.helloName}>{firstName}</span></div>
            <h2 style={s.heroTitle}>ҰБТ Симуляторы</h2>
            <p style={s.heroText}>Бұл бөлімде сен уақытқа жұмыс істеп, өзіңнің нақты деңгейіңді көре аласың.</p>

            <div style={s.infoGrid}>
              <div style={s.infoCard}>
                <div style={s.infoLabel}>СТУДЕНТ КОДЫ</div>
                <div style={s.infoValue}>{profile?.student_code || '-'}</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoLabel}>ПРОФИЛЬ ПӘН 1</div>
                <div style={s.infoValue}>{profile?.profile_subject_1 || 'Таңдалмаған'}</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoLabel}>ПРОФИЛЬ ПӘН 2</div>
                <div style={s.infoValue}>{profile?.profile_subject_2 || 'Таңдалмаған'}</div>
              </div>
              <div style={s.infoCard}>
                <div style={s.infoLabel}>УАҚЫТ</div>
                <div style={s.infoValue}>240 минут</div>
              </div>
            </div>

            <div style={s.aiInfo}>
              🤖 AI арқылы нақты ҰБТ форматындағы 120 сұрақ жасалады
            </div>

            {!canTakeTest ? (
              <div style={s.blockedBox}>
                <div style={{ fontSize: 32, marginBottom: 10 }}>⏳</div>
                <div style={{ fontSize: 16, fontWeight: 800, color: '#DC2626', marginBottom: 6 }}>
                  Тест аптасына 1 рет тапсырылады
                </div>
                <div style={{ fontSize: 14, color: '#64748B' }}>
                  Келесі тест күні: <strong style={{ color: '#0F172A' }}>{nextTestDate}</strong>
                </div>
              </div>
            ) : (
              <button
                style={{ ...s.startBtn, opacity: starting ? 0.6 : 1, cursor: starting ? 'not-allowed' : 'pointer' }}
                onClick={handleStart}
                disabled={starting}
              >
                {starting ? 'ТЕСТ АШЫЛУДА...' : 'ТЕСТТІ БАСТАУ'}
              </button>
            )}
          </div>

          <div style={s.heroRight}>
            <div style={s.statCard}>
              <div style={s.statNumber}>120</div>
              <div style={s.statLabel}>Сұрақ</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>140</div>
              <div style={s.statLabel}>Макс. балл</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>5</div>
              <div style={s.statLabel}>Пән</div>
            </div>
            <div style={s.statCard}>
              <div style={s.statNumber}>1/апта</div>
              <div style={s.statLabel}>Тест лимиті</div>
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
  pageLabel: { fontSize: 13, fontWeight: 700, color: '#0EA5E9', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.08em' },
  pageTitle: { fontSize: 34, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 8 },
  pageText: { fontSize: 15, lineHeight: 1.7, color: '#64748B', margin: 0 },
  hero: { display: 'grid', gridTemplateColumns: '1.35fr 0.65fr', gap: 20, background: 'linear-gradient(135deg, #E0F2FE 0%, #F0F9FF 100%)', border: '1px solid #E2E8F0', borderRadius: 28, padding: 28, boxShadow: '0 10px 30px rgba(15, 23, 42, 0.05)', marginBottom: 20 },
  heroLeft: {},
  heroRight: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, alignContent: 'start' },
  badge: { display: 'inline-flex', alignItems: 'center', padding: '9px 13px', borderRadius: 999, background: '#FFFFFF', border: '1px solid #E2E8F0', color: '#0EA5E9', fontSize: 12, fontWeight: 800, marginBottom: 16 },
  hello: { fontSize: 15, color: '#64748B', marginBottom: 8 },
  helloName: { color: '#0F172A', fontWeight: 800 },
  heroTitle: { fontSize: 32, fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.03em', color: '#0F172A', margin: 0, marginBottom: 12 },
  heroText: { fontSize: 16, lineHeight: 1.8, color: '#64748B', margin: 0, marginBottom: 22, maxWidth: 680 },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 },
  infoCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 18, padding: 16 },
  infoLabel: { fontSize: 11, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#64748B', marginBottom: 6 },
  infoValue: { fontSize: 15, fontWeight: 700, lineHeight: 1.5, color: '#0F172A' },
  aiInfo: { background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: 14, padding: '14px 16px', fontSize: 14, color: '#1D4ED8', fontWeight: 600, marginBottom: 18 },
  blockedBox: { background: '#FEF2F2', border: '1px solid #FCA5A5', borderRadius: 16, padding: '24px', textAlign: 'center' },
  startBtn: { width: '100%', padding: '16px 18px', borderRadius: 16, border: 'none', background: '#0EA5E9', color: '#FFFFFF', fontWeight: 800, fontSize: 15, boxShadow: '0 10px 24px rgba(14, 165, 233, 0.20)' },
  statCard: { background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 20, padding: 20, textAlign: 'center', boxShadow: '0 8px 24px rgba(15, 23, 42, 0.04)' },
  statNumber: { fontSize: 30, fontWeight: 800, lineHeight: 1.1, color: '#0F172A' },
  statLabel: { fontSize: 13, color: '#64748B', marginTop: 4 },
}