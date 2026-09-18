import { CircleAlert, PencilLine } from 'lucide-react'
import { Input } from './ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import type { ReviewField as ReviewFieldModel } from '../models/extraction'

type ReviewFieldProps = { field: ReviewFieldModel; onChange: (id: string, value: string) => void }

export function ReviewField({ field, onChange }: ReviewFieldProps) {
  const isMissing = field.required && !field.value.trim()
  const isLowConfidence = field.confidence !== undefined && field.confidence !== null && field.confidence < 0.7
  const isCustomValue = Boolean(field.candidates && !field.candidates.includes(field.value))
  return <label className={`review-field ${isMissing ? 'field-missing' : ''}`}><span className="field-label">{field.label}{field.required && <em>必填</em>}<small>第 {field.page} 頁{isLowConfidence && <b><CircleAlert size={12} />建議檢查</b>}</small></span><span className="field-control">{field.candidates ? <>{<Select value={isCustomValue ? '__custom__' : field.value} onValueChange={(value) => onChange(field.id, value === '__custom__' ? '' : value)}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent>{field.candidates.map((candidate) => <SelectItem key={candidate} value={candidate}>{candidate}</SelectItem>)}<SelectItem value="__custom__">自訂輸入</SelectItem></SelectContent></Select>}{isCustomValue && <Input value={field.value} placeholder="請輸入自訂值" onChange={(event) => onChange(field.id, event.target.value)} />}</> : <Input value={field.value} placeholder="尚未擷取，請輸入" onChange={(event) => onChange(field.id, event.target.value)} />}<PencilLine size={15} /></span></label>
}
