'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { Lang } from '@/lib/english/zkuTranslations'

const T = {
  ru: {
    title:        'Создать аккаунт',
    sub:          'Западно-Казахстанский университет · English',
    role_label:   'Роль',
    role_student: 'Студент',
    role_teacher: 'Преподаватель',
    name_label:   'Полное имя',
    name_ph:      'Данияр Ерланұлы',
    email_label:  'Email @zku.kz',
    email_ph:     'student@zku.kz',
    pass_label:   'Пароль',
    pass_ph:      'Минимум 8 символов',
    btn:          'Зарегистрироваться',
    loading:      'Создаём аккаунт...',
    have_account: 'Уже есть аккаунт?',
    login:        'Войти',
    err_domain:   'Доступно только для @zku.kz аккаунтов',
    err_empty:    'Заполните все поля',
    err_pass:     'Пароль должен быть минимум 8 символов',
    left_h:       'Начните изучать английский в университете',
    left_sub:     'Зарегистрируйтесь и получите доступ к 600 урокам, группам и сертификатам',
    feat1:        'A1–C1: 600 уроков',
    feat2:        'Группы по специальности',
    feat3:        'Официальные сертификаты',
    feat4:        'Работа с преподавателем',
    success_h:    'Аккаунт создан!',
    success_sub:  'Добро пожаловать в платформу. Войдите, чтобы начать.',
    success_btn:  'Войти',
  },
  kz: {
    title:        'Аккаунт жасау',
    sub:          'Батыс Қазақстан университеті · English',
    role_label:   'Рөл',
    role_student: 'Студент',
    role_teacher: 'Оқытушы',
    name_label:   'Толық аты-жөні',
    name_ph:      'Данияр Ерланұлы',
    email_label:  'Email @zku.kz',
    email_ph:     'student@zku.kz',
    pass_label:   'Құпия сөз',
    pass_ph:      'Кемінде 8 таңба',
    btn:          'Тіркелу',
    loading:      'Аккаунт жасалуда...',
    have_account: 'Аккаунтыңыз бар ма?',
    login:        'Кіру',
    err_domain:   'Тек @zku.kz аккаунттары үшін қолжетімді',
    err_empty:    'Барлық өрістерді толтырыңыз',
    err_pass:     'Құпия сөз кемінде 8 таңбадан тұруы керек',
    left_h:       'Университетте ағылшын тілін үйрене бастаңыз',
    left_sub:     'Тіркеліп, 600 сабаққа, топтарға және сертификаттарға қол жеткізіңіз',
    feat1:        'A1–C1: 600 сабақ',
    feat2:        'Мамандық бойынша топтар',
    feat3:        'Ресми сертификаттар',
    feat4:        'Оқытушымен жұмыс',
    success_h:    'Аккаунт жасалды!',
    success_sub:  'Платформаға қош келдіңіз. Бастау үшін кіріңіз.',
    success_btn:  'Кіру',
  },
}

type Role = 'student' | 'teacher'

