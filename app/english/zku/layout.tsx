import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: { default: 'ЗКУ · English', template: '%s | ЗКУ English' },
  description: 'Платформа изучения английского языка для студентов и преподавателей ЗКУ. Powered by KHAMADI English.',
}

export default function ZKULayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  )
}
