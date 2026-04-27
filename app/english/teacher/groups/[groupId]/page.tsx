'use client'
import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import AttendanceGrid from '@/components/english/lms/teacher/AttendanceGrid'
import GradeBook from '@/components/english/lms/teacher/GradeBook'
import ProgressBar from '@/components/english/lms/shared/ProgressBar'
import DataTable from '@/components/english/lms/shared/DataTable'
import type { EnglishProfile, LMSAttendance, LMSGrade, LMSProgress } from '@/lib/english/lms/types'
import { calculateCourseProgress, calculateAverageScore } from '@/lib/english/lms/progress'
import Link from 'next/link'
import type { SupabaseClient } from '@supabase/supabase-js'

function AddStudentByEmail({ groupId, currentStudentIds, onAdded, supabase }: {
  groupId: string
  currentStudentIds: string[]
  onAdded: () => void
  supabase: SupabaseClient
}) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = email.trim().toLowerCase()
    if (!trimmed) return
    setStatus('loading')
    setMessage('')

    const { data: profile } = await supabase
      .from('profiles')
      .select('id,full_name,email')
      .ilike('email', trimmed)
      .maybeSingle()

    if (!profile) {
      setStatus('error')
      setMessage('Пользователь с таким email не найден')
      return
    }

    if (currentStudentIds.includes(profile.id as string)) {
      setStatus('error')
      setMessage('Студент уже состоит в этой группе')
      return
    }

    const { error } = await supabase
      .from('lms_group_students')
      .insert({ group_id: groupId, student_id: profile.id })

    if (error) { setStatus('error'); setMessage('Ошибка добавления: ' + error.message); return }

    await supabase.from('english_notifications').insert({
      user_id: profile.id,
      title: 'Вы добавлены в группу',
      body: 'Преподаватель добавил вас в учебную группу.',
      type: 'group',
    })

    setStatus('success')
    setMessage(`${String(profile.full_name ?? profile.email)} добавлен(а) в группу`)
    setEmail('')
    onAdded()
    setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <form onSubmit={handleAdd} style={{ background: '#f8fafc', borderRadius: 14, padding: '16px 18px', border: '1.5px solid rgba(27,143,196,0.15)', marginBottom: 18, display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' as const }}>
      <input
        value={email}
        onChange={e => { setEmail(e.target.value); setStatus('idle'); setMessage('') }}
        placeholder="Email студента..."
        type="email"
        style={{ flex: 1, minWidth: 220, padding: '9px 14px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.2)', fontSize: 13, fontFamily: 'Montserrat', outline: 'none', background: '#fff' }}
      />
      <button type="submit" disabled={status === 'loading' || !email.trim()} style={{ padding: '9px 18px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat', whiteSpace: 'nowrap' as const }}>
        {status === 'loading' ? 'Поиск...' : '+ Добавить студента'}
      </button>
      {message && (
        <div style={{ width: '100%', fontSize: 12, fontWeight: 700, color: status === 'success' ? '#16a34a' : '#dc2626', marginTop: 2 }}>{message}</div>
      )}
    </form>
  )
}

type Tab = 'overview' | 'students' | 'attendance' | 'grades' | 'assignments'
const TABS: { id: Tab; label: string }[] = [
  { id: 'overview',    label: 'Обзор' },
  { id: 'students',    label: 'Студенты' },
  { id: 'attendance',  label: 'Посещаемость' },
  { id: 'grades',      label: 'Оценки' },
  { id: 'assignments', label: 'Задания' },
]

