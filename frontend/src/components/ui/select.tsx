import * as SelectPrimitive from '@radix-ui/react-select'
import { Check, ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value

export function SelectTrigger({ children }: { children: ReactNode }) {
  return <SelectPrimitive.Trigger className="text-select-trigger">{children}<SelectPrimitive.Icon><ChevronDown size={15} /></SelectPrimitive.Icon></SelectPrimitive.Trigger>
}

export function SelectContent({ children }: { children: ReactNode }) {
  return <SelectPrimitive.Portal><SelectPrimitive.Content className="text-select-content" position="popper"><SelectPrimitive.Viewport>{children}</SelectPrimitive.Viewport></SelectPrimitive.Content></SelectPrimitive.Portal>
}

export function SelectItem({ value, children }: { value: string; children: ReactNode }) {
  return <SelectPrimitive.Item className="text-select-item" value={value}><SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText><SelectPrimitive.ItemIndicator><Check size={14} /></SelectPrimitive.ItemIndicator></SelectPrimitive.Item>
}
