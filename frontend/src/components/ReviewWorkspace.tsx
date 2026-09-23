import { ArrowLeft, ArrowRight, Check, FileText } from 'lucide-react'
import { Button } from './ui/button'
import { Alert } from './ui/alert'
import { ReviewGroup } from './ReviewGroup'
import { ReviewSummary } from './ReviewSummary'
import type { ReviewField } from '../models/extraction'
import { useState } from 'react'

type ReviewWorkspaceProps = { filename?: string; fields: ReviewField[]; groups: readonly string[]; expandedGroups: string[]; missingFields: ReviewField[]; onToggleGroup: (group: string) => void; onFieldChange: (id: string, value: string) => void; onRestart: () => void; onComplete: () => void }
type FieldFilter = 'all' | 'missing' | 'low-confidence' | 'complete'

export function ReviewWorkspace({ filename, fields, groups, expandedGroups, missingFields, onToggleGroup, onFieldChange, onRestart, onComplete }: ReviewWorkspaceProps) {
  const [activeFilter, setActiveFilter] = useState<FieldFilter>('all')
  const [activeGroup, setActiveGroup] = useState('all')
  const statusFilteredFields = fields.filter((field) => {
    if (activeFilter === 'missing') return field.required && !field.value.trim()
    if (activeFilter === 'low-confidence') return field.confidence !== undefined && field.confidence !== null && field.confidence < 0.7
    if (activeFilter === 'complete') return Boolean(field.value.trim())
    return true
  })
  const filteredFields = statusFilteredFields.filter((field) => activeGroup === 'all' || field.group === activeGroup)
  const groupOptions = [{ value: 'all', label: '全部分類', count: statusFilteredFields.length }, ...groups.map((group) => ({ value: group, label: group, count: statusFilteredFields.filter((field) => field.group === group).length }))]

  return <div className="mx-auto max-w-[1280px]">
    <div className="mb-[30px] flex items-center justify-between gap-4">
      <h2 className="text-[clamp(26px,3vw,36px)] leading-[1.2] text-[#202827] dark:text-white">確認解析結果</h2>
      <Button type="button" variant="cta" onClick={onRestart}><ArrowLeft size={15} />重新上傳</Button>
    </div>
    <div className="mt-[-8px] flex items-center gap-[13px] border border-[#dde6e3] bg-[#f8faf9] px-[18px] py-4 shadow-[0_0_0_1px_rgba(12,35,41,0.02)] dark:border-[#444] dark:bg-[#1f2524]">
      <div className="flex items-center gap-2.5 text-[#3c789c] dark:text-[#b7d1df]"><FileText size={19} /><strong className="text-[13px] text-[#222] dark:text-[#eee]">{filename || '食品標示文件.pdf'}</strong><span className="rounded-md bg-[#eaf5fb] px-2 py-1 text-[10px] font-semibold text-[#315f7b] dark:bg-[#2d4858] dark:text-[#b7d1df]">解析完成</span></div>
    </div>
    <ReviewSummary fields={fields} missingCount={missingFields.length} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
    <div className="mb-5 border-b border-[#e0e4e3] pb-3 dark:border-[#454545]"><div className="flex flex-wrap items-center gap-2"><span className="mr-2 text-[11px] font-bold uppercase tracking-[0.08em] text-[#667472] dark:text-[#b5c3c1]">資料分類</span>{groupOptions.map((option) => <button type="button" key={option.value} className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${activeGroup === option.value ? 'border-[#1677b7] bg-[#1677b7] text-white shadow-sm' : 'border-[#d7dfe0] bg-white text-[#5a6663] hover:border-[#86b9d9] hover:text-[#12618f] dark:border-[#4f5655] dark:bg-[#1d2323] dark:text-[#dbe7e5] dark:hover:border-[#58a9d6] dark:hover:text-[#8fc8e5]'}`} onClick={() => setActiveGroup(option.value)}>{option.label}<span className="ml-1.5 opacity-75">{option.count}</span></button>)}</div></div>
    <div className="space-y-2.5">{groups.map((group) => { const groupFields = filteredFields.filter((field) => field.group === group); return groupFields.length ? <ReviewGroup key={group} name={group} fields={groupFields} expanded={expandedGroups.includes(group)} onToggle={() => onToggleGroup(group)} onFieldChange={onFieldChange} /> : null })}{!filteredFields.length && <div className="border border-dashed border-[#cfd9d6] bg-[#f9fbfa] py-12 text-center text-sm text-[#6d7a7a] dark:border-[#555] dark:bg-[#1c2322] dark:text-[#aaa]">目前篩選條件沒有符合的欄位</div>}</div>
    <div className="sticky bottom-0 mt-[30px] flex items-center justify-end gap-[13px] bg-[linear-gradient(transparent,#f1f5f3_32%)] py-4 pb-[3px] dark:bg-[linear-gradient(transparent,#111_32%)] max-[820px]:flex-col max-[820px]:items-start"><Alert tone={missingFields.length ? 'warning' : 'success'}>{missingFields.length ? <>還有 {missingFields.length} 個必填欄位待補</> : <><Check size={16} />所有必填欄位已完成</>}</Alert><Button type="button" className="max-[820px]:w-full" disabled={missingFields.length > 0} onClick={onComplete}>確認送出<ArrowRight size={17} /></Button></div>
  </div>
}
