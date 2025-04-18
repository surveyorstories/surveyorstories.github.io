import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Download } from 'lucide-react'
import PrintableNotice from './PrintableNotice'
import { toast } from '../components/ui/use-toast'
import { officerDesignations } from './FormSection'
import { districts } from '../data/districts'
import { sanitizeString, createSafeHTML, sanitizeAttribute } from '../lib/sanitize'
interface PreviewSectionProps {
  districtName: string
  mandalName: string
  villageName: string
  startDate: string
  startTime: string
  notificationNumber: string
  notificationDate: string
  printedDate: string
  show: boolean
  headers: string[]
  data: string[][]
  mapping: Record<string, string>
  noticeType: string
  officerName: string
  officerDesignation: string
}

// First, fix the duplicate interface by removing one of them and updating the remaining one
interface PreviewSectionProps {
  districtName: string
  mandalName: string
  villageName: string
  startDate: string
  startTime: string
  notificationNumber: string
  notificationDate: string
  printedDate: string
  show: boolean
  headers: string[]
  data: string[][]
  mapping: Record<string, string>
  noticeType: string
  officerName: string
  officerDesignation: string
  noticeMode?: string
  formNumber: string
}

// Update the component function to include noticeMode parameter
const PreviewSection: React.FC<PreviewSectionProps> = ({
  districtName,
  mandalName,
  villageName,
  startDate,
  startTime,
  notificationNumber,
  notificationDate,
  printedDate,
  show,
  headers,
  data,
  mapping,
  noticeType,
  officerName,
  officerDesignation,
  noticeMode = 'khata', // Add default value
  formNumber           // <-- Add this line
}) => {
  const printRef = useRef<HTMLDivElement>(null)

  if (!show) return null

  const indexMapping: Record<string, number> = {}
  Object.entries(mapping).forEach(([fieldName, csvHeader]) => {
    const headerIndex = headers.indexOf(csvHeader)
    if (headerIndex !== -1) {
      indexMapping[fieldName] = headerIndex
    }
  })

  const requiredFields = [
    { en: 'LPM Number', te: 'ల్యాండ్ పార్సెల్ నెంబర్' },
    { en: 'Survey No', te: 'సర్వే నెం' },
    { en: 'Khata No', te: 'ఖాతా సంఖ్య' },
    { en: 'Pattadar Name', te: 'భూ యజమాని పేరు' },
    { en: 'Relation Name', te: 'భర్త/తండ్రి పేరు' }
  ]

  const optionalFields = [{ en: 'Mobile Number', te: 'మొబైల్ నెంబరు' }]

  const fields = [...requiredFields, ...optionalFields]

  // Check if we have the necessary fields based on the noticeMode
  const hasKhataNo = 'Khata No' in indexMapping
  const hasSurveyNo = 'Survey No' in indexMapping

  let notices: {
    khataNo: string
    rows: string[][]
    mapping: Record<string, number>
    fields: { en: string; te: string }[]
  }[] = []

  // Group data based on noticeMode
  if ((noticeMode === 'khata' || noticeMode === 'khata-pattadar-once') && hasKhataNo) {
    // Group by Khata No for both 'khata' and 'khata-pattadar-once' modes
    const khataGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const khataNo = row[indexMapping['Khata No']] || 'Unknown'
      if (!khataGroups[khataNo]) {
        khataGroups[khataNo] = []
      }
      khataGroups[khataNo].push(row)
    })

    notices = Object.entries(khataGroups).map(([khataNo, rows]) => ({
      khataNo,
      rows,
      mapping: indexMapping,
      fields
    }))
  } else if (noticeMode === 'survey' && hasSurveyNo) {
    // Group by Survey No - extract numeric part before any special character
    const surveyGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const surveyNoFull = row[indexMapping['Survey No']] || 'Unknown'
      // Extract numeric part before any special character (-/\)
      const numericPart = surveyNoFull.split(/[-/\\]/)[0].trim()
      const groupKey = numericPart || 'Unknown'

      if (!surveyGroups[groupKey]) {
        surveyGroups[groupKey] = []
      }
      surveyGroups[groupKey].push(row)
    })

    notices = Object.entries(surveyGroups).map(([surveyNo, rows]) => ({
      khataNo: surveyNo, // We use khataNo field to store the survey number for consistency
      rows,
      mapping: indexMapping,
      fields
    }))
  } else {
    // Fallback - no grouping
    notices = [
      {
        khataNo: 'All Data',
        rows: data,
        mapping: indexMapping,
        fields
      }
    ]
  }

  const prepareForPDF = () => {
    if (!printRef.current) return

    // Clone the printRef content for PDF preparation
    const pdfContent = printRef.current.cloneNode(true) as HTMLElement

    // Add print-specific classes to make it look like print mode
    const noticeElements = pdfContent.querySelectorAll('.khata-group')
    noticeElements.forEach((notice) => {
      // Show the Telugu header in the PDF
      const headerElement = notice.querySelector('.telugu-header-print')
      if (headerElement) {
        headerElement.classList.remove('hidden-on-web')
      }
    })

    // Create a temporary container to append our clone to
    const tempContainer = document.createElement('div')
    tempContainer.appendChild(pdfContent)
    tempContainer.style.position = 'absolute'
    tempContainer.style.left = '-9999px'
    tempContainer.style.width = '210mm' // A4 width
    document.body.appendChild(tempContainer)

    return { tempContainer, pdfContent }
  }

  const formatTime = (timeString: string): string => {
    if (!timeString) return ''

    try {
      const [hours, minutes] = timeString.split(':')
      const time = new Date()
      time.setHours(parseInt(hours))
      time.setMinutes(parseInt(minutes))
      return time.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      })
    } catch (error) {
      return timeString
    }
  }

  const formatDate = (dateString: string): string => {
    if (!dateString) return ''

    try {
      const date = new Date(dateString)
      return date
        .toLocaleDateString('en-IN', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        })
        .replace(/\//g, '-')
    } catch (error) {
      return dateString
    }
  }

  const handleDownloadWord = async () => {
    try {
      // Create a new HTML document for Word conversion
      const wordContent = document.createElement('div')

      // Add styles for Word document with Gautami font
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: 'Gautami';
          src: url('../fonts/gautami.ttf') format('truetype');
        }
        body { 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif; 
          margin: 0;
          padding: 0;
        }
       
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
          table-layout: fixed;
        }
        th, td { 
          border: 1px solid black; 
          padding: 6px; 
          text-align: center; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
          word-break: break-word;
          overflow-wrap: break-word;
        }
        .header { 
          text-align: center; 
          font-weight: bold; 
          margin-bottom: 10px; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
          padding-top: 0;
          margin-top: 0;
        }
        .content { 
          text-align: left; 
          margin-bottom: 15px; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
        }
        .footer { 
          margin-top: 10px; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
        }
        .left-footer { 
          float: left; 
          text-align: left; 
        }
        .right-footer { 
          float: right; 
          text-align: right; 
        }
        .notice-section {
          page-break-after: always;
          padding: 15mm 15mm 20mm 15mm;
          margin-top: 0;
        }
        .notice-section:last-child {
          page-break-after: avoid;
        }
        .signature-column {
          width: 120px !important;
        }
        col:last-child {
          width: 120px;
        }
        @page {
          margin: 5mm;
        }
      `

      wordContent.appendChild(style)

      // Process each notice
      notices.forEach((notice, index) => {
        const noticeDiv = document.createElement('div')
        noticeDiv.className = 'notice-section telugu-text'

        // Add header at the very top of the page
        const header = document.createElement('div')
        header.className = 'header telugu-text'
        header.style.marginTop = '0'
        header.style.paddingTop = '0'
        header.innerHTML = createSafeHTML(
          noticeType === 'GT Notice'
            ? `
          <h1 style="font-size: 14pt; margin-top: 0;">ఫారం - ${formNumber || ' 15'} </h1>
          <h2 style="font-size: 14pt;">భూ యాజమాన్య దారులకు నోటీసు</h2>
          <h2 style="font-size: 14pt; margin-bottom: 10px;">FOR GROUND TRUTHING</h2>
        `
            : `<h1 style="font-size: 14pt; margin-top: 0;"> ఫారం - ${formNumber || ' 26'} </h1>
              <h2 style="font-size: 14pt; margin-bottom: 10px;">ప్రైవేట్ భూముల/ప్రభుత్వా విభాగాలు/ సంస్థల భూ కమత ధ్రువీకరణ విచారణ కై నోటీసు</h2>  `
        )
        noticeDiv.appendChild(header)

        // Add content
        const content = document.createElement('div')
        content.className = 'content telugu-text'
        content.innerHTML = createSafeHTML(
          noticeType === 'GT Notice'
            ? `
          <p style="font-size: 12pt; line-height: 1.5;word-break: break-all ">1) సర్వే సహాయక సంచాలకులు వారి 6(1) నోటిఫికేషన్ ఆర్‌.సి నెం ${sanitizeString(notificationNumber) || '________________'} తేది: ${formatDate(sanitizeString(notificationDate)) || '____________'
            }, అనుసరించి, ${districts.find((d) => d.value === districtName)?.te || '____________________'}  జిల్లా, 
           ${sanitizeString(mandalName) || '_____________________'} మండలం, ${sanitizeString(villageName) || '____________________'
            } గ్రామములో సీమానిర్ణయం (demarcation) మరియు సర్వే పనులు
          ${formatDate(sanitizeString(startDate)) || '_____________'} తేదీన ${formatTime(sanitizeString(startTime)) || '________'
            } గం.ని.లకు ప్రారంభిచబడును అని తెలియజేయడమైనది.</p>

          <p style="font-size: 12pt; line-height: 1.5; word-break: break-all ">2) సర్వే మరియు సరిహద్దుల చట్టం, 1923లోని నియమ నిబంధనలు అనుసరించి సర్వే సమయం నందు ఈ క్రింది షెడ్యూల్ లోని భూ
          యజమానాలు భూమి వద్ద హాజరై మీ పొలము యొక్క సరిహద్దులను చూపించి, తగిన సమాచారం మరియు అవసరమైన సహాయ సహకారములు
          అందించవలసినదిగా తెలియజేయడమైనది.</p>
        `
            : ` <p style="font-size: 12pt; line-height: 1.5; word-break: break-all ">1) సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డ్ల వారు జారీ చేసిన 6 (1) నోటిఫికేషన్ ఆర్‌సి నెం ${sanitizeString(notificationNumber) || '________________'} తేది: ${formatDate(sanitizeString(notificationDate)) || '____________'}, మరియు ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 కు సంబంధించి ${districts.find((d) => d.value === districtName)?.te || '____________________'} జిల్లా, 
           ${sanitizeString(mandalName) || '_____________________'} మండలం, ${sanitizeString(villageName) || '____________________'
            } గ్రామం యొక్క ప్రాథమిక సర్వే రికార్డులు తయారుచేయడం జరిగినది. 
