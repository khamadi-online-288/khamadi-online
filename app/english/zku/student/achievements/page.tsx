'use client'

import React, { useState, useEffect } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../zku-lang'
import {
  IcRocket, IcBook, IcBookOpen, IcGraduation, IcFlame, IcDiamond,
  IcLightning, IcStar, IcTarget, IcMedal, IcCheck,
} from '../_icons'

const N   = '#003876'
const G   = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

interface Achievement {
  id: string
  category: 'start' | 'streak' | 'xp' | 'lessons' | 'vocab' | 'test'
  titleRu: string; titleKz: string; titleEn: string
  descRu: string;  descKz: string;  descEn: string
  target: number
  color: string; bg: string
}

type IconFn = (color: string) => React.ReactElement
const ACHIEVEMENT_ICONS: Record<string, IconFn> = {
  first_lesson: c => <IcRocket  size={26} color={c} />,
  lessons_5:    c => <IcBook    size={26} color={c} />,
  lessons_25:   c => <IcBookOpen size={26} color={c} />,
  lessons_100:  c => <IcGraduation size={26} color={c} />,
  streak_3:     c => <IcFlame   size={26} color={c} />,
  streak_7:     c => <IcFlame   size={26} color={c} />,
  streak_30:    c => <IcDiamond size={26} color={c} />,
  xp_100:       c => <IcLightning size={26} color={c} />,
  xp_1000:      c => <IcLightning size={26} color={c} />,
  xp_5000:      c => <IcStar   size={26} color={c} />,
  placement:    c => <IcTarget  size={26} color={c} />,
  level_a2:     c => <IcMedal  size={26} color={c} />,
}

const ALL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_lesson',   category: 'start',   titleRu: 'Первый шаг',      titleKz: 'Алғашқы қадам',     titleEn: 'First Step',       descRu: 'Пройди первый урок',          descKz: 'Алғашқы сабақты өт',         descEn: 'Complete your first lesson',     target: 1,    color: N,         bg: '#EEF2F7' },
  { id: 'lessons_5',      category: 'lessons', titleRu: '5 уроков',         titleKz: '5 сабақ',           titleEn: '5 Lessons',        descRu: 'Пройди 5 уроков',             descKz: '5 сабақты өт',               descEn: 'Complete 5 lessons',             target: 5,    color: '#1B8FC4', bg: '#DBEAFE' },
  { id: 'lessons_25',     category: 'lessons', titleRu: '25 уроков',        titleKz: '25 сабақ',          titleEn: '25 Lessons',       descRu: 'Пройди 25 уроков',            descKz: '25 сабақты өт',              descEn: 'Complete 25 lessons',            target: 25,   color: '#534AB7', bg: '#EDE9FE' },
  { id: 'lessons_100',    category: 'lessons', titleRu: '100 уроков',       titleKz: '100 сабақ',         titleEn: '100 Lessons',      descRu: 'Пройди 100 уроков',           descKz: '100 сабақты өт',             descEn: 'Complete 100 lessons',           target: 100,  color: G,         bg: '#FEF3C7' },
  { id: 'streak_3',       category: 'streak',  titleRu: '3 дня подряд',     titleKz: '3 күн қатарынан',   titleEn: '3-Day Streak',     descRu: 'Учись 3 дня подряд',          descKz: '3 күн қатарынан оқы',        descEn: 'Study 3 days in a row',          target: 3,    color: '#EF4444', bg: '#FEE2E2' },
  { id: 'streak_7',       category: 'streak',  titleRu: 'Неделя огня',      titleKz: 'Апта отты',         titleEn: 'Week on Fire',     descRu: 'Учись 7 дней подряд',         descKz: '7 күн қатарынан оқы',        descEn: 'Study 7 days in a row',          target: 7,    color: '#EF4444', bg: '#FEE2E2' },
  { id: 'streak_30',      category: 'streak',  titleRu: 'Месяц без пропуска',titleKz: 'Айлық үзіліссіз',   titleEn: 'Month Streak',     descRu: 'Учись 30 дней подряд',        descKz: '30 күн қатарынан оқы',       descEn: 'Study 30 days in a row',         target: 30,   color: '#7C3AED', bg: '#EDE9FE' },
  { id: 'xp_100',         category: 'xp',      titleRu: '100 XP',            titleKz: '100 XP',             titleEn: '100 XP',           descRu: 'Набери 100 XP',               descKz: '100 XP жина',                descEn: 'Earn 100 XP',                    target: 100,  color: G,         bg: '#FEF3C7' },
  { id: 'xp_1000',        category: 'xp',      titleRu: '1 000 XP',          titleKz: '1 000 XP',           titleEn: '1,000 XP',         descRu: 'Набери 1000 XP',              descKz: '1000 XP жина',               descEn: 'Earn 1,000 XP',                  target: 1000, color: G,         bg: '#FEF3C7' },
  { id: 'xp_5000',        category: 'xp',      titleRu: '5 000 XP',          titleKz: '5 000 XP',           titleEn: '5,000 XP',         descRu: 'Набери 5000 XP',              descKz: '5000 XP жина',               descEn: 'Earn 5,000 XP',                  target: 5000, color: G,         bg: '#FEF3C7' },
  { id: 'placement',      category: 'test',    titleRu: 'Placement Test',    titleKz: 'Placement Test',     titleEn: 'Placement Test',   descRu: 'Пройди тест на уровень',      descKz: 'Деңгей тестін өт',           descEn: 'Complete the placement test',    target: 1,    color: '#0F766E', bg: '#CCFBF1' },
  { id: 'level_a2',       category: 'test',    titleRu: 'Уровень A2',        titleKz: 'A2 деңгейі',         titleEn: 'Level A2',         descRu: 'Достигни уровня A2',          descKz: 'A2 деңгейіне жет',           descEn: 'Reach level A2',                 target: 1,    color: '#1B8FC4', bg: '#DBEAFE' },
]

