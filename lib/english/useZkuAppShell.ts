'use client'

import { useEffect, useState } from 'react'

const STORAGE_KEY = 'zku-app-shell'

declare global {
  interface Window {
    ReactNativeWebView?: { postMessage: (message: string) => void }
  }
}

function markAppShell() {
  try {
    sessionStorage.setItem(STORAGE_KEY, '1')
  } catch {
    // ignore
  }
}

/**
 * Detect RN WebView / in-app shell.
 * - Query `?app=1` (or `?webview=1`) — persist for the tab
 * - `window.ReactNativeWebView` (injected by react-native-webview)
 * Either signal is written to sessionStorage so later routes (login after
 * an auth redirect) keep the shell even if the query string was dropped.
 */
export function isZkuAppShell(): boolean {
  if (typeof window === 'undefined') return false

  try {
    const params = new URLSearchParams(window.location.search)
    if (params.get('app') === '1' || params.get('webview') === '1') {
      markAppShell()
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

  if (typeof window.ReactNativeWebView !== 'undefined') {
    markAppShell()
    return true
  }

  return false
}

/** Login URL that keeps the in-app shell across an auth redirect. */
export function zkuLoginHref(): string {
  return isZkuAppShell() ? '/english/zku/login?app=1' : '/english/zku/login'
}

type ZkuAppShellState = {
  isApp: boolean
  ready: boolean
}

/** SSR-safe hook: not ready until mount, so the back-link does not flash. */
export function useZkuAppShell(): ZkuAppShellState {
  const [state, setState] = useState<ZkuAppShellState>({ isApp: false, ready: false })

  useEffect(() => {
    setState({ isApp: isZkuAppShell(), ready: true })
  }, [])

  return state
}
