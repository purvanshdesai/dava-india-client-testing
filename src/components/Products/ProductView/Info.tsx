'use client'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import {
  CheckCircle2Icon,
  IndianRupeeIcon,
  // ShoppingCartIcon,
  PlusIcon,
  MinusIcon
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTransitionRouter } from 'next-view-transitions'
import { useToast } from '@/hooks/use-toast'
import useProductViewStore from '@/store/useProductViewStore'
import useDeliveryAddressStore from '@/store/useDeliveryAddressStore'
import { ProductVariation } from '../../../../types/storeTypes'
import { useTranslations } from 'next-intl'
import { useSession } from 'next-auth/react'
import { AddressNotDeliverableIcon, cartIcon } from '../../utils/icons'
import TranslationHandler from '@/components/utils/TranslationHandler'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LineShareButton,
  LinkedinIcon,
  XIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton
} from 'react-share'
import dayjs from 'dayjs'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import {
  trackProductAddedToCart,
  trackProductRemovedFromCart
} from '@/analytics/trackers/productTracker'
import MedicineReminder from './MedicineReminder'

interface ProductInfo {
  product: any
}

const productInfo = [
  {
    title: 'Compositions',
    image: 'composition.svg',
    value: 'compositions',
    show: true
  },
  {
    title: 'Expires on or after',
    image: 'expiry.svg',
    value: 'expiryDate',
    show: true
  },
  {
    title: 'Consumption',
    image: 'Consumption.svg',
    value: 'consumption',
    show: true
  },
  // {
  //   title: 'Manufacturer',
  //   image: 'manufacturer.svg',
  //   value: 'manufacturer',
  //   show: false
  // },
  // {
  //   title: 'Marketer',
  //   image: 'marketer.svg',
  //   value: 'marketer',
  //   show: false
  // },
  {
    title: 'Country of origin',
    image: 'globe.svg',
    value: 'country',
    show: true
  }
]

