'use client'

import { useRouter } from 'next/navigation'

import DeliveryAddressSummary from '@/components/Checkout/DeliveryAddressSummary'
import PrescriptionOrderSuccessCard from '@/components/Checkout/PrescriptionOrderSuccess'
import PrescriptionFiles from '@/components/Checkout/PrescriptionFiles'
// import PaymentSummaryEmpty from '@/components/Checkout/PaymentSummaryEmpty'

import { Button } from '@/components/ui/button'

export default function ClientCallbackOrderSummary() {
  const router = useRouter()

  return (
    <div className='flex w-full justify-center p-4 pb-6 md:px-6'>
      <div className='w-full lg:w-3/4'>
        <div className='grid grid-cols-1 gap-4'>
          <div className='space-y-4'>
            <PrescriptionOrderSuccessCard />
            <PrescriptionFiles />
            <DeliveryAddressSummary hideEdit={true} />
          </div>

          {/* Back to Home Button */}
          <div className='flex justify-center'>
            <Button
              className='mt-6 w-44 bg-[#FA582D] hover:bg-[#e64c22]'
              onClick={() => router.push('/')}
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
