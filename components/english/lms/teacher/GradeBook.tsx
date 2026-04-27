'use client'
import { useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { LMSGrade, EnglishProfile } from '@/lib/english/lms/types'
import { exportToCSV } from '@/lib/english/lms/reports'
import { Download } from 'lucide-react'

const GRADE_TYPES = ['quiz', 'assignment', 'midterm', 'final'] as const
type GT = typeof GRADE_TYPES[number]
const GT_LABELS: Record<GT, string> = { quiz: 'Квиз', assignment: 'Задание', midterm: 'Рубеж', final: 'Итог' }

interface Props {
  groupId: string
  students: EnglishProfile[]
  grades: LMSGrade[]
  teacherId: string
  onUpdate: () => void
}

export default function GradeBook({ groupId, students, grades, teacherId, onUpdate }: Props) {
  const supabase = createEnglishClient()
  const [editing, setEditing] = useState<{ studentId: string; type: GT } | null>(null)
  const [inputVal, setInputVal] = useState('')

  function getGrade(studentId: string, type: GT): number | null {
    const g = grades.find(x => x.student_id === studentId && x.grade_type === type)
    return g?.score ?? null
  }

  function calcAverage(studentId: string): number | null {
    const scored = GRADE_TYPES.map(t => getGrade(studentId, t)).filter((v): v is number => v !== null)
    if (!scored.length) return null
    return Math.round(scored.reduce((a, b) => a + b, 0) / scored.length)
  }

  async function saveGrade(studentId: string, type: GT, score: number) {
    const existing = grades.find(x => x.student_id === studentId && x.grade_type === type)
    if (existing) {
      await supabase.from('lms_grades').update({ score }).eq('id', existing.id)
    } else {
      await supabase.from('lms_grades').insert({ student_id: studentId, teacher_id: teacherId, group_id: groupId, grade_type: type, score, max_score: 100 })
    }
    setEditing(null)
    onUpdate()
  }

  function handleExport() {
    const rows = students.map(s => ({
      'Студент': s.full_name ?? s.id,
      'Квиз': getGrade(s.id, 'quiz') ?? '',
      'Задание': getGrade(s.id, 'assignment') ?? '',
      'Рубеж': getGrade(s.id, 'midterm') ?? '',
      'Итог': getGrade(s.id, 'final') ?? '',
      'Среднее': calcAverage(s.id) ?? '',
    }))
    exportToCSV(rows as Record<string, unknown>[], 'журнал_оценок')
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={handleExport} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', borderRadius: 10, border: '1.5px solid rgba(27,143,196,0.25)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 13, cursor: 'pointer', fontFamily: 'Montserrat' }}>
          <Download size={14} /> Экспорт CSV
        </button>
      </div>
      <div style={{ overflowX: 'auto', borderRadius: 14, border: '1px solid rgba(27,58,107,0.08)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', background: '#fff' }}>
          <thead>
            <tr style={{ background: '#f8fafc' }}>
              <th style={{ padding: '11px 14px', textAlign: 'left', fontWeight: 800, color: '#1B3A6B', borderBottom: '1px solid rgba(27,58,107,0.08)' }}>Студент</th>
              {GRADE_TYPES.map(t => <th key={t} style={{ padding: '11px 14px', textAlign: 'center', fontWeight: 800, color: '#475569', borderBottom: '1px solid rgba(27,58,107,0.08)', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{GT_LABELS[t]}</th>)}
              <th style={{ padding: '11px 14px', textAlign: 'center', fontWeight: 800, color: '#1B3A6B', borderBottom: '1px solid rgba(27,58,107,0.08)' }}>Среднее</th>
            </tr>
          </thead>
          <tbody>
            {students.map(student => {
              const avg = calcAverage(student.id)
              return (
                <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b', fontSize: 13 }}>{student.full_name ?? '—'}</td>
                  {GRADE_TYPES.map(type => {
                    const val = getGrade(student.id, type)
                    const isEditing = editing?.studentId === student.id && editing?.type === type
                    return (
                      <td key={type} style={{ padding: '8px 10px', textAlign: 'center' }}>
                        {isEditing ? (
                          <input autoFocus type="number" min={0} max={100} value={inputVal}
                            onChange={e => setInputVal(e.target.value)}
                            onBlur={() => { const n = parseInt(inputVal); if (!isNaN(n) && n >= 0 && n <= 100) saveGrade(student.id, type, n); else setEditing(null) }}
                            onKeyDown={e => { if (e.key === 'Enter') { const n = parseInt(inputVal); if (!isNaN(n) && n >= 0 && n <= 100) saveGrade(student.id, type, n); else setEditing(null) } if (e.key === 'Escape') setEditing(null) }}
                            style={{ width: 54, textAlign: 'center', padding: '4px 6px', border: '2px solid #1B8FC4', borderRadius: 8, fontSize: 14, fontWeight: 800, fontFamily: 'Montserrat', outline: 'none' }} />
                        ) : (
                          <button onClick={() => { setEditing({ studentId: student.id, type }); setInputVal(val != null ? String(val) : '') }}
                            style={{ width: 54, height: 32, borderRadius: 8, border: val != null ? '1.5px solid rgba(27,143,196,0.2)' : '1.5px dashed #e2e8f0', background: val != null ? (val >= 70 ? '#dcfce7' : val >= 40 ? '#fef3c7' : '#fee2e2') : '#f8fafc', color: val != null ? (val >= 70 ? '#166534' : val >= 40 ? '#92400e' : '#991b1b') : '#94a3b8', fontWeight: 800, fontSize: 14, cursor: 'pointer', fontFamily: 'Montserrat' }}>
                            {val != null ? val : '+'}
                          </button>
                        )}
                      </td>
                    )
                  })}
                  <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 900, fontSize: 15, color: avg != null ? (avg >= 70 ? '#16a34a' : avg >= 40 ? '#d97706' : '#dc2626') : '#94a3b8' }}>
                    {avg != null ? avg : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
