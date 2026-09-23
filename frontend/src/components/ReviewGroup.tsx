import { ChevronDown } from 'lucide-react'
import type { ReviewField as ReviewFieldModel } from '../models/extraction'
import { ReviewField } from './ReviewField'

type ReviewGroupProps = { name: string; fields: ReviewFieldModel[]; expanded: boolean; onToggle: () => void; onFieldChange: (id: string, value: string) => void }

export function ReviewGroup({ name, fields, expanded, onToggle, onFieldChange }: ReviewGroupProps) {
  return <section className="overflow-hidden rounded-lg border border-[#dfe8e5] bg-[#f8faf9] dark:border-[#404949] dark:bg-[#1a2121]"><button type="button" className="flex w-full items-center justify-between px-[12px] py-[8px] text-left text-[#2d3534] dark:text-[#e7efed]" onClick={onToggle}><span className="flex items-center gap-[8px]"><strong className="text-[13px] font-semibold">{name}</strong><small className="rounded-full bg-[#edf3f2] px-1.5 py-[1px] text-[9px] font-medium text-[#64716f] dark:bg-[#2a3433] dark:text-[#c4d3d0]">{fields.length}</small></span><ChevronDown className={`text-[#6a8480] transition-transform dark:text-[#9eb7b3] ${expanded ? 'rotate-180' : ''}`} size={15} /></button>{expanded && <div className="border-t border-[#e5ecea] bg-white/80 px-[8px] pb-1 dark:border-[#404949] dark:bg-[#141b1b]">{fields.map((field) => <ReviewField key={field.id} field={field} onChange={onFieldChange} />)}</div>}</section>
}
