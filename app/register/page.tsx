'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import AuthQuotePanel from '../../components/AuthQuotePanel'
import { supabase } from '@/lib/supabase'

type RegisterRole = 'student' | 'parent'

const cities = [
  'Алматы','Астана','Шымкент','Абай облысы','Ақмола облысы','Ақтөбе облысы',
  'Алматы облысы','Атырау облысы','Батыс Қазақстан облысы','Жамбыл облысы',
  'Жетісу облысы','Қарағанды облысы','Қостанай облысы','Қызылорда облысы',
  'Маңғыстау облысы','Павлодар облысы','Солтүстік Қазақстан облысы',
  'Түркістан облысы','Ұлытау облысы','Шығыс Қазақстан облысы',
]

const profileCombinations = [
  { label: 'Биология – Химия',                     subject1: 'Биология',        subject2: 'Химия' },
  { label: 'Математика – Физика',                   subject1: 'Математика',      subject2: 'Физика' },
  { label: 'Математика – Информатика',              subject1: 'Математика',      subject2: 'Информатика' },
  { label: 'Шет тілі – Дүниежүзі тарихы',          subject1: 'Шет тілі',        subject2: 'Дүниежүзі тарихы' },
  { label: 'Биология – География',                  subject1: 'Биология',        subject2: 'География' },
  { label: 'Математика – География',                subject1: 'Математика',      subject2: 'География' },
  { label: 'Дүниежүзі тарихы – Құқық негіздері',   subject1: 'Дүниежүзі тарихы',subject2: 'Құқық негіздері' },
  { label: 'Дүниежүзі тарихы – География',          subject1: 'Дүниежүзі тарихы',subject2: 'География' },
  { label: 'География – Шет тілі',                  subject1: 'География',       subject2: 'Шет тілі' },
  { label: 'Қазақ тілі – Қазақ әдебиеті',          subject1: 'Қазақ тілі',      subject2: 'Қазақ әдебиеті' },
  { label: 'Орыс тілі – Орыс әдебиеті',            subject1: 'Орыс тілі',       subject2: 'Орыс әдебиеті' },
  { label: 'Химия – Физика',                        subject1: 'Химия',           subject2: 'Физика' },
]

function generateStudentCode() {
  return `KHM-${Math.floor(100000 + Math.random() * 900000)}`
}

