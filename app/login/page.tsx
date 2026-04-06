'use client'

import { useState } from 'react'
import AuthQuotePanel from '@/components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

type LoginRole = 'student' | 'parent'

type Profile = {
  role: string | null
  approval_status: string | null
}

export default function LoginPage() {
  const [role, setRole] = useState<LoginRole>('student')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const canLogin = Boolean(email.trim() && password.trim())

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canLogin || loading) return

    try {
      setLoading(true)

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        alert(error.message)
        return
      }

      if (!data.user) {
        alert('Қолданушы табылмады')
        return
      }

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role, approval_status')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        alert('Профиль табылмады')
        return
      }

      const typedProfile = profile as Profile
      const userRole = typedProfile.role
      const approvalStatus = typedProfile.approval_status || 'pending'

      if (approvalStatus !== 'approved') {
        await supabase.auth.signOut()
        window.location.href = '/pending-approval'
        return
      }

      if (userRole === 'student') {
        if (role !== 'student') {
          alert('Бұл аккаунт оқушы ретінде тіркелген')
          return
        }

        window.location.href = '/dashboard'
        return
      }

      if (userRole === 'parent') {
        if (role !== 'parent') {
          alert('Бұл аккаунт ата-ана ретінде тіркелген')
          return
        }

        window.location.href = '/dashboard/parent'
        return
      }

      if (userRole === 'admin' || userRole === 'super_admin') {
        window.location.href = '/dashboard/admin'
        return
      }

      alert('Аккаунт рөлі дұрыс емес')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateColumns: '1.03fr 0.97fr',
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.12), transparent 22%), radial-gradient(circle at bottom left, rgba(14,165,233,0.10), transparent 24%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 55%, #EFF8FF 100%)',
      }}
    >
      <AuthQuotePanel />

      <div
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '28px',
          overflow: 'hidden',
        }}
      >
        <Glow x="80%" y="15%" size={210} opacity={0.16} />
        <Glow x="12%" y="82%" size={240} opacity={0.11} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(255,255,255,0.80)',
            border: '1px solid rgba(226,232,240,0.95)',
            borderRadius: '34px',
            padding: '28px',
            boxShadow:
              '0 30px 70px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.4) inset',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Badge>АККАУНТҚА КІРУ</Badge>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '8px',
              letterSpacing: '-0.6px',
            }}
          >
            Қайта қош келдіңіз
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: '22px',
            }}
          >
            Оқушы немесе ата-ана аккаунтымен кіріп, дайындықты жалғастырыңыз.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '10px',
              background: 'rgba(248,250,252,0.92)',
              border: '1px solid #E2E8F0',
              padding: '8px',
              borderRadius: '22px',
              marginBottom: '22px',
            }}
          >
            <button
              type="button"
              onClick={() => setRole('student')}
              style={tabButton(role === 'student')}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>
                Оқушы
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.5, opacity: 0.9 }}>
                Жеке оқу аккаунты
              </div>
            </button>

            <button
              type="button"
              onClick={() => setRole('parent')}
              style={tabButton(role === 'parent')}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>
                Ата-ана
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.5, opacity: 0.9 }}>
                Баланың прогресін бақылау
              </div>
            </button>
          </div>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={inputStyle}
              />
            </Field>

            <Field label="Құпиясөз">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Құпиясөзді енгізіңіз"
                style={inputStyle}
              />
            </Field>

            <button type="submit" style={primaryButton(!canLogin || loading)}>
              {loading ? 'Кіріп жатыр...' : 'Кіру'}
            </button>
          </form>

          <div
            style={{
              marginTop: '20px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#64748B',
            }}
          >
            Аккаунтыңыз жоқ па?{' '}
            <a
              href="/register"
              style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none' }}
            >
              Тіркелу
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function Glow({
  x,
  y,
  size,
  opacity,
}: {
  x: string
  y: string
  size: number
  opacity: number
}) {
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        borderRadius: '999px',
        background: `rgba(56,189,248,${opacity})`,
        filter: 'blur(40px)',
        transform: 'translate(-50%, -50%)',
      }}
    />
  )
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '10px 14px',
        borderRadius: '999px',
        background: '#E0F2FE',
        color: '#0369A1',
        fontSize: '12px',
        fontWeight: 800,
        marginBottom: '14px',
      }}
    >
      {children}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '13px',
          fontWeight: 800,
          color: '#334155',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  fontSize: '14px',
  color: '#0F172A',
  background: '#FFFFFF',
  boxShadow: '0 4px 10px rgba(15,23,42,0.02) inset',
}

function primaryButton(disabled: boolean): React.CSSProperties {
  return {
    padding: '14px 22px',
    borderRadius: '16px',
    border: 'none',
    background: disabled
      ? 'linear-gradient(135deg, #BAE6FD, #7DD3FC)'
      : 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
    color: '#FFFFFF',
    fontSize: '14px',
    fontWeight: 800,
    cursor: disabled ? 'not-allowed' : 'pointer',
    boxShadow: disabled ? 'none' : '0 16px 32px rgba(14,165,233,0.24)',
    opacity: disabled ? 0.72 : 1,
  }
}

function tabButton(active: boolean): React.CSSProperties {
  return {
    border: 'none',
    borderRadius: '16px',
    padding: '16px',
    background: active
      ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)'
      : 'transparent',
    color: active ? '#FFFFFF' : '#0F172A',
    textAlign: 'left',
    cursor: 'pointer',
    boxShadow: active ? '0 14px 24px rgba(14,165,233,0.18)' : 'none',
  }
}