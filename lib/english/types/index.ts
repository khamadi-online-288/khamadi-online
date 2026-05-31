// ── Course ────────────────────────────────────────────────────
export type CEFRLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
export type LessonType = 'reading' | 'listening' | 'grammar' | 'writing' | 'vocabulary' | 'test'
export type ContentStatus = 'draft' | 'published'

export interface EnglishLevel {
  id: string
  code: CEFRLevel
  name: string
  order_num: number
  total_lessons: number
  total_hours: number
  total_words: number
  description?: string
}

export interface EnglishModule {
  id: string
  level_id: string
  level_code?: CEFRLevel
  order_num: number
  title?: string
  description?: string
  grammar_focus?: string
  vocab_count: number
  duration_hours?: number
  status: ContentStatus
  created_at: string
  // UI helpers
  progress?: number
  lessonsCompleted?: number
  isLocked?: boolean
}

export interface EnglishLesson {
  id: string
  module_id: string
  order_num: number
  type: LessonType
  title?: string
  content?: Record<string, unknown> | null
  audio_url?: string | null
  duration_min: number
  xp_reward: number
  status: ContentStatus
  created_at: string
  score?: number | null
  completed?: boolean
}

// ── Users ─────────────────────────────────────────────────────
export type UserRole = 'student' | 'teacher' | 'admin'
export type TenantCode = 'khamadi' | 'zku'

export interface EnglishUserProfile {
  user_id: string
  tenant_id: string
  role: UserRole
  full_name: string
  email?: string
  current_level: CEFRLevel
  total_xp: number
  current_streak: number
  longest_streak: number
  last_active_at: string
  created_at: string
}

export interface EnglishGroup {
  id: string
  tenant_id: string
  teacher_id: string
  name: string
  join_code: string
  level_code: CEFRLevel
  students_count?: number
  avg_progress?: number
  created_at: string
}

export interface StudentInGroup {
  id: string
  full_name: string
  email?: string
  current_level: CEFRLevel
  total_xp: number
  current_streak: number
  progress?: number
  last_active_at: string
  status: 'active' | 'at_risk'
}

export interface SkillsProgress {
  reading: number
  listening: number
  grammar: number
  writing: number
  speaking: number
}

// ── Questions ─────────────────────────────────────────────────
export type QuestionType = 'multiple_choice' | 'fill_blank' | 'true_false'

export interface EnglishQuestion {
  id: string
  lesson_id: string
  order_num: number
  type: QuestionType
  question_text: string
  options?: string[]
  correct_answer: string
  explanation_ru?: string
  xp_value: number
}

// ── Vocabulary ────────────────────────────────────────────────
export interface VocabWord {
  id: string
  word_en: string
  phonetic?: string
  translation_ru: string
  translation_kz?: string
  level_code?: CEFRLevel
  module_id?: string
  example_sentence?: string
  part_of_speech?: string
}

export interface UserVocabEntry {
  id: string
  user_id: string
  word_id: string
  word?: VocabWord
  added_at: string
  mastery_level: number
  ease_factor: number
  interval_days: number
  next_review_at?: string
  review_count: number
}

// ── Assignments ───────────────────────────────────────────────
export interface EnglishAssignment {
  id: string
  teacher_id: string
  group_id: string
  lesson_id?: string
  module_id?: string
  title: string
  deadline_at?: string
  min_score: number
  created_at: string
  lesson_title?: string
  group_name?: string
  submissions_count?: number
  students_count?: number
}
