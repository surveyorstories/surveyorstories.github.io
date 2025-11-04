import React from 'react'
import { officerDesignations, formNumbers } from './FormSection_svamitva'
import { districts } from '../data/districts'
import { decodeHTMLEntities } from '../lib/sanitize'
import KhataTable from './KhataTable_svamitva'

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
      {notices.map((notice, noticeIndex) => (
        <div key={`notice-${noticeIndex}`} className='khata-group w-full'>
          {/* Telugu header - only visible in print view, hidden in web view if showHeaderOnWeb is false */}
          <div
            className={`telugu-header-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
          >
            {/* print page */}
            {noticeType === 'GT Notice' ? (
              <>
                <h3 className='telugu-text'>
                  {(formNumbers[noticeType] || []).find((f) => f.value === formNumber)?.te ||
                    `ఫారం - ${formNumber || ' 7'}`}
                </h3>

                <h3 className='telugu-text text-center font-bold'>
                  ఆస్తి యజమానులకు క్షేత్ర స్థాయి నిజ నిర్ధారణ నోటీసు (Ground Truthing)
                </h3>
                <p className='notice-paragraph break-all text-justify indent-[2em]'>
                  "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు
                  సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి, సహాయ సంచాలకులు, సర్వే మరియు
                  భూమి రికార్డుల శాఖ,{' '}
                  {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                  జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య {notificationNumber || '________________'},
                  తేది. {formatDate(notificationDate) || '____________'}, అనుసరించి,{' '}
                  {mandalName || '______________________'} మండలం,{' '}
                  {panchayatName || '___________________'} గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల
                  సర్వే పనులు {startDate ? formatDate(startDate) : '_____________'} తేదీన
                  ప్రారంభించబడునని తెలియజేయడమైనది.
                  <br />
                  <span className='inline-block w-[2em]'></span>సర్వే మరియు సరిహద్దుల చట్టం, 1923
                  లోని నియమ నిబంధనలు అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ
                  ఆస్తుల యొక్క సరిహద్దులు మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు
                  అవసరమైన సహాయ సహకారములు అందించవలసిందిగా తెలియచేయటమైనది.
                </p>
              </>
            ) : (
              <>
                <h3 className='telugu-text'>
                  {(formNumbers[noticeType] || []).find((f) => f.value === formNumber)?.te ||
                    `ఫారం - ${formNumber || '15'}`}
                </h3>
                <h3 className='telugu-text'>
                  ఆస్తి యజమానులకు క్షేత్ర యాజమాన్య ధృవీకరణ నోటీసు (Ground Validation )
                </h3>
                <p className='notice-paragraph break-all text-justify indent-[2em]'>
                  "ANDHRA PRADESH RESURVEY PROJECT /SVAMITVA" అమలులో భాగంగా ఆంధ్రప్రదేశ్ సర్వే మరియు
                  సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1)ను అనుసరించి, సహాయ సంచాలకులు, సర్వే మరియు
                  భూమి రికార్డుల శాఖ,{' '}
                  {districts.find((d) => d.value === districtName)?.te || '____________________'}{' '}
                  జిల్లా, వారు జారీ చేసిన ప్రకటన సంఖ్య {notificationNumber || '________________'},
                  తేది. {formatDate(notificationDate) || '____________'}, అనుసరించి,{' '}
                  {mandalName || '______________________'} మండలం,{' '}
                  {panchayatName || '___________________'} గ్రామ పంచాయతీ పరిధిలోని ఆస్తుల / భూముల{' '}
                  <b>
                    <u>క్షేత్ర యాజమాన్య ధృవీకరణ</u>
                  </b>{' '}
                  {startDate ? formatDate(startDate) : '_____________'} తేదీన ప్రారంభించబడునని
                  తెలియజేయడమైనది.
                  <br />
                  <span className='inline-block w-[2em]'></span>సర్వే మరియు సరిహద్దుల చట్టం, 1923
                  లోని నియమ నిబంధనలు అనుసరించి సర్వే జరుగు సమయం నందు మీ ఆస్తి/ భూమి వద్ద హాజరై మీ
                  ఆస్తుల యొక్క సరిహద్దులు మరియు ఆస్తి ధ్రువ పత్రాలు చూపించి గ్రామ సర్వే బృందమునకు
                  అవసరమైన సహాయ సహకారములు అందించవలసిందిగా తెలియచేయటమైనది.
                </p>
              </>
            )}

            {/* Add a small indicator for the grouping mode */}
            {/* <p className='text-xs text-right italic hidden-on-web'>
              Grouped by: {noticeMode === 'khata' ? 'Khata Number' : 'Survey Number'}
            </p> */}
          </div>

          <div className='table-container table w-full overflow-x-auto'>
            <KhataTable notice={notice} noticeType={noticeType} noticeMode={noticeMode} />
            {/* <p
              className={`thirdpoint-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
            >
              3) నోటీసు యొక్క ప్రతిని సంతకం చేసి తిరిగి పంపించవలెను
            </p> */}
          </div>

          <div className='page-footer'>
            <div className='footer-signature-row notice-paragraph print:mt-8'>
              <div className='left-column'>
                <p className='body-footer-text telugu-text mb-0'>
                  స్థలం: {panchayatName || '_____________'}
                </p>
                <p className='body-footer-text telugu-text'>
                  తేది: {formattedPrintedDate || '_____________'}
                </p>
              </div>

              <div className='right-column'>
                <p className='body-footer-text telugu-text mb-0 pr-3 text-right'>
                  ఇంజనీరింగ్ అసిస్టెంట్ సంతకం
                </p>
                <p className='body-footer-text telugu-text text-right'>
                  {panchayatName || '_____________'} గ్రామ పంచాయతీ
                </p>
              </div>
            </div>
            <div>
              <div
                className={`page-footer telugu-text text-sm ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
              >
                <p className='text-center'>
                  -------------------------------------------------------✂️-------------------------------------------------------
                </p>
                {noticeType === 'GT Notice' ? (
                  <div>
                    <div
                      className={`telugu-header-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
                    >
                      <h3 className='telugu-text m-0 text-center'>{`ఫారం - ${formNumber || '7'}(a)`}</h3>
                      <h3 className='telugu-text m-0 text-center'>రశీదు</h3>
                    </div>
                    <p className='notice-paragraph mb-0 mt-0 text-justify indent-[2em]'>
                      "ANDHRA PRADESH RESURVEY PROJECT / స్వామిత్వ పథకం” అమలులో భాగంగా ఆంధ్రప్రదేశ్
                      సర్వే & సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1) ను అనుసరించి జారీ చేసిన సర్వే
                      ప్రకటన ప్రకారం{' '}
                      {districts.find((d) => d.value === districtName)?.te || '_____________'}{' '}
                      జిల్లా, {mandalName || '_____________'} మండలము లోని,{' '}
                      {notice.rows[0][notice.mapping['Habitation Name']] || '____________________'}{' '}
                      గ్రామము, {panchayatName || '_____________'} గ్రామ పంచాయతి నందు గల ఆస్తులకు{' '}
                      {startDate ? formatDate(startDate) : '_____________'},{' '}
                      {startTime ? formatTime(startTime) : '_____________'} సమయంలో సర్వే
                      నిర్వహించబడుతుంది అని సదరు సర్వే కు హాజరై సంబందిత ఆధారాలు చూపి, గ్రామ సర్వే
                      బృందానికి సహాయ సహకారాలు అందించాలని జారీ చేసిన {`ఫారం - ${formNumber || '7'}`}{' '}
                      నోటీసు నాకు {formattedPrintedDate || '_____________'}, -_________సమయం న
                      ముట్టినది.
                    </p>
                  </div>
                ) : (
                  <div>
                    <div
                      className={`telugu-header-print telugu-text ${!showHeaderOnWeb ? 'hidden-on-web' : ''}`}
                    >
                      <h3 className='telugu-text m-0 text-center'>{`ఫారం - ${formNumber || '15'}(a)`}</h3>
                      <h3 className='telugu-text m-0 text-center'>రశీదు</h3>
                    </div>
                    <p className='notice-paragraph mb-0 mt-0 text-justify indent-[2em]'>
                      "ANDHRA PRADESH RESURVEY PROJECT / స్వామిత్వ పథకం” అమలులో భాగంగా ఆంధ్రప్రదేశ్
                      సర్వే & సరిహద్దుల చట్టం, 1923 లోని సెక్షన్ 6(1) ను అనుసరించి జారీ చేసిన సర్వే
                      ప్రకటన ప్రకారం{' '}
                      {districts.find((d) => d.value === districtName)?.te || '_____________'}{' '}
                      జిల్లా, {mandalName || '_____________'} మండలము లోని,{' '}
                      {notice.rows[0][notice.mapping['Habitation Name']] || '____________________'}{' '}
                      గ్రామము, {panchayatName || '_____________'} గ్రామ పంచాయతి నందు గల ఆస్తులకు{' '}
                      {startDate ? formatDate(startDate) : '_____________'},{' '}
                      {startTime ? formatTime(startTime) : '_____________'} సమయంలో{' '}
                      <b>
                        <u>క్షేత్ర యాజమాన్య ధృవీకరణ</u>
                      </b>
                      నిర్వహించబడుతుంది అని సదరు సర్వే కు హాజరై సంబందిత ఆధారాలు చూపి, గ్రామ సర్వే
                      బృందానికి సహాయ సహకారాలు అందించాలని జారీ చేసిన {`ఫారం - ${formNumber || '15'}`}{' '}
                      నోటీసు నాకు {formattedPrintedDate || '_____________'}, -_________సమయం న
                      ముట్టినది.
                    </p>{' '}
                  </div>
                )}

                <div className='footer-signature-row notice-paragraph mt-8'>
                  <div className='left-column'>
                    <p className='body-footer-text telugu-text mb-0'> పంచాయతీ కార్యదర్శి సంతకం</p>
                    <p className='body-footer-text telugu-text mb-0'>
                      పేరు: {officerName || '____________________'}
                    </p>
                    <p className='body-footer-text telugu-text'>
                      {panchayatName || '____________________'} గ్రామ పంచాయతీ
                    </p>
                  </div>
                  <div className='right-column'>
                    <p className='body-footer-text telugu-text mb-0 pr-3 text-right'>
                      యజమాని / స్వీకరించిన వారి సంతకం
                    </p>
                    <p className='body-footer-text telugu-text text-right'>
                      పేరు:{' '}
                      {notice.rows[0][notice.mapping['Owner Name']] || '_________________________'}{' '}
                      / {notice.rows[0][notice.mapping['Relation Name']] || '____________________'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default PrintableNotice
