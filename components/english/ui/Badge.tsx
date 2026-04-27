import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Color = 'navy' | 'gold' | 'mid' | 'green' | 'red' | 'gray'

const COLORS: Record<Color, string> = {
  navy:  'bg-navy/10 text-navy border-navy/20',
  gold:  'bg-gold/10 text-gold border-gold/20',
  mid:   'bg-mid/10 text-mid border-mid/20',
  green: 'bg-green-50 text-green-700 border-green-200',
  red:   'bg-red-50 text-red-700 border-red-200',
  gray:  'bg-gray-100 text-gray-600 border-gray-200',
}

type Props = {
  children: ReactNode
  color?: Color
  size?: 'sm' | 'md'
  className?: string
}

export default function Badge({ children, color = 'navy', size = 'md', className }: Props) {
  return (
    <span className={cn(
      'inline-flex items-center font-bold rounded-full border',
      COLORS[color],
      size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1',
      className
    )}>
      {children}
    </span>
  )
}
