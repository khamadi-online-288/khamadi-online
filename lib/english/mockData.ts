import type {
  EnglishUserProfile, StudentInGroup, EnglishGroup, SkillsProgress,
  EnglishLevel, EnglishModule, EnglishLesson,
  VocabWord, UserVocabEntry, EnglishAssignment, EnglishQuestion,
} from './types'

// ── Users ────────────────────────────────────────────────────
export const MOCK_USER: EnglishUserProfile = {
  user_id: 'user-mock-1',
  tenant_id: 'tenant-khamadi',
  role: 'student',
  full_name: 'Данияр Ерланұлы',
  email: 'daniyar@example.com',
  current_level: 'A1',
  total_xp: 2340,
  current_streak: 7,
  longest_streak: 14,
  last_active_at: new Date().toISOString(),
  created_at: '2026-01-10T10:00:00Z',
}

export const MOCK_TEACHER: EnglishUserProfile = {
  user_id: 'teacher-mock-1',
  tenant_id: 'tenant-zku',
  role: 'teacher',
  full_name: 'Айгерим Касымовна',
  email: 'aigerim@zku.kz',
  current_level: 'C1',
  total_xp: 18500,
  current_streak: 32,
  longest_streak: 60,
  last_active_at: new Date().toISOString(),
  created_at: '2025-09-01T08:00:00Z',
}

// ── Levels ────────────────────────────────────────────────────
export const MOCK_LEVELS: (EnglishLevel & { progress: number; modulesCompleted: number; totalModules: number; isLocked: boolean })[] = [
  { id: 'l-a1',  code: 'A1',   name: 'Beginner',           order_num: 1, total_lessons: 80,  total_hours: 30,  total_words: 800,  progress: 62, modulesCompleted: 3,  totalModules: 16, isLocked: false },
  { id: 'l-a11', code: 'A1.1', name: 'Elementary',          order_num: 2, total_lessons: 128, total_hours: 130, total_words: 900,  progress: 0,  modulesCompleted: 0,  totalModules: 18, isLocked: false },
  { id: 'l-a2',  code: 'A2',   name: 'Pre-Intermediate',   order_num: 3, total_lessons: 168, total_hours: 220, total_words: 1500, progress: 0,  modulesCompleted: 0,  totalModules: 24, isLocked: false },
  { id: 'l-b1',  code: 'B1',   name: 'Intermediate',       order_num: 4, total_lessons: 208, total_hours: 260, total_words: 1820, progress: 0,  modulesCompleted: 0,  totalModules: 26, isLocked: false },
  { id: 'l-b2',  code: 'B2',   name: 'Upper-Intermediate', order_num: 5, total_lessons: 228, total_hours: 260, total_words: 2000, progress: 0,  modulesCompleted: 0,  totalModules: 26, isLocked: true },
  { id: 'l-c1',  code: 'C1',   name: 'Advanced',           order_num: 6, total_lessons: 282, total_hours: 370, total_words: 2800, progress: 0,  modulesCompleted: 0,  totalModules: 32, isLocked: true },
]

// ── Modules ────────────────────────────────────────────────────
interface ModuleSection { reading: number; listening: number; grammar: number; writing: number; vocabulary?: number; test: number }
type MockModule = EnglishModule & { progress: number; lessonsCompleted: number; isLocked: boolean; sections: ModuleSection; xp_total: number }

export const MOCK_A1_MODULES: MockModule[] = [
  { id: 'm-1',  level_id: 'l-a1', level_code: 'A1', order_num: 1,  title: 'Hello, world!',       grammar_focus: 'Articles, am/is/are',    vocab_count: 30, status: 'published', created_at: '', progress: 100, lessonsCompleted: 7, isLocked: false, xp_total: 350, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, test: 1 } },
  { id: 'm-2',  level_id: 'l-a1', level_code: 'A1', order_num: 2,  title: 'My family',           grammar_focus: 'have/has, possessive',   vocab_count: 32, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 350, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, test: 1 } },
  { id: 'm-3',  level_id: 'l-a1', level_code: 'A1', order_num: 3,  title: 'My things',           grammar_focus: 'this/that/these/those',  vocab_count: 28, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 1, listening: 1, grammar: 1, writing: 1, test: 1 } },
  { id: 'm-4',  level_id: 'l-a1', level_code: 'A1', order_num: 4,  title: 'My day',              grammar_focus: 'Present Simple',         vocab_count: 35, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-5',  level_id: 'l-a1', level_code: 'A1', order_num: 5,  title: "I can / I can't",     grammar_focus: "can/can't",              vocab_count: 30, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 1, listening: 2, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-6',  level_id: 'l-a1', level_code: 'A1', order_num: 6,  title: 'My hobbies',          grammar_focus: 'Present Simple he/she',  vocab_count: 28, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 2, listening: 1, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-7',  level_id: 'l-a1', level_code: 'A1', order_num: 7,  title: 'Food and drinks',     grammar_focus: 'some/any',               vocab_count: 36, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-8',  level_id: 'l-a1', level_code: 'A1', order_num: 8,  title: 'My home',             grammar_focus: 'there is/are',           vocab_count: 30, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 350, sections: { reading: 1, listening: 1, grammar: 1, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-9',  level_id: 'l-a1', level_code: 'A1', order_num: 9,  title: 'Right now',           grammar_focus: 'Present Continuous',     vocab_count: 25, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 480, sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-10', level_id: 'l-a1', level_code: 'A1', order_num: 10, title: 'Yesterday',           grammar_focus: 'Past Simple was/were',   vocab_count: 28, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 495, sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-11', level_id: 'l-a1', level_code: 'A1', order_num: 11, title: 'Last weekend',        grammar_focus: 'Past Simple regular + irregular', vocab_count: 30, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 575, sections: { reading: 1, listening: 1, grammar: 3, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-12', level_id: 'l-a1', level_code: 'A1', order_num: 12, title: 'Travel and places',   grammar_focus: 'prepositions',           vocab_count: 32, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 525, sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-13', level_id: 'l-a1', level_code: 'A1', order_num: 13, title: 'Numbers and money',   grammar_focus: 'numbers up to 1000',     vocab_count: 24, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 510, sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-14', level_id: 'l-a1', level_code: 'A1', order_num: 14, title: 'Weather and clothes', grammar_focus: 'adjectives',             vocab_count: 34, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 530, sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-15', level_id: 'l-a1', level_code: 'A1', order_num: 15, title: 'Future plans',        grammar_focus: 'going to',               vocab_count: 26, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 530, sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-16', level_id: 'l-a1', level_code: 'A1', order_num: 16, title: 'A1 Final Exam',         grammar_focus: 'ALL A1 topics',          vocab_count: 50, status: 'published', created_at: '', progress: 0,   lessonsCompleted: 0, isLocked: true,  xp_total: 1000, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, vocabulary: 0, test: 0 } },
]