export default function RegisterPage() {
  const [role, setRole] = useState<RegisterRole>('student')
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

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

  const selectedCombo = useMemo(
    () => profileCombinations.find((c) => c.label === selectedComboLabel) || null,
    [selectedComboLabel]
  )

  const canGoStep2 = useMemo(
    () => Boolean(studentFullName.trim() && studentCity && studentGrade && studentLanguage && studentEmail.trim() && studentPassword.trim() && targetScore && examYear),
    [studentFullName, studentCity, studentGrade, studentLanguage, studentEmail, studentPassword, targetScore, examYear]
  )

  const canGoStep3 = Boolean(selectedCombo)
  const canSubmitStudent = canGoStep2 && canGoStep3 && agreed
  const canSubmitParent = Boolean(parentFullName.trim() && parentCity && parentEmail.trim() && parentPassword.trim() && studentCode.trim())

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitStudent || loading || !selectedCombo) return
    setError(null)

    try {
      setLoading(true)
      const studentCodeValue = generateStudentCode()

      const { data, error: authError } = await supabase.auth.signUp({ email: studentEmail, password: studentPassword })
      if (authError) { setError(authError.message); return }
      if (!data.user) { setError('Оқушы аккаунты жасалмады'); return }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id, role: 'student', full_name: studentFullName,
        city: studentCity, grade: Number(studentGrade), language: studentLanguage,
        email: studentEmail, target_score: targetScore, exam_year: Number(examYear),
        profile_subject_1: selectedCombo.subject1, profile_subject_2: selectedCombo.subject2,
        profile_combo: selectedCombo.label, student_code: studentCodeValue,
        approval_status: 'pending',
      })

      if (profileError) { setError(profileError.message); return }

      alert(`Тіркелу сәтті аяқталды. Ата-ана кодыңыз: ${studentCodeValue}`)
      window.location.href = '/login'
    } finally {
      setLoading(false)
    }
  }

  const handleParentRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!canSubmitParent || loading) return
    setError(null)

    try {
      setLoading(true)

      const { data: studentProfile, error: findError } = await supabase
        .from('profiles').select('id').eq('student_code', studentCode.trim()).eq('role', 'student').single()

      if (findError || !studentProfile) { setError('Оқушы коды қате немесе табылмады'); return }

      const { data, error: authError } = await supabase.auth.signUp({ email: parentEmail, password: parentPassword })
      if (authError) { setError(authError.message); return }
      if (!data.user) { setError('Ата-ана аккаунты жасалмады'); return }

      const { error: profileError } = await supabase.from('profiles').insert({
        id: data.user.id, role: 'parent', full_name: parentFullName, city: parentCity, email: parentEmail,
      })
      if (profileError) { setError(profileError.message); return }

      const { error: linkError } = await supabase.from('parent_student_links').insert({
        parent_id: data.user.id, student_id: studentProfile.id,
      })
      if (linkError) { setError(linkError.message); return }

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
        gridTemplateColumns: '1.05fr 0.95fr',
        background: 'linear-gradient(160deg, #f8fcff 0%, #ffffff 55%, #f0f9ff 100%)',
      }}
    >
      <AuthQuotePanel />

      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '32px 28px', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '-5%', top: '5%', width: 260, height: 260, borderRadius: 999, background: 'rgba(56,189,248,0.14)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', left: '5%', bottom: '8%', width: 220, height: 220, borderRadius: 999, background: 'rgba(14,165,233,0.10)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <motion.div
          initial={{ opacity: 0, y: 28, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'relative', zIndex: 2, width: '100%', maxWidth: 580,
            background: 'rgba(255,255,255,0.88)', border: '1px solid rgba(14,165,233,0.15)',
            borderRadius: 32, padding: '32px 28px',
            boxShadow: '0 32px 80px rgba(14,165,233,0.10), 0 0 0 1px rgba(255,255,255,0.5) inset',
            backdropFilter: 'blur(20px)',
          }}
        >
          <div style={{ display: 'inline-flex', padding: '8px 16px', borderRadius: 999, background: 'rgba(224,242,254,0.9)', border: '1px solid rgba(14,165,233,0.18)', color: '#0369a1', fontSize: 12, fontWeight: 800, marginBottom: 16, letterSpacing: '0.4px' }}>
            ЖАҢА АККАУНТ
          </div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: '#0c4a6e', marginBottom: 8, letterSpacing: '-0.7px' }}>Тіркелу</h1>
          <p style={{ fontSize: 14, color: '#64748b', lineHeight: 1.75, marginBottom: 22 }}>
            Оқушы немесе ата-ана ретінде тіркеліп, KHAMADI ONLINE-ға қосылыңыз.
          </p>

          {/* Role tabs */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, background: 'rgba(248,250,252,0.95)', border: '1px solid rgba(14,165,233,0.12)', padding: '8px', borderRadius: 22, marginBottom: 22 }}>
            {(['student', 'parent'] as RegisterRole[]).map((r) => (
              <motion.button
                key={r}
                type="button"
                onClick={() => { setRole(r); setStep(1); setError(null) }}
                whileTap={{ scale: 0.97 }}
                style={{
                  border: 'none', borderRadius: 15, padding: '14px 16px',
                  background: role === r ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)' : 'transparent',
                  color: role === r ? '#ffffff' : '#64748b', textAlign: 'left', cursor: 'pointer',
                  boxShadow: role === r ? '0 10px 24px rgba(14,165,233,0.22)' : 'none',
                  transition: 'all 0.22s ease',
                }}
              >
                <div style={{ fontSize: 14, fontWeight: 800, marginBottom: 3 }}>{r === 'student' ? 'Оқушы' : 'Ата-ана'}</div>
                <div style={{ fontSize: 12, lineHeight: 1.5, opacity: 0.88 }}>
                  {r === 'student' ? 'ҰБТ логикасымен тіркелу' : 'Баланың коды арқылы қосылады'}
                </div>
              </motion.button>
            ))}
          </div>

          {role === 'student' ? (
            <>
              {/* Step indicators */}
              <div style={{ display: 'flex', gap: 10, marginBottom: 22 }}>
                {[{ n: 1, l: 'Жеке ақпарат' }, { n: 2, l: 'Пән таңдау' }, { n: 3, l: 'Растау' }].map((s) => {
                  const active = step === s.n
                  const passed = step > s.n
                  return (
                    <div key={s.n} style={{ flex: 1, padding: '10px 12px', borderRadius: 16, background: active ? 'linear-gradient(135deg, #e0f2fe, #f0f9ff)' : passed ? '#f0fdf4' : '#f8fafc', border: `1px solid ${active ? '#7dd3fc' : passed ? '#bbf7d0' : '#e2e8f0'}`, boxShadow: active ? '0 8px 20px rgba(14,165,233,0.10)' : 'none' }}>
                      <div style={{ fontSize: 11, fontWeight: 800, color: active ? '#0284c7' : passed ? '#15803d' : '#94a3b8', marginBottom: 3 }}>0{s.n}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#0c4a6e' }}>{s.l}</div>
                    </div>
                  )
                })}
              </div>

              <form onSubmit={handleStudentRegister}>
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                      <Field label="Аты-жөні">
                        <input value={studentFullName} onChange={(e) => setStudentFullName(e.target.value)} placeholder="Толық аты-жөніңіз" className="input-field" />
                      </Field>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label="Қала / облыс">
                          <select value={studentCity} onChange={(e) => setStudentCity(e.target.value)} className="input-field">
                            <option value="">Таңдаңыз</option>
                            {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </Field>
                        <Field label="Сынып">
                          <select value={studentGrade} onChange={(e) => setStudentGrade(e.target.value)} className="input-field">
                            <option value="">Таңдаңыз</option>
                            <option value="9">9 сынып</option>
                            <option value="10">10 сынып</option>
                            <option value="11">11 сынып</option>
                          </select>
                        </Field>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                        <Field label="Оқу тілі">
                          <select value={studentLanguage} onChange={(e) => setStudentLanguage(e.target.value)} className="input-field">
                            <option value="">Таңдаңыз</option>
                            <option value="Қазақша">Қазақша</option>
                            <option value="Орысша">Орысша</option>
                          </select>
                        </Field>
                        <Field label="Мақсатты балл">
                          <select value={targetScore} onChange={(e) => setTargetScore(e.target.value)} className="input-field">
                            <option value="">Таңдаңыз</option>
                            <option value="70+">70+</option>
                            <option value="90+">90+</option>
                            <option value="110+">110+</option>
                            <option value="120+">120+</option>
                          </select>
                        </Field>
                      </div>
                      <Field label="Email">
                        <input type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="example@gmail.com" className="input-field" />
                      </Field>
                      <Field label="Құпиясөз">
                        <input type="password" value={studentPassword} onChange={(e) => setStudentPassword(e.target.value)} placeholder="Құпиясөз енгізіңіз" className="input-field" />
                      </Field>
                      <Field label="ҰБТ тапсыратын жыл">
                        <select value={examYear} onChange={(e) => setExamYear(e.target.value)} className="input-field">
                          <option value="2026">2026</option>
                          <option value="2027">2027</option>
                          <option value="2028">2028</option>
                        </select>
                      </Field>
                      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <PrimaryBtn disabled={!canGoStep2} onClick={() => canGoStep2 && setStep(2)} type="button">Келесі қадам →</PrimaryBtn>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ padding: 18, borderRadius: 22, background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '1px solid rgba(14,165,233,0.18)' }}>
                        <div style={{ fontSize: 13, fontWeight: 800, color: '#0c4a6e', marginBottom: 10 }}>Міндетті пәндер</div>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                          {['Қазақстан тарихы', 'Оқу сауаттылығы', 'Математикалық сауаттылық'].map((s) => (
                            <div key={s} style={{ padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.18)', color: '#0369a1', fontSize: 12, fontWeight: 800 }}>{s}</div>
                          ))}
                        </div>
                      </div>

                      <div style={{ padding: 18, borderRadius: 22, background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)', boxShadow: '0 8px 24px rgba(14,165,233,0.06)' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 6 }}>Бейіндік пәндер комбинациясы</div>
                        <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 14 }}>ҰБТ-дағы ресми комбинациялар бойынша таңдаңыз.</p>
                        <Field label="Комбинация">
                          <select value={selectedComboLabel} onChange={(e) => setSelectedComboLabel(e.target.value)} className="input-field">
                            <option value="">Таңдаңыз</option>
                            {profileCombinations.map((c) => <option key={c.label} value={c.label}>{c.label}</option>)}
                          </select>
                        </Field>
                        {selectedCombo && (
                          <div style={{ marginTop: 14, padding: 14, borderRadius: 16, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)' }}>
                            <div style={{ fontSize: 12, fontWeight: 800, color: '#0c4a6e', marginBottom: 10 }}>Автоматты таңдалды:</div>
                            <div style={{ display: 'flex', gap: 10 }}>
                              {[selectedCombo.subject1, selectedCombo.subject2].map((s) => (
                                <div key={s} style={{ padding: '8px 14px', borderRadius: 999, background: 'linear-gradient(135deg, #dbeafe, #eff6ff)', color: '#1d4ed8', fontSize: 12, fontWeight: 800, border: '1px solid #bfdbfe' }}>{s}</div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <SecondaryBtn onClick={() => setStep(1)} type="button">← Артқа</SecondaryBtn>
                        <PrimaryBtn disabled={!canGoStep3} onClick={() => canGoStep3 && setStep(3)} type="button">Растау →</PrimaryBtn>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.3 }} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ padding: 18, borderRadius: 22, background: '#ffffff', border: '1px solid rgba(14,165,233,0.12)', boxShadow: '0 8px 24px rgba(14,165,233,0.06)' }}>
                        <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 16 }}>Мәліметтерді растау</div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                          {[
                            ['Аты-жөні', studentFullName], ['Қала', studentCity],
                            ['Сынып', `${studentGrade} сынып`], ['Тіл', studentLanguage],
                            ['Email', studentEmail], ['Мақсат', targetScore],
                            ['ҰБТ жылы', examYear], ['Пәндер', selectedCombo?.label || ''],
                          ].map(([label, value]) => (
                            <div key={label} style={{ padding: 12, borderRadius: 14, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.10)' }}>
                              <div style={{ fontSize: 11, color: '#64748b', fontWeight: 700, marginBottom: 4 }}>{label}</div>
                              <div style={{ fontSize: 13, color: '#0c4a6e', fontWeight: 700, lineHeight: 1.5, wordBreak: 'break-all' }}>{value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 12, padding: '14px 16px', borderRadius: 16, background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)', cursor: 'pointer' }}>
                        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} style={{ marginTop: 3, accentColor: '#0ea5e9' }} />
                        <span style={{ fontSize: 13, color: '#475569', lineHeight: 1.7 }}>
                          Мен бейіндік пәндер комбинациясының кейін өзгертілмейтінін түсінемін.
                        </span>
                      </label>

                      <AnimatePresence>
                        {error && (
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                            style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(254,242,242,0.9)', border: '1px solid rgba(252,165,165,0.5)', color: '#dc2626', fontSize: 13, fontWeight: 700 }}>
                            {error}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
                        <SecondaryBtn onClick={() => setStep(2)} type="button">← Артқа</SecondaryBtn>
                        <PrimaryBtn disabled={!canSubmitStudent || loading} type="submit">
                          {loading ? 'Тіркелуде...' : 'Тіркелу'}
                        </PrimaryBtn>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              onSubmit={handleParentRegister}
              style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
            >
              <div style={{ padding: 16, borderRadius: 20, background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)', border: '1px solid rgba(14,165,233,0.18)' }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#0c4a6e', marginBottom: 6 }}>Ата-ана тіркелуі</div>
                <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7 }}>Баланың жеке кодын енгізіп, соның аккаунтына байланысасыз.</p>
              </div>

              <Field label="Аты-жөні">
                <input value={parentFullName} onChange={(e) => setParentFullName(e.target.value)} placeholder="Ата-ананың аты-жөні" className="input-field" />
              </Field>
              <Field label="Қала / облыс">
                <select value={parentCity} onChange={(e) => setParentCity(e.target.value)} className="input-field">
                  <option value="">Таңдаңыз</option>
                  {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </Field>
              <Field label="Email">
                <input type="email" value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="example@gmail.com" className="input-field" />
              </Field>
              <Field label="Құпиясөз">
                <input type="password" value={parentPassword} onChange={(e) => setParentPassword(e.target.value)} placeholder="Құпиясөз енгізіңіз" className="input-field" />
              </Field>
              <Field label="Баланың коды">
                <input value={studentCode} onChange={(e) => setStudentCode(e.target.value)} placeholder="Мысалы: KHM-482193" className="input-field" />
              </Field>

              <AnimatePresence>
                {error && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                    style={{ padding: '12px 16px', borderRadius: 14, background: 'rgba(254,242,242,0.9)', border: '1px solid rgba(252,165,165,0.5)', color: '#dc2626', fontSize: 13, fontWeight: 700 }}>
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <PrimaryBtn disabled={!canSubmitParent || loading} type="submit">
                {loading ? 'Тіркелуде...' : 'Тіркелу'}
              </PrimaryBtn>
            </motion.form>
          )}

          <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: '#64748b' }}>
            Аккаунтыңыз бар ма?{' '}
            <a href="/login" style={{ color: '#0284c7', fontWeight: 800, textDecoration: 'none' }}>Кіру</a>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8, fontSize: 13, fontWeight: 800, color: '#334155' }}>{label}</label>
      {children}
    </div>
  )
}

