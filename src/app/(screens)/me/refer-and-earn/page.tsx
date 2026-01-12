'use client'

import React from 'react'
import Image from 'next/image'
import { Copy } from 'lucide-react'
import { useFetchReferAndEarn } from '@/utils/hooks/useUserReferral'
import { useToast } from '@/hooks/use-toast'
import { Link } from 'next-view-transitions'

export default function ReferAndEarn() {
  const { toast } = useToast()
  const { data: referral } = useFetchReferAndEarn() as any
  const referralLink = `${window?.location?.origin}/login?ref=${referral?.referralCode ?? '...'}`

  // Copy to clipboard
  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text)

    toast({
      title: 'Link Copied!',
      description: 'Now you can share with your friends and family!'
    })
  }

  return (
    <div className='flex bg-gray-100'>
      <div className='w-full space-y-8 self-start rounded-2xl bg-white p-6 shadow-md'>
        {/* Title */}
        <h1 className='text-2xl font-bold'>Refer and Earn</h1>
        <hr />

        {/* Subtitle */}
        <p className='flex items-center gap-0.5 text-gray-700'>
          Refer davaindia app to friends and family and Earn
          <Image
            src='/images/refer-coin.png'
            alt='DavaCoin Icon'
            width={20}
            height={20}
            className='inline-block'
          />
          <span className='font-bold text-pink-600'>50 DavaCoin</span> in your
          account
        </p>

        {/* Orange Box */}
        <div
          className='relative flex flex-col justify-between gap-6 overflow-hidden rounded-xl p-6 md:flex-row md:items-center'
          style={{ backgroundColor: 'rgba(255, 245, 236, 1)' }}
        >
          {/* Left Content */}
          <div className='w-full space-y-4 md:w-2/3'>
            <p className='font-semibold'>Your Referral link & Code :</p>

            {/* Referral Link */}
            <div className='flex items-center gap-1'>
              <span className='text-sm font-medium'>Link :</span>
              <a
                href={referralLink || '#'}
                target='_blank'
                rel='noopener noreferrer'
                className='truncate text-sm text-blue-600 underline'
              >
                {referralLink || 'Loading...'}
              </a>
              <Copy
                className='h-4 w-4 cursor-pointer text-gray-600'
                onClick={() => handleCopy(referralLink)}
              />
            </div>

            {/* Code */}
            {/* <div className='flex items-center gap-2 text-sm'>
              <span className='font-medium'>Code :</span>
              <span>{referral?.referralCode || 'Loading...'}</span>
              <Copy
                className='h-4 w-4 cursor-pointer text-gray-600'
                onClick={() => handleCopy(String(referral?.referralCode || ''))}
              />
            </div> */}

            {/* Share Button */}
            <button
              className='rounded-md bg-orange-500 px-5 py-2 text-sm text-white hover:bg-orange-600'
              onClick={() =>
                navigator.share?.({
                  title: 'Davaindia Referral',
                  url: referralLink
                })
              }
            >
              🔗 Share
            </button>

            {/* Terms */}
            <p className='text-xs text-gray-600'>
              By entering into this programme, you agree and accept our{' '}
              <Link
                href='/terms-and-conditions'
                className='text-blue-600 underline'
              >
                Terms & Conditions
              </Link>
            </p>

            {/* How to Use */}
            <div className='text-sm text-gray-700'>
              <p className='mb-1 font-semibold'>How to use :</p>
              <p>
                To get{' '}
                <span className='font-semibold text-pink-600'>50 DavaCoin</span>
                , share your referral code or link with your friends and family
                and ask them to use this link to download the app. Your coin
                will be credited once your referee completes their first order.
              </p>
            </div>
          </div>

          {/* Right Image */}
          <div className='flex w-full justify-center md:w-auto md:justify-end'>
            <Image
              src='/images/refer-and-earn.svg'
              alt='Refer Visual'
              width={300}
              height={300}
              className='object-contain'
              priority
            />
          </div>
        </div>
      </div>
    </div>
  )
}
