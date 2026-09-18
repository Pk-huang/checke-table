import { ArrowLeft, Check, FileText } from 'lucide-react'
import { Button } from './ui/button'

type CompleteViewProps = { filename?: string; onBack: () => void }

export function CompleteView({ filename, onBack }: CompleteViewProps) {
  return <div className="screen complete-screen"><div className="success-mark"><Check size={34} /></div><span className="eyebrow">REVIEW COMPLETE</span><h2>資料已完成審核</h2><p>這是第一版 UI 展示流程。正式送出功能將在後端 endpoint 準備後接上。</p><div className="complete-file"><FileText size={19} /><span>{filename || '食品標示文件.pdf'}</span><Check size={17} /></div><Button type="button" onClick={onBack}><ArrowLeft size={17} />返回查看資料</Button></div>
}
