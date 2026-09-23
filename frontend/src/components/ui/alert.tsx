import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from './utils'

const alertVariants = cva('inline-flex items-center gap-1.5 text-xs', {
  variants: {
    tone: {
      warning: 'text-[#e4572e] dark:text-[#ff8a65]',
      success: 'text-[#315f7b] dark:text-[#b7d1df]',
    },
  },
  defaultVariants: {
    tone: 'warning',
  },
})

type AlertProps = VariantProps<typeof alertVariants> & {
  children: ReactNode
  className?: string
}

export function Alert({ children, className, tone }: AlertProps) {
  return <div className={cn(alertVariants({ tone }), className)} role="status">{children}</div>
}