export default function AchievementsPage() {
  const { lang, t } = useZkuLang()
  const [filter,   setFilter]   = useState<'all' | 'unlocked'>('all')
  const [userXp,   setUserXp]   = useState(0)
  const [userStreak, setUserStreak] = useState(0)
  const [userLessons, setUserLessons] = useState(0)
  const [userLevel, setUserLevel] = useState('A1')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data: profile } = await supabase
        .from('english_user_profiles')
        .select('total_xp, current_streak, current_level')
        .eq('user_id', user.id).maybeSingle()
      if (profile) {
        setUserXp(profile.total_xp ?? 0)
        setUserStreak(profile.current_streak ?? 0)
        setUserLevel(profile.current_level ?? 'A1')
      }
      const { count } = await supabase
        .from('english_lesson_progress')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id).eq('completed', true)
      setUserLessons(count ?? 0)
    }
    load()
  }, [])

  function getProgress(a: Achievement): { earned: boolean; current: number } {
    switch (a.category) {
      case 'xp':      return { earned: userXp >= a.target,      current: Math.min(a.target, userXp) }
      case 'streak':  return { earned: userStreak >= a.target,   current: Math.min(a.target, userStreak) }
      case 'lessons': return { earned: userLessons >= a.target,  current: Math.min(a.target, userLessons) }
      case 'test':    return { earned: a.id === 'placement' ? false : userLevel !== 'A1', current: 0 }
      default:        return { earned: false, current: 0 }
    }
  }

  const displayed = filter === 'unlocked'
    ? ALL_ACHIEVEMENTS.filter(a => getProgress(a).earned)
    : ALL_ACHIEVEMENTS

  const earned = ALL_ACHIEVEMENTS.filter(a => getProgress(a).earned).length

  function title(a: Achievement) { return lang === 'kz' ? a.titleKz : lang === 'en' ? a.titleEn : a.titleRu }
  function desc(a: Achievement)  { return lang === 'kz' ? a.descKz  : lang === 'en' ? a.descEn  : a.descRu }

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
    <div style={{ padding: '28px 32px 56px', maxWidth: 1000, margin: '0 auto' }}>

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 26, fontWeight: 900, color: N, marginBottom: 5 }}>{t.achievements.title}</h1>
        <p style={{ fontSize: 13, color: MUT }}>{t.achievements.subtitle}</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 10 }}>
          <div style={{ background: '#fff', borderRadius: 12, padding: '10px 18px', border: `1px solid ${BDR}`, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: G }}>{earned}</div>
            <div style={{ fontSize: 10, color: MUT, fontWeight: 600 }}>{t.achievements.earned}</div>
          </div>
          <div style={{ background: '#fff', borderRadius: 12, padding: '10px 18px', border: `1px solid ${BDR}`, textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 900, color: '#94A3B8' }}>{ALL_ACHIEVEMENTS.length - earned}</div>
            <div style={{ fontSize: 10, color: MUT, fontWeight: 600 }}>{t.achievements.locked}</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 3, background: '#fff', borderRadius: 10, padding: 3, border: `1px solid ${BDR}` }}>
          {(['all', 'unlocked'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{
              padding: '7px 14px', borderRadius: 8, border: 'none', cursor: 'pointer',
              background: filter === f ? N : 'transparent',
              color: filter === f ? '#fff' : MUT,
              fontSize: 11, fontWeight: 700, fontFamily: 'inherit',
            }}>
              {f === 'all' ? t.achievements.all : t.achievements.unlocked_only}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {displayed.length === 0 ? (
        <div style={{ background: '#fff', borderRadius: 16, padding: 56, textAlign: 'center', border: `1px solid ${BDR}` }}>
          <div style={{ fontSize: 15, fontWeight: 800, color: N, marginBottom: 6 }}>{t.achievements.empty}</div>
          <div style={{ fontSize: 12, color: MUT }}>{t.achievements.empty_sub}</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(190px, 1fr))', gap: 10 }}>
          {displayed.map(a => {
            const { earned: isEarned, current } = getProgress(a)
            const pct = a.target > 1 ? Math.round((current / a.target) * 100) : (isEarned ? 100 : 0)
            return (
              <div key={a.id} style={{
                background: '#fff', borderRadius: 14, padding: '18px 14px', textAlign: 'center',
                border: `1px solid ${isEarned ? `rgba(0,56,118,0.2)` : BDR}`,
                boxShadow: isEarned ? '0 2px 12px rgba(0,56,118,0.1)' : '0 1px 4px rgba(0,56,118,0.04)',
                opacity: isEarned ? 1 : 0.55,
              }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 14, margin: '0 auto 10px',
                  background: isEarned ? '#EEF2F7' : '#F8FAFC',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  filter: isEarned ? 'none' : 'grayscale(1) opacity(0.5)',
                }}>{ACHIEVEMENT_ICONS[a.id]?.(a.color) ?? <IcStar size={26} color={a.color} />}</div>

                <div style={{ fontSize: 12, fontWeight: 800, color: isEarned ? N : '#94A3B8', marginBottom: 3 }}>
                  {title(a)}
                </div>
                <div style={{ fontSize: 10, color: MUT, marginBottom: 10, lineHeight: 1.4 }}>
                  {desc(a)}
                </div>

                {isEarned ? (
                  <span style={{ fontSize: 10, fontWeight: 700, color: G, background: '#FEF6E8', padding: '3px 10px', borderRadius: 99, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <IcCheck size={10} color={G} /> {t.achievements.earned}
                  </span>
                ) : (
                  <>
                    <div style={{ height: 4, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden', marginBottom: 4 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: N, borderRadius: 99 }} />
                    </div>
                    <div style={{ fontSize: 10, color: '#94A3B8', fontWeight: 500 }}>
                      {a.target > 1 ? `${current} / ${a.target}` : t.achievements.locked}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
    </div>
  )
}