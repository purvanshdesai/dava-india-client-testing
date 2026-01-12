'use client'
// import { useTranslations } from 'next-intl'
import Image from 'next/image'
import React from 'react'
import { Button } from '../ui/button'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import dayjs from 'dayjs'
import useUserDetailsStore from '@/store/useUserDetailsStore'

const membershipOptions = [
  {
    name: 'Free Delivery',
    description: 'Free delivery (25 free delivery above order 299)',
    image: '/images/Home/DavaMembership/free-shipping.svg',
    i18nKey: 'free_delivery',
    i18nDescKey: 'free_delivery_description'
  },
  {
    name: 'Dava Coin',
    description: 'Earn upto 20% on all product MRP',
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
    description: 'Get priority support via Chat, Call & E-mail',
    image: '/images/Home/DavaMembership/support.svg',
    i18nKey: 'premium_support',
    i18nDescKey: 'premium_support_description'
  },
  {
    name: 'Exclusive Deals',
    description: 'On all categories',
    image: '/images/Home/DavaMembership/hot-sale.svg',
    i18nKey: 'exclusive_deals',
    i18nDescKey: 'exclusive_deals_description'
  },
  {
    name: 'Tele-Consultation',
    description: 'Unlimited',
    image: '/images/Home/DavaMembership/doctor.svg',
    i18nKey: 'consultation',
    i18nDescKey: 'consultation_description'
  }
]

