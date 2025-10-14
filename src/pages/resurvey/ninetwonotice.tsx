import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../../ninetwo_components/Header_ninetwo'
import FormSection from '../../ninetwo_components/FormSection_ninetwo'
import MappingTable from '../../ninetwo_components/MappingTable_ninetwo'
import PreviewSection from '../../ninetwo_components/PreviewSection_ninetwo'
import { toast } from '../../components/ui/use-toast'
import { Button } from '../../components/ui/button'
import { Printer, AlertTriangle } from 'lucide-react'
import Layout from '@theme/Layout'
import { Toaster } from '../../components/ui/toaster'
import ErrorBoundary from '../../components/ErrorBoundary'

const Disclaimer = ({ onAccept }) => (
  <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm'>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='relative w-full max-w-2xl rounded-2xl border-2 border-amber-500/50 bg-background p-8 shadow-2xl'
    >
      <div className='mb-6 flex items-center'>
        <AlertTriangle className='mr-4 h-10 w-10 text-amber-500' />
        <h2 className='text-3xl font-bold text-foreground'>Important Notice</h2>
      </div>
      <div className='max-h-[60vh] space-y-5 overflow-y-auto pr-4 text-base text-muted-foreground'>
        <div className='rounded-lg border border-secondary bg-secondary/50 p-4'>
          <p className='font-semibold'>
            The official Bhunaksha portal now provides 9(2) Notices. We strongly recommend using the
            official platform:
            <a
              href='https://bhunaksha.ap.gov.in/resurvey'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-1 block truncate font-bold text-primary hover:underline'
            >
              👉 Visit Official Portal: bhunaksha.ap.gov.in/resurvey
            </a>
          </p>
        </div>

        <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive-foreground'>
          <p className='font-bold text-red-500'>
            <span className='font-extrabold'>Service Update:</span> The 9(2) Notice generation
            feature on this website will be discontinued soon.
          </p>
        </div>

        <div className='text-sm'>
          <p className='font-semibold'>By proceeding, you acknowledge and agree that:</p>
          <ul className='mt-2 list-inside list-disc space-y-1'>
            <li>
              Surveyor Stories is not responsible for the accuracy or validity of generated notices.
            </li>
            <li>Usage of this tool is entirely at your own risk.</li>
            <li>Official acceptance of notices from this site is not guaranteed.</li>
          </ul>
        </div>

        <p className='pt-4 text-center text-sm'>
          Thank you for your understanding and continued support.
        </p>
      </div>
      <div className='mt-8 flex justify-end'>
        <Button
          onClick={onAccept}
          size='lg'
          className='bg-primary font-bold text-primary-foreground hover:bg-primary/90'
        >
          I Acknowledge and Proceed
        </Button>
      </div>
    </motion.div>
  </div>
)

const MappingWarningModal = ({ onAccept, onCancel }) => (
  <div className='fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm'>
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='relative w-full max-w-2xl rounded-2xl border-2 border-amber-500/50 bg-background p-8 shadow-2xl'
    >
      <div className='mb-6 flex items-center'>
        <AlertTriangle className='mr-4 h-10 w-10 text-amber-500' />
        <h2 className='text-3xl font-bold text-foreground'>Important Disclaimer</h2>
      </div>
      <div className='max-h-[60vh] space-y-5 overflow-y-auto pr-4 text-base text-muted-foreground'>
        <div className='rounded-lg border border-secondary bg-secondary/50 p-4'>
          <p className='font-semibold'>
            The official Bhunaksha portal has now enabled the provision for generating 9(2) Notices.
            Users are therefore advised to use the official platform for this purpose:
            <a
              href='https://bhunaksha.ap.gov.in/resurvey'
              target='_blank'
              rel='noopener noreferrer'
              className='mt-1 block truncate font-bold text-primary hover:underline'
            >
              👉 https://bhunaksha.ap.gov.in/resurvey
            </a>
          </p>
        </div>

        <div className='rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive-foreground'>
          <p className='font-bold text-red-500'>
            Please note that the 9(2) Notice generation feature on the Surveyor Stories website will
            be disabled very soon.
          </p>
        </div>

        <div className='text-sm'>
          <p>
            Surveyor Stories does not hold any responsibility for the accuracy, validity, or
            official acceptance of notices generated through this website. Users who continue to use
            this feature do so at their own risk.
          </p>
        </div>

        <p className='pt-4 text-center text-sm'>
          We thank you for showing your interest in Surveyor Stories and for your continued support.
        </p>
      </div>
      <div className='mt-8 flex justify-end space-x-4'>
        <Button onClick={onCancel} size='lg' variant='outline'>
          Cancel
        </Button>
        <Button
          onClick={onAccept}
          size='lg'
          className='bg-primary font-bold text-primary-foreground hover:bg-primary/90'
        >
          I Acknowledge and Proceed
        </Button>
      </div>
    </motion.div>
  </div>
)

