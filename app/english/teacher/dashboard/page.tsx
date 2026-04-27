import { redirect } from 'next/navigation'

// The main teacher dashboard is at /english/teacher
export default function TeacherDashboardRedirect() {
  redirect('/english/teacher')
}
