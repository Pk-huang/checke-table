export type View = 'upload' | 'processing' | 'review' | 'complete'

export type ReviewField = {
  id: string
  label: string
  value: string
  group: string
  page: number
  confidence?: number | null
  required?: boolean
  candidates?: string[]
}

export const groups = ['基本資料', '營養標示', '檢驗結果', '廠商資訊'] as const

export const initialFields: ReviewField[] = [
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
