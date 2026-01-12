'use client'

// import { Button } from '../ui/button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export default function DavaMembership() {
  const membership = useTranslations('HomePageMembership')
  const router = useRouter()
  const membershipOptions = [
    {
      name: 'Free Delivery',
      description: '25 free delivery above order 299',
      image: '/images/Home/DavaMembership/free-shipping.svg',
      i18nKey: 'free_delivery',
      i18nDescKey: 'free_delivery_description'
    },
    {
      name: 'Dava Coin',
      description: 'Earn upto 20% on your purchase value',
      image: '/images/Home/DavaMembership/coin.svg',
      i18nKey: 'dava_coin',
      i18nDescKey: 'dava_coin_description'
    },
    // {
    //   name: 'Discount',
    //   description: 'Discount upto 5%',
    //   image: '/images/Home/DavaMembership/discount.svg',
    //   i18nKey: 'discount',
    //   i18nDescKey: 'discount_description'
    // },
    {
      name: 'Premium Support',
      description: 'No waiting in call center',
      image: '/images/Home/DavaMembership/support.svg',
      i18nKey: 'premium_support',
      i18nDescKey: 'premium_support_description'
    }
    // {
    //   name: 'Exclusive Deals',
    //   description: 'On all categories',
    //   image: '/images/Home/DavaMembership/hot-sale.svg',
    //   i18nKey: 'exclusive_deals',
    //   i18nDescKey: 'exclusive_deals_description'
    // },
    // {
    //   name: 'e-Consultation',
    //   description: 'Six Complementary consultation with doctor',
    //   image: '/images/Home/DavaMembership/doctor.svg',
    //   i18nKey: 'consultation',
    //   i18nDescKey: 'consultation_description'
    // }
  ]
  return (
    <div
      className='relative cursor-pointer rounded-3xl bg-gradient-to-b p-8 md:p-14'
      style={{
        background: 'linear-gradient(to bottom, #FFCCC0, #D62900)'
      }}
      onClick={() => router.push('/me/membership')}
    >
      <div
        className='absolute left-0 top-0 h-full w-full rounded-xl'
        style={{
          backgroundImage: `url('/images/membership/DavaMembership.svg')`,
          backgroundColor: 'transparent',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      <div className='relative pb-4'>
        <div className='relative flex items-center justify-center'>
          <p className='flex items-center justify-center gap-3 rounded-3xl bg-white bg-opacity-40 px-4 pb-4 pt-3 text-2xl font-semibold text-[#107649]'>
            <img
              src='/images/membership/DavaONELogo.svg'
              alt='DavaOne'
              className='w-20'
            />
            <div className='mt-2 text-2xl'> {membership('membership')}</div>
          </p>
        </div>
      </div>
      <div className='absolute right-6 top-8 flex items-center gap-4 text-lg font-semibold text-[#107649] md:text-xl'>
        {membership('dava_one_description')}
      </div>
      <div className='px-6 py-6 md:px-8 md:py-8'>
        <div className='flex flex-col gap-6 md:flex-row md:items-stretch md:justify-between'>
          {membershipOptions.map((item, idx) => (
            <div className='min-w-[260px] max-w-md flex-1' key={idx}>
              <div className='flex h-full w-full cursor-pointer flex-col items-center gap-5 rounded-3xl bg-white px-8 py-8 shadow-2xl'>
                <div className='rounded-full bg-[#F7F7F8] p-6'>
                  <div
                    key={idx}
                    style={{
                      position: 'relative',
                      width: '80px',
                      height: '80px'
                    }}
                  >
                    <Image src={item.image} alt='Benefit Icon' fill />
                  </div>
                </div>

                <span className='text-center text-lg font-semibold text-gray-800 md:text-xl'>
                  {membership(item.i18nKey)}
                </span>
                <span className='text-center text-base text-gray-600'>
                  {membership(item.i18nDescKey)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className='absolute bottom-1 right-4 text-[8px] text-white'>
        {membership('t_c_applied')}
      </div>
    </div>
  )
}
