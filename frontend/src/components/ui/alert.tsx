import type { ReactNode } from 'react'

type AlertProps = {
  children: ReactNode
  className?: string
}

export function Alert({ children, className = '' }: AlertProps) {
  return <div className={`ui-alert ${className}`} role="status">{children}</div>
}
