import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'TTS not configured' }, { status: 501 })

  const { text, voice = 'nova', speed = 0.85 } = await req.json()
  if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 })

  const resp = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'tts-1', input: text.slice(0, 4096), voice, speed }),
  })

  if (!resp.ok) return NextResponse.json({ error: 'TTS failed' }, { status: resp.status })

  const audio = await resp.arrayBuffer()
  return new NextResponse(audio, { headers: { 'Content-Type': 'audio/mpeg', 'Cache-Control': 'public, max-age=3600' } })
}
