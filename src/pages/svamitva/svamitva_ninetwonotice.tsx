import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Header from '../../svamitva_ninetwo_components/Header_svamitva_ninetwo'
import FormSection from '../../svamitva_ninetwo_components/FormSection_svamitva_ninetwo'
import { formNumbers } from '../../svamitva_ninetwo_components/FormSection_svamitva_ninetwo'
import MappingTable from '../../svamitva_ninetwo_components/MappingTable_svamitva_ninetwo'

import PreviewSection from '../../svamitva_ninetwo_components/PreviewSection_svamitva_ninetwo'
import { toast } from '../../svamitva_ninetwo_components/ui/use-toast'
import { Button } from '../../svamitva_ninetwo_components/ui/button'
import { Printer } from 'lucide-react'
import Layout from '@theme/Layout'
import { Toaster } from '../../svamitva_ninetwo_components/ui/toaster'

function Index() {
  // Form state
  const [districtName, setDistrictName] = useState('')
  const [mandalName, setMandalName] = useState('')
  const [panchayatName, setPanchayatName] = useState('')
  const [startDate, setStartDate] = useState('')
  const [startTime, setStartTime] = useState('')
  const [notificationNumber, setNotificationNumber] = useState('')
  const [notificationDate, setNotificationDate] = useState('')
  const [printedDate, setPrintedDate] = useState('')
  const [noticeType, setNoticeType] = useState('GT Notice')
  const [officerName, setOfficerName] = useState('')
  const [officerDesignation, setOfficerDesignation] = useState('')
  // Add noticeMode state
  const [noticeMode, setNoticeMode] = useState('property-parcel-number')
  // Add formNumber state here
  const [formNumber, setFormNumber] = useState('')

  // Reset formNumber when noticeType changes
  useEffect(() => {
    setFormNumber('')
  }, [noticeType])

  // CSV data state
  const [headers, setHeaders] = useState<string[]>([])
  const [data, setData] = useState<string[][]>([])
  const [showMapping, setShowMapping] = useState(false)

  // Mapping and preview state
  const [mapping, setMapping] = useState<Record<string, string>>({})
  const [showPreview, setShowPreview] = useState(false)
  const [showArrow, setShowArrow] = useState(false)

  // Show arrow for 30 seconds when preview is shown
  useEffect(() => {
    if (showPreview) {
      setShowArrow(true)
      const timer = setTimeout(() => {
        setShowArrow(false)
      }, 30000) // 30 seconds
      return () => clearTimeout(timer)
    } else {
      setShowArrow(false)
    }
  }, [showPreview])

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
              panchayatName={panchayatName}
              setPanchayatName={setPanchayatName}
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
              noticeType={noticeType}
              setNoticeType={setNoticeType}
              officerName={officerName}
              setOfficerName={setOfficerName}
              officerDesignation={officerDesignation}
              setOfficerDesignation={setOfficerDesignation}
              noticeMode={noticeMode}
              setNoticeMode={setNoticeMode}
              formNumber={formNumber}
              setFormNumber={setFormNumber}
            />

            <MappingTable
              headers={headers}
              show={showMapping}
              onMappingSubmit={(mapping) => {
                setMapping(mapping)
                setShowPreview(true)

                toast({
                  title: 'Column Mapping Complete',
                  description: 'Preview generated. You can now print the notices.'
                })
              }}
              onPreview={() => setShowPreview(true)}
              noticeType={noticeType}
              noticeMode={noticeMode}
            />

            <PreviewSection
              districtName={districtName}
              mandalName={mandalName}
              panchayatName={panchayatName}
              startDate={startDate}
              startTime={startTime}
              notificationNumber={notificationNumber}
              notificationDate={notificationDate}
              printedDate={printedDate}
              show={showPreview}
              headers={headers}
              data={data}
              mapping={mapping}
              noticeType={noticeType}
              officerName={officerName}
              officerDesignation={officerDesignation}
              noticeMode={noticeMode}
              formNumber={formNumber}
            />
          </div>
        </div>

        {showPreview && (
          <div className='fixed bottom-4 right-8 z-50 flex items-center print:hidden'>
            {showArrow && (
              <motion.div
                animate={{ x: [-10, 0, -10] }}
                transition={{ duration: 1, repeat: Infinity }}
                className='-mt-4 mr-2'
              >
                <img src='/img/arrow.svg' alt='Arrow' className='h-16 w-16' />
              </motion.div>
            )}
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Button
                onClick={handlePrint}
                className='flex h-14 w-14 items-center justify-center gap-2 rounded-full bg-primary text-white shadow-lg hover:bg-primary/90'
                size='icon'
              >
                <Printer className='h-6 w-6' />
              </Button>
            </motion.div>
          </div>
        )}
      </motion.div>
      <Toaster />
    </Layout>
  )
}

export default Index