const BeforePaidPlanDetails = () => {
  // const membership = useTranslations('HomePageMembership')
  const router = useRouter()

  return (
    <div className='flex flex-col items-center rounded-lg bg-white py-10 shadow-2xl'>
      <h1 className='mb-2 flex text-lg font-normal text-[#107649]'>
        <div className='relative mb-1 h-6 w-16'>
          <Image
            src={'/images/membership/DavaONELogo.svg'}
            alt='Membership crown'
            className=''
            fill
          />
        </div>
        <span className='mt-0.5'> Membership</span>
      </h1>
      <p className='mb-8 text-gray-600'>
        Subscribe to our membership and earn more benefits
      </p>

      <div className='flex flex-col gap-8 lg:flex-row'>
        {/* Membership Card */}
        <div className='flex min-h-[600px] w-96 flex-col justify-between rounded-3xl bg-gradient-to-b from-[#2A9063] to-[#FFFFFF] p-10 text-white shadow-2xl'>
          <div className='flex justify-between'>
            <div>
              <h2 className='text-base font-semibold'>Membership Plan</h2>
              <div className='text-base font-bold'>_____</div>
            </div>

            <div>
              <h3 className='text-2xl font-semibold'>₹99</h3>
              <p className='text-xs font-semibold'>For 6 months.</p>
            </div>
          </div>
          <div className='flex flex-grow flex-col items-center justify-center'>
            <div>
              <div
                style={{
                  position: 'relative',
                  width: '140px',
                  height: '140px'
                }}
              >
                <Image
                  src={'/images/membership/Flat.svg'}
                  alt='Footer Logo'
                  fill
                />
              </div>
            </div>
          </div>
          <div className='flex items-center justify-center'>
            <Button
              className='mt-12 w-full py-4'
              onClick={() => router.push('/me/membership/confirmation')}
            >
              Buy Membership
            </Button>
          </div>
        </div>

        {/* Benefits List */}
        <div className='w-80 rounded-xl bg-white p-6 shadow-2xl lg:w-96'>
          <ul className='flex flex-col gap-6 text-gray-700'>
            {membershipOptions.map((option, index) => (
              <li
                key={index}
                className='grid grid-cols-[50px_1fr] items-start gap-4 rounded-xl p-4'
              >
                {/* Icon */}
                <div className='relative flex h-12 w-12 items-center justify-center rounded-full bg-[#F7F7F8]'>
                  <Image
                    src={option.image}
                    alt='Benefit Icon'
                    width={32}
                    height={32}
                  />
                </div>

                {/* Text */}
                <div className='flex flex-col gap-1'>
                  <span className='text-sm font-semibold text-gray-800'>
                    {option.name}
                  </span>
                  <span className='text-xs text-gray-600'>
                    {option.description}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

const PaidPlanDetails = ({
  user,
  membership,
  davaCoinsBalance
}: {
  user: any
  membership?: any
  davaCoinsBalance: number | any
}) => {
  const benefits = [
    {
      label: 'Days',
      value: membership
        ? dayjs(membership?.expiryOn).diff(new Date(), 'days')
        : 0,
      description: 'Remaining',
      icon: '/images/membership/SandClock.svg'
    },
    {
      label: 'Dava Coin',
      value: davaCoinsBalance ?? 0,
      description: 'Earned',
      icon: '/images/Home/DavaMembership/coin.svg'
    },
    {
      label: 'Free Delivery',
      value: membership?.freeDeliveryBalance ?? 0,
      description: 'Remaining',
      icon: '/images/Home/DavaMembership/free-shipping.svg'
    },
    {
      label: 'Tele-consultation',
      description: 'Unlimited',
      icon: '/images/Home/DavaMembership/doctor.svg'
    }
  ]

  // const membershipTrans = useTranslations('HomePageMembership')
  return (
    <div className='relative flex min-h-screen flex-col items-center rounded-lg bg-white p-6 shadow-2xl'>
      <div
        className='absolute left-0 top-0 h-full w-full rounded-lg'
        style={{
          backgroundImage: `url('/images/membership/DavaHoneyCombBg.svg')`,
          backgroundColor: 'transparent',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
          zIndex: 0
        }}
      />
      {/* Header Section */}
      <div className='z-10 flex flex-col items-center justify-center text-center'>
        <h1 className='mb-2 flex text-lg font-normal text-[#107649]'>
          <div className='relative mb-1 h-6 w-16'>
            <Image
              src={'/images/membership/DavaONELogo.svg'}
              alt='Membership crown'
              className=''
              fill
            />
          </div>
          <span className='mt-0.5'> Membership</span>
        </h1>
        <div className='mt-2 flex items-end justify-center'>
          <div className='relative mb-1 h-16 w-16'>
            <Image
              src={'/images/membership/DavaCrown.svg'}
              alt='Membership crown'
              className=''
              fill
            />
          </div>
          <div className='flex flex-col items-start gap-1'>
            <p className='text-sm font-medium'>{user?.name}</p>
            <p className='text-sm text-gray-500'>
              membership purchased at{' '}
              <strong>
                {membership
                  ? dayjs(membership?.createdAt).format('DD MMM YYYY')
                  : ''}
              </strong>
            </p>
          </div>
        </div>
      </div>

      {/* Remaining Benefits Section */}
      <div className='z-10 my-8 grid w-full max-w-lg grid-cols-2 gap-6'>
        {benefits.map((item, index) => (
          <div
            key={index}
            className='flex flex-col gap-4 rounded-lg bg-white p-4'
            style={{ boxShadow: '0 0 14px rgba(0,0,0,0.12)' }}
          >
            <div className='flex items-center gap-2 text-xs font-semibold'>
              <div
                key={index}
                style={{
                  position: 'relative',
                  width: '35px',
                  height: '35px'
                }}
              >
                <Image src={item.icon} alt='Footer Logo' fill />
              </div>
              {item.label}
            </div>
            <div className='flex flex-col gap-1'>
              <h2 className='mt-2 text-2xl font-bold'>{item.value}</h2>
              <p
                className={`text-sm ${
                  item.description === 'Unlimited' ? 'mt-8' : ''
                }`}
              >
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className='z-10 flex flex-col items-center'>
        <h3 className='mb-4 text-base font-semibold'>Your Benefits</h3>
        <div className='flex items-center justify-center'>
          <div
            className='w-full max-w-3xl rounded-lg bg-white p-6 md:max-w-4xl'
            style={{ boxShadow: '0 0 14px rgba(0,0,0,0.12)' }}
          >
            <div className='grid min-h-[280px] grid-cols-2 items-start justify-items-start gap-8'>
              {membershipOptions.map((option, index) => (
                <div
                  key={index}
                  className={`flex w-full items-center gap-4 ${index === membershipOptions.length - 1 ? 'col-span-2 justify-self-center' : ''}`}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: '35px',
                      height: '35px'
                    }}
                  >
                    <Image src={option.image} alt='Footer Logo' fill />
                  </div>
                  <div className='flex flex-col gap-1'>
                    <span className='text-xs font-bold'>{option.name}</span>
                    <span className='text-xs'>{option.description}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PlanDetails = () => {
  const { data: session } = useSession() as any
  const { davaoneMembership, davaCoinsBalance } = useUserDetailsStore(
    state => state
  )
  return (
    <div className='flex min-h-[calc(101vh-90px)] flex-col pb-16'>
      {davaoneMembership && davaoneMembership?.status === 'active' ? (
        <PaidPlanDetails
          user={session?.user}
          membership={davaoneMembership}
          davaCoinsBalance={davaCoinsBalance}
        />
      ) : (
        <BeforePaidPlanDetails />
      )}
    </div>
  )
}
export default PlanDetails
