'use client'
import React, { useEffect } from 'react'
import useCommonStore from '@/store/useCommonStore'
import { useFetchGlobalSearch } from '@/utils/hooks/searchHooks'
import { Skeleton } from '../ui/skeleton'
import { useSearchParams } from 'next/navigation'
import ProductCard from '../Products/ProductCard'
import Image from 'next/image'
import { useTranslations } from 'next-intl'

export default function ProductSearchAll() {
  const searchparams = useSearchParams()
  const searchText = searchparams.get('search') ?? ''
  const global = useTranslations('GlobalSearch')

  const setAppBarSearchStatus = useCommonStore(
    state => state.setAppBarSearchStatus
  )

  useEffect(() => {
    setAppBarSearchStatus(true)
  }, [])

  const { data: searchResult, isLoading } = useFetchGlobalSearch(searchText)

  const isSearchResultEmpty =
    searchText &&
    !isLoading &&
    !searchResult?.products?.length &&
    !searchResult?.compositions?.length

  return (
    <div>
      <div className='rounded-t-lg bg-gray-200 px-6 py-4 text-base'>
        <p>
          {global('search_for')}{' '}
          <strong className='italic'>`{searchText}`</strong>
        </p>
      </div>

      {isLoading && (
        <div className='mt-2 flex justify-center p-4 md:p-6'>
          <div className='w-full space-y-2 md:w-[80%]'>
            {Array(5)
              .fill((i: number) => i + 1)
              .map((_, idx) => {
                return (
                  <Skeleton
                    key={idx}
                    className='h-20 w-full rounded-lg bg-slate-300'
                  />
                )
              })}
          </div>
        </div>
      )}

      {!isLoading && (
        <div className='mt-2 flex justify-center'>
          <div className='w-full'>
            <div className='grid grid-cols-2 gap-4 p-2 sm:grid-cols-3 md:grid-cols-4 md:p-6 lg:grid-cols-5 xl:grid-cols-6'>
              {searchResult?.products?.map((product: any, index: number) => {
                return (
                  <div
                    key={index}
                    className='fade-in-up animate-delay-100 opacity-0'
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <ProductCard index={index} product={product} />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {isSearchResultEmpty && (
        <div className='flex flex-col items-center justify-center gap-6 py-10'>
          <div
            style={{ position: 'relative', width: '100px', height: '100px' }}
          >
            <Image
              src={`/images/NoData.svg`}
              alt='Footer Logo'
              fill
              priority={false}
            />
          </div>
          <div className='text-sm font-medium'>
            {global('search_no_result')}
          </div>
        </div>
      )}
    </div>
  )
}
