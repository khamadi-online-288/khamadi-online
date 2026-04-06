import { NextRequest, NextResponse } from 'next/server'

const ALLOWED_SUBJECTS = [
  'Қазақстан тарихы',
  'Математика',
  'Физика',
  'Химия',
  'Биология',
  'География',
  'Дүниежүзі тарихы',
  'Шет тілі',
  'Қазақ тілі',
  'Қазақ әдебиеті',
  'Информатика',
  'Құқық негіздері',
]

function buildSystemPrompt(subject?: string, mode?: string) {
  const base = `
Сен KHAMADI ONLINE платформасының elite AI мұғалімісің.

Басты міндеттерің:
- Тек ҰБТ пәндеріне қатысты сұрақтарға жауап беру
- Жауапты тек қазақ тілінде беру
- Қарапайым, түсінікті, жүйелі тіл қолдану
- Қажет жерде мысал келтіру
- Жауапты су қоспай, нақты беру
- Оқушыға пайдалы болу

Егер сұрақ оқу пәндерінен тыс болса, дәл осыны айт:
"Кешіріңіз, мен тек ҰБТ пәндеріне қатысты сұрақтарға жауап беремін."

Егер сұрақ түсініксіз болса:
- Алдымен өзің ең ықтимал мағынасын түсіндіріп көр
- Сосын қысқа нақты жауап бер

Жауап құрылымы:
1. Қысқа түсіндірме
2. Қажет болса мысал
3. "ҰБТ-де қалай келеді?" деген қысқа бөлім
`

  const subjectPromptMap: Record<string, string> = {
    'Математика': `
Пән: Математика
- Формула болса, міндетті түрде көрсет
- Есеп болса, қадамдап шығар
- Соңында 1 mini test сұрақ қос
`,
    'Физика': `
Пән: Физика
- Анықтама + формула + өлшем бірлік көрсет
- Қажет болса қарапайым физикалық мағынасын түсіндір
- Соңында 1 mini test сұрақ қос
`,
    'Химия': `
Пән: Химия
- Формула, реакция, валенттілік немесе заң болса анық жаз
- Қажет болса қысқа теңдеу келтір
- Соңында 1 mini test сұрақ қос
`,
    'Биология': `
Пән: Биология
- Терминдерді қарапайым тілмен түсіндір
- Процестерді ретімен жаз
- Соңында 1 mini test сұрақ қос
`,
    'Қазақстан тарихы': `
Пән: Қазақстан тарихы
- Негізгі дата, тұлға, оқиға болса нақты көрсет
- Қысқа тарихи контекст бер
- Соңында 1 mini test сұрақ қос
`,
    'Дүниежүзі тарихы': `
Пән: Дүниежүзі тарихы
- Негізгі кезең, дата, оқиға, себеп-салдарды көрсет
- Соңында 1 mini test сұрақ қос
`,
    'География': `
Пән: География
- Термин, нысан, заңдылықты нақты түсіндір
- Қажет болса карта логикасымен түсіндір
- Соңында 1 mini test сұрақ қос
`,
    'Информатика': `
Пән: Информатика
- Ұғымды қарапайым тілмен түсіндір
- Қажет болса мысал немесе қысқа алгоритм бер
- Соңында 1 mini test сұрақ қос
`,
    'Қазақ тілі': `
Пән: Қазақ тілі
- Ережені анық түсіндір
- Қажет болса мысал сөйлем жаз
- Соңында 1 mini test сұрақ қос
`,
    'Қазақ әдебиеті': `
Пән: Қазақ әдебиеті
- Кейіпкер, идея, тақырып, шығарма мазмұнын нақты түсіндір
- Соңында 1 mini test сұрақ қос
`,
    'Шет тілі': `
Пән: Шет тілі
- Грамматиканы өте қарапайым түсіндір
- Қажет болса мысал сөйлем келтір
- Соңында 1 mini test сұрақ қос
`,
    'Құқық негіздері': `
Пән: Құқық негіздері
- Терминдерді нақты әрі қарапайым түсіндір
- Қажет болса мысал ситуация келтір
- Соңында 1 mini test сұрақ қос
`,
  }

  const modePromptMap: Record<string, string> = {
    simple: `
Режим: SIMPLE
- Өте қарапайым тілмен түсіндір
- Терминдерді жеңілдет
- 11-сынып оқушысы бірден түсінетіндей қыл
`,
    example: `
Режим: EXAMPLE
- Жауапта міндетті түрде мысал көп болсын
- Мүмкін болса 2 мысал келтір
`,
    quiz: `
Режим: QUIZ
- Тақырыпты қысқа түсіндір
- Соңында 3 mini test сұрақ құрастыр
- Әр сұраққа жауапты бірден берме, бөлек "Дұрыс жауап" бөлімінде көрсет
`,
    mistake: `
Режим: MISTAKE ANALYSIS
- Қатені талдауға фокус жаса
- "Неге қате?", "Дұрысы қандай?", "Қалай есте сақтау керек?" деген үш бөлім қолдан
`,
  }

  return [
    base.trim(),
    subject && subjectPromptMap[subject] ? subjectPromptMap[subject].trim() : '',
    mode && modePromptMap[mode] ? modePromptMap[mode].trim() : '',
  ]
    .filter(Boolean)
    .join('\n\n')
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const messages = Array.isArray(body.messages) ? body.messages : []
    const subject = typeof body.subject === 'string' ? body.subject.trim() : ''
    const mode = typeof body.mode === 'string' ? body.mode.trim() : ''

    if (!messages.length) {
      return NextResponse.json(
        { reply: 'Сұрақ бос болмауы керек.' },
        { status: 400 }
      )
    }

    if (subject && !ALLOWED_SUBJECTS.includes(subject)) {
      return NextResponse.json({
        reply: 'Кешіріңіз, мен тек ҰБТ пәндеріне қатысты сұрақтарға жауап беремін.',
      })
    }

    const sanitizedMessages = messages
      .filter((m: any) => m && (m.role === 'user' || m.role === 'assistant'))
      .map((m: any) => ({
        role: m.role,
        content: typeof m.content === 'string' ? m.content : String(m.content || ''),
      }))
      .filter((m: any) => m.content.trim().length > 0)
      .slice(-12)

    const systemPrompt = buildSystemPrompt(subject, mode)

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1200,
        system: systemPrompt,
        messages: sanitizedMessages,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Anthropic API error:', data)
      return NextResponse.json(
        { reply: 'AI Tutor уақытша жауап бере алмай тұр. Кейінірек қайталап көр.' },
        { status: response.status }
      )
    }

    const reply =
      data?.content?.find((item: any) => item?.type === 'text')?.text ||
      'Қате орын алды.'

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('AI tutor error:', error)
    return NextResponse.json(
      { reply: 'Қате орын алды.' },
      { status: 500 }
    )
  }
}