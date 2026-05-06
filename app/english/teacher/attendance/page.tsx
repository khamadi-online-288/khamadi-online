'use client'
import { useEffect, useState, useCallback } from 'react'
import { createEnglishClient } from '@/lib/english/supabase-client'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import AttendanceGrid from '@/components/english/lms/teacher/AttendanceGrid'
import { Users, ChevronLeft, ChevronRight, CheckCircle, XCircle, Clock } from 'lucide-react'
import type { EnglishProfile, LMSAttendance } from '@/lib/english/lms/types'

const cardStyle: React.CSSProperties = { background: '#fff', borderRadius: 20, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }

interface Group { id: string; name: string }

function getWeekDates(offset: number): string[] {
  const dates: string[] = []
  const now = new Date()
  const day = now.getDay()
  const monday = new Date(now)
  monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1) + offset * 7)
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    dates.push(d.toISOString().split('T')[0])
  }
  return dates
}

export default function TeacherAttendancePage() {
  const supabase = createEnglishClient()
  const [uid, setUid] = useState('')
  const [groups, setGroups] = useState<Group[]>([])
  const [selectedGroup, setSelectedGroup] = useState<string>('')
  const [students, setStudents] = useState<EnglishProfile[]>([])
  const [attendance, setAttendance] = useState<LMSAttendance[]>([])
  const [weekOffset, setWeekOffset] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingData, setLoadingData] = useState(false)

  const dates = getWeekDates(weekOffset)
  const weekLabel = `${new Date(dates[0]).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short' })} — ${new Date(dates[6]).toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' })}`

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) return
      const id = session.user.id
      setUid(id)
      supabase.from('lms_groups').select('id,name').eq('teacher_id', id).order('name')
        .then(({ data }) => {
          const gs = (data ?? []) as Group[]
          setGroups(gs)
          if (gs.length > 0) setSelectedGroup(gs[0].id)
          setLoading(false)
        })
    })
  }, [])

  const loadAttendance = useCallback(async () => {
    if (!selectedGroup || !uid) return
    setLoadingData(true)
    const [studentsRes, attRes] = await Promise.all([
      supabase.from('lms_group_students').select('student:profiles(id,full_name,email,language_level,avatar_url)').eq('group_id', selectedGroup),
      supabase.from('lms_attendance').select('*').eq('group_id', selectedGroup).in('date', dates),
    ])
    const sts = (studentsRes.data ?? []).map((r: unknown) => (r as { student: EnglishProfile }).student).filter(Boolean)
    setStudents(sts)
    setAttendance((attRes.data ?? []) as LMSAttendance[])
    setLoadingData(false)
  }, [selectedGroup, uid, dates.join()])

  useEffect(() => { loadAttendance() }, [loadAttendance])

  // Stats for selected group in this week
  const presentCount = attendance.filter(a => a.status === 'present').length
  const absentCount  = attendance.filter(a => a.status === 'absent').length
  const lateCount    = attendance.filter(a => a.status === 'late').length
  const totalCells   = students.length * dates.length
  const markedCells  = attendance.length

  if (loading) {
    return (
      <div style={{ flex: 1 }}>
        <TeacherHeader title="Посещаемость" />
        <div style={{ padding: 40, textAlign: 'center', color: '#94a3b8' }}>Загрузка...</div>
      </div>
    )
  }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Посещаемость" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Group selector + week nav */}
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="#1B8FC4" />
            <select value={selectedGroup} onChange={e => setSelectedGroup(e.target.value)}
              style={{ padding: '10px 14px', border: '1.5px solid rgba(27,143,196,0.2)', borderRadius: 11, fontSize: 14, fontFamily: 'Montserrat', fontWeight: 700, background: '#fff', color: '#1B3A6B', cursor: 'pointer', minWidth: 200 }}>
              {groups.length === 0 && <option value="">Нет групп</option>}
              {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', borderRadius: 11, border: '1.5px solid rgba(27,143,196,0.2)', padding: '6px 10px' }}>
            <button onClick={() => setWeekOffset(w => w - 1)} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: 'rgba(27,143,196,0.08)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1B8FC4' }}>
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', padding: '0 8px', whiteSpace: 'nowrap' }}>{weekLabel}</span>
            <button onClick={() => setWeekOffset(w => w + 1)} disabled={weekOffset >= 0} style={{ width: 30, height: 30, borderRadius: 8, border: 'none', background: weekOffset >= 0 ? '#f1f5f9' : 'rgba(27,143,196,0.08)', cursor: weekOffset >= 0 ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: weekOffset >= 0 ? '#cbd5e1' : '#1B8FC4' }}>
              <ChevronRight size={16} />
            </button>
          </div>
          {weekOffset < 0 && (
            <button onClick={() => setWeekOffset(0)} style={{ padding: '8px 14px', borderRadius: 9, border: '1.5px solid rgba(27,143,196,0.2)', background: '#fff', color: '#1B8FC4', fontWeight: 700, fontSize: 12, cursor: 'pointer', fontFamily: 'Montserrat' }}>
              Текущая неделя
            </button>
          )}
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14 }}>
          {[
            { label: 'Студентов в группе', value: students.length, icon: <Users size={16} />, color: '#1B8FC4' },
            { label: 'Присутствовал', value: presentCount, icon: <CheckCircle size={16} />, color: '#10b981' },
            { label: 'Отсутствовал', value: absentCount, icon: <XCircle size={16} />, color: '#ef4444' },
            { label: 'Опоздал', value: lateCount, icon: <Clock size={16} />, color: '#f59e0b' },
          ].map(c => (
            <div key={c.label} style={{ ...cardStyle, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 38, height: 38, borderRadius: 11, background: `${c.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.color }}>{c.icon}</div>
              <div>
                <div style={{ fontSize: 10, color: '#64748b', fontWeight: 700, textTransform: 'uppercase' as const, letterSpacing: '0.5px' }}>{c.label}</div>
                <div style={{ fontSize: 22, fontWeight: 900, color: c.color }}>{c.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Attendance progress */}
        {totalCells > 0 && (
          <div style={{ ...cardStyle, padding: '16px 22px', display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#1B3A6B', whiteSpace: 'nowrap' }}>Заполнено за неделю:</div>
            <div style={{ flex: 1, height: 8, borderRadius: 99, background: '#f1f5f9', overflow: 'hidden' }}>
              <div style={{ height: '100%', borderRadius: 99, width: `${Math.round((markedCells / totalCells) * 100)}%`, background: '#1B8FC4', transition: 'width 0.4s' }} />
            </div>
            <div style={{ fontSize: 13, fontWeight: 900, color: '#1B8FC4', whiteSpace: 'nowrap' }}>{markedCells}/{totalCells} ячеек</div>
          </div>
        )}

        {/* Grid */}
        <div style={{ ...cardStyle, padding: 24, overflowX: 'auto' }}>
          {groups.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>📋</div>
              <div style={{ fontSize: 14 }}>У вас нет групп</div>
            </div>
          ) : loadingData ? (
            <div style={{ padding: '40px 0', textAlign: 'center', color: '#94a3b8' }}>Загрузка данных...</div>
          ) : students.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>👥</div>
              <div style={{ fontSize: 14 }}>В группе нет студентов</div>
            </div>
          ) : (
            <AttendanceGrid
              groupId={selectedGroup}
              students={students}
              dates={dates}
              attendance={attendance}
              teacherId={uid}
              onUpdate={loadAttendance}
            />
          )}
        </div>
      </div>
    </div>
  )
}
