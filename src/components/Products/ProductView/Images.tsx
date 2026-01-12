'use client'
import * as React from 'react'
import Image from 'next/image'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi
} from '@/components/ui/carousel'

import { useState } from 'react'
import useProductViewStore from '@/store/useProductViewStore'
import { ProductVariation } from '../../../../types/storeTypes'
import ImgMagnifier from '@/components/utils/imgMagnifier'

interface ProductImages {
  product: any
}

export default function ProductImages() {
  const [api, setApi] = React.useState<CarouselApi>()
  const [, setCurrent] = React.useState(0)
  const [imageUrl, setImageUrl] = useState<string>('')

  const productVariation: ProductVariation | any = useProductViewStore(
    state => state.variation
  )

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  React.useEffect(() => {
    if (productVariation?.images?.length) {
      setImageUrl(productVariation?.images[0]?.objectUrl)
    }
    // TODO - Set empty state image
  }, [productVariation])

  if (!productVariation)
    return <div className='text-sm'>Error Loading product!</div>

  return (
    <div className='relative grid grid-cols-[120px_1fr] gap-4'>
      <div className='relative'>
        <Carousel
          setApi={setApi}
          orientation={'vertical'}
          opts={{
            align: 'start'
          }}
          className='h-[500px]'
        >
          <CarouselContent className='my-8 h-[500px]'>
            {[...productVariation?.images].map((image: any, index: number) => {
              return (
                <CarouselItem
                  key={index}
                  className='relative flex basis-1/4 items-center justify-center pb-3 pt-0'
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '50%'
                    }}
                    className={`cursor-pointer overflow-hidden rounded-md ${image?.objectUrl === imageUrl ? 'border border-primary' : ''}`}
                    onClick={() => {
                      setImageUrl(image?.objectUrl)
                      setCurrent(index)
                    }}
                  >
                    <Image
                      src={image?.objectUrl}
                      alt='Carousel Image'
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
                </CarouselItem>
              )
            })}
          </CarouselContent>
          {productVariation && productVariation?.images.length > 1 ? (
            <div>
              <CarouselPrevious className='z-7 absolute -top-4 left-0 right-0 mx-auto rotate-90 transform' />
              <CarouselNext className='z-7 absolute -bottom-4 left-0 right-0 mx-auto rotate-90 transform' />
            </div>
          ) : null}
        </Carousel>
      </div>

      <div className='relative'>
        <div
          style={{ position: 'relative', width: '100%', height: '500px' }}
          className='cursor-crosshair rounded-md'
        >
          {/* <Image
            src={imageUrl}
            alt='Product Image'
            fill
            loading={'lazy'}
            style={{ objectFit: 'contain' }}
          /> */}
          <ImgMagnifier
            src={imageUrl}
            width={'100%'}
            height={'100%'}
            magnifierHeight={400}
            magnifierWidth={400}
            zoomLevel={2}
            className={'h-full w-full object-contain'}
            alt='Sample Image'
          />
        </div>
      </div>
    </div>
  )
}
