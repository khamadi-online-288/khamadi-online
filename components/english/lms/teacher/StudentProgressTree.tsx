'use client'
import { useState } from 'react'
import { ChevronRight, ChevronDown, CheckCircle2, Circle, Clock } from 'lucide-react'

interface SectionProgress { id: string; section_type: string; status: string; score?: number }
interface LessonProgress { id: string; title: string; sections: SectionProgress[] }
interface ModuleProgress { id: string; title: string; lessons: LessonProgress[] }

interface Props { modules: ModuleProgress[] }

const STATUS_ICON = {
  completed: <CheckCircle2 size={14} color="#10b981" />,
  in_progress: <Clock size={14} color="#f59e0b" />,
  not_started: <Circle size={14} color="#cbd5e1" />,
}

function getModuleStatus(mod: ModuleProgress): 'completed' | 'in_progress' | 'not_started' {
  const all = mod.lessons.flatMap(l => l.sections)
  if (all.length === 0) return 'not_started'
  if (all.every(s => s.status === 'completed')) return 'completed'
  if (all.some(s => s.status !== 'not_started')) return 'in_progress'
  return 'not_started'
}

function getLessonStatus(lesson: LessonProgress): 'completed' | 'in_progress' | 'not_started' {
  if (lesson.sections.length === 0) return 'not_started'
  if (lesson.sections.every(s => s.status === 'completed')) return 'completed'
  if (lesson.sections.some(s => s.status !== 'not_started')) return 'in_progress'
  return 'not_started'
}

export default function StudentProgressTree({ modules }: Props) {
  const [openMods, setOpenMods] = useState<Set<string>>(new Set())
  const [openLessons, setOpenLessons] = useState<Set<string>>(new Set())

  function toggleMod(id: string) {
    setOpenMods(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }
  function toggleLesson(id: string) {
    setOpenLessons(s => { const n = new Set(s); n.has(id) ? n.delete(id) : n.add(id); return n })
  }

  if (modules.length === 0) return <div style={{ padding: 24, textAlign: 'center' as const, color: '#94a3b8', fontSize: 13 }}>Нет данных о прогрессе</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {modules.map(mod => {
        const modStatus = getModuleStatus(mod)
        const isOpen = openMods.has(mod.id)
        const completedLessons = mod.lessons.filter(l => getLessonStatus(l) === 'completed').length
        return (
          <div key={mod.id} style={{ background: '#fff', borderRadius: 14, border: '1px solid rgba(27,143,196,0.1)', overflow: 'hidden' }}>
            <button onClick={() => toggleMod(mod.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '14px 18px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'Montserrat' }}>
              {isOpen ? <ChevronDown size={16} color="#64748b" /> : <ChevronRight size={16} color="#64748b" />}
              {STATUS_ICON[modStatus]}
              <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{mod.title}</span>
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{completedLessons}/{mod.lessons.length} уроков</span>
            </button>
            {isOpen && (
              <div style={{ borderTop: '1px solid #f1f5f9', padding: '8px 0' }}>
                {mod.lessons.map(lesson => {
                  const lessonStatus = getLessonStatus(lesson)
                  const isLessonOpen = openLessons.has(lesson.id)
                  const avgScore = lesson.sections.filter(s => s.score != null).length > 0
                    ? Math.round(lesson.sections.filter(s => s.score != null).reduce((a, s) => a + (s.score ?? 0), 0) / lesson.sections.filter(s => s.score != null).length)
                    : null
                  return (
                    <div key={lesson.id}>
                      <button onClick={() => toggleLesson(lesson.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 10, padding: '10px 18px 10px 40px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left' as const, fontFamily: 'Montserrat' }}>
                        {isLessonOpen ? <ChevronDown size={13} color="#94a3b8" /> : <ChevronRight size={13} color="#94a3b8" />}
                        {STATUS_ICON[lessonStatus]}
                        <span style={{ flex: 1, fontSize: 13, fontWeight: 700, color: '#334155' }}>{lesson.title}</span>
                        {avgScore != null && <span style={{ fontSize: 12, fontWeight: 800, color: avgScore >= 80 ? '#10b981' : avgScore >= 60 ? '#f59e0b' : '#ef4444' }}>{avgScore}%</span>}
                      </button>
                      {isLessonOpen && lesson.sections.length > 0 && (
                        <div style={{ padding: '4px 18px 8px 70px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                          {lesson.sections.map((sec, idx) => (
                            <div key={sec.id ?? idx} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: '#64748b' }}>
                              {STATUS_ICON[sec.status as keyof typeof STATUS_ICON] ?? STATUS_ICON.not_started}
                              <span style={{ fontWeight: 600 }}>{sec.section_type === 'reading' ? 'Чтение' : sec.section_type === 'quiz' ? 'Тест' : sec.section_type === 'vocabulary' ? 'Словарь' : sec.section_type}</span>
                              {sec.score != null && <span style={{ marginLeft: 'auto', fontWeight: 800, color: sec.score >= 80 ? '#10b981' : '#f59e0b' }}>{sec.score}%</span>}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
