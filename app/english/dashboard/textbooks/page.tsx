import { createEnglishServerClient } from '@/lib/english/supabase-server'
import TextbooksClient from './TextbooksClient'
import { redirect } from 'next/navigation'

export const dynamic = 'force-dynamic'

export default async function TextbooksPage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: textbooks } = await supabase
    .from('english_textbooks')
    .select('*')
    .eq('book_type', 'student')
    .order('level', { ascending: true })

  const { data: profile } = await supabase
    .from('english_user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .maybeSingle()

  return (
    <TextbooksClient
      textbooks={textbooks ?? []}
      isTeacher={profile?.role === 'teacher' || profile?.role === 'admin'}
    />
  )
}
