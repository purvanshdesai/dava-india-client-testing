import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dava India | Policy Details',
  description: 'Dava India Ecommerce app'
}

export default async function PolicyLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className='relative'>
        <div className='sticky top-0 z-[15]'>
          <AppBar />
        </div>
        <div>
          <div>{children}</div>

          <Footer />
        </div>
        <div className='fixed bottom-20 right-4 z-50'>
          <ScrollToTop />
        </div>
      </div>
    </>
  )
}
