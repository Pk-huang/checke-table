import { createParser, type EventSourceMessage } from 'eventsource-parser'
import type { ReviewField } from '../models/extraction'

export type ExtractionStage = {
  stage: string
  progress: number
  total?: number
}

export type ExtractionEvent =
  | { type: 'stage'; stage: string; progress: number; total?: number }
  | { type: 'field'; field: ReviewField }
  | { type: 'done'; stage: string; progress: number; fieldCount: number }
  | { type: 'error'; message: string; code: string }

export type StreamExtractionOptions = {
  signal?: AbortSignal
  fieldCount?: number
  speed?: number
  failAt?: number
  onEvent: (event: ExtractionEvent) => void
}

type RawStageEvent = {
  stage: string
  progress: number
  total?: number
}

type RawDoneEvent = {
  stage: string
  progress: number
  field_count: number
}

type RawErrorEvent = {
  message: string
  code: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export function parseExtractionMessage(message: EventSourceMessage): ExtractionEvent {
  const data = JSON.parse(message.data) as unknown

  switch (message.event) {
    case 'stage': {
      const stageEvent = data as RawStageEvent
      return {
        type: 'stage',
        stage: stageEvent.stage,
        progress: stageEvent.progress,
        total: stageEvent.total,
      }
    }
    case 'field':
      return {
        type: 'field',
        field: data as ReviewField,
      }
    case 'done': {
      const doneEvent = data as RawDoneEvent
      return {
        type: 'done',
        stage: doneEvent.stage,
        progress: doneEvent.progress,
        fieldCount: doneEvent.field_count,
      }
    }
    case 'error': {
      const errorEvent = data as RawErrorEvent
      return {
        type: 'error',
        message: errorEvent.message,
        code: errorEvent.code,
      }
    }
    default:
      throw new Error(`不支援的解析事件：${message.event ?? 'message'}`)
  }
}

export async function streamExtraction(documentId: string, options: StreamExtractionOptions): Promise<void> {
  const query = new URLSearchParams()

  if (options.fieldCount !== undefined) {
    query.set('field_count', String(options.fieldCount))
  }

  if (options.speed !== undefined) {
    query.set('speed', String(options.speed))
  }

  if (options.failAt !== undefined) {
    query.set('fail_at', String(options.failAt))
  }

  const queryString = query.toString()
  const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}/extract${queryString ? `?${queryString}` : ''}`, {
    signal: options.signal,
  })

  if (!response.ok || !response.body) {
    throw new Error('文件解析失敗，請稍後重試')
  }

  const decoder = new TextDecoder()
  const parser = createParser({
    onEvent: (message) => {
      const event = parseExtractionMessage(message)
      if (import.meta.env.DEV) {
        console.log('[extraction] SSE event', event)
      }
      options.onEvent(event)
    },
  })

  for await (const chunk of response.body) {
    if (options.signal?.aborted) {
      return
    }

    parser.feed(decoder.decode(chunk, { stream: true }))
  }

  parser.feed(decoder.decode())
}
