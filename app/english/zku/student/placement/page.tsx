'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { isZkuAppShell } from '@/lib/english/useZkuAppShell'

// The placement test is closed for ZKU students: the level is set by the admin
// and raised only through level final exams. Old links redirect to the dashboard.
export default function PlacementClosedPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace(isZkuAppShell() ? '/english/zku/student?app=1' : '/english/zku/student')
  }, [router])

  return null
}
