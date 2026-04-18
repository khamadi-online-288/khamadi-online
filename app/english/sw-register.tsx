'use client'

import { useEffect, useState } from 'react'

export default function SwRegister() {
  const [canInstall, setCanInstall] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<Event & { prompt: () => Promise<void> } | null>(null)

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(console.error)
    }

    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as Event & { prompt: () => Promise<void> })
      setCanInstall(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  async function install() {
    if (!deferredPrompt) return
    await deferredPrompt.prompt()
    setCanInstall(false)
    setDeferredPrompt(null)
  }

  if (!canInstall) return null

  return (
    <button
      onClick={install}
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        background: 'linear-gradient(135deg,#38bdf8,#0ea5e9)',
        color: '#fff',
        border: 'none',
        borderRadius: '999px',
        padding: '12px 24px',
        fontFamily: 'var(--font-main, Montserrat, sans-serif)',
        fontWeight: 700,
        fontSize: '14px',
        cursor: 'pointer',
        boxShadow: '0 4px 20px rgba(14,165,233,0.4)',
      }}
    >
      📲 Установить приложение
    </button>
  )
}
