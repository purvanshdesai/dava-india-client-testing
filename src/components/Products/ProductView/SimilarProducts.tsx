'use client'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from '@/components/ui/carousel'
import ProductCard from '../ProductCard'
// import { useTranslations } from 'next-intl'
import useProductViewStore from '@/store/useProductViewStore'
import { ProductVariation } from '../../../../types/storeTypes'

export default function SimilarProducts() {
  // Show current product variation from store
  const productVariation: ProductVariation | any = useProductViewStore(
    state => state.variation
  )

  const associatedProducts = productVariation?.associatedProducts ?? []

  // const commonTranslation = useTranslations('Common')

  if (!associatedProducts.length) return <></>

  return (
    <div
      className='w-full rounded-lg'
      // style={{
      //   background:
      //     'linear-gradient(to right, #FDDABA, #ADD8E5, #FFF4CD, #FFC1CB)'
      //   // margin: '16px',
      //   // padding: '16px',
      //   // borderRadius: '16px'
      // }}
    >
      {/* Content Layer */}

      <div className='z-10'>
        <Carousel opts={{ slidesToScroll: 'auto' }}>
          <div className='flex items-center justify-between'>
            <p className='text-xl font-semibold'>Similar Products</p>

            <div className='flex items-center gap-6'>
              {/* <div className='cursor-pointer text-sm font-medium underline'>
                <Link href={'/products'}>view all</Link>
              </div> */}
              {/* <div className='flex items-center gap-3'>
              
             
              </div> */}
            </div>
          </div>
          <div className='relative'>
            <CarouselPrevious className='absolute -left-2 top-44 z-10 hover:text-black' />
            <CarouselContent className='gap-0'>
              {associatedProducts &&
                associatedProducts.map((product: any, index: number) => (
                  <CarouselItem
                    key={index}
                    className='fade-in-up animate-delay-100 relative my-6 flex basis-1/2 items-center justify-center px-2 opacity-0 sm:basis-1/3 md:basis-3/12 lg:basis-1/5 xl:basis-2/12'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className='w-full'>
                      <ProductCard index={index} product={product} />
                    </div>
                  </CarouselItem>
                ))}
            </CarouselContent>
            <CarouselNext className='absolute -right-2 top-44 z-10 hover:text-black' />
          </div>
        </Carousel>
      </div>
    </div>
  )
}
