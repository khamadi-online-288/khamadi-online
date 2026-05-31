import { XP_PER_CORRECT, XP_PERFECT_BONUS, XP_LESSON_BASE } from './constants'

export function calcXP(score: number, totalQuestions: number): number {
  const correct = Math.round((score / 100) * totalQuestions)
  let xp = correct * XP_PER_CORRECT
  if (score === 100) xp += XP_PERFECT_BONUS
  xp += Math.floor((score / 100) * XP_LESSON_BASE)
  return xp
}

export function xpLevelInfo(xp: number): { level: number; title: string; progress: number; next: number } {
  const thresholds = [0, 500, 1200, 2500, 4500, 7000, 10000, 15000, 22000, 30000]
  const titles = ['Новичок', 'Ученик', 'Студент', 'Практик', 'Знаток', 'Эксперт', 'Мастер', 'Профи', 'Гуру', 'Легенда']
  let lv = thresholds.findIndex((t) => xp < t)
  if (lv === -1) lv = thresholds.length - 1
  if (lv === 0) lv = 1
  const cur = thresholds[lv - 1] ?? 0
  const next = thresholds[lv] ?? thresholds[thresholds.length - 1]
  const progress = Math.round(((xp - cur) / (next - cur)) * 100)
  return { level: lv, title: titles[lv - 1] ?? 'Легенда', progress, next }
}
