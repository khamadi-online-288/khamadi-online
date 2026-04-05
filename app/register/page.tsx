'use client'

import { useMemo, useState } from 'react'
import AuthQuotePanel from '../../components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

type RegisterRole = 'student' | 'parent'

const cities = [
  'Алматы',
  'Астана',
  'Шымкент',
  'Абай облысы',
  'Ақмола облысы',
  'Ақтөбе облысы',
  'Алматы облысы',
  'Атырау облысы',
  'Батыс Қазақстан облысы',
  'Жамбыл облысы',
  'Жетісу облысы',
  'Қарағанды облысы',
  'Қостанай облысы',
  'Қызылорда облысы',
  'Маңғыстау облысы',
  'Павлодар облысы',
  'Солтүстік Қазақстан облысы',
  'Түркістан облысы',
  'Ұлытау облысы',
  'Шығыс Қазақстан облысы',
]

const profileCombinations = [
  {
    label: 'Биология – Химия',
    subject1: 'Биология',
    subject2: 'Химия',
  },
  {
    label: 'Математика – Физика',
    subject1: 'Математика',
    subject2: 'Физика',
  },
  {
    label: 'Математика – Информатика',
    subject1: 'Математика',
    subject2: 'Информатика',
  },
  {
    label: 'Шет тілі – Дүниежүзі тарихы',
    subject1: 'Шет тілі',
    subject2: 'Дүниежүзі тарихы',
  },
  {
    label: 'Биология – География',
    subject1: 'Биология',
    subject2: 'География',
  },
  {
    label: 'Математика – География',
    subject1: 'Математика',
    subject2: 'География',
  },
  {
    label: 'Дүниежүзі тарихы – Құқық негіздері',
    subject1: 'Дүниежүзі тарихы',
    subject2: 'Құқық негіздері',
  },
  {
    label: 'Дүниежүзі тарихы – География',
    subject1: 'Дүниежүзі тарихы',
    subject2: 'География',
  },
  {
    label: 'География – Шет тілі',
    subject1: 'География',
    subject2: 'Шет тілі',
  },
  {
    label: 'Қазақ тілі – Қазақ әдебиеті',
    subject1: 'Қазақ тілі',
    subject2: 'Қазақ әдебиеті',
  },
  {
    label: 'Орыс тілі – Орыс әдебиеті',
    subject1: 'Орыс тілі',
    subject2: 'Орыс әдебиеті',
  },
  {
    label: 'Химия – Физика',
    subject1: 'Химия',
    subject2: 'Физика',
  },
]

function generateStudentCode() {
  const random = Math.floor(100000 + Math.random() * 900000)
  return `KHM-${random}`
}

