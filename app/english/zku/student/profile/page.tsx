'use client'

import React, { useState, useEffect, useRef } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import {
  IcUser, IcLock, IcBell, IcBarChart, IcLightning, IcFlame, IcTrophy, IcBook,
  IcBookOpen, IcHeadphones, IcEdit, IcMic, IcClipboard, IcStar, IcMail,
  IcRocket, IcAlertTri,
} from '../_icons'

const N = '#003876'
const S = '#1B8FC4'
const T = '#1D9E75'
const O = '#EF9F27'
const P = '#534AB7'
const C = '#D85A30'

type Tab = 'profile' | 'security' | 'notifications' | 'stats'

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>
      {children}
    </div>
  )
}

function FieldInput({ value, onChange, type = 'text', placeholder, disabled }: {
  value: string; onChange?: (v: string) => void
  type?: string; placeholder?: string; disabled?: boolean
}) {
  return (
    <input
      type={type} value={value} placeholder={placeholder} disabled={disabled}
      onChange={e => onChange?.(e.target.value)}
      style={{
        width: '100%', padding: '11px 14px', borderRadius: 10, boxSizing: 'border-box',
        border: `1.5px solid ${disabled ? '#F1F5F9' : 'rgba(0,56,118,0.15)'}`,
        fontSize: 14, fontFamily: 'inherit', outline: 'none',
        background: disabled ? '#F8FAFC' : '#fff',
        color: disabled ? '#94A3B8' : '#1E293B',
        transition: 'border-color 0.15s',
      }}
      onFocus={e => { if (!disabled) e.currentTarget.style.borderColor = N }}
      onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)' }}
    />
  )
}

function SaveBtn({ onClick, saved, t }: { onClick: () => void; saved: boolean; t: { save: string; saved: string } }) {
  return (
    <button onClick={onClick} style={{
      padding: '11px 28px', borderRadius: 10, border: 'none', cursor: 'pointer',
      background: saved ? T : N, color: '#fff',
      fontSize: 13, fontWeight: 700, fontFamily: 'inherit',
      transition: 'all 0.2s',
      boxShadow: saved ? '0 4px 14px rgba(29,158,117,0.3)' : '0 4px 14px rgba(0,56,118,0.25)',
    }}>
      {saved ? t.saved : t.save}
    </button>
  )
}

