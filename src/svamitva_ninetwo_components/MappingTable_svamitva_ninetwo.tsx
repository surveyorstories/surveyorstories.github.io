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

  const requiredFields: FieldMapping[] = [
    { en: 'Property Parcel Number', te: 'ప్రాపర్టీ పార్సెల్ నెంబరు' },
    { en: 'Assessment Number', te: 'అసెస్మెంట్ నెంబర్' },
    { en: 'Site Area', te: 'స్థల విస్తీర్ణం (sq.mts)' },
    { en: 'Building Area', te: 'భవన విస్తీర్ణం (sq.mts)' },
    { en: 'Owner Name', te: 'భూమి/ ఆస్తి యజమాని పేరు' },
    { en: 'Relation Name', te: 'తండ్రి పేరు' }
  ]

  const optionalFields: FieldMapping[] = [
    { en: 'Habitation Name', te: 'గ్రామం పేరు' },
    { en: 'Remarks', te: 'రిమార్కులు' }
  ]

  let mappingFields = [...requiredFields, ...optionalFields]

  useEffect(() => {
    // Check if all required fields (excluding optional ones) have been mapped
    const requiredFieldsMapped = requiredFields.every((field) => mappings[field.en])
    setIsComplete(requiredFieldsMapped)
  }, [mappings])

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
                    {mappingFields.map((field, index) => {
                      const isRequired = requiredFields.some((f) => f.en === field.en)
                      const borderColorClass = isRequired ? 'border-red-500' : 'border-green-500'
                      return (
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
                              value={mappings[field.en] || undefined}
                              onValueChange={(value) => handleMappingChange(field.en, value)}
                            >
                              <SelectTrigger
                                className={`w-full border-2 ${borderColorClass}`}
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
                      )
                    })}
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
