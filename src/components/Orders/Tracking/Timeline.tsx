import { Card, CardContent } from '@/components/ui/card'
import Image from 'next/image'
import { useMemo } from 'react'
import { OrderDetails } from '../../../../types/tracking'
import TimelineActivity from './Activity'
import { findDateFor, getVisibleTimeline } from './utils'
import { DELIVERY_MODES } from '@/lib/constant'

export function OrderStep({
  label,
  active,
  date,
  imageSrc,
  isCurrent,
  size,
  mode = DELIVERY_MODES.STANDARD
}: {
  label: string
  active: boolean
  date?: string
  imageSrc: string
  isCurrent: boolean
  size: number
  mode?: string
}) {
  return (
    <div className='flex flex-col items-center'>
      <div
        className={`flex h-${size} w-${size} items-center justify-center rounded-full ${
          isCurrent
            ? 'bg-green-700 ring-4 ring-green-200'
            : active
              ? 'bg-green-700 ring-2 ring-green-100'
              : 'bg-gray-400 ring-2 ring-gray-100'
        }`}
      >
        <Image
          src={imageSrc}
          alt={label}
          width={mode === DELIVERY_MODES.ONE_DAY ? 26 : 40}
          height={mode === DELIVERY_MODES.ONE_DAY ? 26 : 40}
        />
      </div>
      <span
        className={`mt-2 ${mode === DELIVERY_MODES.ONE_DAY ? 'text-xs' : 'text-sm'} font-semibold ${isCurrent ? 'text-green-700' : active ? 'text-green-600' : 'text-gray-500'}`}
      >
        {label}
      </span>
      <span className='mt-0.5 text-[9px] text-gray-500'>{date ?? ' '}</span>
    </div>
  )
}

export default function Timeline({
  order,
  trackingStatuses
}: {
  order: OrderDetails
  trackingStatuses: any[]
}) {
  const visibleTimeline = useMemo(() => {
    return getVisibleTimeline(order, trackingStatuses)
  }, [order, trackingStatuses])
  console.log('🚀 ~ Timeline ~ visibleTimeline:', visibleTimeline)

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
        <CardContent className=''>
          <div className='w-full'>
            {order?.orderTrackingType === 'order' && (
              <div className='px-6 pt-6'>
                <div className='relative mx-auto flex w-full overflow-hidden md:max-w-[75%]'>
                  <div className='absolute left-0 right-0 top-10 overflow-hidden'>
                    <div
                      className={`h-[3px] flex-1 ${progressIndex >= 1 ? 'bg-green-500' : 'bg-gray-200'}`}
                    ></div>
                  </div>
                  <div className='z-10 flex w-full items-center justify-between gap-2'>
                    <OrderStep
                      label='Received'
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
                      size={20}
                    />

                    <OrderStep
                      label='Confirmed'
                      active={progressIndex >= 1}
                      date={findDateFor(['order_confirmed'], visibleTimeline)}
                      imageSrc={'/images/status-confirmed.svg'}
                      isCurrent={progressIndex === 1}
                      size={20}
                    />

                    <OrderStep
                      label='Shipped'
                      active={progressIndex >= 2}
                      date={findDateFor(
                        ['dispatched', 'shipped'],
                        visibleTimeline
                      )}
                      imageSrc={'/images/status-shipped.svg'}
                      isCurrent={progressIndex === 2}
                      size={20}
                    />

                    <OrderStep
                      label='Delivered'
                      active={progressIndex >= 3}
                      date={findDateFor(['delivered'], visibleTimeline)}
                      imageSrc={'/images/status-delivered.svg'}
                      isCurrent={progressIndex === 3}
                      size={20}
                    />
                  </div>
                </div>
              </div>
            )}

            <div className='my-6 w-full border-b'></div>

            <div className='no-scrollbar flex justify-center overflow-y-auto'>
              <div className='relative w-full md:max-w-[80%]'>
                <div>
                  <TimelineActivity items={visibleTimeline} />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
