'use client'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription
} from '@/components/ui/card'
import Image from 'next/image'
import { IndianRupeeIcon, Edit3Icon } from 'lucide-react'
import { Separator } from '../ui/separator'
import { Link } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { getCheckoutProducts } from '@/store/useCheckoutStore'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'
// import DavaOneMembershipOption from './DavaOneMembershipOption'

export default function ItemsSummary() {
  const router = useRouter()
  const {
    products: cartProducts,
    isOrderConfirmed,
    confirmedOrder,
    isConsultationOrder,
    discountAmount,
    appliedCouponData
  } = useCheckoutStore(state => state)
  const [products, setProducts] = useState<Array<any>>([])
  const cart = useTranslations('Cart')
  const productTranslation = useTranslations('Product')

  useEffect(() => {
    setProducts(getCheckoutProducts() ?? [])
  }, [cartProducts])

  const maxDeliveryTime: any = products
    .map(p => dayjs().add(p.deliveryTime, p.timeDurationType).format())
    .reduce(
      (max: any, current: any) =>
        new Date(current) > new Date(max) ? current : max,
      dayjs().format()
    )

  return (
    <div className='space-y-4'>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 p-3 dark:bg-gray-700'>
          <CardTitle className='flex items-center justify-between text-base font-semibold'>
            <span>
              {cart('order')}
              {isOrderConfirmed && (
                <span className='font-bold'>#{confirmedOrder?.orderId}</span>
              )}
            </span>
            {!isOrderConfirmed && !isConsultationOrder && (
              <Link href={'/checkout/cart'}>
                <Edit3Icon size={20} className='cursor-pointer' />
              </Link>
            )}
          </CardTitle>
          <CardDescription>
            {isOrderConfirmed ? (
              <span>
                {dayjs(confirmedOrder?.createdAt ?? new Date()).format(
                  'DD MMMM YYYY [at] hh:mm A'
                )}
              </span>
            ) : (
              <span>
                {products?.length > 0 &&
                  dayjs(maxDeliveryTime).format('DD MMMM YYYY')}
              </span>
            )}

            {discountAmount > 0 && (
              <div className='space-y-1 pt-3 text-xs text-black'>
                <p>
                  Coupon <strong>{appliedCouponData.couponName}</strong> applied
                </p>
                <p>
                  You <strong>Saved ₹{discountAmount}</strong> on this order.
                </p>
              </div>
            )}
          </CardDescription>
        </CardHeader>
        <div className='grid grid-cols-[80px_3fr_80px_1.5fr] items-center justify-center gap-4 bg-gray-100 p-3 text-sm font-semibold text-label dark:bg-gray-800 dark:text-label-dark'>
          <div></div>
          <div>{cart('product')}</div>
          <div className='text-center'>{cart('quantity')}</div>
          <div className='text-center'>
            {discountAmount > 0 ? 'Discounted Price' : cart('price')}
          </div>
        </div>
        {products.map((product: any, idx) => {
          return (
            <div className='w-full' key={idx}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <div className='relative grid grid-cols-[80px_3fr_80px_1.5fr] items-center gap-4 p-3'>
                        <div
                          style={{
                            position: 'relative',
                            width: '80px',
                            height: '80px'
                          }}
                          className='overflow-hidden rounded-md'
                          onClick={() =>
                            router.push(`/products/${product?.seo?.url}`)
                          }
                        >
                          <Image
                            src={product?.thumbnail}
                            alt={product?.title}
                            fill
                            priority={false}
                            style={{ objectFit: 'contain' }}
                          />
                        </div>
                        <div className='space-y-2'>
                          <div className='space-y-1'>
                            <div className='group grid grid-cols-[1fr_20px] gap-3'>
                              <h1 className='line-clamp-2 text-sm font-semibold'>
                                {product?.title}
                              </h1>
                            </div>

                            {/* <p className='line-clamp-2 text-xs text-label dark:text-label-dark'>
                        {product?.description}
                      </p> */}
                          </div>

                          {!isOrderConfirmed && (
                            <>
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
                                    .format('DD MMM YYYY HH:mm A')}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        <div className='flex items-center justify-center text-center text-sm text-label dark:text-label-dark'>
                          {product?.quantity}
                        </div>
                        <div
                          className={`flex flex-col items-center justify-center text-right text-sm`}
                        >
                          <div
                            className={`flex items-center ${discountAmount > 0 ? 'line-through' : ''}`}
                          >
                            <IndianRupeeIcon size={12} />
                            {Number(product?.total).toFixed(2)}
                          </div>

                          {discountAmount > 0 && (
                            <div className='flex items-center justify-center text-right text-lg font-bold'>
                              <IndianRupeeIcon size={16} />
                              {Number(
                                product?.total - product?.discountAmount
                              ).toFixed(2)}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{product?.title}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Separator />
            </div>
          )
        })}
        {/* <div>
          <DavaOneMembershipOption />
        </div> */}
        <div className='p-2 text-xs'>
          *Price of the product may vary slightly based on the batch
        </div> 
      </Card>
    </div>
  )
}
