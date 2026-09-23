'use client'

import { useEffect, useState } from 'react'

const DEFAULT_BREAKPOINT = 768

/**
 * True when viewport width is at or below `breakpoint` (default 768).
 * SSR-safe: starts false, then syncs after mount (and on resize).
 */
export function useIsMobile(breakpoint: number = DEFAULT_BREAKPOINT): boolean {
  const query = `(max-width: ${breakpoint}px)`

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return

    const mql = window.matchMedia(query)
    const apply = () => setIsMobile(mql.matches)

    apply()

    if (typeof mql.addEventListener === 'function') {
      mql.addEventListener('change', apply)
      return () => mql.removeEventListener('change', apply)
    }

    // Safari < 14
    mql.addListener(apply)
    return () => mql.removeListener(apply)
  }, [query])

  return isMobile
}
