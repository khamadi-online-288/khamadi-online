'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { supabase } from '../../../lib/supabase'

type Profile = {
  id: string
  full_name?: string | null
  profile_subject_1?: string | null
  profile_subject_2?: string | null
  student_code?: string | null
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 22 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

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
          .eq('id', user.id).single()

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
          .limit(1).single()

        if (recentSession) {
          setLastTestDate(recentSession.created_at)
          const next = new Date(new Date(recentSession.created_at).getTime() + 7 * 24 * 60 * 60 * 1000)
          setNextTestDate(next.toLocaleDateString('ru-RU'))
          setCanTakeTest(false)
        }
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    loadData()
  }, [])

  const firstName = useMemo(() => {
    const raw = profile?.full_name?.trim()
    return raw ? raw.split(' ')[0] : 'Оқушы'
  }, [profile])

  const handleStart = async () => {
    if (!profile?.id || starting || !canTakeTest) return
    try {
      setStarting(true)
      const { data, error } = await supabase
        .from('simulator_sessions')
        .insert({ student_id: profile.id, variant_id: 1 })
        .select('id').single()

      if (error) { console.error(error); setStarting(false); return }
      router.push(`/dashboard/simulator/${data.id}`)
    } catch (e) { console.error(e); setStarting(false) }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 16px' }} />
          <p style={{ color: '#64748b', fontSize: 15, fontWeight: 700 }}>Симулятор жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          ҰБТ Симулятор
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 8 }}>
          Нақты форматтағы тест тәжірибесі
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.8, maxWidth: 680 }}>
          Уақыт шектеуі, пән құрылымы және тест логикасы шынайы ҰБТ форматына барынша жақын.
        </p>
      </motion.div>

      {/* Main hero card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 20, marginBottom: 20 }}>
        {/* Left */}
        <motion.div
          {...fadeUp(0.08)}
          style={{
            borderRadius: 30,
            padding: '32px',
            background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
            border: '1px solid rgba(14,165,233,0.18)',
            boxShadow: '0 16px 44px rgba(14,165,233,0.08)',
          }}
        >
          <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
            <span style={{ padding: '8px 14px', borderRadius: 999, background: '#fff', border: '1px solid rgba(14,165,233,0.18)', color: '#0ea5e9', fontSize: 12, fontWeight: 800 }}>KHAMADI ONLINE</span>
            <span style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(14,165,233,0.08)', border: '1px solid rgba(14,165,233,0.14)', color: '#0369a1', fontSize: 12, fontWeight: 800 }}>PREMIUM SIMULATOR</span>
          </div>

          <div style={{ fontSize: 14, color: '#64748b', marginBottom: 10 }}>
            Сәлем, <strong style={{ color: '#0c4a6e' }}>{firstName}</strong>
          </div>

          <h2 style={{ fontSize: 34, fontWeight: 900, letterSpacing: '-0.05em', color: '#0c4a6e', margin: '0 0 14px' }}>
            ҰБТ Симуляторы
          </h2>

          <p style={{ fontSize: 15, lineHeight: 1.85, color: '#64748b', marginBottom: 24 }}>
            Уақытқа жұмыс істеп, өзіңнің нақты деңгейіңді бақыла. AI арқылы генерацияланған 120 сұрақ — шынайы ҰБТ форматына сай.
          </p>

          {/* Info grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 22 }}>
            {[
              { label: 'СТУДЕНТ КОДЫ', value: profile?.student_code || '-' },
              { label: 'ПӘНДЕР', value: `${profile?.profile_subject_1 || '?'} + ${profile?.profile_subject_2 || '?'}` },
              { label: 'УАҚЫТ', value: '240 минут' },
              { label: 'СҰРАҚ', value: '120 сұрақ' },
            ].map((item) => (
              <div key={item.label} style={{ background: 'rgba(255,255,255,0.85)', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 18, padding: '14px 16px', boxShadow: '0 4px 14px rgba(14,165,233,0.06)' }}>
                <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginBottom: 6, textTransform: 'uppercase' }}>{item.label}</div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', lineHeight: 1.5 }}>{item.value}</div>
              </div>
            ))}
          </div>

          {/* AI info badge */}
          <div style={{ background: 'linear-gradient(135deg, #eff6ff, #f8fbff)', border: '1px solid #bfdbfe', borderRadius: 16, padding: '12px 16px', fontSize: 13, color: '#1d4ed8', fontWeight: 700, marginBottom: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 16 }}>✦</span>
            AI арқылы нақты ҰБТ форматына жақын 120 сұрақ генерацияланады
          </div>

          {!canTakeTest ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ background: 'linear-gradient(135deg, #fef2f2, #fff7f7)', border: '1px solid #fecaca', borderRadius: 22, padding: 24, textAlign: 'center', boxShadow: '0 8px 24px rgba(239,68,68,0.08)' }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>⏳</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: '#dc2626', marginBottom: 10 }}>Тест аптасына 1 рет тапсырылады</div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
                Соңғы тест: <strong style={{ color: '#0c4a6e' }}>{lastTestDate ? new Date(lastTestDate).toLocaleDateString('ru-RU') : '-'}</strong>
              </div>
              <div style={{ fontSize: 14, color: '#64748b', lineHeight: 1.8 }}>
                Келесі тест: <strong style={{ color: '#0c4a6e' }}>{nextTestDate || '-'}</strong>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={handleStart}
              disabled={starting}
              whileHover={!starting ? { scale: 1.02, boxShadow: '0 22px 48px rgba(14,165,233,0.38)' } : {}}
              whileTap={!starting ? { scale: 0.98 } : {}}
              style={{
                width: '100%', minHeight: 58, borderRadius: 18, border: 'none',
                background: starting ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#fff', fontWeight: 900, fontSize: 16,
                boxShadow: '0 14px 32px rgba(14,165,233,0.30)',
                cursor: starting ? 'not-allowed' : 'pointer', letterSpacing: '-0.02em',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {starting ? 'ТЕСТ АШЫЛУДА...' : '▶  ТЕСТТІ БАСТАУ'}
            </motion.button>
          )}
        </motion.div>

        {/* Right stats */}
        <div style={{ display: 'grid', gap: 16, alignContent: 'start' }}>
          {/* Big stat */}
          <motion.div
            {...fadeUp(0.12)}
            style={{
              borderRadius: 28,
              padding: '28px 24px',
              background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 100%)',
              color: '#fff',
              textAlign: 'center',
              boxShadow: '0 20px 44px rgba(12,74,110,0.22)',
            }}
          >
            <div style={{ fontSize: 80, fontWeight: 900, lineHeight: 1, letterSpacing: '-0.06em', marginBottom: 8 }}>120</div>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>Сұрақ</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)' }}>толық ҰБТ құрылымы</div>
          </motion.div>

          {/* Small stats */}
          <motion.div {...fadeUp(0.16)} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            {[
              { val: '140', label: 'Макс. балл' },
              { val: '5', label: 'Пән' },
              { val: '240', label: 'Минут' },
              { val: '1/апта', label: 'Лимит' },
            ].map((s) => (
              <motion.div
                key={s.label}
                whileHover={{ y: -3, boxShadow: '0 14px 32px rgba(14,165,233,0.14)' }}
                style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 20, padding: '18px', textAlign: 'center', boxShadow: '0 6px 18px rgba(14,165,233,0.06)', transition: 'box-shadow 0.2s' }}
              >
                <div style={{ fontSize: 26, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.04em', lineHeight: 1.1 }}>{s.val}</div>
                <div style={{ fontSize: 12, color: '#64748b', marginTop: 6, fontWeight: 700 }}>{s.label}</div>
              </motion.div>
            ))}
          </motion.div>

          {/* Benefits */}
          <motion.div
            {...fadeUp(0.2)}
            style={{ borderRadius: 22, padding: '20px', background: '#fff', border: '1px solid rgba(14,165,233,0.14)', boxShadow: '0 6px 18px rgba(14,165,233,0.06)' }}
          >
            <div style={{ fontSize: 14, fontWeight: 900, color: '#0c4a6e', marginBottom: 14 }}>Симулятор не береді?</div>
            <div style={{ display: 'grid', gap: 10 }}>
              {['Нақты уақытқа үйретеді', 'Балл деңгейіңді көрсетеді', 'Психологиялық дайындық'].map((item) => (
                <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 10, minHeight: 42, padding: '0 14px', borderRadius: 14, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.12)', fontSize: 13, fontWeight: 700, color: '#334155' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="3"><path d="M5 12l5 5L20 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
