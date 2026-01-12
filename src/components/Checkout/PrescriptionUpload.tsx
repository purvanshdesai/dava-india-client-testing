'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import useCheckoutStore from '@/store/useCheckoutStore'
import { LucideDot, UploadIcon, InfoIcon } from 'lucide-react'
import { Button } from '../ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { useSession } from 'next-auth/react'
import dynamic from 'next/dynamic'
import DateTimeSelector from '../Consultations/datePicker-and-time'
import { useFetchSlotsWithDate } from '@/utils/hooks/slotsHooks'
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

// Dynamically loaded components
const PrescriptionFileUploadComponent = dynamic(
  () => import('@/components/Prescription/FileUpload'),
  { ssr: false }
)

const guildLines = [
  'Do not crop any part of prescription',
  'Avoid blurred images',
  'Include details of doctor and patient, date of visit',
  'Supported files : PNG,JPEG,PDF',
  'File size limit : 5MB'
]

//const doctorGuideLines = [
//  'Our working hours will be 8:00 AM to 6:00 PM',
//  'Your prescription will be sent directly to the pharmacist for processing.'
//]

export default function PrescriptionUpload({
  forBuyNow = false
}: {
  forBuyNow?: boolean
}) {
  const session = useSession()
  const {
    resetBuyNow,
    products,
    setPrescriptionUrl,
    setConsultDoctorForPrescription,
    consultDoctorForPrescription,

    prescriptionFiles
  } = useCheckoutStore(state => state)

  // 🛠️ Fix: Add missing states
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState<string>('')
  const [slotsLoading, setSlotsLoading] = useState(false)

  const [availableSlots, setAvailableSlots] = useState<any[]>([])
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

  const handleDateChange = async (date: any, isAutoSelect = false) => {
    try {
      if (!isAutoSelect) {
        setSelectedDate(date)
      }
      if (date) {
        const todayStart = startOfDay(new Date())
        const isCurrentDay = startOfDay(date).getTime() === todayStart.getTime()
        const now = new Date()
        if (isCurrentDay && now.getHours() >= 20) {
          const nextDate = addDays(date, 1)
          setSelectedDate(nextDate)
          await handleDateChange(nextDate, true)
          return
        }
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

  useEffect(() => {
    if (!forBuyNow) resetBuyNow()
  }, [])

  const prescribedProducts = products.filter(p => p.prescriptionReq)
  const isLoggedIn = session.status === 'authenticated'

  const ProductInfo = (product: any) => {
    return (
      <div className='relative grid grid-cols-[100px_1fr] p-3'>
        <div className='flex items-center justify-center'>
          <div
            style={{
              position: 'relative',
              width: '60px',
              height: '60px'
            }}
            className='overflow-hidden rounded-md'
          >
            <Image
              src={product?.thumbnail}
              alt={product?.title}
              fill
              priority={false}
              style={{ objectFit: 'contain' }}
            />
          </div>
        </div>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <h1 className='line-clamp-2 text-base font-semibold'>
              {product?.title}
            </h1>
            <p className='line-clamp-2 text-xs text-label'>
              {product?.description}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Card className='dark:bg-gray-900'>
        {/* // Prescription required products */}
        <CardHeader className='rounded-t-lg bg-gray-50 px-3 py-4 dark:bg-gray-700'>
          <CardTitle className='text-sm font-semibold'>
            {prescribedProducts.length} item in your cart needs a valid
            prescription
          </CardTitle>
        </CardHeader>
        {prescribedProducts.map((product: any, idx: number) => {
          return (
            <div className='w-full' key={idx}>
              {ProductInfo(product)}

              <Separator />
            </div>
          )
        })}
      </Card>

      <Card className='dark:bg-gray-900'>
        {/* // Prescription required products */}
        <CardHeader className='flex items-start justify-between rounded-t-lg bg-gray-50 px-3 py-4 dark:bg-gray-700'>
          <div className='flex items-center gap-2'>
            <CardTitle className='text-sm font-semibold'>
              Upload Prescription
            </CardTitle>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <InfoIcon className='text-muted-foreground h-4 w-4 cursor-pointer transition-colors hover:text-primary' />
                </TooltipTrigger>
                <TooltipContent
                  className='border-border w-85 rounded-xl border bg-white/90 p-4 shadow-xl backdrop-blur-md animate-in fade-in zoom-in-95 dark:bg-gray-800/90'
                  align='center'
                  side='top'
                >
                  <div className='space-y-2'>
                    {guildLines.map((g, idx) => (
                      <div key={idx} className='flex items-start gap-2'>
                        <LucideDot className='mt-0.5 text-primary' size={16} />
                        <p className='text-muted-foreground text-sm leading-relaxed'>
                          {g}
                        </p>
                      </div>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </CardHeader>

        <CardContent className='space-y-4 p-3'>
          {!consultDoctorForPrescription && (
            <div>
              <div>
                <PrescriptionFileUploadComponent
                  onFileUpload={(files: any) => {
                    console.log('uploaded files ==== ', files)
                    setPrescriptionUrl(files)
                  }}
                  renderButton={openFilePicker => (
                    <Button
                      onClick={openFilePicker}
                      // disabled={isDisabled}
                      className='mt-3 w-1/2 gap-3 font-semibold'
                    >
                      <UploadIcon />
                      Upload Prescription
                    </Button>
                  )}
                  isLoggedIn={isLoggedIn}
                />
              </div>

              {/* <div className='space-y-3 pt-6'>
                <p className='pl-2 text-sm font-medium'>Guide Lines</p>

                <div className='space-y-1'>
                  {guildLines.map((g, idx) => (
                    <div className='flex items-center' key={idx}>
                      <LucideDot className='text-primary' />
                      <p className='text-xs text-label'>{g}</p>
                    </div>
                  ))}
                </div>
              </div> */}
            </div>
          )}

          {!prescriptionFiles.length && (
            <div>
              <h1 className='bg-[#F9F9F9] p-6 font-semibold'>
                Don't Have a prescription? Get a free Consultation
              </h1>

              <div className='my-6 w-48 rounded-lg border px-2 py-3'>
                <div className='flex items-center gap-2'>
                  {/*<Button onClick={handleConfirmConsultation}>*/}
                  {/*  Consult a Doctor*/}
                  {/*</Button>*/}
                  <Checkbox
                    id='doctor-consultation'
                    checked={consultDoctorForPrescription}
                    onCheckedChange={checked =>
                      setConsultDoctorForPrescription(checked === true)
                    }
                  />
                  <label
                    htmlFor='doctor-consultation'
                    className='text-sm font-semibold text-label'
                  >
                    Doctor Consultation
                  </label>
                </div>
              </div>

              {/* Show DateTimeSelector if checkbox is checked */}
              {consultDoctorForPrescription && (
                <div className='my-4'>
                  <DateTimeSelector
                    selectedDate={selectedDate}
                    setSelectedDate={handleDateChange}
                    selectedTime={selectedTime}
                    setSelectedTime={setSelectedTime}
                    isConsulatationOrder={true}
                    availableSlots={availableSlots}
                    loading={slotsLoading}
                  />
                </div>
              )}
              <div className='mt-3 text-xs text-label'>
                📞: You’ll receive a call from +91-7965189000
              </div>
              <div className='py-2 text-xs text-label'>
                <span className='font-semibold text-red-600'>Disclaimer:</span>{' '}
                Consultation is available only for ages 12 and above.
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
