import { NextRequest, NextResponse } from 'next/server'

const VOICES = new Set(['nova', 'onyx'])

async function synthesize(text: string | null, voice: string | null, speed: number): Promise<NextResponse> {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return NextResponse.json({ error: 'TTS not configured' }, { status: 501 })
  if (!text) return NextResponse.json({ error: 'Text required' }, { status: 400 })

  const v = voice && VOICES.has(voice) ? voice : 'nova'
  const s = Number.isFinite(speed) ? Math.min(Math.max(speed, 0.5), 1.5) : 0.85

  const resp = await fetch('https://api.openai.com/v1/audio/speech', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model: 'tts-1', input: text.slice(0, 4096), voice: v, speed: s }),
  })

  if (!resp.ok) return NextResponse.json({ error: 'TTS failed' }, { status: resp.status })

  const audio = await resp.arrayBuffer()
  return new NextResponse(audio, {
    headers: {
      'Content-Type': 'audio/mpeg',
      'Content-Length': String(audio.byteLength),
      // Same text + voice always yields the same audio, so let the CDN cache it
      'Cache-Control': 'public, max-age=86400, s-maxage=2592000, immutable',
    },
  })
}

// GET lets the client set <audio src> and call play() synchronously inside the tap,
// which is what Android WebView and iOS require for audible playback.
export async function GET(req: NextRequest) {
  const p = req.nextUrl.searchParams
  return synthesize(p.get('text'), p.get('voice'), Number(p.get('speed') ?? 0.85))
}

export async function POST(req: NextRequest) {
  const { text, voice = 'nova', speed = 0.85 } = await req.json()
  return synthesize(text ?? null, voice, Number(speed))
}
