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
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import TranslationHandler from '@/components/utils/TranslationHandler'
import { fetchCollectionNavigationPath } from '@/utils/actions/navigationActions'

export default function ProductsLayout({ layout }: { layout: any }) {
  const router = useRouter()
  const [products, setProducts] = useState([])
  const commonTranslation = useTranslations('Common')

  useEffect(() => {
    // REMOVE-TODO
    const productsList = layout?.products ?? []
    setProducts(productsList)
  }, [layout])

  // const stringToSlug = (str: string = '') => {
  //   return str
  //     .trim() // Remove leading and trailing spaces
  //     .replace(/\s+/g, '-') // Replace spaces with hyphens
  //     .toLowerCase() // Convert to lowercase
  // }

  const onClickViewAll = async () => {
    // Fetch collection info navigation
    const path = await fetchCollectionNavigationPath(layout?.collection?._id)
    router.push(`/categories/${path[0]}`)
  }
  const getBackgroundImage = (theme: string | undefined) => {
    switch (theme) {
      case 'theme-mariegold':
        return '/images/Mariegold.svg'
      case 'theme-rose':
        return '/images/Rose.svg'
      case 'theme-lavender':
        return '/images/Lavender.svg'
      default:
        return null
    }
  }

  if (!products?.length) return <></>

  return (
    <div className='relative rounded-lg bg-white p-4 md:p-6'>
      <div
        className='absolute left-0 top-0 h-full w-full rounded-lg'
        style={{
          backgroundImage: layout?.properties?.theme
            ? `url(${getBackgroundImage(layout?.properties?.theme)})`
            : 'none',
          backgroundColor: layout?.properties?.theme
            ? 'transparent'
            : '#FFFFFF',
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
            <p className='text-xl font-semibold capitalize'>
              <TranslationHandler
                word={layout?.title}
                translations={layout?.translations?.title}
              />
            </p>

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
