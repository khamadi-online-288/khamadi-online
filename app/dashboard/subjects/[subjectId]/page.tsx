'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Subject = {
  id: number
  name: string
  icon: string | null
  type: string
}

type Section = {
  id: number
  subject_id: number
  name: string
  grade: string | null
  order_index: number
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
  section,
  subjectId,
  index,
}: {
  section: Section
  subjectId: number
  index: number
}) {
  return (
    <a
      href={`/dashboard/subjects/${subjectId}/${section.id}`}
      style={{
        textDecoration: 'none',
        color: '#0F172A',
        padding: '22px',
        borderRadius: '24px',
        border: '1px solid rgba(226,232,240,0.95)',
        background:
          index % 2 === 0
            ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.95))'
            : 'linear-gradient(135deg, rgba(224,242,254,0.70), rgba(255,255,255,0.96))',
        boxShadow:
          '0 18px 34px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        display: 'block',
        transition: '0.2s ease',
      }}
    >
      <div
        style={{
          width: '44px',
          height: '44px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: '18px',
          marginBottom: '14px',
          boxShadow: '0 14px 24px rgba(14,165,233,0.18)',
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          fontSize: '20px',
          fontWeight: 800,
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}
      >
        {section.name}
      </div>

      <div
        style={{
          fontSize: '13px',
          color: '#64748B',
          lineHeight: 1.7,
          marginBottom: '12px',
        }}
      >
        Осы бөлімнің ішіндегі тақырыптарды ашу
      </div>

      <div
        style={{
          display: 'inline-flex',
          padding: '8px 12px',
          borderRadius: '999px',
          background: '#E0F2FE',
          color: '#0369A1',
          fontSize: '12px',
          fontWeight: 800,
        }}
      >
        Бөлімді ашу →
      </div>
    </a>
  )
}

export default function SubjectSectionsPage() {
  const params = useParams()
  const subjectId = Number(params.subjectId)

  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [sections, setSections] = useState<Section[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: subjectData, error: subjectError } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single()

      if (subjectError || !subjectData) {
        setLoading(false)
        return
      }

      setSubject(subjectData as Subject)

      const { data: sectionsData, error: sectionsError } = await supabase
        .from('sections')
        .select('*')
        .eq('subject_id', subjectId)
        .order('order_index', { ascending: true })

      if (!sectionsError) {
        setSections((sectionsData as Section[]) || [])
      }

      setLoading(false)
    }

    if (subjectId) {
      load()
    }
  }, [subjectId])

  const stats = useMemo(() => {
    return {
      sectionsCount: sections.length,
      progress: sections.length ? Math.min(18 + sections.length * 4, 100) : 0,
    }
  }, [sections])

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

  if (!subject) {
    return (
      <div
        style={{
          padding: '24px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        Пән табылмады
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
            <HeroBadge>{subject.icon || '📘'} {subject.name}</HeroBadge>
            <HeroBadge>{stats.sectionsCount} бөлім</HeroBadge>
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
            {subject.name}
          </h1>

          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.8,
              color: 'rgba(255,255,255,0.86)',
              maxWidth: '780px',
              marginBottom: '18px',
            }}
          >
            Бұл жерде пәннің бөлімдері тұрады. Бөлімді басқанда соның ішіндегі
            тақырыптар ашылады.
          </p>

          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              height: '12px',
              borderRadius: '999px',
              background: 'rgba(255,255,255,0.16)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                width: `${stats.progress}%`,
                height: '100%',
                borderRadius: '999px',
                background: 'linear-gradient(90deg, #BAE6FD, #FFFFFF)',
              }}
            />
          </div>

          <div
            style={{
              fontSize: '13px',
              fontWeight: 700,
              marginTop: '10px',
              color: 'rgba(255,255,255,0.82)',
            }}
          >
            Пән прогресі: {stats.progress}%
          </div>
        </div>
      </div>

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
        <div
          style={{
            fontSize: '24px',
            fontWeight: 800,
            color: '#0F172A',
            marginBottom: '8px',
            letterSpacing: '-0.4px',
          }}
        >
          Бөлімдер
        </div>

        <div
          style={{
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.7,
            marginBottom: '18px',
          }}
        >
          Қай бөлімді ашсаң, соған тиесілі тақырыптар шығады.
        </div>

        {sections.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {sections.map((section, index) => (
              <SectionCard
                key={section.id}
                section={section}
                subjectId={subjectId}
                index={index}
              />
            ))}
          </div>
        ) : (
          <div
            style={{
              padding: '20px',
              borderRadius: '18px',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              color: '#64748B',
              lineHeight: 1.7,
            }}
          >
            Бұл пәнге бөлімдер әлі қосылмаған.
          </div>
        )}
      </div>
    </div>
  )
}