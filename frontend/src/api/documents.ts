export type UploadedDocument = {
  documentId: string
  filename: string
}

type UploadDocumentResponse = {
  document_id: string
  filename: string
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? ''

export async function uploadDocument(file: File): Promise<UploadedDocument> {
  const formData = new FormData()
  formData.append('file', file)

  const response = await fetch(`${API_BASE_URL}/api/documents`, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error('文件上傳失敗，請稍後重試')
  }

  const documentResponse = await response.json() as UploadDocumentResponse

  return {
    documentId: documentResponse.document_id,
    filename: documentResponse.filename,
  }
}
