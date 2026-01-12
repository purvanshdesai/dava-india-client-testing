import type { Metadata } from 'next'
// import ConfirmationPage from '@/components/Checkout/pages/Confirmation'
import dynamic from 'next/dynamic'

const ConfirmationPageComponent = dynamic(
  () => import('@/components/Checkout/pages/Confirmation')
)

export const metadata: Metadata = {
  title: 'Order Confirmation | Dava India',
  description: 'Dava India Ecommerce app'
}

export default function Confirmation() {
  return <ConfirmationPageComponent />
}
