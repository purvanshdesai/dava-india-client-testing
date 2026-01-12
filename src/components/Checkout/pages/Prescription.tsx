'use client'

import PaymentSummary from '@/components/Checkout/PaymentSummary'
import useCheckoutStore from '@/store/useCheckoutStore'
import PrescriptionUpload from '../PrescriptionUpload'
import PatientSelection from '../PatientSelection'
import { useTransitionRouter } from 'next-view-transitions'

export default function PrescriptionUploadComponent() {
  const {} = useCheckoutStore(state => state)
  const router = useTransitionRouter()
  const { setProceedWithItemsWithoutPrescription, refreshCalculations } =
    useCheckoutStore()

  const proceedWithItemsWithoutPrescription = () => {
    setProceedWithItemsWithoutPrescription(true)
    refreshCalculations()
    router.push('/checkout/address')
  }

  return (
    <div className='flex w-full justify-center p-4 pb-6 md:px-6'>
      <div className='w-full lg:w-3/4'>
        <h1 className='flex items-center gap-2 pb-6 text-xl font-semibold'>
          Attach a Prescription
        </h1>

        <div className='grid grid-cols-[3fr_2fr] gap-4'>
          <div>
            <PrescriptionUpload />
          </div>
          <div className='-mt-10 space-y-4'>
            <PatientSelection isConsultation={false} />
            <div className='sticky top-2'>
              <PaymentSummary nextPath={'/checkout/address'} />

              <div
                onClick={() => proceedWithItemsWithoutPrescription()}
                className='mt-4 cursor-pointer text-center'
              >
                <p className='text-sm font-semibold text-primary underline underline-offset-4 transition hover:text-primary/80'>
                  Proceed with other items in the cart
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
