export type UserRole  = 'student' | 'teacher' | 'admin'
export type CefrLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2'
export type CourseLevel    = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2' | 'B1-C1' | 'A2-B1'
export type CourseCategory = 'General English' | 'English for Special Purposes'
export type TicketStatus   = 'open' | 'in_progress' | 'resolved'
export type QuizAnswer     = 'A' | 'B' | 'C' | 'D'

export interface EnglishCourse {
  id: string
  title: string
  level: CourseLevel
  category: CourseCategory
  description: string | null
  is_active: boolean
  total_hours: number | null
  order_index: number | null
  cover_url: string | null
  created_at?: string
}

export interface VocabItem {
  en: string
  ru: string
}

export interface EnglishLesson {
  id: string
  course_id: string
  title: string
  lesson_order: number
  reading_text: string | null
  writing_task: string | null
  listening_url: string | null
  listening_transcript: string | null
  vocabulary: VocabItem[] | null
  duration_min: number | null
  is_published: boolean
  created_at?: string
}

export interface EnglishProgress {
  id: string
  user_id: string
  lesson_id: string
  completed: boolean
  score: number | null
  attempts: number
  time_spent: number
  completed_at: string | null
  updated_at: string | null
}

export interface EnglishQuizQuestion {
  id: string
  lesson_id: string
  question: string
  option_a: string
  option_b: string
  option_c: string
  option_d: string
  correct_answer: QuizAnswer
}

export interface EnglishUserRole {
  id: string
  user_id: string
  role: UserRole
  full_name: string | null
  current_level: CefrLevel | null
  university_id: string | null
  student_id: string | null
  created_at: string
}

export interface EnglishCertificate {
  id: string
  user_id: string
  course_id: string
  certificate_number: string
  issued_at: string
}

export interface EnglishNotification {
  id: string
  user_id: string
  title: string
  message: string
  is_read: boolean
  created_at: string
}

export interface EnglishSupportTicket {
  id: string
  user_id: string
  subject: string
  message: string
  status: TicketStatus
  created_at: string
}

export interface EnglishStudySession {
  id: string
  user_id: string
  lesson_id: string | null
  started_at: string
  ended_at: string | null
  duration_minutes: number | null
}

export interface EnglishTextbook {
  id: string
  course_id: string | null
  title: string
  description: string | null
  file_url: string | null
  level: string | null
}

export interface ActiveCourse {
  id: string
  title: string
  level: CourseLevel
  progress_percent: number
  completed_lessons: number
  total_lessons: number
  last_lesson_title: string | null
}

export interface DashboardStats {
  enrolled_courses: number
  completed_lessons: number
  avg_score: number
  certificates: number
}

export interface DashboardData {
  profile: {
    full_name: string
    current_level: CefrLevel
    role: UserRole
  }
  stats: DashboardStats
  active_courses: ActiveCourse[]
  recent_notifications: EnglishNotification[]
}
