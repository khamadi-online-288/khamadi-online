'use client'

import { useRef, useState, useCallback } from 'react'

export type TTSVoice = 'nova' | 'onyx'   // nova = female, onyx = male

// Pick the best available Web Speech voice (fallback when no API key)
function getBestWSVoice(gender: 'female' | 'male'): SpeechSynthesisVoice | null {
  if (typeof window === 'undefined') return null
  const voices = window.speechSynthesis.getVoices()
  const priority = gender === 'female'
    ? ['Google US English', 'Google UK English Female', 'Microsoft Aria', 'Samantha', 'Victoria', 'Karen']
    : ['Google UK English Male', 'Microsoft Guy', 'Alex', 'Daniel', 'Google US English']

  for (const name of priority) {
    const v = voices.find(v => v.name.includes(name) && v.lang.startsWith('en'))
    if (v) return v
  }
  return voices.find(v => v.lang === 'en-US') ?? voices.find(v => v.lang.startsWith('en')) ?? null
}

async function speakOpenAI(text: string, voice: TTSVoice, speed: number): Promise<HTMLAudioElement | null> {
  try {
    const res = await fetch('/api/english/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed }),
    })
    if (!res.ok) return null
    const blob = await res.blob()
    const url  = URL.createObjectURL(blob)
    const el   = new Audio(url)
    el.onended = () => URL.revokeObjectURL(url)
    return el
  } catch { return null }
}

function speakWS(text: string, gender: 'female' | 'male', rate = 0.75): SpeechSynthesisUtterance {
  window.speechSynthesis.cancel()
  const u   = new SpeechSynthesisUtterance(text)
  u.lang    = 'en-US'
  u.rate    = rate
  u.pitch   = 1.05
  const v   = getBestWSVoice(gender)
  if (v) u.voice = v
  return u
}

// ── Single-text player (reading, vocab) ─────────────────────────
export function useTTSSingle() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const utterRef = useRef<SpeechSynthesisUtterance | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const stop = useCallback(() => {
    audioRef.current?.pause()
    audioRef.current = null
    if (typeof window !== 'undefined') window.speechSynthesis?.cancel()
    setPlaying(false)
  }, [])

  const toggle = useCallback(async (text: string, voice: TTSVoice = 'nova') => {
    if (playing) { stop(); return }

    setLoading(true)
    const el = await speakOpenAI(text, voice, 0.85)
    setLoading(false)

    if (el) {
      audioRef.current = el
      el.onplay  = () => setPlaying(true)
      el.onended = () => setPlaying(false)
      el.onerror = () => setPlaying(false)
      el.play()
    } else {
      // Fallback: Web Speech API
      const gender = voice === 'nova' ? 'female' : 'male'
      const u = speakWS(text, gender)
      u.onstart = () => setPlaying(true)
      u.onend   = () => setPlaying(false)
      utterRef.current = u
      window.speechSynthesis.speak(u)
    }
  }, [playing, stop])

  return { playing, loading, toggle, stop }
}

// ── Dialogue player (listening) — line by line ──────────────────
export type DialogLine = { text: string; isLeft: boolean }

export function useTTSDialogue(lines: DialogLine[]) {
  const audioRef  = useRef<HTMLAudioElement | null>(null)
  const [playing,    setPlaying]    = useState(false)
  const [paused,     setPaused]     = useState(false)
  const [lineIdx,    setLineIdx]    = useState(-1)
  const [hasPlayed,  setHasPlayed]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const stopReq     = useRef(false)
  const pauseReq    = useRef(false)

  const stop = useCallback(() => {
    stopReq.current = true
    audioRef.current?.pause()
    audioRef.current = null
    window.speechSynthesis?.cancel()
    setPlaying(false); setPaused(false); setLineIdx(-1)
  }, [])

  const pause = useCallback(() => {
    pauseReq.current = true
    audioRef.current?.pause()
    window.speechSynthesis?.pause()
    setPaused(true); setPlaying(false)
  }, [])

  const resume = useCallback(() => {
    pauseReq.current = false
    if (audioRef.current) { audioRef.current.play(); setPlaying(true); setPaused(false) }
    else { window.speechSynthesis?.resume(); setPlaying(true); setPaused(false) }
  }, [])

  const play = useCallback(async (startIdx = 0) => {
    stopReq.current  = false
    pauseReq.current = false
    setPlaying(true); setPaused(false)

    for (let i = startIdx; i < lines.length; i++) {
      if (stopReq.current) break
      setLineIdx(i)
      const line  = lines[i]
      const voice: TTSVoice = line.isLeft ? 'nova' : 'onyx'

      setLoading(true)
      const el = await speakOpenAI(line.text, voice, 0.85)
      setLoading(false)

      if (stopReq.current) { el?.pause(); break }

      await new Promise<void>(resolve => {
        if (el) {
          audioRef.current = el
          el.onended = () => resolve()
          el.onerror = () => resolve()
          el.play()
          // Handle pause mid-playback
          const checkPause = setInterval(() => {
            if (stopReq.current) { el.pause(); clearInterval(checkPause); resolve() }
          }, 100)
          el.onended = () => { clearInterval(checkPause); resolve() }
        } else {
          // Web Speech fallback
          const gender: 'female' | 'male' = line.isLeft ? 'female' : 'male'
          const u = speakWS(line.text, gender)
          u.onend = () => resolve()
          window.speechSynthesis.speak(u)
        }
      })

      if (!stopReq.current && !pauseReq.current) {
        await new Promise(r => setTimeout(r, 400)) // pause between lines
      }
      if (pauseReq.current) break
    }

    if (!stopReq.current && !pauseReq.current) {
      setHasPlayed(true); setLineIdx(-1); setPlaying(false)
    }
  }, [lines])

  const playFrom = useCallback((idx: number) => {
    stop()
    setTimeout(() => play(idx), 100)
  }, [stop, play])

  return { playing, paused, loading, lineIdx, hasPlayed, play: () => play(0), pause, resume, stop, playFrom, setHasPlayed }
}
