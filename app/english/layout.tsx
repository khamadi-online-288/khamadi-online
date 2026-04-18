import type { Metadata } from 'next'
import SwRegister from './sw-register'

export const metadata: Metadata = {
  title: {
    default: 'KHAMADI ENGLISH — Платформа английского языка',
    template: '%s | KHAMADI ENGLISH',
  },
  description:
    'KHAMADI ENGLISH — онлайн-платформа для изучения английского языка. Курсы A1–C1, профессиональные треки, AI-тьютор, сертификаты.',
  manifest: '/manifest.json',
  applicationName: 'KHAMADI ENGLISH',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'KH English',
  },
}

export default function EnglishLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <SwRegister />
    </>
  )
}