export default function RegisterPage() {
  const [role, setRole] = useState<RegisterRole>('student')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)

  const [studentFullName, setStudentFullName] = useState('')
  const [studentCity, setStudentCity] = useState('')
  const [studentGrade, setStudentGrade] = useState('')
  const [studentLanguage, setStudentLanguage] = useState('')
  const [studentEmail, setStudentEmail] = useState('')
  const [studentPassword, setStudentPassword] = useState('')
  const [targetScore, setTargetScore] = useState('')
  const [examYear, setExamYear] = useState('2026')
  const [selectedComboLabel, setSelectedComboLabel] = useState('')
  const [agreed, setAgreed] = useState(false)

  const [parentFullName, setParentFullName] = useState('')
  const [parentCity, setParentCity] = useState('')
  const [parentEmail, setParentEmail] = useState('')
  const [parentPassword, setParentPassword] = useState('')
  const [studentCode, setStudentCode] = useState('')

  const selectedCombo = useMemo(() => {
    return (
      profileCombinations.find((combo) => combo.label === selectedComboLabel) || null
    )
  }, [selectedComboLabel])

  const canGoStep2 = useMemo(() => {
    return Boolean(
      studentFullName.trim() &&
        studentCity &&
        studentGrade &&
        studentLanguage &&
        studentEmail.trim() &&
        studentPassword.trim() &&
        targetScore &&
        examYear
    )
  }, [
    studentFullName,
    studentCity,
    studentGrade,
    studentLanguage,
    studentEmail,
    studentPassword,
    targetScore,
    examYear,
  ])

  const canGoStep3 = useMemo(() => {
    return Boolean(selectedCombo)
  }, [selectedCombo])

  const canSubmitStudent = canGoStep2 && canGoStep3 && agreed
  const canSubmitParent = Boolean(
    parentFullName.trim() &&
      parentCity &&
      parentEmail.trim() &&
      parentPassword.trim() &&
      studentCode.trim()
  )

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitStudent || loading || !selectedCombo) return

    try {
      setLoading(true)

      const studentCodeValue = generateStudentCode()

      const { data, error } = await supabase.auth.signUp({
        email: studentEmail,
        password: studentPassword,
      })

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user
      if (!user) {
        alert('Оқушы аккаунты жасалмады')
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        role: 'student',
        full_name: studentFullName,
        city: studentCity,
        grade: Number(studentGrade),
        language: studentLanguage,
        email: studentEmail,
        target_score: targetScore,
        exam_year: Number(examYear),
        profile_subject_1: selectedCombo.subject1,
        profile_subject_2: selectedCombo.subject2,
        profile_combo: selectedCombo.label,
        student_code: studentCodeValue,
      })

      if (profileError) {
        alert(profileError.message)
        return
      }

      alert(`Тіркелу сәтті аяқталды. Ата-ана кодыңыз: ${studentCodeValue}`)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const handleParentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitParent || loading) return

    try {
      setLoading(true)

      const { data: studentProfile, error: studentFindError } = await supabase
        .from('profiles')
        .select('id')
        .eq('student_code', studentCode.trim())
        .eq('role', 'student')
        .single()

      if (studentFindError || !studentProfile) {
        alert('Оқушы коды қате немесе табылмады')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email: parentEmail,
        password: parentPassword,
      })

      if (error) {
        alert(error.message)
        return
      }

      const user = data.user
      if (!user) {
        alert('Ата-ана аккаунты жасалмады')
        return
      }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: user.id,
        role: 'parent',
        full_name: parentFullName,
        city: parentCity,
        email: parentEmail,
      })

      if (profileError) {
        alert(profileError.message)
        return
      }

      const { error: linkError } = await supabase
        .from('parent_student_links')
        .insert({
          parent_id: user.id,
          student_id: studentProfile.id,
        })

      if (linkError) {
        alert(linkError.message)
        return
      }

      alert('Ата-ана аккаунты сәтті тіркелді')
      window.location.href = '/login'
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
        <Glow x="78%" y="12%" size={220} opacity={0.18} />
        <Glow x="10%" y="82%" size={260} opacity={0.12} />

        <div
          style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            maxWidth: '620px',
            background: 'rgba(255,255,255,0.78)',
            border: '1px solid rgba(226,232,240,0.95)',
            borderRadius: '34px',
            padding: '28px',
            boxShadow:
              '0 30px 70px rgba(15,23,42,0.08), 0 0 0 1px rgba(255,255,255,0.4) inset',
            backdropFilter: 'blur(18px)',
          }}
        >
          <Badge>ЖАҢА АККАУНТ</Badge>

          <h1
            style={{
              fontSize: '30px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '8px',
              letterSpacing: '-0.6px',
            }}
          >
            Тіркелу
          </h1>

          <p
            style={{
              fontSize: '14px',
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: '22px',
            }}
          >
            Оқушы немесе ата-ана ретінде тіркеліп, KHAMADI ONLINE платформасына
            қосылыңыз.
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
              onClick={() => {
                setRole('student')
                setStep(1)
              }}
              style={tabButton(role === 'student')}
            >
              <div style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>
                Оқушы
              </div>
              <div style={{ fontSize: '12px', lineHeight: 1.5, opacity: 0.9 }}>
                ҰБТ логикасымен тіркелу
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
                Баланың коды арқылы қосылады
              </div>
            </button>
          </div>

          {role === 'student' ? (
            <>
              <div
                style={{
                  display: 'flex',
                  gap: '10px',
                  marginBottom: '22px',
                  flexWrap: 'wrap',
                }}
              >
                {[
                  { number: 1, label: 'Жеке ақпарат' },
                  { number: 2, label: 'Пән таңдау' },
                  { number: 3, label: 'Растау' },
                ].map((item) => {
                  const active = step === item.number
                  const passed = step > item.number

                  return (
                    <div
                      key={item.number}
                      style={{
                        flex: 1,
                        minWidth: '120px',
                        padding: '12px 14px',
                        borderRadius: '18px',
                        background: active
                          ? 'linear-gradient(135deg, rgba(224,242,254,1), rgba(240,249,255,1))'
                          : passed
                          ? 'linear-gradient(135deg, rgba(240,253,244,1), rgba(248,250,252,1))'
                          : '#F8FAFC',
                        border: active
                          ? '1px solid #7DD3FC'
                          : passed
                          ? '1px solid #BBF7D0'
                          : '1px solid #E2E8F0',
                        boxShadow: active
                          ? '0 10px 24px rgba(14,165,233,0.08)'
                          : 'none',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '12px',
                          fontWeight: 800,
                          color: active ? '#0284C7' : passed ? '#15803D' : '#94A3B8',
                          marginBottom: '4px',
                        }}
                      >
                        0{item.number}
                      </div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0F172A' }}>
                        {item.label}
                      </div>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={handleStudentRegister}>
                {step === 1 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <Field label="Аты-жөні">
                      <input
                        value={studentFullName}
                        onChange={(e) => setStudentFullName(e.target.value)}
                        placeholder="Толық аты-жөніңіз"
                        style={inputStyle}
                      />
                    </Field>

                    <div style={twoCol}>
                      <Field label="Қала / облыс">
                        <select
                          value={studentCity}
                          onChange={(e) => setStudentCity(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Таңдаңыз</option>
                          {cities.map((city) => (
                            <option key={city} value={city}>
                              {city}
                            </option>
                          ))}
                        </select>
                      </Field>

                      <Field label="Сынып">
                        <select
                          value={studentGrade}
                          onChange={(e) => setStudentGrade(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Таңдаңыз</option>
                          <option value="9">9 сынып</option>
                          <option value="10">10 сынып</option>
                          <option value="11">11 сынып</option>
                        </select>
                      </Field>
                    </div>

                    <div style={twoCol}>
                      <Field label="Оқу тілі">
                        <select
                          value={studentLanguage}
                          onChange={(e) => setStudentLanguage(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Таңдаңыз</option>
                          <option value="Қазақша">Қазақша</option>
                          <option value="Орысша">Орысша</option>
                        </select>
                      </Field>

                      <Field label="Мақсатты балл">
                        <select
                          value={targetScore}
                          onChange={(e) => setTargetScore(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Таңдаңыз</option>
                          <option value="70+">70+</option>
                          <option value="90+">90+</option>
                          <option value="110+">110+</option>
                          <option value="120+">120+</option>
                        </select>
                      </Field>
                    </div>

                    <Field label="Email">
                      <input
                        type="email"
                        value={studentEmail}
                        onChange={(e) => setStudentEmail(e.target.value)}
                        placeholder="example@gmail.com"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Құпиясөз">
                      <input
                        type="password"
                        value={studentPassword}
                        onChange={(e) => setStudentPassword(e.target.value)}
                        placeholder="Құпиясөз енгізіңіз"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="ҰБТ тапсыратын жыл">
                      <select
                        value={examYear}
                        onChange={(e) => setExamYear(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="2026">2026</option>
                        <option value="2027">2027</option>
                        <option value="2028">2028</option>
                      </select>
                    </Field>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <div />
                      <button
                        type="button"
                        onClick={() => canGoStep2 && setStep(2)}
                        style={primaryButton(!canGoStep2)}
                      >
                        Келесі қадам
                      </button>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '24px',
                        background:
                          'linear-gradient(135deg, rgba(248,250,252,1), rgba(255,255,255,1))',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 12px 28px rgba(15,23,42,0.04)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '14px',
                          fontWeight: 800,
                          color: '#0F172A',
                          marginBottom: '10px',
                        }}
                      >
                        Міндетті пәндер
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        {[
                          'Қазақстан тарихы',
                          'Оқу сауаттылығы',
                          'Математикалық сауаттылық',
                        ].map((item) => (
                          <div key={item} style={lockedChip}>
                            {item}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '24px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 12px 28px rgba(15,23,42,0.04)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0F172A',
                          marginBottom: '8px',
                        }}
                      >
                        Бейіндік пәндер комбинациясы
                      </div>

                      <p
                        style={{
                          fontSize: '13px',
                          color: '#64748B',
                          lineHeight: 1.7,
                          marginBottom: '14px',
                        }}
                      >
                        ҰБТ-дағы ресми комбинациялар бойынша таңдаңыз. Таңдағаннан кейін
                        2 бейіндік пән автоматты түрде бекітіледі.
                      </p>

                      <Field label="Комбинация">
                        <select
                          value={selectedComboLabel}
                          onChange={(e) => setSelectedComboLabel(e.target.value)}
                          style={inputStyle}
                        >
                          <option value="">Таңдаңыз</option>
                          {profileCombinations.map((combo) => (
                            <option key={combo.label} value={combo.label}>
                              {combo.label}
                            </option>
                          ))}
                        </select>
                      </Field>

                      {selectedCombo && (
                        <div
                          style={{
                            marginTop: '14px',
                            padding: '16px',
                            borderRadius: '18px',
                            background: '#F8FAFC',
                            border: '1px solid #E2E8F0',
                          }}
                        >
                          <div
                            style={{
                              fontSize: '13px',
                              fontWeight: 800,
                              color: '#0F172A',
                              marginBottom: '10px',
                            }}
                          >
                            Автоматты түрде таңдалды:
                          </div>

                          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                            <div style={selectedChip}>{selectedCombo.subject1}</div>
                            <div style={selectedChip}>{selectedCombo.subject2}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <button type="button" onClick={() => setStep(1)} style={secondaryButton}>
                        Артқа
                      </button>

                      <button
                        type="button"
                        onClick={() => canGoStep3 && setStep(3)}
                        style={primaryButton(!canGoStep3)}
                      >
                        Растау
                      </button>
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div
                      style={{
                        padding: '18px',
                        borderRadius: '24px',
                        background: '#FFFFFF',
                        border: '1px solid #E2E8F0',
                        boxShadow: '0 12px 28px rgba(15,23,42,0.04)',
                      }}
                    >
                      <div
                        style={{
                          fontSize: '16px',
                          fontWeight: 800,
                          color: '#0F172A',
                          marginBottom: '14px',
                        }}
                      >
                        Мәліметтерді растау
                      </div>

                      <div style={summaryGrid}>
                        <SummaryItem label="Аты-жөні" value={studentFullName} />
                        <SummaryItem label="Қала / облыс" value={studentCity} />
                        <SummaryItem label="Сынып" value={`${studentGrade} сынып`} />
                        <SummaryItem label="Оқу тілі" value={studentLanguage} />
                        <SummaryItem label="Email" value={studentEmail} />
                        <SummaryItem label="Мақсатты балл" value={targetScore} />
                        <SummaryItem label="ҰБТ жылы" value={examYear} />
                        <SummaryItem
                          label="Бейіндік комбинация"
                          value={selectedCombo?.label || ''}
                        />
                      </div>
                    </div>

                    <label
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '10px',
                        padding: '16px',
                        borderRadius: '18px',
                        background: '#F8FAFC',
                        border: '1px solid #E2E8F0',
                        cursor: 'pointer',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={agreed}
                        onChange={(e) => setAgreed(e.target.checked)}
                        style={{ marginTop: '3px' }}
                      />
                      <span
                        style={{
                          fontSize: '13px',
                          color: '#475569',
                          lineHeight: 1.7,
                        }}
                      >
                        Мен бейіндік пәндер комбинациясының кейін өзгертілмейтінін түсінемін.
                      </span>
                    </label>

                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        gap: '12px',
                      }}
                    >
                      <button type="button" onClick={() => setStep(2)} style={secondaryButton}>
                        Артқа
                      </button>

                      <button type="submit" style={primaryButton(!canSubmitStudent || loading)}>
                        {loading ? 'Тіркелуде...' : 'Тіркелу'}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </>
          ) : (
            <form
              onSubmit={handleParentRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
            >
              <div
                style={{
                  padding: '18px',
                  borderRadius: '24px',
                  background:
                    'linear-gradient(135deg, rgba(248,250,252,1), rgba(255,255,255,1))',
                  border: '1px solid #E2E8F0',
                  boxShadow: '0 12px 28px rgba(15,23,42,0.04)',
                }}
              >
                <div
                  style={{
                    fontSize: '16px',
                    fontWeight: 800,
                    color: '#0F172A',
                    marginBottom: '8px',
                  }}
                >
                  Ата-ана тіркелуі
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#64748B',
                    lineHeight: 1.7,
                  }}
                >
                  Баланың жеке кодын енгізіп, соның аккаунтына байланысасыз.
                </p>
              </div>

              <Field label="Аты-жөні">
                <input
                  value={parentFullName}
                  onChange={(e) => setParentFullName(e.target.value)}
                  placeholder="Ата-ананың аты-жөні"
                  style={inputStyle}
                />
              </Field>

              <Field label="Қала / облыс">
                <select
                  value={parentCity}
                  onChange={(e) => setParentCity(e.target.value)}
                  style={inputStyle}
                >
                  <option value="">Таңдаңыз</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Email">
                <input
                  type="email"
                  value={parentEmail}
                  onChange={(e) => setParentEmail(e.target.value)}
                  placeholder="example@gmail.com"
                  style={inputStyle}
                />
              </Field>

              <Field label="Құпиясөз">
                <input
                  type="password"
                  value={parentPassword}
                  onChange={(e) => setParentPassword(e.target.value)}
                  placeholder="Құпиясөз енгізіңіз"
                  style={inputStyle}
                />
              </Field>

              <Field label="Баланың коды">
                <input
                  value={studentCode}
                  onChange={(e) => setStudentCode(e.target.value)}
                  placeholder="Мысалы: KHM-482193"
                  style={inputStyle}
                />
              </Field>

              <button type="submit" style={primaryButton(!canSubmitParent || loading)}>
                {loading ? 'Тіркелуде...' : 'Тіркелу'}
              </button>
            </form>
          )}

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
              href="/login"
              style={{ color: '#0284C7', fontWeight: 800, textDecoration: 'none' }}
            >
              Кіру
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

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        padding: '14px',
        borderRadius: '16px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
      }}
    >
      <div
        style={{
          fontSize: '12px',
          color: '#64748B',
          fontWeight: 700,
          marginBottom: '6px',
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '14px',
          color: '#0F172A',
          fontWeight: 700,
          lineHeight: 1.5,
        }}
      >
        {value}
      </div>
    </div>
  )
}

const twoCol: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
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

const lockedChip: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '999px',
  background: 'linear-gradient(135deg, #E0F2FE, #F0F9FF)',
  color: '#0369A1',
  fontSize: '13px',
  fontWeight: 800,
  border: '1px solid #BAE6FD',
}

const selectedChip: React.CSSProperties = {
  padding: '10px 14px',
  borderRadius: '999px',
  background: 'linear-gradient(135deg, #DBEAFE, #EFF6FF)',
  color: '#1D4ED8',
  fontSize: '13px',
  fontWeight: 800,
  border: '1px solid #BFDBFE',
}

const summaryGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '12px',
}

const secondaryButton: React.CSSProperties = {
  padding: '14px 20px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  background: '#FFFFFF',
  color: '#0F172A',
  fontSize: '14px',
  fontWeight: 800,
  cursor: 'pointer',
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