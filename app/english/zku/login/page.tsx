'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { Lang } from '@/lib/english/zkuTranslations'

const T = {
  ru: {
    title:       'Войти в платформу',
    sub:         'Западно-Казахстанский университет · English',
    email_label: 'Email @zku.kz',
    email_ph:    'student@zku.kz',
    pass_label:  'Пароль',
    pass_ph:     '••••••••',
    btn:         'Войти',
    loading:     'Входим...',
    no_account:  'Нет аккаунта?',
    register:    'Зарегистрироваться',
    forgot:      'Забыли пароль?',
    err_domain:  'Доступно только для @zku.kz аккаунтов',
    err_empty:   'Заполните все поля',
    left_h:      'Добро пожаловать в языковую платформу',
    left_sub:    'Войдите с корпоративным аккаунтом и продолжите обучение',
    feat1:       '600 уроков A1–C1',
    feat2:       'Группы с преподавателями',
    feat3:       'Официальные сертификаты',
  },
  kz: {
    title:       'Платформаға кіру',
    sub:         'Батыс Қазақстан университеті · English',
    email_label: 'Email @zku.kz',
    email_ph:    'student@zku.kz',
    pass_label:  'Құпия сөз',
    pass_ph:     '••••••••',
    btn:         'Кіру',
    loading:     'Кіруде...',
    no_account:  'Аккаунтыңыз жоқ па?',
    register:    'Тіркелу',
    forgot:      'Құпия сөзді ұмыттыңыз ба?',
    err_domain:  'Тек @zku.kz аккаунттары үшін қолжетімді',
    err_empty:   'Барлық өрістерді толтырыңыз',
    left_h:      'Тіл платформасына қош келдіңіз',
    left_sub:    'Корпоративтік аккаунтпен кіріп, оқуды жалғастырыңыз',
    feat1:       '600 сабақ A1–C1',
    feat2:       'Оқытушылармен топтар',
    feat3:       'Ресми сертификаттар',
  },
}

