type CsvRow = Record<string, string>

function parseCsv(csv: string): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ''
  let inQuotes = false

  for (let i = 0; i < csv.length; i += 1) {
    const char = csv[i]
    const next = csv[i + 1]

    if (inQuotes) {
      if (char === '"' && next === '"') {
        cell += '"'
        i += 1
        continue
      }
      if (char === '"') {
        inQuotes = false
        continue
      }
      cell += char
      continue
    }

    if (char === '"') {
      inQuotes = true
      continue
    }

    if (char === ',') {
      row.push(cell)
      cell = ''
      continue
    }

    if (char === '\n') {
      row.push(cell)
      rows.push(row)
      row = []
      cell = ''
      continue
    }

    if (char !== '\r') {
      cell += char
    }
  }

  if (cell.length > 0 || row.length > 0) {
    row.push(cell)
    rows.push(row)
  }

  return rows
}

export function parseAdminExportCsv(csv: string): CsvRow[] {
  const rows = parseCsv(csv)
  const [headers, ...dataRows] = rows

  if (!headers || headers.length === 0) {
    return []
  }

  return dataRows
    .filter((row) => row.some((value) => value.length > 0))
    .map((row) =>
      headers.reduce<CsvRow>((record, header, index) => {
        record[header] = row[index] ?? ''
        return record
      }, {})
    )
}
