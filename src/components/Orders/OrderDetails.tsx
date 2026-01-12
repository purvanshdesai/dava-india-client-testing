'use client'
import { useFetchOrderById } from '@/utils/hooks/orderHooks'
import {
  ArrowLeft,
  // ChevronRightIcon,
  Download,
  ShoppingCart
} from 'lucide-react'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import dayjs from 'dayjs'
import { useGetAllOrderTrackingStatus } from '@/utils/hooks/appDataHooks'
import { useParams, useSearchParams } from 'next/navigation'
import ZohoBot from '@/components/ChatBot/ZohoBot'
import { useSession } from 'next-auth/react'
import { useTranslations } from 'next-intl'
import axios from 'axios'
import CancelOrderDialog from './CancelOrderDialog'
import ReturnOrderDialog from './ReturnOrderDialog'
import { Button } from '../ui/button'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useToast } from '@/hooks/use-toast'
import { useTransitionRouter } from 'next-view-transitions'

export default function OrderDetails() {
  const { orderId }: { orderId: string } = useParams()
  const searchParams = useSearchParams()
  const session = useSession() as any
  const router = useTransitionRouter()
  const { toast } = useToast()

  const page = searchParams.get('page')
    ? parseInt(searchParams.get('page') as string)
    : null
  const ordersPerPage = searchParams.get('limit')
    ? parseInt(searchParams.get('limit') as string)
    : null

  const myorder = useTranslations('MyOrders')
  const productTranslation = useTranslations('Product')
  const cart = useTranslations('Cart')
  const common = useTranslations('Common')

  const [orderData, setOrderData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [lastRefreshed, setLastRefreshed] = useState(new Date().getTime())
  const [isBuyAgainLoading, setIsBuyAgainLoading] = useState(false)

  // Use the hook directly inside the component and avoid calling it within useEffect
  const { data, isError } = useFetchOrderById(orderId, lastRefreshed)
  const { data: trackingStatuses, isPending } = useGetAllOrderTrackingStatus()

  const { addOrUpdateProduct, setPrescriptionUrl } = useCheckoutStore()

  useEffect(() => {
    if (data) {
      setOrderData(data)
      setIsLoading(false)
    } else if (isError) {
      console.error('Error fetching order data:', isError)
      setIsLoading(false)
    }
  }, [data, isError, trackingStatuses])

  const downloadInvoice = (invoiceUrl: string) => {
    if (!invoiceUrl) return

    axios
      .get(invoiceUrl, { responseType: 'blob' })
      .then((response: any) => {
        const blob = new Blob([response.data], { type: 'pdf' })
        const link = document.createElement('a')
        link.href = URL.createObjectURL(blob)
        link.download = `invoice_${orderId}.pdf`
        link.click()
        URL.revokeObjectURL(link.href)
      })
      .catch(console.error)
  }

  const handleBuyAgain = async () => {
    if (!session?.data?.user) {
      router.push('/login')
      return
    }

    if (isBuyAgainLoading) return

    setIsBuyAgainLoading(true)

    try {
      // Set prescription URL if available

      if (
        orderData?.prescription?.urls &&
        orderData.prescription.urls.length > 0
      ) {
        setPrescriptionUrl(orderData.prescription.urls)
      }

      // Add all products from the order to cart
      let addedProductsCount = 0
      let failedProductsCount = 0

      for (const store of orderData?.orderItemsByStore || []) {
        for (const item of store.items) {
          try {
            const productMasterData = item.aboutProduct

            // If product details are missing (e.g. product deleted), skip
            if (!productMasterData || !productMasterData.finalPrice) {
              failedProductsCount++
              continue
            }
            if (productMasterData.isActive === false) {
              failedProductsCount++
              continue
            }

            const productData: any = normalizeProductForCart(item)
            const result: any = await addOrUpdateProduct(productData)

            if (result?.qtyLimitReached) {
              failedProductsCount++
            } else if (
              result?.notAvailable ||
              result?.noEnoughQuantity ||
              result?.outOfStock
            ) {
              failedProductsCount++
            } else {
              addedProductsCount++
            }
          } catch (error) {
            failedProductsCount++
            console.error('Error adding product to cart:', error)
          }
        }
      }

      // Show appropriate toast message
      if (addedProductsCount > 0 && failedProductsCount === 0) {
        toast({
          title: 'Products Added to Cart',
          description: `Successfully added ${addedProductsCount} product(s) to your cart`
        })
        router.push('/checkout/cart')
      } else if (addedProductsCount > 0 && failedProductsCount > 0) {
        toast({
          title: 'Partially Added to Cart',
          description: `Added ${addedProductsCount} product(s) to cart. ${failedProductsCount} product(s) could not be added due to availability issues.`
        })
        router.push('/checkout/cart')
      } else {
        toast({
          title: 'Unable to Add Products',
          description:
            'Some products from this order are currently unavailable. Please check product availability.',
          variant: 'destructive'
        })
      }
    } catch (error) {
      console.error('Error in buy again:', error)
      toast({
        title: 'Error',
        description: 'Something went wrong while adding products to cart.',
        variant: 'destructive'
      })
    } finally {
      setIsBuyAgainLoading(false)
    }
  }

  const normalizeProductForCart = (item: any) => {
    const product = item.aboutProduct || item

    return {
      _id: item?.aboutProduct._id, // ✅ this must be the product ID, not orderItem ID
      name: product.title || item.title,
      title: product.title || item.title,
      description: product.description,
      composition: product.composition || product.compositions,
      quantity: item.quantity,
      unitPrice: product.finalPrice,
      finalPrice: product.finalPrice,
      maximumRetailPrice: product.maximumRetailPrice || product.finalPrice,
      discount: product.discount || 0,
      discountType: product.discountType || 'flat',
      total: product.finalPrice * item.quantity,
      prescriptionReq: product.prescriptionReq || false,
      maxOrderQuantity: product.maxOrderQuantity || 10,
      minOrderQuantity: product.minOrderQuantity || 1,
      isSelected: true,
      isOutOfStock: false,
      isNotDeliverable: false,
      thumbnail: product.thumbnail,
      isConsultationItem: item.isConsultationItem || false,
      consultationId: null,
      collections: product.collections || [],
      tags: product.tags || [],
      seo: product.seo || {},
      images: product.images || [],
      consumption: product.consumption || '',
      brandTags: product.brandTags || [],
      aboutProduct: product
    }
  }

  if (isLoading || isPending) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error Fetching...</div>
  }

  return (
    <>
      <div className='h-full flex-1 flex-col rounded-lg border md:flex'>
        {/* header */}
        <div className='flex items-center justify-between space-y-2 bg-white p-3 px-6 py-4'>
          <div className='flex w-full items-center gap-2'>
            <Link
              href={`/me/orders${page && ordersPerPage ? `?page=${page}&limit=${ordersPerPage}` : ''}`}
            >
              <span className='inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-200'>
                <ArrowLeft size={16} />
              </span>
            </Link>
            <h2 className='flex-grow text-lg font-semibold tracking-tight'>
              {myorder('order_details')}
            </h2>
            <div className='flex items-center gap-2'>
              <Button
                onClick={handleBuyAgain}
                disabled={isBuyAgainLoading}
                className='flex items-center gap-2'
              >
                <ShoppingCart size={16} />
                {isBuyAgainLoading ? 'Adding to Cart...' : 'Buy Again'}
              </Button>
            </div>
            <ZohoBot
              label={'Chat'}
              variant={'order'}
              user={{
                name: session?.data?.user.name,
                email: session?.data?.user.email
              }}
            />
          </div>
        </div>
        <div className='flex items-center justify-between bg-gray-50 px-6 py-3'>
          <div className='flex flex-col'>
            {/* order id */}
            <div className='text-xs md:text-sm'>
              {myorder('order_id')}:{' '}
              <span className='font-bold'>#{orderData?.orderId}</span>
            </div>
            <div>
              {orderData?.createdAt && (
                <span className='pl-1 text-xs font-normal text-gray-500'>
                  {dayjs(orderData?.createdAt).format(
                    'DD MMM YYYY [at] hh:mm A'
                  )}
                </span>
              )}
            </div>
          </div>

          <div className='flex items-center gap-1 text-sm font-medium text-label'>
            {myorder('order_is')}
            <span className='font-semibold capitalize text-green-500'>
              {orderData.status}
            </span>
          </div>
        </div>

        {/* product details */}
        <div className='space-y-4 bg-white p-4'>
          {orderData?.orderItemsByStore?.map((store: any, idx: any) => {
            const timelineStatusList = store?.trackingDetails?.timeline?.map(
              (timeline: any) => timeline?.statusCode
            )

            const trackingType = store?.trackingDetails?.type

            return (
              <div className='divide-y rounded-md border' key={idx}>
                {store.items.map((item: any, idx: number) => {
                  return (
                    <div className='p-3 px-6' key={idx}>
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2 md:gap-6'>
                          <div className='relative h-16 w-16 overflow-hidden rounded-md'>
                            {item?.thumbnail ? (
                              <Image
                                src={item?.thumbnail}
                                alt='Footer Logo'
                                fill
                                priority={false}
                                className='rounded-md'
                              />
                            ) : (
                              <div>{myorder('no_image')}</div>
                            )}
                          </div>
                          <div className='group flex flex-col items-start justify-start gap-1'>
                            <span className='line-clamp-2 text-sm font-semibold'>
                              {item?.title}
                            </span>
                            <span className='text-xs text-label-dark'>
                              ₹
                              {Number(item?.amount * item?.quantity).toFixed(2)}
                            </span>
                            <span className='text-xs text-gray-400'>
                              {productTranslation('quantity')}: {item?.quantity}
                            </span>
                          </div>
                        </div>
                        <div className='flex items-center gap-3'>
                          <div>
                            {!item?.isCancelRequested &&
                              !item.isReturnRequested &&
                              trackingType !== 'partial-return' &&
                              !timelineStatusList?.includes('dispatched') && (
                                <CancelOrderDialog
                                  orderId={orderData?._id}
                                  productId={item?._id}
                                  quantity={item?.quantity}
                                  onCancel={() =>
                                    setLastRefreshed(new Date().getTime())
                                  }
                                />
                              )}

                            {timelineStatusList?.includes('delivered') &&
                              !store?.returnWindowClosed && (
                                <div className='flex items-center gap-3'>
                                  {!item?.isReturnRequested && (
                                    <ReturnOrderDialog
                                      orderId={orderData?._id}
                                      productId={item?._id}
                                      onReturn={() =>
                                        setLastRefreshed(new Date().getTime())
                                      }
                                      productQuantity={item.quantity}
                                    />
                                  )}
                                </div>
                              )}

                            {store?.returnWindowClosed && (
                              <div className='flex justify-end'>
                                <p className='text-xs italic text-label'>
                                  Return window closed on{' '}
                                  {store?.returnWindowClosedDate}
                                </p>
                              </div>
                            )}
                          </div>

                          <div>
                            <Button
                              variant={'default'}
                              size={'sm'}
                              onClick={() => {
                                router.push(
                                  `/track/${orderData?._id}?orderTrackingId=${store?.trackingDetails?._id}`
                                )
                              }}
                            >
                              Track
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
                <div>
                  {/* <div className='border-t bg-gray-50 px-3 py-6'>
                    {store?.trackingDetails?.timeline &&
                    store?.trackingDetails?.timeline?.length > 0 ? (
                      <div className='relative ml-4 space-y-3'>
                        {store?.trackingDetails?.timeline
                          .filter((t: any) =>
                            trackingStatuses
                              ?.map((ts: any) => ts.statusCode)
                              ?.includes(t.statusCode)
                          )
                          .map((t: any, idx: number) => {
                            return (
                              <div key={idx}>
                                <div className='relative flex items-center gap-4'>
                                  <div className='h-3 w-3 flex-shrink-0 rounded-full bg-green-500'></div>
                                  <div className='space-y-1'>
                                    <div className='flex items-center gap-3 text-sm font-medium'>
                                      {t?.label}
                                      <span className='text-xs font-normal text-gray-500'>
                                        {dayjs(t.dateTime ?? t.date).format(
                                          'DD MMM YYYY [at] hh:mm A'
                                        )}
                                      </span>
                                    </div>
                                    {t.statusLocation && (
                                      <div>
                                        <p className='text-xs font-normal text-gray-500'>
                                          {t.statusLocation} - {t.instructions}
                                        </p>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                {t.statusCode === 'refund_completed' && (
                                  <div className='px-2 pl-7 pt-2'>
                                    <p className='text-xs text-label underline'>
                                      *Refund will be credited within 7 working
                                      days from the initiation date.
                                    </p>
                                  </div>
                                )}
                              </div>
                            )
                          })}
                      </div>
                    ) : (
                      <div className='relative ml-4'>
                        <div className='relative flex items-center gap-4'>
                          <div className='h-3 w-3 flex-shrink-0 rounded-full bg-green-500'></div>
                          <div className='space-y-1'>
                            <div className='flex items-center gap-3 text-sm font-medium'>
                              {myorder('order_in_progress')}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div> */}

                  {store?.trackingDetails?.invoiceUrl ? (
                    <div className='flex items-center justify-center bg-white p-3 px-6'>
                      <div
                        className='flex cursor-pointer items-center gap-2'
                        onClick={() =>
                          downloadInvoice(store?.trackingDetails?.invoiceUrl)
                        }
                      >
                        <Download className='text-primary' size={18} />
                        <span className='text-sm text-primary'>
                          Download Invoice
                        </span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            )
          })}
        </div>

        {/* shipping details */}
        <div className='bg-white p-3 px-6'>
          <div className='mb-3 text-lg font-semibold'>
            {myorder('shipping_details')}
          </div>
          <div className='flex flex-col gap-2'>
            <span className='text-sm font-semibold'>
              {orderData?.address?.userName}
            </span>
            <span className='w-56 text-sm font-medium text-label'>
              {orderData.address?.addressLine1},{' '}
              {orderData.address?.addressLine2},{orderData.address?.city},
              {orderData.address?.state}, Pin: {orderData?.address?.postalCode}
            </span>
            <span className='text-sm text-label'>
              {common('mobile')}:{' '}
              <span className='text-xs font-medium'>
                {orderData?.address?.phoneNumber}
              </span>
            </span>
            {orderData?.patientId && (
              <span className='text-xs text-label'>
                Patient:
                <span className='text-xs font-medium'>
                  {orderData?.patientId?.name}
                </span>
              </span>
            )}
          </div>
        </div>
        {/* price information */}
        <div className='bg-gray-50 p-3 px-6'>
          <div className='mb-3 text-lg font-semibold'>
            {myorder('price_information')}
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>{cart('mrp_total')}</span>
            <span className='text-sm text-gray-700'>
              ₹{Number(orderData?.subTotal).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>
              {cart('shipping_charges')}
            </span>
            <span className='text-sm text-gray-700'>
              ₹ {Number(orderData?.deliveryCharge).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>{cart('tax_amount')}</span>
            <span className='text-sm text-gray-700'>
              ₹ {Number(orderData?.taxAmount).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>Handling Charge</span>
            <span className='text-sm text-gray-700'>
              ₹ {Number(orderData?.handlingCharge).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>Packaging Charge</span>
            <span className='text-sm text-gray-700'>
              ₹ {Number(orderData?.packingCharge).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>Platform Fee</span>
            <span className='text-sm text-gray-700'>
              ₹ {Number(orderData?.platformFee).toFixed(2)}
            </span>
          </div>

          {orderData?.isDavaOneMembershipAdded && (
            <div className='flex justify-between py-2'>
              <span className='text-sm text-gray-700'>DavaONE Membership</span>
              <span className='text-sm text-gray-700'>
                ₹ {Number(orderData?.davaOneMembershipAmount).toFixed(2)}
              </span>
            </div>
          )}

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>
              {cart('total_coupon_discount')}
            </span>
            <span className='text-sm text-red-600'>
              - ₹ {Number(orderData?.discountedAmount).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm text-gray-700'>Dava Coins Used</span>
            <span className='text-sm text-red-600'>
              - ₹ {Number(orderData?.davaCoinsUsed)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm font-medium text-green-600'>
              {cart('total_savings')}
            </span>
            <span className='text-sm font-medium text-green-600'>
              ₹ {Number(orderData?.discountedAmount).toFixed(2)}
            </span>
          </div>

          <div className='flex justify-between py-2'>
            <span className='text-sm font-medium text-red-600'>
              {myorder('total_paid')}
            </span>
            <span className='text-sm font-medium text-red-600'>
              ₹{Number(orderData?.orderTotal).toFixed(2)}
            </span>
          </div>
        </div>
        {/* download invoice */}
      </div>
    </>
  )
}
