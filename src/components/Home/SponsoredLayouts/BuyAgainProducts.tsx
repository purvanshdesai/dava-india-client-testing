'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import ProductCard from '../../Products/ProductCard'
import { useTranslations } from 'next-intl'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import useUserDetailsStore from '@/store/useUserDetailsStore'

export default function ProductsLayout() {
  const router = useRouter()
  const session = useSession() as any
  const isLoggedIn = session.status === 'authenticated'

  const commonTranslation = useTranslations('Common')

  const { fetchProductsBought, productsBought } = useUserDetailsStore(
    state => state
  )

  useEffect(() => {
    if (isLoggedIn) fetchProductsBought()
  }, [session, isLoggedIn])

  const onClickViewAll = async () => {
    // Fetch collection info navigation
    router.push(`/me/orders`)
  }

  if (!productsBought?.length) return <></>

  return (
    <div className='relative rounded-lg bg-white p-4 md:p-6'>
      <div
        className='absolute left-0 top-0 h-full w-full rounded-lg'
        style={{
          backgroundImage: 'none',
          backgroundColor: '#FFFFFF',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />

      {/* Content Layer */}
      <div className='relative'>
        <Carousel opts={{ slidesToScroll: 'auto' }}>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-semibold capitalize'>Buy Again</p>

            <div className='flex items-center gap-6'>
              <div
                className='cursor-pointer text-sm font-medium underline'
                onClick={() => onClickViewAll()}
              >
                {commonTranslation('view_all')}
              </div>
              <div className='flex items-center gap-3'></div>
            </div>
          </div>
          <div className='relative'>
            <CarouselPrevious
              variant={'outline2'}
              className='absolute -left-2 top-44 z-10 hover:text-black'
            />
            <CarouselContent className=''>
              {productsBought &&
                productsBought.map((product: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className='fade-in-up animate-delay-100 relative mt-3 flex basis-2/3 items-center justify-center opacity-0 sm:basis-1/3 md:basis-3/12 lg:basis-2/12'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='h-full w-full p-2'>
                      <ProductCard index={index} product={product} />
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext
              variant={'outline2'}
              className='absolute -right-2 top-44 z-10 hover:text-black'
            />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
