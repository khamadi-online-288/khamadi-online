'use client'

import { motion } from 'framer-motion'
import {
  User, Mail, GraduationCap, Briefcase, Calendar, Hash,
  BookOpen, Award, BarChart2, Flame, Star, Edit3,
} from 'lucide-react'
import AchievementBadges from '@/components/english/dashboard/AchievementBadges'
import type { Badge } from '@/components/english/dashboard/AchievementBadges'

const NAVY = '#1B3A6B'
const SKY  = '#1B8FC4'
const GOLD = '#C9933B'

const LEVEL_LABEL: Record<string, string> = {
  A1: 'Beginner', A2: 'Elementary',    B1: 'Intermediate',
  B2: 'Upper-Intermediate',             C1: 'Advanced', C2: 'Proficient',
}

const LEVEL_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  A1: { bg: 'rgba(16,185,129,0.14)', color: '#059669', border: 'rgba(16,185,129,0.32)' },
  A2: { bg: 'rgba(16,185,129,0.14)', color: '#059669', border: 'rgba(16,185,129,0.32)' },
  B1: { bg: 'rgba(27,143,196,0.14)', color: SKY,       border: 'rgba(27,143,196,0.32)' },
  B2: { bg: 'rgba(27,143,196,0.14)', color: SKY,       border: 'rgba(27,143,196,0.32)' },
  C1: { bg: 'rgba(139,92,246,0.14)', color: '#7c3aed', border: 'rgba(139,92,246,0.32)' },
  C2: { bg: 'rgba(139,92,246,0.14)', color: '#7c3aed', border: 'rgba(139,92,246,0.32)' },
}

const PURPOSE_LABEL: Record<string, string> = {
  accounting:       'Accounting',       computer_science: 'Computer Science',
  hospitality:      'Hospitality',      management:       'Management',
  finance_industry: 'Finance Industry', social_sciences:  'Social Sciences',
  law:              'Law',              general:          'General English',
}

export type ProfileProps = {
  profile: {
    full_name:     string | null
    email:         string
    current_level: string | null
    student_id:    string | null
    purpose:       string | null
    created_at:    string
  }
  stats: {
    enrolled_courses:  number
    completed_lessons: number
    avg_score:         number
    certificates:      number
  }
  streak:       number
  totalCourses: number
}

function buildBadges(stats: ProfileProps['stats'], streak: number): Badge[] {
  return [
    { id: 'first_lesson', emoji: '🎯', label: 'Первый урок',    desc: 'Завершите первый урок на платформе',    unlocked: stats.completed_lessons >= 1,  progress: Math.min(stats.completed_lessons, 1),  total: 1,  gradient: 'bg-gradient-to-br from-emerald-400 to-teal-500'  },
    { id: 'week_streak',  emoji: '🔥', label: '7 дней подряд',  desc: 'Учитесь 7 дней без перерыва',           unlocked: streak >= 7,                    progress: Math.min(streak, 7),                   total: 7,  gradient: 'bg-gradient-to-br from-orange-400 to-red-500'    },
    { id: 'first_cert',  emoji: '🏆', label: 'Первый диплом',  desc: 'Получите первый сертификат об окончании', unlocked: stats.certificates >= 1,          progress: Math.min(stats.certificates, 1),       total: 1,  gradient: 'bg-gradient-to-br from-amber-400 to-orange-500'  },
    { id: 'ten_lessons', emoji: '📚', label: '10 уроков',      desc: 'Пройдите 10 уроков',                    unlocked: stats.completed_lessons >= 10,     progress: Math.min(stats.completed_lessons, 10), total: 10, gradient: 'bg-gradient-to-br from-sky-400 to-blue-600'      },
    { id: 'ace',         emoji: '⭐', label: 'Отличник',       desc: 'Достигните среднего балла 90%+',         unlocked: stats.avg_score >= 90,             progress: Math.round(stats.avg_score),           total: 90, gradient: 'bg-gradient-to-br from-yellow-400 to-amber-500'  },
    { id: 'thirty_less', emoji: '🎓', label: '30 уроков',      desc: 'Пройдите 30 уроков — настоящий студент!', unlocked: stats.completed_lessons >= 30,    progress: Math.min(stats.completed_lessons, 30), total: 30, gradient: 'bg-gradient-to-br from-violet-400 to-purple-600' },
    { id: 'month_flame', emoji: '💪', label: '30 дней подряд', desc: 'Учитесь целый месяц без перерыва',       unlocked: streak >= 30,                      progress: Math.min(streak, 30),                  total: 30, gradient: 'bg-gradient-to-br from-rose-400 to-pink-600'     },
    { id: 'three_certs', emoji: '🌟', label: '3 диплома',      desc: 'Получите 3 сертификата',                 unlocked: stats.certificates >= 3,           progress: Math.min(stats.certificates, 3),       total: 3,  gradient: 'bg-gradient-to-br from-indigo-400 to-blue-600'   },
  ]
}

