import DashboardRouteShell from '@/components/dashboard/DashboardRouteShell'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <DashboardRouteShell>{children}</DashboardRouteShell>
}
