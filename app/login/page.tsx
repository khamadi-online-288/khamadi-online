'use client'

import { useState } from 'react'
import AuthQuotePanel from '@/components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
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
        email: email.trim(),
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

      const { data: profileRows, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .limit(1)

      if (profileError || !profileRows || profileRows.length === 0) {
        alert('Профиль табылмады')
        return
      }

      const profile = profileRows[0]

      if (profile.role !== 'student') {
        alert('Бұл аккаунт оқушы ретінде тіркелмеген')
        await supabase.auth.signOut()
        return
      }

      window.location.href = '/dashboard'
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
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '560px',
            background: 'rgba(255,255,255,0.82)',
            border: '1px solid rgba(226,232,240,0.95)',
            borderRadius: '34px',
            padding: '28px',
            boxShadow: '0 30px 70px rgba(15,23,42,0.08)',
            backdropFilter: 'blur(18px)',
          }}
        >
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
            ОҚУШЫ КІРУІ
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '8px',
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
            Жеке оқу аккаунтымен кіріп, дайындықты жалғастырыңыз.
          </p>

          <form
            onSubmit={handleLogin}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@gmail.com"
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
              {loading ? 'Кіріп жатыр...' : 'Оқушы ретінде кіру'}
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

          <div
            style={{
              marginTop: '10px',
              textAlign: 'center',
              fontSize: '14px',
              color: '#64748B',
            }}
          >
            Ата-анасыз ба?{' '}
            <a
              href="/parent/login"
              style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none' }}
            >
              Ата-ана кіруі
            </a>
          </div>
        </div>
      </div>
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
    opacity: disabled ? 0.72 : 1,
  }
}