export default function ZKULoginPage() {
  const router = useRouter()
  const [lang, setLang] = useState<Lang>('ru')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const t = T[lang]

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { setError(t.err_empty); return }
    setLoading(true)
    setError('')
    const supabase = createEnglishClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) {
      setLoading(false)
      if (authError.message.includes('Invalid login')) setError(lang === 'ru' ? 'Неверный email или пароль' : 'Қате email немесе құпия сөз')
      else if (authError.message.includes('Email not confirmed')) setError(lang === 'ru' ? 'Подтвердите email перед входом' : 'Кіру алдында email-ді растаңыз')
      else setError(authError.message)
      return
    }
    router.push('/english/zku/student')
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: "'Montserrat', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width: '42%', minWidth: 340,
        background: 'linear-gradient(155deg, #001d45 0%, #003876 50%, #004fa0 100%)',
        display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '48px 52px',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circles */}
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,194,44,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        {/* Logo */}
        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
          <div style={{
            width:44, height:44, borderRadius:12,
            background:'rgba(255,255,255,0.15)',
            border:'1.5px solid rgba(255,255,255,0.25)',
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontWeight:900, fontSize:12,
          }}>ЗКУ</div>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:15, lineHeight:1.1 }}>Западно-Казахстанский</div>
            <div style={{ color:'rgba(255,255,255,0.6)', fontSize:11, lineHeight:1 }}>университет · English</div>
          </div>
        </div>

        {/* Center text */}
        <div style={{ position:'relative' }}>
          <h2 style={{ color:'#fff', fontSize:28, fontWeight:900, lineHeight:1.25, marginBottom:16 }}>
            {t.left_h}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:15, lineHeight:1.6, marginBottom:40 }}>
            {t.left_sub}
          </p>

          <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
            {[t.feat1, t.feat2, t.feat3].map((f) => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:32, height:32, borderRadius:8,
                  background:'rgba(255,194,44,0.2)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:16, flexShrink:0,
                }}>✓</div>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:14, fontWeight:600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom powered by */}
        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12, position:'relative' }}>
          Powered by KHAMADI English
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div style={{
        flex:1, background:'#F4F7FB',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'48px 32px',
      }}>
        {/* Lang switcher + back */}
        <div style={{ width:'100%', maxWidth:420, display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:40 }}>
          <Link href="/english/zku" style={{ fontSize:13, color:'#64748B', textDecoration:'none', fontWeight:600 }}>
            ← {lang === 'ru' ? 'На главную' : 'Басты бетке'}
          </Link>
          <div style={{ display:'flex', background:'rgba(0,56,118,0.07)', borderRadius:8, padding:3, gap:2 }}>
            {(['ru','kz'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{
                padding:'5px 14px', borderRadius:6, fontSize:12, fontWeight:700,
                cursor:'pointer', border:'none', transition:'all 0.15s',
                background: lang===l ? '#003876' : 'transparent',
                color: lang===l ? '#fff' : '#64748B',
                boxShadow: lang===l ? '0 2px 8px rgba(0,56,118,0.25)' : 'none',
              }}>{l==='ru' ? 'РУС' : 'ҚАЗ'}</button>
            ))}
          </div>
        </div>

        {/* Card */}
        <div style={{
          width:'100%', maxWidth:420,
          background:'#fff', borderRadius:20,
          padding:'40px 36px',
          boxShadow:'0 4px 32px rgba(0,56,118,0.08)',
          border:'1px solid rgba(0,56,118,0.08)',
        }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <div style={{
              width:56, height:56, borderRadius:14, margin:'0 auto 16px',
              background:'linear-gradient(135deg, #003876, #0055a4)',
              display:'flex', alignItems:'center', justifyContent:'center',
              color:'#fff', fontWeight:900, fontSize:14,
              boxShadow:'0 6px 20px rgba(0,56,118,0.3)',
            }}>ЗКУ</div>
            <h1 style={{ fontSize:22, fontWeight:900, color:'#003876', marginBottom:6 }}>{t.title}</h1>
            <p style={{ fontSize:13, color:'#94A3B8' }}>{t.sub}</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:18 }}>
            {/* Email */}
            <div>
              <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
                {t.email_label}
              </label>
              <input
                type="email" value={email}
                onChange={e => { setEmail(e.target.value); setError('') }}
                placeholder={t.email_ph}
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:10,
                  border: `1.5px solid ${error && !email ? '#DC2626' : 'rgba(0,56,118,0.15)'}`,
                  fontSize:14, outline:'none', boxSizing:'border-box',
                  background:'#F8FAFC', fontFamily:'inherit',
                  transition:'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#003876'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)'; e.currentTarget.style.background = '#F8FAFC' }}
              />
            </div>

            {/* Password */}
            <div>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:8 }}>
                <label style={{ fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em' }}>
                  {t.pass_label}
                </label>
                <a href="#" style={{ fontSize:12, color:'#003876', textDecoration:'none', fontWeight:600 }}>{t.forgot}</a>
              </div>
              <input
                type="password" value={password}
                onChange={e => { setPassword(e.target.value); setError('') }}
                placeholder={t.pass_ph}
                style={{
                  width:'100%', padding:'12px 16px', borderRadius:10,
                  border:'1.5px solid rgba(0,56,118,0.15)',
                  fontSize:14, outline:'none', boxSizing:'border-box',
                  background:'#F8FAFC', fontFamily:'inherit',
                  transition:'border-color 0.15s',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#003876'; e.currentTarget.style.background = '#fff' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)'; e.currentTarget.style.background = '#F8FAFC' }}
              />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                padding:'10px 14px', borderRadius:8,
                background:'rgba(220,38,38,0.06)',
                border:'1px solid rgba(220,38,38,0.2)',
                color:'#DC2626', fontSize:13, fontWeight:500,
              }}>
                ⚠ {error}
              </div>
            )}

            {/* Submit */}
            <button type="submit" disabled={loading} style={{
              width:'100%', padding:'14px',
              borderRadius:10, border:'none', cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#94A3B8' : 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
              color:'#fff', fontSize:15, fontWeight:800,
              boxShadow: loading ? 'none' : '0 6px 20px rgba(0,56,118,0.3)',
              transition:'all 0.15s', fontFamily:'inherit',
            }}>
              {loading ? t.loading : t.btn}
            </button>
          </form>

          <div style={{ textAlign:'center', marginTop:24, fontSize:14, color:'#64748B' }}>
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
