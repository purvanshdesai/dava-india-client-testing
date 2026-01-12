'use client'
import React from 'react'
import Image from 'next/image'
import { useTransitionRouter } from 'next-view-transitions'

export default function MembershipBanner() {
  const router = useTransitionRouter()
  return (
    <div className='flex justify-center'>
      <div className='w-full lg:w-3/4'>
        <div
          className='flex cursor-pointer items-center justify-between rounded-lg bg-[#1DA15F] px-6 py-3'
          onClick={() => router.push('/me/membership')}
          role='button'
          aria-label='Go to Dava One Membership'
        >
          {/* LEFT: ONE Membership Image */}
          <div className='inline-flex items-center justify-center bg-[#1DA15F] p-2'>
            <Image
              src='/images/membership-logo.svg'
              alt='Free Delivery'
              width={120}
              height={190}
            />
          </div>

          {/* CENTER: Features */}
          <div className='flex flex-1 items-center justify-between px-6'>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/free-delivery.svg'
                alt='Free Delivery'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>Free Delivery</span>
            </div>
            {/* <div className='flex items-center gap-2'>
              <Image
                src='/images/discounts.svg'
                alt='Discounts'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>Discounts</span>
            </div> */}
            <div className='flex items-center gap-2'>
              <Image
                src='/images/discounts.svg'
                alt='Dava Coins'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>Dava Coins</span>
            </div>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/premium-support.svg'
                alt='Premium Support'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>Premium Support</span>
            </div>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/exclusive-deals.svg'
                alt='Exclusive Deals'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>Exclusive Deals</span>
            </div>
            <div className='flex items-center gap-2'>
              <Image
                src='/images/free-consultation.svg'
                alt=' Unlimited free tele consultation'
                width={28}
                height={28}
              />
              <span className='text-xs text-white'>
                Unlimited tele consultation
              </span>
            </div>
          </div>

          {/* RIGHT: Price Badge */}
          <div className='flex items-center'>
            <Image
              src='/images/price-badge.svg'
              alt='Price'
              width={50}
              height={35}
              className='object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
