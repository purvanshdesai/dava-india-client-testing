'use client'
import React, { FC, useMemo, Suspense } from 'react'
import { useFetchSponsoredSettings } from '@/utils/hooks/sponsoredHooks'

// Eager loaders (fast fallbacks)
import CarouselLoader from '../Loader/CarouselLoader'
import FullBannerLoader from '../Loader/FullBannerLoader'
import ProductLoader from '../Loader/ProductsLoader'
import CategoriesLoader from '../Loader/CategoriesLoader'

// Lazy-loaded layout components
const CarouselLayout = React.lazy(() => import('./SponsoredLayouts/Carousel'))
const FullBanner = React.lazy(() => import('./SponsoredLayouts/FullBanner'))
const ProductsLayout = React.lazy(() => import('./SponsoredLayouts/Products'))
const CollectionLayout = React.lazy(
  () => import('./SponsoredLayouts/Categories')
)
const GenericAbout = React.lazy(() => import('@/components/Home/GenericAbout'))
const DavaMembership = React.lazy(
  () => import('@/components/Home/DavaMembership')
)
const QuickActions = React.lazy(() => import('@/components/Home/QuickActions'))
const MiniCarousel = React.lazy(() => import('./SponsoredLayouts/MiniBanner'))
const BuyAgainProducts = React.lazy(
  () => import('./SponsoredLayouts/BuyAgainProducts')
)

interface LayoutItem {
  name?: string
  type?: string
  section?: React.ComponentType<any> | (() => JSX.Element) | JSX.Element
  [key: string]: any
}

interface Props {
  isForCampaign?: boolean
}

const keyFor = (layout: LayoutItem | undefined, idx: number, suffix = '') =>
  `${layout?.type ?? layout?.name ?? 'layout'}-${idx}${suffix ? `-${suffix}` : ''}`

const componentMap: Record<
  string,
  React.LazyExoticComponent<React.ComponentType<any>>
> = {
  carousel: CarouselLayout,
  'carousel-mini': MiniCarousel,
  image: FullBanner,
  'featured-products': ProductsLayout,
  'featured-categories': CollectionLayout,
  'davaone-membership': DavaMembership,
  'generic-medicine-info': GenericAbout,
  'buy-again': BuyAgainProducts
}

const fallbackMap: Record<string, JSX.Element> = {
  carousel: <CarouselLoader />,
  'carousel-mini': <CarouselLoader />,
  image: <FullBannerLoader />,
  'featured-products': <ProductLoader />,
  'featured-categories': <CategoriesLoader />,
  'buy-again': <ProductLoader />
}

const SponsoredLayout: FC<Props> = ({ isForCampaign = false }) => {
  const { data: layoutsRaw, isLoading } = useFetchSponsoredSettings() as {
    data?: LayoutItem[]
    isLoading: boolean
  }

  const loaders = useMemo(
    () => [
      <ProductLoader key='loader-products' />,
      <CategoriesLoader key='loader-categories' />,
      <CarouselLoader key='loader-carousel' />,
      <FullBannerLoader key='loader-fullbanner' />
    ],
    []
  )

  const layouts = useMemo(() => {
    const base: LayoutItem[] = Array.isArray(layoutsRaw) ? [...layoutsRaw] : []

    const withQuick = [...base]
    withQuick.splice(1, 0, {
      name: 'quickActions',
      section: () => <QuickActions />
    })

    withQuick.push({
      name: 'buyAgain',
      type: 'buy-again',
      section: () => <BuyAgainProducts />
    })

    return withQuick
  }, [layoutsRaw])

  const renderLayout = (layout: LayoutItem, idx: number) => {
    const { type } = layout

    const hideInCampaign = (t?: string) =>
      Boolean(
        isForCampaign &&
          (t === 'image' ||
            t === 'featured-products' ||
            t === 'featured-categories' ||
            t === 'buy-again' ||
            t === 'davaone-membership')
      )

    if (hideInCampaign(type)) {
      return <div key={keyFor(layout, idx, 'hidden')} />
    }

    if (type && componentMap[type]) {
      const LazyComp = componentMap[type]
      const fallback = fallbackMap[type] ?? <div style={{ minHeight: 80 }} />
      return (
        <Suspense key={keyFor(layout, idx)} fallback={fallback}>
          <LazyComp layout={layout} />
        </Suspense>
      )
    }

    if (layout.section) {
      const section = layout.section
      if (React.isValidElement(section)) {
        return <div key={keyFor(layout, idx)}>{section}</div>
      }

      if (typeof section === 'function') {
        const SectionComponent = section as React.ComponentType<any>
        // Attempt to match a lazy component to provide a loader if possible
        const name =
          (SectionComponent as any)?.displayName ||
          (SectionComponent as any)?.name
        const lazyMatchKey = Object.keys(componentMap).find(k => {
          const comp = componentMap[k] as any
          return comp?.displayName === name || comp?.name === name
        })

        if (lazyMatchKey && componentMap[lazyMatchKey]) {
          const LazyMatch = componentMap[lazyMatchKey]
          const fallback = fallbackMap[lazyMatchKey] ?? (
            <div style={{ minHeight: 80 }} />
          )
          return (
            <Suspense key={keyFor(layout, idx)} fallback={fallback}>
              <LazyMatch layout={layout} />
            </Suspense>
          )
        }

        return <SectionComponent key={keyFor(layout, idx)} />
      }
    }

    return <div key={keyFor(layout, idx, 'empty')}></div>
  }

  return (
    <div className='relative mx-auto max-w-screen-2xl space-y-6 px-3 py-6 md:px-6'>
      {isLoading && (!layoutsRaw || layoutsRaw?.length === 0) ? (
        <>{loaders.map(l => l)}</>
      ) : (
        <>{layouts.map((layout, idx) => renderLayout(layout, idx))}</>
      )}
    </div>
  )
}

export default SponsoredLayout
