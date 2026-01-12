'use client'
import { useTranslations } from 'next-intl'
import { Button } from '../ui/button'
import { useTransitionRouter } from 'next-view-transitions'
import Image from 'next/image'

export default function EmptyCart() {
  const router = useTransitionRouter()
  const cart = useTranslations('Cart')
  return (
    <div className='rounded-lg bg-white p-4 dark:bg-gray-900 md:p-6'>
      <div className='flex flex-col items-center gap-6 py-20'>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <Image
            src={`/images/EmptyCart.svg`}
            alt='Footer Logo'
            fill
            priority={false}
          />
        </div>
        <span className='text-xl font-semibold'>
          {cart('your_cart_is_empty')}
        </span>
        <Button type='button' onClick={() => router.push('/')}>
          {cart('add_products')}
        </Button>
      </div>
    </div>
  )
}
