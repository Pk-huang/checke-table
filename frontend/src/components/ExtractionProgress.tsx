import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Alert } from './ui/alert'

type ExtractionProgressProps = {
  filename?: string
  stage: string
  progress: number
  receivedFieldCount: number
  totalFields?: number
  error?: string
  onCancel: () => void
  onRetry: () => void
}

export function ExtractionProgress({ filename, stage, progress, receivedFieldCount, totalFields, error, onCancel, onRetry }: ExtractionProgressProps) {
  return <div className="mx-auto max-w-[880px]">
    <div className="mb-[42px] flex items-start justify-between"><div><span className="text-[10px] font-extrabold tracking-[1.5px] text-[#888] dark:text-[#999]">STEP 02 / PROCESSING</span><h2 className="mt-3 text-[clamp(26px,3vw,36px)] leading-[1.2] text-[#202827] dark:text-white">{error ? '解析遇到問題' : '正在解析文件'}</h2></div><span className="flex items-center gap-2 border border-[#b9cbc5] bg-[#e8efec] px-2.5 py-[7px] text-[10px] font-extrabold tracking-[1px] text-[#51625e] dark:border-[#666] dark:bg-[#222] dark:text-[#ddd]"><span className="inline-block size-[7px] animate-pulse rounded-full bg-[#777] dark:bg-[#bbb]" />{error ? '需處理' : '進行中'}</span></div>
    <div className="mx-auto mt-[45px] max-w-[620px] border border-[#d6e0dc] bg-white px-6 py-[38px] text-center shadow-[0_18px_45px_rgba(55,88,78,.07)] dark:border-[#444] dark:bg-[#222] dark:shadow-[0_18px_45px_rgba(0,0,0,.2)] sm:px-14 sm:py-12"><div className="mx-auto mb-[26px] grid size-16 place-items-center rounded-full bg-[#e5f1ee] text-[#2c837a] dark:bg-[#333] dark:text-[#eee]"><Sparkles size={25} /></div><span className="text-[10px] font-extrabold tracking-[1.5px] text-[#888] dark:text-[#999]">CURRENT STAGE</span><h3 className="my-[13px] mb-2 text-[22px] text-[#202827] dark:text-white">{stage}</h3><p className="text-[13px] text-[#71807c] dark:text-[#aaa]">{error ? '解析已停止，請重試或重新選擇文件。' : '正在整理文件內容，請稍候片刻。'}</p><Progress value={progress} /><div className="mt-2.5 flex justify-between text-[11px] text-[#71807c] dark:text-[#aaa]"><span>已完成 {progress}%</span><span>{totalFields ? `預計欄位 ${totalFields} 筆` : '等待後端回傳欄位'}</span></div></div>
    <div className="mt-7 flex justify-center gap-[25px] text-left sm:gap-[85px]"><div className="grid gap-1"><span className="text-[10px] uppercase tracking-[1px] text-[#71807c] dark:text-[#aaa]">目前文件</span><strong className="text-xs font-semibold text-[#222] dark:text-[#eee]">{filename || '食品標示文件.pdf'}</strong></div><div className="grid gap-1"><span className="text-[10px] uppercase tracking-[1px] text-[#71807c] dark:text-[#aaa]">已擷取欄位</span><strong className="text-xs font-semibold text-[#222] dark:text-[#eee]">{receivedFieldCount} 筆</strong></div></div>
    {error && <Alert tone="warning">{error}</Alert>}
    <div className="mt-[30px] flex items-center justify-end gap-[13px]"><Button type="button" variant="secondary" onClick={onCancel}><ArrowLeft size={17} />取消並返回</Button>{error && <Button type="button" onClick={onRetry}>重新解析<ArrowRight size={17} /></Button>}</div>
  </div>
}
