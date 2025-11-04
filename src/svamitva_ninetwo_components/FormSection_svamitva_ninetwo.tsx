import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Upload } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import { districts } from '../data/districts'
import { sanitizeString, sanitizeCSVData } from '../lib/sanitize'
import { toast } from '../components/ui/use-toast'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import Papa from 'papaparse'
import ExcelJS from 'exceljs'

// Officer designation options with both English and Telugu values
export const officerDesignations = [
  { value: 'Village Surveyor', display: 'Village Surveyor', te: 'గ్రామ సర్వేయర్' },
  { value: 'Mandal Surveyor', display: 'Mandal Surveyor', te: 'మండల సర్వేయర్' },
  {
    value: 'Village Revenue Officer',
    display: 'Village Revenue Officer',
    te: 'గ్రామ రెవిన్యూ అధికారి'
  },
  {
    value: 'Deputy Tahsildhar',
    display: 'Deputy Tahsildhar (Resurvey)',
    te: 'ఉప తహశీల్దార్ (రీ సర్వే)'
  },
  { value: 'Tahsildhar', display: 'Tahsildhar', te: 'తహశీల్దార్' }
]

// Update the FormSectionProps interface to include noticeMode
// Update formNumbers to include custom option
export const formNumbers = {
  'GT Notice': [
    { value: '17', display: 'Form 17', te: 'ఫారం - 17' },
    // { value: '15', display: 'Form 15', te: 'ఫారం - 15' },
    // { value: '19', display: 'Form 19', te: 'ఫారం - 19' },
    { value: 'custom', display: 'Custom Form Number', te: 'కస్టమ్ ఫారం నంబర్' }
  ]
}

// Update the FormSectionProps interface to include noticeMode
interface FormSectionProps {
  onFileUpload: (headers: string[], data: string[][]) => void
  districtName: string
  setDistrictName: (value: string) => void
  mandalName: string
  setMandalName: (value: string) => void
  panchayatName: string
  setPanchayatName: (value: string) => void
  startDate: string
  setStartDate: (value: string) => void
  startTime: string
  setStartTime: (value: string) => void
  notificationNumber: string
  setNotificationNumber: (value: string) => void
  notificationDate: string
  setNotificationDate: (value: string) => void
  printedDate: string
  setPrintedDate: (value: string) => void
  officerName: string
  setOfficerName: (value: string) => void
  officerDesignation: string
  setOfficerDesignation: (value: string) => void
  noticeMode?: string
  setNoticeMode?: (mode: string) => void
  formNumber: string
  setFormNumber: (value: string) => void
}

