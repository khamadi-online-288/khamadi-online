import { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

const VARIANTS: Record<Variant, string> = {
  primary:   'bg-navy text-white hover:bg-mid shadow-sm hover:shadow-md',
  secondary: 'bg-white text-navy border border-navy/20 hover:border-navy/40 hover:bg-light',
  ghost:     'bg-transparent text-navy hover:bg-light',
  danger:    'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100',
}

const SIZES: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  children: ReactNode
}

export default function Button({
  variant = 'primary', size = 'md', fullWidth, className, children, disabled, ...props
}: Props) {
  return (
    <button
      {...props}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-bold transition-all duration-200',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className
      )}
    >
      {children}
    </button>
  )
}
