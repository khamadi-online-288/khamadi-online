'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_A1_MODULES, MOCK_A11_MODULES, MOCK_A2_MODULES, MOCK_B1_MODULES, MOCK_B2_MODULES, MOCK_C1_MODULES } from '@/lib/english/mockData'
import { useZkuLang } from '../../zku-lang'
import { IcLock, IcSearch, IcAlertTri, IcCheckCircle } from '../../_icons'
import { createEnglishClient } from '@/lib/english/supabase-client'

const N   = '#003876'
const G   = '#C9933B'
const MUT = '#64748B'
const BDR = 'rgba(0,56,118,0.09)'

// ── Section config ─────────────────────────────────────────────
const SECTIONS = [
  { key: 'reading',   label: 'Reading',   color: '#1B8FC4', bg: '#DBEAFE', icon: '📖' },
  { key: 'listening', label: 'Listening', color: '#7C3AED', bg: '#EDE9FE', icon: '🎧' },
  { key: 'grammar',   label: 'Grammar',   color: N,         bg: '#EEF2F7', icon: '📐' },
  { key: 'writing',   label: 'Writing',   color: '#1D9E75', bg: '#DCFCE7', icon: '✍️' },
  { key: 'test',      label: 'Test',      color: G,         bg: '#FEF3C7', icon: '🎯' },
] as const

type SectionKey = typeof SECTIONS[number]['key']

interface LevelMeta {
  code: string; name: string; nameSub: string; desc: string
  color: string; bg: string; totalModules: number
  total_lessons: number; total_hours: number; total_words: number
  isLocked: boolean
}

type ModuleProgress = Record<string, { completed: number; total: number }>
interface ModuleSection { reading: number; listening: number; grammar: number; writing: number; test: number }
interface ComputedModule {
  id: string; order_num: number; title: string; grammar_focus: string; vocab_count: number
  xp_total: number; sections: ModuleSection; progress: number; lessonsCompleted: number; isLocked: boolean
}

