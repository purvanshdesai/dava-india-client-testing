'use client'
import React, {
  ComponentPropsWithRef,
  useCallback,
  useEffect,
  useState
} from 'react'
import { type CarouselApi } from './carousel'

type UseDotButtonType = {
  selectedIndex: number
  scrollSnaps: number[]
  onDotButtonClick: (index: number) => void
}

export const useDotButton = (
  carouselApi: CarouselApi | undefined
): UseDotButtonType => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const onDotButtonClick = useCallback(
    (index: number) => {
      if (!carouselApi) return
      carouselApi.scrollTo(index)
    },
    [carouselApi]
  )

  const onInit = useCallback((carouselApi: CarouselApi | any) => {
    setScrollSnaps(carouselApi.scrollSnapList())
  }, [])

  const onSelect = useCallback((carouselApi: CarouselApi | any) => {
    setSelectedIndex(carouselApi.selectedScrollSnap())
  }, [])

  useEffect(() => {
    if (!carouselApi) return

    onInit(carouselApi)
    onSelect(carouselApi)
    carouselApi
      .on('reInit', onInit)
      .on('reInit', onSelect)
      .on('select', onSelect)
  }, [carouselApi, onInit, onSelect])

  return {
    selectedIndex,
    scrollSnaps,
    onDotButtonClick
  }
}

type PropType = ComponentPropsWithRef<'button'>

export const DotButton: React.FC<PropType> = props => {
  const { children, ...restProps } = props

  return (
    <button className='bg-primary' type='button' {...restProps}>
      {children}
    </button>
  )
}
