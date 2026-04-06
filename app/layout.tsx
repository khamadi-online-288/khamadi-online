import type { Metadata, Viewport } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-main',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://khamadi.online'),

  title: {
    default: 'KHAMADI ONLINE — ҰБТ дайындық платформасы',
    template: '%s | KHAMADI ONLINE',
  },

  description:
    'KHAMADI ONLINE — ҰБТ-ға онлайн дайындық платформасы. ҰБТ тесттері, пәндер базасы, AI Tutor, толық симулятор және аналитика.',

  keywords: [
    'ҰБТ',
    'ҰБТ дайындық',
    'ЕНТ дайындық',
    'ҰБТ тест',
    'ҰБТ онлайн',
    'ҰБТ платформасы',
    'ЕНТ тест',
    'ҰБТ 2026',
    'ҰБТ дайындық платформасы',
    'KHAMADI ONLINE'
  ],

  authors: [{ name: 'KHAMADI ONLINE' }],

  creator: 'KHAMADI ONLINE',

  publisher: 'KHAMADI ONLINE',

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: 'KHAMADI ONLINE — ҰБТ дайындық платформасы',
    description:
      'ҰБТ-ға онлайн дайындық: тесттер, түсіндірме сабақтар, AI Tutor және толық аналитика.',

    url: 'https://khamadi.online',

    siteName: 'KHAMADI ONLINE',

    locale: 'kk_KZ',

    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',

    title: 'KHAMADI ONLINE — ҰБТ дайындық платформасы',

    description:
      'ҰБТ-ға онлайн дайындық платформасы: тесттер, аналитика және AI Tutor.',
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
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kk">
      <body className={montserrat.variable}>
        {children}
      </body>
    </html>
  )
}