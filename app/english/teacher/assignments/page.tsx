import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import StatusBadge from '@/components/english/lms/shared/StatusBadge'
import Link from 'next/link'
import { Plus, Clock, Users } from 'lucide-react'

const TYPE_LABELS: Record<string, string> = { essay: 'Эссе', quiz: 'Тест', speaking: 'Говорение', reading: 'Чтение', project: 'Проект' }

type RawAssignment = { id: string; title: string; type: string | null; due_date: string | null; max_score: number; group: { id: string; name: string } | null }
type EnrichedAssignment = RawAssignment & { totalStudents: number; submittedCount: number; overdue: boolean }

export default async function TeacherAssignmentsPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: assignments } = await supabase
    .from('lms_assignments')
    .select('id,title,type,due_date,max_score,created_at,group:lms_groups(id,name)')
    .eq('teacher_id', session.user.id)
    .order('created_at', { ascending: false })

  const enriched: EnrichedAssignment[] = await Promise.all(
    ((assignments ?? []) as unknown as RawAssignment[]).map(async a => {
      const { count: total } = await supabase.from('lms_group_students').select('id', { count: 'exact', head: true }).eq('group_id', a.group?.id ?? '')
      const { count: submitted } = await supabase.from('lms_assignment_submissions').select('id', { count: 'exact', head: true }).eq('assignment_id', a.id)
      return { ...a, totalStudents: total ?? 0, submittedCount: submitted ?? 0, overdue: Boolean(a.due_date && new Date(a.due_date) < new Date()) }
    })
  )

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Задания" />
      <div style={{ padding: '24px 28px' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 20 }}>
          <Link href="/english/teacher/assignments/create" style={{ textDecoration: 'none' }}>
            <button style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '11px 22px', borderRadius: 12, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 14, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>
              <Plus size={16} /> Создать задание
            </button>
          </Link>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {enriched.map(a => (
            <div key={a.id} style={{ background: '#fff', borderRadius: 18, padding: '20px 24px', border: `1px solid ${a.overdue ? 'rgba(239,68,68,0.2)' : 'rgba(27,143,196,0.1)'}`, boxShadow: '0 2px 10px rgba(27,58,107,0.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', marginBottom: 6 }}>
                  <div style={{ fontSize: 16, fontWeight: 800, color: '#1B3A6B' }}>{a.title}</div>
                  {a.type && <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 700 }}>{TYPE_LABELS[a.type] ?? a.type}</span>}
                  {a.overdue && <span style={{ background: '#fee2e2', color: '#dc2626', borderRadius: 6, padding: '3px 9px', fontSize: 12, fontWeight: 700 }}>Просрочено</span>}
                </div>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: '#64748b', flexWrap: 'wrap' }}>
                  {a.group && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Users size={12} /> {a.group.name}</span>}
                  {a.due_date && <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}><Clock size={12} /> {new Date(a.due_date).toLocaleDateString('ru-RU')}</span>}
                  <span>Макс. балл: {a.max_score}</span>
                </div>
              </div>
              <div style={{ textAlign: 'center', minWidth: 80 }}>
                <div style={{ fontSize: 22, fontWeight: 900, color: '#1B8FC4' }}>{a.submittedCount}/{a.totalStudents}</div>
                <div style={{ fontSize: 11, color: '#94a3b8' }}>сдано</div>
              </div>
              <Link href={`/english/teacher/assignments/${a.id}`} style={{ textDecoration: 'none' }}>
                <button style={{ padding: '9px 18px', borderRadius: 11, background: 'rgba(27,143,196,0.08)', color: '#1B8FC4', fontWeight: 700, fontSize: 13, border: '1.5px solid rgba(27,143,196,0.2)', cursor: 'pointer', fontFamily: 'Montserrat' }}>Открыть</button>
              </Link>
            </div>
          ))}
          {enriched.length === 0 && (
            <div style={{ textAlign: 'center', padding: '60px 24px', color: '#94a3b8' }}>
              <div style={{ fontSize: 48, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 16 }}>Заданий ещё нет</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
