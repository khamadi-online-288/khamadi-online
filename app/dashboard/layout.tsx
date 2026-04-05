'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import DashboardRouteShell from '@/components/dashboard/DashboardRouteShell'
import { supabase } from '@/lib/supabase'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let mounted = true

    async function checkAuth() {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!mounted) return

      const isParentPath = pathname.startsWith('/dashboard/parent')

      if (!user) {
        router.replace(isParentPath ? '/parent/login' : '/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const role = profile?.role

      if (role === 'parent' && !isParentPath) {
        router.replace('/dashboard/parent')
        return
      }

      if (role === 'student' && isParentPath) {
        router.replace('/dashboard')
        return
      }

      setChecking(false)
    }

    checkAuth()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const isParentPath = pathname.startsWith('/dashboard/parent')

      if (!session?.user) {
        router.replace(isParentPath ? '/parent/login' : '/login')
      }
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [router, pathname])

  if (checking) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#F8FAFC',
          color: '#0F172A',
          fontSize: '16px',
          fontWeight: 700,
        }}
      >
        Жүктелуде...
      </div>
    )
  }

  return <DashboardRouteShell>{children}</DashboardRouteShell>
}