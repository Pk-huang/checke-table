import { cva, type VariantProps } from 'class-variance-authority'
import type { ReactNode } from 'react'
import { cn } from './utils'

const badgeVariants = cva('inline-flex items-center px-1.5 py-0.5 text-[10px]', {
  variants: {
    tone: {
      neutral: 'border border-[#b9cbc5] bg-[#e8efec] text-[#51625e] dark:border-[#666] dark:bg-[#222] dark:text-[#ddd]',
      success: 'bg-[#e5f1ee] text-[#216b64] dark:bg-[#333] dark:text-[#ddd]',
    },
  },
  defaultVariants: {
    tone: 'neutral',
  },
})

type BadgeProps = VariantProps<typeof badgeVariants> & {
  children: ReactNode
  className?: string
}

export function Badge({ children, className, tone }: BadgeProps) {
  return <span className={cn(badgeVariants({ tone }), className)}>{children}</span>
}
