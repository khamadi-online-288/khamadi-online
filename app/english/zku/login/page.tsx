'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'

type Lang = 'ru' | 'kz' | 'en'

const BRAND = {
  ru: { logo: 'ЗКУ', name: 'ЗКУ им. М. Утемісова', sub: 'English Platform' },
  kz: { logo: 'БҚУ', name: 'МӨ атындағы БҚУ', sub: 'English Platform' },
  en: { logo: 'WKU', name: 'West Kazakhstan University', sub: 'English Platform' },
}

const T = {
  ru: {
    title:      'Войти в платформу',
    sub:        'ЗКУ им. М. Утемісова · English',
    email_label:'Email',
    email_ph:   'student@zku.kz',
    pass_label: 'Пароль',
    pass_ph:    '••••••••',
    btn:        'Войти',
    loading:    'Входим...',
    no_account: 'Нет аккаунта?',
    register:   'Зарегистрироваться',
    forgot:     'Забыли пароль?',
    err_empty:  'Заполните все поля',
    err_invalid:'Неверный email или пароль',
    err_confirm:'Подтвердите email перед входом',
    back:       'На главную',
    left_h:     'Добро пожаловать в языковую платформу',
    left_sub:   'Войдите и продолжите обучение',
    feat1:      '600 уроков A1–C1',
    feat2:      'Группы с преподавателями',
    feat3:      'Официальные сертификаты',
  },
  kz: {
    title:      'Платформаға кіру',
    sub:        'МӨ атындағы БҚУ · English',
    email_label:'Email',
    email_ph:   'student@zku.kz',
    pass_label: 'Құпия сөз',
    pass_ph:    '••••••••',
    btn:        'Кіру',
    loading:    'Кіруде...',
    no_account: 'Аккаунтыңыз жоқ па?',
    register:   'Тіркелу',
    forgot:     'Құпия сөзді ұмыттыңыз ба?',
    err_empty:  'Барлық өрістерді толтырыңыз',
    err_invalid:'Қате email немесе құпия сөз',
    err_confirm:'Кіру алдында email-ді растаңыз',
    back:       'Басты бетке',
    left_h:     'Тіл платформасына қош келдіңіз',
    left_sub:   'Кіріп, оқуды жалғастырыңыз',
    feat1:      '600 сабақ A1–C1',
    feat2:      'Оқытушылармен топтар',
    feat3:      'Ресми сертификаттар',
  },
  en: {
    title:      'Sign in to platform',
    sub:        'WKU · English Platform',
    email_label:'Email',
    email_ph:   'student@zku.kz',
    pass_label: 'Password',
    pass_ph:    '••••••••',
    btn:        'Sign in',
    loading:    'Signing in...',
    no_account: 'No account?',
    register:   'Register',
    forgot:     'Forgot password?',
    err_empty:  'Please fill in all fields',
    err_invalid:'Invalid email or password',
    err_confirm:'Please confirm your email before signing in',
    back:       'Back to home',
    left_h:     'Welcome to the English Platform',
    left_sub:   'Sign in to continue your learning journey',
    feat1:      '600 lessons A1–C1',
    feat2:      'Groups with teachers',
    feat3:      'Official certificates',
  },
}

const LANG_BTN: Record<Lang, string> = { ru: 'РУС', kz: 'ҚАЗ', en: 'ENG' }

