'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

type Role = 'student' | 'teacher'
type StudentPurpose = 'accounting' | 'computer_science' | 'hospitality' | 'management' | 'finance_industry' | 'social_sciences' | 'law'

const STUDENT_PURPOSES: { value: StudentPurpose; icon: string; title: string; desc: string }[] = [
  { value: 'accounting',       icon: '🧾', title: 'Accounting',      desc: 'Бухгалтерия, отчётность, налоги и деловая документация.' },
  { value: 'computer_science', icon: '💻', title: 'Computer Science', desc: 'IT-лексика, документация, техническая коммуникация.' },
  { value: 'hospitality',      icon: '🏨', title: 'Hospitality',      desc: 'Английский для сервиса, туризма и работы с клиентами.' },
  { value: 'management',       icon: '📊', title: 'Management',       desc: 'Управление, деловая речь, рабочие встречи и лидерство.' },
  { value: 'finance_industry', icon: '💰', title: 'Finance Industry', desc: 'Финансы, рынки, отчёты и профильная терминология.' },
  { value: 'social_sciences',  icon: '🧠', title: 'Social Sciences',  desc: 'Гуманитарные дисциплины и академическая коммуникация.' },
  { value: 'law',              icon: '⚖️', title: 'Law',              desc: 'Юридическая лексика, formal English и документы.' },
]

