'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'

type Subject = {
  id: number
  name: string
  icon: string | null
}

type Profile = {
  id: string
  profile_subject_1: string | null
  profile_subject_2: string | null
}

function SubjectCard({
  subject,
  highlight = false,
}: {
  subject: Subject
  highlight?: boolean
}) {
  return (
    <a
      href={`/dashboard/subjects/${subject.id}`}
      style={{
        textDecoration: 'none',
        color: '#0F172A',
        borderRadius: 24,
        padding: 22,
        display: 'block',
        background: highlight
          ? 'linear-gradient(135deg, rgba(224,242,254,0.96), rgba(255,255,255,0.98))'
          : 'rgba(255,255,255,0.92)',
        border: highlight
          ? '1px solid rgba(14,165,233,0.28)'
          : '1px solid rgba(226,232,240,0.95)',
        boxShadow: highlight
          ? '0 18px 36px rgba(14,165,233,0.12)'
          : '0 16px 30px rgba(15,23,42,0.05)',
      }}
    >
      <div
        style={{
          width: 54,
          height: 54,
          borderRadius: 16,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: highlight
            ? 'linear-gradient(135deg, #38BDF8, #0EA5E9)'
            : '#F8FAFC',
          border: highlight ? 'none' : '1px solid #E2E8F0',
          color: highlight ? '#FFFFFF' : '#0EA5E9',
          fontSize: 26,
          marginBottom: 14,
        }}
      >
        {subject.icon || '📘'}
      </div>

      <div
        style={{
          fontSize: 18,
          fontWeight: 800,
          lineHeight: 1.3,
          marginBottom: 8,
          letterSpacing: '-0.02em',
        }}
      >
        {subject.name}
      </div>

      <div
        style={{
          fontSize: 13,
          color: '#64748B',
          lineHeight: 1.6,
          marginBottom: 12,
        }}
      >
        {highlight ? 'Бейіндік пән' : 'Міндетті пән'}
      </div>

      <div
        style={{
          fontSize: 13,
          fontWeight: 800,
          color: highlight ? '#0369A1' : '#0F172A',
        }}
      >
        Пәнді ашу →
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
      try {
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
          .select('id, name, icon')
          .order('id', { ascending: true })

        setSubjects((subjectsData as Subject[]) || [])
      } catch (error) {
        console.error('Subjects load error:', error)
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const mySubjects = useMemo(() => {
    if (!subjects.length) return []

    const mandatoryNames = [
      'Қазақстан тарихы',
      'Оқу сауаттылығы',
      'Математикалық сауаттылық',
    ]

    const p1 = profile?.profile_subject_1?.trim().toLowerCase()
    const p2 = profile?.profile_subject_2?.trim().toLowerCase()

    const mandatory = subjects.filter((s) =>
      mandatoryNames.includes(s.name)
    )

    const selected = subjects.filter((s) => {
      const name = s.name.trim().toLowerCase()
      return name === p1 || name === p2
    })

    const unique: Subject[] = []

    for (const item of [...mandatory, ...selected]) {
      if (!unique.find((x) => x.id === item.id)) {
        unique.push(item)
      }
    }

    return unique
  }, [subjects, profile])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          padding: 24,
          background: '#F8FAFC',
          color: '#64748B',
          fontWeight: 700,
        }}
      >
        Жүктелуде...
      </div>
    )
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: 24,
        background:
          'radial-gradient(circle at top right, rgba(56,189,248,0.10), transparent 24%), radial-gradient(circle at bottom left, rgba(14,165,233,0.08), transparent 22%), linear-gradient(180deg, #F8FCFF 0%, #FFFFFF 58%, #EEF8FF 100%)',
      }}
    >
      <div
        style={{
          maxWidth: 1240,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 20,
        }}
      >
        <div
          style={{
            borderRadius: 30,
            padding: 28,
            background:
              'radial-gradient(circle at top right, rgba(56,189,248,0.16), transparent 24%), linear-gradient(135deg, rgba(255,255,255,0.80) 0%, rgba(240,249,255,0.94) 100%)',
            border: '1px solid rgba(226,232,240,0.95)',
            boxShadow: '0 24px 50px rgba(15,23,42,0.06)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              padding: '8px 12px',
              borderRadius: 999,
              background: '#E0F2FE',
              color: '#0369A1',
              fontSize: 12,
              fontWeight: 800,
              marginBottom: 12,
            }}
          >
            SUBJECTS
          </div>

          <h1
            style={{
              fontSize: 40,
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: '-0.04em',
              color: '#0F172A',
              margin: 0,
              marginBottom: 12,
            }}
          >
            Сенің пәндерің
          </h1>

          <p
            style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: '#64748B',
              margin: 0,
              marginBottom: 18,
              maxWidth: 820,
            }}
          >
            Мұнда ҰБТ форматы бойынша 3 міндетті пән және 2 таңдау пән көрсетіледі.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: 12,
            }}
          >
            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Бейіндік пән 1
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                }}
              >
                {profile?.profile_subject_1 || 'Таңдалмаған'}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Бейіндік пән 2
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                }}
              >
                {profile?.profile_subject_2 || 'Таңдалмаған'}
              </div>
            </div>

            <div
              style={{
                borderRadius: 18,
                padding: 16,
                background: '#FFFFFF',
                border: '1px solid #E2E8F0',
              }}
            >
              <div
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  marginBottom: 8,
                }}
              >
                Жалпы пән саны
              </div>
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 800,
                  color: '#0F172A',
                }}
              >
                {mySubjects.length}
              </div>
            </div>
          </div>
        </div>

        <div>
          <div
            style={{
              fontSize: 26,
              fontWeight: 900,
              color: '#0F172A',
              letterSpacing: '-0.03em',
              marginBottom: 6,
            }}
          >
            3 міндетті + 2 таңдау пән
          </div>

          <div
            style={{
              fontSize: 14,
              color: '#64748B',
              lineHeight: 1.7,
              marginBottom: 18,
            }}
          >
            Бейіндік пәндер көк акцентпен белгіленген.
          </div>

          {mySubjects.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: 16,
              }}
            >
              {mySubjects.map((subject) => (
                <SubjectCard
                  key={subject.id}
                  subject={subject}
                  highlight={
                    subject.name === profile?.profile_subject_1 ||
                    subject.name === profile?.profile_subject_2
                  }
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                padding: 22,
                borderRadius: 22,
                border: '1px solid #E2E8F0',
                background: '#FFFFFF',
                color: '#64748B',
                boxShadow: '0 10px 24px rgba(15,23,42,0.04)',
                lineHeight: 1.8,
              }}
            >
              Пәндер табылмады. `subjects` таблицасындағы атаулар мен
              `profiles.profile_subject_1/profile_subject_2` мәндерін тексер.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}