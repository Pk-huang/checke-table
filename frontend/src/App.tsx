import { useMemo, useRef, useState } from 'react'
import { Moon, ShieldCheck, Sparkles, Sun } from 'lucide-react'
import { uploadDocument, type UploadedDocument } from './api/documents'
import { streamExtraction, type ExtractionStage } from './api/extractStream'
import { CompleteView } from './components/CompleteView'
import { ExtractionProgress } from './components/ExtractionProgress'
import { ReviewWorkspace } from './components/ReviewWorkspace'
import { UploadPanel } from './components/UploadPanel'
import { groups, type View, type ReviewField } from './models/extraction'
import { groupFields } from './utils/groupFields'
import { validateRequiredFields } from './utils/validateRequiredFields'

function getExtractionTestOptions() {
    const params = new URLSearchParams(window.location.search)
    const fieldCountParam = params.get('field_count')
    const speedParam = params.get('speed')
    const failAtParam = params.get('fail_at')
    const fieldCount = fieldCountParam === null ? undefined : Number(fieldCountParam)
    const speed = speedParam === null ? undefined : Number(speedParam)
    const failAt = failAtParam === null ? undefined : Number(failAtParam)

    return {
        fieldCount: fieldCount !== undefined && Number.isInteger(fieldCount) && fieldCount >= 1 ? fieldCount : undefined,
        speed: speed !== undefined && Number.isFinite(speed) && speed > 0 ? speed : undefined,
        failAt: failAt !== undefined && Number.isInteger(failAt) && failAt >= 0 ? failAt : undefined,
    }
}

