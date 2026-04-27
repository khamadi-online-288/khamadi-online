import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import { Users, Activity, AlertTriangle, Award } from 'lucide-react'
import StatCard from '@/components/english/lms/shared/StatCard'

export default async function CuratorDashboardPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  const today = new Date().toISOString().split('T')[0]

  const [studCount, activeToday, certCount] = await Promise.all([
    supabase.from('english_user_roles').select('id', { count: 'exact', head: true }).eq('role', 'student'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }).gte('last_seen_at', today),
    supabase.from('lms_certificates').select('id', { count: 'exact', head: true }),
  ])

  const { data: allStudents } = await supabase.from('english_user_roles').select('user_id').eq('role', 'student')
  const ids = ((allStudents ?? []) as { user_id: string }[]).map(r => r.user_id)
  const { count: atRiskCount } = ids.length
    ? await supabase.from('profiles').select('id', { count: 'exact', head: true }).in('id', ids).or(`last_seen_at.is.null,last_seen_at.lt.${twoWeeksAgo}`)
    : { count: 0 }

  const { data: recentActivity } = await supabase
    .from('lms_activity_log')
    .select('id,action,created_at,user_id,student:profiles(full_name)')
    .order('created_at', { ascending: false })
    .limit(20)

  return (
    <div style={{ flex: 1 }}>
      <div style={{ background: '#fff', borderBottom: '1px solid rgba(27,143,196,0.1)', padding: '18px 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 20, fontWeight: 900, color: '#1B3A6B' }}>Кабинет куратора</div>
        <div style={{ fontSize: 13, color: '#64748b' }}>{new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
      </div>
      <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16 }}>
          <StatCard title="Студентов" value={studCount.count ?? 0} icon={<Users size={18} />} color="#1B8FC4" />
          <StatCard title="Активны сегодня" value={activeToday.count ?? 0} icon={<Activity size={18} />} color="#10b981" />
          <StatCard title="Группа риска" value={atRiskCount ?? 0} icon={<AlertTriangle size={18} />} color="#ef4444" />
          <StatCard title="Сертификатов" value={certCount.count ?? 0} icon={<Award size={18} />} color="#C9933B" />
        </div>

        {(atRiskCount ?? 0) > 0 && (
          <div style={{ background: '#fff7ed', borderRadius: 16, padding: '16px 20px', border: '1.5px solid rgba(239,68,68,0.25)', display: 'flex', gap: 14, alignItems: 'center' }}>
            <AlertTriangle size={20} color="#ef4444" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: '#dc2626' }}>{atRiskCount} студентов без активности более 14 дней</div>
              <div style={{ fontSize: 12, color: '#64748b' }}>Рекомендуется связаться с этими студентами</div>
            </div>
          </div>
        )}

        <div style={{ background: '#fff', borderRadius: 20, padding: 24, border: '1px solid rgba(27,143,196,0.1)' }}>
          <div style={{ fontSize: 15, fontWeight: 900, color: '#1B3A6B', marginBottom: 16 }}>Последняя активность</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            {((recentActivity ?? []) as unknown[]).map((a: unknown) => {
              const row = a as { id: string; action: string; created_at: string; student?: { full_name?: string } }
              return (
                <div key={row.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 12px', borderRadius: 9, background: '#f8fafc' }}>
                  <div>
                    <span style={{ fontSize: 12, fontWeight: 700, color: '#334155' }}>{row.student?.full_name ?? '—'}</span>
                    <span style={{ fontSize: 12, color: '#64748b', marginLeft: 8 }}>{row.action}</span>
                  </div>
                  <span style={{ fontSize: 11, color: '#94a3b8' }}>{new Date(row.created_at).toLocaleString('ru-RU', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )
            })}
            {!recentActivity?.length && <div style={{ color: '#94a3b8', fontSize: 13 }}>Нет активности</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
