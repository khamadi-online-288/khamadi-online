import type { Metadata, Viewport } from 'next'
import './zku-responsive.css'

export const metadata: Metadata = {
  title: { default: 'ЗКУ · English', template: '%s | ЗКУ English' },
  description: 'Платформа изучения английского языка для студентов и преподавателей ЗКУ. Powered by KHAMADI English.',
}

/** Notch / home indicator + no pinch-zoom (app-like WebView). */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function ZKULayout({ children }: { children: React.ReactNode }) {
  return (
    <div translate="no" className="notranslate zku-shell">
      {children}
    </div>
  )
}
