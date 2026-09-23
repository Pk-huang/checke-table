import { describe, expect, it } from 'vitest'
import type { ReviewField } from '../models/extraction'
import { groupFields } from './groupFields'

describe('groupFields', () => {
  it('groups interleaved backend fields while preserving order within each group', () => {
    const fields: ReviewField[] = [
      { id: 'f1', label: '品名', value: '火腿', group: '基本資料', page: 1 },
      { id: 'f2', label: '熱量', value: '132 大卡', group: '營養標示', page: 2 },
      { id: 'f3', label: '批號', value: 'A26031501', group: '基本資料', page: 1 },
      { id: 'f4', label: '廠商名稱', value: '某某食品', group: '廠商資訊', page: 1 },
      { id: 'f5', label: '蛋白質', value: '12.4 公克', group: '營養標示', page: 2 },
    ]

    const groupedFields = groupFields(fields, ['基本資料', '營養標示', '檢驗結果', '廠商資訊'])

    expect(groupedFields['基本資料'].map((field) => field.id)).toEqual(['f1', 'f3'])
    expect(groupedFields['營養標示'].map((field) => field.id)).toEqual(['f2', 'f5'])
    expect(groupedFields['檢驗結果']).toEqual([])
    expect(groupedFields['廠商資訊'].map((field) => field.id)).toEqual(['f4'])
  })
})