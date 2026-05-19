import * as XLSX from 'xlsx'
import type { LogisticsRow } from '../types'
import { findMissingColumns, mapHeaderToField } from './columnMap'
import { cleanRows } from './cleanRows'

export interface ParseResult {
  rows: LogisticsRow[]
  missingColumns: string[]
  sheetName: string
}

export async function parseExcelFile(file: File): Promise<ParseResult> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array', cellDates: true })

  const sheetName = workbook.SheetNames[0]
  if (!sheetName) {
    return { rows: [], missingColumns: ['No sheets found in workbook'], sheetName: '' }
  }

  const sheet = workbook.Sheets[sheetName]
  const json = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
    defval: '',
    raw: true,
  })

  if (json.length === 0) {
    return { rows: [], missingColumns: [], sheetName }
  }

  const headers = Object.keys(json[0] ?? {})
  const missingColumns = findMissingColumns(headers)

  const mappedRows = json.map((row) => {
    const mapped: Record<string, unknown> = {}
    for (const [header, value] of Object.entries(row)) {
      const field = mapHeaderToField(header)
      if (field) mapped[field] = value
    }
    return mapped
  })

  const rows = cleanRows(mappedRows)
  return { rows, missingColumns, sheetName }
}
