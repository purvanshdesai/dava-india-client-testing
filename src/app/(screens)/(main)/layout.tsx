import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'
import Footer from '@/components/Footer'
import CategoryMenu from '@/components/Home/CategoryMenu'
import ScrollToTop from '@/components/ScrollToTop'
import FloatingMenu from '@/components/FloatingMenu'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dava India | Order Online',
  description: 'Dava India Ecommerce app'
}

export default async function MainLayout({ children }: RootLayoutProps) {
  return (
    <>
      <div className='relative'>
        <div className='sticky top-0 z-[15]'>
          <AppBar />
        </div>
        <div>
          <div className='hidden md:block'>
            <CategoryMenu />
          </div>

          <div>{children}</div>

          <Footer />
        </div>
        <div>
           <FloatingMenu/>
        </div>
        <div className='fixed bottom-20 right-4 z-50'>
          <ScrollToTop />
        </div>
      </div>
    </>
  )
}
