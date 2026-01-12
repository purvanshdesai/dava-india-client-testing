'use client'
import React, { useEffect, useState } from 'react'
import PaymentSummary from '@/components/Checkout/PaymentSummary'
import UserAddress from '@/components/Checkout/UserAddress'
// import DeliveryEstimates from '@/components/Checkout/DeliveryEstimates'
import { useTranslations } from 'next-intl'
import useCheckoutStore, {
  isPrescriptionStepRequired
} from '@/store/useCheckoutStore'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AddressNotDeliverableIcon } from '@/components/utils/icons'
// import DeliveryMode from '../DeliveryMode'
import usePatientsStore from '@/store/userPatientsStore'
import { Link, SquarePen } from 'lucide-react'

const Address = () => {
  const cart = useTranslations('Cart')
  const { currentLocation } = useCheckoutStore(state => state)
  const PrescriptionRequired = isPrescriptionStepRequired()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { patients } = usePatientsStore(state => state)
  const { patientId } = useCheckoutStore(state => state)
  const selectedPatient: any = patients.find((p: any) => p._id === patientId)

  useEffect(() => {
    if (!currentLocation?.isDeliverable) {
      setIsDialogOpen(true)
    }
  }, [currentLocation])
  return (
    <div className='flex w-full justify-center p-4 pb-6 md:px-6'>
      <div className='w-full lg:w-3/4'>
        <h1 className='pb-4 text-xl font-semibold'>
          {cart('select_delivery_address')}
        </h1>

        <div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]'>
            <div className='space-y-4'>
              {/* <DeliveryMode /> */}
              <UserAddress />
              {PrescriptionRequired && patientId && patients.length && (
                <div className='mx-auto mt-4 w-full overflow-hidden rounded-xl border bg-white shadow-sm'>
                  {/* Header */}
                  <div className='flex items-center justify-between bg-gray-50 px-4 py-2'>
                    <span className='text-sm font-semibold text-gray-900'>
                      Patient
                    </span>
                    <Link href={'/checkout/prescription'}>
                      <button className='rounded p-1 hover:bg-gray-100'>
                        <SquarePen size={18} />
                      </button>
                    </Link>
                  </div>

                  {/* Content */}
                  <div className='px-4 py-3'>
                    <p className='text-sm text-gray-800'>
                      {selectedPatient?.name}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='space-y-4'>
              {/*<DeliveryEstimates />*/}
              <div className='sticky top-2'>
                <PaymentSummary nextPath='/checkout/confirmation' />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className='sm:max-w-[700px]'>
          <DialogTitle className='text-white'>Edit profile</DialogTitle>
          <div className='flex flex-col items-center gap-4'>
            {AddressNotDeliverableIcon}
            <span className='text-sm font-semibold'>
              Sorry, we are not delivering to this pincode yet, but we will be
              available soon
            </span>
          </div>
          <DialogFooter>
            <Button
              onClick={() => {
                setIsDialogOpen(false)
              }}
              className='mx-auto w-24'
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default Address