export default function EnglishRegisterPage() {
  const router = useRouter()
  const [fullName,        setFullName]        = useState('')
  const [email,           setEmail]           = useState('')
  const [password,        setPassword]        = useState('')
  const [role,            setRole]            = useState<Role>('student')
  const [studentPurpose,  setStudentPurpose]  = useState<StudentPurpose>('accounting')
  const [loading,         setLoading]         = useState(false)
  const [error,           setError]           = useState('')
  const [done,            setDone]            = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (!fullName || !email || !password) { setError('Заполните все поля'); return }
    if (password.length < 6) { setError('Пароль минимум 6 символов'); return }

    setLoading(true)
    setError('')

    const supabase = createEnglishClient()

    try {
      // Try to create a new auth account
      const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({ email, password })

      let userId: string | null = null

      const alreadyExists =
        signUpErr?.message?.toLowerCase().includes('already registered') ||
        signUpErr?.message?.toLowerCase().includes('already exists') ||
        !signUpData.session

      if (signUpErr && !alreadyExists) {
        setError(signUpErr.message)
        return
      }

      if (signUpData.session) {
        // New account, session is active
        userId = signUpData.user?.id ?? null
      } else {
        // Account already exists — sign in to verify password and get user id
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({ email, password })
        if (signInErr || !signInData.user) {
          setError('Аккаунт с таким email уже существует. Введите правильный пароль.')
          return
        }
        userId = signInData.user.id
      }

      if (!userId) {
        setError('Не удалось определить пользователя.')
        return
      }

      // Check if English profile already exists
      const { data: existing } = await supabase
        .from('english_user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle()

      if (existing) {
        await supabase.auth.signOut()
        router.push('/english/login')
        return
      }

      // Create English platform profile
      const { error: insertErr } = await supabase.from('english_user_roles').insert({
        user_id:   userId,
        full_name: fullName,
        role,
        purpose:   role === 'student' ? studentPurpose : null,
      })

      if (insertErr) {
        setError(`Ошибка создания профиля: ${insertErr.message}`)
        return
      }

      // Mark profile as pending in profiles table
      await supabase.from('profiles').upsert({
        id:              userId,
        email:           email.trim().toLowerCase(),
        full_name:       fullName,
        status:          'pending',
        is_english_user: true,
      })

      // Notify all admins
      const { data: admins } = await supabase
        .from('english_user_roles')
        .select('user_id')
        .eq('role', 'admin')
      if (admins && admins.length > 0) {
        await supabase.from('english_notifications').insert(
          (admins as { user_id: string }[]).map(a => ({
            user_id: a.user_id,
            type:    'system',
            title:   'Новая заявка на регистрацию',
            body:    `${fullName} (${email.trim()}) ожидает одобрения`,
          }))
        )
      }

      await supabase.auth.signOut()
      setDone(true)
    } catch {
      setError('Ошибка регистрации. Попробуйте снова.')
    } finally {
      setLoading(false)
    }
  }

  if (done) return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg,#f8fcff 0%,#eef8ff 60%,#fff 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Montserrat, sans-serif', padding: 20 }}>
      <div style={{ background: '#fff', borderRadius: 28, padding: '52px 44px', maxWidth: 480, width: '100%', textAlign: 'center', boxShadow: '0 8px 40px rgba(14,165,233,0.10)', border: '1px solid rgba(14,165,233,0.10)' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>⏳</div>
        <div style={{ fontSize: 24, fontWeight: 900, color: '#0f172a', marginBottom: 12, letterSpacing: '-0.03em' }}>Заявка отправлена</div>
        <div style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, marginBottom: 36, fontWeight: 600 }}>
          Ваша заявка на доступ к платформе отправлена администратору.<br />
          После одобрения вы получите уведомление и сможете войти.<br />
          Обычно это занимает не более 24 часов.
        </div>
        <button onClick={() => router.push('/english')}
          style={{ padding: '14px 32px', borderRadius: 14, background: 'linear-gradient(135deg,#0ea5e9,#38bdf8)', color: '#fff', fontWeight: 800, fontSize: 15, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
          ← Вернуться на главную
        </button>
      </div>
    </div>
  )

  return (
    <div className="register-page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      <div className="grid-overlay" />

      <div className="register-shell">
        <div className="register-layout">
          <aside className="left-panel">
            <div className="brand-pill">🇬🇧 KHAMADI ENGLISH</div>
            <div className="left-kicker">Registration</div>
            <h1 className="hero-title">
              Создайте аккаунт<br /><span>и начните правильно</span>
            </h1>
            <p className="hero-text">
              Студент выбирает направление перед входом в платформу. Преподаватель просто создаёт аккаунт без лишних шагов.
            </p>
            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <div><div className="feature-title">Для студентов</div><div className="feature-text">Выбор направления ещё до входа в платформу.</div></div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👩‍🏫</div>
                <div><div className="feature-title">Для преподавателей</div><div className="feature-text">Без purpose и без лишней логики.</div></div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">🔐</div>
                <div><div className="feature-title">После регистрации</div><div className="feature-text">Сразу переход на страницу логина.</div></div>
              </div>
            </div>
            <div className="status-card">
              <div className="status-kicker">Сейчас выбрано</div>
              <div className="status-title">{role === 'student' ? 'Аккаунт студента' : 'Аккаунт преподавателя'}</div>
              <div className="status-text">
                {role === 'student'
                  ? 'Студент выбирает одно направление и после регистрации переходит на логин.'
                  : 'Преподаватель регистрируется без выбора направления и после этого переходит на логин.'}
              </div>
            </div>
          </aside>

          <section className="right-panel">
            <div className="form-header">
              <h2>Регистрация</h2>
              <p>Выберите роль и заполните данные</p>
            </div>

            <form onSubmit={handleRegister} className="form-stack">
              <div>
                <div className="section-label">Роль аккаунта</div>
                <div className="role-grid">
                  {(['student', 'teacher'] as Role[]).map(r => (
                    <button key={r} type="button" className={`role-card ${role === r ? 'active' : ''}`} onClick={() => setRole(r)}>
                      <div className="role-icon">{r === 'student' ? '🎓' : '👩‍🏫'}</div>
                      <div className="role-title">{r === 'student' ? 'Студент' : 'Преподаватель'}</div>
                      <div className="role-text">{r === 'student' ? 'Для обучения и прохождения направлений' : 'Для работы с учениками и обучением'}</div>
                    </button>
                  ))}
                </div>
              </div>

              {role === 'student' && (
                <div>
                  <div className="section-label">Выберите направление</div>
                  <div className="purpose-grid">
                    {STUDENT_PURPOSES.map(item => (
                      <button
                        key={item.value}
                        type="button"
                        className={`purpose-card ${studentPurpose === item.value ? 'active' : ''}`}
                        onClick={() => setStudentPurpose(item.value)}
                      >
                        <div className="purpose-icon">{item.icon}</div>
                        <div className="purpose-title">{item.title}</div>
                        <div className="purpose-text">{item.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="input-grid">
                <div>
                  <label className="field-label">Полное имя</label>
                  <input className="input-field" type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Введите имя" />
                </div>
                <div>
                  <label className="field-label">Email</label>
                  <input className="input-field" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Введите email" />
                </div>
              </div>

              <div>
                <label className="field-label">Пароль</label>
                <input className="input-field" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Минимум 6 символов" />
                <div className="field-hint">После регистрации вы перейдёте на страницу логина.</div>
              </div>

              {error && <div className="error-box">{error}</div>}

              <div className="cta-block">
                <div className="cta-copy">
                  <div className="cta-kicker">{role === 'student' ? 'Student registration' : 'Teacher registration'}</div>
                  <div className="cta-title">{role === 'student' ? 'Создать аккаунт студента' : 'Создать аккаунт преподавателя'}</div>
                  <div className="cta-text">{role === 'student' ? 'После регистрации студент попадёт на логин, а затем уже в платформу.' : 'После регистрации преподаватель попадёт на логин, а затем в свой кабинет.'}</div>
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? 'Создание...' : 'Зарегистрироваться →'}
                </button>
              </div>

              <div className="login-row">
                <span>Уже есть аккаунт?</span>
                <button type="button" onClick={() => router.push('/english/login')}>Войти</button>
              </div>
            </form>
          </section>
        </div>

        <div className="back-row">
          <button onClick={() => router.push('/english')}>← На главную KHAMADI English</button>
        </div>
      </div>

      <style>{`
        .register-page { min-height: 100vh; background: linear-gradient(180deg,#f8fcff 0%,#eef8ff 48%,#ffffff 100%); padding: 28px 20px; position: relative; overflow: hidden; }
        .bg-orb { position: absolute; border-radius: 999px; filter: blur(100px); pointer-events: none; z-index: 0; }
        .orb-1 { width: 320px; height: 320px; background: rgba(56,189,248,0.18); top: 60px; left: -80px; }
        .orb-2 { width: 360px; height: 360px; background: rgba(14,165,233,0.14); top: 140px; right: -100px; }
        .orb-3 { width: 240px; height: 240px; background: rgba(125,211,252,0.18); bottom: 80px; left: 22%; }
        .grid-overlay { position: absolute; inset: 0; background-image: linear-gradient(rgba(14,165,233,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(14,165,233,0.04) 1px,transparent 1px); background-size: 62px 62px; mask-image: linear-gradient(to bottom,rgba(0,0,0,0.7),transparent 92%); pointer-events: none; z-index: 0; }
        .register-shell { width: 100%; max-width: 1180px; margin: 0 auto; position: relative; z-index: 2; }
        .register-layout { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 26px; align-items: stretch; }
        .left-panel, .right-panel { position: relative; overflow: hidden; border-radius: 32px; background: rgba(255,255,255,0.82); border: 1px solid rgba(14,165,233,0.12); box-shadow: 0 18px 44px rgba(14,165,233,0.08); backdrop-filter: blur(18px); }
        .left-panel { padding: 34px; }
        .right-panel { padding: 30px; }
        .brand-pill { display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px; border-radius: 999px; background: rgba(56,189,248,0.10); border: 1px solid rgba(14,165,233,0.14); color: #0369a1; font-size: 12px; font-weight: 800; letter-spacing: 0.08em; text-transform: uppercase; box-shadow: 0 8px 24px rgba(14,165,233,0.08); }
        .left-kicker { font-size: 13px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.14em; text-transform: uppercase; margin: 20px 0 12px; }
        .hero-title { font-size: clamp(34px,4vw,56px); line-height: 1.02; letter-spacing: -0.06em; color: #0f172a; font-weight: 900; margin: 0 0 16px; max-width: 560px; }
        .hero-title span { background: linear-gradient(135deg,#0f172a 0%,#0ea5e9 46%,#38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-text { font-size: 16px; line-height: 1.85; color: #64748b; font-weight: 600; max-width: 560px; margin: 0 0 26px; }
        .feature-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }
        .feature-item { padding: 18px; border-radius: 24px; background: rgba(255,255,255,0.72); border: 1px solid rgba(14,165,233,0.10); display: flex; align-items: flex-start; gap: 12px; }
        .feature-icon { width: 42px; height: 42px; border-radius: 14px; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .feature-title { font-size: 14px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
        .feature-text { font-size: 12px; line-height: 1.7; color: #64748b; font-weight: 600; }
        .status-card { margin-top: 8px; padding: 20px; border-radius: 24px; background: linear-gradient(135deg,rgba(56,189,248,0.12),rgba(255,255,255,0.78)); border: 1px solid rgba(14,165,233,0.14); }
        .status-kicker { font-size: 11px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .status-title { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
        .status-text { font-size: 14px; line-height: 1.75; color: #64748b; font-weight: 600; }
        .form-header { margin-bottom: 20px; }
        .form-header h2 { font-size: 32px; line-height: 1.05; letter-spacing: -0.05em; font-weight: 900; color: #0f172a; margin: 0 0 10px; }
        .form-header p { margin: 0; color: #64748b; font-size: 15px; font-weight: 600; line-height: 1.7; }
        .form-stack { display: flex; flex-direction: column; gap: 22px; }
        .section-label { font-size: 12px; font-weight: 900; color: #64748b; letter-spacing: 0.10em; text-transform: uppercase; margin-bottom: 12px; }
        .role-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .role-card { text-align: left; padding: 18px; border-radius: 24px; border: 1.5px solid rgba(14,165,233,0.12); background: rgba(255,255,255,0.78); cursor: pointer; transition: all .22s ease; }
        .role-card:hover { transform: translateY(-3px); border-color: rgba(14,165,233,0.18); box-shadow: 0 14px 28px rgba(14,165,233,0.08); }
        .role-card.active { border: 2px solid #0ea5e9; background: linear-gradient(135deg,rgba(56,189,248,0.10),rgba(255,255,255,0.92)); box-shadow: 0 16px 30px rgba(14,165,233,0.12); }
        .role-icon { width: 50px; height: 50px; border-radius: 16px; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 24px; margin-bottom: 12px; }
        .role-title { font-size: 16px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
        .role-text { font-size: 12px; line-height: 1.7; color: #64748b; font-weight: 600; }
        .purpose-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: 12px; }
        .purpose-card { text-align: left; padding: 16px; border-radius: 22px; border: 1.5px solid rgba(14,165,233,0.10); background: rgba(255,255,255,0.78); cursor: pointer; transition: all .22s ease; min-height: 148px; }
        .purpose-card:hover { transform: translateY(-3px); border-color: rgba(14,165,233,0.18); box-shadow: 0 12px 24px rgba(14,165,233,0.08); }
        .purpose-card.active { border: 2px solid #0ea5e9; background: linear-gradient(135deg,rgba(56,189,248,0.10),rgba(255,255,255,0.94)); box-shadow: 0 16px 28px rgba(14,165,233,0.10); }
        .purpose-icon { font-size: 24px; margin-bottom: 10px; }
        .purpose-title { font-size: 14px; font-weight: 900; color: #0f172a; margin-bottom: 6px; line-height: 1.3; }
        .purpose-text { font-size: 12px; line-height: 1.65; color: #64748b; font-weight: 600; }
        .input-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .field-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .input-field { width: 100%; min-height: 52px; border-radius: 16px; border: 1.5px solid rgba(14,165,233,0.12); background: rgba(255,255,255,0.88); padding: 0 16px; font-size: 15px; font-weight: 600; color: #0f172a; outline: none; transition: all .22s ease; box-sizing: border-box; }
        .input-field::placeholder { color: #94a3b8; }
        .input-field:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); background: #ffffff; }
        .field-hint { margin-top: 8px; font-size: 12px; color: #64748b; font-weight: 600; }
        .error-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20); border-radius: 16px; padding: 14px 16px; font-size: 13px; color: #dc2626; font-weight: 700; }
        .cta-block { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-radius: 24px; padding: 18px 18px 18px 20px; background: linear-gradient(135deg,rgba(56,189,248,0.12),rgba(255,255,255,0.94)); border: 1px solid rgba(14,165,233,0.14); box-shadow: 0 16px 34px rgba(14,165,233,0.08); }
        .cta-copy { flex: 1; min-width: 0; }
        .cta-kicker { font-size: 11px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
        .cta-title { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 4px; line-height: 1.2; }
        .cta-text { font-size: 13px; color: #64748b; line-height: 1.65; font-weight: 600; }
        .submit-button { min-width: 240px; min-height: 58px; border: none; border-radius: 18px; background: linear-gradient(135deg,#0ea5e9,#38bdf8); color: #fff; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 16px 34px rgba(14,165,233,0.18); transition: all .22s ease; padding: 0 20px; }
        .submit-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 38px rgba(14,165,233,0.24); }
        .submit-button:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-row { text-align: center; margin-top: 2px; font-size: 14px; }
        .login-row span { color: #64748b; font-weight: 600; }
        .login-row button { color: #0ea5e9; font-weight: 800; background: none; border: none; cursor: pointer; font-size: 14px; margin-left: 6px; }
        .back-row { text-align: center; margin-top: 22px; }
        .back-row button { color: #64748b; font-weight: 700; background: none; border: none; cursor: pointer; font-size: 13px; }
        @media (max-width: 1024px) { .register-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 760px) {
          .role-grid, .purpose-grid, .input-grid { grid-template-columns: 1fr !important; }
          .cta-block { flex-direction: column; align-items: stretch; }
          .submit-button { width: 100%; min-width: 100%; }
          .left-panel, .right-panel { padding: 22px; }
        }
      `}</style>
    </div>
  )
}
