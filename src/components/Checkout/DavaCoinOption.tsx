'use client'

import { Info } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '@/components/ui/tooltip'
import Image from 'next/image'
import Link from 'next/link'
import useUserDetailsStore from '@/store/useUserDetailsStore'
import { Checkbox } from '../ui/checkbox'
import useCheckoutStore from '@/store/useCheckoutStore'

export default function DavaCoinOption() {
  const { davaCoinsBalance } = useUserDetailsStore(state => state)
  const { subTotal, isDavaCoinsApplied, toggleApplyDavaCoins } =
    useCheckoutStore(state => state)

  const handleApplyCoins = () => {
    if (subTotal < 199) return
    const coins = getRedeemableDavaCoins(subTotal, davaCoinsBalance ?? 0)
    toggleApplyDavaCoins(!isDavaCoinsApplied, !isDavaCoinsApplied ? coins : 0)
  }

  const getRedeemableDavaCoins = (
    totalCartPrice: number,
    davaCoinBalance: number
  ): number => {
    if (totalCartPrice < 199) {
      return 0 // below minimum cart value for redemption
    }

    let maxPercentage = 0

    if (totalCartPrice >= 199 && totalCartPrice <= 499) {
      maxPercentage = 10
    } else if (totalCartPrice >= 500 && totalCartPrice <= 999) {
      maxPercentage = 15
    } else if (totalCartPrice >= 1000) {
      maxPercentage = 20
    }

    const maxRedeemableCoins = Math.floor(
      (totalCartPrice * maxPercentage) / 100
    )

    // User can only redeem up to their balance
    return Math.min(davaCoinBalance, maxRedeemableCoins)
  }

  return (
    <TooltipProvider>
      <div className='relative mt-2 rounded-md border border-gray-300 bg-white p-4'>
        <div className='flex items-start justify-between'>
          <div className='flex items-start gap-4'>
            <Checkbox
              checked={isDavaCoinsApplied}
              onCheckedChange={() => handleApplyCoins()}
              className='mt-1 cursor-pointer accent-[#ff8900]'
              disabled={subTotal < 199 ? true : false}
            />
            <div className='flex flex-col gap-2 text-sm leading-tight'>
              <div className='flex items-center gap-1'>
                <Image
                  src='/images/dava-coin.svg'
                  alt='coin'
                  width={24}
                  height={24}
                />

                <span>
                  <span className='font-semibold text-[#ff3c3c]'>
                    Use DavaCoin{' '}
                  </span>
                  to pay
                </span>
              </div>

              <span className='text-[13px] text-gray-600'>
                <span className='font-semibold'>{davaCoinsBalance}</span> Coins
                Available
              </span>
              <Link
                href='/info/davacoin-policy'
                className='text-[13px] font-medium text-primary underline underline-offset-2'
              >
                Refer Davacoin Policy
              </Link>
            </div>
          </div>
          <Tooltip delayDuration={100}>
            <TooltipTrigger asChild>
              <span className='pointer-events-auto mt-1 inline-flex text-gray-400'>
                <Info className='h-4 w-4 cursor-pointer' />
              </span>
            </TooltipTrigger>
            <TooltipContent
              className='w-64 text-xs text-gray-700'
              side='bottom'
              sideOffset={10}
              collisionPadding={8}
            >
              A user can avail upto <span className='font-semibold'>20%</span>{' '}
              of their DavaCoin balance on an order, with a minimum cart value
              of <span className='font-semibold'>₹199</span>
              <br />
              <br />
              <ul className='list-inside list-disc space-y-2 text-black'>
                <li>
                  For cart value ₹199 - ₹499 - Up to 10% of cart value can be
                  paid using DavaCoins.
                </li>
                <li>
                  For cart value ₹500-₹999 - Up to 15% of cart value can be paid
                  using DavaCoins.
                </li>

                <li>
                  For cart value above ₹1000 - Up to 20% of cart value can be
                  paid using DavaCoins.
                </li>
              </ul>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </TooltipProvider>
  )
}
