import { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode
  hover?: boolean
}

export default function Card({ children, hover, className, ...props }: Props) {
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-2xl shadow-sm border border-navy/8',
        hover && 'transition-all duration-200 hover:-translate-y-1 hover:shadow-md cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
