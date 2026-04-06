'use client'

import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import DashboardShell from '@/components/dashboard/DashboardShell'
import ParentShell from '@/components/dashboard/ParentShell'

export default function DashboardRouteShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [allowed, setAllowed] = useState(false)

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.replace('/login')
          return
        }

        const { data: profile, error } = await supabase
          .from('profiles')
          .select('approval_status')
          .eq('id', user.id)
          .single()

        if (error || !profile) {
          await supabase.auth.signOut()
          router.replace('/login')
          return
        }

        if (profile.approval_status !== 'approved') {
          await supabase.auth.signOut()
          router.replace('/pending-approval')
          return
        }

        setAllowed(true)
      } catch (error) {
        console.error(error)
        router.replace('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAccess()
  }, [router])

  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 700,
          color: '#64748B',
        }}
      >
        Жүктелуде...
      </div>
    )
  }

  if (!allowed) return null

  if (pathname.startsWith('/dashboard/parent')) {
    return <ParentShell>{children}</ParentShell>
  }

  return <DashboardShell>{children}</DashboardShell>
}