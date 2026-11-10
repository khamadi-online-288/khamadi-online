'use client'

import { useRef, useState, useCallback } from 'react'

export type TTSVoice = 'nova' | 'onyx'   // nova = female, onyx = male

// Why audio is started via a GET URL:
// Safari/iOS and Android WebView only allow audible play() during the tap itself.
// Fetching the clip first and calling play() after `await` loses the gesture and is
// silently blocked. Setting <audio src> to the TTS endpoint and calling play()
// synchronously keeps the gesture; the element is then unlocked, so later lines of a
// dialogue can reuse it without another tap.

function ttsUrl(text: string, voice: TTSVoice, speed: number): string {
  const q = new URLSearchParams({ text, voice, speed: String(speed) })
  return `/api/english/tts?${q.toString()}`
}

function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

// Pick the best available Web Speech voice (fallback when OpenAI TTS is unavailable)
function getBestWSVoice(gender: 'female' | 'male'): SpeechSynthesisVoice | null {
  if (!hasSpeechSynthesis()) return null
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

// Speaks via Web Speech; resolves when finished. Android WebView exposes the API but
// never fires events, so a length-based timeout guarantees the promise settles.
function speakWS(text: string, gender: 'female' | 'male', onStart?: () => void, rate = 0.75): Promise<void> {
  return new Promise(resolve => {
    if (!hasSpeechSynthesis()) { resolve(); return }
    const timer = setTimeout(resolve, 2000 + text.length * 120)
    const done = () => { clearTimeout(timer); resolve() }
    try {
      window.speechSynthesis.cancel()
      const u   = new SpeechSynthesisUtterance(text)
      u.lang    = 'en-US'
      u.rate    = rate
      u.pitch   = 1.05
      const v   = getBestWSVoice(gender)
      if (v) u.voice = v
      u.onstart = () => onStart?.()
      u.onend   = done
      u.onerror = done
      window.speechSynthesis.speak(u)
    } catch { done() }
  })
}

// Starts `src` on `el` right now (call synchronously from the tap for the first clip).
// Resolves true when the clip finished, false if it failed or was refused.
function playClip(el: HTMLAudioElement, src: string, onPlaying: () => void, isCancelled: () => boolean): Promise<boolean> {
  return new Promise(resolve => {
    let settled = false
    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      clearInterval(watch)
      el.onplaying = null; el.onended = null; el.onerror = null
      resolve(ok)
    }
    const watch = setInterval(() => { if (isCancelled()) { el.pause(); finish(true) } }, 100)
    el.onplaying = onPlaying
    el.onended   = () => finish(true)
    el.onerror   = () => finish(false)
    el.src = src
    try {
      const p = el.play()
      if (p) p.catch(err => {
        // AbortError just means a newer src/pause replaced this one
        if (err instanceof DOMException && err.name === 'AbortError') return
        finish(false)
      })
    } catch { finish(false) }
  })
}

function useAudioElement() {
  const ref = useRef<HTMLAudioElement | null>(null)
  return useCallback((): HTMLAudioElement => {
    if (!ref.current) {
      const el = new Audio()
      el.preload = 'auto'
      el.setAttribute('playsinline', '')
      ref.current = el
    }
    return ref.current
  }, [])
}

// ── Single-text player (reading, vocab) ─────────────────────────
export function useTTSSingle() {
  const getEl = useAudioElement()
  const runId = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const stop = useCallback(() => {
    runId.current++
    getEl().pause()
    if (hasSpeechSynthesis()) window.speechSynthesis.cancel()
    setPlaying(false); setLoading(false)
  }, [getEl])

  const toggle = useCallback(async (text: string, voice: TTSVoice = 'nova') => {
    if (playing || loading) { stop(); return }

    const my = ++runId.current
    const cancelled = () => my !== runId.current
    setLoading(true)

    // play() is called synchronously inside playClip — keep it before any await
    const ok = await playClip(getEl(), ttsUrl(text, voice, 0.85), () => { setLoading(false); setPlaying(true) }, cancelled)
    if (cancelled()) return

    if (!ok) {
      setLoading(false)
      const gender = voice === 'nova' ? 'female' : 'male'
      await speakWS(text, gender, () => setPlaying(true))
    }
    if (!cancelled()) { setPlaying(false); setLoading(false) }
  }, [playing, loading, stop, getEl])

  return { playing, loading, toggle, stop }
}

// ── Dialogue player (listening) — line by line ──────────────────
export type DialogLine = { text: string; isLeft: boolean }

export function useTTSDialogue(lines: DialogLine[]) {
  const getEl = useAudioElement()
  const [playing,    setPlaying]    = useState(false)
  const [paused,     setPaused]     = useState(false)
  const [lineIdx,    setLineIdx]    = useState(-1)
  const [hasPlayed,  setHasPlayed]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const runId       = useRef(0)       // bumping it cancels the running loop
  const pauseReq    = useRef(false)
  const usingWS     = useRef(false)

  const stop = useCallback(() => {
    runId.current++
    pauseReq.current = false
    getEl().pause()
    if (hasSpeechSynthesis()) window.speechSynthesis.cancel()
    setPlaying(false); setPaused(false); setLineIdx(-1); setLoading(false)
  }, [getEl])

  const pause = useCallback(() => {
    pauseReq.current = true
    if (usingWS.current) { if (hasSpeechSynthesis()) window.speechSynthesis.pause() }
    else getEl().pause()
    setPaused(true); setPlaying(false)
  }, [getEl])

  const resume = useCallback(() => {
    pauseReq.current = false
    if (usingWS.current) { if (hasSpeechSynthesis()) window.speechSynthesis.resume() }
    else getEl().play().catch(() => { /* ignore */ })
    setPlaying(true); setPaused(false)
  }, [getEl])

  // Must be invoked synchronously from a tap: the first play() happens before any await.
  const run = useCallback(async (startIdx: number) => {
    const my = ++runId.current
    const cancelled = () => my !== runId.current
    pauseReq.current = false
    setPlaying(true); setPaused(false)
    const el = getEl()

    for (let i = startIdx; i < lines.length; i++) {
      if (cancelled()) return
      setLineIdx(i)
      const line  = lines[i]
      const voice: TTSVoice = line.isLeft ? 'nova' : 'onyx'

      setLoading(true)
      usingWS.current = false
      const ok = await playClip(el, ttsUrl(line.text, voice, 0.85), () => setLoading(false), cancelled)
      setLoading(false)
      if (cancelled()) return

      if (!ok) {
        usingWS.current = true
        await speakWS(line.text, line.isLeft ? 'female' : 'male')
        usingWS.current = false
        if (cancelled()) return
      }

      if (!pauseReq.current) await new Promise(r => setTimeout(r, 400)) // pause between lines
      if (pauseReq.current || cancelled()) return
    }

    setHasPlayed(true); setLineIdx(-1); setPlaying(false)
  }, [lines, getEl])

  const play = useCallback(() => { run(0) }, [run])

  const playFrom = useCallback((idx: number) => {
    stop()
    run(idx)   // no setTimeout: it would drop the tap gesture
  }, [stop, run])

  return { playing, paused, loading, lineIdx, hasPlayed, play, pause, resume, stop, playFrom, setHasPlayed }
}
