import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { studentName, totalScore, maxScore, subjectScores, wrongQuestions } = await req.json()

    const wrongText = wrongQuestions
      .map((q: any, i: number) =>
        `${i + 1}. [${q.subject}] ${q.question} | Студент: ${q.userAnswer} | Дұрыс: ${q.correctAnswer}`
      )
      .join('\n')

    const prompt = `Сен KHAMADI ONLINE платформасының AI оқытушысысың. Қазақ тілінде жауап бер.

Студент: ${studentName}
Жалпы нәтиже: ${totalScore} / ${maxScore} балл

Пәндер бойынша:
${subjectScores.map((s: any) => `- ${s.name}: ${s.score}/${s.max}`).join('\n')}

Қате жауаптар:
${wrongText}

Студентке мынаны жаз:
1. Жалпы баға (қысқаша, ынталандырушы)
2. Қай пәнде қандай қателер жіберді
3. Не оқу керек (нақты кеңестер)
4. Мотивациялық қорытынды`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const review = data.content?.[0]?.text || 'AI талдауын алу мүмкін болмады.'

    return NextResponse.json({ review })
  } catch (error: any) {
    console.error('AI review error:', error)
    return NextResponse.json({ review: 'AI талдауын алу мүмкін болмады.' }, { status: 500 })
  }
}