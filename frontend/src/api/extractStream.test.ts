import { describe, expect, it, vi } from 'vitest'
import { parseExtractionMessage, streamExtraction, type ExtractionEvent } from './extractStream'

describe('parseExtractionMessage', () => {
  it('maps backend SSE events to frontend extraction events', () => {
    expect(parseExtractionMessage({ event: 'stage', data: '{"stage":"比對欄位","progress":70,"total":18}' })).toEqual({
      type: 'stage',
      stage: '比對欄位',
      progress: 70,
      total: 18,
    })

    expect(parseExtractionMessage({ event: 'field', data: '{"id":"f1","label":"品名","group":"基本資料","value":"","confidence":null,"required":true,"page":1}' })).toEqual({
      type: 'field',
      field: {
        id: 'f1',
        label: '品名',
        group: '基本資料',
        value: '',
        confidence: null,
        required: true,
        page: 1,
      },
    })

    expect(parseExtractionMessage({ event: 'done', data: '{"stage":"完成","progress":100,"field_count":18}' })).toEqual({
      type: 'done',
      stage: '完成',
      progress: 100,
      fieldCount: 18,
    })

    expect(parseExtractionMessage({ event: 'error', data: '{"message":"解析服務暫時無法回應","code":"UPSTREAM_TIMEOUT"}' })).toEqual({
      type: 'error',
      message: '解析服務暫時無法回應',
      code: 'UPSTREAM_TIMEOUT',
    })
  })
})

describe('streamExtraction', () => {
  it('reads split SSE chunks and emits parsed events in order', async () => {
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(encoder.encode('event: stage\ndata: {"stage":"接收文件","progress":5}\n\nevent: fie'))
        controller.enqueue(encoder.encode('ld\ndata: {"id":"f1","label":"品名","group":"基本資料","value":"火腿","confidence":0.93,"required":true,"page":1}\n\n'))
        controller.enqueue(encoder.encode('event: done\ndata: {"stage":"完成","progress":100,"field_count":1}\n\n'))
        controller.close()
      },
    })
    const events: ExtractionEvent[] = []
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(stream, { status: 200 }))

    await streamExtraction('doc-123', {
      speed: 5,
      onEvent: (event) => events.push(event),
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/documents/doc-123/extract?speed=5', {
      signal: undefined,
    })
    expect(events.map((event) => event.type)).toEqual(['stage', 'field', 'done'])
    expect(events[1]).toMatchObject({
      type: 'field',
      field: {
        label: '品名',
        confidence: 0.93,
      },
    })
  })
})