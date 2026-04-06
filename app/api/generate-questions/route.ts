export const maxDuration = 60

import { NextRequest, NextResponse } from 'next/server'

type AIQuestion = {
  question_type?: string
  question_text?: string
  context_text?: string
  option_a?: string
  option_b?: string
  option_c?: string
  option_d?: string
  option_e?: string
  option_f?: string
  option_g?: string
  correct_answer?: string
  correct_answers?: string[] | null
  is_multiple?: boolean
  explanation?: string
  points?: number
}

function buildPrompt(subject: string, count: number, subjectId: number) {
  if (subject === 'Оқу сауаттылығы') {
    return `You are an expert UBT exam constructor for Kazakhstan.
Create EXACTLY ${count} reading comprehension questions in Kazakh language.
Return ONLY a valid JSON array. No markdown. No extra text.

Rules:
- context_text: minimum 120 words in Kazakh
- 2-3 questions may share one passage
- options: only A, B, C, D
- is_multiple: false
- correct_answers: null
- points: 1
- YOU MUST RETURN EXACTLY ${count} ITEMS IN THE ARRAY

[{"question_type":"reading","question_text":"...","context_text":"...","option_a":"...","option_b":"...","option_c":"...","option_d":"...","option_e":"","option_f":"","option_g":"","correct_answer":"A","correct_answers":null,"is_multiple":false,"points":1,"explanation":"..."}]`
  }

  if (subjectId === 4 || subjectId === 5) {
    return `You are an expert UBT exam constructor for Kazakhstan.
Create EXACTLY ${count} questions for "${subject}" in Kazakh language.
Return ONLY a valid JSON array. No markdown. No extra text.

Questions 1-30: single answer, options A-D, is_multiple=false, correct_answers=null, points=1
Questions 31-40: advanced, mix of:
  - multiple_choice_2_correct: is_multiple=true, correct_answers=["A","C"], correct_answer="", points=2, may use A-G
  - matching or statement_combo: is_multiple=false, correct_answer="E", points=2, may use A-G

YOU MUST RETURN EXACTLY ${count} ITEMS IN THE ARRAY.

[{"question_type":"single","question_text":"...","context_text":"","option_a":"...","option_b":"...","option_c":"...","option_d":"...","option_e":"","option_f":"","option_g":"","correct_answer":"A","correct_answers":null,"is_multiple":false,"points":1,"explanation":"..."}]`
  }

  return `You are an expert UBT exam constructor for Kazakhstan.
Create EXACTLY ${count} questions for "${subject}" in Kazakh language.
Return ONLY a valid JSON array. No markdown. No extra text.

Rules:
- options: only A, B, C, D
- is_multiple: false
- correct_answers: null
- points: 1
- YOU MUST RETURN EXACTLY ${count} ITEMS IN THE ARRAY

[{"question_type":"single","question_text":"...","context_text":"","option_a":"...","option_b":"...","option_c":"...","option_d":"...","option_e":"","option_f":"","option_g":"","correct_answer":"A","correct_answers":null,"is_multiple":false,"points":1,"explanation":"..."}]`
}

function normalizeQuestion(q: AIQuestion, subjectId: number, index: number) {
  return {
    id: `ai_${subjectId}_${index}_${Date.now()}`,
    question_type: q.question_type || 'single',
    question_text: String(q.question_text || '').trim(),
    context_text: String(q.context_text || '').trim(),
    option_a: String(q.option_a || '').trim(),
    option_b: String(q.option_b || '').trim(),
    option_c: String(q.option_c || '').trim(),
    option_d: String(q.option_d || '').trim(),
    option_e: String(q.option_e || '').trim(),
    option_f: String(q.option_f || '').trim(),
    option_g: String(q.option_g || '').trim(),
    correct_answer: String(q.correct_answer || '').trim(),
    correct_answers: Array.isArray(q.correct_answers) ? q.correct_answers : null,
    is_multiple: Boolean(q.is_multiple),
    explanation: String(q.explanation || '').trim(),
    points: Number(q.points || 1),
    subject_id: subjectId,
    variant_id: 99,
  }
}

function validateAndTrim(
  questions: ReturnType<typeof normalizeQuestion>[],
  count: number
): ReturnType<typeof normalizeQuestion>[] {
  if (!Array.isArray(questions) || questions.length === 0) {
    throw new Error('Сұрақтар массиві бос келді')
  }

  if (questions.length < count) {
    throw new Error(`Claude ${count} орнына ${questions.length} сұрақ қайтарды`)
  }

  const trimmed = questions.slice(0, count)

  for (const q of trimmed) {
    if (!q.question_text) throw new Error('question_text бос')
    if (!q.option_a || !q.option_b || !q.option_c || !q.option_d) {
      throw new Error('A-D варианттарының бірі бос')
    }
    if (q.is_multiple) {
      if (!q.correct_answers || q.correct_answers.length !== 2) {
        throw new Error('Multiple сұрақта 2 correct_answers болуы керек')
      }
    } else {
      if (!q.correct_answer) throw new Error('Single сұрақта correct_answer бос')
    }
  }

  return trimmed
}

async function callClaude(prompt: string): Promise<string> {
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY!,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-5',
      max_tokens: 12000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`Anthropic HTTP error: ${errorText}`)
  }

  const data = await response.json()
  if (data.error) throw new Error(data.error.message || 'Anthropic API error')
  return data.content?.[0]?.text || ''
}

const MAX_RETRIES = 2

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const subject = String(body.subject || '').trim()
    const count = Number(body.count || 0)
    const subjectId = Number(body.subjectId || 0)

    if (!subject || !count || !subjectId) {
      return NextResponse.json(
        { error: 'subject, count, subjectId міндетті' },
        { status: 400 }
      )
    }

    if (!process.env.ANTHROPIC_API_KEY) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY табылмады' },
        { status: 500 }
      )
    }

    const prompt = buildPrompt(subject, count, subjectId)
    let result: ReturnType<typeof normalizeQuestion>[] = []
    let lastError = ''

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        console.log(`Attempt ${attempt}/${MAX_RETRIES}: ${subject} (${count} questions)`)

        const rawText = await callClaude(prompt)
        const cleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
        const jsonMatch = cleaned.match(/\[[\s\S]*\]/)

        if (!jsonMatch) throw new Error('Claude JSON қайтармады')

        let parsed: AIQuestion[]
        try {
          parsed = JSON.parse(jsonMatch[0])
        } catch {
          throw new Error('JSON parse қатесі')
        }

        const normalized = parsed.map((q, i) => normalizeQuestion(q, subjectId, i))
        result = validateAndTrim(normalized, count)

        console.log(`✅ Success attempt ${attempt}: ${result.length} questions`)
        break
      } catch (e: any) {
        lastError = e.message
        console.error(`❌ Attempt ${attempt} failed: ${e.message}`)

        if (attempt === MAX_RETRIES) {
          return NextResponse.json(
            { error: `${MAX_RETRIES} рет қайталады: ${lastError}` },
            { status: 500 }
          )
        }

        await new Promise(resolve => setTimeout(resolve, 500))
      }
    }

    return NextResponse.json({ questions: result })
  } catch (error: any) {
    console.error('Generate route crash:', error)
    return NextResponse.json(
      { error: error?.message || 'Route қатесі' },
      { status: 500 }
    )
  }
}