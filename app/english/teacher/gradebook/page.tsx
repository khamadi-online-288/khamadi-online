'use client'
import { useEffect, useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import { useLanguage } from '@/app/english/context/LanguageContext'
import GradeBook from '@/components/english/lms/teacher/GradeBook'
import type { EnglishProfile, LMSGrade } from '@/lib/english/lms/types'
import { calculateAverageScore } from '@/lib/english/lms/progress'
import { Users, TrendingUp, Award, Download } from 'lucide-react'

interface Group { id: string; name: string }

const card: React.CSSProperties = { background: '#fff', borderRadius: 18, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 10px rgba(27,58,107,0.06)' }

export default function TeacherGradebookPage() {
  const supabase = createEnglishClient()
  const { t } = useLanguage()
  const [uid, setUid]             = useState('')
  const [groups, setGroups]       = useState<Group[]>([])
  const [selected, setSelected]   = useState('')
  const [students, setStudents]   = useState<EnglishProfile[]>([])
  const [grades, setGrades]       = useState<LMSGrade[]>([])
  const [quizMap, setQuizMap]     = useState<Record<string, { avg: number; count: number }>>({})
  const [loading, setLoading]     = useState(true)
  const [loadingGroup, setLoadingGroup] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) return
      setUid(session.user.id)
      const { data } = await supabase.from('lms_groups').select('id,name').eq('teacher_id', session.user.id).order('name')
      const gs = (data ?? []) as Group[]
      setGroups(gs)
      if (gs.length) setSelected(gs[0].id)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!selected) return
    loadGroup(selected)
  }, [selected])

  async function loadGroup(groupId: string) {
    setLoadingGroup(true)
    const [gsRes, gradesRes] = await Promise.all([
      supabase.from('lms_group_students').select('student:profiles(id,full_name,email,language_level,avatar_url)').eq('group_id', groupId),
      supabase.from('lms_grades').select('*').eq('group_id', groupId),
    ])
    const sts = (gsRes.data ?? []).map((r: unknown) => (r as { student: EnglishProfile }).student).filter(Boolean) as EnglishProfile[]
    setStudents(sts)
    setGrades((gradesRes.data ?? []) as LMSGrade[])

    // Load quiz averages from english_quiz_results
    if (sts.length) {
      const { data: qr } = await supabase
        .from('english_quiz_results')
        .select('user_id, score')
        .in('user_id', sts.map(s => s.id))
      const map: Record<string, { avg: number; count: number }> = {}
      ;((qr ?? []) as { user_id: string; score: number }[]).forEach(r => {
        if (!map[r.user_id]) map[r.user_id] = { avg: 0, count: 0 }
        map[r.user_id].count++
        map[r.user_id].avg = ((map[r.user_id].avg * (map[r.user_id].count - 1)) + r.score) / map[r.user_id].count
      })
      Object.keys(map).forEach(k => { map[k].avg = Math.round(map[k].avg) })
      setQuizMap(map)
    }
    setLoadingGroup(false)
  }

  function exportGroupCSV() {
    const GT = ['quiz', 'assignment', 'midterm', 'final'] as const
    const rows = [['Студент', 'Квиз (авто)', 'Кол-во квизов', 'Квиз', 'Задание', 'Рубеж', 'Итог', 'Среднее']]
    students.forEach(s => {
      const autoQ = quizMap[s.id]
      const get = (type: string) => grades.find(g => g.student_id === s.id && g.grade_type === type)?.score ?? ''
      const manual = GT.map(t => get(t) as number | string)
      const allScores = GT.map(t => grades.find(g => g.student_id === s.id && g.grade_type === t)?.score).filter((v): v is number => v != null)
      const avg = allScores.length ? Math.round(allScores.reduce((a, b) => a + b, 0) / allScores.length) : ''
      rows.push([s.full_name ?? s.id, autoQ ? String(autoQ.avg) : '', autoQ ? String(autoQ.count) : '0', ...manual.map(String), String(avg)])
    })
    const csv = '﻿' + rows.map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    a.download = `gradebook-${groups.find(g => g.id === selected)?.name ?? selected}-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const groupGrades = grades
  const graded = students.filter(s => grades.some(g => g.student_id === s.id))
  const avgAll = students.length
    ? Math.round(students.map(s => calculateAverageScore(grades.filter(g => g.student_id === s.id))).reduce((a, b) => a + b, 0) / students.length)
    : 0
  const topCount = students.filter(s => calculateAverageScore(grades.filter(g => g.student_id === s.id)) >= 80).length

  if (loading) return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title={t.teacher.gradebook} />
      <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
    </div>
  )

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title={t.teacher.gradebook} />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Group selector */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: '#475569' }}>Группа:</div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {groups.map(g => (
              <button key={g.id} onClick={() => setSelected(g.id)} style={{ padding: '8px 18px', borderRadius: 10, fontWeight: selected === g.id ? 800 : 600, fontSize: 13, border: selected === g.id ? '2px solid #1B8FC4' : '1.5px solid rgba(27,143,196,0.2)', background: selected === g.id ? '#f0f9ff' : '#fff', color: selected === g.id ? '#1B3A6B' : '#64748b', cursor: 'pointer', fontFamily: 'Montserrat', transition: 'all 0.15s' }}>
                {g.name}
              </button>
            ))}
          </div>
          {selected && (
            <button onClick={exportGroupCSV} style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 6, padding: '9px 16px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 13, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <Download size={14} /> Экспорт CSV
            </button>
          )}
        </div>

        {groups.length === 0 && (
          <div style={{ ...card, padding: '60px 0', textAlign: 'center', color: '#94a3b8' }}>
            <div style={{ fontSize: 36, marginBottom: 10 }}>📚</div>
            <div>У вас нет групп</div>
          </div>
        )}

        {selected && (
          <>
            {/* KPI */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
              {[
                { label: 'Студентов', value: students.length, icon: <Users size={16} />, color: '#1B8FC4' },
                { label: 'Оценены', value: graded.length, icon: <Award size={16} />, color: '#10b981' },
                { label: 'Средний балл', value: avgAll ? `${avgAll}%` : '—', icon: <TrendingUp size={16} />, color: '#C9933B' },
                { label: 'Отличников (80%+)', value: topCount, icon: <Award size={16} />, color: '#8b5cf6' },
              ].map(c => (
                <div key={c.label} style={{ ...card, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 11, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{c.label}</div>
                    <div style={{ fontSize: 20, fontWeight: 900, color: c.color }}>{loadingGroup ? '...' : c.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quiz auto-scores summary */}
            {Object.keys(quizMap).length > 0 && (
              <div style={{ ...card, padding: 20 }}>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 14 }}>Автоматические баллы за квизы</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px,1fr))', gap: 10 }}>
                  {students.filter(s => quizMap[s.id]).map(s => {
                    const q = quizMap[s.id]
                    return (
                      <div key={s.id} style={{ background: '#f8fafc', borderRadius: 12, padding: '12px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #f1f5f9' }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{s.full_name ?? '—'}</div>
                          <div style={{ fontSize: 11, color: '#94a3b8' }}>{q.count} попыток</div>
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 900, color: q.avg >= 70 ? '#10b981' : q.avg >= 50 ? '#f59e0b' : '#ef4444' }}>{q.avg}%</div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* GradeBook */}
            <div style={{ ...card, padding: 24 }}>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B', marginBottom: 16 }}>Журнал (Квиз / Задание / Рубеж / Итог)</div>
              {loadingGroup ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка оценок...</div>
              ) : students.length === 0 ? (
                <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>В группе нет студентов</div>
              ) : (
                <GradeBook groupId={selected} students={students} grades={groupGrades} teacherId={uid} onUpdate={() => loadGroup(selected)} />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
