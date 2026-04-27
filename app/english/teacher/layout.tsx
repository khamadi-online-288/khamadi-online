import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import TeacherSidebar from '@/components/english/lms/teacher/TeacherSidebar'

export default async function EnglishTeacherLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: roleRow } = await supabase
    .from('english_user_roles')
    .select('role, status')
    .eq('user_id', session.user.id)
    .maybeSingle()

  const r      = (roleRow as { role: string; status?: string } | null)?.role
  const status = (roleRow as { role: string; status?: string } | null)?.status

  if (r !== 'teacher' && r !== 'admin') redirect('/english/dashboard')
  if (status === 'pending')  redirect('/english/pending')
  if (status === 'rejected') redirect('/english/rejected')

  supabase.from('profiles').update({ last_seen_at: new Date().toISOString() }).eq('id', session.user.id)

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F9FD', fontFamily: 'Montserrat, sans-serif' }}>
      <TeacherSidebar />
      <div style={{ marginLeft: 260, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
