import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'

interface RootLayoutProps {
  children: React.ReactNode
}

export const metadata: Metadata = {
  title: 'Dava India | Prescription',
  description: 'Dava India Ecommerce app'
}

export default async function MainLayout({ children }: RootLayoutProps) {
  return (
    <div className='relative'>
      <AppBar />

      <div
        className='overflow-y-auto'
        style={{ minHeight: 'calc(100vh - 84px)' }}
      >
        <div>{children}</div>
      </div>
    </div>
  )
}
