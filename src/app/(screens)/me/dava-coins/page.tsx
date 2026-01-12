'use client'
import Image from 'next/image'
import { useFetchDavaCoinsHistory } from '@/utils/hooks/davaCoinsHooks'
import dayjs from 'dayjs'
import useUserDetailsStore from '@/store/useUserDetailsStore'
import { useEffect } from 'react'
import RewardsBanner from '@/components/Checkout/RewardsBanner'

export default function DavaCoinsPage() {
  const { data: coinsHistory } = useFetchDavaCoinsHistory()
  const { davaCoinsBalance, fetchUserDetails } = useUserDetailsStore(
    state => state
  )

  useEffect(() => {
    if (coinsHistory && coinsHistory?.data?.length) {
      const totalCoins = coinsHistory?.data?.reduce(
        (acc: any, c: any) => acc + c.coins,
        0
      )
      if (totalCoins !== davaCoinsBalance) fetchUserDetails()
    }
  }, [coinsHistory])

  return (
    <>
      <div className='mb-4'>
        <RewardsBanner />
      </div>
      <div className='rounded-2xl border border-[#DFE4EA] bg-white p-6 shadow-sm'>

        {/* Summary Card */}
        <div className='mb-6 flex items-center justify-between rounded-xl border border-[#DFE4EA] bg-white p-4 shadow-sm'>
          <div className='flex items-center space-x-3'>
            <Image
              src='/images/dava-multiple-coins.svg'
              alt='coin'
              width={40}
              height={40}
            />
            <span className='text-sm text-gray-700'>
              Your Dava Wallet ( 1 Coin is equivalent to the value of Rs.1 )
            </span>
          </div>
          <div className='text-right'>
            <p className='text-2xl font-bold text-gray-900'>
              {davaCoinsBalance}
            </p>
            <p className='text-xs text-gray-500'>Coins</p>
          </div>
        </div>

        {/* Coin Usage Table */}
        <h3 className='mb-2 text-sm font-medium text-gray-700'>
          Coin Usage History
        </h3>
        <div className='overflow-x-auto'>
          <table className='min-w-full border-t border-gray-200 text-sm'>
            <thead>
              <tr className='bg-gray-50 text-left font-medium text-gray-500'>
                <th className='px-4 py-2'>Date</th>
                <th className='px-4 py-2'>Description</th>
                <th className='px-4 py-2'>Order ID</th>
                <th className='px-4 py-2'>Coins Usage</th>
              </tr>
            </thead>
            <tbody>
              {(coinsHistory?.data ?? []).length > 0 ? (
                (coinsHistory.data ?? [])
                  .sort((a: any, b: any) => {
                    return (
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                    )
                  })
                  .map((item: any, idx: number) => (
                    <tr
                      key={idx}
                      className='border-t border-gray-100 hover:bg-gray-50'
                    >
                      <td className='px-4 py-2'>
                        {dayjs(item.createdAt).format('DD MMM YYYY')}
                      </td>
                      <td className='px-4 py-2'>{item.description}</td>
                      <td className='px-4 py-2'>{item.orderId ?? '-'}</td>
                      <td
                        className={`px-4 py-2 ${
                          item.usageType === 'credit'
                            ? 'text-green-500'
                            : 'text-red-500'
                        }`}
                      >
                        {item.usageType === 'credit'
                          ? `+${item.coins}`
                          : `-${item.coins}`}
                      </td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td
                    colSpan={4}
                    className='border-t py-6 text-center text-gray-500'
                  >
                    No records found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
