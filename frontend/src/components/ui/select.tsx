import * as SelectPrimitive from '@radix-ui/react-select'
import { cva } from 'class-variance-authority'
import { Check, ChevronDown } from 'lucide-react'
import type { ComponentProps, ReactNode } from 'react'
import { cn } from './utils'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

const selectTriggerVariants = cva('inline-flex min-h-10 w-full items-center justify-between border border-[#bbb] bg-white px-3 text-xs text-[#333] outline-none focus:border-[#2c837a] focus:ring-3 focus:ring-[#e5f1ee] dark:border-[#666] dark:bg-[#111] dark:text-[#eee] dark:focus:border-white dark:focus:ring-[#444]')
const selectContentVariants = cva('z-20 min-w-(--radix-select-trigger-width) overflow-hidden border border-[#bbb] bg-white shadow-[0_12px_28px_rgba(0,0,0,.12)] dark:border-[#666] dark:bg-[#222] dark:shadow-[0_12px_28px_rgba(0,0,0,.4)]')
const selectItemVariants = cva('relative flex cursor-pointer items-center justify-between px-3 py-2 text-xs text-[#333] outline-none data-[highlighted]:bg-[#e5e5e5] data-[highlighted]:text-[#111] dark:text-[#eee] dark:data-[highlighted]:bg-[#444] dark:data-[highlighted]:text-white')

type SelectTriggerProps = ComponentProps<typeof SelectPrimitive.Trigger> & { children: ReactNode }

export function SelectTrigger({ children, className, ...props }: SelectTriggerProps) {
  return <SelectPrimitive.Trigger className={cn(selectTriggerVariants(), className)} {...props}>{children}<SelectPrimitive.Icon><ChevronDown size={15} /></SelectPrimitive.Icon></SelectPrimitive.Trigger>
}

type SelectContentProps = ComponentProps<typeof SelectPrimitive.Content> & { children: ReactNode }

export function SelectContent({ children, className, ...props }: SelectContentProps) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content className={cn(selectContentVariants(), className)} position="popper" {...props}><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>
}

type SelectItemProps = ComponentProps<typeof SelectPrimitive.Item> & { children: ReactNode }

export function SelectItem({ value, children, className, ...props }: SelectItemProps) {
  return <SelectPrimitive.Item className={cn(selectItemVariants(), className)} value={value} {...props}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator><Check size={14} /></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>
}