function App() {
    const [view, setView] = useState<View>('upload')
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [uploadedDocument, setUploadedDocument] = useState<UploadedDocument | null>(null)
    const [fields, setFields] = useState<ReviewField[]>([])
    const [extractionStage, setExtractionStage] = useState<ExtractionStage>({ stage: '等待上傳', progress: 0 })
    const [extractionError, setExtractionError] = useState<string | undefined>()
    const [uploadError, setUploadError] = useState<string | undefined>()
    const [expandedGroups, setExpandedGroups] = useState<string[]>([...groups])
    const [isDarkMode, setIsDarkMode] = useState(false)
    const abortControllerRef = useRef<AbortController | null>(null)
    const activeTaskRef = useRef(0)
    const groupedFields = useMemo(() => groupFields(fields, groups), [fields])
    const missingFields = useMemo(() => validateRequiredFields(fields), [fields])

    const updateField = (id: string, value: string) => {
        setFields((currentFields) => currentFields.map((field) => field.id === id ? { ...field, value } : field))
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups((currentGroups) => currentGroups.includes(group) ? currentGroups.filter((currentGroup) => currentGroup !== group) : [...currentGroups, group])
    }

    const startExtraction = async () => {
        if (!selectedFile) {
            return
        }

        const taskId = activeTaskRef.current + 1
        const abortController = new AbortController()
        activeTaskRef.current = taskId
        abortControllerRef.current?.abort()
        abortControllerRef.current = abortController
        let didUpload = false
        setView('processing')
        setFields([])
        setUploadedDocument(null)
        setUploadError(undefined)
        setExtractionError(undefined)
        setExtractionStage({ stage: '上傳文件', progress: 0 })

        try {
            const document = await uploadDocument(selectedFile)
            didUpload = true
            if (activeTaskRef.current !== taskId || abortController.signal.aborted) {
                return
            }

            setUploadedDocument(document)
            setExtractionStage({ stage: '等待解析', progress: 5 })

            await streamExtraction(document.documentId, {
                signal: abortController.signal,
                ...getExtractionTestOptions(),
                onEvent: (event) => {
                    if (activeTaskRef.current !== taskId || abortController.signal.aborted) {
                        return
                    }

                    if (event.type === 'stage') {
                        setExtractionStage({ stage: event.stage, progress: event.progress, total: event.total })
                    }

                    if (event.type === 'field') {
                        setFields((currentFields) => [...currentFields, event.field])
                    }

                    if (event.type === 'error') {
                        setExtractionError(`${event.message} (${event.code})`)
                        abortController.abort()
                    }

                    if (event.type === 'done') {
                        setExtractionStage({ stage: event.stage, progress: event.progress })
                        setView('review')
                    }
                },
            })
        } catch (error) {
            if (abortController.signal.aborted) {
                return
            }

            const message = error instanceof Error ? error.message : '處理文件時發生未知錯誤'
            if (didUpload) {
                setExtractionError(message)
            } else {
                setUploadError(message)
                setView('upload')
            }
        }
    }

    const cancelExtraction = () => {
        activeTaskRef.current += 1
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        setUploadedDocument(null)
        setFields([])
        setExtractionError(undefined)
        setExtractionStage({ stage: '等待上傳', progress: 0 })
        setView('upload')
    }

    const resetToUpload = () => {
        activeTaskRef.current += 1
        abortControllerRef.current?.abort()
        abortControllerRef.current = null
        setSelectedFile(null)
        setUploadedDocument(null)
        setFields([])
        setUploadError(undefined)
        setExtractionError(undefined)
        setExtractionStage({ stage: '等待上傳', progress: 0 })
        setView('upload')
    }

    return <main className={`min-h-svh bg-[#f1f5f3] text-[#202827] dark:bg-[#111] dark:text-[#ccc] ${isDarkMode ? 'dark' : ''}`}>
        <header className="flex h-[72px] items-center justify-between border-b border-[#d6e0dc] bg-white/92 px-[5vw] dark:border-[#444] dark:bg-[#111]/94">
            <div className="flex items-center gap-2 text-[13px] font-extrabold tracking-[1.7px] text-[#202827] dark:text-white"><Sparkles size={17} /> CHECKTABLE</div>
            <div className="flex items-center gap-[18px]">
                <div className="flex items-center gap-2 text-xs text-[#71807c] dark:text-[#aaa]"><span className="inline-block size-[7px] rounded-full bg-[#777] dark:bg-[#bbb]" />文件審核工作台</div>
                <button type="button" className="grid size-[34px] place-items-center rounded-full border border-[#bdbdbd] bg-white text-[#333] transition-colors hover:border-[#111] hover:bg-[#111] hover:text-white dark:border-[#666] dark:bg-[#222] dark:text-[#ddd] dark:hover:border-white dark:hover:bg-white dark:hover:text-[#111]" aria-label={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} title={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} onClick={() => setIsDarkMode((currentMode) => !currentMode)}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
            </div>
        </header>
        <div className="grid min-h-[calc(100svh-72px)] grid-cols-[260px_minmax(0,1fr)] max-[820px]:block">
            <aside className="flex w-[260px] flex-col border-r border-[#d6e0dc] bg-[#edf3f0] px-7 pb-[30px] pl-[4vw] pt-[58px] dark:border-[#444] dark:bg-[#111] max-[820px]:w-full max-[820px]:border-r-0 max-[820px]:border-b max-[820px]:px-[22px] max-[820px]:pb-[18px] max-[820px]:pt-7">
                <div className="max-[820px]:contents">
                    <span className="text-[10px] font-extrabold tracking-[1.5px] text-[#888] dark:text-[#999]">DOCUMENT CONTROL</span>
                    <h1 className="mt-[17px] text-[27px] leading-[1.22] text-[#202827] dark:text-white">文件解析與審核</h1>
                    <p className="mt-[13px] text-[13px] leading-[1.7] text-[#71807c] dark:text-[#aaa] max-[820px]:hidden">從文件中擷取資料，快速完成人工確認。</p>
                </div>
                <nav className="mt-[70px] grid gap-[13px] max-[820px]:mt-[25px] max-[820px]:grid-cols-4 max-[820px]:gap-[5px]" aria-label="處理流程">{[['01', '開始上傳', 'upload'], ['02', '解析文件', 'processing'], ['03', '欄位審核', 'review'], ['04', '完成送出', 'complete']].map(([number, label, step]) =>
                    <div className={`flex items-center gap-[13px] border-l-2 border-transparent px-3 py-[11px] text-[13px] text-[#777] max-[820px]:flex-col max-[820px]:gap-1 max-[820px]:border-x-0 max-[820px]:border-b-2 max-[820px]:px-[3px] max-[820px]:py-[9px] max-[820px]:text-center max-[820px]:text-[10px] dark:text-[#999] ${view === step ? 'border-[#2c837a] bg-[#e5f1ee] font-bold text-[#216b64] dark:border-white dark:bg-[#333] dark:text-white max-[820px]:border-b-[#2c837a]' : ''}`} key={step}>
                        <span className={`text-[10px] font-extrabold tracking-[1px] text-[#888] dark:text-[#999] ${view === step ? 'text-[#2c837a] dark:text-[#ddd]' : ''}`}>{number}</span>
                        <span>{label}</span>
                        {view === step && <span className="ml-auto text-[17px] max-[820px]:hidden">→</span>}
                    </div>)}
                </nav>
                <div className="mt-auto flex items-center gap-2 text-[11px] text-[#888] dark:text-[#999] max-[820px]:hidden">
                    <ShieldCheck size={17} />
                    <span>資料僅供本次審核使用</span>
                </div>
            </aside>
            <section className="bg-[radial-gradient(circle_at_90%_10%,#fff_0,transparent_30%),#f1f5f3] px-[clamp(30px,7vw,120px)] py-[58px] dark:bg-[radial-gradient(circle_at_90%_10%,#333_0,transparent_31%),#111] max-[820px]:px-[22px] max-[820px]:py-[38px] max-[820px]:pb-[50px]">
                {view === 'upload' && <UploadPanel selectedFile={selectedFile} error={uploadError} onFileChange={(file) => { setSelectedFile(file ?? null); setUploadError(undefined) }} onClearFile={() => setSelectedFile(null)} onStart={startExtraction} />}
                {view === 'processing' && <ExtractionProgress filename={uploadedDocument?.filename ?? selectedFile?.name} stage={extractionStage.stage} progress={extractionStage.progress} totalFields={extractionStage.total} receivedFieldCount={fields.length} error={extractionError} onCancel={cancelExtraction} onRetry={startExtraction} />}
                {view === 'review' && <ReviewWorkspace filename={uploadedDocument?.filename ?? selectedFile?.name} fields={fields} groups={groups} expandedGroups={expandedGroups} missingFields={missingFields} onToggleGroup={toggleGroup} onFieldChange={updateField} onRestart={resetToUpload} onComplete={() => setView('complete')} />}
                {view === 'complete' && <CompleteView filename={uploadedDocument?.filename ?? selectedFile?.name} onBack={() => setView('review')} />}
            </section>
        </div>
        <span className="sr-only">{Object.keys(groupedFields).length} 個欄位群組</span>
    </main>
}

export default App
