'use client'

import Footer from '@/components/Footer'
import AppBar from '@/components/AppBar'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function DavaCoinPolicyPage() {
  const router = useRouter()
  return (
    <>
      <div className='sticky top-0 z-[15]'>
        <AppBar />
      </div>
      <div className='p-4'>
        <div className='relative mx-auto w-full max-w-5xl rounded-lg bg-white p-8 shadow'>
          {/* Back button and heading on the same row */}
          <div className='flex items-center gap-2'>
            <button
              onClick={() => router.back()}
              className='inline-flex items-center gap-2 text-sm font-medium'
            >
              <ArrowLeft className='h-7 w-10' />
            </button>
            <h1 className='text-2xl font-semibold'>DavaCoin Policy</h1>
          </div>

          <div className='mx-auto w-full max-w-3xl'>
            <div className='pt-8'>
              <div className='space-y-6 text-sm leading-6 text-gray-800'>
                <section className='space-y-2'>
                  <h2 className='text-base font-semibold'>Objective</h2>
                  <p>
                    This model ensures a customer-friendly loyalty experience.
                  </p>
                </section>

                <section className='space-y-2'>
                  <h2 className='text-base font-semibold'>Earning Rules</h2>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>
                      For orders up to ₹499 DavaCoins are credited equal to value
                      of 5% of the product MRP.
                    </li>
                    <li>
                      For orders between ₹500 and ₹999 DavaCoins are credited
                      equal to value of 10% of the product MRP.
                    </li>
                    <li>
                      For orders above ₹1000 DavaCoins are credited equal to
                      value of 20% of the product MRP.
                    </li>
                    <li>
                      Coins are credited post successful delivery and do not
                      apply to canceled or returned orders.
                    </li>
                  </ul>
                </section>

                <section className='space-y-2'>
                  <h2 className='text-base font-semibold'>Redemption Rules</h2>
                  <ul className='list-disc space-y-1 pl-5'>
                    <li>
                      For Product MRP value ₹199–₹499 – Up to 10% of the value
                      can be paid using DavaCoins.
                    </li>
                    <li>
                      For Product MRP value ₹500–₹999 – Up to 15% of the value
                      can be paid using DavaCoins.
                    </li>
                    <li>
                      For Product MRP value above ₹1000 – Up to 20% of the value
                      can be paid using DavaCoins.
                    </li>
                    <li>The minimum product MRP value for redemption is ₹199.</li>
                    <li>
                      DavaCoin discount is distributed proportionately across all
                      products in the cart.
                    </li>
                    <li>
                      If an order or product is canceled or returned, the
                      respective DavaCoins used or earned will be credited back
                      to the wallet.
                    </li>
                    <li>
                      Coins are credited automatically post successful delivery.
                    </li>
                    <li>
                      Coins earned and redeemed can be tracked in the 'Dava
                      Wallet' option under 'My Profile'.
                    </li>
                  </ul>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