export default function ProfilePage() {
  const { t } = useZkuLang()
  const [tab, setTab]     = useState<Tab>('profile')
  const [saved, setSaved] = useState<Record<string, boolean>>({})
  const [loading, setLoading] = useState(true)
  const userIdRef = useRef<string | null>(null)

  // Profile fields
  const [fullName, setFullName] = useState('')
  const [email,    setEmail]    = useState('')
  const [phone,    setPhone]    = useState('')
  const [city,     setCity]     = useState('')
  const [bio,      setBio]      = useState('')
  const [group,    setGroup]    = useState('')
  const [level,    setLevel]    = useState('A1')
  const [xp,         setXp]         = useState(0)
  const [streak,     setStreak]     = useState(0)
  const [bestStreak, setBestStreak] = useState(0)
  const [lessonsDone, setLessonsDone] = useState(0)
  const [regDate,    setRegDate]    = useState('')

  // Security
  const [oldPass,   setOldPass]   = useState('')
  const [newPass,   setNewPass]   = useState('')
  const [confPass,  setConfPass]  = useState('')
  const [passError, setPassError] = useState('')

  // Notifications
  const [notifs, setNotifs] = useState(() => {
    if (typeof window === 'undefined') return { homework: true, streak: true, newLesson: true, achievements: true, email: false }
    try { return JSON.parse(localStorage.getItem('zku-notifs') ?? 'null') ?? { homework: true, streak: true, newLesson: true, achievements: true, email: false } } catch { return { homework: true, streak: true, newLesson: true, achievements: true, email: false } }
  })

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) { setLoading(false); return }

      userIdRef.current = user.id
      setEmail(user.email ?? '')
      setRegDate(new Date(user.created_at).toLocaleDateString('ru-RU'))

      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('full_name, current_level, total_xp, current_streak, longest_streak')
        .eq('user_id', user.id)
        .maybeSingle()

      const meta = user.user_metadata
      const metaName: string = meta?.full_name ?? meta?.name ?? ''
      const emailSlug = user.email?.split('@')[0] ?? ''
      const resolveName = (dbName: string | null) => {
        if (metaName && metaName !== emailSlug) return metaName
        if (dbName && dbName !== emailSlug) return dbName
        return metaName || dbName || emailSlug
      }

      if (profile) {
        setFullName(resolveName(profile.full_name))
        setLevel(profile.current_level ?? 'A1')
        setXp(profile.total_xp ?? 0)
        setStreak(profile.current_streak ?? 0)
        setBestStreak(profile.longest_streak ?? 0)
      } else {
        setFullName(resolveName(null))
      }
      const { count } = await supabase
        .from('english_lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .eq('completed', true)
      setLessonsDone(count ?? 0)
      setLoading(false)
    }
    load()
  }, [])

  function save(key: string) {
    setSaved(s => ({ ...s, [key]: true }))
    setTimeout(() => setSaved(s => ({ ...s, [key]: false })), 2500)
  }

  async function handleProfileSave() {
    const uid = userIdRef.current
    if (!uid) return
    const supabase = createEnglishClient()

    // Check if profile row exists
    const { data: existing } = await supabase
      .from('english_user_profiles')
      .select('user_id')
      .eq('user_id', uid)
      .maybeSingle()

    if (existing) {
      const { error: updateError } = await supabase
        .from('english_user_profiles')
        .update({ full_name: fullName })
        .eq('user_id', uid)

      if (updateError) {
        console.error('Update failed:', updateError.message, updateError.code)
        return
      }
    } else {
      const { error: insertError } = await supabase
        .from('english_user_profiles')
        .insert({ user_id: uid, full_name: fullName, role: 'student' })

      if (insertError) {
        console.error('Insert failed:', insertError.message, insertError.code)
        return
      }
    }

    sessionStorage.setItem('zku-display-name', fullName)
    window.dispatchEvent(new CustomEvent('zku-profile-updated', { detail: { fullName } }))
    save('profile')
  }

  async function handlePassSave() {
    if (!oldPass || !newPass || !confPass) { setPassError(t.profile.pass_fill_all); return }
    if (newPass !== confPass)              { setPassError(t.profile.pass_mismatch); return }
    if (newPass.length < 8)               { setPassError(t.profile.pass_too_short); return }
    setPassError('')
    const supabase = createEnglishClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user?.email) return
    // Re-auth to verify old password
    const { error: reAuthError } = await supabase.auth.signInWithPassword({ email: user.email, password: oldPass })
    if (reAuthError) { setPassError(t.profile.pass_fill_all + ' (неверный текущий пароль)'); return }
    const { error: updateError } = await supabase.auth.updateUser({ password: newPass })
    if (updateError) { setPassError(updateError.message); return }
    setOldPass(''); setNewPass(''); setConfPass('')
    save('pass')
  }

  const initial = fullName.charAt(0).toUpperCase() || '?'

  const TABS: { id: Tab; label: string; icon: React.ReactElement }[] = [
    { id: 'profile',       label: t.profile.tab_profile,  icon: <IcUser     size={15} /> },
    { id: 'security',      label: t.profile.tab_security, icon: <IcLock     size={15} /> },
    { id: 'notifications', label: t.profile.tab_notifs,   icon: <IcBell     size={15} /> },
    { id: 'stats',         label: t.profile.tab_stats,    icon: <IcBarChart size={15} /> },
  ]

  const STATS = [
    { icon: <IcLightning size={18} color="#C9933B" />, v: xp.toLocaleString(), l: t.profile.stat_xp,     color: '#C9933B', bg: '#FEF3C7' },
    { icon: <IcFlame     size={18} color="#EF4444" />, v: streak,              l: t.profile.stat_streak, color: '#EF4444', bg: '#FEE2E2' },
    { icon: <IcTrophy    size={18} color={N}       />, v: bestStreak,          l: t.profile.stat_best,   color: N,         bg: '#DBEAFE' },
    { icon: <IcBook      size={18} color={T}       />, v: lessonsDone,          l: t.profile.stat_lessons,color: T,         bg: '#DCFCE7' },
  ]

  const [skillPcts, setSkillPcts] = useState({ reading: 0, listening: 0, writing: 0, speaking: 0, grammar: 0 })

  useEffect(() => {
    async function loadSkills() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user) return
      const { data } = await supabase
        .from('english_lesson_progress')
        .select('lesson_type, score')
        .eq('user_id', session.user.id)
        .eq('completed', true)
      if (!data || data.length === 0) return
      const counts: Record<string, { sum: number; n: number }> = {}
      for (const row of data as { lesson_type: string; score: number | null }[]) {
        const type = row.lesson_type ?? 'reading'
        if (!counts[type]) counts[type] = { sum: 0, n: 0 }
        counts[type].sum += row.score ?? 80
        counts[type].n++
      }
      const avg = (type: string) => counts[type] ? Math.round(counts[type].sum / counts[type].n) : 0
      setSkillPcts({ reading: avg('reading'), listening: avg('listening'), writing: avg('writing'), speaking: avg('speaking'), grammar: avg('grammar') })
    }
    loadSkills()
  }, [])

  const SKILLS = [
    { icon: <IcBookOpen   size={16} color={T} />, name: t.common.skill_reading,   pct: skillPcts.reading,   color: T },
    { icon: <IcHeadphones size={16} color={O} />, name: t.common.skill_listening, pct: skillPcts.listening, color: O },
    { icon: <IcEdit       size={16} color={P} />, name: t.common.skill_writing,   pct: skillPcts.writing,   color: P },
    { icon: <IcMic        size={16} color={C} />, name: t.common.skill_speaking,  pct: skillPcts.speaking,  color: C },
    { icon: <IcEdit       size={16} color={S} />, name: t.common.skill_grammar,   pct: skillPcts.grammar,   color: S },
  ]

  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', fontFamily: "'Montserrat', sans-serif", color: N, fontWeight: 700 }}>
        {t.common.loading}
      </div>
    )
  }

  return (
    <div style={{ padding: '28px 32px 48px', maxWidth: 900, margin: '0 auto', fontFamily: "'Montserrat', sans-serif" }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
        <div style={{ position: 'relative' }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: `linear-gradient(135deg, ${S}, ${N})`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 900, fontSize: 28,
            boxShadow: '0 6px 20px rgba(0,56,118,0.25)',
          }}>{initial}</div>
          <button style={{
            position: 'absolute', bottom: 0, right: 0,
            width: 24, height: 24, borderRadius: '50%',
            background: N, border: '2px solid #fff',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer',
          }}><IcEdit size={11} color="#fff" /></button>
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 900, color: N, margin: 0, letterSpacing: '-0.02em' }}>{fullName || email}</h1>
          <div style={{ fontSize: 13, color: '#64748B', marginTop: 2 }}>{email}</div>
          <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: '#DCFCE7', color: T }}>{level}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: '#FEE2E2', color: '#EF4444', display: 'inline-flex', alignItems: 'center', gap: 4 }}><IcFlame size={11} color="#EF4444" /> {streak} {t.common.days}</span>
            <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 99, background: '#FEF3C7', color: '#C9933B' }}>{xp.toLocaleString()} {t.common.xp}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#fff', borderRadius: 14, padding: 5, marginBottom: 20, boxShadow: '0 1px 4px rgba(0,0,0,0.05)', width: 'fit-content' }}>
        {TABS.map(tb => (
          <button key={tb.id} onClick={() => setTab(tb.id)} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '9px 18px', borderRadius: 10, border: 'none', cursor: 'pointer',
            background: tab === tb.id ? N : 'transparent',
            color: tab === tb.id ? '#fff' : '#64748B',
            fontSize: 13, fontWeight: tab === tb.id ? 700 : 500,
            fontFamily: 'inherit', transition: 'all 0.15s',
          }}>
            <span>{tb.icon}</span> {tb.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 14 }}>

        {/* ══ PROFILE TAB ══ */}
        {tab === 'profile' && (
          <>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 20 }}>{t.profile.title_info}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <Label>{t.profile.full_name}</Label>
                  <FieldInput value={fullName} onChange={setFullName} />
                </div>
                <div>
                  <Label>Email</Label>
                  <FieldInput value={email} disabled />
                </div>
                <div>
                  <Label>{t.profile.phone}</Label>
                  <FieldInput value={phone} onChange={setPhone} type="tel" />
                </div>
                <div>
                  <Label>{t.profile.city}</Label>
                  <FieldInput value={city} onChange={setCity} />
                </div>
              </div>
              <div style={{ marginBottom: 16 }}>
                <Label>{t.profile.bio}</Label>
                <textarea
                  value={bio} onChange={e => setBio(e.target.value)}
                  style={{
                    width: '100%', padding: '11px 14px', borderRadius: 10,
                    border: '1.5px solid rgba(0,56,118,0.15)',
                    fontSize: 14, fontFamily: 'inherit', outline: 'none',
                    resize: 'vertical', minHeight: 80, boxSizing: 'border-box', color: '#1E293B',
                  }}
                  onFocus={e => { e.currentTarget.style.borderColor = N }}
                  onBlur={e => { e.currentTarget.style.borderColor = 'rgba(0,56,118,0.15)' }}
                />
              </div>
              <SaveBtn onClick={handleProfileSave} saved={!!saved['profile']} t={t.profile} />
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 20 }}>{t.profile.title_study}</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
                <div>
                  <Label>{t.profile.group}</Label>
                  <FieldInput value={group} onChange={setGroup} />
                </div>
                <div>
                  <Label>{t.profile.level}</Label>
                  <FieldInput value={level} disabled />
                </div>
                <div>
                  <Label>{t.profile.reg_date}</Label>
                  <FieldInput value={regDate} disabled />
                </div>
                <div>
                  <Label>{t.profile.last_active}</Label>
                  <FieldInput value={t.profile.today} disabled />
                </div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: '#F0FDF4', border: '1px solid #86EFAC', fontSize: 13, color: T, fontWeight: 600 }}>
                {t.profile.level_auto_hint}
              </div>
            </div>
          </>
        )}

        {/* ══ SECURITY TAB ══ */}
        {tab === 'security' && (
          <>
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 20 }}>{t.profile.title_pass}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 440 }}>
                <div>
                  <Label>{t.profile.old_pass}</Label>
                  <FieldInput value={oldPass} onChange={setOldPass} type="password" placeholder="••••••••" />
                </div>
                <div>
                  <Label>{t.profile.new_pass}</Label>
                  <FieldInput value={newPass} onChange={setNewPass} type="password" placeholder={t.profile.pass_placeholder} />
                </div>
                <div>
                  <Label>{t.profile.conf_pass}</Label>
                  <FieldInput value={confPass} onChange={setConfPass} type="password" placeholder={t.profile.pass_confirm_placeholder} />
                </div>
                {passError && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: '#FEE2E2', border: '1px solid #FECACA', fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                    {passError}
                  </div>
                )}
                {saved['pass'] && (
                  <div style={{ padding: '10px 14px', borderRadius: 10, background: '#DCFCE7', border: '1px solid #86EFAC', fontSize: 13, color: T, fontWeight: 600 }}>
                    {t.profile.pass_changed}
                  </div>
                )}
                <SaveBtn onClick={handlePassSave} saved={!!saved['pass']} t={t.profile} />
              </div>
            </div>

            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>{t.profile.sessions}</div>
              {[
                { device: 'Chrome · Windows 10', location: 'Oral, Kazakhstan',  time: t.profile.today, current: true },
                { device: 'Safari · iPhone',     location: 'Almaty, Kazakhstan', time: '3 days ago',    current: false },
              ].map((s, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '12px 14px', borderRadius: 12, marginBottom: 8,
                  background: s.current ? '#F0FDF4' : '#FAFAFA',
                  border: `1px solid ${s.current ? '#86EFAC' : '#F1F5F9'}`,
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: N }}>{s.device}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8' }}>{s.location} · {s.time}</div>
                  </div>
                  {s.current
                    ? <span style={{ fontSize: 11, fontWeight: 700, color: T, background: '#DCFCE7', padding: '3px 10px', borderRadius: 99 }}>{t.profile.current}</span>
                    : <button style={{ fontSize: 12, fontWeight: 600, color: C, background: '#FEE2E2', border: 'none', padding: '4px 12px', borderRadius: 99, cursor: 'pointer', fontFamily: 'inherit' }}>{t.profile.end_session}</button>
                  }
                </div>
              ))}
            </div>
          </>
        )}

        {/* ══ NOTIFICATIONS TAB ══ */}
        {tab === 'notifications' && (
          <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 20 }}>{t.profile.title_notifs}</div>
            {[
              { key: 'homework',     icon: <IcClipboard size={18} color={N} />, label: t.profile.notif_hw_label,     desc: t.profile.notif_hw_desc },
              { key: 'streak',       icon: <IcFlame     size={18} color="#EF4444" />, label: t.profile.notif_streak_label, desc: t.profile.notif_streak_desc },
              { key: 'newLesson',    icon: <IcBook      size={18} color={N} />, label: t.profile.notif_lesson_label, desc: t.profile.notif_lesson_desc },
              { key: 'achievements', icon: <IcStar      size={18} color="#C9933B" />, label: t.profile.notif_ach_label,    desc: t.profile.notif_ach_desc },
              { key: 'email',        icon: <IcMail      size={18} color={N} />, label: t.profile.notif_email_label,  desc: t.profile.notif_email_desc },
            ].map(n => (
              <div key={n.key} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '14px 0', borderBottom: '1px solid #F8FAFC' }}>
                <div style={{ width: 40, height: 40, borderRadius: 11, flexShrink: 0, background: '#F8FBFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {n.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: N }}>{n.label}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>{n.desc}</div>
                </div>
                <div
                  onClick={() => setNotifs((p: typeof notifs) => ({ ...p, [n.key]: !p[n.key as keyof typeof notifs] }))}
                  style={{ width: 44, height: 24, borderRadius: 99, flexShrink: 0, cursor: 'pointer', background: notifs[n.key as keyof typeof notifs] ? N : '#E2E8F0', position: 'relative', transition: 'background 0.2s' }}
                >
                  <div style={{ position: 'absolute', top: 3, left: notifs[n.key as keyof typeof notifs] ? 22 : 3, width: 18, height: 18, borderRadius: '50%', background: '#fff', transition: 'left 0.2s', boxShadow: '0 1px 4px rgba(0,0,0,0.15)' }} />
                </div>
              </div>
            ))}
            <div style={{ marginTop: 20 }}>
              <SaveBtn onClick={() => { localStorage.setItem('zku-notifs', JSON.stringify(notifs)); save('notifs') }} saved={!!saved['notifs']} t={t.profile} />
            </div>
          </div>
        )}

        {/* ══ STATS TAB ══ */}
        {tab === 'stats' && (
          <>
            {/* Stats grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {STATS.map(s => (
                <div key={s.l} style={{ background: '#fff', borderRadius: 16, padding: '18px 16px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                  <div style={{ width: 40, height: 40, borderRadius: 11, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>{s.icon}</div>
                  <div style={{ fontSize: 22, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 4 }}>{s.l}</div>
                </div>
              ))}
            </div>

            {/* Skills */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 18 }}>{t.profile.title_stats}</div>
              {SKILLS.every(s => s.pct === 0) ? (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><IcBarChart size={32} color={N} /></div>
                  <div style={{ fontWeight: 700, color: N, marginBottom: 4 }}>{t.profile.no_skills}</div>
                  <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.profile.no_skills_sub}</div>
                </div>
              ) : (
                SKILLS.map(({ icon, name, pct, color }) => (
                  <div key={name} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                    <span style={{ display: 'flex', width: 22, justifyContent: 'center' }}>{icon}</span>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#334155', width: 80 }}>{name}</span>
                    <div style={{ flex: 1, height: 8, background: '#F1F5F9', borderRadius: 99, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 800, color: N, width: 40, textAlign: 'right' }}>{pct}%</span>
                  </div>
                ))
              )}
            </div>

            {/* Activity */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>{t.profile.title_act}</div>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><IcRocket size={32} color={N} /></div>
                <div style={{ fontWeight: 700, color: N, marginBottom: 4 }}>{t.profile.no_activity}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.profile.no_activity_sub}</div>
              </div>
            </div>

            {/* Achievements */}
            <div style={{ background: '#fff', borderRadius: 20, padding: '24px 28px', boxShadow: '0 1px 4px rgba(0,0,0,0.05)' }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>{t.profile.achievements_title}</div>
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}><IcStar size={32} color="#C9933B" /></div>
                <div style={{ fontWeight: 700, color: N, marginBottom: 4 }}>{t.profile.achievements_empty}</div>
                <div style={{ fontSize: 12, color: '#94A3B8' }}>{t.profile.achievements_empty_sub}</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}