function PrimaryBtn({ disabled, onClick, type, children }: { disabled?: boolean; onClick?: () => void; type?: 'button' | 'submit'; children: React.ReactNode }) {
  return (
    <motion.button
      type={type || 'button'}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.03, boxShadow: '0 16px 36px rgba(14,165,233,0.30)' } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      style={{
        padding: '13px 22px', borderRadius: 16, border: 'none',
        background: disabled ? 'linear-gradient(135deg, #bae6fd, #7dd3fc)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
        color: '#ffffff', fontSize: 14, fontWeight: 800,
        cursor: disabled ? 'not-allowed' : 'pointer',
        boxShadow: disabled ? 'none' : '0 12px 28px rgba(14,165,233,0.26)',
        opacity: disabled ? 0.72 : 1, letterSpacing: '-0.01em',
      }}
    >
      {children}
    </motion.button>
  )
}

function SecondaryBtn({ onClick, type, children }: { onClick?: () => void; type?: 'button' | 'submit'; children: React.ReactNode }) {
  return (
    <motion.button
      type={type || 'button'}
      onClick={onClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        padding: '13px 20px', borderRadius: 16, border: '1.5px solid rgba(14,165,233,0.20)',
        background: '#ffffff', color: '#0c4a6e', fontSize: 14, fontWeight: 800, cursor: 'pointer',
        letterSpacing: '-0.01em',
      }}
    >
      {children}
    </motion.button>
  )
}
