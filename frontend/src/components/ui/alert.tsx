import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from './utils'

const alertVariants = cva('inline-flex items-center gap-1.5 text-xs', {
  variants: {
    tone: {
      warning: 'text-[#555] dark:text-[#ccc]',
      success: 'text-[#333] dark:text-[#ccc]',
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
