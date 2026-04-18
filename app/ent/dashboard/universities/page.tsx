'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '@/lib/supabase'

type Profile = {
  id: string
  role: 'student' | 'parent'
  full_name: string | null
  city: string | null
  target_score: string | null
  profile_subject_1: string | null
  profile_subject_2: string | null
}

type University = {
  id: string
  name: string
  slug: string
  city: string | null
  description: string | null
  image_url?: string | null
  website: string | null
  has_dormitory: boolean | null
  has_military_department: boolean | null
  study_languages: string | null
  is_active?: boolean
}

type Program = {
  id: string
  university_id: string
  name: string
  code: string | null
  subject_1: string
  subject_2: string
  grant_score: number | null
  tuition_fee: number | null
  study_language: string | null
  degree_type: string | null
  is_active?: boolean
}

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function parseTargetScore(value: string | null): number | null {
  if (!value) return null
  const num = parseInt(value.replace('+', '').trim(), 10)
  return Number.isNaN(num) ? null : num
}

function SmallBadge({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'gray'
}) {
  const styles =
    variant === 'green'
      ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#166534' }
      : variant === 'gray'
      ? { background: '#f8fafc', border: '1px solid rgba(14,165,233,0.12)', color: '#475569' }
      : { background: '#e0f2fe', border: '1px solid #bae6fd', color: '#0369a1' }

  return (
    <div
      style={{
        padding: '7px 12px',
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 800,
        ...styles,
      }}
    >
      {children}
    </div>
  )
}

function EmptyState({ text }: { text: string }) {
  return (
    <div
      style={{
        padding: 24,
        borderRadius: 20,
        background: '#f0f9ff',
        border: '1px solid rgba(14,165,233,0.14)',
        color: '#64748b',
        lineHeight: 1.7,
        fontSize: 14,
        fontWeight: 600,
        textAlign: 'center',
      }}
    >
      {text}
    </div>
  )
}

function UniversityCard({
  university,
  programs,
  matchLabel,
  index = 0,
}: {
  university: University
  programs: Program[]
  matchLabel?: string
  index?: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, boxShadow: '0 22px 44px rgba(14,165,233,0.12)' }}
      style={{
        background: '#fff',
        border: '1px solid rgba(14,165,233,0.14)',
        borderRadius: 26,
        padding: 20,
        boxShadow: '0 10px 28px rgba(14,165,233,0.07)',
        display: 'flex',
        flexDirection: 'column',
        gap: 14,
        transition: 'box-shadow 0.2s',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.03em' }}>
            {university.name}
          </div>
          <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
            {university.city || 'Қала көрсетілмеген'}
          </div>
        </div>
        {matchLabel ? <SmallBadge variant="green">{matchLabel}</SmallBadge> : null}
      </div>

      <div style={{ fontSize: 13, color: '#475569', lineHeight: 1.75, minHeight: 44, fontWeight: 600 }}>
        {university.description || 'Қысқаша сипаттама кейін толықтырылады.'}
      </div>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {university.has_dormitory ? <SmallBadge>Жатақхана бар</SmallBadge> : null}
        {university.has_military_department ? <SmallBadge>Әскери кафедра</SmallBadge> : null}
        {university.study_languages ? <SmallBadge variant="gray">{university.study_languages}</SmallBadge> : null}
      </div>

      <div
        style={{
          padding: 14,
          borderRadius: 18,
          background: '#f0f9ff',
          border: '1px solid rgba(14,165,233,0.12)',
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', marginBottom: 10 }}>
          Мамандықтар preview
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {programs.slice(0, 3).map((program) => (
            <div
              key={program.id}
              style={{
                padding: '11px 12px',
                borderRadius: 14,
                background: '#fff',
                border: '1px solid rgba(14,165,233,0.1)',
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 900, color: '#0c4a6e', marginBottom: 4 }}>
                {program.name}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, fontWeight: 600 }}>
                {program.subject_1} + {program.subject_2}
                {program.grant_score ? ` • Грант: ${program.grant_score}+` : ''}
              </div>
              <div style={{ fontSize: 12, color: '#64748b', lineHeight: 1.6, marginTop: 2, fontWeight: 600 }}>
                {program.tuition_fee
                  ? `Ақылы: ${program.tuition_fee.toLocaleString()} ₸`
                  : 'Ақылы бағасы көрсетілмеген'}
              </div>
            </div>
          ))}

          {programs.length === 0 && (
            <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600 }}>
              Бұл университетке мамандықтар әлі толық қосылмаған.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {university.website ? (
          <motion.a
            href={university.website}
            target="_blank"
            rel="noreferrer"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            style={{
              padding: '11px 16px',
              borderRadius: 14,
              background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
              color: '#fff',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 10px 22px rgba(14,165,233,0.2)',
              fontSize: 13,
              display: 'inline-block',
            }}
          >
            Сайтқа өту
          </motion.a>
        ) : null}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          style={{
            padding: '11px 16px',
            borderRadius: 14,
            background: '#fff',
            color: '#0c4a6e',
            border: '1px solid rgba(14,165,233,0.2)',
            fontWeight: 800,
            fontSize: 13,
            cursor: 'pointer',
          }}
        >
          Толығырақ
        </motion.button>
      </div>
    </motion.div>
  )
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '13px 16px',
  borderRadius: 16,
  border: '1px solid rgba(14,165,233,0.2)',
  outline: 'none',
  fontSize: 14,
  color: '#0c4a6e',
  background: '#fff',
  fontWeight: 700,
  boxShadow: '0 2px 8px rgba(14,165,233,0.04)',
}

