import { useMemo, useRef, useState } from 'react'
import { Check, Moon, Sparkles, Sun } from 'lucide-react'
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
    const [selectedFiles, setSelectedFiles] = useState<File[]>([])
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
    const stepOrder: View[] = ['upload', 'processing', 'review', 'complete']
    const currentStepIndex = stepOrder.indexOf(view)

    const updateField = (id: string, value: string) => {
        setFields((currentFields) => currentFields.map((field) => field.id === id ? { ...field, value } : field))
    }

    const toggleGroup = (group: string) => {
        setExpandedGroups((currentGroups) => currentGroups.includes(group) ? currentGroups.filter((currentGroup) => currentGroup !== group) : [...currentGroups, group])
    }

    const startExtraction = async () => {
        if (!selectedFiles.length) {
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
            for (const [fileIndex, file] of selectedFiles.entries()) {
                setExtractionStage({ stage: `上傳文件 ${fileIndex + 1} / ${selectedFiles.length}`, progress: 0 })
                const document = await uploadDocument(file)
                didUpload = true
                if (activeTaskRef.current !== taskId || abortController.signal.aborted) {
                    return
                }

                setUploadedDocument(document)
                setExtractionStage({ stage: `等待解析 ${fileIndex + 1} / ${selectedFiles.length}`, progress: 5 })

                await streamExtraction(document.documentId, {
                    signal: abortController.signal,
                    ...getExtractionTestOptions(),
                    onEvent: (event) => {
                        if (activeTaskRef.current !== taskId || abortController.signal.aborted) {
                            return
                        }

                        if (event.type === 'stage') {
                            setExtractionStage({ stage: `${event.stage} (${fileIndex + 1} / ${selectedFiles.length})`, progress: event.progress, total: event.total })
                        }

                        if (event.type === 'field') {
                            setFields((currentFields) => [...currentFields, event.field])
                        }

                        if (event.type === 'error') {
                            throw new Error(`${event.message} (${event.code})`)
                        }

                        if (event.type === 'done') {
                            setExtractionStage({ stage: `完成文件 ${fileIndex + 1} / ${selectedFiles.length}`, progress: event.progress })
                        }
                    },
                })
            }
            setView('review')
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
        setSelectedFiles([])
        setUploadedDocument(null)
        setFields([])
        setUploadError(undefined)
        setExtractionError(undefined)
        setExtractionStage({ stage: '等待上傳', progress: 0 })
        setView('upload')
    }

    return <main className={`min-h-svh bg-[#f1f5f3] text-[#202827] dark:bg-[#101917] dark:text-[#d2dfdb] ${isDarkMode ? 'dark' : ''}`}>
        <header className="flex h-[72px] items-center justify-between border-b border-[#d6e0dc] bg-white/92 px-[5vw] dark:border-[#31413e] dark:bg-[#172522]">
            <div className="flex items-center gap-2 text-[13px] font-extrabold tracking-[1.7px] text-[#202827] dark:text-white"><Sparkles size={17} /> CHECKTABLE</div>
            <div className="flex items-center gap-[18px]">
                <div className="flex items-center gap-2 text-xs text-[#71807c] dark:text-[#aaa]"><span className="inline-block size-[7px] rounded-full bg-[#777] dark:bg-[#bbb]" />文件審核工作台</div>
                <button type="button" className="grid size-[34px] place-items-center rounded-full border border-[#bdbdbd] bg-white text-[#333] transition-colors hover:border-[#111] hover:bg-[#111] hover:text-white dark:border-[#666] dark:bg-[#222] dark:text-[#ddd] dark:hover:border-white dark:hover:bg-white dark:hover:text-[#111]" aria-label={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} title={isDarkMode ? '切換至淺色模式' : '切換至深色模式'} onClick={() => setIsDarkMode((currentMode) => !currentMode)}>{isDarkMode ? <Sun size={16} /> : <Moon size={16} />}</button>
            </div>
        </header>
        <div className="min-h-[calc(100svh-72px)]">
            <section className="min-h-[calc(100svh-72px)] bg-[#f1f2f1] px-[clamp(30px,7vw,120px)] py-[58px] dark:bg-[#1b2926] max-[820px]:px-[22px] max-[820px]:py-[38px] max-[820px]:pb-[50px]">
                <div className="mx-auto mb-10 flex w-full max-w-[1280px] items-start justify-center text-[12px] font-extrabold tracking-[1px] text-[#8a9692] dark:text-[#8fa7a0]" aria-label="目前處理進度">
                    {['開始上傳', '解析文件', '欄位審核', '完成送出'].map((label, index) => <div className="flex min-w-0 flex-1 flex-col items-center" key={label}>
                        <span className={`mb-3 truncate ${index === currentStepIndex ? 'text-[#315f7b] dark:text-[#b7d1df]' : ''}`}>{label}</span>
                        <div className="flex w-full items-center">
                            <span className={`h-1 flex-1 ${index === 0 ? 'bg-transparent' : index <= currentStepIndex ? 'bg-[#3c789c] dark:bg-[#79a9c2]' : 'bg-[#d2d2d2] dark:bg-[#454545]'}`} />
                            <span className={`relative z-10 grid size-10 shrink-0 place-items-center rounded-full border-2 text-sm ${index < currentStepIndex ? 'border-[#3c789c] bg-[#3c789c] text-white dark:border-[#79a9c2] dark:bg-[#79a9c2] dark:text-[#172522]' : index === currentStepIndex ? 'border-[#3c789c] bg-[#f1f2f1] text-[#3c789c] dark:border-[#79a9c2] dark:bg-[#1b2926] dark:text-[#b7d1df]' : 'border-[#c5c5c5] bg-[#c5c5c5] text-white dark:border-[#555] dark:bg-[#555]'}`}>{index < currentStepIndex ? <Check size={18} strokeWidth={2.5} /> : index + 1}</span>
                            <span className={`h-1 flex-1 ${index === 3 ? 'bg-transparent' : index < currentStepIndex ? 'bg-[#3c789c] dark:bg-[#79a9c2]' : 'bg-[#d2d2d2] dark:bg-[#454545]'}`} />
                        </div>
                    </div>)}
                </div>
                {view === 'upload' && <UploadPanel selectedFiles={selectedFiles} error={uploadError} onFilesChange={(files) => { setSelectedFiles(files); setUploadError(undefined) }} onRemoveFile={(index) => setSelectedFiles((files) => files.filter((_, fileIndex) => fileIndex !== index))} onStart={startExtraction} />}
                {view === 'processing' && <ExtractionProgress filename={uploadedDocument?.filename ?? selectedFiles[0]?.name} stage={extractionStage.stage} progress={extractionStage.progress} totalFields={extractionStage.total} receivedFieldCount={fields.length} error={extractionError} onCancel={cancelExtraction} onRetry={startExtraction} />}
                {view === 'review' && <ReviewWorkspace filename={uploadedDocument?.filename ?? selectedFiles[0]?.name} fields={fields} groups={groups} expandedGroups={expandedGroups} missingFields={missingFields} onToggleGroup={toggleGroup} onFieldChange={updateField} onRestart={resetToUpload} onComplete={() => setView('complete')} />}
                {view === 'complete' && <CompleteView filename={uploadedDocument?.filename ?? selectedFiles[0]?.name} onBack={() => setView('review')} />}
            </section>
        </div>
        <span className="sr-only">{Object.keys(groupedFields).length} 個欄位群組</span>
    </main>
}

export default App
