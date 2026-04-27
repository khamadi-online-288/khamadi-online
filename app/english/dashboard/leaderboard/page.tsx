import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = await createEnglishServerClient()
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const [allTime, weekly, monthly] = await Promise.all([
    supabase.from('english_user_xp')
      .select('user_id,total_xp,streak_days,profiles(full_name,avatar_url,language_level)')
      .order('total_xp', { ascending: false }).limit(50),
    supabase.from('english_user_xp')
      .select('user_id,weekly_xp,profiles(full_name,avatar_url,language_level)')
      .order('weekly_xp', { ascending: false }).limit(50),
    supabase.from('english_user_xp')
      .select('user_id,monthly_xp,profiles(full_name,avatar_url,language_level)')
      .order('monthly_xp', { ascending: false }).limit(50),
  ])

  return (
    <LeaderboardClient
      allTime={(allTime.data ?? []) as Record<string, unknown>[]}
      weekly={(weekly.data ?? []) as Record<string, unknown>[]}
      monthly={(monthly.data ?? []) as Record<string, unknown>[]}
      currentUserId={session.user.id}
    />
  )
}
