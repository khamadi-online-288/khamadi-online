import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import SupportSidebar from '@/components/english/support/SupportSidebar'

export default async function SupportAgentLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: roleRow } = await supabase
    .from('english_user_roles')
    .select('role, full_name')
    .eq('user_id', session.user.id)
    .maybeSingle()

  const role = (roleRow as { role: string; full_name: string | null } | null)?.role ?? ''
  if (!['admin', 'support'].includes(role)) redirect('/english/dashboard')

  const fullName = (roleRow as { role: string; full_name: string | null } | null)?.full_name ?? ''

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0F1923', fontFamily: 'Montserrat, sans-serif' }}>
      <SupportSidebar role={role} fullName={fullName} />
      <div style={{ marginLeft: 280, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        {children}
      </div>
    </div>
  )
}
