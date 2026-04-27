import { ReactNode } from 'react'
import { CheckCircle2 } from 'lucide-react'

type Props = {
  title?:    string
  count?:    number
  children:  ReactNode
  footer?:   ReactNode
}

export default function ExerciseWrapper({ title = 'Тест', count, children, footer }: Props) {
  return (
    <div>
      <h2 className="text-base font-black text-navy mb-4 flex items-center gap-2">
        <CheckCircle2 size={17} className="text-gold" />
        {title}{count ? ` (${count} вопросов)` : ''}
      </h2>
      <div className="space-y-5">{children}</div>
      {footer && <div className="mt-6">{footer}</div>}
    </div>
  )
}
