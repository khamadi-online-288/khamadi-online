'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Subject = {
  id: number
  name: string
  icon: string | null
  type: string
}

type Profile = {
  id: string
  profile_subject_1: string | null
  profile_subject_2: string | null
}

function SubjectCard({
  subject,
}: {
  subject: Subject
}) {
  return (
    <a
      href={`/dashboard/subjects/${subject.id}`}
      style={{
        textDecoration: 'none',
        color: '#0F172A',
        borderRadius: 28,
        padding: 22,
        display: 'block',
        position: 'relative',
        overflow: 'hidden',
        background:
          'linear-gradient(135deg, rgba(224,242,254,0.96), rgba(255,255,255,0.98))',
        border: '1px solid rgba(14,165,233,0.24)',
        boxShadow:
          '0 20px 40px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.55)',
        backdropFilter: 'blur(14px)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(circle at top right, rgba(56,189,248,0.18), transparent 24%)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: 18,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
            color: '#FFFFFF',
            fontSize: 28,
            marginBottom: 16,
            boxShadow: '0 14px 28px rgba(14,165,233,0.20)',
          }}
        >
          {subject.icon || '📘'}
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 10,
            marginBottom: 10,
          }}
        >
          <div
            style={{
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: '-0.03em',
              lineHeight: 1.25,
              color: '#0F172A',
            }}
          >
            {subject.name}
          </div>

          <div
            style={{
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(14,165,233,0.10)',
              border: '1px solid rgba(14,165,233,0.16)',
              color: '#0369A1',
              fontSize: 11,
              fontWeight: 800,
              whiteSpace: 'nowrap',
            }}
          >
            Бейіндік
          </div>
        </div>

        <div
          style={{
            fontSize: 13,
            color: '#64748B',
            lineHeight: 1.7,
            marginBottom: 18,
          }}
        >
          Таңдаған бейіндік пәнің. Осы бағыт бойынша бөлімдер мен тақырыптарды ашасың.
        </div>

        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 13,
            fontWeight: 800,
            color: '#0369A1',
          }}
        >
          Пәнді ашу
          <span>→</span>
        </div>
      </div>
    </a>
  )
}

export default function SubjectsPage() {
  const [loading, setLoading] = useState(true)
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      const { data: profileData } = await supabase
        .from('profiles')
        .select('id, profile_subject_1, profile_subject_2')
        .eq('id', user.id)
        .single()

      if (profileData) {
        setProfile(profileData as Profile)
      }

      const { data: subjectsData } = await supabase
        .from('subjects')
        .select('*')
        .order('id', { ascending: true })

      setSubjects((subjectsData as Subject[]) || [])
      setLoading(false)
    }

    load()
  }, [])

  const mySubjects = useMemo(() => {
    if (!subjects.length) return []

    const p1 = profile?.profile_subject_1?.trim().toLowerCase()
    const p2 = profile?.profile_subject_2?.trim().toLowerCase()

    return subjects.filter((s) => {
      const name = s.name?.trim().toLowerCase()
      return name === p1 || name === p2
    })
  }, [subjects, profile])

  if (loading) {
    return (
      <div style={s.loadingPage}>
        <div style={s.loadingCard}>
          <div style={s.loader} />
          <div style={s.loadingText}>Пәндер жүктелуде...</div>
        </div>

        <style>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={s.page}>
      <div style={s.bgGlowTop} />
      <div style={s.bgGlowBottom} />

      <div style={s.wrap}>
        <div style={s.hero}>
          <div style={s.heroBadge}>SUBJECTS</div>

          <h1 style={s.heroTitle}>Сенің бейіндік пәндерің</h1>

          <p style={s.heroText}>
            Мұнда тіркеуде таңдаған 2 бейіндік пәнің ғана көрсетіледі. Осы пәндердің
            ішіне кіріп, бөлімдер мен тақырыптарды толық оқи аласың.
          </p>

          <div style={s.heroMetaGrid}>
            <div style={s.heroMetaCard}>
              <div style={s.heroMetaLabel}>Бейіндік пән 1</div>
              <div style={s.heroMetaValue}>
                {profile?.profile_subject_1 || 'Таңдалмаған'}
              </div>
            </div>

            <div style={s.heroMetaCard}>
              <div style={s.heroMetaLabel}>Бейіндік пән 2</div>
              <div style={s.heroMetaValue}>
                {profile?.profile_subject_2 || 'Таңдалмаған'}
              </div>
            </div>

            <div style={s.heroMetaCard}>
              <div style={s.heroMetaLabel}>Пән саны</div>
              <div style={s.heroMetaValue}>{mySubjects.length}</div>
            </div>
          </div>
        </div>

        <div style={s.sectionHead}>
          <div style={s.sectionTitle}>Профиль пәндер</div>
          <div style={s.sectionSub}>
            Тек өзің таңдаған пәндер көрсетіледі.
          </div>
        </div>

        {mySubjects.length > 0 ? (
          <div style={s.grid}>
            {mySubjects.map((subject) => (
              <SubjectCard key={subject.id} subject={subject} />
            ))}
          </div>
        ) : (
          <div style={s.emptyCard}>
            Профиль пәндер табылмады. `profiles.profile_subject_1` және
            `profiles.profile_subject_2` мәндерін тексер.
          </div>
        )}
      </div>
    </div>
  )
}

