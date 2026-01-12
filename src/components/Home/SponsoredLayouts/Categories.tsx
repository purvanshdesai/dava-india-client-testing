// import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTransitionRouter } from 'next-view-transitions'
import TranslationHandler from '@/components/utils/TranslationHandler'
import {
  Carousel,
  CarouselContent,
  CarouselNext,
  CarouselPrevious,
  CarouselItem
} from '@/components/ui/carousel'
import { fetchCollectionNavigationPath } from '@/utils/actions/navigationActions'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'

export default function CollectionLayout({ layout }: any) {
  // const homepage = useTranslations('HomePagePopularCategories')
  const router = useTransitionRouter()
  const [collections, setCollections] = useState<Array<any>>([])

  useEffect(() => {
    setCollections(layout?.collections ?? [])
  }, [layout])

  const onClickCategory = async (item: any) => {
    // Fetch collection info navigation
    const path = await fetchCollectionNavigationPath(item?._id)
    router.push(`/categories/${path.join('/')}`)
  }

  if (!collections?.length) return <></>

  return (
    <div className='rounded-lg bg-white p-4 dark:bg-gray-900 md:p-6'>
      <Carousel opts={{ slidesToScroll: 'auto' }}>
        <div>
          <p className='text-xl font-semibold capitalize'>
            <TranslationHandler
              word={layout?.title}
              translations={layout?.translations?.title}
            />
          </p>
        </div>
        <div className='relative mt-4 px-12 pr-14'>
          <CarouselPrevious
            className='absolute -left-1 top-16 z-10 hover:bg-primary'
            variant={'outline2'}
          />
          <CarouselContent className='flex gap-6 p-2 pt-4'>
            {collections?.map((item, idx) => (
              <TooltipProvider key={idx}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <CarouselItem
                      key={idx}
                      className='fade-in-up animate-delay-100 relative flex basis-1/3 items-center justify-center opacity-0 sm:basis-1/4 md:basis-[120px]'
                      style={{ animationDelay: `${idx * 50}ms` }}
                    >
                      <div
                        className='flex flex-col items-center gap-1'
                        key={idx}
                      >
                        <div
                          onClick={() => onClickCategory(item)}
                          key={idx}
                          className='relative h-28 w-28 cursor-pointer overflow-hidden rounded-lg border border-gray-100 shadow-lg duration-300 hover:scale-105'
                        >
                          <Image
                            key={item?.image}
                            src={item?.image}
                            alt={item?.name}
                            fill
                            objectFit='contain'
                            loading='lazy'
                            placeholder='blur'
                            blurDataURL={'/images/blured.png'}
                          />
                        </div>

                        <div className='line-clamp-1 pt-2 text-center text-sm font-medium capitalize'>
                          <TranslationHandler
                            word={item.name}
                            translations={item?.translations?.name}
                          />
                        </div>
                      </div>
                    </CarouselItem>
                  </TooltipTrigger>
                  <TooltipContent className='absolute z-50 bg-primary-light-blue shadow-md'>
                    <TranslationHandler
                      word={item.name}
                      translations={item?.translations?.name}
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            ))}
          </CarouselContent>
          <CarouselNext
            className='absolute right-0 top-16 z-10 hover:bg-primary'
            variant={'outline2'}
          />
        </div>
      </Carousel>
    </div>
  )
}
