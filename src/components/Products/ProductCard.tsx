'use client'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { IndianRupee, MinusIcon, PlusIcon } from 'lucide-react'
import { useTransitionRouter } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useToast } from '@/hooks/use-toast'
import {
  cartIconWhite,
  cartIconOrange,
  AddressNotDeliverableIcon
} from '../utils/icons'
import { useSession } from 'next-auth/react'
import TranslationHandler from '../utils/TranslationHandler'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react'
import {
  trackProductAddedToCart,
  trackProductRemovedFromCart
} from '@/analytics/trackers/productTracker'

interface Product {
  index?: number
  className?: string
  product: any
}

export default function ProductCard({ className, product }: Product) {
  const router = useTransitionRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const isAuthenticated = session?.user || false

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false)

  const {
    addOrUpdateProduct,
    removeProduct,
    products: cartProducts
  } = useCheckoutStore(state => state)

  const handleAddToCart = async () => {
    if (isAdding) return

    setIsAdding(true)

    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const qtyInCart = getProductCartQuantity()

    const newQuantity = qtyInCart + 1

    if (newQuantity > product?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${product.maxOrderQuantity} quantity in cart.`
      })

      return
    }

    const res: any = await addOrUpdateProduct({
      ...product,
      quantity: 1
    })

    if (res?.notAvailable) {
      // toast({
      //   title: 'Product Not Available!',
      //   description:
      //     'Unfortunately, this product is currently unavailable in your selected location.'
      // })
      setIsDialogOpen(true)
    } else if (res?.noEnoughQuantity) {
      toast({
        title: 'Insufficient Quantity!',
        description:
          'The requested quantity for this product is currently unavailable. Please reduce the quantity or explore similar items. Thank you for understanding!'
      })
    } else if (res?.outOfStock) {
      toast({
        title: 'Out of stock!',
        description:
          'The requested product is currently out of stock. Please explore similar items or check back later for availability updates!'
      })
    } else {
      toast({
        title: 'Product Added to Cart',
        description:
          'Great! The product has been successfully added to your cart'
      })
    }
    setIsAdding(false)
  }

  const handleAddQuantity = async (product: any) => {
    if (isAdding) return

    setIsAdding(true)

    const qtyInCart = product?.quantity
    let newQuantity = qtyInCart + 1

    if (newQuantity > product?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${product?.maxOrderQuantity} quantity in cart.`
      })

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
    } else if (resp?.outOfStock) {
      toast({
        title: 'Out of Stock',
        description:
          'The requested product is currently out of stock. Please explore similar items or check back later for availability updates!'
      })
    }
    setIsAdding(false)
  }

  const getProductCartQuantity = () => {
    const productInCart = cartProducts?.find(p => p._id === product?._id)
    return productInCart ? productInCart.quantity : 0
  }

  const handleTrackAddToCart = () => {
    trackProductAddedToCart({
      productName: product?.title,
      productSku: product?.sku,
      userId: session?.user?.id ?? '',
      category: (product?.collections ?? [])
        ?.map((p: any) => p.name)
        .join(', '),
      price: product?.finalPrice,
      quantity: 1
    })
  }

  const handleTrackRemoveFromCart = () => {
    trackProductRemovedFromCart({
      productName: product?.title,
      productSku: product?.sku,
      userId: session?.user?.id ?? '',
      quantity: 1,
      category: (product?.collections ?? [])?.map((p: any) => p.name).join(', ')
    })
  }

  return (
    <Card
      onClick={(e: any) => {
        e.preventDefault()
        router.push(`/products/${product?.seo?.url}`)
      }}
      className={`h-full w-full cursor-pointer overflow-hidden rounded-xl shadow-md duration-300 hover:scale-105 hover:shadow-lg ${className}`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <CardContent className='relative flex h-full w-full flex-col justify-between rounded-3xl p-0 py-2'>
                <div className='relative h-44 w-full'>
                  <Image
                    key={product?.thumbnail}
                    src={product?.thumbnail}
                    alt={product?.title}
                    fill
                    style={{ objectFit: 'contain' }}
                    loading='lazy'
                  />
                </div>

                <div className='flex w-full flex-1 flex-col justify-between space-y-2 p-2'>
                  <div className='ml-2 mt-2 h-6'>
                    {product?.discount > 0 && (
                      <div className='flex'>
                        <div className='flex items-center rounded-full bg-gradient-to-b from-[#AF004F] to-[#E30067] px-3 py-1 text-[10px] text-white'>
                          {product?.discountType === 'flat'
                            ? `Flat ₹${Math.round(product?.discount)}`
                            : `${Math.round(product?.discount)}%`}{' '}
                          Off
                        </div>
                      </div>
                    )}
                  </div>

                  <div className='flex flex-col justify-between space-y-2'>
                    <div>
                      <div
                        className='group space-y-1'
                        style={{ height: '56px' }}
                      >
                        <p className='line-clamp-2 text-sm font-semibold leading-5'>
                          <TranslationHandler
                            word={product?.title}
                            translations={product?.translations?.title}
                          />
                        </p>
                        <p className='line-clamp-1 text-xs leading-4 text-label'>
                          <TranslationHandler
                            word={product?.description}
                            translations={product?.translations?.description}
                          />
                        </p>
                      </div>
                    </div>
                    <div className=''>
                      <div className='flex items-center gap-1'>
                        <div className='flex items-center text-lg font-semibold'>
                          <IndianRupee size={18} />
                          {Number(product?.finalPrice).toFixed(2)}
                        </div>

                        {product?.finalPrice !==
                          product?.maximumRetailPrice && (
                          <div className='flex items-center justify-between'>
                            <span className='flex items-center text-sm text-label line-through'>
                              <IndianRupee size={12} />
                              {Number(product?.maximumRetailPrice).toFixed(2)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    {/* <div className='mb-2 flex items-center gap-1 rounded-md text-sm text-primary-teal'>
                    <span className='flex items-center gap-1'>
                      <IndianRupee size={14} />
                      {Number(product?.maximumRetailPrice).toFixed(2)} with
                    </span>

                    <div className='relative mb-1 h-6 w-10'>
                      <Image
                        src={'/images/membership/DavaONELogo.svg'}
                        alt='Membership crown'
                        className=''
                        fill
                      />
                    </div>
                  </div> */}

                    <div className='flex w-full items-center justify-center gap-0.5'>
                      {!product?.isNotDeliverable && !product?.isOutOfStock ? (
                        cartProducts?.some(p => p._id === product._id) ? (
                          // Show quantity controls if the product is in the cart
                          <div className='flex w-full items-center rounded-md border border-primary dark:border-gray-600'>
                            <Button
                              variant='outline'
                              size='icon'
                              className='w-full border-none'
                              disabled={
                                isRemoving || getProductCartQuantity() <= 1
                              }
                              onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (isRemoving || getProductCartQuantity() <= 1)
                                  return
                                setIsRemoving(true)
                                // Get the latest quantity before making changes
                                const currentQty = getProductCartQuantity()
                                if (currentQty <= 1) {
                                  await removeProduct(product._id)
                                  handleTrackRemoveFromCart()
                                } else {
                                  await addOrUpdateProduct({
                                    ...product,
                                    quantity: -1
                                  })
                                }
                                setIsRemoving(false)
                              }}
                            >
                              {isRemoving ? (
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
                            <span className='flex w-full items-center justify-center border-x border-primary px-3 text-sm font-bold text-primary dark:border-slate-400'>
                              {getProductCartQuantity()}
                            </span>
                            <Button
                              variant='outline'
                              size='icon'
                              className='w-full border-none'
                              disabled={isAdding}
                              onClick={async e => {
                                e.preventDefault()
                                e.stopPropagation()
                                if (isAdding) return
                                setIsAdding(true)
                                await handleAddQuantity(product)
                                handleTrackAddToCart()
                                setIsAdding(false)
                              }}
                            >
                              {isAdding ? (
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
                        ) : (
                          // Show "Add to Cart" button if the product is not in the cart
                          <div
                            className={`group flex w-full cursor-pointer items-center justify-center gap-0.5 rounded-md border border-primary py-0.5 text-sm font-semibold text-primary hover:bg-primary hover:text-white ${isAddToCartLoading ? 'pointer-events-none opacity-50' : ''}`}
                            onClick={async e => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (isAddToCartLoading) return
                              setIsAddToCartLoading(true)
                              await handleAddToCart()
                              handleTrackAddToCart()
                              setIsAddToCartLoading(false)
                            }}
                          >
                            {isAddToCartLoading ? (
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
                              <>
                                <span className='hidden group-hover:block'>
                                  {cartIconWhite}
                                </span>
                                <span className='block group-hover:hidden'>
                                  {cartIconOrange}
                                </span>
                                Add to Cart
                              </>
                            )}
                          </div>
                        )
                      ) : (
                        // Show "Unavailable" message if the product cannot be delivered
                        <div className='text-sm text-red-500'>Unavailable</div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </div>
          </TooltipTrigger>
          <TooltipContent
            side='left'
            className='absolute left-2 top-2 bg-primary-light-blue shadow-md'
            style={{ width: '12rem', overflow: 'auto' }}
          >
            <TranslationHandler
              word={product?.title}
              translations={product?.translations?.title}
            />
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent
          className='sm:max-w-[700px]'
          onClick={(e: any) => e.stopPropagation()}
        >
          <DialogTitle className='text-white'>Edit profile</DialogTitle>
          <div className='flex flex-col items-center gap-4'>
            {AddressNotDeliverableIcon}
            <span className='text-sm font-semibold'>
              Sorry, we are not delivering to this pincode yet, but we will be
              available soon
            </span>
          </div>
          <DialogFooter>
            <Button
              onClick={(e: any) => {
                e.preventDefault()
                setIsDialogOpen(false)
              }}
              className='mx-auto w-24'
            >
              Ok
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
