import { cva, type VariantProps } from 'class-variance-authority'
import type { InputHTMLAttributes } from 'react'
import { cn } from './utils'

const inputVariants = cva(
  'min-h-10 w-full border bg-white px-3 pr-9 text-xs text-[#333] outline-none placeholder:text-[#888] focus:border-[#2c837a] focus:ring-3 focus:ring-[#e5f1ee] aria-invalid:border-[#777] aria-invalid:bg-[#f0f0f0] dark:border-[#666] dark:bg-[#111] dark:text-[#eee] dark:placeholder:text-[#999] dark:focus:border-white dark:focus:ring-[#444] dark:aria-invalid:border-[#999] dark:aria-invalid:bg-[#333]',
  {
    variants: {
      size: {
        default: '',
      },
    },
    defaultVariants: {
      size: 'default',
    },
  },
)

type InputProps = InputHTMLAttributes<HTMLInputElement> & VariantProps<typeof inputVariants>

export function Input({ className, size, ...props }: InputProps) {
  return <input className={cn(inputVariants({ size }), className)} {...props} />
}
