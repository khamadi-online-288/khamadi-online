'use client'

import { useEffect, useState } from 'react'
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
  'Алматы',
  'Астана',
  'Шымкент',
  'Абай облысы',
  'Ақмола облысы',
  'Ақтөбе облысы',
  'Алматы облысы',
  'Атырау облысы',
  'Батыс Қазақстан облысы',
  'Жамбыл облысы',
  'Жетісу облысы',
  'Қарағанды облысы',
  'Қостанай облысы',
  'Қызылорда облысы',
  'Маңғыстау облысы',
  'Павлодар облысы',
  'Солтүстік Қазақстан облысы',
  'Түркістан облысы',
  'Ұлытау облысы',
  'Шығыс Қазақстан облысы',
]

function SectionCard({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle?: string
  children: React.ReactNode
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(226,232,240,0.95)',
        borderRadius: '28px',
        padding: '24px',
        boxShadow:
          '0 20px 40px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div style={{ marginBottom: '18px' }}>
        <div
          style={{
            fontSize: '22px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '6px',
            letterSpacing: '-0.4px',
          }}
        >
          {title}
        </div>
        {subtitle && (
          <div
            style={{
              fontSize: '13px',
              color: '#64748B',
              lineHeight: 1.6,
            }}
          >
            {subtitle}
          </div>
        )}
      </div>
      {children}
    </div>
  )
}

function Field({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label
        style={{
          display: 'block',
          marginBottom: '8px',
          fontSize: '13px',
          fontWeight: 800,
          color: '#334155',
        }}
      >
        {label}
      </label>
      {children}
    </div>
  )
}

function ReadonlyBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        padding: '12px 14px',
        borderRadius: '16px',
        background: 'linear-gradient(135deg, #E0F2FE, #F8FAFC)',
        border: '1px solid #BAE6FD',
        color: '#0369A1',
        fontSize: '14px',
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  borderRadius: '16px',
  border: '1px solid #CBD5E1',
  outline: 'none',
  fontSize: '14px',
  color: '#0F172A',
  background: '#FFFFFF',
  boxShadow: '0 4px 10px rgba(15,23,42,0.02) inset',
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
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
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error || !data) {
        alert('Профиль жүктелмеді')
        setLoading(false)
        return
      }

      const profile = data as Profile

      setProfileId(profile.id)
      setRole(profile.role)
      setFullName(profile.full_name || '')
      setCity(profile.city || '')
      setSchoolName(profile.school_name || '')
      setGrade(profile.grade ? String(profile.grade) : '')
      setLanguage(profile.language || '')
      setEmail(profile.email || user.email || '')
      setPhone(profile.phone || '')
      setTargetScore(profile.target_score || '')
      setExamYear(profile.exam_year ? String(profile.exam_year) : '2026')
      setProfileSubject1(profile.profile_subject_1 || '')
      setProfileSubject2(profile.profile_subject_2 || '')
      setStudentCode(profile.student_code || '')
      setAvatarUrl(profile.avatar_url || '')
      setBio(profile.bio || '')
      setDailyGoal(profile.daily_goal ? String(profile.daily_goal) : '')
      setStudyTimePreference(profile.study_time_preference || '')
      setLoading(false)
    }

    loadProfile()
  }, [])

  const handleAvatarUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    try {
      const file = e.target.files?.[0]
      if (!file || !profileId) return

      setUploading(true)

      const fileExt = file.name.split('.').pop()
      const filePath = `${profileId}-${Date.now()}.${fileExt}`

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true })

      if (uploadError) {
        alert(uploadError.message)
        return
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = data.publicUrl

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profileId)

      if (updateError) {
        alert(updateError.message)
        return
      }

      setAvatarUrl(publicUrl)
      alert('Сурет сәтті жүктелді')
    } finally {
      setUploading(false)
    }
  }

  const handleSave = async () => {
    if (!profileId) return

    try {
      setSaving(true)

      const payload: Record<string, any> = {
        full_name: fullName,
        city,
        school_name: schoolName,
        language,
        email,
        phone,
        target_score: targetScore,
        exam_year: examYear ? Number(examYear) : null,
        bio,
        daily_goal: dailyGoal ? Number(dailyGoal) : null,
        study_time_preference: studyTimePreference,
      }

      if (role === 'student') {
        payload.grade = grade ? Number(grade) : null
      }

      const { error } = await supabase
        .from('profiles')
        .update(payload)
        .eq('id', profileId)

      if (error) {
        alert(error.message)
        return
      }

      alert('Профиль сәтті сақталды')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div
        style={{
          padding: '24px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        Жүктелуде...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
      <SectionCard
        title="Профиль"
        subtitle="Жеке мәліметтеріңді толықтырып, аккаунтыңды өзіңе ыңғайла."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '180px 1fr',
            gap: '24px',
            alignItems: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '28px',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, #E0F2FE, #F8FAFC)',
                border: '1px solid #BAE6FD',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 20px 40px rgba(14,165,233,0.12)',
              }}
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt="Avatar"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <div
                  style={{
                    fontSize: '42px',
                    fontWeight: 800,
                    color: '#0369A1',
                  }}
                >
                  {fullName ? fullName[0].toUpperCase() : 'A'}
                </div>
              )}
            </div>

            <label
              style={{
                padding: '12px 16px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
                color: '#FFFFFF',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: '0 14px 26px rgba(14,165,233,0.18)',
              }}
            >
              {uploading ? 'Жүктелуде...' : 'Сурет жүктеу'}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarUpload}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
            }}
          >
            <ReadonlyBadge>Рөлі: {role === 'student' ? 'Оқушы' : 'Ата-ана'}</ReadonlyBadge>
            <ReadonlyBadge>Email: {email || '-'}</ReadonlyBadge>

            {role === 'student' && (
              <>
                <ReadonlyBadge>
                  Бейіндік пән 1: {profileSubject1 || 'Таңдалмаған'}
                </ReadonlyBadge>
                <ReadonlyBadge>
                  Бейіндік пән 2: {profileSubject2 || 'Таңдалмаған'}
                </ReadonlyBadge>
              </>
            )}

            {role === 'student' && (
              <ReadonlyBadge>
                Ата-ана коды: {studentCode || 'Жоқ'}
              </ReadonlyBadge>
            )}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Жеке мәліметтер"
        subtitle="Негізгі ақпараттарды толтыр."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}
        >
          <Field label="Аты-жөні">
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Толық аты-жөніңіз"
              style={inputStyle}
            />
          </Field>

          <Field label="Қала / облыс">
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              style={inputStyle}
            >
              <option value="">Таңдаңыз</option>
              {cities.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </Field>

          <Field label="Мектеп атауы">
            <input
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Мектебіңіздің атауы"
              style={inputStyle}
            />
          </Field>

          {role === 'student' && (
            <Field label="Сынып">
              <select
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                style={inputStyle}
              >
                <option value="">Таңдаңыз</option>
                <option value="9">9 сынып</option>
                <option value="10">10 сынып</option>
                <option value="11">11 сынып</option>
              </select>
            </Field>
          )}

          <Field label="Оқу тілі">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={inputStyle}
            >
              <option value="">Таңдаңыз</option>
              <option value="Қазақша">Қазақша</option>
              <option value="Орысша">Орысша</option>
            </select>
          </Field>

          <Field label="Телефон нөмірі">
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+7 ..."
              style={inputStyle}
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="ҰБТ параметрлері"
        subtitle="Мақсатың мен оқу режиміңді өзіңе ыңғайла."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '14px',
          }}
        >
          <Field label="Мақсатты балл">
            <select
              value={targetScore}
              onChange={(e) => setTargetScore(e.target.value)}
              style={inputStyle}
            >
              <option value="">Таңдаңыз</option>
              <option value="70+">70+</option>
              <option value="90+">90+</option>
              <option value="110+">110+</option>
              <option value="120+">120+</option>
            </select>
          </Field>

          <Field label="ҰБТ жылы">
            <select
              value={examYear}
              onChange={(e) => setExamYear(e.target.value)}
              style={inputStyle}
            >
              <option value="2026">2026</option>
              <option value="2027">2027</option>
              <option value="2028">2028</option>
            </select>
          </Field>

          <Field label="Күндік мақсат">
            <select
              value={dailyGoal}
              onChange={(e) => setDailyGoal(e.target.value)}
              style={inputStyle}
            >
              <option value="">Таңдаңыз</option>
              <option value="20">20 сұрақ</option>
              <option value="50">50 сұрақ</option>
              <option value="100">100 сұрақ</option>
            </select>
          </Field>

          <Field label="Оқу уақыты">
            <select
              value={studyTimePreference}
              onChange={(e) => setStudyTimePreference(e.target.value)}
              style={inputStyle}
            >
              <option value="">Таңдаңыз</option>
              <option value="Таңертең">Таңертең</option>
              <option value="Түсте">Түсте</option>
              <option value="Кешке">Кешке</option>
            </select>
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Өзім туралы"
        subtitle="Қысқаша мотивацияңды немесе мақсатыңды жаз."
      >
        <Field label="Bio">
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Мысалы: Мен 120+ балл жинап, грантқа түскім келеді..."
            style={{
              ...inputStyle,
              minHeight: '130px',
              resize: 'vertical',
            }}
          />
        </Field>
      </SectionCard>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={handleSave}
          style={{
            padding: '15px 22px',
            borderRadius: '16px',
            border: 'none',
            background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
            color: '#FFFFFF',
            fontSize: '14px',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 16px 32px rgba(14,165,233,0.22)',
            opacity: saving ? 0.7 : 1,
          }}
        >
          {saving ? 'Сақталуда...' : 'Сақтау'}
        </button>
      </div>
    </div>
  )
}