function Index() {
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(false)
  const [showMappingWarning, setShowMappingWarning] = useState(false)

  // Form state
  const [districtName, setDistrictName] = useState('')
  const [mandalName, setMandalName] = useState('')
  const [villageName, setVillageName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [notificationNumber, setNotificationNumber] = useState('')
  const [notificationDate, setNotificationDate] = useState('')
  const [printedDate, setPrintedDate] = useState('')
  const [officerName, setOfficerName] = useState('')
  const [officerDesignation, setOfficerDesignation] = useState('')
  // Add new state for notice type
  const [noticeType, setNoticeType] = useState('khata')
  const [formNumber, setFormNumber] = useState('') // <-- Add this line

  // CSV data state
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<string[][]>([])
  const [showMapping, setShowMapping] = useState(false)

  // Mapping and preview state
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)

  const handleFileUpload = (headers, data) => {
    const filteredHeaders = headers.filter((header) => header && header.trim() !== '')
    setHeaders(filteredHeaders)
    setData(data)
    setShowMapping(true)
    setShowPreview(false)

    toast({
      title: 'File Uploaded Successfully',
      description: `${data.length} rows loaded. Please map the columns.`
    })
  }

  const handleMappingSubmit = (mapping) => {
    setMapping(mapping)
    setShowMappingWarning(true)
  }

  const handleMappingWarningAccept = () => {
    setShowMappingWarning(false)
    setShowPreview(true)

    toast({
      title: 'Column Mapping Complete',
      description: 'Preview generated. You can now print the notices.'
    })
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <Layout title='Resurvey Notice Generator' description='Generate Resurvey Notices with ease.'>
      {!disclaimerAccepted && <Disclaimer onAccept={() => setDisclaimerAccepted(true)} />}
      {showMappingWarning && (
        <MappingWarningModal
          onAccept={handleMappingWarningAccept}
          onCancel={() => setShowMappingWarning(false)}
        />
      )}
      <ErrorBoundary>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='min-h-screen w-full overflow-hidden bg-gradient-to-b from-background to-secondary/20'
          style={{ filter: !disclaimerAccepted || showMappingWarning ? 'blur(8px)' : 'none' }}
        >
          <div className='container mx-auto w-full max-w-6xl overflow-hidden px-2 py-8 sm:px-4'>
            <div className='whitespace-nowrap'>
              <Header />
            </div>

            <div className='mt-8 w-full space-y-8 overflow-hidden print:m-0'>
              <FormSection
                onFileUpload={handleFileUpload}
                districtName={districtName}
                setDistrictName={setDistrictName}
                mandalName={mandalName}
                setMandalName={setMandalName}
                villageName={villageName}
                setVillageName={setVillageName}
                startDate={startDate}
                setStartDate={setStartDate}
                startTime={startTime}
                setStartTime={setStartTime}
                notificationNumber={notificationNumber}
                setNotificationNumber={setNotificationNumber}
                notificationDate={notificationDate}
                setNotificationDate={setNotificationDate}
                printedDate={printedDate}
                setPrintedDate={setPrintedDate}
                officerName={officerName}
                setOfficerName={setOfficerName}
                officerDesignation={officerDesignation}
                setOfficerDesignation={setOfficerDesignation}
                // Pass the new notice type props
                noticeType={noticeType}
                setNoticeType={setNoticeType}
                formNumber={formNumber} // <-- Add this line
                setFormNumber={setFormNumber} // <-- Add this line
              />

              <MappingTable
                headers={headers}
                show={showMapping}
                onMappingSubmit={handleMappingSubmit}
                onPreview={() => setShowPreview(true)}
                noticeType={noticeType}
              />

              <PreviewSection
                districtName={districtName}
                mandalName={mandalName}
                villageName={villageName}
                startDate={startDate}
                startTime={startTime}
                notificationNumber={notificationNumber}
                notificationDate={notificationDate}
                printedDate={printedDate}
                show={showPreview}
                headers={headers}
                data={data}
                mapping={mapping}
                officerName={officerName}
                officerDesignation={officerDesignation}
                // Make sure this is passed
                noticeType={noticeType}
                formNumber={formNumber} // <-- Add this line
              />
            </div>
          </div>

          {showPreview && (
            <div className='fixed bottom-8 right-8 z-50 print:hidden'>
              <Button
                onClick={handlePrint}
                className='flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90'
                size='icon'
              >
                <Printer className='h-6 w-6' />
              </Button>
            </div>
          )}
        </motion.div>
      </ErrorBoundary>
      <Toaster />
    </Layout>
  )
}

export default Index