ప్రాథమిక సర్వే రికార్డులలో మీరు అభ్యంతరం తెలియచేసినందున వలన భూమి ధ్రువీకరణ (Ground Validation) నిమిత్తం తేదీ ${formatDate(sanitizeString(startDate)) || '_____________'} న ${formatTime(sanitizeString(startTime)) || '________'
            } గం.ని.లకు సర్వే పనులు ప్రారంభించబడును అని తెలియచేయటమైనది.</p>
          <p style="font-size: 12pt; line-height: 1.5; word-break: break-all "> 2) సర్వే మరియు సరిహద్దుల చట్టం, 1923లోని నియమ నిబంధనలు అనుసరించి సర్వే సమయం నందు ఈ క్రింది షెడ్యూల్ లోని భూ
          యజమానాలు భూమి వద్ద హాజరై మీ పొలము యొక్క సరిహద్దులను చూపించి, తగిన సమాచారం మరియు అవసరమైన సహాయ సహకారములు
          అందించవలసినదిగా తెలియజేయడమైనది.</p>  `
        )
        noticeDiv.appendChild(content)

        // Create table with colgroup for fixed column widths
        const table = document.createElement('table')
        const colgroup = document.createElement('colgroup')

        // Set column widths
        notice.fields.forEach((field, i) => {
          const col = document.createElement('col')
          if (i === 0)
            col.style.width = '90px' // Survey No
          else if (i === 1)
            col.style.width = '80px' // Khata No
          else if (i === 4)
            col.style.width = '110px' // Mobile Number
          else col.style.width = 'auto' // Other columns share remaining space
          colgroup.appendChild(col)
        })

        // Add signature column
        const signatureCol = document.createElement('col')
        signatureCol.style.width = '120px'
        colgroup.appendChild(signatureCol)

        table.appendChild(colgroup)

        // Add table header
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')

        notice.fields
          .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
          .forEach((field) => {
            const th = document.createElement('th')
            th.textContent = field.te
            th.style.fontWeight = 'bold'
            headerRow.appendChild(th)
          })

        const signatureTh = document.createElement('th')
        signatureTh.textContent = 'సంతకం'
        signatureTh.style.fontWeight = 'bold'
        headerRow.appendChild(signatureTh)

        thead.appendChild(headerRow)
        table.appendChild(thead)

        // Add table body
        const tbody = document.createElement('tbody')

        notice.rows.forEach((row) => {
          const tr = document.createElement('tr')

          notice.fields
            .filter((field) => noticeType === 'GV Notice' || field.en !== 'LPM Number')
            .forEach((field, colIndex) => {
              const td = document.createElement('td')
              // Get the cell content and thoroughly sanitize it
              let cellContent = row[notice.mapping[field.en]] || ''

              // For "Khata wise (Pattadar Name once)" mode, only show values in the first row
              // except for the Survey Number column and LPM Number (for GV Notice)
              if (noticeMode === 'khata-pattadar-once') {
                const isSurveyNumberColumn = field.en === 'Survey No' || colIndex === 0
                const isLPMNumberColumn = field.en === 'LPM Number'

                // Always show LPM Number for GV Notice in every row, similar to Survey Numbers
                const shouldAlwaysShow =
                  isSurveyNumberColumn || // Always show survey numbers
                  (noticeType === 'GV Notice' && isLPMNumberColumn) // Always show LPM Numbers for GV Notice

                const shouldShowValue =
                  shouldAlwaysShow || // Always show survey numbers and LPM Numbers (for GV Notice)
                  notice.rows.indexOf(row) === 0 // Show other fields only in first row

                if (!shouldShowValue) {
                  cellContent = ''
                }
              }

              // First decode any HTML entities
              const parser = new DOMParser()
              const decodedContent =
                parser.parseFromString(`<!doctype html><body>${cellContent}`, 'text/html').body
                  .textContent || ''

              // Remove all quotes, backticks, and other special characters
              const cleanedContent = decodedContent
                .replace(/['""`]/g, '') // Remove quotes and backticks
                .replace(/[\u2018\u2019\u201C\u201D]/g, '') // Remove smart quotes
                .replace(/&quot;/g, '') // Remove HTML quote entities
                .replace(/&#39;/g, '') // Remove HTML single quote entities
                .replace(/[^\u0000-\u007F\u0C00-\u0C7F\s]/g, '') // Keep only ASCII and Telugu chars
                .trim() // Remove leading/trailing whitespace

              td.textContent = sanitizeString(cleanedContent)
              tr.appendChild(td)
            })

          const signatureTd = document.createElement('td')
          signatureTd.innerHTML = createSafeHTML('&nbsp;')
          tr.appendChild(signatureTd)

          tbody.appendChild(tr)
        })

        table.appendChild(tbody)

        noticeDiv.appendChild(table)
        // Add notice number with proper styling
        const noticeNumber = document.createElement('div')

        // noticeNumber.className = 'thirdpoint'
        noticeNumber.className = 'content telugu-text'
        noticeNumber.innerHTML = createSafeHTML(
          '<p style="font-size: 12pt; line-height: 1.5;"> 3) నోటీసు యొక్క ప్రతిని సంతకం చేసి తిరిగి పంపించవలెను</p>'
        )
        noticeDiv.appendChild(noticeNumber)

        // Add footer
        const footer = document.createElement('div')
        footer.className = 'footer telugu-text'
        // footer.style.marginTop = '10px'
        footer.innerHTML = createSafeHTML(
          noticeType === 'GT Notice'
            ? `
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <div class="left-footer">
              <p>స్థలం: ${sanitizeString(villageName) || '_____________'}</p>
              <p>తేది: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
            </div>
            <div class="right-footer">
              <p>గ్రామ సర్వేయర్</p>
            </div>
          </div>
        `
            : `
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <div class="left-footer">
              <p>స్థలం: ${sanitizeString(villageName) || '_____________'}</p>
              <p>తేది: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
            </div>
            <div class="right-footer">
              <p>సంతకం:</p>
              <p>పేరు: ${sanitizeString(officerName) || '_______________'}</p>
              <p>హోదా/వృత్తి: ${officerDesignation ? officerDesignations.find((d) => d.value === officerDesignation)?.te || sanitizeString(officerDesignation) : '_______________'}</p>
            </div>
          </div>
        `
        )

        noticeDiv.appendChild(footer)

        wordContent.appendChild(noticeDiv)
      })

      // Convert to Blob - use HTML format for better rendering in Word
      const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Land Notices</title>
        </head>
        <body>
          ${createSafeHTML(wordContent.innerHTML)}
        </body>
        </html>
      `

      // Replace any remaining HTML entities that might not be properly decoded
      const finalHtmlContent = htmlContent
        // First handle double-escaped entities
        .replace(/&amp;#39;/g, "'")
        .replace(/&amp;quot;/g, '"')
        .replace(/&amp;lt;/g, '<')
        .replace(/&amp;gt;/g, '>')
        .replace(/&amp;amp;/g, '&')
        // Then handle single-escaped entities
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&amp;/g, '&')

      const blob = new Blob([finalHtmlContent], { type: 'application/msword' })

      // Create download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `land-notices-${villageName || 'village'}.doc`

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Word Document Downloaded Successfully',
        description: 'Land notices have been saved to your device.'
      })
    } catch (error) {
      console.error('Error generating Word document:', error)
      toast({
        title: 'Word Document Generation Failed',
        description: 'There was an error creating the document. Please try again.',
        variant: 'destructive'
      })
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className='preview-section mt-8 overflow-hidden print:static print:m-0 print:mt-0 print:bg-transparent'
    >
      <div className='no-print mb-4 flex flex-col items-start justify-between gap-2 sm:flex-row sm:items-center'>
        <h2 className='text-2xl font-medium'>Preview</h2>
        <div className='flex gap-3'>
          <Button
            onClick={handleDownloadWord}
            className='button flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-500'
            variant='secondary'
            size='sm'
          >
            <Download className='h-4 w-4' />
            Download Word
          </Button>
        </div>
      </div>
      {/* web preview web page */}
      <Card className='glass-panel w-full overflow-hidden print:static print:bg-transparent'>
        <div className='telugu-text no-print overflow-hidden p-4 sm:pb-2 print:p-0'>
          {noticeType === 'GT Notice' ? (
            <>
              <h3 className='telugu-text text-center font-bold'>ఫారం - {formNumber || '15'} </h3>
              <h3 className='telugu-text text-center font-bold'>భూ యాజమాన్య దారులకు నోటీసు</h3>
              <h3 className='telugu-text mb-4 text-center font-bold'>FOR GROUND TRUTHING</h3>
              <p className='text-justify' style={{ marginBottom: '0px', wordBreak: 'break-all' }}>
                1) సర్వే సహాయక సంచాలకులు వారి 6(1) నోటిఫికేషన్ ఆర్‌.సి నెం
                {notificationNumber || '________________'}తేది:{' '}
                {formatDate(notificationDate) || '____________'}, అనుసరించి,{' '}
                {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                జిల్లా,
                {mandalName || '______________________'} మండలం,{' '}
                {villageName || '___________________'} గ్రామములో సీమానిర్ణయం (demarcation) మరియు
                సర్వే పనులు
                {startDate ? formatDate(startDate) : '_____________'} తేదీన{' '}
                {startTime ? formatTime(startTime) : '__________'} గం.ని.లకు ప్రారంభిచబడును అని
                తెలియజేయడమైనది.
                <br />
                2) సర్వే మరియు సరిహద్దుల చట్టం, 1923లోని నియమ నిబంధనలు అనుసరించి సర్వే సమయం నందు ఈ
                క్రింది షెడ్యూల్ లోని భూ యజమానులు భూమి వద్ద హాజరై మీ పొలము యొక్క సరిహద్దులను
                చూపించి, తగిన సమాచారం మరియు అవసరమైన సహాయ సహకారములు అందించవలసినదిగా తెలియజేయడమైనది.
              </p>
            </>
          ) : (
            <>
              <h3 className='telugu-text text-center font-bold'>ఫారం - {formNumber || '26'} </h3>

              <h3 className='telugu-text text-center font-bold'>
                ప్రైవేట్ భూముల/ప్రభుత్వా విభాగాలు/ సంస్థల భూ కమత ధ్రువీకరణ విచారణ కై నోటీసు
              </h3>
              <p className='text-justify' style={{ marginBottom: '0px', wordBreak: 'break-all' }}>
                1) సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డ్ల వారు జారీ చేసిన 6 (1) నోటిఫికేషన్
                ఆర్‌.సి నెం {notificationNumber || '________________'}తేది:{' '}
                {formatDate(notificationDate) || '____________'} మరియు ఆంధ్రప్రదేశ్ సర్వే మరియు
                సరిహద్దుల చట్టం, 1923 కు సంబంధించి{' '}
                {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                జిల్లా, {mandalName || '_____________________'} మండలం,{' '}
                {villageName || '____________________'} గ్రామం యొక్క ప్రాథమిక సర్వే రికార్డులు
                తయారుచేయడం జరిగినది. ప్రాథమిక సర్వే రికార్డులలో మీరు అభ్యంతరం తెలియచేసినందు వలన భూమి
                ధ్రువీకరణ (Ground Validation) నిమిత్తం తేది{' '}
                {startDate ? formatDate(startDate) : '_____________'} న{' '}
                {startTime ? formatTime(startTime) : '________'}గం. ని.లకు సర్వే పనులు
                ప్రారంభించబడును అని తెలియచేయటమైనది.
                <br />
                2) సర్వే మరియు సరిహద్దుల చట్టం, 1923లోని నియమ నిబంధనలు అనుసరించి సర్వే సమయం నందు ఈ
                క్రింది షెడ్యూల్ లోని భూ యజమానులు భూమి వద్ద హాజరై మీ పొలము యొక్క సరిహద్దులను
                చూపించి, తగిన సమాచారం మరియు అవసరమైన సహాయ సహకారములు అందించవలసినదిగా తెలియజేయడమైనది.
              </p>
            </>
          )}
        </div>

        <div
          className='w-full overflow-hidden p-2 sm:p-4 print:bg-transparent print:p-0'
          ref={printRef}
        >
          <PrintableNotice
            districtName={districtName}
            mandalName={mandalName}
            villageName={villageName}
            startDate={startDate}
            startTime={startTime}
            notificationNumber={notificationNumber}
            notificationDate={notificationDate}
            printedDate={printedDate}
            notices={notices}
            showHeaderOnWeb={false}
            noticeType={noticeType}
            officerName={officerName}
            officerDesignation={officerDesignation}
            noticeMode={noticeMode}
            formNumber={formNumber} // <-- Add this line
          />
        </div>
      </Card>
    </motion.div>
  )
}

export default PreviewSection
