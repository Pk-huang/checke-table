import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1677b7] disabled:cursor-not-allowed disabled:border-[#cbd7d3] disabled:bg-[#cbd7d3] disabled:text-white dark:focus-visible:outline-[#58a9d6] dark:disabled:border-[#454545] dark:disabled:bg-[#454545] dark:disabled:text-[#aaa]',
  {
    variants: {
      variant: {
        primary: 'border-[#1677b7] bg-[#1677b7] text-white hover:border-[#0f5e91] hover:bg-[#0f5e91] dark:border-[#1677b7] dark:bg-[#1677b7] dark:text-white dark:hover:border-[#0f5e91] dark:hover:bg-[#0f5e91]',
        cta: 'border-[#1677b7] bg-white text-[#12618f] hover:border-white hover:bg-[#1677b7] hover:text-white dark:border-[#58a9d6] dark:bg-[#1b2926] dark:text-[#8fc8e5] dark:hover:border-white dark:hover:bg-[#1677b7] dark:hover:text-white',
        secondary: 'border-[#78aeca] bg-transparent text-[#12618f] hover:bg-[#e3f1f9] hover:text-[#0f5e91] dark:border-[#4c8bb0] dark:text-[#8fc8e5] dark:hover:border-[#58a9d6] dark:hover:bg-[#233f50] dark:hover:text-white',
        outline: 'border-[#78aeca] bg-transparent text-[#12618f] hover:border-[#0f5e91] hover:bg-[#0f5e91] hover:text-white dark:border-[#4c8bb0] dark:text-[#8fc8e5] dark:hover:border-[#58a9d6] dark:hover:bg-[#1677b7] dark:hover:text-white',
        ghost: 'border-transparent bg-transparent text-[#12618f] hover:bg-[#e3f1f9] hover:text-[#0f5e91] dark:text-[#8fc8e5] dark:hover:bg-[#233f50] dark:hover:text-white',
      },
      size: {
        default: 'min-h-11 px-4',
        compact: 'min-h-8 px-3',
        icon: 'size-8 p-0',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & VariantProps<typeof buttonVariants>

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
