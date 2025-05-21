import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '../components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '../components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../components/ui/table'
import { Card, CardContent } from '../components/ui/card'
import { CheckCircle2 } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '../components/ui/radio-group'
import { Label } from '../components/ui/label'

interface FieldMapping {
  en: string
  te: string
}

// Update the component props to remove setNoticeMode
interface MappingTableProps {
  headers: string[]
  show: boolean
  onMappingSubmit: (mapping: Record<string, string>) => void
  onPreview: (mapping: Record<string, string>) => void
  noticeType?: string
  noticeMode?: string
}

// Update the component to remove the radio buttons
const MappingTable: React.FC<MappingTableProps> = ({
  headers,
  show,
  onMappingSubmit,
  onPreview,
  noticeType = 'GT Notice',
  noticeMode = 'khata'
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>({})
  const [isComplete, setIsComplete] = useState(false)
  // Add state for extent column
  const [showExtent, setShowExtent] = useState(false)

  const allRequiredFields: FieldMapping[] = [
    { en: 'LPM Number', te: 'ల్యాండ్ పార్సెల్ నెంబర్' },
    { en: 'Survey No', te: 'సర్వే నెం' },
    { en: 'Khata No', te: 'ఖాతా సంఖ్య' },
    { en: 'Pattadar Name', te: 'భూ యజమాని పేరు' },
    { en: 'Relation Name', te: 'భర్త/తండ్రి పేరు' }
  ]

  // Filter out LPM Number field if notice type is GT Notice
  const requiredFields: FieldMapping[] = allRequiredFields.filter(
    (field) => noticeType === 'GV Notice' || field.en !== 'LPM Number'
  )

  // Add Extent field if checkbox is checked and noticeType is GV Notice
  const extentField: FieldMapping = { en: 'Extent', te: 'విస్తీర్ణం' }
  let mappingFields = [...requiredFields]
  if (noticeType === 'GV Notice' && showExtent) {
    // Insert Extent after Relation Name (before Mobile Number)
    const relIdx = mappingFields.findIndex((f) => f.en === 'Relation Name')
    mappingFields.splice(relIdx + 1, 0, extentField)
  }

  const optionalFields: FieldMapping[] = [{ en: 'Mobile Number', te: 'మొబైల్ నెంబరు' }]
  mappingFields = [...mappingFields, ...optionalFields]

  useEffect(() => {
    // Check if all required fields (excluding optional ones) have been mapped
    const requiredFieldsMapped = requiredFields.every((field) => mappings[field.en])
    setIsComplete(requiredFieldsMapped)
  }, [mappings, requiredFields])

  const handleMappingChange = (field: string, value: string) => {
    setMappings((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = () => {
    onMappingSubmit(mappings)
  }

  const handlePreview = () => {
    onPreview(mappings)
  }

  if (!show) return null

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5 }}
          className='no-print mt-8 print:!bg-transparent'
        >
          <Card className='glass-panel print:!bg-transparent print:!shadow-none'>
            <CardContent className='pt-6'>
              <h2 className='mb-6 text-2xl font-medium'>Map CSV Columns</h2>

              {/* Change checkbox to radio group for Extent column (only for GV Notice) */}
              {noticeType === 'GV Notice' && (
                <div className='mb-4 flex items-center gap-4'>
                  <span className='text-sm'>Add Extent column (విస్తీర్ణం):</span>
                  <RadioGroup
                    value={showExtent ? 'yes' : 'no'}
                    onValueChange={(val) => setShowExtent(val === 'yes')}
                    className='flex flex-row gap-4'
                  >
                    <div className='flex items-center gap-1'>
                      <RadioGroupItem value='yes' id='extent-yes' />
                      <Label htmlFor='extent-yes' className='text-sm'>
                        Yes
                      </Label>
                    </div>
                    <div className='flex items-center gap-1'>
                      <RadioGroupItem value='no' id='extent-no' />
                      <Label htmlFor='extent-no' className='text-sm'>
                        No
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='text-left font-bold'>Field Name</TableHead>
                      <TableHead className='text-left font-bold'>Telugu Field Name</TableHead>
                      <TableHead className='text-left font-bold'>CSV Column</TableHead>
                      <TableHead className='w-20 text-center font-bold'>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mappingFields.map((field, index) => (
                      <motion.tr
                        key={field.en}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <TableCell className='font-medium'>{field.en}</TableCell>
                        <TableCell
                          className='telugu-text'
                          style={{ fontFamily: 'noto sans telugu' }}
                        >
                          {field.te}
                        </TableCell>
                        <TableCell
                          className='telugu-text'
                          style={{ fontFamily: 'noto sans telugu' }}
                        >
                          <Select
                            value={mappings[field.en] || ''}
                            onValueChange={(value) => handleMappingChange(field.en, value)}
                          >
                            <SelectTrigger
                              className='w-full'
                              style={{ fontFamily: 'noto sans telugu' }}
                            >
                              <SelectValue placeholder='Select column' />
                            </SelectTrigger>
                            <SelectContent style={{ zIndex: 200 }}>
                              {headers.map((header) => (
                                <SelectItem key={header} value={header}>
                                  {header}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell className='text-center'>
                          {mappings[field.en] ? (
                            <CheckCircle2 className='mx-auto h-5 w-5 text-green-500' />
                          ) : (
                            <div className='mx-auto h-5 w-5 rounded-full border border-gray-300' />
                          )}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className='mt-6 flex justify-end space-x-4'>
                <Button
                  onClick={handleSubmit}
                  disabled={!isComplete}
                  className={`transition-all duration-300${isComplete ? 'cursor-pointer hover:cursor-pointer' : 'cursor-not-allowed'}`}
                >
                  Generate Notices
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MappingTable
