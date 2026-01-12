import dynamic from 'next/dynamic'
// import CartComponent from '@/components/Checkout/pages/Cart'

const CartComponent = dynamic(() => import('@/components/Checkout/pages/Cart'))

import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dava India | My Cart',
  description: 'Dava India Ecommerce app'
}

export default function Cart() {
  return (
    <div>
      <CartComponent />
    </div>
  )
}
