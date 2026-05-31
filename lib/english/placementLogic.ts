import type { PlacementQuestion } from './placementQuestions'

export type CEFRLevel = 'Beginner' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1'

export interface LevelScore {
  correct: number
  total: number
  passed: boolean
}

export interface PlacementResult {
  level: CEFRLevel
  levelName: string
  scores: Record<'A1' | 'A2' | 'B1' | 'B2' | 'C1', LevelScore>
  totalCorrect: number
  totalAnswered: number
  description: string
  recommendedCourseUrl: string
}

const PASSING = 4

const LEVEL_NAMES: Record<CEFRLevel, string> = {
  Beginner: 'Beginner — Начинающий',
  A1:       'A1 — Базовый',
  A2:       'A2 — Ниже среднего',
  B1:       'B1 — Средний',
  B2:       'B2 — Выше среднего',
  C1:       'C1 — Продвинутый',
}

const DESCRIPTIONS: Record<CEFRLevel, string> = {
  Beginner: 'Ты только начинаешь изучать английский. Рекомендуем начать с самых основ курса A1.',
  A1:       'Понимаешь простые фразы и базовые выражения. Следующий шаг — углубить базу до A2.',
  A2:       'Можешь общаться на простые темы и понимать базовые тексты. Самое время переходить к B1.',
  B1:       'Уверенно общаешься на бытовые темы. Готов к B2 — уровню для IELTS 6.0.',
  B2:       'Отлично! Свободно говоришь на большинство тем. Дальше — C1 (Advanced).',
  C1:       'Превосходно! Владеешь языком на профессиональном уровне.',
}

export function calculatePlacementLevel(
  answers: { questionId: number; isCorrect: boolean }[],
  questions: PlacementQuestion[]
): PlacementResult {
  const scores: Record<'A1' | 'A2' | 'B1' | 'B2' | 'C1', LevelScore> = {
    A1: { correct: 0, total: 0, passed: false },
    A2: { correct: 0, total: 0, passed: false },
    B1: { correct: 0, total: 0, passed: false },
    B2: { correct: 0, total: 0, passed: false },
    C1: { correct: 0, total: 0, passed: false },
  }

  for (const answer of answers) {
    const q = questions.find(q => q.id === answer.questionId)
    if (!q) continue
    scores[q.level].total++
    if (answer.isCorrect) scores[q.level].correct++
  }

  for (const lv of ['A1', 'A2', 'B1', 'B2', 'C1'] as const) {
    scores[lv].passed = scores[lv].correct >= PASSING
  }

  let level: CEFRLevel = 'Beginner'
  if (scores.A1.passed) level = 'A1'
  if (scores.A2.passed) level = 'A2'
  if (scores.B1.passed) level = 'B1'
  if (scores.B2.passed) level = 'B2'
  if (scores.C1.passed) level = 'C1'

  const courseCode = level === 'Beginner' ? 'a1' : level.toLowerCase()

  return {
    level,
    levelName: LEVEL_NAMES[level],
    scores,
    totalCorrect: answers.filter(a => a.isCorrect).length,
    totalAnswered: answers.length,
    description: DESCRIPTIONS[level],
    recommendedCourseUrl: `/english/zku/student/course/${courseCode}`,
  }
}

export function checkAnswer(
  question: PlacementQuestion,
  userAnswer: number | string
): boolean {
  if (!question) return false
  if (question.type === 'word_order') {
    if (typeof userAnswer !== 'string') return false
    return userAnswer.trim().toLowerCase() === String(question.correct).toLowerCase()
  }
  return userAnswer === question.correct
}

export function getNextLevel(
  current: 'A1' | 'A2' | 'B1' | 'B2' | 'C1'
): 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | null {
  const order: Array<'A1' | 'A2' | 'B1' | 'B2' | 'C1'> = ['A1', 'A2', 'B1', 'B2', 'C1']
  const idx = order.indexOf(current)
  return idx < order.length - 1 ? order[idx + 1] : null
}