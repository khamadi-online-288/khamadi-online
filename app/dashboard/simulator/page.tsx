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
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, profile_subject_1, profile_subject_2, student_code')
          .eq('id', user.id)
          .single()

        if (error || !data) {
          setLoading(false)
          return
        }

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
          const next = new Date(
            new Date(recentSession.created_at).getTime() + 7 * 24 * 60 * 60 * 1000
          )
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

      if (error) {
        console.error(error)
        setStarting(false)
        return
      }

      router.push(`/dashboard/simulator/${data.id}`)
    } catch (e) {
      console.error(e)
      setStarting(false)
    }
  }

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={s.loadingCard}>
          <div style={s.loader} />
          <div style={s.loadingText}>Симулятор жүктелуде...</div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <div style={s.wrap}>
        <div style={s.topBlock}>
          <div style={s.pageLabel}>ҰБТ симулятор</div>
          <h1 style={s.pageTitle}>Нақты форматтағы тестке дайындал</h1>
          <p style={s.pageText}>
            Уақыт шектеуі, пән құрылымы және тест өту логикасы шынайы ҰБТ форматына жақын.
          </p>
        </div>

        <div style={s.hero}>
          <div style={s.heroLeft}>
            <div style={s.heroTopRow}>
              <div style={s.badge}>KHAMADI ONLINE</div>
              <div style={s.softPill}>PREMIUM SIMULATOR</div>
            </div>

            <div style={s.hello}>
              Сәлем, <span style={s.helloName}>{firstName}</span>
            </div>

            <h2 style={s.heroTitle}>ҰБТ Симуляторы</h2>

            <p style={s.heroText}>
              Бұл бөлімде сен уақытқа жұмыс істеп, өзіңнің нақты деңгейіңді көре аласың.
              Формат, тайминг және тест логикасы шынайы емтиханға барынша жақын жасалған.
            </p>

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
              <span style={s.aiIcon}>✦</span>
              <span>AI арқылы нақты ҰБТ форматына жақын 120 сұрақ генерацияланады</span>
            </div>

            {!canTakeTest ? (
              <div style={s.blockedBox}>
                <div style={s.blockedIcon}>⏳</div>
                <div style={s.blockedTitle}>Тест аптасына 1 рет тапсырылады</div>
                <div style={s.blockedText}>
                  Соңғы тест уақыты:{' '}
                  <strong style={{ color: '#0F172A' }}>
                    {lastTestDate
                      ? new Date(lastTestDate).toLocaleDateString('ru-RU')
                      : '-'}
                  </strong>
                </div>
                <div style={s.blockedText}>
                  Келесі тест күні:{' '}
                  <strong style={{ color: '#0F172A' }}>{nextTestDate || '-'}</strong>
                </div>
              </div>
            ) : (
              <button
                style={{
                  ...s.startBtn,
                  opacity: starting ? 0.7 : 1,
                  cursor: starting ? 'not-allowed' : 'pointer',
                }}
                onClick={handleStart}
                disabled={starting}
              >
                <span style={s.startBtnGlow} />
                <span style={s.startBtnText}>
                  {starting ? 'ТЕСТ АШЫЛУДА...' : 'ТЕСТТІ БАСТАУ'}
                </span>
              </button>
            )}
          </div>

          <div style={s.heroRight}>
            <div style={s.statCardLarge}>
              <div style={s.statBigNumber}>120</div>
              <div style={s.statBigLabel}>Сұрақ</div>
              <div style={s.statBigSub}>толық ҰБТ құрылымы</div>
            </div>

            <div style={s.statGrid}>
              <div style={s.statCard}>
                <div style={s.statNumber}>140</div>
                <div style={s.statLabel}>Макс. балл</div>
              </div>

              <div style={s.statCard}>
                <div style={s.statNumber}>5</div>
                <div style={s.statLabel}>Пән</div>
              </div>

              <div style={s.statCard}>
                <div style={s.statNumber}>240</div>
                <div style={s.statLabel}>Минут</div>
              </div>

              <div style={s.statCard}>
                <div style={s.statNumber}>1/апта</div>
                <div style={s.statLabel}>Лимит</div>
              </div>
            </div>

            <div style={s.sideGlassCard}>
              <div style={s.sideGlassTitle}>Симулятор не береді?</div>
              <div style={s.sideGlassList}>
                <div style={s.sideGlassItem}>Нақты уақытқа үйретеді</div>
                <div style={s.sideGlassItem}>Балл деңгейіңді көрсетеді</div>
                <div style={s.sideGlassItem}>Психологиялық дайындық береді</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 24%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 22%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
    padding: '24px 20px 48px',
    position: 'relative',
    overflow: 'hidden',
  },

  bgGlowTop: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 320,
    height: 320,
    borderRadius: '999px',
    background: 'rgba(56,189,248,0.14)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  bgGlowBottom: {
    position: 'absolute',
    left: -100,
    bottom: -100,
    width: 280,
    height: 280,
    borderRadius: '999px',
    background: 'rgba(14,165,233,0.10)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  wrap: {
    maxWidth: 1220,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
  },

  loadingPage: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingCard: {
    width: 220,
    height: 180,
    borderRadius: 28,
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(14px)',
  },

  loader: {
    width: 54,
    height: 54,
    border: '4px solid #0EA5E9',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 18,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#64748B',
  },

  topBlock: {
    marginBottom: 20,
  },

  pageLabel: {
    fontSize: 12,
    fontWeight: 800,
    color: '#0EA5E9',
    marginBottom: 8,
    textTransform: 'uppercase',
    letterSpacing: '0.10em',
  },

  pageTitle: {
    fontSize: 38,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 10,
  },

  pageText: {
    fontSize: 15,
    lineHeight: 1.8,
    color: '#64748B',
    margin: 0,
    maxWidth: 760,
  },

  hero: {
    display: 'grid',
    gridTemplateColumns: '1.2fr 0.8fr',
    gap: 22,
    padding: 30,
    borderRadius: 34,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(240,249,255,0.92) 100%)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 24px 50px rgba(15,23,42,0.06)',
    backdropFilter: 'blur(16px)',
  },

  heroLeft: {},

  heroRight: {
    display: 'grid',
    gap: 14,
    alignContent: 'start',
  },

  heroTopRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 16,
  },

  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: 999,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
  },

  softPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: 999,
    background: 'rgba(14,165,233,0.08)',
    border: '1px solid rgba(14,165,233,0.14)',
    color: '#0369A1',
    fontSize: 12,
    fontWeight: 800,
  },

  hello: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 10,
  },

  helloName: {
    color: '#0F172A',
    fontWeight: 800,
  },

  heroTitle: {
    fontSize: 40,
    fontWeight: 900,
    lineHeight: 1.08,
    letterSpacing: '-0.04em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 14,
  },

  heroText: {
    fontSize: 16,
    lineHeight: 1.85,
    color: '#64748B',
    margin: 0,
    marginBottom: 22,
    maxWidth: 700,
  },

  infoGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 12,
    marginBottom: 20,
  },

  infoCard: {
    background: 'rgba(255,255,255,0.92)',
    border: '1px solid #E2E8F0',
    borderRadius: 20,
    padding: 16,
    boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
  },

  infoLabel: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748B',
    marginBottom: 6,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: 800,
    lineHeight: 1.5,
    color: '#0F172A',
  },

  aiInfo: {
    background: 'linear-gradient(135deg, #EFF6FF, #F8FBFF)',
    border: '1px solid #BFDBFE',
    borderRadius: 16,
    padding: '14px 16px',
    fontSize: 14,
    color: '#1D4ED8',
    fontWeight: 700,
    marginBottom: 18,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },

  aiIcon: {
    fontSize: 16,
    lineHeight: 1,
  },

  blockedBox: {
    background: 'linear-gradient(135deg, #FEF2F2, #FFF7F7)',
    border: '1px solid #FECACA',
    borderRadius: 20,
    padding: 24,
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(239,68,68,0.06)',
  },

  blockedIcon: {
    fontSize: 34,
    marginBottom: 10,
  },

  blockedTitle: {
    fontSize: 17,
    fontWeight: 900,
    color: '#DC2626',
    marginBottom: 10,
  },

  blockedText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.8,
  },

  startBtn: {
    position: 'relative',
    width: '100%',
    minHeight: 58,
    padding: '0 20px',
    borderRadius: 18,
    border: 'none',
    background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    fontWeight: 900,
    fontSize: 15,
    boxShadow: '0 16px 30px rgba(14,165,233,0.24)',
    overflow: 'hidden',
  },

  startBtnGlow: {
    position: 'absolute',
    inset: 0,
    background:
      'linear-gradient(90deg, rgba(255,255,255,0.00), rgba(255,255,255,0.18), rgba(255,255,255,0.00))',
    pointerEvents: 'none',
  },

  startBtnText: {
    position: 'relative',
    zIndex: 1,
  },

  statCardLarge: {
    borderRadius: 30,
    padding: 24,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 24%), linear-gradient(135deg, #0B1120 0%, #111827 100%)',
    color: '#FFFFFF',
    boxShadow: '0 24px 44px rgba(15,23,42,0.16)',
    minHeight: 220,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  statBigNumber: {
    fontSize: 76,
    fontWeight: 900,
    lineHeight: 1,
    letterSpacing: '-0.05em',
    marginBottom: 8,
  },

  statBigLabel: {
    fontSize: 18,
    fontWeight: 800,
    color: '#FFFFFF',
    marginBottom: 6,
  },

  statBigSub: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.68)',
  },

  statGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 14,
  },

  statCard: {
    background: 'rgba(255,255,255,0.88)',
    border: '1px solid #E2E8F0',
    borderRadius: 22,
    padding: 20,
    textAlign: 'center',
    boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
  },

  statNumber: {
    fontSize: 28,
    fontWeight: 900,
    lineHeight: 1.1,
    color: '#0F172A',
  },

  statLabel: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 6,
    fontWeight: 700,
  },

  sideGlassCard: {
    borderRadius: 24,
    padding: 18,
    background: 'rgba(255,255,255,0.68)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 12px 26px rgba(15,23,42,0.05)',
    backdropFilter: 'blur(14px)',
  },

  sideGlassTitle: {
    fontSize: 15,
    fontWeight: 900,
    color: '#0F172A',
    marginBottom: 12,
  },

  sideGlassList: {
    display: 'grid',
    gap: 10,
  },

  sideGlassItem: {
    minHeight: 42,
    padding: '0 14px',
    borderRadius: 14,
    background: '#F8FBFF',
    border: '1px solid #E2E8F0',
    display: 'flex',
    alignItems: 'center',
    fontSize: 13,
    fontWeight: 700,
    color: '#334155',
  },
}