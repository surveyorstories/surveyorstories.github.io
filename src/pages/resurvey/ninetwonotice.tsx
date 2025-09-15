import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Header from '../../ninetwo_components/Header_ninetwo'
import FormSection from '../../ninetwo_components/FormSection_ninetwo'
import MappingTable from '../../ninetwo_components/MappingTable_ninetwo'
import PreviewSection from '../../ninetwo_components/PreviewSection_ninetwo'
import { toast } from '../../components/ui/use-toast'
import { Button } from '../../components/ui/button'
import { Printer } from 'lucide-react'
import Layout from '@theme/Layout'
import { Toaster } from '../../components/ui/toaster'
import ErrorBoundary from '../../components/ErrorBoundary'

function Index() {
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
    const filteredHeaders = headers.filter(header => header && header.trim() !== '');
    setHeaders(filteredHeaders);
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
      <ErrorBoundary>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className='min-h-screen w-full overflow-hidden bg-gradient-to-b from-background to-secondary/20'
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
                formNumber={formNumber}           // <-- Add this line
                setFormNumber={setFormNumber}     // <-- Add this line
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
                formNumber={formNumber}           // <-- Add this line
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
