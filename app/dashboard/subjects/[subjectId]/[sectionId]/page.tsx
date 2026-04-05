'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useParams } from 'next/navigation'

type Subject = {
  id: number
  name: string
  icon: string | null
}

type Section = {
  id: number
  subject_id: number
  name: string
  order_index: number
}

type Topic = {
  id: number
  section_id: number
  subject_id: number
  name: string
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

function TopicCard({
  topic,
  subjectId,
  sectionId,
  index,
}: {
  topic: Topic
  subjectId: number
  sectionId: number
  index: number
}) {
  return (
    <a
      href={`/dashboard/subjects/${subjectId}/${sectionId}/${topic.id}`}
      style={{
        textDecoration: 'none',
        color: '#0F172A',
        padding: '20px',
        borderRadius: '22px',
        border: '1px solid rgba(226,232,240,0.95)',
        background:
          index % 2 === 0
            ? 'linear-gradient(135deg, rgba(255,255,255,0.96), rgba(248,250,252,0.95))'
            : 'linear-gradient(135deg, rgba(224,242,254,0.70), rgba(255,255,255,0.96))',
        boxShadow:
          '0 18px 34px rgba(15,23,42,0.05), inset 0 1px 0 rgba(255,255,255,0.45)',
        display: 'block',
      }}
    >
      <div
        style={{
          width: '42px',
          height: '42px',
          borderRadius: '14px',
          background: 'linear-gradient(135deg, #38BDF8, #0EA5E9)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#FFFFFF',
          fontWeight: 800,
          fontSize: '17px',
          marginBottom: '14px',
          boxShadow: '0 14px 24px rgba(14,165,233,0.18)',
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          fontSize: '18px',
          fontWeight: 800,
          marginBottom: '8px',
          letterSpacing: '-0.3px',
        }}
      >
        {topic.name}
      </div>

      <div
        style={{
          fontSize: '13px',
          color: '#64748B',
          lineHeight: 1.7,
          marginBottom: '12px',
        }}
      >
        Сабақты ашу және контентті оқу
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
        Тақырыпты ашу →
      </div>
    </a>
  )
}

export default function TopicsPage() {
  const params = useParams()
  const subjectId = Number(params.subjectId)
  const sectionId = Number(params.sectionId)

  const [loading, setLoading] = useState(true)
  const [subject, setSubject] = useState<Subject | null>(null)
  const [section, setSection] = useState<Section | null>(null)
  const [topics, setTopics] = useState<Topic[]>([])

  useEffect(() => {
    const load = async () => {
      setLoading(true)

      const { data: subjectData } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single()

      const { data: sectionData } = await supabase
        .from('sections')
        .select('*')
        .eq('id', sectionId)
        .single()

      const { data: topicsData, error: topicsError } = await supabase
        .from('topics')
        .select('*')
        .eq('section_id', sectionId)
        .order('order_index', { ascending: true })

      if (subjectData) setSubject(subjectData as Subject)
      if (sectionData) setSection(sectionData as Section)
      if (!topicsError) setTopics((topicsData as Topic[]) || [])

      setLoading(false)
    }

    if (subjectId && sectionId) {
      load()
    }
  }, [subjectId, sectionId])

  const stats = useMemo(() => {
    return {
      topicsCount: topics.length,
      progress: topics.length ? Math.min(20 + topics.length * 5, 100) : 0,
    }
  }, [topics])

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

  if (!subject || !section) {
    return (
      <div
        style={{
          padding: '24px',
          fontSize: '16px',
          fontWeight: 700,
          color: '#0F172A',
        }}
      >
        Бөлім немесе пән табылмады
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
            <HeroBadge>
              {subject.icon || '📘'} {subject.name}
            </HeroBadge>
            <HeroBadge>{stats.topicsCount} тақырып</HeroBadge>
          </div>

          <h1
            style={{
              fontSize: '36px',
              fontWeight: 800,
              lineHeight: 1.18,
              marginBottom: '12px',
              letterSpacing: '-1px',
            }}
          >
            {section.name}
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
            Бұл бөлімнің ішіндегі тақырыптар. Тақырыпты басқанда нақты сабақ беті ашылады.
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
            Бөлім прогресі: {stats.progress}%
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
          Тақырыптар
        </div>

        <div
          style={{
            fontSize: '13px',
            color: '#64748B',
            lineHeight: 1.7,
            marginBottom: '18px',
          }}
        >
          Тақырыпты басқанда lesson page ашылады.
        </div>

        {topics.length > 0 ? (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '16px',
            }}
          >
            {topics.map((topic, index) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                subjectId={subjectId}
                sectionId={sectionId}
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
            Бұл бөлімге тақырыптар әлі қосылмаған.
          </div>
        )}
      </div>
    </div>
  )
}