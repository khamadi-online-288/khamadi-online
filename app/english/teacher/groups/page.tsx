import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import TeacherHeader from '@/components/english/lms/teacher/TeacherHeader'
import ProgressBar from '@/components/english/lms/shared/ProgressBar'
import Link from 'next/link'
import { Users, BarChart3, ClipboardList } from 'lucide-react'

export default async function TeacherGroupsPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: groups } = await supabase
    .from('lms_groups')
    .select('id,name,description,academic_year,department')
    .eq('teacher_id', session.user.id)
    .order('name')

  // Студенты для каждой группы
  const groupsWithData = await Promise.all(
    (groups ?? []).map(async g => {
      const gr = g as { id: string; name: string; description?: string; academic_year?: string; department?: string }
      const { count: studentCount } = await supabase.from('lms_group_students').select('id', { count: 'exact', head: true }).eq('group_id', gr.id)
      const { data: ca } = await supabase.from('lms_course_assignments').select('course:english_courses(title,level)').eq('group_id', gr.id).limit(1).maybeSingle()
      return { ...gr, studentCount: studentCount ?? 0, course: (ca as { course?: { title: string; level: string } } | null)?.course }
    })
  )

  return (
    <div style={{ flex: 1 }}>
      <TeacherHeader title="Мои группы" />
      <div style={{ padding: '24px 28px' }}>
        {groupsWithData.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 24px', color: '#94a3b8', fontSize: 16 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>👥</div>
            У вас пока нет групп. Обратитесь к администратору для назначения.
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 20 }}>
            {groupsWithData.map(g => (
              <div key={g.id} style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)', boxShadow: '0 2px 12px rgba(27,58,107,0.07)' }}>
                <div style={{ fontSize: 18, fontWeight: 900, color: '#1B3A6B', marginBottom: 6 }}>{g.name}</div>
                {g.course && <div style={{ fontSize: 12, color: '#1B8FC4', fontWeight: 700, marginBottom: 4 }}>{g.course.title} · {g.course.level}</div>}
                {g.academic_year && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 4 }}>Уч. год: {g.academic_year}</div>}
                {g.department && <div style={{ fontSize: 12, color: '#94a3b8', marginBottom: 12 }}>Отдел: {g.department}</div>}
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16, fontSize: 13, color: '#475569' }}>
                  <Users size={14} />
                  <span style={{ fontWeight: 700 }}>{g.studentCount}</span> студентов
                </div>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  <Link href={`/english/teacher/groups/${g.id}`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '8px 16px', borderRadius: 10, background: '#1B3A6B', color: '#fff', fontWeight: 700, fontSize: 12, border: 'none', cursor: 'pointer', fontFamily: 'Montserrat' }}>Открыть</button>
                  </Link>
                  <Link href={`/english/teacher/groups/${g.id}?tab=attendance`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(27,143,196,0.08)', color: '#1B8FC4', fontWeight: 700, fontSize: 12, border: '1.5px solid rgba(27,143,196,0.2)', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <BarChart3 size={12} /> Посещ.
                    </button>
                  </Link>
                  <Link href={`/english/teacher/groups/${g.id}?tab=grades`} style={{ textDecoration: 'none' }}>
                    <button style={{ padding: '8px 14px', borderRadius: 10, background: 'rgba(201,147,59,0.08)', color: '#C9933B', fontWeight: 700, fontSize: 12, border: '1.5px solid rgba(201,147,59,0.2)', cursor: 'pointer', fontFamily: 'Montserrat', display: 'flex', alignItems: 'center', gap: 5 }}>
                      <ClipboardList size={12} /> Оценки
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