const FormSection: React.FC<FormSectionProps> = ({
  onFileUpload,
  districtName,
  setDistrictName,
  mandalName,
  setMandalName,
  panchayatName,
  setPanchayatName,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  notificationNumber,
  setNotificationNumber,
  notificationDate,
  setNotificationDate,
  officerName,
  setOfficerName,
  officerDesignation,
  setOfficerDesignation,
  printedDate,
  setPrintedDate,
  noticeMode = 'property-parcel-number',
  setNoticeMode = () => {},
  formNumber, // <-- Add this line
  setFormNumber // <-- Add this line
}) => {
  const [isDragging, setIsDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [isCustomForm, setIsCustomForm] = useState(false)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    processFile(file)
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files?.[0]
    if (!file || (!file.name.endsWith('.csv') && !file.name.endsWith('.xlsx'))) return

    setFileName(file.name)
    processFile(file)
  }

  const processFile = (file: File) => {
    if (file.name.endsWith('.csv')) {
      processCSVFile(file)
    } else if (file.name.endsWith('.xlsx')) {
      processExcelFile(file)
    }
  }

  const processCSVFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      const parsed = Papa.parse<string[]>(content, { skipEmptyLines: true })

      if (parsed.data.length > 1) {
        const headers = parsed.data[0].map((header) => sanitizeString(header))
        const rawData = parsed.data.slice(1)
        const data = sanitizeCSVData(rawData)
        onFileUpload(headers, data)
      }
    }
    reader.readAsText(file)
  }

  const processExcelFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = async (e) => {
      const content = e.target?.result
      const workbook = new ExcelJS.Workbook()
      await workbook.xlsx.load(content as ArrayBuffer)
      const worksheet = workbook.worksheets[0]
      const jsonData: any[][] = []
      worksheet.eachRow({ includeEmpty: false }, (row) => {
        const rowValues = row.values as any[]
        // remove first empty element if it exists
        if (rowValues.length > 0 && rowValues[0] === null) {
          rowValues.shift()
        }
        jsonData.push(rowValues)
      })

      if (jsonData.length > 1) {
        const headers = jsonData[0].map((header) => sanitizeString(header))
        const rawData = jsonData.slice(1)
        const data = sanitizeCSVData(rawData)
        onFileUpload(headers, data)
      }
    }
    reader.readAsArrayBuffer(file)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className='no-print'
    >
      <Card className='glass-panel overflow-hidden'>
        <CardContent className='pt-6'>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className='space-y-6'
          >
            <div>
              <h2 className='text-2xl font-medium'>Notice Mode</h2>
              <div className='mb-6'>
                <RadioGroup
                  value={noticeMode}
                  onValueChange={setNoticeMode}
                  className='flex flex-col space-y-2'
                >
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='assessment-number' id='assessment-number' />
                    <Label htmlFor='assessment-number'>Assessment Number wise</Label>
                  </div>
                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='property-parcel-number' id='property-parcel-number' />
                    <Label htmlFor='property-parcel-number'>Property Parcel Number wise</Label>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <RadioGroupItem value='pattadar-name' id='pattadar-name' />
                    <Label htmlFor='pattadar-name'>Owner Name wise</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <h2 className='text-2xl font-medium'>Village Details</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              {/* <div className='space-y-2'>
                <Label htmlFor='districtName'>District Name</Label>
                <Select
                  value={districtName || undefined}
                  onValueChange={(value) => setDistrictName(value)}
                >
                  <SelectTrigger className='form-input'>
                    <SelectValue placeholder='Select district' />
                  </SelectTrigger>
                  <SelectContent>
                    {districts.map((district) => (
                      <SelectItem key={district.value} value={district.value}>
                        {district.display} - {district.te}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div> */}
              <div className='space-y-2'>
                <Label htmlFor='mandalName'>Mandal Name Telugu</Label>
                <Input
                  id='mandalName'
                  placeholder='Enter mandal name'
                  className='form-input'
                  value={mandalName}
                  onChange={(e) => setMandalName(sanitizeString(e.target.value))}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='panchayatName'>Panchayat Name Telugu</Label>
                <Input
                  id='panchayatName'
                  placeholder='Enter panchayat name'
                  className='form-input'
                  value={panchayatName}
                  onChange={(e) => setPanchayatName(sanitizeString(e.target.value))}
                />
              </div>
              {/* <div className='space-y-2'>
                <Label htmlFor='startDate'> Start Date</Label>
                <Input
                  id='startDate'
                  type='date'
                  className='form-input'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time</Label>
                <Input
                  id='startTime'
                  type='time'
                  className='form-input'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='notificationNumber'>6(1) Notification Number</Label>
                <Input
                  id='notificationNumber'
                  placeholder='Enter 6(1) Notification Number'
                  className='form-input'
                  value={notificationNumber}
                  onChange={(e) => setNotificationNumber(sanitizeString(e.target.value))}
                />
              </div>
              <div className='space-y-2'>
                <Label htmlFor='notificationDate'>6(1) Notification Date</Label>
                <Input
                  id='notificationDate'
                  type='date'
                  className='form-input'
                  value={notificationDate}
                  onChange={(e) => setNotificationDate(e.target.value)}
                />
              </div> */}

              <>
                <div className='space-y-2'>
                  <Label htmlFor='officerName'>Panchayat Secretary Name Telugu </Label>
                  <Input
                    id='officerName'
                    placeholder='Enter Panchayat Secretary name'
                    className='form-input'
                    value={officerName}
                    onChange={(e) => setOfficerName(sanitizeString(e.target.value))}
                  />
                </div>
              </>
              <div className='space-y-2'>
                <Label htmlFor='printedDate'>Notice Printed Date</Label>
                <Input
                  id='printedDate'
                  type='date'
                  className='form-input'
                  value={printedDate}
                  onChange={(e) => setPrintedDate(e.target.value)}
                />
              </div>

              {/* Replace the existing Form Number Dropdown section with this updated version */}
              <div className='space-y-2'>
                <Label htmlFor='formNumber'>Choice of Form Number</Label>
                <Select
                  value={isCustomForm ? 'custom' : formNumber || undefined}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setIsCustomForm(true)
                      setFormNumber('')
                    } else {
                      setIsCustomForm(false)
                      setFormNumber(value)
                    }
                  }}
                >
                  <SelectTrigger className='form-input'>
                    <SelectValue placeholder='Select form number'>
                      {isCustomForm
                        ? formNumber || 'Custom Form Number'
                        : formNumbers['GT Notice']?.find((f) => f.value === formNumber)?.display ||
                          ''}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(formNumbers['GT Notice'] || []).map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.display} - {form.te}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {isCustomForm && (
                  <div className='mt-2'>
                    <Input
                      key='custom-form-input'
                      type='number'
                      min='1'
                      placeholder='Enter custom form number'
                      value={formNumber}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '')
                        setFormNumber(value)
                      }}
                      className='form-input'
                    />
                  </div>
                )}
              </div>
              {/* --- End Form Number Dropdown --- */}
            </div>

            <div className='pt-4'>
              <h2 className='mb-4 text-2xl font-medium'>Upload CSV or Excel File</h2>
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center transition-all ${
                  isDragging
                    ? 'border-primary bg-primary/5'
                    : 'border-gray-300 hover:border-primary/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type='file'
                  id='fileUpload'
                  accept='.csv, .xlsx'
                  onChange={handleFileChange}
                  className='hidden'
                />

                <label
                  htmlFor='fileUpload'
                  className='flex cursor-pointer flex-col items-center justify-center gap-2'
                >
                  <motion.div
                    className='rounded-full bg-primary/10 px-4 py-0.5'
                    animate={{
                      scale: fileName ? 1 : [1, 1.1, 1]
                    }}
                    transition={{
                      duration: 1.5,
                      ease: 'easeInOut',
                      repeat: fileName ? 0 : Infinity
                    }}
                  >
                    <Upload className='h-6 w-6 text-primary' />
                  </motion.div>

                  <span className='text-sm text-gray-500'>
                    {fileName ? fileName : 'Drag & drop or click to upload CSV or Excel file'}
                  </span>
                  <span className='text-xs text-gray-400'>
                    {fileName ? 'Click to change file' : 'Supports CSV and Excel formats'}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default FormSection
