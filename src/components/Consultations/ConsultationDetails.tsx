'use client'
import { useGetConsultation } from '@/utils/hooks/consultationHooks'
import React from 'react'
import ConsultationStatus from './ConsultationStatus'
import ConsultationItems from './ConsultationItems'
import { Button } from '../ui/button'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useRouter, useSearchParams, useParams } from 'next/navigation'

export default function ConsultationDetails() {
  const searchParams = useSearchParams()
  const params = useParams() as any

  const { data: consultation, isLoading } = useGetConsultation(
    params.consultationId
  )
  const { createConsultationOrder } = useCheckoutStore()
  const router = useRouter()

  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : null
  const limit = searchParams.get('limit')
    ? parseInt(searchParams.get('limit') as string)
    : null

  const handleNavigateConsultationOrder = async () => {
    try {
      const cartItems = []
      for (const item of consultation?.medicines) {
        cartItems.push({
          ...item?.productId,
          isSelected: true,
          isConsultationItem: true,
          quantity: item?.quantity,
          consultationId: consultation?._id
        })
      }
      await createConsultationOrder(
        consultation?._id,
        cartItems,
        consultation?.prescriptionUrl
      )
      router.push('/checkout/address')
    } catch (error) {
      throw error
    }
  }

  if (isLoading) {
    return (
      <div>
        <h1>loading</h1>
      </div>
    )
  }
  return (
    <div>
      <div className='flex justify-center'>
        <div className='w-[60%]'>
          <ConsultationStatus
            appointmentId={consultation?.appointmentId}
            createdAt={consultation?.createdAt}
            status={consultation?.status}
            consultation={consultation}
            page={page}
            limit={limit}
          />
          {consultation?.medicines?.length ? (
            <div>
              <div className='mt-4 w-full rounded-2xl bg-white'>
                <h1 className='p-6 font-semibold'>Items Added</h1>
                <ConsultationItems items={consultation?.medicines} />
              </div>
              <div className='mt-3 flex justify-end'>
                <Button onClick={handleNavigateConsultationOrder}>
                  Confirm & order
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
