'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { Form } from '../ui/form'
import FormTextAreaField from '../Form/FormTextArea'
import { useForm, UseFormReturn } from 'react-hook-form'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useConsultationOrder } from '@/utils/hooks/orderHooks'
import { z } from 'zod'
import { consultDoctor } from '@/lib/zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { DoctorConsultationPhone } from '../utils/icons'
import PatientSelection from '../Checkout/PatientSelection'
import usePatientsStore from '@/store/userPatientsStore'
import { trackDoctorConsultation } from '@/analytics/trackers/appEventTracker'
import { useSession } from 'next-auth/react'
import DateTimeSelector from './datePicker-and-time'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useFetchSlotsWithDate } from '@/utils/hooks/slotsHooks'
import { useToast } from '@/hooks/use-toast'
import { addDays, startOfDay } from 'date-fns'

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

const CreateConsultation = () => {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session }: any = useSession()
  const [loading, setLoading] = useState(false)
  const [slotsLoading, setSlotsLoading] = useState(false)
  const [showDialog, setShowDialog] = useState(false)

  const { currentLocation, patientId, selectedAddress } = useCheckoutStore(
    state => state
  )
  const { patients } = usePatientsStore(state => state)
  const { mutateAsync } = useConsultationOrder()
  const { mutateAsync: slotsMutation } = useFetchSlotsWithDate()

  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [dateTimeError, setDateTimeError] = useState<string>('')
  const [availableSlots, setAvailableSlots] = useState<any[]>([])

  const [isEditingPhone, setIsEditingPhone] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState(
    selectedAddress?.phoneNumber || ''
  )
  const [editedPhoneNumber, setEditedPhoneNumber] = useState(phoneNumber)

  const form = useForm<z.infer<typeof consultDoctor>>({
    resolver: zodResolver(consultDoctor),
    defaultValues: { comment: '' }
  })

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

  const handleDateChange = async (date: any, isAutoSelect = false) => {
    try {
      if (!isAutoSelect) {
        setSelectedDate(date)
      }
      if (date) {
        setSlotsLoading(true)
        const res = await slotsMutation(date) // 🔥 Fetch slots for the selected date
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

  const handleConfirmConsultation = async (data: { comment: string }) => {
    if (!selectedDate || !selectedTime) {
      setDateTimeError('Please choose date and time for consultation')
      return
    }
    if (!patientId) {
      setDateTimeError('Please add or select a patient')
      return
    }

    if (isEditingPhone) {
      setDateTimeError('Please save the phone number before submitting')
      return
    }

    setLoading(true)
    setDateTimeError('')

    try {
      await mutateAsync({
        issue: 'doctor-consultation',
        dateOfConsult: selectedDate,
        timeOfConsult: selectedTime,
        phoneNumber: phoneNumber,
        ...data,
        patientId: patientId
      })

      trackDoctorConsultation({
        userId: session?.user.id ?? '',
        address: '',
        pincode: '',
        reasonForConsultation: data?.comment
      })

      setShowDialog(true)
    } catch (error: any) {
      console.log('Consultation error:', error)
      toast({
        title: 'Oops!',
        description: `Slot not available or fully booked!`
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!session) router.push('/login')
  }, [])

  return (
    <div className='mx-auto my-10 max-w-3xl rounded-lg bg-white p-6 shadow-md'>
      <h2 className='mb-6 border-b pb-2 text-xl font-semibold'>
        Doctor Consultation
      </h2>

      <div className='mb-6 flex justify-center'>
        <Image
          width={250}
          height={250}
          alt='e-prescription'
          src={'/images/certified-doc.svg'}
        />
      </div>

      <div className='mb-6'>
        <PatientSelection isConsultation={true} />
        {!patients.length && (
          <p className='mt-2 text-sm text-red-500'>
            Please add patient details to get e-Prescription
          </p>
        )}
      </div>

      {currentLocation?.isDeliverable && (
        <Form {...form}>
          <form
            onSubmit={e => {
              e.preventDefault()
              form.handleSubmit(data => handleConfirmConsultation(data))(e)
            }}
          >
            <div className='space-y-6'>
              <FormTextAreaField
                isSmall={true}
                isReq={true}
                formInstance={form as unknown as UseFormReturn}
                label='Write down your chief complaints'
                name='comment'
                placeholder='Enter notes'
              />

              {/* Phone Section */}
              <div className='flex items-start gap-1 bg-white p-3 text-sm'>
                <div className='pt-1'>{DoctorConsultationPhone}</div>
                <div className='w-full text-[#444]'>
                  <p className='mb-1 font-medium'>You will get a call on :</p>
                  {!isEditingPhone ? (
                    <div className='flex items-center gap-2'>
                      <span className='font-semibold'>{phoneNumber}</span>
                      <button
                        type='button'
                        onClick={() => setIsEditingPhone(true)}
                        className='font-medium text-[#FA582D] underline hover:opacity-80'
                      >
                        Edit
                      </button>
                    </div>
                  ) : (
                    <div className='flex items-center gap-2'>
                      <input
                        type='text'
                        value={editedPhoneNumber}
                        onChange={e => setEditedPhoneNumber(e.target.value)}
                        className='w-full rounded-md border border-gray-300 px-2 py-1 text-sm'
                      />
                      <button
                        type='button'
                        onClick={() => {
                          setPhoneNumber(editedPhoneNumber)
                          setIsEditingPhone(false)
                        }}
                        className='font-medium text-[#FA582D] underline hover:opacity-80'
                      >
                        Save
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Date and Time */}
              <div className='space-y-3 rounded-md bg-white p-2'>
                <p className='text-sm font-semibold text-[#444]'>
                  Select date and time for consultation
                </p>
                <DateTimeSelector
                  selectedDate={selectedDate}
                  setSelectedDate={handleDateChange}
                  selectedTime={selectedTime}
                  setSelectedTime={setSelectedTime}
                  availableSlots={availableSlots}
                  loading={slotsLoading}
                />
                {dateTimeError && (
                  <p className='text-sm text-red-500'>{dateTimeError}</p>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className='mt-10 flex justify-between gap-4'>
              <Button
                disabled={!patients.length || !patientId || loading}
                className='w-full'
                type='submit'
                loader={loading}
              >
                Get e-Prescription
              </Button>
              <Button
                className='w-full'
                variant='outline'
                onClick={() => router.push('/')}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      )}

      {/* Confirmation Dialog */}
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className='max-w-lg rounded-xl p-8 text-center'>
          <DialogHeader>
            <DialogTitle className='text-muted-foreground mb-2 text-base font-medium'>
              Confirmation
            </DialogTitle>
          </DialogHeader>

          <Image
            src='/images/verified-doc.png'
            width={88}
            height={88}
            alt='verified'
            className='mx-auto my-4'
          />

          <p className='mt-2 text-sm font-semibold text-[#222]'>
           Our expert team will reach out to you soon.
          </p>
          <p className='mt-1 text-sm text-[#666]'>
            {selectedDate?.toDateString()} , {selectedTime}
          </p>

          <p className='mt-3 text-sm font-semibold'>You will get a call on</p>
          <p className='text-sm'>{phoneNumber}</p>

          <p className='mt-2 text-xs text-[#666]'>
            After the consultation, we will attach the e-prescription to your
            order
          </p>

          <Button
            className='mt-4 w-full bg-[#FA582D] hover:bg-[#e64c22]'
            onClick={() => router.push('/')}
          >
            OK
          </Button>

          <p className='w-full border-t px-4 py-2 text-center text-[10px] text-red-500'>
            Disclaimer: Consultation is available only for ages 12 and above
          </p>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateConsultation
