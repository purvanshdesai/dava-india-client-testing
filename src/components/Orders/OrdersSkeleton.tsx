import React from 'react'

const OrdersSkeleton = () => {
  return (
    <div className='flex-1 flex-col rounded-lg md:flex'>
      {/* Header Skeleton */}
      <div className='flex flex-col justify-between space-y-2 rounded-t-lg bg-white p-3 md:flex-row md:items-center md:px-6'>
        <div className='h-6 w-32 animate-pulse rounded bg-gray-200'></div>
        <div className='flex flex-col gap-4 md:flex-row md:items-center'>
          <div className='h-10 w-full animate-pulse rounded-full bg-gray-200 md:w-[681px]'></div>
          <div className='h-10 w-24 animate-pulse rounded-full bg-gray-200'></div>
        </div>
      </div>

      {/* Table Header Skeleton */}
      <div className='bg-white'>
        <div className='grid grid-cols-1 gap-4 bg-gray-50 p-2 md:grid-cols-[2fr_1fr_1fr]'>
          <div className='hidden h-4 w-24 animate-pulse rounded bg-gray-200 px-4 md:block'></div>
          <div className='hidden h-4 w-16 animate-pulse rounded bg-gray-200 px-4 md:block'></div>
          <div className='hidden h-4 w-12 animate-pulse rounded bg-gray-200 px-4 md:block'></div>
        </div>

        {/* Order Items Skeleton */}
        <div className='space-y-3 p-3'>
          {[1, 2, 3, 4, 5].map(index => (
            <div key={index} className='rounded-lg border border-gray-200'>
              {/* Order Header Skeleton */}
              <div className='flex items-center justify-between rounded-t-lg bg-gray-50 px-3 py-2'>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                  <div className='h-4 w-24 animate-pulse rounded bg-gray-200'></div>
                </div>
                <div className='flex items-center gap-2'>
                  <div className='h-4 w-32 animate-pulse rounded bg-gray-200'></div>
                  <div className='h-8 w-20 animate-pulse rounded bg-gray-200'></div>
                </div>
              </div>

              {/* Order Content Skeleton */}
              <div className='p-3'>
                <div className='divide-y p-2'>
                  <div className='flex flex-col bg-white p-4 md:grid md:grid-cols-[2fr_1fr_1fr]'>
                    {/* Product Details Skeleton */}
                    <div className='col-span-1 flex items-center gap-4'>
                      <div className='h-16 w-16 animate-pulse rounded-md bg-gray-200'></div>
                      <div className='flex flex-col gap-1'>
                        <div className='h-4 w-48 animate-pulse rounded bg-gray-200'></div>
                        <div className='h-3 w-32 animate-pulse rounded bg-gray-200'></div>
                        <div className='h-3 w-16 animate-pulse rounded bg-gray-200'></div>
                      </div>
                    </div>

                    {/* Status Skeleton */}
                    <div className='flex justify-between p-4 md:flex-row md:items-center'>
                      <div className='space-y-1'>
                        <div className='flex items-center gap-2'>
                          <div className='h-2 w-2 animate-pulse rounded-full bg-gray-200'></div>
                          <div className='h-4 w-20 animate-pulse rounded bg-gray-200'></div>
                        </div>
                      </div>
                      <div className='h-5 w-5 animate-pulse rounded bg-gray-200 md:hidden'></div>
                    </div>

                    {/* Actions Skeleton */}
                    <div className='flex items-center justify-end gap-3'>
                      <div className='h-8 w-16 animate-pulse rounded bg-gray-200'></div>
                      <div className='h-5 w-5 animate-pulse rounded bg-gray-200'></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className='mt-4 flex justify-center space-x-2'>
        <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 w-8 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 w-8 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 w-8 animate-pulse rounded bg-gray-200'></div>
        <div className='h-10 w-20 animate-pulse rounded bg-gray-200'></div>
      </div>
    </div>
  )
}

export default OrdersSkeleton
