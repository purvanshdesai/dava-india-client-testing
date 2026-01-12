import dayjs from 'dayjs'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import ConsultationNotification from './ConsultationNotification'

export default function Notification({ notification }: any) {
  const router = useRouter()

  if (notification?.type == 'order')
    return (
      <div className='flex gap-6 border-b border-[#DFE4EA] py-4'>
        {notification?.data?.image ? (
          <Image
            src={notification?.data?.image}
            width={96}
            height={96}
            className='rounded'
            alt=''
          />
        ) : null}
        <div className='w-full space-y-1'>
          <div>
            <span
              className='cursor-pointer font-semibold text-[#37582A]'
              onClick={() =>
                router.push(`/me/orders/${notification?.data?.orderId}`)
              }
            >
              {notification?.title}
            </span>
          </div>
          <div className='font-medium'>Rs {notification?.data?.price}</div>
          <div className='text-gray-400'>
            {notification?.data?.itemsCount > 1
              ? `${notification?.data?.itemsCount} items`
              : '1 item'}{' '}
          </div>
          <div className='flex justify-between'>
            <div></div>
            <div className='font-semibold text-gray-400'>
              {dayjs(notification?.createdAt).format('DD-MM-YY')}
            </div>
          </div>
        </div>
      </div>
    )

  if (notification?.type == 'consultation')
    return <ConsultationNotification notification={notification} />
}
