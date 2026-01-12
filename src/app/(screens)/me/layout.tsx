import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'
import InnerSideBar from '@/components/InnerSideBar'
import ScrollToTop from '@/components/ScrollToTop'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dava India | User',
  description: 'Dava India Ecommerce app'
}

export default async function UserLayout({ children }: RootLayoutProps) {
  return (
    <div className='relative'>
      <AppBar />

      <div
        className='grid gap-3 md:grid-cols-[275px_1fr] md:p-12'
        style={{
          minHeight: 'calc(100vh - 84px)'
        }}
      >
        <div className='hidden md:block'>
          <InnerSideBar />
        </div>
        <div className=''>{children}</div>
      </div>
      <div className='fixed bottom-20 right-4 z-50'>
        <ScrollToTop />
      </div>
    </div>
  )
}
