'use client'

import { useEffect, useMemo, useState } from 'react'
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

function parseTargetScore(value: string | null): number | null {
  if (!value) return null
  const num = parseInt(value.replace('+', '').trim(), 10)
  return Number.isNaN(num) ? null : num
}

function HeroBadge({ children }: { children: React.ReactNode }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        padding: '10px 14px',
        borderRadius: '999px',
        background: 'rgba(255,255,255,0.12)',
        border: '1px solid rgba(255,255,255,0.16)',
        fontSize: '12px',
        fontWeight: 800,
      }}
    >
      {children}
    </div>
  )
}

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

function SmallBadge({
  children,
  variant = 'blue',
}: {
  children: React.ReactNode
  variant?: 'blue' | 'green' | 'gray'
}) {
  const styles =
    variant === 'green'
      ? {
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          color: '#15803D',
        }
      : variant === 'gray'
      ? {
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
          color: '#475569',
        }
      : {
          background: '#E0F2FE',
          border: '1px solid #BAE6FD',
          color: '#0369A1',
        }

  return (
    <div
      style={{
        padding: '8px 12px',
        borderRadius: '999px',
        fontSize: '12px',
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
        padding: '24px',
        borderRadius: '20px',
        background: '#F8FAFC',
        border: '1px solid #E2E8F0',
        color: '#64748B',
        lineHeight: 1.7,
        fontSize: '14px',
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
}: {
  university: University
  programs: Program[]
  matchLabel?: string
}) {
  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.82)',
        border: '1px solid rgba(226,232,240,0.95)',
        borderRadius: '26px',
        padding: '20px',
        boxShadow:
          '0 18px 34px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '14px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: '20px',
              fontWeight: 800,
              color: '#0F172A',
              marginBottom: '6px',
              letterSpacing: '-0.3px',
            }}
          >
            {university.name}
          </div>
          <div
            style={{
              fontSize: '14px',
              color: '#64748B',
              lineHeight: 1.7,
            }}
          >
            {university.city || 'Қала көрсетілмеген'}
          </div>
        </div>

        {matchLabel ? <SmallBadge variant="green">{matchLabel}</SmallBadge> : null}
      </div>

      <div
        style={{
          fontSize: '14px',
          color: '#475569',
          lineHeight: 1.7,
          minHeight: '48px',
        }}
      >
        {university.description || 'Қысқаша сипаттама кейін толықтырылады.'}
      </div>

      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {university.has_dormitory ? <SmallBadge>Жатақхана бар</SmallBadge> : null}
        {university.has_military_department ? (
          <SmallBadge>Әскери кафедра</SmallBadge>
        ) : null}
        {university.study_languages ? (
          <SmallBadge variant="gray">{university.study_languages}</SmallBadge>
        ) : null}
      </div>

      <div
        style={{
          padding: '14px',
          borderRadius: '18px',
          background: '#F8FAFC',
          border: '1px solid #E2E8F0',
        }}
      >
        <div
          style={{
            fontSize: '13px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '10px',
          }}
        >
          Мамандықтар preview
        </div>

        <div style={{ display: 'grid', gap: '10px' }}>
          {programs.slice(0, 3).map((program) => (
            <div
              key={program.id}
              style={{
                padding: '12px',
                borderRadius: '14px',
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '4px',
                }}
              >
                {program.name}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  lineHeight: 1.6,
                }}
              >
                {program.subject_1} + {program.subject_2}
                {program.grant_score ? ` • Грант: ${program.grant_score}+` : ''}
              </div>
              <div
                style={{
                  fontSize: '12px',
                  color: '#64748B',
                  lineHeight: 1.6,
                  marginTop: '2px',
                }}
              >
                {program.tuition_fee
                  ? `Ақылы: ${program.tuition_fee.toLocaleString()} ₸`
                  : 'Ақылы бағасы көрсетілмеген'}
              </div>
            </div>
          ))}

          {programs.length === 0 && (
            <div
              style={{
                fontSize: '13px',
                color: '#64748B',
              }}
            >
              Бұл университетке мамандықтар әлі толық қосылмаған.
            </div>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {university.website ? (
          <a
            href={university.website}
            target="_blank"
            rel="noreferrer"
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
              color: '#FFFFFF',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: '0 14px 24px rgba(14,165,233,0.18)',
              fontSize: '14px',
            }}
          >
            Сайтқа өту
          </a>
        ) : null}

        <button
          style={{
            padding: '12px 16px',
            borderRadius: '14px',
            background: '#FFFFFF',
            color: '#0F172A',
            border: '1px solid #CBD5E1',
            fontWeight: 800,
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          Толығырақ
        </button>
      </div>
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

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select(
            'id, role, full_name, city, target_score, profile_subject_1, profile_subject_2'
          )
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData as Profile)
        }
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

      if (uError) {
        alert(uError.message)
      }

      if (pError) {
        alert(pError.message)
      }

      setUniversities((universitiesData as University[]) || [])
      setPrograms((programsData as Program[]) || [])
      setLoading(false)
    }

    loadData()
  }, [])

  const cityOptions = useMemo(() => {
    return Array.from(
      new Set(universities.map((u) => u.city).filter(Boolean) as string[])
    ).sort()
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
        uniPrograms.some(
          (p) => p.subject_1 === subjectFilter || p.subject_2 === subjectFilter
        )

      return matchesSearch && matchesCity && matchesSubject
    })
  }, [universities, universityProgramsMap, search, cityFilter, subjectFilter])

  const recommended = useMemo(() => {
    if (!profile?.profile_subject_1 || !profile?.profile_subject_2) return []

    const target = parseTargetScore(profile.target_score)

    const matchedPrograms = programs.filter((p) => {
      const direct =
        p.subject_1 === profile.profile_subject_1 &&
        p.subject_2 === profile.profile_subject_2

      const reverse =
        p.subject_1 === profile.profile_subject_2 &&
        p.subject_2 === profile.profile_subject_1

      return direct || reverse
    })

    const grouped = new Map<
      string,
      { university: University; programs: Program[]; bestGap: number }
    >()

    for (const program of matchedPrograms) {
      const university = universities.find((u) => u.id === program.university_id)
      if (!university) continue

      const gap =
        target !== null && program.grant_score !== null
          ? Math.abs(program.grant_score - target)
          : 9999

      const existing = grouped.get(university.id)
      if (!existing) {
        grouped.set(university.id, {
          university,
          programs: [program],
          bestGap: gap,
        })
      } else {
        existing.programs.push(program)
        if (gap < existing.bestGap) {
          existing.bestGap = gap
        }
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
      <div
        style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: '34px',
          padding: '30px',
          background:
            'radial-gradient(circle at top left, rgba(255,255,255,0.18), transparent 22%), linear-gradient(135deg, #020617 0%, #0F172A 36%, #0369A1 68%, #0EA5E9 100%)',
          color: '#FFFFFF',
          boxShadow: '0 30px 60px rgba(14,165,233,0.18)',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '999px',
            background: 'rgba(255,255,255,0.10)',
            filter: 'blur(26px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-70px',
            left: '-40px',
            width: '220px',
            height: '220px',
            borderRadius: '999px',
            background: 'rgba(125,211,252,0.12)',
            filter: 'blur(28px)',
          }}
        />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <HeroBadge>УНИВЕРСИТЕТТЕР</HeroBadge>
            {profile?.profile_subject_1 && profile?.profile_subject_2 ? (
              <HeroBadge>
                {profile.profile_subject_1} + {profile.profile_subject_2}
              </HeroBadge>
            ) : null}
          </div>

          <h1
            style={{
              fontSize: '38px',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '12px',
              letterSpacing: '-1px',
            }}
          >
            Саған сәйкес университеттер мен мамандықтар
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.86)',
              maxWidth: '860px',
            }}
          >
            Бейіндік пәндеріңе, мақсатты балыңа және қызығушылығыңа сәйкес
            университеттерді қарап, өзіңе ең дұрыс бағытты таңда.
          </p>
        </div>
      </div>

      <SectionCard
        title="Іздеу және filter"
        subtitle="Қала, пән және атау бойынша университеттерді ыңғайлы сүз."
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.2fr 1fr 1fr',
            gap: '14px',
          }}
        >
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Университет іздеу..."
            style={inputStyle}
          />

          <select
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="">Барлық қала</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>

          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="">Барлық пән</option>
            {subjectOptions.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </SectionCard>

      <SectionCard
        title="Саған сәйкес университеттер"
        subtitle={
          profile?.profile_subject_1 && profile?.profile_subject_2
            ? `${profile.profile_subject_1} + ${profile.profile_subject_2} пәндеріне сәйкес ұсыныстар`
            : 'Ұсыныстар шығуы үшін профильдегі бейіндік пәндер толтырылуы керек'
        }
      >
        {recommended.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {recommended.map((item) => (
              <UniversityCard
                key={item.university.id}
                university={item.university}
                programs={item.programs}
                matchLabel={getMatchLabel(item.programs)}
              />
            ))}
          </div>
        ) : (
          <EmptyState text="Әзірге recommendation шығатын мәлімет жоқ. Профильде бейіндік пәндер мен мақсатты баллды толтыр." />
        )}
      </SectionCard>

      <SectionCard
        title="Барлық университеттер"
        subtitle={`Нәтиже саны: ${filteredUniversities.length}`}
      >
        {filteredUniversities.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
            }}
          >
            {filteredUniversities.map((university) => (
              <UniversityCard
                key={university.id}
                university={university}
                programs={universityProgramsMap.get(university.id) || []}
              />
            ))}
          </div>
        ) : (
          <EmptyState text="Іздеу немесе filter бойынша ештеңе табылмады." />
        )}
      </SectionCard>
    </div>
  )
}