'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createEnglishClient } from '@/lib/english/supabase-client'

type Lang = 'ru' | 'kz' | 'en'
type Role = 'student' | 'teacher'
type Gate = 'loading' | 'closed' | 'admin'

const BRAND = {
  ru: { logo: 'ЗКУ', name: 'ЗКУ им. М. Утемісова', sub: 'English Platform' },
  kz: { logo: 'БҚУ', name: 'МӨ атындағы БҚУ', sub: 'English Platform' },
  en: { logo: 'WKU', name: 'West Kazakhstan University', sub: 'English Platform' },
}

const T = {
  ru: {
    title:        'Создать аккаунт',
    sub:          'ЗКУ им. М. Утемісова · English',
    role_label:   'Роль',
    role_student: 'Студент',
    role_teacher: 'Преподаватель',
    name_label:   'Полное имя',
    name_ph:      'Данияр Ерланұлы',
    email_label:  'Email',
    email_ph:     'student@zku.kz',
    pass_label:   'Пароль',
    pass_ph:      'Минимум 8 символов',
    btn:          'Создать аккаунт',
    loading:      'Создаём аккаунт...',
    have_account: 'Уже есть аккаунт?',
    login:        'Войти',
    err_empty:    'Заполните все поля',
    err_pass:     'Пароль должен быть минимум 8 символов',
    left_h:       'Начните изучать английский в университете',
    left_sub:     'Доступ к платформе выдаёт администратор',
    feat1:        'A1–C1: 600 уроков',
    feat2:        'Группы по специальности',
    feat3:        'Официальные сертификаты',
    feat4:        'Работа с преподавателем',
    success_h:    'Аккаунт создан!',
    success_sub:  'Передайте пользователю email и пароль для входа.',
    success_btn:  'Создать ещё',
    success_login:'На страницу входа',
    back:         'На главную',
    closed_h:     'Регистрация закрыта',
    closed_sub:   'Самостоятельная регистрация недоступна. Обратитесь к администратору для создания аккаунта.',
    closed_login: 'Войти',
    admin_badge:  'Режим администратора',
  },
  kz: {
    title:        'Аккаунт жасау',
    sub:          'МӨ атындағы БҚУ · English',
    role_label:   'Рөл',
    role_student: 'Студент',
    role_teacher: 'Оқытушы',
    name_label:   'Толық аты-жөні',
    name_ph:      'Данияр Ерланұлы',
    email_label:  'Email',
    email_ph:     'student@zku.kz',
    pass_label:   'Құпия сөз',
    pass_ph:      'Кемінде 8 таңба',
    btn:          'Аккаунт жасау',
    loading:      'Аккаунт жасалуда...',
    have_account: 'Аккаунтыңыз бар ма?',
    login:        'Кіру',
    err_empty:    'Барлық өрістерді толтырыңыз',
    err_pass:     'Құпия сөз кемінде 8 таңбадан тұруы керек',
    left_h:       'Университетте ағылшын тілін үйрене бастаңыз',
    left_sub:     'Платформаға қолжетімділікті әкімші береді',
    feat1:        'A1–C1: 600 сабақ',
    feat2:        'Мамандық бойынша топтар',
    feat3:        'Ресми сертификаттар',
    feat4:        'Оқытушымен жұмыс',
    success_h:    'Аккаунт жасалды!',
    success_sub:  'Пайдаланушыға email мен құпия сөзді беріңіз.',
    success_btn:  'Тағы жасау',
    success_login:'Кіру бетіне',
    back:         'Басты бетке',
    closed_h:     'Тіркелу жабық',
    closed_sub:   'Өз бетінше тіркелу қолжетімсіз. Аккаунт жасау үшін әкімшіге жүгініңіз.',
    closed_login: 'Кіру',
    admin_badge:  'Әкімші режимі',
  },
  en: {
    title:        'Create account',
    sub:          'WKU · English Platform',
    role_label:   'Role',
    role_student: 'Student',
    role_teacher: 'Teacher',
    name_label:   'Full name',
    name_ph:      'Your full name',
    email_label:  'Email',
    email_ph:     'student@zku.kz',
    pass_label:   'Password',
    pass_ph:      'At least 8 characters',
    btn:          'Create account',
    loading:      'Creating account...',
    have_account: 'Already have an account?',
    login:        'Sign in',
    err_empty:    'Please fill in all fields',
    err_pass:     'Password must be at least 8 characters',
    left_h:       'Start learning English at university',
    left_sub:     'Platform access is granted by an administrator',
    feat1:        'A1–C1: 600 lessons',
    feat2:        'Specialised groups',
    feat3:        'Official certificates',
    feat4:        'Work with a teacher',
    success_h:    'Account created!',
    success_sub:  'Share the email and password with the user.',
    success_btn:  'Create another',
    success_login:'Go to login',
    back:         'Back to home',
    closed_h:     'Registration is closed',
    closed_sub:   'Self-registration is unavailable. Contact an administrator to create an account.',
    closed_login: 'Sign in',
    admin_badge:  'Admin mode',
  },
}

