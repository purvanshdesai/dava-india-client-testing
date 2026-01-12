import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'
import CategoryMenu from '@/components/Home/CategoryMenu'
import ScrollToTop from '@/components/ScrollToTop'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Search Products | DavaIndia',
  description: 'Dava India Ecommerce app'
}

export default async function UserLayout({ children }: RootLayoutProps) {
  return (
    <div className='relative'>
      <div className='sticky top-0 z-50'>
        <AppBar />
      </div>

      <div
        style={{
          minHeight: 'calc(100vh - 84px)'
        }}
      >
        <div className='hidden md:block'>
          <CategoryMenu />
        </div>
        <div className=''>{children}</div>
      </div>
      <div className='fixed bottom-20 right-4 z-50'>
        <ScrollToTop />
      </div>
    </div>
  )
}
