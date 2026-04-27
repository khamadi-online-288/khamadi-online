import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import AdminHeader from '@/components/english/lms/admin/AdminHeader'
import StatCard from '@/components/english/lms/shared/StatCard'
import AdminDashboardClient from './DashboardClient'
import { Users, BookOpen, Award, ClipboardList, Activity } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const today = new Date().toISOString().split('T')[0]
  const monthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()

  const [studCount, teachCount, certCount, pendingCount] = await Promise.all([
    supabase.from('english_user_roles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('english_user_roles').select('id', { count: 'exact', head: true }).eq('role', 'teacher'),
    supabase.from('lms_certificates').select('id', { count: 'exact', head: true }),
    supabase.from('lms_assignment_submissions').select('id', { count: 'exact', head: true }).eq('status', 'submitted'),
  ])

  const { count: activeToday } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('last_seen_at', today)
  const { count: lessonsThisMonth } = await supabase.from('lms_progress').select('id', { count: 'exact', head: true }).eq('status', 'completed').gte('completed_at', monthAgo)

  const { data: allGrades } = await supabase.from('lms_grades').select('score,max_score').limit(500)
  const scored = (allGrades ?? []).filter(g => g.score != null)
  const avgScore = scored.length ? Math.round(scored.reduce((s, g) => s + ((g.score / g.max_score) * 100), 0) / scored.length) : 0

  const { data: allStudents } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
  const studentIds = (allStudents ?? []).map(x => (x as { user_id: string }).user_id)

  const { count: atRiskCount } = studentIds.length
    ? await supabase.from('profiles').select('id', { count: 'exact', head: true }).in('id', studentIds).or(`last_seen_at.is.null,last_seen_at.lt.${twoWeeksAgo}`)
    : { count: 0 }

  const { data: recentUsers } = await supabase.from('profiles').select('id,full_name,created_at').order('created_at', { ascending: false }).limit(10)
  const { data: recentCerts } = await supabase.from('lms_certificates').select('id,issued_at,final_score,student:profiles(full_name),course:english_courses(title)').order('issued_at', { ascending: false }).limit(5)
  const { data: actLog } = await supabase.from('lms_activity_log').select('created_at').gte('created_at', monthAgo).limit(500)

  const { data: levels } = studentIds.length ? await supabase.from('profiles').select('language_level').in('id', studentIds).not('language_level', 'is', null) : { data: [] }
  const levelMap: Record<string, number> = {}
  ;(levels ?? []).forEach(l => { const lv = (l as { language_level: string }).language_level; levelMap[lv] = (levelMap[lv] ?? 0) + 1 })

  return (
    <div style={{ flex: 1 }}>
      <AdminHeader title="Главная" />
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr) repeat(3,1fr)', gap: 16 }}>
          <StatCard title="Студентов" value={studCount.count ?? 0} icon={<Users size={18} />} color="#1B8FC4" />
          <StatCard title="Преподавателей" value={teachCount.count ?? 0} icon={<Users size={18} />} color="#C9933B" />
          <StatCard title="Активны сегодня" value={activeToday ?? 0} icon={<Activity size={18} />} color="#10b981" />
          <StatCard title="Уроков в месяц" value={lessonsThisMonth ?? 0} icon={<BookOpen size={18} />} color="#8b5cf6" />
          <StatCard title="Сертификатов" value={certCount.count ?? 0} icon={<Award size={18} />} color="#C9933B" />
          <StatCard title="На проверке" value={pendingCount.count ?? 0} icon={<ClipboardList size={18} />} color="#ef4444" subtitle="заданий" />
        </div>
        <AdminDashboardClient
          atRiskCount={atRiskCount ?? 0}
          avgScore={avgScore}
          activityLog={(actLog ?? []) as Record<string, unknown>[]}
          recentUsers={(recentUsers ?? []) as Record<string, unknown>[]}
          recentCerts={(recentCerts ?? []) as Record<string, unknown>[]}
          levelDistribution={levelMap}
        />
      </div>
    </div>
  )
}