const LANG_BTN: Record<Lang, string> = { ru: 'РУС', kz: 'ҚАЗ', en: 'ENG' }

export default function ZKURegisterPage() {
  const [lang, setLang]         = useState<Lang>('ru')
  const [role, setRole]         = useState<Role>('student')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)
  const [gate, setGate]         = useState<Gate>('loading')
  const [token, setToken]       = useState('')
  const t = T[lang]
  const brand = BRAND[lang]

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        if (!cancelled) setGate('closed')
        return
      }
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('role')
        .eq('user_id', session.user.id)
        .maybeSingle()
      if (cancelled) return
      if (profile?.role === 'admin') {
        setToken(session.access_token)
        setGate('admin')
      } else {
        setGate('closed')
      }
    })()
    return () => { cancelled = true }
  }, [])

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!name || !email || !password) { setError(t.err_empty); return }
    if (password.length < 8) { setError(t.err_pass); return }
    if (!token) { setError(t.closed_sub); return }
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/english/zku/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
          fullName: name.trim(),
          role,
        }),
      })
      const data = await res.json() as { ok?: boolean; error?: string }
      if (!res.ok || !data.ok) {
        setError(data.error ?? 'Ошибка регистрации')
        setLoading(false)
        return
      }
      setLoading(false)
      setDone(true)
    } catch {
      setError('Ошибка сети. Попробуйте позже.')
      setLoading(false)
    }
  }

  function resetForm() {
    setDone(false)
    setName('')
    setEmail('')
    setPassword('')
    setRole('student')
    setError('')
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Montserrat', sans-serif" }}>

      <div style={{ width:'42%', minWidth:340, background:'linear-gradient(155deg, #001d45 0%, #003876 50%, #004fa0 100%)', display:'flex', flexDirection:'column', justifyContent:'space-between', padding:'48px 52px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:-80, right:-80, width:300, height:300, borderRadius:'50%', background:'rgba(255,194,44,0.07)', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-60, left:-40, width:220, height:220, borderRadius:'50%', background:'rgba(255,255,255,0.04)', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', gap:12, position:'relative' }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'rgba(255,255,255,0.15)', border:'1.5px solid rgba(255,255,255,0.25)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13 }}>{brand.logo}</div>
          <div>
            <div style={{ color:'#fff', fontWeight:800, fontSize:14, lineHeight:1.15 }}>{brand.name}</div>
            <div style={{ color:'rgba(255,255,255,0.5)', fontSize:11 }}>{brand.sub}</div>
          </div>
        </div>

        <div style={{ position:'relative' }}>
          <h2 style={{ color:'#fff', fontSize:24, fontWeight:900, lineHeight:1.3, marginBottom:14 }}>{t.left_h}</h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.65, marginBottom:32 }}>{t.left_sub}</p>
          <div style={{ display:'flex', flexDirection:'column', gap:11 }}>
            {[t.feat1, t.feat2, t.feat3, t.feat4].map(f => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{ width:26, height:26, borderRadius:7, background:'rgba(255,194,44,0.18)', display:'flex', alignItems:'center', justifyContent:'center', color:'#FFC72C', fontSize:13 }}>✓</div>
                <span style={{ color:'rgba(255,255,255,0.85)', fontSize:13, fontWeight:600 }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ color:'rgba(255,255,255,0.35)', fontSize:12, position:'relative' }}>Powered by KHAMADI English</div>
      </div>

      <div style={{ flex:1, background:'#F4F7FB', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'48px 32px', overflowY:'auto' }}>
        <div style={{ width:'100%', maxWidth:440, display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:28 }}>
          <Link href="/english/zku" style={{ fontSize:13, color:'#64748B', textDecoration:'none', fontWeight:600 }}>← {t.back}</Link>
          <div style={{ display:'flex', background:'rgba(0,56,118,0.07)', borderRadius:8, padding:3, gap:2 }}>
            {(['ru','kz','en'] as Lang[]).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding:'5px 10px', borderRadius:6, fontSize:11, fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s', background: lang===l ? '#003876' : 'transparent', color: lang===l ? '#fff' : '#64748B', boxShadow: lang===l ? '0 2px 8px rgba(0,56,118,0.25)' : 'none' }}>{LANG_BTN[l]}</button>
            ))}
          </div>
        </div>

        {gate === 'loading' ? (
          <div style={{ width:'100%', maxWidth:440, background:'#fff', borderRadius:20, padding:'52px 40px', textAlign:'center', boxShadow:'0 4px 32px rgba(0,56,118,0.08)', border:'1px solid rgba(0,56,118,0.08)', color:'#64748B', fontWeight:600 }}>
            …
          </div>
        ) : gate === 'closed' ? (
          <div style={{ width:'100%', maxWidth:440, background:'#fff', borderRadius:20, padding:'52px 40px', textAlign:'center', boxShadow:'0 4px 32px rgba(0,56,118,0.08)', border:'1px solid rgba(0,56,118,0.08)' }}>
            <div style={{ fontSize:48, marginBottom:16 }}>🔒</div>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#003876', marginBottom:12 }}>{t.closed_h}</h2>
            <p style={{ fontSize:14, color:'#64748B', lineHeight:1.65, marginBottom:28 }}>{t.closed_sub}</p>
            <Link href="/english/zku/login" style={{ display:'inline-block', padding:'13px 32px', borderRadius:10, background:'linear-gradient(135deg, #003876, #0055a4)', color:'#fff', fontWeight:800, fontSize:14, textDecoration:'none', boxShadow:'0 6px 20px rgba(0,56,118,0.3)' }}>{t.closed_login}</Link>
          </div>
        ) : done ? (
          <div style={{ width:'100%', maxWidth:440, background:'#fff', borderRadius:20, padding:'52px 40px', textAlign:'center', boxShadow:'0 4px 32px rgba(0,56,118,0.08)', border:'1px solid rgba(0,56,118,0.08)' }}>
            <div style={{ fontSize:56, marginBottom:20 }}>🎉</div>
            <h2 style={{ fontSize:22, fontWeight:900, color:'#003876', marginBottom:12 }}>{t.success_h}</h2>
            <p style={{ fontSize:14, color:'#64748B', lineHeight:1.65, marginBottom:28 }}>{t.success_sub}</p>
            <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
              <button type="button" onClick={resetForm} style={{ padding:'13px 32px', borderRadius:10, border:'none', background:'linear-gradient(135deg, #003876, #0055a4)', color:'#fff', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'inherit', boxShadow:'0 6px 20px rgba(0,56,118,0.3)' }}>{t.success_btn}</button>
              <Link href="/english/zku/login" style={{ fontSize:13, color:'#64748B', fontWeight:600, textDecoration:'none' }}>{t.success_login}</Link>
            </div>
          </div>
        ) : (
          <div style={{ width:'100%', maxWidth:440, background:'#fff', borderRadius:20, padding:'36px 32px', boxShadow:'0 4px 32px rgba(0,56,118,0.08)', border:'1px solid rgba(0,56,118,0.08)' }}>
            <div style={{ textAlign:'center', marginBottom:24 }}>
              <div style={{ width:52, height:52, borderRadius:14, margin:'0 auto 12px', background:'linear-gradient(135deg, #003876, #0055a4)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:13, boxShadow:'0 6px 20px rgba(0,56,118,0.3)' }}>{brand.logo}</div>
              <div style={{ display:'inline-block', marginBottom:10, padding:'4px 10px', borderRadius:99, background:'#EDE9FE', color:'#7C3AED', fontSize:11, fontWeight:800 }}>{t.admin_badge}</div>
              <h1 style={{ fontSize:20, fontWeight:900, color:'#003876', marginBottom:4 }}>{t.title}</h1>
              <p style={{ fontSize:12, color:'#94A3B8' }}>{t.sub}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:7 }}>{t.role_label}</label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {(['student','teacher'] as Role[]).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{ padding:'10px', borderRadius:10, fontSize:13, fontWeight:700, cursor:'pointer', border:'none', transition:'all 0.15s', fontFamily:'inherit', background: role===r ? 'linear-gradient(135deg, #003876, #0055a4)' : 'rgba(0,56,118,0.05)', color: role===r ? '#fff' : '#64748B', boxShadow: role===r ? '0 4px 12px rgba(0,56,118,0.25)' : 'none' }}>
                      {r==='student' ? t.role_student : t.role_teacher}
                    </button>
                  ))}
                </div>
              </div>

              {[
                { label: t.name_label, type:'text', value:name, set:setName, ph:t.name_ph },
                { label: t.email_label, type:'email', value:email, set:setEmail, ph:t.email_ph },
                { label: t.pass_label, type:'password', value:password, set:setPassword, ph:t.pass_ph },
              ].map(f => (
                <div key={f.label}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:7 }}>{f.label}</label>
                  <input type={f.type} value={f.value} placeholder={f.ph}
                    onChange={e => { f.set(e.target.value); setError('') }}
                    style={{ width:'100%', padding:'11px 14px', borderRadius:10, border:'1.5px solid rgba(0,56,118,0.15)', fontSize:14, outline:'none', boxSizing:'border-box', background:'#F8FAFC', fontFamily:'inherit', transition:'border-color 0.15s' }}
                    onFocus={e => { e.currentTarget.style.borderColor='#003876'; e.currentTarget.style.background='#fff' }}
                    onBlur={e => { e.currentTarget.style.borderColor='rgba(0,56,118,0.15)'; e.currentTarget.style.background='#F8FAFC' }} />
                </div>
              ))}

              {error && <div style={{ padding:'10px 14px', borderRadius:8, background:'rgba(220,38,38,0.06)', border:'1px solid rgba(220,38,38,0.2)', color:'#DC2626', fontSize:13, fontWeight:500 }}>⚠ {error}</div>}

              <button type="submit" disabled={loading} style={{ width:'100%', padding:'13px', borderRadius:10, border:'none', cursor:loading?'not-allowed':'pointer', background:loading?'#94A3B8':'linear-gradient(135deg, #003876 0%, #0055a4 100%)', color:'#fff', fontSize:14, fontWeight:800, boxShadow:loading?'none':'0 6px 20px rgba(0,56,118,0.3)', transition:'all 0.15s', fontFamily:'inherit' }}>
                {loading ? t.loading : t.btn}
              </button>
            </form>

            <div style={{ textAlign:'center', marginTop:18, fontSize:13, color:'#64748B' }}>
              {t.have_account}{' '}
              <Link href="/english/zku/login" style={{ color:'#003876', fontWeight:700, textDecoration:'none' }}>{t.login}</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
