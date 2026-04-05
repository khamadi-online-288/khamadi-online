import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    const systemPrompt = `Сен KHAMADI ONLINE платформасының AI мұғаліміссің. 

Ережелер:
- Тек ҰБТ пәндеріне қатысты сұрақтарға жауап бер: Қазақстан тарихы, Математика, Физика, Химия, Биология, География, Дүниежүзі тарихы, Шет тілі, Қазақ тілі, Қазақ әдебиеті, Информатика, Құқық негіздері
- Басқа тақырыпта сұрақ қойылса: "Кешіріңіз, мен тек оқу пәндеріне қатысты сұрақтарға жауап беремін" де
- Қазақ тілінде жауап бер
- Түсінікті, қарапайым тілмен түсіндір
- Мысалдар келтір
- Максимум 300 сөз`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const data = await response.json()
    const reply = data.content?.[0]?.text || 'Қате орын алды.'

    return NextResponse.json({ reply })
  } catch (error: any) {
    console.error('AI tutor error:', error)
    return NextResponse.json({ reply: 'Қате орын алды.' }, { status: 500 })
  }
}