import { useMemo, useState } from 'react'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  CircleAlert,
  CloudUpload,
  FileText,
  PencilLine,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react'
import './App.css'

type View = 'upload' | 'processing' | 'review' | 'complete'

type ReviewField = {
  id: string
  label: string
  value: string
  group: string
  page: number
  confidence?: number
  required?: boolean
  candidates?: string[]
}

const initialFields: ReviewField[] = [
  { id: 'name', label: '品名', value: '', group: '基本資料', page: 1, required: true },
  { id: 'date', label: '有效日期', value: '2027/01/08', group: '基本資料', page: 1, required: true, confidence: 0.51 },
  { id: 'batch', label: '批號', value: 'A26031501', group: '基本資料', page: 1, confidence: 0.94 },
  { id: 'weight', label: '內容量', value: '200 公克', group: '基本資料', page: 1, confidence: 0.88, candidates: ['200 公克', '350 公克'] },
  { id: 'calories', label: '熱量', value: '132 大卡', group: '營養標示', page: 2, confidence: 0.91 },
  { id: 'protein', label: '蛋白質', value: '12.4 公克', group: '營養標示', page: 2, confidence: 0.87 },
  { id: 'test', label: '檢驗結果', value: '符合', group: '檢驗結果', page: 3, confidence: 0.63 },
  { id: 'vendor', label: '廠商名稱', value: '', group: '廠商資訊', page: 1, required: true },
  { id: 'phone', label: '廠商電話', value: '02-2345-6789', group: '廠商資訊', page: 1, confidence: 0.98 },
]

const groups = ['基本資料', '營養標示', '檢驗結果', '廠商資訊']

