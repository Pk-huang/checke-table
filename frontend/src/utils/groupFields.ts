import type { ReviewField } from '../models/extraction'

export function groupFields(fields: ReviewField[], groupNames: readonly string[]) {
  return groupNames.reduce<Record<string, ReviewField[]>>((groupedFields, groupName) => {
    groupedFields[groupName] = fields.filter((field) => field.group === groupName)
    return groupedFields
  }, {})
}
