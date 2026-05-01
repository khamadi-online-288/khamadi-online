import { createEnglishServerClient } from '@/lib/english/supabase-server'
import { redirect } from 'next/navigation'
import TeacherTextbooksClient from './TeacherTextbooksClient'

export const dynamic = 'force-dynamic'

export default async function TeacherTextbooksPage() {
  const supabase = await createEnglishServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/english/login')

  const { data: profile } = await supabase
    .from('english_user_roles')
    .select('role')
    .eq('user_id', session.user.id)
    .maybeSingle()

  if (profile?.role !== 'teacher' && profile?.role !== 'admin') {
    redirect('/english/dashboard')
  }

  const { data: guides } = await supabase
    .from('english_textbooks')
    .select('*')
    .eq('book_type', 'teacher')
    .order('title', { ascending: true })

  const { data: studentBooks } = await supabase
    .from('english_textbooks')
    .select('*')
    .eq('book_type', 'student')
    .order('level', { ascending: true })

  return (
    <TeacherTextbooksClient
      guides={guides ?? []}
      studentBooks={studentBooks ?? []}
    />
  )
}