export default function LevelPage() {
  const { t } = useZkuLang()
  const params  = useParams()
  const level   = (params.level as string).toLowerCase()

  // ── All hooks BEFORE any conditional return ──────────────────
  const [dbProgress, setDbProgress] = useState<ModuleProgress>({})

  useEffect(() => {
    async function load() {
      const supabase = createEnglishClient()
      const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
      if (!user) return
      const { data } = await supabase
        .from('english_lesson_progress')
        .select('lesson_id, completed')
        .eq('user_id', user.id)
      if (!data) return
      type LPRow = { lesson_id: string | null; completed: boolean }
      const rows = data as LPRow[]
      const map: ModuleProgress = {}
      const allMods = [...MOCK_A1_MODULES, ...MOCK_A11_MODULES, ...MOCK_A2_MODULES, ...MOCK_B1_MODULES, ...MOCK_B2_MODULES, ...MOCK_C1_MODULES]
      allMods.forEach(mod => {
        const prefix = mod.id.startsWith('m-a11-')
          ? `l${parseInt(mod.id.replace('m-a11-', '')) + 16}-`
          : `l${mod.order_num}-`
        const modLessons = rows.filter(r => r.lesson_id?.startsWith(prefix))
        const sec        = mod.sections
        const total      = sec.reading + sec.listening + sec.grammar + sec.writing + sec.test
        const completed  = modLessons.filter(r => r.completed).length
        map[mod.id]      = { completed, total }
      })
      setDbProgress(map)
    }
    load()
  }, [])

  const LEVELS_MAP: Record<string, LevelMeta> = {
    a1:  { code: 'A1',   name: t.common.level_a1,  nameSub: t.course.beginner_sub,    desc: t.course.desc_a1,  color: N,         bg: '#EEF2F7', totalModules: 16, total_lessons: 80,  total_hours: 120, total_words: 800,  isLocked: false },
    a11: { code: 'A1.1', name: t.common.level_a11, nameSub: t.course.elementary_sub,  desc: t.course.desc_a11, color: '#16A34A', bg: '#DCFCE7', totalModules: 18, total_lessons: 128, total_hours: 130, total_words: 900, isLocked: false },
    a2:  { code: 'A2',   name: t.common.level_a2,  nameSub: t.course.pre_int_sub,     desc: t.course.desc_a2,  color: '#1B8FC4', bg: '#DBEAFE', totalModules: 24, total_lessons: 168, total_hours: 220, total_words: 1500, isLocked: false },
    b1:  { code: 'B1',   name: t.common.level_b1,  nameSub: t.course.intermediate_sub,desc: t.course.desc_b1,  color: '#7C3AED', bg: '#EDE9FE', totalModules: 26, total_lessons: 208, total_hours: 260, total_words: 1820, isLocked: false },
    b2:  { code: 'B2',   name: t.common.level_b2,  nameSub: t.course.upper_int_sub,   desc: t.course.desc_b2,  color: '#DB2777', bg: '#FCE7F3', totalModules: 26, total_lessons: 130, total_hours: 200, total_words: 1500, isLocked: true  },
    c1:  { code: 'C1',   name: t.common.level_c1,  nameSub: t.course.advanced_sub,    desc: t.course.desc_c1,  color: '#D97706', bg: '#FEF3C7', totalModules: 32, total_lessons: 160, total_hours: 230, total_words: 1500, isLocked: true  },
  }

  const SECTIONS_T = [
    { key: 'reading',   label: t.module.type_reading,   color: '#1B8FC4', bg: '#DBEAFE', icon: '📖' },
    { key: 'listening', label: t.module.type_listening, color: '#7C3AED', bg: '#EDE9FE', icon: '🎧' },
    { key: 'grammar',   label: t.module.type_grammar,   color: N,         bg: '#EEF2F7', icon: '📐' },
    { key: 'writing',   label: t.module.type_writing,   color: '#1D9E75', bg: '#DCFCE7', icon: '✍️' },
    { key: 'test',      label: t.module.type_test,      color: G,         bg: '#FEF3C7', icon: '🎯' },
  ]

  const levelData = LEVELS_MAP[level]
  const color     = levelData?.color ?? N

  if (!levelData) {
    return (
      <div style={{ padding: 40, textAlign: 'center', fontFamily: "'Montserrat', sans-serif" }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><IcSearch size={32} color="#94A3B8" /></div>
        <div style={{ fontSize: 18, fontWeight: 700, color: N, marginBottom: 16 }}>{t.common.level_not_found}</div>
        <Link href="/english/zku/student/course" style={{ color: '#1B8FC4', textDecoration: 'none', fontWeight: 600 }}>
          {t.course.back_to_course}
        </Link>
      </div>
    )
  }

  // Build module list — merge structure with real DB progress
  const baseModules = level === 'a1' ? MOCK_A1_MODULES : level === 'a11' ? MOCK_A11_MODULES : level === 'a2' ? MOCK_A2_MODULES : level === 'b1' ? MOCK_B1_MODULES : level === 'b2' ? MOCK_B2_MODULES : level === 'c1' ? MOCK_C1_MODULES : []

  // Pass 1: compute progress from DB (or 0 if not started)
  const withProgress = baseModules.map(m => {
    const db        = dbProgress[m.id]
    const sec       = m.sections
    const total     = sec.reading + sec.listening + sec.grammar + sec.writing + sec.test
    const completed = db?.completed ?? 0
    const progress  = total > 0 ? Math.round((completed / total) * 100) : 0
    return {
      id:            m.id,
      order_num:     m.order_num,
      title:         (m.title ?? '') as string,
      grammar_focus: (m.grammar_focus ?? '') as string,
      vocab_count:   m.vocab_count ?? 0,
      xp_total:      m.xp_total,
      sections:      sec,
      progress,
      lessonsCompleted: completed,
      isLocked:      false,
    } satisfies ComputedModule
  })

  // Pass 2: all modules unlocked
  const modules: ComputedModule[] = withProgress.map(m => ({ ...m, isLocked: false }))

  const totalLessons = modules.reduce((s: number, m: ComputedModule) => {
    const sec = m.sections
    return s + sec.reading + sec.listening + sec.grammar + sec.writing + sec.test
  }, 0)

  return (
    <div style={{ minHeight: '100vh', background: '#F4F6FA', fontFamily: "'Montserrat', sans-serif" }}>
    <div style={{ padding: '28px 32px 56px', maxWidth: 1100, margin: '0 auto' }}>

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#94A3B8' }}>
        <Link href="/english/zku/student/course" style={{ color: '#1B8FC4', textDecoration: 'none', fontWeight: 600 }}>
          {t.common.all_levels}
        </Link>
        <span>/</span>
        <span style={{ color: N, fontWeight: 700 }}>{levelData.code} · {levelData.name}</span>
      </div>

      {/* Level hero */}
      <div style={{
        background: `linear-gradient(135deg, ${color} 0%, ${color}cc 100%)`,
        borderRadius: 22, padding: '28px 32px', marginBottom: 28, color: '#fff',
        position: 'relative', overflow: 'hidden',
      }}>
        {/* decorative circle */}
        <div style={{ position: 'absolute', right: -40, top: -40, width: 200, height: 200, borderRadius: '50%', background: 'rgba(255,255,255,0.07)' }} />
        <div style={{ position: 'absolute', right: 60, bottom: -60, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.05)' }} />

        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 24 }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 8 }}>
              {t.course.platform} · {levelData.code}
            </div>
            <div style={{ fontSize: 28, fontWeight: 900, marginBottom: 6, letterSpacing: '-0.02em' }}>{levelData.name}</div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 20, maxWidth: 520 }}>{levelData.desc}</div>

            {/* Stats */}
            <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
              {[
                { v: levelData.total_lessons, l: t.course.lessons },
                { v: levelData.total_words,   l: t.course.words },
                { v: levelData.total_hours,   l: t.course.hours },
                { v: levelData.totalModules,  l: t.course.modules },
              ].map(s => (
                <div key={s.l} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 900, lineHeight: 1 }}>{s.v}</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 2 }}>{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Section breakdown summary */}
          <div style={{
            flexShrink: 0, background: 'rgba(255,255,255,0.12)',
            borderRadius: 16, padding: '16px 20px', backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.15)',
            minWidth: 200,
          }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,0.55)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
              {t.module.lesson_structure}
            </div>
            {SECTIONS_T.map(sec => {
              const total = modules.reduce((s: number, m: ComputedModule) => s + (m.sections[sec.key as SectionKey] ?? 0), 0)
              return (
                <div key={sec.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8, gap: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{ fontSize: 13 }}>{sec.icon}</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>{sec.label}</span>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 800, color: '#fff',
                    background: 'rgba(255,255,255,0.2)', borderRadius: 6,
                    padding: '2px 8px',
                  }}>{total || levelData.totalModules}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Modules */}
      {levelData.isLocked ? (
        <div style={{ background: '#fff', borderRadius: 20, padding: 56, textAlign: 'center', border: '2px dashed #E2E8F0' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}><IcLock size={48} color="#CBD5E1" /></div>
          <div style={{ fontSize: 18, fontWeight: 800, color: N, marginBottom: 8 }}>{t.course.level_locked_title}</div>
          <div style={{ fontSize: 14, color: '#64748B', marginBottom: 24 }}>{t.course.level_locked_sub} {levelData.code}</div>
          <Link href="/english/zku/student/course" style={{
            display: 'inline-block', background: N, color: '#fff',
            padding: '12px 28px', borderRadius: 12, fontSize: 14, fontWeight: 700, textDecoration: 'none',
          }}>{t.course.back_to_course}</Link>
        </div>
      ) : modules.length > 0 ? (
        (() => {
          const completedMods = modules.filter((m: ComputedModule) => m.progress === 100)
          const activeMod     = modules.find((m: ComputedModule) => m.progress > 0 && m.progress < 100)
          const currentMod    = activeMod ?? modules.find((m: ComputedModule) => m.progress === 0 && !m.isLocked)
          const upcomingMods  = modules.filter((m: ComputedModule) => m.id !== currentMod?.id && m.progress === 0 && !m.isLocked)
          const doneCount     = completedMods.length

          return (
          <>
            {/* ── Overall stats bar ── */}
            <div style={{ background: '#fff', borderRadius: 16, padding: '16px 22px', marginBottom: 20, border: `1px solid ${BDR}`, display: 'flex', alignItems: 'center', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: N }}>Прогресс курса</span>
                  <span style={{ fontSize: 12, fontWeight: 700, color: color }}>{doneCount} / {modules.length} модулей</span>
                </div>
                <div style={{ height: 8, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${Math.round((doneCount / modules.length) * 100)}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 99, transition: 'width 0.6s ease' }} />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 20, flexShrink: 0 }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#10B981', lineHeight: 1 }}>{doneCount}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>Пройдено</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: color, lineHeight: 1 }}>{currentMod ? 1 : 0}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>Текущий</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 20, fontWeight: 900, color: '#94A3B8', lineHeight: 1 }}>{upcomingMods.length}</div>
                  <div style={{ fontSize: 10, color: MUT, marginTop: 2 }}>Предстоит</div>
                </div>
              </div>
            </div>

            {/* ── COMPLETED section ── */}
            {completedMods.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IcCheck size={12} color="#10B981" />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#10B981', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Пройдено — {completedMods.length} {completedMods.length === 1 ? 'модуль' : 'модулей'}
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  {completedMods.map((mod: ComputedModule) => (
                    <Link key={mod.id} href={`/english/zku/student/module/${mod.id}`} style={{ textDecoration: 'none' }}>
                      <div style={{
                        background: '#F0FDF4', borderRadius: 14, padding: '12px 18px',
                        border: '1.5px solid #BBF7D0', display: 'flex', alignItems: 'center', gap: 14,
                        transition: 'transform 0.12s', cursor: 'pointer',
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                        <div style={{ width: 32, height: 32, borderRadius: 10, background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                          <IcCheckCircle size={18} color="#10B981" />
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#166534' }}>
                            М{mod.order_num} · {mod.title}
                          </div>
                          <div style={{ fontSize: 11, color: '#86EFAC' }}>{mod.grammar_focus}</div>
                        </div>
                        <div style={{ fontSize: 11, fontWeight: 800, color: '#10B981', background: '#DCFCE7', padding: '3px 10px', borderRadius: 8 }}>
                          100% ✓
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* ── CURRENT module ── */}
            {currentMod && (() => {
              const mod = currentMod
              const sec = mod.sections
              const lessonCount = sec.reading + sec.listening + sec.grammar + sec.writing + sec.test
              const isInProgress = mod.progress > 0
              return (
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                    <div style={{ width: 20, height: 20, borderRadius: '50%', background: `${color}22`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {isInProgress ? 'В процессе' : 'Следующий'}
                    </span>
                    {isInProgress && <span style={{ fontSize: 11, color: MUT }}>· {mod.progress}% выполнено</span>}
                  </div>
                  <div style={{
                    background: '#fff', borderRadius: 18,
                    border: `2px solid ${color}`,
                    boxShadow: `0 6px 28px ${color}22`,
                    overflow: 'hidden',
                  }}>
                    {/* Progress stripe */}
                    <div style={{ height: 4, background: '#EEF2F7' }}>
                      <div style={{ height: '100%', width: `${mod.progress}%`, background: `linear-gradient(90deg, ${color}, ${color}cc)`, transition: 'width 0.6s ease' }} />
                    </div>
                    <div style={{ padding: '22px 24px' }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, marginBottom: 16 }}>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color, textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 5 }}>
                            Модуль {mod.order_num}
                          </div>
                          <div style={{ fontSize: 20, fontWeight: 900, color: N, letterSpacing: '-0.02em', marginBottom: 4 }}>
                            {mod.title}
                          </div>
                          <div style={{ fontSize: 13, color: MUT }}>{mod.grammar_focus} · {mod.vocab_count} слов</div>
                        </div>
                        <Link href={`/english/zku/student/module/${mod.id}`} style={{
                          display: 'block', flexShrink: 0,
                          background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                          color: '#fff', padding: '13px 24px', borderRadius: 14,
                          fontSize: 14, fontWeight: 800, textDecoration: 'none',
                          boxShadow: `0 6px 20px ${color}44`,
                          whiteSpace: 'nowrap',
                        }}>
                          {isInProgress ? t.course.continue_btn : t.course.start_btn}
                        </Link>
                      </div>
                      {/* Section pills */}
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: isInProgress ? 14 : 0 }}>
                        {SECTIONS_T.map(s => {
                          const count = sec[s.key as SectionKey]
                          if (!count) return null
                          return (
                            <div key={s.key} style={{ display: 'flex', alignItems: 'center', gap: 5, background: s.bg, border: `1px solid ${s.color}22`, borderRadius: 8, padding: '5px 11px' }}>
                              <span style={{ fontSize: 12 }}>{s.icon}</span>
                              <span style={{ fontSize: 11, fontWeight: 700, color: s.color }}>{s.label}</span>
                              <span style={{ fontSize: 10, fontWeight: 800, background: `${s.color}22`, color: s.color, borderRadius: 4, padding: '1px 5px' }}>{count}</span>
                            </div>
                          )
                        })}
                        <div style={{ display: 'flex', alignItems: 'center', background: '#F8FAFC', borderRadius: 8, padding: '5px 11px', border: '1px solid #F1F5F9' }}>
                          <span style={{ fontSize: 11, color: MUT, fontWeight: 600 }}>{lessonCount} уроков · {mod.xp_total} XP</span>
                        </div>
                      </div>
                      {isInProgress && (
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: MUT, marginBottom: 5 }}>
                            <span>{mod.lessonsCompleted} из {lessonCount} уроков</span>
                            <span style={{ fontWeight: 700, color }}>{mod.progress}%</span>
                          </div>
                          <div style={{ height: 6, background: '#EEF2F7', borderRadius: 99, overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${mod.progress}%`, background: color, borderRadius: 99 }} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* ── UPCOMING section ── */}
            {upcomingMods.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1' }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Предстоит — {upcomingMods.length} модулей
                  </span>
                </div>
                {/* Vertical path */}
                <div style={{ position: 'relative', paddingLeft: 32 }}>
                  {/* Vertical line */}
                  <div style={{ position: 'absolute', left: 10, top: 12, bottom: 12, width: 2, background: '#E2E8F0', borderRadius: 2 }} />
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {upcomingMods.map((mod: ComputedModule, i: number) => {
                      const sec = mod.sections
                      const lessonCount = sec.reading + sec.listening + sec.grammar + sec.writing + sec.test
                      const isNextUp = i === 0
                      return (
                        <div key={mod.id} style={{ position: 'relative' }}>
                          {/* Path dot */}
                          <div style={{
                            position: 'absolute', left: -26, top: '50%', transform: 'translateY(-50%)',
                            width: 16, height: 16, borderRadius: '50%',
                            background: isNextUp ? '#fff' : '#F8FAFC',
                            border: `2px solid ${isNextUp ? '#CBD5E1' : '#E2E8F0'}`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            {isNextUp && <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#CBD5E1' }} />}
                          </div>
                          <Link href={`/english/zku/student/module/${mod.id}`} style={{ textDecoration: 'none' }}>
                            <div style={{
                              background: isNextUp ? '#fff' : '#FAFBFD',
                              borderRadius: 14, padding: '12px 18px',
                              border: `1px solid ${isNextUp ? '#E2E8F0' : '#F1F5F9'}`,
                              display: 'flex', alignItems: 'center', gap: 14,
                              opacity: isNextUp ? 1 : 0.65,
                              transition: 'opacity 0.15s, transform 0.12s',
                              cursor: 'pointer',
                            }}
                            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)' }}
                            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = isNextUp ? '1' : '0.65'; (e.currentTarget as HTMLElement).style.transform = 'none' }}>
                              <div style={{ width: 32, height: 32, borderRadius: 10, background: '#EEF2F7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: 12, fontWeight: 900, color: '#94A3B8' }}>{mod.order_num}</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>
                                  М{mod.order_num} · {mod.title}
                                </div>
                                <div style={{ fontSize: 11, color: '#94A3B8' }}>{mod.grammar_focus}</div>
                              </div>
                              <div style={{ fontSize: 11, color: '#94A3B8', flexShrink: 0 }}>
                                {lessonCount} ур. · {mod.xp_total} XP
                              </div>
                            </div>
                          </Link>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </>
          )
        })()
      ) : (
        <div style={{ background: '#fff', borderRadius: 20, padding: 56, textAlign: 'center', border: '1px solid #F1F5F9' }}>
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><IcAlertTri size={40} color="#94A3B8" /></div>
          <div style={{ fontSize: 16, fontWeight: 800, color: N, marginBottom: 8 }}>{t.course.coming_soon_title}</div>
          <div style={{ fontSize: 14, color: '#64748B' }}>{levelData.code} {t.course.coming_soon_sub}</div>
        </div>
      )}
    </div>
    </div>
  )
}