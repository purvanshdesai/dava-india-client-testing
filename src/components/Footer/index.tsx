'use client'
import {
  Facebook,
  Instagram,
  Linkedin,
  MailIcon,
  PhoneCall,
  PhoneIcon,
  Youtube
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useTransitionRouter } from 'next-view-transitions'
import Image from 'next/image'
import Link from 'next/link'

const socials = [
  {
    link: 'https://www.facebook.com/davaindiameds',
    title: 'Facebook',
    icon: Facebook
  },
  {
    link: 'https://www.instagram.com/davaindiagenericpharmacy/',
    title: 'Instagram',
    icon: Instagram
  },
  {
    link: 'https://www.youtube.com/@davaindia6203',
    title: 'Youtube',
    icon: Youtube
  },
  {
    link: 'https://x.com/i/flow/login?redirect_after_login=%2Fdavaindiameds',
    title: 'X',
    icon: '/images/twitterx.svg'
  },
  {
    link: 'https://www.linkedin.com/company/davaindia-generic-pharmacy/posts/?feedV',
    title: 'Linkedin',
    icon: Linkedin
  }
]

const recognitions = ['NABL', 'WHO', 'FDA']
const finance = ['Rupay', 'GPay', 'Visa', 'PhonePe', 'Paytm']

export default function Footer() {
  const footerTranslation = useTranslations('Footer')
  const commonTranslation = useTranslations('Common')
  const router = useTransitionRouter()

  const companyLinks = [
    {
      title: footerTranslation('about_davaindia'),
      path: 'https://www.davaindia.com/about-us'
    },
    // {
    //   title: footerTranslation('our_products'),
    //   path: 'https://www.davaindia.com/#our-product'
    // },
    {
      title: footerTranslation('customer_speaks'),
      path: 'https://www.davaindia.com/about-us/#testimonial'
    },
    {
      title: footerTranslation('career'),
      path: 'https://www.davaindia.com/about-us/career'
    },
    {
      title: footerTranslation('contact'),
      path: '/contact-us',
      internal: true
    }
  ]
  const ourPolicesLinks = [
    {
      title: footerTranslation('terms_and_conditions'),
      path: '/policies/terms_conditions'
    },
    {
      title: footerTranslation('privacy_policy'),
      path: '/policies/privacy_policy'
    },
    {
      title: footerTranslation('grievance_redressal_policy'),
      path: '/policies/grievance_redressal'
    },
    {
      title: footerTranslation('shipping_and_delivery_policy'),
      path: '/policies/shipping_delivery'
    },
    {
      title: footerTranslation('return_refund_cancellation_policy'),
      path: '/policies/return_refund'
    },

    {
      title: footerTranslation('ip_policy'),
      path: '/policies/ip_policy'
    }
  ]

  const investorRelationLinks = [
    {
      title: 'Announcement',
      path: 'https://www.zotahealthcare.com/investorrelations/'
    }
  ]
  //   const shoppingLinks = [
  //     { title: footerTranslation('health_articles'), path: '' },
  //     { title: footerTranslation('offers_and_coupons'), path: '' },
  //     { title: footerTranslation('faqs'), path: '' }
  //   ]

  return (
    <div className='bg-white dark:bg-gray-900'>
      <div
        className='flex h-[50px] w-full items-center justify-evenly bg-gradient-to-b font-medium text-white'
        style={{
          background: 'linear-gradient(to bottom, #2DA771,#2A8D61)'
        }}
      >
        <div className='relative h-[50px] w-[300px]'>
          <Image
            src={'/images/HoneycombLeft.svg'}
            alt='left honeycomb'
            className='opacity-50'
            fill
          />
        </div>

        <p className='px-3'>{footerTranslation('largest_pharmacy_chain')}</p>

        <div className='relative h-[50px] w-[300px]'>
          <Image
            src={'/images/HoneycombLeft.svg'}
            alt='right honeycomb'
            className='rotate-180 scale-x-[-1] transform opacity-50'
            fill
          />
        </div>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-6'>
        <div className='p-4 md:p-6'>
          <div className='space-y-4'>
            <div
              style={{ position: 'relative', width: '180px', height: '60px' }}
            >
              <Image
                src={'/images/Logo.svg'}
                alt='Footer Logo'
                fill
                priority={false}
              />
            </div>
            <div className='flex cursor-pointer items-center gap-3 text-sm'>
              <PhoneCall size={20} />
              <span
                onClick={() => (window.location.href = 'tel:+918471009009')}
              >
                +91 847 100 9009
              </span>
            </div>

            <div className='flex items-center gap-2'>
              {socials.map((p: any, idx: number) => {
                const Icon = p.icon
                return (
                  <button
                    key={idx}
                    onClick={() => window.open(p.link, '_blank')}
                    className='rounded-full border border-gray-300 p-1.5 text-slate-900 hover:bg-primary hover:text-white dark:border-gray-600 dark:text-white'
                  >
                    {/* <Icon size={20} /> */}
                    {typeof Icon === 'string' ? (
                      // <Image
                      //   src={Icon}
                      //   alt={`${p.title} icon`}
                      //   width={20}
                      //   height={20}
                      // />
                      <div
                        style={{
                          position: 'relative',
                          width: '20px',
                          height: '20px'
                        }}
                      >
                        <Image
                          src={Icon}
                          alt={`${p.title} icon`}
                          fill
                          priority={false}
                        />
                      </div>
                    ) : (
                      <Icon size={20} />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
        <div className='p-4 md:p-6'>
          <div>
            <p className='font-semibold'>{commonTranslation('company')}</p>
            <div className='space-y-3 pt-3 text-sm'>
              {companyLinks.map((cl: any, idx: number) => {
                return (
                  <p
                    key={idx}
                    onClick={() => {
                      if (cl?.internal) router.push(cl.path)
                      else window.open(cl.path, '_blank')
                    }}
                    className='cursor-pointer hover:text-primary'
                  >
                    {cl.title}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
        <div className='p-4 md:p-6'>
          <div>
            <p className='font-semibold'>{commonTranslation('our_policies')}</p>
            <div className='space-y-3 pt-3 text-sm'>
              {ourPolicesLinks.map((cl: any, idx: number) => {
                return (
                  <p
                    key={idx}
                    className='cursor-pointer hover:text-primary'
                    onClick={() => router.push(cl?.path)}
                  >
                    {cl.title}
                  </p>
                )
              })}
            </div>
          </div>
          {/* <div>
            <p className='font-semibold'>{commonTranslation('shopping')}</p>
            <div className='space-y-3 pt-6 text-sm'>
              {shoppingLinks.map((cl: any, idx: number) => {
                return (
                  <p key={idx} className='cursor-pointer hover:text-primary'>
                    {cl.title}
                  </p>
                )
              })}
            </div>
          </div> */}
        </div>
        <div className='p-4 md:p-6'>
          <div className='space-y-6'>
            {/* <div>
              <p className='pb-2 text-sm font-semibold'>Registered Office :</p>

              <div className='text-xs'>
                SHOP NO. G 44 AYAPPA IND, ZOTA HOUSE, BHEDWAD, CHORYASI, Surat,
                SURAT, Gujarat, India, 394220
              </div>
              <p
                className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                onClick={() => (window.location.href = 'tel:+918471009009')}
              >
                <PhoneIcon className='text-label' size={18} />
                +91-8471 009 009
              </p>
            </div> */}

            <div>
              <p className='font-semibold'>Head Office</p>

              <div className='pt-3 text-xs'>
                Zota House, 2 & 3rd Floor,Navsari State Highway, Bhagwan Aiyappa
                Complex,Opp. GIDC, Udhna, Pandesara Ind. Estate, Surat, Gujarat
                - 394221
              </div>
              <p
                className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                onClick={() => (window.location.href = 'tel:+918471009009')}
              >
                <PhoneIcon className='text-label' size={18} />
                +91-8471 009 009
              </p>

              <p
                className='flex cursor-pointer items-center gap-2 pt-2 text-sm'
                onClick={() =>
                  window.open(
                    'https://mail.google.com/mail/?view=cm&fs=1&to=care@davaindia.com',
                    '_blank'
                  )
                }
              >
                <MailIcon className='text-label' size={18} />
                care@davaindia.com
              </p>
            </div>
          </div>
        </div>
        <div className='p-4 md:p-6'>
          <div>
            <p className='pb-2 font-semibold'>Investor Relation</p>

            <div className='space-y-3 text-sm'>
              {investorRelationLinks.map((cl: any, idx: number) => {
                return (
                  <p
                    key={idx}
                    onClick={() => {
                      if (cl?.internal) router.push(cl.path)
                      else window.open(cl.path, '_blank')
                    }}
                    className='cursor-pointer hover:text-primary'
                  >
                    {cl.title}
                  </p>
                )
              })}
            </div>
          </div>
        </div>
        <div className='p-4 md:p-6'>
          <div>
            <p className='font-semibold'>{commonTranslation('download_app')}</p>
            <div className='space-y-3 pt-6'>
              <div className='rounded-md bg-black px-4 py-2.5'>
                <Link
                  rel='noopener noreferrer'
                  target='_blank'
                  href={'https://apps.apple.com/in/app/davaindia-generic-pharmacy/id6741474883'}
                >
                  <Image src={'/images/AppStore.svg'} alt='' width={120} height={80} />
                </Link>
              </div>
              <div className='rounded-md bg-black px-4 py-2.5'>
                <Link
                  rel='noopener noreferrer'
                  target='_blank'
                  href={'https://play.google.com/store/apps/details?id=com.davaindia'}
                >
                  <Image src={'/images/PlayStore.svg'} alt='' width={120} height={80} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 items-center gap-4 p-4 md:grid-cols-2 md:p-6'>
        <div className='flex items-center justify-evenly gap-6'>
          {recognitions.map((i, idx) => {
            return (
              <div
                key={idx}
                style={{ position: 'relative', width: '80px', height: '80px' }}
              >
                <Image
                  src={`/images/recognition/${i}.svg`}
                  alt='Footer Logo'
                  fill
                  priority={false}
                />
              </div>
            )
          })}
        </div>
        <div className='mb-10 flex items-center justify-evenly gap-6 md:mb-0'>
          {finance.map((i, idx) => {
            const customStyle =
              idx === 3
                ? { width: '90px', height: '90px' }
                : { width: '60px', height: '60px' }

            return (
              <div key={idx} style={{ position: 'relative', ...customStyle }}>
                <Image
                  src={`/images/finance/${i}.svg`}
                  alt='Footer Logo'
                  fill
                  priority={false}
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className='flex w-full items-center justify-center border-t border-gray-300 py-3 text-sm text-label dark:border-gray-600'>
        <p className='px-3'>Copyright 2024 Davaindia. All rights reserved.</p>
      </div>
    </div>
  )
}
