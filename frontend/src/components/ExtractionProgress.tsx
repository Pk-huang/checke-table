import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'
import { Alert } from './ui/alert'
import { useEffect, useState } from 'react'

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  useEffect(() => {
    const startedAt = Date.now()
    const timer = window.setInterval(() => setElapsedSeconds(Math.floor((Date.now() - startedAt) / 1000)), 1000)
    return () => window.clearInterval(timer)
  }, [])

  const stageLabels: Record<string, string> = {
    上傳文件: '正在上傳文件',
    等待解析: '正在準備解析',
    抽取欄位: '正在辨識文件欄位',
    整理欄位: '正在整理可審核資料',
  }
  const readableStage = stageLabels[stage] ?? stage
  const remainingSeconds = progress > 5 ? Math.max(1, Math.ceil((elapsedSeconds / progress) * (100 - progress))) : undefined

  return <div className="mx-auto max-w-[1280px]">
    <div className="mb-[42px] flex items-start justify-between">
      <div>
        <h2 className="text-[clamp(26px,3vw,36px)] leading-[1.2] text-[#202827] dark:text-white">{error ? '解析遇到問題' : '正在解析文件'}
        </h2>
      </div>
      <span className={`flex items-center gap-2 border px-2.5 py-[7px] text-[10px] font-extrabold tracking-[1px] ${error ? 'border-[#e4572e] bg-[#fff0ea] text-[#e4572e] dark:border-[#ff8a65] dark:bg-[#43231b] dark:text-[#ff8a65]' : 'border-[#a8bfd0] bg-[#e8f0f5] text-[#315f7b] dark:border-[#52758c] dark:bg-[#243a48] dark:text-[#b7d1df]'}`}>
        <span className={`inline-block size-[7px] rounded-full ${error ? 'bg-[#e4572e]' : 'animate-pulse bg-[#1677b7]'}`} />{error ? '需處理' : '進行中'}</span>
    </div>

    <div className="mx-auto mt-[45px] w-full max-w-[1280px] border border-[#d6e0dc] bg-white px-6 py-[38px] text-center shadow-[0_18px_45px_rgba(55,88,78,.07)] dark:border-[#3a524c] dark:bg-[#243631] dark:shadow-[0_18px_45px_rgba(0,0,0,.2)] sm:px-14 sm:py-12">
      <div className="mx-auto mb-[26px] grid size-16 place-items-center rounded-full bg-[#e8f0f5] text-[#3c789c] dark:bg-[#2d4858] dark:text-[#b7d1df]">
        <Sparkles size={25} />
      </div>
      <span className="text-[10px] font-extrabold tracking-[1.5px] text-[#888] dark:text-[#a9bab5]">CURRENT STAGE</span>
      <h3 className="my-[13px] mb-2 text-[24px] text-[#202827] dark:text-[#f0f6f3]">{readableStage}
      </h3>
      <p className="text-[13px] text-[#71807c] dark:text-[#a9bab5]">{error ? '解析已停止，請重試或重新選擇文件。' : '正在整理文件內容，請稍候片刻。'}</p>
      <Progress value={progress} /><div className="mt-3 flex justify-between text-[12px] font-semibold text-[#315f7b] dark:text-[#b7d1df]">
        <span>已完成 {progress}%</span>

        <span>{remainingSeconds ? `預計還需約 ${remainingSeconds} 秒` : '正在計算處理進度'}</span>
      </div>

      {error && <div className="mt-6 border-t border-[#e4572e] pt-4 text-left dark:border-[#ff8a65]"><Alert tone="warning">{error}</Alert></div>}
      <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[#d6d6d6] pt-5 text-left dark:border-[#454545]"><div className="grid gap-1"><span className="text-[10px] uppercase tracking-[1px] text-[#707070] dark:text-[#aaa]">目前文件
      </span>
        <strong className="truncate text-xs font-semibold text-[#222] dark:text-[#f0f6f3]">{filename || '食品標示文件.pdf'}
        </strong>
      </div>
        <div className="grid gap-1"><span className="text-[10px] uppercase tracking-[1px] text-[#71807c] dark:text-[#a9bab5]">已擷取欄位
        </span>
          <strong className="text-xs font-semibold text-[#222] dark:text-[#f0f6f3]">{receivedFieldCount} 筆{totalFields ? ` / ${totalFields} 筆` : ''}
          </strong>
        </div>
      </div>
    </div>

    <div className="mt-[30px] flex items-center justify-end gap-[13px]"><Button type="button" variant="ghost" onClick={onCancel}><ArrowLeft size={17} />取消並返回
    </Button>{error && <Button type="button" onClick={onRetry}>重新解析<ArrowRight size={17} />
    </Button>}
    </div>


  </div>

}
