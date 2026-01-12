'use client'
import { ChevronRight, ChevronDown, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import React, { useState } from 'react'
import { useFetchOrders } from '@/utils/hooks/orderHooks'
import { Search } from 'lucide-react'
import Pagination from './Pagination'
import Image from 'next/image'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { useGetAllOrderTrackingStatus } from '@/utils/hooks/appDataHooks'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import dayjs from 'dayjs'
import CancelOrderDialog from './CancelOrderDialog'
import ReturnOrderDialog from './ReturnOrderDialog'
import { Button } from '../ui/button'
import { useToast } from '@/hooks/use-toast'
import { useSession } from 'next-auth/react'
import { useTransitionRouter } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import OrdersSkeleton from './OrdersSkeleton'
import OrderDateFilter, { type DateFilterType } from './OrderDateFilter'

const OrdersTable = () => {
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const session = useSession() as any
  const router = useTransitionRouter()
  const page = parseInt(searchParams.get('page') || '1')
  const ordersPerPage = parseInt(searchParams.get('limit') || '5') // Change this to the number of orders you want per page
  const [lastRefreshed, setLastRefreshed] = useState(new Date().getTime())
  const { addOrUpdateProduct, setPrescriptionUrl } = useCheckoutStore()
  const [dateFilter, setDateFilter] = useState<DateFilterType>('all')
  const {
    data: ordersResponse,
    isLoading,
    isError
  } = useFetchOrders(lastRefreshed, { page, limit: ordersPerPage, dateFilter })
  const { data: trackingStatuses, isPending } = useGetAllOrderTrackingStatus()
  const myorder = useTranslations('MyOrders')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState<'recent' | 'older'>('recent') // State for sorting option
  const [isBuyAgainLoading, setIsBuyAgainLoading] = useState(false)
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null)

  // Handle both paginated and non-paginated responses
  const isPaginatedResponse =
    ordersResponse &&
    typeof ordersResponse === 'object' &&
    'data' in ordersResponse
  const orders = isPaginatedResponse
    ? ordersResponse.data
    : ordersResponse || []
  const totalPages = isPaginatedResponse ? ordersResponse.totalPages : 0

  // Filter orders on frontend for search functionality (only when not using server pagination)
  const filteredOrders = orders?.filter((order: any) =>
    (order?.items ?? []).some(
      (item: any) =>
        item?.title?.toLowerCase().includes(searchQuery.toLowerCase()) || // Match product name
        order.orderId.toLowerCase().includes(searchQuery.toLowerCase()) // Match order ID
    )
  )

  // Sort orders based on selected sortOrder (recent or older)
  const sortedOrders =
    sortOrder === 'recent' ? filteredOrders : filteredOrders?.reverse()

  const getOrderStatus = (order: any) => {
    const { timeline } = order?.trackingDetails ?? {}

    const userTimeline = timeline?.filter((t: any) =>
      trackingStatuses?.map((ts: any) => ts.statusCode)?.includes(t.statusCode)
    )

    if (!userTimeline?.length) return { label: order?.status }
    const lastTimeline = userTimeline[userTimeline.length - 1]

    return {
      label: lastTimeline?.label,
      comment: lastTimeline?.comment
    }
  }

  const getTimelineStatusList = (order: any) => {
    const { timeline } = order?.trackingDetails ?? {}
    if (!timeline) return []

    return timeline?.map((timeline: any) => timeline?.statusCode)
  }

  const handleBuyAgain = async (orderData: any) => {
    if (!session?.data?.user) {
      router.push('/login')
      return
    }

    if (isBuyAgainLoading) return
    if (loadingOrderId === orderData?._id) return
    setIsBuyAgainLoading(true)

    setLoadingOrderId(orderData?._id)

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

      for (const item of orderData.items) {
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
      setLoadingOrderId(null)
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

  if (isError) return <div>Error!</div>

  if (isLoading || isPending) return <OrdersSkeleton />

  return (
    <div className='flex-1 flex-col rounded-lg md:flex'>
      <div className='flex flex-col justify-between space-y-2 rounded-t-lg bg-white p-3 md:flex-row md:items-center md:px-6'>
        <div className=''>
          <h2 className='text-xl font-semibold tracking-tight'>
            {myorder('my_orders')}
          </h2>
        </div>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='bg-yellow relative flex items-center justify-center md:w-[681px]'>
            <Search size={18} className='absolute left-3 text-gray-400' />
            <input
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              type='text'
              placeholder='Search in my orders...'
              className='w-full rounded-full border border-gray-300 px-4 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500'
            />
          </div>

          {/* Date Filter */}
          <OrderDateFilter
            selectedFilter={dateFilter}
            onFilterChange={filter => {
              setDateFilter(filter)
              setLastRefreshed(new Date().getTime())
            }}
          />

          {/* Sort Order */}
          <div className='flex w-24 cursor-pointer items-center gap-2 rounded-full bg-gray-100 p-2.5 text-sm'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className='flex items-center gap-2'>
                  <span>{sortOrder === 'recent' ? 'Recent' : 'Older'}</span>
                  <ChevronDown size={18} />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='z-[10000]' align='end' forceMount>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => setSortOrder('recent')}
                >
                  {myorder('recent')}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => setSortOrder('older')}
                >
                  {myorder('older')}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
      <div>
        <div className='bg-white'>
          <div className='grid grid-cols-1 gap-4 bg-gray-50 p-2 md:grid-cols-[2fr_1fr_1fr]'>
            <div className='hidden px-4 text-sm font-medium md:col-span-1 md:grid'>
              <span>{myorder('product_details')}</span>
            </div>
            {/* <div className='hidden px-4 text-sm font-medium md:col-span-1 md:grid'>
              <span>{myorder('quantity')}</span>
            </div> */}
            <div className='hidden px-4 text-sm font-medium md:col-span-1 md:grid'>
              <span>{myorder('status')}</span>
            </div>
            <div className='hidden md:col-span-1 md:grid'></div>
          </div>

          <div className='space-y-3 p-3'>
            {sortedOrders?.map((order: any, idx: number) => {
              const orderLastStatus = getOrderStatus(order)

              const timelineStatus = getTimelineStatusList(order)
              const trackingType = order?.trackingDetails?.type

              return (
                <div key={idx} className='rounded-lg border border-gray-200'>
                  <div className='flex items-center justify-between rounded-t-lg bg-gray-50 px-3 py-2 text-sm'>
                    <div>
                      <span className='text-label'>
                        {myorder('order_id')}:{' '}
                      </span>
                      <span className='font-semibold'>#{order?.orderId}</span>
                    </div>

                    <div className='flex items-center gap-2 text-xs text-label'>
                      {dayjs(order?.createdAt).format('DD MMM YYYY, HH:mm A')}
                      <div className=''>
                        <Button
                          onClick={() => handleBuyAgain(order)}
                          disabled={
                            isBuyAgainLoading && loadingOrderId === order._id
                          }
                          className='flex w-full items-center gap-2'
                        >
                          <ShoppingCart size={16} />
                          {isBuyAgainLoading && loadingOrderId === order._id
                            ? 'Adding to Cart...'
                            : 'Buy Again'}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='p-3'>
                    {
                      <div key={idx} className={'divide-y p-2'}>
                        {order?.items.map((item: any) => {
                          return (
                            <React.Fragment key={item._id}>
                              <div>
                                <div className='flex flex-col bg-white p-4 md:col-span-4 md:grid md:grid-cols-[2fr_1fr_1fr]'>
                                  {/* Product Details */}
                                  <div className='col-span-1 flex items-center gap-4'>
                                    <div className='relative h-16 w-16 rounded-md bg-white p-1'>
                                      {item?.thumbnail ? (
                                        <Image
                                          src={item?.thumbnail}
                                          alt='Footer Logo'
                                          fill
                                          priority={false}
                                          sizes='74px'
                                          style={{
                                            objectFit: (
                                              item?.title ||
                                              item?.aboutProduct?.title
                                            )
                                              ?.toLowerCase()
                                              .includes('freshener strip')
                                              ? 'cover'
                                              : 'contain',
                                            objectPosition: 'center'
                                          }}
                                        />
                                      ) : (
                                        <div>No Image</div>
                                      )}
                                    </div>
                                    <div className='flex flex-col gap-1'>
                                      <span className='line-clamp-2 text-sm font-medium'>
                                        {item?.title}
                                      </span>
                                      <span className='line-clamp-2 text-xs text-label'>
                                        {item?.description}
                                      </span>
                                      <span className='text-xs text-label'>
                                        Qty: {item.quantity}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Status */}
                                  <div className='flex justify-between p-4 md:flex-row md:items-center'>
                                    <div className='space-y-1'>
                                      <span className='flex items-center gap-2 text-sm font-medium capitalize'>
                                        <span
                                          className={`h-2 w-2 rounded-full ${
                                            order.status === 'pending'
                                              ? 'bg-orange-500'
                                              : 'bg-green-500'
                                          }`}
                                        ></span>
                                        {orderLastStatus?.label}
                                      </span>
                                    </div>
                                    <Link
                                      href={`/me/orders/${order._id}`}
                                      className='mt-2 md:hidden'
                                    >
                                      <ChevronRight size={20} />
                                    </Link>
                                  </div>

                                  {/* Link to Details */}
                                  <div className='flex items-center justify-end gap-3'>
                                    <div>
                                      {!item?.isCancelRequested &&
                                        !item.isReturnRequested &&
                                        trackingType !== 'partial-return' &&
                                        !timelineStatus?.includes(
                                          'dispatched'
                                        ) && (
                                          <CancelOrderDialog
                                            orderId={order?._id}
                                            productId={item?._id}
                                            quantity={item?.quantity}
                                            onCancel={() =>
                                              setLastRefreshed(
                                                new Date().getTime()
                                              )
                                            }
                                          />
                                        )}

                                      {timelineStatus?.includes('delivered') &&
                                        !order?.returnWindowClosed && (
                                          <div className='flex items-center gap-3'>
                                            {!item?.isReturnRequested && (
                                              <ReturnOrderDialog
                                                orderId={order?._id}
                                                productId={item?._id}
                                                onReturn={() =>
                                                  setLastRefreshed(
                                                    new Date().getTime()
                                                  )
                                                }
                                                productQuantity={item.quantity}
                                              />
                                            )}
                                          </div>
                                        )}
                                    </div>
                                    <div>
                                      <Link
                                        href={`/me/orders/${order._id}?page=${page}&limit=${ordersPerPage}`}
                                      >
                                        <ChevronRight size={20} />
                                      </Link>
                                    </div>
                                  </div>
                                </div>

                                {order?.returnWindowClosed && (
                                  <div className='flex justify-end'>
                                    <p className='text-xs italic text-label'>
                                      Return window closed on{' '}
                                      {order?.returnWindowClosedDate}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </React.Fragment>
                          )
                        })}
                      </div>
                    }
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={newPage => {
            const newSearchParams = new URLSearchParams(searchParams.toString())
            newSearchParams.set('page', newPage.toString())
            router.push(`/me/orders?${newSearchParams.toString()}`)
          }}
        />
      </div>
    </div>
  )
}

export default OrdersTable
