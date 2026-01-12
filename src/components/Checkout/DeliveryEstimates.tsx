'use client'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import { Separator } from '../ui/separator'
import { getCheckoutProducts } from '@/store/useCheckoutStore'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTranslations } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function DeliveryEstimates() {
  const { products: cartProducts } = useCheckoutStore(state => state)
  const [products, setProducts] = useState<Array<any>>([])
  const cart = useTranslations('Cart')
  const productTranslation = useTranslations('Product')

  useEffect(() => {
    setProducts(getCheckoutProducts() ?? [])
  }, [cartProducts])

  return (
    <div>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='text-base font-semibold'>
            {cart('delivery_estimates')}
          </CardTitle>
        </CardHeader>
        {products.map((product: any, idx) => {
          return (
            <div className='w-full' key={idx}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className='relative grid grid-cols-[80px_1fr] items-center gap-4 p-3'>
                        <div
                          style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px'
                          }}
                          className='overflow-hidden rounded-md'
                        >
                          <Image
                            src={product?.thumbnail}
                            alt={product?.title}
                            fill
                            priority={false}
                            objectFit='contain'
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='space-y-1'>
                            <div className='group grid grid-cols-[1fr_20px] gap-3'>
                              <h1 className='line-clamp-2 text-base font-semibold'>
                                {product?.title}
                              </h1>
                            </div>

                            <p className='line-clamp-2 text-xs text-label'>
                              {product?.quantity} {cart('quantity')}
                            </p>
                          </div>

                          <div className='flex justify-between'>
                            <div className='space-y-1'>
                              {product?.isNotDeliverable ? (
                                <p className='text-xs text-red-600'>
                                  {cart('not_available_for_this_location')}
                                  {product?.note && <p>{product?.note}</p>}
                                </p>
                              ) : product?.isOutOfStock ? (
                                <p className='text-xs text-red-600'>
                                  {cart('out_of_stock')}
                                </p>
                              ) : (
                                <p className='text-xs text-slate-500 dark:text-slate-400'>
                                  {productTranslation('expected_delivery_date')}{' '}
                                  {dayjs()
                                    .add(
                                      product?.deliveryTime,
                                      product?.timeDurationType
                                    )
                                    .format('DD MMM YYYY HH:mm A')}{' '}
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className='bg-primary-light-blue'>
                    <p>{product?.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Separator />
            </div>
          )
        })}
      </Card>
    </div>
  )
}
