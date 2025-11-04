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

  const fields = notice.fields.filter(
    (field) =>
      field.en !== 'Owner Name' &&
      field.en !== 'Relation Name' &&
      field.en !== 'Habitation Name'
  )

  return (
    <table className='khata-table mt-4 w-full border-collapse notice-paragraph'>
      <thead>
        <tr>
          {fields.map((field, i) => (
            <th key={`header-${i}`} className=' border border-black p-2 text-center'>
              {sanitizeData(field.te)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {notice.rows.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            {fields.map((field, colIndex) => {
              const rawValue = row[notice.mapping[field.en]] || ''
              const decodedValue = decodeHTMLEntities(rawValue)
              const sanitizedValue = sanitizeData(decodedValue)
              const isSurveyNumberColumn = field.en === 'Survey No' || colIndex === 0
              const shouldAlwaysShow = isSurveyNumberColumn
              const shouldShowValue =
                noticeMode !== 'khata-pattadar-once' ||
                shouldAlwaysShow ||
                rowIndex === 0
              return (
                <td
                  key={`cell-${rowIndex}-${colIndex}`}
                  className=' border border-black p-2 text-center'
                >
                  {shouldShowValue ? sanitizedValue : ''}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
export default KhataTable
