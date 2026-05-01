import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import EnglishShell from '@/components/english/dashboard/EnglishShell'
import type { UserRole, CefrLevel } from '@/types/english/database'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createEnglishServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/english/login')

  const { data: profile } = await supabase
    .from('english_user_roles')
    .select('full_name, role, current_level')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/english/register')

  const role     = (profile?.role          ?? 'student') as UserRole
  const level    = (profile?.current_level ?? '')        as CefrLevel | ''
  const fullName =  profile?.full_name     ?? ''

  return (
    <EnglishShell role={role} userName={fullName} level={level}>
      {children}
    </EnglishShell>
  )
}
