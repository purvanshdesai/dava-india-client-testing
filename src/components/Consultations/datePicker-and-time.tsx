'use client'

import { useEffect, useState } from 'react'
import { isAfter, isBefore, startOfDay } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle
} from '@/components/ui/dialog'
import { Calendar } from '@/components/ui/calendar'
import useCheckoutStore from '@/store/useCheckoutStore'
import { Loader2 } from 'lucide-react'

const timeSlots = [
  '09:00 AM - 09:30 AM',
  '09:30 AM - 10:00 AM',
  '10:00 AM - 10:30 AM',
  '10:30 AM - 11:00 AM',
  '11:00 AM - 11:30 AM',
  '11:30 AM - 12:00 PM',
  '12:00 PM - 12:30 PM',
  '12:30 PM - 01:00 PM',
  '01:00 PM - 01:30 PM',
  '01:30 PM - 02:00 PM',
  '02:00 PM - 02:30 PM',
  '02:30 PM - 03:00 PM',
  '03:00 PM - 03:30 PM',
  '04:00 PM - 04:30 PM',
  '04:30 PM - 05:00 PM',
  '05:00 PM - 05:30 PM',
  '05:30 PM - 06:00 PM',
  '06:00 PM - 06:30 PM',
  '06:30 PM - 07:00 PM',
  '07:00 PM - 07:30 PM',
  '07:30 PM - 08:00 PM'
]

type Props = {
  selectedDate?: Date
  setSelectedDate: (date: Date | undefined) => void
  selectedTime: string
  setSelectedTime: (time: string) => void
  isConsulatationOrder?: boolean
  width?: string
  availableSlots?: any
  loading?: boolean
}

