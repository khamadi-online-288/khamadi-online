import type { CEFRLevel, LessonType } from './types'

export const CEFR_LEVELS: { code: CEFRLevel; name: string; color: string; bg: string; order: number }[] = [
  { code: 'A1', name: 'Beginner',           color: '#1D9E75', bg: '#E8F8F3', order: 1 },
  { code: 'A2', name: 'Pre-Intermediate',   color: '#EF9F27', bg: '#FEF3E0', order: 2 },
  { code: 'B1', name: 'Intermediate',       color: '#1B8FC4', bg: '#E6F1FB', order: 3 },
  { code: 'B2', name: 'Upper-Intermediate', color: '#534AB7', bg: '#EDEAFD', order: 4 },
  { code: 'C1', name: 'Advanced',           color: '#D85A30', bg: '#FDEBE6', order: 5 },
]

export const LESSON_TYPES: {
  type: LessonType; label: string; icon: string; color: string; bg: string
}[] = [
  { type: 'reading',   label: 'Reading',     icon: '📖', color: '#1D9E75', bg: '#E8F8F3' },
  { type: 'listening', label: 'Listening',   icon: '🎧', color: '#EF9F27', bg: '#FEF3E0' },
  { type: 'grammar',   label: 'Grammar',     icon: '✏️', color: '#1B8FC4', bg: '#E6F1FB' },
  { type: 'writing',   label: 'Writing',     icon: '📝', color: '#534AB7', bg: '#EDEAFD' },
  { type: 'test',      label: 'Module Test', icon: '⭐', color: '#1B3A6B', bg: '#EBF0F8' },
]

export const XP_PER_CORRECT = 5
export const XP_PERFECT_BONUS = 25
export const XP_LESSON_BASE = 50

export const A1_MODULE_TITLES = [
  { order: 1,  title: 'Hello, world!',       grammar: 'Articles, am/is/are' },
  { order: 2,  title: 'My family',           grammar: 'have/has, possessive' },
  { order: 3,  title: 'My things',           grammar: 'this/that/these/those' },
  { order: 4,  title: 'My day',              grammar: 'Present Simple' },
  { order: 5,  title: "I can / I can't",     grammar: "can/can't" },
  { order: 6,  title: 'My hobbies',          grammar: 'Present Simple he/she' },
  { order: 7,  title: 'Food and drinks',     grammar: 'some/any' },
  { order: 8,  title: 'My home',             grammar: 'there is/are' },
  { order: 9,  title: 'Right now',           grammar: 'Present Continuous' },
  { order: 10, title: 'Yesterday',           grammar: 'Past Simple was/were' },
  { order: 11, title: 'Last weekend',        grammar: 'Past Simple regular' },
  { order: 12, title: 'Travel and places',   grammar: 'prepositions' },
  { order: 13, title: 'Numbers and money',   grammar: 'numbers up to 1000' },
  { order: 14, title: 'Weather and clothes', grammar: 'adjectives' },
  { order: 15, title: 'Future plans',        grammar: 'going to' },
  { order: 16, title: 'Final review',        grammar: 'все темы A1' },
]
