import type { ReviewField } from '../models/extraction'

export type MockDocument = {
  documentId: string
  filename: string
  fields: ReviewField[]
}

export function createMockDocument(filename: string, fields: ReviewField[]): MockDocument {
  return {
    documentId: 'mock-document',
    filename,
    fields,
  }
}
