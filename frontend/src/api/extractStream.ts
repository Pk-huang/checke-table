export type MockExtractionStage = {
  stage: string
  progress: number
}

export const mockExtractionStages: MockExtractionStage[] = [
  { stage: '接收文件', progress: 5 },
  { stage: '辨識文件版面', progress: 42 },
  { stage: '抽取欄位', progress: 75 },
  { stage: '完成', progress: 100 },
]
