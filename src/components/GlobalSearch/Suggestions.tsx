'use client'
import React, { useEffect, useState } from 'react'
import {
  SearchIcon,
  XIcon,
  IndianRupeeIcon,
  ShoppingCartIcon,
  MinusIcon,
  PlusIcon
} from 'lucide-react'
import useCommonStore from '@/store/useCommonStore'
import { useDebouncedValue } from '@/hooks/useDebounce'
import Image from 'next/image'
import { useFetchSearchSuggestions } from '@/utils/hooks/searchHooks'
import { Skeleton } from '../ui/skeleton'
import { useTransitionRouter } from 'next-view-transitions'
import useCheckoutStore from '@/store/useCheckoutStore'
import { useTranslations } from 'next-intl'
import { useElementOnScreen } from '@/hooks/useElementOnScreen'
import { useSession } from 'next-auth/react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle
} from '@/components/ui/dialog'
import { AddressNotDeliverableIcon } from '../utils/icons'
import {
  trackProductAddedToCart,
  trackProductRemovedFromCart
} from '@/analytics/trackers/productTracker'
import { trackSearchPerformed } from '@/analytics/trackers/appEventTracker'
import MedicineRequestCard from '@/components/GlobalSearch/MedicineRequest'

export default function ProductSearch() {
  const router = useTransitionRouter()
  const { data: session } = useSession()
  const { toast } = useToast()

  const [searchText, setSearchText] = useState<string>('')
  const [containerRef, isVisible] = useElementOnScreen() as any

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isAdding, setIsAdding] = useState(false)

  const setAppBarSearchStatus = useCommonStore(
    state => state.setAppBarSearchStatus
  )
  const addOrUpdateProduct = useCheckoutStore(state => state.addOrUpdateProduct)
  const { products: cartProducts, removeProduct } = useCheckoutStore(
    state => state
  )
  const global = useTranslations('GlobalSearch')
  const commonTranslation = useTranslations('Common')

  const { debouncedValue: debouncedSearchText, isDebouncing } =
    useDebouncedValue(searchText, 1000)

  useEffect(() => {
    setAppBarSearchStatus(!isVisible)
  }, [isVisible])

  const { data: searchResult, isLoading } =
    useFetchSearchSuggestions(debouncedSearchText)

  const isAuthenticated = session?.user || false

  const isSearchResultEmpty =
    searchText &&
    !isDebouncing &&
    !isLoading &&
    !searchResult?.products?.length &&
    !searchResult?.compositions?.length &&
    !searchResult?.suggestions?.length

  const isSearchCompositionsEmpty = !searchResult?.compositions?.length

  useEffect(() => {
    if (!debouncedSearchText) return

    trackSearchPerformed({
      userId: session?.user?.id ?? '',
      searchTerm: debouncedSearchText,
      noOfResults: searchResult?.products?.length
    })
  }, [debouncedSearchText])

  const handleAddToCart = async (product: any) => {
    if (isAdding) return

    setIsAdding(true)
    if (!isAuthenticated) {
      router.push('/login')
      return
    }

    const res: any = await addOrUpdateProduct({ ...product, quantity: 1 })

    if (res?.qtyLimitReached) {
      toast({
        title: 'Quantity Limit Reached!',
        description: 'You can add upto 10 quantity per product'
      })
    } else if (res?.notAvailable) {
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
    } else if (res?.outOfStock) {
      toast({
        title: 'Out of Stock',
        description:
          'The requested product is currently out of stock. Please explore similar items or check back later for availability updates!'
      })
    } else {
      toast({
        title: 'Product Added to Cart',
        description:
          'Great! The product has been successfully added to your cart'
      })
      handleTrackAddToCart(product)
    }
    setIsAdding(false)
  }
  const getProductCartQuantity = (product: any) => {
    const productInCart = cartProducts?.find(p => p._id === product?._id)
    return productInCart ? productInCart.quantity : 0
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
    }
    setIsAdding(false)
  }

  const handleTrackAddToCart = (product: any) => {
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

  const handleTrackRemoveFromCart = (product: any) => {
    trackProductRemovedFromCart({
      productName: product?.title,
      productSku: product?.sku,
      userId: session?.user?.id ?? '',
      quantity: 1,
      category: (product?.collections ?? [])?.map((p: any) => p.name).join(', ')
    })
  }

  const ProductList = (products: Array<any>) => {
    return (
      <div>
        {products?.map((product: any, idx: number) => {
          return (
            <div className='w-full' key={idx}>
              <div className='relative grid grid-cols-[80px_1fr] gap-4'>
                <div
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px'
                  }}
                  className='cursor-pointer overflow-hidden rounded-md'
                  onClick={() => router.push(`/products/${product?.slugUrl}`)}
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
                  <div className='space-y-2'>
                    <div
                      className='w-full cursor-pointer space-y-2'
                      onClick={() =>
                        router.push(`/products/${product?.slugUrl}`)
                      }
                    >
                      <div className='group flex items-center justify-between gap-3'>
                        <h1 className='line-clamp-1 text-sm font-semibold'>
                          {product?.title}
                        </h1>

                        <div className='flex items-center gap-3'>
                          <div className='flex items-center text-sm font-semibold'>
                            <IndianRupeeIcon size={14} />
                            {Number(product?.finalPrice).toFixed(2)}
                          </div>
                        </div>
                      </div>

                      <p className='line-clamp-1 break-all text-xs text-label'>
                        {product?.description}
                      </p>
                    </div>

                    <div className='flex items-center justify-between'>
                      <p className='line-clamp-1 flex-1 text-xs text-label'>
                        Composition:&nbsp;
                        {Array.isArray(product?.compositions)
                          ? product?.compositions?.join(', ')
                          : product?.compositions}
                      </p>

                      {cartProducts?.some(p => p._id === product._id) ? (
                        <div className='flex w-36 items-center rounded-md border border-primary dark:border-gray-600'>
                          <Button
                            variant='outline'
                            size='icon'
                            className='w-full border-none'
                            onClick={e => {
                              e.preventDefault()
                              e.stopPropagation()
                              if (getProductCartQuantity(product) == 1) {
                                removeProduct(product?._id)
                                handleTrackRemoveFromCart(product)
                              } else {
                                addOrUpdateProduct({
                                  ...product,
                                  quantity: -1
                                })
                              }
                            }}
                          >
                            <MinusIcon size={16} className='text-primary' />
                          </Button>
                          <span className='flex w-full items-center justify-center border-x border-primary px-3 text-sm font-bold text-primary dark:border-slate-400'>
                            {getProductCartQuantity(product)}
                          </span>
                          <Button
                            variant='outline'
                            size='icon'
                            className='w-full border-none'
                            onClick={async e => {
                              e.preventDefault()
                              e.stopPropagation()
                              await handleAddQuantity(product)
                            }}
                          >
                            <PlusIcon size={16} className='text-primary' />
                          </Button>
                        </div>
                      ) : (
                        <div
                          onClick={() => handleAddToCart(product)}
                          className='flex cursor-pointer items-center gap-1 text-sm font-medium text-primary'
                        >
                          <ShoppingCartIcon size={16} />
                          <span>Add to Cart</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div className='my-3 border-b'></div>
            </div>
          )
        })}

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

  return (
    <div>
      <div
        className='flex h-32 w-full items-center justify-center bg-[#3A525B]'
        ref={containerRef}
      >
        <div className='flex w-[90%] items-center gap-3 md:w-1/2'>
          <div className='fade-in-up animate-delay-100 flex w-full items-center rounded-full border bg-gray-100 px-3 py-1.5 dark:border-gray-600 dark:bg-gray-700'>
            <div className='rounded-full bg-primary p-1.5 text-white'>
              <SearchIcon size={18} />
            </div>
            <input
              value={searchText}
              autoFocus
              onChange={e => setSearchText(e.target.value)}
              onKeyDown={event => {
                if (event.key === 'Enter' && searchText) {
                  router.push('/search/all?search=' + searchText)
                }
              }}
              type='text'
              placeholder={global('global_search_placeholder')}
              className='w-full bg-gray-100 pl-3 text-lg outline-none placeholder:text-sm dark:bg-gray-700'
            />
          </div>

          {searchText && (
            <div>
              <XIcon
                size={34}
                onClick={() => {
                  setSearchText('')
                  router.back()
                }}
                className='cursor-pointer text-white'
              />
            </div>
          )}
        </div>
      </div>

      {isLoading && (
        <div className='mt-2 flex justify-center p-4 md:p-6'>
          <div className='h-full max-h-96 w-full space-y-2 overflow-hidden md:w-[80%]'>
            {Array(5)
              .fill((i: number) => i + 1)
              .map((_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    className='h-20 w-full rounded-lg bg-slate-300'
                  />
                )
              })}
          </div>
        </div>
      )}

      {!isLoading &&
        (searchResult?.products?.length > 0 ||
          searchResult?.compositions?.length > 0) && (
          <div className='mt-2 flex justify-center p-4 md:p-6'>
            <div className='w-full md:w-[80%]'>
              <div className='rounded-t-lg bg-gray-200 px-6 py-4 text-sm'>
                <p>
                  {global('search_for')}{' '}
                  <strong className='italic'>{searchText}</strong>
                </p>
              </div>

              <div
                className={`grid grid-cols-1 divide-x bg-white ${isSearchCompositionsEmpty ? 'md:grid-cols-[1fr]' : 'md:grid-cols-[3fr_2fr]'}`}
              >
                <div className='divide-y'>
                  <div className='flex items-center justify-between p-2 text-sm font-semibold md:p-4'>
                    <p>{global('suggested_generic_products')}</p>
                    <span
                      className='cursor-pointer font-semibold text-primary'
                      onClick={() =>
                        router.push('/search/all?search=' + searchText)
                      }
                    >
                      {commonTranslation('view_all')}
                    </span>
                  </div>

                  <div className='p-2 md:p-4'>
                    {ProductList(searchResult?.products)}
                  </div>
                </div>

                {!isSearchCompositionsEmpty && (
                  <div className=''>
                    <div className='flex items-center justify-between border-b p-2 text-sm font-semibold md:p-4'>
                      <p>{global('suggested_compositions')}</p>
                      <span
                        className='cursor-pointer font-semibold text-primary'
                        onClick={() =>
                          router.push('/search/all?search=' + searchText)
                        }
                      >
                        {commonTranslation('view_all')}
                      </span>
                    </div>

                    <div className='space-y-4 px-4 py-3 md:px-6'>
                      {searchResult?.compositions?.map(
                        (c: any, idx: number) => {
                          return (
                            <div key={idx}>
                              <p
                                onClick={() =>
                                  router.push('/search/all?search=' + c)
                                }
                                className='cursor-pointer text-sm font-semibold hover:font-bold hover:text-primary'
                              >
                                {c}
                              </p>
                            </div>
                          )
                        }
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      {!isLoading &&
        !searchResult?.products?.length &&
        searchResult?.suggestions?.length > 0 && (
          <div className='mt-2 flex justify-center p-4 md:p-6'>
            <div className='w-full bg-white md:w-[80%]'>
              <div className='flex items-center justify-between border-b p-2 text-sm font-semibold md:p-4'>
                <p>Did you mean?</p>
                <span
                  className='cursor-pointer font-semibold text-primary'
                  onClick={() =>
                    router.push('/search/all?search=' + searchText)
                  }
                >
                  {commonTranslation('view_all')}
                </span>
              </div>

              <div className='p-2 md:p-4'>
                {ProductList(searchResult?.suggestions)}
              </div>
            </div>
          </div>
        )}

      {/* {isSearchResultEmpty && (
        <div className='flex flex-col items-center justify-center gap-6 py-10'>
          <div
            style={{ position: 'relative', width: '100px', height: '100px' }}
          >
            <Image
              src={`/images/NoData.svg`}
              alt='Footer Logo'
              fill
              priority={false}
            />
          </div>
          <div className='text-sm font-medium'>
            {global('search_no_result')}
          </div>
        </div>
      )} */}

      {isSearchResultEmpty && (
        <div className='flex w-full flex-col items-center justify-center gap-6 py-10'>
          <MedicineRequestCard medicineName={searchText} />
        </div>
      )}
    </div>
  )
}
