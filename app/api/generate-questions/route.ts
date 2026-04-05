import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const subject = String(body.subject)
    const count = Number(body.count)
    const subjectId = Number(body.subjectId)

    let prompt = ''

    if (subject === 'Оқу сауаттылығы') {
      prompt = `You are a Kazakh UBT 2026 exam expert. Create ${count} reading comprehension questions in Kazakh language.

CRITICAL: Return ONLY a valid JSON array. No other text before or after. No markdown.

Each question MUST have context_text (reading passage, minimum 100 words in Kazakh).
Group 2-3 questions around the same passage.

[
  {
    "question_text": "Мәтін бойынша сұрақ",
    "context_text": "Бұл жерде ұзын қазақша мәтін болады. Кемінде 100 сөз болуы керек.",
    "option_a": "Бірінші жауап",
    "option_b": "Екінші жауап",
    "option_c": "Үшінші жауап",
    "option_d": "Төртінші жауап",
    "correct_answer": "A",
    "explanation": "Түсіндірме",
    "points": 1
  }
]`

    } else if (subjectId === 4 || subjectId === 5) {
      prompt = `You are a Kazakh UBT 2026 exam expert. Create ${count} questions for ${subject} subject in Kazakh language.

CRITICAL: Return ONLY a valid JSON array. No other text before or after. No markdown.

First 30 questions: single correct answer (is_multiple: false, points: 1, correct_answers: null)
Last 10 questions: two correct answers (is_multiple: true, points: 2, correct_answers: ["A","C"])

[
  {
    "question_text": "Сұрақ мәтіні",
    "context_text": "",
    "option_a": "А нұсқасы",
    "option_b": "Б нұсқасы",
    "option_c": "В нұсқасы",
    "option_d": "Г нұсқасы",
    "correct_answer": "A",
    "correct_answers": null,
    "is_multiple": false,
    "explanation": "Түсіндірме",
    "points": 1
  }
]`

    } else {
      prompt = `You are a Kazakh UBT 2026 exam expert. Create ${count} questions for ${subject} subject in Kazakh language.

CRITICAL: Return ONLY a valid JSON array. No other text before or after. No markdown.

[
  {
    "question_text": "Сұрақ мәтіні",
    "context_text": "",
    "option_a": "А нұсқасы",
    "option_b": "Б нұсқасы",
    "option_c": "В нұсқасы",
    "option_d": "Г нұсқасы",
    "correct_answer": "A",
    "explanation": "Түсіндірме",
    "points": 1
  }
]`
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 8000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error('Anthropic error:', data.error)
      return NextResponse.json({ error: data.error.message }, { status: 500 })
    }

    const text = data.content?.[0]?.text || '[]'

    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      console.error('No JSON found:', text.substring(0, 300))
      return NextResponse.json({ error: 'JSON табылмады' }, { status: 500 })
    }

    const questions = JSON.parse(jsonMatch[0])

    const normalized = questions.map((q: any, i: number) => ({
      id: `ai_${subjectId}_${i}_${Date.now()}`,
      question_text: q.question_text || '',
      option_a: q.option_a || '',
      option_b: q.option_b || '',
      option_c: q.option_c || '',
      option_d: q.option_d || '',
      correct_answer: q.correct_answer || 'A',
      correct_answers: q.correct_answers || null,
      is_multiple: q.is_multiple || false,
      explanation: q.explanation || '',
      context_text: q.context_text || '',
      points: q.points || 1,
      subject_id: subjectId,
      variant_id: 99,
    }))

    return NextResponse.json({ questions: normalized })
  } catch (error: any) {
    console.error('Generate error:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}