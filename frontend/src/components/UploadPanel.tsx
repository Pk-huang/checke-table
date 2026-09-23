import { CloudUpload, FileText, RefreshCw, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Alert } from './ui/alert'
import { useRef, type ChangeEvent } from 'react'

type UploadPanelProps = {
  selectedFile: File | null
  error?: string
  onFileChange: (file: File | undefined) => void
  onClearFile: () => void
  onStart: () => void
}

export function UploadPanel({ selectedFile, error, onFileChange, onClearFile, onStart }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => onFileChange(event.target.files?.[0])
  const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

  return <div className="mx-auto max-w-[880px]">
    <div className="mb-[42px] flex items-start justify-between"><div><span className="text-[15px] font-extrabold tracking-[1px] text-[#888] dark:text-[#999]">STEP 01 / START</span></div></div>
    <input ref={fileInputRef} type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
    {!selectedFile && <div>
      <div className="flex min-h-[310px] flex-col items-center justify-center gap-2.5 text-center">
        <span className="mb-2 grid size-[58px] place-items-center rounded-full bg-[#e5f1ee] text-[#2c837a] dark:bg-[#333] dark:text-[#eee]"><CloudUpload size={28} /></span>
        <strong className="text-base text-[#202827] dark:text-[#eee]">將文件拖放至此處</strong>
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><CloudUpload size={17} />打開資料夾</Button>
        <span className="mt-[22px] text-[11px] text-[#888] dark:text-[#999]">支援 PDF、PNG、JPG，單檔最大 10 MB</span>
      </div>
    </div>}
    {selectedFile && <div className="mt-[42px] flex items-center gap-[13px] bg-white px-[18px] py-4 dark:bg-[#222]"><div className="grid size-[35px] place-items-center bg-[#e5f1ee] text-[#2c837a] dark:bg-[#333] dark:text-[#eee]"><FileText size={19} /></div><div><strong className="block text-[13px] text-[#222] dark:text-[#eee]">{selectedFile.name}</strong><span className="mt-[3px] block text-[11px] text-[#888] dark:text-[#999]">{formatSize(selectedFile.size)} · 已選擇</span></div><Button type="button" variant="ghost" size="icon" className="ml-auto" aria-label="重新選擇文件" title="重新選擇文件" onClick={onClearFile}><RefreshCw size={16} /></Button></div>}
    {error && <Alert tone="warning">{error}</Alert>}
    <div className="mt-4 flex items-center justify-end gap-[13px]"><Button type="button" disabled={!selectedFile} onClick={onStart}><Upload size={17} />開始解析</Button></div>
  </div>
}
