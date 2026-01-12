import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useMemo } from 'react'
import { OrderDetails, RiderLocation } from '../../../../types/tracking'
import { OrderStep } from './Timeline'
import { findDateFor, getVisibleTimeline } from './utils'
import { DELIVERY_MODES } from '@/lib/constant'
import { PhoneIcon } from 'lucide-react'

export default function RiderInfo({
  order,
  trackingStatuses,
  riderInfo
}: {
  order: OrderDetails
  trackingStatuses: any[]
  riderInfo: RiderLocation
}) {
  const arrivalDate = useMemo(() => {
    const createdAt = order?.createdAt ? dayjs(order.createdAt) : dayjs()
    const maxDays = order?.deliverMode === DELIVERY_MODES.ONE_DAY ? 0 : 3
    const eta = createdAt.add(maxDays, 'day')
    return eta
  }, [order])

  const visibleTimeline = useMemo(() => {
    return getVisibleTimeline(order, trackingStatuses)
  }, [order, trackingStatuses])

  const mapStatusToIndex = (code: string | undefined) => {
    if (!code) return 0
    if (['delivered'].includes(code)) return 3
    if (['dispatched', 'shipped', 'picked_up'].includes(code)) return 2
    if (['order_confirmed'].includes(code)) return 1
    if (
      ['order_received', 'order_placed', 'order_under_verification'].includes(
        code
      )
    )
      return 0
    return 0
  }

  const currentStatusCode = (visibleTimeline || []).slice(0)[0]?.statusCode
  const progressIndex = mapStatusToIndex(currentStatusCode)

  return (
    <div>
      <Card
        className='border-0 shadow-sm'
        style={{ minHeight: 'calc(100vh - 240px)' }}
      >
        <CardHeader className='bg-gray-50'>
          <CardTitle className='flex flex-col text-lg'>
            <div>
              {order?.deliverMode === DELIVERY_MODES.STANDARD ? (
                <span>
                  Your order is{' '}
                  {order?.status === 'delivered' ? 'delivered' : 'on the way'}
                </span>
              ) : (
                <span>
                  Your order is {riderInfo ? riderInfo?.status : 'on the way'}
                </span>
              )}
            </div>

            <span className='text-sm font-normal text-gray-600'>
              Order ID: <span className='font-semibold'>{order?.orderId}</span>
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className='py-6'>
          {order?.deliverMode === DELIVERY_MODES.STANDARD && (
            <div className='flex h-52 items-center justify-center'>
              <div
                style={{
                  position: 'relative',
                  width: '160px',
                  height: '160px'
                }}
              >
                <Image
                  src={`/images/DeliveryTruck.gif`}
                  alt={'Delivery truck'}
                  fill
                  priority={false}
                  unoptimized
                />
              </div>
            </div>
          )}

          {order?.deliverMode === DELIVERY_MODES.ONE_DAY && (
            <div className='px-4'>
              <div className='relative mx-auto mb-8 flex w-full'>
                <div className='absolute left-0 right-0 top-6'>
                  <div
                    className={`h-[2px] flex-1 ${progressIndex >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                  ></div>
                </div>
                <div className='z-10 flex w-full items-center justify-between gap-2'>
                  <OrderStep
                    label='Confirmed'
                    active={progressIndex >= 0}
                    date={findDateFor(
                      [
                        'order_placed',
                        'order_under_verification',
                        'order_received'
                      ],
                      visibleTimeline
                    )}
                    imageSrc={'/images/status-received.svg'}
                    isCurrent={progressIndex === 0}
                    size={12}
                    mode={DELIVERY_MODES.ONE_DAY}
                  />

                  <OrderStep
                    label='Packed'
                    active={progressIndex >= 1}
                    date={findDateFor(['order_confirmed'], visibleTimeline)}
                    imageSrc={'/images/status-confirmed.svg'}
                    isCurrent={progressIndex === 1}
                    size={12}
                    mode={DELIVERY_MODES.ONE_DAY}
                  />

                  <OrderStep
                    label='Out For Delivery'
                    active={progressIndex >= 2}
                    date={findDateFor(
                      ['dispatched', 'shipped'],
                      visibleTimeline
                    )}
                    imageSrc={'/images/status-shipped.svg'}
                    isCurrent={progressIndex === 2}
                    size={12}
                    mode={DELIVERY_MODES.ONE_DAY}
                  />

                  <OrderStep
                    label='Delivered'
                    active={progressIndex >= 3}
                    date={findDateFor(['delivered'], visibleTimeline)}
                    imageSrc={'/images/status-delivered.svg'}
                    isCurrent={progressIndex === 3}
                    size={12}
                    mode={DELIVERY_MODES.ONE_DAY}
                  />
                </div>
              </div>
              {riderInfo && (
                <div className='flex items-center gap-6 rounded-md bg-gray-100 p-4'>
                  <div
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px'
                    }}
                  >
                    <Image
                      src={`/images/Rider.svg`}
                      alt={'Delivery truck'}
                      fill
                      priority={false}
                      unoptimized
                    />
                  </div>

                  <div className='space-y-1'>
                    <p className='text-base font-semibold'>{riderInfo?.name}</p>

                    <div className='flex items-center gap-1'>
                      <PhoneIcon size={16} className='text-primary-green' />

                      <p className='text-xs text-label'>{riderInfo?.phone}</p>
                    </div>

                    <p className='pt-3 text-sm font-bold capitalize text-primary-green'>
                      {riderInfo?.status}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className='px-4'>
            <div className='h-100 mt-6 flex w-full flex-col items-center rounded bg-gray-100 py-10'>
              <div className='text-base font-semibold'>
                {order?.status == 'delivered' ? 'Delivered' : 'Arriving'} on
              </div>
              <div className='pt-3 text-2xl font-bold'>
                {order?.status == 'delivered'
                  ? dayjs(order?.lastActivityDateTime).format(
                      'ddd MM YYYY, hh:mm A'
                    )
                  : arrivalDate.format('DD - MMM - YYYY')}
              </div>
            </div>
          </div>

          <div className='mt-6 text-center'>
            <Link
              href={`/me/orders/${order?._id}`}
              className='text-sm font-medium text-primary underline'
            >
              View Order Details
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
