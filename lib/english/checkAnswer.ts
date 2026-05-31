import type { QuestionType } from './types'

export function checkAnswer(
  userAnswer: string,
  correctAnswer: string,
  type: QuestionType = 'multiple_choice',
): boolean {
  if (type === 'multiple_choice' || type === 'true_false') {
    return userAnswer.trim().toUpperCase() === correctAnswer.trim().toUpperCase()
  }
  if (type === 'fill_blank') {
    return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
  }
  return false
}

export function calcScore(correct: number, total: number): number {
  if (total === 0) return 0
  return Math.round((correct / total) * 100)
}

export function checkWriting(text: string, minWords = 50): { pass: boolean; wordCount: number } {
  const words = text.trim().split(/\s+/).filter(Boolean)
  return { pass: words.length >= minWords, wordCount: words.length }
}