export default function ZKULoginPage() {
  const router = useRouter()
  const [lang, setLang]         = useState<Lang>('ru')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const t = T[lang]
  const brand = BRAND[lang]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError(t.err_empty); return }
    setLoading(true)
    setError('')
    const supabase = createEnglishClient()
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setLoading(false)
      if (authError.message.includes('Invalid login')) setError(t.err_invalid)
      else if (authError.message.includes('Email not confirmed')) setError(t.err_confirm)
      else setError(authError.message)
      return
    }
    const { data: profile } = await supabase
      .from('english_user_profiles')
      .select('role')
      .eq('user_id', authData.user?.id)
      .maybeSingle()
    const role = profile?.role ?? 'student'
    if (role === 'admin') router.push('/english/zku/admin')
    else if (role === 'teacher') router.push('/english/zku/teacher')
    else router.push('/english/zku/student')
  }

  return (
    <>
      <style>{`
        * { box-sizing: border-box; }

        .zku-root {
          min-height: 100vh;
          min-height: 100dvh;
          display: flex;
          font-family: 'Montserrat', sans-serif;
        }

        /* ── Левая панель ── */
        .zku-left {
          width: 42%;
          min-width: 340px;
          background: linear-gradient(155deg, #001d45 0%, #003876 50%, #004fa0 100%);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 48px 52px;
          position: relative;
          overflow: hidden;
          flex-shrink: 0;
        }
        .zku-left-orb1 {
          position: absolute; top: -80px; right: -80px;
          width: 300px; height: 300px; border-radius: 50%;
          background: rgba(255,194,44,0.07); pointer-events: none;
        }
        .zku-left-orb2 {
          position: absolute; bottom: -60px; left: -40px;
          width: 220px; height: 220px; border-radius: 50%;
          background: rgba(255,255,255,0.04); pointer-events: none;
        }
        .zku-logo-wrap {
          display: flex; align-items: center; gap: 12px; position: relative;
        }
        .zku-logo-box {
          width: 44px; height: 44px; border-radius: 12px;
          background: rgba(255,255,255,0.15);
          border: 1.5px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 900; font-size: 13px; flex-shrink: 0;
        }
        .zku-logo-name {
          color: #fff; font-weight: 800; font-size: 14px; line-height: 1.15;
        }
        .zku-logo-sub {
          color: rgba(255,255,255,0.5); font-size: 11px;
        }
        .zku-left-center { position: relative; }
        .zku-left-h {
          color: #fff; font-size: 26px; font-weight: 900;
          line-height: 1.25; margin-bottom: 14px; margin-top: 0;
        }
        .zku-left-p {
          color: rgba(255,255,255,0.65); font-size: 14px;
          line-height: 1.7; margin-bottom: 36px; margin-top: 0;
        }
        .zku-feats { display: flex; flex-direction: column; gap: 12px; }
        .zku-feat {
          display: flex; align-items: center; gap: 12px;
        }
        .zku-feat-icon {
          width: 28px; height: 28px; border-radius: 8px;
          background: rgba(255,194,44,0.2);
          display: flex; align-items: center; justify-content: center;
          font-size: 14px; flex-shrink: 0;
        }
        .zku-feat-text {
          color: rgba(255,255,255,0.85); font-size: 13px; font-weight: 600;
        }
        .zku-powered {
          color: rgba(255,255,255,0.35); font-size: 12px; position: relative;
        }

        /* ── Правая панель ── */
        .zku-right {
          flex: 1;
          background: #F4F7FB;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 48px 32px;
        }
        .zku-topbar {
          width: 100%; max-width: 420px;
          display: flex; align-items: center;
          justify-content: space-between;
          margin-bottom: 36px;
        }
        .zku-back-link {
          font-size: 13px; color: #64748B;
          text-decoration: none; font-weight: 600;
        }
        .zku-lang-switcher {
          display: flex;
          background: rgba(0,56,118,0.07);
          border-radius: 8px; padding: 3px; gap: 2px;
        }
        .zku-lang-btn {
          padding: 5px 12px; border-radius: 6px;
          font-size: 11px; font-weight: 700;
          cursor: pointer; border: none;
          transition: all 0.15s; font-family: inherit;
        }
        .zku-card {
          width: 100%; max-width: 420px;
          background: #fff; border-radius: 20px;
          padding: 36px 32px;
          box-shadow: 0 4px 32px rgba(0,56,118,0.08);
          border: 1px solid rgba(0,56,118,0.08);
        }
        .zku-card-head { text-align: center; margin-bottom: 28px; }
        .zku-card-logo {
          width: 52px; height: 52px; border-radius: 14px;
          margin: 0 auto 14px;
          background: linear-gradient(135deg, #003876, #0055a4);
          display: flex; align-items: center; justify-content: center;
          color: #fff; font-weight: 900; font-size: 13px;
          box-shadow: 0 6px 20px rgba(0,56,118,0.3);
        }
        .zku-card-title {
          font-size: 20px; font-weight: 900;
          color: #003876; margin-bottom: 5px; margin-top: 0;
        }
        .zku-card-sub {
          font-size: 12px; color: #94A3B8; margin: 0;
        }
        .zku-form { display: flex; flex-direction: column; gap: 16px; }
        .zku-field-label {
          display: block; font-size: 11px; font-weight: 700;
          color: #64748B; text-transform: uppercase;
          letter-spacing: 0.06em; margin-bottom: 7px;
        }
        .zku-input {
          width: 100%; padding: 11px 14px; border-radius: 10px;
          border: 1.5px solid rgba(0,56,118,0.15);
          font-size: 16px; /* 16px — iOS не зумит */
          outline: none; background: #F8FAFC;
          font-family: inherit; transition: border-color 0.15s;
          -webkit-appearance: none; appearance: none;
        }
        .zku-input:focus {
          border-color: #003876; background: #fff;
        }
        .zku-pass-row {
          display: flex; justify-content: space-between;
          align-items: center; margin-bottom: 7px;
        }
        .zku-forgot {
          font-size: 12px; color: #003876;
          text-decoration: none; font-weight: 600;
        }
        .zku-error {
          padding: 10px 14px; border-radius: 8px;
          background: rgba(220,38,38,0.06);
          border: 1px solid rgba(220,38,38,0.2);
          color: #DC2626; font-size: 13px; font-weight: 500;
        }
        .zku-submit {
          width: 100%; padding: 13px; border-radius: 10px;
          border: none; font-size: 14px; font-weight: 800;
          color: #fff; font-family: inherit;
          transition: all 0.15s; cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }
        .zku-register-row {
          text-align: center; margin-top: 20px;
          font-size: 13px; color: #64748B;
        }
        .zku-register-link {
          color: #003876; font-weight: 700; text-decoration: none;
        }

        /* ═══════════════════════════
           МОБИЛЬНЫЙ АДАПТИВ
        ═══════════════════════════ */
        @media (max-width: 768px) {
          .zku-root {
            flex-direction: column;
          }

          /* Левая панель — компактная шапка на мобиле */
          .zku-left {
            width: 100%;
            min-width: unset;
            padding: 24px 20px;
            /* Скрываем центральный блок с фичами */
            justify-content: flex-start;
            gap: 0;
          }
          .zku-left-center { display: none; }
          .zku-powered { display: none; }
          .zku-left-orb1 { width: 180px; height: 180px; top: -40px; right: -40px; }
          .zku-left-orb2 { width: 120px; height: 120px; }

          /* Правая панель */
          .zku-right {
            padding: 24px 16px 32px;
            justify-content: flex-start;
          }
          .zku-topbar {
            margin-bottom: 20px;
          }
          .zku-card {
            padding: 24px 20px;
            border-radius: 16px;
          }
          .zku-card-head {
            margin-bottom: 20px;
          }
        }

        @media (max-width: 400px) {
          .zku-left { padding: 20px 16px; }
          .zku-logo-name { font-size: 12px; }
          .zku-card { padding: 20px 16px; }
          .zku-card-title { font-size: 18px; }
          .zku-lang-btn { padding: 5px 9px; font-size: 10px; }
        }
      `}</style>

      <div className="zku-root">

        {/* ── Левая панель ── */}
        <div className="zku-left">
          <div className="zku-left-orb1" />
          <div className="zku-left-orb2" />

          <div className="zku-logo-wrap">
            <div className="zku-logo-box">{brand.logo}</div>
            <div>
              <div className="zku-logo-name">{brand.name}</div>
              <div className="zku-logo-sub">{brand.sub}</div>
            </div>
          </div>

          {/* Только на десктопе */}
          <div className="zku-left-center">
            <h2 className="zku-left-h">{t.left_h}</h2>
            <p className="zku-left-p">{t.left_sub}</p>
            <div className="zku-feats">
              {[t.feat1, t.feat2, t.feat3].map(f => (
                <div key={f} className="zku-feat">
                  <div className="zku-feat-icon">✓</div>
                  <span className="zku-feat-text">{f}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="zku-powered">Powered by KHAMADI English</div>
        </div>

        {/* ── Правая панель ── */}
        <div className="zku-right">

          {/* Топбар */}
          <div className="zku-topbar">
            <Link href="/english/zku" className="zku-back-link">
              ← {t.back}
            </Link>
            <div className="zku-lang-switcher">
              {(['ru','kz','en'] as Lang[]).map(l => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className="zku-lang-btn"
                  style={{
                    background: lang === l ? '#003876' : 'transparent',
                    color:      lang === l ? '#fff'    : '#64748B',
                    boxShadow:  lang === l ? '0 2px 8px rgba(0,56,118,0.25)' : 'none',
                  }}
                >
                  {LANG_BTN[l]}
                </button>
              ))}
            </div>
          </div>

          {/* Карточка */}
          <div className="zku-card">
            <div className="zku-card-head">
              <div className="zku-card-logo">{brand.logo}</div>
              <h1 className="zku-card-title">{t.title}</h1>
              <p className="zku-card-sub">{t.sub}</p>
            </div>

            <form onSubmit={handleSubmit} className="zku-form">
              <div>
                <label className="zku-field-label">{t.email_label}</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError('') }}
                  placeholder={t.email_ph}
                  className="zku-input"
                  autoComplete="email"
                />
              </div>

              <div>
                <div className="zku-pass-row">
                  <label className="zku-field-label" style={{ margin: 0 }}>{t.pass_label}</label>
                  <a href="#" className="zku-forgot">{t.forgot}</a>
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError('') }}
                  placeholder={t.pass_ph}
                  className="zku-input"
                  autoComplete="current-password"
                />
              </div>

              {error && (
                <div className="zku-error">⚠ {error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="zku-submit"
                style={{
                  background: loading
                    ? '#94A3B8'
                    : 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(0,56,118,0.3)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
              >
                {loading ? t.loading : t.btn}
              </button>
            </form>

            <div className="zku-register-row">
              {t.no_account}{' '}
              <Link href="/english/zku/register" className="zku-register-link">
                {t.register}
              </Link>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}
