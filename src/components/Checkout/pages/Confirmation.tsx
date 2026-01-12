'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import PaymentSummary from '@/components/Checkout/PaymentSummary'
import ItemsSummary from '@/components/Checkout/ItemsSummary'
import DeliveryAddressSummary from '@/components/Checkout/DeliveryAddressSummary'
import useCheckoutStore, {
  isPrescriptionStepRequired
} from '@/store/useCheckoutStore'
import PrescriptionUpload from '@/components/Checkout/PrescriptionUpload'
import DeliveryMode from '../DeliveryMode'
import usePatientsStore from '@/store/userPatientsStore'
import { SquarePen } from 'lucide-react'
import { Link } from 'next-view-transitions'
import { checkOneDayDelivery } from '@/utils/actions/cartActions'
import OrderSuccessCard from '../OrderSuccess'

export default function ConfirmationPage() {
  const {
    isProceedWithItemsWithoutPrescription,
    selectedAddress,
    products,
    isOrderConfirmed,
    setDeliveryMode,
    checkoutCopy,
    prescriptionFiles,
    patientId
  } = useCheckoutStore()

  const { patients } = usePatientsStore(state => state)

  const effectivePatientId = isOrderConfirmed
    ? checkoutCopy?.patientId
    : patientId
  const effectivePrescriptionFiles = isOrderConfirmed
    ? checkoutCopy?.prescriptionFiles
    : prescriptionFiles

  const PrescriptionRequired = isOrderConfirmed
    ? checkoutCopy?.products?.some((p: any) => p.prescriptionReq)
    : isPrescriptionStepRequired()

  const selectedPatient: any = patients.find(
    (p: any) => p._id === effectivePatientId
  )
  const [isCheckingDelivery, setIsCheckingDelivery] = useState(false)

  // Check if one-day delivery is available when component mounts
  useEffect(() => {
    const checkDeliveryAvailability = async () => {
      if (!selectedAddress || !products?.length || isCheckingDelivery) return

      setIsCheckingDelivery(true)
      try {
        const result = await checkOneDayDelivery({
          addressId: selectedAddress._id
        })

        if (!result.error && result.isOneDayDeliverable) {
          // If one-day delivery is available, automatically switch to it
          setDeliveryMode('oneDay')
        } else {
          // If not available, keep standard mode
          setDeliveryMode('standard')
        }
      } catch (error) {
        console.error('Error checking delivery availability:', error)
        // On error, keep standard mode
        setDeliveryMode('standard')
      }
    }

    checkDeliveryAvailability()
  }, [selectedAddress, products, setDeliveryMode, !isCheckingDelivery])

  return (
    <div className='flex w-full justify-center p-4 pb-6 md:px-6'>
      <div className='w-full lg:w-3/4'>
        <h1 className='pb-4 text-xl font-semibold'>Order Confirmation</h1>

        <div>
          <div className='grid grid-cols-1 gap-4 md:grid-cols-[3fr_2fr]'>
            <div className='space-y-4'>
              {isOrderConfirmed && <OrderSuccessCard />}
              <DeliveryAddressSummary />
              <ItemsSummary />
              {isPrescriptionStepRequired() &&
              !isProceedWithItemsWithoutPrescription ? (
                <PrescriptionUpload forBuyNow={true} />
              ) : null}
              {PrescriptionRequired &&
                effectivePatientId &&
                patients.length && (
                  <div className='mx-auto mt-4 w-full overflow-hidden rounded-xl border bg-white shadow-sm'>
                    {/* Header */}
                    <div className='flex items-center justify-between bg-gray-50 px-4 py-2'>
                      <span className='text-sm font-semibold text-gray-900'>
                        Patient & Prescription
                      </span>
                      {!isOrderConfirmed && (
                        <Link href={'/checkout/prescription'}>
                          <button className='rounded p-1 hover:bg-gray-100'>
                            <SquarePen size={18} />
                          </button>
                        </Link>
                      )}
                    </div>

                    {/* Content */}
                    <div className='px-4 py-3'>
                      <p className='text-sm text-gray-800'>
                        <span className='font-semibold'>Patient : </span>
                        {selectedPatient?.name}
                      </p>

                      {effectivePrescriptionFiles?.length > 0 && (
                        <div className='mt-3 flex flex-wrap gap-2'>
                          {effectivePrescriptionFiles.map(
                            (file: string, idx: number) => (
                              <div
                                key={idx}
                                className='relative h-38 w-38 overflow-hidden rounded-md border'
                              >
                                <Image
                                  src={file}
                                  alt={`Prescription ${idx + 1}`}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>

            <div className='space-y-4'>
              <DeliveryMode />
              <div className='sticky top-2'>
                <PaymentSummary nextPath='/checkout/payment' />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
