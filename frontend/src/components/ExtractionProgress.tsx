import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react'
import { Button } from './ui/button'
import { Progress } from './ui/progress'

type ExtractionProgressProps = { filename?: string; onCancel: () => void; onShowResult: () => void }

export function ExtractionProgress({ filename, onCancel, onShowResult }: ExtractionProgressProps) {
  return <div className="screen processing-screen">
    <div className="screen-heading"><
      div><span className="eyebrow">STEP 02 / PROCESSING</span><h2>正在解析文件</h2></div><span className="processing-badge"><span className="pulse-dot" />進行中</span></div>
    <div className="processing-card"><div className="processing-orbit"><Sparkles size={25} /></div><span className="eyebrow">CURRENT STAGE</span><h3>辨識文件版面</h3><p>正在整理文件內容，請稍候片刻。</p><Progress value={42} /><div className="progress-meta"><span>已完成 42%</span><span>預計還需一分鐘</span></div></div>
    <div className="processing-details"><div><span className="detail-label">目前文件</span><strong>{filename || '食品標示文件.pdf'}</strong></div><div><span className="detail-label">已擷取欄位</span><strong>尚未完成</strong></div></div>
    <div className="action-row"><Button type="button" variant="secondary" onClick={onCancel}><ArrowLeft size={17} />取消並返回</Button><Button type="button" onClick={onShowResult}>查看範例結果<ArrowRight size={17} /></Button></div>
  </div>
}