export default function ProductInfo({ product }: ProductInfo) {
  const router = useTransitionRouter()
  const productTranslation = useTranslations('Product')
  const { data: session } = useSession()
  const isAuthenticated = session?.user || false

  const { toast } = useToast()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)
  const [isAddToCartLoading, setIsAddToCartLoading] = useState(false)

  // Stores

  // Show current product variation from store
  const productVariation: ProductVariation | any = useProductViewStore(
    state => state.variation
  )

  const isProductNotAvailable =
    productVariation?.outOfStock || productVariation?.notDeliverable

  const productVariations: ProductVariation[] | any = useProductViewStore(
    state => state.variations
  )

  const setCurrentProductVariation: ProductVariation | any =
    useProductViewStore(state => state.setCurrentProductVariation)

  const {
    addOrUpdateProduct,
    buyNow: buyProduct,
    resetConsultationOrder,
    removeProduct
  } = useCheckoutStore(state => state)

  const { selectedAddress, products: cartProducts } = useCheckoutStore(
    state => state
  )

  const fetchAddresses = useDeliveryAddressStore(state => state.fetchAddresses)

  // Hooks Management ---------------------------------
  const [quantity, setQuantity] = useState(1)

  const [isInvalidVariationSelected, setInvalidVariationStatus] =
    useState(false)
  const [buyNowLoading, setBuyNowLoading] = useState(false)

  const [variationCategories] = useState(product?.variationCategories ?? [])
  const [variationCategoryValues] = useState(
    product?.variationCategoryValues ?? {}
  )

  // Initial Mapping for product view when loads
  const initialVariationMapping = variationCategories.reduce(
    (acc: any, v: string) => {
      const variations = variationCategoryValues[v] ?? []
      acc[v] = variations.length ? variations[0] : ''

      return acc
    },
    {}
  )

  const [variationMapping, setVariationMapping] = useState(
    initialVariationMapping
  )

  useEffect(() => {
    findProductVariation()
  }, [variationMapping])

  // -----------------------------------------------

  const handleAddToCart = async () => {
    if (isAdding) return

    setIsAdding(true)
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const qtyInCart = getProductCartQuantity()

    if (quantity + qtyInCart > productVariation?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${productVariation.maxOrderQuantity} quantity in cart.`
      })

      return
    }

    const res: any = await addOrUpdateProduct({
      ...productVariation,
      quantity,
      addressId: selectedAddress?._id
    })

    setIsAdding(false)
    handleTrackAddToCart(quantity)

    showProductStatusMessage(res)
  }

  const getProductCartQuantity = () => {
    const productInCart = cartProducts?.find(
      p => p._id === productVariation?._id
    )
    return productInCart ? productInCart.quantity : 0
  }

  const handleAddQuantity = () => {
    if (isAdding) return

    setIsAdding(true)

    const qtyInCart = getProductCartQuantity()
    const newQuantity = quantity + 1

    if (newQuantity + qtyInCart > productVariation?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${productVariation.maxOrderQuantity} quantity in cart.`
      })

      return
    }

    setQuantity(newQuantity)
    setIsAdding(false)
  }

  const handleBuyNow = async () => {
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    try {
      setBuyNowLoading(true)

      const res: any = await buyProduct({ ...productVariation, quantity })

      if (res?.notAvailable || res?.noEnoughQuantity) {
        showProductStatusMessage(res)
        return
      }
      resetConsultationOrder()

      fetchAddresses()

      router.push('/checkout/confirmation')
    } catch (e) {
      console.log(e)
    } finally {
      setBuyNowLoading(false)
    }
  }

  const showProductStatusMessage = (res: any) => {
    if (res?.notAvailable) {
      // toast({
      //   title: 'Product Not Available!',
      //   description:
      //     'Unfortunately, this product is currently unavailable in your selected location or out of stock. Please explore similar items or check back later for availability updates.'
      // })
      setIsDialogOpen(true)
    } else if (res?.noEnoughQuantity) {
      toast({
        title: 'Insufficient Quantity!',
        description:
          'The requested quantity for this product is currently unavailable. Please reduce the quantity or explore similar items. Thank you for understanding!'
      })
    } else {
      toast({
        title: 'Product Added to Cart',
        description:
          'Great! The product has been successfully added to your cart'
      })
    }
  }

  const handleVariationChange = (category: string, value: string) => {
    setVariationMapping((state: any) => {
      return { ...state, [category]: value }
    })
  }

  const findProductVariation = () => {
    // Function to compare variations
    const isMatchingVariation = (
      productVariation: any,
      searchVariation: any
    ) => {
      return Object.keys(searchVariation).every(
        (key: string) => productVariation[key] === searchVariation[key]
      )
    }

    // Find the product with the matching variation
    const foundVariation = productVariations.find(
      (pVariation: ProductVariation) =>
        isMatchingVariation(pVariation.variation, variationMapping)
    )

    if (!foundVariation) {
      setInvalidVariationStatus(true)
      return
    }

    setInvalidVariationStatus(false)
    setCurrentProductVariation(foundVariation)
  }

  const handleAddQuantityToCart = async (product: any) => {
    if (isAdding) return

    setIsAdding(true)
    const qtyInCart = product?.current?.quantity
    let newQuantity = qtyInCart + 1

    if (newQuantity > product?.current?.maxOrderQuantity) {
      toast({
        title: 'Maximum Order Quantity Reached',
        description: `You can add upto ${product?.current?.maxOrderQuantity} quantity in cart.`
      })

      return
    }

    if (newQuantity > product?.current?.maxOrderQuantity)
      newQuantity = product?.current?.maxOrderQuantity

    const resp: any = await addOrUpdateProduct({
      ...product?.current,
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
    setIsAdding(false)
  }

  const handleTrackAddToCart = (quantity = 1) => {
    trackProductAddedToCart({
      productName: productVariation?.title,
      productSku: productVariation?.sku,
      userId: session?.user?.id ?? '',
      category: (productVariation?.collections ?? [])
        ?.map((p: any) => p.name)
        .join(', '),
      price: productVariation?.finalPrice,
      quantity
    })
  }

  const handleTrackRemoveFromCart = () => {
    trackProductRemovedFromCart({
      productName: productVariation?.title,
      productSku: productVariation?.sku,
      userId: session?.user?.id ?? '',
      quantity: 1,
      category: (productVariation?.collections ?? [])
        ?.map((p: any) => p.name)
        .join(', ')
    })
  }

  return (
    <div>
      <div className='space-y-4'>
        <div className='flex w-full justify-between'>
          <h1 className='text-xl font-semibold'>
            <TranslationHandler
              word={productVariation?.title}
              translations={productVariation?.translations?.title}
            />
          </h1>

          <Popover>
            <PopoverTrigger>
              <div className='relative bottom-1 flex items-center justify-center rounded-full border border-[#A7A7A7] p-1'>
                <Image
                  height={24}
                  width={24}
                  alt=''
                  src={'/images/productShare.svg'}
                />
              </div>
            </PopoverTrigger>
            <PopoverContent className='w-fit'>
              <div className='flex gap-3'>
                <FacebookShareButton url={window.location.href}>
                  <FacebookIcon round size={24} />
                </FacebookShareButton>
                <TwitterShareButton url={window.location.href}>
                  <XIcon round size={24} />
                </TwitterShareButton>
                <LineShareButton url={window.location.href}>
                  <LinkedinIcon round size={24} />
                </LineShareButton>
                <WhatsappShareButton url={window.location.href}>
                  <WhatsappIcon round size={24} />
                </WhatsappShareButton>
                <EmailShareButton url={window.location.href}>
                  <EmailIcon round size={24} />
                </EmailShareButton>
              </div>
            </PopoverContent>
          </Popover>
        </div>
        <p className='line-clamp-1 text-xs leading-4 text-label'>
          <TranslationHandler
            word={productVariation?.description}
            translations={productVariation?.translations?.description}
          />
        </p>
        {/* Stock and Prescription */}
        <div className='flex items-center gap-4'>
          {productVariation?.prescriptionReq ? (
            <Badge
              className='hover:bg-transperant bg-red-400 bg-opacity-10 text-xs font-semibold text-primary dark:bg-red-300 dark:text-red-600'
              // variant={'outline'}
            >
              {productTranslation('prescription_needed')}
            </Badge>
          ) : null}

          {isProductNotAvailable ? (
            <div>
              <span className='flex items-center gap-1 text-sm font-semibold text-red-600'>
                {productVariation.outOfStock
                  ? productTranslation('out_of_stock')
                  : productTranslation(
                      'product_not_deliverable_to_this_location'
                    )}
              </span>
              {productVariation?.outOfStock && isAuthenticated && (
                <MedicineReminder
                  productId={productVariation._id}
                  productTitle={productVariation.title}
                  isOutOfStock={productVariation.outOfStock}
                />
              )}
            </div>
          ) : (
            <span className='flex items-center gap-1 text-sm'>
              <CheckCircle2Icon size={20} className='text-primary-green' />
              {productTranslation('in_stock')}
            </span>
          )}
        </div>
        {/* Product info */}
        <div className='grid grid-cols-2 gap-6 py-6'>
          {productInfo?.map((info, idx) => {
            if (!info.show) return <div key={idx}></div>
            if (
              (info.value === 'consumption' &&
                !productVariation[info.value]?.label) ||
              productVariation[info?.value]?.label === 'None'
            ) {
              return null
            }

            const gridClass =
              idx === 0 || idx === productInfo.length - 1 ? 'col-span-2' : ''

            return (
              <div key={idx} className={`flex items-center gap-4 ${gridClass}`}>
                <div
                  style={{
                    position: 'relative',
                    width: '40px',
                    height: '40px'
                  }}
                >
                  <Image
                    src={`/images/ProductDescription/${info.image}`}
                    alt={info?.title}
                    fill
                    priority={true}
                  />
                </div>
                <div className='flex-1 space-y-1 pr-2'>
                  <p className='text-sm font-semibold text-label'>
                    {info.title}
                  </p>
                  <p className='text-sm font-semibold'>
                    {['manufacturer', 'marketer'].includes(info.value)
                      ? 'Davaindia'
                      : info.value === 'country'
                        ? 'India'
                        : info.value === 'expiryDate'
                          ? productVariation[info.value]
                            ? dayjs(productVariation[info.value]).format(
                                process.env.DATE_FORMAT
                              )
                            : '--'
                          : info.value === 'consumption'
                            ? productVariation[info.value]?.label
                            : productVariation[info.value]}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
        <div className='space-y-1'>
          <div className='flex items-center gap-2'>
            <span className='flex items-center text-2xl font-semibold'>
              <IndianRupeeIcon size={20} />{' '}
              {Number(productVariation?.finalPrice).toFixed(2)}
            </span>

            {productVariation?.discount > 0 && (
              <span className='flex items-center text-xl text-label line-through'>
                <IndianRupeeIcon size={18} />{' '}
                {Number(productVariation?.maximumRetailPrice).toFixed(2)}
              </span>
            )}
            <span>
              {/* {discountPercentage !== 0 && (
                <div className='rounded-md bg-gradient-to-b px-1 py-0.5 text-xs font-semibold text-primary-teal'>
                  {Math.round(discountPercentage)}% OFF
                </div>
              )} */}
              {productVariation?.discount > 0 && (
                <div className='flex'>
                  <div className='flex items-center rounded-full bg-gradient-to-b from-[#AF004F] to-[#E30067] px-3 py-1 text-[10px] text-white'>
                    {productVariation?.discountType === 'flat'
                      ? `Flat ₹${Math.round(productVariation?.discount)}`
                      : `${Math.round(productVariation?.discount)}%`}{' '}
                    Off
                  </div>
                </div>
              )}
            </span>
          </div>
          <p className='text-xs text-label'>
            {productTranslation('inclusive_of_all_taxes')}
          </p>
          <p className='text-xs text-label'>
            {productTranslation('return_desc')}
            <span
              className='cursor-pointer px-1 font-medium text-primary'
              onClick={() =>
                router.push('/terms-and-conditions#ReturnAndRefundPolicy')
              }
            >
              {productTranslation('return_policy')}
            </span>
          </p>
        </div>
        {/* <div className='mb-2 flex items-center gap-1 rounded-md text-sm text-primary-teal'>
          <span className='flex items-center gap-1 font-semibold'>
            <IndianRupee size={14} />
            {Number(productVariation?.maximumRetailPrice).toFixed(2)}
          </span>
          with
          <div className='relative mb-1 h-6 w-10'>
            <Image
              src={'/images/membership/DavaONELogo.svg'}
              alt='Membership crown'
              className=''
              fill
            />
          </div>
        </div> */}
        {/* Quantity */}
        {!cartProducts?.some(p => p._id === product?.current?._id) && (
          <div>
            {!isProductNotAvailable && (
              <div className='py-3'>
                <p className='pb-3 text-sm font-semibold'>
                  {productTranslation('quantity')}
                </p>
                <div className='flex items-center'>
                  <div className='flex items-center rounded-md border'>
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                      onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                    >
                      <MinusIcon size={20} />
                    </Button>

                    <span className='border-l border-r px-4 font-medium'>
                      {quantity}
                    </span>
                    <Button
                      size={'icon'}
                      variant={'ghost'}
                      onClick={() => handleAddQuantity()}
                    >
                      <PlusIcon size={20} />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        {/* Variation Settings */}
        {variationCategories?.length > 0 && (
          <div className='pb-6'>
            <div className='flex flex-col gap-6'>
              {variationCategories?.map((c: string, idx: number) => {
                return (
                  <div key={idx}>
                    <div className='flex items-center gap-3 text-sm font-semibold'>
                      <h1 className='text-label dark:text-label-dark'>{c}:</h1>
                      <span>{variationMapping[c]}</span>
                    </div>

                    <div className='flex items-center gap-3 pt-3'>
                      {variationCategoryValues[c]?.map((v: string) => {
                        return (
                          <Badge
                            key={v}
                            onClick={() => handleVariationChange(c, v)}
                            className={`cursor-pointer border border-gray-300 py-1 text-sm font-medium text-default hover:bg-primary-green-dim ${variationMapping[c] === v ? 'bg-primary-green-dim font-semibold text-primary-green' : 'bg-gray-100'}`}
                          >
                            {v}
                          </Badge>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
        {isInvalidVariationSelected ? (
          <div className='pb-10 font-semibold text-red-400'>
            {productTranslation('product-unavailable_categories')}
          </div>
        ) : (
          <div>
            {!isProductNotAvailable && (
              <div className='flex items-center gap-6'>
                {cartProducts?.some(p => p._id === product?.current?._id) ? (
                  <div className='flex w-36 items-center rounded-md border border-primary dark:border-gray-600'>
                    <Button
                      variant='outline'
                      size='icon'
                      className='w-full border-none'
                      disabled={isRemoving || getProductCartQuantity() <= 1}
                      onClick={async e => {
                        e.preventDefault()
                        e.stopPropagation()
                        if (isRemoving || getProductCartQuantity() <= 1) return
                        setIsRemoving(true)
                        if (getProductCartQuantity() == 1) {
                          await removeProduct(product?._id)
                          handleTrackRemoveFromCart()
                        } else {
                          await addOrUpdateProduct({
                            ...product.current,
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
                      {cartProducts.find(p => p._id === product?.current?._id)
                        ?.quantity || 1}
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
                        await handleAddQuantityToCart(product)
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
                  <div className='w-1/2 md:w-1/3'>
                    <Button
                      className='flex w-full items-center gap-2'
                      variant={'outline'}
                      disabled={isAddToCartLoading}
                      onClick={async () => {
                        if (isAddToCartLoading) return
                        setIsAddToCartLoading(true)
                        await handleAddToCart()
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
                          <span>{cartIcon}</span>
                          {productTranslation('add_to_cart')}
                        </>
                      )}
                    </Button>
                  </div>
                )}
                {!cartProducts?.some(p => p._id === product?.current?._id) && (
                  <Button
                    className='w-1/2 md:w-1/3'
                    onClick={() => handleBuyNow()}
                    disabled={buyNowLoading}
                  >
                    {productTranslation('buy_now')}
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
        {/* {!isProductNotAvailable && ( */}
      </div>
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
    </div>
  )
}
