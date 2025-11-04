import React, { useRef, useEffect } from 'react'
import he from 'he'
import { motion } from 'framer-motion'
import { Card } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Download } from 'lucide-react'
import PrintableNotice from './PrintableNotice_svamitva'
import { toast } from '../components/ui/use-toast'
import { officerDesignations } from './FormSection_svamitva'
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
}

// First, fix the duplicate interface by removing one of them and updating the remaining one
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
  noticeMode = 'assessment-number', // Add default value
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
    { en: 'Survey No', te: 'సర్వే నెంబర్' },
    { en: 'Assessment Number', te: 'అసెస్మెంట్ నెంబర్' },
    { en: 'Owner Name', te: 'భూమి/ ఆస్తి యజమాని పేరు' },
    { en: 'Relation Name', te: 'తండ్రి పేరు' }
  ]

  const optionalFields = [
    { en: 'Property Parcel Number', te: 'ప్రాపర్టీ పార్సెల్ నెంబర్' },
    { en: 'Mobile Number', te: 'మొబైల్ నెంబర్' }
  ]

  let fields = [...requiredFields]
  fields.splice(1, 0, ...optionalFields.filter((f) => f.en === 'Property Parcel Number'))
  fields.push(...optionalFields.filter((f) => f.en !== 'Property Parcel Number'))

  const hasExtent = 'Extent' in indexMapping
  if (noticeType === 'GV Notice' && hasExtent) {
    // Insert Extent after Relation Name (before Mobile Number)
    const relIdx = fields.findIndex((f) => f.en === 'Relation Name')
    fields.splice(relIdx + 1, 0, { en: 'Extent', te: 'విస్తీర్ణం' })
  }

  // Check if we have the necessary fields based on the noticeMode
  const hasPropertyParcelNumber = 'Property Parcel Number' in indexMapping
  const hasAssessmentNumber = 'Assessment Number' in indexMapping
  const hasOwnerName = 'Owner Name' in indexMapping
  const hasRelationName = 'Relation Name' in indexMapping
  const hasMobileNumber = 'Mobile Number' in indexMapping

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
      if (noticeMode === 'mobile-number' && !hasMobileNumber) {
        toast({
          title: 'Warning',
          description: 'Mobile Number is not mapped. Please map the column to generate notices.',
          variant: 'destructive'
        })
      }
    }
  }, [show, noticeMode, hasPropertyParcelNumber, hasMobileNumber])

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
  } else if (noticeMode === 'mobile-number' && hasMobileNumber) {
    const mobileNumberGroups: Record<string, string[][]> = {}
    data.forEach((row) => {
      const mobileNumber = row[indexMapping['Mobile Number']] || 'Unknown'
      if (!mobileNumberGroups[mobileNumber]) {
        mobileNumberGroups[mobileNumber] = []
      }
      mobileNumberGroups[mobileNumber].push(row)
    })

    notices = Object.entries(mobileNumberGroups).map(([mobileNumber, rows]) => ({
      khataNo: mobileNumber,
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
          noticeType === 'GT Notice'
            ? `
          <h1 style="font-size: 14pt; margin-top: 0;">ఫారం - ${formNumber || ' 7'} </h1>
          <h2 style="font-size: 14pt;">ఆస్తి యజమానులకు క్షేత్ర స్థాయి నిజ నిర్ధారణ నోటీసు (Ground Truthing)</h2>

        `
            : `<h1 style="font-size: 14pt; margin-top: 0;"> ఫారం - ${formNumber || ' 15'} </h1>
              <h2 style="font-size: 14pt; margin-bottom: 10px;">ఆస్తి యజమానులకు క్షేత్ర యాజమాన్య ధృవీకరణ నోటీసు (Ground Validation )</h2>  `
        )
        noticeDiv.appendChild(header)

        // Add content
        const content = document.createElement('div')
        content.className = 'content telugu-text'
        content.innerHTML = createSafeHTML(
          noticeType === 'GT Notice'
            ? `
          <p style="font-size: 12pt; line-height: 1.5;word-break: break-all ">
          
           \u00A0\u00A0\u00A0\u00A0 "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి, సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డుల శాఖ, ${districts.find((d) => d.value === districtName)?.te || '____________________'}  జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య ${sanitizeString(notificationNumber) || '________________'} తేది. ${
             formatDate(sanitizeString(notificationDate)) || '____________'
           }, ${sanitizeString(mandalName) || '_____________________'} మండలం, ${
             sanitizeString(panchayatName) || '____________________'
           } గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల సర్వే పనులు ${formatDate(sanitizeString(startDate)) || '_____________'} తేదీన ప్రారంభించబడునని తెలియజేయడమైనది. </p>
          
          
          <p style="font-size: 12pt; line-height: 1.5; word-break: break-all "> \u00A0\u00A0\u00A0\u00A0 సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని నియమ నిబంధనలు అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ ఆస్తుల యొక్క సరిహద్దులు మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు అవసరమైన సహాయ సహకారములు అందించవలసిందిగా తెలియచేయటమైనది.</p>
        `
            : ` <p style="font-size: 12pt; line-height: 1.5; word-break: break-all "> \u00A0\u00A0\u00A0\u00A0 "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి, సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డుల శాఖ, ${districts.find((d) => d.value === districtName)?.te || '____________________'}  జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య ${sanitizeString(notificationNumber) || '________________'} తేది. ${
                formatDate(sanitizeString(notificationDate)) || '____________'
              }, ${sanitizeString(mandalName) || '_____________________'} మండలం, ${
                sanitizeString(panchayatName) || '____________________'
              } గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల <b><u> క్షేత్ర యాజమాన్య ధృవీకరణ </u></b> ${formatDate(sanitizeString(startDate)) || '_____________'} తేదీన ప్రారంభించబడునని తెలియజేయడమైనది.  </p>
          <p style="font-size: 12pt; line-height: 1.5; word-break: break-all "> \u00A0\u00A0\u00A0\u00A0 సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని నియమ నిబంధనలు అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ ఆస్తుల యొక్క సరిహద్దులు మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు అవసరమైన సహాయ సహకారములు అందించవలసిందిగా తెలియచేయటమైనది.</p>  `
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

          tbody.appendChild(tr)
        })

        table.appendChild(tbody)

        noticeDiv.appendChild(table)
        // // Add notice number with proper styling
        // const noticeNumber = document.createElement('div')

        // // noticeNumber.className = 'thirdpoint'
        // noticeNumber.className = 'content telugu-text'
        // noticeNumber.innerHTML = createSafeHTML(
        //   // '<p style="font-size: 12pt; line-height: 1.5;"> 3) నోటీసు యొక్క ప్రతిని సంతకం చేసి తిరిగి పంపించవలెను</p>'
        // )
        // noticeDiv.appendChild(noticeNumber)

        // Add footer
        const footer = document.createElement('div')
        footer.className = 'footer telugu-text'
        // footer.style.marginTop = '10px'
        footer.innerHTML = createSafeHTML(
          noticeType === 'GT Notice'
            ? `
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <div class="left-footer">
              <p>స్థలం: ${sanitizeString(panchayatName) || '_____________'}</p>
              <p>తేది: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
            </div>
            <div class="right-footer">
              <p>ఇంజనీరింగ్ అసిస్టెంట్ సంతకం</p>
              <p> ${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతీ</p>
            </div>

          <div style="margin-top: 20px; text-align: center; font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;">
                      <p>--------------------------------------------✂️-------------------------------------------</p>
                      <div style="text-align: center;">
                        <h3 style="margin: 0; font-size: 12pt;">ఫారం – ${formNumber || '7'}(a)</h3>
                        <h3 style="margin: 0; font-size: 12pt;">రశీదు</h3>
                      </div>
                      <p style="text-align: justify; margin: 10px 0; font-size: 8pt; line-height: 1; word-break: break-all">
                        &emsp; "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA " పథకం అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే & సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1) ను అనుసరించి జారీ చేసిన సర్వే ప్రకటన ప్రకారం. 
                        ${districts.find((d) => d.value === districtName)?.te || '_____________'} జిల్లా,  ${sanitizeString(mandalName) || '_____________'} మండలము లోని ${notice.rows[0][notice.mapping['Habitation Name']] || '_____________'} గ్రామము 
                        ${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతి నందు గల ఆస్తులకు ${formatDate(sanitizeString(startDate)) || '_____________'} తేదిన, ${formatTime(sanitizeString(startTime)) || '_____________'} 
                        సమయంలో సర్వే నిర్వహించబడుతుంది అని సదరు సర్వే కు హాజరై సంబందిత ఆధారాలు చూపి, సహాయ సహకారాలు అందించాలని జారీ చేసిన క్షేత్ర స్థాయి నిజ నిర్ధారణ నోటీసు ${formNumber || '7'} నాకు  ${formatDate(sanitizeString(printedDate)) || '_____________'} తేదీ, __________సమయం న ముట్టినది.

                      </p>
          
                      <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8pt; line-height: 1;">
                      
                    
                        <div class="right-footer">
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>యజమాని / స్వీకరించిన వారి సంతకం</p>
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>పేరు:శ్రీ/శ్రీమతి ${notice.rows[0][notice.mapping['Owner Name']] || '_________________________'} /
            ${notice.rows[0][notice.mapping['Relation Name']] || '____________________'} </p>
                        </div>
                        <div class="left-footer">
                          <p style="margin: 2px;">పంచాయతీ కార్యదర్శి సంతకం</p>
                          <p style="margin: 2px;">పేరు: ${sanitizeString(officerName) || '_______________'}</p>
                          <p style="margin: 2px;">${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతీ</p>
                        </div>
                         
                      </div>
                    </div>

          </div>
        `
            : `
          <div style="display: flex; justify-content: space-between; width: 100%;">
            <div class="left-footer">
              <p>స్థలం: ${sanitizeString(panchayatName) || '_____________'}</p>
              <p>తేది: ${formatDate(sanitizeString(printedDate)) || '_____________'}</p>
            </div>
            <div class="right-footer">
              <p>ఇంజనీరింగ్ అసిస్టెంట్ సంతకం</p>
              <p> ${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతీ</p>
             
            </div>

            <div style="margin-top: 20px; text-align: center; font-family: 'Gautami', 'Noto Sans Telugu', sans-serif;">
                      <p>--------------------------------------------✂️-------------------------------------------</p>
                      <div style="text-align: center;">
                        <h3 style="margin: 0; font-size: 12pt;">ఫారం – ${formNumber || '15'}(a)</h3>
                        <h3 style="margin: 0; font-size: 12pt;">రశీదు</h3>
                      </div>
                      <p style="text-align: justify; margin: 10px 0; font-size: 8pt; line-height: 1; word-break: break-all">
                        &emsp; "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA " పథకం అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే & సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1) ను అనుసరించి జారీ చేసిన సర్వే ప్రకటన ప్రకారం. ${districts.find((d) => d.value === districtName)?.te || '_____________'} జిల్లా, 
                         ${sanitizeString(mandalName) || '_____________'} మండలము లోని ${notice.rows[0][notice.mapping['Habitation Name']] || '_____________'} గ్రామము ${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతి నందు గల ఆస్తులకు ${formatDate(sanitizeString(startDate)) || '_____________'} తేదిన,
                          ${formatTime(sanitizeString(startTime)) || '_____________'} సమయంలో  <b><u>క్షేత్ర యాజమాన్య ధృవీకరణ</u></b> నిర్వహించబడుతుంది అని సదరు సర్వే కు హాజరై సంబందిత ఆధారాలు చూపి, సహాయ సహకారాలు అందించాలని జారీ చేసిన క్షేత్ర స్థాయి నిజ నిర్ధారణ నోటీసు ${formNumber || '7'} నాకు  ${formatDate(sanitizeString(printedDate)) || '_____________'} తేదీ, __________సమయం న ముట్టినది.

                      </p>
          
                      <div style="display: flex; justify-content: space-between; width: 100%; font-size: 8pt; line-height: 1;">
                      
                    
                        <div class="right-footer">
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>యజమాని / స్వీకరించిన వారి సంతకం</p>
                          <p class='body-footer-text telugu-text mb-0 mt-0 text-left'>పేరు:శ్రీ/శ్రీమతి ${notice.rows[0][notice.mapping['Owner Name']] || '_________________________'} /
            ${notice.rows[0][notice.mapping['Relation Name']] || '____________________'} </p>
                        </div>
                        <div class="left-footer">
                          <p style="margin: 2px;">పంచాయతీ కార్యదర్శి సంతకం</p>
                          <p style="margin: 2px;">పేరు: ${sanitizeString(officerName) || '_______________'}</p>
                          <p style="margin: 2px;">${sanitizeString(panchayatName) || '_____________'} గ్రామ పంచాయతీ</p>
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
          {noticeType === 'GT Notice' ? (
            <>
              <h3 className='telugu-text text-center font-bold'>ఫారం - {formNumber || '7'} </h3>
              <h3 className='telugu-text text-center font-bold'>
                ఆస్తి యజమానులకు క్షేత్ర స్థాయి నిజ నిర్ధారణ నోటీసు (Ground Truthing)
              </h3>
              {/* <h3 className='telugu-text mb-4 text-center font-bold'>FOR GROUND TRUTHING</h3> */}
              <p className='text-justify' style={{ marginBottom: '0px', wordBreak: 'break-all' }}>
                {'\u00A0\u00A0\u00A0\u00A0'} "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో
                భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి,
                సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డుల శాఖ,{' '}
                {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య {notificationNumber || '________________'},
                తేది. {formatDate(notificationDate) || '____________'}, అనుసరించి,{' '}
                {mandalName || '______________________'} మండలం,{' '}
                {panchayatName || '___________________'} గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల
                సర్వే పనులు {startDate ? formatDate(startDate) : '_____________'} తేదీన
                ప్రారంభించబడునని తెలియజేయడమైనది.
                <br />
                {'\u00A0\u00A0\u00A0\u00A0'} సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని నియమ నిబంధనలు
                అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ ఆస్తుల యొక్క సరిహద్దులు
                మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు అవసరమైన సహాయ సహకారములు
                అందించవలసిందిగా తెలియచేయటమైనది.
              </p>
            </>
          ) : (
            <>
              <h3 className='telugu-text text-center font-bold'>ఫారం - {formNumber || '15'} </h3>

              <h3 className='telugu-text text-center font-bold'>
                ఆస్తి యజమానులకు క్షేత్ర యాజమాన్య ధృవీకరణ నోటీసు (Ground Validation )
              </h3>
              <p className='text-justify' style={{ marginBottom: '0px', wordBreak: 'break-all' }}>
                {'\u00A0\u00A0\u00A0\u00A0'} "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో
                భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి,
                సహాయ సంచాలకులు, సర్వే మరియు భూమి రికార్డుల శాఖ,{' '}
                {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య {notificationNumber || '________________'},
                తేది. {formatDate(notificationDate) || '____________'}, అనుసరించి,{' '}
                {mandalName || '______________________'} మండలం,{' '}
                {panchayatName || '___________________'} గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల{' '}
                {'\u00A0'}
                <b>
                  <u>క్షేత్ర యాజమాన్య ధృవీకరణ</u>
                </b>{' '}
                {startDate ? formatDate(startDate) : '_____________'} తేదీన ప్రారంభించబడునని
                తెలియజేయడమైనది.
                <br />
                {'\u00A0\u00A0\u00A0\u00A0'} సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని నియమ నిబంధనలు
                అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ ఆస్తుల యొక్క సరిహద్దులు
                మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు అవసరమైన సహాయ సహకారములు
                అందించవలసిందిగా తెలియచేయటమైనది.
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
