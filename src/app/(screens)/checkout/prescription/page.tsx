import type { Metadata } from 'next'
import PrescriptionComponent from '@/components/Checkout/pages/Prescription'

export const metadata: Metadata = {
  title: 'Dava India | Prescription Upload',
  description: 'Dava India Ecommerce app'
}

export default function Prescription() {
  return (
    <div>
      <PrescriptionComponent />
    </div>
  )
}
