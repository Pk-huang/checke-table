import { CloudUpload, FileText, Trash2, Upload } from 'lucide-react'
import { Button } from './ui/button'
import { Alert } from './ui/alert'
import { useRef, type ChangeEvent } from 'react'

type UploadPanelProps = {
  selectedFiles: File[]
  error?: string
  onFilesChange: (files: File[]) => void
  onRemoveFile: (index: number) => void
  onStart: () => void
}

export function UploadPanel({ selectedFiles, error, onFilesChange, onRemoveFile, onStart }: UploadPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    onFilesChange([...selectedFiles, ...Array.from(event.target.files ?? [])])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }
  const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

  return <div className="mx-auto max-w-[1280px]">
    <h2 className="mb-8 text-left text-[clamp(26px,3vw,36px)] font-semibold leading-[1.2] text-[#202827] dark:text-white">上傳文件</h2>
    <input ref={fileInputRef} className="hidden" type="file" multiple accept=".pdf,.png,.jpg,.jpeg" onChange={handleFileChange} />
    {!selectedFiles.length && <div>
      <div className="flex min-h-[310px] flex-col items-center justify-center gap-2.5 border border-[#d6e0dc] bg-white text-center dark:border-[#1a2731] dark:bg-[#090f15]">
        <span className="mb-2 grid size-[58px] place-items-center rounded-full bg-[#e8f0f5] text-[#3c789c] dark:bg-[#0d1f2d] dark:text-[#b7d1df]"><CloudUpload size={28} /></span>
        <strong className="text-base text-[#202827] dark:text-[#e7f0f4]">將文件拖放至此處</strong>
        <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}><CloudUpload size={17} />打開資料夾</Button>
        <span className="mt-[22px] text-[11px] text-[#888] dark:text-[#a3b1b8]">支援 PDF、PNG、JPG，可一次加入多份文件</span>
      </div>
    </div>}
    {!!selectedFiles.length && <div className="mt-[42px] grid gap-2">
      {selectedFiles.map((file, index) => <div className="flex items-center gap-[13px] bg-white px-[18px] py-4 dark:bg-[#243631]" key={`${file.name}-${file.lastModified}-${index}`}><div className="grid size-[35px] place-items-center bg-[#e8f0f5] text-[#3c789c] dark:bg-[#2d4858] dark:text-[#b7d1df]"><FileText size={19} /></div><div className="min-w-0"><strong className="block truncate text-[13px] text-[#222] dark:text-[#f0f6f3]">{file.name}</strong><span className="mt-[3px] block text-[11px] text-[#888] dark:text-[#a9bab5]">{formatSize(file.size)} · 已選擇</span></div><Button type="button" variant="ghost" size="icon" className="ml-auto shrink-0" aria-label={`刪除 ${file.name}`} title={`刪除 ${file.name}`} onClick={() => onRemoveFile(index)}><Trash2 size={16} /></Button></div>)}
      <Button type="button" variant="secondary" className="w-full" onClick={() => fileInputRef.current?.click()}><Upload size={17} />拖曳繼續上傳 / 打開資料夾</Button>
    </div>}
    {error && <Alert tone="warning">{error}</Alert>}
    <div className="mt-4 flex items-center justify-end gap-[13px]"><Button type="button" disabled={!selectedFiles.length} onClick={onStart}><Upload size={17} />開始解析</Button></div>
  </div>
}
