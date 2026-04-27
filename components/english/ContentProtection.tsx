'use client'
import { useEffect, useRef } from 'react'

interface Props {
  userName?: string
  userId?: string
  children: React.ReactNode
  className?: string
}

export default function ContentProtection({ userName, userId, children, className }: Props) {
  const events = useRef<{ time: number; action: string }[]>([])
  const reported = useRef<Set<string>>(new Set())

  useEffect(() => {
    function logEvent(action: string) {
      const now = Date.now()
      events.current.push({ time: now, action })
      // Keep only events from the last 10 minutes
      events.current = events.current.filter(e => now - e.time < 10 * 60 * 1000)

      if (events.current.length >= 5 && !reported.current.has(action)) {
        reported.current.add(action)
        // Fire-and-forget — don't block UI
        fetch('/api/english/log-suspicious', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, metadata: { count: events.current.length, userId } }),
        }).catch(() => {})
        // Reset to allow re-reporting after another 5 events
        setTimeout(() => reported.current.delete(action), 60_000)
      }
    }

    function blockDefault(e: Event) { e.preventDefault() }

    function onKeyDown(e: KeyboardEvent) {
      if (e.ctrlKey && ['c', 's', 'a', 'p', 'u'].includes(e.key.toLowerCase())) {
        e.preventDefault()
        logEvent(`key_${e.key.toLowerCase()}`)
      }
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(e.key.toLowerCase()))) {
        e.preventDefault()
        logEvent('devtools_attempt')
      }
    }

    function onCopy(e: ClipboardEvent) {
      e.preventDefault()
      logEvent('clipboard_copy')
    }

    function onPrint() {
      logEvent('print_attempt')
    }

    document.addEventListener('contextmenu', blockDefault)
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('copy', onCopy)
    document.addEventListener('cut', onCopy)
    window.addEventListener('beforeprint', onPrint)

    return () => {
      document.removeEventListener('contextmenu', blockDefault)
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('copy', onCopy)
      document.removeEventListener('cut', onCopy)
      window.removeEventListener('beforeprint', onPrint)
    }
  }, [userId])

  return (
    <div className={`protected-content${className ? ` ${className}` : ''}`} style={{ position: 'relative' }}>
      {children}
      {userName && (
        <div aria-hidden="true" style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 9999,
          overflow: 'hidden',
        }}>
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} style={{
              position: 'absolute',
              top: `${Math.floor(i / 4) * 33 + 8}%`,
              left: `${(i % 4) * 25 + 5}%`,
              transform: 'rotate(-30deg)',
              fontSize: 12,
              fontWeight: 700,
              color: 'rgba(27,58,107,0.055)',
              whiteSpace: 'nowrap',
              fontFamily: 'Montserrat, sans-serif',
              letterSpacing: '0.5px',
              userSelect: 'none',
            }}>
              {userName} · {new Date().toLocaleDateString('ru-RU')}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
