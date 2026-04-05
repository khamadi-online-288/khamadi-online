import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { studentName, profileSubject1, profileSubject2, simulatorResults, examResults } = await req.json()

    const simSummary = simulatorResults.length > 0
      ? simulatorResults.map((r: any, i: number) =>
          `Симулятор ${i + 1}: ${r.total_score ?? '?'}/${r.max_score ?? 140} балл`
        ).join('\n')
      : 'Симулятор нәтижесі жоқ'

    const examSummary = examResults.length > 0
      ? examResults.map((e: any) =>
          `Тест: ${e.subject_name || e.subject_id || '?'} — ${e.score ?? '?'}/${e.max_score ?? '?'}`
        ).join('\n')
      : 'Тақырып тесті нәтижесі жоқ'

    const prompt = `Сен KHAMADI ONLINE платформасының AI анализ жүйесісің.

Студент: ${studentName}
Бейінді пән 1: ${profileSubject1}
Бейінді пән 2: ${profileSubject2}

Симулятор нәтижелері:
${simSummary}

Тақырып тесттері:
${examSummary}

Осы деректер негізінде 6 бөлімнен тұратын анализ жаса. Қазақ тілінде жауап бер.

Форматы (дәл осылай жаз, JSON):
{
  "overview": "Жалпы білім деңгейі туралы 3-4 сөйлем",
  "subjectLevels": "Әр пән бойынша деңгей (күшті/орташа/әлсіз), әр пән жаңа жолдан",
  "weakTopics": "Қай тақырыптарды қайта оқу керек, нақты ұсыныстар",
  "scorePrediction": "Қазіргі деңгей: X балл\\nЕгер жақсартса: Y+ балл мүмкін",
  "studyPlan": "Бүгін:\\n- тақырып 1\\n- тақырып 2\\n\\nЕртең:\\n- тақырып 3",
  "parentReport": "Ата-анаға қысқаша есеп: оқушының деңгейі, күшті/әлсіз жақтары"
}

Тек JSON қайтар, басқа мәтін жоқ.`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    const data = await response.json()
    const text = data.content?.[0]?.text || '{}'
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('JSON табылмады')

    const result = JSON.parse(jsonMatch[0])
    return NextResponse.json(result)
  } catch (error: any) {
    console.error('AI analysis error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}