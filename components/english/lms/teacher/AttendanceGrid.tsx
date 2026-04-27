'use client'
import { useState } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import type { LMSAttendance, EnglishProfile } from '@/lib/english/lms/types'
import { getAttendancePercent } from '@/lib/english/lms/progress'

const STATUSES = ['present','absent','late','excused'] as const
type AttStatus = typeof STATUSES[number]
const STATUS_COLORS: Record<AttStatus, string> = { present: '#10b981', absent: '#ef4444', late: '#f59e0b', excused: '#8b5cf6' }
const STATUS_LABELS: Record<AttStatus, string> = { present: 'П', absent: 'О', late: 'Оп', excused: 'У' }

interface Props {
  groupId: string
  students: EnglishProfile[]
  dates: string[]
  attendance: LMSAttendance[]
  teacherId: string
  onUpdate: () => void
}

export default function AttendanceGrid({ groupId, students, dates, attendance, teacherId, onUpdate }: Props) {
  const supabase = createEnglishClient()
  const [saving, setSaving] = useState<string | null>(null)

  function getStatus(studentId: string, date: string): AttStatus | null {
    return (attendance.find(a => a.student_id === studentId && a.date === date)?.status as AttStatus) ?? null
  }

  async function toggle(studentId: string, date: string) {
    const current = getStatus(studentId, date)
    const next: AttStatus = current === null ? 'present' : current === 'present' ? 'absent' : current === 'absent' ? 'late' : current === 'late' ? 'excused' : 'present'
    const key = `${studentId}-${date}`
    setSaving(key)
    const existing = attendance.find(a => a.student_id === studentId && a.date === date)
    if (existing) {
      await supabase.from('lms_attendance').update({ status: next }).eq('id', existing.id)
    } else {
      await supabase.from('lms_attendance').insert({ student_id: studentId, group_id: groupId, teacher_id: teacherId, date, status: next })
    }
    setSaving(null)
    onUpdate()
  }

  async function markAllPresent(date: string) {
    for (const s of students) {
      const existing = attendance.find(a => a.student_id === s.id && a.date === date)
      if (existing) {
        if (existing.status !== 'present') await supabase.from('lms_attendance').update({ status: 'present' }).eq('id', existing.id)
      } else {
        await supabase.from('lms_attendance').insert({ student_id: s.id, group_id: groupId, teacher_id: teacherId, date, status: 'present' })
      }
    }
    onUpdate()
  }

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ marginBottom: 12, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        {STATUSES.map(s => (
          <span key={s} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#64748b' }}>
            <span style={{ width: 18, height: 18, borderRadius: 4, background: STATUS_COLORS[s], display: 'inline-block' }} />
            {s === 'present' ? 'Присутствует' : s === 'absent' ? 'Отсутствует' : s === 'late' ? 'Опоздал' : 'Уваж. причина'}
          </span>
        ))}
      </div>
      <table style={{ borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr>
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 800, color: '#1B3A6B', minWidth: 160, borderBottom: '2px solid rgba(27,58,107,0.12)', background: '#f8fafc' }}>Студент</th>
            {dates.map(d => (
              <th key={d} style={{ padding: '8px 10px', textAlign: 'center', fontWeight: 700, color: '#475569', fontSize: 11, borderBottom: '2px solid rgba(27,58,107,0.12)', background: '#f8fafc', minWidth: 52 }}>
                <div>{new Date(d).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })}</div>
                <button onClick={() => markAllPresent(d)} style={{ fontSize: 9, color: '#1B8FC4', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 700, marginTop: 2 }}>Все П</button>
              </th>
            ))}
            <th style={{ padding: '10px 14px', fontWeight: 800, color: '#1B3A6B', borderBottom: '2px solid rgba(27,58,107,0.12)', background: '#f8fafc' }}>%</th>
          </tr>
        </thead>
        <tbody>
          {students.map(student => {
            const studentRec = attendance.filter(a => a.student_id === student.id)
            const pct = getAttendancePercent(studentRec)
            return (
              <tr key={student.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                <td style={{ padding: '10px 14px', fontWeight: 600, color: '#1e293b' }}>{student.full_name ?? '—'}</td>
                {dates.map(d => {
                  const st = getStatus(student.id, d)
                  const key = `${student.id}-${d}`
                  return (
                    <td key={d} style={{ padding: '6px 8px', textAlign: 'center' }}>
                      <button onClick={() => toggle(student.id, d)} disabled={saving === key}
                        style={{ width: 32, height: 32, borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 800, fontSize: 12, background: st ? STATUS_COLORS[st] : '#e2e8f0', color: st ? '#fff' : '#94a3b8', transition: 'all 0.1s', opacity: saving === key ? 0.5 : 1 }}>
                        {st ? STATUS_LABELS[st] : '—'}
                      </button>
                    </td>
                  )
                })}
                <td style={{ padding: '10px 14px', textAlign: 'center', fontWeight: 800, color: pct >= 70 ? '#16a34a' : pct >= 50 ? '#f59e0b' : '#dc2626' }}>{pct}%</td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
