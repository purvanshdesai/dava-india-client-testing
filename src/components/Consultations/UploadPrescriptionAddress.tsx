'use client'

import UserAddress from '@/components/Checkout/UserAddress'
import RequestCallback from '@/components/Prescription/RequestCallback'
import { useTranslations } from 'next-intl'
import PatientSelection from '@/components/Checkout/PatientSelection'
import { useState, useEffect } from 'react'
import { addDays, startOfDay } from 'date-fns'
import DateTimeSelector from './datePicker-and-time'
import { useFetchSlotsWithDate } from '@/utils/hooks/slotsHooks'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import usePatientsStore from '@/store/userPatientsStore'
import useCheckoutStore from '@/store/useCheckoutStore'
import { Dialog, DialogClose, DialogContent } from '@/components/ui/dialog'

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

// Helper to convert "13:30" to "01:30 PM"
function convertTo12Hour(time24: string): string {
  const [hourStr, minuteStr] = time24?.split(':')
  const hour = parseInt(hourStr, 10)
  const period = hour >= 12 ? 'PM' : 'AM'
  const hour12 = hour % 12 === 0 ? 12 : hour % 12
  return `${hour12.toString().padStart(2, '0')}:${minuteStr} ${period}`
}

export default function UploadPrescriptionAddress() {
  const router = useRouter()
  const cart = useTranslations('Cart')

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [availableSlots, setAvailableSlots] = useState<any[]>([])
  const [showConsultationNotAvailable, setShowConsultationNotAvailable] =
    useState(false)

  const { patients } = usePatientsStore(state => state)
  const { patientId, currentLocation } = useCheckoutStore(state => state)

  const { mutateAsync: slotsMutation } = useFetchSlotsWithDate()

  // Only allow today's date
  const today = startOfDay(new Date())
  const allowedDate = today

  // Auto-select date on mount
  useEffect(() => {
    if (!selectedDate) {
      const autoSelectDate = async () => {
        setSelectedDate(allowedDate)
        await handleDateChange(allowedDate, true)
      }
      autoSelectDate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 🔥 Disable button if missing required info OR location not deliverable
  const isButtonDisabled =
    !selectedDate ||
    !selectedTime ||
    !patientId ||
    !patients?.length ||
    (currentLocation && !currentLocation.isDeliverable)

  // 🔥 Whenever address changes, check if deliverable
  useEffect(() => {
    if (currentLocation && !currentLocation.isDeliverable) {
      setShowConsultationNotAvailable(true)
    }
  }, [currentLocation])

  const handleDateChange = async (date: any, isAutoSelect = false) => {
    try {
      if (!isAutoSelect) {
        setSelectedDate(date)
      }
      if (date) {
        setSlotsLoading(true)
        const res = await slotsMutation(date)
        const slots = Array.isArray(res) ? res : []
        setAvailableSlots(slots)

        // Check if all slots are closed
        const availableSlotSet = new Set(
          slots?.map((slot: any) => {
            const start = convertTo12Hour(slot?.startTime)
            const end = convertTo12Hour(slot?.endTime)
            return `${start} - ${end}`
          }) ?? []
        )

        const today = startOfDay(new Date())
        const isToday = startOfDay(date).getTime() === today.getTime()
        let allSlotsClosed = true

        for (const slot of timeSlots) {
          const isAvailable = availableSlotSet.has(slot)
          const slotStartTime = slot.split(' - ')[0]
          let isPast = false

          if (isToday) {
            const now = new Date()
            const [hourStr, minuteStr, meridiem] = slotStartTime?.split(/[:\s]/)
            let hour = parseInt(hourStr, 10)
            const minute = parseInt(minuteStr, 10)

            if (meridiem === 'PM' && hour !== 12) hour += 12
            if (meridiem === 'AM' && hour === 12) hour = 0

            const slotTime = new Date(date)
            slotTime.setHours(hour, minute, 0, 0)
            isPast = now > slotTime
          }

          if (isAvailable && !isPast) {
            allSlotsClosed = false
            break
          }
        }

        // If all slots are closed, automatically try next date
        if (allSlotsClosed && !isAutoSelect) {
          const nextDate = addDays(date, 1)
          setSelectedDate(nextDate)
          await handleDateChange(nextDate, true)
        }
      } else {
        setAvailableSlots([])
      }
    } catch (error) {
      console.error('Error fetching slots:', error)
      setAvailableSlots([])
    } finally {
      setSlotsLoading(false)
    }
  }

  return (
    <>
      <div className='flex w-full justify-center p-4 pb-6 md:px-20'>
        <div className='w-full'>
          {/* Heading with back arrow */}
          <div className='flex items-center gap-3 pb-4'>
            <Button
              variant='ghost'
              size='icon'
              onClick={() => router.push('/prescription/upload')}
              className='h-8 w-8'
            >
              <ArrowLeft size={20} />
            </Button>
            <h1 className='text-xl font-semibold'>
              {cart('select_delivery_address')} & Slot
            </h1>
          </div>

          <div className='grid gap-4 md:grid-cols-[3fr_2fr]'>
            <div>
              <UserAddress />
            </div>
            <div className='-mt-10'>
              <PatientSelection />
              <div className='space-y-2 bg-white p-6'>
                <p className='text-xs'>
                  <span className='text-red-500'>*</span>Select date and time
                  for callback
                </p>
                <div className='w-full'>
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    setSelectedDate={handleDateChange}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    width={'w-full'}
                    availableSlots={availableSlots}
                    loading={slotsLoading}
                  />
                </div>

                {/* Request Callback button disabled when conditions not met */}
                <RequestCallback
                  disabled={isButtonDisabled}
                  selectedTime={selectedTime}
                  selectedDate={selectedDate}
                />

                {/* Show warning if no patient selected */}
                {!patients.length ||
                  (!patientId && (
                    <p className='mt-2 text-sm text-red-500'>
                      Please add patient details to request callback.
                    </p>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for not deliverable locations */}
      <Dialog
        open={showConsultationNotAvailable}
        onOpenChange={setShowConsultationNotAvailable}
      >
        <DialogContent className='sm:max-w-[700px]'>
          <div className='flex flex-col items-center justify-center gap-3'>
            <img
              src='/images/DoctorConsultation.svg'
              width={222}
              height={170}
              alt=''
            />
            <div className='pb-3 text-center font-bold'>
              We're coming to your location soon. Stay tuned for updates
            </div>
            <DialogClose asChild>
              <Button
                className='flex h-12 w-48 items-center'
                onClick={() => {
                  setShowConsultationNotAvailable(false) // close dialog
                  router.push('/') // redirect to home
                }}
              >
                OK
              </Button>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
