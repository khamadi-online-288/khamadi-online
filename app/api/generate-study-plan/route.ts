import { NextResponse } from 'next/server'

type RawItem = {
  day_label: string
  subject: string
  topic: string
  task_type: string
  duration_minutes: number
}

export async function POST(req: Request) {
  try {
    const { studentName, profileSubject1, profileSubject2, simulatorResults } = await req.json()

    const subject1 = profileSubject1 || 'Математика'
    const subject2 = profileSubject2 || 'Физика'
    const name = studentName || 'Студент'

    // Build context from simulator results
    let simContext = 'Симулятор нәтижелері жоқ.'
    if (simulatorResults && simulatorResults.length > 0) {
      const scores = simulatorResults
        .slice(0, 3)
        .map((r: { score?: number; created_at?: string }) => `${r.score ?? '?'} балл`)
        .join(', ')
      simContext = `Соңғы симулятор нәтижелері: ${scores}`
    }

    const prompt = `Сен ҰБТ дайындықтың AI оқытушысысың. Студентке 14 күндік оқу жоспарын жаса.

Студент: ${name}
Бейінді пәндер: ${subject1}, ${subject2}
${simContext}

ТІКЕЛЕЙ JSON массивін қайтар (markdown жоқ, түсіндірме жоқ):
[
  {
    "day_label": "1-күн",
    "subject": "пән атауы",
    "topic": "тақырып атауы қазақша",
    "task_type": "Теория|Жаттығу|Тест|Қайталау",
    "duration_minutes": 30
  }
]

Ережелер:
- Күніне 2-3 тапсырма, барлығы 14 күн (~35 элемент)
- Пәндер: Қазақстан тарихы, Математикалық сауаттылық, Оқу сауаттылығы, ${subject1}, ${subject2}
- ${subject1} мен ${subject2} пәндеріне көбірек уақыт бөл (ҰБТ-де 40 сұрақтан)
- Алғашқы 5 күн: Теория мен Жаттығу
- 6–10 күн: Тест пен Жаттығу
- 11–14 күн: Қайталау мен Тест
- Барлық тақырыптар нақты ҰБТ бағдарламасынан болсын
- duration_minutes: 30 немесе 45 немесе 60 ғана
- JSON ғана қайтар, басқа ештеңе жазба`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const aiData = await response.json()
    const rawText: string = aiData.content?.[0]?.text || '[]'

    // Extract JSON from response (strip any surrounding text)
    const jsonMatch = rawText.match(/\[[\s\S]*\]/)
    if (!jsonMatch) {
      return NextResponse.json({ error: 'AI жарамды жоспар қайтармады.' }, { status: 500 })
    }

    const items: RawItem[] = JSON.parse(jsonMatch[0])

    // Validate and normalise items
    const cleaned = items
      .filter(
        (item) =>
          item.day_label &&
          item.subject &&
          item.topic &&
          item.task_type &&
          typeof item.duration_minutes === 'number'
      )
      .map((item) => ({
        day_label: String(item.day_label),
        subject: String(item.subject),
        topic: String(item.topic),
        task_type: String(item.task_type),
        duration_minutes: Number(item.duration_minutes),
        status: 'todo',
      }))

    return NextResponse.json({ items: cleaned })
  } catch (err) {
    console.error('generate-study-plan error:', err)
    return NextResponse.json({ error: 'Жоспар жасау кезінде қате шықты.' }, { status: 500 })
  }
}
