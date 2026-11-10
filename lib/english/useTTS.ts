'use client'

import { useRef, useState, useCallback } from 'react'

export type TTSVoice = 'nova' | 'onyx'   // nova = female, onyx = male

// Tiny silent WAV used to unlock an <audio> element inside a user gesture.
// Safari / iOS (every iOS browser is WebKit) block play() that happens after an
// `await fetch`, because the gesture is gone by then. Playing silence on the
// same element synchronously in the click handler keeps it allowed later.
const SILENT_WAV = 'data:audio/wav;base64,UklGRjQAAABXQVZFZm10IBAAAAABAAEAQB8AAIA+AAACABAAZGF0YRAAAAAAAAAAAAAAAAAAAAAAAAAA'

function hasSpeechSynthesis(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window && typeof SpeechSynthesisUtterance !== 'undefined'
}

// Must be called synchronously from a click/tap handler (before any await).
function unlockAudio(el: HTMLAudioElement) {
  try {
    el.muted = true
    el.src = SILENT_WAV
    const p = el.play()
    // Only pause if the real clip hasn't replaced the silence yet
    if (p) p.then(() => { if (el.src === SILENT_WAV) { el.pause(); el.muted = false } }).catch(() => { el.muted = false })
    else el.muted = false
  } catch { el.muted = false }
  // Web Speech on iOS also needs a gesture-time call to start working
  if (hasSpeechSynthesis()) {
    try { window.speechSynthesis.speak(new SpeechSynthesisUtterance('')) } catch { /* ignore */ }
  }
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

async function fetchTTS(text: string, voice: TTSVoice, speed: number): Promise<string | null> {
  try {
    const res = await fetch('/api/english/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, voice, speed }),
    })
    if (!res.ok) return null
    const blob = await res.blob()
    return URL.createObjectURL(blob)
  } catch { return null }
}

// Plays `url` on the (already unlocked) element; resolves false if the browser refused.
async function playUrl(el: HTMLAudioElement, url: string): Promise<boolean> {
  el.muted = false
  el.src = url
  try { await el.play(); return true } catch { return false }
}

// Speaks via Web Speech; resolves when finished (or immediately if unsupported).
function speakWS(text: string, gender: 'female' | 'male', onStart?: () => void, rate = 0.75): Promise<void> {
  return new Promise(resolve => {
    if (!hasSpeechSynthesis()) { resolve(); return }
    try {
      window.speechSynthesis.cancel()
      const u   = new SpeechSynthesisUtterance(text)
      u.lang    = 'en-US'
      u.rate    = rate
      u.pitch   = 1.05
      const v   = getBestWSVoice(gender)
      if (v) u.voice = v
      u.onstart = () => onStart?.()
      u.onend   = () => resolve()
      u.onerror = () => resolve()
      window.speechSynthesis.speak(u)
    } catch { resolve() }
  })
}

function useAudioElement() {
  const ref = useRef<HTMLAudioElement | null>(null)
  const urlRef = useRef<string | null>(null)
  const get = useCallback((): HTMLAudioElement => {
    if (!ref.current) {
      const el = new Audio()
      el.preload = 'auto'
      el.setAttribute('playsinline', '')
      ref.current = el
    }
    return ref.current
  }, [])
  // Track the current blob URL so the previous one gets released
  const setBlobUrl = useCallback((url: string | null) => {
    if (urlRef.current) URL.revokeObjectURL(urlRef.current)
    urlRef.current = url
  }, [])
  return { get, setBlobUrl }
}

// ── Single-text player (reading, vocab) ─────────────────────────
export function useTTSSingle() {
  const audio = useAudioElement()
  const reqId = useRef(0)
  const [playing, setPlaying] = useState(false)
  const [loading, setLoading] = useState(false)

  const stop = useCallback(() => {
    reqId.current++
    audio.get().pause()
    if (hasSpeechSynthesis()) window.speechSynthesis.cancel()
    setPlaying(false); setLoading(false)
  }, [audio])

  const toggle = useCallback(async (text: string, voice: TTSVoice = 'nova') => {
    if (playing || loading) { stop(); return }

    const el = audio.get()
    unlockAudio(el)               // synchronous, inside the user gesture
    const my = ++reqId.current

    setLoading(true)
    const url = await fetchTTS(text, voice, 0.85)
    if (my !== reqId.current) { if (url) URL.revokeObjectURL(url); return }
    setLoading(false)

    if (url) {
      audio.setBlobUrl(url)
      el.onplay  = () => setPlaying(true)
      el.onended = () => setPlaying(false)
      el.onerror = () => setPlaying(false)
      if (await playUrl(el, url)) return
    }

    // Fallback: Web Speech API
    const gender = voice === 'nova' ? 'female' : 'male'
    await speakWS(text, gender, () => setPlaying(true))
    if (my === reqId.current) setPlaying(false)
  }, [playing, loading, stop, audio])

  return { playing, loading, toggle, stop }
}

