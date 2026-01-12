'use client'
import React, { useEffect, useRef } from 'react'
import ProductImages from './Images'
import ProductInfo from './Info'
import { useFetchProductsById } from '@/utils/hooks/productHooks'
import { useParams, useRouter } from 'next/navigation'
import useProductViewStore from '@/store/useProductViewStore'
import ProductDescription from './Description'
import SimilarProducts from './SimilarProducts'
import useCheckoutStore from '@/store/useCheckoutStore'
import ProductInnerViewLoader from '@/components/Loader/ProductInnerViewLoader'
import InnerPincode from './InnerPincode'
// import InnerDavaCard from './InnerDavaCard'
import { useTranslations } from 'next-intl'
import DownloadAppSection from './DownloadApp'
import { trackProductViewed } from '@/analytics/trackers/productTracker'
import { useSession } from 'next-auth/react'

export default function ProductView() {
  const routeParams: { productId: string } = useParams()
  const setProductView = useProductViewStore(state => state.setProductView)
  const { currentLocation, selectedAddress } = useCheckoutStore(state => state)
  const router = useRouter()
  const homepage = useTranslations('HomePage')
  const hasTrackedRef = useRef(false)
  const { data: session } = useSession()

  const {
    data: product,
    isLoading,
    isError
  } = useFetchProductsById(
    routeParams?.productId,
    selectedAddress?._id,
    currentLocation?.zipCode
  )

  useEffect(() => {
    if (!product || hasTrackedRef.current) return

    const prod = product?.current

    trackProductViewed({
      productName: prod?.title,
      productSku: prod?.sku,
      userId: session?.user?.id ?? '',
      category: (prod?.collections ?? [])?.map((p: any) => p.name).join(', '),
      stockStatus: prod?.outOfStock ? 'Not Available' : 'Available',
      price: prod?.finalPrice,
      deviceType: 'web'
    })

    hasTrackedRef.current = true
  }, [product])

  if (isError)
    return (
      <div className='p-4 text-center md:p-6'>Error while loading product!</div>
    )

  setProductView(product ?? [])

  return (
    <>
      {isLoading ? (
        <div>
          <ProductInnerViewLoader />
        </div>
      ) : (
        <div className='relative flex flex-col justify-center p-4 md:p-6'>
          <span
            className='flex cursor-pointer items-center gap-1 pb-4 text-sm'
            onClick={() => router.push('/')}
          >
            {homepage('home_button')} /
            <span className='text-primary'>
              {product?.variations[0]?.title}
            </span>
          </span>
          <div className='rounded-md bg-white p-4 dark:bg-gray-900 md:p-6'>
            <div className='grid gap-6 md:grid-cols-2 md:gap-8'>
              <ProductImages />

              <div>
                <ProductInfo product={product} />
              </div>
              <div>{/* <InnerDavaCard /> */}</div>
              <div>
                <InnerPincode />
              </div>
            </div>
          </div>
          <div className='my-4'>
            <SimilarProducts />
          </div>

          <div>
            <ProductDescription product={product} />
          </div>
          <div className='my-4'>
            <DownloadAppSection />
          </div>
        </div>
      )}
    </>
  )
}
