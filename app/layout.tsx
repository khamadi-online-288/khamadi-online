import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL('https://khamadi.online'),

  title: 'ҰБТ-ға дайындық | KHAMADI ONLINE',

  description:
    'KHAMADI ONLINE — ҰБТ-ға дайындалуға арналған онлайн платформа. ҰБТ тесттері, толық түсіндірме сабақтар, пәндер бойынша дайындық және нәтижені талдау.',

  keywords: [
    'ҰБТ дайындық',
    'ҰБТ тест',
    'ҰБТ онлайн дайындық',
    'ЕНТ дайындық',
    'ҰБТ дайындық платформасы',
    'ҰБТ тест онлайн',
    'Қазақстан тарихы ҰБТ',
  ],

  openGraph: {
    title: 'ҰБТ-ға дайындық | KHAMADI ONLINE',
    description:
      'ҰБТ-ға дайындалуға арналған онлайн платформа. Тесттер, сабақтар және толық дайындық жүйесі.',
    url: 'https://khamadi.online',
    siteName: 'KHAMADI ONLINE',
    locale: 'kk_KZ',
    type: 'website',
  },

  alternates: {
    canonical: 'https://khamadi.online',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="kk">
      <body>{children}</body>
    </html>
  )
}