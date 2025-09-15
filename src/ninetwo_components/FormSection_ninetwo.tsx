import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Upload } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
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
import Papa from 'papaparse' // Add this import for CSV parsing
import ExcelJS from 'exceljs'

interface FormSectionProps {
  onFileUpload: (headers: string[], data: string[][]) => void
  districtName: string
  setDistrictName: (value: string) => void
  mandalName: string
  setMandalName: (value: string) => void
  villageName: string
  setVillageName: (value: string) => void
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
  noticeType?: string
  setNoticeType?: (value: string) => void
  formNumber: string
  setFormNumber: (value: string) => void


}

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

export const formNumbers = [{ value: '31', display: 'Form 31', te: 'ఫారం - 31' },
{ value: '34', display: 'Form 34', te: 'ఫారం - 34' },
{ value: 'custom', display: 'Custom Form Number', te: 'కస్టమ్ ఫారం నంబర్' }
  // { value: '30', display: 'Form 30', te: 'ఫారం - 30' }
]


const FormSection: React.FC<FormSectionProps> = ({
  onFileUpload,
  districtName,
  setDistrictName,
  mandalName,
  setMandalName,
  villageName,
  setVillageName,
  startDate,
  setStartDate,
  startTime,
  setStartTime,
  notificationNumber,
  setNotificationNumber,
  notificationDate,
  setNotificationDate,
  printedDate,
  setPrintedDate,
  officerName,
  setOfficerName,
  formNumber,           // <-- Add this line
  setFormNumber,
  officerDesignation,
  setOfficerDesignation,
  noticeType = 'khata',


  setNoticeType = () => { }
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
    if (!file || !file.name.endsWith('.csv') && !file.name.endsWith('.xlsx')) return

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

      // Use PapaParse to parse the CSV content
      const parsed = Papa.parse<string[]>(content, {
        skipEmptyLines: true
      })

      if (parsed.data.length > 1) {
        // Sanitize headers and data to prevent XSS attacks
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
      try {
        const buffer = e.target?.result
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer as ArrayBuffer)
        const worksheet = workbook.worksheets[0]
        const jsonData: string[][] = []
        worksheet.eachRow((row) => {
          const rowData = row.values as string[]
          jsonData.push(rowData.slice(1)) // slice(1) to remove the first empty element
        })

        if (jsonData.length > 1) {
          const headers = jsonData[0].map((header) => sanitizeString(header))
          const rawData = jsonData.slice(1)
          const data = sanitizeCSVData(rawData)
          onFileUpload(headers, data)
        }
      } catch (error) {
        console.error("Error processing Excel file:", error);
        toast({
          title: "Error",
          description: "Could not process the Excel file. Please ensure it is a valid .xlsx file.",
          variant: "destructive",
        });
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
            {/* Notice Type Selection */}
            <div className='space-y-3'>
              <h2 className='text-2xl font-medium'>Notice Generation Type</h2>
              <RadioGroup
                value={noticeType}
                onValueChange={setNoticeType}
                className='flex flex-wrap gap-x-6 gap-y-2'
              >
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='khata' id='khata' />
                  <Label htmlFor='khata'>Khata Wise</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='landparcel' id='landparcel' />
                  <Label htmlFor='landparcel'>Land Parcel Wise</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='khata_merged_synos' id='khata_merged_synos' />
                  <Label htmlFor='khata_merged_synos'>Khata Wise (Merged Survey Nos)</Label>
                </div>
                <div className='flex items-center space-x-2'>
                  <RadioGroupItem value='lpm_merged_synos' id='lpm_merged_synos' />
                  <Label htmlFor='lpm_merged_synos'>LPM Wise (Merged Survey Nos)</Label>
                </div>
              </RadioGroup>
            </div>

            <h2 className='text-2xl font-medium'>Village Details</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='districtName'>District Name</Label>
                <Select value={districtName || undefined} onValueChange={(value) => setDistrictName(value)}>
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
              </div>

              <div className='space-y-2'>
                <Label htmlFor='mandalName'>Mandal Name</Label>
                <Input
                  id='mandalName'
                  value={mandalName}
                  onChange={(e) => setMandalName(e.target.value)}
                  className='form-input'
                  placeholder='Enter mandal name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='villageName'>Village Name</Label>
                <Input
                  id='villageName'
                  value={villageName}
                  onChange={(e) => setVillageName(e.target.value)}
                  className='form-input'
                  placeholder='Enter village name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='officerDesignation'>Officer Designation</Label>
                <Select
                  value={officerDesignation || undefined}
                  onValueChange={(value) => setOfficerDesignation(value)}
                >
                  <SelectTrigger className='form-input'>
                    <SelectValue placeholder='Select designation' />
                  </SelectTrigger>
                  <SelectContent>
                    {officerDesignations.map((designation) => (
                      <SelectItem key={designation.value} value={designation.value}>
                        {designation.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className='space-y-2'>
                <Label htmlFor='printedDate'>Printed Date</Label>
                <Input
                  id='printedDate'
                  type='date'
                  value={printedDate}
                  onChange={(e) => setPrintedDate(e.target.value)}
                  className='form-input'
                />
              </div>

              {/* --- Add Form Number Dropdown here --- */}
              <div className='space-y-2'>
                <Label htmlFor='formNumber'>Choice of Form Number</Label>
                <Select
                  value={isCustomForm ? 'custom' : formNumber || undefined}
                  onValueChange={(value) => {
                    if (value === 'custom') {
                      setIsCustomForm(true)
                      setFormNumber('') // Clear previous value for custom input
                    } else {
                      setIsCustomForm(false)
                      setFormNumber(value)
                    }
                  }}
                >
                  <SelectTrigger className='form-input'>
                    <SelectValue placeholder='Select form number' />
                  </SelectTrigger>
                  <SelectContent>
                    {formNumbers.map((form) => (
                      <SelectItem key={form.value} value={form.value}>
                        {form.display} - {form.te}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isCustomForm && (
                  <div className='mt-2'>
                    <Input
                      key="custom-form-input"
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

            {/* <h2 className='text-2xl font-medium'>Notice Details</h2>
            <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
              <div className='space-y-2'>
                <Label htmlFor='startDate'>Start Date</Label>
                <Input
                  id='startDate'
                  type='date'
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className='form-input'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='startTime'>Start Time</Label>
                <Input
                  id='startTime'
                  type='time'
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className='form-.tsx'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notificationNumber'>Notification Number</Label>
                <Input
                  id='notificationNumber'
                  value={notificationNumber}
                  onChange={(e) => setNotificationNumber(e.target.value)}
                  className='form-input'
                  placeholder='Enter notification number'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='notificationDate'>Notification Date</Label>
                <Input
                  id='notificationDate'
                  type='date'
                  value={notificationDate}
                  onChange={(e) => setNotificationDate(e.target.value)}
                  className='form-input'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='printedDate'>Printed Date</Label>
                <Input
                  id='printedDate'
                  type='date'
                  value={printedDate}
                  onChange={(e) => setPrintedDate(e.target.value)}
                  className='form-input'
                />
              </div>
            </div>

            <h2 className='text-2xl font-medium'>Officer Details</h2>
            <div className='grid gap-6 sm:grid-cols-2'>
              <div className='space-y-2'>
                <Label htmlFor='officerName'>Officer Name</Label>
                <Input
                  id='officerName'
                  value={officerName}
                  onChange={(e) => setOfficerName(e.target.value)}
                  className='form-input'
                  placeholder='Enter officer name'
                />
              </div>

              <div className='space-y-2'>
                <Label htmlFor='officerDesignation'>Officer Designation</Label>
                <Select
                  value={officerDesignation || undefined}
                  onValueChange={(value) => setOfficerDesignation(value)}
                >
                  <SelectTrigger className='form-input'>
                    <SelectValue placeholder='Select designation' />
                  </SelectTrigger>
                  <SelectContent>
                    {officerDesignations.map((designation) => (
                      <SelectItem key={designation.value} value={designation.value}>
                        {designation.display}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div> */}

            <div className='pt-4'>
              <h2 className='mb-4 text-2xl font-medium'>Upload CSV or Excel File</h2>
              <div
                className={`rounded-lg border-2 border-dashed p-6 text-center transition-all ${isDragging
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
                  {/* <Button
                    variant='outline'
                    onClick={() => document.getElementById('csvFile')?.click()}
                    className='mt-2'
                  >
                    Browse Files
                  </Button> */}
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