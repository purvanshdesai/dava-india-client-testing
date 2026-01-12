'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'

import ProductCard from '../Products/ProductCard'
import { useEffect, useState } from 'react'
import { useFetchProducts } from '@/utils/hooks/productHooks'
import { useSession } from 'next-auth/react'

export default function LastMinuteBuy() {
  const session = useSession() as any
  const [products, setProducts] = useState([])

  const { data: productsData } = useFetchProducts({
    cartSimilarProducts: true,
    userId: session?.data?.user?.id
  })
  useEffect(() => {
    setProducts(productsData?.data ?? [])
  }, [productsData?.data])

  if (!products?.length) return <></>

  return (
    <div className='relative rounded-lg bg-white p-4 md:p-6'>
      {/* Content Layer */}
      <div className='relative'>
        <Carousel opts={{ slidesToScroll: 'auto' }}>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-semibold capitalize'>Last Minute Buy</p>
          </div>
          <div className='relative'>
            <CarouselPrevious
              variant={'outline2'}
              className='absolute -left-2 top-44 z-10 hover:text-black'
            />
            <CarouselContent className=''>
              {products &&
                products.map((product: any, index: number) => (
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
