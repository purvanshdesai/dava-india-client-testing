'use client'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import {
  IndianRupeeIcon,
  MinusIcon,
  PlusIcon,
  Trash2Icon,
  // ShoppingBagIcon,
  CircleCheckIcon,
  CircleIcon,
  Plus
} from 'lucide-react'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Link } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import { trackProductRemovedFromCart } from '@/analytics/trackers/productTracker'
import { useSession } from 'next-auth/react'

export default function CartProducts() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const {
    addOrUpdateProduct,
    removeProduct,
    resetBuyNow,
    products,
    setProductSelectionOnCart,
    deliveryMode
  } = useCheckoutStore(state => state)
  const cart = useTranslations('Cart')
  const productTranslation = useTranslations('Product')
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingId, setAddingId] = useState<string | null>(null)

  // Reset BuyNow State
  useEffect(() => {
    resetBuyNow()
  }, [])

  const totalSelected = () => {
    return products?.filter(p => p.isSelected)?.length
  }

  const handleRemoveProduct = (product: any) => {
    removeProduct(product?._id)

    trackProductRemovedFromCart({
      productName: product?.title,
      productSku: product?.sku,
      userId: session?.user?.id ?? '',
      quantity: product?.quantity,
      category: (product?.collections ?? [])?.map((p: any) => p.name).join(', ')
    })
  }

  const handleSelectAllProducts = () => {
    if (totalSelected() === products?.length) {
      setProductSelectionOnCart(
        products.map(p => ({ ...p, isSelected: false }))
      )
    } else {
      setProductSelectionOnCart(products.map(p => ({ ...p, isSelected: true })))
    }
  }

  const handleSelectAProduct = (product: any) => {
    setProductSelectionOnCart([{ ...product, isSelected: !product.isSelected }])
  }

  const handleAddQuantity = async (product: any) => {
    if (addingId === product._id) return
    setAddingId(product._id)
    const qtyInCart = product?.quantity
    let newQuantity = qtyInCart + 1

    if (newQuantity > product?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${product?.maxOrderQuantity} quantity in cart.`
      })
      setAddingId(null)
      return
    }

    if (newQuantity > product?.maxOrderQuantity)
      newQuantity = product?.maxOrderQuantity

    const resp: any = await addOrUpdateProduct({
      ...product,
      quantity: +1
    })
    if (resp?.noEnoughQuantity) {
      toast({
        title: 'Insufficient Quantity!',
        description:
          'The requested quantity for this product is currently unavailable. Please reduce the quantity or explore similar items. Thank you for understanding!'
      })
    } else if (resp?.qtyLimitReached) {
      toast({
        title: 'Quantity Limit Reached!',
        description: 'You can add upto 10 quantity per product'
      })
    }
    setAddingId(null)
  }

  const normalProducts = products.filter(p => !p.prescriptionReq)
  const prescribedProducts = products.filter(p => p.prescriptionReq)

  const ProductInfo = (product: any) => {
    return (
      <div className='relative grid grid-cols-[20px_100px_1fr] p-3'>
        <div>
          {product.isSelected ? (
            <CircleCheckIcon
              onClick={() => handleSelectAProduct(product)}
              size={20}
              className='cursor-pointer text-primary'
            />
          ) : (
            <CircleIcon
              onClick={() => handleSelectAProduct(product)}
              size={18}
              className='cursor-pointer text-label dark:text-label-dark'
            />
          )}
        </div>
        <div
          style={{
            position: 'relative',
            width: '80px',
            height: '80px'
          }}
          className='overflow-hidden rounded-md'
          onClick={() => router.push(`/products/${product?.seo?.url}`)}
        >
          <Image
            src={product?.thumbnail}
            alt={product?.title}
            fill
            priority={false}
            style={{ objectFit: 'contain' }}
          />
        </div>
        <div className='space-y-3'>
          <div className='space-y-1'>
            <div className='group grid grid-cols-[1fr_20px] gap-3'>
              <h1 className='line-clamp-2 text-base font-semibold'>
                {product?.title}
              </h1>

              <Trash2Icon
                onClick={() => handleRemoveProduct(product)}
                size={20}
                className='cursor-pointer text-red-400'
              />
            </div>

            <p className='line-clamp-2 text-xs text-label'>
              {product?.description}
            </p>
          </div>

          <div className='flex justify-between'>
            <div className='space-y-1'>
              <div className='flex items-center gap-3'>
                <div className='flex items-center font-semibold'>
                  <IndianRupeeIcon size={18} />
                  {Number(product?.total).toFixed(2)}
                </div>

                {product?.finalPrice !== product?.maximumRetailPrice && (
                  <div className='flex items-center'>
                    <span className='flex items-center text-xs text-slate-500 line-through dark:text-slate-400'>
                      <IndianRupeeIcon size={12} />{' '}
                      {Number(
                        product?.maximumRetailPrice * product?.quantity
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>

              {product?.isNotDeliverable ? (
                <p className='text-xs text-red-600'>
                  Not Available for this location{' '}
                  {product?.note && <p>{product?.note}</p>}
                </p>
              ) : product?.isOutOfStock ? (
                <p className='text-xs text-red-600'>Out of stock</p>
              ) : (
                <div>
                  {deliveryMode === 'oneDay' &&
                    (() => {
                      const currentHour = new Date().getHours()
                      const isWithinTimeRange =
                        currentHour >= 9 && currentHour < 20

                      if (!isWithinTimeRange) return null

                      return (
                        <p className='text-xs text-label'>
                          {productTranslation('expected_delivery_date')}{' '}
                          {dayjs()
                            .add(
                              product?.deliveryTime,
                              product?.timeDurationType
                            )
                            .format('DD MMM YYYY HH:mm A')}{' '}
                        </p>
                      )
                    })()}

                  {deliveryMode !== 'oneDay' && (
                    <p className='text-xs text-label'>
                      {productTranslation('expected_delivery_date')}{' '}
                      {dayjs()
                        .add(product?.deliveryTime, product?.timeDurationType)
                        .format('DD MMM YYYY HH:mm A')}{' '}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              {!product?.isNotDeliverable && !product?.isOutOfStock && (
                <div className='flex items-center rounded-md border border-primary dark:border-gray-600'>
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    className='flex h-8 w-8 items-center justify-center border-none'
                    disabled={
                      removingId === product._id || product.quantity <= 1
                    }
                    onClick={async () => {
                      if (removingId === product._id || product.quantity <= 1)
                        return
                      setRemovingId(product._id)
                      const currentQty = product.quantity
                      if (currentQty <= 1) {
                        setRemovingId(null)
                        return
                      }
                      await addOrUpdateProduct({
                        ...product,
                        quantity: -1
                      })
                      setRemovingId(null)
                    }}
                  >
                    {removingId === product._id ? (
                      <svg
                        className='h-4 w-4 animate-spin text-primary'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          fill='none'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                      </svg>
                    ) : (
                      <MinusIcon size={16} className='text-primary' />
                    )}
                  </Button>
                  <span className='border-x border-primary px-3 text-sm font-bold text-primary dark:border-slate-400'>
                    {product?.quantity}
                  </span>
                  <Button
                    variant={'outline'}
                    size={'icon'}
                    className='flex h-8 w-8 items-center justify-center border-none'
                    disabled={addingId === product._id}
                    onClick={async () => {
                      if (addingId === product._id) return
                      await handleAddQuantity(product)
                    }}
                  >
                    {addingId === product._id ? (
                      <svg
                        className='h-4 w-4 animate-spin text-primary'
                        viewBox='0 0 24 24'
                      >
                        <circle
                          className='opacity-25'
                          cx='12'
                          cy='12'
                          r='10'
                          stroke='currentColor'
                          strokeWidth='4'
                          fill='none'
                        />
                        <path
                          className='opacity-75'
                          fill='currentColor'
                          d='M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z'
                        />
                      </svg>
                    ) : (
                      <PlusIcon size={16} className='text-primary' />
                    )}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='space-y-4'>
      <Card className='dark:bg-gray-900'>
        <CardHeader className='rounded-t-lg bg-gray-50 px-3 py-4 dark:bg-gray-700'>
          <CardTitle className='text-base font-semibold'>
            <div className='flex items-center gap-4'>
              {totalSelected() === products.length ? (
                <CircleCheckIcon
                  onClick={() => handleSelectAllProducts()}
                  size={20}
                  className='cursor-pointer text-primary'
                />
              ) : (
                <CircleIcon
                  onClick={() => handleSelectAllProducts()}
                  size={18}
                  className='cursor-pointer text-label dark:text-label-dark'
                />
              )}

              <span className='text-sm font-medium'>
                {totalSelected()} / {products.length} {cart('is_selected')}
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        {normalProducts.map((product: any, idx: number) => {
          return (
            <div className='w-full' key={idx}>
              <div>
                <div className='relative grid grid-cols-[20px_100px_1fr] p-3'>
                  <div>
                    {product.isSelected ? (
                      <CircleCheckIcon
                        onClick={() => handleSelectAProduct(product)}
                        size={20}
                        className='cursor-pointer text-primary'
                      />
                    ) : (
                      <CircleIcon
                        onClick={() => handleSelectAProduct(product)}
                        size={18}
                        className='cursor-pointer text-label dark:text-label-dark'
                      />
                    )}
                  </div>
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
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                  <div className='space-y-3'>
                    <div className='space-y-1'>
                      <div className='group grid grid-cols-[1fr_20px] gap-3'>
                        <h1 className='line-clamp-2 text-base font-semibold'>
                          {product?.title}
                        </h1>

                        <Trash2Icon
                          onClick={() => handleRemoveProduct(product)}
                          size={20}
                          className='cursor-pointer text-red-400'
                        />
                      </div>

                      <p className='line-clamp-2 text-xs text-label'>
                        {product?.description}
                      </p>
                    </div>

                    <div className='flex justify-between'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-3'>
                          <div className='flex items-center font-semibold'>
                            <IndianRupeeIcon size={18} />
                            {Number(product?.total).toFixed(2)}
                          </div>

                          {product?.finalPrice !==
                            product?.maximumRetailPrice && (
                            <div className='flex items-center'>
                              <span className='flex items-center text-xs text-slate-500 line-through dark:text-slate-400'>
                                <IndianRupeeIcon size={12} />{' '}
                                {Number(
                                  product?.maximumRetailPrice *
                                    product?.quantity
                                ).toFixed(2)}
                              </span>
                            </div>
                          )}
                        </div>

                        {product?.isNotDeliverable ? (
                          <p className='text-xs text-red-600'>
                            {productTranslation('product_unavailable_location')}
                            {product?.note && <p>{product?.note}</p>}
                          </p>
                        ) : product?.isOutOfStock ? (
                          <p className='text-xs text-red-600'>
                            {productTranslation('out_of_stock')}
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
                      </div>

                      <div>
                        {!product?.isNotDeliverable &&
                          !product?.isOutOfStock && (
                            <div className='flex items-center rounded-md border border-primary dark:border-gray-600'>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                className='border-none'
                                onClick={() =>
                                  product.quantity > 1 &&
                                  addOrUpdateProduct({
                                    ...product,
                                    quantity: -1
                                  })
                                }
                              >
                                <MinusIcon size={16} className='text-primary' />
                              </Button>
                              <span className='border-x border-primary px-3 text-sm font-bold text-primary dark:border-slate-400'>
                                {product?.quantity}
                              </span>
                              <Button
                                variant={'outline'}
                                size={'icon'}
                                className='border-none'
                                onClick={async () => {
                                  handleAddQuantity(product)
                                }}
                              >
                                <PlusIcon size={16} className='text-primary' />
                              </Button>
                            </div>
                          )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          )
        })}

        {/* // Prescription required products */}

        {prescribedProducts.length > 0 && (
          <div>
            <CardHeader className='rounded-t-lg bg-gray-50 px-3 py-4 dark:bg-gray-700'>
              <CardTitle className='text-sm font-semibold text-primary-teal'>
                Medicines which needs prescription
              </CardTitle>
            </CardHeader>
            <div>
              {prescribedProducts.map((product: any, idx: number) => {
                return (
                  <div className='w-full' key={idx}>
                    {ProductInfo(product)}

                    <Separator />
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Card>

      <Card className='cursor-pointer dark:bg-gray-900'>
        <CardHeader className='py-3'>
          <Link href={'/'}>
            <CardTitle className='flex items-center justify-between'>
              <div className='flex items-center gap-3 text-sm font-medium'>
                {' '}
                <div
                  style={{
                    position: 'relative',
                    width: '25px',
                    height: '25px'
                  }}
                >
                  <Image
                    src={'/images/AddToCartBag.svg'}
                    alt='Add to bag'
                    fill
                    priority={false}
                  />
                </div>
                {cart('add_more_items')}
              </div>
              <Plus size={20} />
            </CardTitle>
          </Link>
        </CardHeader>
      </Card>
    </div>
  )
}
