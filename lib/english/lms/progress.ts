import type { LMSProgress, LMSGrade } from './types'

export function calculateCourseProgress(progresses: LMSProgress[]): number {
  if (!progresses.length) return 0
  const completed = progresses.filter(p => p.status === 'completed').length
  return Math.round((completed / progresses.length) * 100)
}

export function calculateAverageScore(grades: LMSGrade[]): number {
  const scored = grades.filter(g => g.score != null && g.max_score > 0)
  if (!scored.length) return 0
  const total = scored.reduce((sum, g) => sum + ((g.score! / g.max_score) * 100), 0)
  return Math.round(total / scored.length)
}

export function isAtRisk(lastSeenAt: string | null | undefined, thresholdDays = 7): boolean {
  if (!lastSeenAt) return true
  const diff = Date.now() - new Date(lastSeenAt).getTime()
  return diff > thresholdDays * 24 * 60 * 60 * 1000
}

export function getCompletionStatus(progresses: LMSProgress[]): 'not_started' | 'in_progress' | 'completed' {
  if (!progresses.length) return 'not_started'
  const completed = progresses.filter(p => p.status === 'completed').length
  if (completed === 0) return 'not_started'
  if (completed === progresses.length) return 'completed'
  return 'in_progress'
}

export function formatTimeSpent(seconds: number): string {
  if (seconds < 60) return `${seconds}с`
  if (seconds < 3600) return `${Math.round(seconds / 60)}м`
  return `${(seconds / 3600).toFixed(1)}ч`
}

export function getAttendancePercent(records: { status: string }[]): number {
  if (!records.length) return 0
  const present = records.filter(r => r.status === 'present' || r.status === 'late').length
  return Math.round((present / records.length) * 100)
}

export function progressColor(pct: number): string {
  if (pct >= 70) return '#10b981'
  if (pct >= 40) return '#f59e0b'
  return '#ef4444'
}
