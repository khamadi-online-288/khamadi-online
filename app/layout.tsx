import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'KHAMADI ONLINE',
  description: 'ENT Preparation Platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kk">
      <body className={montserrat.className}>
        {children}
      </body>
    </html>
  )
}