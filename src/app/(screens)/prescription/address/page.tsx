import type { Metadata } from 'next'
import UploadPrescriptionAddress from '@/components/Consultations/UploadPrescriptionAddress'

export const metadata: Metadata = {
  title: 'Dava India | My Address',
  description: 'Dava India Ecommerce app'
}

export default function MyAddress() {
  return (
    <div>
      <UploadPrescriptionAddress />
    </div>
  )
}
