'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button'
import { useTransitionRouter } from 'next-view-transitions'
import { useConsultationOrder } from '@/utils/hooks/orderHooks'
import useCheckoutStore from '@/store/useCheckoutStore'
import { trackPrescriptionEnquiry } from '@/analytics/trackers/appEventTracker'
import { useSession } from 'next-auth/react'
import { Dialog, DialogContent, DialogHeader } from '../ui/dialog'
import { DialogTitle } from '@radix-ui/react-dialog'
import Image from 'next/image'

export default function RequestCallback({
  disabled,
  selectedDate,
  selectedTime
}: any) {
  const { data: session } = useSession()
  const router = useTransitionRouter()
  const orderConsultationOrder = useConsultationOrder()
  const { selectedAddress, prescriptionFiles, patientId } = useCheckoutStore()
  const [showDialog, setShowDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRequestCallback = async () => {
    try {
      setLoading(true)
      await orderConsultationOrder.mutateAsync({
        issue: 'prescription-upload',
        prescription_url: prescriptionFiles,
        address: selectedAddress,
        items: [],
        patientId: patientId,
        dateOfConsult: selectedDate,
        timeOfConsult: selectedTime
      })

      trackPrescriptionEnquiry({
        userId: session?.user?.id ?? '',
        address: selectedAddress?.fullAddress ?? '',
        pincode: selectedAddress?.postalCode ?? '',
        prescriptionUploaded: prescriptionFiles?.join(', ')
      })
      setShowDialog(true)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div>
      <Button
        disabled={disabled || loading}
        loader={loading}
        className='w-full px-10'
        onClick={() => handleRequestCallback()}
      >
        Request Callback
      </Button>
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
           Our expert team will reach out to you soon
          </p>
          <p className='mt-1 text-sm text-[#666]'>
            {selectedDate?.toDateString()} , {selectedTime}
          </p>

          <p className='mt-3 text-sm font-semibold'>You will get a call on</p>
          <p className='text-sm'>{selectedAddress?.phoneNumber}</p>
          <div className='flex justify-center'>
          <Button
            className='mt-4 w-40 bg-[#FA582D] hover:bg-[#e64c22]'
            onClick={() => router.push('/prescription/callback-order-summary')}
          >
            OK
          </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
