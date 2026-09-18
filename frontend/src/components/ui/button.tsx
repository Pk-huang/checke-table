import type { ButtonHTMLAttributes } from 'react'
import { cn } from './utils'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'text'
}

export function Button({ className, variant = 'primary', ...props }: ButtonProps) {
  return <button className={cn(`${variant}-button`, className)} {...props} />
}