export default function ZKURegisterPage() {
  const [lang, setLang]         = useState<Lang>('ru')
  const [role, setRole]         = useState<Role>('student')
  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [done, setDone]         = useState(false)
  const t      = T[lang]
  const router = useRouter()

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!name || !email || !password) { setError(t.err_empty); return }
    if (password.length < 8)          { setError(t.err_pass); return }
    setError('')
    setLoading(true)

    const supabase = createEnglishClient()
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: name, role } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    if (data.user) {
      // Create profile row
      await supabase.from('english_user_profiles').upsert(
        { user_id: data.user.id, full_name: name, role },
        { onConflict: 'user_id' }
      )
    }

    setLoading(false)
    setDone(true)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', fontFamily:"'Montserrat', sans-serif" }}>

      {/* ── Left panel ── */}
      <div style={{
        width:'42%', minWidth:340,
        background:'linear-gradient(155deg, #001d45 0%, #003876 50%, #004fa0 100%)',
        display:'flex', flexDirection:'column',
        justifyContent:'space-between',
        padding:'48px 52px',
        position:'relative', overflow:'hidden',
      }}>
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

        {/* Center */}
        <div style={{ position:'relative' }}>
          <h2 style={{ color:'#fff', fontSize:26, fontWeight:900, lineHeight:1.3, marginBottom:14 }}>
            {t.left_h}
          </h2>
          <p style={{ color:'rgba(255,255,255,0.65)', fontSize:14, lineHeight:1.65, marginBottom:36 }}>
            {t.left_sub}
          </p>
          <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
            {[t.feat1, t.feat2, t.feat3, t.feat4].map((f) => (
              <div key={f} style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div style={{
                  width:28, height:28, borderRadius:7,
                  background:'rgba(255,194,44,0.18)',
                  display:'flex', alignItems:'center', justifyContent:'center',
                  color:'#FFC72C', fontSize:13, fontWeight:900, flexShrink:0,
                }}>✓</div>
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
      <div style={{
        flex:1, background:'#F4F7FB',
        display:'flex', flexDirection:'column',
        alignItems:'center', justifyContent:'center',
        padding:'48px 32px',
        overflowY:'auto',
      }}>
        {/* Top bar */}
        <div style={{ width:'100%', maxWidth:440, display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:32 }}>
          <Link href="/english/zku" style={{ fontSize:13, color:'#64748B', textDecoration:'none', fontWeight:600 }}>
            ← {lang==='ru' ? 'На главную' : 'Басты бетке'}
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

        {done ? (
          /* ── Success screen ── */
          <div style={{
            width:'100%', maxWidth:440,
            background:'#fff', borderRadius:20, padding:'52px 40px',
            textAlign:'center',
            boxShadow:'0 4px 32px rgba(0,56,118,0.08)',
            border:'1px solid rgba(0,56,118,0.08)',
          }}>
            <div style={{ fontSize:56, marginBottom:20 }}>🎉</div>
            <h2 style={{ fontSize:24, fontWeight:900, color:'#003876', marginBottom:12 }}>{t.success_h}</h2>
            <p style={{ fontSize:14, color:'#64748B', lineHeight:1.65, marginBottom:32 }}>{t.success_sub}</p>
            <Link href="/english/zku/login" style={{
              display:'inline-block', padding:'14px 36px', borderRadius:10,
              background:'linear-gradient(135deg, #003876, #0055a4)',
              color:'#fff', fontWeight:800, fontSize:15, textDecoration:'none',
              boxShadow:'0 6px 20px rgba(0,56,118,0.3)',
            }}>{t.success_btn}</Link>
          </div>
        ) : (
          /* ── Form ── */
          <div style={{
            width:'100%', maxWidth:440,
            background:'#fff', borderRadius:20,
            padding:'40px 36px',
            boxShadow:'0 4px 32px rgba(0,56,118,0.08)',
            border:'1px solid rgba(0,56,118,0.08)',
          }}>
            <div style={{ textAlign:'center', marginBottom:28 }}>
              <div style={{
                width:56, height:56, borderRadius:14, margin:'0 auto 14px',
                background:'linear-gradient(135deg, #003876, #0055a4)',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:'#fff', fontWeight:900, fontSize:14,
                boxShadow:'0 6px 20px rgba(0,56,118,0.3)',
              }}>ЗКУ</div>
              <h1 style={{ fontSize:22, fontWeight:900, color:'#003876', marginBottom:4 }}>{t.title}</h1>
              <p style={{ fontSize:13, color:'#94A3B8' }}>{t.sub}</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {/* Role */}
              <div>
                <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
                  {t.role_label}
                </label>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                  {(['student','teacher'] as Role[]).map(r => (
                    <button key={r} type="button" onClick={() => setRole(r)} style={{
                      padding:'11px', borderRadius:10, fontSize:14, fontWeight:700,
                      cursor:'pointer', border:'none', transition:'all 0.15s', fontFamily:'inherit',
                      background: role===r
                        ? 'linear-gradient(135deg, #003876, #0055a4)'
                        : 'rgba(0,56,118,0.05)',
                      color: role===r ? '#fff' : '#64748B',
                      boxShadow: role===r ? '0 4px 12px rgba(0,56,118,0.25)' : 'none',
                    }}>
                      {r==='student' ? t.role_student : t.role_teacher}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              {[
                { label: t.name_label,  type:'text',     value:name,     set:setName,     ph:t.name_ph  },
                { label: t.email_label, type:'email',    value:email,    set:setEmail,    ph:t.email_ph },
                { label: t.pass_label,  type:'password', value:password, set:setPassword, ph:t.pass_ph  },
              ].map((f) => (
                <div key={f.label}>
                  <label style={{ display:'block', fontSize:11, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.06em', marginBottom:8 }}>
                    {f.label}
                  </label>
                  <input
                    type={f.type} value={f.value}
                    onChange={e => { f.set(e.target.value); setError('') }}
                    placeholder={f.ph}
                    style={{
                      width:'100%', padding:'12px 16px', borderRadius:10,
                      border:'1.5px solid rgba(0,56,118,0.15)',
                      fontSize:14, outline:'none', boxSizing:'border-box',
                      background:'#F8FAFC', fontFamily:'inherit',
                      transition:'border-color 0.15s',
                    }}
                    onFocus={e => { e.currentTarget.style.borderColor='#003876'; e.currentTarget.style.background='#fff' }}
                    onBlur={e => { e.currentTarget.style.borderColor='rgba(0,56,118,0.15)'; e.currentTarget.style.background='#F8FAFC' }}
                  />
                </div>
              ))}

              {/* Error */}
              {error && (
                <div style={{
                  padding:'10px 14px', borderRadius:8,
                  background:'rgba(220,38,38,0.06)',
                  border:'1px solid rgba(220,38,38,0.2)',
                  color:'#DC2626', fontSize:13, fontWeight:500,
                }}>⚠ {error}</div>
              )}

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width:'100%', padding:'14px', borderRadius:10, border:'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                background: loading ? '#94A3B8' : 'linear-gradient(135deg, #003876 0%, #0055a4 100%)',
                color:'#fff', fontSize:15, fontWeight:800,
                boxShadow: loading ? 'none' : '0 6px 20px rgba(0,56,118,0.3)',
                transition:'all 0.15s', fontFamily:'inherit',
              }}>
                {loading ? t.loading : t.btn}
              </button>
            </form>

            <div style={{ textAlign:'center', marginTop:20, fontSize:14, color:'#64748B' }}>
              {t.have_account}{' '}
              <Link href="/english/zku/login" style={{ color:'#003876', fontWeight:700, textDecoration:'none' }}>
                {t.login}
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
