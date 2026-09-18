import type { ReviewField } from '../models/extraction'

export function validateRequiredFields(fields: ReviewField[]) {
  return fields.filter((field) => field.required && !field.value.trim())
}
