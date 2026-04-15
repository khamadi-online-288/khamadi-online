'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function TopicCard({ topic, subjectId, sectionId, index }: { topic: Topic; subjectId: number; sectionId: number; index: number }) {
  return (
    <motion.a
      href={`/dashboard/subjects/${subjectId}/${sectionId}/${topic.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.18 + index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4, boxShadow: '0 22px 44px rgba(14,165,233,0.14)' }}
      style={{
        textDecoration: 'none',
        color: '#0c4a6e',
        padding: 20,
        borderRadius: 22,
        border: index % 2 === 0 ? '1px solid rgba(14,165,233,0.14)' : '1.5px solid rgba(14,165,233,0.22)',
        background: index % 2 === 0 ? '#fff' : 'linear-gradient(135deg, rgba(14,165,233,0.06), rgba(255,255,255,0.98))',
        boxShadow: '0 10px 24px rgba(14,165,233,0.07)',
        display: 'block',
        transition: 'box-shadow 0.2s',
      }}
    >
      <div
        style={{
          width: 42, height: 42, borderRadius: 14,
          background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#fff', fontWeight: 900, fontSize: 17, marginBottom: 14,
          boxShadow: '0 10px 22px rgba(14,165,233,0.2)',
        }}
      >
        {index + 1}
      </div>
      <div style={{ fontSize: 17, fontWeight: 900, marginBottom: 8, letterSpacing: '-0.02em' }}>
        {topic.name}
      </div>
      <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 12, fontWeight: 600 }}>
        Сабақты ашу және контентті оқу
      </div>
      <div style={{ display: 'inline-flex', padding: '7px 12px', borderRadius: 999, background: '#e0f2fe', color: '#0369a1', fontSize: 12, fontWeight: 800 }}>
        Тақырыпты ашу →
      </div>
    </motion.a>
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
      const { data: subjectData } = await supabase.from('subjects').select('*').eq('id', subjectId).single()
      const { data: sectionData } = await supabase.from('sections').select('*').eq('id', sectionId).single()
      const { data: topicsData, error: topicsError } = await supabase
        .from('topics').select('*').eq('section_id', sectionId).order('order_index', { ascending: true })
      if (subjectData) setSubject(subjectData as Subject)
      if (sectionData) setSection(sectionData as Section)
      if (!topicsError) setTopics((topicsData as Topic[]) || [])
      setLoading(false)
    }
    if (subjectId && sectionId) load()
  }, [subjectId, sectionId])

  const stats = useMemo(() => ({
    topicsCount: topics.length,
    progress: topics.length ? Math.min(20 + topics.length * 5, 100) : 0,
  }), [topics])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Жүктелуде...</p>
        </div>
      </div>
    )
  }

  if (!subject || !section) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#64748b', fontSize: 15, fontWeight: 700 }}>Бөлім немесе пән табылмады</p>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Header */}
      <motion.div {...fadeUp(0)} style={{ marginBottom: 4 }}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          {subject.icon || '📘'} {subject.name}
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          {section.name}
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          Тақырыпты басқанда нақты сабақ беті ашылады.
        </p>
      </motion.div>

      {/* Hero */}
      <motion.div
        {...fadeUp(0.06)}
        style={{
          position: 'relative', overflow: 'hidden', borderRadius: 30, padding: '28px 30px',
          background: 'linear-gradient(135deg, #0c4a6e 0%, #0369a1 60%, #0ea5e9 100%)',
          color: '#fff', boxShadow: '0 28px 56px rgba(14,165,233,0.2)',
        }}
      >
        <div style={{ position: 'absolute', top: -50, right: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(255,255,255,0.10)', filter: 'blur(26px)' }} />
        <div style={{ position: 'absolute', bottom: -70, left: -40, width: 220, height: 220, borderRadius: 999, background: 'rgba(125,211,252,0.12)', filter: 'blur(28px)' }} />
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 14 }}>
            {[`${subject.icon || '📘'} ${subject.name}`, `${stats.topicsCount} тақырып`].map((label) => (
              <div key={label} style={{ display: 'inline-flex', padding: '8px 14px', borderRadius: 999, background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.16)', fontSize: 12, fontWeight: 900, letterSpacing: '0.06em' }}>
                {label}
              </div>
            ))}
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 900, lineHeight: 1.15, letterSpacing: '-0.05em', margin: '0 0 10px' }}>
            {section.name}
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.8, color: 'rgba(255,255,255,0.82)', maxWidth: 780, margin: '0 0 18px' }}>
            Бұл бөлімнің ішіндегі тақырыптар. Тақырыпты басқанда нақты сабақ беті ашылады.
          </p>
          <div style={{ width: '100%', maxWidth: 420, height: 10, borderRadius: 999, background: 'rgba(255,255,255,0.16)', overflow: 'hidden' }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
              style={{ height: '100%', borderRadius: 999, background: 'linear-gradient(90deg, #bae6fd, #fff)' }}
            />
          </div>
          <div style={{ fontSize: 13, fontWeight: 700, marginTop: 10, color: 'rgba(255,255,255,0.82)' }}>
            Бөлім прогресі: {stats.progress}%
          </div>
        </div>
      </motion.div>

      {/* Topics */}
      <motion.div
        {...fadeUp(0.14)}
        style={{ background: '#fff', border: '1px solid rgba(14,165,233,0.14)', borderRadius: 28, padding: 24, boxShadow: '0 14px 32px rgba(14,165,233,0.07)' }}
      >
        <div style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', marginBottom: 6, letterSpacing: '-0.03em' }}>Тақырыптар</div>
        <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.7, marginBottom: 18, fontWeight: 600 }}>
          Тақырыпты басқанда lesson page ашылады.
        </div>
        {topics.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {topics.map((topic, index) => (
              <TopicCard key={topic.id} topic={topic} subjectId={subjectId} sectionId={sectionId} index={index} />
            ))}
          </div>
        ) : (
          <div style={{ padding: 20, borderRadius: 18, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)', color: '#64748b', lineHeight: 1.7, fontWeight: 600, fontSize: 14 }}>
            Бұл бөлімге тақырыптар әлі қосылмаған.
          </div>
        )}
      </motion.div>
    </div>
  )
}
