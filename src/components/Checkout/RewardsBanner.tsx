'use client'

import Image from 'next/image'

export default function RewardsBanner() {
  return (
    <div className='mt-0  rounded-xl bg-[#2A8F62] p-6 text-white shadow-md md:p-4'>
      <div className='grid grid-cols-1 items-center gap-4 md:grid-cols-[80px_1fr_220px]'>
        <div className='mx-auto md:mx-0'>
          <div className='relative h-16 w-16 md:h-20 md:w-20'>
            <Image src={'/images/dava-multiple-coins.svg'} alt='Coins' fill />
          </div>
        </div>
        <div className='space-y-2'>
          <p className='text-2xl font-semibold'>DavaCoin</p>
          <h3 className='text-base font-semibold'>Earn DavaCoin on Every Order!</h3>
          <ul className='space-y-1 text-xs'>
            <li>1. Spend ₹400–₹499 & get 5% cashback as DavaCoin</li>
            <li>2. Spend ₹500–₹999 & get 10% back as DavaCoin</li>
            <li>3. Spend ₹1000 or more get 20% back as DavaCoin</li>
          </ul>
        </div>
        <div className='hidden justify-end md:flex'>
          <div className="relative h-32 w-32 md:h-32 md:w-32">
  <Image
    src="/images/multi-tablets.svg"
    alt="Tablets"
    fill
    className="object-contain scale-150 -translate-x-9"
  />
</div>

        </div>
      </div>
    </div>
  )
}
