'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'zku-app-shell'

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void }
  }
}

/**
 * Detect RN WebView / in-app shell.
 * - Query `?app=1` (or `?webview=1`) — persist for the session
 * - `window.ReactNativeWebView` (injected by react-native-webview)
 */
export function isZkuAppShell(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('app') === '1' || params.get('webview') === '1') {
      sessionStorage.setItem(STORAGE_KEY, '1')
      return true
    }
  } catch {
    // ignore
  }

  try {
    if (sessionStorage.getItem(STORAGE_KEY) === '1') return true
  } catch {
    // ignore
  }

  return typeof window.ReactNativeWebView !== 'undefined'
}

/** SSR-safe hook: false until mount, then syncs. */
export function useZkuAppShell(): boolean {
  const [isApp, setIsApp] = useState(false)

  useEffect(() => {
    setIsApp(isZkuAppShell())
  }, [])

  return isApp
}
