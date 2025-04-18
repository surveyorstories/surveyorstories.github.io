import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Download } from 'lucide-react'
import PrintableNotice from './PrintableNotice_ninetwo'
import { toast } from '../components/ui/use-toast'
import { officerDesignations } from '../ninetwo_components/FormSection_ninetwo'
import { districts } from '../data/districts'
import {
  sanitizeString,
  createSafeHTML,
  sanitizeAttribute,
  decodeHTMLEntities
} from '../lib/sanitize'
// Add to your imports at the top
import NoticeTable from './NoticeTable_ninetwo'
import ReactDOMServer from 'react-dom/server'

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
  officerName: string
  officerDesignation: string
  noticeType?: string
  formNumber: string

}

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
  officerName,
  officerDesignation,
  formNumber,
  noticeType = 'khata' // Default to khata if not provided
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

  let notices: {
    khataNo: string
    rows: string[][]
    mapping: Record<string, number>
    fields: { en: string; te: string }[]
  }[] = []

  // Group data based on noticeType
  if (noticeType === 'landparcel') {
    // Group by Land Parcel Number
    const landParcelField = 'LPM Number'
    const landParcelGroups: Record<string, string[][]> = {}

    if (landParcelField in indexMapping) {
      data.forEach((row) => {
        const landParcelNo = row[indexMapping[landParcelField]] || 'Unknown'
        if (!landParcelGroups[landParcelNo]) {
          landParcelGroups[landParcelNo] = []
        }
        landParcelGroups[landParcelNo].push(row)
      })

      notices = Object.entries(landParcelGroups).map(([landParcelNo, rows]) => ({
        khataNo: `Land Parcel: ${landParcelNo}`, // Use khataNo field to store Land Parcel info
        rows,
        mapping: indexMapping,
        fields
      }))
    } else {
      // Fallback if LPM Number mapping is not found
      notices = [
        {
          khataNo: 'All Data',
          rows: data,
          mapping: indexMapping,
          fields
        }
      ]
      console.warn('LPM Number field mapping not found, using all data')
    }
  } else {
    // Original Khata No grouping
    const hasKhataNo = 'Khata No' in indexMapping

    if (hasKhataNo) {
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
    } else {
      notices = [
        {
          khataNo: 'All Data',
          rows: data,
          mapping: indexMapping,
          fields
        }
      ]
    }
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
      const wordContent = document.createElement('div')
      const style = document.createElement('style')
      style.textContent = `
        @font-face {
          font-family: 'Gautami';
          src: url('../fonts/gautami.ttf') format('truetype');
        }
        body { 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif; 
          margin: 1mm !important;
          padding: 0;
        }
        .table-header {
          border: 1px solid black;
          padding: 3px;
          text-align: center;
          font-weight: bold;
          font-size: 9pt !important;
        }
        .table-cell {
          border: 1px solid black;
          padding: 3px;
          text-align: center;
          font-size: 9pt !important;
        }

        .pattadar{
            white-space: normal;
            word-wrap: break-word; 
            overflow-wrap: break-word; 
            font-weight: 800;
            font-size: 10pt;
            margin-top: 0;
          
          }
       
        table { 
          width: 100%; 
          border-collapse: collapse; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
          table-layout: fixed;
          font-size: 9pt !important;
        }
        th, td { 
          border: 1px solid black; 
          padding: 6px; 
          text-align: center; 
          font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;
          word-break: break-word;
          overflow-wrap: break-word;
          font-size: 9pt !important;
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
        .right-footer { margin-top: 0;
          float: right; 
          text-align: right; 
        }
        .notice-section {
          page-break-after: always;
          padding: 1mm 1mm 2mm 1mm;
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
          margin: 10mm;
        }
      `
      wordContent.appendChild(style)

      // Process each notice
      notices.forEach((notice, index) => {
        const noticeDiv = document.createElement('div')
        noticeDiv.className = 'notice-section telugu-text'

        // Add header
        const header = document.createElement('div')
        header.className = 'header telugu-text'
        header.style.marginTop = '0'
        header.style.paddingTop = '0'
        header.innerHTML = createSafeHTML(`
          <h1 style="font-size: 12pt; margin-top: 0;">ఫారం - ${formNumber || '31'}</h1>
          <h2 style="font-size: 12pt; margin-bottom: 6px;">ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు</h2>
        `)
        noticeDiv.appendChild(header)

        // Add content paragraph
        const content = document.createElement('div')
        content.className = 'content telugu-text'
        content.innerHTML = createSafeHTML(`
          <p class="pattadar">
            శ్రీ/శ్రీమతి ${notice.rows[0][notice.mapping['Pattadar Name']] || '_________________________'} /
            ${notice.rows[0][notice.mapping['Relation Name']] || '____________________'} (
            ${notice.rows[0][notice.mapping['Khata No']] || '___________'}) గారికి
          </p>
          
          <p style="font-size: 8pt; line-height: 1; word-break: break-all">
             &nbsp;సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ సర్వే అధికారి
                  వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది.
                  <br />
                  &emsp; ఈ క్రింది జాబితా నందు తెలిపిన భూముల సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు
                  ఏవిధమైన తగాదాలు నాకు తెలియపరచనందున, సదరు చట్టం లోని 10(1) సెక్షన్ ననుసరించి,
                  అభ్యంతరములు ఏమియు లేవని భావించి నేను ఇందుమూలముగా ఈ భూమి యొక్క సర్వే పటములలో
                  పొందుపరచబడిన సరిహద్దులు తగాదాలు లేనట్లుగాను, అవిసరిగా వున్నవని నిర్ధారించి రికార్డులు
                  తయారు చేసియున్నాను.
                  <br />
                  &emsp;సదరు సర్వే రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ క్రింది తెలిపిన జాబితా లో
                  తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో వాటిని ఈ నోటీసు జారీ అయిన తేది
                  నుండి 21 దినములలో మండల రెవిన్యూ కార్యాలయము లో వుండు అప్పీలు సర్వే అధికారి గారికి తగిన
                  నమూనా పత్రములో అప్పీలు సమర్పించుకోవచ్చును.
                  <br />
                  &emsp;షరా: ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 10(1) వ సిక్షన్
                  ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము లేదనియు, సెక్షన్ (11) ప్రకారము
                  అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
          </p>
          <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8pt; line-height: 1; word-break: break-all;">
                              <span>
                                జిల్లా:
                                ${districts.find((d) => d.value === districtName)?.te ||
          '____________________'
          }
                              </span>
                              <span>మండలం: ${sanitizeString(mandalName) || '_____________'} </span>
                              <span>గ్రామం: ${sanitizeString(villageName) || '_____________'} </span>
                            </div>
        `)
        noticeDiv.appendChild(content)

        // Create a container for the NoticeTable component
        const tableContainer = document.createElement('div')

        // Convert mapping to fields format expected by NoticeTable
        const fields: { en: string; te: string; mappedIndex: number }[] = [
          {
            en: 'LPM Number',
            te: 'ల్యాండ్ పార్సెల్ నెంబర్',
            mappedIndex: notice.mapping['LPM Number']
          },
          { en: 'Survey No', te: 'సర్వే నెంబరు', mappedIndex: notice.mapping['Survey No'] },
          ...(notice.mapping['Sub Division No']
            ? [
              {
                en: 'Sub Division No',
                te: 'సబ్ డివిజన్ నెం లేదా లెటర్',
                mappedIndex: notice.mapping['Sub Division No']
              }
            ]
            : []),
          {
            en: 'Old extent (Acres)',
            te: 'ఎ. సెంట్లు',
            mappedIndex: notice.mapping['Old extent (Acres)']
          },
          {
            en: 'Old extent (Hect)',
            te: 'హె.ఏర్లు. చ.మీ',
            mappedIndex: notice.mapping['Old extent (Hect)']
          },
          {
            en: 'Resurvey extent (Acres)',
            te: 'ఎ. సెంట్లు',
            mappedIndex: notice.mapping['Resurvey extent (Acres)']
          },
          {
            en: 'Resurvey extent (Hect)',
            te: 'హె.ఏర్లు. చ.మీ',
            mappedIndex: notice.mapping['Resurvey extent (Hect)']
          },
          { en: 'Remark', te: 'రిమార్కులు', mappedIndex: notice.mapping['Remark'] }
        ]

        // Render the NoticeTable component to a string
        const tableHtml = ReactDOMServer.renderToStaticMarkup(
          <div style={{ fontSize: '9pt' }}>
            <NoticeTable
              fields={fields}
              rows={notice.rows}
              hasSubdivision={'Sub Division No' in notice.mapping}
            />
          </div>
        )

        tableContainer.innerHTML = createSafeHTML(tableHtml)
        noticeDiv.appendChild(tableContainer)

        // Add notice number and footer
        const noticeNumber = document.createElement('div')
        noticeNumber.className = 'content telugu-text'

        const formattedPrintedDate = formatDate(printedDate)

        noticeNumber.innerHTML = createSafeHTML(`
          <div style="display: flex; justify-content: space-between; width: 100%;font-size: 8pt; line-height: 1;">
            <div class="left-footer">
              <p class='body-footer-text telugu-text m-1'>
                నోటీసు జారి చేసిన తేది: ${formattedPrintedDate || '_____________'}
              </p>
            </div>

             <div class="right-footer">
              <p class='body-footer-text telugu-text mb-0 mt-5 text-left'>
                సర్వే అధికారి
                ${officerDesignation
            ? ` (${officerDesignations.find((d) => d.value === officerDesignation)?.te || officerDesignation})`
            : ''
          }
              </p>
            </div>
          </div>
          
        `)

        noticeDiv.appendChild(noticeNumber)

        // Add footer
        const footer = document.createElement('div')
        footer.className = 'footer telugu-text'
        // footer.style.marginTop = '10px'
        footer.innerHTML = createSafeHTML(
          `
          <div style="margin-top: 20px; text-align: center; font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;">
            <p>--------------------------------------------✂️-------------------------------------------</p>
            <div style="text-align: center;">
              <h3 style="margin: 0; font-size: 12pt;">ఫారం – ${formNumber || '31'}(a)</h3>
              <h3 style="margin: 0; font-size: 12pt;">రశీదు</h3>
            </div>
            <p style="text-align: justify; margin: 10px 0; font-size: 8pt; line-height: 1; word-break: break-all">
              &emsp; ${districts.find((d) => d.value === districtName)?.te || '_____________'} జిల్లా, 
              ${sanitizeString(mandalName) || '_____________'} మండలం, 
              ${sanitizeString(villageName) || '_____________'} గ్రామము నందు రీసర్వే నిర్వహించి, 
              ల్యాండ్ పార్సెల్ నెంబర్ "${Array.from(new Set(notice.rows.map((row) => sanitizeString(row[notice.mapping['LPM Number']] || '')))).join(', ')}" విషయమై 
              ఆంధ్రప్రదేశ్ సర్వే & సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము 
              ${formattedPrintedDate || '_____________'} తేదీన జారీ చేసిన నోటీసు అందిన విషయాన్ని 
              నేను దృవీకరించుచున్నాను.
            </p>

            <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8pt; line-height: 1;">
            
            <div class="left-footer">
                <p style="margin: 2px;">స్థలం: ${sanitizeString(villageName) || '_____________'}</p>
             \
              </div>
              <div class="right-footer">
                <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>నోటీసు తీసుకున్న వారి సంతకము</p>
              </div>
              <div class="left-footer">
                <p style="margin: 2px;">తేది:</p>
              </div>
               
            </div>
          </div>
        `
        )

        noticeDiv.appendChild(footer)

        wordContent.appendChild(noticeDiv)
      })

      // Convert to Blob and trigger download
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

      const blob = new Blob([htmlContent], { type: 'application/msword' })

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
        <div className='telugu-text no-print overflow-hidden p-4 pb-0 sm:pb-0 print:p-0'>
          <>
            <h3 className='telugu-text text-center'>ఫారం - {formNumber || '31'} </h3>
            <h3 className='telugu-text text-center'>
              ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు
            </h3>

            <p className='telugu-text text-justify'>
              <b className='text-red-800'>
                *Pattadar name and Relation Name visible in Print and Word document
              </b>
              <br />
              &emsp;సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ సర్వే అధికారి
              వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది.
              <br />
              &emsp; ఈ క్రింది జాబితా నందు తెలిపిన భూముల సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు
              ఏవిధమైన తగాదాలు నాకు తెలియపరచనందున, సదరు చట్టం లోని 10(1) సెక్షన్ ననుసరించి,
              అభ్యంతరములు ఏమియు లేవని భావించి నేను ఇందుమూలముగా ఈ భూమి యొక్క సర్వే పటములలో
              పొందుపరచబడిన సరిహద్దులు తగాదాలు లేనట్లుగాను, అవిసరిగా వున్నవని నిర్ధారించి రికార్డులు
              తయారు చేసియున్నాను.
              <br />
              &emsp;సదరు సర్వే రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ క్రింది తెలిపిన జాబితా లో
              తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో వాటిని ఈ నోటీసు జారీ అయిన తేది
              నుండి 21 దినములలో మండల రెవిన్యూ కార్యాలయము లో వుండు అప్పీలు సర్వే అధికారి గారికి తగిన
              నమూనా పత్రములో అప్పీలు సమర్పించుకోవచ్చును.
              <br />
              &emsp;షరా: ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 10(1) వ సిక్షన్
              ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము లేదనియు, సెక్షన్ (11) ప్రకారము
              అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
              <br />
              <div className='flex w-full justify-between gap-2'>
                <span>
                  జిల్లా:{' '}
                  {districts.find((d) => d.value === districtName)?.te || '____________________'}
                </span>
                <span>మండలం: {mandalName || '_____________________'}</span>
                <span>గ్రామం: {villageName || '____________________'}</span>
              </div>
            </p>
          </>
        </div>

        <div
          className='w-full overflow-hidden px-2 pt-0 sm:px-4 sm:pt-0 print:bg-transparent print:p-0'
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
            officerName={officerName}
            officerDesignation={officerDesignation}
            formNumber={formNumber}
          />
        </div>
      </Card>
    </motion.div>
  )
}

export default PreviewSection