// ── Dialogue player (listening) — line by line ──────────────────
export type DialogLine = { text: string; isLeft: boolean }

export function useTTSDialogue(lines: DialogLine[]) {
  const audio = useAudioElement()
  const [playing,    setPlaying]    = useState(false)
  const [paused,     setPaused]     = useState(false)
  const [lineIdx,    setLineIdx]    = useState(-1)
  const [hasPlayed,  setHasPlayed]  = useState(false)
  const [loading,    setLoading]    = useState(false)
  const stopReq     = useRef(false)
  const pauseReq    = useRef(false)
  const usingWS     = useRef(false)

  const stop = useCallback(() => {
    stopReq.current = true
    audio.get().pause()
    if (hasSpeechSynthesis()) window.speechSynthesis.cancel()
    setPlaying(false); setPaused(false); setLineIdx(-1); setLoading(false)
  }, [audio])

  const pause = useCallback(() => {
    pauseReq.current = true
    if (usingWS.current) { if (hasSpeechSynthesis()) window.speechSynthesis.pause() }
    else audio.get().pause()
    setPaused(true); setPlaying(false)
  }, [audio])

  const resume = useCallback(() => {
    pauseReq.current = false
    if (usingWS.current) { if (hasSpeechSynthesis()) window.speechSynthesis.resume() }
    else audio.get().play().catch(() => { /* ignore */ })
    setPlaying(true); setPaused(false)
  }, [audio])

  // `play` itself is async; callers must unlock the element synchronously first.
  const run = useCallback(async (startIdx: number) => {
    stopReq.current  = false
    pauseReq.current = false
    setPlaying(true); setPaused(false)
    const el = audio.get()

    for (let i = startIdx; i < lines.length; i++) {
      if (stopReq.current) break
      setLineIdx(i)
      const line  = lines[i]
      const voice: TTSVoice = line.isLeft ? 'nova' : 'onyx'

      setLoading(true)
      const url = await fetchTTS(line.text, voice, 0.85)
      setLoading(false)

      if (stopReq.current) { if (url) URL.revokeObjectURL(url); break }

      let played = false
      if (url) {
        audio.setBlobUrl(url)
        usingWS.current = false
        played = await new Promise<boolean>(resolve => {
          const checkStop = setInterval(() => {
            if (stopReq.current) { el.pause(); clearInterval(checkStop); resolve(true) }
          }, 100)
          el.onended = () => { clearInterval(checkStop); resolve(true) }
          el.onerror = () => { clearInterval(checkStop); resolve(false) }
          playUrl(el, url).then(ok => { if (!ok) { clearInterval(checkStop); resolve(false) } })
        })
      }
      if (!played && !stopReq.current) {
        usingWS.current = true
        await speakWS(line.text, line.isLeft ? 'female' : 'male')
        usingWS.current = false
      }

      if (!stopReq.current && !pauseReq.current) {
        await new Promise(r => setTimeout(r, 400)) // pause between lines
      }
      if (pauseReq.current) break
    }

    if (!stopReq.current && !pauseReq.current) {
      setHasPlayed(true); setLineIdx(-1); setPlaying(false)
    }
  }, [lines, audio])

  const play = useCallback(() => {
    unlockAudio(audio.get())
    return run(0)
  }, [run, audio])

  const playFrom = useCallback((idx: number) => {
    stop()
    unlockAudio(audio.get())      // before the timeout, while the gesture is still active
    setTimeout(() => run(idx), 100)
  }, [stop, run, audio])

  return { playing, paused, loading, lineIdx, hasPlayed, play, pause, resume, stop, playFrom, setHasPlayed }
}
