import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Alert } from './ui/alert'
import { ReviewGroup } from './ReviewGroup'
import { ReviewSummary } from './ReviewSummary'
import type { ReviewField } from '../models/extraction'

type ReviewWorkspaceProps = { filename?: string; fields: ReviewField[]; groups: readonly string[]; expandedGroups: string[]; missingFields: ReviewField[]; onToggleGroup: (group: string) => void; onFieldChange: (id: string, value: string) => void; onRestart: () => void; onComplete: () => void }

export function ReviewWorkspace({ filename, fields, groups, expandedGroups, missingFields, onToggleGroup, onFieldChange, onRestart, onComplete }: ReviewWorkspaceProps) {
  return <div className="screen review-screen"><div className="screen-heading"><div><span className="eyebrow">STEP 03 / REVIEW</span><h2>確認解析結果</h2></div><span className="mock-label">MOCK DATA</span></div><div className="review-filebar"><div className="review-file-name"><FileText size={19} /><strong>{filename || '食品標示文件.pdf'}</strong><span>解析完成</span></div><Button type="button" variant="secondary" className="compact" onClick={onRestart}><ArrowLeft size={15} />重新上傳</Button></div><ReviewSummary fields={fields} missingCount={missingFields.length} /><div className="review-groups">{groups.map((group) => <ReviewGroup key={group} name={group} fields={fields.filter((field) => field.group === group)} expanded={expandedGroups.includes(group)} onToggle={() => onToggleGroup(group)} onFieldChange={onFieldChange} />)}</div><div className="action-row review-actions"><Alert className={missingFields.length ? 'validation-warning' : 'validation-ok'}>{missingFields.length ? <>還有 {missingFields.length} 個必填欄位待補</> : <><Check size={16} />所有必填欄位已完成</>}</Alert><Button type="button" disabled={missingFields.length > 0} onClick={onComplete}>確認送出<ArrowRight size={17} /></Button></div></div>
}
