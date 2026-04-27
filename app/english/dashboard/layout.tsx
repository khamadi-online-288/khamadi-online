import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import EnglishShell from '@/components/english/dashboard/EnglishShell'
import type { UserRole, CefrLevel } from '@/types/english/database'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  const [roleRes, statusRes] = await Promise.all([
    supabase.from('english_user_roles').select('full_name, role, current_level').eq('user_id', user.id).maybeSingle(),
    supabase.from('profiles').select('status').eq('id', user.id).maybeSingle(),
  ])

  const profile = roleRes.data
  if (!profile) redirect('/english/register')

  const status = (statusRes.data as { status?: string } | null)?.status
  if (status === 'pending')  redirect('/english/pending')
  if (status === 'rejected') redirect('/english/rejected')

  const role     = (profile?.role          ?? 'student') as UserRole
  const level    = (profile?.current_level ?? '')        as CefrLevel | ''
  const fullName =  profile?.full_name     ?? ''

  return (
    <EnglishShell role={role} userName={fullName} level={level}>
      {children}
    </EnglishShell>
  )
}
