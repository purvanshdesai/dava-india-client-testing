'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useFetchProducts } from '@/utils/hooks/productHooks'
import ProductCard from './ProductCard'
import { useSearchParams, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import ProductLoader from '../Loader/ProductsLoader'
import useCommonStore from '@/store/useCommonStore'
import Category from '../ProductsFilter/Category'
import PriceRangeFilter from '../ProductsFilter/PriceRangeFilter'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { ChevronDown, ChevronRightIcon } from 'lucide-react'
import { useDebouncedValue } from '@/hooks/useDebounce'
import ProductsCustomPagination from '../ProductsCustomPagination'
import { useTranslations } from 'next-intl'
import DownloadAppSection from './ProductView/DownloadApp'
import { trackCategoryBrowsed } from '@/analytics/trackers/appEventTracker'
import { useSession } from 'next-auth/react'

export default function ProductList() {
  const searchParams = useSearchParams()
  const params = useParams()
  const categorySlug: string[] | any = params?.slug
  const [page, setPage] = useState<number>(1)
  const [totalResults, setTotalResults] = useState<number>(0)
  const common = useTranslations('Common')
  const productTranslation = useTranslations('Product')
  const homepage = useTranslations('HomePage')
  const hasTracked = useRef(false)
  const { data: session } = useSession()

  // const category: string = searchParams.get('category') as string
  const sponsored: string = searchParams.get('sponsored') as string
  const [sortOrder, setSortOrder] = useState<any>('none')
  const [debounceTimeOut, setDebounceTimeout] = useState<number>(0)

  const [filterPayload, setFilterPayload] = useState<any>({
    filter: {
      price: {
        from: 0,
        to: 1000
      },
      discount: {
        from: 0,
        to: 1000
      },
      sortBy: ''
    }
  })
  const { debouncedValue: debouncedFilter } = useDebouncedValue(
    filterPayload,
    debounceTimeOut
  )

  const {
    data: products,
    isLoading,
    isError
  } = useFetchProducts({
    categorySlug,
    sponsored,
    filter: debouncedFilter?.filter ?? {},
    page
  })
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }

  const setAppBarSearchStatus = useCommonStore(
    state => state.setAppBarSearchStatus
  )
  const appBarSearch = useCommonStore(state => state.showAppBarSearch)

  // Function to update the selected price range
  const filterBySelectedPriceRange = (priceRange: {
    from: number
    to: number
  }) => {
    setFilterPayload((prevState: any) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        price: {
          from: priceRange.from,
          to: priceRange.to
        }
      }
    }))
  }

  // Function to update the selected discount range
  const filterBySelectedDiscountRange = (discountRange: {
    from: number
    to: number
  }) => {
    setFilterPayload((prevState: any) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        discount: {
          from: discountRange.from,
          to: discountRange.to
        }
      }
    }))
  }

  const sortBy = () => {
    setFilterPayload((prevState: any) => ({
      ...prevState,
      filter: {
        ...prevState.filter,
        sortBy: sortOrder
      }
    }))
  }

  const keyLabel = (key: any) => {
    switch (key) {
      case 'price-asc':
        return 'Low to high'
      case 'price-desc':
        return 'High to low'
      case 'discount':
        return 'Discount'

      default:
        return 'None'
    }
  }

  useEffect(() => {
    setAppBarSearchStatus(true)
  }, [appBarSearch !== true])

  useEffect(() => {
    sortBy()
  }, [sortOrder])

  useEffect(() => {
    setTimeout(() => setDebounceTimeout(1000), 1000)
  }, [])
  useEffect(() => {
    if (products) {
      setTotalResults(products.total)

      if (hasTracked.current || !categorySlug) return

      trackCategoryBrowsed({
        userId: session?.user?.id ?? '',
        categoryName: (categorySlug ?? []).join(', ')
      })

      hasTracked.current = true
    }
  }, [products])

  // const slugToString = (slug: string) => {
  //   return slug
  //     .replace(/-/g, ' ') // Replace hyphens with spaces
  //     .replace(/\b\w/g, char => char.toUpperCase()) // Capitalize the first letter of each word
  // }

  const pathBreadcrumb = () => {
    return (
      <div className='flex items-center gap-1 pl-3 text-sm font-medium text-label md:pl-6'>
        <Link
          className={'cursor-pointer font-semibold text-primary'}
          href={'/'}
        >
          {homepage('home_button')}
        </Link>{' '}
        <span>
          <ChevronRightIcon size={16} />
        </span>
        {categorySlug
          ?.slice(0, categorySlug.length - 1)
          ?.map((s: string, idx: number) => {
            const path =
              idx == 0
                ? s
                : idx == 1
                  ? `${categorySlug[0]}/${s}`
                  : idx == 2
                    ? `${categorySlug[0]}/${categorySlug[1]}/${s}`
                    : ''
            return (
              <div className='flex items-center gap-1' key={idx}>
                <Link
                  className={
                    'cursor-pointer font-semibold capitalize text-primary'
                  }
                  href={`/categories/${path}`}
                >
                  {s?.replaceAll('-', ' ')}
                </Link>

                <span>
                  <ChevronRightIcon size={16} />
                </span>
              </div>
            )
          })}
        <span className='capitalize'>
          {categorySlug &&
            categorySlug[categorySlug.length - 1]?.replaceAll('-', ' ')}
        </span>
      </div>
    )
  }
  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    scrollToTop()
  }

  if (isError) {
    return <div>Something went wrong</div>
  }

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='pl-3'>
        <div className='grid grid-cols-[250px_1fr]'>
          <div className='mb-5 w-[100%]'>
            {/* <p className='ml-2 text-sm'>
              Showing{' '}
              <span className='font-semibold'>{products?.data?.length}</span>{' '}
              out of <span className='font-semibold'>{products?.total}</span>{' '}
              items
            </p> */}
            <div className=''>
              <div className='w-full'>
                <Category />
              </div>
            </div>
            <div>
              <PriceRangeFilter
                price={filterBySelectedPriceRange}
                discount={filterBySelectedDiscountRange}
              />
            </div>
          </div>
          <div className='w-full'>
            <div className='flex w-full items-center justify-between py-4 pr-4'>
              <div>{categorySlug && pathBreadcrumb()}</div>

              <div className='flex flex-row items-center justify-center gap-3'>
                <p className='text-xs font-semibold'>{common('sort_by')}:</p>
                <div className='flex cursor-pointer items-center gap-2 rounded-full text-sm'>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <div className='flex w-auto flex-row items-center justify-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs'>
                        <span>{keyLabel(sortOrder)}</span>
                        <div>
                          <ChevronDown size={18} />
                        </div>
                      </div>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      className='z-[10000]'
                      align='end'
                      forceMount
                    >
                      <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => setSortOrder('price-asc')}
                      >
                        {common('sort_low_high')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => setSortOrder('price-desc')}
                      >
                        {common('sort_high_low')}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className='cursor-pointer'
                        onClick={() => setSortOrder('discount')}
                      >
                        {common('discount')}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>

            {isLoading ? (
              <div className='md:px-6 md:pb-6'>
                <ProductLoader />
              </div>
            ) : products?.data?.length === 0 ? (
              <div className='flex h-[500px] items-center justify-center'>
                <div className='flex flex-col items-center gap-6'>
                  <div
                    style={{
                      position: 'relative',
                      width: '150px',
                      height: '150px'
                    }}
                  >
                    <Image
                      src={`/images/EmptyProducts.svg`}
                      alt='Empty Products'
                      fill
                      priority={false}
                    />
                  </div>

                  <p className='text-center text-sm font-semibold'>
                    {productTranslation('product-unavailable_now')}
                  </p>
                </div>
              </div>
            ) : (
              <div className='min-h-[600px]'>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-3 md:grid-cols-5 md:px-6 md:pb-6 2xl:grid-cols-5'>
                  {products?.data?.map((product: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className='fade-in-up animate-delay-100 h-full opacity-0'
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <ProductCard index={index} product={product} />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
            <div className='mb-10'>
              <ProductsCustomPagination
                currentPage={page}
                totalResults={totalResults}
                resultsPerPage={20}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
        <div className='my-3'>
          <DownloadAppSection />
        </div>
      </div>
    </div>
  )
}
