import { ChevronDown } from 'lucide-react'
import type { ReviewField as ReviewFieldModel } from '../models/extraction'
import { ReviewField } from './ReviewField'

type ReviewGroupProps = { name: string; fields: ReviewFieldModel[]; expanded: boolean; onToggle: () => void; onFieldChange: (id: string, value: string) => void }

export function ReviewGroup({ name, fields, expanded, onToggle, onFieldChange }: ReviewGroupProps) {
  return <section className="field-group"><button type="button" className="group-heading" onClick={onToggle}><span><strong>{name}</strong><small>{fields.length} 個欄位</small></span><ChevronDown className={expanded ? 'rotated' : ''} size={19} /></button>{expanded && <div className="field-list">{fields.map((field) => <ReviewField key={field.id} field={field} onChange={onFieldChange} />)}</div>}</section>
}
