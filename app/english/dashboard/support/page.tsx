import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import SupportClient from './SupportClient'

export default async function SupportPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  const user = session?.user
  if (!user) redirect('/english/login')

  const { data: profile } = await supabase
    .from('english_user_roles')
    .select('full_name')
    .eq('user_id', user.id)
    .maybeSingle()

  return (
    <SupportClient
      userId={user.id}
      userEmail={user.email ?? ''}
      userName={(profile as { full_name: string | null } | null)?.full_name ?? ''}
    />
  )
}
