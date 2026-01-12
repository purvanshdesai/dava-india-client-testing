'use client'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { CircleCheckIcon, CircleIcon } from 'lucide-react'
import useCheckoutStore from '@/store/useCheckoutStore'
import Image from 'next/image'
import dayjs from 'dayjs'
import { useEffect } from 'react'

export default function DeliveryMode() {
  const {
    availableDeliveryModes,
    setDeliveryMode,
    deliveryMode,
    isOrderConfirmed
  } = useCheckoutStore(state => state) as any
  const { products: cartProducts } = useCheckoutStore(state => state) as any

  useEffect(() => {
    if (typeof window === 'undefined' || isOrderConfirmed) return

    const mode = availableDeliveryModes?.find(
      (m: any) => m.mode === deliveryMode
    )

    if (mode) localStorage.setItem('deliveryMode', JSON.stringify(mode))
  }, [availableDeliveryModes, deliveryMode])

  // function getApplicableRange(priceRanges: any[]): any {
  //   let freeDeliveryRange
  //   for (const range of priceRanges) {
  //     if (range.noLimit) freeDeliveryRange = range
  //   }
  //   return {
  //     freeMinOrderValue: freeDeliveryRange?.priceFrom ?? 0
  //   }
  // }

  const getExpectedDateOfDelivery = (m: any) => {
    if (m.mode === 'standard') {
      return dayjs()
        .add(m.deliveryTime, m?.timeDurationType ?? 'days')
        .format('DD MMM YYYY')
    }

    if (deliveryMode === 'standard' && m.mode === 'oneDay')
      return dayjs().add(1, 'hour').format('DD MMM YYYY')

    return dayjs()
      .add(cartProducts[0]?.deliveryTime, cartProducts[0]?.timeDurationType)
      .format('DD MMM YYYY')
  }

  if (isOrderConfirmed) return <></>

  return (
    <div>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='flex items-center justify-between text-sm font-semibold'>
            Delivery Mode
          </CardTitle>
        </CardHeader>
        <CardContent className='pt-4'>
          <div className='w-full space-y-3'>
            {availableDeliveryModes?.map((m: any, idx: number) => {
              const current = deliveryMode === m.mode
              const Icon = current ? CircleCheckIcon : CircleIcon
              // const freeOrderAmount =
              //   getApplicableRange(m.priceRange)?.freeMinOrderValue ?? 0
              return (
                <div
                  className={`flex w-full items-center gap-4 rounded-md border p-3 ${current ? 'border-primary' : ''} ${isOrderConfirmed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                  key={idx}
                  onClick={() => {
                    if (!isOrderConfirmed) setDeliveryMode(m.mode)
                  }}
                >
                  <div>
                    <Icon
                      size={20}
                      className={`${current ? 'text-primary' : 'text-label'} ${isOrderConfirmed ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                    />
                  </div>
                  <div className='flex items-center gap-3 space-y-1'>
                    <div>
                      <Image
                        src={`/images/${m.mode == 'standard' ? 'StandardDelivery' : 'OneDayDelivery'}.svg`}
                        alt=''
                        width={40}
                        height={30}
                      />
                    </div>

                    <div>
                      <p className='text-sm font-semibold'>
                        {m?.mode === 'standard'
                          ? 'Standard Delivery'
                          : 'Same Day Delivery'}
                      </p>

                      {/* <p className='text-xs text-label'>
                        @ just {m?.priceRange[0]?.deliveryCharge} | Free for
                        order above ₹{freeOrderAmount ?? 0}
                      </p> */}

                      {m?.mode === 'oneDay' &&
                        (() => {
                          const currentHour = new Date().getHours()
                          const isWithinTimeRange =
                            currentHour >= 9 && currentHour < 20

                          if (!isWithinTimeRange) return null

                          return (
                            <p className='text-xs text-label'>
                              Arriving by {getExpectedDateOfDelivery(m)}
                            </p>
                          )
                        })()}

                      {m?.mode !== 'oneDay' && (
                        <p className='text-xs text-label'>
                          Arriving by {getExpectedDateOfDelivery(m)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          {/* {availableDeliveryModes?.length > 0 &&
            availableDeliveryModes[0].mode == 'oneDay' && (
              <div className='mx-auto mt-3 text-xs'>
                <span className='text-xs text-red-500'>Note : </span>
             Same Day delivery is available for orders placed between{' '}
                <strong>9AM to 8PM</strong>, order placed afterwards will be
                delivered the next day.
              </div>
            )} */}
        </CardContent>
      </Card>
    </div>
  )
}
