import React, { useRef, useEffect } from 'react'
import he from 'he'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Download } from 'lucide-react'
import PrintableNotice from './PrintableNotice_svamitva_ninetwo'
import { toast } from '../components/ui/use-toast'
import { officerDesignations } from './FormSection_svamitva_ninetwo'
import { districts } from '../data/districts'
import { sanitizeString, createSafeHTML, sanitizeAttribute } from '../lib/sanitize'
interface PreviewSectionProps {
  districtName: string
  mandalName: string
  panchayatName: string
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
  habitationName?: string
}

// Update the component function to include noticeMode parameter
const PreviewSection: React.FC<PreviewSectionProps> = ({
  districtName,
  mandalName,
  panchayatName,
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
  noticeMode = 'property-parcel-number', // Add default value
  formNumber,
  habitationName // Add this line
}) => {
  const printRef = useRef<HTMLDivElement>(null)

  const indexMapping: Record<string, number> = {}
  Object.entries(mapping).forEach(([fieldName, csvHeader]) => {
    const headerIndex = headers.indexOf(csvHeader)
    if (headerIndex !== -1) {
      indexMapping[fieldName] = headerIndex
    }
  })

  const requiredFields = [
    { en: 'Property Parcel Number', te: 'ప్రాపర్టీ పార్సెల్ నెంబరు' },
    { en: 'Assessment Number', te: 'అసెస్మెంట్ నెంబర్' },
    { en: 'Site Area', te: 'స్థల విస్తీర్ణం (sq.mts)' },
    { en: 'Building Area', te: 'భవన విస్తీర్ణం (sq.mts)' },
    { en: 'Owner Name', te: 'భూమి/ ఆస్తి యజమాని పేరు' },
    { en: 'Relation Name', te: 'తండ్రి పేరు' }
  ]

  const optionalFields: FieldMapping[] = [
    { en: 'Remarks', te: 'రిమార్కులు' },
    { en: 'Habitation Name', te: 'గ్రామం పేరు' }
  ]

  const fields = [...requiredFields, ...optionalFields]

  const hasPropertyParcelNumber = 'Property Parcel Number' in indexMapping
  const hasAssessmentNumber = 'Assessment Number' in indexMapping
  const hasOwnerName = 'Owner Name' in indexMapping
  const hasRelationName = 'Relation Name' in indexMapping

  useEffect(() => {
    if (show) {
      if (noticeMode === 'property-parcel-number' && !hasPropertyParcelNumber) {
        toast({
          title: 'Warning',
          description:
            'Property Parcel Number is not mapped. Please map the column to generate notices.',
          variant: 'destructive'
        })
      }
    }
  }, [show, noticeMode, hasPropertyParcelNumber])

  if (!show) return null

  let notices: {
    khataNo: string
    rows: string[][]
    mapping: Record<string, number>
    fields: { en: string; te: string }[]
  }[] = []

  // Group data based on noticeMode
  if (noticeMode === 'property-parcel-number' && hasPropertyParcelNumber) {
    const propertyParcelNumberGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const propertyParcelNumber = row[indexMapping['Property Parcel Number']] || 'Unknown'
      if (!propertyParcelNumberGroups[propertyParcelNumber]) {
        propertyParcelNumberGroups[propertyParcelNumber] = []
      }
      propertyParcelNumberGroups[propertyParcelNumber].push(row)
    })

    notices = Object.entries(propertyParcelNumberGroups).map(([propertyParcelNumber, rows]) => ({
      khataNo: propertyParcelNumber,
      rows,
      mapping: indexMapping,
      fields,
      habitationName: indexMapping['Habitation Name']
        ? rows[0][indexMapping['Habitation Name']]
        : undefined
    }))
  } else if (noticeMode === 'assessment-number' && hasAssessmentNumber) {
    const assessmentNumberGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const assessmentNumber = row[indexMapping['Assessment Number']] || 'Unknown'
      if (!assessmentNumberGroups[assessmentNumber]) {
        assessmentNumberGroups[assessmentNumber] = []
      }
      assessmentNumberGroups[assessmentNumber].push(row)
    })

    notices = Object.entries(assessmentNumberGroups).map(([assessmentNumber, rows]) => ({
      khataNo: assessmentNumber,
      rows,
      mapping: indexMapping,
      fields,
      habitationName: indexMapping['Habitation Name']
        ? rows[0][indexMapping['Habitation Name']]
        : undefined
    }))
  } else if (noticeMode === 'pattadar-name' && hasOwnerName && hasRelationName) {
    const pattadarNameGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const ownerName = (row[indexMapping['Owner Name']] || '').replace(/\s/g, '')
      const relationName = (row[indexMapping['Relation Name']] || '').replace(/\s/g, '')
      const groupKey = ownerName + relationName || 'Unknown'
      if (!pattadarNameGroups[groupKey]) {
        pattadarNameGroups[groupKey] = []
      }
      pattadarNameGroups[groupKey].push(row)
    })

    notices = Object.entries(pattadarNameGroups).map(([pattadarName, rows]) => ({
      khataNo: pattadarName,
      rows,
      mapping: indexMapping,
      fields,
      habitationName: indexMapping['Habitation Name']
        ? rows[0][indexMapping['Habitation Name']]
        : undefined
    }))
  } else {
    // Fallback - no grouping
    notices = [
      {
        khataNo: 'All Data',
        rows: data,
        mapping: indexMapping,
        fields,
        habitationName: indexMapping['Habitation Name']
          ? data[0][indexMapping['Habitation Name']]
          : undefined
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
          `
          <h1 style="font-size: 14pt; margin-top: 0;">ఫారం - ${formNumber || ' 17'} </h1>
          <h2 style="font-size: 14pt;">సర్వే మాన్యువల్, చాప్టర్. IX, రూల్ -52) <br></br>
          ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు</h2>

        `
        )
        noticeDiv.appendChild(header)

        // Add content
        const content = document.createElement('div')
        content.className = 'content telugu-text'
        content.innerHTML = createSafeHTML(
          `
          <p style="font-size: 12pt; line-height: 1.5;word-break: break-all ">
          
           \u00A0\u00A0\u00A0\u00A0 "సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ సర్వే అధికారి వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది. <br/>

           \u00A0\u00A0\u00A0\u00A0 ${sanitizeString(mandalName) || '_____________________'} మండలం 
           ${sanitizeString(panchayatName) || '____________________'} గ్రామ పంచాయతీ నందు నివాస స్థలముల (Rural Habitation Survey) సర్వే నిర్వహించిన అనంతరము క్రింది జాబితా నందు తెలిపిన భూముల సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు ఏ విధమైన తగాదాలు నాకు తెలియపరచనందున, సదరు చట్టం లోని 10(1) సెక్షన్ ననుసరించి, అభ్యంతరములు ఏమియు లేవని భావించి నేను ఇందుమూలముగా ఈ భూమి యొక్క సర్వే పటములో పొందుపరచబడిన సరిహద్దులు తగాదాలు లేనట్లుగాను, అవి సరిగా వున్నవని నిర్ధారించి నివాస ప్రాంత మ్యాప్ మరియు ఆస్థి వివరముల రికార్డులు తయారు చేసియున్నాను.
         </p>
          
          
          <p style="font-size: 12pt; line-height: 1.5; word-break: break-all "> \u00A0\u00A0\u00A0\u00A0 సదరు అసెస్మెంట్ రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ క్రింది తెలిపిన జాబితా లో తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో వాటిని ఈ నోటీసు జారీ ఐన తేది నుండి (21) దినములలో అప్పీలు పునర్విచారణ అధికారిగారికి Form - 19 నమూనా పత్రములో అప్పీలు దాఖలు చేసి రశీదు పొందవలెను .
          <br/>
         \u00A0\u00A0\u00A0\u00A0\u00A0\u00A0 షరా : ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 10(1) వ సెక్షన్ ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము లేదనియు, సెక్షన్ (11) ప్రకారము అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
          
          </p>
        `
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

        table.appendChild(colgroup)

        // Add table header
        const thead = document.createElement('thead')
        const headerRow = document.createElement('tr')

        const th = document.createElement('th')
        th.textContent = 'S.No'
        th.style.fontWeight = 'bold'
        headerRow.appendChild(th)

        notice.fields.forEach((field) => {
          const th = document.createElement('th')
          th.textContent = field.te
          th.style.fontWeight = 'bold'
          headerRow.appendChild(th)
        })

        thead.appendChild(headerRow)
        table.appendChild(thead)

        // Add table body
        const tbody = document.createElement('tbody')

        notice.rows.forEach((row, rowIndex) => {
          const tr = document.createElement('tr')

          const td = document.createElement('td')
          td.textContent = (rowIndex + 1).toString()
          tr.appendChild(td)

          notice.fields.forEach((field, colIndex) => {
            const td = document.createElement('td')
            // Get the cell content and thoroughly sanitize it
            let cellContent = row[notice.mapping[field.en]] || ''

            // First decode any HTML entities
            const parser = new DOMParser()
            const decodedContent =
              parser.parseFromString(`<!doctype html><body>${cellContent}`, 'text/html').body
                .textContent || ''

            // Remove all quotes, backticks, and other special characters
            const cleanedContent = decodedContent
              .replace(/[\u2018\u2019\u201C\u201D]/g, '') // Remove smart quotes
              .replace(/[^\u0000-\u007F\u0C00-\u0C7F\s]/g, '') // Keep only ASCII and Telugu chars
              .trim() // Remove leading/trailing whitespace

            td.textContent = sanitizeString(cleanedContent)
            tr.appendChild(td)
          })

          tbody.appendChild(tr)
        })

        table.appendChild(tbody)

        noticeDiv.appendChild(table)

        // Add footer
        const footer = document.createElement('div')
        footer.className = 'footer telugu-text'
        // footer.style.marginTop = '10px'
        footer.innerHTML = createSafeHTML(
          `
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <div class="left-footer">
            
              <p>నోటీసు జారీ చేసిన తేదీ: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
            </div>
            <div class="right-footer">
              <p>ఇంజనీరింగ్ అసిస్టెంట్ సంతకం</p>
              <p> ${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతీ</p>
              <p> ${sanitizeString(mandalName) || '_____________________'} మండలం </p>
            </div>

          <div style="margin-top: 20px; text-align: center; font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;">
                      <p>--------------------------------------------✂️-------------------------------------------</p>
                      <div style="text-align: center;">
                        <h3 style="margin: 0; font-size: 12pt;">ఫారం – ${formNumber || '17'}(a)</h3>
                        <h3 style="margin: 0; font-size: 12pt;">రశీదు</h3>
                      </div>
                      <p style="text-align: justify; margin: 10px 0; font-size: 8pt; line-height: 1; word-break: break-all"> ${sanitizeString(mandalName) || '_____________'} మండలము ${notice.rows[0][notice.mapping['Habitation Name']] || '_____________'} గ్రామము నందు నివాస ప్రాంత స్థలముల సర్వే నిర్వహించి, ప్రాపర్టీ పార్సెల్ నెంబరు ${notice.rows[0][notice.mapping['Property Parcel Number']] || '_____________'} యొక్క సర్వే వివరములతో జారీ చేయబడిన ఆంధ్రప్రదేశ్ సర్వే& సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ నోటీసు తేదీ ${formatDate(sanitizeString(printedDate)) || '_____________'} న నాకు ముట్టినది అను విషయాన్ని నేను దృవీకరించుచున్నాను.
                       </p>
          
                      <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8pt; line-height: 1;">
                      
                    
                        <div class="right-footer">
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>నోటీసు తీసుకున్నవారి సంతకము</p>
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>పేరు:శ్రీ/శ్రీమతి ${notice.rows[0][notice.mapping['Owner Name']] || '_________________________'} /
            ${notice.rows[0][notice.mapping['Relation Name']] || '____________________'} </p>
                        </div>
                        <div class="left-footer">
                          <p style="margin: 2px;">పంచాయతీ కార్యదర్శి సంతకం</p>
                          <p style="margin: 2px;">పేరు: ${sanitizeString(officerName) || '_______________'}</p>
                          <p style="margin: 2px;">తేదీ: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
                        </div>
                         
                      </div>
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
          ${createSafeHTML(wordContent.innerHTML, false, true)}
        </body>
        </html>
      `

      // Replace any remaining HTML entities that might not be properly decoded
      const finalHtmlContent = he.decode(htmlContent)

      const blob = new Blob([finalHtmlContent], { type: 'application/msword' })

      // Create download link
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = `land-notices-${panchayatName || 'village'}.doc`

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
          {
            <>
              <h3 className='telugu-text text-center font-bold'>ఫారం - {formNumber || '17'} </h3>
              <h3 className='telugu-text text-center font-bold'>
                (సర్వే మాన్యువల్, చాప్టర్. IX, రూల్ -52) <br></br> ఆంధ్రప్రదేశ్ సర్వే మరియు
                సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు
              </h3>
              {/* <h3 className='telugu-text mb-4 text-center font-bold'>FOR GROUND TRUTHING</h3> */}
              <p className='telugu-text text-justify'>
                <b className='text-red-800'>
                  *Pattadar name and Relation Name visible in Print and Word document
                </b>
                <br />
                &nbsp;&emsp;&emsp;సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ
                సర్వే అధికారి వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది.
              </p>
              <p className='telugu-text mb-0 text-justify'>
                &nbsp;&emsp;&emsp; {mandalName || '______________________'} మండలం{' '}
                {panchayatName || '___________________'} గ్రామ పంచాయతీ నందు నివాస స్థలముల (Rural
                Habitation Survey) సర్వే నిర్వహించిన అనంతరము క్రింది జాబితా నందు తెలిపిన భూముల
                సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు ఏ విధమైన తగాదాలు నాకు తెలియపరచనందున, సదరు
                చట్టం లోని 10(1) సెక్షన్ ననుసరించి, అభ్యంతరములు ఏమియు లేవని భావించి నేను ఇందుమూలముగా
                ఈ భూమి యొక్క సర్వే పటములో పొందుపరచబడిన సరిహద్దులు తగాదాలు లేనట్లుగాను, అవి సరిగా
                వున్నవని నిర్ధారించి నివాస ప్రాంత మ్యాప్ మరియు ఆస్థి వివరముల రికార్డులు తయారు
                చేసియున్నాను.
                <br />
                &nbsp;&emsp;&emsp;సదరు అసెస్మెంట్ రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ
                క్రింది తెలిపిన జాబితా లో తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో
                వాటిని ఈ నోటీసు జారీ ఐన తేది నుండి (21) దినములలో అప్పీలు పునర్విచారణ అధికారిగారికి
                Form - 19 నమూనా పత్రములో అప్పీలు దాఖలు చేసి రశీదు పొందవలెను .
                <br />
                &nbsp;&emsp;&emsp;&emsp; <b>షరా:</b> ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923
                లోని 10(1) వ సెక్షన్ ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము లేదనియు,
                సెక్షన్ (11) ప్రకారము అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
              </p>
            </>
          }
        </div>

        <div
          className='w-full overflow-hidden p-2 sm:p-2 print:bg-transparent print:p-0'
          ref={printRef}
        >
          <PrintableNotice
            districtName={districtName}
            mandalName={mandalName}
            panchayatName={panchayatName}
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
