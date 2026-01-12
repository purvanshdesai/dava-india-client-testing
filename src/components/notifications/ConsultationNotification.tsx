'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function ConsultationNotification({ notification }: any) {
  const router = useRouter()

  const handleNavigateConsultationOrder = async () => {
    try {
      router.push(`/me/consultations/${notification?.data?.consultationId}`)
    } catch (error) {
      throw error
    }
  }
  return (
    <div className='flex gap-6 border-b border-[#DFE4EA] py-4'>
      <div className='w-full space-y-1'>
        <div>
          <span
            className='cursor-pointer font-semibold text-[#37582A]'
            onClick={handleNavigateConsultationOrder}
          >
            {notification?.title}:{' '}
          </span>
        </div>
        <div className='flex justify-between'>
          <div></div>
          <div className='font-semibold text-gray-400'>
            {/* {dayjs(notification?.createdAt).format('DD-MM-YY')} */}
          </div>
        </div>
      </div>
    </div>
  )
}
