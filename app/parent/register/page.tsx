'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import AuthQuotePanel from '@/components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

export default function ParentRegisterPage() {
  const router = useRouter()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [loading, setLoading] = useState(false)

  const canSubmit = Boolean(
    fullName.trim() &&
      email.trim() &&
      password.trim() &&
      studentCode.trim()
  )

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmit || loading) return

    try {
      setLoading(true)

      const code = studentCode.trim().toUpperCase()

      const { data: studentRows, error: studentError } = await supabase
        .from('profiles')
        .select('id, full_name, student_code, role')
        .eq('student_code', code)
        .eq('role', 'student')
        .limit(1)

      if (studentError || !studentRows || studentRows.length === 0) {
        alert('Мұндай оқушы коды табылмады')
        return
      }

      const student = studentRows[0]

      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
      })

      if (signUpError) {
        alert(signUpError.message)
        return
      }

      const parentUser = signUpData.user

      if (!parentUser) {
        alert('Ата-ана аккаунты құрылмады')
        return
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: parentUser.id,
          full_name: fullName.trim(),
          role: 'parent',
        })

      if (profileError) {
        alert(profileError.message)
        return
      }

      const { data: existingLinks } = await supabase
        .from('parent_links')
        .select('id')
        .eq('parent_id', parentUser.id)
        .eq('student_id', student.id)
        .limit(1)

      if (!existingLinks || existingLinks.length === 0) {
        const { error: linkError } = await supabase
          .from('parent_links')
          .insert({
            parent_id: parentUser.id,
            student_id: student.id,
            student_code: student.student_code,
          })

        if (linkError) {
          alert(linkError.message)
          return
        }
      }

      alert('Ата-ана аккаунты сәтті тіркелді')
      window.location.href = '/parent/login'
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
            АТА-АНА ТІРКЕЛУІ
          </div>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '8px',
            }}
          >
            Ата-ана аккаунтын ашу
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: '22px',
            }}
          >
            Email, құпиясөз және балаңыздың жеке кодын енгізіп тіркеліңіз.
          </p>

          <form
            onSubmit={handleRegister}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            <Field label="Аты-жөні">
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Аты-жөніңіз"
                style={inputStyle}
              />
            </Field>

            <Field label="Email">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="parent@gmail.com"
                style={inputStyle}
              />
            </Field>

            <Field label="Құпиясөз">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Құпиясөз ойластырыңыз"
                style={inputStyle}
              />
            </Field>

            <Field label="Баланың коды">
              <input
                type="text"
                value={studentCode}
                onChange={(e) => setStudentCode(e.target.value)}
                placeholder="KHM-256957"
                style={inputStyle}
              />
            </Field>

            <button type="submit" style={primaryButton(!canSubmit || loading)}>
              {loading ? 'Тіркеліп жатыр...' : 'Ата-ана ретінде тіркелу'}
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
            Аккаунтыңыз бар ма?{' '}
            <a
              href="/parent/login"
              style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none' }}
            >
              Кіру
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
            Оқушы тіркелуі керек пе?{' '}
            <a
              href="/register"
              style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none' }}
            >
              Оқушы тіркелуі
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