export default function UniversitiesPage() {
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [universities, setUniversities] = useState<University[]>([])
  const [programs, setPrograms] = useState<Program[]>([])

  const [search, setSearch] = useState('')
  const [cityFilter, setCityFilter] = useState('')
  const [subjectFilter, setSubjectFilter] = useState('')

  useEffect(() => {
    const loadData = async () => {
      setLoading(true)

      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, role, full_name, city, target_score, profile_subject_1, profile_subject_2')
          .eq('id', user.id)
          .single()

        if (profileData) setProfile(profileData as Profile)
      }

      const { data: universitiesData, error: uError } = await supabase
        .from('universities')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      const { data: programsData, error: pError } = await supabase
        .from('university_programs')
        .select('*')
        .eq('is_active', true)
        .order('name', { ascending: true })

      if (uError) console.error(uError)
      if (pError) console.error(pError)

      setUniversities((universitiesData as University[]) || [])
      setPrograms((programsData as Program[]) || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const cityOptions = useMemo(() => {
    return Array.from(new Set(universities.map((u) => u.city).filter(Boolean) as string[])).sort()
  }, [universities])

  const subjectOptions = useMemo(() => {
    const allSubjects = programs.flatMap((p) => [p.subject_1, p.subject_2])
    return Array.from(new Set(allSubjects)).sort()
  }, [programs])

  const universityProgramsMap = useMemo(() => {
    const map = new Map<string, Program[]>()
    for (const program of programs) {
      const current = map.get(program.university_id) || []
      current.push(program)
      map.set(program.university_id, current)
    }
    return map
  }, [programs])

  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const uniPrograms = universityProgramsMap.get(u.id) || []
      const matchesSearch =
        !search.trim() ||
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        (u.description || '').toLowerCase().includes(search.toLowerCase())
      const matchesCity = !cityFilter || u.city === cityFilter
      const matchesSubject =
        !subjectFilter ||
        uniPrograms.some((p) => p.subject_1 === subjectFilter || p.subject_2 === subjectFilter)
      return matchesSearch && matchesCity && matchesSubject
    })
  }, [universities, universityProgramsMap, search, cityFilter, subjectFilter])

  const recommended = useMemo(() => {
    if (!profile?.profile_subject_1 || !profile?.profile_subject_2) return []
    const target = parseTargetScore(profile.target_score)

    const matchedPrograms = programs.filter((p) => {
      const direct = p.subject_1 === profile.profile_subject_1 && p.subject_2 === profile.profile_subject_2
      const reverse = p.subject_1 === profile.profile_subject_2 && p.subject_2 === profile.profile_subject_1
      return direct || reverse
    })

    const grouped = new Map<string, { university: University; programs: Program[]; bestGap: number }>()

    for (const program of matchedPrograms) {
      const university = universities.find((u) => u.id === program.university_id)
      if (!university) continue
      const gap =
        target !== null && program.grant_score !== null ? Math.abs(program.grant_score - target) : 9999
      const existing = grouped.get(university.id)
      if (!existing) {
        grouped.set(university.id, { university, programs: [program], bestGap: gap })
      } else {
        existing.programs.push(program)
        if (gap < existing.bestGap) existing.bestGap = gap
      }
    }

    return Array.from(grouped.values()).sort((a, b) => a.bestGap - b.bestGap)
  }, [profile, programs, universities])

  const getMatchLabel = (programList: Program[]) => {
    const target = parseTargetScore(profile?.target_score || null)
    if (target === null) return 'Сәйкес'
    const scores = programList
      .map((p) => p.grant_score)
      .filter((v): v is number => typeof v === 'number')
    if (scores.length === 0) return 'Сәйкес'
    const closest = scores.sort((a, b) => Math.abs(a - target) - Math.abs(b - target))[0]
    const diff = closest - target
    if (diff <= 0) return 'Қауіпсіз вариант'
    if (diff <= 10) return 'Өте сәйкес'
    return 'Мақсат қылуға болады'
  }

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Университеттер жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Университеттер
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Саған сәйкес университеттер
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Бейіндік пәндеріңе, мақсатты балыңа және қызығушылығыңа сәйкес университеттерді қарап, өзіңе ең дұрыс бағытты таңда.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 30,
          padding: '28px 30px',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)',
          color: '#fff',
          boxShadow: '0 28px 56px rgba(14,165,233,0.2)',
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(255,255,255,0.10)', filter: 'blur(26px)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(125,211,252,0.12)', filter: 'blur(28px)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 900, letterSpacing: '0.06em' }}>
              УНИВЕРСИТЕТТЕР
            </div>
            {profile?.profile_subject_1 && profile?.profile_subject_2 ? (
              <div style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 900, letterSpacing: '0.06em' }}>
                {profile.profile_subject_1} + {profile.profile_subject_2}
              </div>
            ) : null}
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.05em', margin: '0 0 10px' }}>
            Саған сәйкес университеттер мен мамандықтар
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)', maxWidth: 820, margin: 0 }}>
            Бейіндік пәндеріңе, мақсатты балыңа және қызығушылығыңа сәйкес университеттерді қарап, өзіңе ең дұрыс бағытты таңда.
          </p>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        {...fadeUp(0.12)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 22,
          boxShadow: '0 10px 28px rgba(14,165,233,0.06)',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Іздеу және filter
        </div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 16 }}>
          Қала, пән және атау бойынша университеттерді ыңғайлы сүз.
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: 14 }}>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Университет іздеу..."
            style={inputStyle}
          />
          <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} style={inputStyle}>
            <option value="">Барлық қала</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>{city}</option>
            ))}
          </select>
          <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} style={inputStyle}>
            <option value="">Барлық пән</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>{subject}</option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* Recommended */}
      <motion.div
        {...fadeUp(0.18)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 22,
          boxShadow: '0 10px 28px rgba(14,165,233,0.06)',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Саған сәйкес университеттер
        </div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 18 }}>
          {profile?.profile_subject_1 && profile?.profile_subject_2
            ? `${profile.profile_subject_1} + ${profile.profile_subject_2} пәндеріне сәйкес ұсыныстар`
            : 'Ұсыныстар шығуы үшін профильдегі бейіндік пәндер толтырылуы керек'}
        </div>
        {recommended.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            {recommended.map((item, i) => (
              <UniversityCard
                key={item.university.id}
                university={item.university}
                programs={item.programs}
                matchLabel={getMatchLabel(item.programs)}
                index={i}
              />
            ))}
          </div>
        ) : (
          <EmptyState text="Әзірге recommendation шығатын мәлімет жоқ. Профильде бейіндік пәндер мен мақсатты баллды толтыр." />
        )}
      </motion.div>

      {/* All universities */}
      <motion.div
        {...fadeUp(0.22)}
        style={{
          background: '#fff',
          border: '1px solid rgba(14,165,233,0.14)',
          borderRadius: 26,
          padding: 22,
          boxShadow: '0 10px 28px rgba(14,165,233,0.06)',
        }}
      >
        <div style={{ fontSize: 17, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.02em' }}>
          Барлық университеттер
        </div>
        <div style={{ fontSize: 13, color: '#64748b', fontWeight: 600, marginBottom: 18 }}>
          Нәтиже саны: {filteredUniversities.length}
        </div>
        <AnimatePresence mode="wait">
          {filteredUniversities.length > 0 ? (
            <motion.div
              key="list"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
            >
              {filteredUniversities.map((university, i) => (
                <UniversityCard
                  key={university.id}
                  university={university}
                  programs={universityProgramsMap.get(university.id) || []}
                  index={i}
                />
              ))}
            </motion.div>
          ) : (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <EmptyState text="Іздеу немесе filter бойынша ештеңе табылмады." />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
