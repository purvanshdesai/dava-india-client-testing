'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const items = [
  {
    title: 'Buy Now',
    icon: '/images/buy.svg',
    loading: false,
    action: (router: any) => {
      router.push('/prescription/upload')
    }
  },
  {
    title: 'Franchise Enquiry',
    icon: '/images/Request a Medicine.svg',
    loading: false,
    action: () => {
      window.open('https://www.davaindia.com/about-us/franchise-enquiry', '_blank')
    }
  },
  {
    title: 'Order Via WhatsApp',
    icon: '/images/Order Via WhatsApp.svg',
    loading: false,
    action: () => {
      window.open('https://wa.me/8471009009', '_blank')
    }
  },
  {
    title: 'Store Location',
    icon: '/images/Store Location.svg',
    loading: false,
    action: () => {
      window.open('https://www.davaindia.com/about-us/store-locator', '_blank')
    }
  },
  {
    title: 'Knowledge Hub',
    icon: '/images/Knowledge Hub.svg',
    loading: false,
    action: (router: any) => {
      router.push('/coming-soon')
    }
  },
  {
    title: 'About Us',
    icon: '/images/Talk to Us.svg',
    loading: false,
    action: () => {
      window.open('https://www.davaindia.com/about-us')
    }
  }
]

export default function QuickActionMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  return (
    <>
      {/* Floating Grid */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className='fixed right-20 top-48 z-[9998]'
          >
            {/* Action Buttons Grid */}
            <div className='grid w-[420px] grid-cols-3 gap-0 p-0'>
              {items.map((item, i) => (
                <div
                  key={i}
                  className='group relative flex cursor-pointer flex-col items-center justify-center border border-white/70 px-3 py-4 text-center text-xs font-semibold leading-tight text-white transition-all duration-200 hover:scale-105 hover:shadow-lg'
                  style={{
                    width: '140px', // 420px / 3 = 140px for perfect fit
                    height: '140px',
                    background:
                      'linear-gradient(180deg, rgba(125, 0, 57, 0.5) 0%, rgba(208, 0, 95, 0.5) 100%)'
                  }}
                  onClick={() => item.action(router)}
                >
                  {/* Hover Background */}
                  <div
                    className='absolute inset-0 opacity-0 transition-opacity duration-200 group-hover:opacity-100'
                    style={{
                      background:
                        'linear-gradient(180deg, #7D0039 0%, #D0005F 100%)'
                    }}
                  />

                  {/* Content */}
                  <div className='relative z-10 flex flex-col items-center'>
                    <Image
                      src={item.icon}
                      alt={item.title}
                      width={28}
                      height={28}
                      className='mb-2'
                      unoptimized
                    />
                    <span className='text-center leading-tight'>
                      {item.title}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Single Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='fixed right-2 top-80 z-[9999] rounded-full border border-white/70 bg-[#7D0037] p-4 text-white shadow-xl transition-all duration-200 hover:bg-[#7A0057] hover:shadow-2xl'
      >
        {isOpen ? (
          <X size={22} />
        ) : (
          <Image
            src='/images/main-icon.svg'
            alt='Main Menu'
            width={22}
            height={22}
            unoptimized
          />
        )}
      </button>
    </>
  )
}
