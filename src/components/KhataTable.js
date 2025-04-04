import React from 'react'

const KhataTable = ({ notice = {}, noticeType = '', noticeMode = 'khata' }) => {
  // Check if notice has the required properties
  if (!notice || !notice.fields || !notice.rows || !notice.mapping) {
    return (
      <div className='rounded border border-red-300 p-4 text-red-500'>
        Error: Notice data is missing required properties (fields, rows, or mapping).
      </div>
    )
  }

  // Function to sanitize data by removing surrounding quotes and special characters
  const sanitizeData = (data) => {
    if (!data) return ''

    // Convert to string in case it's a number or other type
    const str = String(data)

    // Remove surrounding quotes, backticks and other special characters
    return str.replace(/^[`'"]+|[`'"]+$/g, '')
  }

  // Function to decode HTML entities
  const decodeHTMLEntities = (text) => {
    if (!text) return ''

    // Create a textarea element to decode HTML entities
    const textarea = document.createElement('textarea')
    textarea.innerHTML = text

    // Get the decoded value
    const decoded = textarea.value
    textarea.remove()

    return decoded
  }

  return (
    <table className='khata-table mt-4 w-full border-collapse'>
      <thead>
        <tr>
          {notice.fields
            .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
            .map((field, i) => (
              <th key={`header-${i}`} className='font-gautami border border-black p-2 text-center'>
                {sanitizeData(field.te)}
              </th>
            ))}
          <th className='font-gautami border border-black p-2 text-center'>సంతకం</th>
        </tr>
      </thead>
      <tbody>
        {notice.rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {notice.fields
              .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
              .map((field, colIndex) => {
                const rawValue = row[notice.mapping[field.en]] || ''
                const decodedValue = decodeHTMLEntities(rawValue)
                const sanitizedValue = sanitizeData(decodedValue)

                // For "Khata wise (Pattadar Name once)" mode, only show values in the first row
                // except for the Survey Number column and LPM Number (for GV Notice)
                const isSurveyNumberColumn = field.en === 'Survey No' || colIndex === 0
                const isLPMNumberColumn = field.en === 'LPM Number'

                // Always show LPM Number for GV Notice in every row, similar to Survey Numbers
                const shouldAlwaysShow =
                  isSurveyNumberColumn || // Always show survey numbers
                  (noticeType === 'GV Notice' && isLPMNumberColumn) // Always show LPM Numbers for GV Notice

                const shouldShowValue =
                  noticeMode !== 'khata-pattadar-once' || // Always show if not in special mode
                  shouldAlwaysShow || // Always show survey numbers and LPM Numbers (for GV Notice)
                  rowIndex === 0 // Show other fields only in first row

                return (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    className='font-gautami border border-black p-2 text-center'
                  >
                    {shouldShowValue ? sanitizedValue : ''}
                  </td>
                )
              })}
            <td className='font-gautami w-[160px] border border-black p-2'>&nbsp;</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default KhataTable
