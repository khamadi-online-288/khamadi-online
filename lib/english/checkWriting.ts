export interface WritingTask {
  word_min: number
  word_max: number
  phrase_bank: string[]
}

export interface WritingCheckResult {
  words: number
  word_count_ok: boolean
  has_greeting: boolean
  has_closing: boolean
  phrases_used: number
  score: number
  feedback: string[]
}

export function checkWriting(text: string, task: WritingTask): WritingCheckResult {
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const word_count_ok = words >= task.word_min && words <= task.word_max
  const has_greeting  = /^(Dear|Hi|Hello|Good morning|Good afternoon|To whom)/i.test(text.trim())
  const has_closing   = /(Best regards|Yours sincerely|Kind regards|Sincerely|Thanks|Thank you)/i.test(text)
  const phrases_used  = task.phrase_bank.filter(p => text.toLowerCase().includes(p.toLowerCase())).length

  const feedback: string[] = []
  if (!word_count_ok) feedback.push(`Слов: ${words}. Нужно от ${task.word_min} до ${task.word_max}.`)
  if (!has_greeting)  feedback.push('Добавь приветствие в начале (Dear / Hi / Hello).')
  if (!has_closing)   feedback.push('Добавь прощание в конце (Best regards / Sincerely).')
  if (phrases_used < 2) feedback.push('Используй больше фраз из банка выражений.')

  const checks = [word_count_ok, has_greeting, has_closing, phrases_used >= 2]
  const score = Math.round((checks.filter(Boolean).length / checks.length) * 100)

  return { words, word_count_ok, has_greeting, has_closing, phrases_used, score, feedback }
}