const fadeUp = (delay = 0) => ({
  initial:    { opacity: 0, y: 20 },
  animate:    { opacity: 1, y: 0 },
  transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function ProfileClient({ profile, stats, streak, totalCourses }: ProfileProps) {
  const initials  = profile.full_name?.trim().split(/\s+/).map(w => w[0]).join('').slice(0, 2).toUpperCase() ?? '?'
  const ls        = profile.current_level ? LEVEL_STYLE[profile.current_level] : null
  const coursePct = totalCourses > 0 ? Math.round((stats.certificates / totalCourses) * 100) : 0

  const infoRows = [
    { icon: <User size={15} />,           label: 'Полное имя',       value: profile.full_name ?? '—' },
    { icon: <Mail size={15} />,           label: 'Email',            value: profile.email },
    { icon: <GraduationCap size={15} />,  label: 'Уровень',          value: profile.current_level ? `${profile.current_level} — ${LEVEL_LABEL[profile.current_level] ?? ''}` : '—' },
    { icon: <Briefcase size={15} />,      label: 'Специальность',    value: profile.purpose ? (PURPOSE_LABEL[profile.purpose] ?? profile.purpose) : '—' },
    { icon: <Calendar size={15} />,       label: 'Дата регистрации', value: new Date(profile.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { icon: <Hash size={15} />,           label: 'ID студента',      value: profile.student_id ?? '—' },
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

      {/* ── 1. HERO ── */}
      <motion.div
        {...fadeUp(0)}
        style={{
          borderRadius: 28, overflow: 'hidden', position: 'relative',
          background: 'linear-gradient(135deg, #1B3A6B 0%, #2E5FA3 55%, #1B8FC4 100%)',
          boxShadow: '0 20px 52px rgba(27,59,107,0.22)',
        }}
      >
        {/* Grid texture */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.04, backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        {/* Orbs */}
        <div style={{ position: 'absolute', top: -60, right: -60, width: 260, height: 260, borderRadius: '50%', background: 'rgba(56,189,248,0.16)', filter: 'blur(56px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: '25%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(201,147,59,0.11)', filter: 'blur(50px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, padding: '40px 44px', display: 'flex', gap: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Avatar */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18, delay: 0.05 }}
            style={{
              width: 110, height: 110, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              border: '3px solid rgba(255,255,255,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 42, fontWeight: 900, color: '#fff', letterSpacing: '-0.04em',
              flexShrink: 0, backdropFilter: 'blur(8px)',
              boxShadow: '0 10px 40px rgba(0,0,0,0.25)',
            }}
          >
            {initials}
          </motion.div>

          {/* Name / email / badges / progress */}
          <div style={{ flex: 1, minWidth: 220 }}>
            <motion.h1
              initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1, duration: 0.45 }}
              style={{ fontSize: 'clamp(24px, 2.8vw, 38px)', fontWeight: 900, color: '#fff', letterSpacing: '-0.04em', marginBottom: 8, lineHeight: 1.1 }}
            >
              {profile.full_name ?? 'Студент'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
              style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,255,255,0.58)', fontSize: 14, fontWeight: 600, marginBottom: 18 }}
            >
              <Mail size={13} />{profile.email}
            </motion.div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
              {ls && profile.current_level && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22, type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ padding: '6px 14px', borderRadius: 99, background: ls.bg, border: `1px solid ${ls.border}`, color: ls.color, fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Star size={11} fill="currentColor" />
                  {profile.current_level} · {LEVEL_LABEL[profile.current_level]}
                </motion.span>
              )}
              {streak > 0 && (
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.28, type: 'spring', stiffness: 300, damping: 22 }}
                  style={{ padding: '6px 14px', borderRadius: 99, background: 'rgba(255,100,50,0.18)', border: '1px solid rgba(255,100,50,0.28)', color: '#FF8C6B', fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 5 }}
                >
                  <Flame size={12} />
                  {streak} {streak === 1 ? 'день' : streak < 5 ? 'дня' : 'дней'} подряд
                </motion.span>
              )}
            </div>

            {/* Course progress bar */}
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.34 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Курсов завершено
                </span>
                <span style={{ fontSize: 14, fontWeight: 900, color: '#fff' }}>
                  {stats.certificates} / {totalCourses}
                </span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.15)', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${coursePct}%` }}
                  transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  style={{ height: '100%', borderRadius: 99, background: 'linear-gradient(90deg, #C9933B, #F5C46A)', boxShadow: '0 0 12px rgba(201,147,59,0.45)' }}
                />
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* ── 2. STATS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14 }}>
        {([
          { label: 'Уроков пройдено', value: stats.completed_lessons,            color: '#10b981', icon: <BookOpen  size={18} />, bg: 'rgba(16,185,129,0.10)' },
          { label: 'Средний балл',    value: `${Math.round(stats.avg_score)}%`,   color: SKY,       icon: <BarChart2 size={18} />, bg: 'rgba(27,143,196,0.10)' },
          { label: 'Дней подряд',     value: streak,                              color: GOLD,      icon: <Flame     size={18} />, bg: 'rgba(201,147,59,0.10)' },
          { label: 'Сертификатов',    value: stats.certificates,                  color: '#8b5cf6', icon: <Award     size={18} />, bg: 'rgba(139,92,246,0.10)' },
        ] as const).map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.14 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4, boxShadow: '0 20px 44px rgba(27,143,196,0.12)' }}
            style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.10)', borderRadius: 22, padding: '20px 22px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)', cursor: 'default', transition: 'box-shadow 0.2s' }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: s.color, marginBottom: 14 }}>
              {s.icon}
            </div>
            <div style={{ fontSize: 34, fontWeight: 900, color: s.color, letterSpacing: '-0.04em', lineHeight: 1, marginBottom: 6 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {s.label}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── 3. INFO + ACHIEVEMENTS ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 0.9fr', gap: 16, alignItems: 'start' }}>

        {/* Info card */}
        <motion.div
          {...fadeUp(0.28)}
          style={{ background: '#fff', border: '1px solid rgba(27,143,196,0.10)', borderRadius: 26, padding: '26px 28px', boxShadow: '0 4px 20px rgba(27,143,196,0.06)' }}
        >
          <div style={{ marginBottom: 22 }}>
            <div style={{ fontSize: 10, fontWeight: 800, color: '#94a3b8', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: 4 }}>Аккаунт</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: NAVY, letterSpacing: '-0.03em' }}>Личная информация</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {infoRows.map((row, i) => (
              <div
                key={row.label}
                style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: i < infoRows.length - 1 ? '1px solid rgba(226,232,240,0.8)' : 'none' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, background: 'rgba(27,143,196,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: SKY, flexShrink: 0 }}>
                  {row.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
                    {row.label}
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: NAVY, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {row.value}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.025 }} whileTap={{ scale: 0.975 }}
            style={{ marginTop: 22, width: '100%', padding: '13px 0', borderRadius: 14, background: `linear-gradient(135deg, ${NAVY}, #2E5FA3)`, color: '#fff', fontWeight: 800, fontSize: 14, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, boxShadow: '0 6px 20px rgba(27,59,107,0.20)' }}
          >
            <Edit3 size={15} /> Редактировать профиль
          </motion.button>
        </motion.div>

        {/* Achievements */}
        <motion.div {...fadeUp(0.34)}>
          <AchievementBadges badges={buildBadges(stats, streak)} />
        </motion.div>

      </div>
    </div>
  )
}
