import { CircleAlert, PencilLine } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { ReviewField as ReviewFieldModel } from '../models/extraction'

type ReviewFieldProps = { field: ReviewFieldModel; onChange: (id: string, value: string) => void }

export function ReviewField({ field, onChange }: ReviewFieldProps) {
  const isMissing = field.required && !field.value.trim()
  const isLowConfidence = field.confidence !== undefined && field.confidence !== null && field.confidence < 0.7
  const isCustomValue = Boolean(field.candidates && !field.candidates.includes(field.value))
  return <label className="grid grid-cols-[1fr_1.2fr] items-center gap-[22px] border-b border-[#d5d5d5] py-[14px] last:border-b-0 dark:border-[#444] max-[820px]:grid-cols-1 max-[820px]:gap-2"><span className="text-[13px] text-[#333] dark:text-[#ddd]">{field.label}{field.required && <em className="ml-[7px] bg-[#e5e5e5] px-[5px] py-[3px] text-[9px] not-italic text-[#444] dark:bg-[#444] dark:text-[#ddd]">必填</em>}<small className="mt-[5px] block text-[10px] text-[#888] dark:text-[#999]">第 {field.page} 頁{isLowConfidence && <b className="ml-[9px] inline-flex items-center gap-1 font-semibold text-[#555] dark:text-[#ccc]"><CircleAlert size={12} />建議檢查</b>}</small></span><span className="relative flex items-center">{field.candidates ? <>{<Select value={isCustomValue ? '__custom__' : field.value} onValueChange={(value) => onChange(field.id, value === '__custom__' ? '' : value)}><SelectTrigger aria-invalid={isMissing}><SelectValue /></SelectTrigger><SelectContent>{field.candidates.map((candidate) => <SelectItem key={candidate} value={candidate}>{candidate}</SelectItem>)}<SelectItem value="__custom__">自訂輸入</SelectItem></SelectContent></Select>}{isCustomValue && <Input aria-invalid={isMissing} value={field.value} placeholder="請輸入自訂值" onChange={(event) => onChange(field.id, event.target.value)} />}</> : <Input aria-invalid={isMissing} value={field.value} placeholder="尚未擷取，請輸入" onChange={(event) => onChange(field.id, event.target.value)} />}<PencilLine className="pointer-events-none absolute right-[11px] text-[#9cafaa]" size={15} /></span></label>
}
