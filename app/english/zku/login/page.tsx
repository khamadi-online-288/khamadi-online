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
    // Redirect by role
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
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Montserrat', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width:'42%', minWidth:340,
        background:'linear-gradient(155deg, #001d45 0%, #003876 50%, #004fa0 100%)',
        display:'flex', flexDirection:'column', justifyContent:'space-between',
        padding:'48px 52px', position:'relative', overflow:'hidden',
      }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,194,44,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
          <div style={{
            width:44, height:44, borderRadius:12, background:'rgba(255,255,255,0.15)',
            border:'1.5px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center',
            justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13,
          }}>{brand.logo}</div>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:14, lineHeight:1.15 }}>{brand.name}</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>{brand.sub}</div>
          </div>
        </div>

        {/* Center */}
        <div style={{ position:'relative' }}>
          <h2 style={{ color:'#fff', fontSize:26, fontWeight:900, lineHeight:1.25, marginBottom:14 }}>
            {t.left_h}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.7, marginBottom:36 }}>
            {t.left_sub}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[t.feat1, t.feat2, t.feat3].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:28, height:28, borderRadius:8, background:'rgba(255,194,44,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:14 }}>✓</div>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12, position:'relative' }}>
          Powered by KHAMADI English
        </div>
      </div>

      {/* ── Right panel ── */}
      <div style={{ flex:1, background:'#F4F7FB', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px' }}>
        {/* Top bar */}
        <div style={{ width:'100%', maxWidth:420, display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:36 }}>
          <Link href="/english/zku" style={{ fontSize:13, color:'#64748B', textDecoration:'none', fontWeight:600 }}>
            ← {t.back}
          </Link>
          <div style={{ display:'flex', background:'rgba(0,56,118,0.07)', borderRadius:8, padding:3, gap:2 }}>
            {(['ru','kz','en'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:'5px 12px', borderRadius:6, fontSize:11, fontWeight:700,
                cursor:'pointer', border:'none', transition:'all 0.15s',
                background: lang===l ? '#003876' : 'transparent',
                color: lang===l ? '#fff' : '#64748B',
                boxShadow: lang===l ? '0 2px 8px rgba(0,56,118,0.25)' : 'none',
              }}>{LANG_BTN[l]}</button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{ width:'100%', maxWidth:420, background:'#fff', borderRadius:20, padding:'36px 32px', boxShadow:'0 4px 32px rgba(0,56,118,0.08)', border:'1px solid rgba(0,56,118,0.08)' }}>
          <div style={{ textAlign:'center', marginBottom:28 }}>
            <div style={{ width:52, height:52, borderRadius:14, margin:'0 auto 14px', background:'linear-gradient(135deg, #003876, #0055a4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13, boxShadow:'0 6px 20px rgba(0,56,118,0.3)' }}>{brand.logo}</div>
            <h1 style={{ fontSize:20, fontWeight:900, color:'#003876', marginBottom:5 }}>{t.title}</h1>
            <p style={{ fontSize:12, color:'#94A3B8' }}>{t.sub}</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:7 }}>{t.email_label}</label>
              <input type="email" value={email} onChange={e => { setEmail(e.target.value); setError('') }} placeholder={t.email_ph}
                style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid rgba(0,56,118,0.15)', fontSize:14, outline:'none', boxSizing:'border-box', background:'#F8FAFC', fontFamily:'inherit', transition:'border-color 0.15s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#003876'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)'; e.currentTarget.style.background = '#F8FAFC' }} />
            </div>

            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em' }}>{t.pass_label}</label>
                <a href="#" style={{ fontSize:12, color:'#003876', textDecoration:'none', fontWeight:600 }}>{t.forgot}</a>
              </div>
              <input type="password" value={password} onChange={e => { setPassword(e.target.value); setError('') }} placeholder={t.pass_ph}
                style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid rgba(0,56,118,0.15)', fontSize:14, outline:'none', boxSizing:'border-box', background:'#F8FAFC', fontFamily:'inherit', transition:'border-color 0.15s' }}
                onFocus={e => { e.currentTarget.style.borderColor = '#003876'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)'; e.currentTarget.style.background = '#F8FAFC' }} />
            </div>

            {error && (
              <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', color:'#DC2626', fontSize:13, fontWeight:500 }}>
                ⚠ {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'13px', borderRadius:10, border:'none',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
              color:'#fff', fontSize:14, fontWeight:800,
              boxShadow: loading ? 'none' : '0 6px 20px rgba(0,56,118,0.3)',
              transition:'all 0.15s', fontFamily:'inherit',
            }}>
              {loading ? t.loading : t.btn}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:20, fontSize:13, color:'#64748B' }}>
            {t.no_account}{' '}
            <Link href="/english/zku/register" style={{ color:'#003876', fontWeight:700, textDecoration:'none' }}>
              {t.register}
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
