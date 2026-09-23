import { cva, type VariantProps } from 'class-variance-authority'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 rounded-md border text-xs font-bold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2c837a] disabled:cursor-not-allowed disabled:border-[#cbd7d3] disabled:bg-[#cbd7d3] disabled:text-white',
  {
    variants: {
      variant: {
        primary: 'border-[#202827] bg-[#202827] text-white hover:bg-[#394845] dark:border-white dark:bg-white dark:text-[#111] dark:hover:bg-[#ddd]',
        secondary: 'border-[#9abbb2] bg-transparent text-[#2c837a] hover:bg-[#e5f1ee] hover:text-[#216b64] dark:border-[#666] dark:text-[#ddd] dark:hover:bg-[#333]',
        outline: 'border-[#9abbb2] bg-transparent text-[#2c837a] hover:border-[#216b64] hover:bg-[#216b64] hover:text-white dark:border-[#666] dark:text-[#ddd] dark:hover:border-[#ddd] dark:hover:bg-[#333]',
        ghost: 'border-transparent bg-transparent text-[#2c837a] hover:bg-[#e5f1ee] hover:text-[#216b64] dark:text-[#ddd] dark:hover:bg-[#333]',
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
