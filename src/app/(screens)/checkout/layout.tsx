import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'
import CheckoutHeader from '@/components/Checkout/Header'
import ScrollToTop from '@/components/ScrollToTop'
import LastMinuteBuy from '@/components/Checkout/LastMinuteBuy'
// import TaxChangeNotice from '@/components/Notices/TaxChange'
// import MembershipBanner from '@/components/Checkout/DavaCoinBanner'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dava India | Checkout',
  description: 'Dava India Ecommerce app'
}

export default async function MainLayout({ children }: RootLayoutProps) {
  return (
    <div className='relative min-h-[calc(100vh-84px)]'>
      {/* <TaxChangeNotice /> */}
      <AppBar />
      <CheckoutHeader />

      {/* <div className='mx-auto pt-3'>
        <MembershipBanner />
      </div> */}

      <div>{children}</div>

      <div>
        <LastMinuteBuy />
      </div>

      <div className='fixed bottom-20 right-4 z-50'>
        <ScrollToTop />
      </div>
    </div>
  )
}
