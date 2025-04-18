import React from 'react'
import { officerDesignations, formNumbers } from './FormSection_ninetwo'
import { districts } from '../data/districts'
import { decodeHTMLEntities } from '../lib/sanitize'
import NoticeTable from './NoticeTable_ninetwo'

interface NoticeData {
  khataNo: string
  rows: string[][]
  mapping: Record<string, number>
  fields: { en: string; te: string }[]
}

interface PrintableNoticeProps {
  districtName: string
  mandalName: string
  villageName: string
  startDate: string
  startTime: string
  notificationNumber: string
  notificationDate: string
  printedDate: string
  notices: NoticeData[]
  showHeaderOnWeb?: boolean
  officerName?: string
  officerDesignation?: string
  formNumber: string
}

const formatTime = (timeString: string): string => {
  if (!timeString) return ''

  try {
    const [hours, minutes] = timeString.split(':')
    const time = new Date()
    time.setHours(parseInt(hours))
    time.setMinutes(parseInt(minutes))
    return time.toLocaleTimeString('en-IN', {
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
    // Format as dd-mm-yyyy
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

const PrintableNotice: React.FC<PrintableNoticeProps> = ({
  districtName,
  mandalName,
  villageName,
  startDate,
  startTime,
  notificationNumber,
  notificationDate,
  printedDate,
  notices,
  showHeaderOnWeb = true,

  officerName,
  officerDesignation,
  formNumber
}) => {
  const formattedTime = formatTime(startTime)
  const formattedDate = formatDate(startDate)
  const formattedNotificationDate = formatDate(notificationDate)
  const formattedPrintedDate = formatDate(printedDate)

  // Define all possible fields that should appear in the table
  const allFields = [
    { en: 'LPM Number', te: 'ల్యాండ్ పార్సెల్ నెంబర్' },
    { en: 'Survey No', te: 'సర్వే నెం' },
    { en: 'Sub Division No', te: 'సబ్ డివిజన్ నెం' },
    { en: 'Old extent (Acres)', te: 'పూర్వపు విస్తీర్ణం (ఎకరం)' },
    { en: 'Old extent (Hect)', te: 'పూర్వపు విస్తీర్ణం (హెక్టార్లు)' },
    { en: 'Resurvey extent (Acres)', te: 'రీ సర్వే విస్తీర్ణం (ఎకరం)' },
    { en: 'Resurvey extent (Hect)', te: 'రీ సర్వే విస్తీర్ణం (హెక్టార్లు)' },
    { en: 'Remark', te: 'రిమార్క్స్' }
  ]

  const formatLPMNumbers = (rows: string[][], mapping: Record<string, number>): string => {
    if (!rows || !rows.length) return '_____________'

    // Use a Set to ensure unique LPM numbers
    const uniqueLpmNumbers = new Set(
      rows
        .map((row) => row[mapping['LPM Number']] || '')
        .filter(Boolean)
        .map((lpm) => decodeHTMLEntities(lpm).replace(/[^\d,.-]/g, ''))
    )

    // Convert Set back to string with comma separation
    const lpmNumbers = Array.from(uniqueLpmNumbers).join(', ')

    return lpmNumbers || '_____________'
  }

  return (
    <div className='ground-truth-notice w-full max-w-full overflow-hidden'>
      {notices.map((notice, noticeIndex) => {
        // Check if subdivision is mapped - only show if it's actually mapped in the data
        const hasSubdivision = 'Sub Division No' in notice.mapping

        // Include only fields that should be shown
        const tableFields = allFields
          .filter((field) => {
            if (field.en === 'Sub Division No' && !hasSubdivision) {
              return false
            }
            return true
          })
          .map((field) => ({
            ...field,
            // Change Survey No column name based on subdivision presence
            te: field.en === 'Survey No' && !hasSubdivision ? 'సర్వే నెంబరు-subdivision' : field.te,
            mappedIndex: notice.mapping[field.en]
          }))

        const lpmNumbersList = formatLPMNumbers(notice.rows, notice.mapping)

        return (
          <div key={`notice-${noticeIndex}`} className='khata-group w-full'>
            {/* Telugu header - only visible in print view, hidden in web view if showHeaderOnWeb is false */}
            <div
              className={`telugu-header-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
            >
              {/* print page */}
              <>
                <h3 className='telugu-text'>
                  {`ఫారం - ${formNumber || '31'}`}
                </h3>

                <h3 className='telugu-text'>
                  ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు
                </h3>
                <h4
                  className='telugu-text mb-0 mt-2 whitespace-normal break-words font-extrabold'
                  style={{ maxWidth: '100%' }}
                >
                  శ్రీ/శ్రీమతి{' '}
                  {notice.rows[0][notice.mapping['Pattadar Name']] || '_________________________'} /{' '}
                  {notice.rows[0][notice.mapping['Relation Name']] || '____________________'} (
                  {notice.rows[0][notice.mapping['Khata No']] || '____________________'}) గారికి
                </h4>
                <p className='notice-paragraph telugu-text'>
                  &nbsp;సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ సర్వే అధికారి
                  వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది.
                  <br />
                  &emsp; ఈ క్రింది జాబితా నందు తెలిపిన భూముల సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు
                  ఏవిధమైన తగాదాలు నాకు తెలియపరచనందున, సదరు చట్టం లోని 10(1) సెక్షన్ ననుసరించి,
                  అభ్యంతరములు ఏమియు లేవని భావించి నేను ఇందుమూలముగా ఈ భూమి యొక్క సర్వే పటములలో
                  పొందుపరచబడిన సరిహద్దులు తగాదాలు లేనట్లుగాను, అవిసరిగా వున్నవని నిర్ధారించి
                  రికార్డులు తయారు చేసియున్నాను.
                  <br />
                  &emsp;సదరు సర్వే రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ క్రింది తెలిపిన
                  జాబితా లో తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో వాటిని ఈ నోటీసు
                  జారీ అయిన తేది నుండి 21 దినములలో మండల రెవిన్యూ కార్యాలయము లో వుండు అప్పీలు సర్వే
                  అధికారి గారికి తగిన నమూనా పత్రములో అప్పీలు సమర్పించుకోవచ్చును.
                  <br />
                  &emsp;షరా: ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం, 1923 లోని 10(1) వ సిక్షన్
                  ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము లేదనియు, సెక్షన్ (11) ప్రకారము
                  అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
                  <br />{' '}
                  <div className='flex w-full justify-between gap-2'>
                    <span>
                      జిల్లా:{' '}
                      {districts.find((d) => d.value === districtName)?.te ||
                        '____________________'}
                    </span>
                    <span>మండలం: {mandalName || '_____________________'}</span>
                    <span>గ్రామం: {villageName || '____________________'}</span>
                  </div>
                </p>
              </>
            </div>

            <NoticeTable fields={tableFields} rows={notice.rows} hasSubdivision={hasSubdivision} />

            <div className='footer-signature-row print:text-sm'>
              <div className='left-column'>
                <p className='body-footer-text telugu-text m-1'>
                  నోటీసు జారి చేసిన తేది: {formattedPrintedDate || '_____________'}
                </p>
              </div>

              <div className='right-column' style={{ paddingRight: '3rem', width: 'max-content' }}>
                <p className='body-footer-text telugu-text mb-0 mt-8 text-left'>
                  సర్వే అధికారి
                  {officerDesignation
                    ? ` (${officerDesignations.find((d) => d.value === officerDesignation)?.te || officerDesignation})`
                    : ''}
                </p>
              </div>
            </div>

            <div
              className={`page-footer telugu-text text-sm ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
            >
              <p className='text-center'>
                -------------------------------------------------------✂️-------------------------------------------------------
              </p>
              <div
                className={`telugu-header-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
              >
                <h3 className='telugu-text m-0 text-center'>{`ఫారం - ${formNumber || '31'}(a)`}</h3>
                <h3 className='telugu-text m-0 text-center'>రశీదు</h3>
              </div>
              <p
                className='notice-paragraph'
                style={{ textAlign: 'justify', marginTop: '0px', marginBottom: '0px' }}
              >
                &emsp; {districts.find((d) => d.value === districtName)?.te || '_____________'}{' '}
                జిల్లా, {mandalName || '_____________'} మండలం, {villageName || '_____________'}{' '}
                గ్రామము నందు రీసర్వే నిర్వహించి, ల్యాండ్ పార్సెల్ నెంబర్ "{lpmNumbersList}" విషయమై
                ఆంధ్రప్రదేశ్ సర్వే & సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము{' '}
                {formattedPrintedDate || '_____________'} తేదీన జారీ చేసిన నోటీసు అందిన విషయాన్ని
                నేను దృవీకరించుచున్నాను.
              </p>

              <div className='footer-signature-row mt-4'>
                <div className='left-column'>
                  <p className='body-footer-text telugu-text m-1'>
                    స్థలం: {villageName || '_____________'}
                  </p>
                  <p className='body-footer-text telugu-text m-1'>తేది:</p>
                </div>

                <div
                  className='right-column'
                  style={{ paddingLeft: '2.2rem', width: 'max-content' }}
                >
                  <p className='body-footer-text telugu-text mb-0 mt-9 text-left'>
                    నోటీసు తీసుకున్న వారి సంతకము
                  </p>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default PrintableNotice
