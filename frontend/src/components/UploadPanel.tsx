import { Check, CloudUpload, FileText, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Alert } from './ui/alert'
import type { ChangeEvent } from 'react'

type UploadPanelProps = {
  selectedFile: File | null
  error?: string
  onFileChange: (file: File | undefined) => void
  onClearFile: () => void
  onStart: () => void
}

export function UploadPanel({ selectedFile, error, onFileChange, onClearFile, onStart }: UploadPanelProps) {
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => onFileChange(event.target.files?.[0])
  const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

  return <div className="screen upload-screen">
    <div className="screen-heading"><div><span className="eyebrow">STEP 01 / START</span><h2>上傳待審核文件</h2></div><span className="mock-label">UI PREVIEW</span></div>
    <div className="upload-layout">
      <label className={`dropzone ${selectedFile ? 'has-file' : ''}`}>
        <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
        <span className="upload-icon"><CloudUpload size={28} /></span>
        <strong>{selectedFile ? '文件已準備好' : '將文件拖放至此處'}</strong>
        <span>{selectedFile ? '可重新選擇其他文件' : '或點擊此處從裝置選擇'}</span>
        <span className="file-hint">支援 PDF、PNG、JPG，單檔最大 10 MB</span>
      </label>
      <div className="upload-side-note"><span className="eyebrow">WHAT HAPPENS NEXT</span><h3>讓資料先被看見，再被確認。</h3><p>系統會將文件內容整理成可編輯的欄位，方便你快速檢查低信心與缺漏資料。</p><div className="mini-stat"><FileText size={18} /><span>單次處理一份文件</span></div><div className="mini-stat"><Check size={18} /><span>保留欄位來源頁碼</span></div></div>
    </div>
    {selectedFile && <div className="selected-file"><div className="file-symbol"><FileText size={19} /></div><div><strong>{selectedFile.name}</strong><span>{formatSize(selectedFile.size)} · 已選擇</span></div><Button type="button" variant="text" className="text-button" onClick={onClearFile}>重新選擇</Button></div>}
    {error && <Alert className="validation-warning">{error}</Alert>}
    <div className="action-row upload-actions"><span className="muted-note">上傳後會連線至後端解析服務</span><Button type="button" disabled={!selectedFile} onClick={onStart}><Upload size={17} />開始解析</Button></div>
  </div>
}
