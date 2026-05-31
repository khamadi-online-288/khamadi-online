'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import { useZkuLang } from '../../student/zku-lang'

const N = '#003876'
const T = '#1D9E75'
const G = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.08)'

interface Profile {
  user_id: string; full_name: string | null; current_level: string | null
  total_xp: number | null; current_streak: number | null; longest_streak: number | null
  last_active_at: string | null; group_id: string | null; created_at?: string
}
interface LessonProgress {
  lesson_id: string; lesson_type: string | null; lesson_title: string | null
  score: number | null; xp_earned: number | null; completed_at: string | null
}

const LEVEL_COLOR: Record<string,string> = { A1:N, 'A1.1':'#16A34A', A2:'#1B8FC4', B1:'#7C3AED', B2:'#DB2777', C1:'#D97706' }
const TYPE_ICON: Record<string,string> = { reading:'📖', listening:'🎧', grammar:'📐', writing:'✍️', vocabulary:'📚', test:'🎯' }

export default function StudentProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { t } = useZkuLang()
  const { id } = use(params)
  const router  = useRouter()
  const [profile,  setProfile]  = useState<Profile | null>(null)
  const [lessons,  setLessons]  = useState<LessonProgress[]>([])
  const [groupName, setGroupName] = useState('')
  const [loading,  setLoading]  = useState(true)
  const [activeTab, setActiveTab] = useState<'overview'|'lessons'>('overview')

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) return

      // Verify teacher has access to this student (student is in one of teacher's groups)
      const { data: grps } = await supabase
        .from('english_groups').select('id, name').eq('teacher_id', session.user.id)
      const groupIds = (grps ?? []).map((g: { id: string }) => g.id)

      const { data: prof } = await supabase
        .from('english_user_profiles')
        .select('user_id, full_name, current_level, total_xp, current_streak, longest_streak, last_active_at, group_id')
        .eq('user_id', id)
        .maybeSingle()

      if (!prof) { router.replace('/english/zku/teacher/students'); return }

      // Check access - either student is in teacher's group, or admin
      const { data: myProfile } = await supabase
        .from('english_user_profiles').select('role').eq('user_id', session.user.id).maybeSingle()
      if (myProfile?.role !== 'admin' && !groupIds.includes((prof as Profile).group_id ?? '')) {
        router.replace('/english/zku/teacher/students'); return
      }

      setProfile(prof as Profile)

      // Group name
      const gName = (grps ?? []).find((g: { id: string; name: string }) => g.id === (prof as Profile).group_id)?.name ?? '—'
      setGroupName(gName)

      // Lesson history
      const { data: lh } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, lesson_type, lesson_title, score, xp_earned, completed_at')
        .eq('user_id', id)
        .eq('completed', true)
        .order('completed_at', { ascending: false })
        .limit(50)
      setLessons((lh ?? []) as LessonProgress[])

      setLoading(false)
    }
    load()
  }, [id, router])

  if (loading) return (
    <div style={{ padding: '80px 0', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: 12 }}>
      <div style={{ width: 36, height: 36, borderRadius: '50%', border: `3px solid ${N}`, borderTopColor: 'transparent', animation: 'spin 0.7s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  )

  if (!profile) return null

  const initial = (profile.full_name ?? '?').charAt(0).toUpperCase()
  const lc = LEVEL_COLOR[profile.current_level ?? 'A1'] ?? N
  const now = new Date()
  const daysSince = profile.last_active_at
    ? Math.floor((now.getTime() - new Date(profile.last_active_at).getTime()) / 86400000)
    : null

  // Skill breakdown
  const skills: Record<string, { count: number; avgScore: number; totalXp: number }> = {}
  lessons.forEach(l => {
    const type = l.lesson_type ?? 'reading'
    if (!skills[type]) skills[type] = { count: 0, avgScore: 0, totalXp: 0 }
    skills[type].count++
    skills[type].avgScore += l.score ?? 0
    skills[type].totalXp += l.xp_earned ?? 0
  })
  Object.keys(skills).forEach(k => {
    skills[k].avgScore = Math.round(skills[k].avgScore / skills[k].count)
  })

  const XP_PER_LEVEL = 3000
  const xpInLevel = (profile.total_xp ?? 0) % XP_PER_LEVEL
  const xpPct = Math.min(100, Math.round((xpInLevel / XP_PER_LEVEL) * 100))

  return (
    <div style={{ padding: '24px 28px', maxWidth: 1000, margin: '0 auto' }}>

      {/* Back */}
      <Link href="/english/zku/teacher/students" style={{ fontSize: 12, color: MUT, textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 16 }}>
        ← Все студенты
      </Link>

      {/* Profile header */}
      <div style={{ background: `linear-gradient(135deg, ${N} 0%, #0055a4 100%)`, borderRadius: 20, padding: '24px 28px', marginBottom: 20, color: '#fff', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -30, top: -30, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${lc}, ${lc}88)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: 28, flexShrink: 0, boxShadow: '0 8px 24px rgba(0,0,0,0.3)' }}>{initial}</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 24, fontWeight: 900, marginBottom: 4 }}>{profile.full_name ?? 'Студент'}</div>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)', fontWeight: 600 }}>👥 {groupName}</span>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#fff', background: `${lc}44`, border: `1px solid ${lc}88`, padding: '3px 10px', borderRadius: 99 }}>{profile.current_level ?? 'A1'}</span>
              {daysSince !== null && (
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.65)' }}>
                  {daysSince === 0 ? '🟢 Активен сегодня' : `⏱ ${daysSince} дн. назад`}
                </span>
              )}
            </div>
          </div>
          {/* Key stats */}
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
            {[
              { v: (profile.total_xp ?? 0).toLocaleString(), l: 'XP всего', color: G },
              { v: `🔥 ${profile.current_streak ?? 0}`, l: 'Стрик', color: '#EF4444' },
              { v: lessons.length.toString(), l: 'Уроков', color: T },
            ].map(s => (
              <div key={s.l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontWeight: 600 }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>
        {/* XP progress bar */}
        <div style={{ marginTop: 18, position: 'relative' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
            <span>{profile.current_level ?? 'A1'}</span>
            <span>{xpInLevel.toLocaleString()} / {XP_PER_LEVEL.toLocaleString()} XP</span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.15)', borderRadius: 99, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${xpPct}%`, background: `linear-gradient(90deg, ${G}, #e8a020)`, borderRadius: 99, transition: 'width 0.6s' }} />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 18 }}>
        {(['overview', 'lessons'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{
            padding: '8px 18px', borderRadius: 99, border: 'none', fontSize: 13, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit',
            background: activeTab === tab ? N : '#fff',
            color: activeTab === tab ? '#fff' : MUT,
            boxShadow: activeTab === tab ? `0 3px 10px ${N}44` : '0 1px 3px rgba(0,0,0,0.06)',
          }}>
            {tab === 'overview' ? '📊 Обзор' : '📚 История уроков'}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Stats grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 20 }}>
            {[
              { label: 'Лучший стрик', value: `🔥 ${profile.longest_streak ?? 0}`, color: '#EF4444', bg: '#FEE2E2' },
              { label: 'Уроков пройдено', value: lessons.length, color: T, bg: '#DCFCE7' },
              { label: 'Ср. балл', value: lessons.length > 0 ? Math.round(lessons.reduce((a, l) => a + (l.score ?? 0), 0) / lessons.length) + '%' : '—', color: N, bg: '#EEF2F7' },
              { label: 'XP всего', value: (profile.total_xp ?? 0).toLocaleString(), color: G, bg: '#FEF3C7' },
            ].map(s => (
              <div key={s.label} style={{ background: '#fff', borderRadius: 14, padding: '16px 18px', border: `1px solid ${BDR}` }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, marginBottom: 10 }}>
                  {typeof s.value === 'string' && s.value.startsWith('🔥') ? '🔥' : '📊'}
                </div>
                <div style={{ fontSize: 22, fontWeight: 900, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: MUT, fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Skills breakdown */}
          {Object.keys(skills).length > 0 && (
            <div style={{ background: '#fff', borderRadius: 18, padding: '20px 22px', border: `1px solid ${BDR}` }}>
              <h3 style={{ fontSize: 14, fontWeight: 800, color: N, marginBottom: 16 }}>Прогресс по навыкам</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {Object.entries(skills).sort((a, b) => b[1].count - a[1].count).map(([type, data]) => (
                  <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <div style={{ fontSize: 18, width: 28, textAlign: 'center', flexShrink: 0 }}>{TYPE_ICON[type] ?? '📖'}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                        <span style={{ fontWeight: 700, color: N, textTransform: 'capitalize' }}>{type}</span>
                        <span style={{ color: MUT }}>{data.count} ур. · ср. {data.avgScore}% · +{data.totalXp.toLocaleString()} XP</span>
                      </div>
                      <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${data.avgScore}%`, background: T, borderRadius: 99 }} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Lessons history tab */}
      {activeTab === 'lessons' && (
        <div style={{ background: '#fff', borderRadius: 18, border: `1px solid ${BDR}`, overflow: 'hidden' }}>
          {lessons.length === 0 ? (
            <div style={{ padding: '48px 0', textAlign: 'center', color: MUT }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>📚</div>
              <div style={{ fontWeight: 700 }}>Уроков ещё нет</div>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 90px 100px 80px 120px', padding: '12px 20px', background: '#F8FBFF', borderBottom: `1px solid ${BDR}`, gap: 8 }}>
                {['Урок', 'Тип', 'Балл', 'XP', 'Дата'].map(h => (
                  <div key={h} style={{ fontSize: 10, fontWeight: 700, color: MUT, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{h}</div>
                ))}
              </div>
              {lessons.map((l, i) => {
                const date = l.completed_at
                  ? new Date(l.completed_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
                  : '—'
                const typeIcon = TYPE_ICON[l.lesson_type ?? 'reading'] ?? '📖'
                return (
                  <div key={l.lesson_id + i} style={{
                    display: 'grid', gridTemplateColumns: '2fr 90px 100px 80px 120px',
                    padding: '11px 20px', gap: 8, alignItems: 'center',
                    borderTop: i > 0 ? `1px solid ${BDR}` : 'none',
                    background: i % 2 === 0 ? '#fff' : '#FAFCFF',
                  }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: N, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {l.lesson_title ?? l.lesson_id}
                    </div>
                    <div style={{ fontSize: 13 }}>{typeIcon} <span style={{ fontSize: 11, color: MUT }}>{l.lesson_type}</span></div>
                    <div>
                      <span style={{ fontSize: 12, fontWeight: 700, color: (l.score ?? 0) >= 80 ? T : (l.score ?? 0) >= 60 ? G : '#EF4444' }}>
                        {l.score ?? 0}%
                      </span>
                    </div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: G }}>+{l.xp_earned ?? 0}</div>
                    <div style={{ fontSize: 11, color: MUT }}>{date}</div>
                  </div>
                )
              })}
              <div style={{ padding: '10px 20px', borderTop: `1px solid ${BDR}`, background: '#F8FBFF', fontSize: 12, color: MUT }}>
                {lessons.length} уроков · всего +{lessons.reduce((a, l) => a + (l.xp_earned ?? 0), 0).toLocaleString()} XP
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}
