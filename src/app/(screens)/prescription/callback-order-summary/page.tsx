import type { Metadata } from 'next'
import ClientCallbackOrderSummary from '@/app/(screens)/prescription/callback-order-summary/ClientCallbackOrderSummary'

export const metadata: Metadata = {
  title: 'Order Confirmation | Dava India',
  description: 'Dava India Ecommerce app'
}

export default function CallbackOrderSummaryPage() {
  return <ClientCallbackOrderSummary />
}
