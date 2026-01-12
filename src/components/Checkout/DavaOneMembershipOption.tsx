import Image from 'next/image'
import React from 'react'
import { Checkbox } from '../ui/checkbox'
import useCheckoutStore from '@/store/useCheckoutStore'
import useUserDetailsStore from '@/store/useUserDetailsStore'
import { IndianRupeeIcon } from 'lucide-react'

export default function DavaOneMembershipOption() {
  const {
    isDavaOneMembershipAdded,
    toggleApplyDavaOneMembership,
    isOrderConfirmed,
    checkoutCopy
  } = useCheckoutStore(state => state)
  const { davaoneMembership } = useUserDetailsStore(state => state)

  if (
    (davaoneMembership && davaoneMembership?.status === 'active') ||
    (isOrderConfirmed && !checkoutCopy?.isDavaOneMembershipAdded)
  )
    return <></>

  return (
    <div className='border-b bg-white p-3'>
      <div className='flex items-center gap-4'>
        {!isOrderConfirmed && (
          <div className='mt-1'>
            <Checkbox
              checked={isDavaOneMembershipAdded}
              onCheckedChange={(checked: boolean) =>
                toggleApplyDavaOneMembership(checked, checked ? 149 : 0)
              }
            />
          </div>
        )}

        {isOrderConfirmed && checkoutCopy?.isDavaOneMembershipAdded && (
          <div className='flex items-center gap-2'>
            <h1 className='font-bold text-primary-green'>Yayy!</h1>
            <p className='text-sm'>you have purchased</p>
          </div>
        )}

        <div className='flex w-full items-center justify-between'>
          <div>
            <h1 className='flex text-lg font-normal text-[#107649]'>
              <div className='relative mb-1 h-6 w-14'>
                <Image
                  src={'/images/membership/DavaONELogo.svg'}
                  alt='Membership crown'
                  className=''
                  fill
                />
              </div>
              <span className='mt-1 pl-1 text-base font-medium'>
                {' '}
                Membership
              </span>
            </h1>
          </div>

          <div>
            <div className='flex items-center justify-center pr-10 text-right text-sm'>
              <IndianRupeeIcon size={12} />
              <span>99.00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
