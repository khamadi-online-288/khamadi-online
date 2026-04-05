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
  variant = 'normal',
}: {
  subject: Subject
  variant?: 'normal' | 'highlight'
}) {
  return (
    <a
      href={`/dashboard/subjects/${subject.id}`}
      style={{
        textDecoration: 'none',
        color: '#0F172A',
        padding: '22px',
        borderRadius: '24px',
        border:
          variant === 'highlight'
            ? '1px solid rgba(14,165,233,0.35)'
            : '1px solid rgba(226,232,240,0.95)',
        background:
          variant === 'highlight'
            ? 'linear-gradient(135deg, rgba(224,242,254,0.95), rgba(255,255,255,0.98))'
            : 'rgba(255,255,255,0.86)',
        boxShadow:
          variant === 'highlight'
            ? '0 18px 36px rgba(14,165,233,0.12), inset 0 1px 0 rgba(255,255,255,0.45)'
            : '0 18px 34px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        backdropFilter: 'blur(14px)',
        display: 'block',
      }}
    >
      <div style={{ fontSize: '28px', marginBottom: '12px' }}>
        {subject.icon || '📘'}
      </div>

      <div
        style={{
          fontSize: '18px',
          fontWeight: 800,
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}
      >
        {subject.name}
      </div>

      <div
        style={{
          fontSize: '13px',
          color: '#64748B',
          lineHeight: 1.6,
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

    const mandatory = subjects.filter((s) => s.type === 'mandatory')

    const selected = subjects.filter(
      (s) =>
        s.name === profile?.profile_subject_1 ||
        s.name === profile?.profile_subject_2
    )

    const unique = [...mandatory]

    for (const item of selected) {
      if (!unique.find((x) => x.id === item.id)) {
        unique.push(item)
      }
    }

    return unique
  }, [subjects, profile])

  if (loading) {
    return (
      <div style={{ padding: '24px', fontSize: '16px', fontWeight: 700 }}>
        Жүктелуде...
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', padding: '24px' }}>
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
        <h1
          style={{
            fontSize: '38px',
            fontWeight: 800,
            lineHeight: 1.18,
            marginBottom: '12px',
            letterSpacing: '-1px',
          }}
        >
          Сенің пәндерің
        </h1>

        <p
          style={{
            fontSize: '15px',
            lineHeight: 1.8,
            color: 'rgba(255,255,255,0.86)',
            maxWidth: '760px',
          }}
        >
          Мұнда тіркеуде таңдалған 2 бейіндік пән және 3 міндетті пән ғана көрсетіледі.
        </p>
      </div>

      <div>
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '14px',
            letterSpacing: '-0.4px',
          }}
        >
          3 міндетті + 2 бейіндік пән
        </div>

        {mySubjects.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
            }}
          >
            {mySubjects.map((subject) => (
              <SubjectCard
                key={subject.id}
                subject={subject}
                variant={
                  subject.name === profile?.profile_subject_1 ||
                  subject.name === profile?.profile_subject_2
                    ? 'highlight'
                    : 'normal'
                }
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              borderRadius: '18px',
              border: '1px solid #E2E8F0',
              background: '#FFFFFF',
              color: '#64748B',
            }}
          >
            Пәндер табылмады. Алдымен `subjects` таблицасын және профильдегі пәндерді тексер.
          </div>
        )}
      </div>
    </div>
  )
}