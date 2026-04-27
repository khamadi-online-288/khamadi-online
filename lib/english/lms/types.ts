// =============================================
// English LMS — Shared TypeScript types
// =============================================

export type EnglishLMSRole = 'student' | 'teacher' | 'admin' | 'curator'

export interface EnglishProfile {
  id: string
  email?: string
  full_name?: string | null
  phone?: string | null
  avatar_url?: string | null
  department?: string | null
  student_id_number?: string | null
  role?: EnglishLMSRole
  is_active?: boolean
  last_seen_at?: string | null
  language_level?: string | null
  created_at?: string
}

export interface LMSGroup {
  id: string
  name: string
  description?: string | null
  teacher_id?: string | null
  academic_year?: string | null
  department?: string | null
  created_at: string
  teacher?: EnglishProfile
  student_count?: number
  avg_progress?: number
}

export interface LMSGroupStudent {
  id: string
  group_id: string
  student_id: string
  enrolled_at: string
  student?: EnglishProfile
}

export interface LMSProgress {
  id: string
  student_id: string
  course_id?: string | null
  module_id?: string | null
  lesson_id?: string | null
  section_type?: string | null
  status: 'not_started' | 'in_progress' | 'completed'
  score?: number | null
  attempts: number
  time_spent_seconds: number
  started_at?: string | null
  completed_at?: string | null
  created_at: string
}

export interface LMSAssignment {
  id: string
  title: string
  description?: string | null
  teacher_id?: string | null
  group_id?: string | null
  course_id?: string | null
  type?: 'essay' | 'quiz' | 'speaking' | 'reading' | 'project' | null
  due_date?: string | null
  max_score: number
  instructions?: string | null
  attachment_url?: string | null
  created_at: string
  group?: Pick<LMSGroup, 'id' | 'name'>
  submission_count?: number
  graded_count?: number
}

export interface LMSSubmission {
  id: string
  assignment_id: string
  student_id: string
  content?: string | null
  attachment_url?: string | null
  score?: number | null
  feedback?: string | null
  status: 'submitted' | 'reviewed' | 'graded' | 'returned'
  submitted_at: string
  graded_at?: string | null
  graded_by?: string | null
  student?: EnglishProfile
  assignment?: Pick<LMSAssignment, 'id' | 'title' | 'max_score'>
}

export interface LMSGrade {
  id: string
  student_id: string
  teacher_id?: string | null
  group_id?: string | null
  course_id?: string | null
  grade_type?: 'quiz' | 'assignment' | 'midterm' | 'final' | 'attendance' | null
  score?: number | null
  max_score: number
  comment?: string | null
  graded_at: string
  student?: EnglishProfile
}

export interface LMSAttendance {
  id: string
  student_id: string
  group_id: string
  teacher_id?: string | null
  date: string
  status: 'present' | 'absent' | 'late' | 'excused'
  note?: string | null
  created_at: string
  student?: EnglishProfile
}

export interface LMSScheduleEvent {
  id: string
  group_id?: string | null
  teacher_id?: string | null
  title: string
  description?: string | null
  start_time: string
  end_time: string
  type?: 'lesson' | 'exam' | 'consultation' | 'event' | null
  location?: string | null
  meeting_url?: string | null
  created_at: string
  group?: Pick<LMSGroup, 'id' | 'name'>
}

export interface LMSConversation {
  id: string
  type?: 'direct' | 'group' | null
  group_id?: string | null
  title?: string | null
  created_at: string
  last_message?: LMSMessage
  unread_count?: number
  members?: EnglishProfile[]
}

export interface LMSMessage {
  id: string
  conversation_id: string
  sender_id: string
  content: string
  attachment_url?: string | null
  is_read: boolean
  created_at: string
  sender?: EnglishProfile
}

export interface LMSAnnouncement {
  id: string
  author_id: string
  title: string
  body: string
  target?: 'all' | 'students' | 'teachers' | 'group' | null
  group_id?: string | null
  is_pinned: boolean
  created_at: string
  author?: EnglishProfile
}

export interface LMSCertificate {
  id: string
  student_id: string
  course_id?: string | null
  certificate_number?: string | null
  issued_at: string
  final_score?: number | null
  pdf_url?: string | null
  student?: EnglishProfile
  course?: { id: string; title: string; level: string }
}

export interface LMSNotification {
  id: string
  user_id: string
  type?: string | null
  title?: string | null
  body?: string | null
  link?: string | null
  is_read: boolean
  created_at: string
}

export interface LMSCourseAssignment {
  id: string
  course_id: string
  group_id: string
  teacher_id?: string | null
  assigned_at: string
  deadline?: string | null
  is_mandatory: boolean
  course?: { id: string; title: string; level: string }
}
