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
  return decodedData.replace(/['"` ]/g, '')
}

const NoticeTable: React.FC<NoticeTableProps> = React.memo(({ fields, rows, hasSubdivision }) => {
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
              {fields.map((field, colIndex) => (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className='border border-black p-1 text-center align-middle'
                >
                  {field.mappedIndex !== undefined && row[field.mappedIndex] !== undefined
                    ? sanitizeData(row[field.mappedIndex])
                    : ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default NoticeTable
