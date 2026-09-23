import { ArrowLeft, Check, FileText } from 'lucide-react'
import { Button } from './ui/button'

type CompleteViewProps = { filename?: string; onBack: () => void }

export function CompleteView({ filename, onBack }: CompleteViewProps) {
  return <div className="mx-auto flex max-w-[12800px] flex-col items-center pt-[45px] text-center sm:pt-[90px]"><div className="mb-[26px] grid size-16 place-items-center rounded-full bg-[#3c789c] text-white dark:bg-[#79a9c2] dark:text-[#172522]"><Check size={34} /></div><h2 className="text-[34px] text-[#202827] dark:text-white">資料已完成審核</h2><p className="mt-[14px] max-w-[430px] text-[13px] leading-[1.8] text-[#71807c] dark:text-[#aaa]">這是第一版 UI 展示流程。正式送出功能將在後端 endpoint 準備後接上。</p><div className="my-[30px] mb-[23px] flex w-full max-w-[400px] items-center justify-between gap-[13px] border border-[#d6e0dc] bg-white px-[18px] py-4 text-left text-[13px] text-[#202827] dark:border-[#444] dark:bg-[#222] dark:text-[#eee]"><FileText size={19} /><span className="flex-1">{filename || '食品標示文件.pdf'}</span><Check className="text-[#3c789c] dark:text-[#b7d1df]" size={17} /></div><Button type="button" onClick={onBack}><ArrowLeft size={17} />返回查看資料</Button></div>
}
