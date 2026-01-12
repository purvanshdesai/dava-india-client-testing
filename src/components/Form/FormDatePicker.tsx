'use client'

import React from 'react'
import { format } from 'date-fns'
import { Calendar as CalendarIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'

import { UseFormReturn } from 'react-hook-form'

const FormDatePicker = ({
  formInstance: form,
  label,
  name,
  isSmall,
  isReq,
  className,
  placeholder
}: {
  formInstance: UseFormReturn
  isSmall?: boolean
  isReq?: boolean
  label?: string
  name: string
  placeholder?: string
  className?: string
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel
              className={cn(
                isSmall ? 'text-sm' : 'text-lg',
                'block text-black dark:text-gray-300'
              )}
            >
              {label}
              {isReq && <span className='text-red-600'>*</span>}
            </FormLabel>

            {/* Date Picker */}
            <FormControl>
              <Popover>
                <PopoverTrigger className='dark:border-gray-900' asChild>
                  <Button
                    variant={'datepicker'}
                    className={cn(
                      'w-full justify-start text-left font-normal dark:bg-black dark:text-gray-300',
                      !field.value && 'text-muted-foreground',
                      className
                    )}
                  >
                    {field.value
                      ? format(field.value, 'PPP')
                      : placeholder || 'Pick a date'}
                    <CalendarIcon className='ml-auto h-4 w-4' />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0'>
                  <Calendar
                    mode='single'
                    selected={field.value}
                    onSelect={date => field.onChange(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default FormDatePicker
