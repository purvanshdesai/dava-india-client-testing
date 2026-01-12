'use client'
import React from 'react'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
// import { useTranslations } from 'next-intl'
import Link from 'next/link'
import useCheckoutStore from '@/store/useCheckoutStore'
import dayjs from 'dayjs'

export default function OrderSuccessCard() {
  // const cart = useTranslations('Cart')
  const { confirmedOrder, deliveryMode } = useCheckoutStore()
  // Get current time
  const currentHour = new Date().getHours()
  const isNightTime = currentHour >= 21 || currentHour < 9 // 9 PM to 9 AM

  const getExpectedDateOfDelivery = () => {
    if (typeof window === 'undefined') return ''

    const mode: any = JSON.parse(localStorage.getItem('deliveryMode') ?? '{}')

    if (mode.mode === 'standard') {
      return dayjs()
        .add(mode.deliveryTime, mode?.timeDurationType ?? 'days')
        .format('DD MMM YYYY')
    }

    if (mode.mode === 'oneDay')
      return dayjs().add(1, 'hour').format('DD MMM YYYY')
  }

  return (
    <div>
      <Card>
        <CardHeader className='rounded-lg bg-gray-50 p-4 dark:bg-gray-700'>
          <CardTitle className='flex flex-col gap-1'>
            <div className='grid grid-cols-[120px_1fr] items-center justify-between text-base font-semibold'>
              <div
                style={{
                  position: 'relative',
                  width: '100px',
                  height: '100px'
                }}
              >
                <Image
                  src={`/images/OrderConfirmed.svg`}
                  alt='Footer Logo'
                  fill
                  priority={false}
                />
              </div>
              <div className='flex flex-col'>
                <div className='text-sm md:text-lg'>
                  We've received your order!
                </div>

                <div className='text-sm font-normal text-label'>
                  Expected by {getExpectedDateOfDelivery()}
                </div>

                <div className='w-full py-1'>
                  <Link
                    href={`/me/orders/${confirmedOrder?._id}`}
                    className='text-sm font-semibold text-primary underline'
                  >
                    View Order Details &gt;
                  </Link>
                </div>

                {isNightTime && deliveryMode == 'oneDay' && (
                  <div className='flex-1 text-[12px] font-normal'>
                    Same Day delivery is available for orders placed between
                    <strong> 9:00 AM and 9:00 PM</strong>, Orders placed
                    afterward will be delivered the <strong>next day</strong>.
                  </div>
                )}
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  )
}
