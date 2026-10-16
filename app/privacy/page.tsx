import type { Metadata } from 'next'
import { Suspense } from 'react'
import PrivacyDocument from './privacy-document'

export const metadata: Metadata = {
  title: 'Құпиялылық саясаты',
  description:
    'KHAMADI ONLINE құпиялылық саясаты: қандай деректер жинаймыз, не үшін қолданамыз және оларды қалай қорғаймыз. Политика конфиденциальности платформы khamadi.online.',
  alternates: {
    canonical: 'https://khamadi.online/privacy',
  },
  openGraph: {
    title: 'Құпиялылық саясаты | KHAMADI ONLINE',
    description:
      'Дербес деректерді жинау, сақтау және қорғау тәртібі. khamadi.online',
    url: 'https://khamadi.online/privacy',
    siteName: 'KHAMADI ONLINE',
    locale: 'kk_KZ',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function PrivacyPage() {
  return (
    <Suspense fallback={<PrivacyFallback />}>
      <PrivacyDocument />
    </Suspense>
  )
}

function PrivacyFallback() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#f7fbfe',
        color: '#0f172a',
      }}
    />
  )
}
