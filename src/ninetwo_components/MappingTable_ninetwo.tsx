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

interface FieldMapping {
  en: string
  te: string
}

interface MappingTableProps {
  headers: string[]
  show: boolean
  onMappingSubmit: (mapping: Record<string, string>) => void
  onPreview: (mapping: Record<string, string>) => void
  noticeType?: string
}

const MappingTable: React.FC<MappingTableProps> = ({
  headers,
  show,
  onMappingSubmit,
  onPreview
}) => {
  const [mappings, setMappings] = useState<Record<string, string>>(() => {
    const initialMappings: Record<string, string> = {}
    return initialMappings
  })

  const [isComplete, setIsComplete] = useState(false)

  const requiredFields: FieldMapping[] = [
    { en: 'LPM Number', te: 'ల్యాండ్ పార్సెల్ నెంబర్' },
    { en: 'Survey No', te: 'సర్వే నెం' },
    { en: 'Khata No', te: 'ఖాతా సంఖ్య' },
    { en: 'Pattadar Name', te: 'భూ యజమాని పేరు' },
    { en: 'Relation Name', te: 'భర్త/తండ్రి పేరు' },
    { en: 'Resurvey extent (Acres)', te: 'రీ సర్వే విస్తీర్ణం (ఎకరం)' },
    { en: 'Resurvey extent (Hect)', te: 'రీ సర్వే విస్తీర్ణం (హెక్టార్లు)' }
  ]

  const optionalFields: FieldMapping[] = [
    { en: 'Sub Division No', te: 'సబ్ డివిజన్ నెం' },
    { en: 'Old extent (Acres)', te: 'పూర్వపు విస్తీర్ణం (ఎకరం)' },
    { en: 'Old extent (Hect)', te: 'పూర్వపు విస్తీర్ణం (హెక్టార్లు)' },
    { en: 'Remark', te: 'రిమార్క్స్' }
  ]

  useEffect(() => {
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
                <div className='mb-4 rounded-lg border-2 border-blue-500 p-2'>
                  <h3 className='mb-2 font-bold'>Required Fields</h3>
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
                      {requiredFields.map((field) => (
                        <motion.tr
                          key={field.en}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <TableCell className='font-medium'>{field.en}</TableCell>
                          <TableCell className='anek telugu-text'>{field.te}</TableCell>
                          <TableCell>
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

                <div className='rounded-lg border-2 border-green-500 p-2'>
                  <h3 className='mb-2 font-bold'>Optional Fields</h3>
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
                      {optionalFields.map((field) => (
                        <motion.tr key={field.en}>
                          <TableCell className='font-medium'>{field.en}</TableCell>
                          <TableCell className='anek telugu-text'>{field.te}</TableCell>
                          <TableCell>
                            <Select
                              value={mappings[field.en] || ''}
                              onValueChange={(value) => handleMappingChange(field.en, value)}
                            >
                              <SelectTrigger className='w-full'>
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
                    className='transition-all duration-300'
                  >
                    Generate Notices
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default MappingTable
