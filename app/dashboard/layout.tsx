import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://khamadi.online'),
  title: 'ҰБТ дайындық платформасы | KHAMADI ONLINE',
  description:
    'KHAMADI ONLINE — ҰБТ-ға онлайн дайындық платформасы. ҰБТ тесттері, түсіндірме сабақтар, аналитика, AI tutor және толық дайындық жүйесі.',
  keywords: [
    'ҰБТ',
    'ҰБТ дайындық',
    'ЕНТ дайындық',
    'ҰБТ тест',
    'ҰБТ онлайн',
    'ҰБТ платформасы',
    'ЕНТ тест',
    'ҰБТ-ға дайындық',
    'KHAMADI ONLINE',
  ],
  applicationName: 'KHAMADI ONLINE',
  authors: [{ name: 'KHAMADI ONLINE' }],
  creator: 'KHAMADI ONLINE',
  publisher: 'KHAMADI ONLINE',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'ҰБТ дайындық платформасы | KHAMADI ONLINE',
    description:
      'ҰБТ-ға онлайн дайындық: тесттер, түсіндірмелер, аналитика және AI tutor.',
    url: 'https://khamadi.online',
    siteName: 'KHAMADI ONLINE',
    locale: 'kk_KZ',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ҰБТ дайындық платформасы | KHAMADI ONLINE',
    description:
      'ҰБТ-ға онлайн дайындық: тесттер, түсіндірмелер, аналитика және AI tutor.',
  },
  alternates: {
    canonical: 'https://khamadi.online',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0EA5E9',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  )
}