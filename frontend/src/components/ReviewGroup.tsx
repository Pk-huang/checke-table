import { ChevronDown } from 'lucide-react'
import type { ReviewField as ReviewFieldModel } from '../models/extraction'
import { ReviewField } from './ReviewField'

type ReviewGroupProps = { name: string; fields: ReviewFieldModel[]; expanded: boolean; onToggle: () => void; onFieldChange: (id: string, value: string) => void }

export function ReviewGroup({ name, fields, expanded, onToggle, onFieldChange }: ReviewGroupProps) {
  return <section className="mb-2.5 border border-[#d2d2d2] bg-white/70 dark:border-[#444] dark:bg-[#222]/80"><button type="button" className="flex w-full items-center justify-between px-[18px] py-4 text-left text-[#333] dark:text-[#ddd]" onClick={onToggle}><span className="flex items-center gap-[13px]"><strong>{name}</strong><small className="text-[11px] font-normal text-[#888] dark:text-[#999]">{fields.length} 個欄位</small></span><ChevronDown className={`text-[#71918a] transition-transform dark:text-[#8ea39d] ${expanded ? 'rotate-180' : ''}`} size={19} /></button>{expanded && <div className="border-t border-[#d5d5d5] px-[18px] pb-2 dark:border-[#444]">{fields.map((field) => <ReviewField key={field.id} field={field} onChange={onFieldChange} />)}</div>}</section>
}
