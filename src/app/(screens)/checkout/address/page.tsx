import type { Metadata } from 'next'

// import Address from '@/components/Checkout/pages/Address'
import dynamic from 'next/dynamic'

const AddressComponent = dynamic(
  () => import('@/components/Checkout/pages/Address')
)

export const metadata: Metadata = {
  title: 'Dava India | My Address',
  description: 'Dava India Ecommerce app'
}

export default function MyAddress() {
  return (
    <div>
      <AddressComponent />
    </div>
  )
}
