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

  // Optionally show Survey No heading in subdivision mode
  if (noticeMode === 'subdivision') {
    // Remove the Survey No: title, just render the table
    // Insert Extent column after Relation Name if present
    let fields = notice.fields
      .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
    const relIdx = fields.findIndex(f => f.en === 'Relation Name')
    const extentIdx = notice.fields.findIndex(f => f.en === 'Extent')
    if (extentIdx !== -1 && relIdx !== -1) {
      // Remove Extent if already present, then insert after Relation Name
      fields = fields.filter(f => f.en !== 'Extent')
      fields.splice(relIdx + 1, 0, notice.fields[extentIdx])
    }
    return (
      <div>
        <table className='khata-table mt-2 w-full border-collapse'>
          <thead>
            <tr>
              {fields.map((field, i) => (
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
                {fields.map((field, colIndex) => {
                  // ...existing cell rendering logic...
                  const rawValue = row[notice.mapping[field.en]] || ''
                  const decodedValue = decodeHTMLEntities(rawValue)
                  const sanitizedValue = sanitizeData(decodedValue)
                  const isSurveyNumberColumn = field.en === 'Survey No' || colIndex === 0
                  const isLPMNumberColumn = field.en === 'LPM Number'
                  const shouldAlwaysShow =
                    isSurveyNumberColumn ||
                    (noticeType === 'GV Notice' && isLPMNumberColumn)
                  const shouldShowValue =
                    noticeMode !== 'khata-pattadar-once' ||
                    shouldAlwaysShow ||
                    rowIndex === 0
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
      </div>
    )
  }

  // Main table (non-subdivision)
  // Insert Extent column after Relation Name if present
  let fields = notice.fields
    .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
  const relIdx = fields.findIndex(f => f.en === 'Relation Name')
  const extentIdx = notice.fields.findIndex(f => f.en === 'Extent')
  if (extentIdx !== -1 && relIdx !== -1) {
    fields = fields.filter(f => f.en !== 'Extent')
    fields.splice(relIdx + 1, 0, notice.fields[extentIdx])
  }

  return (
    <table className='khata-table mt-4 w-full border-collapse'>
      <thead>
        <tr>
          {fields.map((field, i) => (
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
            {fields.map((field, colIndex) => {
              // ...existing cell rendering logic...
              const rawValue = row[notice.mapping[field.en]] || ''
              const decodedValue = decodeHTMLEntities(rawValue)
              const sanitizedValue = sanitizeData(decodedValue)
              const isSurveyNumberColumn = field.en === 'Survey No' || colIndex === 0
              const isLPMNumberColumn = field.en === 'LPM Number'
              const shouldAlwaysShow =
                isSurveyNumberColumn ||
                (noticeType === 'GV Notice' && isLPMNumberColumn)
              const shouldShowValue =
                noticeMode !== 'khata-pattadar-once' ||
                shouldAlwaysShow ||
                rowIndex === 0
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
