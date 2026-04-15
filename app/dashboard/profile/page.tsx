'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  role: 'student' | 'parent'
  full_name: string | null
  city: string | null
  school_name: string | null
  grade: number | null
  language: string | null
  email: string | null
  phone: string | null
  target_score: string | null
  exam_year: number | null
  profile_subject_1: string | null
  profile_subject_2: string | null
  student_code: string | null
  avatar_url: string | null
  bio: string | null
  daily_goal: number | null
  study_time_preference: string | null
}

const cities = [
  'Алматы', 'Астана', 'Шымкент', 'Абай облысы', 'Ақмола облысы',
  'Ақтөбе облысы', 'Алматы облысы', 'Атырау облысы',
  'Батыс Қазақстан облысы', 'Жамбыл облысы', 'Жетісу облысы',
  'Қарағанды облысы', 'Қостанай облысы', 'Қызылорда облысы',
  'Маңғыстау облысы', 'Павлодар облысы', 'Солтүстік Қазақстан облысы',
  'Түркістан облысы', 'Ұлытау облысы', 'Шығыс Қазақстан облысы',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

const inputStyle: React.CSSProperties = {
  width: '100%', padding: '13px 14px', borderRadius: 14,
  border: '1px solid rgba(14,165,233,0.2)', outline: 'none',
  fontSize: 14, color: '#0f172a', background: '#f8fafc',
  fontFamily: 'inherit', fontWeight: 600, boxSizing: 'border-box',
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{ display: 'block', marginBottom: 7, fontSize: 12, fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function SectionCard({ title, subtitle, children, delay = 0 }: { title: string; subtitle?: string; children: React.ReactNode; delay?: number }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      style={{
        background: 'rgba(255,255,255,0.9)', border: '1px solid rgba(14,165,233,0.14)',
        borderRadius: 28, padding: 26,
        boxShadow: '0 16px 36px rgba(14,165,233,0.07)',
        backdropFilter: 'blur(12px)',
      }}
    >
      <div style={{ marginBottom: 18 }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', marginBottom: 5, letterSpacing: '-0.03em' }}>{title}</div>
        {subtitle && <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.6 }}>{subtitle}</div>}
      </div>
      {children}
    </motion.div>
  )
}

function ReadonlyBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ padding: '12px 14px', borderRadius: 14, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.15)', color: '#0369a1' }}>
      <div style={{ fontSize: 10, fontWeight: 900, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 14, fontWeight: 800 }}>{value || '—'}</div>
    </div>
  )
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [profileId, setProfileId] = useState<string | null>(null)

  const [role, setRole] = useState<'student' | 'parent'>('student')
  const [fullName, setFullName] = useState('')
  const [city, setCity] = useState('')
  const [schoolName, setSchoolName] = useState('')
  const [grade, setGrade] = useState('')
  const [language, setLanguage] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [targetScore, setTargetScore] = useState('')
  const [examYear, setExamYear] = useState('2026')
  const [profileSubject1, setProfileSubject1] = useState('')
  const [profileSubject2, setProfileSubject2] = useState('')
  const [studentCode, setStudentCode] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [bio, setBio] = useState('')
  const [dailyGoal, setDailyGoal] = useState('')
  const [studyTimePreference, setStudyTimePreference] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/login'; return }

      const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      if (error || !data) { setLoading(false); return }

      const p = data as Profile
      setProfileId(p.id)
      setRole(p.role)
      setFullName(p.full_name || '')
      setCity(p.city || '')
      setSchoolName(p.school_name || '')
      setGrade(p.grade ? String(p.grade) : '')
      setLanguage(p.language || '')
      setEmail(p.email || user.email || '')
      setPhone(p.phone || '')
      setTargetScore(p.target_score || '')
      setExamYear(p.exam_year ? String(p.exam_year) : '2026')
      setProfileSubject1(p.profile_subject_1 || '')
      setProfileSubject2(p.profile_subject_2 || '')
      setStudentCode(p.student_code || '')
      setAvatarUrl(p.avatar_url || '')
      setBio(p.bio || '')
      setDailyGoal(p.daily_goal ? String(p.daily_goal) : '')
      setStudyTimePreference(p.study_time_preference || '')
      setLoading(false)
    }
    loadProfile()
  }, [])

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file || !profileId) return
      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const filePath = `${profileId}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, { upsert: true })
      if (uploadError) { alert(uploadError.message); return }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase.from('profiles').update({ avatar_url: publicUrl }).eq('id', profileId)
      if (updateError) { alert(updateError.message); return }

      setAvatarUrl(publicUrl)
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!profileId) return
    try {
      setSaving(true)
      const payload: Record<string, unknown> = {
        full_name: fullName, city, school_name: schoolName, language,
        email, phone, target_score: targetScore,
        exam_year: examYear ? Number(examYear) : null,
        bio, daily_goal: dailyGoal ? Number(dailyGoal) : null,
        study_time_preference: studyTimePreference,
      }
      if (role === 'student') payload.grade = grade ? Number(grade) : null

      const { error } = await supabase.from('profiles').update(payload).eq('id', profileId)
      if (error) { alert(error.message); return }

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Профиль жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      {/* Page header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 26 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Профиль
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Жеке аккаунтым
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75 }}>
          Жеке мәліметтеріңді толықтырып, аккаунтыңды өзіңе ыңғайла.
        </p>
      </motion.div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        {/* Avatar + readonly info */}
        <SectionCard title="Профиль суреті" subtitle="Аватар жүктеп, жеке мәліметтерді тексер." delay={0.06}>
          <div style={{ display: 'grid', gridTemplateColumns: '160px 1fr', gap: 24, alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
              <div style={{ width: 140, height: 140, borderRadius: 24, overflow: 'hidden', background: 'linear-gradient(135deg, #e0f2fe, #f0f9ff)', border: '2px solid rgba(14,165,233,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 16px 36px rgba(14,165,233,0.14)' }}>
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ fontSize: 48, fontWeight: 900, color: '#0369a1' }}>
                    {fullName ? fullName[0].toUpperCase() : 'A'}
                  </div>
                )}
              </div>
              <motion.label
                whileHover={{ scale: 1.03, boxShadow: '0 14px 28px rgba(14,165,233,0.32)' }}
                whileTap={{ scale: 0.97 }}
                style={{ padding: '10px 16px', borderRadius: 12, background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)', color: '#fff', fontWeight: 800, fontSize: 13, cursor: 'pointer', boxShadow: '0 10px 22px rgba(14,165,233,0.22)', textAlign: 'center' }}
              >
                {uploading ? 'Жүктелуде...' : 'Сурет жүктеу'}
                <input type="file" accept="image/*" onChange={handleAvatarUpload} style={{ display: 'none' }} />
              </motion.label>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <ReadonlyBadge label="Рөл" value={role === 'student' ? 'Оқушы' : 'Ата-ана'} />
              <ReadonlyBadge label="Email" value={email} />
              {role === 'student' && (
                <>
                  <ReadonlyBadge label="Бейіндік пән 1" value={profileSubject1 || 'Таңдалмаған'} />
                  <ReadonlyBadge label="Бейіндік пән 2" value={profileSubject2 || 'Таңдалмаған'} />
                  <ReadonlyBadge label="Ата-ана коды" value={studentCode || 'Жоқ'} />
                </>
              )}
            </div>
          </div>
        </SectionCard>

        {/* Personal info */}
        <SectionCard title="Жеке мәліметтер" subtitle="Негізгі ақпараттарды толтыр." delay={0.1}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Аты-жөні">
              <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Толық аты-жөніңіз" style={inputStyle} />
            </Field>
            <Field label="Қала / облыс">
              <select value={city} onChange={(e) => setCity(e.target.value)} style={inputStyle}>
                <option value="">Таңдаңыз</option>
                {cities.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Мектеп атауы">
              <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="Мектебіңіздің атауы" style={inputStyle} />
            </Field>
            {role === 'student' && (
              <Field label="Сынып">
                <select value={grade} onChange={(e) => setGrade(e.target.value)} style={inputStyle}>
                  <option value="">Таңдаңыз</option>
                  <option value="9">9 сынып</option>
                  <option value="10">10 сынып</option>
                  <option value="11">11 сынып</option>
                </select>
              </Field>
            )}
            <Field label="Оқу тілі">
              <select value={language} onChange={(e) => setLanguage(e.target.value)} style={inputStyle}>
                <option value="">Таңдаңыз</option>
                <option value="Қазақша">Қазақша</option>
                <option value="Орысша">Орысша</option>
              </select>
            </Field>
            <Field label="Телефон нөмірі">
              <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+7 ..." style={inputStyle} />
            </Field>
          </div>
        </SectionCard>

        {/* UBT params */}
        <SectionCard title="ҰБТ параметрлері" subtitle="Мақсатың мен оқу режиміңді өзіңе ыңғайла." delay={0.14}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <Field label="Мақсатты балл">
              <select value={targetScore} onChange={(e) => setTargetScore(e.target.value)} style={inputStyle}>
                <option value="">Таңдаңыз</option>
                <option value="70+">70+</option>
                <option value="90+">90+</option>
                <option value="110+">110+</option>
                <option value="120+">120+</option>
              </select>
            </Field>
            <Field label="ҰБТ жылы">
              <select value={examYear} onChange={(e) => setExamYear(e.target.value)} style={inputStyle}>
                <option value="2026">2026</option>
                <option value="2027">2027</option>
                <option value="2028">2028</option>
              </select>
            </Field>
            <Field label="Күндік мақсат">
              <select value={dailyGoal} onChange={(e) => setDailyGoal(e.target.value)} style={inputStyle}>
                <option value="">Таңдаңыз</option>
                <option value="20">20 сұрақ</option>
                <option value="50">50 сұрақ</option>
                <option value="100">100 сұрақ</option>
              </select>
            </Field>
            <Field label="Оқу уақыты">
              <select value={studyTimePreference} onChange={(e) => setStudyTimePreference(e.target.value)} style={inputStyle}>
                <option value="">Таңдаңыз</option>
                <option value="Таңертең">Таңертең</option>
                <option value="Түсте">Түсте</option>
                <option value="Кешке">Кешке</option>
              </select>
            </Field>
          </div>
        </SectionCard>

        {/* Bio */}
        <SectionCard title="Өзім туралы" subtitle="Қысқаша мотивацияңды немесе мақсатыңды жаз." delay={0.18}>
          <Field label="Bio">
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Мысалы: Мен 120+ балл жинап, грантқа түскім келеді..."
              style={{ ...inputStyle, minHeight: 120, resize: 'vertical' }}
            />
          </Field>
        </SectionCard>

        {/* Save button */}
        <motion.div {...fadeUp(0.22)} style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, alignItems: 'center' }}>
          {saved && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ fontSize: 14, fontWeight: 700, color: '#16a34a', background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '10px 18px', borderRadius: 12 }}
            >
              ✓ Сәтті сақталды
            </motion.div>
          )}
          <motion.button
            onClick={handleSave}
            disabled={saving}
            whileHover={!saving ? { scale: 1.03, boxShadow: '0 18px 36px rgba(14,165,233,0.34)' } : {}}
            whileTap={!saving ? { scale: 0.97 } : {}}
            style={{
              padding: '14px 28px', borderRadius: 16, border: 'none',
              background: saving ? 'rgba(14,165,233,0.5)' : 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#fff', fontSize: 15, fontWeight: 800,
              cursor: saving ? 'not-allowed' : 'pointer',
              boxShadow: saving ? 'none' : '0 14px 28px rgba(14,165,233,0.26)',
              letterSpacing: '-0.01em',
            }}
          >
            {saving ? 'Сақталуда...' : 'Сақтау'}
          </motion.button>
        </motion.div>
      </div>
    </div>
  )
}