function App() {
  const [view, setView] = useState<View>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [fields, setFields] = useState(initialFields)
  const [expandedGroups, setExpandedGroups] = useState(groups)

  const missingFields = useMemo(
    () => fields.filter((field) => field.required && !field.value.trim()),
    [fields],
  )

  const handleFileChange = (file: File | undefined) => {
    if (file) setSelectedFile(file)
  }

  const updateField = (id: string, value: string) => {
    setFields((currentFields) =>
      currentFields.map((field) => (field.id === id ? { ...field, value } : field)),
    )
  }

  const toggleGroup = (group: string) => {
    setExpandedGroups((currentGroups) =>
      currentGroups.includes(group)
        ? currentGroups.filter((currentGroup) => currentGroup !== group)
        : [...currentGroups, group],
    )
  }

  const formatSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(2)} MB`

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-mark"><Sparkles size={17} /> CHECKTABLE</div>
        <div className="topbar-note"><span className="status-dot" />文件審核工作台</div>
      </header>

      <div className="workspace">
        <aside className="sidebar">
          <div className="sidebar-intro">
            <span className="eyebrow">DOCUMENT CONTROL</span>
            <h1>文件解析與審核</h1>
            <p>從文件中擷取資料，快速完成人工確認。</p>
          </div>
          <nav className="step-list" aria-label="處理流程">
            {[
              ['01', '開始上傳', 'upload'],
              ['02', '解析文件', 'processing'],
              ['03', '欄位審核', 'review'],
              ['04', '完成送出', 'complete'],
            ].map(([number, label, step]) => (
              <div className={`step-item ${view === step ? 'active' : ''}`} key={step}>
                <span className="step-number">{number}</span>
                <span>{label}</span>
                {view === step && <span className="step-arrow">→</span>}
              </div>
            ))}
          </nav>
          <div className="sidebar-footer">
            <ShieldCheck size={17} />
            <span>資料僅供本次審核使用</span>
          </div>
        </aside>

        <section className="content-area">
          {view === 'upload' && (
            <div className="screen upload-screen">
              <div className="screen-heading">
                <div><span className="eyebrow">STEP 01 / START</span><h2>上傳待審核文件</h2></div>
                <span className="mock-label">UI PREVIEW</span>
              </div>
              <div className="upload-layout">
                <label className={`dropzone ${selectedFile ? 'has-file' : ''}`}>
                  <input type="file" accept=".pdf,.png,.jpg,.jpeg" onChange={(event) => handleFileChange(event.target.files?.[0])} />
                  <span className="upload-icon"><CloudUpload size={28} /></span>
                  <strong>{selectedFile ? '文件已準備好' : '將文件拖放至此處'}</strong>
                  <span>{selectedFile ? '可重新選擇其他文件' : '或點擊此處從裝置選擇'}</span>
                  <span className="file-hint">支援 PDF、PNG、JPG，單檔最大 10 MB</span>
                </label>
                <div className="upload-side-note">
                  <span className="eyebrow">WHAT HAPPENS NEXT</span>
                  <h3>讓資料先被看見，再被確認。</h3>
                  <p>系統會將文件內容整理成可編輯的欄位，方便你快速檢查低信心與缺漏資料。</p>
                  <div className="mini-stat"><FileText size={18} /><span>單次處理一份文件</span></div>
                  <div className="mini-stat"><Check size={18} /><span>保留欄位來源頁碼</span></div>
                </div>
              </div>
              {selectedFile && (
                <div className="selected-file">
                  <div className="file-symbol"><FileText size={19} /></div>
                  <div><strong>{selectedFile.name}</strong><span>{formatSize(selectedFile.size)} · 已選擇</span></div>
                  <button type="button" className="text-button" onClick={() => setSelectedFile(null)}>重新選擇</button>
                </div>
              )}
              <div className="action-row upload-actions">
                <span className="muted-note">目前為畫面展示模式</span>
                <button type="button" className="primary-button" disabled={!selectedFile} onClick={() => setView('processing')}><Upload size={17} />開始解析</button>
              </div>
            </div>
          )}

          {view === 'processing' && (
            <div className="screen processing-screen">
              <div className="screen-heading"><div><span className="eyebrow">STEP 02 / PROCESSING</span><h2>正在解析文件</h2></div><span className="processing-badge"><span className="pulse-dot" />進行中</span></div>
              <div className="processing-card">
                <div className="processing-orbit"><Sparkles size={25} /></div>
                <span className="eyebrow">CURRENT STAGE</span><h3>辨識文件版面</h3><p>正在整理文件內容，請稍候片刻。</p>
                <div className="progress-track"><span /></div><div className="progress-meta"><span>已完成 42%</span><span>預計還需一分鐘</span></div>
              </div>
              <div className="processing-details"><div><span className="detail-label">目前文件</span><strong>{selectedFile?.name || '食品標示文件.pdf'}</strong></div><div><span className="detail-label">已擷取欄位</span><strong>尚未完成</strong></div></div>
              <div className="action-row"><button type="button" className="secondary-button" onClick={() => setView('upload')}><ArrowLeft size={17} />取消並返回</button><button type="button" className="primary-button" onClick={() => setView('review')}>查看範例結果<ArrowRight size={17} /></button></div>
            </div>
          )}

          {view === 'review' && (
            <div className="screen review-screen">
              <div className="screen-heading"><div><span className="eyebrow">STEP 03 / REVIEW</span><h2>確認解析結果</h2></div><span className="mock-label">MOCK DATA</span></div>
              <div className="review-filebar"><div className="review-file-name"><FileText size={19} /><strong>{selectedFile?.name || '食品標示文件.pdf'}</strong><span>解析完成</span></div><button type="button" className="secondary-button compact" onClick={() => setView('upload')}><ArrowLeft size={15} />重新上傳</button></div>
              <div className="summary-grid"><div><span>欄位總數</span><strong>{fields.length}</strong></div><div className={missingFields.length ? 'warning-summary' : ''}><span>待補必填</span><strong>{missingFields.length}</strong></div><div><span>建議檢查</span><strong>{fields.filter((field) => field.confidence !== undefined && field.confidence < 0.7).length}</strong></div></div>
              <div className="review-groups">
                {groups.map((group) => {
                  const groupFields = fields.filter((field) => field.group === group)
                  const isExpanded = expandedGroups.includes(group)
                  return <section className="field-group" key={group}><button type="button" className="group-heading" onClick={() => toggleGroup(group)}><span><strong>{group}</strong><small>{groupFields.length} 個欄位</small></span><ChevronDown className={isExpanded ? 'rotated' : ''} size={19} /></button>{isExpanded && <div className="field-list">{groupFields.map((field) => <label className={`review-field ${field.required && !field.value ? 'field-missing' : ''}`} key={field.id}><span className="field-label">{field.label}{field.required && <em>必填</em>}<small>第 {field.page} 頁{field.confidence !== undefined && field.confidence < 0.7 && <b><CircleAlert size={12} />建議檢查</b>}</small></span><span className="field-control">{field.candidates ? <select value={field.value} onChange={(event) => updateField(field.id, event.target.value)}>{field.candidates.map((candidate) => <option key={candidate}>{candidate}</option>)}<option value="">自訂輸入</option></select> : <input value={field.value} placeholder="尚未擷取，請輸入" onChange={(event) => updateField(field.id, event.target.value)} />}<PencilLine size={15} /></span></label>)}</div>}</section>
                })}
              </div>
              <div className="action-row review-actions"><span className={missingFields.length ? 'validation-warning' : 'validation-ok'}>{missingFields.length ? <><CircleAlert size={16} />還有 {missingFields.length} 個必填欄位待補</> : <><Check size={16} />所有必填欄位已完成</>}</span><button type="button" className="primary-button" disabled={missingFields.length > 0} onClick={() => setView('complete')}>確認送出<ArrowRight size={17} /></button></div>
            </div>
          )}

          {view === 'complete' && <div className="screen complete-screen"><div className="success-mark"><Check size={34} /></div><span className="eyebrow">REVIEW COMPLETE</span><h2>資料已完成審核</h2><p>這是第一版 UI 展示流程。正式送出功能將在後端 endpoint 準備後接上。</p><div className="complete-file"><FileText size={19} /><span>{selectedFile?.name || '食品標示文件.pdf'}</span><Check size={17} /></div><button type="button" className="primary-button" onClick={() => setView('review')}><ArrowLeft size={17} />返回查看資料</button></div>}
        </section>
      </div>
    </main>
  )
}

export default App
