import type { ReviewField } from '../models/extraction'

type ReviewSummaryProps = { fields: ReviewField[]; missingCount: number }

export function ReviewSummary({ fields, missingCount }: ReviewSummaryProps) {
  const lowConfidenceCount = fields.filter((field) => field.confidence !== undefined && field.confidence !== null && field.confidence < 0.7).length
  return <div className="summary-grid"><div><span>欄位總數</span><strong>{fields.length}</strong></div><div className={missingCount ? 'warning-summary' : ''}><span>待補必填</span><strong>{missingCount}</strong></div><div><span>建議檢查</span><strong>{lowConfidenceCount}</strong></div></div>
}
