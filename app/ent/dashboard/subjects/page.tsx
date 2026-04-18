'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
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

const MANDATORY_NAMES = [
  'Қазақстан тарихы',
  'Оқу сауаттылығы',
  'Математикалық сауаттылық',
]

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
})

function SubjectCard({
  subject,
  variant = 'mandatory',
  index = 0,
}: {
  subject: Subject
  variant?: 'mandatory' | 'profile'
  index?: number
}) {
  const isProfile = variant === 'profile'

  return (
    <motion.a
      href={`/ent/dashboard/subjects/${subject.id}`}
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 + index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{
        y: -4,
        boxShadow: isProfile
          ? '0 24px 48px rgba(14,165,233,0.18)'
          : '0 20px 40px rgba(14,165,233,0.10)',
      }}
      style={{
        textDecoration: 'none',
        color: '#0c4a6e',
        borderRadius: 26,
        padding: 24,
        display: 'block',
        background: isProfile
          ? 'linear-gradient(135deg, rgba(14,165,233,0.07), rgba(255,255,255,0.98))'
          : '#fff',
        border: isProfile
          ? '1.5px solid rgba(14,165,233,0.28)'
          : '1px solid rgba(14,165,233,0.14)',
        boxShadow: isProfile
          ? '0 14px 32px rgba(14,165,233,0.10)'
          : '0 10px 24px rgba(14,165,233,0.06)',
        transition: 'box-shadow 0.2s',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: 56,
          height: 56,
          borderRadius: 18,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isProfile
            ? 'linear-gradient(135deg, #38bdf8, #0ea5e9)'
            : '#f0f9ff',
          border: isProfile ? 'none' : '1px solid rgba(14,165,233,0.14)',
          fontSize: 26,
          marginBottom: 16,
        }}
      >
        {subject.icon || (isProfile ? '⭐' : '📘')}
      </div>

      {/* Name */}
      <div style={{ fontSize: 17, fontWeight: 900, lineHeight: 1.3, marginBottom: 8, letterSpacing: '-0.02em', color: '#0c4a6e' }}>
        {subject.name}
      </div>

      {/* Badge */}
      <div style={{ fontSize: 12, color: isProfile ? '#0ea5e9' : '#64748b', lineHeight: 1.6, marginBottom: 14, fontWeight: 700 }}>
        {isProfile ? 'Бейіндік пән' : 'Міндетті пән'}
      </div>

      {/* CTA */}
      <div style={{ fontSize: 13, fontWeight: 900, color: isProfile ? '#0ea5e9' : '#0c4a6e' }}>
        Пәнді ашу →
      </div>
    </motion.a>
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
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) { window.location.href = '/ent/login'; return }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('id, profile_subject_1, profile_subject_2')
          .eq('id', user.id)
          .single()

        if (profileData) setProfile(profileData as Profile)

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

  // 3 міндетті пән — only from DB by name
  const mandatorySubjects = useMemo(() => {
    return MANDATORY_NAMES.map((name) =>
      subjects.find((s) => s.name === name)
    ).filter(Boolean) as Subject[]
  }, [subjects])

  // 2 бейіндік пән — from user profile
  const profileSubjects = useMemo(() => {
    const p1 = profile?.profile_subject_1?.trim().toLowerCase()
    const p2 = profile?.profile_subject_2?.trim().toLowerCase()
    return subjects.filter((s) => {
      const name = s.name.trim().toLowerCase()
      return (p1 && name === p1) || (p2 && name === p2)
    })
  }, [subjects, profile])

  if (loading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 14px' }} />
          <p style={{ color: '#64748b', fontSize: 14, fontWeight: 700 }}>Пәндер жүктелуде...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>

      {/* ── Page header ── */}
      <motion.div {...fadeUp(0)}>
        <div style={{ fontSize: 12, fontWeight: 800, color: '#0ea5e9', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>
          Subjects
        </div>
        <h1 style={{ fontSize: 32, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.05em', margin: 0, marginBottom: 6 }}>
          Сенің пәндерің
        </h1>
        <p style={{ fontSize: 15, color: '#64748b', lineHeight: 1.75, margin: 0 }}>
          ҰБТ форматы бойынша 3 міндетті пән және 2 бейіндік пән.
        </p>
      </motion.div>

      {/* ── Summary mini-cards ── */}
      <motion.div
        {...fadeUp(0.06)}
        style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}
      >
        {[
          { label: 'Бейіндік пән 1', value: profile?.profile_subject_1 || 'Таңдалмаған' },
          { label: 'Бейіндік пән 2', value: profile?.profile_subject_2 || 'Таңдалмаған' },
          { label: 'Жалпы пән саны', value: String(mandatorySubjects.length + profileSubjects.length) },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.08 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: '#fff',
              border: '1px solid rgba(14,165,233,0.14)',
              borderRadius: 22,
              padding: '18px 20px',
              boxShadow: '0 8px 20px rgba(14,165,233,0.07)',
            }}
          >
            <div style={{ fontSize: 11, fontWeight: 800, color: '#0ea5e9', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
              {item.label}
            </div>
            <div style={{ fontSize: 18, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.02em' }}>
              {item.value}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* ══════════════════════════════════
          БЛОК 1 — 3 міндетті пән
      ══════════════════════════════════ */}
      <div>
        {/* Section heading */}
        <motion.div {...fadeUp(0.12)} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.18)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              📋
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', margin: 0 }}>
              3 міндетті пән
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: 0, paddingLeft: 48 }}>
            Барлық талапкерлер үшін бірдей міндетті.
          </p>
        </motion.div>

        {mandatorySubjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {mandatorySubjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} variant="mandatory" index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            {...fadeUp(0.16)}
            style={{ padding: 20, borderRadius: 18, background: '#f0f9ff', border: '1px solid rgba(14,165,233,0.14)', color: '#64748b', fontSize: 14, fontWeight: 600 }}
          >
            Міндетті пәндер жүктелмеді. `subjects` таблицасын тексеріңіз.
          </motion.div>
        )}
      </div>

      {/* Divider */}
      <motion.div
        {...fadeUp(0.18)}
        style={{ height: 1, background: 'linear-gradient(90deg, rgba(14,165,233,0.18), rgba(14,165,233,0.04))' }}
      />

      {/* ══════════════════════════════════
          БЛОК 2 — 2 бейіндік пән
      ══════════════════════════════════ */}
      <div>
        {/* Section heading */}
        <motion.div {...fadeUp(0.2)} style={{ marginBottom: 18 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 12,
              background: 'linear-gradient(135deg, rgba(14,165,233,0.12), rgba(56,189,248,0.08))',
              border: '1px solid rgba(14,165,233,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 18,
            }}>
              ⭐
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 900, color: '#0c4a6e', letterSpacing: '-0.03em', margin: 0 }}>
              2 бейіндік пән
            </h2>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', fontWeight: 600, margin: 0, paddingLeft: 48 }}>
            Профиліңде таңдалған мамандық бағыты.
          </p>
        </motion.div>

        {profileSubjects.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {profileSubjects.map((subject, i) => (
              <SubjectCard key={subject.id} subject={subject} variant="profile" index={i} />
            ))}
          </div>
        ) : (
          <motion.div
            {...fadeUp(0.24)}
            style={{
              padding: 28,
              borderRadius: 22,
              background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
              border: '1px solid rgba(14,165,233,0.16)',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 12 }}>📚</div>
            <div style={{ fontSize: 15, fontWeight: 900, color: '#0c4a6e', marginBottom: 8, letterSpacing: '-0.02em' }}>
              Бейіндік пәндер таңдалмаған
            </div>
            <p style={{ fontSize: 13, color: '#64748b', lineHeight: 1.75, margin: '0 0 18px', fontWeight: 600 }}>
              Профиліңде бейіндік пәндерді таңдасаң, олар осы жерде пайда болады.
            </p>
            <motion.a
              href="/ent/dashboard/profile"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              style={{
                display: 'inline-flex',
                padding: '10px 20px',
                borderRadius: 999,
                background: 'linear-gradient(135deg, #38bdf8, #0ea5e9)',
                color: '#fff',
                fontSize: 13,
                fontWeight: 800,
                textDecoration: 'none',
                boxShadow: '0 8px 20px rgba(14,165,233,0.22)',
              }}
            >
              Профильге өту →
            </motion.a>
          </motion.div>
        )}
      </div>

    </div>
  )
}
