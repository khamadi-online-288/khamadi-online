export async function analyzeStudentProgress(data: {
  studentName: string
  progressPercent: number
  averageScore: number
  attendancePercent: number
  weakModules: string[]
  strongModules: string[]
  lastSeen: string | null
}): Promise<string> {
  const prompt = `Ты — AI ассистент образовательной платформы KHAMADI ONLINE (курсы английского языка).
Проанализируй данные студента и дай персональные рекомендации на русском языке.

Студент: ${data.studentName}
Прогресс: ${data.progressPercent}% | Средний балл: ${data.averageScore}% | Посещаемость: ${data.attendancePercent}%
Слабые модули: ${data.weakModules.join(', ') || 'нет данных'}
Сильные модули: ${data.strongModules.join(', ') || 'нет данных'}
Последняя активность: ${data.lastSeen ? new Date(data.lastSeen).toLocaleDateString('ru-RU') : 'нет данных'}

Дай краткий анализ (3-4 предложения) и конкретные рекомендации преподавателю.`

  const resp = await fetch('/api/english/ai-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens: 500 }),
  })
  const json = await resp.json()
  return json?.text ?? 'Не удалось получить анализ.'
}

export async function analyzePlatformHealth(data: {
  totalStudents: number
  activeToday: number
  avgProgress: number
  avgScore: number
  atRiskCount: number
  certificatesIssued: number
}): Promise<string> {
  const prompt = `Ты — AI ассистент образовательной платформы KHAMADI ONLINE (курсы английского языка).
Проанализируй состояние платформы и дай рекомендации администратору на русском языке.

Студентов: ${data.totalStudents} | Активны сегодня: ${data.activeToday}
Средний прогресс: ${data.avgProgress}% | Средний балл: ${data.avgScore}%
Группа риска (7+ дней без активности): ${data.atRiskCount}
Сертификатов выдано: ${data.certificatesIssued}

Дай краткий анализ трендов (4-5 предложений) и рекомендации для улучшения показателей.`

  const resp = await fetch('/api/english/ai-proxy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, maxTokens: 600 }),
  })
  const json = await resp.json()
  return json?.text ?? 'Не удалось получить анализ.'
}
