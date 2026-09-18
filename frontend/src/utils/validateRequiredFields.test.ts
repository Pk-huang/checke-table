import { describe, expect, it } from 'vitest'
import type { ReviewField } from '../models/extraction'
import { validateRequiredFields } from './validateRequiredFields'

describe('validateRequiredFields', () => {
  it('returns only required fields with empty or whitespace-only values', () => {
    const fields: ReviewField[] = [
      {
        id: 'name',
        label: '品名',
        value: '',
        group: '基本資料',
        page: 1,
        required: true,
      },
      {
        id: 'date',
        label: '有效日期',
        value: '   ',
        group: '基本資料',
        page: 1,
        required: true,
      },
      {
        id: 'vendor',
        label: '廠商名稱',
        value: '某某食品股份有限公司',
        group: '廠商資訊',
        page: 1,
        required: true,
      },
      {
        id: 'phone',
        label: '廠商電話',
        value: '',
        group: '廠商資訊',
        page: 1,
        required: false,
      },
    ]

    expect(validateRequiredFields(fields).map((field) => field.label)).toEqual([
      '品名',
      '有效日期',
    ])
  })
})