import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
// import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import ReactQueryProvider from '@/utils/providers/reactQueryProvider'
import { SessionProvider } from 'next-auth/react'
import { ViewTransitions } from 'next-view-transitions'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getLocale } from 'next-intl/server'
import CleverTapProvider from '@/components/cleverTapProvider'
import { GoogleAnalytics } from '@next/third-parties/google'

import './globals.css'
import StartUp from '@/components/StartUp'
import Script from 'next/script'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'] // Specify the weights you need
})

export const metadata: Metadata = {
  title: 'Dava India',
  description: 'Dava India Ecommerce app',
  icons: { icon: '/favicon.svg' }
}

interface RootLayoutProps {
  children: React.ReactNode
}

export default async function RootLayout({ children }: RootLayoutProps) {
  const locale = await getLocale()

  const messages = await getMessages()

  const isProduction = process.env.NEXT_PUBLIC_ENV === 'production'

  return (
    <html lang={locale} suppressHydrationWarning>
      <head>
        <GoogleAnalytics gaId='G-K42EZ349LZ' />
      </head>

      <body className={montserrat.className}>
        {isProduction && (
          <>
            {/* load FB Pixel after hydration so window is available */}
            <Script id='facebook-pixel' strategy='afterInteractive'>
              {`!function(f,b,e,v,n,t,s)
          {if(f.fbq)return;n=f.fbq=function(){n.callMethod ?
          n.callMethod.apply(n,arguments):n.queue.push(arguments)};
          if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
          n.queue=[];t=b.createElement(e);t.async=!0;
          t.src=v;s=b.getElementsByTagName(e)[0];
          s.parentNode.insertBefore(t,s)}(window, document,'script',
          'https://connect.facebook.net/en_US/fbevents.js');
          fbq('init', '781058356479667');
          fbq('track', 'PageView');`}
            </Script>

            <noscript>
              <img
                height='1'
                width='1'
                style={{ display: 'none' }}
                src='https://www.facebook.com/tr?id=781058356479667&ev=PageView&noscript=1'
              />
            </noscript>
          </>
        )}
        <>
          <SessionProvider>
            <NextIntlClientProvider messages={messages}>
              <ReactQueryProvider>
                <CleverTapProvider>
                  <ViewTransitions>
                    {/* <ThemeProvider attribute='class' disableTransitionOnChange> */}
                    <main className='bg-primary-light-blue'>{children}</main>

                    <Toaster />
                    {/* </ThemeProvider> */}
                  </ViewTransitions>
                </CleverTapProvider>
              </ReactQueryProvider>
            </NextIntlClientProvider>

            {/* Start ups */}
            <StartUp />
          </SessionProvider>

          <Script id='zoho-salesiq-init'>
            {`window.$zoho=window.$zoho || {}; $zoho.salesiq = $zoho.salesiq || { ready: function() {} };`}
          </Script>
          <Script
            id='zsiqscript'
            src='https://salesiq.zohopublic.in/widget?wc=siq70cbede45ec24a1a2be73e44491989f3bd2f7eb81e8cc9d5f7d0e127b2adcb3d'
            defer
          />
        </>
      </body>
    </html>
  )
}
