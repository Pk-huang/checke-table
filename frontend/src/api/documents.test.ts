import { afterEach, describe, expect, it, vi } from 'vitest'
import { uploadDocument } from './documents'

describe('uploadDocument', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('posts the selected file and maps document_id to documentId', async () => {
    const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({
      document_id: 'doc-123',
      filename: 'report.pdf',
    }), { status: 200 }))
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' })

    await expect(uploadDocument(file)).resolves.toEqual({
      documentId: 'doc-123',
      filename: 'report.pdf',
    })

    expect(fetchMock).toHaveBeenCalledWith('/api/documents', {
      method: 'POST',
      body: expect.any(FormData),
    })

    const formData = fetchMock.mock.calls[0]?.[1]?.body as FormData
    expect(formData.get('file')).toBe(file)
  })

  it('throws a user-facing error when upload fails', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, { status: 500 }))
    const file = new File(['content'], 'report.pdf', { type: 'application/pdf' })

    await expect(uploadDocument(file)).rejects.toThrow('文件上傳失敗，請稍後重試')
  })
})