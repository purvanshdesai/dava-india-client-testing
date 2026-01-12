import Image from 'next/image'
import type { Metadata } from 'next'
import AppBar from '@/components/AppBar'

export const metadata: Metadata = {
  title: 'Dava India | Sign In',
  description: 'Dava India Ecommerce app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div>
      <AppBar />

      <div
        className='flex justify-center overflow-y-auto'
        style={{ minHeight: 'calc(100vh - 80px)' }}
      >
        <div className='my-6 w-11/12 rounded-md bg-white dark:bg-slate-900 md:my-12 md:w-2/3'>
          <div className='grid grid-cols-1 items-center justify-between gap-12 p-4 md:grid-cols-2 md:gap-0 md:p-12'>
            <div className='flex w-full flex-col items-center justify-center'>
              <div>
                <Image
                  src={'/images/ProfileForm.svg'}
                  alt=''
                  width={360}
                  height={320}
                />
              </div>

              {/* <div className='pt-4 text-xl'>
                <div>
                  <span className='font-bold'>India's largest</span> private
                  generic{' '}
                </div>
                <div>pharmacy retail chain</div>
              </div> */}
            </div>
            <div className='flex items-center justify-center'>
              <div className='w-11/12'>{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
