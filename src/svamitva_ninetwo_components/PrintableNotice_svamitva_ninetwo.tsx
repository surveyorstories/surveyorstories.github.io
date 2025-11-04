import React from 'react'
import { officerDesignations, formNumbers } from './FormSection_svamitva_ninetwo'
import { districts } from '../data/districts'
import { decodeHTMLEntities } from '../lib/sanitize'
import KhataTable from './KhataTable_svamitva_ninetwo'

interface NoticeData {
  khataNo: string
  rows: string[][]
  mapping: Record<string, number>
  fields: { en: string; te: string }[]
}

// Add noticeMode to the component props
interface PrintableNoticeProps {
  districtName: string
  mandalName: string
  panchayatName: string
  startDate: string
  startTime: string
  notificationNumber: string
  notificationDate: string
  printedDate: string
  notices: NoticeData[]
  showHeaderOnWeb?: boolean
  noticeType: string
  officerName?: string
  officerDesignation?: string
  noticeMode?: string
  formNumber: string
  habitationName?: string
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

const stripQuotes = (text: string) => {
  if (!text) return ''
  return text.replace(/^['"](.*)['"]$/, '$1')
}

const formatLPMNumbers = (rows: string[][], mapping: Record<string, number>): string => {
  if (!rows || !mapping) {
    return ''
  }
  const propertyParcelNumberKey = 'Property Parcel Number'
  const lpmNoKey = 'LPM No'

  let parcelNumberIndex = mapping[propertyParcelNumberKey]

  if (typeof parcelNumberIndex !== 'number') {
    parcelNumberIndex = mapping[lpmNoKey]
  }

  if (typeof parcelNumberIndex !== 'number') {
    console.log(
      `Warning: '${propertyParcelNumberKey}' or '${lpmNoKey}' not found in mapping.`,
      mapping
    )
    return ''
  }
  const lpmNumbers = rows.map((row) => stripQuotes(decodeHTMLEntities(row[parcelNumberIndex])))
  return lpmNumbers.join(', ')
}

// Update the component function to include noticeMode in the parameters
const PrintableNotice: React.FC<PrintableNoticeProps> = ({
  districtName,
  mandalName,
  panchayatName,
  startDate,
  startTime,
  notificationNumber,
  notificationDate,
  printedDate,
  notices,
  showHeaderOnWeb = true,
  noticeType,
  officerName,
  officerDesignation,
  noticeMode = 'khata', // Default value: 'khata', 'survey', or 'khata-pattadar-once'
  formNumber,
  habitationName // Add this line
}) => {
  const formattedTime = formatTime(startTime)
  const formattedDate = formatDate(startDate)
  const formattedNotificationDate = formatDate(notificationDate)
  const formattedPrintedDate = formatDate(printedDate)

  return (
    <div className='ground-truth-notice w-full max-w-full overflow-hidden'>
      {notices.map((notice, noticeIndex) => {
        const lpmNumbersList = formatLPMNumbers(notice.rows, notice.mapping)
        return (
          <div key={`notice-${noticeIndex}`} className='khata-group w-full'>
            {/* Telugu header - only visible in print view, hidden in web view if showHeaderOnWeb is false */}
            <div
              className={`telugu-header-print telugu-text ${
                !showHeaderOnWeb ? 'hidden-on-web' : ''
              }`}
            >
              {/* print page */}
              {
                <>
                  <h3 className='telugu-text text-center font-bold'>
                    ఫారం - {formNumber || '17'}{' '}
                  </h3>
                  <h3 className='telugu-text text-center font-bold'>
                    (సర్వే మాన్యువల్, చాప్టర్. IX, రూల్ -52) <br /> ఆంధ్రప్రదేశ్ సర్వే మరియు
                    సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ ప్రకారము నోటీసు
                  </h3>
                  <h4
                    className='telugu-text mb-0 mt-2 whitespace-normal break-words text-[13px] font-extrabold'
                    style={{ maxWidth: '100%' }}
                  >
                    శ్రీ / శ్రీమతి /కుమారి{' '}
                    {stripQuotes(
                      decodeHTMLEntities(notice.rows[0][notice.mapping['Owner Name']])
                    ) || '_________________________'}
                    <br />
                    S/O,H/O,D/O,W/O{' '}
                    {stripQuotes(
                      decodeHTMLEntities(notice.rows[0][notice.mapping['Relation Name']])
                    ) || '____________________'}{' '}
                    <br />
                    {stripQuotes(
                      decodeHTMLEntities(notice.rows[0][notice.mapping['Habitation Name']])
                    ) || '____________________'}{' '}
                    గ్రామము,
                    <br />
                    {panchayatName || '___________________'} గ్రామ పంచాయతీ
                  </h4>
                  {/* <h3 className='telugu-text mb-4 text-center font-bold'>FOR GROUND TRUTHING</h3> */}
                  <p className='notice-paragraph break-all text-justify indent-[2em]'>
                    &nbsp;&emsp;&emsp;సదరు చట్టం 9(1) వ సెక్షన్ ప్రకారము ఈ క్రింద సంతకము చేసిన సమర్ధ
                    సర్వే అధికారి వల్ల ఈ క్రింది తెలిపిన వివరములను నిర్ణయించడమైనది.
                  </p>
                  <p className='notice-paragraph break-all text-justify indent-[2em]'>
                    &nbsp;&emsp;&emsp; {mandalName || '______________________'} మండలం{' '}
                    {panchayatName || '___________________'} గ్రామ పంచాయతీ నందు నివాస స్థలముల (Rural
                    Habitation Survey) సర్వే నిర్వహించిన అనంతరము క్రింది జాబితా నందు తెలిపిన భూముల
                    సరిహద్దుల నిర్ణయం మరియు కొలత సమయము నందు ఏ విధమైన తగాదాలు నాకు తెలియపరచనందున,
                    సదరు చట్టం లోని 10(1) సెక్షన్ ననుసరించి, అభ్యంతరములు ఏమియు లేవని భావించి నేను
                    ఇందుమూలముగా ఈ భూమి యొక్క సర్వే పటములో పొందుపరచబడిన సరిహద్దులు తగాదాలు
                    లేనట్లుగాను, అవి సరిగా వున్నవని నిర్ధారించి నివాస ప్రాంత మ్యాప్ మరియు ఆస్థి
                    వివరముల రికార్డులు తయారు చేసియున్నాను.
                    <br />
                    &nbsp;&emsp;&emsp;సదరు అసెస్మెంట్ రిజిస్టర్ లో నమోదు కాబడిన భూముల వివరములను ఈ
                    క్రింది తెలిపిన జాబితా లో తెలియపరచడమైనది. ఈ జాబితా పై ఏవిధమైన అభ్యంతరములు ఉన్నచో
                    వాటిని ఈ నోటీసు జారీ ఐన తేది నుండి (21) దినములలో అప్పీలు పునర్విచారణ
                    అధికారిగారికి Form - 19 నమూనా పత్రములో అప్పీలు దాఖలు చేసి రశీదు పొందవలెను .
                    <br />
                    &nbsp;&emsp;&emsp;&emsp; <b>షరా:</b> ఆంధ్రప్రదేశ్ సర్వే మరియు సరిహద్దుల చట్టం,
                    1923 లోని 10(1) వ సెక్షన్ ప్రకారము ఈ భూమి సరిహద్దుల విషయమై ఎటువంటి అభ్యంతరము
                    లేదనియు, సెక్షన్ (11) ప్రకారము అప్పీలు మాత్రమే వున్నదని తెలియచేయడమైనది.
                  </p>
                </>
              }

              {/* Add a small indicator for the grouping mode */}
              {/* <p className='text-xs text-right italic hidden-on-web'>
              Grouped by: {noticeMode === 'khata' ? 'Khata Number' : 'Survey Number'}
            </p> */}
            </div>

            <div className='table-container mt-0 table w-full overflow-x-auto'>
              <KhataTable notice={notice} noticeType={noticeType} noticeMode={noticeMode} />
              {/* <p
              className={`thirdpoint-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
            >
              3) నోటీసు యొక్క ప్రతిని సంతకం చేసి తిరిగి పంపించవలెను
            </p> */}
            </div>

            <div className='page-footer'>
              <div className='footer-signature-row notice-paragraph'>
                <div className='left-column'>
                  <p className='body-footer-text telugu-text'>
                    నోటీసు జారీ చేసిన తేదీ: {formattedPrintedDate || '_____________'}
                  </p>
                </div>

                <div className='right-column'>
                  <p className='body-footer-text telugu-text mb-0 pr-3 text-right print:mt-8'>
                    ఇంజనీరింగ్ అసిస్టెంట్ సంతకం
                  </p>
                  <p className='body-footer-text telugu-text mb-0 pr-3 text-right'>
                    {panchayatName || '_____________'} గ్రామ పంచాయతీ
                  </p>
                  <p className='body-footer-text telugu-text text-right'>
                    {mandalName || '_____________'} మండలం
                  </p>
                </div>
              </div>
              <div>
                <div
                  className={`page-footer telugu-text text-sm ${
                    !showHeaderOnWeb ? 'hidden-on-web' : ''
                  }`}
                >
                  <p className='text-center'>
                    ----------------------------------------------------------✂️----------------------------------------------------------
                  </p>
                  {
                    <div>
                      <div
                        className={`telugu-header-print telugu-text ${
                          !showHeaderOnWeb ? 'hidden-on-web' : ''
                        }`}
                      >
                        <h3 className='telugu-text m-0 text-center'>{`ఫారం - ${
                          formNumber || '17'
                        }(a)`}</h3>
                        <h3 className='telugu-text m-0 text-center'>రశీదు</h3>
                      </div>
                      <p className='notice-paragraph mb-0 mt-0 text-justify indent-[2em]'>
                        {mandalName || '_____________'} మండలము{' '}
                        {stripQuotes(
                          decodeHTMLEntities(notice.rows[0][notice.mapping['Habitation Name']])
                        ) || '____________________'}{' '}
                        గ్రామము నందు నివాస ప్రాంత స్థలముల సర్వే నిర్వహించి, ప్రాపర్టీ పార్సెల్
                        నెంబరు {lpmNumbersList} యొక్క సర్వే వివరములతో జారీ చేయబడిన ఆంధ్రప్రదేశ్
                        సర్వే& సరిహద్దుల చట్టం, 1923 లోని 9(2) సెక్షన్ నోటీసు తేదీ{' '}
                        {formattedPrintedDate || '_____________'} న నాకు ముట్టినది అను విషయాన్ని
                        నేను దృవీకరించుచున్నాను.
                      </p>
                    </div>
                  }

                  <div className='footer-signature-row notice-paragraph print:mt-8'>
                    <div className='left-column'>
                      <p className='body-footer-text telugu-text mb-0'> పంచాయతీ కార్యదర్శి సంతకం</p>
                      <p className='body-footer-text telugu-text mb-0'>
                        పేరు: {officerName || '____________________'}
                      </p>
                      <p className='body-footer-text telugu-text'>
                        తేదీ: {formattedPrintedDate || '_____________'}
                      </p>
                    </div>
                    <div className='right-column'>
                      <p className='body-footer-text telugu-text mb-0 pr-3 text-right'>
                        నోటీసు తీసుకున్నవారి సంతకము
                      </p>
                      <p className='body-footer-text telugu-text text-right'>
                        {stripQuotes(
                          decodeHTMLEntities(notice.rows[0][notice.mapping['Owner Name']])
                        ) || '_________________________'}{' '}
                        /{' '}
                        {stripQuotes(
                          decodeHTMLEntities(notice.rows[0][notice.mapping['Relation Name']])
                        ) || '____________________'}
                      </p>
                    </div>
                  </div>
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