export default function DateTimeSelector({
  selectedDate,
  setSelectedDate,
  selectedTime,
  setSelectedTime,
  isConsulatationOrder,
  width,
  availableSlots,
  loading
}: Props) {
  const today = startOfDay(new Date())
  // Only allow today's date
  const allowedDate = today
  const [open, setOpen] = useState(false)
  const { setDateOfConsult, setTimeOfConsult, dateOfConsult, timeOfConsult } =
    useCheckoutStore(state => state)

  // Auto-select date on mount if not already selected
  useEffect(() => {
    if (!selectedDate && !isConsulatationOrder) {
      setSelectedDate(allowedDate)
    }
  }, [])

  // Helper to convert "13:30" to "01:30 PM"
  function convertTo12Hour(time24?: string): string {
    if (!time24 || typeof time24 !== 'string' || !time24.includes(':')) {
      console.error('Invalid time format:', time24)
      return ''
    }

    const [hourStr, minuteStr] = time24.split(':')
    const hour = parseInt(hourStr, 10)
    const minute = parseInt(minuteStr, 10)

    if (isNaN(hour) || isNaN(minute)) {
      console.error('Invalid hour or minute:', time24)
      return ''
    }

    const period = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 === 0 ? 12 : hour % 12
    return `${hour12.toString().padStart(2, '0')}:${minuteStr} ${period}`
  }

  const handleSave = () => {
    if (selectedDate && selectedTime) {
      setOpen(false)
    }
  }

  // Convert start/end time pairs to labels matching timeSlots format
  const availableSlotSet = new Set(
    availableSlots?.map((slot: any) => {
      const start = convertTo12Hour(slot.startTime)
      const end = convertTo12Hour(slot.endTime)
      return `${start} - ${end}`
    }) ?? []
  )

  // Check if all slots are closed for a given date
  // const checkAllSlotsClosed = (date: Date, slots: any[]) => {
  //   const slotSet = new Set(
  //     slots?.map((slot: any) => {
  //       const start = convertTo12Hour(slot.startTime)
  //       const end = convertTo12Hour(slot.endTime)
  //       return `${start} - ${end}`
  //     }) ?? []
  //   )

  //   const today = startOfDay(new Date())
  //   const isToday = startOfDay(date).getTime() === today.getTime()

  //   for (const slot of timeSlots) {
  //     const isAvailable = slotSet.has(slot)
  //     const slotStartTime = slot?.split(' - ')[0]
  //     let isPast = false

  //     if (isToday) {
  //       const now = new Date()
  //       const [hourStr, minuteStr, meridiem] = slotStartTime?.split(/[:\s]/)
  //       let hour = parseInt(hourStr, 10)
  //       const minute = parseInt(minuteStr, 10)

  //       if (meridiem === 'PM' && hour !== 12) hour += 12
  //       if (meridiem === 'AM' && hour === 12) hour = 0

  //       const slotTime = new Date(date)
  //       slotTime.setHours(hour, minute, 0, 0)
  //       isPast = now > slotTime
  //     }

  //     if (isAvailable && !isPast) {
  //       return false
  //     }
  //   }
  //   return true
  // }

  useEffect(() => {
    if (isConsulatationOrder) {
      setSelectedDate(dateOfConsult as any)
      setSelectedTime(timeOfConsult as any)
    }
  }, [isConsulatationOrder, dateOfConsult, timeOfConsult])

  return (
    <Dialog
      open={open}
      onOpenChange={isOpen => {
        setOpen(isOpen)
        if (isOpen && !selectedDate) {
          setSelectedDate(allowedDate)
          if (isConsulatationOrder && allowedDate)
            setDateOfConsult(allowedDate as any)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button
          variant='outline'
          className={` ${width ? width : 'w-fit'} rounded-md border border-[#FA582D] bg-white px-4 py-2 text-sm text-[#FA582D]`}
        >
          {selectedDate && selectedTime
            ? `${selectedDate.toLocaleDateString()} - ${selectedTime}`
            : 'Choose date & time'}
        </Button>
      </DialogTrigger>

      <DialogContent
        className={`w-[500px] max-w-md overflow-hidden rounded-lg p-0`}
      >
        <div className='flex items-center justify-between p-2 text-sm font-medium text-gray-800'>
          <DialogTitle className='text-sm font-medium'>
            Select date and time for consultation
          </DialogTitle>
        </div>

        <div className='px-3 pt-2'>
          <label className='mb-1 block text-[11px] font-medium text-gray-500'>
            Select Date
          </label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant='outline'
                className='w-full justify-start text-left text-sm font-normal'
              >
                {selectedDate ? selectedDate.toDateString() : 'Pick a date'}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={selectedDate}
                onSelect={(date: any) => {
                  setSelectedDate(date)
                  if (isConsulatationOrder && date) setDateOfConsult(date)
                }}
                className='rounded-md border'
                disabled={(date: Date) => {
                  const dateStart = startOfDay(date)
                  const allowedDateStart = startOfDay(allowedDate)
                  const selectedDateStart = selectedDate
                    ? startOfDay(selectedDate)
                    : null

                  const isPast = isBefore(dateStart, allowedDateStart)
                  const isFuture = isAfter(dateStart, allowedDateStart)
                  const isToday = !isPast && !isFuture
                  const isSelectable =
                    isToday ||
                    (selectedDateStart &&
                      dateStart.getTime() === selectedDateStart.getTime())

                  return !isSelectable
                }}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className='px-3 pt-3 text-[10px] text-gray-500'>
          Select time (you will get a call within 30 mins of the selected time)
        </div>

        {loading ? (
          <div className='flex h-40 items-center justify-center'>
            <Loader2 className='animate-spin text-[#FA582D]' size={24} />
            <span className='ml-2 text-sm text-gray-500'>Loading...</span>
          </div>
        ) : (
          <div className='grid grid-cols-3 gap-2 px-3 py-3'>
            {timeSlots
              .filter((slot: any) => {
                const isAvailable = availableSlotSet.has(slot)
                const slotStartTime = slot?.split(' - ')[0]
                let isPast = false

                if (selectedDate) {
                  const today = startOfDay(new Date())
                  const isToday =
                    startOfDay(selectedDate).getTime() === today.getTime()

                  if (isToday) {
                    const now = new Date()
                    const [hourStr, minuteStr, meridiem] =
                      slotStartTime?.split(/[:\s]/)
                    let hour = parseInt(hourStr, 10)
                    const minute = parseInt(minuteStr, 10)

                    if (meridiem === 'PM' && hour !== 12) hour += 12
                    if (meridiem === 'AM' && hour === 12) hour = 0

                    const slotTime = new Date(selectedDate)
                    slotTime.setHours(hour, minute, 0, 0)
                    isPast = now > slotTime
                  }
                }

                // Only show available and non-past slots
                return isAvailable && !isPast
              })
              .map((slot: any) => {
                return (
                  <Button
                    key={slot}
                    variant={selectedTime === slot ? 'default' : 'outline'}
                    onClick={() => {
                      setSelectedTime(slot)
                      if (isConsulatationOrder) setTimeOfConsult(slot)
                    }}
                    className={`h-7 px-2 py-1 text-[10px] ${
                      selectedTime === slot
                        ? 'bg-[#FA582D] text-white'
                        : 'border text-gray-700'
                    }`}
                  >
                    {slot}
                  </Button>
                )
              })}
          </div>
        )}

        <div className='px-3 pb-3'>
          <Button
            className='h-9 w-full bg-[#f26321] text-sm font-medium text-white hover:bg-[#e45717]'
            onClick={handleSave}
            disabled={!selectedDate || !selectedTime}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
