import { useMemo, useState } from 'react'
import { Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react'
import { CompleteView } from './components/CompleteView'
import { ExtractionProgress } from './components/ExtractionProgress'
import { ReviewWorkspace } from './components/ReviewWorkspace'
import { UploadPanel } from './components/UploadPanel'
import { initialFields, groups, type View, type ReviewField } from './models/extraction'
import { groupFields } from './utils/groupFields'
import { validateRequiredFields } from './utils/validateRequiredFields'
import './App.css'

function App() {
    const [view, setView] = useState<View>('upload')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [fields, setFields] = useState<ReviewField[]>(initialFields)
    const [expandedGroups, setExpandedGroups] = useState<string[]>([...groups])
    const [isDarkMode, setIsDarkMode] = useState(false)
    const groupedFields = useMemo(() => groupFields(fields, groups), [fields])
    const missingFields = useMemo(() => validateRequiredFields(fields), [fields])

    const updateField = (id: string, value: string) => {
        setFields((currentFields) => currentFields.map((field) => field.id === id ? { ...field, value } : field))
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups((currentGroups) => currentGroups.includes(group) ? currentGroups.filter((currentGroup) => currentGroup !== group) : [...currentGroups, group])
    }

    const resetToUpload = () => {
        setSelectedFile(null)
        setFields(initialFields)
        setView('upload')
    }

    return <main className={`app-shell ${isDarkMode ? 'dark-theme' : ''}`}>
        <header className="topbar"><div className="brand-mark"><Sparkles size={17} /> CHECKTABLE</div><div className="topbar-actions"><div className="topbar-note"><span className="status-dot" />文件審核工作台</div><button type="button" className="theme-toggle" aria-label={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} title={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} onClick={() => setIsDarkMode((currentMode) => !currentMode)}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</button></div></header>
        <div className="workspace">
            <aside className="sidebar">
                <div className="sidebar-intro">
                    <span className="eyebrow">DOCUMENT CONTROL</span>
                    <h1>文件解析與審核</h1>
                    <p>從文件中擷取資料，快速完成人工確認。</p>
                </div>
                <nav className="step-list" aria-label="處理流程">{[['01', '開始上傳', 'upload'], ['02', '解析文件', 'processing'], ['03', '欄位審核', 'review'], ['04', '完成送出', 'complete']].map(([number, label, step]) =>
                    <div className={`step-item ${view === step ? 'active' : ''}`} key={step}>
                        <span className="step-number">{number}</span>
                        <span>{label}</span>
                        {view === step && <span className="step-arrow">→
                        </span>}</div>)}
                </nav>
                <div className="sidebar-footer">
                    <ShieldCheck size={17} />
                    <span>資料僅供本次審核使用</span>
                </div>
            </aside>
            <section className="content-area">
                {view === 'upload' && <UploadPanel selectedFile={selectedFile} onFileChange={(file) => setSelectedFile(file ?? null)} onClearFile={() => setSelectedFile(null)} onStart={() => setView('processing')} />}
                {view === 'processing' && <ExtractionProgress filename={selectedFile?.name} onCancel={() => setView('upload')} onShowResult={() => setView('review')} />}
                {view === 'review' && <ReviewWorkspace filename={selectedFile?.name} fields={fields} groups={groups} expandedGroups={expandedGroups} missingFields={missingFields} onToggleGroup={toggleGroup} onFieldChange={updateField} onRestart={resetToUpload} onComplete={() => setView('complete')} />}
                {view === 'complete' && <CompleteView filename={selectedFile?.name} onBack={() => setView('review')} />}
            </section>
        </div>
        <span className="sr-only">{Object.keys(groupedFields).length} 個欄位群組</span>
    </main>
}

export default App
