import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import EnglishShell from '@/components/english/dashboard/EnglishShell'
import type { UserRole, CefrLevel } from '@/types/english/database'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
      const user = session?.user
  if (!user) redirect('/english/login')

  const { data: profile } = await supabase
    .from('english_user_roles')
    .select('full_name, role, current_level, status')
    .eq('user_id', user.id)
    .maybeSingle()

  if (!profile) redirect('/english/register')

  const status = (profile as { status?: string } | null)?.status
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
