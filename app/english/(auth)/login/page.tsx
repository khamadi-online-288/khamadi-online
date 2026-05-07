'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useLanguage } from '@/app/english/context/LanguageContext'
import { LanguageSwitcher } from '@/app/english/components/LanguageSwitcher'

export default function EnglishLoginPage() {
  const router = useRouter()
  const { t } = useLanguage()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [noProfile, setNoProfile] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      setError(t.auth.fill_all)
      return
    }

    setLoading(true)
    setError('')
    setNoProfile(false)

    const supabase = createEnglishClient()

    try {
      const { data, error: authErr } = await supabase.auth.signInWithPassword({ email, password })

      if (authErr) {
        setError(t.auth.wrong_credentials)
        return
      }

      const userId = data.user?.id
      if (!userId) { setError(t.auth.wrong_credentials); return }

      const { data: roleData } = await supabase
        .from('english_user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .maybeSingle()

      if (!roleData) {
        await supabase.auth.signOut()
        setNoProfile(true)
        return
      }

      const role   = (roleData as { role: string; status: string | null }).role
      const status = (roleData as { role: string; status: string | null }).status

      if (status === 'pending') {
        await supabase.auth.signOut()
        window.location.href = '/english/pending'
        return
      }
      if (status === 'rejected') {
        await supabase.auth.signOut()
        window.location.href = '/english/rejected'
        return
      }

      const dest = role === 'admin'   ? '/english/admin'
        : role === 'teacher'  ? '/english/teacher'
        : role === 'support'  ? '/english/support-agent'
        : role === 'curator'  ? '/english/curator'
        : '/english/dashboard'
      window.location.href = dest
    } catch {
      setError(t.common.error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="bg-orb orb-1" />
      <div className="bg-orb orb-2" />
      <div className="bg-orb orb-3" />
      <div className="grid-overlay" />

      <div className="login-shell">
        <div className="login-layout">
          <aside className="left-panel">
            <div className="brand-pill">🇬🇧 KHAMADI ENGLISH</div>

            <div className="left-kicker">Login flow</div>

            <h1 className="hero-title">
              {t.auth.welcome_back}
              <br />
              <span>{t.auth.welcome_back_line2}</span>
            </h1>

            <p className="hero-text">
              {t.auth.sign_in_cta_desc}
            </p>

            <div className="feature-list">
              <div className="feature-item">
                <div className="feature-icon">🎓</div>
                <div>
                  <div className="feature-title">{t.auth.student}</div>
                  <div className="feature-text">{t.auth.student_desc}</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">👩‍🏫</div>
                <div>
                  <div className="feature-title">{t.auth.teacher}</div>
                  <div className="feature-text">{t.auth.teacher_desc}</div>
                </div>
              </div>
              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div>
                  <div className="feature-title">{t.auth.auto_redirect}</div>
                  <div className="feature-text">{t.auth.auto_redirect_desc}</div>
                </div>
              </div>
            </div>

            <div className="status-card">
              <div className="status-kicker">{t.auth.after_login}</div>
              <div className="status-title">{t.auth.system_redirects}</div>
              <div className="status-text">
                {t.auth.sign_in_cta_desc}
              </div>
            </div>
          </aside>

          <section className="right-panel">
            <div className="form-header">
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20 }}>
                <div>
                  <h2>{t.auth.login_title}</h2>
                  <p>{t.auth.login_subtitle}</p>
                </div>
                <LanguageSwitcher variant="light" />
              </div>
            </div>

            <form onSubmit={handleLogin} className="form-stack">
              <div>
                <label className="field-label">{t.auth.email}</label>
                <input
                  className="input-field"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder={t.auth.enter_email}
                />
              </div>

              <div>
                <label className="field-label">{t.auth.password}</label>
                <input
                  className="input-field"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t.auth.enter_password}
                />
              </div>

              {noProfile && (
                <div className="error-box" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <span>{t.auth.register_title} — {t.auth.register_subtitle}</span>
                  <button
                    type="button"
                    onClick={() => router.push('/english/register')}
                    style={{ alignSelf: 'flex-start', padding: '8px 16px', borderRadius: 10, background: '#0ea5e9', color: '#fff', border: 'none', fontSize: 13, fontWeight: 800, cursor: 'pointer' }}
                  >
                    {t.auth.register_link} →
                  </button>
                </div>
              )}
              {error && !noProfile && <div className="error-box">{error}</div>}

              <div className="cta-block">
                <div className="cta-copy">
                  <div className="cta-kicker">{t.auth.auth_kicker}</div>
                  <div className="cta-title">{t.auth.sign_in_cta}</div>
                  <div className="cta-text">{t.auth.sign_in_cta_desc}</div>
                </div>
                <button type="submit" disabled={loading} className="submit-button">
                  {loading ? t.auth.signing_in : t.auth.sign_in}
                </button>
              </div>

              <div className="login-row">
                <span>{t.auth.no_account}</span>
                <button type="button" onClick={() => router.push('/english/register')}>
                  {t.auth.register_link}
                </button>
              </div>
            </form>
          </section>
        </div>

        <div className="back-row">
          <button onClick={() => router.push('/english')}>{t.auth.back_home}</button>
        </div>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          background: linear-gradient(180deg, #f8fcff 0%, #eef8ff 48%, #ffffff 100%);
          padding: 28px 20px;
          position: relative;
          overflow: hidden;
        }
        .bg-orb { position: absolute; border-radius: 999px; filter: blur(100px); pointer-events: none; z-index: 0; }
        .orb-1 { width: 320px; height: 320px; background: rgba(56,189,248,0.18); top: 60px; left: -80px; }
        .orb-2 { width: 360px; height: 360px; background: rgba(14,165,233,0.14); top: 140px; right: -100px; }
        .orb-3 { width: 240px; height: 240px; background: rgba(125,211,252,0.18); bottom: 80px; left: 22%; }
        .grid-overlay {
          position: absolute; inset: 0;
          background-image: linear-gradient(rgba(14,165,233,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.04) 1px, transparent 1px);
          background-size: 62px 62px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.7), transparent 92%);
          pointer-events: none; z-index: 0;
        }
        .login-shell { width: 100%; max-width: 1120px; margin: 0 auto; position: relative; z-index: 2; }
        .login-layout { display: grid; grid-template-columns: 1.02fr 0.98fr; gap: 26px; align-items: stretch; }
        .left-panel, .right-panel {
          position: relative; overflow: hidden; border-radius: 32px;
          background: rgba(255,255,255,0.82); border: 1px solid rgba(14,165,233,0.12);
          box-shadow: 0 18px 44px rgba(14,165,233,0.08); backdrop-filter: blur(18px);
        }
        .left-panel { padding: 34px; }
        .right-panel { padding: 30px; display: flex; flex-direction: column; justify-content: center; }
        .brand-pill {
          display: inline-flex; align-items: center; gap: 8px; padding: 10px 16px;
          border-radius: 999px; background: rgba(56,189,248,0.10); border: 1px solid rgba(14,165,233,0.14);
          color: #0369a1; font-size: 12px; font-weight: 800; letter-spacing: 0.08em;
          text-transform: uppercase; box-shadow: 0 8px 24px rgba(14,165,233,0.08);
        }
        .left-kicker { font-size: 13px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.14em; text-transform: uppercase; margin: 20px 0 12px; }
        .hero-title { font-size: clamp(34px,4vw,56px); line-height: 1.02; letter-spacing: -0.06em; color: #0f172a; font-weight: 900; margin: 0 0 16px; max-width: 560px; }
        .hero-title span { background: linear-gradient(135deg, #0f172a 0%, #0ea5e9 46%, #38bdf8 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .hero-text { font-size: 16px; line-height: 1.85; color: #64748b; font-weight: 600; max-width: 560px; margin: 0 0 26px; }
        .feature-list { display: flex; flex-direction: column; gap: 14px; margin-bottom: 22px; }
        .feature-item { padding: 18px; border-radius: 24px; background: rgba(255,255,255,0.72); border: 1px solid rgba(14,165,233,0.10); display: flex; align-items: flex-start; gap: 12px; }
        .feature-icon { width: 42px; height: 42px; border-radius: 14px; background: rgba(56,189,248,0.12); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
        .feature-title { font-size: 14px; font-weight: 900; color: #0f172a; margin-bottom: 4px; }
        .feature-text { font-size: 12px; line-height: 1.7; color: #64748b; font-weight: 600; }
        .status-card { margin-top: 8px; padding: 20px; border-radius: 24px; background: linear-gradient(135deg, rgba(56,189,248,0.12), rgba(255,255,255,0.78)); border: 1px solid rgba(14,165,233,0.14); }
        .status-kicker { font-size: 11px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; }
        .status-title { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 6px; }
        .status-text { font-size: 14px; line-height: 1.75; color: #64748b; font-weight: 600; }
        .form-header { margin-bottom: 0; }
        .form-header h2 { font-size: 32px; line-height: 1.05; letter-spacing: -0.05em; font-weight: 900; color: #0f172a; margin: 0 0 10px; }
        .form-header p { margin: 0; color: #64748b; font-size: 15px; font-weight: 600; line-height: 1.7; }
        .form-stack { display: flex; flex-direction: column; gap: 22px; }
        .field-label { display: block; font-size: 12px; font-weight: 800; color: #64748b; letter-spacing: 0.06em; text-transform: uppercase; margin-bottom: 8px; }
        .input-field { width: 100%; min-height: 54px; border-radius: 16px; border: 1.5px solid rgba(14,165,233,0.12); background: rgba(255,255,255,0.88); padding: 0 16px; font-size: 15px; font-weight: 600; color: #0f172a; outline: none; transition: all .22s ease; box-sizing: border-box; }
        .input-field::placeholder { color: #94a3b8; }
        .input-field:focus { border-color: #0ea5e9; box-shadow: 0 0 0 4px rgba(14,165,233,0.10); background: #ffffff; }
        .error-box { background: rgba(239,68,68,0.07); border: 1px solid rgba(239,68,68,0.20); border-radius: 16px; padding: 14px 16px; font-size: 13px; color: #dc2626; font-weight: 700; }
        .cta-block { display: flex; align-items: center; justify-content: space-between; gap: 16px; border-radius: 24px; padding: 18px 18px 18px 20px; background: linear-gradient(135deg, rgba(56,189,248,0.12), rgba(255,255,255,0.94)); border: 1px solid rgba(14,165,233,0.14); box-shadow: 0 16px 34px rgba(14,165,233,0.08); }
        .cta-copy { flex: 1; min-width: 0; }
        .cta-kicker { font-size: 11px; font-weight: 900; color: #0ea5e9; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 6px; }
        .cta-title { font-size: 18px; font-weight: 900; color: #0f172a; margin-bottom: 4px; line-height: 1.2; }
        .cta-text { font-size: 13px; color: #64748b; line-height: 1.65; font-weight: 600; }
        .submit-button { min-width: 240px; min-height: 58px; border: none; border-radius: 18px; background: linear-gradient(135deg, #0ea5e9, #38bdf8); color: #fff; font-size: 15px; font-weight: 900; cursor: pointer; box-shadow: 0 16px 34px rgba(14,165,233,0.18); transition: all .22s ease; padding: 0 20px; }
        .submit-button:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 20px 38px rgba(14,165,233,0.24); }
        .submit-button:disabled { opacity: 0.65; cursor: not-allowed; }
        .login-row { text-align: center; margin-top: 2px; font-size: 14px; }
        .login-row span { color: #64748b; font-weight: 600; }
        .login-row button { color: #0ea5e9; font-weight: 800; background: none; border: none; cursor: pointer; font-size: 14px; margin-left: 6px; }
        .back-row { text-align: center; margin-top: 22px; }
        .back-row button { color: #64748b; font-weight: 700; background: none; border: none; cursor: pointer; font-size: 13px; }
        @media (max-width: 1024px) { .login-layout { grid-template-columns: 1fr !important; } }
        @media (max-width: 760px) {
          .cta-block { flex-direction: column; align-items: stretch; }
          .submit-button { width: 100%; min-width: 100%; }
          .left-panel, .right-panel { padding: 22px; }
        }
      `}</style>
    </div>
  )
}
