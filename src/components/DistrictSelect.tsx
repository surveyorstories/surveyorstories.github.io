import React from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from './ui/select'
import { districts } from '../data/districts'

interface DistrictSelectProps {
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  className?: string
}

// ponytail: Simplified central dropdown component for selecting Andhra Pradesh districts to ensure single source of truth.
export function DistrictSelect({
  value,
  onValueChange,
  placeholder = 'Select district',
  className = 'form-input'
}: DistrictSelectProps) {
  return (
    <Select
      value={value || undefined}
      onValueChange={onValueChange}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {districts.map((district) => (
          <SelectItem key={district.value} value={district.value}>
            {district.display} - {district.te}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
