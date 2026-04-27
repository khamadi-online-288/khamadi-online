import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import StatCard from '@/components/english/lms/shared/StatCard'
import { Users, TrendingUp, ClipboardCheck, AlertTriangle, Calendar, Clock } from 'lucide-react'
import Link from 'next/link'

export default async function TeacherDashboard() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')
  const uid = session.user.id

  const { data: groups } = await supabase.from('lms_groups').select('id,name').eq('teacher_id', uid)
  const groupIds = (groups ?? []).map(g => g.id)

  const { data: groupStudents } = groupIds.length
    ? await supabase.from('lms_group_students').select('student_id').in('group_id', groupIds)
    : { data: [] }
  const studentIds = [...new Set((groupStudents ?? []).map(gs => (gs as { student_id: string }).student_id))]

  const myAssignmentIds = (await supabase.from('lms_assignments').select('id').eq('teacher_id', uid)).data?.map(a => (a as { id: string }).id) ?? []
  const { count: pendingCount } = myAssignmentIds.length
    ? await supabase.from('lms_assignment_submissions').select('id', { count: 'exact', head: true }).eq('status', 'submitted').in('assignment_id', myAssignmentIds)
    : { count: 0 }

  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { count: atRiskCount } = studentIds.length
    ? await supabase.from('profiles').select('id', { count: 'exact', head: true }).in('id', studentIds).or(`last_seen_at.is.null,last_seen_at.lt.${weekAgo}`)
    : { count: 0 }

  const { data: progressData } = studentIds.length
    ? await supabase.from('lms_progress').select('status').in('student_id', studentIds)
    : { data: [] }
  const total = progressData?.length ?? 0
  const completed = (progressData ?? []).filter(p => (p as { status: string }).status === 'completed').length
  const avgProgress = total > 0 ? Math.round((completed / total) * 100) : 0

  const { data: events } = await supabase.from('lms_schedule').select('id,title,start_time,type,location').eq('teacher_id', uid).gte('start_time', new Date().toISOString()).order('start_time').limit(4)

  const { data: submissions } = myAssignmentIds.length ? await supabase
    .from('lms_assignment_submissions')
    .select('id,submitted_at,student:profiles(full_name),assignment:lms_assignments(title)')
    .eq('status', 'submitted')
    .order('submitted_at', { ascending: false })
    .limit(6) : { data: [] }

  const EVENT_TYPES: Record<string, string> = { lesson: 'Урок', exam: 'Экзамен', consultation: 'Консультация', event: 'Событие' }

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Главная" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        {/* Метрики */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18 }}>
          <StatCard title="Студентов" value={studentIds.length} icon={<Users size={20} />} color="#1B8FC4" />
          <StatCard title="Средний прогресс" value={`${avgProgress}%`} icon={<TrendingUp size={20} />} color="#10b981" />
          <StatCard title="Ожидают проверки" value={pendingCount ?? 0} icon={<ClipboardCheck size={20} />} color="#C9933B" subtitle="заданий" />
          <StatCard title="Группа риска" value={atRiskCount ?? 0} icon={<AlertTriangle size={20} />} color="#ef4444" subtitle="7+ дней без активности" />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
          {/* Ближайшие события */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Ближайшие события</div>
              <Link href="/english/teacher/schedule" style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, textDecoration: 'none' }}>Все →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(events ?? []).length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет событий</div>
                : (events ?? []).map(ev => {
                  const e = ev as { id: string; title: string; start_time: string; type?: string; location?: string }
                  return (
                    <div key={e.id} style={{ padding: '12px 14px', borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: '#1e293b' }}>{e.title}</div>
                      <div style={{ fontSize: 11, color: '#94a3b8', marginTop: 4, display: 'flex', gap: 8 }}>
                        <Calendar size={11} style={{ flexShrink: 0 }} />
                        {new Date(e.start_time).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                        {e.type && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 4, padding: '1px 6px', fontWeight: 700 }}>{EVENT_TYPES[e.type] ?? e.type}</span>}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>

          {/* Последние сдачи */}
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Сдачи заданий</div>
              <Link href="/english/teacher/assignments" style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, textDecoration: 'none' }}>Все →</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {(submissions ?? []).length === 0 ? <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет новых сдач</div>
                : (submissions ?? []).map(s => {
                  const sub = s as { id: string; submitted_at: string; student: { full_name?: string } | null; assignment: { title?: string } | null }
                  return (
                    <div key={sub.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', borderRadius: 10, background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 700, color: '#1e293b' }}>{sub.student?.full_name ?? 'Студент'}</div>
                        <div style={{ fontSize: 11, color: '#64748b' }}>{sub.assignment?.title ?? 'Задание'}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Clock size={11} />{new Date(sub.submitted_at).toLocaleString('ru-RU', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* Мои группы */}
        {(groups ?? []).length > 0 && (
          <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
              <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B' }}>Мои группы</div>
              <Link href="/english/teacher/groups" style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, textDecoration: 'none' }}>Все группы →</Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(220px,1fr))', gap: 14 }}>
              {(groups ?? []).map(g => {
                const gr = g as { id: string; name: string }
                return (
                  <Link key={gr.id} href={`/english/teacher/groups/${gr.id}`} style={{ textDecoration: 'none' }}>
                    <div style={{ padding: '16px 18px', borderRadius: 14, border: '1.5px solid rgba(27,143,196,0.15)', background: 'rgba(27,143,196,0.03)', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.borderColor = '#1B8FC4')}
                      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(27,143,196,0.15)')}>
                      <div style={{ fontSize: 14, fontWeight: 800, color: '#1B3A6B' }}>{gr.name}</div>
                      <div style={{ fontSize: 12, color: '#94a3b8', marginTop: 4 }}>Открыть группу →</div>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
