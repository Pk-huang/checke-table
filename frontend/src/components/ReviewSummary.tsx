import type { ReviewField } from '../models/extraction'

type ReviewSummaryProps = { fields: ReviewField[]; missingCount: number }

export function ReviewSummary({ fields, missingCount }: ReviewSummaryProps) {
  const lowConfidenceCount = fields.filter((field) => field.confidence !== undefined && field.confidence !== null && field.confidence < 0.7).length
  const summaryItemClassName = 'border border-[#d2d2d2] bg-white/70 px-[17px] py-[15px] dark:border-[#444] dark:bg-[#222]/80'

  return <div className="my-6 grid grid-cols-3 gap-3"><div className={summaryItemClassName}><span className="block text-[11px] text-[#888] dark:text-[#999]">欄位總數</span><strong className="mt-[5px] block text-[22px] text-[#333] dark:text-[#ddd]">{fields.length}</strong></div><div className={summaryItemClassName}><span className="block text-[11px] text-[#888] dark:text-[#999]">待補必填</span><strong className={`mt-[5px] block text-[22px] dark:text-[#ddd] ${missingCount ? 'text-[#c07b3b]' : 'text-[#333]'}`}>{missingCount}</strong></div><div className={summaryItemClassName}><span className="block text-[11px] text-[#888] dark:text-[#999]">建議檢查</span><strong className="mt-[5px] block text-[22px] text-[#333] dark:text-[#ddd]">{lowConfidenceCount}</strong></div></div>
}
