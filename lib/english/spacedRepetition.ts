export type ReviewGrade = 0 | 1 | 2 | 3 | 4 | 5

export interface SM2Result {
  ease_factor: number
  interval_days: number
  next_review_at: string
  mastery_level: number
}

export function sm2Review(
  grade: ReviewGrade,
  easeFactor: number,
  intervalDays: number,
  masteryLevel: number,
): SM2Result {
  let ef = easeFactor + (0.1 - (5 - grade) * (0.08 + (5 - grade) * 0.02))
  if (ef < 1.3) ef = 1.3

  let interval: number
  if (grade < 3) {
    interval = 1
  } else if (intervalDays <= 1) {
    interval = 6
  } else {
    interval = Math.round(intervalDays * ef)
  }

  const mastery = grade >= 3 ? Math.min(5, masteryLevel + 1) : Math.max(0, masteryLevel - 1)
  const nextReview = new Date()
  nextReview.setDate(nextReview.getDate() + interval)

  return {
    ease_factor: Math.round(ef * 100) / 100,
    interval_days: interval,
    next_review_at: nextReview.toISOString(),
    mastery_level: mastery,
  }
}

export function isDue(nextReviewAt: string | null | undefined): boolean {
  if (!nextReviewAt) return true
  return new Date(nextReviewAt) <= new Date()
}
