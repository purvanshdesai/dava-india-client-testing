import React from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useTransitionRouter } from 'next-view-transitions'

import { useSession } from 'next-auth/react'

const actions = [
  {
    title: 'Order Medicine',
    description: 'Order our generic medicines',
    image: 'drugs.gif',
    href: '/products',
    i18nKey: 'home_order_medicine',
    i18nDescKey: 'order_medicine_description'
  },
  // {
  //   title: 'Consult Doctor',
  //   description: 'Consult an experienced doctor for prescription',
  //   image: 'doctor.gif',
  //   href: '/',
  //   i18nKey: 'home_consult_doctor',
  //   i18nDescKey: 'consult_doctor_description'
  // },
  {
    title: 'Previously Bought',
    description: 'Check your previously bought items',
    image: 'PrevBought.gif',
    href: '/me/orders',
    i18nKey: 'home_previously_bought',
    i18nDescKey: 'previously_bought_description'
  },
  {
    title: 'Deals For You',
    description: 'Check special deals for you',
    image: 'sale.gif',
    href: '/categories/offer-products',
    i18nKey: 'home_deals_for_you',
    i18nDescKey: 'deals_for_you_description'
  }
]

export default function QuickActions() {
  const session = useSession()
  const homepage = useTranslations('HomePage')
  const router = useTransitionRouter()

  const isLoggedIn = session.status === 'authenticated'

  const handleOnClickCard = (a: any) => {
    if (a.title == 'Consult Doctor') {
      if (!isLoggedIn) {
        router.push('/login')
        return
      }

      router.push('/eConsultation')
      return
    }
    if (a.href != '') router.push(a.href)
  }

  return (
    <div className='rounded-l-lg'>
      <div className='grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {actions.map((a, idx) => {
          return (
            <div
              onClick={() => handleOnClickCard(a)}
              key={idx}
              className='flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border border-white bg-white p-3 duration-300 hover:scale-105 hover:border-primary dark:bg-gray-900 md:p-4'
            >
              <div
                key={idx}
                style={{ position: 'relative', width: '80px', height: '80px' }}
              >
                <Image
                  src={`/images/QuickActions/${a.image}`}
                  alt={a.title}
                  fill
                  priority={false}
                  unoptimized
                />
              </div>
              <div className='space-y-1 text-center'>
                <div className='flex flex-row items-center justify-center space-x-2'>
                  <p className='text-base font-medium'>{homepage(a.i18nKey)}</p>
                  <div
                    style={{
                      position: 'relative',
                      width: '16px',
                      height: '16px'
                    }}
                  >
                    <Image
                      src={'/images/SectionRightArrow.svg'}
                      alt='Footer Logo'
                      fill
                      objectFit='contain'
                    />
                  </div>
                </div>

                <p className='text-xs text-label'>{homepage(a.i18nDescKey)}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
