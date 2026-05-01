import { redirect } from 'next/navigation'
import { createEnglishServerClient } from '@/lib/english/supabase-server'
import ProfileClient from './ProfileClient'
import type { DashboardData } from '@/types/english/database'

type ProgressRow = { updated_at: string | null }

function calcStreak(rows: ProgressRow[]): number {
  const days   = new Set(rows.filter(r => r.updated_at).map(r => new Date(r.updated_at!).toISOString().split('T')[0]))
  const sorted = Array.from(days).sort((a, b) => b.localeCompare(a))
  if (!sorted.length) return 0

  const today     = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]
  if (sorted[0] !== today && sorted[0] !== yesterday) return 0

  let streak = 1
  for (let i = 1; i < sorted.length; i++) {
    const diff = (new Date(sorted[i - 1]).getTime() - new Date(sorted[i]).getTime()) / 86400000
    if (diff === 1) streak++
    else break
  }
  return streak
}

export default async function ProfilePage() {
  const supabase = await createEnglishServerClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/english/login')

  const [profileRes, dashRes, progressRes, coursesRes] = await Promise.all([
    supabase
      .from('english_user_roles')
      .select('full_name, current_level, student_id, created_at, purpose')
      .eq('user_id', user.id)
      .maybeSingle(),

    supabase.rpc('get_english_dashboard'),

    supabase
      .from('english_progress')
      .select('updated_at')
      .eq('user_id', user.id)
      .eq('completed', true)
      .limit(500),

    supabase
      .from('english_courses')
      .select('id', { count: 'exact', head: true })
      .eq('is_active', true),
  ])

  const p = profileRes.data as { full_name: string | null; current_level: string | null; student_id: string | null; created_at: string; purpose: string | null } | null
  if (!p) redirect('/english/register')

  const dashData    = dashRes.data as DashboardData | null
  const defaultStats = { enrolled_courses: 0, completed_lessons: 0, avg_score: 0, certificates: 0 }
  const stats       = dashData?.stats ?? defaultStats

  const streak      = calcStreak((progressRes.data ?? []) as ProgressRow[])
  const totalCourses = coursesRes.count ?? 0

  return (
    <ProfileClient
      profile={{
        full_name:     p.full_name,
        email:         user.email ?? '',
        current_level: p.current_level,
        student_id:    p.student_id,
        purpose:       p.purpose,
        created_at:    p.created_at,
      }}
      stats={stats}
      streak={streak}
      totalCourses={totalCourses}
    />
  )
}