// ── Lessons ────────────────────────────────────────────────────
export const MOCK_LESSONS_M1: EnglishLesson[] = [
  { id: 'l1-1',  module_id: 'm-1', order_num: 1, type: 'reading',    title: 'Meet new friends!',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: 95,  completed: true  },
  { id: 'l1-2',  module_id: 'm-1', order_num: 2, type: 'listening',  title: 'Online video call',        duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: 100, completed: true  },
  { id: 'l1-3',  module_id: 'm-1', order_num: 3, type: 'grammar',    title: 'am / is / are',            duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: 88,  completed: true  },
  { id: 'l1-g2', module_id: 'm-1', order_num: 4, type: 'grammar',    title: 'Articles: a / an / the',   duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l1-4',  module_id: 'm-1', order_num: 5, type: 'writing',    title: 'My profile',               duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: 92,  completed: true  },
  { id: 'l1-v',  module_id: 'm-1', order_num: 6, type: 'vocabulary', title: '30 words · Module 1',      duration_min: 12, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l1-5',  module_id: 'm-1', order_num: 7, type: 'test',       title: 'Module 1 Final Test',      duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M2: EnglishLesson[] = [
  { id: 'l2-1',  module_id: 'm-2', order_num: 1, type: 'reading',    title: 'My family photo',          duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-2',  module_id: 'm-2', order_num: 2, type: 'listening',  title: 'Family dinner talk',       duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-3',  module_id: 'm-2', order_num: 3, type: 'grammar',    title: 'have / has',               duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-g2', module_id: 'm-2', order_num: 4, type: 'grammar',    title: 'Possessive adjectives',    duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-4',  module_id: 'm-2', order_num: 5, type: 'writing',    title: 'About my family',          duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-v',  module_id: 'm-2', order_num: 6, type: 'vocabulary', title: '32 words · Module 2',      duration_min: 13, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l2-5',  module_id: 'm-2', order_num: 7, type: 'test',       title: 'Module 2 Final Test',      duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M3: EnglishLesson[] = [
  { id: 'l3-1',  module_id: 'm-3', order_num: 1, type: 'reading',    title: 'My room at ZKU',              duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l3-2',  module_id: 'm-3', order_num: 2, type: 'listening',  title: 'What\'s in your bag?',        duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l3-3',  module_id: 'm-3', order_num: 3, type: 'grammar',    title: 'this / that / these / those', duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l3-4',  module_id: 'm-3', order_num: 4, type: 'writing',    title: 'Describe your things',        duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l3-v',  module_id: 'm-3', order_num: 5, type: 'vocabulary', title: '28 words · Module 3',         duration_min: 11, xp_reward: 35,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l3-5',  module_id: 'm-3', order_num: 6, type: 'test',       title: 'Module 3 Final Test',         duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M4: EnglishLesson[] = [
  { id: 'l4-1', module_id: 'm-4', order_num: 1, type: 'reading',   title: 'A typical day',           duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: 90,   completed: true  },
  { id: 'l4-2', module_id: 'm-4', order_num: 2, type: 'listening', title: 'Morning routines',         duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: 85,   completed: true  },
  { id: 'l4-3', module_id: 'm-4', order_num: 3, type: 'grammar',    title: 'Present Simple sentences', duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l4-4', module_id: 'm-4', order_num: 4, type: 'writing',    title: 'My daily schedule',        duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l4-v', module_id: 'm-4', order_num: 5, type: 'vocabulary', title: '35 words · Module 4',      duration_min: 14, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l4-5', module_id: 'm-4', order_num: 6, type: 'test',       title: 'Module 4 Final Test',      duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M5: EnglishLesson[] = [
  { id: 'l5-1', module_id: 'm-5', order_num: 1, type: 'reading',    title: 'What can you do?',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-2', module_id: 'm-5', order_num: 2, type: 'listening',  title: 'Can you help me?',        duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-3', module_id: 'm-5', order_num: 3, type: 'listening',  title: 'Talents and skills',      duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-4', module_id: 'm-5', order_num: 4, type: 'grammar',    title: "can / can't",             duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-5', module_id: 'm-5', order_num: 5, type: 'writing',    title: 'My skills and abilities', duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-v', module_id: 'm-5', order_num: 6, type: 'vocabulary', title: '30 words · Module 5',     duration_min: 12, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l5-6', module_id: 'm-5', order_num: 7, type: 'test',       title: 'Module 5 Final Test',     duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M6: EnglishLesson[] = [
  { id: 'l6-1', module_id: 'm-6', order_num: 1, type: 'reading',    title: 'My favourite hobby',            duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-2', module_id: 'm-6', order_num: 2, type: 'reading',    title: 'Hobbies around ZKU',            duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-3', module_id: 'm-6', order_num: 3, type: 'listening',  title: 'What do you do in free time?',  duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-4', module_id: 'm-6', order_num: 4, type: 'grammar',    title: 'Present Simple: he / she',      duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-5', module_id: 'm-6', order_num: 5, type: 'writing',    title: 'My hobby profile',              duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-v', module_id: 'm-6', order_num: 6, type: 'vocabulary', title: '28 words · Module 6',           duration_min: 11, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l6-6', module_id: 'm-6', order_num: 7, type: 'test',       title: 'Module 6 Final Test',           duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M7: EnglishLesson[] = [
  { id: 'l7-1', module_id: 'm-7', order_num: 1, type: 'reading',    title: 'At the ZKU cafeteria',       duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-2', module_id: 'm-7', order_num: 2, type: 'listening',  title: 'What\'s for lunch today?',   duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-3', module_id: 'm-7', order_num: 3, type: 'grammar',    title: 'some / any',                 duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-4', module_id: 'm-7', order_num: 4, type: 'grammar',    title: 'How much / How many',        duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-5', module_id: 'm-7', order_num: 5, type: 'writing',    title: 'My food diary',              duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-v', module_id: 'm-7', order_num: 6, type: 'vocabulary', title: '36 words · Module 7',        duration_min: 14, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l7-6', module_id: 'm-7', order_num: 7, type: 'test',       title: 'Module 7 Final Test',        duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M8: EnglishLesson[] = [
  { id: 'l8-1', module_id: 'm-8', order_num: 1, type: 'reading',    title: 'My apartment in Uralsk',     duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-2', module_id: 'm-8', order_num: 2, type: 'listening',  title: 'Welcome to my place!',       duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-3', module_id: 'm-8', order_num: 3, type: 'grammar',    title: 'there is / there are',       duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-4', module_id: 'm-8', order_num: 4, type: 'writing',    title: 'Describe your home',         duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-5', module_id: 'm-8', order_num: 5, type: 'writing',    title: 'A letter to a friend',       duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-v', module_id: 'm-8', order_num: 6, type: 'vocabulary', title: '30 words · Module 8',        duration_min: 12, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l8-6', module_id: 'm-8', order_num: 7, type: 'test',       title: 'Module 8 Final Test',        duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M9: EnglishLesson[] = [
  { id: 'l9-1',  module_id: 'm-9', order_num: 1, type: 'reading',    title: 'A busy morning at ZKU',           duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-2',  module_id: 'm-9', order_num: 2, type: 'listening',  title: 'What are you doing?',              duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-3',  module_id: 'm-9', order_num: 3, type: 'listening',  title: 'Live from the ZKU café',           duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-4',  module_id: 'm-9', order_num: 4, type: 'grammar',    title: 'Present Continuous: Form',         duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-g2', module_id: 'm-9', order_num: 5, type: 'grammar',    title: 'Present Continuous: Use',          duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-5',  module_id: 'm-9', order_num: 6, type: 'writing',    title: 'What am I doing today?',           duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-v',  module_id: 'm-9', order_num: 7, type: 'vocabulary', title: '25 words · Module 9',              duration_min: 10, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l9-6',  module_id: 'm-9', order_num: 8, type: 'test',       title: 'Module 9 Final Test',              duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M10: EnglishLesson[] = [
  { id: 'l10-1',  module_id: 'm-10', order_num: 1, type: 'reading',    title: 'Yesterday was a great day',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-2',  module_id: 'm-10', order_num: 2, type: 'reading',    title: 'A difficult day',                   duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-3',  module_id: 'm-10', order_num: 3, type: 'listening',  title: 'Where were you yesterday?',         duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-4',  module_id: 'm-10', order_num: 4, type: 'grammar',    title: 'was / were: Affirmative',           duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-g2', module_id: 'm-10', order_num: 5, type: 'grammar',    title: 'was / were: Negative & Questions',  duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-5',  module_id: 'm-10', order_num: 6, type: 'writing',    title: 'Write about your yesterday',        duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-v',  module_id: 'm-10', order_num: 7, type: 'vocabulary', title: '28 words · Module 10',              duration_min: 11, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l10-6',  module_id: 'm-10', order_num: 8, type: 'test',       title: 'Module 10 Final Test',              duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M11: EnglishLesson[] = [
  { id: 'l11-1',  module_id: 'm-11', order_num: 1, type: 'reading',    title: 'My weekend in Uralsk',             duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-2',  module_id: 'm-11', order_num: 2, type: 'listening',  title: 'What did you do last weekend?',    duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-3',  module_id: 'm-11', order_num: 3, type: 'grammar',    title: 'Past Simple: regular verbs (-ed)', duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-g2', module_id: 'm-11', order_num: 4, type: 'grammar',    title: 'Past Simple: spelling & negatives',duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-g3', module_id: 'm-11', order_num: 5, type: 'grammar',    title: 'Past Simple: irregular verbs',     duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-4',  module_id: 'm-11', order_num: 6, type: 'writing',    title: 'Write about your last weekend',    duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-5',  module_id: 'm-11', order_num: 6, type: 'writing',    title: 'A weekend story',                  duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-v',  module_id: 'm-11', order_num: 7, type: 'vocabulary', title: '30 words · Module 11',             duration_min: 12, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l11-6',  module_id: 'm-11', order_num: 8, type: 'test',       title: 'Module 11 Final Test',             duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M16: EnglishLesson[] = [
  { id: 'l16-1', module_id: 'm-16', order_num: 1, type: 'test',      title: 'Part 1 — Reading & Use of English', duration_min: 90, xp_reward: 300, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l16-2', module_id: 'm-16', order_num: 2, type: 'listening', title: 'Part 2 — Listening',                  duration_min: 40, xp_reward: 250, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l16-3', module_id: 'm-16', order_num: 3, type: 'writing',   title: 'Part 3 — Writing',                    duration_min: 90, xp_reward: 200, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M15: EnglishLesson[] = [
  { id: 'l15-1',  module_id: 'm-15', order_num: 1, type: 'reading',    title: 'My plans after university',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-2',  module_id: 'm-15', order_num: 2, type: 'reading',    title: 'A letter about the future',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-3',  module_id: 'm-15', order_num: 3, type: 'listening',  title: 'What are you going to do?',        duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-4',  module_id: 'm-15', order_num: 4, type: 'listening',  title: 'Planning a trip together',         duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-5',  module_id: 'm-15', order_num: 5, type: 'grammar',    title: 'going to: plans & intentions',    duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-g2', module_id: 'm-15', order_num: 6, type: 'grammar',    title: 'will vs going to',                 duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-6',  module_id: 'm-15', order_num: 7, type: 'writing',    title: 'My plans for next year',           duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-v',  module_id: 'm-15', order_num: 8, type: 'vocabulary', title: '26 words · Module 15',             duration_min: 11, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l15-7',  module_id: 'm-15', order_num: 9, type: 'test',       title: 'Module 15 Final Test',             duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M14: EnglishLesson[] = [
  { id: 'l14-1',  module_id: 'm-14', order_num: 1, type: 'reading',    title: 'What\'s the weather like?',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-2',  module_id: 'm-14', order_num: 2, type: 'reading',    title: 'Getting dressed for the weather',  duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-3',  module_id: 'm-14', order_num: 3, type: 'listening',  title: 'What are you wearing today?',      duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-4',  module_id: 'm-14', order_num: 4, type: 'listening',  title: 'The weather forecast',             duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-5',  module_id: 'm-14', order_num: 5, type: 'grammar',    title: 'Adjectives: describing things',   duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-g2', module_id: 'm-14', order_num: 6, type: 'grammar',    title: 'Comparative adjectives',          duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-6',  module_id: 'm-14', order_num: 7, type: 'writing',    title: 'Describe your perfect outfit',    duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-v',  module_id: 'm-14', order_num: 8, type: 'vocabulary', title: '34 words · Module 14',            duration_min: 14, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l14-7',  module_id: 'm-14', order_num: 9, type: 'test',       title: 'Module 14 Final Test',            duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M13: EnglishLesson[] = [
  { id: 'l13-1',  module_id: 'm-13', order_num: 1, type: 'reading',    title: 'Shopping in the city',             duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-2',  module_id: 'm-13', order_num: 2, type: 'listening',  title: 'How much is it?',                  duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-3',  module_id: 'm-13', order_num: 3, type: 'listening',  title: 'At the bank',                      duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-4',  module_id: 'm-13', order_num: 4, type: 'grammar',    title: 'Numbers: 1 to 1000',               duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-g2', module_id: 'm-13', order_num: 5, type: 'grammar',    title: 'Prices and money expressions',     duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-5',  module_id: 'm-13', order_num: 6, type: 'writing',    title: 'My monthly budget',                duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-v',  module_id: 'm-13', order_num: 7, type: 'vocabulary', title: '24 words · Module 13',             duration_min: 10, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l13-6',  module_id: 'm-13', order_num: 8, type: 'test',       title: 'Module 13 Final Test',             duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M12: EnglishLesson[] = [
  { id: 'l12-1',  module_id: 'm-12', order_num: 1, type: 'reading',    title: 'A trip to Almaty',                 duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-2',  module_id: 'm-12', order_num: 2, type: 'reading',    title: 'Lost in the old city',             duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-3',  module_id: 'm-12', order_num: 3, type: 'listening',  title: 'At the airport',                   duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-4',  module_id: 'm-12', order_num: 4, type: 'listening',  title: 'How do I get there?',              duration_min: 10, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-5',  module_id: 'm-12', order_num: 5, type: 'grammar',    title: 'Prepositions of place',            duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-g2', module_id: 'm-12', order_num: 6, type: 'grammar',    title: 'Prepositions of movement & time',  duration_min: 15, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-6',  module_id: 'm-12', order_num: 7, type: 'writing',    title: 'My dream trip',                    duration_min: 20, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-v',  module_id: 'm-12', order_num: 8, type: 'vocabulary', title: '32 words · Module 12',             duration_min: 13, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l12-7',  module_id: 'm-12', order_num: 9, type: 'test',       title: 'Module 12 Final Test',             duration_min: 20, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

// ── A1.1 Elementary Modules ───────────────────────────────────
export const MOCK_A11_MODULES: MockModule[] = [
  { id: 'm-a11-1',  level_id: 'l-a11', level_code: 'A1.1', order_num: 1,  title: 'Abilities & Skills',         grammar_focus: 'can / could',                     vocab_count: 48, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 390,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-2',  level_id: 'l-a11', level_code: 'A1.1', order_num: 2,  title: 'Health & the Body',          grammar_focus: 'have got, have to',               vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 390,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-3',  level_id: 'l-a11', level_code: 'A1.1', order_num: 3,  title: 'Getting Around',             grammar_focus: 'imperatives, prepositions',       vocab_count: 48, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-4',  level_id: 'l-a11', level_code: 'A1.1', order_num: 4,  title: 'Food & Eating Out',          grammar_focus: 'countable/uncountable nouns',     vocab_count: 52, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-5',  level_id: 'l-a11', level_code: 'A1.1', order_num: 5,  title: 'Technology & Communication', grammar_focus: 'verb + infinitive',               vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-6',  level_id: 'l-a11', level_code: 'A1.1', order_num: 6,  title: 'The Natural World',          grammar_focus: 'superlatives',                    vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-7',  level_id: 'l-a11', level_code: 'A1.1', order_num: 7,  title: 'Stories from the Past',      grammar_focus: 'Past Simple narrative',           vocab_count: 52, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-8',  level_id: 'l-a11', level_code: 'A1.1', order_num: 8,  title: 'Traditions & Culture',       grammar_focus: 'used to',                         vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-9',  level_id: 'l-a11', level_code: 'A1.1', order_num: 9,  title: 'Have you ever…?',            grammar_focus: 'Present Perfect intro',           vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 450,  sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-10', level_id: 'l-a11', level_code: 'A1.1', order_num: 10, title: 'Advice & Rules',             grammar_focus: 'should / must / have to',         vocab_count: 48, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 420,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-11', level_id: 'l-a11', level_code: 'A1.1', order_num: 11, title: 'What if…?',                  grammar_focus: 'zero + first conditional',        vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 450,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, test: 1 } },
  { id: 'm-a11-12', level_id: 'l-a11', level_code: 'A1.1', order_num: 12, title: 'Feelings & Emotions',        grammar_focus: 'verb + -ing / to + inf',          vocab_count: 52, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 450,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, test: 1 } },
  { id: 'm-a11-13', level_id: 'l-a11', level_code: 'A1.1', order_num: 13, title: 'Sport & Activities',         grammar_focus: 'Present Perfect: for / since',    vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 480,  sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-14', level_id: 'l-a11', level_code: 'A1.1', order_num: 14, title: 'Jobs & Workplace',           grammar_focus: 'do / make / have / take',         vocab_count: 52, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 480,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-15', level_id: 'l-a11', level_code: 'A1.1', order_num: 15, title: 'The Environment',            grammar_focus: 'passive voice intro',             vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 480,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-16', level_id: 'l-a11', level_code: 'A1.1', order_num: 16, title: 'Shopping & Fashion',         grammar_focus: 'too / enough',                    vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 480,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-17', level_id: 'l-a11', level_code: 'A1.1', order_num: 17, title: 'Culture & Entertainment',    grammar_focus: 'relative clauses: who/which/that', vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 480,  sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a11-18', level_id: 'l-a11', level_code: 'A1.1', order_num: 18, title: 'A1.1 Final Exam',            grammar_focus: 'ALL A1.1 topics',                 vocab_count: 48, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: true,  xp_total: 1200, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, test: 0 } },
]

// ── A1.1 Lessons ─────────────────────────────────────────────
// duration_min: reading=55, listening=50, grammar=65, writing=80, vocabulary=40, test=65
export const MOCK_LESSONS_M_A11_1: EnglishLesson[] = [
  { id: 'l17-1',  module_id: 'm-a11-1', order_num: 1, type: 'reading',    title: 'What can you do?',                duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-2',  module_id: 'm-a11-1', order_num: 2, type: 'listening',  title: 'A talent show',                   duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-3',  module_id: 'm-a11-1', order_num: 3, type: 'grammar',    title: 'can / can\'t – ability',          duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-g2', module_id: 'm-a11-1', order_num: 4, type: 'grammar',    title: 'could / couldn\'t – past ability',duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-4',  module_id: 'm-a11-1', order_num: 5, type: 'writing',    title: 'My skills and goals',             duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-v',  module_id: 'm-a11-1', order_num: 6, type: 'vocabulary', title: '48 words · A1.1 Module 1',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l17-5',  module_id: 'm-a11-1', order_num: 7, type: 'test',       title: 'Module 1 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_2: EnglishLesson[] = [
  { id: 'l18-1',  module_id: 'm-a11-2', order_num: 1, type: 'reading',    title: 'A visit to the doctor',           duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-2',  module_id: 'm-a11-2', order_num: 2, type: 'listening',  title: 'At the clinic',                   duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-3',  module_id: 'm-a11-2', order_num: 3, type: 'grammar',    title: 'have got: body parts & symptoms', duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-g2', module_id: 'm-a11-2', order_num: 4, type: 'grammar',    title: 'have to / don\'t have to',        duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-4',  module_id: 'm-a11-2', order_num: 5, type: 'writing',    title: 'A letter to a sick friend',       duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-v',  module_id: 'm-a11-2', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 2',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l18-5',  module_id: 'm-a11-2', order_num: 7, type: 'test',       title: 'Module 2 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_3: EnglishLesson[] = [
  { id: 'l19-1',  module_id: 'm-a11-3', order_num: 1, type: 'reading',    title: 'Public transport in Kazakhstan',  duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-2',  module_id: 'm-a11-3', order_num: 2, type: 'reading',    title: 'How to get to the airport',       duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-3',  module_id: 'm-a11-3', order_num: 3, type: 'listening',  title: 'Asking for directions',           duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-4',  module_id: 'm-a11-3', order_num: 4, type: 'grammar',    title: 'Imperatives and directions',      duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-g2', module_id: 'm-a11-3', order_num: 5, type: 'grammar',    title: 'Transport vocab + prepositions',  duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-5',  module_id: 'm-a11-3', order_num: 6, type: 'writing',    title: 'Directions to my university',     duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-v',  module_id: 'm-a11-3', order_num: 7, type: 'vocabulary', title: '48 words · A1.1 Module 3',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l19-6',  module_id: 'm-a11-3', order_num: 8, type: 'test',       title: 'Module 3 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_4: EnglishLesson[] = [
  { id: 'l20-1',  module_id: 'm-a11-4', order_num: 1, type: 'reading',    title: 'Menu at a café',                  duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-2',  module_id: 'm-a11-4', order_num: 2, type: 'listening',  title: 'Ordering food',                   duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-3',  module_id: 'm-a11-4', order_num: 3, type: 'listening',  title: 'At the market',                   duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-4',  module_id: 'm-a11-4', order_num: 4, type: 'grammar',    title: 'Countable & uncountable nouns',   duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-g2', module_id: 'm-a11-4', order_num: 5, type: 'grammar',    title: 'a / an / some / any / much / many', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-5',  module_id: 'm-a11-4', order_num: 6, type: 'writing',    title: 'Write a restaurant review',       duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-v',  module_id: 'm-a11-4', order_num: 7, type: 'vocabulary', title: '52 words · A1.1 Module 4',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l20-6',  module_id: 'm-a11-4', order_num: 8, type: 'test',       title: 'Module 4 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_5: EnglishLesson[] = [
  { id: 'l21-1',  module_id: 'm-a11-5', order_num: 1, type: 'reading',    title: 'My digital life',                 duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-2',  module_id: 'm-a11-5', order_num: 2, type: 'reading',    title: 'Social media habits',             duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-3',  module_id: 'm-a11-5', order_num: 3, type: 'listening',  title: 'Tech support call',               duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-4',  module_id: 'm-a11-5', order_num: 4, type: 'grammar',    title: 'Frequency adverbs + Present Simple review', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-g2', module_id: 'm-a11-5', order_num: 5, type: 'grammar',    title: 'Verbs + infinitive: want/need/like', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-5',  module_id: 'm-a11-5', order_num: 6, type: 'writing',    title: 'My technology habits',            duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-v',  module_id: 'm-a11-5', order_num: 7, type: 'vocabulary', title: '50 words · A1.1 Module 5',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l21-6',  module_id: 'm-a11-5', order_num: 8, type: 'test',       title: 'Module 5 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_6: EnglishLesson[] = [
  { id: 'l22-1',  module_id: 'm-a11-6', order_num: 1, type: 'reading',    title: 'Amazing animals of Kazakhstan',   duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-2',  module_id: 'm-a11-6', order_num: 2, type: 'listening',  title: 'A wildlife documentary',          duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-3',  module_id: 'm-a11-6', order_num: 3, type: 'grammar',    title: 'Superlatives: the biggest, the most…', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-g2', module_id: 'm-a11-6', order_num: 4, type: 'grammar',    title: 'Extreme adjectives: huge, tiny, wonderful', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-4',  module_id: 'm-a11-6', order_num: 5, type: 'writing',    title: 'The most amazing place I\'ve seen', duration_min: 80, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-v',  module_id: 'm-a11-6', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 6',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l22-5',  module_id: 'm-a11-6', order_num: 7, type: 'test',       title: 'Module 6 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_7: EnglishLesson[] = [
  { id: 'l23-1',  module_id: 'm-a11-7', order_num: 1, type: 'reading',    title: "My Grandmother's Stories",        duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-2',  module_id: 'm-a11-7', order_num: 2, type: 'listening',  title: 'At the History Museum',           duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-3',  module_id: 'm-a11-7', order_num: 3, type: 'grammar',    title: 'Past Simple — Regular Verbs',     duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-g2', module_id: 'm-a11-7', order_num: 4, type: 'grammar',    title: 'Past Simple — Irregular Verbs',   duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-4',  module_id: 'm-a11-7', order_num: 5, type: 'writing',    title: 'A Story from My Family History',  duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-v',  module_id: 'm-a11-7', order_num: 6, type: 'vocabulary', title: '52 words · A1.1 Module 7',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l23-5',  module_id: 'm-a11-7', order_num: 7, type: 'test',       title: 'Module 7 — Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_8: EnglishLesson[] = [
  { id: 'l24-1',  module_id: 'm-a11-8', order_num: 1, type: 'reading',    title: 'Nauryz: New Year of the Steppes', duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-2',  module_id: 'm-a11-8', order_num: 2, type: 'listening',  title: 'Traditions in my family',         duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-3',  module_id: 'm-a11-8', order_num: 3, type: 'grammar',    title: 'used to: past habits and states', duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-g2', module_id: 'm-a11-8', order_num: 4, type: 'grammar',    title: 'Past Simple vs used to',          duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-4',  module_id: 'm-a11-8', order_num: 5, type: 'writing',    title: 'Traditions in my family',         duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-v',  module_id: 'm-a11-8', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 8',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l24-5',  module_id: 'm-a11-8', order_num: 7, type: 'test',       title: 'Module 8 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_9: EnglishLesson[] = [
  { id: 'l25-1',  module_id: 'm-a11-9', order_num: 1, type: 'reading',    title: 'Experiences of a lifetime',       duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-2',  module_id: 'm-a11-9', order_num: 2, type: 'listening',  title: 'Have you ever tried…?',           duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-3',  module_id: 'm-a11-9', order_num: 3, type: 'listening',  title: 'An interview: life experiences',  duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-4',  module_id: 'm-a11-9', order_num: 4, type: 'grammar',    title: 'Present Perfect: have + past participle', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-g2', module_id: 'm-a11-9', order_num: 5, type: 'grammar',    title: 'ever / never / already / yet',    duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-5',  module_id: 'm-a11-9', order_num: 6, type: 'writing',    title: '5 things I have (never) done',    duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-v',  module_id: 'm-a11-9', order_num: 7, type: 'vocabulary', title: '50 words · A1.1 Module 9',        duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l25-6',  module_id: 'm-a11-9', order_num: 8, type: 'test',       title: 'Module 9 Final Test',             duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_10: EnglishLesson[] = [
  { id: 'l26-1',  module_id: 'm-a11-10', order_num: 1, type: 'reading',    title: 'School rules at ZKU',            duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-2',  module_id: 'm-a11-10', order_num: 2, type: 'listening',  title: 'Asking for advice',              duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-3',  module_id: 'm-a11-10', order_num: 3, type: 'grammar',    title: 'should / shouldn\'t for advice', duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-g2', module_id: 'm-a11-10', order_num: 4, type: 'grammar',    title: 'must / mustn\'t / have to / don\'t have to', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-4',  module_id: 'm-a11-10', order_num: 5, type: 'writing',    title: 'Advice for a new student',       duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-v',  module_id: 'm-a11-10', order_num: 6, type: 'vocabulary', title: '48 words · A1.1 Module 10',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l26-5',  module_id: 'm-a11-10', order_num: 7, type: 'test',       title: 'Module 10 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_11: EnglishLesson[] = [
  { id: 'l27-1',  module_id: 'm-a11-11', order_num: 1, type: 'reading',    title: 'If the weather is good…',        duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-2',  module_id: 'm-a11-11', order_num: 2, type: 'listening',  title: 'What will happen if…?',          duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-3',  module_id: 'm-a11-11', order_num: 3, type: 'grammar',    title: 'Zero conditional: if + present, present', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-g2', module_id: 'm-a11-11', order_num: 4, type: 'grammar',    title: 'First conditional: if + present, will', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-4',  module_id: 'm-a11-11', order_num: 5, type: 'writing',    title: 'What I will do if I pass my exams', duration_min: 80, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-v',  module_id: 'm-a11-11', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 11',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l27-5',  module_id: 'm-a11-11', order_num: 7, type: 'test',       title: 'Module 11 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_12: EnglishLesson[] = [
  { id: 'l28-1',  module_id: 'm-a11-12', order_num: 1, type: 'reading',    title: 'How are you feeling today?',     duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-2',  module_id: 'm-a11-12', order_num: 2, type: 'reading',    title: 'Emotional intelligence',         duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-3',  module_id: 'm-a11-12', order_num: 3, type: 'listening',  title: 'A conversation about feelings',  duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-4',  module_id: 'm-a11-12', order_num: 4, type: 'grammar',    title: 'Verbs + -ing: enjoy, love, hate', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-g2', module_id: 'm-a11-12', order_num: 5, type: 'grammar',    title: 'Verbs + to + infinitive: want, decide, hope', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-5',  module_id: 'm-a11-12', order_num: 6, type: 'writing',    title: 'Write about your feelings',      duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-v',  module_id: 'm-a11-12', order_num: 7, type: 'vocabulary', title: '52 words · A1.1 Module 12',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l28-6',  module_id: 'm-a11-12', order_num: 8, type: 'test',       title: 'Module 12 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_13: EnglishLesson[] = [
  { id: 'l29-1',  module_id: 'm-a11-13', order_num: 1, type: 'reading',    title: 'Sports stars of Kazakhstan',     duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-2',  module_id: 'm-a11-13', order_num: 2, type: 'listening',  title: 'My sports routine',              duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-3',  module_id: 'm-a11-13', order_num: 3, type: 'listening',  title: 'At the sports centre',           duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-4',  module_id: 'm-a11-13', order_num: 4, type: 'grammar',    title: 'Present Perfect with for and since', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-g2', module_id: 'm-a11-13', order_num: 5, type: 'grammar',    title: 'Present Perfect vs Past Simple', duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-5',  module_id: 'm-a11-13', order_num: 6, type: 'writing',    title: 'My favourite sport',             duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-v',  module_id: 'm-a11-13', order_num: 7, type: 'vocabulary', title: '50 words · A1.1 Module 13',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l29-6',  module_id: 'm-a11-13', order_num: 8, type: 'test',       title: 'Module 13 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_14: EnglishLesson[] = [
  { id: 'l30-1',  module_id: 'm-a11-14', order_num: 1, type: 'reading',    title: 'Jobs of the future',             duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-2',  module_id: 'm-a11-14', order_num: 2, type: 'reading',    title: 'A day in the life of…',          duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-3',  module_id: 'm-a11-14', order_num: 3, type: 'listening',  title: 'A job interview',                duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-4',  module_id: 'm-a11-14', order_num: 4, type: 'grammar',    title: 'Work vocabulary + collocations', duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-g2', module_id: 'm-a11-14', order_num: 5, type: 'grammar',    title: 'do / make / have / take collocations', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-5',  module_id: 'm-a11-14', order_num: 6, type: 'writing',    title: 'My dream job',                   duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-v',  module_id: 'm-a11-14', order_num: 7, type: 'vocabulary', title: '52 words · A1.1 Module 14',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l30-6',  module_id: 'm-a11-14', order_num: 8, type: 'test',       title: 'Module 14 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_15: EnglishLesson[] = [
  { id: 'l31-1',  module_id: 'm-a11-15', order_num: 1, type: 'reading',    title: 'Saving our planet',              duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-2',  module_id: 'm-a11-15', order_num: 2, type: 'listening',  title: 'An eco-friendly student',        duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-3',  module_id: 'm-a11-15', order_num: 3, type: 'grammar',    title: 'Passive voice: is/are + past participle', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-g2', module_id: 'm-a11-15', order_num: 4, type: 'grammar',    title: 'Active vs passive sentences',    duration_min: 65, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-4',  module_id: 'm-a11-15', order_num: 5, type: 'writing',    title: 'What can we do for the environment?', duration_min: 80, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-v',  module_id: 'm-a11-15', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 15',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l31-5',  module_id: 'm-a11-15', order_num: 7, type: 'test',       title: 'Module 15 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_16: EnglishLesson[] = [
  { id: 'l32-1',  module_id: 'm-a11-16', order_num: 1, type: 'reading',    title: 'Fashion trends in Kazakhstan',   duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-2',  module_id: 'm-a11-16', order_num: 2, type: 'reading',    title: 'Online vs in-store shopping',    duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-3',  module_id: 'm-a11-16', order_num: 3, type: 'listening',  title: 'At the shop',                    duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-4',  module_id: 'm-a11-16', order_num: 4, type: 'grammar',    title: 'too / enough: too big, not big enough', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-g2', module_id: 'm-a11-16', order_num: 5, type: 'grammar',    title: 'Describing clothes: size, colour, material', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-5',  module_id: 'm-a11-16', order_num: 6, type: 'writing',    title: 'My shopping list + fashion style', duration_min: 80, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-v',  module_id: 'm-a11-16', order_num: 7, type: 'vocabulary', title: '50 words · A1.1 Module 16',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l32-6',  module_id: 'm-a11-16', order_num: 8, type: 'test',       title: 'Module 16 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_17: EnglishLesson[] = [
  { id: 'l33-1',  module_id: 'm-a11-17', order_num: 1, type: 'reading',    title: 'Films and books I love',         duration_min: 55, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-2',  module_id: 'm-a11-17', order_num: 2, type: 'listening',  title: 'What\'s on at the cinema?',      duration_min: 50, xp_reward: 55,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-3',  module_id: 'm-a11-17', order_num: 3, type: 'grammar',    title: 'Relative clauses: who, which, that', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-g2', module_id: 'm-a11-17', order_num: 4, type: 'grammar',    title: 'Defining relative clauses in context', duration_min: 65, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-4',  module_id: 'm-a11-17', order_num: 5, type: 'writing',    title: 'Review a film or book',          duration_min: 80, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-v',  module_id: 'm-a11-17', order_num: 6, type: 'vocabulary', title: '50 words · A1.1 Module 17',      duration_min: 40, xp_reward: 40,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l33-5',  module_id: 'm-a11-17', order_num: 7, type: 'test',       title: 'Module 17 Final Test',           duration_min: 65, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A11_18: EnglishLesson[] = [
  { id: 'l34-1', module_id: 'm-a11-18', order_num: 1, type: 'reading',   title: 'Reading & Use of English',        duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l34-2', module_id: 'm-a11-18', order_num: 2, type: 'listening', title: 'Listening Exam (4 parts)',         duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l34-3', module_id: 'm-a11-18', order_num: 3, type: 'writing',   title: 'Writing Exam (2 tasks)',           duration_min: 120, xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
]

// ── A2 Pre-Intermediate Modules ───────────────────────────────
export const MOCK_A2_MODULES: MockModule[] = [
  { id: 'm-a2-1',  level_id: 'l-a2', level_code: 'A2', order_num: 1,  title: 'Daily Routines & Habits',    grammar_focus: 'Present Simple review + adverbs',       vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 450, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-2',  level_id: 'l-a2', level_code: 'A2', order_num: 2,  title: "What's Happening Now?",      grammar_focus: 'Present Continuous',                   vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 450, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-3',  level_id: 'l-a2', level_code: 'A2', order_num: 3,  title: 'Stories & Memories',         grammar_focus: 'Past Continuous',                      vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 460, sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-4',  level_id: 'l-a2', level_code: 'A2', order_num: 4,  title: 'Plans & Intentions',         grammar_focus: 'will vs going to',                     vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 460, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-5',  level_id: 'l-a2', level_code: 'A2', order_num: 5,  title: 'Better, Best, Most',         grammar_focus: 'Comparatives & Superlatives',          vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 460, sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-6',  level_id: 'l-a2', level_code: 'A2', order_num: 6,  title: 'Life Experiences',           grammar_focus: 'Present Perfect extended',              vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 470, sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-7',  level_id: 'l-a2', level_code: 'A2', order_num: 7,  title: 'Obligations & Advice',       grammar_focus: 'should / must / have to / needn\'t',   vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 460, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-8',  level_id: 'l-a2', level_code: 'A2', order_num: 8,  title: 'Food, Quantities & Shopping',grammar_focus: 'Quantifiers: much / many / a lot of',  vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 1, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-9',  level_id: 'l-a2', level_code: 'A2', order_num: 9,  title: 'Asking & Answering',         grammar_focus: 'Question forms + question tags',       vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 460, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-10', level_id: 'l-a2', level_code: 'A2', order_num: 10, title: 'Around the City',            grammar_focus: 'Prepositions of place & movement',     vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 470, sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-11', level_id: 'l-a2', level_code: 'A2', order_num: 11, title: 'What Would You Do?',         grammar_focus: 'Second Conditional: if + past, would',  vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-12', level_id: 'l-a2', level_code: 'A2', order_num: 12, title: 'Saying What They Said',      grammar_focus: 'Reported Speech: said / told',          vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 470, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-13', level_id: 'l-a2', level_code: 'A2', order_num: 13, title: 'Phrasal Verbs in Action',    grammar_focus: 'Common phrasal verbs',                  vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-14', level_id: 'l-a2', level_code: 'A2', order_num: 14, title: 'Describing & Defining',      grammar_focus: 'Relative clauses who / which / where',  vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-15', level_id: 'l-a2', level_code: 'A2', order_num: 15, title: 'Things Being Done',          grammar_focus: 'Passive voice: was/were + past part.', vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-16', level_id: 'l-a2', level_code: 'A2', order_num: 16, title: 'Likes, Hates & Decisions',   grammar_focus: 'Gerunds & infinitives extended',        vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 480, sections: { reading: 1, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-17', level_id: 'l-a2', level_code: 'A2', order_num: 17, title: 'Media & Technology',         grammar_focus: 'Articles: a / an / the — advanced',       vocab_count: 65, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 490,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-18', level_id: 'l-a2', level_code: 'A2', order_num: 18, title: 'Health & the Body',          grammar_focus: 'should for advice, have to for rules',    vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 490,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-19', level_id: 'l-a2', level_code: 'A2', order_num: 19, title: 'Travel & Tourism',           grammar_focus: 'Future forms review + travel phrases',    vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 490,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-20', level_id: 'l-a2', level_code: 'A2', order_num: 20, title: 'Work & Career',              grammar_focus: 'Present Perfect Continuous + have been',  vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 500,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-21', level_id: 'l-a2', level_code: 'A2', order_num: 21, title: 'Telling Stories',            grammar_focus: 'Past Perfect: had + past participle',     vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 500,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-22', level_id: 'l-a2', level_code: 'A2', order_num: 22, title: 'The Natural World',          grammar_focus: 'Passive voice review + environmental vocab', vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 500,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-23', level_id: 'l-a2', level_code: 'A2', order_num: 23, title: 'Linking Ideas',              grammar_focus: 'Conjunctions: although, despite, however', vocab_count: 50, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 500,  sections: { reading: 2, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-a2-24', level_id: 'l-a2', level_code: 'A2', order_num: 24, title: 'A2 Final Exam',              grammar_focus: 'ALL A2 topics',                           vocab_count: 60, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 1200, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, test: 0 } },
]

// ── A2 Lessons ────────────────────────────────────────────────
export const MOCK_LESSONS_M_A2_1: EnglishLesson[] = [
  { id: 'l35-1', module_id: 'm-a2-1', order_num: 1, type: 'reading',    title: 'A student\'s typical week',              duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-2', module_id: 'm-a2-1', order_num: 2, type: 'listening',  title: 'Talking about routines',                 duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-3', module_id: 'm-a2-1', order_num: 3, type: 'grammar',    title: 'Present Simple: review & frequency adverbs', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-g2',module_id: 'm-a2-1', order_num: 4, type: 'grammar',    title: 'Adverbs of manner: quickly, well, hard',duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-4', module_id: 'm-a2-1', order_num: 5, type: 'writing',    title: 'My weekly routine at ZKU',               duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-v', module_id: 'm-a2-1', order_num: 6, type: 'vocabulary', title: '32 words · A2 Module 1',                 duration_min: 13, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l35-5', module_id: 'm-a2-1', order_num: 7, type: 'test',       title: 'Module 1 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_2: EnglishLesson[] = [
  { id: 'l36-1', module_id: 'm-a2-2', order_num: 1, type: 'reading',    title: 'What are they doing right now?',         duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-2', module_id: 'm-a2-2', order_num: 2, type: 'listening',  title: 'A phone call from the library',          duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-3', module_id: 'm-a2-2', order_num: 3, type: 'grammar',    title: 'Present Continuous: form and use',       duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-g2',module_id: 'm-a2-2', order_num: 4, type: 'grammar',    title: 'Pres. Continuous vs Pres. Simple',       duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-4', module_id: 'm-a2-2', order_num: 5, type: 'writing',    title: 'Describing what\'s happening around me', duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-v', module_id: 'm-a2-2', order_num: 6, type: 'vocabulary', title: '30 words · A2 Module 2',                 duration_min: 12, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l36-5', module_id: 'm-a2-2', order_num: 7, type: 'test',       title: 'Module 2 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_3: EnglishLesson[] = [
  { id: 'l37-1', module_id: 'm-a2-3', order_num: 1, type: 'reading',    title: 'The night the power went out',           duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-2', module_id: 'm-a2-3', order_num: 2, type: 'reading',    title: 'A memorable journey',                    duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-3', module_id: 'm-a2-3', order_num: 3, type: 'listening',  title: 'What were you doing when…?',             duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-g1',module_id: 'm-a2-3', order_num: 4, type: 'grammar',    title: 'Past Continuous: was/were + -ing',       duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-g2',module_id: 'm-a2-3', order_num: 5, type: 'grammar',    title: 'Past Continuous vs Past Simple',         duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-4', module_id: 'm-a2-3', order_num: 6, type: 'writing',    title: 'A story from last year',                 duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-v', module_id: 'm-a2-3', order_num: 7, type: 'vocabulary', title: '28 words · A2 Module 3',                 duration_min: 11, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l37-5', module_id: 'm-a2-3', order_num: 8, type: 'test',       title: 'Module 3 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_4: EnglishLesson[] = [
  { id: 'l38-1', module_id: 'm-a2-4', order_num: 1, type: 'reading',    title: 'My plans after graduation',              duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-2', module_id: 'm-a2-4', order_num: 2, type: 'listening',  title: 'Making future arrangements',             duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-3', module_id: 'm-a2-4', order_num: 3, type: 'grammar',    title: 'going to: plans and intentions',         duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-g2',module_id: 'm-a2-4', order_num: 4, type: 'grammar',    title: 'will: decisions and predictions',        duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-4', module_id: 'm-a2-4', order_num: 5, type: 'writing',    title: 'My plans for next year',                 duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-v', module_id: 'm-a2-4', order_num: 6, type: 'vocabulary', title: '30 words · A2 Module 4',                 duration_min: 12, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l38-5', module_id: 'm-a2-4', order_num: 7, type: 'test',       title: 'Module 4 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_5: EnglishLesson[] = [
  { id: 'l39-1', module_id: 'm-a2-5', order_num: 1, type: 'reading',    title: 'Cities of Kazakhstan: a comparison',     duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-2', module_id: 'm-a2-5', order_num: 2, type: 'reading',    title: 'Which is the best university?',          duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-3', module_id: 'm-a2-5', order_num: 3, type: 'listening',  title: 'Comparing two flats',                    duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-g1',module_id: 'm-a2-5', order_num: 4, type: 'grammar',    title: 'Comparatives: -er / more + adjective',   duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-g2',module_id: 'm-a2-5', order_num: 5, type: 'grammar',    title: 'Superlatives + irregular forms',         duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-4', module_id: 'm-a2-5', order_num: 6, type: 'writing',    title: 'Comparing two places I know',            duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-v', module_id: 'm-a2-5', order_num: 7, type: 'vocabulary', title: '32 words · A2 Module 5',                 duration_min: 13, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l39-5', module_id: 'm-a2-5', order_num: 8, type: 'test',       title: 'Module 5 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_6: EnglishLesson[] = [
  { id: 'l40-1', module_id: 'm-a2-6', order_num: 1, type: 'reading',    title: 'Things I\'ve done in my life',           duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-2', module_id: 'm-a2-6', order_num: 2, type: 'listening',  title: 'Have you ever been to Almaty?',          duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-3', module_id: 'm-a2-6', order_num: 3, type: 'listening',  title: 'An interview: life achievements',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-g1',module_id: 'm-a2-6', order_num: 4, type: 'grammar',    title: 'Present Perfect: irregular past participles', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-g2',module_id: 'm-a2-6', order_num: 5, type: 'grammar',    title: 'PP vs Past Simple: time expressions',    duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-4', module_id: 'm-a2-6', order_num: 6, type: 'writing',    title: 'Five experiences I will never forget',   duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-v', module_id: 'm-a2-6', order_num: 7, type: 'vocabulary', title: '34 words · A2 Module 6',                 duration_min: 14, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l40-5', module_id: 'm-a2-6', order_num: 8, type: 'test',       title: 'Module 6 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_7: EnglishLesson[] = [
  { id: 'l41-1', module_id: 'm-a2-7', order_num: 1, type: 'reading',    title: 'Rules at ZKU: what you must do',         duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-2', module_id: 'm-a2-7', order_num: 2, type: 'listening',  title: 'Getting advice from a mentor',           duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-g1',module_id: 'm-a2-7', order_num: 3, type: 'grammar',    title: 'must / mustn\'t / have to / don\'t have to', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-g2',module_id: 'm-a2-7', order_num: 4, type: 'grammar',    title: 'should / ought to / needn\'t',           duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-4', module_id: 'm-a2-7', order_num: 5, type: 'writing',    title: 'Advice for a new student at ZKU',        duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-v', module_id: 'm-a2-7', order_num: 6, type: 'vocabulary', title: '28 words · A2 Module 7',                 duration_min: 11, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l41-5', module_id: 'm-a2-7', order_num: 7, type: 'test',       title: 'Module 7 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_8: EnglishLesson[] = [
  { id: 'l42-1', module_id: 'm-a2-8', order_num: 1, type: 'reading',    title: 'Eating well at university',              duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-2', module_id: 'm-a2-8', order_num: 2, type: 'listening',  title: 'At the supermarket',                     duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-3', module_id: 'm-a2-8', order_num: 3, type: 'listening',  title: 'A recipe podcast',                       duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-g1',module_id: 'm-a2-8', order_num: 4, type: 'grammar',    title: 'Quantifiers: much, many, a lot of, enough', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-g2',module_id: 'm-a2-8', order_num: 5, type: 'grammar',    title: 'too much / too many / not enough',       duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-4', module_id: 'm-a2-8', order_num: 6, type: 'writing',    title: 'My ideal healthy meal plan',             duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-v', module_id: 'm-a2-8', order_num: 7, type: 'vocabulary', title: '36 words · A2 Module 8',                 duration_min: 14, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l42-5', module_id: 'm-a2-8', order_num: 8, type: 'test',       title: 'Module 8 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_9: EnglishLesson[] = [
  { id: 'l43-1', module_id: 'm-a2-9', order_num: 1, type: 'reading',    title: 'Asking the right questions',             duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-2', module_id: 'm-a2-9', order_num: 2, type: 'listening',  title: 'A university admissions interview',      duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-g1',module_id: 'm-a2-9', order_num: 3, type: 'grammar',    title: 'Indirect questions: Could you tell me…?',duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-g2',module_id: 'm-a2-9', order_num: 4, type: 'grammar',    title: 'Question tags: isn\'t it? / aren\'t you?',duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-4', module_id: 'm-a2-9', order_num: 5, type: 'writing',    title: 'Preparing interview questions',          duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-v', module_id: 'm-a2-9', order_num: 6, type: 'vocabulary', title: '26 words · A2 Module 9',                 duration_min: 10, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l43-5', module_id: 'm-a2-9', order_num: 7, type: 'test',       title: 'Module 9 Final Test',                    duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_10: EnglishLesson[] = [
  { id: 'l44-1', module_id: 'm-a2-10', order_num: 1, type: 'reading',    title: 'Getting around Uralsk',                 duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-2', module_id: 'm-a2-10', order_num: 2, type: 'reading',    title: 'Living in a new city',                  duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-3', module_id: 'm-a2-10', order_num: 3, type: 'listening',  title: 'Following directions on the phone',     duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-g1',module_id: 'm-a2-10', order_num: 4, type: 'grammar',    title: 'Prepositions of place: at / in / on',   duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-g2',module_id: 'm-a2-10', order_num: 5, type: 'grammar',    title: 'Prepositions of movement: across / along / through', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-4', module_id: 'm-a2-10', order_num: 6, type: 'writing',    title: 'How to get to the ZKU campus',          duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-v', module_id: 'm-a2-10', order_num: 7, type: 'vocabulary', title: '30 words · A2 Module 10',               duration_min: 12, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l44-5', module_id: 'm-a2-10', order_num: 8, type: 'test',       title: 'Module 10 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_11: EnglishLesson[] = [
  { id: 'l45-1', module_id: 'm-a2-11', order_num: 1, type: 'reading',    title: 'What would you do with a million tenge?', duration_min: 14, xp_reward: 65, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-2', module_id: 'm-a2-11', order_num: 2, type: 'listening',  title: 'If I were you…',                        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-g1',module_id: 'm-a2-11', order_num: 3, type: 'grammar',    title: 'Second Conditional: if + past, would',  duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-g2',module_id: 'm-a2-11', order_num: 4, type: 'grammar',    title: '1st vs 2nd Conditional: real vs unreal', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-4', module_id: 'm-a2-11', order_num: 5, type: 'writing',    title: 'If I could change one thing at ZKU…',   duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-v', module_id: 'm-a2-11', order_num: 6, type: 'vocabulary', title: '28 words · A2 Module 11',               duration_min: 11, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l45-5', module_id: 'm-a2-11', order_num: 7, type: 'test',       title: 'Module 11 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_12: EnglishLesson[] = [
  { id: 'l46-1', module_id: 'm-a2-12', order_num: 1, type: 'reading',    title: 'What the professor said',               duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-2', module_id: 'm-a2-12', order_num: 2, type: 'listening',  title: 'Reporting a conversation',              duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-g1',module_id: 'm-a2-12', order_num: 3, type: 'grammar',    title: 'Reported Speech: said / told + statement', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-g2',module_id: 'm-a2-12', order_num: 4, type: 'grammar',    title: 'Reported questions and commands',        duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-4', module_id: 'm-a2-12', order_num: 5, type: 'writing',    title: 'A summary of a lecture I attended',     duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-v', module_id: 'm-a2-12', order_num: 6, type: 'vocabulary', title: '26 words · A2 Module 12',               duration_min: 10, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l46-5', module_id: 'm-a2-12', order_num: 7, type: 'test',       title: 'Module 12 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_13: EnglishLesson[] = [
  { id: 'l47-1', module_id: 'm-a2-13', order_num: 1, type: 'reading',    title: 'Phrasal verbs in everyday English',      duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-2', module_id: 'm-a2-13', order_num: 2, type: 'listening',  title: 'Give up or keep going?',                 duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-g1',module_id: 'm-a2-13', order_num: 3, type: 'grammar',    title: 'Separable phrasal verbs: turn it off',   duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-g2',module_id: 'm-a2-13', order_num: 4, type: 'grammar',    title: 'Inseparable phrasal verbs: look after',  duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-4', module_id: 'm-a2-13', order_num: 5, type: 'writing',    title: 'Phrasal verbs in a personal story',      duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-v', module_id: 'm-a2-13', order_num: 6, type: 'vocabulary', title: '30 words · A2 Module 13',               duration_min: 12, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l47-5', module_id: 'm-a2-13', order_num: 7, type: 'test',       title: 'Module 13 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_14: EnglishLesson[] = [
  { id: 'l48-1', module_id: 'm-a2-14', order_num: 1, type: 'reading',    title: 'A person who changed my life',           duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-2', module_id: 'm-a2-14', order_num: 2, type: 'reading',    title: 'Places that inspire me',                 duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-3', module_id: 'm-a2-14', order_num: 3, type: 'listening',  title: 'Describing a favourite place',           duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-g1',module_id: 'm-a2-14', order_num: 4, type: 'grammar',    title: 'Relative clauses: who / which / where',  duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-g2',module_id: 'm-a2-14', order_num: 5, type: 'grammar',    title: 'Adjective order before nouns',           duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-4', module_id: 'm-a2-14', order_num: 6, type: 'writing',    title: 'A person or place that matters to me',  duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-v', module_id: 'm-a2-14', order_num: 7, type: 'vocabulary', title: '28 words · A2 Module 14',               duration_min: 11, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l48-5', module_id: 'm-a2-14', order_num: 8, type: 'test',       title: 'Module 14 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_15: EnglishLesson[] = [
  { id: 'l49-1', module_id: 'm-a2-15', order_num: 1, type: 'reading',    title: 'How products are made',                  duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-2', module_id: 'm-a2-15', order_num: 2, type: 'listening',  title: 'A factory tour at ZKU',                  duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-g1',module_id: 'm-a2-15', order_num: 3, type: 'grammar',    title: 'Passive voice: was/were + past participle', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-g2',module_id: 'm-a2-15', order_num: 4, type: 'grammar',    title: 'Passive vs active: when to use each',    duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-4', module_id: 'm-a2-15', order_num: 5, type: 'writing',    title: 'How something is made or done',          duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-v', module_id: 'm-a2-15', order_num: 6, type: 'vocabulary', title: '26 words · A2 Module 15',               duration_min: 10, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l49-5', module_id: 'm-a2-15', order_num: 7, type: 'test',       title: 'Module 15 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_16: EnglishLesson[] = [
  { id: 'l50-1', module_id: 'm-a2-16', order_num: 1, type: 'reading',    title: 'What do you enjoy doing?',               duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-2', module_id: 'm-a2-16', order_num: 2, type: 'listening',  title: 'I\'ve decided to change my life',        duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-g1',module_id: 'm-a2-16', order_num: 3, type: 'grammar',    title: 'Gerund: enjoy / mind / avoid + -ing',    duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-g2',module_id: 'm-a2-16', order_num: 4, type: 'grammar',    title: 'Infinitive: decide / want / hope + to', duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-4', module_id: 'm-a2-16', order_num: 5, type: 'writing',    title: 'My decisions and habits this year',      duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-v', module_id: 'm-a2-16', order_num: 6, type: 'vocabulary', title: '30 words · A2 Module 16',               duration_min: 12, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l50-5', module_id: 'm-a2-16', order_num: 7, type: 'test',       title: 'Module 16 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_17: EnglishLesson[] = [
  { id: 'l51-1', module_id: 'm-a2-17', order_num: 1, type: 'reading',    title: 'Social media: blessing or curse?',       duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-2', module_id: 'm-a2-17', order_num: 2, type: 'reading',    title: 'Technology and education in Kazakhstan', duration_min: 14, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-3', module_id: 'm-a2-17', order_num: 3, type: 'listening',  title: 'A podcast: the future of work',          duration_min: 12, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-g1',module_id: 'm-a2-17', order_num: 4, type: 'grammar',    title: 'Articles: a / an / the — advanced use',  duration_min: 18, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-g2',module_id: 'm-a2-17', order_num: 5, type: 'grammar',    title: 'Zero article vs the: general and specific', duration_min: 18, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-4', module_id: 'm-a2-17', order_num: 6, type: 'writing',    title: 'My opinion on technology in education',  duration_min: 22, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-v', module_id: 'm-a2-17', order_num: 7, type: 'vocabulary', title: '32 words · A2 Module 17',               duration_min: 13, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l51-5', module_id: 'm-a2-17', order_num: 8, type: 'test',       title: 'Module 17 Final Test',                  duration_min: 25, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_18: EnglishLesson[] = [
  { id: 'l52-1', module_id: 'm-a2-18', order_num: 1, type: 'reading',    title: 'Staying healthy at university',          duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-2', module_id: 'm-a2-18', order_num: 2, type: 'reading',    title: 'Mental health and student life',         duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-3', module_id: 'm-a2-18', order_num: 3, type: 'listening',  title: 'At the doctor\'s',                       duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-g1',module_id: 'm-a2-18', order_num: 4, type: 'grammar',    title: 'should / shouldn\'t for health advice',  duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-g2',module_id: 'm-a2-18', order_num: 5, type: 'grammar',    title: 'have to / don\'t have to for rules',     duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-4', module_id: 'm-a2-18', order_num: 6, type: 'writing',    title: 'Advice for a healthy student lifestyle', duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-v', module_id: 'm-a2-18', order_num: 7, type: 'vocabulary', title: '34 words · A2 Module 18',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l52-5', module_id: 'm-a2-18', order_num: 8, type: 'test',       title: 'Module 18 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_19: EnglishLesson[] = [
  { id: 'l53-1', module_id: 'm-a2-19', order_num: 1, type: 'reading',    title: 'Travel in Kazakhstan',                  duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-2', module_id: 'm-a2-19', order_num: 2, type: 'reading',    title: 'Planning a trip abroad',                duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-3', module_id: 'm-a2-19', order_num: 3, type: 'listening',  title: 'Booking a hotel room',                  duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-4', module_id: 'm-a2-19', order_num: 4, type: 'listening',  title: 'At the airport',                        duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-g1',module_id: 'm-a2-19', order_num: 5, type: 'grammar',    title: 'Future forms: will / going to / Pres. Cont.', duration_min: 65, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-g2',module_id: 'm-a2-19', order_num: 6, type: 'grammar',    title: 'Travel collocations and fixed phrases', duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-4b',module_id: 'm-a2-19', order_num: 7, type: 'writing',    title: 'My ideal travel plan',                  duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-v', module_id: 'm-a2-19', order_num: 8, type: 'vocabulary', title: '36 words · A2 Module 19',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l53-5', module_id: 'm-a2-19', order_num: 9, type: 'test',       title: 'Module 19 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_20: EnglishLesson[] = [
  { id: 'l54-1', module_id: 'm-a2-20', order_num: 1, type: 'reading',    title: 'Jobs of today and tomorrow',            duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-2', module_id: 'm-a2-20', order_num: 2, type: 'reading',    title: 'My first internship',                   duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-3', module_id: 'm-a2-20', order_num: 3, type: 'listening',  title: 'A job interview at ZKU',                duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-g1',module_id: 'm-a2-20', order_num: 4, type: 'grammar',    title: 'Present Perfect Continuous: have been + -ing', duration_min: 65, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-g2',module_id: 'm-a2-20', order_num: 5, type: 'grammar',    title: 'Work & career collocations',            duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-4', module_id: 'm-a2-20', order_num: 6, type: 'writing',    title: 'A cover letter for an internship',      duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-v', module_id: 'm-a2-20', order_num: 7, type: 'vocabulary', title: '34 words · A2 Module 20',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l54-5', module_id: 'm-a2-20', order_num: 8, type: 'test',       title: 'Module 20 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_21: EnglishLesson[] = [
  { id: 'l55-1', module_id: 'm-a2-21', order_num: 1, type: 'reading',    title: 'A story with a twist',                  duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-2', module_id: 'm-a2-21', order_num: 2, type: 'reading',    title: 'Before it was too late',                duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-3', module_id: 'm-a2-21', order_num: 3, type: 'listening',  title: 'What had happened?',                    duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-g1',module_id: 'm-a2-21', order_num: 4, type: 'grammar',    title: 'Past Perfect: had + past participle',   duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-g2',module_id: 'm-a2-21', order_num: 5, type: 'grammar',    title: 'Narrative sequencers: after, before, when, by the time', duration_min: 65, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-4', module_id: 'm-a2-21', order_num: 6, type: 'writing',    title: 'A short story from my past',            duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-v', module_id: 'm-a2-21', order_num: 7, type: 'vocabulary', title: '30 words · A2 Module 21',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l55-5', module_id: 'm-a2-21', order_num: 8, type: 'test',       title: 'Module 21 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_22: EnglishLesson[] = [
  { id: 'l56-1', module_id: 'm-a2-22', order_num: 1, type: 'reading',    title: 'Our changing planet',                   duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-2', module_id: 'm-a2-22', order_num: 2, type: 'reading',    title: 'Wildlife of Central Asia',              duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-3', module_id: 'm-a2-22', order_num: 3, type: 'listening',  title: 'An environmental activist',             duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-g1',module_id: 'm-a2-22', order_num: 4, type: 'grammar',    title: 'Passive voice: all tenses review',      duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-g2',module_id: 'm-a2-22', order_num: 5, type: 'grammar',    title: 'Environmental vocabulary in context',   duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-4', module_id: 'm-a2-22', order_num: 6, type: 'writing',    title: 'What we can do for the environment',    duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-v', module_id: 'm-a2-22', order_num: 7, type: 'vocabulary', title: '32 words · A2 Module 22',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l56-5', module_id: 'm-a2-22', order_num: 8, type: 'test',       title: 'Module 22 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_23: EnglishLesson[] = [
  { id: 'l57-1', module_id: 'm-a2-23', order_num: 1, type: 'reading',    title: 'Linking ideas in academic writing',     duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-2', module_id: 'm-a2-23', order_num: 2, type: 'reading',    title: 'Persuasive texts — how they work',      duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-3', module_id: 'm-a2-23', order_num: 3, type: 'listening',  title: 'A student debate',                      duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-g1',module_id: 'm-a2-23', order_num: 4, type: 'grammar',    title: 'Contrast: although, even though, despite', duration_min: 65, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-g2',module_id: 'm-a2-23', order_num: 5, type: 'grammar',    title: 'Addition & result: furthermore, therefore, as a result', duration_min: 65, xp_reward: 70, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-4', module_id: 'm-a2-23', order_num: 6, type: 'writing',    title: 'An opinion essay with linking words',   duration_min: 80, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-v', module_id: 'm-a2-23', order_num: 7, type: 'vocabulary', title: '28 words · A2 Module 23',               duration_min: 40, xp_reward: 45,  status: 'published', created_at: '', score: null, completed: false },
  { id: 'l57-5', module_id: 'm-a2-23', order_num: 8, type: 'test',       title: 'Module 23 Final Test',                  duration_min: 65, xp_reward: 110, status: 'published', created_at: '', score: null, completed: false },
]

export const MOCK_LESSONS_M_A2_24: EnglishLesson[] = [
  { id: 'l58-1', module_id: 'm-a2-24', order_num: 1, type: 'reading',   title: 'Reading & Use of English',               duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l58-2', module_id: 'm-a2-24', order_num: 2, type: 'listening', title: 'Listening Exam (4 parts)',                duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l58-3', module_id: 'm-a2-24', order_num: 3, type: 'writing',   title: 'Writing Exam (2 tasks)',                  duration_min: 120, xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
]

// ── B1 Intermediate Modules ────────────────────────────────────
export const MOCK_B1_MODULES: MockModule[] = [
  { id: 'm-b1-1',  level_id: 'l-b1', level_code: 'B1', order_num: 1,  title: 'Complex Conversations',        grammar_focus: 'Review: all A2 tenses in context',            vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 580,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-2',  level_id: 'l-b1', level_code: 'B1', order_num: 2,  title: 'Reported Speech & Reporting',  grammar_focus: 'Reported speech: all tenses + questions',      vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 590,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-3',  level_id: 'l-b1', level_code: 'B1', order_num: 3,  title: 'Conditionals: All Four Types', grammar_focus: 'Zero / 1st / 2nd / 3rd conditionals',          vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-4',  level_id: 'l-b1', level_code: 'B1', order_num: 4,  title: 'The Passive in All Tenses',    grammar_focus: 'Passive: present/past/perfect/future + get',   vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 590,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-5',  level_id: 'l-b1', level_code: 'B1', order_num: 5,  title: 'Modal Verbs: Deduction & Advice', grammar_focus: 'Must/can\'t/might + have done; should have',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-6',  level_id: 'l-b1', level_code: 'B1', order_num: 6,  title: 'Present Perfect: Simple vs Continuous', grammar_focus: 'PP Simple vs Continuous — meaning & use', vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 590,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-7',  level_id: 'l-b1', level_code: 'B1', order_num: 7,  title: 'Relative Clauses: Defining & Non-defining', grammar_focus: 'who/which/that/whose/where + commas',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 590,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-8',  level_id: 'l-b1', level_code: 'B1', order_num: 8,  title: 'Gerunds & Infinitives: Advanced', grammar_focus: 'Complex verb patterns + meaning changes',     vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-9',  level_id: 'l-b1', level_code: 'B1', order_num: 9,  title: 'Wishes, Regrets & Hypotheticals', grammar_focus: 'I wish / If only / Supposing / Imagine',    vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-10', level_id: 'l-b1', level_code: 'B1', order_num: 10, title: 'Telling & Writing Stories',      grammar_focus: 'Narrative tenses: Past Perfect + sequencers', vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 610,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-11', level_id: 'l-b1', level_code: 'B1', order_num: 11, title: 'Society & Social Issues',        grammar_focus: 'Causative: have/get something done',          vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-12', level_id: 'l-b1', level_code: 'B1', order_num: 12, title: 'Technology & The Future',        grammar_focus: 'Future Perfect & Future Continuous',           vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 610,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-13', level_id: 'l-b1', level_code: 'B1', order_num: 13, title: 'Health, Medicine & Wellbeing',   grammar_focus: 'Mixed conditionals: type 2 + 3',               vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 600,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-14', level_id: 'l-b1', level_code: 'B1', order_num: 14, title: 'Travel & Global Cultures',       grammar_focus: 'Passive reporting: it is said/known/thought',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 610,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-15', level_id: 'l-b1', level_code: 'B1', order_num: 15, title: 'Work, Careers & Ambition',       grammar_focus: 'Emphasis: Cleft sentences — It is X that...',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 610,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-16', level_id: 'l-b1', level_code: 'B1', order_num: 16, title: 'Arts, Film & Literature',        grammar_focus: 'Inversion: Not only / Rarely / Seldom + inversion', vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 610,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-17', level_id: 'l-b1', level_code: 'B1', order_num: 17, title: 'Environment & Climate Action',   grammar_focus: 'Expressing likelihood: likely/bound/due to',   vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 620,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-18', level_id: 'l-b1', level_code: 'B1', order_num: 18, title: 'Media, News & Propaganda',       grammar_focus: 'Noun clauses as subject/object/complement',    vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 620,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-19', level_id: 'l-b1', level_code: 'B1', order_num: 19, title: 'Science, Research & Discovery',  grammar_focus: 'Advanced quantifiers: neither/either/both/all', vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 620,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-20', level_id: 'l-b1', level_code: 'B1', order_num: 20, title: 'Law, Rights & Justice',          grammar_focus: 'Adverbial clauses: wherever/whenever/however',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 620,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-21', level_id: 'l-b1', level_code: 'B1', order_num: 21, title: 'Economics & Money in Society',   grammar_focus: 'Discourse markers: cohesion & text organisation', vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 620,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-22', level_id: 'l-b1', level_code: 'B1', order_num: 22, title: 'Philosophy, Ethics & Values',    grammar_focus: 'Hedging language: tend to / appear to / seem',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 630,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-23', level_id: 'l-b1', level_code: 'B1', order_num: 23, title: 'Global English & Intercultural', grammar_focus: 'Complex sentence structures: reduction',        vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 630,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-24', level_id: 'l-b1', level_code: 'B1', order_num: 24, title: 'Academic Writing & Argumentation', grammar_focus: 'Advanced linkers + paragraph structure',     vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 640,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-25', level_id: 'l-b1', level_code: 'B1', order_num: 25, title: 'Listening & Speaking Strategies', grammar_focus: 'Discourse flow, turn-taking, spoken grammar',  vocab_count: 70, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 630,  sections: { reading: 1, listening: 4, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b1-26', level_id: 'l-b1', level_code: 'B1', order_num: 26, title: 'B1 Final Exam',                   grammar_focus: 'Full B1 assessment: reading, listening, writing', vocab_count: 0, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 1200, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, vocabulary: 0, test: 1 } },
]

// ── B1 Lessons (placeholder structure) ──────────────────────────
function makB1Lessons(moduleId: string, n: number, base: number): EnglishLesson[] {
  const lessons: EnglishLesson[] = []
  const id = (s: string) => `l${base}-${s}`
  // 9 lessons per module: Reading×2, Listening×2, Grammar×2, Writing, Vocab, Test
  lessons.push({ id: id('1'),  module_id: moduleId, order_num: 1, type: 'reading',    title: 'Reading 1',           duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('2'),  module_id: moduleId, order_num: 2, type: 'reading',    title: 'Reading 2',           duration_min: 65, xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('3'),  module_id: moduleId, order_num: 3, type: 'listening',  title: 'Listening 1',         duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('3b'), module_id: moduleId, order_num: 4, type: 'listening',  title: 'Listening 2',         duration_min: 55, xp_reward: 65,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('g1'), module_id: moduleId, order_num: 5, type: 'grammar',    title: 'Grammar 1',           duration_min: 75, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('g2'), module_id: moduleId, order_num: 6, type: 'grammar',    title: 'Grammar 2',           duration_min: 75, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('4'),  module_id: moduleId, order_num: 7, type: 'writing',    title: 'Writing Task',        duration_min: 90, xp_reward: 80,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('v'),  module_id: moduleId, order_num: 8, type: 'vocabulary', title: `70 words · B1 M${n}`, duration_min: 45, xp_reward: 50,  status: 'published', created_at: '', score: null, completed: false })
  lessons.push({ id: id('5'),  module_id: moduleId, order_num: 9, type: 'test',       title: `Module ${n} Final Test`, duration_min: 75, xp_reward: 120, status: 'published', created_at: '', score: null, completed: false })
  return lessons
}

export const MOCK_LESSONS_M_B1_1  = makB1Lessons('m-b1-1',  1,  59)
export const MOCK_LESSONS_M_B1_2  = makB1Lessons('m-b1-2',  2,  60)
export const MOCK_LESSONS_M_B1_3  = makB1Lessons('m-b1-3',  3,  61)
export const MOCK_LESSONS_M_B1_4  = makB1Lessons('m-b1-4',  4,  62)
export const MOCK_LESSONS_M_B1_5  = makB1Lessons('m-b1-5',  5,  63)
export const MOCK_LESSONS_M_B1_6  = makB1Lessons('m-b1-6',  6,  64)
export const MOCK_LESSONS_M_B1_7  = makB1Lessons('m-b1-7',  7,  65)
export const MOCK_LESSONS_M_B1_8  = makB1Lessons('m-b1-8',  8,  66)
export const MOCK_LESSONS_M_B1_9  = makB1Lessons('m-b1-9',  9,  67)
export const MOCK_LESSONS_M_B1_10 = makB1Lessons('m-b1-10', 10, 68)
export const MOCK_LESSONS_M_B1_11 = makB1Lessons('m-b1-11', 11, 69)
export const MOCK_LESSONS_M_B1_12 = makB1Lessons('m-b1-12', 12, 70)
export const MOCK_LESSONS_M_B1_13 = makB1Lessons('m-b1-13', 13, 71)
export const MOCK_LESSONS_M_B1_14 = makB1Lessons('m-b1-14', 14, 72)
export const MOCK_LESSONS_M_B1_15 = makB1Lessons('m-b1-15', 15, 73)
export const MOCK_LESSONS_M_B1_16 = makB1Lessons('m-b1-16', 16, 74)
export const MOCK_LESSONS_M_B1_17 = makB1Lessons('m-b1-17', 17, 75)
export const MOCK_LESSONS_M_B1_18 = makB1Lessons('m-b1-18', 18, 76)
export const MOCK_LESSONS_M_B1_19 = makB1Lessons('m-b1-19', 19, 77)
export const MOCK_LESSONS_M_B1_20 = makB1Lessons('m-b1-20', 20, 78)
export const MOCK_LESSONS_M_B1_21 = makB1Lessons('m-b1-21', 21, 79)
export const MOCK_LESSONS_M_B1_22 = makB1Lessons('m-b1-22', 22, 80)
export const MOCK_LESSONS_M_B1_23 = makB1Lessons('m-b1-23', 23, 81)
export const MOCK_LESSONS_M_B1_24 = makB1Lessons('m-b1-24', 24, 82)
export const MOCK_LESSONS_M_B1_25 = makB1Lessons('m-b1-25', 25, 83)
export const MOCK_LESSONS_M_B1_26: EnglishLesson[] = [
  { id: 'l84-1', module_id: 'm-b1-26', order_num: 1, type: 'reading',   title: 'Reading & Use of English', duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l84-2', module_id: 'm-b1-26', order_num: 2, type: 'listening', title: 'Listening Exam',           duration_min: 90,  xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
  { id: 'l84-3', module_id: 'm-b1-26', order_num: 3, type: 'writing',   title: 'Writing Exam',             duration_min: 120, xp_reward: 400, status: 'published', created_at: '', score: null, completed: false },
]

// ── B2 Upper-Intermediate ────────────────────────────────────────────────────
export const MOCK_B2_MODULES: MockModule[] = [
  { id: 'm-b2-1',  level_id: 'l-b2', level_code: 'B2', order_num: 1,  title: 'Mixed Conditionals & Hypotheticals',       grammar_focus: 'Mixed: if + past perfect, would + inf',              vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 650,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-2',  level_id: 'l-b2', level_code: 'B2', order_num: 2,  title: 'Advanced Modal Verbs',                     grammar_focus: 'must/can\'t/might/should have done — deduction',     vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 650,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-3',  level_id: 'l-b2', level_code: 'B2', order_num: 3,  title: 'Advanced Passive Structures',              grammar_focus: 'Complex passives: appear to be, is thought to have', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 660,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-4',  level_id: 'l-b2', level_code: 'B2', order_num: 4,  title: 'Inversion for Emphasis',                   grammar_focus: 'Not only / Hardly / Never / Little / Rarely + inv', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 660,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-5',  level_id: 'l-b2', level_code: 'B2', order_num: 5,  title: 'Cleft Sentences & Focusing',               grammar_focus: 'It is/was X that... / What I need is...',           vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 660,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-6',  level_id: 'l-b2', level_code: 'B2', order_num: 6,  title: 'Advanced Relative Clauses',                grammar_focus: 'Reduced relatives, preposition + which/whom',        vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 660,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-7',  level_id: 'l-b2', level_code: 'B2', order_num: 7,  title: 'Discourse Markers & Cohesion',             grammar_focus: 'Advanced linkers: nonetheless/thereby/henceforth',  vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 670,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-8',  level_id: 'l-b2', level_code: 'B2', order_num: 8,  title: 'Nominalisation & Academic Style',          grammar_focus: 'Verb → noun: investigate → investigation',          vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 670,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-9',  level_id: 'l-b2', level_code: 'B2', order_num: 9,  title: 'Formal vs Informal Register',              grammar_focus: 'Register shift: spoken→written, informal→formal',   vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 670,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-10', level_id: 'l-b2', level_code: 'B2', order_num: 10, title: 'Advanced Reported Speech',                 grammar_focus: 'Distancing structures: allegedly/reportedly/so-called', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 670,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-11', level_id: 'l-b2', level_code: 'B2', order_num: 11, title: 'Concession, Contrast & Qualification',     grammar_focus: 'Even though / whilst / as opposed to / whereas',    vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-12', level_id: 'l-b2', level_code: 'B2', order_num: 12, title: 'Cause, Effect & Result (Advanced)',        grammar_focus: 'As a consequence / thereby / give rise to',         vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-13', level_id: 'l-b2', level_code: 'B2', order_num: 13, title: 'Business & Professional Communication',    grammar_focus: 'Professional email, report structures, hedging',    vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-14', level_id: 'l-b2', level_code: 'B2', order_num: 14, title: 'Academic Writing: Essays & Reports',       grammar_focus: 'Thesis-support structure, advanced paragraph dev', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 690,  sections: { reading: 2, listening: 2, grammar: 2, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-b2-15', level_id: 'l-b2', level_code: 'B2', order_num: 15, title: 'Global Issues & Environmental Discourse',  grammar_focus: 'Advanced quantifiers + environmental collocations', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-16', level_id: 'l-b2', level_code: 'B2', order_num: 16, title: 'Science, Technology & Innovation',         grammar_focus: 'Speculative grammar + tech discourse markers',      vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-17', level_id: 'l-b2', level_code: 'B2', order_num: 17, title: 'Law, Justice & Society',                   grammar_focus: 'Legal passive structures, formal hedging',          vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-18', level_id: 'l-b2', level_code: 'B2', order_num: 18, title: 'Media, Persuasion & Critical Literacy',    grammar_focus: 'Stance adverbials: reportedly/admittedly',          vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 680,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-19', level_id: 'l-b2', level_code: 'B2', order_num: 19, title: 'Health, Medicine & Psychology',            grammar_focus: 'Expressing evidence: research suggests/indicates',  vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 690,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-20', level_id: 'l-b2', level_code: 'B2', order_num: 20, title: 'Economics & International Trade',          grammar_focus: 'Passive + time clauses in economic discourse',      vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 690,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-21', level_id: 'l-b2', level_code: 'B2', order_num: 21, title: 'Culture, Identity & Globalisation',        grammar_focus: 'Complex concession: for all / much as / albeit',    vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 690,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-22', level_id: 'l-b2', level_code: 'B2', order_num: 22, title: 'IELTS Reading Strategies (B2)',            grammar_focus: 'Skimming, scanning, inference — systematic approach', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 700,  sections: { reading: 4, listening: 1, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-23', level_id: 'l-b2', level_code: 'B2', order_num: 23, title: 'IELTS Listening: B2+ Level',               grammar_focus: 'Paraphrase, prediction, multiple-choice strategies', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 700,  sections: { reading: 1, listening: 4, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-b2-24', level_id: 'l-b2', level_code: 'B2', order_num: 24, title: 'IELTS Writing Task 1 (B2)',                grammar_focus: 'Describing graphs, charts and processes accurately', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 700,  sections: { reading: 1, listening: 1, grammar: 2, writing: 3, vocabulary: 1, test: 1 } },
  { id: 'm-b2-25', level_id: 'l-b2', level_code: 'B2', order_num: 25, title: 'IELTS Writing Task 2 (B2)',                grammar_focus: 'Argument essay: agree/disagree, discuss both views', vocab_count: 80, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 700,  sections: { reading: 1, listening: 1, grammar: 2, writing: 3, vocabulary: 1, test: 1 } },
  { id: 'm-b2-26', level_id: 'l-b2', level_code: 'B2', order_num: 26, title: 'B2 Final Exam',                            grammar_focus: 'Full B2 assessment: IELTS-style reading + writing', vocab_count: 0,  status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 1400, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, vocabulary: 0, test: 0 } },
]

function makB2Lessons(moduleId: string, n: number, base: number): EnglishLesson[] {
  const id = (s: string) => `lb2-${base}-${s}`
  return [
    { id: id('1'),  module_id: moduleId, order_num: 1, type: 'reading',    title: 'Reading 1',               duration_min: 70, xp_reward: 80,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('2'),  module_id: moduleId, order_num: 2, type: 'reading',    title: 'Reading 2',               duration_min: 70, xp_reward: 80,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('3'),  module_id: moduleId, order_num: 3, type: 'listening',  title: 'Listening 1',             duration_min: 60, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('3b'), module_id: moduleId, order_num: 4, type: 'listening',  title: 'Listening 2',             duration_min: 60, xp_reward: 75,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('g1'), module_id: moduleId, order_num: 5, type: 'grammar',    title: 'Grammar 1',               duration_min: 80, xp_reward: 85,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('g2'), module_id: moduleId, order_num: 6, type: 'grammar',    title: 'Grammar 2',               duration_min: 80, xp_reward: 85,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('4'),  module_id: moduleId, order_num: 7, type: 'writing',    title: 'Writing Task',            duration_min: 100, xp_reward: 90, status: 'published', created_at: '', score: null, completed: false },
    { id: id('v'),  module_id: moduleId, order_num: 8, type: 'vocabulary', title: `80 words · B2 M${n}`,    duration_min: 50, xp_reward: 60,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('5'),  module_id: moduleId, order_num: 9, type: 'test',       title: `Module ${n} Final Test`, duration_min: 85, xp_reward: 140, status: 'published', created_at: '', score: null, completed: false },
  ]
}

export const MOCK_LESSONS_M_B2_1  = makB2Lessons('m-b2-1',  1,  1)
export const MOCK_LESSONS_M_B2_2  = makB2Lessons('m-b2-2',  2,  2)
export const MOCK_LESSONS_M_B2_3  = makB2Lessons('m-b2-3',  3,  3)
export const MOCK_LESSONS_M_B2_4  = makB2Lessons('m-b2-4',  4,  4)
export const MOCK_LESSONS_M_B2_5  = makB2Lessons('m-b2-5',  5,  5)
export const MOCK_LESSONS_M_B2_6  = makB2Lessons('m-b2-6',  6,  6)
export const MOCK_LESSONS_M_B2_7  = makB2Lessons('m-b2-7',  7,  7)
export const MOCK_LESSONS_M_B2_8  = makB2Lessons('m-b2-8',  8,  8)
export const MOCK_LESSONS_M_B2_9  = makB2Lessons('m-b2-9',  9,  9)
export const MOCK_LESSONS_M_B2_10 = makB2Lessons('m-b2-10', 10, 10)
export const MOCK_LESSONS_M_B2_11 = makB2Lessons('m-b2-11', 11, 11)
export const MOCK_LESSONS_M_B2_12 = makB2Lessons('m-b2-12', 12, 12)
export const MOCK_LESSONS_M_B2_13 = makB2Lessons('m-b2-13', 13, 13)
export const MOCK_LESSONS_M_B2_14 = makB2Lessons('m-b2-14', 14, 14)
export const MOCK_LESSONS_M_B2_15 = makB2Lessons('m-b2-15', 15, 15)
export const MOCK_LESSONS_M_B2_16 = makB2Lessons('m-b2-16', 16, 16)
export const MOCK_LESSONS_M_B2_17 = makB2Lessons('m-b2-17', 17, 17)
export const MOCK_LESSONS_M_B2_18 = makB2Lessons('m-b2-18', 18, 18)
export const MOCK_LESSONS_M_B2_19 = makB2Lessons('m-b2-19', 19, 19)
export const MOCK_LESSONS_M_B2_20 = makB2Lessons('m-b2-20', 20, 20)
export const MOCK_LESSONS_M_B2_21 = makB2Lessons('m-b2-21', 21, 21)
export const MOCK_LESSONS_M_B2_22 = makB2Lessons('m-b2-22', 22, 22)
export const MOCK_LESSONS_M_B2_23 = makB2Lessons('m-b2-23', 23, 23)
export const MOCK_LESSONS_M_B2_24 = makB2Lessons('m-b2-24', 24, 24)
export const MOCK_LESSONS_M_B2_25 = makB2Lessons('m-b2-25', 25, 25)
export const MOCK_LESSONS_M_B2_26: EnglishLesson[] = [
  { id: 'lb2-26-1', module_id: 'm-b2-26', order_num: 1, type: 'reading',   title: 'IELTS Reading (Full Test)',  duration_min: 120, xp_reward: 467, status: 'published', created_at: '', score: null, completed: false },
  { id: 'lb2-26-2', module_id: 'm-b2-26', order_num: 2, type: 'listening', title: 'IELTS Listening (Full Test)', duration_min: 90, xp_reward: 467, status: 'published', created_at: '', score: null, completed: false },
  { id: 'lb2-26-3', module_id: 'm-b2-26', order_num: 3, type: 'writing',   title: 'IELTS Writing (Task 1+2)',  duration_min: 120, xp_reward: 466, status: 'published', created_at: '', score: null, completed: false },
]

// ── C1 Advanced ────────────────────────────────────────────────────────────────
export const MOCK_C1_MODULES: MockModule[] = [
  { id: 'm-c1-1',  level_id: 'l-c1', level_code: 'C1', order_num: 1,  title: 'Complex Syntax & Sentence Architecture',   grammar_focus: 'Embedded clauses, apposition, parenthetical',       vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 720,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-2',  level_id: 'l-c1', level_code: 'C1', order_num: 2,  title: 'Subjunctive Mood & Formal Grammar',         grammar_focus: 'Subjunctive: I suggest he leave / were to / as if', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 720,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-3',  level_id: 'l-c1', level_code: 'C1', order_num: 3,  title: 'Inversion: Advanced & Literary Patterns',   grammar_focus: 'Not until/Were it not for/So + adj + that',         vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 730,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-4',  level_id: 'l-c1', level_code: 'C1', order_num: 4,  title: 'Ellipsis, Substitution & Cohesion',         grammar_focus: 'Do so / one / the former-the latter / ellipsis',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 730,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-5',  level_id: 'l-c1', level_code: 'C1', order_num: 5,  title: 'Advanced Nominalisation & Abstraction',     grammar_focus: 'Abstract nouns, complex noun phrases, de-verbal',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 730,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-6',  level_id: 'l-c1', level_code: 'C1', order_num: 6,  title: 'Phrasal Verbs: Advanced & Idiomatic Use',   grammar_focus: 'Multi-part phrasal verbs + formal equivalents',     vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 730,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-7',  level_id: 'l-c1', level_code: 'C1', order_num: 7,  title: 'Idioms, Metaphors & Fixed Expressions',     grammar_focus: 'Collocation density, idiom recognition & use',      vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 740,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-8',  level_id: 'l-c1', level_code: 'C1', order_num: 8,  title: 'Academic Vocabulary: AWL & Beyond',         grammar_focus: 'Academic Word List mastery + collocation patterns',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 740,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-9',  level_id: 'l-c1', level_code: 'C1', order_num: 9,  title: 'Register, Style & Tone Mastery',            grammar_focus: 'Formal/informal/neutral: precise register control', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 740,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-10', level_id: 'l-c1', level_code: 'C1', order_num: 10, title: 'Persuasive Writing & Argumentation',        grammar_focus: 'Rhetorical devices, counter-argument, concession',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 750,  sections: { reading: 2, listening: 2, grammar: 2, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-c1-11', level_id: 'l-c1', level_code: 'C1', order_num: 11, title: 'Academic Essay Writing (C1)',                grammar_focus: 'Complex argument structure, hedging, signposting',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 750,  sections: { reading: 2, listening: 1, grammar: 2, writing: 3, vocabulary: 1, test: 1 } },
  { id: 'm-c1-12', level_id: 'l-c1', level_code: 'C1', order_num: 12, title: 'Business Reports & Formal Correspondence',   grammar_focus: 'Executive summary, passive voice, business register', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 750,  sections: { reading: 2, listening: 2, grammar: 2, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-c1-13', level_id: 'l-c1', level_code: 'C1', order_num: 13, title: 'Critical Reading: Inference & Implication',  grammar_focus: 'Identifying stance, bias, implicit meaning',        vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 760,  sections: { reading: 4, listening: 1, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-14', level_id: 'l-c1', level_code: 'C1', order_num: 14, title: 'Listening: Complex Discourse & Lectures',    grammar_focus: 'Inferring attitude, complex spoken grammar patterns', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 760,  sections: { reading: 1, listening: 4, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-15', level_id: 'l-c1', level_code: 'C1', order_num: 15, title: 'Critical Thinking & Analysis',               grammar_focus: 'Logical connectors, evaluative language, analysis',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 760,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-16', level_id: 'l-c1', level_code: 'C1', order_num: 16, title: 'Advanced Conditionals & Counter-factuals',   grammar_focus: 'Were it not / Had it not been / Should you need',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 760,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-17', level_id: 'l-c1', level_code: 'C1', order_num: 17, title: 'Complex Passive & Impersonal Structures',    grammar_focus: 'It is assumed that / to be seen as / passive perfect', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 770,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-18', level_id: 'l-c1', level_code: 'C1', order_num: 18, title: 'Seminars, Presentations & Spoken Discourse', grammar_focus: 'Discourse markers in speech, hedging, vague language', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 770,  sections: { reading: 1, listening: 3, grammar: 1, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-19', level_id: 'l-c1', level_code: 'C1', order_num: 19, title: 'Philosophy, Ethics & Intellectual Debate',   grammar_focus: 'Philosophical registers, abstract argument building',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 770,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-20', level_id: 'l-c1', level_code: 'C1', order_num: 20, title: 'Research Methods & Academic Discourse',      grammar_focus: 'Hedging verbs: suggest/indicate/imply/demonstrate',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 780,  sections: { reading: 2, listening: 2, grammar: 2, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-c1-21', level_id: 'l-c1', level_code: 'C1', order_num: 21, title: 'Literature, Stylistics & Close Reading',     grammar_focus: 'Stylistic devices, foregrounding, narrative voice',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 780,  sections: { reading: 3, listening: 1, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-22', level_id: 'l-c1', level_code: 'C1', order_num: 22, title: 'Law, Human Rights & International Relations', grammar_focus: 'Formal legal passive, conditional structures in law',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 780,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-23', level_id: 'l-c1', level_code: 'C1', order_num: 23, title: 'Advanced Science & Technology Discourse',    grammar_focus: 'Scientific hedging, passive reporting, precision',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 790,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-24', level_id: 'l-c1', level_code: 'C1', order_num: 24, title: 'Media Analysis & Critical Media Literacy',   grammar_focus: 'Evaluative lexis, bias language, stance marking',    vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 790,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-25', level_id: 'l-c1', level_code: 'C1', order_num: 25, title: 'Intercultural Communication & Global English', grammar_focus: 'Pragmatic competence, register in cross-cultural ctx', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 790,  sections: { reading: 2, listening: 2, grammar: 2, writing: 1, vocabulary: 1, test: 1 } },
  { id: 'm-c1-26', level_id: 'l-c1', level_code: 'C1', order_num: 26, title: 'Advanced Debate & Argumentation',             grammar_focus: 'Argument mapping, rhetorical concession, rebuttal',  vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 800,  sections: { reading: 2, listening: 2, grammar: 2, writing: 2, vocabulary: 1, test: 1 } },
  { id: 'm-c1-27', level_id: 'l-c1', level_code: 'C1', order_num: 27, title: 'IELTS Academic Reading: Band 7+',             grammar_focus: 'True/False/NG, matching headings, summary completion', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 820,  sections: { reading: 5, listening: 1, grammar: 1, writing: 1, vocabulary: 0, test: 1 } },
  { id: 'm-c1-28', level_id: 'l-c1', level_code: 'C1', order_num: 28, title: 'IELTS Academic Listening: Band 7+',           grammar_focus: 'Section 4: academic monologue, precise note-taking', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 820,  sections: { reading: 1, listening: 5, grammar: 1, writing: 1, vocabulary: 0, test: 1 } },
  { id: 'm-c1-29', level_id: 'l-c1', level_code: 'C1', order_num: 29, title: 'IELTS Writing Task 1: Band 7+',               grammar_focus: 'Process/map/diagram descriptions + complex language', vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 820,  sections: { reading: 1, listening: 1, grammar: 2, writing: 4, vocabulary: 0, test: 1 } },
  { id: 'm-c1-30', level_id: 'l-c1', level_code: 'C1', order_num: 30, title: 'IELTS Writing Task 2: Band 7+',               grammar_focus: 'Position + reasons + examples + conclusion at C1',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 840,  sections: { reading: 1, listening: 1, grammar: 2, writing: 4, vocabulary: 0, test: 1 } },
  { id: 'm-c1-31', level_id: 'l-c1', level_code: 'C1', order_num: 31, title: 'IELTS Speaking: Band 7+ Fluency',             grammar_focus: 'Fluent speech with minimal hesitation + C1 vocab',   vocab_count: 90, status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 840,  sections: { reading: 1, listening: 2, grammar: 1, writing: 1, vocabulary: 0, test: 1 } },
  { id: 'm-c1-32', level_id: 'l-c1', level_code: 'C1', order_num: 32, title: 'C1 Final Exam',                                grammar_focus: 'Full IELTS Academic simulation: all four skills',     vocab_count: 0,  status: 'published', created_at: '', progress: 0, lessonsCompleted: 0, isLocked: false, xp_total: 1600, sections: { reading: 1, listening: 1, grammar: 0, writing: 1, vocabulary: 0, test: 0 } },
]

function makC1Lessons(moduleId: string, n: number, base: number): EnglishLesson[] {
  const id = (s: string) => `lc1-${base}-${s}`
  return [
    { id: id('1'),  module_id: moduleId, order_num: 1, type: 'reading',    title: 'Reading 1',               duration_min: 80,  xp_reward: 90,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('2'),  module_id: moduleId, order_num: 2, type: 'reading',    title: 'Reading 2',               duration_min: 80,  xp_reward: 90,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('3'),  module_id: moduleId, order_num: 3, type: 'listening',  title: 'Listening 1',             duration_min: 65,  xp_reward: 85,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('3b'), module_id: moduleId, order_num: 4, type: 'listening',  title: 'Listening 2',             duration_min: 65,  xp_reward: 85,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('g1'), module_id: moduleId, order_num: 5, type: 'grammar',    title: 'Grammar 1',               duration_min: 90,  xp_reward: 95,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('g2'), module_id: moduleId, order_num: 6, type: 'grammar',    title: 'Grammar 2',               duration_min: 90,  xp_reward: 95,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('4'),  module_id: moduleId, order_num: 7, type: 'writing',    title: 'Writing Task',            duration_min: 110, xp_reward: 100, status: 'published', created_at: '', score: null, completed: false },
    { id: id('v'),  module_id: moduleId, order_num: 8, type: 'vocabulary', title: `90 words · C1 M${n}`,    duration_min: 55,  xp_reward: 70,  status: 'published', created_at: '', score: null, completed: false },
    { id: id('5'),  module_id: moduleId, order_num: 9, type: 'test',       title: `Module ${n} Final Test`, duration_min: 90,  xp_reward: 160, status: 'published', created_at: '', score: null, completed: false },
  ]
}

export const MOCK_LESSONS_M_C1_1  = makC1Lessons('m-c1-1',  1,  1)
export const MOCK_LESSONS_M_C1_2  = makC1Lessons('m-c1-2',  2,  2)
export const MOCK_LESSONS_M_C1_3  = makC1Lessons('m-c1-3',  3,  3)
export const MOCK_LESSONS_M_C1_4  = makC1Lessons('m-c1-4',  4,  4)
export const MOCK_LESSONS_M_C1_5  = makC1Lessons('m-c1-5',  5,  5)
export const MOCK_LESSONS_M_C1_6  = makC1Lessons('m-c1-6',  6,  6)
export const MOCK_LESSONS_M_C1_7  = makC1Lessons('m-c1-7',  7,  7)
export const MOCK_LESSONS_M_C1_8  = makC1Lessons('m-c1-8',  8,  8)
export const MOCK_LESSONS_M_C1_9  = makC1Lessons('m-c1-9',  9,  9)
export const MOCK_LESSONS_M_C1_10 = makC1Lessons('m-c1-10', 10, 10)
export const MOCK_LESSONS_M_C1_11 = makC1Lessons('m-c1-11', 11, 11)
export const MOCK_LESSONS_M_C1_12 = makC1Lessons('m-c1-12', 12, 12)
export const MOCK_LESSONS_M_C1_13 = makC1Lessons('m-c1-13', 13, 13)
export const MOCK_LESSONS_M_C1_14 = makC1Lessons('m-c1-14', 14, 14)
export const MOCK_LESSONS_M_C1_15 = makC1Lessons('m-c1-15', 15, 15)
export const MOCK_LESSONS_M_C1_16 = makC1Lessons('m-c1-16', 16, 16)
export const MOCK_LESSONS_M_C1_17 = makC1Lessons('m-c1-17', 17, 17)
export const MOCK_LESSONS_M_C1_18 = makC1Lessons('m-c1-18', 18, 18)
export const MOCK_LESSONS_M_C1_19 = makC1Lessons('m-c1-19', 19, 19)
export const MOCK_LESSONS_M_C1_20 = makC1Lessons('m-c1-20', 20, 20)
export const MOCK_LESSONS_M_C1_21 = makC1Lessons('m-c1-21', 21, 21)
export const MOCK_LESSONS_M_C1_22 = makC1Lessons('m-c1-22', 22, 22)
export const MOCK_LESSONS_M_C1_23 = makC1Lessons('m-c1-23', 23, 23)
export const MOCK_LESSONS_M_C1_24 = makC1Lessons('m-c1-24', 24, 24)
export const MOCK_LESSONS_M_C1_25 = makC1Lessons('m-c1-25', 25, 25)
export const MOCK_LESSONS_M_C1_26 = makC1Lessons('m-c1-26', 26, 26)
export const MOCK_LESSONS_M_C1_27 = makC1Lessons('m-c1-27', 27, 27)
export const MOCK_LESSONS_M_C1_28 = makC1Lessons('m-c1-28', 28, 28)
export const MOCK_LESSONS_M_C1_29 = makC1Lessons('m-c1-29', 29, 29)
export const MOCK_LESSONS_M_C1_30 = makC1Lessons('m-c1-30', 30, 30)
export const MOCK_LESSONS_M_C1_31 = makC1Lessons('m-c1-31', 31, 31)
export const MOCK_LESSONS_M_C1_32: EnglishLesson[] = [
  { id: 'lc1-32-1', module_id: 'm-c1-32', order_num: 1, type: 'reading',   title: 'IELTS Reading (Band 7+)',   duration_min: 120, xp_reward: 533, status: 'published', created_at: '', score: null, completed: false },
  { id: 'lc1-32-2', module_id: 'm-c1-32', order_num: 2, type: 'listening', title: 'IELTS Listening (Band 7+)', duration_min: 90,  xp_reward: 534, status: 'published', created_at: '', score: null, completed: false },
  { id: 'lc1-32-3', module_id: 'm-c1-32', order_num: 3, type: 'writing',   title: 'IELTS Writing Task 1+2',   duration_min: 120, xp_reward: 533, status: 'published', created_at: '', score: null, completed: false },
]

// ── Skills ────────────────────────────────────────────────────
export const MOCK_SKILLS: SkillsProgress = { reading: 82, listening: 76, grammar: 74, writing: 71, speaking: 58 }

// ── Questions ─────────────────────────────────────────────────
export const MOCK_QUESTIONS: EnglishQuestion[] = [
  { id: 'q-1', lesson_id: 'l1-1', order_num: 1, type: 'multiple_choice', question_text: 'Where is Aizhan from?', options: ['Astana', 'Almaty, Kazakhstan', 'Madrid', 'London'], correct_answer: 'B', explanation_ru: 'В тексте: "I am from Almaty."', xp_value: 5 },
  { id: 'q-2', lesson_id: 'l1-1', order_num: 2, type: 'true_false',      question_text: 'Aizhan has a brother named Dias.',                                                     options: ['True', 'False'], correct_answer: 'A', explanation_ru: 'В тексте: "My brother\'s name is Dias."', xp_value: 5 },
  { id: 'q-3', lesson_id: 'l1-1', order_num: 3, type: 'fill_blank',      question_text: 'She ___ 18 years old.',                                                               correct_answer: 'is', explanation_ru: 'She → is (третье лицо ед. числа)', xp_value: 5 },
]

// ── Vocabulary ────────────────────────────────────────────────
export const MOCK_VOCAB_WORDS: VocabWord[] = [
  { id: 'w-1', word_en: 'hello',     phonetic: '/həˈloʊ/',    translation_ru: 'привет',    level_code: 'A1', part_of_speech: 'interjection', example_sentence: 'Hello, my name is Aizhan.' },
  { id: 'w-2', word_en: 'family',    phonetic: '/ˈfæmɪli/',   translation_ru: 'семья',      level_code: 'A1', part_of_speech: 'noun',         example_sentence: 'My family has four people.' },
  { id: 'w-3', word_en: 'breakfast', phonetic: '/ˈbrekfəst/', translation_ru: 'завтрак',    level_code: 'A1', part_of_speech: 'noun',         example_sentence: 'I eat breakfast at 7 o\'clock.' },
  { id: 'w-4', word_en: 'work',      phonetic: '/wɜːrk/',     translation_ru: 'работа',     level_code: 'A1', part_of_speech: 'noun/verb',    example_sentence: 'She works in a school.' },
  { id: 'w-5', word_en: 'beautiful', phonetic: '/ˈbjuːtɪfl/', translation_ru: 'красивый',   level_code: 'A1', part_of_speech: 'adjective',    example_sentence: 'This is a beautiful city.' },
]

export const MOCK_USER_VOCAB: UserVocabEntry[] = [
  { id: 'uv-1', user_id: 'user-mock-1', word_id: 'w-1', word: MOCK_VOCAB_WORDS[0], added_at: '2026-04-10T10:00:00Z', mastery_level: 4, ease_factor: 2.5, interval_days: 14, next_review_at: '2026-05-25T10:00:00Z', review_count: 6 },
  { id: 'uv-2', user_id: 'user-mock-1', word_id: 'w-2', word: MOCK_VOCAB_WORDS[1], added_at: '2026-04-11T10:00:00Z', mastery_level: 3, ease_factor: 2.3, interval_days: 7,  next_review_at: '2026-05-13T10:00:00Z', review_count: 4 },
  { id: 'uv-3', user_id: 'user-mock-1', word_id: 'w-3', word: MOCK_VOCAB_WORDS[2], added_at: '2026-04-12T10:00:00Z', mastery_level: 1, ease_factor: 2.0, interval_days: 1,  next_review_at: '2026-05-12T08:00:00Z', review_count: 2 },
  { id: 'uv-4', user_id: 'user-mock-1', word_id: 'w-4', word: MOCK_VOCAB_WORDS[3], added_at: '2026-04-15T10:00:00Z', mastery_level: 2, ease_factor: 2.1, interval_days: 3,  next_review_at: '2026-05-12T06:00:00Z', review_count: 3 },
  { id: 'uv-5', user_id: 'user-mock-1', word_id: 'w-5', word: MOCK_VOCAB_WORDS[4], added_at: '2026-04-20T10:00:00Z', mastery_level: 0, ease_factor: 2.5, interval_days: 1,  next_review_at: '2026-05-11T10:00:00Z', review_count: 0 },
]

// ── Groups ────────────────────────────────────────────────────
export const MOCK_GROUPS: EnglishGroup[] = [
  { id: 'g-1', tenant_id: 'tenant-zku', teacher_id: 'teacher-mock-1', name: '3-А Математика',   join_code: '3A-MTM-2026', level_code: 'B1', students_count: 16, avg_progress: 71, created_at: '2026-09-01T08:00:00Z' },
  { id: 'g-2', tenant_id: 'tenant-zku', teacher_id: 'teacher-mock-1', name: '2-Б Информатика',  join_code: '2B-CS-2026',  level_code: 'A2', students_count: 14, avg_progress: 58, created_at: '2026-09-01T08:00:00Z' },
  { id: 'g-3', tenant_id: 'tenant-zku', teacher_id: 'teacher-mock-1', name: '4-В Экономика',    join_code: '4V-ECO-2026', level_code: 'B2', students_count: 12, avg_progress: 83, created_at: '2026-09-01T08:00:00Z' },
]

export const MOCK_STUDENTS: StudentInGroup[] = [
  { id: 's-1', full_name: 'Алишер Нурмаков',  current_level: 'B1', total_xp: 4200, current_streak: 12, progress: 92, last_active_at: new Date().toISOString(), status: 'active' },
  { id: 's-2', full_name: 'Айдана Сейткали',  current_level: 'B1', total_xp: 3800, current_streak: 8,  progress: 88, last_active_at: new Date().toISOString(), status: 'active' },
  { id: 's-3', full_name: 'Бекзат Ержанов',   current_level: 'B1', total_xp: 3500, current_streak: 5,  progress: 85, last_active_at: new Date().toISOString(), status: 'active' },
  { id: 's-4', full_name: 'Гүлнәр Ахметова', current_level: 'B1', total_xp: 3200, current_streak: 3,  progress: 78, last_active_at: new Date(Date.now() - 86400000 * 2).toISOString(), status: 'at_risk' },
  { id: 's-5', full_name: 'Думан Сатыбалды',  current_level: 'A2', total_xp: 2800, current_streak: 0,  progress: 71, last_active_at: new Date(Date.now() - 86400000 * 5).toISOString(), status: 'at_risk' },
  { id: 's-6', full_name: 'Еркебулан Жаксы',  current_level: 'B1', total_xp: 4500, current_streak: 21, progress: 95, last_active_at: new Date().toISOString(), status: 'active' },
]

// ── Assignments ───────────────────────────────────────────────
export const MOCK_ASSIGNMENTS: EnglishAssignment[] = [
  { id: 'a-1', teacher_id: 'teacher-mock-1', group_id: 'g-1', lesson_id: 'l4-3', title: 'Grammar: Present Simple', deadline_at: '2026-05-15T23:59:00Z', min_score: 75, created_at: '2026-05-10T09:00:00Z', lesson_title: 'Present Simple sentences', group_name: '3-А', submissions_count: 10, students_count: 16 },
  { id: 'a-2', teacher_id: 'teacher-mock-1', group_id: 'g-2', module_id: 'm-4',  title: 'Module 4 completion',    deadline_at: '2026-05-20T23:59:00Z', min_score: 80, created_at: '2026-05-08T10:00:00Z', group_name: '2-Б', submissions_count: 8,  students_count: 14 },
]

// ── Achievements ──────────────────────────────────────────────
export const MOCK_ACHIEVEMENTS = [
  { id: 'a-1', code: 'first_lesson',    title: 'Первый шаг',     description: 'Завершил первый урок',      icon: '🎯', earned: true,  earned_at: '2026-04-10' },
  { id: 'a-2', code: 'streak_7',        title: 'Неделя подряд',  description: '7 дней подряд',             icon: '🔥', earned: true,  earned_at: '2026-05-12' },
  { id: 'a-3', code: 'perfect_score',   title: 'Отличник',       description: '100% на любом уроке',       icon: '⭐', earned: true,  earned_at: '2026-05-11' },
  { id: 'a-4', code: 'module_complete', title: 'Модуль пройден', description: 'Завершил первый модуль',    icon: '🏆', earned: true,  earned_at: '2026-05-10' },
  { id: 'a-5', code: 'vocab_100',       title: 'Словарник',      description: 'Выучил 100 слов',           icon: '📚', earned: false, earned_at: null },
  { id: 'a-6', code: 'streak_30',       title: 'Месяц подряд',   description: '30 дней занятий без пауз',  icon: '💎', earned: false, earned_at: null },
]

// ── Recent activity ───────────────────────────────────────────
export const MOCK_ACTIVITY = [
  { id: 'act-1', type: 'lesson', title: 'Listening: Online video call',  xp: 55,  score: 100, date: '2026-05-12T09:30:00Z' },
  { id: 'act-2', type: 'lesson', title: 'Reading: Meet new friends!',    xp: 60,  score: 95,  date: '2026-05-11T10:00:00Z' },
  { id: 'act-3', type: 'vocab',  title: '5 слов изучено',               xp: 25,  score: null, date: '2026-05-11T08:00:00Z' },
  { id: 'act-4', type: 'lesson', title: 'Module 1 Final Test',           xp: 100, score: 96,  date: '2026-05-10T14:00:00Z' },
]

// ── Leaderboard ───────────────────────────────────────────────
export const MOCK_LEADERBOARD = [
  { rank: 1, name: 'Зарина М.',    xp: 5200, streak: 30, level: 'B2' as const, isMe: false },
  { rank: 2, name: 'Еркебулан Ж.', xp: 4500, streak: 21, level: 'B1' as const, isMe: false },
  { rank: 3, name: 'Алишер Н.',    xp: 4200, streak: 12, level: 'B1' as const, isMe: false },
  { rank: 4, name: 'Данияр Е.',    xp: 2340, streak: 7,  level: 'A1' as const, isMe: true  },
  { rank: 5, name: 'Айдана С.',    xp: 3800, streak: 8,  level: 'B1' as const, isMe: false },
]

// ── Certificates ──────────────────────────────────────────────
export const MOCK_CERTIFICATES = [
  { id: 'c-1', type: 'module', level_code: 'A1', module_title: 'Hello, world!', score: 96, issued_at: '2026-05-10T14:00:00Z' },
  { id: 'c-2', type: 'module', level_code: 'A1', module_title: 'My family',     score: 91, issued_at: '2026-04-28T11:00:00Z' },
]

// ── Writing Coach ─────────────────────────────────────────────
export const MOCK_WRITING_TYPES = [
  { id: 'email',       icon: '📧', name: 'Email',       desc: 'Деловые и личные письма',       tasks_count: 24, color: '#1B8FC4', bg: '#E6F1FB' },
  { id: 'essay',       icon: '📝', name: 'Essay',       desc: 'Эссе для IELTS/TOEFL',          tasks_count: 18, color: '#534AB7', bg: '#EDEAFD' },
  { id: 'letter',      icon: '✉️', name: 'Letter',      desc: 'Формальные и неформальные',     tasks_count: 16, color: '#1D9E75', bg: '#E8F8F3' },
  { id: 'story',       icon: '📖', name: 'Story',       desc: 'Творческое письмо, истории',    tasks_count: 12, color: '#EF9F27', bg: '#FEF3E0' },
  { id: 'review',      icon: '⭐', name: 'Review',      desc: 'Отзывы и обзоры',               tasks_count: 10, color: '#D85A30', bg: '#FDEBE6' },
  { id: 'description', icon: '🎨', name: 'Description', desc: 'Описания людей, мест, событий', tasks_count: 14, color: '#0F766E', bg: '#CCFBF1' },
]

export const MOCK_MY_WRITINGS = [
  { id: 'w-1', type: 'email',  topic: 'Request for exam retake',   date: '2026-05-10', status: 'reviewed' as const, score: 88 },
  { id: 'w-2', type: 'essay',  topic: 'Technology in education',   date: '2026-05-08', status: 'sent'     as const, score: null },
  { id: 'w-3', type: 'letter', topic: 'Thank you letter',          date: '2026-05-05', status: 'draft'    as const, score: null },
]

export const MOCK_WRITING_SKILLS = {
  grammar:    78,
  vocabulary: 72,
  structure:  85,
  coherence:  68,
  style:      71,
}

export const MOCK_WRITING_TASK_EMAIL = {
  id: 'task-email-1',
  type: 'email',
  title: 'Email to professor',
  prompt: 'Напиши email преподавателю с просьбой о пересдаче экзамена. Объясни причину пропуска и предложи удобное время.',
  word_min: 100,
  word_max: 150,
  structure_hints: ['Приветствие', 'Причина обращения', 'Конкретная просьба', 'Предложение времени', 'Прощание'],
  phrase_bank: [
    'Dear Professor [Name]',
    'I am writing to request',
    'Due to [reason]',
    'I was unable to attend',
    'Would it be possible to',
    'I would be grateful if',
    'Please let me know',
    'I look forward to hearing from you',
    'Thank you for your understanding',
    'Best regards',
    'Yours sincerely',
    'I apologize for any inconvenience',
    'At your earliest convenience',
    'If you have any questions',
    'I appreciate your time',
  ],
}

// ── Admin stats ───────────────────────────────────────────────
export const MOCK_ADMIN_STATS = {
  totalStudents: 1842, totalTeachers: 48, totalLessons: 247,
  activeGroups: 124, avgScore: 78, dailyActive: 340,
  tenants: [
    { code: 'khamadi', name: 'KHAMADI English', students: 1540, teachers: 12 },
    { code: 'zku',     name: 'ЗКУ',             students: 302,  teachers: 36 },
  ],
  contentStats: { levels: 5, modules: 120, lessons: 247, questions: 1850, words: 2400 },
}
