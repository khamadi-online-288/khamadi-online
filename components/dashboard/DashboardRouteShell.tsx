'use client'

import { usePathname } from 'next/navigation'
import DashboardShell from '@/components/dashboard/DashboardShell'
import ParentShell from '@/components/dashboard/ParentShell'

export default function DashboardRouteShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  if (pathname.startsWith('/dashboard/parent')) {
    return <ParentShell>{children}</ParentShell>
  }

  return <DashboardShell>{children}</DashboardShell>
}