export default function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>()
  const searchParams = useSearchParams()
  const [tab, setTab] = useState<Tab>((searchParams.get('tab') as Tab) ?? 'overview')
  const [group, setGroup] = useState<Record<string, unknown> | null>(null)
  const [students, setStudents] = useState<EnglishProfile[]>([])
  const [attendance, setAttendance] = useState<LMSAttendance[]>([])
  const [grades, setGrades] = useState<LMSGrade[]>([])
  const [progress, setProgress] = useState<LMSProgress[]>([])
  const [assignments, setAssignments] = useState<Record<string, unknown>[]>([])
  const [teacherId, setTeacherId] = useState('')
  const [loading, setLoading] = useState(true)
  const [dates, setDates] = useState<string[]>([])
  const supabase = createEnglishClient()

  useEffect(() => { load() }, [groupId])

  async function load() {
    setLoading(true)
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return
    setTeacherId(session.user.id)

    const [groupRes, studentsRes, attRes, gradesRes, progressRes, assignRes] = await Promise.all([
      supabase.from('lms_groups').select('id,name,academic_year,department').eq('id', groupId).single(),
      supabase.from('lms_group_students').select('student:profiles(id,full_name,email,last_seen_at,language_level,avatar_url)').eq('group_id', groupId),
      supabase.from('lms_attendance').select('*').eq('group_id', groupId).order('date'),
      supabase.from('lms_grades').select('*').eq('group_id', groupId),
      supabase.from('lms_progress').select('*').in('student_id',
        (await supabase.from('lms_group_students').select('student_id').eq('group_id', groupId)).data?.map((x: { student_id: string }) => x.student_id) ?? []
      ),
      supabase.from('lms_assignments').select('id,title,type,due_date,max_score').eq('group_id', groupId).order('created_at', { ascending: false }),
    ])

    setGroup(groupRes.data as Record<string, unknown>)
    const sts = (studentsRes.data ?? []).map((s: { student: EnglishProfile }) => s.student).filter(Boolean)
    setStudents(sts as EnglishProfile[])
    setAttendance(attRes.data as LMSAttendance[] ?? [])
    setGrades(gradesRes.data as LMSGrade[] ?? [])
    setProgress(progressRes.data as LMSProgress[] ?? [])
    setAssignments(assignRes.data as Record<string, unknown>[] ?? [])

    // Последние 14 дат
    const datesSet = new Set((attRes.data ?? []).map((a: { date: string }) => a.date))
    const last14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(); d.setDate(d.getDate() - (13 - i))
      return d.toISOString().split('T')[0]
    })
    setDates(last14)
    setLoading(false)
  }

  const avgProgress = students.length > 0
    ? Math.round(students.map(s => calculateCourseProgress(progress.filter(p => p.student_id === s.id))).reduce((a, b) => a + b, 0) / students.length)
    : 0

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title={String(group?.name ?? 'Группа')} />
      <div style={{ padding: '24px 28px' }}>
        {/* Tabs */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, background: '#f1f5f9', borderRadius: 12, padding: 4 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: '9px 20px', borderRadius: 10, fontWeight: tab === t.id ? 800 : 600, fontSize: 13, border: 'none', background: tab === t.id ? '#fff' : 'transparent', color: tab === t.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', boxShadow: tab === t.id ? '0 1px 4px rgba(0,0,0,0.1)' : 'none', transition: 'all 0.15s' }}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Overview */}
        {tab === 'overview' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 18 }}>
            <div style={{ background: '#fff', borderRadius: 18, padding: 22, border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>СТУДЕНТОВ</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1B3A6B' }}>{students.length}</div>
            </div>
            <div style={{ background: '#fff', borderRadius: 18, padding: 22, border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>СРЕДНИЙ ПРОГРЕСС</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1B3A6B', marginBottom: 8 }}>{avgProgress}%</div>
              <ProgressBar value={avgProgress} showLabel={false} />
            </div>
            <div style={{ background: '#fff', borderRadius: 18, padding: 22, border: '1px solid rgba(27,143,196,0.1)' }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#64748b', marginBottom: 8 }}>ЗАДАНИЙ</div>
              <div style={{ fontSize: 32, fontWeight: 900, color: '#1B3A6B' }}>{assignments.length}</div>
            </div>
          </div>
        )}

        {/* Students */}
        {tab === 'students' && (
          <div>
            <AddStudentByEmail groupId={groupId} currentStudentIds={students.map(s => s.id)} onAdded={load} supabase={supabase} />
            <DataTable
              data={students.map(s => ({
                ...s,
                progress: calculateCourseProgress(progress.filter(p => p.student_id === s.id)),
                avg_score: calculateAverageScore(grades.filter(g => g.student_id === s.id)),
              } as Record<string, unknown>))}
              columns={[
                { key: 'full_name', header: 'Студент', render: s => (
                  <Link href={`/english/teacher/students/${s.id}`} style={{ fontWeight: 700, color: '#1B3A6B', textDecoration: 'none' }}>{s.full_name as string ?? '—'}</Link>
                )},
                { key: 'language_level', header: 'Уровень', render: s => s.language_level ? <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '3px 8px', fontSize: 12, fontWeight: 700 }}>{s.language_level as string}</span> : '—' },
                { key: 'progress', header: 'Прогресс', render: s => <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><ProgressBar value={s.progress as number} /><span style={{ fontSize: 12, fontWeight: 700 }}>{s.progress as number}%</span></div> },
                { key: 'avg_score', header: 'Ср. балл', render: s => <span style={{ fontWeight: 800, color: (s.avg_score as number) >= 70 ? '#16a34a' : '#dc2626' }}>{(s.avg_score as number) || '—'}</span> },
                { key: 'last_seen_at', header: 'Последний вход', render: s => s.last_seen_at ? new Date(s.last_seen_at as string).toLocaleDateString('ru-RU') : 'Никогда' },
              ]}
              searchKeys={['full_name', 'email']}
            />
          </div>
        )}

        {/* Attendance */}
        {tab === 'attendance' && !loading && (
          <AttendanceGrid groupId={groupId} students={students} dates={dates} attendance={attendance} teacherId={teacherId} onUpdate={load} />
        )}

        {/* Grades */}
        {tab === 'grades' && !loading && (
          <GradeBook groupId={groupId} students={students} grades={grades} teacherId={teacherId} onUpdate={load} />
        )}

        {/* Assignments */}
        {tab === 'assignments' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Link href="/english/teacher/assignments/create" style={{ textDecoration: 'none' }}>
                <button style={{ padding: '10px 20px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>+ Создать задание</button>
              </Link>
            </div>
            {assignments.map(a => (
              <div key={a.id as string} style={{ background: '#fff', borderRadius: 14, padding: '16px 20px', border: '1px solid rgba(27,143,196,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{a.title as string}</div>
                  <div style={{ fontSize: 12, color: '#64748b', marginTop: 3 }}>
                    {String(a.type ?? '') && <span style={{ marginRight: 12 }}>Тип: {String(a.type ?? '')}</span>}
                    {String(a.due_date ?? '') && <span>Дедлайн: {new Date(String(a.due_date)).toLocaleDateString('ru-RU')}</span>}
                  </div>
                </div>
                <Link href={`/english/teacher/assignments/${a.id}`} style={{ textDecoration: 'none' }}>
                  <button style={{ padding: '7px 16px', borderRadius: 10, background: 'rgba(27,143,196,0.08)', color: '#1B8FC4', fontWeight: 700, fontSize: 12, border: '1.5px solid rgba(27,143,196,0.2)', cursor: 'pointer', fontFamily: 'Montserrat' }}>Открыть</button>
                </Link>
              </div>
            ))}
            {assignments.length === 0 && <div style={{ color: '#94a3b8', fontSize: 14, padding: 20 }}>Заданий нет</div>}
          </div>
        )}
      </div>
    </div>
  )
}