const s: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 24%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 22%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
    padding: '24px 20px 48px',
    position: 'relative',
    overflow: 'hidden',
  },

  bgGlowTop: {
    position: 'absolute',
    right: -120,
    top: -120,
    width: 320,
    height: 320,
    borderRadius: '999px',
    background: 'rgba(56,189,248,0.14)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  bgGlowBottom: {
    position: 'absolute',
    left: -100,
    bottom: -100,
    width: 280,
    height: 280,
    borderRadius: '999px',
    background: 'rgba(14,165,233,0.10)',
    filter: 'blur(80px)',
    pointerEvents: 'none',
  },

  wrap: {
    maxWidth: 1240,
    margin: '0 auto',
    position: 'relative',
    zIndex: 1,
    display: 'grid',
    gap: 20,
  },

  loadingPage: {
    minHeight: '100vh',
    background: '#F8FAFC',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  loadingCard: {
    width: 220,
    height: 180,
    borderRadius: 28,
    background: 'rgba(255,255,255,0.82)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 20px 40px rgba(15,23,42,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backdropFilter: 'blur(14px)',
  },

  loader: {
    width: 54,
    height: 54,
    border: '4px solid #0EA5E9',
    borderTopColor: 'transparent',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 18,
  },

  loadingText: {
    fontSize: 15,
    fontWeight: 700,
    color: '#64748B',
  },

  hero: {
    borderRadius: 34,
    padding: 30,
    background:
      'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.78) 0%, rgba(240,249,255,0.94) 100%)',
    border: '1px solid rgba(226,232,240,0.95)',
    boxShadow: '0 24px 50px rgba(15,23,42,0.06)',
    backdropFilter: 'blur(16px)',
  },

  heroBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '10px 14px',
    borderRadius: 999,
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    color: '#0EA5E9',
    fontSize: 12,
    fontWeight: 800,
    boxShadow: '0 8px 20px rgba(15,23,42,0.04)',
    marginBottom: 16,
  },

  heroTitle: {
    fontSize: 42,
    fontWeight: 900,
    lineHeight: 1.05,
    letterSpacing: '-0.05em',
    color: '#0F172A',
    margin: 0,
    marginBottom: 14,
  },

  heroText: {
    maxWidth: 860,
    fontSize: 15,
    lineHeight: 1.85,
    color: '#64748B',
    margin: 0,
    marginBottom: 22,
  },

  heroMetaGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 14,
  },

  heroMetaCard: {
    borderRadius: 22,
    padding: 18,
    background: 'rgba(255,255,255,0.88)',
    border: '1px solid #E2E8F0',
    boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
  },

  heroMetaLabel: {
    fontSize: 11,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: '#64748B',
    marginBottom: 8,
  },

  heroMetaValue: {
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.2,
    color: '#0F172A',
    letterSpacing: '-0.03em',
  },

  sectionHead: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },

  sectionTitle: {
    fontSize: 26,
    fontWeight: 900,
    letterSpacing: '-0.03em',
    color: '#0F172A',
  },

  sectionSub: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 1.7,
  },

  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
    gap: 16,
  },

  emptyCard: {
    padding: 22,
    borderRadius: 22,
    border: '1px solid #E2E8F0',
    background: '#FFFFFF',
    color: '#64748B',
    boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
    lineHeight: 1.8,
  },
}