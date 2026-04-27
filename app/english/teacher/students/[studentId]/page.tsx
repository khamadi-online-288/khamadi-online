'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import AIInsightsPanel from '@/components/english/lms/teacher/AIInsightsPanel'
import ProgressBar from '@/components/english/lms/shared/ProgressBar'
import StatusBadge from '@/components/english/lms/shared/StatusBadge'
import StudentProgressTree from '@/components/english/lms/teacher/StudentProgressTree'
import { calculateCourseProgress, calculateAverageScore, getAttendancePercent } from '@/lib/english/lms/progress'
import type { EnglishProfile, LMSProgress, LMSGrade, LMSAttendance, LMSSubmission } from '@/lib/english/lms/types'
import { User, Clock, Award, Calendar } from 'lucide-react'

type Tab = 'progress' | 'grades' | 'attendance' | 'assignments'
const TABS: { id: Tab; label: string }[] = [
  { id: 'progress', label: 'Прогресс' }, { id: 'grades', label: 'Оценки' },
  { id: 'attendance', label: 'Посещаемость' }, { id: 'assignments', label: 'Задания' },
]

export default function StudentProfilePage() {
  const { studentId } = useParams<{ studentId: string }>()
  const [tab, setTab] = useState<Tab>('progress')
  const [student, setStudent] = useState<EnglishProfile | null>(null)
  const [progress, setProgress] = useState<LMSProgress[]>([])
  const [grades, setGrades] = useState<LMSGrade[]>([])
  const [attendance, setAttendance] = useState<LMSAttendance[]>([])
  const [submissions, setSubmissions] = useState<LMSSubmission[]>([])
  const [courses, setCourses] = useState<Record<string, { id: string; title: string; level: string }>>({})
  const [progressModules, setProgressModules] = useState<{ id: string; title: string; lessons: { id: string; title: string; sections: { id: string; section_type: string; status: string; score?: number }[] }[] }[]>([])
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [studentId])

  async function load() {
    const [profileRes, progressRes, gradesRes, attendRes, subsRes] = await Promise.all([
      supabase.from('profiles').select('id,full_name,email,avatar_url,language_level,last_seen_at,department,student_id_number,phone').eq('id', studentId).single(),
      supabase.from('lms_progress').select('*').eq('student_id', studentId).order('created_at'),
      supabase.from('lms_grades').select('*').eq('student_id', studentId).order('graded_at', { ascending: false }),
      supabase.from('lms_attendance').select('*').eq('student_id', studentId).order('date', { ascending: false }),
      supabase.from('lms_assignment_submissions').select('*,assignment:lms_assignments(id,title,max_score,due_date)').eq('student_id', studentId).order('submitted_at', { ascending: false }),
    ])
    setStudent(profileRes.data as EnglishProfile)
    const prog = (progressRes.data ?? []) as LMSProgress[]
    setProgress(prog)
    setGrades((gradesRes.data ?? []) as LMSGrade[])
    setAttendance((attendRes.data ?? []) as LMSAttendance[])
    setSubmissions((subsRes.data ?? []) as LMSSubmission[])

    // Load courses
    const courseIds = [...new Set(prog.map(p => p.course_id).filter(Boolean))]
    if (courseIds.length) {
      const { data: coursesData } = await supabase.from('english_courses').select('id,title,level').in('id', courseIds as string[])
      const map: Record<string, { id: string; title: string; level: string }> = {}
      ;(coursesData ?? []).forEach((c: { id: string; title: string; level: string }) => { map[c.id] = c })
      setCourses(map)
    }

    // Build module tree for StudentProgressTree
    const moduleIds = [...new Set(prog.map(p => p.module_id).filter(Boolean))] as string[]
    const lessonIds = [...new Set(prog.map(p => p.lesson_id).filter(Boolean))] as string[]
    if (moduleIds.length && lessonIds.length) {
      const [modsRes, lessRes] = await Promise.all([
        supabase.from('english_modules').select('id,title,order_index').in('id', moduleIds).order('order_index'),
        supabase.from('english_lessons').select('id,title,module_id,order_index').in('id', lessonIds).order('order_index'),
      ])
      type LessonRow = { id: string; title: string; module_id: string; order_index: number }
      const lessRows = (lessRes.data ?? []) as LessonRow[]
      const modules = ((modsRes.data ?? []) as { id: string; title: string }[]).map(mod => ({
        id: mod.id, title: mod.title,
        lessons: lessRows
          .filter(l => l.module_id === mod.id)
          .map(l => {
            const lessonProg = prog.filter(p => p.lesson_id === l.id)
            return {
              id: l.id,
              title: l.title,
              sections: lessonProg.map(p => ({ id: p.id, section_type: p.section_type ?? '', status: p.status, score: p.score ?? undefined })),
            }
          }),
      }))
      setProgressModules(modules)
    }
  }

  const overallProgress = calculateCourseProgress(progress)
  const avgScore = calculateAverageScore(grades)
  const attendancePct = getAttendancePercent(attendance)

  const weakModules = grades.filter(g => (g.score ?? 0) < 50).map(g => g.grade_type ?? '').slice(0, 3)
  const strongModules = grades.filter(g => (g.score ?? 0) >= 80).map(g => g.grade_type ?? '').slice(0, 3)

  const courseIds = [...new Set(progress.map(p => p.course_id).filter(Boolean))]

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Профиль студента" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Profile card */}
        {student && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 28, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)', display: 'flex', gap: 28, alignItems: 'flex-start' }}>
            <div style={{ width: 80, height: 80, borderRadius: 22, overflow: 'hidden', background: '#1B3A6B', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              {student.avatar_url ? <img src={student.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                : <span style={{ color: '#fff', fontSize: 28, fontWeight: 900 }}>{student.full_name?.[0]?.toUpperCase() ?? 'С'}</span>}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 22, fontWeight: 900, color: '#1B3A6B', marginBottom: 4 }}>{student.full_name ?? '—'}</div>
              <div style={{ fontSize: 13, color: '#64748b', marginBottom: 12 }}>{student.email}</div>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {student.language_level && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Уровень: </span><span style={{ fontWeight: 700, color: '#1B8FC4' }}>{student.language_level}</span></div>}
                {student.department && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Отдел: </span><span style={{ fontWeight: 700 }}>{student.department}</span></div>}
                {student.student_id_number && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>ID: </span><span style={{ fontWeight: 700 }}>{student.student_id_number}</span></div>}
                {student.last_seen_at && <div style={{ fontSize: 13 }}><span style={{ color: '#94a3b8' }}>Последний вход: </span><span style={{ fontWeight: 700 }}>{new Date(student.last_seen_at).toLocaleDateString('ru-RU')}</span></div>}
              </div>
            </div>
            <div style={{ display: 'flex', gap: 20 }}>
              {[{ label: 'Прогресс', value: `${overallProgress}%`, color: '#1B8FC4' }, { label: 'Ср. балл', value: avgScore ? `${avgScore}%` : '—', color: '#10b981' }, { label: 'Посещ.', value: `${attendancePct}%`, color: '#C9933B' }].map(m => (
                <div key={m.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 24, fontWeight: 900, color: m.color }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* AI Insights */}
        {student && (
          <AIInsightsPanel
            studentName={student.full_name ?? 'Студент'}
            progressPercent={overallProgress}
            averageScore={avgScore}
            attendancePercent={attendancePct}
            weakModules={weakModules}
            strongModules={strongModules}
            lastSeen={student.last_seen_at ?? null}
          />
        )}

        {/* Tabs */}
        <div>
          <div style={{ display: 'flex', gap: 4, marginBottom: 20, background: '#f1f5f9', borderRadius: 12, padding: 4, width: 'fit-content' }}>
            {TABS.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '8px 18px', borderRadius: 10, fontWeight: tab === t.id ? 800 : 600, fontSize: 13, border: 'none', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.08)' : 'none' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* Progress tab */}
          {tab === 'progress' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Course summary cards */}
              {courseIds.map(cid => {
                const course = courses[cid!]
                const courseProgress = progress.filter(p => p.course_id === cid)
                const pct = calculateCourseProgress(courseProgress)
                return (
                  <div key={cid} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{course?.title ?? cid}</div>
                      <span style={{ fontSize: 14, fontWeight: 900, color: '#1B8FC4' }}>{pct}%</span>
                    </div>
                    <ProgressBar value={pct} showLabel={false} />
                    <div style={{ marginTop: 8, fontSize: 12, color: '#94a3b8' }}>{courseProgress.filter(p => p.status === 'completed').length}/{courseProgress.length} разделов завершено</div>
                  </div>
                )
              })}
              {/* Detailed tree */}
              {progressModules.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 10 }}>Детальный прогресс по модулям</div>
                  <StudentProgressTree modules={progressModules} />
                </div>
              )}
              {courseIds.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14, textAlign: 'center' as const, padding: 24 }}>Данных о прогрессе нет</div>}
            </div>
          )}

          {/* Grades tab */}
          {tab === 'grades' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {grades.map(g => (
                <div key={g.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(27,143,196,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{g.grade_type}</div>
                    {g.comment && <div style={{ fontSize: 12, color: '#64748b' }}>{g.comment}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 20, fontWeight: 900, color: (g.score ?? 0) >= 70 ? '#16a34a' : '#dc2626' }}>{g.score ?? '—'}/{g.max_score}</div>
                    <div style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(g.graded_at).toLocaleDateString('ru-RU')}</div>
                  </div>
                </div>
              ))}
              {grades.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14 }}>Оценок нет</div>}
            </div>
          )}

          {/* Attendance tab */}
          {tab === 'attendance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {attendance.slice(0, 30).map(a => (
                <div key={a.id} style={{ background: '#fff', borderRadius: 12, padding: '12px 16px', border: '1px solid rgba(27,143,196,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{new Date(a.date).toLocaleDateString('ru-RU', { weekday: 'short', day: '2-digit', month: 'long' })}</div>
                  <StatusBadge status={a.status} />
                </div>
              ))}
              {attendance.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14 }}>Записей о посещаемости нет</div>}
            </div>
          )}

          {/* Assignments tab */}
          {tab === 'assignments' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {submissions.map(s => {
                const sub = s as LMSSubmission & { assignment?: { title?: string; max_score?: number } }
                return (
                  <div key={sub.id} style={{ background: '#fff', borderRadius: 14, padding: '14px 18px', border: '1px solid rgba(27,143,196,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1e293b' }}>{sub.assignment?.title ?? 'Задание'}</div>
                      <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>{new Date(sub.submitted_at).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <StatusBadge status={sub.status} />
                      {sub.score != null && <span style={{ fontSize: 16, fontWeight: 900, color: sub.score >= 70 ? '#16a34a' : '#dc2626' }}>{sub.score}/{sub.assignment?.max_score ?? 100}</span>}
                    </div>
                  </div>
                )
              })}
              {submissions.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14 }}>Заданий нет</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
