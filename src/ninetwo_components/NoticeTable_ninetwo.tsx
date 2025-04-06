import React from 'react'
import { decodeHTMLEntities } from '../lib/sanitize'
import clsx from 'clsx'

interface TableField {
  en: string
  te: string
  mappedIndex?: number
}

interface NoticeTableProps {
  fields: TableField[]
  rows: string[][]
  hasSubdivision: boolean
}

// Function to sanitize data by removing special characters
const sanitizeData = (data: string): string => {
  // First decode any HTML entities
  const decodedData = decodeHTMLEntities(data)

  // Then remove special characters like quotes, backticks, etc.
  // This regex matches quotes, backticks, and other special characters you might want to remove
  // Modified to preserve commas in the data
  return decodedData.replace(/['"` ]/g, (match) => {
    // Keep commas, remove other special characters
    return match === ',' ? ',' : ''
  })
}

const NoticeTable: React.FC<NoticeTableProps> = React.memo(({ fields, rows, hasSubdivision }) => {
  // Group rows by lpm number (first column)
  const rowGroups: { [key: string]: number[] } = {}
  rows.forEach((row, index) => {
    const lpm = row[0] || ''
    if (!rowGroups[lpm]) {
      rowGroups[lpm] = []
    }
    rowGroups[lpm].push(index)
  })

  // Create a map of row indices to their rowSpan values
  const rowSpans: { [key: number]: number } = {}
  Object.values(rowGroups).forEach((group) => {
    group.forEach((rowIndex, i) => {
      rowSpans[rowIndex] = i === 0 ? group.length : 0
    })
  })

  // Get the last two column indices (new extent columns)
  const lastColIndex = fields.length - 2
  const secondLastColIndex = fields.length - 3

  return (
    <div className='table-container table w-full overflow-x-auto'>
      <table className='khata-table9 mt-2 w-full border-collapse'>
        <thead>
          <tr className='font-gautami border border-black p-1 text-center align-middle font-bold'>
            <th colSpan={1} scope='col' className='align-middle'>
              ప్రస్తుత రీ సర్వే
            </th>
            <th colSpan={hasSubdivision ? 4 : 3} scope='col' className='align-middle'>
              రికార్డ్స్ అఫ్ రైట్స్ ప్రకారం
            </th>
            <th colSpan={2} scope='col' className='align-middle'>
              ప్రస్తుత రీ సర్వే ప్రకారము
            </th>
            <th rowSpan={3} scope='col' className='align-middle'>
              రిమార్కులు
            </th>
          </tr>

          <tr className='font-gautami border border-black p-1 text-center align-middle font-bold'>
            <th rowSpan={2} scope='col' className='align-middle'>
              ల్యాండ్ పార్సెల్ నెంబర్
            </th>
            <th rowSpan={2} scope='col' className='align-middle'>
              {hasSubdivision ? 'సర్వే నెంబరు' : 'సర్వే నెంబరు-సబ్ డివిజన్'}
            </th>
            {hasSubdivision && (
              <th rowSpan={2} scope='col' className='align-middle'>
                సబ్ డివిజన్ నెం లేదా లెటర్
              </th>
            )}
            <th colSpan={2} scope='col' className='align-middle'>
              విస్తీర్ణము
            </th>
            <th colSpan={2} scope='col' className='align-middle'>
              విస్తీర్ణము
            </th>
          </tr>

          <tr className='font-gautami border border-black p-1 text-center align-middle font-bold'>
            <th scope='col' className='align-middle'>
              ఎ. సెంట్లు
            </th>
            <th scope='col' className='align-middle'>
              హె.ఏర్లు. చ.మీ
            </th>
            <th scope='col' className='align-middle'>
              ఎ. సెంట్లు
            </th>
            <th scope='col' className='align-middle'>
              హె.ఏర్లు. చ.మీ
            </th>
          </tr>
        </thead>

        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={`row-${rowIndex}`}>
              {fields.map((field, colIndex) => {
                // Check if column should be merged (first column or last two columns)
                const shouldMerge =
                  (colIndex === 0 ||
                    colIndex === secondLastColIndex ||
                    colIndex === lastColIndex) &&
                  rowSpans[rowIndex] > 0

                if (shouldMerge) {
                  return (
                    <td
                      key={`cell-${rowIndex}-${colIndex}`}
                      rowSpan={rowSpans[rowIndex]}
                      className='border border-black p-1 text-center align-middle'
                    >
                      {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                        ? sanitizeData(row[field.mappedIndex])
                        : ''}
                    </td>
                  )
                } else if (
                  colIndex !== 0 &&
                  colIndex !== secondLastColIndex &&
                  colIndex !== lastColIndex
                ) {
                  return (
                    <td
                      key={`cell-${rowIndex}-${colIndex}`}
                      className='border border-black p-1 text-center align-middle'
                    >
                      {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                        ? sanitizeData(row[field.mappedIndex])
                        : ''}
                    </td>
                  )
                }
                return null
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default NoticeTable
