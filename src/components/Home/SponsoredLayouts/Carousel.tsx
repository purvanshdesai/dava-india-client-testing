'use client'
import * as React from 'react'
import Autoplay from 'embla-carousel-autoplay'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  // CarouselNext,
  // CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'
import { DotButton, useDotButton } from '@/components/ui/carousel-dots'
import { fetchCollectionNavigationPath } from '@/utils/actions/navigationActions'
import { useRouter } from 'next/navigation'

export default function CarouselLayout({ layout }: any) {
  const router = useRouter()
  const [api, setApi] = React.useState<CarouselApi>()
  const [images, setImages] = React.useState<Array<any>>([])

  React.useEffect(() => {
    if (layout?.banners) {
      const images = layout?.banners.map((b: any) => {
        return {
          ...b?.device?.desktop,
          properties: b.properties,
          title: b?.title
        }
      })

      setImages(images ?? [])
    }
  }, [layout])

  const autoScrollEnabled = layout?.properties?.autoScroll ?? false
  const scrollTime = layout?.properties?.scrollTime
    ? layout?.properties?.scrollTime * 2000
    : 1500

  const plugin = React.useRef(
    Autoplay({ delay: scrollTime, stopOnInteraction: true })
  )

  const plugins = autoScrollEnabled ? [plugin.current] : []

  const { selectedIndex, scrollSnaps, onDotButtonClick } = useDotButton(api)

  const handleClickBanner = async (banner: any) => {
    try {
      const { redirectType, redirectUrl, collection } = banner?.properties

      if (redirectType === 'none') return

      if (redirectType === 'externalLink') {
        window.open(redirectUrl, '_blank')
      } else if (redirectType === 'collection') {
        // Fetch collection info navigation
        const path = await fetchCollectionNavigationPath(collection)
        router.push(`/categories/${path.join('/')}`)
      }
    } catch (e) {
      console.log(e)
    }
  }

  if (!images?.length) return <></>

  return (
    <div className='relative'>
      <Carousel
        setApi={setApi}
        opts={{
          loop: true
        }}
        plugins={plugins}
        onMouseEnter={autoScrollEnabled ? () => plugin.current.stop : undefined}
        onMouseLeave={autoScrollEnabled ? () => plugin.current.play : undefined}
        className='cursor-pointer'
      >
        <CarouselContent className='w-full px-0'>
          {images?.map((banner, index) => (
            <CarouselItem
              key={`carousel-item-${index}`}
              className={`relative flex w-full items-center justify-center px-0`}
            >
              <div className='w-full'>
                <Card className={`px-0`}>
                  <CardContent
                    className={`${banner?.properties?.redirectType === 'none' ? 'cursor-default' : 'cursor-pointer'} relative p-0`}
                    style={{ width: '100%' }}
                    onClick={() => handleClickBanner(banner)}
                  >
                    <Image
                      key={banner?.imageUrl}
                      src={`${banner?.imageUrl}`}
                      alt={banner?.title}
                      width={1680} // Set width of the original image
                      height={320}
                      priority
                      layout='responsive' // Makes the image responsive
                    />
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* {images?.length > 1 && (
          <div>
            <CarouselPrevious className='absolute left-[2rem] top-1/2 -translate-y-1/2 transform hover:text-black' />
            <CarouselNext className='absolute right-[2rem] top-1/2 -translate-y-1/2 transform hover:text-black' />
          </div>
        )} */}

        <div className='absolute bottom-6 left-1/2 right-1/2 flex items-center justify-center gap-2 duration-300'>
          {scrollSnaps.map((_, index) => (
            <DotButton
              key={index}
              onClick={() => onDotButtonClick(index)}
              className={`${index === selectedIndex ? 'bg-white px-3.5' : 'bg-primary-light-blue px-1'} rounded-md py-1`}
            ></DotButton>
          ))}
        </div>
      </Carousel>
    </div>
  )
}
