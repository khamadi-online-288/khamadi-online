'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthQuotePanel from '@/components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

type LoginRole = 'student' | 'parent'

type Profile = {
  id?: string
  role: string | null
  approval_status: string | null
}

export default function LoginPage() {
  const [role, setRole] = useState<LoginRole>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const canLogin = Boolean(email.trim() && password.trim())

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canLogin || loading) return
    setError(null)

    try {
      setLoading(true)

      const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })

      if (authError) { setError(authError.message); return }
      if (!data.user) { setError('Қолданушы табылмады'); return }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id, role, approval_status')
        .eq('id', data.user.id)
        .maybeSingle()

      if (profileError) { setError(profileError.message); return }
      if (!profile) { setError('Профиль табылмады'); return }

      const typedProfile = profile as Profile
      const userRole = typedProfile.role
      const approvalStatus = typedProfile.approval_status || 'pending'

      if (userRole === 'super_admin' || userRole === 'admin') {
        window.location.href = '/ent/dashboard/admin'; return
      }

      if (approvalStatus !== 'approved') {
        await supabase.auth.signOut()
        window.location.href = '/ent/pending-approval'; return
      }

      if (userRole === 'student') {
        if (role !== 'student') { setError('Бұл аккаунт оқушы ретінде тіркелген'); return }
        window.location.href = '/ent/dashboard'; return
      }

      if (userRole === 'parent') {
        if (role !== 'parent') { setError('Бұл аккаунт ата-ана ретінде тіркелген'); return }
        window.location.href = '/ent/dashboard/parent'; return
      }

      setError('Аккаунт рөлі дұрыс емес')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Кіру кезінде қате орын алды')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.05fr 0.95fr',
        background: 'linear-gradient(160deg, #f8fcff 0%, #ffffff 55%, #f0f9ff 100%)',
      }}
    >
      {/* Left panel */}
      <div style={{ display: 'none' }} className="auth-panel-hide">
        <AuthQuotePanel />
      </div>
      <AuthQuotePanel />

      {/* Right — form */}
      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 28px',
          overflow: 'hidden',
        }}
      >
        {/* Glow blobs */}
        <div style={{ position: 'absolute', right: '-5%', top: '5%', width: 260, height: 260, borderRadius: 999, background: 'rgba(56,189,248,0.14)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '5%', bottom: '8%', width: 220, height: 220, borderRadius: 999, background: 'rgba(14,165,233,0.10)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: 520,
            background: 'rgba(255,255,255,0.88)',
            border: '1px solid rgba(14,165,233,0.15)',
            borderRadius: 32,
            padding: '36px 32px',
            boxShadow: '0 32px 80px rgba(14,165,233,0.10), 0 0 0 1px rgba(255,255,255,0.5) inset',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.45, delay: 0.1 }}
            style={{
              display: 'inline-flex',
              padding: '8px 16px',
              borderRadius: 999,
              background: 'rgba(224,242,254,0.9)',
              border: '1px solid rgba(14,165,233,0.18)',
              color: '#0369a1',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 18,
              letterSpacing: '0.4px',
            }}
          >
            АККАУНТҚА КІРУ
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={{ fontSize: 28, fontWeight: 800, color: '#0c4a6e', marginBottom: 8, letterSpacing: '-0.8px' }}
          >
            Қайта қош келдіңіз
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, marginBottom: 26 }}
          >
            Оқушы немесе ата-ана аккаунтымен кіріп, дайындықты жалғастырыңыз.
          </motion.p>

          {/* Role switcher */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.25 }}
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 10,
              background: 'rgba(248,250,252,0.95)',
              border: '1px solid rgba(14,165,233,0.12)',
              padding: '8px',
              borderRadius: 22,
              marginBottom: 26,
            }}
          >
            {(['student', 'parent'] as LoginRole[]).map((r) => (
              <motion.button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: 'none',
                  borderRadius: 15,
                  padding: '14px 16px',
                  background: role === r ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'transparent',
                  color: role === r ? '#ffffff' : '#64748b',
                  textAlign: 'left',
                  cursor: 'pointer',
                  boxShadow: role === r ? '0 10px 24px rgba(14,165,233,0.22)' : 'none',
                  transition: 'all 0.22s ease',
                }}
              >
                <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 3 }}>
                  {r === 'student' ? 'Оқушы' : 'Ата-ана'}
                </div>
                <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.88 }}>
                  {r === 'student' ? 'Жеке оқу аккаунты' : 'Баланың прогресін бақылау'}
                </div>
              </motion.button>
            ))}
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleLogin}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            style={{ display: 'flex', flexDirection: 'column', gap: 16 }}
          >
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="input-field"
              />
            </Field>

            <Field label="Құпиясөз">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Құпиясөзді енгізіңіз"
                className="input-field"
              />
            </Field>

            {/* Error message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -8, height: 0 }}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    background: 'rgba(254,242,242,0.9)',
                    border: '1px solid rgba(252,165,165,0.5)',
                    color: '#dc2626',
                    fontSize: 13,
                    fontWeight: 700,
                    lineHeight: 1.6,
                  }}
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              type="submit"
              disabled={!canLogin || loading}
              whileHover={canLogin && !loading ? { scale: 1.02, boxShadow: '0 18px 38px rgba(14,165,233,0.32)' } : {}}
              whileTap={canLogin && !loading ? { scale: 0.98 } : {}}
              style={{
                padding: '15px 24px',
                borderRadius: 16,
                border: 'none',
                background:
                  !canLogin || loading
                    ? 'linear-gradient(135deg, #bae6fd, #7dd3fc)'
                    : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#ffffff',
                fontSize: 15,
                fontWeight: 800,
                cursor: !canLogin || loading ? 'not-allowed' : 'pointer',
                boxShadow:
                  !canLogin || loading
                    ? 'none'
                    : '0 14px 30px rgba(14,165,233,0.28)',
                opacity: !canLogin || loading ? 0.75 : 1,
                letterSpacing: '-0.01em',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <span className="spin" style={{ width: 18, height: 18, border: '2.5px solid rgba(255,255,255,0.4)', borderTopColor: '#ffffff', borderRadius: 999, display: 'inline-block' }} />
                  Кіріп жатыр...
                </span>
              ) : 'Кіру'}
            </motion.button>
          </motion.form>

          {/* Register link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            style={{ marginTop: 22, textAlign: 'center', fontSize: 14, color: '#64748b' }}
          >
            Аккаунтыңыз жоқ па?{' '}
            <a href="/ent/register" style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'none' }}>
              Тіркелу
            </a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 800, color: '#334155' }}>
        {label}
      </label>
      {children}
    </div>
  )
}
